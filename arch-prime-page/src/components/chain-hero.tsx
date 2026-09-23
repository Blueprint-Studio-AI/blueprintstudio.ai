"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createIllustration, type IllustrationApi } from "./chain-illustration";
import { EXTERNAL } from "@/lib/site";

type Item = { c: string; b: string; lite?: string };
type Section = { h2: string; body: ReactNode; list?: Item[] };

const SECTIONS: Section[] = [
  {
    h2: "How is that possible?",
    // Two lines on wider screens; below the sm breakpoint the forced break is hidden so it
    // flows as one sentence instead of wrapping awkwardly into three lines.
    body: (
      <>
        Arch lets builders create applications directly around&nbsp;Bitcoin.{" "}
        <br className="hidden sm:block" />
        Computation happens on Arch, while ownership and settlement remain on&nbsp;Bitcoin.
      </>
    ),
  },
  {
    h2: "Native tech",
    body: "What’s built on Arch lives on Bitcoin: same coins, same wallets, same ledger. Making that true took new technology at almost every layer:",
    list: [
      { c: "settle", b: "Direct Bitcoin settlement", lite: "settles on Bitcoin's base layer" },
      { c: "utxo", b: "UTXO native execution", lite: "programs can own and move UTXOs, not IOUs" },
      { c: "addr", b: "Per-account addresses", lite: "verifiable on any explorer" },
      { c: "perutxo", b: "Per-account UTXOs", lite: "funds aren't commingled" },
      { c: "hybrid", b: "Hybrid Account Model", lite: "holds both balances and UTXOs" },
      { c: "taproot", b: "Taproot Support", lite: "works with existing wallets" },
      { c: "schnorr", b: "Threshold Schnorr (FROST + ROAST)", lite: "no single key ever exists" },
      { c: "vm", b: "Bitcoin-native VM", lite: "Solana’s eBPF, rebuilt on UTXOs" },
      { c: "dpos", b: "Fast dPoS consensus", lite: "180ms blocks, 1,500 TPS" },
    ],
  },
  {
    h2: "Financial primitives",
    body: "Speed, reliability, and general programmability become financial infrastructure on Bitcoin. Pooling on real UTXOs enables AMMs, oracle feeds enable collateral enforcement, and safe lending carries credit, perps, and structured products.",
    list: [
      { c: "pools", b: "Pooled liquidity" },
      { c: "oracle", b: "Real-time oracle feeds" },
      { c: "collateral", b: "Collateral enforcement" },
      { c: "liquidation", b: "Liquidation engine" },
      { c: "issuance", b: "Token issuance" },
      { c: "risk", b: "Risk & margin" },
    ],
  },
  {
    h2: "Finance unlocks",
    body: "Those primitives compose into real markets. From trading and lending to prime brokerage and more, Arch unlocks a DeFi ecosystem on native Bitcoin. It’s fast, easy to build on, and native all the way down.",
    list: [
      { c: "dexs", b: "DEXs" },
      { c: "lend", b: "Lending & credit" },
      { c: "prime", b: "Prime brokerage" },
      { c: "vaults", b: "Vaults" },
      { c: "stables", b: "Stablecoins" },
      { c: "rwas", b: "RWAs" },
      { c: "looping", b: "Looping" },
    ],
  },
];

// Map each feature id → its 1-based index in the left rail, so the dot on the diagram can show the
// same number. Numbering resets per section (each layer's rail starts at 1), which is exactly right
// since only the active layer's dots are visible at a time.
const FEATURE_NUM: Record<string, number> = {};
SECTIONS.forEach((sec) => sec.list?.forEach((it, i) => { FEATURE_NUM[it.c] = i + 1; }));

