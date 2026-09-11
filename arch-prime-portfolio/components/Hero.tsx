// Hero — full-bleed brand banner.
//
// The Arch Prime key visual (blue glass towers, the translucent arch) under a
// light tint so the nav's white text holds across the top. Lockup drawn inline
// (currentColor) so it stays vector-crisp at any size.
import ArchLockup from "@/components/ui/ArchLockup";

export default function Hero() {
  return (
    <section id="top" className="relative h-[730px] w-full overflow-hidden bg-[#0E2A4A] max-[860px]:h-[560px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/photo/prime-hero.jpg" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover object-center" />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 22%, rgba(0,0,0,0) 50%)" }}
      />
      <div className="relative flex h-full flex-col items-center justify-center gap-8 text-white">
        <ArchLockup className="h-[72px] w-auto max-w-[80%] max-[860px]:h-[48px]" title="Arch Prime" />
        <p className="max-w-[575px] text-balance px-6 text-center text-title-sm font-light text-parchment">
          Arch Prime · Brand Identity · Design System · 2026
        </p>
      </div>
    </section>
  );
}
