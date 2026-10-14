"use client";

import type { Editor as TiptapEditor } from "@tiptap/react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { InsertAt } from "./session";
import type { ManifestComponent } from "./types";

// Adding something to the post, where it goes: a "+" beside a block, "/" on an empty line,
// or "+ Add" in the bar. One list, grouped by what it is: text, then the site's own
// components by category. Animations aren't here: they're a setting on any block.

type Item = { key: string; label: string; hint: string; group: string; run(editor: TiptapEditor, at: InsertAt): void };

const textItems: Item[] = [
  { key: "h2", label: "Heading", hint: "A section title", group: "Text", run: (e, at) => block(e, at, { type: "heading", attrs: { level: 2 } }) },
  { key: "h3", label: "Subheading", hint: "A smaller title", group: "Text", run: (e, at) => block(e, at, { type: "heading", attrs: { level: 3 } }) },
  { key: "ul", label: "Bulleted list", hint: "Points in any order", group: "Text", run: (e, at) => block(e, at, { type: "bulletList", content: [{ type: "listItem", content: [{ type: "paragraph" }] }] }) },
  { key: "ol", label: "Numbered list", hint: "Steps in order", group: "Text", run: (e, at) => block(e, at, { type: "orderedList", content: [{ type: "listItem", content: [{ type: "paragraph" }] }] }) },
  { key: "quote", label: "Quote", hint: "A pull quote", group: "Text", run: (e, at) => block(e, at, { type: "blockquote", content: [{ type: "paragraph" }] }) },
  { key: "hr", label: "Divider", hint: "A line between sections", group: "Text", run: (e, at) => block(e, at, { type: "horizontalRule" }) },
];

/** Put a node at the menu's spot, replacing the empty line it was opened on, and put the cursor in it. */
function block(editor: TiptapEditor, at: InsertAt, node: Record<string, unknown>) {
  const target = at.replace ? { from: at.pos, to: at.pos + (editor.state.doc.nodeAt(at.pos)?.nodeSize ?? 0) } : at.pos;
  editor.chain().focus().insertContentAt(target, node).run();
  const inside = Math.min(at.pos + 2, editor.state.doc.content.size);
  editor.commands.setTextSelection(inside);
}

export function InsertMenu({
  editor,
  at,
  components,
  onClose,
}: {
  editor: TiptapEditor;
  at: InsertAt;
  components: ManifestComponent[];
  onClose(): void;
}) {
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const items = useMemo(() => {
    const own: Item[] = components
      .filter((c) => !c.motion && c.kind === "flow")
      .map((c) => ({
        key: c.name,
        label: c.name.replace(/([a-z])([A-Z])/g, "$1 $2"),
        hint: c.description.split(/(?<=\.)\s/)[0],
        group: c.category ?? "Components",
        run: (e: TiptapEditor, where: InsertAt) => {
          const example = c.examples?.[0];
          const fresh = c.picker === "image";
          block(e, where, {
            type: "galleyBlock",
            attrs: { name: c.name, props: fresh ? {} : (example?.props ?? {}), body: fresh ? null : (example?.children ?? null), isNew: true },
          });
        },
      }));
    const all = [...own, ...textItems];
    const q = query.trim().toLowerCase();
    return q ? all.filter((i) => `${i.label} ${i.group} ${i.hint}`.toLowerCase().includes(q)) : all;
  }, [components, query]);

  const groups = useMemo(() => {
    const map = new Map<string, Item[]>();
    for (const item of items) map.set(item.group, [...(map.get(item.group) ?? []), item]);
    return [...map];
  }, [items]);

  const choose = (item: Item | undefined) => {
    if (!item) return;
    onClose();
    item.run(editor, at);
  };

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [onClose]);

  const top = Math.min(at.top, window.innerHeight - 420);
  let flat = -1;
  return (
    <div className="gx-insert" ref={ref} style={{ left: Math.max(12, at.left - 8), top: Math.max(12, top) }} data-lenis-prevent>
      <input
        autoFocus
        className="gx-insert-search"
        placeholder="Add… (image, heading, quote)"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIndex(0);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setIndex((i) => Math.min(i + 1, items.length - 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setIndex((i) => Math.max(i - 1, 0));
          } else if (e.key === "Enter") {
            e.preventDefault();
            choose(groups.flatMap(([, list]) => list)[index]);
          } else if (e.key === "Escape") {
            onClose();
            editor.commands.focus();
          }
        }}
      />
      <div className="gx-insert-list">
        {groups.map(([group, list]) => (
          <div key={group}>
            <p className="gx-insert-group">{group}</p>
            {list.map((item) => {
              flat++;
              const on = flat === index;
              return (
                <button key={item.key} type="button" className={`gx-insert-item${on ? " is-on" : ""}`} onMouseDown={(e) => e.preventDefault()} onClick={() => choose(item)}>
                  <b>{item.label}</b>
                  <span>{item.hint}</span>
                </button>
              );
            })}
          </div>
        ))}
        {!items.length ? <p className="gx-empty">Nothing called that. Try image, quote or heading.</p> : null}
      </div>
    </div>
  );
}
