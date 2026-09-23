"use client";

// A single flip card for the "Now, use them" app row. Desktop (hover-capable): hovers to peek the
// code — Tailwind v4 already gates `group-hover` behind `@media (hover: hover)`, so this never fires
// on touch. Touch (no hover): TAPS to toggle the flip, and shows a "Tap to see code" hint in the
// bottom-left of the front so the affordance is discoverable.

import { useEffect, useState, type ReactNode } from "react";
import { RustMark } from "./rust-mark";
import type { App } from "./chain-apps";

// dependency-free Rust syntax highlighter for the card-back code peeks. Tokenizes into
// comments / strings / numbers / idents / punctuation and tints them for the indigo card:
// keywords + macros orange, types (PascalCase) gold, comments dimmed; everything else cream.
const RUST_KW = new Set([
  "pub", "fn", "let", "mut", "return", "use", "impl", "struct", "enum", "self", "as", "ref", "match", "if", "else", "for", "while", "loop", "move", "where", "const", "static", "in",
]);
function highlightRust(code: string): ReactNode {
  const re = /(\/\/[^\n]*)|("(?:[^"\\]|\\.)*")|(\b\d[\d_]*(?:\.\d+)?\b)|([A-Za-z_][A-Za-z0-9_]*!?)|(\s+)|([^\s])/g;
  const out: ReactNode[] = [];
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(code)) !== null) {
    const [, comment, str, num, ident, ws] = m;
    if (comment !== undefined) out.push(<span key={k++} className="text-light/40">{comment}</span>);
    else if (str !== undefined) out.push(<span key={k++} className="text-[#e6c98a]">{str}</span>);
    else if (num !== undefined) out.push(<span key={k++} className="text-[#f0a36a]">{num}</span>);
    else if (ident !== undefined) {
      const macro = ident.endsWith("!");
      const bare = macro ? ident.slice(0, -1) : ident;
      const cls = RUST_KW.has(bare) || macro ? "text-[#f4814a]" : /^[A-Z]/.test(bare) ? "text-[#e6c98a]" : "";
      out.push(cls ? <span key={k++} className={cls}>{ident}</span> : <span key={k++}>{ident}</span>);
    } else if (ws !== undefined) out.push(ws);
    else out.push(m[6]);
  }
  return out;
}

export function FlipCard({ app }: { app: App }) {
  const [flipped, setFlipped] = useState(false);
  // touch = a device whose primary pointer can't hover; there we drive the flip by tap instead.
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: none)");
    const sync = () => setIsTouch(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <div
      className="group block h-[360px] [perspective:1400px] md:h-[380px]"
      onClick={(e) => {
        if (!isTouch) return; // desktop keeps hover-to-flip; ignore stray clicks
        if ((e.target as HTMLElement).closest("a")) return; // let the docs link work without toggling
        setFlipped((f) => !f);
      }}
    >
      {/* `flipped` only ever goes true on touch (guarded above), so on hover devices the state class
          is inert and `group-hover` alone drives the flip — no desktop/touch conflict. */}
      <div
        className={`relative h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] motion-reduce:transition-none motion-reduce:group-hover:[transform:none] ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* FRONT — typographic: icon top-left, title + body centered vertically */}
        <div className="absolute inset-0 flex flex-col rounded-[8px] bg-white p-6 ring-1 ring-inset ring-black/[0.06] [-webkit-backface-visibility:hidden] [backface-visibility:hidden] md:p-8">
          {/* small light-gray word mark — a quiet visual tag in the corner, not a CTA. */}
          <span className="text-[0.82rem] font-medium text-neutral-400" aria-hidden="true">
            {app.tag}
          </span>
          <div className="flex flex-1 flex-col justify-center">
            <h4 className="text-balance text-[1.4rem] font-medium leading-[1.18] tracking-[-0.02em] text-neutral-900">
              {app.title}
            </h4>
            <p className="mt-3 text-pretty text-[0.92rem] leading-[1.5] text-neutral-600">{app.desc}</p>
          </div>
          {/* touch-only affordance — a hair lighter than the corner tag (neutral-300 vs -400) */}
          {isTouch && (
            <span
              aria-hidden="true"
              className="absolute bottom-6 left-6 text-[0.72rem] font-medium text-neutral-300 md:bottom-8 md:left-8"
            >
              Tap to see code
            </span>
          )}
        </div>
        {/* BACK — deep-indigo (the WhyBand band) + cream/tan code for contrast & brand tie */}
        <div className="absolute inset-0 flex flex-col rounded-[8px] bg-[#1f1c3e] p-5 [-webkit-backface-visibility:hidden] [backface-visibility:hidden] [transform:rotateY(180deg)] md:p-6">
          <div className="mb-3 flex items-center">
            <RustMark className="h-[18px] w-[18px] text-light/70" />
          </div>
          <pre className="min-h-0 flex-1 overflow-hidden text-[0.66rem] leading-[1.55] text-light/[0.88]">
            <code className="font-mono">{highlightRust(app.code)}</code>
          </pre>
          {/* docs link disguised as the snippet's trailing comment */}
          <a
            href={app.docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 self-start font-mono text-[0.66rem] leading-[1.55] text-light/45 underline decoration-light/25 underline-offset-2 transition-colors hover:text-light hover:decoration-light/60"
          >
            {"// more in the docs"}
          </a>
        </div>
      </div>
    </div>
  );
}
