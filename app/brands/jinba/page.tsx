// /brands/jinba — rendered entirely from the shared brand kit.
// The page is one line because everything brand-specific lives in the config.
import BrandKitPage from "@/components/brands/kit/BrandKitPage";
import { measure } from "@/lib/brands/measure";
import { jinba } from "@/lib/brands/jinba";

// Prerendered once per deploy: measure() reads file sizes off disk at build
// time, and next.config keeps public/ out of this route's function.
export const dynamic = "force-static";

export default function JinbaBrandPage() {
  return <BrandKitPage brand={measure(jinba)} />;
}
