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
    title: "Focus",
    description:
      "We meet and distill your pitch to one clear message. What to emphasize, what to cut.",
    image: "/launch-videos/focus.png",
  },
  {
    number: "02",
    title: "Script",
    description:
      "We choose a proven format based on what works for your product. Lock in the script. Approve storyboard.",
    image: "/launch-videos/script.png",
  },
  {
    number: "03",
    title: "Production",
    description:
      "Send us your product, Figma, or GitHub repo. We create recordings and animations using proven visual formats optimized for speed. We're based in SF; in-person shoots available.",
    image: "/launch-videos/production.png",
  },
  {
    number: "04",
    title: "Delivery",
    description:
      "Receive a first cut of your video in 7 days. One round of edits included (+2-3 days).",
    image: "/launch-videos/delivery.png",
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

      // Element's center position relative to viewport
      const elementCenter = rect.top + rect.height / 2;
      const viewportCenter = viewportHeight / 2;

      // Expand when element center is in top 60% of viewport (scrolling down)
      // Collapse when element center goes below 70% of viewport (scrolling up)
      if (scrollingDown) {
        // Scrolling down: expand when center passes 55% from top
        if (elementCenter < viewportHeight * 0.55 && !isExpanded) {
          setIsExpanded(true);
        }
      } else {
        // Scrolling up: collapse when center goes below 75% from top
        if (elementCenter > viewportHeight * 0.75 && isExpanded) {
          setIsExpanded(false);
        }
      }
    };

    // Throttle scroll handler
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
    handleScroll(); // Initial check

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
            transition: "transform 800ms cubic-bezier(0.4, 0, 0.2, 1), opacity 600ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <Image
            src={image}
            alt={title}
            width={600}
            height={400}
            className="w-full h-auto rounded-xl shadow-lg shadow-black/10"
          />
        </div>
      )}

      {/* Mobile image - shows above content on small screens (no animation) */}
      {image && (
        <div className="md:hidden mx-4 pt-10">
          <Image
            src={image}
            alt={title}
            width={600}
            height={400}
            className="w-full h-auto rounded-xl shadow-lg shadow-black/10"
          />
        </div>
      )}

      {/* Content container - animated on desktop, static on mobile */}
      <div
        className="relative z-10 px-4 sm:px-6 py-6 pb-10 md:py-0"
        style={{
          paddingTop: undefined,
          paddingBottom: undefined,
        }}
      >
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
          {/* Number + Title row */}
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

          {/* Expanded content: Description */}
          <div
            className="overflow-hidden"
            style={{
              maxHeight: isExpanded ? "500px" : "0px",
              opacity: isExpanded ? 1 : 0,
              marginTop: isExpanded ? "2rem" : "0",
              transition: "max-height 800ms cubic-bezier(0.4, 0, 0.2, 1), opacity 600ms cubic-bezier(0.4, 0, 0.2, 1) 100ms, margin 800ms cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <p className="text-neutral-600 text-base sm:text-lg leading-relaxed max-w-md">
              {description}
            </p>
          </div>
        </div>

        {/* Mobile static content (no animation) */}
        <div className="md:hidden">
          {/* Number + Title row */}
          <div className="flex items-center gap-2 cursor-default mb-3">
            <span
              className="font-medium tabular-nums text-neutral-400 text-xl"
            >
              {number}
            </span>
            <span
              className="font-medium text-black text-xl"
            >
              {title}
            </span>
          </div>

          {/* Description - always visible on mobile */}
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

          {/* Steps - Full width accordion */}
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
