import Section from "@/components/ui/Section";
import { Footer } from "@/components/Footer/index";
import { CallToActions, SecondaryButton } from "@/components/ui/CallToAction";
import ProcessSection from "@/components/Brand/ProcessSection";
import FAQSection from "@/components/Brand/FAQSection";
import { testimonials } from "@/data/testimonials";
import type { ServiceConfig } from "@/lib/services";
import { workBySlugs, workFor, workShowcase } from "@/lib/work";
import CtaBand from "@/components/work/CtaBand";
import FrameLines from "@/components/work/FrameLines";
import Quote from "@/components/work/Quote";
import Reveal from "@/components/work/Reveal";
import SectionTitle from "@/components/work/SectionTitle";
import Showcase from "@/components/work/Showcase";
import WorkHeader, { PAGE_END, STACK, TEXT_INSET, WIDE } from "@/components/work/WorkHeader";
import IncludedSection from "./IncludedSection";
import PricingOptions from "./PricingOptions";
import Rich from "./Rich";

// The template behind every /services/<slug> page, on /brand's structure:
// hero, recent work, process, what's included, a client's words, pricing,
// FAQ and a call. Process, the included list and the FAQ are /brand's own
// components with this service's content.
export default function ServicePage({ service }: { service: ServiceConfig }) {
  const featured = workBySlugs(service.featured);
  const all = workFor(service.deliverable);
  const testimonial = service.testimonial ? testimonials[service.testimonial] : undefined;
  const tag = service.label.toLowerCase();
  const { lead, faint, rest } = service.process.heading;

  return (
    <div>
      <Section className="relative z-20 bg-[#FAFAF9]">
        <FrameLines />
        <WorkHeader
          section="Services"
          tag={tag}
          title={service.headline}
          eyebrow={
            <>
              Services<span className="mx-2 text-neutral-300">/</span>
              {service.label}
            </>
          }
          intro={service.intro}
          introIsDraft={service.introIsDraft}
          actions={<CallToActions secondary={{ href: "#pricing", label: "See pricing" }} />}
          links={false}
        />
        <section aria-labelledby="recent-title" className={`${WIDE} ${PAGE_END}`}>
          <SectionTitle id="recent-title" eyebrow="Recent work" title={service.workTitle} />
          <div className={`${TEXT_INSET} ${STACK}`}>
            {featured.map((work, i) => (
              <Reveal key={work.slug}>
                <Showcase data={workShowcase(work)} eager={i === 0} />
              </Reveal>
            ))}
          </div>
          {all.length > featured.length && (
            <div className="flex justify-center pt-16 lg:pt-24">
              <SecondaryButton href={`/work/${service.deliverable}`}>All {tag}</SecondaryButton>
            </div>
          )}
        </section>
      </Section>

      <ProcessSection
        leftLabel="PROCESS"
        rightLabel={`// ${tag}`}
        closing={false}
        steps={service.process.steps}
        heading={
          <>
            {lead}
            <br />
            <span className="text-neutral-400">{faint} </span>
            {rest}
          </>
        }
      />

      <IncludedSection
        title={service.included.title}
        intro={service.included.intro}
        items={service.included.items}
        tag={tag}
      />

      {testimonial && (
        <Section className="relative z-20 bg-[#FAFAF9]">
          <FrameLines />
          <div className="w-full line-dash-x" />
          <div className="w-full py-20 sm:py-28 lg:py-36">
            <Quote testimonial={testimonial} />
          </div>
        </Section>
      )}

      <PricingOptions
        title={service.pricing.title}
        intro={service.pricing.intro}
        options={service.pricing.options}
        note={service.pricing.note}
      />

      <FAQSection faqs={service.faqs.map((f) => ({ question: f.question, answer: <Rich text={f.answer} /> }))} />

      <CtaBand
        heading={service.cta.heading}
        body={service.cta.body}
        isDraft={service.cta.isDraft}
        secondary={{ href: `/work/${service.deliverable}`, label: "See the work" }}
      />
      <Footer />
    </div>
  );
}
