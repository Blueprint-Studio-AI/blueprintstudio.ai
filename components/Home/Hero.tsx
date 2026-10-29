"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
    AnimatePresence,
    animate,
    motion,
    useMotionValue,
    useMotionValueEvent,
    useReducedMotion,
    useSpring,
    useTransform,
    useVelocity,
} from "framer-motion";
import { ArrowRight, Maximize2, X } from "lucide-react";
import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import { useSmoothScroll } from "@/components/SmoothScroll";
import { SpringText, VARIANTS, VariantVideo, variantFromUrl, type VariantKey } from "./HeroSelector";

// The opening: a short loader, then the reel plays full screen for a moment
// and lands in its place under the headline. Nothing waits for a scroll.
//
// There's one <video>. Its frame is position: fixed while it's away from its
// slot, placed every frame between the full-screen card (progress 0) and the
// slot's live rect (progress 1), so it lands where the slot is even if the
// visitor scrolls mid-flight. Once it lands it sits in the slot like any
// other element. "View fullscreen" runs the same path backwards.

const REEL_SRC = {
    full: "/media/highlight-reel/highlight-reel-horizontal-005-compressed.mp4",
    // A 2:3 reel for phones, cut from the projects' own vertical edits.
    small: "/media/highlight-reel/highlight-reel-mobile-2x3.mp4",
};
const LOADER_MIN_MS = 2400; // from the loader's first frame: long enough to read its line
const VIDEO_FALLBACK_MS = 6000; // land anyway if the reel is slow to load
const REEL_HOLD_MS = 1400; // full-screen beat before it lands (the phone reel)
// Nick's reel opens on a flash of work, then the logo: its ring at 3.5s, and the
// word fully in at 5.5s, held till 7s. Up to then it plays a touch fast, and the
// reel starts down onto the page as the word lands; after, and on every loop, it
// plays at its own speed. It follows the film, not a clock, so a slow connection
// can't start it down mid-logo; `maxMs` lands it anyway if the film stalls.
const OPENING = { rate: 1.5, land: 5.5, maxMs: 6000 };
const CARD_RADIUS = 16;
const SLOT_RADIUS = 12;
const LAND = { type: "spring", visualDuration: 0.9, bounce: 0.12 } as const;
const LIFT = { type: "spring", visualDuration: 0.6, bounce: 0.08 } as const;
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

type Stage = "loading" | "reel" | "landing" | "docked" | "expanded" | "closing";

const mix = (from: number, to: number, p: number) => from + (to - from) * p;

// The second button's link for each variant.
const LINKS = [{ key: "all", label: "See our work", href: "#work" }, ...VARIANTS.map((v) => ({ key: v.key, ...v.cta }))];

/** False once the home page has mounted in this tab. */
let firstLoad = true;

/** The loader card's inset: inset-4 / sm:inset-8 / lg:inset-12. */
const cardInset = (width: number) => (width >= 1024 ? 48 : width >= 640 ? 32 : 16);

