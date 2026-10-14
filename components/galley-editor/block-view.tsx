"use client";

import { NodeViewWrapper, type ReactNodeViewProps } from "@tiptap/react";
import { useEffect, useState } from "react";
import { PropsForm } from "./props-form";
import { useServices } from "./services";
import type { BlockAttrs } from "./types";

// How components look in the editor: rendered by the site itself (a server action runs
// the site's real component), with a bar to edit, replace, generate options or remove.

const rendered = new Map<string, { node?: React.ReactNode; error?: string }>();

function usePreview(attrs: BlockAttrs) {
  const { actions } = useServices();
  const key = JSON.stringify([attrs.name, attrs.props, attrs.body]);
  const [fetched, setFetched] = useState<{ key: string; result: { node?: React.ReactNode; error?: string } } | null>(null);
  useEffect(() => {
    if (rendered.has(key)) return;
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
  }, [key, actions, attrs.name, attrs.props, attrs.body]);
  return rendered.get(key) ?? (fetched?.key === key ? fetched.result : undefined);
}

export function BlockView({ node, updateAttributes, deleteNode, selected, getPos }: ReactNodeViewProps) {
  const services = useServices();
  const attrs = node.attrs as BlockAttrs;
  const component = services.components.find((c) => c.name === attrs.name);
  const preview = usePreview(attrs);
  const [editing, setEditing] = useState(Boolean(node.attrs.isNew));
  const isImage = attrs.name === "Image";
  const pos = () => (typeof getPos === "function" ? getPos() : undefined);

  return (
    <NodeViewWrapper className={`gx-block${selected ? " is-selected" : ""}${editing ? " is-editing" : ""}`}>
      <div className="gx-block-bar" contentEditable={false} data-drag-handle>
        <span className="gx-block-name">{attrs.name}</span>
        <span className="gx-block-tools">
          <button type="button" onClick={() => setEditing((e) => !e)}>
            {editing ? "Close" : "Edit"}
          </button>
          {isImage ? (
            <>
              <button type="button" onClick={() => pos() !== undefined && services.pickImage(pos()!)}>
                Replace
              </button>
              <button type="button" onClick={() => pos() !== undefined && services.generateFor(pos()!)}>
                ✦ Options
              </button>
            </>
          ) : null}
          <button type="button" className="gx-danger" onClick={() => deleteNode()}>
            Remove
          </button>
        </span>
      </div>
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
      {editing && component ? (
        <div contentEditable={false}>
          <PropsForm
            component={component}
            props={attrs.props}
            body={attrs.body}
            error={preview?.error}
            onApply={(props, body) => {
              updateAttributes({ props, body, isNew: null });
              setEditing(false);
            }}
            onCancel={() => setEditing(false)}
            onPickImage={isImage ? () => pos() !== undefined && services.pickImage(pos()!) : undefined}
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

export function InlineView({ node, updateAttributes, selected }: ReactNodeViewProps) {
  const services = useServices();
  const attrs = node.attrs as BlockAttrs;
  const component = services.components.find((c) => c.name === attrs.name);
  const [editing, setEditing] = useState(false);
  const summary = Object.values(attrs.props ?? {})
    .map((v) => (typeof v === "string" ? v : JSON.stringify(v)))
    .join(" · ");
  return (
    <NodeViewWrapper as="span" className={`gx-inline${selected ? " is-selected" : ""}`}>
      <button type="button" className="gx-inline-chip" contentEditable={false} onClick={() => setEditing((e) => !e)}>
        {attrs.name}
        {summary ? <span> {summary}</span> : null}
      </button>
      {editing && component ? (
        <span className="gx-inline-popover" contentEditable={false}>
          <PropsForm
            component={component}
            props={attrs.props}
            body={attrs.body}
            onApply={(props, body) => {
              updateAttributes({ props, body });
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
