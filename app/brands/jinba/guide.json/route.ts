import { jinba } from "@/lib/brands/jinba";
import { brandGuideResponse, FONTS } from "@/lib/brands/guide";

// Jinba's page as JSON, for the Asset Generator's brand page (lib/brands/guide.ts).
// Its display face, Tiempos Text, isn't loaded on the page either.
export const dynamic = "force-static";

export function GET() {
  return brandGuideResponse(jinba, [FONTS.geist]);
}
