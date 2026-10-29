"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { getImageProps } from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { useClipLoad } from "@/lib/work/videoQueue";
import type { SiteTab } from "./types";

// The page inside the browser. Every tab's capture stays mounted underneath,
// so a tab shows at once and never waits on an image. The tab in front loads
// the real site in a sandboxed frame, drawn at a real width (1440 on the
// display, 393 on the phone) and scaled to fit, and takes the capture's place
// once it has loaded; a page that never loads leaves the capture up.
// A site stays loaded once opened, as a browser tab does. On the display, the
// other tabs' sites then load behind, one at a time, so picking one shows it
// live straight away; a phone loads only the tabs you pick.
//
// The frame takes the pointer only once you mean it: on the display, when
// the pointer moves over it after the page has stopped scrolling (so
// scrolling past doesn't get caught in the site); on a touch screen, after a
// tap. Moving or tapping away hands the page back.

export const PANEL = "websites-screen";
const SANDBOX = "allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox";
/** A page that hasn't loaded by now stops holding up the next one behind it; its capture stays up. */
const SLOW_MS = 12000;
/** How long after a page loads before it takes the capture's place: long enough for most sites' own entrance to settle. */
const SETTLE_MS = 650;
/** Wheel this recently means the page is still scrolling past. */
const SCROLLING_MS = 450;
const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export type ScreenVariant = "desktop" | "phone";
const RENDER_WIDTH: Record<ScreenVariant, number> = { desktop: 1440, phone: 393 };

function Capture({ tab, variant, eager }: { tab: SiteTab; variant: ScreenVariant; eager: boolean }) {
  // The phone shows the site's own phone screen where we have one; otherwise
  // the capture sits in the middle, as a phone shows a picture or a video.
  const phone = variant === "phone";
  const tall = phone && tab.hero.vertical;
  const props = getImageProps({
    alt: tab.hero.alt,
    sizes: phone ? "260px" : "(min-width: 1024px) 920px, 96vw",
    quality: 80,
    loading: eager ? "eager" : "lazy",
    src: tall ? tab.hero.vertical!.poster : tab.hero.poster,
    width: tall ? 1080 : 2560,
    height: tall ? 1620 : 1440,
  }).props;
  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <img
      {...props}
      // Decoded ahead, and drawn whole the first time it's shown (no blank frame while it decodes).
      decoding="sync"
      onLoad={(e) => void e.currentTarget.decode?.().catch(() => {})}
      // The phone's own captures are a little shorter than its screen, so they sit full width at the top, as a page still loading.
      className={`absolute inset-0 h-full w-full ${phone ? (tall ? "object-contain object-top" : "object-contain") : "object-cover object-top"}`}
    />
  );
}

