// The collector's checks and enrichment: a batch from lib/analytics/first-party.ts
// in, rows for the store out. Everything a visitor sends is capped and anything
// that doesn't fit the schema is dropped, event by event.

import { createHash } from "node:crypto";
import { classify } from "./ua";
import { dayOf } from "./time";
import type { EventRow, PropValue } from "./types";

export const MAX_BODY_BYTES = 16 * 1024;
export const MAX_EVENTS = 50;
const MAX_PROPS = 12;
const MAX_STRING = 200;
const MAX_PATH = 300;
/** Events older than this when they arrive are dropped (a tab asleep for hours). */
const MAX_AGE_MS = 30 * 60 * 1000;

const NAME = /^[a-z][a-z0-9_]{0,39}$/;
const KEY = /^[a-z][a-zA-Z0-9_]{0,39}$/;
const VITALS = new Set(["LCP", "INP", "CLS", "TTFB", "FCP"]);

type InEvent = { n: string; p: Record<string, PropValue>; path: string; pv: string; age: number; entry: boolean };
export type Batch = {
    events: InEvent[];
    referrer: string;
    search: string;
    screen?: number;
    internal: boolean;
    webdriver: boolean;
};

const isObject = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const str = (v: unknown, max: number) => (typeof v === "string" ? v.slice(0, max) : "");

function cleanProps(p: unknown): Record<string, PropValue> | null {
    if (p === undefined) return {};
    if (!isObject(p)) return null;
    const out: Record<string, PropValue> = {};
    let count = 0;
    for (const [k, v] of Object.entries(p)) {
        if (v === undefined || v === null) continue;
        if (!KEY.test(k) || ++count > MAX_PROPS) return null;
        if (typeof v === "string") out[k] = v.slice(0, MAX_STRING);
        else if (typeof v === "boolean") out[k] = v;
        else if (typeof v === "number" && Number.isFinite(v)) out[k] = v;
        else return null;
    }
    return out;
}

function cleanEvent(e: unknown): InEvent | null {
    if (!isObject(e) || typeof e.n !== "string" || !NAME.test(e.n)) return null;
    if (typeof e.path !== "string" || !e.path.startsWith("/")) return null;
    const p = cleanProps(e.p);
    if (!p) return null;
    // The dashboard needs these to be numbers it can rank; anything else is noise.
    if (e.n === "web_vital" && !(VITALS.has(String(p.metric)) && typeof p.value === "number" && p.value >= 0 && p.value < 600_000)) return null;
    const age = typeof e.age === "number" && Number.isFinite(e.age) ? Math.max(0, e.age) : 0;
    if (age > MAX_AGE_MS) return null;
    return {
        n: e.n,
        p,
        // The query string can carry anything (emails from a newsletter link), so only the path is kept.
        path: e.path.split(/[?#]/)[0].slice(0, MAX_PATH) || "/",
        pv: str(e.pv, 16) || "-",
        age,
        entry: e.entry === true,
    };
}

/** The batch, or null when it isn't one. Bad events inside a good batch are dropped. */
export function parseBatch(text: string): Batch | null {
    let body: unknown;
    try {
        body = JSON.parse(text);
    } catch {
        return null;
    }
    if (!isObject(body) || !Array.isArray(body.events) || body.events.length === 0 || body.events.length > MAX_EVENTS) return null;
    const events = body.events.map(cleanEvent).filter((e): e is InEvent => e !== null);
    if (!events.length) return null;
    return {
        events,
        referrer: str(body.referrer, 1000),
        search: str(body.search, 2000),
        screen: typeof body.screen === "number" && body.screen > 0 && body.screen < 10000 ? Math.round(body.screen) : undefined,
        internal: body.internal === true,
        webdriver: body.webdriver === true,
    };
}

// Hosts that send traffic under several names, folded into one.
const SOURCES: [RegExp, string][] = [
    [/(^|\.)google\.[a-z.]+$/, "google.com"],
    [/(^|\.)bing\.com$/, "bing.com"],
    [/(^|\.)duckduckgo\.com$/, "duckduckgo.com"],
    [/(^|\.)(linkedin\.com|lnkd\.in)$/, "linkedin.com"],
    [/^(t\.co|(.+\.)?twitter\.com|(.+\.)?x\.com)$/, "x.com"],
    [/(^|\.)(facebook\.com|fb\.com|fb\.me)$/, "facebook.com"],
    [/(^|\.)instagram\.com$/, "instagram.com"],
    [/(^|\.)(youtube\.com|youtu\.be)$/, "youtube.com"],
    [/(^|\.)reddit\.com$/, "reddit.com"],
    [/(^|\.)(chatgpt\.com|openai\.com)$/, "chatgpt.com"],
    [/(^|\.)perplexity\.ai$/, "perplexity.ai"],
    [/(^|\.)claude\.ai$/, "claude.ai"],
];

/** The referring site as a bare host, or null for direct visits and our own pages. */
export function referrerHost(referrer: string, siteHost: string): string | null {
    let host: string;
    try {
        host = new URL(referrer).hostname.toLowerCase().replace(/^www\./, "");
    } catch {
        return null;
    }
    const site = siteHost.toLowerCase().replace(/^www\./, "").replace(/:\d+$/, "");
    if (!host || host === site || host.endsWith(`.${site}`) || host === "blueprintstudio.ai" || host === "localhost") return null;
    for (const [pattern, name] of SOURCES) if (pattern.test(host)) return name;
    return host.slice(0, 100);
}

/**
 * utm_source, utm_medium and utm_campaign from the landing query; nothing else
 * in it is kept. A Google Ads click (gclid) without UTM tags counts as
 * google / cpc, and the click id itself is thrown away.
 */
export function utm(search: string) {
    const q = new URLSearchParams(search);
    const get = (k: string) => q.get(k)?.trim().toLowerCase().slice(0, 100) || null;
    let source = get("utm_source") ?? get("ref");
    let medium = get("utm_medium");
    if (!source && q.has("gclid")) {
        source = "google";
        medium = "cpc";
    }
    return { utm_source: source, utm_medium: source ? medium : null, utm_campaign: source ? get("utm_campaign") : null };
}

/**
 * The visitor: a hash of the day's salt, the site, the IP and the user agent,
 * like Plausible's. The salt is random and thrown away after a day, so a hash
 * can't be traced back to an IP, and the same person is a new visitor tomorrow.
 */
export function visitorHash(salt: string, site: string, ip: string, ua: string) {
    return createHash("sha256").update(`${salt}|${site}|${ip}|${ua}`).digest("hex").slice(0, 16);
}

export type RequestContext = { ip: string; ua: string; site: string; country: string | null; now: Date; salt: string };

export function toRows(batch: Batch, ctx: RequestContext): EventRow[] {
    const visitor = visitorHash(ctx.salt, ctx.site, ctx.ip, ctx.ua);
    const client = classify(ctx.ua, batch.screen);
    const source = { referrer: referrerHost(batch.referrer, ctx.site), ...utm(batch.search) };
    return batch.events.map((e) => {
        const at = new Date(ctx.now.getTime() - e.age);
        return {
            ts: at.toISOString(),
            day: dayOf(at),
            name: e.n,
            path: e.path,
            props: e.p,
            visitor,
            pv: e.pv,
            entry: e.n === "pageview" && e.entry,
            ...source,
            country: ctx.country,
            ...client,
            internal: batch.internal,
        };
    });
}
