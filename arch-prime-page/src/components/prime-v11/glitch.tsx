// The /chain per-character "decode" glitch, reused — never re-implemented.
//
// THE CONTRACT. `.chain-char` in src/app/globals.css owns the effect: each character is a block
// that flashes #181818 → white → orange and resolves, `animation-delay` apart. This component
// only splits a string into those spans and hands each one its delay (35ms per character, after
// `delay`). Reduced motion is already handled there (the animation is off and the block hidden),
// so nothing here branches on it.
//
// IT REPLAYS BY BEING NEW: a CSS animation only restarts when the element is. The caller re-keys
// the block that holds these (how.tsx keys the fact rail on the step index), React replaces the
// nodes, and the glitch plays again. Copied from chain-how.tsx's GlitchText.

export function Glitch({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <>
      {Array.from(text).map((ch, i) => (
        <span key={i} className="chain-char" style={{ animationDelay: `${delay + i * 35}ms` }}>
          {ch === " " ? " " : ch}
        </span>
      ))}
    </>
  );
}

/** How long a glitched heading of `text` runs, ms — the base delay for whatever follows it. */
export function glitchEnd(text: string, delay = 0) {
  return delay + Array.from(text).length * 35;
}
