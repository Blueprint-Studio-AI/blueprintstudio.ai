"use client";

import { useEffect, useRef, useState } from "react";
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
} from "lucide-react";

// Workstream data for Gantt visualization
const workstreams = [
  {
    id: "kickoff",
    name: "Kickoff",
    start: 0,
    duration: 0.5,
    icon: Rocket,
  },
  {
    id: "brand",
    name: "Brand Identity",
    start: 0.5,
    duration: 2,
    icon: Palette,
  },
  {
    id: "website",
    name: "Website",
    start: 1.5,
    duration: 3.5,
    icon: Globe,
  },
  {
    id: "deck",
    name: "Pitch Deck",
    start: 2,
    duration: 2.5,
    icon: Presentation,
  },
  {
    id: "video",
    name: "Launch Video",
    start: 3.5,
    duration: 2,
    icon: Play,
  },
  {
    id: "launch",
    name: "Launch",
    start: 5.5,
    duration: 0.5,
    icon: CheckCircle2,
  },
];

const weeks = [1, 2, 3, 4, 5, 6];

function GanttBar({
  workstream,
  index,
  isVisible,
}: {
  workstream: (typeof workstreams)[0];
  index: number;
  isVisible: boolean;
}) {
  const startPercent = (workstream.start / 6) * 100;
  const widthPercent = (workstream.duration / 6) * 100;
  const Icon = workstream.icon;
  const isLaunch = workstream.id === "launch";

  return (
    <div className="flex items-center gap-3 sm:gap-4 group">
      {/* Label with icon */}
      <div className="w-32 sm:w-36 shrink-0 flex items-center gap-2">
        <Icon
          className={`w-3.5 h-3.5 ${isLaunch ? "text-green-500" : "text-neutral-400"} group-hover:text-neutral-600 transition-colors`}
        />
        <span
          className={`text-sm ${isLaunch ? "text-green-600 font-medium" : "text-neutral-500"} group-hover:text-black transition-colors`}
        >
          {workstream.name}
        </span>
      </div>

      {/* Bar Container */}
      <div className="flex-1 h-7 relative">
        {/* Track */}
        <div className="absolute inset-0 bg-neutral-100/80 rounded-sm" />

        {/* Bar - animates width on scroll */}
        <div
          className={`absolute top-1 bottom-1 rounded-sm transition-all duration-700 ease-out ${
            isLaunch
              ? "bg-green-500 group-hover:bg-green-600"
              : "bg-neutral-700 group-hover:bg-neutral-600"
          }`}
          style={{
            left: `${startPercent}%`,
            width: isVisible ? `${widthPercent}%` : "0%",
            transitionDelay: `${index * 100}ms`,
          }}
        />
      </div>
    </div>
  );
}

export default function ProcessSection() {
  const chartRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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
                    <span className="text-[10px] sm:text-xs text-neutral-400 cursor-default font-mono">
                      {week}
                    </span>
                    <div className="w-px h-2 bg-neutral-300 mt-1" />
                  </div>
                ))}
                {/* End tick */}
                <div className="absolute right-0 flex flex-col items-center">
                  <div className="w-px h-3 bg-neutral-400" />
                </div>
              </div>
            </div>

            {/* Gantt Bars */}
            <div className="space-y-1.5">
              {workstreams.map((ws, index) => (
                <GanttBar
                  key={ws.id}
                  workstream={ws}
                  index={index}
                  isVisible={isVisible}
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

          {/* Launch celebration */}
          <div className="flex items-center justify-center gap-2 mt-12 cursor-default">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span className="text-neutral-600">
              <span className="font-medium text-black">Week 6:</span> You launch
              with everything.
            </span>
          </div>
        </InnerContainer>
      </OuterContainer>

      <div className="w-full line-dash-x" />
    </Section>
  );
}
