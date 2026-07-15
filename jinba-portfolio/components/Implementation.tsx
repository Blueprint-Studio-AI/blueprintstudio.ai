// Implementation — adoption guide for new surfaces (Figma 288:572).
import type { ReactNode } from "react";

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
    title: "Copy the style files",
    body: (
      <p className="text-body text-body">
        From <Code>jinba-landing/apps/landing/src/styles/</Code>, copy <Code>scales.css</Code> · <Code>tokens.css</Code>{" "}
        · <Code>theme.css</Code>. Import them in order in the global CSS entry point.
      </p>
    ),
  },
  {
    num: "02",
    title: "Load the fonts",
    body: (
      <>
        <p className="text-body text-body">
          Add the Google Fonts import for <Code>Geist</Code>:
          <br />
          <Code>fonts.googleapis.com/css2?family=Geist:wght@100..900</Code>
        </p>
        <p className="text-body text-body">
          Copy <Code>/fonts/tiempos-text-*.woff2</Code> into the new repo&apos;s public folder and add the{" "}
          <Code>@font-face</Code> blocks from <Code>global.css</Code>.
        </p>
      </>
    ),
  },
  {
    num: "03",
    title: "Apply heading defaults",
    body: (
      <p className="text-body text-body">
        Copy the <Code>@layer base</Code> block from <Code>global.css</Code> that sets h1–h4 sizing, tracking, and
        font-family, plus the line-height overrides below it.
      </p>
    ),
  },
  {
    num: "04",
    title: "Wire Tailwind",
    body: (
      <p className="text-body text-body">
        Reference <Code>theme.css</Code> with <Code>@theme inline</Code>. This exposes <Code>bg-background</Code>,{" "}
        <Code>text-foreground</Code>, <Code>text-sand-*</Code>, etc. as utilities that adapt to light and dark mode
        automatically.
      </p>
    ),
  },
];

export default function Implementation() {
  return (
    <section id="implementation" className="bg-chip px-edge py-section">
      <div className="flex max-w-measure flex-col gap-16">
        <div className="flex flex-col gap-7">
          <h2 className="text-title font-medium text-ink">Implementation</h2>
          <div className="flex flex-col gap-5 text-body-lg text-body">
            <p>
              The system is live in <Code>jinba-landing</Code>.
            </p>
            <p>New surfaces (Flow, App, Toolbox) need to integrate the design system manually.</p>
          </div>
        </div>

        <ol className="list-none">
          {STEPS.map((s) => (
            <li key={s.num} className="flex gap-6 border-b border-line pb-6 pt-8">
              <span className="w-4 shrink-0 text-eyebrow text-muted-2">{s.num}</span>
              <div className="flex min-w-0 flex-1 flex-col gap-2.5">
                <h3 className="text-[18px] font-medium leading-[1.13] tracking-heading text-ink">{s.title}</h3>
                {s.body}
              </div>
            </li>
          ))}
        </ol>

        <div className="flex flex-col gap-6">
          <p className="border-t border-line pt-6 text-body-lg text-muted-1">Toward a shared package</p>
          <div className="flex flex-col gap-4">
            <p className="text-body text-muted-2">
              The current setup copies files between repos. The mature form is a published NPM package —{" "}
              <Code>@jinba/design-system</Code> — that any surface installs as a dependency. Tokens, scales, and
              component primitives ship as one versioned artifact. New products get the full system with a single{" "}
              <Code>npm install</Code>.
            </p>
            <p className="text-body text-muted-2">
              The token files are plain CSS custom properties, which makes them compatible with any design system that
              consumes CSS variables. Teams using Radix Themes, Primer, or Carbon can remap those systems&apos; theme
              variables to Jinba&apos;s tokens — or ignore the Tailwind wiring entirely and reference the tokens directly
              in their own setup.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
