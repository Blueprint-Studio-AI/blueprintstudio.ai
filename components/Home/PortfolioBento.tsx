"use client";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  MotionConfig,
  animate,
  motion,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { ArrowRight, Pause, Play } from "lucide-react";
import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import {
  allWorkProjects,
  featuredWork,
  type Deliverable,
  type MediaAsset,
  type PortfolioProject,
} from "@/data/portfolioData";
import { hasWorkPage, mediaFor, projectsFor } from "@/lib/work";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { SpringText, type VariantKey } from "./HeroSelector";

// Featured Work follows the hero's picker, and can set it: both send and
// listen for window "bp:variant" events carrying { key, source }.

// Portfolio videos stay unloaded until the hero reel has landed (it sends
// "bp:opening-landed"), so they don't compete with it. Then they load in page
// order, two at a time. A card that comes near the screen loads straight away.
type Waiter = { start: () => void; started: boolean };
const waiting: Waiter[] = [];
const MAX_LOADING = 2;
let released = false;
let loading = 0;

function pump() {
  while (released && loading < MAX_LOADING) {
    const next = waiting.find((w) => !w.started);
    if (!next) return;
    next.started = true;
    loading++;
    next.start();
  }
}

if (typeof window !== "undefined") {
  window.addEventListener(
    "bp:opening-landed",
    () => {
      released = true;
      pump();
    },
    { once: true }
  );
}

type Filter = VariantKey | null;

const FILTERS: { key: Filter; label: string }[] = [
  { key: null, label: "All work" },
  { key: "apps", label: "Apps" },
  { key: "websites", label: "Websites" },
  { key: "brands", label: "Brands" },
  { key: "launch-videos", label: "Launch videos" },
];

// The hero says "brands"; the work pages say "branding".
const DELIVERABLE: Record<VariantKey, Deliverable> = {
  apps: "apps",
  websites: "websites",
  brands: "branding",
  "launch-videos": "launch-videos",
};

const SEE_ALL: Record<"all" | VariantKey, string> = {
  all: "See all work",
  apps: "See all app work",
  websites: "See all website work",
  brands: "See all brand work",
  "launch-videos": "See all launch videos",
};

const MAX_CARDS = 6;
const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const LAYOUT_SPRING = { type: "spring", visualDuration: 0.55, bounce: 0.12 } as const;
const CHIP_SPRING = { type: "spring", visualDuration: 0.4, bounce: 0.18 } as const;
const SIZES = "(min-width: 1124px) 470px, (min-width: 640px) 45vw, 92vw";

function filterFromUrl(): Filter {
  const key = new URLSearchParams(window.location.search).get("for");
  return FILTERS.find((f) => f.key !== null && f.key === key)?.key ?? null;
}

type Card = { project: PortfolioProject; media: MediaAsset; href: string };

function cardsFor(filter: Filter): Card[] {
  const ids = featuredWork[filter ? DELIVERABLE[filter] : "all"];
  return ids
    .flatMap((id) => {
      const project = allWorkProjects.find((p) => p.id === id);
      if (!project) return [];
      // Under "All work" a card takes its first kind of work (Perena: websites) for its media and link.
      const as = filter ? DELIVERABLE[filter] : project.deliverables.find((d) => hasWorkPage(d)) ?? project.deliverables[0];
      // The /brands pages are the case studies; they fit "All work" and Brands.
      const caseStudy = project.brandPage && (filter === null || filter === "brands");
      const href = caseStudy
        ? `/brands/${project.brandPage}`
        : hasWorkPage(as)
          ? `/work/${as}#${project.id}`
          : "/work";
      return [{ project, media: mediaFor(project, as).desktop, href }];
    })
    .slice(0, MAX_CARDS);
}

function seeAllFor(filter: Filter) {
  const slug = filter ? DELIVERABLE[filter] : null;
  return {
    label: SEE_ALL[filter ?? "all"],
    href: slug && hasWorkPage(slug) ? `/work/${slug}` : "/work",
    count: slug ? projectsFor(slug).length : null,
  };
}

