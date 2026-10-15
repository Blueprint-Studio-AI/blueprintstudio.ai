"use client";

import { createContext, useContext } from "react";

/** The values the editable pieces on a page read and change: a post's front matter, or a page's settings. */
export interface Fields {
  values: Record<string, unknown>;
  setField(field: string, value: unknown): void;
  /** An earlier version, shown but not editable. */
  readOnly?: boolean;
}

export const FieldsContext = createContext<Fields | null>(null);

export function useFields(): Fields {
  const fields = useContext(FieldsContext);
  if (!fields) throw new Error("Galley: editable pieces go inside <EditSession> or <EditPage>");
  return fields;
}
