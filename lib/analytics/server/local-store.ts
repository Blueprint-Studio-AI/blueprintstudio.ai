// The local dev store: one JSON line per event in .analytics/events.ndjson
// (or ANALYTICS_DEV_FILE), rolled up on read with rollup.ts. For development
// and tests only; a serverless filesystem doesn't keep it.

import { appendFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { randomBytes } from "node:crypto";
import path from "node:path";
import { rollupDay } from "./rollup";
import { addDays, daysBetween } from "./time";
import type { AnalyticsStore } from "./store";
import type { EventRow } from "./types";

export const localEventsFile = () => process.env.ANALYTICS_DEV_FILE || path.join(process.cwd(), ".analytics", "events.ndjson");

async function readEvents(file: string): Promise<EventRow[]> {
    let text: string;
    try {
        text = await readFile(file, "utf8");
    } catch {
        return [];
    }
    const rows: EventRow[] = [];
    for (const line of text.split("\n")) {
        if (!line) continue;
        try {
            rows.push(JSON.parse(line));
        } catch {}
    }
    return rows;
}

export function localStore(): AnalyticsStore {
    const file = localEventsFile();
    const saltFile = path.join(path.dirname(file), "salts.json");

    return {
        kind: "local",
        async insert(rows) {
            await mkdir(path.dirname(file), { recursive: true });
            await appendFile(file, rows.map((r) => JSON.stringify(r)).join("\n") + "\n");
        },
        async salt(day) {
            let salts: Record<string, string> = {};
            try {
                salts = JSON.parse(await readFile(saltFile, "utf8"));
            } catch {}
            if (salts[day]) return salts[day];
            // Like the database: today's and yesterday's salts, nothing older.
            const kept = Object.fromEntries(Object.entries(salts).filter(([d]) => d >= addDays(day, -1)));
            kept[day] = randomBytes(32).toString("hex");
            await mkdir(path.dirname(saltFile), { recursive: true });
            await writeFile(saltFile, JSON.stringify(kept));
            return kept[day];
        },
        async report(from, to) {
            const byDay = new Map<string, EventRow[]>(daysBetween(from, to).map((d) => [d, []]));
            for (const e of await readEvents(file)) byDay.get(e.day)?.push(e);
            return [...byDay].flatMap(([day, events]) => rollupDay(day, events));
        },
        async live(minutes) {
            const since = Date.now() - minutes * 60_000;
            const seen = new Set<string>();
            for (const e of await readEvents(file)) if (!e.internal && Date.parse(e.ts) >= since) seen.add(e.visitor);
            return seen.size;
        },
    };
}
