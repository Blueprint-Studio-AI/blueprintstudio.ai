import Image from "next/image";

const tiempos = { fontFamily: '"Tiempos Text", serif' };

// ─── Types ───────────────────────────────────────────────────────────────────

interface PngVariant { label: string; color: string; href: string }
interface PrimaryMark {
  label: string;
  previewSrc: string;
  alt: string;
  svgHref: string;
  /**
   * Max dimensions of the logo's bounding box as a percentage of the 16:9 canvas.
   * Use image aspect ratio to size correctly: glyph ≈1:1, lockups ≈4.5:1.
   */
  maxW: string;
  maxH: string;
  pngVariants: PngVariant[];
}

// ─── Primary brand ───────────────────────────────────────────────────────────

const PRIMARY_MARKS: PrimaryMark[] = [
  {
    label: "Glyph",
    previewSrc: "/brands/jinba/dl/glyph-light.png",
    alt: "Jinba glyph",
    svgHref: "/brands/jinba/dl/glyph.svg",
    // Square glyph (1.07:1) in 16:9 canvas
    maxW: "20%",
    maxH: "38%",
    pngVariants: [
      { label: "Black", color: "#000000", href: "/brands/jinba/dl/glyph-black.png" },
      { label: "Dark",  color: "#322014", href: "/brands/jinba/dl/glyph-dark.png"  },
      { label: "Light", color: "#FAF8F3", href: "/brands/jinba/dl/glyph-light.png" },
      { label: "White", color: "#FFFFFF", href: "/brands/jinba/dl/glyph-white.png" },
    ],
  },
  {
    label: "Lockup · Standard",
    previewSrc: "/brands/jinba/dl/lockup-light.png",
    alt: "Jinba standard lockup",
    svgHref: "/brands/jinba/dl/lockup.svg",
    // Wide lockup (4.47:1) in 16:9 — constrain width, height follows naturally
    maxW: "58%",
    maxH: "30%",
    pngVariants: [
      { label: "Black", color: "#000000", href: "/brands/jinba/dl/lockup-black.png" },
      { label: "Dark",  color: "#322014", href: "/brands/jinba/dl/lockup-dark.png"  },
      { label: "Light", color: "#FAF8F3", href: "/brands/jinba/dl/lockup-light.png" },
      { label: "White", color: "#FFFFFF", href: "/brands/jinba/dl/lockup-white.png" },
    ],
  },
  {
    label: "Lockup · Compact",
    previewSrc: "/brands/jinba/dl/lockup-small-light.png",
    alt: "Jinba compact lockup",
    svgHref: "/brands/jinba/dl/lockup-small.svg",
    // Compact lockup (4.84:1) — very small, for tight spaces
    maxW: "16%",
    maxH: "9%",
    pngVariants: [
      { label: "Black", color: "#000000", href: "/brands/jinba/dl/lockup-small-black.png" },
      { label: "Dark",  color: "#322014", href: "/brands/jinba/dl/lockup-small-dark.png"  },
      { label: "Light", color: "#FAF8F3", href: "/brands/jinba/dl/lockup-small-light.png" },
      { label: "White", color: "#FFFFFF", href: "/brands/jinba/dl/lockup-small-white.png" },
    ],
  },
];

// ─── Sub-brands ──────────────────────────────────────────────────────────────

