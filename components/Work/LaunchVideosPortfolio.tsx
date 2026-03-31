"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Play, ExternalLink } from "lucide-react";
import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import SectionHeader from "@/components/ui/SectionHeader";

interface VideoProject {
  name: string;
  type: string;
  batch: string;
  timeline: string;
  youtubeId: string;
  postUrl: string;
}

const videoProjects: VideoProject[] = [
  {
    name: "Jinba",
    type: "Launch Video",
    batch: "YC W26",
    timeline: "4 weeks",
    youtubeId: "aD9XnupXf_w",
    postUrl: "",
  },
  {
    name: "Pyra",
    type: "Launch Video",
    batch: "Colosseum",
    timeline: "2 days",
    youtubeId: "A1hq1u_M7L8",
    postUrl: "https://x.com/GetPyra/status/1988655157845061840",
  },
  {
    name: "Logical",
    type: "Launch Video",
    batch: "YC F25",
    timeline: "2 weeks",
    youtubeId: "W9gC1McdJMg",
    postUrl:
      "https://www.linkedin.com/posts/y-combinator_logical-yc-f25-is-a-proactive-desktop-copilot-activity-7393014457301417984-NV5G",
  },
  {
    name: "Perena",
    type: "Landing Showcase",
    batch: "",
    timeline: "2 days",
    youtubeId: "DwqvawhROwE",
    postUrl: "https://x.com/perena/status/2002083042308104204",
  },
  {
    name: "Pirus Labs",
    type: "Launch Video",
    batch: "YC W26",
    timeline: "",
    youtubeId: "PeaWXlRNjPE",
    postUrl: "",
  },
  {
    name: "Blueprint Studio",
    type: "Show Reel",
    batch: "",
    timeline: "Ongoing",
    youtubeId: "HRKKwThx-do",
    postUrl: "https://blueprintstudio.ai/",
  },
];

