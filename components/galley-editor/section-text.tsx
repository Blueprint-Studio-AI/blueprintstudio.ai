"use client";

import { createContext, useContext, useEffect, useRef } from "react";

// Words inside a page section, edited where they show. In edit mode a section renders
// <SectionText prop="title" value={title} /> where its words go; the page editor wraps each
// section in a SectionScope, which says whose setting the words change. Anywhere else it's
// just the words.

export type SectionScopeValue = { set(prop: string, value: string): void };

export const SectionScope = createContext<SectionScopeValue | null>(null);

export function SectionText({
  prop,
  value,
  multiline = false,
  placeholder,
  className = "",
}: {
  prop: string;
  value: string;
  /** Keeps line breaks; Enter adds one. */
  multiline?: boolean;
  placeholder?: string;
  className?: string;
}) {
  const scope = useContext(SectionScope);
  const ref = useRef<HTMLSpanElement>(null);
  const initial = useRef(value);
  useEffect(() => {
    if (ref.current) ref.current.textContent = initial.current;
  }, []);
  // Changed in the settings panel: show it, unless it's being typed here.
  useEffect(() => {
    const el = ref.current;
    if (el && document.activeElement !== el && el.textContent !== value) el.textContent = value;
  }, [value]);
  if (!scope) return <>{value}</>;
  const read = (el: HTMLElement) =>
    multiline
      ? el.innerText.replace(/[ \t]+/g, " ").replace(/ ?\n ?/g, "\n").replace(/\n{2,}/g, "\n").trim()
      : (el.textContent ?? "").replace(/\s+/g, " ").trim();
  return (
    <span
      ref={ref}
      className={`gx-editable${multiline ? " gx-multiline" : ""} ${className}`}
      contentEditable="plaintext-only"
      suppressContentEditableWarning
      data-placeholder={placeholder}
      spellCheck
      onInput={(e) => scope.set(prop, read(e.currentTarget))}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !multiline) {
          e.preventDefault();
          e.currentTarget.blur();
        }
      }}
    />
  );
}
