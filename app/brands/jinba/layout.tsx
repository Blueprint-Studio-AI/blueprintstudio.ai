import { Geist, Geist_Mono } from "next/font/google";
import { jinba } from "@/lib/brands/jinba";
import { brandMetadata, brandViewport, BrandChrome, BrandJsonLd } from "@/lib/brands/meta";

// Geist is loaded and scoped to this route only — the `.brand-kit-root` wrapper
// (see globals.css) points font-sans at --font-text without touching the site's
// global Helvetica. Tiempos is already provided by the app's globals.
const geist = Geist({ subsets: ["latin"], variable: "--font-text", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

const OG = "/brands/jinba/og-image.png";
export const metadata = brandMetadata(jinba, OG);
export const viewport = brandViewport(jinba);

export default function JinbaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`brand-kit-root ${geist.variable} ${geistMono.variable}`}
      // Tiempos is a local @font-face in globals, so it is named directly.
      style={{ "--font-display": '"Tiempos Text"' } as React.CSSProperties}
    >
      <BrandChrome brand={jinba} />
      <BrandJsonLd brand={jinba} image={OG} />
      {children}
    </div>
  );
}
