import type { Metadata } from "next";
import { Poly, Inter } from "next/font/google";

// HoneyB's faces, scoped to this route. The kit resolves font-sans/serif from
// --font-text / --font-display, so each brand supplies its own typefaces while
// sharing the same .brand-kit-root scope.
const display = Poly({ subsets: ["latin"], weight: "400", variable: "--font-display", display: "swap" });
const text = Inter({ subsets: ["latin"], variable: "--font-text", display: "swap" });

export const metadata: Metadata = {
  title: "HoneyB — Brand Portfolio",
  description:
    "HoneyB brand identity, design system, and downloadable asset library — maintained by Blueprint Studio.",
};

export default function HoneybLayout({ children }: { children: React.ReactNode }) {
  return <div className={`brand-kit-root ${display.variable} ${text.variable}`}>{children}</div>;
}
