// Below-fold of the Chain page, ported from public/below/index.html and restyled to
// Jaidon's FLAT TYPOGRAPHIC look, reorganized into 3 clearly-distinct macro-beats:
//   1. WHY  — "Four rules we couldn't break" (deep-indigo band, four translucent cards)
//   2. HOW  — the §1.x mechanisms, as a flat BENTO BOX (chain-how.tsx)
//   3. WHAT YOU CAN DO — §2.x primitives + §3.x apps, one cohesive flat beat
//      (chain-unlock.tsx + chain-apps.tsx)
//
// Flat aesthetic: minimal borders/shadows (no white card chrome), diagrams sit in
// flat light-gray panels, lean on typography + whitespace. Hero is untouched.
//
// Token mapping (chain.css → Tailwind theme): cream → light, purple → dark-purple,
// purple-2 → purple, orange → orange; gray ramp ink/body/muted/faint → neutral-800/600/500/400.

import type { ReactNode } from "react";
import { Reveal } from "./chain-reveal";
import { ChainHow } from "./chain-how";
import { ChainUnlock } from "./chain-unlock";
import { ChainApps } from "./chain-apps";

type Rule = { n: string; title: ReactNode; icon: ReactNode; body: ReactNode };

// A rule title: lead keyword(s) on the first line, the descriptive clause on a
// second line (line break, no em dash).
function RuleTitle({ keyword, rest }: { keyword: string; rest: string }) {
  return (
    <>
      {keyword}
      <br />
      <span className="text-light/50">{rest}</span>
    </>
  );
}

const RULES: Rule[] = [
  {
    n: "01",
    title: <RuleTitle keyword="Native" rest="Real Bitcoin, or nothing." />,
    icon: (
      <>
        <path d="M8.5 5.5v13M11 3.5v2.5M14 3.5v2.5M11 18.5v2.5M14 18.5v2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M8.5 5.5h6a3.25 3.25 0 0 1 0 6.5h-6m0 0h6.6a3.25 3.25 0 0 1 0 6.5h-6.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
    body: (
      <>
        Your actual BTC, settled on Bitcoin. Never an IOU. Never a bridge&nbsp;claim.
      </>
    ),
  },
  {
    n: "02",
    title: <RuleTitle keyword="Fast & Deterministic" rest="Recovery is certain, not best-effort." />,
    icon: <path d="M13 2.5 5 13.2h5.4L11 21.5 19 10.8h-5.4L13 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />,
    body: (
      <>
        When a position breaches, liquidation fires mechanically and clears in the next&nbsp;block.
      </>
    ),
  },
  {
    n: "03",
    title: <RuleTitle keyword="Decentralized" rest="No single party can move your coin." />,
    icon: (
      <>
        <circle cx="12" cy="5" r="2.6" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="5" cy="18" r="2.6" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="19" cy="18" r="2.6" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10.6 7.2 6.4 15.8M13.4 7.2l4.2 8.6M7.6 18h8.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
    body: (
      <>
        No single key exists — a threshold of validators must sign together. Custody without a&nbsp;custodian.
      </>
    ),
  },
  {
    n: "04",
    title: <RuleTitle keyword="Programmable" rest="Real financial logic, native to Bitcoin." />,
    icon: <path d="M8.5 7.5 4 12l4.5 4.5M15.5 7.5 20 12l-4.5 4.5M13.5 5l-3 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />,
    body: (
      <>
        Lending, margining, liquidation, and structured products run directly against Bitcoin&nbsp;UTXOs.
      </>
    ),
  },
];

function WhyBand() {
  return (
    // Deep-indigo section-change beat — matches Jaidon's .band--why (#1f1c3e).
    // transform-gpu puts this opaque band on its own GPU layer so, as it scrolls over the fixed
    // hero illustration iframe at the seam, the compositor blends layers instead of repainting the
    // iframe each frame (that repaint was the open/close flicker).
    <section data-nav-theme="dark" className="bg-[#1f1c3e] transform-gpu">
      <div className="mx-auto w-[92%] max-w-[64rem] py-[7.5rem]">
        {/* large opening statement — the section's hook, brand serif, LEFT-aligned so it leads the
            same column as the four-rules header + cards below (no centered/left mismatch). */}
        <Reveal>
          <h2 className="max-w-[16ch] text-balance font-serif text-[clamp(2.5rem,6vw,4rem)] font-light leading-[1.05] tracking-[-0.02em] text-light">
            Finance, finally native to Bitcoin.
          </h2>
        </Reveal>

        {/* the "four rules" framing + intro, leading into the four cards (kept, demoted to h3) */}
        <Reveal className="mt-10 md:mt-14">
          <div className="max-w-[42rem]">
            <h3 className="text-balance text-[1.5rem] font-normal leading-[1.16] tracking-[-0.022em] text-light md:text-[1.85rem]">
              Four rules we couldn&apos;t break.
            </h3>
            <p className="mt-3.5 max-w-[48ch] text-pretty text-[1rem] leading-[1.5] text-light/[0.72]">
              Real finance on Bitcoin needs all four at once. Every prior attempt broke at least one — so markets never formed, and capital sat idle. Arch is the first to hold all four.
              {/* Every attempt to unlock finance on Bitcoin broke one of these rules. Markets never formed, and capital sat idle. Arch is the first to hold all four. */}
            </p>
          </div>
        </Reveal>

        {/* four translucent cards — bare icon pinned top, text block below, tall card */}
        <div className="mt-[3.75rem] grid grid-cols-1 gap-[14px] min-[520px]:grid-cols-2">
          {RULES.map((r, i) => (
            <Reveal
              key={r.n}
              y={0}
              delay={i * 80}
              className="flex min-h-[258px] flex-col rounded-[6px] bg-light/5 p-4 min-[520px]:p-5 md:p-6 lg:p-[30px]"
            >
              <span className="text-light/[0.78]" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" className="h-[26px] w-[26px]">
                  {r.icon}
                </svg>
              </span>
              <h3 className="mt-[2.4rem] text-balance text-[1.3rem] font-normal leading-[1.3] tracking-[-0.014em] text-light">
                {r.title}
              </h3>
              <p className="mt-[0.55rem] text-balance text-[0.95rem] leading-[1.42] text-light/50">
                {r.body}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ChainBelow() {
  return (
    <div className="bg-white font-sans text-black antialiased">
      <WhyBand />
      {/* black spacers give the off-black HOW band extra breathing room before/after it meets
          the neighbouring sections — NOT part of the pinned/sticky area. */}
      <div aria-hidden data-nav-theme="dark" className="h-[12vh] min-h-20 bg-[#2e2d33]" />
      <ChainHow />
      <div aria-hidden data-nav-theme="dark" className="h-[12vh] min-h-20 bg-[#2e2d33]" />
      <ChainUnlock />
      <ChainApps />
    </div>
  );
}
