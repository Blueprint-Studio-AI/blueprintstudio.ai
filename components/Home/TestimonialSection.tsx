"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import SectionHeader from "../ui/SectionHeader";
import { Quote } from "lucide-react";
import { useSmoothScroll } from "@/components/SmoothScroll";

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
    quote: "This looks so good wtf",
    author: "Hugo",
    role: "CEO & Founder",
    company: "HUCH"
  },
  {
    id: 4,
    quote: "Blueprint's ability to deeply understand our needs and translate them into smart solutions was an absolute home run.",
    author: "Steven Luis Howell",
    role: "CEO & Co-Founder",
    company: "Project Metavision"
  },
  {
    id: 5,
    quote: "Blueprint has been an invaluable partner for our service design efforts. Tyler and his team bring a unique blend of creativity, expertise, and professionalism to every project. They consistently deliver innovative solutions that not only meet our business goals but also exceed our expectations.",
    author: "Mauricio Manhaes",
    role: "President",
    company: "SDN Academic Task Force"
  },
  {
    id: 6,
    quote: "Blueprint reduced the time it takes to explain our business from three minutes to 30 seconds. This helped us gain valuable partnerships and create marketing materials that resonate with our audience. Blueprint offers reliable, professional, and speedy service that takes the guesswork out of your public-facing operations.",
    author: "Alex Escudero",
    role: "Co-Founder",
    company: "Project Metavision"
  },
  {
    id: 7,
    quote: "What sets Blueprint apart is the quality of their end-to-end design and engineering work. They quickly understood what we needed and made collaboration with our internal team feel effortless. Blueprint is absolutely the perfect fit for a lean, design-forward business that values both aesthetics and function!",
    author: "Shina Foo",
    role: "COO",
    company: "Perena",
    image: "/testimonials/shina-foo-perena.jpg"
  }
];

