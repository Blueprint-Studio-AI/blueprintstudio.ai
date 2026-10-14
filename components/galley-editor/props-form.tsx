"use client";

import { useState } from "react";
import type { JsonSchema, ManifestComponent } from "./types";

// A form for a component's props, made from its JSON Schema in the site's manifest.

const plain = (schema: JsonSchema): JsonSchema =>
  schema.anyOf ? (schema.anyOf.find((s) => s.type !== "null") ?? schema) : schema;

const label = (name: string) => name.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (c) => c.toUpperCase());

export function PropsForm({
  component,
  props,
  body,
  error,
  onApply,
  onCancel,
  onPickImage,
}: {
  component: ManifestComponent;
  props: Record<string, unknown>;
  body: string | null;
  error?: string;
  onApply(props: Record<string, unknown>, body: string | null): void;
  onCancel(): void;
  onPickImage?: () => void;
}) {
  const [values, setValues] = useState<Record<string, unknown>>(props);
  const [text, setText] = useState(body ?? "");
  const properties = component.props.properties ?? {};
  const required = new Set(component.props.required ?? []);

  const set = (name: string, value: unknown) => setValues((v) => ({ ...v, [name]: value }));

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
      <p className="gx-form-help">{component.description}</p>
      {Object.entries(properties).map(([name, raw]) => {
        const schema = plain(raw);
        const value = values[name];
        const id = `gx-${component.name}-${name}`;
        const hint = schema.description;
        let field: React.ReactNode;
        if (schema.enum) {
          field = (
            <select id={id} value={value === undefined ? "" : String(value)} onChange={(e) => set(name, e.target.value || undefined)}>
              {!required.has(name) && <option value="">—</option>}
              {schema.enum.map((option) => (
                <option key={String(option)} value={String(option)}>
                  {String(option)}
                </option>
              ))}
            </select>
          );
        } else if (schema.type === "boolean") {
          field = <input id={id} type="checkbox" checked={Boolean(value)} onChange={(e) => set(name, e.target.checked)} />;
        } else if (schema.type === "integer" || schema.type === "number") {
          field = (
            <input
              id={id}
              type="number"
              value={value === undefined ? "" : String(value)}
              onChange={(e) => set(name, e.target.value === "" ? undefined : Number(e.target.value))}
            />
          );
        } else if (schema.type === "array" || schema.type === "object") {
          field = (
            <textarea
              id={id}
              rows={3}
              defaultValue={value === undefined ? "" : JSON.stringify(value)}
              onChange={(e) => {
                try {
                  set(name, e.target.value ? JSON.parse(e.target.value) : undefined);
                } catch {
                  // keep typing
                }
              }}
            />
          );
        } else {
          field = (
            <input id={id} type="text" value={value === undefined ? "" : String(value)} onChange={(e) => set(name, e.target.value)} />
          );
        }
        return (
          <div key={name} className="gx-field">
            <label htmlFor={id}>
              {label(name)}
              {required.has(name) ? "" : <span className="gx-optional"> optional</span>}
              {name === "src" && onPickImage ? (
                <button type="button" className="gx-link-button" onClick={onPickImage}>
                  Choose from library
                </button>
              ) : null}
            </label>
            {field}
            {hint ? <span className="gx-hint">{hint}</span> : null}
          </div>
        );
      })}
      {component.children !== "none" ? (
        <div className="gx-field">
          <label htmlFor={`gx-${component.name}-body`}>{component.children === "inline" ? "Caption" : "Content"}</label>
          <textarea
            id={`gx-${component.name}-body`}
            rows={component.children === "inline" ? 2 : 4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={component.children === "inline" ? "Markdown on one line" : "Markdown: paragraphs, lists"}
          />
        </div>
      ) : null}
      {error ? <p className="gx-form-error">{error}</p> : null}
      <div className="gx-form-actions">
        <button type="button" className="gx-button" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="gx-button gx-primary">
          Apply
        </button>
      </div>
    </form>
  );
}
