// All portfolio content for the Arch Network brand page. First draft: every
// value below is pulled from arch.network (its stylesheet, fonts, imagery and
// copy) — swap in the real brand assets as they're ported.
// Asset paths resolve from /public.

/* ── Logo families & styles ─────────────────────────────────────────── */
export type MarkKey = "glyph" | "lockup" | "wordmark" | "compact";
export interface MarkDef {
  src: string;
  w: string;
}
export interface Family {
  label: string;
  /** the fill the canonical SVG is drawn in — the configurator recolours FROM this */
  fill: string;
  thumb: string;
  marks: Partial<Record<MarkKey, MarkDef>>;
}

export const FAMILIES: Record<string, Family> = {
  prime: {
    label: "Arch Prime",
    fill: "#292A2E",
    thumb: "/assets/logos/prime-glyph.svg",
    marks: {
      glyph: { src: "/assets/logos/prime-glyph.svg", w: "24%" },
      lockup: { src: "/assets/logos/prime-lockup.svg", w: "64%" },
      wordmark: { src: "/assets/logos/prime-wordmark.svg", w: "54%" },
    },
  },
};

export interface StyleDot {
  key: string;
  hex: string;
  /** true when the preview needs a dark stage (light marks) */
  dark: boolean;
}
// Ink leads (the supplied files are drawn in #292A2E), then the two brand hues,
// then white for photography and dark surfaces.
export const MONO: StyleDot[] = [
  { key: "orange", hex: "#FF5E00", dark: false },
  { key: "indigo", hex: "#545EB3", dark: false },
  { key: "white", hex: "#FFFFFF", dark: true },
];
export const stylesFor = (famKey: string): StyleDot[] => [
  { key: "color", hex: FAMILIES[famKey].fill, dark: false },
  ...MONO,
];

// Logo kit totals (glyph + lockup × ink / orange / white).
export const KIT = { logoFiles: 9, logoZip: "20 KB" } as const;

/* ── Colour system ──────────────────────────────────────────────────── */
export interface Swatch {
  role: string;
  name: string;
  bg: string;
  inspect: string;
}

// Arch Prime primary palette (brand deck, September 2026).
export const PRIMARY: Swatch[] = [
  { role: "Primary", name: "Arch-Orange", bg: "#FF5E00", inspect: "#FF5E00" },
  { role: "Secondary", name: "Arch-Indigo", bg: "#545EB3", inspect: "#545EB3" },
];
// One hue per app section — colour is spent once, at nav level.
export const SECONDARY: Swatch[] = [
  { role: "App Section", name: "Boost", bg: "#6B1E0D", inspect: "#6B1E0D" },
  { role: "App Section", name: "Earn", bg: "#113671", inspect: "#113671" },
  { role: "App Section", name: "Borrow", bg: "#1F5543", inspect: "#1F5543" },
];

export type Step = [string, string]; // [label, hex]
// Earn's four sub-categories — tinted interior fields that inherit Earn's hue,
// never new identity colours. The edge stripe is the category's own key colour
// (brand deck p.17).
export interface EarnCategory {
  name: string;
  hex: string;
  stripe: string;
}
export const EARN_CATEGORIES: EarnCategory[] = [
  { name: "Products", hex: "#F1CFB6", stripe: "#E6601A" },
  { name: "Liquidity Pools", hex: "#CCDAF0", stripe: "#2A5AE8" },
  { name: "Lending", hex: "#CEDBD7", stripe: "#1F5543" },
  { name: "Strategies", hex: "#F2E9CE", stripe: "#E2B119" },
];
export const ACCENTS: Step[] = EARN_CATEGORIES.map((c) => [c.name, c.hex]);

