import { PrimeButton } from "@/components/prime-ui";
import { StandaloneView } from "@/components/prime-v8/view";
import { V10 } from "@/data/prime-v10";

/* ── §6 `#view` — the view from the top ──────────────────────────────────────
   THE BOOKEND AND THE ONE ASK. The hero looked UP from the street; this looks OUT from the top
   of the building the reader has just climbed, and it is the last thing before the footer — the
   photograph is the page's last image, as v9's three endings taught.

   THE PICTURE IS v8'S, UNCHANGED. `StandaloneView` (src/components/prime-v8/view.tsx) already
   does exactly what this section needs: the penthouse photograph full-bleed, its frame opening
   from a 16px inset to the edges as it rises, `penthouse-mobile.webp` under 600px, and the
   words placed BENEATH it on #172b56. It is imported as it stands — not copied, not forked — so
   this section is only the words inside it.

   NO WORDS ON THE PHOTOGRAPH. Nothing is set over the picture anywhere on this page.

   THE SERIF IS SPENT HERE. §2, §3 and §4 carry sans headlines; the serif belongs to the hero's
   H1, §3's step titles and this close — that is what makes it a bookend rather than a fifth
   section heading.

   THE PROMISE IS PRINTED ONCE, as the note. The body therefore stops at "what you'd bring"; if
   it ever grows the sentence back, the note goes.

   FLAGGED, NOT CHANGED: the photograph centres the Empire State Building, whose image is
   trademarked for commercial use — see the note beside V10.view in src/data/prime-v10.ts. */

export function PrimeView() {
  const v = V10.view;

  return (
    <StandaloneView>
      <div className="v10-view-copy">
        <h2 className="v10-view-h2">{v.h2}</h2>
        <p className="v10-view-body">{v.body}</p>
        <PrimeButton href={v.ctaHref} className="v10-view-cta">
          {v.cta}
        </PrimeButton>
        <p className="v10-view-note">{v.note}</p>
      </div>
    </StandaloneView>
  );
}
