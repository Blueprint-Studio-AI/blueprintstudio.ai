import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Overview from "@/components/Overview";
import TabBar from "@/components/TabBar";
import SectionHeader, { PillLink } from "@/components/SectionHeader";
import LogoConfigurator from "@/components/LogoConfigurator";
import Gallery from "@/components/Gallery";
import ColorSystem from "@/components/ColorSystem";
import ColorLineup from "@/components/ColorLineup";
import TypeSystem from "@/components/TypeSystem";
import TextureGrid from "@/components/TextureGrid";
import Implementation from "@/components/Implementation";
import Footer from "@/components/Footer";
import { GALLERIES, META } from "@/lib/data";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <Overview />
      <TabBar />

      <SectionHeader id="logo" num="01" title="Logo System" meta={META.logo}>
        <PillLink href="/downloads/jinba-logos.zip">Download Zip</PillLink>
      </SectionHeader>
      <LogoConfigurator />
      <Gallery items={GALLERIES.logo} />

      <SectionHeader id="color" num="02" title="Color System" meta={META.color}>
        <PillLink href="/downloads/jinba-tokens.css">Download Tokens</PillLink>
      </SectionHeader>
      <ColorSystem />
      <ColorLineup />

      <SectionHeader id="type" num="03" title="Type System" meta={META.type}>
        <PillLink href="https://klim.co.nz/fonts/tiempos-text/" external>
          Get Tiempos ↗
        </PillLink>
        <PillLink href="https://vercel.com/font" external>
          Get Geist ↗
        </PillLink>
      </SectionHeader>
      <TypeSystem />
      <Gallery items={GALLERIES.type} />

      <SectionHeader id="textures" num="04" title="Texture System" meta={META.textures}>
        <PillLink href="/downloads/jinba-textures.zip">Download Zip</PillLink>
      </SectionHeader>
      <TextureGrid />
      <Gallery items={GALLERIES.textures} />

      <Implementation />
      <Footer />
    </main>
  );
}
