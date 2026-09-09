"use client";

// Type system (Figma 298:936) — two live, editable specimens (Tiempos display +
// Geist text), each with metric readouts, a foundry credit, and a clickable size
// ramp. Copying the CSS is a section-level action, up in the header.
// The specimen is an uncontrolled contentEditable that React never re-renders
// the text of; the idle auto-rewrite mutates it imperatively. Ported from app.js.
import { useEffect, useRef, useState } from "react";
import { TYPE, TYPE_DEFAULTS, type TypeRow } from "@/lib/data";
import Tag from "@/components/ui/Tag";

type GroupKey = "display" | "text";
const IDLE_MS = 2200; // hands-off pause before the specimen restores itself
// (re-armed on every keystroke, so it only counts once you've actually stopped)
const ERASE_MS = 16; // per character, deleting
const TYPE_MS = 28; // per character, typing back in (a beat slower — it reads)

const METRIC_ICON: Record<string, React.ReactNode> = {
  size: (
    <svg viewBox="0 0 38 30" fill="none" stroke="currentColor" strokeWidth="1" className="h-[42px] w-[53.2px] shrink-0 text-ink opacity-90">
      <line x1="8" y1="5" x2="8" y2="25" />
      <path d="M5 8l3-3 3 3M5 22l3 3 3-3" strokeLinejoin="round" />
      <line x1="13" y1="5" x2="20" y2="5" />
      <line x1="13" y1="25" x2="20" y2="25" />
      <path d="M24 25l4.5-15 4.5 15M25.5 20h6" strokeLinejoin="round" />
    </svg>
  ),
  leading: (
    <svg viewBox="0 0 38 30" fill="none" stroke="currentColor" strokeWidth="1" className="h-[42px] w-[53.2px] shrink-0 text-ink opacity-90">
      <line x1="6" y1="7" x2="27" y2="7" />
      <line x1="6" y1="15" x2="23" y2="15" />
      <line x1="6" y1="23" x2="27" y2="23" />
      <line x1="33" y1="8" x2="33" y2="22" />
      <path d="M30.5 10.5L33 8l2.5 2.5M30.5 19.5L33 22l2.5-2.5" strokeLinejoin="round" />
    </svg>
  ),
  tracking: (
    <svg viewBox="0 0 38 30" fill="none" stroke="currentColor" strokeWidth="1" className="h-[42px] w-[53.2px] shrink-0 text-ink opacity-90">
      <path d="M8 21l3.5-13 3.5 13M9.2 16.5h4.6" strokeLinejoin="round" />
      <path d="M23 21l3.5-13 3.5 13M24.2 16.5h4.6" strokeLinejoin="round" />
      <line x1="16.5" y1="25" x2="21.5" y2="25" />
      <path d="M18 23.5L16.5 25l1.5 1.5M20 23.5L21.5 25l-1.5 1.5" strokeLinejoin="round" />
    </svg>
  ),
  weight: (
    <svg viewBox="0 0 38 30" fill="none" stroke="currentColor" className="h-[42px] w-[53.2px] shrink-0 text-ink opacity-90">
      <line x1="9" y1="7" x2="9" y2="23" strokeWidth="1" />
      <line x1="19" y1="7" x2="19" y2="23" strokeWidth="2.2" />
      <line x1="29" y1="7" x2="29" y2="23" strokeWidth="3.6" />
    </svg>
  ),
};

