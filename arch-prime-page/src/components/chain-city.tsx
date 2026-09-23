"use client";

// A SECOND, static instance of the hero illustration ([chain-illustration.ts]) showing only the
// top "city" layer (L4), cropped inside the builders CTA. It reuses the same factory the hero uses,
// so edits to the city geometry (and the CITY/LV levers in chain-illustration.ts) land in both
// places. None of the hero's scroll/snap machinery is involved — this instance just builds, shows
// layer 4, and hides the lower layers.
//
// The CTA lives OUTSIDE the page's .chain-scope, but the illustration's CSS is namespaced under it,
// so we re-establish a local .chain-scope with display:contents (gives the scoped styles + CSS vars,
// no layout box of its own).

import { useEffect, useRef, useState } from "react";
import { createIllustration, type IllustrationApi } from "./chain-illustration";

// ───────────────────────── CITY PLACEMENT LEVERS ─────────────────────────
// Three tiers (boundaries: 640 and 1024 — see the on-screen breakpoint overlay).
//
//   LARGE (≥1024)        — the main design. City is pinned to the card's LEFT edge, so
//                          `left` slides it horizontally. Dials: left, bottom, scale.
//   SMALL-MEDIUM (640–1024) — city is auto-CENTRED horizontally. Dials: bottom, scale.
//   MOBILE (<640)        — city is auto-CENTRED horizontally. Dials: bottom, scale.
//
//   left   — px from the card's LEFT edge to the city's left edge (LARGE only).
//            MORE POSITIVE = slid RIGHT; MORE NEGATIVE = slid LEFT / off the left edge.
//   bottom — px from the card's BOTTOM edge. MORE NEGATIVE = pushed DOWN (more skyline
//            runs off the bottom edge).
//   scale  — size multiplier. Bigger = larger city.
//
// LARGE's left:222 reproduces the old right-pinned main design (right:-218, scale 1.5)
// at the capped 1024px card width — same spot, now dialled from the left.
// Edits to the city GEOMETRY still live in chain-illustration.ts (CITY / LV levers);
// these only crop/place the finished city inside the CTA card.
// mode "left" → dial `left` · mode "right" → dial `right` · mode "center" → dial `x` (optional nudge)
type CityCfg = { mode: "left" | "right" | "center"; left?: number; right?: number; x?: number; bottom: number; scale: number };
const CITY_LARGE:  CityCfg = { mode: "left",   left: 222, bottom: -492, scale: 1.5  }; // ≥1024 · main design, left-pinned
const CITY_SM_MD:  CityCfg = { mode: "left", left: 15, bottom: -448, scale: 1.4 };            // 640–1024 · centred
const CITY_MOBILE: CityCfg = { mode: "left",  left: -60, bottom: -436, scale: 1.2 };   // <640    · right-pinned
// ──────────────────────────────────────────────────────────────────────────

// `override` merges onto whichever tier config is picked — lets a second host
// (e.g. a smaller card) re-place the same city without new tier constants. The
// builders CTA passes nothing, so its behaviour is unchanged.
//
// For mode "left", the left offset is `var(--city-left, <computed>)`, so a host
// can make it respond to its OWN width with a CSS container query (see the home
// 2T+ card) — card-width, not the viewport, so a wide tablet card and a narrow
// small-desktop card place correctly even at overlapping viewport sizes.
export function ChainCity({ override, layer = 4 }: { override?: Partial<CityCfg>; layer?: 1 | 2 | 3 | 4 } = {}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<IllustrationApi | null>(null);
  const [cfg, setCfg] = useState<CityCfg>(CITY_LARGE);

  // pick the crop for the current tier (boundaries: 1024 and 640)
  useEffect(() => {
    const lg = window.matchMedia("(min-width:1024px)"); // LARGE
    const sm = window.matchMedia("(min-width:640px)"); // SMALL-MEDIUM
    const pick = () => setCfg(lg.matches ? CITY_LARGE : sm.matches ? CITY_SM_MD : CITY_MOBILE);
    pick();
    const mqs = [lg, sm];
    mqs.forEach((m) => m.addEventListener("change", pick));
    return () => mqs.forEach((m) => m.removeEventListener("change", pick));
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || apiRef.current) return;
    const api = createIllustration(stage);
    apiRef.current = api;
    api.setState(layer); // 4 = finance city (default); 1 = base chains, etc.
    // show only the chosen layer, drop the rest
    ["L1", "L2", "L3", "L4"]
      .filter((id) => id !== `L${layer}`)
      .forEach((id) => {
        const l = stage.querySelector<HTMLElement>(`#${id}`);
        if (l) l.style.display = "none";
      });
    // drop the tooltip marker dots — this is a decorative, non-interactive instance
    stage.querySelectorAll(".dots").forEach((d) => d.remove());
    return () => {
      api.destroy();
      apiRef.current = null;
    };
  }, []);

  // merge the caller's placement override onto the picked tier config
  const c = override ? { ...cfg, ...override } : cfg;

  // anchor the city per its mode: left edge · right edge · or centered (with optional x nudge)
  const pos =
    c.mode === "left"
      ? {
          // host may override via --city-left (e.g. a container query)
          left: `var(--city-left, ${c.left ?? 0}px)`,
          bottom: `${c.bottom}px`,
          transform: `scale(${c.scale})`,
          transformOrigin: "bottom left",
        }
      : c.mode === "right"
        ? {
            right: `${c.right ?? 0}px`,
            bottom: `${c.bottom}px`,
            transform: `scale(${c.scale})`,
            transformOrigin: "bottom right",
          }
        : {
            left: "50%",
            bottom: `${c.bottom}px`,
            transform: `translateX(calc(-50% + ${c.x ?? 0}px)) scale(${c.scale})`,
            transformOrigin: "bottom center",
          };

  return (
    <div className="chain-scope" style={{ display: "contents" }}>
      <div className="cta-city" aria-hidden>
        <div className="illo" ref={stageRef} style={pos}>
          <svg id="iso" viewBox="-320 -360 680 790" />
        </div>
      </div>
    </div>
  );
}
