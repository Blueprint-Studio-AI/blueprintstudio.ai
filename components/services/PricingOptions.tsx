import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import GreenCheckmark from "@/components/ui/GreenCheckmark";
import { BookCallButton, SecondaryButton } from "@/components/ui/CallToAction";
import type { PricingOption, RichText } from "@/lib/services";
import Reveal from "@/components/work/Reveal";
import Rich from "./Rich";

// The ways to buy this service, side by side, in /brand's pricing language
// (white cards, green checks, the blue ring on the one this page leads with).
// Prices come only from the data file, which only repeats prices the site
// already publishes; an option without one is "Scoped on a call".
export default function PricingOptions({
  title,
  intro,
  options,
  note,
}: {
  title: string;
  intro: string;
  options: PricingOption[];
  note?: RichText;
}) {
  return (
    <div id="pricing">
      <Section className="relative z-20 flex flex-col overflow-hidden bg-neutral-50">
        <SectionHeader leftText="PRICING" rightText="// investment" />
        <OuterContainer>
          <div className="w-full max-w-[1120px] px-1.5 pb-16 pt-14 sm:px-6 sm:pb-24 sm:pt-20 lg:pb-28 lg:pt-24">
            <div className="mx-auto mb-10 max-w-[620px] px-4 text-center sm:mb-14">
              <h2
                className="cursor-default font-medium text-neutral-800"
                style={{ fontSize: "clamp(32px, 4.5vw, 42px)", lineHeight: "1.18", letterSpacing: "-0.84px" }}
              >
                {title}
              </h2>
              <p className="mt-3 text-balance text-base leading-[1.45] text-neutral-500">{intro}</p>
            </div>

            <div className="grid items-stretch gap-4 lg:grid-cols-3 lg:gap-5">
              {options.map((option, i) => (
                <Reveal key={option.name} delay={i * 0.06} className="h-full">
                  <Card option={option} />
                </Reveal>
              ))}
            </div>

            {note && (
              <p className="mx-auto mt-10 max-w-[560px] text-balance px-4 text-center text-sm leading-[1.5] text-neutral-500 sm:mt-12">
                <Rich text={note} />
              </p>
            )}
          </div>
        </OuterContainer>
      </Section>
    </div>
  );
}

function Card({ option }: { option: PricingOption }) {
  const { name, price, pricePrefix, priceNote, description, includes, action, featured } = option;
  const body = (
    <div className={`flex h-full flex-col rounded-[22px] p-6 sm:p-8 ${featured ? "bg-white" : "bg-[#FBFBFB]"}`}>
      <h3 className="text-[18px] font-medium tracking-[-0.36px] text-black">{name}</h3>

      <div className="mt-6">
        <span className="block text-sm text-neutral-500">{price ? (pricePrefix ?? "Price") : "Price"}</span>
        <span className="mt-1 block text-[clamp(28px,2.6vw,34px)] font-semibold leading-[1.15] tracking-[-0.03em] text-black">
          {price ?? "Scoped on a call"}
        </span>
        <span className="mt-1 block min-h-[20px] text-sm text-neutral-500">{priceNote}</span>
      </div>

      <p className="mt-4 text-[15px] leading-[1.45] text-neutral-600">{description}</p>

      <ul className="mt-6 space-y-3 border-t border-neutral-200 pt-6">
        {includes.map((item) => (
          <li key={item} className="flex items-center gap-3 text-[15px] text-neutral-800">
            <GreenCheckmark size="sm" />
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-8">
        {action.kind === "call" ? (
          <BookCallButton className="w-full" />
        ) : (
          <SecondaryButton href={action.href} className="w-full">
            {action.label}
          </SecondaryButton>
        )}
      </div>
    </div>
  );

  return featured ? (
    <div
      className="h-full rounded-[24px] p-[2px] shadow-[0_8px_30px_rgba(20,114,246,0.10)]"
      style={{ background: "linear-gradient(135deg, #60AEEE 0%, #3B82F6 25%, #2563EB 50%, #1D4ED8 75%, #4F46E5 100%)" }}
    >
      {body}
    </div>
  ) : (
    <div className="h-full overflow-hidden rounded-[24px] border border-neutral-200">{body}</div>
  );
}
