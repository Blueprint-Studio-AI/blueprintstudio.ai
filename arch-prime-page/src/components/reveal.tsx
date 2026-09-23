"use client";

import { createContext, createElement, useContext, type ElementType, type ReactNode } from "react";
import { useInView } from "@/lib/use-in-view";

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

const RevealGroupContext = createContext<boolean | null>(null);

export function RevealGroup({
  children,
  as = "div",
  className,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLElement>();
  return createElement(
    as,
    { ref, className },
    <RevealGroupContext.Provider value={inView}>{children}</RevealGroupContext.Provider>,
  );
}

type WordVariant = "headline" | "text";

const PRESETS: Record<WordVariant, { y: number; skew: number; stagger: number; duration: number }> = {
  headline: { y: 100, skew: 6, stagger: 0.05, duration: 0.9 },
  text: { y: 50, skew: 2, stagger: 0.012, duration: 0.9 },
};

export function RevealWords({
  text,
  as = "span",
  variant = "headline",
  className,
}: {
  text: string;
  as?: ElementType;
  variant?: WordVariant;
  className?: string;
}) {
  const group = useContext(RevealGroupContext);
  const own = useInView<HTMLElement>();
  const inView = group ?? own.inView;
  const ref = group === null ? own.ref : undefined;
  const preset = PRESETS[variant];
  const lines = text.split("\n");
  let index = 0;

  const content = lines.map((line, li) => (
    <span key={li} style={{ display: "block" }}>
      {line.split(" ").map((word, wi) => {
        const delay = index++ * preset.stagger;
        return (
          <span
            key={wi}
            style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top" }}
          >
            <span
              data-reveal
              style={{
                display: "inline-block",
                opacity: inView ? 1 : 0,
                transform: inView ? "none" : `translateY(${preset.y}%) skewY(${preset.skew}deg)`,
                transition: `transform ${preset.duration}s ${EASE} ${delay}s, opacity ${preset.duration}s ${EASE} ${delay}s`,
              }}
            >
              {word}
            </span>
            {wi < line.split(" ").length - 1 ? " " : ""}
          </span>
        );
      })}
    </span>
  ));

  return createElement(as, { ref, className }, content);
}

export function Reveal({
  children,
  as = "div",
  className,
  x = 0,
  y = 40,
  skew = 6,
  duration = 0.9,
  delay = 0,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  x?: number;
  y?: number;
  skew?: number;
  duration?: number;
  delay?: number;
}) {
  const group = useContext(RevealGroupContext);
  const own = useInView<HTMLElement>();
  const inView = group ?? own.inView;
  const ref = group === null ? own.ref : undefined;
  return createElement(
    as,
    {
      ref,
      className,
      "data-reveal": true,
      style: {
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : `translateX(${x}%) translateY(${y}%) skewY(${skew}deg)`,
        transition: `transform ${duration}s ${EASE} ${delay}s, opacity ${duration}s ${EASE} ${delay}s`,
      },
    },
    children,
  );
}

export function RevealClip({
  children,
  as = "div",
  className,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLElement>();
  return createElement(
    as,
    {
      ref,
      className,
      style: {
        clipPath: inView ? "inset(0% 0% 0% 0%)" : "inset(50% 50% 50% 50%)",
        transition: "clip-path 1s cubic-bezier(0.33, 1, 0.68, 1)",
      },
    },
    children,
  );
}