const STEP_LABELS = ["Hero", "Layer 1", "Layer 2", "Layer 3", "Layer 4", "Placeholder"];
// Per snap point: ty = text top (vh), gap = vh from text to artwork, is = illustration height (vh),
// imax = optional max illustration height (px) — only set where a slide needs a ceiling.
type Step = { ty: number; gap: number; is: number; imax?: number };
const DEFAULT_STEPS: Step[] = [
  { ty: 12, gap: 3, is: 105 },
  { ty: 12, gap: 5, is: 122 },
  { ty: 11, gap: 2, is: 114, imax: 1330 },
  { ty: 10, gap: 2, is: 89 },
  { ty: 8, gap: 0, is: 81 },
  { ty: 12, gap: 4, is: 85 },
];
// Mobile keeps its own keyframes (smaller art, tighter top) — tuned via the same levers.
const DEFAULT_STEPS_M: Step[] = [
  { ty: 15, gap: 4, is: 103 },
  { ty: 18, gap: 3, is: 97 },
  { ty: 14, gap: 4, is: 77, imax: 900 },
  { ty: 12, gap: 3, is: 77 },
  { ty: 11, gap: 1, is: 75 },
  { ty: 6, gap: 4, is: 103 },
];
const DEFAULT_X = -45; // horizontal cheat (px), negative = left
const DEFAULT_X_M = -26; // mobile horizontal cheat

