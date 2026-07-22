// Build the public "design system for coding agents" doc from a brand's
// internal DESIGN.md.
//
// WHY THIS EXISTS
// The source DESIGN.md (github.com/honeybtc/brand-kit) is an INTERNAL document.
// It carries an asset-generator invite token, unlisted/auth-gated deploy URLs,
// a list of private repos including an unannounced product, the Vercel team
// name, Linear ticket ids, and a section cataloguing bugs in HoneyB's live
// code. None of that can sit behind a public "copy" button on a marketing site.
//
// Everything an agent actually needs to build on-brand UI — tokens, type,
// colour, components, motion, voice — is in §1–§5 and is safe to publish. So we
// generate the public file rather than hand-maintaining a fork, which would
// drift the moment the source is updated (the source's own README warns that a
// stale design doc is worse than none).
//
// Usage:
//   node scripts/build-agent-doc.mjs <source DESIGN.md> <output .md>
//
// The build FAILS if any redaction pattern survives, so a new leak in an
// updated source cannot slip through silently.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const [, , SRC, OUT] = process.argv;
if (!SRC || !OUT) {
  console.error("usage: node scripts/build-agent-doc.mjs <source.md> <out.md>");
  process.exit(1);
}

/** Top-level sections dropped wholesale — internal by nature. */
const DROP_SECTIONS = [
  /^## Company, products & resources/i, // repos, deploy URLs, invite token, team
  /^## 6\. Known inconsistencies/i, // a bug list for HoneyB's production code
  /^## 7\. Maintenance/i, // internal process + ticket refs
];

/**
 * Fragments scrubbed inline wherever they appear in the sections we keep.
 * NB: hostnames appear both as full URLs and as bare hostnames inside inline
 * code (`webapp-theta-topaz.vercel.app`), so the protocol must be optional —
 * requiring it let two deploy URLs through on the first run.
 */
const REDACT = [
  /(?:https?:\/\/)?tools\.blueprintstudio\.ai\/invite\/[^\s`"')]+/g,
  /(?:https?:\/\/)?[a-z0-9-]+\.vercel\.app[^\s`"')]*/g,
  /(?:https?:\/\/)?(?:www\.)?github\.com\/honeybtc[^\s`"')]*/g,
  /\bhoneybtc\/(?:webapp|landing-page|offchain-client-dashboard|docs|brand-kit|doubledigit-[a-z]+)\b/g,
  /(?:https?:\/\/)?(?:www\.)?figma\.com\/[^\s`"')]+/g,
  /\b(?:app|dashboard)\.honeybtc\.com\b/g, // unlaunched subdomains
  /\bBPSTU-\d+\b/g,
  /\bhoney-b-eng\b/g,
];

/**
 * Clause-level cleanup. Scrubbing a URL out of prose leaves "Repo: · deploy ``
 * (custom domain `` pending)." — remove the whole clause, not just the link.
 */
const TIDY = [
  [/\s*Repo:\s*·?\s*/g, " "],
  [/\s*·?\s*deploy\s*`\s*`\s*/g, " "],
  [/\s*\(custom domain\s*`?\s*`?\s*(?:NOT live yet|pending|not wired up yet)?\s*\)\.?/gi, ""],
];

/** Independent, deliberately broader net for the final check. */
const FORBIDDEN = [
  /vercel\.app/i,
  /github\.com\/honeybtc/i,
  /honeybtc\/(?:webapp|landing-page|offchain|doubledigit|brand-kit|docs)/i,
  /figma\.com/i,
  /\/invite\//i,
  /BPSTU-\d+/i,
  /honey-b-eng/i,
  /\b(?:app|dashboard)\.honeybtc\.com\b/i,
];

const src = readFileSync(SRC, "utf8");

/* ── 1. drop internal sections ──────────────────────────────────────────── */
const lines = src.split("\n");
const kept = [];
let dropping = false;
for (const line of lines) {
  if (/^## /.test(line)) dropping = DROP_SECTIONS.some((re) => re.test(line));
  if (!dropping) kept.push(line);
}

/* ── 2. scrub inline fragments, then tidy the punctuation they leave ────── */
let out = kept.join("\n");
for (const re of REDACT) out = out.replace(re, "");
for (const [re, to] of TIDY) out = out.replace(re, to);
out = out
  .replace(/`\s*`/g, "") // emptied inline-code spans
  .replace(/\(\s*\)/g, "") // "( )"
  .replace(/[ \t]{2,}/g, " ")
  .replace(/[ \t]+$/gm, "")
  .replace(/\n{3,}/g, "\n\n");

/* ── 3. strip the in-doc nav links that point at dropped sections ───────── */
out = out.replace(/^- \*\*\[Company, products & resources\].*$/gm, "");

/* ── 4. provenance header ───────────────────────────────────────────────── */
const header = `<!--
  HoneyB — design system for coding agents (public build)

  Generated from HoneyB's internal DESIGN.md by scripts/build-agent-doc.mjs.
  This is the PUBLIC subset: the design system itself (foundation, website,
  on-chain app, custodial app, cross-surface reference). Internal sections —
  repos, deploy URLs, access links, team, and the live-code issue list — are
  removed at build time and are not part of this file.

  Maintained by Blueprint Studio · blueprintstudio.ai/brands/honeyb
-->

`;
out = header + out.trimStart() + "\n";

/* ── 5. verify — refuse to emit a file that still leaks ─────────────────── */
const leaks = [];
for (const re of FORBIDDEN) {
  out.split("\n").forEach((line, i) => {
    if (re.test(line)) leaks.push(`line ${i + 1}: ${line.trim().slice(0, 110)}`);
  });
}
if (leaks.length) {
  console.error("REFUSING TO WRITE — redaction incomplete:\n  " + [...new Set(leaks)].join("\n  "));
  process.exit(1);
}

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, out, "utf8");

const kb = (Buffer.byteLength(out) / 1024).toFixed(1);
console.log(
  `wrote ${OUT}\n  ${out.split("\n").length} lines · ${kb} KB` +
    `  (source: ${lines.length} lines, ${(Buffer.byteLength(src) / 1024).toFixed(1)} KB)`,
);
