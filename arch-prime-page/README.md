# Arch Website

![Arch — Finally Programmable.](.github/readme-hero.jpg)

Marketing site for [Arch Network](https://www.arch.network) — Bitcoin-native
financial market infrastructure.

## Stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack)
- React 19 · TypeScript · Tailwind CSS v4
- [Lenis](https://lenis.darkroom.engineering/) smooth scrolling
- pnpm

## Development

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

```bash
pnpm build      # production build
pnpm start      # serve the production build
pnpm lint       # eslint
```

## Environment

Deploys on Vercel with no required env vars. Optional:

| Variable                   | Purpose                                             |
| -------------------------- | --------------------------------------------------- |
| `NEXT_PUBLIC_POSTHOG_KEY`  | Enables PostHog analytics (off when unset)          |
| `NEXT_PUBLIC_POSTHOG_HOST` | PostHog host override (defaults to US cloud)        |

## Pages

| Route        | Purpose                                             |
| ------------ | --------------------------------------------------- |
| `/`          | Home — Bitcoin capital markets infrastructure pitch |
| `/chain`     | The Arch chain — scroll-driven product story        |
| `/ecosystem` | Partners and applications building on Arch          |

## Structure

- `src/app` — routes, root metadata (OG/Twitter cards), `sitemap.ts`, `robots.ts`
- `src/components` — page sections; the `chain-*` components make up the
  scroll-driven Chain page
- `src/lib/site.ts` — site config: nav links, external URLs, canonical domain
  (`SITE_URL` resolves per-deploy so preview share cards self-resolve)
- `src/data` — ecosystem partner list, FAQ copy
- `public` — static assets (partner logos, OG images, hero video, fonts)
