"use client";
import { useEffect, useState } from "react";

export function usePrefersReducedMotion(): boolean {
  const get = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const [reduced, setReduced] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();

    if ("addEventListener" in mq) {
      mq.addEventListener("change", update);
      return () => mq.removeEventListener("change", update);
    } else {
      // Safari legacy path
      (mq as MediaQueryList).addListener(update);
      return () => (mq as MediaQueryList).removeListener(update);
    }
  }, []);

  return reduced;
}