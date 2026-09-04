"use client";

// Implementation — adoption guide for new surfaces.
//
// Collapsed by default: the heading and what-it-is stay visible, the
// step-by-step integration detail is one tap away. Casual viewers and
// prospects skip it; an Arch / Arch Prime engineer expands it.
import { useId, useState, type ReactNode } from "react";

function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded bg-seg-on px-1.5 py-[1.5px] font-mono text-[0.86em] text-[#3d3d3d] [overflow-wrap:anywhere]">
      {children}
    </code>
  );
}

const STEPS: { num: string; title: string; body: ReactNode }[] = [
  {
    num: "01",
    title: "Load the fonts",
    body: (
      <>
        <p className="text-body text-body">
          Geist comes from <Code>next/font/google</Code>. Gascogne Serial is a licensed face — copy the five{" "}
          <Code>gascogne-*.woff2</Code> weights (200 · 300 · 400 · 500 · 700) into the new repo&apos;s public folder
          and load them with <Code>next/font/local</Code>, or the <Code>@font-face</Code> blocks from{" "}
          <Code>globals.css</Code>.
        </p>
        <p className="text-body text-body">
          Expose both as <Code>--font-sans</Code> and <Code>--font-serif</Code>; every heading resolves to the serif,
          everything else to Geist.
        </p>
      </>
    ),
  },
  {
    num: "02",
    title: "Copy the tokens",
    body: (
      <p className="text-body text-body">
        Download <Code>arch-tokens.css</Code> above. It carries the brand and neutral ramps plus the named colours
        (<Code>--arch-orange</Code>, <Code>--arch-ink</Code>, <Code>--arch-parchment</Code>, …) as plain custom
        properties. Import it before any component styles.
      </p>
    ),
  },
  {
    num: "03",
    title: "Apply heading defaults",
    body: (
      <p className="text-body text-body">
        h1–h4 take the serif with the tracking steps from the Type System (<Code>-0.03em</Code> at 64px easing to{" "}
        <Code>-0.01em</Code> at 20px). Labels run Geist, uppercase, at <Code>0.1em</Code>.
      </p>
    ),
  },
  {
    num: "04",
    title: "Wire Tailwind",
    body: (
      <p className="text-body text-body">
        Reference the token file with <Code>@theme inline</Code> (Tailwind v4, as on arch.network). This exposes{" "}
        <Code>bg-orange</Code>, <Code>text-light</Code>, <Code>bg-black</Code> and the ramp steps as utilities.
      </p>
    ),
  },
];

export default function Implementation() {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <section id="implementation" className="bg-chip px-edge py-section">
      <div className="flex max-w-measure flex-col gap-10">
        <div className="flex flex-col gap-7">
          <h2 className="text-title font-medium text-ink">Implementation</h2>
          <div className="flex flex-col gap-5 text-body-lg text-body">
            <p>
              The system is live on <Code>arch.network</Code> (Next.js · Tailwind v4).
            </p>
            <p>New surfaces (Arch Prime, docs, the ecosystem directory) integrate the design system manually.</p>
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
                {STEPS.map((s) => (
                  <li key={s.num} className="flex gap-6 border-b border-line pb-6 pt-8 first:pt-0">
                    <span className="w-4 shrink-0 text-eyebrow text-muted-2">{s.num}</span>
                    <div className="flex min-w-0 flex-1 flex-col gap-2.5">
                      <h3 className="text-value font-medium text-ink">{s.title}</h3>
                      {s.body}
                    </div>
                  </li>
                ))}
              </ol>

              <div className="flex flex-col gap-6 pt-16">
                <p className="border-t border-line pt-6 text-body-lg text-muted-1">Toward a shared package</p>
                <div className="flex flex-col gap-4">
                  <p className="text-body text-muted-2">
                    The current setup copies files between repos. The mature form is a published NPM package —{" "}
                    <Code>@arch/design-system</Code> — that any surface installs as a dependency. Tokens, scales, and
                    component primitives ship as one versioned artifact. New products get the full system with a single{" "}
                    <Code>npm install</Code>.
                  </p>
                  <p className="text-body text-muted-2">
                    The token files are plain CSS custom properties, which makes them compatible with any design system
                    that consumes CSS variables. Teams using Radix Themes, Primer, or Carbon can remap those systems&apos;
                    theme variables to Arch&apos;s tokens — or ignore the Tailwind wiring entirely and reference the
                    tokens directly in their own setup.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
