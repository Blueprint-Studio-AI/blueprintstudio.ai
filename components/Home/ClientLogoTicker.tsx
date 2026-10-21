"use client";

import { useEffect, useRef, useState } from "react";
import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import { OuterLines } from "./GridLines";

// Every logo sits on a 264px-tall canvas with its own padding, so they share one
// height and look the same weight. `w` is the canvas width, which reserves each
// logo's space before it loads.
const clients: { name: string; logo: string; w: number; scale?: number; services: string[] }[] = [
  { name: "TokenWorks", logo: "tokenworks", w: 636, services: ["Digital Transformation", "Service Design", "Development", "Product Videos"] },
  { name: "Arch Network", logo: "arch-network", w: 518, services: ["Service Design", "Branding", "Development", "Content Creation"] },
  { name: "Perena", logo: "perena", w: 682, services: ["Landing Page", "Service Design", "Development"] },
  { name: "Jinba", logo: "jinba", w: 608, services: ["Branding", "Landing Page", "Launch Video"] },
  { name: "Bump", logo: "bump", scale: 0.62, w: 264, services: ["Branding", "Product Design", "UX"] },
  { name: "Logical", logo: "logical", w: 580, services: ["Launch Video"] },
  { name: "Pyra", logo: "pyra", w: 476, services: ["Launch Videos x3", "Content Creation"] },
  { name: "Hildene", logo: "hildene", scale: 0.82, w: 428, services: ["Service Design", "Content Creation"] },
  { name: "HoneyB", logo: "honeyb", w: 630, services: ["Product Design", "Landing Page", "Branding", "Development"] },
  { name: "Hashplay", logo: "hashplay", w: 749, services: ["Landing Page", "Branding", "Development"] },
  { name: "Bold", logo: "bold", w: 540, services: ["Branding", "Platform UX", "Landing Page"] },
  { name: "Cona", logo: "cona", w: 426, services: ["Service Design", "Content Creation"] },
  { name: "DAG", logo: "dag", scale: 0.78, w: 503, services: ["Branding", "Merch"] },
  { name: "Bitfrost", logo: "bitfrost", w: 526, services: ["Branding", "Pitch Deck"] },
  { name: "Autara", logo: "autara", w: 525, services: ["Landing Page", "Branding"] },
  { name: "Pregame", logo: "pregame", w: 603, services: ["Content Creation"] },
  { name: "Twelve", logo: "twelve", w: 568, services: ["AI Automation", "Service Design", "Development", "UX Design"] },
  { name: "Reshift", logo: "reshift", w: 461, services: ["AI Automation", "Development", "Service Design"] },
  { name: "PavePower", logo: "pavepower", w: 609, services: ["Landing Page"] },
  { name: "BTC Summit Vegas", logo: "btc-summit-vegas", scale: 0.8, w: 370, services: ["Content Creation", "Immersive Video", "Branding"] },
  { name: "Satoshi Bet", logo: "satoshibet", w: 656, services: ["Landing Page", "Development"] },
  { name: "Panta", logo: "panta", w: 459, services: ["Launch Video"] },
  { name: "Herth", logo: "herth", w: 481, services: ["Product Design", "Development"] },
  { name: "Customer Compass", logo: "customer-compass", scale: 0.82, w: 471, services: ["Service Design", "Customer Research"] },
  { name: "Answers From Me", logo: "answers-from-me", w: 575, services: ["Service Design", "AI Automation", "Development"] },
  { name: "LivingIP", logo: "livingip", w: 603, services: ["Product Design", "Branding"] },
  { name: "Uni", logo: "uni", scale: 0.86, w: 356, services: ["Branding", "Landing Page"] },
];

// The second copy follows the first with the same gap, so -50% loops seamlessly.
// --logo-h is the shared canvas height; logos drawn on a filled block are scaled
// down so they don't outweigh the wordmarks.
function LogoList({ copy }: { copy?: boolean }) {
  return (
    <ul
      aria-hidden={copy || undefined}
      className="flex shrink-0 items-center gap-x-12 pr-12 [--logo-h:44px] sm:gap-x-[72px] sm:pr-[72px] sm:[--logo-h:60px]"
    >
      {clients.map((client) => (
        <li key={client.name} className="group relative flex h-[var(--logo-h)] shrink-0 items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/logos-match-height/${client.logo}.png`}
            alt={copy ? "" : client.name}
            width={client.w}
            height={264}
            decoding="async"
            draggable={false}
            className="w-auto select-none opacity-50 grayscale transition-[opacity,filter] duration-500 ease-out group-hover:opacity-100 group-hover:grayscale-0"
            style={{ height: `calc(var(--logo-h) * ${client.scale ?? 1})` }}
          />
          {/* What we made for them, under the logo on hover */}
          <p className="pointer-events-none absolute left-1/2 top-full hidden -translate-x-1/2 translate-y-1 whitespace-nowrap text-xs text-neutral-500 opacity-0 transition duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100 sm:block">
            {client.services.join(" · ")}
          </p>
        </li>
      ))}
    </ul>
  );
}

export default function ClientLogoTicker() {
  const [hovered, setHovered] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout>>();

  // Ease the marquee down to a third of its speed on hover, and back up after.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const target = hovered ? 0.3 : 1;
    let raf = 0;
    const step = () => {
      let done = true;
      // Re-read each frame: Safari drops stale animation references.
      for (const anim of el.getAnimations()) {
        const diff = target - anim.playbackRate;
        if (Math.abs(diff) < 0.02) anim.playbackRate = target;
        else {
          anim.playbackRate += diff * 0.1;
          done = false;
        }
      }
      if (!done) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [hovered]);

  useEffect(() => () => clearTimeout(hoverTimer.current), []);

  return (
    <Section className="relative flex flex-col overflow-hidden bg-neutral-50">
      <OuterLines />
      <div aria-hidden className="line-dash-x" />

      {/* The marquee spans the whole frame, not just the 1000px column */}
      <OuterContainer>
        <div className="relative w-full pb-8 pt-12 sm:pb-10 sm:pt-16">
          <p className="cursor-default text-center text-xs font-medium uppercase tracking-[0.02em] text-neutral-500 sm:text-[13px]">
            Trusted by 30+ partners over 3 years
          </p>

          <div
            className="mt-8 overflow-x-clip pb-8 sm:mt-10"
            style={{
              maskImage: "linear-gradient(to right, transparent, #000 10%, #000 90%, transparent)",
              WebkitMaskImage: "linear-gradient(to right, transparent, #000 10%, #000 90%, transparent)",
            }}
            onMouseEnter={() => {
              clearTimeout(hoverTimer.current);
              // A short delay, so a scroll that sweeps the cursor past doesn't trigger it.
              hoverTimer.current = setTimeout(() => setHovered(true), 80);
            }}
            onMouseLeave={() => {
              clearTimeout(hoverTimer.current);
              setHovered(false);
            }}
          >
            <div
              ref={trackRef}
              className="flex w-max animate-logo-scroll motion-reduce:animate-none"
              style={{ willChange: "transform", backfaceVisibility: "hidden" }}
            >
              <LogoList />
              <LogoList copy />
            </div>
          </div>
        </div>
      </OuterContainer>
      <div aria-hidden className="line-dash-x" />
    </Section>
  );
}
