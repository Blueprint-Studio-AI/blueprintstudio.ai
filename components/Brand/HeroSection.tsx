"use client";

import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import GradientButton from "@/components/ui/GradientButton";
import SocialProof from "@/components/ui/SocialProof";

export default function HeroSection() {
  return (
    <Section className="relative z-20 bg-neutral-50 overflow-hidden min-h-fit">
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
        rightText="// for founders"
      />

      <OuterContainer className="flex-1 flex items-center">
        <InnerContainer className="pt-16 sm:pt-24 lg:pt-32 pb-16 sm:pb-24 lg:pb-32 px-2.5 sm:px-6 relative">
          <div className="absolute left-0 top-0 bottom-0 line-dash-y hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y hidden custom:block" />

          <div className="flex flex-col items-center text-center gap-6 max-w-3xl mx-auto">
            <h1
              className="font-medium text-black cursor-default tracking-[-2.5px]"
              style={{
                fontSize: "clamp(32px, 7vw, 56px)",
                lineHeight: "115%",
              }}
            >
              480,000 new businesses launch every month.
              <br className="hidden sm:block" />
              <span className="text-neutral-400"> Most look the same.</span>
            </h1>

            <p className="text-neutral-500 cursor-default text-[clamp(14px,2vw,18px)] leading-[150%] max-w-lg">
              We build brand identities that make companies impossible to&nbsp;ignore.
            </p>

            <SocialProof showDivider>
              <span className="font-medium text-neutral-900">25+</span>{" "}
              brands launched
            </SocialProof>

            <GradientButton
              className="w-full sm:w-auto"
              onClick={() =>
                window.open(
                  "https://cal.com/blueprint-studio/intro-call",
                  "_blank"
                )
              }
            >
              Book a Call
              <ArrowUpRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </GradientButton>
          </div>
        </InnerContainer>
      </OuterContainer>

      <div className="w-full line-dash-x" />
    </Section>
  );
}
