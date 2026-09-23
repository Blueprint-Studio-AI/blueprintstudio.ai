export const SITE = {
  name: "Arch",
  url: "https://www.arch.network",
  ogImage: "/img/og.png",
  ogAlt: "Arch — Real Bitcoin. Finally Programmable.",
  twitter: "@Arch",
  description:
    "Arch is Bitcoin-native financial market infrastructure enabling credit, derivatives, and capital markets.",
} as const;

// Absolute base for OG / canonical URLs. Non-production deploys prefer their own
// deploy URL so preview/branch share cards resolve instead of 404-ing against a
// domain that isn't live yet. Netlify sets DEPLOY_PRIME_URL (this deploy's primary
// URL — becomes the custom domain on production) and URL (the site's main URL);
// Vercel sets VERCEL_ENV + VERCEL_URL (bare host, no protocol). Production on
// Vercel and local dev fall back to the canonical domain.
export const SITE_URL =
  process.env.DEPLOY_PRIME_URL ||
  process.env.URL ||
  (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production" && process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : SITE.url);

// Carried over from the previous (Webflow) site so marketing data and any
// tags in the GTM container continue uninterrupted across the relaunch.
export const ANALYTICS = {
  gaId: "G-EDHYRW0Q7Z",
  gtmId: "GTM-5Z8L2F4T",
} as const;

export const EXTERNAL = {
  blog: "https://www.blog.arch.network/",
  docs: "https://docs.arch.network/",
  book: "https://book.arch.network/docs",
  typeform: "https://form.typeform.com/to/YUZ7T5jy",
  manifesto: "https://manifesto.arch.network",
  x: "https://x.com/Arch",
  // ponytail: Prime has no site yet; swap for the app URL when it ships
  prime: "https://x.com/Arch_Prime",
  discord: "https://discord.com/invite/arch",
  youtube: "https://www.youtube.com/@ArchNtwrk",
  linkedin: "https://www.linkedin.com/company/archntwrk/",
} as const;

export type NavLeaf = { label: string; href: string; external: boolean };
// A nav entry is either a direct link or a labelled group that opens a dropdown.
export type NavItem = NavLeaf | { label: string; children: readonly NavLeaf[] };

export const NAV_LINKS: readonly NavItem[] = [
  { label: "Chain", href: "/chain", external: false },
  { label: "Prime", href: "/prime", external: false },
  {
    label: "Resources",
    children: [
      { label: "Blog", href: EXTERNAL.blog, external: true },
      { label: "Docs", href: EXTERNAL.docs, external: true },
    ],
  },
];
