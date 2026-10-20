// Overview — intro headline + body, same layout as the other brand pages.
// Headline is the brand mission (Nectar Group brand deck, June 2026); the body
// carries the deck's three design principles — clarity, security, autonomy —
// as prose rather than a list. Product claims only restate the landing site.

export default function Overview() {
  return (
    <section id="overview" className="px-edge py-section">
      <div className="flex items-start gap-gutter max-[1360px]:gap-24 max-[860px]:flex-col max-[860px]:gap-10">
        <div className="w-[596px] shrink-0 max-[1360px]:w-[45%] max-[1200px]:w-1/2 max-[860px]:w-full">
          {/* one statement, set the way the deck sets it — balanced, no faded half */}
          <h1 className="text-balance text-headline font-medium text-ink max-[860px]:text-headline-mobile">
            Make growth visible, navigable, and yours to command.
          </h1>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-[1.4em] text-body-lg text-body">
          <p>
            RWY, formerly Double Digit, puts institutional yield strategies in your own wallet, with every position,
            fee and NAV published on-chain. Nothing about it should feel hidden, and nothing should feel out of your
            hands.
          </p>
          <p>
            The identity is built the same way. Strong colour and open space, so it reads from a distance. A steady,
            unhurried voice that says the safeguards were there before anyone needed them. And open water throughout:
            wide horizons, forward motion, and a course that is yours to steer.
          </p>
        </div>
      </div>
    </section>
  );
}
