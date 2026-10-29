"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { getImageProps } from "next/image";
import { motion } from "framer-motion";
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

const YT = "https://www.youtube-nocookie.com";

/** What a YouTube film tells the machine: it started (cut to it), sound was refused (it plays muted), it ended, or it failed. */
export type FilmEvent = "playing" | "muted" | "ended" | "failed";

type YTInfo = { currentTime?: number; duration?: number; playerState?: number; muted?: boolean };

/**
 * The full film from YouTube, driven through the IFrame API's postMessage
 * protocol (no script), so the machine's own keys play, pause and mute it.
 * It stays hidden until it actually plays, then the screen cuts to it. It
 * asks for sound; where the browser refuses, it starts muted and says so.
 */
function YouTubeFilm({
  id,
  title,
  play,
  muted,
  onTime,
  onEvent,
}: {
  id: string;
  title: string;
  play: boolean;
  muted: boolean;
  onTime: (t: number, length: number) => void;
  onEvent: (e: FilmEvent) => void;
}) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [shown, setShown] = useState(false);
  const live = useRef({ play, muted, onTime, onEvent });
  live.current = { play, muted, onTime, onEvent };
  const st = useRef({ ready: false, state: -1, started: false, refused: false, duration: 0, timers: [] as number[] });

  const send = useCallback((func: string, args: unknown[] = []) => {
    ref.current?.contentWindow?.postMessage(JSON.stringify({ event: "command", func, args, id: 1, channel: "widget" }), YT);
  }, []);

  // The player sends its events back to our origin, so the URL waits for the browser.
  useEffect(() => {
    const q = new URLSearchParams({
      enablejsapi: "1",
      playsinline: "1",
      rel: "0",
      autoplay: "1",
      controls: "0",
      disablekb: "1",
      iv_load_policy: "3",
      mute: live.current.muted ? "1" : "0",
      origin: window.location.origin,
    });
    setSrc(`${YT}/embed/${id}?${q}`);
  }, [id]);

  useEffect(() => {
    const s = st.current;
    const later = (ms: number, fn: () => void) => s.timers.push(window.setTimeout(fn, ms));
    const state = (n: number) => {
      s.state = n;
      if (n === 1 && !s.started) {
        s.started = true;
        setShown(true);
        live.current.onEvent("playing");
      }
      if (n === 0) {
        // The end: back to the top, paused, as a disc stops.
        send("seekTo", [0, true]);
        send("pauseVideo");
        live.current.onEvent("ended");
      }
    };
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== YT || e.source !== ref.current?.contentWindow || typeof e.data !== "string") return;
      let d: { event?: string; info?: unknown };
      try {
        d = JSON.parse(e.data);
      } catch {
        return;
      }
      if ((d.event === "onReady" || d.event === "initialDelivery") && !s.ready) {
        s.ready = true;
        send("addEventListener", ["onStateChange"]);
        send("addEventListener", ["onError"]);
        // No auto-captions over the picture.
        send("unloadModule", ["captions"]);
        send(live.current.muted ? "mute" : "unMute");
        // autoplay=1 starts it; only a pause pressed while it loaded needs saying.
        if (!live.current.play) send("pauseVideo");
        // Sound refused: still not going two seconds on (and not just buffering), start it muted.
        later(2000, () => {
          if (s.started || s.state === 3 || !live.current.play || live.current.muted) return;
          s.refused = true;
          send("mute");
          send("playVideo");
          live.current.onEvent("muted");
          later(5000, () => {
            if (!s.started && s.state !== 3) live.current.onEvent("failed");
          });
        });
      } else if (d.event === "onError") {
        live.current.onEvent("failed");
      } else if (d.event === "onStateChange" && typeof d.info === "number") {
        state(d.info);
      } else if (d.event === "infoDelivery" && d.info && typeof d.info === "object") {
        const info = d.info as YTInfo;
        if (typeof info.duration === "number" && info.duration > 0) s.duration = info.duration;
        // The player muted itself to get going (some browsers' rule for sound): say so on the machine.
        if (info.muted === true && !live.current.muted && !s.refused && s.ready) {
          s.refused = true;
          live.current.onEvent("muted");
        }
        if (typeof info.playerState === "number") state(info.playerState);
        if (typeof info.currentTime === "number") live.current.onTime(info.currentTime, s.duration);
      }
    };
    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("message", onMessage);
      s.timers.forEach(clearTimeout);
    };
  }, [send]);

  // The machine's keys.
  useEffect(() => {
    if (st.current.ready) send(play ? "playVideo" : "pauseVideo");
  }, [play, send]);
  useEffect(() => {
    if (st.current.ready) send(muted ? "mute" : "unMute");
  }, [muted, send]);

  // Tell the player we're listening until it answers; no answer in six seconds and the kit loop takes over.
  const onLoad = () => {
    const s = st.current;
    let n = 0;
    const t = window.setInterval(() => {
      if (s.ready || n++ >= 24) {
        clearInterval(t);
        if (!s.ready) live.current.onEvent("failed");
        return;
      }
      ref.current?.contentWindow?.postMessage(JSON.stringify({ event: "listening", id: 1, channel: "widget" }), YT);
    }, 250);
    s.timers.push(t);
  };

  if (!src) return null;
  return (
    <iframe
      ref={ref}
      src={src}
      title={title}
      allow="autoplay; encrypted-media; picture-in-picture"
      referrerPolicy="strict-origin-when-cross-origin"
      onLoad={onLoad}
      // Taller than the screen, so the film letterboxes inside it and YouTube's own title bar
      // and logo sit in the bars, cropped off by the screen's edges; the picture fills the screen.
      className={`absolute inset-x-0 -top-[30%] h-[160%] w-full border-0 transition-opacity duration-300 ease-out ${shown ? "opacity-100" : "opacity-0"}`}
    />
  );
}

