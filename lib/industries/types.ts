import type { Deliverable, Industry } from "@/data/portfolioData";
import type { TestimonialId } from "@/data/testimonials";

// Everything one /industries/<slug> page needs beyond the projects themselves,
// which come from data/portfolioData.ts by their `industries`. A new industry
// is a file like crypto.ts, listed in ./index.ts.

export interface IndustryOffer {
  deliverable: Deliverable;
  /** One line on what we make of this kind for the industry. Client names are added from the data. */
  line: string;
  /** Work slug whose picture leads the panel; the rest follow in the industry’s order. */
  lead?: string;
}

export interface IndustryCombo {
  /** H1 of /industries/<slug>/<deliverable>, e.g. "Crypto websites". */
  title: string;
  intro: string;
  introIsDraft?: boolean;
  metaTitle: string;
  metaDescription: string;
  /** 2400x1260 share image under /public. */
  ogImage?: string;
}

export interface IndustryConfig {
  slug: Industry;
  label: string;
  /** H1: a sentence, set smaller than the work pages' one-word titles. */
  headline: string;
  intro: string;
  /** True until Tyler has written the copy; outside production it renders with a "Draft" tag. */
  introIsDraft?: boolean;
  /** Client logos under the hero: files from /public/logos-match-height, all 264px tall; `width` is the file's. */
  logos: { name: string; src: string; width: number }[];
  offersTitle: string;
  offers: IndustryOffer[];
  workTitle: string;
  /** The link beside the work section's title; "All work, every industry" by default. */
  workAside?: { label: string; href: string };
  /** Work slugs in page order (clients show in the order their first piece appears). Unlisted work follows in data order. */
  order: string[];
  /** /brands/<slug> case studies to point at, with a line each. */
  brandPages: { slug: string; line: string }[];
  testimonial?: TestimonialId;
  /** The /industries/<slug>/<deliverable> pages that exist. */
  combos: Partial<Record<Deliverable, IndustryCombo>>;
  cta: { heading: string; body: string; isDraft?: boolean };
  metaTitle: string;
  metaDescription: string;
  ogImage?: string;
}
