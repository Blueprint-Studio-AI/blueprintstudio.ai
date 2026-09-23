import type { FaqEntry } from "@/components/faq";

// The prime-brokerage questions first, then the app's own FAQ (arch-prime features/earn/
// map-earn.ts). Every claim here needs a check against the app and Matt before this ships.
export const PRIME_FAQS: FaqEntry[] = [
  {
    question: "What is a prime brokerage account?",
    answer: (
      <p>
        One account where everything you hold earns, and everything you hold is collateral. A prime broker lets
        an institution keep its assets working while it borrows, trades and takes positions against them. Arch
        Prime does that for Bitcoin, on Bitcoin, for anyone.
      </p>
    ),
  },
  {
    question: "Why does that matter?",
    answer: (
      <p>
        Monetary efficiency. Most Bitcoin sits idle, and most capital in crypto sits split across venues: parked
        here to earn, moved there to borrow, sold to buy. In a prime account the same Bitcoin does all of it at
        once. Nothing sits idle, and nothing has to move.
      </p>
    ),
  },
  {
    question: "What happens to a plain deposit?",
    answer: (
      <p>
        It lends at the market rate from the first block, on its own. Nothing to set up, and it stays yours to
        withdraw whenever the market has liquidity.
      </p>
    ),
  },
  {
    question: "What is primeBTC?",
    answer: (
      <p>
        Bitcoin that earns. Deposit and hold primeBTC: Velox runs the strategy, you keep your Bitcoin exposure,
        and yield accrues daily to what you hold. Redeem to aBTC whenever you want.
      </p>
    ),
  },
  {
    question: "What does “build the bank” mean for me?",
    answer: (
      <p>
        The first deposits are the bank&rsquo;s first liquidity. Bring it early and you earn from day one and share
        in the upside as the bank grows. Access is limited while it is built.
      </p>
    ),
  },
  {
    question: "How much can I borrow?",
    answer: (
      <p>
        Up to 80% of what your collateral is worth, at the borrow rate. Past 90% the position liquidates, for
        everyone, with no exceptions.
      </p>
    ),
  },
  {
    question: "Does anything leave Bitcoin?",
    answer: <p>No. aBTC and aUSD are Arch assets on Bitcoin, and every vault, pool and market here settles there.</p>,
  },
];
