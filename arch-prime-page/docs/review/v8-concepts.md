

######## concept:cinematic

# v8 concept: "The Lift"

## 1. Big idea
The reader's scroll works as the elevator. The page holds still while the floors pass a single window, and the last floor is the view.

## 2. Flow

**Hero** (~20 words): uses v7/hero.webp, the lockup, "Put your Bitcoin to work.", the V7 sub line and a "Get early access" button.
- On load, the lockup, headline and button fade up once: 500ms, 80ms stagger.
- On scroll, the photo moves 40px slower than the page. Nothing else moves.

**Lobby**, which fills the lead's empty white band (~75 words): "What it does", "Choose what your Bitcoin does.", the aBTC/aUSD line, then four full-width rows split by hairlines. Earn and Borrow carry "Preview", Trade has no tag, and Boost carries "Planned".
- Hovering a row tints its ground and slides its arrow 4px (150ms).
- Clicking a row scrolls to that floor of the climb. Boost doesn't link. The rows also work as a table of contents for readers who skim.

**Facade** (~15 words): a 320px full-bleed band of the lit-windows photo with a hard bottom edge and no fade. Under it, on solid dark, sit "How it works" and "Follow your Bitcoin."
- While the band crosses the viewport, the photo pans 100px (object-position 100% to 0%). The windows sink, so you rise.

**Stage 1, the Climb** (pinned; five floors at 90vh each; ~30 words per floor):
- **Left, the rail.** A 1px vertical line with five ticks. Floor 1 is at the bottom, and the fill grows upward with progress. Clicking a tick scrolls to that floor's resting point (Lenis `scrollTo`, 1s, no lock).
- **Centre-left, the Car.** A 480×560 dark card that shows one masked app screen.
- **Right, the step.** A serif title and up to four sans lines.
- **Floors:**
  1. Bring it in: screen-account.
  2. Lend it: needs a new lend screen.
  3. Borrow against it: screen-borrow, the static LoanBar at 80/90, and the "You sign every move…" rule.
  4. Trade it: screen-trade.
  5. Let a manager run it: screen-earn, with a primeBTC/primeUSD toggle that swaps the Put in / Hold / Take out facts and the caution line.
- **Mechanics.** Each floor's scroll span is split: hold for 0–35%, move for 35–65%, hold for 65–100%.
  - During the move, the screens in the Car **drop down** by one card height, tied 1:1 to scroll position. The next floor comes in from above, the way floors pass an elevator window.
  - The step text swaps at 50%: the old text fades out in 150ms and the new text fades in over 200ms, coming in with a 12px drift downward.
  - There is no snapping, and 70% of each span is at rest.

**Stage 2, the View** (the same sticky element, 150vh):
- After floor 5, the penthouse photo drops into the Car like one more floor.
- From 20% to 80% of the stage, the Car's clip-path opens from the card's rectangle to the full viewport, with the corner radius going from 12 to 0. The image doesn't scale; the window just gets bigger. The rail and the step fade out during the first 20%.
- It ends on the full-bleed photo with no text on it, then the sticky releases. On solid dark below, ~20 words: "$2T+ in Bitcoin, mostly sitting idle." / "Put yours to work." / "Get early access" / "Deposits aren't open to everyone yet."

**FAQ** (light grey): four V7 questions as an accordion (250ms height). About 25 words show while it's closed.

**Footer**: a minimal line, then Arch's own footer.

## 3. Upward mobility, through interaction only
- Three things move against the normal scroll direction: the facade pans down, the screens in the Car drop, and the step text drifts down.
- The rail fills from the bottom up.
- The reward sits at the top: the window you've been watching the floors through opens into the view.

No new shapes or motifs are added.

## 4. Fixing image on image
- Only one photo is ever on screen.
  - The white Lobby separates the hero from the facade.
  - Five floors of solid dark separate the facade from the view.
  - The grey FAQ separates the view from Arch's footer photo.
- No words are set on a photo. The facade and view headlines sit beside them on solid ground.
- The app screens are UI on the card's ground, not photos.

## 5. Motion budget and phone
**What moves on its own:** only the hero's fade-in on load. Nothing loops.

**What moves when the reader scrolls** (reversible): the hero parallax, the facade pan, the rail, the drop in the Car, the text swap and the window opening.

**What moves when the reader clicks:** the Lobby rows, the rail ticks, the vault toggle, the FAQ and the sign-up.

**Reduced motion:** nothing pins. The floors stack as static card-plus-text blocks, and the view is a plain photo.

**Phone (<768px):** nothing pins.
- Hero: uses hero-ascent-mobile.webp.
- Lobby: rows stack and tapping one scrolls to its floor.
- Facade: 200px tall, pans 60px.
- Floors: each is a card (full width inside 16px gutters, 4:5) followed by its text. The screen inside drops from −24px once, over 400ms, when the card is 40% visible (IntersectionObserver).
- Rail: becomes a sticky 2px line in the left gutter that fills bottom-up across the section.
- View: a 4:5 crop. Its clip-path inset opens from 16px to 0, tied to scroll, as the photo moves from 80% to 30% of the viewport. The text sits below.

## 6. Build notes
- **Route and copy:** add `src/app/prime-v8/{page.tsx, prime-v8.css}`. Put the copy in `src/data/prime-v8.ts`, rebuilt from `V7` with a `floors[]` array.
- **Components** (`src/components/prime-v8/`): `Lobby`, `Facade`, `Climb` (`Rail`, `Car`, `FloorCopy`, `VaultToggle`), `ViewCopy`.
- **Reuse:** `Street` (prime-v7/bookends) for the hero, `Faq`, `LoanBar` (prime-v7/flow), `Mark`, `EARLY_HREF`.
- **`useStageProgress(ref)`:** one rAF on the Lenis `scroll` event.
  - It computes `p = clamp(-rect.top / (rect.height - innerHeight))`.
  - It writes the CSS vars `--drop` (px) and `--open` (0–1) on the stage, and calls `setFloor` only when the floor index changes, so React doesn't re-render every frame.
- **The Car:** an overflow-hidden card holding a strip ordered floors 5→1, which starts at −4H.
  - Each floor adds +H, so the strip moves down.
  - The view is a separate full-viewport layer, clipped to the Car's rectangle (measured on resize). It comes in from −H to 0, then its `clip-path: inset()` is driven toward 0 by `--open`.
- **Don't reuse chain-how's snap.** Its virtual-scroll lock is exactly the scroll-jacking this concept rules out.
- **Test in Playwright WebKit.** Don't use filter blur anywhere.
- **Assets:**
  - Facade: crop `prime/hero.webp` to 2880×815 and save as `v8/facade.webp`. Its bottom 25px is a light strip.
  - View: make `v8/view.webp` from city-top.png, plus a 1080×1350 phone crop centred on the Empire State (x≈1000 of 1920).
  - Screens: width-fit to 400px inside the card, top-aligned. The borrow screen is cropped below its LTV meter.
- **New assets needed:**
  - A masked **lend screen**. Until it exists, crop screen-portfolio. Don't use ui-earn-app.webp, which shows figures.
  - A square crop of the wide trade screen.

## 7. Two biggest risks
1. **Motion that goes against the scroll can look like a bug.** If the drop is too gentle, nobody notices it. If it's too strong, it reads as a glitch or makes people queasy. Before committing, prototype three strengths. If none works, fall back to the normal direction and let the rail alone carry the rise.
2. **The climb is long and the reward comes last.** It's about six viewports of pinned dark before the view and the closing button, so skimmers may leave. If the window opens slowly, it will also look like a rerun of v6's window. To limit this:
   - Keep the button in the hero.
   - Let the Lobby rows and rail ticks jump ahead.
   - Keep floors at 90vh or less.
   - Keep the opening a plain rectangle, over no more than 0.6 of a viewport.

