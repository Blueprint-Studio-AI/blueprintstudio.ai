"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MotionConfig, motion, useAnimate, useMotionValue, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowUpRight, ChevronDown } from "lucide-react";
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

// The nav at the top of the page. From md up it's one nav with two shapes: a
// bar across the top of the page, which stays put as the page scrolls, and,
// once the hero's buttons have gone under it, a compact floating pill. The bar
// springs into the pill and back (size, position and corners together), and
// everything on it travels with its edges. On phones it's a slim bar with the
// logo that scrolls away; the floating pill at the bottom (FloatingNavNew)
// carries the links and the call there.

const BAR_H = 64;
const PILL_H = 48;
const PILL_TOP = 12;
const PILL_PAD = { left: 16, right: 6 };
const FRAME = 61; // the frame lines sit 60px in from each side, and are 1px wide
const GAP = 20; // between the logo, the links and the call
const REST_MS = 90; // still this long on Services, and its menu opens
const LINGER_MS = 500; // or on it this long, still moving

const MENU = {
    closed: { opacity: 0, scale: 0.92, y: -8, transition: { duration: 0.16, ease: EASE_OUT } },
    open: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { type: "spring", visualDuration: 0.34, bounce: 0.2, opacity: { duration: 0.14 }, staggerChildren: 0.025, delayChildren: 0.03 },
    },
} as const;
const ROW = {
    closed: { opacity: 0, y: -4, filter: "blur(3px)", transition: { duration: 0.1 } },
    open: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.3, ease: EASE_OUT } },
} as const;

const linkTone = (on: boolean) => (on ? "text-[rgba(28,28,30,0.96)]" : "text-[rgba(28,28,30,0.62)]");

type Box = { x: number; y: number; w: number; h: number; on: boolean; glide: boolean };

/**
 * Where the highlight under the lit item goes. It glides from item to item,
 * fades in where it first lands and fades out where it leaves.
 */
function useGlide(lit: string | null, items: Record<string, HTMLElement | null>) {
    const [box, setBox] = useState<Box>({ x: 0, y: 0, w: 0, h: 0, on: false, glide: false });
    useLayoutEffect(() => {
        const el = lit ? items[lit] : null;
        setBox((prev) =>
            el
                ? { x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight, on: true, glide: prev.on }
                : { ...prev, on: false, glide: false },
        );
    }, [lit, items]);
    return box;
}

function Glide({ box, className }: { box: Box; className: string }) {
    return (
        <motion.span
            aria-hidden
            className={`pointer-events-none absolute left-0 top-0 ${className}`}
            initial={false}
            animate={{ x: box.x, y: box.y, width: box.w, height: box.h, opacity: box.on ? 1 : 0 }}
            transition={box.glide ? SPRING.glide : { duration: 0, opacity: { duration: box.on ? 0.12 : 0.2, ease: EASE_OUT } }}
        />
    );
}

const MotionLink = motion.create(Link);

function Logo() {
    const home = usePathname() === "/";
    const goToSection = useGoToSection();
    return (
        <MotionLink
            href="/"
            onClick={(e: React.MouseEvent) => {
                if (!home) return;
                e.preventDefault();
                goToSection("hero");
            }}
            whileTap={{ scale: 0.97 }}
            transition={SPRING.press}
            aria-label="Blueprint Studio home"
            className={`flex w-fit shrink-0 items-center rounded-md transition-opacity duration-200 hover:opacity-70 ${FOCUS}`}
        >
            <Image src="/blueprint-logo-dark.svg" alt="" width={120} height={16} priority className="h-[14px] w-auto md:h-4" />
        </MotionLink>
    );
}

/** The frame's outer lines, drawn over the bar's own background as the hero does. */
function FrameLines() {
    return (
        <div aria-hidden className="pointer-events-none absolute inset-0 flex px-2.5 sm:px-[60px]">
            <div className="relative flex-1">
                <div className="line-dash-y absolute bottom-0 left-0 top-0 custom:hidden" />
                <div className="absolute bottom-0 left-0 top-0 hidden w-px bg-neutral-300 custom:block" />
                <div className="line-dash-y absolute bottom-0 right-0 top-0 custom:hidden" />
                <div className="absolute bottom-0 right-0 top-0 hidden w-px bg-neutral-300 custom:block" />
            </div>
        </div>
    );
}

