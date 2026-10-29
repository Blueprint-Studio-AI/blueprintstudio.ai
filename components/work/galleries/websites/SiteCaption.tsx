import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { OriginalTag } from "./Chrome";
import type { SiteTab } from "./types";

// The site in front, under the display, in Showcase's type: the client, the
// year and the piece, its line, and its links. Every caption is laid in the
// same grid cell, so the block keeps the tallest one's height and nothing
// below moves when the tab changes. Below lg the Visit link and the
// Original tag are here; from lg they're in the address bar.

export default function SiteCaption({ tabs, active, original }: { tabs: SiteTab[]; active: string; original: ReactNode }) {
  return (
    <div className="mt-6 grid sm:mt-8 lg:mt-6">
      {tabs.map((tab) => {
        const on = tab.key === active;
        return (
          <div key={tab.key} aria-hidden={!on} className={`[grid-area:1/1] ${on ? "" : "invisible"}`}>
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
              <div className="min-w-0">
                <p className="text-[24px] font-medium leading-[1.1] tracking-[-0.03em] text-black lg:text-[30px]">{tab.name}</p>
                <p className="mt-2 text-[15px] leading-[1.45] text-neutral-500 lg:text-base">
                  {tab.year && (
                    <>
                      <span className="tabular-nums">{tab.year}</span>
                      <span aria-hidden className="mx-2 text-neutral-300">
                        ·
                      </span>
                    </>
                  )}
                  {tab.label}
                </p>
                {tab.summary && <p className="mt-3 max-w-[60ch] text-pretty text-sm leading-[1.5] text-neutral-500">{tab.summary}</p>}
              </div>
              {(tab.links.length > 0 || tab.visit) && (
                <div className="flex shrink-0 flex-wrap items-center gap-2 lg:pt-1.5">
                  {tab.original && <OriginalTag label={original} className="mr-1 text-[13px] lg:hidden" />}
                  {/* From lg the Visit link is in the address bar. */}
                  {tab.visit && (
                    <a
                      href={tab.visit}
                      target="_blank"
                      rel="noopener"
                      className="group/link inline-flex h-9 items-center gap-1.5 rounded-full bg-neutral-900 px-4 text-sm font-medium text-white transition-colors duration-200 hover:bg-black lg:hidden"
                    >
                      Visit site
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  )}
                  {tab.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="group/link inline-flex h-9 items-center gap-1.5 rounded-full bg-black/[0.05] px-4 text-sm font-medium text-black transition-colors duration-200 hover:bg-black/[0.09]"
                    >
                      {link.label}
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover/link:translate-x-0.5" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
