import { arch } from "@/lib/brands/arch";
import { brandDocMarkdown } from "@/lib/brands/doc";

// Arch Network's design system, generated from its BrandConfig on request —
// derived from the same object the page renders, so it cannot drift.
export const dynamic = "force-static";

export function GET() {
  return new Response(brandDocMarkdown(arch), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": 'inline; filename="design.md"',
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