I checked the assets and reference files that shape these notes:
- /Users/nkubach/Desktop/Claude Code/arch-website/src/data/prime-v7.ts
- /Users/nkubach/Desktop/Claude Code/arch-website/src/components/prime-v7/flow.tsx
- /Users/nkubach/Desktop/Claude Code/arch-website/src/components/chain-how.tsx
- /Users/nkubach/Desktop/Claude Code/arch-website/public/img/prime/hero.webp
- /Users/nkubach/Desktop/Claude Code/arch-website/public/img/prime/ui-earn-app.webp
- /Users/nkubach/Desktop/Claude Code/arch-prime-portfolio-next/public/assets/photo/city-top.png

I couldn't see the lead's Figma frame: the Figma connector needs to be authorised in the claude.ai connector settings. This concept is based on the written description of the frame.

######## concept:operable

# v8 concept: "Floor by Floor"

## 1. Big idea
The dark tower works like a lift the reader drives. Each floor is one thing Arch Prime does, shown as a small control they use instead of a paragraph they read. At the top, the card they've been using opens onto the penthouse view.

## 2. Flow

**Hero (~20 words).** Keeps the lead's layout: v7/hero.webp, the lockup, the serif H1 "Put your Bitcoin to work.", the one-line sub and the orange "Get early access" button. The button scrolls to the sign-up form at the top floor. On load, only the text fades in (500ms). This is the only place text sits on a photo.

**Lobby, in the empty white band (~75 words).** Left: "$2T+" and "in Bitcoin, mostly sitting idle. Choose what your Bitcoin does." Right: a directory of six rows with hairlines, each with its number on the right and one plain line of copy:
- 01 Bring it in
- 02 Lend
- 03 Borrow
- 04 Trade
- 05 Let a manager run it
- 06 Boost, greyed and marked "Planned". It is not a link.

On hover the row shifts 4px and an ↑ appears. A click scrolls to that floor through Lenis (1.2s), and the tower opens with that floor already active. This is the page's table of contents and the first thing the reader uses.