const moreClients = [
  "Manchester Tourism Summer",
  "Manchester Tourism Fall",
  "Dorset Tourism Farm",
  "Climbing Giants",
  "Catalyst Film Fest",
  "Hailey Van Der Kar",
  "Celia Kelly",
  "TokenWorks AV3",
  "TokenWorks IDVisor",
  "Hildene Capital",
  "Project Metavision",
  "HUCH",
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

function VideoCard({ project, index }: { project: VideoProject; index: number }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const thumbnailUrl = `https://img.youtube.com/vi/${project.youtubeId}/maxresdefault.jpg`;

  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={fadeUp}
      className="group flex flex-col"
    >
      {/* Thumbnail / Embed */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-neutral-200">
        {isPlaying ? (
          <iframe
            src={`https://www.youtube.com/embed/${project.youtubeId}?autoplay=1&rel=0`}
            title={`${project.name} video`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          <>
            <Image
              src={thumbnailUrl}
              alt={`${project.name} thumbnail`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 scale-[1.01] group-hover:scale-105"
              {...(index === 0 && { priority: true })}
            />
            <button
              onClick={() => setIsPlaying(true)}
              className="absolute inset-0 flex items-center justify-center cursor-pointer"
            >
              <div className="w-14 h-14 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-black/50">
                <Play className="w-6 h-6 text-white/90 ml-0.5" fill="currentColor" />
              </div>
            </button>
          </>
        )}
      </div>

      {/* Metadata */}
      <div className="pt-3 px-1 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-black">{project.name}</span>
          <span className="text-neutral-500 text-sm">{project.type}</span>
          {project.batch && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 font-medium">
              {project.batch}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {project.timeline && (
            <span className="text-neutral-400 text-sm">{project.timeline}</span>
          )}
          {project.postUrl && (
            <a
              href={project.postUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-5 h-5 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors"
            >
              <ExternalLink className="w-3 h-3 text-neutral-500" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function LaunchVideosPortfolio() {
  return (
    <Section className="flex flex-col relative z-20 bg-neutral-100 min-h-screen overflow-hidden">
      {/* Background vertical lines */}
      <div className="absolute inset-0 flex justify-center pointer-events-none px-2.5 sm:px-[60px]">
        <div className="w-full flex-1 flex justify-center relative">
          <div className="absolute left-0 top-0 bottom-0 line-dash-y custom:hidden" />
          <div className="absolute left-0 top-0 bottom-0 w-px bg-neutral-300 hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y custom:hidden" />
          <div className="absolute right-0 top-0 bottom-0 w-px bg-neutral-300 hidden custom:block" />
        </div>
      </div>

      <SectionHeader leftText="PORTFOLIO" rightText="// launch videos" />

      <OuterContainer className="flex-1">
        <InnerContainer className="pt-16 sm:pt-20 lg:pt-28 pb-8 sm:pb-12 px-2.5 sm:px-6 relative">
          <div className="absolute left-0 top-0 bottom-0 line-dash-y hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y hidden custom:block" />

          {/* Breadcrumb */}
          <Link
            href="/work"
            className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 transition-colors mb-8"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            All Work
          </Link>

          <div className="mb-12 sm:mb-16">
            <h1
              className="font-medium text-black cursor-default mb-4"
              style={{
                fontSize: "clamp(36px, 7vw, 56px)",
                lineHeight: "110%",
                letterSpacing: "-1.5px",
              }}
            >
              Launch Videos
            </h1>
            <p className="text-neutral-500 max-w-xl text-base sm:text-lg cursor-default">
              Studio-quality launch videos in 7 days. Product demos, explainers, and show reels that generate millions of views.
            </p>
          </div>

          {/* 2-column video grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-6">
            {videoProjects.map((project, i) => (
              <VideoCard key={project.youtubeId} project={project} index={i} />
            ))}
          </div>
        </InnerContainer>
      </OuterContainer>

      {/* Stats Bar */}
      <div className="w-full line-dash-x" />
      <OuterContainer>
        <InnerContainer className="px-0 sm:px-6 relative">
          <div className="absolute left-0 top-0 bottom-0 line-dash-y hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y hidden custom:block" />
          <div className="grid grid-cols-3">
            <div className="flex flex-col items-center justify-center py-10 sm:py-14">
              <span
                className="font-semibold text-black tracking-tight"
                style={{ fontSize: "clamp(22px, 4vw, 32px)" }}
              >
                100+
              </span>
              <span className="text-[10px] sm:text-sm text-neutral-400 uppercase tracking-wider sm:tracking-widest mt-2 text-center leading-relaxed">
                Videos<br className="sm:hidden" /> Delivered
              </span>
            </div>
            <div className="flex flex-col items-center justify-center py-10 sm:py-14 border-x border-neutral-300">
              <span
                className="font-semibold text-black tracking-tight"
                style={{ fontSize: "clamp(22px, 4vw, 32px)" }}
              >
                2M+
              </span>
              <span className="text-[10px] sm:text-sm text-neutral-400 uppercase tracking-wider sm:tracking-widest mt-2 text-center leading-relaxed">
                Total<br className="sm:hidden" /> Views
              </span>
            </div>
            <div className="flex flex-col items-center justify-center py-10 sm:py-14">
              <span
                className="font-semibold text-black tracking-tight"
                style={{ fontSize: "clamp(22px, 4vw, 32px)" }}
              >
                10 Days
              </span>
              <span className="text-[10px] sm:text-sm text-neutral-400 uppercase tracking-wider sm:tracking-widest mt-2 text-center leading-relaxed">
                Avg.<br className="sm:hidden" /> Turnaround
              </span>
            </div>
          </div>
        </InnerContainer>
      </OuterContainer>
      <div className="w-full line-dash-x" />

      {/* More Clients */}
      <OuterContainer>
        <InnerContainer className="py-10 sm:py-14 px-2.5 sm:px-6 relative">
          <div className="absolute left-0 top-0 bottom-0 line-dash-y hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y hidden custom:block" />

          <p className="text-sm text-neutral-400 uppercase tracking-wider mb-4 text-center">
            More Clients
          </p>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {moreClients.map((client) => (
              <span
                key={client}
                className="text-sm px-3 py-1.5 rounded-full bg-white border border-neutral-200 text-neutral-500"
              >
                {client}
              </span>
            ))}
          </div>
        </InnerContainer>
      </OuterContainer>

      {/* CTA Section */}
      <div className="w-full line-dash-x" />
      <OuterContainer>
        <InnerContainer className="py-16 sm:py-20 lg:py-24 px-2.5 sm:px-6 relative">
          <div className="absolute left-0 top-0 bottom-0 line-dash-y hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y hidden custom:block" />

          <div className="text-center">
            <h2
              className="font-medium text-black mb-4 cursor-default"
              style={{
                fontSize: "clamp(24px, 5vw, 40px)",
                lineHeight: "110%",
                letterSpacing: "-1px",
              }}
            >
              Ready to launch your video?
            </h2>
            <p className="text-neutral-500 mb-8 max-w-md mx-auto cursor-default">
              Book a call and get a studio-quality video in as little as 7 days.
            </p>
            <a
              href="https://cal.com/blueprint-studio/intro-call"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 py-3 px-7 font-medium text-white rounded-lg text-sm sm:text-base transition-all duration-300 hover:opacity-90"
              style={{
                background:
                  "linear-gradient(135deg, #60AEEE 0%, #3B82F6 25%, #2563EB 50%, #1D4ED8 75%, #4F46E5 100%)",
                boxShadow:
                  "0 1px 2px rgba(0,0,0,0.1), 0 2px 8px rgba(96,174,238,0.3)",
              }}
            >
              Book a Call
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </InnerContainer>
      </OuterContainer>
      <div className="w-full line-dash-x" />
    </Section>
  );
}
