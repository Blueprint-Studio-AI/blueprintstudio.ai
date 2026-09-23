"use client";

// THE PEAK — the finale. A pinned frame; scroll drives four stages through four CSS custom
// properties on the root (--p1..--p4, each 0..1), and prime.css does every transform:
//   1. Bitcoin, alone, large; the frame zooms out.
//   2. The other assets arrive and settle in a ring around it.
//   3. Each one turns prime: the underlying's disc gives way to the prime mark.
//   4. They rise out of frame, the peak photograph comes up behind, the line and the call to
//      action land.
// The HoneyB yield page's pattern: CSS owns the layout, JS only reads scroll and writes progress.
// Below md, or with reduced motion, the section is not pinned and shows the final state.

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { GLYPH, Mark } from "./prime-marks";
import { PrimeButton, T } from "./prime-ui";

const STAGES: [number, number][] = [
  [0, 0.25],
  [0.2, 0.5],
  [0.5, 0.75],
  [0.75, 1],
];

// the ring, as offsets from the centre in vw/vh; every one is a stock but the dollar
// Each asset carries its own colour, and its prime version wears the same one — so the turn
// reads as the same asset changing state, not as a different token.
// ponytail: colours only. Real marks for the listed equities need legal sign-off before they
// go anywhere public; a ticker on the brand colour says enough for a prototype.
const RING = [
  { t: "USD", x: -19, y: -11, usd: true, c: "#1e5c45" },
  { t: "TSLA", x: 17, y: -15, c: "#cc0000" },
  { t: "AAPL", x: 22, y: 7, c: "#555559" },
  { t: "NVDA", x: -17, y: 15, c: "#76b900" },
  { t: "GOLD", x: 1, y: -24, c: "#b8912f" },
  { t: "SPY", x: 4, y: 24, c: "#1b4e9b" },
];

function Ticker({ t, c }: { t: string; c: string }) {
  return (
    <span className="grid h-full w-full place-items-center rounded-full text-white" style={{ backgroundColor: c }}>
      <span className="text-[14px] font-semibold tracking-[-0.02em] md:text-[18px]">{t}</span>
    </span>
  );
}

// the prime version of an asset: its own colour, with the Arch Prime glyph in place of the ticker
function PrimeDisc({ c }: { c: string }) {
  return (
    <span className="grid h-full w-full place-items-center rounded-full" style={{ backgroundColor: c }}>
      <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden>
        <g transform="translate(16 20.5) scale(0.0588)">
          <path d={GLYPH} fill="#fff" />
        </g>
      </svg>
    </span>
  );
}

export function PrimePeak({ href, photo, actionLabel, children }: { href: string; photo: string; actionLabel: string; children?: ReactNode }) {
  const root = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)");
    const apply = () => setPinned(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const el = root.current;
    const fr = frame.current;
    if (!el || !fr) return;
    if (!pinned) {
      STAGES.forEach((_, k) => el.style.setProperty(`--p${k + 1}`, "1"));
      el.dataset.landed = "1";
      return;
    }
    let raf = 0;
    const read = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const travel = r.height - fr.offsetHeight;
      if (travel <= 0) return;
      const p = Math.max(0, Math.min(1, -r.top / travel));
      STAGES.forEach(([a, b], k) => {
        el.style.setProperty(`--p${k + 1}`, Math.max(0, Math.min(1, (p - a) / (b - a))).toFixed(4));
      });
      el.dataset.landed = p > 0.96 ? "1" : "0";
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pinned]);

  return (
    <section ref={root} id="peak" data-nav-theme="dark" className={`prime-peak relative bg-[#123164] text-white ${pinned ? "h-[400svh]" : ""}`}>
      <div ref={frame} className={`${pinned ? "sticky top-0 h-svh" : "min-h-[720px]"} relative flex flex-col overflow-hidden`}>
        {/* the peak photograph, up behind everything in the last stage */}
        <div className="peak-photo absolute inset-0">
          <Image src={photo} alt="" fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-[#0d2249]/35" />
          <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-[#0d2249]/90 to-transparent" />
        </div>

        {/* header: a line per stage, crossfading, top-left */}
        <div className="site-container relative z-[2] pt-[calc(5rem+24px)]">
          <p className={`${T.eyebrow} text-white/60`}>Everything becomes prime</p>
          <div className="relative mt-4 h-[140px] max-w-[720px] md:h-[160px]">
            <h2 className={`peak-h1 ${T.h1} absolute inset-x-0 top-0 text-white`}>It starts with Bitcoin.</h2>
            <h2 className={`peak-h2 ${T.h1} absolute inset-x-0 top-0 text-white`}>Then every asset. Stocks included.</h2>
          </div>
        </div>

        {/* the stage */}
        <div className="relative z-[1] min-h-0 flex-1">
          <div className="peak-center absolute top-1/2 left-1/2 h-[120px] w-[120px] md:h-[160px] md:w-[160px]">
            <span className="absolute inset-0">
              <Mark kind="btc" size={160} className="h-full w-full" />
            </span>
            <span className="peak-prime absolute inset-0">
              <Mark kind="primeBTC" size={160} className="h-full w-full" />
            </span>
            <span className="absolute top-full left-1/2 mt-3 -translate-x-1/2 whitespace-nowrap">
              <span className={`${T.label} peak-label-was block text-center text-white/70`}>BTC</span>
              <span className={`${T.label} peak-label-now absolute inset-x-0 top-0 block text-center text-white`}>primeBTC</span>
            </span>
          </div>
          {RING.map((r) => (
            <div
              key={r.t}
              className="peak-token absolute top-1/2 left-1/2 h-[72px] w-[72px] md:h-[96px] md:w-[96px]"
              style={{ ["--tx" as string]: `${r.x}vw`, ["--ty" as string]: `${r.y}vh` }}
            >
              <span className="absolute inset-0">{r.usd ? <Mark kind="usd" size={96} className="h-full w-full" /> : <Ticker t={r.t} c={r.c} />}</span>
              <span className="peak-prime absolute inset-0">{r.usd ? <Mark kind="primeUSD" size={96} className="h-full w-full" /> : <PrimeDisc c={r.c} />}</span>
              <span className="absolute top-full left-1/2 mt-2 -translate-x-1/2 whitespace-nowrap">
                <span className={`${T.label} peak-label-was block text-center text-white/70`}>{r.t}</span>
                <span className={`${T.label} peak-label-now absolute inset-x-0 top-0 block text-center text-white`}>prime{r.t}</span>
              </span>
            </div>
          ))}
        </div>

        {/* the landing: the line and the call to action */}
        <div className="peak-h3 absolute inset-x-0 bottom-0 z-[3]">
          <div className="site-container pb-16 md:pb-24">
          <h2 className={`${T.h1} max-w-[720px] text-white`}>Your ticket to the top.</h2>
          <p className={`${T.lead} mt-5 max-w-[560px] text-white/75`}>
            Every prime asset earns while you hold it, and every one of them is buying power. That is the account, and it starts with Bitcoin.
          </p>
          <span className="mt-8 flex flex-wrap items-center gap-6">
            <PrimeButton href={href} size="xl">
              {actionLabel}
            </PrimeButton>
            {children}
          </span>
          </div>
        </div>
      </div>
    </section>
  );
}
