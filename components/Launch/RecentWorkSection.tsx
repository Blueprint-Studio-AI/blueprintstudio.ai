"use client";

import { useState } from "react";
import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import Image from "next/image";

interface LaunchProject {
  name: string;
  deliverables: string;
  timeline: string;
  batch?: string;
  image: string;
}

const launchProjects: LaunchProject[] = [
  {
    name: "Jinba",
    deliverables: "Brand + Website + Video",
    timeline: "6 weeks",
    batch: "YC W26",
    image: "/launch/jinba.png",
  },
  {
    name: "Logical",
    deliverables: "Brand + Website + Video",
    timeline: "5 weeks",
    batch: "YC W25",
    image: "/launch/logical.png",
  },
  {
    name: "HoneyB",
    deliverables: "Brand + Website + Deck",
    timeline: "4 weeks",
    image: "/launch/honeyb.png",
  },
  {
    name: "Arch Network",
    deliverables: "Brand + Website + Video",
    timeline: "6 weeks",
    image: "/launch/arch-network.png",
  },
];

function LaunchCard({ project }: { project: LaunchProject }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="group flex flex-col">
      {/* Image Area */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-neutral-100">
        {!imageError ? (
          <Image
            src={project.image}
            alt={project.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-neutral-100 via-neutral-200 to-neutral-100">
            <span className="text-neutral-400 font-medium text-lg">
              {project.name}
            </span>
          </div>
        )}
      </div>

      {/* Metadata */}
      <div className="pt-3 px-1 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-black">{project.name}</span>
          <span className="text-neutral-500 text-sm">
            {project.deliverables}
          </span>
          {project.batch && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 font-medium">
              {project.batch}
            </span>
          )}
        </div>
        <span className="text-neutral-400 text-sm shrink-0">
          {project.timeline}
        </span>
      </div>
    </div>
  );
}

export default function RecentWorkSection() {
  return (
    <Section className="flex flex-col relative z-20 bg-neutral-100 overflow-hidden">
      {/* Vertical lines */}
      <div className="absolute inset-0 flex justify-center pointer-events-none px-2.5 sm:px-[60px]">
        <div className="w-full flex-1 flex justify-center relative">
          <div className="absolute left-0 top-0 bottom-0 line-dash-y custom:hidden" />
          <div className="absolute left-0 top-0 bottom-0 w-px bg-neutral-300 hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y custom:hidden" />
          <div className="absolute right-0 top-0 bottom-0 w-px bg-neutral-300 hidden custom:block" />
        </div>
      </div>

      <SectionHeader leftText="PORTFOLIO" rightText="// full launches" />

      <OuterContainer className="flex-1 flex items-center">
        <InnerContainer className="pt-8 sm:pt-12 lg:pt-16 pb-8 sm:pb-12 lg:pb-16 px-2.5 sm:px-6 relative">
          <div className="absolute left-0 top-0 bottom-0 line-dash-y hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y hidden custom:block" />

          {/* Section Title */}
          <div className="text-center mb-8 sm:mb-12">
            <h2
              className="font-medium text-black cursor-default"
              style={{
                fontSize: "clamp(32px, 6vw, 48px)",
                lineHeight: "110%",
                letterSpacing: "-1px",
              }}
            >
              Recent Launches
            </h2>
          </div>

          {/* Launch Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-6">
            {launchProjects.map((project, index) => (
              <LaunchCard key={index} project={project} />
            ))}
          </div>

          {/* View All */}
          <div className="flex justify-center mt-8">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-neutral-300 bg-white text-sm font-medium text-neutral-500 cursor-default">
              <span>View all work</span>
            </div>
          </div>
        </InnerContainer>
      </OuterContainer>

      <div className="w-full line-dash-x" />
    </Section>
  );
}
