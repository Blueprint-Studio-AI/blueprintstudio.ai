import type { Node as PMNode } from "@tiptap/pm/model";

// Comments are anchored by their text, not editor positions, so they survive edits made
// anywhere (by people, agents or a text editor) and live outside the post's MDX.

type Segment = { from: number; text: string; start: number };

/** The document's text, one textblock per line, with a map back to editor positions. */
export function textIndex(doc: PMNode) {
  const segments: Segment[] = [];
  let text = "";
  doc.descendants((node, pos) => {
    if (node.isTextblock) {
      if (text) text += "\n";
      node.forEach((child, offset) => {
        if (child.isText) {
          segments.push({ from: pos + 1 + offset, text: child.text ?? "", start: text.length });
          text += child.text ?? "";
        }
      });
      return false;
    }
    return true;
  });
  const toPos = (index: number) => {
    for (const s of segments) if (index >= s.start && index <= s.start + s.text.length) return s.from + (index - s.start);
    return null;
  };
  const toIndex = (pos: number) => {
    for (const s of segments) if (pos >= s.from && pos <= s.from + s.text.length) return s.start + (pos - s.from);
    return null;
  };
  return { text, toPos, toIndex };
}

export function anchorOf(doc: PMNode, from: number, to: number) {
  const { text, toIndex } = textIndex(doc);
  const a = toIndex(from);
  const b = toIndex(to);
  if (a === null || b === null) return null;
  return { quote: text.slice(a, b), prefix: text.slice(Math.max(0, a - 32), a), suffix: text.slice(b, b + 32) };
}

/** Where a comment's passage is now: the occurrence whose surroundings match best. */
export function findAnchor(doc: PMNode, anchor: { quote: string; prefix: string; suffix: string }) {
  if (!anchor.quote) return null;
  const { text, toPos } = textIndex(doc);
  let best: { index: number; score: number } | null = null;
  for (let i = text.indexOf(anchor.quote); i !== -1; i = text.indexOf(anchor.quote, i + 1)) {
    let score = 0;
    const before = text.slice(Math.max(0, i - anchor.prefix.length), i);
    const after = text.slice(i + anchor.quote.length, i + anchor.quote.length + anchor.suffix.length);
    for (let k = 1; k <= before.length && before[before.length - k] === anchor.prefix[anchor.prefix.length - k]; k++) score++;
    for (let k = 0; k < after.length && after[k] === anchor.suffix[k]; k++) score++;
    if (!best || score > best.score) best = { index: i, score };
  }
  if (!best) return null;
  const from = toPos(best.index);
  const to = toPos(best.index + anchor.quote.length);
  return from === null || to === null ? null : { from, to };
}
