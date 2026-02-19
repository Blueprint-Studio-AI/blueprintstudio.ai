"use client";

import { useRef, useState, useEffect } from "react";
import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";

const clients = [
  { name: "TokenWorks", logo: "/logos-match-height/tokenworks.png", services: ["Digital Transformation", "Service Design", "Development", "Product Videos"] },
  { name: "Arch Network", logo: "/logos-match-height/arch-network.png", services: ["Service Design", "Branding", "Development", "Content Creation"] },
  { name: "Perena", logo: "/logos-match-height/perena.png", services: ["Landing Page", "Service Design", "Development"] },
  { name: "Jinba", logo: "/logos-match-height/jinba.png", services: ["Branding", "Landing Page", "Launch Video"] },
  { name: "Bump", logo: "/logos-match-height/bump.png", services: ["Branding", "Product Design", "UX"] },
  { name: "Logical", logo: "/logos-match-height/logical.png", services: ["Launch Video"] },
  { name: "Pyra", logo: "/logos-match-height/pyra.png", services: ["Launch Videos x3", "Content Creation"] },
  { name: "Hildene", logo: "/logos-match-height/hildene.png", services: ["Service Design", "Content Creation"] },
  { name: "HoneyB", logo: "/logos-match-height/honeyb.png", services: ["Product Design", "Landing Page", "Branding", "Development"] },
  { name: "Hashplay", logo: "/logos-match-height/hashplay.png", services: ["Landing Page", "Branding", "Development"] },
  { name: "Huch", logo: "/logos-match-height/huch.png", services: ["Branding", "Product Design", "Platform Development", "Pitch Deck"] },
  { name: "Bold", logo: "/logos-match-height/bold.png", services: ["Branding", "Platform UX", "Landing Page"] },
  { name: "Cona", logo: "/logos-match-height/cona.png", services: ["Service Design", "Content Creation"] },
  { name: "DAG", logo: "/logos-match-height/dag.png", services: ["Branding", "Merch"] },
  { name: "Bitfrost", logo: "/logos-match-height/bitfrost.png", services: ["Branding", "Pitch Deck"] },
  { name: "Autara", logo: "/logos-match-height/autara.png", services: ["Landing Page", "Branding"] },
  { name: "Pregame", logo: "/logos-match-height/pregame.png", services: ["Content Creation"] },
  { name: "Twelve", logo: "/logos-match-height/twelve.png", services: ["AI Automation", "Service Design", "Development", "UX Design"] },
  { name: "Reshift", logo: "/logos-match-height/reshift.png", services: ["AI Automation", "Development", "Service Design"] },
  { name: "PavePower", logo: "/logos-match-height/pavepower.png", services: ["Landing Page"] },
  { name: "BTC Summit Vegas", logo: "/logos-match-height/btc-summit-vegas.png", services: ["Content Creation", "Immersive Video", "Branding"] },
  { name: "Satoshi Bet", logo: "/logos-match-height/satoshibet.png", services: ["Landing Page", "Development"] },
  { name: "Panta", logo: "/logos-match-height/panta.png", services: ["Launch Video"] },
  { name: "Herth", logo: "/logos-match-height/herth.png", services: ["Product Design", "Development"] },
  { name: "Customer Compass", logo: "/logos-match-height/customer-compass.png", services: ["Service Design", "Customer Research"] },
  { name: "Answers From Me", logo: "/logos-match-height/answers-from-me.png", services: ["Service Design", "AI Automation", "Development"] },
  { name: "LivingIP", logo: "/logos-match-height/livingip.png", services: ["Product Design", "Branding"] },
  { name: "Uni", logo: "/logos-match-height/uni.png", services: ["Branding", "Landing Page"] },
];

function LogoTrack() {
  return (
    <div className="flex items-start gap-16 sm:gap-24 shrink-0">
      {clients.map((client, index) => (
        <div
          key={index}
          className="flex-shrink-0 relative group"
        >
          <div
            className="flex items-center justify-center h-12 sm:h-16 transition-all duration-500 grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100"
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
          {/* Services text — absolutely positioned, no layout impact */}
          <div className="absolute top-full left-0 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            {client.services.filter(Boolean).map((service, i) => (
              <p key={i} className="text-neutral-500 text-[11px] sm:text-xs leading-relaxed whitespace-nowrap">
                {service}
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function LogoTrackMobile() {
  return (
    <div className="flex items-center gap-16 shrink-0">
      {clients.map((client, index) => (
        <div key={index} className="flex-shrink-0 flex items-center justify-center h-12 grayscale opacity-50">
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
  const [isHovered, setIsHovered] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  // Smoothly transition speed by adjusting playbackRate-style via CSS variable
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const animations = el.getAnimations();
    animations.forEach((anim) => {
      const target = isHovered ? 0.3 : 1;
      const step = () => {
        const diff = target - anim.playbackRate;
        if (Math.abs(diff) < 0.02) {
          anim.playbackRate = target;
          return;
        }
        anim.playbackRate += diff * 0.1;
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, [isHovered]);

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
            Trusted by 30+ partners over 3 years
          </p>

          <div
            className="relative hidden sm:block"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Fade overlays — extend below parent to cover service text, z-30 above all content */}
            <div className="absolute left-0 top-0 w-24 bg-gradient-to-r from-neutral-100 to-transparent z-30 pointer-events-none" style={{ height: "calc(100% + 6rem)" }} />
            <div className="absolute right-0 top-0 w-24 bg-gradient-to-l from-neutral-100 to-transparent z-30 pointer-events-none" style={{ height: "calc(100% + 6rem)" }} />

            {/* overflowX clip — hides logos horizontally, allows service text to show below */}
            <div style={{ overflowX: "clip" }}>
              <div
                ref={trackRef}
                className="flex w-max animate-logo-scroll"
                style={{
                  willChange: "transform",
                  backfaceVisibility: "hidden",
                }}
              >
                <LogoTrack />
                <div className="pl-24">
                  <LogoTrack />
                </div>
              </div>
            </div>
          </div>

          {/* Mobile — no hover effects, just scroll */}
          <div className="relative sm:hidden">
            <div
              className="overflow-x-clip"
              style={{
                maskImage: "linear-gradient(to right, transparent, black 3rem, black calc(100% - 3rem), transparent)",
                WebkitMaskImage: "linear-gradient(to right, transparent, black 3rem, black calc(100% - 3rem), transparent)",
              }}
            >
              <div
                className="flex w-max animate-logo-scroll"
                style={{
                  willChange: "transform",
                  backfaceVisibility: "hidden",
                }}
              >
                <LogoTrackMobile />
                <div className="pl-16">
                  <LogoTrackMobile />
                </div>
              </div>
            </div>
          </div>
        </InnerContainer>
      </OuterContainer>
    </Section>
  );
}
