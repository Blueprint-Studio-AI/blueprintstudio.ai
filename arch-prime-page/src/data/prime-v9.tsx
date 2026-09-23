import type { ReactNode } from "react";
import type { FaqEntry } from "@/components/faq";
import { V6 } from "@/data/prime-v6";
import { V7 } from "@/data/prime-v7";

// /prime-v9 — the assembly. Most words come from a version that already said them; this file
// decides which travel, and carries the few v9 writes: a shorter hero, and the coin's story.
//
// Sections and where each came from:
//   hero             v6's idea, cut to two lines
//   the coin         v9's own: the hero's circle becomes Bitcoin, tells its story, is deposited
//   what it does     v7 ("Choose what your Bitcoin does.")
//   follow it        v8 ("Follow your Bitcoin." — the facade and the climb)
//   everything prime v5, ours (the peak)
//   questions        v8's layout, with eight kept from v5, v6 and v7 — see V9_FAQS
//   footer           v5, ours (the site footer)
// Figures stay to the rule (docs/prime-page-brief.md): only $2T+, 80% and 90%.

export const V9 = {
  meta: "Arch Prime: one account where your Bitcoin can earn, back a dollar loan, and trade — and you sign every step.",

  // shorter than v6's: one line for what it does, one for what makes it different
  hero: {
    h1: "Earn on your Bitcoin. Borrow against it.",
    sub: "One account. Your Bitcoin never leaves Bitcoin.",
    secondary: V6.hero.secondary,
  },

  // The coin: the circle the hero closes into turns orange, takes Bitcoin's mark, and holds
  // while three beats pass beside it — then it is deposited, and the page can talk about what
  // you can do with it. $2T+ lives here now rather than at the top of the climb.
  coin: {
    beats: [
      {
        label: "Today",
        h: "$2T+ in Bitcoin, sitting still.",
        body: "It earns nothing. It backs nothing. It waits.",
      },
      {
        label: "Arch Prime",
        h: "The same Bitcoin, as the foundation.",
        body: "It becomes the base of a prime brokerage account — and it never leaves Bitcoin. Arch Network settles it there.",
      },
      {
        label: "From day one",
        h: "Earn just for holding it.",
        body: "Deposit, and it earns from the first block. The same Bitcoin you were already holding.",
      },
    ],
    deposit: "Deposit",
  },

  // the climb's closing view: $2T+ moved up to the coin, so this says what the climb showed
  view: {
    h2: "That's the whole account.",
    body: "Put yours to work. Leave your email and what you'd bring. We'll write when you can start. Signing up moves no money.",
  },

  faq: {
    label: "Questions",
    h2: "Before you sign up.",
    sub: "Read these before you bring anything in.",
  },
} as const;

export type V9Faq = FaqEntry & { from: "v5" | "v6" | "v7" };

const para = (a: string): ReactNode => <p>{a}</p>;

/**
 * Eight questions, each one we can actually answer today.
 *
 * Cut, because the answer rested on something undecided or overclaimed:
 *  - "What does 'build the bank' mean for me?" — the early-liquidity upside is not a programme
 *    anyone has agreed to yet (it is on the open-decisions list).
 *  - "Does anything leave Bitcoin?" — it answered "no", but Bitcoin comes in over a bridge as
 *    aBTC, and a vault holds part of its assets off chain.
 *  - "What is primeBTC?" — it promised redemption "whenever you want"; a vault pays from what
 *    it keeps on hand and the rest waits in a queue.
 *  - "What happens to a plain deposit?" — said withdrawals come "whenever the market has
 *    liquidity", which skips the pause. "Can I always withdraw?" answers it properly.
 *  - "Why does that matter?" — folded into the first answer.
 *  - "Where do the dollars come from?" — "What pays the returns?" covers the same ground.
 *  - "Can I withdraw when most of the pool is lent out?" and v7's "What do I need?" — both
 *    near-duplicates of a question already on the list.
 *
 * `from` records the source and is not rendered.
 */
export const V9_FAQS: V9Faq[] = [
  {
    // v5's, with "why does that matter" folded in; definitional, so nothing to verify
    question: "What is a prime brokerage account?",
    answer: para(
      "One account where everything you hold can work at once. A prime broker lets an institution keep its assets earning while it borrows and trades against them, instead of splitting capital between one venue to earn and another to borrow. Arch Prime does that for Bitcoin.",
    ),
    from: "v5",
  },
  { question: V6.how.opener.q, answer: para(V6.how.opener.a), from: "v6" },
  { question: V7.faq.items[0].q, answer: para(V7.faq.items[0].a), from: "v7" },
  { question: V7.faq.items[1].q, answer: para(V7.faq.items[1].a), from: "v7" },
  {
    // the two figures the protocol actually sets
    question: "How much can I borrow?",
    answer: para(
      "Up to 80% of what your collateral is worth, at the borrow rate. Past 90% the position can be liquidated — some Bitcoin is sold to repay the loan. The same limits apply to every borrower.",
    ),
    from: "v5",
  },
  { question: V7.faq.items[3].q, answer: para(V7.faq.items[3].a), from: "v7" },
  { question: V6.faq.items[1].q, answer: para(V6.faq.items[1].a), from: "v6" },
  { question: V6.faq.items[0].q, answer: para(V6.faq.items[0].a), from: "v6" },
];
