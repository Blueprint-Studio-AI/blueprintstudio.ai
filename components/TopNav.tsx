"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MotionConfig, motion, type Transition } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { VARIANTS, type VariantKey } from "@/components/Home/HeroSelector";
import { AssetGeneratorNavLink, isNavHidden, useGoToSection } from "@/components/FloatingNavNew";

// The nav at the top of the page. It scrolls away with the page, and from md
// up the floating pill takes over once it's gone. On phones it's a slim bar
// with the logo and the call, and the pill stays the main nav.

const GLIDE = { type: "spring", visualDuration: 0.3, bounce: 0.12 } satisfies Transition;
const PRESS = { type: "spring", visualDuration: 0.15, bounce: 0.1 } satisfies Transition;
const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const REST_MS = 90; // still this long on Services, and its menu opens
const LINGER_MS = 500; // or on it this long, still moving

// What we make: apps and websites set the hero's picker, brands and launch
// videos have their own pages.
const SERVICES = (
    [
        { key: "apps", href: "/?for=apps#work", hint: "From first sketch to launch" },
        { key: "websites", href: "/?for=websites#work", hint: "Marketing sites, designed and built" },
        { key: "brands", href: "/brand", hint: "Your brand in three weeks" },
        { key: "launch-videos", href: "/launch-videos", hint: "Your launch video in seven days" },
    ] satisfies { key: VariantKey; href: string; hint: string }[]
).map((service) => {
    const variant = VARIANTS.find((v) => v.key === service.key)!;
    return { ...service, label: variant.label, poster: variant.video.poster, picker: service.href.startsWith("/?") };
});
type Service = (typeof SERVICES)[number];

const MENU = {
    closed: { opacity: 0, scale: 0.92, y: -8, transition: { duration: 0.16, ease: EASE_OUT } },
    open: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { type: "spring", visualDuration: 0.34, bounce: 0.2, opacity: { duration: 0.14 }, staggerChildren: 0.03, delayChildren: 0.03 },
    },
} as const;
const ROW = {
    closed: { opacity: 0, y: -4, filter: "blur(3px)", transition: { duration: 0.1 } },
    open: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.3, ease: EASE_OUT } },
} as const;

const linkTone = (on: boolean) => (on ? "text-[rgba(28,28,30,0.96)]" : "text-[rgba(28,28,30,0.62)]");
const FOCUS = "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]";

type Box = { x: number; y: number; w: number; h: number; on: boolean; glide: boolean };

/**
 * Where the highlight under the active item goes. It glides from item to item,
 * fades in where the pointer first lands and fades out where it leaves.
 */
function useGlide(active: string | null, items: Record<string, HTMLElement | null>) {
    const [box, setBox] = useState<Box>({ x: 0, y: 0, w: 0, h: 0, on: false, glide: false });
    useLayoutEffect(() => {
        const el = active ? items[active] : null;
        setBox((prev) =>
            el
                ? { x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight, on: true, glide: prev.on }
                : { ...prev, on: false, glide: false },
        );
    }, [active, items]);
    return box;
}

function Glide({ box, className }: { box: Box; className: string }) {
    return (
        <motion.span
            aria-hidden
            className={`pointer-events-none absolute left-0 top-0 ${className}`}
            initial={false}
            animate={{ x: box.x, y: box.y, width: box.w, height: box.h, opacity: box.on ? 1 : 0 }}
            transition={box.glide ? GLIDE : { duration: 0, opacity: { duration: box.on ? 0.12 : 0.2, ease: EASE_OUT } }}
        />
    );
}

const MotionLink = motion.create(Link);

