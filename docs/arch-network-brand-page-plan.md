# Arch Network brand page: improvement plan

Page: `/brands/arch` · Data: `lib/brands/arch.ts` · Assets: `public/brands/arch/`
Reference: the arch.network codebase (`Blueprint-Studio-AI/arch-website`, public), checked 2026-09-11.

**Done so far.** Ported from Nick's standalone review app onto the shared brand-kit template. The palette now leads with Orange `#EC641D` and Black `#181818`, the site's two core tokens, and the tokens download includes `--arch-orange`. The links between Arch Network and Arch Prime point at `/brands/arch-prime` and `/brands/arch`.

## Priority: make the brand deck, then build the page from it

The biggest gap is that Arch Network has no brand guidelines deck yet. Today the page is a first draft reverse-engineered from arch.network's code. Arch Prime works well because its page follows its deck.

1. **Make the deck.** Logo, colour (core palette plus the /chain system), type, photography, motifs, voice. Items 1 and 2 below are inputs to it, not substitutes.
2. **Attach it.** Put it on the shared Drive with "anyone with the link can view", then set `downloads.guidelines` in `lib/brands/arch.ts` to its link. It appears first in the Downloads section, and the generated design.md links to it. No code changes needed.
3. **Update the page from it.** Overview copy, swatch names, palette and type, asset categories, and the tagline should all match the deck. Where the page and the deck disagree, the deck wins, as it does for Arch Prime.

The numbered items below are the smaller fixes, in order. Items 1 and 2 are config and asset changes; item 3 needs one small template change. Do this on its own branch or worktree off `feat/brand-pages`, so a half-finished split never blocks the other brand pages.

---

## 1. Show the home-page system and the chain-page system as two labelled groups

arch.network runs two visual languages, and the code keeps them apart:

| | Home page (editorial) | /chain page (technical) |
|---|---|---|
| Where it's defined | `src/app/globals.css` `@theme` | `src/app/chain/chain.css`, scoped to `.chain-scope` |
| Surfaces | White, Light `#F3EFD7`, photography under dark tints, Charcoal `#2E2D33` | Warm off-white `#FBFAF7`, white cards |
| Text | Black `#181818`, Grey `#808080` | Ink `#181818`, warm greys `#46443F` / `#6C6A62` / `#9A978C` |
| Accent | Orange `#EC641D`, Dark Purple `#3E3A8E`, Purple `#736FB9` | Orange `#EC641D`, Orange 2 `#F4814A`, Orange Ink `#C9520F`, Purple `#3E3A8E` |
| Type | Gascogne Serial + Geist | Gascogne + Geist + **Azeret Mono** |
| Imagery | Photography, films | Isometric illustrations, diagrams, animated stack |

Arch Prime already has its own page, so this stays **one page with two labelled groups**, not a third brand.

### Colour (`lib/brands/arch.ts`, config only)

**Done (2026-09-11):** swatches are Orange, Indigo, Violet, Parchment (Black removed from the swatches; it stays in the tokens as the ink). The /chain page's own colours are a separate `arch-chain` group: Background, Body, Muted, Faint, Orange 2 (was "Peach"), Orange Ink, Code Gold. Both Peach and Gold are used only on /chain. The tokens download has them as `--arch-chain-*`. Still open below: names, the two untokenised surfaces, and the illustration shading ramps.

- **Core palette (inspector swatches).** The eight `@theme` tokens: Orange, Black, Dark Purple, Purple, Light, Grey, Light Grey `#E9E9E9`, White.
  - Decide names: the site's (`dark-purple`, `purple`, `light`) or Nick's working titles (Indigo, Violet, Parchment). Pick one set and use it in the tokens file too.
  - Decide whether Charcoal `#2E2D33` (home city section, chain app card) and Deep Indigo `#1F1C3E` (Jaidon's "why" band on /chain) are brand surfaces. They're used, but not tokenised on the site.
- **Chain system (`lineup` group, tag `chain`).** Background `#FBFAF7`, Body `#46443F`, Muted `#6C6A62`, Faint `#9A978C`, Orange 2 `#F4814A` (currently "Peach"), Orange Ink `#C9520F`.
- **Illustration shading (`lineup` group, tag `illustration`).** Each block is drawn as top / edge / side:
  - Orange block: `#EC641D` / `#CF5418` / `#B84A14`
  - Building: `#FFFFFF` / `#EAE7D6` / `#DCD8C4`
  - Ground: `#F4F1DE` / `#E2DECB` / `#D3CFBA`
  - Stone: `#D8D4C0` / `#CBC6B0` / `#BDB8A2`
- **Remove Gold `#E6C98A`.** On the site it only colours type names inside a code sample on /chain. It isn't a brand colour.
- **Update `public/brands/arch/downloads/arch-network-tokens.css`** to match: core tokens first, then `--arch-chain-*`.

### Type (small template change)

- Add **Azeret Mono** as the chain page's third face. It's on Google Fonts, so load it with `next/font/google` in `app/brands/arch/layout.tsx`.
- The template's third type slot is currently hard-wired as "numbers" (Arch Prime's Inter numerals): specimen tag `<slug>-numbers`, CSS variable `--font-numbers`. Add an optional `tag` to `TypeFace` in `components/brands/kit/types.ts` and use it in `TypeSystem.tsx`, so Arch Network can label it `arch-mono` while Arch Prime keeps `arch-prime-numbers`.
- Side note for the arch.network team: /chain loads Azeret Mono from the old Webflow CDN (`cdn.prod.website-files.com`). If that Webflow account lapses, the font disappears. Self-host it or use Google Fonts.

