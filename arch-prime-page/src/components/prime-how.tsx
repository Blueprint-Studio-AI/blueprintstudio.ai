"use client";

// HOW PRIME WORKS — a pinned scroll-story forked from chain-how.tsx and cut down to what this
// page needs: one sticky frame, four beats, the illustration and copy slide between beats, a
// dot nav, and the same Lenis one-gesture-one-beat snap. Light surface to match the app.
// Falls back to a stacked list for prefers-reduced-motion or inside an iframe.
// ponytail: forked, not generalised. Fold into one component if a third page needs it.

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import Image from "next/image";
import { Mark, type MarkKind } from "./prime-marks";
import { OUTER_EDGE, VIEW_BOX } from "./prime-arch";

const SLIDE = "cubic-bezier(0.65, 0, 0.35, 1)";

// Pin only on a real browser that hasn't asked for reduced motion. Server + hydration read
// false (stacked), so there's no mismatch; the client upgrades to pinned on first render.
function subscribeMotion(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
function canPin() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const framed = window.frameElement !== null || window.self !== window.top;
  return !reduce && !framed;
}

type Beat = {
  id: string;
  eyebrow: string;
  title: ReactNode;
  body: ReactNode;
  ground: string; // panel colour — the brand line grounds
  ink: string; // arrow colour on that ground
  img?: string; // photographic panel (the product's own landscape)
  art: ReactNode;
};

// ---- illustrations -----------------------------------------------------------
// The real token marks (Brand/Arch Prime/primeTokens, the app's asset marks), in vector, on the
// brand grounds. The Earn beat sits on the app's Earn hero photograph.
const MARK = "h-[84px] w-[84px] md:h-[150px] md:w-[150px] drop-shadow-[0_12px_32px_rgba(0,0,0,0.18)]";
const SMALL = "h-[52px] w-[52px] md:h-[96px] md:w-[96px] drop-shadow-[0_12px_32px_rgba(0,0,0,0.18)]";

function Arrow() {
  return (
    <svg viewBox="0 0 48 24" className="h-3.5 w-7 shrink-0 md:h-6 md:w-12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 12h40" />
      <path d="M34 4l10 8-10 8" />
    </svg>
  );
}

/** Bitcoin standing under the arch: deposited into the account, still Bitcoin. */
function InArch() {
  return (
    <span className="relative flex h-[150px] items-end justify-center md:h-[240px]">
      <svg viewBox={VIEW_BOX} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="h-full w-auto opacity-75" aria-hidden>
        <path d={OUTER_EDGE} vectorEffect="non-scaling-stroke" />
      </svg>
      <Mark kind="btc" className={`absolute bottom-0 ${MARK}`} />
    </span>
  );
}

// primeBTC at the centre with what its value reaches around it — held, not traded away.
const ORBIT: { kind: MarkKind; left: string; top: string }[] = [
  { kind: "usd", left: "17%", top: "24%" },
  { kind: "next", left: "83%", top: "21%" },
  { kind: "next", left: "85%", top: "76%" },
  { kind: "next", left: "15%", top: "79%" },
];

function Orbit() {
  return (
    <span className="relative block h-[190px] w-[290px] md:h-[300px] md:w-[440px]">
      {ORBIT.map((o) => (
        <span key={`${o.left}${o.top}`} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: o.left, top: o.top }}>
          <Mark kind={o.kind} className={SMALL} />
        </span>
      ))}
      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Mark kind="primeBTC" className={MARK} />
      </span>
    </span>
  );
}

