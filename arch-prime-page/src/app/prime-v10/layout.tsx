import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { SmoothScroll } from "@/components/smooth-scroll";
import { jakarta } from "@/lib/fonts";
import { EarlyAccess } from "@/components/prime-v6/early-access";
import { MobileCta } from "@/components/prime-v6/mobile-cta";
import { PrimeFooter } from "@/components/prime-v6/prime-footer";
import { VersionSwitch } from "@/components/prime-v6/version-switch";
import { V10 } from "@/data/prime-v10";
import "../prime/prime.css";
import "./prime-v10.css";

// /prime-v10 — built section by section (local prototype, never pushed). The shell is v8/v9's:
// one Lenis instance, the site nav (lightHero: the hero's photograph closes into a light ground,
// so the nav reads dark except where a region flags itself dark), .prime-scope for the app's
// tokens and Plus Jakarta Sans, the early-access dialog every CTA opens, the phone pill, the
// quiet footer and the review switcher.

export const metadata: Metadata = {
  title: { absolute: "Prime v10 (prototype) | Arch" },
  description: V10.meta,
  robots: { index: false, follow: false },
};

export default function PrimeV10Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <SmoothScroll>
      <Nav lightHero />
      <div className={`v10-page prime-scope ${jakarta.variable}`}>{children}</div>
      <PrimeFooter line={V10.footer} />
      <div className={`prime-scope ${jakarta.variable}`}>
        <EarlyAccess copy={V10.early} />
        <MobileCta label={V10.cta.primary} hideOver={V10.pillHidden} />
      </div>
      <VersionSwitch />
    </SmoothScroll>
  );
}
