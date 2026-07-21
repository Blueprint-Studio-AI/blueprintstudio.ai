"use client";

// Overview — intro headline + body (Figma 289:613).
import { useBrand } from "@/components/brands/kit/BrandContext";

export default function Overview() {
  const { overview } = useBrand();
  return (
    <section id="overview" className="px-edge py-section">
      <div className="flex items-start gap-gutter max-[1360px]:gap-24 max-[860px]:flex-col max-[860px]:gap-10">
        <div className="w-[596px] shrink-0 max-[1360px]:w-[45%] max-[1200px]:w-1/2 max-[860px]:w-full">
          <h1 className="text-headline font-medium text-ink max-[860px]:text-headline-mobile">
            {overview.headline}
            <br />
            <span className="text-faint">{overview.headlineFaint}</span>
          </h1>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-[1.4em] text-body-lg text-body">
          {overview.body.map((p) => (
            <p key={p.slice(0, 32)}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
