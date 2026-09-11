"use client";

// Tinted fields (brand.colorFields) — one wide card per field: the tint itself,
// the field's key colour as a left edge, and the hex for copying. Not a second
// palette: these are the "rooms" under one of the named hues (Arch Prime's four
// Earn categories, brand deck p.17).
import { useEffect, useRef, useState } from "react";
import { useBrand } from "@/components/brands/kit/BrandContext";
import { copyText } from "@/components/brands/kit/lib/clipboard";
import Tag from "@/components/brands/kit/ui/Tag";
import { useToast } from "@/components/brands/kit/ui/Toast";

export default function ColorFields() {
  const { colorFields } = useBrand();
  const toast = useToast();
  const [copied, setCopied] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  if (!colorFields) return null;
  const { tag, eyebrow, items } = colorFields;

  const onCopy = async (name: string, hex: string) => {
    const value = hex.toUpperCase();
    const ok = await copyText(value);
    if (!ok) return toast("Couldn’t copy — check clipboard permissions");
    toast(`Copied ${value}`);
    setCopied(name);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(null), 1200);
  };

  return (
    <div className="flex flex-col gap-6 pt-2">
      <Tag>{tag}</Tag>
      <div className="grid grid-cols-4 gap-6 max-[1200px]:grid-cols-2 max-[600px]:grid-cols-1">
        {items.map((c) => (
          <button
            key={c.name}
            onClick={() => onCopy(c.name, c.hex)}
            aria-label={`${c.name} — copy ${c.hex.toUpperCase()}`}
            style={{ background: c.hex }}
            className="relative flex h-[110px] flex-col justify-center overflow-hidden rounded-xl py-5 pl-8 pr-6 text-left transition-[transform,box-shadow] duration-200 ease-[cubic-bezier(.2,.8,.2,1)] hover:-translate-y-1 hover:shadow-[0_14px_28px_rgba(30,20,10,0.14)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            {/* key-colour edge */}
            <span aria-hidden className="absolute inset-y-0 left-0 w-[6px]" style={{ background: c.stripe }} />
            <span className="text-label text-[#5f5f5f]">{eyebrow}</span>
            <span className="mt-1 flex items-baseline justify-between gap-3">
              <span className="text-body-lg font-medium text-ink">{c.name}</span>
              <span className="font-mono text-meta text-[#6b6b6b]">{copied === c.name ? "Copied" : c.hex.toUpperCase()}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
