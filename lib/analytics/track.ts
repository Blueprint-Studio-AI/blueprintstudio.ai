// One call records something a visitor did: track("nav_click", { item: "Brand" }).
// Each event goes to Google Analytics and to our own collector (first-party.ts).
// Names are snake_case and props are flat (strings, numbers, booleans), so both can take them.

import { sendFirstParty } from "./first-party";

export type EventProps = Record<string, string | number | boolean | undefined>;

export function track(name: string, props: EventProps = {}) {
    if (typeof window === "undefined") return;
    try {
        (window as { gtag?: (...args: unknown[]) => void }).gtag?.("event", name, props);
    } catch {}
    try {
        sendFirstParty(name, props);
    } catch {}
}

/**
 * Our own visits: ?analytics=off marks this browser as internal until
 * ?analytics=on, so they can be left out of the numbers.
 */
export function isInternal(): boolean {
    try {
        const flag = new URLSearchParams(location.search).get("analytics");
        if (flag === "off") localStorage.setItem("bp:analytics", "off");
        else if (flag === "on") localStorage.removeItem("bp:analytics");
        return localStorage.getItem("bp:analytics") === "off";
    } catch {
        return false;
    }
}
