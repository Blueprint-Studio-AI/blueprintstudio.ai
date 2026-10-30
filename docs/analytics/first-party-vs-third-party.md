# Analytics: what we can do ourselves, and what's worth buying

Written 29 October 2026. Prices, script sizes and policies were checked that day; the sources are at the end. How our own system works is in [README.md](README.md).

## In short

- **Keep our own first-party analytics as the main dashboard.** It's built, costs nothing at our traffic, sets no cookies and adds about 1 KB to a page. It answers the questions GA4 doesn't answer clearly: how far people get, which hero word works, and what happens between a visit and a booking.
- **Keep GA4 for now, but only for what only Google does:** Google Ads conversions and audiences, and long-term history. It's the heaviest thing on the page by far (about 195 KB gzipped). In the EU and UK its cookies need consent, and we don't ask for it.
- **Don't build heatmaps or session replay.** If we want them, borrow Microsoft Clarity for a few weeks on the pages we're redesigning, with a consent prompt. It's free.
- **Don't add PostHog, Plausible, Umami or Fathom.** Our system now covers what they'd give us.

The order is at the end.

## Where we are today

- **Google Analytics 4** (`G-3Q7XS383XP`) loads on Vercel only.
  - It records page views and one scroll mark at 90%. Production has no custom events yet; `track()` now sends them.
  - The Cal.com booking embed reports into the same property and doubles the home page's views. That's being fixed separately.
- **Vercel Web Analytics** is on, on the Hobby plan. That means page views only: no custom events, no UTM breakdown, and a one-month window.
- **Vercel Speed Insights** has been off since 16 September. Our own web vitals replace it.
- **Our own system** (this work) records page views, every `track()` event and web vitals. The data goes into Supabase, and the dashboard is at `/analytics`.

**Our traffic.** We don't have a GA export to hand; GA4's Reports → Engagement → Pages and screens shows it. The costs below assume under 10,000 page views a month, with 100,000 as the next step up.

## Capability by capability

What it would take to do each thing ourselves, against the tools.

**Labels:**

- **Done** means it's in our system now.
- **Easy** means a day or less.
- **Hard** means weeks, plus upkeep.
- **Not sensible** means someone else does it better for free or close to it.

| Capability | Ourselves | GA4 | Vercel WA | Clarity | PostHog | Plausible | Umami | Fathom |
|---|---|---|---|---|---|---|---|---|
| Page views and sources | Done | Yes | Yes | Basic | Yes | Yes | Yes | Yes |
| Custom events | Done | Yes | Pro only | Basic* | Yes | Yes; props on Business | Yes | Yes |
| Funnels | Done (fixed ones) | Yes (Explore) | No | No | Yes | Business tier | Yes (reports)* | No* |
| Scroll and section reach | Done | 90% mark only | No | Scroll heatmap | Scroll map | Scroll depth, built in | No* | No* |
| Click heatmaps | Not sensible | No | No | Yes, free | Yes | No | No | No |
| Session replay | Not sensible | No | No | Yes, free | 5,000 a month free | No | No | No |
| Web vitals | Done | No | Speed Insights | No | Yes | No | No | No |
| Realtime | Done (last 5 min) | Yes | No* | No | Yes | Yes | Yes | Yes |
| Attribution and UTM | Done (per visit) | Yes, across visits | Plus add-on | No | Yes | Yes | Yes | Yes |
| Google Ads and Search Console | Not sensible | Yes, both | No | No | No | Search Console | No* | Search Console |
| Bot filtering | Done (basic) | Yes | Yes | Yes* | Yes | Yes | Basic | Yes |
| Data ownership | Ours, raw SQL | Google's; BigQuery export | Vercel's | Microsoft's | Export; EU hosting | Export; EU-owned | Ours if self-hosted | Export, API |

\* From memory or a third party, not re-checked on the vendor's site that day.

### Page views and sources

- **Ourselves: done.**
  - We record page views on load and on client-side route changes.
  - Each visit's source comes from the landing page's referrer, folded to a host (google.com, linkedin.com, chatgpt.com and so on), plus its UTM tags.
