import Section from "@/components/ui/Section";
import { BookCallButton, SecondaryButton } from "@/components/ui/CallToAction";
import { workCta } from "@/lib/work";
import Draft from "./Draft";
import FrameLines from "./FrameLines";

// Closing band on the work, industry and service pages. "Book a call with
// Tyler" goes to the home page's calendar, the same place as the floating
// nav's Book Call. The copy defaults to the work pages' lines.
export default function CtaBand({
  heading = workCta.heading,
  body = workCta.body,
  isDraft = workCta.isDraft,
  secondary,
}: {
  heading?: string;
  body?: string;
  isDraft?: boolean;
  secondary?: { href: string; label: string };
}) {
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
          <Draft when={isDraft}>{heading}</Draft>
        </h2>
        <p className="mt-4 text-balance text-[17px] text-neutral-600 lg:text-lg">
          <Draft when={isDraft}>{body}</Draft>
        </p>
        <div className="mt-10 flex w-full max-w-[340px] flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row">
          <BookCallButton />
          {secondary && <SecondaryButton href={secondary.href}>{secondary.label}</SecondaryButton>}
        </div>
      </div>
      <div className="w-full line-dash-x" />
    </Section>
  );
}
