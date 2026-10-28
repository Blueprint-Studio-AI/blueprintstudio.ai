import { homeOgImage, OG_ALT, OG_SIZE } from "@/lib/og/home";

// X's card: the same picture as app/opengraph-image.tsx.
export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = OG_ALT;

export default function Image() {
  return homeOgImage();
}
