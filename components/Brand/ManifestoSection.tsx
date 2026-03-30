"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import SectionHeader from "@/components/ui/SectionHeader";

const blocks = [
  {
    stat: "32% more revenue.",
    body: "McKinsey studied 300 companies over five years. The ones in the top quartile of design outperformed their peers by a third. Brand is a growth engine. Treat it like one.",
  },
  {
    stat: "3x the sales volume.",
    body: "Strong brands capture three times the sales of weak ones. Your brand should feel like your company, just more so. It amplifies who you already are -- your unique value made visible through personality, color, shape, and feeling.",
  },
  {
    stat: "68% of businesses agree:",
    body: "Brand consistency drives 10% or more revenue growth. Strategy made visible. Not a logo slapped on a slide deck -- a system that compounds every time someone encounters your company.",
  },
];

function ManifestoBlock({
  stat,
  body,
  index,
}: {
  stat: string;
  body: string;
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
      className={index > 0 ? "mt-14 sm:mt-20" : ""}
    >
      <h3
        className="font-semibold text-white cursor-default tracking-tight"
        style={{
          fontSize: "clamp(24px, 5vw, 36px)",
          lineHeight: "120%",
        }}
      >
        {stat}
      </h3>
      <p className="text-neutral-400 mt-4 cursor-default text-[clamp(14px,2vw,17px)] leading-[160%] max-w-xl">
        {body}
      </p>
    </motion.div>
  );
}

export default function ManifestoSection() {
  return (
    <Section className="flex flex-col relative z-20 bg-neutral-900 overflow-hidden">
      <div className="absolute inset-0 flex justify-center pointer-events-none px-2.5 sm:px-[60px]">
        <div className="w-full flex-1 flex justify-center relative">
          <div className="absolute left-0 top-0 bottom-0 line-dash-y border-neutral-700 custom:hidden" />
          <div className="absolute left-0 top-0 bottom-0 w-px bg-neutral-700 hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y border-neutral-700 custom:hidden" />
          <div className="absolute right-0 top-0 bottom-0 w-px bg-neutral-700 hidden custom:block" />
        </div>
      </div>

      <SectionHeader leftText="THE INSIGHT" rightText="// why brand matters" />

      <OuterContainer className="flex-1 flex items-center">
        <InnerContainer className="pt-12 sm:pt-20 lg:pt-24 pb-12 sm:pb-20 lg:pb-24 px-2.5 sm:px-6 relative">
          <div className="absolute left-0 top-0 bottom-0 line-dash-y border-neutral-700 hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y border-neutral-700 hidden custom:block" />

          <div className="max-w-2xl">
            {blocks.map((block, i) => (
              <ManifestoBlock
                key={i}
                stat={block.stat}
                body={block.body}
                index={i}
              />
            ))}
          </div>
        </InnerContainer>
      </OuterContainer>

      <div className="w-full line-dash-x border-neutral-700" />
    </Section>
  );
}