const SUB_BRANDS = [
  { name: "Flow",    color: "#2C50B5",
    previewSrc:   "/brands/jinba/sub-brands/jinba-flow-glyph.png",
    lockupSrc:    "/brands/jinba/sub-brands/jinba-flow-lockup.png",
    pngHref:      "/brands/jinba/sub-brands/jinba-flow-glyph.png",
    svgHref:      "/brands/jinba/sub-brands/jinba-flow-glyph.svg",
    lockupPngHref:"/brands/jinba/sub-brands/jinba-flow-lockup.png",
    lockupSvgHref:"/brands/jinba/sub-brands/jinba-flow-lockup.svg",
  },
  { name: "App",     color: "#A22727",
    previewSrc:   "/brands/jinba/sub-brands/jinba-app-glyph.png",
    lockupSrc:    "/brands/jinba/sub-brands/jinba-app-lockup.png",
    pngHref:      "/brands/jinba/sub-brands/jinba-app-glyph.png",
    svgHref:      "/brands/jinba/sub-brands/jinba-app-glyph.svg",
    lockupPngHref:"/brands/jinba/sub-brands/jinba-app-lockup.png",
    lockupSvgHref:"/brands/jinba/sub-brands/jinba-app-lockup.svg",
  },
  { name: "Toolbox", color: "#7D95A1",
    previewSrc:   "/brands/jinba/sub-brands/jinba-toolbox-glyph.png",
    lockupSrc:    "/brands/jinba/sub-brands/jinba-toolbox-lockup.png",
    pngHref:      "/brands/jinba/sub-brands/jinba-toolbox-glyph.png",
    svgHref:      "/brands/jinba/sub-brands/jinba-toolbox-glyph.svg",
    lockupPngHref:"/brands/jinba/sub-brands/jinba-toolbox-lockup.png",
    lockupSvgHref:"/brands/jinba/sub-brands/jinba-toolbox-lockup.svg",
  },
];

// ─── Shared ───────────────────────────────────────────────────────────────────

function DownloadIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" className="flex-shrink-0">
      <path d="M6 1v7M3 6l3 3 3-3M1 10h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Primary mark card ───────────────────────────────────────────────────────

