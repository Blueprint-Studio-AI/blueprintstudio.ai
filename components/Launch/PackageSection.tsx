"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import { Palette, Globe, Presentation, Play } from "lucide-react";
import { ValueOf } from "next/dist/shared/lib/constants";
import GreenCheckmark from "@/components/ui/GreenCheckmark";

const packageItems = [
  {
    id: "brand",
    num: "01",
    label: "Brand",
    title: "Brand\nIdentity",
    description: "A complete visual system that is fully built to scale. Includes:",
    icon: Palette,
    features: [
      { name: "Logo System", detail: "Primary, secondary, icon, and lockup variations" },
      { name: "Design System", detail: "Typography, color palette, visual language" },
      { name: "Social Kit", detail: "Profiles, banners, and templates for every platform" },
      { name: "AI Prompting", detail: "Brand asset generator setup with custom prompts" },
    ],
    workSubtitle: "Recent client work",
    workHeading: "Brands we've built",
    gallery: [
      "/images/work/LivingPersona-Desktop1.png",
      "/images/work/ProjectMetaVison-Desktop1.png",
    ],
  },
  {
    id: "website",
    num: "02",
    label: "Website",
    title: "Website",
    description: "A world-class site designed and built to convert. Includes:",
    icon: Globe,
    features: [
      { name: "Custom Design", detail: "World-class design with custom animations" },
      { name: "Development", detail: "Built in Framer, Next.js, or Astro" },
      { name: "Responsive", detail: "Fully responsive across all devices" },
      { name: "CMS & SEO", detail: "Content management, SEO foundations, and analytics" },
    ],
    workSubtitle: "Recent client work",
    workHeading: "Sites we've built to convert",
    gallery: [
      "/images/work/LivingPersona-Desktop1.png",
      "/images/work/ProjectMetaVison-Desktop1.png",
    ],
  },
  {
    id: "deck",
    num: "03",
    label: "Deck",
    title: "Pitch\nDeck",
    description: "A compelling narrative designed to close rounds. Includes:",
    icon: Presentation,
    features: [
      { name: "Narrative Strategy", detail: "Story arc and flow designed to persuade" },
      { name: "Slide Design", detail: "Fully designed slides in Figma" },
      { name: "Speaker Notes", detail: "Speaker notes and flow guidance" },
      { name: "Source Files", detail: "Editable source file for future updates" },
    ],
    workSubtitle: "Recent client work",
    workHeading: "Stories we've helped tell",
    gallery: [
      "/images/work/LivingPersona-Desktop1.png",
      "/images/work/ProjectMetaVison-Desktop1.png",
    ],
  },
  {
    id: "video",
    num: "04",
    label: "Video",
    title: "Launch\nVideo",
    description: "A short-form video built for traction. Includes:",
    icon: Play,
    features: [
      { name: "Script & Storyboard", detail: "Full creative direction from concept to final" },
      { name: "Production", detail: "30–60 second video with motion graphics" },
      { name: "Screen Recordings", detail: "Product walkthroughs and screen captures" },
      { name: "Platform Optimized", detail: "Optimized for social and embed" },
    ],
    workSubtitle: "Recent client work",
    workHeading: "Videos that drive traction",
    gallery: [
      "/images/work/LivingPersona-Desktop1.png",
      "/images/work/ProjectMetaVison-Desktop1.png",
    ],
  },
];

type PackageItem = typeof packageItems[0];

function FeatureItem({
  feature,
  isOpen,
  onToggle,
}: {
  feature: { name: string; detail: string };
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="w-full text-left py-6 border-b border-neutral-200 cursor-pointer group"
    >
      <div className="flex items-center gap-4">
        <GreenCheckmark />
        <span className="text-md font-normal text-black">{feature.name}</span>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <p className="text-[16px] text-neutral-500 mt-3 pl-9">{feature.detail}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}

function PackageContent({ item }: { item: PackageItem }) {
  const [openFeature, setOpenFeature] = useState<number | null>(null);

  return (
    <div className="max-w-5xl mx-auto pl-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {/* Left: Number, Title, Description */}
        <div>
          <span className="text-5xl font-medium text-neutral-400 mb-3 block">{item.num}</span>
          <h3 className="font-medium text-black whitespace-pre-line text-[clamp(40px,6vw,64px)] leading-[110%] tracking-[-1px]">
            {item.title}
          </h3>
          <p className="text-neutral-500 text-lg leading-6 mt-4 max-w-xs">
            {item.description}
          </p>
        </div>

        {/* Right: Interactive Feature Checklist */}
        <div className="flex flex-col">
          {item.features.map((feature, i) => (
            <FeatureItem
              key={feature.name}
              feature={feature}
              isOpen={openFeature === i}
              onToggle={() => setOpenFeature(openFeature === i ? null : i)}
            />
          ))}
        </div>
      </div>

      {/* Work Section */}
      <div className="mt-24 text-center">
        <p className="text-base font-medium text-neutral-500">{item.workSubtitle}</p>
        <h4 className="text-2xl font-medium text-black mt-2">{item.workHeading}</h4>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
        {item.gallery.map((src, i) => (
          <div
            key={i}
            className="relative aspect-[4/3] bg-neutral-100 rounded-lg overflow-hidden"
          >
            <Image
              src={src}
              alt={`${item.label} example ${i + 1}`}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PackageSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const handleTabChange = (index: number) => {
    if (index === activeIndex) return;
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

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
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="font-medium text-black cursor-default text-[clamp(32px,6vw,48px)] leading-[110%] tracking-[-1.5px]">
              Four deliverables.
              <br />
              One unified brand.
            </h2>
          </div>

          {/* Deliverable Pills */}
          <div className="flex justify-center flex-wrap gap-2.5 mb-8 sm:mb-12">
            {packageItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => handleTabChange(index)}
                className={`flex items-center gap-3 px-3.5 sm:px-4 py-2 rounded-full text-sm border transition-all duration-200 cursor-pointer ${
                  activeIndex === index
                    ? "bg-white text-black border-neutral-300 shadow-[0_1px_4px_0_rgba(0,0,0,0.25),0_0_27.791px_0_rgba(255,255,255,0.58)]"
                    : "bg-transparent text-neutral-400 border-neutral-200 hover:text-neutral-600 hover:border-neutral-300"
                }`}
              >
                <span className={`text-base font-normal ${activeIndex === index ? "text-neutral-400" : "text-neutral-200"}`}>{item.num}</span>
                <span className="text-base font-normal">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Animated Content */}
          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={packageItems[activeIndex].id}
                custom={direction}
                initial={{ opacity: 0, x: direction * 80 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -80 }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <PackageContent item={packageItems[activeIndex]} />
              </motion.div>
            </AnimatePresence>
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
