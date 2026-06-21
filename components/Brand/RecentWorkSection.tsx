"use client";

import { useEffect, useRef } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import CaseStudyCard, { CaseStudy } from "./CaseStudyCard";

// Case studies shown in the stacking scroll. Each renders as a CaseStudyCard.
// `color` is the accent the section's bottom colour band fades to while that
// card is active; `accent` is the solid placeholder colour for the card's
// visual panel (swap for a real image per brand later). Add more entries and
// the stack grows automatically.
const projects: (CaseStudy & { id: number; color: string })[] = [
  {
    id: 1,
    color: "#F0831F", // honey
    accent: "#F4A93C",
    name: "HoneyB",
    logo: "/logos/HoneyB-Logo.png",
    logoHeight: 26,
    title: "Bitcoin yield platform",
    description:
      "From blank slate to market-ready in one package. We built HoneyB’s entire brand presence as a single cohesive system.",
    deliverables: [
      { num: "01", label: "Brand" },
      { num: "02", label: "Website" },
      { num: "03", label: "Deck" },
    ],
    image: "/media/recent-work/honeyb-desktop.webp",
    imageMobile: "/media/recent-work/honeyb-mobile.webp",
    href: "/work",
  },
  {
    id: 2,
    color: "#A8763E", // warm brown
    accent: "#B98A55",
    name: "Jinba",
    logo: "/brands/jinba/dl/lockup-black.png",
    logoHeight: 30,
    title: "Bitcoin Stablecoin",
    description:
      "Complete brand identity for a Bitcoin stablecoin. Logo system, brand narrative, type & palette, and visual language.",
    deliverables: [
      { num: "01", label: "Brand" },
      { num: "02", label: "Website" },
    ],
    image: "/media/recent-work/jinba-desktop.webp",
    imageMobile: "/media/recent-work/jinba-mobile.webp",
    href: "/work",
  },
  {
    id: 3,
    color: "#731416", // autara maple red
    accent: "#F0ECE8", // cream panel bg (behind the mockup)
    name: "Autara",
    logo: "/logos/autara.png",
    logoHeight: 30,
    title: "Defi on Arch Network",
    description:
      "Logo system, type palette, social kit, brand deck, and Framer landing page.",
    deliverables: [
      { num: "01", label: "Brand" },
      { num: "02", label: "Website" },
    ],
    image: "/media/projects/autara/recent-work-card.webp",
    imageMobile: "/media/recent-work/autara-mobile.webp",
    href: "/work",
  },
];

const PARALLAX_DISTANCE = 400;
// DESKTOP (lg+) ONLY: every card pins at the SAME spot and fully covers the
// previous, with a uniform scroll gap below each card so it sits alone before
// the next rises to cover it. Keeping the gap uniform lets the stack exit as one
// piece. Below lg the cards are a plain vertical list (see the mobile
// early-return in handleScroll).

export default function RecentWorkSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleScroll = () => {
      // Below lg the cards are a plain vertical list — no pin, no parallax, no
      // colour band. Clear any transforms a previous desktop frame applied.
      if (window.innerWidth < 1024) {
        section.style.transform = "";
        section.style.marginBottom = "";
        if (headerRef.current) headerRef.current.style.top = "";
        return;
      }
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      // Read the last card's position BEFORE mutating this frame's transform,
      // so it reflects the transform that's currently applied (reading it after
      // the mutation returns a stale value, esp. with smooth-scroll).
      const lastCardEl = cardRefs.current[cardRefs.current.length - 1];
      const lastCardTopNow = lastCardEl
        ? lastCardEl.getBoundingClientRect().top
        : Infinity;

      const raw = (viewportHeight - rect.top) / viewportHeight;
      const progress = Math.max(0, Math.min(1, raw));
      const shift = progress * PARALLAX_DISTANCE;
      section.style.transform = `translateY(${-shift}px)`;
      // Pull the next section up by the same amount the parallax transform
      // shifts this one, keeping the seam closed with no dead gap.
      section.style.marginBottom = `${-shift}px`;
      // The sticky header lives inside the transformed section, so its `top`
      // must cancel the current transform to pin at the viewport top. BUT once
      // the last card starts scrolling away (exiting), let the header ride UP
      // with the stack at the same rate — otherwise the cards slide underneath
      // it on the way out. (headerRelease ≤ 0 = how far the last card has risen
      // past its centered position.)
      const headerRelease = Math.min(0, lastCardTopNow - 0.23 * viewportHeight);
      if (headerRef.current) {
        headerRef.current.style.top = `${shift + headerRelease}px`;
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="portfolio"
      // z-[15] sits ABOVE the section this one parallax-covers (z-10) but BELOW
      // the testimonials section that follows (z-20), so the testimonials'
      // opaque background cleanly masks the seam as the stack exits.
      className="relative z-[15] bg-neutral-50 will-change-transform"
    >
      {/* Sticky section header — stays pinned to the top of the viewport while
          the cards scroll through. The +PARALLAX_DISTANCE in `top` compensates
          for the section's upward parallax transform (same trick the cards use)
          so it pins at the real viewport top, not 400px down. The opaque bg
          hides the cards scrolling underneath it. */}
      <div
        ref={headerRef}
        className="z-[20] bg-neutral-50 lg:sticky"
        style={{ top: `${PARALLAX_DISTANCE}px` }}
      >
        <SectionHeader leftText="RECENTLY LAUNCHED" rightText="// FOR FOUNDERS" />
      </div>

      <div className="relative">
        <div className="px-2.5 sm:px-6 relative z-10">
          <div className="h-[18vh]" />

          <div className="relative max-w-5xl mx-auto pb-[8vh]">
            {projects.map((project, i) => (
              <div
                key={project.id}
                ref={(el) => { cardRefs.current[i] = el; }}
                // Sticky-stack on EVERY breakpoint so the interaction is
                // consistent: each card pins and the next rises to cover it.
                // Mobile pins near the top; lg+ pins so the card's CENTER lands
                // at mid-viewport: the card is vertically centered in a 54vh
                // wrapper, so pinning the wrapper top at 23vh puts the card
                // center at 23 + 27 = 50vh. (400px = PARALLAX_DISTANCE cancels
                // the section's upward parallax; the JS parallax stays
                // desktop-only — see handleScroll.)
                className="sticky top-4 mb-[20vh] lg:top-[calc(23vh+400px)] lg:mb-[28vh]"
              >
                <div className="flex items-center lg:min-h-[46vh] lg:h-[54vh]">
                  <CaseStudyCard {...project} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
