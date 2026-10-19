import { honeyb } from "@/lib/brands/honeyb";
import { brandGuideResponse, FONTS } from "@/lib/brands/guide";

// HoneyB's page as JSON, for the Asset Generator's brand page (lib/brands/guide.ts).
export const dynamic = "force-static";

export function GET() {
  return brandGuideResponse(honeyb, [FONTS.poly, FONTS.inter]);
}
