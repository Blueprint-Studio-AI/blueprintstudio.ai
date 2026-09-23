"use client";

// The view, when the climb isn't pinned (phones, short screens, reduced motion): the penthouse
// photograph on its own, the words below it on solid ground (never on the photograph here). As it
// comes up the screen its frame opens from a 16px inset to the edges. Hidden when pinned: there,
// the view opens out of the climb's panel frame instead (climb.tsx).

import { useEffect, useRef, type ReactNode } from "react";

export function StandaloneView({ children }: { children: ReactNode }) {
  const frame = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = frame.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (el) el.style.clipPath = "inset(0 round 0)";
      return;
    }
    let raf = 0;
    const draw = () => {
      raf = 0;
      const vh = window.innerHeight;
      const top = el.getBoundingClientRect().top;
      const t = Math.max(0, Math.min(1, (vh - top) / (vh * 0.7)));
      const i = 16 * (1 - t);
      el.style.clipPath = `inset(${i}px round ${i}px)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };
    draw();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="view" data-nav-theme="dark" className="bg-[#172b56] text-white">
      <div ref={frame} className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-[16/10]" style={{ clipPath: "inset(16px round 16px)" }}>
        <picture>
          <source media="(max-width: 599px)" srcSet="/img/prime/v8/penthouse-mobile.webp" />
          {/* a plain img: a clipped layer */}
          <img src="/img/prime/v8/penthouse.webp" alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: "52% 40%" }} />
        </picture>
      </div>
      <div className="site-container py-14">{children}</div>
    </section>
  );
}
