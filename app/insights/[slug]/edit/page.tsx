import type { Metadata } from "next";
import path from "node:path";
import { notFound } from "next/navigation";
import { buildManifest, splitFrontmatter } from "@blueprint-studio/galley";
import { mdxToDoc, openPost, readComments, readVersion } from "@blueprint-studio/galley/editor";
import { DraftPostStore } from "@blueprint-studio/galley/drafts";
import { FsPostStore } from "@blueprint-studio/galley/ops";
import { outline } from "@blueprint-studio/galley/render";
import BlogPost from "@/components/Blog/BlogPost";
import { EditableBody } from "@blueprint-studio/galley/editor-ui";
import { EditSession } from "@blueprint-studio/galley/editor-ui";
import type { JsonSchema, ManifestComponent } from "@blueprint-studio/galley/editor-ui";
import galley from "@/galley.config";
import { getPostBySlug } from "@/lib/blog";
import {
  discardPostAction,
  generateAction,
  importAssetAction,
  jobAction,
  libraryAction,
  publishPostAction,
  renderBlockAction,
  restoreAction,
  saveCommentsAction,
  savePostAction,
  siteLibraryAction,
  stylesAction,
  unpublishPostAction,
  uploadAction,
  versionsAction,
} from "../../edit/actions";
import { editorEnabled } from "../../edit/enabled";
import { whoAmI } from "../../edit/who";

// A post in edit mode: the same page as /insights/<slug>, with the title, summary, hero
// and body editable in place. ?version=<id> shows an earlier version, read-only, to restore.

export const metadata: Metadata = { title: "Editing", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ version?: string }> };

export default async function EditInsight({ params, searchParams }: Props) {
  if (!editorEnabled()) notFound();
  const [{ slug }, { version: versionId }] = await Promise.all([params, searchParams]);
  const manifest = buildManifest(galley);
  const cwd = process.cwd();
  const post = getPostBySlug(slug);
  // What edit mode has: the post's draft, if its changes aren't on Insights yet.
  const store = new DraftPostStore(new FsPostStore(path.join(/*turbopackIgnore: true*/ cwd, galley.postsDir)), cwd, {
    draftField: galley.publish?.draftField ?? "draft",
    dateField: galley.publish?.dateField,
  });
  const current = await openPost(store, slug, galley);
  if (!post || !current) notFound();
  // An earlier version: its front matter and body, in place of the current ones.
  const version = versionId ? await readVersion(cwd, `posts/${slug}`, versionId) : null;
  const motion = galley.components.filter((c) => c.motion === "block").map((c) => c.name);
  const editing = version
    ? (() => {
        const { data, body } = splitFrontmatter(version.source);
        return { ...current, frontmatter: (data ?? {}) as Record<string, unknown>, doc: mdxToDoc(body, { motion }) };
      })()
    : current;
  const { content, ...meta } = post;
  return (
    <EditSession
      post={editing}
      initialComments={await readComments(cwd, slug)}
      components={JSON.parse(JSON.stringify(manifest.components)) as ManifestComponent[]}
      frontmatterSchema={JSON.parse(JSON.stringify(manifest.frontmatter)) as JsonSchema}
      inlineFields={["title", "description", "image"]}
      fallbacks={{ ogImage: ["image"] }}
      sharing={{ url: `blueprintstudio.ai/insights/${slug}`, title: ["title"], description: ["description"], image: ["ogImage", "image"] }}
      version={version ? { id: version.id, at: version.at, author: version.author, note: version.note } : undefined}
      publish={{ field: "draft", dateField: "date" }}
      author={whoAmI()}
      viewUrl={`/insights/${slug}`}
      listUrl="/insights/edit"
      actions={{
        save: savePostAction,
        saveComments: saveCommentsAction,
        renderBlock: renderBlockAction,
        library: libraryAction,
        styles: stylesAction,
        generate: generateAction,
        job: jobAction,
        importAsset: importAssetAction,
        upload: uploadAction,
        versions: versionsAction,
        restore: restoreAction,
        publish: publishPostAction,
        unpublish: unpublishPostAction,
        discard: discardPostAction,
        siteLibrary: siteLibraryAction,
      }}
    >
      <BlogPost
        post={meta}
        edit
        body={<EditableBody className="bp-prose" />}
        toc={outline(content)
          .filter((h) => h.depth === 2)
          .map(({ text, id }) => ({ text, id }))}
      />
    </EditSession>
  );
}
