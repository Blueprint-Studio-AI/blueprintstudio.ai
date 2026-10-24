import Link from "next/link";
import { workTypeLabels } from "@/data/portfolioData";
import Section from "@/components/ui/Section";
import { Footer } from "@/components/Footer/index";
import { casePhone, collectionShowcase, deckShowcase, workFor, workShowcase, type WorkPageConfig } from "@/lib/work";
import CtaBand from "./CtaBand";
import DeckShowcase from "./DeckShowcase";
import FrameLines from "./FrameLines";
import CaseStack from "./CaseStack";
import Reveal from "./Reveal";
import Showcase from "./Showcase";
import WorkHeader, { PAGE_END, STACK, TEXT_INSET, WIDE } from "./WorkHeader";

export type WorkLayout = "a" | "b";

// The template behind every /work/<deliverable> page, in two layouts to
// compare (?layout=a|b outside production):
// A: each piece of work as the home page's Featured Work shows a client, its
//    big frame with its three stills beside it.
// B: the page opens in that format, the first piece playing with the next
//    three's stills beside it; below, each piece as a case: its name, then big
//    images one after another, then its story where we have one (after the
//    original Blueprint site's case pages).
export default function WorkPage({ page, layout = "a" }: { page: WorkPageConfig; layout?: WorkLayout }) {
  const works = workFor(page.slug);
  // Decks have their own layout (cover and slides) in both A and B.
  const hero = layout === "b" && page.slug !== "decks" ? collectionShowcase(works, "") : null;

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
              page.slug === "decks" ? (
                <Reveal key={work.slug}>
                  <DeckShowcase data={deckShowcase(work)} eager={i === 0} />
                </Reveal>
              ) : layout === "b" ? (
                <Reveal key={work.slug}>
                  <CaseStack
                    data={workShowcase(work)}
                    tag={workTypeLabels[work.type].one}
                    story={work.story}
                    phone={casePhone(work)}
                  />
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
