"use client";

// One nav, fixed to the top (Figma 305:1245).
//
// At the top of the page it has no surface of its own — the hero's own dark
// gradient carries the white text, so it reads as part of the hero frame. As you
// scroll it materialises into a frosted bar and stays there.
//
// The morph is scroll-LINKED, not a threshold toggle: a single progress value
// (0→1 across MORPH_RANGE) drives the tint, blur, border, shadow and float
// together, so the bar tracks the scroll continuously instead of snapping. That
// value is written straight to the DOM as a CSS variable via a ref, so scrolling
// never re-renders React — only the active-section change does.
import { useEffect, useRef, useState } from "react";
import { SECTIONS } from "@/lib/data";
import Button from "@/components/ui/Button";
import { DownloadIcon } from "@/components/ui/icons";

const SITE = "https://blueprintstudio.ai";
const KIT = "/downloads/jinba-brand-kit.zip";
const MORPH_RANGE = 220; // px of scroll over which the bar fully materialises
const ACTIVE_AT = 140; // px from viewport top where a section becomes "current"

export default function Nav() {
  const [active, setActive] = useState<string>("");
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const paint = () => {
      raf = 0;
      const progress = Math.min(1, Math.max(0, window.scrollY / MORPH_RANGE));
      wrap.current?.style.setProperty("--nav-p", progress.toFixed(3));

      let current = "";
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= ACTIVE_AT) current = s.id;
      }
      setActive(current); // unchanged value → React bails out, no re-render
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    // wrapper is click-through so it never blocks the hero beneath it
    <div ref={wrap} className="pointer-events-none fixed inset-x-0 top-0 z-[70]">
      {/* Width is part of the morph. At rest the bar reaches 40px nearer the
          viewport edge and sits flush to the top; as it materialises it draws in
          and floats down, settling where its content lines up with the page's
          content edge (the rounded surface overhangs it by its own 32px padding).
          max() is the floor — on narrow screens the settled inset is already
          smaller than the spread, so the two states simply converge. */}
      <div
        style={{
          paddingTop: "calc(var(--nav-p, 0) * 16px)",
          paddingLeft: "max(8px, calc(var(--edge) - 32px - (1 - var(--nav-p, 0)) * 40px))",
          paddingRight: "max(8px, calc(var(--edge) - 32px - (1 - var(--nav-p, 0)) * 40px))",
        }}
      >
        <div
          // py is symmetric so the row sits on the bar's true centre — the Figma's
          // 32/24 split pushed the logo and CTA visibly low
          className="pointer-events-auto flex items-center justify-between gap-6 rounded-3xl border border-solid px-8 py-5 max-[860px]:flex-wrap max-[860px]:gap-x-3 max-[860px]:gap-y-2 max-[860px]:px-4 max-[860px]:py-3"
          style={{
            // every surface property rides the same progress value.
            // 0.76 is the glass: dark enough to hold white text at ~8.9:1 even
            // over pure white, sheer enough that the blurred page still reads
            // through it. Above ~0.85 it goes opaque and stops being glass.
            backgroundColor: "rgba(18, 18, 18, calc(0.76 * var(--nav-p, 0)))",
            borderColor: "rgba(255, 255, 255, calc(0.1 * var(--nav-p, 0)))",
            boxShadow: "0 10px 40px rgba(0, 0, 0, calc(0.3 * var(--nav-p, 0)))",
            backdropFilter: "blur(calc(24px * var(--nav-p, 0)))",
            WebkitBackdropFilter: "blur(calc(24px * var(--nav-p, 0)))",
          }}
        >
          <a
            href={SITE}
            aria-label="Blueprint Studio"
            className="flex h-[18px] w-[136px] shrink-0 items-center max-[860px]:order-1"
          >
            {/* the lockup is dark artwork — force it white for the hero + dark bar */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/blueprint-studio-nav.png" alt="" className="h-[18px] w-auto brightness-0 invert" />
          </a>

          {/* Even 112px segments with a continuous rule beneath; active turns
              white. The segment is a symmetric h-10 box — the Figma's pt-1/pb-3
              made the text sit high inside it, so the logo and CTA (centred on
              the box) landed ~5px below the text your eye actually aligns to.
              Same height as the CTA, so the whole row shares one centre line. */}
          <nav
            aria-label="Sections"
            className="no-scrollbar flex min-w-0 items-center overflow-x-auto max-[860px]:order-3 max-[860px]:w-full"
          >
            {SECTIONS.map((s) => {
              const on = active === s.id;
              return (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  aria-current={on ? "true" : undefined}
                  className={`flex h-10 w-[112px] shrink-0 items-center justify-center whitespace-nowrap border-b text-nav text-white transition-[opacity,border-color] duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white max-[860px]:w-auto max-[860px]:flex-1 ${
                    on
                      ? "border-white opacity-100"
                      : "border-[rgba(229,229,229,0.1)] opacity-[0.33] hover:opacity-75"
                  }`}
                >
                  {s.label}
                </a>
              );
            })}
          </nav>

          <Button
            variant="glass"
            href={KIT}
            download
            className="shrink-0 gap-2.5 px-[18px] !text-label max-[860px]:order-2 max-[860px]:ml-auto"
          >
            Download All
            <DownloadIcon />
          </Button>
        </div>
      </div>
    </div>
  );
}
