"use client";

import { useState } from "react";
import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import { X, Play, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface FeaturedProject {
  name: string;
  type: string;
  batch: string;
  timeline: string;
  youtubeId: string; // YouTube video ID (e.g., "dQw4w9WgXcQ")
  postUrl: string; // Link to the launch post (X, LinkedIn, etc.)
}

const featuredProjects: FeaturedProject[] = [
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
    batch: "YC W25",
    timeline: "2 weeks",
    youtubeId: "W9gC1McdJMg",
    postUrl: "https://www.linkedin.com/posts/y-combinator_logical-yc-f25-is-a-proactive-desktop-copilot-activity-7393014457301417984-NV5G?utm_source=share&utm_medium=member_desktop&rcm=ACoAABcN1DsBRNShbfWWg8JLpN9N_b1Y8xHVcKw",
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
    name: "AgeVisor 3",
    type: "Launch Video",
    batch: "",
    timeline: "7 days",
    youtubeId: "PBJbbMQ17eo",
    postUrl: "https://youtu.be/PBJbbMQ17eo?si=tpK1OctSAuHLP6T8",
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

const moreProjects = [
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

function VideoCard({ project }: { project: FeaturedProject }) {
  const [isPlaying, setIsPlaying] = useState(false);

  // YouTube thumbnail URL (maxresdefault for highest quality)
  const thumbnailUrl = project.youtubeId
    ? `https://img.youtube.com/vi/${project.youtubeId}/maxresdefault.jpg`
    : null;

  return (
    <div className="group flex flex-col">
      {/* Video/Thumbnail Area - Clean, no overlays */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-neutral-900">
        {isPlaying && project.youtubeId ? (
          // YouTube Embed
          <iframe
            src={`https://www.youtube.com/embed/${project.youtubeId}?autoplay=1&rel=0`}
            title={`${project.name} video`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          <>
            {/* Thumbnail */}
            {thumbnailUrl ? (
              <Image
                src={thumbnailUrl}
                alt={project.name}
                fill
                className="object-cover transition-transform duration-500 scale-[1.01] group-hover:scale-105"
              />
            ) : (
              // Placeholder gradient when no YouTube ID
              <div className="absolute inset-0 bg-gradient-to-br from-neutral-700 via-neutral-800 to-neutral-900" />
            )}

            {/* Play button overlay - only element on video */}
            <button
              onClick={() => project.youtubeId && setIsPlaying(true)}
              className={`absolute inset-0 flex items-center justify-center ${
                project.youtubeId ? "cursor-pointer" : "cursor-default"
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-black/50">
                <Play className="w-5 h-5 text-white/80 ml-0.5" fill="currentColor" />
              </div>
            </button>
          </>
        )}
      </div>

      {/* Metadata Below Video - Single line */}
      <div className="pt-3 px-1 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-black">{project.name}</span>
          <span className="text-neutral-500">{project.type}</span>
          {project.batch && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 font-medium">
              {project.batch}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-neutral-400">{project.timeline}</span>
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
    </div>
  );
}

export default function RecentWorkSection() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
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

        <SectionHeader leftText="RECENT WORK" rightText="// portfolio" />

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
                Recent Work
              </h2>
            </div>

            {/* Featured Projects - 2 Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-6">
              {featuredProjects.map((project, index) => (
                <VideoCard key={index} project={project} />
              ))}
            </div>

            {/* More Projects Button */}
            <div className="flex justify-center mt-8">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-neutral-300 bg-white text-sm font-medium text-neutral-500 cursor-default">
                <span>+75 more projects</span>
              </div>
            </div>
          </InnerContainer>
        </OuterContainer>

        <div className="w-full line-dash-x" />
      </Section>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 sm:p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-medium text-xl text-black">All Projects</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors"
                >
                  <X className="w-4 h-4 text-neutral-600" />
                </button>
              </div>

              <div className="space-y-2">
                {[...featuredProjects.map((p) => p.name), ...moreProjects].map(
                  (name, index) => (
                    <div
                      key={index}
                      className="py-2 px-3 rounded-lg hover:bg-neutral-50 text-neutral-700 text-sm"
                    >
                      {name}
                    </div>
                  )
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
