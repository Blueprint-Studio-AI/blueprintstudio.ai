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
    sub: string;
    cta: { label: string; href: string };
    /** Plays in the hero frame over the reel, from `start`; the poster shows while it loads. */
    video: { src: string; poster: string; start: number };
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
            poster: "/media/projects/living-ip/living-ip-hero-poster.jpg",
            start: 1.2,
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
            start: 1,
        },
    },
    {
        key: "brands",
        word: "brands",
        label: "Brands",
        sub: "For founders like Arch Network, Jinba and HoneyB.",
        cta: { label: "See brand work", href: "/brand" },
        video: {
            src: "/media/projects/huch/huch-brand-overview-horizontal-compressed.mp4",
            poster: "/media/projects/huch/huch-hero-poster.jpg",
            start: 3.2,
        },
    },
    {
        key: "launch-videos",
        word: "launch videos",
        label: "Launch videos",
        sub: "For founders like Jinba, Pyra and TokenWorks.",
        cta: { label: "See launch videos", href: "/launch-videos" },
        // TokenWorks' AgeVisor 3 launch film, one of the films on /launch-videos.
        video: {
            src: "/media/projects/tokenworks-videos/tokenworks-videos-horizontal-compressed.mp4",
            poster: "/media/projects/tokenworks-videos/tokenworks-hero-poster.jpg",
            start: 4.6,
        },
    },
];

const ROTATE_MS = 2400;
const CHIP_SPRING = { type: "spring", visualDuration: 0.45, bounce: 0.15 } as const;
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/** The variant in the URL (?for=websites), if any. */
export function variantFromUrl(): VariantKey | null {
    const key = new URLSearchParams(window.location.search).get("for");
    return VARIANTS.some((v) => v.key === key) ? (key as VariantKey) : null;
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
    const [anchor, setAnchor] = useState<{ x: number; y: number } | null>(null);

    const cycling = rotate && value === null && !open && !hovered && !reduceMotion;
    useEffect(() => {
        if (!cycling) return;
        const timer = setInterval(() => setIndex((i) => (i + 1) % VARIANTS.length), ROTATE_MS);
        return () => clearInterval(timer);
    }, [cycling]);

    const shown = value ? VARIANTS.find((v) => v.key === value)! : VARIANTS[index];
    const word = open && value === null ? "everything" : shown.word;

    // Measure the word (in the H1's font) so its box can spring to it; again if the font size changes.
    const sizerRef = useRef<HTMLSpanElement>(null);
    const [width, setWidth] = useState<number>();
    useLayoutEffect(() => {
        const sizer = sizerRef.current;
        if (!sizer) return;
        const measure = () => setWidth(Math.ceil(sizer.getBoundingClientRect().width) + 1); // + 1: never shave the last glyph's edge
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(sizer);
        return () => observer.disconnect();
    }, [word]);

    const openMenu = () => {
        const rect = chipRef.current?.getBoundingClientRect();
        if (!rect) return;
        setAnchor({ x: rect.left + rect.width / 2, y: rect.bottom + 10 });
        setOpen(true);
    };
    const close = (refocus: boolean) => {
        setOpen(false);
        if (refocus) chipRef.current?.focus({ preventScroll: true });
    };
    const pick = (key: VariantKey | null) => {
        onChange(key);
        if (key === null) setIndex(0);
        close(true);
    };

    // Close on outside click, scroll or Escape; arrow keys move through the options.
    useEffect(() => {
        if (!open) return;
        listRef.current?.querySelector<HTMLButtonElement>('[aria-selected="true"]')?.focus({ preventScroll: true });
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
                className="group relative mt-[0.1em] inline-flex cursor-pointer items-center rounded-[0.22em] bg-neutral-900/[0.05] py-[0.02em] pl-[0.2em] pr-[0.14em] outline-none transition-colors duration-200 hover:bg-neutral-900/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#2563EB]"
            >
                {/* The word's box springs to each word's width; the words slide through it. */}
                <motion.span
                    className="relative inline-block h-[1.18em] overflow-hidden whitespace-nowrap"
                    initial={false}
                    animate={width === undefined ? undefined : { width }}
                    transition={CHIP_SPRING}
                >
                    <AnimatePresence initial={false}>
                        <motion.span
                            key={word}
                            className="absolute left-0 top-0 leading-[1.18em]"
                            initial={reduceMotion ? { opacity: 0 } : { y: "62%", opacity: 0, filter: "blur(6px)" }}
                            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                            exit={
                                reduceMotion
                                    ? { opacity: 0, transition: { duration: 0.15 } }
                                    : { y: "-62%", opacity: 0, filter: "blur(6px)", transition: { duration: 0.28, ease: EASE_OUT } }
                            }
                            transition={{ duration: 0.45, ease: EASE_OUT }}
                        >
                            {word}
                        </motion.span>
                    </AnimatePresence>
                    {/* Sizes the box before the first measure, then measures each new word. */}
                    <span ref={sizerRef} aria-hidden className="invisible inline-block whitespace-nowrap">
                        {word}
                    </span>
                </motion.span>
                <ChevronDown
                    aria-hidden
                    className="ml-[0.1em] h-[0.34em] w-[0.34em] shrink-0 text-neutral-900/45 transition-transform duration-300 group-hover:translate-y-[0.04em]"
                    style={open ? { transform: "rotate(180deg)" } : undefined}
                    strokeWidth={2.25}
                />
            </motion.button>

            {typeof document !== "undefined" &&
                createPortal(
                    <AnimatePresence>
                        {open && anchor && (
                            <motion.div
                                ref={listRef}
                                role="listbox"
                                aria-label="What we make"
                                initial={{ opacity: 0, scale: 0.94, y: -6 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.96, y: -4, transition: { duration: 0.15 } }}
                                transition={CHIP_SPRING}
                                className="fixed z-[70] w-56 origin-top rounded-2xl border border-neutral-200 bg-white/95 p-1.5 text-[15px] font-medium tracking-normal text-neutral-800 shadow-[0_12px_40px_rgba(0,0,0,0.12)] backdrop-blur-xl"
                                style={{ left: anchor.x - 112, top: anchor.y }}
                            >
                                {[{ key: null, label: "Everything" }, ...VARIANTS].map((option) => {
                                    const selected = value === option.key;
                                    return (
                                        <button
                                            key={option.key ?? "all"}
                                            type="button"
                                            role="option"
                                            aria-selected={selected}
                                            onClick={() => pick(option.key)}
                                            className="flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-left outline-none transition-colors hover:bg-neutral-100 focus-visible:bg-neutral-100"
                                        >
                                            {option.label}
                                            {selected && <Check aria-hidden className="h-4 w-4 text-[#2563EB]" strokeWidth={2.5} />}
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

/** A variant's clip over the reel: its poster at once, then the clip from `start`. */
export function VariantVideo({ src, poster, start }: Variant["video"]) {
    return (
        <motion.video
            src={src}
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
            initial={{ opacity: 0, filter: "blur(6px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(6px)", transition: { duration: 0.25 } }}
            transition={{ duration: 0.45, ease: EASE_OUT }}
        />
    );
}
