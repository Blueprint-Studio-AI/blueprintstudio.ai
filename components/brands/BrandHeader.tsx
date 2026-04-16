import Image from "next/image";

interface BrandHeaderProps {
  clientName: string;
  /** Banner background image */
  bannerSrc?: string;
  /** Centered logo overlay — light version */
  logoSrc?: string;
  /** Subtitle line centered below logo */
  subtitle?: string;
  /** PDF download — shown at bottom of banner on tablet/mobile (no ToC) */
  pdfHref?: string;
}

export function BrandHeader({ clientName, bannerSrc, logoSrc, subtitle, pdfHref }: BrandHeaderProps) {
  return (
    <div className="relative w-full overflow-hidden aspect-[16/7] sm:aspect-[16/5]">
      {/* Banner background */}
      {bannerSrc ? (
        <Image
          src={bannerSrc}
          alt={clientName}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      ) : (
        <div className="absolute inset-0 bg-[#322014]" />
      )}

      {/* Centered overlay — logo + subtitle */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
        {logoSrc && (
          <div className="relative" style={{ width: "clamp(160px, 24vw, 360px)", height: "clamp(36px, 5.4vw, 81px)" }}>
            <Image
              src={logoSrc}
              alt={clientName}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 40vw, 20vw"
            />
          </div>
        )}
        {subtitle && (
          <p className="text-[clamp(11px,1.1vw,14px)] text-white/80 tracking-[0.06em]">
            {subtitle}
          </p>
        )}
      </div>

      {/* Brand Deck download — bottom of banner, tablet/mobile only (no ToC visible) */}
      {pdfHref && (
        <div className="absolute bottom-7 left-0 right-0 flex justify-center lg:hidden">
          <a
            href={pdfHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[11px] text-white/80 hover:text-white border border-white/30 hover:border-white/60 rounded-full px-4 py-2 transition-colors duration-150 backdrop-blur-sm"
          >
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
              <path d="M6 1v7M3 6l3 3 3-3M1 10h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Brand Deck
          </a>
        </div>
      )}
    </div>
  );
}
