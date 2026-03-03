"use client";

import { useRef, useEffect, useState } from "react";
import { useScrollTo } from "@/components/SmoothScroll";
import dynamic from "next/dynamic";
import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import FeatureItem from "@/components/ui/FeatureItem";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

function LottieAnimation({ src }: { src: string }) {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch(src)
      .then((res) => res.json())
      .then(setData);
  }, [src]);
  if (!data) return <div className="w-full aspect-video bg-neutral-100 rounded-2xl animate-pulse" />;
  return <Lottie animationData={data} loop autoplay className="w-full h-auto" />;
}

const deliverables = [
  {
    id: "identity",
    num: "01",
    label: "Logo",
    title: "Logo &\nIdentity",
    description: "A complete visual system built to scale. Includes:",
    lottie: "/brand-assets/lottie/visual-identity.json",
    features: [
      { name: "Logo System", detail: "Primary, secondary, icon, and lockup variations" },
      { name: "Color Palette", detail: "Full palette with usage rules and accessibility checks" },
      { name: "Typography", detail: "Type pairings with hierarchy and scale" },
      { name: "Social Kit", detail: "Profiles, banners, and templates for every platform" },
    ],
  },
  {
    id: "guidelines",
    num: "02",
    label: "Guidelines",
    title: "Brand\nGuidelines",
    description: "Everything your team needs to stay on-brand. Includes:",
    lottie: "/brand-assets/lottie/brand-guidelines.json",
    features: [
      { name: "Brand Book", detail: "20-30 page comprehensive brand book" },
      { name: "Voice & Tone", detail: "Documentation for consistent messaging" },
      { name: "Usage Rules", detail: "Clear space, minimum sizes, and do/don'ts" },
      { name: "Application Examples", detail: "Real-world usage across print and digital" },
    ],
  },
  {
    id: "ai",
    num: "03",
    label: "AI Prompts",
    title: "AI\nPrompts",
    description: "Stay on-brand at scale with AI-ready assets. Includes:",
    lottie: "/brand-assets/lottie/ai-prompts.json",
    features: [
      { name: "Brand Voice Prompts", detail: "Pre-configured prompts tuned to your brand voice" },
      { name: "Asset Generator", detail: "Custom prompts for on-brand visual generation" },
      { name: "Platform Support", detail: "Works with ChatGPT, Claude, and Midjourney" },
      { name: "Scale Consistently", detail: "Maintain brand consistency as your team grows" },
    ],
  },
];

export default function DeliverablesSection() {
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([null, null, null]);
  const scrollTo = useScrollTo();

  const scrollToSection = (index: number) => {
    const el = sectionRefs.current[index];
    if (!el) return;
    scrollTo(el, { offset: 0, duration: 1 });
  };

  return (
    <Section className="flex flex-col relative z-20 bg-neutral-50 overflow-hidden">
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

          <div className="text-center mb-8 sm:mb-10">
            <h2 className="font-medium text-black cursor-default text-[clamp(32px,6vw,48px)] leading-[110%] tracking-[-1.5px]">
              Three pillars of
              <br />
              your brand.
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center items-center gap-2 sm:gap-3 mb-8 sm:mb-12">
            {deliverables.map((item, index) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(index)}
                className="flex items-center gap-3 px-3.5 sm:px-4 py-2 bg-white text-black border border-neutral-300 rounded-full cursor-pointer"
              >
                <span className="text-base font-normal text-neutral-400">{item.num}</span>
                <span className="text-base font-normal">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="flex flex-col">
            {deliverables.map((item, index) => (
              <div
                key={item.id}
                ref={(el) => { sectionRefs.current[index] = el; }}
                className={index > 0 ? "mt-16 sm:mt-24" : ""}
              >
                <div className="max-w-5xl mx-auto pl-0 sm:pl-12 space-y-6">
                  {item.lottie && (
                    <div className="w-full max-w-md mx-auto rounded-2xl overflow-hidden">
                      <LottieAnimation src={item.lottie} />
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    <div>
                      <span className="text-3xl font-medium text-neutral-400 mb-3 block">{item.num}</span>
                      <h3 className="font-medium text-black whitespace-pre-line text-[clamp(28px,5vw,44px)] leading-[110%] tracking-[-1px]">
                        {item.title}
                      </h3>
                      <p className="text-neutral-500 text-lg leading-6 mt-4 max-w-xs">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex flex-col">
                      {item.features.map((feature, i) => (
                        <FeatureItem
                          key={feature.name}
                          feature={feature}
                          isLast={i === item.features.length - 1}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </InnerContainer>
      </OuterContainer>

      <div className="w-full line-dash-x" />
    </Section>
  );
}
