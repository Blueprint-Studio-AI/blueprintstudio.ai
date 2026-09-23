"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { V10 } from "@/data/prime-v10";
import { Led } from "./led";
import { StepArt } from "./step-art";

/* ── §3 `#how` — how it works (the elevator) ─────────────────────────────────
   One account, four steps, in order: the page's only sequential piece, on the Figma's neutral
   black. The reader lands, reads the header over the lit facade, and the stage locks as step 01
   comes into frame; scrolling then advances step by step and releases after 04.

   ONE LAYOUT, AND IT IS THE FIGMA'S (node 518:115, spec §3 FINAL). The `data-layout` attribute,
   the review toggle and the stacked / split passes are GONE — deleted, not hidden. What is left
   is the composition Nick signed off: a flex row on `.site-container` (so §3 sits on the page's
   own 128px gutters, in line with §2 above it), the floor rail left, the 460 frame dead centre,
   the step's words right. The two side columns are `flex: 1 0 0`, so the frame's centre IS the
   viewport's centre and neither side may be given a fixed width or its own padding.

   THE CONTRACT (the hero's, section for section).
     • ONE piece of state, `s = { i, from }` — which step is showing and which one it just left.
       Everything downstream is a render off that: no second copy of the step, no mirror state.
     • ONE rAF scroll reader, started only while the pin query matches. It writes nothing but
       that state and `--sp` (progress inside the current step) onto the root. A SECOND, tiny
       nothing in the section moves independently of the page: no parallax, no entry offset.
       CSS owns every transform, colour and transition.
     • The contract to CSS is `data-step` (0–3) and `--i` on the root. The copy block is KEYED on
       the step index, so React replaces it and its entrance plays again — a CSS animation only
       restarts when the element does. The PICTURE is not: all four drawings are mounted at once
       inside the frame and the window slides between them, so re-mounting one would fight it.
     • Copy and flags are in src/data/prime-v10.ts (V10.how) — nothing readable lives here.

   TWO CONTROLS, ONE STATE (Nick wants both: the rail for the metaphor, the numbers for the
   composition). The floor rail and the 01–04 number buttons call the same `onPick`, read the
   same `s.i` and carry the same `aria-current`. The rail is not a second state machine.

   ONE COMPONENT, TWO INPUTS — the HoneyB pattern, not a second layout. Same markup, same state
   at every width; only what MOVES the state changes:
       lg + height ≥ 700 + motion allowed  → the scroll reader; the stage is sticky, 100svh.
       everything else                     → nothing pins, the page scrolls, the buttons are it.
   CSS decides which mode is on from the same query as PIN_QUERY, so the server render is already
   right and JS never branches markup.

   BELOW LG THE RAIL IS DROPPED, not laid down — see prime-v10.css. The number buttons are
   already the whole control in the one-column stack, and a horizontal rail under them would be a
   second control saying the same thing in labels that cannot fit four across a 390px screen.

   HYSTERESIS, as the hero's: a step turns on at its boundary going down and off only 0.04 of a
   band above it going up, so a reader stopped on a threshold never sees it flicker.
   FREEZE GUARD: a pointerdown inside the stage holds the step until 300ms after the release
   (and a jump from a control holds it for the length of the smooth scroll), so the reader can't
   yank the step out from under a tap. A FOCUS holds it for 600ms and no longer — an open-ended
   focus hold froze the whole pinned band for a keyboard reader parked on the rail. */

/** Where §3 pins. prime-v10.css's nested @media block is the same query. */
export const PIN_QUERY = "(prefers-reduced-motion: no-preference) and (min-width: 992px) and (min-height: 700px)";

/** How much of a band you must scroll back up before the previous step takes over again. */
const HYST = 0.04;

type Lenis = { scrollTo: (y: number, o: { immediate?: boolean; force?: boolean }) => void };

const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x));

