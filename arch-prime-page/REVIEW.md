# Arch Prime page — v10 and v11, for review

A copy of `Blueprint-Studio-AI/arch-website` (branch `prime-page`, Tyler's f04714d) with two new
routes added. Nothing here is on `prime-page` itself — Nick has no write access to that repo, so
this folder is the review copy. Both routes are `noindex` and neither touches v5–v9.

## Run it

```bash
cd arch-prime-page
pnpm install
pnpm dev --port 4655
```

Then open **/prime-v11** (the current one) or **/prime-v10**. The switcher bottom-left flips
between v5 … v11.

## What the two are

**v10** — the page built section by section: the hero (the photograph closes into a coin, the
camera pulls back to a field of Bitcoin, it greys, lights, and forms the primeBTC token) → what
Prime offers, four cards visible at once → how it works, the elevator with its floor rail, centred
frame, LED floor indicator and /chain's sliding window → the questions → the view from the top.

**v11** — v10 plus a content pass, after auditing what a reader still could not answer:

| Gap | What v11 does |
|---|---|
| Nothing said what Arch Prime *is* | One line under the hero promise |
| "Prime" was never defined, and meant three things | "How your Bitcoin becomes prime", with the two tiers: a deposit lends (building the bank), making it prime earns more |
| BTC vs primeBTC was never addressed | First question in the FAQ: primeBTC is the claim — not a sale, not a swap |
| Bitcoin / aBTC / primeBTC appeared with no key | Named once, in order, at step 01 |
| Step 03 said "lend it, borrow against it" — ambiguous, and probably wrong | Says which asset each job uses: lend aBTC, borrow aUSD |
| The close read as the end of the page | Moved above the questions, photo capped at two thirds, and carries v5's "Your ticket to the top" |

## To confirm before anything ships

Each of these is flagged in the code beside the line it affects.

1. **Does a deposit lend automatically?** The client's framing is "deposit and you automatically
   start earning via lend for helping build the bank". Nothing in `arch-prime` shows auto-supply on
   deposit — Auto Earn is a managed-strategy product page, not a deposit behaviour. v11's
   "Deposit, and it works" and the Earn card both rest on this. If it is not live, both soften to
   "put it to work lending".
2. **80% / 90%** come from `docs/prime-page-brief.md`, not from the protocol. Max LTV and
   liquidation LTV are per-pair terms read from chain, so the page scopes them to a dollar loan
   against Bitcoin.
3. **The penthouse photograph** centres the Empire State Building, whose image is trademarked for
   commercial use.
4. **"$2T+" is off the page.** Bitcoin is ~$1.73T as of 22 Sep 2026, so the figure is false; the
   brief still carries it.
5. **The brief also still prescribes stocks and "a prime brokerage account".** Neither is on these
   pages — stocks were ruled out, and "prime brokerage" was replaced by the prime-asset definition.

Every figure that did ship carries its source in a comment in `src/data/prime-v11.ts` — 5 wallets,
Taproot only, 80%/90%, 0.5% slippage. Placeholder values in the app (5.42% APY, TVL, NAV, vault
fees) were checked and rejected as frame data.
