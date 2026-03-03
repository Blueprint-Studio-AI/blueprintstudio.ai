"use client";

import { useState, useEffect, useRef } from "react";
import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import Image from "next/image";
import { ChevronLeft, ChevronRight, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const BWB = "/brand-assets/brands-weve-built";

const brandProjects = [
  { id: "uni", name: "UNI", image: `${BWB}/uni_brands-we-built.png` },
  { id: "autara", name: "Autara", image: `${BWB}/autara_brands-we-built.png` },
  { id: "huch", name: "Huch", image: `${BWB}/huch_brands-we-built.png` },
  { id: "honeyb", name: "HoneyB", image: `${BWB}/honeyb_brands-we-built.png` },
  { id: "breeze", name: "Breeze", image: `${BWB}/breeze_brands-we-built.png` },
];

const MAX_CARD_WIDTH = 480;
const CARD_GAP = -120;

function CircularButton({
  onClick,
  icon: Icon,
  className,
}: {
  onClick?: () => void;
  icon: LucideIcon;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label="Navigate brand"
      className={cn(
        "shrink-0 w-10 h-10 flex items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-500 hover:text-black hover:border-neutral-400 transition-all duration-300",
        className
      )}
      style={{
        boxShadow: "0 2px 8.7px 0 rgba(0, 0, 0, 0.10)",
      }}
    >
      <Icon className="w-5 h-5" color="black" />
    </button>
  );
}

export default function RecentWorkSection() {
  const total = brandProjects.length;
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(MAX_CARD_WIDTH);
  const [position, setPosition] = useState(total);
  const [skipTransition, setSkipTransition] = useState(false);
  const isTransitioning = useRef(false);

  const activeIndex = ((position % total) + total) % total;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      const isMobile = w < 640;
      setCardWidth(Math.min(MAX_CARD_WIDTH, w - (isMobile ? 48 : 120)));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const navigate = (newPos: number) => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    setPosition(newPos);
    setTimeout(() => {
      const realIndex = ((newPos % total) + total) % total;
      const middlePos = realIndex + total;
      if (newPos !== middlePos) {
        setSkipTransition(true);
        setPosition(middlePos);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setSkipTransition(false);
            isTransitioning.current = false;
          });
        });
      } else {
        isTransitioning.current = false;
      }
    }, 500);
  };

  const prev = () => navigate(position - 1);
  const next = () => navigate(position + 1);

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

      <SectionHeader leftText="PORTFOLIO" rightText="// recent brands" />

      <OuterContainer className="flex-1 flex items-center">
        <InnerContainer className="pt-8 sm:pt-12 lg:pt-16 pb-8 sm:pb-12 lg:pb-16 px-2.5 sm:px-6 relative">
          <div className="absolute left-0 top-0 bottom-0 line-dash-y hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y hidden custom:block" />

          <div className="text-center mb-4 sm:mb-6">
            <h2 className="font-medium text-black cursor-default text-[clamp(32px,6vw,48px)] leading-[110%] tracking-[-1.5px]">
              Brands we&apos;ve<br/>built&nbsp;to&nbsp;last
            </h2>
            <p className="text-neutral-500 mt-3 cursor-default">
              Each delivered in 3 weeks or less
            </p>
          </div>

          <div className="mx-auto flex flex-col gap-4">
            <div className="relative">
              <CircularButton icon={ChevronLeft} onClick={prev} className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-20" />
              <CircularButton icon={ChevronRight} onClick={next} className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-20" />

              <div ref={containerRef} className="overflow-x-clip relative py-6">
                <div className="absolute left-0 top-0 bottom-0 w-6 sm:w-24 bg-gradient-to-r from-neutral-100 to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-6 sm:w-24 bg-gradient-to-l from-neutral-100 to-transparent z-10 pointer-events-none" />

                <div
                  ref={trackRef}
                  className={`flex ${skipTransition ? "" : "transition-transform duration-500 ease-in-out"}`}
                  style={{
                    transform: `translateX(calc(50% - ${position * (cardWidth + CARD_GAP) + cardWidth / 2}px))`,
                  }}
                >
                  {[...brandProjects, ...brandProjects, ...brandProjects].map((project, i) => {
                    const isActive = i === position;
                    return (
                      <div
                        key={`${project.id}-${i}`}
                        onClick={() => navigate(i)}
                        className={`flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer drop-shadow-xl ${
                          skipTransition ? "" : "transition-all duration-500 ease-in-out"
                        } ${isActive ? "" : "scale-[65%] opacity-50 blur-[2px] hover:opacity-75"}`}
                        style={{ width: cardWidth, marginRight: i < total * 3 - 1 ? `${CARD_GAP}px` : 0 }}
                      >
                        <div className="relative w-full aspect-[4/3]">
                          <Image
                            src={project.image}
                            alt={project.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 512px"
                            className="object-contain"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex sm:hidden justify-center gap-3">
              <CircularButton icon={ChevronLeft} onClick={prev} />
              <CircularButton icon={ChevronRight} onClick={next} />
            </div>

            <div className="flex items-center justify-center gap-2">
              {brandProjects.map((_, i) => (
                <button
                  key={i}
                  onClick={() => navigate(i + total)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors cursor-pointer ${
                    i === activeIndex ? "bg-neutral-900" : "bg-neutral-300 hover:bg-neutral-400"
                  }`}
                  aria-label={`View ${brandProjects[i].name}`}
                />
              ))}
            </div>
          </div>
        </InnerContainer>
      </OuterContainer>

      <div className="w-full line-dash-x" />
    </Section>
  );
}
