"use client";

// Brand Assets — every downloadable asset, one category at a time.
//
// A grid rather than a preview-and-select list: prospects scroll instead of
// clicking, so the work has to land without interaction, and "Brush 3" tells you
// nothing a thumbnail doesn't tell you better. Clients get a per-card Download
// plus Download All in the header — the two cases that actually happen.
import { useState } from "react";
import Image from "next/image";
import { ASSET_CATEGORIES } from "@/lib/data";
import Button from "@/components/ui/Button";
import { DownloadIcon } from "@/components/ui/icons";
import AssetGenerator from "@/components/AssetGenerator";

export default function BrandAssets() {
  const [active, setActive] = useState(ASSET_CATEGORIES[0].id);
  const category = ASSET_CATEGORIES.find((c) => c.id === active) ?? ASSET_CATEGORIES[0];

  return (
    <section className="flex flex-col gap-16 px-edge pb-section pt-16">
      {/* Rule spans the tabs only, never the page. An unproduced category says so
          on the control — you learn it before spending a click, not after. */}
      {/* w-fit keeps the rule under the tabs only; max-w-full + scroll stops the
          four labels from pushing the page wide on a phone. */}
      <div
        role="tablist"
        aria-label="Asset categories"
        className="no-scrollbar flex w-fit max-w-full items-center gap-8 overflow-x-auto border-b border-line max-[600px]:gap-5"
      >
        {ASSET_CATEGORIES.map((c) => {
          const empty = c.items.length === 0;
          const on = c.id === active;
          return (
            <button
              key={c.id}
              role="tab"
              aria-selected={on}
              aria-disabled={empty || undefined}
              onClick={() => !empty && setActive(c.id)}
              className={`-mb-px flex shrink-0 items-center gap-2 border-b-2 pb-3 text-meta transition-colors ${
                on
                  ? "border-ink font-medium text-ink"
                  : empty
                    ? "cursor-default border-transparent text-muted-3"
                    : "cursor-pointer border-transparent text-muted-1 hover:text-ink"
              }`}
            >
              {c.label}
              {empty && (
                <span className="rounded bg-chip px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-muted-3">
                  Soon
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="statement">
        <div className="grid grid-cols-3 gap-x-6 gap-y-14 max-[860px]:grid-cols-1">
          {category.items.map(([name, file, dims, size]) => (
            <figure key={file} className="m-0 flex flex-col gap-3">
              {/* next/image, not <img>: these thumbnails ARE the source files —
                  Field 2 is a 14MB PNG rendering in a ~400px card. The optimizer
                  serves a resized AVIF/WebP while Download still hands over the
                  original. */}
              <Image
                src={`${category.dir}/${file}`}
                alt={name}
                width={816}
                height={510}
                sizes="(max-width: 860px) 100vw, 33vw"
                className="aspect-[16/10] w-full rounded-lg bg-[#f4f1eb] object-cover"
              />
              <figcaption className="flex items-baseline justify-between gap-2.5">
                <div>
                  <div className="text-meta font-medium tracking-snug text-ink">{name}</div>
                  <div className="font-mono text-micro text-muted-3">
                    PNG · {dims} · {size}
                  </div>
                </div>
                {/* names the asset — otherwise a links list reads
                    "Download, Download, Download…" with nothing to tell apart */}
                <Button
                  variant="ghost"
                  size="sm"
                  href={`${category.dir}/${file}`}
                  download
                  aria-label={`Download ${name} — PNG, ${dims}, ${size}`}
                >
                  Download
                  <DownloadIcon size={14} />
                </Button>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <AssetGenerator category={category} />
    </section>
  );
}
