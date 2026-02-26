"use client";

import { useState, useRef, useEffect } from "react";
import { useScrollTo } from "@/components/SmoothScroll";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import { Palette, Globe, Presentation, Play, ChevronRight, Monitor, Smartphone } from "lucide-react";
import GreenCheckmark from "@/components/ui/GreenCheckmark";
import { cn } from "@/lib/utils";

const brandPortfolio = [
  {
    id: "uni",
    name: "UNI",
    tagline: "ウニ",
    accentColor: "#E8392A",
    headline: "Japanese Street Food Brand",
    description: "Bold, playful identity for a fast-casual concept launching in LA.",
    logo: "/launch-assets/brand-picker-icons/uni.png",
    logoMark: "/logos-match-height/uni.png",
    gallery: ["/launch-assets/brand-identity_assets/brand-identity_UNI.png"],
  },
  {
    id: "autara",
    name: "Autara",
    tagline: "AI Infrastructure",
    accentColor: "#6366F1",
    headline: "Developer-First AI Platform",
    description: "Clean, technical identity for a Series A infrastructure startup.",
    logo: "/launch-assets/brand-picker-icons/autara.png",
    logoMark: "/logos-match-height/autara.png",
    gallery: ["/launch-assets/brand-identity_assets/brand-identity_autara.png"],
  },
  {
    id: "huch",
    name: "Huch",
    tagline: "Gaming Platform",
    accentColor: "#16A34A",
    headline: "Gaming Cases Marketplace",
    description: "Bold, dark identity built for a competitive gaming audience.",
    logo: "/launch-assets/brand-picker-icons/huch.png",
    logoMark: "/logos-match-height/huch.png",
    gallery: ["/launch-assets/brand-identity_assets/brand-identity_huch.png"],
  },
];

const FT = "/launch-assets/slide-deck_assets/friday-table_deck-assets";
const deckBrands = [
  {
    id: "friday-table",
    name: "Friday Table",
    logo: "/launch-assets/brand-picker-icons/friday.png",
    gallery: [
      `${FT}/1%20v3.jpg`,
      `${FT}/2%20v3.jpg`,
      `${FT}/3%20v3.jpg`,
      `${FT}/4%20v3.jpg`,
      `${FT}/5%20v3.jpg`,
      `${FT}/6%20%20v3.jpg`,
      `${FT}/7%20%20v3.jpg`,
      `${FT}/8%20%20v3.jpg`,
      `${FT}/9%20%20v3.jpg`,
      `${FT}/10%20%20v3.jpg`,
      `${FT}/11%20%20v3.jpg`,
      `${FT}/12%20v3.jpg`,
    ],
  },
  {
    id: "honeyb",
    name: "HoneyB",
    logo: "/launch-assets/brand-picker-icons/honeyb.png",
    gallery: Array.from({ length: 12 }, (_, i) => `/launch-assets/slide-deck_assets/honeyb_deck-assets/honeyb-${i + 1}.jpg`),
  },
  {
    id: "huch",
    name: "Huch",
    logo: "/launch-assets/brand-picker-icons/huch.png",
    gallery: Array.from({ length: 15 }, (_, i) => `/launch-assets/slide-deck_assets/huch_deck-assets/huch-${i + 1}.jpg`),
  },
];

