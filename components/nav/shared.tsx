"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, type Transition } from "framer-motion";
import { useSmoothScroll } from "@/components/SmoothScroll";
import { VARIANTS, type VariantKey } from "@/components/Home/HeroSelector";
import { assetGeneratorUrl } from "@/lib/asset-generator";

// What both navs share: where they're hidden, the sections and services they
// link to, how they scroll, and when they arrive.

/** The nav's one physics: quick to answer, a little give, interruptible. */
export const SPRING = {
    /** The bar becoming the pill, and the pill becoming the menu sheet. */
    morph: { type: "spring", visualDuration: 0.55, bounce: 0.14 } satisfies Transition,
    /** Highlights gliding from item to item, chevrons turning. */
    glide: { type: "spring", visualDuration: 0.3, bounce: 0.12 } satisfies Transition,
    press: { type: "spring", visualDuration: 0.15, bounce: 0.1 } satisfies Transition,
};
export const EASE_OUT = [0.23, 1, 0.32, 1] as const;

export const FOCUS = "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]";

// The paid landing pages (/brand, /launch, /launch-videos) and the client brand
// kits (/brands/*) keep their own focused header, so both navs stay off them.
const HIDDEN_NAV_ROUTES = ["/launch-videos", "/launch", "/brand", "/brands"];

export const isNavHidden = (pathname: string) =>
    HIDDEN_NAV_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"));

/** The nav's own items, in order. Services, Industries and Products open menus. */
export type NavItem = "work" | "services" | "industries" | "products" | "insights";

/** The item for where you are: the page you're on, or Work while it's on screen at home. */
export function useCurrentItem(): NavItem | null {
    const pathname = usePathname();
    const section = useActiveSection();
    if (pathname === "/") return section === "work" ? "work" : null;
    if (pathname.startsWith("/work")) return "work";
    if (pathname.startsWith("/services")) return "services";
    if (pathname.startsWith("/industries")) return "industries";
    if (pathname.startsWith("/insights")) return "insights";
    return null;
}

/** Pricing and FAQ left the top level; the menus and the footer still link them. */
export const PRICING = { label: "Pricing", id: "pricing" };
export const FAQ = { label: "FAQ", id: "faq" };

// What we make, each with its own page. The menu and the hero's word previews
// show one picture per service: the LivingIP phone, HoneyB on a Studio Display,
// our Jinba brand slides, and Logical's launch film on a keynote stage.
// menuStill names those cutouts directly (they're the same files the hero's
// VARIANTS use on feat/hero-words-3), so this branch shows them on its own;
// once both are in, menuStill can go and the menu falls back to the variant's still.
const CUTS = "/media/hero-words";
export const SERVICES = (
    [
        { key: "apps", href: "/services/apps", hint: "From first sketch to launch", focus: "26% 30%", menuStill: `${CUTS}/apps-cut.webp` },
        { key: "websites", href: "/services/websites", hint: "Marketing sites, designed and built", focus: "50% 40%", menuStill: `${CUTS}/websites-cut.webp` },
        { key: "brands", href: "/services/branding", hint: "Your brand in three weeks", focus: "50% 50%", menuStill: `${CUTS}/brands-cut.webp` },
        { key: "launch-videos", href: "/services/launch-videos", hint: "Your launch video in seven days", focus: "60% 50%", menuStill: `${CUTS}/launch-videos-stage-a3.webp` },
    ] satisfies { key: VariantKey; href: string; hint: string; focus: string; menuStill?: string }[]
).map((service) => {
    const variant = VARIANTS.find((v) => v.key === service.key)!;
    return { ...service, label: variant.label, still: variant.still, menuStill: service.menuStill ?? variant.still };
});