const BEATS: Beat[] = [
  {
    id: "deposit",
    eyebrow: "01 · Deposit",
    title: "Deposit Bitcoin.",
    body: "Into your prime account. It helps build the bank, and it earns interest on its own from the first block.",
    ground: "#D0DBD7",
    ink: "#164939",
    art: <InArch />,
  },
  {
    id: "prime",
    eyebrow: "02 · Make it prime",
    title: "Still Bitcoin. More yield.",
    body: "Turn it into primeBTC: the same Bitcoin, with a curated strategy's yield on top. Never locked, never wrapped.",
    ground: "#FBE3D1",
    ink: "#E97518",
    art: (
      <>
        <Mark kind="btc" className={MARK} />
        <Arrow />
        <Mark kind="primeBTC" className={MARK} />
      </>
    ),
  },
  {
    id: "power",
    eyebrow: "03 · Buying power",
    title: "Use its value. Keep the yield.",
    body: "What you hold is buying power. Borrow against it, or put it up as margin to accumulate more, while every position keeps earning.",
    ground: "#6b1e0d",
    ink: "#ffffff",
    art: <Orbit />,
  },
  {
    id: "withdraw",
    eyebrow: "04 · Withdraw",
    title: "Withdraw any time.",
    body: "Redeem primeBTC to Bitcoin whenever you want, with everything it earned. Nothing is locked, and nothing leaves Bitcoin.",
    ground: "#f7f6f6",
    ink: "#292a2e",
    art: (
      <>
        <Mark kind="primeBTC" className={MARK} />
        <Arrow />
        <Mark kind="btc" className={MARK} />
      </>
    ),
  },
];
const N = BEATS.length;

