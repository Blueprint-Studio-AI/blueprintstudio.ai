"use client";

// Overview — intro headline + body (Figma 289:613).
import { useBrand } from "@/components/brands/kit/BrandContext";
import { LinkIcon } from "@/components/brands/kit/ui/icons";

export default function Overview() {
  const { overview, links } = useBrand();
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

          {/* Where the brand actually lives. A portfolio page that never points
              at the running product is a strange thing to leave a visitor with —
              and this is the natural spot, right after what the brand is. */}
          {!!links?.length && (
            <ul className="mt-2 flex list-none flex-wrap items-center gap-x-6 gap-y-3">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 text-meta font-medium text-muted-1 transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                  >
                    <span className="underline decoration-line decoration-from-font underline-offset-4 transition-colors group-hover:decoration-ink">
                      {l.label}
                    </span>
                    <LinkIcon />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
