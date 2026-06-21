"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useMotionValueEvent, useReducedMotion, useInView } from "framer-motion";
import { ChevronDown } from "lucide-react";

// Sea-floor color — this section is where the page "reaches the bottom of the
// ocean": the same thumbprint descent as the process section, but instead of
// resurfacing to white, it settles onto this dark floor.
const ABYSS = "#161616";

// The three "why a brand matters" steps. Shown one at a time on the pinned
// floor; the blue rule on the right fills as a per-step progress bar.
const STEPS = [
  {
    n: "01",
    bar: "#81C3F6",
    heading: "Your brand is your first hire.",
    body: (
      <>
        Your brand shows up before you do, and keeps working even when you
        can&apos;t. It&apos;s what{" "}
        <span className="text-white">attracts the right clients</span> and repels
        the wrong ones. Most founders treat it like a logo, the ones who succeed
        treat it like infrastructure.
      </>
    ),
    stat: "32%",
    caption: (
      <>
        more revenue for{" "}
        <span className="font-medium text-white">design-led</span> companies
      </>
    ),
    source: "McKinsey Design Index, 300 companies over 5 years",
  },
  {
    n: "02",
    bar: "#77A3F4",
    heading: "It should feel like you, just more so.",
    body: (
      <>
        The best brands don&apos;t invent a personality. They amplify the one
        that&apos;s already there, communicating your value in a way nothing else
        can.
      </>
    ),
    stat: "3x",
    caption: (
      <>
        <span className="font-medium text-white">sales volume</span> for strong
        vs. weak brand
      </>
    ),
    source: "McKinsey Design Index, 300 companies over 5 years",
  },
  {
    n: "03",
    bar: "#8D92EF",
    heading: "Consistency compounds.",
    body: (
      <>
        Every touchpoint that looks and feels like you builds trust. Every one
        that doesn&apos;t erodes it. The gap between a brand that works and one
        that just exists is discipline.
      </>
    ),
    stat: "68%",
    caption: (
      <>
        of business report{" "}
        <span className="font-medium text-white">10% in revenue growth</span> from
        brand consistency
      </>
    ),
    source: "Lucidpress Brand Consistency Report",
  },
];

// One headline line revealed letter-by-letter: each glyph blur-fades in on a
// quick stagger once `on` flips true. The whole string is exposed to screen
// readers via aria-label; the per-letter spans are aria-hidden. Letters stay
// display:inline (opacity + filter only) so the line still wraps word-by-word.
function BlurLine({
  text,
  on,
  reduce,
  stagger = 0.022,
  dur = 0.4,
}: {
  text: string;
  on: boolean;
  reduce: boolean;
  stagger?: number;
  dur?: number;
}) {
  if (reduce) {
    return (
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: on ? 1 : 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {text}
      </motion.span>
    );
  }
  return (
    <motion.span
      aria-label={text}
      initial="hidden"
      animate={on ? "visible" : "hidden"}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: stagger } } }}
    >
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden
          variants={{
            hidden: { opacity: 0, filter: "blur(8px)" },
            visible: {
              opacity: 1,
              filter: "blur(0px)",
              transition: { duration: dur, ease: [0.16, 1, 0.3, 1] },
            },
          }}
        >
          {ch}
        </motion.span>
      ))}
    </motion.span>
  );
}

