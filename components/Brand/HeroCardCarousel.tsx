"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";

// The seven brand cards. Each PNG is a complete card composite (hero image +
// thumbnails), so we just render it inside a rounded, shadowed frame.
const cards = [
  { src: "/media/hero/uni_brands-we-built.png", alt: "UNI brand identity" },
  { src: "/media/hero/honeyb_brands-we-built.png", alt: "HoneyB brand identity" },
  { src: "/media/hero/breeze_brands-we-built.png", alt: "Breeze brand identity" },
  { src: "/media/hero/autara_brands-we-built.png", alt: "Autara brand identity" },
  { src: "/media/hero/huch_brands-we-built.png", alt: "Huch brand identity" },
  { src: "/media/hero/kind_brands-we-built.png", alt: "The Kind Mind brand identity" },
  { src: "/media/hero/autara_brands-we-built-1.png", alt: "Autara brand identity" },
];

// Render three identical sets so the strip can loop seamlessly: we keep the
// scroll inside the middle set and teleport by one set-width whenever the user
// drifts into a neighbouring set. Visually identical sets ⇒ the jump is invisible.
const SETS = 3;
const loopCards = Array.from({ length: SETS }, () => cards).flat();
const CENTER = Math.floor(loopCards.length / 2); // start here (middle of middle set)
const N = cards.length;

// Figma sizing (1440 canvas): the selected/centre card is 388px wide, the rest
// are 244px, 32px apart. We lay the strip out at the SELECTED size and scale
// every card DOWN to the non-selected size by default; the focused card scales
// back up to 1.0 (its own box) on hover. Because a card never grows past its
// layout box, it can never overflow the scroll container — so no clipping, in
// any browser. (Scaling UP past the box is what was getting clipped in Safari.)
const CARD_W = 244; // non-selected width (scaled down from the 388 box)
const SELECTED_W = 388;
const MIN_SCALE = CARD_W / SELECTED_W; // ≈ 0.63 (non-selected size)

// Weight: one deliberate card per swipe, eased into place. This is immune to the
// Mac trackpad's long momentum tail (which makes free-scroll models "fly"), so
// every card lands with weight. A fast flick advances two; a gentle one, one.
const GESTURE_GAP_MS = 140; // wheel-quiet time that ends a swipe gesture
const WHEEL_GATE = 4; // ignore sub-pixel wheel jitter
const FLICK_DELTA = 90; // first-event |deltaX| above this = a fast flick (2 cards)
const SNAP_MS = 520; // glide duration — higher = heavier / more deliberate
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

// Coverflow "centre focus": the centred card always rides at full size (388),
// side cards at the down-scaled size. (At 1.0 hover no longer grows it — there's
// no room past full — so hover only adds the shadow + 3D tilt.)
const IDLE_FOCUS = 1; // baseline highlight at idle (0 = uniform, 1 = full selected)

// Idle auto-scroll: disabled — the strip sits still and only the user moves it
// (swipe / drag / wheel). Flip AUTO_SCROLL to true to bring the drift back.
const AUTO_SCROLL = false;
const AUTO_SPEED = 0.6; // px per frame (~36px/s at 60fps) when AUTO_SCROLL is on
const RELEASE_MS = 1000; // gradual shrink-to-idle duration after the cursor leaves
// Shrink profile (remaining fraction, 1 = selected size → 0 = idle): accelerate
// the focused card down into idle — speed grows the smaller it gets, peaking
// right as it arrives — then a single critically-damped overshoot a hair below
// idle to give it weight, settling back to rest.
const SHRINK_POW = 2.5; // inward acceleration (higher = slower start, faster arrival)
const SHRINK_SPLIT = 0.62; // share of the timeline spent shrinking to idle (rest = overshoot + settle)
const SHRINK_OVERSHOOT = 0.07; // dip below idle, as a fraction of the big→idle range
const releaseFrac = (p: number) => {
  if (p < SHRINK_SPLIT) return 1 - Math.pow(p / SHRINK_SPLIT, SHRINK_POW);
  const vEnd = SHRINK_POW / SHRINK_SPLIT; // inward speed at the idle crossing
  const omega = vEnd / (SHRINK_OVERSHOOT * Math.E); // tail stiffness tuned to that overshoot
  const tau = p - SHRINK_SPLIT;
  return -vEnd * tau * Math.exp(-omega * tau); // dip below idle, then settle to 0
};

