"use client";

import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import SectionHeader from "@/components/ui/SectionHeader";

export default function ProblemSection() {
  return (
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

      <SectionHeader
        leftText="THE PROBLEM"
        rightText="// why founders fail at launch"
      />

      <OuterContainer className="flex-1 flex items-center">
        <InnerContainer className="pt-12 sm:pt-16 lg:pt-24 pb-12 sm:pb-16 lg:pb-24 px-2.5 sm:px-6 relative">
          <div className="absolute left-0 top-0 bottom-0 line-dash-y hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y hidden custom:block" />

          <div className="max-w-3xl mx-auto">
            {/* Headline */}
            <h2
              className="font-medium text-black cursor-default mb-8 sm:mb-12"
              style={{
                fontSize: "clamp(32px, 6vw, 48px)",
                lineHeight: "110%",
                letterSpacing: "-1px",
              }}
            >
              Launching is a mess.
            </h2>

            {/* Body Copy */}
            <div className="space-y-6">
              <p
                className="text-neutral-600 cursor-default"
                style={{
                  fontSize: "clamp(16px, 2.5vw, 20px)",
                  lineHeight: "160%",
                }}
              >
                You&apos;re juggling four vendors. Brand agency. Web dev. Deck
                designer. Video team.
              </p>

              <p
                className="text-neutral-600 cursor-default"
                style={{
                  fontSize: "clamp(16px, 2.5vw, 20px)",
                  lineHeight: "160%",
                }}
              >
                Different timelines. Different styles. Different prices. Nothing
                connects.
              </p>

              <p
                className="text-neutral-600 cursor-default"
                style={{
                  fontSize: "clamp(16px, 2.5vw, 20px)",
                  lineHeight: "160%",
                }}
              >
                You spend more time project managing than building your product.
              </p>

              <p
                className="text-black font-medium cursor-default"
                style={{
                  fontSize: "clamp(18px, 3vw, 24px)",
                  lineHeight: "160%",
                }}
              >
                We fix that.
              </p>

              <p
                className="text-neutral-600 cursor-default"
                style={{
                  fontSize: "clamp(16px, 2.5vw, 20px)",
                  lineHeight: "160%",
                }}
              >
                One team. One timeline. One cohesive launch.
              </p>
            </div>
          </div>
        </InnerContainer>
      </OuterContainer>

      <div className="w-full line-dash-x" />
    </Section>
  );
}
