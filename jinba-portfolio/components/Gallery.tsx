"use client";

// Design in context (Figma 296:927) — an unlabelled horizontal rail.
//
// Spacing is 1:1 with the Figma: section pt 64 / pb 96, 64px between cards,
// 682x383 cards. The rail is deliberately recessed on both sides — the first
// card sits a caret (64) + gap (64) in from the content edge, and the last stops
// 184 short of it. That inset is the affordance: it shows the row has somewhere
// to go. The rail itself is full-bleed and only *padded* to those insets, so the
// cards still travel the whole viewport once you scroll, and the caret (which
// rides on top at the content edge) fades as soon as the rail moves.
import { useRef, useState } from "react";
import Image from "next/image";
import type { Sample } from "@/lib/data";

export default function Gallery({ items }: { items: Sample[] }) {
  const rail = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  const nudge = (dir: -1 | 1) => {
    rail.current?.scrollBy({ left: dir * (682 + 64), behavior: "smooth" });
  };

  return (
    <section className="pb-24 pt-16">
      <div className="relative">
        {/* tabIndex makes the rail itself focusable, so arrow keys scroll it.
            Without it the caret is the only control, and the caret fades on
            scroll by design — leaving a keyboard user unable to reach anything
            past the first frame. */}
        <div
          ref={rail}
          tabIndex={0}
          role="group"
          aria-label="Design in context — use arrow keys to scroll"
          onScroll={(e) => setScrolled(e.currentTarget.scrollLeft > 8)}
          className="no-scrollbar flex items-center gap-16 overflow-x-auto scroll-smooth pl-[calc(var(--edge)_+_128px)] pr-[calc(var(--edge)_+_184px)] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ink max-[860px]:gap-6 max-[860px]:pl-edge max-[860px]:pr-12"
        >
          {items.map((s) => (
            <figure key={s.src} className="m-0 shrink-0">
              {/* the samples are 3840x2160 originals — resize/re-encode them */}
              <Image
                src={s.src}
                alt={s.alt}
                width={1364}
                height={766}
                sizes="(max-width: 860px) 82vw, 682px"
                className="h-[383px] w-[682px] max-w-[82vw] rounded-2xl bg-[#f4f1eb] object-cover max-[860px]:h-[240px] max-[860px]:w-[82vw]"
              />
            </figure>
          ))}
        </div>

        <button
          onClick={() => nudge(-1)}
          aria-label="Previous"
          aria-hidden={scrolled}
          tabIndex={scrolled ? -1 : 0}
          style={{ left: "var(--edge)" }}
          className={`absolute top-1/2 flex h-[49px] w-16 -translate-y-1/2 items-center justify-center text-muted-3 transition-opacity duration-500 ease-out hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink max-[860px]:hidden ${
            scrolled ? "pointer-events-none opacity-0" : "cursor-pointer opacity-100"
          }`}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M15 4L7 12l8 8" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </section>
  );
}
