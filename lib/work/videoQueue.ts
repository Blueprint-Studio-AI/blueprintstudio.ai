"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

// The home page's staged loading for portfolio clips. They stay unloaded until
// the hero reel has landed (it sends "bp:opening-landed"), so they don't
// compete with it; then they load in page order, two at a time. A clip that
// comes near the screen, or that someone asks for, loads straight away.
// Elsewhere (the /work pages) clips simply load as they come near the screen.

type Waiter = { start: () => boolean; started: boolean }; // start: false if it took no slot
const waiting: Waiter[] = [];
const MAX_LOADING = 2;
let released = false;
let loading = 0;

function pump() {
  while (released && loading < MAX_LOADING) {
    const next = waiting.find((w) => !w.started);
    if (!next) return;
    next.started = true;
    if (next.start()) loading++;
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

const NEAR = "100% 0px";

/**
 * Whether a clip may load yet. `staged` joins the home page's queue; `now`
 * (someone picked it) skips any wait. Returns [load, done]: call done once the
 * clip has buffered (or failed), so the next one can start.
 */
export function useClipLoad(
  ref: RefObject<HTMLElement | null>,
  { staged, now, enabled = true }: { staged: boolean; now: boolean; enabled?: boolean }
): [boolean, () => void] {
  const [load, setLoad] = useState(false);
  const slot = useRef(false);

  useEffect(() => {
    if (now && enabled) setLoad(true);
  }, [now, enabled]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled || load) return;
    let waiter: Waiter | null = null;
    if (staged) {
      const w: Waiter = {
        started: false,
        start: () => {
          // Hidden at this width: leave it to the observer below.
          if (el.getClientRects().length === 0) {
            w.started = false;
            waiting.splice(waiting.indexOf(w), 1);
            return false;
          }
          slot.current = true;
          setLoad(true);
          return true;
        },
      };
      waiter = w;
      waiting.push(w);
      pump();
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        // Near the screen: jump the queue without taking a slot (and on pages
        // without the queue, that's the only way in).
        if (staged && waiter?.started) return;
        if (waiter) waiter.started = true;
        setLoad(true);
      },
      { rootMargin: NEAR }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (waiter && waiting.includes(waiter)) waiting.splice(waiting.indexOf(waiter), 1);
    };
  }, [ref, staged, enabled, load]);

  // Give a slot back when the clip unmounts mid-load.
  useEffect(
    () => () => {
      if (slot.current) {
        slot.current = false;
        loading--;
        pump();
      }
    },
    []
  );

  const done = () => {
    if (!slot.current) return;
    slot.current = false;
    loading--;
    pump();
  };

  return [load, done];
}