// ---- pieces ----------------------------------------------------------------
function BeatPanel({ beat, className = "" }: { beat: Beat; className?: string }) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden rounded-[20px] p-6 md:p-12 ${className}`}
      style={{ backgroundColor: beat.ground, color: beat.ink }}
    >
      {beat.img && <Image src={beat.img} alt="" fill sizes="(max-width: 992px) 92vw, 800px" className="object-cover" />}
      <div className="relative flex items-center gap-3 md:gap-8">{beat.art}</div>
    </div>
  );
}

function BeatCopy({ beat }: { beat: Beat }) {
  return (
    <>
      <div className="text-[16px] leading-6 tracking-[-0.03em] text-[#8c8c8c]">{beat.eyebrow}</div>
      <h3 className="mt-2 font-serif text-[28px] font-normal leading-[1.18] md:text-[36px]">{beat.title}</h3>
      <p className="mt-4 max-w-[40ch] text-[18px] leading-7 text-[#787878]">{beat.body}</p>
    </>
  );
}

function DotNav({ active, onJump }: { active: number; onJump: (i: number) => void }) {
  return (
    <nav aria-label="How primeBTC works — steps" className="absolute top-1/2 right-full mr-3 hidden -translate-y-1/2 flex-col items-center lg:flex">
      {BEATS.map((b, i) => (
        <button key={b.id} type="button" onClick={() => onJump(i)} aria-current={i === active ? "true" : undefined} aria-label={b.eyebrow} className="group my-[3px] grid h-5 w-5 place-items-center">
          <span className={`h-2 w-2 rounded-full transition-[transform,background-color] duration-200 ${i === active ? "scale-125 bg-orange" : "bg-black/20 group-hover:bg-black/40"}`} />
        </button>
      ))}
    </nav>
  );
}

function Header() {
  return (
    <header className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between md:gap-10">
      <h2 className="font-serif text-[36px] leading-[44px] tracking-[-0.04em] sm:text-[48px] sm:leading-[56px]">How primeBTC works.</h2>
    </header>
  );
}

// ---- stacked fallback --------------------------------------------------------
function PrimeHowStacked() {
  return (
    <section id="how" className="bg-white py-25 text-black">
      <div className="site-container">
        <Header />
        <div className="mt-12 flex flex-col gap-10">
          {BEATS.map((b) => (
            <div key={b.id} className="grid gap-6 lg:grid-cols-[1fr_38%] lg:gap-10">
              <BeatPanel beat={b} className="min-h-[280px]" />
              <div className="flex flex-col justify-center">
                <BeatCopy beat={b} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- pinned scroll-story -------------------------------------------------------
export function PrimeHow() {
  const sectionRef = useRef<HTMLElement>(null);
  const sentinels = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const pinned = useSyncExternalStore(subscribeMotion, canPin, () => false);

  // one observer collapses the viewport to a centre line; the sentinel band straddling it is
  // the active beat.
  useEffect(() => {
    if (!pinned) return;
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

  // Per-beat scroll resistance, scoped to this section's range — verbatim from chain-how. One
  // deliberate gesture = one beat; a flick's decelerating tail is ignored; idle-settle
  // rubber-bands onto the nearest beat.
  useEffect(() => {
    if (!pinned) return;
    type L = {
      scrollTo: (t: number, o: Record<string, unknown>) => void;
      on: (e: string, f: (a: { deltaY: number }) => void) => void;
      off: (e: string, f: (a: { deltaY: number }) => void) => void;
    };
    const ease = (x: number) => 1 - Math.pow(1 - x, 3);
    const THRESH = 90;
    const PAUSE = 200;
    let armed = true;
    let acc = 0;
    let lastT = 0;
    let idleT = 0;
    let waitRaf = 0;
    let mags: number[] = [];
    let lenis: L | null = null;

    const ih = () => window.innerHeight;
    const top = () => {
      const el = sectionRef.current;
      return el ? el.getBoundingClientRect().top + window.scrollY : 0;
    };
    const lastBeatY = () => top() + (N - 1) * ih();
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
      if (now - lastT > PAUSE) { acc = 0; mags = []; }
      lastT = now;
      if (!inHow()) return;
      mags.push(Math.abs(e.deltaY));
      if (mags.length > 80) mags.shift();
      if (!armed) return;
      if (avg(mags, 8) < avg(mags, 30) * 0.9) { acc = 0; return; }
      if (acc * e.deltaY < 0) acc = 0;
      acc += e.deltaY;
      if (Math.abs(acc) < THRESH) return;
      const dir = acc > 0 ? 1 : -1;
      const cur = curBeat();
      if (dir > 0) {
        if (cur >= N - 1) { acc = 0; return; }
        snapTo(beatY(cur + 1), 0.55);
      } else {
        if (cur <= 0) { acc = 0; return; }
        snapTo(beatY(cur - 1), 0.55);
      }
    };
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

  const jump = (i: number) => {
    const el = sentinels.current[i];
    if (!el) return;
    const lenis = (window as Window & { __lenis?: { scrollTo: (t: HTMLElement, o?: Record<string, unknown>) => void } }).__lenis;
    if (lenis) lenis.scrollTo(el, { duration: 0.8 });
    else el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (!pinned) return <PrimeHowStacked />;

  const slide = (i: number) => ({
    transitionTimingFunction: SLIDE,
    transform: `translateY(${(i - active) * 100}%)`,
    pointerEvents: i === active ? ("auto" as const) : ("none" as const),
  });

  return (
    <section ref={sectionRef} id="how" className="relative bg-white text-black" style={{ height: `calc(${N} * 100svh)` }}>
      {/* pinned frame — top padding clears the fixed 5rem nav */}
      <div className="sticky top-0 flex h-svh flex-col overflow-clip px-[4%] pb-[clamp(2rem,5vh,3.5rem)] pt-[calc(5rem+clamp(1rem,3vh,2rem))]">
        <div className="mx-auto flex w-full max-w-(--container-site) flex-1 flex-col">
          <Header />
          <div className="relative mt-6 flex min-h-0 flex-1 flex-col gap-4 lg:flex-row lg:gap-8">
            {/* art — slides; dot nav hangs off its left edge */}
            <div className="relative min-h-0 flex-1">
              <div className="absolute inset-0 overflow-hidden rounded-[20px]">
                {BEATS.map((b, i) => (
                  <div key={b.id} aria-hidden={i !== active} className="absolute inset-0 transition-transform duration-[600ms] will-change-transform" style={slide(i)}>
                    <BeatPanel beat={b} className="h-full" />
                  </div>
                ))}
              </div>
              <DotNav active={active} onJump={jump} />
            </div>
            {/* copy — slides in step with the art; fixed height on mobile so it clips */}
            <div className="relative h-[clamp(14rem,34vh,18rem)] shrink-0 overflow-hidden lg:h-auto lg:w-[38%] lg:self-stretch">
              {BEATS.map((b, i) => (
                <div key={b.id} aria-hidden={i !== active} className="absolute inset-0 flex flex-col justify-center transition-transform duration-[600ms] will-change-transform" style={slide(i)}>
                  <BeatCopy beat={b} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* sentinels — N equal bands the observer's centre line passes through */}
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
