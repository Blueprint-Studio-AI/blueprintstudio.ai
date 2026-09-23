"use client";

// THE JOURNEY — the hero and the coin are one section, because they are one circle.
//
// The page opens on the photograph full-bleed. That photograph is already inside a circle: it
// is just a circle wide enough to cover the viewport. As you scroll, the circle closes — the
// same element, shrinking — until it is a coin sitting to the right of the copy. Then the
// photograph blurs out of it and Bitcoin's own mark takes its place, the coin holds while three
// beats pass beside it, and at the end the bank rises and the coin drops in. One element, one
// continuous move, from the first frame to the deposit.
//
// Scroll and rAF write --p1..--p5 on the root and prime-v9.css does every transform (the
// HoneyB yield page's pattern: CSS owns the layout, JS only reads scroll). Below md, or under
// reduced motion, nothing pins: the hero is a plain band and the beats stack under the coin.

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Mark } from "@/components/prime-marks";
import { PrimeButton, T } from "@/components/prime-ui";

export type Beat = { label: string; h: string; body: string };

// [start, end] of each stage in the section's own scroll, 0..1
const STAGES: [number, number][] = [
  [0, 0.2], // the circle closes from full-bleed to a coin; the hero's words step back
  [0.22, 0.32], // the photograph blurs out and Bitcoin's mark arrives
  [0.42, 0.52], // beat 1 → 2
  [0.64, 0.74], // beat 2 → 3
  [0.84, 1], // the deposit
];

export function HeroCoin({
  hero,
  beats,
  deposit,
  photo,
  mobilePhoto,
  cta,
  ctaHref,
  ctaNote,
}: {
  hero: { h1: string; sub: string; secondary: string };
  beats: readonly Beat[];
  deposit: string;
  photo: string;
  mobilePhoto: string;
  cta: string;
  ctaHref: string;
  ctaNote: string;
}) {
  const root = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)");
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
      // stacked: the circle is already a coin, the beats are all out, nothing is deposited
      STAGES.forEach((_, k) => el.style.setProperty(`--p${k + 1}`, k === 4 ? "0" : "1"));
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

  const heroWords = (
    <>
      <Image src="/img/prime/arch-prime-logo-light.svg" alt="Arch Prime" width={172} height={24} priority className="h-6 w-auto opacity-90" />
      <h1 className={`${T.display} mt-8 max-w-[760px] text-balance text-[#eef0f0]`}>{hero.h1}</h1>
      <p className={`${T.lead} mt-6 max-w-[560px] text-balance text-white/80 sm:text-[22px] sm:leading-8`}>{hero.sub}</p>
      <span className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
        <PrimeButton href={ctaHref} size="xl">
          {cta}
        </PrimeButton>
        <a href="#what" className={`${T.body} text-white/85 underline-offset-4 hover:underline`}>
          {hero.secondary}
        </a>
      </span>
      <p className={`${T.label} mt-5 text-white/65`}>{ctaNote}</p>
    </>
  );

  const theCircle = (
    <div className="v9-circle relative shrink-0 overflow-hidden rounded-full">
      <Image src={photo} alt="" width={2736} height={1536} priority className="v9-circle-photo" />
      <Mark kind="btc" className="v9-circle-mark absolute inset-0 h-full w-full" />
    </div>
  );

  const theBeats: ReactNode = beats.map((b, i) => (
    <div key={b.h} className={`v9-beat v9-beat-${i + 1}`}>
      <p className={`${T.label} text-[#6e6e6e]`}>{b.label}</p>
      <h2 className={`${T.h2} mt-4 text-balance`}>{b.h}</h2>
      <p className={`${T.lead} mt-5 max-w-[460px] text-[#5c5c5c]`}>{b.body}</p>
    </div>
  ));

  // ---- stacked: a plain hero band, then the coin with the beats under it ------------------
  if (!pinned) {
    return (
      <section ref={root} id="top" className="v9-journey">
        <header data-nav-theme="dark" className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-[4%] pt-28 pb-20 text-center">
          <Image src={mobilePhoto} alt="" fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-[#0d2249]/35" />
          <div className="relative flex flex-col items-center">{heroWords}</div>
        </header>
        <div ref={frame} className="bg-[var(--p-subtle)] px-[4%] py-20">
          <div className="mx-auto flex w-full max-w-[520px] flex-col items-center">
            <div className="v9-circle-box">{theCircle}</div>
            <div className="mt-12 w-full">{theBeats}</div>
          </div>
        </div>
      </section>
    );
  }

  // ---- pinned: one circle, from full-bleed photograph to deposited coin ------------------
  return (
    <section ref={root} id="top" data-nav-theme="dark" className="v9-journey relative h-[720svh] bg-[var(--p-subtle)]">
      <div ref={frame} className="sticky top-0 flex h-svh items-center justify-center overflow-hidden">
        {/* the circle, centred; it closes and then slides to the right of the copy */}
        <div className="v9-circle-box pointer-events-none absolute top-1/2 left-1/2">{theCircle}</div>

        {/* the hero's words, over the photograph while it still fills the screen */}
        <div className="v9-hero site-container relative flex flex-col items-center text-center">{heroWords}</div>

        {/* the beats, to the left of the coin once it has formed */}
        <div className="v9-beats site-container absolute inset-x-0 top-1/2 -translate-y-1/2">
          <div className="relative lg:w-[42%]">{theBeats}</div>
        </div>

        {/* the deposit */}
        <div aria-hidden className="v9-bank pointer-events-none absolute inset-x-0 bottom-0 flex justify-center">
          <div className="relative h-[52svh] w-[min(820px,94vw)]">
            <Image src="/img/prime/borrow-bank.webp" alt="" fill sizes="820px" className="object-contain object-bottom" />
          </div>
        </div>
        <p aria-hidden className={`${T.label} v9-deposit absolute inset-x-0 bottom-8 text-center text-[#6e6e6e]`}>
          {deposit}
        </p>
      </div>
    </section>
  );
}
