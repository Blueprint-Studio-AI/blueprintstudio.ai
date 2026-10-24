import type { IndustryConfig } from "./types";

// Tyler's AI set: Jinba (an enterprise AI workflow builder, YC W26) and Piris
// Labs (optical data movement for AI infrastructure, YC W26) show their work
// here; Logical (a desktop copilot, YC F25) and Panta (AI for commercial
// insurance, YC W26) are named, their films on YouTube with no file yet to
// make a kit from. LivingIP stays on /industries/crypto. Facts come
// from the client registry. Reshift isn't shown, and Answers From Me's live
// site isn't ours, so neither is named.
export const ai: IndustryConfig = {
  slug: "ai",
  label: "AI",
  headline: "We design and build for AI founders.",
  intro:
    "Brands, websites and launch films for AI teams, from an enterprise workflow builder to a desktop copilot. For teams like Jinba, Logical, Piris Labs and Panta.",
  introIsDraft: true,
  // Files from /public/logos-match-height (all 264px tall). Piris Labs has no logo file yet.
  logos: [
    { name: "Jinba", src: "/logos-match-height/jinba.png", width: 608 },
    { name: "Logical", src: "/logos-match-height/logical.png", width: 580 },
    { name: "Panta", src: "/logos-match-height/panta.png", width: 459 },
  ],
  offersTitle: "What we make for AI founders",
  offers: [
    { deliverable: "websites", line: "Marketing sites, designed and built.", lead: "jinba-website" },
    { deliverable: "branding", line: "Identities, sub-brands and the design systems that carry them.", lead: "jinba-brand" },
    { deliverable: "launch-videos", line: "Launch films for their YC launches.", lead: "piris-film" },
  ],
  workTitle: "AI work",
  workAside: { label: "More launch films, for Jinba and Logical", href: "/launch-videos" },
  order: ["jinba-website", "jinba-brand", "piris-film"],
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
    "Blueprint Studio designs and builds brands, websites and launch films for AI teams, including Jinba, Logical, Piris Labs and Panta.",
  ogImage: "/og-industries-ai.png",
};