export default function TestimonialSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { scroll: lenis } = useSmoothScroll();

  // Refs for scroll state (no re-renders during scroll)
  const currentIndex = useRef(0);
  const isAnimating = useRef(false);
  const accumulatedDelta = useRef(0);
  const resetTimer = useRef<NodeJS.Timeout>();


  // Scroll to specific card (CSS snap-center handles final centering)
  const scrollToCard = useCallback((index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Get the actual card element (index + 1 because of top spacer)
    const cardElement = container.children[index + 1] as HTMLElement;
    if (!cardElement) return;

    isAnimating.current = true;
    currentIndex.current = index;
    setActiveIndex(index);

    // Calculate scroll position to center card
    const containerHeight = container.clientHeight;
    const cardTop = cardElement.offsetTop;
    const cardHeight = cardElement.offsetHeight;
    const targetScroll = cardTop - (containerHeight - cardHeight) / 2;

    container.scrollTo({
      top: Math.max(0, targetScroll),
      behavior: 'smooth'
    });

    // Clear animating flag after scroll settles
    setTimeout(() => {
      isAnimating.current = false;
    }, 600);
  }, []);

  // Trigger page scroll by dispatching wheel event to document (Lenis will catch it)
  const scrollPage = useCallback((originalEvent: WheelEvent) => {
    // Create a new wheel event and dispatch on document body
    // Lenis listens on window/document, so it will catch this
    const syntheticEvent = new WheelEvent('wheel', {
      deltaY: originalEvent.deltaY,
      deltaX: originalEvent.deltaX,
      deltaMode: originalEvent.deltaMode,
      bubbles: true,
      cancelable: true,
    });
    document.body.dispatchEvent(syntheticEvent);
  }, []);

  // Native wheel event handler (attached directly to DOM to run before React)
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      const { scrollTop } = container;
      const scrollingUp = e.deltaY < 0;
      const scrollingDown = e.deltaY > 0;

      // Bounds detection
      const atTop = scrollTop <= 5;
      // Use index for bottom since spacer prevents true scroll bottom
      const atBottom = currentIndex.current >= testimonials.length - 1;

      // At bounds - pass scroll to page via synthetic event
      if ((scrollingUp && atTop) || (scrollingDown && atBottom)) {
        scrollPage(e);
        accumulatedDelta.current = 0;
        return;
      }

      // Inside testimonials - we handle it
      e.preventDefault();
      e.stopPropagation();

      // Skip if animating
      if (isAnimating.current) return;

      // Accumulate scroll delta
      accumulatedDelta.current += e.deltaY;

      // Reset after pause
      if (resetTimer.current) clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => {
        accumulatedDelta.current = 0;
      }, 120);

      // Threshold to trigger card change
      const threshold = 400;
      if (Math.abs(accumulatedDelta.current) >= threshold) {
        const direction = accumulatedDelta.current > 0 ? 1 : -1;
        const newIndex = Math.max(0, Math.min(testimonials.length - 1, currentIndex.current + direction));

        if (newIndex !== currentIndex.current) {
          accumulatedDelta.current = 0;
          scrollToCard(newIndex);
        }
      }
    };

    // Attach with capture to get event before Lenis
    container.addEventListener('wheel', handleWheel, { passive: false, capture: true });

    return () => {
      container.removeEventListener('wheel', handleWheel, { capture: true });
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, [scrollToCard, scrollPage]);

  // Sync activeIndex when scroll settles (for indicator dots)
  const handleScroll = useCallback(() => {
    if (isAnimating.current) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    const containerHeight = container.clientHeight;
    const containerCenter = container.scrollTop + containerHeight / 2;

    // Find which card is closest to center
    let closestIndex = 0;
    let closestDistance = Infinity;

    for (let i = 0; i < testimonials.length; i++) {
      const card = container.children[i + 1] as HTMLElement; // +1 for top spacer
      if (!card) continue;
      const cardCenter = card.offsetTop + card.offsetHeight / 2;
      const distance = Math.abs(cardCenter - containerCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = i;
      }
    }

    if (closestIndex !== currentIndex.current) {
      currentIndex.current = closestIndex;
      setActiveIndex(closestIndex);
    }
  }, []);

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

      <SectionHeader leftText="TESTIMONIALS" rightText="// proven" />

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
              <div className="absolute top-0 left-0 right-0 h-8 sm:h-16 bg-gradient-to-b from-neutral-100 to-transparent z-10 pointer-events-none" />

              {/* Bottom fade gradient */}
              <div className="absolute bottom-0 left-0 right-0 h-8 sm:h-16 bg-gradient-to-t from-neutral-100 to-transparent z-10 pointer-events-none" />

              <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                data-lenis-prevent
                className="flex flex-col gap-6 overflow-y-auto hide-scrollbar px-2.5 md:px-6 snap-y snap-mandatory"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  height: '420px',
                  overscrollBehavior: 'none'
                }}
              >
              {/* Top spacer to allow first card to center */}
              <div className="flex-shrink-0 snap-center" style={{ height: 'calc(50% - 140px)' }} aria-hidden="true" />
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="inline-flex flex-col items-start gap-2 p-6 md:p-8 rounded-3xl border border-neutral-300/50 bg-neutral-50 flex-shrink-0 snap-center"
                  style={{
                    minHeight: '256px'
                  }}
                >
                  {/* <Quote className="w-8 h-8 text-neutral-400 mb-4 hidden md:block" /> */}
                  <p className="text-base md:text-lg text-neutral-700 mb-6 leading-relaxed cursor-default">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="mt-auto">
                    <p className="font-medium text-black text-base cursor-default">{testimonial.author}</p>
                    <p className="text-sm text-neutral-500 cursor-default">{testimonial.role}, {testimonial.company}</p>
                  </div>
                </div>
              ))}
              {/* Bottom spacer to allow last card to center */}
              <div className="flex-shrink-0" style={{ height: 'calc(50% - 140px)' }} aria-hidden="true" />
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