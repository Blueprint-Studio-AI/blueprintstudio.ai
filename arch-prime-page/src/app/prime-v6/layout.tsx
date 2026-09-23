import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { SmoothScroll } from "@/components/smooth-scroll";
import { jakarta } from "@/lib/fonts";
import { EarlyAccess } from "@/components/prime-v6/early-access";
import { MobileCta } from "@/components/prime-v6/mobile-cta";
import { PrimeFooter } from "@/components/prime-v6/prime-footer";
import { VersionSwitch } from "@/components/prime-v6/version-switch";
import { V6 } from "@/data/prime-v6";
import "../prime/prime.css";

// /prime-v6 — the refocused Prime page, built from the section map (local prototype; /prime, v5,
// is untouched). Same shell as /prime: one Lenis instance, the site nav, .prime-scope for the
// app's tokens and Plus Jakarta Sans. Differences: a quiet footer (the view is the ending), the
// early-access dialog every CTA opens, a phone-only CTA bar, and the review switcher.

export const metadata: Metadata = {
  title: { absolute: "Prime v6 (prototype) | Arch" },
  description: V6.meta,
  robots: { index: false, follow: false },
};

export default function PrimeV6Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <SmoothScroll>
      {/* lightHero: the hero's photograph closes into a light ground long before a viewport of
          scroll, so the nav reads dark except where a section flags itself dark */}
      <Nav lightHero />
      <div className={`prime-scope ${jakarta.variable}`}>{children}</div>
      <PrimeFooter line={V6.footer} />
      <div className={`prime-scope ${jakarta.variable}`}>
        <EarlyAccess copy={V6.early} />
        <MobileCta label={V6.cta.primary} hideOver={["top", "bank", "view"]} />
      </div>
      <VersionSwitch />
    </SmoothScroll>
  );
}
