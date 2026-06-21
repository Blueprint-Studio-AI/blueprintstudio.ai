import { Metadata } from "next";

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

export { default } from "@/components/Launch/index";
