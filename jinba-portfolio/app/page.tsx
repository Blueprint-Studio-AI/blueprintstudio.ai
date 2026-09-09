import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Overview from "@/components/Overview";
import SectionHeader, { PillLink } from "@/components/SectionHeader";
import LogoConfigurator from "@/components/LogoConfigurator";
import Gallery from "@/components/Gallery";
import ColorSystem from "@/components/ColorSystem";
import TypeSystem from "@/components/TypeSystem";
import CopyCssPill from "@/components/CopyCssPill";
import BrandAssets from "@/components/BrandAssets";
import Implementation from "@/components/Implementation";
import Footer from "@/components/Footer";
import { GALLERIES, META } from "@/lib/data";

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
          <PillLink href="/downloads/jinba-logos.zip">Download Logo System</PillLink>
        </SectionHeader>
        <LogoConfigurator />
        <Gallery items={GALLERIES.logo} />

        <SectionHeader id="color" title="Color System" meta={META.color}>
          <PillLink href="/downloads/jinba-tokens.css">Download Tokens</PillLink>
        </SectionHeader>
        <ColorSystem />

        <SectionHeader id="type" title="Type System" meta={META.type}>
          <CopyCssPill />
        </SectionHeader>
        <TypeSystem />
        <Gallery items={GALLERIES.type} />

        <SectionHeader id="assets" title="Brand Assets" meta={META.assets}>
          <PillLink href="/downloads/jinba-textures.zip">Download All Assets</PillLink>
        </SectionHeader>
        <BrandAssets />

        <Implementation />
      </main>
      <Footer />
    </>
  );
}
