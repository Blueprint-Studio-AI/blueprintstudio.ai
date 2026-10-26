import type { Metadata } from "next";
import { notFound } from "next/navigation";
import IndustryPage from "@/components/industries/IndustryPage";
import { getIndustry, industries } from "@/lib/industries";
import { workMetadata } from "@/lib/work";

// One static page per industry with enough work (lib/industries); any other
// slug is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return industries.map((i) => ({ industry: i.slug }));
}

type Props = { params: Promise<{ industry: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const industry = getIndustry((await params).industry);
  if (!industry) return {};
  return workMetadata({
    path: `/industries/${industry.slug}`,
    title: industry.metaTitle,
    description: industry.metaDescription,
    image: industry.ogImage,
  });
}

export default async function Page({ params }: Props) {
  const industry = getIndustry((await params).industry);
  if (!industry) notFound();
  return <IndustryPage industry={industry} />;
}
