// Sibling-brand hand-off — Arch Prime is the product brand that descends from
// this identity, so the page closes by pointing at it. In dev the two
// portfolios run as separate apps on their own ports; on the site they're
// sibling routes.
import { PillLink } from "@/components/SectionHeader";

const ARCH_PRIME_URL =
  process.env.NODE_ENV === "development" ? "http://localhost:4653" : "https://blueprintstudio.ai/arch-prime";

export default function RelatedBrand() {
  return (
    <section id="arch-prime" className="border-t border-line px-edge py-section">
      <div className="flex items-center justify-between gap-6 max-[600px]:flex-col max-[600px]:items-start max-[600px]:gap-5">
        <div className="flex flex-col gap-2">
          <span className="text-label uppercase text-muted-2">Arch family</span>
          <h2 className="text-title font-medium text-ink max-[860px]:text-title-mobile">Arch Prime</h2>
          <p className="max-w-measure text-body-lg text-body">
            The product brand built on this identity: the same mark and serif, with its own palette of section hues
            and a place system for the app.
          </p>
        </div>
        <PillLink href={ARCH_PRIME_URL} external>
          Open Arch Prime brand page
        </PillLink>
      </div>
    </section>
  );
}