- **Cost:** about $0. Each page view is two or three function calls to `/api/analytics`, against Hobby's 1,000,000 a month. It's also 3 to 4 KB of database rows (see "What ours costs to run").

### Custom events

- **Ourselves: done.** One `track()` call sends to GA4 and to us. Any new event name appears on the dashboard without changes.
- **Vercel:** custom events need Pro, at $20 per seat a month plus $0.03 per 1,000 events. Even then they carry only 2 properties each, or 8 with the $10-a-month Plus add-on.

### Funnels

- **Ourselves: done** for the funnel we care about: visited, reached the work, opened a project or clicked a button, booked or sent a form.
  - Each step is counted per visitor per day, on its own. Someone who books straight from the hero still counts as booked.
  - A new fixed funnel takes about an hour.
  - Ad-hoc funnels built in the browser, with any steps in any order, would be hard. That's a query builder, and it's not worth building at our size.
- **Others:** GA4's Explore and PostHog do ad-hoc funnels for free. Plausible needs its Business plan for them.

### Scroll and section reach

- **Ourselves: done.** Each home page section reports once per page view with its order on the page. The dashboard shows the share of home page views that reached each section, top to bottom, plus a 25, 50, 75, 90 and 100% scroll split.
- **Others:** GA4 only records a single 90% mark. This is the clearest gain over it.

### Click heatmaps

- **Not sensible to build.** A useful heatmap needs:
  - click positions relative to each element, so they survive different screen widths;
  - storage for every click;
  - an overlay that draws them over a live page.
- That's weeks of work for something Clarity gives away.
- **Cheap middle ground:** our `cta_click`, `nav_click`, `project_open` and `faq_open` events already say which things get clicked, and from where. That's most of what a heatmap tells a marketing site.

### Session replay

- **Not sensible to build.** Recording DOM changes is possible (rrweb is open source), but storing, masking and playing them back is a product in itself.
- Replay also changes the privacy picture: it records what people type and see, so it needs consent in the EU and UK.
- **Clarity** does it free with no traffic limit. **PostHog** gives 5,000 recordings a month free.
- **Use it in bursts.** Watching 20 sessions after a redesign is useful. Leaving replay on forever costs every visitor 27 to 150 KB of script.

### Web vitals

- **Ourselves: done.**
  - LCP, INP, CLS, FCP and TTFB come from real visits, through Next's own reporter (`next/web-vitals`), with no new dependency.
  - The code (3.3 KB gzipped) loads only when the browser is idle.
  - The dashboard shows p75 per page against Google's good, needs-work and poor thresholds.
- **Others:** Speed Insights does the same, but it's off, and its free tier is 10,000 events a month showing a single score. GA4 doesn't do it at all.

### Realtime

- **Ourselves: done.** "People on the site now" counts visitors with any event in the last 5 minutes.
- A live-updating map or event stream would be easy too, but there's little reason for it on a studio site.

### Attribution and UTM

- **Ourselves: done per visit.** We record the source and UTM tags of the page a visit landed on. A Google Ads click without tags counts as google / cpc, and its click id is thrown away.
- **Not possible for us:** following one person across several visits on different days. Our visitor hash changes daily by design, which is what makes the system cookie-free.
- **GA4** does cross-visit attribution, with a two-year cookie that needs consent in the EU and UK. For a studio, where someone usually books within a visit or two, per-visit attribution covers most of it.

### Google Ads and Search Console

- **Not sensible to build.** Google Ads conversion import works through GA4 or the Google tag. Doing it ourselves would mean storing click ids and sending conversions back to Google, which is personal data with a consent duty.
- **Search Console** doesn't need GA4 at all: its own site shows the search queries. Linking it to GA4 (Admin → Product links → Search Console links) only puts the two side by side. Plausible and Fathom can show the queries too.
- **Keep GA4 if we run Google Ads.**

### Bot filtering

- **Ourselves: done (basic).**
  - Bots that don't run JavaScript never call us.
  - Crawlers, link previews, uptime checks and HTTP libraries are dropped by user agent.
  - Automated browsers (`navigator.webdriver`, HeadlessChrome) are dropped too.
  - Requests from other origins, oversized bodies and bursts over 60 batches a minute are refused.
