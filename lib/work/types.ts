import type { Deliverable } from "@/data/portfolioData";

// Everything one /work/<deliverable> page needs beyond the projects
// themselves, which come from data/portfolioData.ts by their `deliverables`.
export interface WorkPageConfig {
  slug: Deliverable;
  /** The page's H1 and its name in the links row and on /work. */
  label: string;
  /** One line under the heading. */
  intro: string;
  /** True until Tyler has written `intro`; outside production it renders with a "Draft" tag. */
  introIsDraft?: boolean;
  /** <title> (the root layout appends "| Blueprint Studio") and meta description. */
  metaTitle: string;
  metaDescription: string;
  /**
   * Project ids in wall order. Projects with this deliverable that aren't
   * listed follow in data order, so a new project shows up without an edit here.
   */
  order: string[];
}
