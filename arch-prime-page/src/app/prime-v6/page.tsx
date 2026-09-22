import Image from "next/image";
import Link from "next/link";
import { Faq, type FaqEntry } from "@/components/faq";
import { Mark } from "@/components/prime-marks";
import { Band, Eyebrow, PrimeButton, T } from "@/components/prime-ui";
import { AccountDiagram } from "@/components/prime-v6/account-diagram";
import { Note } from "@/components/prime-v6/note";
import { OneScreen } from "@/components/prime-v6/one-screen";
import { WindowStage } from "@/components/prime-v6/window-stage";
import { EARLY_HREF, V6 } from "@/data/prime-v6";
import "./prime-v6.css";

// Prime page v6 (local prototype). One idea — one account where your Bitcoin can earn, back a
// dollar loan and trade, and you sign every step — told as one climb, with one object carried
// through it: the account's window.
//   §1 Hero        looking up; the photograph closes into the window        (moment 1 of 2)
//   §2 Account     why one account; the window again, showing its three parts
//   §3 One screen  the only list of capabilities, shown as the Portfolio
//   §4 How         follow your Bitcoin in and back out; the one home for trust
//   §5 The ask     every loan starts with a deposit                          (CTA 2 of 3)
//   §6 FAQ         what the ask raises
//   §7 Next        where it goes, as intent: type and the two real prime marks
//   §8 The view    the window opens onto the view from the upper floor      (moment 2 of 2)
// Type: four serif sizes — 64 (the bookends and §2's one display line), 48 (section heads),
// 32 (§4's question and hand-off), 24 (subs). Every word lives in src/data/prime-v6.ts.
// The plan: ~/Desktop/arch-prime-page-map-v1.md.

const GREY = "#6e6e6e"; // the lightest grey text that passes AA on white and on #f7f6f6
const SERIF_32 = "font-serif text-[32px] leading-10 tracking-[-0.03em]";

const NextStep = ({ onDark = false, className = "" }: { onDark?: boolean; className?: string }) => (
  <p className={`${T.label} ${onDark ? "text-white/65" : "text-[#6e6e6e]"} ${className}`}>{V6.cta.next}</p>
);

const Arrow = () => (
  <svg width="12" height="10" viewBox="0 0 14 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M1 6h11M8 2l4 4-4 4" />
  </svg>
);

const TextLink = ({ href, children, onDark = false }: { href: string; children: React.ReactNode; onDark?: boolean }) => {
  const cls = `${T.body} inline-flex items-center gap-2 underline-offset-4 hover:underline ${onDark ? "text-white/85" : "text-[var(--p-ink)]"}`;
  return href.startsWith("http") ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {children}
      <Arrow />
    </a>
  ) : (
    <Link href={href} className={cls}>
      {children}
      <Arrow />
    </Link>
  );
};

const FAQS: FaqEntry[] = V6.faq.items.map((f) => ({ question: f.q, answer: <p>{f.a}</p> }));

