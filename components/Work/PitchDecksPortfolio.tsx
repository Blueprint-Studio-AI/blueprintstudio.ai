"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import MarqueeGalleryRow from "@/components/ui/MarqueeGalleryRow";

interface DeckProject {
  id: string;
  name: string;
  tagline: string;
  description: string;
  slides: string[];
}

const deckProjects: DeckProject[] = [
  {
    id: "friday-table",
    name: "Friday Table",
    tagline: "Community Dining Platform",
    description:
      "A 12-slide fundraising deck for a community dining startup. Clean layouts, compelling data visualizations, and a narrative arc that moves investors from problem to opportunity.",
    slides: [
      "/launch-assets/slide-deck_assets/friday-table_deck-assets/1 v3.jpg",
      "/launch-assets/slide-deck_assets/friday-table_deck-assets/2 v3.jpg",
      "/launch-assets/slide-deck_assets/friday-table_deck-assets/3 v3.jpg",
      "/launch-assets/slide-deck_assets/friday-table_deck-assets/4 v3.jpg",
      "/launch-assets/slide-deck_assets/friday-table_deck-assets/5 v3.jpg",
      "/launch-assets/slide-deck_assets/friday-table_deck-assets/6  v3.jpg",
      "/launch-assets/slide-deck_assets/friday-table_deck-assets/7  v3.jpg",
      "/launch-assets/slide-deck_assets/friday-table_deck-assets/8  v3.jpg",
      "/launch-assets/slide-deck_assets/friday-table_deck-assets/9  v3.jpg",
      "/launch-assets/slide-deck_assets/friday-table_deck-assets/10  v3.jpg",
      "/launch-assets/slide-deck_assets/friday-table_deck-assets/11  v3.jpg",
      "/launch-assets/slide-deck_assets/friday-table_deck-assets/12 v3.jpg",
    ],
  },
  {
    id: "honeyb",
    name: "HoneyB",
    tagline: "Bitcoin Rewards Platform",
    description:
      "A 12-slide investor deck for a Bitcoin cashback platform. Warm brand language carried through every slide with clear metrics and market positioning.",
    slides: [
      "/launch-assets/slide-deck_assets/honeyb_deck-assets/honeyb-1.jpg",
      "/launch-assets/slide-deck_assets/honeyb_deck-assets/honeyb-2.jpg",
      "/launch-assets/slide-deck_assets/honeyb_deck-assets/honeyb-3.jpg",
      "/launch-assets/slide-deck_assets/honeyb_deck-assets/honeyb-4.jpg",
      "/launch-assets/slide-deck_assets/honeyb_deck-assets/honeyb-5.jpg",
      "/launch-assets/slide-deck_assets/honeyb_deck-assets/honeyb-6.jpg",
      "/launch-assets/slide-deck_assets/honeyb_deck-assets/honeyb-7.jpg",
      "/launch-assets/slide-deck_assets/honeyb_deck-assets/honeyb-8.jpg",
      "/launch-assets/slide-deck_assets/honeyb_deck-assets/honeyb-9.jpg",
      "/launch-assets/slide-deck_assets/honeyb_deck-assets/honeyb-10.jpg",
      "/launch-assets/slide-deck_assets/honeyb_deck-assets/honeyb-11.jpg",
      "/launch-assets/slide-deck_assets/honeyb_deck-assets/honeyb-12.jpg",
    ],
  },
  {
    id: "huch",
    name: "Huch",
    tagline: "Gaming Cases Marketplace",
    description:
      "A 15-slide deck for a gaming marketplace. Dark, high-energy slides with sharp data layouts, competitive analysis, and a go-to-market strategy that speaks to gaming investors.",
    slides: [
      "/launch-assets/slide-deck_assets/huch_deck-assets/huch-1.jpg",
      "/launch-assets/slide-deck_assets/huch_deck-assets/huch-2.jpg",
      "/launch-assets/slide-deck_assets/huch_deck-assets/huch-3.jpg",
      "/launch-assets/slide-deck_assets/huch_deck-assets/huch-4.jpg",
      "/launch-assets/slide-deck_assets/huch_deck-assets/huch-5.jpg",
      "/launch-assets/slide-deck_assets/huch_deck-assets/huch-6.jpg",
      "/launch-assets/slide-deck_assets/huch_deck-assets/huch-7.jpg",
      "/launch-assets/slide-deck_assets/huch_deck-assets/huch-8.jpg",
      "/launch-assets/slide-deck_assets/huch_deck-assets/huch-9.jpg",
      "/launch-assets/slide-deck_assets/huch_deck-assets/huch-10.jpg",
      "/launch-assets/slide-deck_assets/huch_deck-assets/huch-11.jpg",
      "/launch-assets/slide-deck_assets/huch_deck-assets/huch-12.jpg",
      "/launch-assets/slide-deck_assets/huch_deck-assets/huch-13.jpg",
      "/launch-assets/slide-deck_assets/huch_deck-assets/huch-14.jpg",
      "/launch-assets/slide-deck_assets/huch_deck-assets/huch-15.jpg",
    ],
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

function FeaturedDeck({ project, isFirst = false }: { project: DeckProject; isFirst?: boolean }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={fadeUp}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
        <div className="flex items-center gap-3">
          <h3 className="text-xl sm:text-2xl font-semibold text-black tracking-tight">
            {project.name}
          </h3>
          <span className="text-sm text-neutral-400">{project.tagline}</span>
        </div>
        <span className="text-xs text-neutral-400 uppercase tracking-wider">
          {project.slides.length} slides
        </span>
      </div>
      <p className="text-neutral-500 text-sm sm:text-base leading-relaxed mb-6 max-w-xl">
        {project.description}
      </p>

      {/* Featured slide — large */}
      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-neutral-200 mb-4">
        <Image
          src={project.slides[0]}
          alt={`${project.name} pitch deck cover`}
          fill
          sizes="(max-width: 768px) 100vw, 900px"
          className="object-cover"
          {...(isFirst && { priority: true })}
        />
      </div>

      {/* Slide grid — 3 or 4 columns of selected slides */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
        {project.slides.slice(1, 9).map((slide, i) => (
          <div
            key={slide}
            className="relative aspect-video rounded-lg overflow-hidden bg-neutral-200"
          >
            <Image
              src={slide}
              alt={`${project.name} slide ${i + 2}`}
              fill
              sizes="(max-width: 768px) 33vw, 220px"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function PitchDecksPortfolio() {
  // Collect all slide images for the marquee
  const allSlides = deckProjects.flatMap((p) =>
    p.slides.filter((_, i) => i % 3 === 0)
  );

  return (
    <Section className="flex flex-col relative z-20 bg-neutral-100 min-h-screen">
      {/* Background vertical lines */}
      <div className="absolute inset-0 flex justify-center pointer-events-none px-2.5 sm:px-[60px]">
        <div className="w-full flex-1 flex justify-center relative">
          <div className="absolute left-0 top-0 bottom-0 line-dash-y custom:hidden" />
          <div className="absolute left-0 top-0 bottom-0 w-px bg-neutral-300 hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y custom:hidden" />
          <div className="absolute right-0 top-0 bottom-0 w-px bg-neutral-300 hidden custom:block" />
        </div>
      </div>

      <SectionHeader leftText="PORTFOLIO" rightText="// pitch decks" />

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
              Pitch Decks
            </h1>
            <p className="text-neutral-500 max-w-xl text-base sm:text-lg cursor-default">
              Investor-ready slide decks that tell your story with clarity and confidence. Designed to win meetings and close rounds.
            </p>
          </div>
        </InnerContainer>
      </OuterContainer>

      {/* Marquee row of slides */}
      <div className="w-full line-dash-x" />
      <div className="py-6 sm:py-8 bg-neutral-50">
        <MarqueeGalleryRow
          images={allSlides}
          imageClassName="w-52 sm:w-64 aspect-video"
        />
      </div>
      <div className="w-full line-dash-x" />

      {/* Individual Deck Sections */}
      <OuterContainer className="flex-1">
        <InnerContainer className="py-8 sm:py-12 px-2.5 sm:px-6 relative">
          <div className="absolute left-0 top-0 bottom-0 line-dash-y hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y hidden custom:block" />

          <div className="space-y-0">
            {deckProjects.map((project, i) => (
              <div key={project.id}>
                {i > 0 && <div className="w-full line-dash-x my-12 sm:my-16" />}
                <FeaturedDeck project={project} isFirst={i === 0} />
              </div>
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
              Need a deck that wins meetings?
            </h2>
            <p className="text-neutral-500 mb-8 max-w-md mx-auto cursor-default">
              Book a call and let&apos;s design a pitch deck investors actually remember.
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
