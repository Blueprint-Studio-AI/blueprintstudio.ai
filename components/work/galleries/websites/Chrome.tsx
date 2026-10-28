"use client";

import { useEffect, type KeyboardEvent, type ReactNode } from "react";
import { animate, motion, useMotionValue } from "framer-motion";
import { Archive, Globe, Lock } from "lucide-react";
import type { SiteTab } from "./types";

// The pieces both browsers share: the system font, favicons with Chrome's
// loading ring, the address, the loading bar, and the tab keys.

/** Browser chrome is set in the system's UI font, as a real browser's is. */
export const CHROME_FONT = "[font-family:-apple-system,BlinkMacSystemFont,system-ui,'Segoe_UI',Roboto,sans-serif]";
export const LOAD_BLUE = "#0A84FF";

export function Favicon({ src, loading = false, className = "" }: { src?: string; loading?: boolean; className?: string }) {
  if (loading)
    return (
      // Chrome swaps the favicon for a spinning ring while the page loads.
      <svg aria-hidden viewBox="0 0 16 16" className={`shrink-0 animate-spin [animation-duration:900ms] ${className}`}>
        <circle cx="8" cy="8" r="6.25" fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1.75" />
        <circle cx="8" cy="8" r="6.25" fill="none" stroke={LOAD_BLUE} strokeWidth="1.75" strokeLinecap="round" strokeDasharray="12 40" />
      </svg>
    );
  if (!src) return <Globe aria-hidden className={`shrink-0 text-[#5F6368] ${className}`} strokeWidth={1.75} />;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" aria-hidden className={`shrink-0 object-contain ${className}`} />;
}

export function TrafficLights({ className = "", dot = "h-[12px] w-[12px]" }: { className?: string; dot?: string }) {
  return (
    <span aria-hidden className={`flex shrink-0 items-center ${className}`}>
      {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
        <span key={c} className={`${dot} rounded-full shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.12)]`} style={{ backgroundColor: c }} />
      ))}
    </span>
  );
}

/** The address: a live site's lock and domain; an archived site's tag and where it used to be. */
export function AddressText({ tab, archived, icon }: { tab: SiteTab; archived: ReactNode; icon: string }) {
  const { host, path, live } = tab.address;
  if (live)
    return (
      <>
        <Lock aria-hidden className={`${icon} shrink-0 text-[#5F6368]`} strokeWidth={2.2} />
        <span className="min-w-0 truncate tracking-[-0.005em]">
          <span className="text-[#1F1F1F]">{host}</span>
          <span className="text-[#70757A]">{path}</span>
        </span>
      </>
    );
  return (
    <>
      <span className="inline-flex shrink-0 items-center gap-[0.3em] rounded-[0.4em] bg-black/[0.06] py-[0.12em] pl-[0.4em] pr-[0.5em] text-[0.88em] font-medium text-[#5F6368]">
        <Archive aria-hidden className="h-[1em] w-[1em]" strokeWidth={2.2} />
        {archived}
      </span>
      {host && (
        <span className="min-w-0 truncate tracking-[-0.005em] text-[#80868B]">
          {host}
          {path}
        </span>
      )}
    </>
  );
}

/**
 * The thin bar a browser draws while a page loads: it creeps on while the
 * tab's page loads, runs out when it's there, and fades. Not on first load.
 */
export function LoadBar({ run, loading, armed, reduce, className = "" }: { run: string; loading: boolean; armed: boolean; reduce: boolean; className?: string }) {
  const progress = useMotionValue(0);
  const opacity = useMotionValue(0);

  useEffect(() => {
    if (!armed || reduce) return;
    progress.set(0.06);
    opacity.set(1);
    const creep = animate(progress, 0.86, { duration: 2.6, ease: [0.12, 0.8, 0.3, 1] });
    return () => creep.stop();
  }, [run, armed, reduce, progress, opacity]);

  useEffect(() => {
    if (!armed || reduce || loading) return;
    const finish = animate(progress, 1, { duration: 0.18, ease: [0.22, 1, 0.36, 1] });
    const fade = animate(opacity, 0, { duration: 0.24, delay: 0.2, ease: [0.22, 1, 0.36, 1] });
    return () => {
      finish.stop();
      fade.stop();
    };
  }, [run, loading, armed, reduce, progress, opacity]);

  return (
    <motion.span
      aria-hidden
      style={{ scaleX: progress, opacity, backgroundColor: LOAD_BLUE }}
      className={`pointer-events-none absolute left-0 h-[2px] w-full origin-left ${className}`}
    />
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
