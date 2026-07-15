// All portfolio content, ported from the prototype's data blocks.
// Asset paths resolve from /public.

/* ── Logo families & styles ─────────────────────────────────────────── */
export type MarkKey = "glyph" | "lockup" | "compact";
export interface MarkDef {
  src: string;
  w: string;
}
export interface Family {
  label: string;
  fill: string;
  thumb: string;
  marks: Partial<Record<MarkKey, MarkDef>>;
}

export const FAMILIES: Record<string, Family> = {
  jinba: {
    label: "Jinba",
    fill: "#322014",
    thumb: "/assets/dl/glyph-dark.png",
    marks: {
      glyph: { src: "/assets/dl/glyph.svg", w: "28%" },
      lockup: { src: "/assets/dl/lockup.svg", w: "60%" },
      compact: { src: "/assets/dl/lockup-small.svg", w: "54%" },
    },
  },
  flow: {
    label: "Flow",
    fill: "#2C50B5",
    thumb: "/assets/sub-brands/jinba-flow-glyph.png",
    marks: {
      glyph: { src: "/assets/sub-brands/jinba-flow-glyph.svg", w: "28%" },
      lockup: { src: "/assets/sub-brands/jinba-flow-lockup.svg", w: "52%" },
    },
  },
  toolbox: {
    label: "Toolbox",
    fill: "#7D95A1",
    thumb: "/assets/sub-brands/jinba-toolbox-glyph.png",
    marks: {
      glyph: { src: "/assets/sub-brands/jinba-toolbox-glyph.svg", w: "28%" },
      lockup: { src: "/assets/sub-brands/jinba-toolbox-lockup.svg", w: "58%" },
    },
  },
  app: {
    label: "App",
    fill: "#A22727",
    thumb: "/assets/sub-brands/jinba-app-glyph.png",
    marks: {
      glyph: { src: "/assets/sub-brands/jinba-app-glyph.svg", w: "28%" },
      lockup: { src: "/assets/sub-brands/jinba-app-lockup.svg", w: "48%" },
    },
  },
};

export interface StyleDot {
  key: string;
  hex: string;
  dark: boolean;
}
// Monochrome treatments shared by every family. Each family leads with its own
// brand colour, so a sub-brand renders in-colour by default.
export const MONO: StyleDot[] = [
  { key: "black", hex: "#000000", dark: false },
  { key: "light", hex: "#FAF8F3", dark: true },
  { key: "white", hex: "#FFFFFF", dark: true },
];
export const stylesFor = (famKey: string): StyleDot[] => [
  { key: "color", hex: FAMILIES[famKey].fill, dark: false },
  ...MONO,
];

// Logo kit totals (the file manifest UI was retired; the count is fixed).
export const KIT = { logoFiles: 30, logoZip: "228 KB", texZip: "50 MB" } as const;

/* ── Colour system ──────────────────────────────────────────────────── */
export interface Swatch {
  role: string;
  name: string;
  bg: string;
  inspect: string;
  labelInk: string;
  hexInk: string;
  hexes: string[];
  grad?: boolean;
}

export const PRIMARY: Swatch[] = [
  { role: "Primary", name: "Urushi", bg: "#322014", inspect: "#322014", labelInk: "#F4F1EB", hexInk: "#F4F1EB", hexes: ["#322014"] },
  { role: "Primary", name: "Kuri", bg: "#5A3921", inspect: "#5A3921", labelInk: "#FAF8F3", hexInk: "#FAF8F3", hexes: ["#5A3921"] },
  {
    role: "Primary",
    name: "Haku",
    bg: "linear-gradient(180deg,#B78D62 0%,#C5A681 43.75%,#7E4E2D 80.3%,#52321B 100%)",
    inspect: "#7E4E2D",
    labelInk: "#322014",
    hexInk: "#FAF8F3",
    hexes: ["#52321B", "#7E4E2D", "#B78D62", "#C5A681"],
    grad: true,
  },
];
export const SECONDARY: Swatch[] = [
  { role: "Secondary", name: "Tsuchi", bg: "#C5A681", inspect: "#C5A681", labelInk: "#322014", hexInk: "#322014", hexes: ["#C5A681"] },
  { role: "Secondary", name: "Suna", bg: "#EFEEE8", inspect: "#EFEEE8", labelInk: "#5A3921", hexInk: "#5A3921", hexes: ["#EFEEE8"] },
  { role: "Secondary", name: "Kami", bg: "#F5F4F2", inspect: "#F5F4F2", labelInk: "#5A3921", hexInk: "#5A3921", hexes: ["#F5F4F2"] },
];

