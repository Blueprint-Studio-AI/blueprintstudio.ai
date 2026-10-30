# Our own analytics

blueprintstudio.ai records what visitors do itself, in its own database, and shows it on a private dashboard at `/analytics`. It sets no cookies, keeps nothing on the visitor's device, and adds about 1 KB (gzipped) to a page's first load.

It runs next to Google Analytics, which still gets every `track()` event, and Vercel Web Analytics. For why we built this and what we'd still buy, see [first-party-vs-third-party.md](first-party-vs-third-party.md).

## How it works

```
browser                           server (Vercel function)                 Supabase
-------                           ------------------------                 --------
track("cta_click", {...})  ─┐
page views, web vitals     ─┼─>  POST /api/analytics  ─>  checks, enrich  ─>  analytics_events (90 days)
  lib/analytics/first-party.ts      app/api/analytics/route.ts                    │ nightly (pg_cron)
                                    lib/analytics/server/collect.ts               v
                                                                             analytics_daily (kept)
/analytics  <──────────────────  app/analytics/page.tsx  <─  analytics_report(from, to)
```

**In the browser** (`lib/analytics/`):

- `track.ts` is the one call components use. It sends each event to Google Analytics and to `first-party.ts`.
- `first-party.ts` holds events in memory. It sends them in batches to `/api/analytics` with `navigator.sendBeacon`, falling back to `fetch` with `keepalive`. A batch goes 4 seconds after the first event, and straight away when the page is hidden or closed. Nothing runs until the first event.
- `FirstPartyAnalytics.tsx` is mounted once in `app/layout.tsx`. It records a page view on load and on every client-side route change.
  - It also loads `vitals.tsx` when the browser is idle. That file reports LCP, INP, CLS, FCP and TTFB through Next's `useReportWebVitals`.
  - This replaces Vercel Speed Insights, which has been off since September.
  - Vitals are filed under the page that was loaded, even when they're reported after a route change.
- Each page view gets a random id kept in memory, so its events can be grouped. It is never stored.

**On the server** (`app/api/analytics/route.ts`, `lib/analytics/server/`):

- **Checks:**
  - The `Origin` must be the site's own host, or listed in `ANALYTICS_ALLOWED_ORIGINS`.
  - Bodies are capped at 16 KB and 50 events.
  - Each IP gets 60 batches a minute per function instance.
  - Bad events are dropped one by one: a name or prop that doesn't fit, a nested object, or a web vital that isn't a number.
- **Bots:** these get a normal `204` and nothing is kept.
  - Crawlers, link previews, uptime checks and HTTP libraries are recognised by user agent.
  - Automated browsers (`navigator.webdriver`, HeadlessChrome) are dropped too.
  - Bots that don't run JavaScript never send anything in the first place.
- **What's kept per event:**
  - name, path (without the query string), props and time;
  - the referring site as a bare host, and `utm_source`, `utm_medium` and `utm_campaign`. A Google Ads click without UTM tags is counted as `google / cpc`, and its click id is thrown away;
  - the country, from Vercel's `x-vercel-ip-country` header;
  - device class (phone, tablet or desktop), and browser and OS family with no versions;
  - a visitor hash.
- **Never kept:** the IP address, the full user agent, any other query parameter (a newsletter link could carry an email), or the click id.
- **The visitor hash:** `sha256(salt | site | IP | user agent)`, cut to 16 hex characters.
  - The salt is random, made each day, and deleted after a day (`analytics_salt()`). Nobody, us included, can rebuild a hash from an IP afterwards.
  - The same person on another day is a new visitor. So "visitors" over a period are visitor-days, which is how Plausible counts too.
- **Runtime:** the collector runs on Node, not Edge. The local store writes a file, and `node:crypto` does the hashing. Nobody waits on a beacon, so Edge's latency gain buys nothing here.

**Storage** (`lib/analytics/server/store.ts`) picks one of three stores:

