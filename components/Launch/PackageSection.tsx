"use client";

import { useState } from "react";
import Image from "next/image";
import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import { Palette, Globe, Presentation, Play } from "lucide-react";

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

const packageItems = [
  {
    id: "brand",
    title: "Brand Identity",
    example: "/launch/example-brand.png",
    exampleAlt: "Brand identity example",
    icon: Palette,
    items: [
      "Logo system (primary, secondary, icon, lockups)",
      "Color palette & typography",
      "20-30 page brand guidelines",
      "Social kit (profiles, banners, templates)",
      "AI prompt setup with brand asset generator",
    ],
  },
  {
    id: "website",
    title: "Website",
    example: "/launch/example-website.png",
    exampleAlt: "Website example",
    icon: Globe,
    items: [
      "World-class design with custom animations",
      "Built in Framer, Next.js, or Astro",
      "Fully responsive across all devices",
      "CMS for blog & content updates",
      "SEO foundations & analytics",
    ],
  },
  {
    id: "deck",
    title: "Pitch Deck",
    example: "/launch/example-deck.png",
    exampleAlt: "Pitch deck example",
    icon: Presentation,
    items: [
      "Narrative strategy & story arc",
      "Fully designed slides in Figma",
      "Speaker notes & flow guidance",
      "Editable source file",
    ],
  },
  {
    id: "video",
    title: "Launch Video",
    example: "/launch/example-video.png",
    exampleAlt: "Launch video example",
    icon: Play,
    items: [
      "Script & storyboard",
      "30-60 second video",
      "Screen recordings + motion graphics",
      "Optimized for social & embed",
    ],
  },
];

function PackageCard({
  item,
  index,
}: {
  item: (typeof packageItems)[0];
  index: number;
}) {
  const [imageError, setImageError] = useState(false);
  const Icon = item.icon;

  return (
    <div className="bg-neutral-50 cursor-default group hover:bg-white transition-colors flex flex-col relative">
      {/* Numbered tab */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full border border-neutral-200 shadow-sm">
        <span className="text-[10px] font-mono text-neutral-500">
          0{index + 1}
        </span>
        <span className="text-xs font-medium text-neutral-700">
          {item.title}
        </span>
      </div>

      {/* Example Image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100">
        {!imageError ? (
          <Image
            src={item.example}
            alt={item.exampleAlt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-neutral-100 to-neutral-200">
            <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center shadow-sm">
              <Icon className="w-6 h-6 text-neutral-400" />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 sm:p-8 flex-1">
        <h3
          className="font-medium text-black mb-5"
          style={{
            fontSize: "clamp(20px, 3vw, 24px)",
            letterSpacing: "-0.5px",
          }}
        >
          {item.title}
        </h3>
        <ul className="space-y-2.5">
          {item.items.map((listItem) => (
            <li
              key={listItem}
              className="text-neutral-600 text-sm sm:text-base flex items-start gap-2.5"
            >
              <GreenCheckIcon />
              <span>{listItem}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function PackageSection() {
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

      <SectionHeader leftText="THE PACKAGE" rightText="// what you get" />

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
              Four deliverables.
              <br />
              One unified brand.
            </h2>
          </div>

          {/* Package Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-neutral-200 max-w-5xl mx-auto border border-neutral-200">
            {packageItems.map((item, index) => (
              <PackageCard key={item.id} item={item} index={index} />
            ))}
          </div>

          {/* Price note */}
          <p className="text-center text-neutral-500 mt-12 sm:mt-16 cursor-default">
            All four deliverables.{" "}
            <span className="text-black font-medium">$50,000.</span>
          </p>
        </InnerContainer>
      </OuterContainer>

      <div className="w-full line-dash-x" />
    </Section>
  );
}
