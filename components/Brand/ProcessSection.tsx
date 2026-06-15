"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import { ChevronLeft } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Discover",
    description:
      "We learn your market, your audience, and what makes you different. One call, one brief, no fluff.",
  },
  {
    number: "02",
    title: "Strategy",
    description:
      "Positioning, messaging, and a creative direction that translates your advantage into something people feel.",
  },
  {
    number: "03",
    title: "Identity",
    description:
      "Logo system, color palette, typography, patterns. The visual building blocks of your brand, designed as a cohesive system.",
  },
  {
    number: "04",
    title: "Delivery",
    description:
      "Brand book, social kit, application templates, and AI prompts—everything you need to stay on-brand as you scale.",
  },
];

export default function ProcessSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    stepRefs.current.forEach((ref, index) => {
      if (!ref) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveStep(index);
            setHasScrolled(true);
          }
        },
        { threshold: 0.6 }
      );
      observer.observe(ref);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <>
      {/* Steps */}
      <section className="flex-1 flex justify-center items-center flex-col px-2.5 sm:px-[60px] relative z-20 bg-neutral-50">
        <SectionHeader leftText="LAUNCH PACKAGE" rightText="// FOR FOUNDERS" />

        <OuterContainer className="flex-1 flex items-center">
          <InnerContainer className="pt-16 sm:pt-24 lg:pt-28 pb-16 sm:pb-24 lg:pb-28 px-2.5 sm:px-6 relative">
            <h2
              className="font-medium text-black cursor-default mb-16 sm:mb-20"
              style={{
                fontSize: "clamp(28px, 5vw, 44px)",
                lineHeight: "110%",
                letterSpacing: "-1.5px",
              }}
            >
              Four steps,
              <br />
              <span className="text-neutral-300">starting at </span>
              three weeks
            </h2>

            <div className="flex flex-col relative px-[48px]">
              <div
                className="absolute left-0 top-0 bottom-0 line-dash-y hidden custom:block"
                style={{
                  maskImage:
                    "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
                  WebkitMaskImage:
                    "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
                }}
              />
              <div
                className="absolute right-0 top-0 bottom-0 line-dash-y hidden custom:block"
                style={{
                  maskImage:
                    "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
                  WebkitMaskImage:
                    "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
                }}
              />
              {steps.map((step, index) => {
                const isActive = hasScrolled
                  ? index === activeStep
                  : index === 0;
                const isLast = index === steps.length - 1;
                return (
                  <div
                    key={step.number}
                    ref={(el) => { stepRefs.current[index] = el; }}
                    onMouseEnter={() => setActiveStep(index)}
                    className="cursor-default"
                  >
                    <div
                      className="transition-opacity duration-300 ease-out py-6 sm:py-8"
                      style={{ opacity: isActive ? 1 : 0.2 }}
                    >
                      <div className="flex items-start sm:items-center gap-3 sm:gap-0">
                        <div className="flex items-baseline gap-3 sm:gap-4 shrink-0 sm:w-[280px]">
                          <span
                            className="text-neutral-400 font-medium"
                            style={{
                              fontSize: "clamp(14px, 2vw, 18px)",
                              letterSpacing: "-0.5px",
                            }}
                          >
                            {step.number}
                          </span>
                          <span
                            className="font-semibold text-black"
                            style={{
                              fontSize: "clamp(18px, 3vw, 24px)",
                              letterSpacing: "-0.5px",
                            }}
                          >
                            {step.title}
                          </span>
                        </div>

                        <div className="flex-1 flex items-center justify-between gap-4">
                          <p className="text-neutral-500 text-sm sm:text-base leading-relaxed max-w-lg">
                            {step.description}
                          </p>
                          <ChevronLeft
                            className="w-5 h-5 shrink-0 text-neutral-400 transition-opacity duration-300"
                            style={{ opacity: isActive ? 1 : 0 }}
                          />
                        </div>
                      </div>
                    </div>
                    {!isLast && (
                      <div className="border-t border-neutral-200" />
                    )}
                  </div>
                );
              })}
            </div>
          </InnerContainer>
        </OuterContainer>
      </section>

      {/* Thumbprint transition */}
      <div className="relative w-full z-10 overflow-visible bg-neutral-50">
        <div className="relative w-full overflow-visible" style={{ aspectRatio: "1440 / 500" }}>
          {/* Blue gradient BEHIND thumbprints — bottom 50% */}
          <div
            className="absolute bottom-0 left-0 right-0 z-0"
            style={{
              height: "50%",
              background:
                "linear-gradient(to bottom, rgba(51,166,247,0) 0%, rgba(51,166,247,0.14) 10%, rgba(51,166,247,0.35) 25%, rgba(51,166,247,1) 45%, rgba(20,114,246,1) 65%, rgba(68,77,235,1) 100%)",
            }}
          />

          {/* Thumbprint image — extends 20% above container */}
          <div
            className="absolute left-0 right-0 bottom-0 select-none pointer-events-none z-[1]"
            style={{
              height: "120%",
              mixBlendMode: "multiply",
              opacity: 0.85,
              maskImage:
                "linear-gradient(to bottom, transparent 0%, transparent 15%, black 70%, black 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, transparent 15%, black 70%, black 100%)",
            }}
          >
            <Image
              src="/images/thumbprints.webp"
              alt=""
              fill
              className="object-cover object-bottom"
              draggable={false}
              sizes="100vw"
              quality={100}
              unoptimized
              priority
            />
          </div>

          {/* Single curved path with vertical Gaussian blur creates a smooth gradient
              that perfectly follows the curve contour — no banding, no rings. */}
          <svg
            viewBox="-100 0 1640 600"
            preserveAspectRatio="none"
            className="absolute bottom-0 left-0 right-0 w-full block pointer-events-none z-[2]"
            style={{ height: "60%", overflow: "visible" }}
          >
            <defs>
              <filter id="softCurve" x="-20%" y="-50%" width="140%" height="200%">
                <feGaussianBlur stdDeviation="15 70" />
              </filter>
            </defs>
            {/* Blurred curve — extends past viewBox so vertical edges are off-screen */}
            <g filter="url(#softCurve)">
              <path
                d="M-200,500 C480,260 960,260 1640,500 L1640,800 L-200,800 Z"
                fill="white"
              />
            </g>
            {/* Solid curve at the bottom — also extends past viewBox to avoid edge artifacts */}
            <path
              d="M-200,600 C480,470 960,470 1640,600 L1640,600 L-200,600 Z"
              fill="white"
            />
          </svg>
        </div>

        {/* Text */}
        <div className="w-full bg-white flex justify-center px-2.5 sm:px-[60px] pt-12 sm:pt-20 pb-36 sm:pb-48">
          <h2
            className="text-center font-medium cursor-default"
            style={{
              fontSize: "clamp(26px, 5vw, 44px)",
              lineHeight: "130%",
              letterSpacing: "-1px",
            }}
          >
            <span className="text-neutral-400">We&apos;re not just talk,</span>
            <br />
            <span className="text-black">we let our work speak for itself.</span>
          </h2>
        </div>
      </div>
    </>
  );
}
