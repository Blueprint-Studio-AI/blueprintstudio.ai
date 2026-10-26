"use client";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, MotionConfig, animate, motion, useMotionValue, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import Showcase from "@/components/work/Showcase";
import { featuredWork, type Deliverable } from "@/data/portfolioData";
import { clientShowcase, featuredClients, hasWorkPage, type ShowcaseData } from "@/lib/work";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { SpringText, type VariantKey } from "./HeroSelector";

// Featured Work: one card per client, from the same data and media kits as the
// /work pages. It follows the hero's picker, and can set it: both send and
// listen for window "bp:variant" events carrying { key, source }. A picked word
// shows the clients with that kind of work, each leading with it.
//
// Clips load in stages (lib/work/videoQueue): nothing until the hero reel has
// landed ("bp:opening-landed"), then in page order two at a time; a card that
// comes near the screen loads straight away, and a card's other clips load
// only when someone picks one of its stills.

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

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const LAYOUT_SPRING = { type: "spring", visualDuration: 0.6, bounce: 0.1 } as const;
const CHIP_SPRING = { type: "spring", visualDuration: 0.4, bounce: 0.18 } as const;

function filterFromUrl(): Filter {
  const key = new URLSearchParams(window.location.search).get("for");
  return FILTERS.find((f) => f.key !== null && f.key === key)?.key ?? null;
}

/** What a filter shows: featured clients, each leading with the picked kind of work. */
function itemsFor(filter: Filter): ShowcaseData[] {
  const slug = filter ? DELIVERABLE[filter] : null;
  // Six at most on the home page; "See all work" carries the rest to /work.
  return featuredClients(slug, featuredWork.home).flatMap((c) => clientShowcase(c, slug ?? undefined) ?? []);
}

function seeAllFor(filter: Filter) {
  const slug = filter ? DELIVERABLE[filter] : null;
  return { label: SEE_ALL[filter ?? "all"], href: slug && hasWorkPage(slug) ? `/work/${slug}` : "/work" };
}

