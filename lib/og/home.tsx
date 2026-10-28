import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// The site's link preview (Slack, iMessage, LinkedIn, X): the logo, the home
// page's headline, and a frame of our own work from the showreel (TokenWorks'
// iDVisor film). Composed at build time; app/opengraph-image.tsx and
// app/twitter-image.tsx mount it, and Next writes the og:image tags.

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_ALT = "Blueprint Studio: the design and build partner for founders";

/** A file as a data URI, since satori can't fetch relative URLs. Build time only. */
async function dataUri(path: string, mime: string) {
  const bytes = await readFile(join(process.cwd(), path));
  return `data:${mime};base64,${bytes.toString("base64")}`;
}

export async function homeOgImage() {
  const [mark, word, frame, inter] = await Promise.all([
    dataUri("public/blueprint-logo.svg", "image/svg+xml"),
    dataUri("public/blueprint-wordmark-dark.svg", "image/svg+xml"),
    dataUri("public/og/home-tokenworks-idvisor.jpg", "image/jpeg"),
    readFile(join(process.cwd(), "lib/og/Inter-Medium.ttf")),
  ]);
  // The lockup at the nav's proportions: the wordmark is 142 x 23 beside a square mark.
  const H = 32;

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", position: "relative", background: "#F4F4F4", fontFamily: "Inter" }}>
        <div style={{ position: "absolute", left: 72, top: 64, display: "flex", alignItems: "center", gap: H * 0.62 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={mark} alt="" width={H} height={H} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={word} alt="Blueprint Studio" width={Math.round((H * 142) / 23)} height={H} />
        </div>
        <div style={{ position: "absolute", left: 72, top: 178, width: 560, display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 60, lineHeight: 1.04, letterSpacing: -2.2, color: "#0A0A0A" }}>The design and build partner for founders.</div>
          <div style={{ marginTop: 26, fontSize: 28, lineHeight: 1.25, letterSpacing: -0.6, color: "#8E8E93" }}>
            We make apps, websites, brands and launch videos, from first sketch to launch.
          </div>
        </div>
        {/* The frame runs off the right edge, as if the reel carries on past it. */}
        <div style={{ position: "absolute", left: 680, top: 118, width: 640, height: 360, display: "flex", borderRadius: 22, overflow: "hidden", boxShadow: "0 30px 60px -20px rgba(0,0,0,0.35)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={frame} alt="" width={640} height={360} style={{ objectFit: "cover" }} />
        </div>
        <div style={{ position: "absolute", left: 72, bottom: 60, display: "flex", fontSize: 22, color: "#0A0A0A" }}>blueprintstudio.ai</div>
      </div>
    ),
    { ...OG_SIZE, fonts: [{ name: "Inter", data: inter, weight: 500, style: "normal" }] },
  );
}
