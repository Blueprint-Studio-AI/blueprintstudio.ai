<!--
  HoneyB — design system for coding agents (public build)

  Generated from HoneyB's internal DESIGN.md by scripts/build-agent-doc.mjs.
  This is the PUBLIC subset: the design system itself (foundation, website,
  on-chain app, custodial app, cross-surface reference). Internal sections —
  repos, deploy URLs, access links, team, and the live-code issue list — are
  removed at build time and are not part of this file.

  Maintained by Blueprint Studio · blueprintstudio.ai/brands/honeyb
-->

# HoneyB — DESIGN.md

> Single source of truth for HoneyB's design system. Drop this file (and `logos/`) into any project root so a coding agent can generate on-brand HoneyB UI. **Hard values live in the YAML token blocks; intent lives in the prose.** Keep it in sync like a release note — a stale DESIGN.md is worse than none.

**How to use:** reference it in a prompt — *"Build X following DESIGN.md."* The doc is:


- **[Foundation / Brand Kit](#1-foundation--brand-kit)** — the shared spine: brand, logos, color, voice, motion.
- **[Website](#2-website-surface)** (`www.honeybtc.com`) · **[On-chain app](#3-on-chain-app-surface)** · **[Custodial app](#4-custodial-app-surface)** — the three surfaces (live deploy URLs in Resources; the `app.`/`dashboard.` custom domains aren't wired up yet).

**The brand is a spectrum, not a fixed look.** One spine (Liquid-Gold accent, neutral base, ≡ hive mark) runs across everything — but it stretches from **expressive & human** at the marketing end (real photography, warm natural light, soft blurs, a touch of glass, personality) to **technical & restrained** at the institutional-app end (dense data, tabular numbers, tight neutral UI, one-accent orange). That range is intentional: your *marketing* is allowed more personality than your *institutional dashboard*. Build to the point on the spectrum that fits the surface — don't force the dashboard's restraint onto a landing page, or vice-versa.

**Guidance, not dogma.** Treat the specs here as sensible defaults, not rules to obey to the pixel. Use judgment for the specific deliverable — don't get overly rigid about exact spacing or type sizes when the piece wants otherwise. The tokens keep things on-brand; the composition is yours.

---

## 1. Foundation / Brand Kit

Shared across the website and both apps.

### 1.1 Brand essence & voice

HoneyB is institutional Bitcoin yield — "Honey from hard money." The tone is **institutional, precise, confident, transparent, and trustworthy** — Bitcoin-native, refined and authoritative while staying approachable. The Poly serif carries that: it signals **stability and trust, but stays a little warm** — softly, slightly rounded rather than a hard, severe serif, without tipping into cutesy-rounded. Use *restrained* honey/bee wordplay — never cutesy.

`yaml
voice:
 register: institutional, precise, confident, transparent, trustworthy, approachable
 wordplay: "restrained bee/honey, used sparingly, never cutesy — e.g. 'Honey from hard money', 'The Honey Flow'"
 positioning_lines: "'Native Bitcoin In. Real Yield Out.' · 'Keep your custodian. Use our rails.'"
 do: lead with clarity and numbers; confident not salesy; sparse orange, sparse whimsy
 dont: emoji, exclamation-heavy hype, cutesy bee puns, jargon walls
canonical_copy:
 hero_h1: "Honey from hard money" # "Honey" set in italic serif
 hero_sub: "Put your Bitcoin to work."
 primary_cta: "Request Access"
 prelaunch_state: "Coming Soon"
 flow: ["01 Deposit", "02 Borrow", "03 Earn"]
 taglines: ["The Yield Layer for Bitcoin", "Institutional Yield, Settled on Bitcoin", "Native Bitcoin In, Real Yield Out"]
 positioning: "Institutional-grade fixed-income yield for native Bitcoin — no wrapping, bridging, or custody loss."
 legal_entity: "Nectar Group Inc." # © footer; decks carry 'Confidential — not an offer or solicitation'
domains: # see Resources for current live deploy URLs
 site: www.honeybtc.com # live
 onchain_app: # intended — NOT wired yet (Vercel URL for now)
 custodial_app: # intended — NOT wired yet (Vercel URL for now)
 social: { x: "@HoneyB_BTC", linkedin: "company/honeybtc" }
`

### 1.2 Logo system

Files ship in [`logos/`](./logos). Three lockups × three colorways, each as **SVG + PNG**, most with a `-mini` (compact clear-space) variant.

`yaml
logo:
 lockups:
 full: "HoneyB-Full-Logo-{colorway}.svg" # ≡ brandmark + "HoneyB" wordmark — default lockup
 wordmark: "HoneyB-Wordmark-{colorway}.svg" # "HoneyB" letterforms alone
 brandmark: "HoneyB-Brandmark-{colorway}.svg" # the ≡ four-bar hive mark alone (app favicon, avatars, toggle glyph)
 colorways:
 Dark: "ink #141417 — use on light/cream backgrounds (default)"
 Gold: "#F47000 — accent lockup, dark or photographic backgrounds"
 OffWhite: "near-white — use on dark/ink backgrounds"
 variants: "-mini = tighter clear-space; base = standard"
 set: "36 files = 3 lockups × 3 colorways × {standard, mini} × {svg, png}."
usage:
 surface_mapping: # BRAND RULE (official — deck p7–8) — which logo colorway each product uses
 onchain_app: "'Liquid-Gold' lockup (#F47000) — the non-custodial / on-chain app"
 custodial_app: "'Neutral 500' lockup (#14161F, dark) — the custodial dashboard"
 website: "Dark (Neutral 500) on light/cream; OffWhite on dark sections"
 mnemonic: "on-chain = gold, custodial = dark"
 brandmark_as_favicon: true # the ≡ mark is the favicon (Gold)
 brandmark_as_social_pfp: "the ≡ mark is also the social profile picture — currently the shiny / 3D-gradient-gold version of the mark (the flashier social treatment, see social_register)."
 brandmark_as_avatar: "opacity 30% watermark on vault/position tiles"
 min_clearspace: "≥ the height of one hive bar around the mark"
 dont: ["recolor outside the 3 colorways", "add drop shadows/outlines to the mark", "stretch/skew", "place Gold on busy light imagery (low contrast)"]
`

The **≡ four-bar hive brandmark** is the reusable identity atom — it appears as favicon, as a masked glyph inside the website's custodial/on-chain toggle knob, and as a faint avatar watermark in the apps.

### 1.3 Color

One accent (honey-gold), a true-neutral gray base, and a fixed semantic/loan-health set. **Orange is used sparingly** — CTAs, key numbers, chart accents, the logo — never as a fill.

`yaml
# COLOR SYSTEM — two layers:
# • BRAND palette (deck "Internal Brand Guidelines") = the named gold + neutral scales below. Governs brand/marketing
# touchpoints: decks, print, the marketing SITE. These named neutrals are the brand scale, not the app token set.
# • APP UI palette = Liquid-Gold + the Tailwind neutral ramp (see app_neutrals) + loan-health.
# Cross-surface constants (everywhere): Liquid-Gold #F47000, loan-health semantics, Off-White #FFFEFD as app background.
color:
 gold_scale: # "Shades of Gold" — warm, balances Bitcoin's technical nature with approachability
 liquid_gold: "#F47000" # THE brand color / single primary accent
 marigold: "#FFB445"
 wax: "#FFCB7F"
 light: "#FFF3E1"
 muted: "#FDF8F1"
 off_white: "#FFFEFD"
 gold_dark: "#E06500" # gradient bottom stop
 gradient: "linear-gradient(180deg, #F47000 0%, #E06500 100%)" # primary-button / fill ONLY — never on text
 neutral_scale: # BRAND neutrals (deck "Shades of Grey"). ⚠ INVERTED: 500 = DARKEST. Brand/marketing surfaces
 # only — this is the brand scale, not the app token set (apps use app_neutrals below).
 neutral_500: "#14161F" # darkest — brand ink (the 'Dark' logo asset ships #141417, a near-match)
 neutral_400: "#2D2E36"
 neutral_300: "#64656A"
 neutral_200: "#BAB9BB"
 neutral_100: "#F8F8F8"
 app_neutrals: # what the two APPS actually use — Tailwind true-neutral ramp (custodial 258×, on-chain 769×)
 bg: "#FAFAFA (neutral-50); on-chain html fallback #FFFEFD (brand off-white)"
 text: "#171717 (neutral-900) primary · #737373 (neutral-500) muted"
 border: "#E5E5E5 (neutral-200) · divider #F5F5F5 (neutral-100)"
 note: "the app-context neutral palette (distinct from the brand scale) — see §6"
 asset: # third-party coin colors — ONLY on those coin marks (≥16px), never UI accents/chips near gold
 bitcoin: "#F7931A"
 usdc: "#2775CA"
 status: # ONE vocabulary per surface: website marketing = semantic; both APPS = loan_health. Never mix.
 semantic: { success: "#10B981", warning: "#F59E0B", error: "#EF4444" } # website only
 loan_health: # apps only — {fg, bg} tint pairs. LABELS/TEXT use `text` (fg fails contrast on its own bg)
 healthy: { fg: "#009966", bg: "#ECFDF5", text: "#009966" }
 warning: { fg: "#FBBF24", bg: "#FFFBEB", text: "#EB8C00" } # #FBBF24 on #FFFBEB ≈1.6:1 → never as text
 danger: { fg: "#EF4444", bg: "#FEF2F2", text: "#F0530E" }
 liquidation: { fg: "#DC2626", bg: "#FEE2E2", text: "#DC2626" }
 partially_liquidated: { fg: "#71717A", bg: "#F5F5F5", text: "#71717A" }
`

**Color rules (hard):**
- **One accent.** Liquid-Gold `#F47000` is the *only* brand accent; everything else is the neutral scale on white/off-white. Never introduce a second hue — Bitcoin-orange `#F7931A` is for the BTC coin/mask only.
- **Gold rationing.** ≤ **one** gold element per view — the single most important action *or* number, not both, not every number. All other numbers are `neutral_500`. The gold **gradient is a fill only** (buttons); never `background-clip:text`.
- **Status.** Pick one vocabulary per surface (website=`semantic`, apps=`loan_health`); never render multiple health tints together *except* inside the LTV bar. Health labels/text use the `text` value (the `fg` fails WCAG on its own tint).
- **Contrast floor.** Body/UI text ≥ 4.5:1, large/UI ≥ 3:1. Gold text only at ≥18px semibold or on the gradient — never gold body text on light.
- default text `neutral_500` on white/`neutral_100`; muted `neutral_300`; borders `neutral_200`.

### 1.4 Typography (shared rules)

Font *families* differ per surface (§2–4). These rules are universal:

`yaml
fonts_official: # deck
 display: { family: "Poly", weight: "R / 400", role: "headings & display — refined, authoritative, trustworthy", by: "Nicolás Silva" }
 body: { family: "Inter", role: "body / UI — clean, legible; free on Google Fonts" }
type_scale_official: # deck "Type Scale" — the canonical brand scale (website implements it; apps run denser, see §3–4)
 h1: { size: 68, weight: 400, leading: "110%", font: Poly }
 h2: { size: 48, weight: 400, leading: "110%", font: Poly }
 h3: { size: 30, weight: 400, leading: "120%", font: Poly }
 body_large: { size: 26, weight: 400, leading: "120%", font: Inter }
 body_normal: { size: 18, weight: 400, leading: "110%", font: Inter }
 body_small: { size: 15, weight: 400, leading: "110%", font: Inter }
 button: { size: 16, weight: 500, leading: "150%", font: Inter }
 link: { size: 16, weight: 400, leading: "120%", font: Inter }
type_rules:
 numbers: "ALWAYS tabular-nums for money, %, APY, LTV, balances, addresses (column alignment)"
 micro_label: "uppercase, tracking-wide, neutral (muted), smallest step (site 12px / apps 10–11px)"
 headings: "tight negative tracking (-0.02em to -0.04em); never loose"
 smoothing: "antialias (website: on <html>; custodial: on <body>; on-chain: none today — see §6)"
`

### 1.5 Spacing, radius, elevation (shared principles)

`yaml
foundation_layout:
 spacing_unit: 4px # Tailwind scale; both apps run tight (space-y-4)
 radius_language:
 controls: "rounded-md (6–8px)"
 pills_toggles: "rounded-full"
 cards: "site 12–15px · apps ~4px (rounded) — see per-surface"
 elevation: "ultra-soft, low-spread shadows; light comes from above (inset top highlight on gold buttons)"
 borders: "1px, neutral-200; hairline dividers neutral-100"
`

### 1.6 Motion & polish principles

`yaml
easing:
 smooth-out: cubic-bezier(0.26, 1, 0.5, 1) # default — reveals, enters, app state changes
 spring: cubic-bezier(0.34, 1.3, 0.64, 1) # --ease-spring, mild overshoot — interactive knobs/toggles/drag settles ONLY, never content reveals
 rule: enter/exit → ease-out; on-screen morph → ease-in-out; linear only for marquees/spinners; never ease-in for UI
durations:
 hover/press: ~150ms
 ui-transitions: 200–300ms
 marketing-reveals: 500–900ms # one-time viewing earns longer
 keyboard-triggered: 0ms # never animate
signature-reveal: # the HoneyB look — calm, luxurious, considered
 keyframes: opacity 0→1, translateY(24px)→0, blur(8px)→0
 trigger: IntersectionObserver, fires once
 stagger: ~80ms between siblings; split into semantic chunks (heading / body / CTA), never one big container
 exits: always softer than enters — small fixed translateY + fade, shorter duration; never enter from scale(0)
buttons:
 hover: filter brightness(1.03)
 active: translateY(0.5px)
stack: hand-rolled CSS keyframes + easing custom properties — NO framer-motion, NO GSAP; Lenis smooth scroll on marketing site only
`

- **Two registers.** Marketing is expressive: blur reveals, glass, longer choreography. The app is institutional: subtle functional micro-interactions only — no entrance theatrics on data screens. In both, motion should read designed, never busy.
- **The staggered blur-reveal is the signature.** Opacity + rise + defocus, IntersectionObserver-triggered, ~80ms stagger across semantic chunks — it reads calm, luxurious, and considered, and quietly signals "there's craft here." It's the single motion most associated with the brand; use it for hero/section entrances on marketing.
- **Interruptible by construction.** Use CSS transitions for interactive state (they reverse cleanly mid-flight); reserve keyframes for one-shot staged sequences like the reveal. Never `transition: all` — name exact properties. Animate only `transform`, `opacity`, `filter`; keep blur ≤ 20px (Safari); `will-change` sparingly and only for those three.
- **Accessibility is non-negotiable.** `prefers-reduced-motion: reduce` collapses reveals to plain opacity fades and disables Lenis + decorative motion — reduced means less, not none. Focus rings via `:focus-visible` only: visible for keyboard, invisible on click. Keyboard-triggered interactions get zero animation.
- **Numbers never jitter.** `font-variant-numeric: tabular-nums` on every dynamic figure — balances, rates, timers, table columns. Fintech credibility dies with shifting digits.
- **Optical over geometric.** Concentric radii on nested surfaces (`outer = inner + padding`); icon-side button padding ≈ text-side − 2px; nudge asymmetric glyphs (arrows, carets, play triangles) by eye, not by math.
- **Depth with restraint.** Prefer layered low-opacity `box-shadow` (1px ring + soft lift) over hard borders on cards and buttons; keep real borders for dividers and inputs. Give images a 1px inset `outline` in pure `rgba(0,0,0,0.1)` (pure white at 10% in dark mode) — never a tinted neutral, which reads as dirt on the edge.
- **Rendering finish.** `-webkit-font-smoothing: antialiased` at the root; `text-wrap: balance` on headings, `text-wrap: pretty` on short body copy; interactive targets get a ≥40×40px hit area (extend small controls with a pseudo-element, never overlapping a neighbor's).
- **Hover is affordance.** Every interactive element responds visibly within ~150ms — the brightness lift on buttons, a one-step shadow raise on cards. If nothing moves on hover, it doesn't look clickable.

### 1.7 Iconography & imagery motifs

`yaml
icons:
 current: "lucide-react, line style, default strokeWidth, 14–16px in apps"
 future: "a custom, bespoke icon set is a likely future direction — not built yet"
motifs:
 hive_brandmark: "≡ four horizontal bars — the identity atom"
 honeycomb: "hexagon tessellation — website hero/section decoration + textures (deck 'Honeycomb Pattern'); often a soft, blurred, radial-masked glow"
 gold_coins: "glossy amber 3D BTC coin renders — website hero centerpiece"
 glass_icons: "3D frosted-glass + liquid-gold object icons (wallet, coin stack) — brand spot art (deck Assets)"
imagery: # the expressive / marketing end of the spectrum
 photography: "real-life, editorial — warm natural / northern light, natural Scandinavian wood surfaces, plants, calm interiors; inviting & comfortable yet polished, official, institutional"
 photography_per_product: "the two products are shot differently: the ON-CHAIN app leans warmer (warm woods, natural warmth); the CUSTODIAL app leans cooler — more black + neutral palette. Compare the two product shots on the landing page."
 glass: "a touch of glass / transparency (frosted, translucent) to signal transparency — used sparingly, an accent not a theme"
 blur: "soft blur is a signature on marketing — backdrop-blur on glass pills, gentle focus-dissolves on image swaps, blurred honeycomb glows, blur-in reveals"
partner_logos: "grayscale at rest → brighten/color on hover; normalized by optical cap-height"
social_register: "for SOCIAL/marketing the look leans MORE gradient + shiny (attention-grabbing) than the restrained app UI. May shift toward a more institutional / just-black route later, likely per-platform. Keep the app UI restrained regardless."
social_assets: "banner + PFP/avatar assets exist for social (e.g. HoneyB-Banner-*, HoneyB-x-PFP) — currently on Desktop, not yet in this repo"
`

### 1.8 Formatting & data display

From the portfolio/dashboard + contact-form samples. Applies to both apps (and any money on the site).

`yaml
formatting:
 usd: "$ + thousands separators + 2dp — $25,425,750.00; compact ($1.2M) only in tight stat headers"
 btc: "up to 8dp, trailing zeros trimmed — 14.45 BTC; ' BTC' suffix"
 percent: "2dp for APY/returns (8.50%); LTV whole or 1dp (30%, 30.5%)"
 gain_loss: "signed + colored: +$425,750.00 (1.70%) in success green; losses in danger"
 address: "truncate first6…last4, mono — asdfd…5jis / bc1q6…9f2"
 date: "MMM D, YYYY (Jun 30, 2024); relative under 24h"
 hero_value:"portfolio total = large bold neutral_500, centered, tabular-nums; APY a labeled stat, value neutral_500"
inputs: # website contact form + app fields
 label: "above the field, ~13px neutral (muted), sentence case (Full Name / E-mail / Organization / Message)"
 field: "white, 1px neutral_200 border, rounded-md, ~15px text, placeholder in neutral_300"
 focus: "gold or neutral_400 border (one choice per surface) + keep the 1px :focus-visible ring"
 error: "danger #EF4444 border + 12px #EF4444 message below the field"
overlays: # z-order so sticky header / menus / dialogs / toasts don't collide
 z_index: { base: 0, sticky_header: 30, dropdown_popover: 40, dialog_scrim: 50, dialog: 51, toast: 60, tooltip: 70 }
 scrim: "rgba(0,0,0,0.5) (+ optional backdrop-blur-sm); dialog max-w-md, p-6 site / p-4 apps; <sm → full-width bottom sheet"
onboarding_modal: "centered card over blurred app, 3D gold spot-art up top, headline + support copy, Skip · dot-pager (active dot gold) · Next→"
`

---

## 2. Website surface

The **warm, expressive marketing register.** · live `www.honeybtc.com`.

`yaml
website:
 stack: "Next.js 16 (App Router) · React 19 · Tailwind CSS v4 (CSS-first @theme, NO config file) · shadcn/ui 'new-york' · lucide"
 tokens_live_in: "app/globals.css :root (OKLCH) + @theme block"
 smooth_scroll: "lenis"
 themes: "light default (dark tokens exist, unused)"
 dev_port: 3003
 extend_by: "add to app/globals.css :root — never a JS tailwind.config"
`

### 2.1 Color (website specifics)

Foundation palette (§1.3) **plus** warm creams and a glow-gradient. Site is light-first, near-monochrome, warm-orange accents.

`yaml
website_color:
 background: "#FFFFFF"
 foreground: "#000000" # headings, true black
 foreground_secondary: "#767676" # body copy (oklch 0.4832 0 0)
 creams: ["#FFFCF8", "#FFFDF9", "#FFF8EE", "#FFF3E2", "#FFEED8", "#FDF8F1"] # section/card washes, OG gradient
 accent_glow_gradient: "linear-gradient(#ED4502, #EF8F02)" # honey-flow numbers, radial glows ONLY
 button_hover_black: "warm near-black (oklch 0.14 0.075 65)"
`

### 2.2 Typography (website)

`yaml
website_type:
 display_serif: { family: "Poly", weight: 400, styles: [normal, italic], role: "all h1–h3 + hero display", var: "--font-serif" }
 body_sans: { family: "Inter", role: "body/UI", var: "--font-sans (default)" }
 load: "next/font/google"
 scale_px: { "3xl": 128, "2xl": 68, xl: 48, "xl-minus": 36, "lg-plus-plus": 30, "lg-plus": 26, lg: 24, "lg-minus": 20, "base-plus": 22, base: 18, sm: 16 }
 leading_tight: 1.1
 heading_rules:
 - "h1–h3 → Poly serif, leading-tight, text-foreground"
 - "h1 48px → 68px (sm+); h2 36 → 48; h3 30 → 24; h4 = Inter medium 20"
 - "tracking -0.02em to -0.04em; body -0.01 to -0.03em"
 - "optical hang: translate-x -0.0625em on headings"
 - "HERO H1 uses the standard h1 rule (48→68px), NOT the 3xl:128 step. 3xl (128) is an oversized display token, rarely used. The hero H1 is `whitespace-nowrap lg:leading-[110%] lg:tracking-[-0.02em]` with the word 'Honey' wrapped in <em> (Poly italic)."
`

Poly serif carries the brand warmth; Inter does the work. Body base is **18px** (larger/airier than the apps).

### 2.3 Spacing, radius, shadows, motion (website)

`yaml
website_layout:
 container: "max-w-screen-xl; gutters px-4 sm:px-10 lg:px-25"
 breakpoints_px: { sm: 512, md: 768, lg: 1024, custom: 1300, xl: 1440 }
 radius_px: { base: 10, sm: 6, md: 8, lg: 10, xl: 14 } # controls rounded-md; cards 12–15; big surfaces 2xl; pills full
 shadows:
 card: "--shadow-card — 4-layer, rgb(17 17 20 / .04–.12) (web port of Figma's 4 drop shadows)"
 card_hover: "--shadow-card-hover — cross-fade via ::before/::after pseudo-elements, NOT box-shadow transition (avoids jank)"
 easing_vars: ["--ease-out-quad/cubic/quart/quint/expo/circ", "--ease-spring cubic-bezier(.34,1.3,.64,1)", "--ease-in-out-*"]
 reveal: "FadeIn (IntersectionObserver): opacity + blur(8px)→0 + translateY(24px), cubic-bezier(0.16,1,0.3,1); <Stagger> helper"
 hover: "200ms; product-card lift translateY(-3px) 320ms"
`

### 2.4 Components (website)

shadcn/ui "new-york" primitives in `components/ui/` (`button`, `input`, `textarea`, `label`, `field`, `separator`, `sheet`, `sonner`). Signature patterns:

- **Button** (cva): `default` (black bg → warm near-black on hover), `secondary` (translucent grey), `ghost`, `link`; base `rounded-md`. The gold gradient "Coming Soon" pill CTA lives in the header.
- **Product toggle** — accessible pill switching *Custodial ↔ On-Chain*; black→gold track, spring-eased sliding knob carrying the ≡ brandmark (masked). Reference pattern for any HoneyB segmented switch.
- **Card hover reveal** — honeycomb decoration + warm gradient wash + grid-rows `0fr→1fr` expand on `data-hover`. The recurring section primitive.
- **Partners grid** — bordered 2/3-up, logos grayscale→brighten on hover, normalized by optical cap-height.
- **Media crossfade** — blur-dissolve between images.

`yaml
website_hero: # reference layout (app/page.tsx)
 layout: "two-column at lg+ (copy left / gold-coin render right); single-column centered on mobile"
 section: "lg:h-[90vh] max-h-[900px] min-h-[700px]; copy column pt-12 lg:pt-40"
 h1: "Honey from hard money (‘Honey’ = <em> italic Poly); the 48→68px h1, whitespace-nowrap"
 sub: "‘Put your Bitcoin to work.’ — text-lg-minus → sm:text-lg-plus (20→26px)"
 support: "18px (text-base), color #5E5E5E, ~50% opacity on lg"
 cta: "‘Request Access’ (ScrollToContact), full-width h-14 on mobile"
 stats: # REAL hero stats — use verbatim, do not fabricate figures
 - { value: "$100T+ Fixed-Income Market", desc: "Access tokenized treasuries and credit." }
 - { value: "2.5–5% Target APY", desc: "Backed by predictable cash flows." }
 - style: "value text-base-plus (22px) font-medium text-foreground; desc text-base (18px)"
 honeycomb: "section-level gold hexagon pattern behind hero, extends beyond it, low opacity"
website_key_files: ["app/page.tsx", "app/globals.css", "lib/fonts.ts", "components/ui/button.tsx",
 "components/sections/products.tsx", "components/sections/trust.tsx", "components/fade-in.tsx",
 "app/api/og/route.tsx", "config/site.ts"]
`

### 2.5 Imagery (website)

The **expressive end of the spectrum.** Hexagon/honeycomb motif throughout (often a soft, blurred, radial-masked background glow); glossy amber 3D coin renders (`honeyb-hero-coins.png` = hero centerpiece) plus 3D glass/liquid-gold spot icons. **Real-life editorial photography** — warm natural / northern light, natural wood surfaces, plants, calm interiors — *inviting and comfortable yet polished and official* (see the deck's cozy-desk hero and the About-page imagery). **Glass & transparency** as an accent (frosted pills with `backdrop-blur`, translucent gold gradients). **Soft blur is a signature**: blur-in reveals (`FadeIn` with `blur`), focus-dissolve image swaps, blurred honeycomb glows. Warm cream backgrounds with soft orange radial glows; partner logos grayscale→color on hover; real team headshots on radial-gradient placeholders. OG images procedurally draw a honeycomb cluster over a cream gradient with a Poly title.

---

## 3. On-chain app surface

The **cool, dense, utilitarian fintech register.** Non-custodial: Bitcoin wallets (Xverse/Phantom/UniSat) on **Arch Network**, BIP-322 signing, "Autara" lending. Supabase email-OTP + KYC gate on top (identity, not key custody).

`yaml
onchain_app:
 stack: "React 19 · Vite 7 · Tailwind CSS v4 (CSS-first, no config) · Radix UI · CVA · lucide · recharts · sonner · @tanstack/react-query"
 tokens_live_in: "src/constants.ts (COLORS, LOAN_COLORS, ANIMATION) + src/index.css (motion/globals)"
 deploy: "Vercel (SPA); Supabase backend"
`

### 3.1 Color (on-chain app)

Foundation palette (§1.3). Brand gold + `LOAN_COLORS` semantic set + Tailwind neutral ramp on `bg-neutral-50`. Allocation charts = single orange stepped down in opacity (7 shades `#F47000`→`rgba(244,112,0,0.20)`). Chart utility: tooltip bg `#18181B`, expected/dashed line `#D4D4D8`, axis text `#A1A1AA`.

### 3.2 Typography (on-chain app)

`yaml
onchain_type:
 family: "system UI sans (Tailwind default) — NO custom/webfont"
 mono: "system mono (font-mono) for addresses, Arch pubkeys, RPC URLs"
 philosophy: "small & dense — 10–17px for a professional data-first feel"
 sizes_px: { micro_label: 10, meta: 11, body_default: 13, card_title: 14, deposit_input: "text-xl" }
 weights: ["font-medium", "font-semibold"] # no black/light
 rules:
 - "default UI/body/nav/button = text-[13px]"
 - "10px micro-labels = uppercase tracking-wide neutral-400/500"
 - "tabular-nums on every numeric/financial value"
 - "titles tracking-tight"
`

### 3.3 Spacing, radius, shadows, motion (on-chain app)

`yaml
onchain_layout:
 container: "max-w-3xl mx-auto p-4 md:p-6 space-y-4"
 header: "sticky, h-12"
 radius: "rounded (4px) is the house default; rounded-md buttons; rounded-lg dropdowns/dialogs; rounded-full pills/chips"
 card: "white · 1px border-neutral-200 · shadow-sm · header px-4 py-3 · dividers border-neutral-100"
 shadows:
 card: "shadow-sm"
 overlays: "shadow-lg / shadow-xl"
 primary_button_enabled: "0 2px 6px rgba(244,112,0,0.20), inset 0 1px 0 rgba(255,255,255,0.20)"
 primary_button_disabled: "0 1px 2px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.15)"
 motion:
 signature_easing: "cubic-bezier(0.26, 1, 0.5, 1)" # soft overshoot
 collapse_easing: "cubic-bezier(.215,.61,.355,1)"
 keyframes: ["shimmer (skeletons 1.5s)", "onboarding card enter/stagger (blur+rotate, vignette-mask reveal)", "success sweep (successRadiate/Sweep/Flash, --shimmer-color/--shimmer-origin)", "SVG checkmark drawCircle/drawCheck"]
 durations: "centralized in constants.ts ANIMATION (TRANSACTION_DELAY 2000, TOAST 3000, HOVER_DELAY 60, COLLAPSE 250)"
`

### 3.4 Components (on-chain app)

Primitives in `src/components/ui/`. **Two button systems coexist by design:**

`yaml
onchain_buttons:
 Button (button.tsx, cva): # utility / neutral
 base: "inline-flex items-center justify-center rounded text-sm font-medium transition-colors"
 variants:
 default: "bg-gray-800 text-white hover:bg-gray-700" # ⚠ see known-inconsistency below
 others: [secondary, outline, ghost, link]
 sizes: { default: "h-10 px-4 py-2", sm: "h-8 rounded-lg px-3 text-xs", lg: "h-12 rounded-xl px-8", icon: "h-10 w-10" }
 disabled: "pointer-events-none opacity-50"
 PrimaryButton (primary-button.tsx): # THE brand CTA
 base: "inline-flex items-center justify-center rounded-md text-[13px] font-medium text-white transition-all duration-150"
 fill: "linear-gradient(180deg,#F47000,#E06500)"
 shadow: "enabled/disabled → see onchain_layout.shadows"
 hover: "filter brightness(1.03)"
 press: "filter brightness(0.97) + translateY(0.5px)"
 disabled: "opacity-50 cursor-not-allowed (softer shadow)"
 geometry: "NO intrinsic height/padding — caller sets it via className. Typical: h-10 utility; h-14 for a full-width hero/section CTA."
font_weight_map: { buttons: font-medium, titles: "font-medium tracking-tight", values/numbers: font-semibold, micro-labels: font-medium }
known_inconsistency: "the neutral Button uses Tailwind gray-800/700 (#1F2937 — cool, blue-tinted), which conflicts with the true-neutral 'no second hue' rule (§1.3). It ships that way today; prefer the true-neutral ink #171717/#404040 for NEW work and treat gray-800 as legacy."
`

Also: `Card` (`rounded-2xl border-gray-200 bg-white shadow-sm` — note: most app cards actually use plain `rounded`; prefer the tight radius), `IconButton` (24px + 700ms-delay tooltip), `HelpTooltip`, `skeletons.tsx` (structurally pixel-perfect — real labels visible, only dynamic values shimmer, staggered), `ScrambleNumber` (animated tabular roll). Health viz: `LtvBarMini`, `LtvBarPortfolio`, `LoanHealthIndicator`, `NavLoanHealth`. Radix powers dialogs/dropdowns/tabs/popovers.

### 3.5 App patterns & states (on-chain app)

- **Layout:** `min-h-dvh flex flex-col bg-neutral-50`; sticky `h-12` header (logo + Products/Portfolio/Airdrop tabs, centered live loan-health indicator, wallet pill + user menu); content `max-w-3xl`.
- **Data viz (recharts):** `ComposedChart` for yield (dashed expected vs actual, tabbed Yield/APY/TVL, 1W–All ranges); donut `PieChart` for allocation (orange-shade cells); dark custom tooltip (`#18181B`, 4px radius, 11px).
- **Financial UI:** dual-tab Deposit/Redeem; three input modes (amount / target monthly / target yearly); epoch progress bars.
- **States (thorough):** shimmer skeletons; dedicated error pages `NotFoundPage`, `BadGatewayPage`, `ServerErrorPage`, `ArchDownPage` (chain-down), `ErrorBoundary`; sonner toasts; success animations on state change.
- **Empty / zero-data states:** the app has skeletons + error pages but **no rich empty-state pattern** — build them as: bare-in-card, ≡ brandmark or lucide mark (~24px in a `neutral-100` tile), a short `text-[13px]` headline, one `text-[12px] neutral-500` support line in HoneyB voice, and one gold `PrimaryButton`. In-app CTAs use a plain action verb + noun (**"Deposit Bitcoin"**, "Connect Wallet", "Complete Verification") — NOT the marketing "Request Access". Example empty copy: *"No open positions" / "Deposit Bitcoin to open your first position and put it to work."*

`yaml
onchain_ltv_bar: # LtvBarMini / LtvBarPortfolio — SAME 32-segment bar the custodial app uses
 segments: "32 total = 26 selectable (0 → market-max LTV) + 6 non-selectable risk"
 geometry: "each segment 3px wide + 2px gap = 5px pitch → ~158px total; segment radius ~1px"
 fill: "per-segment gradient: GREEN #009966 while ltv < gradientWarningStart → interpolate to WARNING #FBBF24 → interpolate to DANGER #EF4444 as ltv → selectableMaxLtv"
 inactive_segment: "#D4D4D4 (or #E0E0E0)"
 marker: "current-LTV position; scrub/hover shows 'current → new' in neutral-400"
onchain_loan_card: # portfolio/LoanCard.tsx — the canonical app card
 container: "relative rounded border border-neutral-200 bg-white (NO fixed width — fills parent grid cell)"
 header: "px-4, border-b border-neutral-100, flex justify-between; title text-[13px] font-medium neutral-900"
 body: "px-4 pt-4 pb-2 space-y-4"
 inner_panel: "rounded-lg border border-neutral-100 p-4 space-y-2.5 text-[12px]" # stat rows live here
 stat_row: "label (neutral-500/700) ↔ value (font-semibold tabular-nums); text-[12px]"
 badge: "text-[10px] font-medium rounded px-1.5 py-0.5 (small rounded chip, NOT a full pill)"
 note: "compact card — NO oversized hero metric. Big numbers live in VaultHero, not the loan card."
yaml
onchain_key_files: ["src/constants.ts", "src/index.css", "src/components/ui/{button,primary-button,card,skeletons}.tsx",
 "src/components/Header.tsx", "src/components/vault/{PriceChart,FundInfo}.tsx"]
`

---

## 4. Custodial app surface

**A deliberate design-parity port of the on-chain app** (§3) — same orange, same neutral base, same card/label/health language. Custodial: Supabase Google-OAuth (domain-whitelisted), read-only Maple loan view (Anchorage→Maple→AlphaLedger T-12 fund). `main` (last updated Apr 2026) is the current version. Treat §3 (on-chain) as the more actively-developed reference where the two diverge.

`yaml
custodial_app:
 stack: "Next.js 16 (App Router) · React 19 · Tailwind CSS v4 (PostCSS, no config) · lightweight-charts · lucide · @supabase/ssr"
 tokens_live_in: "src/constants.ts (COLORS, LOAN_COLORS) + src/components/ui/stat.tsx tones"
 dev_port: 3456
 robots: "noindex (private/internal)"
 parity_note: "code comments explicitly say 'matches the HoneyB on-chain web app' — keep visual parity with §3"
`

### 4.1 Typography (custodial app — the one real divergence)

Unlike the on-chain app's system font, the custodial dashboard loads real fonts:

`yaml
custodial_type:
 body: { family: "Inter", weights: [300,400,500,600,700], var: "--font-inter" }
 mono: { family: "IBM Plex Mono", weights: [400,500,600], var: "--font-mono", role: "opt-in only — wallet addresses, chart axis labels, Stat `mono` values (~8 usages)" }
 mono_recommendation: "recommend dropping IBM Plex Mono for system mono here (to match the on-chain app) — the usage is too light to justify a second webfont"
 numbers: "Inter + tabular-nums by default; mono is a light accent"
 scale_px: { micro_label: 11, meta: 9-10, caption: 12, body: 13, stat: 14, hero_metric: "18/24/30" }
 micro_label: "11px font-medium neutral-400 uppercase tracking-wide — every section header"
`

### 4.2 Spacing, radius, shadows, motion (custodial app)

`yaml
custodial_layout:
 container: "max-w-6xl mx-auto p-4 md:p-5 space-y-4"
 header: "sticky h-14, bg-white/85 backdrop-blur-md"
 radius: "rounded (4px) cards (flat radius won over rounded-2xl); rounded-md buttons; rounded-full pills; rounded-sm toggles"
 card_padding: "px-5; header pt-5; body pt-4 pb-5"
 shadows:
 card: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)" # CARD_SHADOW, ultra-soft
 primary_enabled: "0 2px 6px rgba(244,112,0,0.25), inset 0 1px 0 rgba(255,255,255,0.20)"
 primary_disabled: "0 1px 2px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.15)"
 motion:
 easing: "animations.dev curves as CSS vars (--ease-out-1/2/3, --ease-in-out-2/3)"
 entrance: "animate-fade-up (translateY 8px + fade, staggered animationDelay 80→280ms across cards)"
 keyframes: ["animate-shimmer", "animate-pulse-dot + animate-live-ping (live radar dot)", "animate-flash (orange value-change wash)", "animate-reveal-up (clip reveal)", "BTC ticker shine (animated CSS mask)"]
 buttons: "filter brightness + 0.5px translate on press"
`

### 4.3 Components & patterns (custodial app)

Primitives in `src/components/ui/`: `Card`/`CardHeader`(icon + 11px uppercase label + right slot)/`CardBody`; `PrimaryButton` (orange gradient, 13px); `IconButton` (defaults to `FileDown` export); `Stat`/`Label`/`MetricValue` with a 6-value `ValueTone` system (default/muted/primary/positive/negative/warning); `HelpTooltip` (pin-on-click).

App widgets (`src/components/dashboard/`): `StatusStrip` (dark traffic-light bar), `NetPositionHero` (+ sparkline), `BtcTicker` + `DotMatrixText` (custom 5×7 SVG-dot LED price ticker), `LiquidationGauge`/`LtvBar`/`InlineLtvBar` (32-segment green→red gradient, hatched danger zone, triangle marker), `QuarterBars`, `CashFlowChart`, `CounterpartyStrip` ("Powered by" partner trust stack), `NavChart` (lightweight-charts area). No modal/table library — "tables" are styled rows.

`yaml
custodial_patterns:
 data_viz: "segmented gradient health bars · triangle-marker + dashed connector · dashed-border receipt rows · tinted-bg semantic badges · lightweight-charts NAV area"
 states: "shimmer/ticker-shine loading · 'No BTC-collateralized loans found' empty · red login/auth error banners; trend errors degrade silently"
 copy: "reassuring institutional — 'All Systems Normal', 'Powered by', 'Authorized personnel only'"
custodial_key_files: ["src/constants.ts", "src/components/ui/{card,primary-button,stat,icon-button}.tsx",
 "src/components/dashboard/*", "src/app/globals.css", "src/app/page.tsx"]
`

---

## 5. Cross-surface cheat-sheet

| Dimension | Website (marketing) | On-chain app | Custodial app |
|------------------|---------------------------------|----------------------------------|----------------------------------|
| Register | Warm, expressive | Cool, dense fintech | Cool, dense fintech (parity) |
| Display font | **Poly** serif | system sans | **Inter** |
| Body font | Inter | system sans | Inter |
| Mono | — | system mono | IBM Plex Mono → system mono (rec.) |
| Body size | 18px | 13px | 13px |
| Card radius | 12–15px | ~4px (`rounded`) | ~4px (`rounded`) |
| Card shadow | 4-layer Figma port | `shadow-sm` | `0 1px 3px rgba(0,0,0,.04)` |
| Imagery | honeycomb + gold coins + cream | none (data viz only) | none (data viz only) |
| Accent easing | `--ease-spring .34,1.3,.64,1` | `cubic-bezier(0.26,1,0.5,1)` | animations.dev `--ease-out-*` |
| Primary CTA | black / gold "Coming Soon" pill | gradient orange `PrimaryButton` | gradient orange `PrimaryButton` |

**Always true (all surfaces):** brand gold `#F47000`→`#E06500` used sparingly · neutral base · `tabular-nums` on all numbers · loan-health palette for status · ≡ hive brandmark · CSS-only motion with `prefers-reduced-motion` + keyboard-only focus rings · no second hue.

---

