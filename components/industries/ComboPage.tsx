import Link from "next/link";
import Section from "@/components/ui/Section";
import { Footer } from "@/components/Footer/index";
import { CallToActions } from "@/components/ui/CallToAction";
import { deliverableLabels, type Deliverable } from "@/data/portfolioData";
import { testimonials } from "@/data/testimonials";
import { industryProjects, type IndustryCombo, type IndustryConfig } from "@/lib/industries";
import { services } from "@/lib/services";
import { panelFor } from "@/lib/work";
import CtaBand from "@/components/work/CtaBand";
import FrameLines from "@/components/work/FrameLines";
import Quote from "@/components/work/Quote";
import Wall from "@/components/work/Wall";
import WorkHeader, { WIDE } from "@/components/work/WorkHeader";

// /industries/<slug>/<deliverable>: the industry's hero, narrowed to one kind
// of work, over that filtered wall. The industry's quote shows only when it's
// from one of the clients on this wall.
export default function ComboPage({
  industry,
  deliverable,
  combo,
}: {
  industry: IndustryConfig;
  deliverable: Deliverable;
  combo: IndustryCombo;
}) {
  const projects = industryProjects(industry, deliverable);
  const panels = projects.map((p) => panelFor(p, deliverable, industry.slug));
  const service = services.find((s) => s.deliverable === deliverable);
  const quote = industry.testimonial ? testimonials[industry.testimonial] : undefined;
  const testimonial = quote && projects.some((p) => p.metadata?.client === quote.company) ? quote : undefined;
  const label = deliverableLabels[deliverable];

  return (
    <div>
      <Section className="relative z-20 bg-[#FAFAF9]">
        <FrameLines />
        <WorkHeader
          section="Industries"
          tag={`${industry.label} ${label}`.toLowerCase()}
          title={combo.title}
          eyebrow={
            <>
              <Link href={`/industries/${industry.slug}`} className="transition-colors hover:text-black">
                {industry.label}
              </Link>
              <span className="mx-2 text-neutral-300">/</span>
              {label}
              <span className="mx-2 text-neutral-300">/</span>
              {projects.length} projects
            </>
          }
          intro={combo.intro}
          introIsDraft={combo.introIsDraft}
          actions={
            <CallToActions
              secondary={
                service
                  ? { href: `/services/${service.slug}`, label: `How we build ${label.toLowerCase()}` }
                  : { href: `/industries/${industry.slug}`, label: `All ${industry.label.toLowerCase()} work` }
              }
            />
          }
        />
        <div className={`${WIDE} pb-16 sm:pb-24 lg:pb-32`}>
          <Wall projects={panels} />
        </div>
        {testimonial && (
          <div className="w-full pb-24 pt-8 sm:pb-32 lg:pb-44 lg:pt-12">
            <Quote testimonial={testimonial} />
          </div>
        )}
      </Section>
      <CtaBand
        heading={industry.cta.heading}
        body={industry.cta.body}
        isDraft={industry.cta.isDraft}
        secondary={{ href: `/industries/${industry.slug}`, label: `All ${industry.label.toLowerCase()} work` }}
      />
      <Footer />
    </div>
  );
}
