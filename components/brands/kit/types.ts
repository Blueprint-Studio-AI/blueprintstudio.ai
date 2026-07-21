// Shared types for the brand-kit template. A brand page is entirely described
// by one BrandConfig object (see lib/brands/*.ts) — the kit components render it
// and hold no brand-specific content of their own.

/* ── Logo system ─────────────────────────────────────────────────────── */
export type MarkKey = "glyph" | "lockup" | "compact";
export interface MarkDef {
  src: string;
  /** width of the mark inside the artboard, e.g. "28%" */
  w: string;
}
export interface Family {
  label: string;
  fill: string;
  thumb: string;
  marks: Partial<Record<MarkKey, MarkDef>>;
}
export interface StyleDot {
  key: string;
  hex: string;
  dark: boolean;
}

/* ── Colour system ───────────────────────────────────────────────────── */
export interface Swatch {
  role: string;
  name: string;
  bg: string;
  inspect: string;
  grad?: boolean;
}
/** [label, hex] — one step of a ramp */
export type Step = [string, string];
/**
 * One tagged block of the full colour lineup. A brand supplies as many as its
 * kit actually documents — Jinba splits light/dark, HoneyB documents a single
 * neutral scale — so nothing here is invented to fill a slot.
 */
export interface LineupGroup {
  /** suffix after the slug, e.g. "light" → "jinba-light" */
  tag: string;
  rows: Step[][];
}
export type Lineup = LineupGroup[];

/* ── Type system ─────────────────────────────────────────────────────── */
export type TypeRow = [label: string, size: number, lh: number, ls: string];
export interface TypeFace {
  /** css font-family stack for the specimen */
  css: string;
  foundry: { name: string; href: string };
  base: { size: number; lh: number; ls: string };
  rows: TypeRow[];
}

/* ── Assets ──────────────────────────────────────────────────────────── */
export type Texture = [name: string, file: string, dims: string, size: string];
export interface AssetCategory {
  id: string;
  label: string;
  /** where the files live — an empty category marks itself "Soon" */
  dir: string;
  items: Texture[];
}
export interface Sample {
  src: string;
  alt: string;
  caption: string;
}

/* ── The whole brand ─────────────────────────────────────────────────── */
export interface BrandConfig {
  /** url slug, e.g. "jinba" — also used to scope the generator hand-off */
  slug: string;
  /** display name, e.g. "Jinba" */
  name: string;
  /** the brand's darkest ink; used for the hero fallback + type specimens */
  brandInk: string;

  hero: {
    image: string;
    lockup: string;
    tagline: string;
    /**
     * Scrim over the art. Dark heroes need one so the nav's white text has a
     * floor; light heroes (e.g. HoneyB's honeycomb) pass null.
     */
    overlay?: string | null;
    /** tagline ink — light heroes need a dark one */
    taglineColor?: string;
  };
  /**
   * Light-hero brands keep the nav's dark surface from the top, because white
   * nav text is invisible over pale art. Dark-hero brands start transparent and
   * let the bar materialise on scroll.
   */
  navAlwaysSolid?: boolean;
  overview: {
    /** first line, full-strength */
    headline: string;
    /** second line, dimmed */
    headlineFaint: string;
    body: string[];
  };

  /**
   * The logo artboard's backdrop.
   * "dots" (default) — a static dot grid.
   * "construction" — dashed rules measured off the selected mark's own geometry:
   *   its ink bounding box plus the edges of each top-level element in the SVG.
   *   They re-derive whenever the mark changes, so nothing is hand-placed.
   */
  logoGrid?: "dots" | "construction";

  families: Record<string, Family>;
  /** monochrome treatments shared by every family */
  mono: StyleDot[];
  kit: { logoFiles: number; logoZip: string };

  primary: Swatch[];
  secondary: Swatch[];
  lineup: Lineup;
  accents: Step[];
  /**
   * How the Color section presents itself.
   * "inspector" (default) — big swatch + HEX/RGB/HSL + contrast grades, then the
   *   ramps. Earns its space when a brand has a deep palette to interrogate.
   * "chips" — the ramps alone. For a palette small enough that the inspector is
   *   more chrome than content.
   */
  colorLayout?: "inspector" | "chips";

  type: Record<"display" | "text", TypeFace>;
  typeDefaults: Record<"display" | "text", string>;

  assetCategories: AssetCategory[];
  /** Design-in-context rails. `color` is optional — omit it and none renders. */
  galleries: Record<"logo" | "type", Sample[]> & { color?: Sample[] };

  /** Text may use `backticks` for inline code. */
  implementation: {
    intro: string[];
    steps: { title: string; body: string[] }[];
    roadmapTitle: string;
    roadmap: string[];
  };

  generator: {
    learnMore: string;
    request: string;
    /** screen recording of the generator; omitted brands render copy-only */
    video?: string;
  };
  downloads: { logos: string; tokens: string; assets: string; kit: string };
  sections: { id: string; label: string }[];
}

/** Style dots for a family: its own colour first, then the shared monochromes. */
export const stylesFor = (brand: BrandConfig, famKey: string): StyleDot[] => [
  { key: "color", hex: brand.families[famKey].fill, dark: false },
  ...brand.mono,
];

/** Derived counts, so a brand never hand-maintains them. */
export const metaFor = (b: BrandConfig) => ({
  logo: `${b.kit.logoFiles} files · ${b.kit.logoZip}`,
  // Chips mode has no named-swatch panel, so the count describes what's actually
  // on screen: every chip, across every ramp.
  color:
    b.colorLayout === "chips"
      ? `${b.lineup.reduce((n, g) => n + g.rows.reduce((m, r) => m + r.length, 0), 0)} colors · ${
          b.lineup.length
        } ramps`
      : `${b.primary.length + b.secondary.length} colors · ${b.lineup.reduce(
          (n, g) => Math.max(n, ...g.rows.map((r) => r.length)),
          0,
        )} steps`,
  type: `${Object.keys(b.type).length} Fonts · ${Object.values(b.type).reduce((n, f) => n + f.rows.length, 0)} Styles`,
  assets: `${b.assetCategories.reduce((n, c) => n + c.items.length, 0)} Assets · ${b.assetCategories.length} Asset Styles`,
});
