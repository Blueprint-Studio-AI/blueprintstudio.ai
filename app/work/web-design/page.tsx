/**
 * Web Design Portfolio — /work/web-design
 *
 * Assets needed:
 * - /public/og-web-design.png (1200x630 OG image)
 * - Additional web design project screenshots would strengthen the page
 */

import type { Metadata } from "next";
import { Footer } from "@/components/Footer/index";
import WebDesignPortfolio from "@/components/Work/WebDesignPortfolio";

export const metadata: Metadata = {
  title: "Web Design Portfolio",
  description:
    "Responsive websites and landing pages built by Blueprint Studio for Huch, HoneyB, Perena, and more. Desktop and mobile, pixel-perfect.",
  keywords: [
    "web design portfolio",
    "startup website design",
    "landing page design",
    "responsive web design",
    "framer website",
    "next.js website",
  ],
  alternates: { canonical: "/work/web-design" },
  openGraph: {
    type: "website",
    url: "https://blueprintstudio.ai/work/web-design",
    title: "Web Design Portfolio | Blueprint Studio",
    description:
      "Responsive websites and landing pages built by Blueprint Studio. Desktop and mobile, pixel-perfect.",
    images: [
      {
        url: "/og-web-design.png",
        width: 1200,
        height: 630,
        alt: "Blueprint Studio - Web Design Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Web Design Portfolio | Blueprint Studio",
    description:
      "Responsive websites and landing pages built by Blueprint Studio. Desktop and mobile, pixel-perfect.",
    images: ["/og-web-design.png"],
  },
};

export default function WebDesignPage() {
  return (
    <div>
      <WebDesignPortfolio />
      <Footer />
    </div>
  );
}
