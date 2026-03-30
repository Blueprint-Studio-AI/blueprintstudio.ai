"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import SectionHeader from "@/components/ui/SectionHeader";

const steps = [
  {
    number: "01",
    title: "Discovery",
    description:
      "We learn your market, your audience, and what makes you different. One call, one brief, zero fluff.",
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
      "Brand book, social kit, application templates, and AI prompts -- everything you need to stay on-brand as you scale.",
  },
];

function ProcessStep({
  number,
  title,
  description,
  index,
  isLast,
}: {
  number: string;
  title: string;
  description: string;
  index: number;
  isLast: boolean;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      className={`py-8 sm:py-10 ${!isLast ? "border-b border-neutral-200" : ""}`}
    >
      <div className="flex items-start gap-4 sm:gap-6">
        <span
          className="font-medium tabular-nums text-neutral-300 shrink-0"
          style={{
            fontSize: "clamp(24px, 4vw, 36px)",
            lineHeight: 1,
          }}
        >
          {number}
        </span>
        <div className="flex-1">
          <h3
            className="font-medium text-black cursor-default tracking-tight"
            style={{
              fontSize: "clamp(20px, 3.5vw, 28px)",
              lineHeight: "120%",
            }}
          >
            {title}
          </h3>
          <p className="text-neutral-500 text-sm sm:text-base leading-[150%] mt-2 max-w-lg">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function ProcessSection() {
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

      <SectionHeader leftText="PROCESS" rightText="// 3 weeks" />

      <OuterContainer className="flex-1 flex items-center">
        <InnerContainer className="pt-8 sm:pt-12 lg:pt-16 pb-8 sm:pb-12 lg:pb-16 px-2.5 sm:px-6 relative">
          <div className="absolute left-0 top-0 bottom-0 line-dash-y hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y hidden custom:block" />

          <div className="text-center mb-8 sm:mb-12">
            <h2
              className="font-medium text-black cursor-default"
              style={{
                fontSize: "clamp(32px, 6vw, 48px)",
                lineHeight: "110%",
                letterSpacing: "-1.5px",
              }}
            >
              Four Steps. Three Weeks.
            </h2>
          </div>

          <div className="max-w-2xl mx-auto">
            {steps.map((step, index) => (
              <ProcessStep
                key={step.number}
                number={step.number}
                title={step.title}
                description={step.description}
                index={index}
                isLast={index === steps.length - 1}
              />
            ))}
          </div>

          <p className="text-center text-neutral-500 mt-10 sm:mt-14 cursor-default text-sm sm:text-base">
            Tried and tested across 25+ startups.
          </p>
        </InnerContainer>
      </OuterContainer>

      <div className="w-full line-dash-x" />
    </Section>
  );
}
