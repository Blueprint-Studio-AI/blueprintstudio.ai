"use client";

import { useEffect, useState } from "react";

type ViewportSize = {
  width: number;
  height: number;
};

const getViewport = (): ViewportSize | undefined => {
  if (typeof window === "undefined") return undefined;
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
};

export function useViewportObserver(): ViewportSize | undefined {
  const [viewport, setViewport] = useState<ViewportSize | undefined>(() => getViewport());

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateViewport = () => setViewport(getViewport());

    updateViewport();

    window.addEventListener("resize", updateViewport);

    const visualViewport = window.visualViewport;
    if (visualViewport) {
      visualViewport.addEventListener("resize", updateViewport);
      visualViewport.addEventListener("scroll", updateViewport);
    }

    return () => {
      window.removeEventListener("resize", updateViewport);
      if (visualViewport) {
        visualViewport.removeEventListener("resize", updateViewport);
        visualViewport.removeEventListener("scroll", updateViewport);
      }
    };
  }, []);

  return viewport;
}
