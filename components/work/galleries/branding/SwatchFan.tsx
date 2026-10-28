"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image, { getImageProps } from "next/image";
import Link from "next/link";
import { AnimatePresence, animate, motion, useMotionValue, useTransform, type AnimationPlaybackControls, type MotionValue } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from "lucide-react";
import type { ShowcaseData } from "@/lib/work";
import { Stage } from "@/components/work/Showcase";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { LAND, MORPH, NUDGE, clamp01, lerp, smooth, useMedia, useScrollLock } from "../shared";

// The brands as a swatch fan, pinned at one rivet. Each blade carries a brand:
// its mark on top, then its own colours from its kit (or, for a brand without
// one, its kit stills), then its name. Hover fans them wide and lifts the one
// under the pointer; on touch, drag turns the fan. Pick a blade and it leaves
// the fan and opens into a spread of the brand's kit: the reel or hero, the
// stills, the palette, the mark.

export interface BrandSwatch {
  name: string;
  hex: string;
  /** A colour, or a gradient where the kit's swatch is one. */
  bg: string;
}

export interface BrandBlade {
  slug: string;
  name: string;
  /** Under the name: its client where that differs, what it is, the year. */
  meta: string[];
  title: string;
  year: string;
  /** The blade's top still first, then the rest of the kit's. */
  stills: { src: string; alt: string }[];
  /** From the brand's kit only; empty when it has none. */
  palette: BrandSwatch[];
  mark?: { src: string; dark: boolean };
  showcase: ShowcaseData;
}

// The fan, in its own units (scaled to fit): a blade, where the rivet sits on
// it, and the box the open fan needs.
const BW = 120;
const BH = 460;
const RIVET = 30;
const LIFT = 16;
const FW = 900;
const FH = 510;
const PX = FW / 2;
const PY = FH - 44;
/** Rivet to the middle of a blade. */
const ARM = BH / 2 - RIVET;
/** Never smaller than this: on a phone the fan runs off both edges and turns instead. */
const MIN_SCALE = 0.66;

// The fan's spread, in degrees: at rest, opened by a hovering pointer, and on touch.
const SPREAD = { rest: 92, open: 124, touch: 118 };
/** How far the neighbours part around a lifted blade. */
const PART = 5;

/** Black or white text on a swatch. */
function ink(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return 0.299 * r + 0.587 * g + 0.114 * b > 150 ? "#171717" : "#FFFFFF";
}

/** The face of a blade, in the fan's units. Also flies out with the blade when it opens. */
function BladeFace({ blade }: { blade: BrandBlade }) {
  const [lead, ...rest] = blade.stills;
  const chips = blade.palette.slice(0, 4);
  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden rounded-[10px] bg-white">
      <div className="relative shrink-0 bg-[#EDEDEC]" style={{ height: BW }}>
        <Image src={lead.src} alt="" fill sizes="120px" quality={80} className="object-cover" draggable={false} />
      </div>
      <div className="flex shrink-0 flex-col" style={{ height: BW * 2 }}>
        {chips.length > 0
          ? chips.map((s) => (
              <div
                key={s.name}
                className="flex flex-1 flex-col justify-end px-2.5 pb-[7px]"
                style={{ background: s.bg, color: ink(s.hex) }}
              >
                <span className="text-[9.5px] font-semibold leading-none">{s.name}</span>
                <span className="mt-[3px] font-mono text-[8.5px] leading-none opacity-70">{s.hex}</span>
              </div>
            ))
          : rest.map((still) => (
              <div key={still.src} className="relative flex-1 bg-[#EDEDEC]">
                <Image src={still.src} alt="" fill sizes="120px" quality={80} className="object-cover" draggable={false} />
              </div>
            ))}
      </div>
      <div className="flex-1 border-t border-black/[0.06] px-2.5 pt-[11px]">
        <p className="truncate text-[12.5px] font-semibold leading-tight tracking-[-0.01em] text-neutral-900">{blade.name}</p>
        <p className="mt-[3px] truncate text-[9.5px] leading-tight text-neutral-500">{blade.year}</p>
      </div>
    </div>
  );
}

