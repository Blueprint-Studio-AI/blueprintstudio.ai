import { LENDING } from "@/data/prime-data";
import { V7 } from "@/data/prime-v7";

// Every word /prime-v8 says. The facts and voice are v7's (fact-checked against the app); the
// lines marked NEW were written for v8's interactions, in the same plain voice. Figures: only
// $2T+, 80%, 90%. Nothing is stamped "Live" (only Trade runs on real assets today).

export type Part = "avail" | "lent" | "loan" | "vault";
export type Split = Record<Part, number>;

export const V8 = {
  meta: V7.meta,
  footer: V7.footer,
  early: V7.early,
  cta: V7.cta,
  pillHidden: ["street", "view"],

  hero: V7.hero, // "Put your Bitcoin to work." · "Lend it, borrow dollars against it, or trade it, on Arch Network."

  // the lead's white band: a directory that doubles as the page's table of contents
  lobby: {
    label: "What it does",
    h2: "Choose what your Bitcoin does.",
    sub: V7.things.sub,
    rows: [
      { to: "earn", n: "01", name: "Earn", line: "Lend it out and earn interest.", tag: "Preview" }, // NEW (condensed)
      { to: "borrow", n: "02", name: "Borrow", line: "Borrow dollars against it instead of selling it.", tag: "Preview" },
      { to: "trade", n: "03", name: "Trade", line: "Swap Bitcoin and dollars. See the rate first.", tag: null },
      { to: "vaults", n: "04", name: "Vaults", line: "Let a manager run it.", tag: "Preview" },
      { to: null, n: "", name: "Boost", line: "Borrow against your vault holding to add more. Losses grow too.", tag: "Planned" },
    ],
  },

  tower: {
    label: "How it works",
    h2: "Follow your Bitcoin.",
    sub: "Bridge Bitcoin in as aBTC and connect your wallet. Pick a job; it starts when you sign. Withdraw to your wallet as aBTC or aUSD.",
  },

  floors: [
    {
      id: "earn",
      n: "01",
      rail: "Earn",
      tag: "Preview",
      title: "Lend it.",
      body: "Lend it out. Borrowers put up more than they take, and pay you interest.",
      hint: "Tap the token to switch Bitcoin and dollars.", // NEW
      acct: { avail: 60, lent: 40, loan: 0, vault: 0 },
    },
    {
      id: "borrow",
      n: "02",
      rail: "Borrow",
      tag: "Preview",
      title: "Borrow against it.",
      body: "Borrow dollars against your Bitcoin instead of selling it.",
      rules: V7.how.rules,
      hint: "Drag the loan to its limit. Then let the price fall.", // NEW
      acct: { avail: 25, lent: 40, loan: 35, vault: 0 },
    },
    {
      id: "trade",
      n: "03",
      rail: "Trade",
      tag: null,
      title: "Trade it.",
      body: "Swap Bitcoin and dollars (aBTC and aUSD). See the rate first.",
      hint: "Flip the pair.", // NEW
      acct: { avail: 25, lent: 40, loan: 35, vault: 0 },
    },
    {
      id: "vaults",
      n: "04",
      rail: "Vaults",
      tag: "Preview",
      title: "Or let a manager run it.",
      body: "Put in aBTC or aUSD. A manager works to grow it, and you hold a share.", // NEW, from v7's facts
      hint: "Switch between the two vaults.", // NEW
      acct: { avail: 10, lent: 40, loan: 35, vault: 15 },
    },
  ],

  loan: {
    max: LENDING.maxLtv,
    liq: 90,
    maxLabel: V7.how.loan.maxLabel,
    liqLabel: V7.how.loan.liqLabel,
    price: "If Bitcoin's price", // NEW microcopy
    holds: "Holds",
    falls: "Falls",
    chip: { room: "Room to spare", limit: "At the limit", past: "Some can be taken" },
  },
  vaults: V7.vaults.items,
  boostTab: "Boost",
  planned: "Planned",
  preview: "Preview",

  account: {
    label: "Your account",
    parts: { avail: "Available", lent: "Lent", loan: "Backing a loan", vault: "In a vault" },
    caption: "A preview of the app. Nothing here moves money.", // NEW
  },
  railTop: "Top",
  of: "of", // "02 of 04 · Borrow"

  view: {
    h2: "$2T+ in Bitcoin, mostly sitting idle.",
    body: "Put yours to work. Leave your email and what you'd bring. We'll write when you can start. Signing up moves no money.",
  },

  faq: {
    label: "Questions",
    h2: "Before you sign up.",
    sub: "Read these before you bring anything in.", // NEW
    items: V7.faq.items,
  },
} as const;