export default function Hero() {
    const reduceMotion = useReducedMotion();
    const { scroll } = useSmoothScroll();
    const [stage, setStageState] = useState<Stage>("loading");
    const stageRef = useRef<Stage>("loading");
    const setStage = useCallback((next: Stage) => {
        stageRef.current = next;
        setStageState(next);
    }, []);

    const [src, setSrc] = useState<string>();
    const [variantKey, setVariantKey] = useState<VariantKey | null>(null);
    const variant = VARIANTS.find((v) => v.key === variantKey) ?? null;
    const [hasFrame, setHasFrame] = useState(false);
    const [videoReady, setVideoReady] = useState(false);
    const [minTimeElapsed, setMinTimeElapsed] = useState(false);
    const loaderShownAt = useRef<number>(undefined);

    const videoRef = useRef<HTMLVideoElement>(null);
    const frameRef = useRef<HTMLDivElement>(null);
    const slotRef = useRef<HTMLDivElement>(null);
    const maximizeRef = useRef<HTMLButtonElement>(null);
    const refocusRef = useRef(false);
    const progress = useMotionValue(0); // 0 = full-screen card, 1 = in its slot
    const backdropOpacity = useTransform(progress, [0, 1], [1, 0]);

    // Place the frame for the current stage and progress.
    const place = useCallback(() => {
        const frame = frameRef.current;
        const slot = slotRef.current;
        if (!frame || !slot) return;
        const s = frame.style;
        if (stageRef.current === "docked") {
            s.position = "absolute";
            s.left = "0px";
            s.top = "0px";
            s.width = "100%";
            s.height = "100%";
            s.borderRadius = `${SLOT_RADIUS}px`;
            return;
        }
        const p = progress.get();
        const to = slot.getBoundingClientRect();
        const vw = document.documentElement.clientWidth;
        const vh = document.documentElement.clientHeight;
        const inset = cardInset(vw);
        s.position = "fixed";
        s.left = `${mix(inset, to.left, p)}px`;
        s.top = `${mix(inset, to.top, p)}px`;
        s.width = `${mix(vw - inset * 2, to.width, p)}px`;
        s.height = `${mix(vh - inset * 2, to.height, p)}px`;
        s.borderRadius = `${mix(CARD_RADIUS, SLOT_RADIUS, p)}px`;
    }, [progress]);

    useMotionValueEvent(progress, "change", place);
    useLayoutEffect(place, [place, stage]);

    useEffect(() => {
        window.addEventListener("resize", place);
        return () => window.removeEventListener("resize", place);
    }, [place]);

    // A link like /?for=websites opens on that variant.
    useEffect(() => {
        setVariantKey(variantFromUrl());
    }, []);

    // Other sections (Featured Work) follow the picker, and can set it:
    // window "bp:variant" events carry { key, source }.
    useEffect(() => {
        const onVariant = (e: Event) => {
            const { key, source } = (e as CustomEvent<{ key: VariantKey | null; source: string }>).detail;
            if (source !== "hero") setVariantKey(key);
        };
        window.addEventListener("bp:variant", onVariant);
        return () => window.removeEventListener("bp:variant", onVariant);
    }, []);

    const chooseVariant = (key: VariantKey | null) => {
        setVariantKey(key);
        window.dispatchEvent(new CustomEvent("bp:variant", { detail: { key, source: "hero" } }));
        const url = new URL(window.location.href);
        if (key) url.searchParams.set("for", key);
        else url.searchParams.delete("for");
        window.history.replaceState(window.history.state, "", url);
        (window as { gtag?: (...args: unknown[]) => void }).gtag?.("event", "hero_variant", { variant: key ?? "everything" });
    };

    // The full reel, or the 2:3 phone reel, which suits the phone's 4:5 frame.
    useEffect(() => {
        const query = window.matchMedia("(min-width: 640px)");
        const pick = () => setSrc(query.matches ? REEL_SRC.full : REEL_SRC.small);
        pick();
        query.addEventListener("change", pick);
        return () => query.removeEventListener("change", pick);
    }, []);

    // A new src (first load, or crossing 640px) reloads and pauses the video:
    // cover it until its first frame, and keep it playing once the loader's gone.
    useEffect(() => {
        const video = videoRef.current;
        if (!video || !src) return;
        video.setAttribute("fetchpriority", "high");
        setHasFrame(false);
        const frame = () => setHasFrame(true);
        let resumed = false; // only the first canplay after a swap; later ones are seeks
        const playable = () => {
            setVideoReady(true);
            if (resumed) return;
            resumed = true;
            if (stageRef.current !== "loading") video.play().catch(() => {});
        };
        video.addEventListener("loadeddata", frame);
        video.addEventListener("canplay", playable);
        if (video.readyState >= 2) frame();
        if (video.readyState >= 3) playable();
        const fallback = setTimeout(() => setVideoReady(true), VIDEO_FALLBACK_MS);
        return () => {
            video.removeEventListener("loadeddata", frame);
            video.removeEventListener("canplay", playable);
            clearTimeout(fallback);
        };
    }, [src]);

    // The loader animates in CSS from the first paint, so its minimum time
    // counts from then (or from now, after a client-side navigation here).
    useEffect(() => {
        if (reduceMotion) {
            setMinTimeElapsed(true);
            return;
        }
        if (loaderShownAt.current === undefined) {
            const paint = firstLoad ? performance.getEntriesByName("first-contentful-paint")[0]?.startTime : undefined;
            loaderShownAt.current = paint ?? performance.now();
            firstLoad = false;
        }
        const wait = loaderShownAt.current + LOADER_MIN_MS - performance.now();
        const timer = setTimeout(() => setMinTimeElapsed(true), Math.max(0, wait));
        return () => clearTimeout(timer);
    }, [reduceMotion]);

    // Loader done: the reel takes the screen. With reduced motion, or for a
    // visitor who arrived further down the page (/#pricing), it's simply in place.
    useEffect(() => {
        if (stage !== "loading" || !videoReady || !minTimeElapsed) return;
        const opening = !reduceMotion && window.scrollY <= 100;
        if (opening && src === REEL_SRC.full && videoRef.current) videoRef.current.playbackRate = OPENING.rate;
        videoRef.current?.play().catch(() => {});
        if (!opening) {
            progress.set(1);
            setStage("docked");
        } else {
            setStage("reel");
        }
    }, [stage, videoReady, minTimeElapsed, reduceMotion, progress, setStage, src]);

    // Once the reel is in place, the portfolio videos below can start loading.
    useEffect(() => {
        if (stage === "docked") window.dispatchEvent(new Event("bp:opening-landed"));
    }, [stage]);

    const land = useCallback(() => {
        if (stageRef.current !== "reel") return;
        // The top nav arrives with the reel, not after it.
        window.dispatchEvent(new Event("bp:opening-landing"));
        setStage("landing");
        animate(progress, 1, LAND).then(() => {
            if (stageRef.current === "landing") setStage("docked");
        });
    }, [progress, setStage]);

    // Hold the reel for a beat (the full reel: till its logo is in), or land
    // straight away if the visitor scrolls or presses a key.
    useEffect(() => {
        if (stage !== "reel") return;
        const video = videoRef.current;
        const film = src === REEL_SRC.full && video;
        let tick = 0;
        const follow = () => {
            if (!film) return;
            if (film.currentTime < OPENING.land) {
                tick = requestAnimationFrame(follow);
                return;
            }
            film.playbackRate = 1;
            land();
        };
        follow();
        const hold = setTimeout(land, film ? OPENING.maxMs : REEL_HOLD_MS);
        const now = () => land();
        window.addEventListener("wheel", now, { passive: true });
        window.addEventListener("touchmove", now, { passive: true });
        window.addEventListener("keydown", now);
        return () => {
            cancelAnimationFrame(tick);
            clearTimeout(hold);
            window.removeEventListener("wheel", now);
            window.removeEventListener("touchmove", now);
            window.removeEventListener("keydown", now);
        };
    }, [stage, land, src]);

    // From the keyboard, focus moves to Close; from a click it stays put.
    const [focusClose, setFocusClose] = useState(false);
    const expand = useCallback((fromKeyboard: boolean) => {
        if (stageRef.current !== "docked") return;
        setFocusClose(fromKeyboard);
        setStage("expanded");
        if (reduceMotion) progress.set(0);
        else animate(progress, 0, LIFT);
    }, [progress, setStage, reduceMotion]);

    const collapse = useCallback(() => {
        if (stageRef.current !== "expanded") return;
        // Focus was in the fullscreen reel (keyboard): hand it back to the button that opened it.
        refocusRef.current = frameRef.current?.contains(document.activeElement) ?? false;
        const dock = () => {
            if (stageRef.current === "closing") setStage("docked");
        };
        setStage("closing");
        if (reduceMotion) {
            progress.set(1);
            dock();
        } else {
            animate(progress, 1, LAND).then(dock);
        }
    }, [progress, setStage, reduceMotion]);

    useEffect(() => {
        if (stage !== "docked" || !refocusRef.current) return;
        refocusRef.current = false;
        maximizeRef.current?.focus({ preventScroll: true });
    }, [stage]);

    useEffect(() => {
        if (stage !== "expanded") return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && collapse();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [stage, collapse]);

    // No scrolling under the loader or the fullscreen reel.
    const locked = stage === "loading" || stage === "expanded";
    useEffect(() => {
        document.body.style.overflow = locked ? "hidden" : "";
        if (locked) scroll?.stop();
        else scroll?.start();
        place(); // the scrollbar coming or going changes the viewport width
        return () => {
            document.body.style.overflow = "";
            // Leaving the page mid-intro mustn't leave the next one unscrollable.
            if (locked) scroll?.start();
        };
    }, [locked, scroll, place]);

    const revealed = stage !== "loading" && stage !== "reel";
    const link = LINKS.find((l) => l.key === (variant?.key ?? "all"))!;
    const fullscreen = stage === "expanded" || stage === "closing";
    // Above the top nav while the reel is a full-screen card, so the bar never cuts
    // across its rounded top; the nav arrives as it lands.
    const raised = fullscreen || stage === "reel" || stage === "landing";

    const scrollToId = (id: string) => {
        const element = document.getElementById(id);
        if (!element) return;
        if (scroll) scroll.scrollTo(element, { offset: -80, duration: 1.2 });
        else window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
    };

    const rise = (delay: number) => ({
        initial: { opacity: 0, y: 16, filter: "blur(8px)" },
        animate: revealed ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined,
        transition: reduceMotion ? { duration: 0 } : { duration: 0.7, ease: EASE_OUT, delay },
    });

    return (
        <>
            <AnimatePresence>
                {stage === "loading" && (
                    <motion.div
                        key="loader"
                        className="fixed inset-0 z-[100] bg-neutral-50"
                        exit={{ opacity: 0, transition: { duration: 0.45, ease: EASE_OUT } }}
                    >
                        <div
                            className="loader-fade absolute inset-4 flex items-center justify-center overflow-hidden rounded-2xl sm:inset-8 lg:inset-12"
                            style={{ animationDuration: "400ms" }}
                        >
                            <div
                                className="loader-fade absolute inset-0 rounded-2xl"
                                style={{
                                    backgroundColor: "#FBFBFB",
                                    animationDuration: "800ms",
                                    animationDelay: "1100ms",
                                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.03), 0 4px 16px rgba(0, 0, 0, 0.015)",
                                }}
                            />
                            <div className="relative z-10 flex flex-col items-center">
                                <Image
                                    src="/blueprint-logo-dark.svg"
                                    alt="Blueprint Studio"
                                    width={30}
                                    height={30}
                                    className="loader-fade mb-6 h-6 w-auto sm:mb-8 sm:h-7"
                                    style={{ animationDuration: "700ms", animationDelay: "150ms" }}
                                    priority
                                />
                                <p className="cursor-default text-center text-2xl font-medium leading-relaxed text-neutral-700 sm:text-4xl">
                                    {["We partner with founders", "to build their future"].map((line, l) => (
                                        <span key={line} className={l === 0 ? "mb-1 block" : "block"}>
                                            {line.split(" ").map((word, i) => (
                                                <span
                                                    key={i}
                                                    className="loader-word mr-1 inline-block"
                                                    style={{ animationDelay: `${300 + l * 240 + i * 60}ms` }}
                                                >
                                                    {word}
                                                </span>
                                            ))}
                                        </span>
                                    ))}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Section
                className={`relative ${raised ? "z-[60]" : "z-20"} min-h-[calc(100svh-48px)] justify-between overflow-hidden bg-neutral-50 md:min-h-[calc(100svh-64px)]`}
            >
                {/* Artificial vertical lines to match the background */}
                <div className="pointer-events-none absolute inset-0 flex justify-center px-2.5 sm:px-[60px]">
                    <div className="relative flex w-full flex-1 justify-center">
                        <div className="line-dash-y absolute bottom-0 left-0 top-0 custom:hidden" />
                        <div className="absolute bottom-0 left-0 top-0 hidden w-px bg-neutral-300 custom:block" />
                        <div className="line-dash-y absolute bottom-0 right-0 top-0 custom:hidden" />
                        <div className="absolute bottom-0 right-0 top-0 hidden w-px bg-neutral-300 custom:block" />
                    </div>
                </div>

                <OuterContainer className="flex w-full flex-1 items-center justify-center">
                    <InnerContainer className="relative flex w-full flex-col items-center justify-center px-6 lg:justify-start pb-6 pt-10 sm:px-10 sm:pb-8 sm:pt-8 lg:px-16">
                        {/* Inner dashed vertical lines on desktop */}
                        <div className="line-dash-y absolute bottom-0 left-0 top-0 hidden custom:block" />
                        <div className="line-dash-y absolute bottom-0 right-0 top-0 hidden custom:block" />

                        {/* As wide as the reel's slot below, so the statement and the frame share a left edge. */}
                        <div className="flex w-full flex-col items-start text-left sm:w-[min(100%,max(480px,calc((100svh-390px)*16/9)))]">
                            <motion.h1
                                {...rise(0.15)}
                                className="cursor-default font-medium text-neutral-800"
                                style={{ fontSize: "clamp(24px, 2.5vw, 36px)", lineHeight: 1.16, letterSpacing: "-0.025em", textWrap: "pretty" }}
                            >
                                <Statement revealed={revealed} value={variantKey} onPick={chooseVariant} />
                            </motion.h1>
                            <motion.div
                                {...rise(0.35)}
                                className="mt-7 flex w-full max-w-[340px] flex-col gap-3 sm:max-w-none sm:flex-row sm:items-center"
                            >
                                <motion.a
                                    href="#contact"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        scrollToId("contact");
                                    }}
                                    whileTap={{ scale: 0.97 }}
                                    className="flex h-12 shrink-0 whitespace-nowrap items-center justify-center gap-2.5 rounded-full pl-1.5 pr-6 text-[15px] font-medium text-white sm:justify-self-end"
                                    style={{
                                        background: "linear-gradient(135deg, #60AEEE 0%, #3B82F6 25%, #2563EB 50%, #1D4ED8 75%, #4F46E5 100%)",
                                        boxShadow:
                                            "0 1px 2px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(96, 174, 238, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1) inset, 0 1px 0 rgba(255, 255, 255, 0.2) inset",
                                        textShadow: "0 1px 2px rgba(0, 0, 0, 0.2)",
                                    }}
                                >
                                    <Image
                                        src="/images/tyler-face.jpg"
                                        alt=""
                                        width={36}
                                        height={36}
                                        className="h-9 w-9 rounded-full object-cover ring-2 ring-white/35"
                                    />
                                    Book a call with Tyler
                                </motion.a>
                                <motion.a
                                    href={link.href}
                                    onClick={(e) => {
                                        if (!link.href.startsWith("#")) return;
                                        e.preventDefault();
                                        scrollToId(link.href.slice(1));
                                    }}
                                    whileTap={{ scale: 0.97 }}
                                    className="group flex h-12 shrink-0 whitespace-nowrap items-center justify-center rounded-full border border-neutral-300 bg-white px-6 text-[15px] font-medium text-neutral-800 transition-colors hover:border-neutral-400 sm:justify-self-start"
                                >
                                    {/* Springs to each label, growing away from "Book a call", which never moves. */}
                                    <SpringText text={link.label} />
                                    <ArrowRight
                                        aria-hidden
                                        className="ml-1.5 h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                                    />
                                </motion.a>
                                <HeroLogos />
                            </motion.div>
                        </div>

                        {/* The reel's slot: as big as fits between the copy and the floating nav */}
                        <div
                            ref={slotRef}
                            className="relative mt-8 aspect-[4/5] w-full sm:aspect-video sm:w-[min(100%,max(480px,calc((100svh-390px)*16/9)))]"
                        >
                            <div
                                ref={frameRef}
                                className={`group absolute inset-0 overflow-hidden ${stage === "docked" ? "sm:cursor-zoom-in" : ""}`}
                                // The mask keeps Safari from drawing the video past the rounded corners.
                                style={{ borderRadius: SLOT_RADIUS, zIndex: 2, WebkitMaskImage: "-webkit-radial-gradient(white, black)" }}
                                role={fullscreen ? "dialog" : undefined}
                                aria-modal={fullscreen || undefined}
                                aria-label={fullscreen ? "Showreel" : undefined}
                                onClick={() => {
                                    if (stage === "expanded") collapse();
                                    else if (window.innerWidth >= 640) expand(false);
                                }}
                            >
                                <div
                                    className="pointer-events-none absolute inset-0"
                                    style={{
                                        backgroundColor: "#FBFBFB",
                                        opacity: hasFrame ? 0 : 1,
                                        transition: "opacity 400ms cubic-bezier(.25, .46, .45, .94)",
                                    }}
                                />
                                <video
                                    ref={videoRef}
                                    src={src}
                                    className="absolute inset-0 h-full w-full object-cover"
                                    style={{ opacity: hasFrame ? 1 : 0, transition: "opacity 300ms cubic-bezier(.16, 1, .3, 1)" }}
                                    loop
                                    muted
                                    playsInline
                                    preload="auto"
                                    onTimeUpdate={(e) => {
                                        const v = e.currentTarget;
                                        // After an early landing (a scroll), the rest still plays at its own speed.
                                        if (v.playbackRate !== 1 && v.currentTime >= OPENING.land) v.playbackRate = 1;
                                    }}
                                />
                                <AnimatePresence>
                                    {variant && src && <VariantVideo key={variant.key} {...variant.video} compact={src === REEL_SRC.small} />}
                                </AnimatePresence>
                                {/* A hairline edge, so pale frames don't melt into the page. */}
                                <div className="pointer-events-none absolute inset-0 z-[1] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]" style={{ borderRadius: "inherit" }} />

                                {stage === "docked" && (
                                    <button
                                        ref={maximizeRef}
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            expand(e.detail === 0); // detail 0: Enter or Space, not a click
                                        }}
                                        className="absolute right-3 top-3 hidden h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur-lg transition-all duration-200 hover:bg-black/60 focus-visible:opacity-100 group-hover:opacity-100 sm:flex"
                                        aria-label="View fullscreen"
                                    >
                                        <Maximize2 className="h-3.5 w-3.5" />
                                    </button>
                                )}
                                <AnimatePresence>
                                    {stage === "expanded" && (
                                        <motion.button
                                            type="button"
                                            autoFocus={focusClose}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1, transition: { delay: 0.2, duration: 0.25 } }}
                                            exit={{ opacity: 0, transition: { duration: 0.15 } }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                collapse();
                                            }}
                                            className="absolute right-3 top-3 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-lg transition-colors duration-200 hover:bg-black/60"
                                            aria-label="Close fullscreen"
                                        >
                                            <X className="h-5 w-5" />
                                        </motion.button>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </InnerContainer>
                </OuterContainer>

                {fullscreen && (
                    <motion.div
                        className="fixed inset-0 z-[1] bg-black/90 backdrop-blur-md"
                        style={{ opacity: backdropOpacity }}
                        onClick={collapse}
                    />
                )}
            </Section>
        </>
    );
}

