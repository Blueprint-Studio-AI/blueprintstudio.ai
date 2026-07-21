"use client";

// Hero (Figma 305:1245) — full-bleed brand banner.
//
// The art is a 16:9 source rendered 11% taller than the frame and nudged up, so
// it crops from below centre — that's the Figma's framing, not a plain cover.
// The dark gradient across the top belongs to the hero, not the nav: it's what
// carries the nav's white text while the nav has no surface of its own up here.
//
// The hero is pinned (sticky) while the rest of the page scrolls over it as an
// opaque sheet — see BrandKitPage. Sticky is the strongest parallax there is:
// the background moves 0 while the foreground moves 1, and it costs no JS.
import { useEffect, useRef } from "react";
import { useBrand } from "@/components/brands/kit/BrandContext";

const DARK_SCRIM =
  "linear-gradient(to bottom, rgba(0,0,0,0.82) 0%, rgba(23,23,23,0.63) 15.129%, rgba(102,102,102,0) 50%)";

export default function Hero() {
  const { hero, name, brandInk } = useBrand();
  // `overlay` defaults to the dark scrim; pass null for a light hero.
  const overlay = hero.overlay === undefined ? DARK_SCRIM : hero.overlay;
  const section = useRef<HTMLElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  // Recede the lockup as the sheet closes over it. Without this the two planes
  // read as one — the lockup sits flat against the incoming edge and the whole
  // thing looks like the hero is simply scrolling away. Fading and lifting it
  // puts the hero *behind* the page rather than above it.
  useEffect(() => {
    const el = inner.current;
    const host = section.current;
    if (!el || !host) return;
    // Honour the OS setting: pinning is fine, but the depth cue is motion.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const apply = () => {
      raf = 0;
      // While pinned, the sheet's edge descends from the hero's full height to 0
      // as you scroll, so it reaches the centred lockup around the halfway mark.
      // The fade has to be keyed to *that* window (~28%–66% of the hero) rather
      // than to scroll from zero: starting at zero has the lockup visibly
      // dissolving while it's still in the clear, which reads as a bug, not depth.
      const h = host.offsetHeight || 1;
      const p = Math.min(1, Math.max(0, (window.scrollY - h * 0.28) / (h * 0.38)));
      el.style.opacity = String(1 - p);
      el.style.transform = `translate3d(0, ${(-p * 56).toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    apply(); // set the correct state for a restored scroll position
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      id="top"
      ref={section}
      // sticky, not fixed: it keeps its place in flow, so the sheet below starts
      // exactly where the hero ends and no spacer is needed.
      className="sticky top-0 z-0 h-[730px] w-full overflow-hidden motion-reduce:relative max-[860px]:h-[560px]"
      style={{ backgroundColor: brandInk }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={hero.image}
        alt=""
        aria-hidden
        className="absolute left-0 top-[-7.82%] h-[111.01%] w-full max-w-none object-cover"
      />
      {overlay && <div aria-hidden className="absolute inset-0" style={{ background: overlay }} />}
      <div ref={inner} className="relative flex h-full flex-col items-center justify-center gap-8 will-change-[transform,opacity]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={hero.lockup} alt={name} className="w-[373px] max-w-[78%] max-[860px]:w-[260px]" />
        <p
          className="max-w-[575px] text-balance px-6 text-center text-title-sm font-light"
          style={{ color: hero.taglineColor ?? "#faf8f3" }}
        >
          {hero.tagline}
        </p>
      </div>
    </section>
  );
}
