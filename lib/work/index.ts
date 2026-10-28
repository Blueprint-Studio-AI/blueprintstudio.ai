import type { Metadata } from "next";
import {
  allWorkProjects,
  type Deliverable,
  type PortfolioProject,
  type ResponsiveMedia,
} from "@/data/portfolioData";
import type { WorkPageConfig } from "./types";
import { websites } from "./websites";
import { apps } from "./apps";
import { branding } from "./branding";
import { launchVideos } from "./launch-videos";

export type { WorkPageConfig } from "./types";

// Fewer projects than this and a deliverable gets no page (a wall of one isn't proof).
export const MIN_PROJECTS = 2;

const allPages: WorkPageConfig[] = [websites, apps, branding, launchVideos];

export function projectsFor(slug: Deliverable): PortfolioProject[] {
  const page = allPages.find((p) => p.slug === slug);
  const order = page?.order ?? [];
  const rank = (id: string) => {
    const i = order.indexOf(id);
    return i === -1 ? order.length : i;
  };
  return allWorkProjects
    .filter((p) => p.deliverables.includes(slug))
    .map((p, i) => ({ p, i }))
    .sort((a, b) => rank(a.p.id) - rank(b.p.id) || a.i - b.i)
    .map(({ p }) => p);
}

/** What a project leads with on one deliverable's wall. */
export function mediaFor(project: PortfolioProject, slug: Deliverable): ResponsiveMedia {
  return project.deliverableMedia?.[slug] ?? project.featuredMedia;
}

/** The deliverable pages that exist, in nav order. */
export const workPages: WorkPageConfig[] = allPages.filter(
  (p) => projectsFor(p.slug).length >= MIN_PROJECTS
);

export function getWorkPage(slug: string): WorkPageConfig | undefined {
  return workPages.find((p) => p.slug === slug);
}

export function hasWorkPage(slug: Deliverable): boolean {
  return workPages.some((p) => p.slug === slug);
}

// Copy for /work and for the call-to-action band at the foot of every work page.
// Placeholders: factual, but Tyler to write the real lines.
export const workIndex = {
  intro: "Websites, apps, brands and launch videos for founders. Pick a type to see the work one project at a time.",
  introIsDraft: true,
  metaTitle: "Work",
  metaDescription:
    "Selected work by Blueprint Studio: websites, apps, brand identities and launch videos for founders in crypto and AI.",
};

export const workCta = {
  heading: "Have something to launch?",
  body: "Book a call and tell us what you’re building.",
  isDraft: true,
};

export function workMetadata({ path, title, description }: { path: string; title: string; description: string }): Metadata {
  // The root layout's template appends "| Blueprint Studio" to `title`; OG and
  // Twitter titles don't go through the template, so they get it here.
  const full = `${title} | Blueprint Studio`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: `https://blueprintstudio.ai${path}`,
      title: full,
      description,
      images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Blueprint Studio" }],
    },
    twitter: { card: "summary_large_image", title: full, description, images: ["/og-image.jpg"] },
  };
}
