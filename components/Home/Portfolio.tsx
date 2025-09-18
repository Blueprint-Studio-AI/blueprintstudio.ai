
"use client";
import { useState } from "react";
import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const projects = [
  { id: 1, description: "Ecommerce Platform for IID Verification Company" },
  { id: 2, description: "Project Description 2" },
  { id: 3, description: "Project Description 3" },
  { id: 4, description: "Project Description 4" },
];

export default function Portfolio() {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % projects.length);
  };

  const prevSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + projects.length) % projects.length);
  };

  const onDragEnd = (event, info) => {
    const { offset, velocity } = info;
    if (offset.x > 100) {
      prevSlide();
    } else if (offset.x < -100) {
      nextSlide();
    }
  };

  return (
    <Section className="flex flex-col relative z-20 bg-neutral-50 overflow-hidden">
      {/* Artificial vertical lines to match the background */}
      <div className="absolute inset-0 flex justify-center pointer-events-none px-2.5 sm:px-[60px]">
        <div className="w-full flex-1 flex justify-center relative">
          {/* Left dashed vertical line (mobile) / solid line (desktop) */}
          <div className="absolute left-0 top-0 bottom-0 line-dash-y custom:hidden" />
          <div className="absolute left-0 top-0 bottom-0 w-px bg-neutral-300 hidden custom:block" />
          
          {/* Right dashed vertical line (mobile) / solid line (desktop) */}
          <div className="absolute right-0 top-0 bottom-0 line-dash-y custom:hidden" />
          <div className="absolute right-0 top-0 bottom-0 w-px bg-neutral-300 hidden custom:block" />
        </div>
      </div>
      <SectionHeader leftText="PORTFOLIO" rightText={`/ item ${activeIndex + 1} ⋯ ${projects.length}`} />

      <OuterContainer className="flex-1 flex items-center">
        <InnerContainer className="text-center pt-8 sm:pt-12 lg:pt-16 pb-8 sm:pb-12 lg:pb-16 px-2.5 sm:px-6 relative">
          <h1 
            className="font-medium text-black mb-12 sm:mb-16 lg:mb-20"
            style={{
              fontSize: 'clamp(41px, 8vw, 68px)',
              lineHeight: 'clamp(97%, 1vw, 100%)',
              letterSpacing: '-2.04px'
            }}
          >
            Featured Projects
          </h1>

          <div className="relative flex items-center justify-center w-full h-[444px] sm:h-[480px]">
            <AnimatePresence initial={false}>
              {[-1, 0, 1].map((offset) => {
                const index = (activeIndex + offset + projects.length) % projects.length;
                return (
                  <motion.div
                    key={index}
                    className="absolute flex items-center justify-center"
                    initial={{ opacity: 0, x: `${offset * 100}%` }}
                    animate={{ 
                      opacity: offset === 0 ? 1 : 0.3,
                      x: `${offset * 50}%`,
                      scale: offset === 0 ? 1 : 0.8,
                      zIndex: offset === 0 ? 1 : 0,
                    }}
                    exit={{ opacity: 0, x: `${offset * 100}%` }}
                    transition={{ duration: 0.5 }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={onDragEnd}
                  >
                    <div className="w-[250px] h-[444px] sm:w-[853px] sm:h-[480px] bg-neutral-200 rounded-[20px] border border-neutral-300" />
                  </motion.div>
                );
              })}
            </AnimatePresence>
            <button onClick={prevSlide} className="absolute left-0 z-10 p-4 bg-white/50 rounded-full backdrop-blur-sm">
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button onClick={nextSlide} className="absolute right-0 z-10 p-4 bg-white/50 rounded-full backdrop-blur-sm">
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
          <p className="text-neutral-500 text-xs font-normal leading-[128%] tracking-[-0.24px] mt-8">
            {projects[activeIndex].description}
          </p>
          <div className="h-16" />
        </InnerContainer>
      </OuterContainer>
    </Section>
  );
}
