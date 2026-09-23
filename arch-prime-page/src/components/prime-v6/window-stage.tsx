"use client";

// The page's two moments, one mechanism. A pinned frame holds a full-bleed photograph and the
// account's window (shape.ts) as a mask over it:
//   close — the hero. Looking up; the promise and the button are readable at once. After a hold
//           the copy steps back and the photograph closes into the window.
//   open  — the view. The same window, now holding the view from the upper floor, opens back out
//           to full bleed and the closing line lands. The mirror of the hero.
// Pinning is CSS (prime-v6.css, .v6-stage): the server and the client lay the page out the same,
// so nothing below moves at hydration and deep links land where they point. JS only gates the
// mask and the transforms, and writes a handful of custom properties once per frame. Where the
// pin query fails — phones, short windows, reduced motion — the full-bleed state shows and the
// copy scrolls normally.

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { GLYPH } from "@/components/prime-marks";
import { OUTER_EDGE } from "@/components/prime-arch";
import { EARLY_HREF } from "@/data/prime-v6";
import { MASK, RATIO, clamp01, easeInOut, smooth, useShape, type Shape } from "./shape";

type Photo = { src: string; mobileSrc?: string; position?: string };

// Kept identical to the .v6-stage rule in prime-v6.css.
export const PIN_QUERY = "(min-width: 768px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)";

// The window's resting size: the same in both moments, so it reads as one object.
export function windowWidth(shape: Shape, vw: number) {
  return shape === "arch" ? Math.min(520, vw * 0.4) : Math.min(380, vw * 0.3);
}

function fullWidth(shape: Shape, vw: number, vh: number) {
  // The size at which the window's shape covers the whole viewport, centred. For the arch, the
  // narrow apex has to clear the top corners: height ≥ 1.418·vw + vh, plus margin.
  if (shape === "circle") return Math.hypot(vw, vh) * 1.04;
  return (1.15 * (1.418 * vw + vh)) / RATIO.arch;
}

// Is a viewport point inside the window's real silhouette (not its bounding box)?
const ARCH_BOX = { w: 1177.77, h: 835.173 };
let archHit: ((sx: number, sy: number) => boolean) | null = null;
function insideWindow(shape: Shape, x: number, y: number, mx: number, my: number, w: number, h: number) {
  if (shape === "circle") return Math.hypot(x - (mx + w / 2), y - (my + h / 2)) <= w / 2;
  if (!archHit) {
    const ctx = document.createElement("canvas").getContext("2d");
    const path = new Path2D(`${OUTER_EDGE}Z`);
    archHit = (sx, sy) => ctx?.isPointInPath(path, sx, sy) ?? false;
  }
  return archHit(((x - mx) / w) * ARCH_BOX.w, ((y - my) / h) * ARCH_BOX.h);
}

// Where the nav's content sits along its line: the logo, the links, the button.
function navProbes(vw: number): number[] {
  const mid = (el: Element | null | undefined) => {
    const r = el?.getBoundingClientRect();
    return r && r.width > 0 ? r.left + r.width / 2 : null;
  };
  const logo = mid(document.querySelector('nav a[aria-label="Arch Network home"]'));
  const cta = mid([...document.querySelectorAll("nav a")].find((a) => a.getAttribute("href") === EARLY_HREF));
  return [logo ?? vw * 0.08, vw / 2 - 90, vw / 2, vw / 2 + 90, cta ?? vw * 0.9];
}

