"use client";

import { useRef } from "react";
import { animate, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useTransform, type MotionValue } from "framer-motion";

// The studio's logo, the fingerprint and "blueprint studio", from the clean
// copies of the real artwork: public/blueprint-logo.svg (the mark) and
// public/blueprint-wordmark-dark.svg. In the bar it's the whole logo; in the
// pill the wordmark folds away into the mark, which stays. `fold` runs from 0,
// open, to 1, folded, and the nav drives it from the same spring as its shape.

// In the original 173 x 23 artwork (public/blueprint-logo-dark.png) the mark
// spans x 0.39 to 22.72, the full height from above the b to the foot of the p,
// and the wordmark's file starts at x 29.5 and is 142 wide, at the same height;
// so these proportions are the lockup's own. At 18px tall the mark holds its
// own beside the links, and the wordmark's x-height (8.7px) is a touch above
// theirs (7.6px).
const HEIGHT = 18;
const UNIT = HEIGHT / 23;
const MARK = 22.3248 * UNIT;
const GAP = (29.5 - 22.7193) * UNIT;
const WORD = 142 * UNIT;

/** The logo's widths: the mark, and the wordmark with the gap before it. */
export const LOGO = { mark: MARK, word: GAP + WORD };

// The wordmark's box ends in a short soft edge rather than a hard one, kept
// in spare room past the word, so it only ever shows on letters while the
// word is fading.
const FEATHER = 18;
const BLEED = 4; // room above and below for the blur
// The word appears once its box is this far open, and starts to go the moment it closes.
const SHOW_AT = 0.86;
const EASE_OUT = [0.23, 1, 0.32, 1] as const;

const clamp01 = (p: number) => Math.min(1, Math.max(0, p));

/** The logo's width at a given fold. */
export function logoWidth(fold: number) {
    return LOGO.mark + LOGO.word * (1 - clamp01(fold));
}

/**
 * The logo, folded as far as `fold` says (open if there's no `fold`). The box
 * follows `fold` exactly; the word inside never gets cut by it. Opening, the
 * box makes room first and the word fades in whole; closing, the word fades
 * out quickly first and the box closes after it.
 */
export function FoldingLogo({ fold }: { fold?: MotionValue<number> }) {
    const reduce = useReducedMotion();
    const still = useMotionValue(0);
    const value = fold ?? still;

    const shown = useRef(clamp01(value.get()) < 1 - SHOW_AT);
    const word = useMotionValue(shown.current ? 1 : 0); // 0 hidden to 1 shown
    const last = useRef(value.get());
    useMotionValueEvent(value, "change", (f) => {
        const prev = last.current;
        last.current = f;
        const open = 1 - clamp01(f);
        // A spring settling around fully open moves the fold a hair either way: that isn't closing.
        if (shown.current && f > prev && f > 0.03) {
            shown.current = false;
            animate(word, 0, { duration: 0.12, ease: EASE_OUT });
        } else if (!shown.current && f < prev && open >= SHOW_AT) {
            shown.current = true;
            animate(word, 1, { duration: reduce ? 0.2 : 0.28, ease: EASE_OUT });
        }
    });

    const width = useTransform(value, (f) => LOGO.word * (1 - clamp01(f)) + FEATHER);
    const opacity = word;
    const x = useTransform(word, (w) => (reduce ? 0 : (1 - w) * -5));
    const filter = useTransform(word, (w) => (reduce ? "none" : `blur(${(1 - w) * 3}px)`));
    const mask = `linear-gradient(to right, #000 calc(100% - ${FEATHER}px), transparent)`;

    return (
        <span aria-hidden className="flex items-center" style={{ height: HEIGHT }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/blueprint-logo.svg" alt="" className="block shrink-0" style={{ width: MARK, height: MARK }} />
            <motion.span
                className="block shrink-0"
                style={{
                    width,
                    height: HEIGHT + 2 * BLEED,
                    margin: `-${BLEED}px -${FEATHER}px -${BLEED}px 0`,
                    padding: `${BLEED}px 0`,
                    WebkitMaskImage: mask,
                    maskImage: mask,
                    WebkitMaskRepeat: "no-repeat",
                    maskRepeat: "no-repeat",
                }}
            >
                <motion.span className="block w-max" style={{ paddingLeft: GAP, opacity, x, filter }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/blueprint-wordmark-dark.svg" alt="" className="block" style={{ width: WORD, height: HEIGHT }} />
                </motion.span>
            </motion.span>
        </span>
    );
}
