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
import { useBrand } from "@/components/brands/kit/BrandContext";
import Button from "@/components/brands/kit/ui/Button";
import { DownloadIcon } from "@/components/brands/kit/ui/icons";
import BlueprintWordmark from "@/components/brands/kit/ui/BlueprintWordmark";
import { useToast } from "@/components/brands/kit/ui/Toast";

const SITE = "https://blueprintstudio.ai";
const MORPH_RANGE = 220; // px of scroll over which the bar fully materialises
const ACTIVE_AT = 140; // px from viewport top where a section becomes "current"

/**
 * Light-hero mode. Every colour in the bar is a mix between its at-rest value
 * (dark ink on the cream hero) and its scrolled value (white on the dark bar),
 * driven by the same --nav-p the surface uses — so ink, rules and CTA all cross
 * over in lockstep with the tint rather than snapping at some threshold.
 */
const mixOnLight = (rest: string, scrolled: string) =>
  `color-mix(in srgb, ${scrolled} calc(var(--nav-p, 0) * 100%), ${rest})`;

const LIGHT_INK = "#353535"; // Figma 316:27
const LIGHT_RULE = "rgba(53,53,53,0.12)";
const LIGHT_CTA_BG = "rgba(231,231,231,0.66)";

export default function Nav() {
  const { sections: SECTIONS, downloads, agentDoc, navAlwaysSolid, navOnLight } = useBrand();
  const toast = useToast();

  const ink = navOnLight ? mixOnLight(LIGHT_INK, "#ffffff") : "#ffffff";
  const ruleIdle = navOnLight ? mixOnLight(LIGHT_RULE, "rgba(229,229,229,0.1)") : "rgba(229,229,229,0.1)";

  // Preference order, best-available-wins. "Download All" only means anything
  // when there IS an all; the design doc is the next most useful single grab.
  const cta = downloads.kit
    ? { href: downloads.kit, label: "Download All", what: "the full brand kit" }
    : agentDoc
      ? { href: agentDoc.file, label: "Design System", what: "the design system" }
      : null;

  const [active, setActive] = useState<string>("");
  const wrap = useRef<HTMLDivElement>(null);
  const solid = useRef(!!navAlwaysSolid);
  solid.current = !!navAlwaysSolid;

  useEffect(() => {
    let raf = 0;
    const paint = () => {
      raf = 0;
      // Light-hero brands pin the surface on: white nav text needs a dark bar
      // from the top, so only the float/shadow animate.
      const progress = solid.current ? 1 : Math.min(1, Math.max(0, window.scrollY / MORPH_RANGE));
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
          // 32/24 split pushed the logo and CTA visibly low.
          // 15px is arithmetic, not taste: the row is 40px and the border 1px a
          // side, so 40 + 30 + 2 = the 72px bar. Change the row height and this
          // has to move with it.
          // Mobile keeps everything on ONE row: the tab strip shrinks and scrolls
          // rather than claiming a full-width second row, which was most of the
          // bar's height on a phone. No flex-wrap — wrapping happens at an item's
          // CONTENT width, so the strip would jump to its own line before it ever
          // shrank, which is exactly the second row we're removing.
          // 17px: the mobile row is the 36px tab + 34 + 2 = the same 72px bar.
          // Desktop is a 1fr/auto/1fr grid so the tabs sit on the bar's true
          // centre. justify-between only ever *looked* centred because the logo
          // and the CTA happened to be similar widths — the moment the CTA went
          // away the whole strip slid right. Equal side columns make it centred
          // by construction, CTA or not.
          className="pointer-events-auto grid grid-cols-[1fr_auto_1fr] items-center gap-6 rounded-3xl border border-solid px-8 py-[15px] max-[860px]:flex max-[860px]:gap-3 max-[860px]:px-4 max-[860px]:py-[17px]"
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
          <a href={SITE} aria-label="Blueprint Studio" className="flex h-[18px] shrink-0 items-center">
            {navOnLight ? (
              // Two real marks stacked and cross-faded on --nav-p, rather than
              // inverting the white one. The grey asset carries its own 0.5/0.33
              // opacity split between "blueprint" and "studio"; an invert would
              // flatten that to a single tone.
              <span className="relative block h-[18px]">
                <BlueprintWordmark
                  tone="grey"
                  decorative
                  className="h-[18px]"
                  style={{ opacity: "calc(1 - var(--nav-p, 0))" }}
                />
                <BlueprintWordmark
                  decorative
                  className="absolute inset-0 h-[18px]"
                  style={{ opacity: "var(--nav-p, 0)" }}
                />
              </span>
            ) : (
              <BlueprintWordmark className="h-[18px]" />
            )}
          </a>

          {/* Even 112px segments with a continuous rule beneath; active turns
              white. The segment is a symmetric h-10 box — the Figma's pt-1/pb-3
              made the text sit high inside it, so the logo and CTA (centred on
              the box) landed ~5px below the text your eye actually aligns to.
              Same height as the CTA, so the whole row shares one centre line. */}
          <nav
            aria-label="Sections"
            className="no-scrollbar flex min-w-0 items-center overflow-x-auto max-[860px]:flex-1"
          >
            {SECTIONS.map((s) => {
              const on = active === s.id;
              return (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  aria-current={on ? "true" : undefined}
                  // Mobile drops to a 36px segment at a smaller size: the tabs
                  // wrap to their own row there, so every px is paid for twice.
                  className={`flex h-10 w-[112px] shrink-0 items-center justify-center whitespace-nowrap border-b text-nav transition-[opacity,border-color] duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white max-[860px]:h-9 max-[860px]:w-auto max-[860px]:px-3.5 max-[860px]:text-meta ${
                    on ? "opacity-100" : "opacity-[0.33] hover:opacity-75"
                  }`}
                  style={{ color: ink, borderColor: on ? ink : ruleIdle }}
                >
                  {s.label}
                </a>
              );
            })}
          </nav>

          {/* The CTA takes the most useful artefact the brand actually has: the
              full kit if one is built, otherwise the design system doc. It is
              never a link to a file that doesn't exist — that's what put a 404
              in the bar before. If a brand has neither, the empty 1fr column
              keeps the tabs centred anyway. */}
          {cta && (
            <Button
              variant="glass"
              href={cta.href}
              download
              aria-label={cta.label}
              onClick={() => toast(`Downloading ${cta.what}`)}
              // Icon-only under 860px. At full width the label costs ~110px, and
              // on a 375px screen that left the tab strip 16px wide — the tabs
              // matter more than the word does. aria-label keeps the name.
              className="shrink-0 justify-self-end gap-2.5 px-[18px] !text-label max-[860px]:!h-9 max-[860px]:!px-3"
              style={
                navOnLight
                  ? { backgroundColor: mixOnLight(LIGHT_CTA_BG, "rgba(255,255,255,0.1)"), color: ink }
                  : undefined
              }
            >
              <span className="max-[860px]:hidden">{cta.label}</span>
              <DownloadIcon />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
