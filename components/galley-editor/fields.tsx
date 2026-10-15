"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { JsonSchema, Term, Vocabulary } from "./types";

// Fields made from JSON Schema, for a component's props and a post's details. Choices
// that come from the site's vocabulary (categories, types, topics, series) can be picked
// or added. Objects become small forms, lists of objects become rows, and dates read as
// dates.

export const plain = (schema: JsonSchema): JsonSchema =>
  schema.anyOf ? (schema.anyOf.find((s) => s.type !== "null") ?? schema) : schema;
const nullable = (schema: JsonSchema) => Boolean(schema.anyOf?.some((s) => s.type === "null"));

/** Labels for props whose names don't read well on their own, by "Component.prop" or "prop". */
const LABELS: Record<string, string> = {
  "YouTube.id": "YouTube link",
  "YouTube.start": "Start at (seconds)",
  alt: "Alt text",
  src: "File",
  url: "Link",
  href: "Link",
  to: "Number",
  publishedAt: "Published",
  ogImage: "Social image",
  seo: "Search and sharing",
  part: "Issue",
  slug: "Name",
};

export const labelOf = (name: string, component?: string) =>
  LABELS[`${component}.${name}`] ??
  LABELS[name] ??
  name
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase())
    .replace(/ (\w)/g, (_, c: string) => ` ${c.toLowerCase()}`);

/** A YouTube link or ID → the ID, and the start time if the link has one. */
export function youTube(value: string): { id: string; start?: number } {
  const v = value.trim();
  try {
    const url = new URL(v);
    const id = url.hostname.endsWith("youtu.be")
      ? url.pathname.slice(1)
      : (url.searchParams.get("v") ?? url.pathname.match(/\/(?:embed|shorts|live)\/([\w-]{6,})/)?.[1] ?? "");
    const t = url.searchParams.get("t") ?? url.searchParams.get("start");
    return { id, ...(t ? { start: Number.parseInt(t, 10) || undefined } : {}) };
  } catch {
    return { id: v };
  }
}

