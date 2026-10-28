"use client";

import type { ReactNode } from "react";
import { motion, type MotionStyle } from "framer-motion";
import { Lock, RotateCw } from "lucide-react";
import { AddressText, CHROME_FONT, LoadBar } from "./Chrome";
import Screen from "./Screen";
import type { SiteTab } from "./types";

// On a phone the display becomes a phone, built the same way in CSS 3D: a
// titanium band round black glass, with real depth and its side buttons, and
// Safari on the screen, set in iPhone points (the screen is 393 points wide,
// so 1pt is 100/393 of its width). The live site loads at a phone's width.
// The phone's sizes are in cqw of the phone; the screen's, in cqw of the screen.

const PT = 100 / 393;
const pt = (n: number) => `${(n * PT).toFixed(3)}cqw`;

/** The body's depth, in slices of titanium (darker toward the back). */
const DEPTH = 11;
const SLICES = [0, 1, 2, 3, 4, 5, 6, 7];
const sliceShade = (i: number) => `hsl(40 3% ${74 - i * 3}%)`;

/** Whether text on this colour should be white. */
function dark(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 128;
}

function StatusBar({ tint }: { tint: string }) {
  const light = dark(tint);
  const ink = light ? "#FFFFFF" : "#000000";
  return (
    <div aria-hidden className="relative shrink-0" style={{ height: pt(54), backgroundColor: tint, color: ink }}>
      <span className="absolute font-semibold tracking-[-0.01em]" style={{ left: pt(51), top: pt(18), fontSize: pt(17), lineHeight: pt(22) }}>
        9:41
      </span>
      {/* The Dynamic Island. */}
      <span className="absolute left-1/2 -translate-x-1/2 rounded-full bg-black" style={{ top: pt(11), width: pt(125), height: pt(37) }} />
      <span className="absolute flex items-center" style={{ right: pt(26), top: pt(21), gap: pt(6), height: pt(13) }}>
        {/* Signal, wifi and battery. */}
        <svg viewBox="0 0 18 12" style={{ width: pt(18), height: pt(12) }} fill="currentColor">
          <rect x="0" y="8" width="3" height="4" rx="0.8" />
          <rect x="5" y="5.5" width="3" height="6.5" rx="0.8" />
          <rect x="10" y="3" width="3" height="9" rx="0.8" />
          <rect x="15" y="0" width="3" height="12" rx="0.8" />
        </svg>
        <svg viewBox="0 0 16 12" style={{ width: pt(16), height: pt(12) }} fill="currentColor">
          <path d="M8 2.6c2.3 0 4.4.9 6 2.4l1.2-1.3A10.4 10.4 0 0 0 8 .8 10.4 10.4 0 0 0 .8 3.7L2 5c1.6-1.5 3.7-2.4 6-2.4Z" />
          <path d="M8 6.1c1.3 0 2.5.5 3.5 1.3l1.2-1.3A7 7 0 0 0 8 4.3a7 7 0 0 0-4.7 1.8l1.2 1.3c1-.8 2.2-1.3 3.5-1.3Z" />
          <path d="M8 9.4c.5 0 .9.2 1.2.5L8 11.2 6.8 9.9c.3-.3.7-.5 1.2-.5Z" />
        </svg>
        <svg viewBox="0 0 27 13" style={{ width: pt(27), height: pt(13) }} fill="none">
          <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke="currentColor" strokeOpacity="0.4" />
          <rect x="2" y="2" width="20" height="9" rx="2.2" fill="currentColor" />
          <path d="M25 4.5v4c.8-.3 1.4-1.1 1.4-2s-.6-1.7-1.4-2Z" fill="currentColor" fillOpacity="0.45" />
        </svg>
      </span>
    </div>
  );
}

/** Safari's bottom bar: the address in a pill, its loading bar, and reload. */
function SafariBar({
  tab,
  archived,
  run,
  loading,
  armed,
  reduce,
  onReload,
}: {
  tab: SiteTab;
  archived: ReactNode;
  run: string;
  loading: boolean;
  armed: boolean;
  reduce: boolean;
  onReload: () => void;
}) {
  return (
    <div className="relative shrink-0 border-t border-black/[0.06] bg-[#F6F6F6]" style={{ height: pt(94) }}>
      <div
        className="absolute flex items-center overflow-hidden bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08),0_0_0_0.5px_rgba(0,0,0,0.06)]"
        style={{ left: pt(12), right: pt(12), top: pt(8), height: pt(46), borderRadius: pt(14), fontSize: pt(16) }}
      >
        <span className="flex min-w-0 flex-1 items-center justify-center" style={{ gap: pt(6), paddingLeft: pt(44) }}>
          {tab.address.live ? (
            <>
              <Lock aria-hidden className="shrink-0 text-[#1F1F1F]" style={{ width: pt(13), height: pt(13) }} strokeWidth={2.4} />
              <span className="min-w-0 truncate text-[#1F1F1F]">{tab.address.host}</span>
            </>
          ) : (
            <AddressText tab={tab} archived={archived} icon="" />
          )}
        </span>
        <button
          type="button"
          onClick={onReload}
          aria-label="Reload the page"
          className="flex shrink-0 items-center justify-center text-[#1F1F1F] outline-none active:opacity-50"
          style={{ width: pt(44), height: pt(44) }}
        >
          <RotateCw style={{ width: pt(17), height: pt(17) }} strokeWidth={2.3} />
        </button>
        <LoadBar run={run} loading={loading} armed={armed} reduce={reduce} className="bottom-0" />
      </div>
      {/* The home indicator. */}
      <span aria-hidden className="absolute left-1/2 -translate-x-1/2 rounded-full bg-black/85" style={{ bottom: pt(8), width: pt(134), height: pt(5) }} />
    </div>
  );
}

