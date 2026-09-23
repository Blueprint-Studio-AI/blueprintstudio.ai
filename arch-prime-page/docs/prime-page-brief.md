# Arch Prime page — brief (v2, Sept 2026)

Working doc for the `/prime` marketing page. Supersedes the July `prime-page` branch
(terminal / app / engine framing) and the June research repo
(`Blueprint-Studio-AI/arch-website-expansion`, `02_Prime (round 1)/`), which is kept
only for general page structure.

## Sources of truth

| What | Where |
| -- | -- |
| Product inventory (what ships, status) | `arch-prime-brand/src/data/inventory.ts` |
| Brand taxonomy, colours, lexicon, voice | `arch-prime-brand/src/data/brand.ts`, `arch-prime-brand/deck/story.html` |
| App nav (Earn · Boost · Trade · Portfolio) | `arch-prime/apps/web/shared/app-nav.tsx` |
| App earn categories + copy | `arch-prime/apps/web/features/earn/map-earn.ts` (`WAYS`, `MENU_CATEGORIES`), `earn-catalogue.tsx` (`WaysSection`) |
| App product copy | `arch-prime/apps/web/features/vaults/data/{prime-btc,prime-usd,auto-earn}.ts` |
| App tokens (light only, `#ff5e00`, Plus Jakarta + Gascogne + Inter, radii 20/24) | `arch-prime/packages/ui/src/tokens/theme.css` |
| App Figma frame list, incl. a "marketing home" frame (1440 × 6149) | `arch-prime/docs/ui/DESIGN_SYSTEM_ANALYSIS.md` §0.1 |
| Site conventions (fonts, tokens, section rhythm) | this repo: `src/app/(main)/page.tsx`, `src/app/chain/*`, `src/app/globals.css` |
| Old structure only | `arch-website-expansion/02_Prime (round 1)/Prime Page — Wireframe v3.html` |

## The story (v5, 21 Sept 2026)

