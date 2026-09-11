"use client";

// "Copy all colors" — the whole palette as one paste.
//
// Chip-by-chip copying is right for grabbing one value; it's the wrong tool for
// handing the palette to an agent or a doc. This emits plain, labelled text
// rather than CSS on purpose: the tokens stylesheet is already a download, and
// a model reads `Liquid-Gold #F47000` more reliably than a custom property.
import { useRef } from "react";
import { useBrand } from "@/components/brands/kit/BrandContext";
import type { BrandConfig } from "@/components/brands/kit/types";
import { copyText } from "@/components/brands/kit/lib/clipboard";
import { useToast } from "@/components/brands/kit/ui/Toast";
import Button from "@/components/brands/kit/ui/Button";

/** Every colour the page shows, grouped the way the page groups them. */
export function paletteText(brand: BrandConfig) {
  const { name, lineup, primary, secondary, accents, colorLayout } = brand;
  const out: string[] = [`${name} — Color`];

  // Named swatches only matter where the page actually shows them; in chips
  // mode the ramps below already carry the same names.
  if (colorLayout !== "chips") {
    for (const [title, list] of [
      ["Primary", primary],
      ["Secondary", secondary],
    ] as const) {
      if (!list.length) continue;
      out.push("", `${title}`);
      for (const s of list) out.push(`  ${s.name}  ${s.inspect.toUpperCase()}`);
    }
  }

  for (const group of lineup) {
    out.push("", `${brand.slug}-${group.tag}`);
    for (const row of group.rows) for (const [label, hex] of row) out.push(`  ${label}  ${hex.toUpperCase()}`);
  }

  if (accents.length) {
    out.push("", `${brand.slug}-accent`);
    for (const [label, hex] of accents) out.push(`  ${label}  ${hex.toUpperCase()}`);
  }

  return out.join("\n");
}

/** Count of values in the copied block, for the confirmation. */
function swatchCount(brand: BrandConfig) {
  const ramps = brand.lineup.reduce((n, g) => n + g.rows.reduce((m, r) => m + r.length, 0), 0);
  const named = brand.colorLayout === "chips" ? 0 : brand.primary.length + brand.secondary.length;
  return ramps + named + brand.accents.length;
}

export default function CopyColorsPill() {
  const brand = useBrand();
  const toast = useToast();
  const ref = useRef<HTMLButtonElement>(null);

  return (
    <Button
      ref={ref}
      variant="pill"
      onClick={async () => {
        const ok = await copyText(paletteText(brand), ref.current);
        toast(ok ? `Copied all ${swatchCount(brand)} colors` : "Couldn’t copy — check clipboard permissions");
      }}
      className="gap-2.5 !text-label"
    >
      Copy All Colors
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
        <rect x="5.5" y="5.5" width="8" height="8" rx="1.6" stroke="currentColor" strokeWidth="1.3" />
        <path
          d="M10.5 3.2A1.7 1.7 0 008.8 2H3.7A1.7 1.7 0 002 3.7v5.1c0 .77.51 1.42 1.2 1.63"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </svg>
    </Button>
  );
}
