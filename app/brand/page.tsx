import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brand Identity | Blueprint Studio",
  description:
    "Your brand in 3 weeks. Logo, guidelines, and a custom AI trained on your brand. Built for founders moving fast. $15-20K.",
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
        width: 1200,
        height: 630,
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

export { default } from "@/components/Brand/index";