export default function DepthSection() {
  // Scroll-driven reveal (Apple MacBook-Pro style): the copy stage pins to the
  // viewport while the user scrolls through the tall track below; progress 0→1
  // through that track sequences the three pieces of copy.
  const trackRef = useRef<HTMLDivElement>(null);
  // Progress 0 = the stage just pinned, i.e. the descent has fully scrolled out
  // and the screen is entirely dark. Everything is timed from that moment.
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });
  // One continuous depth gradient spans the whole dark section; this section-
  // wide scroll progress drives its slow parallax drift.
  const darkRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: darkP } = useScroll({
    target: darkRef,
    offset: ["start start", "end end"],
  });

  const reduce = useReducedMotion();
  // Line 1 fires the moment the headline scrolls into view (NOT gated on the pin),
  // so the first words are already arriving as the screen goes dark — there's no
  // stretch of empty black before any text appears.
  const headlineRef = useRef<HTMLDivElement>(null);
  const line1On = useInView(headlineRef, { once: true, margin: "0px 0px -20% 0px" });
  // Line 2 arrives only deep into the pinned track, so the two reveals never
  // overlap: line 1 in → long readable hold → line 2 in → hold.
  const [line2On, setLine2On] = useState(false);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (v >= 0.45 && !line2On) setLine2On(true);
  });
  // Line 1 holds fully white/readable, then settles to a dim gray as line 2 arrives.
  const line1Dim = useTransform(scrollYProgress, [0.45, 0.6], [1, 0.4]);
  // The whole block gently expands as the story unfolds.
  const blockScale = useTransform(scrollYProgress, [0, 1], [0.96, 1.02]);
  // Scroll hint at the entry of the dark reveal — a brief "keep going" nudge
  // that fades once the user starts moving through the story.
  const scrollHint = useTransform(scrollYProgress, [0.03, 0.09, 0.22, 0.3], [0, 1, 1, 0]);

  // ── Three-step sequence ──
  // Each step owns one third of the steps track. Within its third, the blue
  // rule fills 0→100% (a progress bar toward the next step); the steps crossfade
  // so only one is visible at a time, each centered in the viewport.
  const stepsRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: stepsP } = useScroll({
    target: stepsRef,
    offset: ["start start", "end end"],
  });
  const F = 1 / 3;
  // Per-step rule fill (scaleX, anchored left) over that step's third.
  const fill0 = useTransform(stepsP, [0, F], [0, 1]);
  const fill1 = useTransform(stepsP, [F, 2 * F], [0, 1]);
  const fill2 = useTransform(stepsP, [2 * F, 1], [0, 1]);
  // Per-step opacity — quick crossfade right at the thirds.
  const op0 = useTransform(stepsP, [0, 0.28, 0.33], [1, 1, 0]);
  const op1 = useTransform(stepsP, [0.33, 0.38, 0.62, 0.66], [0, 1, 1, 0]);
  const op2 = useTransform(stepsP, [0.66, 0.71, 1], [0, 1, 1]);
  // No vertical drift between steps — each sits in the exact same spot and only
  // crossfades, so nothing appears to "push down" as the next step arrives.
  const fills = [fill0, fill1, fill2];
  const ops = [op0, op1, op2];

  // ── "Going deeper" background ──
  // One continuous depth gradient behind the WHOLE dark section: the headline
  // shows the dark top, and the blue abyss-glow rises as you descend through the
  // steps. background-position 0%→100% over the whole section drifts slowly —
  // a parallax behind the pinned content.
  const bgPosY = useTransform(darkP, [0, 1], ["0%", "100%"]);

  return (
    <section className="relative z-10 w-full">
      {/* ── The descent: identical assets/treatment to the process section's
            thumbprint transition (blue gradient + multiplied prints), landing
            on the dark elliptical sea floor. ── */}
      {/* Pulled up under the hero so the print tips peek out from behind the
          card row — a signifier that there's more below. The hero's carousel
          sits at z-30, above these prints; the hero background sits below. */}
      <div className="relative -mt-28 w-full overflow-visible bg-[#FAFAFA] sm:-mt-48">
        <div className="relative w-full overflow-visible" style={{ aspectRatio: "1440 / 560" }}>
          {/* Blue gradient BEHIND thumbprints — raised so the fully-saturated band
              stays visible above the dark floor instead of hiding beneath it */}
          <div
            className="absolute bottom-0 left-0 right-0 z-0"
            style={{
              height: "60%",
              background:
                "linear-gradient(to bottom, rgba(51,166,247,0) 0%, rgba(51,166,247,0.14) 8%, rgba(51,166,247,0.35) 20%, rgba(51,166,247,1) 38%, rgba(20,114,246,1) 55%, rgba(68,77,235,1) 75%, rgba(68,77,235,1) 100%)",
            }}
          />

          {/* Thumbprint image — extends above the container so prints fade in gradually */}
          <div
            className="absolute left-0 right-0 bottom-0 select-none pointer-events-none z-[1]"
            style={{
              height: "130%",
              mixBlendMode: "multiply",
              opacity: 0.85,
              maskImage:
                "linear-gradient(to bottom, transparent 0%, black 55%, black 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, black 55%, black 100%)",
            }}
          >
            <Image
              src="/images/thumbprints.webp"
              alt=""
              fill
              className="object-cover object-bottom"
              draggable={false}
              sizes="100vw"
              quality={100}
              unoptimized
            />
          </div>

          {/* Dark curved sea floor — an ellipse rising from below the band. Its
              arc draws the curved horizon and its falloff fades along that same
              curve, so the blue sinks into the dark evenly (no SVG blur — that
              left seams and a washed-out veil, especially in Safari). */}
          <div
            className="pointer-events-none absolute inset-0 z-[2]"
            style={{
              background: `radial-gradient(ellipse 150% 75% at 50% 122%, ${ABYSS} 0%, ${ABYSS} 55%, rgba(22,22,22,0.85) 64%, rgba(22,22,22,0.4) 71%, rgba(22,22,22,0) 78%)`,
            }}
          />
          {/* The radial fade can leave a ~1px blue sliver at the very bottom
              edge; this solid band guarantees a clean #161616 hand-off to the
              dark section below. */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-2"
            style={{ backgroundColor: ABYSS }}
          />
        </div>
      </div>

      {/* ── The sea floor: dark content ──
          NOTE: no overflow-hidden here — position:sticky (the pinned copy stage)
          stops working inside an overflow-hidden ancestor. */}
      <div ref={darkRef} className="relative isolate -mt-px w-full" style={{ backgroundColor: ABYSS }}>
        {/* One continuous depth gradient behind the whole dark section. Sticky so
            it stays put while the headline + steps pin and reveal over it; its
            background-position drifts slowly (parallax) via bgPosY. */}
        <div className="pointer-events-none sticky top-0 z-0 h-screen w-full overflow-hidden">
          <motion.div
            aria-hidden
            className="absolute inset-0"
            style={{
              backgroundImage: "url(/media/depth-bg.webp)",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPositionX: "50%",
              backgroundPositionY: bgPosY,
            }}
          />
        </div>

        {/* Top fade — the gradient dissolves into the flat sea-floor dark at the
            section's top edge so there's no hard seam where the thumbprint
            descent ends (above the gradient, below the content). */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-[45vh]"
          style={{ background: `linear-gradient(to bottom, ${ABYSS}, transparent)` }}
        />

        {/* Content rides over the sticky gradient (pulled up to overlap it). */}
        <div className="relative z-10 -mt-[100vh]">
        {/* Headline — scroll-driven reveal. The tall track gives the scroll
            distance; the stage inside stays pinned and centered while the copy
            appears piece by piece. */}
        <div ref={trackRef} className="relative h-[160vh]">
          <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
            <motion.div
              ref={headlineRef}
              style={{ scale: blockScale }}
              className="mx-auto max-w-5xl px-6 text-center"
            >
              <h2
                className="font-medium cursor-default"
                style={{
                  fontSize: "clamp(30px, 5.5vw, 58px)",
                  lineHeight: "125%",
                  letterSpacing: "-1px",
                }}
              >
                {/* Outer span: scroll-driven dim (line 1 fades to gray as line 2
                    arrives). Inner: per-letter blur stagger, triggered on scroll. */}
                <motion.span style={{ opacity: line1Dim }} className="block text-white">
                  <BlurLine
                    // nbsp binds "the work." so "work." never widows on its own line (mobile wrap).
                    text={"Your product does the\u00A0work."}
                    on={line1On}
                    reduce={!!reduce}
                    stagger={0.014}
                    dur={0.34}
                  />
                </motion.span>
                <span className="block text-white">
                  <BlurLine
                    text={"Your brand gets you in the\u00A0room"}
                    on={line2On}
                    reduce={!!reduce}
                    stagger={0.014}
                    dur={0.34}
                  />
                </span>
              </h2>
            </motion.div>

            {/* Scroll signifier — a soft "Scroll" + bouncing chevron at the
                bottom of the first dark view, so it's clear the story continues
                on scroll. Fades out as the reveal gets going. */}
            <motion.div
              style={{ opacity: scrollHint }}
              className="pointer-events-none absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2.5"
            >
              <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-500">
                Scroll
              </span>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              >
                <ChevronDown className="h-5 w-5 text-neutral-400" strokeWidth={1.5} />
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Three steps — pinned. One step is centered in the viewport at a
            time; the tall track gives the scroll distance, and each step's blue
            rule fills as a progress bar toward the next. */}
        <div ref={stepsRef} className="relative h-[330vh]">
          <div className="sticky top-0 h-screen overflow-hidden">
            {/* (Depth gradient now lives behind the whole dark section, above.) */}
            {/* mx-auto max-w-1000 + 48px padding ON each step (absolute inset-0
                ignores a parent's padding) so the text aligns with the other
                1000px content sections (AI-gen band, pricing). */}
            <div className="relative z-10 mx-auto h-full w-full max-w-[1000px]">
              {STEPS.map((step, i) => (
                <motion.div
                  key={step.n}
                  style={{ opacity: ops[i] }}
                  className="absolute inset-0 flex items-center px-2.5 sm:px-12"
                >
                  <div className="grid w-full items-center gap-10 sm:grid-cols-[1.5fr_1fr] sm:gap-16 lg:gap-[128px]">
                    {/* Left — number, heading, body */}
                    <div>
                      <span className="font-medium text-neutral-600">{step.n}</span>
                      <h3
                        className="mt-4 font-medium text-white"
                        style={{ fontSize: "clamp(22px, 2.7vw, 28px)", letterSpacing: "-0.6px" }}
                      >
                        {step.heading}
                      </h3>
                      <p
                        className="mt-4 max-w-xl text-neutral-400 text-sm sm:text-base"
                        style={{ lineHeight: "140%" }}
                      >
                        {step.body}
                      </p>
                    </div>

                    {/* Right — progress rule, stat, caption, source.
                        Spacing per Figma: bar→"Up to" 32px, →stat 12px,
                        →caption 16px, →source 8px. */}
                    <div>
                      {/* Progress bar: faint track + per-step coloured fill */}
                      <div className="h-[2px] w-full overflow-hidden rounded-full bg-white/[0.12]">
                        <motion.div
                          className="h-full w-full origin-left rounded-full"
                          style={{ scaleX: fills[i], backgroundColor: step.bar }}
                        />
                      </div>
                      <p className="mt-8 text-sm text-white sm:text-base">Up to</p>
                      <p
                        className="mt-3 font-medium text-white"
                        style={{
                          fontSize: "clamp(64px, 9vw, 112px)",
                          lineHeight: "100%",
                          letterSpacing: "-3px",
                        }}
                      >
                        {step.stat}
                      </p>
                      <p className="mt-4 text-sm text-neutral-400 sm:text-base">
                        {step.caption}
                      </p>
                      <p className="mt-2 text-xs italic text-neutral-600 sm:text-sm">
                        {step.source}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

          {/* Resurface — fade the depth gradient down to the flat sea-floor dark
              so the section ends on solid #161616 (no hard blue→light cut). */}
          <div
            className="h-40 sm:h-56"
            style={{ background: `linear-gradient(to bottom, transparent, ${ABYSS} 85%)` }}
          />
        </div>
      </div>
    </section>
  );
}