/** A capture's clip, a recording of the site: it loads when the screen comes near and plays while it's on screen. */
function Clip({ tab, variant, playing, onPlaying }: { tab: SiteTab; variant: ScreenVariant; playing: boolean; onPlaying: (on: boolean) => void }) {
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
          className={`absolute inset-0 h-full w-full transition-opacity duration-300 ease-out ${variant === "phone" ? "object-contain" : "object-cover object-top"} ${
            shown ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
}

/** The live site. Drawn at a real width and scaled to the screen, hidden until it has loaded and settled, and while its tab is behind. */
function LiveFrame({
  tab,
  variant,
  size,
  front,
  engaged,
  onLoaded,
  onDone,
}: {
  tab: SiteTab;
  variant: ScreenVariant;
  size: { w: number; h: number };
  /** Its tab is the one in front. */
  front: boolean;
  engaged: boolean;
  onLoaded: () => void;
  /** Loaded, or given up on: the next site may start loading behind. */
  onDone: () => void;
}) {
  const [shown, setShown] = useState(false);
  const settle = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => {
    const slow = setTimeout(onDone, SLOW_MS);
    return () => {
      clearTimeout(slow);
      clearTimeout(settle.current);
    };
    // Once, when the frame starts loading.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const width = RENDER_WIDTH[variant];
  const scale = size.w / width;
  return (
    <iframe
      src={tab.frame}
      title={`${tab.name}, ${tab.label.toLowerCase()}: the live site`}
      sandbox={SANDBOX}
      referrerPolicy="strict-origin-when-cross-origin"
      loading="eager"
      tabIndex={front && shown ? 0 : -1}
      aria-hidden={!front}
      onLoad={() => {
        // The capture stays up while the site plays its own entrance, so it doesn't flash in half-drawn.
        clearTimeout(settle.current);
        settle.current = setTimeout(() => {
          setShown(true);
          onLoaded();
          onDone();
        }, tab.intro ?? SETTLE_MS);
      }}
      className={`absolute left-0 top-0 origin-top-left border-0 bg-white transition-opacity duration-200 ease-out ${shown ? "opacity-100" : "opacity-0"} ${
        front && engaged ? "" : "pointer-events-none"
      }`}
      style={{ width, height: size.h / scale, transform: `scale(${scale})`, visibility: front ? "visible" : "hidden" }}
    />
  );
}

export default function Screen({
  tabs,
  active,
  variant,
  enabled,
  reload,
  reduce,
  tapLabel,
  labelledBy,
  className = "",
}: {
  tabs: SiteTab[];
  active: string;
  variant: ScreenVariant;
  /** Whether this screen is the one on show, so it may load the live site. */
  enabled: boolean;
  /** Bumped by the reload button: the page in front starts over. */
  reload: number;
  reduce: boolean;
  tapLabel: ReactNode;
  labelledBy: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [near, setNear] = useState(false);
  const [inView, setInView] = useState(false);
  const [engaged, setEngaged] = useState(false);
  // The sites opened so far, in order; each one's reloads; and the frames
  // (by run) that have painted, or are done loading either way.
  const [opened, setOpened] = useState<string[]>([]);
  const [reloads, setReloads] = useState<Record<string, number>>({});
  const [painted, setPainted] = useState<ReadonlySet<string>>(() => new Set());
  const [done, setDone] = useState<ReadonlySet<string>>(() => new Set());
  const [coarse, setCoarse] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  // The visitor's own play or pause wins over scrolling in and out of view.
  const [choice, setChoice] = useState<"auto" | "play" | "pause">("auto");
  const lastWheel = useRef(0);
  const tab = tabs.find((t) => t.key === active) ?? tabs[0];
  const run = `${tab.key}-${reload}`;
  const frameRun = (key: string) => `${key}-${reloads[key] ?? 0}`;
  const canFrame = (t: SiteTab) => !!t.frame && !(variant === "phone" && t.heavy);
  const framed = canFrame(tab);
  const live = framed && enabled && near;
  const hasClip = !framed && !!tab.hero.src;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setSize({ w: entry.contentRect.width, h: entry.contentRect.height }));
    ro.observe(el);
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    // The live site loads when the screen comes within a screen's height.
    const nearIo = new IntersectionObserver(([entry]) => entry.isIntersecting && setNear(true), { rootMargin: "100% 0px" });
    nearIo.observe(el);
    const mq = window.matchMedia("(hover: none), (pointer: coarse)");
    setCoarse(mq.matches);
    return () => {
      ro.disconnect();
      io.disconnect();
      nearIo.disconnect();
    };
  }, []);

  // A new page starts handed back, playing (unless motion is reduced), and loading.
  useEffect(() => {
    setEngaged(false);
    setChoice("auto");
    setIsPlaying(false);
  }, [run]);

  // The tab in front opens its site as soon as it may.
  useEffect(() => {
    if (live) setOpened((o) => (o.includes(tab.key) ? o : [...o, tab.key]));
  }, [live, tab.key]);

  // Reload starts the site in front over.
  const lastReload = useRef(reload);
  useEffect(() => {
    if (reload === lastReload.current) return;
    lastReload.current = reload;
    setReloads((r) => ({ ...r, [tab.key]: (r[tab.key] ?? 0) + 1 }));
  }, [reload, tab.key]);

  // On the display, once nothing is loading, the next tab's site loads behind.
  // Not a heavy one, and not when the visitor has asked to save data.
  const busy = opened.some((key) => !done.has(frameRun(key)));
  useEffect(() => {
    if (variant !== "desktop" || !enabled || !near || busy) return;
    if ((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData) return;
    const next = tabs.find((t) => t.frame && !t.heavy && !opened.includes(t.key));
    if (next) setOpened((o) => [...o, next.key]);
  }, [variant, enabled, near, busy, tabs, opened]);

  useEffect(() => {
    if (!inView) setEngaged(false);
  }, [inView]);

  // Hand the page back when the pointer moves off the screen, or a tap lands elsewhere.
  useEffect(() => {
    if (!engaged) return;
    const away = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setEngaged(false);
    };
    document.addEventListener("pointermove", away);
    document.addEventListener("pointerdown", away);
    return () => {
      document.removeEventListener("pointermove", away);
      document.removeEventListener("pointerdown", away);
    };
  }, [engaged]);

  const add = (set: ReadonlySet<string>, key: string) => (set.has(key) ? set : new Set(set).add(key));
  const shown = live && painted.has(frameRun(tab.key));
  const playing = inView && (choice === "play" || (choice === "auto" && !reduce));
  // With reduced motion a clip neither plays nor downloads until someone presses play.
  const clipAllowed = hasClip && (!reduce || choice === "play");

  return (
    <div
      ref={ref}
      id={variant === "desktop" ? PANEL : undefined}
      role="tabpanel"
      aria-labelledby={labelledBy}
      onWheel={() => (lastWheel.current = Date.now())}
      onPointerMove={(e) => {
        if (e.pointerType === "mouse" && shown && Date.now() - lastWheel.current > SCROLLING_MS) setEngaged(true);
      }}
      onClick={() => shown && setEngaged(true)}
      // On the phone, the space round a capture takes the page's own top colour (black round a desktop capture, as a phone shows a picture).
      style={variant === "phone" ? { backgroundColor: tab.hero.vertical ? tab.tint : "#000000" } : undefined}
      className={`group/page relative overflow-hidden ${variant === "phone" ? "" : "bg-[#F3F3F2]"} ${className}`}
    >
      {tabs.map((t, i) => (
        <div key={t.key} className="absolute inset-0" style={{ visibility: t.key === active ? "visible" : "hidden" }}>
          <Capture tab={t} variant={variant} eager={i === 0} />
        </div>
      ))}
      {clipAllowed && <Clip key={run} tab={tab} variant={variant} playing={playing} onPlaying={setIsPlaying} />}
      {size.w > 0 &&
        opened.map((key) => {
          const t = tabs.find((x) => x.key === key);
          if (!t || !canFrame(t)) return null;
          const r = frameRun(key);
          return (
            <LiveFrame
              key={r}
              tab={t}
              variant={variant}
              size={size}
              front={live && key === tab.key}
              engaged={engaged}
              onLoaded={() => setPainted((p) => add(p, r))}
              onDone={() => setDone((d) => add(d, r))}
            />
          );
        })}
      {/* On a touch screen the site takes touches only after a tap, so the page still scrolls past it. */}
      <span className="pointer-events-none absolute inset-x-0 bottom-3 z-10 flex justify-center">
        <AnimatePresence>
          {shown && coarse && !engaged && (
            <motion.span
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.12 } }}
              transition={{ duration: 0.3, ease: EASE_OUT }}
              className="whitespace-nowrap rounded-full bg-black/70 px-3 py-1.5 text-[12px] font-medium text-white shadow-[0_2px_10px_rgba(0,0,0,0.2)] backdrop-blur-md"
            >
              {tapLabel}
            </motion.span>
          )}
        </AnimatePresence>
      </span>
      {hasClip && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setChoice(isPlaying ? "pause" : "play");
          }}
          aria-label={isPlaying ? "Pause the recording" : "Play the recording"}
          className={`absolute bottom-1.5 right-1.5 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-md transition-[opacity,background-color] duration-200 after:absolute after:-inset-2 after:content-[''] hover:bg-black/65 focus-visible:opacity-100 sm:bottom-3 sm:right-3 sm:h-8 sm:w-8 ${reduce && !isPlaying ? "opacity-100" : "[@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover/page:opacity-100"}`}
        >
          {isPlaying ? <Pause className="h-2.5 w-2.5 sm:h-3 sm:w-3" fill="currentColor" /> : <Play className="h-2.5 w-2.5 translate-x-px sm:h-3 sm:w-3" fill="currentColor" />}
        </button>
      )}
    </div>
  );
}
