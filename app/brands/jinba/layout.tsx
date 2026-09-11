import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

// Geist is loaded and scoped to this route only — the `.jinba-root` wrapper (see
// globals.css) points font-sans at --font-geist without touching the site's
// global Helvetica. Tiempos is already provided by the app's globals.
const geist = Geist({ subsets: ["latin"], variable: "--font-text", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: "Jinba — Brand Portfolio",
  description:
    "Jinba brand identity, design system, and downloadable asset library — maintained by Blueprint Studio.",
};

export default function JinbaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`brand-kit-root ${geist.variable} ${geistMono.variable}`}
      // Tiempos is a local @font-face in globals, so it is named directly.
      style={{ "--font-display": '"Tiempos Text"' } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
