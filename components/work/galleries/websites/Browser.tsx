"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { getImageProps } from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Archive, ArrowLeft, ArrowRight, ArrowUpRight, Globe, Lock, Pause, Play, RotateCw } from "lucide-react";
import { useClipLoad } from "@/lib/work/videoQueue";
import type { SiteTab } from "./types";

// The browser on the display's screen, drawn after Chrome on a Mac: the tab
// strip (from lg up; smaller screens pick from the strip under the display),
// the toolbar with the address, and the page. Picking a tab swaps the page
// in the same frame, as a browser does; only the new tab's shape springs up
// out of the toolbar. Every poster stays mounted, so a swap never waits on
// an image, and only the tab in front loads and plays its clip.

/** The tab shape rising out of the toolbar when it's picked. */
const RISE = { type: "spring", visualDuration: 0.28, bounce: 0.32 } as const;
const MORPH = { type: "spring", visualDuration: 0.26, bounce: 0.12 } as const;
const PRESS = { scale: 0.97 };
const PANEL = "websites-screen";
const tabId = (key: string) => `websites-tab-${key}`;

export function Favicon({ src, className = "" }: { src?: string; className?: string }) {
  if (!src) return <Globe aria-hidden className={`shrink-0 text-[#5F6368] ${className}`} strokeWidth={1.75} />;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" aria-hidden className={`shrink-0 object-contain ${className}`} />;
}

function TrafficLights({ className = "", dot = "h-[12px] w-[12px]" }: { className?: string; dot?: string }) {
  return (
    <span aria-hidden className={`flex shrink-0 items-center ${className}`}>
      {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
        <span key={c} className={`${dot} rounded-full shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.12)]`} style={{ backgroundColor: c }} />
      ))}
    </span>
  );
}

/** Arrow keys move along the tabs and pick (automatic activation); Home and End jump. */
export function useTabKeys(tabs: SiteTab[], active: string, onPick: (key: string) => void, idOf: (key: string) => string) {
  return (e: KeyboardEvent) => {
    const i = tabs.findIndex((t) => t.key === active);
    const to =
      e.key === "ArrowRight" ? (i + 1) % tabs.length : e.key === "ArrowLeft" ? (i - 1 + tabs.length) % tabs.length : e.key === "Home" ? 0 : e.key === "End" ? tabs.length - 1 : -1;
    if (to < 0) return;
    e.preventDefault();
    onPick(tabs[to].key);
    document.getElementById(idOf(tabs[to].key))?.focus();
  };
}

