# Arch Network — Brand Portfolio (Next.js)

The Arch Network brand-portfolio page, on Blueprint Studio's main stack:
**Next.js 16 (App Router) · React 19 · Tailwind CSS v3 · TypeScript.**

Cloned from `../jinba-portfolio-next/` (the shared brand-portfolio template) and
re-skinned for Arch. **First draft: every asset, colour, face and line of copy was
pulled from arch.network** — swap in the production brand files as they're ported.

Gascogne Serial is a licensed face (SoftMaker); the woff2s here are the ones the
live site serves and are for this internal review only.

## Run

```bash
npm install
npm run dev      # http://localhost:4651
npm run build    # production build (prerenders static)
```

## Structure

```
app/
  layout.tsx      Geist + Geist Mono via next/font; wraps globals.css
  page.tsx        composes every section
  globals.css     Tailwind layers + design foundations:
                  · Gascogne Serial @font-face (200–700)
                  · centered 1440 "--edge" frame (full-bleed nav/hero/galleries)
                  · construction lines (.statement) and the specimen caret
components/
  Nav, Hero, Overview, TabBar (scroll-spy), SectionHeader
  LogoConfigurator   family / mark / style / format / size · live SVG recolor · PNG download
  ColorSystem        selectable swatch · WCAG contrast · copyable HEX/RGB/HSL
  ColorLineup        paint-chip token scale (copy-on-click)
  TypeSystem         two editable specimens · metric readouts · clickable size ramp
  TextureGrid, Gallery, Implementation, Footer
lib/
  data.ts         all content + design tokens (single source of truth)
  color.ts        hex/rgb/hsl + WCAG contrast maths
  clipboard.ts    copy helper with secure-context fallback
tailwind.config.ts  design tokens: colors, semantic type scale, fonts, spacing
public/
  assets/         logos/ photo/ diagrams/ partners/ ecosystem/ video/ fonts/
  downloads/      zip kits + tokens.css
```

## Design tokens

The type scale, colors, and spacing live in `tailwind.config.ts` as one source of
truth (`text-eyebrow`, `text-body`, `text-title`, `text-headline`, `bg-chip`,
`text-muted-2`, `gap-gutter`, `py-section`, …). Interactive sections are client
components; everything else renders on the server.

Interactive brand-asset images are decorative and ship from `/public` with
CSS-controlled aspect ratios, so plain `<img>` is used deliberately (kept faithful
to the prototype; no `next/image` sizing to reason about).
