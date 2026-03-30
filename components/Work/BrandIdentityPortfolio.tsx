"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import DeliverablePill from "@/components/ui/DeliverablePill";

interface BrandProject {
  id: string;
  name: string;
  tagline: string;
  description: string;
  accentColor: string;
  heroImage: string;
  brandCard: string;
  deliverables: string[];
  spotlightImages?: string[];
}

const brandProjects: BrandProject[] = [
  {
    id: "uni",
    name: "UNI",
    tagline: "Japanese Street Food Brand",
    description:
      "Bold, playful identity for a fast-casual concept launching in LA. Logo system, type & palette, and a visual language rooted in Japanese street culture.",
    accentColor: "#E8392A",
    heroImage: "/launch-assets/brand-identity_assets/brand-identity_UNI.png",
    brandCard: "/brand-assets/brands-weve-built/uni_brands-we-built.png",
    deliverables: ["Logo System", "Color Palette", "Typography", "Brand Guidelines"],
  },
  {
    id: "autara",
    name: "Autara",
    tagline: "Developer-First AI Platform",
    description:
      "Clean, technical identity for a Series A infrastructure startup. Precise geometry, monospace accents, and a palette built for developer trust.",
    accentColor: "#6366F1",
    heroImage: "/launch-assets/brand-identity_assets/brand-identity_autara.png",
    brandCard: "/brand-assets/brands-weve-built/autara_brands-we-built.png",
    deliverables: ["Logo System", "Visual Identity", "Brand Deck", "Social Kit"],
  },
  {
    id: "huch",
    name: "Huch",
    tagline: "Gaming Cases Marketplace",
    description:
      "Bold, dark identity built for a competitive gaming audience. Sharp edges, neon accents, and a system designed to feel fast and premium.",
    accentColor: "#16A34A",
    heroImage: "/launch-assets/brand-identity_assets/brand-identity_huch.png",
    brandCard: "/brand-assets/brands-weve-built/huch_brands-we-built.png",
    deliverables: ["Full Rebrand", "Logo System", "Color Palette", "Web Design"],
  },
  {
    id: "honeyb",
    name: "HoneyB",
    tagline: "Bitcoin Rewards Platform",
    description:
      "Warm, approachable identity for a Bitcoin cashback platform. Honeycomb motifs, golden tones, and a brand that makes crypto feel friendly.",
    accentColor: "#F59E0B",
    heroImage: "/brand-assets/brands-weve-built/honeyb_brands-we-built.png",
    brandCard: "/brand-assets/brands-weve-built/honeyb_brands-we-built.png",
    deliverables: ["Logo System", "Brand Guidelines", "Social Kit", "Component Library"],
    spotlightImages: [
      "/launch-assets/honeyb-spotlight/honeyb-logos.png",
      "/launch-assets/honeyb-spotlight/brand-kit-1.png",
      "/launch-assets/honeyb-spotlight/brand-kit-2.png",
    ],
  },
  {
    id: "breeze",
    name: "Breeze",
    tagline: "Bitcoin Infrastructure",
    description:
      "Serene, modern identity for a Bitcoin infrastructure product on Arch Network. Soft gradients, clean geometry, and calm confidence.",
    accentColor: "#38BDF8",
    heroImage: "/brand-assets/brands-weve-built/breeze_brands-we-built.png",
    brandCard: "/brand-assets/brands-weve-built/breeze_brands-we-built.png",
    deliverables: ["Logo System", "Visual Identity", "Framer Site", "Social Kit"],
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

function BrandCard({ project, index }: { project: BrandProject; index: number }) {
  const isLarge = index === 0 || index === 3;
  const gridClass = isLarge
    ? "md:col-span-2"
    : "md:col-span-1";

  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={fadeUp}
      className={gridClass}
    >
      <div className="group relative overflow-hidden rounded-xl bg-neutral-200">
        {/* Hero Image */}
        <div className={`relative w-full ${isLarge ? "aspect-[16/9]" : "aspect-[4/3]"}`}>
          <Image
            src={project.heroImage}
            alt={`${project.name} brand identity`}
            fill
            sizes={isLarge ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
          {/* Accent color bar */}
          <div
            className="absolute top-0 left-0 w-1 h-full"
            style={{ backgroundColor: project.accentColor }}
          />
        </div>

        {/* Info */}
        <div className="p-5 sm:p-6 bg-white">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg sm:text-xl font-semibold text-black tracking-tight">
              {project.name}
            </h3>
            <span className="text-sm text-neutral-400">{project.tagline}</span>
          </div>
          <p className="text-neutral-500 text-sm leading-relaxed mb-4 max-w-xl">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {project.deliverables.map((d, i) => (
              <DeliverablePill
                key={d}
                num={String(i + 1).padStart(2, "0")}
                label={d}
                size="sm"
              />
            ))}
          </div>
        </div>
      </div>

      {/* HoneyB Spotlight Images */}
      {project.spotlightImages && project.spotlightImages.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mt-3">
          {project.spotlightImages.map((src) => (
            <div key={src} className="relative aspect-square rounded-lg overflow-hidden bg-neutral-200">
              <Image
                src={src}
                alt={`${project.name} brand detail`}
                fill
                sizes="(max-width: 768px) 33vw, 22vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default function BrandIdentityPortfolio() {
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

      <SectionHeader leftText="PORTFOLIO" rightText="// brand identity" />

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
              Brand Identity
            </h1>
            <p className="text-neutral-500 max-w-xl text-base sm:text-lg cursor-default">
              Logo systems, color palettes, typography, and brand guidelines that give startups the presence of an established company from day one.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {brandProjects.map((project, i) => (
              <BrandCard key={project.id} project={project} index={i} />
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
                15+
              </span>
              <span className="text-[10px] sm:text-sm text-neutral-400 uppercase tracking-wider sm:tracking-widest mt-2 text-center leading-relaxed">
                Brands<br className="sm:hidden" /> Built
              </span>
            </div>
            <div className="flex flex-col items-center justify-center py-10 sm:py-14 border-x border-neutral-300">
              <span
                className="font-semibold text-black tracking-tight"
                style={{ fontSize: "clamp(22px, 4vw, 32px)" }}
              >
                3 Weeks
              </span>
              <span className="text-[10px] sm:text-sm text-neutral-400 uppercase tracking-wider sm:tracking-widest mt-2 text-center leading-relaxed">
                Avg.<br className="sm:hidden" /> Turnaround
              </span>
            </div>
            <div className="flex flex-col items-center justify-center py-10 sm:py-14">
              <span
                className="font-semibold text-black tracking-tight"
                style={{ fontSize: "clamp(22px, 4vw, 32px)" }}
              >
                $18K
              </span>
              <span className="text-[10px] sm:text-sm text-neutral-400 uppercase tracking-wider sm:tracking-widest mt-2 text-center leading-relaxed">
                Starting<br className="sm:hidden" /> At
              </span>
            </div>
          </div>
        </InnerContainer>
      </OuterContainer>
      <div className="w-full line-dash-x" />

      {/* CTA Section */}
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
              Ready to build your brand?
            </h2>
            <p className="text-neutral-500 mb-8 max-w-md mx-auto cursor-default">
              Book a call and let&apos;s create an identity that sets you apart.
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
