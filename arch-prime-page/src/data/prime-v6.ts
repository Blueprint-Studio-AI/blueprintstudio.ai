import { LENDING } from "@/data/prime-data";

// Every word /prime-v6 says, in reading order — so the story can be read, argued and changed in
// one place. Built from the section map (~/Desktop/arch-prime-page-map-v1.md, revised after a
// cold-reader critique and a truth audit against the arch-prime app).
//
// Rules this file keeps (docs/prime-page-brief.md and the map):
// - Figures: only the market ($2T+) and protocol parameters (80% max loan to value, 90%
//   liquidation). No rate, total or count; nothing the product reports is live.
// - Voice: calm, exact, a verb in every line. No wealth/luxury/elite/VIP, no stack/moon/degen,
//   no "unlock", "be your own bank", "passive income", no "first".
// - One action, one label, three placements (hero, the ask, the view) plus the nav/phone pill.
// - Only claims the app backs today. Where the page waits on a decision, the gap carries a
//   `note` (shown with the review switcher's "Notes" toggle), never an invented answer.

const LIQ = 90;

// Every "Get early access" is a plain link here; early-access.tsx opens the sign-up dialog for it.
export const EARLY_HREF = "#early-access";

export const V6 = {
  meta: "Arch Prime is one account where your Bitcoin can earn, back a dollar loan, and trade, and you sign every step. See what it does and exactly what happens to your Bitcoin.",

  cta: {
    primary: "Get early access",
    // under every primary button: what the click costs and what happens next
    next: "Deposits aren't open to everyone yet. One email when they are.",
  },

  // §1 — looking up
  hero: {
    h1: "Earn on your Bitcoin. Borrow against it. From one account.",
    // held until decision 1 confirms collateral keeps earning: "Your Bitcoin doesn't have to pick one job."
    sub: "Arch Prime is one account where your Bitcoin can earn, back a dollar loan, and trade. You choose what it does, and sign every step.",
    secondary: "See how it works",
  },

  // §2 — the account; the page's hinge
  account: {
    label: "The Prime account",
    h2: "Everywhere else, Bitcoin has to pick a job.",
    beat1: "Most of the $2T+ in Bitcoin sits idle, and the rest is split: parked here to earn, moved there to borrow, sold to buy.",
    // the one display-size line between the hero and the close
    display: "Institutions don't split it.",
    beat2: "A prime broker gives them one account to earn, borrow and trade from. Arch Prime is that account, for your Bitcoin.",
    beat3: "Here the lending runs as a program on Arch Network, not a desk, and every position is one you opened, on one screen.",
    // the window itself, in three bands of equal area (no proportion implied), named outside it
    diagram: {
      parts: [
        { id: "lend", label: "Lent", value: "Earns on the share that's lent", tone: "#123164" },
        { id: "trade", label: "Available", value: "Yours to trade or withdraw", tone: "#8f9dbb" },
        { id: "borrow", label: "Backing a loan", value: "Collateral for your dollar loan", tone: "#3e5a8c" },
      ],
    },
  },

  // §3 — the only list of capabilities, shown as the account itself
  screen: {
    h2: "See every position on one screen.",
    lead: "The Portfolio is the account. Each thing you do in Prime lands there.",
    caption: "Figures appear when deposits open.",
    base: { src: "/img/prime/v6/screen-portfolio.png", alt: "The Arch Prime app: the Portfolio screen" },
    baseMobile: { src: "/img/prime/v6/screen-account.png", w: 804, h: 944, alt: "The Arch Prime app: the Account panel of the Portfolio" },
    rows: [
      {
        id: "earn",
        name: "Earn",
        title: "Lend it, or hold primeBTC.",
        body: "Lend aBTC to the market, or hold primeBTC, a vault run by a curator. Dollars too, as primeUSD.",
        crop: { src: "/img/prime/v6/screen-earn.png", w: 1020, h: 1108, alt: "Minting primeBTC with aBTC" },
      },
      {
        id: "trade",
        name: "Trade",
        title: "Swap aBTC and aUSD.",
        body: "Quote, fee and minimum received, before you sign.",
        crop: { src: "/img/prime/v6/screen-trade.png", w: 2536, h: 720, alt: "Swapping between Bitcoin and dollars" },
      },
      {
        id: "borrow",
        name: "Borrow",
        title: "Borrow against it.",
        body: "Draw aUSD, Arch's dollar asset, against your aBTC.",
        crop: { src: "/img/prime/v6/screen-borrow.png", w: 804, h: 1618, alt: "Borrowing aUSD against aBTC, with the loan-to-value meter" },
      },
    ],
    next: { name: "Next", tag: "Planned", title: "Borrow against primeBTC." },
    note: "Decision 4: Margin or Boost, and its name. The app's nav calls it Boost; neither is built.",
  },

  // §4 — the mechanism, and the page's one home for trust
  how: {
    h2: "Follow your Bitcoin in, and back out.",
    lead: "Where it goes, who else can move it, what pays the yield and how you take it back.",
    opener: {
      q: "Is this like lending your Bitcoin to a platform?",
      a: "A plain deposit is lent by a program, to borrowers who posted more collateral than they drew. primeBTC and primeUSD are different: a curator deploys most of them off chain, and you trust that curator.",
    },
    steps: [
      {
        n: "01",
        title: "Bring it onto Arch",
        tags: ["Arch Network"],
        body: `Bitcoin arrives as aBTC, and dollars as aUSD. You sign every move you make. Two others can move funds: liquidators, past ${LIQ}%, and the vaults' curator, within its mandate.`,
        note: "Decision 2: one sentence on what backs aBTC and aUSD, who can release them and how they return, that Arch can say next to /chain's \"Never a bridge claim.\" The app calls both bridged.",
        link: { label: "How the chain works", href: "/chain" },
      },
      {
        n: "02",
        title: "Put it to work",
        tags: ["Arch Prime", "Curator"],
        body: "Lend it, and it lends to people borrowing Bitcoin against dollars. It earns on the share that is lent, so the yield depends on that demand.",
        more: "Or hold primeBTC, a vault share. Part is held on chain as a reserve, the rest off chain, outside Arch Network's guarantees. Its value moves with each curator report, and it can fall. primeUSD works the same way in aUSD, with the same curator.",
        note: "primeUSD's live pilot pays sponsor-funded returns, not strategy returns (the app says so on its screen). Product to confirm the line to use, or cut primeUSD from §3.",
      },
      {
        n: "03",
        title: "Borrow against it",
        tags: ["Arch Prime", "Arch Network"],
        body: `Post aBTC and draw aUSD, up to ${LENDING.maxLtv}% loan to value. Past ${LIQ}%, the position liquidates, for everyone, with no exceptions.`,
        more: "primeBTC can't back a loan yet.",
        note: "Decision 1: does posted aBTC keep earning while it backs the loan? The lending spec treats collateral as the supplied balance itself (lending-behavior-spec §2.4, §2.6), which says yes. Product to confirm; if it does, the hero can say \"Your Bitcoin doesn't have to pick one job.\"",
        link: { label: "How liquidation clears", href: "/chain" },
      },
      {
        n: "04",
        title: "Take it back",
        tags: ["Arch Prime"],
        body: "A lent deposit withdraws when the market has liquidity and isn't paused.",
        more: "primeBTC redeems to aBTC: the reserve pays at once, larger requests join a queue you can see and cancel, and an emergency pause can hold everything.",
      },
    ],
    relyTitle: "What you rely on",
    rely: [
      `Up to ${LENDING.maxLtv}% loan to value`,
      `Liquidation past ${LIQ}%, for everyone`,
      "The price feed that sets your loan to value",
      "What backs aBTC and aUSD, and who can release them",
      "The payout order: reserve first, then the queue",
      "The curator, for primeBTC and primeUSD",
      "Whoever can pause the market",
      "The contracts",
      "Bitcoin's price",
      "Fees before you sign, and ARCH for network fees",
    ],
    relyNote: "Name the contracts' audit status here (for example \"not yet audited\") once confirmed.",
    close: "Someone has to fund these loans.",
  },

  // §5 — the ask's one home, sized to what the button asks: an email
  bank: {
    eyebrow: "Build the Bank",
    h2: "Every loan here starts with a deposit.",
    paths: [
      { label: "Bring dollars", body: "You fund the loans Bitcoin holders draw." },
      { label: "Bring Bitcoin", body: "You fund the loans drawn against dollars." },
    ],
    both: "Both earn on the share that is lent.",
    ask: "Early access costs an email and moves no funds.",
    note: "Decisions 3 and 5: what early access gets you (\"first in when deposits open, with the terms before anyone deposits\" only if Business confirms), and whether an early-liquidity programme exists. Legal to review \"bank\".",
  },

  // FAQ — what the ask raises, before the last ask
  faq: {
    h2: "Before your first deposit.",
    lead: "What you'll need, and what happens after you sign up.",
    items: [
      {
        q: "What does early access mean?",
        a: "Deposits aren't open to everyone yet. Leave your email and say what you'd bring, and you'll get one email when they open, with what you'll need to start. Joining moves no funds and commits you to nothing.",
      },
      {
        q: "What do I need to start?",
        a: "A Bitcoin wallet (Unisat, Xverse, Phantom, Leather or Arch), aBTC or aUSD to deposit, and a little ARCH to pay network fees.",
      },
      {
        q: "Can I withdraw when most of the pool is lent out?",
        a: "A lent deposit withdraws when the market has liquidity and isn't paused. When most of the pool is lent out, a withdrawal waits for borrowers to repay or for new deposits. Rates move with demand, so a pool that's mostly lent out pays lenders more and costs borrowers more.",
      },
      {
        q: "Where do the dollars come from?",
        a: "From other people's deposits. Dollar holders lend aUSD to the market, and that is what Bitcoin holders borrow. Lenders earn from the interest borrowers pay.",
      },
    ],
    partner: { label: "Partnering, or an institution? Talk to us", href: "https://form.typeform.com/to/YUZ7T5jy" },
    docs: { label: "Read the docs", href: "https://docs.arch.network/" },
  },

  // §7 — where it's going, as intent (a full section once legal clears stocks)
  next: {
    h2: "It starts with Bitcoin.",
    body: "primeBTC and primeUSD come first. As Arch brings more markets to Bitcoin, each one joins this same account.",
    note: "Conditional: a full section once legal clears stocks (and tickers). Until then the map folds this into one line of the view's sub.",
  },

  // §8 — the view; the mirror of the hero, and the last section
  view: {
    caption: "The view from here",
    h2: "From up here, it keeps working.",
    sub: "Earn on your Bitcoin and borrow against it, from one account where you sign every step.",
    secondary: "How the chain works",
  },

  footer: "Arch Prime is built on Arch Network.",

  early: {
    title: "Get early access",
    body: "Leave your email and you'll get one email when deposits open, with what you'll need: a supported wallet, aBTC or aUSD, and a little ARCH for network fees.",
    bringLabel: "What would you bring?",
    bring: ["Bitcoin", "Dollars", "Both"],
    submit: "Get early access",
    doneTitle: "You're on the list.",
    doneBody: "We'll email you once, when deposits open.",
  },
} as const;
