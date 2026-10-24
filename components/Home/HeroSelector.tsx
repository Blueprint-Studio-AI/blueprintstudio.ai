"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

// What we make, as variants of the hero: picking a word in the hero's statement
// turns it into that variant (its work, clients and link). Only real clients
// from the site's own pages are named here.

export type VariantKey = "apps" | "websites" | "brands" | "launch-videos";

export type Variant = {
    key: VariantKey;
    word: string;
    label: string;
    /** Leads with the client whose work is on screen. */
    cta: { label: string; href: string };
    /**
     * Plays in the hero frame over the reel, looping from `start` to `end`, which
     * skip each cut's dark lead-in and fade-out; the poster shows while it loads.
     * `phone` is a tall cut for the 4:5 frame on phones, where one exists.
     */
    video: { src: string; phone?: string; poster: string; start: number; end: number };
    /** A still of the work, floated by the cursor when the word is hovered. */
    still: string;
};

export const VARIANTS: Variant[] = [
    {
        key: "apps",
        word: "apps",
        label: "Apps",
        still: "/media/hero-words/apps-device-2.jpg",
        cta: { label: "See app work", href: "#work" },
        video: {
            src: "/media/projects/living-ip/living-ip-horizontal-compressed.mp4",
            phone: "/media/projects/living-ip/living-ip-vertical-compressed.mp4",
            poster: "/media/projects/living-ip/living-ip-hero-poster.jpg",
            start: 1.2,
            end: 13.5,
        },
    },
    {
        key: "websites",
        word: "websites",
        label: "Websites",
        still: "/media/hero-words/websites-device-2.jpg",
        cta: { label: "See website work", href: "#work" },
        video: {
            src: "/media/projects/perena/perena-horizontal-compressed.mp4",
            poster: "/media/projects/perena/perena-hero-poster.jpg",
            // The laptop and the deposit flow; from about 3.7s the page scrolls away to cream.
            start: 1,
            end: 3.6,
        },
    },
    {
        key: "brands",
        word: "brands",
        label: "Brands",
        cta: { label: "See brand work", href: "/brand" },
        still: "/media/hero-words/brands-device-2.jpg",
        // Autara's identity: the triangle pattern into its homepage.
        video: {
            src: "/media/projects/autara/autara-horizontal-compressed.mp4",
            phone: "/media/projects/autara/autara-vertical-compressed.mp4",
            poster: "/media/projects/autara/autara-hero-poster.jpg",
            start: 3.8,
            end: 7.8,
        },
    },
    {
        key: "launch-videos",
        word: "launch videos",
        label: "Launch videos",
        still: "/media/hero-words/launch-videos-device-2.jpg",
        cta: { label: "See launch videos", href: "/launch-videos" },
        // TokenWorks' AgeVisor 3 launch film, one of the films on /launch-videos.
        video: {
            src: "/media/projects/tokenworks-videos/tokenworks-videos-horizontal-compressed.mp4",
            poster: "/media/projects/tokenworks-videos/tokenworks-hero-poster.jpg",
            start: 4.6,
            end: 16.4,
        },
    },
];

// A touch quicker than the text, so a growing box stays ahead of the word coming in.
const WIDTH_SPRING = { type: "spring", visualDuration: 0.32, bounce: 0.1 } as const;
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/** The variant in the URL (?for=websites), if any. */
export function variantFromUrl(): VariantKey | null {
    const key = new URLSearchParams(window.location.search).get("for");
    return VARIANTS.some((v) => v.key === key) ? (key as VariantKey) : null;
}

/**
 * Text whose box springs to each new string's measured width while the strings
 * crossfade through it (sliding up, with `slide`). It clips top and bottom only,
 * so a word never shows cut off at the side while the box catches up.
 */
export function SpringText({ text, slide = false, className = "" }: { text: string; slide?: boolean; className?: string }) {
    const reduceMotion = useReducedMotion();
    const sizerRef = useRef<HTMLSpanElement>(null);
    // The measured width for `text`, and whether it grew from the last one.
    const [box, setBox] = useState<{ text: string; width: number; grow: boolean }>();
    useLayoutEffect(() => {
        const sizer = sizerRef.current;
        if (!sizer) return;
        // + 1: never shave the last glyph's edge. Measured again if the font size changes.
        const measure = () => {
            const width = Math.ceil(sizer.getBoundingClientRect().width) + 1;
            setBox((prev) => ({ text, width, grow: prev !== undefined && width > prev.width + 1 }));
        };
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(sizer);
        return () => observer.disconnect();
    }, [text]);

    const move = slide && !reduceMotion;
    // Growing: the box opens first and the word arrives into it. Shrinking: the
    // word leaves first, then the box closes. Either way nothing spills past it.
    const grow = box?.grow ?? false;
    return (
        <motion.span
            className={`relative inline-block whitespace-nowrap ${className}`}
            style={{ clipPath: "inset(0 -1em)" }}
            initial={false}
            animate={box ? { width: box.width } : undefined}
            transition={{ ...WIDTH_SPRING, delay: grow ? 0 : 0.12 }}
        >
            <AnimatePresence initial={false}>
                <motion.span
                    key={text}
                    className="absolute left-0 top-0"
                    initial={move ? { y: "62%", opacity: 0, filter: "blur(6px)" } : { opacity: 0, filter: "blur(4px)" }}
                    animate={box?.text === text ? { y: 0, opacity: 1, filter: "blur(0px)" } : undefined}
                    exit={
                        move
                            ? { y: "-62%", opacity: 0, filter: "blur(6px)", transition: { duration: 0.2, ease: EASE_OUT } }
                            : { opacity: 0, filter: "blur(4px)", transition: { duration: 0.14 } }
                    }
                    transition={{ duration: 0.42, ease: EASE_OUT, delay: grow ? 0.2 : 0.06 }}
                >
                    {text}
                </motion.span>
            </AnimatePresence>
            {/* Sizes the box before the first measure. */}
            <span ref={sizerRef} aria-hidden className="invisible inline-block">
                {text}
            </span>
        </motion.span>
    );
}

/** A variant's clip over the reel: its poster at once, then the clip, looping between `start` and `end`. */
export function VariantVideo({ src, phone, poster, start, end, compact }: Variant["video"] & { compact: boolean }) {
    return (
        <motion.video
            src={compact && phone ? phone : src}
            poster={poster}
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            onLoadedMetadata={(e) => {
                e.currentTarget.currentTime = start;
            }}
            onTimeUpdate={(e) => {
                // Also catches the browser's own loop back to 0, into the lead-in.
                const t = e.currentTarget.currentTime;
                if (t < start - 0.25 || t >= end) e.currentTarget.currentTime = start;
            }}
            initial={{ opacity: 0, filter: "blur(6px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(6px)", transition: { duration: 0.25 } }}
            transition={{ duration: 0.45, ease: EASE_OUT }}
        />
    );
}
