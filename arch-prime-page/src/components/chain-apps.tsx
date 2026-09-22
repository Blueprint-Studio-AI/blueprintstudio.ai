// Movement 4 of the Chain page below-fold ("What you can do" — §3.x), ported from
// public/below/index.html (static HTML + vanilla CSS) to a React + Tailwind component.
// This is the white-paper band (band--do = transparent bg) → dark text on white.
// "Use it" sub-beat: three flip-to-code app cards (Borrow/Earn/Swap) in the home
// institutions-card visual language, then the "For builders" closing CTA.
//
// Token mapping (chain.css → Tailwind theme): cream → light, purple → dark-purple,
// purple-2 → purple, orange → orange; gray ramp ink/body/muted/faint → neutral-900/600/500/400;
// hairline (--hair) → border-black/[0.08].

import type { ReactNode } from "react";
import { Reveal } from "./chain-reveal";
import { ChainCity } from "./chain-city";
import { FlipCard } from "./chain-flip-card";
import { EXTERNAL } from "@/lib/site";

export type App = {
  /** action label (React key) */
  tag: string;
  /** upper-left line icon (24×24 stroke paths, four-rules style) */
  icon: ReactNode;
  /** display title — brand serif */
  title: string;
  /** one tight line of our copy */
  desc: string;
  /** live case-study name + url (opens in new tab) */
  liveName: string;
  liveUrl: string;
  /** developer docs url */
  docsUrl: string;
  /** real on-chain primitive shown on the card back */
  code: string;
};

