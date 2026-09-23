"use client";

// The white band: a directory that doubles as the page's table of contents. Each row is a floor
// of the climb below; clicking one takes the reader to it (to its resting point while the climb
// is pinned; to its article when it isn't). Boost isn't built, so its row isn't a link.

import { PIN_QUERY } from "@/components/prime-v6/window-stage";

type Row = { to: string | null; n: string; name: string; line: string; tag: string | null };
type Lenis = { scrollTo: (t: number | HTMLElement, o?: object) => void };

// the climb's geometry (kept in step with climb.tsx): a 50svh lead-in, then 80svh per floor
export const LEAD = 50;
export const FLOOR = 80;

export function goToFloor(id: string) {
  const lenis = (window as Window & { __lenis?: Lenis }).__lenis;
  const climb = document.getElementById("climb");
  const floors = ["earn", "borrow", "trade", "vaults"];
  const i = floors.indexOf(id);
  if (climb && i >= 0 && window.matchMedia(PIN_QUERY).matches) {
    const U = window.innerHeight / 100;
    const y = climb.getBoundingClientRect().top + window.scrollY + (40 + FLOOR * i) * U;
    if (lenis) lenis.scrollTo(y, { duration: 1.2 });
    else window.scrollTo({ top: y, behavior: "smooth" });
    return;
  }
  const el = document.getElementById(`floor-${id}`);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: -140, duration: 1.2 });
  else el.scrollIntoView({ behavior: "smooth" });
}

const Arrow = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M6 10.5V1.5M2 5.5l4-4 4 4" />
  </svg>
);

export function Lobby({ label, h2, sub, rows }: { label: string; h2: string; sub: string; rows: readonly Row[] }) {
  return (
    <section id="lobby" className="bg-white">
      <div className="site-container grid grid-cols-1 gap-x-8 gap-y-12 py-24 lg:min-h-[760px] lg:grid-cols-12 lg:items-center lg:py-[120px]">
        <div className="lg:col-span-5">
          <p className="text-[14px] leading-5 font-medium text-[#6e6e6e]">{label}</p>
          <h2 className="mt-4 font-serif text-[40px] leading-[44px] tracking-[-0.035em] text-balance sm:text-[56px] sm:leading-[60px]">{h2}</h2>
          <p className="mt-5 max-w-[460px] text-[18px] leading-7 text-[#5c5c5c]">{sub}</p>
        </div>
        <ul className="m-0 list-none border-b border-[#dadada] p-0 lg:col-span-6 lg:col-start-7">
          {rows.map((r) => {
            const inner = (
              <>
                <span className="w-10 shrink-0 text-[14px] leading-5 text-[#6e6e6e] tabular-nums">{r.n}</span>
                <span className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-4">
                  <span className="text-[20px] leading-7 font-medium tracking-[-0.01em]">{r.name}</span>
                  <span className="min-w-0 flex-1 text-[16px] leading-6 text-[#6e6e6e]">{r.line}</span>
                </span>
                {r.tag && <span className="shrink-0 rounded-full border border-black/10 px-2 py-0.5 text-[12px] leading-4 text-[#6e6e6e]">{r.tag}</span>}
                {r.to && (
                  <span className="hidden w-4 shrink-0 translate-y-1 text-[var(--p-ink)] opacity-0 transition-[opacity,transform] duration-150 group-hover:translate-y-0 group-hover:opacity-100 sm:block">
                    <Arrow />
                  </span>
                )}
              </>
            );
            const cls = "group flex min-h-16 items-center gap-4 border-t border-[#dadada] px-2 py-4 sm:min-h-[72px]";
            return (
              <li key={r.name}>
                {r.to ? (
                  <a
                    href={`#floor-${r.to}`}
                    onClick={(e) => {
                      e.preventDefault();
                      goToFloor(r.to!);
                    }}
                    className={`${cls} transition-colors duration-150 hover:bg-[#f7f6f6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff5e00]`}
                  >
                    {inner}
                  </a>
                ) : (
                  <div aria-disabled className={`${cls} opacity-45`}>
                    {inner}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
