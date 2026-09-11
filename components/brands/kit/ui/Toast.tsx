"use client";

// Toasts — the page's one channel for "that worked".
//
// Copy and download are both invisible actions: the browser gives no feedback
// for a clipboard write, and a download often lands in a folder the visitor
// isn't looking at. Before this, a colour chip flashed a bare checkmark and left
// you guessing what it had done. Every such action now says so in words.
//
// Bottom-centre and pointer-events-none on purpose: it must never sit over the
// control you just used, or intercept the next click.
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";

type Toast = { id: number; message: string };

const ToastCtx = createContext<(message: string) => void>(() => {});

/** `toast("Copied #F47000")` from anywhere inside the provider. */
export const useToast = () => useContext(ToastCtx);

const LIFETIME = 2600;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const seq = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const t = timers.current;
    return () => t.forEach(clearTimeout);
  }, []);

  const push = useCallback((message: string) => {
    const id = ++seq.current;
    setToasts((list) => {
      // Re-firing the same message (mashing copy) replaces rather than stacks.
      const withoutDupes = list.filter((t) => t.message !== message);
      // Hard cap so a fast clicker can't paper over the page.
      return [...withoutDupes, { id, message }].slice(-3);
    });
    timers.current.push(setTimeout(() => setToasts((list) => list.filter((t) => t.id !== id)), LIFETIME));
  }, []);

  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div
        // aria-live on a container that only ever gains children: each new toast
        // is announced once, and the visual copy IS the announcement.
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-8 z-[80] flex flex-col items-center gap-2 px-4 max-[860px]:bottom-5"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className="toast-in flex max-w-full items-center gap-2.5 rounded-full bg-[rgba(18,18,18,0.92)] px-5 py-3 text-label text-white shadow-[0_10px_40px_rgba(0,0,0,0.28)] backdrop-blur-md"
          >
            <svg width="13" height="13" viewBox="0 0 12 12" fill="none" aria-hidden className="shrink-0">
              <path d="M2.4 6.3l2.4 2.3 4.8-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="truncate">{t.message}</span>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
