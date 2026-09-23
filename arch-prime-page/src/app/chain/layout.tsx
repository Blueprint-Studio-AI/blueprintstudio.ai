import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { SiteFooter } from "@/components/site-footer";
import { ChainBelow } from "@/components/chain-below";
import { SmoothScroll } from "@/components/smooth-scroll";
// import { BreakpointOverlay } from "@/components/breakpoint-overlay"; // DEV overlay — re-enable to dial breakpoints
import "./chain.css";

export const metadata: Metadata = {
  title: { absolute: "Chain | Arch" },
  description:
    "The financial chain for native Bitcoin. Borrow, earn, and swap real BTC — and it stays yours the whole way. DeFi that actually works.",
  alternates: { canonical: "/chain" },
  // Chain-specific share card (overrides the generic site OG). 1200×630, brand-matched to the home OG.
  openGraph: {
    title: "The financial chain for Native Bitcoin",
    images: [{ url: "/img/og-chain.png", width: 1200, height: 630, alt: "Arch — The financial chain for Native Bitcoin" }],
  },
  twitter: {
    title: "The financial chain for Native Bitcoin",
    images: [{ url: "/img/og-chain.png", alt: "Arch — The financial chain for Native Bitcoin" }],
  },
};

// The chain page is one continuous Lenis-smoothed scroll experience: the hero is a pinned
// scroll-progress "scrub" (the fixed overlays + the .snaps track), and the below-fold
// "How it works" is a pinned story — both driven purely by scroll position, no wheel
// hijacking. Wrapping in SmoothScroll gives /chain the SAME single Lenis instance the rest
// of the site uses, so there is exactly one scroll authority (this is what fixed the old
// glitch where the hero's and the section's competing wheel machines fought each other).
// The .chain-scope wrapper namespaces its global-ish CSS so it can't leak into the rest of
// the Tailwind site.
export default function ChainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SmoothScroll>
      {/* DEV: breakpoint name overlay — re-enable the import + this line to dial breakpoints */}
      {/* <BreakpointOverlay /> */}
      <Nav lightHero />
      <div className="chain-scope">{children}</div>
      {/* Below-fold renders as a REAL sibling OUTSIDE .chain-scope (the namespaced reset would
          clobber its Tailwind spacing). It needs to sit above the hero's fixed overlays (z-1/z-2)
          so it stays clickable once the hero is occluded — but BELOW the footer (z-5), whose
          rounded `-mt-10` top is meant to overlap the section above it. z-10 was covering that
          rounded top (flattening it); z-[3] keeps it above the hero yet under the footer. */}
      <div className="relative z-[3]">
        <ChainBelow />
      </div>
      <SiteFooter variant="home" />
    </SmoothScroll>
  );
}
