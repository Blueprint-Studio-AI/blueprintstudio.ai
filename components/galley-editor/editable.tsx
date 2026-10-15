"use client";

import { DragHandle } from "@tiptap/extension-drag-handle-react";
import type { Node as PMNode } from "@tiptap/pm/model";
import { NodeSelection } from "@tiptap/pm/state";
import { EditorContent, type Editor as TiptapEditor } from "@tiptap/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { MotionToggle, nameOf, playMotion, type Motion } from "./block-view";
import { TermPicker } from "./fields";
import { InsertMenu } from "./insert-menu";
import { useServices } from "./services";
import { useFields } from "./fields-context";
import { useEditSession, type ImageShape } from "./session";
import type { ManifestComponent } from "./types";

// The editable pieces a site puts into its own post layout, in place of the static
// title, cover and body. They take the site's classes, so edit mode looks like the post.

const NUMBER = /^([$€£]?)(\d[\d,]*(?:\.\d+)?)(\s?(?:%|\+|x|×|[kKmMbB]n?))?$/;

/** The post body. `className` is the site's prose class (the one its post body uses). */
export function EditableBody({ className = "" }: { className?: string }) {
  const { editor, components, setProseClass, insertAt, openInsert } = useEditSession();
  const [hovered, setHovered] = useState<{ node: PMNode; pos: number } | null>(null);

  useEffect(() => {
    if (editor) setProseClass(className);
  }, [editor, className, setProseClass]);

  const onNodeChange = useCallback(({ node, pos }: { node: PMNode | null; pos: number }) => {
    setHovered(node ? { node, pos } : null);
  }, []);

  if (!editor) return <div className={className}>Loading the editor…</div>;

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
          {/* Components are dragged by grabbing them; text, which you select by dragging, moves by this. */}
          {hovered && !hovered.node.isAtom ? (
            <div
              className="gx-grip"
              title="Drag to move · click to select"
              onClick={() => editor.chain().focus().setNodeSelection(hovered.pos).run()}
            >
              ⠿
            </div>
          ) : null}
        </div>
      </DragHandle>

      <EditorContent editor={editor} />

      <ContextBar editor={editor} components={components} />
      {insertAt ? <InsertMenu editor={editor} at={insertAt} components={components} onClose={() => openInsert(null)} /> : null}
    </div>
  );
}

type Target = { kind: "text" | "component" | "raw" | "block"; block: number; node: PMNode };

/**
 * One toolbar for whatever is selected: some text, a block (click its grip) or a
 * component (click it). It sits above the selection and stays in view on tall blocks.
 */
