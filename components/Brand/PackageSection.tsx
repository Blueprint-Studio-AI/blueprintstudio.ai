"use client";

import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import FeatureItem from "@/components/ui/FeatureItem";
import GradientBorderCard from "@/components/ui/GradientBorderCard";
import Image from "next/image";
import { useBrandPackage } from "./BrandPackageContext";

const baseFeatures = [
  {
    name: "Logo System",
    detail: "Primary, secondary, icon, and responsive\u00a0versions",
  },
  {
    name: "Brand Guidelines",
    detail:
      "Mission, voice & tone, usage rules\u2014a 20-30 page brand book your team can actually\u00a0use",
  },
  {
    name: "Color Palette",
    detail: "Primary, secondary, accent, and neutrals with usage\u00a0guidelines",
  },
  {
    name: "Typography System",
    detail: "Display, body, and UI type hierarchy with scale and\u00a0pairings",
  },
  {
    name: "Patterns & Motifs",
    detail: "Custom patterns, textures, and visual elements unique to your\u00a0brand",
  },
  {
    name: "Social Kit",
    detail: "Profile assets, post templates, and email\u00a0signature",
  },
  {
    name: "AI Asset Generator",
    detail:
      "Custom-trained prompts for on-brand content generation across ChatGPT, Claude, and\u00a0Midjourney",
  },
  {
    name: "Sample Applications",
    detail: "Business cards, letterheads, and slide\u00a0templates",
  },
];

const websiteFeatures = [
  { name: "Custom Design", detail: "Tailored to your new brand\u00a0identity" },
  {
    name: "Development",
    detail: "Built in Framer, Next.js, or Astro\u2014your\u00a0call",
  },
  { name: "Responsive", detail: "Pixel-perfect across every screen\u00a0size" },
  {
    name: "Email Capture & SEO",
    detail: "Lead capture forms and search optimization built\u00a0in",
  },
];

const deckFeatures = [
  { name: "Narrative Strategy", detail: "Story structure that moves\u00a0investors" },
  { name: "Slide Design", detail: "On-brand visuals, charts, and\u00a0layouts" },
  {
    name: "Speaker Notes",
    detail: "Talking points that keep your pitch\u00a0tight",
  },
  { name: "Source Files", detail: "Figma files you own and can edit\u00a0forever" },
];

function AddOnCardWithPreview({
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
    <GradientBorderCard
      isActive={isAdded}
      onToggle={onToggle}
      title={title}
      price={price}
      description={description}
      size="full"
    >
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
    </GradientBorderCard>
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
              The base package covers everything you need for a complete brand&nbsp;identity.
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
            <AddOnCardWithPreview
              title="Website"
              price="+$15,000"
              description="Custom website built on your new brand."
              features={websiteFeatures}
              isAdded={websiteAdded}
              onToggle={toggleWebsite}
              previewImage="/launch-assets/web-design_assets/desktop-honeyb.png"
              previewAlt="Website design example"
            />
            <AddOnCardWithPreview
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
