"use server";

import path from "node:path";
import {
  blueprintStudio,
  createPost,
  docToMdx,
  importMediaBytes,
  duplicatePost,
  listVersions,
  publishPost,
  readVersion,
  recordSave,
  savePost,
  unpublishPost,
  writeComments,
  type Comment,
  type DocNode,
} from "@blueprint-studio/galley/editor";
import { importMedia } from "@blueprint-studio/galley/media";
import { DraftPostStore, readDraft } from "@blueprint-studio/galley/drafts";
import { discardPage, openPage, publishPage, readPage, renderSection, savePageDraft, validatePage, type PageSection } from "@blueprint-studio/galley/pages";
import { createRequest, type RequestKind } from "@blueprint-studio/galley/requests";
import { buildLibrary } from "@blueprint-studio/galley/library";
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
// Vercel's 250 MB limit); deployed editing goes through GitHub instead. Changes to a post
// that's on Insights wait in .galley/drafts/ until it's published.
const store = () =>
  new DraftPostStore(
    new FsPostStore(path.join(/*turbopackIgnore: true*/ cwd, galley.postsDir)),
    cwd,
    { draftField: galley.publish?.draftField ?? "draft", dateField: galley.publish?.dateField },
    galley,
  );

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
  return { ok: true as const, revision: result.revision, state: result.state };
}

/** Put the post on Insights as it is in edit mode (dated today if it's never been published), noted in its history. */
export async function publishPostAction(slug: string) {
  guard();
  return publishPost(store(), slug, { author: whoAmI() });
}

/** Take the post off Insights. It stays here as a draft. */
export async function unpublishPostAction(slug: string) {
  guard();
  return unpublishPost(store(), slug, { author: whoAmI() });
}

/** Throw away the post's changes that aren't on Insights. */
export async function discardPostAction(slug: string) {
  guard();
  await store().discard(slug);
  return { ok: true as const, state: await store().state(slug) };
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

/** Everything a post can use (Insights' blocks and media), for edit mode's Library. */
export async function siteLibraryAction() {
  guard();
  try {
    const { items } = await buildLibrary(galley, cwd);
    return { items };
  } catch (error) {
    return failure(error);
  }
}

// ---- The Insights page (/insights/edit), built from sections ----

const PAGE = "insights";
const PAGE_FILE = galley.pages![PAGE];
/** The page as edit mode has it: its draft, else what's on Insights. */
const pageText = async () => (await readDraft(cwd, `pages/${PAGE}`)) ?? (await readPage(cwd, PAGE_FILE)).text;

/** The page's sections, checked and saved as its draft if it hasn't changed since `revision`. */
export async function savePageAction(page: { settings?: Record<string, unknown>; sections: PageSection[] }, revision: string) {
  guard();
  const before = await pageText().catch(() => null);
  const saved = await savePageDraft(cwd, PAGE, PAGE_FILE, page, revision, galley.sections ?? []);
  if (!saved.ok) return { ok: false as const, error: saved.error };
  await recordSave(cwd, `pages/${PAGE}`, { before, after: await pageText(), author: whoAmI() });
  return saved;
}

export async function publishPageAction() {
  guard();
  const done = await publishPage(cwd, PAGE, PAGE_FILE, galley.sections ?? []);
  return done.ok ? { ok: true as const, state: "published" as const } : done;
}

export async function discardPageAction() {
  guard();
  await discardPage(cwd, PAGE);
  return { ok: true as const, state: "published" as const };
}

export async function pageVersionsAction() {
  guard();
  return listVersions(cwd, `pages/${PAGE}`);
}

export async function restorePageAction(id: string) {
  guard();
  const version = await readVersion(cwd, `pages/${PAGE}`, id);
  if (!version) return { error: "That version isn't kept any more" };
  const before = await pageText();
  const current = await openPage(cwd, PAGE, PAGE_FILE);
  const saved = await savePageDraft(cwd, PAGE, PAGE_FILE, JSON.parse(version.source), current.revision, galley.sections ?? []);
  if (!saved.ok) return { error: saved.error };
  await recordSave(cwd, `pages/${PAGE}`, { before, after: version.source, author: whoAmI() });
  return { ok: true as const };
}

/** One section of the page, rendered by the site for edit mode (with the sections above it, for what they show). */
export async function renderSectionAction(page: { sections: PageSection[] }, index: number) {
  guard();
  const sections = galley.sections ?? [];
  const clean: PageSection[] = [];
  for (const [i, entry] of page.sections.entries()) {
    const one = validatePage({ sections: [entry] }, sections);
    if (one.ok) clean.push(one.page.sections[0]);
    else if (i === index) return { error: one.errors.map((e) => `${e.path.replace(/^props\./, "")}: ${e.message}`).join("; ") };
  }
  try {
    const at = clean.findIndex((s) => s.id === page.sections[index]?.id);
    return { node: await renderSection({ sections: clean }, at, sections, { params: {}, path: "/insights", edit: true }) };
  } catch (error) {
    return failure(error);
  }
}

/** Ask Blueprint's design agent for something Insights doesn't have, as whoever's editing. */
export async function requestDesignAction(input: { kind: RequestKind; title: string; description: string; examples: string[]; references: string[] }) {
  guard();
  return createRequest(cwd, input, whoAmI());
}

// ---- All posts ----

export async function postRowsAction() {
  guard();
  return store().rows();
}

export async function duplicatePostAction(slug: string) {
  guard();
  const made = await duplicatePost(galley, store(), slug);
  if (!made.ok) return { error: made.error };
  const source = await store().read(made.slug);
  if (source !== null) await recordSave(cwd, `posts/${made.slug}`, { before: null, after: source, author: whoAmI() });
  return { slug: made.slug };
}

export async function trashPostAction(slug: string) {
  guard();
  return store().trash(slug);
}

export async function untrashPostAction(id: string) {
  guard();
  return store().untrash(id);
}
