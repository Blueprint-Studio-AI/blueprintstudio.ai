"use client";

import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import { ArrowUpRight, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const deliverables = [
  { num: "01", label: "Logo" },
  { num: "02", label: "Guidelines" },
  { num: "03", label: "Social Kit" },
  { num: "04", label: "AI Prompts" },
];

export default function HeroSection() {
  return (
    <Section className="relative z-20 bg-neutral-50 overflow-hidden min-h-fit">
      {/* Vertical lines */}
      <div className="absolute inset-0 flex justify-center pointer-events-none px-2.5 sm:px-[60px]">
        <div className="w-full flex-1 flex justify-center relative">
          <div className="absolute left-0 top-0 bottom-0 line-dash-y custom:hidden" />
          <div className="absolute left-0 top-0 bottom-0 w-px bg-neutral-300 hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y custom:hidden" />
          <div className="absolute right-0 top-0 bottom-0 w-px bg-neutral-300 hidden custom:block" />
        </div>
      </div>

      <SectionHeader
        leftText="BRAND IDENTITY"
        centerContent={
          <Link href="/" className="hover:opacity-70 transition-opacity">
            <Image
              src="/blueprint-logo-dark.svg"
              alt="Blueprint Studio"
              width={80}
              height={20}
              className="h-3 sm:h-4 w-auto"
            />
          </Link>
        }
        rightText="$18K"
      />

      <OuterContainer className="flex-1 flex items-center">
        <InnerContainer className="text-center pt-16 sm:pt-24 lg:pt-32 pb-16 sm:pb-24 lg:pb-32 px-2.5 sm:px-6 relative">
          <div className="absolute left-0 top-0 bottom-0 line-dash-y hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y hidden custom:block" />

          {/* Headline */}
          <h1
            className="font-medium text-black cursor-default mb-8 sm:mb-10"
            style={{
              fontSize: "clamp(44px, 9vw, 80px)",
              lineHeight: "95%",
              letterSpacing: "-2.5px",
            }}
          >
            Your brand.
            <br />
            3 weeks.
          </h1>

          {/* Deliverables - numbered pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10 sm:mb-12">
            {deliverables.map((item) => (
              <div
                key={item.num}
                className="flex items-center gap-2 px-3 py-1.5 bg-neutral-100 border border-neutral-200 rounded-full cursor-default hover:bg-neutral-200/50 transition-colors"
              >
                <span className="text-[10px] font-mono text-neutral-400">
                  {item.num}
                </span>
                <span className="text-sm text-neutral-700 font-medium">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* Subhead */}
          <p
            className="text-neutral-500 cursor-default max-w-md mx-auto mb-8 sm:mb-10"
            style={{
              fontSize: "clamp(16px, 2vw, 18px)",
              lineHeight: "150%",
            }}
          >
            Logo, guidelines, and AI prompts for on-brand content.
            <br />
            Built for founders who move fast.
          </p>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-3 mb-10 sm:mb-12">
            <div className="flex -space-x-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <div className="w-px h-4 bg-neutral-300" />
            <span className="text-sm text-neutral-600 cursor-default tracking-tight">
              <span className="font-medium text-neutral-900">25+</span> brands shipped
            </span>
          </div>

          {/* CTA */}
          <button
            className="py-4 px-8 font-medium bg-black text-white rounded-lg hover:bg-neutral-800 transition-colors text-sm group inline-flex items-center cursor-pointer"
            onClick={() =>
              window.open(
                "https://cal.com/blueprint-studio/intro-call",
                "_blank"
              )
            }
          >
            <span>Book a Call</span>
            <ArrowUpRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </InnerContainer>
      </OuterContainer>

      <div className="w-full line-dash-x" />
    </Section>
  );
}
