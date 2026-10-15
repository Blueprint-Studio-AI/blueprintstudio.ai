import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts } from "@/lib/blog";
import BlogIndex from "@/components/Blog/BlogIndex";
import { EditPage } from "@blueprint-studio/galley/editor-ui";
import { editorEnabled } from "./enabled";

// Insights in edit mode: the same page as /insights, where any post opens in edit mode.

export const metadata: Metadata = { title: "Edit Insights", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default function EditInsights() {
  if (!editorEnabled()) notFound();
  return (
    <EditPage viewUrl="/insights">
      <BlogIndex posts={getAllPosts()} edit />
    </EditPage>
  );
}
