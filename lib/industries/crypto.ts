import type { IndustryConfig } from "./types";

// Every project tagged `crypto` in data/portfolioData.ts shows here. Huch
// (gaming, no longer operating) and TokenWorks (no industry set) aren't tagged,
// so they stay off. Facts in the copy come from the projects' own entries and
// the /brands pages: Perena's USD*, UNI's Bitcoin-denominated stablecoin,
// Bump's memecoin platform, LivingIP's on-chain AI agents, Arch Network's
// Bitcoin-native infrastructure, HoneyB's Bitcoin yield, Autara's DeFi on Arch.
// UNI is tagged crypto from its portfolio entry, but data/brandPortfolio.ts
// calls it a street-food brand, so the copy doesn't lead with it until Tyler
// confirms which it is.
export const crypto: IndustryConfig = {
  slug: "crypto",
  label: "Crypto",
  headline: "We design and build for crypto founders.",
  intro:
    "Apps, websites, brands and launch videos for stablecoins, Bitcoin finance, DeFi, memecoins and on-chain AI. For teams like Perena, Arch Network, HoneyB and Bump.",
  introIsDraft: true,
  logos: [
    { name: "Arch Network", src: "/logos-match-height/arch-network.png", width: 518 },
    { name: "Perena", src: "/logos-match-height/perena.png", width: 682 },
    { name: "HoneyB", src: "/logos-match-height/honeyb.png", width: 630 },
    { name: "Autara", src: "/logos-match-height/autara.png", width: 525 },
    { name: "UNI", src: "/logos-match-height/uni.png", width: 356 },
    { name: "Bump", src: "/logos-match-height/bump-wordmark.png", width: 445 },
    { name: "LivingIP", src: "/logos-match-height/livingip.png", width: 603 },
  ],
  offersTitle: "What we make for crypto founders",
  offers: [
    { deliverable: "websites", line: "Landing pages and marketing sites, designed and built.", lead: "honeyb-website" },
    { deliverable: "branding", line: "Identities, logo systems and the kits that carry them.", lead: "arch-brand" },
    { deliverable: "apps", line: "Product design and UX for on-chain products.", lead: "livingip-app" },
    { deliverable: "launch-videos", line: "Motion and launch media for a product going live." },
  ],
  workTitle: "Crypto work",
  // A reel, then alternate stills and reels down the wall.
  order: ["perena-landing", "perena-film", "arch-site", "arch-btc-summit", "arch-chain", "arch-brand", "arch-prime-brand", "honeyb-website", "honeyb-brand", "livingip-app", "bump-brand", "bump-app", "uni-brand", "breeze-brand"],
  brandPages: [
    { slug: "arch", line: "Bitcoin-native financial market infrastructure." },
    { slug: "arch-prime", line: "Arch Network’s product brand, with its own palette and a place system for the app." },
    { slug: "honeyb", line: "A Bitcoin yield platform. Brand, website and pitch deck." },
  ],
  testimonial: "shina-foo",
  combos: {
    websites: {
      title: "Crypto websites",
      intro: "Landing pages and marketing sites for stablecoins, Bitcoin finance and DeFi, designed and built for launch.",
      introIsDraft: true,
      metaTitle: "Crypto Website Design",
      metaDescription:
        "Websites for crypto teams by Blueprint Studio: Perena’s USD* launch, HoneyB and Arch Network’s chain page. Landing pages and marketing sites, designed and built.",
      ogImage: "/og-industries-crypto-websites.png",
    },
  },
  cta: {
    heading: "Building in crypto?",
    body: "Tell us what you’re launching. The first call is with Tyler, our founder.",
    isDraft: true,
  },
  metaTitle: "Design for Crypto Founders",
  metaDescription:
    "Blueprint Studio designs and builds apps, websites, brands and launch videos for crypto teams, including Perena, Arch Network, HoneyB, Bump and LivingIP.",
  ogImage: "/og-industries-crypto.png",
};
