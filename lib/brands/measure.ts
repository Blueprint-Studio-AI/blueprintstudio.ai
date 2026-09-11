import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import type { BrandConfig } from "@/components/brands/kit/types";

// File sizes and zip contents for a brand page, read off disk.
//
// This runs where the page renders, and the /brands pages are force-static, so
// it runs once per deploy during the build and the numbers are baked into the
// HTML: nothing is measured per visit. (In `next dev` it runs per request,
// which is a handful of stat calls.) It replaces hand-typed sizes that drifted
// every time a file was swapped. A listed file that doesn't exist fails the
// build instead of showing a made-up number.

const onDisk = (publicPath: string) => join(process.cwd(), "public", publicPath);

export const formatBytes = (n: number) =>
  n >= 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`;

/** Entry count from a zip's end-of-central-directory record (last 22+ bytes). */
function zipEntries(path: string) {
  const buf = readFileSync(path);
  const eocd = buf.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
  if (eocd < 0) throw new Error(`${path}: not a zip`);
  return buf.readUInt16LE(eocd + 10);
}

export function measure(brand: BrandConfig): BrandConfig {
  const fileSizes: Record<string, string> = {};
  const size = (p: string) => (fileSizes[p] = formatBytes(statSync(onDisk(p)).size));

  for (const c of brand.assetCategories) for (const [, file] of c.items) size(`${c.dir}/${file}`);
  for (const href of Object.values(brand.downloads)) if (href?.startsWith("/")) size(href);

  const logos = brand.downloads.logos;
  return {
    ...brand,
    fileSizes,
    // every logo zip also carries design.md, which isn't a logo file
    kit: logos ? { logoFiles: zipEntries(onDisk(logos)) - 1, logoZip: fileSizes[logos] } : undefined,
  };
}
