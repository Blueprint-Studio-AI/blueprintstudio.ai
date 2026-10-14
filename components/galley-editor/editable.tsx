"use client";

import { DragHandle } from "@tiptap/extension-drag-handle-react";
import type { Node as PMNode } from "@tiptap/pm/model";
import { EditorContent, useEditorState, type Editor as TiptapEditor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MotionSelect, type Motion } from "./block-view";
import { ImageChooser } from "./chooser";
import { InsertMenu } from "./insert-menu";
import { useServices } from "./services";
import { useEditSession, type ImageShape } from "./session";
import type { ManifestComponent } from "./types";

// The editable pieces a site puts into its own post layout, in place of the static
// title, cover and body. They take the site's classes, so edit mode looks like the post.

const NUMBER = /^([$€£]?)(\d[\d,]*(?:\.\d+)?)(\s?(?:%|\+|x|×|[kKmMbB]n?))?$/;

/** The post body. `className` is the site's prose class (the one its post body uses). */
export function EditableBody({ className = "" }: { className?: string }) {
  const { editor, components, setProseClass, startComment, insertAt, openInsert } = useEditSession();
  const [hovered, setHovered] = useState<{ node: PMNode; pos: number } | null>(null);
  const [menu, setMenu] = useState<{ node: PMNode; pos: number; left: number; top: number } | null>(null);
  const [linking, setLinking] = useState(false);
  const [href, setHref] = useState("");
  const numberMotion = components.find((c) => c.motion === "number");

  useEffect(() => {
    if (editor) setProseClass(className);
  }, [editor, className, setProseClass]);

  // What the selection bubble shows follows the selection.
  const selection = useEditorState({
    editor,
    selector: ({ editor: e }) =>
      e
        ? {
            bold: e.isActive("bold"),
            italic: e.isActive("italic"),
            link: e.isActive("link"),
            number: NUMBER.test(e.state.doc.textBetween(e.state.selection.from, e.state.selection.to).trim()),
          }
        : null,
  });

  const onNodeChange = useCallback(({ node, pos }: { node: PMNode | null; pos: number }) => {
    setHovered(node ? { node, pos } : null);
  }, []);

  if (!editor) return <div className={className}>Loading the editor…</div>;

  const selectedNumber = () => {
    const { from, to } = editor.state.selection;
    const text = editor.state.doc.textBetween(from, to).trim();
    return NUMBER.exec(text);
  };

  const countUp = () => {
    const match = selectedNumber();
    if (!match || !numberMotion) return;
    const [, prefix, digits, suffix] = match;
    const props: Record<string, unknown> = { to: Number(digits.replace(/,/g, "")) };
    if (prefix) props.prefix = prefix;
    if (suffix) props.suffix = suffix;
    editor.chain().focus().insertContent({ type: "galleyInline", attrs: { name: numberMotion.name, props, body: null } }).run();
  };

  return (
    <div className="gx-body">
      <DragHandle editor={editor} onNodeChange={onNodeChange}>
        <div className="gx-gutter">
          <button
            type="button"
            className="gx-gutter-add"
            title="Add a block below"
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => {
              if (!hovered) return;
              const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
              const empty = hovered.node.type.name === "paragraph" && hovered.node.content.size === 0;
              openInsert({ pos: empty ? hovered.pos : hovered.pos + hovered.node.nodeSize, replace: empty, left: r.right + 4, top: r.bottom + 4 });
            }}
          >
            +
          </button>
          <div
            className="gx-grip"
            title="Drag to move · click for options"
            onClick={(e) => {
              if (!hovered) return;
              const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
              setMenu({ ...hovered, left: r.right + 4, top: r.top });
            }}
          >
            ⠿
          </div>
        </div>
      </DragHandle>

      <BubbleMenu
        editor={editor}
        shouldShow={({ editor: e, from, to }) => from !== to && !e.isActive("galleyBlock") && !e.isActive("rawBlock")}
      >
        <div className="gx-bubble">
          {linking ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const chain = editor.chain().focus().extendMarkRange("link");
                if (href.trim()) chain.setLink({ href: href.trim() }).run();
                else chain.unsetLink().run();
                setLinking(false);
              }}
            >
              <input autoFocus value={href} placeholder="https://…" onChange={(e) => setHref(e.target.value)} />
            </form>
          ) : (
            <>
              <button type="button" className={selection?.bold ? "is-on" : ""} onClick={() => editor.chain().focus().toggleBold().run()}>
                <b>B</b>
              </button>
              <button type="button" className={selection?.italic ? "is-on" : ""} onClick={() => editor.chain().focus().toggleItalic().run()}>
                <i>I</i>
              </button>
              <button
                type="button"
                className={selection?.link ? "is-on" : ""}
                onClick={() => {
                  setHref(String(editor.getAttributes("link").href ?? ""));
                  setLinking(true);
                }}
              >
                Link
              </button>
              {numberMotion && selection?.number ? (
                <button type="button" title="Counts up from zero when it scrolls into view" onClick={countUp}>
                  ↑ Count up
                </button>
              ) : null}
              <span className="gx-bubble-sep" />
              <button type="button" onClick={startComment}>
                Comment
              </button>
            </>
          )}
        </div>
      </BubbleMenu>

      <EditorContent editor={editor} />

      {menu ? <BlockMenu editor={editor} at={menu} components={components} onClose={() => setMenu(null)} /> : null}
      {insertAt ? <InsertMenu editor={editor} at={insertAt} components={components} onClose={() => openInsert(null)} /> : null}
    </div>
  );
}

