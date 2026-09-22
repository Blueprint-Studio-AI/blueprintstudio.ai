"use client";

// HOW — an Apple-style PINNED SCROLL-STORY. The four parallel technical advances ("beats")
// share one viewport-filling sticky frame: pinned title + 3 stat boxes on top, a big
// crossfading diagram in the middle, the beat copy below, and a dot-nav on the side. As
// you scroll, the active beat advances, the diagram crossfades, and the stat boxes re-roll.
// Principles are MANY-TO-MANY — each beat carries every principle it embodies (Native is on
// all four; Programmable only on execution); clicking a principle highlights every beat/dot
// it belongs to. Falls back to a plain stacked layout for prefers-reduced-motion, inside an
// iframe, or on mobile (<768px). Diagrams sit in a light "media" panel on the off-black band.
//
// Token mapping (chain.css → Tailwind theme): off-black #181818 = bg-black; cream = light.

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Reveal } from "./chain-reveal";

// ease-in-out for the on-screen "window" slide between beats (craft bar)
const SLIDE = "cubic-bezier(0.65, 0, 0.35, 1)";

// The four principle axes. Icons reuse the WhyBand "rules" vocabulary so the "Four rules"
// band and this filter speak one language. Native ₿ / Fast ⚡ / Decentralized mesh / Programmable </>
type Principle = "native" | "fast" | "decentralized" | "programmable";
type PrincipleDef = { id: Principle; label: string; icon: ReactNode };
const PRINCIPLES: PrincipleDef[] = [
  {
    id: "native",
    label: "Native",
    icon: (
      <>
        <path d="M8.5 5.5v13M11 3.5v2.5M14 3.5v2.5M11 18.5v2.5M14 18.5v2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M8.5 5.5h6a3.25 3.25 0 0 1 0 6.5h-6m0 0h6.6a3.25 3.25 0 0 1 0 6.5h-6.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  {
    id: "fast",
    label: "Fast",
    icon: <path d="M13 2.5 5 13.2h5.4L11 21.5 19 10.8h-5.4L13 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />,
  },
  {
    id: "decentralized",
    label: "Decentralized",
    icon: (
      <>
        <circle cx="12" cy="5" r="2.6" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="5" cy="18" r="2.6" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="19" cy="18" r="2.6" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10.6 7.2 6.4 15.8M13.4 7.2l4.2 8.6M7.6 18h8.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
  },
  {
    id: "programmable",
    label: "Programmable",
    icon: <path d="M8.5 7.5 4 12l4.5 4.5M15.5 7.5 20 12l-4.5 4.5M13.5 5l-3 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />,
  },
];

// ---- beats ----------------------------------------------------------------
type Stat = { v: string; u?: string; l: string };
type Beat = {
  id: string;
  eyebrow: string;
  title: ReactNode;
  body: ReactNode;
  img: string; // illustration (wide SVG, transparent) shown in the diagram panel
  imgM?: string; // optional narrow variant swapped in below the md breakpoint (<768px)
  // every principle this beat genuinely embodies — MANY-TO-MANY (primary first)
  principles: Principle[];
  stats: [Stat, Stat, Stat];
};

const BEATS: Beat[] = [
  {
    id: "foundation",
    eyebrow: "The foundation",
    title: "It never stops being Bitcoin.",
    body: (
      <>
        What you hold is the coin itself — <b className="font-medium text-white">a real UTXO </b>on Bitcoin&apos;s own ledger, not a receipt token for coins held elsewhere. Every move settles straight into a Bitcoin block.
      </>
    ),
    img: "/img/chain/arch_utxos.svg",
    imgM: "/img/chain/arch_utxos_mobile.svg",
    principles: ["native", "decentralized"],
    stats: [
      { v: "1", u: "UTXO", l: "your coin is one real\u00A0output" },
      { v: "0", u: "IOUs", l: "no wrapper, no\u00A0synthetic" },
      { v: "100%", l: "real, native\u00A0Bitcoin" },
    ],
  },
  {
    id: "execution",
    eyebrow: "The execution layer",
    title: "Fast and programmable.",
    body: (
      <>
        Apps fire transactions; Arch sequences them into blocks every <b className="font-medium text-white">180&nbsp;ms</b> and executes them against real Bitcoin UTXOs — reorg-safe, so its record stays consistent with Bitcoin itself.
      </>
    ),
    img: "/img/chain/arch_chain.svg",
    imgM: "/img/chain/arch_chain_mobile.svg",
    principles: ["native", "fast", "programmable", "decentralized"],
    stats: [
      { v: "180", u: "ms", l: "one block,\u00A0every" },
      { v: "1,500", u: "TPS", l: "throughput" },
      { v: "eBPF", u: "VM", l: "Solana-like VM, on\u00A0UTXOs" },
    ],
  },
  {
    id: "cryptography",
    eyebrow: "The cryptography",
    title: <>There&apos;s no single key to hold.</>,
    body: (
      <>
        The authority to move a coin lives only as shares split across the validators. <b className="font-medium text-white">No single party</b>, Arch included, can move anything alone.
      </>
    ),
    img: "/img/chain/arch_keys.svg",
    imgM: "/img/chain/arch_keys_mobile.svg",
    principles: ["decentralized", "native"],
    stats: [
      { v: "1", u: "signature", l: "on-chain: an ordinary Bitcoin\u00A0spend" },
      { v: "0", u: "single keys", l: "no party can sign\u00A0alone" },
      { v: "FROST", u: "·ROAST", l: "threshold\u00A0signing" },
    ],
  },
  {
    id: "settlement",
    eyebrow: "Settlement",
    title: (
      <>
        Fast where it needs to be.
        <br />
        Final where it counts.
      </>
    ),
    body: (
      <>
        Move faster than Bitcoin alone ever could, then settle with <b className="font-medium text-white">Bitcoin&apos;s own finality</b>.
      </>
    ),
    img: "/img/chain/arch_settlement.svg",
    imgM: "/img/chain/arch_settlement_mobile.svg",
    principles: ["fast", "native"],
    stats: [
      { v: "180", u: "ms", l: "Arch executes\u00A0(fast)" },
      { v: "~10", u: "min", l: "Bitcoin settles\u00A0(final)" },
      { v: "1", u: "block", l: "one settlement = one\u00A0block" },
    ],
  },
];
const N = BEATS.length;

// ---- shared pieces --------------------------------------------------------
// renders text with a per-character "decode" glitch — each char resolves through
// black/white/orange blocks, staggered. Used on the stat numbers during a beat change.
function GlitchText({ text, delayBase = 0 }: { text: string; delayBase?: number }) {
  return (
    <>
      {Array.from(text).map((ch, i) => (
        <span key={i} className="chain-char" style={{ animationDelay: `${delayBase + i * 35}ms` }}>
          {ch === " " ? " " : ch}
        </span>
      ))}
    </>
  );
}

// the three metrics — sit to the RIGHT of the beat copy, separated by vertical hairlines
// (no card surface anymore). Numbers re-roll (glitch) on each beat change when `reKey` is set.
function MetricsRail({ beat, reKey }: { beat: Beat; reKey?: number }) {
  const anim = reKey !== undefined; // pinned story → glitch the numbers on each beat change
  // Responsive orientation, one component for both code paths:
  //   mobile (<md)      → 3 columns, shrunk to fit a phone (sits under the diagram)
  //   tablet (md→lg)    → a COLUMN of 3, each fact full-width so its words stretch freely
  //   desktop (≥lg)     → back to 3 columns beside the copy
  return (
    <div className="grid grid-cols-3 gap-x-0 gap-y-4 md:grid-cols-1 lg:grid-cols-3 lg:gap-y-0">
      {beat.stats.map((s, i) => {
        const base = i * 55;
        return (
          <div
            key={i}
            className={`flex min-w-0 flex-col justify-center ${
              i === 0
                ? "pr-3 md:pr-0 lg:pr-3"
                : "border-l border-[#4d4c52] px-3 md:border-l-0 md:px-0 lg:border-l lg:px-3"
            }`}
          >
            <div key={reKey}>
              <div className="whitespace-nowrap text-[1.2rem] font-medium leading-none tracking-[-0.03em] tabular-nums text-white md:text-[1.95rem]">
                {anim ? <GlitchText text={s.v} delayBase={base} /> : s.v}
                {s.u && (
                  <span
                    className={`ml-0.5 text-[0.8rem] text-neutral-400 md:text-[1.05rem] ${anim ? "chain-reroll" : ""}`}
                    style={anim ? { animationDelay: `${base + Array.from(s.v).length * 35}ms` } : undefined}
                  >
                    {s.u}
                  </span>
                )}
              </div>
              <div
                className={`mt-1.5 text-[0.7rem] leading-[1.35] text-neutral-400 md:mt-0.5 md:text-[0.72rem] lg:mt-2 ${anim ? "chain-reroll" : ""}`}
                style={anim ? { animationDelay: `${base + 120}ms` } : undefined}
              >
                {s.l}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// a small principle pill — "dark" tone on the black band (header legend), "light" tone
// inside the white beat cards (per-beat tags). PASSIVE: not a button, no hover, no click —
// it only mirrors the current scroll step (`lit`). Un-lit pills sit far back so the row reads
// as quiet ambient info, not a filter/navigation control.
function PrinciplePill({
  def,
  lit = false,
  tone = "dark",
  iconOnly = false,
}: {
  def: PrincipleDef;
  // `lit` = this principle belongs to the current scroll step → glows; otherwise it recedes
  lit?: boolean;
  tone?: "dark" | "light";
  iconOnly?: boolean;
}) {
  const surface = lit
    ? tone === "light"
      ? "bg-black/[0.05] text-neutral-700"
      : "bg-white/[0.14] text-white shadow-[0_0_0_1px_rgba(255,255,255,0.16)]"
    : tone === "light"
      ? "text-neutral-300"
      : "text-white/25";
  const iconColor = lit
    ? "text-orange/80"
    : tone === "light"
      ? "text-neutral-300"
      : "text-white/20";

  if (iconOnly) {
    return (
      <span
        aria-hidden="true"
        className={`grid h-7 w-7 place-items-center rounded-full transition-colors duration-200 ${surface}`}
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={`h-3.5 w-3.5 transition-colors duration-200 ${iconColor}`}>
          {def.icon}
        </svg>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-[3px] rounded-full px-[7px] py-[2px] text-[0.5rem] uppercase tracking-[0.06em] transition-colors duration-200 md:gap-1.5 md:px-2.5 md:py-[5px] md:text-[0.62rem] md:tracking-[0.1em] ${surface}`}
    >
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={`h-2 w-2 transition-colors duration-200 md:h-3 md:w-3 ${iconColor}`}>
        {def.icon}
      </svg>
      {def.label}
    </span>
  );
}

function PrincipleLegend({
  lit = [],
}: {
  // principles of the current scroll step — these pills glow to mirror where you are
  lit?: Principle[];
}) {
  return (
    <div className="flex flex-wrap items-center gap-1 md:justify-end md:gap-1.5">
      {PRINCIPLES.map((p) => (
        <PrinciplePill key={p.id} def={p} lit={lit.includes(p.id)} />
      ))}
    </div>
  );
}

function BeatCopy({ beat }: { beat: Beat }) {
  return (
    <>
      <div className="text-[0.65rem] uppercase tracking-[0.1em] text-neutral-400 md:text-[0.7rem]">{beat.eyebrow}</div>
      <h3 className="mt-1.5 font-serif text-[1.4rem] font-light leading-[1.1] tracking-[-0.01em] text-white md:mt-3 md:text-[2rem] md:leading-[1.12]">
        {beat.title}
      </h3>
      <p className="mt-2 max-w-[42ch] text-pretty text-[0.82rem] leading-[1.45] text-neutral-300 md:mt-2.5 md:text-[0.95rem] md:leading-[1.55]">{beat.body}</p>
    </>
  );
}

// the diagram panel that lives inside a beat card — the only surface with a background
function BeatDiagram({ beat, className = "" }: { beat: Beat; className?: string }) {
  return (
    <div
      className={`flex min-w-0 items-center justify-center overflow-hidden rounded-[6px] bg-[#38383E] px-8 py-8 md:px-12 md:py-12 lg:px-32 lg:py-16 ${className}`}
    >
      {/* below md (<768px) swap in the narrow variant when a beat provides one */}
      <picture>
        {beat.imgM && <source media="(max-width:767px)" srcSet={beat.imgM} />}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={beat.img} alt="" aria-hidden className="max-h-full w-auto max-w-full object-contain" />
      </picture>
    </div>
  );
}

// the beat layout variants:
//   center → text left (vertically centered) · diagram right
//   fill   → text left (justified top↔bottom to fill the height) · diagram right
//   below  → diagram on top (fills) · text below
type CardVariant = "center" | "fill" | "below";

// the inner layout of a beat (text + diagram), WITHOUT the card frame. `fill` makes it
// fill a fixed-height parent — used by the pinned "window" slide; otherwise it sizes naturally.
function BeatContent({
  beat,
  variant,
  fill = false,
  reKey,
}: {
  beat: Beat;
  variant: CardVariant;
  fill?: boolean;
  reKey?: number;
}) {
  const copy = <BeatCopy beat={beat} />;

  if (variant === "below") {
    return (
      <div className={`flex flex-col gap-6 ${fill ? "h-full" : ""}`}>
        {/* mobile: shorten the illustration panel a touch so it doesn't dominate the fold */}
        <BeatDiagram beat={beat} className={fill ? "min-h-0 flex-1" : "max-h-[210px] md:max-h-none"} />
        {/* mobile: metrics sit DIRECTLY under the image (3 cols), copy below.
            ≥md (reduced-motion stacked): copy left · metrics right — flex-row-reverse keeps
            metrics first in the DOM (so they stay under the image on mobile) yet render right. */}
        <div className="flex flex-col gap-6 md:flex-row-reverse md:items-start md:justify-between md:gap-10">
          <div className="md:w-[44%] md:shrink-0 md:pt-1">
            <MetricsRail beat={beat} reKey={reKey} />
          </div>
          <div className="md:flex-1">{copy}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-7 md:flex-row md:gap-10 ${fill ? "h-full" : ""}`}>
      <div className={`flex flex-col md:w-[40%] md:shrink-0 ${variant === "fill" ? "md:justify-between" : "md:justify-center"}`}>
        {copy}
        <div className="mt-6">
          <MetricsRail beat={beat} reKey={reKey} />
        </div>
      </div>
      <BeatDiagram beat={beat} className={fill ? "flex-1" : "flex-1 md:h-[15rem]"} />
    </div>
  );
}

// a complete beat card (frame + content) — used by the stacked fallback
function BeatCard({ beat, variant = "center", className = "" }: { beat: Beat; variant?: CardVariant; className?: string }) {
  return (
    <div className={className}>
      <BeatContent beat={beat} variant={variant} />
    </div>
  );
}

function DotNav({
  active,
  onJump,
}: {
  active: number;
  onJump: (i: number) => void;
}) {
  return (
    <nav
      aria-label="How it works — sections"
      className="absolute left-full top-1/2 ml-4 hidden -translate-y-1/2 flex-col items-center lg:flex xl:ml-6"
    >
      {BEATS.map((b, i) => {
        const isActive = i === active;
        return (
          <button
            key={b.id}
            type="button"
            onClick={() => onJump(i)}
            aria-current={isActive ? "true" : undefined}
            aria-label={b.eyebrow}
            title={b.eyebrow}
            className="group my-[3px] grid h-5 w-5 shrink-0 place-items-center"
          >
            <span
              className={`h-2 w-2 rounded-full transition-[transform,background-color] duration-200 ${
                isActive ? "scale-125 bg-orange" : "bg-white/30 group-hover:bg-white/60"
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
}

// ---- stacked fallback (reduced-motion / iframe / mobile) -------------------
function ChainHowStacked({ variant }: { variant: CardVariant }) {
  return (
    <section data-nav-theme="dark" className="bg-[#2e2d33] font-sans text-white antialiased">
      <div className="mx-auto w-[92%] max-w-[64rem] py-24 md:py-28">
        <Reveal>
          <header className="flex flex-col gap-y-5 md:flex-row md:items-baseline md:justify-between md:gap-x-10">
            <h2 className="text-[1.7rem] font-medium tracking-[-0.02em] text-white md:text-[2rem]">How it works.</h2>
            <PrincipleLegend />
          </header>
          <p className="mt-5 max-w-[52ch] text-[1.02rem] leading-[1.55] text-neutral-400">
            The advances that make all four true at the same time — native, fast, decentralized, and programmable, on one chain.
          </p>
        </Reveal>

        <div className="mt-14 flex flex-col gap-12">
          {BEATS.map((b, i) => (
            <Reveal key={b.id} y={0} delay={i * 60}>
              <BeatCard beat={b} variant={variant} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- pinned scroll-story ---------------------------------------------------
export function ChainHow() {
  const sectionRef = useRef<HTMLElement>(null);
  const sentinels = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);
  // SSR + first paint = stacked (safe everywhere, no hydration mismatch); a mount
  // effect upgrades to the pinned story only on a real desktop browser.
  const [pinned, setPinned] = useState(false);
  // card layout variant — default is "below" (diagram on top, text below); flip with
  // ?v=center or ?v=fill for review
  const [variant, setVariant] = useState<CardVariant>("below");

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const framed = window.frameElement !== null || window.self !== window.top;
    // Pinned scroll-story on ALL breakpoints — only reduced-motion / embedded fall back to the
    // plain stacked list. The pinned frame's internal layout is responsive: mobile stacks
    // diagram → metrics row → copy; desktop puts copy + metrics in a row under the diagram.
    // (On pointer devices the wheel snaps a beat per gesture; touch scrolls freely and the
    // IntersectionObserver still cross-fades each beat as it passes the centre line.)
    setPinned(!reduce && !framed);
    const v = new URLSearchParams(window.location.search).get("v");
    if (v === "below" || v === "fill" || v === "center") setVariant(v);
  }, []);

  useEffect(() => {
    if (!pinned) return;
    // one observer collapses the viewport to a center line; exactly one sentinel band
    // straddles it at a time → that's the active beat.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const i = sentinels.current.indexOf(e.target as HTMLDivElement);
            if (i !== -1) setActive(i);
          }
        }
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
    );
    sentinels.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [pinned]);

  // Per-beat scroll resistance — the SAME machine the hero uses, scoped to this section's range.
  // It hooks Lenis's `virtual-scroll` (not native wheel) and eases with `lenis.scrollTo`, so it
  // cooperates with the single Lenis instance instead of fighting it (the conflict that earlier
  // forced removing How's own machine was two machines BOTH owning the page; this one is guarded
  // to `inHow()` and the hero's to `inHero()`, so their ranges never overlap). One deliberate
  // gesture = one beat; the decelerating tail of a flick is ignored, so momentum can't fly past
  // a beat before you've read it. idle-settle rubber-bands onto the nearest beat on any coast.
  useEffect(() => {
    if (!pinned) return;
    type L = {
      scrollTo: (t: number, o: Record<string, unknown>) => void;
      on: (e: string, f: (a: { deltaY: number }) => void) => void;
      off: (e: string, f: (a: { deltaY: number }) => void) => void;
    };
    const ease = (x: number) => 1 - Math.pow(1 - x, 3);
    const THRESH = 90; // accumulated wheel a gesture must build before the current beat releases
    const PAUSE = 200; // ms gap that begins a fresh gesture
    let armed = true;
    let acc = 0;
    let lastT = 0;
    let idleT = 0;
    let waitRaf = 0;
    let mags: number[] = []; // recent |deltaY| → accel-vs-momentum-tail detection
    let lenis: L | null = null;

    const ih = () => window.innerHeight;
    const top = () => {
      const el = sectionRef.current;
      return el ? el.getBoundingClientRect().top + window.scrollY : 0;
    };
    const lastBeatY = () => top() + (N - 1) * ih();
    // own ONLY the pinned range; above (spacer/WhyBand) and below (ChainUnlock) stay free scroll
    const inHow = () => window.scrollY >= top() - 2 && window.scrollY <= lastBeatY() + 2;
    const beatY = (i: number) => top() + Math.max(0, Math.min(N - 1, i)) * ih();
    const curBeat = () => Math.max(0, Math.min(N - 1, Math.round((window.scrollY - top()) / ih())));

    const avg = (a: number[], n: number) => {
      const len = a.length;
      if (!len) return 0;
      const k = Math.min(n, len);
      let s = 0;
      for (let i = len - k; i < len; i++) s += a[i];
      return s / k;
    };
    const rearm = () => window.setTimeout(() => { armed = true; }, 60);
    const snapTo = (y: number, dur: number) => {
      if (!lenis) return;
      armed = false;
      acc = 0;
      lenis.scrollTo(y, { lock: true, duration: dur, easing: ease, onComplete: rearm });
    };

    const onV = (e: { deltaY: number }) => {
      if (!lenis) return;
      const now = performance.now();
      if (now - lastT > PAUSE) { acc = 0; mags = []; } // a real pause = a fresh gesture
      lastT = now;
      if (!inHow()) return; // outside the section → inert; free scroll owns it
      mags.push(Math.abs(e.deltaY));
      if (mags.length > 80) mags.shift();
      if (!armed) return; // mid-snap → the scrollTo lock also blocks input
      if (avg(mags, 8) < avg(mags, 30) * 0.9) { acc = 0; return; } // decelerating tail → ignore
      if (acc * e.deltaY < 0) acc = 0; // direction reversed → accumulate fresh
      acc += e.deltaY;
      if (Math.abs(acc) < THRESH) return; // sub-threshold → idle-settle handles it
      const dir = acc > 0 ? 1 : -1;
      const cur = curBeat();
      if (dir > 0) {
        if (cur >= N - 1) { acc = 0; return; } // last beat → hand off to free scroll below
        snapTo(beatY(cur + 1), 0.55);
      } else {
        if (cur <= 0) { acc = 0; return; } // first beat → hand off to free scroll above
        snapTo(beatY(cur - 1), 0.55);
      }
    };

    // idle-settle: whenever scrolling STOPS inside the section off a beat, ease onto the nearest.
    const onScroll = () => {
      if (idleT) clearTimeout(idleT);
      idleT = window.setTimeout(() => {
        if (!armed || !lenis || !inHow()) return;
        const target = beatY(curBeat());
        if (Math.abs(window.scrollY - target) > 6) snapTo(target, 0.4);
      }, 130);
    };

    const attach = () => {
      lenis = (window as Window & { __lenis?: L }).__lenis ?? null;
      if (!lenis) { waitRaf = requestAnimationFrame(attach); return; }
      lenis.on("virtual-scroll", onV);
      lenis.on("scroll", onScroll as (a: { deltaY: number }) => void);
    };
    attach();
    return () => {
      if (waitRaf) cancelAnimationFrame(waitRaf);
      if (idleT) clearTimeout(idleT);
      if (lenis) {
        lenis.off("virtual-scroll", onV);
        lenis.off("scroll", onScroll as (a: { deltaY: number }) => void);
      }
    };
  }, [pinned]);

  // dot-nav jump — route through the shared Lenis instance so it eases smoothly instead of
  // fighting it with native behavior:"smooth".
  const jump = (i: number) => {
    const el = sentinels.current[i];
    if (!el) return;
    const lenis = (window as Window & { __lenis?: { scrollTo: (t: HTMLElement, o?: Record<string, unknown>) => void } }).__lenis;
    if (lenis) lenis.scrollTo(el, { duration: 0.8 });
    else el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  if (!pinned) return <ChainHowStacked variant={variant} />;

  return (
    <section ref={sectionRef} data-nav-theme="dark" className="relative bg-[#2e2d33] font-sans text-white antialiased" style={{ height: `calc(${N} * 100svh)` }}>
      {/* pinned frame — fills the viewport while the story advances. Top padding clears the
          fixed 5rem nav so the header never tucks underneath it. */}
      <div className="sticky top-0 flex h-svh flex-col overflow-clip px-[4%] pb-[clamp(2.25rem,5vh,3.5rem)] pt-[calc(5rem+clamp(1rem,3vh,2rem))]">
        <div className="mx-auto flex w-full max-w-[64rem] flex-1 flex-col">
          {/* header: title + clickable principle legend. The active step's principles glow. */}
          <header className="flex flex-col gap-y-2.5 md:flex-row md:items-baseline md:justify-between md:gap-x-10 md:gap-y-4">
            <h2 className="text-[1.35rem] font-medium tracking-[-0.02em] md:text-[2rem]">How it works.</h2>
            <PrincipleLegend lit={BEATS[active].principles} />
          </header>

          {/* beat "window" — the diagram (top, shrunk) and copy (bottom-left) slide together
              between beats; the three metrics (bottom-right) stay put and just re-roll on each
              step instead of sliding. The dot nav sits beside it. */}
          <div className="relative mt-4 flex min-h-0 flex-1 flex-col gap-3 md:mt-6 md:gap-2">
            {/* diagram zone — fills the leftover height so the panel stretches to fill the screen.
                The dot-nav lives here so it centers on the illustration, not the whole window. */}
            <div className="relative min-h-0 flex-1">
              <div className="absolute inset-0 overflow-hidden">
                {BEATS.map((b, i) => (
                  <div
                    key={b.id}
                    aria-hidden={i !== active}
                    className="absolute inset-0 transition-transform duration-[600ms] will-change-transform"
                    style={{ transitionTimingFunction: SLIDE, transform: `translateY(${(i - active) * 100}%)` }}
                  >
                    <BeatDiagram beat={b} className="h-full" />
                  </div>
                ))}
              </div>
              <DotNav active={active} onJump={jump} />
            </div>

            {/* bottom: MOBILE stacks copy then metrics (full-width row) below it; DESKTOP is copy
                (slides, left) + metrics (static, right). The copy slides between beats; the metrics
                re-roll. Each slide clips so neighbours never peek. */}
            <div className="flex shrink-0 flex-col gap-3 md:h-[clamp(12rem,26vh,16rem)] md:flex-row md:items-center md:gap-6">
              {/* metrics — mobile: full-width row, below the copy; desktop: right column */}
              <div className="order-2 w-full shrink-0 md:w-[36%] lg:w-[44%]">
                <MetricsRail beat={BEATS[active]} reKey={active} />
              </div>
              {/* copy — sliding crossfade; fixed height so the absolute beats can slide + clip */}
              <div className="relative order-1 h-[clamp(8.5rem,22vh,11rem)] min-w-0 overflow-hidden md:h-full md:flex-1">
                {BEATS.map((b, i) => (
                  <div
                    key={b.id}
                    aria-hidden={i !== active}
                    className="absolute inset-0 flex flex-col justify-center overflow-hidden transition-transform duration-[600ms] will-change-transform"
                    style={{
                      transitionTimingFunction: SLIDE,
                      transform: `translateY(${(i - active) * 100}%)`,
                      pointerEvents: i === active ? "auto" : "none",
                    }}
                  >
                    <BeatCopy beat={b} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* sentinels — N equal bands the IO center line passes through */}
      <div className="pointer-events-none absolute inset-0 grid" aria-hidden style={{ gridTemplateRows: `repeat(${N}, 1fr)` }}>
        {BEATS.map((b, i) => (
          <div
            key={b.id}
            ref={(el) => {
              sentinels.current[i] = el;
            }}
          />
        ))}
      </div>
    </section>
  );
}
