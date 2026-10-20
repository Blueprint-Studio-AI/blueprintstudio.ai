"use client";

import { useEffect, useRef, useState } from "react";
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
    /** Shown in the hero frame over the reel; none keeps the reel. */
    video?: { wide: string; tall: string };
};

export const VARIANTS: Variant[] = [
    {
        key: "apps",
        word: "apps",
        label: "Apps",
        sub: "Products and platforms for founders, like LivingIP, Huch and Bump.",
        cta: { label: "See app work", href: "#work" },
        video: {
            wide: "/media/projects/living-ip/living-ip-horizontal-compressed.mp4",
            tall: "/media/projects/living-ip/living-ip-vertical-compressed.mp4",
        },
    },
    {
        key: "websites",
        word: "websites",
        label: "Websites",
        sub: "Sites and landing pages for founders, like Perena, Autara and Breeze.",
        cta: { label: "See website work", href: "#work" },
        video: {
            wide: "/media/projects/perena/perena-horizontal-compressed.mp4",
            tall: "/media/projects/perena/perena-vertical-compressed.mp4",
        },
    },
    {
        key: "brands",
        word: "brands",
        label: "Brands",
        sub: "Identities and brand systems for founders, like Arch Network, Jinba and HoneyB.",
        cta: { label: "See brand work", href: "/brand" },
        video: {
            wide: "/media/projects/huch/huch-brand-overview-horizontal-compressed.mp4",
            tall: "/media/projects/huch/huch-brand-overview-vertical-compressed.mp4",
        },
    },
    {
        key: "launch-videos",
        word: "launch videos",
        label: "Launch videos",
        sub: "Launch films for founders, like Jinba, Pyra and Logical.",
        cta: { label: "See launch videos", href: "/launch-videos" },
    },
];

const ROTATE_MS = 2400;
/** Shared with the words before the chip, so the line moves as one. */
export const CHIP_SPRING = { type: "spring", visualDuration: 0.45, bounce: 0.15 } as const;
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
                layout
                transition={CHIP_SPRING}
                onClick={() => (open ? close(false) : openMenu())}
                onPointerEnter={() => setHovered(true)}
                onPointerLeave={() => setHovered(false)}
                whileTap={{ scale: 0.97 }}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-label={`${shown.word}. Choose what to see`}
                className="relative inline-flex cursor-pointer items-baseline overflow-hidden whitespace-nowrap rounded-[0.28em] border border-neutral-300/80 bg-white/70 px-[0.22em] align-baseline shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors hover:bg-white"
                style={{ paddingBottom: "0.04em" }}
            >
                <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                        key={shown.key}
                        layout="position"
                        initial={{ y: "70%", opacity: 0, filter: "blur(6px)" }}
                        animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                        exit={{ y: "-70%", opacity: 0, filter: "blur(6px)" }}
                        transition={{ duration: 0.45, ease: EASE_OUT }}
                        className="inline-block"
                    >
                        {shown.word}
                    </motion.span>
                </AnimatePresence>
                <motion.span layout="position" transition={CHIP_SPRING} className="ml-[0.12em] inline-block self-center">
                    <ChevronDown
                        aria-hidden
                        className="h-[0.42em] w-[0.42em] text-neutral-500 transition-transform duration-300"
                        style={{ transform: open ? "rotate(180deg)" : undefined }}
                        strokeWidth={2.5}
                    />
                </motion.span>
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
                                className="fixed z-[70] w-56 origin-top rounded-2xl border border-neutral-200 bg-white/90 p-1.5 text-[15px] font-medium tracking-normal text-neutral-800 shadow-[0_12px_40px_rgba(0,0,0,0.12)] backdrop-blur-xl"
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

/** A variant's clip over the reel, faded in once it can play. */
export function VariantVideo({ src }: { src: string }) {
    const [ready, setReady] = useState(false);
    return (
        <motion.video
            src={src}
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            onLoadedData={() => setReady(true)}
            initial={{ opacity: 0 }}
            animate={{ opacity: ready ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE_OUT }}
        />
    );
}
