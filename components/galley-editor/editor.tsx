"use client";

import { DragHandle } from "@tiptap/extension-drag-handle-react";
import type { Editor as TiptapEditor } from "@tiptap/react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { anchorOf, findAnchor } from "./anchors";
import { extensions } from "./extensions";
import { ASSET_TYPE, BlocksPanel, CommentsPanel, GeneratePanel, LibraryPanel } from "./panels";
import { ServicesContext, type Services } from "./services";
import { EDITOR_CSS } from "./styles";
import type { Comment, DocNode, EditorActions, EditorPost, LibraryAsset, ManifestComponent, SaveResult } from "./types";

// Galley's visual editor: the post in the site's own type, edited like a document.
// Changes save themselves (checked by Galley on the server); comments, the brand's
// library and the Asset Generator sit in the panel on the right.

type Panel = "comments" | "library" | "generate" | "blocks";
type SaveState = { kind: "saved" | "dirty" | "saving" } | { kind: "error"; result: Extract<SaveResult, { ok: false }> };

/** The document as the server reads it: comment highlights and editor-only attributes removed. */
function cleanDoc(node: DocNode): DocNode {
  const out: DocNode = { ...node };
  if (node.marks) {
    const marks = node.marks
      .filter((m) => m.type !== "comment")
      .map((m) => (m.type === "link" ? { type: "link", attrs: { href: m.attrs?.href, title: m.attrs?.title ?? null } } : m));
    if (marks.length) out.marks = marks;
    else delete out.marks;
  }
  if (node.attrs && ("isNew" in node.attrs || "pending" in node.attrs)) {
    const attrs = { ...node.attrs };
    delete attrs.isNew;
    delete attrs.pending;
    out.attrs = attrs;
  }
  if (node.content) out.content = node.content.map(cleanDoc);
  return out;
}

/** A prompt for an image at `pos`, from the post's title and the passage around it. */
function contextAt(editor: TiptapEditor, pos: number, title: string) {
  const { doc } = editor.state;
  let heading = "";
  const passage: string[] = [];
  doc.forEach((node, offset) => {
    if (offset > pos && passage.length) return;
    if (node.type.name === "heading") {
      heading = node.textContent;
      if (offset <= pos) passage.length = 0;
    } else if (node.isTextblock && node.textContent.trim()) {
      if (offset <= pos) {
        passage.push(node.textContent);
        if (passage.length > 2) passage.shift();
      } else if (!passage.length) passage.push(node.textContent);
    } else if (node.type.name === "galleyBlock" && offset <= pos + 1 && offset >= pos - 1) {
      const alt = (node.attrs.props as { alt?: string }).alt;
      if (alt) passage.push(`The current image shows: ${alt}`);
    }
  });
  const excerpt = passage.join(" ").replace(/\s+/g, " ").slice(0, 420);
  return [
    `An image for the article "${title}"${heading ? `, in the section "${heading}"` : ""}.`,
    excerpt ? `The passage: ${excerpt}` : "",
    "Editorial, no text in the image.",
  ]
    .filter(Boolean)
    .join("\n\n");
}

/** Where a new block goes: after the block the cursor is in (or the selected block). */
const blockEnd = (editor: TiptapEditor) => {
  const { $from, to } = editor.state.selection;
  return $from.depth > 0 ? $from.after(1) : to;
};

const altFrom = (prompt: string) => {
  const first = prompt.replace(/\s+/g, " ").split(/(?<=[.!?])\s/)[0] ?? prompt;
  return first.length > 120 ? `${first.slice(0, 117)}…` : first;
};
const fileName = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40) || "image";

