"use client";

// The floating call to action, as on business.x.com: a white pill at the bottom centre with
// two buttons, shown once the hero has scrolled away and hidden again over the sections that
// carry their own call to action.

import { useEffect, useState } from "react";
import { CTA, primeApp } from "@/data/prime-data";
import { T } from "./prime-ui";

export function PrimePill({ href, hideOver }: { href: string; hideOver: string[] }) {
  const [heroGone, setHeroGone] = useState(false);
  const [covered, setCovered] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("top");
    if (!hero) return;
    const io = new IntersectionObserver(([e]) => setHeroGone(!e.isIntersecting), { threshold: 0 });
    io.observe(hero);
    // the callback only carries the entries that changed, so track each section's state
    const on = new Set<Element>();
    const cover = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? on.add(e.target) : on.delete(e.target)));
        setCovered(on.size > 0);
      },
      { rootMargin: "0px 0px -30% 0px", threshold: 0 },
    );
    hideOver.forEach((id) => {
      const el = document.getElementById(id);
      if (el) cover.observe(el);
    });
    return () => {
      io.disconnect();
      cover.disconnect();
    };
  }, [hideOver]);

  const show = heroGone && !covered;
  return (
    <div
      aria-hidden={!show}
      className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center transition-[opacity,transform] duration-300 ease-out"
      style={{ opacity: show ? 1 : 0, transform: show ? "none" : "translateY(16px)" }}
    >
      <div className={`pointer-events-auto flex items-center gap-1.5 rounded-full bg-white p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.18),0_0_0_1px_rgba(0,0,0,0.05)] ${show ? "" : "invisible"}`}>
        <a href={href} target="_blank" rel="noopener noreferrer" className={`${T.body} rounded-full bg-[#ff5e00] px-5 py-3 font-medium text-white transition-[filter] hover:brightness-[1.06]`}>
          {CTA.primary}
        </a>
        <a
          href={primeApp("/earn")}
          target="_blank"
          rel="noopener noreferrer"
          className={`${T.body} rounded-full bg-[#f3f3f3] px-5 py-3 font-medium text-[#292a2e] transition-colors hover:bg-[#e9e8e8]`}
        >
          {CTA.app}
        </a>
      </div>
    </div>
  );
}
