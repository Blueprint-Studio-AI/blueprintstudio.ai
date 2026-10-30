// Rollup rows for a period turned into what the dashboard shows. Server only.
// Visitors are summed across days (visitor-days): the hash changes daily, so
// someone who comes back on another day counts again, as in Plausible.

import { addDays, daysBetween } from "./time";
import type { RollupRow } from "./types";

export type Period = "today" | "7d" | "30d";
export const PERIODS: { key: Period; label: string; days: number }[] = [
    { key: "today", label: "Today", days: 1 },
    { key: "7d", label: "7 days", days: 7 },
    { key: "30d", label: "30 days", days: 30 },
];

export type Range = { period: Period; from: string; to: string; prevFrom: string; prevTo: string; days: string[] };

export function rangeFor(period: Period, today: string): Range {
    const length = PERIODS.find((p) => p.key === period)!.days;
    const from = addDays(today, 1 - length);
    return { period, from, to: today, prevFrom: addDays(from, -length), prevTo: addDays(from, -1), days: daysBetween(from, today) };
}

/** Web vitals thresholds (web.dev): good up to the first, poor above the second. */
export const VITAL_BANDS: Record<string, { good: number; poor: number; unit: "ms" | "" ; label: string }> = {
    LCP: { good: 2500, poor: 4000, unit: "ms", label: "Largest paint" },
    INP: { good: 200, poor: 500, unit: "ms", label: "Response to taps" },
    CLS: { good: 0.1, poor: 0.25, unit: "", label: "Layout shift" },
    FCP: { good: 1800, poor: 3000, unit: "ms", label: "First paint" },
    TTFB: { good: 800, poor: 1800, unit: "ms", label: "Server response" },
};
export const VITAL_ORDER = ["LCP", "INP", "CLS", "FCP", "TTFB"];
export type Band = "good" | "needs-work" | "poor";

export const bandOf = (metric: string, value: number): Band => {
    const b = VITAL_BANDS[metric];
    return value <= b.good ? "good" : value <= b.poor ? "needs-work" : "poor";
};

/** The funnel's steps, in order (rollup.ts: FUNNEL). */
export const FUNNEL_STEPS = [
    { key: "visited", label: "Visited" },
    { key: "work", label: "Reached the work" },
    { key: "engaged", label: "Opened a project or clicked a button" },
    { key: "converted", label: "Booked a call or sent a form" },
];

/** hero_then actions (rollup.ts: action()). */
export const HERO_ACTIONS = [
    { key: "work", label: "Saw the work" },
    { key: "project", label: "Opened a project" },
    { key: "cta", label: "Clicked a button" },
    { key: "reel", label: "Opened the reel" },
    { key: "booked", label: "Booked" },
    { key: "form", label: "Sent a form" },
];

export type Item = { key: string; label: string; n: number; visitors: number; sub?: string };

type Sum = { n: number; visitors: number };

/** Sum rows by (metric, a, b, c) over the given days. */
class Rows {
    private sums = new Map<string, Map<string, Sum & { a: string; b: string; c: string }>>();
    constructor(rows: RollupRow[], from: string, to: string) {
        for (const r of rows) {
            if (r.day < from || r.day > to) continue;
            let metric = this.sums.get(r.metric);
            if (!metric) this.sums.set(r.metric, (metric = new Map()));
            const key = `${r.a}\u0000${r.b}\u0000${r.c}`;
            const s = metric.get(key);
            if (s) {
                s.n += r.n;
                s.visitors += r.visitors;
            } else metric.set(key, { a: r.a, b: r.b, c: r.c, n: r.n, visitors: r.visitors });
        }
    }
    all(metric: string) {
        return [...(this.sums.get(metric)?.values() ?? [])];
    }
    total(metric: string): Sum {
        return this.all(metric).reduce((t, s) => ({ n: t.n + s.n, visitors: t.visitors + s.visitors }), { n: 0, visitors: 0 });
    }
    one(metric: string, a = "", b = "", c = ""): Sum {
        const s = this.sums.get(metric)?.get(`${a}\u0000${b}\u0000${c}`);
        return { n: s?.n ?? 0, visitors: s?.visitors ?? 0 };
    }
    /** Grouped by one dimension, biggest first. */
    by(metric: string, dim: "a" | "b" | "c" = "a", rank: "n" | "visitors" = "n"): Item[] {
        const grouped = new Map<string, Sum>();
        for (const s of this.all(metric)) {
            const g = grouped.get(s[dim]) ?? { n: 0, visitors: 0 };
            g.n += s.n;
            g.visitors += s.visitors;
            grouped.set(s[dim], g);
        }
        return [...grouped]
            .map(([key, s]) => ({ key, label: key, ...s }))
            .sort((x, y) => y[rank] - x[rank] || x.label.localeCompare(y.label));
    }
}

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
const countryName = (code: string) => {
    if (!code) return "Unknown";
    try {
        return regionNames.of(code) ?? code;
    } catch {
        return code;
    }
};

