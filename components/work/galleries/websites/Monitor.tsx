"use client";

import type { PointerEventHandler, ReactNode } from "react";
import { motion, type MotionStyle, type MotionValue } from "framer-motion";

// The display: an aluminium body with a thin black glass bezel on a stand,
// built in CSS 3D so the site on its screen stays sharp. Computer turns it in
// and settles it exactly face-on, so the screen is never resampled while you
// read it; the pointer moves the light across the glass instead.
// Every size is in cqw, a share of the display's width, so it scales whole.

/** The body's depth behind the glass, in slices of aluminium (darker toward the back). */
const DEPTH = 2.2;
const SLICES = [0, 1, 2, 3, 4, 5, 6, 7];
const sliceShade = (i: number) => `hsl(220 4% ${80 - i * 2.6}%)`;

// The stand, in cqw below the display: an arm that bends forward into a foot.
const FLOOR = 12.5;
const FOOT = { width: 17, depth: 17, thick: 0.8 };
const BEND = 1.7;
const ARM_Z = -(DEPTH + 0.9);
const FOOT_TOP = FLOOR - FOOT.thick;
const BEND_STEPS = [0, 1, 2, 3, 4, 5];
/** Lightness at the bend's step edges, from the arm to the foot: brightest where it turns toward the light. */
const BEND_SHADE = [80.5, 82.5, 84.5, 86.2, 87.4, 87.8, 87.4];

function Stand() {
  const footZ = ARM_Z + BEND + FOOT.depth / 2;
  const strip = ((BEND * Math.PI) / 2 / BEND_STEPS.length) * 1.15;
  return (
    <div aria-hidden className="absolute inset-x-0 bottom-0 [transform-style:preserve-3d]" style={{ height: `${FLOOR}cqw` }}>
      {/* Shadows on the floor: a wide soft one under the display, a close one under the foot. */}
      <div
        className="absolute left-1/2 h-[30cqw] w-[78cqw] rounded-[50%] bg-[radial-gradient(closest-side,rgba(24,24,20,0.15),rgba(24,24,20,0.05)_58%,transparent)]"
        style={{ top: `${FLOOR}cqw`, transform: "translate(-50%, -50%) translateZ(-1cqw) rotateX(90deg)" }}
      />
      <div
        className="absolute left-1/2 h-[24cqw] w-[30cqw] rounded-[50%] bg-[radial-gradient(closest-side,rgba(24,24,20,0.3),rgba(24,24,20,0.1)_55%,transparent)]"
        style={{ top: `${FLOOR}cqw`, transform: `translate(-50%, -50%) translateZ(${footZ}cqw) rotateX(90deg)` }}
      />
      {/* The arm: its thickness, then its face, in shade just under the display. */}
      {[3, 2, 1].map((i) => (
        <div
          key={i}
          className="absolute left-1/2 top-[-6cqw] w-[17cqw]"
          style={{ height: `${6 + FOOT_TOP - BEND}cqw`, transform: `translateX(-50%) translateZ(${ARM_Z - i * 0.3}cqw)`, backgroundColor: sliceShade(2 + i * 2) }}
        />
      ))}
      <div
        className="absolute left-1/2 top-[-6cqw] w-[17cqw] bg-[linear-gradient(180deg,#9A9EA4_37%,#B9BDC2_44%,#C8CBCF_70%,#CED1D4_100%)]"
        style={{ height: `${6 + FOOT_TOP - BEND}cqw`, transform: `translateX(-50%) translateZ(${ARM_Z}cqw)` }}
      >
        <span className="absolute inset-y-0 left-0 w-[0.22cqw] bg-white/45" />
        <span className="absolute inset-y-0 right-0 w-[0.22cqw] bg-black/[0.07]" />
      </div>
      {/* The bend, in strips turning from the arm's face to the foot's top. */}
      {BEND_STEPS.map((k) => {
        const a = ((k + 0.5) / BEND_STEPS.length) * (Math.PI / 2);
        const y = FOOT_TOP - BEND + BEND * Math.sin(a);
        const z = ARM_Z + BEND - BEND * Math.cos(a);
        return (
          <div
            key={k}
            className="absolute left-1/2 w-[17cqw]"
            style={{
              top: `${y - strip / 2}cqw`,
              height: `${strip}cqw`,
              transform: `translateX(-50%) translateZ(${z}cqw) rotateX(${(a * 180) / Math.PI}deg)`,
              backgroundImage: `linear-gradient(180deg, hsl(220 4% ${BEND_SHADE[k]}%), hsl(220 4% ${BEND_SHADE[k + 1]}%))`,
            }}
          />
        );
      })}
      {/* The foot: its top, lit from above, then its front edge. */}
      <div
        className="absolute left-1/2 w-[17cqw] rounded-b-[1cqw] bg-[linear-gradient(180deg,#DCDEE1,#E2E3E6_60%,#E8E9EB)]"
        style={{ top: `${FOOT_TOP}cqw`, height: `${FOOT.depth}cqw`, transform: `translate(-50%, -50%) translateZ(${footZ}cqw) rotateX(90deg)` }}
      />
      <div
        className="absolute left-1/2 w-[17cqw] rounded-b-[0.5cqw] bg-[linear-gradient(180deg,#B3B6BB,#9A9DA2)]"
        style={{ top: `${FOOT_TOP}cqw`, height: `${FOOT.thick}cqw`, transform: `translateX(-50%) translateZ(${ARM_Z + BEND + FOOT.depth}cqw)` }}
      />
    </div>
  );
}

