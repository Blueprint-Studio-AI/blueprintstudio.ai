import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts } from "@/lib/blog";
import { editorEnabled } from "./enabled";

// Every Insights post, to open in edit mode.

export const metadata: Metadata = { title: "Edit Insights", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default function EditInsights() {
  if (!editorEnabled()) notFound();
  const posts = getAllPosts();
  return (
    <main className="min-h-screen bg-neutral-50 px-4 pb-24 pt-32 sm:px-6">
      <div className="mx-auto flex max-w-3xl flex-col gap-8">
        <header className="flex flex-col gap-3">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">Insights · Edit</p>
          <h1 className="text-[clamp(32px,6vw,52px)] font-medium leading-[1.15] tracking-[-1.5px] text-black">Posts</h1>
          <p className="text-neutral-500">Open a post to edit it on the page. Changes save as you type.</p>
        </header>
        <ul className="flex flex-col divide-y divide-neutral-200 border-y border-neutral-200">
          {posts.map((p) => (
            <li key={p.slug}>
              <Link href={`/insights/${p.slug}/edit`} className="group flex items-baseline justify-between gap-6 py-5">
                <span className="text-lg font-medium text-neutral-900 group-hover:underline">{p.title}</span>
                <span className="shrink-0 text-xs uppercase tracking-wide text-neutral-400">{p.date}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
