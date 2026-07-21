// /brands/jinba — rendered entirely from the shared brand kit.
// The page is one line because everything brand-specific lives in the config.
import BrandKitPage from "@/components/brands/kit/BrandKitPage";
import { jinba } from "@/lib/brands/jinba";

export default function JinbaBrandPage() {
  return <BrandKitPage brand={jinba} />;
}
