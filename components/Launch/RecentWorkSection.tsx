"use client";

import { useState } from "react";
import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import DeliverablePill from "@/components/ui/DeliverablePill";
import ProjectSpotlightModal from "./ProjectSpotlightModal";

const clientLogos = [
  { name: "TokenWorks", logo: "/logos-match-height/tokenworks.png" },
  { name: "Arch Network", logo: "/logos-match-height/arch-network.png" },
  { name: "Perena", logo: "/logos-match-height/perena.png" },
  { name: "Jinba", logo: "/logos-match-height/jinba.png" },
  { name: "Bump", logo: "/logos-match-height/bump.png" },
  { name: "Logical", logo: "/logos-match-height/logical.png" },
  { name: "Pyra", logo: "/logos-match-height/pyra.png" },
  { name: "Hildene", logo: "/logos-match-height/hildene.png" },
  { name: "HoneyB", logo: "/logos-match-height/honeyb.png" },
  { name: "Hashplay", logo: "/logos-match-height/hashplay.png" },
  { name: "Huch", logo: "/logos-match-height/huch.png" },
  { name: "Bold", logo: "/logos-match-height/bold.png" },
  { name: "Cona", logo: "/logos-match-height/cona.png" },
  { name: "DAG", logo: "/logos-match-height/dag.png" },
  { name: "Bitfrost", logo: "/logos-match-height/bitfrost.png" },
  { name: "Autara", logo: "/logos-match-height/autara.png" },
  { name: "Pregame", logo: "/logos-match-height/pregame.png" },
  { name: "Twelve", logo: "/logos-match-height/twelve.png" },
  { name: "Reshift", logo: "/logos-match-height/reshift.png" },
  { name: "PavePower", logo: "/logos-match-height/pavepower.png" },
  { name: "BTC Summit Vegas", logo: "/logos-match-height/btc-summit-vegas.png" },
  { name: "Satoshi Bet", logo: "/logos-match-height/satoshibet.png" },
  { name: "Panta", logo: "/logos-match-height/panta.png" },
  { name: "Herth", logo: "/logos-match-height/herth.png" },
  { name: "Customer Compass", logo: "/logos-match-height/customer-compass.png" },
  { name: "Answers From Me", logo: "/logos-match-height/answers-from-me.png" },
  { name: "LivingIP", logo: "/logos-match-height/livingip.png" },
  { name: "Uni", logo: "/logos-match-height/uni.png" },
];

const featuredProject = {
  name: "HoneyB",
  logo: "/logos-match-height/honeyb.png",
  title: "Bitcoin yield platform",
  description:
    "From blank slate to market-ready in one package. We built HoneyB\u2019s entire brand presence as a single cohesive system.",
  deliverables: [
    { num: "01", label: "Brand" },
    { num: "02", label: "Website" },
    { num: "03", label: "Deck" },
  ],
  image: "/launch-assets/honeyb-spotlight/spotlight-background.png",
  href: "/work",
};

function LogoTrack() {
  return (
    <div className="flex items-center gap-16 sm:gap-24 shrink-0">
      {clientLogos.map((client, i) => (
        <div
          key={i}
          className="flex-shrink-0 flex items-center justify-center h-12 sm:h-16 grayscale"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={client.logo}
            alt={client.name}
            loading="eager"
            decoding="async"
            className="h-full w-auto object-contain"
          />
        </div>
      ))}
    </div>
  );
}

function LogoCarousel() {
  return (
    <div className="relative">
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-neutral-100 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-neutral-100 to-transparent z-10 pointer-events-none" />
      <div className="overflow-x-clip">
        <div
          className="flex w-max animate-logo-scroll will-change-transform backface-hidden"
        >
          <LogoTrack />
          <div className="pl-16 sm:pl-24">
            <LogoTrack />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeaturedProject({ onViewProject }: { onViewProject: () => void }) {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-white border border-neutral-200 min-h-[320px] sm:min-h-[380px]">
      <div
        className="absolute right-0 top-0 bottom-0 w-[55%] hidden lg:block"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 100%)",
        }}
      >
        <Image
          src={featuredProject.image}
          alt={featuredProject.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="relative z-10 flex flex-col justify-center p-8 sm:p-10 lg:py-9 lg:px-12 max-w-[520px] h-full">
        <div className="flex items-center gap-2.5 mb-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={featuredProject.logo}
            alt=""
            className="object-contain max-h-16"
          />
        </div>

        <h3 className="font-medium text-black text-[clamp(12px,3.5vw,18px)] tracking-[-0.5px] leading-[120%] mb-3">
          {featuredProject.title}
        </h3>

        <p className="text-neutral-500 text-base leading-[128%] mb-8">
          {featuredProject.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-8">
          {featuredProject.deliverables.map((item) => (
            <DeliverablePill key={item.num} num={item.num} label={item.label} className="bg-neutral-50/50" />
          ))}
        </div>

        <button
          onClick={onViewProject}
          className="group inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-700 transition-colors cursor-pointer"
        >
          <span>View Full Project</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
}

export default function RecentWorkSection() {
  const [modalOpen, setModalOpen] = useState(false);

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
              className="font-medium text-black cursor-default text-[clamp(32px,6vw,48px)] leading-[110%] tracking-[-1.5px]"
            >
              Recent Launches
            </h2>
          </div>

          {/* Logo Carousel */}
          <div className="mb-12 sm:mb-16">
            <LogoCarousel />
          </div>

          {/* Featured Project */}
          <FeaturedProject onViewProject={() => setModalOpen(true)} />
        </InnerContainer>
      </OuterContainer>

      <div className="w-full line-dash-x" />

      <ProjectSpotlightModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        project={featuredProject}
      />
    </Section>
  );
}
