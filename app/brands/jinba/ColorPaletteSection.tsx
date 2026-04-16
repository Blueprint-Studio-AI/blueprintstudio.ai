"use client";
import { useState, useCallback } from "react";

const tiempos = { fontFamily: '"Tiempos Text", serif' };

interface Swatch {
  name: string;
  role: string;
  bg: string;
  hexes: string[];
  textColor: string;
  mutedColor: string;
  isDark?: boolean;
  isGradient?: boolean;
}

const PRIMARIES: Swatch[] = [
  {
    name: "Urushi",
    role: "Primary",
    bg: "#322014",
    hexes: ["#322014"],
    textColor: "#F4F1EB",
    mutedColor: "#DCCBB3",
    isDark: true,
  },
  {
    name: "Kuri",
    role: "Primary",
    bg: "#5A3921",
    hexes: ["#5A3921"],
    textColor: "#FAF8F3",
    mutedColor: "#F4F1EB",
    isDark: true,
  },
  {
    name: "Haku",
    role: "Primary",
    bg: "linear-gradient(180deg, #B78D62 0%, #C5A681 43.75%, #7E4E2D 80.3%, #52321B 100%)",
    hexes: ["#52321B", "#7E4E2D", "#B78D62", "#C5A681"],
    textColor: "#FAF8F3",
    mutedColor: "#FAF8F3",
    isDark: true,
    isGradient: true,
  },
];

const SECONDARIES: Swatch[] = [
  {
    name: "Tsuchi",
    role: "Secondary",
    bg: "#C5A681",
    hexes: ["#C5A681"],
    textColor: "#322014",
    mutedColor: "#5A3921",
    isDark: false,
  },
  {
    name: "Suna",
    role: "Secondary",
    bg: "#EFEEE8",
    hexes: ["#EFEEE8"],
    textColor: "#5A3921",
    mutedColor: "#835836",
    isDark: false,
  },
  {
    name: "Kami",
    role: "Secondary",
    bg: "#F5F4F2",
    hexes: ["#F5F4F2"],
    textColor: "#5A3921",
    mutedColor: "#5A3921",
    isDark: false,
  },
];

function CopyHex({ hex, mutedColor, isDark }: { hex: string; mutedColor: string; isDark?: boolean }) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(() => {
    navigator.clipboard.writeText(hex).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [hex]);

  const pill = isDark
    ? "bg-white/10 hover:bg-white/20 border border-white/20"
    : "bg-black/8 hover:bg-black/14 border border-black/10";

  return (
    <button
      onClick={copy}
      className={`font-mono text-[11px] leading-none px-2 py-1 rounded transition-all duration-150 active:scale-95 ${pill}`}
      style={{ color: mutedColor }}
      title="Click to copy"
    >
      {copied ? "✓ copied" : hex}
    </button>
  );
}

function SwatchPanel({ swatch, className = "" }: { swatch: Swatch; className?: string }) {
  const bgStyle = swatch.isGradient
    ? { backgroundImage: swatch.bg }
    : { backgroundColor: swatch.bg };

  return (
    <div
      className={`relative flex flex-col justify-between p-5 sm:p-7 ${className}`}
      style={bgStyle}
    >
      {/* Top — role + name */}
      <div>
        <p className="text-[12px] mb-1 leading-snug" style={{ color: swatch.mutedColor }}>
          {swatch.role}
        </p>
        <p
          className="text-[28px] sm:text-[32px] leading-[1.2] tracking-[-0.02em]"
          style={{ ...tiempos, color: swatch.textColor }}
        >
          {swatch.name}
        </p>
      </div>

      {/* Bottom — hex values */}
      <div className={`flex gap-2 ${swatch.isGradient ? "flex-col items-start" : "flex-row flex-wrap"}`}>
        {swatch.hexes.map((hex) => (
          <CopyHex key={hex} hex={hex} mutedColor={swatch.mutedColor} isDark={swatch.isDark} />
        ))}
      </div>
    </div>
  );
}

export function ColorPaletteSection() {
  return (
    <section className="mt-3 px-6 sm:px-10">
      {/* Desktop: primaries side by side, secondaries stacked right */}
      <div className="hidden sm:flex h-[640px]">
        {PRIMARIES.map((s) => (
          <SwatchPanel key={s.name} swatch={s} className="flex-1" />
        ))}
        <div className="flex flex-col" style={{ flex: "1.15" }}>
          {SECONDARIES.map((s) => (
            <SwatchPanel key={s.name} swatch={s} className="flex-1" />
          ))}
        </div>
      </div>

      {/* Mobile: all stacked */}
      <div className="flex flex-col sm:hidden">
        {[...PRIMARIES, ...SECONDARIES].map((s) => (
          <SwatchPanel key={s.name} swatch={s} className="h-[200px]" />
        ))}
      </div>
    </section>
  );
}
