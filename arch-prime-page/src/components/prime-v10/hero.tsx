"use client";

import { useEffect, useRef } from "react";
import { V10 } from "@/data/prime-v10";
import { Aperture, PhotoPicture } from "./aperture";
import { BeatWords, HeroWords } from "./beats";
import { CoinField, FIELD_VARS } from "./coin-field";
import { SPAN } from "./field";
import { BTC_COLOR } from "./marks";
import { at, uncoversAt, type HeroState } from "./timeline";

/* ── The v10 hero ────────────────────────────────────────────────────────────
   One picture, told in seven frames (Nick's Figma frames, 2026-09-22):

     PHOTO     the looking-up tower, full bleed; the promise and the one button, centred.
     CLOSE     scrolling closes the photograph into a circle at the stage's centre — the middle
               of the area under the headline slot — shrinking to coin size (an aperture: the
               photograph itself never moves).
     TURN      the circle flips on its vertical axis like a coin; its back is Bitcoin's mark.
     PULL BACK the camera pulls back: the coin is one of a field of coins, each showing ₿ while
               it's big enough to read, fading to plain dots as they shrink.
     IDLE      every dot goes grey except the centre one — "Most Bitcoin sits still."
     LIGHT     all of them light, in a fast ripple out from the centre.
     FORM      the lit dots grow until they touch and merge into one solid disc, and the Prime
               glyph draws in: the primeBTC token — "Prime puts it to work."

   Centred, /chain-style: the words at the top of the frame, the object in the middle.

   THE CONTRACT. This component does one thing: a single scroll reader writes the hero's state,
   and prime-v10.css does every transform, colour and transition from it. The art (aperture.tsx,
   coin-field.tsx, beats.tsx) is a pure render keyed off these — no state, no effects — so the
   placeholders plug out and the finished art plugs in against the same names. Each var is written
   on the element that uses it, so a scrub frame restyles only that layer (the field is ~1700
   nodes; written on the root, every frame of the photo's close restyled all of it):

     on the band      --words   0→1 scrubbed   the hero's words lift away (flow text, masked at
                      --scroll  px             the nav's line — never a ghost fade)
     on the aperture  --close   0→1 scrubbed   full-bleed photo → coin-size circle at the screen's
                                               centre, the photo dollying down with it once it fits
                      --turn    0→1 scrubbed   photo face → ₿ face (flip: rotateY 0→180deg; or flood)
     on the field     --zoom    0→1 scrubbed   camera pull-back: scale S → 1, and a pan from the
                                               screen's centre down to the field's rest centre
                      --grow                   the form's first sub-phase (timeline.ts FORM): the
                                               dots merge over a disc filling in under them
                      --ring    0→1 scrubbed   the neighbours come into view, whole, centre out
     on their readers --disc    0→1 scrubbed   the solid disc fades in (on .v10-dots, .v10-disc)
                      --draw    0→1 scrubbed   the glyph is written in (on .v10-glyph, .v10-draw)
                                               — each only on the 2 nodes that read it, not the
                                               ~1700 of the field
     on host + beats  --rel     px             how far the stage has scrolled up at the release,
                                               so their nav-line masks stay in viewport terms
     on the root      data-phase  photo|field  which layer carries the picture (the other is
                                               display:none — no style work while hidden)
                      data-idle   threshold    every dot but the centre fades grey (a quick wave out)
                      data-lit    threshold    every dot lights (≈500ms ripple from the centre)
                      data-form   grow > 0     the form has begun: every dot is lit NOW, whatever
                                               the ripple's progress (a fast flick through lit)
                      data-beat   hero|idle|prime   which headline shows at the top; data-beat-from
                                               is the one before, so the new one waits only when
                                               an old one is leaving

   The scrubbed values come already eased from timeline.ts, whose one table holds every range and
   threshold. Thresholds have hysteresis (on at x going down, off below x − 0.02 going up), so a
   reader stopped on one never sees it flicker, and idle/lit/beat are TIME-based transitions keyed
   off their attributes — they play through at their own speed and reverse when scrolled back.

   GEOMETRY, measured, not assumed. The field sits between the headline slot and the stage's
   bottom with at least `margin` (24px) all round: its diameter is the free area's, capped, and
   its rest centre (cy) is the free area's middle. The close and the turn happen at the screen's
   true centre (cy0); the pull-back pans from one to the other. Re-measured on resize and after
   document.fonts.ready (the serif headline's height moves the free area).
   The stage is 100lvh (a phone's collapsing toolbar never uncovers a strip under the photograph)
   but everything on it is laid out against the SMALL viewport (a 100svh probe): on load a phone's
   toolbar is expanded, and what's under it isn't seen. On a phone the free area also keeps clear
   of the pill (MobileCta: 44px + 16px) at the bottom right.
   Written as unitless px vars on the root: --W --H (the stage), --cx --cy --cy0, --r0 (the cover
   radius: the stage's farthest corner) and --rc (the coin's), --coin (an even integer, so the
   coin and its photo sit on whole pixels), --pitch (px per grid step at rest), --S (the
   pull-back's start scale), --half (half the visible short side: where the dolly starts) and
   --nav-h. CSS multiplies by 1px. The field's own numbers (--dot --merge, the LOD sizes and the
   form's clip radii) and --btc are data, written inline on the server so the first paint has them.
   When the viewport's height changes (rotation, split view) the travel changes; the reader keeps
   its place (the same p) instead of jumping the scrub.

   PINNED, CSS-FIRST. The pinned rules sit in ONE @media block in prime-v10.css matching PIN_QUERY
   below; the stacked, static version is the default. Both markups are always rendered — the pinned
   stage and the static frames — and CSS shows one, so the server render paints the right first
   frame (the photo hero) at every width and JS never branches markup. JS only starts and stops the
   reader as the query flips. Phones pin too (the story IS the motion); short screens and reduced
   motion get the static version: the photo band, then the idle field under "Most Bitcoin sits
   still." and the primeBTC token under "Prime puts it to work."

   ONLY transform, opacity, clip-path, mask and colour animate — never width/height/top/left (v9's
   coin animated width/height and scored CLS 0.613).

   THE NAV, ITEM BY ITEM. Over the photograph each nav item must be light, over the light ground
   dark — and the closing circle uncovers them one at a time (the logo and the button first, the
   centre links last). measure() works out, for every visible nav item, the scroll at which the
   circle's edge passes the item's own middle (so at most half an item is ever the wrong colour).
     • The probe, an invisible [data-nav-theme="dark"] strip at the top of the section, covers
       nav.tsx's line (NAV_LINE, y = 40) until the LAST item is uncovered: nav.tsx's own scroll
       reading keeps the whole nav light until then, then flips it — no timing race with this
       reader. nav.tsx reads the probe on its own mount/resize, which run before this measure, so
       measure() ends by nudging it (a scroll event) to read the new size.
     • Before that, each item already uncovered carries data-v10-ink, which prime-v10.css (loaded
       only on this route) turns dark. That attribute is written on nav.tsx's elements from here:
       it depends on the nav being `nav a` / `nav button` items, and on React leaving attributes it
       didn't set alone (it does). Removed on every exit.
   No glass: a flat glass bar over the photo cut the circle flat. Static, the photo band carries
   the flag itself.

   With JS off the <noscript> style drops to the static version, so the page still reads. */

