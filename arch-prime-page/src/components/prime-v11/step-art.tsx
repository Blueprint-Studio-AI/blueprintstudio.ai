import { Mark } from "@/components/prime-marks";

/* ── §3's step visuals — COMPACT, and REPRESENTATIONAL ───────────────────────
   Nick's call, twice over.

   REPRESENTATIONAL, never the product UI: "who's to say we don't adjust the UI — now we have to
   come back and adjust this section." Each step is a picture of the IDEA, drawn from the same
   marks the rest of the page uses (prime-marks.tsx) plus hairlines and one accent.

   COMPACT (spec §3 FINAL, Figma 518:115). This REPLACES the four wide compositions — they were
   drawings that filled a 480 board; these are ONE IDEA inside the Figma's aperture. The aperture
   is 186 × 186 (radius 24.4, `rgba(30,31,34,0.33)` behind a 3px `rgba(253,93,1,0.1)` stroke) and
   the step's mark sits at about 98px inside it. NOTHING IS WRITTEN INSIDE THE FRAME: no labels,
   no numbers, no captions — the words are the right column's job now, and the frame is one
   object the eye can take in at a glance.

   THE GRAMMAR (one 460 board = the frame, 1:1, with the aperture dead centre):
     01  the ₿ mark ARRIVING — it drops in under a short accented shaft
     02  ₿ and primeBTC MIRRORED — the same size either side of one horizon
     03  primeBTC AT THE CENTRE of three satellites — the three things it can go and do
     04  primeBTC RETURNING TO ₿ — the small share above, the coin below, the shaft between

   THE APERTURE TRAVELS WITH THE ART. It is drawn inside every board, not once behind them, so
   when the frame slides between steps (how.tsx's window) the aperture goes with the drawing —
   which is what makes the slide read as a floor passing rather than a picture being swapped.

   MOTION: the marks fade and rise (300ms), the shafts draw themselves (500ms, pathLength) —
   ONCE, when the section is reached. Under reduced motion prime-v11.css simply has everything
   present. All four boards are mounted together inside the frame (how.tsx). */

/** The board is the frame: 460 square, so one SVG unit is one CSS pixel at 1440. */
const B = 460;
const C = B / 2;
/** The Figma's aperture. */
const AP = 186;
const AP_R = 24.4;

type Delay = { delay?: number };
const at = (delay = 0) => ({ "--d": `${delay}ms` }) as React.CSSProperties;

/** A thing on the board: positioned by attribute, animated on an inner group, so CSS and the
    SVG transform attribute never fight over the same property. */
function Node({ x, y, delay = 0, children }: { x: number; y: number; children: React.ReactNode } & Delay) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="v11-art-node" style={at(delay)}>
        {children}
      </g>
    </g>
  );
}

/** A mark, centred on its node's origin. */
function Coin({ kind, size }: { kind: "btc" | "primeBTC"; size: number }) {
  return (
    <g transform={`translate(${-size / 2} ${-size / 2})`}>
      <Mark kind={kind} size={size} />
    </g>
  );
}

/** The one accent: a short vertical shaft with a chevron head, drawn in. */
function Shaft({ x, y1, y2, delay = 0 }: { x: number; y1: number; y2: number } & Delay) {
  const head = 7;
  return (
    <g className="v11-art-draw" style={at(delay)}>
      <path d={`M${x} ${y1} V${y2}`} pathLength={1} />
      <path d={`M${x - head} ${y2 - head} L${x} ${y2} L${x + head} ${y2 - head}`} pathLength={1} />
    </g>
  );
}

/** The aperture itself — part of every board, so it travels with the art. */
function Aperture() {
  return (
    <>
      <rect
        x={C - AP / 2}
        y={C - AP / 2}
        width={AP}
        height={AP}
        rx={AP_R}
        fill="rgba(30, 31, 34, 0.33)"
        stroke="rgba(253, 93, 1, 0.1)"
        strokeWidth="3"
      />
    </>
  );
}

/** 01 — it arrives. The coin drops in under the shaft. */
function One() {
  return (
    <>
      <Shaft x={C} y1={C - 88} y2={C - 58} delay={60} />
      <Node x={C} y={C + 14} delay={0}>
        <Coin kind="btc" size={98} />
      </Node>
    </>
  );
}

/** 02 — the mirror. The same size either side of one horizon: primeBTC is what you put in. */
function Two() {
  return (
    <>
      <Node x={C} y={C - 44} delay={0}>
        <Coin kind="btc" size={76} />
      </Node>
      <g className="v11-art-node" style={at(120)}>
        <path d={`M${C - 70} ${C} H${C + 70}`} stroke="#3a3740" strokeWidth="1" />
      </g>
      <Node x={C} y={C + 44} delay={180}>
        <Coin kind="primeBTC" size={76} />
      </Node>
    </>
  );
}

/** 03 — at work. One share, three places it can go. */
function Three() {
  const R = 78;
  const legs = [-90, 30, 150].map((deg) => {
    const a = (deg * Math.PI) / 180;
    return { x: C + Math.cos(a) * R, y: C + Math.sin(a) * R };
  });
  return (
    <>
      <g className="v11-art-node" style={at(160)}>
        {legs.map((p) => (
          <line key={`${p.x}`} x1={C} y1={C} x2={p.x} y2={p.y} stroke="#3a3740" strokeWidth="1" />
        ))}
      </g>
      {legs.map((p, i) => (
        <Node key={`${p.x}`} x={p.x} y={p.y} delay={220 + i * 60}>
          <circle r="7" fill="#ff5e00" />
        </Node>
      ))}
      <Node x={C} y={C} delay={0}>
        <Coin kind="primeBTC" size={98} />
      </Node>
    </>
  );
}

/** 04 — it goes back. The share above, the coin below, the shaft between. */
function Four() {
  return (
    <>
      <Node x={C} y={C - 52} delay={0}>
        <Coin kind="primeBTC" size={64} />
      </Node>
      <Shaft x={C} y1={C - 14} y2={C + 12} delay={140} />
      <Node x={C} y={C + 52} delay={220}>
        <Coin kind="btc" size={80} />
      </Node>
    </>
  );
}

const BOARDS = [One, Two, Three, Four];

export function StepArt({ step }: { step: number }) {
  const Board = BOARDS[step] ?? One;
  return (
    <svg className="v11-art" viewBox={`0 0 ${B} ${B}`} aria-hidden="true" focusable="false">
      <Aperture />
      <Board />
    </svg>
  );
}
