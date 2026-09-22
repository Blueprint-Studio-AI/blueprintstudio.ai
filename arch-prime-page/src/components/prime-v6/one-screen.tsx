"use client";

// §3 — the page's only list of capabilities, shown as the account itself. The Portfolio screen
// sits large and unobstructed (it is what /chain can't show: every position in one place); the
// three rows beside it are the diagram's three parts. Opening one slides that part's own screen
// in as a card over the Portfolio, which steps back behind it. The reader clicks; scrolling never
// drives it. Phone: the Account panel, then the rows as text — four masked screens stacked would
// read as an empty product.
// The rows are a disclosure list (each title expands its own line), not tabs.

import { useState } from "react";
import Image from "next/image";
import { T } from "@/components/prime-ui";

type Crop = { src: string; w: number; h: number; alt: string };
type Row = { id: string; name: string; title: string; body: string; crop: Crop };

// the inset card's width on the desktop stage, per screen shape
const INSET_W: Record<string, string> = { earn: "44%", trade: "70%", borrow: "31%" };

export function OneScreen({
  base,
  baseMobile,
  rows,
  next,
  caption,
}: {
  base: { src: string; alt: string };
  baseMobile: { src: string; w: number; h: number; alt: string };
  rows: readonly Row[];
  next: { name: string; tag: string; title: string };
  caption: string;
}) {
  const [active, setActive] = useState<string | null>(null);

  const nextRow = (
    <div className="flex items-baseline justify-between gap-4 border-t border-[#e6e6e6] pt-4">
      <span className="flex flex-col gap-0.5">
        <span className={`${T.label} text-[#6e6e6e]`}>{next.name}</span>
        <span className={`${T.body} font-medium`}>{next.title}</span>
      </span>
      <span className={`${T.label} shrink-0 text-[#6e6e6e]`}>{next.tag}</span>
    </div>
  );

  return (
    <>
      {/* desktop */}
      <div className="hidden grid-cols-12 gap-x-8 lg:grid">
        <div className="col-span-4 flex flex-col">
          <ul className="m-0 list-none border-t border-[#e6e6e6] p-0">
            {rows.map((r) => {
              const on = r.id === active;
              return (
                <li key={r.id} className="relative border-b border-[#e6e6e6]">
                  <span aria-hidden className="absolute top-6 bottom-6 -left-5 w-[2px] rounded-full bg-[var(--p-ink)] transition-opacity duration-300" style={{ opacity: on ? 1 : 0 }} />
                  <button
                    type="button"
                    aria-expanded={on}
                    aria-controls={`os-${r.id}`}
                    onClick={() => setActive(on ? null : r.id)}
                    className="group block w-full cursor-pointer pt-6 pb-2 text-left"
                  >
                    <span className={`${T.label} block transition-colors ${on ? "text-[var(--p-ink)]" : "text-[#6e6e6e]"}`}>{r.name}</span>
                    <span className={`${T.sub} mt-1 block font-serif transition-colors ${on ? "text-[var(--p-ink)]" : "text-[#8c8c8c] group-hover:text-[#4d4d4d]"}`}>{r.title}</span>
                  </button>
                  <div id={`os-${r.id}`} className="grid pb-4 transition-[grid-template-rows] duration-400 ease-[var(--ease-out)]" style={{ gridTemplateRows: on ? "1fr" : "0fr" }}>
                    <div className="overflow-hidden">
                      <p className={`${T.body} max-w-[360px] pt-1 pb-2 text-[#5c5c5c]`}>{r.body}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="mt-10">{nextRow}</div>
        </div>

        <div className="col-span-8">
          <div className="relative h-[640px] overflow-hidden rounded-[28px] bg-[var(--p-subtle)]">
            {/* the account itself; steps back while a part is shown over it */}
            <div className="absolute top-10 right-10 bottom-[-6%] left-10 transition-opacity duration-500" style={{ opacity: active ? 0.4 : 1 }}>
              <Image src={base.src} alt={base.alt} fill sizes="760px" className="object-contain object-top drop-shadow-[0_24px_48px_rgba(18,49,100,0.10)]" />
            </div>
            {rows.map((r) => {
              const on = r.id === active;
              return (
                <div
                  key={r.id}
                  aria-hidden={!on}
                  className="absolute right-8 bottom-8 transition-[opacity,transform] duration-500 ease-[var(--ease-out)] motion-reduce:transition-none"
                  style={{ width: INSET_W[r.id] ?? "40%", opacity: on ? 1 : 0, transform: on ? "none" : "translateY(16px)" }}
                >
                  <Image
                    src={r.crop.src}
                    alt={r.crop.alt}
                    width={r.crop.w}
                    height={r.crop.h}
                    sizes="420px"
                    className="h-auto max-h-[560px] w-full rounded-[18px] object-contain object-bottom drop-shadow-[0_28px_56px_rgba(18,49,100,0.22)]"
                  />
                </div>
              );
            })}
          </div>
          <p className={`${T.label} mt-4 text-[#6e6e6e]`}>{caption}</p>
        </div>
      </div>

      {/* phone and tablet: the Account panel, legible at this width, then the rows as text */}
      <div className="lg:hidden">
        <div className="grid place-items-center rounded-[24px] bg-[var(--p-subtle)] px-6 py-8">
          <Image src={baseMobile.src} alt={baseMobile.alt} width={baseMobile.w} height={baseMobile.h} sizes="(min-width: 640px) 420px, 80vw" className="h-auto w-full max-w-[420px]" />
        </div>
        <p className={`${T.label} mt-3 text-[#6e6e6e]`}>{caption}</p>
        <ul className="m-0 mt-6 list-none border-t border-[#e6e6e6] p-0">
          {rows.map((r) => (
            <li key={r.id} className="border-b border-[#e6e6e6] py-5">
              <span className={`${T.label} block text-[#6e6e6e]`}>{r.name}</span>
              <span className={`${T.sub} mt-1 block font-serif`}>{r.title}</span>
              <span className={`${T.body} mt-2 block text-[#5c5c5c]`}>{r.body}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6">{nextRow}</div>
      </div>
    </>
  );
}
