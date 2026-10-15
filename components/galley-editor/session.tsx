"use client";

import type { Editor as TiptapEditor } from "@tiptap/react";
import { useEditor } from "@tiptap/react";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { anchorOf, findAnchor } from "./anchors";
import { ImagePanel, type Uploaded } from "./chooser";
import { extensions } from "./extensions";
import { CommentsPanel } from "./panels";
import { Field, type FieldContext } from "./fields";
import { FieldsContext, type Fields } from "./fields-context";
import { Icon } from "./icons";
import { ServicesContext, type Services } from "./services";
import { EDITOR_CSS } from "./styles";
import type { Comment, DocNode, EditorActions, EditorPost, JsonSchema, LibraryAsset, ManifestComponent, SaveResult, Term, Vocabulary } from "./types";

// Edit mode for a post, on the site's own page. The site renders its normal post layout
// and puts editable pieces where the title, cover and body go (editable.tsx). This holds
// the document and saves it as you type (checked by Galley on the server). Things are
// added where they go: "+" or "/" for a new block. The rail down the right holds what's
// about the whole post, and its panels open beside it: details, comments, and the picture
// being chosen for an image block or the cover.

type SaveState = { kind: "saved" | "dirty" | "saving" } | { kind: "error"; result: Extract<SaveResult, { ok: false }> };
export type ImageShape = "image" | "src";

/** Where the insert menu is open: at `pos`, replacing the empty paragraph there if `replace`. */
export type InsertAt = { pos: number; replace: boolean; left: number; top: number };

export interface EditSession {
  editor: TiptapEditor | null;
  components: ManifestComponent[];
  frontmatter: Record<string, unknown>;
  setField(field: string, value: unknown): void;
  /** The site's prose class for the body, so it looks like the live post. */
  setProseClass(className: string): void;
  /** A prompt for an image at `pos` (or for the cover, with null), from the post around it. */
  contextFor(pos: number | null): string;
  /** Open the picture panel for a front matter image (the cover, a hero). */
  pickFieldImage(field: string, shape: ImageShape, label: string): void;
  /** The picture being tried for that field, while the panel is open for it. */
  tryingFor(field: string): LibraryAsset | null;
  insertAt: InsertAt | null;
  openInsert(at: InsertAt | null): void;
  startComment(): void;
  /** The site's vocabulary (categories, topics…), for picking terms on the page. */
  vocabulary: Vocabulary;
  addTerm?(kind: string, name: string): Promise<Term | { error: string }>;
}

const SessionContext = createContext<EditSession | null>(null);

export function useEditSession(): EditSession {
  const session = useContext(SessionContext);
  if (!session) throw new Error("Galley: editable pieces go inside <EditSession>");
  return session;
}

/**
 * The document as the server reads it: plain objects, no highlights or editor-only
 * attributes, and no image blocks still waiting for a picture.
 */
function cleanDoc(node: DocNode, pickers: Set<string>): DocNode {
  const out: DocNode = { ...node };
  if (node.marks) {
    const marks = node.marks
      .filter((m) => m.type !== "comment")
      .map((m) => (m.type === "link" ? { type: "link", attrs: { href: m.attrs?.href, title: m.attrs?.title ?? null } } : m));
    if (marks.length) out.marks = marks;
    else delete out.marks;
  }
  if (node.attrs && ("isNew" in node.attrs || "pending" in node.attrs || "ui" in node.attrs)) {
    const attrs = { ...node.attrs };
    delete attrs.isNew;
    delete attrs.pending;
    delete attrs.ui;
    out.attrs = attrs;
  }
  if (node.content) {
    out.content = node.content
      .filter((c) => !(c.type === "galleyBlock" && pickers.has(String(c.attrs?.name)) && !(c.attrs?.props as { src?: string } | undefined)?.src))
      .map((c) => cleanDoc(c, pickers));
  }
  return out;
}

/** Where a new block goes: after the block the cursor is in (or the selected block). */
export const blockEnd = (editor: TiptapEditor) => {
  const { $from, to } = editor.state.selection;
  return $from.depth > 0 ? $from.after(1) : to;
};

