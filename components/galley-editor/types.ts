import type { Comment, DocNode, EditorPost, GenerationJob, LibraryAsset, LibraryStyle } from "@blueprint-studio/galley/editor";

export type { Comment, DocNode, EditorPost, GenerationJob, LibraryAsset, LibraryStyle };

type JsonSchema = {
  type?: string;
  enum?: unknown[];
  description?: string;
  properties?: Record<string, JsonSchema>;
  required?: string[];
  items?: JsonSchema;
  anyOf?: JsonSchema[];
  format?: string;
};
export type { JsonSchema };

/** A component from the site's manifest: what the editor can insert and how to fill it in. */
export interface ManifestComponent {
  name: string;
  kind: "flow" | "text";
  children: "none" | "inline" | "blocks";
  description: string;
  props: JsonSchema;
  examples?: { title?: string; props: Record<string, unknown>; children?: string }[];
}

export interface BlockAttrs {
  name: string;
  props: Record<string, unknown>;
  body: string | null;
}

export type SaveResult =
  | { ok: true; revision: string }
  | { ok: false; error: string; errors?: { line: number; column: number; message: string }[] };

/** What the editor asks the site's server to do. Each is a server action. */
export interface EditorActions {
  save(slug: string, input: { doc: DocNode; frontmatter: Record<string, unknown>; revision: string | null }): Promise<SaveResult>;
  saveComments(slug: string, comments: Comment[]): Promise<void>;
  renderBlock(attrs: BlockAttrs): Promise<{ node?: React.ReactNode; error?: string }>;
  library(input: { offset?: number }): Promise<{ assets?: LibraryAsset[]; total?: number; error?: string }>;
  styles(): Promise<{ styles?: LibraryStyle[]; error?: string }>;
  generate(input: { prompt: string; styleId?: string; aspectRatio?: string }): Promise<{ jobId?: string; error?: string }>;
  job(jobId: string): Promise<GenerationJob | { status: "failed"; error: string }>;
  importAsset(input: { url: string; name?: string }): Promise<{ path?: string; width?: number; height?: number; error?: string }>;
}