function BrandPicker<T extends { id: string; logo: string; name: string }>({
  brands,
  selectedId,
  onSelect,
}: {
  brands: T[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex gap-3 items-center h-[72px]">
      {brands.map((brand) => {
        const isActive = brand.id === selectedId;
        return (
          <button
            key={brand.id}
            onClick={() => onSelect(brand.id)}
            className={cn(
              "cursor-pointer flex-shrink-0 transition-all duration-300 rounded-lg p-1 bg-white shadow-[0_2.157px_8.843px_0_rgba(0,0,0,0.34)]",
              isActive ? "w-[72px] h-[72px] opacity-100" : "w-[60px] h-[60px] opacity-40"
            )}
          >
            <div className="relative w-full h-full overflow-hidden rounded-md">
              <Image src={brand.logo} alt={brand.name} fill sizes="72px" loading="eager" className="object-cover" />
            </div>
          </button>
        );
      })}
    </div>
  );
}

function GalleryTrack({ images, imageClassName, sizes }: { images: string[]; imageClassName?: string; sizes?: string }) {
  return (
    <div className="flex items-center gap-4 shrink-0">
      {images.map((src, i) => (
        <div key={i} className={cn("relative rounded-xl overflow-hidden flex-shrink-0", imageClassName ?? "w-64 aspect-video")}>
          <Image src={src} alt="" fill sizes={sizes ?? "256px"} className="object-cover" />
        </div>
      ))}
    </div>
  );
}

function MarqueeGalleryRow({ reverse = false, images, imageClassName, sizes }: { reverse?: boolean; images: string[]; imageClassName?: string; sizes?: string }) {
  return (
    <div className="relative overflow-x-clip">
      <div
        className="absolute left-0 top-0 bottom-0 w-24 pointer-events-none z-10"
        style={{ background: "linear-gradient(to right, hsl(var(--neutral-50)), transparent)" }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-24 pointer-events-none z-10"
        style={{ background: "linear-gradient(to left, hsl(var(--neutral-50)), transparent)" }}
      />
      <div
        className={`flex w-max ${reverse ? "animate-gallery-scroll-reverse" : "animate-gallery-scroll"}`}
        style={{ willChange: "transform", backfaceVisibility: "hidden" }}
      >
        <GalleryTrack images={images} imageClassName={imageClassName} sizes={sizes} />
        <div className="pl-4">
          <GalleryTrack images={images} imageClassName={imageClassName} sizes={sizes} />
        </div>
      </div>
    </div>
  );
}

const websiteBrands = [
  {
    id: "huch",
    name: "Huch",
    logo: "/launch-assets/brand-picker-icons/huch.png",
    desktop: "/launch-assets/web-design_assets/desktop-huch.png",
    mobile: "/launch-assets/web-design_assets/mobile-huch.png",
  },
  {
    id: "honeyb",
    name: "HoneyB",
    logo: "/launch-assets/brand-picker-icons/honeyb.png",
    desktop: "/launch-assets/web-design_assets/desktop-honeyb.png",
    mobile: "/launch-assets/web-design_assets/mobile-honeyb.png",
  },
  {
    id: "perena",
    name: "Perena",
    logo: "/launch-assets/brand-picker-icons/perena.png",
    desktop: "/launch-assets/web-design_assets/desktop-perena.png",
    mobile: "/launch-assets/web-design_assets/mobile-perena.png",
  },
];


const packageItems = [
  {
    id: "brand",
    num: "01",
    label: "Brand",
    title: "Brand\nIdentity",
    description: "A complete visual system that is fully built to scale. Includes:",
    icon: Palette,
    features: [
      { name: "Logo System", detail: "Primary, secondary, icon, and lockup variations" },
      { name: "Design System", detail: "Typography, color palette, visual language" },
      { name: "Social Kit", detail: "Profiles, banners, and templates for every platform" },
      { name: "AI Prompting", detail: "Brand asset generator setup with custom prompts" },
    ],
    workSubtitle: "Recent client work",
    workHeading: "Brands we've built",
    gallery: [
      "/images/work/LivingPersona-Desktop1.png",
      "/images/work/ProjectMetaVison-Desktop1.png",
    ],
  },
  {
    id: "website",
    num: "02",
    label: "Website",
    title: "Website",
    description: "A world-class site designed and built to convert. Includes:",
    icon: Globe,
    features: [
      { name: "Custom Design", detail: "World-class design with custom animations" },
      { name: "Development", detail: "Built in Framer, Next.js, or Astro" },
      { name: "Responsive", detail: "Fully responsive across all devices" },
      { name: "CMS & SEO", detail: "Content management, SEO foundations, and analytics" },
    ],
    workSubtitle: "Recent client work",
    workHeading: "Sites we've built to convert",
    gallery: [
      "/images/work/LivingPersona-Desktop1.png",
      "/images/work/ProjectMetaVison-Desktop1.png",
    ],
  },
  {
    id: "deck",
    num: "03",
    label: "Deck",
    title: "Pitch\nDeck",
    description: "A compelling narrative designed to close rounds. Includes:",
    icon: Presentation,
    features: [
      { name: "Narrative Strategy", detail: "Story arc and flow designed to persuade" },
      { name: "Slide Design", detail: "Fully designed slides in Figma" },
      { name: "Speaker Notes", detail: "Speaker notes and flow guidance" },
      { name: "Source Files", detail: "Editable source file for future updates" },
    ],
    workSubtitle: "Recent client work",
    workHeading: "Stories we've helped tell",
    gallery: [
      "/images/work/LivingPersona-Desktop1.png",
      "/images/work/ProjectMetaVison-Desktop1.png",
    ],
  },
  {
    id: "video",
    num: "04",
    label: "Video",
    title: "Launch\nVideo",
    description: "A short-form video built for traction. Includes:",
    icon: Play,
    features: [
      { name: "Script & Storyboard", detail: "Full creative direction from concept to final" },
      { name: "Production", detail: "30–60 second video with motion graphics" },
      { name: "Screen Recordings", detail: "Product walkthroughs and screen captures" },
      { name: "Platform Optimized", detail: "Optimized for social and embed" },
    ],
    workSubtitle: "Recent client work",
    workHeading: "Videos that drive traction",
    gallery: [] as string[],
    videos: [
      { thumbnail: "/launch-videos/script.png", label: "Jinba", videoType: "Launch Video" },
      { thumbnail: "/launch-videos/production.png", label: "Pyra", videoType: "Launch Video" },
      { thumbnail: "/launch-videos/focus.png", label: "AgeVisor 3", videoType: "Launch Video" },
      { thumbnail: "/launch-videos/delivery.png", label: "Logical", videoType: "Launch Video" },
    ],
  },
];

type PackageItem = (typeof packageItems)[number];

function FeatureItem({
  feature,
  isLast = false,
}: {
  feature: { name: string; detail: string };
  isLast?: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const isOpen = isHovered || isLocked;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsLocked((prev) => !prev)}
      className={cn("relative w-full min-h-[5rem] flex items-center gap-4 py-3 cursor-pointer group", {
        "border-b border-neutral-200": !isLast,
      })}
    >
      <div
        className={'hidden sm:block transition-all duration-300 absolute bg-black w-1 -left-6 rounded-full h-4 group-hover:h-12 top-1/2 opacity-0 group-hover:opacity-100 -translate-y-1/2'} />
      <GreenCheckmark
        className="w-6 h-6 shrink-0 border-neutral-400 text-green-500/60 transition-all group-hover:bg-green-500/10 group-hover:border-green-500 group-hover:text-green-500"
      />
      <div className="flex-1">
        <span className="text-md font-medium text-black">{feature.name}</span>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="overflow-hidden"
            >
              <p className="text-sm text-neutral-500 mt-2">{feature.detail}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function PackageContent({ item }: { item: PackageItem }) {
  const [selectedBrandPortfolioId, setSelectedBrandPortfolioId] = useState(brandPortfolio[0].id);
  const selectedBrandPortfolio = brandPortfolio.find((b) => b.id === selectedBrandPortfolioId) ?? brandPortfolio[0];
  const [selectedDeckBrandId, setSelectedDeckBrandId] = useState(deckBrands[0].id);
  const selectedDeckBrand = deckBrands.find((b) => b.id === selectedDeckBrandId) ?? deckBrands[0];
  const [selectedWebsiteBrandId, setSelectedWebsiteBrandId] = useState(websiteBrands[0].id);
  const selectedWebsiteBrand = websiteBrands.find((b) => b.id === selectedWebsiteBrandId) ?? websiteBrands[0];
  const [activeWebTab, setActiveWebTab] = useState<"web" | "mobile">("web");
  const slideDir = useRef(0);

  const handleWebTabChange = (tab: "web" | "mobile") => {
    slideDir.current = tab === "mobile" ? 1 : -1;
    setActiveWebTab(tab);
  };

  const handleWebBrandChange = (id: string) => {
    slideDir.current = 0;
    setSelectedWebsiteBrandId(id);
  };

  return (
    <div className="max-w-5xl mx-auto pl-0 sm:pl-12 space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {/* Left: Number, Title, Description */}
        <div>
          <span className="text-5xl font-medium text-neutral-400 mb-3 block">{item.num}</span>
          <h3 className="font-medium text-black whitespace-pre-line text-[clamp(36px,6vw,64px)] leading-[110%] tracking-[-1px]">
            {item.title}
          </h3>
          <p className="text-neutral-500 text-lg leading-6 mt-4 max-w-xs">
            {item.description}
          </p>
        </div>

        {/* Right: Interactive Feature Checklist */}
        <div className="flex flex-col">
          {item.features.map((feature, i) => (
            <FeatureItem
              key={feature.name}
              feature={feature}
              isLast={i === item.features.length - 1}
            />
          ))}
        </div>
      </div>

      {/* Work Section */}
      <div className="relative rounded-2xl py-6">
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden"
          style={{
            backgroundImage: `radial-gradient(circle, #000 1px, transparent 1px)`,
            backgroundSize: "20px 20px",
            opacity: 0.07,
            maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
          }}
        />
        <div className="relative z-10">
      {item.videos ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8 sm:gap-y-12">
          {item.videos.map((video, i) => (
            <div key={i} className="group cursor-pointer">
              <div className="rounded-xl border border-neutral-300">
                <div className="relative aspect-video bg-neutral-900 [clip-path:inset(0_round_11px)] [transform:translateZ(0)]">
                  <Image
                    src={video.thumbnail}
                    alt={video.label}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[72px] h-[72px] rounded-full backdrop-blur-[2px] bg-[#252525]/50 border border-t-white/60 border-l-white/40 border-b-white/10 border-r-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.25)] flex items-center justify-center transition-all duration-200 group-hover:scale-110 group-hover:bg-[#252525]/70 group-hover:border-t-white/80 group-hover:border-l-white/60">
                      <Play className="w-8 h-8 text-white fill-white ml-0.5" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 items-center mt-4">
                <p className="text-lg font-medium text-neutral-800 tracking-tight">{video.label}</p>
                <p className="text-base text-neutral-500">{video.videoType}</p>
              </div>
            </div>
          ))}
        </div>
      ) : item.id === "brand" ? (
        <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-8 md:gap-12 items-start">
          {/* Left: moving gallery */}
          <div className="overflow-hidden">
            <MarqueeGalleryRow images={selectedBrandPortfolio.gallery} imageClassName="h-48 sm:h-72 w-[1150px]" sizes="1150px" />
          </div>

          {/* Right: picker + brand showcase */}
          <div className="flex flex-col gap-4">
            <BrandPicker
              brands={brandPortfolio}
              selectedId={selectedBrandPortfolioId}
              onSelect={setSelectedBrandPortfolioId}
            />
            <div className="overflow-hidden">
              <div className="flex items-stretch">
                <div className="flex-1 p-6">
                  <div className="relative h-10 w-24 mb-8">
                    <Image src={selectedBrandPortfolio.logoMark} alt={selectedBrandPortfolio.name} fill sizes="96px" className="object-contain object-left" />
                  </div>
                  <p className="text-base font-medium text-neutral-800">{selectedBrandPortfolio.headline}</p>
                  <p className="text-sm text-neutral-500 mt-1 leading-snug">{selectedBrandPortfolio.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : item.id === "website" ? (
        <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-8 md:gap-12 items-start">
          <div className="relative w-full aspect-[4/3] overflow-hidden">
            <AnimatePresence custom={slideDir.current}>
              <motion.div
                key={`${selectedWebsiteBrandId}-${activeWebTab}`}
                custom={slideDir.current}
                variants={{
                  enter: (dir: number) => ({ x: dir !== 0 ? `${dir * 100}%` : 0, opacity: dir === 0 ? 0 : 1 }),
                  center: { x: 0, opacity: 1 },
                  exit: (dir: number) => ({ x: dir !== 0 ? `${dir * -100}%` : 0, opacity: dir === 0 ? 0 : 1 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={activeWebTab === "web" ? selectedWebsiteBrand.desktop : selectedWebsiteBrand.mobile}
                  alt={selectedWebsiteBrand.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 60vw"
                  className="object-contain select-none"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex flex-col gap-4 mt-12">
            <div className="flex gap-1 bg-neutral-100 rounded-full p-1 self-start border border-neutral-200">
              {(["web", "mobile"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleWebTabChange(tab)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all duration-200 cursor-pointer",
                    activeWebTab === tab
                      ? "bg-white shadow-sm text-black font-medium"
                      : "text-neutral-500 hover:text-neutral-700"
                  )}
                >
                  {tab === "web" ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
                  {tab === "web" ? "Web" : "Mobile"}
                </button>
              ))}
            </div>
            <BrandPicker
              brands={websiteBrands}
              selectedId={selectedWebsiteBrandId}
              onSelect={handleWebBrandChange}
            />
            <p className="text-neutral-500 text-base leading-snug max-w-xs mt-4">{item.description}</p>
          </div>
        </div>
      ) : item.id === "deck" ? (
        <div className="flex flex-col gap-6 ml-0 sm:-ml-12">
          <div className="flex justify-center">
            <BrandPicker
              brands={deckBrands}
              selectedId={selectedDeckBrandId}
              onSelect={setSelectedDeckBrandId}
            />
          </div>
          <MarqueeGalleryRow images={selectedDeckBrand.gallery} sizes="256px" />
          <MarqueeGalleryRow images={selectedDeckBrand.gallery} sizes="256px" reverse />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
          {item.gallery.map((src, i) => (
            <div key={i} className="relative aspect-[4/3] bg-neutral-100 rounded-lg overflow-hidden">
              <Image
                src={src}
                alt={`${item.label} example ${i + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}
        </div>
      </div>
    </div>
  );
}

export default function PackageSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([null, null, null, null]);
  const scrollTo = useScrollTo();

  useEffect(() => {
    const visibleSections = new Set<number>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = sectionRefs.current.findIndex((ref) => ref === entry.target);
          if (index === -1) return;
          if (entry.isIntersecting) {
            visibleSections.add(index);
          } else {
            visibleSections.delete(index);
          }
        });

        if (visibleSections.size > 0) {
          setActiveIndex(Math.min(...visibleSections));
        }
      },
      { rootMargin: "0px 0px -60% 0px", threshold: 0 }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (index: number) => {
    const el = sectionRefs.current[index];
    if (!el) return;
    scrollTo(el, { offset: 0, duration: 1 });
  };

  return (
    <Section className="flex flex-col relative z-20 bg-neutral-50 overflow-hidden">
      {/* Vertical lines */}
      <div className="absolute inset-0 flex justify-center pointer-events-none px-2.5 sm:px-[60px]">
        <div className="w-full flex-1 flex justify-center relative">
          <div className="absolute left-0 top-0 bottom-0 line-dash-y custom:hidden" />
          <div className="absolute left-0 top-0 bottom-0 w-px bg-neutral-300 hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y custom:hidden" />
          <div className="absolute right-0 top-0 bottom-0 w-px bg-neutral-300 hidden custom:block" />
        </div>
      </div>

      <SectionHeader leftText="THE PACKAGE" rightText="// what you get" />

      <OuterContainer className="flex-1 flex items-center">
        <InnerContainer className="pt-8 sm:pt-12 lg:pt-16 pb-8 sm:pb-12 lg:pb-16 px-2.5 sm:px-6 relative">
          <div className="absolute left-0 top-0 bottom-0 line-dash-y hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y hidden custom:block" />

          {/* Section Title */}
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="font-medium text-black cursor-default text-[clamp(32px,6vw,48px)] leading-[110%] tracking-[-1.5px]">
              Four deliverables.
              <br />
              One unified brand.
            </h2>
          </div>

          {/* Deliverable Pills */}
          <div className="flex justify-center flex-wrap gap-2.5 mb-8 sm:mb-12">
            {packageItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(index)}
                className={`flex items-center gap-3 px-3.5 sm:px-4 py-2 rounded-full text-sm border transition-all duration-200 cursor-pointer ${
                  activeIndex === index
                    ? "bg-white text-black border-neutral-300 shadow-[0_1px_4px_0_rgba(0,0,0,0.25),0_0_27.791px_0_rgba(255,255,255,0.58)]"
                    : "bg-transparent text-neutral-400 border-neutral-200 hover:text-neutral-600 hover:border-neutral-300"
                }`}
              >
                <span className={`text-base font-normal ${activeIndex === index ? "text-neutral-400" : "text-neutral-200"}`}>{item.num}</span>
                <span className="text-base font-normal">{item.label}</span>
              </button>
            ))}
          </div>

          {/* All Package Sections */}
          <div className="flex flex-col">
            {packageItems.map((item, index) => (
              <div
                key={item.id}
                ref={(el) => { sectionRefs.current[index] = el; }}
                className={index > 0 ? "mt-16 sm:mt-24" : ""}
              >
                <PackageContent item={item} />
              </div>
            ))}
          </div>
        </InnerContainer>
      </OuterContainer>

      <div className="w-full line-dash-x" />
    </Section>
  );
}
