"use client";

import { useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { motion } from "framer-motion";
import { clock, track, type Film } from "./shared";

export type PlayerStatus = "empty" | "reading" | "playing" | "paused";

/** The player's size: the phone's is a little smaller and its keys a little bigger. */
export interface PlayerSize {
  well: number;
  disc: number;
  pad: number;
  key: number;
  radius: number;
}

export const PLAYER_DESK: PlayerSize = { well: 176, disc: 166, pad: 20, key: 30, radius: 30 };
export const PLAYER_PHONE: PlayerSize = { well: 118, disc: 110, pad: 12, key: 34, radius: 24 };

const Icon = {
  prev: (
    <svg viewBox="0 0 12 12" className="h-[11px] w-[11px]" fill="currentColor" aria-hidden="true">
      <rect x="1.5" y="2" width="1.6" height="8" rx="0.5" />
      <path d="M10.5 2.4v7.2a.5.5 0 0 1-.78.42L4.4 6.42a.5.5 0 0 1 0-.84l5.32-3.6a.5.5 0 0 1 .78.42Z" />
    </svg>
  ),
  next: (
    <svg viewBox="0 0 12 12" className="h-[11px] w-[11px]" fill="currentColor" aria-hidden="true">
      <rect x="8.9" y="2" width="1.6" height="8" rx="0.5" />
      <path d="M1.5 2.4v7.2a.5.5 0 0 0 .78.42L7.6 6.42a.5.5 0 0 0 0-.84L2.28 1.98a.5.5 0 0 0-.78.42Z" />
    </svg>
  ),
  play: (
    <svg viewBox="0 0 12 12" className="h-[11px] w-[11px] translate-x-[0.5px]" fill="currentColor" aria-hidden="true">
      <path d="M3 2.1v7.8a.6.6 0 0 0 .92.5l6.1-3.9a.6.6 0 0 0 0-1L3.92 1.6A.6.6 0 0 0 3 2.1Z" />
    </svg>
  ),
  pause: (
    <svg viewBox="0 0 12 12" className="h-[11px] w-[11px]" fill="currentColor" aria-hidden="true">
      <rect x="2.4" y="2" width="2.6" height="8" rx="0.7" />
      <rect x="7" y="2" width="2.6" height="8" rx="0.7" />
    </svg>
  ),
  muted: (
    <svg viewBox="0 0 12 12" className="h-[12px] w-[12px]" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1.8 4.6h1.7L6 2.5v7L3.5 7.4H1.8Z" fill="currentColor" />
      <path d="m8.2 4.6 2.6 2.8M10.8 4.6 8.2 7.4" />
    </svg>
  ),
  sound: (
    <svg viewBox="0 0 12 12" className="h-[12px] w-[12px]" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1.8 4.6h1.7L6 2.5v7L3.5 7.4H1.8Z" fill="currentColor" />
      <path d="M8 4.3a2.4 2.4 0 0 1 0 3.4M9.5 3a4.2 4.2 0 0 1 0 6" />
    </svg>
  ),
  eject: (
    <svg viewBox="0 0 12 12" className="h-[11px] w-[11px]" fill="currentColor" aria-hidden="true">
      <path d="M5.55 2.2a.6.6 0 0 1 .9 0l3.4 3.9a.6.6 0 0 1-.45 1H2.6a.6.6 0 0 1-.45-1Z" />
      <rect x="2" y="8.3" width="8" height="1.6" rx="0.5" />
    </svg>
  ),
};

/** A round key with a little travel, the cap lit from above. */
function Key({
  label,
  onPress,
  disabled,
  accent,
  size,
  children,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  accent?: boolean;
  size: number;
  children: ReactNode;
}) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onPress}
      whileTap={disabled ? undefined : { scale: 0.97, y: 1 }}
      transition={{ type: "spring", visualDuration: 0.16, bounce: 0.2 }}
      className={`relative flex shrink-0 cursor-pointer items-center justify-center rounded-full outline-none transition-[filter,opacity] duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB] disabled:cursor-default disabled:opacity-45 [@media(hover:hover)]:hover:brightness-[1.03] ${
        accent ? "text-white" : "text-[#3a3936]"
      }`}
      style={{
        width: size,
        height: size,
        background: accent ? "linear-gradient(#ff8a47, #f2601a)" : "linear-gradient(#fbfaf8, #e2e0db)",
        boxShadow: accent
          ? "inset 0 1px 0 rgba(255,255,255,0.45), inset 0 -1px 1px rgba(120,30,0,0.25), 0 0 0 1px rgba(150,50,0,0.25), 0 1px 2px rgba(0,0,0,0.25), 0 3px 6px -2px rgba(200,70,0,0.35)"
          : "inset 0 1px 0 rgba(255,255,255,0.95), inset 0 -1px 1px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.09), 0 1px 2px rgba(0,0,0,0.16), 0 3px 6px -2px rgba(0,0,0,0.12)",
      }}
    >
      {children}
    </motion.button>
  );
}

