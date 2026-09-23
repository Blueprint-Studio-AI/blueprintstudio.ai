"use client";

// The account's window — the one object /prime-v6 carries from section to section. By default it
// is the Arch Prime arch as a filled silhouette (a container the photograph sits inside), not a
// disc: a disc with a centred glyph is how every prime token mark is built (prime-marks.tsx), so a
// disc here would read as primeBTC. The circle stays available behind the review toggle, because
// it is the frame the design lead sketched. Decision 7 in the section map.

import { useSyncExternalStore } from "react";
import { OUTER_EDGE } from "@/components/prime-arch";

export type Shape = "arch" | "circle";

// The arch's outer edge, closed along its feet: a solid arch silhouette. 1177.77 × 835.173.
const ARCH_W = 1177.77;
const ARCH_H = 835.173;
export const RATIO: Record<Shape, number> = { arch: ARCH_H / ARCH_W, circle: 1 };

const svg = (body: string, box: string) =>
  `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='${box}' preserveAspectRatio='none'>${body}</svg>`)}")`;

export const MASK: Record<Shape, string> = {
  arch: svg(`<path d='${OUTER_EDGE}Z' fill='black'/>`, `0 0 ${ARCH_W} ${ARCH_H}`),
  circle: svg(`<circle cx='50' cy='50' r='50' fill='black'/>`, "0 0 100 100"),
};

// A tiny store for the review toggle: ?mark=circle in the URL wins, then the last choice.
const KEY = "prime-v6-mark";
const listeners = new Set<() => void>();

function read(): Shape {
  if (typeof window === "undefined") return "arch";
  const q = new URLSearchParams(window.location.search).get("mark");
  if (q === "circle" || q === "arch") return q;
  try {
    return window.localStorage.getItem(KEY) === "circle" ? "circle" : "arch";
  } catch {
    return "arch";
  }
}

export function setShape(next: Shape) {
  try {
    window.localStorage.setItem(KEY, next);
  } catch {
    // private mode: the choice lasts until reload
  }
  const url = new URL(window.location.href);
  url.searchParams.set("mark", next);
  window.history.replaceState(window.history.state, "", url);
  listeners.forEach((l) => l());
}

export function useShape(): Shape {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    read,
    () => "arch",
  );
}

// Scroll-stage helpers shared by the two moments.
export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const smooth = (x: number) => {
  const t = clamp01(x);
  return t * t * (3 - 2 * t);
};
export const easeInOut = (x: number) => {
  const t = clamp01(x);
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};
