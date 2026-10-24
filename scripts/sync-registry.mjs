// Copies the client registry's public fields into data/registry.json, so the
// site's tiers, years and client list come from the registry, not from lists
// typed into the code. Run it whenever the registry changes:
//
//   node scripts/sync-registry.mjs [path/to/registry.json]
//
// Only whitelisted fields are copied. The registry's internal notes, flags,
// sources and image notes never reach the repo or the site.
import { readFileSync, writeFileSync } from "node:fs";

const SRC =
  process.argv[2] ?? "/Users/tylerstupart/Projects/Blueprint/Internal/review-2026-10-23/client-registry/registry.json";
const OUT = new URL("../data/registry.json", import.meta.url).pathname;

const registry = JSON.parse(readFileSync(SRC, "utf8"));
const yes = (v) => (typeof v === "object" && v ? v.value : v) !== "no";

const clients = registry.clients.map((c) => ({
  slug: c.slug,
  name: c.name,
  tier: c.tier ?? "Archive",
  years: c.years && c.years !== "unknown" ? c.years : "",
  engagement: c.engagement === "Partnership" || c.engagement === "Project" ? c.engagement : "Unknown",
  trading: yes(c.trading),
  // What we made, by type and year; confidential work is dropped here, not just hidden later.
  work: (c.work ?? [])
    .filter((w) => w.visibility !== "confidential")
    .map((w) => ({ type: w.type, year: w.year ?? "", visibility: w.visibility === "public" ? "public" : "private" })),
}));

writeFileSync(OUT, JSON.stringify({ generated: registry.generated ?? null, clients }, null, 1) + "\n");
console.log(`data/registry.json: ${clients.length} clients`);
