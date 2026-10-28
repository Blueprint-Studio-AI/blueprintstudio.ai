"use client";

import { useEffect, useState } from "react";

// Small pieces the apps and branding galleries share.

// The morphs run a 0 to 1 progress, so they rest once within a hair of it
// rather than waiting out the spring's last invisible wobble.
const REST = { restDelta: 0.004, restSpeed: 0.05 } as const;
/** The open and close morphs: quick, with a little give at the end. */
export const MORPH = { type: "spring", visualDuration: 0.5, bounce: 0.14, ...REST } as const;
/** Landing back where it came from: a touch more bounce, so it settles in. */
export const LAND = { type: "spring", visualDuration: 0.45, bounce: 0.2, ...REST } as const;
/** Small moves: a blade lifting, a page turning. */
export const NUDGE = { type: "spring", visualDuration: 0.32, bounce: 0.12 } as const;

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
/** 0 before `a`, 1 after `b`, eased between. */
export function smooth(a: number, b: number, t: number) {
  const x = clamp01((t - a) / (b - a));
  return x * x * (3 - 2 * x);
}

/** A media query, null until the first layout pass (so server and client agree). */
export function useMedia(query: string) {
  const [match, setMatch] = useState<boolean | null>(null);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatch(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);
  return match;
}

type Lenis = { stop?: () => void; start?: () => void };

/** Holds the page still while an overlay is open (the site scrolls through Locomotive/Lenis). */
export function useScrollLock(on: boolean) {
  useEffect(() => {
    if (!on) return;
    const scroller = (window as unknown as { locomotiveScroll?: Lenis }).locomotiveScroll;
    const html = document.documentElement;
    const before = [html.style.overflow, html.style.scrollbarGutter];
    scroller?.stop?.();
    // Keep the scrollbar's room, so the page doesn't jump sideways as it goes.
    html.style.scrollbarGutter = "stable";
    html.style.overflow = "hidden";
    return () => {
      [html.style.overflow, html.style.scrollbarGutter] = before;
      scroller?.start?.();
    };
  }, [on]);
}
