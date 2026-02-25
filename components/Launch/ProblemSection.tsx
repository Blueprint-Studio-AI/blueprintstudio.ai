"use client";

import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import Image from "next/image";
import { cn } from "@/lib/utils";

const comparison = [
  { typical: "3-4 vendors", blueprint: "1 team" },
  { typical: "8-12+ weeks", blueprint: "6 weeks" },
  { typical: "$80-150K", blueprint: "$50K" },
  { typical: "Misaligned assets", blueprint: "One cohesive brand" },
];

export default function ProblemSection() {
  return (
    <Section className="flex flex-col relative z-20 bg-neutral-100 overflow-hidden">
      {/* Vertical lines */}
      <div className="absolute inset-0 flex justify-center pointer-events-none px-2.5 sm:px-[60px]">
        <div className="w-full flex-1 flex justify-center relative">
          <div className="absolute left-0 top-0 bottom-0 line-dash-y custom:hidden" />
          <div className="absolute left-0 top-0 bottom-0 w-px bg-neutral-300 hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y custom:hidden" />
          <div className="absolute right-0 top-0 bottom-0 w-px bg-neutral-300 hidden custom:block" />
        </div>
      </div>

      <SectionHeader leftText="THE PROBLEM" rightText="// why this exists" />

      <OuterContainer className="flex-1 flex items-center">
        <InnerContainer className="pt-12 sm:pt-16 lg:pt-20 pb-12 sm:pb-16 lg:pb-20 px-2.5 sm:px-6 relative">
          <div className="absolute left-0 top-0 bottom-0 line-dash-y hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y hidden custom:block" />

          <div className="max-w-3xl mx-auto">
            {/* Headline */}
            <div className="text-center mb-12 sm:mb-16">
              <p className="text-neutral-500 mb-4 cursor-default text-sm sm:text-base">
                Agencies want retainers. Freelancers ghost you.
              </p>
              <h2
                className="font-medium text-black cursor-default"
                style={{
                  fontSize: "clamp(28px, 5vw, 44px)",
                  lineHeight: "110%",
                  letterSpacing: "-1px",
                }}
              >
                Launching shouldn&apos;t mean
                <br />
                managing 4 different vendors.
              </h2>
            </div>

            {/* Comparison table */}
            <div className="grid grid-cols-[1fr_1.2fr] sm:grid-cols-[1fr_1.3fr] text-neutral-500">
              {/* Header row */}
              <div className="py-3 sm:py-4 pr-4 sm:pr-8 flex items-center">
                <span className="text-md cursor-default">
                  Free
                </span>
              </div>
              <div className="py-3 sm:py-4 px-4 sm:px-8 border-b border-neutral-300 border-l bg-white/50 flex items-center justify-center">
                <Image
                  src="/blueprint-logo-dark.svg"
                  alt="Blueprint"
                  width={80}
                  height={20}
                  className="h-3 w-auto opacity-50 grayscale"
                />
              </div>

              {/* Data rows */}
              {comparison.map((row, i) => (
                <div key={i} className="contents">
                  <div className={cn("py-8 sm:py-5 pr-4 sm:pr-8", {
                    "border-b border-neutral-300": i !== comparison.length - 1,
                  })}>
                    <span className="line-through cursor-default text-sm sm:text-base">
                      {row.typical}
                    </span>
                  </div>
                  <div className="py-4 sm:py-5 pl-4 sm:pl-8 border-b border-neutral-200 border-l bg-white/50">
                    <span className="text-black font-medium cursor-default text-base sm:text-lg">
                      {row.blueprint}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Tagline */}
            <p className="text-center text-neutral-600 mt-12 sm:mt-16 cursor-default font-medium">
              On time. On budget. On brand.
            </p>
          </div>
        </InnerContainer>
      </OuterContainer>

      <div className="w-full line-dash-x" />
    </Section>
  );
}
