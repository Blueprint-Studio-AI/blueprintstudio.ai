import type { BrandConfig } from "@/components/brands/kit/types";
import { measure } from "./measure";

// A brand page's content as JSON, at /brands/<slug>/guide.json. The Asset
// Generator's brand pages (tools.blueprintstudio.ai) draw the same kit from it,
// so a client sees the same page in the app as here. Built from the object the
// page renders, so the two can't drift.
//
// Paths stay site-relative ("/brands/arch/…"): a reader resolves them against
// the URL it fetched the guide from. fontFaces names the open-licence web fonts
// behind the type specimens, served from /brands/_fonts. Gascogne isn't there:
// it's licensed and only ever served through next/font (see ../../app/brands/_fonts).

export interface GuideFont {
  family: string;
  src: string;
  /** "400", or a variable font's range, "100 900" */
  weight?: string;
  style?: "normal" | "italic";
}

const F = "/brands/_fonts";

/** Google Fonts' latin files for the faces the brand pages load with next/font/google (SIL OFL). */
export const FONTS = {
  geist: { family: "Geist", src: `${F}/geist/geist-variable.woff2`, weight: "100 900" },
  inter: { family: "Inter", src: `${F}/inter/inter-variable.woff2`, weight: "100 900" },
  jakarta: {
    family: "Plus Jakarta Sans",
    src: `${F}/plus-jakarta-sans/plus-jakarta-sans-variable.woff2`,
    weight: "200 800",
  },
  poly: { family: "Poly", src: `${F}/poly/poly-regular.woff2`, weight: "400" },
} satisfies Record<string, GuideFont>;

export function brandGuideResponse(brand: BrandConfig, fontFaces: GuideFont[]) {
  return Response.json(
    { guide: { ...measure(brand), fontFaces } },
    { headers: { "Cache-Control": "public, max-age=0, must-revalidate" } },
  );
}
