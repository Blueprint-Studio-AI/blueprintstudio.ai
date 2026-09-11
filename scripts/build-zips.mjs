// Builds the brand-page download zips from the loose files in /public.
//
// The zips used to be committed, but every file in them already sat loose next
// to them — each asset was stored twice, and re-exporting a kit added the whole
// zip to git history again. Now the loose files are the only copy: edit one,
// and the zip that contains it is rebuilt on the next `dev` or `build`.
// Generated zips are gitignored (public/**/*.zip).
//
// Every zip also carries the brand's design system for coding agents as
// design.md, at the top level — the same file the page's "Copy design.md" and
// "Download design.md" buttons serve. It's built from the brand's data file (lib/brands/<slug>.ts), unless the brand points
// `agentDoc.file` at a hand-authored file in /public (HoneyB), which is used
// as-is. Run with --experimental-strip-types so the .ts data files load.
//
// ponytail: hand-kept manifest. Derive it from each BrandConfig's `downloads`
// if the brand count grows enough for the two to drift.
import { existsSync, readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { zipSync, strToU8 } from "fflate";
import { arch } from "../lib/brands/arch.ts";
import { archPrime } from "../lib/brands/arch-prime.ts";
import { honeyb } from "../lib/brands/honeyb.ts";
import { jinba } from "../lib/brands/jinba.ts";
import { brandDocMarkdown } from "../lib/brands/doc.ts";

const PUBLIC = join(dirname(new URL(import.meta.url).pathname), "..", "public");

// output (relative to /public) → [brand, [folder inside the zip, source folder, skip?][]]
// `skip` is a regex of names to leave out, or an array of the only names to include.
// Zip names always start with the brand's own name, never a shared prefix. Every
// zip has the same shape: design.md at the top, files under assets/, tokens in css/.
// Every asset the brand page lists, category by category — read from the data
// file, so the kit always matches the page. `rename` maps a category id to a
// different folder name in the zip (HoneyB's "assets" category would be assets/assets).
const pageAssets = (brand, rename = {}) =>
  brand.assetCategories.map((c) => [`assets/${rename[c.id] ?? c.id}`, c.dir.slice(1), c.items.map((i) => i[1])]);

const GIF = /\.gif$/i; // the GIF exports are big; the page offers them one by one instead
const ZIPS = {
  // Arch Network + Arch Prime: NOT single-sourced yet. These list folders, copied
  // from Nick's original review-app zips, rather than reading the page's asset
  // lists like Jinba/HoneyB below. Nick's folders line up with the page tabs, so
  // the kits come out almost the same as the page, except:
  //   + recoloured logo files (orange/white) — the page makes these on the fly
  //   + motion poster frames (Arch Network) and the hero photo (Arch Prime)
  //   − the motion GIFs, left out on purpose (~26 MB); the page offers them per clip
  //   · folders follow the site's folders, not the page's tabs (Arch Network's
  //     "Social" share images sit in assets/photo, "Primitives" in assets/diagrams)
  // To single-source: switch them to pageAssets() + the logo folder + the motion
  // clip list, like the Jinba/HoneyB kits.
  "brands/arch/downloads/arch-network-logos.zip": [arch, [["assets/logos", "brands/arch/logos"]]],
  "brands/arch/downloads/arch-network-assets.zip": [arch, [
    ["assets/photo", "brands/arch/photo"],
    ["assets/diagrams", "brands/arch/diagrams"],
    ["assets/partners", "brands/arch/partners"],
    ["assets/ecosystem", "brands/arch/ecosystem"],
  ]],
  "brands/arch/downloads/arch-network-motion.zip": [arch, [["assets/motion", "brands/arch/motion", GIF]]],
  "brands/arch/downloads/arch-network-brand-kit.zip": [arch, [
    ["assets/logos", "brands/arch/logos"],
    ["assets/photo", "brands/arch/photo"],
    ["assets/diagrams", "brands/arch/diagrams"],
    ["assets/partners", "brands/arch/partners"],
    ["assets/ecosystem", "brands/arch/ecosystem"],
    ["assets/motion", "brands/arch/motion", GIF],
    ["css", "brands/arch/downloads"], // the tokens file; the zips beside it are skipped
  ]],
  "brands/arch-prime/downloads/arch-prime-logos.zip": [archPrime, [["assets/logos", "brands/arch-prime/logos"]]],
  "brands/arch-prime/downloads/arch-prime-assets.zip": [archPrime, [
    ["assets/photo", "brands/arch-prime/photo"],
    ["assets/buildings", "brands/arch-prime/buildings"],
  ]],
  "brands/arch-prime/downloads/arch-prime-brand-kit.zip": [archPrime, [
    ["assets/logos", "brands/arch-prime/logos"],
    ["assets/photo", "brands/arch-prime/photo"],
    ["assets/buildings", "brands/arch-prime/buildings"],
    ["assets/samples", "brands/arch-prime/samples"],
    ["css", "brands/arch-prime/downloads"],
  ]],
  "brands/honeyb/downloads/honeyb-logos.zip": [honeyb, [["assets/logos", "brands/honeyb/logos"]]],
  "brands/honeyb/downloads/honeyb-brand-kit.zip": [honeyb, [
    ["assets/logos", "brands/honeyb/logos"],
    ...pageAssets(honeyb, { assets: "graphics" }),
    ["css", "brands/honeyb/downloads"],
  ]],
  "brands/jinba/downloads/jinba-logos.zip": [jinba, [
    ["assets/logos", "brands/jinba/dl"],
    ["assets/sub-brands", "brands/jinba/sub-brands"],
  ]],
  "brands/jinba/downloads/jinba-brand-kit.zip": [jinba, [
    ["assets/logos", "brands/jinba/dl"],
    ["assets/sub-brands", "brands/jinba/sub-brands"],
    ...pageAssets(jinba),
    ["assets/business-cards", "brands/jinba/business-cards"], // .ai print files — kit only, the page can't preview them
    ["css", "brands/jinba/downloads"],
  ]],
};

// Already-compressed formats are stored as-is; deflating them again only costs time.
const STORED = /\.(png|jpe?g|gif|webp|mp4|webm|zip|woff2?)$/i;

const designDoc = (brand) => {
  const file = brand.agentDoc && join(PUBLIC, brand.agentDoc.file);
  return file && existsSync(file) ? readFileSync(file) : strToU8(brandDocMarkdown(brand));
};

for (const [out, [brand, sources]] of Object.entries(ZIPS)) {
  const files = {};
  for (const [inZip, src, skip] of sources) {
    for (const name of readdirSync(join(PUBLIC, src)).sort()) {
      // never zip dotfiles (.DS_Store), other zips, or skipped types
      if (name.startsWith(".") || name.endsWith(".zip")) continue;
      if (Array.isArray(skip) ? !skip.includes(name) : skip?.test(name)) continue;
      const path = join(PUBLIC, src, name);
      if (!statSync(path).isFile()) continue;
      files[inZip ? `${inZip}/${name}` : name] = [readFileSync(path), { level: STORED.test(name) ? 0 : 6 }];
    }
  }
  if (!Object.keys(files).length) throw new Error(`${out}: no files found — check the manifest paths`);
  for (const [inZip, src, skip] of sources)
    if (Array.isArray(skip))
      for (const name of skip)
        if (!files[`${inZip}/${name}`]) throw new Error(`${out}: ${src}/${name} is listed on the page but missing`);
  files["design.md"] = designDoc(brand);
  writeFileSync(join(PUBLIC, out), zipSync(files));
}
console.log(`build-zips: wrote ${Object.keys(ZIPS).length} zips`);
