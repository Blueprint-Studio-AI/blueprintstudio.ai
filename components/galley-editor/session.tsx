"use client";

import type { Editor as TiptapEditor } from "@tiptap/react";
import { useEditor } from "@tiptap/react";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { anchorOf, findAnchor } from "./anchors";
import { extensions } from "./extensions";
import { ASSET_TYPE, BlocksPanel, CommentsPanel, GeneratePanel, LibraryPanel } from "./panels";
import { ServicesContext, type Services } from "./services";
import { EDITOR_CSS } from "./styles";
import type { Comment, DocNode, EditorActions, EditorPost, LibraryAsset, ManifestComponent, SaveResult } from "./types";

// Edit mode for a post, on the site's own page. The site renders its normal post layout
// and puts editable pieces where the title, cover and body go (editable.tsx); this holds
// the document, saves it as you type (checked by Galley on the server), and adds a small
// bar and a drawer for comments, the brand's library, the Asset Generator and components.

type Panel = "comments" | "library" | "generate" | "blocks";
type SaveState = { kind: "saved" | "dirty" | "saving" } | { kind: "error"; result: Extract<SaveResult, { ok: false }> };
type Target =
  | { kind: "insert"; pos: number | null }
  | { kind: "replace"; pos: number }
  | { kind: "frontmatter"; field: string; shape: "image" | "src" };

export interface EditSession {
  editor: TiptapEditor | null;
  /** The site's prose class for the body, so it looks like the live post. */
  setProseClass(className: string): void;
  frontmatter: Record<string, unknown>;
  setField(field: string, value: unknown): void;
  /** Open the library to choose an image for a front matter field, e.g. the cover. */
  pickFieldImage(field: string, shape?: "image" | "src"): void;
  /** Open the generator to make options for a front matter image. */
  generateFieldImage(field: string, shape?: "image" | "src"): void;
  startComment(): void;
  openGenerate(pos: number): void;
  openPanel(panel: Panel): void;
}

const SessionContext = createContext<EditSession | null>(null);

export function useEditSession(): EditSession {
  const session = useContext(SessionContext);
  if (!session) throw new Error("Galley: editable pieces go inside <EditSession>");
  return session;
}

/** The document as the server reads it: plain objects, no highlights or editor-only attributes. */
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

/** Where a new block goes: after the block the cursor is in (or the selected block). */
export const blockEnd = (editor: TiptapEditor) => {
  const { $from, to } = editor.state.selection;
  return $from.depth > 0 ? $from.after(1) : to;
};

