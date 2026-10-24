import type { IndustryConfig } from "./types";

// Every Feature or Show client tagged `ai` in data/portfolioData.ts shows
// here: Jinba (an enterprise AI workflow builder, YC W26), Piris Labs
// (optical data movement for AI infrastructure, YC W26), Herth (home search
// by how a home looks) and LivingIP (on-chain AI agents, also on
// /industries/crypto). Logical (a desktop copilot, YC F25) is listed: its
// film lives on /launch-videos, with no file yet to make a kit from. Facts come
// from the client registry. Reshift isn't shown, and Answers From Me's live
// site isn't ours, so neither is named.
export const ai: IndustryConfig = {
  slug: "ai",
  label: "AI",
  headline: "We design and build for AI founders.",
  intro:
    "Brands, websites, product design and launch films for AI teams, from an enterprise workflow builder to home search. For teams like Jinba, Piris Labs, Herth and Logical.",
  introIsDraft: true,
  // Files from /public/logos-match-height (all 264px tall). Piris Labs has no logo file yet.
  logos: [
    { name: "Jinba", src: "/logos-match-height/jinba.png", width: 608 },
    { name: "Logical", src: "/logos-match-height/logical.png", width: 580 },
    { name: "LivingIP", src: "/logos-match-height/livingip.png", width: 603 },
    { name: "Herth", src: "/logos-match-height/herth.png", width: 481 },
    { name: "Twelve", src: "/logos-match-height/twelve.png", width: 568 },
  ],
  offersTitle: "What we make for AI founders",
  offers: [
    { deliverable: "websites", line: "Marketing sites, designed and built.", lead: "jinba-website" },
    { deliverable: "branding", line: "Identities, sub-brands and the design systems that carry them.", lead: "jinba-brand" },
    { deliverable: "apps", line: "Product design and UX for AI products.", lead: "livingip-app" },
    { deliverable: "launch-videos", line: "Launch films for their YC launches.", lead: "piris-film" },
  ],
  workTitle: "AI work",
  workAside: { label: "More launch films, for Jinba and Logical", href: "/launch-videos" },
  order: ["jinba-website", "jinba-brand", "piris-film", "livingip-app", "herth-app"],
  brandPages: [{ slug: "jinba", line: "An enterprise AI workflow builder. Brand, sub-brands and design system." }],
  testimonial: "sam-karu",
  combos: {},
  cta: {
    heading: "Building in AI?",
    body: "Tell us what you’re launching. The first call is with Tyler, our founder.",
    isDraft: true,
  },
  metaTitle: "Design for AI Founders",
  metaDescription:
    "Blueprint Studio designs and builds brands, websites, product design and launch films for AI teams, including Jinba, Piris Labs, Herth, Logical and LivingIP.",
  ogImage: "/og-industries-ai.png",
};
