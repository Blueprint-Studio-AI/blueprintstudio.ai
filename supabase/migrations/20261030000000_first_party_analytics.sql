-- First-party analytics for blueprintstudio.ai. See docs/analytics/README.md.
--
-- Not applied by anything automatically: run it once, in the Supabase SQL
-- editor or with `supabase db push`. It only adds analytics_* tables and
-- functions; it doesn't touch the newsletter's tables.
--
-- What's here:
--   analytics_events       every event, kept 90 days
--   analytics_daily        one rollup per day, kept for good (small)
--   analytics_rolled_days  which days analytics_daily has
--   analytics_salts        today's and yesterday's random salt for visitor hashes
--   analytics_report()     what the dashboard reads: rollups, plus live rows for
--                          days not rolled up yet (today)
--   analytics_nightly()    rolls up finished days and prunes; pg_cron runs it
--
-- Only the service role (the collector and the dashboard, server side) can
-- read or write any of it: row level security is on with no policies, and the
-- public roles can't run the functions.
--
-- Days and hours are in America/New_York, like lib/analytics/server/time.ts.
-- The rollup must match lib/analytics/server/rollup.ts (the local dev store).

-- Events ---------------------------------------------------------------------

create table if not exists public.analytics_events (
    id           bigint generated always as identity primary key,
    ts           timestamptz not null default now(),
    day          date not null,          -- ts's day in America/New_York, set by the collector
    name         text not null check (char_length(name) between 1 and 40),
    path         text not null check (char_length(path) between 1 and 300),
    props        jsonb not null default '{}'::jsonb,
    visitor      text not null,          -- daily-rotating hash; can't be linked across days
    pv           text not null,          -- random id per page view; never stored on the device
    entry        boolean not null default false,  -- the page a full page load landed on
    referrer     text,                   -- bare host, null when direct
    utm_source   text,
    utm_medium   text,
    utm_campaign text,
    country      text,                   -- ISO 3166 alpha-2, from Vercel's geo header
    device       text,                   -- phone, tablet, desktop
    browser      text,                   -- family only, no version
    os           text,                   -- family only, no version
    internal     boolean not null default false   -- our own visits (?analytics=off)
);

-- The rollup reads one day at a time, by event name.
create index if not exists analytics_events_day_name_idx on public.analytics_events (day, name);
-- Live visitors read the last few minutes. Rows arrive in time order, so a BRIN
-- index is a few pages instead of a full B-tree.
create index if not exists analytics_events_ts_brin on public.analytics_events using brin (ts);

-- Rollups --------------------------------------------------------------------

create table if not exists public.analytics_daily (
    day      date not null,
    metric   text not null,
    a        text not null default '',
    b        text not null default '',
    c        text not null default '',
    n        bigint not null,
    visitors bigint not null,
    primary key (day, metric, a, b, c)
);

create table if not exists public.analytics_rolled_days (
    day       date primary key,
    rolled_at timestamptz not null default now()
);

create table if not exists public.analytics_salts (
    day  date primary key,
    salt text not null
);

alter table public.analytics_events enable row level security;
alter table public.analytics_daily enable row level security;
alter table public.analytics_rolled_days enable row level security;
alter table public.analytics_salts enable row level security;

revoke all on public.analytics_events, public.analytics_daily, public.analytics_rolled_days, public.analytics_salts from public, anon, authenticated;
grant select, insert, update, delete on public.analytics_events, public.analytics_daily, public.analytics_rolled_days, public.analytics_salts to service_role;

-- Functions ------------------------------------------------------------------

create or replace function public.analytics_today()
returns date
language sql stable
as $$ select (now() at time zone 'America/New_York')::date $$;

-- A vital rounded to two significant figures, so samples share rollup rows and
-- p75 can still be read off them (rollup.ts: bucket()).
create or replace function public.analytics_bucket(v double precision)
returns text
language sql immutable
as $$
    select case
        when v is null or v <= 0 then '0'
        else round(v::numeric, 1 - floor(log(v::numeric))::int)::float8::text
    end
$$;

-- Today's salt for visitor hashes: random, made on first use, and deleted after
-- a day, so nobody (us included) can rebuild a hash from an IP later.
create or replace function public.analytics_salt(d date)
returns text
language plpgsql
set search_path = public
as $$
declare
    s text;
