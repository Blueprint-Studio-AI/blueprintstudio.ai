"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import Image, { getImageProps } from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Pause, Play } from "lucide-react";
import type { KitMedia } from "@/data/portfolioData";
import type { ShowcaseData, ShowcaseFrame } from "@/lib/work";
import { useClipLoad } from "@/lib/work/videoQueue";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

// One client or one piece of work, the way the home page's Featured Work shows
// it: a big 16:9 frame (at every width, so nothing is ever cropped) with three
// square stills beside it, and the name, one quiet line and a description
// under the frame. When the stills come from different pieces of work,
// resting on one (or tapping it) plays that work in the big frame, crossfading
// as the hero's picker does, and its name lights up in the line.

const DESKTOP = "(min-width: 1024px)";
// The hero's variant swap (components/Home/HeroSelector.tsx).
const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const INTENT_MS = 90;
const GREY = "bg-[#EDEDEC]";

function useIsDesktop() {
  const [desktop, setDesktop] = useState<boolean | null>(null);
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP);
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return desktop;
}

/** The 16:9 poster, filling the frame edge to edge. */
function Poster({ hero, sizes, eager }: { hero: ShowcaseFrame["hero"]; sizes: string; eager: boolean }) {
  const d = getImageProps({
    alt: hero.alt,
    sizes,
    quality: 80,
    loading: eager ? "eager" : "lazy",
    src: hero.poster,
    width: 2560,
    height: 1440,
  }).props;
  // eslint-disable-next-line jsx-a11y/alt-text
  return <img {...d} className="absolute inset-0 h-full w-full object-cover" />;
}