function ContextBar({ editor, components }: { editor: TiptapEditor; components: ManifestComponent[] }) {
  const { startComment } = useEditSession();
  const services = useServices();
  const ref = useRef<HTMLDivElement>(null);
  const [target, setTarget] = useState<Target | null>(null);
  const [place, setPlace] = useState<{ top: number; left: number } | null>(null);
  const [menu, setMenu] = useState<"turn" | "link" | null>(null);
  const [href, setHref] = useState("");
  const motions = components.filter((c) => c.motion === "block");
  const numberMotion = components.find((c) => c.motion === "number");

  const measure = useCallback(() => {
    const { state, view } = editor;
    const sel = state.selection;
    let rect: { top: number; bottom: number; left: number; right: number } | null = null;
    let next: Target | null = null;
    if (sel instanceof NodeSelection && sel.$from.depth === 0) {
      const dom = view.nodeDOM(sel.from) as HTMLElement | null;
      if (dom) rect = dom.getBoundingClientRect();
      const kind = sel.node.type.name === "galleyBlock" ? "component" : sel.node.type.name === "rawBlock" ? "raw" : "block";
      next = { kind, block: sel.from, node: sel.node };
    } else if (!sel.empty && sel.$from.depth >= 1 && sel.$from.parent.isTextblock) {
      const a = view.coordsAtPos(sel.from);
      const b = view.coordsAtPos(sel.to);
      rect = { top: Math.min(a.top, b.top), bottom: Math.max(a.bottom, b.bottom), left: Math.min(a.left, b.left), right: Math.max(a.right, b.right) };
      const block = sel.$from.before(1);
      next = { kind: "text", block, node: state.doc.nodeAt(block)! };
    }
    if (!rect || !next || rect.bottom < 90 || rect.top > window.innerHeight - 40) {
      setTarget(null);
      setPlace(null);
      return;
    }
    const width = ref.current?.offsetWidth ?? 420;
    // Above the selection; on a tall block, pinned under the site's nav while it's on screen.
    const top = Math.min(Math.max(rect.top - 50, 92), Math.max(rect.bottom - 50, 92));
    const left = Math.min(Math.max(8, (rect.left + rect.right) / 2 - width / 2), window.innerWidth - width - 8);
    setTarget(next);
    setPlace({ top, left });
  }, [editor]);

  useEffect(() => {
    const update = () => requestAnimationFrame(measure);
    editor.on("selectionUpdate", update);
    editor.on("transaction", update);
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      editor.off("selectionUpdate", update);
      editor.off("transaction", update);
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [editor, measure]);

  const key = target ? `${target.kind}:${target.block}` : "";
  const [menuFor, setMenuFor] = useState(key);
  if (menuFor !== key) {
    setMenuFor(key);
    setMenu(null);
  }

  if (!target || !place) return null;
  const { node, block } = target;
  const component = node.type.name === "galleyBlock" ? components.find((c) => c.name === node.attrs.name) : undefined;
  const isPicker = component?.picker === "image";
  const textual = ["paragraph", "heading", "blockquote"].includes(node.type.name);
  const motion = (node.attrs.motion as Motion) ?? null;
  const setMotion = (m: Motion) => {
    editor.view.dispatch(editor.state.tr.setNodeAttribute(block, "motion", m));
    if (m) requestAnimationFrame(() => playMotion(editor.view.nodeDOM(block) as Element | null));
  };
  const selectedText = editor.state.doc.textBetween(editor.state.selection.from, editor.state.selection.to).trim();
  const number = target.kind === "text" && numberMotion ? NUMBER.exec(selectedText) : null;

  const turnInto = (kind: "p" | "h2" | "h3" | "quote") => {
    const chain = editor.chain().focus();
    if (target.kind !== "text") chain.setTextSelection(block + 1);
    if (kind === "p") chain.setParagraph().run();
    else if (kind === "quote") chain.setParagraph().toggleBlockquote().run();
    else chain.setHeading({ level: kind === "h2" ? 2 : 3 }).run();
    setMenu(null);
  };
  const kindLabel =
    node.type.name === "heading" ? (node.attrs.level === 2 ? "Heading" : "Subheading") : node.type.name === "blockquote" ? "Quote" : "Text";

  return (
    <div
      className="gx-ctx"
      ref={ref}
      style={{ top: place.top, left: place.left }}
      onMouseDown={(e) => {
        if (!(e.target instanceof HTMLInputElement)) e.preventDefault();
      }}
    >
      {menu === "link" ? (
        <form
          className="gx-ctx-link"
          onSubmit={(e) => {
            e.preventDefault();
            const chain = editor.chain().focus().extendMarkRange("link");
            if (href.trim()) chain.setLink({ href: href.trim() }).run();
            else chain.unsetLink().run();
            setMenu(null);
          }}
        >
          <input
            autoFocus
            value={href}
            placeholder="Paste a link, Enter to apply"
            onChange={(e) => setHref(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && setMenu(null)}
          />
        </form>
      ) : (
        <>
          {target.kind === "component" || target.kind === "raw" ? (
            <span className="gx-ctx-name">{target.kind === "raw" ? "MDX" : nameOf(String(node.attrs.name))}</span>
          ) : null}
          {textual ? (
            <span className="gx-ctx-turn">
              <button type="button" className={menu === "turn" ? "is-on" : ""} onClick={() => setMenu((m) => (m === "turn" ? null : "turn"))}>
                {kindLabel} ▾
              </button>
              {menu === "turn" ? (
                <span className="gx-motion-pop gx-menu-list">
                  {(
                    [
                      ["p", "Text"],
                      ["h2", "Heading"],
                      ["h3", "Subheading"],
                      ["quote", "Quote"],
                    ] as const
                  ).map(([k, label]) => (
                    <button key={k} type="button" className={kindLabel === label ? "is-on" : ""} onClick={() => turnInto(k)}>
                      {label}
                    </button>
                  ))}
                </span>
              ) : null}
            </span>
          ) : null}
          {target.kind === "text" ? (
            <>
              <button type="button" className={editor.isActive("bold") ? "is-on" : ""} title="Bold (⌘B)" onClick={() => editor.chain().focus().toggleBold().run()}>
                <b>B</b>
              </button>
              <button type="button" className={editor.isActive("italic") ? "is-on" : ""} title="Italic (⌘I)" onClick={() => editor.chain().focus().toggleItalic().run()}>
                <i>I</i>
              </button>
              <button
                type="button"
                className={editor.isActive("link") ? "is-on" : ""}
                onClick={() => {
                  setHref(String(editor.getAttributes("link").href ?? ""));
                  setMenu("link");
                }}
              >
                Link
              </button>
              {number ? (
                <button
                  type="button"
                  title="Counts up from zero as the reader scrolls to it"
                  onClick={() => {
                    const [, prefix, digits, suffix] = number;
                    const props: Record<string, unknown> = { to: Number(digits.replace(/,/g, "")) };
                    if (prefix) props.prefix = prefix;
                    if (suffix) props.suffix = suffix;
                    editor.chain().focus().insertContent({ type: "galleyInline", attrs: { name: numberMotion!.name, props, body: null } }).run();
                  }}
                >
                  ↑ Count up
                </button>
              ) : null}
              <span className="gx-ctx-sep" />
              <button type="button" onClick={startComment}>
                Comment
              </button>
            </>
          ) : null}
          {target.kind === "component" && isPicker ? (
            <>
              <button type="button" onClick={() => services.setUi(block, "replace")}>
                Replace
              </button>
              <button type="button" onClick={() => services.setUi(block, "edit")}>
                Alt & caption
              </button>
            </>
          ) : null}
          {target.kind === "component" && !isPicker ? (
            <button type="button" onClick={() => services.setUi(block, "edit")}>
              Edit
            </button>
          ) : null}
          {target.kind === "raw" ? (
            <button type="button" onClick={() => services.setUi(block, "edit")}>
              Edit source
            </button>
          ) : null}
          {target.kind !== "raw" && motions.length ? (
            <>
              <span className="gx-ctx-sep" />
              <MotionToggle motion={motion} options={motions} onChange={setMotion} />
            </>
          ) : null}
          {target.kind !== "text" ? (
            <>
              <span className="gx-ctx-sep" />
              <button type="button" title="Duplicate" onClick={() => editor.chain().focus().insertContentAt(block + node.nodeSize, node.toJSON()).run()}>
                Duplicate
              </button>
              <button
                type="button"
                className="gx-danger"
                title="Delete"
                onClick={() => editor.chain().focus().deleteRange({ from: block, to: block + node.nodeSize }).run()}
              >
                Delete
              </button>
            </>
          ) : null}
        </>
      )}
    </div>
  );
}

/**
 * A text field edited in place, inside the site's own heading or paragraph: a post's front
 * matter, or a page's setting. `multiline` keeps line breaks (Enter adds one).
 */
export function EditableText({
  field,
  as: Tag = "span",
  className = "",
  placeholder,
  multiline = false,
}: {
  field: string;
  as?: "h1" | "h2" | "p" | "div" | "span";
  className?: string;
  placeholder?: string;
  multiline?: boolean;
}) {
  const { values, setField } = useFields();
  const ref = useRef<HTMLElement>(null);
  const initial = useRef(String(values[field] ?? ""));
  useEffect(() => {
    if (ref.current) ref.current.textContent = initial.current;
  }, []);
  const read = (el: HTMLElement) =>
    multiline
      ? el.innerText.replace(/[ \t]+/g, " ").replace(/ ?\n ?/g, "\n").replace(/\n{2,}/g, "\n").trim()
      : (el.textContent ?? "").replace(/\s+/g, " ").trim();
  return (
    <Tag
      ref={ref as never}
      className={`gx-editable${multiline ? " gx-multiline" : ""} ${className}`}
      contentEditable="plaintext-only"
      suppressContentEditableWarning
      data-placeholder={placeholder}
      spellCheck
      onInput={(e) => setField(field, read(e.currentTarget))}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !multiline) {
          e.preventDefault();
          (e.currentTarget as HTMLElement).blur();
        }
      }}
    />
  );
}