**The tower.**
- **Entry:** the windows photo as a clean strip about 420px tall that fades into the dark. Nothing sits on it. Below, on solid dark: an eyebrow and the H2 "Take it up, one floor at a time." (~12 words).
- **Pinned stage (the lead's layout):** a 480px card on the left stays pinned at viewport centre. Step blocks on the right scroll past, about 70vh apart. Each has a serif title and one line (~20 words).
- **Floor rail:** at the far right, with PH at the top and 01 at the bottom. The marker climbs as the reader scrolls down. Clicking a floor jumps to it.

What the card holds on each floor:
- **01 Bring it in:** a Bitcoin | Dollars toggle. It shows the BTC mark turning into aBTC, or $ into aUSD (250ms swap). The choice carries upward to floors 02 and 04 and to the sign-up form.
- **02 Lend:** the reader's coin, plus three borrowers, each shown with more collateral than loan. Pressing "Lend" slides the coin into the market (400ms), and one interest dot travels back to "You" (600ms), once per press. It ends in a "Lent" state with a "Take it back" button. Chip: Preview.
- **03 Borrow:** a segmented loan-to-value meter based on screen-borrow.png, with ticks at 80% and 90%.
  - Dragging the handle fills the meter. It stops hard at 80% with a 120ms spring and the label "The most you can borrow".
  - A "Bitcoin's price: Holds | Falls" toggle pushes the same loan higher. From 80% it crosses 90%, and the label changes to "Past here, some Bitcoin can be taken to repay". A small loan barely moves.
  - There is no numeric readout.
  - The step line carries the rule: "You sign every move; only a loan past 90%, or a vault's manager, moves funds without you."
- **04 Trade:** an aBTC ⇄ aUSD pair. The flip button swaps them (a 300ms turn on the button only). One row reads "See the rate before you sign."
- **05 Manager:** a primeBTC | primeUSD toggle, a fact sheet (Put in / Hold / Take out) and the caution line. Chip: Preview.
- **06 Boost:** the card is an empty greyed frame that says "Not built yet." There is no control.

**Penthouse, merged into the tower (~45 words).**
- **Reveal:** over the last 120vh of the pinned stage, the card crossfades to v8/penthouse.webp, cropped on the Empire State. Its clip-path then grows from the card's shape to the full viewport. The grow follows scroll and reverses if the reader scrolls back up. The step column fades out and the rail marker lands on PH.
- **After unpinning:** the photo scrolls away. Below it, on solid ground: the eyebrow "Early access", the H2 "Save your place at the top." and the v7 body line "Signing up moves no money."
- **Form:** inline, with email, a Bitcoin / Dollars / Both choice preselected from floor 01, and the submit button.

**FAQ.** Uses the lead's split: "Before you sign up." on the left and the four v7 questions on the right. Answers open on click (reuse faq.tsx).

**Footer line**, then Arch's own footer.

## 3. Upward mobility
- The reader scrolls down and the rail marker moves up. Floor numbers count from 01 to PH.
- The floors go from simplest to most involved, so the reader gets more capable with each floor. Their choices carry up with them.
- The view is earned: the card they've been using is what opens onto it. Nothing decorative is added.

## 4. Image on image
- **One photo per viewport at most.** The order is hero, white lobby, windows strip, at least one viewport of solid dark, then the penthouse. The penthouse only appears inside the card, well after the windows strip has scrolled away.
- **No text on the windows or penthouse photos.** The tower H2 moves under the fade, and the penthouse copy sits under the photo.
- **The penthouse is not a second stacked band.** It is the card's last state.

## 5. Motion budget
- **Runs on its own:** the hero text fade and the card and rail changes tied to scroll position (220ms crossfade). The penthouse grow is tied to scroll.
- **Moves only when the reader acts:** everything else. There are no loops and no idle motion.
- **Reduced motion:** swaps become cuts, and the penthouse grow becomes a single cut halfway through.

On phones (under 768px):
- Nothing is pinned. Each floor stacks its title, line and card at full width minus 32px.
- The rail becomes a sticky pill reading "Floor 03 ↑". Tapping it opens a sheet listing the floors.
- Lobby rows are 56px tall.
- The borrow handle is 44px, and its track uses `touch-action: pan-y` so vertical scrolling still works. All toggles are 44px.
- There is no penthouse grow. penthouse-mobile.webp runs full width with the form below it.
- The hero uses hero-ascent-mobile.webp and the windows strip uses tower-mobile.webp.

## 6. Build notes
- **Route:** `src/app/prime-v8/` (page, layout, prime-v8.css). Copy goes in `src/data/prime-v8.ts`, restructured from prime-v7.ts, with 80 from `LENDING.maxLtv` and 90 as `LIQ`.
- **Components:** in `src/components/prime-v8/`: lobby, tower, floor-rail, stage-card, `floors/{bridge,lend,borrow,trade,vault,boost}`, penthouse, early-access-form. Reuse `Mark` from prime-marks.tsx, `useInView` and faq.tsx.
- **State:** `TowerContext { floor, asset: 'btc'|'usd' }`.
- **Active floor:** an IntersectionObserver on the step blocks with `rootMargin "-50% 0px -50% 0px"`. The card is keyed by floor and crossfades in CSS. The rail marker uses `translateY(slot*h)` over 300ms, with slots ordered bottom-up.
- **Jumps:** `window.__lenis?.scrollTo(el, {offset: -0.35*innerHeight})`, falling back to `scrollIntoView`.
- **Penthouse grow:** the repo has no animation library, and none is needed.
  - On each Lenis `scroll` event, use rAF to read the runway's position into a progress value `p` between 0 and 1.
  - Measure the card's position with a ResizeObserver.
  - Set `clipPath = inset(t·(1−p) r·(1−p) b·(1−p) l·(1−p) round 16·(1−p)px)`.
  - The photo is one layer inside the same pinned container, so there is no handoff between sections.
- **Borrow meter:** a native `<input type=range max=80>` laid over a drawn 0–100 track, which gives the hard stop and keyboard access for free. With "Falls" on, the fill is the loan divided by 0.85. That constant is never shown on the page.
- **Assets:**
  - Hero: v7/hero.webp and hero-ascent-mobile.webp.
  - Windows strip: v8/tower.webp and tower-mobile.webp. **Both have a near-white strip about 35px tall at the bottom (rows ~805–839 of 840).** Re-export them at 804px tall or clip the strip in CSS, or it will show as a white line in the dark.
  - Penthouse: v8/penthouse.webp (the same image as city-top.png) and penthouse-mobile.webp. The card crop uses `object-position: 52% 35%`.
  - App screens: screen-borrow, screen-trade and screen-earn are visual references for the card controls, not images on the page.
  - No new assets are needed.

## 7. Risks
1. **It may read as a fake app.** Controls that look like the product but move nothing can feel broken or seem to promise figures. Mitigations: no amount fields, a "Try it, nothing moves" chip on each card, and a default state on every card that makes sense without touching it.
2. **Length and pinning.** Six floors plus the penthouse runway add up to about six screens of pinned dark. Readers who never interact get a slideshow, and some may find the upward marker backwards. Test 70vh against 50vh per floor. If it's still long, merge Trade into Bring it in.

Nothing was built and no files were changed.

######## concept:editorial

# The Directory

**Big idea:** the page reads like a building's lobby directory. There is one floor, one statement and one new term at a time. As you rise, the type gets bigger and the space around it gets wider. The top floor says four words, and the view has no words on it.

## 1. Flow

**Hero (100vh).** This keeps the lead's frame: `v7/hero.webp`, the lockup, "Put your Bitcoin to work.", the sub line and one button.
- **On load:** the headline words rise 12px and fade in, 60ms apart, 600ms in total. The button arrives at 500ms. It then stays still. About 25 words.

**Ground floor (the white band, about 110vh).** The lead left this band empty, so it becomes the problem statement and the table of contents.
- It opens with "$2T+ in Bitcoin, mostly sitting idle." at display size.
- Under it is a sans paragraph that fills in as you scroll: "Lend it and earn interest. Borrow dollars against it instead of selling. Trade it for dollars and back. Or let a manager run it."
- **Scroll:** words go from 0.3 to 1 opacity. Filling starts when the paragraph's top reaches 85% of the viewport and finishes by 40%. It reverses if you scroll back.
- **Click:** the four verbs are links. Clicking one runs `lenis.scrollTo` (1.1s) to its floor.
- About 45 words.

**The tower (dark).**
- **Lobby.** The facade photo is a text-free plate, 70vh tall. Its lower third fades into the ground colour. As you scroll, it drifts *down* by 15% of its height (a slow-scroll parallax), so the outside slides past like the view from a rising lift.
- **Header.** "How it works / Follow your Bitcoin." sits on solid ground. It starts only where the photo has reached 0% opacity.
- **Floors 1 to 5.** The lead's arrangement stays: a sticky 480px card on the left and step blocks scrolling on the right.
  - The floors are: 1 Bring it in, 2 Earn, 3 Borrow, 4 Trade, 5 Let a manager run it.
  - Each block has a serif title, a 3–4 line description that fills in as you scroll, and one or two *defined terms* with a dotted underline: aBTC; interest; 80% and 90%; the rate; primeBTC.
  - **Scroll:** when a floor crosses the centre line, the card crossfades to that floor's masked app screen (240ms in, 160ms out).
  - **Hover, focus or tap on a defined term:** an orange ring (2px, 280ms move) circles the matching part of the screen. The term's plain definition, taken from the copy file, appears under the card as a caption. It ends in place and clears on mouseleave, or on the next tap.
  - About 30 words per floor.
- **Top floor.** "You sign every move." is set at the largest size on the page after the hero, and fills in as you scroll. Under it are the rules line and "Withdraw to your wallet as aBTC or aUSD." About 35 words. Then 40vh of empty ground.

**Penthouse (90vh plate).** This is `city-top` with no text on it.
- **Scroll:** the image, scaled to 1.12 inside its frame, moves up 10% across its passage. The eye lifts from the desk to the skyline.
- **Caption band underneath,** on the dark ground: "Put yours to work." (serif) on the left; the button and "Deposits aren't open to everyone yet." on the right. About 12 words.

**FAQ (light grey).** "Before you sign up." is on the left. The four vetted questions sit on the right, closed. Clicking one opens it with a grid-rows 0fr→1fr animation (240ms), and only one is open at a time. It shows four rows, not the lead's five, so no question is invented. About 25 words when closed.

**Footer.** The existing `PrimeFooter` line.

## 2. The climb, without motifs

- **A directory index.** A sticky, small-type list sits in the right margin, ordered like a lift panel: Top, 5 Vaults, 4 Trade, 3 Borrow, 2 Earn, 1 Bring it in. Boost is a dim row marked "Planned" that can't be clicked.
  - An orange tick marks the current floor. It moves **up** the list (300ms) while the reader scrolls **down**, so going down the page means climbing.
  - Clicking a floor jumps to it. The index fades in at the lobby and fades out at the penthouse.
- **Scale and space.** Floor titles grow one step per floor: 32, 40, 48, 56 and 64px, then 112px at the top. The space between floors grows from 70vh to 95vh. The climb still reads with the images switched off.
- **Bookends.** The idle $2T+ at ground level is answered by "Put yours to work." under the view.

## 3. Fixing "image on top of image"

- There is only one photograph in any viewport. There are at least 100vh of photo-free space between photos: the Ground band separates the hero from the facade, and the floors separate the facade from the penthouse.
- No text sits on the facade or the penthouse. Type starts only where the fade has become solid ground. The penthouse copy moves into its caption band.
- The card holds app screens, which are clearly UI rather than photography.

## 4. Motion budget and phone

**Moves on its own:** only the hero load-in, once. Nothing loops.

**Moves only with the reader:** the text fills, the two photo drifts, the card crossfade, the index tick, the term rings and the FAQ.

**Reduced motion:** text is fully filled, the drifts are off and the crossfades are instant.

**Phone (390px):**
- **Hero:** uses `hero-ascent-mobile.webp`, with the same load-in.
- **Ground floor:** $2T+ at 56px; the fill and verb taps work the same.
- **Lobby:** a 55vh plate focused on the windows on the right (object-position about 70%), with an 8% drift.
- **Floors stack:** title (28px up to 44px), description filling in, then that floor's screen inline at full width. Tapping a term rings the screen and shows the definition below it.
- **Index:** becomes a one-line sticky readout under the nav, "Floor 3 of 5 · Borrow". The number rolls upward (250ms) on each change.
- **Penthouse:** 70vh, focused on the Empire State Building (about 52% x), with the same lift.
- **Button pill:** `MobileCta` hides over the hero and the penthouse.

## 5. Build notes

**Where it goes:** `src/app/prime-v8/`, using the v7 layout shell: Nav, SmoothScroll, EarlyAccess, MobileCta, PrimeFooter and VersionSwitch. The `Faq` component and `EARLY_HREF` are reused. Copy goes in `src/data/prime-v8.ts`, restructured from V7.

**New components** in `src/components/prime-v8/`:
- **`useScrollProgress(ref, start, end)`:** subscribes to `window.__lenis` `scroll` (falling back to the window scroll event). It reads the element's position once per frame and writes the result to a CSS variable (`--p`). It sets no React state.
- **`FillText`:** splits the text into word spans carrying `--i`, with `--n` set on the parent. Each word gets `opacity: clamp(.3, calc(var(--p)*var(--n) - var(--i)), 1)`. The full text stays in the DOM for screen readers.
- **`Plate({src, drift})`:** an overflow-hidden frame. The image's translateY is set to `(p - .5) * drift`.
- **`Floors`:** built from a `FLOORS[]` array, where each entry has `{id, title, size, body, terms:[{word, def, ring:[x,y,w,h]%}], screen}`.
  - An IntersectionObserver with rootMargin `-45% 0px -55% 0px` sets `active`. That changes at most 6 times, so it can be React state.
- **`ScreenCard`:** stacks all the screens and toggles their opacity. The ring is one absolutely positioned div that moves between rects measured per screen.
- **`DirectoryIndex`:** buttons that call `lenis.scrollTo(el, {offset: -0.3*vh, duration: 1})`.
- **`View`:** the penthouse plate plus its caption band.

**Assets:**

| Where | File |
|---|---|
| Hero | `v7/hero.webp` |
| Facade | `prime/hero.webp` |
| Penthouse | `city-top.png`, converted to `public/img/prime/v8/view.webp` at about 2400w |
| Floor 1 | `v8/screen-holdings.png` |
| Floor 2 | `screen-account` (ring on Supplied) |
| Floor 3 | `screen-borrow` (ring on the LTV meter) |
| Floor 4 | `screen-trade`, letterboxed (ring on Received Token Est.) |
| Floor 5 | `screen-earn` (ring on the Mint primeBTC tab) |

**New assets needed:**
- A cropped `v8/facade.webp`. The facade image has a light strip about 36px deep along its bottom edge.
- `screen-holdings.png`, cropped from the Holdings card (bottom left) of `screen-portfolio`.
- The ring rects, measured once per screen.

## 6. Risks

1. **Slow or grey text for skimmers.** Five floors with scroll-filled text make a long page. A fast skimmer sees grey words and a card that keeps changing. *Mitigation:* each fill finishes by 40% of the viewport, the minimum opacity is 0.3, and test the total length early (target 4–5 screens for the tower).
2. **The climb may go unnoticed.** Without motifs, the climb depends on people noticing the growing type and the rising index. If they don't, this is a tall, generic dark sticky-scroll section. *Mitigation:* make the index tick and the numeral roll clearly visible, and test with three people who haven't seen it: ask "where are you?" halfway down.

Note: the Figma frame couldn't be opened here because the Figma connector needs to be authorised (in claude.ai connector settings, or via `/mcp`). This concept follows the layout as described in the brief.

######## concept:product

# The Lit Floor

**Big idea:** In the dark tower, the only lit window is the app itself: one real panel you can touch, which changes floor by floor as you climb. Your account climbs with you until the panel opens into the penthouse view.

## 1. Flow

**Hero (100svh, max 760px).** `v7/hero.webp`, the lockup, "Put your Bitcoin to work.", the sub and the orange button. Text sits only on the flat sky. On load the text fades up 12px over 500ms, once. About 20 words.

**Lobby (the white band, about 640px).** Left: "Choose what your Bitcoin does." with the aBTC/aUSD sub. Right: a directory of 01 Earn, 02 Borrow, 03 Trade and 04 Vaults, each with its one line from the copy, plus a dimmed row for Boost, marked Planned. Hovering a row lifts it 2px and shows an up-arrow. Clicking scrolls to that floor with Lenis (900ms). *Why add it:* people who scan get the whole map, and a way to skip floors, before the long climb. About 70 words.

**The tower (dark)**
- **Facade.** The windows photo, full-bleed at about 420px, fading into the section navy over its bottom 40%. No text on it. Below it, on solid dark: eyebrow "How it works" and "Follow your Bitcoin."
- **Stage.** A 100vh sticky area with 80vh of scroll per floor. Left side: a floor counter (01–04, then PH) that you can click, and next to it the panel (about 440×560) in the app's own light UI. Under the panel, "Your account": one bar split into the app's three parts (Available, Supplied, Collateralized). Right side: the step blocks scroll normally. Each has a serif title, 2–3 lines, and a one-line hint for what to try.
- **What happens when the floor changes** (the step block crosses the middle of the screen): the old panel moves up 16px and fades while the new one comes in from 16px below (400ms). The counter's new number rolls up from below (300ms). The account bar re-divides (600ms). Then everything stays still.
  - **01 Earn.** A lend panel with a pill you click to switch between aBTC and aUSD (200ms). The account bar moves part of Available into Supplied. About 30 words.
  - **02 Borrow.** aBTC in, aUSD out, and the app's segmented meter, which you can drag. The fill stops at 80% with a one-segment bounce (150ms) and the label "80% · the most you can borrow". Segments past 90% are hatched; hover or focus shows "Past here, some Bitcoin can be taken to repay." The LTV chip uses words ("Room to spare" / "At the limit"). The rules line sits under the text. Available moves into Collateralized. About 55 words.
  - **03 Trade.** The swap panel, stacked. Clicking the arrow swaps the two token pills (350ms) and turns the arrow 180°. The token dot on Available flips between Bitcoin and dollars. About 25 words.
  - **04 Vaults.** Tabs for primeBTC, primeUSD, and Boost (Planned, disabled). Clicking a tab crossfades the "Put in / Hold / Take out" rows (200ms). The caution line and the "Preview" tag always show. A primeBTC chip ("your share") joins the account bar. About 60 words.
  - Each panel's button reads "Get early access" and opens the existing sign-up dialog. Panels take no numbers; values show as the app's `[---]`.

**Penthouse (moved into the end of the stage, not stacked under it).** It gets its own 100vh of scroll, and it is the only animation tied directly to scroll position:
- From 0% to 20%, the panel, the text and the counter fade out.
- From 10% to 100%, a full-screen photo layer grows out of the panel's frame until it fills the screen. The counter shows PH last.
- The stage then lets go, and the photo scrolls away as a plain full-bleed image with no text on it.

**Close (solid band under the photo).** "$2T+" / "in Bitcoin, mostly sitting idle." / "Put yours to work." with the button and "Deposits aren't open to everyone yet." About 20 words. *Why put it here:* the ask comes straight after the reward.

**FAQ (light grey).** Left: "Before you sign up." Right: the four vetted questions. One opens at a time on click (250ms).

**Footer.** The existing `PrimeFooter`.

About 250 words show before anyone clicks.

## 2. How the climb reads as going up
- The floor counter goes up while you scroll down, and each new number rises in from below.
- The stage background lightens by one step per floor, from the section navy toward the dusk blue already in the penthouse photo (600ms per step).
- The panel is the only lit thing in the dark. The lit window *is* the product; no drawn windows.
- The account builds up: it starts all Available and ends with every job running. Progress shows as height.
- You arrive when the view opens out of the panel's own frame.

## 3. Fixing "image on top of image"
- Only one photo is on screen at a time. The lobby and the stage (solid colour) separate the hero, the facade and the penthouse.
- No text sits on the facade or the penthouse; their text goes on solid ground below them. Hero text sits only on the flat sky.
- The penthouse comes out of the stage instead of being a photo section stacked under the dark one.

## 4. Motion budget and phone
- **Moves on its own:** only the hero fade, once. Nothing loops; no idle motion; no parallax.
- **Moves when the reader acts:** panel changes, the counter, the account bar and the background when scrolling passes a floor; the penthouse reveal with scroll; clicks, drags and hovers inside panels; the FAQ.
- **Reduced motion, or when `PIN_QUERY` is false:** nothing pins, floors stack, changes are instant, and the penthouse is a plain image.

**Phone (under 768px):**
- Nothing pins. Each floor stacks: number, title, text, then its panel at full width.
- The floor number and the account bar become a 44px bar stuck to the bottom of the screen while the tower is in view. Add the tower to `hideOver` so the `MobileCta` pill hides there.
- The meter uses pointer events, with `touch-action: none` on the handle only.
- Hover reveals become a tap on an (i) icon.
- The penthouse is a normal image, a 4:5 crop centred on the Empire State.
- Hero: `hero-ascent-mobile.webp`. Facade: 240px tall, `object-cover`.

## 5. Build notes
**Data:** `src/data/prime-v8.ts`, already imported by `src/app/prime-v8/layout.tsx`. It holds `floors[]` as `{id, n, title, line, hint, alloc, ground}`, using the `V7` strings.

**Components** in `src/components/prime-v8/`: `Hero`, `Lobby`, `Facade`, `Stage`, `FloorRail`, `LitPanel` (switching between `LendPanel`, `BorrowPanel` + `LtvMeter`, `TradePanel`, `VaultPanel`), `AccountStrip`, `PenthouseReveal`, `Close`, `Faq`.

**Reuse:** `Mark`, `Eyebrow`/`PrimeButton` from `prime-ui`, `EarlyAccess`, `PIN_QUERY`, and the clamp logic in `LoanBar` (`prime-v7/flow`).

**Interaction logic:**
- **Active floor:** an IntersectionObserver with `rootMargin: "-50% 0px -50% 0px"` on the step blocks calls `setActive(i)`. Panels are keyed by `i` and animated with CSS via `data-state`.
- **Background:** the `--ground` variable is set from `floors[active]`, with a 600ms transition.
- **Penthouse:** on Lenis scroll, `p = clamp(-runway.top / (runway.height - vh))`. Record the panel's rectangle at `p=0` (and again on resize), then ease `clip-path: inset()` from that rectangle to 0 on the photo layer. Nothing else changes, so nothing reflows.
- **LtvMeter:** `role="slider"`, `aria-valuetext` in words, arrow keys move one segment, value clamps at 80.

**Assets:**
- Hero: `v7/hero.webp`.
- Facade: new file `v8/facade.webp`, re-exported from `img/prime/hero.webp` without the light strip along its bottom edge.
- Penthouse: new files `v8/penthouse.webp` (2400px wide) and `v8/penthouse-mobile.webp` (portrait), made from `arch-prime-portfolio-next/public/assets/photo/city-top.png`.
- Panels are built in code to match `v6/screen-*.png`; none of those PNGs ship in the stage.

## 6. Two biggest risks
1. **The pinned climb is long.** About 420vh of dark pinned scroll is a lot for someone who just wants the button. The lobby jumps, the clickable counter and 80vh floors reduce it. It needs testing to see whether the climb feels like momentum or like a toll.
2. **Panels that look real invite real use.** People will try to type amounts or think the app is open, and the rebuilt panels will drift from the real app. Keep no number inputs, `[---]` values, the "Preview" tag, and a button that names the real action. Add one caption under the panel: "A preview of the app. Nothing here moves money."

######## judge-spec

**Note:** I couldn't open the lead's Figma frame because the Figma connector isn't authorised. Authorise it in claude.ai connector settings, or with `/mcp` in an interactive session. This spec follows the written description of the frame.

# A) Ranking

**1. Concept 4, "The Lit Floor" (spine).**
- It keeps the lead's layout: windows photo, then the sticky card on the left with steps on the right, then the penthouse. The card becomes the real product, so the dark floors have substance instead of a placeholder square.
- The climb comes from interaction and changing state, not drawings: the account fills up, the background gets lighter, the floor counter rises. Only one photo is ever on screen, and the penthouse opens out of the card instead of being stacked under it.
- It has the shortest pinned stretch (4 floors). The main cost is rebuilding the panels, but they are simple forms. Its phone bottom bar clashes with the MobileCta pill, so that part is replaced below.

**2. Concept 2, "Floor by Floor".**
- It has the best single interaction of the four: a "Bitcoin's price: Holds | Falls" toggle pushes a loan past 90%, which teaches liquidation in one tap. The native range input also gives a real hard stop at 80% and keyboard access for free.
- But it has six floors, one of them an empty "Not built yet" floor. It adds a drawn lend market (a new motif) and an inline form that duplicates the existing sign-up dialog. That makes it the longest and heaviest to build in a day.

**3. Concept 1, "The Lift".**
- It is the cheapest to build (static screens, one scroll hook) and the most literal elevator.
- But the reader only watches; nothing is operated. Motion against the scroll direction can look like a bug. The hard-edged facade drops the lead's fade. The ending (a window opening onto the view) is the closest to v6, and there are about 6.5 screens of pinned dark before the ask.

**4. Concept 3, "The Directory".**
- It is the most restrained, and "the climb still reads with the images switched off" is a clever idea.
- But it is closest to v7's minimalism, which is exactly what the lead called incomplete. Grey text that fills in as you scroll is slow for skimmers and a trend cliché. The term rings need measuring on every screen, and the penthouse is a passive image.

# B) v8 build spec: "The Lit Floor"

**Grafts onto concept 4's spine:**
- **From concept 2:**
  - the Holds | Falls price toggle;
  - the native range input with its hard stop at 80%.
- **From concept 1:**
  - the facade pans downward as it crosses the screen ("the windows sink, so you rise");
  - the rail fills from the bottom up;
  - the image doesn't scale, only the window grows;
  - the phone penthouse clip opens from a 16px inset to 0;
  - no snapping or scroll lock (don't reuse chain-how's snap);
  - no blur anywhere; check in Playwright WebKit.
- **From concept 3:**
  - the rail reads like a lift panel (Top at the top, a marker climbing while you scroll down);
  - on phones, a sticky "02 of 04 · Borrow" readout whose number rolls upward;
  - the tower header starts where the fade is already dark;
  - four FAQ questions, none invented.
- **From concepts 1, 2 and 4:** the white band becomes a directory that doubles as a table of contents.

**One change from all four concepts:** the closing words sit on the penthouse photo, over a left scrim, as in the lead's own frame. The reward and the ask land in the same frame. On phones the words move below the photo.

## Existing files, and what's new
- `src/app/prime-v8/layout.tsx` already exists: Nav, SmoothScroll, PrimeFooter, EarlyAccess, MobileCta and VersionSwitch (which already lists v8). It imports `V8` from `src/data/prime-v8.ts`, which does not exist yet.
- **New files:**
  - `src/data/prime-v8.ts`
  - `src/app/prime-v8/page.tsx`
  - `src/app/prime-v8/prime-v8.css`
  - `src/components/prime-v8/`: `lobby.tsx`, `facade.tsx`, `climb.tsx` (Stage, Steps, Rail, AccountStrip, StageView, Readout), `panels.tsx` (PanelShell, LendPanel, BorrowPanel with Meter, TradePanel, VaultPanel), `view.tsx` (ViewCopy, and ViewStandalone for phones)
- **Reuse:**
  - `Street` from prime-v7/bookends
  - `Faq` from components/faq
  - `Mark` from prime-marks
  - `EARLY_HREF` from data/prime-v6
  - `PIN_QUERY` from prime-v6/window-stage
  - `/img/prime/arch-prime-logo-light.svg`
- Local only. No git.

## Two layout modes, chosen by CSS (no jump at hydration)
- **Pinned mode:** the CSS media query `(min-width:768px) and (min-height:640px) and (prefers-reduced-motion:no-preference)`, which is the same as `PIN_QUERY`.
- **Stacked mode:** everything else (phones, reduced motion, short screens).
- Both markups render. CSS hides the one that doesn't apply:
  - `.v8-stage` and the in-stage view show only in pinned mode.
  - `.v8-inline-panel` and `#view` (standalone) show only in stacked mode.
- JS listeners attach only while `matchMedia(PIN_QUERY)` matches, and re-evaluate when it changes.

## Tokens (in prime-v8.css, inside `.prime-scope`)
- **Background steps up the climb:**
  - `--g0` `#0a1226` (the facade fades to this; also floor 01)
  - `--g1` `#0e1a36` (floor 02)
  - `--g2` `#122245` (floor 03)
  - `--g3` `#172b56` (floor 04)
- **Account part colours:**
  - Available: `rgba(255,255,255,.35)`
  - Lent: `#00a032`
  - Backing a loan: `#2f97ee`
  - In a vault: `#EF8E16` for primeBTC, `#2e714b` for primeUSD
- **Easing:** `--ease-out: cubic-bezier(.22,1,.36,1)`
- **No `filter` or `backdrop-filter` blur anywhere.**

## Copy (`src/data/prime-v8.ts`)
Built from V7. Lines written new for v8 are marked NEW.

```ts
import { V7 } from "@/data/prime-v7";
import { LENDING } from "@/data/prime-data";
export const V8 = {
  meta: V7.meta, footer: V7.footer, early: V7.early, cta: V7.cta,
  pillHidden: ["street", "view"],
  hero: V7.hero, // h1 "Put your Bitcoin to work." · sub "Lend it, borrow dollars against it, or trade it, on Arch Network."
  lobby: {
    label: "What it does", h2: "Choose what your Bitcoin does.", sub: V7.things.sub,
    rows: [
      { to: "earn",   n: "01", name: "Earn",   line: "Lend it out and earn interest.", tag: "Preview" },            // NEW (condensed V7)
      { to: "borrow", n: "02", name: "Borrow", line: "Borrow dollars against it instead of selling it.", tag: "Preview" },
      { to: "trade",  n: "03", name: "Trade",  line: "Swap Bitcoin and dollars. See the rate first.", tag: null },  // never "Live"
      { to: "vaults", n: "04", name: "Vaults", line: "Let a manager run it.", tag: "Preview" },
      { to: null,     n: "",   name: "Boost",  line: "Borrow against your vault holding to add more. Losses grow too.", tag: "Planned" },
    ],
  },
  tower: { label: "How it works", h2: "Follow your Bitcoin.",
    sub: "Bridge Bitcoin in as aBTC and connect your wallet. Pick a job; it starts when you sign. Withdraw to your wallet as aBTC or aUSD." },
  floors: [
    { id: "earn", n: "01", rail: "Earn", tag: "Preview", title: "Lend it.",
      body: "Lend it out. Borrowers put up more than they take, and pay you interest.",
      hint: "Tap the token to switch Bitcoin and dollars.", acct: { avail: 60, lent: 40, loan: 0, vault: 0 } },          // hint NEW
    { id: "borrow", n: "02", rail: "Borrow", tag: "Preview", title: "Borrow against it.",
      body: "Borrow dollars against your Bitcoin instead of selling it.", rules: V7.how.rules,
      hint: "Drag the loan to its limit. Then let the price fall.", acct: { avail: 25, lent: 40, loan: 35, vault: 0 } }, // hint NEW
    { id: "trade", n: "03", rail: "Trade", tag: null, title: "Trade it.",
      body: "Swap Bitcoin and dollars (aBTC and aUSD). See the rate first.",
      hint: "Flip the pair.", acct: { avail: 25, lent: 40, loan: 35, vault: 0 } },
    { id: "vaults", n: "04", rail: "Vaults", tag: "Preview", title: "Or let a manager run it.",
      body: "Put in aBTC or aUSD. A manager works to grow it, and you hold a share.",                                   // NEW, from V7 facts
      hint: "Switch between the two vaults.", acct: { avail: 10, lent: 40, loan: 35, vault: 15 } },
  ],
  loan: { max: LENDING.maxLtv, liq: 90, maxLabel: V7.how.loan.maxLabel, liqLabel: V7.how.loan.liqLabel,
    price: "If Bitcoin's price", holds: "Holds", falls: "Falls",
    chip: { room: "Room to spare", limit: "At the limit", past: "Some can be taken" } },                                  // NEW microcopy
  vaults: V7.vaults.items, boostTab: "Boost", planned: "Planned",
  account: { label: "Your account", parts: { avail: "Available", lent: "Lent", loan: "Backing a loan", vault: "In a vault" },
    caption: "A preview of the app. Nothing here moves money." },                                                         // NEW
  railTop: "Top",
  view: { h2: "$2T+ in Bitcoin, mostly sitting idle.",
    body: "Put yours to work. Leave your email and what you'd bring. We'll write when you can start. Signing up moves no money." },
  faq: { label: "Questions", h2: "Before you sign up.", sub: "Read these before you bring anything in.", items: V7.faq.items }, // sub NEW
} as const;
```

- **Panel microcopy (NEW):**
  - Lend: tabs "Lend" | "Withdraw"; "Amount"; rows "Interest you earn" and "Network fee".
  - Borrow: tabs "Borrow" | "Repay" | "Withdraw"; boxes "Put up" and "Borrow".
  - Trade: "You pay", "You get"; rows "Rate" and "Network fee".
  - Every row value is the app's `[---]`. Every panel button reads "Get early access" and links to `EARLY_HREF`.
- **Visible words** (FAQ and panels closed or at rest): about 20 (hero), 70 (lobby), 28 (tower), 115 (steps), 60 (panels), 17 (account), 36 (view), 30 (FAQ), 13 (footer), so about 390 in total.
- **Figures:** only $2T+, 80% and 90% appear, as the meter ticks and legend. The slider's `aria-valuetext` uses words.

## 1. `#street`, the hero
- **Component:** `<Street photo="/img/prime/v7/hero.webp" mobilePhoto="/img/prime/hero-ascent-mobile.webp">`. It keeps its existing 60px drift over the first 225px of scroll.
- **Desktop layout** (the lead's centred layout):
  - Children: `site-container flex flex-1 flex-col items-center justify-center text-center pt-28 pb-20`.
  - This puts the words inside the translucent arch's opening.
  - Lockup: 24px tall.
  - H1: serif, v7's H1 scale.
  - Sub: max-w 520, 18/28 at 80% white.
  - One wide orange button: h-14, min-w 280, radius 10, `--p-orange`, linking to `EARLY_HREF`.
- **Phone:** H1 48/52; the button is `w-full max-w-[320px]`.
- **Motion:** on load, `.v8-rise` runs once: opacity 0→1 and translateY 12px→0 over 500ms with `--ease-out`. Delays are 0, 80, 160 and 240ms for the lockup, H1, sub and button. Reduced motion: no animation.

## 2. `#lobby`, the white band (a directory and table of contents)
- **Desktop layout:**
  - `bg-white`, `py-[120px]`, min-height about 760px, 12-column grid.
  - Left, columns 1–5: label (14px `#6e6e6e`), serif H2 at 56/60, sub at 18/28 `#5c5c5c`.
  - Right, columns 7–12: five 72px rows with a `#dadada` hairline above each and one below the last.
  - Row layout: number (40px wide, 14px tabular, muted) | name (20px medium) | line (16px muted, flexible width) | tag chip | ↑ arrow.
  - The Boost row is a `div` at 45% opacity with `aria-disabled`, and it isn't a link.
- **Hover** (link rows only): background `#f7f6f6` over 150ms. The ↑ goes from opacity 0 and translateY 4px to 1 and 0 over 150ms.
- **Focus:** focus-visible shows a 2px orange ring with a 2px offset.
- **Click, pinned mode:** scrolls to floor i's resting point (see Climb). **Click, stacked mode:** `lenis.scrollTo(article, {offset: -140, duration: 1.2})`.
- **Phone:** rows are at least 64px tall, with the line wrapping under the name. No arrow.

## 3. `#tower`: the facade and the tower header (`data-nav-theme="dark"`, `bg:--g0`)
- **Asset prep.** tower.webp and tower-mobile.webp have a light strip in rows 805–839, so crop both to 800px tall:

```
cd ".../arch-website/public/img/prime/v8" && python3 - <<'PY'
from PIL import Image
for s,d in [("tower.webp","facade.webp"),("tower-mobile.webp","facade-mobile.webp")]:
    im=Image.open(s); w,h=im.size; im.crop((0,0,w,800)).save(d,"WEBP",quality=82,method=6)
PY
```

- **The band:**
  - Height: `clamp(360px,34vw,520px)` on desktop, 260px on phone.
  - The image layer: `picture` with facade-mobile below 600px, `object-cover`, positioned at `center 40%`.
  - Fade overlay: `linear-gradient(to bottom, transparent 30%, rgba(10,18,38,.6) 62%, #0a1226 100%)`.
- **Motion, the facade pan:**
  - The image layer sits at `top:-80px; height:calc(100% + 80px)`. Use -40px on phone.
  - `t = clamp((vh - rect.top)/(vh + rect.height))`, and the transform is `translate3d(0, t*80px, 0)`.
  - The image moves down relative to the band, so the windows sink and you rise.
  - One rAF on the scroll event. Reduced motion: off.
- **Header** (over the dark end of the fade, as in the lead's frame):
  - A site-container with `relative z-10 -mt-[150px]` (-72px on phone) and bottom padding of 12vh.
  - Label: 14px, white at 60%.
  - H2: sans, 48/52, medium, tracking -0.03em.
  - Sub: max-w 520, 18/28, white at 70%.

## 4. `#climb`, the pinned stage (`data-nav-theme="dark"`)

**Structure** (pinned mode):
- `section#climb` has `position:relative` and `bg:--g0`. Its children:
  1. `.v8-stage`: `position:sticky; top:0; height:100svh; overflow:hidden; z-0`.
  2. `.v8-steps`: `relative z-10; margin-top:-100svh; pointer-events:none`, with the blocks set to `pointer-events:auto`. Contents in order:
     - a 50svh lead-in spacer;
     - four step articles at 80svh each: `#floor-earn`, `#floor-borrow`, `#floor-trade`, `#floor-vaults`;
     - a 150svh spacer, `#top`.
- The column is 520svh tall, so the pin lasts 420svh of scroll. `U` is 1svh in px, measured as `stage.clientHeight/100`.

**Stage layout** (12-column site-container):
- **Rail:** in column 1, vertically centred.
- **Panel column:** columns 3–7, with the panel frame centred in it. The frame is 440×560 at radius 24, sitting 40px above the stage's centre.
- **AccountStrip:** under the panel.
- **Steps:** columns 8–12. Each block centres its content vertically.
- **Short screens:** the panel column scales by `Math.min(1,(innerHeight-220)/560)` (transform-origin top center), recomputed on resize.

**Scroll driver** (one window scroll listener with rAF; Lenis drives native scroll):

```
s = -section.getBoundingClientRect().top / U            // svh into the section
active = (s+50) < 50 ? -1 : Math.min(3, Math.floor(s/80))  // setState only on change
p = clamp((s - 320) / 100)                                 // the penthouse reveal
section.style.setProperty('--p', p); top = p > 0          // rail shows "Top" once the reveal starts
```

**When the active floor changes:**
- **Panels:** all four sit stacked in the frame, with `data-pos` set to `below`, `active` or `above`.
  - Below: opacity 0, translateY 16px.
  - Above: opacity 0, translateY -16px.
  - Opacity changes over 250ms and the transform over 400ms with `--ease-out`. The incoming panel is delayed 100ms.
  - Panels that aren't active are `inert`.
  - Going down the page, the old panel leaves upward and the new one rises from below. Scrolling back reverses it.
- **Background:** the stage's background-color changes to `--g0`, `--g0`, `--g1`, `--g2` or `--g3` (for active -1, 0, 1, 2, 3) over 600ms.
- **AccountStrip:** each segment's flex-grow moves to that floor's `acct` split over 600ms `--ease-out`, with 2px gaps. When active is -1, the split is 100% Available.
- **Step blocks:** the active block is at opacity 1 and the others at 0.3, over 300ms.
- **Rail:** a lift panel. Stops from top to bottom: "Top", "04 Vaults", "03 Trade", "02 Borrow", "01 Earn".
  - Labels are 13px, 36px apart. The inactive ones are white at 40% (70% on hover), the active one white.
  - A 1px line (white at 15%) runs from 01 up to Top. Its fill (white at 80%) grows from the bottom to the active stop with `scaleY` over 400ms.
  - Clicking a stop scrolls to it. Floor i: `lenis.scrollTo(sectionAbsTop + (40+80i)*U, {duration:1.2, easing: easeInOutCubic})`. Top: `+410*U`.
  - No lock, no snap. Fallback: `window.scrollTo` with smooth behaviour.
  - Hidden below 1024px.

**Step block content:**
- Number (13px tabular, white at 50%) plus a tag chip if the floor has one ("Preview": 12px, 1px white/20 border, rounded, px-2).
- H3 title: serif, 36/40, white.
- Body: max-w 420, 17/28, white at 75%.
- Rules (Borrow only): 15/24, white at 60%, mt-4.
- Hint: 14/20, white at 50%, starting with "←". On phone the arrow is "↓".

**AccountStrip:**
- "Your account" label: 13px, white at 50%.
- Bar: 440×6, radius 3.
- Legend: shows only the parts above 0, as 8px dots with 13px labels at 70% white, 16px gap.
- Caption: 12px, white at 40%, mt-10.

**The panels**, built in code to match `/img/prime/v6/screen-*.png` (reference only; the PNGs don't ship):
- **Shared panel styling:**
  - Frame: white, radius 24, padding 28, shadow `0 30px 80px rgba(0,0,0,.35)`. It is the only lit thing in the dark.
  - Tabs: 16px; the active tab `#292a2e` with a 3px underline over a `#d9d9d9` track.
  - Boxes: `#f4f4f4`, radius 18, padding 18. Box labels 14px `#8a8a8a`. Token pills: white, fully rounded, h-44, a 24px Mark plus a 17px name.
  - Rows: 36px tall; label 15px `#787878`; value `[---]`.
  - Button: `mt-auto`, h-52, radius 14, `#222`, "Get early access".
  - All panels share the fixed 440×560 frame so nothing jumps. On phone they are fluid width (max 440) with auto height.
- **LendPanel (01):**
  - Green underline.
  - The Amount box's pill toggles aBTC ⇄ aUSD on click: the Mark and label crossfade over 200ms and the pill width animates over 200ms.
  - Rows, then the button.
- **BorrowPanel (02):**
  - Tabs, then the "Put up" box with the aBTC pill and the "Borrow" box with the aUSD pill.
  - **Meter:**
    - 20 segments of 5%, h-28, 3px gap, radius 3.
    - Tick at boundary k sits at `left: calc(k*(100% + 3px)/20 - 1.5px)`. k=16 is labelled "80%" and k=18 "90%" (12px medium, with a 1×8px line).
    - Filled segments: 1–16 `#19a24a`, 17–18 `#ff8a3d`, 19–20 `#d93d1f`.
    - Unfilled: 1–18 `#e8e8e8`; 19–20 hatched with `repeating-linear-gradient(135deg,#e2e2e2 0 3px,#f6f6f6 3px 6px)`.
  - **Control:**
    - A native `<input type=range min=0 max=80 step=5 defaultValue=50>` over the track, from its left edge to the 80 tick, so the 80% stop is physical. The hit area is 44px tall.
    - Styled thumb: 14×40, white, radius 6, a 1px border at 15% ink, shadow.
    - When the value reaches 80 from below, segment 17 flashes `#ff8a3d` at 60% and back over 180ms (the "knock").
    - `aria-valuetext`: "A small loan" below 40, "A mid-size loan" from 40 to 75, "The most you can borrow" at 80.
  - **Price control:** a radio group, "If Bitcoin's price" [Holds | Falls], 32px tall, default Holds.
    - Displayed fill `f` = loan, or `min(100, loan/0.85)` when Falls is on. The constant is never shown.
    - When f changes, segments recolour with a 25ms stagger, 120ms each.
    - A loan of 80 with Falls on reaches 94, crossing 90. A loan of 50 moves only to 59.
  - **Chip** (under the meter, left): below 75 "Room to spare" (`#e6f4ea` / `#1b7a3e`); 75–90 "At the limit" (`#fff0e5` / `#b04a00`); above 90 "Some can be taken" (`#fde7e3` / `#b3261e`).
  - **Legend:** both lines always show ("80% · maxLabel", "90% · liqLabel", 14/20). The line that applies to f is at full ink; the other at 45%.
- **TradePanel (03):**
  - "You pay" box with the aBTC pill; a 40px round swap button overlapping the gap between the boxes; "You get" box with the aUSD pill; rows; button.
  - Clicking swap: the two pills cross over 350ms `cubic-bezier(.65,0,.35,1)`, each moving ± the measured distance between pill centres, then the state swaps and transforms reset. The arrow rotates a cumulative +180° over 350ms.
- **VaultPanel (04):**
  - Tabs: primeBTC | primeUSD | Boost. Boost is disabled, `#b6b6b6`, with an 11px "Planned" tag.
  - The underline takes the vault's colour (`#EF8E16` or `#1F5543`) and slides over 250ms.
  - Content:
    - header: a 36px Mark, the vault's kind (17px medium) and a "Preview" tag;
    - the vault's `line`;
    - the Put in / Hold / Take out rows as a `dl` with hairlines;
    - the caution line (13/20 `#787878`);
    - the button.
  - Switching tabs: content fades out over 120ms, then in over 200ms with a 6px rise.
  - The AccountStrip's "In a vault" colour follows the selected tab over 300ms (shared `TowerContext {vault}`).

**The penthouse reveal** (inside the stage; the layer `#view-stage` sits above the panel column):
- **Image:** `<img src="/img/prime/v8/penthouse.webp">`, full viewport, `object-cover`, `object-position:52% 40%`.
- **On mount and resize:** measure the panel frame's rect `r` against the stage.
- **p from 0 to 0.15:**
  - The panel, AccountStrip and caption fade: `opacity: calc(1 - min(1, var(--p)/.15))`, via CSS.
  - The step 04 block fades by the same amount.
  - The photo fades in inside the panel frame: `opacity: min(1, var(--p)*10)`.
  - Once p passes 0.15, the panel column is `inert`.
- **p from 0.05 to 0.70:** `e = easeInOutCubic(clamp((p-.05)/.65))`.
  - `clipPath = inset(${r.top*(1-e)}px ${(vw-r.right)*(1-e)}px ${(vh-r.bottom)*(1-e)}px ${r.left*(1-e)}px round ${24*(1-e)}px)`
  - `img.transform = translate3d(${(r.left+r.width/2 - .52*vw)*(1-e)}px,0,0)`: the Empire State starts centred in the card and ends centred on screen.
  - The image doesn't scale; only the window grows.
  - The rail fades over p 0.55–0.70, and its marker sits on "Top" once p > 0.
- **Arrival:**
  - When p ≥ 0.72, set `data-arrived`; remove it when p < 0.60.
  - A left scrim fades in over 500ms: `linear-gradient(90deg, rgba(8,18,40,.8) 0%, rgba(8,18,40,.55) 35%, rgba(8,18,40,0) 62%)`, plus `linear-gradient(to top, rgba(8,18,40,.5), transparent 40%)`.
  - The ViewCopy rises into place, left-aligned in the container, 12vh from the bottom, max-w 520. Each item goes from opacity 0 and 16px down to 1 and 0, over 500ms `--ease-out` with an 80ms stagger:
    - H2: sans, 56/60, medium, white, two lines;
    - body: 18/28, white at 80%, four lines;
    - the orange button (h-14, min-w 280);
    - the note ("Deposits aren't open to everyone yet."): 14px, white at 65%.
  - The copy takes pointer events only while arrived.
- **p from 0.85 to 1:** a 30svh hold. Then the pin releases and the photo and words scroll away together into the light FAQ.

**Stacked mode** (phones, reduced motion, short screens):
- `.v8-stage` is hidden and `.v8-steps` returns to normal flow.
- The section background is `linear-gradient(to bottom, #0a1226, #172b56)`, so the climb shows in colour without JS.
- **Readout:** the section's first child, `position:sticky; top:80px` (under the fixed h-20 nav), `z-20`, h-44, px-16, background `rgba(10,18,38,.94)` (no blur), 1px bottom border at white/10.
  - Left: "02 of 04 · Borrow" (14px tabular).
  - Right: a 72×4 mini account bar showing that floor's split.
  - Hidden (opacity 0) until the first article becomes active.
  - Active floor: an IntersectionObserver with `rootMargin "-45% 0px -55% 0px"`.
  - On change, the number rolls: the new one comes up from below and the old one leaves upward, over 250ms.
- **Articles:** py-56, in this order: number and tag, title (serif 32/36), body, rules, hint (↓), then the panel instance `.v8-inline-panel` (mt-24, full width, max 440, centred).
  - On the first 30% visibility, the panel fades up 12px over 400ms, once.
  - At 768px and wider (reduced motion on desktop): a two-column grid, panel in columns 1–6 and text in columns 8–12, with the hint arrow "←".
- **Reduced motion:** every transition is instant. The pan, knock, stagger and number roll are all off. The controls still work.

## 5. `#view`, the standalone penthouse (stacked mode only; `data-nav-theme="dark"`)
- **Photo:** penthouse.webp, 4:5, `object-position:52% 40%` (centres the Empire State on a phone).
- **Clip:** `clip-path: inset(16px round 16px)` eases to `inset(0 round 0)` as the section's top moves from 100% to 30% of the viewport height. Tied to scroll with rAF. Reduced motion: stays at 0.
- **ViewCopy:** below the photo on `#172b56`, py-56, left-aligned.
- The MobileCta pill hides here and over `#street`.

## 6. `#questions`, the FAQ
- **Layout:** `bg-[var(--p-subtle)]`, `py-[120px]` (72px on phone), 12-column grid.
  - Left, columns 1–4: label, serif H2 at 40/44, sub at 16/24 `#6e6e6e`.
  - Right, columns 6–12: `<Faq items={V8.faq.items.map(f => ({question: f.q, answer: <p>{f.a}</p>}))}/>`. It keeps its own 400ms grid-rows open and its plus icon rotating to ×.
- **No fifth question.**

## 7. Footer
The existing `PrimeFooter` from the layout.

## Motion budget
- **Moves on its own:** only the hero's rise on load, once. Nothing loops.
- **Tied to scroll** (all reversible): the hero drift, the facade pan, floor changes (panel, background, account, rail, step dimming), the penthouse reveal, the phone view clip.
- **Moves when the reader acts:** lobby rows, the rail, the token pill, the meter and price toggle, the swap, vault tabs, the FAQ, sign-up.

## Build order and cut line (one day)
1. Data file, page and section shells.
2. Lobby, facade and header.
3. Climb driver, stage and steps (with placeholder panels).
4. Penthouse reveal.
5. The four panels.
6. Stacked mode and readout.
7. FAQ.

If time runs short, cut in this order: the swap animation (make it instant), the vault colour following the tab, the knock, the phone view clip.

## Checks
- Sizes: 1440×900, 1280×720, 768×1024, 390×844, and with reduced motion on.
- Browsers: Chromium, and Playwright WebKit (Safari: clip-path `inset … round`, a range input over the meter, sticky inside a transformed ancestor; there must be none).
- Keyboard through the lobby, rail, meter and tabs.
- Only one photo is ever on screen.
- The nav reads light over every dark section.

## What makes this complete
v7 showed the product from a distance: cutouts, a moving dot, fact sheets. The reader never saw or handled the product, and the ending didn't pay off anything built up along the way. v8 closes that loop:
- Every band of the lead's frame has a job, and each hands off to the next: promise, then map, then climb, then arrival and ask, then questions.
- The dark tower holds the real app. The reader drives it floor by floor, and their account visibly fills with jobs as they rise, so the climb gathers something instead of just passing.
- The view is earned. It opens out of the same panel they've been using, and the ask sits in that frame.
- No placeholder band is left. Every slot carries vetted copy.

# C) Alternatives to show the lead later
1. **"The Lift"** (concept 1): static app screens drop through a fixed card window, against the scroll direction, as floors pass. The pure-scroll, most cinematic variant; prototype three drop strengths first.
2. **"The Directory"** (concept 3): a climb made of type. Floor titles grow from 32 to 64px and the space between floors widens. Defined terms ring the part of the app screen they name. The editorial variant with nearly no images.
3. **"Carry it up"** (concept 2): a fully operable demo. The lend floor slides your coin to borrowers and an interest dot comes back, and the Bitcoin/Dollars choice made on floor 01 follows you through every floor into an inline sign-up at the top.

**Files:**
- `/Users/nkubach/Desktop/Claude Code/arch-website/src/app/prime-v8/layout.tsx` (exists; imports the missing `src/data/prime-v8.ts`)
- `/Users/nkubach/Desktop/Claude Code/arch-website/src/data/prime-v7.ts` (the copy source)
- `/Users/nkubach/Desktop/Claude Code/arch-website/public/img/prime/v8/` (penthouse.webp, penthouse-mobile.webp, tower.webp, tower-mobile.webp; the last two have the light strip in rows 805–839)