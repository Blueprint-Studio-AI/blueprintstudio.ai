"use client";

// The two ends of the climb.
// Street — the brand's own looking-up photograph, full bleed, the words at the bottom left (as on
//   Arch's home hero) so they never sit on the arch's peak. In the first 225px of scroll the
//   photograph drifts down 60px and holds: the camera rising. Nothing else moves.
// The view — Arch's own closing-card pattern (/chain): an inset card, the words on the left over
//   the photograph's own night blue, the room at height on the right. The photograph is revealed
//   upward once as the card arrives. On phones the portrait photograph goes full bleed instead.
// Reduced motion gets neither movement.

import { useEffect, useRef, useState, type ReactNode } from "react";

export function Street({ photo, mobilePhoto, children }: { photo: string; mobilePhoto?: string; children: ReactNode }) {
  const layer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = layer.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const draw = () => {
      raf = 0;
      // the whole drift happens in the first 225px of scroll, then holds
      const f = Math.min(1, Math.max(0, window.scrollY / 225));
      el.style.transform = `translate3d(0, ${(f * 60).toFixed(1)}px, 0)`;
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
    <header id="street" data-nav-theme="dark" className="relative flex min-h-svh flex-col overflow-hidden bg-[#0d2249]">
      <div ref={layer} aria-hidden className="absolute -inset-y-[60px] inset-x-0 will-change-transform">
        <picture>
          {mobilePhoto && <source media="(max-width: 599px)" srcSet={mobilePhoto} />}
          {/* a plain img: one transformed layer */}
          <img src={photo} alt="" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover object-center" />
        </picture>
      </div>
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,rgba(9,24,50,0.8),rgba(9,24,50,0.1)_55%,rgba(9,24,50,0.25))]" />
      <div className="relative z-[1] flex flex-1 flex-col">{children}</div>
    </header>
  );
}

export function View({ id, photo, children }: { id: string; photo: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const [arrived, setArrived] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setArrived(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} id={id} className="bg-[var(--p-subtle)] sm:py-24 lg:py-32">
      <div data-nav-theme="dark" className="relative overflow-hidden bg-[#10193d] sm:site-container sm:rounded-[28px]">
        <div className="grid min-h-[92svh] grid-cols-1 sm:min-h-0 sm:grid-cols-2">
          {/* the room at height: full bleed behind the words on phones, the right half from sm up */}
          <div className="absolute inset-0 sm:relative sm:order-2 sm:aspect-[5/6]">
            <div
              className="absolute inset-0 transition-[clip-path] duration-700 ease-[var(--ease-out)] motion-reduce:transition-none"
              style={{ clipPath: arrived ? "inset(0 0 0 0)" : "inset(100% 0 0 0)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- a revealed layer */}
              <img src={photo} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: "55% 40%" }} />
            </div>
            <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,rgba(16,25,61,0.95),rgba(16,25,61,0.2)_60%)] sm:hidden" />
          </div>
          <div className="relative z-[1] flex flex-col justify-end p-6 pb-24 sm:order-1 sm:p-12 sm:pb-12 lg:p-16">{children}</div>
        </div>
      </div>
    </section>
  );
}
