"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Field } from "./fields";
import { FieldsContext, type Fields } from "./fields-context";
import { Icon } from "./icons";
import { EDITOR_CSS } from "./styles";
import type { JsonSchema } from "./types";

// Edit mode for a page that isn't a post, such as the blog's home: the site renders the
// page itself, with EditableText where its words go. This holds the page's settings and
// saves them as you go. Sections the settings can switch off are marked on the page with
// data-gx-section="<setting>"; hovering one offers Hide or Show, and a hidden one stays
// in edit mode, faded, so it can be brought back. A page with nothing to set (no
// `schema`) gets just the rail.

export type PageSaveResult = { ok: true; revision: string } | { ok: false; error: string };

export function EditPage({
  values: initial = {},
  revision = "",
  save,
  schema,
  inlineFields = [],
  sections = {},
  viewUrl,
  title = "Page settings",
  children,
}: {
  values?: Record<string, unknown>;
  revision?: string;
  save?(values: Record<string, unknown>, revision: string): Promise<PageSaveResult>;
  /** The settings' JSON Schema, for the settings panel. */
  schema?: JsonSchema;
  /** Settings edited on the page itself, left out of the panel. */
  inlineFields?: string[];
  /** On/off settings that show or hide a section, with the section's name. */
  sections?: Record<string, string>;
  viewUrl: string;
  title?: string;
  children: React.ReactNode;
}) {
  const [values, setValues] = useState(initial);
  const [state, setState] = useState<"saved" | "dirty" | "saving" | "error">("saved");
  const [error, setError] = useState<string | null>(null);
  const [panel, setPanel] = useState(false);
  const latest = useRef(values);
  const rev = useRef(revision);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flush = useCallback(async () => {
    if (timer.current) clearTimeout(timer.current);
    if (!save) return;
    setState("saving");
    const result = await save(latest.current, rev.current).catch((e: Error): PageSaveResult => ({ ok: false, error: e.message }));
    if (result.ok) {
      rev.current = result.revision;
      setError(null);
      setState("saved");
    } else {
      setError(result.error);
      setState("error");
    }
  }, [save]);

  const setField = useCallback(
    (field: string, value: unknown) => {
      const next = { ...latest.current, [field]: value };
      latest.current = next;
      setValues(next);
      setState("dirty");
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => void flush(), 900);
    },
    [flush],
  );

  const unsaved = state !== "saved";
  useEffect(() => {
    if (!unsaved) return;
    const onLeave = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", onLeave);
    return () => window.removeEventListener("beforeunload", onLeave);
  }, [unsaved]);

  // Hide or Show, over whichever section the pointer is on.
  const root = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<{ key: string; top: number; right: number } | null>(null);
  useEffect(() => {
    let current: Element | null = null;
    const place = (el: Element | null) => {
      current = el;
      if (!el) return setHover(null);
      const r = el.getBoundingClientRect();
      setHover({ key: el.getAttribute("data-gx-section")!, top: Math.max(96, r.top + 8), right: window.innerWidth - r.right + 8 });
    };
    const onOver = (e: MouseEvent) => {
      const target = e.target as Element;
      if (target.closest(".gx-section-chip")) return;
      const el = target.closest("[data-gx-section]");
      place(el && root.current?.contains(el) ? el : null);
    };
    const onScroll = () => place(current);
    document.addEventListener("mouseover", onOver);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      document.removeEventListener("mouseover", onOver);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, []);

  const off = Object.keys(sections).filter((key) => values[key] === false);
  const faded = off.map((key) => `.gx-page [data-gx-section="${key}"]`).join(", ");
  const fields = useMemo<Fields>(() => ({ values, setField }), [values, setField]);
  const status = { saved: "Saved", dirty: "Saving…", saving: "Saving…", error: "Not saved" }[state];

  return (
    <FieldsContext.Provider value={fields}>
      <style>{EDITOR_CSS}</style>
      {faded ? <style>{`${faded} { opacity: .32; filter: grayscale(1); }`}</style> : null}
      <div ref={root} className={`gx-page gx-session${panel ? " has-drawer" : ""}`}>
        {children}
      </div>

      {hover && sections[hover.key] ? (
        <button
          type="button"
          className="gx-section-chip"
          style={{ top: hover.top, right: hover.right }}
          onClick={() => setField(hover.key, values[hover.key] === false)}
          onMouseLeave={() => setHover(null)}
        >
          {values[hover.key] === false ? `${sections[hover.key]} is hidden · Show` : `Hide ${sections[hover.key].toLowerCase()}`}
        </button>
      ) : null}

      <nav className="gx-rail" aria-label="Edit mode">
        <button type="button" className={`gx-rail-btn gx-rail-status is-${state}`} aria-label={status} data-tip={state === "saved" ? "Saved. Changes save as you go." : status} onClick={() => void flush()}>
          <i />
        </button>
        <span className="gx-rail-sep" />
        {schema ? (
          <>
            <button type="button" className={`gx-rail-btn${panel ? " is-on" : ""}`} aria-label={title} data-tip={title} onClick={() => setPanel((p) => !p)}>
              <Icon name="details" />
            </button>
            <span className="gx-rail-sep" />
          </>
        ) : null}
        <a className="gx-rail-btn gx-rail-done" href={viewUrl} aria-label="Done" data-tip="Done: see the page">
          <Icon name="check" />
        </a>
      </nav>

      {error ? (
        <div className="gx-toast" role="alert">
          <b>Not saved.</b> {error}
        </div>
      ) : null}

      {panel && schema ? (
        <aside className="gx-drawer" data-lenis-prevent>
          <header className="gx-drawer-head">
            <b className="gx-drawer-title">{title}</b>
            <button type="button" className="gx-drawer-close" onClick={() => setPanel(false)} aria-label="Close">
              ×
            </button>
          </header>
          <div className="gx-details" onKeyDown={(e) => e.stopPropagation()}>
            <p className="gx-panel-help">What shows on the page. Its words are edited on the page itself. Changes save as you go.</p>
            {Object.entries(schema.properties ?? {})
              .filter(([name]) => !inlineFields.includes(name))
              .map(([name, field]) => (
                <Field
                  key={name}
                  name={name}
                  schema={field}
                  value={values[name]}
                  required={(schema.required ?? []).includes(name)}
                  context={{ vocabulary: {}, placeholders: {} }}
                  onChange={(value) => setField(name, value)}
                />
              ))}
          </div>
        </aside>
      ) : null}
    </FieldsContext.Provider>
  );
}
