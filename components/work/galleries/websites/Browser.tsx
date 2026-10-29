"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, RotateCw } from "lucide-react";
import { AddressText, CHROME_FONT, Favicon, OriginalTag, TrafficLights, useTabKeys } from "./Chrome";
import Screen, { PANEL } from "./Screen";
import type { SiteTab } from "./types";

// The browser on the display's screen, drawn after Chrome on a Mac: the tab
// strip (from lg up; smaller screens pick from the strip under the display),
// the toolbar, and the page. Picking a tab swaps the page in the same frame,
// as a browser does, and the new tab's shape springs up out of the toolbar.
// Back and forward sit greyed, as in a fresh tab; reload starts the page over.

/** The tab shape rising out of the toolbar when it's picked. */
const RISE = { type: "spring", visualDuration: 0.28, bounce: 0.32 } as const;
const MORPH = { type: "spring", visualDuration: 0.26, bounce: 0.12 } as const;
const PRESS = { scale: 0.97 };
export const tabId = (key: string) => `websites-tab-${key}`;

function Tabs({
  tabs,
  active,
  onPick,
  touched,
  reduce,
}: {
  tabs: SiteTab[];
  active: string;
  onPick: (key: string) => void;
  touched: boolean;
  reduce: boolean;
}) {
  const [hover, setHover] = useState<string | null>(null);
  const keys = useTabKeys(tabs, active, onPick, tabId);
  const at = (key: string | null) => tabs.findIndex((t) => t.key === key);
  const quiet = new Set([at(active), at(hover)]);

  return (
    <div role="tablist" aria-label="Websites" onKeyDown={keys} className="flex h-[34px] min-w-0 flex-1 items-stretch">
      {tabs.map((tab, i) => {
        const on = tab.key === active;
        return (
          <motion.button
            key={tab.key}
            id={tabId(tab.key)}
            type="button"
            role="tab"
            aria-selected={on}
            aria-controls={PANEL}
            tabIndex={on ? 0 : -1}
            title={tab.title}
            onClick={() => onPick(tab.key)}
            onPointerEnter={(e) => e.pointerType === "mouse" && setHover(tab.key)}
            onPointerLeave={() => setHover((h) => (h === tab.key ? null : h))}
            whileTap={reduce ? undefined : PRESS}
            transition={MORPH}
            className={`relative flex min-w-0 max-w-[220px] flex-auto items-center gap-[6px] pl-[9px] pr-[2px] text-left text-[11.5px] leading-none tracking-[-0.003em] outline-none focus-visible:z-20 xl:gap-[7px] xl:pl-[11px] xl:text-[12px] ${
              on ? "z-10 cursor-default text-[#1F1F1F]" : "cursor-pointer text-[#45474A]"
            }`}
          >
            {on && (
              <motion.span
                aria-hidden
                initial={touched && !reduce ? { scaleY: 0.78, scaleX: 0.94 } : false}
                animate={{ scaleY: 1, scaleX: 1 }}
                transition={RISE}
                style={{ originY: 1 }}
                className="absolute inset-x-0 bottom-0 top-[5px] rounded-t-[9px] bg-white shadow-[0_0_0_0.5px_rgba(0,0,0,0.08),0_-1px_3px_rgba(0,0,0,0.04)]"
              >
                {/* The curves where the tab flows into the toolbar. */}
                <span className="absolute -left-[9px] bottom-0 h-[9px] w-[9px] bg-[radial-gradient(circle_at_0_0,transparent_8.5px,#fff_9px)]" />
                <span className="absolute -right-[9px] bottom-0 h-[9px] w-[9px] bg-[radial-gradient(circle_at_100%_0,transparent_8.5px,#fff_9px)]" />
              </motion.span>
            )}
            {!on && hover === tab.key && <span aria-hidden className="absolute inset-x-[2px] bottom-[4px] top-[6px] rounded-[8px] bg-white/60" />}
            {i > 0 && (
              <span
                aria-hidden
                className={`absolute left-0 top-1/2 h-[16px] w-px -translate-y-[calc(50%-2px)] bg-[#9AA0A6]/60 ${quiet.has(i) || quiet.has(i - 1) ? "opacity-0" : ""}`}
              />
            )}
            {/* Focus ring for the keyboard. */}
            <span aria-hidden className="pointer-events-none absolute inset-x-[2px] bottom-[3px] top-[6px] rounded-[8px] ring-[#2563EB] [button:focus-visible>&]:ring-2" />
            <Favicon src={tab.favicon} className="relative h-[14px] w-[14px] xl:h-[16px] xl:w-[16px]" />
            {/* A long title fades out at the tab's edge; the padding keeps a short one clear of the fade. */}
            <span className="relative min-w-0 flex-1 overflow-hidden whitespace-nowrap py-[2px] pr-[10px] [mask-image:linear-gradient(90deg,#000_calc(100%-12px),transparent)] xl:pr-[12px]">
              {tab.title}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

function ReloadButton({ onReload, reduce, size }: { onReload: () => void; reduce: boolean; size: "big" | "small" }) {
  return (
    <motion.button
      type="button"
      onClick={onReload}
      whileTap={reduce ? undefined : { scale: 0.9 }}
      aria-label="Reload the page"
      className={`flex shrink-0 items-center justify-center rounded-full text-[#5F6368] outline-none transition-colors duration-150 hover:bg-black/[0.06] hover:text-[#1F1F1F] focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
        size === "big" ? "h-[28px] w-[28px]" : "h-[22px] w-[22px] sm:h-[26px] sm:w-[26px]"
      }`}
    >
      <RotateCw className={size === "big" ? "h-[14px] w-[14px]" : "h-[11px] w-[11px] sm:h-[13px] sm:w-[13px]"} strokeWidth={2.2} />
    </motion.button>
  );
}

export default function Browser({
  tabs,
  active,
  onPick,
  touched,
  reduce,
  reload,
  onReload,
  enabled,
  archived,
  original,
  tapLabel,
}: {
  tabs: SiteTab[];
  active: string;
  onPick: (key: string) => void;
  touched: boolean;
  reduce: boolean;
  reload: number;
  onReload: () => void;
  /** Whether this is the browser on show, so it may load the live site. */
  enabled: boolean;
  /** The address bar's word for a site that's no longer live (rendered on the server, Draft-marked). */
  archived: ReactNode;
  /** The tag on a live site that's still ours (rendered on the server, Draft-marked). */
  original: ReactNode;
  tapLabel: ReactNode;
}) {
  const tab = tabs.find((t) => t.key === active) ?? tabs[0];

  return (
    <div className={`relative overflow-hidden rounded-[max(2px,0.3cqw)] bg-white antialiased ${CHROME_FONT}`}>
      {/* From lg: the tab strip, then the toolbar. */}
      <div className="hidden h-[40px] items-end bg-[#DFE1E5] pl-[14px] pr-[10px] lg:flex">
        <TrafficLights className="mb-[14px] mr-[12px] gap-[8px]" />
        <Tabs tabs={tabs} active={active} onPick={onPick} touched={touched} reduce={reduce} />
      </div>
      <div className="relative hidden h-[42px] items-center gap-[6px] border-b border-black/[0.08] px-[10px] lg:flex">
        <span aria-hidden className="flex items-center gap-[2px] text-[#5F6368]">
          <span className="flex h-[28px] w-[28px] items-center justify-center opacity-40">
            <ArrowLeft className="h-[16px] w-[16px]" strokeWidth={2} />
          </span>
          <span className="flex h-[28px] w-[28px] items-center justify-center opacity-40">
            <ArrowRight className="h-[16px] w-[16px]" strokeWidth={2} />
          </span>
        </span>
        <ReloadButton onReload={onReload} reduce={reduce} size="big" />
        <span className="ml-[4px] flex h-[30px] min-w-0 flex-1 items-center gap-[8px] rounded-full bg-[#F0F1F2] px-[13px] text-[13.5px]">
          <AddressText tab={tab} archived={archived} icon="h-[13px] w-[13px]" />
          {tab.original && <OriginalTag label={original} className="-mr-[7px] ml-auto text-[11.5px]" />}
        </span>
        {/* The Visit link grows out of the address bar for a live site. */}
        <motion.div
          initial={false}
          animate={{ width: tab.visit ? "auto" : 0 }}
          transition={reduce ? { duration: 0 } : MORPH}
          className="-my-2 flex shrink-0 justify-end overflow-hidden py-2"
        >
          <AnimatePresence initial={false} mode="popLayout">
            {tab.visit && (
              <motion.a
                key="visit"
                href={tab.visit}
                target="_blank"
                rel="noopener"
                initial={reduce ? false : { opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, scale: 0.85, transition: { duration: 0.12 } }}
                transition={MORPH}
                whileTap={reduce ? undefined : PRESS}
                className="group/visit ml-[4px] inline-flex h-[30px] items-center gap-[5px] whitespace-nowrap rounded-full bg-neutral-900 pl-[13px] pr-[11px] text-[12.5px] font-medium text-white outline-none transition-colors duration-200 hover:bg-black focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
              >
                Visit site
                <ArrowUpRight className="h-[13px] w-[13px] transition-transform duration-300 ease-out group-hover/visit:-translate-y-px group-hover/visit:translate-x-px" />
                <span className="sr-only">(opens in a new tab)</span>
              </motion.a>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      {/* Below lg: one slim toolbar. */}
      <div className="relative flex h-[30px] items-center border-b border-black/[0.08] bg-[#F7F7F8] px-[9px] sm:h-[38px] sm:px-[12px] lg:hidden">
        <TrafficLights className="w-[34px] gap-[5px] sm:w-[46px] sm:gap-[7px]" dot="h-[8px] w-[8px] sm:h-[10px] sm:w-[10px]" />
        <span className="flex min-w-0 flex-1 justify-center px-[6px]">
          <span className="flex h-[22px] min-w-0 max-w-full items-center justify-center gap-[5px] rounded-full bg-[#ECEDEE] px-[10px] text-[10.5px] sm:h-[26px] sm:text-[12px]">
            <AddressText tab={tab} archived={archived} icon="h-[10px] w-[10px]" />
          </span>
        </span>
        <span className="flex w-[34px] shrink-0 justify-end sm:w-[46px]">
          <ReloadButton onReload={onReload} reduce={reduce} size="small" />
        </span>
      </div>
      <Screen
        tabs={tabs}
        active={active}
        variant="desktop"
        enabled={enabled}
        reload={reload}
        reduce={reduce}
        tapLabel={tapLabel}
        labelledBy={tabId(active)}
        className="aspect-video"
      />
    </div>
  );
}