/** A prompt for an image at `pos`, from the post's title and the passage around it. */
function contextAt(editor: TiptapEditor, pos: number | null, title: string) {
  const at = pos ?? editor.state.selection.from;
  let heading = "";
  const passage: string[] = [];
  editor.state.doc.forEach((node, offset) => {
    if (offset > at && passage.length) return;
    if (node.type.name === "heading") {
      heading = node.textContent;
      if (offset <= at) passage.length = 0;
    } else if (node.isTextblock && node.textContent.trim()) {
      if (offset <= at) {
        passage.push(node.textContent);
        if (passage.length > 2) passage.shift();
      } else if (!passage.length) passage.push(node.textContent);
    } else if (node.type.name === "galleyBlock" && Math.abs(offset - at) <= 1) {
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

export function EditSession({
  post,
  initialComments,
  components,
  actions,
  author,
  viewUrl,
  listUrl,
  children,
}: {
  post: EditorPost;
  initialComments: Comment[];
  components: ManifestComponent[];
  actions: EditorActions;
  author: string;
  viewUrl: string;
  listUrl: string;
  children: React.ReactNode;
}) {
  const [frontmatter, setFrontmatter] = useState(post.frontmatter);
  const [save, setSave] = useState<SaveState>({ kind: "saved" });
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [draft, setDraft] = useState<Comment | null>(null);
  const [activeComment, setActiveComment] = useState<string | null>(null);
  const [panel, setPanel] = useState<Panel | null>(null);
  const [target, setTarget] = useState<Target>({ kind: "insert", pos: null });
  const [generateContext, setGenerateContext] = useState("");

  const revision = useRef(post.revision);
  const frontmatterRef = useRef(frontmatter);
  useEffect(() => {
    frontmatterRef.current = frontmatter;
  }, [frontmatter]);
  const saving = useRef<Promise<void> | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveRef = useRef<() => Promise<void>>(async () => {});
  const proseClass = useRef("");
  const title = String(frontmatter.title ?? post.slug);

  const schedule = () => {
    setSave({ kind: "dirty" });
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => void saveRef.current(), 1200);
  };

  const editor = useEditor({
    extensions,
    content: post.doc,
    immediatelyRender: false,
    editorProps: {
      // A function, so ProseMirror applies the site's class on every update instead of
      // resetting it.
      attributes: () => ({ class: `gx-doc ${proseClass.current}`.trim(), spellcheck: "true" }),
      handleDrop: (view, event) => {
        const raw = event.dataTransfer?.getData(ASSET_TYPE);
        if (!raw) return false;
        event.preventDefault();
        const at = view.posAtCoords({ left: event.clientX, top: event.clientY });
        if (!at) return true;
        const $pos = view.state.doc.resolve(at.pos);
        void insertImageRef.current(JSON.parse(raw) as LibraryAsset, $pos.depth > 0 ? $pos.after(1) : at.pos);
        return true;
      },
    },
    onUpdate: ({ transaction }) => {
      if (!transaction.getMeta("galleyComment")) schedule();
    },
  });

  // ---- Saving ----

  const saveNow = useCallback(async () => {
    if (!editor) return;
    if (timer.current) clearTimeout(timer.current);
    await saving.current;
    const run = (async () => {
      setSave({ kind: "saving" });
      const doc = cleanDoc(JSON.parse(JSON.stringify(editor.getJSON())) as DocNode);
      const result = await actions
        .save(post.slug, { doc, frontmatter: frontmatterRef.current, revision: revision.current })
        .catch((e: Error): SaveResult => ({ ok: false, error: e.message }));
      if (result.ok) {
        revision.current = result.revision;
        setSave({ kind: "saved" });
      } else setSave({ kind: "error", result });
    })();
    saving.current = run;
    await run;
  }, [editor, actions, post.slug]);
  useEffect(() => {
    saveRef.current = saveNow;
  }, [saveNow]);

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

  const setField = useCallback((field: string, value: unknown) => {
    setFrontmatter((f) => ({ ...f, [field]: value }));
    schedule();
  }, []);

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
    const c = comments.find((x) => x.id === id);
    const range = c && editor ? findAnchor(editor.state.doc, c) : null;
    if (editor && range) {
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
        editor.view.dispatch(editor.state.tr.setNodeMarkup(pos, undefined, { ...node.attrs, props: { ...(node.attrs.props as object), ...quick }, pending }));
      } else {
        editor
          .chain()
          .insertContentAt(pos ?? blockEnd(editor), {
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
      let found = -1;
      editor.state.doc.descendants((node, at) => {
        if (node.attrs.pending === pending) found = at;
        return found < 0;
      });
      if (found < 0) return;
      if (imported.error || !imported.path) {
        setSave({ kind: "error", result: { ok: false, error: imported.error ?? "The image couldn't be added" } });
        return;
      }
      const node = editor.state.doc.nodeAt(found)!;
      const props = { ...(node.attrs.props as object), src: imported.path, width: imported.width, height: imported.height };
      editor.view.dispatch(editor.state.tr.setNodeMarkup(found, undefined, { ...node.attrs, props, pending: null }));
    },
    [editor, actions, title],
  );
  const insertImageRef = useRef(insertImage);
  useEffect(() => {
    insertImageRef.current = insertImage;
  }, [insertImage]);

  const useAsset = async (asset: LibraryAsset) => {
    if (target.kind === "frontmatter") {
      const { field, shape } = target;
      const current = frontmatterRef.current[field] as { alt?: string } | string | null | undefined;
      const alt = (typeof current === "object" && current?.alt) || altFrom(asset.prompt || title);
      const value = (src: string, width?: number, height?: number) => (shape === "src" ? src : { src, alt, width, height });
      setField(field, value(asset.thumbnail || asset.url, asset.width, asset.height));
      const imported = await actions.importAsset({ url: asset.url, name: fileName(asset.prompt || title) });
      if (imported.path) setField(field, value(imported.path, imported.width, imported.height));
    } else if (target.kind === "replace") await insertImage(asset, target.pos, true);
    else await insertImage(asset, target.pos);
    setTarget({ kind: "insert", pos: null });
  };

  const insertComponent = (component: ManifestComponent) => {
    if (!editor) return;
    const example = component.examples?.[0];
    if (component.kind === "text") {
      editor
        .chain()
        .focus()
        .insertContent({ type: "galleyInline", attrs: { name: component.name, props: example?.props ?? {}, body: example?.children ?? null } })
        .run();
    } else {
      editor
        .chain()
        .focus()
        .insertContentAt(blockEnd(editor), {
          type: "galleyBlock",
          attrs: { name: component.name, props: example?.props ?? {}, body: example?.children ?? null, isNew: true },
        })
        .run();
    }
  };

  const openGenerate = useCallback(
    (pos: number, kind: "insert" | "replace" = "insert") => {
      if (!editor) return;
      setTarget(kind === "replace" ? { kind, pos } : { kind, pos });
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
        setTarget({ kind: "replace", pos });
        setPanel("library");
      },
      generateFor: (pos) => openGenerate(pos, "replace"),
    }),
    [post.slug, actions, components, openGenerate],
  );

  const session = useMemo<EditSession>(
    () => ({
      editor,
      setProseClass: (className) => {
        if (proseClass.current === className) return;
        proseClass.current = className;
        if (editor && !editor.isDestroyed) {
          editor.view.dispatch(editor.state.tr.setMeta("galleyComment", true).setMeta("addToHistory", false));
        }
      },
      frontmatter,
      setField,
      pickFieldImage: (field, shape = "image") => {
        setTarget({ kind: "frontmatter", field, shape });
        setPanel("library");
      },
      generateFieldImage: (field, shape = "image") => {
        setTarget({ kind: "frontmatter", field, shape });
        const summary = ["summary", "description", "excerpt"].map((k) => frontmatter[k]).find(Boolean);
        setGenerateContext(
          [`A cover image for the article "${title}".`, summary ? `What it's about: ${String(summary)}` : "", "Editorial, wide, no text in the image."]
            .filter(Boolean)
            .join("\n\n"),
        );
        setPanel("generate");
      },
      startComment,
      openGenerate: (pos) => openGenerate(pos),
      openPanel: (p) => setPanel(p),
    }),
    [editor, frontmatter, setField, startComment, openGenerate, title],
  );

  const openCount = comments.filter((c) => !c.resolved).length + (draft ? 1 : 0);
  const status = { saved: "Saved", dirty: "Editing", saving: "Saving…", error: "Not saved" }[save.kind];
  const tabs: [Panel, string][] = [
    ["comments", `Comments${openCount ? ` · ${openCount}` : ""}`],
    ["library", "Library"],
    ["generate", "✦ Generate"],
    ["blocks", "Components"],
  ];

  return (
    <SessionContext.Provider value={session}>
      <ServicesContext.Provider value={services}>
        <style>{EDITOR_CSS}</style>
        <div className={`gx-session${panel ? " has-drawer" : ""}`}>{children}</div>

        <div className="gx-bar" role="toolbar" aria-label="Edit mode">
          <a className="gx-bar-exit" href={listUrl} title="All posts">
            ←
          </a>
          <span className="gx-bar-mode">Editing</span>
          <button type="button" className={`gx-bar-status is-${save.kind}`} onClick={() => void saveNow()} title="Save now (⌘S)">
            <i />
            {status}
          </button>
          <span className="gx-bar-sep" />
          {tabs.map(([key, label]) => (
            <button
              key={key}
              type="button"
              className={`gx-bar-tab${panel === key ? " is-on" : ""}`}
              onClick={() => {
                if (key === "generate" && editor && panel !== "generate") openGenerate(blockEnd(editor));
                else setPanel((p) => (p === key ? null : key));
              }}
            >
              {label}
            </button>
          ))}
          <span className="gx-bar-sep" />
          <a className="gx-bar-done" href={viewUrl}>
            Done
          </a>
        </div>

        {save.kind === "error" ? (
          <div className="gx-toast" role="alert">
            <b>Not saved.</b> {save.result.error}
            {save.result.errors?.map((e, i) => (
              <div key={i}>
                Line {e.line}: {e.message}
              </div>
            ))}
          </div>
        ) : null}

        {panel ? (
          <aside className="gx-drawer" data-lenis-prevent>
            <header className="gx-drawer-head">
              <nav className="gx-tabs">
                {tabs.map(([key, label]) => (
                  <button key={key} type="button" className={panel === key ? "is-on" : ""} onClick={() => setPanel(key)}>
                    {label}
                  </button>
                ))}
              </nav>
              <button type="button" className="gx-drawer-close" onClick={() => setPanel(null)} aria-label="Close">
                ×
              </button>
            </header>
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
            {panel === "library" ? <LibraryPanel actions={actions} picking={target.kind !== "insert"} onUse={useAsset} /> : null}
            {panel === "generate" ? (
              <GeneratePanel
                key={generateContext}
                actions={actions}
                context={generateContext || (editor ? contextAt(editor, null, title) : "")}
                replacing={target.kind === "replace"}
                onUse={useAsset}
              />
            ) : null}
            {panel === "blocks" ? <BlocksPanel components={components} onInsert={insertComponent} /> : null}
          </aside>
        ) : null}
      </ServicesContext.Provider>
    </SessionContext.Provider>
  );
}
