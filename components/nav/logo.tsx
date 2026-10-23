"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useTransform, type MotionValue } from "framer-motion";

// Three ways to set the logo in the nav, all from the studio's own artwork, to
// compare with ?logo=1, 2 or 3. public/brand/mark.svg and wordmark.svg are the
// fingerprint and the wordmark from assets/blueprint-logo-white.svg, split
// apart so each can be set in one colour.
//   1: the mark and the wordmark, both in ink.
//   2: the gradient fingerprint (blueprint-logo.svg) with the name in the site's font.
//   3: as 1 in the bar; the wordmark folds away into the pill, leaving the mark.

export type LogoLook = 1 | 2 | 3;

export function useLogoLook(): LogoLook {
    const [look, setLook] = useState<LogoLook>(1);
    useEffect(() => {
        const value = Number(new URLSearchParams(window.location.search).get("logo"));
        if (value === 2 || value === 3) setLook(value);
    }, []);
    return look;
}

// One colour, whatever the text colour is: the artwork is used as a mask.
const masked = (src: string) => ({
    WebkitMaskImage: `url(${src})`,
    maskImage: `url(${src})`,
    WebkitMaskSize: "100% 100%",
    maskSize: "100% 100%",
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    backgroundColor: "currentColor",
});

const MARK = 20; // px, the fingerprint
const WORD_H = 19; // px, the wordmark's box (its viewBox is 115 x 19)
const WORD_W = Math.round((WORD_H * 115) / 19);
const WORD_GAP = 7;

export function Mark({ look, size = MARK }: { look: LogoLook; size?: number }) {
    if (look === 2) return <Image src="/blueprint-logo.svg" alt="" width={size} height={size} priority className="shrink-0" style={{ width: size, height: size }} />;
    return <span aria-hidden className="block shrink-0" style={{ width: size, height: size, ...masked("/brand/mark.svg") }} />;
}

/**
 * The logo for the nav. `fold` (0 to 1) folds look 3's wordmark away as the
 * bar becomes the pill. `wide` is false where there's only room for the mark
 * (the bar between md and lg).
 */
export function BrandLogo({ look, fold, wide = true }: { look: LogoLook; fold?: MotionValue<number>; wide?: boolean }) {
    return (
        <span className="flex items-center text-[#1C1C1E]">
            <Mark look={look} size={look === 2 ? 22 : MARK} />
            {wide &&
                (look === 2 ? (
                    <span className="ml-2 whitespace-nowrap text-[15px] font-semibold leading-none tracking-[-0.02em]">Blueprint Studio</span>
                ) : look === 3 && fold ? (
                    <FoldingWordmark fold={fold} />
                ) : (
                    <span aria-hidden className="block shrink-0" style={{ marginLeft: WORD_GAP, width: WORD_W, height: WORD_H, ...masked("/brand/wordmark.svg") }} />
                ))}
        </span>
    );
}

function FoldingWordmark({ fold }: { fold: MotionValue<number> }) {
    const width = useTransform(fold, [0, 1], [WORD_W + WORD_GAP, 0]);
    const opacity = useTransform(fold, [0, 0.6], [1, 0]);
    const filter = useTransform(fold, [0, 0.6], ["blur(0px)", "blur(3px)"]);
    return (
        <motion.span className="block shrink-0 overflow-hidden" style={{ width, opacity, filter }}>
            <span aria-hidden className="block" style={{ marginLeft: WORD_GAP, width: WORD_W, height: WORD_H, ...masked("/brand/wordmark.svg") }} />
        </motion.span>
    );
}

/** The logo's widths in the bar and in the pill. Look 2 sets its name in type, so it's measured. */
export function logoWidths(look: LogoLook, wide: boolean, measured: number) {
    if (look === 2) return { bar: measured, pill: measured };
    const full = wide ? MARK + WORD_GAP + WORD_W : MARK;
    return { bar: full, pill: look === 3 ? MARK : full };
}