/** One line of the display that scrolls when it doesn't fit, as a deck's does. */
function Marquee({ text, still }: { text: string; still: boolean }) {
  const box = useRef<HTMLSpanElement>(null);
  const inner = useRef<HTMLSpanElement>(null);
  const [over, setOver] = useState(0);
  useLayoutEffect(() => {
    const b = box.current;
    const i = inner.current;
    if (!b || !i) return;
    const measure = () => setOver(Math.max(0, Math.ceil(i.scrollWidth - b.clientWidth)));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(b);
    return () => ro.disconnect();
  }, [text]);
  const run = over > 0 && !still;
  const secs = 2.4 + over / 22;
  return (
    <span ref={box} className={`block overflow-hidden whitespace-nowrap ${over > 0 && still ? "text-ellipsis" : ""}`}>
      <motion.span
        key={text}
        ref={inner}
        className="inline-block"
        initial={{ x: 0 }}
        animate={run ? { x: [0, 0, -over, -over, 0] } : { x: 0 }}
        transition={run ? { duration: secs * 2, times: [0, 0.25, 0.5, 0.75, 1], ease: "easeInOut", repeat: Infinity } : { duration: 0 }}
      >
        {text}
      </motion.span>
    </span>
  );
}

/**
 * The machine: a disc well with its spindle on the left, a small display and
 * five keys on the right. The disc itself is passed in, so the gallery can
 * hand it over from the flight without a seam.
 */
