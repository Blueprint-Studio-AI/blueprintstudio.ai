"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import SectionHeader from "@/components/ui/SectionHeader";

interface WorkCategory {
  title: string;
  description: string;
  href: string;
  image: string;
  imageAlt: string;
  count: string;
}

const categories: WorkCategory[] = [
  {
    title: "Brand Identity",
    description:
      "Logo systems, color palettes, type systems, and brand guidelines that make startups look like they've been around for years.",
    href: "/work/brand-identity",
    image: "/brand-assets/brands-weve-built/honeyb_brands-we-built.png",
    imageAlt: "HoneyB brand identity showcase",
    count: "5 Projects",
  },
  {
    title: "Web Design",
    description:
      "Responsive websites and landing pages that convert visitors into users. Desktop and mobile, pixel-perfect.",
    href: "/work/web-design",
    image: "/launch-assets/web-design_assets/desktop-huch.png",
    imageAlt: "Huch web design desktop view",
    count: "3 Projects",
  },
  {
    title: "Pitch Decks",
    description:
      "Investor-ready slide decks that tell your story with clarity and confidence. Designed to win meetings.",
    href: "/work/pitch-decks",
    image: "/launch-assets/slide-deck_assets/honeyb_deck-assets/honeyb-1.jpg",
    imageAlt: "HoneyB pitch deck cover slide",
    count: "3 Decks",
  },
  {
    title: "Launch Videos",
    description:
      "Studio-quality launch videos in 7 days. Product demos, explainers, and show reels that generate millions of views.",
    href: "/work/launch-videos",
    image: "https://img.youtube.com/vi/aD9XnupXf_w/maxresdefault.jpg",
    imageAlt: "Jinba launch video thumbnail",
    count: "100+ Videos",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

export default function WorkIndexPage() {
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

      <SectionHeader leftText="PORTFOLIO" rightText="// all work" />

      <OuterContainer className="flex-1">
        <InnerContainer className="pt-16 sm:pt-20 lg:pt-28 pb-8 sm:pb-12 px-2.5 sm:px-6 relative">
          <div className="absolute left-0 top-0 bottom-0 line-dash-y hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y hidden custom:block" />

          <div className="text-center mb-4">
            <h1
              className="font-medium text-black cursor-default"
              style={{
                fontSize: "clamp(36px, 7vw, 56px)",
                lineHeight: "110%",
                letterSpacing: "-1.5px",
              }}
            >
              Our Work
            </h1>
          </div>
          <p className="text-neutral-500 text-center max-w-lg mx-auto text-base sm:text-lg mb-12 sm:mb-16 cursor-default">
            Brands, websites, decks, and videos — built for startups that move fast and need to look great doing it.
          </p>

          {/* Category Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.href}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={cardVariants}
              >
                <Link href={cat.href} className="group block">
                  <div className="relative overflow-hidden rounded-xl bg-neutral-200 aspect-[4/3] sm:aspect-[3/2]">
                    <Image
                      src={cat.image}
                      alt={cat.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Content overlay */}
                    <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-white/60 uppercase tracking-wider font-medium">
                          {cat.count}
                        </span>
                      </div>
                      <h2 className="text-white text-xl sm:text-2xl font-semibold tracking-tight mb-1.5">
                        {cat.title}
                      </h2>
                      <p className="text-white/70 text-sm leading-relaxed line-clamp-2 max-w-md">
                        {cat.description}
                      </p>
                      <div className="mt-3 flex items-center gap-1.5 text-white/80 text-sm font-medium group-hover:text-white transition-colors">
                        View Work
                        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
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
              Ready to start your project?
            </h2>
            <p className="text-neutral-500 mb-8 max-w-md mx-auto cursor-default">
              Book a call and let&apos;s talk about what you&apos;re building.
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