/** The kit's clip, looping just its stretch as the Showcase does: for a film with no YouTube cut, or when YouTube fails. */
function KitLoop({
  film,
  on,
  stageRef,
  play,
  muted,
  onTime,
  onSound,
}: {
  film: Film;
  on: boolean;
  stageRef: RefObject<HTMLDivElement | null>;
  play: boolean;
  muted: boolean;
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

  if (!hero.src || !load) return null;
  return (
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
  );
}

/**
 * One film on the screen: its poster at once, then the full film from YouTube
 * once its disc is in (the kit's loop where there's no YouTube cut, or it
 * fails). The layer stays mounted after it has played; the iframe doesn't.
 */
function FilmLayer({
  film,
  on,
  failed,
  stageRef,
  play,
  muted,
  instant,
  onTime,
  onSound,
  onFilm,
}: {
  film: Film;
  on: boolean;
  /** YouTube failed for this film: play its kit loop instead. */
  failed: boolean;
  stageRef: RefObject<HTMLDivElement | null>;
  play: boolean;
  muted: boolean;
  instant: boolean;
  onTime: (t: number, length: number) => void;
  onSound: (sound: boolean) => void;
  onFilm: (e: FilmEvent) => void;
}) {
  const { hero } = film;
  const poster = hero.remote
    ? { src: hero.poster }
    : getImageProps({ alt: hero.alt, src: hero.poster, width: 2560, height: 1440, quality: 80, sizes: "(min-width: 1024px) 940px, 100vw" }).props;

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
      {/* eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element */}
      <img {...poster} alt="" loading="eager" className="absolute inset-0 h-full w-full object-cover" draggable={false} />
      {film.youtube && !failed ? (
        on && <YouTubeFilm id={film.youtube} title={`${film.title}, ${film.client}`} play={play} muted={muted} onTime={onTime} onEvent={onFilm} />
      ) : (
        <KitLoop film={film} on={on} stageRef={stageRef} play={play} muted={muted} onTime={onTime} onSound={onSound} />
      )}
    </motion.div>
  );
}


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
  standby,
  onToggle,
  onTime,
  onSound,
  onFilm,
  failed,
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
  /** The standby screen's message. */
  standby: string;
  onToggle: () => void;
  onTime: (t: number, length: number) => void;
  onSound: (slug: string, sound: boolean) => void;
  onFilm: (slug: string, e: FilmEvent) => void;
  /** Films whose YouTube cut failed; they play their kit loop. */
  failed: ReadonlySet<string>;
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
              failed={failed.has(f.slug)}
              stageRef={stageRef}
              play={play}
              muted={muted}
              instant={instant}
              onTime={onTime}
              onSound={(s) => onSound(f.slug, s)}
              onFilm={(e) => onFilm(f.slug, e)}
            />
          ))}

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
