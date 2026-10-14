"use client";

import { NodeViewWrapper, type ReactNodeViewProps } from "@tiptap/react";
import { useEffect, useState } from "react";
import { ImageChooser } from "./chooser";
import { PropsForm } from "./props-form";
import { useServices } from "./services";
import type { BlockAttrs, ManifestComponent } from "./types";

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

/** The animation setting for a block: none, or one of the site's motion components. */
export function MotionSelect({
  motion,
  options,
  onChange,
}: {
  motion: Motion;
  options: ManifestComponent[];
  onChange(motion: Motion): void;
}) {
  if (!options.length) return null;
  return (
    <select
      className="gx-motion-select"
      value={motion?.name ?? ""}
      title="Animation"
      onChange={(e) => onChange(e.target.value ? { name: e.target.value, props: {}, group: crypto.randomUUID() } : null)}
    >
      <option value="">No animation</option>
      {options.map((c) => (
        <option key={c.name} value={c.name}>
          ✦ {c.name}
        </option>
      ))}
    </select>
  );
}

export function BlockView({ node, updateAttributes, deleteNode, selected, getPos }: ReactNodeViewProps) {
  const services = useServices();
  const attrs = node.attrs as BlockAttrs;
  const motion = node.attrs.motion as Motion;
  const component = services.components.find((c) => c.name === attrs.name);
  const motions = services.components.filter((c) => c.motion === "block");
  const isPicker = component?.picker === "image";
  const src = (attrs.props as { src?: string })?.src;
  const [choosing, setChoosing] = useState(isPicker && !src);
  const [editing, setEditing] = useState(!isPicker && Boolean(node.attrs.isNew));
  const preview = usePreview(attrs, isPicker && !src);
  const pos = () => (typeof getPos === "function" ? getPos() : undefined);

  const chooser = (
    <ImageChooser
      actions={services.actions}
      context={services.contextFor(pos() ?? null)}
      title={src ? "Change image" : "Choose an image"}
      onPick={async (asset) => {
        const at = pos();
        if (at === undefined) return;
        setChoosing(false);
        await services.chooseImage(at, asset);
      }}
      onUploaded={(file) => {
        const at = pos();
        if (at === undefined) return;
        services.setImage(at, file);
        setChoosing(false);
      }}
      onClose={() => (src ? setChoosing(false) : deleteNode())}
    />
  );

  return (
    <NodeViewWrapper className={`gx-block${selected ? " is-selected" : ""}${editing || choosing ? " is-editing" : ""}`}>
      <div className="gx-block-bar" contentEditable={false} data-drag-handle>
        <span className="gx-block-name">
          {attrs.name}
          {motion?.name ? <span className="gx-motion-chip">✦ {motion.name}</span> : null}
        </span>
        <span className="gx-block-tools">
          {isPicker ? (
            src ? (
              <>
                <button type="button" onClick={() => setChoosing((c) => !c)}>
                  {choosing ? "Close" : "Change image"}
                </button>
                <button type="button" onClick={() => setEditing((e) => !e)}>
                  Caption & alt
                </button>
              </>
            ) : null
          ) : (
            <button type="button" onClick={() => setEditing((e) => !e)}>
              {editing ? "Close" : "Edit"}
            </button>
          )}
          <MotionSelect motion={motion} options={motions} onChange={(m) => updateAttributes({ motion: m })} />
          <button type="button" className="gx-danger" onClick={() => deleteNode()}>
            Remove
          </button>
        </span>
      </div>

      {isPicker && !src ? (
        chooser
      ) : (
        <>
          <div className="gx-block-preview" contentEditable={false}>
            {preview === undefined ? (
              <div className="gx-skeleton" />
            ) : preview.error ? (
              <div className="gx-block-error">
                {attrs.name} can&apos;t show yet: {preview.error}
              </div>
            ) : (
              preview.node
            )}
          </div>
          {choosing ? chooser : null}
        </>
      )}

      {editing && component ? (
        <div contentEditable={false}>
          <PropsForm
            component={component}
            props={attrs.props}
            body={attrs.body}
            error={preview?.error}
            hide={isPicker ? ["src", "width", "height"] : []}
            onApply={(props, body) => {
              updateAttributes({ props: { ...attrs.props, ...props }, body, isNew: null });
              setEditing(false);
            }}
            onCancel={() => setEditing(false)}
          />
        </div>
      ) : null}
      {editing && !component ? (
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
      ? `↑ ${String(props.prefix ?? "")}${formatNumber(props.to)}${String(props.suffix ?? "")}`
      : `${attrs.name} ${Object.values(props)
          .map((v) => (typeof v === "string" ? v : JSON.stringify(v)))
          .join(" · ")}`;
  return (
    <NodeViewWrapper as="span" className={`gx-inline${selected ? " is-selected" : ""}`}>
      <button
        type="button"
        className={`gx-inline-chip${component?.motion ? " is-motion" : ""}`}
        contentEditable={false}
        title={component?.motion === "number" ? `${attrs.name}: counts up when it scrolls into view` : attrs.name}
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

export function RawView({ node, updateAttributes, selected, deleteNode }: ReactNodeViewProps) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(String(node.attrs.mdx ?? ""));
  return (
    <NodeViewWrapper className={`gx-block gx-raw${selected ? " is-selected" : ""}`}>
      <div className="gx-block-bar" contentEditable={false} data-drag-handle>
        <span className="gx-block-name">MDX</span>
        <span className="gx-block-tools">
          <button type="button" onClick={() => setEditing((e) => !e)}>
            {editing ? "Close" : "Edit"}
          </button>
          <button type="button" className="gx-danger" onClick={() => deleteNode()}>
            Remove
          </button>
        </span>
      </div>
      {editing ? (
        <div contentEditable={false} className="gx-form">
          <textarea rows={6} value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.stopPropagation()} />
          <div className="gx-form-actions">
            <button
              type="button"
              className="gx-button gx-primary"
              onClick={() => {
                updateAttributes({ mdx: text });
                setEditing(false);
              }}
            >
              Apply
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
