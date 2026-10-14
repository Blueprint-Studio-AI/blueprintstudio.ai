import type { Metadata } from "next";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { notFound } from "next/navigation";
import { buildManifest } from "@blueprint-studio/galley";
import { openPost, readComments } from "@blueprint-studio/galley/editor";
import { FsPostStore } from "@blueprint-studio/galley/ops";
import { GalleyEditor } from "@/components/galley-editor/editor";
import type { ManifestComponent } from "@/components/galley-editor/types";
import galley from "@/galley.config";
import {
  generateAction,
  importAssetAction,
  jobAction,
  libraryAction,
  renderBlockAction,
  saveCommentsAction,
  savePostAction,
  stylesAction,
} from "../actions";
import { editorEnabled } from "../enabled";

export const metadata: Metadata = { title: "Edit post", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

function whoAmI() {
  try {
    return execFileSync("git", ["config", "user.name"], { encoding: "utf8" }).trim() || "You";
  } catch {
    return "You";
  }
}

export default async function EditPost({ params }: { params: Promise<{ slug: string }> }) {
  if (!editorEnabled()) notFound();
  const { slug } = await params;
  const cwd = process.cwd();
  const post = await openPost(new FsPostStore(path.join(cwd, galley.postsDir)), slug);
  if (!post) notFound();
  return (
    <GalleyEditor
      post={post}
      initialComments={await readComments(cwd, slug)}
      components={JSON.parse(JSON.stringify(buildManifest(galley).components)) as ManifestComponent[]}
      author={whoAmI()}
      viewUrl={`/insights/${slug}`}
      listUrl="/galley/edit"
      summaryField="description"
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
    />
  );
}