function Tabs({ tabs, active, onPick, touched, reduce }: { tabs: SiteTab[]; active: string; onPick: (key: string) => void; touched: boolean; reduce: boolean }) {
  const [hover, setHover] = useState<string | null>(null);
  const keys = useTabKeys(tabs, active, onPick, tabId);
  const at = (key: string | null) => tabs.findIndex((t) => t.key === key);
  const quiet = new Set([at(active), at(hover)]);

  return (
    <div role="tablist" aria-label="Websites" onKeyDown={keys} className="flex h-[34px] min-w-0 flex-1 items-stretch">
      {tabs.map((tab, i) => {
        const on = tab.key === active;
        return (
          <motion.button
            key={tab.key}
            id={tabId(tab.key)}
            type="button"
            role="tab"
            aria-selected={on}
            aria-controls={PANEL}
            tabIndex={on ? 0 : -1}
            title={tab.title}
            onClick={() => onPick(tab.key)}
            onPointerEnter={(e) => e.pointerType === "mouse" && setHover(tab.key)}
            onPointerLeave={() => setHover((h) => (h === tab.key ? null : h))}
            whileTap={reduce ? undefined : PRESS}
            transition={MORPH}
            className={`relative flex min-w-0 max-w-[220px] flex-auto items-center gap-[6px] pl-[8px] pr-[2px] text-left text-[11.5px] leading-none tracking-[-0.005em] outline-none focus-visible:z-20 xl:gap-[7px] xl:pl-[11px] xl:text-[12px] ${
              on ? "z-10 cursor-default text-[#1F1F1F]" : "cursor-pointer text-[#45474A]"
            }`}
          >
            {on && (
              <motion.span
                aria-hidden
                initial={touched && !reduce ? { scaleY: 0.78, scaleX: 0.94 } : false}
                animate={{ scaleY: 1, scaleX: 1 }}
                transition={RISE}
                style={{ originY: 1 }}
                className="absolute inset-x-0 bottom-0 top-[5px] rounded-t-[9px] bg-white shadow-[0_0_0_0.5px_rgba(0,0,0,0.07)]"
              >
                {/* The curves where the tab flows into the toolbar. */}
                <span className="absolute -left-[9px] bottom-0 h-[9px] w-[9px] bg-[radial-gradient(circle_at_0_0,transparent_8.5px,#fff_9px)]" />
                <span className="absolute -right-[9px] bottom-0 h-[9px] w-[9px] bg-[radial-gradient(circle_at_100%_0,transparent_8.5px,#fff_9px)]" />
              </motion.span>
            )}
            {!on && hover === tab.key && <span aria-hidden className="absolute inset-x-[2px] bottom-[4px] top-[6px] rounded-[8px] bg-white/55" />}
            {i > 0 && (
              <span
                aria-hidden
                className={`absolute left-0 top-1/2 h-[16px] w-px -translate-y-[calc(50%-2px)] bg-[#9AA0A6]/60 ${quiet.has(i) || quiet.has(i - 1) ? "opacity-0" : ""}`}
              />
            )}
            {/* Focus ring for the keyboard. */}
            <span aria-hidden className="pointer-events-none absolute inset-x-[2px] bottom-[3px] top-[6px] rounded-[8px] ring-[#2563EB] [button:focus-visible>&]:ring-2" />
            <Favicon src={tab.favicon} className="relative h-[14px] w-[14px] xl:h-[16px] xl:w-[16px]" />
            {/* A long title fades out at the tab's edge; the padding keeps a short one clear of the fade. */}
            <span className="relative min-w-0 flex-1 overflow-hidden whitespace-nowrap py-[2px] pr-[10px] [mask-image:linear-gradient(90deg,#000_calc(100%-12px),transparent)] xl:pr-[12px]">
              {tab.title}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

/** The address: a live site's domain, a quiet "Archived" for work that's no longer up. */
function Address({ tab, compact, archived }: { tab: SiteTab; compact?: boolean; archived: ReactNode }) {
  const icon = compact ? "h-[10px] w-[10px]" : "h-[13px] w-[13px]";
  return (
    <span
      className={`flex min-w-0 flex-1 items-center rounded-full bg-[#F0F1F2] ${
        compact ? "h-[22px] justify-center gap-[5px] px-[10px] text-[10.5px] sm:h-[26px] sm:text-[12px]" : "h-[30px] gap-[8px] px-[13px] text-[13.5px]"
      }`}
    >
      {tab.address ? (
        <>
          <Lock aria-hidden className={`${icon} shrink-0 text-[#5F6368]`} strokeWidth={2.2} />
          <span className="min-w-0 truncate tracking-[-0.005em]">
            <span className="text-[#1F1F1F]">{tab.address.host}</span>
            <span className="text-[#6B6E73]">{tab.address.path}</span>
          </span>
        </>
      ) : tab.archived ? (
        <>
          <Archive aria-hidden className={`${icon} shrink-0 text-[#80868B]`} strokeWidth={2} />
          <span className="truncate text-[#6B6E73]">{archived}</span>
        </>
      ) : null}
    </span>
  );
}

/** The poster, filling the page edge to edge. */
function Poster({ tab, eager }: { tab: SiteTab; eager: boolean }) {
  const props = getImageProps({
    alt: tab.hero.alt,
    sizes: "(min-width: 1024px) 920px, 96vw",
    quality: 80,
    loading: eager ? "eager" : "lazy",
    src: tab.hero.poster,
    width: 2560,
    height: 1440,
  }).props;
  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <img
      {...props}
      // Decoded ahead, and drawn whole the first time it's shown (no blank frame while it decodes).
      decoding="sync"
      onLoad={(e) => void e.currentTarget.decode?.().catch(() => {})}
      className="absolute inset-0 h-full w-full object-cover object-top"
    />
  );
}

/** The tab in front's clip, a recording of the site: it loads when the screen comes near and plays while it's on screen. */
function Clip({ tab, playing, onPlaying }: { tab: SiteTab; playing: boolean; onPlaying: (on: boolean) => void }) {
  const ref = useRef<HTMLVideoElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  const [load, done] = useClipLoad(hostRef, { staged: false, now: false, enabled: !!tab.hero.src });
  const { clip, posterTime } = tab.hero;

  useEffect(() => {
    const v = ref.current;
    if (!v || !load) return;
    if (playing) v.play().catch(() => {});
    else v.pause();
  }, [playing, load]);

  return (
    <div ref={hostRef} className="absolute inset-0">
      {load && (
        <video
          ref={ref}
          src={tab.hero.src}
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          onLoadedMetadata={(e) => {
            const start = posterTime ?? clip?.[0];
            if (start) e.currentTarget.currentTime = start;
            if (playing) e.currentTarget.play().catch(() => {});
          }}
          onTimeUpdate={(e) => {
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
          className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-300 ease-out ${shown ? "opacity-100" : "opacity-0"}`}
        />
      )}
    </div>
  );
}

function Page({ tabs, active, reduce }: { tabs: SiteTab[]; active: string; reduce: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  // The visitor's own play or pause wins over scrolling in and out of view.
  const [choice, setChoice] = useState<"auto" | "play" | "pause">("auto");
  const tab = tabs.find((t) => t.key === active) ?? tabs[0];
  const hasClip = !!tab.hero.src;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // A new tab starts as the page does: playing unless motion is reduced.
  useEffect(() => {
    setChoice("auto");
    setIsPlaying(false);
  }, [active]);

  const playing = inView && (choice === "play" || (choice === "auto" && !reduce));
  // With reduced motion a clip neither plays nor downloads until someone presses play.
  const allowed = hasClip && (!reduce || choice === "play");

  return (
    <div ref={ref} id={PANEL} role="tabpanel" aria-labelledby={tabId(active)} className="group/page relative aspect-video overflow-hidden bg-[#F3F3F2]">
      {tabs.map((t, i) => (
        <div key={t.key} className="absolute inset-0" style={{ visibility: t.key === active ? "visible" : "hidden" }}>
          <Poster tab={t} eager={i === 0} />
        </div>
      ))}
      {allowed && <Clip key={tab.key} tab={tab} playing={playing} onPlaying={setIsPlaying} />}
      {hasClip && (
        <button
          type="button"
          onClick={() => setChoice(isPlaying ? "pause" : "play")}
          aria-label={isPlaying ? "Pause the recording" : "Play the recording"}
          className={`absolute bottom-1.5 right-1.5 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-md transition-[opacity,background-color] duration-200 after:absolute after:-inset-2 after:content-[''] hover:bg-black/65 focus-visible:opacity-100 sm:bottom-3 sm:right-3 sm:h-8 sm:w-8 ${
            reduce && !isPlaying ? "opacity-100" : "[@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover/page:opacity-100"
          }`}
        >
          {isPlaying ? <Pause className="h-2.5 w-2.5 sm:h-3 sm:w-3" fill="currentColor" /> : <Play className="h-2.5 w-2.5 translate-x-px sm:h-3 sm:w-3" fill="currentColor" />}
        </button>
      )}
    </div>
  );
}

export default function Browser({
  tabs,
  active,
  onPick,
  touched,
  reduce,
  archived,
}: {
  tabs: SiteTab[];
  active: string;
  onPick: (key: string) => void;
  touched: boolean;
  reduce: boolean;
  /** The address bar's word for work that's no longer up (rendered on the server, Draft-marked). */
  archived: ReactNode;
}) {
  const tab = tabs.find((t) => t.key === active) ?? tabs[0];
  const live = tab.address;

  return (
    <div className="relative overflow-hidden rounded-[max(2px,0.3cqw)] bg-white">
      {/* From lg: the tab strip, then the toolbar. */}
      <div className="hidden h-[40px] items-end bg-[#DFE1E5] pl-[14px] pr-[10px] lg:flex">
        <TrafficLights className="mb-[14px] mr-[12px] gap-[8px]" />
        <Tabs tabs={tabs} active={active} onPick={onPick} touched={touched} reduce={reduce} />
      </div>
      <div className="hidden h-[42px] items-center gap-[10px] border-b border-black/[0.07] px-[12px] lg:flex">
        <span aria-hidden className="flex items-center gap-[12px] pl-[2px] pr-[4px] text-[#5F6368]">
          <ArrowLeft className="h-[16px] w-[16px] opacity-40" strokeWidth={2} />
          <ArrowRight className="h-[16px] w-[16px] opacity-40" strokeWidth={2} />
          <RotateCw className="h-[14px] w-[14px] opacity-80" strokeWidth={2.2} />
        </span>
        <Address tab={tab} archived={archived} />
        {/* The Visit link grows out of the address bar for a live site. */}
        <motion.div initial={false} animate={{ width: live ? "auto" : 0 }} transition={reduce ? { duration: 0 } : MORPH} className="-my-2 flex shrink-0 justify-end overflow-hidden py-2">
          <AnimatePresence initial={false} mode="popLayout">
            {live && (
              <motion.a
                key="visit"
                href={live.href}
                target="_blank"
                rel="noopener"
                initial={reduce ? false : { opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, scale: 0.85, transition: { duration: 0.12 } }}
                transition={MORPH}
                whileTap={reduce ? undefined : PRESS}
                className="group/visit inline-flex h-[30px] items-center gap-[5px] whitespace-nowrap rounded-full bg-neutral-900 pl-[13px] pr-[11px] text-[12.5px] font-medium text-white outline-none transition-colors duration-200 hover:bg-black focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
              >
                Visit site
                <ArrowUpRight className="h-[13px] w-[13px] transition-transform duration-300 ease-out group-hover/visit:-translate-y-px group-hover/visit:translate-x-px" />
                <span className="sr-only">(opens in a new tab)</span>
              </motion.a>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      {/* Below lg: one slim toolbar. */}
      <div className="flex h-[30px] items-center border-b border-black/[0.07] bg-[#F7F7F8] px-[9px] sm:h-[38px] sm:px-[12px] lg:hidden">
        <TrafficLights className="w-[34px] gap-[5px] sm:w-[46px] sm:gap-[7px]" dot="h-[8px] w-[8px] sm:h-[10px] sm:w-[10px]" />
        <span className="flex min-w-0 flex-1 justify-center px-[6px]">
          <Address tab={tab} archived={archived} compact />
        </span>
        <span className="w-[34px] shrink-0 sm:w-[46px]" />
      </div>
      <Page tabs={tabs} active={active} reduce={reduce} />
    </div>
  );
}
