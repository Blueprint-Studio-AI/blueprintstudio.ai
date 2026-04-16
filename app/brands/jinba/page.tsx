import { Metadata } from "next";
import { BrandNav } from "@/components/brands/BrandNav";
import { BrandHeader } from "@/components/brands/BrandHeader";
import { BrandToC } from "@/components/brands/BrandToC";
import { FullBleedMedia } from "@/components/brands/FullBleedMedia";
import { TwoColumnMedia } from "@/components/brands/TwoColumnMedia";
import { ImplementationSection } from "./ImplementationSection";
import { LogoSystemSection } from "./LogoSystemSection";
import { TypeScaleSection } from "./TypeScaleSection";
import { ColorPaletteSection } from "./ColorPaletteSection";
import { ColorScalesSection } from "./ColorScalesSection";

export const metadata: Metadata = {
  title: "Jinba — Brand Identity & Design System",
  description: "Brand identity, logo system, color palette, typography, and design system for Jinba — crafted by Blueprint Studio.",
  openGraph: {
    title: "Jinba — Brand Identity & Design System",
    description: "Brand identity, logo system, color palette, typography, and design system for Jinba — crafted by Blueprint Studio.",
    images: [{ url: "/brands/jinba/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jinba — Brand Identity & Design System",
    description: "Brand identity, logo system, color palette, typography, and design system for Jinba — crafted by Blueprint Studio.",
    images: ["/brands/jinba/og-image.png"],
  },
};

// ─── ToC config ─────────────────────────────────────────────────────────────
const TOC_CHAPTERS = [
  { id: "chapter-logo", label: "Logo System" },
  { id: "chapter-color", label: "Color" },
  { id: "chapter-typography", label: "Typography" },
  { id: "chapter-textures", label: "Textures" },
  { id: "chapter-brand-in-use", label: "Samples" },
  { id: "chapter-design-system", label: "Design System" },
];

function Chapter({ id, title }: { id: string; n?: number; title: string }) {
  return (
    <div id={id} className="pt-10 pb-2">
      <div className="mx-6 sm:mx-10 pt-5 border-t border-neutral-200 flex items-baseline justify-between">
        <span className="text-[24px] text-neutral-700">{title}</span>
      </div>
    </div>
  );
}

const tiempos = { fontFamily: '"Tiempos Text", serif' };

function NarrativeSection() {
  return (
    <div className="px-6 sm:px-10 py-14 grid grid-cols-1 sm:grid-cols-4 gap-x-12 gap-y-8">
      {/* Quote — spans 2 cols */}
      <div className="sm:col-span-2">
        <p
          className="text-[clamp(24px,3vw,40px)] leading-[1.25] tracking-[-0.01em] text-[#342115]"
          style={tiempos}
        >
          One body, one mind — horse and rider move as a single form.
        </p>
      </div>

      {/* Body — 2 cols at all breakpoints */}
      <div className="flex flex-col gap-5 text-[13px] leading-relaxed text-neutral-500 sm:col-span-2">
        <p>
          Jinba Ittai is a Japanese concept describing the perfect unity between a horse and its rider — two distinct entities that, through practice and trust, become indistinguishable in motion. For Jinba, it captures what enterprise automation should feel like: the business and its workflows operating as one.
        </p>
        <p>
          The brand is built around that idea. Clean geometry. Deliberate restraint. A visual language that doesn't shout — because the product doesn't need to. Jinba serves regulated industries where trust is the product, and the identity reflects that: considered, precise, and calm under pressure.
        </p>
        <p>
          Every element earns its place. Where other brands reach for complexity to signal power, Jinba reaches for clarity.
        </p>
      </div>

    </div>
  );
}

function DownloadRow({ files }: { files: { label: string; href: string; ext: string }[] }) {
  return (
    <div className="px-6 sm:px-10 pb-3 flex items-center gap-3 flex-wrap">
      {files.map((f) => (
        <a
          key={f.href}
          href={f.href}
          download
          className="inline-flex items-center gap-1.5 text-[11px] text-neutral-500 hover:text-neutral-800 border border-neutral-300 hover:border-neutral-500 rounded-full px-3 py-1.5 transition-colors duration-150"
        >
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path d="M6 1v7M3 6l3 3 3-3M1 10h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {f.label}
        </a>
      ))}
    </div>
  );
}

function AiDownloadRow() {
  return (
    <DownloadRow files={[
      { label: "Business card — Front", href: "/brands/jinba/business-cards/business-card-front.ai", ext: "ai" },
      { label: "Business card — Back",  href: "/brands/jinba/business-cards/business-card-back.ai",  ext: "ai" },
    ]} />
  );
}

function LinkedInDownloadRow() {
  return (
    <DownloadRow files={[
      { label: "Cover — Speed", href: "/brands/jinba/linkedin/linkedin-business-cover-speed.png", ext: "png" },
      { label: "Cover — Dots",  href: "/brands/jinba/linkedin/linkedin-business-cover-dots.png",  ext: "png" },
      { label: "Cover — Field", href: "/brands/jinba/linkedin/linkedin-business-cover-field.png", ext: "png" },
      { label: "PFP — Dark",   href: "/brands/jinba/linkedin/pfp-dark.png",                       ext: "png" },
      { label: "PFP — Light",  href: "/brands/jinba/linkedin/pfp-light.png",                      ext: "png" },
    ]} />
  );
}

export default function JinbaPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] max-w-[1800px] mx-auto lg:pl-[10rem]">
      <BrandNav clientName="Jinba" logoSrc="/brands/jinba/dl/lockup-small-dark.png" />
      <BrandToC chapters={TOC_CHAPTERS} pdfHref="https://drive.google.com/file/d/1zZaz_NnLIcT-b2WeNSgJn1VO9Nry83dx/view?usp=sharing" />

      <BrandHeader
        clientName="Jinba"
        bannerSrc="/brands/jinba/header-banner.png"
        logoSrc="/brands/jinba/dl/lockup-light.png"
        subtitle="Brand Identity · Design System · Logo System · 2026"
        pdfHref="https://drive.google.com/file/d/1zZaz_NnLIcT-b2WeNSgJn1VO9Nry83dx/view?usp=sharing"
      />

      {/* Narrative */}
      {/* <NarrativeSection /> */}

      {/* Logo System */}
      <Chapter id="chapter-logo" title="Logo System" />
      <LogoSystemSection />

      {/* Color */}
      <Chapter id="chapter-color" title="Color" />
      <ColorPaletteSection />
      <ColorScalesSection />

      {/* Typography */}
      <Chapter id="chapter-typography" title="Typography" />
      <TypeScaleSection />

      {/* Textures */}
      <Chapter id="chapter-textures" title="Textures" />
      <TwoColumnMedia
        aspectRatio="natural"
        left={{  src: "/brands/jinba/textures/material-chocolate-brass.png", alt: "Chocolate brass texture" }}
        right={{ src: "/brands/jinba/textures/material-copper-aura.png",     alt: "Copper aura texture"     }}
      />
      <FullBleedMedia src="/brands/jinba/textures/texture-1.png" alt="Golden Turrell Field" aspectRatio="16/9" />
      <FullBleedMedia src="/brands/jinba/textures/texture-2.png" alt="Stampede Brush"       aspectRatio="16/9" />
      <DownloadRow files={[
        { label: "Brush 1", href: "/brands/jinba/textures/dl/brush-1.png", ext: "png" },
        { label: "Brush 2", href: "/brands/jinba/textures/dl/brush-2.png", ext: "png" },
        { label: "Brush 3", href: "/brands/jinba/textures/dl/brush-3.png", ext: "png" },
      ]} />
      <FullBleedMedia src="/brands/jinba/textures/texture-3.png" alt="Brush sample 1"       aspectRatio="16/9" />
      <DownloadRow files={[
        { label: "Brush 3", href: "/brands/jinba/textures/dl/brush-3.png", ext: "png" },
      ]} />
      <FullBleedMedia src="/brands/jinba/textures/texture-4.png" alt="Brush sample 2"       aspectRatio="16/9" />
      <DownloadRow files={[
        { label: "Brush 4", href: "/brands/jinba/textures/dl/brush-4.png", ext: "png" },
      ]} />
      <FullBleedMedia src="/brands/jinba/textures/texture-5.png" alt="Wheat Field"          aspectRatio="16/9" />
      <DownloadRow files={[
        { label: "Field 1", href: "/brands/jinba/textures/dl/field-1.png", ext: "png" },
        { label: "Field 2", href: "/brands/jinba/textures/dl/field-2.png", ext: "png" },
        { label: "Field 3", href: "/brands/jinba/textures/dl/field-3.png", ext: "png" },
      ]} />
      <FullBleedMedia src="/brands/jinba/textures/texture-6.png" alt="Field sample 1"       aspectRatio="16/9" />
      <DownloadRow files={[
        { label: "Field 4", href: "/brands/jinba/textures/dl/field-4.png", ext: "png" },
      ]} />
      <FullBleedMedia src="/brands/jinba/textures/texture-7.png" alt="Field sample 2"       aspectRatio="16/9" />
      <DownloadRow files={[
        { label: "Field 5", href: "/brands/jinba/textures/dl/field-5.png", ext: "png" },
      ]} />

      {/* Samples — reorder freely, each item is explicit JSX */}
      <Chapter id="chapter-brand-in-use" title="Samples" />

      <FullBleedMedia src="/brands/jinba/samples/website-blog.png"     alt="Jinba website blog"      aspectRatio="16/9" />
      <FullBleedMedia src="/brands/jinba/samples/business-cards.png"   alt="Jinba business cards"    aspectRatio="16/9" />
      <AiDownloadRow />
      <FullBleedMedia src="/brands/jinba/samples/website-article.png"  alt="Jinba website article"   aspectRatio="16/9" />
      <TwoColumnMedia
        aspectRatio="natural"
        left={{  src: "/brands/jinba/samples/website-products-short.png", alt: "Jinba website products" }}
        right={{ src: "/brands/jinba/samples/website-menu-short.png",     alt: "Jinba website menu"     }}
      />
      <FullBleedMedia src="/brands/jinba/samples/website-bento.png"    alt="Jinba website bento"     aspectRatio="16/9" />
      <FullBleedMedia src="/brands/jinba/samples/stationary.png"       alt="Jinba stationary"        aspectRatio="16/9" />
      <FullBleedMedia src="/brands/jinba/samples/linkedin-posts.png"   alt="Jinba LinkedIn posts"    aspectRatio="16/9" />
      <FullBleedMedia src="/brands/jinba/samples/website-uses.png"     alt="Jinba website uses"      aspectRatio="16/9" />
      <FullBleedMedia src="/brands/jinba/samples/website-footer.png"   alt="Jinba website footer"    aspectRatio="16/9" />
      <FullBleedMedia src="/brands/jinba/samples/linkedin-banners.png" alt="Jinba LinkedIn banners"  aspectRatio="16/9" />
      <LinkedInDownloadRow />
      {/* <FullBleedMedia src="/brands/jinba/samples/logo-blur.png"        alt="Jinba logo blur"         aspectRatio="16/9" /> */}

      {/* Design System */}
      <div id="chapter-design-system">
        <Chapter id="chapter-design-system-heading" title="Design System" />
        <ImplementationSection />
      </div>

      {/* Footer */}
      <div className="mx-6 sm:mx-10 py-6 border-t border-neutral-200 flex items-center justify-between">
        <span className="text-[11px] text-neutral-400">Blueprint Studio</span>
        <span className="text-[11px] text-neutral-400">2026</span>
      </div>
    </div>
  );
}
