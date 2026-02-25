"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import {
  Rocket,
  Palette,
  Globe,
  Presentation,
  Play,
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
};

// Workstream data for Gantt visualization
const workstreams: Workstream[] = [
  {
    id: "kickoff",
    name: "Kickoff",
    start: 0,
    duration: 0.5,
    icon: Rocket,
    description: "Discovery session to align on your business model, audience, and goals. We meet your team and establish how we'll collaborate.",
  },
  {
    id: "brand",
    name: "Brand Identity",
    start: 0.5,
    duration: 2,
    icon: Palette,
    description: "We explore multiple creative directions and iterate based on your feedback until we land the perfect visual identity.",
  },
  {
    id: "website",
    name: "Website",
    start: 1.5,
    duration: 3.5,
    icon: Globe,
    description: "Design and development run in parallel. We build, test, and refine your site while other workstreams are in motion.",
  },
  {
    id: "deck",
    name: "Pitch Deck",
    start: 2,
    duration: 2.5,
    icon: Presentation,
    description: "We craft your narrative and visual story — slides that communicate your vision clearly to investors and partners.",
  },
  {
    id: "video",
    name: "Launch Video",
    start: 3.5,
    duration: 2,
    icon: Play,
    description: "Professional video production that captures your brand story and drives engagement on launch day.",
  },
  {
    id: "launch",
    name: "Launch",
    start: 5.5,
    duration: 0.5,
    icon: CheckCircle2,
    description: "Final QA, deployment, and handoff. Everything ships together — website, brand, deck, and video.",
  },
];

const weeks = [1, 2, 3, 4, 5, 6];

const CARD_WIDTH = 340;
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
  onClick
}: {
  workstream: Workstream;
  isActive: boolean;
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
      style={{ width: CARD_WIDTH }}
    >
      <div className="flex items-center justify-between">
        <div
        className={'p-2 rounded-xl border border-neutral-300 bg-neutral-50'}
        >
          <Icon className={`w-4 h-4 text-neutral-800`} />
        </div>
        <span className="text-xs font-medium text-neutral-500 uppercase">
          {getWeekLabel(ws)}
        </span>
      </div>
      <p className={`mt-3 font-medium text-lg text-neutral-800`}>
        {ws.name}
      </p>
      <p className="mt-1 text-sm text-neutral-500 leading-[128%]">{ws.description}</p>
    </div>
  );
}

function CircularButton({
  onClick,
  disabled,
  icon: Icon,
  className,
}: {
  onClick?: () => void;
  disabled?: boolean;
  icon: LucideIcon;
  className?: string;
}) {
  return (
    
     <button
        onClick={onClick}
        disabled={disabled}
        aria-label="Next workstream"
        className={cn(className, "shrink-0 w-14 h-14 flex items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-500 hover:text-black hover:border-neutral-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all")}
        style={{
          boxShadow: "0 2px 8.7px 0 rgba(0, 0, 0, 0.10)",
        }}
      >
        <Icon className="w-8 h-8" color="black" />
      </button>
  )
}

// Number of clones on each side of the real items.
// Must be >= 2 so the card adjacent to the active clone is always filled.
const EXTRA = 2;

