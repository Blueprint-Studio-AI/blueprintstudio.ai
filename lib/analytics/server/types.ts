// The shapes the collector writes and the dashboard reads. The Supabase tables
// in supabase/migrations/*_first_party_analytics.sql have the same columns.

export type PropValue = string | number | boolean;

/** One stored event, enriched by the collector. */
export type EventRow = {
    ts: string; // ISO time the event happened (the server's clock)
    day: string; // YYYY-MM-DD in REPORT_TIME_ZONE
    name: string;
    path: string;
    props: Record<string, PropValue>;
    visitor: string; // the daily-rotating hash
    pv: string; // the page view's random id
    entry: boolean; // the page a full page load landed on
    referrer: string | null;
    utm_source: string | null;
    utm_medium: string | null;
    utm_campaign: string | null;
    country: string | null;
    device: string | null;
    browser: string | null;
    os: string | null;
    internal: boolean;
    /** Seed data, local dev store only. Never written to Supabase. */
    sample?: boolean;
};

/**
 * One line of a day's rollup: a metric, up to three dimensions, a count and
 * distinct visitors. See rollup.ts for what each metric's dimensions are.
 */
export type RollupRow = {
    day: string;
    metric: string;
    a: string;
    b: string;
    c: string;
    n: number;
    visitors: number;
};
