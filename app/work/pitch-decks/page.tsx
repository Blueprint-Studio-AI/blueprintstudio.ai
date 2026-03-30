/**
 * Pitch Decks Portfolio — /work/pitch-decks
 *
 * Assets needed:
 * - /public/og-pitch-decks.png (1200x630 OG image)
 * - Higher-resolution slide images would strengthen the page
 */

import type { Metadata } from "next";
import { Footer } from "@/components/Footer/index";
import PitchDecksPortfolio from "@/components/Work/PitchDecksPortfolio";

export const metadata: Metadata = {
  title: "Pitch Deck Portfolio",
  description:
    "Investor-ready pitch decks designed by Blueprint Studio for Friday Table, HoneyB, Huch, and more. Designed to win meetings and close rounds.",
  keywords: [
    "pitch deck design",
    "startup pitch deck",
    "investor deck portfolio",
    "YC pitch deck",
    "fundraising deck design",
    "pitch deck agency",
  ],
  alternates: { canonical: "/work/pitch-decks" },
  openGraph: {
    type: "website",
    url: "https://blueprintstudio.ai/work/pitch-decks",
    title: "Pitch Deck Portfolio | Blueprint Studio",
    description:
      "Investor-ready pitch decks designed by Blueprint Studio. Designed to win meetings and close rounds.",
    images: [
      {
        url: "/og-pitch-decks.png",
        width: 1200,
        height: 630,
        alt: "Blueprint Studio - Pitch Deck Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pitch Deck Portfolio | Blueprint Studio",
    description:
      "Investor-ready pitch decks designed by Blueprint Studio. Designed to win meetings and close rounds.",
    images: ["/og-pitch-decks.png"],
  },
};

export default function PitchDecksPage() {
  return (
    <div>
      <PitchDecksPortfolio />
      <Footer />
    </div>
  );
}
