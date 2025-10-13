"use client";
import { useState } from "react";
import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import AchievementCard from "./AchievementCard";

const achievements = [
  {
    id: 1,
    title: "Taste",
    description: "Seasoned eyes strip noise into clarity until there's a single, intuitive idea."
  },
  {
    id: 2,
    title: "Partnership",
    description: "Flat monthly, one queue; we earn the next month by moving the needle."
  },
  {
    id: 3,
    title: "Embedded",
    description: "US-based, in your tools and time zone; same-day decisions, no lag."
  }
];

export default function Achievements() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  return (
    <Section className="flex flex-col relative z-20 bg-neutral-100 overflow-hidden">
      {/* Artificial vertical lines to match the background */}
      <div className="absolute inset-0 flex justify-center pointer-events-none px-2.5 sm:px-[60px]">
        <div className="w-full flex-1 flex justify-center relative">
          {/* Left dashed vertical line (mobile) / solid line (desktop) */}
          <div className="absolute left-0 top-0 bottom-0 line-dash-y custom:hidden" />
          <div className="absolute left-0 top-0 bottom-0 w-px bg-neutral-300 hidden custom:block" />
          
          {/* Right dashed vertical line (mobile) / solid line (desktop) */}
          <div className="absolute right-0 top-0 bottom-0 line-dash-y custom:hidden" />
          <div className="absolute right-0 top-0 bottom-0 w-px bg-neutral-300 hidden custom:block" />
        </div>
      </div>

      <SectionHeader leftText="The Blueprint" rightText="Items 1 ⋯ 3" />

      {/* Main Content */}
      <OuterContainer className="flex-1 flex items-center">
        <InnerContainer className="pt-8 sm:pt-12 lg:pt-16 pb-8 sm:pb-12 lg:pb-16 px-2.5 sm:px-6 relative">
          {/* Inner dashed vertical lines on desktop */}
          <div className="absolute left-0 top-0 bottom-0 line-dash-y hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y hidden custom:block" />
          
          {/* Heading and Description Row */}
          <div className="flex flex-col lg:flex-row items-start lg:self-end gap-8 lg:gap-16 mb-12 sm:mb-16 lg:mb-20">
            <div className="flex-1">
              <h2 className="font-medium text-black cursor-default"
                  style={{
                    fontSize: 'clamp(32px, 6vw, 48px)',
                    lineHeight: 'clamp(97%, 1vw, 100%)',
                    letterSpacing: '-1.5px'
                  }}>
                Our Edge
              </h2>
            </div>
            <div className="lg:self-end">
              <p className="font-normal text-neutral-500 mb-1 cursor-default"
                 style={{
                   fontSize: 'clamp(16px, 2.5vw, 20px)',
                   lineHeight: '110%',
                   letterSpacing: '-0.5px'
                 }}>
                We&apos;re really f*cking good at what we do.
              </p>
            </div>
          </div>

          {/* Achievement Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {achievements.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                isHovered={hoveredCard === achievement.id}
                onMouseEnter={() => setHoveredCard(achievement.id)}
                onMouseLeave={() => setHoveredCard(null)}
              />
            ))}
          </div>
        </InnerContainer>
      </OuterContainer>
      
      <div className="w-full line-dash-x"/>
    </Section>
  );
}
