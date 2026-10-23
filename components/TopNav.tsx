"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    MotionConfig,
    animate as animateValue,
    motion,
    useAnimate,
    useMotionValue,
    useReducedMotion,
    useScroll,
    useTransform,
    type MotionValue,
} from "framer-motion";
import { ArrowRight, ArrowUpRight, ChevronDown } from "lucide-react";
import {
    ASSET_GENERATOR,
    CallButton,
    EASE_OUT,
    FOCUS,
    INDUSTRIES,
    INSIGHTS,
    PRICING,
    SERVICES,
    SPRING,
    isNavHidden,
    useCurrentItem,
    useGoToSection,
    useNavReveal,
    type NavItem,
} from "@/components/nav/shared";
import { FoldingLogo, logoWidth } from "@/components/nav/logo";

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
const PILL_PAD = { left: 14, right: 6 };
const FRAME = 61; // the frame lines sit 60px in from each side, and are 1px wide
const REST_MS = 90; // still this long on a menu's name, and its menu opens
const LINGER_MS = 500; // or on it this long, still moving

type MenuId = "services" | "industries" | "products";
const MENUS: MenuId[] = ["services", "industries", "products"];

const PANEL = {
    closed: { opacity: 0, scale: 0.94, y: -8, transition: { duration: 0.16, ease: EASE_OUT } },
    open: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", visualDuration: 0.34, bounce: 0.2, opacity: { duration: 0.14 } } },
} as const;
const ROWS = { open: { transition: { staggerChildren: 0.025, delayChildren: 0.03 } }, closed: {} } as const;
const ROW = {
    closed: { opacity: 0, y: -4, filter: "blur(3px)", transition: { duration: 0.1 } },
    open: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.3, ease: EASE_OUT } },
} as const;

const linkTone = (on: boolean) => (on ? "text-[rgba(28,28,30,0.96)]" : "text-[rgba(28,28,30,0.62)]");
const ROW_FOCUS = "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#2563EB]";
const mix = (from: number, to: number, p: number) => from + (to - from) * p;
const clamp01 = (p: number) => Math.min(1, Math.max(0, p));

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

