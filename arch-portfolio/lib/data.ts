// All portfolio content for the Arch Network brand page. First draft: every
// value below is pulled from arch.network (its stylesheet, fonts, imagery and
// copy) — swap in the real brand assets as they're ported.
// Asset paths resolve from /public.

/* ── Logo families & styles ─────────────────────────────────────────── */
export type MarkKey = "glyph" | "lockup" | "compact";
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
  arch: {
    label: "Arch",
    fill: "#181818",
    thumb: "/assets/logos/glyph.svg",
    marks: {
      glyph: { src: "/assets/logos/glyph.svg", w: "26%" },
      lockup: { src: "/assets/logos/lockup.svg", w: "56%" },
    },
  },
};

export interface StyleDot {
  key: string;
  hex: string;
  /** true when the preview needs a dark stage (light marks) */
  dark: boolean;
}
// Ink leads (the mark on arch.network is drawn in near-black), then the brand
// orange, then the two light treatments that sit on photography.
export const MONO: StyleDot[] = [
  { key: "orange", hex: "#EC641D", dark: false },
  { key: "light", hex: "#F3EFD7", dark: true },
  { key: "white", hex: "#FFFFFF", dark: true },
];
export const stylesFor = (famKey: string): StyleDot[] => [
  { key: "color", hex: FAMILIES[famKey].fill, dark: false },
  ...MONO,
];

// Logo kit totals (glyph + lockup × ink / orange / white).
export const KIT = { logoFiles: 6, logoZip: "11 KB" } as const;

/* ── Colour system ──────────────────────────────────────────────────── */
export interface Swatch {
  role: string;
  name: string;
  bg: string;
  inspect: string;
}

// The five colours arch.network uses beyond ink and the brand orange —
// --color-dark-purple, --color-purple, --color-light, and the gold and peach it
// sets inline. Names are working titles.
export const PRIMARY: Swatch[] = [
  { role: "Accent", name: "Indigo", bg: "#3E3A8E", inspect: "#3E3A8E" },
  { role: "Accent", name: "Violet", bg: "#736FB9", inspect: "#736FB9" },
  { role: "Accent", name: "Gold", bg: "#E6C98A", inspect: "#E6C98A" },
  { role: "Accent", name: "Parchment", bg: "#F3EFD7", inspect: "#F3EFD7" },
  { role: "Accent", name: "Peach", bg: "#F4814A", inspect: "#F4814A" },
];
export const SECONDARY: Swatch[] = [];

export type Step = [string, string]; // [label, hex]
export const ACCENTS: Step[] = PRIMARY.map((s) => [s.name, s.inspect]);

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
export const TYPE: Record<"display" | "text", TypeFace> = {
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
};
export const TYPE_DEFAULTS = { display: "Gascogne Serial", text: "Geist Regular" } as const;

