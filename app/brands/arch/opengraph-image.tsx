import { arch } from "@/lib/brands/arch";
import { brandOgImage, OG_SIZE } from "@/lib/brands/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Arch Network — Brand Identity & Design System";

export default function Image() {
  return brandOgImage(arch);
}
