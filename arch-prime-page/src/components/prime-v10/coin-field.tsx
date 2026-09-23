// THE COIN FIELD — one SVG, a pure render. No state, no effects, no JS of its own: every change
// it goes through is CSS keyed off the hero's contract (prime-v10.css), written by the reader on
// the field's own <g> (hero.tsx) so that nothing outside the field restyles for it:
//
//   --zoom       the camera: the field's scale is pitch × S^(1 − zoom) px per pitch; and the pan
//                from the screen's centre (where the coin turned) down to the field's rest centre
//   --ring       the neighbours come into view, each whole and full size, in order of distance
//   --glyph      (derived in CSS) the ₿ glyph's opacity on each coin — level of detail from the
//                coin's on-screen size, so the dots are visibly coins from far away
//   --grow       form: the lit dots grow to the merge scale while the clip closes in to DISC and a
//                solid disc of that radius fills in under them, so the outline stays the idle
//                field's own circle and only the texture changes
//   --disc       form: the solid primeBTC disc fades in over the merged dots (same outline)
//   --draw       form: the Prime glyph is written in, one stroke along its spine (a mask)
//   data-idle    the ring goes grey, rippling outward by each dot's --dd
//   data-lit     the ring lights, rippling from the centre (data-light="all": at once)
//
// Laid out in PITCH UNITS around 0,0 (field.ts). On the stage the <g class="v10-field"> is
// translated to the stage centre and scaled; in a static frame (framed) the viewBox does the
// fitting instead. Every coin is one <symbol> through <use>, so the whole field is one drawing.
// The coin is marks.tsx's Bitcoin mark — the same paths as the flip's ₿ face, so the centre coin
// and the face are one picture at the handoff. Its disc is `currentColor` (what idle/lit change).

import { V10 } from "@/data/prime-v10";
import { DISC, FIELD, MERGE, SPAN } from "./field";
import { BTC_B, BTC_BOX, BTC_DISC, BTC_T, TOKEN } from "./marks";

const F = V10.field;
const HALF = F.dot / 2;
const VIEW = SPAN / 2;
const { box: GB, leg: LEG } = TOKEN;
// the primeBTC glyph at `glyphRatio` of the disc's diameter, centred, as <Mark kind="primeBTC"> sets it
const GLYPH_S = (2 * DISC * V10.token.glyphRatio) / GB.w;
const GLYPH_T = `translate(${(-GB.w * GLYPH_S) / 2} ${(-GB.h * GLYPH_S) / 2}) scale(${GLYPH_S})`;
/** The field's own numbers, as the vars prime-v10.css reads (hero.tsx puts them on the section). */
/* --clip0 is the resting dots' reach (the clip starts clear of them), --clip1 the disc. */
export const FIELD_VARS = { "--merge": MERGE, "--clip0": FIELD.max + HALF, "--clip1": DISC } as const;

export function CoinField({ id, ref, framed = false, label }: { id: string; ref?: React.Ref<SVGGElement>; framed?: boolean; label?: string }) {
  const coin = `#${id}-coin`;
  const dot = <use href={coin} x={-HALF} y={-HALF} width={F.dot} height={F.dot} className="v10-coin" />;
  return (
    <svg
      className={framed ? "v10-field-svg v10-field-svg--framed" : "v10-field-svg"}
      viewBox={framed ? `${-VIEW} ${-VIEW} ${SPAN} ${SPAN}` : undefined}
      aria-hidden
      focusable="false"
    >
      <defs>
        <symbol id={`${id}-coin`} viewBox={`0 0 ${BTC_BOX} ${BTC_BOX}`} overflow="visible">
          <g transform={BTC_T}>
            <path d={BTC_DISC} fill="currentColor" />
            {/* inline, so the clone in each <use> inherits the var from its host */}
            <path d={BTC_B} fill="#fff" style={{ fillOpacity: "var(--glyph, 1)" }} />
          </g>
        </symbol>
      </defs>
      <g ref={ref} className="v10-field">
        {/* inside the field's <g> so they inherit its vars (clip radius, the draw) */}
        <clipPath id={`${id}-clip`} clipPathUnits="userSpaceOnUse">
          <circle className="v10-clip" r={1} />
        </clipPath>
        <mask id={`${id}-draw`} maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" x={-LEG} y={-LEG} width={GB.w + 2 * LEG} height={GB.h + 2 * LEG}>
          <path className="v10-draw" d={TOKEN.spine} pathLength={1} fill="none" stroke="#fff" strokeWidth={LEG} strokeLinejoin="round" strokeLinecap="round" />
        </mask>
        {/* under the dots, the disc the form lands on, in Bitcoin's orange: as the dots grow it fills
            in behind them, so the bites between the rim dots are orange and the outline is always
            this one circle — the halftone closes over it */}
        <circle className="v10-under" r={DISC} fill="currentColor" />
        <g className="v10-dots" clipPath={`url(#${id}-clip)`}>
          <g className="v10-ring">
            {FIELD.ring.map((d) => (
              <g key={`${d.x},${d.y}`} className="v10-dot" transform={`translate(${d.x} ${d.y})`} style={{ ["--dd" as string]: d.d }}>
                {dot}
              </g>
            ))}
          </g>
          {/* the centre: the coin the camera pulls back from, and the one that stays lit */}
          <g className="v10-dot v10-dot--centre">{dot}</g>
        </g>
        {/* form: one clean disc over the merged dots, then the glyph written in */}
        <circle className="v10-disc" r={DISC} fill={TOKEN.color} />
        <g className="v10-glyph" transform={GLYPH_T}>
          <path d={TOKEN.path} fill="#fff" mask={`url(#${id}-draw)`} />
        </g>
        {label && (
          <text className="v10-centre-label" x={0} y={1.3} textAnchor="middle">
            {label}
          </text>
        )}
      </g>
    </svg>
  );
}
