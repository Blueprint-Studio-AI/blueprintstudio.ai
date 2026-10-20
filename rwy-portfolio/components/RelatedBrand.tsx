// Sibling-brand hand-off — RWY and HoneyB are both Nectar Group brands, and
// HoneyB is the platform behind RWY, so the page closes by pointing at it.
// HoneyB's brand kit is live on the studio site.
import { PillLink } from "@/components/SectionHeader";

const HONEYB_URL = "https://blueprintstudio.ai/brands/honeyb";

export default function RelatedBrand() {
  return (
    <section id="honeyb" className="border-t border-line px-edge py-section">
      <div className="flex items-center justify-between gap-6 max-[600px]:flex-col max-[600px]:items-start max-[600px]:gap-5">
        <div className="flex flex-col gap-2">
          <span className="text-label uppercase text-muted-2">Nectar Group</span>
          <h2 className="text-title font-medium text-ink max-[860px]:text-title-mobile">HoneyB</h2>
          <p className="max-w-measure text-body-lg text-body">
            RWY&apos;s sibling brand and the platform behind it, bringing the same institutional strategies to
            long-term Bitcoin holders.
          </p>
        </div>
        <PillLink href={HONEYB_URL} external>
          Open HoneyB brand page
        </PillLink>
      </div>
    </section>
  );
}
