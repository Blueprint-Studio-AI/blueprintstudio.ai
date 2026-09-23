import { Reveal } from "@/components/chain-reveal";
import { T } from "@/components/prime-ui";
import { V10 } from "@/data/prime-v10";

/* ── §2 `#offers` — what Prime offers ────────────────────────────────────────
   The page's STILL POINT, between the hero and the elevator: the whole package on one screen.
   Nick's call — the offerings must never be obscured one at a time.

   THE CONTRACT. A server component with no state and no scroll reader: the only motion is the
   site's own `Reveal` (chain-reveal.tsx) — the header, then the cards on a 60ms stagger, fade
   plus a 16px lift, once. Under reduced motion they are simply there (globals.css's [data-reveal]
   net). Nothing moves on scrub, ever.

   ONE GRID, NOT TWO LAYOUTS. `--cols` (the card count, written here) drives a single
   `repeat(var(--cols), …)` at lg; below it the grid falls to 2 and then 1 by media query alone
   (prime-v10.css, ".v10-offers-grid"). There is no width-specific markup and no second component.

   THE SLOT UNDER EACH CARD. A card with a `note` (data file) grows a rule at its foot and the
   line under it, pushed down by `margin-top: auto` so the rules line up across the row. With the
   notes empty — as they ship — there is no rule at all: Nick's call, no rule with nothing under it.

   Copy, the card order, and whether the fifth "Boost" card shows all live in
   src/data/prime-v10.ts (V10.offers, `showBoost`). */

export function PrimeOffers() {
  const o = V10.offers;
  const cards = o.showBoost ? [...o.cards, o.boost] : o.cards;

  return (
    <section id="offers" className="v10-offers">
      <div className="site-container">
        <Reveal>
          <p className={`${T.label} v10-offers-eyebrow`}>{o.eyebrow}</p>
          <h2 className={`${T.h2} v10-offers-h2`}>{o.h2}</h2>
        </Reveal>

        <ul className="v10-offers-grid" style={{ "--cols": cards.length } as React.CSSProperties}>
          {cards.map((c, i) => (
            <li key={c.id}>
              <Reveal delay={120 + i * 60} className="v10-offer-cell">
                <article className="v10-offer">
                  <img
                    className="v10-offer-thumb"
                    src={c.img}
                    alt=""
                    width={110}
                    height={110}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="v10-offer-head">
                    <h3 className="v10-offer-title">{c.title}</h3>
                    {c.chip ? <span className="v10-offer-chip">{c.chip}</span> : null}
                  </div>
                  <p className="v10-offer-body">{c.body}</p>
                  {c.note ? (
                    <div className="v10-offer-slot">
                      <p className="v10-offer-note">{c.note}</p>
                    </div>
                  ) : null}
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
