"use client";

import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import SectionHeader from "@/components/ui/SectionHeader";

const steps = [
  {
    number: "01",
    title: "Kickoff",
    description:
      "1-hour call. We learn your product, market, goals, and timeline. Define the narrative that ties everything together.",
    timing: "Day 1",
  },
  {
    number: "02",
    title: "Brand",
    description:
      "Strategy, logo, colors, typography, guidelines. You approve the foundation before we build on it.",
    timing: "Weeks 1-2",
  },
  {
    number: "03",
    title: "Build",
    description:
      "Website design and development. Pitch deck narrative and design. All working in parallel.",
    timing: "Weeks 2-5",
  },
  {
    number: "04",
    title: "Video",
    description:
      "Script, storyboard, production. We use the brand and website assets to create a cohesive launch video.",
    timing: "Weeks 4-5",
  },
  {
    number: "05",
    title: "Launch",
    description:
      "Final review, revisions, handoff. You get all source files, logins, and your Brand GPT. Ready to go live.",
    timing: "Week 6",
  },
];

export default function ProcessSection() {
  return (
    <Section className="flex flex-col relative z-20 bg-neutral-50 overflow-hidden">
      {/* Vertical lines */}
      <div className="absolute inset-0 flex justify-center pointer-events-none px-2.5 sm:px-[60px]">
        <div className="w-full flex-1 flex justify-center relative">
          <div className="absolute left-0 top-0 bottom-0 line-dash-y custom:hidden" />
          <div className="absolute left-0 top-0 bottom-0 w-px bg-neutral-300 hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y custom:hidden" />
          <div className="absolute right-0 top-0 bottom-0 w-px bg-neutral-300 hidden custom:block" />
        </div>
      </div>

      <SectionHeader leftText="PROCESS" rightText="// how it works" />

      <OuterContainer className="flex-1 flex items-center">
        <InnerContainer className="pt-8 sm:pt-12 lg:pt-16 pb-8 sm:pb-12 lg:pb-16 px-2.5 sm:px-6 relative">
          <div className="absolute left-0 top-0 bottom-0 line-dash-y hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y hidden custom:block" />

          {/* Section Title */}
          <div className="text-center mb-8 sm:mb-12">
            <h2
              className="font-medium text-black cursor-default"
              style={{
                fontSize: "clamp(32px, 6vw, 48px)",
                lineHeight: "110%",
                letterSpacing: "-1px",
              }}
            >
              How It Works
            </h2>
          </div>

          {/* Timeline Steps */}
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {/* Vertical line connecting steps */}
              <div className="absolute left-[23px] top-8 bottom-8 w-px bg-neutral-200 hidden sm:block" />

              <div className="space-y-6">
                {steps.map((step, index) => (
                  <div key={index} className="flex gap-4 sm:gap-6">
                    {/* Step number circle */}
                    <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center shrink-0 text-sm font-medium relative z-10">
                      {step.number}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-lg text-black cursor-default">
                          {step.title}
                        </h3>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-500 font-medium">
                          {step.timing}
                        </span>
                      </div>
                      <p className="text-neutral-600 text-sm leading-relaxed cursor-default">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </InnerContainer>
      </OuterContainer>

      <div className="w-full line-dash-x" />
    </Section>
  );
}
