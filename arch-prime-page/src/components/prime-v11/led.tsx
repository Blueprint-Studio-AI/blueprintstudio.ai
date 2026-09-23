/* ── The floor indicator ─────────────────────────────────────────────────────
   §3 is abstractly the inside of an elevator, and this is the plate above the door: a dot-matrix
   readout of the floor you are on (the step number) with an arrow above it.

   THE ARROW ALWAYS POINTS UP (Nick, 2026-09-22). It used to follow the scroll's direction, which
   meant the one fixed instrument in the section flipped under the reader while they were reading
   — and the page's argument only ever goes up anyway. The direction reader, its 120ms debounce
   and the state they drove are gone; the plate is now a pure render of `n`.

   THE CONTRACT.
     • The glyphs are 5×7 bitmaps in GLYPHS below, and nothing else knows what a digit looks like:
       a designer can redraw the numerals or the arrow without touching a line of logic.
     • No state, no effect, no listener — so nothing here behaves differently under reduced
       motion, and the plate is identical on the server and the client.
     • `aria-hidden`: the step is already announced by §3's live region, and "01 ▲" read aloud is
       noise. This is decoration that happens to be informative.                                */

/** 5 wide, 7 tall, one string per row — the whole typeface. */
const GLYPHS: Record<string, readonly string[]> = {
  "0": ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
  "1": ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
  "2": ["01110", "10001", "00001", "00010", "00100", "01000", "11111"],
  "3": ["11111", "00010", "00100", "00010", "00001", "10001", "01110"],
  "4": ["00010", "00110", "01010", "10010", "11111", "00010", "00010"],
  "5": ["11111", "10000", "11110", "00001", "00001", "10001", "01110"],
  "6": ["00110", "01000", "10000", "11110", "10001", "10001", "01110"],
  "7": ["11111", "00001", "00010", "00100", "01000", "01000", "01000"],
  "8": ["01110", "10001", "10001", "01110", "10001", "10001", "01110"],
  "9": ["01110", "10001", "10001", "01111", "00001", "00010", "01100"],
  up: ["00100", "01110", "11111", "00100", "00100", "00100", "00100"],
};

/* THE FIGMA PLATE (518:115): 109 × 36, radius 4. The three cells (two digits and the arrow)
   still fall out of PITCH and GAP, so the numerals are unchanged — only the plate is. */
const PLATE_W = 109;
const PLATE_H = 36;
const PITCH = 4; // dot centres, px
const R = 1.3; // dot radius
const CELL = 5 * PITCH; // one character
const GAP = 4; // between characters
const OX = (PLATE_W - (3 * CELL + 2 * GAP)) / 2;
const OY = (PLATE_H - 7 * PITCH) / 2;

export function Led({ n }: { n: string }) {
  const chars = [n.charAt(0), n.charAt(1), "up"];

  return (
    <svg className="v11-led" width={PLATE_W} height={PLATE_H} viewBox={`0 0 ${PLATE_W} ${PLATE_H}`} aria-hidden="true" focusable="false">
      <rect width={PLATE_W} height={PLATE_H} rx="4" fill="#1a181d" />
      <rect x="0.5" y="0.5" width={PLATE_W - 1} height={PLATE_H - 1} rx="3.5" fill="none" stroke="#26242a" />
      {chars.map((ch, c) => {
        const rows = GLYPHS[ch] ?? GLYPHS["0"];
        return rows.map((row, y) =>
          Array.from(row).map((bit, x) => (
            <circle
              key={`${c}-${y}-${x}`}
              cx={OX + c * (CELL + GAP) + x * PITCH + PITCH / 2}
              cy={OY + y * PITCH + PITCH / 2}
              r={R}
              fill={bit === "1" ? "#ff5e00" : "#2a2730"}
            />
          )),
        );
      })}
    </svg>
  );
}
