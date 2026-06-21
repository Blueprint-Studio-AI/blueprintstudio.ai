# Brand page — content / asset optimizations (deferred)

Running list of **media-weight** optimizations intentionally deferred from the
`branding-page` code cleanup. These are asset re-encodes / format conversions
(image + video tooling), not code changes, so they're batched into a dedicated
pass rather than mixed into the review fixes.

_Last updated: 2026-06-21. Sizes measured from the working tree._

## ✅ Done
- **`Screen-Content.mp4`** — re-encoded **4.92 MB → 324 KB** (720p H.264, audio stripped) + a 16 KB poster (`screen-content-poster.jpg`). Kept native `autoPlay` (a lazy IntersectionObserver gate proved unreliable; at 324 KB autoplay is fine, and Chrome already defers off-screen autoplay). (`WhatsIncludedSection`)

## Still deferred

| Asset | Size | Referenced at | Action | Est. savings |
|---|---|---|---|---|
| `public/media/hero/uni_brands-we-built.png` | 1.44 MB | `HeroCardCarousel.tsx:9` | → WebP/AVIF (keep `priority` preload) | 360–580 KB |
| `public/media/hero/autara_brands-we-built.png` | 1.34 MB | `HeroCardCarousel.tsx:12` | → WebP/AVIF | 330–540 KB |
| `public/media/hero/breeze_brands-we-built.png` | 1.09 MB | `HeroCardCarousel.tsx:11` | → WebP/AVIF | 270–440 KB |
| `public/media/hero/kind_brands-we-built.png` | 624 KB | `HeroCardCarousel.tsx:14` | → WebP/AVIF | 156–250 KB |
| `public/media/hero/huch_brands-we-built.png` | 621 KB | `HeroCardCarousel.tsx:13` | → WebP/AVIF | 155–250 KB |
| `public/media/hero/honeyb_brands-we-built.png` | 447 KB | `HeroCardCarousel.tsx:10` | → WebP/AVIF | 110–180 KB |
| `public/media/hero/autara_brands-we-built-1.png` | 80 KB | `HeroCardCarousel.tsx:15` | → WebP/AVIF | 20–32 KB |
| `public/media/Background-Asset-Gen.png` | 566 KB | `WhatsIncludedSection.tsx:243` (raw CSS bg) | → WebP (sibling `depth-bg.webp` is 28 KB) | 140–460 KB |
| `public/images/thumbprints.webp` | 695 KB | `ProcessSection.tsx:191`, `DepthSection.tsx:186` | Drop `unoptimized`/`quality={100}` so Next serves AVIF + auto-sizes | 140–280 KB |

**Notes**
- Carousel `priority` preload is **intentional / keep** (user wants all cards visible immediately) — only the PNG → WebP/AVIF format swap is the optimization.
- The hero PNGs total ~5.6 MB; WebP/AVIF alone could cut that to ~3–3.5 MB.
- `thumbprints.webp` is a code-attribute change (`unoptimized` removal) but is parked here with the rest of the media work since it changes how the image is served.
- **Rough remaining potential savings: ~1.5–3 MB** (the 5 MB video is already done — saved ~4.6 MB).
