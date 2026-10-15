"use client";

import { NodeViewWrapper, type ReactNodeViewProps } from "@tiptap/react";
import { useEffect, useRef, useState } from "react";
import { PropsForm } from "./props-form";
import { useServices } from "./services";
import type { BlockAttrs, ManifestComponent } from "./types";

// How components look in edit mode: rendered by the site itself (a server action runs
// the site's real component). The toolbar over a selected block changes it; an image
// block's picture is chosen in the panel beside the post, and tried here until it's kept.

const rendered = new Map<string, { node?: React.ReactNode; error?: string }>();

function usePreview(attrs: BlockAttrs, skip: boolean) {
  const { actions } = useServices();
  const key = JSON.stringify([attrs.name, attrs.props, attrs.body]);
  const [fetched, setFetched] = useState<{ key: string; result: { node?: React.ReactNode; error?: string } } | null>(null);
  useEffect(() => {
    if (skip || rendered.has(key)) return;
    let live = true;
    actions
      .renderBlock(JSON.parse(JSON.stringify({ name: attrs.name, props: attrs.props, body: attrs.body })))
      .catch((e: Error) => ({ error: e.message }))
      .then((result) => {
        rendered.set(key, result);
        if (live) setFetched({ key, result });
      });
    return () => {
      live = false;
    };
  }, [key, skip, actions, attrs.name, attrs.props, attrs.body]);
  return rendered.get(key) ?? (fetched?.key === key ? fetched.result : undefined);
}

export type Motion = { name: string; props: Record<string, unknown>; group: string } | null;

/**
 * The animation setting for a block: "Animate in" plays as the reader scrolls to it. With
 * one motion component it's an on/off button; with several, a short list. Turning one on
 * plays it once on the block, so you see what it does. Nothing shows if the site has none.
 */
export function MotionToggle({
  motion,
  options,
  onChange,
}: {
  motion: Motion;
  options: ManifestComponent[];
  onChange(motion: Motion): void;
}) {
  const [open, setOpen] = useState(false);
  if (!options.length) return null;
  const set = (name: string | null) => {
    onChange(name ? { name, props: {}, group: crypto.randomUUID() } : null);
    setOpen(false);
  };
  if (options.length === 1) {
    const only = options[0];
    const on = motion?.name === only.name;
    return (
      <button type="button" className={on ? "is-on" : ""} title={`${only.description.split(". ")[0].replace(/\.$/, "")}. Click to ${on ? "turn it off" : "see it"}.`} onClick={() => set(on ? null : only.name)}>
        ✦ Animate in
      </button>
    );
  }
  return (
    <span style={{ position: "relative" }}>
      <button type="button" className={motion ? "is-on" : ""} onClick={() => setOpen((o) => !o)}>
        ✦ {motion ? motion.name : "Animate in"} ▾
      </button>
      {open ? (
        <span className="gx-motion-pop gx-menu-list">
          <button type="button" className={!motion ? "is-on" : ""} onClick={() => set(null)}>
            No animation
          </button>
          {options.map((c) => (
            <button key={c.name} type="button" className={motion?.name === c.name ? "is-on" : ""} title={c.description} onClick={() => set(c.name)}>
              {c.name}
            </button>
          ))}
        </span>
      ) : null}
    </span>
  );
}

/** Play a block's animation once (edit mode doesn't run the site's motion), so its effect is seen. */
export function playMotion(dom: Element | null) {
  if (!(dom instanceof HTMLElement)) return;
  dom.classList.remove("gx-motion-play");
  void dom.offsetWidth;
  dom.classList.add("gx-motion-play");
  setTimeout(() => dom.classList.remove("gx-motion-play"), 1000);
}

/** A component's name as people read it: "LinkCard" → "Link card"; "YouTube" stays. */
export const nameOf = (name: string) =>
  ({ YouTube: "YouTube", LinkCard: "Link card", Tweet: "Post from X", CountUp: "Count up" })[name] ??
  name.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/ (\w)/g, (_, c: string) => ` ${c.toLowerCase()}`);

export type BlockUi = "edit" | "replace" | null;

