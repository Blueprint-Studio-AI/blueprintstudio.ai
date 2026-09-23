import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { SmoothScroll } from "@/components/smooth-scroll";
import { jakarta } from "@/lib/fonts";
import { EarlyAccess } from "@/components/prime-v6/early-access";
import { MobileCta } from "@/components/prime-v6/mobile-cta";
import { PrimeFooter } from "@/components/prime-v6/prime-footer";
import { VersionSwitch } from "@/components/prime-v6/version-switch";
import { V7 } from "@/data/prime-v7";
import "../prime/prime.css";

// /prime-v7 — "the ascent": a local prototype (v5 at /prime and v6 at /prime-v6 are untouched).
// The shell is the site's: one Lenis instance, Arch's nav (its button swaps to the page's one
// action), .prime-scope for the app's tokens and Plus Jakarta Sans. Shared infrastructure from
// v6: the early-access dialog, the phone pill, the quiet footer, the review switcher. Everything
// on the page itself is new: src/components/prime-v7/.

export const metadata: Metadata = {
  title: { absolute: "Prime v7 (prototype) | Arch" },
  description: V7.meta,
  robots: { index: false, follow: false },
};

export default function PrimeV7Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <SmoothScroll>
      <Nav />
      <div className={`prime-scope ${jakarta.variable}`}>{children}</div>
      <PrimeFooter line={V7.footer} />
      <div className={`prime-scope ${jakarta.variable}`}>
        <EarlyAccess copy={V7.early} />
        <MobileCta label={V7.cta.primary} hideOver={["street", "view"]} />
      </div>
      <VersionSwitch />
    </SmoothScroll>
  );
}
