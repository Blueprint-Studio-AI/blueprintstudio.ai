"use client";

import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import { ArrowUpRight, Check } from "lucide-react";
import SocialProof from "@/components/ui/SocialProof";
import { motion } from "framer-motion";

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
          <div className="text-center mb-10 sm:mb-14">
            <h2
              className="font-medium text-black cursor-default mb-4"
              style={{
                fontSize: "clamp(36px, 7vw, 56px)",
                lineHeight: "100%",
                letterSpacing: "-2px",
              }}
            >
              Investment
            </h2>
            {/* Trust element */}
            <SocialProof starSize="sm" className="justify-center">
              Trusted by{" "}
              <strong
                className="font-semibold"
                style={{
                  background:
                    "linear-gradient(92deg, #60AEEE -1.22%, #2563EB 18.8%, #3B82F6 38.82%, #60AEEE 69.04%, #3B82F6 87.52%, #2563EB 98.88%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                25+ tech founders
              </strong>{" "}
              across AI, Web3, and YC.
            </SocialProof>
          </div>

          {/* Pricing Cards */}
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Launch Package Card - Secondary */}
              <div className="flex flex-col rounded-xl border border-neutral-200 bg-neutral-50 overflow-hidden">
                {/* Header */}
                <div className="p-6 sm:p-8 border-b border-neutral-200">
                  <h3 className="font-medium text-xl text-black mb-1 cursor-default">
                    Launch Package
                  </h3>
                  <p className="text-neutral-500 text-sm cursor-default">
                    Everything you need to go to market.
                  </p>

                  {/* Price */}
                  <div className="flex items-baseline gap-1.5 mt-4">
                    <span className="text-xs text-neutral-400 uppercase tracking-wide">
                      From
                    </span>
                    <span
                      className="font-semibold text-black"
                      style={{ fontSize: "clamp(32px, 5vw, 40px)" }}
                    >
                      $50,000
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div className="p-6 sm:p-8 space-y-3 flex-1">
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-sm font-medium text-black">
                        Brand Identity
                      </span>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        Logo, guidelines, social kit, AI prompts
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-sm font-medium text-black">
                        Website
                      </span>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        Custom design in Framer, Next.js, or Astro
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-sm font-medium text-black">
                        Pitch Deck
                      </span>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        Narrative strategy + full design in Figma
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-sm font-medium text-black">
                        Launch Video
                      </span>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        Script, production, 30-60s video
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-6 sm:p-8 pt-0">
                  {/* Holographic border button */}
                  <motion.div
                    className="relative w-full rounded-xl p-[2px] overflow-hidden"
                    whileTap={{ scale: 0.97 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                    }}
                  >
                    {/* Holographic border background */}
                    <div
                      className="absolute inset-0 rounded-xl"
                      style={{
                        background:
                          "linear-gradient(135deg, #60AEEE 0%, #3B82F6 25%, #2563EB 50%, #1D4ED8 75%, #4F46E5 100%)",
                      }}
                    />

                    {/* Animated shader on border */}
                    <motion.div
                      className="absolute inset-0 rounded-xl"
                      style={{
                        background: `
                          radial-gradient(ellipse 50% 80% at 30% 50%, rgba(147, 197, 253, 0.5) 0%, transparent 50%),
                          radial-gradient(ellipse 40% 70% at 70% 50%, rgba(96, 174, 238, 0.4) 0%, transparent 50%)
                        `,
                        filter: "blur(1px)",
                      }}
                      animate={{
                        backgroundPosition: [
                          "0% 0%, 100% 0%",
                          "100% 0%, 0% 0%",
                          "0% 0%, 100% 0%",
                        ],
                      }}
                      transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />

                    {/* Drifting highlight on border */}
                    <motion.div
                      className="absolute inset-0 rounded-xl"
                      style={{
                        background:
                          "radial-gradient(ellipse 80% 100% at center, rgba(147, 197, 253, 0.4) 0%, transparent 60%)",
                        filter: "blur(2px)",
                      }}
                      animate={{
                        x: ["-40%", "40%", "-40%"],
                      }}
                      transition={{
                        duration: 7,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />

                    {/* Inner button */}
                    <button
                      className="relative w-full py-[10px] px-6 font-medium flex items-center justify-center text-neutral-700 rounded-[10px] text-sm"
                      style={{
                        background: "rgba(255, 255, 255, 0.92)",
                        backdropFilter: "blur(8px)",
                      }}
                      onClick={() =>
                        window.open(
                          "https://cal.com/blueprint-studio/intro-call",
                          "_blank"
                        )
                      }
                    >
                      <span>Book a Call</span>
                      <ArrowUpRight className="w-4 h-4 ml-2" />
                    </button>
                  </motion.div>
                </div>
              </div>

              {/* Launch Package + Product Card - Primary */}
              <div className="flex flex-col rounded-xl border border-neutral-200 bg-white overflow-hidden">
                {/* Header */}
                <div className="p-6 sm:p-8 border-b border-neutral-100">
                  <h3 className="font-medium text-xl text-black mb-1 cursor-default">
                    Launch Package + Product
                  </h3>
                  <p className="text-neutral-500 text-sm cursor-default">
                    Go to market with a working MVP.
                  </p>

                  {/* Price */}
                  <div className="flex items-baseline gap-1.5 mt-4">
                    <span className="text-xs text-neutral-400 uppercase tracking-wide">
                      From
                    </span>
                    <span
                      className="font-semibold text-black"
                      style={{ fontSize: "clamp(32px, 5vw, 40px)" }}
                    >
                      $120,000
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div className="p-6 sm:p-8 space-y-3 flex-1">
                  <p className="text-xs text-neutral-500 mb-2">
                    Everything in Launch Package, plus:
                  </p>
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-sm font-medium text-black">
                        Product Design
                      </span>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        UX strategy, wireframes, high-fidelity UI
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-sm font-medium text-black">
                        MVP Development
                      </span>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        Functional web or mobile app, custom tech stack
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-6 sm:p-8 pt-0">
                  <motion.button
                    className="relative w-full py-3 px-6 font-medium flex items-center justify-center text-white rounded-xl text-sm overflow-hidden"
                    style={{
                      background:
                        "linear-gradient(135deg, #60AEEE 0%, #3B82F6 25%, #2563EB 50%, #1D4ED8 75%, #4F46E5 100%)",
                      boxShadow: `
                        0 1px 2px rgba(0, 0, 0, 0.1),
                        0 2px 8px rgba(96, 174, 238, 0.3),
                        0 0 0 1px rgba(255, 255, 255, 0.1) inset,
                        0 1px 0 rgba(255, 255, 255, 0.2) inset
                      `,
                    }}
                    whileTap={{ scale: 0.97 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                    }}
                    onClick={() =>
                      window.open(
                        "https://cal.com/blueprint-studio/intro-call",
                        "_blank"
                      )
                    }
                  >
                    {/* Shader-like animated gradient */}
                    <motion.div
                      className="absolute inset-0"
                      style={{
                        background: `
                          radial-gradient(ellipse 50% 80% at 30% 50%, rgba(147, 197, 253, 0.4) 0%, transparent 50%),
                          radial-gradient(ellipse 40% 70% at 70% 50%, rgba(96, 174, 238, 0.35) 0%, transparent 50%)
                        `,
                        filter: "blur(1px)",
                      }}
                      animate={{
                        backgroundPosition: [
                          "0% 0%, 100% 0%",
                          "100% 0%, 0% 0%",
                          "0% 0%, 100% 0%",
                        ],
                      }}
                      transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />

                    {/* Drifting highlight */}
                    <motion.div
                      className="absolute inset-0"
                      style={{
                        background:
                          "radial-gradient(ellipse 80% 100% at center, rgba(147, 197, 253, 0.3) 0%, transparent 60%)",
                        filter: "blur(3px)",
                      }}
                      animate={{
                        x: ["-40%", "40%", "-40%"],
                      }}
                      transition={{
                        duration: 7,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />

                    {/* Top highlight */}
                    <div
                      className="absolute inset-x-0 top-0 h-[1px]"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 20%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.4) 80%, transparent 100%)",
                      }}
                    />

                    <span
                      className="relative z-10"
                      style={{ textShadow: "0 1px 2px rgba(0, 0, 0, 0.2)" }}
                    >
                      Book a Call
                    </span>
                    <ArrowUpRight className="w-4 h-4 ml-2 relative z-10" />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Clarification */}
            <p className="text-center text-neutral-500 text-sm mt-8 cursor-default">
              Not sure which fits? Book a call and we&apos;ll scope it together.
            </p>
          </div>
        </InnerContainer>
      </OuterContainer>

      <div className="w-full line-dash-x" />
    </Section>
  );
}
