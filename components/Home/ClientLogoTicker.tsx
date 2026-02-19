"use client";

import Image from "next/image";
import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";

const clients = [
  { name: "TokenWorks", logo: "/logos-match-height/tokenworks.png" },
  { name: "Arch Network", logo: "/logos-match-height/arch-network.png" },
  { name: "Jinba", logo: "/logos-match-height/jinba.png" },
  { name: "Logical", logo: "/logos-match-height/logical.png" },
  { name: "Pyra", logo: "/logos-match-height/pyra.png" },
  { name: "Hildene", logo: "/logos-match-height/hildene.png" },
  { name: "HoneyB", logo: "/logos-match-height/honeyb.png" },
  { name: "Perena", logo: "/logos-match-height/perena.png" },
  { name: "Hashplay", logo: "/logos-match-height/hashplay.png" },
  { name: "Huch", logo: "/logos-match-height/huch.png" },
  { name: "Bold", logo: "/logos-match-height/bold.png" },
  { name: "Bump", logo: "/logos-match-height/bump.png" },
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

function LogoTrack() {
  return (
    <div className="flex items-center gap-16 sm:gap-24 shrink-0">
      {clients.map((client, index) => (
        <div
          key={index}
          className="flex-shrink-0 flex items-center justify-center h-12 sm:h-16 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
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

export default function ClientLogoTicker() {
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

          <div className="relative overflow-hidden">
            {/* Left fade */}
            <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-neutral-100 to-transparent z-10 pointer-events-none" />
            {/* Right fade */}
            <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-neutral-100 to-transparent z-10 pointer-events-none" />

            {/* CSS-animated ticker — GPU accelerated, no JS scroll */}
            <div className="flex w-max animate-logo-scroll" style={{ willChange: "transform", backfaceVisibility: "hidden" }}>
              <LogoTrack />
              <div className="pl-16 sm:pl-24">
                <LogoTrack />
              </div>
            </div>
          </div>
        </InnerContainer>
      </OuterContainer>
    </Section>
  );
}
