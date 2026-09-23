// THE TIMELINE — the hero's one table, and the pure functions that read it.
//
// `p` is how far through the section's PINNED scroll the reader is, 0..1 (the section is 500svh
// on the desktop and 420svh on the phone, prime-v10.css; the stage is one viewport, so the pinned
// travel is 400svh / 320svh). Every range and threshold the hero uses is in TIMELINE; nothing
// else in the hero knows a scroll position.
//
//   p           what
//   0.00–0.06   words   the hero's words lift away (flow text, plus a lift; never a ghost fade)
//   0.04–0.22   close   the aperture: full-bleed photo → coin-size circle at the stage centre
//   0.22–0.30   turn    the coin flips: photo face → ₿ face
//   0.30–0.48   zoom    the camera pulls back: the coin is one of a field of coins, then a dot
//   0.31–0.42   ring      …its neighbours come into view, full size, from the centre outward,
//                         arriving as the camera starts to move (not before it)
//   0.50        idle    every dot but the centre goes grey; "Most Bitcoin sits still."
//   0.50–0.66           hold — reading the problem
//   0.68        lit     every dot lights (a ≈500ms ripple from the centre); "Prime puts it to work."
//   0.71–0.85   form    the dots grow, merge into one disc, and the primeBTC glyph draws in
//                         (its sub-phases, in fractions of the form, are FORM below)
//   0.85–1.00           hold on the token, then the stage releases

export const TIMELINE = {
  words: [0, 0.06],
  close: [0.04, 0.22],
  turn: [0.22, 0.3],
  zoom: [0.3, 0.48],
  ring: [0.31, 0.42],
  idle: 0.5,
  lit: 0.68,
  form: [0.71, 0.85],
} as const;

/** The form's sub-phases, as fractions of TIMELINE.form. The reader writes each as its own 0..1
    var, so the CSS never holds a scroll range:
      grow   the lit dots grow to the merge scale while the field is clipped in to DISC (field.ts):
             the silhouette is the final disc's, only the texture closes
      disc   the solid primeBTC disc fades in over the merged dots (same outline; the orange shifts
             from Bitcoin's to primeBTC's)
      draw   the Prime glyph is written in, one stroke from the left foot over the apex */
export const FORM = {
  grow: [0, 0.5],
  disc: [0.5, 0.6],
  draw: [0.6, 1],
} as const;

/** Thresholds fire at x going down and reverse at x − HYSTERESIS going up, so a reader who stops
    on one never sees it flicker. */
export const HYSTERESIS = 0.02;

export type Beat = "hero" | "idle" | "prime";
/** Which layer carries the picture: the photo/coin (aperture) until the turn completes, then the
    field. The other one is display:none, so a phase costs no style work for the layer it hides. */
export type Phase = "photo" | "field";
export type HeroState = {
  words: number;
  close: number;
  turn: number;
  zoom: number;
  ring: number;
  grow: number;
  disc: number;
  draw: number;
  phase: Phase;
  idle: boolean;
  lit: boolean;
  beat: Beat;
};

export const REST: HeroState = {
  words: 0,
  close: 0,
  turn: 0,
  zoom: 0,
  ring: 0,
  grow: 0,
  disc: 0,
  draw: 0,
  phase: "photo",
  idle: false,
  lit: false,
  beat: "hero",
};

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
/** Every scrubbed value is quantised to the 4 decimals the reader writes (hero.tsx), so what JS
    decides from a value (the phase: turn = 1) and what CSS draws from it are the same number. With
    the raw value, turn 0.99996 wrote "1.0000" — the ₿ face gone — while the phase still said
    "photo" (the field hidden): one scroll pixel of empty stage. */
const q = (x: number) => Math.round(x * 1e4) / 1e4;
const span = ([a, b]: readonly [number, number], p: number) => clamp01((p - a) / (b - a));
const inOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const inOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;
const inQuad = (t: number) => t * t;

/** A threshold with hysteresis: on at `x`, off again only below `x − HYSTERESIS`. */
const gate = (on: boolean, p: number, x: number) => (on ? p >= x - HYSTERESIS : p >= x);

/** The hero's state at `p`, given the thresholds' previous state (for the hysteresis). Pure. */
export function at(p: number, prev: Pick<HeroState, "idle" | "lit"> = REST): HeroState {
  const idle = gate(prev.idle, p, TIMELINE.idle);
  const lit = gate(prev.lit, p, TIMELINE.lit);
  const form = inOut(span(TIMELINE.form, p));
  const turn = q(inOutSine(span(TIMELINE.turn, p)));
  return {
    words: q(inQuad(span(TIMELINE.words, p))),
    close: q(inOut(span(TIMELINE.close, p))),
    turn,
    // the camera's scale is already exponential (pitch × S^(1 − zoom), prime-v10.css), which is
    // perceptually even; a gentle sine in-out keeps the coins-become-dots moment on screen longer
    zoom: q(inOutSine(span(TIMELINE.zoom, p))),
    ring: q(inOutSine(span(TIMELINE.ring, p))),
    grow: q(span(FORM.grow, form)),
    disc: q(span(FORM.disc, form)),
    draw: q(span(FORM.draw, form)),
    phase: turn >= 1 ? "field" : "photo",
    idle,
    lit,
    beat: lit ? "prime" : idle ? "idle" : "hero",
  };
}

/** The aperture's radius (px) at `p`: the cover radius r0 closing to the coin's rc. */
export const radiusAt = (p: number, r0: number, rc: number) => r0 + (rc - r0) * at(p).close;

/** The first `p` at which the aperture no longer covers a point `reach` px from its centre. The
    nav's probe (hero.tsx) covers the nav line until then. */
export function uncoversAt(reach: number, r0: number, rc: number): number {
  if (reach <= rc) return 1;
  const [a, b] = TIMELINE.close;
  // radiusAt falls monotonically across the close: bisect.
  let lo: number = a;
  let hi: number = b;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (radiusAt(mid, r0, rc) >= reach) lo = mid;
    else hi = mid;
  }
  return lo;
}