/**
 * A front matter image (a cover or hero) in the site's own frame. Change opens the same
 * picture panel as an image block, and the picture being tried shows here until it's
 * kept. `shape` is how the site stores it: an object ({ src, alt, width, height }) or
 * just the path.
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
  const { frontmatter, setField, pickFieldImage, tryingFor } = useEditSession();
  const value = frontmatter[field] as { src?: string; alt?: string } | string | null | undefined;
  const trying = tryingFor(field);
  const src = trying ? trying.url || trying.thumbnail : typeof value === "string" ? value : value?.src;
  const alt = typeof value === "object" && value ? (value.alt ?? "") : "";

  if (!src) {
    return (
      <div className="gx-image-empty">
        <button type="button" onClick={() => pickFieldImage(field, shape, label)}>
          Add a {label}
        </button>
      </div>
    );
  }
  return (
    <div className={`gx-image${trying ? " is-trying" : ""}`}>
      {/* The thumbnail sits behind a picture being tried until the full one loads. */}
      {/* eslint-disable-next-line @next/next/no-img-element -- the site's own image component returns once saved */}
      <img src={src} alt={alt} style={trying ? { backgroundImage: `url("${trying.thumbnail}")`, backgroundSize: "cover", backgroundPosition: "center" } : undefined} />
      <div className="gx-image-tools">
        <button type="button" onClick={() => pickFieldImage(field, shape, label)}>
          Change {label}
        </button>
        <button type="button" onClick={() => setField(field, shape === "src" ? undefined : null)}>
          Remove
        </button>
      </div>
    </div>
  );
}

