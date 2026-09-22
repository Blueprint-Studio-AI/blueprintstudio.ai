import Image from "next/image";
import { Reveal } from "@/components/reveal";
import { Faq } from "@/components/faq";
import { Mark } from "@/components/prime-marks";
import { ArchIn } from "@/components/prime-arch";
import { Band, Eyebrow, PrimeButton, T } from "@/components/prime-ui";
import { PrimeCarousel, type Slide } from "@/components/prime-carousel";
import { PrimeHow } from "@/components/prime-how";
import { PrimePeak } from "@/components/prime-peak";
import { PrimePill } from "@/components/prime-pill";
import { CountUp } from "@/components/count-up";
import { PRIME_FAQS } from "@/data/prime-faqs";
import { CTA, LENDING, MARKET, primeApp } from "@/data/prime-data";

// Prime page v5. Story: Build the Bank (deposit now, early upside) → the numbers → the account
// (one balance, four jobs at once) → the product tour → how primeBTC works → get in early →
// the peak (everything becomes prime) → FAQ, last before the footer.
// Shapes borrowed on purpose: the app's landing hero and bands, Coinbase's feature carousel,
// business.x.com's floating pill, the HoneyB yield page's scroll-driven pin.
// See docs/prime-page-brief.md. Every app link runs through primeApp(): the public account by
// default, a locally running arch-prime when NEXT_PUBLIC_PRIME_APP is set in .env.local.

const LAUNCH = primeApp();

// The four jobs one balance does at once — the account, as a statement rather than a list of
// features. Each value says what the job is, not what it pays: no rate on this page is live.
const JOBS: { label: string; value: string; soon?: boolean }[] = [
  { label: "Earning", value: "From the first block" },
  { label: "Borrowing", value: `Up to ${LENDING.maxLtv}% loan to value` },
  { label: "Trading", value: "aBTC ⇄ aUSD" },
  { label: "Margin", value: "Prime assets as collateral", soon: true },
];

const SLIDES: Slide[] = [
  {
    id: "hold",
    eyebrow: "Earn",
    title: "Just hold it.",
    body: "Make Bitcoin primeBTC and it earns while you hold it. Dollars too, as primeUSD. Never locked.",
    img: "/img/prime/ui-mint.webp",
    imgW: 1020,
    imgH: 1116,
    fit: "top",
    cta: "Open in Prime",
    href: primeApp("/prime-btc"),
  },
  {
    id: "borrow",
    eyebrow: "Borrow",
    title: "Borrow against it.",
    body: `Draw aUSD against your Bitcoin at the borrow rate, up to ${LENDING.maxLtv}% loan to value, and keep the upside.`,
    img: "/img/prime/ui-borrow.webp",
    imgW: 806,
    imgH: 1304,
    fit: "top",
    cta: "Borrow in Prime",
    href: primeApp("/borrow"),
  },
  {
    id: "trade",
    eyebrow: "Trade",
    title: "Trade, natively.",
    body: "Swap aBTC and aUSD on Bitcoin. Quote, fee and minimum received, before you sign.",
    img: "/img/prime/ui-trade.webp",
    imgW: 2536,
    imgH: 1400,
    fit: "contain",
    cta: "Trade in Prime",
    href: primeApp("/trade"),
  },
  {
    id: "margin",
    eyebrow: "Margin",
    title: "Buying power, while it earns.",
    body: "Every prime asset in your account is collateral. Use its value to accumulate more, and keep every yield.",
    img: "/img/prime/ui-risk.webp",
    imgW: 1668,
    imgH: 1120,
    fit: "contain",
    cta: "See your portfolio",
    href: primeApp("/portfolio"),
    soon: true,
  },
];

