import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ComboPage from "@/components/industries/ComboPage";
import { getCombo, industryCombos } from "@/lib/industries";
import { workMetadata } from "@/lib/work";

// One static page per industry x deliverable combo that's configured and has
// enough projects (lib/industries); anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return industryCombos().map((c) => ({ industry: c.industry.slug, deliverable: c.deliverable }));
}

type Props = { params: Promise<{ industry: string; deliverable: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { industry, deliverable } = await params;
  const found = getCombo(industry, deliverable);
  if (!found) return {};
  return workMetadata({
    path: `/industries/${industry}/${deliverable}`,
    title: found.combo.metaTitle,
    description: found.combo.metaDescription,
    image: found.combo.ogImage,
  });
}

export default async function Page({ params }: Props) {
  const { industry, deliverable } = await params;
  const found = getCombo(industry, deliverable);
  if (!found) notFound();
  return <ComboPage industry={found.industry} deliverable={found.deliverable} combo={found.combo} />;
}
