"use client";

import { useState } from "react";
import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import BrandPicker from "@/components/ui/BrandPicker";
import MarqueeGalleryRow from "@/components/ui/MarqueeGalleryRow";
import DeliverablePill from "@/components/ui/DeliverablePill";
import { brandPortfolio } from "@/data/brandPortfolio";

const honeyBSpotlight = {
  name: "HoneyB",
  logo: "/logos-match-height/honeyb.png",
  title: "Bitcoin yield platform",
  description:
    "Full brand identity built from a blank slate. Logo system, color palette, guidelines, social kit, and website -- all delivered as one cohesive system.",
  deliverables: [
    { num: "01", label: "Brand" },
    { num: "02", label: "Website" },
    { num: "03", label: "Deck" },
  ],
  image: "/launch-assets/honeyb-spotlight/spotlight-background.png",
};

const showcaseBrands = brandPortfolio.map((b) => ({
  ...b,
  brandImage: `/brand-assets/brands-weve-built/${b.id}_brands-we-built.png`,
}));

export default function PortfolioSection() {
  const [selectedBrandId, setSelectedBrandId] = useState(
    showcaseBrands[0].id
  );

  const selectedBrand = showcaseBrands.find((b) => b.id === selectedBrandId)!;

  const allGalleryImages = brandPortfolio.flatMap((b) => b.gallery);

  return (
    <Section
      id="portfolio"
      className="flex flex-col relative z-20 bg-neutral-100 overflow-hidden"
    >
      <div className="absolute inset-0 flex justify-center pointer-events-none px-2.5 sm:px-[60px]">
        <div className="w-full flex-1 flex justify-center relative">
          <div className="absolute left-0 top-0 bottom-0 line-dash-y custom:hidden" />
          <div className="absolute left-0 top-0 bottom-0 w-px bg-neutral-300 hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y custom:hidden" />
          <div className="absolute right-0 top-0 bottom-0 w-px bg-neutral-300 hidden custom:block" />
        </div>
      </div>

      <SectionHeader leftText="THE WORK" rightText="// brands we've built" />

      <OuterContainer className="flex-1 flex items-center">
        <InnerContainer className="pt-8 sm:pt-12 lg:pt-16 pb-8 sm:pb-12 lg:pb-16 px-2.5 sm:px-6 relative">
          <div className="absolute left-0 top-0 bottom-0 line-dash-y hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y hidden custom:block" />

          {/* Section Title */}
          <div className="text-center mb-8 sm:mb-12">
            <h2
              className="font-medium text-black cursor-default"
              style={{
                fontSize: "clamp(32px, 6vw, 48px)",
                lineHeight: "110%",
                letterSpacing: "-1.5px",
              }}
            >
              Brands We&apos;ve Built
            </h2>
          </div>

          {/* Brand Picker */}
          <div className="flex justify-center mb-8 sm:mb-10">
            <BrandPicker
              brands={showcaseBrands}
              selectedId={selectedBrandId}
              onSelect={setSelectedBrandId}
            />
          </div>

          {/* Hero Showcase - Selected Brand */}
          <div className="relative w-full overflow-hidden rounded-2xl border border-neutral-200 bg-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Brand Info */}
              <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: selectedBrand.accentColor }}
                  />
                  <span className="text-sm text-neutral-500 uppercase tracking-wider">
                    {selectedBrand.tagline}
                  </span>
                </div>

                <h3
                  className="font-medium text-black cursor-default tracking-tight mb-3"
                  style={{
                    fontSize: "clamp(28px, 5vw, 40px)",
                    lineHeight: "110%",
                  }}
                >
                  {selectedBrand.name}
                </h3>

                <p className="text-neutral-500 text-base leading-[140%] mb-2">
                  {selectedBrand.headline}
                </p>
                <p className="text-neutral-400 text-sm leading-[150%]">
                  {selectedBrand.description}
                </p>
              </div>

              {/* Brand Image */}
              <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[320px]">
                <Image
                  src={selectedBrand.brandImage}
                  alt={`${selectedBrand.name} brand identity`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          {/* Marquee Gallery */}
          <div className="mt-10 sm:mt-14">
            <MarqueeGalleryRow
              images={allGalleryImages}
              imageClassName="h-48 sm:h-72 w-[1150px]"
              imgClassName="object-contain"
              sizes="1150px"
            />
          </div>

          {/* HoneyB Spotlight Card */}
          <div className="mt-10 sm:mt-14">
            <div className="relative w-full overflow-hidden rounded-2xl bg-white border border-neutral-200 min-h-[320px] sm:min-h-[380px]">
              <div
                className="absolute right-0 top-0 bottom-0 w-[55%] hidden lg:block"
                style={{
                  maskImage:
                    "linear-gradient(to right, transparent, black 100%)",
                  WebkitMaskImage:
                    "linear-gradient(to right, transparent, black 100%)",
                }}
              >
                <Image
                  src={honeyBSpotlight.image}
                  alt={honeyBSpotlight.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="relative z-10 flex flex-col justify-center p-8 sm:p-10 lg:py-9 lg:px-12 max-w-[520px] h-full">
                <div className="flex items-center gap-2.5 mb-5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={honeyBSpotlight.logo}
                    alt=""
                    className="object-contain max-h-16"
                  />
                </div>

                <h3 className="font-medium text-black text-[clamp(12px,3.5vw,18px)] tracking-[-0.5px] leading-[120%] mb-3">
                  {honeyBSpotlight.title}
                </h3>

                <p className="text-neutral-500 text-base leading-[128%] mb-8">
                  {honeyBSpotlight.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                  {honeyBSpotlight.deliverables.map((item) => (
                    <DeliverablePill
                      key={item.num}
                      num={item.num}
                      label={item.label}
                      className="bg-neutral-50/50"
                    />
                  ))}
                </div>

                <Link
                  href="/work"
                  className="group inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-700 transition-colors"
                >
                  <span>View Full Project</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </div>
        </InnerContainer>
      </OuterContainer>

      <div className="w-full line-dash-x" />
    </Section>
  );
}
