import { Metadata } from "next";
import LaunchComponent from "@/components/Launch/index";

export const metadata: Metadata = {
  // Layout template appends " | Blueprint Studio" — keep this bare to avoid doubling.
  title: "Full Launch Package",
  description:
    "Everything you need to launch. Brand identity, website, pitch deck, launch video. One team, one price, six weeks. Starting at $50K.",
  keywords: [
    "startup launch package",
    "YC launch",
    "brand identity",
    "startup website",
    "pitch deck design",
    "launch video",
    "full service agency",
    "startup studio",
  ],
  alternates: {
    canonical: "/launch",
  },
  openGraph: {
    type: "website",
    url: "https://blueprintstudio.ai/launch",
    title: "Full Launch Package | Blueprint Studio",
    description:
      "Everything you need to launch. Brand identity, website, pitch deck, launch video. One team, one price, six weeks.",
    images: [
      {
        url: "/og-launch.png",
        width: 2400,
        height: 1260,
        alt: "Blueprint Studio - Full Launch Package",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Full Launch Package | Blueprint Studio",
    description:
      "Everything you need to launch. Brand identity, website, pitch deck, launch video. One team, one price, six weeks.",
    images: ["/og-launch.png"],
  },
};

// Page-specific structured data (the layout already provides WebSite +
// Organization). Describes the Full Launch Package service and its starting price.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Full Launch Package",
  serviceType: "Startup launch package",
  description:
    "Everything you need to launch. Brand identity, website, pitch deck, launch video. One team, one price, six weeks.",
  url: "https://blueprintstudio.ai/launch",
  areaServed: "Worldwide",
  provider: {
    "@type": "Organization",
    name: "Blueprint Studio",
    url: "https://blueprintstudio.ai",
  },
  offers: {
    "@type": "Offer",
    priceCurrency: "USD",
    price: "50000",
    url: "https://blueprintstudio.ai/launch",
    availability: "https://schema.org/InStock",
  },
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LaunchComponent />
    </>
  );
}
