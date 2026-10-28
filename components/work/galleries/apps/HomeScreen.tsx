"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import Image, { getImageProps } from "next/image";
import Link from "next/link";
import { AnimatePresence, animate, motion, useMotionValue, useTransform, type MotionValue } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, Play, X } from "lucide-react";
import type { ShowcaseLink } from "@/lib/work";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { LAND, MORPH, NUDGE, lerp, smooth, useMedia, useScrollLock } from "../shared";

// The apps on a home screen. On a wide screen it's a tablet lying back on the
// page, rising to face you as the pointer comes near; on a phone it's the
// phone's own screen. Tap an icon and the app opens the way iOS opens one: the
// icon grows into the whole screen and the app's first screen comes up through
// it. Inside, swipe or step through its screens: real captures from its kit.
// The home bar (or a swipe up on it) closes it back into its icon.

export type AppIcon = { kind: "mark"; src: string } | { kind: "tile"; src: string } | { kind: "shield" } | { kind: "letter" };

export interface AppScreen {
  src: string;
  alt: string;
  /** wide: a 16:9 frame; tall: a phone screen (2:3); square: a still. */
  shape: "wide" | "tall" | "square";
  clip?: { src: string; range?: [number, number]; start?: number };
}

export interface AppItem {
  slug: string;
  name: string;
  title: string;
  year: string;
  summary?: string;
  icon: AppIcon;
  screens: AppScreen[];
  links: ShowcaseLink[];
}

/** The tablet's screen in its own units: a status bar over a 16:9 frame. */
const SCREEN_W = 924;
const BAR = 26;
const SCREEN_H = BAR + (SCREEN_W * 9) / 16;
const cq = (px: number) => `${((px / SCREEN_W) * 100).toFixed(3)}cqw`;
/** Icon corners, as iOS rounds them. */
const ICON_RADIUS = 0.225;
const APP_BG = "#0E0E10";

const WIDE_SIZES = "(min-width: 1024px) 924px, 92vw";
const FIT_SIZES = "(min-width: 1024px) 560px, 92vw";

// --- Icons -------------------------------------------------------------------

/** The IDScanner shield (TokenWorks), from the app's own vector. */
function Shield({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 22 24" className={className} fill="currentColor" aria-hidden>
      <g transform="translate(0.445 0.21)">
        <path d="M5.81195 2.00195H4.92969V6.68463H5.81195V2.00195Z" />
        <path d="M4.19466 2.00195H3.3125V6.68463H4.19466V2.00195Z" />
        <path d="M1.97656 2.40561V6.68473H2.85872V2.00195H2.36815C2.14786 2.00195 1.97656 2.1635 1.97656 2.40561Z" />
        <path d="M3.3125 18.0849C3.57353 18.4749 3.86795 18.8345 4.19466 19.1606V7.87695H3.3125V18.0849Z" />
        <path d="M4.92969 19.8003C5.20852 20.0123 5.50254 20.2064 5.81195 20.3807V7.87695H4.92969V19.8003Z" />
        <path d="M2.3955 7.87695H2.00391V13.4377C2.00391 14.9194 2.3103 16.2124 2.85719 17.305V7.87695H2.3955Z" />
        <path d="M18.7425 7.87705H7.00391V20.9302C8.08643 21.3321 9.29168 21.5403 10.5682 21.5403C15.3406 21.5403 19.1341 18.6579 19.1341 13.4377V7.87695H18.7426L18.7425 7.87705Z" />
        <path d="M21.1098 13.6409V1.69571C21.1098 1.22748 20.9189 0.803497 20.6102 0.496704C20.3016 0.18991 19.8752 0 19.4042 0H1.70684C1.23588 0 0.80939 0.18981 0.500786 0.496704C0.192182 0.803497 0.00126603 1.22748 0.00126603 1.69571V7.66461V13.6335C-0.00939631 14.2606 0.0406965 15.3728 0.407239 16.65C0.773782 17.9273 1.45688 19.3696 2.71221 20.6569C4.13443 22.1153 5.78609 22.8458 7.23667 23.2119C8.68725 23.5779 9.93675 23.5797 10.5549 23.5805C10.5731 23.5805 10.5918 23.5806 10.6109 23.5806C10.63 23.5806 10.6495 23.5806 10.6693 23.5806C11.3691 23.5806 12.5672 23.5634 13.9337 23.2123C15.3002 22.8614 16.8351 22.1765 18.2085 20.8414C19.5511 19.5362 20.2819 18.0587 20.6743 16.7461C21.0667 15.4335 21.1207 14.286 21.1097 13.6409H21.1098ZM17.5895 20.212C16.3064 21.4594 14.8541 22.0814 13.5696 22.3917C12.2851 22.702 11.1683 22.7003 10.5562 22.7002C9.98433 22.6994 8.82827 22.6978 7.49216 22.3653C6.15605 22.0327 4.63998 21.369 3.34793 20.0442C2.20797 18.8752 1.58774 17.5624 1.255 16.3978C0.92225 15.2332 0.876885 14.2168 0.886642 13.6409V1.83865C0.886642 1.574 0.994573 1.3344 1.16899 1.16099C1.34341 0.987574 1.58442 0.880347 1.85058 0.880347H19.4042C19.6306 0.880347 19.8357 0.97158 19.9841 1.11914C20.1325 1.26671 20.2243 1.4705 20.2243 1.69571V7.67205V13.6484C20.2322 14.1101 20.2004 15.1416 19.853 16.3625C19.5058 17.5832 18.8432 18.9932 17.5895 20.212Z" />
        <path d="M18.7136 6.68453H19.1052V2.40551C19.1052 2.1634 18.9339 2.00195 18.7136 2.00195H7.00391V6.68463L18.7136 6.68453Z" />
      </g>
    </svg>
  );
}

