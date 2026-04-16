"use client";
import { useState, useCallback } from "react";

const tiempos = { fontFamily: '"Tiempos Text", serif' };

// ─── Scale data ───────────────────────────────────────────────────────────────

interface Stop { stop: string; hex: string }

const SAND_LIGHT: Stop[] = [
  { stop: "50",  hex: "#FAF8F3" }, { stop: "100", hex: "#F4F1EB" },
  { stop: "200", hex: "#EAE3D7" }, { stop: "300", hex: "#DCCBB3" },
  { stop: "400", hex: "#CAB296" }, { stop: "500", hex: "#B59575" },
  { stop: "600", hex: "#9E7754" }, { stop: "700", hex: "#835836" },
  { stop: "800", hex: "#5A3921" }, { stop: "900", hex: "#342115" },
  { stop: "950", hex: "#2B1C13" },
];
const NEUTRAL_LIGHT: Stop[] = [
  { stop: "50",  hex: "#F8F8F8" }, { stop: "100", hex: "#EFEFEE" },
  { stop: "200", hex: "#E2E2E1" }, { stop: "300", hex: "#CECDCC" },
  { stop: "400", hex: "#B8B6B3" }, { stop: "500", hex: "#9E9B98" },
  { stop: "600", hex: "#837F7C" }, { stop: "700", hex: "#66625F" },
  { stop: "800", hex: "#44413F" }, { stop: "900", hex: "#272625" },
  { stop: "950", hex: "#21201F" },
];
const SAND_DARK: Stop[] = [
  { stop: "50",  hex: "#1A120E" }, { stop: "100", hex: "#2E2019" },
  { stop: "200", hex: "#413026" }, { stop: "300", hex: "#694F3E" },
  { stop: "400", hex: "#93715A" }, { stop: "500", hex: "#AC8B70" },
  { stop: "600", hex: "#BEA083" }, { stop: "700", hex: "#CEB69A" },
  { stop: "800", hex: "#DCCFBC" }, { stop: "900", hex: "#EAE7E2" },
  { stop: "950", hex: "#F3F3F3" },
];
const NEUTRAL_DARK: Stop[] = [
  { stop: "50",  hex: "#141414" }, { stop: "100", hex: "#242423" },
  { stop: "200", hex: "#353434" }, { stop: "300", hex: "#575553" },
  { stop: "400", hex: "#7D7875" }, { stop: "500", hex: "#97918C" },
  { stop: "600", hex: "#ABA59E" }, { stop: "700", hex: "#BFB9B3" },
  { stop: "800", hex: "#D4D0CB" }, { stop: "900", hex: "#E9E8E4" },
  { stop: "950", hex: "#F4F3F2" },
];

const PRODUCT_COLORS = [
  { name: "Flow",    hex: "#2C50B5" },
  { name: "App",     hex: "#A22727" },
  { name: "Toolbox", hex: "#7D95A1" },
];
const COLS = 11;
const FILLER_COUNT = COLS - PRODUCT_COLORS.length;

// ─── Flat row list ────────────────────────────────────────────────────────────
// All rows in display order. groupLabel only on the first row of each group.
// borderTop marks where a dividing line should appear between groups.

interface ScaleRowData {
  groupLabel?: string;
  rowLabel: string;
  stops?: Stop[];
  isAccents?: true;
  borderTop?: true;
}

const ROWS: ScaleRowData[] = [
  { groupLabel: "Light mode", rowLabel: "Brand",   stops: SAND_LIGHT                       },
  {                           rowLabel: "Neutral", stops: NEUTRAL_LIGHT                    },
  { groupLabel: "Dark mode",  rowLabel: "Brand",   stops: SAND_DARK,    borderTop: true    },
  {                           rowLabel: "Neutral", stops: NEUTRAL_DARK                     },
  { groupLabel: "Accents",    rowLabel: "",        isAccents: true,     borderTop: true    },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function luminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return r * 0.299 + g * 0.587 + b * 0.114;
}

