import type { Comment, DocNode, EditorPost, GenerationJob, LibraryAsset, LibraryStyle } from "@blueprint-studio/galley/editor";

export type { Comment, DocNode, EditorPost, GenerationJob, LibraryAsset, LibraryStyle };

type JsonSchema = {
  type?: string;
  default?: unknown;
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
  /** Where the insert menu lists it, e.g. "Media". */
  category?: string;
  /** "image": its picture is chosen in the block, from the library, generated or uploaded. */
  picker?: "image";
  /** An animation: "block" is a setting on any block, "number" animates a number in a sentence. */
  motion?: "block" | "number";
  props: JsonSchema;
  examples?: { title?: string; props: Record<string, unknown>; children?: string }[];
}

/** A term from the site's vocabulary: a category, type, topic or series. */
export type Term = { slug: string; name: string; description?: string };
/** Vocabulary by front matter path ("category", "topics", "series.slug"), with the kind to add new terms to. */
export type Vocabulary = Record<string, { kind: string; terms: Term[] }>;

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
  /** Add a term to the site's vocabulary (sites that have one). */
  addTerm?(kind: string, name: string): Promise<Term | { error: string }>;
  /** A file from the person's computer, as FormData with "file". */
  upload(form: FormData): Promise<{ path?: string; width?: number; height?: number; error?: string }>;
}
