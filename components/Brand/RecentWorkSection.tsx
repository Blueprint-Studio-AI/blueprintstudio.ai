"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import Image from "next/image";

const BWB = "/brand-assets/brands-weve-built";

const brandProjects = [
  { id: "uni", name: "UNI", image: `${BWB}/uni_brands-we-built.png` },
  { id: "autara", name: "Autara", image: `${BWB}/autara_brands-we-built.png` },
  { id: "huch", name: "Huch", image: `${BWB}/huch_brands-we-built.png` },
  { id: "honeyb", name: "HoneyB", image: `${BWB}/honeyb_brands-we-built.png` },
  { id: "breeze", name: "Breeze", image: `${BWB}/breeze_brands-we-built.png` },
];

export default function RecentWorkSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > activeIndex ? 1 : -1);
      setActiveIndex(index);
    },
    [activeIndex]
  );

  const project = brandProjects[activeIndex];

  return (
    <Section
      id="portfolio"
      className="flex flex-col relative z-20 bg-neutral-100 overflow-hidden"
    >
      <div className="absolute inset-0 flex justify-center pointer-events-none px-2.5 sm:px-[60px]">
        <div className="w-full flex-1 flex justify-center relative">
          <div className="absolute left-0 top-0 bottom-0 line-dash-y custom:hidden" />
          <div className="absolute left-0 top-0 bottom-0 w-px bg-neutral-300 hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y custom:hidden" />
          <div className="absolute right-0 top-0 bottom-0 w-px bg-neutral-300 hidden custom:block" />
        </div>
      </div>

      <SectionHeader leftText="PORTFOLIO" rightText="// recent brands" />

      <OuterContainer className="flex-1 flex items-center">
        <InnerContainer className="pt-8 sm:pt-12 lg:pt-16 pb-8 sm:pb-12 lg:pb-16 px-2.5 sm:px-6 relative">
          <div className="absolute left-0 top-0 bottom-0 line-dash-y hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y hidden custom:block" />

          <div className="text-center mb-10 sm:mb-12">
            <h2 className="font-medium text-black cursor-default text-[clamp(32px,6vw,48px)] leading-[110%] tracking-[-1.5px]">
              Brands we&apos;ve<br/>built&nbsp;to&nbsp;last
            </h2>
            <p className="text-neutral-500 mt-3 cursor-default">
              Each delivered in 3 weeks or less
            </p>
          </div>

          <div className="max-w-lg mx-auto">
            <div className="relative overflow-hidden drop-shadow-xl">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={project.id}
                  custom={direction}
                  initial={{ x: direction > 0 ? "100%" : "-100%", opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: direction > 0 ? "-100%" : "100%", opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <div className="relative w-full aspect-[4/3]">
                    <Image
                      src={project.image}
                      alt={project.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 512px"
                      className="object-contain"
                    />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-center gap-2 mt-6">
              {brandProjects.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors cursor-pointer ${
                    i === activeIndex ? "bg-neutral-900" : "bg-neutral-300 hover:bg-neutral-400"
                  }`}
                  aria-label={`View ${brandProjects[i].name}`}
                />
              ))}
            </div>
          </div>
        </InnerContainer>
      </OuterContainer>

      <div className="w-full line-dash-x" />
    </Section>
  );
}
