"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { getImageProps } from "next/image";
import { Pause, Play } from "lucide-react";
import type { MediaAsset, ResponsiveMedia } from "@/data/portfolioData";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

// Desktop media from lg up, the mobile cut below it.
const DESKTOP = "(min-width: 1024px)";
// The frame is at most the panel's inner width (panels stop at ~1480px).
const SIZES = "(min-width: 1480px) 1260px, (min-width: 1024px) 88vw, 94vw";
// How far ahead of the viewport a reel starts downloading: a screen's worth.
const LOAD_AHEAD = "100% 0px";

const ratio = (m: MediaAsset, fallback: number) => (m.width && m.height ? m.width / m.height : fallback);
const still = (m: MediaAsset) => (m.type === "video" ? m.poster : m.src);

function stillProps(m: MediaAsset, fallbackRatio: number, eager: boolean) {
  const src = still(m);
  if (!src) return null;
  const width = m.width ?? 1920;
  return getImageProps({
    src,
    alt: m.alt,
    width,
    height: m.height ?? Math.round(width / fallbackRatio),
    sizes: SIZES,
    // Posters are a frame of a reel that replaces them; stills are the work itself.
    quality: m.type === "image" ? 85 : 75,
    loading: eager ? "eager" : "lazy",
    fetchPriority: eager ? "high" : undefined,
  }).props;
}

export default function PanelMedia({ media, eager = false }: { media: ResponsiveMedia; eager?: boolean }) {
  const { desktop, mobile } = media;
  // Starts false on the server and first render, so hydration matches.
  const reduce = usePrefersReducedMotion();
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);
  const [near, setNear] = useState(eager);
  const [inView, setInView] = useState(false);
  const [shown, setShown] = useState(false);
  const [playing, setPlaying] = useState(false);
  // The visitor's own play/pause wins over scrolling in and out of view.
  const [choice, setChoice] = useState<"auto" | "play" | "pause">("auto");

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP);
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const active = isDesktop === null ? null : isDesktop ? desktop : mobile;
  const video = active?.type === "video" ? active : null;
  // With reduced motion a reel neither plays nor downloads until asked to.
  const allowed = !reduce || choice !== "auto";
  const videoSrc = video && near && allowed ? video.src : undefined;

  // Start downloading a reel only once its panel is close.
  useEffect(() => {
    const el = frameRef.current;
    if (near || !video || !el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: LOAD_AHEAD }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [near, video]);

  // Play only while on screen.
  useEffect(() => {
    const el = frameRef.current;
    if (!video || !el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, [video]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !videoSrc) return;
    const want = inView && (choice === "play" || (choice === "auto" && !reduce));
    if (want) v.play().catch(() => {});
    else v.pause();
  }, [videoSrc, inView, choice, reduce]);

  // A new source (crossing the breakpoint) fades in again from its poster.
  useEffect(() => setShown(false), [videoSrc]);

  const d = stillProps(desktop, 16 / 9, eager);
  const m = stillProps(mobile, 2 / 3, eager);

  const frameStyle = {
    "--ar-d": ratio(desktop, 16 / 9),
    "--ar-m": ratio(mobile, 2 / 3),
    aspectRatio: "var(--ar)",
    width: "min(100%, calc(var(--maxh) * var(--ar)))",
  } as CSSProperties;

  return (
    <div
      ref={frameRef}
      style={frameStyle}
      className="group/media relative mx-auto overflow-hidden rounded-[12px] [--ar:var(--ar-m)] [--maxh:540px] md:[--maxh:660px] lg:rounded-[16px] lg:[--ar:var(--ar-d)] lg:[--maxh:720px]"
    >
      {m && (
        <picture>
          {d && <source media={DESKTOP} srcSet={d.srcSet} sizes={d.sizes} />}
          <img {...m} className="absolute inset-0 h-full w-full object-cover" />
        </picture>
      )}

      {video && (
        <video
          key={video.src}
          ref={videoRef}
          src={videoSrc}
          muted
          loop
          playsInline
          preload={videoSrc ? "auto" : "none"}
          aria-hidden="true"
          onLoadedMetadata={(e) => {
            // Pick up from the poster's frame; later loops start from 0.
            if (video.posterTime) e.currentTarget.currentTime = video.posterTime;
          }}
          onPlaying={() => {
            setShown(true);
            setPlaying(true);
          }}
          onPause={() => setPlaying(false)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out ${
            shown ? "opacity-100" : "opacity-0"
          }`}
        />
      )}

      {video && (
        <button
          type="button"
          onClick={() => setChoice(playing ? "pause" : "play")}
          aria-label={playing ? "Pause video" : "Play video"}
          className={`absolute bottom-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-[opacity,background-color] duration-200 hover:bg-black/60 focus-visible:opacity-100 lg:bottom-4 lg:right-4 ${
            reduce && !playing ? "opacity-100" : "[@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover/media:opacity-100"
          }`}
        >
          {playing ? <Pause className="h-3 w-3" fill="currentColor" /> : <Play className="h-3 w-3 translate-x-px" fill="currentColor" />}
        </button>
      )}
    </div>
  );
}
