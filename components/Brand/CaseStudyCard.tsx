"use client";

export interface CaseStudy {
  /** Brand logo lockup. */
  logo: string;
  /** Logo alt / brand name. */
  name: string;
  /** Logo height in px (logos have different proportions). */
  logoHeight?: number;
  /** One-line project headline. */
  title: string;
  /** Supporting paragraph. */
  description: string;
  /** Numbered deliverable chips. */
  deliverables: { num: string; label: string }[];
  /** Destination for "View Full Project". */
  href: string;
  /**
   * Solid colour for the project visual panel. Used as the panel background —
   * it shows on its own as a placeholder, or sits behind `image` if one is set.
   */
  accent: string;
  /** Optional desktop visual; fills the right-hand panel (object-cover) over `accent`. */
  image?: string;
  /** Optional stacked-layout (mobile/tablet) visual; fills the top panel. Its
   *  baked-in bottom fade melts into the copy below. */
  imageMobile?: string;
}

/**
 * Case-study card — fully self-contained (nothing bleeds outside the rounded
 * frame). Desktop: copy on the left, a visual panel on the right. Mobile: the
 * panel stacks on top of the copy. The visual is a solid colour placeholder
 * for now; dropping a real image into the same slot needs no layout changes.
 */
export default function CaseStudyCard({
  logo,
  name,
  logoHeight = 28,
  title,
  description,
  deliverables,
  accent,
  image,
  imageMobile,
}: CaseStudy) {
  return (
    <div className="group block w-full overflow-hidden rounded-2xl border border-neutral-200 bg-white sm:rounded-3xl">
      <div className="flex flex-col lg:flex-row">
        {/* Visual panel — a tall mockup on top when stacked (mobile/tablet), the
            right-hand column when side-by-side (lg+). `accent` is the background;
            `imageMobile` fills the stacked panel (its baked-in fade melts into the
            copy below) and `image` fills the desktop column. */}
        <div
          className="relative order-first aspect-[495/399] w-full overflow-hidden lg:order-last lg:aspect-auto lg:h-auto lg:min-h-[420px] lg:w-[56%] lg:self-stretch"
          style={{ backgroundColor: accent }}
          aria-hidden="true"
        >
          {imageMobile && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={imageMobile}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-out will-change-transform group-hover:scale-[1.04] lg:hidden"
            />
          )}
          {image && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={image}
              alt=""
              loading="lazy"
              // Subtle "peek behind the curtain" zoom on hover.
              className="hidden h-full w-full object-cover transition-transform duration-700 ease-out will-change-transform group-hover:scale-[1.04] lg:block"
            />
          )}
        </div>

        {/* Copy — vertically centred with airy gaps between the logo block, the
            chips, and the link, mirroring the Figma. */}
        <div className="flex flex-1 flex-col justify-center gap-9 p-6 sm:gap-10 sm:p-9 lg:gap-12 lg:p-10">
          <div className="flex flex-col gap-6 sm:gap-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logo}
              alt={name}
              style={{ height: logoHeight }}
              className="w-auto object-contain object-left"
            />

            <div className="flex flex-col gap-3 sm:gap-4">
              <h3 className="text-[18px] font-medium leading-[1.25] tracking-[-0.36px] text-black sm:text-[20px]">
                {title}
              </h3>
              <p className="max-w-[360px] text-[15px] leading-[1.4] tracking-[-0.2px] text-[#525252] sm:text-base">
                {description}
              </p>
            </div>
          </div>

          {/* Deliverable chips */}
          <div className="flex flex-wrap gap-2.5">
            {deliverables.map((d) => (
              <div
                key={d.num}
                className="flex items-center gap-2 rounded-full bg-[#f6f6f6] px-3.5 py-2 text-sm"
              >
                <span className="text-[#c2c6cc]">{d.num}</span>
                <span className="text-neutral-800">{d.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