function Blade({
  blade,
  index,
  target,
  lift,
  z,
  rot,
  hidden,
  delay,
  reduce,
  register,
  onHover,
  onOpen,
  onFocusChange,
  buttonRef,
}: {
  blade: BrandBlade;
  index: number;
  target: number;
  lift: number;
  z: number;
  rot: MotionValue<number>;
  hidden: boolean;
  delay: number;
  reduce: boolean;
  register: (i: number, angle: MotionValue<number>, up: MotionValue<number>) => void;
  onHover: (i: number) => void;
  onOpen: (i: number) => void;
  onFocusChange: (i: number | null) => void;
  buttonRef: (el: HTMLButtonElement | null) => void;
}) {
  const angle = useMotionValue(0);
  const up = useMotionValue(0);
  useEffect(() => register(index, angle, up), [register, index, angle, up]);
  useEffect(() => {
    if (reduce) {
      angle.set(target);
      up.set(lift);
      return;
    }
    const a = animate(angle, target, { ...NUDGE, bounce: delay ? 0.22 : NUDGE.bounce, delay });
    const b = animate(up, lift, NUDGE);
    return () => {
      a.stop();
      b.stop();
    };
  }, [angle, up, target, lift, delay, reduce]);
  const transform = useTransform(() => `rotate(${angle.get() + rot.get()}deg) translateY(${-up.get()}px)`);

  return (
    <motion.button
      ref={buttonRef}
      type="button"
      data-blade={index}
      aria-label={`${blade.name}: ${blade.title}, ${blade.year}`}
      aria-haspopup="dialog"
      onPointerEnter={(e) => e.pointerType === "mouse" && onHover(index)}
      onPointerMove={(e) => e.pointerType === "mouse" && onHover(index)}
      onFocus={() => onFocusChange(index)}
      onBlur={() => onFocusChange(null)}
      onClick={() => onOpen(index)}
      className="group/blade absolute cursor-pointer rounded-[10px] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
      style={{
        left: PX - BW / 2,
        top: PY - (BH - RIVET),
        width: BW,
        height: BH,
        transformOrigin: `50% ${BH - RIVET}px`,
        transform,
        zIndex: z,
        visibility: hidden ? "hidden" : "visible",
      }}
    >
      {/* Pressed, the blade gives a little. */}
      <span className="absolute inset-0 rounded-[10px] shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.06),0_10px_28px_-10px_rgba(0,0,0,0.32)] transition-transform duration-150 ease-out group-active/blade:scale-[0.97]">
        <BladeFace blade={blade} />
      </span>
    </motion.button>
  );
}

// The spread's pictures, fetched and decoded while a blade is lifted, so the
// flight never waits on them.
const warmed = new Set<string>();
function warm(blade: BrandBlade) {
  if (warmed.has(blade.slug)) return;
  warmed.add(blade.slug);
  const hero = blade.showcase.frames[0].hero;
  const pictures = [
    getImageProps({ src: hero.poster, alt: "", sizes: HERO_SIZES, quality: 80, width: 2560, height: 1440 }).props,
    ...blade.stills.map((s) => getImageProps({ src: s.src, alt: "", sizes: STILL_SIZES, quality: 85, fill: true }).props),
    getImageProps({ src: blade.stills[0].src, alt: "", sizes: HERO_SIZES, quality: 70, fill: true }).props,
  ];
  for (const props of pictures) {
    const img = new window.Image();
    if (props.sizes) img.sizes = props.sizes;
    if (props.srcSet) img.srcset = props.srcSet;
    img.src = props.src;
    img.decode().catch(() => {});
  }
}

/** Where a blade is on screen, as its centre, size and turn. */
interface Placement {
  cx: number;
  cy: number;
  w: number;
  h: number;
  rotate: number;
  radius: number;
}

