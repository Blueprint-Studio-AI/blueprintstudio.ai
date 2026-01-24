"use client";

import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import { ArrowUpRight, Check } from "lucide-react";

export default function PricingSection() {
  return (
    <Section className="flex flex-col relative z-20 bg-neutral-50 overflow-hidden">
      {/* Vertical lines */}
      <div className="absolute inset-0 flex justify-center pointer-events-none px-2.5 sm:px-[60px]">
        <div className="w-full flex-1 flex justify-center relative">
          <div className="absolute left-0 top-0 bottom-0 line-dash-y custom:hidden" />
          <div className="absolute left-0 top-0 bottom-0 w-px bg-neutral-300 hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y custom:hidden" />
          <div className="absolute right-0 top-0 bottom-0 w-px bg-neutral-300 hidden custom:block" />
        </div>
      </div>

      <SectionHeader leftText="PRICING" rightText="// pick your pace" />

      <OuterContainer className="flex-1 flex items-center">
        <InnerContainer className="pt-8 sm:pt-12 lg:pt-16 pb-8 sm:pb-12 lg:pb-16 px-2.5 sm:px-6 relative">
          <div className="absolute left-0 top-0 bottom-0 line-dash-y hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y hidden custom:block" />

          {/* Section Title */}
          <div className="text-center mb-8 sm:mb-10">
            <h2
              className="font-semibold text-black cursor-default"
              style={{
                fontSize: "clamp(40px, 8vw, 72px)",
                lineHeight: "100%",
                letterSpacing: "-2px",
              }}
            >
              Pick Your Pace
            </h2>
            <p
              className="font-normal text-neutral-500 mt-6 cursor-default"
              style={{
                fontSize: "clamp(18px, 3.5vw, 24px)",
                lineHeight: "110%",
                letterSpacing: "-0.5px",
              }}
            >
              Two ways to launch
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Fast Package */}
              <div className="flex flex-col p-6 rounded-2xl border border-neutral-300 bg-white">
                <h3 className="font-medium text-2xl sm:text-3xl text-black mb-2 cursor-default">Fast</h3>
                <p className="text-neutral-500 text-sm mb-4 cursor-default">
                  For founders who need something good, now.
                </p>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-neutral-400 line-through text-lg">$10,000</span>
                  <span className="text-3xl font-bold text-black">
                    $6,000<sup className="text-base text-black font-semibold ml-0.5">*</sup>
                  </span>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-6 flex-1">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <span className="text-sm text-neutral-700">First draft in 7-days</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <span className="text-sm text-neutral-700">Final delivery in 10-days</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <span className="text-sm text-neutral-700">1 round of revisions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <span className="text-sm text-neutral-700">1 minute runtime</span>
                  </li>
                </ul>

                {/* CTA */}
                <button
                  className="w-full py-3 px-6 font-medium flex items-center justify-center bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 text-sm group"
                  onClick={() =>
                    window.open(
                      "https://cal.com/blueprint-studio/intro-call",
                      "_blank"
                    )
                  }
                >
                  <span>Book a Call</span>
                  <ArrowUpRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>

              {/* Studio Package */}
              <div className="flex flex-col p-6 rounded-2xl border border-neutral-300 bg-neutral-100">
                <h3 className="font-medium text-2xl sm:text-3xl text-black mb-2 cursor-default">Studio</h3>
                <p className="text-neutral-500 text-sm mb-4 cursor-default">
                  For founders who want flexibility, exploration, and have time to collaborate.
                </p>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-3xl font-bold text-black">$15,000</span>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-6 flex-1">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <span className="text-sm text-neutral-700">In depth concept exploration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <span className="text-sm text-neutral-700">Flexible runtime</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <span className="text-sm text-neutral-700">Option for live filming in SF</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <span className="text-sm text-neutral-700">Multiple rounds of revisions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <span className="text-sm text-neutral-700">2-4 weeks</span>
                  </li>
                </ul>

                {/* CTA */}
                <button
                  className="w-full py-3 px-6 font-medium flex items-center justify-center bg-white text-black border border-neutral-300 rounded-lg hover:bg-black hover:text-white hover:border-black transition-all duration-200 text-sm group"
                  onClick={() =>
                    window.open(
                      "https://cal.com/blueprint-studio/intro-call",
                      "_blank"
                    )
                  }
                >
                  <span>Get Quote</span>
                  <ArrowUpRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>
            </div>

            {/* Footnote - centered under Fast card */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
              <p className="text-xs text-neutral-500 text-center cursor-default">
                <span className="text-black">*</span> Tag us in your launch post to unlock this rate.
              </p>
            </div>
          </div>
        </InnerContainer>
      </OuterContainer>

      <div className="w-full line-dash-x" />
    </Section>
  );
}
