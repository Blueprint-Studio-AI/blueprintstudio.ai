import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Overview from "@/components/Overview";
import SectionHeader, { PillLink } from "@/components/SectionHeader";
import LogoConfigurator from "@/components/LogoConfigurator";
import ColorSystem from "@/components/ColorSystem";
import TypeSystem from "@/components/TypeSystem";
import CopyCssPill from "@/components/CopyCssPill";
import BrandAssets from "@/components/BrandAssets";
import Motion from "@/components/Motion";
import Implementation from "@/components/Implementation";
import RelatedBrand from "@/components/RelatedBrand";
import Footer from "@/components/Footer";
import { META } from "@/lib/data";

export default function Home() {
  return (
    // Nav sits in <header> and Footer outside <main>: a <footer> nested inside
    // <main> gets no contentinfo role at all, and "skip to main" landed on the
    // site chrome rather than the content.
    <>
      <header>
        <Nav />
      </header>
      <main>
        <Hero />
        <Overview />

        <SectionHeader id="logo" title="Logo System" meta={META.logo}>
          <PillLink href="/downloads/arch-logos.zip">Download Logo System</PillLink>
        </SectionHeader>
        <LogoConfigurator />

        <SectionHeader id="color" title="Color System" meta={META.color}>
          <PillLink href="/downloads/arch-tokens.css">Download Tokens</PillLink>
        </SectionHeader>
        <ColorSystem />

        <SectionHeader id="type" title="Type System" meta={META.type}>
          <CopyCssPill />
        </SectionHeader>
        <TypeSystem />

        <SectionHeader id="motion" title="Motion" meta={META.motion}>
          <PillLink href="/downloads/arch-motion.zip">Download All Motion</PillLink>
        </SectionHeader>
        <Motion />

        <SectionHeader id="assets" title="Brand Assets" meta={META.assets}>
          <PillLink href="/downloads/arch-assets.zip">Download All Assets</PillLink>
        </SectionHeader>
        <BrandAssets />

        <Implementation />
        <RelatedBrand />
      </main>
      <Footer />
    </>
  );
}