export function GalleyEditor({
  post,
  initialComments,
  components,
  actions,
  author,
  viewUrl,
  listUrl,
  proseClassName = "gx-prose",
  pageClassName = "",
  summaryField,
}: {
  post: EditorPost;
  initialComments: Comment[];
  components: ManifestComponent[];
  actions: EditorActions;
  author: string;
  viewUrl: string;
  listUrl: string;
  /** Classes that give the document the site's own post styles. */
  proseClassName?: string;
  /** Classes for the page around the post, for sites whose post styles need a wrapper. */
  pageClassName?: string;
  /** The front matter field shown under the title, e.g. "description" or "summary". */
  summaryField?: string;
}) {
  const [frontmatter, setFrontmatter] = useState(post.frontmatter);
  const [save, setSave] = useState<SaveState>({ kind: "saved" });
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [draft, setDraft] = useState<Comment | null>(null);
  const [activeComment, setActiveComment] = useState<string | null>(null);
  const [panel, setPanel] = useState<Panel>(initialComments.some((c) => !c.resolved) ? "comments" : "library");
  const [target, setTarget] = useState<{ mode: "insert" | "replace"; pos: number } | null>(null);
  const [generateContext, setGenerateContext] = useState("");
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const revision = useRef(post.revision);
  const frontmatterRef = useRef(frontmatter);
  useEffect(() => {
    frontmatterRef.current = frontmatter;
  }, [frontmatter]);
  const saving = useRef<Promise<void> | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const title = String(frontmatter.title ?? post.slug);

  const editor = useEditor({
    extensions,
    content: post.doc,
    immediatelyRender: false,
    editorProps: {
      attributes: { class: `gx-doc ${proseClassName}`, spellcheck: "true" },
      handleDrop: (view, event) => {
        const raw = event.dataTransfer?.getData(ASSET_TYPE);
        if (!raw) return false;
        event.preventDefault();
        const asset = JSON.parse(raw) as LibraryAsset;
        const at = view.posAtCoords({ left: event.clientX, top: event.clientY });
        if (!at) return true;
        const $pos = view.state.doc.resolve(at.pos);
        const pos = $pos.depth > 0 ? $pos.after(1) : at.pos;
        void insertImage(asset, pos);
        return true;
      },
    },
    onUpdate: ({ transaction }) => {
      if (transaction.getMeta("galleyComment")) return;
      setSave({ kind: "dirty" });
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => void saveNow(), 1200);
    },
  });

  // ---- Saving ----

  const saveNow = useCallback(async () => {
    if (!editor) return;
    if (timer.current) clearTimeout(timer.current);
    await saving.current;
    const run = (async () => {
      setSave({ kind: "saving" });
      const result = await actions
        .save(post.slug, { doc: cleanDoc(JSON.parse(JSON.stringify(editor.getJSON())) as DocNode), frontmatter: frontmatterRef.current, revision: revision.current })
        .catch((e: Error): SaveResult => ({ ok: false, error: e.message }));
      if (result.ok) {
        revision.current = result.revision;
        setSave({ kind: "saved" });
      } else setSave({ kind: "error", result });
    })();
    saving.current = run;
    await run;
  }, [editor, actions, post.slug]);

  const touchFrontmatter = (field: string, value: string) => {
    setFrontmatter((f) => ({ ...f, [field]: value }));
    setSave({ kind: "dirty" });
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => void saveNow(), 1200);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        void saveNow();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [saveNow]);

  // ---- Comments ----

  const persistComments = useCallback(
    (next: Comment[]) => {
      setComments(next);
      void actions.saveComments(post.slug, next);
    },
    [actions, post.slug],
  );

  const markComment = useCallback(
    (id: string, from: number, to: number) => {
      if (!editor) return;
      const mark = editor.schema.marks.comment.create({ id });
      editor.view.dispatch(editor.state.tr.addMark(from, to, mark).setMeta("galleyComment", true).setMeta("addToHistory", false));
    },
    [editor],
  );

  const unmarkComment = useCallback(
    (id: string) => {
      if (!editor) return;
      const { tr, doc } = editor.state;
      doc.descendants((node, pos) => {
        const mark = node.marks.find((m) => m.type.name === "comment" && m.attrs.id === id);
        if (mark) tr.removeMark(pos, pos + node.nodeSize, mark);
      });
      editor.view.dispatch(tr.setMeta("galleyComment", true).setMeta("addToHistory", false));
    },
    [editor],
  );

  // Highlight the open comments once the editor exists.
  const highlighted = useRef(false);
  useEffect(() => {
    if (!editor || highlighted.current) return;
    highlighted.current = true;
    for (const c of initialComments) {
      if (c.resolved) continue;
      const range = findAnchor(editor.state.doc, c);
      if (range) markComment(c.id, range.from, range.to);
    }
  }, [editor, initialComments, markComment]);

  const startComment = useCallback(() => {
    if (!editor) return;
    const { from, to } = editor.state.selection;
    if (from === to) return;
    const anchor = anchorOf(editor.state.doc, from, to);
    if (!anchor?.quote.trim()) return;
    const id = crypto.randomUUID();
    markComment(id, from, to);
    setDraft({ id, ...anchor, author, body: "", at: new Date().toISOString(), replies: [] });
    setActiveComment(id);
    setPanel("comments");
  }, [editor, author, markComment]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.altKey && (e.key === "m" || e.code === "KeyM")) {
        e.preventDefault();
        startComment();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [startComment]);

  // Clicking highlighted text opens its comment.
  useEffect(() => {
    if (!editor) return;
    const onSelection = () => {
      const mark = editor.state.selection.$from.marks().find((m) => m.type.name === "comment");
      if (mark) {
        setActiveComment(mark.attrs.id);
        setPanel("comments");
      }
    };
    editor.on("selectionUpdate", onSelection);
    return () => {
      editor.off("selectionUpdate", onSelection);
    };
  }, [editor]);

  const focusComment = (id: string) => {
    setActiveComment(id);
    if (!editor) return;
    const c = comments.find((x) => x.id === id);
    const range = c ? findAnchor(editor.state.doc, c) : null;
    if (range) {
      editor.commands.setTextSelection(range);
      editor.view.domAtPos(range.from).node.parentElement?.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  };

  // ---- Images and components ----

  // The picked image shows at once (from Blueprint Studio), then becomes the site's own
  // optimised copy when the import finishes.
  const insertImage = useCallback(
    async (asset: LibraryAsset, pos: number | null, replace = false) => {
      if (!editor) return;
      const pending = crypto.randomUUID();
      const quick = { src: asset.thumbnail || asset.url, width: asset.width, height: asset.height };
      if (replace && pos !== null && editor.state.doc.nodeAt(pos)?.type.name === "galleyBlock") {
        const node = editor.state.doc.nodeAt(pos)!;
        editor.view.dispatch(
          editor.state.tr.setNodeMarkup(pos, undefined, { ...node.attrs, props: { ...(node.attrs.props as object), ...quick }, pending }),
        );
      } else {
        const at = pos ?? blockEnd(editor);
        editor
          .chain()
          .insertContentAt(at, {
            type: "galleyBlock",
            attrs: {
              name: "Image",
              props: { src: quick.src, alt: altFrom(asset.prompt || title), width: quick.width, height: quick.height },
              body: null,
              pending,
            },
          })
          .run();
      }
      const imported = await actions.importAsset({ url: asset.url, name: fileName(asset.prompt || title) });
      let found: number | null = null;
      editor.state.doc.descendants((node, at) => {
        if (node.attrs.pending === pending) found = at;
        return found === null;
      });
      if (found === null) return;
      const node = editor.state.doc.nodeAt(found)!;
      if (imported.error || !imported.path) {
        setSave({ kind: "error", result: { ok: false, error: imported.error ?? "The image couldn't be added" } });
        return;
      }
      const props = { ...(node.attrs.props as object), src: imported.path, width: imported.width, height: imported.height };
      editor.view.dispatch(editor.state.tr.setNodeMarkup(found, undefined, { ...node.attrs, props, pending: null }));
    },
    [editor, actions, title],
  );

  const insertComponent = (component: ManifestComponent) => {
    if (!editor) return;
    const example = component.examples?.[0];
    const node =
      component.kind === "text"
        ? { type: "galleyInline", attrs: { name: component.name, props: example?.props ?? {}, body: example?.children ?? null } }
        : { type: "galleyBlock", attrs: { name: component.name, props: example?.props ?? {}, body: example?.children ?? null, isNew: true } };
    if (component.kind === "text") editor.chain().focus().insertContent(node).run();
    else {
      editor.chain().focus().insertContentAt(blockEnd(editor), node).run();
    }
  };

  const openGenerate = useCallback(
    (pos: number, mode: "insert" | "replace") => {
      if (!editor) return;
      setTarget({ mode, pos });
      setGenerateContext(contextAt(editor, pos, title));
      setPanel("generate");
    },
    [editor, title],
  );

  const services = useMemo<Services>(
    () => ({
      slug: post.slug,
      actions,
      components,
      pickImage: (pos) => {
        setTarget({ mode: "replace", pos });
        setPanel("library");
      },
      generateFor: (pos) => openGenerate(pos, "replace"),
    }),
    [post.slug, actions, components, openGenerate],
  );

  const useAsset = async (asset: LibraryAsset) => {
    if (target?.mode === "replace") await insertImage(asset, target.pos, true);
    else await insertImage(asset, target?.pos ?? null);
    setTarget(null);
  };

  // ---- Toolbar state ----

  const active = useEditorState({
    editor,
    selector: ({ editor: e }) =>
      e
        ? {
            bold: e.isActive("bold"),
            italic: e.isActive("italic"),
            strike: e.isActive("strike"),
            code: e.isActive("code"),
            link: e.isActive("link"),
            h2: e.isActive("heading", { level: 2 }),
            h3: e.isActive("heading", { level: 3 }),
            bullet: e.isActive("bulletList"),
            ordered: e.isActive("orderedList"),
            quote: e.isActive("blockquote"),
            canUndo: e.can().undo(),
            canRedo: e.can().redo(),
          }
        : null,
  });

  const openComments = comments.filter((c) => !c.resolved).length + (draft ? 1 : 0);
  const summaryKey = summaryField ?? (["description", "summary", "excerpt"].find((k) => k in frontmatter) as string | undefined);

  return (
    <ServicesContext.Provider value={services}>
      <style>{EDITOR_CSS}</style>
      <div className="gx-root">
        <header className="gx-top">
          <a className="gx-back" href={listUrl}>
            ← Posts
          </a>
          <span className="gx-top-title">{title}</span>
          <SaveChip state={save} onRetry={saveNow} />
          <span className="gx-top-space" />
          <a className="gx-button" href={viewUrl} target="_blank" rel="noreferrer">
            View post ↗
          </a>
        </header>

        <div className="gx-toolbar" role="toolbar">
          <ToolButton label="Undo" disabled={!active?.canUndo} onClick={() => editor?.chain().focus().undo().run()}>
            ↶
          </ToolButton>
          <ToolButton label="Redo" disabled={!active?.canRedo} onClick={() => editor?.chain().focus().redo().run()}>
            ↷
          </ToolButton>
          <span className="gx-sep" />
          <select
            className="gx-style-select"
            value={active?.h2 ? "h2" : active?.h3 ? "h3" : "p"}
            onChange={(e) => {
              const c = editor?.chain().focus();
              if (e.target.value === "p") c?.setParagraph().run();
              else c?.setHeading({ level: e.target.value === "h2" ? 2 : 3 }).run();
            }}
          >
            <option value="p">Text</option>
            <option value="h2">Heading</option>
            <option value="h3">Subheading</option>
          </select>
          <span className="gx-sep" />
          <ToolButton label="Bold (⌘B)" on={active?.bold} onClick={() => editor?.chain().focus().toggleBold().run()}>
            <b>B</b>
          </ToolButton>
          <ToolButton label="Italic (⌘I)" on={active?.italic} onClick={() => editor?.chain().focus().toggleItalic().run()}>
            <i>I</i>
          </ToolButton>
          <ToolButton label="Strikethrough" on={active?.strike} onClick={() => editor?.chain().focus().toggleStrike().run()}>
            <s>S</s>
          </ToolButton>
          <ToolButton label="Code" on={active?.code} onClick={() => editor?.chain().focus().toggleCode().run()}>
            {"</>"}
          </ToolButton>
          <ToolButton
            label="Link"
            on={active?.link || linkOpen}
            onClick={() => {
              setLinkUrl(String(editor?.getAttributes("link").href ?? ""));
              setLinkOpen((o) => !o);
            }}
          >
            🔗
          </ToolButton>
          {linkOpen ? (
            <form
              className="gx-link-form"
              onSubmit={(e) => {
                e.preventDefault();
                const c = editor?.chain().focus().extendMarkRange("link");
                if (linkUrl.trim()) c?.setLink({ href: linkUrl.trim() }).run();
                else c?.unsetLink().run();
                setLinkOpen(false);
              }}
            >
              <input autoFocus value={linkUrl} placeholder="https://…" onChange={(e) => setLinkUrl(e.target.value)} />
              <button className="gx-button gx-primary" type="submit">
                Apply
              </button>
            </form>
          ) : null}
          <span className="gx-sep" />
          <ToolButton label="Bulleted list" on={active?.bullet} onClick={() => editor?.chain().focus().toggleBulletList().run()}>
            •≡
          </ToolButton>
          <ToolButton label="Numbered list" on={active?.ordered} onClick={() => editor?.chain().focus().toggleOrderedList().run()}>
            1≡
          </ToolButton>
          <ToolButton label="Quote" on={active?.quote} onClick={() => editor?.chain().focus().toggleBlockquote().run()}>
            ❝
          </ToolButton>
          <ToolButton label="Divider" onClick={() => editor?.chain().focus().setHorizontalRule().run()}>
            ―
          </ToolButton>
          <span className="gx-sep" />
          <button type="button" className="gx-tool gx-tool-text" onClick={() => setPanel("library")}>
            Image
          </button>
          <button
            type="button"
            className="gx-tool gx-tool-text"
            onClick={() => editor && openGenerate(blockEnd(editor), "insert")}
          >
            ✦ Generate
          </button>
          <button type="button" className="gx-tool gx-tool-text" onClick={() => setPanel("blocks")}>
            Components
          </button>
          <span className="gx-sep" />
          <button type="button" className="gx-tool gx-tool-text" onClick={startComment} title="Comment (⌘⌥M)">
            💬 Comment
          </button>
        </div>

        {save.kind === "error" ? (
          <div className="gx-errors">
            <b>Not saved:</b> {save.result.error}
            {save.result.errors?.map((e, i) => (
              <div key={i}>
                Line {e.line}: {e.message}
              </div>
            ))}
          </div>
        ) : null}

        <div className="gx-main">
          <div className="gx-canvas">
            <div className={`gx-page ${pageClassName}`}>
              <AutoGrow className="gx-title" value={title} onChange={(v) => touchFrontmatter("title", v)} label="Title" />
              {summaryKey ? (
                <AutoGrow
                  className="gx-summary"
                  value={String(frontmatter[summaryKey] ?? "")}
                  onChange={(v) => touchFrontmatter(summaryKey, v)}
                  label="Summary"
                />
              ) : null}
              {editor ? (
                <>
                  <DragHandle editor={editor}>
                    <div className="gx-grip" title="Drag to move">
                      ⠿
                    </div>
                  </DragHandle>
                  <BubbleMenu editor={editor} shouldShow={({ editor: e, from, to }) => from !== to && !e.isActive("galleyBlock")}>
                    <div className="gx-bubble">
                      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()}>
                        <b>B</b>
                      </button>
                      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()}>
                        <i>I</i>
                      </button>
                      <button type="button" onClick={startComment}>
                        💬 Comment
                      </button>
                      <button type="button" onClick={() => openGenerate(blockEnd(editor), "insert")}>
                        ✦ Visualise
                      </button>
                    </div>
                  </BubbleMenu>
                </>
              ) : null}
              <EditorContent editor={editor} />
            </div>
          </div>

          <aside className="gx-panel">
            <nav className="gx-tabs">
              {(
                [
                  ["comments", `Comments${openComments ? ` ${openComments}` : ""}`],
                  ["library", "Library"],
                  ["generate", "✦ Generate"],
                  ["blocks", "Components"],
                ] as [Panel, string][]
              ).map(([key, label]) => (
                <button key={key} type="button" className={panel === key ? "is-on" : ""} onClick={() => setPanel(key)}>
                  {label}
                </button>
              ))}
            </nav>
            {panel === "comments" ? (
              <CommentsPanel
                comments={comments}
                draft={draft}
                active={activeComment}
                onFocus={focusComment}
                onSubmitDraft={(body) => {
                  if (!draft) return;
                  persistComments([...comments, { ...draft, body }]);
                  setDraft(null);
                }}
                onCancelDraft={() => {
                  if (draft) unmarkComment(draft.id);
                  setDraft(null);
                }}
                onReply={(id, body) =>
                  persistComments(comments.map((c) => (c.id === id ? { ...c, replies: [...c.replies, { author, body, at: new Date().toISOString() }] } : c)))
                }
                onResolve={(id) => {
                  unmarkComment(id);
                  persistComments(comments.map((c) => (c.id === id ? { ...c, resolved: true } : c)));
                }}
                onReopen={(id) => {
                  const c = comments.find((x) => x.id === id);
                  const range = c && editor ? findAnchor(editor.state.doc, c) : null;
                  if (range) markComment(id, range.from, range.to);
                  persistComments(comments.map((x) => (x.id === id ? { ...x, resolved: false } : x)));
                }}
              />
            ) : null}
            {panel === "library" ? <LibraryPanel actions={actions} picking={target?.mode === "replace"} onUse={useAsset} /> : null}
            {panel === "generate" ? (
              <GeneratePanel key={generateContext} actions={actions} context={generateContext || (editor ? contextAt(editor, editor.state.selection.from, title) : "")} replacing={target?.mode === "replace"} onUse={useAsset} />
            ) : null}
            {panel === "blocks" ? <BlocksPanel components={components} onInsert={insertComponent} /> : null}
          </aside>
        </div>
      </div>
    </ServicesContext.Provider>
  );
}

function ToolButton({
  label,
  on,
  disabled,
  onClick,
  children,
}: {
  label: string;
  on?: boolean;
  disabled?: boolean;
  onClick(): void;
  children: React.ReactNode;
}) {
  return (
    <button type="button" className={`gx-tool${on ? " is-on" : ""}`} title={label} aria-label={label} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}

/** A text field that grows with its text, for the title and summary. */
function AutoGrow({ className, value, onChange, label }: { className: string; value: string; onChange(v: string): void; label: string }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);
  return (
    <textarea
      ref={ref}
      className={className}
      rows={1}
      value={value}
      aria-label={label}
      onChange={(e) => onChange(e.target.value.replace(/\n/g, " "))}
    />
  );
}

function SaveChip({ state, onRetry }: { state: SaveState; onRetry(): void }) {
  const text = { saved: "Saved", dirty: "Editing…", saving: "Saving…", error: "Not saved" }[state.kind];
  return (
    <button type="button" className={`gx-chip gx-chip-${state.kind}`} onClick={onRetry} title="Save now (⌘S)">
      {text}
    </button>
  );
}