/* ── Brand assets ───────────────────────────────────────────────────── */
export type Texture = [name: string, file: string, dims: string, size: string];

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
  /** logo files: white tile with a hairline border, no painted stage — reads as the file, not a picture of it */
  tile?: "logo";
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
      ["Skyline", "hero-skyline.jpg", "1280×720", "60 KB"],
      ["Anchored", "anchored-sea.jpg", "1280×720", "60 KB"],
      ["Institutions", "risk.jpg", "1266×678", "108 KB"],
      ["Markets", "stats.jpg", "2646×794", "540 KB"],
      ["Home Footer", "footer-home.jpg", "2200×833", "552 KB"],
      ["Ecosystem Hero", "hero-ecosystem.jpg", "2880×1680", "796 KB"],
      ["Ecosystem Footer", "footer-eco.jpg", "2880×1090", "652 KB"],
    ],
  },
  {
    id: "diagrams",
    label: "Architecture",
    dir: "/assets/diagrams",
    fit: "contain",
    stage: "#181818",
    items: [
      ["The Chain", "arch_chain.svg", "1340×444", "20 KB"],
      ["Threshold Keys", "arch_keys.svg", "1233×448", "68 KB"],
      ["Settlement", "arch_settlement.svg", "1184×356", "28 KB"],
      ["UTXOs", "arch_utxos.svg", "1152×429", "28 KB"],
    ],
  },
  {
    id: "primitives",
    label: "Primitives",
    dir: "/assets/diagrams",
    fit: "contain",
    stage: "#F3EFD7",
    items: [
      ["Fast & Final", "fast-final.svg", "741×741", "32 KB"],
      ["Lending", "lending.svg", "741×420", "40 KB"],
      ["Liquidation", "liquidation.svg", "741×497", "20 KB"],
      ["UTXO Pool", "utxo-pool.svg", "741×697", "124 KB"],
      ["Finance District", "finance-district.png", "2048×880", "236 KB"],
    ],
  },
  {
    id: "social",
    label: "Social",
    dir: "/assets/photo",
    items: [
      ["Open Graph — Home", "og-home.png", "1200×630", "124 KB"],
      ["Open Graph — Chain", "og-chain.png", "1200×630", "336 KB"],
    ],
  },
  {
    id: "partners",
    label: "Backed By",
    dir: "/assets/partners",
    fit: "contain",
    tile: "logo",
    items: [
      ["Pantera", "pantera.svg", "381×29", "4 KB"],
      ["Multicoin Capital", "multicoin.svg", "421×54", "12 KB"],
      ["Newman", "newman.svg", "246×114", "8 KB"],
      ["CMS", "cms.svg", "184×114", "4 KB"],
      ["OKX", "okx.svg", "182×114", "4 KB"],
      ["Tangent", "tangent.svg", "246×114", "8 KB"],
      ["UTXO", "utxo.svg", "122×114", "4 KB"],
      ["Portal", "portal.svg", "246×114", "20 KB"],
      ["Cypher", "cypher.svg", "246×114", "24 KB"],
      ["Big Brain", "bigbrain.svg", "246×114", "16 KB"],
      ["Ambush", "ambush.svg", "246×114", "20 KB"],
    ],
  },
  {
    id: "ecosystem",
    label: "Ecosystem",
    dir: "/assets/ecosystem",
    fit: "contain",
    tile: "logo",
    items: [
      ["Chaos Labs", "chaos-labs.svg", "216×96", "140 KB"],
      ["HoneyB", "honey-b.svg", "726×201", "12 KB"],
      ["Gauntlet", "gauntlet.svg", "875×200", "8 KB"],
      ["Bump", "bump.svg", "505×142", "4 KB"],
      ["Wasabi", "wasabi.svg", "216×96", "16 KB"],
      ["Fordefi", "fordefi.svg", "175×28", "4 KB"],
      ["Anchorage", "anchorage.svg", "157×36", "8 KB"],
      ["Chintai", "chintai.svg", "216×96", "68 KB"],
      ["Kinesis", "kinesis.svg", "216×96", "36 KB"],
      ["Xverse", "xverse.svg", "600×112", "8 KB"],
      ["Asigna", "asigna.svg", "284×98", "8 KB"],
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

/* ── Motion ─────────────────────────────────────────────────────────── */
export interface MotionClip {
  id: string;
  name: string;
  /** rendered pixel size of the MP4 */
  dims: string;
  /** width / height, for the card's aspect box */
  aspect: string;
  duration: string;
  loop: boolean;
  /** photography fills the card; the isometric scenes sit whole on parchment */
  fit?: "contain";
  stage?: string;
}

// The /chain page draws its isometric stack procedurally in SVG and animates
// it with requestAnimationFrame — there's no file to download on the site.
// These were rendered frame-by-frame from the live page under a fixed clock,
// one full 5.9s cycle each, so every loop closes on itself. The walkthrough is
// the scroll journey through the four layers. The two films are the home page's
// own hero clips.
export const MOTION: MotionClip[] = [
  { id: "stack-hero", name: "Chain Stack — Hero", dims: "1600×1600", aspect: "1 / 1", duration: "5.9s", loop: true, fit: "contain", stage: "#FBFAF7" },
  { id: "stack-chains", name: "Bitcoin & Arch Chains", dims: "1600×1600", aspect: "1 / 1", duration: "5.9s", loop: true, fit: "contain", stage: "#FBFAF7" },
  { id: "stack-native-tech", name: "Native Tech", dims: "1600×1600", aspect: "1 / 1", duration: "5.9s", loop: true, fit: "contain", stage: "#FBFAF7" },
  { id: "stack-primitives", name: "Financial Primitives", dims: "1600×1600", aspect: "1 / 1", duration: "5.9s", loop: true, fit: "contain", stage: "#FBFAF7" },
  { id: "stack-unlocks", name: "Finance Unlocks", dims: "1600×1600", aspect: "1 / 1", duration: "5.9s", loop: true, fit: "contain", stage: "#FBFAF7" },
  { id: "stack-walkthrough", name: "Layer Walkthrough", dims: "1600×1600", aspect: "1 / 1", duration: "15.9s", loop: false, fit: "contain", stage: "#FBFAF7" },
  { id: "hero-home", name: "Skyline Film", dims: "1920×1080", aspect: "16 / 9", duration: "7.6s", loop: true, stage: "#181818" },
  { id: "anchored", name: "Anchored Film", dims: "1920×1080", aspect: "16 / 9", duration: "7.5s", loop: true, stage: "#181818" },
];

/* ── Section nav ────────────────────────────────────────────────────── */
export const SECTIONS = [
  { id: "logo", label: "Logo" },
  { id: "color", label: "Color" },
  { id: "type", label: "Type" },
  { id: "motion", label: "Motion" },
  { id: "assets", label: "Assets" },
  { id: "implementation", label: "Doc" },
] as const;

// Derived counts (single source of truth).
export const META = {
  logo: `${KIT.logoFiles} files · ${KIT.logoZip}`,
  color: `${PRIMARY.length + SECONDARY.length} colors`,
  type: `${Object.keys(TYPE).length} Fonts · ${Object.values(TYPE).reduce((n, f) => n + f.rows.length, 0)} Styles`,
  assets: `${ASSET_CATEGORIES.reduce((n, c) => n + c.items.length, 0)} Assets · ${ASSET_CATEGORIES.length} Asset Styles`,
  motion: `${MOTION.length} Clips · MP4 · WebM · GIF`,
};
