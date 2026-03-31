export const brandPortfolio = [
  {
    id: "uni",
    name: "UNI",
    tagline: "Bitcoin Stablecoin",
    headline: "Bitcoin-Denominated Stablecoin",
    description:
      "Complete brand identity for a Bitcoin stablecoin. Logo system, brand narrative, type & palette, and visual\u00a0language.",
    logo: "/launch-assets/brand-picker-icons/uni.png",
    logoMark: "/logos-match-height/uni.png",
    gallery: ["/launch-assets/brand-identity_assets/brand-identity_UNI.png"],
    deliverables: [{ num: "01", label: "Brand" }],
    backgroundImage:
      "/brand-assets/brands-weve-built/uni_brands-we-built.png",
  },
  {
    id: "autara",
    name: "Autara",
    tagline: "Brand Identity & Web",
    headline: "Brand Identity & Framer Site",
    description:
      "Logo system, type & palette, social kit, brand deck, and Framer landing\u00a0page.",
    logo: "/launch-assets/brand-picker-icons/autara.png",
    logoMark: "/logos-match-height/autara.png",
    gallery: [
      "/launch-assets/brand-identity_assets/brand-identity_autara.png",
    ],
    deliverables: [
      { num: "01", label: "Brand" },
      { num: "02", label: "Website" },
    ],
    backgroundImage:
      "/brand-assets/brands-weve-built/autara_brands-we-built.png",
  },
  {
    id: "huch",
    name: "Huch",
    tagline: "Rebrand & Platform",
    headline: "Rebrand, Redesign & Platform Build",
    description:
      "Full rebrand, product redesign, and end-to-end platform build with social media\u00a0kit.",
    logo: "/launch-assets/brand-picker-icons/huch.png",
    logoMark: "/logos-match-height/huch.png",
    gallery: ["/launch-assets/brand-identity_assets/brand-identity_huch.png"],
    deliverables: [
      { num: "01", label: "Brand" },
      { num: "02", label: "Platform" },
    ],
    backgroundImage:
      "/brand-assets/brands-weve-built/huch_brands-we-built.png",
  },
  {
    id: "honeyb",
    name: "HoneyB",
    tagline: "Bitcoin Yield Platform",
    headline: "Bitcoin Yield Platform",
    description:
      "Full brand identity built from a blank slate. Logo system, color palette, guidelines, social kit, and website\u2014all delivered as one cohesive\u00a0system.",
    logo: "/launch-assets/brand-picker-icons/honeyb.png",
    logoMark: "/logos-match-height/honeyb.png",
    gallery: [],
    deliverables: [
      { num: "01", label: "Brand" },
      { num: "02", label: "Website" },
      { num: "03", label: "Deck" },
    ],
    backgroundImage:
      "/launch-assets/honeyb-spotlight/spotlight-background.png",
  },
];

export type BrandPortfolioItem = (typeof brandPortfolio)[number];
