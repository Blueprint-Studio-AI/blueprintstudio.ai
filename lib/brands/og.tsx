import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { BrandConfig } from "@/components/brands/kit/types";

// The link's first impression in Slack / LinkedIn. Composed at build time from
// the same art and lockup the hero uses, so the unfurl looks like the page
// rather than like a fallback. A brand route mounts it as:
//
//   export default () => brandOgImage(someBrand)
//
// in its opengraph-image.tsx, and Next injects the og:image tags itself.

export const OG_SIZE = { width: 1200, height: 630 };

const DARK_SCRIM = "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.25) 100%)";
const MIME: Record<string, string> = { svg: "image/svg+xml", png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", webp: "image/webp" };

/** Inline a /public file as a data URI — satori can't fetch relative URLs. */
async function dataUri(publicPath: string) {
  const bytes = await readFile(join(process.cwd(), "public", publicPath));
  const ext = publicPath.split(".").pop()?.toLowerCase() ?? "";
  return `data:${MIME[ext] ?? "application/octet-stream"};base64,${bytes.toString("base64")}`;
}

export async function brandOgImage(b: BrandConfig) {
  const { hero } = b;
  const [art, lockup] = await Promise.all([dataUri(hero.image), dataUri(hero.lockup)]);
  const overlay = hero.overlay === undefined ? DARK_SCRIM : hero.overlay;
  const band = hero.art === "band";
  const { width, height } = OG_SIZE;

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", position: "relative", background: hero.background ?? b.brandInk }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={art}
          alt=""
          width={width}
          height={band ? Math.round(height * 0.46) : height}
          style={band
            ? { position: "absolute", left: 0, bottom: 0, objectFit: "cover", objectPosition: "bottom", opacity: 0.66 }
            : { position: "absolute", inset: 0, objectFit: "cover" }}
        />
        {overlay && <div style={{ position: "absolute", inset: 0, background: overlay }} />}
        <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, width: "100%", height: "100%" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lockup} alt={b.name} width={600} style={{ maxHeight: 160, objectFit: "contain" }} />
          {hero.tagline && (
            <div style={{ color: hero.taglineColor ?? "#faf8f3", fontSize: 26, letterSpacing: 0.5, display: "flex" }}>{hero.tagline}</div>
          )}
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
