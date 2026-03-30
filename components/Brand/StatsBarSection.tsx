"use client";

import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";

const stats = [
  {
    value: "25+",
    label: "Brands",
    labelBreak: "Built",
  },
  {
    value: "3 Weeks",
    label: "Avg.",
    labelBreak: "Delivery",
  },
  {
    value: "32%",
    label: "More",
    labelBreak: "Revenue",
  },
];

export default function StatsBarSection() {
  return (
    <Section className="flex flex-col relative z-20 bg-neutral-50 overflow-hidden">
      <div className="absolute inset-0 flex justify-center pointer-events-none px-2.5 sm:px-[60px]">
        <div className="w-full flex-1 flex justify-center relative">
          <div className="absolute left-0 top-0 bottom-0 line-dash-y custom:hidden" />
          <div className="absolute left-0 top-0 bottom-0 w-px bg-neutral-300 hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y custom:hidden" />
          <div className="absolute right-0 top-0 bottom-0 w-px bg-neutral-300 hidden custom:block" />
        </div>
      </div>

      <div className="w-full line-dash-x" />

      <OuterContainer>
        <InnerContainer className="px-0 sm:px-6 relative">
          <div className="absolute left-0 top-0 bottom-0 line-dash-y hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y hidden custom:block" />
          <div className="grid grid-cols-3">
            {stats.map((stat, i) => (
              <div
                key={i}
                className={`flex flex-col items-center justify-center py-10 sm:py-14 ${
                  i === 1 ? "border-x border-neutral-300" : ""
                }`}
              >
                <span
                  className="font-semibold text-black tracking-tight"
                  style={{ fontSize: "clamp(22px, 4vw, 32px)" }}
                >
                  {stat.value}
                </span>
                <span className="text-[10px] sm:text-sm text-neutral-400 uppercase tracking-wider sm:tracking-widest mt-2 text-center leading-relaxed">
                  {stat.label}
                  <br className="sm:hidden" /> {stat.labelBreak}
                </span>
              </div>
            ))}
          </div>
        </InnerContainer>
      </OuterContainer>

      <div className="w-full line-dash-x" />
    </Section>
  );
}