/** Where the hero pins. prime-v10.css's @media block is the same query. */
export const PIN_QUERY = "(prefers-reduced-motion: no-preference) and (min-height: 500px)";

/** With JS off: the static version, whatever the query says. */
const NOSCRIPT_CSS =
  "<style>.v10-hero{height:auto!important}.v10-hero .v10-stage,.v10-hero .v10-navprobe{display:none!important}" +
  ".v10-hero .v10-band{position:relative!important;height:auto!important;min-height:100svh;transform:none!important;-webkit-mask-image:none!important;mask-image:none!important}" +
  ".v10-hero .v10-band-photo{display:block!important}.v10-hero .v10-frames{display:flex!important}</style>";

/** nav.tsx's probe line: it reads [data-nav-theme] rects under y = 40 (its onScroll). */
const NAV_LINE = 40;
/** MobileCta's pill on a phone (below md): 44px tall, 16px off the bottom. The field keeps clear. */
const PILL = 60;

const F = V10.field;
/** The hero's numbers as CSS data, server-rendered on the section so the first paint has them. */
const DATA_VARS = {
  "--dolly-k": V10.photo.dolly.k,
  "--focus": V10.photo.dolly.focus,
  "--focus-x": V10.photo.dolly.focusX,
  "--dot": F.dot,
  "--lod0": F.lod[0],
  "--lod1": F.lod[1],
  ...FIELD_VARS,
  "--btc": BTC_COLOR,
} as React.CSSProperties;