function WorkstreamCarousel({
  workstreams,
  activeWorkstream,
  setActiveWorkstream,
}: {
  workstreams: Workstream[];
  activeWorkstream: number;
  setActiveWorkstream: (i: number) => void;
}) {
  const total = workstreams.length;
  // Layout: [EXTRA left clones | real items | EXTRA right clones]
  // Real item at activeWorkstream lives at internalIndex = activeWorkstream + EXTRA
  const [internalIndex, setInternalIndex] = useState(activeWorkstream + EXTRA);
  const trackRef = useRef<HTMLDivElement>(null);
  const isWrapping = useRef(false);

  // Sync when Gantt bar (or other external source) changes activeWorkstream
  useEffect(() => {
    if (!isWrapping.current) {
      setInternalIndex(activeWorkstream + EXTRA);
    }
  }, [activeWorkstream]);

  const snapWithoutTransition = (newIndex: number, newActive: number) => {
    const track = trackRef.current;
    if (!track) return;
    track.style.transitionDuration = "0ms";
    flushSync(() => {
      setInternalIndex(newIndex);
      setActiveWorkstream(newActive);
    });
    requestAnimationFrame(() => {
      if (track) track.style.transitionDuration = "";
      isWrapping.current = false;
    });
  };

  const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    // Ignore bubbled events from child elements (cards have transition-all which fires its own events)
    if (e.target !== trackRef.current || e.propertyName !== "transform") return;
    if (internalIndex < EXTRA) {
      // Entered left clone zone — jump to the corresponding real position
      snapWithoutTransition(internalIndex + total, activeWorkstream);
    } else if (internalIndex >= EXTRA + total) {
      // Entered right clone zone — jump to the corresponding real position
      snapWithoutTransition(internalIndex - total, activeWorkstream);
    } else {
      isWrapping.current = false;
    }
  };

  const prev = () => {
    if (isWrapping.current) return;
    isWrapping.current = true;
    setInternalIndex((i) => i - 1);
    setActiveWorkstream((activeWorkstream - 1 + total) % total);
  };

  const next = () => {
    if (isWrapping.current) return;
    isWrapping.current = true;
    setInternalIndex((i) => i + 1);
    setActiveWorkstream((activeWorkstream + 1) % total);
  };

  // [last EXTRA items, ...real items, first EXTRA items]
  const items = [
    ...workstreams.slice(-EXTRA),
    ...workstreams,
    ...workstreams.slice(0, EXTRA),
  ];

  return (
    <div className="relative mx-auto mt-8">
      <CircularButton icon={ChevronLeft} onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-20" />
      <CircularButton icon={ChevronRight} onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-20" />

      <div className="overflow-hidden relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-neutral-50 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-neutral-50 to-transparent z-10 pointer-events-none" />

        <div
          ref={trackRef}
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            gap: `${CARD_GAP}px`,
            transform: `translateX(calc(50% - ${internalIndex * (CARD_WIDTH + CARD_GAP) + CARD_WIDTH / 2}px))`,
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {items.map((ws, i) => (
            <WorkstreamCarouselCard
              key={`${ws.id}-${i}`}
              workstream={ws}
              isActive={ws.id === workstreams[activeWorkstream].id}
              onClick={
                i < EXTRA ? () => prev() :
                i >= EXTRA + total ? () => next() :
                () => setActiveWorkstream(i - EXTRA)
              }
            />
          ))}
        </div>
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
  const startPercent = (workstream.start / 6) * 100;
  const widthPercent = (workstream.duration / 6) * 100;
  const Icon = workstream.icon;
  const isLaunch = workstream.id === "launch";

  return (
    <div
    onClick={onClick}
    className="flex items-center gap-3 sm:gap-4 group">
      {/* Label with icon */}
      <div className="w-32 sm:w-36 shrink-0 flex items-center gap-2">
        <Icon
          className={`w-3.5 h-3.5 ${isLaunch ? "text-green-500" : "text-neutral-500"} group-hover:text-neutral-600 transition-colors`}
        />
        <span
          className={`text-sm ${isLaunch ? "text-green-600 font-medium" : "text-neutral-500"} group-hover:text-black transition-colors`}
        >
          {workstream.name}
        </span>
      </div>

      {/* Bar Container */}
      <div className="flex-1 h-8 relative">
        {/* Track */}
        <div className="absolute inset-0 bg-neutral-100/80 rounded-[4px]" />

        {/* Bar - animates width on scroll */}
        <div
          className={`absolute top-1 bottom-1 rounded-[4px] transition-all duration-300 ease-out ${
            isLaunch
              ? isActive ? "bg-green-500 group-hover:bg-green-600" : "bg-green-400/40 group-hover:bg-green-500/40"
              : isActive ? "bg-neutral-700 group-hover:bg-neutral-600" : "bg-neutral-400/60 group-hover:bg-neutral-400"
          }`}
          style={{
            left: `${startPercent}%`,
            width: isVisible ? `${widthPercent}%` : "0%",
            //transitionDelay: `${index * 100}ms`,
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
      {/* Vertical lines */}
      <div className="absolute inset-0 flex justify-center pointer-events-none px-2.5 sm:px-[60px]">
        <div className="w-full flex-1 flex justify-center relative">
          <div className="absolute left-0 top-0 bottom-0 line-dash-y custom:hidden" />
          <div className="absolute left-0 top-0 bottom-0 w-px bg-neutral-300 hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y custom:hidden" />
          <div className="absolute right-0 top-0 bottom-0 w-px bg-neutral-300 hidden custom:block" />
        </div>
      </div>

      <SectionHeader leftText="PROCESS" rightText="// 6 weeks" />

      <OuterContainer className="flex-1 flex items-center">
        <InnerContainer className="pt-8 sm:pt-12 lg:pt-16 pb-8 sm:pb-12 lg:pb-16 px-2.5 sm:px-6 relative">
          <div className="absolute left-0 top-0 bottom-0 line-dash-y hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y hidden custom:block" />

          {/* Section Title */}
          <div className="text-center mb-10 sm:mb-14">
            <h2
              className="font-medium text-black cursor-default mb-3"
              style={{
                fontSize: "clamp(32px, 6vw, 48px)",
                lineHeight: "110%",
                letterSpacing: "-1.5px",
              }}
            >
              Everything runs
              <br />
              in parallel.
            </h2>
            <p className="text-neutral-500 max-w-md mx-auto cursor-default">
              We don&apos;t work sequentially. Multiple workstreams run
              simultaneously, so you get everything in 6 weeks.
            </p>
          </div>

          {/* Gantt Chart */}
          <div ref={chartRef} className="max-w-3xl mx-auto">
            {/* Week Headers with tick marks */}
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

            {/* Gantt Bars */}
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

            {/* Timeline baseline */}
            <div className="flex items-center gap-3 sm:gap-4 mt-3">
              <div className="w-32 sm:w-36 shrink-0" />
              <div className="flex-1 h-px bg-neutral-200 relative">
                {/* Fine tick marks */}
                {[...Array(7)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute top-0 w-px h-1.5 bg-neutral-300"
                    style={{ left: `${(i / 6) * 100}%` }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Workstream detail carousel */}
          <WorkstreamCarousel
            workstreams={workstreams}
            activeWorkstream={activeWorkstream}
            setActiveWorkstream={setActiveWorkstream}
          />
        </InnerContainer>
      </OuterContainer>

      <div className="w-full line-dash-x" />
    </Section>
  );
}
