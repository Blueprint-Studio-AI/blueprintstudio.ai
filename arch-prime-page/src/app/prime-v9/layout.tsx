import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { SiteFooter } from "@/components/site-footer";
import { SmoothScroll } from "@/components/smooth-scroll";
import { jakarta } from "@/lib/fonts";
import { EarlyAccess } from "@/components/prime-v6/early-access";
import { MobileCta } from "@/components/prime-v6/mobile-cta";
import { VersionSwitch } from "@/components/prime-v6/version-switch";
import { V6 } from "@/data/prime-v6";
import { V9 } from "@/data/prime-v9";
import "../prime/prime.css";
// The assembled sections keep their own stylesheets; v9 loads all three.
import "../prime-v6/prime-v6.css";
import "../prime-v7/prime-v7.css";
import "../prime-v8/prime-v8.css";
import "./prime-v9.css";

// /prime-v9 — sections assembled from v5 to v8 (local prototype). Same shell as v6 to v8: one
// Lenis instance, the site nav, .prime-scope for the app's tokens and Plus Jakarta Sans, the
// early-access dialog every CTA opens, and the phone CTA bar. The footer is v5's — the site
// footer — rather than v6's quiet one.

export const metadata: Metadata = {
  title: { absolute: "Prime v9 (prototype) | Arch" },
  description: V9.meta,
  robots: { index: false, follow: false },
};

export default function PrimeV9Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <SmoothScroll>
      {/* lightHero: the hero's photograph closes into a light ground, so the nav reads dark
          except where a section flags itself dark */}
      <Nav lightHero />
      <div className={`prime-scope ${jakarta.variable}`}>{children}</div>
      <SiteFooter variant="home" />
      <div className={`prime-scope ${jakarta.variable}`}>
        <EarlyAccess copy={V6.early} />
        <MobileCta label={V6.cta.primary} hideOver={["top", "peak"]} />
      </div>
      <VersionSwitch />
    </SmoothScroll>
  );
}
