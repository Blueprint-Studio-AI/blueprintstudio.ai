import Section from "@/components/ui/Section";
import { Footer } from "@/components/Footer/index";
import { CallToActions, SecondaryButton } from "@/components/ui/CallToAction";
import ProcessSection from "@/components/Brand/ProcessSection";
import FAQSection from "@/components/Brand/FAQSection";
import { testimonials } from "@/data/testimonials";
import type { ServiceConfig } from "@/lib/services";
import { panelFor, projectsById, projectsFor } from "@/lib/work";
import CtaBand from "@/components/work/CtaBand";
import FrameLines from "@/components/work/FrameLines";
import Quote from "@/components/work/Quote";
import Wall from "@/components/work/Wall";
import WorkHeader, { TEXT_INSET, WIDE } from "@/components/work/WorkHeader";
import IncludedSection from "./IncludedSection";
import PricingOptions from "./PricingOptions";
import Rich from "./Rich";

// The template behind every /services/<slug> page, on /brand's structure:
// hero, recent work, process, what's included, a client's words, pricing,
// FAQ and a call. Process, the included list and the FAQ are /brand's own
// components with this service's content.
export default function ServicePage({ service }: { service: ServiceConfig }) {
  const featured = projectsById(service.featured);
  const all = projectsFor(service.deliverable);
  const panels = featured.map((p) => panelFor(p, service.deliverable));
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
          statement
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
        />
        <div className={`${WIDE} pb-16 sm:pb-24 lg:pb-32`}>
          <p className={`${TEXT_INSET} pb-4 font-mono text-[11px] uppercase tracking-wide text-neutral-500 lg:pb-6`}>
            {service.workTitle}
          </p>
          <Wall projects={panels} />
          {all.length > featured.length && (
            <div className="flex justify-center pt-8 lg:pt-12">
              <SecondaryButton href={`/work/${service.deliverable}`}>
                All {all.length} {tag}
              </SecondaryButton>
            </div>
          )}
        </div>
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
