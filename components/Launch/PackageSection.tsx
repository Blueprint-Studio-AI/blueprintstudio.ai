"use client";

import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import SectionHeader from "@/components/ui/SectionHeader";

const packageItems = [
  {
    title: "Brand Identity",
    subtitle: "The foundation.",
    items: [
      "Brand strategy & positioning",
      "Logo system (primary, secondary, icon)",
      "Color palette & typography",
      "Brand guidelines (20-30 pages)",
      "Social kit (profiles, banners, templates)",
      "Email signature",
      "Brand GPT — AI trained on your voice",
    ],
  },
  {
    title: "Website",
    subtitle: "Your home online.",
    items: [
      "Strategy & sitemap",
      "Custom design (Figma)",
      "Development (Framer or Webflow)",
      "Mobile responsive",
      "SEO foundations",
      "CMS for blog/updates (if needed)",
      "Analytics setup",
    ],
  },
  {
    title: "Pitch Deck",
    subtitle: "Tell your story.",
    items: [
      "Narrative strategy",
      "12-20 slides, fully designed",
      "Investor-ready formatting",
      "Speaker notes",
      "Editable source file (Figma or Google Slides)",
    ],
  },
  {
    title: "Launch Video",
    subtitle: "Announce with impact.",
    items: [
      "Script & storyboard",
      "30-60 second runtime",
      "Screen recordings + motion graphics",
      "Professional voiceover (optional)",
      "Optimized for social + embed",
      "1 round of revisions",
    ],
  },
];

function PackageCard({
  title,
  subtitle,
  items,
}: {
  title: string;
  subtitle: string;
  items: string[];
}) {
  return (
    <div className="p-6 rounded-xl border border-neutral-200 bg-white hover:border-neutral-300 transition-colors">
      <h3 className="font-medium text-xl text-black mb-1 cursor-default">
        {title}
      </h3>
      <p className="text-neutral-500 text-sm mb-4 cursor-default">{subtitle}</p>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="text-neutral-400 text-sm">•</span>
            <span className="text-neutral-700 text-sm">{item}</span>
          </li>
        ))}
      </ul>
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

      <SectionHeader leftText="THE PACKAGE" rightText="// everything you get" />

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
              One Package. Complete Launch.
            </h2>
          </div>

          {/* Package Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {packageItems.map((item, index) => (
              <PackageCard
                key={index}
                title={item.title}
                subtitle={item.subtitle}
                items={item.items}
              />
            ))}
          </div>
        </InnerContainer>
      </OuterContainer>

      <div className="w-full line-dash-x" />
    </Section>
  );
}
