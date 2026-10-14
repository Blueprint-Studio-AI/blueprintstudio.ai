import type { Metadata } from "next";
import path from "node:path";
import { notFound } from "next/navigation";
import { FsPostStore, listPosts } from "@blueprint-studio/galley/ops";
import { PostList } from "@/components/galley-editor/post-list";
import galley from "@/galley.config";
import { editorEnabled } from "./enabled";

export const metadata: Metadata = { title: "Edit Insights", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function EditorHome() {
  if (!editorEnabled()) notFound();
  const posts = await listPosts(galley, new FsPostStore(path.join(process.cwd(), galley.postsDir)));
  return <PostList title="Insights posts" posts={posts} editUrl={(slug) => `/galley/edit/${slug}`} />;
}
