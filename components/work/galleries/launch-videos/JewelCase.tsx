"use client";

import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Disc } from "./Disc";
import { CASE_SPRING, LID_SPRING, LIFT_SPRING, track, type Film } from "./shared";

export type CasePose = "rest" | "hover" | "present" | "out";

export interface CaseSize {
  w: number;
  h: number;
  /** Thickness: the spine's width. */
  d: number;
}

/** How a case stands in each pose: turned on its axis, raised, brought forward. */
export type Poses = Record<CasePose, { rotateY: number; y: number; z: number }>;

// The rack (desktop): spines out at an angle, so the names read and the
// covers show; a case turns to face you when you point at it, and comes
// forward to open. A case whose disc is in the player stands proud of the row.
export const RACK_POSES: Poses = {
  rest: { rotateY: 50, y: 0, z: -46 },
  hover: { rotateY: 12, y: -10, z: 64 },
  present: { rotateY: 0, y: -16, z: 34 },
  out: { rotateY: 50, y: -16, z: -46 },
};

// The phone's row: covers forward, a little turned so the case has depth.
export const ROW_POSES: Poses = {
  rest: { rotateY: 24, y: 0, z: -10 },
  hover: { rotateY: 14, y: -4, z: 0 },
  present: { rotateY: 0, y: -6, z: 10 },
  out: { rotateY: 24, y: -10, z: -10 },
};

function Face({ w, h, transform, className = "", style, children }: { w: number; h: number; transform: string; className?: string; style?: CSSProperties; children?: ReactNode }) {
  return (
    <div
      className={`absolute left-1/2 top-1/2 [backface-visibility:hidden] ${className}`}
      style={{ width: w, height: h, marginLeft: -w / 2, marginTop: -h / 2, transform, ...style }}
    >
      {children}
    </div>
  );
}

/**
 * A jewel case: the cover under its clear lid, the hinge, the spine printed
 * with the client and the film, and the disc on its tray inside. Purely what
 * you see; the rack or row around it handles pointing and picking.
 */