begin
    delete from analytics_salts where day < d - 1;
    insert into analytics_salts (day, salt)
    values (d, replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', ''))
    on conflict (day) do nothing;
    select salt into s from analytics_salts where day = d;
    return s;
end
$$;

-- One day's rollup rows, computed from the raw events. The table of metrics
-- and their dimensions is at the top of lib/analytics/server/rollup.ts.
create or replace function public.analytics_rollup_compute(d date)
returns table (metric text, a text, b text, c text, n bigint, visitors bigint)
language sql stable
set search_path = public
as $$
    with e as (
        select * from analytics_events where day = d and not internal
    ),
    pv as (
        select * from e where name = 'pageview'
    ),
    -- Things a visitor can do after picking a hero word.
    acts as (
        select id, ts, visitor,
            case
                when name = 'section_view' and props->>'section' = 'work' then 'work'
                when name = 'project_open' then 'project'
                when name = 'cta_click' then 'cta'
                when name = 'reel_open' then 'reel'
                when name = 'booking_made' then 'booked'
                when name = 'form_submit' and props->>'ok' = 'true' then 'form'
            end as action
        from e
    ),
    per_visitor as (
        select visitor,
            bool_or(name = 'pageview') as visited,
            bool_or((name = 'section_view' and props->>'section' = 'work') or name = 'project_open') as work,
            bool_or(name in ('project_open', 'cta_click')) as engaged,
            bool_or(name = 'booking_made' or (name = 'form_submit' and props->>'ok' = 'true')) as converted
        from e
        group by visitor
    )
    select 'views', '', '', '', count(*), count(distinct visitor) from pv having count(*) > 0
    union all
    select 'hour', to_char(ts at time zone 'America/New_York', 'HH24'), '', '', count(*), count(distinct visitor) from pv group by 2
    union all
    select 'page', path, '', '', count(*), count(distinct visitor) from pv group by path
    union all
    select 'country', coalesce(country, ''), '', '', count(*), count(distinct visitor) from pv group by 2
    union all
    select 'device', coalesce(device, ''), '', '', count(*), count(distinct visitor) from pv group by 2
    union all
    select 'browser', coalesce(browser, ''), '', '', count(*), count(distinct visitor) from pv group by 2
    union all
    select 'os', coalesce(os, ''), '', '', count(*), count(distinct visitor) from pv group by 2
    union all
    select 'source', coalesce(referrer, ''), '', '', count(*), count(distinct visitor) from pv where entry group by 2
    union all
    select 'utm', utm_source, coalesce(utm_medium, ''), coalesce(utm_campaign, ''), count(*), count(distinct visitor)
    from pv where entry and utm_source is not null group by 2, 3, 4
    union all
    select 'event', name, '', '', count(*), count(distinct visitor) from e where name not in ('pageview', 'web_vital') group by name
    union all
    select 'nav', coalesce(props->>'item', ''), coalesce(props->>'menu', ''), '', count(*), count(distinct visitor)
    from e where name = 'nav_click' group by 2, 3
    union all
    select 'cta', coalesce(props->>'cta', ''), coalesce(props->>'section', ''), '', count(*), count(distinct visitor)
    from e where name = 'cta_click' group by 2, 3
    union all
    select 'hero', coalesce(props->>'variant', ''), '', '', count(*), count(distinct visitor)
    from e where name = 'hero_variant' group by 2
    union all
    -- The index zero-padded so it sorts (lpad alone would cut a third digit).
    select 'section', path, coalesce(props->>'section', ''),
        case when length(props->>'index') >= 2 then props->>'index' else lpad(coalesce(props->>'index', ''), 2, '0') end,
        count(distinct pv), count(distinct visitor)
    from e where name = 'section_view' group by 2, 3, 4
    union all
    select 'scroll', path, coalesce(props->>'percent', ''), '', count(distinct pv), count(distinct visitor)
    from e where name = 'scroll_depth' group by 2, 3
    union all
    select 'reel', case when name = 'reel_open' then 'open' else coalesce(props->>'percent', '') end, '', '', count(distinct pv), count(distinct visitor)
    from e where name in ('reel_open', 'reel_progress') group by 2
    union all
    select 'faq', coalesce(props->>'question', ''), '', '', count(*), count(distinct visitor)
    from e where name = 'faq_open' group by 2
    union all
    select 'project', coalesce(props->>'project', ''), '', '', count(*), count(distinct visitor)
    from e where name = 'project_open' group by 2
    union all
    select 'outbound', coalesce(props->>'href', ''), '', '', count(*), count(distinct visitor)
    from e where name = 'outbound_click' group by 2
    union all
    select 'form', coalesce(props->>'form', ''), coalesce(props->>'ok', ''), '', count(*), count(distinct visitor)
    from e where name = 'form_submit' group by 2, 3
    union all
    select 'funnel', s.step, '', '', count(*), count(*)
    from per_visitor v
    cross join lateral (values ('visited', v.visited), ('work', v.work), ('engaged', v.engaged), ('converted', v.converted)) s(step, hit)
    where s.hit
    group by s.step
    union all
    -- Each action goes to the last hero word the visitor picked before it.
    select 'hero_then', w.variant, x.action, '', count(*), count(distinct x.visitor)
    from acts x
    cross join lateral (
        select coalesce(h.props->>'variant', '') as variant
        from e h
        where h.name = 'hero_variant' and h.visitor = x.visitor and (h.ts, h.id) < (x.ts, x.id)
        order by h.ts desc, h.id desc
        limit 1
    ) w
    where x.action is not null
    group by 2, 3
    union all
    select 'vital', props->>'metric', path, analytics_bucket((props->>'value')::double precision), count(*), count(distinct visitor)
    from e where name = 'web_vital' and jsonb_typeof(props->'value') = 'number' group by 2, 3, 4
    union all
    select 'internal', '', '', '', count(*), count(distinct visitor)
    from analytics_events where day = d and internal and name = 'pageview' having count(*) > 0
$$;

-- Store a finished day's rollup (again, if it's already there).
create or replace function public.analytics_rollup(d date)
returns void
language plpgsql
set search_path = public
as $$
begin
    if d >= analytics_today() then
        raise exception 'analytics_rollup: % is not over yet', d;
    end if;
    delete from analytics_daily where day = d;
    insert into analytics_daily (day, metric, a, b, c, n, visitors)
    select d, r.metric, r.a, r.b, r.c, r.n, r.visitors from analytics_rollup_compute(d) r;
    insert into analytics_rolled_days (day) values (d)
    on conflict (day) do update set rolled_at = now();