export default function Prime() {
  return (
    <>
      {/* HERO — the app's landing hero recipe: photograph, the mark drawing itself over it once
          the copy is on screen, one line, one button. Build the Bank. */}
      <Band
        as="header"
        id="top"
        navDark
        background="var(--p-navy)"
        className="overflow-hidden"
        backdrop={
          <>
            {/* Art-directed portrait on small screens. Eager loading lets picture select one
                source without preloading the desktop image on mobile. */}
            <picture>
              <source media="(max-width: 599px)" srcSet="/img/prime/hero-ascent-mobile.webp" />
              <Image
                src="/img/prime/hero-ascent.webp"
                alt=""
                fill
                loading="eager"
                fetchPriority="high"
                sizes="100vw"
                className="object-cover object-center"
              />
            </picture>
            <ArchIn fill="hero" className="absolute left-1/2 top-[24%] w-[120%] max-w-none -translate-x-1/2 opacity-30 md:top-[111px] md:w-[1178px]" />
          </>
        }
        inner="flex flex-col items-center pt-40 pb-24 text-center sm:pt-56 sm:pb-40"
      >
        <Image src="/img/prime/arch-prime-logo-light.svg" alt="Arch Prime" width={172} height={24} priority className="h-6 w-auto opacity-90" />
        <h1 className={`${T.display} mt-8 max-w-[608px] text-balance text-[#e3e5e5]`}>Build the Bank.</h1>
        <p className={`${T.lead} mt-6 max-w-[608px] text-[#e3e5e5]/70 sm:mt-8 sm:text-[28px] sm:leading-10`}>
          Deposit to earn from day one. Bring liquidity early and share in the upside.
        </p>
        <span className="mt-10 flex flex-wrap items-center justify-center gap-6 sm:mt-12">
          <PrimeButton href={LAUNCH} size="xl">
            {CTA.primary}
          </PrimeButton>
          <a href="#story" className={`${T.body} text-white/80 underline-offset-4 hover:underline`}>
            See how it works
          </a>
        </span>
      </Band>

      <main>
        {/* THE MARKET — the premise, in one figure. Deliberately not a traction number: nothing
            the product reports is live yet (see src/data/prime-data.ts). */}
        <Band id="numbers" background="var(--p-subtle)" inner="grid grid-cols-1 gap-x-8 gap-y-8 py-16 lg:grid-cols-12 lg:items-end lg:py-24">
          <div className="lg:col-span-6">
            <Eyebrow>{MARKET.eyebrow}</Eyebrow>
            <p className="mt-3 flex items-baseline font-serif text-[64px] leading-none tracking-[-0.04em] text-[#292a2e] tabular-nums sm:text-[96px]">
              {MARKET.prefix}
              <CountUp end={MARKET.value} duration={1200} />
              {MARKET.suffix}
            </p>
            <p className={`${T.lead} mt-2 text-[#787878]`}>{MARKET.caption}</p>
          </div>
          <Reveal y={8} skew={0} duration={0.6} delay={0.15} className="lg:col-span-5 lg:col-start-8 lg:pb-3">
            <p className={`${T.lead} text-[#292a2e]`}>{MARKET.body}</p>
          </Reveal>
        </Band>

        {/* THE ACCOUNT — the idea, drawn: one balance, doing four jobs at once. A hairline
            bracket fans from the Bitcoin to each job, so the page argues monetary efficiency
            rather than listing features. On the app's portfolio photograph, navy-tinted. */}
        <Band
          id="account"
          navDark
          background="var(--p-navy)"
          className="overflow-hidden"
          backdrop={
            <>
              <Image src="/img/prime/portfolio.webp" alt="" fill sizes="100vw" className="object-cover" />
              <div className="absolute inset-0 bg-[#123164]/80" />
            </>
          }
          inner="grid grid-cols-1 gap-x-8 gap-y-12 py-20 lg:grid-cols-12 lg:items-center lg:py-28"
        >
          <div className="lg:col-span-5">
            <Eyebrow onDark>Arch Prime</Eyebrow>
            <h2 className={`${T.h2} mt-6 text-balance text-white`}>A prime brokerage account, against your Bitcoin.</h2>
            <p className={`${T.lead} mt-6 text-white/75`}>
              Everywhere else, capital has to pick a job. Earn here, trade there, post collateral somewhere else. A prime account gives it every job at
              once: your Bitcoin earns while it backs a loan, and backs that loan while it stands as margin.
            </p>
            <span className="mt-10 flex flex-wrap items-center gap-6">
              <PrimeButton href={LAUNCH} size="xl">
                {CTA.primary}
              </PrimeButton>
              <a href="#story" className={`${T.body} text-white/80 underline-offset-4 hover:underline`}>
                How primeBTC works
              </a>
            </span>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <div className="rounded-[24px] bg-white p-6 text-[#292a2e] shadow-[0_32px_80px_rgba(9,24,50,0.45)] md:p-8">
              <div className="flex items-center gap-4 border-b border-black/[0.06] pb-6">
                <Mark kind="btc" size={48} />
                <span className="flex flex-col">
                  <span className={`${T.sub} font-serif`}>Your Bitcoin</span>
                  <span className={`${T.label} text-[#787878]`}>One balance</span>
                </span>
              </div>
              <ul className="relative m-0 mt-2 list-none p-0 pl-8">
                {/* the bracket: one rail from the balance, a tick into each job */}
                <span aria-hidden className="absolute top-0 bottom-[30px] left-0 w-px bg-[#dadada]" />
                {JOBS.map((j) => (
                  <li key={j.label} className="relative flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-black/[0.06] py-4 last:border-0">
                    <span aria-hidden className="absolute top-1/2 -left-8 h-px w-6 bg-[#dadada]" />
                    <span className="flex items-center gap-3">
                      <span className={`${T.body} font-medium`}>{j.label}</span>
                      {j.soon && <span className="rounded-full bg-black/5 px-2 py-0.5 text-[11px] uppercase tracking-[0.08em] text-[#787878]">soon</span>}
                    </span>
                    <span className={`${T.body} text-[#787878]`}>{j.value}</span>
                  </li>
                ))}
              </ul>
              <p className={`${T.label} mt-6 text-[#787878]`}>The same Bitcoin, doing all four at once.</p>
            </div>
          </div>
        </Band>

        {/* THE TOUR — the product, as it is, one slide per verb. */}
        <Band id="tour" background="#ffffff" inner="py-16 lg:py-24">
          <div className="mb-10 grid grid-cols-1 items-start gap-x-8 gap-y-6 lg:grid-cols-12 lg:gap-y-8">
            <div className="lg:col-span-12">
              <Eyebrow>The product</Eyebrow>
            </div>
            <h2 className={`${T.h2} min-w-0 lg:col-span-5`}>See it in Prime.</h2>
            <p className={`${T.lead} min-w-0 text-[#787878] lg:col-span-6 lg:col-start-7`}>The account, screen by screen. Live on mainnet, with access opening as the bank is built.</p>
          </div>
          <PrimeCarousel slides={SLIDES} />
        </Band>

        {/* HOW — pinned scroll story: Deposit → Make it prime → Buying power → Withdraw. The wrapper
            is what the floating pill watches: the story swaps its own section node when it pins. */}
        <div id="story">
          <PrimeHow />
        </div>

        {/* GET IN EARLY — the ask, with the product beside it. */}
        <Band id="early" background="var(--p-subtle)" inner="grid grid-cols-1 items-center gap-x-8 gap-y-12 py-16 lg:grid-cols-12 lg:py-24">
          <div className="lg:col-span-5">
            <span className="flex items-center gap-3">
              <Eyebrow>Get in early</Eyebrow>
              <span className="rounded-full bg-[#ff5e00]/10 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-[0.08em] text-[#ff5e00]">Limited access</span>
            </span>
            <h2 className={`${T.h2} mt-6`}>Help build the first prime brokerage for Bitcoin. And beyond.</h2>
            <p className={`${T.lead} mt-6 max-w-[460px] text-[#787878]`}>
              Fund the bank and earn from day one. The earliest liquidity shares in what it becomes.
            </p>
            <span className="mt-8 flex flex-wrap items-center gap-6">
              <PrimeButton href={LAUNCH} size="xl">
                {CTA.primary}
              </PrimeButton>
              <a href="/chain" className={`${T.body} text-[#292a2e] underline-offset-4 hover:underline`}>
                Built on Arch Network
              </a>
            </span>
          </div>
          <div className="lg:col-span-7">
            <a
              href={primeApp("/earn")}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open the Arch Prime app"
              className="block overflow-hidden rounded-[20px] border border-black/[0.06] bg-white shadow-[0_32px_80px_rgba(18,49,100,0.18)] transition-transform duration-300 hover:-translate-y-1"
            >
              <span className="flex items-center gap-1.5 border-b border-black/[0.06] px-4 py-3">
                {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
                  <span key={c} className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c }} />
                ))}
                <span className={`${T.label} ml-3 text-[#b6b6b6]`}>app.arch.network</span>
              </span>
              <Image src="/img/prime/ui-earn-app.webp" alt="The Arch Prime app, Earn page" width={2880} height={1800} sizes="(min-width: 1024px) 760px, 100vw" className="h-auto w-full" />
            </a>
          </div>
        </Band>

        {/* THE PEAK — everything becomes prime; scroll-driven finale. */}
        <PrimePeak href={LAUNCH} actionLabel={CTA.primary} photo="/img/prime/office-night.webp">
          <a href={primeApp("/earn")} target="_blank" rel="noopener noreferrer" className={`${T.body} text-white/80 underline-offset-4 hover:underline`}>
            {CTA.app}
          </a>
        </PrimePeak>

        {/* FAQ — last, above the footer: what a prime account is for, then the app's own questions. */}
        <Band id="faq" background="var(--p-subtle)" inner="grid grid-cols-1 gap-x-8 gap-y-10 py-16 lg:grid-cols-12 lg:py-24">
          <div className="lg:col-span-5">
            <Eyebrow>FAQ</Eyebrow>
            <h2 className={`${T.h2} mt-6`}>What a prime account is for.</h2>
            <p className={`${T.lead} mt-6 max-w-[440px] text-[#787878]`}>Short answers to what people ask before a first deposit. The rest is in the docs.</p>
          </div>
          <div className="lg:col-span-7">
            <Faq items={PRIME_FAQS} />
          </div>
        </Band>
      </main>

      <PrimePill href={LAUNCH} hideOver={["early", "peak", "story"]} />
    </>
  );
}
