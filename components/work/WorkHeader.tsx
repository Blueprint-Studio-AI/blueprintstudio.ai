import type { ReactNode } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import type { Deliverable } from "@/data/portfolioData";
import DeliverableLinks from "./DeliverableLinks";
import Draft from "./Draft";

// One system for /work, /services and /industries: the same column, the same
// left edge, the same type scale and the same spacing on every page.

/** The wide column every work, service and industry page sits in. */
export const WIDE = "mx-auto w-full max-w-[1480px] px-1.5 sm:px-3 custom:px-4";
/** The inset inside it, so text and media share one left edge. */
export const TEXT_INSET = "px-[18px] sm:px-6 lg:px-8";
/** Space above a section. */
export const SECTION = "pt-24 sm:pt-32 lg:pt-40";
/** Space between showcases. */
export const STACK = "flex flex-col gap-20 sm:gap-24 lg:gap-28";
/** Space after a page's last section, before the call-to-action band. */
export const PAGE_END = "pb-24 sm:pb-32 lg:pb-40";
/** Mono eyebrow over headings. */
export const EYEBROW = "font-mono text-[11px] uppercase tracking-wide text-neutral-500";
/** The one H1 size: a word ("Websites") or a sentence. */
export const H1 = "max-w-[17ch] text-balance text-[clamp(40px,6vw,84px)] font-medium leading-[0.98] tracking-[-0.045em] text-black";

// The header for every work, service and industry page: the strip's labels,
// an eyebrow, the title, the intro beside it, optional buttons, and the row of
// links to each kind of work.
export default function WorkHeader({
  title,
  eyebrow,
  intro,
  introIsDraft,
  current,
  section = "Work",
  tag,
  actions,
  links = true,
}: {
  title: string;
  eyebrow: ReactNode;
  intro: string;
  introIsDraft?: boolean;
  current?: Deliverable;
  /** The header strip's left label. */
  section?: string;
  /** The header strip's right label, after the "//". */
  tag?: string;
  actions?: ReactNode;
  /** The row of links to each kind of work. */
  links?: boolean;
}) {
  return (
    <>
      {/* The site's nav carries the logo, so the strip keeps only its labels. */}
      <SectionHeader leftText={section} rightText={`// ${tag ?? (current ? title.toLowerCase() : "all work")}`} />
      <div className={WIDE}>
        <header className={`${TEXT_INSET} pb-12 pt-14 sm:pb-16 sm:pt-20 lg:pb-20 lg:pt-28`}>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:items-end lg:gap-16">
            <div>
              <p className={`mb-4 lg:mb-6 ${EYEBROW}`}>{eyebrow}</p>
              <h1 className={H1}>{title}</h1>
            </div>
            <div className="lg:pb-2">
              <p className="text-pretty text-[17px] leading-[1.45] text-neutral-600 lg:text-lg">
                <Draft when={introIsDraft}>{intro}</Draft>
              </p>
              {actions && <div className="mt-7 lg:mt-8">{actions}</div>}
            </div>
          </div>
          {links && (
            <div className="mt-10 lg:mt-14">
              <DeliverableLinks current={current} />
            </div>
          )}
        </header>
      </div>
    </>
  );
}
