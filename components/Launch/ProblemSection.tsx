"use client";

import { motion } from "framer-motion";
import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import GradientButton from "@/components/ui/GradientButton";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import GreenCheckmark from "@/components/ui/GreenCheckmark";

const comparison = [
  { typical: "3-4 Vendors", blueprint: "1 Unified Team" },
  { typical: "8-12 Weeks", blueprint: "6 Weeks" },
  { typical: "$80-150K", blueprint: "$50k" },
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

          <div className="mx-auto">
            {/* Headline */}
            <div className="text-center mb-12 sm:mb-16">
              <p className="text-neutral-500 mb-4 cursor-default text-sm sm:text-base">
                Agencies want retainers. Freelancers ghost you.
              </p>
              <h2
                className="font-medium text-black cursor-default"
                style={{
                  fontSize: "clamp(28px, 5vw, 48px)",
                  lineHeight: "110%",
                  letterSpacing: "-1px",
                }}
              >
                Launching shouldn&apos;t mean
                <br className="hidden sm:block" />
                {" "}managing 4 different vendors.
              </h2>
            </div>

            {/* Comparison table — flat grid so rows align naturally */}
            <div className="relative grid grid-cols-2 gap-x-6">

              {/* Gradient border card overlay — spans entire right column */}
              <div className="absolute right-0 inset-y-0 rounded-2xl p-px pointer-events-none"
                style={{ width: "calc(50% - 0.75rem)" }}
              >
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background: "linear-gradient(135deg, #60AEEE 0%, #3B82F6 25%, #2563EB 50%, #1D4ED8 75%, #4F46E5 100%, #60AEEE 100%)",
                    backgroundSize: "300% 300%",
                  }}
                  animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="absolute inset-0.5 rounded-[calc(1rem-1px)] bg-white" />
              </div>

              {/* Header row */}
              <div className="py-4 sm:py-5 pr-6">
                <span className="text-neutral-500 text-[20px] cursor-default">Free</span>
              </div>
              <div className="py-4 sm:py-5 px-3 sm:px-6 relative z-10">
                <Image src="/blueprint-logo-dark.svg" alt="Blueprint Studio" width={80} height={16} className="h-4 w-auto" />
              </div>

              {/* Data rows */}
              {comparison.map((row, i) => (
                <div key={i} className="contents">
                  <div className={`flex  items-center gap-3 py-4 sm:py-5 ${i !== comparison.length - 1 ? "border-b border-neutral-300" : ""}`}>
                    <div className={'w-3 h-3 aspect-square rounded-full bg-neutral-300'} />
                    <span className="line-through cursor-default text-neutral-400 text-sm sm:text-base">
                      {row.typical}
                    </span>
                  </div>
                  <div className="py-4 sm:py-5 px-3 sm:px-6 relative z-10 flex items-center gap-2 sm:gap-3">
                    <GreenCheckmark />
                    <span className="text-black cursor-default text-sm sm:text-base">
                      {row.blueprint}
                    </span>
                    {i !== comparison.length - 1 && (
                      <div className="absolute bottom-0 left-0.5 right-0.5 h-px bg-neutral-100" />
                    )}
                  </div>
                </div>
              ))}

              {/* Button row — right column only */}
              <div />
              <div className="py-4 sm:py-5 px-3 sm:px-6 relative z-10">
                <GradientButton
                  className="w-full justify-center"
                  onClick={() => window.open("https://cal.com/blueprint-studio/intro-call", "_blank")}
                >
                  Book a Call
                  <ArrowUpRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </GradientButton>
              </div>
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
