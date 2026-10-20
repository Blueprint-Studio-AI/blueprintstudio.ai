// Hero — full-bleed brand banner: the white lockup on open water.
// A soft band across the top, tinted with the water's own deep navy rather
// than black, lifts the nav off the photo the way the Jinba and Arch heroes
// do; it's gone by 40% so the lockup sits on the untouched photo. The lockup
// is drawn inline (currentColor) so it stays vector-crisp at any size.
import BrandLockup from "@/components/ui/BrandLockup";

export default function Hero() {
  return (
    <section id="top" className="relative h-[730px] w-full overflow-hidden bg-[#05384B] max-[860px]:h-[560px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/photo/hero-water.jpg" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover object-center" />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(2,14,24,0.62) 0%, rgba(2,14,24,0.34) 14%, rgba(2,14,24,0.1) 28%, rgba(2,14,24,0) 40%)",
        }}
      />
      <div className="relative flex h-full items-center justify-center text-paper">
        <BrandLockup className="h-[100px] w-auto max-w-[80%] max-[860px]:h-[64px]" title="RWY" />
      </div>
    </section>
  );
}
