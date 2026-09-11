import { jinba } from "@/lib/brands/jinba";
import { brandDocMarkdown } from "@/lib/brands/doc";

// Jinba's design system, generated from its BrandConfig on request.
//
// A route rather than a checked-in file: the doc is derived entirely from the
// same object the page renders, so it cannot drift, and there's no build step or
// regenerated artefact to remember. HoneyB points at a static file instead
// because its doc is hand-authored and says more than the config knows.
export const dynamic = "force-static";

export function GET() {
  return new Response(brandDocMarkdown(jinba), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": 'inline; filename="jinba-design.md"',
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
