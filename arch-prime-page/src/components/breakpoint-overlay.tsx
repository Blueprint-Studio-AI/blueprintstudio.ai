"use client";

// DEV overlay — a fixed pill at the top that names the CTA city tiers and highlights the
// one the current viewport is in, so we can refer to breakpoints by name while dialing.
// Remove this component (and its mount in chain/layout.tsx) before shipping.

import { useEffect, useState } from "react";

// Tier boundaries match chain-city.tsx (CITY_MOBILE / CITY_SM_MD / CITY_LARGE).
const TIERS = [
  { name: "Mobile", range: "<640", min: 0, max: 639 },
  { name: "Sm-Med", range: "640–1024", min: 640, max: 1023 },
  { name: "Large", range: "≥1024", min: 1024, max: Infinity },
];

export function BreakpointOverlay() {
  const [w, setW] = useState<number | null>(null);

  useEffect(() => {
    const on = () => setW(document.documentElement.clientWidth);
    on();
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);

  if (w === null) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 8,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 2147483647,
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        gap: 3,
        padding: "4px 6px",
        borderRadius: 9999,
        background: "rgba(15,15,18,0.9)",
        color: "#fff",
        font: "600 10px/1 ui-monospace, SFMono-Regular, Menlo, monospace",
        letterSpacing: "0.01em",
        maxWidth: "96vw",
        boxShadow: "0 2px 12px rgba(0,0,0,0.35)",
        backdropFilter: "blur(6px)",
      }}
    >
      <span style={{ opacity: 0.55, padding: "0 4px" }}>{w}px</span>
      {TIERS.map((t) => {
        const active = w >= t.min && w <= t.max;
        return (
          <span
            key={t.name}
            style={{
              padding: "4px 7px",
              borderRadius: 9999,
              background: active ? "#ec641d" : "transparent",
              color: active ? "#fff" : "rgba(255,255,255,0.5)",
              whiteSpace: "nowrap",
            }}
          >
            {t.name} {t.range}
          </span>
        );
      })}
    </div>
  );
}
