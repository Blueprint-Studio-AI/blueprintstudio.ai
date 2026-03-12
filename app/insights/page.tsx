import { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import BlogIndex from "@/components/Blog/BlogIndex";

export const metadata: Metadata = {
  title: "Insights | Blueprint Studio",
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
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Blueprint Studio Insights",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Insights | Blueprint Studio",
    description:
      "Thinking on product, design, and building things that work. Insights from Blueprint Studio.",
    images: ["/og-image.jpg"],
  },
};

export default function InsightsPage() {
  const posts = getAllPosts();
  return <BlogIndex posts={posts} />;
}
