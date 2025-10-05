"use client";

import { useViewportObserver } from "./hooks/useViewportObserver";

export const breakpoints = {
  xs: "475px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
  custom: "1124px",
  wide: "1387px",
} as const;

export type BreakpointKey = keyof typeof breakpoints;
export type BreakpointName = BreakpointKey | "base";

const orderedKeys: BreakpointKey[] = [
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
  "custom",
  "wide",
];

export function useBreakpoint(): BreakpointName {
  const viewport = useViewportObserver();
  const width = viewport?.width;

  if (typeof width !== "number") return "base";

  let active: BreakpointName = "base";

  for (const key of orderedKeys) {
    const minWidth = Number.parseInt(breakpoints[key], 10);
    if (width >= minWidth) {
      active = key;
    } else {
      break;
    }
  }

  return active;
}
