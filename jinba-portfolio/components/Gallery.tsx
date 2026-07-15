// Design Applications — one full-bleed horizontal rail, reused per section.
import type { Sample } from "@/lib/data";

export default function Gallery({ items }: { items: Sample[] }) {
  return (
    <section className="py-section">
      <p className="mb-16 px-edge text-eyebrow uppercase text-muted-2">Design Applications</p>
      <div className="no-scrollbar flex gap-[var(--rail-gap)] overflow-x-auto pb-1.5 pl-edge">
        {items.map((s) => (
          <figure key={s.src} className="m-0 shrink-0 basis-[790px] max-w-[82vw]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={s.src}
              alt={s.alt}
              loading="lazy"
              className="aspect-[790/445] w-full rounded-lg bg-[#f4f1eb] object-cover"
            />
            <figcaption className="mt-3 text-body-sm tracking-title text-muted-3">{s.caption}</figcaption>
          </figure>
        ))}
        {/* trailing spacer preserves the right inset (Safari drops scroll-end padding) */}
        <div aria-hidden className="shrink-0 basis-[max(1px,calc(var(--pad)-var(--rail-gap)))]" />
      </div>
    </section>
  );
}
