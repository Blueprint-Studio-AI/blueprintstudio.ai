"use client";

import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import { ArrowUpRight } from "lucide-react";
import SocialProof from "@/components/ui/SocialProof";
import {
  FeatureRow,
  PricingContainer,
  PricingFooter,
} from "@/components/ui/PricingCard";
import GradientBorderCard, {
  GRADIENT_BORDER_BG,
} from "@/components/ui/GradientBorderCard";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  useBrandPackage,
  WEBSITE_PRICE,
  DECK_PRICE,
} from "./BrandPackageContext";

const brandItems = [
  { title: "Logo System", desc: "Primary mark, word-mark, icon variations." },
  {
    title: "Brand Guidelines",
    desc: "Voice, tone, usage rules\u201420-30 page brand book.",
  },
  {
    title: "Color & Typography",
    desc: "Full palette, type hierarchy, usage guidelines.",
  },
  {
    title: "Patterns & Motifs",
    desc: "Custom textures and visual elements.",
  },
  {
    title: "Social Kit + Email Signature",
    desc: "Profile assets and templates for posts.",
  },
  {
    title: "AI Prompts",
    desc: "Custom guidelines for consistent AI generation.",
  },
  {
    title: "Sample Applications",
    desc: "Business cards, letterheads, slide templates.",
  },
];

function formatPrice(amount: number): string {
  return `$${amount.toLocaleString()}`;
}

export default function PricingSection() {
  const { websiteAdded, deckAdded, toggleWebsite, toggleDeck, total } =
    useBrandPackage();

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
            <div className="p-6 sm:p-10 lg:p-14">
              {/* Base Package */}
              <div className="mb-8">
                <h3 className="font-medium text-xl text-black mb-1 cursor-default">
                  Brand Identity
                </h3>
                <p className="text-neutral-500 text-sm cursor-default">
                  Everything you need for a market-ready brand.
                </p>

                <div className="mt-6">
                  <span className="text-xs text-neutral-500 block">
                    Base Price
                  </span>
                  <span className="font-semibold text-black text-[clamp(32px,5vw,40px)] leading-tight">
                    $18,000
                  </span>
                </div>
              </div>

              <p className="text-sm font-medium text-black mb-4">Includes:</p>
              <div className="space-y-6 mb-8">
                {brandItems.map((item) => (
                  <FeatureRow
                    key={item.title}
                    title={item.title}
                    desc={item.desc}
                  />
                ))}
              </div>

              {/* Add-on toggles */}
              <div className="border-t border-neutral-200 pt-8 mt-8">
                <p className="text-sm font-medium text-black mb-4">Add-ons:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Website Add-on */}
                  <GradientBorderCard
                    isActive={websiteAdded}
                    onToggle={toggleWebsite}
                    title="Website"
                    price={formatPrice(WEBSITE_PRICE)}
                    description="Custom design, development, responsive, CMS & SEO"
                    size="compact"
                  />

                  {/* Pitch Deck Add-on */}
                  <GradientBorderCard
                    isActive={deckAdded}
                    onToggle={toggleDeck}
                    title="Pitch Deck"
                    price={formatPrice(DECK_PRICE)}
                    description="Narrative strategy, slide design, speaker notes, source files"
                    size="compact"
                  />
                </div>
              </div>
            </div>

            <PricingFooter total={formatPrice(total)} />
          </PricingContainer>

          {/* Upsell */}
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
              Add launch video and get the complete startup package.
            </p>

            <motion.div
              className="inline-flex rounded-xl p-[2px]"
              style={{
                background: GRADIENT_BORDER_BG,
                backgroundSize: "300% 300%",
              }}
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
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
