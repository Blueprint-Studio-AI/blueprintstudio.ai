import { honeyb } from "@/lib/brands/honeyb";
import { brandOgImage, OG_SIZE } from "@/lib/brands/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "HoneyB — Brand Identity & Design System";

export default function Image() {
  return brandOgImage(honeyb);
}
