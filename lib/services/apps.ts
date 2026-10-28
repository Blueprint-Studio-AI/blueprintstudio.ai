import type { ServiceConfig } from "./types";

// The site has no app package, so this page is built from what the work and
// the site say: TokenWorks' IDVisor Go app and customer portal (designed and
// built), Herth's home search (designed and built on its existing frontend),
// and the product design for LivingIP and Bump.fun (data/portfolioData.ts);
// "UI/UX design, web and mobile development, AI engineering" from
// /launch-videos' FAQ; the subscription's "mobile apps" and its $15k+ a month
// from the home page. The process follows /launch's (kickoff, design, build in
// parallel, QA and handoff). An app on its own has no published price, so it's
// "Scoped on a call". Lines written here are marked draft.
export const apps: ServiceConfig = {
  slug: "apps",
  deliverable: "apps",
  label: "Apps",
  headline: "We design and build apps for startups.",
  intro:
    "Web and mobile apps, from first flows to a shipped product: TokenWorks’ ID-scanning app and customer portal, Herth’s home search, and product design for LivingIP and Bump.fun.",
  introIsDraft: true,
  workTitle: "Recent apps",
  // Built and shipped first, then the product design work.
  featured: ["tokenworks-app", "herth-app", "livingip-app", "bump-app"],
  process: {
    heading: { lead: "Four steps,", faint: "from first call", rest: "to launch" },
    steps: [
      {
        title: "Kickoff",
        description:
          "One call to align on your product, your users and your goals. We meet your team and agree how we’ll work together.",
        draft: true,
      },
      {
        title: "Design",
        description: "User flows, wireframes and interface design for web and mobile, iterated on your feedback.",
        draft: true,
      },
      {
        title: "Build",
        description:
          "Design and development run in parallel. We build, test and refine, on a new codebase or the one you already have.",
        draft: true,
      },
      {
        title: "Launch",
        description: "Final QA, deployment and handoff, then ongoing work if you want to keep shipping.",
        draft: true,
      },
    ],
  },
  included: {
    title: "What’s included",
    intro: "Product design and development for web and mobile, together or on their own.",
    introIsDraft: true,
    items: [
      {
        title: "Product & UX Design",
        description: "User flows, wireframes and interface design, for web and mobile.",
        image: "/media/kits/livingip-app/hero.jpg",
        caption: "On-chain AI agents app for LivingIP",
        draft: true,
      },
      {
        title: "Mobile Apps",
        description: "Phone apps like IDVisor Go, which scans IDs and checks them against DMV records.",
        image: "/media/kits/tokenworks-app/s1.jpg",
        caption: "IDVisor Go for TokenWorks",
        fit: "contain",
        draft: true,
      },
      {
        title: "Web Apps & Portals",
        description: "Dashboards, stores and billing, like the IDScanner customer portal.",
        image: "/media/kits/tokenworks-app/hero.jpg",
        caption: "Customer portal for TokenWorks",
        draft: true,
      },
      {
        title: "Platforms",
        description: "Products with live data and trading, like Bump.fun’s memecoin platform.",
        image: "/media/kits/bump-app/hero.jpg",
        caption: "Memecoin platform for Bump.fun",
        draft: true,
      },
      {
        title: "Development",
        description: "We build what we design, on a new codebase or your existing frontend, as we did for Herth.",
        image: "/media/kits/herth-app/hero.jpg",
        caption: "Home search for Herth",
        draft: true,
      },
    ],
  },
  // Perena's words are about end-to-end design and engineering with their own
  // team; Perena Purple is an app we designed and built. No app client has a quote of its own yet.
  testimonial: "shina-foo",
  pricing: {
    title: "App design and development pricing",
    intro: "An app is priced after a call, once we know the scope. Ongoing product work has a set monthly price.",
    introIsDraft: true,
    options: [
      {
        name: "App",
        description: "A new web or mobile app, or the next version of the one you have.",
        includes: ["Product & UX design", "Web or mobile", "Development", "QA & launch"],
        action: { kind: "call" },
        featured: true,
        draft: true,
      },
      {
        name: "Design & Build Subscription",
        price: "$15k+",
        priceNote: "per month",
        description: "Keep shipping. Design and development every month, for a product that keeps growing.",
        // The home page's list, word for word.
        includes: ["Dedicated expertise", "Unlimited requests", "Rapid delivery", "Pause or cancel anytime"],
        action: { kind: "link", href: "/#pricing", label: "See the subscription" },
        draft: true,
      },
    ],
    note: ["Launching the app? Add a ", { label: "launch video", href: "/services/launch-videos" }, ", from $8,000."],
    noteIsDraft: true,
  },
  faqTitle: "App design and development FAQs",
  faqs: [
    {
      question: "Do you design apps, build them, or both?",
      answer:
        "Both, together or on their own. We designed and built TokenWorks’ customer portal and its IDVisor Go app, and designed the products for LivingIP and Bump.fun.",
      draft: true,
    },
    {
      question: "Can you work on the app we already have?",
      answer: "Yes. For Herth, we designed and built the buyer side of its home search on its existing frontend.",
      draft: true,
    },
    {
      question: "Do you make web apps or mobile apps?",
      answer: "Both: web apps, dashboards and customer portals, and phone apps like IDVisor Go.",
      draft: true,
    },
    {
      question: "How much does an app cost?",
      answer: [
        "It depends on scope, so we price an app after a call. For ongoing work, the ",
        { label: "Design & Build Subscription", href: "/#pricing" },
        " is $15k+ per month.",
      ],
      draft: true,
    },
    {
      question: "Can you build AI into it?",
      answer: "Yes. AI engineering is part of what we do, and we designed LivingIP’s app for on-chain AI agents.",
      draft: true,
    },
    {
      question: "What do you need from me to get started?",
      answer:
        "A 1-hour kickoff call, access to your product (a live app, Figma or GitHub repo), and quick answers when we need decisions.",
      draft: true,
    },
    {
      question: "Do you offer ongoing support?",
      answer: [
        "Yes. Many clients move to our ",
        { label: "monthly partnership", href: "/#pricing" },
        " after launch for ongoing design, development and iteration.",
      ],
    },
  ],
  related: ["websites", "branding", "launch-videos"],
  cta: {
    heading: "Have an app to build?",
    body: "Tell us what you’re building. The first call is with Tyler, our founder.",
    isDraft: true,
  },
  metaTitle: "App Design & Development Studio for Startups",
  metaDescription:
    "App design and development for startups: product design, web and mobile apps and customer portals, for teams like TokenWorks, Herth, LivingIP and Bump.fun.",
  ogImage: "/og-services-apps.png",
  serviceType: "App design and development",
};