// A quiet row of clients beside the buttons, so there's proof on the first
// screen without shrinking the reel. Each slot cycles through its own clients,
// one slot after another, through a soft blur. Slots have a fixed width so the
// row never shifts; one that doesn't fit wraps onto a hidden second line, so
// only whole slots show. Logo files sit on a 264px-tall canvas (see
// ClientLogoTicker), so one height gives them all the same weight.
const HERO_LOGO_SLOTS: { name: string; logo: string; w: number; tone?: number }[][] = [
    [
        { name: "TokenWorks", logo: "tokenworks", w: 636 },
        { name: "Logical", logo: "logical", w: 580 },
        { name: "Bitfrost", logo: "bitfrost", w: 526 },
    ],
    [
        { name: "Arch Network", logo: "arch-network", w: 518 },
        { name: "Pyra", logo: "pyra", w: 476 },
        { name: "Twelve", logo: "twelve", w: 568 },
    ],
    [
        { name: "Jinba", logo: "jinba", w: 561 },
        // HoneyB's orange turns pale in grey; darken it to match the others.
        { name: "HoneyB", logo: "honeyb", w: 630, tone: 0.55 },
        { name: "Reshift", logo: "reshift", w: 461 },
    ],
    [
        { name: "Perena", logo: "perena", w: 682 },
        { name: "LivingIP", logo: "livingip", w: 603 },
        { name: "Bold", logo: "bold", w: 540 },
    ],
];
const HERO_LOGO_HEIGHT = 34;
const HERO_LOGO_SLOT = 84; // Perena, the widest, overhangs by 2px a side: the gap, and the row's own padding at the end, keep it whole
const HERO_LOGO_EVERY_MS = 3200;
const HERO_LOGO_STAGGER = 0.09;

