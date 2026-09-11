import { Geist, Geist_Mono } from "next/font/google";
import { gascogne } from "../_fonts/gascogne";
import { arch } from "@/lib/brands/arch";
import { brandMetadata, BrandJsonLd } from "@/lib/brands/meta";

// Arch's faces, scoped to this route: Gascogne Serial as --font-display, Geist
// as --font-text. The kit resolves font-serif/font-sans from those inside the
// shared .brand-kit-root scope.
const geist = Geist({ subsets: ["latin"], variable: "--font-text", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

// No static OG — ./opengraph-image.tsx composes one from the hero.
export const metadata = brandMetadata(arch);

export default function ArchLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`brand-kit-root ${gascogne.variable} ${geist.variable} ${geistMono.variable}`}>
      <BrandJsonLd brand={arch} />
      {children}
    </div>
  );
}
