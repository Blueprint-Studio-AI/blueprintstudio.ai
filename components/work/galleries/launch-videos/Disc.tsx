"use client";

import { useId } from "react";
import { motion, type MotionValue } from "framer-motion";
import { FilmImg } from "./FilmImg";
import type { Film } from "./shared";

// Rings of the disc, as a share of its radius: the hole, the clear hub, the
// mirror band, then the printed face out to the rim.
const HOLE = 7.5;
const HUB = 27;
const PRINT = 33;

const annulus = (inner: number, outer = 100) =>
  `radial-gradient(circle closest-side, transparent ${inner}%, #000 ${inner + 0.4}%, #000 ${outer - 0.4}%, transparent ${outer}%)`;

/**
 * A picture disc: the film's key frame printed on its face with the client and
 * the film's name around the rim. Only the print turns (`rotate`); the light
 * on it, the mirror band and the clear hub stay put, as they do on a real disc.
 */
export function Disc({
  film,
  size,
  rotate = 0,
  className = "",
}: {
  film: Film;
  size: number;
  rotate?: MotionValue<number> | number;
  className?: string;
}) {
  const path = `disc-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const ring = `${film.client}  ·  ${film.title}  ·  ${film.year}`.toUpperCase();

  return (
    <div
      className={`relative rounded-full ${className}`}
      style={{ width: size, height: size, boxShadow: "0 1px 2px rgba(0,0,0,0.25), 0 8px 18px -6px rgba(0,0,0,0.35)" }}
    >
      {/* The print, and what turns with it */}
      <motion.div className="absolute inset-0 rounded-full" style={{ rotate }}>
        <div className="absolute inset-0 overflow-hidden rounded-full" style={{ maskImage: annulus(PRINT), WebkitMaskImage: annulus(PRINT) }}>
          {/* One size for every disc (in its case, in the air, in the player), so it's loaded once. */}
          <FilmImg src={film.hero.poster} remote={film.hero.remote} sizes="320px" />
          {/* A darker band at the rim for the lettering */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_closest-side,transparent_62%,rgba(0,0,0,0.5)_92%)]" />
        </div>
        <svg viewBox="0 0 100 100" aria-hidden="true" className="absolute inset-0 h-full w-full overflow-visible">
          <defs>
            <path id={path} d="M 50 50 m -41.5 0 a 41.5 41.5 0 1 1 83 0 a 41.5 41.5 0 1 1 -83 0" />
          </defs>
          <text fill="#fff" fontSize="5.4" fontWeight={600} letterSpacing="0.55" style={{ fontFamily: "inherit" }}>
            <textPath href={`#${path}`} startOffset="2%">
              {ring}
            </textPath>
          </text>
        </svg>
      </motion.div>

      {/* The mirror band: bare metal between the print and the hub */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: "conic-gradient(from 210deg, #c9ced6, #f7f7f6, #b9c3d3, #efe6f2, #c8d6dc, #ffffff, #d4d0c4, #c9ced6)",
          maskImage: annulus(HUB, PRINT),
          WebkitMaskImage: annulus(HUB, PRINT),
        }}
      />
      {/* The clear hub, with its stacking ring */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle closest-side, transparent ${HOLE}%, rgba(255,255,255,0.7) ${HOLE + 0.4}%, rgba(255,255,255,0.32) ${HOLE + 4}%, rgba(255,255,255,0.32) 15.5%, rgba(255,255,255,0.75) 16.2%, rgba(255,255,255,0.3) 17.2%, rgba(255,255,255,0.22) ${HUB - 0.4}%, transparent ${HUB}%)`,
        }}
      />
      {/* The light: two soft reflections that stay where the lamp is */}
      <div
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          background:
            "conic-gradient(from 200deg, transparent 0deg, rgba(255,255,255,0.26) 28deg, transparent 64deg, transparent 180deg, rgba(255,255,255,0.16) 210deg, transparent 246deg)",
          maskImage: annulus(HUB),
          WebkitMaskImage: annulus(HUB),
        }}
      />
      {/* The rim */}
      <div className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_0_0_1px_rgba(255,255,255,0.45)]" />
    </div>
  );
}
