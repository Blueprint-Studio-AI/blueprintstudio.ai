import type { BrandConfig } from "@/components/brands/kit/types";

/**
 * A machine-readable design system generated from a BrandConfig.
 *
 * Every line here is a FACT already in the config — palette, type scale, logo
 * system, asset inventory. Nothing is invented: a brand with a real authored
 * doc (see HoneyB) points `agentDoc.file` at that instead, and this is the
 * baseline for brands that don't have one yet.
 *
 * Being derived rather than written is the point — it can't drift from the page
 * a visitor is looking at, because it's built from the same object.
 */
export function brandDocMarkdown(brand: BrandConfig): string {
  const { name, slug, brandInk, overview, families, mono, type, lineup, primary, secondary, accents } = brand;
  const L: string[] = [];

  L.push(`# ${name} — design system`);
  L.push("");
  L.push(
    `> Generated from the ${name} brand page at blueprintstudio.ai/brands/${slug}. Hard values below are the source of` +
      ` truth for tokens, type and logo usage. Drop this into a project and prompt: *"Build X following this."*`,
  );
  L.push("");
  L.push(`**What it covers:** colour tokens, the type scale, and the logo system.`);
  L.push(`**What it does not:** voice, motion, or component specs — those aren't captured on the brand page yet.`);
  L.push("");
  L.push(`## The brand in a line`);
  L.push("");
  L.push(`**${overview.headline} ${overview.headlineFaint}**`);
  L.push("");
  for (const p of overview.body) L.push(p, "");

  /* ── Logo ─────────────────────────────────────────────────────────────── */
  L.push(`## Logo system`);
  L.push("");
  const famKeys = Object.keys(families);
  L.push(
    famKeys.length > 1
      ? `${famKeys.length} families: ${famKeys.map((k) => `**${families[k].label}** (\`${families[k].fill}\`)`).join(", ")}.`
      : `One mark: **${families[famKeys[0]].label}**, brand colour \`${families[famKeys[0]].fill}\`.`,
  );
  L.push("");
  L.push("```yaml");
  L.push("logo:");
  for (const k of famKeys) {
    const f = families[k];
    L.push(`  ${k}:`);
    L.push(`    label: "${f.label}"`);
    L.push(`    fill: "${f.fill}"`);
    L.push(`    marks: [${Object.keys(f.marks).join(", ")}]`);
  }
  L.push(`  monochrome_treatments:`);
  for (const m of mono) L.push(`    ${m.key}: "${m.hex}"   # on ${m.dark ? "dark" : "light"} surfaces`);
  L.push("```");
  L.push("");
  L.push(
    `Marks are single-fill vectors, so they recolour cleanly to the treatments above. Never redraw the mark, ` +
      `re-space the lockup, or apply effects to it.`,
  );
  L.push("");

  /* ── Colour ───────────────────────────────────────────────────────────── */
  L.push(`## Colour`);
  L.push("");
  L.push("```yaml");
  L.push("color:");
  L.push(`  ink: "${brandInk}"`);
  if (primary.length) {
    L.push("  primary:");
    for (const s of primary) L.push(`    ${kebab(s.name)}: "${s.inspect.toUpperCase()}"`);
  }
  if (secondary.length) {
    L.push("  secondary:");
    for (const s of secondary) L.push(`    ${kebab(s.name)}: "${s.inspect.toUpperCase()}"`);
  }
  for (const g of lineup) {
    L.push(`  ${g.tag}:`);
    for (const row of g.rows) for (const [label, hex] of row) L.push(`    "${label}": "${hex.toUpperCase()}"`);
  }
  if (accents.length) {
    L.push("  accent:");
    for (const [label, hex] of accents) L.push(`    ${kebab(label)}: "${hex.toUpperCase()}"`);
  }
  L.push("```");
  L.push("");

  /* ── Type ─────────────────────────────────────────────────────────────── */
  L.push(`## Typography`);
  L.push("");
  L.push("```yaml");
  L.push("type:");
  for (const [key, face] of Object.entries(type)) {
    L.push(`  ${key}:`);
    L.push(`    family: ${face.css}`);
    L.push(`    foundry: "${face.foundry.name}"`);
    L.push(`    scale:`);
    for (const [label, size, lh, ls] of face.rows) {
      L.push(`      "${label}": { size: ${size}px, line_height: ${lh}, letter_spacing: "${ls}" }`);
    }
  }
  L.push("```");
  L.push("");
  L.push(`Line heights are part of the scale — don't hand-tune them per surface.`);
  L.push("");

  /* ── Assets ───────────────────────────────────────────────────────────── */
  L.push(`## Assets`);
  L.push("");
  for (const c of brand.assetCategories) {
    L.push(`- **${c.label}** — ${c.items.length} file${c.items.length === 1 ? "" : "s"}: ${c.items.map((i) => i[0]).join(", ")}`);
  }
  L.push("");
  if (brand.links?.length) {
    L.push(`## Live`);
    L.push("");
    for (const l of brand.links) L.push(`- ${l.label} — ${l.href}`);
    L.push("");
  }
  L.push(`---`);
  L.push("");
  L.push(`*Maintained by Blueprint Studio · blueprintstudio.ai/brands/${slug}*`);
  L.push("");
  return L.join("\n");
}

const kebab = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