export default function Monitor({
  turn,
  glare,
  reduce,
  onPointerMove,
  onPointerLeave,
  children,
}: {
  /** The turn-in, from Computer. */
  turn: MotionStyle;
  /** Where the light sits on the glass. */
  glare: MotionValue<string>;
  reduce: boolean;
  onPointerMove: PointerEventHandler<HTMLDivElement>;
  onPointerLeave: PointerEventHandler<HTMLDivElement>;
  children: ReactNode;
}) {
  return (
    <div onPointerMove={onPointerMove} onPointerLeave={onPointerLeave} className="relative pb-[4cqw] [perspective-origin:50%_32%] [perspective:240cqw]">
      <motion.div style={reduce ? undefined : turn} className="relative origin-[50%_45%] [transform-style:preserve-3d] motion-reduce:![transform:none]">
        {/* Back to front (stand, body, face), so it paints right even where a browser flattens the scene. */}
        <Stand />
        <div className="relative [transform-style:preserve-3d]">
          {/* The body behind the glass. */}
          {[...SLICES].reverse().map((i) => (
            <div
              key={i}
              aria-hidden
              className="absolute inset-0 rounded-[1.35cqw]"
              style={{ transform: `translateZ(${-((i + 1) * DEPTH) / SLICES.length}cqw)`, backgroundColor: sliceShade(i) }}
            />
          ))}
          {/* The face: an aluminium rim round the black glass. Its own plane at z = 0, so
              Safari sorts it in front of the arm behind it (it paints flat content first). */}
          <div className="relative rounded-[1.35cqw] bg-[linear-gradient(180deg,#F1F2F3,#CDD0D3_50%,#A8ABB0)] p-[max(2px,0.26cqw)] shadow-[0_0_0_0.5px_rgba(0,0,0,0.16)] [transform:translateZ(0)]">
            {/* The glass: its sheen shows on the bezel round the screen. */}
            <motion.div
              className="relative rounded-[1.12cqw] bg-[#0B0B0C] bg-[length:260%_100%] bg-no-repeat p-[1.45cqw] [background-image:linear-gradient(112deg,transparent_34%,rgba(255,255,255,0.13)_47%,rgba(255,255,255,0.05)_53%,transparent_64%)] motion-reduce:![background-position:50%_0%]"
              style={reduce ? undefined : { backgroundPosition: glare }}
            >
              {/* The camera. */}
              <span aria-hidden className="absolute left-1/2 top-[0.5cqw] h-[max(3px,0.45cqw)] w-[max(3px,0.45cqw)] -translate-x-1/2 rounded-full bg-[#1C1D20] shadow-[inset_0_0_0_max(1px,0.08cqw)_#2A2C31]" />
              {children}
              {/* And faintly over the screen. */}
              <motion.span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-[1.12cqw] bg-[length:260%_100%] bg-no-repeat [background-image:linear-gradient(112deg,transparent_36%,rgba(255,255,255,0.045)_47%,rgba(255,255,255,0.02)_52%,transparent_62%)] motion-reduce:![background-position:50%_0%]"
                style={reduce ? undefined : { backgroundPosition: glare }}
              />
            </motion.div>
          </div>
        </div>
        <div aria-hidden style={{ height: `${FLOOR}cqw` }} />
      </motion.div>
    </div>
  );
}
