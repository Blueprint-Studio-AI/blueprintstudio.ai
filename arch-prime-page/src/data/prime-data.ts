import { EXTERNAL } from "@/lib/site";

// What the Prime page is allowed to claim, in one place.
//
// Nothing here is a live reading. The app's own figures are frame fixtures
// (arch-prime apps/web/features/earn/data/earn.ts) and its analytics and indexer base URLs are
// unset outside a deployment, so every rate and total in the product renders as "[ --- ]".
// So the page states the market and the protocol's own parameters, and never a number that
// implies traction.
// ponytail: when analytics is connected, the numbers strip becomes live TVL and APY; that is
// the only place on the page that should carry one.

export const MARKET = {
  // The figure the Arch home page already uses for Bitcoin capital.
  value: 2,
  prefix: "$",
  suffix: "T+",
  eyebrow: "The opportunity",
  caption: "of Bitcoin, mostly sitting idle.",
  body: "A prime account is how it goes to work: earning, borrowing, trading, and standing as margin — without ever leaving Bitcoin.",
} as const;

// Protocol parameters, not readings: these are set by the market, not by how much is in it.
export const LENDING = { maxLtv: 80 } as const;

// One primary action across the page while access is limited. The day deposits open to
// everyone, this becomes "Deposit" in one place and the whole page follows.
export const CTA = { primary: "Get early access", app: "Launch Prime" } as const;

// Point the page's app links at a locally running arch-prime by putting
// NEXT_PUBLIC_PRIME_APP=http://localhost:4322 in .env.local (gitignored), which makes every
// screenshot and CTA open the real screen it shows. With nothing set — production today —
// they fall back to the Arch Prime account, since the app has no public URL yet.
const APP = process.env.NEXT_PUBLIC_PRIME_APP ?? "";
export function primeApp(path = ""): string {
  return APP === "" ? EXTERNAL.prime : `${APP}${path}`;
}
