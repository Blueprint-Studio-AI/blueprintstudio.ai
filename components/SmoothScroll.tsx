"use client";

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import LocomotiveScroll from "locomotive-scroll";

interface SmoothScrollContextType {
  scroll: LocomotiveScroll | null;
  isReady: boolean;
}

const SmoothScrollContext = createContext<SmoothScrollContextType>({
  scroll: null,
  isReady: false,
});

export const useSmoothScroll = () => useContext(SmoothScrollContext);

interface SmoothScrollProviderProps {
  children: ReactNode;
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const scrollRef = useRef<LocomotiveScroll | null>(null);
  const [isReady, setIsReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only initialize on client
    if (typeof window === "undefined") return;

    // Small delay to ensure DOM is ready
    const initTimeout = setTimeout(() => {
      if (scrollRef.current) return;

      scrollRef.current = new LocomotiveScroll({
        // Locomotive Scroll v5 options (built on Lenis)
        lenisOptions: {
          lerp: 0.1, // Linear interpolation - lower = smoother (0.05-0.15 range)
          wheelMultiplier: 1, // Scroll speed multiplier
          touchMultiplier: 2, // Touch scroll speed
          infinite: false,
          orientation: "vertical",
          gestureOrientation: "vertical",
          smoothWheel: true,
        },
      });

      setIsReady(true);

      // Expose scroll instance globally for navigation integration
      (window as unknown as { locomotiveScroll: LocomotiveScroll }).locomotiveScroll = scrollRef.current;
    }, 100);

    return () => {
      clearTimeout(initTimeout);
      if (scrollRef.current) {
        scrollRef.current.destroy();
        scrollRef.current = null;
        setIsReady(false);
      }
    };
  }, []);

  // Handle route changes - refresh scroll
  useEffect(() => {
    if (!isReady || !scrollRef.current) return;

    // Refresh on resize
    const handleResize = () => {
      scrollRef.current?.resize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isReady]);

  return (
    <SmoothScrollContext.Provider value={{ scroll: scrollRef.current, isReady }}>
      <div ref={containerRef} data-scroll-container>
        {children}
      </div>
    </SmoothScrollContext.Provider>
  );
}

// Helper hook for scrolling to elements
export function useScrollTo() {
  const { scroll, isReady } = useSmoothScroll();

  const scrollTo = (target: string | HTMLElement | number, options?: { offset?: number; duration?: number }) => {
    if (!isReady || !scroll) {
      // Fallback to native scroll
      if (typeof target === "string") {
        const element = document.querySelector(target);
        if (element) {
          const offset = options?.offset ?? -80;
          const y = element.getBoundingClientRect().top + window.pageYOffset + offset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      } else if (typeof target === "number") {
        window.scrollTo({ top: target, behavior: "smooth" });
      }
      return;
    }

    scroll.scrollTo(target, {
      offset: options?.offset ?? -80,
      duration: options?.duration ?? 1,
    });
  };

  return scrollTo;
}
