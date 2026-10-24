import type { Deliverable } from "@/data/portfolioData";
import type { TestimonialId } from "@/data/testimonials";

// Everything one /services/<slug> page needs. The page follows /brand's
// sales structure (hero, recent work, process, what's included, a client's
// words, pricing, FAQ, call to action), with /brand's own components where
// they generalize. A new service is a file like websites.ts, listed in ./index.ts.

/** Text with optional inline links: a plain string, or runs of text and links. */
export type RichText = string | (string | { label: string; href: string })[];

export interface IncludedItem {
  title: string;
  description: string;
  /** Preview shown while the item is active (3:2 frame). */
  image: string;
  /** Names the client the preview is from. */
  caption: string;
  /** "contain" for previews that mustn't be cropped (e.g. a square phone shot). */
  fit?: "cover" | "contain";
}

export interface PricingOption {
  name: string;
  /** Only prices already published on the site. Leave out to show "Scoped on a call". */
  price?: string;
  /** Small line before the price, e.g. "From" or "Add-on". */
  pricePrefix?: string;
  /** Small line after the price, e.g. what it's added to. */
  priceNote?: string;
  description: string;
  includes: string[];
  /** "call" is the Book a call with Tyler button. */
  action: { kind: "call" } | { kind: "link"; href: string; label: string };
  /** The option this page leads with. */
  featured?: boolean;
}

export interface ServiceConfig {
  slug: string;
  /** Which /work wall the proof comes from. */
  deliverable: Deliverable;
  label: string;
  /** H1, a sentence. */
  headline: string;
  intro: string;
  /** True until Tyler has written the copy; outside production it renders with a "Draft" tag. */
  introIsDraft?: boolean;
  workTitle: string;
  /** Work slugs (data/portfolioData.ts) for the recent work, in order. The rest of the deliverable's page is a link away. */
  featured: string[];
  process: {
    /** Renders as "{lead} <faint>{faint}</faint> {rest}", the way /brand sets "Four steps, starting at three weeks". */
    heading: { lead: string; faint: string; rest: string };
    steps: { title: string; description: string }[];
  };
  included: { title: string; intro: string; items: IncludedItem[] };
  testimonial?: TestimonialId;
  pricing: { title: string; intro: string; options: PricingOption[]; note?: RichText };
  faqs: { question: string; answer: RichText }[];
  cta: { heading: string; body: string; isDraft?: boolean };
  metaTitle: string;
  metaDescription: string;
  ogImage?: string;
  /** schema.org Service serviceType. */
  serviceType: string;
}
