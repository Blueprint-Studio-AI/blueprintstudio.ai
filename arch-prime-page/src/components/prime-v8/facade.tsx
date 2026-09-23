"use client";

// The top of the dark tower: the lit windows (the app's Trade photograph), fading down into the
// dark the climb happens in. As the band crosses the screen the photograph pans down a little —
// the windows sink, so the reader rises. The header sits on the dark end of the fade, not on the
// photograph. Reduced motion: no pan.

import { useEffect, useRef } from "react";

export function Facade({ label, h2, sub }: { label: string; h2: string; sub: string }) {
  const band = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const b = band.current;
    const l = layer.current;
    if (!b || !l || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const draw = () => {
      raf = 0;
      const r = b.getBoundingClientRect();
      const vh = window.innerHeight;
      const t = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
      const travel = window.innerWidth < 600 ? 40 : 80;
      l.style.transform = `translate3d(0, ${(t * travel).toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };
    draw();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="tower" data-nav-theme="dark" className="relative bg-[var(--g0)] text-white">
      <div ref={band} className="relative h-[260px] overflow-hidden sm:h-[clamp(360px,34vw,520px)]">
        <div ref={layer} aria-hidden className="absolute inset-x-0 -top-10 h-[calc(100%+40px)] will-change-transform sm:-top-20 sm:h-[calc(100%+80px)]">
          <picture>
            <source media="(max-width: 599px)" srcSet="/img/prime/v8/facade-mobile.webp" />
            {/* a plain img: one transformed layer */}
            <img src="/img/prime/v8/facade.webp" alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: "center 40%" }} />
          </picture>
        </div>
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_30%,rgba(10,18,38,0.6)_62%,#0a1226_100%)]" />
      </div>
      <div className="site-container relative z-10 -mt-[72px] pb-[12vh] sm:-mt-[150px]">
        <p className="text-[14px] leading-5 font-medium text-white/60">{label}</p>
        <h2 className="mt-4 text-[40px] leading-[44px] font-medium tracking-[-0.03em] sm:text-[48px] sm:leading-[52px]">{h2}</h2>
        <p className="mt-5 max-w-[520px] text-[18px] leading-7 text-white/70">{sub}</p>
      </div>
    </section>
  );
}
