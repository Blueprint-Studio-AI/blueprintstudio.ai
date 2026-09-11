// Shared types for the brand-kit template. A brand page is entirely described
// by one BrandConfig object (see lib/brands/*.ts) — the kit components render it
// and hold no brand-specific content of their own.

/* ── Logo system ─────────────────────────────────────────────────────── */
export type MarkKey = "glyph" | "lockup" | "wordmark" | "compact";
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
/**
 * A tinted interior field that inherits a parent hue — not a new identity
 * colour. `stripe` is the field's own key colour, drawn as its left edge.
 */
export interface ColorField {
  name: string;
  hex: string;
  stripe: string;
}

/* ── Type system ─────────────────────────────────────────────────────── */
export type TypeRow = [label: string, size: number, lh: number, ls: string];
export interface TypeFace {
  /** css font-family stack for the specimen */
  css: string;
  foundry: { name: string; href: string };
  base: { size: number; lh: number; ls: string };
  rows: TypeRow[];
}
/** display + text are the kit's two specimens; `numbers` is an optional third. */
export type TypeGroupKey = "display" | "text" | "numbers";

/* ── Assets ──────────────────────────────────────────────────────────── */
/** [name, file, dims]. File size isn't typed here: lib/brands/measure.ts reads it at build time. */
export type Texture = [name: string, file: string, dims: string];
export interface AssetCategory {
  id: string;
  label: string;
  /** where the files live — an empty category marks itself "Soon" */
  dir: string;
  items: Texture[];
  /** logos and diagrams sit whole inside the card instead of cropping to fill it */
  fit?: "contain";
  /** stage colour behind contained assets */
  stage?: string;
  /**
   * "logo"   — white tile with a hairline border, no painted stage: reads as the
   *            file, not a picture of it.
   * "cutout" — same tile, but the image stands on the bottom edge instead of
   *            floating centred (transparent cut-outs of buildings, products).
   */
  tile?: "logo" | "cutout";
}
export interface Sample {
  src: string;
  alt: string;
  caption: string;
}

/* ── Motion ──────────────────────────────────────────────────────────── */
export interface MotionClip {
  id: string;
  name: string;
  /** rendered pixel size of the MP4 */
  dims: string;
  /** width / height, for the card's aspect box */
  aspect: string;
  duration: string;
  loop: boolean;
  /** photography fills the card; isometric scenes sit whole on a stage */
  fit?: "contain";
  stage?: string;
}