const altFrom = (prompt: string) => {
  // Prompts edit mode wrote ("An image for the article …") say where a picture went, not
  // what it shows, so they make no alt text.
  if (/^(An|A cover) image for the article/.test(prompt.trim())) return "";
  const first = prompt.replace(/\s+/g, " ").split(/(?<=[.!?])\s/)[0] ?? prompt;
  return first.length > 120 ? `${first.slice(0, 117)}…` : first;
};
const fileName = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40) || "image";

/** A starting alt text from an uploaded file's name ("team-offsite_2026.jpg" → "Team offsite 2026"); people edit it. */
const altFromFile = (name = "") => {
  const words = name.replace(/\.[a-z0-9]+$/i, "").replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
  return words ? words[0].toUpperCase() + words.slice(1) : "";
};

const imageValue = (shape: ImageShape, src: string, alt: string, width?: number, height?: number) =>
  shape === "src" ? src : { src, alt, width, height };

export function EditSession({
  post,
  initialComments,
  components,
  actions,
  author,
  viewUrl,
  listUrl,
  frontmatterSchema,
  inlineFields = ["title"],
  vocabulary = {},
  placeholders = {},
  children,
}: {
  post: EditorPost;
  initialComments: Comment[];
  components: ManifestComponent[];
  actions: EditorActions;
  author: string;
  viewUrl: string;
  listUrl: string;
  /** The front matter's JSON Schema (from the site's manifest), for the Details panel. */
  frontmatterSchema?: JsonSchema;
  /** Front matter fields edited on the page itself, left out of Details. */
  inlineFields?: string[];
  /** Choices from the site's vocabulary, by front matter path ("category", "series.slug"). */
  vocabulary?: Vocabulary;
  /** What an empty field falls back to, e.g. the summary's first paragraph. */
  placeholders?: Record<string, string>;
  children: React.ReactNode;
}) {
  const [frontmatter, setFrontmatter] = useState(post.frontmatter);
  const [save, setSave] = useState<SaveState>({ kind: "saved" });
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [draft, setDraft] = useState<Comment | null>(null);
  const [activeComment, setActiveComment] = useState<string | null>(null);
  const [drawer, setDrawer] = useState<"comments" | "details" | "image" | null>(null);
  // Choosing a picture: for the image block marked ui "replace", or for a front matter
  // field. `trying` is shown in the post until it's kept.
  const [fieldPick, setFieldPick] = useState<{ field: string; shape: ImageShape; label: string } | null>(null);
  const [trying, setTrying] = useState<LibraryAsset | null>(null);
  const [pickKey, setPickKey] = useState(0);
  const commentsOpen = drawer === "comments";
  // Opening another panel puts a picture that's only being tried back.
  const drawerRef = useRef(drawer);
  useEffect(() => {
    drawerRef.current = drawer;
  }, [drawer]);
  const closePictureRef = useRef<() => void>(() => {});
  const leavePicture = () => {
    if (drawerRef.current === "image") closePictureRef.current();
  };
  const setCommentsOpen = useCallback((open: boolean | ((o: boolean) => boolean)) => {
    const next = typeof open === "function" ? open(drawerRef.current === "comments") : open;
    if (next && drawerRef.current === "image") closePictureRef.current();
    setDrawer((d) => (next ? "comments" : d === "comments" ? null : d));
  }, []);
  const [insertAt, setInsertAt] = useState<InsertAt | null>(null);

  const revision = useRef(post.revision);
  const frontmatterRef = useRef(frontmatter);
  useEffect(() => {
    frontmatterRef.current = frontmatter;
  }, [frontmatter]);
  const saving = useRef<Promise<void> | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveRef = useRef<() => Promise<void>>(async () => {});
  const proseClass = useRef("");
  const slashRef = useRef<(pos: number) => void>(() => {});
  const title = String(frontmatter.title ?? post.slug);
  const pickers = useMemo(() => new Set(components.filter((c) => c.picker === "image").map((c) => c.name)), [components]);

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
      // "/" on an empty line opens the insert menu there.
      handleTextInput: (view, from, _to, text) => {
        const $from = view.state.doc.resolve(from);
        if (text !== "/" || $from.depth !== 1 || $from.parent.type.name !== "paragraph" || $from.parent.content.size !== 0) return false;
        slashRef.current($from.before(1));
        return true;
      },
    },
    onUpdate: ({ transaction }) => {
      if (!transaction.getMeta("galleyComment")) schedule();
    },
  });

  useEffect(() => {
    slashRef.current = (pos) => {
      if (!editor) return;
      const coords = editor.view.coordsAtPos(pos + 1);
      setInsertAt({ pos, replace: true, left: coords.left, top: coords.bottom + 6 });
    };
  }, [editor]);

  // ---- Saving ----

  const saveNow = useCallback(async () => {
    if (!editor) return;
    if (timer.current) clearTimeout(timer.current);
    // A picture still being copied into the site would be saved by its remote address;
    // wait for it.
    let importing = false;
    editor.state.doc.descendants((n) => {
      if (n.attrs.pending) importing = true;
      return !importing;
    });
    if (importing) {
      timer.current = setTimeout(() => void saveRef.current(), 800);
      return;
    }
    await saving.current;
    const run = (async () => {
      setSave({ kind: "saving" });
      const doc = cleanDoc(JSON.parse(JSON.stringify(editor.getJSON())) as DocNode, pickers);
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
  }, [editor, actions, post.slug, pickers]);
  useEffect(() => {
    saveRef.current = saveNow;
  }, [saveNow]);

  // Leaving with changes not yet saved asks first.
  const unsaved = save.kind !== "saved";
  useEffect(() => {
    if (!unsaved) return;
    const onLeave = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", onLeave);
    return () => window.removeEventListener("beforeunload", onLeave);
  }, [unsaved]);

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
    setCommentsOpen(true);
  }, [editor, author, markComment, setCommentsOpen]);

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
        setCommentsOpen(true);
      }
    };
    editor.on("selectionUpdate", onSelection);
    return () => {
      editor.off("selectionUpdate", onSelection);
    };
  }, [editor, setCommentsOpen]);

  const focusComment = (id: string) => {
    setActiveComment(id);
    const c = comments.find((x) => x.id === id);
    const range = c && editor ? findAnchor(editor.state.doc, c) : null;
    if (editor && range) {
      editor.commands.setTextSelection(range);
      editor.view.domAtPos(range.from).node.parentElement?.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  };

  // ---- Images ----

  const contextFor = useCallback(
    (pos: number | null) => {
      const summary = ["summary", "description", "excerpt"].map((k) => frontmatterRef.current[k]).find(Boolean);
      if (pos === null || !editor) {
        return [`A cover image for the article "${title}".`, summary ? `What it's about: ${String(summary)}` : "", "Editorial, wide, no text in the image."]
          .filter(Boolean)
          .join("\n\n");
      }
      let heading = "";
      const passage: string[] = [];
      editor.state.doc.forEach((node, offset) => {
        if (offset > pos && passage.length) return;
        if (node.type.name === "heading") {
          heading = node.textContent;
          if (offset <= pos) passage.length = 0;
        } else if (node.isTextblock && node.textContent.trim()) {
          if (offset < pos) {
            passage.push(node.textContent);
            if (passage.length > 2) passage.shift();
          } else if (!passage.length) passage.push(node.textContent);
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
    },
    [editor, title],
  );

  // A picked image shows at once (from Blueprint Studio), then becomes the site's own
  // optimised copy when the import finishes. Positions move while people type, so the
  // block is found again by a marker rather than its old position.
  const chooseImage = useCallback(
    async (pos: number, asset: LibraryAsset) => {
      if (!editor) return;
      const node = editor.state.doc.nodeAt(pos);
      if (node?.type.name !== "galleyBlock") return;
      const pending = crypto.randomUUID();
      const props = node.attrs.props as Record<string, unknown>;
      const alt = (props.alt as string) || altFrom(asset.prompt || title);
      editor.view.dispatch(
        editor.state.tr.setNodeMarkup(pos, undefined, {
          ...node.attrs,
          props: { ...props, src: asset.thumbnail || asset.url, alt, width: asset.width, height: asset.height },
          pending,
          isNew: null,
          ui: null,
        }),
      );
      const imported = await actions.importAsset({ url: asset.url, name: fileName(asset.prompt || title) });
      let at = -1;
      editor.state.doc.descendants((n, p) => {
        if (n.attrs.pending === pending) at = p;
        return at < 0;
      });
      if (at < 0) return;
      if (imported.error || !imported.path) {
        setSave({ kind: "error", result: { ok: false, error: imported.error ?? "The image couldn't be added" } });
        return;
      }
      const current = editor.state.doc.nodeAt(at)!;
      editor.view.dispatch(
        editor.state.tr.setNodeMarkup(at, undefined, {
          ...current.attrs,
          props: { ...(current.attrs.props as object), src: imported.path, width: imported.width, height: imported.height },
          pending: null,
        }),
      );
    },
    [editor, actions, title],
  );

  const setImage = useCallback(
    (pos: number, file: Uploaded) => {
      if (!editor) return;
      const node = editor.state.doc.nodeAt(pos);
      if (node?.type.name !== "galleyBlock") return;
      const props = node.attrs.props as Record<string, unknown>;
      editor.view.dispatch(
        editor.state.tr.setNodeMarkup(pos, undefined, {
          ...node.attrs,
          props: { ...props, src: file.path, alt: (props.alt as string) || altFromFile(file.name), width: file.width, height: file.height },
          isNew: null,
          ui: null,
        }),
      );
    },
    [editor],
  );

  const chooseFieldImage = useCallback(
    async (field: string, shape: ImageShape, asset: LibraryAsset) => {
      const current = frontmatterRef.current[field] as { alt?: string } | string | null | undefined;
      const alt = (typeof current === "object" && current?.alt) || altFrom(asset.prompt || title);
      setField(field, imageValue(shape, asset.thumbnail || asset.url, alt, asset.width, asset.height));
      const imported = await actions.importAsset({ url: asset.url, name: fileName(asset.prompt || title) });
      if (imported.path) setField(field, imageValue(shape, imported.path, alt, imported.width, imported.height));
    },
    [actions, title, setField],
  );

  const uploadedFieldImage = useCallback(
    (field: string, shape: ImageShape, file: Uploaded) => {
      const current = frontmatterRef.current[field] as { alt?: string } | string | null | undefined;
      const alt = (typeof current === "object" && current?.alt) || altFromFile(file.name);
      setField(field, imageValue(shape, file.path, alt, file.width, file.height));
    },
    [setField],
  );

  // Which panel a block shows lives on the block (never saved), so it follows the block
  // when things above it move. Only one image block is chosen for at a time.
  const fieldPickRef = useRef(fieldPick);
  const pickField = useCallback((next: { field: string; shape: ImageShape; label: string } | null) => {
    fieldPickRef.current = next;
    setFieldPick(next);
  }, []);
  const setUi = useCallback(
    (pos: number, ui: "edit" | "replace" | null) => {
      const node = editor?.state.doc.nodeAt(pos);
      if (!editor || !node) return;
      const tr = editor.state.tr;
      if (ui === "replace") {
        editor.state.doc.forEach((n, offset) => {
          if (offset !== pos && n.attrs.ui === "replace") tr.setNodeMarkup(offset, undefined, { ...n.attrs, ui: null });
        });
        fieldPickRef.current = null;
        setFieldPick(null);
        setTrying(null);
        setPickKey((k) => k + 1);
        setDrawer("image");
      }
      editor.view.dispatch(tr.setNodeMarkup(pos, undefined, { ...node.attrs, ui }).setMeta("galleyComment", true).setMeta("addToHistory", false));
    },
    [editor],
  );

  // ---- Choosing a picture, in the panel ----

  /** Where the image block being chosen for is: the one marked ui "replace". */
  const pickingBlock = useCallback((): number | null => {
    if (!editor) return null;
    const { doc } = editor.state;
    for (let i = 0, offset = 0; i < doc.childCount; offset += doc.child(i).nodeSize, i++) {
      const node = doc.child(i);
      if (node.type.name === "galleyBlock" && node.attrs.ui === "replace") return offset;
    }
    return null;
  }, [editor]);

  // The panel follows the document: a new image block (inserted marked "replace") opens
  // it, and keeping a picture, deleting the block or undoing closes it.
  const blockPicking = useRef(false);
  useEffect(() => {
    if (!editor) return;
    const sync = () => {
      const at = pickingBlock();
      const now = at !== null;
      if (now === blockPicking.current) return;
      blockPicking.current = now;
      if (now) {
        fieldPickRef.current = null;
        setFieldPick(null);
        setTrying(null);
        setPickKey((k) => k + 1);
        setDrawer("image");
        // Bring the picture into view beside the panel, once the page has made room for it.
        setTimeout(() => {
          const pos = pickingBlock();
          const dom = pos === null ? null : (editor.view.nodeDOM(pos) as HTMLElement | null);
          dom?.scrollIntoView({ block: "center", behavior: "smooth" });
        }, 260);
      } else if (!fieldPickRef.current) {
        setTrying(null);
        setDrawer((d) => (d === "image" ? null : d));
      }
    };
    editor.on("transaction", sync);
    return () => {
      editor.off("transaction", sync);
    };
  }, [editor, pickingBlock]);

  const pickFieldImage = useCallback(
    (field: string, shape: ImageShape, label: string) => {
      const at = pickingBlock();
      pickField({ field, shape, label });
      if (at !== null && editor) {
        const node = editor.state.doc.nodeAt(at)!;
        editor.view.dispatch(editor.state.tr.setNodeMarkup(at, undefined, { ...node.attrs, ui: null }).setMeta("galleyComment", true).setMeta("addToHistory", false));
      }
      setTrying(null);
      setPickKey((k) => k + 1);
      setDrawer("image");
    },
    [editor, pickingBlock, pickField],
  );

  const keepPicture = async (asset: LibraryAsset) => {
    setTrying(null);
    const field = fieldPickRef.current;
    if (field) {
      pickField(null);
      setDrawer(null);
      await chooseFieldImage(field.field, field.shape, asset);
      return;
    }
    const at = pickingBlock();
    if (at !== null) await chooseImage(at, asset);
  };

  const keepUpload = (file: Uploaded) => {
    setTrying(null);
    const field = fieldPickRef.current;
    if (field) {
      pickField(null);
      setDrawer(null);
      uploadedFieldImage(field.field, field.shape, file);
      return;
    }
    const at = pickingBlock();
    if (at !== null) setImage(at, file);
  };

  /** Close the panel without changing the picture. A new image block with none goes. */
  const closePicture = () => {
    setTrying(null);
    if (fieldPickRef.current) {
      pickField(null);
      setDrawer(null);
      return;
    }
    const at = pickingBlock();
    if (at === null || !editor) return setDrawer(null);
    const node = editor.state.doc.nodeAt(at)!;
    if ((node.attrs.props as { src?: string })?.src) setUi(at, null);
    else editor.view.dispatch(editor.state.tr.delete(at, at + node.nodeSize));
  };
  useEffect(() => {
    closePictureRef.current = closePicture;
  });
  useEffect(() => {
    if (drawer !== "image") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePictureRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawer]);

  const services = useMemo<Services>(
    () => ({ slug: post.slug, actions, components, chooseImage, setImage, contextFor, setUi, trying }),
    [post.slug, actions, components, chooseImage, setImage, contextFor, setUi, trying],
  );

  const session = useMemo<EditSession>(
    () => ({
      editor,
      components,
      frontmatter,
      setField,
      setProseClass: (className) => {
        if (proseClass.current === className) return;
        proseClass.current = className;
        if (editor && !editor.isDestroyed) {
          editor.view.dispatch(editor.state.tr.setMeta("galleyComment", true).setMeta("addToHistory", false));
        }
      },
      contextFor,
      pickFieldImage,
      tryingFor: (field) => (fieldPick?.field === field ? trying : null),
      insertAt,
      openInsert: setInsertAt,
      startComment,
      vocabulary,
      addTerm: actions.addTerm,
    }),
    [editor, components, frontmatter, setField, contextFor, pickFieldImage, fieldPick, trying, insertAt, startComment, vocabulary, actions.addTerm],
  );

  const fields = useMemo<Fields>(() => ({ values: frontmatter, setField }), [frontmatter, setField]);
  const openCount = comments.filter((c) => !c.resolved).length + (draft ? 1 : 0);
  const fieldContext: FieldContext = { vocabulary, addTerm: actions.addTerm, placeholders };
  const status = { saved: "Saved", dirty: "Saving…", saving: "Saving…", error: "Not saved" }[save.kind];

  return (
    <SessionContext.Provider value={session}>
      <FieldsContext.Provider value={fields}>
      <ServicesContext.Provider value={services}>
        <style>{EDITOR_CSS}</style>
        <div className={`gx-session${drawer ? " has-drawer" : ""}`}>{children}</div>

        <nav className="gx-rail" aria-label="Edit mode">
          <a className="gx-rail-btn" href={listUrl} aria-label="All posts" data-tip="All posts">
            <Icon name="back" />
          </a>
          <button
            type="button"
            className={`gx-rail-btn gx-rail-status is-${save.kind}`}
            aria-label={status}
            data-tip={save.kind === "saved" ? "Saved. Changes save as you type." : status}
            onClick={() => void saveNow()}
          >
            <i />
          </button>
          <span className="gx-rail-sep" />
          <button
            type="button"
            className="gx-rail-btn"
            aria-label="Add"
            data-tip="Add a block (or type / on an empty line)"
            onClick={(e) => {
              if (!editor) return;
              const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
              setInsertAt({ pos: blockEnd(editor), replace: false, left: Math.max(12, r.left - 316), top: r.top });
            }}
          >
            <Icon name="plus" />
          </button>
          {frontmatterSchema ? (
            <button
              type="button"
              className={`gx-rail-btn${drawer === "details" ? " is-on" : ""}`}
              aria-label="Details"
              data-tip="Details: search, filing, authors"
              onClick={() => {
                if (drawer !== "details") leavePicture();
                setDrawer((d) => (d === "details" ? null : "details"));
              }}
            >
              <Icon name="details" />
            </button>
          ) : null}
          <button
            type="button"
            className={`gx-rail-btn${commentsOpen ? " is-on" : ""}`}
            aria-label="Comments"
            data-tip="Comments"
            onClick={() => setCommentsOpen((o) => !o)}
          >
            <Icon name="comment" />
            {openCount ? <em className="gx-rail-count">{openCount}</em> : null}
          </button>
          <span className="gx-rail-sep" />
          <a className="gx-rail-btn gx-rail-done" href={viewUrl} aria-label="Done" data-tip="Done: see the post">
            <Icon name="check" />
          </a>
        </nav>

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

        {drawer === "image" ? (
          <aside className="gx-drawer" data-lenis-prevent>
            <header className="gx-drawer-head">
              <b className="gx-drawer-title">{fieldPick ? `Choose the ${fieldPick.label}` : "Choose a picture"}</b>
              <button type="button" className="gx-drawer-close" onClick={closePicture} aria-label="Close">
                ×
              </button>
            </header>
            <ImagePanel
              key={pickKey}
              actions={actions}
              context={contextFor(fieldPick ? null : pickingBlock())}
              trying={trying}
              onTry={setTrying}
              onKeep={(asset) => void keepPicture(asset)}
              onUploaded={keepUpload}
            />
          </aside>
        ) : null}

        {drawer === "details" && frontmatterSchema ? (
          <aside className="gx-drawer" data-lenis-prevent>
            <header className="gx-drawer-head">
              <b className="gx-drawer-title">Details</b>
              <button type="button" className="gx-drawer-close" onClick={() => setDrawer(null)} aria-label="Close">
                ×
              </button>
            </header>
            <div className="gx-details" onKeyDown={(e) => e.stopPropagation()}>
              <p className="gx-panel-help">What isn&apos;t on the page: how the post shows up in search and link previews, how it&apos;s filed, and who wrote it. Changes save as you go.</p>
              {Object.entries(frontmatterSchema.properties ?? {})
                .filter(([name]) => !inlineFields.includes(name))
                .map(([name, schema]) => (
                  <Field
                    key={name}
                    name={name}
                    schema={schema}
                    value={frontmatter[name]}
                    required={(frontmatterSchema.required ?? []).includes(name)}
                    context={fieldContext}
                    onChange={(value) => setField(name, value)}
                  />
                ))}
            </div>
          </aside>
        ) : null}

        {commentsOpen ? (
          <aside className="gx-drawer" data-lenis-prevent>
            <header className="gx-drawer-head">
              <b className="gx-drawer-title">Comments</b>
              <button type="button" className="gx-drawer-close" onClick={() => setCommentsOpen(false)} aria-label="Close">
                ×
              </button>
            </header>
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
          </aside>
        ) : null}
      </ServicesContext.Provider>
      </FieldsContext.Provider>
    </SessionContext.Provider>
  );
}
