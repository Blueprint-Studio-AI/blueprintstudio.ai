"use client";

import { useState } from "react";
import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import { ArrowUpRight, Check } from "lucide-react";
import SocialProof from "@/components/ui/SocialProof";
import GreenCheckmark from "@/components/ui/GreenCheckmark";
import { motion } from "framer-motion";

const launchItems = [
  { title: "Brand Identity", desc: "Logos, guidelines, social kit, AI prompts" },
  { title: "Website", desc: "Design in Framer, Next.js, or Astro" },
  { title: "Pitch Deck", desc: "Narrative strategy + full design in Figma" },
  { title: "Launch Video", desc: "Script, production, 30-60s video" },
];

const productItems = [
  { title: "Product Design", desc: "Strategy, wireframes, high-fidelity UI" },
  { title: "MVP Development", desc: "Web or mobile app, custom tech stack" },
];

function FeatureRow({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex items-center gap-4">
      <GreenCheckmark size="sm" />
      <div>
        <span className="text-sm font-medium text-black">{title}</span>
        <p className="text-xs text-neutral-500 mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

export default function PricingSection() {
  const [productAdded, setProductAdded] = useState(false);
  const total = productAdded ? "$120,000" : "$50,000";

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

          {/* Pricing Container */}
          <div className="max-w-4xl mx-auto rounded-[48px] border border-neutral-200 bg-white overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Launch Package */}
              <div className="p-14 sm:p-[72px]">
                <h3 className="font-medium text-xl text-black mb-1 cursor-default">
                  Launch Package
                </h3>
                <p className="text-neutral-500 text-sm cursor-default">
                  Everything you need to go to market.
                </p>

                <div className="mt-6">
                  <span className="text-xs text-neutral-400 block">Base Price</span>
                  <span className="font-semibold text-black text-[clamp(32px,5vw,40px)] leading-tight">
                    $50,000
                  </span>
                </div>

                <p className="text-sm font-medium text-black mt-8 mb-4">Includes:</p>
                <div className="space-y-6">
                  {launchItems.map((item) => (
                    <FeatureRow key={item.title} title={item.title} desc={item.desc} />
                  ))}
                </div>
              </div>

              {/* + Product Add-on */}
              <div className="p-8 sm:p-10">
                <div className={`rounded-[12px] bg-neutral-50/50 p-6 sm:p-8 flex flex-col h-full transition-colors ${productAdded ? "border border-[#186FF5]" : "line-dash-border"}`}>
                  <h3 className="font-medium text-xl text-black mb-1 cursor-default">
                    <span className="text-neutral-400">+</span> Product
                  </h3>
                  <p className="text-neutral-500 text-sm cursor-default">
                    Go to market with a working MVP.
                  </p>

                  <div className="mt-6">
                    <span className="text-xs text-neutral-400 block">Plus Product</span>
                    <span className="font-semibold text-black text-[clamp(32px,5vw,40px)] leading-tight">
                      $70,000
                    </span>
                  </div>

                  <p className="text-sm font-medium text-black mt-8 mb-4">Includes:</p>
                  <div className="space-y-6">
                    {productItems.map((item) => (
                      <FeatureRow key={item.title} title={item.title} desc={item.desc} />
                    ))}
                  </div>

                  <div className="mt-auto pt-8">
                    <button
                      onClick={() => setProductAdded(!productAdded)}
                      className={`w-full py-2.5 px-6 rounded-lg border text-sm font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                        productAdded
                          ? "border-[#186FF5] text-[#186FF5]"
                          : "border-neutral-300 text-neutral-600 hover:border-neutral-400 hover:text-neutral-800"
                      }`}
                    >
                      {productAdded && <Check className="w-4 h-4" />}
                      {productAdded ? "Added" : "+ Add to Package"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="h-px bg-neutral-200 mx-8 sm:mx-10" />
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center py-6 sm:py-8">
              <div className="px-8 sm:px-10 flex flex-col gap-3">
                <span className="text-xs text-neutral-500 block">Total:</span>
                <span className="font-semibold text-black text-[clamp(32px,5vw,44px)] leading-tight">
                  {total}
                </span>
              </div>

              <div className="pr-8 sm:pr-10 pl-0">
              <motion.button
                className="relative w-full py-3 px-8 font-medium flex items-center justify-center text-white rounded-xl text-sm overflow-hidden"
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

          <p className="text-center text-neutral-500 text-sm mt-8 cursor-default">
            Not sure which fits? Book a call and we&apos;ll scope it together.
          </p>
        </InnerContainer>
      </OuterContainer>

      <div className="w-full line-dash-x" />
    </Section>
  );
}