export default function SwatchFan({ blades }: { blades: BrandBlade[] }) {
  const n = blades.length;
  const reduce = usePrefersReducedMotion();
  const fine = useMedia("(hover: hover) and (pointer: fine)");
  const touch = fine === false;
  const wrapRef = useRef<HTMLDivElement>(null);
  const fanRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [entered, setEntered] = useState(false);
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState<number | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  const rot = useMotionValue(0);
  const motionRefs = useRef<{ angle: MotionValue<number>; up: MotionValue<number> }[]>([]);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const quietFocus = useRef(false);

  // Fit the fan to its column; on a phone it stays big and runs off the edges.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setScale(Math.min(1, Math.max(MIN_SCALE, entry.contentRect.width / FW))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // The fan opens the first time it comes into view, blade after blade.
  const [entering, setEntering] = useState(false);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => entry.isIntersecting && setEntered(true), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!entered) return;
    setEntering(true);
    const t = setTimeout(() => setEntering(false), 900);
    return () => clearTimeout(t);
  }, [entered]);

  const spread = touch ? SPREAD.touch : hover || focus !== null ? SPREAD.open : SPREAD.rest;
  const base = useCallback((i: number, s = spread) => -s / 2 + (i * s) / (n - 1), [n, spread]);
  const targetOf = (i: number) => {
    if (!entered && !reduce) return 0;
    const a = base(i);
    if (focus === null) return a;
    return a + (i < focus ? -PART : i > focus ? PART : 0);
  };

  const register = useCallback((i: number, angle: MotionValue<number>, up: MotionValue<number>) => {
    motionRefs.current[i] = { angle, up };
  }, []);

  // Where blade i is right now, on screen.
  const placement = useCallback(
    (i: number): Placement => {
      const box = fanRef.current!.getBoundingClientRect();
      const m = motionRefs.current[i];
      const a = (m ? m.angle.get() : base(i)) + rot.get();
      const r = ((m ? m.up.get() : 0) + ARM) * scale;
      const rad = (a * Math.PI) / 180;
      const px = box.left + PX * scale;
      const py = box.top + PY * scale;
      return { cx: px + Math.sin(rad) * r, cy: py - Math.cos(rad) * r, w: BW * scale, h: BH * scale, rotate: a, radius: 10 * scale };
    },
    [base, rot, scale]
  );

  // Drag turns the fan. A touch fan settles with the nearest blade on top; a
  // mouse fan springs back, as it all fits.
  const drag = useRef<{ x: number; r0: number; id: number; moved: boolean } | null>(null);
  const dragged = useRef(false);
  const rotAnim = useRef<AnimationPlaybackControls | null>(null);
  const nearest = () => {
    let best = 0;
    for (let i = 1; i < n; i++) if (Math.abs(base(i) + rot.get()) < Math.abs(base(best) + rot.get())) best = i;
    return best;
  };
  const settle = () => {
    if (touch) {
      const k = nearest();
      setFocus(k);
      rotAnim.current = animate(rot, -base(k), NUDGE);
    } else {
      rotAnim.current = animate(rot, 0, { ...NUDGE, bounce: 0.25 });
    }
  };

  const openBlade = (i: number) => {
    if (dragged.current) return;
    setOpen(i);
  };

  const fanned = blades.map((_, i) => targetOf(i));
  // On touch there's no hover to say the blades can be picked, so once the fan
  // is open the middle one stands lifted, its name under it.
  useEffect(() => {
    if (!touch || !entered) return;
    const t = setTimeout(() => setFocus((f) => (f === null ? Math.floor((n - 1) / 2) : f)), reduce ? 0 : 700);
    return () => clearTimeout(t);
  }, [touch, entered, n, reduce]);
  useEffect(() => {
    if (focus !== null) warm(blades[focus]);
  }, [focus, blades]);

  return (
    <div className="relative">
      <div
        ref={wrapRef}
        // Full bleed on a phone, so the fan runs off the screen's edges rather than the column's.
        className="relative -mx-5 overflow-x-clip sm:mx-0"
        style={{ height: FH * scale }}
      >
        <div
          ref={fanRef}
          className="absolute left-1/2 top-0 select-none"
          style={{ width: FW, height: FH, marginLeft: -FW / 2, transform: `scale(${scale})`, transformOrigin: "50% 0", touchAction: "pan-y" }}
          onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
          onPointerLeave={(e) => {
            if (e.pointerType !== "mouse") return;
            setHover(false);
            setFocus(null);
          }}
          onPointerDown={(e) => {
            if (e.button !== 0) return;
            drag.current = { x: e.clientX, r0: rot.get(), id: e.pointerId, moved: false };
            dragged.current = false;
          }}
          onPointerMove={(e) => {
            const d = drag.current;
            if (!d || d.id !== e.pointerId) return;
            const dx = e.clientX - d.x;
            if (!d.moved) {
              if (Math.abs(dx) < 6) return;
              d.moved = true;
              dragged.current = true;
              rotAnim.current?.stop();
              fanRef.current?.setPointerCapture(e.pointerId);
            }
            // About as far as the finger moves, at the blades' middle.
            const limit = spread / 2 + 6;
            const next = d.r0 + (dx * 57.3) / (300 * scale);
            rot.set(Math.max(-limit, Math.min(limit, next)));
            if (touch) setFocus(nearest());
          }}
          onPointerUp={(e) => {
            const d = drag.current;
            drag.current = null;
            if (d?.moved) {
              fanRef.current?.releasePointerCapture(e.pointerId);
              settle();
            }
          }}
          onPointerCancel={() => {
            if (drag.current?.moved) settle();
            drag.current = null;
          }}
        >
          {blades.map((blade, i) => (
            <Blade
              key={blade.slug}
              blade={blade}
              index={i}
              target={fanned[i]}
              lift={focus === i && open === null ? LIFT : 0}
              // The first brand lies on top, its whole face showing; the rest fan out beneath it.
              z={focus === i ? n + 1 : n - i}
              rot={rot}
              hidden={open === i}
              delay={entering ? i * 0.035 : 0}
              reduce={reduce}
              register={register}
              onHover={(k) => !drag.current?.moved && setFocus(k)}
              onOpen={openBlade}
              onFocusChange={(k) => {
                if (quietFocus.current) return;
                if (k === null) {
                  if (!hover) setFocus(null);
                } else setFocus(k);
              }}
              buttonRef={(el) => {
                buttons.current[i] = el;
              }}
            />
          ))}
          {/* The rivet. */}
          <span
            aria-hidden
            className="pointer-events-none absolute rounded-full"
            style={{
              left: PX - 9,
              top: PY - 9,
              width: 18,
              height: 18,
              zIndex: n + 2,
              background: "radial-gradient(circle at 35% 30%, #FFFFFF 0%, #D9D9D6 28%, #9A9A96 62%, #6B6B67 100%)",
              boxShadow: "0 1px 2px rgba(0,0,0,0.35), inset 0 -1px 1px rgba(0,0,0,0.25)",
            }}
          />
        </div>
      </div>
      <FanCaption blade={focus !== null ? blades[focus] : null} />
      {open !== null && (
        <Spread
          blades={blades}
          index={open}
          onIndex={setOpen}
          placement={placement}
          reduce={reduce}
          onClosed={(i) => {
            setOpen(null);
            // Focus goes back to the blade, without lifting it under a pointer that's elsewhere.
            quietFocus.current = true;
            buttons.current[i]?.focus({ preventScroll: true });
            quietFocus.current = false;
          }}
        />
      )}
    </div>
  );
}

