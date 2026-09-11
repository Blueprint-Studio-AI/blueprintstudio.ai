// /brands/honeyb — rendered entirely from the shared brand kit.
import BrandKitPage from "@/components/brands/kit/BrandKitPage";
import { measure } from "@/lib/brands/measure";
import { honeyb } from "@/lib/brands/honeyb";

// Prerendered once per deploy: measure() reads file sizes off disk at build
// time, and next.config keeps public/ out of this route's function.
export const dynamic = "force-static";

export default function HoneybBrandPage() {
  return <BrandKitPage brand={measure(honeyb)} />;
}
