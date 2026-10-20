// The link's first impression in Slack / LinkedIn. Composed at build time from
// the same hero art and lockup the page uses, so the unfurl looks like the page
// rather than like a fallback.
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Jinba — Brand Identity, Design System, Logo System, 2026";

// Literal paths at the readFile call sites — a path built from a function
// parameter can evade Vercel's file tracing if this route ever goes dynamic.
export default async function Image() {
  const [heroBytes, lockupBytes] = await Promise.all([
    readFile(join(process.cwd(), "public/assets/hero.jpg")),
    readFile(join(process.cwd(), "public/assets/dl/lockup-white.png")),
  ]);
  const bg = `data:image/jpeg;base64,${heroBytes.toString("base64")}`;
  const lockup = `data:image/png;base64,${lockupBytes.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", position: "relative" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={bg} alt="" width={1200} height={675} style={{ position: "absolute", top: -22, left: 0, objectFit: "cover" }} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 45%, rgba(0,0,0,0.5) 100%)",
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lockup} alt="" width={420} height={92} />
          <div style={{ color: "#faf8f3", fontSize: 26, letterSpacing: 0.5, display: "flex" }}>
            Brand Identity · Design System · Logo System · 2026
          </div>
        </div>
      </div>
    ),
    size,
  );
}