/** What you can do to a block: change its kind, animate it, copy or remove it. */
function BlockMenu({
  editor,
  at,
  components,
  onClose,
}: {
  editor: TiptapEditor;
  at: { node: PMNode; pos: number; left: number; top: number };
  components: ManifestComponent[];
  onClose(): void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [onClose]);

  const node = editor.state.doc.nodeAt(at.pos) ?? at.node;
  const motions = components.filter((c) => c.motion === "block");
  const textual = ["paragraph", "heading", "blockquote"].includes(node.type.name);
  const turnInto = (kind: "p" | "h2" | "h3" | "quote") => {
    const chain = editor.chain().focus().setTextSelection(at.pos + 1);
    if (kind === "p") chain.setParagraph().run();
    else if (kind === "quote") chain.setParagraph().toggleBlockquote().run();
    else chain.setHeading({ level: kind === "h2" ? 2 : 3 }).run();
    onClose();
  };
  const setMotion = (motion: Motion) => {
    editor.view.dispatch(editor.state.tr.setNodeAttribute(at.pos, "motion", motion));
    onClose();
  };

  return (
    <div className="gx-menu" ref={ref} style={{ left: at.left, top: Math.min(at.top, window.innerHeight - 320) }}>
      {textual ? (
        <>
          <p className="gx-insert-group">Turn into</p>
          <div className="gx-menu-row">
            <button type="button" onClick={() => turnInto("p")}>Text</button>
            <button type="button" onClick={() => turnInto("h2")}>Heading</button>
            <button type="button" onClick={() => turnInto("h3")}>Subheading</button>
            <button type="button" onClick={() => turnInto("quote")}>Quote</button>
          </div>
        </>
      ) : null}
      {motions.length ? (
        <>
          <p className="gx-insert-group">Animation</p>
          <MotionSelect motion={(node.attrs.motion as Motion) ?? null} options={motions} onChange={setMotion} />
        </>
      ) : null}
      <p className="gx-insert-group">Block</p>
      <div className="gx-menu-row">
        <button
          type="button"
          onClick={() => {
            editor.chain().focus().insertContentAt(at.pos + node.nodeSize, node.toJSON()).run();
            onClose();
          }}
        >
          Duplicate
        </button>
        <button
          type="button"
          className="gx-danger"
          onClick={() => {
            editor.chain().focus().deleteRange({ from: at.pos, to: at.pos + node.nodeSize }).run();
            onClose();
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

/** A front matter text field edited in place, inside the site's own heading or paragraph. */
export function EditableText({
  field,
  as: Tag = "span",
  className = "",
  placeholder,
}: {
  field: string;
  as?: "h1" | "h2" | "p" | "div" | "span";
  className?: string;
  placeholder?: string;
}) {
  const { frontmatter, setField } = useEditSession();
  const ref = useRef<HTMLElement>(null);
  const initial = useRef(String(frontmatter[field] ?? ""));
  useEffect(() => {
    if (ref.current) ref.current.textContent = initial.current;
  }, []);
  return (
    <Tag
      ref={ref as never}
      className={`gx-editable ${className}`}
      contentEditable="plaintext-only"
      suppressContentEditableWarning
      data-placeholder={placeholder}
      spellCheck
      onInput={(e) => setField(field, (e.currentTarget.textContent ?? "").replace(/\s+/g, " ").trim())}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          (e.currentTarget as HTMLElement).blur();
        }
      }}
    />
  );
}

/**
 * A front matter image (a cover or hero) in the site's own frame. Clicking Change opens
 * the same chooser as an image block. `shape` is how the site stores it: an object
 * ({ src, alt, width, height }) or just the path.
 */
export function EditableImage({
  field,
  shape = "image",
  label = "cover",
}: {
  field: string;
  shape?: ImageShape;
  label?: string;
}) {
  const { frontmatter, setField, contextFor, chooseFieldImage, uploadedFieldImage } = useEditSession();
  const { actions } = useServices();
  const [choosing, setChoosing] = useState(false);
  const value = frontmatter[field] as { src?: string; alt?: string } | string | null | undefined;
  const src = typeof value === "string" ? value : value?.src;
  const alt = typeof value === "object" && value ? (value.alt ?? "") : "";

  const dialog =
    choosing && typeof document !== "undefined"
      ? createPortal(
          <div className="gx-dialog" onMouseDown={(e) => e.target === e.currentTarget && setChoosing(false)} data-lenis-prevent>
            <div className="gx-dialog-card">
              <ImageChooser
                actions={actions}
                context={contextFor(null)}
                title={src ? `Change the ${label}` : `Choose a ${label}`}
                onPick={async (asset) => {
                  setChoosing(false);
                  await chooseFieldImage(field, shape, asset);
                }}
                onUploaded={(file) => {
                  uploadedFieldImage(field, shape, file);
                  setChoosing(false);
                }}
                onClose={() => setChoosing(false)}
              />
            </div>
          </div>,
          document.body,
        )
      : null;

  if (!src) {
    return (
      <div className="gx-image-empty">
        <button type="button" onClick={() => setChoosing(true)}>
          Add a {label}
        </button>
        {dialog}
      </div>
    );
  }
  return (
    <div className="gx-image">
      {/* eslint-disable-next-line @next/next/no-img-element -- the site's own image component returns once saved */}
      <img src={src} alt={alt} />
      <div className="gx-image-tools">
        <button type="button" onClick={() => setChoosing(true)}>
          Change {label}
        </button>
        <button type="button" onClick={() => setField(field, shape === "src" ? undefined : null)}>
          Remove
        </button>
      </div>
      {dialog}
    </div>
  );
}