/** What sits on an icon's face: a mark on white, or the client's own tile. */
function IconFace({ app }: { app: AppItem }) {
  const { icon } = app;
  if (icon.kind === "tile") {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={icon.src} alt="" draggable={false} className="absolute inset-0 h-full w-full object-cover" />;
  }
  return (
    <span className="absolute inset-0 flex items-center justify-center bg-white">
      {icon.kind === "mark" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={icon.src} alt="" draggable={false} className="h-[56%] w-[56%] object-contain" />
      )}
      {icon.kind === "shield" && <Shield className="h-[58%] w-[58%] text-black" />}
      {icon.kind === "letter" && <span className="font-semibold text-black">{app.name[0]}</span>}
    </span>
  );
}

// --- Pictures, fetched early -----------------------------------------------

const warmed = new Set<string>();
/** Fetch and decode an app's first screens while its icon is hovered, so it opens onto them. */
function warm(app: AppItem, sizes: string) {
  if (warmed.has(app.slug)) return;
  warmed.add(app.slug);
  for (const s of app.screens.slice(0, 2)) {
    const props = getImageProps({ src: s.src, alt: "", sizes: s.shape === "wide" ? sizes : FIT_SIZES, quality: 85, fill: true }).props;
    const img = new window.Image();
    if (props.sizes) img.sizes = props.sizes;
    if (props.srcSet) img.srcset = props.srcSet;
    img.src = props.src;
    img.decode().catch(() => {});
  }
}

// --- The home screen ----------------------------------------------------------

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** An element's box inside `root`, by layout offsets, so a tilt in progress can't skew it. */
function offsetWithin(el: HTMLElement, root: HTMLElement): Rect {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== root) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight };
}

type Opened = { index: number; mode: "device" | "screen"; from: Rect; box: { w: number; h: number } };

