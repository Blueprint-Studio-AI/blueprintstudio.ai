import type { ServiceConfig } from "./types";

// The facts are /launch-videos': "Your launch video in 7 days", its four
// steps, the Fast ($8,000) and Studio ($15,000) packages, the "100+ Videos
// Delivered / 2M+ Total Views / 10 Days Avg. Turnaround" stats and its FAQs
// (kept word for word where used); /launch's Launch Video list ("Script &
// Storyboard", "30–60 second video with motion graphics", "Screen
// Recordings", "Platform Optimized") and its script FAQ; /launch's package
// from $50K. /launch-videos stays the paid landing page; this page is the one
// that ranks (see app/launch-videos/page.tsx's canonical). Lines written here
// are marked draft.
export const launchVideos: ServiceConfig = {
  slug: "launch-videos",
  deliverable: "launch-videos",
  label: "Launch videos",
  headline: "Launch videos for startups, in seven days.",
  intro:
    "Script, storyboard and production, with a first cut in seven days. Launch films for TokenWorks, Perena, Piris Labs and Pyra, made to stop the scroll on X, LinkedIn and YouTube.",
  introIsDraft: true,
  stats: [
    { value: "100+", label: "Videos delivered" },
    { value: "2M+", label: "Total views" },
    { value: "10 days", label: "Average turnaround" },
  ],
  workTitle: "Recent launch videos",
  featured: ["tokenworks-agevisor-3", "perena-film", "piris-film", "pyra-film"],
  process: {
    heading: { lead: "Four steps,", faint: "first cut in", rest: "seven days" },
    // /launch-videos' steps, word for word.
    steps: [
      {
        title: "Focus",
        description: "We meet and distill your pitch to one clear message. What to emphasize, what to cut.",
      },
      {
        title: "Script",
        description:
          "We choose a proven format based on what works for your product. Lock in the script. Approve storyboard.",
      },
      {
        title: "Production",
        description:
          "Send us your product, Figma, or GitHub repo. We create recordings and animations using proven visual formats optimized for speed. We're based in SF; in-person shoots available.",
      },
      {
        title: "Delivery",
        description: "Receive a first cut of your video in 7 days. One round of edits included (+2-3 days).",
      },
    ],
  },
  included: {
    title: "What’s in a launch video",
    intro: "A short-form video built for traction.",
    // /launch's Launch Video list and /launch-videos' specs, word for word.
    items: [
      {
        title: "Script & Storyboard",
        description: "Full creative direction from concept to final.",
        image: "/launch-videos/script.png",
        caption: "A launch video script and storyboard",
      },
      {
        title: "Production",
        description: "30–60 second video with motion graphics.",
        image: "/media/kits/perena-film/hero.jpg",
        caption: "USD* launch film for Perena",
      },
      {
        title: "Screen Recordings",
        description: "Product walkthroughs and screen captures.",
        image: "/media/kits/pyra-film/hero.jpg",
        caption: "Credit launch film for Pyra",
      },
      {
        title: "Platform Optimized",
        description: "Optimized for social and embed.",
        image: "/media/kits/tokenworks-agevisor-3/hero.jpg",
        caption: "AgeVisor 3 launch film for TokenWorks",
      },
      {
        title: "Final Files",
        description: "≈1 minute, 16:9 horizontal, 1080p FHD. Project files available upon request.",
        image: "/media/kits/piris-film/hero.jpg",
        caption: "YC W26 launch film for Piris Labs",
      },
    ],
  },
  testimonial: "daniel-greene",
  pricing: {
    title: "Launch video pricing",
    intro: "Pick your pace: two ways to launch, or the whole launch from one team.",
    introIsDraft: true,
    options: [
      {
        name: "Fast",
        price: "$8,000",
        description: "For founders who need something good, now.",
        includes: ["First draft in 7 days", "Final delivery in 10 days", "1 round of revisions", "1 minute runtime"],
        action: { kind: "call" },
        featured: true,
        offerPrice: 8000,
      },
      {
        name: "Studio",
        price: "$15,000",
        description: "For founders who want flexibility, exploration, and have time to collaborate.",
        includes: [
          "In-depth concept exploration",
          "Flexible runtime",
          "Option for live filming in SF",
          "Multiple rounds of revisions",
          "2–4 weeks",
        ],
        action: { kind: "call" },
        offerPrice: 15000,
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
  },
  faqTitle: "Launch video FAQs",
  faqs: [
    {
      question: "How much does a launch video cost?",
      answer:
        "$8,000 for Fast, with a first draft in 7 days and final delivery in 10. $15,000 for Studio, with in-depth concept exploration over 2–4 weeks.",
      draft: true,
    },
    // /launch-videos' and /launch's, word for word (the subscription link now goes to its pricing).
    {
      question: "Why is the Fast package so fast?",
      answer: [
        "From experience, we know what takes a long time and what doesn't. We design video concepts around what can be done efficiently while still looking great. For more flexibility, consider the Studio package or a ",
        { label: "design subscription", href: "/#pricing" },
        ".",
      ],
    },
    {
      question: "What about the launch video script?",
      answer: "We write it. You review and approve. We've written 100+ scripts for YC founders — we know what works.",
    },
    {
      question: "What are the exact specs of the video?",
      answer:
        "≈1 minute, 16:9 horizontal, 1080p FHD, visual hook optimized for scroll-stop on socials. Project files available upon request.",
    },
    {
      question: "What if I want more iterations after the first round?",
      answer:
        "Small tweaks that take us 20 minutes are no charge. Bigger changes like re-doing a section start at $500.",
    },
    {
      question: "Can you film in person?",
      answer: "Yes. We’re based in SF, and the Studio package includes the option of live filming there.",
      draft: true,
    },
    {
      question: "What do you need from me to get started?",
      answer:
        "Access to your product (live app, Figma, or GitHub repo), your logo and brand assets, 1 hour for a kickoff call, and quick responses when we reach out with questions.",
    },
    {
      question: "Do you offer other services?",
      answer: [
        "Yes. We also design and build ",
        { label: "websites", href: "/services/websites" },
        " and ",
        { label: "apps", href: "/services/apps" },
        ", and design ",
        { label: "brand identities", href: "/services/branding" },
        ".",
      ],
      draft: true,
    },
  ],
  related: ["websites", "apps", "branding"],
  cta: {
    heading: "Launching soon?",
    body: "Tell us what you’re shipping. The first call is with Tyler, our founder.",
    isDraft: true,
  },
  metaTitle: "Launch Video Production for Startups",
  metaDescription:
    "Launch video production for startups: script, storyboard and a first cut in 7 days. Launch films for TokenWorks, Perena, Piris Labs and Pyra. From $8,000.",
  ogImage: "/og-services-launch-videos.png",
  serviceType: "Launch video production",
};
