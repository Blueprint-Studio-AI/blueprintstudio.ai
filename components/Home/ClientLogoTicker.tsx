"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";

const clients = [
  { name: "TokenWorks", logo: "/logos/tokenworks-gray-logo.svg" },
  { name: "Arch", logo: "/logos/arch-gray-logo.svg" },
  // Add more client logos here as they come in
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

  // Repeat logos enough times to fill the scroll
  const repeatedClients = [
    ...clients, ...clients, ...clients, ...clients,
    ...clients, ...clients, ...clients, ...clients,
  ];

  return (
    <Section className="flex flex-col relative z-30 bg-neutral-100 overflow-hidden">
      {/* Vertical lines — matching PortfolioBento */}
      <div className="absolute inset-0 flex justify-center pointer-events-none px-2.5 sm:px-[60px]">
        <div className="w-full flex-1 flex justify-center relative">
          <div className="absolute left-0 top-0 bottom-0 line-dash-y custom:hidden" />
          <div className="absolute left-0 top-0 bottom-0 w-px bg-neutral-300 hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y custom:hidden" />
          <div className="absolute right-0 top-0 bottom-0 w-px bg-neutral-300 hidden custom:block" />
        </div>
      </div>

      <OuterContainer>
        <InnerContainer className="pt-16 sm:pt-20 lg:pt-24 pb-12 sm:pb-16 lg:pb-20 px-0 relative">
          {/* Inner dashed vertical lines on desktop */}
          <div className="absolute left-0 top-0 bottom-0 line-dash-y hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y hidden custom:block" />

          <p className="text-neutral-500 text-xs sm:text-sm tracking-widest uppercase text-center mb-8 sm:mb-10 cursor-default">
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
                  className="flex-shrink-0 flex items-center justify-center h-8 sm:h-10 opacity-50 hover:opacity-80 transition-opacity duration-300"
                >
                  <Image
                    src={client.logo}
                    alt={client.name}
                    width={120}
                    height={40}
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
