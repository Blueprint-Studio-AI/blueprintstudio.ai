/**
 * Portfolio Index — /work
 *
 * Assets needed:
 * - /public/og-work.png (1200x630 OG image for social sharing)
 */

import type { Metadata } from "next";
import { Footer } from "@/components/Footer/index";
import WorkIndexPage from "@/components/Work/WorkIndexPage";

export const metadata: Metadata = {
  title: "Our Work",
  description:
    "Explore Blueprint Studio's portfolio: brand identities, websites, pitch decks, and launch videos built for startups moving fast.",
  keywords: [
    "startup portfolio",
    "brand identity portfolio",
    "web design portfolio",
    "pitch deck examples",
    "launch video portfolio",
    "creative studio work",
  ],
  alternates: { canonical: "/work" },
  openGraph: {
    type: "website",
    url: "https://blueprintstudio.ai/work",
    title: "Our Work | Blueprint Studio",
    description:
      "Explore Blueprint Studio's portfolio: brand identities, websites, pitch decks, and launch videos built for startups moving fast.",
    images: [
      {
        url: "/og-work.png",
        width: 1200,
        height: 630,
        alt: "Blueprint Studio - Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Work | Blueprint Studio",
    description:
      "Explore Blueprint Studio's portfolio: brand identities, websites, pitch decks, and launch videos built for startups moving fast.",
    images: ["/og-work.png"],
  },
};

export default function WorkPage() {
  return (
    <div>
      <WorkIndexPage />
      <Footer />
    </div>
  );
}
