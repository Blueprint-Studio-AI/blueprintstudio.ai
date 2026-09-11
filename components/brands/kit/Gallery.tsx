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
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Sample } from "@/components/brands/kit/types";

export default function Gallery({ items }: { items: Sample[] }) {
  const section = useRef<HTMLElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  const nudge = (dir: -1 | 1) => {
    rail.current?.scrollBy({ left: dir * (682 + 64), behavior: "smooth" });
  };

  /**
   * Scroll card `i` to the rail's leading edge.
   *
   * Deliberately NOT scrollIntoView: that scrolls every scrollable ancestor,
   * so clicking a card would also yank the PAGE to centre the rail. Setting
   * scrollLeft on the rail alone moves the card and nothing else.
   */
  const bring = (i: number) => {
    const el = rail.current;
    const card = el?.children[i] as HTMLElement | undefined;
    if (!el || !card) return;
    // offsetLeft is relative to the rail's padding box, and the rail's left
    // padding is the deliberate inset — subtracting it keeps the card sitting
    // where the first card sits at rest, rather than jammed against the edge.
    const inset = parseFloat(getComputedStyle(el).paddingLeft) || 0;
    el.scrollTo({ left: Math.max(0, card.offsetLeft - inset), behavior: "smooth" });
  };

  // Rewind the rail once it's fully out of frame, so scrolling back to a section
  // finds it at the start with its caret restored — rather than parked wherever
  // it was left, which reads as a half-used control.
  useEffect(() => {
    const host = section.current;
    const el = rail.current;
    if (!host || !el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting || el.scrollLeft === 0) return;
        // "instant" is load-bearing: the rail carries `scroll-smooth`, and a
        // smooth rewind would still be animating when you scroll back to it.
        el.scrollTo({ left: 0, behavior: "instant" });
        setScrolled(false);
      },
      { threshold: 0 },
    );
    io.observe(host);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={section} className="pb-24 pt-16">
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
          // py-7/-my-7 is a clipping fix, not spacing: setting overflow-x makes
          // overflow-y compute to auto, so a card's hover lift and shadow would
          // be cropped by the rail (and could trip a vertical scrollbar). The
          // padding gives them room inside the scroll box; the equal negative
          // margin pulls the box back so the section's rhythm is untouched.
          className="no-scrollbar -my-7 flex items-center gap-16 overflow-x-auto scroll-smooth py-7 pl-[calc(var(--edge)_+_128px)] pr-[calc(var(--edge)_+_184px)] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ink max-[860px]:gap-6 max-[860px]:pl-edge max-[860px]:pr-12"
        >
          {items.map((s, i) => (
            <figure key={s.src} className="m-0 shrink-0">
              {/* Clicking a card pulls it into frame. Scrolling was the only way
                  to reach the rail's tail, which meant a half-visible card at the
                  edge looked interactive but wasn't. A real <button> keeps it on
                  the keyboard path and gives it a name. */}
              <button
                type="button"
                onClick={() => bring(i)}
                aria-label={`Show ${s.alt}`}
                // Same gesture as the paint chips, scaled to the object: a chip
                // is 149px and lifts 16, a card is 383px and lifts 6. Any more
                // and a frame this size reads as floating rather than nudged.
                className="block cursor-pointer rounded-2xl transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(.2,.8,.2,1)] hover:-translate-y-1.5 hover:shadow-[0_16px_36px_-14px_rgba(20,22,31,0.30)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink max-[860px]:hover:translate-y-0 max-[860px]:hover:shadow-none"
              >
                {/* the samples are 3840x2160 originals — resize/re-encode them */}
                <Image
                  src={s.src}
                  alt={s.alt}
                  width={1364}
                  height={766}
                  sizes="(max-width: 860px) 82vw, 682px"
                  className="h-[383px] w-[682px] max-w-[82vw] rounded-2xl bg-[#f4f1eb] object-cover max-[860px]:h-[240px] max-[860px]:w-[82vw]"
                />
              </button>
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
