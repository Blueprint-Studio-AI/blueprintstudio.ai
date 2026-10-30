// The Supabase store, over its REST API (PostgREST) with plain fetch: one
// insert per batch, and the SQL functions from the migration for the rest.
// The tables are closed to the public keys; only the service key gets in.

import type { AnalyticsStore } from "./store";
import type { RollupRow } from "./types";

export function supabaseStore(url: string, key: string): AnalyticsStore {
    const base = `${url.replace(/\/$/, "")}/rest/v1`;
    const headers: Record<string, string> = { apikey: key, "Content-Type": "application/json" };
    // Legacy service_role keys are JWTs and go in Authorization too; the newer
    // sb_secret_ keys go only in apikey.
    if (key.startsWith("eyJ")) headers.Authorization = `Bearer ${key}`;

    async function call<T>(path: string, body: unknown, prefer?: string): Promise<T> {
        const res = await fetch(`${base}/${path}`, {
            method: "POST",
            headers: prefer ? { ...headers, Prefer: prefer } : headers,
            body: JSON.stringify(body),
            cache: "no-store",
        });
        if (!res.ok) throw new Error(`analytics: ${path} ${res.status} ${(await res.text()).slice(0, 200)}`);
        return (prefer === "return=minimal" ? undefined : await res.json()) as T;
    }

    // One salt per day per function instance; the database keeps the real one.
    let cached: { day: string; salt: string } | undefined;

    return {
        kind: "supabase",
        async insert(rows) {
            // Seed data is local-only and never goes to the database.
            if (rows.some((r) => r.sample)) throw new Error("analytics: sample rows can't be written to Supabase");
            await call("analytics_events", rows.map(({ sample: _, ...row }) => row), "return=minimal");
        },
        async salt(day) {
            if (cached?.day === day) return cached.salt;
            const salt = await call<string>("rpc/analytics_salt", { d: day });
            cached = { day, salt };
            return salt;
        },
        async report(from, to) {
            const rows = await call<RollupRow[]>("rpc/analytics_report", { from_day: from, to_day: to });
            return rows.map((r) => ({ ...r, n: Number(r.n), visitors: Number(r.visitors) }));
        },
        async live(minutes) {
            return Number(await call<number>("rpc/analytics_live", { minutes }));
        },
    };
}

