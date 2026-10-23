"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform, type MotionValue } from "framer-motion";

// The nav's logo, two ways to compare with ?logo=1 or 2. Both are open in the
// bar and fold up in the pill, on one value: `fold`, 0 open to 1 folded.
//   1: the name as live text in the site's font, BLUEPRINT STUDIO, folding to
//      BPSTU, the studio's short name: B(LUE)P(RINT )STU(DIO). The letters
//      between fold away one run after another, and the gap between the words
//      closes with them.
//   2: the fingerprint and the wordmark, the studio's own vector artwork in one
//      ink colour, folding to the fingerprint. public/brand holds the two, split
//      from assets/blueprint-logo-white.svg.
// Both stay sharp at any size: text, or vector paths. (blueprint-logo-dark.svg
// and the other logo SVGs in public/ wrap a PNG, which is why they blur.)

export type LogoLook = 1 | 2;

export function useLogoLook(): LogoLook {
    const [look, setLook] = useState<LogoLook>(1);
    useEffect(() => {
        if (new URLSearchParams(window.location.search).get("logo") === "2") setLook(2);
    }, []);
    return look;
}

/** The kept letters and the runs that fold between them, as measured. */
export type LogoGeometry = { kept: number; runs: number[] };

const STAGGER = 0.12; // each run starts folding this much later than the one before

/** Where in the fold (0 to 1) each run folds: one after another, overlapping. */
function windows(count: number) {
    const span = 1 - (count - 1) * STAGGER;
    return Array.from({ length: count }, (_, i) => [i * STAGGER, i * STAGGER + span] as const);
}
const progress = (fold: number, [start, end]: readonly [number, number]) => Math.min(1, Math.max(0, (fold - start) / (end - start)));

/** The logo's width at a given fold. */
export function logoWidth(geometry: LogoGeometry, fold: number) {
    const spans = windows(geometry.runs.length);
    return geometry.kept + geometry.runs.reduce((sum, width, i) => sum + width * (1 - progress(fold, spans[i])), 0);
}

const NAME = [
    { text: "B", keep: true },
    { text: "LUE", keep: false },
    { text: "P", keep: true },
    { text: "RINT ", keep: false },
    { text: "STU", keep: true },
    { text: "DIO", keep: false },
];

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
const MARK = 20;
const WORD_H = 19; // the wordmark's viewBox is 115 x 19
const WORD_W = Math.round((WORD_H * 115) / 19);
const WORD_GAP = 7;

/** A run of letters (or the wordmark) that folds to nothing, clipped as its width closes. */
function Run({
    fold,
    span,
    width,
    children,
    measure,
}: {
    fold: MotionValue<number>;
    span: readonly [number, number];
    width: number | undefined;
    children: React.ReactNode;
    measure: (el: HTMLSpanElement | null) => void;
}) {
    const w = useTransform(fold, (f) => (width === undefined ? "auto" : width * (1 - progress(f, span))));
    // The letters show as soon as there's room for them, so a run opening reads as
    // it unrolling from the letter before, never as an empty gap.
    const opacity = useTransform(fold, (f) => 1 - progress(f, span) ** 2);
    const filter = useTransform(fold, (f) => `blur(${progress(f, span) * 2}px)`);
    return (
        <motion.span aria-hidden className="block shrink-0 overflow-hidden" style={{ width: w, opacity, filter }}>
            <span ref={measure} className="flex w-max whitespace-pre">
                {children}
            </span>
        </motion.span>
    );
}

/**
 * The logo, folded as far as `fold` says. It reports its measured geometry, so
 * the nav around it can size itself to the logo at any fold.
 */
export function FoldingLogo({
    look,
    fold,
    onGeometry,
}: {
    look: LogoLook;
    fold?: MotionValue<number>;
    onGeometry?: (geometry: LogoGeometry) => void;
}) {
    const open = useMotionValue(0);
    const value = fold ?? open;
    const kept = useRef<(HTMLElement | null)[]>([]);
    const runs = useRef<(HTMLElement | null)[]>([]);
    const [widths, setWidths] = useState<number[]>();

    const parts = look === 1 ? NAME : [{ text: "mark", keep: true }, { text: "wordmark", keep: false }];
    const runCount = parts.filter((p) => !p.keep).length;
    const spans = windows(runCount);

    useLayoutEffect(() => {
        const measure = () => {
            const runWidths = runs.current.slice(0, runCount).map((el) => el?.getBoundingClientRect().width ?? 0);
            const keptWidth = kept.current.reduce((sum, el) => sum + (el?.getBoundingClientRect().width ?? 0), 0);
            setWidths(runWidths);
            onGeometry?.({ kept: keptWidth, runs: runWidths });
        };
        measure();
        document.fonts?.ready.then(measure);
        // onGeometry is the nav's state setter; measuring again for a new one isn't needed
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [look, runCount]);

    let k = 0;
    let r = 0;
    return (
        <span aria-hidden className={`flex items-center text-[#1C1C1E] ${look === 1 ? LOGO_TYPE : ""}`}>
            {parts.map((part, i) => {
                if (part.keep) {
                    const index = k++;
                    const ref = (el: HTMLElement | null) => {
                        kept.current[index] = el;
                    };
                    return look === 1 ? (
                        <span key={i} ref={ref} className="block shrink-0 whitespace-pre">
                            {part.text}
                        </span>
                    ) : (
                        <span key={i} ref={ref} className="block shrink-0" style={{ width: MARK, height: MARK, ...masked("/brand/mark.svg") }} />
                    );
                }
                const index = r++;
                return (
                    <Run
                        key={i}
                        fold={value}
                        span={spans[index]}
                        width={widths?.[index]}
                        measure={(el) => {
                            runs.current[index] = el;
                        }}
                    >
                        {look === 1 ? (
                            part.text
                        ) : (
                            <span className="block" style={{ marginLeft: WORD_GAP, width: WORD_W, height: WORD_H, ...masked("/brand/wordmark.svg") }} />
                        )}
                    </Run>
                );
            })}
        </span>
    );
}

/** The type for look 1: the site's font in caps, a little open, so it reads as a logotype rather than a label. */
const LOGO_TYPE = "text-[14px] font-semibold leading-5 tracking-[0.05em]";
