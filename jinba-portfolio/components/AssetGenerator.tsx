// The generator hand-off (Figma 303:1204) — the one place the page points off
// itself.
//
// Still deliberately a recording rather than a working tool: generating here
// would mean a second surface to keep alive (auth, quota, queue, failure states)
// whose bugs land in the pitch, and a prospect who generated something here
// would have no reason to click through. The video shows the real product doing
// the real thing; the only live control on the card is the CTA.
import { ASSET_GEN, type AssetCategory } from "@/lib/data";
import Button from "@/components/ui/Button";

export default function AssetGenerator({ category }: { category: AssetCategory }) {
  // hand the platform the context the visitor already chose
  const href = `${ASSET_GEN}?brand=jinba&category=${category.id}`;

  return (
    <div
      id="asset-generator"
      className="flex scroll-mt-32 items-center justify-center overflow-hidden rounded-3xl bg-chip max-[1024px]:flex-col"
    >
      {/* Copy. On mobile it follows the animation — the motion earns the scroll,
          the words explain it.
          basis-1/2, not flex-1: flex-1 bases off the CONTENT box, so this half's
          128px of padding would be added on top of its share and the two halves
          would come out uneven (629/501). A 50% basis is border-box, which is
          what Figma's auto-layout actually splits. */}
      <div className="flex min-w-0 basis-1/2 items-center p-16 max-[1024px]:order-2 max-[1024px]:w-full max-[1024px]:basis-auto max-[860px]:p-8">
        <div className="flex w-[443px] max-w-full flex-col justify-center gap-16 max-[860px]:gap-10">
          <div className="flex w-full flex-col gap-16 max-[860px]:gap-10">
            {/* Says who's talking. This is the one block on the page that isn't
                the client's voice, so it wears the studio's name rather than
                borrowing the brand's — which is what lets the copy speak
                generally enough for a prospect to see themselves in it. */}
            <div className="flex items-center gap-[18px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/blueprint-studio-nav.png" alt="Blueprint Studio" className="h-[18px] w-auto" />
              <span aria-hidden className="h-[18px] w-[1.5px] shrink-0 bg-[rgba(230,230,230,0.8)]" />
              <span className="whitespace-nowrap text-label uppercase text-muted-1">Asset Generator</span>
            </div>

            <div className="flex w-full flex-col gap-6">
              <h3 className="text-promo font-medium text-ink max-[860px]:text-title">
                <span className="text-faint">Elevate your brand with</span> high quality assets.
              </h3>
              <p className="text-body-lg text-body">
                Every brand we build comes with access to our asset generator, trained on your palette, type, and
                textures.
              </p>
            </div>
          </div>

          <Button variant="solid" size="xl" href={href} external className="!rounded self-start">
            Visit Asset Generator
          </Button>
        </div>
      </div>

      {/* The product, recorded. Square source in a shorter frame, so it crops top
          and bottom rather than letterboxing — same as the Figma. */}
      <div className="flex h-[551px] min-w-0 basis-1/2 items-center overflow-hidden py-[42px] max-[1024px]:order-1 max-[1024px]:h-auto max-[1024px]:w-full max-[1024px]:basis-auto max-[860px]:py-6">
        {/* preload="none": 4.1MB near the bottom of a page most visitors never
            reach. Browsers hold autoplay until the element is near the viewport,
            so the fetch rides that rather than the initial load. A poster frame
            would make the placeholder nicer — needs an ffmpeg export. */}
        <video
          src="/assets/video/jinba-assetgen.mp4"
          preload="none"
          autoPlay
          loop
          muted
          playsInline
          aria-hidden
          className="aspect-square w-full min-w-0 flex-1 object-cover"
        />
      </div>
    </div>
  );
}