export default function HomeScreen({ apps }: { apps: AppItem[] }) {
  const reduce = usePrefersReducedMotion();
  const fine = useMedia("(hover: hover) and (pointer: fine)");
  const screenRef = useRef<HTMLDivElement>(null);
  const icons = useRef<(HTMLElement | null)[]>([]);
  const phoneIcons = useRef<(HTMLElement | null)[]>([]);
  const [opened, setOpened] = useState<Opened | null>(null);
  const [closing, setClosing] = useState(false);
  const [near, setNear] = useState(false);
  const [hot, setHot] = useState<number | null>(null);
  const [screen, setScreen] = useState(0);
  const p = useMotionValue(0);
  const tilt = useMotionValue(0);

  // The tablet lies back until the pointer comes near (or an app is open).
  // Rising, it moves the icons under a still pointer: once it's level, the
  // icon that's now under the pointer is already in its hover state.
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const lying = fine === true && !reduce && !near && !opened;
  useEffect(() => {
    const a = animate(tilt, lying ? 14 : 0, { type: "spring", visualDuration: 0.6, bounce: 0.12 });
    a.then(() => {
      const at = pointer.current;
      if (lying || !at) return;
      const el = document.elementFromPoint(at.x, at.y)?.closest<HTMLElement>("[data-app-icon]");
      setHot(el ? Number(el.dataset.appIcon) : null);
    });
    return () => a.stop();
  }, [lying, tilt]);

  const open = useCallback(
    (index: number) => {
      if (opened) return;
      const phone = window.matchMedia("(max-width: 639px)").matches;
      const icon = (phone ? phoneIcons : icons).current[index];
      const root = screenRef.current;
      if (!icon || (!phone && !root)) return;
      let from: Rect;
      let box: { w: number; h: number };
      if (phone) {
        const r = icon.getBoundingClientRect();
        from = { x: r.left, y: r.top, w: r.width, h: r.height };
        box = { w: window.innerWidth, h: window.innerHeight };
      } else {
        from = offsetWithin(icon, root!);
        box = { w: root!.offsetWidth, h: root!.offsetHeight };
      }
      p.set(0);
      setScreen(0);
      setClosing(false);
      setOpened({ index, mode: phone ? "screen" : "device", from, box });
    },
    [opened, p]
  );

  // Run the launch once the window is in place.
  useEffect(() => {
    if (!opened || closing) return;
    if (reduce) {
      p.set(1);
      return;
    }
    const a = animate(p, 1, MORPH);
    return () => a.stop();
  }, [opened, closing, reduce, p]);

  const close = useCallback(() => {
    if (!opened || closing) return;
    setClosing(true);
    if (reduce) {
      p.set(0);
      setOpened(null);
      return;
    }
    animate(p, 0, LAND).then(() => {
      setOpened(null);
      setClosing(false);
    });
  }, [opened, closing, reduce, p]);

  const app = opened ? apps[opened.index] : null;
  const count = app?.screens.length ?? 0;
  const step = useCallback((d: number) => setScreen((s) => Math.max(0, Math.min(count - 1, s + d))), [count]);

  useEffect(() => {
    if (!opened) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [opened, close, step]);

  const homeScale = useTransform(p, (t) => 1 + 0.07 * Math.max(0, t));
  const homeDim = useTransform(p, (t) => 0.55 * smooth(0, 1, t));
  const glare = useTransform(p, (t) => 1 - smooth(0.2, 0.8, t));

  const hover = (i: number | null) => {
    setHot(i);
    if (i !== null) warm(apps[i], WIDE_SIZES);
  };

  return (
    <div>
      {/* A tablet, from 640px up. */}
      <div
        className="hidden sm:block"
        onPointerEnter={(e) => e.pointerType === "mouse" && setNear(true)}
        onPointerMove={(e) => {
          if (e.pointerType === "mouse") pointer.current = { x: e.clientX, y: e.clientY };
        }}
        onPointerLeave={(e) => {
          if (e.pointerType !== "mouse") return;
          pointer.current = null;
          setNear(false);
        }}
      >
        <div style={{ perspective: 2400 }}>
          <motion.div className="relative" style={{ rotateX: tilt, transformOrigin: "50% 100%", containerType: "inline-size" }}>
            {/* The body: a dark bezel inside a thin metal edge. */}
            <div
              className="relative rounded-[4.1cqw] p-[1.55cqw]"
              style={{
                background: "linear-gradient(150deg, #2A2A2D 0%, #0B0B0C 38%, #121214 70%, #232326 100%)",
                boxShadow:
                  "0 0 0 1px rgba(255,255,255,0.10) inset, 0 0 0 1.5px #8D8D92, 0 0 0 2.5px #2C2C2F, 0 2.6cqw 5.2cqw -1.6cqw rgba(15,15,20,0.42), 0 0.6cqw 1.4cqw -0.6cqw rgba(15,15,20,0.3)",
              }}
            >
              {/* The camera, on the long edge. */}
              <span aria-hidden className="absolute left-1/2 top-[0.6cqw] h-[0.42cqw] w-[0.42cqw] -translate-x-1/2 rounded-full bg-[#1B2430] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]" />
              <div
                ref={screenRef}
                className="relative overflow-hidden rounded-[2.6cqw] bg-black"
                style={{ aspectRatio: `${SCREEN_W} / ${SCREEN_H}`, containerType: "inline-size" }}
              >
                <motion.div className="absolute inset-0" style={{ scale: homeScale }}>
                  <Wallpaper />
                  <div className="absolute inset-0 flex items-center justify-center pb-[3cqw]" style={{ gap: cq(72) }}>
                    {apps.map((a, i) => (
                      <HomeIcon
                        key={a.slug}
                        index={i}
                        app={a}
                        size={cq(104)}
                        label={cq(14.5)}
                        hot={hot === i}
                        iconRef={(el) => {
                          icons.current[i] = el;
                        }}
                        onOpen={() => open(i)}
                        onHover={(on) => hover(on ? i : null)}
                      />
                    ))}
                  </div>
                </motion.div>
                <motion.div aria-hidden className="pointer-events-none absolute inset-0 bg-black" style={{ opacity: homeDim }} />
                {opened?.mode === "device" && app && (
                  <AppWindow
                    app={app}
                    opened={opened}
                    p={p}
                    closing={closing}
                    reduce={reduce}
                    screen={screen}
                    onScreen={setScreen}
                    onClose={close}
                  />
                )}
                <StatusBar />
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{ opacity: glare, background: "linear-gradient(118deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 32%, rgba(255,255,255,0) 52%)" }}
                />
              </div>
            </div>
          </motion.div>
        </div>
        <Caption apps={apps} app={closing ? null : app} screen={screen} hot={hot} onHot={hover} onOpen={open} />
      </div>

      {/* A phone: the screen is the phone's own. */}
      <div className="sm:hidden">
        <div className="relative overflow-hidden rounded-[30px] px-4 pb-6 pt-7 shadow-[0_18px_40px_-20px_rgba(15,15,30,0.5)]">
          <Wallpaper />
          <div className="relative grid grid-cols-4 gap-x-3 gap-y-5">
            {apps.map((a, i) => (
              <div key={a.slug} className="flex justify-center">
                <HomeIcon
                  index={i}
                  app={a}
                  size="62px"
                  label="11.5px"
                  hot={false}
                  iconRef={(el) => {
                    phoneIcons.current[i] = el;
                  }}
                  onOpen={() => open(i)}
                  onHover={() => {}}
                />
              </div>
            ))}
          </div>
        </div>
        <AppList apps={apps} hot={null} onHot={() => {}} onOpen={open} className="mt-4" />
        {opened?.mode === "screen" && app && (
          <PhoneApp app={app} opened={opened} p={p} closing={closing} reduce={reduce} screen={screen} onScreen={setScreen} onClose={close} />
        )}
      </div>
    </div>
  );
}

