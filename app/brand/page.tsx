import { Metadata } from "next";
import BrandPage from "@/components/Brand/index";

export const metadata: Metadata = {
  // Layout applies the template "%s | Blueprint Studio", so keep this bare to
  // avoid a doubled "... | Blueprint Studio | Blueprint Studio" <title>.
  title: "Brand Identity",
  description:
    "Your brand in 3 weeks. Logo, guidelines, and a custom AI trained on your brand. Built for founders moving fast. Starting at $18K.",
  keywords: [
    "brand identity",
    "logo design",
    "brand guidelines",
    "startup branding",
    "YC branding",
    "brand strategy",
    "visual identity",
    "brand GPT",
  ],
  alternates: {
    canonical: "/brand",
  },
  openGraph: {
    type: "website",
    url: "https://blueprintstudio.ai/brand",
    title: "Brand Identity | Blueprint Studio",
    description:
      "Your brand in 3 weeks. Logo, guidelines, and a custom AI trained on your brand. Built for founders moving fast.",
    images: [
      {
        url: "/og-brand.png",
        width: 2400,
        height: 1260,
        alt: "Blueprint Studio - Brand Identity",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Brand Identity | Blueprint Studio",
    description:
      "Your brand in 3 weeks. Logo, guidelines, and a custom AI trained on your brand. Built for founders moving fast.",
    images: ["/og-brand.png"],
  },
};

// Page-specific structured data (the layout already provides WebSite +
// Organization). Describes the Brand Identity service and its starting price.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Brand Identity",
  serviceType: "Brand identity design",
  description:
    "Your brand in 3 weeks. Logo, guidelines, and a custom AI trained on your brand. Built for founders moving fast.",
  url: "https://blueprintstudio.ai/brand",
  areaServed: "Worldwide",
  provider: {
    "@type": "Organization",
    name: "Blueprint Studio",
    url: "https://blueprintstudio.ai",
  },
  offers: {
    "@type": "Offer",
    priceCurrency: "USD",
    price: "18000",
    url: "https://blueprintstudio.ai/brand",
    availability: "https://schema.org/InStock",
  },
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <BrandPage />
    </>
  );
}
