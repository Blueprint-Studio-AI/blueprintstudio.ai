"use client";

// Review notes: where the page waits on a decision (the section map's §8), a small annotation
// marks the gap instead of an invented answer. Hidden by default; the review switcher's "Notes"
// toggle shows them. Not part of the page's design.

import { useSyncExternalStore } from "react";

const KEY = "prime-v6-notes";
const listeners = new Set<() => void>();

function read(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.dataset.v6Notes === "on";
}

export function initNotes() {
  let on = false;
  try {
    on = window.localStorage.getItem(KEY) === "on";
  } catch {
    // private mode
  }
  document.documentElement.dataset.v6Notes = on ? "on" : "off";
  listeners.forEach((l) => l());
}

export function setNotes(on: boolean) {
  document.documentElement.dataset.v6Notes = on ? "on" : "off";
  try {
    window.localStorage.setItem(KEY, on ? "on" : "off");
  } catch {
    // private mode
  }
  listeners.forEach((l) => l());
}

export function useNotes(): boolean {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    read,
    () => false,
  );
}

export function Note({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`v6-note rounded-[12px] border border-dashed border-[#e0b457] bg-[#fff8e8] px-3.5 py-2.5 text-[13px] leading-5 text-[#7a5410] ${className}`}>
      <span className="mr-1.5 font-semibold tracking-[0.02em] uppercase">Pending</span>
      {children}
    </p>
  );
}