export function TopNav() {
    const pathname = usePathname();
    const revealed = useNavReveal();
    if (isNavHidden(pathname)) return null;
    return (
        <>
            {/* The page's top cell: its background, lines and divider are there from the start, like the frame. */}
            <header id="top-nav" className="relative z-40 bg-neutral-50 px-2.5 sm:px-[60px]">
                <FrameLines />
                <div className="relative flex h-12 items-center px-3 sm:px-5 md:h-16">
                    <motion.div
                        className="md:hidden"
                        initial={false}
                        animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
                        transition={revealed ? { duration: 0.7, ease: EASE_OUT } : { duration: 0 }}
                    >
                        <Logo />
                    </motion.div>
                </div>
                <div className="line-dash-x" />
            </header>
            <DesktopNav />
        </>
    );
}

/**
 * Whether the nav should be the pill: once the hero's buttons have gone under
 * the bar, or, on a page without the hero, a little way down. It changes back
 * a little lower than it changed, so a scroll resting on the line can't flicker it.
 */
function useCompact() {
    const pathname = usePathname();
    const [compact, setCompact] = useState(false);
    useLayoutEffect(() => {
        let frame = 0;
        const check = () => {
            frame = 0;
            const buttons = document.querySelector('#hero a[href="#contact"]')?.parentElement;
            setCompact((was) => {
                if (buttons) {
                    const bottom = buttons.getBoundingClientRect().bottom;
                    return was ? bottom < BAR_H + 24 : bottom < BAR_H;
                }
                return was ? window.scrollY > 120 : window.scrollY > 160;
            });
        };
        const onScroll = () => {
            if (!frame) frame = requestAnimationFrame(check);
        };
        check();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, [pathname]);
    return compact;
}

function DesktopNav() {
    const pathname = usePathname();
    const goToSection = useGoToSection();
    const revealed = useNavReveal();
    const reduce = useReducedMotion();
    const compact = useCompact();
    const section = useActiveSection();
    const panelId = useId();

    // The viewport width (for the bar), and the pill's width from its parts.
    const [vw, setVw] = useState(0);
    const logoRef = useRef<HTMLDivElement>(null);
    const linksRef = useRef<HTMLUListElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);
    const [pillW, setPillW] = useState(600);
    useLayoutEffect(() => {
        const measure = () => {
            setVw(document.documentElement.clientWidth);
            const logo = logoRef.current?.offsetWidth ?? 120;
            const links = linksRef.current?.offsetWidth ?? 300;
            const cta = ctaRef.current?.offsetWidth ?? 104;
            setPillW(PILL_PAD.left + PILL_PAD.right + 2 * Math.max(logo, cta) + links + 2 * GAP);
        };
        measure();
        document.fonts?.ready.then(measure);
        const observer = new ResizeObserver(measure);
        for (const ref of [logoRef, linksRef, ctaRef]) if (ref.current) observer.observe(ref.current);
        window.addEventListener("resize", measure);
        return () => {
            observer.disconnect();
            window.removeEventListener("resize", measure);
        };
    }, []);

    // The shape follows `compact` straight away, with a spring. With reduced
    // motion the nav fades out, changes shape and fades back in instead.
    const [shape, setShape] = useState<"bar" | "pill">("bar");
    const [scope, animate] = useAnimate<HTMLDivElement>();
    const [instant, setInstant] = useState(true); // the first shape is applied, not animated
    useEffect(() => {
        const frame = requestAnimationFrame(() => requestAnimationFrame(() => setInstant(false)));
        return () => cancelAnimationFrame(frame);
    }, []);
    useEffect(() => {
        const next = compact ? "pill" : "bar";
        if (!reduce || instant) {
            setShape(next);
            return;
        }
        let cancelled = false;
        animate(scope.current, { opacity: 0 }, { duration: 0.12 }).then(() => {
            if (cancelled) return;
            setShape(next);
            requestAnimationFrame(() => animate(scope.current, { opacity: 1 }, { duration: 0.18 }));
        });
        return () => {
            cancelled = true;
        };
    }, [compact, reduce, instant, animate, scope]);
    const pill = shape === "pill";
    const padX = vw >= 1024 ? 23 : 19;
    const geometry = pill
        ? { width: pillW, height: PILL_H, top: PILL_TOP, borderRadius: 24, paddingLeft: PILL_PAD.left, paddingRight: PILL_PAD.right }
        : { width: vw ? vw - 2 * FRAME : "calc(100% - 122px)", height: BAR_H, top: 0, borderRadius: 0, paddingLeft: padX, paddingRight: padX };

    // While it's a bar over the page, it frosts in as the page starts to move under it.
    const { scrollY } = useScroll();
    const frost = useTransform(scrollY, [0, 40], [0, 1]);
    // How far along the bar is to being the pill (0 to 1), on the shape's own spring.
    const pillness = useMotionValue(0);
    useEffect(() => {
        const controls = animate(pillness, pill ? 1 : 0, reduce || instant ? { duration: 0 } : SPRING.morph);
        return () => controls.stop();
    }, [pill, reduce, instant, pillness]);
    const surfaceOpacity = useTransform(() => {
        const p = Math.min(1, Math.max(0, pillness.get()));
        return p + (1 - p) * frost.get();
    });
    const surfaceColor = useTransform(pillness, [0, 1], ["rgba(246, 246, 246, 0.9)", "rgba(255, 255, 255, 0.76)"]);
    const surfaceShadow = useTransform(
        pillness,
        [0, 1],
        [
            "0px 1px 0px 0px rgba(0, 0, 0, 0.06), 0px 0px 0px 0px rgba(0, 0, 0, 0)",
            "0px 0px 0px 1px rgba(0, 0, 0, 0.06), 0px 12px 32px -12px rgba(0, 0, 0, 0.22)",
        ],
    );

    const containerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (containerRef.current) containerRef.current.inert = !revealed;
    }, [revealed]);

    // Services opens on hover (with a beat of intent either way), or on click, tap and keys.
    const [open, setOpen] = useState(false);
    const [lingering, setLingering] = useState(false); // still animating closed
    const servicesRef = useRef<HTMLLIElement | null>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const openTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
    const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
    const openedAt = useRef(0);
    const pointerType = useRef("mouse");
    const pointerAt = useRef<{ x: number; y: number } | null>(null);

    const show = () => {
        clearTimeout(closeTimer.current);
        openedAt.current = performance.now();
        setLingering(true);
        setOpen(true);
    };
    const hide = () => {
        clearTimeout(openTimer.current);
        setOpen(false);
    };
    // Closed on purpose (a click, Escape, a pick): hover leaves it closed until the pointer leaves and comes back.
    const dismissed = useRef(false);
    const dismiss = () => {
        dismissed.current = true;
        hide();
    };
    // Hover opens once the pointer rests on Services (or lingers there), so
    // gliding across the nav to another link doesn't flash the menu open.
    const enteredAt = useRef(0);
    const armedAt = useRef({ x: 0, y: 0 });
    const armOpen = (e: React.PointerEvent) => {
        if (dismissed.current) return;
        // A hand resting on the mouse still twitches: that counts as resting.
        if (openTimer.current && Math.hypot(e.clientX - armedAt.current.x, e.clientY - armedAt.current.y) < 4) return;
        armedAt.current = { x: e.clientX, y: e.clientY };
        clearTimeout(openTimer.current);
        const wait = Math.min(REST_MS, Math.max(0, enteredAt.current + LINGER_MS - performance.now()));
        openTimer.current = setTimeout(show, wait);
    };
    const firstRow = () => panelRef.current?.querySelector<HTMLAnchorElement>("a")?.focus({ preventScroll: true });

    // Which item is lit: the one under the pointer, else Services while its
    // menu is open, else the section on screen. The highlight glides between them.
    const [hovered, setHovered] = useState<string | null>(null);
    const onPage = SECTIONS.some((s) => s.id === section) ? section : null;
    const lit = hovered ?? (open ? "services" : onPage);
    const items = useRef<Record<string, HTMLElement | null>>({}).current;
    const box = useGlide(lit, items);
    const [row, setRow] = useState<string | null>(null);
    const rows = useRef<Record<string, HTMLElement | null>>({}).current;
    const rowBox = useGlide(open ? row : null, rows);

    useEffect(() => {
        const note = (e: PointerEvent) => {
            pointerType.current = e.pointerType;
            pointerAt.current = e.pointerType === "mouse" ? { x: e.clientX, y: e.clientY } : null;
        };
        window.addEventListener("pointermove", note, { passive: true });
        window.addEventListener("pointerdown", note, { passive: true });
        return () => {
            window.removeEventListener("pointermove", note);
            window.removeEventListener("pointerdown", note);
        };
    }, []);

    useEffect(() => {
        if (!open) {
            setRow(null);
            // Closed under a still pointer: light whatever is really under it now.
            const at = pointerAt.current;
            const under = at ? document.elementFromPoint(at.x, at.y) : null;
            if (!under || !servicesRef.current?.contains(under)) setHovered((h) => (h === "services" ? null : h));
            return;
        }
        const onDown = (e: PointerEvent) => {
            if (!servicesRef.current?.contains(e.target as Node)) hide();
        };
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                dismiss();
                triggerRef.current?.focus();
                return;
            }
            if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
            const links = [...(panelRef.current?.querySelectorAll<HTMLAnchorElement>("a") ?? [])];
            const at = links.indexOf(document.activeElement as HTMLAnchorElement);
            if (at === -1 && document.activeElement !== triggerRef.current) return;
            e.preventDefault();
            const step = e.key === "ArrowDown" ? 1 : -1;
            links[at === -1 ? (step === 1 ? 0 : links.length - 1) : (at + step + links.length) % links.length]?.focus();
        };
        window.addEventListener("pointerdown", onDown);
        window.addEventListener("keydown", onKey);
        return () => {
            window.removeEventListener("pointerdown", onDown);
            window.removeEventListener("keydown", onKey);
        };
    }, [open]);

    useEffect(
        () => () => {
            clearTimeout(openTimer.current);
            clearTimeout(closeTimer.current);
        },
        [],
    );

    if (isNavHidden(pathname)) return null;

    const hoverable = (id: string) => ({
        ref: (el: HTMLLIElement | null) => {
            items[id] = el;
        },
        onPointerEnter: (e: React.PointerEvent) => e.pointerType === "mouse" && setHovered(id),
    });

    const sectionLink = (id: string, label: string) => (
        <li key={id} {...hoverable(id)} className="relative">
            <motion.a
                href={`/#${id}`}
                onClick={(e) => {
                    e.preventDefault();
                    goToSection(id);
                }}
                whileTap={{ scale: 0.97 }}
                transition={SPRING.press}
                aria-current={onPage === id ? "location" : undefined}
                className={`flex h-8 items-center whitespace-nowrap rounded-full px-3 text-sm font-medium transition-colors duration-200 ${linkTone(lit === id)} ${FOCUS}`}
            >
                {label}
            </motion.a>
        </li>
    );

    const rowLink = (key: string) => ({
        ref: (el: HTMLLIElement | null) => {
            rows[key] = el;
        },
    });

    return (
        <MotionConfig reducedMotion="user">
            <motion.div
                ref={containerRef}
                aria-hidden={!revealed || undefined}
                className="fixed inset-x-0 z-50 mx-auto hidden md:block"
                initial={false}
                animate={{ ...geometry, opacity: revealed ? 1 : 0, y: revealed ? 0 : -10 }}
                transition={{
                    ...(reduce || instant ? { duration: 0 } : SPRING.morph),
                    opacity: revealed ? { duration: 0.7, ease: EASE_OUT } : { duration: 0 },
                    y: revealed ? { duration: 0.7, ease: EASE_OUT } : { duration: 0 },
                }}
            >
                {/* Fills the container, padding and all; with reduced motion this is what fades. */}
                <div ref={scope} className="absolute inset-0" style={{ borderRadius: "inherit", paddingLeft: "inherit", paddingRight: "inherit" }}>
                    {/* One surface for both shapes: the bar's frosting turns into the pill's glass, so nothing shows through between them */}
                    <motion.div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 backdrop-blur-2xl backdrop-saturate-[1.6]"
                        style={{ borderRadius: "inherit", opacity: surfaceOpacity, backgroundColor: surfaceColor, boxShadow: surfaceShadow }}
                    />

                    <div className="relative grid h-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center" style={{ columnGap: GAP }}>
                        <div ref={logoRef} className="w-fit">
                            <Logo />
                        </div>

                        <nav aria-label="Main">
                            <ul ref={linksRef} className="relative flex items-center gap-0.5" onPointerLeave={() => setHovered(null)}>
                                <Glide box={box} className="rounded-full bg-black/[0.05]" />
                                {sectionLink("work", "Work")}
                                <li
                                    ref={(el) => {
                                        items.services = el;
                                        servicesRef.current = el;
                                    }}
                                    className="relative"
                                    onPointerEnter={(e) => {
                                        if (e.pointerType !== "mouse") return;
                                        setHovered("services");
                                        clearTimeout(closeTimer.current);
                                        enteredAt.current = performance.now();
                                        openTimer.current = undefined;
                                        if (!open) armOpen(e);
                                    }}
                                    onPointerMove={(e) => {
                                        if (e.pointerType === "mouse" && !open) armOpen(e);
                                    }}
                                    onPointerLeave={(e) => {
                                        if (e.pointerType !== "mouse") return;
                                        dismissed.current = false;
                                        clearTimeout(openTimer.current);
                                        closeTimer.current = setTimeout(hide, 160);
                                    }}
                                    onBlur={(e) => {
                                        if (open && !e.currentTarget.contains(e.relatedTarget as Node)) hide();
                                    }}
                                >
                                    <motion.button
                                        ref={triggerRef}
                                        type="button"
                                        aria-expanded={open}
                                        aria-controls={panelId}
                                        onClick={(e) => {
                                            const keys = e.detail === 0;
                                            // Already opened by the hover that led to this click: the click confirms it.
                                            if (open && !keys && pointerType.current === "mouse" && performance.now() - openedAt.current < 600) return;
                                            if (open) return dismiss();
                                            dismissed.current = false;
                                            show();
                                            if (keys) requestAnimationFrame(firstRow);
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key !== "ArrowDown" || open) return;
                                            e.preventDefault();
                                            show();
                                            requestAnimationFrame(firstRow);
                                        }}
                                        whileTap={{ scale: 0.97 }}
                                        transition={SPRING.press}
                                        className={`flex h-8 cursor-pointer items-center gap-1 whitespace-nowrap rounded-full pl-3 pr-2.5 text-sm font-medium transition-colors duration-200 ${linkTone(lit === "services")} ${FOCUS}`}
                                    >
                                        Services
                                        <motion.span className="inline-flex" animate={{ rotate: open ? 180 : 0 }} transition={SPRING.glide}>
                                            <ChevronDown aria-hidden className="h-3.5 w-3.5 opacity-60" strokeWidth={2.25} />
                                        </motion.span>
                                    </motion.button>

                                    {/* Grows out of the trigger. The padding bridges the gap, so the pointer can cross it. */}
                                    <div
                                        id={panelId}
                                        className="absolute left-1/2 top-full w-[360px] -translate-x-1/2 pt-3"
                                        style={{ visibility: open || lingering ? "visible" : "hidden", pointerEvents: open ? "auto" : "none" }}
                                    >
                                        <motion.div
                                            ref={panelRef}
                                            initial={false}
                                            animate={open ? "open" : "closed"}
                                            variants={MENU}
                                            onAnimationComplete={(label) => label === "closed" && setLingering(false)}
                                            style={{ originX: 0.5, originY: 0 }}
                                            className="rounded-[18px] border border-black/[0.06] bg-white/[0.8] p-1.5 shadow-[0_24px_48px_-16px_rgba(0,0,0,0.2),0_8px_20px_-10px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-xl backdrop-saturate-[1.8]"
                                        >
                                            <ul className="relative" onPointerLeave={() => setRow(null)}>
                                                <Glide box={rowBox} className="rounded-xl bg-black/[0.045]" />
                                                {SERVICES.map((service) => {
                                                    const on = open && row === service.key;
                                                    return (
                                                        <motion.li key={service.key} variants={ROW} {...rowLink(service.key)} className="relative">
                                                            <Link
                                                                href={service.href}
                                                                onClick={dismiss}
                                                                onPointerEnter={() => setRow(service.key)}
                                                                onFocus={() => setRow(service.key)}
                                                                className="flex items-center gap-3 rounded-xl p-1.5 pr-3 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#2563EB]"
                                                            >
                                                                <span className="relative h-10 w-[60px] shrink-0 overflow-hidden rounded-[9px] bg-neutral-200">
                                                                    <Image
                                                                        src={service.still}
                                                                        alt=""
                                                                        fill
                                                                        sizes="60px"
                                                                        loading="eager"
                                                                        style={{ objectPosition: service.focus }}
                                                                        className={`object-cover transition-transform duration-500 ease-out ${on ? "scale-[1.08]" : "scale-100"}`}
                                                                    />
                                                                    <span className="absolute inset-0 rounded-[9px] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]" />
                                                                </span>
                                                                <span className="min-w-0 flex-1">
                                                                    <span className="block text-sm font-medium leading-5 text-[rgba(28,28,30,0.96)]">{service.label}</span>
                                                                    <span className="block truncate text-[13px] leading-[18px] text-[rgba(28,28,30,0.5)]">{service.hint}</span>
                                                                </span>
                                                                <ArrowRight
                                                                    aria-hidden
                                                                    className={`h-3.5 w-3.5 shrink-0 text-[rgba(28,28,30,0.45)] transition-all duration-200 ${on ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0"}`}
                                                                    strokeWidth={2.25}
                                                                />
                                                            </Link>
                                                        </motion.li>
                                                    );
                                                })}
                                                <motion.li aria-hidden variants={ROW} className="mx-2.5 my-1.5 h-px bg-black/[0.07]" />
                                                <motion.li variants={ROW} {...rowLink("crypto")} className="relative">
                                                    <Link
                                                        href={CRYPTO.href}
                                                        onClick={dismiss}
                                                        onPointerEnter={() => setRow("crypto")}
                                                        onFocus={() => setRow("crypto")}
                                                        className="flex h-10 items-center gap-3 rounded-xl px-3 text-sm font-medium text-[rgba(28,28,30,0.86)] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#2563EB]"
                                                    >
                                                        <span className="flex-1">{CRYPTO.label}</span>
                                                        <ArrowRight
                                                            aria-hidden
                                                            className={`h-3.5 w-3.5 shrink-0 text-[rgba(28,28,30,0.45)] transition-all duration-200 ${open && row === "crypto" ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0"}`}
                                                            strokeWidth={2.25}
                                                        />
                                                    </Link>
                                                </motion.li>
                                                <motion.li variants={ROW} {...rowLink("asset-generator")} className="relative">
                                                    <a
                                                        href={ASSET_GENERATOR.href}
                                                        target="_blank"
                                                        rel="noopener"
                                                        title={ASSET_GENERATOR.hint}
                                                        onClick={dismiss}
                                                        onPointerEnter={() => setRow("asset-generator")}
                                                        onFocus={() => setRow("asset-generator")}
                                                        className="flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-medium text-[rgba(28,28,30,0.86)] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#2563EB]"
                                                    >
                                                        {ASSET_GENERATOR.label}
                                                        <span className="rounded-full bg-black/[0.05] px-1.5 py-px text-[11px] font-medium text-[rgba(28,28,30,0.55)]">Our app</span>
                                                        <ArrowUpRight aria-hidden className="ml-auto h-3.5 w-3.5 shrink-0 text-[rgba(28,28,30,0.45)]" strokeWidth={2.25} />
                                                    </a>
                                                </motion.li>
                                            </ul>
                                        </motion.div>
                                    </div>
                                </li>
                                {sectionLink("pricing", "Pricing")}
                                {sectionLink("faq", "FAQ")}
                            </ul>
                        </nav>

                        <div ref={ctaRef} className="w-fit justify-self-end">
                            <CallButton onGo={() => goToSection("contact")} />
                        </div>
                    </div>
                </div>
            </motion.div>
        </MotionConfig>
    );
}
