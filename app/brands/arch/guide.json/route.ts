import { arch } from "@/lib/brands/arch";
import { brandGuideResponse, FONTS } from "@/lib/brands/guide";

// Arch Network's page as JSON, for the Asset Generator's brand page (lib/brands/guide.ts).
export const dynamic = "force-static";

export function GET() {
  return brandGuideResponse(arch, [FONTS.geist]);
}
