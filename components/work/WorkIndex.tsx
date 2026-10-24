import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Section from "@/components/ui/Section";
import { Footer } from "@/components/Footer/index";
import { allWorkProjects } from "@/data/portfolioData";
import { mediaFor, projectsFor, workIndex, workPages } from "@/lib/work";
import CtaBand from "./CtaBand";
import Draft from "./Draft";
import FrameLines from "./FrameLines";
import Reveal from "./Reveal";
import WorkHeader, { TEXT_INSET, WIDE } from "./WorkHeader";

const PREVIEWS = 3;
const COLS: Record<number, string> = { 1: "grid-cols-1", 2: "grid-cols-2", 3: "grid-cols-3" };

// /work: one row per deliverable page, each with a peek at its first projects.
export default function WorkIndex() {
  return (
    <div>
      <Section className="relative z-20 bg-[#FAFAF9]">
        <FrameLines />
        <WorkHeader
          title="Work"
          eyebrow={`${allWorkProjects.length} projects`}
          intro={workIndex.intro}
          introIsDraft={workIndex.introIsDraft}
        />
        <div className={`${WIDE} flex flex-col gap-3 pb-16 sm:gap-5 sm:pb-24 lg:gap-6 lg:pb-32`}>
          {workPages.map((page, i) => {
            const projects = projectsFor(page.slug);
            const previews = projects.slice(0, PREVIEWS).map((p) => {
              const m = mediaFor(p, page.slug).desktop;
              return { id: p.id, src: (m.type === "video" ? m.poster : m.src) ?? "", alt: m.alt };
            });
            return (
              <Reveal key={page.slug} delay={i === 0 ? 0 : 0.04}>
                <Link
                  href={`/work/${page.slug}`}
                  className="group grid gap-6 rounded-[22px] bg-[#EDEDEC] p-2.5 transition-colors duration-300 hover:bg-[#E8E8E7] sm:p-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:items-center lg:gap-10 lg:rounded-[32px] lg:p-4"
                >
                  <div className={`${TEXT_INSET} pt-4 lg:py-6`}>
                    <div className="flex items-start gap-2">
                      <h2 className="text-[clamp(32px,5vw,56px)] font-medium leading-none tracking-[-0.045em] text-black">{page.label}</h2>
                      <span className="mt-1 font-mono text-xs tabular-nums text-neutral-500">{projects.length}</span>
                    </div>
                    <p className="mt-3 max-w-[44ch] text-[15px] leading-[1.45] text-neutral-600 lg:mt-4 lg:text-base">
                      <Draft when={page.introIsDraft}>{page.intro}</Draft>
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-black lg:mt-8">
                      See the work
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover:translate-x-1" />
                    </span>
                  </div>
                  <div className={`grid ${COLS[previews.length]} gap-1.5 sm:gap-2 lg:gap-3`}>
                    {previews.map((p, j) => (
                      <div
                        key={p.id}
                        className="relative aspect-[4/3] overflow-hidden rounded-[10px] bg-black/[0.04] lg:rounded-[14px]"
                      >
                        {p.src && (
                          <Image
                            src={p.src}
                            alt={p.alt}
                            fill
                            sizes="(min-width: 1024px) 340px, 46vw"
                            className="object-cover transition-transform [transition-duration:900ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] motion-reduce:transform-none"
                            style={{ transitionDelay: `${j * 40}ms` }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Section>
      <CtaBand />
      <Footer />
    </div>
  );
}
