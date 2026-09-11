import { Geist_Mono, Inter, Plus_Jakarta_Sans } from "next/font/google";
import { gascogne } from "../_fonts/gascogne";
import { archPrime } from "@/lib/brands/arch-prime";
import { brandMetadata, brandViewport, BrandChrome, BrandJsonLd } from "@/lib/brands/meta";

// Arch Prime's faces, scoped to this route (brand guidelines pp.19–21): Plus
// Jakarta Sans as --font-text (primary: headings and body), Gascogne Serial as
// --font-display (secondary: editorial headings), Inter as --font-numbers
// (tertiary: numbers). The kit resolves font-serif/font-sans from those inside the shared
// .brand-kit-root scope.
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-text", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-numbers", display: "swap" });

// No static OG — ./opengraph-image.tsx composes one from the hero.
export const metadata = brandMetadata(archPrime);
export const viewport = brandViewport(archPrime);

export default function ArchPrimeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`brand-kit-root ${gascogne.variable} ${jakarta.variable} ${geistMono.variable} ${inter.variable}`}>
      <BrandChrome brand={archPrime} />
      <BrandJsonLd brand={archPrime} />
      {children}
    </div>
  );
}
