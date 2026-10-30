# Analytics events

Every event the site records, where it fires, and what Tyler needs to set up
in Google Analytics (GA4, `G-3Q7XS383XP`) and Cal.com.

Each event goes through `track()` in `lib/analytics/track.ts` to GA (gtag) and
to our own collector (`lib/analytics/first-party.ts`). GA only loads on Vercel
(`NEXT_PUBLIC_GA_ID`); locally the events still reach the collector.

_Last updated: 2026-10-29._

## How events are recorded

- **Clicks come from the markup.** One click listener on the document
  (`lib/analytics/dom.ts`) reads `data-track="event_name"` on the clicked
  element, and `data-track-<prop>="value"` on it or on any element around it
  (the nearest wins). The footer says `data-track-menu="footer"` once, and each
  link only says `data-track="nav_click"`. Every link off the site records
  `outbound_click`, and every `<a download>` records `download`, with no
  attributes at all.
  - Why one listener rather than a `track()` in each `onClick`: dozens of
    links and buttons stay as they are (the footer is a server component and
    still works), links off the site and downloads are caught everywhere,
    including pages added later, and a new event is an attribute.
  - The listener runs in the capture phase, so it sees each click before the
    page's own handlers change anything. A disclosure (an FAQ answer, the phone
    menu, "Read more") counts when it opens, because its `aria-expanded` is
    still `false` then; closing it records nothing.
  - `data-track-once` keeps an event to once per page view.
- **Sections come from the markup too.** `data-section="faq"` on a section's
  root. One IntersectionObserver watches them all.
- **State changes call `track()` directly:** the hero picker, the reel, the nav
  menus opening on hover, the logo band's cards, form results and Cal.com
  bookings.
- **Page views** are GA's own, including client-side navigation (Enhanced
  Measurement's browser-history setting stays on).
- **Once per page view** means once until the path changes. `trackOnce()` in
  `track.ts` resets on each new path, whether it was loaded or reached by a
  client-side link.
- **Performance.** Nothing runs while the page scrolls. Sections and scroll
  depth are IntersectionObservers. The reel's progress reads `timeupdate`, a
  few times a second, and does one subtraction. The click listener does a few
  attribute reads per click.

## Events

Props in the contract with the dashboard are in **bold**. GA receives strings
and numbers; `ok` and `added` arrive as `"true"`/`"false"`.

