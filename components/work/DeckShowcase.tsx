"use client";

import Image from "next/image";
import type { DeckSlide, ShowcaseData } from "@/lib/work";
import { Caption, Stage, useActiveFrame } from "./Showcase";

// /work/decks: a deck's cover large, its slides under it. Picking a slide
// shows it in the big frame (the same crossfade as the showcase's stills).
// Slides with confidential figures or names are blurred in the image files
// themselves; a note says so.

const NOTE = "Details blurred for confidentiality";

function BlurNote({ className = "" }: { className?: string }) {
  return (
    <span
      className={`pointer-events-none absolute z-10 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-medium leading-none text-white backdrop-blur-md ${className}`}
    >
      {NOTE}
    </span>
  );
}

export default function DeckShowcase({
  data,
  eager = false,
}: {
  data: ShowcaseData & { slides: (DeckSlide & { frame: string })[]; coverBlurred: boolean };
  eager?: boolean;
}) {
  const { active, picked, pick } = useActiveFrame(data);
  const activeSlide = data.slides.find((s) => s.frame === active);
  const blurred = activeSlide ? activeSlide.blurred : data.coverBlurred;

  return (
    <article id={data.id} aria-label={data.title} className="scroll-mt-24">
      <div className="group/project relative">
        <div className="group/stage relative">
          <Stage data={data} active={active} picked={picked} eager={eager} frameClassName="aspect-video" sizes="(min-width: 1480px) 1420px, 96vw" />
          {blurred && <BlurNote className="bottom-3 left-3 lg:bottom-4 lg:left-4" />}
        </div>
        <div className="relative z-20 mt-2 grid grid-cols-2 gap-2 sm:mt-3 sm:gap-3 lg:grid-cols-4 lg:gap-5">
          {data.slides.map((slide) => {
            const on = slide.frame === active;
            return (
              <button
                key={slide.frame}
                type="button"
                aria-pressed={on}
                aria-label={`Show ${slide.alt}`}
                onClick={() => pick(on ? data.initial : slide.frame)}
                className="group/still relative block w-full cursor-pointer overflow-hidden rounded-[10px] bg-[#EDEDEC] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB] lg:rounded-[14px]"
              >
                <span className="relative block aspect-video">
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    quality={85}
                    sizes="(min-width: 1024px) 24vw, 47vw"
                    className="object-cover transition-transform [transition-duration:700ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover/still:scale-[1.03] motion-reduce:transform-none"
                  />
                </span>
                <span
                  aria-hidden
                  className={`pointer-events-none absolute inset-0 rounded-[10px] ring-inset transition-shadow duration-300 lg:rounded-[14px] ${on ? "ring-2 ring-black/70" : "ring-1 ring-black/[0.06]"}`}
                />
                {slide.blurred && <BlurNote className="bottom-2 left-2 hidden px-2 text-[10px] sm:block" />}
              </button>
            );
          })}
        </div>
        <Caption data={data} active={active} as="h2" className="pt-5 lg:pt-7" />
      </div>
    </article>
  );
}
