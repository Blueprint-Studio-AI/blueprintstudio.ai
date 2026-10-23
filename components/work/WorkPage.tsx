import Link from "next/link";
import Section from "@/components/ui/Section";
import { Footer } from "@/components/Footer/index";
import { panelFor, projectsFor, type WorkPageConfig } from "@/lib/work";
import CtaBand from "./CtaBand";
import FrameLines from "./FrameLines";
import Wall from "./Wall";
import WorkHeader, { WIDE } from "./WorkHeader";

// The template behind every /work/<deliverable> page.
export default function WorkPage({ page }: { page: WorkPageConfig }) {
  const projects = projectsFor(page.slug);
  const panels = projects.map((p) => panelFor(p, page.slug));

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
