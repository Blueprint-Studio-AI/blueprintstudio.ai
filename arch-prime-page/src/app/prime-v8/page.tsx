import Image from "next/image";
import { Faq, type FaqEntry } from "@/components/faq";
import { Street } from "@/components/prime-v7/bookends";
import { Climb, ViewCopy } from "@/components/prime-v8/climb";
import { Facade } from "@/components/prime-v8/facade";
import { Lobby } from "@/components/prime-v8/lobby";
import { StandaloneView } from "@/components/prime-v8/view";
import { EARLY_HREF } from "@/data/prime-v6";
import { V8 } from "@/data/prime-v8";
import "./prime-v8.css";

// Prime page v8 — THE LIT FLOOR (local prototype), from the design lead's own layout:
//   #street     the looking-up photograph; the promise and the button, centred in the arch
//   #lobby      the white band, now a directory: each row takes you to its floor
//   #tower      the lit windows at the top of the tower, fading into the dark
//   #climb      floor by floor: the real app's panels, operated by the reader; your account fills
//               with jobs as you rise; the view opens out of the panel at the top (pinned)
//   #view       the same view, on its own, when nothing pins (phones, short screens)
//   #questions  four, collapsed
// One photograph on screen at a time; no words set on a photograph except the view's own close.
// Every word is in src/data/prime-v8.ts (v7's fact-checked copy plus a few interaction lines).

const FAQS: FaqEntry[] = V8.faq.items.map((f) => ({ question: f.q, answer: <p>{f.a}</p> }));

export default function PrimeV8() {
  return (
    <>
      <Street photo="/img/prime/v7/hero.webp" mobilePhoto="/img/prime/hero-ascent-mobile.webp">
        <div className="site-container flex flex-1 flex-col items-center justify-center pt-28 pb-20 text-center">
          <Image src="/img/prime/arch-prime-logo-light.svg" alt={V8.hero.eyebrow} width={172} height={24} priority className="v8-rise h-6 w-auto" />
          <h1 className="v8-rise mt-8 max-w-[860px] font-serif text-[48px] leading-[52px] tracking-[-0.04em] text-balance text-white [animation-delay:80ms] sm:text-[72px] sm:leading-[76px] lg:text-[88px] lg:leading-[92px]">
            {V8.hero.h1}
          </h1>
          <p className="v8-rise mt-6 max-w-[520px] text-[18px] leading-7 text-white/80 [animation-delay:160ms]">{V8.hero.sub}</p>
          <a
            href={EARLY_HREF}
            className="v8-rise mt-10 inline-flex h-14 w-full max-w-[320px] items-center justify-center rounded-[10px] bg-[var(--p-orange)] px-8 text-[17px] font-medium tracking-[-0.01em] text-white [animation-delay:240ms] hover:brightness-[1.06] sm:w-auto sm:min-w-[280px]"
          >
            {V8.cta.primary}
          </a>
          <p className="v8-rise mt-4 text-[14px] leading-5 text-white/65 [animation-delay:240ms]">{V8.cta.next}</p>
        </div>
      </Street>

      <main>
        <Lobby label={V8.lobby.label} h2={V8.lobby.h2} sub={V8.lobby.sub} rows={V8.lobby.rows} />
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
          view={V8.view}
          cta={V8.cta.primary}
          note={V8.cta.next}
        />
        <StandaloneView>
          <ViewCopy copy={V8.view} cta={V8.cta.primary} note={V8.cta.next} />
        </StandaloneView>

        <section id="questions" className="bg-[var(--p-subtle)]">
          <div className="site-container grid grid-cols-1 gap-x-8 gap-y-10 py-[72px] lg:grid-cols-12 lg:py-[120px]">
            <div className="lg:col-span-4">
              <p className="text-[14px] leading-5 font-medium text-[#6e6e6e]">{V8.faq.label}</p>
              <h2 className="mt-4 font-serif text-[40px] leading-[44px] tracking-[-0.035em]">{V8.faq.h2}</h2>
              <p className="mt-4 text-[16px] leading-6 text-[#6e6e6e]">{V8.faq.sub}</p>
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