export function Player({
  size,
  film,
  index,
  count,
  status,
  time,
  progress,
  grille,
  muted,
  sound,
  reduce,
  onPlay,
  onPrev,
  onNext,
  onMute,
  onEject,
  wellRef,
  children,
}: {
  size: PlayerSize;
  film: Film | null;
  index: number;
  count: number;
  status: PlayerStatus;
  time: number | null;
  /** How far into the clip, 0 to 1. */
  progress: number | null;
  /** A speaker grille between the display and the keys, where there's room. */
  grille: boolean;
  muted: boolean;
  /** Whether the film in it has a sound track; null before it's known. */
  sound: boolean | null;
  reduce: boolean;
  onPlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onMute: () => void;
  onEject: () => void;
  wellRef: RefObject<HTMLDivElement>;
  children?: ReactNode;
}) {
  const { well, disc, pad, key, radius } = size;
  const playing = status === "playing" || status === "reading";
  const lit = status !== "empty";
  const glyph = status === "empty" ? "■" : status === "paused" ? "❚❚" : "▶";
  const segs = grille ? 30 : 24;
  const litSegs = progress === null ? 0 : Math.round(progress * segs);

  return (
    <div
      className="relative flex w-full items-stretch"
      style={{
        height: well + pad * 2,
        padding: pad,
        gap: pad,
        borderRadius: radius,
        background: "linear-gradient(180deg, #f4f3f0 0%, #e7e5e0 100%)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.95), inset 0 -2px 3px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.07), 0 1px 1px rgba(0,0,0,0.06), 0 10px 24px -10px rgba(0,0,0,0.28), 0 30px 50px -30px rgba(0,0,0,0.25)",
      }}
    >
      {/* The well: a dark recess with the spindle, where the disc sits */}
      <div
        className="relative shrink-0 overflow-hidden rounded-full"
        style={{
          width: well,
          height: well,
          background:
            "repeating-radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03) 0 1px, transparent 1px 3px), radial-gradient(circle at 50% 30%, #3b3a38, #232220 62%, #1a1918)",
          boxShadow: "inset 0 4px 10px rgba(0,0,0,0.65), inset 0 -1px 2px rgba(255,255,255,0.08), 0 0 0 1px rgba(0,0,0,0.1), 0 1px 0 rgba(255,255,255,0.95)",
        }}
      >
        {/* The laser's lens, seen with no disc in */}
        <div
          className="absolute rounded-full"
          style={{
            width: well * 0.075,
            height: well * 0.075,
            left: well * 0.5 - well * 0.0375,
            top: well * 0.7,
            background: "radial-gradient(circle at 38% 32%, #c9d4ff 0, #6b7bc4 22%, #1f2547 62%, #0c0e1b)",
            boxShadow: "0 0 0 2px #121212, 0 0 0 3px rgba(255,255,255,0.06)",
          }}
        />
        {/* Spindle */}
        <div
          className="absolute left-1/2 top-1/2 rounded-full"
          style={{
            width: well * 0.13,
            height: well * 0.13,
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(circle at 38% 30%, #ffffff, #cfcfcf 40%, #7d7d7d 100%)",
            boxShadow: "0 0 0 3px rgba(0,0,0,0.35), 0 2px 4px rgba(0,0,0,0.5)",
          }}
        />
        <div ref={wellRef} className="absolute left-1/2 top-1/2" style={{ width: disc, height: disc, marginLeft: -disc / 2, marginTop: -disc / 2 }}>
          {children}
        </div>
        {/* A clear cover over it all */}
        <div className="pointer-events-none absolute inset-0 rounded-full bg-[linear-gradient(150deg,rgba(255,255,255,0.16),rgba(255,255,255,0)_38%,rgba(255,255,255,0)_70%,rgba(255,255,255,0.05))]" />
      </div>

      {/* Display, speaker and keys */}
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div
          className="relative overflow-hidden rounded-[10px] px-3 pb-2 pt-2.5 font-mono uppercase"
          style={{
            background: "linear-gradient(180deg, #0c1413, #101a19)",
            boxShadow: "inset 0 2px 6px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.8)",
          }}
          aria-live="polite"
        >
          <div
            className={`relative text-[10px] leading-[1.5] tracking-[0.08em] ${lit ? "text-[#9ef7e4]" : "text-[#9ef7e4]/70"}`}
            style={{ textShadow: "0 0 6px rgba(110,255,225,0.45)" }}
          >
            <div className="flex items-center justify-between gap-2 tabular-nums">
              <span className="flex items-center gap-2">
                <span className="inline-block w-[1.6em] text-center">{glyph}</span>
                <span>{film ? `${track(index)}/${track(count - 1)}` : `--/${track(count - 1)}`}</span>
              </span>
              <span>{film && time !== null ? clock(time) : "-:--"}</span>
            </div>
            <div className="mt-[3px] text-[12px] font-medium leading-[1.35] tracking-[0.06em]">
              {status === "empty" ? "No disc" : status === "reading" ? "Reading…" : <Marquee text={film?.title ?? ""} still={reduce} />}
            </div>
            <div className="mt-[2px] flex items-center justify-between gap-2">
              <span className="truncate text-[#9ef7e4]/75">{film ? `${film.client} · ${film.year}` : `${count} films`}</span>
              <span className={`shrink-0 ${film ? "text-[#9ef7e4]/75" : "text-[#9ef7e4]/30"}`}>
                {film && sound === false ? "No sound" : muted ? "Mute" : "Sound"}
              </span>
            </div>
            {/* How far into the clip */}
            <div className="mt-1.5 flex h-[3px] gap-px" aria-hidden="true">
              {Array.from({ length: segs }, (_, i) => (
                <span key={i} className={`flex-1 rounded-[0.5px] ${i < litSegs ? "bg-[#9ef7e4]" : "bg-[#9ef7e4]/15"}`} />
              ))}
            </div>
          </div>
          {/* Glass */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(170deg,rgba(255,255,255,0.09),rgba(255,255,255,0)_45%)]" />
        </div>

        {grille && (
          <div
            aria-hidden="true"
            className="mx-1 my-3 min-h-0 flex-1"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(70,64,56,0.34) 1.1px, rgba(255,255,255,0.7) 1.5px, transparent 1.9px)",
              backgroundSize: "8px 8px",
              backgroundPosition: "center",
            }}
          />
        )}

        <div className="flex items-center justify-between">
          <Key label="Previous film" onPress={onPrev} size={key}>
            {Icon.prev}
          </Key>
          <Key label={playing ? "Pause" : "Play"} onPress={onPlay} accent size={key}>
            {playing ? Icon.pause : Icon.play}
          </Key>
          <Key label="Next film" onPress={onNext} size={key}>
            {Icon.next}
          </Key>
          <Key
            label={sound === false ? "This film has no sound" : muted ? "Sound on" : "Mute"}
            onPress={onMute}
            disabled={!film || sound === false}
            size={key}
          >
            {muted || sound === false ? Icon.muted : Icon.sound}
          </Key>
          <Key label="Eject" onPress={onEject} disabled={!film} size={key}>
            {Icon.eject}
          </Key>
        </div>
      </div>

      {/* Power light */}
      <span
        aria-hidden="true"
        className={`absolute rounded-full transition-[background-color,box-shadow] duration-500 ${
          playing ? "bg-[#FF6A1A] shadow-[0_0_8px_2px_rgba(255,106,26,0.55)]" : lit ? "bg-[#ffb48a]" : "bg-[#cfccc5]"
        }`}
        style={{ width: 6, height: 6, top: pad * 0.6, right: radius * 0.75 }}
      />
    </div>
  );
}
