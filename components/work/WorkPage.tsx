import Link from "next/link";
import Section from "@/components/ui/Section";
import { Footer } from "@/components/Footer/index";
import {
  deliverableLabels,
  industryLabels,
  type Deliverable,
  type PortfolioProject,
} from "@/data/portfolioData";
import { hasWorkPage, mediaFor, projectsFor, type WorkPageConfig } from "@/lib/work";
import type { PanelTag } from "./ProjectPanel";
import CtaBand from "./CtaBand";
import FrameLines from "./FrameLines";
import Wall from "./Wall";
import WorkHeader, { WIDE } from "./WorkHeader";

// Industry, then what we made (this page's deliverable first), then the year.
function tagsFor(project: PortfolioProject, current: Deliverable): PanelTag[] {
  const deliverables = [current, ...project.deliverables.filter((d) => d !== current)];
  return [
    ...project.industries.map((i) => ({ label: industryLabels[i] })),
    ...deliverables.map((d) => ({
      label: deliverableLabels[d],
      href: d !== current && hasWorkPage(d) ? `/work/${d}` : undefined,
    })),
    ...(project.metadata?.year ? [{ label: project.metadata.year.replace("-", "–") }] : []),
  ];
}

// The template behind every /work/<deliverable> page.
export default function WorkPage({ page }: { page: WorkPageConfig }) {
  const projects = projectsFor(page.slug);
  const panels = projects.map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    media: mediaFor(p, page.slug),
    tags: tagsFor(p, page.slug),
    liveUrl: p.liveUrl,
    brandPage: p.brandPage,
  }));

  return (
    <div>
      <Section className="relative z-20 bg-[#FAFAF9]">
        <FrameLines />
        <WorkHeader
          title={page.label}
          eyebrow={
            <>
              <Link href="/work" className="transition-colors hover:text-black">
                Work
              </Link>
              <span className="mx-2 text-neutral-300">/</span>
              {projects.length} projects
            </>
          }
          intro={page.intro}
          introIsDraft={page.introIsDraft}
          current={page.slug}
        />
        <div className={`${WIDE} pb-16 sm:pb-24 lg:pb-32`}>
          <Wall projects={panels} />
        </div>
      </Section>
      <CtaBand />
      <Footer />
    </div>
  );
}
