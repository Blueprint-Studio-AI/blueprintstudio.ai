"use client";

// Full colour system (Figma 292:666) — always visible, no accordion. One group
// per system (light / dark / accent), each tagged with the token family it is.
// Chips carry their step number, lift on hover, and confirm a copy with a
// small centred checkmark.
import { useEffect, useRef, useState } from "react";
import { useBrand } from "@/components/brands/kit/BrandContext";
import type { Step } from "@/components/brands/kit/types";
import { relLum } from "@/components/brands/kit/lib/color";
import { copyText } from "@/components/brands/kit/lib/clipboard";
import Tag from "@/components/brands/kit/ui/Tag";
import { useToast } from "@/components/brands/kit/ui/Toast";

const COLS = 11; // ramp width — accents pad to this so every row shares a grid

function Chip({
  id,
  label,
  hex,
  copied,
  onCopy,
}: {
  id: string;
  label: string;
  hex: string;
  copied: boolean;
  onCopy: (id: string, hex: string) => void;
}) {
  const ink = relLum(hex) > 0.5 ? "#2B1C13" : "rgba(255,255,255,0.94)";
  return (
    <button
      onClick={() => onCopy(id, hex)}
      // Visible label leads the accessible name so voice control can match what
      // it says on the chip ("click 50"), not just the hex.
      aria-label={`${label} — copy ${hex.toUpperCase()}`}
      style={{ background: hex, color: ink }}
      className="relative flex h-[149px] min-w-0 flex-1 cursor-pointer flex-col rounded-2xl px-3 py-3.5 text-left transition-[transform,box-shadow] duration-200 ease-[cubic-bezier(.2,.8,.2,1)] hover:z-[3] hover:-translate-y-4 hover:shadow-[0_20px_34px_rgba(30,20,10,0.22)] max-[860px]:h-[110px] max-[860px]:min-w-[54px] max-[860px]:hover:translate-y-0 max-[860px]:hover:shadow-none"
    >
      <span className="font-mono text-label">{label}</span>
      {/* Copy confirmation. A bare checkmark left people guessing what had
          happened — it now says what it did, and the toast carries the value. */}
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 bottom-2.5 flex items-center justify-center gap-1.5 text-label transition-opacity duration-150 ${
          copied ? "opacity-100" : "opacity-0"
        }`}
      >
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" className="shrink-0">
          <path
            d="M2.4 6.3l2.4 2.3 4.8-5"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Copied
      </span>
    </button>
  );
}

function Row({
  cells,
  prefix,
  copied,
  onCopy,
  pad,
}: {
  cells: Step[];
  prefix: string;
  copied: string | null;
  onCopy: (id: string, hex: string) => void;
  /** pad the row out to COLS with invisible cells so short rows keep the grid */
  pad?: boolean;
}) {
  const spacers = pad ? Math.max(0, COLS - cells.length) : 0;
  return (
    <div className="no-scrollbar flex min-w-0 items-center gap-3.5 max-[860px]:gap-2 max-[860px]:overflow-x-auto">
      {cells.map(([n, h]) => {
        const id = `${prefix}-${n}`;
        return <Chip key={id} id={id} label={n} hex={h} copied={copied === id} onCopy={onCopy} />;
      })}
      {Array.from({ length: spacers }, (_, i) => (
        <span key={`sp-${i}`} aria-hidden className="h-[149px] min-w-0 flex-1 max-[860px]:hidden" />
      ))}
    </div>
  );
}

function Group({ tag, children }: { tag: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-6">
      <Tag>{tag}</Tag>
      <div className="flex flex-col gap-3.5">{children}</div>
    </div>
  );
}

export default function ColorLineup() {
  const { lineup: LINEUP, accents: ACCENTS, slug } = useBrand();
  const toast = useToast();
  const [copied, setCopied] = useState<string | null>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(copyTimer.current), []);

  const onCopy = async (id: string, hex: string) => {
    const value = hex.toUpperCase();
    const ok = await copyText(value);
    if (!ok) return toast("Couldn’t copy — check clipboard permissions");
    // The chip says "Copied"; the toast says what. Between them there's no
    // guessing what the click did.
    toast(`Copied ${value}`);
    setCopied(id);
    clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(null), 1200);
  };

  return (
    // 64px between systems, matching the section stack; pt leaves room for the
    // first row's hover-lift. Each system's grey tag names it — no kicker needed.
    <div className="flex flex-col gap-16 pt-2">
      {LINEUP.map((group) => (
        <Group key={group.tag} tag={`${slug}-${group.tag}`}>
          {group.rows.map((row, i) => (
            <Row key={`${group.tag}-${i}`} prefix={`${group.tag}${i}`} cells={row} copied={copied} onCopy={onCopy} />
          ))}
        </Group>
      ))}
      {ACCENTS.length > 0 && (
        <Group tag={`${slug}-accent`}>
          <Row prefix="ac" cells={ACCENTS} copied={copied} onCopy={onCopy} pad />
        </Group>
      )}
    </div>
  );
}
