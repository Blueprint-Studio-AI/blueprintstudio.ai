"use client";

import { useEffect, useRef, useState } from "react";
import type { Node as PMNode } from "@tiptap/pm/model";
import { nameOf, type Motion } from "./block-view";
import { Field, type FieldContext } from "./fields";
import { hintOf } from "./insert-menu";
import type { JsonSchema, ManifestComponent } from "./types";

// A selected block's panel, beside the post: everything about it in one place. A picture
// shows the picture (Replace opens the library, new ones and upload), its alt text and its
// caption; another component shows its settings; any block can animate in, and be
// duplicated or deleted. Changes show in the post as they're made.

export type BlockChange = { props?: Record<string, unknown>; body?: string | null; mdx?: string };

export function BlockPanel({
  node,
  components,
  context,
  onChange,
  onMotion,
  onReplace,
  onDuplicate,
  onDelete,
}: {
  node: PMNode;
  components: ManifestComponent[];
  context: FieldContext;
  onChange(change: BlockChange): void;
  onMotion(motion: Motion): void;
  onReplace(): void;
  onDuplicate(): void;
  onDelete(): void;
}) {
  const raw = node.type.name === "rawBlock";
  const component = raw ? undefined : components.find((c) => c.name === node.attrs.name);
  const isPicker = component?.picker === "image";
  const [props, setProps] = useState<Record<string, unknown>>((node.attrs.props as Record<string, unknown>) ?? {});
  const [body, setBody] = useState<string>(String(node.attrs.body ?? ""));
  const [mdx, setMdx] = useState<string>(String(node.attrs.mdx ?? ""));
  const motion = (node.attrs.motion as Motion) ?? null;
  const motions = components.filter((c) => c.motion === "block");
  const src = (node.attrs.props as { src?: string })?.src;

  // Typing shows in the post shortly after, not on every key.
  const pending = useRef<BlockChange | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const changeRef = useRef(onChange);
  useEffect(() => {
    changeRef.current = onChange;
  }, [onChange]);
  const queue = (change: BlockChange) => {
    pending.current = { ...pending.current, ...change };
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      if (pending.current) changeRef.current(pending.current);
      pending.current = null;
    }, 350);
  };
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
      if (pending.current) changeRef.current(pending.current);
    },
    [],
  );

  // A picture chosen in the library comes in from outside: show it here too.
  const [lastSrc, setLastSrc] = useState(src);
  if (src !== lastSrc) {
    setLastSrc(src);
    setProps((node.attrs.props as Record<string, unknown>) ?? {});
  }

  const hidden = isPicker ? ["src", "width", "height"] : [];
  const properties = Object.entries(component?.props.properties ?? {}).filter(([name]) => !hidden.includes(name));
  const required = new Set(component?.props.required ?? []);
  const motionSchema: JsonSchema | null = !motions.length
    ? null
    : motions.length === 1
      ? { type: "boolean", title: "Animate in", description: motions[0].description }
      : { enum: ["None", ...motions.map((m) => m.name)], title: "Animation" };

  return (
    <>
      <div className="gx-details" onKeyDown={(e) => e.stopPropagation()}>
        {component && !isPicker ? <p className="gx-panel-help">{hintOf(component)}.</p> : null}
        {raw ? <p className="gx-panel-help">Markdown and MDX the editor shows as source: a table, footnotes or a Markdown picture. It&apos;s kept exactly as written.</p> : null}

        {isPicker ? (
          <div className="gx-field">
            <label>Picture</label>
            <div className="gx-pic">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {src ? <img src={src} alt="" /> : <span className="gx-pic-empty">No picture yet</span>}
              <button type="button" className="gx-button" onClick={onReplace}>
                {src ? "Replace" : "Choose a picture"}
              </button>
            </div>
          </div>
        ) : null}

        {properties.map(([name, schema]) => (
          <Field
            key={name}
            name={name}
            schema={schema}
            value={props[name]}
            required={required.has(name)}
            component={component?.name}
            context={context}
            onChange={(value) => {
              // A pasted YouTube link fills in the ID, and the start time if it has one.
              const next =
                value && typeof value === "object" && !Array.isArray(value) && "id" in (value as object) && component?.name === "YouTube" && name === "id"
                  ? { ...props, ...(value as object) }
                  : { ...props, [name]: value };
              setProps(next);
              queue({ props: Object.fromEntries(Object.entries(next).filter(([, v]) => v !== "" && v !== undefined && v !== null)) });
            }}
          />
        ))}

        {component && component.children !== "none" ? (
          <Field
            name={component.children === "inline" ? "caption" : "text"}
            schema={{ type: "string", description: component.children === "inline" ? "Optional. Links and *emphasis* work." : "Paragraphs and lists, in Markdown." }}
            value={body}
            required={false}
            onChange={(value) => {
              const text = String(value ?? "");
              setBody(text);
              queue({ body: text.trim() || null });
            }}
          />
        ) : null}

        {raw ? (
          <div className="gx-field">
            <label htmlFor="gx-raw-source">Source</label>
            <textarea
              id="gx-raw-source"
              className="gx-code"
              rows={10}
              value={mdx}
              onChange={(e) => {
                setMdx(e.target.value);
                queue({ mdx: e.target.value });
              }}
            />
          </div>
        ) : null}

        {motionSchema ? (
          <Field
            name="motion"
            schema={motionSchema}
            value={motions.length === 1 ? motion?.name === motions[0].name : (motion?.name ?? "None")}
            required
            onChange={(value) => {
              const name = motions.length === 1 ? (value ? motions[0].name : null) : value === "None" ? null : String(value);
              onMotion(name ? { name, props: {}, group: crypto.randomUUID() } : null);
            }}
          />
        ) : null}
      </div>
      <footer className="gx-panel-foot">
        <button type="button" className="gx-button" onClick={onDuplicate}>
          Duplicate
        </button>
        <button type="button" className="gx-button gx-danger-button" onClick={onDelete}>
          Delete {raw ? "block" : nameOf(String(node.attrs.name)).toLowerCase()}
        </button>
      </footer>
    </>
  );
}
