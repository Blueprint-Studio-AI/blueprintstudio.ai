"use client";

import { useState } from "react";
import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import { Check } from "lucide-react";
import SocialProof from "@/components/ui/SocialProof";
import { FeatureRow, PricingContainer, PricingFooter } from "@/components/ui/PricingCard";

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

export default function PricingSection() {
  const [productAdded, setProductAdded] = useState(false);
  const total = productAdded ? "$120,000" : "$50,000";

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

              <div className="p-4 sm:p-8 lg:p-10">
                <div className={`rounded-[12px] p-6 sm:p-8 flex flex-col h-full transition-colors border ${productAdded ? "bg-white border-[#186FF5]" : "bg-neutral-50/50 border-transparent line-dash-border"}`}>
                  <h3 className="font-medium text-xl text-black mb-1 cursor-default">
                    <span className="text-neutral-400">+</span> Product
                  </h3>
                  <p className="text-neutral-500 text-sm cursor-default">
                    Go to market with a working MVP.
                  </p>

                  <div className="mt-6">
                    <span className="text-xs text-neutral-500 block">Plus Product</span>
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

            <PricingFooter total={total} />
          </PricingContainer>

          <p className="text-center text-neutral-500 text-sm mt-8 cursor-default">
            Not sure which fits? Book a call and we&apos;ll scope it together.
          </p>
        </InnerContainer>
      </OuterContainer>

      <div className="w-full line-dash-x" />
    </Section>
  );
}