function PrimaryMarkCard({ mark }: { mark: PrimaryMark }) {
  return (
    // Mobile: stacked (image full-width, buttons below). sm+: side-by-side.
    <div className="flex flex-col sm:flex-row items-start">

      {/* ── Image canvas ─────────────────────────────────────────────────────
          Mobile: full width. sm+: 75% with fixed aspect ratio.             */}
      <div
        className="relative w-full sm:w-[75%] sm:flex-shrink-0 overflow-hidden rounded-sm"
        style={{ aspectRatio: "16 / 9", backgroundColor: "#322014" }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative" style={{ width: mark.maxW, height: mark.maxH }}>
            <Image
              src={mark.previewSrc}
              alt={mark.alt}
              fill
              className="object-contain"
              sizes="(max-width: 640px) 100vw, 60vw"
            />
          </div>
        </div>
      </div>

      {/* ── Download panel ───────────────────────────────────────────────────
          Mobile: below image, no left indent. sm+: sidebar with indent.    */}
      <div className="flex flex-col gap-5 pt-4 sm:pt-0.5 sm:pl-7 sm:pr-10">
        <span className="text-[14px] text-neutral-600">{mark.label}</span>

        {/* ── Mobile: flat pills, no dropdown ── */}
        <div className="flex flex-row flex-wrap gap-2 lg:hidden">
          <a
            href={mark.svgHref}
            download
            className="inline-flex items-center gap-1.5 text-[11px] text-neutral-500 hover:text-neutral-800 border border-neutral-300 hover:border-neutral-500 rounded-full px-3 py-1.5 transition-colors duration-150"
          >
            <DownloadIcon />
            <span>SVG</span>
          </a>
          {mark.pngVariants.map((v) => (
            <a
              key={v.label}
              href={v.href}
              download
              className="inline-flex items-center gap-1.5 text-[11px] text-neutral-500 hover:text-neutral-800 border border-neutral-300 hover:border-neutral-500 rounded-full px-3 py-1.5 transition-colors duration-150"
            >
              <DownloadIcon />
              <span>PNG {v.label}</span>
            </a>
          ))}
        </div>

        {/* ── Desktop: SVG + hover PNG dropdown ── */}
        <div className="hidden lg:flex flex-col items-start gap-2">
          <a
            href={mark.svgHref}
            download
            className="inline-flex items-center gap-1.5 text-[11px] text-neutral-500 hover:text-neutral-800 border border-neutral-300 hover:border-neutral-500 rounded-full px-3 py-1.5 transition-colors duration-150"
          >
            <DownloadIcon />
            <span>SVG</span>
          </a>
          <div className="group/png flex flex-col items-start gap-1">
            <div className="inline-flex items-center gap-1.5 text-[11px] text-neutral-500 border border-neutral-300 rounded-full px-3 py-1.5 cursor-default select-none">
              <DownloadIcon />
              <span>PNG</span>
            </div>
            <div className="max-h-0 group-hover/png:max-h-48 overflow-hidden transition-[max-height] duration-200 ease-out">
              <div className="flex flex-col gap-1 pt-1">
                {mark.pngVariants.map((v) => (
                  <a
                    key={v.label}
                    href={v.href}
                    download
                    className="inline-flex items-center gap-2 text-[11px] text-neutral-500 hover:text-neutral-800 border border-neutral-300 hover:border-neutral-500 rounded-full px-3 py-1.5 transition-colors duration-150"
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0 border border-black/10"
                      style={{ backgroundColor: v.color }}
                    />
                    {v.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sections ────────────────────────────────────────────────────────────────

function PrimaryLogoSection() {
  return (
    <div className="px-6 sm:px-10 pt-3 pb-6 flex flex-col gap-5">
      {PRIMARY_MARKS.map((mark) => (
        <PrimaryMarkCard key={mark.label} mark={mark} />
      ))}
    </div>
  );
}

function SubBrandBox({
  label, imgSrc, imgAlt, pngHref, svgHref, padding = "30%",
}: {
  label: string; imgSrc: string; imgAlt: string;
  pngHref: string; svgHref: string; padding?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className="relative aspect-square overflow-hidden rounded-sm"
        style={{ backgroundColor: "#F4F1EB" }}
      >
        {/* absolute inset-0 + padding wrapper is the correct pattern for fill images */}
        <div className="absolute inset-0" style={{ padding }}>
          <div className="relative w-full h-full">
            <Image src={imgSrc} alt={imgAlt} fill className="object-contain object-left" sizes="(max-width: 768px) 50vw, 20vw" />
          </div>
        </div>
      </div>
      <div className="flex flex-col xl:flex-row xl:items-center gap-1.5 xl:gap-2">
        <span className="text-[13px] text-neutral-600 xl:flex-1 xl:min-w-0">{label}</span>
        <div className="flex items-center gap-2">
          <a href={pngHref} download className="inline-flex items-center gap-1.5 text-[11px] text-neutral-500 hover:text-neutral-800 border border-neutral-300 hover:border-neutral-500 rounded-full px-3 py-1.5 transition-colors duration-150"><DownloadIcon />PNG</a>
          <a href={svgHref} download className="inline-flex items-center gap-1.5 text-[11px] text-neutral-500 hover:text-neutral-800 border border-neutral-300 hover:border-neutral-500 rounded-full px-3 py-1.5 transition-colors duration-150"><DownloadIcon />SVG</a>
        </div>
      </div>
    </div>
  );
}

function SubBrandsSection() {
  return (
    <div className="px-6 sm:px-10 pt-6 pb-8">

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-x-4 gap-y-6">
        {/* Row 1 — glyphs. All 440×412 (≈1:1). App gets slightly less padding = larger. */}
        {SUB_BRANDS.map((brand) => (
          <SubBrandBox
            key={`${brand.name}-glyph`}
            label={`Jinba ${brand.name} · Glyph`}
            imgSrc={brand.previewSrc}
            imgAlt={`Jinba ${brand.name} glyph`}
            pngHref={brand.pngHref}
            svgHref={brand.svgHref}
            padding={brand.name === "App" ? "28%" : "30%"}
          />
        ))}
        <div className="hidden xl:block" />

        {/* Row 2 — lockups. Padding tuned per aspect ratio so rendered heights equalise.
            Flow 3.36:1 → 13% h-pad. App 2.71:1 → 10% (touch taller). Toolbox 4.71:1 → 3% to compensate wide ratio. */}
        {SUB_BRANDS.map((brand) => (
          <SubBrandBox
            key={`${brand.name}-lockup`}
            label={`Jinba ${brand.name} · Lockup`}
            imgSrc={brand.lockupSrc}
            imgAlt={`Jinba ${brand.name} lockup`}
            pngHref={brand.lockupPngHref}
            svgHref={brand.lockupSvgHref}
            padding={
              brand.name === "Flow"    ? "20% 20%" :
              brand.name === "App"     ? "18% 17%" :
                                         "20% 10%"
            }
          />
        ))}
        <div className="hidden xl:block" />
      </div>
    </div>
  );
}

export function LogoSystemSection() {
  return (
    <section>
      <PrimaryLogoSection />
      <SubBrandsSection />
    </section>
  );
}
