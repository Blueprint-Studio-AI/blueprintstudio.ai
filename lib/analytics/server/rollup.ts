// A day's events boiled down to the rows the dashboard reads. This is the local
// dev store's copy of analytics_rollup_compute() in the SQL migration: the two
// must agree, metric for metric.
//
// Our own visits (internal) are left out of every metric but "internal".
// Visitors are distinct daily hashes, so they add up across days as visitor-days.
//
//   metric     a            b         c          n                  visitors
//   views      -            -         -          page views         visitors
//   hour       00-23        -         -          page views         visitors
//   page       path         -         -          page views         visitors
//   source     referrer     -         -          landings           visitors
//   utm        source       medium    campaign   landings           visitors
//   country    ISO code     -         -          page views         visitors
//   device     phone/...    -         -          page views         visitors
//   browser    family       -         -          page views         visitors
//   os         family       -         -          page views         visitors
//   event      name         -         -          events             visitors
//   nav        item         menu      -          clicks             visitors
//   cta        cta          section   -          clicks             visitors
//   hero       variant      -         -          picks              visitors
//   hero_then  variant      action    -          actions            visitors (last word picked before the action)
//   section    path         section   index 00   page views         visitors
//   scroll     path         percent   -          page views         visitors
//   reel       open/25/..   -         -          page views         visitors
//   faq        question     -         -          opens              visitors
//   project    project      -         -          opens              visitors
//   outbound   href         -         -          clicks             visitors
//   form       form         ok        -          submits            visitors
//   funnel     step         -         -          visitors           visitors
//   vital      metric       path      bucket     samples            visitors
//   internal   -            -         -          our page views     our visitors

import { hourOf } from "./time";
import type { EventRow, RollupRow } from "./types";

/** The home page section that counts as "reached the work" in the funnel. */
export const WORK_SECTION = "work";

/**
 * A vital rounded to two significant figures, so samples can share rows (SQL:
 * analytics_bucket). Rounded the way Postgres rounds: half away from zero, on
 * the value's 15-digit decimal form. toPrecision rounds the binary value, which
 * puts 0.0385 at 0.038 where Postgres says 0.039.
 */
export function bucket(value: number) {
    if (!(value > 0)) return "0";
    const [mantissa, exponent] = value.toExponential(14).split("e");
    const digits = mantissa.replace(".", "");
    let two = Number(digits.slice(0, 2)) + (Number(digits[2]) >= 5 ? 1 : 0);
    let e = Number(exponent);
    if (two === 100) {
        two = 10;
        e += 1;
    }
    return String(Number(`${two}e${e - 1}`));
}

const prop = (e: EventRow, key: string) => (e.props[key] === undefined ? "" : String(e.props[key]));

/** Which hero_then action an event is, if any. */
function action(e: EventRow) {
    if (e.name === "section_view" && prop(e, "section") === WORK_SECTION) return "work";
    if (e.name === "project_open") return "project";
    if (e.name === "cta_click") return "cta";
    if (e.name === "reel_open") return "reel";
    if (e.name === "booking_made") return "booked";
    if (e.name === "form_submit" && prop(e, "ok") === "true") return "form";
    return null;
}

const FUNNEL: [string, (e: EventRow) => boolean][] = [
    ["visited", (e) => e.name === "pageview"],
    ["work", (e) => (e.name === "section_view" && prop(e, "section") === WORK_SECTION) || e.name === "project_open"],
    ["engaged", (e) => e.name === "project_open" || e.name === "cta_click"],
    ["converted", (e) => e.name === "booking_made" || (e.name === "form_submit" && prop(e, "ok") === "true")],
];

class Tally {
    private rows = new Map<string, { metric: string; a: string; b: string; c: string; n: number; seen: Set<string>; units: Set<string> | null }>();

    /** Count one event; `unit` counts distinct page views (or visitors) instead of events. */
    add(metric: string, a: string, b: string, c: string, visitor: string, unit?: string) {
        const key = JSON.stringify([metric, a, b, c]);
        let row = this.rows.get(key);
        if (!row) this.rows.set(key, (row = { metric, a, b, c, n: 0, seen: new Set(), units: unit === undefined ? null : new Set() }));
        row.seen.add(visitor);
        if (row.units && unit !== undefined) row.units.add(unit);
        else row.n++;
    }

