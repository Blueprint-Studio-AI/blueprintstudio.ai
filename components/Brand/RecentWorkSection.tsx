"use client";

import { useState, useRef } from "react";
import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

interface BrandProject {
  name: string;
  tagline: string;
  industry: string;
  image: string;
  colors: string[];
  logoStyle: "geometric" | "wordmark" | "abstract" | "letterform";
  deliverables: string[];
}

const brandProjects: BrandProject[] = [
  {
    name: "Arch Network",
    tagline: "Bitcoin-native smart contracts",
    industry: "Web3",
    image: "/brand/arch-network.png",
    colors: ["#FF6B35", "#1a1a1a", "#ffffff"],
    logoStyle: "geometric",
    deliverables: ["Logo System", "Brand Guidelines", "Social Kit"],
  },
  {
    name: "HoneyB",
    tagline: "Financial wellness for families",
    industry: "Fintech",
    image: "/brand/honeyb.png",
    colors: ["#F59E0B", "#FEF3C7", "#1F2937"],
    logoStyle: "wordmark",
    deliverables: ["Visual Identity", "App Icons", "Marketing Assets"],
  },
  {
    name: "LivingIP",
    tagline: "AI-powered patent intelligence",
    industry: "AI",
    image: "/brand/livingip.png",
    colors: ["#8B5CF6", "#EDE9FE", "#1E1B4B"],
    logoStyle: "abstract",
    deliverables: ["Brand Identity", "Website Design", "Pitch Deck"],
  },
  {
    name: "Autara",
    tagline: "Enterprise automation platform",
    industry: "AI",
    image: "/brand/autara.png",
    colors: ["#10B981", "#D1FAE5", "#064E3B"],
    logoStyle: "letterform",
    deliverables: ["Visual Identity", "Brand Guidelines", "Brand GPT"],
  },
  {
    name: "Breeze",
    tagline: "Modern banking infrastructure",
    industry: "Fintech",
    image: "/brand/breeze.png",
    colors: ["#3B82F6", "#DBEAFE", "#1E3A8A"],
    logoStyle: "wordmark",
    deliverables: ["Brand Identity", "Design System", "Social Kit"],
  },
  {
    name: "Perena",
    tagline: "DeFi yield optimization",
    industry: "Web3",
    image: "/brand/perena.png",
    colors: ["#EC4899", "#FCE7F3", "#831843"],
    logoStyle: "geometric",
    deliverables: ["Logo System", "Brand Guidelines", "Marketing"],
  },
];

// Logo style visual representations
function LogoPreview({
  style,
  primaryColor,
}: {
  style: BrandProject["logoStyle"];
  primaryColor: string;
}) {
  const shapes = {
    geometric: (
      <div className="flex items-center justify-center gap-1">
        <div
          className="w-6 h-6 rotate-45"
          style={{ backgroundColor: primaryColor }}
        />
        <div
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: primaryColor, opacity: 0.6 }}
        />
      </div>
    ),
    wordmark: (
      <div
        className="font-bold text-lg tracking-tight"
        style={{ color: primaryColor }}
      >
        Abc
      </div>
    ),
    abstract: (
      <div className="flex items-center">
        <div
          className="w-5 h-8 rounded-full"
          style={{ backgroundColor: primaryColor }}
        />
        <div
          className="w-5 h-5 rounded-full -ml-2"
          style={{ backgroundColor: primaryColor, opacity: 0.6 }}
        />
      </div>
    ),
    letterform: (
      <div
        className="font-bold text-2xl"
        style={{ color: primaryColor }}
      >
        A
      </div>
    ),
  };

  return (
    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
      {shapes[style]}
    </div>
  );
}

