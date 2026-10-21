import { allWorkProjects, type Deliverable, type PortfolioProject } from "@/data/portfolioData";
import { hasWorkPage } from "@/lib/work";
import type { IndustryCombo, IndustryConfig } from "./types";
import { crypto } from "./crypto";

export type { IndustryCombo, IndustryConfig } from "./types";

const allIndustries: IndustryConfig[] = [crypto];

// An industry page needs a real body of work behind it, and a combo page
// (industry x deliverable) needs enough to stand on its own as a wall.
export const MIN_INDUSTRY_PROJECTS = 4;
export const MIN_COMBO_PROJECTS = 3;

/** The industry's projects in its wall order, optionally only one deliverable's. */
export function industryProjects(industry: IndustryConfig, deliverable?: Deliverable): PortfolioProject[] {
  const rank = (id: string) => {
    const i = industry.order.indexOf(id);
    return i === -1 ? industry.order.length : i;
  };
  return allWorkProjects
    .filter((p) => p.industries.includes(industry.slug) && (!deliverable || p.deliverables.includes(deliverable)))
    .map((p, i) => ({ p, i }))
    .sort((a, b) => rank(a.p.id) - rank(b.p.id) || a.i - b.i)
    .map(({ p }) => p);
}

export const industries: IndustryConfig[] = allIndustries.filter(
  (i) => industryProjects(i).length >= MIN_INDUSTRY_PROJECTS
);

export function getIndustry(slug: string): IndustryConfig | undefined {
  return industries.find((i) => i.slug === slug);
}

/** Every combo page that exists: configured, and with enough projects. */
export function industryCombos(): { industry: IndustryConfig; deliverable: Deliverable; combo: IndustryCombo }[] {
  return industries.flatMap((industry) =>
    (Object.entries(industry.combos) as [Deliverable, IndustryCombo][])
      .filter(([deliverable]) => industryProjects(industry, deliverable).length >= MIN_COMBO_PROJECTS)
      .map(([deliverable, combo]) => ({ industry, deliverable, combo }))
  );
}

export function getCombo(industrySlug: string, deliverable: string) {
  return industryCombos().find((c) => c.industry.slug === industrySlug && c.deliverable === deliverable);
}

/** Where "see the work" for one deliverable goes from an industry page: its combo page, else the deliverable's wall. */
export function deliverableHref(industry: IndustryConfig, deliverable: Deliverable): string | undefined {
  if (getCombo(industry.slug, deliverable)) return `/industries/${industry.slug}/${deliverable}`;
  return hasWorkPage(deliverable) ? `/work/${deliverable}` : undefined;
}
