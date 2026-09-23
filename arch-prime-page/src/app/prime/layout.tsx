import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { SiteFooter } from "@/components/site-footer";
import { SmoothScroll } from "@/components/smooth-scroll";
import { jakarta } from "@/lib/fonts";
import "./prime.css";

export const metadata: Metadata = {
  title: { absolute: "Prime | Arch" },
  description:
    "Build the Bank. Deposit to earn from day one, then run a prime brokerage account against your bitcoin: hold primeBTC and earn, borrow against it, trade, and post it as margin. Settled on Bitcoin.",
  alternates: { canonical: "/prime" },
  // ponytail: no dedicated OG image yet; falls back to the site card. Add /img/og-prime.png when the page is real.
};

// Same shape as /chain: one Lenis instance for the whole page so the pinned "How Prime works"
// story can route its snaps through it. The hero is a dark photograph, flagged for the nav, so
// the nav reads light over it and dark once scrolled. .prime-scope carries the app's tokens and
// Plus Jakarta Sans for the page body; the site chrome stays on Geist.
export default function PrimeLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <SmoothScroll>
      <Nav />
      <div className={`prime-scope ${jakarta.variable}`}>{children}</div>
      <SiteFooter variant="home" />
    </SmoothScroll>
  );
}