function BrandShowcaseCard({
  project,
  index,
}: {
  project: BrandProject;
  index: number;
}) {
  const [imageError, setImageError] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      className="group flex-shrink-0 w-[320px] sm:w-[380px]"
      initial={{ opacity: 0, x: 40 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {/* Card Container */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden hover:border-neutral-300 hover:shadow-lg transition-all duration-300">
        {/* Image Area */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100">
          {!imageError ? (
            <Image
              src={project.image}
              alt={project.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100">
              <LogoPreview
                style={project.logoStyle}
                primaryColor={project.colors[0]}
              />
            </div>
          )}

          {/* Industry Badge */}
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-medium text-neutral-700">
            {project.industry}
          </div>

          {/* Color palette overlay on hover */}
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center gap-1.5 p-2 rounded-lg bg-white/90 backdrop-blur-sm">
              {project.colors.map((color, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-md border border-neutral-200 shadow-sm"
                  style={{ backgroundColor: color }}
                />
              ))}
              <span className="ml-auto text-xs text-neutral-500">
                Brand Colors
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <h3 className="font-medium text-lg text-neutral-900">
                {project.name}
              </h3>
              <p className="text-sm text-neutral-500">{project.tagline}</p>
            </div>
            <LogoPreview
              style={project.logoStyle}
              primaryColor={project.colors[0]}
            />
          </div>

          {/* Deliverables */}
          <div className="flex flex-wrap gap-1.5">
            {project.deliverables.map((d, i) => (
              <span
                key={i}
                className="text-xs px-2 py-1 rounded-md bg-neutral-100 text-neutral-600"
              >
                {d}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function RecentWorkSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef(null);
  const isInView = useInView(titleRef, { once: true, amount: 0.5 });

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <Section
      id="portfolio"
      className="flex flex-col relative z-20 bg-neutral-100 overflow-hidden"
    >
      {/* Vertical lines */}
      <div className="absolute inset-0 flex justify-center pointer-events-none px-2.5 sm:px-[60px]">
        <div className="w-full flex-1 flex justify-center relative">
          <div className="absolute left-0 top-0 bottom-0 line-dash-y custom:hidden" />
          <div className="absolute left-0 top-0 bottom-0 w-px bg-neutral-300 hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y custom:hidden" />
          <div className="absolute right-0 top-0 bottom-0 w-px bg-neutral-300 hidden custom:block" />
        </div>
      </div>

      <SectionHeader leftText="PORTFOLIO" rightText="// recent brands" />

      <OuterContainer className="flex-1 flex flex-col">
        <InnerContainer className="pt-8 sm:pt-12 lg:pt-16 pb-4 px-2.5 sm:px-6 relative">
          <div className="absolute left-0 top-0 bottom-0 line-dash-y hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y hidden custom:block" />

          {/* Section Header */}
          <div
            ref={titleRef}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8"
          >
            <div>
              <motion.h2
                className="font-medium text-black cursor-default mb-2"
                style={{
                  fontSize: "clamp(32px, 6vw, 48px)",
                  lineHeight: "110%",
                  letterSpacing: "-1px",
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                Brands We&apos;ve Built
              </motion.h2>
              <motion.p
                className="text-neutral-500"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.6,
                  delay: 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                Each delivered in 3 weeks or less
              </motion.p>
            </div>

            {/* Scroll Controls */}
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.3 }}
            >
              <button
                onClick={() => scroll("left")}
                className="w-10 h-10 rounded-full border border-neutral-300 bg-white flex items-center justify-center hover:border-neutral-400 hover:bg-neutral-50 transition-colors"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5 text-neutral-600" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="w-10 h-10 rounded-full border border-neutral-300 bg-white flex items-center justify-center hover:border-neutral-400 hover:bg-neutral-50 transition-colors"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5 text-neutral-600" />
              </button>
            </motion.div>
          </div>
        </InnerContainer>

        {/* Horizontal Scroll Container - Full Width */}
        <div className="relative pb-8 sm:pb-12 lg:pb-16">
          {/* Gradient masks */}
          <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-neutral-100 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-neutral-100 to-transparent z-10 pointer-events-none" />

          {/* Scrollable area */}
          <div
            ref={scrollRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide px-4 sm:px-16 pb-4"
            style={{
              scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {brandProjects.map((project, index) => (
              <div key={project.name} style={{ scrollSnapAlign: "start" }}>
                <BrandShowcaseCard project={project} index={index} />
              </div>
            ))}

            {/* View All Card */}
            <motion.div
              className="flex-shrink-0 w-[280px] sm:w-[320px] flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.6 }}
              style={{ scrollSnapAlign: "start" }}
            >
              <div className="text-center p-8">
                <div className="w-16 h-16 rounded-full bg-neutral-200 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-medium text-neutral-600">
                    25+
                  </span>
                </div>
                <p className="text-neutral-600 font-medium mb-2">More brands</p>
                <p className="text-sm text-neutral-500 mb-4">
                  across AI, Fintech, Web3
                </p>
                <button className="inline-flex items-center gap-2 text-sm font-medium text-neutral-700 hover:text-black transition-colors group">
                  View all work
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </OuterContainer>

      <div className="w-full line-dash-x" />

      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </Section>
  );
}
