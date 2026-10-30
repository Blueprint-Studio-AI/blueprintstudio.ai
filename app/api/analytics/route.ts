// app/api/analytics/route.ts
// Our own analytics collector. lib/analytics/first-party.ts posts batches of
// events here (sendBeacon, text/plain JSON); this checks where they came from,
// drops bots, enriches them (country, device, source, daily visitor hash) and
// hands them to the store (lib/analytics/server/store.ts).
//
// Node, not Edge: the local dev store writes a file, and node:crypto hashes the
// visitor. Nobody waits on a beacon, so the region and cold starts don't matter.

import { getStore } from "@/lib/analytics/server/store";
import { MAX_BODY_BYTES, parseBatch, toRows } from "@/lib/analytics/server/collect";
import { isBot, isHeadlessChrome } from "@/lib/analytics/server/ua";
import { dayOf } from "@/lib/analytics/server/time";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Basic per-instance rate limiting: a visitor sends a batch every few seconds at most.
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 60;
const hits = new Map<string, { count: number; start: number }>();

function limited(ip: string) {
    const now = Date.now();
    if (hits.size > 10_000) for (const [k, v] of hits) if (now - v.start > WINDOW_MS) hits.delete(k);
    const entry = hits.get(ip);
    if (!entry || now - entry.start > WINDOW_MS) {
        hits.set(ip, { count: 1, start: now });
        return false;
    }
    return ++entry.count > MAX_PER_WINDOW;
}

// Our pages only: the Origin must be this host (which covers previews and
// localhost) or one of ANALYTICS_ALLOWED_ORIGINS.
function allowedOrigin(req: Request, host: string) {
    const origin = req.headers.get("origin");
    if (!origin) return req.headers.get("sec-fetch-site") === "same-origin";
    let originHost: string;
    try {
        originHost = new URL(origin).host;
    } catch {
        return false;
    }
    if (originHost === host) return true;
    const extra = (process.env.ANALYTICS_ALLOWED_ORIGINS ?? "").split(",").map((o) => o.trim()).filter(Boolean);
    return ["https://blueprintstudio.ai", "https://www.blueprintstudio.ai", ...extra].includes(origin);
}

/**
 * For our own Playwright runs: ANALYTICS_ALLOW_AUTOMATION=1 lets automated
 * browsers (navigator.webdriver, HeadlessChrome) through. Ignored in production.
 */
const allowAutomation = () => process.env.ANALYTICS_ALLOW_AUTOMATION === "1" && process.env.VERCEL_ENV !== "production";

const empty = (status: number) => new Response(null, { status });

export async function POST(req: Request) {
    const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "";
    if (!allowedOrigin(req, host)) return empty(403);

    if (Number(req.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) return empty(413);
    const text = await req.text();
    if (text.length > MAX_BODY_BYTES) return empty(413);

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || req.headers.get("x-real-ip") || "0.0.0.0";
    if (limited(ip)) return empty(429);

    const batch = parseBatch(text);
    if (!batch) return empty(400);

    // Bots get the same answer as everyone else, and nothing is kept.
    const ua = req.headers.get("user-agent") ?? "";
    if ((batch.webdriver || isHeadlessChrome(ua)) && !allowAutomation()) return empty(204);
    if (isBot(ua) && !(allowAutomation() && isHeadlessChrome(ua))) return empty(204);

    const store = getStore();
    if (store.kind === "none") return empty(204);
    try {
        const now = new Date();
        const salt = await store.salt(dayOf(now));
        const country = req.headers.get("x-vercel-ip-country");
        await store.insert(toRows(batch, { ip, ua, site: host.replace(/:\d+$/, ""), country: country && /^[A-Z]{2}$/.test(country) ? country : null, now, salt }));
    } catch (error) {
        console.error("Analytics collector:", error);
        return empty(500);
    }
    return empty(204);
}
