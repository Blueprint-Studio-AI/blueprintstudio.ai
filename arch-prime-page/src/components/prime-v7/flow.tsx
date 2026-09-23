"use client";

// How it works, told by one moving thing — the way /chain's "How it works" stage does it. One
// path, three points: your wallet, Arch Prime, the market. One orange dot makes the trip and back
// on an eight-second loop, in step with the three steps beside it — twice, then it rests at work:
//   1  it leaves your wallet (a "signed" tick flashes there: you approve every move)
//   2  it sits in the market, a slow ring around it (it's at work)
//   3  it comes home, and the tick flashes again
// The dot never grows on the way back: nothing here implies a return. Picking a step holds it;
// the loop runs only while the stage is on screen; reduced motion shows step 2, still. This is
// the only thing on the page that moves without the reader. The stage lies flat on wide screens
// and stands up on phones, so its labels stay at reading size.

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { GLYPH, Mark } from "@/components/prime-marks";

export type Step = { title: string; line: string; small?: string };
type Labels = { wallet: string; arch: string; market: string };
type Pt = { x: number; y: number };

const PHASE_MS = 2700;
const REDUCED = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (cb: () => void) => {
  const mq = window.matchMedia(REDUCED);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

// Two layouts of the same stage. `dot` is where the dot rides relative to each point; `label`
// is where each point's name sits.
const FLAT = {
  box: { w: 720, h: 300 },
  pts: { wallet: { x: 110, y: 150 }, arch: { x: 360, y: 150 }, market: { x: 610, y: 150 } },
  dot: { x: 0, y: -46 },
  label: { x: 0, y: 64, anchor: "middle" as const },
};
const TALL = {
  box: { w: 340, h: 470 },
  pts: { wallet: { x: 96, y: 80 }, arch: { x: 96, y: 235 }, market: { x: 96, y: 390 } },
  dot: { x: -48, y: 0 },
  label: { x: 48, y: 5, anchor: "start" as const },
};

function Stage({ g, at, tick, working, labels, signed, title }: { g: typeof FLAT | typeof TALL; at: Pt; tick: boolean; working: boolean; labels: Labels; signed: string; title: string }) {
  const { pts } = g;
  const label = (p: Pt, text: string) => (
    <text x={p.x + g.label.x} y={p.y + g.label.y} textAnchor={g.label.anchor} className="fill-white/70 text-[14px]">
      {text}
    </text>
  );
  return (
    <svg viewBox={`0 0 ${g.box.w} ${g.box.h}`} className="block h-auto w-full" role="img" aria-label={title}>
      <rect width={g.box.w} height={g.box.h} fill="url(#v7-dots)" />
      <line x1={pts.wallet.x} y1={pts.wallet.y} x2={pts.market.x} y2={pts.market.y} stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" strokeDasharray="3 7" strokeLinecap="round" />

      {/* your wallet: the Bitcoin mark, and the signed tick */}
      <g transform={`translate(${pts.wallet.x} ${pts.wallet.y})`}>
        <g transform="translate(-30 -30)">
          <Mark kind="btc" size={60} />
        </g>
        <g style={{ opacity: tick ? 1 : 0, transition: "opacity 300ms" }}>
          <circle cx="26" cy="-26" r="11" fill="#ffffff" />
          <path d="M21 -26 l3.5 3.5 l6.5 -7" fill="none" stroke="#0d2249" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <text x="43" y="-22" className="fill-white/85 text-[12px]">
            {signed}
          </text>
        </g>
      </g>
      {label(pts.wallet, labels.wallet)}

      {/* Arch Prime: the glyph */}
      <g transform={`translate(${pts.arch.x} ${pts.arch.y})`}>
        <circle r="30" className="fill-white/[0.08] stroke-white/25" />
        <g transform="translate(-17 -12.3) scale(0.0625)">
          <path d={GLYPH} className="fill-white" />
        </g>
      </g>
      {label(pts.arch, labels.arch)}

      {/* the market, and a slow ring while the dot is at work there */}
      <g transform={`translate(${pts.market.x} ${pts.market.y})`}>
        <circle r="30" className="fill-white/[0.08] stroke-white/25" />
        <g className="fill-white/80">
          <rect x="-11" y="2" width="5" height="9" rx="1" />
          <rect x="-2.5" y="-6" width="5" height="17" rx="1" />
          <rect x="6" y="-12" width="5" height="23" rx="1" />
        </g>
        <circle r="40" fill="none" stroke="rgba(255,138,61,0.5)" strokeWidth="1.5" className={working ? "v7-ring" : ""} style={{ opacity: working ? 1 : 0, transition: "opacity 400ms" }} />
      </g>
      {label(pts.market, labels.market)}

      {/* the dot: the same size both ways */}
      <circle r="9" fill="#ff5e00" style={{ transform: `translate(${at.x + g.dot.x}px, ${at.y + g.dot.y}px)`, transition: "transform 1.6s cubic-bezier(0.65, 0, 0.35, 1)" }} />
    </svg>
  );
}

export function Flow({ steps, labels, signed }: { steps: readonly Step[]; labels: Labels; signed: string }) {
  const [phase, setPhase] = useState(0);
  const [auto, setAuto] = useState(true);
  const [inView, setInView] = useState(false);
  const reduced = useSyncExternalStore(subscribeReduced, () => window.matchMedia(REDUCED).matches, () => false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // two trips, then it rests at work (step 2); the steps stay clickable
  const [trips, setTrips] = useState(0);
  const resting = trips >= 2 && phase === 1;
  useEffect(() => {
    if (!auto || !inView || reduced || resting) return;
    const t = window.setTimeout(() => {
      setPhase((p) => (p + 1) % 3);
      if (phase === 2) setTrips((n) => n + 1);
    }, PHASE_MS);
    return () => window.clearTimeout(t);
  }, [auto, inView, reduced, phase, resting]);

  // each phase starts the dot where the last left it, then a beat later sends it on
  const [moved, setMoved] = useState(-1);
  useEffect(() => {
    if (reduced) return;
    const t = window.setTimeout(() => setMoved(phase), 450);
    return () => window.clearTimeout(t);
  }, [phase, reduced]);
  const gone = moved === phase;
  const shownPhase = reduced ? 1 : phase;
  const atMarket = shownPhase === 1 || (shownPhase === 0 && gone) || (shownPhase === 2 && !gone);
  // the tick flashes as the dot leaves (step 1) and as it lands home (step 3)
  const tick = !reduced && ((phase === 0 && !gone) || (phase === 2 && gone));
  const title = steps[shownPhase]?.title ?? "";
  const stage = (g: typeof FLAT | typeof TALL) => (
    <Stage g={g} at={atMarket ? g.pts.market : g.pts.wallet} tick={tick} working={shownPhase === 1} labels={labels} signed={signed} title={title} />
  );

  return (
    <div ref={root} className="grid grid-cols-1 items-center gap-x-8 gap-y-10 lg:grid-cols-12">
      <svg aria-hidden width="0" height="0" className="absolute">
        <defs>
          <pattern id="v7-dots" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.07)" />
          </pattern>
        </defs>
      </svg>

      <ol className="m-0 list-none p-0 lg:col-span-4">
        {steps.map((s, i) => {
          const on = i === shownPhase;
          return (
            <li key={s.title}>
              <button
                type="button"
                aria-pressed={on}
                onClick={() => {
                  setAuto(false);
                  setPhase(i);
                }}
                className="group flex w-full cursor-pointer gap-5 border-t border-white/12 py-5 text-left"
              >
                <span className={`w-5 shrink-0 pt-0.5 text-[13px] leading-6 tabular-nums transition-colors duration-300 ${on ? "text-[#ff8a3d]" : "text-white/40"}`}>0{i + 1}</span>
                <span className="flex flex-col">
                  <span className={`text-[20px] leading-7 font-medium tracking-[-0.01em] transition-colors duration-300 ${on ? "text-white" : "text-white/55 group-hover:text-white/80"}`}>{s.title}</span>
                  {s.small && <span className="pt-1 text-[14px] leading-5 text-white/60">{s.small}</span>}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="lg:col-span-7 lg:col-start-6">
        <div className="overflow-hidden rounded-[28px] bg-white/[0.04] ring-1 ring-white/10">
          <div className="hidden sm:block">{stage(FLAT)}</div>
          <div className="mx-auto max-w-[340px] sm:hidden">{stage(TALL)}</div>
        </div>
      </div>
    </div>
  );
}

// The loan rule as a picture: one static bar with a tick at the most you can borrow and one where
// a loan closes, and a two-line legend under it. The only place 80% and 90% appear.
export function LoanBar({ max, liq, maxLabel, liqLabel }: { max: number; liq: number; maxLabel: string; liqLabel: string }) {
  return (
    <div>
      <div className="relative pt-7">
        {[max, liq].map((v) => (
          <span key={v} className="absolute top-0 flex -translate-x-1/2 flex-col items-center" style={{ left: `${v}%` }}>
            <span className="text-[13px] leading-5 font-medium text-white tabular-nums">{v}%</span>
          </span>
        ))}
        <div className="relative flex h-2 overflow-hidden rounded-full">
          <span className="h-full bg-white/70" style={{ width: `${max}%` }} />
          <span className="h-full bg-[#ff8a3d]/80" style={{ width: `${liq - max}%` }} />
          <span className="h-full flex-1 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.3)_0_3px,transparent_3px_7px)]" />
        </div>
      </div>
      <dl className="m-0 mt-5 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
        <div className="flex items-baseline gap-3">
          <dt className="w-9 shrink-0 text-[13px] leading-5 font-medium text-white tabular-nums">{max}%</dt>
          <dd className="m-0 text-[14px] leading-5 text-white/70">{maxLabel}</dd>
        </div>
        <div className="flex items-baseline gap-3">
          <dt className="w-9 shrink-0 text-[13px] leading-5 font-medium text-[#ff8a3d] tabular-nums">{liq}%</dt>
          <dd className="m-0 text-[14px] leading-5 text-white/70">{liqLabel}</dd>
        </div>
      </dl>
    </div>
  );
}
