import { homeOgImage, OG_ALT, OG_SIZE } from "@/lib/og/home";

// The link preview for the home page, and for any page without its own.
export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = OG_ALT;

export default function Image() {
  return homeOgImage();
}
