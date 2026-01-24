import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Launch Videos | Blueprint Studio",
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

export { default } from "@/components/LaunchVideos/index";