/** Blueprint paper: a deep blue with a fine drafting grid, lit from the top left. */
function Wallpaper() {
  return (
    <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(155deg, #1C4FB8 0%, #123A8E 45%, #0B2564 100%)" }}>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.11) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.11) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "120px 120px, 120px 120px, 24px 24px, 24px 24px",
          backgroundPosition: "-1px -1px",
        }}
      />
      <div className="absolute inset-0" style={{ background: "radial-gradient(70% 90% at 18% 10%, rgba(255,255,255,0.16), rgba(255,255,255,0) 60%), radial-gradient(60% 80% at 90% 100%, rgba(5,15,50,0.55), rgba(5,15,50,0) 70%)" }} />
    </div>
  );
}

function HomeIcon({
  index,
  app,
  size,
  label,
  hot,
  iconRef,
  onOpen,
  onHover,
}: {
  index: number;
  app: AppItem;
  size: string;
  label: string;
  hot: boolean;
  iconRef: (el: HTMLElement | null) => void;
  onOpen: () => void;
  onHover: (on: boolean) => void;
}) {
  return (
    <motion.button
      type="button"
      aria-label={`Open ${app.name}: ${app.title}`}
      data-app-icon={index}
      onClick={onOpen}
      onPointerEnter={(e) => e.pointerType === "mouse" && onHover(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && onHover(false)}
      onFocus={() => onHover(true)}
      onBlur={() => onHover(false)}
      whileTap={{ scale: 0.97 }}
      className="group/icon flex cursor-pointer flex-col items-center rounded-[18%] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
      style={{ width: size }}
    >
      <span
        ref={iconRef}
        className={`relative block aspect-square w-full overflow-hidden shadow-[0_6px_16px_-6px_rgba(0,0,0,0.55),0_0_0_0.5px_rgba(0,0,0,0.12)] transition-transform duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover/icon:-translate-y-[4%] group-hover/icon:scale-[1.05] ${
          hot ? "-translate-y-[4%] scale-[1.05]" : ""
        }`}
        style={{ borderRadius: `${ICON_RADIUS * 100}%` }}
      >
        <IconFace app={app} />
      </span>
      <span className="mt-[0.55em] max-w-[140%] truncate font-medium leading-tight text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.45)]" style={{ fontSize: label }}>
        {app.name}
      </span>
    </motion.button>
  );
}

function StatusBar() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between text-white" style={{ height: cq(BAR), paddingInline: cq(22), fontSize: cq(12.5) }}>
      <span className="font-semibold tabular-nums tracking-[-0.01em]">9:41</span>
      <span className="flex items-center" style={{ gap: cq(6) }}>
        <svg viewBox="0 0 17 12" style={{ width: cq(16), height: cq(11) }} fill="currentColor">
          <path d="M8.5 2.6c2.3 0 4.4.9 6 2.4l1.2-1.2C13.8 1.9 11.3.9 8.5.9S3.2 1.9 1.3 3.8L2.5 5c1.6-1.5 3.7-2.4 6-2.4Zm0 3.4c1.4 0 2.6.5 3.6 1.4l1.2-1.2A6.9 6.9 0 0 0 8.5 4.3c-1.9 0-3.6.7-4.8 1.9l1.2 1.2c1-.9 2.2-1.4 3.6-1.4Zm0 3.3c-.6 0-1.1.2-1.5.6L8.5 11.4 10 9.9c-.4-.4-.9-.6-1.5-.6Z" />
        </svg>
        <svg viewBox="0 0 27 12" style={{ width: cq(25), height: cq(11.5) }}>
          <rect x="0.5" y="0.5" width="22" height="11" rx="3.2" fill="none" stroke="currentColor" strokeOpacity="0.45" />
          <rect x="2" y="2" width="19" height="8" rx="2" fill="currentColor" />
          <path d="M24 4.2v3.6c.7-.3 1.2-1 1.2-1.8s-.5-1.5-1.2-1.8Z" fill="currentColor" fillOpacity="0.5" />
        </svg>
      </span>
    </div>
  );
}

// --- The app, opening ---------------------------------------------------------

/**
 * The launch: the window is clipped to the icon and grows to the whole screen
 * while its contents scale up from the icon's size, a launch face (the icon's
 * own) giving way to the first screen. Closing runs it back.
 */
