"use client";

// Inside Earn: the two vaults, the way Ondo and Axis present products — a short selector, then one
// panel at a time (two saturated grounds side by side would be the loud moment this page avoids).
// With no live figures allowed, the panel earns its weight as a fact sheet: the brand's colour-
// ground building, the name, one plain line, three rows (put in / hold / take out) and the one
// honest risk line at body size, not fine print. Colour enters the page here, and only here,
// between the two bookend photographs. Both are marked Preview: they run on test tokens today.

import { useState } from "react";
import Image from "next/image";
import { Mark } from "@/components/prime-marks";

export type Vault = {
  id: "primeBTC" | "primeUSD";
  kind: string;
  line: string;
  facts: readonly { label: string; value: string }[];
  caution: string;
};

const ART: Record<Vault["id"], { src: string; ground: string }> = {
  primeBTC: { src: "/img/prime/v7/p-primebtc.webp", ground: "#f1cfb6" },
  primeUSD: { src: "/img/prime/v7/p-primeusd.webp", ground: "#cedbd7" },
};

export function Products({ items, preview }: { items: readonly Vault[]; preview: string }) {
  const [active, setActive] = useState<Vault["id"]>(items[0].id);
  const current = items.find((p) => p.id === active) ?? items[0];

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-6 lg:grid-cols-12">
      <div role="tablist" aria-label="Vaults" className="grid grid-cols-2 gap-2 lg:col-span-4 lg:flex lg:flex-col lg:gap-2">
        {items.map((p) => {
          const on = p.id === active;
          return (
            <button
              key={p.id}
              role="tab"
              aria-selected={on}
              aria-controls="vault-panel"
              onClick={() => setActive(p.id)}
              className={`flex cursor-pointer items-center gap-3 rounded-[18px] border px-4 py-3.5 text-left transition-colors duration-300 lg:gap-4 lg:px-5 lg:py-5 ${
                on ? "border-black/[0.08] bg-white" : "border-transparent hover:bg-black/[0.03]"
              }`}
            >
              <Mark kind={p.id} size={36} className="shrink-0" />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className={`text-[17px] leading-6 font-medium tracking-[-0.01em] ${on ? "text-[var(--p-ink)]" : "text-[#4d4d4d]"}`}>{p.id}</span>
                <span className="text-[13px] leading-5 text-[#6e6e6e]">{p.kind}</span>
              </span>
              <span className="hidden shrink-0 rounded-full border border-black/10 px-2 py-0.5 text-[11px] leading-4 text-[#6e6e6e] sm:inline">{preview}</span>
            </button>
          );
        })}
      </div>

      <div id="vault-panel" role="tabpanel" aria-live="polite" className="lg:col-span-8">
        <div key={current.id} className="v7-fade grid grid-cols-1 overflow-hidden rounded-[28px] bg-white sm:grid-cols-2">
          <div className="relative aspect-[16/10] sm:aspect-auto sm:min-h-[420px]" style={{ background: ART[current.id].ground }}>
            <Image src={ART[current.id].src} alt="" fill sizes="(min-width: 992px) 420px, 100vw" className="object-cover object-[70%_50%]" />
          </div>
          <div className="flex flex-col p-7 sm:p-9">
            <div className="flex items-center gap-2.5">
              <Mark kind={current.id} size={24} />
              <span className="text-[15px] leading-6 font-medium">{current.id}</span>
            </div>
            <p className="mt-4 font-serif text-[28px] leading-9 tracking-[-0.02em] text-balance">{current.line}</p>
            <dl className="m-0 mt-auto pt-8">
              {current.facts.map((f) => (
                <div key={f.label} className="flex items-baseline justify-between gap-6 border-t border-black/[0.08] py-3">
                  <dt className="text-[14px] leading-5 text-[#6e6e6e]">{f.label}</dt>
                  <dd className="m-0 text-right text-[15px] leading-6 text-[var(--p-ink)]">{f.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 border-t border-black/[0.08] pt-4 text-[15px] leading-6 text-[#4d4d4d]">{current.caution}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
