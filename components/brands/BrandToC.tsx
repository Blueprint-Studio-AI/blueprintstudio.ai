"use client";
import { useEffect, useState } from "react";

interface TocChapter {
  id: string;
  label: string;
}

interface BrandToCProps {
  chapters: TocChapter[];
  pdfHref?: string;
}

export function BrandToC({ chapters, pdfHref }: BrandToCProps) {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const onScroll = () => {
      let current = "";
      for (const ch of chapters) {
        const el = document.getElementById(ch.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= 120) {
          current = ch.id;
        }
      }
      setActive(current);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // run once on mount
    return () => window.removeEventListener("scroll", onScroll);
  }, [chapters]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const lenis = (window as any).__lenis;
    if (lenis) {
      lenis.scrollTo(el, { offset: -40 });
    } else {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    const lenis = (window as any).__lenis;
    if (lenis) {
      lenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed left-8 top-24 z-40 hidden lg:flex flex-col gap-3">
      <button
        onClick={scrollToTop}
        className={`text-left text-[12px] leading-none transition-all duration-200 ${
          active === ""
            ? "text-neutral-700 font-medium"
            : "text-neutral-400 hover:text-neutral-600"
        }`}
      >
        Overview
      </button>
      {chapters.map((ch) => (
        <button
          key={ch.id}
          onClick={() => scrollTo(ch.id)}
          className={`text-left text-[12px] leading-none transition-all duration-200 ${
            active === ch.id
              ? "text-neutral-700 font-medium"
              : "text-neutral-400 hover:text-neutral-600"
          }`}
        >
          {ch.label}
        </button>
      ))}
      {pdfHref && (
        <a
          href={pdfHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 text-[11px] text-neutral-600 hover:text-neutral-900 border border-neutral-300 hover:border-neutral-500 rounded-full px-3 py-1.5 transition-colors duration-150"
        >
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path d="M6 1v7M3 6l3 3 3-3M1 10h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Brand Deck
        </a>
      )}
    </nav>
  );
}
