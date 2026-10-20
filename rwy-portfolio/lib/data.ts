// All portfolio content for the RWY brand page (formerly Double Digit, part of
// the Nectar Group alongside HoneyB). First draft: every value below is taken
// from the rebranded landing site (honeybtc/doubledigit-landing, branch
// review/rwy-rebrand) and the logo files in ~/Desktop/RWY site assets.
// Asset paths resolve from /public.

/* ── Logo families & styles ─────────────────────────────────────────── */
export type MarkKey = "glyph" | "lockup" | "wordmark" | "compact";
export interface MarkDef {
  src: string;
  w: string;
}
export interface Family {
  label: string;
  /** the brand's own colouring; the configurator flattens every fill for mono styles */
  fill: string;
  thumb: string;
  marks: Partial<Record<MarkKey, MarkDef>>;
}

export const FAMILIES: Record<string, Family> = {
  rwy: {
    label: "RWY",
    fill: "#FF3200",
    thumb: "/assets/logos/rwy-glyph.svg",
    marks: {
      glyph: { src: "/assets/logos/rwy-glyph.svg", w: "20%" },
      lockup: { src: "/assets/logos/rwy-lockup.svg", w: "60%" },
    },
  },
};

export interface StyleDot {
  key: string;
  hex: string;
  /** true when the preview needs a dark stage (light marks) */
  dark: boolean;
}
// "color" keeps the two-tone file as drawn (coral mark, ink wordmark). The
// landing site's rules: nav = mark only in ink (white over the hero), footer =
// full logo white, favicon = coral mark.
export const MONO: StyleDot[] = [
  { key: "ink", hex: "#1E2028", dark: false },
  { key: "white", hex: "#FDFCFB", dark: true },
];
export const stylesFor = (famKey: string): StyleDot[] => [
  { key: "color", hex: FAMILIES[famKey].fill, dark: false },
  ...MONO,
];

// Logo kit totals (glyph + lockup × colour / ink / white).
export const KIT = { logoFiles: 6, logoZip: "8 KB" } as const;

/* ── Colour system ──────────────────────────────────────────────────── */
export interface Swatch {
  role: string;
  name: string;
  bg: string;
  inspect: string;
}

// RWY brand palette (Nectar Group brand deck, June 2026). Three swatches on the
// deck slide carry hex labels that don't match the colour painted on them;
// these use the painted colour (deck label in the trailing comment):
//   Oyster Cracker #FDEAD3 (label #FDE6CF), Sea Foam #FDFCFB (label #FDF4EC —
//   painted value is also the live site's --paper), Ocean Fog #E4E7ED (label
//   #FFFEFD, which is the slide's own background).
export const PRIMARY: Swatch[] = [
  { role: "Primary", name: "Daymark", bg: "#FF3200", inspect: "#FF3200" },
];
export const SECONDARY: Swatch[] = [
  { role: "Secondary", name: "Daymark Dark", bg: "#931504", inspect: "#931504" },
  { role: "Secondary", name: "Oyster Cracker", bg: "#FDEAD3", inspect: "#FDEAD3" },
  { role: "Secondary", name: "Sea Foam", bg: "#FDFCFB", inspect: "#FDFCFB" },
  { role: "Text", name: "Squid Ink", bg: "#1E2028", inspect: "#1E2028" },
  { role: "Accent", name: "Ocean Breeze", bg: "#A4B6C6", inspect: "#A4B6C6" },
  { role: "Secondary", name: "Ocean Fog", bg: "#E4E7ED", inspect: "#E4E7ED" },
];

export type Step = [string, string]; // [label, hex]

/* ── Type system ────────────────────────────────────────────────────── */
export type TypeRow = [label: string, size: number, lh: number, ls: string];
export interface TypeFace {
  css: string;
  /** who made the face — credited under the specimen */
  foundry: { name: string; href: string };
  base: { size: number; lh: number; ls: string };
  /** CSS weight + its name, shown in the metric readout */
  weight: [number, string];
  rows: TypeRow[];
}
// Sizes, leading and tracking are the landing site's (dd.css). Hiragino Sans is
// a system face: it ships on Apple devices only, everything else falls back.
export const TYPE: Record<"display" | "text", TypeFace> = {
  display: {
    css: '"Hiragino Sans", "Hiragino Kaku Gothic ProN", -apple-system, "Helvetica Neue", Arial, sans-serif',
    foundry: { name: "Jiyu-Kobo · ships with macOS and iOS", href: "https://en.wikipedia.org/wiki/Hiragino" },
    base: { size: 64, lh: 1.1, ls: "-0.035em" },
    weight: [500, "Medium"],
    rows: [
      ["Headline", 96, 1, "-0.04em"],
      ["Heading 1", 64, 1.1, "-0.035em"],
      ["Heading 2", 48, 1.13, "-0.03em"],
      ["Heading 3", 32, 1.2, "-0.03em"],
    ],
  },
  text: {
    css: '"Geist", sans-serif',
    foundry: { name: "Vercel", href: "https://vercel.com/font" },
    base: { size: 64, lh: 1.1, ls: "-0.025em" },
    weight: [400, "Regular"],
    rows: [
      ["Title Large", 30, 1.13, "-0.03em"],
      ["Title", 24, 1.2, "-0.02em"],
      ["Body", 18, 1.4, "-0.02em"],
      ["Label", 16, 1.2, "-0.02em"],
      ["Caption", 15, 1, "-0.02em"],
    ],
  },
};
export const TYPE_DEFAULTS = { display: "Hiragino Sans", text: "Geist Regular" } as const;

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

// The landing site's photography and water textures — the coral sail on open
// water is the identity's one recurring image.
export const ASSET_CATEGORIES: AssetCategory[] = [
  {
    id: "photography",
    label: "Photography",
    dir: "/assets/photo",
    items: [
      ["Open Water", "open-water.jpg", "1440×868", "159 KB"],
      ["Horizon", "horizon.jpg", "1920×1080", "151 KB"],
      ["Sail", "sail.jpg", "2400×1250", "170 KB"],
      ["Compass", "compass.jpg", "1200×633", "69 KB"],
      ["Rigging", "rigging.jpg", "882×568", "35 KB"],
      ["Deck", "deck.jpg", "1200×675", "100 KB"],
      ["Swell", "swell.jpg", "1440×684", "176 KB"],
    ],
  },
  {
    id: "water",
    label: "Water",
    dir: "/assets/water",
    items: [
      ["Water Surface", "water-surface.jpg", "1376×768", "177 KB"],
      ["Caustics", "caustics.jpg", "1024×1024", "63 KB"],
    ],
  },
];

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
  color: `${PRIMARY.length + SECONDARY.length} colors`,
  type: `${Object.keys(TYPE).length} Fonts · ${Object.values(TYPE).reduce((n, f) => n + f.rows.length, 0)} Styles`,
  assets: `${ASSET_CATEGORIES.reduce((n, c) => n + c.items.length, 0)} Assets · ${ASSET_CATEGORIES.length} Asset Styles`,
};
