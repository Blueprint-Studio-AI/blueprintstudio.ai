"use client";

// "Copy for AI" — hands the brand's design system to a coding agent.
//
// The page already tells a human how to adopt the system; this is the same
// thing addressed to a machine. Paste it into Cursor/Claude/whatever and prompt
// "build X following this", and the tokens, type scale, component specs and
// motion rules come along.
//
// The doc served here is a PUBLIC BUILD of the brand's internal DESIGN.md —
// see scripts/build-agent-doc.mjs, which strips repos, deploy URLs, access
// links and internal notes at build time and refuses to emit a file that still
// contains them. Never point this at a raw internal doc.
import { useCallback, useEffect, useRef, useState } from "react";
import { useBrand } from "@/components/brands/kit/BrandContext";
import { copyText } from "@/components/brands/kit/lib/clipboard";
import { useToast } from "@/components/brands/kit/ui/Toast";
import { DownloadIcon } from "@/components/brands/kit/ui/icons";

export default function AgentDoc() {
  const { agentDoc, name } = useBrand();
  const toast = useToast();
  const [text, setText] = useState<string | null>(null);
  const [state, setState] = useState<"idle" | "copied" | "error">("idle");
  const btn = useRef<HTMLButtonElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const file = agentDoc?.file;

  // Prefetch on mount. Safari only honours a clipboard write inside the click's
  // own task, so awaiting a 37KB fetch on click would silently fail — the text
  // has to be in hand before the user presses the button.
  useEffect(() => {
    if (!file) return;
    let alive = true;
    fetch(file)
      .then((r) => (r.ok ? r.text() : Promise.reject(new Error(String(r.status)))))
      .then((t) => alive && setText(t))
      .catch(() => alive && setText(null));
    return () => {
      alive = false;
    };
  }, [file]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = useCallback(async () => {
    if (!text) {
      setState("error");
      return;
    }
    // Report what actually happened — a blocked clipboard write shouldn't say
    // "Copied" and leave someone pasting stale content.
    const ok = await copyText(text, btn.current);
    setState(ok ? "copied" : "error");
    toast(ok ? `Copied the ${name} design system` : "Couldn’t copy — use Download instead");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), 2000);
  }, [text, name, toast]);

  if (!agentDoc) return null;

  const kb = text ? Math.round(text.length / 1024) : null;

  return (
    <div className="flex flex-col gap-6 border-t border-line pt-6">
      <div className="flex flex-col gap-2.5">
        <h3 className="text-body-lg font-medium text-ink">{agentDoc.title}</h3>
        <p className="text-body text-muted-2">{agentDoc.blurb}</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          ref={btn}
          onClick={copy}
          disabled={!text}
          className="inline-flex h-11 cursor-pointer items-center gap-2.5 rounded-full bg-nav-surface px-6 text-label text-white transition-colors hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-default disabled:opacity-45"
        >
          {state === "copied" ? (
            <>
              Copied
              <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden>
                <path d="M2.4 6.3l2.4 2.3 4.8-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </>
          ) : (
            <>
              Copy for AI
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                <rect x="5.5" y="5.5" width="8" height="8" rx="1.6" stroke="currentColor" strokeWidth="1.3" />
                <path d="M10.5 3.2A1.7 1.7 0 008.8 2H3.7A1.7 1.7 0 002 3.7v5.1c0 .77.51 1.42 1.2 1.63" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            </>
          )}
        </button>

        <a
          href={file}
          download
          onClick={() => toast("Downloading the design system")}
          className="inline-flex h-11 items-center gap-2.5 rounded-full border border-line bg-white px-6 text-meta font-medium text-muted-3 transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          Download .md
          <DownloadIcon />
        </a>

        {/* Live region: the button's own label change is the primary feedback,
            but a disabled/failed state needs to reach a screen reader too. */}
        <span role="status" aria-live="polite" className="text-meta text-muted-3">
          {state === "error"
            ? "Couldn’t copy — use Download instead."
            : kb !== null
              ? `${name} design system · ${kb} KB of Markdown`
              : "Loading…"}
        </span>
      </div>
    </div>
  );
}
