// What the page records on its own, from attributes in the markup, so the
// components don't each carry handlers:
//
// - Clicks: one listener on the document reads data-track="event_name" on the
//   clicked element, and data-track-<prop>="value" on it or any element around
//   it (the nearest wins), e.g. data-track-menu="footer" once on the footer.
//   Every link off the site is an outbound_click, and every file link a
//   download, with no attributes at all.
// - Sections: data-section="faq" on a section's root. One IntersectionObserver
//   watches them all.
//
// Nothing here runs while the page scrolls: the observers report on their own,
// and the click listener does a few attribute reads per click.

import { track, trackOnce, type EventProps } from "./track";

/** The text a person clicked, for labels: its aria-label or its words, on one line. */
function textOf(el: Element) {
    return (el.getAttribute("aria-label") || el.textContent || "").replace(/\s+/g, " ").trim();
}

/** data-track-* on the element and its ancestors, nearest first; data-track-once is a flag, not a prop. */
function propsOf(el: HTMLElement): EventProps {
    const props: EventProps = {};
    for (let node: HTMLElement | null = el; node && node !== document.body; node = node.parentElement) {
        for (const [key, value] of Object.entries(node.dataset)) {
            if (!key.startsWith("track") || key === "track" || key === "trackOnce") continue;
            const prop = key.charAt(5).toLowerCase() + key.slice(6);
            if (!(prop in props)) props[prop] = value;
        }
    }
    return props;
}

/** The section a click happened in: the nearest data-section around it. */
function sectionOf(el: Element) {
    return el.closest<HTMLElement>("[data-section]")?.dataset.section;
}

// The props each event fills in from the element when the markup doesn't say.
const FILL: Record<string, (el: HTMLElement, props: EventProps) => void> = {
    nav_click: (el, p) => {
        p.item ??= textOf(el);
    },
    cta_click: (el, p) => {
        p.label ??= textOf(el);
        const href = String(p.href ?? el.getAttribute("href") ?? "");
        // A link off the site without its query (UTM tags): the destination, grouped.
        p.href = href ? (/^https?:/.test(href) ? href.split(/[?#]/)[0] : href) : undefined;
        p.section ??= sectionOf(el);
    },
    faq_open: (el, p) => {
        p.question ??= textOf(el);
        p.section ??= sectionOf(el);
    },
};

function fromAttributes(el: HTMLElement) {
    const name = el.dataset.track;
    if (!name) return;
    // A disclosure (FAQ answer, menu, "Read more") counts when it opens, not when it closes.
    if (el.getAttribute("aria-expanded") === "true") return;
    const props = propsOf(el);
    (FILL[name] ?? ((e, p) => (p.section ??= sectionOf(e))))(el, props);
    if (el.dataset.trackOnce !== undefined) trackOnce(name, props);
    else track(name, props);
}

/** Links off the site, and links to files, record themselves. */
function fromLink(link: HTMLAnchorElement) {
    const raw = link.getAttribute("href") ?? "";
    if (raw.startsWith("mailto:") || raw.startsWith("tel:")) {
        // The address itself stays out of analytics: only that it was an email or phone link.
        track("outbound_click", { href: raw.slice(0, raw.indexOf(":") + 1), section: sectionOf(link) });
        return;
    }
    let url: URL;
    try {
        url = new URL(link.href);
    } catch {
        return;
    }
    if (link.hasAttribute("download")) {
        // The name it saves as (a generated file, like the logo configurator's), else the file's own.
        const file = link.getAttribute("download") || url.pathname.split("/").pop() || url.pathname;
        track("download", { file, section: sectionOf(link) });
    }
    if ((url.protocol === "http:" || url.protocol === "https:") && url.origin !== location.origin) {
        // Without the query (UTM tags, tokens) or hash: the destination, grouped.
        track("outbound_click", { href: url.origin + url.pathname, section: sectionOf(link) });
    }
}

/**
 * The document's one click listener, in the capture phase: it sees each click
 * before the page's own handlers change anything (a disclosure's aria-expanded
 * is still what was clicked), and even where they stop it from spreading.
 * Middle-clicks on links (auxclick) open them too, so they count.
 */
export function onClick(e: MouseEvent) {
    if (e.type === "auxclick" && e.button !== 1) return;
    const target = e.target instanceof Element ? e.target : null;
    if (!target) return;
    const el = target.closest<HTMLElement>("[data-track]");
    if (el && e.type === "click") fromAttributes(el);
    const link = target.closest<HTMLAnchorElement>("a[href]");
    if (link) fromLink(link);
}

// A section counts as seen once it has been in the top 70% of the screen for
// half a second: long enough that the sections a smooth scroll flies past on
// the way to the booking calendar don't count.
const SEEN_MARGIN = "0px 0px -30% 0px";
const DWELL_MS = 500;

/**
 * Watches every data-section on the page and records section_view once for
 * each, with its order on the page (1 for the first). Returns a stop function.
 */
export function observeSections() {
    const order = new Map<Element, number>();
    const timers = new Map<Element, ReturnType<typeof setTimeout>>();
    const io = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                const el = entry.target as HTMLElement;
                if (!entry.isIntersecting) {
                    clearTimeout(timers.get(el));
                    timers.delete(el);
                    continue;
                }
                if (timers.has(el)) continue;
                timers.set(
                    el,
                    setTimeout(() => {
                        timers.delete(el);
                        io.unobserve(el);
                        const section = el.dataset.section;
                        trackOnce("section_view", { section, index: order.get(el) }, section);
                    }, DWELL_MS),
                );
            }
        },
        { rootMargin: SEEN_MARGIN },
    );
    // In page order; a section that mounts later (none do yet) is picked up by the second look.
    const scan = () =>
        document.querySelectorAll<HTMLElement>("[data-section]").forEach((el, i) => {
            if (order.has(el)) return;
            order.set(el, i + 1);
            io.observe(el);
        });
    const frame = requestAnimationFrame(scan);
    const cancelLater = onIdle(scan, 3000);
    return () => {
        cancelAnimationFrame(frame);
        cancelLater();
        timers.forEach(clearTimeout);
        io.disconnect();
    };
}

/** Runs `fn` when the main thread is free (or after `timeout` ms at the latest); returns a cancel. Safari has no requestIdleCallback. */
export function onIdle(fn: () => void, timeout: number) {
    if ("requestIdleCallback" in window) {
        const id = requestIdleCallback(fn, { timeout });
        return () => cancelIdleCallback(id);
    }
    const id = setTimeout(fn, Math.min(timeout, 1000));
    return () => clearTimeout(id);
}
