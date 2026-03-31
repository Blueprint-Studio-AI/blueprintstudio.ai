/**
 * Brand Identity Portfolio — /work/brand-identity
 *
 * Assets needed:
 * - /public/og-brand-identity.png (1200x630 OG image)
 * - Additional brand hero images for Breeze and HoneyB would strengthen the page
 */

import type { Metadata } from "next";
import { Footer } from "@/components/Footer/index";
import BrandIdentityPortfolio from "@/components/Work/BrandIdentityPortfolio";

export const metadata: Metadata = {
  title: "Brand Identity Portfolio",
  description:
    "Brand identities built by Blueprint Studio — logo systems, color palettes, typography, and guidelines for startups like UNI, Autara, Huch, HoneyB, and Breeze.",
  keywords: [
    "brand identity portfolio",
    "startup branding examples",
    "logo design portfolio",
    "brand guidelines examples",
    "visual identity design",
    "creative studio portfolio",
  ],
  alternates: { canonical: "/work/brand-identity" },
  // TODO: Create /public/og-brand-identity.png (1200x630) and add images back to openGraph/twitter
  openGraph: {
    type: "website",
    url: "https://blueprintstudio.ai/work/brand-identity",
    title: "Brand Identity Portfolio | Blueprint Studio",
    description:
      "Brand identities built by Blueprint Studio — logo systems, color palettes, typography, and guidelines for startups.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brand Identity Portfolio | Blueprint Studio",
    description:
      "Brand identities built by Blueprint Studio — logo systems, color palettes, typography, and guidelines for startups.",
  },
};

export default function BrandIdentityPage() {
  return (
    <div>
      <BrandIdentityPortfolio />
      <Footer />
    </div>
  );
}
