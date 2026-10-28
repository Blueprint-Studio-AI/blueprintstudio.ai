import type { ServiceConfig } from "./types";

// The facts are /brand's: "Your brand in 3 weeks", its four steps, its base
// package list, Brand Identity from $18,000 with the $15,000 website and
// $5,000 pitch deck add-ons, the "25+ Brands Built / 3 Week Avg Delivery /
// 100% In-House Team" stats and its FAQs (kept word for word where used);
// the home page's "3-4 weeks"; /launch's package from $50K. /brand stays the
// paid landing page; this page is the one that ranks (see app/brand/page.tsx's
// canonical). The previews come from our kits rather than /brand's, so the two
// pages don't read as copies. Lines written here are marked draft.
export const branding: ServiceConfig = {
  slug: "branding",
  deliverable: "branding",
  label: "Branding",
  headline: "Brand identity for startups, in three weeks.",
  intro:
    "Logo system, brand guidelines, social kit and AI prompts trained on your brand. For teams like Jinba, HoneyB, Arch Network and Bump.fun.",
  introIsDraft: true,
  stats: [
    { value: "25+", label: "Brands built" },
    { value: "3 weeks", label: "Average delivery" },
    { value: "100%", label: "In-house team" },
  ],
  workTitle: "Recent brand identities",
  featured: ["jinba-brand", "honeyb-brand", "arch-brand", "bump-brand"],
  process: {
    heading: { lead: "Four steps,", faint: "starting at", rest: "three weeks" },
    // /brand's steps, word for word.
    steps: [
      {
        title: "Discover",
        description:
          "We learn your market, your audience, and what makes you different. One call, one brief, no fluff.",
      },
      {
        title: "Strategy",
        description:
          "Positioning, messaging, and a creative direction that translates your advantage into something people feel.",
      },
      {
        title: "Identity",
        description:
          "Logo system, color palette, typography, patterns. The visual building blocks of your brand, designed as a cohesive system.",
      },
      {
        title: "Delivery",
        description:
          "Brand book, social kit, application templates, and AI prompts—everything you need to stay on-brand as you scale.",
      },
    ],
  },
  included: {
    title: "What’s in a brand identity",
    intro: "The base package covers everything you need for a complete brand identity.",
    // /brand's list, word for word; the previews are from the brand kits.
    items: [
      {
        title: "Logo System",
        description: "Primary, secondary, icon and responsive version.",
        image: "/media/kits/arch-brand/s2.jpg",
        caption: "Logo for Arch Network",
      },
      {
        title: "Brand Guideline Document",
        description: "A complete rulebook for how your brand looks and sounds.",
        image: "/media/kits/jinba-brand/s2.jpg",
        caption: "Brand guidelines for Jinba",
      },
      {
        title: "Color Palette",
        description: "Primary, secondary and accent colors with usage rules.",
        image: "/media/whats-included/color-system.webp",
        caption: "Color system for HoneyB",
      },
      {
        title: "Typography System",
        description: "Typefaces, weights and a clear, scalable type hierarchy.",
        image: "/media/whats-included/type-system.webp",
        caption: "Type system for HoneyB",
      },
      {
        title: "Patterns & Motifs",
        description: "Signature graphic elements that make you instantly recognizable.",
        image: "/media/kits/autara-brand/s1.jpg",
        caption: "Triangle pattern for Autara",
      },
      {
        title: "Social Kit",
        description: "Templates and ready-to-post assets for every platform.",
        image: "/media/kits/jinba-brand/s1.jpg",
        caption: "A LinkedIn post for Jinba",
      },
      {
        title: "Sample Applications",
        description: "Your identity shown in real-world mockups and touchpoints.",
        image: "/media/kits/arch-btc-summit/hero.jpg",
        caption: "BTC All-In Summit for Arch Network",
      },
    ],
  },
  // On /brand's ticker. Jinba's work was a rebrand, site and film; Tyler to confirm it fits here.
  testimonial: "sina-meraji",
  pricing: {
    title: "Brand identity pricing",
    intro: "Brand Identity has a set price. Add a website or a pitch deck, or take the full launch package.",
    introIsDraft: true,
    options: [
      {
        name: "Brand Identity",
        pricePrefix: "From",
        price: "$18,000",
        // /brand's description line, word for word.
        description: "Logo, guidelines, and a custom AI trained on your brand. Built for founders moving fast.",
        // /brand's pricing card.
        includes: ["Logo system", "Design system", "Social kit + email signature", "AI prompts"],
        action: { kind: "call" },
        featured: true,
        offerPrice: 18000,
      },
      {
        name: "Brand + Website",
        pricePrefix: "Add-on",
        price: "$15,000",
        priceNote: "on Brand Identity, from $18,000",
        description: "Your brand identity, with the website designed and built alongside it.",
        includes: ["Custom design", "Development", "Responsive layouts", "Email capture & SEO"],
        action: { kind: "link", href: "/services/websites", label: "See Websites" },
      },
      {
        name: "Full Launch Package",
        pricePrefix: "From",
        price: "$50,000",
        description: "Brand, website, pitch deck and launch video, from one team.",
        includes: ["Brand identity", "Website", "Pitch deck", "Launch video"],
        action: { kind: "link", href: "/launch", label: "See the Launch Package" },
      },
    ],
    note: "Add a pitch deck to Brand Identity for $5,000: narrative strategy, slide design, speaker notes and source files.",
    noteIsDraft: true,
  },
  faqTitle: "Brand identity FAQs",
  faqs: [
    {
      question: "How long does a brand identity take?",
      answer: "Three to four weeks. Three weeks is our average delivery.",
      draft: true,
    },
    {
      question: "How much does brand identity design cost?",
      answer: [
        "Brand Identity starts at $18,000. Add a website for $15,000 or a pitch deck for $5,000, or take the ",
        { label: "Launch Package", href: "/launch" },
        ", from $50,000.",
      ],
      draft: true,
    },
    // /brand's, word for word.
    {
      question: "What if I already have a logo?",
      answer:
        "We can work with what you have. If it's solid, we'll build the system around it. If it needs refinement, we'll propose updates. Either way, you'll get the full identity system.",
    },
    {
      question: "How many revisions are included?",
      answer:
        "Two rounds of revisions at each phase. We've never needed more, but if scope expands significantly, we'll discuss.",
    },
    {
      question: "What are the AI prompts?",
      answer:
        "Pre-configured prompts for ChatGPT, Claude, and Midjourney that are trained on your brand voice and guidelines. Use them to draft copy, generate visuals, or stay consistent as you scale. They're yours to keep and share with your team.",
    },
    {
      question: "What do you need from me to get started?",
      answer:
        "A 1-hour kickoff call, access to any existing brand assets, examples of brands you admire, and quick responses when we have questions.",
    },
    {
      question: "What if I need a website too?",
      answer: [
        "Add a ",
        { label: "website", href: "/services/websites" },
        " to Brand Identity for $15,000, designed and built alongside your brand, or take the ",
        { label: "Launch Package", href: "/launch" },
        ": brand, website, pitch deck and launch video, starting at $50K.",
      ],
      draft: true,
    },
    {
      question: "Do you offer ongoing support?",
      answer: [
        "Yes. Many clients move to our ",
        { label: "monthly partnership", href: "/#pricing" },
        " after launch for ongoing design, development, and iteration.",
      ],
    },
  ],
  related: ["websites", "apps", "launch-videos"],
  cta: {
    heading: "Need a brand for your launch?",
    body: "Tell us what you’re building. The first call is with Tyler, our founder.",
    isDraft: true,
  },
  metaTitle: "Brand Identity Design for Startups",
  metaDescription:
    "Brand identity design for startups, in three weeks: logo system, brand guidelines, social kit and AI prompts. For Jinba, HoneyB and Arch Network. From $18K.",
  ogImage: "/og-services-branding.png",
  serviceType: "Brand identity design",
};
