function CodeSpan({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[12px] text-neutral-700 bg-neutral-100 px-1 py-0.5 rounded">
      {children}
    </span>
  );
}

function MigrationStep({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-5 py-4 border-b border-neutral-200">
      <span className="text-[11px] tracking-[0.1em] text-neutral-400 w-5 flex-shrink-0 pt-0.5">
        {String(n).padStart(2, "0")}
      </span>
      <div>
        <p className="text-[13px] font-medium text-neutral-800 mb-1">{title}</p>
        <div className="text-[12px] leading-relaxed text-neutral-500 space-y-1">
          {children}
        </div>
      </div>
    </div>
  );
}

export function ImplementationSection() {
  return (
    <section className="px-6 sm:px-10 pt-3 pb-16">
      <div className="max-w-2xl space-y-12">

        {/* Intro */}
        <p className="text-[15px] leading-relaxed text-neutral-600">
          The system is live in <CodeSpan>jinba-landing</CodeSpan>.
        </p>
        <p className="text-[15px] leading-relaxed text-neutral-600">
          New surfaces (Flow, App, Toolbox) need to integrate the design system manually.
        </p>

        {/* Steps */}
        <div>
          <div className="border-t border-neutral-200">
            <MigrationStep n={1} title="Copy the style files">
              <p>
                From <CodeSpan>jinba-landing/apps/landing/src/styles/</CodeSpan>, copy{" "}
                <span className="font-mono text-neutral-600">scales.css · tokens.css · theme.css</span>.
                Import them in order in the global CSS entry point.
              </p>
            </MigrationStep>

            <MigrationStep n={2} title="Load the fonts">
              <p>
                Add the Google Fonts import for <CodeSpan>Geist</CodeSpan>:
              </p>
              <p className="font-mono text-neutral-600">
                fonts.googleapis.com/css2?family=Geist:wght@100..900
              </p>
              <p>
                Copy <CodeSpan>/fonts/tiempos-text-*.woff2</CodeSpan> into the new
                repo's public folder and add the <CodeSpan>@font-face</CodeSpan> blocks from{" "}
                <CodeSpan>global.css</CodeSpan>.
              </p>
            </MigrationStep>

            <MigrationStep n={3} title="Apply heading defaults">
              <p>
                Copy the <CodeSpan>@layer base</CodeSpan> block from{" "}
                <CodeSpan>global.css</CodeSpan> that sets h1–h4 sizing, tracking,
                and font-family, plus the line-height overrides below it.
              </p>
            </MigrationStep>

            <MigrationStep n={4} title="Wire Tailwind">
              <p>
                Reference <CodeSpan>theme.css</CodeSpan> with{" "}
                <CodeSpan>@theme inline</CodeSpan>. This exposes{" "}
                <CodeSpan>bg-background</CodeSpan>,{" "}
                <CodeSpan>text-foreground</CodeSpan>,{" "}
                <CodeSpan>text-sand-*</CodeSpan>, etc. as utilities that adapt
                to light and dark mode automatically.
              </p>
            </MigrationStep>
          </div>
        </div>

        {/* Next steps */}
        <div className="space-y-4">
          <p className="text-[13px] text-neutral-500">Toward a shared package</p>
          <div className="border-t border-neutral-200 pt-5 space-y-3">
            <p className="text-[12px] leading-relaxed text-neutral-500">
              The current setup copies files between repos. The mature form is a
              published NPM package — <CodeSpan>@jinba/design-system</CodeSpan> —
              that any surface installs as a dependency. Tokens, scales, and
              component primitives ship as one versioned artifact. New products
              get the full system with a single <CodeSpan>npm install</CodeSpan>.
            </p>
            <p className="text-[12px] leading-relaxed text-neutral-500">
              The token files are plain CSS custom properties, which makes them
              compatible with any design system that consumes CSS variables.
              Teams using Radix Themes, Primer, or Carbon can remap those
              systems' theme variables to Jinba's tokens — or ignore the
              Tailwind wiring entirely and reference the tokens directly in their
              own setup.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
