"use server";

import path from "node:path";
import {
  blueprintStudio,
  createPost,
  docToMdx,
  importMediaBytes,
  listVersions,
  readVersion,
  recordSave,
  savePost,
  writeComments,
  type Comment,
  type DocNode,
} from "@blueprint-studio/galley/editor";
import { importMedia } from "@blueprint-studio/galley/media";
import { FsPostStore, revisionOf, writePost } from "@blueprint-studio/galley/ops";
import { renderPost } from "@blueprint-studio/galley/render";
import { elements } from "@/components/galley/elements";
import galley from "@/galley.config";
import { editorEnabled } from "./enabled";
import { whoAmI } from "./who";

// What the post editor (/galley/edit) asks the server to do. Everything is checked by
// Galley before it touches a file; the Blueprint Studio key never leaves the server.

const cwd = process.cwd();
// Edit mode works on the files on disk, in development. The turbopackIgnore stops the build
// tracing that path, which would pack the whole project into this server function (past
// Vercel's 250 MB limit); deployed editing goes through GitHub instead.
const store = () => new FsPostStore(path.join(/*turbopackIgnore: true*/ cwd, galley.postsDir));

function guard() {
  if (!editorEnabled()) throw new Error("The editor is off on this deployment");
}

function studio() {
  const apiKey = process.env.BLUEPRINT_API_KEY;
  if (!apiKey) throw new Error("Add BLUEPRINT_API_KEY (a Blueprint Studio API key for this brand) to .env.local");
  return blueprintStudio({ apiKey });
}

const failure = (error: unknown) => ({ error: error instanceof Error ? error.message : String(error) });

export async function savePostAction(
  slug: string,
  input: { doc: DocNode; frontmatter: Record<string, unknown>; revision: string | null },
) {
  guard();
  const before = await store().read(slug);
  const result = await savePost(galley, store(), slug, input, { message: `Edit ${slug} in the editor` });
  if (!result.ok) return result;
  const after = await store().read(slug);
  if (after !== null) await recordSave(cwd, `posts/${slug}`, { before, after, author: whoAmI() });
  return { ok: true as const, revision: result.revision };
}

/**
 * A new post from its title, as a draft (not on Insights until it's published), dated
 * today, with a description to replace. Edit mode opens it.
 */
export async function createPostAction(title: string) {
  guard();
  const made = await createPost(galley, store(), {
    title,
    frontmatter: { date: new Date().toLocaleDateString("en-CA"), draft: true },
  });
  if (!made.ok) return { error: made.error };
  const source = await store().read(made.slug);
  if (source !== null) await recordSave(cwd, `posts/${made.slug}`, { before: null, after: source, author: whoAmI() });
  return { href: `/insights/${made.slug}/edit` };
}

/** The post's versions, newest first. */
export async function versionsAction(slug: string) {
  guard();
  return listVersions(cwd, `posts/${slug}`);
}

/** Make an earlier version the post again (it's checked like any save, and becomes the newest version). */
export async function restoreAction(slug: string, id: string) {
  guard();
  const version = await readVersion(cwd, `posts/${slug}`, id);
  if (!version) return { error: "That version isn't kept any more" };
  const before = await store().read(slug);
  const written = await writePost(galley, store(), slug, version.source, before === null ? null : revisionOf(before), { message: `Restore ${slug} to a version` });
  if (!written.ok) return { error: written.error };
  await recordSave(cwd, `posts/${slug}`, { before, after: version.source, author: whoAmI() });
  return { ok: true as const };
}

export async function saveCommentsAction(slug: string, comments: Comment[]) {
  guard();
  await writeComments(cwd, slug, comments);
}

/** A component rendered by the site itself, for the editor's preview of it. */
export async function renderBlockAction(attrs: { name: string; props: Record<string, unknown>; body: string | null }) {
  guard();
  const component = galley.registry[attrs.name];
  if (!component) return { error: `${attrs.name} isn't a component on this site` };
  const checked = component.props.strict().safeParse(attrs.props);
  if (!checked.success) {
    return { error: checked.error.issues.map((i) => `${i.path.join(".") || "props"}: ${i.message}`).join("; ") };
  }
  try {
    const mdx = docToMdx({ type: "doc", content: [{ type: "galleyBlock", attrs: { ...attrs } }] });
    return { node: renderPost(mdx, galley, { elements }) };
  } catch (error) {
    return failure(error);
  }
}

export async function libraryAction({ offset = 0 }: { offset?: number }) {
  guard();
  try {
    return await studio().library({ offset, limit: 40 });
  } catch (error) {
    return failure(error);
  }
}

export async function stylesAction() {
  guard();
  try {
    return { styles: await studio().styles() };
  } catch (error) {
    return failure(error);
  }
}

export async function generateAction(input: { prompt: string; styleId?: string; aspectRatio?: string }) {
  guard();
  try {
    return await studio().generate(input);
  } catch (error) {
    return failure(error);
  }
}

export async function jobAction(jobId: string) {
  guard();
  try {
    return await studio().job(jobId, 20);
  } catch (error) {
    return { status: "failed" as const, error: failure(error).error };
  }
}

/** Copies an image into the site's media folder as optimised WebP. */
export async function importAssetAction({ url, name }: { url: string; name?: string }) {
  guard();
  if (!/^https:\/\//.test(url)) return { error: "Only https images can be added" };
  try {
    const media = await importMedia(galley, cwd, { url, name });
    return { path: media.path, width: media.width, height: media.height };
  } catch (error) {
    return failure(error);
  }
}

/** A file from the person's computer, saved with the site as optimised WebP. */
export async function uploadAction(form: FormData) {
  guard();
  const file = form.get("file");
  if (!(file instanceof File)) return { error: "No file" };
  if (file.size > 20 * 1024 * 1024) return { error: "That file is over 20 MB" };
  try {
    const media = await importMediaBytes(galley, cwd, { bytes: Buffer.from(await file.arrayBuffer()), type: file.type, name: file.name });
    return { path: media.path, width: media.width, height: media.height };
  } catch (error) {
    return failure(error);
  }
}