export function PrimeHow() {
  const how = V10.how;
  const steps = how.steps;
  const N = steps.length;

  const root = useRef<HTMLElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  /** The pinned section's measured scroll frame, shared with the control buttons. */
  const geom = useRef({ top: 0, travel: 0 });
  /** performance.now() until which the reader must not change the step (the freeze guard). */
  const hold = useRef(0);

  const [s, setS] = useState({ i: 0, from: 0 });
  /** The entrance plays on ENTRY, not at mount: until the stage has been seen, the keyed block
      carries a different key, so reaching the section re-mounts it and the entrance runs there. */
  const [seen, setSeen] = useState(false);

  /** The one way the step ever changes. `from` is what it just left, for the panel handoff. */
  const go = useCallback((i: number) => setS((p) => (p.i === i ? p : { i, from: p.i })), []);

  useEffect(() => {
    const ro_ = root.current;
    const ho = host.current;
    const st = stage.current;
    if (!ro_ || !ho || !st) return;

    const mq = window.matchMedia(PIN_QUERY);

    const start = () => {
      let raf = 0;
      let cur = -1;
      let lastSp = -1;

      const measure = () => {
        geom.current.top = ho.getBoundingClientRect().top + window.scrollY;
        geom.current.travel = Math.max(1, ho.offsetHeight - st.offsetHeight);
      };

      const write = () => {
        raf = 0;
        const { top, travel } = geom.current;
        const raw = clamp((window.scrollY - top) / travel, 0, 1) * N;
        let i = cur < 0 ? clamp(Math.floor(raw), 0, N - 1) : cur;
        while (i < N - 1 && raw >= i + 1) i++;
        while (i > 0 && raw < i - HYST) i--;
        const sp = clamp(raw - i, 0, 1);
        if (sp !== lastSp) {
          /* ON THE ROOT, not the stage: the ghost photograph is a child of the stage and reads
             `--sp` to scrub itself out, and a property set on the stage would not reach a
             sibling. Inheritance carries it down from the root either way. */
          ro_.style.setProperty("--sp", sp.toFixed(3));
          lastSp = sp;
        }
        if (i !== cur && performance.now() >= hold.current) {
          cur = i;
          go(i);
        }
      };

      const onScroll = () => {
        if (!raf) raf = requestAnimationFrame(write);
      };
      const remeasure = () => {
        measure();
        write();
      };
      /* A TAP holds the step for as long as the finger is down — a pointerup anywhere on the
         window lets go 300ms later. A FOCUS is different and must NOT be open-ended: focusin
         fires when a keyboard reader Tabs onto a floor, and a hold of `Infinity` there froze the
         whole pinned band for anyone who then scrolled with the keyboard still on the rail. */
      const freeze = () => {
        hold.current = Infinity;
      };
      const freezeFocus = () => {
        hold.current = performance.now() + 600;
      };
      const thaw = () => {
        hold.current = performance.now() + 300;
      };

      remeasure();
      let alive = true;
      document.fonts?.ready.then(() => alive && remeasure());
      const ro = new ResizeObserver(() => remeasure());
      ro.observe(ho);
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", remeasure);
      st.addEventListener("pointerdown", freeze);
      st.addEventListener("focusin", freezeFocus);
      window.addEventListener("pointerup", thaw);
      st.addEventListener("focusout", thaw);

      return () => {
        alive = false;
        ro.disconnect();
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", remeasure);
        st.removeEventListener("pointerdown", freeze);
        st.removeEventListener("focusin", freezeFocus);
        window.removeEventListener("pointerup", thaw);
        st.removeEventListener("focusout", thaw);
        if (raf) cancelAnimationFrame(raf);
        ro_.style.removeProperty("--sp");
        geom.current.travel = 0;
        hold.current = 0;
      };
    };

    let stop: (() => void) | null = null;
    const sync = () => {
      if (mq.matches && !stop) stop = start();
      else if (!mq.matches && stop) {
        stop();
        stop = null;
      }
    };
    sync();
    mq.addEventListener("change", sync);
    return () => {
      mq.removeEventListener("change", sync);
      stop?.();
    };
  }, [go, N]);


  useEffect(() => {
    const st = stage.current;
    if (!st) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries)
          if (e.isIntersecting) {
            setSeen(true);
            io.disconnect();
            break;
          }
      },
      { threshold: 0.2 },
    );
    io.observe(st);
    return () => io.disconnect();
  }, []);

  /** A press on either control — a floor on the rail or a number: set the step, and under the
      pin scroll to the middle of that step's band. */
  const onPick = useCallback(
    (i: number) => {
      go(i);
      const { top, travel } = geom.current;
      if (travel <= 1) return; // not pinned — the control swaps the copy in place
      hold.current = performance.now() + 900;
      const y = Math.round(top + ((i + 0.5) / N) * travel);
      const lenis = (window as Window & { __lenis?: Lenis }).__lenis;
      if (lenis) lenis.scrollTo(y, { force: true });
      else window.scrollTo({ top: y, behavior: "smooth" });
    },
    [go, N],
  );

  const step = steps[s.i];
  /** Re-mount key: the step, plus whether the section has been reached (see `seen`). */
  const k = `${seen ? "in" : "pre"}-${s.i}`;

  return (
    <section
      ref={root}
      id="how"
      className="v10-how"
      data-step={s.i}
      data-from={s.from}
      data-nav-theme="dark"
      style={{ "--i": s.i, "--rail-dim": how.railDim } as React.CSSProperties}
    >
      {/* ── the header band: the lit facade with the eyebrow and the H2 on it, fading into the
             section's own ground. THE ONE PHOTOGRAPH IN THIS SECTION. The headline is not pinned
             — the band is a normal block above the sticky host, so it scrolls away as the stage
             takes over, and nothing in here moves at a different rate to anything else. ── */}
      <div className="v10-how-band">
        <picture className="v10-how-band-pic">
          <source media="(max-width: 767px)" srcSet={how.band.mobile} />
          <img src={how.band.desktop} alt="" loading="lazy" decoding="async" />
        </picture>
        <div className="v10-how-band-scrim" />
        <div className="site-container v10-how-band-copy">
          <p className="v10-how-eyebrow">{how.eyebrow}</p>
          <h2 className="v10-how-h2">{how.h2}</h2>
        </div>
      </div>

      {/* the elevator. Pinned: this is the travel and the stage is sticky inside it.
          Everywhere else it is just a block and the stage sits in the flow. */}
      <div ref={host} className="v10-how-host" style={{ "--n": N } as React.CSSProperties}>
        <div ref={stage} className="v10-how-stage">
          {/* the floor: a fine dot grid across the foot of the stage — the cue that there is more
              below. CSS only, under everything, and it never moves. */}
          <div className="v10-how-floor" aria-hidden="true" />

          {/* ── THE ROW. `.site-container` IS the row, so §3's gutters are the page's 128px and
                 §2's cards above line up with the rail's first label. Nothing here may carry a
                 gutter of its own. ── */}
          <div className="site-container v10-how-row">
            {/* ── THE FLOOR RAIL (Figma: four rows, 01 at the BOTTOM, a 2px right border that IS
                   the shaft). The DOM keeps them 01→04 so the tab order is the reading order and
                   CSS reverses them on screen. THE MARKER CLIMBS: the orange border is ONE
                   absolutely-placed element moved by `transform` off `--i`, 400ms — that motion
                   is the section's only explanation of why the words advance while the marker
                   rises. Dropped below lg (see the note at the top of this file). ── */}
            <div className="v10-how-rail">
              <div className="v10-how-rail-rows" role="group" aria-label="Steps">
                {steps.map((t, i) => (
                  <button
                    key={t.n}
                    type="button"
                    className="v10-how-rail-row"
                    aria-current={i === s.i ? "step" : undefined}
                    onClick={() => onPick(i)}
                  >
                    {t.railLabel}
                  </button>
                ))}
                {/* the marker. aria-hidden: `aria-current` above already says which step. */}
                <span className="v10-how-rail-car" aria-hidden="true" />
              </div>
            </div>

            {/* ── THE FRAME — /chain's sliding window. `.v10-how-frame` is 460 × 460, #141216,
                   radius 20.5 and `overflow: hidden`; all four drawings live inside it at once,
                   each translated by `(i - step) * 100%`. Advancing the step slides them
                   together: the one you were reading leaves UPWARD and the next rises into its
                   place, and the clip means a neighbour is never visible on the way.

                   THE DIRECTION IS THE POINT: scrolling down advances the step, so the art
                   travels UP — floors passing as the car rises, which is also why the rail's
                   marker climbs while the words advance downward. Do not invert it.

                   ONE KEY, AND IT IS NOT THE STEP: the stack re-mounts once, when the section is
                   first reached (`seen`), so the marks arrive on entry. Keying on the step would
                   re-mount the art mid-slide, which is what the window exists to replace.

                   Only the active drawing is in the accessibility tree and only it can hold
                   focus; under reduced motion prime-v10.css drops the transition. ── */}
            <div className="v10-how-frame">
              <div key={seen ? "in" : "pre"} className="v10-art-stack">
                {steps.map((t, i) => (
                  <div
                    key={t.n}
                    className="v10-art-slide"
                    aria-hidden={i !== s.i}
                    inert={i !== s.i}
                    style={{ transform: `translateY(${(i - s.i) * 100}%)` }}
                  >
                    <StepArt step={i} />
                  </div>
                ))}
              </div>
            </div>

            {/* ── THE WORDS: the plate, the copy block, the numbers — 42px apart (Figma). ── */}
            <div className="v10-how-words">
              {/* the floor indicator. OUTSIDE the keyed block on purpose: it is one instrument
                  reading a changing floor, not a thing that is replaced each step. */}
              <Led n={step.n} />
              <div key={k} className="v10-how-copy">
                <h3 className="v10-how-title">{step.title}</h3>
                <p className="v10-how-body">{step.body}</p>
              </div>
              {/* the numbers: the section's other control, and the whole control below lg */}
              <div className="v10-how-nums" role="group" aria-label="Steps">
                {steps.map((t, i) => (
                  <button
                    key={t.n}
                    type="button"
                    className="v10-how-num"
                    aria-label={`Step ${t.n}, ${t.title.replace(/\.$/, "")}`}
                    aria-current={i === s.i ? "step" : undefined}
                    onClick={() => onPick(i)}
                  >
                    {t.n}
                  </button>
                ))}
              </div>
            </div>

            <p className="sr-only" aria-live="polite">{`Step ${s.i + 1} of ${N}, ${step.title}`}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