export default function PrimeV6() {
  return (
    <>
      {/* §1 HERO — looking up. What Prime is, the one custody fact and the button, all on the
          first screen; then the photograph closes into the account's window. */}
      <WindowStage
        id="top"
        mode="close"
        photo={{ src: "/img/prime/hero-ascent.webp", mobileSrc: "/img/prime/hero-ascent-mobile.webp", position: "50% 70%" }}
        photoScale={0.6}
      >
        <header className="site-container flex min-h-svh flex-col items-center justify-center pt-28 pb-24 text-center">
          <Image src="/img/prime/arch-prime-logo-light.svg" alt="Arch Prime" width={172} height={24} priority className="h-6 w-auto opacity-90" />
          <h1 className={`${T.display} mt-8 max-w-[820px] text-balance text-[#eef0f0]`}>{V6.hero.h1}</h1>
          <p className={`${T.lead} mt-6 max-w-[620px] text-balance text-white/80 sm:text-[22px] sm:leading-8`}>{V6.hero.sub}</p>
          <span className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            <PrimeButton href={EARLY_HREF} size="xl">
              {V6.cta.primary}
            </PrimeButton>
            <a href="#how" className={`${T.body} text-white/85 underline-offset-4 hover:underline`}>
              {V6.hero.secondary}
            </a>
          </span>
          <NextStep onDark className="mt-5" />
        </header>
      </WindowStage>

      <main>
        {/* §2 THE ACCOUNT — names the window the hero closed into and shows what it holds.
            "One account" becomes a contrast the reader already feels, then the name pays off. */}
        <section id="account" className="bg-[var(--p-subtle)]">
          <div className="site-container grid grid-cols-1 gap-x-8 gap-y-14 pt-20 pb-20 lg:grid-cols-12 lg:items-center lg:pt-4 lg:pb-32">
            <div className="lg:col-span-6">
              <Eyebrow color={GREY}>{V6.account.label}</Eyebrow>
              <h2 className={`${T.h2} mt-5 text-balance`}>{V6.account.h2}</h2>
              <p className={`${T.lead} mt-6 max-w-[560px] text-[#5c5c5c]`}>{V6.account.beat1}</p>
              <p className={`${T.display} mt-14 text-[var(--p-ink)]`}>{V6.account.display}</p>
              <p className={`${T.lead} mt-5 max-w-[560px] text-[var(--p-ink)]`}>{V6.account.beat2}</p>
              <p className={`${T.lead} mt-6 max-w-[560px] text-[#5c5c5c]`}>{V6.account.beat3}</p>
            </div>
            <div className="lg:col-span-6 lg:col-start-7 lg:justify-self-end">
              <AccountDiagram parts={V6.account.diagram.parts} />
            </div>
          </div>
        </section>

        {/* §3 ON ONE SCREEN — the only list: the account itself, which /chain can't show. */}
        <section id="screen" className="bg-white">
          <div className="site-container py-20 lg:py-32">
            <div className="mb-12 grid grid-cols-1 gap-x-8 gap-y-5 lg:mb-16 lg:grid-cols-12 lg:items-end">
              <h2 className={`${T.h2} text-balance lg:col-span-6`}>{V6.screen.h2}</h2>
              <p className={`${T.lead} text-[#5c5c5c] lg:col-span-5 lg:col-start-8`}>{V6.screen.lead}</p>
            </div>
            <OneScreen base={V6.screen.base} baseMobile={V6.screen.baseMobile} rows={V6.screen.rows} next={V6.screen.next} caption={V6.screen.caption} />
            <Note className="mt-6 max-w-[640px]">{V6.screen.note}</Note>
          </div>
        </section>

        {/* §4 HOW IT WORKS — opens on the question this reader brings, then follows the Bitcoin.
            Sticky headline, plain scroll; each step names the layer that answers for it; the
            risks are body copy, not footnotes. Rules, not cards. */}
        <section id="how" className="scroll-mt-20 bg-[var(--p-subtle)]">
          <div className="site-container py-20 lg:py-32">
            <div className="grid grid-cols-1 gap-x-8 gap-y-5 border-y border-[#dedede] py-10 lg:grid-cols-12 lg:items-start">
              <p className={`${SERIF_32} text-balance lg:col-span-5`}>{V6.how.opener.q}</p>
              <p className={`${T.lead} text-[#4d4d4d] lg:col-span-6 lg:col-start-7`}>{V6.how.opener.a}</p>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-12 lg:mt-24 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <div className="v6-sticky">
                  <h2 className={`${T.h2} text-balance`}>{V6.how.h2}</h2>
                  <p className={`${T.lead} mt-6 text-[#5c5c5c]`}>{V6.how.lead}</p>
                </div>
              </div>

              <div className="lg:col-span-7 lg:col-start-6">
                <ol className="m-0 list-none p-0">
                  {V6.how.steps.map((s) => (
                    <li key={s.n} className="border-t border-[#dedede] py-10 first:border-t-0 first:pt-0">
                      <div className="flex gap-5 sm:gap-8">
                        <span aria-hidden className={`${T.label} w-6 shrink-0 pt-1.5 text-[#6e6e6e] tabular-nums`}>
                          {s.n}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                            <h3 className={`${T.sub} font-serif`}>{s.title}</h3>
                            <span className="flex flex-wrap gap-1.5">
                              {s.tags.map((t) => (
                                <span key={t} className="rounded-full border border-[#cfcfcf] bg-white px-2.5 py-0.5 text-[12px] leading-5 text-[#4d4d4d]">
                                  {t}
                                </span>
                              ))}
                            </span>
                          </div>
                          <p className={`${T.body} mt-4 text-[var(--p-ink)]`}>{s.body}</p>
                          {"more" in s && s.more && <p className={`${T.body} mt-3 text-[#4d4d4d]`}>{s.more}</p>}
                          {"note" in s && s.note && <Note className="mt-4">{s.note}</Note>}
                          {"link" in s && s.link && (
                            <div className="mt-5">
                              <TextLink href={s.link.href}>{s.link.label}</TextLink>
                            </div>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>

                <div className="mt-4 border-t border-[#dedede] pt-8">
                  <h3 className={`${T.sub} font-serif`}>{V6.how.relyTitle}</h3>
                  <ul className="m-0 mt-5 grid list-none grid-cols-1 gap-x-10 p-0 sm:grid-cols-2">
                    {V6.how.rely.map((r) => (
                      <li key={r} className={`${T.body} border-b border-black/[0.07] py-3 text-[var(--p-ink)]`}>
                        {r}
                      </li>
                    ))}
                  </ul>
                  <Note className="mt-4">{V6.how.relyNote}</Note>
                </div>

                <p className={`${SERIF_32} mt-16`}>{V6.how.close}</p>
              </div>
            </div>
          </div>
        </section>

        {/* §5 THE ASK — "someone has to fund these loans": you can. The only band mid-page, sized
            to what the button asks for, an email. On the grid, no decoration. */}
        <Band id="bank" navDark background="var(--p-navy)" inner="grid grid-cols-1 gap-x-8 gap-y-10 py-20 lg:grid-cols-12 lg:py-24">
          <div className="lg:col-span-5">
            <Eyebrow onDark>{V6.bank.eyebrow}</Eyebrow>
            <h2 className={`${T.h2} mt-5 text-balance text-white`}>{V6.bank.h2}</h2>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              {V6.bank.paths.map((p) => (
                <div key={p.label} className="border-t border-white/20 pt-5">
                  <p className={`${T.body} font-medium text-white`}>{p.label}</p>
                  <p className={`${T.lead} mt-2 text-white/75`}>{p.body}</p>
                </div>
              ))}
            </div>
            <p className={`${T.lead} mt-8 text-white/75`}>
              {V6.bank.both} <span className="text-white">{V6.bank.ask}</span>
            </p>
            <div className="mt-10">
              <PrimeButton href={EARLY_HREF} size="xl">
                {V6.cta.primary}
              </PrimeButton>
              <NextStep onDark className="mt-4" />
            </div>
            <Note className="mt-8">{V6.bank.note}</Note>
          </div>
        </Band>

        {/* §6 FAQ — what the ask raises; nothing new. */}
        <section id="faq" className="bg-white">
          <div className="site-container grid grid-cols-1 gap-x-8 gap-y-10 py-20 lg:grid-cols-12 lg:py-28">
            <div className="lg:col-span-5">
              <h2 className={T.h2}>{V6.faq.h2}</h2>
              <p className={`${T.lead} mt-6 max-w-[420px] text-[#5c5c5c]`}>{V6.faq.lead}</p>
              <div className="mt-8 flex flex-col items-start gap-3">
                <TextLink href={V6.faq.docs.href}>{V6.faq.docs.label}</TextLink>
                <TextLink href={V6.faq.partner.href}>{V6.faq.partner.label}</TextLink>
              </div>
            </div>
            <div className="lg:col-span-7">
              <Faq items={FAQS} />
            </div>
          </div>
        </section>

        {/* §7 WHERE IT'S GOING — intent, not product: type and the two prime assets that exist.
            A full section only once legal clears stocks (see the note). */}
        <section id="next" className="bg-[var(--p-subtle)]">
          <div className="site-container py-20 lg:py-28">
            <div className="max-w-[720px]">
              <h2 className={`${T.h2} text-balance`}>{V6.next.h2}</h2>
              <p className={`${T.lead} mt-6 max-w-[560px] text-[#5c5c5c]`}>{V6.next.body}</p>
              <div className="mt-8 flex items-center gap-3">
                <Mark kind="primeBTC" size={40} />
                <Mark kind="primeUSD" size={40} />
                <span className={`${T.label} ml-1 text-[#6e6e6e]`}>primeBTC · primeUSD</span>
              </div>
              <Note className="mt-8">{V6.next.note}</Note>
            </div>
          </div>
        </section>
      </main>

      {/* §8 THE VIEW — the mirror. The window returns holding the view from the upper floor and
          opens back out; the last line and the button land. The last section before the footer. */}
      <WindowStage
        id="view"
        mode="open"
        photo={{ src: "/img/prime/office-night.webp", position: "50% 45%" }}
        track="160svh"
        caption={<p className={`${T.eyebrow} text-[#6e6e6e]`}>{V6.view.caption}</p>}
      >
        <div className="site-container flex min-h-svh flex-col justify-end pt-32 pb-20 lg:pb-24">
          <h2 className={`${T.display} max-w-[760px] text-balance text-white`}>{V6.view.h2}</h2>
          <p className={`${T.lead} mt-5 max-w-[560px] text-white/80`}>{V6.view.sub}</p>
          <span className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <PrimeButton href={EARLY_HREF} size="xl">
              {V6.cta.primary}
            </PrimeButton>
            <TextLink href="/chain" onDark>
              {V6.view.secondary}
            </TextLink>
          </span>
          <NextStep onDark className="mt-5" />
        </div>
      </WindowStage>
    </>
  );
}
