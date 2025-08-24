"use client";

import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const BackgroundShader = dynamic(() => import("./BackgroundShader"), {
  ssr: false,
  loading: () => null,
});

export default function FooterFX() {
  const reduced = usePrefersReducedMotion();
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => setIsLargeScreen(mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    // fallback for Safari <= 14
    // @ts-ignore
    mq.addListener?.(onChange);
    return () => {
      mq.removeEventListener?.("change", onChange);
      // @ts-ignore
      mq.removeListener?.(onChange);
    };
  }, []);

  if (reduced || !isLargeScreen) return null;

  return (
    <div className="absolute inset-0 -z-10 pointer-events-none">
      <BackgroundShader />
    </div>
  );
}