const ACRONYMS: Record<string, string> = { faq: "FAQ", cta: "CTA", utm: "UTM", ui: "UI", ai: "AI" };

/** "asset-generator" → "Asset generator", "faq" → "FAQ". */
export const humanize = (s: string) =>
    s ? (ACRONYMS[s.toLowerCase()] ?? (s.charAt(0).toUpperCase() + s.slice(1)).replace(/[-_]/g, " ")) : "(none)";

/** p75 by nearest rank over bucketed samples. */
function p75(buckets: { value: number; n: number }[]) {
    const total = buckets.reduce((t, b) => t + b.n, 0);
    if (!total) return null;
    const sorted = [...buckets].sort((x, y) => x.value - y.value);
    const rank = Math.ceil(total * 0.75);
    let seen = 0;
    for (const b of sorted) if ((seen += b.n) >= rank) return b.value;
    return sorted[sorted.length - 1].value;
}

export function buildReport(rows: RollupRow[], range: Range) {
    const cur = new Rows(rows, range.from, range.to);
    const prev = new Rows(rows, range.prevFrom, range.prevTo);

    const views = cur.one("views");
    const prevViews = prev.one("views");
    const funnel = (r: Rows) => Object.fromEntries(FUNNEL_STEPS.map((s) => [s.key, r.one("funnel", s.key).visitors]));
    const steps = funnel(cur);
    const prevSteps = funnel(prev);

    // Daily (or, for today, hourly) views and visitors.
    const trend =
        range.period === "today"
            ? Array.from({ length: 24 }, (_, h) => {
                  const hh = String(h).padStart(2, "0");
                  const s = cur.one("hour", hh);
                  return { key: hh, views: s.n, visitors: s.visitors };
              })
            : range.days.map((day) => {
                  const s = new Rows(rows, day, day).one("views");
                  return { key: day, views: s.n, visitors: s.visitors };
              });

    // How far down the home page: page views that reached each section, over home page views.
    const homeViews = cur.one("page", "/").n;
    const sections = new Map<string, { index: number; section: string; n: number; visitors: number }>();
    for (const s of cur.all("section").filter((s) => s.a === "/")) {
        const key = `${s.c}|${s.b}`;
        const e = sections.get(key) ?? { index: Number(s.c), section: s.b, n: 0, visitors: 0 };
        e.n += s.n;
        e.visitors += s.visitors;
        sections.set(key, e);
    }
    const reach = [...sections.values()].sort((x, y) => x.index - y.index || x.section.localeCompare(y.section));
    const scroll = cur
        .all("scroll")
        .filter((s) => s.a === "/")
        .map((s) => ({ percent: Number(s.b), n: s.n }))
        .sort((x, y) => x.percent - y.percent);

    // Hero words: picks, and what people did after.
    const hero = cur.by("hero", "a", "visitors");
    const heroThen = hero.map((w) => ({
        variant: w.key,
        visitors: w.visitors,
        actions: Object.fromEntries(HERO_ACTIONS.map((a) => [a.key, cur.one("hero_then", w.key, a.key).visitors])),
    }));

    // Reel: page views that opened it, and how far they watched.
    const reelOpens = cur.one("reel", "open").n;
    const reel = [25, 50, 75, 100].map((p) => ({ percent: p, n: cur.one("reel", String(p)).n }));

    // Web vitals at p75, per page, over the period's samples.
    const vitalSamples = new Map<string, Map<string, { value: number; n: number }[]>>();
    for (const s of cur.all("vital")) {
        if (!VITAL_BANDS[s.a]) continue;
        let page = vitalSamples.get(s.b);
        if (!page) vitalSamples.set(s.b, (page = new Map()));
        const list = page.get(s.a) ?? [];
        list.push({ value: Number(s.c), n: s.n });
        page.set(s.a, list);
    }
    const sitewide = new Map<string, { value: number; n: number }[]>();
    for (const page of vitalSamples.values()) for (const [m, list] of page) sitewide.set(m, [...(sitewide.get(m) ?? []), ...list]);
    const vitalRow = (path: string, page: Map<string, { value: number; n: number }[]>) => ({
        path,
        loads: Math.max(0, ...[...page.values()].map((l) => l.reduce((t, b) => t + b.n, 0))),
        metrics: Object.fromEntries(
            VITAL_ORDER.map((m) => {
                const list = page.get(m) ?? [];
                const value = p75(list);
                return [m, value === null ? null : { value, band: bandOf(m, value), samples: list.reduce((t, b) => t + b.n, 0) }];
            }),
        ),
    });
    const vitals = {
        sitewide: vitalRow("All pages", sitewide),
        pages: [...vitalSamples].map(([path, page]) => vitalRow(path, page)).sort((x, y) => y.loads - x.loads),
    };

    const sources = cur.by("source", "a", "visitors").map((s) => ({ ...s, label: s.key || "Direct or unknown" }));
    const campaigns = cur
        .all("utm")
        .map((s) => ({ key: `${s.a}|${s.b}|${s.c}`, label: s.a, sub: [s.b, s.c].filter(Boolean).join(" · "), n: s.n, visitors: s.visitors }))
        .sort((x, y) => y.visitors - x.visitors);

    return {
        range,
        visitors: views.visitors,
        views: views.n,
        prev: { visitors: prevViews.visitors, views: prevViews.n, converted: prevSteps.converted, work: prevSteps.work, visited: prevSteps.visited },
        steps,
        trend,
        pages: cur.by("page"),
        sources,
        campaigns,
        countries: cur.by("country", "a", "visitors").map((s) => ({ ...s, label: countryName(s.key) })),
        devices: cur.by("device", "a", "visitors").map((s) => ({ ...s, label: humanize(s.key || "unknown") })),
        browsers: cur.by("browser", "a", "visitors").map((s) => ({ ...s, label: s.key || "Unknown" })),
        homeViews,
        reach,
        scroll,
        heroOpens: cur.one("event", "hero_menu_open"),
        hero,
        heroThen,
        nav: cur.by("nav").map((s) => ({ ...s, label: humanize(s.key) })),
        navMenus: cur.by("nav", "b"),
        navRows: cur.all("nav").map((s) => ({ item: s.a, menu: s.b, n: s.n })),
        ctas: cur
            .all("cta")
            .map((s) => ({ key: `${s.a}|${s.b}`, label: humanize(s.a), sub: s.b ? `in ${humanize(s.b).toLowerCase()}` : "", n: s.n, visitors: s.visitors }))
            .sort((x, y) => y.n - x.n),
        reelOpens,
        reel,
        faq: cur.by("faq"),
        projects: cur.by("project").map((s) => ({ ...s, label: humanize(s.key) })),
        outbound: cur.by("outbound"),
        forms: cur.all("form").map((s) => ({ form: s.a, ok: s.b === "true", n: s.n })),
        events: cur.by("event"),
        vitals,
        internal: cur.one("internal"),
        sample: cur.total("sample").n,
    };
}

export type Report = ReturnType<typeof buildReport>;
