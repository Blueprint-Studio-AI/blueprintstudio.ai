// Hero — full-bleed brand banner.

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex h-[620px] w-full flex-col items-center justify-center gap-5 overflow-hidden bg-urushi bg-cover bg-center max-[860px]:h-[420px]"
      style={{ backgroundImage: "url('/assets/header-banner.png')" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/dl/lockup-white.png" alt="Jinba" className="w-[373px] max-w-full max-[860px]:w-[260px]" />
      <p className="text-center text-title-sm font-light text-[#faf8f3]">
        Brand Identity · Design System · Logo System · 2026
      </p>
    </section>
  );
}
