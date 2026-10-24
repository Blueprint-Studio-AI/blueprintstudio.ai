import { ArrowUpRight } from "lucide-react";
import Section from "@/components/ui/Section";
import { workCta } from "@/lib/work";
import Draft from "./Draft";
import FrameLines from "./FrameLines";

// Closing band on every work page. "Book a call" goes to the home page's
// calendar, the same place as the floating nav's Book Call.
export default function CtaBand() {
  return (
    <Section className="relative z-20 overflow-hidden bg-[#FAFAF9]">
      <FrameLines />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex justify-center px-2.5 sm:px-[60px]"
      >
        <div
          className="w-full flex-1 opacity-[0.15]"
          style={{ backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)", backgroundSize: "20px 20px" }}
        />
      </div>
      <div className="w-full line-dash-x" />

      <div className="relative z-10 flex flex-col items-center px-6 py-24 text-center sm:py-28 lg:py-36">
        <h2 className="text-balance text-[clamp(32px,6vw,48px)] font-medium leading-[1.1] tracking-[-0.035em] text-black">
          <Draft when={workCta.isDraft}>{workCta.heading}</Draft>
        </h2>
        <p className="mt-4 text-balance text-[17px] text-neutral-600 lg:text-lg">
          <Draft when={workCta.isDraft}>{workCta.body}</Draft>
        </p>
        <a
          href="/#contact"
          className="group relative mt-10 flex h-[52px] items-center justify-center overflow-hidden rounded-[12px] px-8 text-base font-medium text-white transition-[transform,filter] duration-200 ease-out hover:brightness-110 active:scale-[0.97]"
          style={{
            // Same spec as GradientCTAButton (components/ui/PricingCard.tsx), as a link.
            background: "linear-gradient(95deg, #2398EE 0%, #1472F6 52%, #444DEB 89%)",
            boxShadow:
              "0 1px 2px rgba(0,0,0,0.1), 0 2px 8px rgba(51,166,247,0.3), inset 100px -11px 40px rgba(255,255,255,0.18)",
          }}
        >
          <span className="relative z-10" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.2)" }}>
            Book a call
          </span>
          <ArrowUpRight className="relative z-10 ml-3 h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      </div>
      <div className="w-full line-dash-x" />
    </Section>
  );
}
