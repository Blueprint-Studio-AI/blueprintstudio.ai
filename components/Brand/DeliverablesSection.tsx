"use client";

import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import { Check } from "lucide-react";

const deliverables = [
  {
    title: "Brand Strategy",
    description: "Positioning, messaging pillars, voice and tone guidelines",
  },
  {
    title: "Logo System",
    description:
      "Primary logo, secondary marks, icon, lockups, clear space rules",
  },
  {
    title: "Color Palette",
    description: "Primary, secondary, and accent colors with usage guidelines",
  },
  {
    title: "Typography",
    description: "Font pairings, hierarchy, and usage rules",
  },
  {
    title: "Brand Guidelines",
    description: "20-30 page document covering all of the above",
  },
  {
    title: "Social Kit",
    description: "Profile images, banners, and post templates for major platforms",
  },
  {
    title: "Email Signature",
    description: "On-brand signature template",
  },
  {
    title: "Brand GPT",
    description: "Custom AI trained on your brand voice and guidelines",
  },
  {
    title: "2-3 Applications",
    description:
      "You choose: pitch deck template, app icon, merch mockups, investor one-pager, event graphics, etc.",
  },
];

export default function DeliverablesSection() {
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

      <SectionHeader leftText="DELIVERABLES" rightText="// what you get" />

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
              What&apos;s Included
            </h2>
          </div>

          {/* Deliverables Grid */}
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {deliverables.map((item, index) => (
                <div
                  key={index}
                  className="p-5 rounded-xl border border-neutral-200 bg-white hover:border-neutral-300 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-black mb-1 cursor-default">
                        {item.title}
                      </h3>
                      <p className="text-neutral-500 text-sm leading-relaxed cursor-default">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </InnerContainer>
      </OuterContainer>

      <div className="w-full line-dash-x" />
    </Section>
  );
}