function useLaunch(opened: Opened, p: MotionValue<number>) {
  const { from, box } = opened;
  const r0 = from.w * ICON_RADIUS;
  const clipPath = useTransform(p, (t) => {
    const k = (v: number) => `${Math.max(0, v).toFixed(2)}px`;
    const top = lerp(from.y, 0, t);
    const left = lerp(from.x, 0, t);
    const right = lerp(box.w - from.x - from.w, 0, t);
    const bottom = lerp(box.h - from.y - from.h, 0, t);
    return `inset(${k(top)} ${k(right)} ${k(bottom)} ${k(left)} round ${Math.max(0, lerp(r0, 0, Math.min(1, t))).toFixed(2)}px)`;
  });
  const content = useTransform(p, (t) => {
    const s = lerp(from.w / box.w, 1, t);
    const cx = lerp(from.x + from.w / 2, box.w / 2, t) - box.w / 2;
    const cy = lerp(from.y + from.h / 2, box.h / 2, t) - box.h / 2;
    return `translate(${cx.toFixed(2)}px, ${cy.toFixed(2)}px) scale(${s.toFixed(4)})`;
  });
  const contentOpacity = useTransform(p, (t) => smooth(0.3, 0.78, t));
  const faceOpacity = useTransform(p, (t) => 1 - smooth(0.4, 0.82, t));
  const markOpacity = useTransform(p, (t) => 1 - smooth(0.12, 0.5, t));
  // The icon's face keeps the icon's own proportions, centred on the growing window.
  const face = useTransform(p, (t) => {
    const w = lerp(from.w, Math.min(box.w, box.h) * 0.36, t);
    const cx = lerp(from.x + from.w / 2, box.w / 2, t);
    const cy = lerp(from.y + from.h / 2, box.h / 2, t);
    return `translate(${(cx - w / 2).toFixed(2)}px, ${(cy - w / 2).toFixed(2)}px)`;
  });
  const faceSize = useTransform(p, (t) => lerp(from.w, Math.min(box.w, box.h) * 0.36, t));
  return { clipPath, content, contentOpacity, faceOpacity, markOpacity, face, faceSize };
}

/** The face an app launches with: the icon's ground filling the window, its mark fading off. */
function LaunchFace({ app, launch }: { app: AppItem; launch: ReturnType<typeof useLaunch> }) {
  const tile = app.icon.kind === "tile";
  return (
    <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ opacity: launch.faceOpacity, background: tile ? APP_BG : "#FFFFFF" }}>
      <motion.div className="absolute left-0 top-0" style={{ transform: launch.face, width: launch.faceSize, height: launch.faceSize, opacity: launch.markOpacity }}>
        <span className="absolute inset-0 overflow-hidden" style={{ borderRadius: `${ICON_RADIUS * 100}%` }}>
          <IconFace app={app} />
        </span>
      </motion.div>
    </motion.div>
  );
}

/** The app inside the tablet. */
function AppWindow({
  app,
  opened,
  p,
  closing,
  reduce,
  screen,
  onScreen,
  onClose,
}: {
  app: AppItem;
  opened: Opened;
  p: MotionValue<number>;
  closing: boolean;
  reduce: boolean;
  screen: number;
  onScreen: (i: number) => void;
  onClose: () => void;
}) {
  const launch = useLaunch(opened, p);
  const [landed, setLanded] = useState(reduce);
  useEffect(() => p.on("change", (t) => setLanded(t > 0.985 && !closing)), [p, closing]);
  useEffect(() => setLanded(p.get() > 0.985 && !closing), [p, closing]);

  return (
    <motion.section
      aria-label={`${app.name}: ${app.title}`}
      className="absolute inset-0 z-20 overflow-hidden"
      style={{ clipPath: launch.clipPath, background: APP_BG }}
    >
      <motion.div className="absolute inset-0 origin-center" style={{ transform: launch.content, opacity: launch.contentOpacity }}>
        <div className="absolute inset-x-0 top-0" style={{ height: cq(BAR), background: APP_BG }} />
        <div className="absolute inset-x-0 bottom-0" style={{ top: cq(BAR) }}>
          <Pager app={app} screen={screen} onScreen={onScreen} live={landed} reduce={reduce} fit={false} />
          <PagerChrome app={app} screen={screen} onScreen={onScreen} />
        </div>
      </motion.div>
      <LaunchFace app={app} launch={launch} />
      <HomeBar p={p} height={opened.box.h} onClose={onClose} live={landed} />
    </motion.section>
  );
}

