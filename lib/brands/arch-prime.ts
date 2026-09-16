import type { BrandConfig, ColorField } from "@/components/brands/kit/types";

// Arch Prime — ported from Nick's standalone review build (arch-prime-portfolio-review).
// The product brand that descends from Arch Network: same mark and serif, its
// own palette of section hues and a place system for the app (brand
// guidelines v1.1, September 2026). Assets live under /public/brands/arch-prime.

const B = "/brands/arch-prime";

// Earn's four sub-categories — tinted interior fields that inherit Earn's hue,
// never new identity colours. The edge stripe is the category's own key colour
// (brand deck p.17).
const EARN: ColorField[] = [
  { name: "Products", hex: "#F1CFB6", stripe: "#E6601A" },
  { name: "Liquidity Pools", hex: "#CCDAF0", stripe: "#2A5AE8" },
  { name: "Lending", hex: "#CEDBD7", stripe: "#1F5543" },
  { name: "Strategies", hex: "#F2E9CE", stripe: "#E2B119" },
];

export const archPrime: BrandConfig = {
  slug: "arch-prime",
  name: "Arch Prime",
  brandInk: "#181818",

  // The Arch Prime key visual (blue glass towers, the translucent arch) under a
  // light tint so the nav's white text holds across the top.
  hero: {
    image: `${B}/photo/prime-hero.jpg`,
    lockup: `${B}/logos/prime-lockup-white.svg`,
    tagline: "Arch Prime · Brand Identity · Design System · 2026",
    overlay: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 22%, rgba(0,0,0,0) 50%)",
    taglineColor: "#F3EFD7",
    background: "#0E2A4A",
    lockupWidth: "515px", // 72px tall at the lockup's 7.2:1
    quality: 85, // edges and grain soften at the default 75 (58 KB → 88 KB)
  },
  // No overview — the review build opens straight on the logo system.

  families: {
    // keyed by the slug so downloads name as arch-prime-glyph-…, not arch-prime-prime-…
    "arch-prime": {
      label: "Arch Prime",
      fill: "#292A2E",
      thumb: `${B}/logos/prime-glyph.svg`,
      marks: {
        glyph: { src: `${B}/logos/prime-glyph.svg`, w: "24%" },
        lockup: { src: `${B}/logos/prime-lockup.svg`, w: "64%" },
        wordmark: { src: `${B}/logos/prime-wordmark.svg`, w: "54%" },
      },
    },
  },
  // Ink leads (the supplied files are drawn in #292A2E), then the two brand
  // hues, then white for photography and dark surfaces.
  mono: [
    { key: "orange", hex: "#FF5E00", dark: false },
    { key: "indigo", hex: "#545EB3", dark: false },
    { key: "white", hex: "#FFFFFF", dark: true },
  ],

  primary: [
    { role: "Primary", name: "Arch-Orange", bg: "#FF5E00", inspect: "#FF5E00" },
    { role: "Secondary", name: "Arch-Indigo", bg: "#545EB3", inspect: "#545EB3" },
  ],
  // One hue per app section — colour is spent once, at nav level.
  secondary: [
    { role: "App Section", name: "Boost", bg: "#6B1E0D", inspect: "#6B1E0D" },
    { role: "App Section", name: "Earn", bg: "#123164", inspect: "#123164" },
    { role: "App Section", name: "Borrow", bg: "#1F5543", inspect: "#1F5543" },
  ],
  lineup: [],
  accents: [],
  colorFields: { tag: "prime-earn", eyebrow: "Earn Category", label: "Earn categories", items: EARN },

  type: {
    display: {
      css: '"Gascogne Serial", Georgia, serif',
      foundry: { name: "SoftMaker", href: "https://www.softmaker.com/" },
      base: { size: 64, lh: 1.05, ls: "-0.03em" },
      rows: [
        ["Headline", 64, 1.05, "-0.03em"],
        ["Headline 1", 48, 1.1, "-0.022em"],
        ["Heading 2", 36, 1.15, "-0.018em"],
        ["Heading 3", 28, 1.2, "-0.014em"],
        ["Heading 4", 20, 1.3, "-0.01em"],
      ],
    },
    // Primary — Plus Jakarta Sans for most headings and body (brand
    // guidelines p.19). Gascogne is the secondary, for editorial headings.
    text: {
      css: '"Plus Jakarta Sans", sans-serif',
      foundry: { name: "Tokotype · Google Fonts", href: "https://fonts.google.com/specimen/Plus+Jakarta+Sans" },
      base: { size: 64, lh: 1.1, ls: "-0.025em" },
      rows: [
        ["Body Large", 18, 1.55, "-0.012em"],
        ["Body", 16, 1.55, "0em"],
        ["Body Small", 14, 1.5, "0em"],
        ["Caption", 12, 1.4, "0.06em"],
        ["Label", 11, 1.4, "0.1em"],
      ],
    },
    // Tertiary — Inter Regular for most numbers and some small text (brand
    // deck p.21). Tabular figures so columns of values line up.
    numbers: {
      css: '"Inter", sans-serif',
      foundry: { name: "Rasmus Andersson · Google Fonts", href: "https://fonts.google.com/specimen/Inter" },
      base: { size: 64, lh: 1.1, ls: "-0.02em" },
      rows: [
        ["Numeral Large", 48, 1.1, "-0.02em"],
        ["Numeral", 32, 1.15, "-0.015em"],
        ["Numeral Small", 20, 1.3, "-0.01em"],
        ["Small Text", 13, 1.5, "0em"],
        ["Caption", 11, 1.4, "0.02em"],
      ],
    },
  },
  typeDefaults: { display: "Gascogne Serial", text: "Plus Jakarta Sans", numbers: "$12,480,530.00" },

  assetCategories: [
    {
      id: "photography",
      label: "Photography",
      dir: `${B}/photo`,
      items: [
        ["Key Visual", "prime-key-visual.png", "1920×1080"],
        ["City at Dusk", "city-top.png", "1920×1080"],
      ],
    },
    {
      // The place system's buildings: one exterior per app section (Boost,
      // Borrow, Earn) and one per Earn category, as transparent cut-outs. Shown
      // as the files they are — no painted stage — standing on the tile's
      // bottom edge, the way they sit on a banner.
      id: "buildings",
      label: "Buildings",
      dir: `${B}/buildings`,
      tile: "cutout",
      items: [
        ["Boost", "boost.png", "1080×1080"],
        ["Borrow", "borrow.png", "1080×1080"],
        ["Earn", "earn.png", "1080×1080"],
        ["Earn (alt)", "earn-alt.png", "1080×1080"],
        ["Pool", "pool.png", "1080×1080"],
        ["Product", "product.png", "1080×1080"],
        ["Strategy", "strategy.png", "1080×1080"],
      ],
    },
  ],
  // The four Earn categories as places: each field colour becomes the sky
  // behind a building in the category's key colour (brand deck). Section-level
  // applications first — the hue spent once, at nav level.
  galleries: {
    color: [
      { src: `${B}/samples/section-borrow.jpg`, alt: "Borrow — bank on a green field", caption: "Borrow" },
      { src: `${B}/samples/section-boost.jpg`, alt: "Boost — launch tower on a maroon field", caption: "Boost" },
      { src: `${B}/samples/earn-products.jpg`, alt: "Products — orange tower on a peach field", caption: "Products" },
      { src: `${B}/samples/earn-pools.jpg`, alt: "Liquidity Pools — blue tower on a sky field", caption: "Liquidity Pools" },
      { src: `${B}/samples/earn-lending.jpg`, alt: "Lending — green tower on a sage field", caption: "Lending" },
      { src: `${B}/samples/earn-strategies.jpg`, alt: "Strategies — gold tower on a cream field", caption: "Strategies" },
    ],
  },

  // Generated from this config on request — see app/brands/arch-prime/design.md.
  agentDoc: {
    file: `${B}/design.md`,
    title: "Design system for coding agents",
    blurb:
      "The whole system as one Markdown file — colour tokens, the type scale and the logo system. Paste it into your coding agent and prompt “build X following this”.",
  },

  generator: {
    video: "/brands/arch/video/assetgen.mp4", // same recording as Arch Network
    learnMore: "https://tools.blueprintstudio.ai/asset-generator",
    request:
      "mailto:blueprint.dao@gmail.com?subject=Asset%20Generator%20access%20%E2%80%94%20Arch%20Prime" +
      "&body=Hi%20Blueprint%2C%0A%0AI%27d%20like%20access%20to%20the%20Arch%20Prime%20asset%20generator%20account.%0A%0AName%3A%0ATeam%20(Arch%20%2F%20Arch%20Prime)%3A%0AWork%20email%3A%0A",
  },
  downloads: {
    // Arch-Prime-Brand-Guidelines-v1.1.pdf (23 MB) on the shared Drive — "anyone with the link"
    guidelines: "https://drive.google.com/file/d/13gdTJNiqeVUJsTcbDZQ3m5hjSZptdJAa/view",
    logos: `${B}/downloads/arch-prime-logos.zip`,
    tokens: `${B}/downloads/arch-prime-tokens.css`,
    assets: `${B}/downloads/arch-prime-assets.zip`,
    kit: `${B}/downloads/arch-prime-brand-kit.zip`,
  },
  downloadLabels: {
    guidelines: "Brand guidelines (PDF)",
    logos: "Logo system",
    tokens: "Design tokens (CSS)",
    assets: "Brand assets",
    kit: "Full brand kit",
  },

  // Arch Prime descends from Arch Network, so the page closes by pointing at
  // the parent identity.
  related: {
    eyebrow: "Arch family",
    name: "Arch Network",
    blurb: "The main brand this identity descends from: the mark, the serif, and the orange all start there.",
    href: "/brands/arch",
    cta: "Open Arch Network brand page",
  },
  sections: [
    { id: "logo", label: "Logo" },
    { id: "color", label: "Color" },
    { id: "type", label: "Type" },
    { id: "assets", label: "Assets" },
    { id: "downloads", label: "Files" },
  ],
};