/** Close a popover when someone clicks outside it. */
export function useOutside(ref: React.RefObject<HTMLElement | null>, open: boolean, close: () => void) {
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [ref, open, close]);
}

/**
 * A term chosen from the site's vocabulary (e.g. the category), edited where the page
 * shows it: click the chip to pick another or add a new one. `className` is the site's
 * own chip style.
 */
export function EditableTerm({ field, className = "" }: { field: string; className?: string }) {
  const { frontmatter, setField, vocabulary, addTerm } = useEditSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useOutside(ref, open, close);
  const vocab = vocabulary[field];
  if (!vocab) return null;
  const value = frontmatter[field] as string | undefined;
  const name = vocab.terms.find((t) => t.slug === value)?.name ?? value ?? "Choose";
  return (
    <span className="gx-term" ref={ref}>
      <button type="button" className={`${className} gx-term-chip`} onClick={() => setOpen((o) => !o)} title="Change">
        {name}
      </button>
      {open ? (
        <span className="gx-term-pop">
          <TermPicker
            autoFocus
            terms={vocab.terms}
            value={value}
            onChange={(v) => setField(field, v ?? undefined)}
            onAdd={addTerm ? (n) => addTerm(vocab.kind, n).then((t) => ("error" in t ? t : (vocab.terms.push(t), t))) : undefined}
            onDone={close}
          />
        </span>
      ) : null}
    </span>
  );
}

/** Several terms (e.g. topics) edited where the page lists them: remove one, or add. */
export function EditableTerms({ field, className = "", addLabel = "+ Add" }: { field: string; className?: string; addLabel?: string }) {
  const { frontmatter, setField, vocabulary, addTerm } = useEditSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useOutside(ref, open, close);
  const vocab = vocabulary[field];
  if (!vocab) return null;
  const chosen = Array.isArray(frontmatter[field]) ? (frontmatter[field] as string[]) : [];
  return (
    <>
      {chosen.map((slug) => (
        <span key={slug} className="gx-term">
          <span className={`${className} gx-term-chip`}>
            {vocab.terms.find((t) => t.slug === slug)?.name ?? slug}
            <button type="button" className="gx-term-x" title="Remove" onClick={() => setField(field, chosen.filter((s) => s !== slug))}>
              ×
            </button>
          </span>
        </span>
      ))}
      <span className="gx-term" ref={ref}>
        <button type="button" className={`${className} gx-term-chip gx-term-add`} onClick={() => setOpen((o) => !o)}>
          {addLabel}
        </button>
        {open ? (
          <span className="gx-term-pop">
            <TermPicker
              autoFocus
              multiple
              terms={vocab.terms}
              value={chosen}
              onChange={(v) => setField(field, v ?? [])}
              onAdd={addTerm ? (n) => addTerm(vocab.kind, n).then((t) => ("error" in t ? t : (vocab.terms.push(t), t))) : undefined}
              onDone={close}
            />
          </span>
        ) : null}
      </span>
    </>
  );
}
