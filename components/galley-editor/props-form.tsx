"use client";

import { useState } from "react";
import { Field } from "./fields";
import type { ManifestComponent } from "./types";

// A component's props as a form, from its JSON Schema in the site's manifest.

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
