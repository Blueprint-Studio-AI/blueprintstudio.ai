"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";

// "We design and build [apps ⌄]": the word cycles through what we make, and
// picking one turns the hero into that variant (its work, clients and link).
// Only real clients from the site's own pages are named here.

export type VariantKey = "apps" | "websites" | "brands" | "launch-videos";

export type Variant = {
    key: VariantKey;
    word: string;
    label: string;
    /** Leads with the client whose work is on screen. */
    sub: string;
    cta: { label: string; href: string };
    /**
     * Plays in the hero frame over the reel, looping from `start` to `end`, which
     * skip each cut's dark lead-in and fade-out; the poster shows while it loads.
     * `phone` is a tall cut for the 4:5 frame on phones, where one exists.
     */
    video: { src: string; phone?: string; poster: string; start: number; end: number };
};

export const VARIANTS: Variant[] = [
    {
        key: "apps",
        word: "apps",
        label: "Apps",
        sub: "For founders like LivingIP, Huch and Bump.",
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
        sub: "For founders like Perena, Autara and Breeze.",
        cta: { label: "See website work", href: "#work" },
        video: {
            src: "/media/projects/perena/perena-horizontal-compressed.mp4",
            poster: "/media/projects/perena/perena-hero-poster.jpg",
            // The laptop and the deposit flow; after that the cut fades to cream on cream.
            start: 1,
            end: 4.2,
        },
    },
    {
        key: "brands",
        word: "brands",
        label: "Brands",
        sub: "For founders like Huch, Arch Network and HoneyB.",
        cta: { label: "See brand work", href: "/brand" },
        video: {
            src: "/media/projects/huch/huch-brand-overview-horizontal-compressed.mp4",
            phone: "/media/projects/huch/huch-brand-overview-vertical-compressed.mp4",
            poster: "/media/projects/huch/huch-hero-poster.jpg",
            // The crates into the chest's glow, before the cut goes dark.
            start: 3.2,
            end: 6.8, // the loop check runs about four times a second; stay clear of the dark reveal
        },
    },
    {
        key: "launch-videos",
        word: "launch videos",
        label: "Launch videos",
        sub: "For founders like TokenWorks, Jinba and Pyra.",
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

const ROTATE_MS = 2400;
const CHIP_SPRING = { type: "spring", visualDuration: 0.45, bounce: 0.15 } as const;
// A touch quicker than the text, so a growing box stays ahead of the word coming in.
const WIDTH_SPRING = { type: "spring", visualDuration: 0.32, bounce: 0.1 } as const;
const TURN_SPRING = { type: "spring", visualDuration: 0.28, bounce: 0.05 } as const;
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

export function VariantPicker({
    value,
    onChange,
    rotate,
}: {
    value: VariantKey | null;
    onChange: (key: VariantKey | null) => void;
    /** Cycle the word while nothing is picked. */
    rotate: boolean;
}) {
    const reduceMotion = useReducedMotion();
    const [index, setIndex] = useState(0);
    const [open, setOpen] = useState(false);
    const [hovered, setHovered] = useState(false);
    const chipRef = useRef<HTMLButtonElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const [anchor, setAnchor] = useState<{ x: number; y: number; width: number } | null>(null);

    const cycling = rotate && value === null && !open && !hovered && !reduceMotion;
    useEffect(() => {
        if (!cycling) return;
        const timer = setInterval(() => setIndex((i) => (i + 1) % VARIANTS.length), ROTATE_MS);
        return () => clearInterval(timer);
    }, [cycling]);

    const shown = value ? VARIANTS.find((v) => v.key === value)! : VARIANTS[index];
    const word = shown.word;

    // The menu sits under the chip and is never narrower than it.
    const placeMenu = () => {
        const rect = chipRef.current?.getBoundingClientRect();
        if (rect) setAnchor({ x: rect.left + rect.width / 2, y: rect.bottom + 10, width: Math.max(224, rect.width) });
    };
    const openMenu = () => {
        placeMenu();
        setOpen(true);
    };
    useEffect(() => {
        const chip = chipRef.current;
        if (!open || !chip) return;
        const observer = new ResizeObserver(placeMenu);
        observer.observe(chip);
        return () => observer.disconnect();
    }, [open]);
    const close = (refocus: boolean) => {
        setOpen(false);
        if (refocus) chipRef.current?.focus({ preventScroll: true });
    };
    const pick = (key: VariantKey | null) => {
        close(true);
        if (key === null) setIndex(0);
        // Let the menu get out of the way before the copy under it changes.
        setTimeout(() => onChange(key), 90);
    };

    // Close on outside click, scroll or Escape; arrow keys move through the options.
    useEffect(() => {
        if (!open) return;
        // Start on the picked row, or on the word showing while it cycled.
        listRef.current?.querySelector<HTMLButtonElement>(`[data-key="${value ?? shown.key}"]`)?.focus({ preventScroll: true });
        const onDown = (e: PointerEvent) => {
            const target = e.target as Node;
            if (!listRef.current?.contains(target) && !chipRef.current?.contains(target)) close(false);
        };
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") return close(true);
            if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
            e.preventDefault();
            const items = [...(listRef.current?.querySelectorAll<HTMLButtonElement>("button") ?? [])];
            const at = items.indexOf(document.activeElement as HTMLButtonElement);
            items[(at + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length]?.focus();
        };
        const onScroll = () => close(false);
        window.addEventListener("pointerdown", onDown);
        window.addEventListener("keydown", onKey);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            window.removeEventListener("pointerdown", onDown);
            window.removeEventListener("keydown", onKey);
            window.removeEventListener("scroll", onScroll);
        };
    }, [open]);

    return (
        <>
            <motion.button
                ref={chipRef}
                type="button"
                onClick={() => (open ? close(false) : openMenu())}
                onPointerEnter={() => setHovered(true)}
                onPointerLeave={() => setHovered(false)}
                whileTap={{ scale: 0.97 }}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-label={`${word}. Choose what to see`}
                className="group relative mt-[0.16em] inline-flex cursor-pointer items-center rounded-[0.22em] bg-neutral-900/[0.05] py-[0.02em] pl-[0.2em] pr-[0.16em] outline-none transition-colors duration-200 hover:bg-neutral-900/[0.1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#2563EB]"
            >
                <SpringText text={word} slide className="leading-[1.2em]" />
                {/* Nudges down on hover; turns with a spring when the menu opens. */}
                <span className="ml-[0.12em] inline-flex transition-transform duration-300 group-hover:translate-y-[0.04em]">
                    <motion.span className="inline-flex" animate={{ rotate: open ? 180 : 0 }} transition={TURN_SPRING}>
                        <ChevronDown aria-hidden className="h-[0.3em] w-[0.3em] text-neutral-900/55" strokeWidth={3} />
                    </motion.span>
                </span>
            </motion.button>

            {typeof document !== "undefined" &&
                createPortal(
                    <AnimatePresence>
                        {open && anchor && (
                            <motion.div
                                ref={listRef}
                                role="listbox"
                                aria-label="What we make"
                                initial={{ opacity: 0, scale: 0.96, y: -4 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.97, y: -3, transition: { duration: 0.1 } }}
                                transition={{ ...CHIP_SPRING, opacity: { duration: 0.12 } }}
                                className="fixed z-[70] origin-top rounded-2xl border border-neutral-200 bg-white/[0.98] p-1.5 text-[15px] font-medium tracking-normal text-neutral-800 shadow-[0_12px_40px_rgba(0,0,0,0.12)] backdrop-blur-xl"
                                style={{ left: anchor.x - anchor.width / 2, top: anchor.y, width: anchor.width }}
                            >
                                {[{ key: null, label: "Everything" }, ...VARIANTS].map((option) => {
                                    const selected = value === option.key;
                                    return (
                                        <button
                                            key={option.key ?? "all"}
                                            data-key={option.key ?? "all"}
                                            type="button"
                                            role="option"
                                            aria-selected={selected}
                                            onClick={() => pick(option.key)}
                                            className="flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-left outline-none transition-colors hover:bg-neutral-100 focus-visible:bg-neutral-100"
                                        >
                                            {option.label}
                                            {selected && value !== null && <Check aria-hidden className="h-4 w-4 text-[#2563EB]" strokeWidth={2.5} />}
                                        </button>
                                    );
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>,
                    document.body,
                )}
        </>
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
