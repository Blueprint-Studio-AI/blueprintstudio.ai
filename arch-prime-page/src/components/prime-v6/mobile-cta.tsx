"use client";

// Phones only: a slim pill. The nav's button is hidden below md, so without this a reader who
// arrives from a link on X has nothing to tap between the hero and the ask. It appears once the hero has
// scrolled away and steps aside wherever the page already shows the button (the ask, the view).

import { useEffect, useState } from "react";
import { EARLY_HREF } from "@/data/prime-v6";

export function MobileCta({ label, hideOver }: { label: string; hideOver: readonly string[] }) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const els = hideOver.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);
    if (!els.length) return;
    const visible = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
        setShown(visible.size === 0);
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [hideOver]);

  return (
    <div
      inert={!shown}
      className={`fixed right-4 bottom-[max(16px,env(safe-area-inset-bottom))] z-[90] transition-[opacity,transform] duration-300 md:hidden ${
        shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <a
        href={EARLY_HREF}
        className="flex h-11 items-center rounded-full bg-[var(--p-orange)] px-5 text-[15px] font-medium tracking-[-0.01em] text-white shadow-[0_6px_16px_rgba(9,24,50,0.18)]"
      >
        {label}
      </a>
    </div>
  );
}
