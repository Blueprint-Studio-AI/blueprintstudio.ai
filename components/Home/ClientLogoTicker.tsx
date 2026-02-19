"use client";

import { useState } from "react";
import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";

const clients = [
  { name: "TokenWorks", logo: "/logos-match-height/tokenworks.png", services: ["Product Videos", "Landing Page", "Client Portal"] },
  { name: "Arch Network", logo: "/logos-match-height/arch-network.png", services: [""] },
  { name: "Jinba", logo: "/logos-match-height/jinba.png", services: [""] },
  { name: "Logical", logo: "/logos-match-height/logical.png", services: [""] },
  { name: "Pyra", logo: "/logos-match-height/pyra.png", services: [""] },
  { name: "Hildene", logo: "/logos-match-height/hildene.png", services: [""] },
  { name: "HoneyB", logo: "/logos-match-height/honeyb.png", services: [""] },
  { name: "Perena", logo: "/logos-match-height/perena.png", services: [""] },
  { name: "Hashplay", logo: "/logos-match-height/hashplay.png", services: [""] },
  { name: "Huch", logo: "/logos-match-height/huch.png", services: [""] },
  { name: "Bold", logo: "/logos-match-height/bold.png", services: [""] },
  { name: "Bump", logo: "/logos-match-height/bump.png", services: [""] },
  { name: "Cona", logo: "/logos-match-height/cona.png", services: [""] },
  { name: "DAG", logo: "/logos-match-height/dag.png", services: [""] },
  { name: "Bitfrost", logo: "/logos-match-height/bitfrost.png", services: [""] },
  { name: "Autara", logo: "/logos-match-height/autara.png", services: [""] },
  { name: "Pregame", logo: "/logos-match-height/pregame.png", services: [""] },
  { name: "Twelve", logo: "/logos-match-height/twelve.png", services: [""] },
  { name: "Reshift", logo: "/logos-match-height/reshift.png", services: [""] },
  { name: "PavePower", logo: "/logos-match-height/pavepower.png", services: [""] },
  { name: "BTC Summit Vegas", logo: "/logos-match-height/btc-summit-vegas.png", services: [""] },
  { name: "Satoshi Bet", logo: "/logos-match-height/satoshibet.png", services: [""] },
  { name: "Panta", logo: "/logos-match-height/panta.png", services: [""] },
  { name: "Herth", logo: "/logos-match-height/herth.png", services: [""] },
  { name: "Customer Compass", logo: "/logos-match-height/customer-compass.png", services: [""] },
  { name: "Answers From Me", logo: "/logos-match-height/answers-from-me.png", services: [""] },
  { name: "LivingIP", logo: "/logos-match-height/livingip.png", services: [""] },
  { name: "Uni", logo: "/logos-match-height/uni.png", services: [""] },
];

function LogoTrack({ hovered }: { hovered: boolean }) {
  return (
    <div className="flex items-start gap-16 sm:gap-24 shrink-0">
      {clients.map((client, index) => (
        <div
          key={index}
          className="flex-shrink-0 flex flex-col items-start group"
        >
          <div
            className={`flex items-center justify-center h-12 sm:h-16 transition-all duration-500 ${
              hovered ? "" : "grayscale opacity-50"
            } group-hover:grayscale-0 group-hover:opacity-100`}
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
          {/* Services text — appears on hover */}
          <div className="overflow-hidden max-h-0 group-hover:max-h-12 transition-all duration-500 ease-out">
            <p className="text-neutral-400 text-[11px] sm:text-xs mt-2 whitespace-nowrap">
              {client.services.filter(Boolean).join(" · ") || "\u00A0"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ClientLogoTicker() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Section className="flex flex-col relative z-30 bg-neutral-100 overflow-hidden">
      {/* Solid vertical lines — z-20 to sit above fade overlays */}
      <div className="absolute inset-0 flex justify-center pointer-events-none px-2.5 sm:px-[60px] z-20">
        <div className="w-full flex-1 flex justify-center relative">
          <div className="absolute left-0 top-0 bottom-0 w-px bg-neutral-300" />
          <div className="absolute right-0 top-0 bottom-0 w-px bg-neutral-300" />
        </div>
      </div>

      <OuterContainer>
        <InnerContainer className="pt-16 sm:pt-20 lg:pt-24 pb-12 sm:pb-16 lg:pb-20 px-0 relative">
          <p
            className="text-neutral-500 uppercase text-center mb-8 sm:mb-10 cursor-default"
            style={{
              fontSize: "clamp(13px, 1.3vw, 16px)",
              letterSpacing: "-0.02em",
              fontWeight: 500,
            }}
          >
            Trusted by
          </p>

          <div
            className="relative overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Left fade */}
            <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-neutral-100 to-transparent z-10 pointer-events-none" />
            {/* Right fade */}
            <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-neutral-100 to-transparent z-10 pointer-events-none" />

            {/* CSS-animated ticker — slows on hover */}
            <div
              className="flex w-max"
              style={{
                willChange: "transform",
                backfaceVisibility: "hidden",
                animation: `logo-scroll 120s linear infinite`,
                animationPlayState: isHovered ? "running" : "running",
                animationDuration: isHovered ? "240s" : "120s",
              }}
            >
              <LogoTrack hovered={isHovered} />
              <div className="pl-16 sm:pl-24">
                <LogoTrack hovered={isHovered} />
              </div>
            </div>
          </div>
        </InnerContainer>
      </OuterContainer>
    </Section>
  );
}
