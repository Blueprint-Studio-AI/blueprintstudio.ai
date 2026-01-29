"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import SectionHeader from "@/components/ui/SectionHeader";

const steps = [
  {
    number: "01",
    title: "Discovery",
    description:
      "We learn your market, audience, and ambition. Define positioning and messaging that sets you apart.",
    image: "/brand/process-discovery.png",
  },
  {
    number: "02",
    title: "Identity",
    description:
      "Logo system, color palette, typography. We design the core elements that make you recognizable.",
    image: "/brand/process-identity.png",
  },
  {
    number: "03",
    title: "System",
    description:
      "Brand guidelines, social kit, email signature, and 2-3 applications of your choice. Everything you need to stay consistent.",
    image: "/brand/process-system.png",
  },
  {
    number: "04",
    title: "Delivery",
    description:
      "You receive the full brand package plus a custom Brand GPT — an AI trained on your voice and guidelines to keep you on-brand forever.",
    image: "/brand/process-delivery.png",
  },
];

function ProcessStep({
  number,
  title,
  description,
  image,
}: {
  number: string;
  title: string;
  description: string;
  image: string | null;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const scrollingDown = window.scrollY > lastScrollY.current;
      lastScrollY.current = window.scrollY;

      const elementCenter = rect.top + rect.height / 2;

      if (scrollingDown) {
        if (elementCenter < viewportHeight * 0.55 && !isExpanded) {
          setIsExpanded(true);
        }
      } else {
        if (elementCenter > viewportHeight * 0.75 && isExpanded) {
          setIsExpanded(false);
        }
      }
    };

    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", throttledScroll);
  }, [isExpanded]);

  return (
    <div
      ref={ref}
      className="border-b border-neutral-300 last:border-b-0 overflow-hidden relative"
    >
      {/* Full-bleed image on left - slides in from left (desktop only) */}
      {image && (
        <div
          className="absolute left-0 top-0 bottom-0 w-[40%] hidden md:flex items-center justify-center p-6"
          style={{
            transform: isExpanded ? "translateX(0)" : "translateX(-100%)",
            opacity: isExpanded ? 1 : 0,
            transition:
              "transform 800ms cubic-bezier(0.4, 0, 0.2, 1), opacity 600ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <div className="w-full h-auto rounded-xl shadow-lg shadow-black/10 bg-neutral-200 aspect-[3/2] flex items-center justify-center">
            <span className="text-neutral-400 text-sm">{title} visual</span>
          </div>
        </div>
      )}

      {/* Mobile image */}
      {image && (
        <div className="md:hidden mx-4 pt-10">
          <div className="w-full h-auto rounded-xl shadow-lg shadow-black/10 bg-neutral-200 aspect-[3/2] flex items-center justify-center">
            <span className="text-neutral-400 text-sm">{title} visual</span>
          </div>
        </div>
      )}

      {/* Content container */}
      <div className="relative z-10 px-4 sm:px-6 py-6 pb-10 md:py-0">
        {/* Desktop animated wrapper */}
        <div
          className="hidden md:block"
          style={{
            paddingTop: isExpanded ? "5rem" : "2.5rem",
            paddingBottom: isExpanded ? "5rem" : "2.5rem",
            marginLeft: isExpanded ? "40%" : "0",
            transition: "all 800ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <div className="flex items-center gap-3 cursor-default">
            <span
              className="font-medium tabular-nums text-neutral-400"
              style={{
                fontSize: "clamp(28px, 5vw, 40px)",
                lineHeight: 1,
              }}
            >
              {number}
            </span>
            <span
              className="font-medium text-black"
              style={{ fontSize: "clamp(28px, 5vw, 40px)", lineHeight: 1 }}
            >
              {title}
            </span>
          </div>

          <div
            className="overflow-hidden"
            style={{
              maxHeight: isExpanded ? "500px" : "0px",
              opacity: isExpanded ? 1 : 0,
              marginTop: isExpanded ? "2rem" : "0",
              transition:
                "max-height 800ms cubic-bezier(0.4, 0, 0.2, 1), opacity 600ms cubic-bezier(0.4, 0, 0.2, 1) 100ms, margin 800ms cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <p className="text-neutral-600 text-base sm:text-lg leading-relaxed max-w-md">
              {description}
            </p>
          </div>
        </div>

        {/* Mobile static content */}
        <div className="md:hidden">
          <div className="flex items-center gap-2 cursor-default mb-3">
            <span className="font-medium tabular-nums text-neutral-400 text-xl">
              {number}
            </span>
            <span className="font-medium text-black text-xl">{title}</span>
          </div>
          <p className="text-neutral-600 text-sm leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

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

          {/* Steps */}
          <div className="border-t border-neutral-300 -mx-2.5 sm:-mx-6">
            {steps.map((step, index) => (
              <ProcessStep
                key={index}
                number={step.number}
                title={step.title}
                description={step.description}
                image={step.image}
              />
            ))}
          </div>
        </InnerContainer>
      </OuterContainer>

      <div className="w-full line-dash-x" />
    </Section>
  );
}
