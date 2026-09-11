# Blueprint Studio Site

The marketing site at [blueprintstudio.ai](https://blueprintstudio.ai): Next.js 16 (App Router), Tailwind CSS v3, TypeScript. Deployed on **Vercel** (project `blueprintstudio-ai`). Every push to `main` goes to production; every other branch gets a preview URL.

## Running locally

```bash
# once: link the folder to the Vercel project and pull the env vars
vercel link --yes --project blueprintstudio-ai --scope blueprint-adbd03fe
vercel env pull .env.local --yes

pnpm install
npm run dev          # http://localhost:3000
```

- `vercel link` appends a `.env*` line to `.gitignore`. Discard that change; `.env.local` is already ignored.
- The repo keeps both `pnpm-lock.yaml` and `package-lock.json`. When you add a dependency, update both.
- With pnpm 11, `pnpm dev` / `pnpm build` can refuse to run until you approve install scripts (`pnpm approve-builds`). `npm run …` works either way.
- A production build (`npm run build`) needs the env vars; without them it fails on the API routes.

## Brand pages

Client brand pages live at `/brands/<slug>` (Jinba, HoneyB, Arch Network, Arch Prime). Every one is the same shared template, filled in from one data file. Build new ones here in the site, not as a separate Next.js app on a review branch: a nested app never deploys.

| What | Where |
|---|---|
| Brand content: copy, palette, type, logos, asset lists, downloads | `lib/brands/<slug>.ts` |
| Images, logos, videos, tokens files | `public/brands/<slug>/<category>/` |
| Route: fonts, page metadata, share image, design doc | `app/brands/<slug>/` |
| The template, shared by every brand | `components/brands/kit/` |
| What the fields in a data file mean | `components/brands/kit/types.ts` |
| Which folders go into which download zip | `scripts/build-zips.mjs` |

### Changing a brand page

- **Copy, colours, type:** edit the brand's data file. The dev server picks it up on save.
- **Replacing an image:** overwrite the file, keeping its name.
- **Adding an asset:** put the file in its category folder, then add a line for it to that category's `items` in the data file (name, filename, dimensions, size). A file that's in the folder but not in the data file ends up in the zip but not on the page.
- **Layout or section changes:** edit `components/brands/kit/`. That changes every brand page at once, so check all four.
- **Optional sections** (motion, Earn-style colour fields, a third typeface, a sibling-brand link) switch on by adding their field to the data file. See `types.ts`.

### Downloads

The download zips are **generated, never committed** (`public/**/*.zip` is gitignored). `npm run dev` and `npm run build` rebuild them from the loose files, so editing a file is all it takes to change a zip. On Vercel, every deploy rebuilds them.

To see exactly what a visitor downloads:

```bash
npm run zips                          # rebuild the zips without starting the server
open public/brands/arch/downloads     # then double-click a zip in Finder
```

Every zip is named after its brand (`arch-prime-brand-kit.zip`, never a shared `arch-…` name) and has `design.md` at its top level, so whoever grabs any bundle gets the rules with it. Full brand kits put the tokens file in `css/` and everything else under `assets/`.

Jinba's and HoneyB's full kits are built from the page itself: every asset listed in the brand's data file, plus logos and tokens. If a listed file is missing, the build stops rather than shipping a kit that doesn't match the page.

To change what's in a zip, edit the **source folders**, not the unzipped copy. The mapping is at the top of `scripts/build-zips.mjs`: a new zip, or a new folder in an existing zip, is one line there.

Every size on the page, from each asset's file size to each download and the logo zip's file count, is measured from the real files by `lib/brands/measure.ts`. It runs while the static page is built, once per deploy, never per visit, so there's nothing to keep up to date by hand. Sizes are of the originals the buttons download, not the optimized previews the page displays.

### Brand decks

The guidelines PDF is linked, not stored: set `downloads.guidelines` in the data file to the deck's Google Drive link (sharing: anyone with the link can view). It's listed first in the Downloads section and opens in a new tab. Decks are large (Jinba's is 167 MB), and updating the Drive file in place keeps the link working.

### design.md

Each brand page offers its design system as one Markdown file for coding agents and designers: **Copy design.md** and **Download design.md** in the Downloads section. It's served at `/brands/<slug>/design.md`, ships as `design.md` in every download zip, and links to the brand deck when there is one.

- **Jinba, Arch Network, Arch Prime:** generated from the data file on request and at zip time (`app/brands/<slug>/design.md/route.ts`). Change the data file and the doc follows; there's nothing to update by hand.
- **HoneyB:** a hand-authored file at `public/brands/honeyb/design.md`, built from HoneyB's internal `DESIGN.md` by `scripts/build-agent-doc.mjs`, which strips private links and tokens. Re-run it when the source changes; never paste the internal doc in directly.

### Adding a new brand

1. Copy `lib/brands/arch-prime.ts` to `lib/brands/<slug>.ts` and fill it in.
2. Copy `app/brands/arch-prime/` to `app/brands/<slug>/`. Update the imports and the fonts in `layout.tsx`. The `design.md` route inside needs only its import changed.
3. Put the assets under `public/brands/<slug>/`, one folder per category.
4. Add the brand's zips to `scripts/build-zips.mjs`, named `<slug>-…zip`, and import its data file at the top so each zip gets its `design.md`.
5. If there's a brand deck, add its Drive link as `downloads.guidelines`.
6. Add the page to `app/sitemap.ts`.

The share image (`opengraph-image.tsx`) is composed from the hero automatically.

### Images

The files in `public/brands/<slug>/` are the originals: they're what the download buttons hand over, so never compress or resize them in place. What the page *shows* goes through `next/image`, which serves a resized WebP from them on the fly (the hero, the asset grid, the gallery rails and the motion stills all do). It never upscales, so a displayed image can't be softer than its source.

- **Hero art** loads with `preload` and always asks for the full source as WebP (`HERO_SIZES` in `Hero.tsx`), because it's cover-scaled into a tall frame and drawn wider than the screen. Quality is 75 by default; set `hero.quality: 90` for flat graphics with soft gradients, which blotch at 75 (HoneyB's honeycomb). Allowed values are listed in `next.config.mjs` → `images.qualities`.
- **Asset cards** size themselves from each item's dimensions in the data file, so wide images that get cropped to a 16:10 card still come out sharp. Keep those dimensions accurate.
- **SVGs** go through a plain `<img>`; there's nothing to optimise. Anything far below the fold should be `loading="lazy"`.
- **Rules of thumb:** hero at display size under ~200 KB, card thumbnails under ~100 KB, and first-view images under ~1 MB on a phone. LCP (the largest paint, here the hero) under 2.5 s is Google's "good" Core Web Vitals threshold.
- **iOS:** the hero is pinned (sticky) only above 860px; on phones, iOS 26 Safari tinted its bottom toolbar with the pinned hero's colour over every section. iOS 26 also ignores `theme-color` and paints the status-bar strip with the `<body>` background, so brand routes set the body to the hero's field (`BrandChrome`), and on phones the hero's top edge fades up from that same colour, so the strip runs into the photo. The space past the end of the page takes the `<html>` colour; while the footer is on screen, the kit `Footer` switches both to its own colour, so there's no hero-coloured band under it. Check phone layouts in the iOS Simulator's Safari, not only a narrow desktop window, and force a reload (Safari happily shows a cached page).

### Fonts

Google Fonts load through `next/font/google` in the route's `layout.tsx`. Licensed fonts go in `app/brands/_fonts/` and load with `next/font/local` (see `gascogne.ts`). Confirm the licence covers web use before shipping one.

### Not single-sourced yet

The goal is for each brand's data file to drive everything. These still don't:

- **Tokens CSS files** (`public/brands/<slug>/downloads/<slug>-tokens.css`) are written by hand and can drift from the palette and type in the data file. Generate them the way `design.md` is generated.
- **The zip list** in `scripts/build-zips.mjs` is kept by hand. Jinba's and HoneyB's kits already read their assets from the data file. The Arch Network and Arch Prime kits still list folders copied from Nick's original zips. They come out almost the same as the page, plus ready-made recoloured logos, motion poster frames and Arch Prime's hero photo, minus the motion GIFs, with folders named after the site's folders rather than the page's tabs. The comment above the Arch entries in the script has the details and the switch-over steps.
- **Asset dimensions** (`"1920×1080"` in each item) are still typed by hand. Sizes are measured; dimensions could be too, with an image-size read in `measure.ts`.
- **HoneyB's design.md** is a filtered copy of the brand-kit repo's DESIGN.md, refreshed by hand with `scripts/build-agent-doc.mjs`.

### What not to put in `public/`

Anything under `public/` can be downloaded by anyone with the URL, whether or not a page links to it. Keep moodboards, inspiration images (usually other people's work), unapproved drafts and anything under NDA out of the repo; use the shared Drive or Figma instead.