export type Step = [string, string]; // [label, hex]
export const LINEUP: Record<"light" | "dark", Record<"Brand" | "Neutral", Step[]>> = {
  light: {
    Brand: [["50", "#FAF8F3"], ["100", "#F4F1EB"], ["200", "#EAE3D7"], ["300", "#DCCBB3"], ["400", "#CAB296"], ["500", "#B59575"], ["600", "#9E7754"], ["700", "#835836"], ["800", "#5A3921"], ["900", "#342115"], ["950", "#2B1C13"]],
    Neutral: [["50", "#F8F8F8"], ["100", "#EFEFEE"], ["200", "#E2E2E1"], ["300", "#CECDCC"], ["400", "#B8B6B3"], ["500", "#9E9B98"], ["600", "#837F7C"], ["700", "#66625F"], ["800", "#44413F"], ["900", "#272625"], ["950", "#21201F"]],
  },
  dark: {
    Brand: [["50", "#1A120E"], ["100", "#2E2019"], ["200", "#413026"], ["300", "#694F3E"], ["400", "#93715A"], ["500", "#AC8B70"], ["600", "#BEA083"], ["700", "#CEB69A"], ["800", "#DCCFBC"], ["900", "#EAE7E2"], ["950", "#F3F3F3"]],
    Neutral: [["50", "#141414"], ["100", "#242423"], ["200", "#353434"], ["300", "#575553"], ["400", "#7D7875"], ["500", "#97918C"], ["600", "#ABA59E"], ["700", "#BFB9B3"], ["800", "#D4D0CB"], ["900", "#E9E8E4"], ["950", "#F4F3F2"]],
  },
};
export const ACCENTS: Step[] = [["Flow", "#2C50B5"], ["App", "#A22727"], ["Toolbox", "#7D95A1"]];

/* ── Type system ────────────────────────────────────────────────────── */
export type TypeRow = [label: string, size: number, lh: number, ls: string];
export interface TypeFace {
  css: string;
  base: { size: number; lh: number; ls: string };
  rows: TypeRow[];
}
export const TYPE: Record<"display" | "text", TypeFace> = {
  display: {
    css: '"Tiempos Text", serif',
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
    base: { size: 64, lh: 1.1, ls: "-0.025em" },
    rows: [
      ["Body Large", 18, 1.5, "0em"],
      ["Body", 16, 1.5, "0em"],
      ["Body Small", 13, 1.4, "0em"],
      ["Caption", 11, 1.4, "0.01em"],
      ["Label", 10, 1.4, "0.04em"],
    ],
  },
};
export const TYPE_DEFAULTS = { display: "Tiempos Text", text: "Geist Regular" } as const;

/* ── Textures ───────────────────────────────────────────────────────── */
export type Texture = [name: string, file: string, dims: string, size: string];
export const TEXTURES: Texture[] = [
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

/* ── Design Applications galleries ──────────────────────────────────── */
export interface Sample {
  src: string;
  alt: string;
  caption: string;
}
export const GALLERIES: Record<"logo" | "type" | "textures", Sample[]> = {
  logo: [
    { src: "/assets/samples/business-cards.png", alt: "Business cards", caption: "Compact lockup on business cards" },
    { src: "/assets/samples/stationary.png", alt: "Stationery", caption: "Lockup on letterhead and stationery" },
    { src: "/assets/samples/linkedin-banners.png", alt: "Social banners", caption: "Glyph and lockup across social banners" },
    { src: "/assets/samples/logo-blur.png", alt: "Logo treatment", caption: "Glyph as a soft-focus brand moment" },
  ],
  type: [
    { src: "/assets/samples/website-bento.png", alt: "Product overview", caption: "The scale at work in product marketing" },
    { src: "/assets/samples/website-products-short.png", alt: "Product grid", caption: "Geist carrying dense product UI" },
  ],
  textures: [
    { src: "/assets/samples/linkedin-posts.png", alt: "Social posts", caption: "Fields behind social storytelling" },
    { src: "/assets/samples/website-menu-short.png", alt: "Site menu", caption: "Texture grounding the site menu" },
  ],
};

/* ── Section nav ────────────────────────────────────────────────────── */
export const SECTIONS = [
  { id: "logo", label: "Logo" },
  { id: "color", label: "Color" },
  { id: "type", label: "Typography" },
  { id: "textures", label: "Textures" },
  { id: "implementation", label: "Implementation" },
] as const;

// Derived counts (single source of truth).
export const META = {
  logo: `${KIT.logoFiles} files · ${KIT.logoZip}`,
  color: `${PRIMARY.length + SECONDARY.length} colors · ${LINEUP.light.Brand.length} steps`,
  type: `${Object.keys(TYPE).length} typefaces`,
  textures: `${TEXTURES.length} textures · ${KIT.texZip}`,
};
