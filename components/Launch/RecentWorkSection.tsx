"use client";

import { useState } from "react";
import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

// Client logos for the carousel
const clientLogos = [
  { name: "Jinba", logo: "/launch/logos/jinba.svg" },
  { name: "Logical", logo: "/launch/logos/logical.svg" },
  { name: "Arch Network", logo: "/launch/logos/arch.svg" },
  { name: "Sidekick", logo: "/launch/logos/sidekick.svg" },
  { name: "Luminary", logo: "/launch/logos/luminary.svg" },
  { name: "Nebula", logo: "/launch/logos/nebula.svg" },
];

// Featured project
const featuredProject = {
  name: "HoneyB",
  tagline: "Modern payroll for contractors",
  description: "Complete brand identity, marketing website, and investor deck for their seed raise.",
  deliverables: ["Brand", "Website", "Deck"],
  image: "/launch/honeyb.png",
};

function LogoCarousel() {
  const [logoErrors, setLogoErrors] = useState<Record<string, boolean>>({});

  return (
    <div className="flex items-center justify-center gap-8 sm:gap-12 flex-wrap">
      {clientLogos.map((client) => (
        <div
          key={client.name}
          className="flex items-center justify-center h-8 opacity-40 hover:opacity-70 transition-opacity cursor-default"
        >
          {!logoErrors[client.name] ? (
            <Image
              src={client.logo}
              alt={client.name}
              width={100}
              height={32}
              className="h-6 sm:h-7 w-auto object-contain grayscale"
              onError={() =>
                setLogoErrors((prev) => ({ ...prev, [client.name]: true }))
              }
            />
          ) : (
            <span className="text-sm font-medium text-neutral-400">
              {client.name}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function FeaturedProject() {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-neutral-200 bg-gradient-to-br from-amber-50 to-orange-100">
          {!imageError ? (
            <Image
              src={featuredProject.image}
              alt={featuredProject.name}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-semibold text-neutral-300">
                {featuredProject.name}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col">
          <span className="text-xs text-neutral-400 uppercase tracking-wider mb-2">
            Featured Launch
          </span>
          <h3
            className="font-medium text-black mb-2"
            style={{ fontSize: "clamp(24px, 4vw, 32px)", letterSpacing: "-0.5px" }}
          >
            {featuredProject.name}
          </h3>
          <p className="text-neutral-500 mb-4">{featuredProject.tagline}</p>
          <p className="text-neutral-600 text-sm mb-6">
            {featuredProject.description}
          </p>

          {/* Deliverables */}
          <div className="flex flex-wrap gap-2">
            {featuredProject.deliverables.map((d) => (
              <span
                key={d}
                className="text-xs px-3 py-1.5 bg-neutral-200 text-neutral-600 rounded-full"
              >
                {d}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RecentWorkSection() {
  return (
    <Section
      id="portfolio"
      className="flex flex-col relative z-20 bg-neutral-100 overflow-hidden"
    >
      {/* Vertical lines */}
      <div className="absolute inset-0 flex justify-center pointer-events-none px-2.5 sm:px-[60px]">
        <div className="w-full flex-1 flex justify-center relative">
          <div className="absolute left-0 top-0 bottom-0 line-dash-y custom:hidden" />
          <div className="absolute left-0 top-0 bottom-0 w-px bg-neutral-300 hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y custom:hidden" />
          <div className="absolute right-0 top-0 bottom-0 w-px bg-neutral-300 hidden custom:block" />
        </div>
      </div>

      <SectionHeader leftText="PORTFOLIO" rightText="// recent launches" />

      <OuterContainer className="flex-1 flex items-center">
        <InnerContainer className="pt-8 sm:pt-12 lg:pt-16 pb-8 sm:pb-12 lg:pb-16 px-2.5 sm:px-6 relative">
          <div className="absolute left-0 top-0 bottom-0 line-dash-y hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y hidden custom:block" />

          {/* Section Title */}
          <div className="text-center mb-10 sm:mb-12">
            <h2
              className="font-medium text-black cursor-default"
              style={{
                fontSize: "clamp(32px, 6vw, 48px)",
                lineHeight: "110%",
                letterSpacing: "-1.5px",
              }}
            >
              Recent Launches
            </h2>
          </div>

          {/* Logo Carousel */}
          <div className="mb-12 sm:mb-16">
            <LogoCarousel />
          </div>

          {/* Featured Project */}
          <FeaturedProject />

          {/* View All */}
          <div className="flex justify-center mt-10 sm:mt-12">
            <Link
              href="/work"
              className="group inline-flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-black transition-colors"
            >
              <span>View all work</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </InnerContainer>
      </OuterContainer>

      <div className="w-full line-dash-x" />
    </Section>
  );
}