/** One frame's poster and clip. Its clip loads only when it's allowed to (see useClipLoad). */
function FrameLayer({
  frame,
  stageRef,
  desktop,
  staged,
  picked,
  allowed,
  playing,
  onPlaying,
  sizes,
  eager,
}: {
  frame: ShowcaseFrame;
  stageRef: RefObject<HTMLDivElement | null>;
  desktop: boolean | null;
  staged: boolean;
  picked: boolean;
  allowed: boolean;
  playing: boolean;
  onPlaying: (on: boolean) => void;
  sizes: string;
  eager: boolean;
}) {
  const { hero } = frame;
  // Wait for the first layout pass, so the clip never starts loading during hydration.
  const media: KitMedia | null = desktop === null ? null : hero;
  const src = media?.src;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shown, setShown] = useState(false);
  const [load, done] = useClipLoad(stageRef, { staged, now: picked, enabled: !!src && allowed });

  useEffect(() => setShown(false), [src]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !load) return;
    if (playing) v.play().catch(() => {});
    else v.pause();
  }, [playing, load, src]);

  const clip = media?.clip;
  return (
    <motion.div
      className="absolute inset-0"
      initial={{ opacity: 0, filter: "blur(6px)" }}
      animate={{ opacity: 1, filter: "blur(0px)", transitionEnd: { filter: "none" } }}
      exit={{ opacity: 0, filter: "blur(6px)", transition: { duration: 0.25, ease: EASE_OUT } }}
      transition={{ duration: 0.45, ease: EASE_OUT }}
    >
      <Poster hero={hero} sizes={sizes} eager={eager} />
      {src && load && (
        <video
          key={src}
          ref={videoRef}
          src={src}
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          onLoadedMetadata={(e) => {
            const start = media?.posterTime ?? clip?.[0];
            if (start) e.currentTarget.currentTime = start;
            if (playing) e.currentTarget.play().catch(() => {});
          }}
          onTimeUpdate={(e) => {
            // Loop just the clip; this also catches the browser's own loop back to 0.
            const t = e.currentTarget.currentTime;
            if (clip && (t < clip[0] - 0.25 || t >= clip[1])) e.currentTarget.currentTime = clip[0];
          }}
          onPlaying={() => {
            setShown(true);
            onPlaying(true);
          }}
          onPause={() => onPlaying(false)}
          onCanPlayThrough={done}
          onSuspend={done}
          onError={done}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out ${shown ? "opacity-100" : "opacity-0"}`}
        />
      )}
    </motion.div>
  );
}

export function Stage({
  data,
  active,
  picked,
  staged = false,
  eager = false,
  sizes = "(min-width: 1024px) 700px, 94vw",
  className = "",
  frameClassName = "aspect-video",
}: {
  data: ShowcaseData;
  active: string;
  picked: Set<string>;
  staged?: boolean;
  eager?: boolean;
  sizes?: string;
  className?: string;
  frameClassName?: string;
}) {
  const desktop = useIsDesktop();
  const reduce = usePrefersReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  // The visitor's own play/pause wins over scrolling in and out of view.
  const [choice, setChoice] = useState<"auto" | "play" | "pause">("auto");
  const frame = data.frames.find((f) => f.key === active) ?? data.frames[0];
  const hasClip = !!frame.hero.src;

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const playing = inView && (choice === "play" || (choice === "auto" && !reduce));

  return (
    <div ref={stageRef} className={`relative ${frameClassName} ${className}`}>
      {/* The layers clip to the rounded frame; the button sits outside, above the name's link. */}
      <div className={`absolute inset-0 isolate overflow-hidden rounded-[14px] lg:rounded-[18px] ${GREY}`}>
        <AnimatePresence initial={false}>
          <FrameLayer
            key={frame.key}
            frame={frame}
            stageRef={stageRef}
            desktop={desktop}
            staged={staged}
            picked={picked.has(frame.key) || choice === "play"}
            // With reduced motion a clip neither plays nor downloads until someone presses play.
            allowed={!reduce || choice === "play"}
            playing={playing}
            onPlaying={setIsPlaying}
            sizes={sizes}
            eager={eager}
          />
        </AnimatePresence>
      </div>
      {hasClip && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setChoice(isPlaying ? "pause" : "play");
          }}
          aria-label={isPlaying ? "Pause video" : "Play video"}
          className={`absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-[opacity,background-color] duration-200 hover:bg-black/60 focus-visible:opacity-100 lg:right-4 lg:top-4 ${
            reduce && !isPlaying ? "opacity-100" : "[@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover/stage:opacity-100"
          }`}
        >
          {isPlaying ? <Pause className="h-3 w-3" fill="currentColor" /> : <Play className="h-3 w-3 translate-x-px" fill="currentColor" />}
        </button>
      )}
    </div>
  );
}

/** The three square stills. Interactive when they come from more than one frame. */
function Stills({
  data,
  active,
  onPick,
  className,
}: {
  data: ShowcaseData;
  active: string;
  onPick: (key: string) => void;
  className: string;
}) {
  const interactive = data.frames.length > 1;
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const label = (key: string) => data.frames.find((f) => f.key === key)?.label ?? "";

  return (
    <div className={className}>
      {data.stills.map((still, i) => {
        const on = interactive && still.frame === active;
        const tile = (
          <span className={`relative block aspect-square overflow-hidden rounded-[10px] lg:rounded-[14px] ${GREY}`}>
            <Image
              src={still.src}
              alt={still.alt}
              fill
              quality={85}
              sizes="(min-width: 1024px) 230px, 31vw"
              className="object-cover transition-transform [transition-duration:700ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover/still:scale-[1.03] motion-reduce:transform-none"
            />
            {interactive && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-2 left-2 hidden translate-y-1 rounded-full bg-white/85 px-2 py-0.5 text-[11px] font-medium text-neutral-800 opacity-0 shadow-[0_1px_6px_rgba(0,0,0,0.08)] backdrop-blur-md transition-[opacity,transform] duration-300 ease-out group-hover/still:translate-y-0 group-hover/still:opacity-100 sm:block lg:bottom-3 lg:left-3"
              >
                {label(still.frame)}
              </span>
            )}
          </span>
        );
        if (!interactive) return <div key={`${still.src}-${i}`}>{tile}</div>;
        return (
          <button
            key={`${still.src}-${i}`}
            type="button"
            aria-pressed={on}
            aria-label={`Play ${label(still.frame)}`}
            onPointerEnter={(e) => {
              if (e.pointerType !== "mouse") return;
              clearTimeout(timer.current);
              timer.current = setTimeout(() => onPick(still.frame), INTENT_MS);
            }}
            onPointerLeave={() => clearTimeout(timer.current)}
            onClick={() => onPick(still.frame)}
            className="group/still block w-full cursor-pointer rounded-[10px] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB] lg:rounded-[14px]"
          >
            {tile}
          </button>
        );
      })}
    </div>
  );
}

/** The name, one quiet line (the active frame's name lit), and the description. */
export function Caption({ data, active, as: Tag = "h3", className = "" }: { data: ShowcaseData; active: string; as?: "h2" | "h3"; className?: string }) {
  const lit = data.items.length > 1;
  return (
    // Not positioned: the name's link covers the whole showcase above it (the frame too).
    <div className={className}>
      {data.title && (
        <Tag className="text-[24px] font-medium leading-[1.1] tracking-[-0.03em] text-black lg:text-[30px]">
          {data.href ? (
            <Link
              href={data.href}
              className="outline-none after:absolute after:inset-0 after:z-10 after:rounded-[14px] after:content-[''] focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-[#2563EB] lg:after:rounded-[18px]"
            >
              {data.title}
              <ArrowRight
                aria-hidden
                className="ml-2 inline-block h-[0.7em] w-[0.7em] -translate-y-[0.06em] text-neutral-400 transition-[color,transform] duration-300 ease-out group-hover/project:translate-x-1 group-hover/project:text-black"
              />
            </Link>
          ) : (
            data.title
          )}
        </Tag>
      )}
      {(data.lead || data.items.length > 0) && (
      <p className={`text-[15px] leading-[1.45] text-neutral-500 lg:text-base ${data.title ? "mt-2" : ""}`}>
        {data.lead && (
          <>
            <span className="tabular-nums">{data.lead}</span>
            <span aria-hidden className="mx-2 text-neutral-300">
              ·
            </span>
          </>
        )}
        {data.items.map((item, i) => (
          <span key={item.key}>
            <span
              className={`transition-colors duration-300 ease-out ${lit ? (item.key === active ? "text-neutral-900" : "text-neutral-400") : ""}`}
            >
              {item.label}
            </span>
            {i < data.items.length - 1 && <span className="text-neutral-400">, </span>}
          </span>
        ))}
      </p>
      )}
      {data.summary && <p className="mt-3 max-w-[60ch] text-pretty text-sm leading-[1.5] text-neutral-500">{data.summary}</p>}
      {data.links.length > 0 && (
        <div className="relative z-20 mt-5 flex flex-wrap gap-2">
          {data.links.map((link) =>
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener"
                className="group/link inline-flex h-9 items-center gap-1.5 rounded-full bg-neutral-900 px-4 text-sm font-medium text-white transition-colors duration-200 hover:bg-black"
              >
                {link.label}
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="group/link inline-flex h-9 items-center gap-1.5 rounded-full bg-black/[0.05] px-4 text-sm font-medium text-black transition-colors duration-200 hover:bg-black/[0.09]"
              >
                {link.label}
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover/link:translate-x-0.5" />
              </Link>
            )
          )}
        </div>
      )}
    </div>
  );
}

/** Which frame plays, and which ones someone has asked for (those load straight away). */
export function useActiveFrame(data: ShowcaseData) {
  const [active, setActive] = useState(data.initial);
  const [picked, setPicked] = useState<Set<string>>(() => new Set());
  // A new lead (the hero's picker changed what the card leads with) resets it.
  useEffect(() => setActive(data.initial), [data.initial]);
  const pick = (key: string) => {
    setActive(key);
    setPicked((prev) => (prev.has(key) ? prev : new Set(prev).add(key)));
  };
  return { active, picked, pick };
}

export default function Showcase({
  data,
  staged = false,
  eager = false,
  titleAs = "h3",
  single = false,
  sizes,
}: {
  data: ShowcaseData;
  /** Join the home page's staged clip loading. */
  staged?: boolean;
  eager?: boolean;
  titleAs?: "h2" | "h3";
  /** Just the big frame and its caption, without the three stills. */
  single?: boolean;
  /** The frame's image sizes, when it isn't the usual three columns wide. */
  sizes?: string;
}) {
  const { active, picked, pick } = useActiveFrame(data);

  if (single)
    return (
      <article id={data.id} aria-label={data.title || undefined} className="scroll-mt-24">
        <div className="group/project relative">
          <div className="group/stage relative">
            <Stage data={data} active={active} picked={picked} staged={staged} eager={eager} sizes={sizes} />
          </div>
          <Caption data={data} active={active} as={titleAs} className="pt-5 lg:pt-7" />
        </div>
      </article>
    );

  return (
    <article id={data.id} aria-label={data.title || undefined} className="scroll-mt-24 lg:grid lg:grid-cols-4 lg:gap-5 wide:gap-6">
      <div className="lg:col-span-3">
        <div className="group/project relative lg:sticky lg:top-24">
          <div className="group/stage relative">
            <Stage data={data} active={active} picked={picked} staged={staged} eager={eager} />
          </div>
          <Stills data={data} active={active} onPick={pick} className="relative z-20 mt-2 grid grid-cols-3 gap-2 sm:mt-3 sm:gap-3 lg:hidden" />
          <Caption data={data} active={active} as={titleAs} className="pt-5 lg:pt-7" />
        </div>
      </div>
      <Stills data={data} active={active} onPick={pick} className="hidden lg:flex lg:flex-col lg:gap-5 wide:gap-6" />
    </article>
  );
}
