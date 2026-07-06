import type { Metadata } from "next";
import LaunchVideosComponent from "@/components/LaunchVideos/index";

export const metadata: Metadata = {
  // Layout template appends " | Blueprint Studio" — keep this bare to avoid doubling.
  title: "Launch Videos",
  description:
    "Get your launch video in 7 days. Studio quality, startup speed. You focus on shipping. We'll handle the video.",
  keywords: [
    "YC launch video",
    "startup launch video",
    "product launch video",
    "demo video",
    "Y Combinator video",
    "startup video production",
    "launch video agency",
  ],
  alternates: {
    canonical: "/launch-videos",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://blueprintstudio.ai/launch-videos",
    siteName: "Blueprint Studio",
    title: "Launch Videos | Blueprint Studio",
    description:
      "Get your launch video in 7 days. Studio quality, startup speed. You focus on shipping. We'll handle the video.",
    images: [
      {
        url: "https://blueprintstudio.ai/og-launch-videos.jpg",
        width: 1200,
        height: 630,
        alt: "Blueprint Studio - Launch Videos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@bpstu",
    creator: "@bpstu",
    title: "Launch Videos | Blueprint Studio",
    description:
      "Get your launch video in 7 days. Studio quality, startup speed. You focus on shipping. We'll handle the video.",
    images: ["https://blueprintstudio.ai/og-launch-videos.jpg"],
  },
};

// Page-specific structured data (the layout already provides WebSite +
// Organization). Describes the Launch Videos production service and its two
// pricing tiers (see components/LaunchVideos/PricingSection.tsx).
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Launch Videos",
  serviceType: "Launch video production",
  description:
    "Get your launch video in 7 days. Studio quality, startup speed. You focus on shipping. We'll handle the video.",
  url: "https://blueprintstudio.ai/launch-videos",
  areaServed: "Worldwide",
  provider: {
    "@type": "Organization",
    name: "Blueprint Studio",
    url: "https://blueprintstudio.ai",
  },
  offers: [
    {
      "@type": "Offer",
      name: "Fast",
      priceCurrency: "USD",
      price: "8000",
      url: "https://blueprintstudio.ai/launch-videos",
      availability: "https://schema.org/InStock",
    },
    {
      "@type": "Offer",
      name: "Studio",
      priceCurrency: "USD",
      price: "15000",
      url: "https://blueprintstudio.ai/launch-videos",
      availability: "https://schema.org/InStock",
    },
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <LaunchVideosComponent />
    </>
  );
}