const APPS: App[] = [
  {
    tag: "Borrow",
    icon: (
      <path
        d="M12 3v10m0 0-4-4m4 4 4-4M5 16v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    title: "Borrow without selling.",
    desc: "Draw a loan against native BTC — without a wrapped IOU.",
    liveName: "Arch Prime",
    liveUrl: EXTERNAL.prime,
    docsUrl: "https://book.arch.network/docs/defi-applications/how-to-build-lending-protocol",
    code: `// borrow against pooled BTC collateral
pub fn borrow(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    amount: u64,
) -> Result<(), ProgramError> {
    let iter = &mut accounts.iter();
    let pa = next_account_info(iter)?;
    let pos = next_account_info(iter)?;
    let mut pool = LendingPool::load(pa)?;
    // stay over-collateralized, or reject
    pool.check_health(pos, amount)?;
    pool.total_borrows += amount;
    pool.save(pa)
}`,
  },
  {
    tag: "Earn",
    icon: (
      <path
        d="M4 16.5 9.5 11l3.5 3.5L20 7M20 7h-4.5M20 7v4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    title: "Put idle Bitcoin to work.",
    desc: "Earn yield that accrues to real Bitcoin — not a receipt.",
    liveName: "HoneyB",
    liveUrl: "https://www.honeybtc.com/",
    docsUrl: "https://book.arch.network/docs/defi-applications/how-to-build-lending-protocol",
    code: `// supply native BTC, earn supply APY
pub fn deposit(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    amount: u64,
) -> Result<(), ProgramError> {
    let iter = &mut accounts.iter();
    let pa = next_account_info(iter)?;
    let mut pool = LendingPool::load(pa)?;
    // credit supply, re-price utilization
    pool.total_deposits += amount;
    pool.utilization_rate =
        pool.total_borrows * 10_000
            / pool.total_deposits;
    pool.save(pa)
}`,
  },
  {
    tag: "Swap",
    icon: (
      <path
        d="M4 9h14m0 0-3.5-3.5M18 9l-3.5 3.5M20 15H6m0 0 3.5 3.5M6 15l3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    title: "Swap against real liquidity.",
    desc: "Pooled, always-on liquidity at a tight, predictable spread.",
    liveName: "Arch Prime",
    liveUrl: EXTERNAL.prime,
    docsUrl: "https://book.arch.network/docs/defi-applications/how-to-build-runes-swap",
    code: `// settle a runes swap on native Bitcoin
pub fn process_accept_offer(
    accounts: &[AccountInfo],
    ix: SwapInstruction,
) -> Result<(), ProgramError> {
    let iter = &mut accounts.iter();
    let taker = next_account_info(iter)?;
    let oa = next_account_info(iter)?;
    let maker = next_account_info(iter)?;
    let mut offer = SwapOffer::load(oa)?;
    // both legs settle, or neither does
    transfer_runes(maker, taker, give)?;
    transfer_runes(taker, maker, want)?;
    offer.status = OfferStatus::Filled;
    offer.save(oa)
}`,
  },
];

export function ChainApps() {
  return (
    <section className="bg-light font-sans text-black antialiased">
      <div className="mx-auto w-[92%] max-w-[64rem] pb-24 pt-20 md:pb-32 md:pt-28">
        {/* sub-beat: use it — flat serif title, no eyebrow */}
        <Reveal>
          <h3 className="max-w-[19ch] text-balance font-serif text-[2.25rem] font-light leading-[1.05] tracking-[-0.01em] text-neutral-900 md:text-[2.75rem]">
            These primitives are yours to build on.
          </h3>
          <p className="mt-6 max-w-[46ch] text-pretty text-[1.15rem] leading-[1.5] text-neutral-600 md:text-[1.25rem]">
            Borrow, earn, and swap against native&nbsp;Bitcoin. It stays yours the whole way&nbsp;through.
          </p>
        </Reveal>

        {/* app cards — the card links to the docs (its back says "More in the docs"); hover flips it
            to PEEK the real code. The "See it live" link sits BELOW the card, outside the anchor. */}
        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {APPS.map((app, i) => (
            <Reveal key={app.tag} delay={i * 80}>
              <FlipCard app={app} />
              {/* live case study — separate link, centered below the card.
                  Hidden for now — uncomment to restore the "See it live" affordance. */}
              {/* <a
                href={app.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3.5 flex items-center justify-center gap-1.5 text-[0.82rem] font-medium text-orange transition-opacity hover:opacity-70"
              >
                See it live on {app.liveName} <span aria-hidden="true">↗</span>
              </a> */}
            </Reveal>
          ))}
        </div>

        {/* closing beat: builder CTA — full-width rounded gray card with a big bottom well that the
            reused hero "city" (top layer) rises into and gets cropped by the card's bottom edge. */}
        <Reveal className="mt-20 md:mt-28">
          {/* min-height per city tier (aligned to chain-city.tsx breakpoints):
              <640 Mobile · 640–1024 Small-Medium · ≥1024 Large (main design height) */}
          <div className="relative overflow-hidden rounded-[20px] bg-[#2e2d33] px-7 py-12 md:px-12 md:py-16 max-[639px]:min-h-[520px] min-[640px]:max-[1023px]:min-h-[560px] min-[1024px]:min-h-[440px]">
            <ChainCity />
            <div className="relative z-10 max-w-[30rem]">
            <div className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-light/55">For builders</div>
            <h3 className="mt-4 max-w-[20ch] text-balance text-[1.7rem] font-medium leading-[1.15] tracking-[-0.02em] text-light md:text-[2rem]">
              Build your first Arch program in under <span className="text-orange">15 minutes</span>.
            </h3>
            {/* Hidden for now — the published `create-arch-app` npm package is unrelated to Arch Network,
                so this command doesn't scaffold an Arch app. Restore once a real scaffolder ships.
            <div className="mt-7 inline-flex items-center overflow-hidden rounded-[10px] border border-black/[0.08] bg-white">
              <code className="px-[14px] py-[10px] font-mono text-[0.84rem] text-neutral-900">
                <span className="text-orange">$</span> npx create-arch-app
              </code>
              <span className="border-l border-black/[0.08] bg-neutral-50 px-[13px] py-[10px] font-mono text-[0.7rem] text-neutral-500">
                copy
              </span>
            </div>
            */}
            <div className="mt-7 flex flex-col items-start gap-[17px]">
              <a
                href="https://book.arch.network/docs/quick-start/quick-start"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-[7px] rounded-[11px] bg-[linear-gradient(180deg,#f4814a,#ec641d)] px-[18px] py-[11px] text-[0.94rem] font-medium text-white no-underline shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_1.5px_2px_rgba(0,0,0,0.13),0_0_0_1px_#c9520f] transition-[transform,filter] duration-200 ease-[cubic-bezier(0.645,0.045,0.355,1)] hover:brightness-[1.04] active:scale-[0.96]"
              >
                Start Building{" "}
                <span aria-hidden="true" className="transition-transform duration-200 ease-[cubic-bezier(0.645,0.045,0.355,1)] group-hover:translate-x-[2px]">
                  ↗
                </span>
              </a>
              <a
                href={EXTERNAL.docs}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-[7px] rounded-[11px] border border-light/25 px-[18px] py-[11px] text-[0.94rem] font-medium text-light no-underline transition-[transform,background-color] duration-200 ease-[cubic-bezier(0.645,0.045,0.355,1)] hover:bg-light/10 active:scale-[0.96]"
              >
                Read the docs
              </a>
            </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