function TypeGroup({ group, tag, serif }: { group: GroupKey; tag: string; serif: boolean }) {
  const face = TYPE[group];
  const [applied, setApplied] = useState(face.base);
  const [activeRow, setActiveRow] = useState<number | null>(null);
  const specRef = useRef<HTMLDivElement>(null);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const animTok = useRef<object>({});

  // Seed the specimen text once (uncontrolled thereafter).
  useEffect(() => {
    if (specRef.current) specRef.current.textContent = TYPE_DEFAULTS[group];
    return () => clearTimeout(idleTimer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const armIdle = () => {
    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(autoRewrite, IDLE_MS);
  };

  function autoRewrite() {
    const s = specRef.current;
    if (!s) return;
    const target = TYPE_DEFAULTS[group];
    if (s.textContent === target) return;
    if (document.activeElement === s) s.blur();
    const tok = (animTok.current = {});
    const del = () => {
      if (animTok.current !== tok || !specRef.current) return;
      const t = specRef.current.textContent ?? "";
      if (t.length) {
        specRef.current.textContent = t.slice(0, -1);
        setTimeout(del, ERASE_MS);
      } else {
        // Restore the TEXT only. Size belongs to the ramp — resetting it here is
        // what used to clobber a row pick a beat after the user made it.
        typeIn(0);
      }
    };
    const typeIn = (i: number) => {
      if (animTok.current !== tok || !specRef.current) return;
      specRef.current.textContent = target.slice(0, i);
      if (i < target.length) setTimeout(() => typeIn(i + 1), TYPE_MS);
    };
    del();
  }

  const onInput = () => {
    animTok.current = {}; // cancel any running rewrite
    armIdle();
  };

  const metrics: [string, string, string][] = [
    ["size", `${applied.size}px`, "Size"],
    ["leading", String(applied.lh), "Leading"],
    ["tracking", applied.ls, "Tracking"],
    ["weight", "Regular", "Weight"],
  ];

  const pickRow = (row: TypeRow, i: number) => {
    // Cancel any running auto-rewrite so the pick isn't clobbered mid-animation,
    // then RE-arm the idle timer (a bare clearTimeout here permanently disarmed
    // the text restore). Safe now that the restore no longer touches size.
    animTok.current = {};
    armIdle();
    const [, size, lh, ls] = row;
    setApplied({ size, lh, ls });
    setActiveRow(i);
  };

  return (
    <div className="flex flex-col">
      <div className="statement !gap-16">
        {/* asset tag — same mono chip pattern as the logo/color blocks */}
        <Tag>{tag}</Tag>
        <div className="flex items-start gap-gutter max-[1200px]:gap-14 max-[1024px]:flex-col max-[1024px]:gap-11">
          {/* left — specimen, metrics, copy */}
          <div className="flex w-[596px] shrink-0 flex-col gap-16 max-[1200px]:w-[46%] max-[1024px]:w-full">
            {/* The wrapper reserves the specimen's height so the column doesn't
                jump between sizes. No surface on focus — the caret is the tell
                that it's editable, and a plate behind a 64px specimen competes
                with the thing you're here to look at. */}
            <div className="flex min-h-[70px] items-start max-[860px]:min-h-[46px]">
              <div
                ref={specRef}
                contentEditable
                suppressContentEditableWarning
                spellCheck={false}
                onInput={onInput}
                onFocus={() => {
                  animTok.current = {};
                  armIdle();
                }}
                onBlur={armIdle}
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.preventDefault();
                }}
                onPaste={(e) => {
                  e.preventDefault();
                  const t = e.clipboardData.getData("text").replace(/\s+/g, " ");
                  document.execCommand("insertText", false, t);
                }}
                className={`caret w-fit max-w-full cursor-text overflow-hidden whitespace-nowrap pr-0.5 leading-[1.1] text-urushi caret-[#322014] outline-none max-[860px]:!text-headline-mobile ${
                  serif ? "font-serif" : "font-sans font-normal"
                }`}
                style={{ fontSize: `${applied.size}px`, lineHeight: applied.lh, letterSpacing: applied.ls }}
              />
            </div>

            <div className="flex flex-wrap gap-6 max-[860px]:gap-x-6 max-[860px]:gap-y-4">
              {metrics.map(([icon, val, key]) => (
                <div key={key} className="flex items-center gap-3">
                  {METRIC_ICON[icon]}
                  <div className="flex flex-col gap-1">
                    <span className="whitespace-nowrap text-value text-ink">{val}</span>
                    <span className="whitespace-nowrap text-eyebrow uppercase text-muted-2">{key}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* foundry credit — who drew the face */}
            <p className="text-meta font-medium text-faint">
              By{" "}
              <a
                href={face.foundry.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-2 underline decoration-from-font underline-offset-2 transition-colors hover:text-ink"
              >
                {face.foundry.name}
              </a>
            </p>
          </div>

          {/* right — size ramp (click a row to apply it to the specimen) */}
          <div className="min-w-0 flex-1">
            <p className="mb-3 flex items-center gap-1.5 text-micro uppercase text-muted-3">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden className="shrink-0">
                <path d="M3.5 2.2l9 5-3.9 1.15L6.6 13 3.5 2.2z" fill="currentColor" />
              </svg>
              Click to preview
            </p>
            {/* The display ramp breathes between rows; the text ramp is a tight
                stack — both straight off 298:936. */}
            <div className={`flex flex-col ${serif ? "gap-4" : ""}`}>
              {face.rows.map((row, i) => {
                const [label, sizePx] = row;
                const isActive = activeRow === i;
                return (
                  <button
                    key={label}
                    onClick={() => pickRow(row, i)}
                    aria-pressed={isActive}
                    className={`group flex cursor-pointer justify-between gap-4 border-b-[0.5px] border-[#acb2b9] px-3 text-left transition-colors last:border-b-0 ${
                      serif ? "items-center pb-3" : "items-end py-3.5"
                    } ${isActive ? "bg-seg-on" : "hover:bg-black/[0.04]"}`}
                  >
                    <span
                      className={`leading-none text-ink ${serif ? "font-serif tracking-[-0.025em]" : "font-sans"}`}
                      style={{ fontSize: `${Math.min(sizePx, 60)}px` }}
                    >
                      {label}
                    </span>
                    <span
                      className={`shrink-0 self-center font-mono text-micro tracking-tight transition-opacity ${
                        isActive ? "text-ink opacity-100" : "text-muted-3 opacity-0 group-hover:opacity-100"
                      }`}
                    >
                      {sizePx}px
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TypeSystem() {
  return (
    <section className="flex flex-col gap-32 px-edge pb-section pt-16">
      <TypeGroup group="display" tag="jinba-display" serif />
      <TypeGroup group="text" tag="jinba-text" serif={false} />
    </section>
  );
}
