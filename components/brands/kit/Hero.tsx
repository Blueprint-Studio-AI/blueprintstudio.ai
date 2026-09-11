"use client";

// Hero (Figma 305:1245) — full-bleed brand banner.
//
// The art is a 16:9 source rendered 11% taller than the frame and nudged up, so
// it crops from below centre — that's the Figma's framing, not a plain cover.
// The dark gradient across the top belongs to the hero, not the nav: it's what
// carries the nav's white text while the nav has no surface of its own up here.
//
// The hero is pinned (sticky) while the rest of the page scrolls over it as an
// opaque sheet — see BrandKitPage. Sticky is the strongest parallax there is:
// the background moves 0 while the foreground moves 1, and it costs no JS.
// Above 860px only: on phones iOS 26 Safari tinted its toolbar with the pinned
// hero's colour over every section, so there the hero scrolls normally.
import { Fragment, useEffect, useRef } from "react";
import Image, { getImageProps } from "next/image";
import { useBrand } from "@/components/brands/kit/BrandContext";

const DARK_SCRIM =
  "linear-gradient(to bottom, rgba(0,0,0,0.82) 0%, rgba(23,23,23,0.63) 15.129%, rgba(102,102,102,0) 50%)";

// The art is cover-scaled into a 730px-tall frame, so on most screens (every
// phone) it's drawn far wider than the viewport: "100vw" under-asked and came
// out soft. Every hero source is ≤ 2646px wide, so ask for the largest variant;
// the optimizer caps it at the source width. Same sharpness as the original
// file, as a WebP a fraction of the size.
const HERO_SIZES = "3840px";

/**
 * Band art fades out toward its top edge. Figma models this as a near-white veil
 * over the art (transparent at the art's foot, opaque by 98% up); a mask is the
 * same result without hard-coding a veil colour that has to match the field.
 */
const MASK = "linear-gradient(to top, #000 0%, #000 25%, transparent 97%)";

/** "A · B · C · D" → ["A · B", "C · D"]: the tagline's phone lines. */
const pairs = (tagline: string) => {
  const items = tagline.split(" · ");
  return Array.from({ length: Math.ceil(items.length / 2) }, (_, i) => items.slice(i * 2, i * 2 + 2).join(" · "));
};

export default function Hero() {
  const { hero, name, brandInk } = useBrand();
  // `overlay` defaults to the dark scrim; pass null for a light hero.
  const overlay = hero.overlay === undefined ? DARK_SCRIM : hero.overlay;
  const band = hero.art === "band";
  const preview = getImageProps({ src: hero.image, alt: "", width: 64, height: 36, quality: 75 }).props.src;
  const section = useRef<HTMLElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  // Recede the lockup as the sheet closes over it. Without this the two planes
  // read as one — the lockup sits flat against the incoming edge and the whole
  // thing looks like the hero is simply scrolling away. Fading and lifting it
  // puts the hero *behind* the page rather than above it.
  useEffect(() => {
    const el = inner.current;
    const host = section.current;
    if (!el || !host) return;
    // Honour the OS setting: pinning is fine, but the depth cue is motion.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const apply = () => {
      raf = 0;
      // While pinned, the sheet's edge descends from the hero's full height to 0
      // as you scroll, so it reaches the centred lockup around the halfway mark.
      // The fade has to be keyed to *that* window (~28%–66% of the hero) rather
      // than to scroll from zero: starting at zero has the lockup visibly
      // dissolving while it's still in the clear, which reads as a bug, not depth.
      const h = host.offsetHeight || 1;
      const p = Math.min(1, Math.max(0, (window.scrollY - h * 0.28) / (h * 0.38)));
      el.style.opacity = String(1 - p);
      el.style.transform = `translate3d(0, ${(-p * 56).toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    apply(); // set the correct state for a restored scroll position
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      id="top"
      ref={section}
      // sticky, not fixed: it keeps its place in flow, so the sheet below starts
      // exactly where the hero ends and no spacer is needed.
      // Height is per-brand: a viewport-relative hero scales with the window,
      // a fixed one stays a slab. minHeight is the floor that stops a vh value
      // collapsing on a short laptop screen.
      className="sticky top-0 z-0 w-full overflow-hidden motion-reduce:relative max-[860px]:relative"
      style={{
        backgroundColor: hero.background ?? brandInk,
        height: hero.height ?? "730px",
        minHeight: hero.minHeight,
      }}
    >
      {/* The art goes through next/image, not a raw <img>: the source files are
          the downloadable originals (up to 2646px and 800 KB+), and the hero is
          the page's largest paint. next/image serves a WebP sized to the screen
          and `preload` starts it with the HTML, instead of after the page parses.
          It never upscales, so it can't come out softer than the source. The
          wrapper div carries the crop and effects; the image just fills it. */}
      {band ? (
        // Band: the art is a horizon along the bottom that dissolves upward into
        // the flat field, so the lockup sits on colour rather than on artwork.
        // multiply + 66% is what keeps the comb from reading as a photograph
        // pasted on — it tints the field instead of covering it.
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0"
          style={{
            height: hero.artHeight ?? "46%",
            filter: "blur(2.3px)",
            mixBlendMode: "multiply",
            opacity: 0.66,
            maskImage: MASK,
            WebkitMaskImage: MASK,
          }}
        >
          <Image src={hero.image} alt="" fill preload sizes={HERO_SIZES} quality={hero.quality} className="object-cover object-bottom" />
        </div>
      ) : (
        <div aria-hidden className="absolute left-0 top-[-7.82%] h-[111.01%] w-full">
          {/* A 64px copy (~1 KB, same optimizer) blurred behind the photo, so a
              slow connection shows the image's colours and shapes at once
              instead of a flat field while the full one downloads. The photo
              covers it completely once it lands. */}
          <div
            className="absolute inset-0 scale-110 blur-2xl"
            style={{ backgroundImage: `url(${preview})`, backgroundSize: "cover", backgroundPosition: "center" }}
          />
          <Image src={hero.image} alt="" fill preload sizes={HERO_SIZES} quality={hero.quality} className="object-cover" />
        </div>
      )}
      {overlay && <div aria-hidden className="absolute inset-0" style={{ background: overlay }} />}
      {/* Phones: iOS Safari paints the status-bar strip with the body colour,
          which BrandChrome sets to this same field. Fading the hero's top edge
          up from it makes the strip run into the photo with no seam, whatever
          the photo is. (No strip on desktop, so no fade there.) */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 hidden h-24 max-[860px]:block"
        style={{ background: `linear-gradient(${hero.background ?? brandInk}, transparent)` }}
      />
      <div ref={inner} className="relative flex h-full flex-col items-center justify-center gap-8 will-change-[transform,opacity]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={hero.lockup}
          alt={name}
          className="max-w-[78%] max-[860px]:!w-[280px]"
          style={{ width: hero.lockupWidth ?? "373px" }}
        />
        {hero.tagline && (
          <p
            className="max-w-[575px] text-balance px-6 text-center text-title-sm font-light"
            style={{ color: hero.taglineColor ?? "#faf8f3" }}
          >
            {/* "A · B · C · D": one line on desktop. On phones it wrapped wherever
                it ran out of room, so a line could start with a dangling "·".
                There it's two lines of two items each, split at a separator
                that's hidden, so no line starts or ends on a dot. */}
            {pairs(hero.tagline).map((line, i) => (
              <Fragment key={line}>
                {i > 0 && <span className="max-[860px]:hidden"> · </span>}
                <span className="max-[860px]:block">{line}</span>
              </Fragment>
            ))}
          </p>
        )}
      </div>
    </section>
  );
}
