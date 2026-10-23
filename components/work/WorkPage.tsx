import Link from "next/link";
import Section from "@/components/ui/Section";
import { Footer } from "@/components/Footer/index";
import { collectionShowcase, workFor, workShowcase, type WorkPageConfig } from "@/lib/work";
import CtaBand from "./CtaBand";
import FrameLines from "./FrameLines";
import ProjectFull from "./ProjectFull";
import Reveal from "./Reveal";
import Showcase from "./Showcase";
import WorkHeader, { PAGE_END, STACK, TEXT_INSET, WIDE } from "./WorkHeader";

export type WorkLayout = "a" | "b";

// The template behind every /work/<deliverable> page, in two layouts to
// compare (?layout=a|b outside production):
// A: each piece of work as the home page's Featured Work shows a client, its
//    big frame with its three stills beside it.
// B: the page opens in that format, the first piece playing with the next
//    three's stills beside it; below, each piece as large as the screen allows.
export default function WorkPage({ page, layout = "a" }: { page: WorkPageConfig; layout?: WorkLayout }) {
  const works = workFor(page.slug);
  const hero = layout === "b" ? collectionShowcase(works, "") : null;

  return (
    <div>
      <Section className="relative z-20 bg-[#FAFAF9]">
        <FrameLines />
        <WorkHeader
          title={page.label}
          eyebrow={
            <Link href="/work" className="transition-colors hover:text-black">
              Work
            </Link>
          }
          intro={page.intro}
          introIsDraft={page.introIsDraft}
          current={page.slug}
        />
        <div className={`${WIDE} ${PAGE_END}`}>
          <div className={`${TEXT_INSET} ${STACK}`}>
            {hero && (
              <Reveal>
                <Showcase data={hero} eager titleAs="h2" />
              </Reveal>
            )}
            {works.map((work, i) =>
              layout === "b" ? (
                <Reveal key={work.slug}>
                  <ProjectFull data={workShowcase(work)} />
                </Reveal>
              ) : (
                <Reveal key={work.slug}>
                  <Showcase data={workShowcase(work)} eager={i === 0} titleAs="h2" />
                </Reveal>
              )
            )}
          </div>
        </div>
      </Section>
      <CtaBand />
      <Footer />
    </div>
  );
}
