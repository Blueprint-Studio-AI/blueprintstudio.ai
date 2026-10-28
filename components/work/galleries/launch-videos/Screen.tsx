"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { getImageProps } from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useClipLoad } from "@/lib/work/videoQueue";
import { EASE_OUT, type Film } from "./shared";

/** Whether a loaded <video> carries a sound track, where the browser says. */
function hasSoundTrack(v: HTMLVideoElement): boolean | null {
  const m = v as HTMLVideoElement & { mozHasAudio?: boolean; webkitAudioDecodedByteCount?: number; audioTracks?: { length: number } };
  if (typeof m.mozHasAudio === "boolean") return m.mozHasAudio;
  if (m.audioTracks) return m.audioTracks.length > 0;
  if (typeof m.webkitAudioDecodedByteCount === "number") return m.webkitAudioDecodedByteCount > 0;
  return null;
}

/**
 * One film on the screen: its poster at once, its clip once its disc is in
 * (useClipLoad), looping just the kit's stretch of it as the Showcase does.
 * It stays mounted after it has played, so putting the disc back in is quick.
 */
function FilmLayer({
  film,
  on,
  stageRef,
  play,
  muted,
  instant,
  onTime,
  onSound,
}: {
  film: Film;
  on: boolean;
  stageRef: RefObject<HTMLDivElement | null>;
  play: boolean;
  muted: boolean;
  instant: boolean;
  onTime: (t: number, length: number) => void;
  onSound: (sound: boolean) => void;
}) {
  const { hero } = film;
  const clip = hero.clip;
  const start = hero.posterTime ?? clip?.[0] ?? 0;
  const from = clip?.[0] ?? 0;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shown, setShown] = useState(false);
  const [load, done] = useClipLoad(stageRef, { staged: false, now: on, enabled: on && !!hero.src });

  // A disc going back in starts its film from the top.
  useEffect(() => {
    const v = videoRef.current;
    if (on && v && v.readyState > 0) v.currentTime = start;
  }, [on, start]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = muted;
    if (on && play) v.play().catch(() => {});
    else v.pause();
  }, [on, play, muted, load]);

  const poster = getImageProps({ alt: hero.alt, src: hero.poster, width: 2560, height: 1440, quality: 80, sizes: "(min-width: 1024px) 940px, 100vw" }).props;

  return (
    <motion.div
      className="absolute inset-0 origin-center"
      initial={false}
      animate={
        on
          ? { opacity: 1, scaleX: 1, scaleY: 1, filter: "brightness(1)" }
          : { opacity: 0, scaleX: instant ? 1 : 0.02, scaleY: instant ? 1 : 0.004, filter: "brightness(2.6)" }
      }
      transition={
        instant
          ? { duration: 0 }
          : on
            ? {
                scaleX: { duration: 0.22, ease: EASE_OUT },
                scaleY: { duration: 0.34, ease: EASE_OUT, delay: 0.07 },
                filter: { duration: 0.7, ease: EASE_OUT, delay: 0.05 },
                opacity: { duration: 0.08 },
              }
            : {
                scaleY: { duration: 0.16, ease: EASE_OUT },
                scaleX: { duration: 0.18, ease: EASE_OUT, delay: 0.14 },
                filter: { duration: 0.16 },
                opacity: { duration: 0.1, delay: 0.3 },
              }
      }
      aria-hidden={!on}
    >
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <img {...poster} loading="eager" className="absolute inset-0 h-full w-full object-cover" draggable={false} />
      {hero.src && load && (
        <video
          ref={videoRef}
          src={hero.src}
          muted={muted}
          playsInline
          preload="auto"
          aria-hidden="true"
          onLoadedMetadata={(e) => {
            e.currentTarget.currentTime = start;
            if (on && play) e.currentTarget.play().catch(() => {});
          }}
          onTimeUpdate={(e) => {
            const v = e.currentTarget;
            // Loop just the clip; this also catches the browser's own loop back to 0.
            if (clip && (v.currentTime < clip[0] - 0.25 || v.currentTime >= clip[1])) v.currentTime = clip[0];
            if (on) onTime(Math.max(0, v.currentTime - from), clip ? clip[1] - clip[0] : v.duration || 0);
          }}
          onEnded={(e) => {
            e.currentTarget.currentTime = from;
            if (on && play) e.currentTarget.play().catch(() => {});
          }}
          onPlaying={(e) => {
            setShown(true);
            const v = e.currentTarget;
            // Chrome only counts decoded sound once some has played.
            setTimeout(() => {
              const s = hasSoundTrack(v);
              if (s !== null) onSound(s);
            }, 400);
          }}
          onCanPlayThrough={done}
          onSuspend={done}
          onError={done}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out ${shown ? "opacity-100" : "opacity-0"}`}
        />
      )}
    </motion.div>
  );
}

export type Osd = { text: string; key: number } | null;

/**
 * The big screen the player feeds: a dark bezel around the picture. With no
 * disc in, it shows the player's blue standby screen, a blueprint grid with
 * the mark, the way old disc players did.
 */
export function Screen({
  films,
  current,
  mounted,
  play,
  muted,
  instant,
  osd,
  standby,
  onToggle,
  onTime,
  onSound,
  stageRef,
}: {
  films: Film[];
  /** The film on the screen, or null for standby. */
  current: string | null;
  /** Films that have been on the screen (they stay mounted). */
  mounted: ReadonlySet<string>;
  play: boolean;
  muted: boolean;
  instant: boolean;
  /** A short on-screen message: PLAY, PAUSE, MUTE. */
  osd: Osd;
  /** The standby screen's message. */
  standby: string;
  onToggle: () => void;
  onTime: (t: number, length: number) => void;
  onSound: (slug: string, sound: boolean) => void;
  stageRef: RefObject<HTMLDivElement>;
}) {
  const film = films.find((f) => f.slug === current) ?? null;
  return (
    <div
      className="relative rounded-[16px] bg-[#0b0b0c] p-[5px] sm:rounded-[20px] sm:p-2 lg:rounded-[22px] lg:p-[9px]"
      style={{
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.12), inset 0 0 0 1px rgba(255,255,255,0.04), 0 1px 2px rgba(0,0,0,0.2), 0 24px 48px -24px rgba(0,0,0,0.45)",
      }}
    >
      <div ref={stageRef} className="relative aspect-video overflow-hidden rounded-[11px] bg-[#05070d] sm:rounded-[13px] lg:rounded-[14px]">
        {/* Standby: the blueprint */}
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: "#091633",
            backgroundImage:
              "radial-gradient(90% 80% at 50% 45%, rgba(37,86,200,0.42), rgba(9,22,51,0) 72%), linear-gradient(rgba(150,190,255,0.075) 1px, transparent 1px), linear-gradient(90deg, rgba(150,190,255,0.075) 1px, transparent 1px), linear-gradient(rgba(150,190,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(150,190,255,0.03) 1px, transparent 1px)",
            backgroundSize: "100% 100%, 80px 80px, 80px 80px, 16px 16px, 16px 16px",
            backgroundPosition: "0 0, -1px -1px, -1px -1px, -1px -1px, -1px -1px",
          }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 sm:gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icon.svg" alt="" className="h-9 w-9 opacity-60 brightness-0 invert sm:h-12 sm:w-12" draggable={false} />
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#b9cdf5]/70 sm:text-[11px]">{standby}</span>
          </div>
        </div>

        {films
          .filter((f) => mounted.has(f.slug))
          .map((f) => (
            <FilmLayer
              key={f.slug}
              film={f}
              on={f.slug === current}
              stageRef={stageRef}
              play={play}
              muted={muted}
              instant={instant}
              onTime={onTime}
              onSound={(s) => onSound(f.slug, s)}
            />
          ))}

        {/* On-screen display */}
        <div className="pointer-events-none absolute left-3 top-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-white sm:left-5 sm:top-4 sm:text-[13px]" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.6), 0 0 8px rgba(0,0,0,0.35)" }}>
          <AnimatePresence>
            {current && osd && (
              <motion.span
                key={osd.key}
                className="block"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.3 } }}
                transition={{ duration: 0.12 }}
              >
                {osd.text}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Glass */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(160deg,rgba(255,255,255,0.07),rgba(255,255,255,0)_38%)]" />

        {/* The picture plays and pauses like the player's own key */}
        <button
          type="button"
          onClick={onToggle}
          aria-label={film ? (play ? `Pause ${film.title}` : `Play ${film.title}`) : "Play the first film"}
          className="absolute inset-0 z-10 cursor-pointer rounded-[inherit] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#2563EB]"
        />
      </div>
    </div>
  );
}
