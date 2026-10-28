import { brandsBySlug } from "@/lib/brands";
import { workShowcase, type ShownWork } from "@/lib/work";
import { TEXT_INSET, WIDE } from "../../WorkHeader";
import type { GalleryProps } from "..";
import SwatchFan, { type BrandBlade } from "./SwatchFan";

// /work/branding's gallery: every brand as a blade of a swatch fan. The data is
// read here, on the server, so the brand configs never ship to the browser.
//
// Colours come only from the brands' own kits (lib/brands); a brand without
// one carries its kit stills on its blade instead, never a guessed colour.

/** The still that shows the mark best, where it isn't the kit's first. */
const TOP_STILL: Record<string, number> = { "jinba-brand": 1, "arch-brand": 1, "arch-btc-summit": 2 };

/** Marks for brands without a kit page: our logo files (all drawn for a light ground). */
const MARKS: Record<string, { src: string; dark: boolean }> = {
  "arch-btc-summit": { src: "/logos-match-height/btc-summit-vegas.png", dark: false },
  "bump-brand": { src: "/logos-match-height/bump-wordmark.png", dark: false },
  "autara-brand": { src: "/logos-match-height/autara.png", dark: false },
  "uni-brand": { src: "/logos-match-height/uni.png", dark: false },
  "huch-brand": { src: "/logos-match-height/huch.png", dark: false },
};

/** Brands named apart from their client (Arch has three on the fan), and what they are where the title doesn't say. */
const NAMES: Record<string, string> = { "arch-btc-summit": "BTC All-In Summit" };
const KINDS: Record<string, string> = { "arch-btc-summit": "Event identity" };

function blade(work: ShownWork): BrandBlade {
  const brand = work.brandPage ? brandsBySlug[work.brandPage] : undefined;
  const name = NAMES[work.slug] ?? brand?.name ?? work.client.name;
  const top = TOP_STILL[work.slug] ?? 0;
  const stills = [work.kit.stills[top], ...work.kit.stills.filter((_, i) => i !== top)];
  const family = brand && Object.values(brand.families)[0];
  return {
    slug: work.slug,
    name,
    // The blade's end is narrow: a long name gives way to the work's short label.
    short: name.length > 13 ? work.label : name,
    // The client where it isn't the name, what it is, and the year.
    meta: [
      name !== work.client.name && work.client.name,
      KINDS[work.slug] ?? (work.title.toLowerCase().includes(name.toLowerCase()) ? "Identity" : work.title),
      work.year,
    ].filter((x): x is string => !!x),
    title: work.title,
    year: work.year,
    stills: stills.map(({ src, alt }) => ({ src, alt })),
    palette: brand ? [...brand.primary, ...brand.secondary].map((s) => ({ name: s.name.replace(/-/g, " "), hex: s.inspect.toUpperCase(), bg: s.bg })) : [],
    mark: family?.marks.lockup ? { src: family.marks.lockup.src, dark: false } : MARKS[work.slug],
    showcase: workShowcase(work),
  };
}

export default function BrandingGallery({ works }: GalleryProps) {
  return (
    // The same space below it as between the pieces (STACK).
    <div className={`${WIDE} ${TEXT_INSET} mb-20 sm:mb-24 lg:mb-28`}>
      <SwatchFan blades={works.map(blade)} />
    </div>
  );
}
