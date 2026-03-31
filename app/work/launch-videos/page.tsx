/**
 * Launch Videos Portfolio — /work/launch-videos
 *
 * Assets needed:
 * - /public/og-launch-videos.png (1200x630 OG image)
 * - Custom thumbnail images for each video would strengthen the page
 *   (currently using YouTube auto-thumbnails)
 */

import type { Metadata } from "next";
import { Footer } from "@/components/Footer/index";
import LaunchVideosPortfolio from "@/components/Work/LaunchVideosPortfolio";

export const metadata: Metadata = {
  title: "Launch Videos Portfolio",
  description:
    "100+ launch videos delivered. Studio quality, startup speed. See our work for Jinba (YC W26), Pyra, Logical (YC F25), Perena, Pirus Labs, and more.",
  keywords: [
    "launch video portfolio",
    "startup launch video",
    "YC launch video",
    "product demo video",
    "video production agency",
    "startup video examples",
  ],
  alternates: { canonical: "/work/launch-videos" },
  // TODO: Create /public/og-launch-videos.png (1200x630) and add images back to openGraph/twitter
  openGraph: {
    type: "website",
    url: "https://blueprintstudio.ai/work/launch-videos",
    title: "Launch Videos Portfolio | Blueprint Studio",
    description:
      "100+ launch videos delivered. Studio quality, startup speed. See our work.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Launch Videos Portfolio | Blueprint Studio",
    description:
      "100+ launch videos delivered. Studio quality, startup speed. See our work.",
  },
};

export default function LaunchVideosPage() {
  return (
    <div>
      <LaunchVideosPortfolio />
      <Footer />
    </div>
  );
}
