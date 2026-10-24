import type { IndustryConfig } from "./types";

// Finance overlaps with crypto, and a client can be on both pages. Here:
// HoneyB (Bitcoin yield for institutions), Perena (USD*, a yield-bearing
// stablecoin), Arch Prime's brand (the bank for your portfolio; its app,
// films and deck stay confidential, so only the brand is tagged finance,
// not the rest of Arch's work) and Pyra (a credit app). Facts come from the
// client registry and the work's own copy. Truist stays hidden.
export const finance: IndustryConfig = {
  slug: "finance",
  label: "Finance",
  headline: "We design and build for finance founders.",
  intro:
    "Brands, websites, decks and launch films for teams building yield, credit and on-chain banking. For teams like HoneyB, Perena, Arch Prime and Pyra.",
  introIsDraft: true,
  logos: [
    { name: "HoneyB", src: "/logos-match-height/honeyb.png", width: 630 },
    { name: "Perena", src: "/logos-match-height/perena.png", width: 682 },
    { name: "Arch Prime", src: "/logos-match-height/arch-prime.png", width: 573 },
    { name: "Pyra", src: "/logos-match-height/pyra.png", width: 476 },
  ],
  offersTitle: "What we make for finance founders",
  offers: [
    { deliverable: "websites", line: "Landing pages and marketing sites, designed and built.", lead: "honeyb-website" },
    { deliverable: "branding", line: "Identities and design systems for financial products.", lead: "arch-prime-brand" },
    { deliverable: "launch-videos", line: "Launch and product films.", lead: "perena-film" },
    { deliverable: "decks", line: "Pitch decks, with the numbers kept private here.", lead: "honeyb-deck" },
  ],
  workTitle: "Finance work",
  order: ["honeyb-website", "honeyb-brand", "honeyb-deck", "perena-landing", "perena-film", "arch-prime-brand", "pyra-film"],
  brandPages: [
    { slug: "honeyb", line: "A Bitcoin yield platform. Brand, website and pitch deck." },
    { slug: "arch-prime", line: "Arch Network’s product brand, with its own palette and a place system for the app." },
  ],
  testimonial: "shina-foo",
  combos: {},
  cta: {
    heading: "Building in finance?",
    body: "Tell us what you’re launching. The first call is with Tyler, our founder.",
    isDraft: true,
  },
  metaTitle: "Design for Finance Founders",
  metaDescription:
    "Blueprint Studio designs and builds brands, websites, decks and launch films for finance teams, including HoneyB, Perena, Arch Prime and Pyra.",
  ogImage: "/og-industries-finance.png",
};