/** The app on a phone: the whole screen, with its name and story under its screens. */
function PhoneApp({
  app,
  opened,
  p,
  closing,
  reduce,
  screen,
  onScreen,
  onClose,
}: {
  app: AppItem;
  opened: Opened;
  p: MotionValue<number>;
  closing: boolean;
  reduce: boolean;
  screen: number;
  onScreen: (i: number) => void;
  onClose: () => void;
}) {
  const launch = useLaunch(opened, p);
  const [landed, setLanded] = useState(reduce);
  useEffect(() => p.on("change", (t) => setLanded(t > 0.985 && !closing)), [p, closing]);
  useEffect(() => setLanded(p.get() > 0.985 && !closing), [p, closing]);
  useScrollLock(true);

  return createPortal(
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`${app.name}: ${app.title}`}
      className="fixed inset-0 z-[100] overflow-hidden text-white"
      style={{ clipPath: launch.clipPath, background: APP_BG }}
      data-lenis-prevent
    >
      <motion.div className="absolute inset-0 flex origin-center flex-col" style={{ transform: launch.content, opacity: launch.contentOpacity }}>
        <header className="flex shrink-0 items-center gap-3 px-4 pb-3 pt-[max(env(safe-area-inset-top),16px)]">
          <span className="relative block h-9 w-9 shrink-0 overflow-hidden" style={{ borderRadius: `${ICON_RADIUS * 100}%` }}>
            <IconFace app={app} />
          </span>
          <div className="min-w-0">
            <p className="truncate text-[15px] font-medium leading-tight">{app.name}</p>
            <p className="truncate text-[13px] leading-tight text-white/55">
              {app.title} <span className="text-white/30">·</span> <span className="tabular-nums">{app.year}</span>
            </p>
          </div>
          <motion.button
            type="button"
            aria-label="Close"
            onClick={onClose}
            whileTap={{ scale: 0.97 }}
            className="ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white"
          >
            <X className="h-4 w-4" />
          </motion.button>
        </header>
        <div className="relative min-h-0 flex-1">
          <Pager app={app} screen={screen} onScreen={onScreen} live={landed} reduce={reduce} fit />
        </div>
        <div className="shrink-0 px-5 pb-[calc(max(env(safe-area-inset-bottom),12px)+28px)] pt-4">
          <Dots count={app.screens.length} screen={screen} onScreen={onScreen} />
          <p className="mt-3 line-clamp-2 min-h-[2.9em] text-center text-[13px] leading-[1.45] text-white/60">{app.screens[screen]?.alt}</p>
          {app.summary && <p className="mt-3 text-pretty text-[14px] leading-[1.5] text-white/80">{app.summary}</p>}
          <Links links={app.links} dark className="mt-4" />
        </div>
      </motion.div>
      <LaunchFace app={app} launch={launch} />
      <HomeBar p={p} height={opened.box.h} onClose={onClose} live={landed} />
    </motion.div>,
    document.body
  );
}

/**
 * The home bar. Tap it to close; drag it up and the app shrinks with your
 * finger, closing past a short throw and springing back short of one.
 */
function HomeBar({ p, height, onClose, live }: { p: MotionValue<number>; height: number; onClose: () => void; live: boolean }) {
  const drag = useRef<{ y: number; id: number; moved: boolean; t: number } | null>(null);
  return (
    <button
      type="button"
      aria-label="Close app"
      className="absolute bottom-0 left-1/2 z-40 flex h-[34px] w-[min(46%,260px)] -translate-x-1/2 cursor-pointer touch-none items-end justify-center pb-[9px] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
      onPointerDown={(e) => {
        if (!live) return;
        drag.current = { y: e.clientY, id: e.pointerId, moved: false, t: performance.now() };
        e.currentTarget.setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        const d = drag.current;
        if (!d || d.id !== e.pointerId) return;
        const dy = d.y - e.clientY;
        if (!d.moved && Math.abs(dy) < 6) return;
        d.moved = true;
        p.set(1 - Math.min(0.85, Math.max(0, dy) / (height * 0.9)));
      }}
      onPointerUp={(e) => {
        const d = drag.current;
        drag.current = null;
        if (!d) return;
        if (!d.moved) return onClose();
        const dy = d.y - e.clientY;
        const speed = dy / Math.max(1, performance.now() - d.t);
        if (dy > 70 || speed > 0.6) onClose();
        else animate(p, 1, NUDGE);
      }}
      onPointerCancel={() => {
        if (drag.current?.moved) animate(p, 1, NUDGE);
        drag.current = null;
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClose();
        }
      }}
    >
      <span className="block h-[5px] w-[42%] min-w-[96px] rounded-full bg-white/85 shadow-[0_0_0_0.5px_rgba(0,0,0,0.25),0_1px_4px_rgba(0,0,0,0.35)]" />
    </button>
  );
}

// --- Screens ------------------------------------------------------------------

