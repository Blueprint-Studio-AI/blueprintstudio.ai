import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Section from "@/components/ui/Section";
import FrameLines from "@/components/work/FrameLines";
import { EYEBROW, TEXT_INSET, WIDE } from "@/components/work/WorkHeader";

export interface RelatedService {
  href: string;
  label: string;
  /** The service's H1. */
  line: string;
  /** A 16:9 poster from its lead work. */
  image: string;
  alt: string;
}

// Near the foot of a service page: the other services, each with a frame from
// its lead work, and this kind of work by industry. The page's links into the
// rest of the site, so a visitor (and a crawler) can move sideways.
export default function Related({
  services,
  industries,
  industriesLabel,
}: {
  services: RelatedService[];
  industries: { href: string; label: string }[];
  industriesLabel: string;
}) {
  return (
    <Section className="relative z-20 bg-[#FAFAF9]">
      <FrameLines />
      <div className="w-full line-dash-x" />
      <nav aria-label="More services" className={`${WIDE} py-20 sm:py-24 lg:py-28`}>
        <div className={TEXT_INSET}>
          <h2 className={EYEBROW}>More services</h2>
          {/* Phones get a compact row per service (frame left, name right); from sm up, three cards across. */}
          <ul className="mt-5 grid gap-4 sm:grid-cols-3 sm:gap-5 lg:mt-6">
            {services.map((s) => (
              <li key={s.href}>
                <Link
                  href={s.href}
                  className="group flex items-center gap-4 rounded-[14px] outline-none transition-transform duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2563EB] active:scale-[0.97] sm:block lg:rounded-[18px]"
                >
                  <span className="relative block aspect-video w-[44%] shrink-0 overflow-hidden rounded-[10px] bg-[#EDEDEC] sm:w-full sm:rounded-[14px] lg:rounded-[18px]">
                    <Image
                      src={s.image}
                      alt={s.alt}
                      fill
                      sizes="(min-width: 1024px) 310px, (min-width: 640px) 31vw, 42vw"
                      className="object-cover transition-transform [transition-duration:700ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] motion-reduce:transform-none"
                    />
                  </span>
                  <span className="block min-w-0">
                    <span className="flex items-center text-[19px] font-medium leading-tight tracking-[-0.03em] text-black sm:mt-4 sm:text-[20px] lg:text-[22px]">
                      {s.label}
                      <ArrowRight
                        aria-hidden
                        className="ml-1.5 h-[0.75em] w-[0.75em] text-neutral-400 transition-[color,transform] duration-300 ease-out group-hover:translate-x-1 group-hover:text-black"
                      />
                    </span>
                    <span className="mt-1 block text-pretty text-[14px] leading-[1.4] text-neutral-500 sm:text-[15px] sm:leading-[1.45]">
                      {s.line}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {industries.length > 0 && (
            <div className="mt-14 flex flex-col gap-3 border-t border-neutral-200 pt-6 sm:flex-row sm:items-center sm:gap-5 lg:mt-16">
              <h2 className={`shrink-0 ${EYEBROW}`}>{industriesLabel}</h2>
              <ul className="-mx-3 flex flex-wrap items-center gap-1">
                {industries.map((i) => (
                  <li key={i.href}>
                    <Link
                      href={i.href}
                      className="inline-flex h-9 items-center rounded-full px-3.5 text-[15px] font-medium tracking-[-0.01em] text-neutral-600 transition-[color,background-color,transform] duration-200 hover:bg-black/[0.05] hover:text-neutral-900 active:scale-[0.97]"
                    >
                      {i.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </nav>
    </Section>
  );
}
