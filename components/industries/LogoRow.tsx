import Image from "next/image";
import { TEXT_INSET } from "@/components/work/WorkHeader";

// The industry's clients as a quiet row of logos under the hero, grey until
// hovered (as in the home page's logo ticker). The files share one height
// with their padding baked in, so they sit level without per-logo tuning.
export default function LogoRow({ label, logos }: { label: string; logos: { name: string; src: string; width: number }[] }) {
  return (
    <div className={`${TEXT_INSET} pb-4 pt-6 lg:pt-10`}>
      <div className="line-dash-x mb-6 lg:mb-8" />
      <p className="mb-4 text-sm text-neutral-500 lg:mb-2">{label}</p>
      <ul className="-mx-2 flex flex-wrap items-center gap-x-5 gap-y-2 sm:gap-x-8 lg:justify-between lg:gap-x-4">
        {logos.map((logo) => (
          <li key={logo.name}>
            <Image
              src={logo.src}
              alt={logo.name}
              width={logo.width}
              height={264}
              className="h-11 w-auto opacity-55 grayscale transition-[filter,opacity] duration-500 hover:opacity-100 hover:grayscale-0 sm:h-14 lg:h-[72px]"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
