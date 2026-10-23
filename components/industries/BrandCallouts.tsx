import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { brandsBySlug } from "@/lib/brands";
import Reveal from "@/components/work/Reveal";

// Each lockup is drawn at its hero width relative to the widest one (Arch
// Prime's), so the three marks keep the proportions their own pages give them.
const WIDEST_LOCKUP = 515;
const SCRIM = "linear-gradient(to bottom, rgba(0,0,0,0.12), rgba(0,0,0,0.3))";

// Pointers to the /brands case studies: each brand's own hero art and lockup
// in a light-grey panel, with a line on what it is.
export default function BrandCallouts({ brands }: { brands: { slug: string; line: string }[] }) {
  const items = brands.flatMap(({ slug, line }) => {
    const brand = brandsBySlug[slug];
    return brand ? [{ brand, line }] : [];
  });

  return (
    <div className="grid gap-3 sm:gap-5 md:grid-cols-3 lg:gap-6">
      {items.map(({ brand, line }, i) => {
        const { hero } = brand;
        const lockupWidth = hero.lockupWidth ? (parseFloat(hero.lockupWidth) / WIDEST_LOCKUP) * 72 : 50;
        return (
          <Reveal key={brand.slug} delay={i * 0.06} className="h-full">
            <Link
              href={`/brands/${brand.slug}`}
              className="group flex h-full flex-col rounded-[22px] bg-[#EDEDEC] p-2.5 transition-colors duration-300 hover:bg-[#E8E8E7] sm:p-3 lg:rounded-[28px] lg:p-3.5"
            >
              <div
                className="relative aspect-[4/3] overflow-hidden rounded-[12px] lg:aspect-[5/4] lg:rounded-[16px]"
                style={{ background: hero.background ?? brand.brandInk }}
              >
                <Image
                  src={hero.image}
                  alt=""
                  fill
                  quality={hero.quality ?? 75}
                  sizes="(min-width: 768px) 32vw, 94vw"
                  className={`object-cover transition-transform [transition-duration:900ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] motion-reduce:transform-none ${
                    hero.art === "band" ? "object-bottom" : ""
                  }`}
                />
                {hero.overlay !== null && <div className="absolute inset-0" style={{ background: SCRIM }} />}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={hero.lockup}
                  alt={brand.name}
                  className="absolute left-1/2 top-1/2 max-h-[34%] -translate-x-1/2 -translate-y-1/2 object-contain"
                  style={{ width: `${lockupWidth}%` }}
                />
              </div>
              <div className="flex flex-1 flex-col px-2 pb-2 pt-5 sm:px-3 lg:px-4 lg:pb-4 lg:pt-6">
                <h3 className="text-[22px] font-medium leading-[1.15] tracking-[-0.03em] text-black lg:text-[24px]">{brand.name}</h3>
                <p className="mt-2 text-[15px] leading-[1.45] text-neutral-600">{line}</p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-medium text-black lg:pt-6">
                  See the brand
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </Reveal>
        );
      })}
    </div>
  );
}
