"use client";

// What you can do, as a skyline instead of a paragraph: four of the brand's building cutouts, all
// the same height, all in black and white, on one hairline baseline. The chosen one stands in full
// ink and rises a few pixels, with a short Arch-orange mark on the baseline under it; the others
// wait at a third of the ink. One plain line below says what it does. Earn is chosen on load, so
// the line is never empty. Pointing previews, clicking (or the arrow keys) chooses; nothing moves
// on its own except a single entrance, the buildings rising onto the baseline once. The one that
// isn't built yet stays dim, never rises, never takes the mark: scaffolding reads as "being built".
// The ones still running on test tokens say so (· Preview); only Trade runs on real assets today.

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";

export type Thing = { id: string; name: string; line: string; status: "live" | "preview" | "soon" };

const ART: Record<string, { src: string; w: number; h: number }> = {
  earn: { src: "/img/prime/v7/b-earn.webp", w: 712, h: 455 },
  borrow: { src: "/img/prime/v7/b-borrow.webp", w: 716, h: 476 },
  trade: { src: "/img/prime/v7/b-trade.webp", w: 900, h: 557 },
  boost: { src: "/img/prime/v7/b-boost.webp", w: 385, h: 647 },
};

export function Skyline({ items, soonLabel, previewLabel }: { items: readonly Thing[]; soonLabel: string; previewLabel: string }) {
  const [chosen, setChosen] = useState(0);
  const [preview, setPreview] = useState<number | null>(null);
  const [entered, setEntered] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setEntered(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const shown = preview ?? chosen;
  const current = items[shown];

  const onKey = (e: KeyboardEvent) => {
    const last = items.length - 1;
    const to = e.key === "ArrowRight" ? Math.min(last, chosen + 1) : e.key === "ArrowLeft" ? Math.max(0, chosen - 1) : e.key === "Home" ? 0 : e.key === "End" ? last : null;
    if (to === null) return;
    e.preventDefault();
    setChosen(to);
    tabs.current[to]?.focus();
  };

  return (
    <div ref={root}>
      <div role="tablist" aria-label="What you can do" onKeyDown={onKey} onMouseLeave={() => setPreview(null)} className="grid grid-cols-4 gap-2 sm:gap-6">
        {items.map((it, i) => {
          const art = ART[it.id];
          const on = i === shown;
          const soon = it.status === "soon";
          const lit = on && !soon;
          return (
            <button
              key={it.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              role="tab"
              id={`sky-${it.id}`}
              aria-selected={i === chosen}
              aria-controls="sky-line"
              tabIndex={i === chosen ? 0 : -1}
              onClick={() => {
                setChosen(i);
                setPreview(null);
              }}
              onPointerEnter={(e) => e.pointerType === "mouse" && setPreview(i)}
              className="group relative flex cursor-pointer flex-col items-stretch text-left outline-none"
            >
              <span className="relative flex h-[72px] items-end justify-center sm:h-[132px] lg:h-[184px]">
                <span
                  className="flex h-full w-full items-end justify-center transition-[transform,opacity] duration-500 ease-[var(--ease-out)] motion-reduce:transition-none"
                  style={{
                    transform: entered ? (lit ? "translateY(-6px)" : "translateY(0)") : "translateY(18px)",
                    opacity: entered ? (lit ? 1 : 0.3) : 0,
                    transitionDelay: entered && preview === null ? `${i * 60}ms` : "0ms",
                  }}
                >
                  <Image src={art.src} alt="" width={art.w} height={art.h} sizes="(min-width: 992px) 300px, 25vw" className="h-full w-full object-contain object-bottom grayscale" />
                </span>
              </span>
              {/* the baseline, and the mark on it under the chosen building */}
              <span aria-hidden className="relative block h-px w-full bg-black/15">
                <span className="absolute inset-x-[30%] -top-px block h-[3px] rounded-full bg-[var(--p-orange)] transition-opacity duration-300" style={{ opacity: lit ? 1 : 0 }} />
              </span>
              <span className={`mt-4 text-[15px] leading-5 font-medium tracking-[-0.01em] transition-colors duration-300 sm:text-[18px] sm:leading-6 ${on ? "text-[var(--p-ink)]" : "text-[#8c8c8c] group-hover:text-[#4d4d4d]"}`}>
                {it.name}
                {(soon || it.status === "preview") && (
                  <span className="block font-normal text-[#8c8c8c] sm:inline">
                    <span className="hidden sm:inline"> · </span>
                    {soon ? soonLabel : previewLabel}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      <p id="sky-line" role="tabpanel" aria-labelledby={`sky-${items[chosen].id}`} className="mt-10 min-h-[72px] max-w-[680px] font-serif text-[26px] leading-9 tracking-[-0.02em] text-balance text-[var(--p-ink)] sm:text-[32px] sm:leading-10">
        <span key={current.id} className="v7-fade inline-block">
          {current.line}
        </span>
      </p>
    </div>
  );
}
