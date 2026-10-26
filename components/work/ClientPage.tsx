import Link from "next/link";
import Section from "@/components/ui/Section";
import { Footer } from "@/components/Footer/index";
import { workTypeLabels, type Client } from "@/data/portfolioData";
import { testimonials } from "@/data/testimonials";
import { casePhone, deckShowcase, madeFor, shownWorkOf, workShowcase } from "@/lib/work";
import CtaBand from "./CtaBand";
import DeckShowcase from "./DeckShowcase";
import FrameLines from "./FrameLines";
import Quote from "./Quote";
import Reveal from "./Reveal";
import SectionTitle from "./SectionTitle";
import CaseStack from "./CaseStack";
import WorkHeader, { EYEBROW, PAGE_END, SECTION, STACK, TEXT_INSET, WIDE } from "./WorkHeader";

// /work/clients/<slug>, for a client with three or more pieces of work to show:
// the relationship told plainly, the work by year, each piece in the Featured
// Work format, the client's words, and a call.
export default function ClientPage({ client }: { client: Client }) {
  // The cases run in the data's order of strength, as the client's card does
  // (Arch leads with the summit); the timeline lists them by year, newest first.
  const works = shownWorkOf(client);
  const years = [...new Set(works.map((w) => w.year))].sort((a, b) => Number(b) - Number(a));
  const testimonial = client.testimonial ? testimonials[client.testimonial] : undefined;

  const facts = [
    { label: "Years", value: client.years },
    { label: "Engagement", value: client.engagement },
    { label: "What we made", value: madeFor(client) },
  ];

  return (
    <div>
      <Section className="relative z-20 bg-[#FAFAF9]">
        <FrameLines />
        <WorkHeader
          section="Work"
          tag={client.name.toLowerCase()}
          title={client.name}
          eyebrow={
            <>
              <Link href="/work" className="transition-colors hover:text-black">
                Work
              </Link>
              <span className="mx-2 text-neutral-300">/</span>
              {client.engagement}
            </>
          }
          intro={client.summary ?? ""}
          links={false}
        />

        <div className={`${WIDE}`}>
          <div className={TEXT_INSET}>
            <dl className="grid gap-6 border-t border-black/10 pt-6 sm:grid-cols-3 lg:pt-8">
              {facts.map((f) => (
                <div key={f.label}>
                  <dt className={EYEBROW}>{f.label}</dt>
                  <dd className="mt-2 text-[17px] leading-[1.4] text-neutral-900 lg:text-lg">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <section aria-labelledby="timeline-title" className={`${WIDE} ${SECTION}`}>
          <SectionTitle id="timeline-title" eyebrow="By year" title="The work" />
          <div className={TEXT_INSET}>
          <ol className="border-t border-black/10">
            {years.map((year) => (
              <li key={year} className="grid grid-cols-[72px_minmax(0,1fr)] gap-4 border-b border-black/10 py-4 sm:grid-cols-[120px_minmax(0,1fr)] lg:py-5">
                <span className="font-mono text-[13px] tabular-nums text-neutral-500 lg:text-sm">{year}</span>
                <ul className="flex flex-col gap-1.5">
                  {works
                    .filter((w) => w.year === year)
                    .map((w) => (
                      <li key={w.slug} className="flex flex-wrap items-baseline gap-x-3">
                        <a href={`#${w.slug}`} className="text-[17px] font-medium tracking-[-0.015em] text-neutral-900 underline-offset-4 hover:underline lg:text-lg">
                          {w.title}
                        </a>
                        {/* "Website · Website" says nothing: the type shows only when the title doesn't already. */}
                        {!w.title.toLowerCase().includes(workTypeLabels[w.type].one.toLowerCase()) && (
                          <span className="text-[15px] text-neutral-500">{workTypeLabels[w.type].one}</span>
                        )}
                      </li>
                    ))}
                </ul>
              </li>
            ))}
          </ol>
          </div>
        </section>

        <section aria-label={`${client.name} work`} className={`${WIDE} ${SECTION}`}>
          <div className={`${TEXT_INSET} ${STACK}`}>
            {works.map((work, i) => (
              <Reveal key={work.slug}>
                {work.type === "decks" ? (
                  <DeckShowcase data={{ ...deckShowcase(work), title: work.title, items: [{ key: work.slug, label: `${workTypeLabels[work.type].one} · ${work.year}` }] }} />
                ) : (
                  <CaseStack
                    data={{ ...workShowcase(work, { clientLink: false }), title: work.title, items: [] }}
                    tag={[workTypeLabels[work.type].one, work.year].filter(Boolean).join(" · ")}
                    story={work.story}
                    phone={casePhone(work)}
                    eager={i === 0}
                  />
                )}
              </Reveal>
            ))}
          </div>
        </section>

        <div className={`w-full ${SECTION} ${PAGE_END}`}>{testimonial && <Quote testimonial={testimonial} />}</div>
      </Section>
      <CtaBand
        heading={client.engagement === "Partnership" ? "Want a design team for the long run?" : undefined}
        body="Book a call and tell us what you’re building. The first call is with Tyler, our founder."
        isDraft
      />
      <Footer />
    </div>
  );
}
