import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { deliverableLabels } from "@/data/portfolioData";
import { deliverableHref, industryProjects, type IndustryConfig } from "@/lib/industries";
import { mediaFor } from "@/lib/work";
import Reveal from "@/components/work/Reveal";
import OfferMedia from "./OfferMedia";

const THUMBS = 4;

// "What we make for <industry>": one light-grey panel per deliverable, with
// stills from the industry's own projects of that kind (stepping through on
// hover) and the clients' names, linking to the filtered wall (or the
// deliverable's wall).
export default function OfferGrid({ industry }: { industry: IndustryConfig }) {
  const offers = industry.offers
    .map((offer) => {
      // The offer's lead project first, then the rest in the industry's order.
      const projects = industryProjects(industry, offer.deliverable);
      const lead = projects.find((p) => p.id === offer.lead);
      return { offer, projects: lead ? [lead, ...projects.filter((p) => p !== lead)] : projects };
    })
    .filter(({ projects }) => projects.length > 0);

  return (
    <div className="grid gap-3 sm:gap-5 lg:grid-cols-2 lg:gap-6">
      {offers.map(({ offer, projects }, i) => {
        const href = deliverableHref(industry, offer.deliverable);
        const label = deliverableLabels[offer.deliverable];
        const thumbs = projects.slice(0, THUMBS).map((p) => {
          const m = mediaFor(p, offer.deliverable).desktop;
          return { src: (m.type === "video" ? m.poster : m.src) ?? "", alt: m.alt };
        }).filter((t) => t.src);
        const clients = projects.map((p) => p.metadata?.client ?? p.title.split(" — ")[0]);

        const body = (
          <>
            <OfferMedia images={thumbs} sizes="(min-width: 1024px) 680px, 94vw" />
            <div className="flex flex-1 flex-col px-2 pb-2 pt-5 sm:px-3 lg:px-4 lg:pb-4 lg:pt-7">
              <div className="flex items-start gap-2">
                <h3 className="text-[28px] font-medium leading-none tracking-[-0.04em] text-black lg:text-[36px]">{label}</h3>
                <span className="mt-0.5 font-mono text-xs tabular-nums text-neutral-500">{projects.length}</span>
              </div>
              <p className="mt-3 max-w-[44ch] text-[15px] leading-[1.45] text-neutral-600 lg:text-base">{offer.line}</p>
              <p className="mt-1.5 text-sm leading-[1.45] text-neutral-500">{clients.join(" · ")}</p>
              {href && (
                <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-medium text-black lg:pt-8">
                  See the work
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover:translate-x-1" />
                </span>
              )}
            </div>
          </>
        );

        const panel =
          "group flex h-full flex-col rounded-[22px] bg-[#EDEDEC] p-2.5 transition-colors duration-300 sm:p-3 lg:rounded-[28px] lg:p-3.5";
        return (
          <Reveal key={offer.deliverable} delay={(i % 2) * 0.06} className="h-full">
            {href ? (
              <Link href={href} className={`${panel} hover:bg-[#E8E8E7]`}>
                {body}
              </Link>
            ) : (
              <div className={panel}>{body}</div>
            )}
          </Reveal>
        );
      })}
    </div>
  );
}
