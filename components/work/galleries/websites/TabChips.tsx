"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Favicon, useTabKeys } from "./Chrome";
import type { SiteTab } from "./types";

// Below lg the screen is too small for a row of tabs, so they sit under the
// display as a strip you swipe along, running out to the screen's edges.
// The tab in front is raised and white, as on the screen's tab strip.

const chipId = (key: string) => `websites-chip-${key}`;

export default function TabChips({
  tabs,
  active,
  onPick,
  reduce,
}: {
  tabs: SiteTab[];
  active: string;
  onPick: (key: string) => void;
  reduce: boolean;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const keys = useTabKeys(tabs, active, onPick, chipId);
  const first = useRef(true);

  // Keep the picked tab in view, without moving on load.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const row = rowRef.current;
    const chip = document.getElementById(chipId(active));
    if (!row || !chip) return;
    const left = chip.offsetLeft - row.clientWidth / 2 + chip.offsetWidth / 2;
    row.scrollTo({ left, behavior: reduce ? "auto" : "smooth" });
  }, [active, reduce]);

  return (
    <div
      ref={rowRef}
      className="-mx-2.5 mt-1 overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] sm:-mx-6 lg:hidden [&::-webkit-scrollbar]:hidden"
    >
      <div role="tablist" aria-label="Websites" onKeyDown={keys} className="flex w-max gap-1.5 px-2.5 py-1 sm:px-6">
        {tabs.map((tab) => {
          const on = tab.key === active;
          return (
            <motion.button
              key={tab.key}
              id={chipId(tab.key)}
              type="button"
              role="tab"
              aria-selected={on}
              aria-controls="websites-screen"
              tabIndex={on ? 0 : -1}
              onClick={() => onPick(tab.key)}
              whileTap={reduce ? undefined : { scale: 0.97 }}
              className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-full pl-3 pr-4 text-[14px] font-medium tracking-[-0.01em] outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
                on
                  ? "bg-white text-neutral-900 shadow-[0_1px_2px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.05),0_0_0_1px_rgba(0,0,0,0.07)]"
                  : "bg-black/[0.04] text-neutral-500 [@media(hover:hover)]:hover:bg-black/[0.07] [@media(hover:hover)]:hover:text-neutral-800"
              }`}
            >
              <Favicon src={tab.favicon} className="h-[18px] w-[18px]" />
              {tab.title}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
