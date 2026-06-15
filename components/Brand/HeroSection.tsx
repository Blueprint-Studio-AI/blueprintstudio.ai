"use client";

import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import GradientButton from "@/components/ui/GradientButton";
import GradientText from "@/components/ui/GradientText";
import SocialProof from "@/components/ui/SocialProof";
import HeroCardCarousel from "./HeroCardCarousel";

export default function HeroSection() {
  // No z-index on the section: the DepthSection's thumbprints rise up behind
  // the card row (above this section's background, below the carousel itself).
  return (
    <Section className="relative bg-[#FAFAFA] overflow-hidden min-h-fit">
      {/* Top nav — logo on the left with a full-width divider beneath (matches Figma) */}
      <div className="w-full">
        <div className="flex items-center py-4 sm:py-5">
          <Link href="/" className="hover:opacity-70 transition-opacity">
            <Image
              src="/blueprint-logo-dark.svg"
              alt="Blueprint Studio"
              width={173}
              height={23}
              className="h-5 sm:h-6 w-auto"
              priority
            />
          </Link>
        </div>
        <div className="relative left-1/2 w-screen -translate-x-1/2 border-b border-neutral-200" />
      </div>

      <OuterContainer className="flex-1 flex items-center">
        <InnerContainer className="pt-16 sm:pt-24 lg:pt-28 pb-12 sm:pb-16 px-2.5 sm:px-6 relative">
          <div className="flex flex-col items-center text-center gap-6 max-w-2xl mx-auto">
            <h1 className="font-medium text-black cursor-default text-[clamp(32px,8vw,60px)] leading-[118%] tracking-[-2.5px]">
              <span className="box-decoration-clone rounded-lg bg-[#DCE7FF] px-2 sm:px-3">
                <GradientText>Elevate your brand</GradientText>
              </span>
              <br />
              in three weeks.
            </h1>

            <SocialProof showDivider>
              <span className="font-medium text-neutral-900">25+</span> startups launched
            </SocialProof>

            {/* Book a call — the press thumbprint sits behind the button and peeks
                out top/bottom. */}
            <div className="relative mt-2 flex justify-center">
              <Image
                src="/media/hero/press-thumbprint.png"
                alt=""
                aria-hidden
                width={167}
                height={184}
                className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-auto w-28 -translate-x-1/2 -translate-y-1/2 select-none sm:w-32"
                draggable={false}
              />
              <GradientButton
                className="relative z-10"
                // Figma "Book a call" spec: 52px tall, 12px radius, 16px text,
                // 86px side padding (→ ~271px wide), 12px gap to the arrow.
                style={{
                  height: 52,
                  paddingLeft: 86,
                  paddingRight: 86,
                  borderRadius: 12,
                  fontSize: 16,
                }}
                onClick={() =>
                  window.open("https://cal.com/blueprint-studio/intro-call", "_blank")
                }
              >
                Book a call
                <ArrowUpRight className="w-4 h-4 ml-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </GradientButton>
            </div>
          </div>

          {/* Swipeable brand-card catalog (full-bleed). z-30 keeps the cards above
              the thumbprint tips rising up from the section below. */}
          <div className="relative z-30 mt-12 sm:mt-16">
            <HeroCardCarousel />
          </div>
        </InnerContainer>
      </OuterContainer>
    </Section>
  );
}