// 3D cursor tilt on the focused card — the side under the cursor presses back.
const MAX_TILT = 9; // max rotation in degrees
const TILT_PERSPECTIVE = 800; // px; lower = stronger 3D

export default function HeroCardCarousel() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);
  const setWidthRef = useRef(0);
  const animRef = useRef<number | null>(null);
  const animatingRef = useRef(false);
  const userMovedRef = useRef(false);
  const autoRef = useRef<number | null>(null);
  const autoActiveRef = useRef(false);
  const hoveringRef = useRef(false);
  // 0 = idle (cards uniform, no scale), 1 = focused (centre card highlighted).
  const hoverAmountRef = useRef(0);
  const hoverRafRef = useRef<number | null>(null);
  const tiltedRef = useRef<HTMLDivElement | null>(null); // card currently 3D-tilted
  const liftedRef = useRef<HTMLDivElement | null>(null); // non-centre card currently lifted

  // Lay out + scale every card each frame. The strip's layout is a uniform grid
  // (244px boxes, 32px gaps) which keeps scrolling/snapping simple; on top of
  // that we (a) scale the centred card up to the selected size and (b) translate
  // the others outward so the enlarged card keeps a true 32px gap to its
  // neighbours instead of overlapping them. translateX is transform-only, so the
  // grid/scroll positions never shift (no layout feedback).
  const paint = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const arr = cardRefs.current;
    const a = arr[0];
    const b = arr[1];
    if (!a) return;
    const lw = a.offsetWidth; // non-selected (layout) width, 244
    const pitch = b ? b.offsetLeft - a.offsetLeft : lw + 32;
    const gap = pitch - lw; // 32
    const falloff = pitch; // selected size only at the centre, normal by next slot
    // The centred card (nearest fc) is the one that enlarges. Hovering eases the
    // hovered card to the centre (easeTo), so the highlight follows it there.
    const fc = scroller.scrollLeft + scroller.clientWidth / 2;
    const uc0 = a.offsetLeft + lw / 2;
    const n = arr.length;
    // Highlight amount: IDLE_FOCUS at rest (the centre rides a bit larger), easing
    // up to 1 (centre fully enlarged) as hover ramps in. h can dip slightly below
    // 0 during the release overshoot, which is fine.
    const h = hoverAmountRef.current;
    const e = IDLE_FOCUS + (1 - IDLE_FOCUS) * h;

    // Pass 1: per-card scale + its centre in a cumulative "visual" strip where
    // each card occupies its scaled width with 32px gaps.
    const scaleArr = new Array<number>(n);
    const visCenter = new Array<number>(n);
    let cursor = 0;
    for (let i = 0; i < n; i++) {
      const c = arr[i];
      const norm = c
        ? Math.min(Math.abs(fc - (c.offsetLeft + c.offsetWidth / 2)) / falloff, 1)
        : 1;
      // Non-selected size by default (MIN_SCALE); the focused card eases up to
      // 1.0 (its full box) as the highlight (e) ramps in.
      const s = MIN_SCALE + (1 - MIN_SCALE) * (1 - norm) * e;
      scaleArr[i] = s;
      const w = s * lw;
      visCenter[i] = cursor + w / 2;
      cursor += w + gap;
    }

    // Map the focus point into that visual strip (continuously, so there's no
    // jump as the centred card changes), then shift the strip to sit under it.
    const fIdx = (fc - uc0) / pitch;
    const lo = Math.max(0, Math.min(n - 1, Math.floor(fIdx)));
    const hi = Math.max(0, Math.min(n - 1, lo + 1));
    const frac = Math.max(0, Math.min(1, fIdx - lo));
    const visFocus = visCenter[lo] + (visCenter[hi] - visCenter[lo]) * frac;
    const offset = fc - visFocus;

    // Pass 2: apply transform + depth + shadow.
    for (let i = 0; i < n; i++) {
      const c = arr[i];
      if (!c) continue;
      const uc = c.offsetLeft + c.offsetWidth / 2;
      const tx = visCenter[i] + offset - uc;
      c.style.transform = `translateX(${tx}px) scale(${scaleArr[i]})`;
      const norm = Math.min(Math.abs(fc - uc) / falloff, 1);
      c.style.zIndex = String(Math.round((1 - norm) * 100));
      // Drop shadow only on the (near-)selected card while focused; none idle.
      const inner = c.firstElementChild as HTMLElement | null;
      if (inner) {
        const alpha = 0.34 * Math.max(0, 1 - norm * 1.8) * h;
        inner.style.boxShadow =
          alpha > 0.004
            ? `0 10px 26px -10px rgba(15,23,42,${alpha.toFixed(3)})`
            : "none";
      }
    }
  }, []);

  // Keep the scroll within the middle set; teleport by a whole set-width (an exact
  // multiple of the card pitch, so card positions line up) when nearing an edge.
  const wrap = useCallback(() => {
    const scroller = scrollerRef.current;
    const sw = setWidthRef.current;
    if (!scroller || sw <= 0) return;
    if (scroller.scrollLeft < sw) scroller.scrollLeft += sw;
    else if (scroller.scrollLeft > sw * 2) scroller.scrollLeft -= sw;
  }, []);

  // Eased glide to an exact scroll position; native snap is suspended for the
  // duration so it can't fight the animation, then restored (for touch).
  const easeTo = useCallback(
    (target: number) => {
      const scroller = scrollerRef.current;
      if (!scroller) return;
      if (animRef.current != null) cancelAnimationFrame(animRef.current);
      const start = scroller.scrollLeft;
      const dist = target - start;
      if (Math.abs(dist) < 1) {
        scroller.scrollLeft = target;
        scroller.style.scrollSnapType = "";
        paint();
        return;
      }
      const t0 = performance.now();
      animatingRef.current = true;
      scroller.style.scrollSnapType = "none";
      const tick = (now: number) => {
        const t = Math.min(1, (now - t0) / SNAP_MS);
        scroller.scrollLeft = start + dist * easeOutCubic(t);
        paint();
        if (t < 1) {
          animRef.current = requestAnimationFrame(tick);
        } else {
          animRef.current = null;
          animatingRef.current = false;
          scroller.style.scrollSnapType = "";
          wrap();
          paint();
        }
      };
      animRef.current = requestAnimationFrame(tick);
    },
    [paint, wrap]
  );

  // Settle onto whichever card is nearest the centre right now.
  const snapNearest = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const center = scroller.scrollLeft + scroller.clientWidth / 2;
    let nearest = 0;
    let best = Infinity;
    cardRefs.current.forEach((c, i) => {
      if (!c) return;
      const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - center);
      if (d < best) {
        best = d;
        nearest = i;
      }
    });
    const target = cardRefs.current[nearest];
    if (target) {
      easeTo(target.offsetLeft + target.offsetWidth / 2 - scroller.clientWidth / 2);
    }
  }, [easeTo]);

  // Glide `step` cards (signed) from whichever card is currently centred.
  const stepCards = useCallback(
    (step: number) => {
      const scroller = scrollerRef.current;
      if (!scroller) return;
      const center = scroller.scrollLeft + scroller.clientWidth / 2;
      let nearest = 0;
      let best = Infinity;
      cardRefs.current.forEach((c, i) => {
        if (!c) return;
        const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - center);
        if (d < best) {
          best = d;
          nearest = i;
        }
      });
      const idx = Math.max(0, Math.min(cardRefs.current.length - 1, nearest + step));
      const target = cardRefs.current[idx];
      if (target) {
        easeTo(target.offsetLeft + target.offsetWidth / 2 - scroller.clientWidth / 2);
      }
    },
    [easeTo]
  );

  // --- Hover highlight: grow on focus, gradual ease-in shrink on release ----
  const cancelHoverRaf = () => {
    if (hoverRafRef.current != null) {
      cancelAnimationFrame(hoverRafRef.current);
      hoverRafRef.current = null;
    }
  };

  // Snappy ease-out toward the focused (enlarged) state — on hover/touch.
  const grow = useCallback(() => {
    cancelHoverRaf();
    const step = () => {
      const cur = hoverAmountRef.current;
      const diff = 1 - cur;
      if (diff < 0.004) {
        hoverAmountRef.current = 1;
        hoverRafRef.current = null;
        paint();
        return;
      }
      hoverAmountRef.current = cur + diff * 0.16; // ~280ms ease-out
      paint();
      hoverRafRef.current = requestAnimationFrame(step);
    };
    hoverRafRef.current = requestAnimationFrame(step);
  }, [paint]);

  // --- Idle auto-scroll ----------------------------------------------------
  const stopAuto = useCallback(() => {
    autoActiveRef.current = false;
    if (autoRef.current != null) {
      cancelAnimationFrame(autoRef.current);
      autoRef.current = null;
    }
  }, []);

  const startAuto = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!AUTO_SCROLL || !scroller || autoActiveRef.current || hoveringRef.current) return;
    // don't fight a settle glide
    if (animRef.current != null) {
      cancelAnimationFrame(animRef.current);
      animRef.current = null;
      animatingRef.current = false;
    }
    autoActiveRef.current = true;
    scroller.style.scrollSnapType = "none";
    const tick = () => {
      const s = scrollerRef.current;
      if (!s || !autoActiveRef.current) {
        autoRef.current = null;
        return;
      }
      s.scrollLeft += AUTO_SPEED;
      wrap();
      paint();
      autoRef.current = requestAnimationFrame(tick);
    };
    autoRef.current = requestAnimationFrame(tick);
  }, [paint, wrap]);

  const pauseAuto = useCallback(() => {
    stopAuto();
  }, [stopAuto]);

  // Once the cursor leaves, shrink the focused card back to idle over RELEASE_MS
  // via releaseFrac() — accelerating inward (fastest as it reaches idle) with a
  // small weighted overshoot + settle. The drift resumes the instant it lands.
  // Re-hovering mid-shrink hands control back to grow().
  const release = useCallback(() => {
    cancelHoverRaf();
    const startVal = hoverAmountRef.current;
    const t0 = performance.now();
    const step = (now: number) => {
      if (hoveringRef.current) {
        hoverRafRef.current = null;
        return;
      }
      const p = Math.min((now - t0) / RELEASE_MS, 1);
      hoverAmountRef.current = startVal * releaseFrac(p);
      paint();
      if (p < 1) {
        hoverRafRef.current = requestAnimationFrame(step);
      } else {
        hoverAmountRef.current = 0;
        hoverRafRef.current = null;
        paint();
        startAuto(); // resume drifting now that the card is back to idle size
      }
    };
    hoverRafRef.current = requestAnimationFrame(step);
  }, [paint, startAuto]);

  // Flatten any active hover interaction (tilt on the centre, lift on a side card).
  const resetTilt = useCallback(() => {
    for (const ref of [tiltedRef, liftedRef]) {
      const c = ref.current;
      if (c) {
        const inner = c.firstElementChild as HTMLElement | null;
        if (inner) inner.style.transform = "";
        ref.current = null;
      }
    }
  }, []);

  const onMouseEnter = useCallback(() => {
    hoveringRef.current = true;
    pauseAuto();
    grow(); // ramp the centre card up to the full selected size
    snapNearest(); // settle the nearest card to the centre
  }, [pauseAuto, grow, snapNearest]);

  const onMouseLeave = useCallback(() => {
    hoveringRef.current = false;
    resetTilt(); // drop the tilt back to flat
    release(); // gradual ease-in shrink, then resume drifting
  }, [release, resetTilt]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    let cancelled = false;

    const measure = () => {
      const a = cardRefs.current[0];
      const b = cardRefs.current[N];
      if (a && b) setWidthRef.current = b.offsetLeft - a.offsetLeft;
    };
    const settle = () => {
      if (cancelled) return;
      measure();
      if (!userMovedRef.current) {
        // Centre the middle card exactly (we no longer rely on native snap to
        // pull the strip onto a card).
        const c = cardRefs.current[CENTER];
        scroller.scrollLeft = c
          ? c.offsetLeft + c.offsetWidth / 2 - scroller.clientWidth / 2
          : (scroller.scrollWidth - scroller.clientWidth) / 2;
      }
      paint();
    };

    settle();
    const raf = requestAnimationFrame(settle);
    const t1 = setTimeout(settle, 120);
    const t2 = setTimeout(settle, 400);

    const imgs = Array.from(scroller.querySelectorAll("img"));
    const onImg = () => settle();
    imgs.forEach((img) => {
      if (!img.complete) img.addEventListener("load", onImg);
    });

    // True while the strip is moving (scroll/drag/glide). Hover interactions are
    // suspended during this window so the cursor doesn't "grab" cards sliding
    // underneath it — that cascade of hover transitions is what felt jittery.
    let cardsMoving = false;
    let scrollEndTimer: ReturnType<typeof setTimeout>;

    // Repaint on every scroll change (real-time wheel, drag, touch). Our own
    // settle glide and the auto-scroll loop drive paint themselves, so skip those.
    const onScroll = () => {
      cardsMoving = true;
      resetTilt(); // drop any tilt/lift the moment the strip starts moving
      clearTimeout(scrollEndTimer);
      scrollEndTimer = setTimeout(() => {
        cardsMoving = false;
      }, 120);
      if (animatingRef.current || autoActiveRef.current) return;
      wrap();
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        paint();
      });
    };

    // Wheel/trackpad: one deliberate card per swipe (two for a fast flick), eased
    // into place. The rest of the swipe — including the long momentum tail that
    // makes free-scroll models "fly" — is ignored until the gesture goes quiet.
    let gestureActive = false;
    let endTimer: ReturnType<typeof setTimeout>;
    const onWheel = (e: WheelEvent) => {
      const ax = Math.abs(e.deltaX);
      const ay = Math.abs(e.deltaY);
      if (ay >= ax) return; // vertical-dominant → let the page scroll
      if (ax < WHEEL_GATE && !gestureActive) return; // sub-pixel jitter, no active swipe
      // Horizontal swipe — or its decaying momentum tail: always consume it so the
      // tail can't leak into a native scroll (which fought scroll-snap and made the
      // cards flash).
      e.preventDefault();
      e.stopPropagation();
      userMovedRef.current = true;
      pauseAuto();
      clearTimeout(endTimer);
      endTimer = setTimeout(() => {
        gestureActive = false;
      }, GESTURE_GAP_MS);
      if (gestureActive) return; // already stepped for this swipe — swallow the tail
      gestureActive = true;
      const dir = e.deltaX > 0 ? 1 : -1;
      const n = ax >= FLICK_DELTA ? 2 : 1;
      stepCards(dir * n);
    };

    // Touch: pause + highlight while the finger's down, resume a beat after.
    const onTouchStart = () => {
      userMovedRef.current = true;
      pauseAuto();
      grow();
    };
    const onTouchEnd = () => {
      release();
    };

    // While hovering, tilt the centred (highlighted) card toward the cursor — the
    // side under the cursor presses back.
    // Coalesce mousemoves to one tilt update per animation frame. A 120Hz
    // trackpad fires mousemove far faster than Safari can re-render the 3D-tilted
    // layer, which is what made interactions feel jittery there.
    let moveX = 0;
    let moveY = 0;
    let movePending = false;
    let moveRaf: number | null = null;
    const applyTilt = () => {
      moveRaf = null;
      if (!movePending || !hoveringRef.current) return;
      movePending = false;
      if (cardsMoving) return; // strip is scrolling/gliding → no hover interactions
      // Centre card (nearest the viewport centre) — gets the 3D tilt.
      const viewCentre = scroller.scrollLeft + scroller.clientWidth / 2;
      let centre: HTMLDivElement | null = null;
      let best = Infinity;
      for (const c of cardRefs.current) {
        if (!c) continue;
        const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - viewCentre);
        if (d < best) {
          best = d;
          centre = c;
        }
      }
      if (!centre) return;
      // Card under the cursor — gets the subtle lift, unless it's the centre.
      const under = (document.elementFromPoint(moveX, moveY) as HTMLElement | null)?.closest(
        ".hero-card"
      ) as HTMLDivElement | null;
      const lift = under && under !== centre ? under : null;
      // Release whatever card is no longer the tilt / lift target.
      if (tiltedRef.current && tiltedRef.current !== centre) {
        const pi = tiltedRef.current.firstElementChild as HTMLElement | null;
        if (pi) pi.style.transform = "";
      }
      if (liftedRef.current && liftedRef.current !== lift) {
        const pi = liftedRef.current.firstElementChild as HTMLElement | null;
        if (pi) pi.style.transform = "";
      }
      // Tilt the centre toward the cursor (the side under it presses back).
      const ci = centre.firstElementChild as HTMLElement | null;
      if (ci) {
        const r = centre.getBoundingClientRect();
        const cx = Math.max(-1, Math.min(1, (moveX - (r.left + r.width / 2)) / (r.width / 2)));
        const cy = Math.max(-1, Math.min(1, (moveY - (r.top + r.height / 2)) / (r.height / 2)));
        ci.style.transform = `perspective(${TILT_PERSPECTIVE}px) rotateX(${(-cy * MAX_TILT).toFixed(2)}deg) rotateY(${(cx * MAX_TILT).toFixed(2)}deg)`;
      }
      tiltedRef.current = centre;
      // Lift the hovered side card ("about to pick it up").
      if (lift) {
        const li = lift.firstElementChild as HTMLElement | null;
        if (li) li.style.transform = "translateY(-10px) scale(1.04)";
      }
      liftedRef.current = lift;
    };
    const onMove = (e: MouseEvent) => {
      if (!hoveringRef.current) return;
      moveX = e.clientX;
      moveY = e.clientY;
      movePending = true;
      if (moveRaf == null) moveRaf = requestAnimationFrame(applyTilt);
    };

    scroller.addEventListener("scroll", onScroll, { passive: true });
    scroller.addEventListener("wheel", onWheel, { passive: false });
    scroller.addEventListener("touchstart", onTouchStart, { passive: true });
    scroller.addEventListener("touchend", onTouchEnd, { passive: true });
    scroller.addEventListener("mousemove", onMove, { passive: true });
    const onResize = () => {
      measure();
      paint();
    };
    window.addEventListener("resize", onResize);

    // Start drifting once the strip has settled (unless the cursor's already on it).
    const startupTimer = setTimeout(() => startAuto(), 700);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(endTimer);
      clearTimeout(startupTimer);
      clearTimeout(scrollEndTimer);
      imgs.forEach((img) => img.removeEventListener("load", onImg));
      scroller.removeEventListener("scroll", onScroll);
      scroller.removeEventListener("wheel", onWheel);
      scroller.removeEventListener("touchstart", onTouchStart);
      scroller.removeEventListener("touchend", onTouchEnd);
      scroller.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      if (moveRaf != null) cancelAnimationFrame(moveRaf);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      if (animRef.current != null) cancelAnimationFrame(animRef.current);
      if (autoRef.current != null) cancelAnimationFrame(autoRef.current);
      if (hoverRafRef.current != null) cancelAnimationFrame(hoverRafRef.current);
    };
  }, [paint, wrap, stepCards, pauseAuto, startAuto, grow, release, resetTilt]);

  // Click a card (without dragging) to bring it to the centre.
  const selectCard = useCallback(
    (i: number) => {
      const scroller = scrollerRef.current;
      const c = cardRefs.current[i];
      if (!scroller || !c) return;
      userMovedRef.current = true;
      easeTo(c.offsetLeft + c.offsetWidth / 2 - scroller.clientWidth / 2);
    },
    [easeTo]
  );

  // Keyboard: ←/→ glide one card at a time, reusing the same stepCards path as a
  // swipe so the motion is identical. Other keys fall through (↑/↓ still scroll the
  // page). Lets keyboard users operate the strip — the visuals are unchanged.
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      e.preventDefault();
      userMovedRef.current = true;
      pauseAuto();
      stepCards(e.key === "ArrowRight" ? 1 : -1);
    },
    [pauseAuto, stepCards]
  );

  // Mouse drag-to-scroll: connected 1:1 while dragging, then settle onto the
  // nearest card on release. A press that doesn't move past a small threshold is
  // a click (handled by the card's onClick), so we only snap on a real drag.
  const drag = useRef({ active: false, lastX: 0, startX: 0, moved: false });
  const onPointerDown = (e: React.PointerEvent) => {
    drag.current.moved = false; // reset click-vs-drag tracking for every press
    pauseAuto();
    if (e.pointerType !== "mouse") return;
    const scroller = scrollerRef.current;
    if (!scroller) return;
    if (animRef.current != null) {
      cancelAnimationFrame(animRef.current);
      animRef.current = null;
      animatingRef.current = false;
    }
    userMovedRef.current = true;
    scroller.style.scrollSnapType = "none";
    drag.current = { active: true, lastX: e.clientX, startX: e.clientX, moved: false };
    try {
      scroller.setPointerCapture(e.pointerId);
    } catch {}
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const scroller = scrollerRef.current;
    if (!drag.current.active || !scroller) return;
    const dx = e.clientX - drag.current.lastX;
    drag.current.lastX = e.clientX;
    if (Math.abs(e.clientX - drag.current.startX) > 4) drag.current.moved = true;
    scroller.scrollLeft -= dx;
  };
  const endDrag = (e: React.PointerEvent) => {
    if (!drag.current.active) return;
    drag.current.active = false;
    // Resume is driven by leaving (onMouseLeave) / lifting (onTouchEnd), not here —
    // after a mouse drag the cursor is still over the strip, so it stays focused.
    try {
      scrollerRef.current?.releasePointerCapture(e.pointerId);
    } catch {}
    if (drag.current.moved) {
      snapNearest();
      return;
    }
    // No drag movement → it was a click. Pointer capture routes the real click
    // to the scroller (not the card), so we find the card under the cursor here.
    const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
    const cardEl = el?.closest(".hero-card") as HTMLDivElement | null;
    if (cardEl) {
      const idx = cardRefs.current.indexOf(cardEl);
      if (idx >= 0) selectCard(idx);
    }
  };

  return (
    <div className="relative left-1/2 w-screen -translate-x-1/2">
      {/* Swipe hint — sits in the empty pocket above the cards on the right
          (right of the headline) to signal the strip scrolls. bottom-full keeps
          it clear of the card row so it never covers a card. */}
      <Image
        src="/media/hero/swipe-thumbprint.png"
        alt=""
        aria-hidden
        width={393}
        height={376}
        className="pointer-events-none absolute bottom-full right-[4vw] z-[110] h-auto w-40 translate-y-28 select-none sm:right-[3vw] sm:w-56 lg:w-[320px]"
        draggable={false}
      />

      <div
        ref={scrollerRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="Brands we've built — use the arrow keys to browse"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className="relative z-10 flex cursor-grab items-center gap-5 overflow-x-auto overscroll-x-contain py-10 select-none active:cursor-grabbing focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-[-6px] focus-visible:outline-[#1472F6] sm:gap-[32px] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none" }}
      >
        {loopCards.map((card, i) => {
          // Idle default = the non-selected (down-scaled) size for every card.
          const initialScale = MIN_SCALE;
          return (
            <div
              key={i}
              // Only the middle set is "real" to assistive tech; the two cloned
              // sets exist purely for the seamless loop, so hide them from AT to
              // avoid announcing the 7 cards three times over.
              aria-hidden={i < N || i >= N * 2}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              onClick={() => {
                // Touch taps fire a real click (no pointer capture); mouse clicks
                // are handled in endDrag. Guard against drags either way.
                if (!drag.current.moved) selectCard(i);
              }}
              // hero-card-intro = staggered blur-in on load (opacity + filter only,
              // so it never fights the transform paint() drives). Delay fans out
              // from the centred card so the reveal radiates outward.
              className="hero-card hero-card-intro shrink-0 origin-center cursor-pointer will-change-transform"
              style={{
                transform: `scale(${initialScale})`,
                // Base delay lets the headline land first; the cards then reveal
                // outward from the centre on a deliberate ~90ms cadence so the
                // sequence reads as intentional rather than all-at-once.
                animationDelay: `${0.4 + Math.min(Math.abs(i - CENTER), 8) * 0.09}s`,
              }}
            >
              {/* Explicit width + height (matching the 1080×985 art) so the box
                  is a fixed size in every browser — no aspect-ratio / h-auto for
                  Safari to mis-compute. This is the SELECTED size; idle cards are
                  scaled down to it from here. */}
              <div className="h-[81vw] w-[89vw] overflow-hidden rounded-lg bg-white transition-transform duration-150 ease-out [backface-visibility:hidden] sm:h-[354px] sm:w-[388px]">
                <Image
                  src={card.src}
                  alt={card.alt}
                  width={1080}
                  height={985}
                  sizes="(max-width: 640px) 90vw, 400px"
                  className="block h-full w-full object-cover select-none"
                  draggable={false}
                  priority={Math.abs(i - CENTER) <= 3}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