/** A card's reel or still in a 16:10 frame; the reel fades in over its poster once it plays. */
function CardMedia({ media }: { media: MediaAsset }) {
  const reduce = usePrefersReducedMotion(); // false on the server and first render, so hydration matches
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const slotRef = useRef(false); // holds one of the MAX_LOADING slots
  const isVideo = media.type === "video";
  const still = isVideo ? media.poster : media.src;
  const [queued, setQueued] = useState(false);
  const [inView, setInView] = useState(false);
  const [shown, setShown] = useState(false);
  const [playing, setPlaying] = useState(false);
  // The visitor's own play/pause wins over scrolling in and out of view.
  const [choice, setChoice] = useState<"auto" | "play" | "pause">("auto");

  // Buffered enough (or gave up, or the card left): hand the slot to the next video.
  const freeSlot = useCallback(() => {
    if (!slotRef.current) return;
    slotRef.current = false;
    loading--;
    pump();
  }, []);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || !isVideo || reduce) return;
    const waiter: Waiter = {
      started: false,
      start: () => {
        slotRef.current = true;
        setQueued(true);
      },
    };
    waiting.push(waiter);
    pump();
    const near = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        near.disconnect();
        if (waiter.started) return;
        waiter.started = true; // jumps the queue without taking a slot
        setQueued(true);
      },
      { rootMargin: "100% 0px" }
    );
    near.observe(frame);
    return () => {
      near.disconnect();
      const i = waiting.indexOf(waiter);
      if (i !== -1) waiting.splice(i, 1);
      freeSlot();
    };
  }, [isVideo, reduce, freeSlot]);

  // Play only while on screen.
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || !isVideo) return;
    const seen = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.1 });
    seen.observe(frame);
    return () => seen.disconnect();
  }, [isVideo]);

  // With reduced motion a reel neither plays nor downloads until asked to.
  const src = isVideo && (choice === "play" || (queued && !reduce)) ? media.src : undefined;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;
    if (inView && (choice === "play" || (choice === "auto" && !reduce))) video.play().catch(() => {});
    else video.pause();
  }, [src, inView, choice, reduce]);

  return (
    <div className="relative">
      <div
        ref={frameRef}
        className="relative isolate aspect-[16/10] overflow-hidden rounded-[14px] bg-neutral-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-shadow duration-500 group-hover/card:shadow-[0_18px_40px_-20px_rgba(0,0,0,0.35)]"
      >
        <div className="absolute inset-0 transition-transform [transition-duration:900ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover/card:scale-[1.03] motion-reduce:transform-none">
          {/* Posters are a frame of a reel that replaces them; stills are the work itself. */}
          {still && <Image src={still} alt={media.alt} fill sizes={SIZES} quality={isVideo ? 75 : 85} className="object-cover" />}
          {isVideo && (
            <video
              ref={videoRef}
              src={src}
              muted
              loop
              playsInline
              preload={src ? "auto" : "none"}
              aria-hidden="true"
              onLoadedMetadata={(e) => {
                // Start on the strong stretch, or the poster's frame.
                const from = media.clip?.[0] ?? media.posterTime;
                if (from) e.currentTarget.currentTime = from;
              }}
              onTimeUpdate={(e) => {
                // Loop just the clip; this also catches the browser's own loop back to 0.
                const t = e.currentTarget.currentTime;
                if (media.clip && (t < media.clip[0] - 0.25 || t >= media.clip[1])) e.currentTarget.currentTime = media.clip[0];
              }}
              onPlaying={() => {
                setShown(true);
                setPlaying(true);
              }}
              onPause={() => setPlaying(false)}
              onCanPlayThrough={freeSlot}
              onSuspend={freeSlot}
              onError={freeSlot}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out ${
                shown ? "opacity-100" : "opacity-0"
              }`}
            />
          )}
        </div>
        <div className="pointer-events-none absolute inset-0 rounded-[14px] ring-1 ring-inset ring-black/[0.06]" />
      </div>

      {/* Shown on hover; on touch screens only when it's needed to start the reel. */}
      {isVideo && (
        <button
          type="button"
          onClick={() => setChoice(playing ? "pause" : "play")}
          aria-label={playing ? "Pause video" : "Play video"}
          className={`absolute bottom-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-[opacity,background-color] duration-200 hover:bg-black/60 focus-visible:opacity-100 ${
            !playing && (reduce || choice === "pause")
              ? "opacity-100"
              : "opacity-0 [@media(hover:hover)]:group-hover/card:opacity-100 [@media(hover:none)]:pointer-events-none"
          }`}
        >
          {playing ? <Pause className="h-3 w-3" fill="currentColor" /> : <Play className="h-3 w-3 translate-x-px" fill="currentColor" />}
        </button>
      )}
    </div>
  );
}

// A card's line: the description up to its first full stop or colon. The rest
// is for the project's own page.
function summary(description: string) {
  const first = description.split(/\.\s|:\s/)[0].trim().replace(/\.$/, "");
  return `${first}.`;
}

function WorkCard({ card }: { card: Card }) {
  const { project, media, href } = card;
  const [name, ...rest] = project.title.split(" — ");
  return (
    <article className="group/card relative">
      <AnimatePresence initial={false} mode="popLayout">
        {/* A filter can swap the media (Jinba's site for its brand): crossfade it. */}
        <motion.div
          key={media.src}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: EASE_OUT }}
        >
          <CardMedia media={media} />
        </motion.div>
      </AnimatePresence>
      <div className="flex items-start justify-between gap-4 px-0.5 pt-4">
        <div className="min-w-0">
          <h3 className="text-[16px] font-medium leading-[1.3] tracking-[-0.015em] text-neutral-900">
            {/* The whole card is the link. */}
            <Link
              href={href}
              className="outline-none after:absolute after:inset-[-6px] after:rounded-[18px] after:content-[''] focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-[#2563EB]"
            >
              {name}
              {rest.length > 0 && <span className="text-neutral-500"> {rest.join(" — ")}</span>}
            </Link>
          </h3>
          <p className="mt-1 line-clamp-3 text-[14px] leading-[1.45] text-neutral-500">{summary(project.description)}</p>
        </div>
        <ArrowRight
          aria-hidden
          className="mt-[3px] h-4 w-4 shrink-0 text-neutral-400 transition-[color,transform] duration-300 ease-out group-hover/card:translate-x-0.5 group-hover/card:text-neutral-900"
        />
      </div>
    </article>
  );
}

/** Quiet chips with one indicator that slides to the picked one; a softer one follows the pointer. */
function Chips({ value, onPick }: { value: Filter; onPick: (key: Filter) => void }) {
  const reduce = usePrefersReducedMotion();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<{ key: string; on: boolean } | null>(null);
  const [edges, setEdges] = useState({ left: false, right: false });

  // On phones the row scrolls sideways; fade whichever edge has more chips past it.
  const measure = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const left = el.scrollLeft > 1;
    const right = el.scrollLeft + el.clientWidth < el.scrollWidth - 1;
    setEdges((prev) => (prev.left === left && prev.right === right ? prev : { left, right }));
  }, []);
  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  // Bring the picked chip into the row's view, even when the hero picked it.
  useEffect(() => {
    const el = scrollerRef.current;
    const chip = el?.querySelector<HTMLElement>(`[data-key="${value ?? "all"}"]`);
    if (!el || !chip || el.scrollWidth <= el.clientWidth) return;
    el.scrollTo({ left: chip.offsetLeft - (el.clientWidth - chip.offsetWidth) / 2, behavior: reduce ? "auto" : "smooth" });
  }, [value, reduce]);

  const fade = (on: boolean, at: string) => `${on ? "transparent" : "#000"} ${at}`;
  const mask = `linear-gradient(to right, ${fade(edges.left, "0")}, #000 28px, #000 calc(100% - 28px), ${fade(edges.right, "100%")})`;

  return (
    <motion.div
      ref={scrollerRef}
      layoutScroll
      onScroll={measure}
      className="no-scrollbar relative -mx-2.5 overflow-x-auto px-2.5 sm:mx-0 sm:px-0"
      style={{ maskImage: mask, WebkitMaskImage: mask }}
    >
      <div
        role="group"
        aria-label="Show work"
        className="mx-auto flex w-max items-center gap-0.5 py-1"
        onPointerLeave={() => setHover((h) => (h ? { ...h, on: false } : h))}
      >
        {FILTERS.map((filter) => {
          const id = filter.key ?? "all";
          const active = filter.key === value;
          return (
            <motion.button
              key={id}
              type="button"
              data-key={id}
              aria-pressed={active}
              onClick={() => onPick(filter.key)}
              onPointerEnter={(e) => e.pointerType === "mouse" && setHover({ key: id, on: true })}
              whileTap={{ scale: 0.96 }}
              className={`relative h-9 shrink-0 cursor-pointer whitespace-nowrap rounded-full px-3 text-[15px] font-medium sm:px-4 tracking-[-0.01em] outline-none transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#2563EB] ${
                active ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              {hover?.key === id && !active && (
                <motion.span
                  layoutId="work-chip-hover"
                  aria-hidden
                  className="absolute inset-0 rounded-full bg-black/[0.04]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hover.on ? 1 : 0 }}
                  transition={{ ...CHIP_SPRING, opacity: { duration: 0.2 } }}
                />
              )}
              {active && (
                <motion.span
                  layoutId="work-chip"
                  aria-hidden
                  className="absolute inset-0 rounded-full bg-black/[0.07]"
                  transition={CHIP_SPRING}
                />
              )}
              <span className="relative">{filter.label}</span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

/**
 * The cards, and the link to the rest. Cards that stay glide to their new
 * places; the rest blur out and in. The box's height springs to fit, so the
 * page below follows smoothly instead of jumping.
 */
function WorkGrid({ filter }: { filter: Filter }) {
  const reduce = usePrefersReducedMotion();
  const cards = cardsFor(filter);
  const seeAll = seeAllFor(filter);
  // An odd number of cards leaves a gap in the two-column grid: the link fills it.
  const tile = cards.length % 2 === 1;

  const innerRef = useRef<HTMLDivElement>(null);
  const height = useMotionValue(-1);
  const heightStyle = useTransform(height, (h) => (h < 0 ? "auto" : h));
  const animating = useRef(false);
  const first = useRef(true);

  useLayoutEffect(() => {
    const inner = innerRef.current;
    if (!inner) return;
    const observer = new ResizeObserver(() => {
      if (!animating.current) height.jump(inner.offsetHeight);
    });
    observer.observe(inner);
    return () => observer.disconnect();
  }, [height]);

  useLayoutEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const inner = innerRef.current;
    if (!inner) return;
    const to = inner.offsetHeight;
    if (reduce || height.get() < 0) {
      height.jump(to);
      return;
    }
    animating.current = true;
    const controls = animate(height, to, {
      ...LAYOUT_SPRING,
      onComplete: () => {
        animating.current = false;
        height.jump(inner.offsetHeight);
      },
    });
    return () => controls.stop();
  }, [filter, reduce, height]);

  const enter = reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, filter: "blur(10px)" };
  // Leaving cards drop beneath the ones gliding into place.
  const exit = reduce
    ? { opacity: 0, transition: { duration: 0.15 } }
    : { opacity: 0, scale: 0.96, filter: "blur(10px)", zIndex: 0, transition: { duration: 0.2, ease: EASE_OUT, zIndex: { duration: 0 } } };
  const shown = { opacity: 1, scale: 1, filter: "blur(0px)", transitionEnd: { filter: "none" } };

  return (
    // Padding inside the clip keeps focus rings and hover shadows clear of its edge.
    <motion.div style={{ height: heightStyle }} className="-mx-3 overflow-hidden">
      <div ref={innerRef} className="px-3 pb-3 pt-1">
        <div className="relative grid grid-cols-1 gap-x-5 gap-y-9 sm:grid-cols-2 sm:gap-y-10 lg:gap-x-6 lg:gap-y-12">
          <AnimatePresence initial={false} mode="popLayout">
            {cards.map((card, i) => (
              <motion.div
                key={card.project.id}
                layout
                initial={enter}
                animate={shown}
                exit={exit}
                transition={{ layout: LAYOUT_SPRING, default: { duration: 0.5, ease: EASE_OUT, delay: 0.06 + i * 0.045 } }}
                className="relative z-[1]"
              >
                <WorkCard card={card} />
              </motion.div>
            ))}
            {tile && (
              <motion.div
                key={`see-all-${seeAll.href}`}
                layout
                initial={enter}
                animate={shown}
                exit={exit}
                transition={{ layout: LAYOUT_SPRING, default: { duration: 0.5, ease: EASE_OUT, delay: 0.06 + cards.length * 0.045 } }}
                className="relative z-[1] hidden sm:block"
              >
                <Link
                  href={seeAll.href}
                  className="group/tile flex aspect-[16/10] flex-col items-center justify-center gap-1.5 rounded-[14px] border border-dashed border-neutral-300 text-center outline-none transition-colors duration-300 hover:border-neutral-400 hover:bg-white/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
                >
                  <span className="inline-flex items-center gap-1.5 text-[15px] font-medium tracking-[-0.01em] text-neutral-900">
                    {seeAll.label}
                    <ArrowRight aria-hidden className="h-4 w-4 transition-transform duration-300 ease-out group-hover/tile:translate-x-0.5" />
                  </span>
                  {seeAll.count !== null && (
                    <span className="font-mono text-[11px] tabular-nums text-neutral-500">{seeAll.count} projects</span>
                  )}
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Under the grid, unless the tile above has it (phones always show it here).
            It glides with the cards rather than jumping ahead of them. */}
        <motion.div
          key={tile ? "under-tile" : "under"}
          layout="position"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ layout: LAYOUT_SPRING, opacity: { duration: 0.3, delay: 0.15 } }}
          className={`flex justify-center pt-10 sm:pt-12 ${tile ? "sm:hidden" : ""}`}
        >
          <Link
            href={seeAll.href}
            className="group/all inline-flex h-11 items-center gap-2 rounded-full border border-neutral-300 bg-white pl-5 pr-4 text-[15px] font-medium tracking-[-0.01em] text-neutral-900 outline-none transition-colors duration-200 hover:border-neutral-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
          >
            <SpringText text={seeAll.label} />
            <ArrowRight aria-hidden className="h-4 w-4 transition-transform duration-300 ease-out group-hover/all:translate-x-0.5" />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function PortfolioBento() {
  const [filter, setFilter] = useState<Filter>(null);
  // Bumped to remount the grid without animating, for a ?for= link.
  const [epoch, setEpoch] = useState(0);

  useEffect(() => {
    const initial = filterFromUrl();
    if (initial) {
      setFilter(initial);
      setEpoch((n) => n + 1);
    }
    const onVariant = (e: Event) => {
      const { key, source } = (e as CustomEvent<{ key: Filter; source: string }>).detail;
      if (source !== "work") setFilter(key);
    };
    window.addEventListener("bp:variant", onVariant);
    return () => window.removeEventListener("bp:variant", onVariant);
  }, []);

  const pick = (key: Filter) => {
    if (key === filter) return;
    setFilter(key);
    window.dispatchEvent(new CustomEvent("bp:variant", { detail: { key, source: "work" } }));
    const url = new URL(window.location.href);
    if (key) url.searchParams.set("for", key);
    else url.searchParams.delete("for");
    window.history.replaceState(window.history.state, "", url);
    (window as { gtag?: (...args: unknown[]) => void }).gtag?.("event", "work_filter", { filter: key ?? "all" });
  };

  const label = FILTERS.find((f) => f.key === filter)!.label;

  return (
    <Section className="flex flex-col relative z-20 bg-neutral-100">
      <div className="absolute inset-0 flex justify-center pointer-events-none px-2.5 sm:px-[60px]">
        <div className="w-full flex-1 flex justify-center relative">
          <div className="absolute left-0 top-0 bottom-0 line-dash-y custom:hidden" />
          <div className="absolute left-0 top-0 bottom-0 w-px bg-neutral-300 hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y custom:hidden" />
          <div className="absolute right-0 top-0 bottom-0 w-px bg-neutral-300 hidden custom:block" />
        </div>
      </div>

      <SectionHeader leftText="PORTFOLIO" rightText="design / dev" />

      <OuterContainer className="flex-1">
        <InnerContainer className="relative px-2.5 pb-14 pt-8 sm:px-6 sm:pb-20 sm:pt-12 lg:pb-24 lg:pt-16">
          <div className="absolute left-0 top-0 bottom-0 line-dash-y hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y hidden custom:block" />

          <h2
            className="font-medium text-black text-center cursor-default"
            style={{
              fontSize: "clamp(32px, 6vw, 48px)",
              lineHeight: "clamp(97%, 1vw, 100%)",
              letterSpacing: "-1.5px",
            }}
          >
            Featured Work
          </h2>

          <div className="mb-8 mt-6 sm:mb-10 sm:mt-8">
            <Chips value={filter} onPick={pick} />
          </div>
          <p className="sr-only" aria-live="polite">
            {filter ? `Showing ${label.toLowerCase()}` : "Showing all work"}
          </p>

          <MotionConfig reducedMotion="user">
            <WorkGrid key={epoch} filter={filter} />
          </MotionConfig>
        </InnerContainer>
      </OuterContainer>
      <div className="w-full line-dash-x" />
    </Section>
  );
}
