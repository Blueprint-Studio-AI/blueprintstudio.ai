import type { BrandConfig } from "@/components/brands/kit/types";

// Arch Network — ported from Nick's standalone review build (arch-portfolio-review).
// First draft: every value was pulled from arch.network (its stylesheet, fonts,
// imagery and copy) — swap in the production brand files as they're ported.
// Assets live under /public/brands/arch.

const B = "/brands/arch";

export const arch: BrandConfig = {
  slug: "arch",
  name: "Arch Network",
  brandInk: "#181818",

  // The night-office photograph from the site's markets section, under the
  // same dark tint arch.network gives it. The darker band across the top is
  // what carries the nav's white text while the nav has no surface of its own.
  hero: {
    image: `${B}/photo/stats.jpg`,
    lockup: `${B}/logos/lockup-white.svg`,
    tagline: "Brand Identity · Design System · Logo System · 2026",
    overlay: "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(24,24,24,0.45) 18%, rgba(24,24,24,0.35) 100%)",
    taglineColor: "#F3EFD7",
    lockupWidth: "364px", // 104px tall at the lockup's 3.5:1
    quality: 85, // film grain smooths out at the default 75 (147 KB → 213 KB)
  },

  // Copy is the home page's own framing: "Real Bitcoin." above the fold,
  // "Finally programmable." on the unfurl.
  overview: {
    headline: "Real Bitcoin.",
    headlineFaint: "Finally programmable.",
    body: [
      "Arch is Bitcoin-native financial market infrastructure. Bitcoin is the world's strongest store of value, but it mostly can't be used productively without giving up custody. Arch gives it native credit, yield, and trading while staying anchored to Bitcoin's settlement and core values.",
      "The identity is built on that contrast: a warm editorial serif and the parchment ground of a financial institution, cut by a single signal orange and a mark of four nested arches. Serious where it counts, never cold.",
    ],
  },
  links: [{ label: "arch.network", href: "https://arch.network" }],

  families: {
    arch: {
      label: "Arch",
      fill: "#181818",
      thumb: `${B}/logos/glyph.svg`,
      marks: {
        glyph: { src: `${B}/logos/glyph.svg`, w: "26%" },
        lockup: { src: `${B}/logos/lockup.svg`, w: "56%" },
      },
    },
  },
  // Ink leads (the mark on arch.network is drawn in near-black), then the brand
  // orange, then the two light treatments that sit on photography.
  mono: [
    { key: "orange", hex: "#EC641D", dark: false },
    { key: "light", hex: "#F3EFD7", dark: true },
    { key: "white", hex: "#FFFFFF", dark: true },
  ],

  // Orange is arch.network's --color-orange, the signal colour. (Black, the ink,
  // is brandInk and stays in the tokens; it isn't shown as a swatch.)
  primary: [{ role: "Primary", name: "Orange", bg: "#EC641D", inspect: "#EC641D" }],
  // Indigo, Violet and Parchment are --color-dark-purple, --color-purple and
  // --color-light. Names are working titles.
  secondary: [
    { role: "Accent", name: "Indigo", bg: "#3E3A8E", inspect: "#3E3A8E" },
    { role: "Accent", name: "Violet", bg: "#736FB9", inspect: "#736FB9" },
    { role: "Accent", name: "Parchment", bg: "#F3EFD7", inspect: "#F3EFD7" },
  ],
  // The /chain page runs its own technical system: these are its tokens from
  // src/app/chain/chain.css (scoped to .chain-scope), used nowhere else on
  // arch.network. Orange 2 ("Peach") is the light end of its button gradient
  // and its code keywords; Code Gold colours type names in its code sample.
  lineup: [
    {
      tag: "chain",
      rows: [
        [
          ["Background", "#FBFAF7"],
          ["Body", "#46443F"],
          ["Muted", "#6C6A62"],
          ["Faint", "#9A978C"],
          ["Orange 2", "#F4814A"],
          ["Orange Ink", "#C9520F"],
          ["Code Gold", "#E6C98A"],
        ],
      ],
    },
  ],
  lineupNoun: "chain colors",
  accents: [],

  // Tracking steps mirror the site's stylesheet (-.03 / -.022 / -.018 / -.014 /
  // -.012 / -.01em for headings; .06 / .1 / .14em for small caps labels).
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
  },
  typeDefaults: { display: "Gascogne Serial", text: "Geist Regular" },

  // The /chain page draws its isometric stack procedurally in SVG and animates
  // it with requestAnimationFrame — there's no file to download on the site.
  // These were rendered frame-by-frame from the live page under a fixed clock,
  // one full 5.9s cycle each, so every loop closes on itself. The walkthrough is
  // the scroll journey through the four layers. The two films are the home
  // page's own hero clips.
  motion: {
    dir: `${B}/motion`,
    zip: `${B}/downloads/arch-network-motion.zip`,
    clips: [
      { id: "stack-hero", name: "Chain Stack — Hero", dims: "1600×1600", aspect: "1 / 1", duration: "5.9s", loop: true, fit: "contain", stage: "#FBFAF7" },
      { id: "stack-chains", name: "Bitcoin & Arch Chains", dims: "1600×1600", aspect: "1 / 1", duration: "5.9s", loop: true, fit: "contain", stage: "#FBFAF7" },
      { id: "stack-native-tech", name: "Native Tech", dims: "1600×1600", aspect: "1 / 1", duration: "5.9s", loop: true, fit: "contain", stage: "#FBFAF7" },
      { id: "stack-primitives", name: "Financial Primitives", dims: "1600×1600", aspect: "1 / 1", duration: "5.9s", loop: true, fit: "contain", stage: "#FBFAF7" },
      { id: "stack-unlocks", name: "Finance Unlocks", dims: "1600×1600", aspect: "1 / 1", duration: "5.9s", loop: true, fit: "contain", stage: "#FBFAF7" },
      { id: "stack-walkthrough", name: "Layer Walkthrough", dims: "1600×1600", aspect: "1 / 1", duration: "15.9s", loop: false, fit: "contain", stage: "#FBFAF7" },
      { id: "hero-home", name: "Skyline Film", dims: "1920×1080", aspect: "16 / 9", duration: "7.6s", loop: true, stage: "#181818" },
      { id: "anchored", name: "Anchored Film", dims: "1920×1080", aspect: "16 / 9", duration: "7.5s", loop: true, stage: "#181818" },
    ],
  },

  // Everything here is lifted straight off arch.network — the hero and section
  // video posters, the section photography, the /chain diagrams, the investor
  // row and the ecosystem directory. Real production files replace these as
  // they're ported in.
  assetCategories: [
    {
      id: "photography",
      label: "Photography",
      dir: `${B}/photo`,
      items: [
        ["Skyline", "hero-skyline.jpg", "1280×720"],
        ["Anchored", "anchored-sea.jpg", "1280×720"],
        ["Institutions", "risk.jpg", "1266×678"],
        ["Markets", "stats.jpg", "2646×794"],
        ["Home Footer", "footer-home.jpg", "2200×833"],
        ["Ecosystem Hero", "hero-ecosystem.jpg", "2880×1680"],
        ["Ecosystem Footer", "footer-eco.jpg", "2880×1090"],
      ],
    },
    {
      id: "diagrams",
      label: "Architecture",
      dir: `${B}/diagrams`,
      fit: "contain",
      stage: "#181818",
      items: [
        ["The Chain", "arch_chain.svg", "1340×444"],
        ["Threshold Keys", "arch_keys.svg", "1233×448"],
        ["Settlement", "arch_settlement.svg", "1184×356"],
        ["UTXOs", "arch_utxos.svg", "1152×429"],
      ],
    },
    {
      id: "primitives",
      label: "Primitives",
      dir: `${B}/diagrams`,
      fit: "contain",
      stage: "#F3EFD7",
      items: [
        ["Fast & Final", "fast-final.svg", "741×741"],
        ["Lending", "lending.svg", "741×420"],
        ["Liquidation", "liquidation.svg", "741×497"],
        ["UTXO Pool", "utxo-pool.svg", "741×697"],
        ["Finance District", "finance-district.png", "2048×880"],
      ],
    },
    {
      id: "social",
      label: "Social",
      dir: `${B}/photo`,
      items: [
        ["Open Graph — Home", "og-home.png", "1200×630"],
        ["Open Graph — Chain", "og-chain.png", "1200×630"],
      ],
    },
    {
      id: "partners",
      label: "Backed By",
      dir: `${B}/partners`,
      fit: "contain",
      tile: "logo",
      items: [
        ["Pantera", "pantera.svg", "381×29"],
        ["Multicoin Capital", "multicoin.svg", "421×54"],
        ["Newman", "newman.svg", "246×114"],
        ["CMS", "cms.svg", "184×114"],
        ["OKX", "okx.svg", "182×114"],
        ["Tangent", "tangent.svg", "246×114"],
        ["UTXO", "utxo.svg", "122×114"],
        ["Portal", "portal.svg", "246×114"],
        ["Cypher", "cypher.svg", "246×114"],
        ["Big Brain", "bigbrain.svg", "246×114"],
        ["Ambush", "ambush.svg", "246×114"],
      ],
    },
    {
      id: "ecosystem",
      label: "Ecosystem",
      dir: `${B}/ecosystem`,
      fit: "contain",
      tile: "logo",
      items: [
        ["Chaos Labs", "chaos-labs.svg", "216×96"],
        ["HoneyB", "honey-b.svg", "726×201"],
        ["Gauntlet", "gauntlet.svg", "875×200"],
        ["Bump", "bump.svg", "505×142"],
        ["Wasabi", "wasabi.svg", "216×96"],
        ["Fordefi", "fordefi.svg", "175×28"],
        ["Anchorage", "anchorage.svg", "157×36"],
        ["Chintai", "chintai.svg", "216×96"],
        ["Kinesis", "kinesis.svg", "216×96"],
        ["Xverse", "xverse.svg", "600×112"],
        ["Asigna", "asigna.svg", "284×98"],
      ],
    },
  ],
  galleries: {},

  // Generated from this config on request — see app/brands/arch/design.md.
  agentDoc: {
    file: `${B}/design.md`,
    title: "Design system for coding agents",
    blurb:
      "The whole system as one Markdown file — colour tokens, the type scale and the logo system. Paste it into your coding agent and prompt “build X following this”.",
  },

  // Generator hand-off. Two audiences, two doors: teammates request access to
  // the shared account (a real mailto — no access backend to fake), prospects
  // read on. The section appends the brand + category the visitor already chose.
  generator: {
    video: `${B}/video/assetgen.mp4`,
    learnMore: "https://tools.blueprintstudio.ai/asset-generator",
    request:
      "mailto:blueprint.dao@gmail.com?subject=Asset%20Generator%20access%20%E2%80%94%20Arch%20Network" +
      "&body=Hi%20Blueprint%2C%0A%0AI%27d%20like%20access%20to%20the%20Arch%20Network%20asset%20generator%20account.%0A%0AName%3A%0ATeam%20(Arch%20%2F%20Arch%20Prime)%3A%0AWork%20email%3A%0A",
  },
  downloads: {
    logos: `${B}/downloads/arch-network-logos.zip`,
    tokens: `${B}/downloads/arch-network-tokens.css`,
    assets: `${B}/downloads/arch-network-assets.zip`,
    kit: `${B}/downloads/arch-network-brand-kit.zip`,
  },
  downloadLabels: {
    logos: "Logo system",
    tokens: "Design tokens (CSS)",
    assets: "Brand assets",
    kit: "Full brand kit",
  },

  // Arch Prime is the product brand that descends from this identity, so the
  // page closes by pointing at it.
  related: {
    eyebrow: "Arch family",
    name: "Arch Prime",
    blurb:
      "The product brand built on this identity: the same mark and serif, with its own palette of section hues and a place system for the app.",
    href: "/brands/arch-prime",
    cta: "Open Arch Prime brand page",
  },
  sections: [
    { id: "logo", label: "Logo" },
    { id: "color", label: "Color" },
    { id: "type", label: "Type" },
    { id: "motion", label: "Motion" },
    { id: "assets", label: "Assets" },
    { id: "downloads", label: "Files" },
  ],
};
