"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";

const clients = [
  { name: "TokenWorks", logo: "/logos/tokenworks.png" },
  { name: "Arch Network", logo: "/logos/arch-network.png" },
  { name: "Jinba", logo: "/logos/jinba.png" },
  { name: "Logical", logo: "/logos/Logical.png" },
  { name: "Pyra", logo: "/logos/pyra.png" },
  { name: "Hildene", logo: "/logos/hildene.png" },
  { name: "HoneyB", logo: "/logos/HoneyB-Logo.png" },
  { name: "Perena", logo: "/logos/perena.png" },
  { name: "Hashplay", logo: "/logos/hashplay.png" },
  { name: "Huch", logo: "/logos/huch.png" },
  { name: "Bold", logo: "/logos/bold.png" },
  { name: "Bump", logo: "/logos/bump.png" },
  { name: "Cona", logo: "/logos/cona.png" },
  { name: "DAG", logo: "/logos/dag.png" },
  { name: "Bitfrost", logo: "/logos/bitfrost.png" },
  { name: "Autara", logo: "/logos/autara.png" },
  { name: "Pregame", logo: "/logos/pregame.png" },
  { name: "Twelve", logo: "/logos/twelve.png" },
  { name: "Reshift", logo: "/logos/reshift.png" },
  { name: "PavePower", logo: "/logos/pavepower.png" },
  { name: "BTC Vegas", logo: "/logos/btc-vegas.png" },
  { name: "Satoshi Bet", logo: "/logos/satoshi-bet.png" },
  { name: "Panta", logo: "/logos/panta.png" },
  { name: "Herth", logo: "/logos/herth.png" },
  { name: "Customer Compass", logo: "/logos/customer-compass.png" },
  { name: "Answers From Me", logo: "/logos/answers-from-me.png" },
  { name: "LivingIP", logo: "/logos/LivingIP.png" },
  { name: "Uni", logo: "/logos/uni.png" },
];

export default function ClientLogoTicker() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollPosition = 0;
    const speed = 0.3;

    const animate = () => {
      scrollPosition += speed;

      const halfWidth = scrollContainer.scrollWidth / 2;
      if (scrollPosition >= halfWidth) {
        scrollPosition = 0;
      }

      scrollContainer.scrollLeft = scrollPosition;
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Duplicate for infinite scroll effect
  const repeatedClients = [...clients, ...clients];

  return (
    <Section className="flex flex-col relative z-30 bg-neutral-100 overflow-hidden">
      {/* Solid vertical lines — matching PortfolioBento */}
      <div className="absolute inset-0 flex justify-center pointer-events-none px-2.5 sm:px-[60px]">
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

          <div className="relative">
            {/* Left fade */}
            <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-neutral-100 to-transparent z-10 pointer-events-none" />
            {/* Right fade */}
            <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-neutral-100 to-transparent z-10 pointer-events-none" />

            <div
              ref={scrollRef}
              className="flex items-center gap-12 sm:gap-20 overflow-x-hidden hide-scrollbar"
              style={{ scrollBehavior: "auto" }}
            >
              {repeatedClients.map((client, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 flex items-center justify-center h-10 sm:h-14 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                >
                  <Image
                    src={client.logo}
                    alt={client.name}
                    width={160}
                    height={56}
                    className="h-full w-auto object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </InnerContainer>
      </OuterContainer>
    </Section>
  );
}
