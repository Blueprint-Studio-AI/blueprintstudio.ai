// THE FIELD — the dots the camera pulls back to, as data. Deterministic (no Math.random): the
// server and the client build the same field, so there is nothing to mismatch on hydration.
//
// A square grid clipped to a circle of `radius` pitches, in PITCH UNITS (one grid step = 1,
// centred on 0,0) — the same count at every width; hero.tsx only changes how many px a pitch is.
// Each dot carries `d`, its distance from the centre as 0..1, which prime-v10.css turns into its
// ripple delay (idle and lit).
//
// Everything else about the field is DERIVED here from V10.field's radius, dot and merge, so a new
// dot count is one edit:
//   SPAN   the field's whole footprint in pitches, grown dots included — hero.tsx fits it in px
//   DISC   the idle field's own outline (its resting dots' convex hull, as a mean radius): the solid
//          primeBTC disc the form lands on. The form never changes the silhouette — the idle
//          field reads as a circle of this radius, and so does the token.
//   MERGE  the grown dots' scale: V10.field.merge, raised if needed so a grown dot's radius is
//          more than half the diagonal pitch — the grid then closes with no holes inside.

import { V10 } from "@/data/prime-v10";

export type Dot = { x: number; y: number; d: number };

export function buildField(radius: number): { ring: Dot[]; max: number } {
  const n = Math.floor(radius);
  const ring: Dot[] = [];
  let max = 0;
  for (let j = -n; j <= n; j++) {
    for (let i = -n; i <= n; i++) {
      const r = Math.hypot(i, j);
      if (r > radius || r === 0) continue; // the centre is drawn on its own
      ring.push({ x: i, y: j, d: r });
      if (r > max) max = r;
    }
  }
  // near to far, so the SVG's paint order is stable and the ripple reads outward in the source too
  ring.sort((a, b) => a.d - b.d || a.y - b.y || a.x - b.x);
  for (const dot of ring) dot.d = Math.round((dot.d / max) * 1000) / 1000;
  return { ring, max };
}

/** The idle field's outline, pitches: the mean, over directions a degree apart across one eighth
    (the grid clipped to a circle has the square's eightfold symmetry), of how far the resting dots
    (radius `rd`) reach in that direction — their convex hull, which is the circle the eye reads
    (at the default field it runs 9.32–9.58; the mean is 9.50). */
export function outlineRadius(radius: number, rd: number): number {
  const n = Math.floor(radius);
  let sum = 0;
  for (let a = 0; a <= 45; a++) {
    const t = (a * Math.PI) / 180;
    let far = 0;
    for (let j = -n; j <= n; j++)
      for (let i = -n; i <= n; i++) if (Math.hypot(i, j) <= radius) far = Math.max(far, i * Math.cos(t) + j * Math.sin(t));
    sum += far + rd;
  }
  return Math.round((sum / 46) * 1000) / 1000;
}

const F = V10.field;

/** The field every CoinField draws: the ring (every dot but the centre), and its reach. */
export const FIELD = buildField(F.radius);
/** The grown dots' scale (see the note at the top). */
export const MERGE = Math.max(F.merge, (Math.SQRT1_2 + 0.02) / (F.dot / 2));
/** The field's footprint, pitches: the outermost dot's centre plus a fully grown dot's radius. */
export const SPAN = 2 * (FIELD.max + (F.dot / 2) * MERGE);
/** The solid disc the form lands on, pitches: the idle field's outline (see the note at the top). */
export const DISC = outlineRadius(F.radius, F.dot / 2);
