// Sibling-brand hand-off — Arch Prime descends from Arch Network, so the page
// closes by pointing at the parent identity. In dev the two portfolios run as
// separate apps on their own ports; on the site they're sibling routes.
import { PillLink } from "@/components/SectionHeader";

const ARCH_NETWORK_URL =
  process.env.NODE_ENV === "development" ? "http://localhost:4651" : "https://blueprintstudio.ai/arch";

export default function RelatedBrand() {
  return (
    <section id="arch-network" className="border-t border-line px-edge py-section">
      <div className="flex items-center justify-between gap-6 max-[600px]:flex-col max-[600px]:items-start max-[600px]:gap-5">
        <div className="flex flex-col gap-2">
          <span className="text-label uppercase text-muted-2">Arch family</span>
          <h2 className="text-title font-medium text-ink max-[860px]:text-title-mobile">Arch Network</h2>
          <p className="max-w-measure text-body-lg text-body">
            The main brand this identity descends from: the mark, the serif, and the orange all start there.
          </p>
        </div>
        <PillLink href={ARCH_NETWORK_URL} external>
          Open Arch Network brand page
        </PillLink>
      </div>
    </section>
  );
}
