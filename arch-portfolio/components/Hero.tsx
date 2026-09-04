// Hero — full-bleed brand banner.
//
// The night-office photograph from the site's markets section, under the
// same dark tint arch.network gives it, with the lockup drawn inline
// (currentColor) so it stays vector-crisp at any size. The darker band across
// the top belongs to the hero, not the nav: it's what carries the nav's white
// text while the nav has no surface of its own up here.
import ArchLockup from "@/components/ui/ArchLockup";

export default function Hero() {
  return (
    <section id="top" className="relative h-[730px] w-full overflow-hidden bg-arch-ink max-[860px]:h-[560px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/photo/stats.jpg" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover object-center" />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(24,24,24,0.45) 18%, rgba(24,24,24,0.35) 100%)",
        }}
      />
      <div className="relative flex h-full flex-col items-center justify-center gap-8 text-white">
        <ArchLockup className="h-[104px] w-auto max-w-[78%] max-[860px]:h-[72px]" title="Arch Network" />
        <p className="max-w-[575px] text-balance px-6 text-center text-title-sm font-light text-parchment">
          Brand Identity · Design System · Logo System · 2026
        </p>
      </div>
    </section>
  );
}