const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x));
const f4 = (x: number) => x.toFixed(4);
const f1 = (x: number) => x.toFixed(1);

type Lenis = { scrollTo: (y: number, o: { immediate: boolean; force: boolean }) => void };

export function PrimeHero() {
  const root = useRef<HTMLElement>(null);
  const band = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const aperture = useRef<HTMLDivElement>(null);
  const field = useRef<SVGGElement>(null);
  const beats = useRef<HTMLDivElement>(null);
  const probe = useRef<HTMLDivElement>(null);
  const svh = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    const bd = band.current;
    const st = stage.current;
    const ap = aperture.current;
    const fg = field.current;
    const hb = beats.current;
    const pr = probe.current;
    const sv = svh.current;
    const host = fg?.ownerSVGElement?.parentElement;
    const q = (sel: string) => fg?.querySelector<SVGElement>(sel);
    const dots = q(".v10-dots");
    const disc = q(".v10-disc");
    const glyph = q(".v10-glyph");
    const draw = q(".v10-draw");
    if (!el || !bd || !st || !ap || !fg || !hb || !pr || !sv || !host || !dots || !disc || !glyph || !draw) return;

    const mq = window.matchMedia(PIN_QUERY);
    const GEOM = ["--W", "--H", "--cx", "--cy", "--cy0", "--r0", "--rc", "--coin", "--pitch", "--S", "--half", "--nav-h"];
    /* every scrubbed var, with the element it's written on */
    const OUT: [keyof HeroState, string, (HTMLElement | SVGElement)[]][] = [
      ["words", "--words", [bd]],
      ["close", "--close", [ap]],
      ["turn", "--turn", [ap]],
      ["zoom", "--zoom", [fg]],
      ["ring", "--ring", [fg]],
      ["grow", "--grow", [fg]],
      ["disc", "--disc", [dots, disc]],
      ["draw", "--draw", [glyph, draw]],
    ];
    /* the release: the stage's nav-line masks, kept in viewport terms */
    const REL = [host, hb];

    /* The reader: started while the query matches, stopped (and every trace removed, so the
       static CSS is back in charge) when it doesn't. */
    const start = () => {
      let top = 0;
      let travel = 1;
      let H = 0;
      let raf = 0;
      let last: HeroState | null = null;
      let lastScroll = -1;
      let lastRel = -1;
      /* the nav's items: each one's scroll (px into the section) at which the circle uncovers its
         middle, whether it's inked now, and the probe's end (the last of them) */
      let ink: { n: Element; y: number; on: boolean }[] = [];
      let navEnd = 0;

      const setInk = (it: (typeof ink)[number], on: boolean) => {
        if (it.on === on) return;
        it.on = on;
        it.n.toggleAttribute("data-v10-ink", on);
      };

      const measure = () => {
        const W = st.clientWidth;
        H = st.clientHeight;
        /* the visible height: the small viewport (see GEOMETRY); never more than the stage */
        const Hs = Math.min(H, sv.clientHeight || H);
        const navEl = document.querySelector("nav");
        const navH = navEl ? navEl.getBoundingClientRect().height : 80;
        const headBottom = hb.getBoundingClientRect().bottom - st.getBoundingClientRect().top;
        const bottom = Hs - (W < 768 ? PILL : 0);
        const free = bottom - headBottom;
        const D = Math.max(120, Math.min(free - 2 * F.margin, W - 2 * F.margin, F.maxDiameter));
        const cx = Math.round(W / 2);
        const cy = Math.round(headBottom + free / 2); // the field's rest centre, under the headline slot
        const cy0 = Math.round(Hs / 2); // the visible centre: where the photo closes and the coin turns
        const pitch = D / SPAN;
        /* an even integer, so the coin's box and the photo inside it sit on whole pixels (a
           fractional coin re-rasterised the photo softer the moment the turn began) */
        const coin = 2 * Math.round(clamp(D * F.coin.ratio, F.coin.min, F.coin.max) / 2);
        const S = coin / (pitch * F.dot);
        const r0 = Math.hypot(Math.max(cx, W - cx), Math.max(cy0, H - cy0)) + 2; // the farthest corner
        const rc = coin / 2;
        const set = (k: string, v: string) => el.style.setProperty(k, v);
        set("--W", f1(W));
        set("--H", f1(H));
        set("--cx", f1(cx));
        set("--cy", f1(cy));
        set("--cy0", f1(cy0));
        set("--r0", f1(r0));
        set("--rc", f1(rc));
        set("--coin", f1(coin));
        set("--pitch", f4(pitch));
        set("--S", f4(S));
        set("--half", f1(Math.min(W, Hs) / 2));
        set("--nav-h", f1(navH));

        top = el.getBoundingClientRect().top + window.scrollY;
        travel = Math.max(1, el.offsetHeight - st.offsetHeight);

        /* The nav, item by item (see THE NAV above): the scroll at which the circle's edge
           passes each visible item's middle. Hidden items (the phone menu's, a closed dropdown's)
           sit outside the bar and are skipped. */
        for (const it of ink) setInk(it, false);
        ink = [...document.querySelectorAll("nav a, nav button")]
          .map((n) => ({ n, r: n.getBoundingClientRect() }))
          .filter(({ r }) => r.width > 0 && r.top >= 0 && r.bottom <= navH + 24)
          .map(({ n, r }) => {
            /* x from the rect; y from the bar's middle, where every item is centred — on load the
               nav's entrance (nav-in: translateY 20px → 0) still has them lower than they sit */
            const reach = Math.hypot((r.left + r.right) / 2 - cx, navH / 2 - cy0);
            return { n, y: Math.round(uncoversAt(reach, r0, rc) * travel), on: false };
          });
        navEnd = ink.reduce((m, it) => Math.max(m, it.y), 0);
        /* nav.tsx counts the probe while its bottom is below its line (bottom > 40): this height
           ends that exactly at navEnd, where the inked items hand over to the whole nav */
        pr.style.height = `${navEnd + NAV_LINE}px`;
      };

      const write = () => {
        raf = 0;
        const y = window.scrollY - top;
        const p = clamp(y / travel, 0, 1);
        const s = at(p, last ?? undefined);
        for (const [k, v, nodes] of OUT)
          if (!last || s[k] !== last[k]) for (const n of nodes) n.style.setProperty(v, f4(s[k] as number));
        /* the band's mask follows the section's scroll while the band can still be on screen */
        const sc = Math.round(clamp(y, 0, H * 1.5));
        if (sc !== lastScroll) {
          bd.style.setProperty("--scroll", String(sc));
          lastScroll = sc;
        }
        const rel = Math.round(clamp(y - travel, 0, H));
        if (rel !== lastRel) {
          for (const n of REL) n.style.setProperty("--rel", String(rel));
          lastRel = rel;
        }
        for (const it of ink) setInk(it, y >= it.y && y < navEnd);
        if (!last || s.phase !== last.phase) el.setAttribute("data-phase", s.phase);
        if (!last || s.grow > 0 !== last.grow > 0) el.toggleAttribute("data-form", s.grow > 0);
        if (!last || s.idle !== last.idle) el.toggleAttribute("data-idle", s.idle);
        if (!last || s.lit !== last.lit) el.toggleAttribute("data-lit", s.lit);
        if (!last || s.beat !== last.beat) {
          el.setAttribute("data-beat-from", last ? last.beat : s.beat);
          el.setAttribute("data-beat", s.beat);
        }
        last = s;
      };
      const onScroll = () => {
        if (!raf) raf = requestAnimationFrame(write);
      };
      const remeasure = () => {
        const before = { travel, p: clamp((window.scrollY - top) / travel, 0, 1) };
        measure();
        /* the viewport's height changed the travel: keep the reader's place, not its pixel */
        if (last && Math.abs(travel - before.travel) > 1 && before.p > 0 && before.p < 1) {
          const y = Math.round(top + before.p * travel);
          const lenis = (window as Window & { __lenis?: Lenis }).__lenis;
          if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
          else window.scrollTo(0, y);
        }
        write();
        /* nav.tsx read the probe before this measure: have it read the new size */
        window.dispatchEvent(new Event("scroll"));
      };

      remeasure();
      /* The first read decides the thresholds without playing them (a page restored halfway
         down shouldn't ripple); from the next frame on, they transition. */
      requestAnimationFrame(() => el.setAttribute("data-live", ""));
      let alive = true;
      document.fonts?.ready.then(() => alive && remeasure());
      const ro = new ResizeObserver(() => remeasure());
      ro.observe(hb);
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", remeasure);

      return () => {
        alive = false;
        ro.disconnect();
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", remeasure);
        if (raf) cancelAnimationFrame(raf);
        for (const k of GEOM) el.style.removeProperty(k);
        for (const [, v, nodes] of OUT) for (const n of nodes) n.style.removeProperty(v);
        bd.style.removeProperty("--scroll");
        for (const n of REL) n.style.removeProperty("--rel");
        for (const it of ink) setInk(it, false);
        for (const a of ["data-idle", "data-lit", "data-live", "data-phase", "data-beat-from", "data-form"]) el.removeAttribute(a);
        el.setAttribute("data-beat", "hero");
        pr.style.removeProperty("height");
        window.dispatchEvent(new Event("scroll"));
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
  }, []);

  const label = V10.flags.showCentreLabel ? V10.centreLabel : undefined;

  return (
    <section
      ref={root}
      id="top"
      className="v10-hero"
      data-beat="hero"
      data-turn={V10.flags.turn}
      data-light={V10.flags.light}
      style={DATA_VARS}
    >
      <noscript dangerouslySetInnerHTML={{ __html: NOSCRIPT_CSS }} />

      {/* The hero band: the photograph and its words. Static, a full-screen band with its own
          photograph. Pinned, the band's photograph is hidden (the stage's aperture is the photo)
          and its words ride over the stage's first viewport, then scroll and lift away. Its id is
          what the phone pill steps aside for (V10.pillHidden). */}
      <header ref={band} id="hero-words" className="v10-band">
        <div className="v10-band-photo" data-nav-theme="dark">
          <PhotoPicture className="v10-photo" />
          <div className="v10-scrim" />
        </div>
        <HeroWords />
      </header>

      {/* The nav's probe (see THE NAV above). */}
      <div ref={probe} className="v10-navprobe" data-nav-theme="dark" aria-hidden />

      {/* Pinned: the stage. */}
      <div ref={stage} className="v10-stage">
        {/* the small viewport's height, measured (see GEOMETRY) */}
        <div ref={svh} className="v10-svh" aria-hidden />
        <Aperture ref={aperture} />
        <div className="v10-field-host">
          <CoinField id="v10-stage" ref={field} label={label} />
        </div>
        <div ref={beats} className="v10-beats">
          <BeatWords beat="idle" />
          <BeatWords beat="prime" />
        </div>
      </div>

      {/* Static: the key frames, stacked — the idle field, then the token. */}
      <div className="v10-frames">
        <figure className="v10-frame" data-idle="">
          <BeatWords beat="idle" />
          <div className="v10-frame-art">
            <CoinField id="v10-idle" framed label={label} />
          </div>
        </figure>
        <figure className="v10-frame" data-lit="">
          <BeatWords beat="prime" />
          <div className="v10-frame-art">
            <CoinField id="v10-prime" framed />
          </div>
        </figure>
      </div>
    </section>
  );
}
