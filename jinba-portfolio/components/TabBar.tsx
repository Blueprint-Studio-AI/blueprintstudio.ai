"use client";

// Section tab bar — rests below the overview, sticks to the top on scroll,
// and highlights the section currently in view (scroll-spy).
import { useEffect, useState } from "react";
import { SECTIONS } from "@/lib/data";

export default function TabBar() {
  const [active, setActive] = useState<string>("");
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const bar = document.getElementById("tabbar");
    const spy = () => {
      let current = "";
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= 120) current = s.id;
      }
      setActive(current);
      if (bar) setStuck(bar.getBoundingClientRect().top <= 0.5);
    };
    spy();
    window.addEventListener("scroll", spy, { passive: true });
    return () => window.removeEventListener("scroll", spy);
  }, []);

  return (
    <nav
      id="tabbar"
      aria-label="Sections"
      className={`sticky top-0 z-[60] px-edge transition-colors ${
        stuck ? "bg-white/90 backdrop-blur-[10px]" : "bg-white"
      }`}
    >
      {/* divider is inset to the content frame — it no longer bleeds edge-to-edge */}
      <div className="flex items-center justify-between gap-6 border-b border-line-soft">
        <div className="no-scrollbar flex gap-8 overflow-x-auto">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`-mb-px whitespace-nowrap border-b-2 pb-3.5 pt-4 text-meta transition-colors ${
                active === s.id
                  ? "border-ink font-medium text-ink"
                  : "border-transparent text-muted-1 hover:text-ink"
              }`}
            >
              {s.label}
            </a>
          ))}
        </div>
        <a
          href="/downloads/jinba-brand-kit.zip"
          download
          className="whitespace-nowrap text-body-sm font-medium text-muted-1 transition-colors hover:text-ink max-[860px]:hidden"
        >
          Complete Kit · 54 MB&nbsp;↓
        </a>
      </div>
    </nav>
  );
}
