"use client";

import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import FeatureItem from "@/components/ui/FeatureItem";
import Image from "next/image";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { useBrandPackage } from "./BrandPackageContext";

const baseFeatures = [
  {
    name: "Logo System",
    detail: "Primary, secondary, icon, and responsive versions",
  },
  {
    name: "Brand Guidelines",
    detail:
      "Mission, voice & tone, usage rules -- a 20-30 page brand book your team can actually use",
  },
  {
    name: "Color Palette",
    detail: "Primary, secondary, accent, and neutrals with usage guidelines",
  },
  {
    name: "Typography System",
    detail: "Display, body, and UI type hierarchy with scale and pairings",
  },
  {
    name: "Patterns & Motifs",
    detail: "Custom patterns, textures, and visual elements unique to your brand",
  },
  {
    name: "Social Kit",
    detail: "Profile assets, post templates, and email signature",
  },
  {
    name: "AI Asset Generator",
    detail:
      "Custom-trained prompts for on-brand content generation across ChatGPT, Claude, and Midjourney",
  },
  {
    name: "Sample Applications",
    detail: "Business cards, letterheads, and slide templates",
  },
];

const websiteFeatures = [
  { name: "Custom Design", detail: "Tailored to your new brand identity" },
  {
    name: "Development",
    detail: "Built in Framer, Next.js, or Astro -- your call",
  },
  { name: "Responsive", detail: "Pixel-perfect across every screen size" },
  {
    name: "CMS & SEO",
    detail: "Content management and search optimization built in",
  },
];

const deckFeatures = [
  { name: "Narrative Strategy", detail: "Story structure that moves investors" },
  { name: "Slide Design", detail: "On-brand visuals, charts, and layouts" },
  {
    name: "Speaker Notes",
    detail: "Talking points that keep your pitch tight",
  },
  { name: "Source Files", detail: "Figma files you own and can edit forever" },
];

function AddOnCard({
  title,
  price,
  description,
  features,
  isAdded,
  onToggle,
  previewImage,
  previewAlt,
}: {
  title: string;
  price: string;
  description: string;
  features: { name: string; detail: string }[];
  isAdded: boolean;
  onToggle: () => void;
  previewImage: string;
  previewAlt: string;
}) {
  return (
    <div className="relative rounded-[12px] h-full p-[2px]">
      <motion.div
        className="absolute inset-0 rounded-[12px]"
        style={{
          background:
            "linear-gradient(135deg, #60AEEE 0%, #3B82F6 25%, #2563EB 50%, #1D4ED8 75%, #4F46E5 100%, #60AEEE 100%)",
          backgroundSize: "300% 300%",
        }}
        initial={{ opacity: 0 }}
        animate={{
          opacity: isAdded ? 1 : 0,
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          opacity: { duration: 0.3 },
          backgroundPosition: {
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      />
      <div
        className={`relative rounded-[10px] p-6 sm:p-8 flex flex-col h-full transition-colors duration-300 ${
          isAdded ? "bg-white" : "bg-neutral-50 line-dash-border"
        }`}
      >
        <h3 className="font-medium text-xl text-black mb-1 cursor-default">
          <span className="text-neutral-400">+</span> {title}
        </h3>
        <p className="text-neutral-500 text-sm cursor-default">{description}</p>

        <div className="mt-4">
          <span className="text-xs text-neutral-500 block">Add-on</span>
          <span className="font-semibold text-black text-[clamp(24px,4vw,32px)] leading-tight">
            {price}
          </span>
        </div>

        {/* Preview Image */}
        <div className="relative w-full aspect-[16/10] mt-4 rounded-lg overflow-hidden bg-neutral-100">
          <Image
            src={previewImage}
            alt={previewAlt}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover"
          />
        </div>

        <div className="mt-6 space-y-0">
          {features.map((feature, i) => (
            <FeatureItem
              key={feature.name}
              feature={feature}
              isLast={i === features.length - 1}
            />
          ))}
        </div>

        <div className="mt-auto pt-6">
          <button
            onClick={onToggle}
            className={`w-full py-2.5 px-6 rounded-lg border text-sm font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              isAdded
                ? "border-[#186FF5] text-[#186FF5]"
                : "border-neutral-300 text-neutral-600 hover:border-neutral-400 hover:text-neutral-800"
            }`}
          >
            {isAdded && <Check className="w-4 h-4" />}
            {isAdded ? "Added" : "+ Add to Package"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PackageSection() {
  const { websiteAdded, deckAdded, toggleWebsite, toggleDeck } =
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

      <SectionHeader leftText="DELIVERABLES" rightText="// what you get" />

      <OuterContainer className="flex-1 flex items-center">
        <InnerContainer className="pt-8 sm:pt-12 lg:pt-16 pb-8 sm:pb-12 lg:pb-16 px-2.5 sm:px-6 relative">
          <div className="absolute left-0 top-0 bottom-0 line-dash-y hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y hidden custom:block" />

          <div className="text-center mb-10 sm:mb-14">
            <h2
              className="font-medium text-black cursor-default"
              style={{
                fontSize: "clamp(32px, 6vw, 48px)",
                lineHeight: "110%",
                letterSpacing: "-1.5px",
              }}
            >
              What&apos;s Included
            </h2>
            <p className="text-neutral-500 mt-3 cursor-default text-sm sm:text-base">
              The base package covers everything you need for a complete brand
              identity.
            </p>
          </div>

          {/* Base Package */}
          <div className="max-w-2xl mx-auto mb-14 sm:mb-20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-medium text-lg sm:text-xl text-black cursor-default">
                Brand Identity
              </h3>
              <span className="text-sm text-neutral-500">Base Package</span>
            </div>

            <div>
              {baseFeatures.map((feature, i) => (
                <FeatureItem
                  key={feature.name}
                  feature={feature}
                  isLast={i === baseFeatures.length - 1}
                />
              ))}
            </div>
          </div>

          {/* Add-ons */}
          <div className="mb-6">
            <h3
              className="font-medium text-black cursor-default text-center mb-8"
              style={{
                fontSize: "clamp(24px, 4vw, 32px)",
                lineHeight: "120%",
                letterSpacing: "-1px",
              }}
            >
              Add-ons
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AddOnCard
              title="Website"
              price="+$15,000"
              description="Custom website built on your new brand."
              features={websiteFeatures}
              isAdded={websiteAdded}
              onToggle={toggleWebsite}
              previewImage="/launch-assets/web-design_assets/desktop-honeyb.png"
              previewAlt="Website design example"
            />
            <AddOnCard
              title="Pitch Deck"
              price="+$5,000"
              description="Investor-ready deck designed to close."
              features={deckFeatures}
              isAdded={deckAdded}
              onToggle={toggleDeck}
              previewImage="/launch-assets/slide-deck_assets/honeyb_deck-assets/honeyb-1.jpg"
              previewAlt="Pitch deck design example"
            />
          </div>
        </InnerContainer>
      </OuterContainer>

      <div className="w-full line-dash-x" />
    </Section>
  );
}
