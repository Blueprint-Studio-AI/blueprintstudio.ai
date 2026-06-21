"use client";

import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import { ArrowUpRight, Check } from "lucide-react";
import SocialProof from "@/components/ui/SocialProof";
import { PricingContainer, GradientCTAButton } from "@/components/ui/PricingCard";
import GreenCheckmark from "@/components/ui/GreenCheckmark";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { usePackage, formatUSD, type AddonId } from "./PackageContext";

const brandItems = [
  { title: "Logo System", desc: "Primary mark, word-mark, icon variations." },
  { title: "Design System", desc: "Typography, color palette, visual language." },
  { title: "Social Kit + Email Signature", desc: "Profile assets and templates for posts." },
  { title: "AI Prompts", desc: "Custom guidelines for consistent AI generation." },
];

// Compact add-on cards (right column) — selections are shared with the
// Add-ons section above via PackageContext, so adding in either place
// updates the total here.
const addonCards: { id: AddonId; title: string; price: string; desc: string }[] = [
  {
    id: "website",
    title: "Website",
    price: "$15,000",
    desc: "Design, development, responsive, email capture and SEO.",
  },
  {
    id: "pitchDeck",
    title: "Pitch Deck",
    price: "$5,000",
    desc: "Narrative strategy, slide design, speaker notes, and source files.",
  },
];

