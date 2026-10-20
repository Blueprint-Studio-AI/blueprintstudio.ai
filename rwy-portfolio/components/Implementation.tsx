"use client";

// Implementation — adoption guide for new surfaces.
//
// Collapsed by default: the heading and what-it-is stay visible, the
// step-by-step integration detail is one tap away. Casual viewers and
// prospects skip it; an RWY / HoneyB engineer expands it.
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
          The landing site loads Geist from Google Fonts with a <Code>&lt;link&gt;</Code> in{" "}
          <Code>app/layout.tsx</Code>, alongside Inter and Poly for the partner row and the HoneyB wordmark.
        </p>
        <p className="text-body text-body">
          Hiragino Sans is not loaded: it is a system font, referenced as <Code>--f-sans</Code>. It renders on Mac,
          iPhone and iPad; everywhere else the stack falls back to <Code>-apple-system</Code>, Helvetica Neue, then
          Arial.
        </p>
      </>
    ),
  },
  {
    num: "02",
    title: "Copy the tokens",
    body: (
      <p className="text-body text-body">
        The source of truth is the <Code>:root</Code> block in <Code>components/dd/dd.css</Code>:{" "}
        <Code>--ink</Code>, <Code>--paper</Code>, <Code>--coral</Code>, <Code>--muted</Code>, <Code>--line</Code>,{" "}
        <Code>--panel</Code> and the six font stacks. <Code>rwy-tokens.css</Code> above carries the brand deck&apos;s
        seven named colours (Daymark, Squid Ink, Ocean Breeze, …); the site only uses some of them so far.
      </p>
    ),
  },
  {
    num: "03",
    title: "Apply heading defaults",
    body: (
      <p className="text-body text-body">
        Headlines take Hiragino Sans at weight 500 with the tracking from the Type System (<Code>-0.035em</Code> at
        64px, <Code>-0.03em</Code> from 48px down). Body, eyebrows and controls take Geist.
      </p>
    ),
  },
  {
    num: "04",
    title: "Logo use",
    body: (
      <p className="text-body text-body">
        Nav: mark only, solid ink, white over the hero. Partner rows: full logo, solid ink. Footer: full logo, solid
        white. Favicon: coral mark. Recolouring a same-named SVG gets cached by Safari, so rename the file or add{" "}
        <Code>?v=</Code> when it changes.
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
              The system is live on <Code>rwy.xyz</Code>, built from <Code>honeybtc/doubledigit-landing</Code> (Next.js
              · Tailwind v4).
            </p>
            <p>New surfaces copy the tokens from the landing site by hand for now.</p>
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
                    a shared Nectar Group package — that any surface installs as a dependency. Tokens, scales, and
                    component primitives ship as one versioned artifact. New products get the full system with a single{" "}
                    <Code>npm install</Code>.
                  </p>
                  <p className="text-body text-muted-2">
                    The token files are plain CSS custom properties, which makes them compatible with any design system
                    that consumes CSS variables. Teams using Radix Themes, Primer, or Carbon can remap those systems&apos;
                    theme variables to RWY&apos;s tokens — or ignore the Tailwind wiring entirely and reference the
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
