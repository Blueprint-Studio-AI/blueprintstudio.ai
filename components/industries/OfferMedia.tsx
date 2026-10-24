"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

const STEP_MS = 1100;

// One still at a time in an offer panel. While the panel is hovered or
// focused it steps through the other projects' stills, then settles back on
// the first; the dots say how many there are. With reduced motion it stays put.
export default function OfferMedia({ images, sizes }: { images: { src: string; alt: string }[]; sizes: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const card = ref.current?.closest("a") ?? ref.current;
    if (!card || images.length < 2) return;
    const on = () => setActive(true);
    const off = () => setActive(false);
    card.addEventListener("pointerenter", on);
    card.addEventListener("pointerleave", off);
    card.addEventListener("focusin", on);
    card.addEventListener("focusout", off);
    return () => {
      card.removeEventListener("pointerenter", on);
      card.removeEventListener("pointerleave", off);
      card.removeEventListener("focusin", on);
      card.removeEventListener("focusout", off);
    };
  }, [images.length]);

  useEffect(() => {
    if (!active || reduce) {
      setIndex(0);
      return;
    }
    // The first step comes quickly, so the hover reads as a response.
    const first = setTimeout(() => setIndex(1), 450);
    const timer = setInterval(() => setIndex((i) => (i + 1) % images.length), STEP_MS);
    return () => {
      clearTimeout(first);
      clearInterval(timer);
    };
  }, [active, reduce, images.length]);

  return (
    <div ref={ref} className="relative aspect-[16/10] overflow-hidden rounded-[12px] bg-black/[0.04] lg:rounded-[16px]">
      {images.map((image, i) => (
        <Image
          key={image.src}
          src={image.src}
          alt={i === 0 ? image.alt : ""}
          fill
          sizes={sizes}
          className={`object-cover transition-[opacity,transform] [transition-duration:600ms,900ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] motion-reduce:transform-none ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      {images.length > 1 && (
        <div
          aria-hidden="true"
          className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/25 px-2 py-1.5 backdrop-blur-md lg:bottom-4 lg:left-4"
        >
          {images.map((image, i) => (
            <span
              key={image.src}
              className={`h-1.5 rounded-full bg-white transition-[width,opacity] duration-500 ease-out ${
                i === index ? "w-4 opacity-100" : "w-1.5 opacity-60"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
