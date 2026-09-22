# Arch Prime marketing page: internal review

Internal to Blueprint (Nick and Tyler). A copy of the Arch Network website (`Blueprint-Studio-AI/arch-website`, branch `prime-page` at `64c75f9`) with four versions of the `/prime` page side by side, so we can compare directions before anything goes near the Arch repo. None of this has been pushed to `arch-website`.

## Run it

```bash
cd arch-prime-page
corepack pnpm install
corepack pnpm exec next dev --port 4655
```

Then open http://localhost:4655/prime-v8. A switcher in the bottom-left corner flips between versions (v5 to v8); on v6 to v8 it also has a "Notes" toggle that shows where the page is waiting on a product or legal decision.

## The versions

| Route | What it is |
| --- | --- |
| `/prime` | **v5**, the current page on the `prime-page` branch (the Netlify deploy preview). Unchanged. |
| `/prime-v6` | **v6**, the account-led story from the section map: the hero photo closes into an arch window and opens again onto the view at the end. |
| `/prime-v7` | **v7**, "the ascent": minimal and newcomer-first. A black-and-white skyline of the app's buildings, one moving dot for how it works, vault fact sheets. |
| `/prime-v8` | **v8**, "the lit floor", from Nick's own layout: a lobby directory, then a dark tower you climb floor by floor, operating rebuilt app panels (Lend, Borrow with an 80%/90% loan meter, Trade, Vaults) while "your account" fills with jobs, and the penthouse view opening out of the panel at the top. |

All copy is plain-language and fact-checked against the arch-prime app: the only figures are $2T+, 80% and 90%; nothing is stamped "Live"; no stocks.

## Where things live

- Copy, one file per version: `src/data/prime-v6.ts`, `prime-v7.ts`, `prime-v8.ts`
- Components: `src/components/prime-v6/`, `prime-v7/`, `prime-v8/`
- Pages: `src/app/prime-v6/`, `prime-v7/`, `prime-v8/`
- Images: `public/img/prime/v6/` (masked app screens), `v7/`, `v8/`
- Planning: `docs/review/section-map-v1.md` (the section map, decisions that block design), `docs/review/v8-concepts.md` (the four v8 concepts and the judge's spec; three unbuilt ones are candidates for variants)
- Shared-file edits: `src/components/nav.tsx` (the nav button becomes "Get early access" on v6 to v8; one pre-existing fix: menu text is dark when the menu is open) and `src/app/prime/layout.tsx` (adds the version switcher to v5).

## Open decisions (see the Notes toggle)

What backs aBTC and aUSD and who can release them; whether posted collateral keeps earning; what early access gets you, and whether there's an early-liquidity programme; Margin vs Boost; "manager" vs the app's "Curator"; audit status; legal review of "bank" and the sponsor-funded primeUSD pilot line.