export function TopNav() {
    const pathname = usePathname();
    const home = pathname === "/";
    const goToSection = useGoToSection();
    const panelId = useId();

    // On the home page it waits for the opening reel to land, like the rest of the hero.
    const [landed, setLanded] = useState(false);
    useEffect(() => {
        if (!home) return;
        const land = () => setLanded(true);
        window.addEventListener("bp:opening-landing", land);
        window.addEventListener("bp:opening-landed", land);
        const fallback = setTimeout(land, 10000); // never stay hidden if the hero stops saying so
        return () => {
            window.removeEventListener("bp:opening-landing", land);
            window.removeEventListener("bp:opening-landed", land);
            clearTimeout(fallback);
            setLanded(false);
        };
    }, [home]);
    const revealed = !home || landed;
    const headerRef = useRef<HTMLElement>(null);
    useEffect(() => {
        if (headerRef.current) headerRef.current.inert = !revealed;
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

    // Which item is lit: the one under the pointer, else Services while its menu is open.
    const [hovered, setHovered] = useState<string | null>(null);
    const active = hovered ?? (open ? "services" : null);
    const items = useRef<Record<string, HTMLElement | null>>({}).current;
    const box = useGlide(active, items);
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

    const pick = (e: React.MouseEvent, service: Service) => {
        dismiss();
        // On the home page, apps and websites turn the hero to that variant in place.
        if (!home || !service.picker) return;
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("bp:variant", { detail: { key: service.key, source: "nav" } }));
        const url = new URL(window.location.href);
        url.searchParams.set("for", service.key);
        url.hash = "";
        window.history.replaceState(window.history.state, "", url);
        goToSection("hero");
    };

    if (isNavHidden(pathname)) return null;

    const hoverable = (id: string) => ({
        ref: (el: HTMLLIElement | null) => {
            items[id] = el;
        },
        onPointerEnter: (e: React.PointerEvent) => e.pointerType === "mouse" && setHovered(id),
    });

    const section = (id: string, label: string) => (
        <li {...hoverable(id)} className="relative">
            <motion.a
                href={`/#${id}`}
                onClick={(e) => {
                    e.preventDefault();
                    goToSection(id);
                }}
                whileTap={{ scale: 0.97 }}
                transition={PRESS}
                className={`flex h-8 items-center whitespace-nowrap rounded-full px-2.5 text-sm font-medium transition-colors duration-200 lg:px-3 ${linkTone(active === id)} ${FOCUS}`}
            >
                {label}
            </motion.a>
        </li>
    );

    return (
        <MotionConfig reducedMotion="user">
            <header
                ref={headerRef}
                id="top-nav"
                aria-hidden={!revealed || undefined}
                className="relative z-40 bg-neutral-50 px-2.5 sm:px-[60px]"
            >
                {/* The frame's outer lines, drawn over the bar's own background as the hero does.
                    The grid's inner lines stay hidden, so the bar reads as one cell. */}
                <div aria-hidden className="pointer-events-none absolute inset-0 flex px-2.5 sm:px-[60px]">
                    <div className="relative flex-1">
                        <div className="line-dash-y absolute bottom-0 left-0 top-0 custom:hidden" />
                        <div className="absolute bottom-0 left-0 top-0 hidden w-px bg-neutral-300 custom:block" />
                        <div className="line-dash-y absolute bottom-0 right-0 top-0 custom:hidden" />
                        <div className="absolute bottom-0 right-0 top-0 hidden w-px bg-neutral-300 custom:block" />
                    </div>
                </div>
                {/* The bar and its lines are there from the start, like the frame; what's on it arrives with the hero. */}
                <motion.div
                    initial={false}
                    animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
                    transition={revealed ? { duration: 0.7, ease: EASE_OUT } : { duration: 0 }}
                    className="relative flex h-12 items-center justify-between px-3 sm:px-5 md:grid md:h-16 md:grid-cols-[1fr_auto_1fr] lg:px-6"
                >
                    <MotionLink
                        href="/"
                        onClick={(e: React.MouseEvent) => {
                            if (!home) return;
                            e.preventDefault();
                            goToSection("hero");
                        }}
                        whileTap={{ scale: 0.97 }}
                        transition={PRESS}
                        aria-label="Blueprint Studio home"
                        className={`flex w-fit items-center rounded-md transition-opacity duration-200 hover:opacity-70 ${FOCUS}`}
                    >
                        <Image src="/blueprint-logo-dark.svg" alt="" width={120} height={16} priority className="h-[14px] w-auto md:h-4" />
                    </MotionLink>

                    <nav aria-label="Main" className="hidden md:block">
                        <ul className="relative flex items-center gap-0.5" onPointerLeave={() => setHovered(null)}>
                            <Glide box={box} className="rounded-full bg-black/[0.05]" />
                            {section("work", "Work")}
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
                                    transition={PRESS}
                                    className={`flex h-8 cursor-pointer items-center gap-1 whitespace-nowrap rounded-full pl-2.5 pr-2 text-sm font-medium transition-colors duration-200 lg:pl-3 lg:pr-2.5 ${linkTone(active === "services")} ${FOCUS}`}
                                >
                                    Services
                                    <motion.span className="inline-flex" animate={{ rotate: open ? 180 : 0 }} transition={GLIDE}>
                                        <ChevronDown aria-hidden className="h-3.5 w-3.5 opacity-60" strokeWidth={2.25} />
                                    </motion.span>
                                </motion.button>

                                {/* Grows out of the trigger. The padding bridges the gap, so the pointer can cross it. */}
                                <div
                                    id={panelId}
                                    className="absolute left-1/2 top-full w-[356px] -translate-x-1/2 pt-3"
                                    style={{ visibility: open || lingering ? "visible" : "hidden", pointerEvents: open ? "auto" : "none" }}
                                >
                                    <motion.div
                                        ref={panelRef}
                                        initial={false}
                                        animate={open ? "open" : "closed"}
                                        variants={MENU}
                                        onAnimationComplete={(label) => label === "closed" && setLingering(false)}
                                        style={{ originX: 0.5, originY: 0 }}
                                        className="rounded-[18px] border border-black/[0.06] bg-white/[0.78] p-1.5 shadow-[0_24px_48px_-16px_rgba(0,0,0,0.2),0_8px_20px_-10px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-xl backdrop-saturate-[1.8]"
                                    >
                                        <ul className="relative" onPointerLeave={() => setRow(null)}>
                                            <Glide box={rowBox} className="rounded-xl bg-black/[0.045]" />
                                            {SERVICES.map((service) => {
                                                const lit = open && row === service.key;
                                                const RowLink = service.picker ? "a" : Link;
                                                return (
                                                    <motion.li
                                                        key={service.key}
                                                        variants={ROW}
                                                        ref={(el: HTMLLIElement | null) => {
                                                            rows[service.key] = el;
                                                        }}
                                                        className="relative"
                                                    >
                                                        <RowLink
                                                            href={service.href}
                                                            onClick={(e: React.MouseEvent) => pick(e, service)}
                                                            onPointerEnter={() => setRow(service.key)}
                                                            onFocus={() => setRow(service.key)}
                                                            className={`flex items-center gap-3 rounded-xl p-1.5 pr-3 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#2563EB]`}
                                                        >
                                                            <span className="relative h-10 w-[60px] shrink-0 overflow-hidden rounded-[9px] bg-neutral-200">
                                                                <Image
                                                                    src={service.poster}
                                                                    alt=""
                                                                    fill
                                                                    sizes="60px"
                                                                    loading="eager"
                                                                    className={`object-cover transition-transform duration-500 ease-out ${lit ? "scale-[1.08]" : "scale-100"}`}
                                                                />
                                                                <span className="absolute inset-0 rounded-[9px] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]" />
                                                            </span>
                                                            <span className="min-w-0 flex-1">
                                                                <span className="block text-sm font-medium leading-5 text-[rgba(28,28,30,0.96)]">{service.label}</span>
                                                                <span className="block truncate text-[13px] leading-[18px] text-[rgba(28,28,30,0.5)]">{service.hint}</span>
                                                            </span>
                                                            <ArrowRight
                                                                aria-hidden
                                                                className={`h-3.5 w-3.5 shrink-0 text-[rgba(28,28,30,0.45)] transition-all duration-200 ${lit ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0"}`}
                                                                strokeWidth={2.25}
                                                            />
                                                        </RowLink>
                                                    </motion.li>
                                                );
                                            })}
                                        </ul>
                                    </motion.div>
                                </div>
                            </li>
                            {section("how-we-work", "How we work")}
                            {section("faq", "FAQ")}
                            <li aria-hidden className="mx-1.5 hidden h-4 w-px bg-neutral-300 lg:block" />
                            <li {...hoverable("asset-generator")} className="relative hidden lg:block">
                                <AssetGeneratorNavLink
                                    className={`flex h-8 rounded-full px-3 transition-colors duration-200 ${linkTone(active === "asset-generator")} ${FOCUS}`}
                                />
                            </li>
                        </ul>
                    </nav>

                    {/* A call with Tyler: his face on the button, so it reads as a person, not a form.
                        On a phone's home page the hero already has this button, so the bar keeps just the logo. */}
                    <motion.a
                        href="/#contact"
                        onClick={(e) => {
                            e.preventDefault();
                            goToSection("contact");
                        }}
                        whileTap={{ scale: 0.97 }}
                        transition={PRESS}
                        className={`group ${home ? "hidden md:flex" : "flex"} h-8 items-center gap-2 justify-self-end whitespace-nowrap rounded-full bg-[#1C1C1E] pl-1 pr-3 text-[13px] font-medium text-white shadow-[0_1px_2px_rgba(0,0,0,0.12),0_6px_16px_-6px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.12)] transition-colors duration-200 hover:bg-[#2C2C2E] md:h-9 md:pr-3.5 lg:h-10 lg:gap-2.5 lg:pr-4 lg:text-sm ${FOCUS}`}
                    >
                        <span className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full bg-white ring-1 ring-white/20 md:h-7 md:w-7 lg:h-8 lg:w-8">
                            <Image
                                src="/images/tyler-face.jpg"
                                alt=""
                                fill
                                sizes="64px"
                                className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.08]"
                            />
                        </span>
                        Book a call
                    </motion.a>
                </motion.div>
                <div className="line-dash-x" />
            </header>
        </MotionConfig>
    );
}
