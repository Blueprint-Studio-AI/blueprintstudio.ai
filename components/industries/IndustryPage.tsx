import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Section from "@/components/ui/Section";
import { Footer } from "@/components/Footer/index";
import { CallToActions } from "@/components/ui/CallToAction";
import type { Client } from "@/data/portfolioData";
import { testimonials } from "@/data/testimonials";
import { industryProjects, type IndustryConfig } from "@/lib/industries";
import { clientShowcase } from "@/lib/work";
import CtaBand from "@/components/work/CtaBand";
import FrameLines from "@/components/work/FrameLines";
import Quote from "@/components/work/Quote";
import Reveal from "@/components/work/Reveal";
import SectionTitle from "@/components/work/SectionTitle";
import Showcase from "@/components/work/Showcase";
import WorkHeader, { PAGE_END, SECTION, STACK, TEXT_INSET, WIDE } from "@/components/work/WorkHeader";
import BrandCallouts from "./BrandCallouts";
import LogoRow from "./LogoRow";
import OfferGrid from "./OfferGrid";

// The template behind every /industries/<slug> page: who it's for and the
// clients, what we make for them, the work client by client (each as the home
// page's Featured Work shows it), the brand case studies, a client's words,
// and a call.
export default function IndustryPage({ industry }: { industry: IndustryConfig }) {
  const work = industryProjects(industry);
  const clients = work.reduce<Client[]>((list, w) => (list.includes(w.client) ? list : [...list, w.client]), []);
  const showcases = clients.flatMap((c) => clientShowcase(c) ?? []);
  const testimonial = industry.testimonial ? testimonials[industry.testimonial] : undefined;
  const label = industry.label.toLowerCase();

  return (
    <div>
      <Section className="relative z-20 bg-[#FAFAF9]">
        <FrameLines />
        <WorkHeader
          section="Industries"
          tag={label}
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
          links={false}
        />
        <div className={WIDE}>
          <LogoRow label={`${industry.label} teams we’ve worked with`} logos={industry.logos} />
        </div>

        <section aria-labelledby="offers-title" className={`${WIDE} ${SECTION}`}>
          <SectionTitle id="offers-title" eyebrow="What we make" title={industry.offersTitle} />
          <div className={TEXT_INSET}>
            <OfferGrid industry={industry} />
          </div>
        </section>

        <section id="work" aria-labelledby="work-title" className={`${WIDE} ${SECTION} scroll-mt-8`}>
          <SectionTitle
            id="work-title"
            eyebrow="Client by client"
            title={industry.workTitle}
            aside={
              <Link href={industry.workAside?.href ?? "/work"} className="group inline-flex items-center gap-1.5 text-[15px] font-medium text-black">
                {industry.workAside?.label ?? "All work, every industry"}
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover:translate-x-1" />
              </Link>
            }
          />
          <div className={`${TEXT_INSET} ${STACK}`}>
            {showcases.map((data) => (
              <Reveal key={data.id}>
                <Showcase data={data} />
              </Reveal>
            ))}
          </div>
        </section>

        {industry.brandPages.length > 0 && (
          <section aria-labelledby="brands-title" className={`${WIDE} ${SECTION}`}>
            <SectionTitle
              id="brands-title"
              eyebrow="Brand case studies"
              title={`${industry.label} brands, in full`}
              aside="Each identity with its logo system, color, type and the files to download."
            />
            <div className={TEXT_INSET}>
              <BrandCallouts brands={industry.brandPages} />
            </div>
          </section>
        )}

        <div className={`w-full ${SECTION} ${PAGE_END}`}>{testimonial && <Quote testimonial={testimonial} />}</div>
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
