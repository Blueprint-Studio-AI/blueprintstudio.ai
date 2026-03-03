export const brandPortfolio = [
  {
    id: "uni",
    name: "UNI",
    tagline: "ウニ",
    accentColor: "#E8392A",
    headline: "Japanese Street Food Brand",
    description: "Bold, playful identity for a fast-casual concept launching in LA.",
    logo: "/launch-assets/brand-picker-icons/uni.png",
    logoMark: "/logos-match-height/uni.png",
    gallery: ["/launch-assets/brand-identity_assets/brand-identity_UNI.png"],
  },
  {
    id: "autara",
    name: "Autara",
    tagline: "AI Infrastructure",
    accentColor: "#6366F1",
    headline: "Developer-First AI Platform",
    description: "Clean, technical identity for a Series A infrastructure startup.",
    logo: "/launch-assets/brand-picker-icons/autara.png",
    logoMark: "/logos-match-height/autara.png",
    gallery: ["/launch-assets/brand-identity_assets/brand-identity_autara.png"],
  },
  {
    id: "huch",
    name: "Huch",
    tagline: "Gaming Platform",
    accentColor: "#16A34A",
    headline: "Gaming Cases Marketplace",
    description: "Bold, dark identity built for a competitive gaming audience.",
    logo: "/launch-assets/brand-picker-icons/huch.png",
    logoMark: "/logos-match-height/huch.png",
    gallery: ["/launch-assets/brand-identity_assets/brand-identity_huch.png"],
  },
];

export type BrandPortfolioItem = (typeof brandPortfolio)[number];