| Store | When | Where |
|---|---|---|
| Supabase | `ANALYTICS_SUPABASE_URL` and `ANALYTICS_SUPABASE_SERVICE_KEY` are set | `analytics_*` tables, through the REST API with plain `fetch` |
| Local | development, or `ANALYTICS_STORE=local` | `.analytics/events.ndjson` (ignored by git), rolled up in memory |
| None | production with neither | events are accepted and dropped |

The Supabase store uses its own variables on purpose. The newsletter's `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_KEY` are never read for analytics.

**Rollups.** The dashboard never scans raw events for past days.

- Each night, pg_cron runs `analytics_nightly()`. It rolls each finished day into `analytics_daily`: about 500 rows a day, one per metric and dimension. It then re-rolls the day before yesterday to catch late beacons.
- `analytics_report(from, to)` returns those rows. For any day not rolled up yet (today), it computes the same rows from raw events on the spot.
- Raw events are deleted after 90 days. The rollups are kept, so the history doesn't go.
- Every metric and its dimensions are listed at the top of `lib/analytics/server/rollup.ts`.
- `rollup.ts` is the local store's copy of the SQL function `analytics_rollup_compute()`. The two must agree. They were checked row for row on 8,654 sample events in Postgres (PGlite).

**Our own visits.** Open the site once with `?analytics=off` and that browser's events are sent marked `internal`. `?analytics=on` undoes it.

- The dashboard leaves them out of every number. It shows how many there were at the bottom, so you can see the switch works.
- We tag rather than drop them so the switch can be checked, and so the pipeline can be tested in production without skewing anything.

**Do Not Track and Global Privacy Control are not acted on.**

- Nothing we record is sold, shared, or can be linked to a person across days. GPC's legal force (CCPA and similar laws) is about selling and sharing data, which this doesn't do.
- DNT is deprecated and has no legal standing.
- Honouring either would quietly drop a few percent of visitors (Brave and DuckDuckGo send GPC by default) and skew the numbers towards Chrome and Safari.
- Plausible and Fathom take the same view. To change it, return early in `record()` in `first-party.ts` when `navigator.globalPrivacyControl` is true.

## The events

| Event | Props | Sent by |
|---|---|---|
| `pageview` | (none) | `FirstPartyAnalytics.tsx`, on load and route change |
| `web_vital` | `metric`, `value`, `rating` | `vitals.tsx` |
| `nav_click` | `item`, `menu`: top, floating, mobile or footer | components, via `track()` |
| `hero_menu_open` | (none) | components |
| `hero_variant` | `variant`: apps, brands and so on, or `everything` | components |
| `cta_click` | `cta`, `label`, `href`, `section`, `variant?` | components |
| `reel_open` | (none) | components |
| `reel_progress` | `percent`: 25, 50, 75 or 100 | components |
| `section_view` | `section`, `index` (its order on the page), once per page view | components |
| `scroll_depth` | `percent`: 25, 50, 75, 90 or 100 | components |
| `project_open` | `project` | components |
| `faq_open` | `question` | components |
| `form_submit` | `form`, `ok` | components |
| `booking_made` | (none) | components |
| `outbound_click` | `href` | components |

**Adding an event:**

- Any new event name shows up in the dashboard's "Every event" list by itself.
- Names are `snake_case`, up to 40 characters. Props are flat strings, numbers or booleans: up to 12 per event, keys up to 40 characters, string values cut at 200 characters.
- To give an event its own card, add a metric in three places, keeping them in step: `rollup.ts`, `analytics_rollup_compute()` in a new migration, and `report.ts` and `page.tsx`.

**The funnel** counts, per visitor-day:

- visited: any page view;
- reached the work: a `section_view` of `work`, or a `project_open`;
- opened a project or clicked a button;
- booked or sent a form: `booking_made`, or a `form_submit` with `ok: true`.

Each step is counted on its own, so someone who books straight from the hero still counts as booked. The "work" section name is `WORK_SECTION` in `rollup.ts`, and `'work'` in the SQL.

## Run it locally

No settings are needed.

