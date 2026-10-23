"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useSmoothScroll } from "./SmoothScroll";
import {
    ASSET_GENERATOR,
    CRYPTO,
    CallButton,
    EASE_OUT,
    FOCUS,
    SECTIONS,
    SERVICES,
    SPRING,
    isNavHidden,
    useActiveSection,
    useGoToSection,
    useNavReveal,
} from "@/components/nav/shared";

// Phones' nav: a compact pill at the bottom (the logo, Menu and Book a call)
// that grows into a menu sheet and shrinks back, one shape the whole way, like
// the Dynamic Island. From md up the top nav does this job.

const PILL_H = 56;
const ROW = {
    closed: { opacity: 0, y: 6, filter: "blur(3px)", transition: { duration: 0.12 } },
    open: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.32, ease: EASE_OUT } },
} as const;

export const FloatingNavNew = () => {
    const pathname = usePathname();
    const home = pathname === "/";
    const revealed = useNavReveal();
    const reduce = useReducedMotion();
    const goToSection = useGoToSection();
    const section = useActiveSection();
    const { scroll } = useSmoothScroll();
    const [open, setOpen] = useState(false);

    // The closed pill is as wide as its row; the sheet as wide as the screen allows.
    const rowRef = useRef<HTMLDivElement>(null);
    const sheetRef = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState({ pill: 280, sheetW: 360, sheetH: 520 });
    useLayoutEffect(() => {
        const measure = () => {
            const row = rowRef.current;
            const sheet = sheetRef.current;
            if (!row || !sheet) return;
            const style = getComputedStyle(row);
            const parts = [...row.children].reduce((sum, el) => sum + (el as HTMLElement).offsetWidth, 0);
            const gaps = parseFloat(style.columnGap || "0") * (row.children.length - 1);
            const pad = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
            setSize({
                pill: Math.ceil(parts + gaps + pad),
                sheetW: Math.min(window.innerWidth - 24, 420),
                sheetH: sheet.offsetHeight + PILL_H,
            });
        };
        measure();
        document.fonts?.ready.then(measure);
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, []);

    // While the sheet is open the page stays still, Escape closes it, and so does going somewhere else.
    useEffect(() => {
        if (!open) return;
        scroll?.stop();
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
        window.addEventListener("keydown", onKey);
        return () => {
            scroll?.start();
            window.removeEventListener("keydown", onKey);
        };
    }, [open, scroll]);
    useEffect(() => setOpen(false), [pathname]);
    useEffect(() => {
        if (sheetRef.current) sheetRef.current.inert = !open;
    }, [open]);

    // Close first, then scroll, once the page can move again.
    const go = (id: string) => {
        setOpen(false);
        requestAnimationFrame(() => requestAnimationFrame(() => goToSection(id)));
    };

    if (isNavHidden(pathname)) return null;

    const morph = reduce ? { duration: 0 } : SPRING.morph;
    return (
        <MotionConfig reducedMotion="user">
            <div className="md:hidden">
                <AnimatePresence>
                    {open && (
                        <motion.div
                            key="scrim"
                            className="fixed inset-0 z-50 bg-black/20"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25, ease: EASE_OUT }}
                            onClick={() => setOpen(false)}
                        />
                    )}
                </AnimatePresence>

                <motion.nav
                    aria-label="Main"
                    className="fixed inset-x-0 z-50 mx-auto overflow-hidden"
                    style={{ bottom: "max(16px, env(safe-area-inset-bottom))" }}
                    initial={false}
                    animate={{
                        width: open ? size.sheetW : size.pill,
                        height: open ? size.sheetH : PILL_H,
                        borderRadius: open ? 24 : PILL_H / 2,
                        y: revealed ? 0 : 96,
                        opacity: revealed ? 1 : 0,
                    }}
                    transition={{ ...morph, y: reduce ? { duration: 0 } : SPRING.morph, opacity: { duration: reduce ? 0.2 : 0.3, ease: EASE_OUT } }}
                >
                    <div className="absolute inset-0 bg-white/[0.82] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)] backdrop-blur-2xl backdrop-saturate-[1.8]" style={{ borderRadius: "inherit" }} />

                    {/* The sheet, laid out at its full size from the start so nothing reflows as the shape grows around it */}
                    <motion.div
                        ref={sheetRef}
                        className="absolute left-1/2 -translate-x-1/2 overflow-y-auto p-2"
                        style={{ bottom: PILL_H, width: size.sheetW, maxHeight: "calc(100svh - 120px)" }}
                        initial={false}
                        animate={open ? "open" : "closed"}
                        variants={{ open: { transition: { staggerChildren: 0.03, delayChildren: 0.06 } }, closed: {} }}
                    >
                        <ul>
                            {SECTIONS.map((s) => (
                                <motion.li key={s.id} variants={ROW}>
                                    <a
                                        href={`/#${s.id}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            go(s.id);
                                        }}
                                        aria-current={home && section === s.id ? "location" : undefined}
                                        className={`flex h-12 items-center justify-between rounded-2xl px-3 text-[17px] font-medium text-[rgba(28,28,30,0.96)] ${home && section === s.id ? "bg-black/[0.05]" : "active:bg-black/[0.04]"} ${FOCUS}`}
                                    >
                                        {s.label}
                                        {home && section === s.id && <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#2563EB]" />}
                                    </a>
                                </motion.li>
                            ))}
                        </ul>
                        <motion.div variants={ROW} aria-hidden className="mx-3 my-2 h-px bg-black/[0.07]" />
                        <motion.p variants={ROW} className="px-3 pb-1 text-[13px] font-medium text-[rgba(28,28,30,0.5)]">
                            Services
                        </motion.p>
                        <ul>
                            {SERVICES.map((service) => (
                                <motion.li key={service.key} variants={ROW}>
                                    <Link
                                        href={service.href}
                                        onClick={() => setOpen(false)}
                                        className={`flex items-center gap-3 rounded-2xl p-1.5 pr-3 active:bg-black/[0.04] ${FOCUS}`}
                                    >
                                        <span className="relative h-10 w-[60px] shrink-0 overflow-hidden rounded-[9px] bg-neutral-200">
                                            <Image src={service.still} alt="" fill sizes="60px" style={{ objectPosition: service.focus }} className="object-cover" />
                                            <span className="absolute inset-0 rounded-[9px] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]" />
                                        </span>
                                        <span className="min-w-0 flex-1">
                                            <span className="block text-[15px] font-medium leading-5 text-[rgba(28,28,30,0.96)]">{service.label}</span>
                                            <span className="block truncate text-[13px] leading-[18px] text-[rgba(28,28,30,0.5)]">{service.hint}</span>
                                        </span>
                                    </Link>
                                </motion.li>
                            ))}
                        </ul>
                        <motion.div variants={ROW} aria-hidden className="mx-3 my-2 h-px bg-black/[0.07]" />
                        <ul>
                            <motion.li variants={ROW}>
                                <Link
                                    href={CRYPTO.href}
                                    onClick={() => setOpen(false)}
                                    className={`flex h-11 items-center rounded-2xl px-3 text-[15px] font-medium text-[rgba(28,28,30,0.86)] active:bg-black/[0.04] ${FOCUS}`}
                                >
                                    {CRYPTO.label}
                                </Link>
                            </motion.li>
                            <motion.li variants={ROW}>
                                <a
                                    href={ASSET_GENERATOR.href}
                                    target="_blank"
                                    rel="noopener"
                                    onClick={() => setOpen(false)}
                                    className={`flex h-11 items-center gap-2 rounded-2xl px-3 text-[15px] font-medium text-[rgba(28,28,30,0.86)] active:bg-black/[0.04] ${FOCUS}`}
                                >
                                    {ASSET_GENERATOR.label}
                                    <span className="rounded-full bg-black/[0.05] px-1.5 py-px text-[11px] font-medium text-[rgba(28,28,30,0.55)]">Our app</span>
                                    <ArrowUpRight aria-hidden className="ml-auto h-4 w-4 text-[rgba(28,28,30,0.45)]" strokeWidth={2.25} />
                                </a>
                            </motion.li>
                        </ul>
                    </motion.div>

                    {/* The pill's own row, which stays at the bottom edge as the shape grows */}
                    <div ref={rowRef} className="absolute inset-x-0 bottom-0 flex h-14 items-center justify-between gap-1 px-1.5">
                        <div className="flex shrink-0 items-center gap-1">
                            <motion.a
                                href="/"
                                onClick={(e) => {
                                    if (!home) return;
                                    e.preventDefault();
                                    go("hero");
                                }}
                                whileTap={{ scale: 0.94 }}
                                transition={SPRING.press}
                                aria-label="Blueprint Studio home"
                                className={`flex h-11 w-11 items-center justify-center rounded-full active:bg-black/[0.05] ${FOCUS}`}
                            >
                                <Image src="/blueprint-logo.svg" alt="" width={24} height={24} className="h-6 w-6" />
                            </motion.a>
                            <motion.button
                                type="button"
                                aria-expanded={open}
                                onClick={() => setOpen((o) => !o)}
                                whileTap={{ scale: 0.97 }}
                                transition={SPRING.press}
                                className={`flex h-11 items-center gap-2 rounded-full pl-3 pr-4 text-[15px] font-medium text-[rgba(28,28,30,0.9)] active:bg-black/[0.05] ${FOCUS}`}
                            >
                                {/* Two lines that turn into a cross */}
                                <span aria-hidden className="relative h-3 w-4">
                                    <motion.span
                                        className="absolute left-0 right-0 top-[2px] h-[1.75px] rounded-full bg-current"
                                        animate={open ? { y: 3.5, rotate: 45 } : { y: 0, rotate: 0 }}
                                        transition={SPRING.glide}
                                    />
                                    <motion.span
                                        className="absolute bottom-[2px] left-0 right-0 h-[1.75px] rounded-full bg-current"
                                        animate={open ? { y: -3.5, rotate: -45 } : { y: 0, rotate: 0 }}
                                        transition={SPRING.glide}
                                    />
                                </span>
                                <span className="relative inline-grid w-[42px] text-left">
                                    <AnimatePresence initial={false} mode="popLayout">
                                        <motion.span
                                            key={open ? "close" : "menu"}
                                            className="[grid-area:1/1]"
                                            initial={{ opacity: 0, y: 6, filter: "blur(3px)" }}
                                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                            exit={{ opacity: 0, y: -6, filter: "blur(3px)", transition: { duration: 0.12 } }}
                                            transition={{ duration: 0.24, ease: EASE_OUT }}
                                        >
                                            {open ? "Close" : "Menu"}
                                        </motion.span>
                                    </AnimatePresence>
                                </span>
                            </motion.button>
                        </div>
                        <CallButton touch onGo={() => go("contact")} />
                    </div>
                </motion.nav>
            </div>
        </MotionConfig>
    );
};
