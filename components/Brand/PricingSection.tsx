"use client";

import { useState } from "react";
import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import { ArrowUpRight, Check } from "lucide-react";
import SocialProof from "@/components/ui/SocialProof";
import { FeatureRow, PricingContainer, PricingFooter } from "@/components/ui/PricingCard";
import { motion } from "framer-motion";
import Link from "next/link";

const brandItems = [
  { title: "Logo System", desc: "Primary mark, word-mark, icon variations." },
  { title: "Design System", desc: "Typography, color palette, visual language." },
  { title: "Social Kit + Email Signature", desc: "Profile assets and templates for posts." },
  { title: "AI Prompts", desc: "Custom guidelines for consistent AI generation." },
];

const deckItems = [
  { title: "Narrative & Structure", desc: "Layouts, charts, visual hierarchy" },
  { title: "Slide Design", desc: "Formatted for presentations and downloads" },
];

export default function PricingSection() {
  const [deckAdded, setDeckAdded] = useState(false);
  const total = deckAdded ? "$23,000" : "$18,000";

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

      <SectionHeader leftText="PRICING" rightText="// investment" />

      <OuterContainer className="flex-1 flex items-center">
        <InnerContainer className="pt-8 sm:pt-12 lg:pt-16 pb-8 sm:pb-12 lg:pb-16 px-2.5 sm:px-6 relative">
          <div className="absolute left-0 top-0 bottom-0 line-dash-y hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y hidden custom:block" />

          <div className="text-center mb-10 sm:mb-14">
            <h2
              className="font-medium text-black cursor-default mb-4"
              style={{
                fontSize: "clamp(36px, 7vw, 56px)",
                lineHeight: "100%",
                letterSpacing: "-2px",
              }}
            >
              Ready to launch?
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

          <PricingContainer>
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-6 sm:p-14 lg:p-[72px]">
                <h3 className="font-medium text-xl text-black mb-1 cursor-default">
                  Launch Package
                </h3>
                <p className="text-neutral-500 text-sm cursor-default">
                  Everything you need to go to market.
                </p>

                <div className="mt-6">
                  <span className="text-xs text-neutral-500 block">Base Price</span>
                  <span className="font-semibold text-black text-[clamp(32px,5vw,40px)] leading-tight">
                    $18,000
                  </span>
                </div>

                <p className="text-sm font-medium text-black mt-8 mb-4">Includes:</p>
                <div className="space-y-6">
                  {brandItems.map((item) => (
                    <FeatureRow key={item.title} title={item.title} desc={item.desc} />
                  ))}
                </div>
              </div>

              <div className="p-4 sm:p-8 lg:p-10">
                <div className={`rounded-[12px] p-6 sm:p-8 flex flex-col h-full transition-colors border ${deckAdded ? "bg-white border-[#186FF5]" : "bg-neutral-50/50 border-transparent line-dash-border"}`}>
                  <h3 className="font-medium text-xl text-black mb-1 cursor-default">
                    <span className="text-neutral-400">+</span> Pitch Deck
                  </h3>
                  <p className="text-neutral-500 text-sm cursor-default">
                    Go to market with a working MVP.
                  </p>

                  <div className="mt-6">
                    <span className="text-xs text-neutral-500 block">Plus Product</span>
                    <span className="font-semibold text-black text-[clamp(32px,5vw,40px)] leading-tight">
                      $5,000
                    </span>
                  </div>

                  <p className="text-sm font-medium text-black mt-8 mb-4">Includes:</p>
                  <div className="space-y-6">
                    {deckItems.map((item) => (
                      <FeatureRow key={item.title} title={item.title} desc={item.desc} />
                    ))}
                  </div>

                  <div className="mt-auto pt-8">
                    <button
                      onClick={() => setDeckAdded(!deckAdded)}
                      className={`w-full py-2.5 px-6 rounded-lg border text-sm font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                        deckAdded
                          ? "border-[#186FF5] text-[#186FF5]"
                          : "border-neutral-300 text-neutral-600 hover:border-neutral-400 hover:text-neutral-800"
                      }`}
                    >
                      {deckAdded && <Check className="w-4 h-4" />}
                      {deckAdded ? "Added" : "+ Add to Package"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <PricingFooter total={total} />
          </PricingContainer>

          <div className="max-w-xl mx-auto mt-12 text-center">
            <h3
              className="font-medium text-black cursor-default mb-2"
              style={{
                fontSize: "clamp(24px, 5vw, 36px)",
                lineHeight: "110%",
                letterSpacing: "-1px",
              }}
            >
              Want the full launch?
            </h3>
            <p className="text-neutral-500 text-sm cursor-default mb-8">
              Add website, pitch deck, and launch video.
            </p>

            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-16 h-16 rounded-xl bg-neutral-200" />
              <span className="text-neutral-400 text-lg font-light">+</span>
              <div className="w-16 h-16 rounded-xl bg-neutral-200" />
              <div className="w-16 h-16 rounded-xl bg-neutral-200" />
              <div className="w-16 h-16 rounded-xl bg-neutral-200" />
            </div>

            <motion.div
              className="inline-flex rounded-xl p-[2px]"
              style={{
                background: "linear-gradient(135deg, #60AEEE 0%, #3B82F6 25%, #2563EB 50%, #1D4ED8 75%, #4F46E5 100%, #60AEEE 100%)",
                backgroundSize: "300% 300%",
              }}
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <Link
                href="/launch"
                className="group inline-flex items-center gap-1.5 px-8 py-3 text-sm font-medium text-black rounded-[calc(0.75rem-2px)] bg-neutral-50 transition-colors hover:text-neutral-700"
              >
                See full launch package
                <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </motion.div>
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
