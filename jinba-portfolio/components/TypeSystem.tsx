"use client";

// Type system — two live, editable specimens (Tiempos display + Geist text),
// each with metric readouts, a Copy-CSS pill, and a clickable size ramp.
// The specimen is an uncontrolled contentEditable that React never re-renders
// the text of; the idle auto-rewrite mutates it imperatively. Ported from app.js.
import { useEffect, useRef, useState } from "react";
import { TYPE, TYPE_DEFAULTS, type TypeRow } from "@/lib/data";
import { copyText } from "@/lib/clipboard";

type GroupKey = "display" | "text";
const IDLE_MS = 7000;

const METRIC_ICON: Record<string, React.ReactNode> = {
  size: (
    <svg viewBox="0 0 38 30" fill="none" stroke="currentColor" strokeWidth="1" className="h-[34px] w-[44px] shrink-0 text-ink opacity-90">
      <line x1="8" y1="5" x2="8" y2="25" />
      <path d="M5 8l3-3 3 3M5 22l3 3 3-3" strokeLinejoin="round" />
      <line x1="13" y1="5" x2="20" y2="5" />
      <line x1="13" y1="25" x2="20" y2="25" />
      <path d="M24 25l4.5-15 4.5 15M25.5 20h6" strokeLinejoin="round" />
    </svg>
  ),
  leading: (
    <svg viewBox="0 0 38 30" fill="none" stroke="currentColor" strokeWidth="1" className="h-[34px] w-[44px] shrink-0 text-ink opacity-90">
      <line x1="6" y1="7" x2="27" y2="7" />
      <line x1="6" y1="15" x2="23" y2="15" />
      <line x1="6" y1="23" x2="27" y2="23" />
      <line x1="33" y1="8" x2="33" y2="22" />
      <path d="M30.5 10.5L33 8l2.5 2.5M30.5 19.5L33 22l2.5-2.5" strokeLinejoin="round" />
    </svg>
  ),
  tracking: (
    <svg viewBox="0 0 38 30" fill="none" stroke="currentColor" strokeWidth="1" className="h-[34px] w-[44px] shrink-0 text-ink opacity-90">
      <path d="M8 21l3.5-13 3.5 13M9.2 16.5h4.6" strokeLinejoin="round" />
      <path d="M23 21l3.5-13 3.5 13M24.2 16.5h4.6" strokeLinejoin="round" />
      <line x1="16.5" y1="25" x2="21.5" y2="25" />
      <path d="M18 23.5L16.5 25l1.5 1.5M20 23.5L21.5 25l-1.5 1.5" strokeLinejoin="round" />
    </svg>
  ),
  weight: (
    <svg viewBox="0 0 38 30" fill="none" stroke="currentColor" className="h-[34px] w-[44px] shrink-0 text-ink opacity-90">
      <line x1="9" y1="7" x2="9" y2="23" strokeWidth="1" />
      <line x1="19" y1="7" x2="19" y2="23" strokeWidth="2.2" />
      <line x1="29" y1="7" x2="29" y2="23" strokeWidth="3.6" />
    </svg>
  ),
};

function TypeGroup({ group, eyebrow, serif }: { group: GroupKey; eyebrow: string; serif: boolean }) {
  const face = TYPE[group];
  const [applied, setApplied] = useState(face.base);
  const [activeRow, setActiveRow] = useState<number | null>(null);
  const specRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLButtonElement>(null);
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
        setTimeout(del, 42);
      } else {
        setApplied(face.base);
        setActiveRow(null);
        typeIn(0);
      }
    };
    const typeIn = (i: number) => {
      if (animTok.current !== tok || !specRef.current) return;
      specRef.current.textContent = target.slice(0, i);
      if (i < target.length) setTimeout(() => typeIn(i + 1), 68);
    };
    del();
  }

  const onInput = () => {
    animTok.current = {}; // cancel any running rewrite
    armIdle();
  };

  const copyCss = () => {
    copyText(
      `font-family: ${face.css};\nfont-size: ${applied.size}px;\nline-height: ${applied.lh};\nletter-spacing: ${applied.ls};`,
      copyRef.current,
    );
  };

  const metrics: [string, string, string][] = [
    ["size", `${applied.size}px`, "Size"],
    ["leading", String(applied.lh), "Leading"],
    ["tracking", applied.ls, "Tracking"],
    ["weight", "Regular", "Weight"],
  ];

  const pickRow = (row: TypeRow, i: number) => {
    const [, size, lh, ls] = row;
    setApplied({ size, lh, ls });
    setActiveRow(i);
  };

  return (
    <div className="flex flex-col">
      <div className="statement !gap-14">
        <p className="text-eyebrow uppercase text-muted-2">{eyebrow}</p>
        <div className="flex items-start gap-gutter max-[1200px]:gap-14 max-[1024px]:flex-col max-[1024px]:gap-11">
          {/* left — specimen, metrics, copy */}
          <div className="flex w-[596px] shrink-0 flex-col gap-14 max-[1200px]:w-[46%] max-[1024px]:w-full">
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
              className={`caret min-h-[70px] w-fit max-w-full cursor-text overflow-hidden whitespace-nowrap pr-0.5 leading-[1.1] text-urushi caret-[#322014] outline-none max-[860px]:min-h-[46px] max-[860px]:!text-[40px] ${
                serif ? "font-serif" : "font-sans font-normal"
              }`}
              style={{ fontSize: `${applied.size}px`, lineHeight: applied.lh, letterSpacing: applied.ls }}
            />

            <div className="flex flex-wrap gap-7 max-[860px]:gap-6">
              {metrics.map(([icon, val, key]) => (
                <div key={key} className="flex items-center gap-3">
                  {METRIC_ICON[icon]}
                  <div className="flex flex-col gap-1">
                    <span className="whitespace-nowrap text-[18px] leading-[1.13] tracking-heading text-ink">{val}</span>
                    <span className="whitespace-nowrap text-eyebrow uppercase text-muted-2">{key}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              ref={copyRef}
              onClick={copyCss}
              className="inline-flex w-fit items-center gap-3 self-start rounded bg-chip px-[13.33px] py-2 text-[12px] text-muted-1 transition-colors hover:text-ink"
            >
              Copy CSS
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path
                  d="M8.6 11.4a3 3 0 004.24 0l2.5-2.5a3 3 0 00-4.24-4.24l-1.1 1.1M11.4 8.6a3 3 0 00-4.24 0l-2.5 2.5a3 3 0 004.24 4.24l1.1-1.1"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* right — size ramp */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-col">
              {face.rows.map((row, i) => {
                const [label, sizePx] = row;
                const bg =
                  activeRow === i ? "bg-seg-on" : i === 0 ? "bg-chip" : "hover:bg-black/[0.03]";
                return (
                  <button
                    key={label}
                    onClick={() => pickRow(row, i)}
                    className={`flex items-end border-b-[0.5px] border-[#acb2b9] p-3 text-left transition-colors last:border-b-0 ${bg}`}
                  >
                    <span
                      className={`leading-none text-ink ${serif ? "font-serif tracking-[-0.025em]" : "font-sans"}`}
                      style={{ fontSize: `${Math.min(sizePx, 60)}px` }}
                    >
                      {label}
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
    <section className="flex flex-col gap-32 px-edge pb-32 pt-section">
      <TypeGroup group="display" eyebrow="Display Font" serif />
      <TypeGroup group="text" eyebrow="Text Font" serif={false} />
    </section>
  );
}
