import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

const TITLE = "Jinba — Brand Portfolio";
const DESCRIPTION =
  "Jinba brand identity, design system, and downloadable asset library — maintained by Blueprint Studio.";

// This page is distributed by being pasted into Slack and LinkedIn, so the
// unfurl is the first impression for half its audience. metadataBase is what
// lets Next resolve the OG image to an absolute URL — without it the tag is
// dropped and the unfurl renders bare.
export const metadata: Metadata = {
  metadataBase: new URL("https://blueprintstudio.ai"),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/jinba" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "Blueprint Studio",
    title: TITLE,
    description: DESCRIPTION,
    url: "/jinba",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
