"use client";

// The product tour, in the shape of Coinbase's feature carousel: one full-width dark panel,
// slides that snap horizontally, a product image on the left and the headline on the right,
// arrows bottom-right, a progress rail bottom-left. Scroll-snap does the work; the buttons and
// the rail just scroll the track.

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { PrimeButton, T } from "./prime-ui";

export type Slide = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  img: string;
  imgW: number;
  imgH: number;
  /** tall panels show their top in a fixed frame; wide ones sit inside it whole */
  fit: "top" | "contain";
  cta: string;
  href: string;
  soon?: boolean;
};

export function PrimeCarousel({ slides }: { slides: Slide[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const n = slides.length;

  // the active slide is the one whose left edge is nearest the track's scroll position
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let raf = 0;
    const read = () => {
      raf = 0;
      setI(Math.round(el.scrollLeft / el.clientWidth));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const go = (k: number) => {
    const el = track.current;
    if (!el) return;
    const next = Math.max(0, Math.min(n - 1, k));
    el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="relative overflow-hidden rounded-[24px] bg-[#232220] text-white">
      <div ref={track} className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-live="polite">
        {slides.map((s) => (
          <article key={s.id} className="grid w-full shrink-0 snap-start grid-cols-1 gap-8 px-7 pt-8 pb-24 md:grid-cols-12 md:items-center md:gap-10 md:px-12 md:pt-12 md:pb-28 lg:px-16">
            <div className="md:col-span-6">
              {/* one frame for every slide, so the panel keeps one height as the slides change.
                  The screen is a link to the screen it shows — see primeApp() in prime-data. */}
              <Link
                href={s.href}
                target={s.href.startsWith("#") ? undefined : "_blank"}
                rel={s.href.startsWith("#") ? undefined : "noopener noreferrer"}
                aria-label={`${s.title} — open in Prime`}
                className={`relative block aspect-[4/3] overflow-hidden rounded-[20px] bg-[#f7f6f6] shadow-[0_24px_60px_rgba(0,0,0,0.35)] transition-transform duration-300 hover:-translate-y-1 ${s.fit === "contain" ? "p-6 md:p-8" : ""}`}
              >
                <Image
                  src={s.img}
                  alt={`${s.title} in Arch Prime`}
                  width={s.imgW}
                  height={s.imgH}
                  loading="eager"
                  sizes="(min-width: 768px) 560px, 100vw"
                  className={s.fit === "top" ? "absolute inset-x-0 top-0 h-auto w-full" : "h-full w-full object-contain"}
                />
              </Link>
            </div>
            <div className="md:col-span-5 md:col-start-8">
              <p className={`${T.eyebrow} flex items-center gap-3 text-white/60`}>
                {s.eyebrow}
                {s.soon && <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] uppercase tracking-[0.08em] text-white/70">soon</span>}
              </p>
              <h3 className={`${T.h1} mt-5 text-white`}>{s.title}</h3>
              <p className={`${T.lead} mt-5 max-w-[440px] text-white/70`}>{s.body}</p>
              <span className="mt-8 flex">
                <PrimeButton href={s.href} color="#ffffff" ink="#232220">
                  {s.cta}
                </PrimeButton>
              </span>
            </div>
          </article>
        ))}
      </div>

      {/* rail + arrows */}
      <div className="pointer-events-none absolute inset-x-7 bottom-7 flex items-center justify-between md:inset-x-12 lg:inset-x-16">
        <div className="pointer-events-auto flex items-center gap-2 rounded-full bg-white/10 px-3 py-2.5" role="tablist" aria-label="Slides">
          {slides.map((s, k) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={k === i}
              aria-label={s.title}
              onClick={() => go(k)}
              className={`h-2 rounded-full transition-[width,background-color] duration-300 ${k === i ? "w-7 bg-white" : "w-2 bg-white/40 hover:bg-white/70"}`}
            />
          ))}
        </div>
        <div className="pointer-events-auto flex items-center gap-2">
          {[
            { d: "M15 6l-6 6 6 6", l: "Previous", k: i - 1, off: i === 0 },
            { d: "M9 6l6 6-6 6", l: "Next", k: i + 1, off: i === n - 1 },
          ].map((b) => (
            <button
              key={b.l}
              type="button"
              aria-label={b.l}
              disabled={b.off}
              onClick={() => go(b.k)}
              className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition-colors duration-200 hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-white/10"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d={b.d} />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
