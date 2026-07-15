"use client";

// Scale lineup — the full token archive as Home-Depot-style paint chips that
// lift on hover. Click a chip to copy its hex. Ported from app.js.
import { LINEUP, type Step } from "@/lib/data";
import { relLum } from "@/lib/color";
import { copyText } from "@/lib/clipboard";

function Chip({ label, hex }: { label: string; hex: string }) {
  const ink = relLum(hex) > 0.5 ? "#2B1C13" : "rgba(255,255,255,0.94)";
  return (
    <button
      onClick={(e) => copyText(hex.toUpperCase(), e.currentTarget)}
      style={{ background: hex, color: ink }}
      className="group relative flex h-[156px] min-w-0 flex-1 flex-col justify-between rounded-[10px] px-[11px] py-[13px] text-left transition-[transform,box-shadow] duration-200 ease-[cubic-bezier(.2,.8,.2,1)] hover:z-[3] hover:-translate-y-4 hover:shadow-[0_20px_34px_rgba(30,20,10,0.22)] max-[860px]:h-[120px] max-[860px]:min-w-[56px] max-[860px]:hover:translate-y-0 max-[860px]:hover:shadow-none"
    >
      <span className="font-mono text-[12px] tracking-[0.02em]">{label}</span>
      <span className="font-mono text-[10px] opacity-0 transition-opacity group-hover:opacity-100 max-[860px]:group-hover:opacity-0">
        {hex.toUpperCase()}
      </span>
    </button>
  );
}

function Row({ label, cells }: { label: string; cells: Step[] }) {
  return (
    <div className="flex items-start gap-5 max-[860px]:flex-col max-[860px]:items-stretch max-[860px]:gap-2">
      <span className="w-[68px] shrink-0 pt-3 text-[12px] text-muted-2 max-[860px]:w-auto max-[860px]:pt-0">{label}</span>
      <div className="no-scrollbar flex min-w-0 flex-1 gap-1 max-[860px]:overflow-x-auto">
        {cells.map(([n, h]) => (
          <Chip key={n + h} label={n} hex={h} />
        ))}
      </div>
    </div>
  );
}

export default function ColorLineup() {
  return (
    <section className="px-edge pb-section pt-16">
      <p className="mb-10 text-eyebrow uppercase text-muted-2">Scale</p>
      {/* Brand + Neutral ramps, light set then dark set (grouped by whitespace) */}
      <div className="flex flex-col gap-12">
        <div className="flex flex-col gap-2.5">
          <Row label="Brand" cells={LINEUP.light.Brand} />
          <Row label="Neutral" cells={LINEUP.light.Neutral} />
        </div>
        <div className="flex flex-col gap-2.5">
          <Row label="Brand" cells={LINEUP.dark.Brand} />
          <Row label="Neutral" cells={LINEUP.dark.Neutral} />
        </div>
      </div>
    </section>
  );
}
