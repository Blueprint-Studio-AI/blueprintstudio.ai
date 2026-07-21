import type { BrandConfig } from "@/components/brands/kit/types";

// HoneyB (Nectar Group) — palette, type scale and logo set read from the
// May 2026 brand kit PDFs. Assets live under /public/brands/honeyb.
//
// Double Digit is a separate brand, so there are no sub-brand families here —
// the logo configurator shows HoneyB alone.

const B = "/brands/honeyb";

// Shades of Gold, named once. The palette appears both as named swatches and as
// a chip ramp, and six hexes written twice is six chances to drift.
const GOLD = {
  liquidGold: "#F47000",
  marigold: "#FFB445",
  wax: "#FFCB7F",
  light: "#FFF3E1",
  muted: "#FDF8F1",
  offWhite: "#FFFEFD",
};

export const honeyb: BrandConfig = {
  slug: "honeyb",
  name: "HoneyB",
  brandInk: "#14161F", // Neutral 500

  hero: {
    image: `${B}/hero/honeyb-hero-background.png`,
    lockup: `${B}/logos/honeyb-lockup.svg`,
    tagline: "Brand Identity · Design System · Logo System · 2026",
    // Light honeycomb art — no dark scrim, and the tagline takes a grey ink.
    overlay: null,
    taglineColor: "#64656A", // Neutral 300
  },
  // …which also means the nav keeps its dark surface from the top.
  navAlwaysSolid: true,

  overview: {
    headline: "Bitcoin, made approachable.",
    headlineFaint: "Warmth around hard technology.",
    body: [
      "HoneyB takes the most technical asset in finance and gives it a surface people can actually trust. The honeycomb is the organising idea: a structure that is rigorous and repeatable up close, warm and familiar at a distance.",
      "Gold carries the value, grey carries the hierarchy. The palette balances the technical nature of Bitcoin with approachability, and the system is built to stay legible across digital and print alike.",
    ],
  },

  // Dashed rules measured off each mark, rather than a static dot grid.
  logoGrid: "construction",

  families: {
    honeyb: {
      label: "HoneyB",
      fill: "#F47000",
      thumb: `${B}/logos/honeyb-glyph-color.svg`,
      marks: {
        glyph: { src: `${B}/logos/honeyb-glyph-color.svg`, w: "26%" },
        lockup: { src: `${B}/logos/honeyb-lockup.svg`, w: "62%" },
        compact: { src: `${B}/logos/honeyb-compact.svg`, w: "46%" },
      },
    },
  },
  // Colour, black, white. The cream (#FFF3E1) is dropped — on the dark artboard
  // it was indistinguishable from white, so it read as a duplicate option.
  mono: [
    { key: "black", hex: "#141417", dark: false },
    { key: "white", hex: "#FFFFFF", dark: true },
  ],
  kit: { logoFiles: 5, logoZip: "15 KB" }, // measured from the built zip

  // Paint chips only — the palette is two short ramps, which the inspector's
  // swatch/readout/contrast panel would dwarf rather than explain.
  colorLayout: "chips",

  // "Shades of Gold" — a warm palette that balances the technical nature of
  // Bitcoin with approachability. Not rendered under colorLayout "chips", but
  // kept as the palette's named record (and the source of the ramp below).
  primary: [
    { role: "Primary", name: "Liquid-Gold", bg: GOLD.liquidGold, inspect: GOLD.liquidGold },
    { role: "Primary", name: "Marigold", bg: GOLD.marigold, inspect: GOLD.marigold },
    { role: "Primary", name: "Wax", bg: GOLD.wax, inspect: GOLD.wax },
  ],
  secondary: [
    { role: "Secondary", name: "Light", bg: GOLD.light, inspect: GOLD.light },
    { role: "Secondary", name: "Muted", bg: GOLD.muted, inspect: GOLD.muted },
    { role: "Secondary", name: "Off-White", bg: GOLD.offWhite, inspect: GOLD.offWhite },
  ],
  // Both ramps run light → dark. They sit directly above one another, so a
  // shared reading direction is what makes them scan as one system.
  lineup: [
    {
      tag: "gold",
      rows: [
        [
          ["Off-White", GOLD.offWhite],
          ["Muted", GOLD.muted],
          ["Light", GOLD.light],
          ["Wax", GOLD.wax],
          ["Marigold", GOLD.marigold],
          ["Liquid-Gold", GOLD.liquidGold],
        ],
      ],
    },
    {
      tag: "neutral",
      rows: [
        [
          ["100", "#F8F8F8"],
          ["200", "#BAB9BB"],
          ["300", "#64656A"],
          ["400", "#2D2E36"],
          ["500", "#14161F"],
        ],
      ],
    },
  ],
  accents: [], // no sub-brands — Double Digit is its own thing

  type: {
    display: {
      css: '"Poly", serif',
      foundry: { name: "Google Fonts", href: "https://fonts.google.com/specimen/Poly" },
      base: { size: 64, lh: 1.1, ls: "0em" },
      rows: [
        ["Heading 1", 68, 1.1, "0em"],
        ["Heading 2", 48, 1.1, "0em"],
        ["Heading 3", 30, 1.2, "0em"],
      ],
    },
    text: {
      css: '"Inter", sans-serif',
      foundry: { name: "Rasmus Andersson", href: "https://rsms.me/inter/" },
      base: { size: 64, lh: 1.1, ls: "-0.02em" },
      rows: [
        ["Body Large", 26, 1.2, "0em"],
        ["Body Normal", 18, 1.1, "0em"],
        ["Body Small", 15, 1.1, "0em"],
        ["Button Text", 16, 1.5, "0em"],
        ["Link Text", 16, 1.2, "0em"],
      ],
    },
  },
  typeDefaults: { display: "Poly Regular", text: "Inter Light" },

  // Mockups lead — they're the most legible proof of the brand in use, so they
  // open the section rather than sitting behind a tab.
  // Names describe what each file actually shows. "Mockup 4" tells a visitor
  // nothing and makes the download ambiguous once it's on their desktop; the
  // filename still carries the index for anyone matching against the source kit.
  assetCategories: [
    {
      id: "mockups",
      label: "Mockups",
      dir: `${B}/mockups`,
      items: [
        ["Homepage on Display", "honeyb-mockup-1.png", "5504×3072", "6.8 MB"],
        ["Vault Dashboard on iMac", "honeyb-mockup-2.png", "5504×3072", "6.3 MB"],
        ["Mobile Web Pair", "honeyb-mockup-3.png", "1920×1080", "317 KB"],
        ["Homepage on Laptop", "honeyb-mockup-4.png", "2048×2048", "7.2 MB"],
        ["Product Page in Hand", "honeyb-mockup-5.png", "4096×4096", "6.5 MB"],
      ],
    },
    {
      id: "assets",
      label: "Assets",
      dir: `${B}/assets`,
      items: [
        ["Wallet & Coin", "honeyb-asset-1.png", "1920×1080", "546 KB"],
        ["Coin Stack", "honeyb-asset-2.png", "1920×1080", "486 KB"],
        ["Coin Face", "honeyb-asset-3.png", "1920×1080", "474 KB"],
        ["Yield Progress", "honeyb-asset-4.png", "1920×1080", "300 KB"],
        ["Honeycomb Field", "honeyb-asset-5.png", "1920×1080", "947 KB"],
      ],
    },
    {
      id: "ui",
      label: "UI Design",
      dir: `${B}/ui`,
      items: [
        ["Feature Cards", "honeyb-ui-1.png", "1920×1080", "92 KB"],
        ["Epoch Onboarding", "honeyb-ui-2.png", "1920×1080", "860 KB"],
        ["Portfolio Overview", "honeyb-ui-3.png", "1920×1080", "65 KB"],
        ["LTV Slider", "honeyb-ui-4.png", "1920×1080", "106 KB"],
        ["Vault Detail", "honeyb-ui-5.png", "1920×1080", "129 KB"],
        ["KYC Onboarding", "honeyb-ui-6.png", "1920×1080", "53 KB"],
      ],
    },
  ],
  // The rails are unlabelled by design, so `alt` is the only text a visitor (or a
  // screen reader) ever gets from these — it carries the asset's name.
  galleries: {
    logo: [
      { src: `${B}/mockups/honeyb-mockup-1.png`, alt: "Homepage on a desktop display", caption: "The lockup in context" },
      { src: `${B}/mockups/honeyb-mockup-2.png`, alt: "Vault dashboard on an iMac", caption: "The mark inside the product" },
      { src: `${B}/mockups/honeyb-mockup-4.png`, alt: "Homepage on a laptop", caption: "The lockup at reading distance" },
      { src: `${B}/mockups/honeyb-mockup-5.png`, alt: "Product page on a phone in hand", caption: "Gold against neutral ground" },
    ],
    type: [
      { src: `${B}/ui/honeyb-ui-2.png`, alt: "Epoch onboarding modal", caption: "Poly and Inter carrying product UI" },
      { src: `${B}/ui/honeyb-ui-4.png`, alt: "Loan-to-value slider states", caption: "The scale at work across a screen" },
    ],
    // The palette in use, working outward: a single object carrying the gradient,
    // then the ramp as a measuring scale, then full-strength Liquid-Gold, then the
    // same ramp doing real work as data colour — and the pattern last, as the
    // surface everything else sits on.
    color: [
      { src: `${B}/assets/honeyb-asset-1.png`, alt: "Wallet and coin", caption: "Wax through Liquid-Gold in one object" },
      { src: `${B}/assets/honeyb-asset-4.png`, alt: "Coins as a yield progress scale", caption: "The full ramp as a scale" },
      { src: `${B}/assets/honeyb-asset-3.png`, alt: "Coin face carrying the glyph", caption: "Liquid-Gold at full strength" },
      { src: `${B}/ui/honeyb-ui-5.png`, alt: "Vault detail with allocation breakdown", caption: "The ramp as data colour" },
      { src: `${B}/assets/honeyb-asset-5.png`, alt: "Honeycomb field", caption: "The palette as a surface" },
    ],
  },

  implementation: {
    intro: [
      "The system ships as tokens: `Shades of Gold` for value, `Shades of Grey` for hierarchy.",
      "New surfaces integrate the palette and type scale manually until the shared package lands.",
    ],
    steps: [
      {
        title: "Adopt the palette",
        body: [
          "Define the six golds and five neutrals as CSS custom properties. `Liquid-Gold` (#F47000) is the brand's single accent — everything else supports it.",
        ],
      },
      {
        title: "Load the typefaces",
        body: [
          "Both faces are on Google Fonts: `Poly` for display and `Inter` for text. Load them once at the app root and expose them as `--font-display` and `--font-text`.",
        ],
      },
      {
        title: "Apply the type scale",
        body: [
          "Headings 1–3 use Poly at 68 / 48 / 30px. Body Large through Link Text use Inter at 26 / 18 / 15 / 16px. Line heights are baked into the scale — don't hand-tune them per surface.",
        ],
      },
      {
        title: "Use the logo correctly",
        body: [
          "The glyph, lockup and compact marks are single-fill SVGs, so they recolour cleanly to black, light or white. Never re-draw the mark or apply effects to it.",
        ],
      },
    ],
    roadmapTitle: "Toward a shared package",
    roadmap: [
      "The mature form is a published package — `@honeyb/design-system` — that any surface installs as a dependency, shipping tokens, scale and primitives as one versioned artifact.",
      "Because the tokens are plain CSS custom properties, they drop into any system that consumes CSS variables — no Tailwind requirement, no framework lock-in.",
    ],
  },

  generator: {
    video: "/assets/video/honeyb-assetgen.mp4",
    learnMore: "https://tools.blueprintstudio.ai/asset-generator",
    request:
      "mailto:blueprint.dao@gmail.com?subject=Asset%20Generator%20access%20%E2%80%94%20HoneyB" +
      "&body=Hi%20Blueprint%2C%0A%0AI%27d%20like%20access%20to%20the%20HoneyB%20asset%20generator%20account.%0A%0AName%3A%0ATeam%3A%0AWork%20email%3A%0A",
  },
  downloads: {
    logos: `${B}/downloads/honeyb-logos.zip`,
    tokens: `${B}/downloads/honeyb-tokens.css`,
    assets: `${B}/downloads/honeyb-assets.zip`,
    kit: `${B}/downloads/honeyb-brand-kit.zip`,
  },
  sections: [
    { id: "logo", label: "Logo" },
    { id: "color", label: "Color" },
    { id: "type", label: "Type" },
    { id: "assets", label: "Assets" },
    { id: "implementation", label: "Doc" },
  ],
};
