"use client";

// Scroll-reveal primitive for the Chain below-fold. Renders a single <div> that
// fades (and optionally lifts) into view via IntersectionObserver, with a custom
// enter easing and staggered delay. Honors prefers-reduced-motion (shows instantly)
// and the global [data-reveal] reduced-motion CSS net in globals.css.
//
// Animates transform + opacity only. No transition:all, no ease-in/linear.

import { useEffect, useRef, useState, type ReactNode } from "react";

// enter easing per the craft bar
const ENTER = "cubic-bezier(0.16,1,0.3,1)";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** stagger delay, ms */
  delay?: number;
  /** lift distance, px (0 = fade only — used inside hairline grids to keep rules crisp) */
  y?: number;
};

export function Reveal({ children, className, delay = 0, y = 16 }: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-reveal
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : `translate3d(0, ${y}px, 0)`,
        transition: `opacity 0.6s ${ENTER}, transform 0.6s ${ENTER}`,
        transitionDelay: `${delay}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
