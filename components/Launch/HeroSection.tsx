"use client";

import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import { ArrowUpRight, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
        leftText="FULL LAUNCH"
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
        rightText="// flagship"
      />

      <OuterContainer className="flex-1 flex items-center">
        <InnerContainer className="pt-8 sm:pt-20 lg:pt-28 pb-8 sm:pb-20 lg:pb-28 px-2.5 sm:px-6 relative">
          {/* Inner dashed lines */}
          <div className="absolute left-0 top-0 bottom-0 line-dash-y hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y hidden custom:block" />

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left: Text Content */}
            <div className="flex flex-col gap-6">
              <h1
                className="font-medium text-black cursor-default"
                style={{
                  fontSize: "clamp(36px, 8vw, 64px)",
                  lineHeight: "105%",
                  letterSpacing: "-1.5px",
                }}
              >
                Everything you need to&nbsp;launch.
              </h1>

              <p
                className="text-neutral-600 cursor-default"
                style={{
                  fontSize: "clamp(16px, 2.5vw, 20px)",
                  lineHeight: "150%",
                }}
              >
                Brand identity. Website. Pitch deck. Launch video. One team,
                one price, six&nbsp;weeks.
              </p>

              {/* Social Proof */}
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <span className="text-sm text-neutral-600 cursor-default">
                  Trusted by YC W25 & W26 founders
                </span>
              </div>

              {/* CTA Button */}
              <button
                className="w-fit py-3 px-6 font-medium flex items-center justify-center bg-black text-white rounded-lg hover:bg-neutral-800 transition-all duration-200 text-sm group"
                onClick={() =>
                  window.open(
                    "https://cal.com/blueprint-studio/intro-call",
                    "_blank"
                  )
                }
              >
                <span>Book a Call</span>
                <ArrowUpRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>

            {/* Right: Launch Package Visual */}
            <div className="relative overflow-hidden bg-neutral-100 rounded-xl aspect-[4/3]">
              {/* Grid showing all 4 deliverables */}
              <div className="absolute inset-0 p-6">
                <div className="grid grid-cols-2 gap-3 h-full">
                  <div className="bg-neutral-200 rounded-lg flex items-center justify-center">
                    <span className="text-neutral-400 text-xs font-medium">
                      Brand
                    </span>
                  </div>
                  <div className="bg-neutral-200 rounded-lg flex items-center justify-center">
                    <span className="text-neutral-400 text-xs font-medium">
                      Website
                    </span>
                  </div>
                  <div className="bg-neutral-200 rounded-lg flex items-center justify-center">
                    <span className="text-neutral-400 text-xs font-medium">
                      Pitch Deck
                    </span>
                  </div>
                  <div className="bg-neutral-200 rounded-lg flex items-center justify-center">
                    <span className="text-neutral-400 text-xs font-medium">
                      Video
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </InnerContainer>
      </OuterContainer>

      <div className="w-full line-dash-x" />
    </Section>
  );
}
