import { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import BlogIndex from "@/components/Blog/BlogIndex";

export const metadata: Metadata = {
  // Layout template appends " | Blueprint Studio" — keep this bare to avoid doubling.
  title: "Insights",
  description:
    "Thinking on product, design, and building things that work. Insights from Blueprint Studio.",
  alternates: {
    canonical: "/insights",
  },
  openGraph: {
    type: "website",
    url: "https://blueprintstudio.ai/insights",
    title: "Insights | Blueprint Studio",
    description:
      "Thinking on product, design, and building things that work. Insights from Blueprint Studio.",
    // The site's own card (app/opengraph-image.tsx); a page's openGraph replaces the layout's whole.
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Blueprint Studio: the design and build partner for founders" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Insights | Blueprint Studio",
    description:
      "Thinking on product, design, and building things that work. Insights from Blueprint Studio.",
    images: ["/twitter-image"],
  },
};

export default function InsightsPage() {
  const posts = getAllPosts();
  return <BlogIndex posts={posts} />;
}