export default function PricingSection() {
  const { selected, toggleAddon, total } = usePackage();
  // The launch-CTA ring's gradient drift repaints every frame (CPU-bound
  // backgroundPosition), so it only runs while the ring is on screen.
  const launchRingRef = useRef<HTMLDivElement>(null);
  const launchRingInView = useInView(launchRingRef);

  return (
    <Section className="flex flex-col relative z-20 bg-neutral-50 overflow-hidden">
      <SectionHeader leftText="PRICING" rightText="// investment" divider={false} />

      <OuterContainer className="flex-1 flex items-center">
        <InnerContainer className="pt-8 sm:pt-12 lg:pt-16 pb-8 sm:pb-12 lg:pb-16 px-2.5 sm:px-6 relative">
          <div className="text-center mb-10 sm:mb-14">
            <h2
              className="font-medium text-neutral-800 cursor-default mb-3"
              style={{
                fontSize: "clamp(32px, 4.5vw, 42px)",
                lineHeight: "1.18",
                letterSpacing: "-0.84px",
              }}
            >
              Ready to launch?
            </h2>
            <SocialProof starSize="sm" className="justify-center">
              Trusted by{" "}
              <strong
                className="font-semibold"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, #33A6F7 0%, #1472F6 51.923%, #444DEB 88.942%)",
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

          <PricingContainer maxWidth="max-w-[1000px]" rounded="rounded-[24px]">
            {/* Card body — one shared 48px inset (per Figma) and one shared
                [1fr, 412px] grid; the footer reuses the same inset + grid so
                the Total aligns with this column and Book-a-Call spans exactly
                the add-ons column. */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_412px] gap-10 lg:gap-8 p-6 sm:p-10 lg:p-12">
              <div>
                <h3
                  className="font-medium text-[26px] sm:text-[32px] text-black mb-1 cursor-default"
                  style={{ letterSpacing: "-0.5px" }}
                >
                  Launch Package
                </h3>
                <p className="text-neutral-500 text-base cursor-default">
                  Everything you need to go to market.
                </p>

                <div className="mt-8">
                  <span className="text-sm text-neutral-500 block">Base Price</span>
                  <span
                    className="font-semibold text-black text-[32px] leading-[1.28]"
                    style={{ letterSpacing: "-0.64px" }}
                  >
                    $18,000
                  </span>
                </div>

                <p className="text-[18px] font-medium text-black mt-9 mb-5">Includes:</p>
                <div className="space-y-6">
                  {brandItems.map((item) => (
                    <div key={item.title} className="flex items-center gap-4">
                      <GreenCheckmark />
                      <div>
                        <span
                          className="block text-[18px] font-medium text-neutral-800"
                          style={{ letterSpacing: "-0.36px" }}
                        >
                          {item.title}
                        </span>
                        <p
                          className="mt-1.5 text-[16px] text-neutral-500"
                          style={{ letterSpacing: "-0.32px" }}
                        >
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-8">
                {addonCards.map((card) => {
                  const added = selected[card.id];
                  return (
                    <div key={card.id} className="relative rounded-[14px] p-[2px]">
                      {/* Animated gradient ring while the add-on is in the package */}
                      <motion.div
                        className="absolute inset-0 rounded-[14px]"
                        style={{
                          background:
                            "linear-gradient(135deg, #60AEEE 0%, #3B82F6 25%, #2563EB 50%, #1D4ED8 75%, #4F46E5 100%, #60AEEE 100%)",
                          backgroundSize: "300% 300%",
                        }}
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity: added ? 1 : 0,
                          // Only loop the drift while the ring is visible —
                          // otherwise it repaints every frame at opacity 0.
                          backgroundPosition: added
                            ? ["0% 50%", "100% 50%", "0% 50%"]
                            : "0% 50%",
                        }}
                        transition={{
                          opacity: { duration: 0.3 },
                          backgroundPosition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                        }}
                      />
                      <div
                        className={`relative flex flex-col rounded-[12px] p-6 sm:p-8 transition-colors duration-300 ${
                          added ? "bg-white" : "bg-[#FBFBFB] line-dash-border"
                        }`}
                      >
                        {/* Title + price on one row */}
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="font-medium text-[18px] text-black cursor-default">
                            <span className="text-neutral-500">+</span> {card.title}
                          </h3>
                          <span
                            className="font-medium text-black text-[24px] cursor-default"
                            style={{ letterSpacing: "-0.48px" }}
                          >
                            {card.price}
                          </span>
                        </div>

                        {/* Summary with the blue check */}
                        <div className="mt-8 flex items-center gap-4">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-blue-500 text-blue-500">
                            <Check className="h-3.5 w-3.5" strokeWidth={3.5} />
                          </span>
                          <p
                            className="text-[16px] font-medium text-neutral-500 cursor-default"
                            style={{ letterSpacing: "-0.32px", lineHeight: "1.3" }}
                          >
                            {card.desc}
                          </p>
                        </div>

                        <button
                          onClick={() => toggleAddon(card.id)}
                          className={`mt-8 flex w-full items-center justify-center gap-1.5 rounded-[12px] border-[1.5px] py-4 text-[16px] font-medium tracking-[-0.32px] transition-colors cursor-pointer ${
                            added
                              ? "border-[#186FF5] bg-white text-[#186FF5]"
                              : "border-[#DFDFE1] bg-[#FBFBFB] text-[#111] hover:bg-white"
                          }`}
                        >
                          {added && <Check className="w-4 h-4" />}
                          {added ? "Added" : "+ Add to Package"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer — same inset + same [1fr, 412px] grid as the body, so the
                Total left-aligns with "Launch Package" and Book-a-Call spans
                exactly the add-on boxes' column. */}
            <div className="h-px bg-neutral-200 mx-6 sm:mx-10 lg:mx-12" />
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_412px] items-center gap-6 lg:gap-8 px-6 sm:px-10 lg:px-12 pt-6 sm:pt-8 pb-6 sm:pb-10 lg:pb-12">
              <div className="flex flex-col gap-3">
                <span className="text-sm text-neutral-500 block">Total:</span>
                <span
                  className="font-semibold text-black text-[48px] leading-[50px]"
                  style={{ letterSpacing: "-0.96px" }}
                >
                  {formatUSD(total)}
                </span>
              </div>
              <div>
                <GradientCTAButton />
              </div>
            </div>
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
              Want the full launch package?
            </h3>
            <p className="text-neutral-500 text-sm cursor-default mb-8">
              Add website, pitch deck, and launch video.
            </p>

            <motion.div
              ref={launchRingRef}
              className="inline-flex rounded-xl p-[2px]"
              style={{
                background: "linear-gradient(135deg, #60AEEE 0%, #3B82F6 25%, #2563EB 50%, #1D4ED8 75%, #4F46E5 100%, #60AEEE 100%)",
                backgroundSize: "300% 300%",
              }}
              animate={
                launchRingInView
                  ? { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }
                  : { backgroundPosition: "0% 50%" }
              }
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
    </Section>
  );
}
