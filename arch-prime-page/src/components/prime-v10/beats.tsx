// THE WORDS — two kinds, handled differently on purpose.
//
//   HeroWords   over the photograph: the logo, the promise, the one button. FLOW TEXT — pinned,
//               it sits in the first viewport and scrolls (with a lift, --words) off the top; it
//               never fades to a ghost over the light ground. It is masked at the nav's line
//               instead (prime-v10.css), so it never runs through the bare nav's links.
//               The H1 is one line per sentence, so a phone never breaks mid-sentence.
//   BeatWords   one of the stage's headlines, at the top of the stage, centred. Pinned, the two
//               share one slot and hand off by time, keyed off data-beat: the old one leaves
//               upward (250ms), then the new one rises (400ms, once the old is gone) — never two
//               headlines stacked at half opacity. In a static frame each simply shows.
//               The idle beat carries V10.figure above its headline when that slot is filled.

import Image from "next/image";
import { PrimeButton, T } from "@/components/prime-ui";
import { V10 } from "@/data/prime-v10";

export function HeroWords() {
  const h = V10.hero;
  return (
    <div className="v10-words site-container">
      <Image src={h.logo} alt={h.logoAlt} width={173} height={24} preload className="h-6 w-auto opacity-90" />
      <h1 className="v10-h1 mt-8 max-w-[760px] font-serif text-[#eef0f0]">
        {h.h1.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h1>
      <p className={`${T.lead} mt-6 max-w-[560px] text-balance text-white/85 sm:text-[22px] sm:leading-8`}>{h.sub}</p>
      <span className="mt-10 flex justify-center">
        <PrimeButton href={h.ctaHref} size="xl">
          {h.cta}
        </PrimeButton>
      </span>
      <p className={`${T.label} mt-5 text-balance text-white/75`}>{h.note}</p>
    </div>
  );
}

export function BeatWords({ beat }: { beat: "idle" | "prime" }) {
  const b = V10.beats[beat];
  const figure = beat === "idle" ? V10.figure : "";
  return (
    <div className={`v10-beat v10-beat--${beat}`}>
      {figure && <p className="v10-figure mb-2 font-serif text-[var(--p-ink)]">{figure}</p>}
      <h2 className="v10-beat-h font-serif text-balance text-[var(--p-ink)]">{b.h}</h2>
      <p className="v10-beat-sub mt-3 text-balance text-[#5c5c5c]">{b.sub}</p>
    </div>
  );
}
