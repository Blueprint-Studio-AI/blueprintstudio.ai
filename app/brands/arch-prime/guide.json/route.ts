import { archPrime } from "@/lib/brands/arch-prime";
import { brandGuideResponse, FONTS } from "@/lib/brands/guide";

// Arch Prime's page as JSON, for the Asset Generator's brand page (lib/brands/guide.ts).
export const dynamic = "force-static";

export function GET() {
  return brandGuideResponse(archPrime, [FONTS.jakarta, FONTS.inter]);
}
