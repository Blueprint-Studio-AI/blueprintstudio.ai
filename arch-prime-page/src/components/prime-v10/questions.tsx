import { Faq, type FaqEntry } from "@/components/faq";
import { V10 } from "@/data/prime-v10";

/* ── §5 `#questions` — before you sign up ────────────────────────────────────
   THE OBJECTIONS, IMMEDIATELY BEFORE THE ASK. v9 put its asks first, so the reader was invited
   to sign up before the page said whether they could get their money out. Here the answers come
   first and §6 asks.

   NO BUTTON IN THIS SECTION. The page has exactly one ask besides the hero's and it is the next
   section — a second one here would split it.

   THE LAYOUT IS v8'S SPLIT, unchanged in spirit: the label, the headline and the line under it
   in lg columns 1–4 and STICKY, so they hold while the accordion runs past; the accordion in
   columns 6–12. It reuses `src/components/faq.tsx` exactly as the rest of the site does — the
   same hairline rows, the same plus that rotates — so this section inherits every fix that
   component ever gets. Below lg it is one column and nothing sticks.

   THE GROUND IS #f7f6f6, the page's one flip back to light after the dark stretch of §3 and §4:
   it is what makes the photograph in §6 land. The headline is SANS, with §2, §3 and §4.

   The five questions and their answers are in src/data/prime-v10.ts (V10.questions) — word for
   word the corrected set, with the note there saying what was taken out of them and why. */

const ITEMS: FaqEntry[] = V10.questions.items.map((f) => ({ question: f.q, answer: <p>{f.a}</p> }));

export function PrimeQuestions() {
  const q = V10.questions;

  return (
    <section id="questions" className="v10-questions">
      <div className="site-container v10-q-grid">
        <div className="v10-q-head">
          <p className="v10-q-eyebrow">{q.eyebrow}</p>
          <h2 className="v10-q-h2">{q.h2}</h2>
          <p className="v10-q-sub">{q.sub}</p>
        </div>
        <div className="v10-q-list">
          <Faq items={ITEMS} />
        </div>
      </div>
    </section>
  );
}
