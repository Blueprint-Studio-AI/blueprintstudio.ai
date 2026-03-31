"use client";

import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import MarqueeGalleryRow from "@/components/ui/MarqueeGalleryRow";
import DeliverablePill from "@/components/ui/DeliverablePill";
import { brandPortfolio } from "@/data/brandPortfolio";

const allGalleryImages = brandPortfolio.flatMap((b) => b.gallery);

function BrandSpotlightCard({
  brand,
}: {
  brand: (typeof brandPortfolio)[number];
}) {
  return (
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
          src={brand.backgroundImage}
          alt={brand.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="relative z-10 flex flex-col justify-center p-8 sm:p-10 lg:py-9 lg:px-12 max-w-[520px] h-full">
        <div className="flex items-center gap-2.5 mb-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={brand.logoMark}
            alt=""
            className="object-contain max-h-16"
          />
        </div>

        <h3 className="font-medium text-black text-[clamp(12px,3.5vw,18px)] tracking-[-0.5px] leading-[120%] mb-3">
          {brand.tagline}
        </h3>

        <p className="text-neutral-500 text-base leading-[128%] mb-8">
          {brand.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-8">
          {brand.deliverables.map((item) => (
            <DeliverablePill
              key={item.num}
              num={item.num}
              label={item.label}
              className="bg-neutral-50/50"
            />
          ))}
        </div>

        <Link
          href="/work/brand-identity"
          className="group inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-700 transition-colors"
        >
          <span>View Full Project</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}

export default function PortfolioSection() {
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

          {/* Brand Spotlight Cards */}
          <div className="flex flex-col gap-6 sm:gap-8">
            {brandPortfolio.map((brand) => (
              <BrandSpotlightCard key={brand.id} brand={brand} />
            ))}
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
        </InnerContainer>
      </OuterContainer>

      <div className="w-full line-dash-x" />
    </Section>
  );
}