### Motion and assets (config only)

- **Motion:** the chain illustration loops and the two home-page films sit in one grid. Prefix the names ("Chain · Stack Hero", "Home · Skyline Film"), or add an optional `group` to `MotionClip` if you want sub-headings.
- **Assets:** already split by source. Photography and Social come from the home page; Architecture and Primitives come from /chain. Rename the tabs if the source should be explicit.
- **Overview copy:** one sentence naming the two registers, so the split reads as intentional.

## 2. Complete the investor row

The site shows 14 investors; "Backed By" has 11. Add the missing three in the site's order:

| Investor | Site file | Note |
|---|---|---|
| ARK Invest | `public/img/partners/logo1.svg` | SVG, drop in as-is |
| DPI Capital | `public/img/partners/image37.avif` | AVIF: get an SVG or PNG first |
| Asymmetric | `public/img/partners/asymmetric.avif` | AVIF: get an SVG or PNG first |

Many design tools can't open AVIF, so don't offer it as a download. Copy the files into `public/brands/arch/partners/` and add a line for each to the `partners` category. The zips pick them up automatically.

## 3. Site showcase section (later)

A section showing arch.network itself: mockup renderings of the home, /chain and ecosystem pages, a link to the live site, and a link to the GitHub repo, which is public.

- **Config-only version:** a `galleries.site` rail of mockup images (the existing rail component), plus `links` entries for the live site and the repo.
- **Proper version:** a dedicated section with a heading, the links as buttons, and larger renders. That's a new optional template section, reusable for any brand whose site we built.
- Needs: the mockup renders themselves. Nothing to build until they exist.

## 4. Public vs private assets (later)

Everything under `public/brands/arch/` can be downloaded by anyone with the URL. Items to decide before this matters:

- **Third-party logos:** the investor and ecosystem logos are offered as downloads. They're other companies' marks, so check that's what Arch wants.
- **Moodboards, drafts, source files:** keep them out of the repo for now (Drive or Figma).
- **A real private tier** means gated downloads behind a login. Out of scope until there's a concrete need.

## 5. Small things

- **Orange as text:** `#EC641D` on white is 3.14:1, which fails WCAG AA for body text. The page's contrast readout already shows it. Add a usage line to the Overview or the design doc: orange for display type, marks and graphics, not body copy on white.
- **Unused Lottie files:** the site has `bow.lottie` and `menu.lottie` (UI animations). The site code doesn't reference them; ignore them unless Arch says the bow is a brand element.
- **The "Social" asset tab isn't social assets.** It holds the site's two link-preview images (`og-home.png`, `og-chain.png`). On Jinba and HoneyB, "Social" means profile pictures and banners. Rename Arch's tab to "Share Images", or replace it once Arch has real profile pictures and banners.
- **Hand-typed sizes:** `kit.logoZip` ("11 KB") and the asset sizes in the data file don't update themselves. Re-check them after item 2.

## Checking the work

After each item:

1. `npm run dev`, then open `/brands/arch` and `/brands/arch-prime`, since template changes affect both.
2. Open `/brands/arch/design.md`. It's generated from the data file, so it should show the new groups with no manual edits.
3. `npm run zips`, then open `public/brands/arch/downloads/arch-network-brand-kit.zip` and check `design.md` and `css/arch-network-tokens.css`.
4. `npx tsc --noEmit`, then `npm run build` with the env pulled.
