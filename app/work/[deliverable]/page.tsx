import type { Metadata } from "next";
import { notFound } from "next/navigation";
import WorkPage, { type WorkLayout } from "@/components/work/WorkPage";
import { getWorkPage, workMetadata, workPages } from "@/lib/work";

// One page per deliverable with enough work (lib/work); any other slug is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return workPages.map((page) => ({ deliverable: page.slug }));
}

type Props = { params: Promise<{ deliverable: string }>; searchParams: Promise<{ layout?: string }> };

// Two layouts to compare, outside production only: ?layout=a (default) or ?layout=b.
// Production never reads the query, so its pages stay static.
const COMPARE = process.env.VERCEL_ENV !== "production";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = getWorkPage((await params).deliverable);
  if (!page) return {};
  return workMetadata({ path: `/work/${page.slug}`, title: page.metaTitle, description: page.metaDescription });
}

export default async function DeliverablePage({ params, searchParams }: Props) {
  const page = getWorkPage((await params).deliverable);
  if (!page) notFound();
  const layout: WorkLayout = COMPARE && (await searchParams).layout === "b" ? "b" : "a";
  return <WorkPage page={page} layout={layout} />;
}
