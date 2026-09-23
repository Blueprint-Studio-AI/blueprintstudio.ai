"use client";

// The app's DrawnArch (arch-prime apps/web/features/earn/drawn-arch.tsx), ported as is: the
// brand glyph at banner scale as one closed outline. Two pens trace the outer and inner edges
// left to right, the fill arrives as they reach the right foot, and the lines dissolve into it.
// `sweep` shows the filled arch at once, revealed left to right. Timing reads the motion tokens
// scoped on .prime-scope.

import { useId, type CSSProperties, type ReactNode } from "react";
import { useInView } from "@/lib/use-in-view";

// DrawnArch, drawn when its box scrolls into view. `className` positions the box; the svg fills it.
export function ArchIn({ className, ...arch }: { className?: string; fill?: keyof typeof FILLS; reveal?: "outline" | "sweep" }): ReactNode {
  const { ref, inView } = useInView<HTMLDivElement>("0px 0px -10% 0px");
  return (
    <div ref={ref} className={className}>
      <DrawnArch drawn={inView} {...arch} className="h-auto w-full" />
    </div>
  );
}

export const VIEW_BOX = "0 0 1177.77 835.173";
const OUTLINE =
  "M1063.64 835.173C1054.52 835.173 1045.95 830.509 1041.11 822.674L620.173 144.761C610.302 128.904 594.843 127.225 588.696 127.225C582.55 127.225 566.905 128.904 557.22 144.761L136.288 822.674C131.445 830.509 122.877 835.173 113.751 835.173H26.5847C5.72438 835.173 -6.9401 812.227 4.04884 794.505L449.38 77.6039C479.553 28.915 531.703 0 588.883 0C646.063 0 698.213 28.915 728.386 77.6039L1173.72 794.505C1184.71 812.227 1172.04 835.173 1151.18 835.173H1063.64Z";
export const OUTER_EDGE =
  "M26.5847 835.173C5.72438 835.173 -6.9401 812.227 4.04884 794.505L449.38 77.6039C479.553 28.915 531.703 0 588.883 0C646.063 0 698.213 28.915 728.386 77.6039L1173.72 794.505C1184.71 812.227 1172.04 835.173 1151.18 835.173";
const INNER_EDGE =
  "M113.751 835.173C122.877 835.173 131.445 830.509 136.288 822.674L557.22 144.761C566.905 128.904 582.55 127.225 588.696 127.225C594.843 127.225 610.302 128.904 620.173 144.761L1041.11 822.674C1045.95 830.509 1054.52 835.173 1063.64 835.173";
const LINE_OPACITY = 0.55;
const DRAW = "calc(var(--motion-slow) * 4)";
const TIMING: CSSProperties = {
  transitionDuration: `${DRAW}, var(--motion-slow), var(--motion-slow)`,
  transitionDelay: `0s, ${DRAW}, ${DRAW}`,
  transitionTimingFunction: "var(--ease-in-out), var(--ease-out), var(--ease-out)",
};

type Tone = { from: string; to: string; toOpacity: number; opacity: number; x2: string; y2: string };
const FILLS = {
  banner: { from: "#2e4a77", to: "#2e4a77", toOpacity: 1, opacity: 1, x2: "589", y2: "835" },
  hero: { from: "#D9D9D9", to: "#737373", toOpacity: 0, opacity: 0.33, x2: "589", y2: "927" },
  band: { from: "#558B79", to: "#1F5543", toOpacity: 1, opacity: 1, x2: "1326", y2: "835" },
  indigo: { from: "#8890CC", to: "#545EB3", toOpacity: 1, opacity: 1, x2: "1326", y2: "835" },
  boost: { from: "#7d392a", to: "#7d392a", toOpacity: 1, opacity: 1, x2: "589", y2: "835" },
} satisfies Record<string, Tone>;

const SWEEP: CSSProperties = {
  transitionProperty: "clip-path",
  transitionDuration: DRAW,
  transitionTimingFunction: "var(--ease-in-out)",
};

export function DrawnArch({
  drawn,
  fill,
  reveal = "outline",
  className,
}: {
  drawn: boolean;
  fill?: keyof typeof FILLS;
  reveal?: "outline" | "sweep";
  className?: string;
}): ReactNode {
  const fade = useId();
  const tone = fill === undefined ? undefined : FILLS[fill];

  if (reveal === "sweep" && tone !== undefined) {
    return (
      <svg viewBox={VIEW_BOX} aria-hidden className={className}>
        <defs>
          <linearGradient id={fade} x1="589" y1="0" x2={tone.x2} y2={tone.y2} gradientUnits="userSpaceOnUse">
            <stop stopColor={tone.from} />
            <stop offset="1" stopColor={tone.to} stopOpacity={tone.toOpacity} />
          </linearGradient>
        </defs>
        <g className="motion-reduce:transition-none" style={{ ...SWEEP, clipPath: drawn ? "inset(0 0 0 0)" : "inset(0 100% 0 0)" }}>
          <path d={OUTLINE} fill={`url(#${fade})`} fillOpacity={tone.opacity} />
        </g>
      </svg>
    );
  }

  return (
    <svg viewBox={VIEW_BOX} aria-hidden className={className}>
      {tone && (
        <defs>
          <linearGradient id={fade} x1="589" y1="0" x2={tone.x2} y2={tone.y2} gradientUnits="userSpaceOnUse">
            <stop stopColor={tone.from} />
            <stop offset="1" stopColor={tone.to} stopOpacity={tone.toOpacity} />
          </linearGradient>
        </defs>
      )}
      {tone && (
        <path d={OUTLINE} fill={`url(#${fade})`} className="transition-[fill-opacity] motion-reduce:transition-none" style={{ ...TIMING, fillOpacity: drawn ? tone.opacity : 0 }} />
      )}
      {[OUTER_EDGE, INNER_EDGE].map((edge) => (
        <path
          key={edge.slice(0, 12)}
          d={edge}
          pathLength={1}
          strokeDasharray={1}
          fill="none"
          stroke="#D9D9D9"
          strokeWidth={2}
          strokeLinecap="round"
          className="transition-[stroke-dashoffset,stroke-opacity] motion-reduce:transition-none"
          style={{ ...TIMING, strokeDashoffset: drawn ? 0 : 1, strokeOpacity: drawn && tone !== undefined ? 0 : LINE_OPACITY }}
        />
      ))}
    </svg>
  );
}
