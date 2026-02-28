"use client";

import { useEffect, useRef, useState } from "react";
import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import {
  Search,
  Palette,
  Layers,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Workstream {
  id: string;
  name: string;
  start: number;
  duration: number;
  icon: LucideIcon;
  description: string;
}

const workstreams: Workstream[] = [
  {
    id: "discovery",
    name: "Discovery",
    start: 0,
    duration: 1,
    icon: Search,
    description:
      "We learn your market, audience, and ambition. Define positioning and messaging that sets you apart.",
  },
  {
    id: "identity",
    name: "Identity",
    start: 0.5,
    duration: 1.5,
    icon: Palette,
    description:
      "Logo system, color palette, typography. We design the core elements that make you recognizable.",
  },
  {
    id: "system",
    name: "System",
    start: 1.5,
    duration: 1.5,
    icon: Layers,
    description:
      "Brand guidelines, social kit, email signature, and 2-3 applications of your choice. Everything you need to stay consistent.",
  },
  {
    id: "delivery",
    name: "Delivery",
    start: 2.5,
    duration: 0.5,
    icon: CheckCircle2,
    description:
      "You receive the full brand package plus AI prompts configured for your voice and guidelines — so you stay on-brand as you scale.",
  },
];

const weeks = [1, 2, 3];
const TOTAL_WEEKS = 3;

const MAX_CARD_WIDTH = 340;
const CARD_GAP = 12;

function getWeekLabel(ws: Workstream) {
  const startWeek = Math.floor(ws.start) + 1;
  const endWeek = Math.ceil(ws.start + ws.duration);
  return startWeek === endWeek
    ? `WEEK ${startWeek}`
    : `WEEK ${startWeek} - ${endWeek}`;
}

function WorkstreamCarouselCard({
  workstream: ws,
  isActive,
  cardWidth,
  onClick,
}: {
  workstream: Workstream;
  isActive: boolean;
  cardWidth: number;
  onClick?: () => void;
}) {
  const Icon = ws.icon;

  return (
    <div
      key={ws.id}
      onClick={onClick}
      className={`bg-white border border-neutral-200 shadow-sm flex-shrink-0 flex flex-col p-5 rounded-2xl cursor-pointer transition-all duration-500 ease-in-out ${
        isActive ? "" : "scale-90 opacity-50 hover:opacity-75"
      }`}
      style={{ width: cardWidth }}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-row items-center gap-3">
          <Icon className="w-5 h-5 text-neutral-800" />
          <p className="font-medium text-lg text-neutral-800 tracking-tight">
            {ws.name}
          </p>
        </div>
        <span className="text-xs font-medium text-neutral-500 uppercase">
          {getWeekLabel(ws)}
        </span>
      </div>

      <p className="mt-4 text-sm text-neutral-500 leading-[128%]">{ws.description}</p>
    </div>
  );
}

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
      aria-label="Navigate workstream"
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

function WorkstreamCarousel({
  activeWorkstream,
  setActiveWorkstream,
}: {
  activeWorkstream: number;
  setActiveWorkstream: (i: number) => void;
}) {
  const total = workstreams.length;
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(MAX_CARD_WIDTH);
  const isTransitioning = useRef(false);

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

  const navigate = (index: number) => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    setActiveWorkstream(index);
    setTimeout(() => { isTransitioning.current = false; }, 500);
  };

  const prev = () => navigate((activeWorkstream - 1 + total) % total);
  const next = () => navigate((activeWorkstream + 1) % total);

  return (
    <div className="mx-auto mt-8 flex flex-col gap-4">
      <div className="relative">
        <CircularButton icon={ChevronLeft} onClick={prev} className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-20" />
        <CircularButton icon={ChevronRight} onClick={next} className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-20" />

        <div ref={containerRef} className="overflow-hidden relative">
          <div className="absolute left-0 top-0 bottom-0 w-6 sm:w-24 bg-gradient-to-r from-neutral-50 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-6 sm:w-24 bg-gradient-to-l from-neutral-50 to-transparent z-10 pointer-events-none" />

          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              gap: `${CARD_GAP}px`,
              transform: `translateX(calc(50% - ${activeWorkstream * (cardWidth + CARD_GAP) + cardWidth / 2}px))`,
            }}
          >
            {workstreams.map((ws, i) => (
              <WorkstreamCarouselCard
                key={ws.id}
                workstream={ws}
                isActive={i === activeWorkstream}
                cardWidth={cardWidth}
                onClick={() => setActiveWorkstream(i)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex sm:hidden justify-center gap-3">
        <CircularButton icon={ChevronLeft} onClick={prev} />
        <CircularButton icon={ChevronRight} onClick={next} />
      </div>
    </div>
  );
}

function GanttBar({
  workstream,
  isVisible,
  isActive,
  onClick,
}: {
  workstream: Workstream;
  isVisible: boolean;
  isActive: boolean;
  onClick?: () => void;
}) {
  const startPercent = (workstream.start / TOTAL_WEEKS) * 100;
  const widthPercent = (workstream.duration / TOTAL_WEEKS) * 100;
  const Icon = workstream.icon;
  const isDelivery = workstream.id === "delivery";

  return (
    <div onClick={onClick} className="flex items-center gap-3 sm:gap-4 group">
      <div className={cn("text-neutral-500 w-32 sm:w-36 shrink-0 flex items-center gap-2", {
        "text-green-600": isDelivery && isActive,
        "text-green-500": isDelivery && !isActive,
        "text-neutral-800": isActive && !isDelivery,
      })}>
        <Icon
          className={cn(
            "hidden sm:block w-3.5 h-3.5 transition-colors",
            isDelivery ? "text-green-600 group-hover:text-green-500" : "group-hover:text-black"
          )}
        />
        <span
          className={`text-sm ${isDelivery ? "text-green-600 font-medium group-hover:text-green-500" : isActive ? "text-neutral-700" : "text-neutral-500"} group-hover:text-black transition-colors`}
        >
          {workstream.name}
        </span>
      </div>

      <div className="flex-1 h-8 relative">
        <div className="absolute inset-0 bg-neutral-100/80 rounded-[4px]" />

        <div
          className={`absolute top-1 bottom-1 rounded-[4px] transition-all duration-300 ease-out ${
            isDelivery
              ? isActive ? "bg-green-500 group-hover:bg-green-600" : "bg-green-400/40 group-hover:bg-green-500/40"
              : isActive ? "bg-neutral-700 group-hover:bg-neutral-600" : "bg-neutral-400/60 group-hover:bg-neutral-400"
          }`}
          style={{
            left: `${startPercent}%`,
            width: isVisible ? `${widthPercent}%` : "0%",
          }}
        />
      </div>
    </div>
  );
}

export default function ProcessSection() {
  const chartRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeWorkstream, setActiveWorkstream] = useState<number>(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (chartRef.current) {
      observer.observe(chartRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <Section className="flex flex-col relative z-20 bg-neutral-50 overflow-hidden">
      <div className="absolute inset-0 flex justify-center pointer-events-none px-2.5 sm:px-[60px]">
        <div className="w-full flex-1 flex justify-center relative">
          <div className="absolute left-0 top-0 bottom-0 line-dash-y custom:hidden" />
          <div className="absolute left-0 top-0 bottom-0 w-px bg-neutral-300 hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y custom:hidden" />
          <div className="absolute right-0 top-0 bottom-0 w-px bg-neutral-300 hidden custom:block" />
        </div>
      </div>

      <SectionHeader leftText="PROCESS" rightText="// 3 weeks" />

      <OuterContainer className="flex-1 flex items-center">
        <InnerContainer className="pt-8 sm:pt-12 lg:pt-16 pb-8 sm:pb-12 lg:pb-16 px-2.5 sm:px-6 relative">
          <div className="absolute left-0 top-0 bottom-0 line-dash-y hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y hidden custom:block" />

          <div className="text-center mb-10 sm:mb-14">
            <h2
              className="font-medium text-black cursor-default mb-3"
              style={{
                fontSize: "clamp(28px, 6vw, 48px)",
                lineHeight: "110%",
                letterSpacing: "-1.5px",
              }}
            >
              How It Works
            </h2>
            <p className="text-neutral-500 max-w-md mx-auto cursor-default text-sm sm:text-base">
              We don&apos;t work sequentially. Multiple workstreams run
              simultaneously, so you get everything in 3 weeks.
            </p>
          </div>

          <div ref={chartRef} className="max-w-3xl mx-auto">
            <div className="flex items-end gap-3 sm:gap-4 mb-2">
              <div className="w-32 sm:w-36 shrink-0" />
              <div className="flex-1 flex relative">
                {weeks.map((week) => (
                  <div key={week} className="flex-1 flex flex-col items-center">
                    <span className="text-[10px] sm:text-xs text-neutral-500 cursor-default">
                      {week}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {workstreams.map((ws, index) => (
                <GanttBar
                  key={ws.id}
                  workstream={ws}
                  isVisible={isVisible}
                  onClick={() => setActiveWorkstream(index)}
                  isActive={index === activeWorkstream}
                />
              ))}
            </div>

            <div className="flex items-center gap-3 sm:gap-4 mt-3">
              <div className="w-32 sm:w-36 shrink-0" />
              <div className="flex-1 h-px bg-neutral-200 relative">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute top-0 w-px h-1.5 bg-neutral-300"
                    style={{ left: `${(i / TOTAL_WEEKS) * 100}%` }}
                  />
                ))}
              </div>
            </div>
          </div>

          <WorkstreamCarousel
            activeWorkstream={activeWorkstream}
            setActiveWorkstream={setActiveWorkstream}
          />
        </InnerContainer>
      </OuterContainer>

      <div className="w-full line-dash-x" />
    </Section>
  );
}
