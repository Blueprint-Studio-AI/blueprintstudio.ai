import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { SmoothScroll } from "@/components/smooth-scroll";
import { jakarta } from "@/lib/fonts";
import { EarlyAccess } from "@/components/prime-v6/early-access";
import { MobileCta } from "@/components/prime-v6/mobile-cta";
import { PrimeFooter } from "@/components/prime-v6/prime-footer";
import { VersionSwitch } from "@/components/prime-v6/version-switch";
import { V8 } from "@/data/prime-v8";
import "../prime/prime.css";

// /prime-v8 — a local prototype built from the design lead's own layout (hero → the dark tower,
// climbed floor by floor → the penthouse → questions). v5–v7 are untouched at their own routes.
// Shared infrastructure only: Arch's nav (its button is the page's one action), the early-access
// dialog, the phone pill, the quiet footer, the review switcher. The page is src/components/prime-v8/.

export const metadata: Metadata = {
  title: { absolute: "Prime v8 (prototype) | Arch" },
  description: V8.meta,
  robots: { index: false, follow: false },
};

export default function PrimeV8Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <SmoothScroll>
      <Nav />
      <div className={`prime-scope ${jakarta.variable}`}>{children}</div>
      <PrimeFooter line={V8.footer} />
      <div className={`prime-scope ${jakarta.variable}`}>
        <EarlyAccess copy={V8.early} />
        <MobileCta label={V8.cta.primary} hideOver={V8.pillHidden} />
      </div>
      <VersionSwitch />
    </SmoothScroll>
  );
}
