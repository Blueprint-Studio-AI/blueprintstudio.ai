"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, ArrowUpRight } from "lucide-react";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import { usePackage, type AddonId } from "./PackageContext";

// Each deliverable shows a real preview image on the right and a caption
// naming the brand the example is pulled from.
const deliverables = [
  {
    title: "Logo System",
    description: "Primary, secondary, icon and responsive version.",
    image: "/media/whats-included/logo-system.webp",
    caption: "Logo system for UNI",
  },
  {
    title: "Brand Guideline Document",
    description: "A complete rulebook for how your brand looks and sounds.",
    image: "/media/whats-included/brand-guideline.webp",
    caption: "Brand Guideline Document for Autara",
  },
  {
    title: "Color Palette",
    description: "Primary, secondary and accent colors with usage rules.",
    image: "/media/whats-included/color-system.webp",
    caption: "Color system for HoneyB",
  },
  {
    title: "Typography System",
    description: "Typefaces, weights and a clear, scalable type hierarchy.",
    image: "/media/whats-included/type-system.webp",
    caption: "Type system for HoneyB",
  },
  {
    title: "Patterns & Motifs",
    description: "Signature graphic elements that make you instantly recognizable.",
    image: "/media/whats-included/motif.webp",
    caption: "Illustration System for UNI",
  },
  {
    title: "Social Kit",
    description: "Templates and ready-to-post assets for every platform.",
    image: "/media/whats-included/social-kit.webp",
    caption: "Social Kit for Huch",
  },
  {
    title: "Sample Applications",
    description: "Your identity shown in real-world mockups and touchpoints.",
    image: "/media/whats-included/sample-applications.webp",
    caption: "Sample collateral for Autara",
  },
];

// Same fade as the Process section: the dashed line ramps in over the first
// item and fades out over the last, so it spans first → last deliverable.
const LINE_MASK =
  "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)";

const addons: {
  id: AddonId;
  title: string;
  price: string;
  description: string;
  features: string[];
  image: string;
}[] = [
  {
    id: "website",
    title: "Website",
    price: "$15,000",
    description: "A complete visual system that is fully built to scale. Includes:",
    features: ["Custom Design", "Development", "Email Capture & SEO"],
    image: "/media/whats-included/website-example.webp",
  },
  {
    id: "pitchDeck",
    title: "Pitch Deck",
    price: "$5,000",
    description: "A complete visual system that is fully built to scale. Includes:",
    features: ["Narrative Strategy", "Slide Design", "Speaker Notes"],
    image: "/media/whats-included/pitch-example.webp",
  },
];

// Three-column proof stats shown beneath the add-ons (Figma node 72:1616).
const stats = [
  { value: "25+", label: "Brands Built" },
  { value: "3 Week", label: "Avg Delivery" },
  { value: "100%", label: "In-House Team" },
];

