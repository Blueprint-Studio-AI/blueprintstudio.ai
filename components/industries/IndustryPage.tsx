import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Section from "@/components/ui/Section";
import { Footer } from "@/components/Footer/index";
import { CallToActions } from "@/components/ui/CallToAction";
import { testimonials } from "@/data/testimonials";
import { industryProjects, type IndustryConfig } from "@/lib/industries";
import { panelFor } from "@/lib/work";
import CtaBand from "@/components/work/CtaBand";
import FrameLines from "@/components/work/FrameLines";
import Quote from "@/components/work/Quote";
import SectionTitle from "@/components/work/SectionTitle";
import Wall from "@/components/work/Wall";
import WorkHeader, { WIDE } from "@/components/work/WorkHeader";
import BrandCallouts from "./BrandCallouts";
import LogoRow from "./LogoRow";
import OfferGrid from "./OfferGrid";

const GAP = "pt-24 sm:pt-32 lg:pt-44";

// The template behind every /industries/<slug> page: who it's for and the
// clients, what we make for them, the work itself one project at a time, the
// brand case studies, a client's words, and a call.
export default function IndustryPage({ industry }: { industry: IndustryConfig }) {
  const projects = industryProjects(industry);
  const panels = projects.map((p) => panelFor(p, undefined, industry.slug));
  const testimonial = industry.testimonial ? testimonials[industry.testimonial] : undefined;
  const label = industry.label.toLowerCase();

  return (
    <div>
      <Section className="relative z-20 bg-[#FAFAF9]">
        <FrameLines />
        <WorkHeader
          section="Industries"
          tag={label}
          statement
          title={industry.headline}
          eyebrow={
            <>
              Industries<span className="mx-2 text-neutral-300">/</span>
              {industry.label}
            </>
          }
          intro={industry.intro}
          introIsDraft={industry.introIsDraft}
          actions={<CallToActions secondary={{ href: "#work", label: "See the work" }} />}
        />
        <div className={WIDE}>
          <LogoRow label={`${industry.label} teams we’ve worked with`} logos={industry.logos} />
        </div>

        <section aria-labelledby="offers-title" className={`${WIDE} ${GAP}`}>
          <SectionTitle id="offers-title" eyebrow="What we make" title={industry.offersTitle} />
          <OfferGrid industry={industry} />
        </section>

        <section id="work" aria-labelledby="work-title" className={`${WIDE} ${GAP} scroll-mt-8`}>
          <SectionTitle
            id="work-title"
            eyebrow={`${projects.length} projects`}
            title={industry.workTitle}
            aside={
              <Link href="/work" className="group inline-flex items-center gap-1.5 text-[15px] font-medium text-black">
                All work, every industry
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover:translate-x-1" />
              </Link>
            }
          />
          <Wall projects={panels} />
        </section>

        {industry.brandPages.length > 0 && (
          <section aria-labelledby="brands-title" className={`${WIDE} ${GAP}`}>
            <SectionTitle
              id="brands-title"
              eyebrow="Brand case studies"
              title={`${industry.label} brands, in full`}
              aside="Each identity with its logo system, color, type and the files to download."
            />
            <BrandCallouts brands={industry.brandPages} />
          </section>
        )}

        <div className={`w-full ${GAP} pb-20 sm:pb-24 lg:pb-32`}>{testimonial && <Quote testimonial={testimonial} />}</div>
      </Section>
      <CtaBand
        heading={industry.cta.heading}
        body={industry.cta.body}
        isDraft={industry.cta.isDraft}
        secondary={{ href: "/work", label: "See all work" }}
      />
      <Footer />
    </div>
  );
}
