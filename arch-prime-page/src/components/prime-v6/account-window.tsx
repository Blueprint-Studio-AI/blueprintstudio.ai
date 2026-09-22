"use client";

// The account's window at rest: the same shape the hero closes into and the view opens out of,
// used wherever the page points at "your account". It holds a photograph, a colour field, or
// anything passed in (the §6 token marks).

import type { CSSProperties, ReactNode } from "react";
import { GLYPH } from "@/components/prime-marks";
import { MASK, RATIO, useShape } from "./shape";

export function AccountWindow({
  width,
  photo,
  photoPosition = "50% 70%",
  fill = "#0d2249",
  className = "",
  children,
}: {
  /** CSS width; the height follows the shape */
  width: string;
  photo?: string;
  photoPosition?: string;
  fill?: string;
  className?: string;
  children?: ReactNode;
}) {
  const shape = useShape();
  const style: CSSProperties = {
    width,
    aspectRatio: `1 / ${RATIO[shape]}`,
    maskImage: MASK[shape],
    WebkitMaskImage: MASK[shape],
    maskSize: "100% 100%",
    WebkitMaskSize: "100% 100%",
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
    background: fill,
  };
  return (
    <div className={`relative shrink-0 ${className}`} style={style}>
      {photo && (
        // eslint-disable-next-line @next/next/no-img-element -- masked decorative crop
        <img src={photo} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: photoPosition }} />
      )}
      {shape === "circle" && !children && (
        <svg aria-hidden viewBox="0 0 544 393" className="absolute top-1/2 left-1/2 w-[46%] -translate-x-1/2 -translate-y-1/2">
          <path d={GLYPH} fill="#eef0f0" />
        </svg>
      )}
      {children}
    </div>
  );
}