export function WindowStage({
  id,
  mode,
  shape: forced,
  photo,
  track = "240svh",
  photoScale = 1,
  caption,
  children,
}: {
  id: string;
  mode: "close" | "open";
  /** force the window's shape; without it the review toggle decides */
  shape?: Shape;
  photo: Photo;
  /** height of the pinned track, as a CSS length: the scroll distance the moment takes */
  track?: string;
  /** the photograph's scale once it sits in the window (it shrinks toward its top edge) */
  photoScale?: number;
  caption?: ReactNode;
  children: ReactNode;
}) {
  const root = useRef<HTMLElement>(null);
  const [pinned, setPinned] = useState(false);
  const picked = useShape();
  const shape = forced ?? picked;

  useEffect(() => {
    const mq = window.matchMedia(PIN_QUERY);
    const apply = () => setPinned(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const set = (k: string, v: number | string) => el.style.setProperty(k, typeof v === "number" ? v.toFixed(3) : v);

    if (!pinned) {
      set("--copy", 1);
      set("--cap", 0);
      set("--glyph", 0);
      el.dataset.live = "1";
      el.dataset.navTheme = "dark";
      delete el.dataset.navGlass;
      return;
    }

    let raf = 0;
    const draw = () => {
      raf = 0;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const r = el.getBoundingClientRect();
      const travel = r.height - vh;
      const p = travel > 0 ? clamp01(-r.top / travel) : 0;

      // t: 0 = full bleed, 1 = at rest in the window
      let t: number, copy: number, cap: number;
      if (mode === "close") {
        copy = 1 - smooth((p - 0.1) / 0.18);
        t = easeInOut((p - 0.16) / 0.6);
        cap = smooth((p - 0.74) / 0.16);
      } else {
        t = 1 - easeInOut((p - 0.05) / 0.5);
        cap = 1 - smooth((p - 0.02) / 0.1);
        copy = smooth((p - 0.5) / 0.2);
      }

      const endW = windowWidth(shape, vw);
      const startW = fullWidth(shape, vw, vh);
      const w = Math.exp(Math.log(startW) + (Math.log(endW) - Math.log(startW)) * t);
      const h = w * RATIO[shape];
      const cy = vh / 2 + (vh * 0.42 - vh / 2) * t;
      const mx = vw / 2 - w / 2;
      const my = cy - h / 2;
      set("--mw", `${w}px`);
      set("--mh", `${h}px`);
      set("--mx", `${mx}px`);
      set("--my", `${my}px`);
      // The photograph shrinks toward its top edge as the window closes, so what sits low in the
      // frame (the hero's building top) rises into the window — but never below the scale at
      // which it still covers every visible part of the window, so no ground shows through.
      const visHalfW = Math.max(vw / 2 - Math.max(0, mx), Math.min(vw, mx + w) - vw / 2);
      const cover = Math.max((2 * visHalfW) / vw, Math.min(vh, my + h) / vh);
      set("--ps", Math.max(cover, 1 + (photoScale - 1) * t));
      set("--capy", `${cy + h / 2 + 36}px`);
      // the circle carries the glyph on top, as sketched; the arch is the glyph
      const gw = endW * 0.46;
      set("--gw", `${gw}px`);
      set("--gx", `${vw / 2 - gw / 2}px`);
      set("--gy", `${cy - (gw * (393 / 544)) / 2}px`);
      set("--glyph", smooth((t - 0.75) / 0.25));
      set("--copy", copy);
      set("--cap", cap);
      el.dataset.live = copy > 0.5 ? "1" : "0";

      // The nav reads light only while the photograph is under all of its content; while the
      // window's edge crosses the nav's line, the nav takes a light glass so it reads either way.
      const inside = navProbes(vw).map((x) => insideWindow(shape, x, 40, mx, my, w, h));
      const dark = inside.every(Boolean);
      const glass = !dark && inside.some(Boolean);
      const changed = dark !== (el.dataset.navTheme === "dark") || glass !== (el.dataset.navGlass === "1");
      if (dark) el.dataset.navTheme = "dark";
      else delete el.dataset.navTheme;
      if (glass) el.dataset.navGlass = "1";
      else delete el.dataset.navGlass;
      // the nav re-reads these only on scroll
      if (changed) window.dispatchEvent(new Event("scroll"));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };
    draw();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pinned, mode, shape, photoScale]);

  // Keyboard focus landing on faded copy (Tab from the FAQ into the view, Shift+Tab back into the
  // hero) jumps to where that copy is fully shown, so the focus ring is never invisible.
  const onFocus = () => {
    const el = root.current;
    if (!el || !pinned || parseFloat(el.style.getPropertyValue("--copy") || "1") > 0.99) return;
    const y = mode === "close" ? el.offsetTop : el.offsetTop + el.offsetHeight - window.innerHeight;
    const lenis = (window as Window & { __lenis?: { scrollTo: (y: number, o: object) => void } }).__lenis;
    if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
    else window.scrollTo(0, y);
  };

  const masked: CSSProperties = pinned
    ? {
        maskImage: MASK[shape],
        WebkitMaskImage: MASK[shape],
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskSize: "var(--mw) var(--mh)",
        WebkitMaskSize: "var(--mw) var(--mh)",
        maskPosition: "var(--mx) var(--my)",
        WebkitMaskPosition: "var(--mx) var(--my)",
      }
    : {};

  return (
    <section
      ref={root}
      id={id}
      data-nav-theme="dark"
      data-live="1"
      className="v6-stage group relative bg-[var(--p-subtle)]"
      style={{ "--track": track } as CSSProperties}
    >
      <div className="v6-frame relative min-h-svh overflow-hidden">
        <div aria-hidden className="absolute inset-0 bg-[#0d2249]" style={masked}>
          <div className="absolute inset-0 will-change-transform" style={{ transform: pinned ? "scale(var(--ps))" : undefined, transformOrigin: "50% 0%" }}>
            <picture>
              {photo.mobileSrc && <source media="(max-width: 599px)" srcSet={photo.mobileSrc} />}
              {/* a plain img: a masked, scroll-driven layer, where next/image's wrapper fights the transform */}
              <img
                src={photo.src}
                alt=""
                loading={mode === "close" ? "eager" : "lazy"}
                fetchPriority={mode === "close" ? "high" : "auto"}
                className="absolute inset-0 h-full w-full object-cover"
                style={{ objectPosition: photo.position ?? "50% 50%" }}
              />
            </picture>
          </div>
          {/* legibility for the copy; leaves with it */}
          <div
            className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(9,24,50,0.55),rgba(9,24,50,0.25)_45%,rgba(9,24,50,0.7))]"
            style={{ opacity: "var(--copy)" }}
          />
        </div>

        {shape === "circle" && pinned && (
          <svg
            aria-hidden
            viewBox="0 0 544 393"
            className="pointer-events-none absolute top-0 left-0"
            style={{ width: "var(--gw)", transform: "translate(var(--gx), var(--gy))", opacity: "var(--glyph)" }}
          >
            <path d={GLYPH} fill="#eef0f0" />
          </svg>
        )}

        <div
          onFocus={onFocus}
          className="relative z-[2] flex min-h-svh flex-col group-data-[live=0]:pointer-events-none"
          style={{ opacity: "var(--copy)", transform: pinned ? "translateY(calc((1 - var(--copy)) * -24px))" : undefined }}
        >
          {children}
        </div>

        {caption && pinned && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 z-[2] text-center"
            style={{ transform: "translateY(var(--capy))", opacity: "var(--cap)" }}
          >
            {caption}
          </div>
        )}
      </div>
    </section>
  );
}
