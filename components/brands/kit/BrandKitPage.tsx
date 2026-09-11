"use client";

// The whole brand-kit page, composed from a single BrandConfig. Every brand
// route is just <BrandKitPage brand={someBrand} /> — no per-brand markup.
import { BrandProvider } from "@/components/brands/kit/BrandContext";
import { metaFor, type BrandConfig } from "@/components/brands/kit/types";
import Nav from "@/components/brands/kit/Nav";
import Hero from "@/components/brands/kit/Hero";
import Overview from "@/components/brands/kit/Overview";
import SectionHeader, { PillLink } from "@/components/brands/kit/SectionHeader";
import LogoConfigurator from "@/components/brands/kit/LogoConfigurator";
import Gallery from "@/components/brands/kit/Gallery";
import ColorSystem from "@/components/brands/kit/ColorSystem";
import ColorChips from "@/components/brands/kit/ColorChips";
import TypeSystem from "@/components/brands/kit/TypeSystem";
import CopyCssPill from "@/components/brands/kit/CopyCssPill";
import CopyColorsPill from "@/components/brands/kit/CopyColorsPill";
import BrandAssets from "@/components/brands/kit/BrandAssets";
import Downloads from "@/components/brands/kit/Downloads";
import Footer from "@/components/brands/kit/Footer";
import { ToastProvider } from "@/components/brands/kit/ui/Toast";

export default function BrandKitPage({ brand }: { brand: BrandConfig }) {
  const meta = metaFor(brand);
  const { downloads, galleries } = brand;

  return (
    <BrandProvider brand={brand}>
      <ToastProvider>
        <Nav />
        <Hero />

        {/* Everything below the hero is one opaque sheet that scrolls up over the
          pinned hero. It needs its own stacking context (z-10) and a real
          background — without the background the hero would show through, and
          the "covering" read depends entirely on the sheet being solid. No
          shadow at the seam: the hard edge is the cleaner read. */}
        <div className="relative z-10 bg-white">
          <Overview />

          <SectionHeader id="logo" title="Logo System" meta={meta.logo}>
            {downloads.logos && (
              <PillLink href={downloads.logos}>Download Logo System</PillLink>
            )}
          </SectionHeader>
          <LogoConfigurator />
          <Gallery items={galleries.logo} />

          <SectionHeader id="color" title="Color System" meta={meta.color}>
            <CopyColorsPill />
            {downloads.tokens && (
              <PillLink href={downloads.tokens}>Download Tokens</PillLink>
            )}
          </SectionHeader>
          {brand.colorLayout === "chips" ? <ColorChips /> : <ColorSystem />}
          {galleries.color && <Gallery items={galleries.color} />}

          <SectionHeader id="type" title="Type System" meta={meta.type}>
            <CopyCssPill />
          </SectionHeader>
          <TypeSystem />
          <Gallery items={galleries.type} />

          <SectionHeader id="assets" title="Brand Assets" meta={meta.assets}>
            {downloads.assets && (
              <PillLink href={downloads.assets}>Download All Assets</PillLink>
            )}
          </SectionHeader>
          <BrandAssets />

          <Downloads />
          <Footer />
        </div>
      </ToastProvider>
    </BrandProvider>
  );
}
