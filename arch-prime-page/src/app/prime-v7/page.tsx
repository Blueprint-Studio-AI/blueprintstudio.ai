import Image from "next/image";
import { Faq, type FaqEntry } from "@/components/faq";
import { Street, View } from "@/components/prime-v7/bookends";
import { Flow, LoanBar } from "@/components/prime-v7/flow";
import { Products } from "@/components/prime-v7/products";
import { Skyline } from "@/components/prime-v7/skyline";
import { EARLY_HREF } from "@/data/prime-v6";
import { V7 } from "@/data/prime-v7";
import "./prime-v7.css";

// Prime page v7 — THE ASCENT (local prototype). One climb, from the street looking up to the view
// from the top, with as few words as each idea allows; the
// interactions carry the detail, one line at a time.
//   Street        the brand's looking-up photograph: the promise, the button
//   What it does  a skyline of the app's buildings; point at one, read one line
//   How it works  one path, one dot: in, to work, back out; the loan rule as one bar
//   Inside Earn   the two vaults as fact sheets: terms, not figures
//   Questions     four, collapsed
//   The view      the room at height, in Arch's closing-card pattern: the page's one big number,
//                 $2T+, and the button
// Restraint, as rules: one header pattern everywhere (a small label, a headline of six words or
// fewer, one left edge); at most one thing moves on a screen without the reader (the dot);
// colour only in the two photographs and the chosen vault. Every word is in src/data/prime-v7.ts.

const H1 = "font-serif text-[48px] leading-[52px] tracking-[-0.04em] sm:text-[72px] sm:leading-[76px] lg:text-[88px] lg:leading-[92px]";
const H2 = "font-serif text-[40px] leading-[44px] tracking-[-0.035em] sm:text-[56px] sm:leading-[60px]";

// the page's one button, at Arch's own size (/chain: 48px, a small radius); every instance is a
// link to #early-access, which opens the sign-up dialog
const Cta = ({ className = "" }: { className?: string }) => (
  <a
    href={EARLY_HREF}
    className={`inline-flex h-12 items-center justify-center rounded-[10px] bg-[var(--p-orange)] px-6 text-[16px] font-medium tracking-[-0.01em] text-white transition-[filter,transform] duration-200 hover:brightness-[1.06] active:scale-[0.98] ${className}`}
  >
    {V7.cta.primary}
  </a>
);

const Next = ({ onDark = false, className = "" }: { onDark?: boolean; className?: string }) => (
  <p className={`text-[14px] leading-5 ${onDark ? "text-white/65" : "text-[#6e6e6e]"} ${className}`}>{V7.cta.next}</p>
);

// the one section header: a small label, a short headline, one left edge
const Header = ({ label, title, sub, onDark = false }: { label: string; title: string; sub?: string; onDark?: boolean }) => (
  <div className="mb-14 max-w-[760px] lg:mb-20">
    <p className={`text-[14px] leading-5 font-medium tracking-[0.01em] ${onDark ? "text-white/60" : "text-[#6e6e6e]"}`}>{label}</p>
    <h2 className={`${H2} mt-4 text-balance ${onDark ? "text-white" : "text-[var(--p-ink)]"}`}>{title}</h2>
    {sub && <p className={`mt-5 text-[18px] leading-7 ${onDark ? "text-white/70" : "text-[#5c5c5c]"}`}>{sub}</p>}
  </div>
);

const FAQS: FaqEntry[] = V7.faq.items.map((f) => ({ question: f.q, answer: <p>{f.a}</p> }));

export default function PrimeV7() {
  return (
    <>
      {/* STREET — looking up. The promise lands on the first frame. */}
      <Street photo="/img/prime/v7/hero.webp" mobilePhoto="/img/prime/hero-ascent-mobile.webp">
        <div className="site-container flex flex-1 flex-col justify-end pt-32 pb-16 sm:pb-20 lg:pb-24">
          <Image src="/img/prime/arch-prime-logo-light.svg" alt={V7.hero.eyebrow} width={172} height={24} priority className="h-6 w-auto self-start opacity-90" />
          <h1 className={`${H1} mt-6 max-w-[900px] text-balance text-white`}>{V7.hero.h1}</h1>
          <p className="mt-5 max-w-[520px] text-[18px] leading-7 text-white/80 sm:text-[20px] sm:leading-8">{V7.hero.sub}</p>
          <div className="mt-9 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-5">
            <Cta />
            <Next onDark />
          </div>
        </div>
      </Street>

      <main>
        {/* WHAT IT DOES — the skyline. */}
        <section id="things" className="bg-white">
          <div className="site-container py-24 lg:py-36">
            <Header label={V7.things.label} title={V7.things.h2} sub={V7.things.sub} />
            <Skyline items={V7.things.items} soonLabel={V7.things.soonLabel} previewLabel={V7.things.previewLabel} />
          </div>
        </section>

        {/* HOW IT WORKS — one path, one dot; the loan rule as one bar. */}
        <section id="how" data-nav-theme="dark" className="bg-[#0d2249] text-white">
          <div className="site-container py-24 lg:py-36">
            <Header label={V7.how.label} title={V7.how.h2} onDark />
            <Flow steps={V7.how.steps} labels={V7.how.labels} signed={V7.how.signed} />
            <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-2 border-t border-white/12 pt-6 lg:grid-cols-12">
              <div className="lg:col-span-7 lg:col-start-6">
                <LoanBar max={V7.how.loan.max} liq={V7.how.loan.liq} maxLabel={V7.how.loan.maxLabel} liqLabel={V7.how.loan.liqLabel} />
              </div>
              <p className="text-[15px] leading-6 text-white/70 lg:col-span-4 lg:row-start-1 lg:pt-10">{V7.how.rules}</p>
            </div>
          </div>
        </section>

        {/* INSIDE EARN — the two vaults, as fact sheets. */}
        <section id="vaults" className="bg-[var(--p-subtle)]">
          <div className="site-container py-24 lg:py-36">
            <Header label={V7.vaults.label} title={V7.vaults.h2} />
            <Products items={V7.vaults.items} preview={V7.vaults.preview} />
            <p className="mt-6 text-[14px] leading-5 text-[#6e6e6e]">{V7.vaults.previewNote}</p>
          </div>
        </section>

        {/* QUESTIONS — four, collapsed. */}
        <section id="questions" className="bg-white">
          <div className="site-container grid grid-cols-1 gap-x-8 py-24 lg:grid-cols-12 lg:py-32">
            <div className="lg:col-span-4">
              <Header label={V7.faq.label} title={V7.faq.h2} />
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              <Faq items={FAQS} />
            </div>
          </div>
        </section>
      </main>

      {/* THE VIEW — the room at height; the same promise, the button. */}
      <View id="view" photo="/img/prime/office-night.webp">
        <h2 className="text-white">
          <span className="block font-serif text-[88px] leading-[88px] tracking-[-0.05em] sm:text-[112px] sm:leading-[108px] lg:text-[136px] lg:leading-[128px]">{V7.view.figure}</span>
          <span className="mt-3 block max-w-[440px] font-serif text-[28px] leading-9 tracking-[-0.02em] text-white/85 sm:text-[32px] sm:leading-10">{V7.view.line}</span>
        </h2>
        <p className="mt-8 text-[20px] leading-8 text-white">{V7.view.sub}</p>
        <div className="mt-6 flex flex-col items-start gap-3">
          <Cta />
          <Next onDark />
        </div>
      </View>
    </>
  );
}