function Logo({
    fold,
    onPointerEnter,
    onPointerLeave,
}: {
    fold?: MotionValue<number>;
    onPointerEnter?: (e: React.PointerEvent) => void;
    onPointerLeave?: (e: React.PointerEvent) => void;
}) {
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
            onPointerEnter={onPointerEnter}
            onPointerLeave={onPointerLeave}
            whileTap={{ scale: 0.97 }}
            transition={SPRING.press}
            aria-label="Blueprint Studio"
            className={`flex w-fit shrink-0 items-center rounded-md ${FOCUS}`}
        >
            <FoldingLogo fold={fold} />
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
    const current = useCurrentItem();
    const panelId = useId();

    // The viewport (for the bar), and the parts' widths (for the pill).
    const [vw, setVw] = useState(0);
    const wide = vw === 0 || vw >= 1024; // between md and lg the logo stays folded, to leave room for the links
    const gap = vw >= 1024 ? 20 : 12;
    const barPad = vw >= 1024 ? 23 : 19;
    const linksRef = useRef<HTMLUListElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);
    const [parts, setParts] = useState({ links: 440, cta: 104 });
    useLayoutEffect(() => {
        const measure = () => {
            setVw(document.documentElement.clientWidth);
            setParts({ links: linksRef.current?.offsetWidth ?? 440, cta: ctaRef.current?.offsetWidth ?? 104 });
        };
        measure();
        document.fonts?.ready.then(measure);
        const observer = new ResizeObserver(measure);
        for (const ref of [linksRef, ctaRef]) if (ref.current) observer.observe(ref.current);
        window.addEventListener("resize", measure);
        return () => {
            observer.disconnect();
            window.removeEventListener("resize", measure);
        };
    }, []);
    const barW = vw - 2 * FRAME;

    // The shape follows `compact` straight away, on a spring. With reduced
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
            // Back in once the new shape has been laid out.
            requestAnimationFrame(() => requestAnimationFrame(() => animate(scope.current, { opacity: 1 }, { duration: 0.18 })));
        });
        return () => {
            cancelled = true;
        };
    }, [compact, reduce, instant, animate, scope]);
    const pill = shape === "pill";

    // Everything about the shape comes from two springs: how far the bar is to
    // being the pill (0 to 1), and how far the logo has folded (0 to 1). The
    // width, the corners and the columns are worked out from them every frame,
    // so the parts can never get out of step.
    const pillness = useMotionValue(0);
    const morph = useRef<{ stop: () => void }>(undefined);
    const lastPill = useRef<boolean | null>(null);
    useLayoutEffect(() => {
        const first = lastPill.current === null;
        lastPill.current = pill;
        morph.current?.stop();
        if (first || reduce || instant) pillness.jump(pill ? 1 : 0);
        else morph.current = animateValue(pillness, pill ? 1 : 0, SPRING.morph);
    }, [pill, reduce, instant, pillness]);

    // The logo is open in the bar and folded in the pill, and opens while the pointer rests on it.
    const fold = useMotionValue(wide ? 0 : 1);
    const [logoHover, setLogoHover] = useState(false);
    // The bar folds it below 1024, where there's no room beside the links; the
    // pill opens it on hover wherever the opened pill still fits the window.
    const openPillFits = vw > 0 && PILL_PAD.left + PILL_PAD.right + logoWidth(0) + 2 * gap + parts.links + parts.cta <= vw - 24;
    const folded = pill ? !(logoHover && openPillFits) : !wide;
    const foldAnim = useRef<{ stop: () => void }>(undefined);
    const logoScope = useRef<HTMLDivElement>(null);
    useLayoutEffect(() => {
        foldAnim.current?.stop();
        const target = folded ? 1 : 0;
        if (instant || fold.get() === target) return fold.jump(target);
        if (reduce) {
            // A crossfade between the two, not a fold.
            fold.jump(target);
            if (logoScope.current) foldAnim.current = animateValue(logoScope.current, { opacity: [0, 1] }, { duration: 0.2 });
            return;
        }
        foldAnim.current = animateValue(fold, target, SPRING.fold);
    }, [folded, reduce, instant, fold]);

    const widthAt = (p: number, f: number) => {
        if (!vw) return 0;
        const pillW = PILL_PAD.left + PILL_PAD.right + logoWidth(f) + gap + parts.links + gap + parts.cta;
        return mix(barW, pillW, p);
    };
    const width = useTransform(() => {
        const p = pillness.get();
        const f = fold.get();
        return vw ? widthAt(p, f) : "calc(100% - 122px)";
    });
    const height = useTransform(pillness, [0, 1], [BAR_H, PILL_H], { clamp: false });
    const top = useTransform(pillness, [0, 1], [0, PILL_TOP]);
    const radius = useTransform(pillness, [0, 1], [0, 24]);
    const paddingLeft = useTransform(pillness, [0, 1], [barPad, PILL_PAD.left]);
    const paddingRight = useTransform(pillness, [0, 1], [barPad, PILL_PAD.right]);
    // The links sit in the middle of the bar (when there's room) and right after
    // the logo in the pill; the space either side always adds up to the width.
    const columns = useTransform(() => {
        const p = pillness.get();
        const f = fold.get();
        if (!vw) return "minmax(0,1fr) auto minmax(0,1fr)";
        const logo = logoWidth(f);
        const q = clamp01(p);
        const free = Math.max(0, widthAt(p, f) - mix(barPad, PILL_PAD.left, q) - mix(barPad, PILL_PAD.right, q) - parts.links - 2 * gap);
        const centred = Math.min(Math.max(free / 2, logo), Math.max(logo, free - parts.cta));
        const left = Math.max(0, mix(centred, logo, q));
        return `${left}px auto ${Math.max(0, free - left)}px`;
    });

    // While it's a bar over the page, it frosts in as the page starts to move under it.
    const { scrollY } = useScroll();
    const frost = useTransform(scrollY, [0, 40], [0, 1]);
    const surfaceOpacity = useTransform(() => {
        const p = clamp01(pillness.get());
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

    // The menus. Resting on a menu's name opens it; once one is open, moving to
    // another name swaps straight to it. Click, tap and the keys work too.
    const [menu, setMenu] = useState<MenuId | null>(null);
    const [lingering, setLingering] = useState(false); // still animating closed
    const regionRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const triggers = useRef<Record<string, HTMLButtonElement | null>>({}).current;
    const contents = useRef<Record<string, HTMLDivElement | null>>({}).current;
    const openTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
    const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
    const openedAt = useRef(0);
    const pointerType = useRef("mouse");
    const pointerAt = useRef<{ x: number; y: number } | null>(null);

    const show = (id: MenuId) => {
        clearTimeout(closeTimer.current);
        clearTimeout(openTimer.current);
        openedAt.current = performance.now();
        setLingering(true);
        setMenu(id);
    };
    const hide = () => {
        clearTimeout(openTimer.current);
        setMenu(null);
    };
    const scheduleClose = (ms = 160) => {
        clearTimeout(closeTimer.current);
        closeTimer.current = setTimeout(hide, ms);
    };
    // Closed on purpose (a click, Escape, a pick): hover leaves it closed until the pointer leaves the nav.
    const dismissed = useRef(false);
    const dismiss = () => {
        dismissed.current = true;
        hide();
    };
    const enteredAt = useRef(0);
    const armedAt = useRef({ x: 0, y: 0 });
    const armOpen = (id: MenuId, e: React.PointerEvent) => {
        if (dismissed.current) return;
        // A hand resting on the mouse still twitches: that counts as resting.
        if (openTimer.current && Math.hypot(e.clientX - armedAt.current.x, e.clientY - armedAt.current.y) < 4) return;
        armedAt.current = { x: e.clientX, y: e.clientY };
        clearTimeout(openTimer.current);
        const wait = Math.min(REST_MS, Math.max(0, enteredAt.current + LINGER_MS - performance.now()));
        openTimer.current = setTimeout(() => show(id), wait);
    };
    // Whether this event comes from the pointer moving, rather than the page moving
    // under it. React handles it before the window's listener notes the new position.
    const handMoved = (e: React.PointerEvent) => {
        const at = pointerAt.current;
        return !at || at.x !== e.clientX || at.y !== e.clientY;
    };
    const focusFirst = (id: MenuId) => contents[id]?.querySelector<HTMLAnchorElement>("a")?.focus({ preventScroll: true });

    // Which item is lit: the one under the pointer, else the open menu, else where you are.
    const [hovered, setHovered] = useState<NavItem | null>(null);
    const lit = hovered ?? menu ?? current;
    const items = useRef<Record<string, HTMLElement | null>>({}).current;
    const box = useGlide(lit, items);
    const [row, setRow] = useState<string | null>(null);
    const rows = useRef<Record<string, HTMLElement | null>>({}).current;
    const rowBox = useGlide(menu === "services" ? row : null, rows);

    // The panel: the last open menu stays in it while it closes. It's as big as
    // that menu, under its name, and springs to the next one's size and place.
    const shown = useRef<MenuId>("services");
    if (menu) shown.current = menu;
    const [sizes, setSizes] = useState<Record<MenuId, { w: number; h: number }>>({
        services: { w: 360, h: 300 },
        industries: { w: 372, h: 140 },
        products: { w: 372, h: 300 },
    });
    useLayoutEffect(() => {
        const measure = () =>
            setSizes((prev) => {
                const next = { ...prev };
                for (const id of MENUS) {
                    const el = contents[id];
                    if (el) next[id] = { w: el.offsetWidth, h: el.offsetHeight };
                }
                return next;
            });
        measure();
        document.fonts?.ready.then(measure);
    }, [contents]);
    // Only the menu on show can take focus. (Motion keeps the first ref callback
    // it's given, so this can't be done in the ref.)
    useLayoutEffect(() => {
        for (const id of MENUS) {
            const el = contents[id];
            if (el) el.inert = shown.current !== id;
        }
    }, [menu, contents]);
    const [place, setPlace] = useState({ x: 0, origin: 0.5, glide: false });
    const placedFor = useRef<MenuId | null>(null);
    useLayoutEffect(() => {
        if (!menu) {
            placedFor.current = null;
            return;
        }
        const item = items[menu]; // the trigger's list item, measured within the list
        const region = regionRef.current;
        if (!item || !region) return;
        const { w } = sizes[menu];
        const centre = item.offsetLeft + item.offsetWidth / 2;
        const left = region.getBoundingClientRect().left;
        const x = Math.min(Math.max(centre - w / 2, 12 - left), document.documentElement.clientWidth - 12 - w - left);
        // From one open menu to another it springs across; opening, it starts in place.
        const switching = placedFor.current !== null && placedFor.current !== menu;
        placedFor.current = menu;
        setPlace({ x, origin: (centre - x) / w, glide: switching });
        // Placed again when the nav changes shape under an open menu.
    }, [menu, sizes, items, pill]);

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
        if (!menu) {
            setRow(null);
            // Closed under a still pointer: light whatever is really under it now.
            const at = pointerAt.current;
            const under = at ? document.elementFromPoint(at.x, at.y) : null;
            if (!under || !regionRef.current?.contains(under)) setHovered(null);
            return;
        }
        const onDown = (e: PointerEvent) => {
            if (!regionRef.current?.contains(e.target as Node)) hide();
        };
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                dismiss();
                triggers[menu]?.focus();
                return;
            }
            if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
            const links = [...(contents[menu]?.querySelectorAll<HTMLAnchorElement>("a") ?? [])];
            const at = links.indexOf(document.activeElement as HTMLAnchorElement);
            if (at === -1 && document.activeElement !== triggers[menu]) return;
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
        // dismiss and the refs are stable for this purpose
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [menu]);

    useEffect(
        () => () => {
            clearTimeout(openTimer.current);
            clearTimeout(closeTimer.current);
        },
        [],
    );

    if (isNavHidden(pathname)) return null;

    const plainLink = (id: NavItem, label: string, href: string, onGo?: () => void) => (
        <li
            key={id}
            ref={(el) => {
                items[id] = el;
            }}
            className="relative"
            onPointerEnter={(e) => {
                if (e.pointerType !== "mouse") return;
                setHovered(id);
                if (menu) scheduleClose(140);
            }}
        >
            <MotionLink
                href={href}
                onClick={(e: React.MouseEvent) => {
                    if (!onGo) return;
                    e.preventDefault();
                    onGo();
                }}
                whileTap={{ scale: 0.97 }}
                transition={SPRING.press}
                aria-current={current === id ? "page" : undefined}
                className={`flex h-8 items-center whitespace-nowrap rounded-full px-2.5 text-sm font-medium transition-colors duration-200 lg:px-3 ${linkTone(lit === id)} ${FOCUS}`}
            >
                {label}
            </MotionLink>
        </li>
    );

    const menuTrigger = (id: MenuId, label: string) => (
        <li
            key={id}
            ref={(el) => {
                items[id] = el;
            }}
            className="relative"
            onPointerEnter={(e) => {
                if (e.pointerType !== "mouse") return;
                setHovered(id);
                clearTimeout(closeTimer.current);
                // The nav moving under a still pointer (scrolling, the bar
                // becoming the pill) isn't a hand reaching for a menu.
                const moved = handMoved(e);
                if (menu) {
                    if (menu !== id && !dismissed.current && moved) show(id);
                    return;
                }
                enteredAt.current = performance.now();
                openTimer.current = undefined;
                if (moved) armOpen(id, e);
            }}
            onPointerMove={(e) => {
                if (e.pointerType === "mouse" && !menu && handMoved(e)) armOpen(id, e);
            }}
            onPointerLeave={() => clearTimeout(openTimer.current)}
        >
            <motion.button
                ref={(el: HTMLButtonElement | null) => {
                    triggers[id] = el;
                }}
                type="button"
                aria-expanded={menu === id}
                aria-controls={`${panelId}-${id}`}
                onClick={(e) => {
                    const keys = e.detail === 0;
                    // Already opened by the hover that led to this click: the click confirms it.
                    if (menu === id && !keys && pointerType.current === "mouse" && performance.now() - openedAt.current < 600) return;
                    if (menu === id) return dismiss();
                    dismissed.current = false;
                    show(id);
                    if (keys) requestAnimationFrame(() => focusFirst(id));
                }}
                onKeyDown={(e) => {
                    if (e.key !== "ArrowDown" || menu === id) return;
                    e.preventDefault();
                    show(id);
                    requestAnimationFrame(() => focusFirst(id));
                }}
                whileTap={{ scale: 0.97 }}
                transition={SPRING.press}
                className={`flex h-8 cursor-pointer items-center gap-1 whitespace-nowrap rounded-full pl-2.5 pr-2 text-sm font-medium transition-colors duration-200 lg:pl-3 lg:pr-2.5 ${linkTone(lit === id)} ${FOCUS}`}
            >
                {label}
                <motion.span className="inline-flex" animate={{ rotate: menu === id ? 180 : 0 }} transition={SPRING.glide}>
                    <ChevronDown aria-hidden className="h-3.5 w-3.5 opacity-60" strokeWidth={2.25} />
                </motion.span>
            </motion.button>
        </li>
    );

    const order = MENUS.indexOf(shown.current);
    const content = (id: MenuId, children: React.ReactNode) => {
        const active = shown.current === id;
        const side = MENUS.indexOf(id) < order ? -1 : 1;
        return (
            <motion.div
                key={id}
                id={`${panelId}-${id}`}
                ref={(el: HTMLDivElement | null) => {
                    contents[id] = el;
                }}
                aria-hidden={!active || undefined}
                className="absolute left-0 top-0 w-max"
                initial={false}
                animate={active ? { opacity: 1, x: 0, filter: "blur(0px)" } : { opacity: 0, x: side * 16, filter: "blur(2px)" }}
                // The menu leaving goes quicker than the one arriving, so the panel is never empty between them.
                transition={{
                    ...SPRING.glide,
                    opacity: { duration: active ? 0.24 : 0.12, ease: EASE_OUT },
                    filter: { duration: active ? 0.24 : 0.12, ease: EASE_OUT },
                }}
                style={{ pointerEvents: active ? "auto" : "none" }}
            >
                <motion.div variants={ROWS} initial={false} animate={menu === id ? "open" : "closed"}>
                    {children}
                </motion.div>
            </motion.div>
        );
    };

    const size = sizes[shown.current];
    return (
        <MotionConfig reducedMotion="user">
            <motion.div
                ref={containerRef}
                aria-hidden={!revealed || undefined}
                className="fixed inset-x-0 z-50 mx-auto hidden md:block"
                style={{ width, height, top, borderRadius: radius, paddingLeft, paddingRight }}
                initial={false}
                animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : -10 }}
                transition={revealed ? { duration: 0.7, ease: EASE_OUT } : { duration: 0 }}
            >
                {/* Fills the container, padding and all; with reduced motion this is what fades. */}
                <div ref={scope} className="absolute inset-0" style={{ borderRadius: "inherit", paddingLeft: "inherit", paddingRight: "inherit" }}>
                    {/* One surface for both shapes: the bar's frosting turns into the pill's glass, so nothing shows through between them */}
                    <motion.div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 backdrop-blur-2xl backdrop-saturate-[1.6]"
                        style={{ borderRadius: "inherit", opacity: surfaceOpacity, backgroundColor: surfaceColor, boxShadow: surfaceShadow }}
                    />

                    <motion.div className="relative grid h-full items-center" style={{ gridTemplateColumns: columns, columnGap: gap }}>
                        <div ref={logoScope} className="w-fit">
                            <Logo
                                fold={fold}
                                onPointerEnter={(e) => e.pointerType === "mouse" && handMoved(e) && setLogoHover(true)}
                                onPointerLeave={() => setLogoHover(false)}
                            />
                        </div>

                        <nav aria-label="Main">
                            <div
                                ref={regionRef}
                                className="relative"
                                onPointerEnter={() => {
                                    // Coming back into the nav starts afresh, however the last menu was closed.
                                    dismissed.current = false;
                                    clearTimeout(closeTimer.current);
                                }}
                                onPointerLeave={(e) => {
                                    if (e.pointerType !== "mouse") return;
                                    dismissed.current = false;
                                    clearTimeout(openTimer.current);
                                    setHovered(null);
                                    if (menu) scheduleClose();
                                }}
                                onBlur={(e) => {
                                    if (menu && !e.currentTarget.contains(e.relatedTarget as Node)) hide();
                                }}
                            >
                                <ul ref={linksRef} className="relative flex items-center gap-0.5">
                                    <Glide box={box} className="rounded-full bg-black/[0.05]" />
                                    {plainLink("work", "Work", "/#work", () => goToSection("work"))}
                                    {menuTrigger("services", "Services")}
                                    {menuTrigger("industries", "Industries")}
                                    {menuTrigger("products", "Products")}
                                    {plainLink("insights", INSIGHTS.label, INSIGHTS.href)}
                                </ul>

                                {/* One panel for every menu. It grows out of the open menu's name, and moving to
                                    another name springs it to that menu's size and place. The padding bridges the
                                    gap, so the pointer can cross it. */}
                                {/* Shown and hidden by React straight away (not on the next animation frame), so keys can focus into it at once */}
                                <div
                                    className="absolute left-0 top-full pt-3"
                                    style={{ visibility: menu || lingering ? "visible" : "hidden", pointerEvents: menu ? "auto" : "none" }}
                                    onPointerEnter={() => clearTimeout(closeTimer.current)}
                                >
                                <motion.div
                                    initial={false}
                                    animate={{ x: place.x, width: size.w + 2 /* the border */ }}
                                    transition={place.glide ? SPRING.glide : { duration: 0 }}
                                >
                                    <motion.div
                                        ref={panelRef}
                                        initial={false}
                                        animate={menu ? "open" : "closed"}
                                        variants={PANEL}
                                        onAnimationComplete={(label) => label === "closed" && setLingering(false)}
                                        style={{ originX: place.origin, originY: 0 }}
                                        className="rounded-[18px] border border-black/[0.06] bg-white/[0.8] shadow-[0_24px_48px_-16px_rgba(0,0,0,0.2),0_8px_20px_-10px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-xl backdrop-saturate-[1.8]"
                                    >
                                        <motion.div
                                            className="relative overflow-hidden rounded-[17px]"
                                            initial={false}
                                            animate={{ height: size.h }}
                                            transition={place.glide ? SPRING.glide : { duration: 0 }}
                                        >
                                            {content(
                                                "services",
                                                <div className="w-[360px] p-1.5">
                                                    <ul className="relative" onPointerLeave={() => setRow(null)}>
                                                        <Glide box={rowBox} className="rounded-xl bg-black/[0.045]" />
                                                        {SERVICES.map((service) => {
                                                            const on = menu === "services" && row === service.key;
                                                            return (
                                                                <motion.li
                                                                    key={service.key}
                                                                    variants={ROW}
                                                                    ref={(el: HTMLLIElement | null) => {
                                                                        rows[service.key] = el;
                                                                    }}
                                                                    className="relative"
                                                                >
                                                                    <Link
                                                                        href={service.href}
                                                                        onClick={dismiss}
                                                                        onPointerEnter={() => setRow(service.key)}
                                                                        onFocus={() => setRow(service.key)}
                                                                        className={`flex items-center gap-3 rounded-xl p-1.5 pr-3 ${ROW_FOCUS}`}
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
                                                    </ul>
                                                    <motion.div variants={ROW} aria-hidden className="mx-2.5 my-1.5 h-px bg-black/[0.07]" />
                                                    <motion.div variants={ROW}>
                                                        <Link
                                                            href={`/#${PRICING.id}`}
                                                            onClick={(e) => {
                                                                dismiss();
                                                                if (pathname !== "/") return;
                                                                e.preventDefault();
                                                                goToSection(PRICING.id);
                                                            }}
                                                            className={`group flex h-9 items-center justify-between rounded-xl px-3 text-[13px] font-medium text-[rgba(28,28,30,0.55)] transition-colors hover:text-[rgba(28,28,30,0.9)] ${ROW_FOCUS}`}
                                                        >
                                                            See pricing
                                                            <ArrowRight aria-hidden className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2.25} />
                                                        </Link>
                                                    </motion.div>
                                                </div>,
                                            )}
                                            {content(
                                                "industries",
                                                <div className="w-[372px] p-1.5">
                                                    {INDUSTRIES.map((industry) => (
                                                        <motion.div key={industry.key} variants={ROW}>
                                                            <Link
                                                                href={industry.href}
                                                                onClick={dismiss}
                                                                className={`group block rounded-xl p-3 transition-colors duration-200 hover:bg-black/[0.035] ${ROW_FOCUS}`}
                                                            >
                                                                <span className="flex items-center justify-between">
                                                                    <span className="text-sm font-medium leading-5 text-[rgba(28,28,30,0.96)]">{industry.label}</span>
                                                                    <ArrowRight
                                                                        aria-hidden
                                                                        className="h-3.5 w-3.5 -translate-x-1 text-[rgba(28,28,30,0.45)] opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
                                                                        strokeWidth={2.25}
                                                                    />
                                                                </span>
                                                                <span className="mt-0.5 block text-[13px] leading-[18px] text-[rgba(28,28,30,0.5)]">{industry.line}</span>
                                                                {/* A few of the clients, in grey until the card is hovered */}
                                                                <span className="mt-3.5 flex items-center gap-6">
                                                                    {industry.logos.map((logo) => (
                                                                        <Image
                                                                            key={logo.name}
                                                                            src={logo.src}
                                                                            alt={logo.name}
                                                                            width={Math.round((logo.width * 22) / 264)}
                                                                            height={22}
                                                                            loading="eager"
                                                                            className="h-[22px] w-auto opacity-70 grayscale transition-[filter,opacity] duration-300 group-hover:opacity-100 group-hover:grayscale-0"
                                                                        />
                                                                    ))}
                                                                </span>
                                                            </Link>
                                                        </motion.div>
                                                    ))}
                                                </div>,
                                            )}
                                            {content(
                                                "products",
                                                <div className="w-[372px] p-1.5">
                                                    <motion.div variants={ROW}>
                                                        <a
                                                            href={ASSET_GENERATOR.href}
                                                            target="_blank"
                                                            rel="noopener"
                                                            onClick={dismiss}
                                                            className={`group block rounded-xl p-1.5 transition-colors duration-200 hover:bg-black/[0.035] ${ROW_FOCUS}`}
                                                        >
                                                            <span className="relative block aspect-[1248/600] overflow-hidden rounded-[10px] bg-neutral-100 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]">
                                                                <Image
                                                                    src={ASSET_GENERATOR.image}
                                                                    alt=""
                                                                    fill
                                                                    sizes="360px"
                                                                    loading="eager"
                                                                    className="object-cover object-[50%_35%] transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                                                                />
                                                            </span>
                                                            <span className="flex items-center gap-2 px-1.5 pt-2.5">
                                                                <span className="text-sm font-medium leading-5 text-[rgba(28,28,30,0.96)]">{ASSET_GENERATOR.label}</span>
                                                                <span className="rounded-full bg-black/[0.05] px-1.5 py-px text-[11px] font-medium text-[rgba(28,28,30,0.55)]">Our app</span>
                                                                <ArrowUpRight aria-hidden className="ml-auto h-3.5 w-3.5 shrink-0 text-[rgba(28,28,30,0.45)]" strokeWidth={2.25} />
                                                            </span>
                                                            <span className="block px-1.5 pb-1 text-[13px] leading-[18px] text-[rgba(28,28,30,0.5)]">{ASSET_GENERATOR.line}</span>
                                                        </a>
                                                    </motion.div>
                                                </div>,
                                            )}
                                        </motion.div>
                                    </motion.div>
                                </motion.div>
                                </div>
                            </div>
                        </nav>

                        <div ref={ctaRef} className="w-fit justify-self-end">
                            <CallButton onGo={() => goToSection("contact")} />
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </MotionConfig>
    );
}
