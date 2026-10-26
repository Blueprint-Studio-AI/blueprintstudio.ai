import type { Metadata } from "next";
import WorkIndex from "@/components/work/WorkIndex";
import { workIndex, workMetadata } from "@/lib/work";

export const metadata: Metadata = workMetadata({
  path: "/work",
  title: workIndex.metaTitle,
  description: workIndex.metaDescription,
});

export default function WorkIndexPage() {
  return <WorkIndex />;
}
