// Hero (Figma 305:1245) — full-bleed brand banner.
//
// The art is a 16:9 source rendered 11% taller than the frame and nudged up, so
// it crops from below centre — that's the Figma's framing, not a plain cover.
// The dark gradient across the top belongs to the hero, not the nav: it's what
// carries the nav's white text while the nav has no surface of its own up here.

export default function Hero() {
  return (
    <section id="top" className="relative h-[730px] w-full overflow-hidden bg-urushi max-[860px]:h-[560px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/hero.jpg"
        alt=""
        aria-hidden
        className="absolute left-0 top-[-7.82%] h-[111.01%] w-full max-w-none object-cover"
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.82) 0%, rgba(23,23,23,0.63) 15.129%, rgba(102,102,102,0) 50%)",
        }}
      />
      <div className="relative flex h-full flex-col items-center justify-center gap-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/dl/lockup-white.png"
          alt="Jinba"
          className="w-[373px] max-w-[78%] max-[860px]:w-[260px]"
        />
        <p className="max-w-[575px] text-balance px-6 text-center text-title-sm font-light text-[#faf8f3]">
          Brand Identity · Design System · Logo System · 2026
        </p>
      </div>
    </section>
  );
}
