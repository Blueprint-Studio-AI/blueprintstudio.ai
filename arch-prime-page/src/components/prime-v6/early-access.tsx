"use client";

// Early access — the page's one action. Every "Get early access" on /prime-v6 (the three
// buttons, the nav, the phone bar) is a plain link to #early-access; a capture-phase listener
// opens this dialog instead of navigating. The section map's default for decision 3: a short
// Arch-hosted sign-up, email plus what you would bring, never a link to X.
// PROTOTYPE: nothing is sent anywhere. Submitting only shows the confirmation state.

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { EARLY_HREF } from "@/data/prime-v6";

export type EarlyCopy = {
  title: string;
  body: string;
  bringLabel: string;
  bring: readonly string[];
  submit: string;
  doneTitle: string;
  doneBody: string;
};

type Lenis = { stop: () => void; start: () => void };

export function EarlyAccess({ copy }: { copy: EarlyCopy }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [sent, setSent] = useState(false);
  const doneRef = useRef<HTMLHeadingElement>(null);

  // the submit button unmounts on send; move focus to the confirmation so it is announced
  useEffect(() => {
    if (sent) doneRef.current?.focus();
  }, [sent]);

  useEffect(() => {
    const lenis = () => (window as Window & { __lenis?: Lenis }).__lenis;
    const open = () => {
      const d = dialog.current;
      if (!d || d.open) return;
      setSent(false);
      d.showModal();
      lenis()?.stop();
    };
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || !a.getAttribute("href")?.endsWith(EARLY_HREF)) return;
      // no stopPropagation: the link's own onClick (e.g. the phone menu closing itself) still runs
      e.preventDefault();
      open();
    };
    document.addEventListener("click", onClick, true);
    if (window.location.hash === EARLY_HREF) open();
    const d = dialog.current;
    const onClose = () => lenis()?.start();
    d?.addEventListener("close", onClose);
    return () => {
      document.removeEventListener("click", onClick, true);
      d?.removeEventListener("close", onClose);
    };
  }, []);

  return (
    <dialog
      ref={dialog}
      aria-labelledby="early-title"
      onClick={(e) => {
        if (e.target === dialog.current) dialog.current?.close();
      }}
      className="prime-scope m-auto max-h-[calc(100dvh-32px)] w-[min(480px,calc(100vw-32px))] overflow-hidden rounded-[24px] bg-white p-0 text-[var(--p-ink)] shadow-[0_32px_80px_rgba(9,24,50,0.35)] backdrop:bg-[#0d2249]/55 backdrop:backdrop-blur-[6px]"
    >
      {/* Lenis is stopped while the dialog is open; data-lenis-prevent lets this scroll natively
          wherever the dialog is taller than the window (short laptops, a phone with the keyboard up) */}
      <div data-lenis-prevent className="relative max-h-[calc(100dvh-32px)] overflow-y-auto overscroll-contain p-7 sm:p-9">
        <button
          type="button"
          aria-label="Close"
          onClick={() => dialog.current?.close()}
          className="absolute top-5 right-5 grid h-9 w-9 place-items-center rounded-full text-[#787878] transition-colors hover:bg-black/5 hover:text-[#292a2e]"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
            <path d="M1 1l12 12M13 1L1 13" />
          </svg>
        </button>

        <Image src="/img/prime/arch-prime-logo.svg" alt="Arch Prime" width={138} height={19} className="h-[19px] w-auto" />

        {sent ? (
          <div className="mt-10" role="status">
            <h2 ref={doneRef} tabIndex={-1} id="early-title" className="font-serif text-[32px] leading-10 tracking-[-0.03em] outline-none">
              {copy.doneTitle}
            </h2>
            <p className="mt-4 text-[16px] leading-6 text-[#5c5c5c]">{copy.doneBody}</p>
            <button
              type="button"
              onClick={() => dialog.current?.close()}
              className="mt-8 h-14 w-full rounded-[12px] bg-[#f1f0f0] text-[16px] font-medium tracking-[-0.02em] transition-colors hover:bg-[#e8e7e7]"
            >
              Done
            </button>
          </div>
        ) : (
          <form
            className="mt-8"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <h2 id="early-title" className="font-serif text-[32px] leading-10 tracking-[-0.03em]">
              {copy.title}
            </h2>
            <p className="mt-3 text-[16px] leading-6 text-[#5c5c5c]">{copy.body}</p>

            <label className="mt-7 block">
              <span className="text-[14px] leading-5 text-[#6e6e6e]">Email</span>
              <input
                type="email"
                required
                autoFocus
                autoComplete="email"
                placeholder="you@example.com"
                className="mt-2 h-14 w-full rounded-[12px] border border-[#dadada] bg-white px-4 text-[16px] outline-none transition-colors placeholder:text-[#b6b6b6] focus:border-[#292a2e]"
              />
            </label>

            <fieldset className="mt-6">
              <legend className="text-[14px] leading-5 text-[#6e6e6e]">{copy.bringLabel}</legend>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {copy.bring.map((b, i) => (
                  <label key={b} className="cursor-pointer">
                    <input type="radio" name="bring" value={b} defaultChecked={i === 0} className="peer sr-only" />
                    <span className="flex h-12 items-center justify-center rounded-[12px] border border-[#dadada] text-[15px] transition-colors peer-checked:border-[#292a2e] peer-checked:bg-[#292a2e] peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-[#ff5e00]/40">
                      {b}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <button
              type="submit"
              className="mt-8 h-14 w-full rounded-[12px] bg-[var(--p-orange)] text-[17px] font-medium tracking-[-0.02em] text-white transition-[filter,transform] hover:brightness-[1.06] active:scale-[0.99]"
            >
              {copy.submit}
            </button>
            <p className="mt-4 text-center text-[12px] leading-4 text-[#9a9a9a]">Prototype: this form doesn&apos;t send anything.</p>
          </form>
        )}
      </div>
    </dialog>
  );
}
