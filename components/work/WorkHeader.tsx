import Image from "next/image";
import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";
import type { Deliverable } from "@/data/portfolioData";
import DeliverableLinks from "./DeliverableLinks";
import Draft from "./Draft";

// Wide column shared by the header, the wall and /work's rows, so the
// heading's left edge lines up with the text inside the panels.
export const WIDE = "mx-auto w-full max-w-[1480px] px-1.5 sm:px-3 custom:px-4";
export const TEXT_INSET = "px-[18px] sm:px-6 lg:px-8";

export default function WorkHeader({
  title,
  eyebrow,
  intro,
  introIsDraft,
  current,
}: {
  title: string;
  eyebrow: React.ReactNode;
  intro: string;
  introIsDraft?: boolean;
  current?: Deliverable;
}) {
  return (
    <>
      <SectionHeader
        leftText="Work"
        centerContent={
          <Link href="/" className="transition-opacity hover:opacity-70">
            <Image src="/blueprint-logo-dark.svg" alt="Blueprint Studio" width={80} height={20} className="h-3 w-auto sm:h-4" />
          </Link>
        }
        rightText={`// ${current ? title.toLowerCase() : "all work"}`}
      />
      <div className={WIDE}>
        <header className={`${TEXT_INSET} pb-8 pt-14 sm:pt-20 lg:pb-12 lg:pt-28`}>
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:items-end lg:gap-16">
            <div>
              <p className="mb-4 font-mono text-[11px] uppercase tracking-wide text-neutral-500 lg:mb-6">{eyebrow}</p>
              <h1 className="text-[clamp(52px,10vw,120px)] font-medium leading-[0.9] tracking-[-0.055em] text-black">{title}</h1>
            </div>
            <p className="text-pretty text-[17px] leading-[1.45] text-neutral-600 lg:pb-2 lg:text-lg">
              <Draft when={introIsDraft}>{intro}</Draft>
            </p>
          </div>
          {/* /work lists the same pages as rows, so the links are only for the walls. */}
          {current && (
            <div className="mt-8 lg:mt-14">
              <DeliverableLinks current={current} />
            </div>
          )}
        </header>
      </div>
    </>
  );
}
