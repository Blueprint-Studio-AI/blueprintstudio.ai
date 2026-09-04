// The link's first impression in Slack / LinkedIn. Composed at build time from
// the same photograph and lockup the hero uses, so the unfurl looks like the
// page rather than like a fallback.
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { GLYPH_PATHS, WORDMARK_PATH, LOCKUP_VIEWBOX } from "@/lib/logo-paths";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Arch Network — Brand Identity, Design System, Logo System, 2026";

// Literal path at the readFile call site — a path built from a function
// parameter can evade Vercel's file tracing if this route ever goes dynamic.
export default async function Image() {
  const bytes = await readFile(join(process.cwd(), "public/assets/photo/stats.jpg"));
  const bg = `data:image/jpeg;base64,${bytes.toString("base64")}`;
  // 2646×794 source: fit the height, centre the overflow
  const w = Math.round((2646 / 794) * 630);

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", position: "relative", background: "#181818" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={bg} alt="" width={w} height={630} style={{ position: "absolute", top: 0, left: -(w - 1200) / 2 }} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(24,24,24,0.4) 30%, rgba(24,24,24,0.4) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 26,
            width: "100%",
            height: "100%",
          }}
        >
          <svg viewBox={LOCKUP_VIEWBOX} width={420} height={120} fill="none">
            {GLYPH_PATHS.map((d, i) => (
              <path key={i} d={d} fill="#FFFFFF" />
            ))}
            <path d={WORDMARK_PATH} fill="#FFFFFF" />
          </svg>
          <div style={{ color: "#f3efd7", fontSize: 26, letterSpacing: 0.5, display: "flex" }}>
            Brand Identity · Design System · Logo System · 2026
          </div>
        </div>
      </div>
    ),
    size,
  );
}
