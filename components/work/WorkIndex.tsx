import Section from "@/components/ui/Section";
import { Footer } from "@/components/Footer/index";
import { clientShowcase, featuredClients, workIndex } from "@/lib/work";
import AllWorkList from "./AllWorkList";
import CtaBand from "./CtaBand";
import FrameLines from "./FrameLines";
import Reveal from "./Reveal";
import SectionTitle from "./SectionTitle";
import Showcase from "./Showcase";
import WorkHeader, { PAGE_END, SECTION, STACK, TEXT_INSET, WIDE } from "./WorkHeader";

// /work: the featured clients first, each as the home page shows them, then
// every client we've had as a plain list.
export default function WorkIndex() {
  const featured = featuredClients(null).flatMap((c) => clientShowcase(c) ?? []);

  return (
    <div>
      <Section className="relative z-20 bg-[#FAFAF9]">
        <FrameLines />
        <WorkHeader title="Work" eyebrow="Selected work" intro={workIndex.intro} introIsDraft={workIndex.introIsDraft} />

        <section aria-label="Featured clients" className={WIDE}>
          <div className={`${TEXT_INSET} ${STACK}`}>
            {featured.map((data, i) => (
              <Reveal key={data.id}>
                <Showcase data={data} eager={i === 0} titleAs="h2" />
              </Reveal>
            ))}
          </div>
        </section>

        <section id="all-work" aria-labelledby="all-work-title" className={`${WIDE} ${SECTION} ${PAGE_END} scroll-mt-8`}>
          <SectionTitle
            id="all-work-title"
            eyebrow="Every client"
            title="All work"
            aside="Everyone we’ve designed and built for since 2023. Names link where there’s more to see."
          />
          <div className={TEXT_INSET}>
            <AllWorkList />
          </div>
        </section>
      </Section>
      <CtaBand />
      <Footer />
    </div>
  );
}