    out(day: string): RollupRow[] {
        return [...this.rows.values()].map(({ metric, a, b, c, n, seen, units }) => ({
            day,
            metric,
            a,
            b,
            c,
            n: units ? units.size : n,
            visitors: seen.size,
        }));
    }
}

/** The rollup rows for one day's events (all rows must be from that day). */
export function rollupDay(day: string, events: EventRow[]): RollupRow[] {
    const t = new Tally();
    const counted = events.filter((e) => !e.internal);

    for (const e of counted) {
        const v = e.visitor;
        switch (e.name) {
            case "pageview":
                t.add("views", "", "", "", v);
                t.add("hour", hourOf(new Date(e.ts)), "", "", v);
                t.add("page", e.path, "", "", v);
                t.add("country", e.country ?? "", "", "", v);
                t.add("device", e.device ?? "", "", "", v);
                t.add("browser", e.browser ?? "", "", "", v);
                t.add("os", e.os ?? "", "", "", v);
                if (e.entry) {
                    t.add("source", e.referrer ?? "", "", "", v);
                    if (e.utm_source) t.add("utm", e.utm_source, e.utm_medium ?? "", e.utm_campaign ?? "", v);
                }
                break;
            case "web_vital":
                if (typeof e.props.value === "number") t.add("vital", prop(e, "metric"), e.path, bucket(e.props.value), v);
                break;
            case "nav_click":
                t.add("nav", prop(e, "item"), prop(e, "menu"), "", v);
                break;
            case "cta_click":
                t.add("cta", prop(e, "cta"), prop(e, "section"), "", v);
                break;
            case "hero_variant":
                t.add("hero", prop(e, "variant"), "", "", v);
                break;
            case "section_view":
                t.add("section", e.path, prop(e, "section"), prop(e, "index").padStart(2, "0"), v, e.pv);
                break;
            case "scroll_depth":
                t.add("scroll", e.path, prop(e, "percent"), "", v, e.pv);
                break;
            case "reel_open":
                t.add("reel", "open", "", "", v, e.pv);
                break;
            case "reel_progress":
                t.add("reel", prop(e, "percent"), "", "", v, e.pv);
                break;
            case "faq_open":
                t.add("faq", prop(e, "question"), "", "", v);
                break;
            case "project_open":
                t.add("project", prop(e, "project"), "", "", v);
                break;
            case "outbound_click":
                t.add("outbound", prop(e, "href"), "", "", v);
                break;
            case "form_submit":
                t.add("form", prop(e, "form"), prop(e, "ok"), "", v);
                break;
        }
        if (e.name !== "pageview" && e.name !== "web_vital") t.add("event", e.name, "", "", v);
    }

    // Per visitor, in time order: the funnel steps reached, and each action
    // credited to the last hero word picked before it.
    const byVisitor = new Map<string, EventRow[]>();
    for (const e of counted) {
        const list = byVisitor.get(e.visitor);
        if (list) list.push(e);
        else byVisitor.set(e.visitor, [e]);
    }
    for (const [v, list] of byVisitor) {
        for (const [step, test] of FUNNEL) if (list.some(test)) t.add("funnel", step, "", "", v, v);
        const timeline = list.map((e, i) => ({ e, i, at: Date.parse(e.ts) })).sort((x, y) => x.at - y.at || x.i - y.i);
        let word: string | null = null;
        for (const { e } of timeline) {
            if (e.name === "hero_variant") word = prop(e, "variant");
            const did = action(e);
            if (did && word !== null) t.add("hero_then", word, did, "", v);
        }
    }

    for (const e of events) if (e.internal && e.name === "pageview") t.add("internal", "", "", "", e.visitor);
    for (const e of events) if (e.sample) t.add("sample", "", "", "", "sample");

    return t.out(day);
}
