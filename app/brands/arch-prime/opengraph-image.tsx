import { archPrime } from "@/lib/brands/arch-prime";
import { brandOgImage, OG_SIZE } from "@/lib/brands/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Arch Prime — Brand Identity & Design System";

export default function Image() {
  return brandOgImage(archPrime);
}
