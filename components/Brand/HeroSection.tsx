"use client";

import { motion, useReducedMotion } from "framer-motion";
import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import GradientButton from "@/components/ui/GradientButton";
import GradientText from "@/components/ui/GradientText";
import SocialProof from "@/components/ui/SocialProof";
import HeroCardCarousel from "./HeroCardCarousel";

export default function HeroSection() {
  // No z-index on the section: the DepthSection's thumbprints rise up behind
  // the card row (above this section's background, below the carousel itself).
  const reduce = useReducedMotion();
  // Staggered blur-in (home-splash recipe). Reduced motion → plain fade, no
  // blur/translate, minimal stagger.
  const intro = (delay: number) =>
    reduce
      ? {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.4, ease: "easeOut" as const, delay: delay * 0.4 },
        }
      : {
          initial: { opacity: 0, y: 24, filter: "blur(10px)" },
          animate: { opacity: 1, y: 0, filter: "blur(0px)" },
          transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const, delay },
        };
  return (
    <Section className="relative bg-[#FAFAFA] overflow-hidden min-h-fit">
      {/* Top nav — shared SectionHeader strip, matching /launch & /launch-videos:
          construction labels flanking the centred logo + a dashed divider beneath.
          Wrapped in motion so it blur-drops in first, then the hero builds below. */}
      <motion.div
        className="w-full"
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: -10, filter: "blur(6px)" }}
        animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={reduce ? { duration: 0.4 } : { duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <SectionHeader
          divider={false}
          leftText="BRAND IDENTITY"
          centerContent={
            <Link href="/" className="hover:opacity-70 transition-opacity">
              <Image
                src="/blueprint-logo-dark.svg"
                alt="Blueprint Studio"
                width={80}
                height={20}
                className="h-3 sm:h-4 w-auto"
                priority
              />
            </Link>
          }
          rightText="// in three weeks"
        />
      </motion.div>

      <OuterContainer className="flex-1 flex items-center">
        <InnerContainer className="pt-16 sm:pt-24 lg:pt-28 pb-12 sm:pb-16 px-2.5 sm:px-6 relative">
          <div className="flex flex-col items-center text-center gap-6 max-w-2xl mx-auto">
            <h1 className="font-medium text-black cursor-default text-[clamp(32px,8vw,60px)] leading-[118%] tracking-[-2.5px]">
              {/* Line 1 animates as one unit — splitting it would shatter the
                  continuous lavender highlight box + the gradient sweep. */}
              <motion.span className="block" {...intro(0)}>
                <span className="box-decoration-clone rounded-lg bg-[#DCE7FF] px-2 sm:px-3">
                  <GradientText>Elevate your brand</GradientText>
                </span>
              </motion.span>
              {/* Line 2 cascades in per word. */}
              <span className="block">
                {["in", "three", "weeks."].map((word, i) => (
                  <motion.span
                    key={word}
                    className="inline-block"
                    style={{ marginRight: i < 2 ? "0.25em" : undefined }}
                    {...intro(0.18 + i * 0.06)}
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
            </h1>

            <motion.div {...intro(0.42)}>
              <SocialProof showDivider>
                <span className="font-medium text-neutral-900">25+</span> startups launched
              </SocialProof>
            </motion.div>

            {/* Book a call — the press thumbprint sits behind the button and
                blurs in a beat AFTER the button lands. It animates opacity+blur
                only (no transform) so its -translate centering survives. */}
            <div className="relative mt-2 flex justify-center">
              <motion.div
                className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-auto w-28 -translate-x-1/2 -translate-y-1/2 select-none sm:w-32"
                initial={reduce ? { opacity: 0 } : { opacity: 0, filter: "blur(8px)" }}
                animate={reduce ? { opacity: 1 } : { opacity: 1, filter: "blur(0px)" }}
                transition={
                  reduce
                    ? { duration: 0.4, delay: 0.6 }
                    : { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 1.0 }
                }
              >
                <Image
                  src="/media/hero/press-thumbprint.png"
                  alt=""
                  aria-hidden
                  width={167}
                  height={184}
                  className="h-auto w-full select-none"
                  draggable={false}
                />
              </motion.div>
              <motion.div className="relative z-10" {...intro(0.54)}>
                <GradientButton
                  // Figma "Book a call" spec: 52px tall, 12px radius, 16px text,
                  // 86px side padding (→ ~271px wide), 12px gap to the arrow.
                  style={{
                    height: 52,
                    paddingLeft: 86,
                    paddingRight: 86,
                    borderRadius: 12,
                    fontSize: 16,
                  }}
                  onClick={() =>
                    window.open("https://cal.com/blueprint-studio/intro-call", "_blank")
                  }
                >
                  Book a call
                  <ArrowUpRight className="w-4 h-4 ml-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </GradientButton>
              </motion.div>
            </div>
          </div>

          {/* Swipeable brand-card catalog (full-bleed). z-30 keeps the cards above
              the thumbprint tips rising up from the section below. */}
          <div className="relative z-30 mt-12 sm:mt-16">
            <HeroCardCarousel />
          </div>
        </InnerContainer>
      </OuterContainer>
    </Section>
  );
}
