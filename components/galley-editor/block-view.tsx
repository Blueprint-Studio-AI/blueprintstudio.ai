"use client";

import { NodeViewWrapper, type ReactNodeViewProps } from "@tiptap/react";
import { useEffect, useState } from "react";
import { ImageChooser } from "./chooser";
import { OptionsStrip } from "./options";
import { PropsForm } from "./props-form";
import { useServices } from "./services";
import type { BlockAttrs, LibraryAsset, ManifestComponent } from "./types";

// How components look in edit mode: rendered by the site itself (a server action runs
// the site's real component), with a small bar to change them. An image block is where
// its picture is chosen: the library, new generated options, or an upload, in place.

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
 * The animation setting for a block. With one motion component it's an on/off button
 * ("✦ Reveal"); with several, a short list. Nothing shows if the site has none.
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
    const name = options[0].name;
    return (
      <button type="button" className={motion?.name === name ? "is-on" : ""} title={`Animate in as the reader scrolls (${name})`} onClick={() => set(motion?.name === name ? null : name)}>
        ✦ {name}
      </button>
    );
  }
  return (
    <span style={{ position: "relative" }}>
      <button type="button" className={motion ? "is-on" : ""} onClick={() => setOpen((o) => !o)}>
        ✦ {motion?.name ?? "Animate"}
      </button>
      {open ? (
        <span className="gx-motion-pop gx-menu-list">
          <button type="button" className={!motion ? "is-on" : ""} onClick={() => set(null)}>
            No animation
          </button>
          {options.map((c) => (
            <button key={c.name} type="button" className={motion?.name === c.name ? "is-on" : ""} onClick={() => set(c.name)}>
              {c.name}
            </button>
          ))}
        </span>
      ) : null}
    </span>
  );
}

/** A component's name as people read it: "LinkCard" → "Link card"; "YouTube" stays. */
export const nameOf = (name: string) =>
  ({ YouTube: "YouTube", LinkCard: "Link card", Tweet: "Post from X", CountUp: "Count up" })[name] ??
  name.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/ (\w)/g, (_, c: string) => ` ${c.toLowerCase()}`);

export type BlockUi = "edit" | "replace" | "options" | null;

export function BlockView({ node, deleteNode, updateAttributes, selected, getPos }: ReactNodeViewProps) {
  const services = useServices();
  const attrs = node.attrs as BlockAttrs;
  const ui = (node.attrs.ui as BlockUi) ?? null;
  const motion = node.attrs.motion as Motion;
  const component = services.components.find((c) => c.name === attrs.name);
  const isPicker = component?.picker === "image";
  const src = (attrs.props as { src?: string })?.src;
  // An option being tried in place: shown as the site's own image, not saved until kept.
  const [previewing, setPreviewing] = useState<LibraryAsset | null>(null);
  const shown = previewing
    ? { ...attrs, props: { ...attrs.props, src: previewing.thumbnail, width: previewing.width, height: previewing.height } }
    : attrs;
  const preview = usePreview(shown, isPicker && !src && !previewing);
  const pos = () => (typeof getPos === "function" ? getPos() : undefined);
  const setUi = (next: BlockUi) => {
    const at = pos();
    if (at !== undefined) services.setUi(at, next);
  };
  const choosing = isPicker && ((!src && ui !== "options") || ui === "replace");
  const showPreview = !isPicker || Boolean(src) || Boolean(previewing);

  return (
    <NodeViewWrapper
      className={`gx-block${selected ? " is-selected" : ""}${ui ? " is-editing" : ""}${isPicker && !src && !previewing ? " is-choosing" : ""}`}
      data-motion={motion?.name}
    >
      {showPreview ? (
        <div className="gx-block-preview" contentEditable={false}>
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
      ) : null}

      {choosing ? (
        <ImageChooser
          actions={services.actions}
          context={services.contextFor(pos() ?? null)}
          title={src ? "Replace image" : "Choose an image"}
          onPick={async (asset) => {
            const at = pos();
            if (at !== undefined) await services.chooseImage(at, asset);
          }}
          onUploaded={(file) => {
            const at = pos();
            if (at !== undefined) services.setImage(at, file);
          }}
          onGenerate={() => setUi("options")}
          onClose={() => (src ? setUi(null) : deleteNode())}
        />
      ) : null}

      {ui === "options" && isPicker ? (
        <OptionsStrip
          actions={services.actions}
          context={services.contextFor(pos() ?? null)}
          current={src ? { thumbnail: src } : null}
          previewing={previewing}
          onPreview={setPreviewing}
          onKeep={async (asset) => {
            setPreviewing(null);
            const at = pos();
            if (at !== undefined) await services.chooseImage(at, asset);
          }}
          onClose={() => {
            setPreviewing(null);
            setUi(src ? null : "replace");
          }}
        />
      ) : null}

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
        <pre className="gx-raw-source" contentEditable={false}>
          {String(node.attrs.mdx)}
        </pre>
      )}
    </NodeViewWrapper>
  );
}