| Event | When it fires | Props | Where | GA key event |
|---|---|---|---|---|
| `page_view` | Each page load and each client-side navigation (GA's own). | GA's | GA Enhanced Measurement | — |
| `nav_click` | A link in a nav or footer. | **`item`** (the link's label, or `logo`), **`menu`**: `top` (the desktop bar and pill, the phone's top bar, the landing pages' and brand kits' headers), `floating` (the phone's bottom pill), `mobile` (the phone's menu sheet), `footer`. Also `group` (`services`, `products`, `industries`) for a submenu link, and `shape` (`bar`, `pill`) on the desktop nav. | `components/TopNav.tsx`, `FloatingNavNew.tsx`, `Footer/index.tsx`, the landing heroes' logo, `brands/kit/Nav.tsx`, `brands/kit/Footer.tsx` | — |
| `nav_menu_open` | The Services or Products menu opens (hover, click or keys), or the phone's menu sheet. Once per menu per page view. | `item` (`services`, `products`, `industries`, `menu`), `menu` (`top`, `floating`) | `TopNav.tsx` (`show`), `FloatingNavNew.tsx` | — |
| `hero_menu_open` | The visitor engages with the hero's word picker: a word's preview held for 0.4s (desktop), or the first pick (any device). Once per page view. See the open question below. | `via` (`peek`, `pick`), `variant` (the first word) | `components/Home/Hero.tsx` | — |
| `hero_variant` | A word is picked or unpicked. | **`variant`** (`apps`, `websites`, `brands`, `launch-videos`, `everything`), `via` (`word`, or `reset` for a click on the hero's background) | `Hero.tsx` | — |
| `cta_click` | A call to action. | **`cta`**: `book_call` (anything that books: the cal.com tab or the on-page calendar), `secondary` (the hero's second button), `primary`/`secondary` (other non-booking pairs, such as Asset Generator's), `package` (a package page). **`label`**, **`href`** (a link off the site without its query), **`section`**, **`variant`** (the picked word, hero only). Also `plan` (`partnership`, `project`, `fast`, `studio`) where there's a choice. The nav's Book a call has `section` `nav`, with `menu` and `shape`. | Hero, nav (`components/nav/shared.tsx`), home pricing and Asset Generator band, the `/brand`, `/launch` and `/launch-videos` heroes, pricing and problem sections, `ui/PricingCard.tsx` | Optional: `book_call` clicks, see below |
| `reel_open` | The hero reel goes fullscreen. Once per page view. | `via` (`click`, `keyboard`) | `Hero.tsx` | — |
| `reel_close` | It closes (button, Escape or backdrop). Once per page view. | `seconds` fullscreen | `Hero.tsx` | — |
| `reel_progress` | 25, 50, 75 and 100% of one pass of the reel seen: seconds played while it's at least half on screen, in a visible tab, and not covered by a picked word's clip. Each once per page view. | **`percent`** | `Hero.tsx` | — |
| `section_view` | A section has been in the top 70% of the screen for 0.5s (so a smooth scroll's fly-bys don't count). Once per section per page view. | **`section`**, **`index`** (its order on the page, from 1) | `lib/analytics/dom.ts`; names in the table below | — |
| `scroll_depth` | The bottom of the screen reaches 25, 50, 75 or 90% of the page, or its end. Each once per page view. A short page records them all at once. | **`percent`** | `lib/analytics/PageEvents.tsx` | — |
| `project_open` | A link or card that opens a project. | **`project`** (`arch-network`, `honeyb`, `jinba`…), `href`, `section`, `via` (`spotlight` for /launch's HoneyB modal) | The logo band (`Home/ClientLogoTicker.tsx`; on a phone the first tap only shows the card), `/brand`'s case studies (`Brand/CaseStudyCard.tsx`), `/launch` (`Launch/RecentWorkSection.tsx`), a kit's related brand | — |
| `faq_open` | An FAQ answer opens. Once per question per page view. | **`question`**, `section` | `FAQSection.tsx` in `Home`, `Brand`, `Launch`, `LaunchVideos` | — |
| `form_submit` | The newsletter form is sent: after the reply, or straight away if the email is invalid. | **`form`** (`newsletter`), **`ok`**, `reason` (`invalid_email`, `http_<status>`, `network`) when it fails, `section` | `components/Footer/EmailCapture.tsx`, `brands/kit/footer/Newsletter.tsx` | Yes, with `ok` = true (see below) |
| `booking_made` | A booking goes through in a Cal.com embed (its `bookingSuccessfulV2` action). Nothing about the booking is sent. | `calendar` (the embed: `intro-call` home, `brand-call`, `launch-call`, `launch-video-call`) | `lib/analytics/cal.ts` (`useCalBookings`), in `Home/ScheduleCallSection.tsx` and the three `CTASection.tsx` | Yes |
| `booking_error` | The embedded calendar fails to load (Cal's `linkFailed`). | `calendar`, `code` | `lib/analytics/cal.ts` | — |
| `outbound_click` | Any link to another site (new tab, middle-click or not), and email links. | **`href`** (origin and path; `mailto:` alone for email, no address), `section` | `lib/analytics/dom.ts`, automatic | — |
| `logo_open` | A card in the logo band stays open for 0.6s. Once per client per page view. | `client`, `via` (`hover`, `focus`, `touch`) | `Home/ClientLogoTicker.tsx` | — |
| `testimonials_expand` | "Read N more" testimonials. Once per page view. | `section` | `Home/TestimonialSection.tsx` | — |
| `video_play` | A YouTube film starts (the click that swaps the poster for the player). Once per film per page view. | `video` (the client), `section` | `LaunchVideos/RecentWorkSection.tsx`, `Launch/PackageSection.tsx` | — |
| `package_addon` | An add-on goes into or out of a package. | `addon` (`website`, `pitchDeck`, `product`), `added` | `Brand/PricingSection.tsx`, `Brand/WhatsIncludedSection.tsx`, `Launch/PricingSection.tsx` | — |
| `carousel_use` | Someone browses `/brand`'s hero strip (swipe, drag, wheel, press or arrow key). Once per page view. | `carousel` (`brand_hero`) | `Brand/HeroCardCarousel.tsx` | — |
| `copy` | A brand kit's copy button. | `what` (`all_colors`, `css`, `design_md`, `color`, `hex`, `rgb`…), `copied` (the colour value, for single colours), `section` | `brands/kit/*` | — |
| `download` | Any file download, including the logo configurator's generated files. | `file`, `section` | `lib/analytics/dom.ts`, automatic | — |
| `page_not_found` | Next's 404 page. Once per page view. | `path` | `PageEvents.tsx` | — |

### Section names

`index` counts from 1 in page order. A section nested in another (each
project inside `work`) has its own number.

| Page | Sections, in order |
|---|---|
| `/` | `hero`, `logos`, `work`, then each project as `work_<id>` (`work_livingip`, `work_huch`, `work_uni`, `work_bump`, `work_arch-network`, `work_perena`, `work_autara`), `edge`, `pricing`, `testimonials`, `faq`, `booking`, `asset_generator`, `footer` |
| `/brand` | `hero`, `depth`, `process`, `recent_work`, `whats_included`, `pricing`, `founders`, `testimonials`, `booking`, `faq`, `footer` |
| `/launch` | `hero`, `problem`, `package`, `recent_work`, `process`, `testimonials`, `pricing`, `founders`, `booking`, `faq`, `footer` |
| `/launch-videos` | `hero`, `recent_work`, `process`, `testimonials`, `pricing`, `founders`, `booking`, `faq`, `footer` |
| `/brands/<client>` | `hero`, `overview`, `logo`, `color`, `type`, `motion` (where there is one), `assets`, `asset_generator`, `downloads`, `related` (where there is one), `footer` |
| `/insights`, legal pages | `footer` (and `scroll_depth`) |

The home projects follow `data/portfolioData.ts`, minus those hidden on the
home page (`HIDDEN_ON_HOME` in `PortfolioBento.tsx`).

## Open question for Tyler

**`hero_menu_open`.** The contract has it, but the hero has had no menu since
the statement replaced the picker's dropdown (6f942fa): its words are always on
screen. For now it means "engaged with the picker": a word's preview held for
0.4s on a desktop, or the first pick on any device, once per page view. That
makes it the step before `hero_variant` in a funnel. Should it stay that, or
should the dashboard drop it?

## Google Analytics setup (Tyler)

### 1. Register the custom dimensions

GA only shows an event's props in reports once each is registered.
Admin → Data display → Custom definitions → Create custom dimension. Scope:
**Event**. Use the parameter name exactly; name it as you like.

Register these first. The dashboard and the key events use them:

| Parameter | Suggested name | Used by |
|---|---|---|
| `section` | Section | section_view, cta_click, faq_open, outbound_click |
| `index` | Section index | section_view |
| `percent` | Percent | scroll_depth, reel_progress |
| `cta` | CTA | cta_click |
| `label` | CTA label | cta_click |
| `href` | Link | cta_click, outbound_click, project_open |
| `variant` | Hero word | hero_variant, cta_click, hero_menu_open |
| `item` | Nav item | nav_click, nav_menu_open |
| `menu` | Nav menu | nav_click, nav_menu_open |
| `project` | Project | project_open |
| `question` | FAQ question | faq_open |
| `form` | Form | form_submit |
| `ok` | Form OK | form_submit (the key event below needs it) |
| `calendar` | Calendar | booking_made, booking_error |

Then these, for the detail events (15 more, 29 in all, inside GA's 50):
`via`, `group`, `shape`, `plan`, `reason`, `code`, `client`, `video`, `addon`,
`added`, `carousel`, `what`, `copied`, `file`, `path`. Register `seconds`
(reel_close) as a custom **metric** (Unit: Seconds) if you want it summed.

Registration isn't retroactive: a dimension shows data from the day it's
created.

### 2. Key events

Admin → Data display → Events (or Key events):

1. **`booking_made`**: mark it as a key event once it has appeared in the
   Events list (after the first booking), or create it in Key events → New
   key event, by that name.
2. **Newsletter sign-ups:** GA can't mark only some `form_submit` events, so
   make one. Events → Create event → Create:
   - Custom event name: `newsletter_signup`
   - Matching conditions: `event_name` equals `form_submit`, and `ok` equals
     `true`
   - Mark `newsletter_signup` as a key event.
3. Optional, for booking intent: the same with `book_call_click` (conditions:
   `event_name` equals `cta_click`, and `cta` equals `book_call`). It's an
   intent, not a booking, so keep it secondary or leave it out.

### 3. Leave our own visits out

The site sets `traffic_type` to `internal` on every hit from a flagged
browser, GA's automatic page views included. Turn on GA's filter for it:

1. On each browser and device you use, open
   `https://blueprintstudio.ai/?analytics=off` once. It stays flagged until
   you open any page with `?analytics=on`.
2. Admin → Data collection and modification → Data filters. GA4 properties
   come with an **Internal Traffic** filter (parameter value `internal`,
   Exclude) in **Testing** state. If it isn't there: Create filter → Internal
   Traffic → value `internal` → Exclude.
3. Leave it in Testing for a day. In an exploration, the "Test data filter
   name" dimension shows which hits it would drop, and they should be yours.
4. Switch it to **Active**. It drops those hits from then on (not
   retroactively).

You don't need GA's IP rules (Data streams → the web stream → Configure tag
settings → Define internal traffic): the site sets the parameter itself, on
any network.

### 4. Enhanced Measurement overlap (recommended)

Admin → Data collection and modification → Data streams → the web stream →
Enhanced measurement (gear):

- **Form interactions: turn off.** GA's own automatic event is also called
  `form_submit` (with `form_id`, `form_destination`…), the same name as ours.
  It's quiet today because the newsletter handles its own submit, but any form
  it does catch would be counted with ours. It also sends `form_start`.
- Scrolls, Outbound clicks and File downloads: optional to turn off.
  `scroll_depth`, `outbound_click` and `download` cover them in more detail,
  and GA's versions arrive as `scroll` (90% only), `click` (with
  `outbound=true`) and `file_download`.
- **Page changes based on browser history events: leave on.** That's how
  client-side navigation gets its page views.

### 5. Funnels

Do step 1 before the site goes live: GA doesn't fill in a custom dimension
for the days before it was registered, and funnel steps filter on them.

Explore → **Funnel exploration** → Steps (pencil). Each step is an event, with
a parameter condition where shown. Breakdown by **Device category** or
**Session source / medium** to compare.

**Home to booking:**

1. `page_view` where **Page path and screen class** exactly matches `/`
2. `section_view` where `section` = `work`
3. `section_view` where `section` = `pricing`
4. `cta_click` where `cta` = `book_call`
5. `booking_made`

The same works for `/brand`, `/launch` and `/launch-videos`: change step 1's
path and drop step 2. Step 5 only counts bookings made on the page's own
calendar, not in a cal.com tab (see the Cal.com section below).

**The hero's words:**

1. `page_view` on `/`
2. `hero_menu_open` (engaged with the words)
3. `hero_variant`
4. `cta_click` where `section` = `hero`

For where people go from the nav, use a **Path exploration** starting from
`nav_click`, with `item` as the node.

## Cal.com: stop the booking embed reporting into our property (Tyler)

Every page with the booking calendar logs a second `page_view`, for
`/blueprint-studio/intro-call/embed?...`, plus a `scroll` at 90% within a few
seconds, sent from the `app.cal.com` frame to `G-3Q7XS383XP`. Those hits never
carry `traffic_type`, so even our own visits count. Cal's booking page opened
in a tab (each "Book a call" that opens cal.com) sends the same `page_view` and
`scroll` from `cal.com`.

The site can't stop it. Cal's Google Analytics app is turned on for the Intro
Call event type, and Cal adds its tag to that event type's booking page
whether it's embedded or not. The embed's config only takes layout, theme and
page-type settings, with no switch for apps, and a page can't control the
scripts in a cross-origin frame.

In Cal.com (app.cal.com, signed in as Blueprint Studio):

1. Event Types → **Intro Call** (`blueprint-studio/intro-call`) → **Apps**
   tab → **Google Analytics** → switch it off → **Save**.
2. If other event types have it too, do the same there. Or remove the app for
   everything: Settings → Apps → Installed apps → Analytics → Google
   Analytics → Remove.
3. Check: open the home page, scroll to the calendar, and in the browser's
   network panel no request to `google-analytics.com` should come from
   `app.cal.com`.

After that, `booking_made` counts bookings made in the embeds. Bookings made
in a cal.com tab (the "Book a call" buttons on `/brand`, `/launch`,
`/launch-videos` and home pricing open one) aren't seen at all. To count them
too, either point those buttons at the page's own calendar, or send Cal's
booking webhooks to our collector.