export default function Phone({
  turn,
  reduce,
  tabs,
  active,
  touched,
  loading,
  reload,
  onReload,
  onReady,
  enabled,
  archived,
  tapLabel,
  labelledBy,
}: {
  turn: MotionStyle;
  reduce: boolean;
  tabs: SiteTab[];
  active: string;
  touched: boolean;
  loading: boolean;
  reload: number;
  onReload: () => void;
  onReady: (key: string) => void;
  enabled: boolean;
  archived: ReactNode;
  tapLabel: ReactNode;
  labelledBy: string;
}) {
  const tab = tabs.find((t) => t.key === active) ?? tabs[0];
  const run = `${tab.key}-${reload}`;
  return (
    <div className="mx-auto w-[min(70cqw,300px)] [container-type:inline-size]">
      <div className="relative pb-[14cqw] [perspective-origin:50%_40%] [perspective:520cqw]">
        <motion.div style={reduce ? undefined : turn} className="relative origin-[50%_50%] [transform-style:preserve-3d] motion-reduce:![transform:none]">
          {/* Back to front, as on the display: shadows, buttons, body, face. */}
          <div
            aria-hidden
            className="absolute left-1/2 top-full h-[34cqw] w-[120cqw] rounded-[50%] bg-[radial-gradient(closest-side,rgba(24,24,20,0.2),rgba(24,24,20,0.06)_60%,transparent)]"
            style={{ transform: `translate(-50%, -50%) translateZ(${-DEPTH / 2}cqw) rotateX(90deg)` }}
          />
          <div
            aria-hidden
            className="absolute left-1/2 top-full h-[12cqw] w-[86cqw] rounded-[50%] bg-[radial-gradient(closest-side,rgba(24,24,20,0.32),transparent)]"
            style={{ transform: `translate(-50%, -50%) translateZ(${-DEPTH / 2}cqw) rotateX(90deg)` }}
          />
          {/* The side buttons: the power button on the right, the action button and volume on the left. */}
          {[
            { side: "right", top: 27, h: 14 },
            { side: "left", top: 19, h: 5.5 },
            { side: "left", top: 28, h: 9 },
            { side: "left", top: 39, h: 9 },
          ].map((b) => (
            <span
              key={`${b.side}-${b.top}`}
              aria-hidden
              className="absolute w-[1.6cqw] rounded-[0.8cqw] bg-[linear-gradient(90deg,#9C9A96,#C9C7C3,#8E8C88)]"
              style={{ top: `${b.top}%`, height: `${b.h}%`, [b.side]: "-0.9cqw", transform: `translateZ(${-DEPTH / 2}cqw)` }}
            />
          ))}
          {[...SLICES].reverse().map((i) => (
            <div
              key={i}
              aria-hidden
              className="absolute inset-0 rounded-[15cqw]"
              style={{ transform: `translateZ(${-((i + 1) * DEPTH) / SLICES.length}cqw)`, backgroundColor: sliceShade(i) }}
            />
          ))}
          {/* The face: a titanium band round the black glass. */}
          <div className="relative rounded-[15cqw] bg-[linear-gradient(135deg,#EDECE9,#B5B3AF_38%,#DAD8D4_62%,#94928E)] p-[1.1cqw] shadow-[0_0_0_0.5px_rgba(0,0,0,0.2)] [transform:translateZ(0)]">
            <div className="rounded-[13.9cqw] bg-[#0B0B0C] p-[2.7cqw]">
              <div
                className={`flex aspect-[393/852] flex-col overflow-hidden rounded-[11.2cqw] bg-white antialiased [container-type:inline-size] ${CHROME_FONT}`}
              >
                <StatusBar tint={tab.tint} />
                <div className="relative min-h-0 flex-1">
                  <Screen
                    tabs={tabs}
                    active={active}
                    variant="phone"
                    enabled={enabled}
                    reload={reload}
                    onReady={onReady}
                    reduce={reduce}
                    tapLabel={tapLabel}
                    labelledBy={labelledBy}
                    className="h-full"
                  />
                </div>
                <SafariBar tab={tab} archived={archived} run={run} loading={loading} armed={touched} reduce={reduce} onReload={onReload} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
