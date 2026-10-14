"use client";

import { DragHandle } from "@tiptap/extension-drag-handle-react";
import { EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import { useEffect, useRef, useState } from "react";
import { blockEnd, useEditSession } from "./session";

// The editable pieces a site puts into its own post layout, in place of the static
// title, summary, cover and body. They take the site's classes, so edit mode looks like
// the post.

/** The post body. `className` is the site's prose class (the one its post body uses). */
export function EditableBody({ className = "" }: { className?: string }) {
  const { editor, setProseClass, startComment, openGenerate } = useEditSession();
  const [linking, setLinking] = useState(false);
  const [href, setHref] = useState("");

  useEffect(() => {
    if (editor) setProseClass(className);
  }, [editor, className, setProseClass]);

  if (!editor) return <div className={className}>Loading the editor…</div>;
  return (
    <div className="gx-body">
      <DragHandle editor={editor}>
        <div className="gx-grip" title="Drag to move">
          ⠿
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
              <button type="button" className={editor.isActive("bold") ? "is-on" : ""} onClick={() => editor.chain().focus().toggleBold().run()}>
                <b>B</b>
              </button>
              <button type="button" className={editor.isActive("italic") ? "is-on" : ""} onClick={() => editor.chain().focus().toggleItalic().run()}>
                <i>I</i>
              </button>
              <button
                type="button"
                className={editor.isActive("link") ? "is-on" : ""}
                onClick={() => {
                  setHref(String(editor.getAttributes("link").href ?? ""));
                  setLinking(true);
                }}
              >
                Link
              </button>
              <button
                type="button"
                className={editor.isActive("heading", { level: 2 }) ? "is-on" : ""}
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              >
                H2
              </button>
              <button
                type="button"
                className={editor.isActive("heading", { level: 3 }) ? "is-on" : ""}
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              >
                H3
              </button>
              <button type="button" className={editor.isActive("bulletList") ? "is-on" : ""} onClick={() => editor.chain().focus().toggleBulletList().run()}>
                List
              </button>
              <span className="gx-bubble-sep" />
              <button type="button" onClick={startComment}>
                Comment
              </button>
              <button type="button" onClick={() => openGenerate(blockEnd(editor))}>
                ✦ Visualise
              </button>
            </>
          )}
        </div>
      </BubbleMenu>
      <EditorContent editor={editor} />
    </div>
  );
}

/** A front matter text field edited in place, e.g. the title as the page's own <h1>. */
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
 * A front matter image (a cover or hero) in the site's own frame, with buttons to pick
 * one from the library, generate options or remove it. `shape` is how the site stores it:
 * an object ({ src, alt, width, height }) or just the path.
 */
export function EditableImage({
  field,
  shape = "image",
  className = "",
  imgClassName = "",
  label = "cover",
}: {
  field: string;
  shape?: "image" | "src";
  className?: string;
  imgClassName?: string;
  label?: string;
}) {
  const { frontmatter, setField, pickFieldImage, generateFieldImage } = useEditSession();
  const value = frontmatter[field] as { src?: string; alt?: string } | string | null | undefined;
  const src = typeof value === "string" ? value : value?.src;
  const alt = typeof value === "object" && value ? (value.alt ?? "") : "";
  if (!src) {
    return (
      <div className="gx-image-empty">
        <button type="button" onClick={() => pickFieldImage(field, shape)}>
          Add a {label} from the library
        </button>
        <button type="button" onClick={() => generateFieldImage(field, shape)}>
          ✦ Generate a {label}
        </button>
      </div>
    );
  }
  return (
    <div className={`gx-image ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- the site's own image component returns once saved */}
      <img src={src} alt={alt} className={imgClassName} />
      <div className="gx-image-tools">
        <button type="button" onClick={() => pickFieldImage(field, shape)}>
          Replace
        </button>
        <button type="button" onClick={() => generateFieldImage(field, shape)}>
          ✦ Options
        </button>
        <button type="button" onClick={() => setField(field, shape === "src" ? undefined : null)}>
          Remove
        </button>
      </div>
    </div>
  );
}
