"use client";

import Image from "next/image";
import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import SectionHeader from "@/components/ui/SectionHeader";

const founders = [
  {
    name: "Jaidon Lalor",
    bio: "Ran an award-winning film company for 5 years. Lead 100+ documentary and commercial projects across Europe, Central America, and the US. Now works in design.",
    image: "/images/jaidon-circle.png",
  },
  {
    name: "Tyler Stupart",
    bio: "A service and brand designer who's helped companies grow. From startups crafting their first pitch, to corporations redesigning customer experience at scale.",
    image: "/images/tyler-circle.png",
  },
];

export default function FoundersSection() {
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

      <SectionHeader leftText="TEAM" rightText="// who's behind this" />

      <OuterContainer className="flex-1 flex items-center">
        <InnerContainer className="pt-8 sm:pt-12 lg:pt-16 pb-8 sm:pb-12 lg:pb-16 px-2.5 sm:px-6 relative">
          <div className="absolute left-0 top-0 bottom-0 line-dash-y hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y hidden custom:block" />

          {/* Section Title */}
          <div className="text-center mb-12 sm:mb-16">
            <h2
              className="font-medium text-black cursor-default"
              style={{
                fontSize: "clamp(32px, 6vw, 48px)",
                lineHeight: "110%",
                letterSpacing: "-1px",
              }}
            >
              Built by Founders, for Founders
            </h2>
          </div>

          {/* 2 Column Layout for Founders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-6 max-w-3xl mx-auto mb-12">
            {founders.map((founder, index) => (
              <div key={index} className="text-left">
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  {founder.image ? (
                    <Image
                      src={founder.image}
                      alt={founder.name}
                      width={128}
                      height={128}
                      className="w-14 h-14 sm:w-20 sm:h-20 object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 sm:w-20 sm:h-20 bg-neutral-200 flex-shrink-0 flex items-center justify-center text-neutral-400 text-sm sm:text-base font-medium">
                      {founder.name[0]}
                    </div>
                  )}
                  <h3 className="font-medium text-lg sm:text-xl text-black cursor-default">
                    {founder.name}
                  </h3>
                </div>
                <p className="text-neutral-600 text-sm sm:text-base leading-relaxed cursor-default">
                  {founder.bio}
                </p>
              </div>
            ))}
          </div>
        </InnerContainer>
      </OuterContainer>

      <div className="w-full line-dash-x" />
    </Section>
  );
}
