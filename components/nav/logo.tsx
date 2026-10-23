"use client";

import { motion, useMotionValue, useTransform, type MotionValue } from "framer-motion";

// The studio's logo, the fingerprint and "blueprint studio", from the clean
// copies of the real artwork: public/blueprint-logo.svg (the mark) and
// public/blueprint-wordmark-dark.svg. In the bar it's the whole logo; in the
// pill the wordmark folds away into the mark, which stays. `fold` runs from 0,
// open, to 1, folded.

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

const clamp01 = (p: number) => Math.min(1, Math.max(0, p));

/** The logo's width at a given fold. */
export function logoWidth(fold: number) {
    return LOGO.mark + LOGO.word * (1 - clamp01(fold));
}

/** The logo, folded as far as `fold` says (open if there's no `fold`). */
export function FoldingLogo({ fold }: { fold?: MotionValue<number> }) {
    const open = useMotionValue(0);
    const value = fold ?? open;
    // The wordmark's box closes, and the wordmark slides a little towards the
    // mark as it fades, so it tucks in rather than being cut off while still solid.
    const width = useTransform(value, (f) => LOGO.word * (1 - clamp01(f)));
    const opacity = useTransform(value, (f) => 1 - clamp01(f) ** 0.8);
    const x = useTransform(value, (f) => -8 * clamp01(f));
    const filter = useTransform(value, (f) => `blur(${clamp01(f) * 2}px)`);

    return (
        <span aria-hidden className="flex items-center" style={{ height: HEIGHT }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/blueprint-logo.svg" alt="" className="block shrink-0" style={{ width: MARK, height: MARK }} />
            <motion.span className="block shrink-0 overflow-hidden" style={{ width, height: HEIGHT }}>
                <motion.span className="block w-max" style={{ paddingLeft: GAP, opacity, x, filter }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/blueprint-wordmark-dark.svg" alt="" className="block" style={{ width: WORD, height: HEIGHT }} />
                </motion.span>
            </motion.span>
        </span>
    );
}
