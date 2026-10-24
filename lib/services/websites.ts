import type { ServiceConfig } from "./types";

// Copy is drawn from what the site already says about websites: /launch's
// Website package ("Custom design ... with custom animations", "Built in
// Framer, Next.js, or Astro", "CMS & SEO"), its tech-stack and existing-site
// FAQs, and /brand's $15,000 Website add-on ("Design, development,
// responsive, email capture and SEO"). There's no standalone website price on
// the site, so that option is "Scoped on a call" rather than a new number.
export const websites: ServiceConfig = {
  slug: "websites",
  deliverable: "websites",
  label: "Websites",
  headline: "We design and build websites for founders.",
  intro:
    "Landing pages and marketing sites for teams like Perena, HoneyB, Arch Network and Jinba. Custom design, built in Framer, Next.js or Astro, with SEO and analytics in place.",
  introIsDraft: true,
  workTitle: "Recent websites",
  featured: ["perena-landing", "honeyb-website", "arch-chain", "jinba-website"],
  process: {
    heading: { lead: "Four steps,", faint: "from first call", rest: "to launch" },
    steps: [
      {
        title: "Kickoff",
        description:
          "One call to align on your business, your audience and your goals. We meet your team and agree how we’ll work together.",
      },
      {
        title: "Design",
        description: "A custom design with custom animations, laid out for desktop and mobile.",
      },
      {
        title: "Build",
        description:
          "Framer for marketing sites, or Next.js or Astro for custom builds. Design and development run in parallel.",
      },
      {
        title: "Launch",
        description: "QA, deployment and handoff, with SEO foundations, analytics and email capture in place.",
      },
    ],
  },
  included: {
    title: "What’s included",
    intro: "Every website covers design, development, responsive layouts, email capture and SEO.",
    items: [
      {
        title: "Custom Design",
        description: "Designed from scratch for your product, with custom animations.",
        image: "/launch-assets/web-design_assets/desktop-perena.png",
        caption: "Landing page for Perena",
      },
      {
        title: "Responsive Layouts",
        description: "Fully responsive across all devices, from phone to desktop.",
        image: "/media/projects/perena/perena-brand-asset-3.png",
        caption: "Mobile layouts for Perena",
        fit: "contain",
      },
      {
        title: "Development",
        description: "Built in Framer, Next.js or Astro, whichever fits the site.",
        image: "/media/kits/arch-chain/hero.jpg",
        caption: "Chain page for Arch Network",
      },
      {
        title: "CMS & SEO",
        description: "Content management, SEO foundations and analytics.",
        image: "/media/kits/jinba-website/hero.jpg",
        caption: "Website for Jinba",
      },
      {
        title: "Email Capture",
        description: "Collect sign-ups and leads from launch day.",
        // The current site (captured 2026-10-23), not the earlier orange-Bitcoin version.
        image: "/media/kits/honeyb-website/hero.jpg",
        caption: "Website for HoneyB",
      },
    ],
  },
  testimonial: "shina-foo",
  pricing: {
    title: "Pricing",
    intro: "A website on its own is scoped on a call. With a brand, or as part of a full launch, it has a set price.",
    options: [
      {
        name: "Website",
        description: "A new site on its own, or a refresh of the one you have.",
        includes: ["Custom design", "Development", "Responsive layouts", "Email capture & SEO"],
        action: { kind: "call" },
        featured: true,
      },
      {
        name: "Brand + Website",
        pricePrefix: "Add-on",
        price: "$15,000",
        priceNote: "on Brand Identity, from $18,000",
        description: "Your brand identity, with the website designed and built alongside it.",
        includes: ["Logo system", "Design system", "Social kit & AI prompts", "Website"],
        action: { kind: "link", href: "/brand", label: "See Brand Identity" },
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
    note: [
      "After launch, the ",
      { label: "Design & Build Subscription", href: "/#pricing" },
      " keeps design and development going for $15k+ per month.",
    ],
  },
  faqs: [
    {
      question: "What do you build websites in?",
      answer:
        "Framer for marketing sites, or Next.js or Astro for custom builds. All are modern, fast and optimized for performance. We’ll recommend the best fit for what you need.",
    },
    {
      question: "How much does a website cost?",
      answer: [
        "It depends on scope, so we price a website on its own after a call. With ",
        { label: "Brand Identity", href: "/brand" },
        ", a website is a $15,000 add-on.",
      ],
    },
    {
      question: "Can you redesign the site we already have?",
      answer:
        "Yes. We can work with your existing brand and assets. If your site just needs a refresh, we’ll scope it accordingly.",
    },
    {
      question: "What if I need a brand too?",
      answer: [
        "Add a website to ",
        { label: "Brand Identity", href: "/brand" },
        ", or take the ",
        { label: "Launch Package", href: "/launch" },
        ": brand, website, pitch deck and launch video, starting at $50K.",
      ],
    },
    {
      question: "What do you need from me to get started?",
      answer:
        "A 1-hour kickoff call, any brand assets and content you already have, and quick answers when we need decisions.",
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
  cta: {
    heading: "Have a site to build?",
    body: "Tell us what you’re launching. The first call is with Tyler, our founder.",
    isDraft: true,
  },
  metaTitle: "Website Design & Development",
  metaDescription:
    "Websites designed and built by Blueprint Studio for founders like Perena, HoneyB, Arch Network and Jinba. Custom design in Framer, Next.js or Astro, with SEO and analytics.",
  ogImage: "/og-services-websites.png",
  serviceType: "Website design and development",
};
