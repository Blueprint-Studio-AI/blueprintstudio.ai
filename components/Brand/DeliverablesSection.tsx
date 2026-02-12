"use client";

import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import SectionHeader from "@/components/ui/SectionHeader";

const GreenCheckIcon = () => (
  <svg
    className="shrink-0 mt-0.5"
    width="16"
    height="17"
    viewBox="0 0 16 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 16.5C12.4183 16.5 16 12.9183 16 8.5C16 4.08172 12.4183 0.5 8 0.5C3.58172 0.5 0 4.08172 0 8.5C0 12.9183 3.58172 16.5 8 16.5ZM12.1402 6.76822C12.5645 6.41466 12.6218 5.78409 12.2682 5.35982C11.9147 4.93554 11.2841 4.87821 10.8598 5.23178C8.77424 6.96976 7.16738 9.14507 6.32238 10.4082L5.20711 9.29289C4.81658 8.90237 4.18342 8.90237 3.79289 9.29289C3.40237 9.68342 3.40237 10.3166 3.79289 10.7071L5.05227 11.9665L5.07158 11.9858C5.18281 12.0971 5.30509 12.2194 5.41781 12.3151C5.53751 12.4167 5.74124 12.5732 6.0259 12.6469C6.37714 12.7379 6.73665 12.7013 7.06241 12.5416C7.33043 12.4101 7.5004 12.2102 7.59559 12.0881C7.68769 11.9699 7.78489 11.8223 7.87507 11.6855L7.87509 11.6854L7.89023 11.6625L7.89083 11.6616C8.66198 10.4919 10.1883 8.3948 12.1402 6.76822Z"
      fill="#22D461"
    />
  </svg>
);

const deliverables = [
  {
    id: "identity",
    title: "Logo & Identity",
    items: [
      "Logo system (primary, secondary, icon, lockups)",
      "Color palette with usage rules",
      "Typography pairings with hierarchy",
      "Social kit (profiles, banners, templates)",
    ],
  },
  {
    id: "guidelines",
    title: "Brand Guidelines",
    items: [
      "20-30 page brand book",
      "Voice & tone documentation",
      "Usage rules and clear space",
      "Real-world application examples",
    ],
  },
  {
    id: "ai",
    title: "AI Prompts",
    items: [
      "Pre-configured prompts for your brand voice",
      "Asset generator for on-brand visuals",
      "Works with ChatGPT, Claude, Midjourney",
      "Stay consistent as you scale",
    ],
  },
];

const bonuses = [
  "Email signature template",
  "2-3 application designs",
  "All source files (Figma, fonts)",
];

export default function DeliverablesSection() {
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

      <SectionHeader leftText="DELIVERABLES" rightText="// what you get" />

      <OuterContainer className="flex-1 flex items-center">
        <InnerContainer className="pt-8 sm:pt-12 lg:pt-16 pb-8 sm:pb-12 lg:pb-16 px-2.5 sm:px-6 relative">
          <div className="absolute left-0 top-0 bottom-0 line-dash-y hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y hidden custom:block" />

          {/* Section Title */}
          <div className="text-center mb-10 sm:mb-14">
            <h2
              className="font-medium text-black cursor-default"
              style={{
                fontSize: "clamp(32px, 6vw, 48px)",
                lineHeight: "110%",
                letterSpacing: "-1.5px",
              }}
            >
              Three pillars of
              <br />
              your brand.
            </h2>
          </div>

          {/* Deliverables Grid - 3 columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-neutral-200 max-w-5xl mx-auto border border-neutral-200">
            {deliverables.map((item, index) => (
              <div
                key={item.id}
                className="bg-neutral-100 p-6 sm:p-8 cursor-default group hover:bg-white transition-colors"
              >
                <div className="flex items-baseline gap-3 mb-5">
                  <span className="text-xs text-neutral-400 font-mono">
                    0{index + 1}
                  </span>
                  <h3
                    className="font-medium text-black"
                    style={{
                      fontSize: "clamp(18px, 2.5vw, 22px)",
                      letterSpacing: "-0.5px",
                    }}
                  >
                    {item.title}
                  </h3>
                </div>
                <ul className="space-y-2.5">
                  {item.items.map((listItem) => (
                    <li
                      key={listItem}
                      className="text-neutral-600 text-sm flex items-start gap-2.5"
                    >
                      <GreenCheckIcon />
                      <span>{listItem}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bonuses */}
          <div className="max-w-5xl mx-auto mt-8">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              <span className="text-neutral-400 text-sm">Also included:</span>
              {bonuses.map((bonus, i) => (
                <span key={i} className="text-neutral-600 text-sm">
                  {bonus}
                  {i < bonuses.length - 1 && (
                    <span className="text-neutral-300 ml-6">·</span>
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* Price */}
          <p className="text-center text-neutral-500 mt-10 cursor-default">
            Complete brand package.{" "}
            <span className="text-black font-medium">$18,000.</span>
          </p>
        </InnerContainer>
      </OuterContainer>

      <div className="w-full line-dash-x" />
    </Section>
  );
}