// The industries we have a page for. Each is a card: a line on what we make
// there, and a few of the clients (from lib/industries on its page's branch).
export const INDUSTRIES = [
    {
        key: "crypto",
        label: "Crypto",
        href: "/industries/crypto",
        line: "For stablecoins, Bitcoin finance, DeFi and on-chain AI.",
        logos: [
            { name: "Arch Network", src: "/logos-match-height/arch-network.png", width: 518 },
            { name: "Perena", src: "/logos-match-height/perena.png", width: 682 },
            { name: "HoneyB", src: "/logos-match-height/honeyb.png", width: 630 },
            { name: "LivingIP", src: "/logos-match-height/livingip.png", width: 603 },
        ],
    },
    {
        key: "finance",
        label: "Finance",
        href: "/industries/finance",
        line: "For yield, stablecoins and credit.",
        logos: [
            { name: "HoneyB", src: "/logos-match-height/honeyb.png", width: 630 },
            { name: "Perena", src: "/logos-match-height/perena.png", width: 682 },
            { name: "Arch Prime", src: "/logos-match-height/arch-prime.png", width: 666 },
            { name: "Pyra", src: "/logos-match-height/pyra.png", width: 476 },
        ],
    },
    {
        key: "ai",
        label: "AI",
        href: "/industries/ai",
        line: "For AI assistants, agents and infrastructure.",
        logos: [
            { name: "Jinba", src: "/logos-match-height/jinba.png", width: 561 },
            { name: "Logical", src: "/logos-match-height/logical.png", width: 580 },
            // From the wordmark on pirislabs.io, set on the same canvas as the others.
            { name: "Piris Labs", src: "/logos-match-height/piris-labs.png", width: 796 },
        ],
    },
];

/** Our own product, on the tools subdomain. The picture is the home page's Asset Generator band's. */
export const ASSET_GENERATOR = {
    label: "Asset Generator",
    line: "Your brand’s Styles and logos in your AI app.",
    image: "/asset-generator/demo-1.webp",
    href: assetGeneratorUrl("/asset-generator/landing", "nav"),
};

export const INSIGHTS = { label: "Insights", href: "/insights" };

/** Goes to a home page section with Locomotive's eased scroll, 80px clear of the top, or loads /#section from any other page. */
export function useGoToSection() {
    const pathname = usePathname();
    const { scroll, isReady } = useSmoothScroll();
    return (id: string) => {
        if (pathname !== "/") {
            window.location.href = `/#${id}`;
            return;
        }
        const element = document.getElementById(id);
        if (!element) return;
        if (isReady && scroll) scroll.scrollTo(element, { offset: -80, duration: 1.2 });
        else window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
    };
}

/** False on the home page until its opening reel starts to land, so the nav arrives with the headline. */
export function useNavReveal() {
    const home = usePathname() === "/";
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
    return !home || landed;
}

/** The home page section in the upper middle of the screen, or null at the top and on other pages. */
export function useActiveSection() {
    const pathname = usePathname();
    const [active, setActive] = useState<string | null>(null);
    useEffect(() => {
        setActive(null);
        if (pathname !== "/") return;
        const ids = ["work", "pricing", "testimonials", "faq", "contact"];
        const observer = new IntersectionObserver(
            (entries) => {
                if (window.scrollY < 200) return setActive(null);
                for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
            },
            { rootMargin: "-30% 0px -60% 0px" },
        );
        // Sections mount with the page; look again once it has rendered.
        const frame = requestAnimationFrame(() =>
            ids.forEach((id) => {
                const element = document.getElementById(id);
                if (element) observer.observe(element);
            }),
        );
        const onScroll = () => window.scrollY < 200 && setActive(null);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            cancelAnimationFrame(frame);
            observer.disconnect();
            window.removeEventListener("scroll", onScroll);
        };
    }, [pathname]);
    return active;
}

/** The nav's call to action, the same in every state: plain and dark, no photo (the hero's has his face). */
export function CallButton({ onGo, touch = false }: { onGo: () => void; touch?: boolean }) {
    return (
        <motion.a
            href="/#contact"
            onClick={(e) => {
                e.preventDefault();
                onGo();
            }}
            whileTap={{ scale: 0.97 }}
            transition={SPRING.press}
            className={`flex shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-[#1C1C1E] font-medium text-white shadow-[0_1px_2px_rgba(0,0,0,0.12),0_6px_16px_-8px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.12)] transition-colors duration-200 hover:bg-[#2C2C2E] ${touch ? "h-11 px-5 text-[15px]" : "h-9 px-4 text-sm"} ${FOCUS}`}
        >
            Book a call
        </motion.a>
    );
}
