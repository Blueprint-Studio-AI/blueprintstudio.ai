"use client";

import type { KeyboardEvent, ReactNode } from "react";
import { Archive, BadgeCheck, Globe, Lock } from "lucide-react";
import type { SiteTab } from "./types";

// The pieces both browsers share: the system font, favicons, the address,
// the Original tag, and the tab keys. No loading ring or bar: the capture
// is up at once and the live page takes its place quietly, so a site never
// looks slow here.

/** Browser chrome is set in the system's UI font, as a real browser's is. */
export const CHROME_FONT = "[font-family:-apple-system,BlinkMacSystemFont,system-ui,'Segoe_UI',Roboto,sans-serif]";

export function Favicon({ src, className = "" }: { src?: string; className?: string }) {
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

/** Marks a live site that's still the one we made. */
export function OriginalTag({ label, className = "" }: { label: ReactNode; className?: string }) {
  return (
    <span
      title="Live, and still the site we designed and built"
      className={`inline-flex shrink-0 items-center gap-[0.3em] whitespace-nowrap rounded-full bg-[#E7F3EA] py-[0.2em] pl-[0.45em] pr-[0.6em] font-medium text-[#1E6B34] ${className}`}
    >
      <BadgeCheck aria-hidden className="h-[1.1em] w-[1.1em]" strokeWidth={2.2} />
      {label}
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