/* ── Type system ────────────────────────────────────────────────────── */
export type TypeRow = [label: string, size: number, lh: number, ls: string];
export interface TypeFace {
  css: string;
  /** who made the face — credited under the specimen */
  foundry: { name: string; href: string };
  base: { size: number; lh: number; ls: string };
  rows: TypeRow[];
}
// Tracking steps mirror the site's stylesheet (-.03 / -.022 / -.018 / -.014 /
// -.012 / -.01em for headings; .06 / .1 / .14em for small caps labels).
export const TYPE: Record<"display" | "text" | "numbers", TypeFace> = {
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
  text: {
    css: '"Geist", sans-serif',
    foundry: { name: "Vercel", href: "https://vercel.com/font" },
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
};
export const TYPE_DEFAULTS = { display: "Gascogne Serial", text: "Geist Regular", numbers: "$12,480,530.00" } as const;

/* ── Brand assets ───────────────────────────────────────────────────── */
export type Texture = [name: string, file: string, dims: string, size: string, stage?: string];

export interface AssetCategory {
  id: string;
  label: string;
  /** where the files live — empty categories have nothing to point at yet */
  dir: string;
  items: Texture[];
  /** logos and diagrams sit whole inside the card instead of cropping to fill it */
  fit?: "contain";
  /** stage colour behind contained assets */
  stage?: string;
  /** logo files: white tile with a hairline border, no painted stage — reads as the file, not a picture of it.
   *  cutout: same tile, but the image stands on the bottom edge instead of floating centred. */
  tile?: "logo" | "cutout";
  /** bump when files change in place — appended to image URLs so browsers drop cached renders
   *  (the optimizer refuses query strings on local files, so versioned categories serve the raw PNGs) */
  version?: string;
}

// Everything here is lifted straight off arch.network — the hero and section
// video posters, the section photography, the /chain diagrams, the investor
// row and the ecosystem directory. Real production files replace these as
// they're ported in.
export const ASSET_CATEGORIES: AssetCategory[] = [
  {
    id: "photography",
    label: "Photography",
    dir: "/assets/photo",
    items: [
      ["Key Visual", "prime-key-visual.png", "1920×1080", "2.2 MB"],
      ["City at Dusk", "city-top.png", "1920×1080", "2.6 MB"],
    ],
  },
  {
    // The place system's buildings: one exterior per app section (Boost,
    // Borrow, Earn) and one per Earn category, as transparent cut-outs. Shown
    // as the files they are — no painted stage — standing on the tile's
    // bottom edge, the way they sit on a banner.
    id: "buildings",
    label: "Buildings",
    dir: "/assets/buildings",
    tile: "cutout",
    version: "2",
    items: [
      ["Boost", "boost.png", "1080×1080", "409 KB"],
      ["Borrow", "borrow.png", "1080×1080", "581 KB"],
      ["Earn", "earn.png", "1080×1080", "232 KB"],
      ["Earn (alt)", "earn-alt.png", "1080×1080", "229 KB"],
      ["Pool", "pool.png", "1080×1080", "510 KB"],
      ["Product", "product.png", "1080×1080", "789 KB"],
      ["Strategy", "strategy.png", "1080×1080", "597 KB"],
    ],
  },
];

// Generator hand-off. Two audiences, two doors: teammates request access to the
// shared account (a real V0 mailto — no access backend to fake), prospects read
// on. The section appends the brand + category the visitor already chose.
export const ASSET_GEN = "https://tools.blueprintstudio.ai/asset-generator";
export const ASSET_GEN_REQUEST =
  "mailto:blueprint.dao@gmail.com?subject=Asset%20Generator%20access%20%E2%80%94%20Arch%20Network" +
  "&body=Hi%20Blueprint%2C%0A%0AI%27d%20like%20access%20to%20the%20Arch%20Network%20asset%20generator%20account.%0A%0AName%3A%0ATeam%20(Arch%20%2F%20Arch%20Prime)%3A%0AWork%20email%3A%0A";

/* ── Design Applications galleries ──────────────────────────────────── */
export interface Sample {
  src: string;
  alt: string;
  caption: string;
}
// The four Earn categories as places: each field colour becomes the sky
// behind a building in the category's key colour (brand deck).
export const GALLERIES: Record<"color", Sample[]> = {
  color: [
    // section-level applications first — the hue spent once, at nav level
    { src: "/assets/samples/section-borrow.jpg", alt: "Borrow — bank on a green field", caption: "Borrow" },
    { src: "/assets/samples/section-boost.jpg", alt: "Boost — launch tower on a maroon field", caption: "Boost" },
    { src: "/assets/samples/earn-products.jpg", alt: "Products — orange tower on a peach field", caption: "Products" },
    { src: "/assets/samples/earn-pools.jpg", alt: "Liquidity Pools — blue tower on a sky field", caption: "Liquidity Pools" },
    { src: "/assets/samples/earn-lending.jpg", alt: "Lending — green tower on a sage field", caption: "Lending" },
    { src: "/assets/samples/earn-strategies.jpg", alt: "Strategies — gold tower on a cream field", caption: "Strategies" },
  ],
};

/* ── Section nav ────────────────────────────────────────────────────── */
export const SECTIONS = [
  { id: "logo", label: "Logo" },
  { id: "color", label: "Color" },
  { id: "type", label: "Type" },
  { id: "assets", label: "Assets" },
  { id: "implementation", label: "Doc" },
] as const;

// Derived counts (single source of truth).
export const META = {
  logo: `${KIT.logoFiles} files · ${KIT.logoZip}`,
  color: `${PRIMARY.length + SECONDARY.length} colors · ${ACCENTS.length} Earn categories`,
  type: `${Object.keys(TYPE).length} Fonts · ${Object.values(TYPE).reduce((n, f) => n + f.rows.length, 0)} Styles`,
  assets: `${ASSET_CATEGORIES.reduce((n, c) => n + c.items.length, 0)} Assets · ${ASSET_CATEGORIES.length} Asset Styles`,
};
