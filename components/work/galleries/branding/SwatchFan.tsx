"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
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
// its name at the end, its mark, then its own colours from its kit (or, for a
// brand without one, its kit stills). Hover fans them wide and lifts the one
// under the pointer; on touch, drag runs along the fan and it opens around
// the blade under your finger. Pick a blade and it leaves the fan: on a wide
// screen it stands up as the spine of a spread and the brand's kit unfolds
// beside it; on a narrower one it flies into the spread's big frame.

export interface BrandSwatch {
  name: string;
  hex: string;
  /** A colour, or a gradient where the kit's swatch is one. */
  bg: string;
}

export interface BrandBlade {
  slug: string;
  name: string;
  /** The name on the blade's end, where a long one won't fit. */
  short: string;
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
/** Never smaller than this: on a phone the fan runs to the screen's edges. */
const MIN_SCALE = 0.66;
// A blade's bands, top to bottom: its name, its mark, its colours (or stills), its foot.
const END = 28;
const CHIPS = 240;

// The fan's spread, in degrees: at rest, and opened by a hovering pointer.
const SPREAD = { rest: 92, open: 124 };
/** How far the neighbours part around a lifted blade. */
const PART = 5;
// On touch the fan opens around one blade: it stands in the middle and the
// rest gather toward the edges (TOUCH_REACH degrees at most), so every blade
// stays on a phone's screen, however far along you are.
const TOUCH_REACH = 37;
const TOUCH_EASE = 2.1;
/** Finger travel, in px, from one blade to the next. */
const TOUCH_STEP = 34;

/** Black or white text on a swatch. */
function ink(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return 0.299 * r + 0.587 * g + 0.114 * b > 150 ? "#171717" : "#FFFFFF";
}

/** The face of a blade, in the fan's units. It's also the spine of the open spread. */
function BladeFace({ blade, sizes = "120px" }: { blade: BrandBlade; sizes?: string }) {
  const [lead, ...rest] = blade.stills;
  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden rounded-[10px] bg-white">
      {/* Right-aligned: in the fan, each blade's right edge is the part the one above leaves showing. */}
      <div className="flex shrink-0 items-center justify-end px-2.5" style={{ height: END }}>
        <span className="truncate text-[11.5px] font-semibold leading-none tracking-[-0.01em] text-neutral-900">{blade.short}</span>
      </div>
      <div className="relative shrink-0 bg-[#EDEDEC]" style={{ height: BW }}>
        <Image src={lead.src} alt="" fill sizes={sizes} quality={75} className="object-cover" draggable={false} />
      </div>
      <div className="flex shrink-0 flex-col" style={{ height: CHIPS }}>
        {blade.palette.length > 0
          ? blade.palette.map((s) => (
              <div key={s.name} className="flex min-h-0 flex-1 flex-col justify-end px-2.5 pb-[6px]" style={{ background: s.bg, color: ink(s.hex) }}>
                <span className="truncate text-[9.5px] font-semibold leading-none">{s.name}</span>
                <span className="mt-[3px] font-mono text-[8.5px] leading-none opacity-70">{s.hex}</span>
              </div>
            ))
          : rest.map((still) => (
              <div key={still.src} className="relative flex-1 bg-[#EDEDEC]">
                <Image src={still.src} alt="" fill sizes={sizes} quality={75} className="object-cover" draggable={false} />
              </div>
            ))}
      </div>
      <div className="relative flex-1 border-t border-black/[0.06] px-2.5 pt-[8px]">
        <p className="truncate text-[9.5px] leading-tight text-neutral-500">
          {blade.title.length > 18 ? "Identity" : blade.title} · {blade.year}
        </p>
        {/* The punched hole the rivet goes through. */}
        <span
          aria-hidden
          className="absolute left-1/2 h-[14px] w-[14px] -translate-x-1/2 rounded-full bg-[#E9E9E6] shadow-[inset_0_1px_2px_rgba(0,0,0,0.28)]"
          style={{ bottom: RIVET - 7 }}
        />
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

const HERO_SIZES = "(min-width: 1024px) 900px, 100vw";
const STILL_SIZES = "(min-width: 1024px) 160px, 33vw";
/** The blade grown into the spread's spine. */
const SPINE_SIZES = "220px";

// The spread's pictures, fetched and decoded while a blade is lifted (or
// pressed), so the flight never waits on them.
const warmed = new Set<string>();
function warm(blade: BrandBlade) {
  if (warmed.has(blade.slug)) return;
  warmed.add(blade.slug);
  const hero = blade.showcase.frames[0].hero;
  const pictures = [
    // The hero as Showcase's Stage asks for it (its quality and size), so it's the same file.
    getImageProps({ src: hero.poster, alt: "", sizes: HERO_SIZES, quality: 80, width: 2560, height: 1440 }).props,
    ...blade.stills.map((s) => getImageProps({ src: s.src, alt: "", sizes: STILL_SIZES, quality: 85, fill: true }).props),
    ...blade.stills.map((s) => getImageProps({ src: s.src, alt: "", sizes: SPINE_SIZES, quality: 75, fill: true }).props),
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
  // On touch, where along the fan the finger is (a blade index, in between while dragging).
  const [along, setAlongState] = useState<number | null>(null);
  const alongRef = useRef<number | null>(null);
  const setAlong = (a: number | null) => {
    alongRef.current = a;
    setAlongState(a);
  };
  const [open, setOpen] = useState<number | null>(null);
  const rot = useMotionValue(0);
  const motionRefs = useRef<{ angle: MotionValue<number>; up: MotionValue<number> }[]>([]);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const quietFocus = useRef(false);

  // Fit the fan to its column; on a phone it stays big and runs to the edges.
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

  const spread = hover || focus !== null ? SPREAD.open : SPREAD.rest;
  const base = useCallback((i: number, s = spread) => -s / 2 + (i * s) / (n - 1), [n, spread]);
  const centre = along ?? focus ?? (n - 1) / 2;
  const targetOf = (i: number) => {
    if (!entered && !reduce) return 0;
    if (touch) return TOUCH_REACH * Math.tanh((i - centre) / TOUCH_EASE);
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

  // Drag. With a mouse it turns the fan, which springs back (it all fits);
  // on touch it runs along the fan, which opens around the blade underneath.
  const drag = useRef<{ x: number; r0: number; a0: number; id: number; moved: boolean } | null>(null);
  const dragged = useRef(false);
  const rotAnim = useRef<AnimationPlaybackControls | null>(null);
  const settle = () => {
    if (touch) {
      const a = alongRef.current;
      if (a !== null) setFocus(Math.round(a));
      setAlong(null);
    } else {
      rotAnim.current = animate(rot, 0, { ...NUDGE, bounce: 0.25 });
    }
  };

  const openBlade = (i: number) => {
    if (dragged.current) return;
    setOpen(i);
  };

  const fanned = blades.map((_, i) => targetOf(i));
  const lifted = touch ? Math.round(centre) : focus;

  // The fan moves under a still pointer as it opens and parts: once it has
  // settled, the blade that's now under the pointer is the one lifted.
  const pointerAt = useRef<{ x: number; y: number } | null>(null);
  useEffect(() => {
    if (!fine || open !== null) return;
    const t = setTimeout(() => {
      const at = pointerAt.current;
      if (!at || drag.current?.moved) return;
      const el = document.elementFromPoint(at.x, at.y)?.closest<HTMLElement>("[data-blade]");
      if (el) setFocus(Number(el.dataset.blade));
    }, 420);
    return () => clearTimeout(t);
  }, [focus, spread, fine, open]);
  // On touch there's no hover to say the blades can be picked, so once the fan
  // is open the middle one stands lifted, its name under it.
  useEffect(() => {
    if (!touch || !entered) return;
    const t = setTimeout(() => setFocus((f) => (f === null ? Math.floor((n - 1) / 2) : f)), reduce ? 0 : 700);
    return () => clearTimeout(t);
  }, [touch, entered, n, reduce]);
  useEffect(() => {
    if (lifted !== null) warm(blades[lifted]);
  }, [lifted, blades]);

  return (
    <div className="relative">
      <div
        ref={wrapRef}
        // Full bleed on a phone, so the fan runs to the screen's edges rather than the column's.
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
            pointerAt.current = null;
            setHover(false);
            setFocus(null);
          }}
          onPointerDown={(e) => {
            if (e.button !== 0) return;
            drag.current = { x: e.clientX, r0: rot.get(), a0: centre, id: e.pointerId, moved: false };
            dragged.current = false;
            const el = (e.target as HTMLElement).closest<HTMLElement>("[data-blade]");
            if (el) warm(blades[Number(el.dataset.blade)]);
          }}
          onPointerMove={(e) => {
            if (e.pointerType === "mouse") pointerAt.current = { x: e.clientX, y: e.clientY };
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
            if (touch) {
              // Drag left to bring the blades on the right to the middle.
              setAlong(Math.max(0, Math.min(n - 1, d.a0 - dx / TOUCH_STEP)));
            } else {
              const limit = spread / 2 + 6;
              rot.set(Math.max(-limit, Math.min(limit, d.r0 + (dx * 57.3) / (300 * scale))));
            }
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
              lift={lifted === i && open === null ? LIFT : 0}
              // The first brand lies on top, its whole face showing; the rest fan out
              // beneath it. On touch, the blades nearest the middle lie on top.
              z={lifted === i ? n + 1 : touch ? n - Math.round(Math.abs(i - centre) * 2) : n - i}
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
                  if (!hover && !touch) setFocus(null);
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
      <FanCaption blade={lifted !== null ? blades[lifted] : null} />
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

// --- The spread ----------------------------------------------------------------

/** Wide enough for the blade to stand as the spread's spine. */
const SPINE_FROM = 1024;
const PAD = 24;

/** The open card's box: centred on a wide screen, the whole screen on a phone. */
function cardBox(): Placement {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  if (vw < 640) return { cx: vw / 2, cy: vh / 2, w: vw, h: vh, rotate: 0, radius: 0 };
  const w = Math.min(1180, vw - 48);
  const h = vw >= SPINE_FROM ? Math.min(780, vh - 40) : vh - 48;
  return { cx: vw / 2, cy: vh / 2, w, h, rotate: 0, radius: 24 };
}

/** The spine's box: the blade grown to the card's height, at its left. */
function spineBox(card: Placement): Placement {
  const h = card.h - PAD * 2;
  const w = (h * BW) / BH;
  return { cx: card.cx - card.w / 2 + PAD + w / 2, cy: card.cy, w, h, rotate: 0, radius: (10 * h) / BH };
}

/**
 * The spread. On a wide screen the blade leaves the fan and stands up, grown,
 * as the spread's spine; the card unfolds from behind it with the brand's kit.
 * Narrower, the blade flies into the spread's big frame, its face giving way
 * to the brand's hero, which lands where the frame plays it. Either way, only
 * one copy of anything is on screen at a time, and closing runs it back.
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
  const [spine] = useState(() => window.innerWidth >= SPINE_FROM);
  // Two springs: the blade's flight, and the card unfolding.
  // With reduced motion it's simply open, from the first frame.
  const fly = useMotionValue(reduce ? 1 : 0);
  const unfold = useMotionValue(reduce ? 1 : 0);
  // Refs, as the transforms below read them on every frame.
  const from = useRef<Placement>(null!);
  if (!from.current) from.current = placement(index);
  const target = useRef<Placement | null>(null);
  const [card, setCard] = useState<Placement>(cardBox);
  const cardRef = useRef(card);
  cardRef.current = card;
  const [phase, setPhase] = useState<"flying" | "landed" | "closing">(reduce ? "landed" : "flying");
  const dialogRef = useRef<HTMLDivElement>(null!);
  const indexRef = useRef(index);
  indexRef.current = index;
  useScrollLock(true);

  // Where the blade lands: the spine, or the hero's frame in the card.
  const measure = useCallback(() => {
    if (spine) {
      target.current = spineBox(cardRef.current);
      return;
    }
    const r = dialogRef.current?.querySelector("[data-spread-stage]")?.getBoundingClientRect();
    if (r) target.current = { cx: r.left + r.width / 2, cy: r.top + r.height / 2, w: r.width, h: r.height, rotate: 0, radius: 14 };
  }, [spine]);

  useLayoutEffect(() => {
    measure();
    if (reduce) {
      fly.set(1);
      unfold.set(1);
      dialogRef.current?.focus({ preventScroll: true });
      return;
    }
    const a = animate(fly, 1, MORPH);
    // The card starts to open as the blade arrives.
    const t = setTimeout(() => animate(unfold, 1, { type: "spring", visualDuration: 0.42, bounce: 0.06, restDelta: 0.004, restSpeed: 0.05 }), spine ? 260 : 120);
    a.then(() => {
      setPhase("landed");
      dialogRef.current?.focus({ preventScroll: true });
    });
    return () => {
      a.stop();
      clearTimeout(t);
    };
  }, [measure, fly, unfold, reduce, spine]);

  useEffect(() => {
    const onResize = () => {
      const c = cardBox();
      cardRef.current = c;
      setCard(c);
      measure();
      // Nudge the transforms to follow.
      fly.set(fly.get());
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [measure, fly]);

  const close = useCallback(() => {
    if (phase === "closing") return;
    const i = indexRef.current;
    if (reduce) {
      onClosed(i);
      return;
    }
    // From wherever it is now, back to wherever its blade is now.
    measure();
    from.current = placement(i);
    setPhase("closing");
    animate(unfold, 0, { type: "spring", visualDuration: 0.3, bounce: 0, restDelta: 0.004, restSpeed: 0.05 });
    // The blade leaves once the card has nearly folded away behind it.
    let started = false;
    const go = () => {
      if (started) return;
      started = true;
      off();
      animate(fly, 0, LAND).then(() => onClosed(i));
    };
    const off = unfold.on("change", (u) => u < 0.22 && go());
    setTimeout(go, spine ? 260 : 60);
  }, [phase, measure, onClosed, fly, unfold, placement, reduce, spine]);

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

  // The flight: centre, size, turn and corners, from one spring. The blade is
  // level well before it lands.
  const at = (t: number) => {
    const a = from.current;
    const b = target.current ?? a;
    return {
      cx: lerp(a.cx, b.cx, t),
      cy: lerp(a.cy, b.cy, t),
      w: Math.max(4, lerp(a.w, b.w, t)),
      h: Math.max(4, lerp(a.h, b.h, t)),
      rotate: lerp(a.rotate, 0, smooth(0, 0.6, t)),
      radius: lerp(a.radius, b.radius, clamp01(t)),
    };
  };
  const backdrop = useTransform(fly, (t) => smooth(0, 0.5, t));
  // The blade's face, scaled as one piece: with the box (as the spine), or as it left the fan (into the frame).
  const spineScale = useTransform(fly, (t) => at(t).h / BH);
  const heroFaceScale = useTransform(fly, () => from.current.w / BW);

  return createPortal(
    <div className="fixed inset-0 z-[100]" data-lenis-prevent>
      <motion.div className="absolute inset-0 bg-[rgba(12,12,14,0.45)]" style={{ opacity: backdrop }} onClick={close} />
      <Card
        card={card}
        spine={spine}
        unfold={unfold}
        dialogRef={dialogRef}
        label={`${blade.name}: ${blade.title}`}
        closing={phase === "closing"}
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
            {spine ? (
              <SpineBody blade={blade} index={index} count={blades.length} spineW={spineBox(card).w} onStep={step} onClose={close} />
            ) : (
              <StackBody blade={blade} index={index} count={blades.length} heroHidden={phase !== "landed"} onStep={step} onClose={close} />
            )}
          </motion.div>
        </AnimatePresence>
      </Card>
      {spine ? (
        // The blade itself: in flight, then standing as the spine.
        <Flyer at={at} fly={fly}>
          <ScaledFace scale={spineScale}>
            <AnimatePresence initial={false}>
              <motion.div
                key={blade.slug}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              >
                <BladeFace blade={blade} sizes={SPINE_SIZES} />
              </motion.div>
            </AnimatePresence>
          </ScaledFace>
        </Flyer>
      ) : (
        phase !== "landed" && (
          <Flyer at={at} fly={fly}>
            <HeroFlight blade={blade} fly={fly} faceScale={heroFaceScale} />
          </Flyer>
        )
      )}
    </div>,
    document.body
  );
}

/** The flying (or standing) blade: a box placed by `at`. */
function Flyer({ at, fly, children }: { at: (t: number) => Placement; fly: MotionValue<number>; children: ReactNode }) {
  const left = useTransform(fly, (t) => at(t).cx - at(t).w / 2);
  const top = useTransform(fly, (t) => at(t).cy - at(t).h / 2);
  const width = useTransform(fly, (t) => at(t).w);
  const height = useTransform(fly, (t) => at(t).h);
  const rotate = useTransform(fly, (t) => at(t).rotate);
  const corner = useTransform(fly, (t) => at(t).radius);
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute overflow-hidden shadow-[0_24px_60px_-20px_rgba(0,0,0,0.45)]"
      style={{ left, top, width, height, rotate, borderRadius: corner }}
    >
      {children}
    </motion.div>
  );
}

/** A blade's face at its own size, scaled to the box it's in. */
function ScaledFace({ scale, children }: { scale: MotionValue<number>; children: ReactNode }) {
  return (
    <motion.div className="absolute left-0 top-0 origin-top-left" style={{ width: BW, height: BH, scale }}>
      {children}
    </motion.div>
  );
}

/** Narrow screens: the blade's face gives way to its top still, then the hero, as it flies into the frame. */
function HeroFlight({ blade, fly, faceScale }: { blade: BrandBlade; fly: MotionValue<number>; faceScale: MotionValue<number> }) {
  const hero = blade.showcase.frames[0].hero;
  const heroImg = getImageProps({ src: hero.poster, alt: "", sizes: HERO_SIZES, quality: 80, width: 2560, height: 1440 }).props;
  const faceOpacity = useTransform(fly, (t) => 1 - smooth(0.04, 0.26, t));
  const heroOpacity = useTransform(fly, (t) => smooth(0.25, 0.6, t));
  return (
    <span className="absolute inset-0 block bg-[#EDEDEC]">
      <Image src={blade.stills[0].src} alt="" fill sizes={SPINE_SIZES} quality={75} className="object-cover" />
      <motion.span className="absolute inset-0 block" style={{ opacity: heroOpacity }}>
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img {...heroImg} className="absolute inset-0 h-full w-full object-cover" />
      </motion.span>
      <motion.span className="absolute inset-0 block" style={{ opacity: faceOpacity }}>
        <ScaledFace scale={faceScale}>
          <BladeFace blade={blade} />
        </ScaledFace>
      </motion.span>
    </span>
  );
}

/** The white card. With a spine it unfolds from behind it; otherwise it fades up behind the flight. */
function Card({
  card,
  spine,
  unfold,
  dialogRef,
  label,
  closing,
  children,
}: {
  card: Placement;
  spine: boolean;
  unfold: MotionValue<number>;
  dialogRef: React.RefObject<HTMLDivElement>;
  label: string;
  closing: boolean;
  children: ReactNode;
}) {
  const cardRef = useRef(card);
  cardRef.current = card;
  // Folded, the card is exactly the spine's box; open, the whole card.
  const clipPath = useTransform(unfold, (u) => {
    const card = cardRef.current;
    const s = spineBox(card);
    const t = clamp01(u);
    const top = lerp(PAD, 0, t);
    const left = lerp(PAD, 0, t);
    const right = lerp(card.w - PAD - s.w, 0, t);
    const r = lerp(s.radius, card.radius, t);
    return `inset(${top.toFixed(1)}px ${right.toFixed(1)}px ${top.toFixed(1)}px ${left.toFixed(1)}px round ${r.toFixed(1)}px)`;
  });
  // Folded, it's hidden: the blade itself is all there is until the card opens from behind it.
  const opacity = useTransform(unfold, (u) => (spine ? smooth(0.02, 0.2, u) : smooth(0, 0.6, u)));
  return (
    <motion.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      tabIndex={-1}
      className="absolute overflow-hidden bg-white outline-none"
      style={{
        left: card.cx - card.w / 2,
        top: card.cy - card.h / 2,
        width: card.w,
        height: card.h,
        borderRadius: card.radius,
        clipPath: spine ? clipPath : undefined,
        opacity,
        pointerEvents: closing ? "none" : "auto",
      }}
    >
      {children}
    </motion.div>
  );
}

function SpreadNav({ index, count, onStep, onClose }: { index: number; count: number; onStep: (d: number) => void; onClose: () => void }) {
  return (
    <div className="flex shrink-0 items-center gap-1.5">
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
  );
}

/**
 * Wide screens: the spine (the blade, standing in its own column) and the kit
 * beside it: the name and nav, the hero as big as the page allows, then the
 * stills, the story, the mark and the links along the foot.
 */
function SpineBody({
  blade,
  index,
  count,
  spineW,
  onStep,
  onClose,
}: {
  blade: BrandBlade;
  index: number;
  count: number;
  spineW: number;
  onStep: (d: number) => void;
  onClose: () => void;
}) {
  const data = blade.showcase;
  const picked = useMemo(() => new Set([data.initial]), [data.initial]);
  return (
    <div className="flex h-full" style={{ padding: PAD, gap: 28 }}>
      {/* Room for the spine, which stands here. */}
      <div aria-hidden className="shrink-0" style={{ width: spineW }} />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex shrink-0 items-start justify-between gap-6">
          <div className="min-w-0">
            <h2 className="text-[32px] font-medium leading-[1.05] tracking-[-0.035em] text-black">{blade.name}</h2>
            <p className="mt-1.5 text-sm text-neutral-500">
              <Meta items={blade.meta} />
            </p>
          </div>
          <SpreadNav index={index} count={count} onStep={onStep} onClose={onClose} />
        </div>
        {/* The hero, as big as the room allows at 16:9. */}
        <div className="mt-5 min-h-0 flex-1" style={{ containerType: "size" }}>
          <div className="group/stage relative" style={{ width: "min(100cqw, calc(100cqh * 16 / 9))" }}>
            <Stage data={data} active={data.initial} picked={picked} eager sizes={HERO_SIZES} />
          </div>
        </div>
        <div className="mt-4 flex shrink-0 gap-5">
          <div className="flex shrink-0 gap-2.5">
            {data.stills.map((still) => (
              <div key={still.src} className="relative h-[140px] w-[140px] overflow-hidden rounded-[12px] bg-[#EDEDEC]">
                <Image src={still.src} alt={still.alt} fill sizes={STILL_SIZES} quality={85} className="object-cover" />
              </div>
            ))}
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            {data.summary && <p className="line-clamp-3 text-pretty text-sm leading-[1.5] text-neutral-600">{data.summary}</p>}
            <div className="mt-auto flex flex-wrap items-center gap-2 pt-3">
              {blade.mark && <MarkTile mark={blade.mark} name={blade.name} small />}
              <SpreadLinks links={data.links} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Narrower screens: one scrolling column: the hero, the stills, the name and story, the colours, the mark. */
function StackBody({
  blade,
  index,
  count,
  heroHidden,
  onStep,
  onClose,
}: {
  blade: BrandBlade;
  index: number;
  count: number;
  /** While the blade flies in carrying the hero, the frame waits for it. */
  heroHidden: boolean;
  onStep: (d: number) => void;
  onClose: () => void;
}) {
  const data = blade.showcase;
  const picked = useMemo(() => new Set([data.initial]), [data.initial]);
  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex shrink-0 items-center justify-between gap-4 px-4 pb-1 pt-3 sm:px-6 sm:pt-5">
        <p className="text-sm text-neutral-500">
          <Meta items={blade.meta} />
        </p>
        <SpreadNav index={index} count={count} onStep={onStep} onClose={onClose} />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-8 pt-3 sm:px-6" data-lenis-prevent>
        <div className="group/stage relative" data-spread-stage style={{ visibility: heroHidden ? "hidden" : "visible" }}>
          <Stage data={data} active={data.initial} picked={picked} eager sizes={HERO_SIZES} />
        </div>
        <div className="mt-2.5 grid grid-cols-3 gap-2.5 sm:mt-3 sm:gap-3">
          {data.stills.map((still) => (
            <div key={still.src} className="relative aspect-square overflow-hidden rounded-[10px] bg-[#EDEDEC]">
              <Image src={still.src} alt={still.alt} fill sizes={STILL_SIZES} quality={85} className="object-cover" />
            </div>
          ))}
        </div>
        <h2 className="mt-7 text-[30px] font-medium leading-[1.05] tracking-[-0.035em] text-black">{blade.name}</h2>
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
        {blade.mark && (
          <div className="mt-7">
            <p className="text-sm text-neutral-500">Mark</p>
            <div className="mt-3">
              <MarkTile mark={blade.mark} name={blade.name} />
            </div>
          </div>
        )}
        <div className="mt-7">
          <SpreadLinks links={data.links} />
        </div>
      </div>
    </div>
  );
}

function MarkTile({ mark, name, small = false }: { mark: { src: string; dark: boolean }; name: string; small?: boolean }) {
  return (
    <div className={`flex items-center justify-center rounded-[12px] ${mark.dark ? "bg-[#111111]" : "bg-[#F4F4F2]"} ${small ? "h-9 px-4" : "h-24 px-6"}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={mark.src} alt={`${name} logo`} className={`max-w-full object-contain ${small ? "max-h-[18px]" : "max-h-11"}`} />
    </div>
  );
}

function SpreadLinks({ links }: { links: ShowcaseData["links"] }) {
  if (links.length === 0) return null;
  return (
    <>
      {links.map((link) =>
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
            className="group/link mr-2 inline-flex h-9 items-center gap-1.5 rounded-full bg-black/[0.05] px-4 text-sm font-medium text-black transition-colors duration-200 hover:bg-black/[0.09]"
          >
            {link.label}
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover/link:translate-x-0.5" />
          </Link>
        )
      )}
    </>
  );
}

function RoundButton({ label, onClick, className = "", children }: { label: string; onClick: () => void; className?: string; children: ReactNode }) {
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
