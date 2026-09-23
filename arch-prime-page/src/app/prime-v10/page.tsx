import { PrimeHero } from "@/components/prime-v10/hero";
import { PrimeHow } from "@/components/prime-v10/how";
import { PrimeOffers } from "@/components/prime-v10/offers";
import { PrimeQuestions } from "@/components/prime-v10/questions";
import { PrimeView } from "@/components/prime-v10/view";

// Prime page v10 (local prototype), section by section — a building, told in order:
//   §1 The hero   the street: the photograph closes into a coin, flips to Bitcoin, pulls back to
//                 a field of coins that sits still, lights, and forms the primeBTC token (hero.tsx)
//   §2 #offers    the directory: all four offerings together on one screen, one Reveal and
//                 nothing else moving (offers.tsx)
//   §3 #how       the elevator: one account, four steps, the stage pinned on a big screen and
//                 the 01–04 dots the control everywhere else (how.tsx)
//   §4 #questions the objections, answered immediately BEFORE the ask (questions.tsx)
//   §5 #view      the view from the top: the photograph, then the page's one ask (view.tsx)
//
// THE ORDER IS THE POINT. v9's fault was three endings; here the future state runs first, the
// questions answer the objections, and the ask is the last thing before the footer — so the
// photograph is the page's last image, mirroring the hero's look up.
// ONE ASK BESIDES THE HERO'S: §5's, and nowhere else. §4 deliberately carries no button.

export default function PrimeV10() {
  return (
    <>
      <PrimeHero />
      <main>
        <PrimeOffers />
        <PrimeHow />
        <PrimeQuestions />
        <PrimeView />
      </main>
    </>
  );
}
