// Where events are kept. Three stores behind one interface:
//
// - supabase: when ANALYTICS_SUPABASE_URL and ANALYTICS_SUPABASE_SERVICE_KEY
//   are set. Its own variables on purpose: the newsletter's Supabase settings
//   (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_KEY) are never read here.
// - local: a file under .analytics/, in development or with ANALYTICS_STORE=local,
//   so the whole pipeline runs with no settings at all.
// - none: production without a database. Events are accepted and dropped.

import { localStore } from "./local-store";
import { supabaseStore } from "./supabase-store";
import type { EventRow, RollupRow } from "./types";

export interface AnalyticsStore {
    kind: "supabase" | "local" | "none";
    insert(rows: EventRow[]): Promise<void>;
    /** Today's random salt for visitor hashes, created on first use. */
    salt(day: string): Promise<string>;
    /** Rollup rows for every day from `from` to `to` (YYYY-MM-DD, inclusive). */
    report(from: string, to: string): Promise<RollupRow[]>;
    /** Distinct visitors (not ours) with an event in the last `minutes`. */
    live(minutes: number): Promise<number>;
}

const noStore: AnalyticsStore = {
    kind: "none",
    insert: async () => {},
    salt: async () => "",
    report: async () => [],
    live: async () => 0,
};

let store: AnalyticsStore | undefined;

export function getStore(): AnalyticsStore {
    if (store) return store;
    const url = process.env.ANALYTICS_SUPABASE_URL;
    const key = process.env.ANALYTICS_SUPABASE_SERVICE_KEY;
    if (url && key) store = supabaseStore(url, key);
    else if (process.env.ANALYTICS_STORE === "local" || process.env.NODE_ENV !== "production") store = localStore();
    else store = noStore;
    return store;
}