function HeroLogos() {
    const reduceMotion = useReducedMotion();
    const rowRef = useRef<HTMLDivElement>(null);
    const [turn, setTurn] = useState(0);
    const [paused, setPaused] = useState(false);
    const [inView, setInView] = useState(true);
    useEffect(() => {
        const row = rowRef.current;
        if (!row) return;
        const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
        observer.observe(row);
        return () => observer.disconnect();
    }, []);
    useEffect(() => {
        if (reduceMotion || paused || !inView) return;
        const timer = setInterval(() => {
            if (!document.hidden) setTurn((t) => t + 1);
        }, HERO_LOGO_EVERY_MS);
        return () => clearInterval(timer);
    }, [reduceMotion, paused, inView]);

    return (
        <div
            ref={rowRef}
            className="ml-auto hidden min-w-0 flex-wrap items-center justify-end gap-x-2.5 overflow-hidden px-1 lg:flex"
            style={{ height: HERO_LOGO_HEIGHT }}
            onPointerEnter={() => setPaused(true)}
            onPointerLeave={() => setPaused(false)}
        >
            <span className="mr-1 whitespace-nowrap text-[13px] text-neutral-400">Trusted by</span>
            {HERO_LOGO_SLOTS.map((slot, i) => {
                const c = slot[turn % slot.length];
                return (
                    <div key={i} className="relative shrink-0" style={{ width: HERO_LOGO_SLOT, height: HERO_LOGO_HEIGHT }}>
                        <AnimatePresence initial={false}>
                            <motion.img
                                key={c.logo}
                                src={`/logos-match-height/${c.logo}.png`}
                                alt={c.name}
                                width={Math.round((HERO_LOGO_HEIGHT * c.w) / 264)}
                                height={HERO_LOGO_HEIGHT}
                                className="absolute inset-0 m-auto"
                                style={{ height: HERO_LOGO_HEIGHT, width: "auto", maxWidth: "none" }}
                                initial={{ opacity: 0, filter: `grayscale(1) brightness(${c.tone ?? 1}) blur(8px)`, y: 5 }}
                                animate={{ opacity: 0.45, filter: `grayscale(1) brightness(${c.tone ?? 1}) blur(0px)`, y: 0 }}
                                exit={{ opacity: 0, filter: `grayscale(1) brightness(${c.tone ?? 1}) blur(8px)`, y: -5 }}
                                transition={{ duration: 0.7, ease: EASE_OUT, delay: i * HERO_LOGO_STAGGER }}
                            />
                        </AnimatePresence>
                    </div>
                );
            })}
        </div>
    );
}