/* ── The whole brand ─────────────────────────────────────────────────── */
export type DownloadKey = "guidelines" | "logos" | "tokens" | "assets" | "kit";

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
    /** Optional line under the lockup. Omit for a lockup-only hero. */
    tagline?: string;
    /**
     * Scrim over the art. Dark heroes need one so the nav's white text has a
     * floor; light heroes (e.g. HoneyB's honeycomb) pass null.
     */
    overlay?: string | null;
    /** tagline ink — light heroes need a dark one */
    taglineColor?: string;
    /** The field the art sits on. Defaults to `brandInk`. */
    background?: string;
    /**
     * "cover" (default) — art fills the hero, Jinba-style.
     * "band"  — art sits along the bottom and fades up into the field, so the
     *           lockup reads on flat colour rather than on the artwork.
     */
    art?: "cover" | "band";
    /** band only: how much of the hero's height the art occupies */
    artHeight?: string;
    /** lockup width at desktop */
    lockupWidth?: string;
    /** hero height, e.g. "75vh" or "730px". Defaults to the original 730px. */
    height?: string;
    /** floor for a viewport-relative height, so it can't collapse */
    minHeight?: string;
    /**
     * WebP quality for the art (next/image). 75 (default) is fine for textured
     * art (Jinba); photographs with fine grain read slightly soft at 75 and use 85
     * (Arch, Arch Prime); flat graphics with soft gradients (HoneyB's comb) blotch
     * below 90. Must be listed in next.config images.qualities.
     */
    quality?: 75 | 85 | 90;
  };
  /**
   * Light-hero brands keep the nav's dark surface from the top, because white
   * nav text is invisible over pale art. Dark-hero brands start transparent and
   * let the bar materialise on scroll.
   */
  navAlwaysSolid?: boolean;
  /**
   * The other answer for a light hero: instead of pinning the dark bar on, the
   * nav starts as DARK ink on no surface and its ink, rules and CTA all cross
   * over to white as the bar materialises. Lets a pale hero keep the Jinba
   * morph rather than wearing a black bar from the first pixel.
   */
  navOnLight?: boolean;
  /** Intro headline + body under the hero. Omit and the page opens on the logo system. */
  overview?: {
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

  /**
   * Where the brand lives in the wild — live site now, product surfaces later.
   * Rendered under the overview copy; omit and nothing shows.
   */
  links?: { label: string; href: string }[];

  families: Record<string, Family>;
  /** monochrome treatments shared by every family */
  mono: StyleDot[];
  /**
   * Filled in by measure() (lib/brands/measure.ts) at build time, never typed
   * by hand: file count and size of the logo zip, and every listed file's size
   * keyed by its public path.
   */
  kit?: { logoFiles: number; logoZip: string };
  fileSizes?: Record<string, string>;

  primary: Swatch[];
  secondary: Swatch[];
  lineup: Lineup;
  /**
   * How the lineup is counted in the Color header, e.g. "chain colors" when
   * it's a separate system rather than ramps. Default: "steps" (longest ramp).
   */
  lineupNoun?: string;
  accents: Step[];
  /**
   * Tinted fields keyed to a parent hue (Arch Prime's four Earn categories),
   * drawn as wide cards under the ramps. Omit and nothing renders.
   */
  colorFields?: { tag: string; eyebrow: string; label: string; items: ColorField[] };
  /**
   * How the Color section presents itself.
   * "inspector" (default) — big swatch + HEX/RGB/HSL + contrast grades, then the
   *   ramps. Earns its space when a brand has a deep palette to interrogate.
   * "chips" — the ramps alone. For a palette small enough that the inspector is
   *   more chrome than content.
   */
  colorLayout?: "inspector" | "chips";

  type: Record<"display" | "text", TypeFace> & { numbers?: TypeFace };
  typeDefaults: Record<"display" | "text", string> & { numbers?: string };

  /**
   * Animated clips, each shipped three ways under `dir` — <id>.mp4 / .webm /
   * .gif plus <id>-poster.png. Omit and the section, its nav tab and its
   * download pill all stay off.
   */
  motion?: { dir: string; clips: MotionClip[]; zip?: string };

  assetCategories: AssetCategory[];
  /** Design-in-context rails. Each is optional — omit it and none renders. */
  galleries: Partial<Record<"logo" | "type" | "color", Sample[]>>;

  /**
   * A machine-readable design system a coding agent can be handed directly.
   * `file` MUST be a public build — see scripts/build-agent-doc.mjs. Brands
   * without one simply omit this and the block doesn't render.
   */
  agentDoc?: { file: string; title: string; blurb: string };

  generator: {
    learnMore: string;
    request: string;
    /** screen recording of the generator; omitted brands render copy-only */
    video?: string;
  };
  /**
   * Only the bundles that actually exist. A missing key hides its control
   * everywhere — section pill, Downloads list, and the nav's "Download All" —
   * rather than shipping a button that 404s. `guidelines` is the brand deck,
   * usually a shared Drive link: absolute URLs open in a new tab instead of
   * downloading.
   */
  downloads: Partial<Record<DownloadKey, string>>;
  /** Human labels for the Downloads list, keyed the same as `downloads`. */
  downloadLabels?: Partial<Record<DownloadKey, string>>;
  /** Sibling-brand hand-off at the foot of the page (Arch ↔ Arch Prime). */
  related?: { eyebrow: string; name: string; blurb: string; href: string; cta: string };
  sections: { id: string; label: string }[];
}

/** Style dots for a family: its own colour first, then the shared monochromes. */
export const stylesFor = (brand: BrandConfig, famKey: string): StyleDot[] => [
  { key: "color", hex: brand.families[famKey].fill, dark: false },
  ...brand.mono,
];

/** Derived counts, so a brand never hand-maintains them. */
export const metaFor = (b: BrandConfig) => {
  const named = b.primary.length + b.secondary.length;
  const steps = b.lineup.reduce((n, g) => Math.max(n, ...g.rows.map((r) => r.length)), 0);
  return {
    logo: b.kit ? `${b.kit.logoFiles} files · ${b.kit.logoZip}` : "",
    // Chips mode has no named-swatch panel, so the count describes what's actually
    // on screen: every chip, across every ramp.
    color:
      b.colorLayout === "chips"
        ? `${b.lineup.reduce((n, g) => n + g.rows.reduce((m, r) => m + r.length, 0), 0)} colors · ${
            b.lineup.length
          } ramps`
        : b.lineup.length
          ? b.lineupNoun
            ? `${named} colors · ${b.lineup.reduce((n, g) => n + g.rows.reduce((m, r) => m + r.length, 0), 0)} ${b.lineupNoun}`
            : `${named} colors · ${steps} steps`
          : b.colorFields
            ? `${named} colors · ${b.colorFields.items.length} ${b.colorFields.label}`
            : `${named} colors`,
    type: `${Object.keys(b.type).length} Fonts · ${Object.values(b.type).reduce((n, f) => n + f.rows.length, 0)} Styles`,
    motion: b.motion ? `${b.motion.clips.length} Clips · MP4 · WebM · GIF` : "",
    assets: `${b.assetCategories.reduce((n, c) => n + c.items.length, 0)} Assets · ${b.assetCategories.length} Asset Styles`,
  };
};
