"use client";

import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import { ArrowUpRight, Check } from "lucide-react";
import Link from "next/link";

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

      <SectionHeader leftText="PRICING" rightText="// investment" />

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
              Investment
            </h2>
          </div>

          {/* Pricing Card */}
          <div className="max-w-lg mx-auto">
            <div className="flex flex-col p-6 sm:p-8 rounded-2xl border border-neutral-300 bg-white">
              <h3 className="font-medium text-2xl sm:text-3xl text-black mb-2 cursor-default">
                Brand Identity
              </h3>
              <p className="text-neutral-500 text-sm mb-4 cursor-default">
                Everything you need to launch with a professional, consistent
                brand.
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-3xl sm:text-4xl font-bold text-black">
                  $15,000 – $20,000
                </span>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                  <span className="text-sm text-neutral-700">
                    Brand strategy & positioning
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                  <span className="text-sm text-neutral-700">
                    Complete logo system
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                  <span className="text-sm text-neutral-700">
                    Color, typography, guidelines
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                  <span className="text-sm text-neutral-700">
                    Social kit + email signature
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                  <span className="text-sm text-neutral-700">
                    Brand GPT (custom AI)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                  <span className="text-sm text-neutral-700">
                    2-3 applications of choice
                  </span>
                </li>
              </ul>

              {/* Details */}
              <div className="space-y-1 mb-6 text-sm text-neutral-500">
                <p>• 3-4 week delivery</p>
                <p>• Dedicated team</p>
                <p>• One point of contact</p>
              </div>

              {/* CTA */}
              <button
                className="w-full py-3 px-6 font-medium flex items-center justify-center bg-black text-white rounded-lg hover:bg-neutral-800 transition-all duration-200 text-sm group"
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

            {/* Upsell Banner */}
            <div className="mt-6 p-5 rounded-xl border border-neutral-200 bg-neutral-100 text-center">
              <p className="font-medium text-black mb-1 cursor-default">
                Want the full package?
              </p>
              <p className="text-neutral-500 text-sm mb-3 cursor-default">
                Add website, pitch deck, and launch video.
              </p>
              <Link
                href="/launch"
                className="inline-flex items-center gap-1 text-sm font-medium text-black hover:text-neutral-600 transition-colors"
              >
                <span>See Full Launch</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </InnerContainer>
      </OuterContainer>

      <div className="w-full line-dash-x" />
    </Section>
  );
}
