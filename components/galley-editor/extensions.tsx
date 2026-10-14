import { Extension, Mark, Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extensions";
import { BlockView, InlineView, RawView } from "./block-view";

// The editor's schema. Node and mark names match Galley's document format
// (@blueprint-studio/galley/editor), so what the editor holds is exactly what the server
// turns back into MDX. Attributes that only matter for writing a post back unchanged
// (source, spread) are kept but never rendered.

const hidden = (fallback: unknown = null) => ({ default: fallback, rendered: false, keepOnSplit: false });

const GalleyAttributes = Extension.create({
  name: "galleyAttributes",
  addGlobalAttributes() {
    return [
      { types: ["paragraph", "heading"], attributes: { source: hidden() } },
      { types: ["bulletList", "orderedList", "listItem"], attributes: { spread: hidden(false) } },
    ];
  },
});

const componentAttributes = () => ({
  name: { default: "", parseHTML: (el: HTMLElement) => el.getAttribute("data-name"), renderHTML: (a: { name: string }) => ({ "data-name": a.name }) },
  props: hidden({}),
  body: hidden(),
  source: hidden(),
  /** Set on a block just inserted, so its form opens; never saved. */
  isNew: hidden(),
  /** Marks an image still being copied into the site; never saved. */
  pending: hidden(),
});

/** A site component on its own line: rendered for real, edited with a form. */
export const GalleyBlock = Node.create({
  name: "galleyBlock",
  group: "block",
  atom: true,
  draggable: true,
  selectable: true,
  addAttributes: componentAttributes,
  parseHTML: () => [{ tag: "galley-block" }],
  renderHTML: ({ HTMLAttributes }) => ["galley-block", mergeAttributes(HTMLAttributes)],
  addNodeView: () => ReactNodeViewRenderer(BlockView),
});

/** A component inside a sentence, such as a number that counts up. */
export const GalleyInline = Node.create({
  name: "galleyInline",
  group: "inline",
  inline: true,
  atom: true,
  selectable: true,
  addAttributes: componentAttributes,
  parseHTML: () => [{ tag: "galley-inline" }],
  renderHTML: ({ HTMLAttributes }) => ["galley-inline", mergeAttributes(HTMLAttributes)],
  addNodeView: () => ReactNodeViewRenderer(InlineView),
});

/** MDX the editor shows as source: tables, footnotes, Markdown pictures. Kept exactly. */
export const RawBlock = Node.create({
  name: "rawBlock",
  group: "block",
  atom: true,
  draggable: true,
  addAttributes: () => ({ mdx: hidden("") }),
  parseHTML: () => [{ tag: "galley-raw" }],
  renderHTML: ({ HTMLAttributes }) => ["galley-raw", mergeAttributes(HTMLAttributes)],
  addNodeView: () => ReactNodeViewRenderer(RawView),
});

export const RawInline = Node.create({
  name: "rawInline",
  group: "inline",
  inline: true,
  atom: true,
  addAttributes: () => ({ mdx: hidden("") }),
  parseHTML: () => [{ tag: "galley-raw-inline" }],
  renderHTML: ({ node }) => ["code", { class: "gx-raw-inline" }, String(node.attrs.mdx)],
});

/** A comment's highlight. Never saved into the post: comments live beside it. */
export const CommentMark = Mark.create({
  name: "comment",
  inclusive: false,
  excludes: "",
  addAttributes: () => ({
    id: { default: null, parseHTML: (el: HTMLElement) => el.getAttribute("data-comment"), renderHTML: (a: { id: string }) => ({ "data-comment": a.id }) },
  }),
  parseHTML: () => [{ tag: "span[data-comment]" }],
  renderHTML: ({ HTMLAttributes }) => ["span", mergeAttributes(HTMLAttributes, { class: "gx-comment" }), 0],
});

export const extensions = [
  StarterKit.configure({
    underline: false,
    link: { openOnClick: false, autolink: true, HTMLAttributes: { target: null, rel: null } },
  }),
  Placeholder.configure({ placeholder: "Write, or drop an image here…" }),
  GalleyAttributes,
  GalleyBlock,
  GalleyInline,
  RawBlock,
  RawInline,
  CommentMark,
];
