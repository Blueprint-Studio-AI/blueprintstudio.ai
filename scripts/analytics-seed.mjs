// Sample events for the analytics dashboard, written to the local dev store
// only (.analytics/events.ndjson, or ANALYTICS_DEV_FILE). Every row it writes
// says sample: true, and the dashboard says so in a banner while any are there.
// It never talks to Supabase or any other service.
//
//   node scripts/analytics-seed.mjs            replace the sample rows (30 days)
//   node scripts/analytics-seed.mjs --days 60  more history
//   node scripts/analytics-seed.mjs --remove   take the sample rows out again
//
// Rows from real local visits (your own browsing, Playwright runs) are kept.

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const TIME_ZONE = "America/New_York"; // lib/analytics/server/time.ts
const dayFormat = new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" });
const dayOf = (ms) => dayFormat.format(new Date(ms));

// Deterministic, so two runs give the same dashboard.
function random(seed) {
    let a = seed >>> 0;
    return () => {
        a = (a + 0x6d2b79f5) >>> 0;
        let t = a;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

const SECTIONS = ["hero", "logos", "work", "achievements", "pricing", "testimonials", "faq", "contact", "asset-generator"];
const VARIANTS = [["apps", 30], ["websites", 28], ["brands", 22], ["launch-videos", 15], ["everything", 5]];
const PROJECTS = ["livingip", "huch", "uni", "bump", "perena", "autara", "arch-network"];
const FAQS = [
    "How does the subscription model work?",
    "What's included in the subscription?",
    "How quickly can you start on my project?",
    "What if I'm not satisfied with the work?",
    "Can I pause or cancel my subscription?",
    "How do you handle communication and project management?",
    "What's the difference between subscription and project pricing?",
];
const PAGES = [["/", 70], ["/brand", 8], ["/launch-videos", 7], ["/launch", 5], ["/insights/untapped-opportunities-in-mining-equipment-sales", 4], ["/brands/honeyb", 3], ["/brands/jinba", 3]];
const SOURCES = [
    [{ referrer: null }, 32],
    [{ referrer: "google.com" }, 28],
    [{ referrer: "linkedin.com" }, 11],
    [{ referrer: "x.com" }, 5],
    [{ referrer: "chatgpt.com" }, 4],
    [{ referrer: "bing.com" }, 3],
    [{ referrer: "duckduckgo.com" }, 2],
    [{ referrer: "github.com" }, 2],
    [{ referrer: "linkedin.com", utm_source: "linkedin", utm_medium: "social", utm_campaign: "launch-videos" }, 6],
    [{ referrer: null, utm_source: "newsletter", utm_medium: "email", utm_campaign: "october" }, 4],
    [{ referrer: "google.com", utm_source: "google", utm_medium: "cpc", utm_campaign: "brand" }, 3],
];
const COUNTRIES = [["US", 46], ["GB", 12], ["CA", 7], ["DE", 5], ["IN", 5], ["AU", 4], ["NL", 3], ["FR", 3], ["SG", 2], ["BR", 2], ["AE", 2], ["ES", 2], ["SE", 2], ["JP", 1], ["MX", 1], ["PL", 1], ["NG", 1], ["ZA", 1]];
const CLIENTS = [
    [{ device: "phone", browser: "Safari", os: "iOS" }, 30],
    [{ device: "phone", browser: "Chrome", os: "Android" }, 15],
    [{ device: "phone", browser: "Chrome", os: "iOS" }, 3],
    [{ device: "desktop", browser: "Chrome", os: "macOS" }, 22],
    [{ device: "desktop", browser: "Safari", os: "macOS" }, 9],
    [{ device: "desktop", browser: "Chrome", os: "Windows" }, 10],
    [{ device: "desktop", browser: "Edge", os: "Windows" }, 4],
    [{ device: "desktop", browser: "Firefox", os: "macOS" }, 2],
    [{ device: "tablet", browser: "Safari", os: "iOS" }, 5],
];
// Share of visits starting in each hour, New York time.
const HOURS = [1, 1, 1, 1, 1, 2, 3, 4, 6, 8, 9, 9, 9, 9, 9, 8, 7, 6, 5, 5, 4, 3, 2, 1];

export function sampleEvents({ days = 30, now = Date.now(), seed = 7 } = {}) {
    const rnd = random(seed);
    const pick = (list) => {
        let r = rnd() * list.reduce((s, [, w]) => s + w, 0);
        for (const [v, w] of list) if ((r -= w) < 0) return v;
        return list[list.length - 1][0];
    };
    const chance = (p) => rnd() < p;
    const id = (n) => Array.from({ length: n }, () => Math.floor(rnd() * 16).toString(16)).join("");
    // Log-normal around a median, for timings.
    const timing = (median, spread = 0.55) => Math.round(median * Math.exp(spread * Math.sqrt(-2 * Math.log(rnd() || 1e-9)) * Math.cos(2 * Math.PI * rnd())));

    const rows = [];
    const today = dayOf(now);
    for (let back = days - 1; back >= 0; back--) {
        const noon = now - back * 86_400_000;
        const day = dayOf(noon);
        const weekday = new Date(noon).getUTCDay();
        const weekend = weekday === 0 || weekday === 6;
        let visits = Math.round((weekend ? 34 : 58) * (0.75 + rnd() * 0.5) * (1 + (days - back) / days / 3));
        // Today so far only, plus a few people on the site right now.
        const midnight = Date.parse(`${day}T00:00:00Z`) + 4 * 3_600_000;
        if (day === today) visits = Math.round((visits * (now - midnight)) / 86_400_000);

        const visitors = [];
        for (let i = 0; i < visits; i++) visitors.push(midnight + pick(HOURS.map((w, h) => [h, w])) * 3_600_000 + rnd() * 3_600_000);
        if (day === today) for (let i = 0; i < 3; i++) visitors.push(now - (1 + rnd() * 3) * 60_000);

        for (const start of visitors) {
            if (start > now) continue;
            const visitor = id(16);
            const client = pick(CLIENTS);
            const source = pick(SOURCES);
            const country = pick(COUNTRIES);
            const phone = client.device === "phone";
            let t = start;
            let pv = id(8);
            let path = pick(PAGES);
            const landing = path;
            const add = (name, props = {}, extra = {}) => {
                t += 1500 + rnd() * 9000;
                if (t > now) return;
                rows.push({
                    ts: new Date(t).toISOString(),
                    day: dayOf(t),
                    name,
                    path: extra.path ?? path,
                    props,
                    visitor,
                    pv,
                    entry: extra.entry ?? false,
                    referrer: source.referrer ?? null,
                    utm_source: source.utm_source ?? null,
                    utm_medium: source.utm_medium ?? null,
                    utm_campaign: source.utm_campaign ?? null,
                    country,
                    ...client,
                    internal: false,
                    sample: true,
                });
            };

            add("pageview", {}, { entry: true });
            let reachedWork = false;
            if (path === "/") {
                if (chance(0.3)) add("hero_menu_open");
                let picked = null;
                if (chance(0.24)) {
                    picked = pick(VARIANTS);
                    add("hero_variant", { variant: picked });
                    if (chance(0.15)) add("hero_variant", { variant: pick(VARIANTS) });
                }
                if (chance(0.06)) add("cta_click", { cta: "book_call", label: "Book a call", href: "#contact", section: "hero" });
                if (chance(picked ? 0.12 : 0.05)) add("cta_click", { cta: "see_work", label: "See the work", href: "#work", section: "hero", ...(picked && { variant: picked }) });
                if (chance(0.12)) {
                    add("reel_open");
                    for (const percent of [25, 50, 75, 100]) {
                        if (!chance(percent === 25 ? 0.8 : 0.72)) break;
                        add("reel_progress", { percent });
                    }
                }
                // Down the page, one section at a time; each a little less likely.
                const keep = (phone ? 0.8 : 0.86) + (picked ? 0.05 : 0);
                let deepest = 0;
                for (let index = 0; index < SECTIONS.length; index++) {
                    if (index > 0 && !chance(keep)) break;
                    deepest = index;
                    const section = SECTIONS[index];
                    add("section_view", { section, index });
                    if (section === "work") {
                        reachedWork = true;
                        if (chance(picked ? 0.34 : 0.2)) add("project_open", { project: PROJECTS[Math.floor(rnd() * PROJECTS.length)] });
                    }
                    if (section === "pricing" && chance(0.07)) add("cta_click", { cta: "pricing_plan", label: "Get started", href: "#contact", section: "pricing" });
                    if (section === "faq" && chance(0.35)) {
                        add("faq_open", { question: FAQS[Math.floor(rnd() * 3 + rnd() * 4)] });
                        if (chance(0.3)) add("faq_open", { question: FAQS[Math.floor(rnd() * FAQS.length)] });
                    }
                    if (section === "contact" && chance(0.08)) add("cta_click", { cta: "book_call", label: "Book a call", href: "#contact", section: "contact" });
                    if (section === "asset-generator" && chance(0.1)) add("outbound_click", { href: "https://tools.blueprintstudio.ai/" });
                }
                for (const percent of [25, 50, 75, 90, 100]) if (deepest >= Math.round((percent / 100) * (SECTIONS.length - 1))) add("scroll_depth", { percent });
                if (chance(0.25)) add("nav_click", { item: pick([["work", 4], ["services", 3], ["industries", 1], ["products", 2], ["insights", 2], ["book_call", 2]]), menu: phone ? pick([["mobile", 4], ["floating", 1]]) : pick([["top", 3], ["floating", 2], ["footer", 1]]) });
                if (deepest >= 7 && chance(0.12)) add("booking_made");
                else if (chance(0.006)) add("booking_made");
                if (chance(0.012)) add("form_submit", { form: "newsletter", ok: chance(0.9) });
            } else {
                for (const percent of [25, 50, 75, 90, 100]) if (chance(percent === 25 ? 0.75 : 0.7)) add("scroll_depth", { percent });
                else break;
                if (chance(0.06)) add("cta_click", { cta: "book_call", label: "Book a call", href: "#contact", section: "page" });
            }
            if (chance(0.03)) add("outbound_click", { href: pick([["https://x.com/bpstu", 1], ["https://www.linkedin.com/company/blueprint-studio-ai", 2]]) });

            // Web vitals for the page the visit loaded.
            const slow = phone ? 1.5 : 1;
            add("web_vital", { metric: "TTFB", value: timing(220 * slow, 0.5), rating: "good" }, { path: landing });
            add("web_vital", { metric: "FCP", value: timing(700 * slow, 0.45), rating: "good" }, { path: landing });
            // The home page's reel makes it the slowest to paint, on phones most of all.
            add("web_vital", { metric: "LCP", value: timing(landing === "/" ? (phone ? 2700 : 1500) : 1100 * slow, 0.5), rating: "good" }, { path: landing });
            add("web_vital", { metric: "CLS", value: chance(0.85) ? Math.round(rnd() * 400) / 10000 : Math.round((0.08 + rnd() * 0.2) * 10000) / 10000, rating: "good" }, { path: landing });
            if (chance(0.7)) add("web_vital", { metric: "INP", value: timing(90 * slow, 0.6), rating: "good" }, { path: landing });

            // Some go on to another page.
            if (chance(0.3)) {
                pv = id(8);
                path = pick(PAGES.filter(([p]) => p !== path));
                add("pageview");
                if (chance(0.5)) add("scroll_depth", { percent: 25 });
            }
        }

        // A few of our own visits, which the dashboard leaves out.
        for (let i = 0; i < 3; i++) {
            const t = midnight + (9 + i * 3) * 3_600_000;
            if (t > now) continue;
            rows.push({ ts: new Date(t).toISOString(), day: dayOf(t), name: "pageview", path: "/", props: {}, visitor: "internal" + day, pv: id(8), entry: true, referrer: null, utm_source: null, utm_medium: null, utm_campaign: null, country: "US", device: "desktop", browser: "Chrome", os: "macOS", internal: true, sample: true });
        }
    }
    // Vitals ratings from the values, so they agree with the dashboard's bands.
    const BANDS = { LCP: [2500, 4000], INP: [200, 500], CLS: [0.1, 0.25], FCP: [1800, 3000], TTFB: [800, 1800] };
    for (const r of rows) {
        if (r.name !== "web_vital") continue;
        const [good, poor] = BANDS[r.props.metric];
        r.props.rating = r.props.value <= good ? "good" : r.props.value <= poor ? "needs-improvement" : "poor";
    }
    return rows.sort((x, y) => x.ts.localeCompare(y.ts));
}

async function main() {
    if (process.env.VERCEL) throw new Error("analytics-seed writes local sample data and doesn't run on Vercel.");
    const args = process.argv.slice(2);
    const days = Number(args[args.indexOf("--days") + 1]) || 30;
    const file = process.env.ANALYTICS_DEV_FILE || path.join(process.cwd(), ".analytics", "events.ndjson");

    let kept = [];
    try {
        kept = (await readFile(file, "utf8")).split("\n").filter((line) => line && !JSON.parse(line).sample);
    } catch {}
    const sample = args.includes("--remove") ? [] : sampleEvents({ days }).map((r) => JSON.stringify(r));
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, [...kept, ...sample].map((line) => line + "\n").join(""));
    console.log(`${file}: ${sample.length} sample events${sample.length ? ` over ${days} days` : " (removed)"}, ${kept.length} real events kept.`);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) await main();
