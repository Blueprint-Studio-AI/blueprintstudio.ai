"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Monitor, Smartphone } from "lucide-react";
import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import SectionHeader from "@/components/ui/SectionHeader";

interface WebProject {
  id: string;
  name: string;
  tagline: string;
  description: string;
  desktopImage: string;
  mobileImage: string;
  technologies: string[];
}

const webProjects: WebProject[] = [
  {
    id: "huch",
    name: "Huch",
    tagline: "Gaming Cases Marketplace",
    description:
      "Full platform redesign — responsive landing page through to product pages, account flows, and marketplace UI. Built for a competitive gaming audience with a dark, premium aesthetic.",
    desktopImage: "/launch-assets/web-design_assets/desktop-huch.png",
    mobileImage: "/launch-assets/web-design_assets/mobile-huch.png",
    technologies: ["Next.js", "Tailwind CSS", "Framer Motion"],
  },
  {
    id: "honeyb",
    name: "HoneyB",
    tagline: "Bitcoin Rewards Platform",
    description:
      "Marketing site and web app for a Bitcoin cashback platform. Warm brand tones translated into a conversion-optimized layout with clear CTAs and social proof.",
    desktopImage: "/launch-assets/web-design_assets/desktop-honeyb.png",
    mobileImage: "/launch-assets/web-design_assets/mobile-honeyb.png",
    technologies: ["Framer", "Custom Components", "Animations"],
  },
  {
    id: "perena",
    name: "Perena",
    tagline: "Stablecoin Protocol",
    description:
      "Landing page for the launch of USD* — a next-gen stablecoin. Dark, sophisticated design with data visualizations, APY breakdowns, and seamless motion.",
    desktopImage: "/launch-assets/web-design_assets/desktop-perena.png",
    mobileImage: "/launch-assets/web-design_assets/mobile-perena.png",
    technologies: ["Next.js", "Motion Design", "Custom Charts"],
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

function DevicePair({ project, isFirst = false }: { project: WebProject; isFirst?: boolean }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={fadeUp}
      className="w-full"
    >
      {/* Project Header */}
      <div className="flex items-center gap-3 mb-2">
        <h3 className="text-xl sm:text-2xl font-semibold text-black tracking-tight">
          {project.name}
        </h3>
        <span className="text-sm text-neutral-400">{project.tagline}</span>
      </div>
      <p className="text-neutral-500 text-sm sm:text-base leading-relaxed mb-6 max-w-xl">
        {project.description}
      </p>

      {/* Device Showcase */}
      <div className="relative">
        {/* Desktop Browser Frame */}
        <div className="relative">
          {/* Browser chrome */}
          <div className="bg-neutral-800 rounded-t-xl px-4 py-2.5 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-neutral-600" />
              <div className="w-2.5 h-2.5 rounded-full bg-neutral-600" />
              <div className="w-2.5 h-2.5 rounded-full bg-neutral-600" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="bg-neutral-700 rounded-md px-4 py-1 text-[10px] sm:text-xs text-neutral-400 max-w-[200px] sm:max-w-xs truncate flex items-center gap-1.5">
                <Monitor className="w-3 h-3 shrink-0" />
                {project.name.toLowerCase()}.com
              </div>
            </div>
          </div>
          {/* Desktop screenshot */}
          <div className="relative aspect-[16/10] bg-neutral-200 rounded-b-xl overflow-hidden">
            <Image
              src={project.desktopImage}
              alt={`${project.name} desktop view`}
              fill
              sizes="(max-width: 768px) 100vw, 900px"
              className="object-cover object-top"
              {...(isFirst && { priority: true })}
            />
          </div>
        </div>

        {/* Mobile Device Frame — overlapping bottom-right */}
        <div className="absolute -bottom-6 right-0 sm:-right-2 w-[90px] sm:w-[120px] md:w-[140px] z-10">
          <div className="bg-neutral-900 rounded-[12px] sm:rounded-[16px] p-1 sm:p-1.5 shadow-2xl">
            {/* Phone notch */}
            <div className="flex justify-center mb-0.5">
              <div className="w-8 sm:w-12 h-1 bg-neutral-800 rounded-full" />
            </div>
            <div className="relative aspect-[9/19] bg-neutral-200 rounded-[8px] sm:rounded-[12px] overflow-hidden">
              <Image
                src={project.mobileImage}
                alt={`${project.name} mobile view`}
                fill
                sizes="140px"
                className="object-cover object-top"
              />
            </div>
            {/* Phone indicator bar */}
            <div className="flex justify-center mt-1">
              <div className="w-6 sm:w-8 h-0.5 bg-neutral-700 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Technology pills */}
      <div className="flex items-center gap-2 mt-10 sm:mt-12 flex-wrap">
        <Smartphone className="w-3.5 h-3.5 text-neutral-400" />
        <span className="text-xs text-neutral-400 uppercase tracking-wider mr-1">Built with</span>
        {project.technologies.map((tech) => (
          <span
            key={tech}
            className="text-xs px-2.5 py-1 rounded-full bg-white border border-neutral-200 text-neutral-600"
          >
            {tech}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export default function WebDesignPortfolio() {
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

      <SectionHeader leftText="PORTFOLIO" rightText="// web design" />

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
              Web Design
            </h1>
            <p className="text-neutral-500 max-w-xl text-base sm:text-lg cursor-default">
              Responsive websites and landing pages that convert. Every project ships desktop and mobile, pixel-perfect across breakpoints.
            </p>
          </div>

          {/* Projects — stacked with dividers */}
          <div className="space-y-0">
            {webProjects.map((project, i) => (
              <div key={project.id}>
                {i > 0 && <div className="w-full line-dash-x my-12 sm:my-16" />}
                <DevicePair project={project} isFirst={i === 0} />
              </div>
            ))}
          </div>
        </InnerContainer>
      </OuterContainer>

      {/* CTA Section */}
      <div className="w-full line-dash-x mt-12 sm:mt-16" />
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
              Need a website that converts?
            </h2>
            <p className="text-neutral-500 mb-8 max-w-md mx-auto cursor-default">
              Book a call and let&apos;s design something your users will love.
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
