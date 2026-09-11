import { Poly, Inter } from "next/font/google";
import { honeyb } from "@/lib/brands/honeyb";
import { brandMetadata, brandViewport, BrandChrome, BrandJsonLd } from "@/lib/brands/meta";

// HoneyB's faces, scoped to this route. The kit resolves font-sans/serif from
// --font-text / --font-display, so each brand supplies its own typefaces while
// sharing the same .brand-kit-root scope.
const display = Poly({ subsets: ["latin"], weight: "400", variable: "--font-display", display: "swap" });
const text = Inter({ subsets: ["latin"], variable: "--font-text", display: "swap" });

// No static OG — ./opengraph-image.tsx composes one from the hero.
export const metadata = brandMetadata(honeyb);
export const viewport = brandViewport(honeyb);

export default function HoneybLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`brand-kit-root ${display.variable} ${text.variable}`}>
      <BrandChrome brand={honeyb} />
      <BrandJsonLd brand={honeyb} />
      {children}
    </div>
  );
}
