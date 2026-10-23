import type { BrandConfig } from "@/components/brands/kit/types";
import { arch } from "./arch";
import { archPrime } from "./arch-prime";
import { honeyb } from "./honeyb";
import { jinba } from "./jinba";

// Every /brands/<slug> page's config, by slug, for pages that point at them
// (the industry pages' case-study callouts).
export const brandsBySlug: Record<string, BrandConfig> = {
  [arch.slug]: arch,
  [archPrime.slug]: archPrime,
  [honeyb.slug]: honeyb,
  [jinba.slug]: jinba,
};
