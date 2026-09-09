"use client";

// The generator hand-off (Figma 303:1204) — the one place the page points off
// itself.
//
// Still deliberately a recording rather than a working tool: generating here
// would mean a second surface to keep alive (auth, quota, queue, failure states)
// whose bugs land in the pitch, and a prospect who generated something here
// would have no reason to click through. The video shows the real product doing
// the real thing; the only live controls are the two CTAs (request / learn more).
import { useEffect, useRef, useState } from "react";
import { ASSET_GEN, ASSET_GEN_REQUEST, type AssetCategory } from "@/lib/data";
import Button from "@/components/ui/Button";

export default function AssetGenerator({ category }: { category: AssetCategory }) {
  // learn-more carries the context the visitor already chose
  const learnMore = `${ASSET_GEN}?brand=jinba&category=${category.id}`;

  // Mount the <video> only once the card approaches the viewport. autoplay
  // overrides preload="none" — the browser starts range-fetching the 4.1MB file
  // on page load even with the card far below the fold (verified in the network
  // log). An element that doesn't exist can't be fetched.
  const stage = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = stage.current;
    if (!el || near) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setNear(true);
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [near]);

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
            <div className="flex items-center gap-[14px]">
              {/* color wordmark SVG — the card sits on a light surface */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/blueprint-logo-color.svg" alt="Blueprint Studio" className="h-[18px] w-auto" />
              <span aria-hidden className="h-[18px] w-[1.5px] shrink-0 bg-[rgba(230,230,230,0.8)]" />
              <span className="whitespace-nowrap text-label uppercase text-muted-1">Asset Generator</span>
            </div>

            <div className="flex w-full flex-col gap-6">
              <h3 className="text-promo font-medium text-ink max-[860px]:text-title">
                <span className="text-faint">Elevate your brand with</span>{" "}
                high quality assets.
              </h3>
              <p className="text-body-lg text-body">
                These styles come from a model trained on your palette, type, and textures. Built for the whole team,
                request access to your company account and start generating.
              </p>
            </div>
          </div>

          {/* Two doors, equal halves on desktop; full-width stacked on mobile.
              flex-none on mobile is load-bearing: flex-1 in the column collapses
              each button to its text height (~25px) because flex-basis:0 beats
              the h-[62px]. flex-none restores the natural height, w-full the width. */}
          <div className="flex w-full gap-[23px] max-[860px]:flex-col max-[860px]:gap-3">
            <Button
              variant="solid"
              size="xl"
              href={ASSET_GEN_REQUEST}
              className="!rounded flex-1 max-[860px]:w-full max-[860px]:flex-none"
            >
              Get Access
            </Button>
            <Button
              variant="soft"
              size="xl"
              href={learnMore}
              external
              className="!rounded flex-1 max-[860px]:w-full max-[860px]:flex-none"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* The product, recorded. Square source in a shorter frame, so it crops top
          and bottom rather than letterboxing — same as the Figma. */}
      <div
        ref={stage}
        className="flex h-[551px] min-w-0 basis-1/2 items-center overflow-hidden py-[42px] max-[1024px]:order-1 max-[1024px]:h-auto max-[1024px]:w-full max-[1024px]:basis-auto max-[860px]:py-6"
      >
        {near ? (
          <video
            src="/assets/video/jinba-assetgen.mp4"
            autoPlay
            loop
            muted
            playsInline
            aria-hidden
            className="aspect-square w-full min-w-0 flex-1 object-cover"
          />
        ) : (
          // same footprint as the video, so nothing shifts when it mounts
          <div aria-hidden className="aspect-square w-full min-w-0 flex-1" />
        )}
      </div>
    </div>
  );
}