// ─── Cells ───────────────────────────────────────────────────────────────────

function StopCell({ stop }: { stop: Stop }) {
  const [copied, setCopied] = useState(false);
  const dark = luminance(stop.hex) < 140;
  const fg   = dark ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,0.4)";
  const ring = dark ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.12)";

  const copy = useCallback(() => {
    navigator.clipboard.writeText(stop.hex).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    });
  }, [stop.hex]);

  return (
    <button
      onClick={copy}
      title={`Copy ${stop.hex}`}
      className="relative flex flex-col justify-between p-2.5 w-full aspect-[1/2] cursor-pointer group"
      style={{ backgroundColor: stop.hex }}
    >
      <span className="text-[10px] leading-none font-mono" style={{ color: fg }}>{stop.stop}</span>
      <span className="text-[9px] leading-none font-mono opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: fg }}>
        {copied ? "✓" : stop.hex}
      </span>
      <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{ boxShadow: `inset 0 0 0 1.5px ${ring}` }} />
    </button>
  );
}

function ProductCell({ color }: { color: typeof PRODUCT_COLORS[0] }) {
  const [copied, setCopied] = useState(false);
  const dark = luminance(color.hex) < 150;
  const fg   = dark ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,0.4)";
  const ring = dark ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.12)";

  const copy = useCallback(() => {
    navigator.clipboard.writeText(color.hex).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    });
  }, [color.hex]);

  return (
    <button
      onClick={copy}
      title={`Copy ${color.hex}`}
      className="relative flex flex-col justify-between p-2.5 w-full aspect-[1/2] cursor-pointer group"
      style={{ backgroundColor: color.hex }}
    >
      <span className="text-[10px] leading-none font-mono" style={{ color: fg }}>{color.name}</span>
      <span className="text-[9px] leading-none font-mono opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: fg }}>
        {copied ? "✓" : color.hex}
      </span>
      <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{ boxShadow: `inset 0 0 0 1.5px ${ring}` }} />
    </button>
  );
}

// ─── Layout ───────────────────────────────────────────────────────────────────

const LEFT = "w-24 sm:w-36 flex-shrink-0 px-6 sm:px-10";
const RIGHT = "flex-1 pr-6 sm:pr-10";

// ─── Section ─────────────────────────────────────────────────────────────────

export function ColorScalesSection() {
  return (
    <section className="mt-12">

      {/*
        One flat stack of rows — every row has color cells on the right so there
        are zero white gaps in the color field. Group labels live in the left
        gutter of the first row of each group only. borderTop on the row div
        itself provides the visual divider between groups.
      */}
      <div>
        {ROWS.map((row, i) => (
          <div
            key={i}
            className="flex items-stretch"
          >
            {/* Left gutter — border and spacing here only, never bleeds into the color field */}
            <div
              className={`${LEFT} flex flex-col justify-start gap-2 ${row.borderTop ? "pt-5" : "pt-1.5"}`}
              style={row.borderTop ? { borderTop: "1px solid #e5e5e5" } : undefined}
            >
              {row.groupLabel && (
                <span className="text-[11px] text-neutral-600 leading-none" style={tiempos}>
                  {row.groupLabel}
                </span>
              )}
              {row.rowLabel && (
                <span className="text-[10px] text-neutral-400 leading-none">{row.rowLabel}</span>
              )}
            </div>

            {/* Right — color grid defines row height via aspect-ratio */}
            <div className={RIGHT}>
              <div className="grid overflow-hidden" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
                {row.isAccents ? (
                  <>
                    {PRODUCT_COLORS.map((c) => <ProductCell key={c.hex} color={c} />)}
                    {Array.from({ length: FILLER_COUNT }).map((_, j) => (
                      <div key={j} className="aspect-[1/2]" />
                    ))}
                  </>
                ) : (
                  row.stops?.map((s) => <StopCell key={s.stop} stop={s} />)
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
