// The link's first impression in Slack / LinkedIn. Composed at build time from
// the same open-water photo and lockup the hero uses, so the unfurl looks like the
// page rather than like a fallback.
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { GLYPH_PATHS, WORDMARK_PATH, LOCKUP_VIEWBOX } from "@/lib/logo-paths";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "RWY — Brand Identity, Design System, Logo System, 2026";

// Literal path at the readFile call site — a path built from a function
// parameter can evade Vercel's file tracing if this route ever goes dynamic.
export default async function Image() {
  const bytes = await readFile(join(process.cwd(), "public/assets/photo/hero-water.jpg"));
  const bg = `data:image/jpeg;base64,${bytes.toString("base64")}`;
  // 1952×1068 source: fit the width, centre the vertical overflow
  const h = Math.round((1200 * 1068) / 1952);

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", position: "relative", background: "#05384B" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={bg} alt="" width={1200} height={h} style={{ position: "absolute", top: -(h - 630) / 2, left: 0 }} />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <svg viewBox={LOCKUP_VIEWBOX} width={440} height={140} fill="none">
            {GLYPH_PATHS.map((d, i) => (
              <path key={i} d={d} fill="#FDFCFB" />
            ))}
            <path d={WORDMARK_PATH} fill="#FDFCFB" />
          </svg>
        </div>
      </div>
    ),
    size,
  );
}
