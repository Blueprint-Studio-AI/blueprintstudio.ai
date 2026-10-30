// Our own collector: events wait in memory and go to /api/analytics in batches,
// by sendBeacon (fetch with keepalive if that refuses), a few seconds after the
// first one and whenever the page is hidden or closed.
//
// No cookies and nothing kept on the device: the server counts visitors with a
// hash that changes every day (lib/analytics/server/collect.ts). Nothing runs
// until the first event, which the page-view hook sends after hydration.

import { isInternal, type EventProps } from "./track";

const ENDPOINT = "/api/analytics";
const DELAY = 4000;
const MAX_BATCH = 40;

type Queued = { n: string; p: EventProps; path: string; t: number; pv: string; entry?: true };

const queue: Queued[] = [];
let timer: ReturnType<typeof setTimeout> | undefined;
/** A random id for the current page view, so its events can be told apart. Never stored. */
let pageView = "";
let viewed = false;
/** The page this load landed on, and what came with it; read at the first event. */
let landing: { path: string; search: string; internal: boolean } | undefined;

const newId = () => Math.random().toString(36).slice(2, 10);

export function sendFirstParty(name: string, props: EventProps) {
    record(name, props);
}

/** A page view: the first load, then every client-side route change. */
export function recordPageView() {
    // Events sent before the first page view (a mount effect) keep their id with it.
    if (viewed || !pageView) pageView = newId();
    record("pageview", {}, undefined, !viewed);
    viewed = true;
}

/**
 * Web vitals belong to the page that was loaded, even when they're reported
 * (on hide) after the visitor has moved on to another route.
 */
export function recordVital(props: EventProps) {
    record("web_vital", props, landing?.path);
}

function record(name: string, props: EventProps, path?: string, entry?: boolean) {
    if (typeof window === "undefined") return;
    // The dashboard doesn't count itself.
    if (location.pathname.startsWith("/analytics")) return;
    if (!landing) {
        landing = { path: location.pathname, search: location.search, internal: isInternal() };
        document.addEventListener("visibilitychange", () => document.visibilityState === "hidden" && flush());
        window.addEventListener("pagehide", flush);
    }
    if (!pageView) pageView = newId();
    queue.push({ n: name, p: props, path: path ?? location.pathname, t: Date.now(), pv: pageView, ...(entry && { entry: true }) });
    // Recorded while hidden (web vitals report then): send now, the page may not come back.
    if (document.visibilityState === "hidden") flush();
    else timer ??= setTimeout(flush, DELAY);
}

function flush() {
    clearTimeout(timer);
    timer = undefined;
    while (queue.length && landing) {
        const now = Date.now();
        const body = JSON.stringify({
            events: queue.splice(0, MAX_BATCH).map(({ t, ...e }) => ({ ...e, age: now - t })),
            // Where the visit came from: the landing page's referrer and query
            // (the server keeps only its utm_ params), and the screen width.
            referrer: document.referrer,
            search: landing.search,
            screen: screen.width,
            internal: landing.internal,
            // Automated browsers (Playwright, Puppeteer); the server drops them.
            webdriver: navigator.webdriver === true,
        });
        // A string body goes as text/plain, which needs no CORS preflight.
        if (!navigator.sendBeacon?.(ENDPOINT, body)) {
            fetch(ENDPOINT, { method: "POST", body, keepalive: true }).catch(() => {});
        }
    }
}