const lerp = (a: number, b: number, f: number) => a + (b - a) * f;

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const illoRef = useRef<HTMLDivElement>(null);
  const illoApi = useRef<IllustrationApi | null>(null); // the inline illustration (was an iframe)
  const lastLayer = useRef(0);
  const lastActive = useRef(-1);
  const updateRef = useRef<() => void>(() => {});

  const [steps, setSteps] = useState(DEFAULT_STEPS);
  const [stepsM, setStepsM] = useState(DEFAULT_STEPS_M);
  const [isMobile, setIsMobile] = useState(false);
  const activeSteps = isMobile ? stepsM : steps;
  const stepsRef = useRef(activeSteps);
  stepsRef.current = activeSteps;
  const [illoX, setIlloX] = useState(DEFAULT_X);
  const [illoXM, setIlloXM] = useState(DEFAULT_X_M);
  const activeX = isMobile ? illoXM : illoX;
  const illoXRef = useRef(activeX);
  illoXRef.current = activeX;
  const [active, setActive] = useState(0);
  const [showLevers, setShowLevers] = useState(true);
  const [ready, setReady] = useState(false);

  const callIllo = (fn: string, ...args: unknown[]) => {
    const api = illoApi.current;
    if (!api) return;
    if (fn === "__archSelect") api.select(args[0] as string);
    else if (fn === "__archClearSel") api.clearSel();
  };
  const clearHighlights = () => document.querySelectorAll(".flist li.on").forEach((l) => l.classList.remove("on"));

  useEffect(() => {
    const mq = window.matchMedia("(max-width:480px)");
    const on = () => setIsMobile(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  useEffect(() => {
    // The iframe's #world camera (WS) keeps whichever layer is active vertically centered, so the
    // artwork sits at a constant place inside the iframe. But at load #world has no transform yet,
    // and setState slides it to WS(1) = -150px over a 1s transition — measuring before that lands
    // ~150px too high. So force the camera to its settled spot with the transition off, read the
    // top once, restore the transition, and lock it. One stable value for every layer kills the
    // per-layer jump and the mid-pan "shoot down"; `gap` reads as text-to-top-of-artwork.
    let atTop = 240;
    let atLocked = false;
    const measureTop = () => {
      if (atLocked) return true;
      try {
        const stage = illoRef.current;
        const api = illoApi.current;
        if (!stage || !api) return false;
        const iso = stage.querySelector("#iso") as SVGSVGElement | null;
        const world = stage.querySelector("#world") as SVGGElement | null;
        const l1 = stage.querySelector("#L1");
        if (!iso || !world || !l1) return false;
        const prev = world.style.transition;
        world.style.transition = "none"; // apply WS(1) instantly so we read the settled top
        api.setState(1);
        lastLayer.current = 1;
        void world.getBoundingClientRect(); // force reflow
        const isoR = iso.getBoundingClientRect();
        const r = l1.getBoundingClientRect();
        world.style.transition = prev;
        // L1 top within the SVG's intrinsic 790px space — undo the .illo display scale so `atTop`
        // matches what the old (unscaled) iframe content measured.
        if (r.height > 8 && isoR.height > 0) {
          atTop = (r.top - isoR.top) / (isoR.height / 790);
          atLocked = true;
          return true;
        }
      } catch { /* not ready */ }
      return false;
    };
    const setLayer = (n: number) => {
      if (n === lastLayer.current) return;
      illoApi.current?.setState(n);
      lastLayer.current = n;
    };

    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    let raf = 0;
    let intro = 1; // load intro: illustration starts a touch low and drifts up into place
    let introRaf = 0;
    let revealed = false;
    const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);

    // ---- scroll-progress → animation ----------------------------------------------------------
    // The hero is a pinned "scrub": .illo-stage + .copyover are position:fixed and the .snaps
    // track supplies the scroll height, so the whole composition holds still while `t` (0..N+1) is
    // read straight off scroll position. Lenis smooths that scroll; there is NO wheel/touch
    // hijacking, so Lenis is the single scroll authority for the entire /chain page.
    const update = () => {
      raf = 0;
      const root = rootRef.current;
      if (!root) return;
      const vh = window.innerHeight / 100;
      const N = SECTIONS.length;
      const t = Math.min(N + 1, Math.max(0, window.scrollY / window.innerHeight));
      const s = stepsRef.current;

      const base: Record<number, number> = {};
      root.querySelectorAll<HTMLElement>(".panel").forEach((el) => {
        const i = Number(el.dataset.i);
        const d = t - i;
        // The LAST section doesn't fade on the way out — the opaque below-fold ("Four rules")
        // simply slides up and OCCLUDES it. Fading it instead is what left an empty cream void
        // on the exit ramp. Everything else cross-fades between sections as before.
        const o = i === N && d > 0 ? 1 : Math.max(0, 1 - Math.abs(d) * 1.9);
        el.style.opacity = o.toFixed(3);
        el.style.transform = `translateX(-50%) translateY(${(d * 16).toFixed(1)}px)`;
        el.style.pointerEvents = o > 0.6 ? "auto" : "none";
        base[i] = el.offsetTop + el.offsetHeight; // stable bottom
      });

      const i0 = Math.min(N, Math.floor(t));
      const i1 = Math.min(N, i0 + 1);
      const f = Math.min(1, t - Math.floor(t));
      const ci = Math.min(N - 1, i0);
      const ci1 = Math.min(N - 1, i1);
      const textBottom = lerp(base[ci] ?? 0, base[ci1] ?? 0, f);
      const at = atTop;
      const gap = lerp(s[i0].gap, s[i1].gap, f) * vh;
      const sc = (st: Step) => Math.min((st.is / 100) * window.innerHeight / 790, (st.imax ?? Infinity) / 790);
      const scale = lerp(sc(s[i0]), sc(s[i1]), f);
      const y = textBottom + gap - at * scale + intro * 42;
      if (illoRef.current) {
        // Safari re-rasterizes the inline vector SVG on every distinct scale value, so quantize to
        // dedup identical frames. Steps must stay sub-pixel — the vh sizing swings scale far wider
        // than the old ~1% range, and coarse steps make the slow tail of a settle visibly jerk.
        const qScale = (Math.round(scale * 500) / 500).toFixed(3);
        illoRef.current.style.transform = `translate3d(${illoXRef.current}px, ${y.toFixed(1)}px, 0) scale(${qScale})`;
        illoRef.current.style.opacity = "1"; // no fade — the below-fold occludes the artwork as it rises
      }
      // Once fully past the hero (the below-fold completely covers it), hard-hide the fixed
      // overlays so the same-origin iframe can't composite/flicker behind the scrolling content.
      root.classList.toggle("hero-done", t >= N + 1);

      const a = Math.round(t);
      if (a !== lastActive.current) {
        lastActive.current = a;
        setActive(a);
        clearHighlights();
        callIllo("__archClearSel");
      }
      setLayer(Math.min(N, Math.max(1, a)));
    };
    updateRef.current = update;

    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    const onResize = () => { if (!raf) raf = requestAnimationFrame(update); };

    // The illustration is now an INLINE svg (no iframe) — so it no longer traps the wheel, needs no
    // synthetic-wheel forwarder, no pointer-events:coarse hack, and no reduced-motion freeze fix, and
    // it talks to us via a direct callback instead of postMessage. onSelect mirrors the old message
    // handler: hovering a node in the art highlights the matching feature in the left rail.
    const onSelect = (id: string | null) => {
      clearHighlights();
      if (id) (document.querySelector(`.flist li[data-c="${id}"]`) as HTMLElement | null)?.classList.add("on");
    };

    // ---- mount the inline illustration, then run the load sequence ----
    // Build the SVG scene synchronously (no iframe load to await), then show layer 1.
    if (illoRef.current && !illoApi.current) {
      illoApi.current = createIllustration(illoRef.current, { onSelect, numbers: FEATURE_NUM });
      lastLayer.current = 0;
      illoApi.current.setState(1);
      lastLayer.current = 1;
    }

    const runIntro = () => {
      const t0 = performance.now();
      const step = () => {
        const p = Math.min(1, (performance.now() - t0) / 700);
        intro = 1 - easeOut(p);
        update();
        if (p < 1) introRaf = requestAnimationFrame(step);
      };
      introRaf = requestAnimationFrame(step);
    };
    // Fade in only once fonts are ready AND the artwork top is measured, so the first visible
    // frame is already correct — then drift up into place once (no load-time jerk, no double).
    let fontsDone = false;
    let finishPoll = 0;
    const reveal = () => {
      if (revealed) return;
      revealed = true;
      if (finishPoll) clearInterval(finishPoll);
      setReady(true);
      runIntro();
    };
    const tryFinish = () => {
      const ok = measureTop();
      updateRef.current();
      if (fontsDone && ok) reveal();
    };
    if (document.fonts?.ready) document.fonts.ready.then(() => { fontsDone = true; tryFinish(); }).catch(() => { fontsDone = true; });
    finishPoll = window.setInterval(tryFinish, 120);
    const loadFallback = window.setTimeout(() => { fontsDone = true; reveal(); }, 1800);

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
      if (introRaf) cancelAnimationFrame(introRaf);
      if (finishPoll) clearInterval(finishPoll);
      clearTimeout(loadFallback);
      illoApi.current?.destroy();
      illoApi.current = null;
    };
  }, []);

  // ---- hero snap: one beat per gesture, cooperating with the single Lenis instance ----------
  // The hero has N+1 "beats" (the headline + N sections) sitting at i*100vh on the .snaps track.
  // Each wheel gesture advances exactly ONE beat via lenis.scrollTo — Lenis stays the only scroll
  // authority (no preventDefault, no native scroll), so this can't reintroduce the old two-machine
  // fight. At the last beat, scrolling down hands off to the below-fold ("Four rules") with ONE
  // clean scrollTo, so we never scrub through the empty fade-ramp (that was the seam "spazz");
  // scrolling back up through the ramp re-snaps onto the last beat. Touch devices fall through to
  // free native scroll (Lenis emits no virtual-scroll for un-synced touch) and scrub fine.
  useEffect(() => {
    type L = {
      scrollTo: (t: number, o: Record<string, unknown>) => void;
      on: (e: string, f: (a: { deltaY: number }) => void) => void;
      off: (e: string, f: (a: { deltaY: number }) => void) => void;
    };
    const N = SECTIONS.length; // beats 0..N
    const ease = (x: number) => 1 - Math.pow(1 - x, 3);
    // "Resistance" of the sticky points: a gesture must build past THRESH of accumulated wheel
    // before it breaks free of the current beat. Only an accelerating/steady push counts — the
    // decelerating momentum TAIL of a flick is ignored — so one hard flick advances exactly ONE
    // beat instead of cascading. Tune THRESH to taste.
    const THRESH = 90;
    const PAUSE = 200; // ms gap that starts a fresh gesture
    let armed = true;
    let acc = 0; // accumulated wheel for the current gesture
    let lastT = 0;
    let idleT = 0;
    let resizeT = 0;
    let mags: number[] = []; // recent |deltaY| history → accel-vs-momentum detection
    let waitRaf = 0;
    let lenis: L | null = null;

    // The hero owns ONLY its own scroll range [0, boundary]. `boundary` is the foot of the .snaps
    // track = the top of the below-fold ("Four rules"). Below it the machine is completely inert,
    // so the whole below-fold (WhyBand / How-it-works / footer) is pure free Lenis scroll and can
    // NEVER be yanked back up. inHero() is the single guard every path checks first.
    const ih = () => window.innerHeight;
    const boundaryY = () => (N + 1) * ih();
    const inHero = () => window.scrollY < boundaryY() - 2;

    const avg = (a: number[], n: number) => {
      const len = a.length;
      if (!len) return 0;
      const k = Math.min(n, len);
      let s = 0;
      for (let i = len - k; i < len; i++) s += a[i];
      return s / k;
    };
    const rearm = () => window.setTimeout(() => { armed = true; }, 60);
    const snapTo = (y: number, dur: number) => {
      if (!lenis) return;
      armed = false;
      acc = 0;
      lenis.scrollTo(y, { lock: true, duration: dur, easing: ease, onComplete: rearm });
    };

    // one gesture = one beat (only while in the hero)
    const onV = (e: { deltaY: number }) => {
      if (!lenis) return;
      const now = performance.now();
      if (now - lastT > PAUSE) { acc = 0; mags = []; } // a real pause = a fresh gesture
      lastT = now;
      if (!inHero()) return; // below the hero → totally inert; free scroll owns it
      mags.push(Math.abs(e.deltaY));
      if (mags.length > 80) mags.shift();
      if (!armed) return; // mid-snap → the scrollTo lock also blocks input
      // decelerating (recent clearly weaker than the run) = the flick's momentum tail → ignore it.
      if (avg(mags, 8) < avg(mags, 30) * 0.9) { acc = 0; return; }
      if (acc * e.deltaY < 0) acc = 0; // direction reversed → start accumulating fresh
      acc += e.deltaY;
      if (Math.abs(acc) < THRESH) return; // sub-threshold → idle-settle rubber-bands back onto a beat

      const v = ih();
      const y = window.scrollY;
      const dir = acc > 0 ? 1 : -1;
      const lastBeatY = N * v;
      // exit ramp (between the last beat and the below-fold): up settles onto the last beat (never
      // steps to N-1 — that skipped a layer coming back up), down hands off to the below-fold.
      if (y > lastBeatY + 2) {
        snapTo(dir > 0 ? boundaryY() : lastBeatY, dir > 0 ? 0.7 : 0.55);
        return;
      }
      const cur = Math.max(0, Math.min(N, Math.round(y / v)));
      if (dir > 0) snapTo(cur >= N ? boundaryY() : (cur + 1) * v, cur >= N ? 0.7 : 0.55); // down
      else if (cur > 0) snapTo((cur - 1) * v, 0.55); // up
      else acc = 0; // already at the top
    };

    // Where should we settle, given a live position y inside the hero? In the exit ramp (between the
    // last beat and the below-fold) settle to whichever EDGE is nearer — the last beat, or the
    // below-fold top (WhyBand). Including the boundary as a candidate is what stops a small peek-up
    // from the WhyBand seam being yanked a near-full viewport UP onto the last beat.
    const settleTarget = (y: number, v: number) =>
      y > N * v
        ? (y - N * v > v / 2 ? (N + 1) * v : N * v)
        : Math.max(0, Math.min(N, Math.round(y / v))) * v;

    // Idle-settle: whenever scrolling STOPS inside the hero off a sticky point, ease onto the nearest
    // one. Safety net for momentum coasts / sub-threshold nudges; NEVER touches the free sections.
    const onScroll = () => {
      if (idleT) clearTimeout(idleT);
      idleT = window.setTimeout(() => {
        if (!armed || !lenis || !inHero()) return;
        const v = ih();
        const y = window.scrollY;
        const target = settleTarget(y, v);
        if (Math.abs(y - target) > 6) snapTo(target, 0.4);
      }, 130);
    };

    // Beats are innerHeight-relative, so a window resize (tiling, half-screen, devtools, rotate)
    // leaves a parked hero mid-crossfade — and a resize fires no scroll event, so idle-settle can't
    // self-heal it. Re-snap onto the nearest beat from the LIVE innerHeight (debounced so a drag
    // doesn't spam locking scrolls). Guarded to the hero so it never disturbs the below-fold.
    const onResize = () => {
      if (resizeT) clearTimeout(resizeT);
      resizeT = window.setTimeout(() => {
        if (!lenis || !inHero()) return;
        const v = ih();
        snapTo(Math.max(0, Math.min(N, Math.round(window.scrollY / v))) * v, 0.3);
      }, 160);
    };

    const attach = () => {
      lenis = (window as Window & { __lenis?: L }).__lenis ?? null;
      if (!lenis) { waitRaf = requestAnimationFrame(attach); return; }
      lenis.on("virtual-scroll", onV);
      lenis.on("scroll", onScroll as (a: { deltaY: number }) => void);
    };
    attach();
    window.addEventListener("resize", onResize);
    return () => {
      if (waitRaf) cancelAnimationFrame(waitRaf);
      if (idleT) clearTimeout(idleT);
      if (resizeT) clearTimeout(resizeT);
      window.removeEventListener("resize", onResize);
      lenis?.off("virtual-scroll", onV);
      lenis?.off("scroll", onScroll as (a: { deltaY: number }) => void);
    };
  }, []);

  useEffect(() => { updateRef.current(); }, [steps, stepsM, illoX, illoXM, isMobile]);

  const setLever = (key: "ty" | "gap" | "is" | "imax", val: number) =>
    (isMobile ? setStepsM : setSteps)((prev) => prev.map((st, i) => (i === active ? { ...st, [key]: val } : st)));

  // the active section's feature list (active 1..N map to SECTIONS 0..N-1) — drives the rail (desktop/tablet only)
  const activeList = active >= 1 && active <= SECTIONS.length ? SECTIONS[active - 1]?.list : undefined;

  return (
    <main className={`root${ready ? " ready" : ""}`} ref={rootRef}>
      {/* glow lives OUTSIDE .illo-stage: that stage is promoted to its own GPU layer
          (translateZ/will-change/backface), which clips overflowing children — and the glow
          deliberately overflows the viewport bottom. As its own fixed layer it isn't clipped,
          so the soft orange falloff reaches the bottom with no hard line. */}
      <div className="glow" aria-hidden />
      <div className="illo-stage" aria-hidden>
        <div className="illo" ref={illoRef}>
          {/* inline illustration (was an iframe) — createIllustration() builds into #iso */}
          <svg
            id="iso"
            viewBox="-320 -360 680 790"
            aria-label="Isometric layer stack: Bitcoin and Arch chains, native tech board, finance district, app layer"
          />
          <div id="card">
            <div className="t" />
            <div className="b" />
          </div>
        </div>
      </div>

      <div className="copyover">
        <div className="panel" data-i="0" style={{ top: `${activeSteps[0].ty}vh` }}>
          {/* ponytail: pill parked, no spacer. Restore by uncommenting:
          <span className="chip"><i className="dot" />Testnet live · mainnet 2026</span> */}
          <h1>
            <span className="h1-pre">The financial chain for</span>
            <span className="h1-serif">Native Bitcoin</span>
          </h1>
          <p className="sub">DeFi that actually works.</p>
          <div className="btns">
            {/* "See how it works" begins the guided scroll — advance one beat to "How is that possible?".
                Programmatic lenis.scrollTo lands on the beat; the snap machine's idle-settle keeps it there. */}
            <a
              className="btn btn--primary"
              href="#how"
              onClick={(e) => {
                e.preventDefault();
                const l = (window as Window & {
                  __lenis?: { scrollTo: (t: number, o?: Record<string, unknown>) => void };
                }).__lenis;
                const y = window.innerHeight;
                if (l) l.scrollTo(y, { duration: 1.1 });
                else window.scrollTo({ top: y, behavior: "smooth" });
              }}
            >
              See how it works <span className="ar">↓</span>
            </a>
            <a className="btn btn--ghost" href={EXTERNAL.docs} target="_blank" rel="noopener noreferrer">
              Read the docs
            </a>
          </div>
        </div>

        {SECTIONS.map((sec, idx) => (
          <div className="panel panel--sec" data-i={idx + 1} key={idx} style={{ top: `${activeSteps[idx + 1].ty}vh` }}>
            <h2>{sec.h2}</h2>
            <p className="body" style={{ whiteSpace: "pre-line", textWrap: "pretty" }}>{sec.body}</p>
          </div>
        ))}
      </div>

      {/* Feature index rail — desktop/tablet only; CSS hides it on mobile. */}
      <aside className={`flist-rail${activeList ? " on" : ""}`} aria-hidden={!activeList}>
        {activeList && (
          <ul className="flist" key={active}>
            {activeList.map((it) => (
              <li
                key={it.c}
                data-c={it.c}
                onMouseEnter={() => {
                  clearHighlights();
                  (document.querySelector(`.flist li[data-c="${it.c}"]`) as HTMLElement)?.classList.add("on");
                  callIllo("__archSelect", it.c);
                }}
                onMouseLeave={() => {
                  clearHighlights();
                  callIllo("__archClearSel");
                }}
              >
                <b>{it.b}</b>
                {it.lite && <span className="lite">{it.lite}</span>}
              </li>
            ))}
          </ul>
        )}
      </aside>

      <div className="snaps" aria-hidden>
        {[0, 1, 2, 3, 4].map((i) => (
          <div className="snap-pt" data-i={i} key={i} />
        ))}
      </div>
      {/* Below-fold (chain-below.tsx) is now rendered as a REAL React sibling by
          chain/layout.tsx — de-iframed so position:sticky / scroll-driven sections work. */}

      {/* levers tuning panel — dev-only overlay; uncomment to re-enable
      {showLevers ? (
        <div className="levers">
          <div className="lev-head">
            <span>{isMobile ? "mobile" : "desktop"} · {STEP_LABELS[active]}</span>
            <button onClick={() => setShowLevers(false)}>×</button>
          </div>
          <label>
            <span>text top · {activeSteps[active].ty}vh</span>
            <input type="range" min={2} max={40} value={activeSteps[active].ty} onChange={(e) => setLever("ty", Number(e.target.value))} />
          </label>
          <label>
            <span>gap to illustration · {activeSteps[active].gap}vh</span>
            <input type="range" min={0} max={24} value={activeSteps[active].gap} onChange={(e) => setLever("gap", Number(e.target.value))} />
          </label>
          <label>
            <span>illustration size · {activeSteps[active].is}vh</span>
            <input type="range" min={40} max={140} step={1} value={activeSteps[active].is} onChange={(e) => setLever("is", Number(e.target.value))} />
          </label>
          <label>
            <span>illustration max · {activeSteps[active].imax ?? "off"}{activeSteps[active].imax != null ? "px" : ""}</span>
            <input type="range" min={300} max={1600} step={10} disabled={activeSteps[active].imax == null} value={activeSteps[active].imax ?? 1000} onChange={(e) => setLever("imax", Number(e.target.value))} />
          </label>
          <label>
            <span>illustration X · {activeX}px</span>
            <input type="range" min={-200} max={200} value={activeX} onChange={(e) => (isMobile ? setIlloXM : setIlloX)(Number(e.target.value))} />
          </label>
          <pre>{`${isMobile ? "mobile" : "desktop"} · X ${activeX}px\n` + activeSteps.map((st, i) => `${STEP_LABELS[i]}: ty ${st.ty} · gap ${st.gap} · is ${st.is}${st.imax != null ? ` · max ${st.imax}` : ""}`).join("\n")}</pre>
        </div>
      ) : (
        <button className="levers-open" onClick={() => setShowLevers(true)}>levers</button>
      )}
      */}
    </main>
  );
}
