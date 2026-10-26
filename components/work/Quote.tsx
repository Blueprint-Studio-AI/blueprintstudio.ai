import Image from "next/image";
import type { Testimonial } from "@/data/testimonials";
import Reveal from "./Reveal";
import { TEXT_INSET, WIDE } from "./WorkHeader";

// One client's words, set large. The quote is verbatim; its first sentence is
// set as the lead and the rest follows at reading size.
export default function Quote({ testimonial }: { testimonial: Testimonial }) {
  const { quote, name, role, company, image } = testimonial;
  const cut = quote.search(/[.!?]\s/);
  const lead = cut === -1 ? quote : quote.slice(0, cut + 1);
  const rest = cut === -1 ? "" : quote.slice(cut + 2);

  return (
    <div className={WIDE}>
      <Reveal>
        <figure className={`${TEXT_INSET} max-w-[1120px]`}>
          <p className="mb-6 text-sm text-neutral-500 lg:mb-10">
            In their words
          </p>
          <blockquote>
            <p className="relative text-balance text-[clamp(28px,3.9vw,54px)] font-medium leading-[1.06] tracking-[-0.04em] text-black">
              {/* Hanging opening quote, so the text's left edge stays on the column. */}
              <span aria-hidden="true" className="absolute right-full pr-[0.04em] text-neutral-300">
                “
              </span>
              {lead}
              {!rest && "”"}
            </p>
            {rest && (
              <p className="mt-6 max-w-[58ch] text-pretty text-[17px] leading-[1.5] text-neutral-600 lg:mt-8 lg:text-lg">
                {rest}”
              </p>
            )}
          </blockquote>
          <figcaption className="mt-8 flex items-center gap-3 lg:mt-12">
            {image && (
              <Image src={image} alt="" width={88} height={88} className="h-11 w-11 rounded-full object-cover" />
            )}
            <div className="text-[15px] leading-tight">
              <div className="font-medium text-black">{name}</div>
              <div className="mt-0.5 text-neutral-500">
                {role}, {company}
              </div>
            </div>
          </figcaption>
        </figure>
      </Reveal>
    </div>
  );
}
