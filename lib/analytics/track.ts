// One call records something a visitor did: track("nav_click", { item: "Brand" }).
// Each event goes to Google Analytics and to our own collector (first-party.ts).
// Names are snake_case and props are flat (strings, numbers, booleans), so both can take them.
// The catalog of events, and where each one fires, is docs/analytics/events.md.

import { sendFirstParty } from "./first-party";

export type EventProps = Record<string, string | number | boolean | undefined>;

// Google Analytics keeps 25 params an event and 100 characters a value.
const MAX_PARAMS = 25;
const MAX_VALUE = 100;

function clean(props: EventProps): EventProps {
    const out: EventProps = {};
    let n = 0;
    for (const [key, value] of Object.entries(props)) {
        if (value === undefined || n >= MAX_PARAMS) continue;
        out[key] = typeof value === "string" ? value.slice(0, MAX_VALUE) : value;
        n++;
    }
    return out;
}

export function track(name: string, props: EventProps = {}) {
    if (typeof window === "undefined") return;
    const p = clean(props);
    try {
        (window as { gtag?: (...args: unknown[]) => void }).gtag?.("event", name, p);
    } catch {}
    try {
        sendFirstParty(name, p);
    } catch {}
}

// "Once per page view": events that mean "this happened on this page" (a section
// seen, a menu opened) are kept to one per page. A page view starts with each
// new path, whether it was loaded or reached by a client-side link.
let page = "";
const sent = new Set<string>();

/** Starts a new page view if the path has changed. PageEvents calls it on every navigation. */
export function syncPageView() {
    const path = location.pathname;
    if (path === page) return;
    page = path;
    sent.clear();
}

/** Like track(), but only the first time for this name and key on this page view. */
export function trackOnce(name: string, props: EventProps = {}, key = JSON.stringify(props)) {
    if (typeof window === "undefined") return;
    syncPageView();
    const id = `${name}|${key}`;
    if (sent.has(id)) return;
    sent.add(id);
    track(name, props);
}

const FLAG = "bp:analytics"; // in localStorage

/**
 * Our own visits: ?analytics=off marks this browser as internal until
 * ?analytics=on, so they can be left out of the numbers.
 */
export function isInternal(): boolean {
    try {
        const flag = new URLSearchParams(location.search).get("analytics");
        if (flag === "off") localStorage.setItem(FLAG, "off");
        else if (flag === "on") localStorage.removeItem(FLAG);
        return localStorage.getItem(FLAG) === "off";
    } catch {
        return false;
    }
}

/**
 * Runs as the page is parsed, before Google Analytics starts (it loads after
 * hydration): on an internal browser it queues gtag("set", { traffic_type:
 * "internal" }) ahead of GA's own config, so every hit carries it, the automatic
 * page views included, and GA's internal-traffic filter can drop them. The same
 * check as isInternal(), written out because it runs before any bundle.
 */
export const internalTrafficScript = `(function(){try{var f=new URLSearchParams(location.search).get("analytics");if(f==="off")localStorage.setItem("${FLAG}","off");else if(f==="on")localStorage.removeItem("${FLAG}");if(localStorage.getItem("${FLAG}")!=="off")return;var d=window.dataLayer=window.dataLayer||[];(function(){d.push(arguments)})("set",{traffic_type:"internal"})}catch(e){}})()`;
