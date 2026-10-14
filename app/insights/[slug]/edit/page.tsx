import type { Metadata } from "next";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { notFound } from "next/navigation";
import { buildManifest } from "@blueprint-studio/galley";
import { openPost, readComments } from "@blueprint-studio/galley/editor";
import { FsPostStore } from "@blueprint-studio/galley/ops";
import { outline } from "@blueprint-studio/galley/render";
import BlogPost from "@/components/Blog/BlogPost";
import { EditableBody } from "@/components/galley-editor/editable";
import { EditSession } from "@/components/galley-editor/session";
import type { ManifestComponent } from "@/components/galley-editor/types";
import galley from "@/galley.config";
import { getPostBySlug } from "@/lib/blog";
import {
  generateAction,
  importAssetAction,
  jobAction,
  libraryAction,
  renderBlockAction,
  saveCommentsAction,
  savePostAction,
  stylesAction,
} from "../../edit/actions";
import { editorEnabled } from "../../edit/enabled";

// A post in edit mode: the same page as /insights/<slug>, with the title, summary, hero
// and body editable in place.

export const metadata: Metadata = { title: "Editing", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

function whoAmI() {
  try {
    return execFileSync("git", ["config", "user.name"], { encoding: "utf8" }).trim() || "You";
  } catch {
    return "You";
  }
}

export default async function EditInsight({ params }: { params: Promise<{ slug: string }> }) {
  if (!editorEnabled()) notFound();
  const { slug } = await params;
  const cwd = process.cwd();
  const post = getPostBySlug(slug);
  const editing = await openPost(new FsPostStore(path.join(cwd, galley.postsDir)), slug);
  if (!post || !editing) notFound();
  const { content, ...meta } = post;
  return (
    <EditSession
      post={editing}
      initialComments={await readComments(cwd, slug)}
      components={JSON.parse(JSON.stringify(buildManifest(galley).components)) as ManifestComponent[]}
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
