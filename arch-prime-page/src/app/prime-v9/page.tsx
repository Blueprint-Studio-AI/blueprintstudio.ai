import { Faq, type FaqEntry } from "@/components/faq";
import { PrimePeak } from "@/components/prime-peak";
import { Skyline } from "@/components/prime-v7/skyline";
import { HeroCoin } from "@/components/prime-v9/hero-coin";
import { Climb, ViewCopy } from "@/components/prime-v8/climb";
import { Facade } from "@/components/prime-v8/facade";
import { StandaloneView } from "@/components/prime-v8/view";
import { EARLY_HREF, V6 } from "@/data/prime-v6";
import { V7 } from "@/data/prime-v7";
import { V8 } from "@/data/prime-v8";
import { V9, V9_FAQS } from "@/data/prime-v9";

// Prime page v9 (local prototype) — the assembly, section by section, each kept as its version
// built it so the comparison stays honest:
//   §1–2 Journey v9, one circle: the full-bleed photograph closes into a coin, becomes
//                Bitcoin, carries three beats, and is deposited into the bank
//   §3 What      v7, "Choose what your Bitcoin does." — the skyline
//   §4 Follow    v8, "Follow your Bitcoin." — the facade, then the climb, floor by floor
//   §5 Prime     v5 (ours), the peak: it starts with Bitcoin, then everything becomes prime
//   §6 Questions v8's layout, with v5, v6 and v7's question lists merged to cut down
//   §7 Footer    v5 (ours), the site footer — in the layout
// The copy is each version's own; v9 writes only the hero and the coin, in src/data/prime-v9.tsx.

const H2_V7 = "font-serif text-[40px] leading-[44px] tracking-[-0.035em] sm:text-[52px] sm:leading-[56px]";

// v7's one section header, kept as it is there
const Header = ({ label, title, sub }: { label: string; title: string; sub?: string }) => (
  <div className="mb-14 max-w-[760px] lg:mb-20">
    <p className="text-[14px] leading-5 font-medium tracking-[0.01em] text-[#6e6e6e]">{label}</p>
    <h2 className={`${H2_V7} mt-4 text-balance text-[var(--p-ink)]`}>{title}</h2>
    {sub && <p className="mt-5 text-[18px] leading-7 text-[#5c5c5c]">{sub}</p>}
  </div>
);

// `from` records which version each question came from, for the review; it is not rendered.
const FAQS: FaqEntry[] = V9_FAQS.map((f) => ({ question: f.question, answer: f.answer }));

export default function PrimeV9() {
  return (
    <>
      {/* §1–2 THE JOURNEY — one circle. The page opens on it full-bleed as the photograph, it
          closes into a coin, Bitcoin's mark takes it, three beats pass beside it, and it is
          deposited into the bank. */}
      <HeroCoin
        hero={V9.hero}
        beats={V9.coin.beats}
        deposit={V9.coin.deposit}
        photo="/img/prime/hero-ascent.webp"
        mobilePhoto="/img/prime/hero-ascent-mobile.webp"
        cta={V6.cta.primary}
        ctaHref={EARLY_HREF}
        ctaNote={V6.cta.next}
      />

      <main>
        {/* §3 WHAT IT DOES — v7. The skyline: pick a job, one line each. */}
        <section id="what" className="scroll-mt-20 bg-white">
          <div className="site-container py-24 lg:py-36">
            <Header label={V7.things.label} title={V7.things.h2} sub={V7.things.sub} />
            <Skyline items={V7.things.items} soonLabel={V7.things.soonLabel} previewLabel={V7.things.previewLabel} />
          </div>
        </section>

        {/* §4 FOLLOW YOUR BITCOIN — v8. The lit facade, then the climb: the app's own panels,
            floor by floor, with the account filling as you rise and the view at the top. */}
        <Facade label={V8.tower.label} h2={V8.tower.h2} sub={V8.tower.sub} />
        <Climb
          floors={V8.floors}
          account={V8.account}
          loan={V8.loan}
          vaults={V8.vaults}
          boostTab={V8.boostTab}
          planned={V8.planned}
          preview={V8.preview}
          railTop={V8.railTop}
          of={V8.of}
          view={V9.view}
          cta={V8.cta.primary}
          note={V8.cta.next}
        />
        <StandaloneView>
          <ViewCopy copy={V9.view} cta={V8.cta.primary} note={V8.cta.next} />
        </StandaloneView>

        {/* §5 EVERYTHING BECOMES PRIME — v5, ours. Bitcoin alone, then the ring arrives, each one
            turns prime, and the view rises behind "Your ticket to the top." */}
        <PrimePeak href={EARLY_HREF} actionLabel={V6.cta.primary} photo="/img/prime/office-night.webp" />

        {/* §6 QUESTIONS — v8's layout, every version's questions merged, to cut down. */}
        <section id="questions" className="bg-[var(--p-subtle)]">
          <div className="site-container grid grid-cols-1 gap-x-8 gap-y-10 py-[72px] lg:grid-cols-12 lg:py-[120px]">
            <div className="lg:col-span-4">
              <p className="text-[14px] leading-5 font-medium text-[#6e6e6e]">{V9.faq.label}</p>
              <h2 className="mt-4 font-serif text-[40px] leading-[44px] tracking-[-0.035em]">{V9.faq.h2}</h2>
              <p className="mt-4 text-[16px] leading-6 text-[#6e6e6e]">{V9.faq.sub}</p>
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              <Faq items={FAQS} />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