/** The app's screens side by side; drag or step between them. */
function Pager({
  app,
  screen,
  onScreen,
  live,
  reduce,
  fit,
}: {
  app: AppItem;
  screen: number;
  onScreen: (i: number) => void;
  live: boolean;
  reduce: boolean;
  /** Fit every screen whole (a phone); otherwise a 16:9 frame fills the tablet edge to edge. */
  fit: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [area, setArea] = useState({ w: 0, h: 0 });
  const width = area.w;
  const x = useMotionValue(0);
  const n = app.screens.length;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setArea({ w: entry.contentRect.width, h: entry.contentRect.height }));
    ro.observe(el);
    setArea({ w: el.offsetWidth, h: el.offsetHeight });
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!width) return;
    if (reduce) {
      x.set(-screen * width);
      return;
    }
    const a = animate(x, -screen * width, NUDGE);
    return () => a.stop();
  }, [screen, width, reduce, x]);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-y-0 left-0 flex"
        style={{ x, width: width * n || undefined, touchAction: "pan-y" }}
        drag={live && n > 1 ? "x" : false}
        dragConstraints={{ left: -(n - 1) * width, right: 0 }}
        dragElastic={0.14}
        dragMomentum={false}
        onDragEnd={(_, info) => {
          const flick = Math.abs(info.velocity.x) > 450;
          const far = Math.abs(info.offset.x) > width * 0.2;
          const dir = flick || far ? (info.offset.x < 0 ? 1 : -1) : 0;
          const next = Math.max(0, Math.min(n - 1, screen + dir));
          if (next === screen) animate(x, -screen * width, NUDGE);
          else onScreen(next);
        }}
      >
        {app.screens.map((s, i) => (
          <div key={s.src} className="relative h-full shrink-0 overflow-hidden" style={{ width: width || "100%" }}>
            {Math.abs(i - screen) <= 1 && <Slide screen={s} fit={fit} area={area} playing={live && i === screen} reduce={reduce} eager={i === 0} />}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/** Each shape's proportions, for fitting it whole. */
const ASPECT: Record<AppScreen["shape"], number> = { wide: 16 / 9, tall: 2 / 3, square: 1 };

function Slide({
  screen,
  fit,
  area,
  playing,
  reduce,
  eager,
}: {
  screen: AppScreen;
  fit: boolean;
  area: { w: number; h: number };
  playing: boolean;
  reduce: boolean;
  eager: boolean;
}) {
  const [asked, setAsked] = useState(false);
  const clip = screen.clip && (
    <>
      {playing && (!reduce || asked) && <Clip clip={screen.clip} />}
      {reduce && !asked && <PlayButton onPlay={() => setAsked(true)} />}
    </>
  );
  if (screen.shape === "wide" && !fit) {
    return (
      <>
        <Image src={screen.src} alt={screen.alt} fill sizes={WIDE_SIZES} quality={85} priority={eager} className="object-cover" draggable={false} />
        {clip}
      </>
    );
  }
  // Fitted whole, inside a margin, over a soft blurred copy of itself.
  const aspect = ASPECT[screen.shape];
  const room = { w: area.w * 0.92, h: area.h * 0.92 };
  const box = room.w / room.h > aspect ? { w: room.h * aspect, h: room.h } : { w: room.w, h: room.w / aspect };
  return (
    <>
      <Image src={screen.src} alt="" fill sizes="96px" quality={40} className="scale-125 object-cover opacity-60 blur-2xl" draggable={false} />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative overflow-hidden rounded-[10px] bg-[#EDEDEC] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.6)]" style={{ width: box.w || "80%", height: box.h || "80%" }}>
          <Image src={screen.src} alt={screen.alt} fill sizes={FIT_SIZES} quality={85} priority={eager} className="object-cover" draggable={false} />
          {clip}
        </div>
      </div>
    </>
  );
}

function PlayButton({ onPlay }: { onPlay: () => void }) {
  return (
    <button
      type="button"
      aria-label="Play video"
      onClick={onPlay}
      className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-md"
    >
      <Play className="h-3 w-3 translate-x-px" fill="currentColor" />
    </button>
  );
}

/** A kit clip, looping just its stretch, faded in once it plays. Loads only when its screen is up. */
function Clip({ clip }: { clip: NonNullable<AppScreen["clip"]> }) {
  const [shown, setShown] = useState(false);
  const range = clip.range;
  return (
    <video
      src={clip.src}
      muted
      loop
      playsInline
      autoPlay
      preload="auto"
      aria-hidden="true"
      onLoadedMetadata={(e) => {
        const start = clip.start ?? range?.[0];
        if (start) e.currentTarget.currentTime = start;
      }}
      onTimeUpdate={(e) => {
        const t = e.currentTarget.currentTime;
        if (range && (t < range[0] - 0.25 || t >= range[1])) e.currentTarget.currentTime = range[0];
      }}
      onPlaying={() => setShown(true)}
      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out ${shown ? "opacity-100" : "opacity-0"}`}
    />
  );
}

/** Arrows over the tablet's screens. (Where you are reads under the tablet, so nothing else sits on the work.) */
function PagerChrome({ app, screen, onScreen }: { app: AppItem; screen: number; onScreen: (i: number) => void }) {
  const n = app.screens.length;
  const arrow = "absolute top-1/2 z-10 flex -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-md transition-[opacity,background-color] duration-200 hover:bg-black/55 disabled:pointer-events-none disabled:opacity-0";
  const size: CSSProperties = { width: cq(40), height: cq(40) };
  return (
    <>
      <motion.button type="button" aria-label="Previous screen" disabled={screen === 0} onClick={() => onScreen(screen - 1)} whileTap={{ scale: 0.97 }} className={arrow} style={{ ...size, left: cq(18) }}>
        <ArrowLeft style={{ width: cq(17), height: cq(17) }} />
      </motion.button>
      <motion.button type="button" aria-label="Next screen" disabled={screen === n - 1} onClick={() => onScreen(screen + 1)} whileTap={{ scale: 0.97 }} className={arrow} style={{ ...size, right: cq(18) }}>
        <ArrowRight style={{ width: cq(17), height: cq(17) }} />
      </motion.button>
    </>
  );
}

function Dots({ count, screen, onScreen, size = "7px", gap = "8px" }: { count: number; screen: number; onScreen: (i: number) => void; size?: string; gap?: string }) {
  return (
    <div className="flex items-center justify-center" style={{ gap }}>
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`Screen ${i + 1} of ${count}`}
          aria-current={i === screen}
          onClick={() => onScreen(i)}
          className={`rounded-full transition-[background-color,transform] duration-300 ${i === screen ? "bg-white" : "bg-white/40 hover:bg-white/70"}`}
          style={{ width: size, height: size }}
        />
      ))}
    </div>
  );
}

// --- Under the tablet ---------------------------------------------------------

function Links({ links, dark = false, className = "" }: { links: ShowcaseLink[]; dark?: boolean; className?: string }) {
  if (links.length === 0) return null;
  const quiet = dark ? "bg-white/10 text-white hover:bg-white/15" : "bg-black/[0.05] text-black hover:bg-black/[0.09]";
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {links.map((link) =>
        link.external ? (
          <a key={link.href} href={link.href} target="_blank" rel="noopener" className="inline-flex h-9 items-center gap-1.5 rounded-full bg-neutral-900 px-4 text-sm font-medium text-white transition-colors duration-200 hover:bg-black">
            {link.label}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        ) : (
          <Link key={link.href} href={link.href} className={`group/link inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-sm font-medium transition-colors duration-200 ${quiet}`}>
            {link.label}
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover/link:translate-x-0.5" />
          </Link>
        )
      )}
    </div>
  );
}

/** The four apps as a list: a second way in, and their names level and readable. */
function AppList({
  apps,
  hot,
  onHot,
  onOpen,
  className = "",
}: {
  apps: AppItem[];
  hot: number | null;
  onHot: (i: number | null) => void;
  onOpen: (i: number) => void;
  className?: string;
}) {
  return (
    <ul className={`grid gap-1 sm:grid-cols-2 lg:grid-cols-4 lg:gap-3 ${className}`}>
      {apps.map((a, i) => (
        <li key={a.slug}>
          <button
            type="button"
            onClick={() => onOpen(i)}
            onPointerEnter={(e) => e.pointerType === "mouse" && onHot(i)}
            onPointerLeave={(e) => e.pointerType === "mouse" && onHot(null)}
            className={`flex w-full items-start gap-3 rounded-[14px] px-2 py-2 text-left transition-colors duration-200 hover:bg-black/[0.04] ${hot === i ? "bg-black/[0.04]" : ""}`}
          >
            <span className="relative block h-10 w-10 shrink-0 overflow-hidden shadow-[0_0_0_0.5px_rgba(0,0,0,0.12),0_2px_6px_-2px_rgba(0,0,0,0.25)]" style={{ borderRadius: `${ICON_RADIUS * 100}%` }}>
              <IconFace app={a} />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[15px] font-medium leading-tight text-black">{a.name}</span>
              <span className="mt-0.5 block text-pretty text-[13px] leading-[1.3] text-neutral-500">{a.title}</span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}

/** Under the tablet: the list of apps, or the open one's name, story and links. */
function Caption({
  apps,
  app,
  screen,
  hot,
  onHot,
  onOpen,
}: {
  apps: AppItem[];
  app: AppItem | null;
  screen: number;
  hot: number | null;
  onHot: (i: number | null) => void;
  onOpen: (i: number) => void;
}) {
  return (
    // Room for the tallest of these, so opening an app never moves the page below.
    <div className="relative mt-6 min-h-[280px] lg:mt-8 lg:min-h-[180px]">
      <AnimatePresence initial={false} mode="popLayout">
        {app ? (
          <motion.div
            key={app.slug}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4, transition: { duration: 0.14 } }}
            transition={NUDGE}
            className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:gap-10"
          >
            <div>
              <h2 className="text-[24px] font-medium leading-[1.1] tracking-[-0.03em] text-black lg:text-[30px]">{app.name}</h2>
              <p className="mt-2 text-[15px] text-neutral-500 lg:text-base">
                {app.title} <span className="mx-1 text-neutral-300">·</span> <span className="tabular-nums">{app.year}</span>
              </p>
            </div>
            <div>
              {app.summary && <p className="max-w-[60ch] text-pretty text-sm leading-[1.5] text-neutral-500">{app.summary}</p>}
              <p className="mt-3 text-[13px] text-neutral-400">
                <span className="tabular-nums">
                  {screen + 1} / {app.screens.length}
                </span>
                <span className="mx-1.5 text-neutral-300">·</span>
                {app.screens[screen]?.alt}
              </p>
              <Links links={app.links} className="mt-4" />
            </div>
          </motion.div>
        ) : (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.12 } }} transition={NUDGE}>
            <AppList apps={apps} hot={hot} onHot={onHot} onOpen={onOpen} className="-mx-2" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

