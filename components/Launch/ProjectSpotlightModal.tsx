"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import DeliverablePill from "@/components/ui/DeliverablePill";
import { useSmoothScroll } from "@/components/SmoothScroll";

interface ProjectSpotlightModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    name: string;
    logo: string;
    title: string;
    description: string;
    deliverables: { num: string; label: string }[];
    image: string;
  };
}

export default function ProjectSpotlightModal({
  isOpen,
  onClose,
  project,
}: ProjectSpotlightModalProps) {
  const { scroll } = useSmoothScroll();

  useEffect(() => {
    if (!isOpen) return;

    scroll?.stop();
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);

    return () => {
      scroll?.start();
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose, scroll]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm sm:p-4"
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-4xl h-[100dvh] sm:h-auto sm:max-h-[90vh] flex flex-col bg-[#FAFAF9] rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-shrink-0 flex items-center justify-between px-6 py-3 border-b border-neutral-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/blueprint-logo-dark.svg"
                alt="Blueprint Studio"
                className="h-4 w-auto grayscale"
              />
              <button
                onClick={onClose}
                className="p-2 text-neutral-600 hover:text-neutral-800 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain">
            <div className="relative w-full aspect-[4/1] overflow-hidden">
              <Image
                src="/launch-assets/honeyb-spotlight/honeycombs.png"
                alt={project.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="px-5 sm:px-10 py-6 sm:py-12 space-y-8 sm:space-y-10">
              <div>
                <p className="text-neutral-500 text-[14px] uppercase tracking-wider mb-4">
                  Overview
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.logo}
                  alt={project.name}
                  className="h-14 object-contain mb-4"
                />
                <h2 className="text-2xl sm:text-2xl font-medium text-black tracking-[-0.5px] mb-3">
                  {project.title}
                </h2>
                <p className="text-neutral-500 leading-[128%] max-w-2xl">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-5">
                  {project.deliverables.map((item) => (
                    <DeliverablePill key={item.num} num={item.num} label={item.label} size="sm" />
                  ))}
                </div>

                <div className="flex flex-col gap-3 mt-8">
                  <div className="flex flex-col sm:flex-row gap-3 sm:h-80">
                    <div className="relative aspect-[3/2] sm:aspect-auto sm:w-[60%] rounded-xl bg-neutral-100 border border-neutral-200 overflow-hidden">
                      <Image src="/launch-assets/honeyb-spotlight/honeyb-image1.png" alt="" fill className="object-cover" />
                    </div>
                    <div className="relative aspect-[3/2] sm:aspect-auto sm:w-[40%] rounded-xl bg-neutral-100 border border-neutral-200 overflow-hidden">
                      <Image src="/launch-assets/honeyb-spotlight/honeyb-image2.png" alt="" fill className="object-cover" />
                    </div>
                  </div>
                  <div className="relative aspect-[21/9] rounded-xl bg-neutral-100 border border-neutral-200 overflow-hidden">
                    <Image src="/launch-assets/honeyb-spotlight/honeyb-image3.jpg" alt="" fill className="object-cover" />
                  </div>
                </div>
              </div>

              {[
                {
                  num: "01",
                  title: "Brand\nIdentity",
                  description: "Placeholder — describe what was delivered for the brand identity.",
                  subsections: [
                    {
                      heading: "Logo System",
                      description: "We designed a flexible logo system with primary wordmark, icon, and lockup variations. The stacked horizontal lines reference both blockchain architecture and honey\u2019s layered structure, creating instant brand recognition across every touchpoint.",
                      images: [
                        { src: "/logos-match-height/honeyb.png", className: "object-contain" },
                        { src: "/launch-assets/honeyb-spotlight/honeyb-logos.png", className: "object-cover" },
                      ],
                    },
                    {
                      heading: "Color System",
                      description: "A warm gold palette that balances the technical nature of Bitcoin with approachability. From Liquid-Gold to Off-White, each shade serves a specific purpose in creating hierarchy and maintaining accessibility across digital and print applications.",
                      colorPalettes: [
                        {
                          title: "Shades of Gold",
                          colors: [
                            { name: "Liquid-Gold", hex: "#F47000" },
                            { name: "Marigold", hex: "#FFB445" },
                            { name: "Wax", hex: "#FFCB7F" },
                            { name: "Light", hex: "#FFF3E1" },
                            { name: "Muted", hex: "#FDF8F1" },
                            { name: "Off-White", hex: "#FFFEFD" },
                          ],
                        },
                        {
                          title: "Shades of Grey & Black",
                          colors: [
                            { name: "Neutral 500", hex: "#14161F" },
                            { name: "Neutral 400", hex: "#2D2E36" },
                            { name: "Neutral 300", hex: "#64656A" },
                            { name: "Neutral 200", hex: "#BAB9BB" },
                            { name: "Neutral 100", hex: "#F8F8F8" },
                          ],
                        },
                      ],
                    },
                    {
                      heading: "Type System",
                      description: "We paired a confident serif for headlines with a clean sans-serif for body copy. The combination creates authority in investor materials while maintaining readability across product interfaces and marketing channels.",
                      typeSystem: {
                        fonts: [
                          { name: "Poly R", role: "Display", weight: 400 },
                          { name: "Inter L", role: "Body", weight: 300 },
                        ],
                        scale: [
                          { size: "64px", weight: "400", lineHeight: "110%", label: "Heading 1 Desktop" },
                          { size: "48px", weight: "400", lineHeight: "110%", label: "Heading 2" },
                          { size: "30px", weight: "400", lineHeight: "120%", label: "Heading 3" },
                          { size: "24px", weight: "400", lineHeight: "124%", label: "Body Large" },
                          { size: "18px", weight: "400", lineHeight: "140%", label: "Body Normal" },
                          { size: "15px", weight: "400", lineHeight: "110%", label: "Body Small" },
                          { size: "16px", weight: "500", lineHeight: "100%", label: "Button Text" },
                          { size: "14px", weight: "400", lineHeight: "120%", label: "Link Text" },
                        ],
                      },
                    },
                    {
                      heading: "Brand Kit",
                      description: "Pre-designed banners for Twitter, LinkedIn, and community channels ensure consistent brand presence as the team scales. Every asset follows the same visual language, from profile headers to announcement graphics.",
                      galleryImages: [
                        { src: "/launch-assets/honeyb-spotlight/brand-kit-1.png", aspect: "16/9" },
                        { src: "/launch-assets/honeyb-spotlight/brand-kit-2.png", aspect: "4/3" },
                      ],
                    },
                  ],
                },
                {
                  num: "02",
                  title: "Web\nDesign",
                  description: "A high-performance marketing site built to convert Bitcoin users into yield earners.",
                  subsections: [
                    {
                      heading: "Responsive Design",
                      description: "The site adapts seamlessly from desktop to mobile without compromising the bold visual identity. Users get the same premium experience whether browsing on a 27\u2033 monitor or checking rates on their phone.",
                      galleryImages: [
                        { src: "/launch-assets/honeyb-spotlight/desktop-honeyb.png", aspect: "16/10" },
                        { src: "/launch-assets/honeyb-spotlight/mobile-honeyb.png", aspect: "9/16" },
                      ],
                      galleryLayout: "side-by-side",
                    },
                    {
                      heading: "UI Components",
                      description: "We built a comprehensive component library that maintains consistency while allowing for flexibility. Subtle gradients, clean typography, and generous spacing create a premium feel that builds trust in the DeFi space.",
                      galleryImages: [
                        { src: "/launch-assets/honeyb-spotlight/honeyb-components.png", aspect: "auto" },
                      ],
                    },
                  ],
                },
                {
                  num: "03",
                  title: "Investor\nDeck",
                  description: "A narrative-driven pitch deck designed to close rounds.",
                  subsections: [
                    {
                      heading: "Slide Design",
                      description: "Each slide balances data clarity with visual impact. We used the warm gold palette strategically to keep data readable, while accent colors highlight key metrics and CTAs. Clean layouts give complex information like market size and business models room to breathe.",
                      galleryImages: [
                        { src: "/launch-assets/honeyb-spotlight/honeyb-social.png", aspect: "auto" },
                      ],
                    },
                  ],
                },
              ].map((item, i) => (
                <div key={item.num} className={i > 0 ? "pt-8 sm:pt-10 border-t border-neutral-200" : ""}>
                  <span className="text-4xl sm:text-5xl font-medium text-neutral-400 block mb-3">{item.num}</span>
                  <h3 className="font-medium text-black whitespace-pre-line text-[clamp(32px,6vw,64px)] leading-[110%] tracking-[-1px]">
                    {item.title}
                  </h3>
                  <p className="text-neutral-500 text-base sm:text-lg leading-6 mt-4 max-w-xs">
                    {item.description}
                  </p>
                  <div className="flex flex-col mt-10 sm:mt-16">
                    {item.subsections.map((sub, j) => (
                      <div key={sub.heading}>
                        {j > 0 && <div className="line-dash-x my-6 sm:my-8" />}
                        <div>
                          <h4 className="text-lg font-medium text-black">{sub.heading}</h4>
                          <p className="text-neutral-500 leading-relaxed mt-4 sm:mt-6 max-w-full sm:max-w-[50%]">{sub.description}</p>
                          {"images" in sub && sub.images && (
                            <div className="grid grid-cols-2 gap-10 sm:gap-20 mt-8 sm:mt-12 max-w-md mx-auto py-8 sm:py-16">
                              {(sub.images as { src: string; className: string }[]).map((img) => (
                                <div key={img.src} className="relative h-24">
                                  <Image src={img.src} alt="" fill className="object-contain object-center" />
                                </div>
                              ))}
                            </div>
                          )}
                          {"colorPalettes" in sub && sub.colorPalettes && (
                            <div className="flex flex-col gap-12 mt-12 sm:px-12">
                              {(sub.colorPalettes as { title: string; colors: { name: string; hex: string }[] }[]).map((palette, pi) => (
                                <div key={palette.title}>
                                  {pi > 0 && <div className="line-dash-x mb-12" />}
                                  <h5 className="text-lg font-medium text-neutral-800 mb-12">{palette.title}</h5>
                                  <div className="hidden sm:grid" style={{ gridTemplateColumns: `repeat(${palette.colors.length}, minmax(0, 1fr))` }}>
                                    {palette.colors.map((color) => (
                                      <div key={color.hex} className="flex flex-col items-start">
                                        <span className="text-xs font-light text-neutral-700 uppercase tracking-wide ml-3">{color.hex}</span>
                                        <span className="text-xs text-neutral-600 mt-3 mb-3 ml-3">{color.name}</span>
                                        <div className="w-full aspect-square" style={{ backgroundColor: color.hex }} />
                                      </div>
                                    ))}
                                  </div>
                                  <div className="grid grid-cols-3 gap-y-4 sm:hidden">
                                    {palette.colors.map((color) => (
                                      <div key={color.hex} className="flex flex-col items-start">
                                        <span className="text-[10px] font-light text-neutral-700 uppercase tracking-wide ml-2">{color.hex}</span>
                                        <span className="text-[10px] text-neutral-600 mt-2 mb-2 ml-2">{color.name}</span>
                                        <div
                                          className="w-full aspect-square"
                                          style={{ backgroundColor: color.hex }}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          {"galleryImages" in sub && sub.galleryImages && (() => {
                            const images = sub.galleryImages as { src: string; aspect: string }[];
                            const layout = "galleryLayout" in sub ? sub.galleryLayout : "stacked";
                            if (layout === "side-by-side") {
                              return (
                                <div className="flex flex-col sm:flex-row items-center sm:items-end justify-center gap-6 sm:gap-8 mt-8 sm:mt-12 sm:max-w-[80%] sm:mx-auto">
                                  {images.map((img) => (
                                    <div
                                      key={img.src}
                                      className={`relative rounded-xl overflow-hidden ${img.aspect === "9/16" ? "w-[35%] sm:w-auto" : "w-full sm:w-auto"}`}
                                      style={{ flex: img.aspect === "9/16" ? "0 0 25%" : "1 1 0%" }}
                                    >
                                      <Image src={img.src} alt="" width={800} height={600} className="w-full h-auto" />
                                    </div>
                                  ))}
                                </div>
                              );
                            }
                            return (
                              <div className="flex flex-col gap-6 mt-12">
                                {images.map((img) => (
                                  <div key={img.src} className="relative w-full rounded-xl overflow-hidden">
                                    <Image src={img.src} alt="" width={800} height={600} className="w-full h-auto" />
                                  </div>
                                ))}
                              </div>
                            );
                          })()}
                          {"typeSystem" in sub && sub.typeSystem && (() => {
                            const ts = sub.typeSystem as {
                              fonts: { name: string; role: string; weight: number }[];
                              scale: { size: string; weight: string; lineHeight: string; label: string }[];
                            };
                            return (
                              <div className="mt-12 sm:px-12">
                                <div className="grid grid-cols-2 gap-8 py-8 sm:py-16">
                                  {ts.fonts.map((font) => (
                                    <div key={font.name} className="flex flex-col items-center">
                                      <span className="text-[40px] sm:text-[64px] leading-none tracking-tight text-neutral-800" style={{ fontWeight: font.weight }}>{font.name}</span>
                                      <span className="text-sm text-neutral-400 mt-3">{font.role}</span>
                                    </div>
                                  ))}
                                </div>
                                <div className="flex flex-col">
                                  {ts.scale.map((row, ri) => (
                                    <div key={row.label}>
                                      {ri > 0 && <div className="border-b border-neutral-100" />}
                                      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between py-3 gap-1 sm:gap-0">
                                        <div className="flex gap-3 sm:gap-6 text-[10px] sm:text-xs text-neutral-400">
                                          <span>Size: {row.size}</span>
                                          <span>Weight: {row.weight}</span>
                                          <span>LH: {row.lineHeight}</span>
                                        </div>
                                        <span className="text-neutral-800" style={{ fontSize: `min(${row.size}, 32px)`, fontWeight: Number(row.weight), lineHeight: row.lineHeight }}>
                                          {row.label}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