export function JewelCase({
  film,
  index,
  size,
  poses,
  pose,
  open,
  peek,
  lifted,
  discHome,
  lit,
  instant,
  discRef,
}: {
  film: Film;
  index: number;
  size: CaseSize;
  poses: Poses;
  pose: CasePose;
  /** The lid swung open. */
  open: boolean;
  /** The lid cracked open a little, under the pointer. */
  peek: boolean;
  /** The disc raised off its tray, out of the top of the case. */
  lifted: boolean;
  /** The disc is in the case (not in the player, nor on its way). */
  discHome: boolean;
  /** Its disc is in the player: the spine's light is on. */
  lit: boolean;
  /** Reduced motion: no springs, the case simply takes its pose. */
  instant: boolean;
  discRef: (el: HTMLDivElement | null) => void;
}) {
  const { w, h, d } = size;
  const hinge = Math.round(w * 0.075);
  const disc = Math.round(h * 0.9);
  const discLeft = hinge + (w - hinge - disc) / 2;
  const t = (spring: object) => (instant ? { duration: 0 } : spring);

  return (
    <motion.div
      className="absolute left-0 top-0 [transform-style:preserve-3d]"
      style={{ width: w, height: h }}
      initial={false}
      animate={poses[pose]}
      transition={t(CASE_SPRING)}
    >
      {/* Back */}
      <Face w={w} h={h} transform={`rotateY(180deg) translateZ(${d / 2}px)`} className="rounded-[3px] bg-[#141414]" />
      {/* Opening edge: clear plastic over the black tray */}
      <Face
        w={d}
        h={h}
        transform={`rotateY(90deg) translateZ(${w / 2}px)`}
        className="rounded-[2px]"
        style={{ background: "linear-gradient(90deg, #2a2a2a, #3b3b3b 30%, #1a1a1a)" }}
      />
      {/* Top and bottom edges */}
      <Face w={w} h={d} transform={`rotateX(90deg) translateZ(${h / 2}px)`} style={{ background: "linear-gradient(#cfcfcf, #8e8e8e)" }} />
      <Face w={w} h={d} transform={`rotateX(-90deg) translateZ(${h / 2}px)`} className="bg-[#1b1b1b]" />
      {/* The spine */}
      <Face
        w={d}
        h={h}
        transform={`rotateY(-90deg) translateZ(${w / 2}px)`}
        className="overflow-hidden rounded-[2px]"
        style={{ background: "linear-gradient(90deg, #0c0c0c, #1d1d1d 55%, #151515)" }}
      >
        <div
          className="flex h-full w-full items-center justify-between py-2 text-white [writing-mode:vertical-rl]"
          style={{ fontSize: Math.max(8, Math.round(d * 0.36)), lineHeight: 1.18 }}
        >
          <span className="min-h-0 overflow-hidden">
            <span className="block truncate font-medium tracking-[0.02em]">{film.client}</span>
            <span className="block truncate text-white/55">{film.title}</span>
          </span>
          <span className="flex shrink-0 items-center gap-1.5 font-mono text-[0.85em] tabular-nums text-white/50">
            <span
              className={`h-[5px] w-[5px] rounded-full transition-[background-color,box-shadow] duration-300 ${
                lit ? "bg-[#FF6A1A] shadow-[0_0_6px_1px_rgba(255,106,26,0.7)]" : "bg-white/15"
              }`}
            />
            {track(index)}
          </span>
        </div>
      </Face>

      {/* Inside: the black tray and its hub, with the disc on it */}
      <div className="absolute inset-0 [transform-style:preserve-3d]" style={{ transform: `translateZ(${d / 2 - 3}px)` }}>
        <div className="absolute inset-0 rounded-[3px] bg-[#0b0b0b] [backface-visibility:hidden]">
          <div className="absolute inset-y-0 left-0 bg-[#050505]" style={{ width: hinge }} />
          <div
            className="absolute rounded-full"
            style={{
              width: h * 0.16,
              height: h * 0.16,
              left: discLeft + disc / 2 - h * 0.08,
              top: h / 2 - h * 0.08,
              background: "repeating-conic-gradient(#3a3a3a 0deg 10deg, #1c1c1c 10deg 20deg)",
            }}
          />
        </div>
        <motion.div
          ref={discRef}
          className="absolute [backface-visibility:hidden]"
          style={{ width: disc, height: disc, left: discLeft, top: (h - disc) / 2, visibility: discHome ? "visible" : "hidden" }}
          initial={false}
          animate={lifted ? { y: -h * 0.52, z: 22 } : { y: 0, z: 1 }}
          transition={t(LIFT_SPRING)}
        >
          <Disc film={film} size={disc} />
        </motion.div>
      </div>

      {/* The lid, hinged at the spine */}
      <motion.div
        className="absolute inset-0 [transform-style:preserve-3d]"
        style={{ z: d / 2, transformOrigin: "0% 50%" }}
        initial={false}
        animate={{ rotateY: open ? -66 : peek ? -14 : 0 }}
        transition={t(LID_SPRING)}
      >
        {/* Front: the cover under clear plastic */}
        <div className="absolute inset-0 overflow-hidden rounded-[3px] bg-[#111] [backface-visibility:hidden]">
          <div className="absolute inset-y-0 left-0 bg-[linear-gradient(90deg,#060606,#1e1e1e)]" style={{ width: hinge }}>
            <span className="absolute left-1/2 top-[14%] h-[9%] w-px -translate-x-1/2 bg-white/20" />
            <span className="absolute bottom-[14%] left-1/2 h-[9%] w-px -translate-x-1/2 bg-white/20" />
          </div>
          <div className="absolute bottom-[2px] right-[2px] top-[2px]" style={{ left: hinge }}>
            <Image src={film.cover.src} alt="" fill quality={85} sizes={`${w}px`} className="object-cover" draggable={false} />
          </div>
          {/* Glare and the plastic's edge */}
          <div className="absolute inset-0 bg-[linear-gradient(118deg,rgba(255,255,255,0.32)_0%,rgba(255,255,255,0.08)_26%,rgba(255,255,255,0)_42%,rgba(255,255,255,0)_70%,rgba(255,255,255,0.1)_100%)]" />
          <div className="absolute inset-0 rounded-[3px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.4),inset_0_1px_0_rgba(255,255,255,0.6)]" />
        </div>
        {/* Inside of the lid: the booklet's plain back */}
        <div className="absolute inset-0 rounded-[3px] bg-[#e9e7e2] [backface-visibility:hidden] [transform:rotateY(180deg)]" />
      </motion.div>
    </motion.div>
  );
}