```sh
pnpm dev                               # then browse the site
open http://localhost:3000/analytics   # no password in development
node scripts/analytics-seed.mjs        # 30 days of labelled sample events (--days 60, --remove)
```

- Events land in `.analytics/events.ndjson`, one JSON line each.
- Sample rows carry `sample: true`. The dashboard shows a banner while any are in the period.
- The seed script only ever writes that local file.
- Under `next build && next start` (production mode), set `ANALYTICS_STORE=local` to keep using the file, and `ANALYTICS_PASSWORD` to open the dashboard.
- Automated browsers are dropped. Set `ANALYTICS_ALLOW_AUTOMATION=1` to let Playwright's runs through. It's ignored on Vercel production.

## Settings

| Variable | Needed for | Notes |
|---|---|---|
| `ANALYTICS_SUPABASE_URL` | keeping data in production | The Supabase project URL. |
| `ANALYTICS_SUPABASE_SERVICE_KEY` | keeping data in production | A service-role key (legacy JWT) or a new `sb_secret_` key. Server-only; never `NEXT_PUBLIC_`. |
| `ANALYTICS_PASSWORD` | opening `/analytics` in production | Without it the dashboard is a 404 in production. Changing it signs everyone out. |
| `ANALYTICS_ALLOWED_ORIGINS` | optional | Extra origins allowed to send events, comma-separated. The request's own host is always allowed, which covers previews. |
| `ANALYTICS_STORE` | optional, local only | `local` uses the file store under `next start`. |
| `ANALYTICS_DEV_FILE` | optional, local only | A different path for the local file. |
| `ANALYTICS_ALLOW_AUTOMATION` | optional, tests only | `1` lets automated browsers through, except on Vercel production. |

## Apply the migration (once)

The migration is `supabase/migrations/20261030000000_first_party_analytics.sql`. It only adds `analytics_*` tables and functions, and is safe to run twice.

1. **Pick the project.**
   - The existing one (the newsletter's) works. The analytics tables are closed to the public keys like everything else.
   - A separate free project keeps the two apart. It can't then slow the newsletter, and its key can't touch subscribers. The free tier allows two projects. Supabase pauses a free project after a quiet week, and daily writes from the collector should keep it active.
2. **Run the migration.** In the Supabase dashboard, open **SQL Editor**, paste the whole file and run it. Or run `supabase db push` if the CLI is linked.
3. **Check the nightly job.** pg_cron is on every plan.
   - If the migration's notice said pg_cron wasn't available, enable it under **Database → Extensions** and run the file again.
   - Check it's scheduled: `select jobname, schedule from cron.job;`
4. **Check the functions.**
   - `select analytics_salt(analytics_today());` should return 64 hex characters.
   - `select count(*) from analytics_report(current_date - 7, current_date);` should run.
5. **Set the variables on Vercel** (Production): `ANALYTICS_SUPABASE_URL`, `ANALYTICS_SUPABASE_SERVICE_KEY` and `ANALYTICS_PASSWORD`. Then redeploy.

## Open the dashboard

Go to https://blueprintstudio.ai/analytics and sign in with `ANALYTICS_PASSWORD`. The cookie lasts 30 days and only applies to `/analytics`.

- The page is `noindex`, isn't in the sitemap or `robots.txt`, and isn't linked from anywhere.
- Sign-in tries are limited to 10 per 15 minutes per network.
- The dashboard doesn't count its own page views. Google Analytics still does, because its tag is in the root layout. Open it once with `?analytics=off` so your visits to the rest of the site are tagged as ours.

## Limits worth knowing

- **Visitors are visitor-days.** A person who changes network (wifi to 5G) mid-visit becomes a second visitor. That's the price of not storing anything on the device.
- **Rate limiting** is per function instance, not global. It's enough against a script, not a botnet.
- **Web vitals cover full page loads only.** The library doesn't measure client-side route changes.
- **Uniques can't be deduplicated across a period.** That's deliberate: the hashes are unlinkable across days.
