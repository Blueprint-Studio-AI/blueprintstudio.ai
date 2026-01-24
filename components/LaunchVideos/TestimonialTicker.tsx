"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import SectionHeader from "@/components/ui/SectionHeader";

const testimonials = [
  {
    quote:
      "I actually fucking love this version, I got goosebumps",
    name: "Sina Meraji",
    position: "CMO",
    company: "Jinba",
    batch: "YC W26",
    image: "/testimonials/sina.jpg",
  },
  {
    quote:
      "You guys are getting great reviews. Even though we haven't started publicizing on social media. You guys did a great job!",
    name: "Sam Karu",
    position: "CEO",
    company: "Logical",
    batch: "YC W25",
    image: "/testimonials/sam-karu.jpg",
  },
  {
    quote:
      "Anyone who sees the video buys the product. Working with you guys is like eating chocolate. We can't go back.",
    name: "Daniel Greene",
    position: "COO",
    company: "TokenWorks",
    batch: "",
    image: "/testimonials/daniel-greene.jpg",
  },
  {
    quote:
      "Thanks again bro, you've really outdone yourselves again, especially with such a tight deadline. The video is doing bits on X, it looks sick!!!",
    name: "Diego",
    position: "CEO",
    company: "Pyra",
    batch: "YC W25",
    image: "/testimonials/diego.jpeg",
  },
  {
    quote: "The AV3 launch was great, thanks to you guys!! Thanks for the hard work.",
    name: "Charles Cagliostro",
    position: "CEO",
    company: "TokenWorks",
    batch: "",
    image: "/testimonials/charles.png",
  },
  {
    quote:
      "I absolutely love the video and feel it captures our company impeccably.",
    name: "Julia Zema",
    position: "CMO",
    company: "Hildene",
    batch: "",
    image: "/testimonials/julia.jpg",
  },
];

function TestimonialCard({
  quote,
  name,
  position,
  company,
  batch,
  image,
}: {
  quote: string;
  name: string;
  position: string;
  company: string;
  batch: string;
  image: string | null;
}) {
  return (
    <div className="flex-shrink-0 w-[260px] sm:w-[340px] h-[190px] sm:h-[220px] p-4 sm:p-6 rounded-2xl border border-neutral-300 bg-white flex flex-col justify-between transition-shadow duration-300 hover:shadow-[0_4px_16px_rgba(59,130,246,0.15)]">
      {/* Quote at top */}
      <p className="text-neutral-700 text-sm sm:text-base leading-relaxed cursor-default">
        &ldquo;{quote}&rdquo;
      </p>

      {/* Author at bottom */}
      <div className="flex items-center gap-2 sm:gap-3">
        {image ? (
          <Image
            src={image}
            alt={name}
            width={40}
            height={40}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-500 text-xs sm:text-sm font-medium flex-shrink-0">
            {name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
        )}
        <div>
          <p className="font-medium text-black text-xs sm:text-sm cursor-default">{name}</p>
          <p className="text-neutral-500 text-[10px] sm:text-xs cursor-default">
            {position}, {company}
            {batch && (
              <span className="ml-1.5 sm:ml-2 px-1 sm:px-1.5 py-0.5 rounded bg-neutral-200 text-neutral-600 text-[10px] sm:text-xs font-medium">
                {batch}
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialTicker() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollPosition = 0;
    const speed = 0.5; // pixels per frame

    const animate = () => {
      scrollPosition += speed;

      // Reset when we've scrolled half (since we duplicate content)
      const halfWidth = scrollContainer.scrollWidth / 2;
      if (scrollPosition >= halfWidth) {
        scrollPosition = 0;
      }

      scrollContainer.scrollLeft = scrollPosition;
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <Section className="flex flex-col relative z-20 bg-neutral-100 overflow-hidden">
      {/* Vertical lines */}
      <div className="absolute inset-0 flex justify-center pointer-events-none px-2.5 sm:px-[60px]">
        <div className="w-full flex-1 flex justify-center relative">
          <div className="absolute left-0 top-0 bottom-0 line-dash-y custom:hidden" />
          <div className="absolute left-0 top-0 bottom-0 w-px bg-neutral-300 hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y custom:hidden" />
          <div className="absolute right-0 top-0 bottom-0 w-px bg-neutral-300 hidden custom:block" />
        </div>
      </div>

      <SectionHeader leftText="TESTIMONIALS" rightText="// what founders say" />

      <OuterContainer className="flex-1 flex items-center">
        <InnerContainer className="pt-8 sm:pt-12 lg:pt-16 pb-16 sm:pb-20 lg:pb-28 px-0 relative">
          <div className="absolute left-0 top-0 bottom-0 line-dash-y hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y hidden custom:block" />

          {/* Section Title */}
          <div className="text-center mb-8 sm:mb-12 px-2.5 sm:px-6">
            <h2
              className="font-medium text-black cursor-default"
              style={{
                fontSize: "clamp(32px, 6vw, 48px)",
                lineHeight: "110%",
                letterSpacing: "-1px",
              }}
            >
              What Founders Say
            </h2>
          </div>

          {/* Ticker Container */}
          <div className="relative">
            {/* Left fade */}
            <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-neutral-100 to-transparent z-10 pointer-events-none" />
            {/* Right fade */}
            <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-neutral-100 to-transparent z-10 pointer-events-none" />

            {/* Scrolling content */}
            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-hidden hide-scrollbar py-6"
              style={{ scrollBehavior: "auto" }}
            >
              {/* Duplicate testimonials for infinite scroll effect */}
              {[...testimonials, ...testimonials].map((testimonial, index) => (
                <TestimonialCard key={index} {...testimonial} />
              ))}
            </div>
          </div>
        </InnerContainer>
      </OuterContainer>

      <div className="w-full line-dash-x" />
    </Section>
  );
}