// The statement: the first sentence in ink and the rest in grey. What
// we make doubles as the picker: each word switches the reel. On a desktop,
// resting on a word floats a still of that work by the cursor. Words darken
// into place once the reel has landed.
const LEAD = "The design and build partner for founders.";
const TAIL = "from first sketch to launch.";
const PEEK_FOLLOW = { stiffness: 380, damping: 30, mass: 0.6 };
const PEEK_HIDE_MS = 140; // long enough to cross the gap between two words

function Statement({ revealed, value, onPick }: { revealed: boolean; value: VariantKey | null; onPick: (key: VariantKey | null) => void }) {
    const reduceMotion = useReducedMotion();
    let index = 0;
    const words = (text: string, ink: boolean) =>
        text.split(/(\s+)/).map((word, w) => {
            if (!word.trim()) return word;
            const delay = 0.2 + index++ * 0.025;
            return (
                <motion.span
                    key={`${text}-${w}`}
                    initial={{ color: "#D4D4D4" }}
                    animate={revealed ? { color: ink ? "#1C1C1E" : "#9A9AA0" } : undefined}
                    transition={reduceMotion ? { duration: 0 } : { duration: 0.6, ease: EASE_OUT, delay }}
                >
                    {word}
                </motion.span>
            );
        });

    // The peek: only where there's a real hover, so phones just tap the words.
    const [canHover, setCanHover] = useState(false);
    useEffect(() => {
        const query = window.matchMedia("(hover: hover) and (pointer: fine)");
        const update = () => setCanHover(query.matches);
        update();
        query.addEventListener("change", update);
        return () => query.removeEventListener("change", update);
    }, []);
    const [peek, setPeek] = useState<VariantKey | null>(null);
    const peekShown = useRef(false);
    const hideTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
    const pointerX = useMotionValue(0);
    const pointerY = useMotionValue(0);
    const x = useSpring(pointerX, PEEK_FOLLOW);
    const y = useSpring(pointerY, PEEK_FOLLOW);
    // It leans the way it's travelling and settles when the cursor stops.
    const lean = useTransform(useVelocity(x), [-1400, 0, 1400], [-8, 0, 8], { clamp: true });
    const follow = useCallback(
        (e: PointerEvent | React.PointerEvent) => {
            pointerX.set(e.clientX);
            pointerY.set(e.clientY);
            if (!peekShown.current || reduceMotion) {
                x.jump(e.clientX);
                y.jump(e.clientY);
            }
        },
        [pointerX, pointerY, x, y, reduceMotion],
    );
    useEffect(() => {
        peekShown.current = peek !== null;
        if (!peek) return;
        window.addEventListener("pointermove", follow, { passive: true });
        return () => window.removeEventListener("pointermove", follow);
    }, [peek, follow]);
    useEffect(() => () => clearTimeout(hideTimer.current), []);
    const showPeek = (key: VariantKey, e: React.PointerEvent) => {
        if (!canHover || e.pointerType !== "mouse") return;
        clearTimeout(hideTimer.current);
        follow(e);
        setPeek(key);
    };
    const hidePeek = () => {
        clearTimeout(hideTimer.current);
        hideTimer.current = setTimeout(() => setPeek(null), PEEK_HIDE_MS);
    };

    return (
        <>
            {words(LEAD, true)} {words("We make", false)}{" "}
            {VARIANTS.map((v, i) => {
                const active = value === v.key;
                const delay = 0.2 + index++ * 0.025;
                // Each word keeps its comma, so a comma never starts a line.
                const comma = i !== VARIANTS.length - 2;
                return (
                    <span key={v.key}>
                        <span className="whitespace-nowrap">
                            <button
                                type="button"
                                onClick={() => onPick(active ? null : v.key)}
                                onPointerEnter={(e) => showPeek(v.key, e)}
                                onPointerLeave={hidePeek}
                                aria-pressed={active}
                                className="group/word cursor-pointer whitespace-nowrap rounded-[0.14em] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
                            >
                                <motion.span
                                    className={`underline underline-offset-[0.14em] transition-[text-decoration-color] duration-200 ${
                                        active ? "decoration-[#1C1C1E] decoration-[0.06em]" : "decoration-transparent decoration-dotted decoration-[0.06em] group-hover/word:decoration-[#9A9AA0]"
                                    }`}
                                    initial={{ color: "#D4D4D4" }}
                                    animate={revealed ? { color: active ? "#1C1C1E" : "#6B6B70" } : undefined}
                                    transition={reduceMotion ? { duration: 0 } : { duration: 0.6, ease: EASE_OUT, delay: active ? 0 : delay }}
                                >
                                    {v.word}
                                </motion.span>
                            </button>
                            {comma && words(",", false)}
                        </span>
                        {comma ? " " : <> {words("and", false)} </>}
                    </span>
                );
            })}
            {words(TAIL, false)}
            {canHover &&
                revealed &&
                createPortal(
                    <motion.div aria-hidden className="pointer-events-none fixed left-0 top-0 z-[65]" style={{ x, y, rotate: reduceMotion ? 0 : lean }}>
                        <motion.div
                            className="relative ml-4 mt-5 aspect-[3/2] w-[176px] overflow-hidden rounded-[10px] bg-[#FAFAFA] shadow-[0_18px_40px_-14px_rgba(0,0,0,0.4),0_0_0_1px_rgba(0,0,0,0.06)]"
                            style={{ transformOrigin: "0% 0%" }}
                            initial={false}
                            animate={peek ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                            transition={reduceMotion ? { duration: 0.15 } : { type: "spring", visualDuration: 0.35, bounce: 0.25 }}
                        >
                            {VARIANTS.map((v) => (
                                <motion.img
                                    key={v.key}
                                    src={v.peek}
                                    alt=""
                                    className="absolute inset-0 h-full w-full object-cover"
                                    initial={false}
                                    animate={{ opacity: peek === v.key ? 1 : 0 }}
                                    transition={{ duration: 0.2, ease: EASE_OUT }}
                                />
                            ))}
                        </motion.div>
                    </motion.div>,
                    document.body,
                )}
        </>
    );
}