const LONG = /^(summary|description|excerpt|caption|body|quote|text)$/;
const formatDate = (iso: string) => {
  const d = new Date(iso.length === 10 ? `${iso}T12:00:00` : iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

export interface FieldContext {
  /** Vocabulary for a field path, e.g. "category", "topics", "series.slug". */
  vocabulary?: Vocabulary;
  addTerm?(kind: string, name: string): Promise<Term | { error: string }>;
  /** Placeholder text for empty fields, e.g. the summary's fallback. */
  placeholders?: Record<string, string>;
}

// ---- Picking a term, or adding one ---------------------------------------------------

export function TermPicker({
  terms,
  value,
  multiple,
  onChange,
  onAdd,
  placeholder,
  autoFocus,
  onDone,
}: {
  terms: Term[];
  value: string | string[] | null | undefined;
  multiple?: boolean;
  onChange(value: string | string[] | null): void;
  onAdd?: (name: string) => Promise<Term | { error: string }>;
  placeholder?: string;
  autoFocus?: boolean;
  onDone?: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const [busy, setBusy] = useState(false);
  const chosen = useMemo(() => new Set(Array.isArray(value) ? value : value ? [value] : []), [value]);
  const q = query.trim().toLowerCase();
  const matches = terms.filter((t) => !q || t.name.toLowerCase().includes(q) || t.slug.includes(q));
  const exact = terms.some((t) => t.name.toLowerCase() === q);
  const rows: ({ kind: "term"; term: Term } | { kind: "add" })[] = [
    ...matches.map((term) => ({ kind: "term" as const, term })),
    ...(q && !exact && onAdd ? [{ kind: "add" as const }] : []),
  ];

  const pick = async (row: (typeof rows)[number] | undefined) => {
    if (!row) return;
    let slug: string;
    if (row.kind === "add") {
      if (!onAdd) return;
      setBusy(true);
      setError(null);
      const added = await onAdd(query.trim())
        .catch((e: Error) => ({ error: e.message }))
        .finally(() => setBusy(false));
      if ("error" in added) return setError(added.error);
      slug = added.slug;
    } else slug = row.term.slug;
    if (multiple) {
      const next = chosen.has(slug) ? [...chosen].filter((s) => s !== slug) : [...chosen, slug];
      onChange(next);
    } else {
      onChange(slug);
      onDone?.();
    }
    setQuery("");
    setIndex(0);
  };

  return (
    <div className="gx-picker" onKeyDown={(e) => e.stopPropagation()}>
      <input
        autoFocus={autoFocus}
        value={query}
        placeholder={placeholder ?? (onAdd ? "Find or add…" : "Find…")}
        onChange={(e) => {
          setQuery(e.target.value);
          setIndex(0);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setIndex((i) => Math.min(i + 1, rows.length - 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setIndex((i) => Math.max(i - 1, 0));
          } else if (e.key === "Enter") {
            e.preventDefault();
            void pick(rows[index]);
          } else if (e.key === "Escape") onDone?.();
        }}
      />
      <div className="gx-picker-list">
        {rows.map((row, i) =>
          row.kind === "term" ? (
            <button
              key={row.term.slug}
              type="button"
              className={`${i === index ? "is-hover " : ""}${chosen.has(row.term.slug) ? "is-on" : ""}`}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => void pick(row)}
            >
              <b>{row.term.name}</b>
              {row.term.description ? <span>{row.term.description}</span> : null}
            </button>
          ) : (
            <button key="add" type="button" className={`gx-picker-add${i === index ? " is-hover" : ""}`} disabled={busy} onClick={() => void pick(row)}>
              {busy ? "Adding…" : `Add “${query.trim()}”`}
            </button>
          ),
        )}
        {!rows.length ? <p className="gx-empty">Nothing matches.</p> : null}
      </div>
      {error ? <p className="gx-form-error">{error}</p> : null}
    </div>
  );
}

/** A single choice from the vocabulary, shown as its name; click to change. */
function TermSelect({ terms, value, onChange, onAdd, required }: { terms: Term[]; value: unknown; onChange(v: unknown): void; onAdd?: (name: string) => Promise<Term | { error: string }>; required: boolean }) {
  const [open, setOpen] = useState(false);
  const current = terms.find((t) => t.slug === value);
  return (
    <div className="gx-termselect">
      <button type="button" className="gx-termselect-value" onClick={() => setOpen((o) => !o)}>
        {current?.name ?? (value ? String(value) : "Choose…")}
        <span aria-hidden>▾</span>
      </button>
      {open ? (
        <div className="gx-termselect-pop">
          <TermPicker
            autoFocus
            terms={terms}
            value={value as string}
            onChange={(v) => onChange(v ?? undefined)}
            onAdd={onAdd}
            onDone={() => setOpen(false)}
          />
          {!required && value ? (
            <button
              type="button"
              className="gx-link-button"
              onClick={() => {
                onChange(undefined);
                setOpen(false);
              }}
            >
              Clear
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

/** Several choices from the vocabulary, as chips; add from the picker. */
function TermChips({ terms, value, onChange, onAdd }: { terms: Term[]; value: unknown; onChange(v: unknown): void; onAdd?: (name: string) => Promise<Term | { error: string }> }) {
  const [open, setOpen] = useState(false);
  const chosen = Array.isArray(value) ? (value as string[]) : [];
  return (
    <div className="gx-chips">
      {chosen.map((slug) => (
        <button key={slug} type="button" className="is-on" title="Remove" onClick={() => onChange(chosen.filter((s) => s !== slug))}>
          {terms.find((t) => t.slug === slug)?.name ?? slug} ×
        </button>
      ))}
      <span className="gx-termselect">
        <button type="button" onClick={() => setOpen((o) => !o)}>
          + Add
        </button>
        {open ? (
          <div className="gx-termselect-pop">
            <TermPicker autoFocus multiple terms={terms} value={chosen} onChange={(v) => onChange(v)} onAdd={onAdd} onDone={() => setOpen(false)} />
          </div>
        ) : null}
      </span>
    </div>
  );
}

// ---- One field ----------------------------------------------------------------------

export function Field({
  name,
  path = name,
  schema: raw,
  value,
  required,
  component,
  context = {},
  onChange,
}: {
  name: string;
  /** Where the value sits in the post's details, e.g. "series.slug". */
  path?: string;
  schema: JsonSchema;
  value: unknown;
  required: boolean;
  component?: string;
  context?: FieldContext;
  onChange(value: unknown): void;
}) {
  const schema = plain(raw);
  const id = `gx-${component ?? "post"}-${path.replace(/\W/g, "-")}`;
  const items = schema.items ? plain(schema.items) : undefined;
  const vocab = context.vocabulary?.[path];
  const onAdd =
    vocab && context.addTerm
      ? async (termName: string) => {
          const added = await context.addTerm!(vocab.kind, termName);
          if (!("error" in added)) vocab.terms.push(added);
          return added;
        }
      : undefined;
  const [changingDate, setChangingDate] = useState(false);
  let input: React.ReactNode;

  if (vocab && schema.type === "array") {
    input = <TermChips terms={vocab.terms} value={value} onChange={onChange} onAdd={onAdd} />;
  } else if (vocab) {
    input = <TermSelect terms={vocab.terms} value={value} onChange={onChange} onAdd={onAdd} required={required} />;
  } else if (schema.enum) {
    input = (
      <select id={id} value={value === undefined || value === null ? "" : String(value)} onChange={(e) => onChange(e.target.value || undefined)}>
        {!required && <option value="">Default</option>}
        {schema.enum.map((option) => (
          <option key={String(option)} value={String(option)}>
            {labelOf(String(option))}
          </option>
        ))}
      </select>
    );
  } else if (schema.type === "array" && items?.enum) {
    const chosen = new Set(Array.isArray(value) ? (value as unknown[]).map(String) : []);
    input = (
      <div className="gx-chips" id={id}>
        {items.enum.map((option) => {
          const key = String(option);
          const on = chosen.has(key);
          return (
            <button key={key} type="button" className={on ? "is-on" : ""} onClick={() => onChange(on ? [...chosen].filter((x) => x !== key) : [...chosen, key])}>
              {labelOf(key)}
            </button>
          );
        })}
      </div>
    );
  } else if (schema.type === "boolean") {
    input = (
      <label className="gx-switch">
        <input id={id} type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} />
        <span>{value ? "Yes" : "No"}</span>
      </label>
    );
  } else if (schema.type === "integer" || schema.type === "number") {
    input = (
      <input
        id={id}
        type="number"
        value={value === undefined || value === null ? "" : String(value)}
        onChange={(e) => onChange(e.target.value === "" ? undefined : Number(e.target.value))}
      />
    );
  } else if (schema.type === "string" && (schema.format === "date" || schema.format === "date-time")) {
    // Dates read as dates. Changing one is rare (backdating, fixing a mistake), so it's a
    // second step; the time of day and time zone already there are kept.
    const text = String(value ?? "");
    input = changingDate ? (
      <input
        id={id}
        type="date"
        autoFocus
        value={text.slice(0, 10)}
        onBlur={() => setChangingDate(false)}
        onChange={(e) => e.target.value && onChange(schema.format === "date" ? e.target.value : e.target.value + (text.slice(10) || "T09:00:00.000Z"))}
      />
    ) : (
      <div className="gx-date">
        <span>{text ? formatDate(text) : "Not set"}</span>
        <button type="button" className="gx-link-button" onClick={() => setChangingDate(true)}>
          Change
        </button>
      </div>
    );
  } else if (schema.type === "object" && schema.properties) {
    const obj = (value && typeof value === "object" ? value : null) as Record<string, unknown> | null;
    if (!obj && (nullable(raw) || !required)) {
      input = (
        <button type="button" className="gx-button" onClick={() => onChange({})}>
          + Add {labelOf(name).toLowerCase()}
        </button>
      );
    } else {
      input = (
        <div className="gx-fieldset">
          {Object.entries(schema.properties).map(([key, sub]) => (
            <Field
              key={key}
              name={key}
              path={`${path}.${key}`}
              schema={sub}
              value={obj?.[key]}
              required={(schema.required ?? []).includes(key)}
              component={component}
              context={context}
              onChange={(v) => {
                const next = { ...(obj ?? {}), [key]: v };
                if (v === undefined) delete next[key];
                onChange(next);
              }}
            />
          ))}
          {nullable(raw) || !required ? (
            <button type="button" className="gx-link-button" onClick={() => onChange(nullable(raw) ? null : undefined)}>
              Remove {labelOf(name).toLowerCase()}
            </button>
          ) : null}
        </div>
      );
    }
  } else if (schema.type === "array" && items?.type === "object" && items.properties) {
    const list = Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
    input = (
      <div className="gx-rows">
        {list.map((row, i) => (
          <div key={i} className="gx-fieldset">
            {Object.entries(items.properties!)
              .filter(([key]) => plain(items.properties![key]).type !== "object")
              .map(([key, sub]) => (
                <Field
                  key={key}
                  name={key}
                  path={`${path}.${key}`}
                  schema={sub}
                  value={row[key]}
                  required={(items.required ?? []).includes(key)}
                  component={component}
                  context={context}
                  onChange={(v) => onChange(list.map((r, j) => (j === i ? { ...r, [key]: v } : r)))}
                />
              ))}
            <button type="button" className="gx-link-button" onClick={() => onChange(list.filter((_, j) => j !== i))}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" className="gx-button" onClick={() => onChange([...list, {}])}>
          + Add {labelOf(name).replace(/s$/, "").toLowerCase()}
        </button>
      </div>
    );
  } else if (schema.type === "array" || schema.type === "object") {
    input = (
      <textarea
        id={id}
        rows={3}
        className="gx-code"
        defaultValue={value === undefined || value === null ? "" : JSON.stringify(value, null, 1)}
        onBlur={(e) => {
          try {
            onChange(e.target.value.trim() ? JSON.parse(e.target.value) : undefined);
          } catch {
            // leave it for the person to fix
          }
        }}
      />
    );
  } else if (component === "YouTube" && name === "id") {
    input = <input id={id} type="text" placeholder="Paste a YouTube link" value={String(value ?? "")} onChange={(e) => onChange(youTube(e.target.value))} />;
  } else if (LONG.test(name)) {
    input = (
      <AutoText id={id} value={String(value ?? "")} placeholder={context.placeholders?.[path]} onChange={(v) => onChange(v || undefined)} />
    );
  } else {
    input = (
      <input
        id={id}
        type="text"
        value={String(value ?? "")}
        placeholder={context.placeholders?.[path]}
        onChange={(e) => onChange(e.target.value || undefined)}
      />
    );
  }

  const nested = schema.type === "object" || (schema.type === "array" && items?.type === "object");
  return (
    <div className={`gx-field${nested ? " gx-field-group" : ""}`}>
      <label htmlFor={id}>
        {schema.title ?? labelOf(name, component)}
        {required || schema.type === "boolean" ? "" : <span className="gx-optional"> optional</span>}
      </label>
      {input}
      {schema.description && !nested ? <span className="gx-hint">{schema.description}</span> : null}
    </div>
  );
}

/** A text box that grows with its text. */
function AutoText({ id, value, placeholder, onChange }: { id: string; value: string; placeholder?: string; onChange(v: string): void }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight + 2}px`;
  }, [value, placeholder]);
  return <textarea ref={ref} id={id} rows={2} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />;
}
