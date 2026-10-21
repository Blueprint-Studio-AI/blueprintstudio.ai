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
    /** A small crop of the poster, for inline use in text. */
    thumb: string;
};

export const VARIANTS: Variant[] = [
    {
        key: "apps",
        word: "apps",
        label: "Apps",
        sub: "For founders like LivingIP and Bump.",
        thumb: "/media/hero-words/apps.jpg",
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
        thumb: "/media/hero-words/websites.jpg",
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
        sub: "For founders like Autara, Arch Network and HoneyB.",
        cta: { label: "See brand work", href: "/brand" },
        thumb: "/media/hero-words/brands.jpg",
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
        sub: "For founders like TokenWorks, Jinba and Pyra.",
        thumb: "/media/hero-words/launch-videos.jpg",
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
// B and C run through the range once after landing, this long per word.
const PASS_MS = 650;
const CHIP_SPRING = { type: "spring", visualDuration: 0.45, bounce: 0.15 } as const;
// A touch quicker than the text, so a growing box stays ahead of the word coming in.
const WIDTH_SPRING = { type: "spring", visualDuration: 0.32, bounce: 0.1 } as const;
const TURN_SPRING = { type: "spring", visualDuration: 0.28, bounce: 0.05 } as const;
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/**
 * Headline looks to compare on the dev server (?look=a|b|c):
 * a, a tinted pill in Inter that cycles; b, a serif italic word with a dotted
 * underline that rests on "businesses"; c, the same serif in a soft pill;
 * d, a static headline, with the picker as a small "Showing [all work]" pill on the reel;
 * e, a left-aligned statement (like Anthropic's and Mouthwash's) with that same pill.
 */
export type Look = "a" | "b" | "c" | "d" | "e";

export function lookFromUrl(): Look {
    const look = new URLSearchParams(window.location.search).get("look");
    return look === "a" || look === "c" || look === "d" || look === "e" ? look : "b";
}

const SERIF = { fontFamily: "'PP Editorial New', Georgia, serif", fontStyle: "italic", fontWeight: 400, letterSpacing: "-0.005em" } as const;

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
    look,
}: {
    value: VariantKey | null;
    onChange: (key: VariantKey | null) => void;
    /** The hero has landed: start cycling (a) or the one pass through the range (b, c). */
    rotate: boolean;
    look: Look;
}) {
    const reduceMotion = useReducedMotion();
    const [index, setIndex] = useState(0);
    const [open, setOpen] = useState(false);
    const [hovered, setHovered] = useState(false);
    const chipRef = useRef<HTMLButtonElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const [anchor, setAnchor] = useState<{ x: number; y: number; width: number } | null>(null);

    const cycling = look === "a" && rotate && value === null && !open && !hovered && !reduceMotion;
    useEffect(() => {
        if (!cycling) return;
        const timer = setInterval(() => setIndex((i) => (i + 1) % VARIANTS.length), ROTATE_MS);
        return () => clearInterval(timer);
    }, [cycling]);

    // b and c: once, after landing, show the range, then rest on "businesses".
    const [pass, setPass] = useState(-1);
    const [passDone, setPassDone] = useState(false);
    const passing = (look === "b" || look === "c") && rotate && value === null && !passDone && !reduceMotion;
    useEffect(() => {
        if (!passing) return;
        let step = 0;
        setPass(0);
        const timer = setInterval(() => {
            step += 1;
            if (step < VARIANTS.length) setPass(step);
            else {
                setPass(-1);
                setPassDone(true);
            }
        }, PASS_MS);
        return () => {
            clearInterval(timer);
            setPass(-1);
        };
    }, [passing]);

    const shown = value ? VARIANTS.find((v) => v.key === value)! : VARIANTS[look === "a" ? index : Math.max(pass, 0)];
    const onReel = look === "d" || look === "e";
    const rest = onReel ? "all work" : "businesses";
    const word = value || look === "a" || pass >= 0 ? shown.word : rest;
    const allLabel = look === "a" ? "Everything" : onReel ? "All work" : "Businesses";

    // The menu sits under the chip and is never narrower than it.
    const placeMenu = () => {
        const rect = chipRef.current?.getBoundingClientRect();
        if (rect) setAnchor({ x: rect.left + rect.width / 2, y: rect.bottom + 10, width: Math.max(224, rect.width) });
    };
    const openMenu = () => {
        placeMenu();
        setPassDone(true); // opening the menu ends the pass
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
        listRef.current?.querySelector<HTMLButtonElement>(`[data-key="${value ?? (look === "a" ? shown.key : "all")}"]`)?.focus({ preventScroll: true });
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
                className={`group relative inline-flex cursor-pointer items-center outline-none transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#2563EB] ${
                    onReel
                        ? "rounded-full px-1.5 py-0.5 text-neutral-900 hover:bg-neutral-900/[0.06]"
                        : look === "b"
                        ? "mt-[0.06em] rounded-[0.12em]"
                        : "mt-[0.16em] rounded-[0.22em] bg-neutral-900/[0.05] py-[0.02em] pl-[0.2em] pr-[0.16em] hover:bg-neutral-900/[0.1]"
                }`}
            >
                {look === "a" || onReel ? (
                    <SpringText text={word} slide className="leading-[1.2em]" />
                ) : (
                    <span style={SERIF}>
                        <SpringText
                            text={word}
                            slide
                            className={`leading-[1.2em] ${
                                look === "b"
                                    ? "bg-[linear-gradient(to_right,rgba(17,17,17,0.3)_33%,transparent_0)] bg-[length:0.18em_1.5px] bg-[position:0_94%] bg-repeat-x transition-[background-color] group-hover:bg-[linear-gradient(to_right,rgba(17,17,17,0.6)_33%,transparent_0)]"
                                    : ""
                            }`}
                        />
                    </span>
                )}
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
                                {[{ key: null, label: allLabel }, ...VARIANTS].map((option) => {
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
                                            {selected && (value !== null || look !== "a") && <Check aria-hidden className="h-4 w-4 text-[#2563EB]" strokeWidth={2.5} />}
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

/** Static headlines to compare under look d (?h=1..6). The first is the default. */
export const HEADLINES = [
    "Apps, websites and brands, designed and\u00A0built.",
    "We design and build products and\u00A0services.",
    "Your co-creation partner for digital products and\u00A0services.",
    "We co-create products &\u00A0services.",
    "Your design and build partner, from first sketch to\u00A0launch.",
    "The design and build partner for\u00A0founders.",
];

export function headlineFromUrl(): number {
    const h = Number(new URLSearchParams(window.location.search).get("h"));
    return h >= 1 && h <= HEADLINES.length ? h - 1 : 0;
}

/** Dev server only: switch between the headline looks (and, under d, the headlines) without editing the URL. */
export function LookSwitcher({
    look,
    onChange,
    headline,
    onHeadline,
}: {
    look: Look;
    onChange: (look: Look) => void;
    headline: number;
    onHeadline: (index: number) => void;
}) {
    if (process.env.NODE_ENV !== "development") return null;
    return (
        <div className="fixed right-3 top-1 z-[80] flex flex-col items-end gap-1.5 md:top-[76px]">
        <div className="flex items-center gap-1 rounded-full border border-neutral-200 bg-white/90 p-1 text-xs font-medium text-neutral-600 shadow-sm backdrop-blur">
            <span className="px-2">Look</span>
            {(["a", "b", "c", "d", "e"] as const).map((key) => (
                <button
                    key={key}
                    type="button"
                    onClick={() => onChange(key)}
                    className={`h-7 w-7 rounded-full uppercase transition-colors ${look === key ? "bg-neutral-900 text-white" : "hover:bg-neutral-100"}`}
                >
                    {key}
                </button>
            ))}
        </div>
        {look === "d" && (
            <div className="flex items-center gap-1 rounded-full border border-neutral-200 bg-white/90 p-1 text-xs font-medium text-neutral-600 shadow-sm backdrop-blur">
                <span className="px-2">Headline</span>
                {HEADLINES.map((text, index) => (
                    <button
                        key={index}
                        type="button"
                        title={text}
                        onClick={() => onHeadline(index)}
                        className={`h-7 w-7 rounded-full transition-colors ${headline === index ? "bg-neutral-900 text-white" : "hover:bg-neutral-100"}`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        )}
        </div>
    );
}