export function BlockView({ node, updateAttributes, selected, getPos }: ReactNodeViewProps) {
  const services = useServices();
  const attrs = node.attrs as BlockAttrs;
  const ui = (node.attrs.ui as BlockUi) ?? null;
  const motion = node.attrs.motion as Motion;
  const component = services.components.find((c) => c.name === attrs.name);
  const isPicker = component?.picker === "image";
  const src = (attrs.props as { src?: string })?.src;
  const picking = isPicker && ui === "replace";
  // A picture being tried from the panel shows as the site's own image, not saved until kept.
  const trying = picking ? services.trying : null;
  // Its thumbnail shows at once (the panel has loaded it); the full picture replaces it
  // once the browser has it.
  const [sharp, setSharp] = useState<{ id: string; src: string } | null>(null);
  useEffect(() => {
    if (!trying?.url || trying.url === trying.thumbnail) return;
    const img = new Image();
    img.onload = () => setSharp({ id: trying.id, src: trying.url });
    img.src = trying.url;
    return () => {
      img.onload = null;
    };
  }, [trying]);
  const shown = trying
    ? { ...attrs, props: { ...attrs.props, src: sharp?.id === trying.id ? sharp.src : trying.thumbnail, width: trying.width, height: trying.height } }
    : attrs;
  const empty = isPicker && !src && !trying;
  const fresh = usePreview(shown, empty);
  // While a new version renders, the last one stays, so the page doesn't jump.
  const [last, setLast] = useState(fresh);
  if (fresh !== undefined && fresh !== last) setLast(fresh);
  const preview = fresh ?? last;
  // A new picture shows at once: until the site's render of it arrives, the last render
  // gets the new address.
  const previewRef = useRef<HTMLDivElement>(null);
  const shownProps = shown.props as { src?: string; width?: number; height?: number };
  useEffect(() => {
    if (!isPicker || fresh !== undefined || !shownProps.src) return;
    const img = previewRef.current?.querySelector("img");
    if (!img || img.getAttribute("src") === shownProps.src) return;
    img.removeAttribute("srcset");
    img.src = shownProps.src;
    if (shownProps.width && shownProps.height) {
      img.setAttribute("width", String(shownProps.width));
      img.setAttribute("height", String(shownProps.height));
    }
  }, [isPicker, fresh, shownProps.src, shownProps.width, shownProps.height]);
  const setUi = (next: BlockUi) => {
    const at = typeof getPos === "function" ? getPos() : undefined;
    if (at !== undefined) services.setUi(at, next);
  };

  return (
    <NodeViewWrapper
      className={`gx-block${selected ? " is-selected" : ""}${ui ? " is-editing" : ""}${picking ? " is-picking" : ""}`}
      data-motion={motion?.name}
    >
      {empty ? (
        <button type="button" className="gx-block-empty" contentEditable={false} onClick={() => setUi("replace")}>
          {picking ? "Pick a picture in the panel" : "Choose a picture"}
        </button>
      ) : (
        // Grab a component anywhere to move it (a text block moves by its handle).
        <div ref={previewRef} className="gx-block-preview" contentEditable={false} data-drag-handle draggable={ui !== "edit" ? true : undefined}>
          {preview === undefined ? (
            <div className="gx-skeleton" />
          ) : preview.error ? (
            <div className="gx-block-error">
              {nameOf(attrs.name)} can&apos;t show yet: {preview.error}
            </div>
          ) : (
            preview.node
          )}
        </div>
      )}

      {ui === "edit" && component ? (
        <div contentEditable={false}>
          <PropsForm
            component={component}
            props={attrs.props}
            body={attrs.body}
            error={preview?.error}
            hide={isPicker ? ["src", "width", "height"] : []}
            onApply={(props, body) => {
              updateAttributes({ props: { ...attrs.props, ...props }, body, ui: null, isNew: null });
            }}
            onCancel={() => setUi(null)}
          />
        </div>
      ) : null}
      {ui === "edit" && !component ? (
        <p className="gx-block-error" contentEditable={false}>
          {attrs.name} isn&apos;t one of this site&apos;s components any more.
        </p>
      ) : null}
    </NodeViewWrapper>
  );
}

const formatNumber = (n: unknown) => (typeof n === "number" ? n.toLocaleString("en-US") : String(n ?? ""));

export function InlineView({ node, updateAttributes, selected }: ReactNodeViewProps) {
  const services = useServices();
  const attrs = node.attrs as BlockAttrs;
  const component = services.components.find((c) => c.name === attrs.name);
  const [editing, setEditing] = useState(false);
  const props = attrs.props ?? {};
  const label =
    component?.motion === "number"
      ? `${String(props.prefix ?? "")}${formatNumber(props.to)}${String(props.suffix ?? "")}`
      : `${nameOf(attrs.name)} ${Object.values(props)
          .map((v) => (typeof v === "string" ? v : JSON.stringify(v)))
          .join(" · ")}`;
  return (
    <NodeViewWrapper as="span" className={`gx-inline${selected ? " is-selected" : ""}`}>
      <button
        type="button"
        className={`gx-inline-chip${component?.motion ? " is-motion" : ""}`}
        contentEditable={false}
        title={component?.motion === "number" ? "Counts up from zero as the reader scrolls to it. Click to change." : nameOf(attrs.name)}
        onClick={() => setEditing((e) => !e)}
      >
        {label}
      </button>
      {editing && component ? (
        <span className="gx-inline-popover" contentEditable={false}>
          <PropsForm
            component={component}
            props={attrs.props}
            body={attrs.body}
            onApply={(next, body) => {
              updateAttributes({ props: next, body });
              setEditing(false);
            }}
            onCancel={() => setEditing(false)}
          />
        </span>
      ) : null}
    </NodeViewWrapper>
  );
}

export function RawView({ node, updateAttributes, selected }: ReactNodeViewProps) {
  const ui = (node.attrs.ui as BlockUi) ?? null;
  const [text, setText] = useState(String(node.attrs.mdx ?? ""));
  return (
    <NodeViewWrapper className={`gx-block gx-raw${selected ? " is-selected" : ""}${ui ? " is-editing" : ""}`}>
      {ui === "edit" ? (
        <div contentEditable={false} className="gx-form">
          <textarea rows={6} value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.stopPropagation()} />
          <div className="gx-form-actions">
            <button type="button" className="gx-button" onClick={() => updateAttributes({ ui: null })}>
              Cancel
            </button>
            <button type="button" className="gx-button gx-primary" onClick={() => updateAttributes({ mdx: text, ui: null })}>
              Done
            </button>
          </div>
        </div>
      ) : (
        <pre className="gx-raw-source" contentEditable={false} data-drag-handle draggable>
          {String(node.attrs.mdx)}
        </pre>
      )}
    </NodeViewWrapper>
  );
}
