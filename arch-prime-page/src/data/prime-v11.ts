import { EARLY_HREF, V6 } from "@/data/prime-v6";

// /prime-v11 — built section by section (Nick, 2026-09-22): §1 hero, §2 offers, §3 how, §4 next,
// §5 questions, §6 view.
// Every word, every flag and every field number the hero uses lives here, so copy and the
// director's calls can be flipped without touching the component.
//
// Truth rules (docs/prime-page-brief.md) still apply: no "never leaves Bitcoin", no "first", no
// stocks, nothing "Live", no "unlocks", and no figure other than 80% / 90% (none is needed here).
// "$2T+" is gone: Bitcoin's market is ~$1.73T today (CoinGecko, 2026-09-22), so the dots carry the
// scale instead of a number. If a figure comes back it goes in `figure`, checked the day it ships.

/** How the photo circle becomes the Bitcoin coin: a coin flip on its vertical axis (default), or
    orange rising through the circle from the bottom like a fill line. */
export type TurnMode = "flip" | "flood";
/** How the grey field lights: a fast ripple out from the centre (≈500ms), or every dot at once. */
export type LightMode = "ripple" | "all";

export const V11 = {
  meta: "Arch Prime: earn on your Bitcoin and borrow against it, from one account where you sign every move.",

  // §1 — over the photograph. Flow text: it scrolls (and lifts) away, it never fades to a ghost.
  hero: {
    logo: "/img/prime/arch-prime-logo-light.svg",
    logoAlt: "Arch Prime",
    /** One sentence per line: the break always falls between the two sentences. */
    h1: ["Earn on your Bitcoin.", "Borrow against it."],
    sub: "Arch Prime is one account for your Bitcoin: hold it, put it to work, and sign every move yourself.",
    cta: "Get early access",
    ctaHref: "#early-access",
    note: "We'll email you when you can start. Signing up moves no money.",
  },

  // The two headlines at the top of the stage, handed off one to the other (never both at once).
  beats: {
    idle: { h: "Most Bitcoin sits still.", sub: "It earns nothing. It backs nothing. It waits." },
    prime: { h: "Prime puts it to work.", sub: "Earn on it, borrow against it and trade it, from one account." },
  },

  /** Empty on purpose — see the note at the top. When filled, it shows above the idle headline. */
  figure: "",

  /** The optional personal read under the centre dot ("one of these is yours"). Off by default. */
  centreLabel: "Yours",

  // The director's calls, as flags.
  flags: {
    turn: "flip" as TurnMode,
    light: "ripple" as LightMode,
    showCentreLabel: false,
  },

  // The photographs: the looking-up tower, landscape for the desktop, portrait for the phone.
  photo: {
    desktop: { src: "/img/prime/hero-ascent.webp", width: 2736, height: 1536 },
    mobile: { src: "/img/prime/hero-ascent-mobile.webp", width: 1080, height: 1924 },
    /** The close's dolly (aperture.tsx): once the circle fits in the frame, the photograph shrinks
        with it so the coin holds the picture, not a crop of plain sky. `k` is how much larger than
        the circle strictly needs the photo stays (the slack it can be panned in); `focus` pans
        into that slack toward the photo's bottom edge (0 = centred, 1 = the circle's bottom on the
        photo's), where the lit building and the sunset are. `focusX` pans sideways the same way
        (−1 = the circle's left edge on the photo's left, 1 = right; 0 = centred): the landscape
        photo's towers sit at its left and right edges, so this is what brings one into the coin. */
    dolly: { k: 1.25, focus: 1, focusX: -1 },
  },

  // The dot field, in PITCH UNITS (one grid step = 1). field.ts builds it and DERIVES the rest
  // (its footprint and the solid disc the grown dots merge into), so changing the radius, the dot
  // or the merge scale is the only edit a new dot count needs. hero.tsx sizes it in px.
  field: {
    /** Grid radius in pitches: a square grid clipped to this circle (field.ts counts the dots). */
    radius: 9.4,
    /** A dot's diameter, as a fraction of the pitch. */
    dot: 0.72,
    /** Form: each dot scales by this, so its radius (dot / 2 × merge) is more than half the
        diagonal pitch (√2 / 2) and the grown dots cover the disc with no gaps. field.ts raises it
        if a new dot size makes it too small, so a wrong value can't open holes in the form. */
    merge: 2.02,
    /** Level of detail: a coin shows its ₿ fully from lod[1] px across, none below lod[0]. */
    lod: [26, 56] as const,
    /** Largest field diameter, px, and the least margin around it, px. */
    maxDiameter: 560,
    margin: 24,
    /** The coin the photo closes into (and the centre dot the camera pulls back from), px:
        `ratio` of the field diameter, clamped. */
    coin: { ratio: 0.36, min: 112, max: 200 },
  },

  /** The primeBTC token the field forms into: the glyph at this fraction of the disc's diameter,
      as <Mark kind="primeBTC"> sets it. Its art and colour are marks.tsx's TOKEN. */
  token: { glyphRatio: 0.5 },

  // ── §2 `#offers` — what Prime offers ──────────────────────────────────────
  // The page's still point: all four together on one screen, no sequence, no reveal but one.
  // Nick's call — the offerings must never be obscured one at a time; the elevator belongs to §3.
  offers: {
    eyebrow: "What Prime Offers",
    h2: "You choose what your Bitcoin does.",
    /** The Figma's fourth card is labelled *Boost* but carries the *vault* copy. Boost is a nav
        stub in the app with no page, and its real meaning is borrowing against a vault holding to
        add more — so the fourth card is Vaults (true today) and Boost is the optional fifth.
        Flip this to true and the grid goes to five columns; nothing else changes. */
    showBoost: false,
    /** `note` is the slot under the body: a 1px rule plus a line of supporting copy. The rule
        renders ONLY when a card has a note (Nick: if it ends up text only, drop the rule), so
        with these empty the section is text only. */
    /** The tiles are Nick's own rendered icons (~/Desktop/Arch Assets/Icons/Opportunities,
        192×192 PNG with their own rounded corners), copied to public/img/prime/v10/off-*.png:
        Earn navy, Borrow green, Trade grey, Vaults maroon. Swapping one is a file swap. */
    cards: [
      {
        id: "earn",
        title: "Earn",
        /* same confirmation as step 01: does a deposit lend on its own today? */
        body: "Deposit and it lends. Borrowers put up more than they take, and pay you interest.",
        chip: "In testing",
        note: "",
        img: "/img/prime/v10/off-earn.png",
      },
      {
        id: "borrow",
        title: "Borrow",
        body: "Borrow dollars against your Bitcoin instead of selling it.",
        chip: "In testing",
        note: "",
        img: "/img/prime/v10/off-borrow.png",
      },
      {
        id: "trade",
        title: "Trade",
        body: "Swap Bitcoin and dollars (aBTC and aUSD). See the rate first.",
        chip: "",
        note: "",
        img: "/img/prime/v10/off-trade.png",
      },
      {
        id: "vaults",
        title: "Vaults",
        body: "Put in aBTC or aUSD. A manager works to grow it, and you hold a share.",
        chip: "In testing",
        note: "",
        img: "/img/prime/v10/off-vaults.png",
      },
    ],
    /** Shown only when showBoost is true. */
    boost: {
      id: "boost",
      title: "Boost",
      body: "Borrow against your vault holding to add more. Losses grow too.",
      chip: "Coming soon",
      note: "",
      img: "/img/prime/v7/b-boost.webp",
    },
  },

  // ── §3 `#how` — how it works (the elevator) ───────────────────────────────
  // One account, four steps, in order: the page's only sequential piece. The ground is the
  // Figma's neutral black (#121215 / #191a1d / #2a2a2e), not the navy the rest of v10 uses —
  // flagged for §4's cohesion pass.
  how: {
    /** The header band: Nick's own colour-corrected photograph, pulled from the Figma file
        (node 516:103, asset 096df.png — 1024×308, the only resolution the file holds). It is
        NOT v8's blue facade; that one is retired here. */
    band: {
      desktop: "/img/prime/v10/band.webp",
      mobile: "/img/prime/v10/band-mobile.webp",
    },
    eyebrow: "What a prime asset is",
    /** FLAG for Nick and legal: "a prime brokerage account" states what the product *is*, which
        the truth pass said needs sign-off. `h2Alt` is the one-word swap if it doesn't clear. */
    h2: "How your Bitcoin becomes prime.",
    h2Alt: "Working by default. Prime by choice.",
    /** The one sentence under the headline: what Prime is, before any mechanics. */
    /** The definition, in two tiers — the client's own framing (2026-09-22): deposit and you are
        already earning by lending ("helping build the bank"); make it prime and the same position
        earns more. Prime is the upgrade, not the only state. */
    lede:
      "Deposit Bitcoin into Arch Prime and it starts earning by lending \u2014 that is the bank you are helping build. Make it prime and the same position earns more, while you keep the claim and decide what it does.",
    /** THE RAIL'S INACTIVE OPACITY — Nick's Figma value, and a DELIBERATE, FLAGGED a11y
        deviation. At 0.2 the inactive labels land near 1.3:1 on #100e12 and they are real
        buttons, so this fails WCAG 1.4.3. It ships behind this token so it is one edit, and
        prime-v11.css raises every row to full opacity on hover AND focus-visible. Nick decides
        before the page ships; 0.55 is the value that clears AA at 18px SemiBold. */
    railDim: 0.2,
    /** Four steps: the end-to-end flow. Bring it in → claim primeBTC → put it to work → take it
        out. Nick: don't add steps — flesh each one out.

        THE FACTS ARE QUANTITATIVE AND SOURCED (spec §8.2). `n` is the figure that leads the fact
        and `l` is the line that explains it; a fact with no provable figure keeps `n: ""` rather
        than carrying an invented one. EVERY figure below traces to the comment beside it — the app
        repo (~/Desktop/Claude Code/arch-prime-app), this site's own published copy, or
        docs/prime-page-brief.md. If a figure can't be traced, it doesn't ship.

        REJECTED on purpose, so nobody re-adds them: the 0.10% / 0.30% mint and redemption fees and
        the 20% performance fee (all frame placeholders in the app's prime-btc.ts, whose own header
        says so; vaults-behavior-spec.md:11 states the performance rate does not exist on chain);
        every live reading (APY, TVL, NAV, reserve %, capacity) — placeholders, and stale the day a
        static page ships; "within one 24-hour report cycle" (design copy only, no cadence is set);
        "~1% borrow APR" (prime-page-brief.md:258 flags it unconfirmed, and real APRs move with
        utilisation); 1,500 TPS (provable, but it explains nothing about this flow); and "$2T"
        (false — Bitcoin is ~$1.73T today). Rejected in the review pass, for the same reason:
        "180 ms" (Arch's block time — true, but the Bitcoin side sets the wait when you bring it
        in), "30d" (the APY's window is 30 d ELSE 7 d else since inception, so it is a ceiling,
        not a constant) and "0.5%" (a UI slippage default, which in a rail reads as a fee).
        A number that only counts the words beside it is not a figure either: hence no "3". */
    /** THE FOUR STEPS. Rail label, serif title, and a body that runs to THREE LINES against the
        frame (spec §3 FINAL, Figma 518:115): Nick wants the longer, more descriptive register,
        and the three sourced facts that used to sit under the body are gone from the section —
        they are kept, unrendered, in `factsArchive` below so nothing researched is lost. */
    steps: [
      {
        n: "01",
        /** the floor rail's label — the step's name, not its sentence */
        railLabel: "01 – Deposit",
        title: "Deposit, and it works.",
        // apps/web/wallet/adapters/adapter.ts:58 + :62 ("Read before anything is signed")
        /* TO CONFIRM WITH TYLER before this ships: the client says a deposit lends automatically
           ("you automatically start earning via lend for helping build the bank"). Nothing in the
           app repo shows auto-supply on deposit today — Auto Earn is a managed-strategy product
           page, not a deposit behaviour. If it is not live, soften to "put it to work lending". */
        body: "Bitcoin arrives on Arch as aBTC, the token that stands for it. Deposit, and it lends to borrowers who pay interest \u2014 the bank everyone borrows from, built out of deposits like yours.",
      },
      {
        n: "02",
        railLabel: "02 – Make it prime",
        title: "Make it prime.",
        // apps/web/features/vaults/data/prime-btc.ts:133 (NAV per share from chain) +
        // docs/vaults-behavior-spec.md:11, :15 — a share priced at NAV, not a 1:1 receipt
        body: "The same position, earning more. You hold primeBTC: your claim on the aBTC you put in and on what it earns. Not a sale, not a swap \u2014 redeem it and the aBTC comes back.",
      },
      {
        n: "03",
        railLabel: "03 – Use it",
        title: "Use it without selling.",
        // packages/sdk/src/lending/math.ts:51-52 (lend/borrow rates) + docs/trade-behavior-spec.md:80
        // (a matched quote renders Rate / Network fee / Min received before you sign)
        body: "Borrow aUSD against your Bitcoin instead of selling it, or swap between the two. Every job shows its terms before you sign.",
      },
      {
        n: "04",
        railLabel: "04 – Take it out",
        title: "Take it out.",
        // docs/vaults-behavior-spec.md:25 (the reserve pays in the same transaction), :53 (the
        // queue is first in, first out and cancellable)
        body: "Redeem primeBTC for aBTC. The reserve pays out now; the rest waits in a queue you can cancel.",
      },
    ],
    /** ARCHIVED, NOT RENDERED. The three sourced facts each step used to carry under its body.
        §3 FINAL cuts them from the section (the longer body carries the detail now), and they are
        kept here — with their sources — so a later section can pick them up without re-research.
        Nothing imports this; it is a record. */
    factsArchive: {
      "01": [
        // apps/web/wallet/adapters/index.ts:17 — ADAPTERS = arch, unisat, xverse, phantom, leather
        { n: "5", h: "Wallets", l: "Arch Wallet, UniSat, Xverse, Phantom or Leather." },
        // apps/web/wallet/adapters/adapter.ts:76-78 (/^(bc1p|tb1p|bcrt1p)/) + wallet-provider.tsx:60-65
        { n: "bc1p", h: "Taproot only", l: "Prime connects to a Taproot address, checked before it links." },
        // apps/web/wallet/adapters/adapter.ts:58 (every adapter hands back a TransactionSigner;
        // :62 "Read before anything is signed") — no figure exists, so none is invented.
        // REJECTED here: Arch's 180 ms block time (sourced and true, but it is a chain-throughput
        // stat in a step about bringing Bitcoin IN, where the Bitcoin side sets the wait).
        { n: "", h: "You sign", l: "Nothing moves until you approve it." },
      ],
      "02": [
        // apps/web/features/vaults/data/prime-btc.ts:133 + docs/vaults-behavior-spec.md:11 —
        // NAV per share comes from chain; no figure exists to lead with, so none is invented
        { n: "", h: "A claim, not a sale", l: "primeBTC is a share in the vault, priced at NAV." },
        // docs/vaults-behavior-spec.md:15 — NAV per share is chain state and the APY's window is
        // "30 d, else 7 d, else since inception", so neither is a constant this page can state.
        // REJECTED: "30d" (a ceiling on the window, not the window).
        { n: "", h: "It moves with the vault", l: "Its value can rise or fall." },
        // apps/web/features/vaults/data/prime-btc.ts:143 (reserve on chain, the rest deployed)
        // and :133 (the rate can fall)
        { n: "", h: "Part sits off Arch", l: "A manager deploys part of it; the value can fall." },
      ],
      "03": [
        // ORDER: Lend · Borrow · Trade — the body's order and the picture's legs, left to right.
        // packages/sdk/src/lending/math.ts:51 — `lending: mul(base, ur)`: the LENDER earns the
        // BASE rate × utilisation. (:52 `borrow: mul(base, ONE + feeIr) + feeFixed` is the
        // borrower's, fees included — the two are not the same rate.) A rate, not a number.
        { n: "", h: "Lend", l: "You earn the base rate times the share borrowers have taken." },
        // src/data/prime-data.ts:24 (LENDING.maxLtv = 80) + docs/prime-page-brief.md:229
        { n: "80%", h: "Borrow", l: "Up to 80% of collateral value; liquidation from 90%." },
        // docs/trade-behavior-spec.md:80 (T7 — Rate / Network fee / Min received render on a
        // matched quote). REJECTED: the 0.5% slippage default (trade-overview.tsx:45 is a UI
        // constant standing in for a control that does not exist yet, and in a rail it reads
        // as a trading fee).
        { n: "", h: "Trade", l: "Swap aBTC and aUSD, and see the rate first." },
      ],
      "04": [
        // docs/vaults-behavior-spec.md:25 (net assets for an instant redemption)
        // and :45 ("Redeemed N aBTC from the reserve.")
        { n: "", h: "From the reserve", l: "What the vault holds on chain pays out in the same transaction." },
        // docs/vaults-behavior-spec.md:53 (shares queued, and how many entries stand ahead)
        // and :25 ("after N ahead")
        { n: "", h: "Or in a queue", l: "Requests fill first in, first out; you see how many are ahead." },
        // docs/vaults-behavior-spec.md:27 — the program refuses all three while a pause is on
        { n: "", h: "A pause holds it", l: "Deposits, redemptions and cancellations all wait until it lifts." },
      ],
    },
  },


  // ── §4 `#questions` — before you sign up ──────────────────────────────────
  // The objections the page can't answer inline, immediately BEFORE the ask: v9 asked the reader
  // to sign up before it said whether they could get their money out. No button in this section.
  //
  // THE FIVE ANSWERS ARE THE CORRECTED ONES (page spec §7.1, repeated verbatim in close-spec §5)
  // and they are word for word. What was taken OUT of them, so nobody puts it back:
  //   "1:1"              — primeBTC is a NAV-priced share in a vault, not a one-for-one receipt.
  //   "sold"             — a liquidation is a program acting on collateral, not a sale desk.
  //   "whenever you want" — a withdrawal waits on the reserve, the queue and any pause.
  // Every "it can happen" / "not always" opening stays: the honest answer leads.
  questions: {
    eyebrow: "Questions",
    h2: "Before you sign up.",
    sub: "Read these before you bring anything in.",
    items: [
      {
        /* THE QUESTION EVERY READER ARRIVES WITH (v11). Nick: the hardest thing to communicate is
           the difference between BTC and primeBTC — "am I actually giving up my Bitcoin?" It is
           answered first, in the reader's own words, and it never claims primeBTC IS Bitcoin. */
        q: "Is primeBTC still my Bitcoin?",
        a: "It is your claim on it. Bitcoin arrives on Arch as aBTC, the token that stands for it; put aBTC into the vault and you hold primeBTC, your share of everything the vault holds. You have not sold it and you have not swapped it for something unrelated \u2014 redeem primeBTC and aBTC comes back, from the reserve now or from the queue. What changes is that its value moves with the vault, up and down.",
      },
      {
        q: "Can anyone move my money without me?",
        a: "It can happen. You sign every move you make, and lending runs as a program on Arch Network, not a desk. But a loan that reaches its liquidation limit can be liquidated without you, a vault's manager decides how the vault's money is used, and the people running a market or a vault can pause it.",
      },
      {
        q: "Can I always withdraw?",
        a: "Not always at once. A deposit, collateral included, comes out when the market has enough on hand, and collateral only while your loan stays under its limit. A vault pays from what it keeps on hand, and the rest waits in a queue you can cancel. A pause holds withdrawals, and a vault's pause holds cancelling too.",
      },
      {
        q: "What pays the returns?",
        a: "Lenders earn the interest borrowers pay, less the market's fees, on the part that's lent. A vault earns or loses with its manager's strategy. In primeUSD's pilot, a sponsor pays a demo return. Nothing is guaranteed.",
      },
      {
        q: "What do I need to start?",
        a: "A Bitcoin wallet (Arch Wallet, UniSat, Xverse, Phantom or Leather) set to a Taproot address, aBTC or aUSD, and a little ARCH, Arch Network's own token, to pay network fees.",
      },
      {
        q: "What does it cost?",
        a: "Vaults charge a fee going in, one coming out, and fees inside the vault. Borrowers pay interest that moves with demand, and the market can keep part of it as fees. Network fees are paid in ARCH.",
      },
    ],
  },

  // ── §5 `#view` — the view from the top ────────────────────────────────────
  // The bookend and the page's only ask besides the hero's, and the last thing before the footer.
  // The hero looked UP from the street; this looks OUT from the top of the building just climbed —
  // so this H2 is the one other SERIF headline on the page.
  //
  // NO WORDS ON THE PHOTOGRAPH: the picture is the picture, the words sit under it on #172b56.
  // The promise is printed ONCE — it is the note, so the body stops at "what you'd bring".
  //
  // FLAG FOR NICK (not changed here): the penthouse photograph centres the Empire State Building,
  // whose image is trademarked for commercial use. It has been on every version since v8 and it
  // needs a licence or a different view before this page ships.
  view: {
    h2: "Your ticket to the top.",
    /* the long game, as intent, never a promise: "eventually it will all be prime" (client). */
    body: "Deposit, start earning, and help build the bank everyone borrows from. Bitcoin first \u2014 in time, we plan for anything you hold to work this way.",
    cta: V6.cta.primary,
    ctaHref: EARLY_HREF,
    note: "We'll email you when you can start. Signing up moves no money.",
  },

  footer: "Arch Prime is built on Arch Network.",
  cta: { primary: V6.cta.primary },
  early: V6.early,
  /** The phone pill steps aside over these ids: the hero's words and §6, the two places the page
      already shows the button, so the pill never doubles a visible ask — and §5, where the page
      shows a DIFFERENT control the reader has to be able to hit.
      §5 IS NOT OPTIONAL. At 390 the pill sits x 218–374, y 784–828; the FAQ rows run to x 366 and
      every plus sits at x 356, so each of the five questions passes under the pill's 44px band as
      it scrolls. `document.elementFromPoint` at that plus returns the pill, and the tap opens the
      sign-up dialog instead of the answer — on "Can I always withdraw?", the page substitutes the
      ask for the answer, which is the exact inversion §5 exists to prevent. The pill's own rule
      already says step aside wherever the page shows a control to use; this is that rule applied
      to a control that is not a second ask. It costs about 0.7 of a viewport of quiet.
      §3 IS THE SAME CASE. Below lg the stage does not pin, so the 01–04 discs are the ONLY way to
      change the step and the row can rest anywhere on screen. Parked near the foot at 390,
      `elementFromPoint` at the centre of 03 and 04 returns the pill's anchor: a reviewer tapping
      "04" gets the sign-up dialog. Padding under the discs cannot fix it — the collision depends
      on where the reader stops scrolling, not on where the discs sit in the flow. */
  pillHidden: ["hero-words", "how", "questions", "view"] as readonly string[],
} as const;
