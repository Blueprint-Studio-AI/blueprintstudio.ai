"use client";
import { useState, useRef, useEffect } from "react";
import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import SectionHeader from "../ui/SectionHeader";
import { Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    quote: "Blueprint's design subscription gave us an affordable way to bring our digital vision to life. Their relentless dedication and talent accelerated our progress tremendously. Blueprint's blend of design talent and cutting edge ai expertise is truly unique and highly valuable.",
    author: "Andrew Jenkins",
    role: "Former VP of Engineering, Credit Karma",
    company: "Currently Startup Co-Founder"
  },
  {
    id: 2,
    quote: "Design or strategy needs? Check out Blueprint. They're a really capable team with an impressive background and confidence in their craft. We've been working with them the last two months and continue to do so.",
    author: "Scott Zimmer",
    role: "Former EVP of Innovation, Truist Bank",
    company: "Currently Startup Co-Founder"
  },
  {
    id: 3,
    quote: "Blueprint's ability to deeply understand our needs and translate them into smart solutions was an absolute home run.",
    author: "Steven Luis Howell",
    role: "CEO & Co-Founder",
    company: "Project Metavision"
  },
  {
    id: 4,
    quote: "Blueprint has been an invaluable partner for our service design efforts. Tyler and his team bring a unique blend of creativity, expertise, and professionalism to every project. They consistently deliver innovative solutions that not only meet our business goals but also exceed our expectations.",
    author: "Mauricio Manhaes",
    role: "President",
    company: "SDN Academic Task Force"
  },
  {
    id: 5,
    quote: "Blueprint reduced the time it takes to explain our business from three minutes to 30 seconds. This helped us gain valuable partnerships and create marketing materials that resonate with our audience. Blueprint offers reliable, professional, and speedy service that takes the guesswork out of your public-facing operations.",
    author: "Alex Escudero",
    role: "Co-Founder",
    company: "Project Metavision"
  }
];

export default function TestimonialSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const scrollPosition = container.scrollTop;
    const cardHeight = container.children[0]?.clientHeight || 0;
    const gap = 24; // gap between cards
    const cardWithGap = cardHeight + gap;
    
    const newIndex = Math.round(scrollPosition / cardWithGap);
    setActiveIndex(Math.min(Math.max(0, newIndex), testimonials.length - 1));
  };

  const scrollToCard = (index: number) => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const cardHeight = container.children[0]?.clientHeight || 0;
    const gap = 24;
    const cardWithGap = cardHeight + gap;
    
    container.scrollTo({
      top: index * cardWithGap,
      behavior: 'smooth'
    });
    setActiveIndex(index);
  };

  return (
    <Section className="flex flex-col relative z-20 bg-neutral-100 overflow-hidden">
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

      <SectionHeader leftText="TESTIMONIALS" rightText="trusted + proven" />

      {/* Main Content */}
      <OuterContainer className="flex-1 flex items-center">
        <InnerContainer className="pt-8 sm:pt-12 lg:pt-16 py-8 sm:pb-12 lg:pb-16 px-0 sm:px-0 relative">
          {/* Inner dashed vertical lines on desktop */}
          <div className="absolute left-0 top-0 bottom-0 line-dash-y hidden custom:block z-20" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y hidden custom:block z-20" />
          
          {/* Testimonials Container with Scroll Indicators */}
          <div className="flex gap-0 justify-center items-center">
            {/* Scrollable Cards Container with Gradient Overlays */}
            <div className="flex-1 relative">
              {/* Top fade gradient */}
              <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-neutral-100 to-transparent z-10 pointer-events-none" />

              {/* Bottom fade gradient */}
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-neutral-100 to-transparent z-10 pointer-events-none" />

              <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex flex-col gap-6 overflow-y-auto snap-y snap-mandatory scroll-smooth hide-scrollbar px-2.5 md:px-6 py-8"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  height: '340px'
                }}
              >
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="inline-flex flex-col items-start gap-2 p-6 md:p-8 rounded-3xl border border-neutral-300/50 bg-neutral-50 flex-shrink-0 snap-center"
                  style={{ 
                    minHeight: '256px'
                  }}
                >
                  <Quote className="w-8 h-8 text-neutral-400 mb-4 hidden md:block" />
                  <p className="text-base md:text-lg text-neutral-700 mb-6 leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                  <div className="mt-auto">
                    <p className="font-medium text-black text-base">{testimonial.author}</p>
                    <p className="text-sm text-neutral-500">{testimonial.role}, {testimonial.company}</p>
                  </div>
                </div>
              ))}
              </div>
            </div>

            {/* Scroll Indicators */}
            <div className="flex flex-col gap-2 px-2.5 md:px-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollToCard(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === activeIndex 
                      ? 'bg-blue-500 scale-125' 
                      : 'bg-neutral-400 hover:bg-neutral-500'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </InnerContainer>
      </OuterContainer>
      
      <div className="w-full line-dash-x"/>
    </Section>
  );
}