"use client";

import { useState } from "react";
import type { JsonSchema, ManifestComponent } from "./types";

// Forms made from JSON Schema: a component's props (from the site's manifest) and the
// post's details (its front matter). Labels read as words, not prop names.

const plain = (schema: JsonSchema): JsonSchema =>
  schema.anyOf ? (schema.anyOf.find((s) => s.type !== "null") ?? schema) : schema;

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
};

export const labelOf = (name: string, component?: string) =>
  LABELS[`${component}.${name}`] ??
  LABELS[name] ??
  name
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase())
    .replace(/ (\w)/g, (_, c: string) => ` ${c.toLowerCase()}`);

/** A YouTube link or ID → the ID, and the start time if the link has one. */
function youTube(value: string): { id: string; start?: number } {
  const v = value.trim();
  try {
    const url = new URL(v);
    const id =
      url.hostname.endsWith("youtu.be")
        ? url.pathname.slice(1)
        : (url.searchParams.get("v") ?? url.pathname.match(/\/(?:embed|shorts|live)\/([\w-]{6,})/)?.[1] ?? "");
    const t = url.searchParams.get("t") ?? url.searchParams.get("start");
    return { id, ...(t ? { start: Number.parseInt(t, 10) || undefined } : {}) };
  } catch {
    return { id: v };
  }
}

const LONG = /^(summary|description|excerpt|caption|body|quote|text)$/;

/** One field for one value of a schema: text, choices, chips, a date, a number, a switch or JSON. */
export function Field({
  name,
  schema: raw,
  value,
  required,
  component,
  onChange,
}: {
  name: string;
  schema: JsonSchema;
  value: unknown;
  required: boolean;
  component?: string;
  onChange(value: unknown): void;
}) {
  const schema = plain(raw);
  const id = `gx-${component ?? "post"}-${name}`;
  const items = schema.items ? plain(schema.items) : undefined;
  let input: React.ReactNode;

  if (schema.enum) {
    input = (
      <select id={id} value={value === undefined || value === null ? "" : String(value)} onChange={(e) => onChange(e.target.value || undefined)}>
        {!required && <option value="">None</option>}
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
            <button
              key={key}
              type="button"
              className={on ? "is-on" : ""}
              onClick={() => onChange(on ? [...chosen].filter((x) => x !== key) : [...chosen, key])}
            >
              {labelOf(key)}
            </button>
          );
        })}
      </div>
    );
  } else if (schema.type === "boolean") {
    input = <input id={id} type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} />;
  } else if (schema.type === "integer" || schema.type === "number") {
    input = (
      <input
        id={id}
        type="number"
        value={value === undefined || value === null ? "" : String(value)}
        onChange={(e) => onChange(e.target.value === "" ? undefined : Number(e.target.value))}
      />
    );
  } else if (schema.type === "string" && schema.format === "date") {
    input = <input id={id} type="date" value={String(value ?? "")} onChange={(e) => onChange(e.target.value || undefined)} />;
  } else if (schema.type === "string" && schema.format === "date-time") {
    // A date picker for the day; the time and time zone already there are kept.
    const text = String(value ?? "");
    input = (
      <input
        id={id}
        type="date"
        value={text.slice(0, 10)}
        onChange={(e) => e.target.value && onChange(e.target.value + (text.slice(10) || "T09:00:00.000Z"))}
      />
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
    input = (
      <input
        id={id}
        type="text"
        placeholder="Paste a YouTube link"
        value={String(value ?? "")}
        onChange={(e) => onChange(youTube(e.target.value))}
      />
    );
  } else if (LONG.test(name)) {
    input = <textarea id={id} rows={3} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />;
  } else {
    input = <input id={id} type="text" value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />;
  }

  return (
    <div className="gx-field">
      <label htmlFor={id}>
        {labelOf(name, component)}
        {required ? "" : <span className="gx-optional"> optional</span>}
      </label>
      {input}
      {schema.description ? <span className="gx-hint">{schema.description}</span> : null}
    </div>
  );
}

export function PropsForm({
  component,
  props,
  body,
  error,
  onApply,
  onCancel,
  hide = [],
}: {
  component: ManifestComponent;
  props: Record<string, unknown>;
  body: string | null;
  error?: string;
  onApply(props: Record<string, unknown>, body: string | null): void;
  onCancel(): void;
  /** Props the block sets another way, e.g. an image's src from the chooser. */
  hide?: string[];
}) {
  const [values, setValues] = useState<Record<string, unknown>>(props);
  const [text, setText] = useState(body ?? "");
  const properties = component.props.properties ?? {};
  const required = new Set(component.props.required ?? []);

  return (
    <form
      className="gx-form"
      onSubmit={(e) => {
        e.preventDefault();
        const clean = Object.fromEntries(Object.entries(values).filter(([, v]) => v !== "" && v !== undefined && v !== null));
        onApply(clean, component.children === "none" ? null : text.trim() || null);
      }}
      onKeyDown={(e) => e.stopPropagation()}
    >
      {Object.entries(properties)
        .filter(([name]) => !hide.includes(name))
        .map(([name, schema]) => (
          <Field
            key={name}
            name={name}
            schema={schema}
            value={values[name]}
            required={required.has(name)}
            component={component.name}
            onChange={(v) =>
              setValues((current) =>
                // A pasted YouTube link fills in the ID, and the start time if it has one.
                v && typeof v === "object" && !Array.isArray(v) && "id" in (v as object) && component.name === "YouTube" && name === "id"
                  ? { ...current, ...(v as object) }
                  : { ...current, [name]: v },
              )
            }
          />
        ))}
      {component.children !== "none" ? (
        <div className="gx-field">
          <label htmlFor={`gx-${component.name}-body`}>{component.children === "inline" ? "Caption" : "Text"}</label>
          <textarea
            id={`gx-${component.name}-body`}
            rows={component.children === "inline" ? 2 : 4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={component.children === "inline" ? "Optional. Links and *emphasis* work." : "Paragraphs and lists"}
          />
        </div>
      ) : null}
      {error ? <p className="gx-form-error">{error}</p> : null}
      <div className="gx-form-actions">
        <button type="button" className="gx-button" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="gx-button gx-primary">
          Done
        </button>
      </div>
    </form>
  );
}
