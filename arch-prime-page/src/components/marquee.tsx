import Image from "next/image";

export type MarqueeLogo = { src: string; alt: string; width: number };

export function Marquee({ logos, duration = 50 }: { logos: MarqueeLogo[]; duration?: number }) {
  const track = [...logos, ...logos];
  return (
    <div className="relative mx-auto w-[92%] max-w-(--container-site) overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[60px] bg-gradient-to-r from-light to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-[60px] bg-gradient-to-l from-light to-transparent" />
      <div
        className="marquee-track flex w-max items-center gap-10"
        style={{ animation: `marquee ${duration}s linear infinite` }}
      >
        {track.map((logo, i) => (
          <div key={i} className="flex shrink-0 items-center justify-center" style={{ width: logo.width }}>
            <Image
              src={logo.src}
              alt={logo.alt}
              width={logo.width}
              height={40}
              sizes="200px"
              className="h-auto w-full brightness-0"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
