# Brand page — content / asset optimizations (deferred)

Running list of **media-weight** optimizations intentionally deferred from the
`branding-page` code cleanup. These are asset re-encodes / format conversions
(image + video tooling), not code changes, so they're batched into a dedicated
pass rather than mixed into the review fixes.

_Last updated: 2026-06-21. Sizes measured from the working tree._

## ✅ Done
- **`Screen-Content.mp4`** — re-encoded **4.92 MB → 324 KB** (720p H.264, audio stripped) + a 16 KB poster (`screen-content-poster.jpg`). Kept native `autoPlay` (a lazy IntersectionObserver gate proved unreliable; at 324 KB autoplay is fine, and Chrome already defers off-screen autoplay). (`WhatsIncludedSection`)

## Still deferred

### Context — how these are actually served (verified 2026-06-21)
`next/image` optimization is **on** (no `unoptimized` globally, no static export;
default formats = WebP only). So any `<Image>` *without* `unoptimized` is already
delivered to browsers as a **resized WebP** (per its `sizes`) — the large source
file never reaches the visitor. That reframes the priority below: the hero PNGs
are **not** a real runtime cost; the raw CSS background and the `unoptimized`
texture are.

**Scope:** all of this only affects `/brand`'s load — JS is route-split and
`public/` assets are fetched on-demand, so other pages are unaffected.

### Highest leverage — one line, whole site
- Add `images.formats: ['image/avif', 'image/webp']` to `next.config.mjs`. Makes
  `next/image` serve **AVIF** (10–30% smaller than WebP) for **every** optimized
  image site-wide — bigger payoff than converting any source file. Trade-off:
  AVIF encode is slower on Vercel's optimizer.

### High value — actually downloaded raw on `/brand`
| Asset | Size | Referenced at | Why it's raw | Action |
|---|---|---|---|---|
| `public/media/Background-Asset-Gen.png` | 566 KB | `WhatsIncludedSection.tsx` (CSS `background-image`) | CSS bg → `next/image` can't touch it | → WebP (sibling `depth-bg.webp` is 28 KB) |
| `public/images/thumbprints.webp` | 695 KB | `ProcessSection.tsx:179`, `DepthSection.tsx:240` | rendered with `unoptimized` (+`quality={100}`) → bypasses Next | drop `unoptimized` so Next resizes/serves it small — *but eyeball first, may be intentional for texture crispness* |

### Low priority — hygiene only (already optimized for browsers)
The 7 hero carousel PNGs (~5.6 MB of **source** files, `HeroCardCarousel.tsx`)
are served to visitors as resized WebP via `next/image` — the big PNGs don't
reach the browser. Converting the sources only shrinks the repo + Vercel's
first-request optimization work; it does **not** change what users download.
Keep the `priority` preload (intentional). Convert someday for repo cleanliness,
low urgency.
