"use client";

// Colour system — the selected colour (left) with its values + WCAG contrast
// tests (right). Selecting a swatch updates everything. Ported from app.js.
import { useState } from "react";
import { PRIMARY, SECONDARY, type Swatch } from "@/lib/data";
import { rgbStr, hslStr, contrast, bestInk, grade } from "@/lib/color";
import { copyText } from "@/lib/clipboard";
import ColorLineup from "@/components/ColorLineup";
import Tag from "@/components/ui/Tag";

const ALL = [...PRIMARY, ...SECONDARY];

const LinkIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="shrink-0 text-muted-3 transition-colors group-hover:text-ink">
    <path
      d="M8.6 11.4a3 3 0 004.24 0l2.5-2.5a3 3 0 00-4.24-4.24l-1.1 1.1M11.4 8.6a3 3 0 00-4.24 0l-2.5 2.5a3 3 0 004.24 4.24l1.1-1.1"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function ColorSystem() {
  const [selected, setSelected] = useState<Swatch>(PRIMARY[0]);
  const hex = selected.inspect;
  const darkBg = bestInk(hex) === "#FFFFFF";
  const nameInk = darkBg ? "#F4F1EB" : "#2B1C13";
  const roleInk = darkBg ? "#DCCBB3" : "#5A3921";
  const aaInk = darkBg ? "#FFFFFF" : "#322014";

  const values: [string, string][] = [
    ["Hex", hex.toUpperCase()],
    ["RGB", rgbStr(hex)],
    ["HSL", hslStr(hex)],
  ];

  const contrastCard = (label: string, bg: string, ratio: number) => {
    const g = grade(ratio);
    return (
      <div className="flex min-w-0 flex-1 flex-col gap-6">
        <div className="flex h-[108px] items-center justify-center overflow-hidden rounded-3xl border border-line-soft" style={{ background: bg }}>
          <span className="font-serif text-headline" style={{ color: hex }}>
            Aa
          </span>
        </div>
        {/* wraps rather than overflowing when the column is narrow */}
        <div className="flex flex-wrap items-center justify-between gap-x-2.5 gap-y-1">
          <span className="whitespace-nowrap text-label uppercase text-muted-2">{label}</span>
          <span className="flex items-center gap-3">
            <span className="font-mono text-meta font-medium text-muted-1">{ratio.toFixed(2)}</span>
            <span
              className={`rounded-md p-1 text-label font-medium uppercase ${
                g.pass ? "bg-grade-pass-bg text-grade-pass-fg" : "bg-grade-fail-bg text-grade-fail-fg"
              }`}
            >
              {g.label}
            </span>
          </span>
        </div>
      </div>
    );
  };

  return (
    <section id="color-config" className="px-edge pb-section pt-16">
      {/* 64px stack — Figma's auto-layout gap on this frame */}
      <div className="statement !gap-16">
        {/* 596 + a 128 gutter needs ~724px; below that the columns must give way
            or the right one collapses to zero (same ladder as TypeSystem). */}
        <div className="flex items-start gap-gutter max-[1200px]:gap-14 max-[1024px]:flex-col max-[1024px]:gap-11">
          {/* left */}
          <div className="flex w-[596px] shrink-0 flex-col gap-8 max-[1200px]:w-[46%] max-[1024px]:w-full">
            <Tag>jinba-{selected.name.toLowerCase()}</Tag>

            <div
              className="flex h-[227px] flex-col items-end justify-between rounded-3xl p-8 transition-colors"
              style={{
                background: selected.grad ? undefined : selected.bg,
                backgroundImage: selected.grad ? selected.bg : undefined,
              }}
            >
              <div className="flex w-full flex-col leading-[1.4]">
                <span className="text-body-lg" style={{ color: roleInk }}>
                  {selected.role}
                </span>
                <span className="font-serif text-display-sm" style={{ color: nameInk }}>
                  {selected.name}
                </span>
              </div>
              <span className="font-serif text-specimen tracking-snug" style={{ color: aaInk }}>
                Aa
              </span>
            </div>

            <div className="flex gap-3">
              {ALL.map((s) => {
                const sel = s.name === selected.name;
                const bg = s.grad ? { backgroundImage: s.bg } : { background: s.bg };
                return (
                  <button key={s.name} onClick={() => setSelected(s)} className="flex min-w-0 flex-1 flex-col gap-3.5 text-left">
                    <span
                      className={`relative h-[90px] rounded-3xl transition-transform hover:-translate-y-[3px] ${
                        sel ? "border-[1.5px] border-black" : ""
                      }`}
                      style={sel ? undefined : bg}
                    >
                      {sel && <span className="absolute inset-[3.5px] rounded-[18px]" style={bg} />}
                    </span>
                    <span className="pl-1 text-micro text-[#2d2e36]">{s.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* right */}
          <div className="flex min-w-0 flex-1 flex-col gap-8 max-[1024px]:w-full">
            <div className="flex flex-col gap-8">
              {values.map(([k, v]) => (
                <div key={k} className="flex flex-col gap-3.5">
                  <span className="text-label uppercase text-muted-2">{k}</span>
                  <button
                    onClick={(e) => copyText(v, e.currentTarget)}
                    className="group inline-flex w-fit items-center gap-3"
                  >
                    <span className="text-value text-ink group-hover:underline group-hover:underline-offset-[3px]">
                      {v}
                    </span>
                    <LinkIcon />
                  </button>
                </div>
              ))}
            </div>

            {/* Ratio is measured against the swatch actually painted behind it —
                these were reading #FFFFFF while showing #fafafa. */}
            <div className="flex gap-6 max-[860px]:flex-col max-[860px]:gap-4">
              {contrastCard("On Light", "#FAFAFA", contrast(hex, "#FAFAFA"))}
              {contrastCard("On Dark", "#1A1A1A", contrast(hex, "#1A1A1A"))}
            </div>
          </div>
        </div>

        {/* full token ramps — collapsible, inside the same construction lines */}
        <ColorLineup />
      </div>
    </section>
  );
}