/** The lifted blade's name under the fan, so it reads level. */
function FanCaption({ blade }: { blade: BrandBlade | null }) {
  return (
    <div aria-hidden className="relative mt-4 h-12 text-center sm:mt-5">
      <AnimatePresence initial={false}>
        {blade && (
          <motion.p
            key={blade.slug}
            className="absolute inset-x-0 top-0"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4, transition: { duration: 0.12 } }}
            transition={NUDGE}
          >
            <span className="block text-[17px] font-medium tracking-[-0.02em] text-black">{blade.name}</span>
            <span className="mt-0.5 block text-sm text-neutral-500">
              <Meta items={blade.meta} />
            </span>
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/** "Arch Network · 2025", with quiet dots. */
function Meta({ items }: { items: string[] }) {
  return (
    <>
      {items.map((item, i) => (
        <span key={item}>
          {i > 0 && <span className="mx-1.5 text-neutral-300">·</span>}
          <span className="tabular-nums">{item}</span>
        </span>
      ))}
    </>
  );
}

/** The open card's box: centred on a wide screen, the whole screen on a phone. */
function cardBox(): Placement {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  if (vw < 640) return { cx: vw / 2, cy: vh / 2, w: vw, h: vh, rotate: 0, radius: 0 };
  const w = Math.min(1160, vw - 48);
  const h = vw >= 1024 ? Math.min(760, vh - 48) : vh - 48;
  return { cx: vw / 2, cy: vh / 2, w, h, rotate: 0, radius: 24 };
}

/**
 * The spread. The blade flies from its place in the fan to the spread's big
 * frame, turning level as it grows: its face gives way to its top still, then
 * to the brand's hero, which lands exactly where the frame plays it. The card
 * opens behind it. Closing runs the same flight back into the fan.
 */
function Spread({
  blades,
  index,
  onIndex,
  placement,
  reduce,
  onClosed,
}: {
  blades: BrandBlade[];
  index: number;
  onIndex: (i: number) => void;
  placement: (i: number) => Placement;
  reduce: boolean;
  onClosed: (i: number) => void;
}) {
  const blade = blades[index];
  const p = useMotionValue(0);
  // Refs, as the flight's transforms below read them on every frame.
  const from = useRef<Placement>(null!);
  if (!from.current) from.current = placement(index);
  const target = useRef<Placement>(null!);
  const [card, setCard] = useState<Placement>(cardBox);
  const [phase, setPhase] = useState<"flying" | "landed" | "closing">(reduce ? "landed" : "flying");
  const dialogRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(index);
  indexRef.current = index;
  useScrollLock(true);

  // Where the hero sits in the card: the flight's landing spot.
  const measure = useCallback(() => {
    const el = dialogRef.current?.querySelector("[data-spread-stage]");
    const r = el?.getBoundingClientRect();
    if (!r) return;
    target.current = { cx: r.left + r.width / 2, cy: r.top + r.height / 2, w: r.width, h: r.height, rotate: 0, radius: r.width >= 600 ? 18 : 14 };
  }, []);

  useLayoutEffect(() => {
    measure();
    if (reduce) {
      p.set(1);
      dialogRef.current?.focus({ preventScroll: true });
      return;
    }
    const a = animate(p, 1, MORPH);
    a.then(() => {
      setPhase("landed");
      dialogRef.current?.focus({ preventScroll: true });
    });
    return () => a.stop();
  }, [measure, p, reduce]);

  useEffect(() => {
    const onResize = () => setCard(cardBox());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const close = useCallback(() => {
    if (phase === "closing") return;
    const i = indexRef.current;
    if (reduce) {
      onClosed(i);
      return;
    }
    // From wherever the hero is now, back to wherever its blade is now.
    measure();
    from.current = placement(i);
    setPhase("closing");
    animate(p, 0, LAND).then(() => onClosed(i));
  }, [phase, measure, onClosed, p, placement, reduce]);

  const step = useCallback((d: number) => onIndex((indexRef.current + d + blades.length) % blades.length), [blades.length, onIndex]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close, step]);

  // The flyer's box, turn and corners, all from one spring.
  const at = (t: number) => {
    const a = from.current;
    const b = target.current ?? a;
    const w = Math.max(4, lerp(a.w, b.w, t));
    const h = Math.max(4, lerp(a.h, b.h, t));
    return { left: lerp(a.cx, b.cx, t) - w / 2, top: lerp(a.cy, b.cy, t) - h / 2, w, h };
  };
  const left = useTransform(p, (t) => at(t).left);
  const top = useTransform(p, (t) => at(t).top);
  const width = useTransform(p, (t) => at(t).w);
  const height = useTransform(p, (t) => at(t).h);
  const rotate = useTransform(p, (t) => lerp(from.current.rotate, 0, t));
  const radius = useTransform(p, (t) => lerp(from.current.radius, target.current?.radius ?? 18, clamp01(t)));
  const faceOpacity = useTransform(p, (t) => 1 - smooth(0.04, 0.26, t));
  const faceScale = useTransform(p, () => from.current.w / BW);
  const heroOpacity = useTransform(p, (t) => smooth(0.3, 0.75, t));
  const backdrop = useTransform(p, (t) => clamp01(t));
  const cardOpacity = useTransform(p, (t) => smooth(0.06, 0.42, t));
  const cardScale = useTransform(p, (t) => lerp(0.97, 1, clamp01(t)));

  const hero = blade.showcase.frames[0].hero;
  const heroImg = getImageProps({ src: hero.poster, alt: "", sizes: HERO_SIZES, quality: 80, width: 2560, height: 1440 }).props;

  return createPortal(
    <div className="fixed inset-0 z-[100]" data-lenis-prevent>
      <motion.div className="absolute inset-0 bg-[rgba(12,12,14,0.45)]" style={{ opacity: backdrop }} onClick={close} />
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${blade.name}: ${blade.title}`}
        tabIndex={-1}
        className="absolute overflow-hidden bg-white shadow-[0_40px_100px_-30px_rgba(0,0,0,0.5)] outline-none"
        style={{
          left: card.cx - card.w / 2,
          top: card.cy - card.h / 2,
          width: card.w,
          height: card.h,
          borderRadius: card.radius,
          opacity: cardOpacity,
          scale: cardScale,
          pointerEvents: phase === "closing" ? "none" : "auto",
        }}
      >
        <AnimatePresence initial={false}>
          <motion.div
            key={blade.slug}
            className="absolute inset-0"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0, transition: { duration: 0.16 } }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            <SpreadBody blade={blade} index={index} count={blades.length} onStep={step} onClose={close} />
          </motion.div>
        </AnimatePresence>
      </motion.div>
      {/* The blade, in flight. Gone once it lands: the frame underneath shows the same picture. */}
      {phase !== "landed" && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute overflow-hidden bg-[#EDEDEC] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.45)]"
          style={{ left, top, width, height, rotate, borderRadius: radius }}
        >
          <Image src={blade.stills[0].src} alt="" fill sizes="(min-width: 1024px) 760px, 100vw" quality={70} className="object-cover" />
          <motion.div className="absolute inset-0" style={{ opacity: heroOpacity }}>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <img {...heroImg} className="absolute inset-0 h-full w-full object-cover" />
          </motion.div>
          <motion.div className="absolute left-0 top-0 origin-top-left" style={{ width: BW, height: BH, scale: faceScale, opacity: faceOpacity }}>
            <BladeFace blade={blade} />
          </motion.div>
        </motion.div>
      )}
    </div>,
    document.body
  );
}

const HERO_SIZES = "(min-width: 1024px) 760px, 100vw";
const STILL_SIZES = "(min-width: 1024px) 250px, 33vw";

/** The kit, laid out as a spread: media on the left page, the system on the right. */
function SpreadBody({
  blade,
  index,
  count,
  onStep,
  onClose,
}: {
  blade: BrandBlade;
  index: number;
  count: number;
  onStep: (d: number) => void;
  onClose: () => void;
}) {
  const data = blade.showcase;
  const picked = useMemo(() => new Set([data.initial]), [data.initial]);
  const stills = data.stills;

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex shrink-0 items-center justify-between gap-4 px-4 pb-1 pt-3 sm:px-6 sm:pt-5 lg:px-7">
        <p className="text-sm text-neutral-500">
          <Meta items={blade.meta} />
        </p>
        <div className="flex items-center gap-1.5">
          <span className="mr-1 hidden text-sm tabular-nums text-neutral-400 sm:inline">
            {index + 1} / {count}
          </span>
          <RoundButton label="Previous brand" onClick={() => onStep(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </RoundButton>
          <RoundButton label="Next brand" onClick={() => onStep(1)}>
            <ArrowRight className="h-4 w-4" />
          </RoundButton>
          <RoundButton label="Close" onClick={onClose} className="ml-1.5">
            <X className="h-4 w-4" />
          </RoundButton>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-8 pt-3 sm:px-6 lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8 lg:overflow-hidden lg:px-7 lg:pb-7" data-lenis-prevent>
        <div className="flex min-h-0 flex-col gap-2.5 sm:gap-3">
          <div className="group/stage relative" data-spread-stage>
            <Stage data={data} active={data.initial} picked={picked} eager sizes={HERO_SIZES} />
          </div>
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
            {stills.map((still) => (
              <div key={still.src} className="relative aspect-square overflow-hidden rounded-[10px] bg-[#EDEDEC] lg:rounded-[14px]">
                <Image src={still.src} alt={still.alt} fill sizes={STILL_SIZES} quality={85} className="object-cover" />
              </div>
            ))}
          </div>
        </div>
        <aside className="mt-7 flex min-h-0 flex-col lg:mt-0 lg:overflow-y-auto" data-lenis-prevent>
          <h2 className="text-[30px] font-medium leading-[1.05] tracking-[-0.035em] text-black lg:text-[38px]">{blade.name}</h2>
          {data.summary && <p className="mt-3 text-pretty text-[15px] leading-[1.5] text-neutral-600">{data.summary}</p>}
          {blade.palette.length > 0 && (
            <div className="mt-7">
              <p className="text-sm text-neutral-500">Colour</p>
              <div className="mt-3 grid grid-cols-3 gap-x-2.5 gap-y-3.5">
                {blade.palette.map((s) => (
                  <div key={s.name}>
                    <div className="h-14 rounded-[10px] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]" style={{ background: s.bg }} />
                    <p className="mt-1.5 truncate text-[12.5px] font-medium leading-tight text-neutral-900">{s.name}</p>
                    <p className="mt-0.5 font-mono text-[11px] leading-tight text-neutral-500">{s.hex}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* The mark and links sit at the foot of the page, like a book's colophon. */}
          <div className="lg:mt-auto" />
          {blade.mark && (
            <div className="mt-7">
              <p className="text-sm text-neutral-500">Mark</p>
              <div className={`mt-3 flex h-24 items-center justify-center rounded-[12px] px-6 ${blade.mark.dark ? "bg-[#111111]" : "bg-[#F4F4F2]"}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={blade.mark.src} alt={`${blade.name} logo`} className="max-h-11 max-w-full object-contain" />
              </div>
            </div>
          )}
          {data.links.length > 0 && (
            <div className="mt-7 flex flex-wrap gap-2">
              {data.links.map((link) =>
                link.external ? (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener"
                    className="group/link inline-flex h-9 items-center gap-1.5 rounded-full bg-neutral-900 px-4 text-sm font-medium text-white transition-colors duration-200 hover:bg-black"
                  >
                    {link.label}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group/link inline-flex h-9 items-center gap-1.5 rounded-full bg-black/[0.05] px-4 text-sm font-medium text-black transition-colors duration-200 hover:bg-black/[0.09]"
                  >
                    {link.label}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover/link:translate-x-0.5" />
                  </Link>
                )
              )}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function RoundButton({ label, onClick, className = "", children }: { label: string; onClick: () => void; className?: string; children: React.ReactNode }) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      className={`flex h-9 w-9 items-center justify-center rounded-full bg-black/[0.05] text-neutral-800 transition-colors duration-200 hover:bg-black/[0.09] ${className}`}
    >
      {children}
    </motion.button>
  );
}