/** One client in the section's frame: dashed lines, then its card. */
function ClientSection({ data, first }: { data: ShowcaseData; first: boolean }) {
  return (
    <div className="w-full">
      {!first && <div className="w-full line-dash-x" />}
      <InnerContainer className="relative px-2.5 py-10 sm:px-6 sm:py-16 lg:py-20">
        <div className="absolute bottom-0 left-0 top-0 hidden line-dash-y custom:block" />
        <div className="absolute bottom-0 right-0 top-0 hidden line-dash-y custom:block" />
        <Showcase data={data} staged />
      </InnerContainer>
    </div>
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
              className={`relative h-9 shrink-0 cursor-pointer whitespace-nowrap rounded-full px-3 text-[15px] font-medium tracking-[-0.01em] outline-none transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#2563EB] sm:px-4 ${
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
 * The projects, and the link to the rest. Projects that stay glide to their new
 * places; the rest blur out and in. The list's height springs to fit, so the
 * page below follows smoothly instead of jumping. It only clips while it
 * springs (overflow: clip, which keeps the reels' sticky column working).
 */
function WorkList({ filter }: { filter: Filter }) {
  const reduce = usePrefersReducedMotion();
  const items = itemsFor(filter);
  const seeAll = seeAllFor(filter);

  const innerRef = useRef<HTMLDivElement>(null);
  const natural = useRef(0);
  const height = useMotionValue(-1);
  const heightStyle = useTransform(height, (h) => (h < 0 ? "auto" : h));
  const [clipping, setClipping] = useState(false);
  const first = useRef(true);

  useLayoutEffect(() => {
    const inner = innerRef.current;
    if (!inner) return;
    natural.current = inner.offsetHeight;
    const observer = new ResizeObserver(() => {
      natural.current = inner.offsetHeight;
    });
    observer.observe(inner);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const inner = innerRef.current;
    if (!inner) return;
    const from = height.get() >= 0 ? height.get() : natural.current;
    const to = inner.offsetHeight;
    natural.current = to;
    if (reduce || Math.abs(from - to) < 1) {
      height.jump(-1);
      setClipping(false);
      return;
    }
    height.jump(from);
    setClipping(true);
    const controls = animate(height, to, {
      ...LAYOUT_SPRING,
      onComplete: () => {
        height.jump(-1);
        setClipping(false);
      },
    });
    return () => controls.stop();
  }, [filter, reduce, height]);

  const enter = reduce ? { opacity: 0 } : { opacity: 0, y: 40, filter: "blur(10px)" };
  const shown = { opacity: 1, y: 0, filter: "blur(0px)", transitionEnd: { filter: "none" } };
  // Leaving projects drop beneath the ones gliding into place.
  const exit = reduce
    ? { opacity: 0, transition: { duration: 0.15 } }
    : { opacity: 0, filter: "blur(10px)", zIndex: 0, transition: { duration: 0.22, ease: EASE_OUT, zIndex: { duration: 0 } } };

  return (
    <motion.div style={{ height: heightStyle, overflow: clipping ? "clip" : undefined }} className="w-full">
      <div ref={innerRef} className="relative w-full">
        <AnimatePresence initial={false} mode="popLayout">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              layout="position"
              initial={enter}
              animate={shown}
              exit={exit}
              transition={{ layout: LAYOUT_SPRING, default: { duration: 0.45, ease: EASE_OUT, delay: 0.03 + Math.min(i, 3) * 0.05 } }}
              className="relative z-[1] w-full"
            >
              <ClientSection data={item} first={i === 0} />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* It glides with the projects rather than jumping ahead of them. */}
        <motion.div layout="position" transition={{ layout: LAYOUT_SPRING }} className="w-full">
          <div className="w-full line-dash-x" />
          <InnerContainer className="relative flex justify-center px-2.5 py-10 sm:px-6 sm:py-14">
            <div className="absolute left-0 top-0 bottom-0 line-dash-y hidden custom:block" />
            <div className="absolute right-0 top-0 bottom-0 line-dash-y hidden custom:block" />
            <Link
              href={seeAll.href}
              className="group/all inline-flex h-11 items-center gap-2 rounded-full border border-neutral-300 bg-white pl-5 pr-4 text-[15px] font-medium tracking-[-0.01em] text-neutral-900 outline-none transition-colors duration-200 hover:border-neutral-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
            >
              <SpringText text={seeAll.label} />
              <ArrowRight aria-hidden className="h-4 w-4 transition-transform duration-300 ease-out group-hover/all:translate-x-0.5" />
            </Link>
          </InnerContainer>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function PortfolioBento() {
  const [filter, setFilter] = useState<Filter>(null);
  // Bumped to remount the list without animating, for a ?for= link.
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
      {/* Background lines matching existing portfolio */}
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
        <InnerContainer className="pt-8 sm:pt-12 lg:pt-16 px-2.5 sm:px-6 relative">
          {/* Inner dashed vertical lines on desktop - matching Achievements section */}
          <div className="absolute left-0 top-0 bottom-0 line-dash-y hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y hidden custom:block" />

          <h2
            className="font-medium text-black text-center cursor-default"
            style={{
              fontSize: 'clamp(32px, 6vw, 48px)',
              lineHeight: 'clamp(97%, 1vw, 100%)',
              letterSpacing: '-1.5px'
            }}
          >
            Featured Work
          </h2>

          <div className="mt-6 sm:mt-8">
            <Chips value={filter} onPick={pick} />
          </div>
          <p className="sr-only" aria-live="polite">
            {filter ? `Showing ${label.toLowerCase()}` : "Showing all work"}
          </p>
        </InnerContainer>

        <div className="w-full max-w-[1000px]">
          <MotionConfig reducedMotion="user">
            <WorkList key={epoch} filter={filter} />
          </MotionConfig>
        </div>
      </OuterContainer>
      <div className="w-full line-dash-x" />
    </Section>
  );
}
