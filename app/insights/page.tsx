import { Metadata } from "next";
import { renderPage } from "@blueprint-studio/galley";
import { validatePage, type PageDoc } from "@blueprint-studio/galley/pages";
import { getInsightsPage } from "@/lib/insights-page";
import galley from "@/galley.config";
import { InsightsFrame } from "@/components/insights/frame";
import { Footer } from "@/components/Footer/index";

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
    images: [
      {
        url: "/og/blueprint-studio.jpg",
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
    images: ["/og/blueprint-studio.jpg"],
  },
};

// The Insights page: the sections in content/pages/insights.json (its heading and its
// posts), inside the page's frame. Edit mode (/insights/edit) arranges them.
export default async function InsightsPage() {
  const checked = validatePage(getInsightsPage(), galley.sections ?? []);
  if (!checked.ok) throw new Error(`content/pages/insights.json: ${checked.errors.map((e) => `${e.path} ${e.message}`).join("; ")}`);
  return (
    <div>
      <InsightsFrame>{await renderPage(checked.page as PageDoc, galley.sections ?? [], { params: {}, path: "/insights", edit: false })}</InsightsFrame>
      <Footer />
    </div>
  );
}