- **What we'd lack:** a commercial bot list such as the IAB/ABC list, which is paid. Matching that would be hard and isn't worth it. If odd traffic shows up, a new pattern is one line.

### Data ownership

- **Ourselves:** every event is a row in our own Postgres. We can query it with SQL, join it with anything, keep it as long as we like, and move it.
- **GA4:** the data is Google's, though BigQuery export is free.
- **Plausible, Fathom and PostHog** export CSV or have APIs. **Umami** self-hosted is ours. **Vercel and Clarity** keep it.

## Tool by tool

Script sizes were measured on 29 October 2026 by downloading each script, as raw bytes and gzip at level 9. A browser fetches roughly the gzip figure.

| Tool | Script (raw / gzip) | Cookies, and consent in the EU and UK | Cost at ~10k views a month | At ~100k | Setup |
|---|---|---|---|---|---|
| **Ours** | 1.7 KB / ~1.0 KB first load, plus 8.8 / 3.3 KB of vitals when idle | None. Nothing stored on the device, so no banner | ~$0 | ~$0 with 30 days of raw events, or Supabase Pro at $25 to keep 90 | Done; Tyler applies the migration |
| **GA4** (have) | 608 KB / 195 KB for our tag (199 KB transferred) | `_ga` cookie for up to 2 years. Needs consent in the EU and UK; we don't ask | Free | Free | Done |
| **Vercel Web Analytics** (have) | 4.5 / 2.0 KB | Cookieless hash, reset every 24 hours | Free on Hobby (50k events, no custom events) | Pro: $20 a seat plus ~$3 in events | Done |
| **Microsoft Clarity** | ~80 / ~27 KB (version approximate) | `_clck` and `_clsk` cookies. Since 31 Oct 2025 it needs a consent signal for EEA, UK and Swiss visitors to work fully | Free | Free | 15 minutes plus a consent prompt |
| **PostHog** | 338 / 107 KB, plus 41 KB more for replay | Cookie and localStorage by default. A cookieless mode exists. EU hosting | Free (1M events, 5k recordings) | Free | An hour or two |
| **Plausible** | 2.8 / 1.3 KB | None, says it needs no banner. EU-hosted | $9 Starter, $14 Growth, $19 Business (funnels and custom props) | Not verified; see the pricing slider | 15 minutes |
| **Umami** | 8.6 / 3.9 KB | None | Free cloud Hobby tier (100k events, 1 site, 6 months, no API) | $20 Pro (1M events) | 15 minutes; self-hosting is a day |
| **Fathom** | 7.0 / 2.1 KB | None. EU visitors' IPs are stripped in the EU | $15 (covers up to 100k) | $15 | 15 minutes |

### Notes on each

**GA4.**

- What only it does well:
  - Google Ads conversions and audiences;
  - attribution across visits;
  - free BigQuery export;
  - years of history.
- **Cost on the page:**
  - Our tag is the largest script on the site. It loads after the page is interactive, but on a mid-range phone it still means 195 KB to download and roughly 600 KB to parse.
  - It also sets a two-year cookie.
- **The law:**
  - In the EU, analytics cookies need prior consent.
  - The UK's Data (Use and Access) Act 2025 added a PECR exception for some analytics used only to improve a site. Law firms report it in force from 5 February 2026, and the ICO's guidance on its scope is still being finalised.
  - That exception is unlikely to cover GA4, since Google uses the data too. Our privacy policy names Google Analytics but there's no consent prompt.
- **Search Console** can be linked to GA4 under Admin → Product links. It adds two organic-search reports.

**Vercel Web Analytics.**

- Cookieless and light, but on Hobby it's page views only for one month, and our own system does more.
- Pro adds custom events, and the Plus add-on adds UTM breakdowns.
- **Hobby's terms:** Vercel's fair-use page says Hobby is "restricted to non-commercial personal use only", and gives a site advertising paid services as an example of commercial use. That's a reason to look at Pro regardless of analytics; it's our reading, not Vercel's ruling. If we move to Pro, its Web Analytics would cost a few dollars a month in events on top of the $20 seat.

