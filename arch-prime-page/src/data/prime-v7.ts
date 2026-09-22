import { LENDING } from "@/data/prime-data";

// Every word /prime-v7 says — about 180 of them before anyone opens anything. Written for
// someone who has never heard of Arch, Arch Prime, aBTC or primeBTC: everyday words, one idea
// per line, each new term explained once where it first matters; the interactions hold the rest,
// a line at a time. Plainer words than the product's own, on purpose: "manager" (the app's
// curator; not named), "put in / hold / take out" (deposit / mint / redeem), "held outside Arch
// Network" (off chain), "enough on hand" (liquidity), "planned" (no timing implied).
// Rules (docs/prime-page-brief.md): figures only $2T+, 80%, 90%; nothing the app can't back;
// no stocks; nothing stamped "Live" (only Trade runs on real assets today).

const LIQ = 90;

export const V7 = {
  meta: "Put your Bitcoin to work: lend it, borrow dollars against it, or trade it, in one app on Arch Network.",

  cta: {
    primary: "Get early access",
    next: "Deposits aren't open to everyone yet.",
  },

  hero: {
    eyebrow: "Arch Prime",
    h1: "Put your Bitcoin to work.",
    sub: "Lend it, borrow dollars against it, or trade it, on Arch Network.",
  },

  things: {
    label: "What it does",
    h2: "Choose what your Bitcoin does.",
    sub: "Bitcoin comes in through a bridge as aBTC, a token that stands for it. Dollars come in as aUSD.",
    soonLabel: "Planned",
    previewLabel: "Preview",
    items: [
      { id: "earn", name: "Earn", line: "Lend it out. Borrowers put up more than they take, and pay you interest.", status: "preview" },
      { id: "borrow", name: "Borrow", line: "Borrow dollars against it instead of selling it.", status: "preview" },
      { id: "trade", name: "Trade", line: "Swap Bitcoin and dollars (aBTC and aUSD). See the rate first.", status: "live" },
      { id: "boost", name: "Boost", line: "Borrow against your vault holding to add more. Losses grow too.", status: "soon" },
    ],
  },

  how: {
    label: "How it works",
    h2: "Follow your Bitcoin.",
    steps: [
      { title: "Bring it in", line: "", small: "Bridge Bitcoin in as aBTC. Connect your wallet." },
      { title: "Put it to work", line: "", small: "Pick a job. It starts when you sign." },
      { title: "Take it back", line: "", small: "Withdraw to your wallet as aBTC or aUSD." },
    ],
    labels: { wallet: "Your wallet", arch: "Arch Prime", market: "The market" },
    signed: "You sign",
    loan: {
      max: LENDING.maxLtv,
      liq: LIQ,
      maxLabel: "The most you can borrow, of your Bitcoin's value",
      liqLabel: "Past here, some Bitcoin can be taken to repay",
    },
    rules: "Same limits for every borrower. You sign every move; only a loan past 90%, or a vault's manager, moves funds without you.",
  },

  vaults: {
    label: "Inside Earn",
    h2: "Or let a manager run it.",
    preview: "Preview",
    previewNote: "Preview means it's still being tested.",
    items: [
      {
        id: "primeBTC",
        kind: "Bitcoin vault",
        line: "A manager works to grow your aBTC.",
        facts: [
          { label: "Put in", value: "aBTC" },
          { label: "Hold", value: "primeBTC, your share" },
          { label: "Take out", value: "aBTC, now or later via a queue" },
        ],
        caution: "Its value can fall. Part is held outside Arch Network, valued by the manager's own reports.",
      },
      {
        id: "primeUSD",
        kind: "Dollar vault",
        line: "Works the same way, with aUSD.",
        facts: [
          { label: "Put in", value: "aUSD" },
          { label: "Hold", value: "primeUSD, your share" },
          { label: "Take out", value: "aUSD, now or later via a queue" },
        ],
        caution: "Same risks. In its pilot, a sponsor pays a demo return, not trading profit.",
      },
    ],
  },

  faq: {
    label: "Questions",
    h2: "Before you sign up.",
    items: [
      {
        q: "What pays the returns?",
        a: "Lenders earn the interest borrowers pay, on the part that's lent. A vault earns or loses with its manager's strategy. In primeUSD's pilot, a sponsor pays a demo return. Nothing is guaranteed.",
      },
      {
        q: "Can I always withdraw?",
        a: "Not always at once. Deposits, collateral included, come out when the market has enough on hand. A vault pays from what it keeps on hand; the rest waits in a queue you can cancel. The people running a market or vault can pause it, which holds withdrawals.",
      },
      {
        q: "What do I need?",
        a: "A Bitcoin wallet (Arch Wallet, UniSat, Xverse, Phantom or Leather) set to a Taproot address, aBTC or aUSD, and a little ARCH, Arch Network's own token, to pay network fees.",
      },
      {
        q: "What does it cost?",
        a: "Vaults charge a fee going in, one coming out, and fees inside the vault. Loans pay interest that moves with demand. Network fees are paid in ARCH.",
      },
    ],
  },

  // the page's one large number, at the top of the climb
  view: {
    figure: "$2T+",
    line: "in Bitcoin, mostly sitting idle.",
    sub: "Put yours to work.",
  },

  footer: "Arch Prime is built on Arch Network, the financial chain for Bitcoin.",

  early: {
    title: "Get early access",
    body: "Leave your email and what you'd bring. We'll write when you can start. Signing up moves no money.",
    bringLabel: "What would you bring?",
    bring: ["Bitcoin", "Dollars", "Both"],
    submit: "Get early access",
    doneTitle: "You're on the list.",
    doneBody: "We'll email you when you can start. No money has moved.",
  },
} as const;
