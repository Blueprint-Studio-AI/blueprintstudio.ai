import Section from "@/components/ui/Section";
import { Footer } from "@/components/Footer/index";
import { CallToActions, SecondaryButton } from "@/components/ui/CallToAction";
import ProcessSection from "@/components/Brand/ProcessSection";
import FAQSection from "@/components/Brand/FAQSection";
import { testimonials } from "@/data/testimonials";
import { getService, type ServiceConfig } from "@/lib/services";
import { getCombo, industries, industryProjects } from "@/lib/industries";
import { workBySlugs, workFor, workShowcase } from "@/lib/work";
import CtaBand from "@/components/work/CtaBand";
import Draft from "@/components/work/Draft";
import FrameLines from "@/components/work/FrameLines";
import Quote from "@/components/work/Quote";
import Reveal from "@/components/work/Reveal";
import SectionTitle from "@/components/work/SectionTitle";
import Showcase from "@/components/work/Showcase";
import WorkHeader, { PAGE_END, STACK, TEXT_INSET, WIDE } from "@/components/work/WorkHeader";
import IncludedSection from "./IncludedSection";
import PricingOptions from "./PricingOptions";
import Related, { type RelatedService } from "./Related";
import Rich from "./Rich";
import Stats from "./Stats";

// The template behind every /services/<slug> page, on /brand's structure:
// hero, recent work, process, what's included, a client's words, pricing,
// FAQ and a call. Process, the included list and the FAQ are /brand's own
// components with this service's content. Optional parts (the stats under the
// hero's buttons, the related services) render only for a service that sets them.
export default function ServicePage({ service }: { service: ServiceConfig }) {
  const featured = workBySlugs(service.featured);
  const all = workFor(service.deliverable);
  const testimonial = service.testimonial ? testimonials[service.testimonial] : undefined;
  const tag = service.label.toLowerCase();
  const { lead, faint, rest } = service.process.heading;
  const related = relatedServices(service);
  const byIndustry = industryLinks(service);

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
          actions={
            <>
              <CallToActions secondary={{ href: "#pricing", label: "See pricing" }} />
              {service.stats && <Stats stats={service.stats} />}
            </>
          }
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
        steps={service.process.steps.map((step) => ({
          title: step.title,
          description: <Draft when={!!step.draft}>{step.description}</Draft>,
        }))}
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
        intro={<Draft when={!!service.included.introIsDraft}>{service.included.intro}</Draft>}
        items={service.included.items.map((item) => ({
          ...item,
          description: <Draft when={!!item.draft}>{item.description}</Draft>,
        }))}
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
        introIsDraft={service.pricing.introIsDraft}
        options={service.pricing.options}
        note={service.pricing.note}
        noteIsDraft={service.pricing.noteIsDraft}
      />

      <FAQSection
        title={service.faqTitle}
        faqs={service.faqs.map((f) => ({
          question: f.question,
          answer: (
            <Draft when={!!f.draft}>
              <Rich text={f.answer} />
            </Draft>
          ),
        }))}
      />

      {related.length > 0 && (
        <Related services={related} industries={byIndustry} industriesLabel={`${service.label} by industry`} />
      )}

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

/** The service's `related` pages, each with a frame from its lead work. */
function relatedServices(service: ServiceConfig): RelatedService[] {
  return (service.related ?? []).flatMap((slug) => {
    const other = getService(slug);
    const lead = other && workBySlugs(other.featured)[0];
    if (!other || !lead) return [];
    return [
      {
        href: `/services/${other.slug}`,
        label: other.label,
        line: other.headline,
        image: lead.kit.hero.poster,
        alt: lead.kit.hero.alt,
      },
    ];
  });
}

/** The industries with this kind of work: their combo page for it where one exists, else the industry page. */
function industryLinks(service: ServiceConfig) {
  return industries
    .filter((industry) => industryProjects(industry, service.deliverable).length > 0)
    .map((industry) => {
      const combo = getCombo(industry.slug, service.deliverable);
      return combo
        ? { href: `/industries/${industry.slug}/${service.deliverable}`, label: combo.combo.title }
        : { href: `/industries/${industry.slug}`, label: industry.label };
    });
}