**Microsoft Clarity.**

- Free heatmaps and session replay with no traffic limit. Recordings are kept 30 days.
- The script is about 27 KB gzipped and sets cookies.
- Since 31 October 2025, visits from the EEA, UK and Switzerland need a consent signal (its Consent API or a supported banner) for full functionality.
- Good for a few weeks around a redesign; not something to leave on every page for good.

**PostHog.**

- The most capable: funnels, replay, heatmaps, feature flags and experiments. The free tier is generous: 1M events and 5,000 recordings a month.
- The main script is about 107 KB gzipped before replay. That's too heavy for a marketing site whose selling point includes being fast.
- It has a real cookieless mode and EU hosting. Worth it for the Asset Generator app, not for this site.

**Plausible.**

- Closest to what we built: cookieless with a daily hash (the model we copied), a 1.3 KB script, scroll depth built in, and a Search Console integration.
- Funnels and custom properties need Business: $19 a month at 10k views on the vendor's slider. The 100k price couldn't be read from the page.
- The self-hosted Community Edition is free (AGPL) but lacks funnels.
- **The fallback** if we ever stop wanting to maintain our own.

**Umami.**

- Cookieless, open source, with a free cloud tier (100k events a month, one site, six months' history, no API).
- Self-hosting on Postgres is possible, and could even use the same Supabase. That's a day of work, and it gives us their UI rather than ours.

**Fathom.**

- Cookieless. $15 a month covers up to 100k page views, with no smaller tier and no free plan.
- Simple and fast, with bot filtering, an API and exports. Funnels weren't found.

## What ours costs to run

- **Vercel:** two or three function calls per page view (the first batch, then one when the page is hidden) of a few milliseconds each. At 10k views a month that's about 25,000 calls, against Hobby's 1,000,000.
- **Supabase:** about 10 events per page view at roughly 400 bytes each with indexes, so about 4 KB per view.
  - **At 10k views a month:** about 40 MB a month. With 90 days of raw events, around 120 MB, inside the free 500 MB even if shared with the newsletter.
  - **At 100k views a month:** about 400 MB a month. Either keep raw events for 30 days (change one number in `analytics_nightly()`) or move to Pro at $25 a month. The daily rollups are tiny (about 500 rows a day) and are kept for good either way.
- **Our time:** an hour now and then. That covers a new card when a new event matters, or a new bot pattern. The parts most likely to need care:
  - the rollup, which has two copies (SQL and the local store's TypeScript) that must agree;
  - the dashboard's layout as more cards arrive.
- **Page speed:** measured on the home page in a production build, median of 3 runs in Chrome via Playwright.
  - **Script:** about 1.0 KB gzipped in the first load. Net it's +477 bytes, because Speed Insights' loader went at the same time.
  - **Phones** (390×844, 4× CPU slowdown):
    - LCP was 1,076 ms and 1,124 ms in two "before" runs an hour apart, and 1,112 ms after;
    - TBT went from 55 and 58 ms to 49 ms;
    - CLS stayed at 0.
  - **Desktop** (1440×900): LCP went from 192 ms to 188 ms, and TBT stayed at 0.
  - **Summary:** no measurable change. The first batch of events leaves about 4 seconds after load, well after the page has painted.

## Recommendation

**Keep**

1. **Our first-party analytics.** It's the day-to-day dashboard and the source of truth for how the site is used.
2. **GA4, for now.** Keep it for Google Ads and history, and fix the consent gap one of two ways:
   - load it only after consent, with Consent Mode v2, for EU and UK visitors; or
   - remove it if we don't run Google Ads. Search Console works on its own.
3. **Vercel Web Analytics** until our numbers have run alongside it for a month. Then remove `<Analytics />`: it duplicates ours with less, and saves a request.

**Build**

- Nothing more for now.
- Later, if useful:
  - a weekly email or Slack summary from `analytics_report()`, which is easy;
  - a card for a new event when it matters, which is an hour each.

**Add**

- Nothing permanently.
- **Clarity for two to four weeks** around the next home page change, if watching real sessions would help. Use it on the pages being changed, with a consent prompt for EU and UK visitors.

**Don't**

- Build heatmaps, replay, Ads conversion import or a commercial bot list.
- Add PostHog to the marketing site.
- Add Plausible, Umami or Fathom while ours is working.

**In this order**

1. **This week:**
   - apply the migration in Supabase;
   - set `ANALYTICS_SUPABASE_URL`, `ANALYTICS_SUPABASE_SERVICE_KEY` and `ANALYTICS_PASSWORD` on Vercel, and deploy;
   - open the site once on each of our devices with `?analytics=off`;
   - add a line about first-party, cookie-free analytics to the privacy policy.
2. **Link Search Console to GA4**, if it isn't already. It's free and takes 5 minutes.
3. **After four weeks:** compare our visitors and views with GA4 and Vercel for the same days. Expect ours to be lower than GA4's home page views until the Cal.com double-count is fixed.
4. **Then decide GA4's future.** Keep it behind consent if we run Google Ads, otherwise remove it. Remove Vercel Web Analytics at the same time.
5. **Around the next redesign:** Clarity for a few weeks, if wanted.

## Sources (all checked 29 October 2026)

- **GA4:**
  - data retention: https://support.google.com/analytics/answer/7667196
  - cookies: https://support.google.com/analytics/answer/11593727
  - consent mode: https://developers.google.com/tag-platform/security/guides/consent
  - Search Console links: https://support.google.com/analytics/answer/10737381
  - script measured from https://www.googletagmanager.com/gtag/js?id=G-3Q7XS383XP
- **Vercel:**
  - Web Analytics pricing (page updated 2026-08-25): https://vercel.com/docs/analytics/limits-and-pricing
  - privacy: https://vercel.com/docs/analytics/privacy-policy
  - Speed Insights pricing: https://vercel.com/docs/speed-insights/limits-and-pricing
  - Hobby plan: https://vercel.com/docs/plans/hobby
  - fair use (page updated 2026-09-14): https://vercel.com/docs/limits/fair-use-guidelines
  - functions: https://vercel.com/docs/functions/usage-and-pricing
- **Microsoft Clarity:**
  - FAQ: https://learn.microsoft.com/en-us/clarity/faq
  - consent mode: https://learn.microsoft.com/en-us/clarity/setup-and-installation/consent-mode
- **PostHog:**
  - pricing: https://posthog.com/pricing
  - persistence: https://posthog.com/docs/libraries/js/persistence
  - cookieless mode: https://posthog.com/docs/privacy/data-collection
  - EU hosting: https://posthog.com/docs/privacy/gdpr-compliance
- **Plausible:**
  - pricing: https://plausible.io/#pricing
  - plans: https://plausible.io/docs/subscription-plans
  - data policy: https://plausible.io/data-policy
  - scroll depth: https://plausible.io/docs/scroll-depth
  - Search Console: https://plausible.io/docs/google-search-console-integration
  - self-hosting: https://plausible.io/docs/self-hosting
- **Umami:** pricing https://umami.is/pricing and FAQ https://docs.umami.is/docs/faq
- **Fathom:**
  - pricing: https://usefathom.com/pricing
  - EU isolation: https://usefathom.com/features/eu-isolation
  - changelog: https://usefathom.com/changelog
- **Supabase:**
  - pricing: https://supabase.com/pricing
  - billing: https://supabase.com/docs/guides/platform/billing-on-supabase
  - pausing: https://supabase.com/docs/guides/deployment/going-into-prod
- **UK cookie law after the Data (Use and Access) Act 2025:**
  - Stevens & Bolton (April 2026): https://www.stevens-bolton.com/insights/102mqbh/the-duaa-cookies-what-is-changing-and-what-you-need-to-know/
  - Clifford Chance (September 2025): https://www.cliffordchance.com/insights/resources/blogs/talking-tech/en/articles/2025/09/uk-ico-s-updated-guidance-for-new-exceptions-to-cookie-consents-.html
- **Not verified that day:**
  - Plausible's price at 100k views;
  - Umami's and Fathom's funnel and scroll features, and where Umami Cloud stores data;
  - the exact current Clarity script version.
