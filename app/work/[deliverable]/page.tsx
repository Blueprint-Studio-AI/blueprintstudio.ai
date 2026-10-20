import type { Metadata } from "next";
import { notFound } from "next/navigation";
import WorkPage from "@/components/work/WorkPage";
import { getWorkPage, workMetadata, workPages } from "@/lib/work";

// One static page per deliverable with enough projects (lib/work); any other
// slug is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return workPages.map((page) => ({ deliverable: page.slug }));
}

type Props = { params: Promise<{ deliverable: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = getWorkPage((await params).deliverable);
  if (!page) return {};
  return workMetadata({ path: `/work/${page.slug}`, title: page.metaTitle, description: page.metaDescription });
}

export default async function DeliverablePage({ params }: Props) {
  const page = getWorkPage((await params).deliverable);
  if (!page) notFound();
  return <WorkPage page={page} />;
}
