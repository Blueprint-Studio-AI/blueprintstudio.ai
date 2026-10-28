import type { Deliverable } from "@/data/portfolioData";
import type { TestimonialId } from "@/data/testimonials";

// Everything one /services/<slug> page needs. The page follows /brand's
// sales structure (hero, recent work, process, what's included, a client's
// words, pricing, FAQ, call to action), with /brand's own components where
// they generalize. A new service is a file like websites.ts, listed in ./index.ts.
//
// `draft: true` on a line marks copy Tyler hasn't written or approved yet:
// outside production it renders with a "Draft" tag (components/work/Draft).

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
  draft?: boolean;
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
  /**
   * The price in USD as a number, for the page's schema.org Offer. Only on
   * an option that is this service sold at a published price (not an add-on
   * or another package).
   */
  offerPrice?: number;
  draft?: boolean;
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
  /** Published numbers shown in a row under the hero, e.g. /brand's "25+ Brands Built". Only figures the site already states. */
  stats?: { value: string; label: string }[];
  workTitle: string;
  /** Work slugs (data/portfolioData.ts) for the recent work, in order. The rest of the deliverable's page is a link away. */
  featured: string[];
  process: {
    /** Renders as "{lead} <faint>{faint}</faint> {rest}", the way /brand sets "Four steps, starting at three weeks". */
    heading: { lead: string; faint: string; rest: string };
    steps: { title: string; description: string; draft?: boolean }[];
  };
  included: { title: string; intro: string; introIsDraft?: boolean; items: IncludedItem[] };
  testimonial?: TestimonialId;
  pricing: { title: string; intro: string; introIsDraft?: boolean; options: PricingOption[]; note?: RichText; noteIsDraft?: boolean };
  /** The FAQ's heading; /brand's "Frequently Asked Questions" when left out. */
  faqTitle?: string;
  faqs: { question: string; answer: RichText; draft?: boolean }[];
  /** Other service pages to point to near the foot of the page, by slug. */
  related?: string[];
  cta: { heading: string; body: string; isDraft?: boolean };
  metaTitle: string;
  metaDescription: string;
  ogImage?: string;
  /** schema.org Service serviceType. */
  serviceType: string;
}
