// Movement 3 of the Chain page below-fold — "The financial primitives Arch unlocks"
// (§2.1 pools → §2.2 enforceable collateral → §2.3 real liquidations → §2.4 the unlock).
// Figures are Jaidon's exported illustrations in /public/img/chain.

import type { ReactNode } from "react";
import { Reveal } from "./chain-reveal";

type Section = {
  title: ReactNode;
  lede: ReactNode;
  figure: { src: string; alt: string; tight?: boolean };
};

const SECTIONS: Section[] = [
  {
    title: <>Bitcoin could send value. It just couldn&apos;t pool&nbsp;it.</>,
    lede: (
      <>
        A pool is shared capital that many people can trade against at once.
        It's a fundamental primitive for any non P2P market. 
        Bitcoin can&apos;t do it alone. Arch can, while keeping every coin&nbsp;native.
      </>
    ),
    figure: {
      src: "/img/chain/utxo-pool.svg",
      alt: "Peer-to-peer is one coin to one coin; a pool is many coins sharing one reserve — only possible on Arch.",
    },
  },
  {
    title: <>Collateral you can actually&nbsp;enforce.</>,
    lede: (
      <>
        A loan market only works if the lender can seize collateral without the borrower&apos;s consent. Arch enforces it
        mechanically and settles to Bitcoin — the borrower can&apos;t yank it&nbsp;back.
      </>
    ),
    figure: {
      src: "/img/chain/liquidation.svg",
      alt: "A price line crosses the liquidation threshold; the VM assembles a Bitcoin transaction that moves the collateral.",
      tight: true,
    },
  },
  {
    title: <>A liquidation that&apos;s on time and&nbsp;final.</>,
    lede: (
      <>
        A late liquidation isn&apos;t slow — it&apos;s a loss. Arch detects a breach, locks the price at signing, and
        broadcasts the closeout in under three seconds, then settles on&nbsp;Bitcoin.
      </>
    ),
    figure: {
      src: "/img/chain/fast-final.svg",
      alt: "Under three seconds from breach to broadcast on Arch, then about ten minutes for Bitcoin settlement — two timescales.",
    },
  },
  {
    title: <>Lending on Bitcoin — natively, for the first&nbsp;time.</>,
    lede: (
      <>
        Native settlement made the collateral enforceable; speed made the liquidations real. Together they make pooled
        lending possible on Bitcoin&nbsp;itself.
      </>
    ),
    figure: {
      src: "/img/chain/lending.svg",
      alt: "A ladder: pools plus enforceable collateral plus fast liquidation combine into pool-based lending on native Bitcoin.",
      tight: true,
    },
  },
];

export function ChainUnlock() {
  return (
    <section className="border-t border-black/[0.08] bg-white font-sans text-black antialiased">
      <div className="mx-auto w-[92%] max-w-[64rem] pb-28 pt-24 md:pb-40 md:pt-32">
        {/* macro intro — confident heading + a tight lede (Jaidon's flat editorial voice), no eyebrow.
            Brand serif, but a notch below the WhyBand hook ("Finance, finally native to Bitcoin.") —
            this is a chapter opener, not the page thesis. */}
        <Reveal>
          <h2 className="max-w-[19ch] text-balance font-serif text-[2.5rem] font-light leading-[1.05] tracking-[-0.012em] text-neutral-900 md:text-[3.25rem]">
            The financial primitives Arch&nbsp;unlocks.
          </h2>
          <p className="mt-6 max-w-[46ch] text-pretty text-[1.15rem] leading-[1.5] text-neutral-600 md:text-[1.25rem]">
            Pools, enforceable collateral, and real liquidations — the building blocks of markets, finally possible on
            native&nbsp;Bitcoin.
          </p>
        </Reveal>

        {/* the primitives — consistent text-LEFT / figure-RIGHT editorial rows with lots of air between.
            No card chrome, no eyebrows; the heading, the lede, three accented sub-points, and a big airy
            figure panel carry each one. */}
        <div className="mt-20 flex flex-col gap-28 md:mt-28 md:gap-44">
          {SECTIONS.map((s, i) => (
            <Reveal key={i} delay={i * 60} className="grid items-center gap-10 md:grid-cols-[2fr_3fr] md:gap-16">
              {/* image-first when stacked (order-1), text-left when side-by-side (md:order-1) */}
              <div className="order-2 md:order-1">
                <h3 className="text-balance text-[1.4rem] font-medium leading-[1.16] tracking-[-0.018em] text-neutral-900 md:text-[1.6rem]">
                  {s.title}
                </h3>
                <p className="mt-4 max-w-[44ch] text-pretty text-[1rem] leading-[1.6] text-neutral-600 md:text-[1.05rem]">
                  {s.lede}
                </p>
              </div>
              {/* big airy panel — fixed footprint (same as the prior diagrams); illustration scaled
                  down and centered with generous padding */}
              <figure className="order-1 flex h-[340px] min-w-0 items-center justify-center rounded-[12px] bg-neutral-100 p-12 md:order-2 md:h-[440px] md:p-20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.figure.src}
                  alt={s.figure.alt}
                  className={`block h-full max-h-full w-auto object-contain ${s.figure.tight ? "max-w-[min(300px,100%)]" : "max-w-full"}`}
                />
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
