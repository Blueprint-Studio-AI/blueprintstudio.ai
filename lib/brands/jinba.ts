import type { BrandConfig, Texture } from "@/components/brands/kit/types";

// Jinba — everything the brand-kit template needs to render /brands/jinba.
// Asset paths resolve from /public.

const TEXTURES: Texture[] = [
  ["Brush 1", "brush-1.png", "2752×1536", "6.4 MB"],
  ["Brush 2", "brush-2.png", "1264×639", "1.4 MB"],
  ["Brush 3", "brush-3.png", "1850×768", "2.3 MB"],
  ["Brush 4", "brush-4.png", "3328×3082", "8.3 MB"],
  ["Field 1", "field-1.png", "1264×705", "2.1 MB"],
  ["Field 2", "field-2.png", "4096×2286", "14 MB"],
  ["Field 3", "field-3.png", "1365×768", "1.7 MB"],
  ["Field 4", "field-4.png", "2752×1536", "7.0 MB"],
  ["Field 5", "field-5.png", "2752×1536", "6.9 MB"],
];

export const jinba: BrandConfig = {
  slug: "jinba",
  name: "Jinba",
  brandInk: "#322014",

  hero: {
    image: "/brands/jinba/card-bg.png",
    lockup: "/brands/jinba/dl/lockup-white.png",
    tagline: "Brand Identity · Design System · Logo System · 2026",
  },
  overview: {
    headline: "One body, one mind.",
    headlineFaint: "Horse and rider move as a single form.",
    body: [
      "Jinba Ittai describes the unity between a horse and its rider, two entities that become indistinguishable in motion. For Jinba, it captures what enterprise automation should feel like: the business and its workflows operating as one.",
      "Clean geometry, deliberate restraint. Jinba serves regulated industries where trust is the product. The identity is considered, precise, and calm under pressure.",
    ],
  },

  families: {
    jinba: {
      label: "Jinba",
      fill: "#322014",
      thumb: "/brands/jinba/dl/glyph-dark.png",
      marks: {
        glyph: { src: "/brands/jinba/dl/glyph.svg", w: "28%" },
        lockup: { src: "/brands/jinba/dl/lockup.svg", w: "60%" },
        compact: { src: "/brands/jinba/dl/lockup-small.svg", w: "54%" },
      },
    },
    flow: {
      label: "Flow",
      fill: "#2C50B5",
      thumb: "/brands/jinba/sub-brands/jinba-flow-glyph.png",
      marks: {
        glyph: { src: "/brands/jinba/sub-brands/jinba-flow-glyph.svg", w: "28%" },
        lockup: { src: "/brands/jinba/sub-brands/jinba-flow-lockup.svg", w: "52%" },
      },
    },
    toolbox: {
      label: "Toolbox",
      fill: "#7D95A1",
      thumb: "/brands/jinba/sub-brands/jinba-toolbox-glyph.png",
      marks: {
        glyph: { src: "/brands/jinba/sub-brands/jinba-toolbox-glyph.svg", w: "28%" },
        lockup: { src: "/brands/jinba/sub-brands/jinba-toolbox-lockup.svg", w: "58%" },
      },
    },
    app: {
      label: "App",
      fill: "#A22727",
      thumb: "/brands/jinba/sub-brands/jinba-app-glyph.png",
      marks: {
        glyph: { src: "/brands/jinba/sub-brands/jinba-app-glyph.svg", w: "28%" },
        lockup: { src: "/brands/jinba/sub-brands/jinba-app-lockup.svg", w: "48%" },
      },
    },
  },
  mono: [
    { key: "black", hex: "#000000", dark: false },
    { key: "light", hex: "#FAF8F3", dark: true },
    { key: "white", hex: "#FFFFFF", dark: true },
  ],
  kit: { logoFiles: 30, logoZip: "228 KB" },

  primary: [
    { role: "Primary", name: "Urushi", bg: "#322014", inspect: "#322014" },
    { role: "Primary", name: "Kuri", bg: "#5A3921", inspect: "#5A3921" },
    {
      role: "Primary",
      name: "Haku",
      bg: "linear-gradient(180deg,#B78D62 0%,#C5A681 43.75%,#7E4E2D 80.3%,#52321B 100%)",
      inspect: "#7E4E2D",
      grad: true,
    },
  ],
  secondary: [
    { role: "Secondary", name: "Tsuchi", bg: "#C5A681", inspect: "#C5A681" },
    { role: "Secondary", name: "Suna", bg: "#EFEEE8", inspect: "#EFEEE8" },
    { role: "Secondary", name: "Kami", bg: "#F5F4F2", inspect: "#F5F4F2" },
  ],
  lineup: [
    {
      tag: "light",
      rows: [
        [["50", "#FAF8F3"], ["100", "#F4F1EB"], ["200", "#EAE3D7"], ["300", "#DCCBB3"], ["400", "#CAB296"], ["500", "#B59575"], ["600", "#9E7754"], ["700", "#835836"], ["800", "#5A3921"], ["900", "#342115"], ["950", "#2B1C13"]],
        [["50", "#F8F8F8"], ["100", "#EFEFEE"], ["200", "#E2E2E1"], ["300", "#CECDCC"], ["400", "#B8B6B3"], ["500", "#9E9B98"], ["600", "#837F7C"], ["700", "#66625F"], ["800", "#44413F"], ["900", "#272625"], ["950", "#21201F"]],
      ],
    },
    {
      tag: "dark",
      rows: [
        [["50", "#1A120E"], ["100", "#2E2019"], ["200", "#413026"], ["300", "#694F3E"], ["400", "#93715A"], ["500", "#AC8B70"], ["600", "#BEA083"], ["700", "#CEB69A"], ["800", "#DCCFBC"], ["900", "#EAE7E2"], ["950", "#F3F3F3"]],
        [["50", "#141414"], ["100", "#242423"], ["200", "#353434"], ["300", "#575553"], ["400", "#7D7875"], ["500", "#97918C"], ["600", "#ABA59E"], ["700", "#BFB9B3"], ["800", "#D4D0CB"], ["900", "#E9E8E4"], ["950", "#F4F3F2"]],
      ],
    },
  ],
  accents: [["Flow", "#2C50B5"], ["App", "#A22727"], ["Toolbox", "#7D95A1"]],

  type: {
    display: {
      css: '"Tiempos Text", serif',
      foundry: { name: "Klim Type Foundry", href: "https://klim.co.nz/fonts/tiempos-text/" },
      base: { size: 64, lh: 1.1, ls: "-0.025em" },
      rows: [
        ["Headline", 60, 1.22, "-0.025em"],
        ["Headline 1", 48, 1.22, "-0.025em"],
        ["Heading 2", 36, 1.22, "-0.025em"],
        ["Heading 3", 24, 1.22, "-0.025em"],
        ["Heading 4", 16, 1.22, "-0.025em"],
      ],
    },
    text: {
      css: '"Geist", sans-serif',
      foundry: { name: "Vercel", href: "https://vercel.com/font" },
      base: { size: 64, lh: 1.1, ls: "-0.025em" },
      rows: [
        ["Body Large", 18, 1.5, "0em"],
        ["Body", 16, 1.5, "0em"],
        ["Body Small", 13, 1.4, "0em"],
        ["Caption", 11, 1.4, "0.01em"],
        ["Label", 10, 1.4, "0.04em"],
      ],
    },
  },
  typeDefaults: { display: "Tiempos Text", text: "Geist Regular" },

  assetCategories: [
    { id: "textures", label: "Textures", dir: "/brands/jinba/textures/dl", items: TEXTURES },
    {
      id: "materials",
      label: "Materials",
      dir: "/brands/jinba/textures",
      items: [
        ["Golden Turrell Field", "texture-1.png", "1920×1080", "146 KB"],
        ["Brushed Grain", "texture-3.png", "3840×2160", "4.1 MB"],
      ],
    },
    {
      id: "mockups",
      label: "Mockups",
      dir: "/brands/jinba/samples",
      items: [
        ["Business Cards", "business-cards.png", "3840×2160", "8.5 MB"],
        ["Stationery", "stationary.png", "3840×2160", "9.1 MB"],
        ["Social Banners", "linkedin-banners.png", "3840×2160", "2.7 MB"],
        ["Social Posts", "linkedin-posts.png", "3840×2160", "3.5 MB"],
        ["Soft-focus Glyph", "logo-blur.png", "3840×2160", "91 KB"],
      ],
    },
    {
      id: "ui",
      label: "UI Design",
      dir: "/brands/jinba/samples",
      items: [
        ["Bento Grid", "website-bento.png", "3840×2160", "630 KB"],
        ["Product Grid", "website-products-short.png", "2314×2160", "359 KB"],
        ["Site Menu", "website-menu-short.png", "2314×2160", "350 KB"],
        ["Article Page", "website-article.png", "3840×2160", "4.1 MB"],
        ["Blog Index", "website-blog.png", "3840×2160", "6.4 MB"],
      ],
    },
  ],
  galleries: {
    logo: [
      { src: "/brands/jinba/samples/business-cards.png", alt: "Business cards", caption: "Compact lockup on business cards" },
      { src: "/brands/jinba/samples/stationary.png", alt: "Stationery", caption: "Lockup on letterhead and stationery" },
      { src: "/brands/jinba/samples/linkedin-banners.png", alt: "Social banners", caption: "Glyph and lockup across social banners" },
      { src: "/brands/jinba/samples/logo-blur.png", alt: "Logo treatment", caption: "Glyph as a soft-focus brand moment" },
    ],
    type: [
      { src: "/brands/jinba/samples/website-bento.png", alt: "Product overview", caption: "The scale at work in product marketing" },
      { src: "/brands/jinba/samples/website-products-short.png", alt: "Product grid", caption: "Geist carrying dense product UI" },
    ],
  },

  implementation: {
    intro: [
      "The system is live in `jinba-landing`.",
      "New surfaces (Flow, App, Toolbox) need to integrate the design system manually.",
    ],
    steps: [
      {
        title: "Copy the style files",
        body: [
          "From `jinba-landing/apps/landing/src/styles/`, copy `scales.css` · `tokens.css` · `theme.css`. Import them in order in the global CSS entry point.",
        ],
      },
      {
        title: "Load the fonts",
        body: [
          "Add the Google Fonts import for `Geist`: `fonts.googleapis.com/css2?family=Geist:wght@100..900`",
          "Copy `/fonts/tiempos-text-*.woff2` into the new repo's public folder and add the `@font-face` blocks from `global.css`.",
        ],
      },
      {
        title: "Apply heading defaults",
        body: [
          "Copy the `@layer base` block from `global.css` that sets h1–h4 sizing, tracking, and font-family, plus the line-height overrides below it.",
        ],
      },
      {
        title: "Wire Tailwind",
        body: [
          "Reference `theme.css` with `@theme inline`. This exposes `bg-background`, `text-foreground`, `text-sand-*`, etc. as utilities that adapt to light and dark mode automatically.",
        ],
      },
    ],
    roadmapTitle: "Toward a shared package",
    roadmap: [
      "The current setup copies files between repos. The mature form is a published NPM package — `@jinba/design-system` — that any surface installs as a dependency. Tokens, scales, and component primitives ship as one versioned artifact. New products get the full system with a single `npm install`.",
      "The token files are plain CSS custom properties, which makes them compatible with any design system that consumes CSS variables. Teams using Radix Themes, Primer, or Carbon can remap those systems' theme variables to Jinba's tokens — or ignore the Tailwind wiring entirely and reference the tokens directly in their own setup.",
    ],
  },

  generator: {
    video: "/assets/video/jinba-assetgen.mp4",
    learnMore: "https://tools.blueprintstudio.ai/asset-generator",
    request:
      "mailto:blueprint.dao@gmail.com?subject=Asset%20Generator%20access%20%E2%80%94%20Jinba" +
      "&body=Hi%20Blueprint%2C%0A%0AI%27d%20like%20access%20to%20the%20Jinba%20asset%20generator%20account.%0A%0AName%3A%0ATeam%3A%0AWork%20email%3A%0A",
  },
  downloads: {
    logos: "/downloads/jinba-logos.zip",
    tokens: "/downloads/jinba-tokens.css",
    assets: "/downloads/jinba-textures.zip",
    kit: "/downloads/jinba-brand-kit.zip",
  },
  sections: [
    { id: "logo", label: "Logo" },
    { id: "color", label: "Color" },
    { id: "type", label: "Type" },
    { id: "assets", label: "Assets" },
    { id: "implementation", label: "Doc" },
  ],
};
