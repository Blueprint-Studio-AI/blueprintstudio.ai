import type { Metadata, Viewport } from "next";
import type { BrandConfig } from "@/components/brands/kit/types";

// Route metadata shared by every /brands/* page. The title/description shape
// is the one main already ranks Jinba under, so it's kept verbatim.
const SITE = "https://blueprintstudio.ai";
const titleFor = (b: BrandConfig) => `${b.name} — Brand Identity & Design System`;
const descFor = (b: BrandConfig) =>
  `Brand identity, logo system, color palette, typography, and design system for ${b.name} — crafted by Blueprint Studio.`;

/**
 * `og` is a static 1200×630 image, if the brand has one. Brands that instead
 * ship an `opengraph-image.tsx` in their route segment omit it — Next injects
 * the generated image's tags itself and would be overridden by an explicit one.
 */
export function brandMetadata(b: BrandConfig, og?: string): Metadata {
  const title = titleFor(b);
  const description = descFor(b);
  const path = `/brands/${b.slug}`;
  return {
    title,
    description,
    keywords: [
      "brand identity case study",
      "design system",
      "logo system",
      "color palette",
      "typography",
      "brand guidelines",
      b.name,
    ],
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: "Blueprint Studio",
      url: path,
      title,
      description,
      ...(og && { images: [{ url: og, width: 1200, height: 630, alt: title }] }),
    },
    twitter: { card: "summary_large_image", title, description, ...(og && { images: [og] }) },
  };
}

/**
 * Page-level structured data. The root layout already provides WebSite + Organization.
 * `image` defaults to the route's generated share image, so search results show
 * the same picture as a Slack or LinkedIn unfurl.
 */
export function BrandJsonLd({ brand, image = `/brands/${brand.slug}/opengraph-image` }: { brand: BrandConfig; image?: string }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: titleFor(brand),
    description: descFor(brand),
    url: `${SITE}/brands/${brand.slug}`,
    image: `${SITE}${image}`,
    about: brand.name,
    creator: { "@type": "Organization", name: "Blueprint Studio", url: SITE },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

/**
 * Browser chrome colour for the route: Android Chrome and iOS Safari up to 18
 * tint their toolbars with it. The site-wide default is the marketing pages'
 * light grey; use the hero's own field. (iOS 26 Safari ignores theme-color.)
 */
export const brandViewport = (b: BrandConfig): Viewport => ({ themeColor: b.hero.background ?? b.brandInk });