export default function WhatsIncludedSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = deliverables[activeIndex];
  // Shared with the Ready-to-launch pricing card: adding here updates there.
  const { selected, toggleAddon } = usePackage();

  return (
    <section className="flex flex-col items-center px-2.5 sm:px-[60px] relative z-20 bg-white">
      <SectionHeader leftText="BASE PACKAGE" rightText="// FOR FOUNDERS" />

      <OuterContainer className="flex-1 flex items-center">
        <InnerContainer className="pt-16 sm:pt-24 lg:pt-28 pb-16 sm:pb-24 lg:pb-28 px-2.5 sm:px-6 relative">
          {/* Heading + subcopy */}
          <h2
            className="font-medium text-black cursor-default mb-5"
            style={{
              fontSize: "clamp(28px, 5vw, 44px)",
              lineHeight: "110%",
              letterSpacing: "-1.5px",
            }}
          >
            What&apos;s included
          </h2>
          <p
            className="text-neutral-500 text-sm sm:text-base max-w-sm"
            style={{ lineHeight: "130%" }}
          >
            The <span className="font-medium text-black">base package</span>{" "}
            covers everything you need for a complete brand identity
          </p>

          {/* Content row, bracketed by construction lines. Content sits 48px
              in from each line (matching the Process section), and the line
              gradient spans the list from the first to the last item. */}
          <div className="relative custom:px-[48px] mt-12 sm:mt-16">
            <div
              className="absolute left-0 top-0 bottom-0 line-dash-y hidden custom:block"
              style={{ maskImage: LINE_MASK, WebkitMaskImage: LINE_MASK }}
            />
            <div
              className="absolute right-0 top-0 bottom-0 line-dash-y hidden custom:block"
              style={{ maskImage: LINE_MASK, WebkitMaskImage: LINE_MASK }}
            />

            <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
              {/* Left: deliverables list */}
              <ul className="lg:w-1/2 flex flex-col">
                {deliverables.map((item, index) => {
                  const isActive = index === activeIndex;
                  return (
                    <li
                      key={item.title}
                      onMouseEnter={() => setActiveIndex(index)}
                      className="relative cursor-default pl-6"
                    >
                      {/* Black active bar — rounded ends, spans only the
                          checkmark + text height and sits in the gutter to the
                          left of the content (outside the divider line). */}
                      <span
                        className="absolute left-0 top-5 bottom-5 w-1 rounded-full bg-black transition-opacity duration-300"
                        style={{ opacity: isActive ? 1 : 0 }}
                      />

                      <div
                        className={`flex items-start gap-3.5 py-5 ${
                          index > 0 ? "border-t border-neutral-200" : ""
                        }`}
                      >
                        {/* Green check */}
                        <span className="mt-0.5 flex items-center justify-center w-5 h-5 shrink-0 rounded-full border-2 border-green-500 text-green-500">
                          <Check className="w-3 h-3" strokeWidth={3.5} />
                        </span>

                        <div>
                          <h3
                            className="font-medium text-black"
                            style={{
                              fontSize: "clamp(16px, 2.4vw, 20px)",
                              letterSpacing: "-0.4px",
                            }}
                          >
                            {item.title}
                          </h3>

                          {/* Sub copy reveal (grid-rows trick animates auto height) */}
                          <div
                            className="grid transition-[grid-template-rows] duration-300 ease-out"
                            style={{
                              gridTemplateRows: isActive ? "1fr" : "0fr",
                            }}
                          >
                            <div className="overflow-hidden">
                              <p
                                className="pt-1 text-sm text-neutral-500"
                                style={{ lineHeight: "130%" }}
                              >
                                {item.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* Right: preview image for the active deliverable. The column
                  stretches to the list height; the figure aligns to the top and
                  sticks there, so it tracks the scroll instead of sitting
                  permanently centered. All images are stacked and cross-faded so
                  hovering the list swaps them with no flash (and they preload). */}
              <div className="lg:w-1/2">
                <figure className="w-full max-w-[520px] mx-auto lg:sticky lg:top-16">
                  <div className="relative w-full aspect-[3/2] overflow-hidden border border-neutral-200 bg-neutral-50 shadow-sm">
                    {deliverables.map((item, index) => (
                      <motion.img
                        key={item.title}
                        src={item.image}
                        alt={item.caption}
                        className="absolute inset-0 h-full w-full object-cover"
                        initial={false}
                        animate={{ opacity: index === activeIndex ? 1 : 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        draggable={false}
                      />
                    ))}
                  </div>
                  <figcaption className="mt-4 text-center text-sm text-neutral-400 cursor-default">
                    {active.caption}
                  </figcaption>
                </figure>
              </div>
            </div>
          </div>

          {/* AI Asset Generator feature — full-width band on a #FCFCFC base.
              Full-bleed: breaks out of the InnerContainer to span the whole
              viewport, then re-centers its content to the same max width. */}
          <div className="relative left-1/2 mt-24 w-screen -translate-x-1/2 overflow-hidden bg-[#FCFCFC] sm:mt-32 lg:mt-40">
            {/* Flowers background — a single PNG the designer baked (flowers +
                the white fade already composited in), so no CSS masking. It IS
                the band's full background at the 1440×552 design size. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-0"
              style={{
                backgroundImage: "url(/media/Background-Asset-Gen.png)",
                backgroundSize: "cover",
                backgroundPosition: "center top",
                backgroundRepeat: "no-repeat",
              }}
            />

            <div className="relative z-10 mx-auto max-w-[1000px] px-2.5 pt-[86px] pb-16 sm:px-12">
              <div className="flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-[86px]">
              {/* Left: copy */}
              {/* Copy — exact Figma spec (node 72:3525). */}
              <div className="lg:w-[42%]">
                {/* Eyebrow — #808080, 12px, 24px gap to the title block */}
                <p className="mb-6 text-[12px] uppercase leading-[18px] text-[#808080] cursor-default">
                  Included in Base Package
                </p>

                {/* Check + title — 12px gap to the description */}
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-green-500 text-green-500">
                    <Check className="h-3.5 w-3.5" strokeWidth={3.5} />
                  </span>
                  <h3
                    className="font-medium text-[#252525]"
                    style={{ fontSize: "24px", letterSpacing: "-0.48px" }}
                  >
                    AI Asset Generator
                  </h3>
                </div>

                <p className="text-[#5A5E64]" style={{ fontSize: "18px", lineHeight: "1.3" }}>
                  Generate brand assets on demand. Every asset stays on-brand,
                  including colors, mood, and visual language.
                </p>

                {/* Try it now — Figma 72:3535: 1.5px #33A6F7 border, 12px radius,
                    faint 5% blue gradient fill, 262px wide, dark 16px label + 10px arrow */}
                <button
                  type="button"
                  className="mt-12 flex w-[262px] cursor-pointer items-center justify-center gap-2 rounded-[12px] border-[1.5px] border-[#33A6F7] py-[20px] transition-colors hover:border-[#1472F6]"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(51,166,247,0.05) 0%, rgba(20,114,246,0.05) 51.923%, rgba(68,77,235,0.05) 88.942%), linear-gradient(90deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.2) 100%)",
                  }}
                >
                  <span className="text-[16px] tracking-[-0.32px] text-[#111]">
                    Try it now
                  </span>
                  <ArrowUpRight className="h-2.5 w-2.5 text-[#111]" strokeWidth={2.5} />
                </button>
              </div>

              {/* Right: layered desktop mockup. The PNG (transparent around the
                  monitor, opaque-white screen) is the base; the screen-content
                  mp4 is absolutely pinned over the screen area so it can't drift
                  out of the display and break the illusion. Screen rect measured
                  from the PNG: 2.52% / 2.46% inset, 94.95% × 69.21%. */}
              <div className="lg:w-[58%]">
                <div className="relative w-full">
                  {/* Base monitor frame */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/media/Mockup-Blank.png"
                    alt="AI Asset Generator on a desktop display"
                    className="relative z-10 block h-auto w-full select-none"
                    draggable={false}
                  />
                  {/* Screen content, locked to the display's screen area */}
                  <video
                    className="absolute z-20 rounded-[4px] object-cover"
                    style={{
                      left: "2.52%",
                      top: "2.46%",
                      width: "94.95%",
                      height: "69.21%",
                    }}
                    src="/media/Screen-Content.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>
            </div>
          </div>

          {/* Add-ons */}
          <div className="mt-24 sm:mt-32 lg:mt-40">
            <h2
              className="font-medium text-black text-center cursor-default"
              style={{
                fontSize: "clamp(24px, 4vw, 32px)",
                letterSpacing: "-1px",
              }}
            >
              Add-ons
            </h2>

            <div className="mt-12 sm:mt-16 flex flex-col lg:flex-row justify-center gap-12">
              {addons.map((addon) => (
                <div
                  key={addon.title}
                  className="relative w-full lg:flex-1 lg:max-w-[452px] rounded-2xl p-8"
                >
                  {/* Dashed outline drawn as SVG so the dash spacing is exact:
                      1.5px stroke, 8px dash + 8px gap, 16px corner radius.
                      (CSS border-dashed can't control dash length.) */}
                  <svg
                    className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
                    aria-hidden="true"
                  >
                    <rect
                      x="0"
                      y="0"
                      width="100%"
                      height="100%"
                      rx="16"
                      ry="16"
                      fill="none"
                      stroke="#d4d4d4"
                      strokeWidth="1.5"
                      strokeDasharray="8 8"
                    />
                  </svg>

                  {/* Mockup (388 × 258 at the design width). Transparent PNG/WebP
                      so the laptop / deck slides float on the card. */}
                  <div className="w-full aspect-[388/258] overflow-hidden rounded-lg">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={addon.image}
                      alt={`${addon.title} example`}
                      className="h-full w-full object-cover"
                      draggable={false}
                    />
                  </div>

                  {/* Price */}
                  <p className="mt-8 text-sm text-[#8D929C]">Add-on Price</p>
                  <p
                    className="mt-1 font-bold text-black"
                    style={{
                      fontSize: "clamp(28px, 4vw, 38px)",
                      letterSpacing: "-1.5px",
                    }}
                  >
                    {addon.price}
                  </p>

                  {/* Title */}
                  <h3
                    className="mt-6 font-medium text-black"
                    style={{
                      fontSize: "clamp(20px, 2.5vw, 24px)",
                      letterSpacing: "-0.5px",
                    }}
                  >
                    <span className="font-normal text-neutral-400">+ </span>
                    {addon.title}
                  </h3>

                  {/* Description */}
                  <p
                    className="mt-3 text-sm sm:text-base text-[#8D929C] max-w-xs"
                    style={{ lineHeight: "130%" }}
                  >
                    {addon.description}
                  </p>

                  {/* Feature list */}
                  <ul className="mt-6">
                    {addon.features.map((feature, i) => (
                      <li
                        key={feature}
                        className={`flex items-center gap-3 py-4 ${
                          i > 0 ? "border-t border-neutral-200" : ""
                        }`}
                      >
                        <span className="flex items-center justify-center w-5 h-5 shrink-0 rounded-full border-2 border-blue-500 text-blue-500">
                          <Check className="w-3 h-3" strokeWidth={3.5} />
                        </span>
                        <span className="text-base text-black">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Add to package — shared state with the Ready-to-launch
                      pricing card, so adding here updates the total there. */}
                  <button
                    type="button"
                    onClick={() => toggleAddon(addon.id)}
                    className={`mt-8 flex w-full items-center justify-center gap-1.5 rounded-xl border py-4 text-sm font-medium transition-colors cursor-pointer ${
                      selected[addon.id]
                        ? "border-[#186FF5] bg-blue-50/60 text-[#186FF5]"
                        : "border-neutral-200 bg-neutral-50 text-black hover:bg-neutral-100"
                    }`}
                  >
                    {selected[addon.id] && <Check className="h-4 w-4" strokeWidth={3} />}
                    {selected[addon.id] ? "Added to Package" : "+ Add to Package"}
                  </button>
                </div>
              ))}
            </div>

            {/* Proof stats — three centered columns (Figma node 72:1616) */}
            <div className="mt-20 grid grid-cols-3 gap-6 sm:mt-28 sm:gap-12 lg:mt-32">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col items-center gap-3 text-center cursor-default"
                >
                  <p
                    className="font-medium text-[#252525]"
                    style={{
                      fontSize: "clamp(18px, 2.4vw, 24px)",
                      lineHeight: "1.18",
                      letterSpacing: "-0.48px",
                    }}
                  >
                    {stat.value}
                  </p>
                  <p className="text-[11px] font-semibold uppercase leading-[18px] text-[#8D929C] sm:text-base">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </InnerContainer>
      </OuterContainer>
    </section>
  );
}