Lead: **Build the Bank.** Deposit to earn from day one; bring liquidity early and share in the
upside. What the bank is for: **a prime brokerage account against your Bitcoin**, hold it, earn
on it, borrow against it, trade it, post it as margin. Then **everything becomes prime**:
primeBTC and primeUSD now, a prime version of every Arch asset next, stocks included, each
usable as buying power while it earns. The peak is the destination (the deck's Peak grammar).

Page order: Hero (Build the Bank, the app's landing recipe) → numbers strip (Bitcoin now usable
in a prime account; placeholder figures) → The account (navy band, verb ledger) → the product
tour (Coinbase-style carousel of real app panels: Earn, Borrow, Trade, Margin) → How primeBTC
works (pinned story: Deposit → Make it prime → Buying power → Withdraw) → FAQ (what a prime
account is for, monetary efficiency) → Get in early (limited access, the app in a browser
frame) → The Peak (scroll-driven finale: Bitcoin alone, the ring of assets arrives, each turns
prime, they rise and the 80s office at dusk comes up behind: "Your ticket to the top.").
A floating pill (business.x.com's) carries "Get early access · Launch Prime" once the hero has
scrolled away, hidden over the story, the early section and the finale.

Cut in v5: Fund your account (three steps; the app's home does that), Borrow and Boost bands
(the tour covers them), the home Arch card (a link in Get in early instead), the closing tower.

Mechanics: the finale writes `--p1..--p4` (0..1) on `.prime-peak` from a scroll+rAF reader
(the HoneyB yield page's pattern; CSS owns every transform, in `prime.css`); below md or under
reduced motion it is unpinned and shows the final state. The carousel is native scroll-snap.
Figures come from `src/data/prime-data.ts`.

Still open: the hero photo. It is now the app's Trade photograph (a lit office block at night)
rather than the app's own landing shot, but a bespoke image is still the ask — the brand deck
repo (`arch-prime-brand`) has been deleted from this machine, so the Peak/Ascent set is no
longer available locally. Also open: the wording of the early-liquidity upside (is there a
named programme?).

### The earlier story (v4, 21 Sept 2026)

Lead: **Build the Bank.** Deposit to earn from day one; bring liquidity early and share in the
upside. What the bank is for: **a prime brokerage account against your Bitcoin**, hold it, earn
on it, borrow against it, trade it, post it as margin. Under that, **Just hold it** / earn on
everything: primeBTC and primeUSD now, a prime version of every Arch asset next, stocks
included, each usable as margin while it earns.

Page order: Hero (Build the Bank) → numbers strip (the plain-deposit rate) → Fund your account
(three steps) → The account (navy band, verb ledger) → Just hold it (product cards, prime chips)
→ How Prime works (pinned story: Hold → Prime → Earn → Margin) → Borrow (indigo band, LTV meter)
→ Boost (maroon, in build) → Built on Arch (home card) → FAQ → closing (Earn on it. Borrow
against it. Never hand it over.)

Built on the app's own recipes, ported from `arch-prime` `experiment/home-elements`: full-bleed
bands, the DrawnArch glyph (outline draw and sweep), the three-step funding cards, product
cards, the LTV meter, the closing tower. Plus Jakarta Sans for body on `/prime` only, scoped via
`.prime-scope`. Figures come from `src/data/prime-data.ts` (the app's fixtures) until analytics
is public.

### The earlier story (v2/v3)

One line: **Just hold it.**

You already hold Bitcoin. Make it primeBTC and it earns while it sits. Borrow against it,
trade it, boost it. It stays yours. Today that is BTC and USD. Eventually it is every
asset on Arch, tokenised stocks included.

Why this line: it is a one-word change to what the audience already does (hold). It is
plain, has a verb, and it resolves the deck's "Bitcoin isn't for sitting on" without
asking anyone to become a trader. The deck's mission line ("Make Bitcoin do more") is the
eyebrow or the closing band, not the hero. "Your ticket to the top" titles the vision beat.

Arc: **Hold → Prime → Earn → Keep (Borrow) → More (Boost) → Everything (vision) → Trust (Chain).**

Voice (from the deck): calm, exact, wants more. Short. Plain. A verb in every line.
Say: climb, ascent, altitude, the view from here, put it to work.
Don't: wealth, luxury, elite, VIP; stack, moon, degen, ape, alpha. No "unlock", "be your
own bank", "passive income on autopilot".

## Page structure (draft)

| # | Section | Job | Notes |
| -- | -- | -- | -- |
| 0 | Hero | The promise | "Just hold it." + 2-line sub + Launch Prime / See how it works. Photo of a person using the product (see photography note) alongside the real portfolio or earn UI. |
| 1 | Prime, as a verb | Explain the mechanic once | BTC → primeBTC, USD → primeUSD. Deposit, hold the prime version, it accrues, redeem. Coin mark → prime glyph. Manager (Velox) named plainly. |
| 2 | Earn | The hub | Tabs mirroring the app's four Earn categories (labels and copy from the app's "Different Ways to Earn" grid, below). Pale line grounds + Ascent buildings per brand system. Each tab = one card per station, linking out to the app. Products: primeBTC, primeUSD, Auto Earn. Lending: Arch USD Prime Yield. Pools: aBTC/aUSD. Strategies: "coming". |
| 3 | Borrow | Keep it, use it | Borrow USD against BTC without selling. Two steps. LTV and health shown plainly. APR figure is a placeholder until confirmed. |
| 4 | Boost | More of it | Leverage on what you hold ("Boost primeBTC"). Burgundy register, the one dark tile. Risk stated in the same breath. |
| 5 | One place | Trade + Portfolio | Swap natively, one balance, every position on one screen. Lighter, could be a single band. |
| 6 | Everything prime | The vision | primeBTC and primeUSD now; every Arch asset next, tokenised stocks included: "Don't just hold TSLA. Hold primeTSLA." Title: "Your ticket to the top." Forward-looking, word it as intent. |
| 7 | Built on Arch | Trust close | The home page's Arch Network card, one for one: base-chain scene over the purple 2T+ block, "Bitcoin should do more. Now it Can.", "How the Chain Works" → /chain. Keep it in step with the home. |
| 8 | FAQ | House pattern | Reuse `Faq` component. What is primeBTC, is it custodial, what are the risks, fees. |

Optional slots, hold until confirmed: **Rewards** band (after 5; the app has a stubbed
Portfolio › Rewards tab, no route yet), **Mobile app** section (after 5; nothing in the
inventory or app).

## App copy worth reusing or echoing

The app's own lines, so the page and the product say the same thing.

- App home hero: "DeFi on Bitcoin, powered by Arch." / "Earn yield, borrow against your BTC, and trade – all without leaving Bitcoin."
- Earn hero: "Put it to work." / "Professional management and automated strategies, on your terms."
- Earn categories ("Different Ways to Earn", eyebrow "Commitment", standfirst "Four ways to put capital to work. Choose how much of the work you want to do yourself."):
  - **Products** — "Pick a vault and deposit. A curator handles the rest."
  - **Liquidity Pools** — "Supply a trading pair and collect a share of every swap."
  - **Lending** — "Lend one asset to borrowers. Rates move with demand."
  - **Strategies** — "The individual positions vaults draw from. Go direct."
- Nav mega-menu variants: "Prime Products — Structured payoffs with defined risk and return." / "Strategy — Curated positions built for a specific outcome."
- primeBTC: "Your Bitcoin goes to work, so you don't have to." / "Your position is never locked." / "Consistent, daily yield, all taken care of for you." Curator: Velox.
- Auto Earn (USD): "You deposit, we handle the rest." Cards: Automatic Allocation · Diversified by Default · You Earn a Blend.
- Boost band: "Prime Strategies, Running on Rocket Fuel." / "Vetted curators run the strategy. Automation runs the execution. You keep custody."
- Borrow band: "Borrow aUSD against aBTC."

## Style direction

Look like the app, live in the site. App is light only: white page, `#f7f6f6` subtle
ground, orange `#ff5e00` for actions only, big soft radii (cards 24, panels 20), Gascogne
Serial headlines. The site already has Gascogne; body is Geist here vs Plus Jakarta Sans in
the app. Decide whether `/prime` loads Plus Jakarta for itself (like `/chain` scopes its
own CSS) or stays on Geist. Line colours (navy, greens, burgundy, peach, blue) appear only
in imagery and tiles, never on buttons or states.

## Photography

Deck rules: Ascent = worm's-eye buildings, nobody in frame, tinted to its line. Peak =
1980s finance film still, at height, looking out, never at us, never the trophy.

Desired for this page: classic bank-marketing warmth, real people, a mid-twenties woman
using the product in the hero. Reconcile by keeping the Peak grammar (at height, still
working, warm light, grain, looking at the product or out of frame, never at camera) and
casting present-day and younger.

Hero shot brief, for the Blueprint Studio generator (Arch Prime style) once it is
connected (`claude mcp get blueprint-studio`; sign in via `/mcp`):

- A woman in her mid-twenties, present day, at height: floor-to-ceiling window, city at
  blue hour with a warm sunset edge.
- Using Prime on her phone, looking at the screen or out of the window, never at camera.
  Calm, accomplished, still working.
- 35mm film still: grain, warm interior light, halation on the glass. Plain wardrobe, no
  crypto signifiers, no text, no logos.
- Screen soft and off-axis so real UI can be dropped in later.
- Two crops: 5:4 for the hero card, 16:9 in case it goes full-bleed.

## Wireframe v3 status (2026-09-16)

Built at `/prime` on branch `prime-page`: `src/app/prime/{layout,page}.tsx`,
`src/components/prime-{how,earn,tile,marks}.tsx`, `src/data/prime-faqs.tsx`, nav link in
`src/lib/site.ts`. "How Prime works" is the chain page's pinned scroll-story mechanic
(forked from `chain-how.tsx`).

Imagery is the real brand set, in `public/img/prime/`:

| Where | Asset | Source |
| -- | -- | -- |
| Hero, CTA | Arch Prime logo (dark, light) | `Brand/Arch Prime/Arch Prime Logos/` |
| Hero photo | three towers, worm's-eye | app `public/home-hero.jpg` |
| Token marks (story, cards, chips) | vector: the standard Bitcoin logo, and the glyph SVG on the primeToken colours | `Brand/Arch Prime/primeTokens`, app `asset-mark-*` |
| Story beat 03 | Earn hero | app `public/earn-hero.jpg` |
| primeBTC / primeUSD cards | Prospect landscapes | app `earn-card-prime-{btc,usd}.jpg` |
| Auto Earn card, Borrow, Boost tiles | tower / bank / gantry cutouts on brand grounds | app `earn-card-auto-earn.png`, `earn-band-boost.png`, `earn-card-strategies.png` |
| Earn tabs | category thumbs | app `earn-thumb-*.png` |
| Trade / Portfolio cards | their app heroes | app `trade-hero.jpg`, `portfolio-hero.jpg` |
| Vision | night office | brand deck `peak-chair.png` |
| Built on Arch | the home page 2T+ card, one for one | `src/app/(main)/page.tsx` |

Stripped in v3: the mock position card in the hero, the trust strip under it, the mock
two-step borrow card, the Rewards placeholder card. Still a stand-in: the hero photo
(brief wants a person using the product).

## Inspiration: axis.to (from Matt, 2026-09-16)

What it does: white page, plain grotesk, black pill buttons, one periwinkle accent used as
a ground, dot-matrix textures, hairlines, live numbers everywhere. Institutional-quant.

Structure worth noting:

1. Hero is split: headline + two pills + "Backed by the best" logos on the left; on the
   right a **live stat card** (Net APY with a 7D/30D toggle, TVL, volume, venues) on a
   patterned ground. The product's number is the hero image.
2. "How it works" as a **sticky left headline + numbered right list** (three steps, small
   line icons, hairline dividers).
3. Products as a **selector list on the left, live charts on the right** (supply, rate,
   daily APY); unreleased products sit in the list with a "Coming soon" pill.
4. Dark trust band: numbered card carousel (Legal, Audits, Attestation, Custody) with
   partner logos. Two-row logo marquee. A team video card with two key-fact rows.
5. Closing product band: brand ground with the **logo mark bleeding off the edge**, one
   line, one button.

Borrow for Prime (keep our serif, warmth and photography; take the structure and the
data-as-hero idea):

- Hero: a live primeBTC card (APY, 7D/30D, TVL, curator) beside the hero photo, fed by the
  app's analytics. Only once the numbers are real; no placeholders (Tyler's rule).
- "Backed by" logo marquee under the hero, reusing the site's `Marquee` and the existing
  partner logos.
- The Arch Prime glyph bleeding off the edge of the orange CTA band, as the deck tiles do.
- Later, when analytics is public: live APY/TVL and a sparkline on each Earn product card.
- Optional variant for "How Prime works": the sticky-headline numbered list, if the pinned
  scroll story reads as too much.

Don't borrow: the cold grotesk/quant register, dot-matrix textures, the team section.

## Figures: what the page may claim

Nothing the product reports is live. The app's rates and totals are frame fixtures
(`arch-prime apps/web/features/earn/data/earn.ts`) and its analytics/indexer base URLs are unset
outside a deployment, so every figure in the app renders as `[ --- ]`. Checked 21 Sept 2026.

So the page states two kinds of number and no others:

- **The market.** `$2T+` of Bitcoin, the figure the Arch home page already uses, with the
  caption "mostly sitting idle". A premise, not traction.
- **Protocol parameters.** 80% max loan to value, 90% liquidation. Set by the market's
  configuration, not by how much is in it.

Removed for being invented: total deposits, available liquidity, aBTC on Arch, prime product
counts, supply APY, borrow APY. When analytics is connected, the numbers strip is the one place
a live reading belongs. All of it lives in `src/data/prime-data.ts`.

## Calls to action

One primary across the page — `CTA.primary` in `src/data/prime-data.ts`, today "Get early
access" — because access is limited and "Deposit" promises something a reader cannot finish.
The day deposits open, that one constant becomes "Deposit" and the whole page follows.

App links are separate and contextual: "Launch Prime" on the pill and the finale, "Open in
Prime" / "Borrow in Prime" / "Trade in Prime" / "See your portfolio" on the tour, each deep
linking to the screen it shows. The hero's secondary is "See how it works", pointing at the
story rather than one section down.

## Running against the local app

`primeApp(path)` in `src/data/prime-data.ts` resolves every app link. With
`NEXT_PUBLIC_PRIME_APP=http://localhost:4322` in `.env.local` (gitignored) each product screen
and CTA opens the real screen on a locally running arch-prime — clicking the primeBTC shot
opens `/prime-btc`. With nothing set, which is production today, they fall back to the Arch
Prime account, since the app has no public URL yet.

## Open items

- [ ] Name: the app ships **Auto Earn** (`/auto-earn`, "Auto Earn (USD)"); brand.ts decided **Auto Lend**. App wins unless told otherwise; update brand.ts.
- [ ] Borrow APR: "~1%" is unconfirmed. Inventory shows Max LTV 80%, no APR. App borrow page is mock data.
- [ ] Boost: nav item exists in the app with no route. Scope (leverage on vaults, health factor, liquidation) before the section gets specific.
- [ ] Rewards: stubbed Portfolio tab. What is it?
- [ ] Mobile app: real and near enough to get a section?
- [ ] Pull the "marketing home" Figma frame the app docs reference. It may already be most of this page.
- [ ] primeBTC / primeUSD are "mainnet · demo mints" per inventory. Fine for the page, flag before launch.
- [ ] Hero photo decision (above).
- [ ] Asset generator: install the Blueprint Studio plugin to pull the Arch brand styles.
