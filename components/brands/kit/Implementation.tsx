"use client";

// Implementation — adoption guide for new surfaces (Figma 288:572).
//
// Collapsed by default, like the old "under the hood" block: the heading and
// what-it-is stay visible, the step-by-step integration detail is one tap away.
// Casual viewers and prospects skip it; an engineer expands it.
//
// Copy comes from the brand config as plain strings; `backticks` become inline
// code, so a brand never has to ship JSX.
import { useId, useState, type ReactNode } from "react";
import { useBrand } from "@/components/brands/kit/BrandContext";

function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded bg-seg-on px-1.5 py-[1.5px] font-mono text-[0.86em] text-[#3d3d3d] [overflow-wrap:anywhere]">
      {children}
    </code>
  );
}

/** Splits on `backticks`, rendering those runs as inline code. */
function rich(text: string): ReactNode[] {
  return text.split(/(`[^`]+`)/g).map((part, i) =>
    part.startsWith("`") && part.endsWith("`") && part.length > 1 ? (
      <Code key={i}>{part.slice(1, -1)}</Code>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

export default function Implementation() {
  const { implementation } = useBrand();
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <section id="implementation" className="bg-chip px-edge py-section">
      <div className="flex max-w-measure flex-col gap-10">
        <div className="flex flex-col gap-7">
          <h2 className="text-title font-medium text-ink">Implementation</h2>
          <div className="flex flex-col gap-5 text-body-lg text-body">
            {implementation.intro.map((p) => (
              <p key={p.slice(0, 32)}>{rich(p)}</p>
            ))}
          </div>
        </div>

        <div className="flex flex-col">
          <button
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls={panelId}
            className="group flex w-full items-center justify-between gap-4 border-t border-line pt-6 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            <span className="text-body-lg font-medium text-ink">Integration steps &amp; roadmap</span>
            <span className="flex items-center gap-2 text-meta text-muted-2 transition-colors group-hover:text-ink">
              {open ? "Hide" : "Show"}
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden
                className={`shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
              >
                <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>

          {/* grid-rows 0fr→1fr animates height without measuring; reduced-motion
              collapses it instantly via the global override. */}
          <div
            id={panelId}
            className={`grid transition-[grid-template-rows] duration-300 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
          >
            <div className="min-h-0 overflow-hidden" inert={!open} aria-hidden={!open}>
              <ol className="list-none pt-8">
                {implementation.steps.map((s, i) => (
                  <li key={s.title} className="flex gap-6 border-b border-line pb-6 pt-8 first:pt-0">
                    <span className="w-4 shrink-0 text-eyebrow text-muted-2">{String(i + 1).padStart(2, "0")}</span>
                    <div className="flex min-w-0 flex-1 flex-col gap-2.5">
                      <h3 className="text-value font-medium text-ink">{s.title}</h3>
                      {s.body.map((p) => (
                        <p key={p.slice(0, 32)} className="text-body text-body">
                          {rich(p)}
                        </p>
                      ))}
                    </div>
                  </li>
                ))}
              </ol>

              <div className="flex flex-col gap-6 pt-16">
                <p className="border-t border-line pt-6 text-body-lg text-muted-1">{implementation.roadmapTitle}</p>
                <div className="flex flex-col gap-4">
                  {implementation.roadmap.map((p) => (
                    <p key={p.slice(0, 32)} className="text-body text-muted-2">
                      {rich(p)}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