end
$$;

-- What the dashboard reads: stored rollups, and rows computed on the spot for
-- days that aren't rolled up yet (today, or any day the nightly job missed).
create or replace function public.analytics_report(from_day date, to_day date)
returns table (day date, metric text, a text, b text, c text, n bigint, visitors bigint)
language sql stable
set search_path = public
as $$
    select d.day, d.metric, d.a, d.b, d.c, d.n, d.visitors
    from analytics_daily d
    where d.day between from_day and to_day
    union all
    select g.day, r.metric, r.a, r.b, r.c, r.n, r.visitors
    from (
        select gs::date as day
        from generate_series(from_day, least(to_day, from_day + 400), interval '1 day') gs
    ) g
    cross join lateral analytics_rollup_compute(g.day) r
    where not exists (select 1 from analytics_rolled_days x where x.day = g.day)
$$;

-- Visitors (not ours) with any event in the last few minutes.
create or replace function public.analytics_live(minutes int)
returns bigint
language sql stable
set search_path = public
as $$
    select count(distinct visitor)
    from analytics_events
    where ts > now() - make_interval(mins => least(greatest(minutes, 1), 60)) and not internal
$$;

-- Nightly: roll up every finished day that isn't yet, roll up the day before
-- yesterday again (for beacons that arrived late), and prune. Raw events go
-- after 90 days; the rollups stay, so the dashboard's history doesn't.
create or replace function public.analytics_nightly()
returns void
language plpgsql
set search_path = public
as $$
declare
    t date := analytics_today();
    d date;
begin
    for d in
        select distinct e.day from analytics_events e
        where e.day < t and not exists (select 1 from analytics_rolled_days r where r.day = e.day)
    loop
        perform analytics_rollup(d);
    end loop;
    if exists (select 1 from analytics_events where day = t - 2) then
        perform analytics_rollup(t - 2);
    end if;
    delete from analytics_events where day < t - 90;
    delete from analytics_salts where day < t - 1;
end
$$;

revoke execute on function
    public.analytics_today(),
    public.analytics_bucket(double precision),
    public.analytics_salt(date),
    public.analytics_rollup_compute(date),
    public.analytics_rollup(date),
    public.analytics_report(date, date),
    public.analytics_live(int),
    public.analytics_nightly()
from public, anon, authenticated;

grant execute on function
    public.analytics_today(),
    public.analytics_bucket(double precision),
    public.analytics_salt(date),
    public.analytics_rollup_compute(date),
    public.analytics_rollup(date),
    public.analytics_report(date, date),
    public.analytics_live(int),
    public.analytics_nightly()
to service_role;

-- Schedule ---------------------------------------------------------------------
-- 05:15 UTC is just after midnight in New York (00:15 in winter, 01:15 in
-- summer). pg_cron is available on every Supabase plan; where it isn't, run
-- `select public.analytics_nightly();` once a day some other way.

do $$
begin
    if exists (select 1 from pg_available_extensions where name = 'pg_cron') then
        create extension if not exists pg_cron;
        perform cron.schedule('analytics-nightly', '15 5 * * *', 'select public.analytics_nightly()');
    else
        raise notice 'pg_cron is not available: schedule select public.analytics_nightly() yourself';
    end if;
end
$$;
