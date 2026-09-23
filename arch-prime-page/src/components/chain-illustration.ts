// @ts-nocheck
/* ============================================================
   chain-illustration.ts

   FAITHFUL extraction of public/illustration/index.html (+ its three
   city-lab scripts) out of the iframe and into a single ES module so a
   React component can mount it inline.

   Build + animation logic is preserved EXACTLY. The only changes:
     - all DOM lookups are scoped to the passed `stage` element (byId)
     - parent.postMessage(...) -> opts.onSelect?.(...)
     - the public API is returned instead of attached to window
     - the iframe/standalone-only bits (.steps text, scroll->state machine,
       fit()/resize, body[data-s]) are dropped

   SSR-safe: nothing touches the DOM at import time. createIllustration()
   runs everything the original IIFE did at load time and must be called
   once (client-only) from a React useEffect.

   The three city-lab files (kit.js, buildings.js, city.js) are inlined at
   MODULE scope in load order, so their globals (P, box, cyl, build_*,
   buildFinanceCity, ...) resolve exactly as they did in the browser. The
   original IIFE re-declares its own copies of the shared helpers; those are
   kept inside createIllustration and harmlessly shadow the module-level ones
   (they are byte-identical), so build_* / buildFinanceCity use the kit.js
   versions and the IIFE uses its own — identical output either way.
   ============================================================ */

export type IllustrationApi = {
  setState: (n: number) => void; // active layer 1..4
  select: (id: string) => void; // highlight a feature/building by id
  clearSel: () => void;
  destroy: () => void; // cancel rAF + remove all listeners it added
};

/* ============================================================
   inlined: city-lab/kit.js  (shared isometric kit)
   ============================================================ */
var NS = 'http://www.w3.org/2000/svg';
var K = 13, KZ = 12, CX = Math.cos(Math.PI / 6) * K, CY = Math.sin(Math.PI / 6) * K;
var R2 = Math.SQRT2;
function P(x, y, z) { return [(x - y) * CX, (x + y) * CY - z * KZ]; }
function el(t, attrs, parent) {
  var e = document.createElementNS(NS, t);
  for (var k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e;
}
function pts(arr) { return arr.map(function (p) { return p[0].toFixed(2) + ',' + p[1].toFixed(2); }).join(' '); }

var COL = { t: '#ffffff', e: '#eae7d6', s: '#dcd8c4' };   // default building
var COLB = { t: '#f4f1de', e: '#e2decb', s: '#d3cfba' };   // substrate / ground
var COLO = { t: '#ec641d', e: '#cf5418', s: '#b84a14' };   // orange accent

/* ---- primitives (verbatim from the prototype) ---- */
function box(parent, o) {
  var c = o.c || COL, z = o.z || 0, g = el('g', o.cls ? { 'class': o.cls } : {}, parent);
  var x = o.x, y = o.y, w = o.w, d = o.d, h = o.h;
  el('polygon', { points: pts([P(x + w, y, z + h), P(x + w, y + d, z + h), P(x + w, y + d, z), P(x + w, y, z)]), fill: c.e, 'class': 'fe' }, g);
  el('polygon', { points: pts([P(x, y + d, z + h), P(x + w, y + d, z + h), P(x + w, y + d, z), P(x, y + d, z)]), fill: c.s, 'class': 'fs' }, g);
  el('polygon', { points: pts([P(x, y, z + h), P(x + w, y, z + h), P(x + w, y + d, z + h), P(x, y + d, z + h)]), fill: c.t, 'class': 'ft' }, g);
  return g;
}
function cyl(parent, o) {
  var c = o.c || COL, z = o.z || 0, g = el('g', o.cls ? { 'class': o.cls } : {}, parent);
  var rx = o.r * R2 * CX, ry = o.r * R2 * CY;
  var top = P(o.cx, o.cy, z + o.h), bot = P(o.cx, o.cy, z);
  el('path', {
    d: 'M' + (bot[0] - rx).toFixed(2) + ' ' + top[1].toFixed(2) +
      ' L' + (bot[0] - rx).toFixed(2) + ' ' + bot[1].toFixed(2) +
      ' A' + rx.toFixed(2) + ' ' + ry.toFixed(2) + ' 0 0 0 ' + (bot[0] + rx).toFixed(2) + ' ' + bot[1].toFixed(2) +
      ' L' + (bot[0] + rx).toFixed(2) + ' ' + top[1].toFixed(2) + ' Z',
    fill: c.e, 'class': 'fe cylbody'
  }, g);
  el('ellipse', { cx: top[0], cy: top[1], rx: rx, ry: ry, fill: c.t, 'class': 'ft' }, g);
  return g;
}
/* ---- extra helpers for richer architecture ---- */
function tri(parent, a, b, c, fill, cls) {
  return el('polygon', { points: pts([P.apply(null, a), P.apply(null, b), P.apply(null, c)]), fill: fill, 'class': cls }, parent);
}
function quad(parent, a, b, c, d, fill, cls) {
  return el('polygon', { points: pts([P.apply(null, a), P.apply(null, b), P.apply(null, c), P.apply(null, d)]), fill: fill, 'class': cls }, parent);
}
function label(parent, x, y, z, txt, anchor) {
  var p = P(x, y, z);
  var t = el('text', { x: p[0], y: p[1], 'class': 'isolabel', 'text-anchor': anchor || 'middle' }, parent);
  t.textContent = txt; return t;
}
/* project flat px-space SVG markup onto an iso top face (verbatim from prototype) */
function onTop(parent, x, y, z, wUnits, viewW, markup) {
  var t = wUnits / viewW, o = P(x, y, z);
  var g = el('g', { transform: 'matrix(' + (t * CX).toFixed(3) + ',' + (t * CY).toFixed(3) + ',' + (-t * CX).toFixed(3) + ',' + (t * CY).toFixed(3) + ',' + o[0].toFixed(2) + ',' + o[1].toFixed(2) + ')' }, parent);
  g.innerHTML = markup; return g;
}
/* a true circle of grid-radius r, foreshortened onto the east(+x) face */
function faceCircleX(parent, xF, yc, zc, r, fill, cls) {
  var o = P(xF, yc, zc);
  var g = el('g', { transform: 'matrix(' + (-CX).toFixed(3) + ',' + CY.toFixed(3) + ',0,' + (-KZ).toFixed(3) + ',' + o[0].toFixed(2) + ',' + o[1].toFixed(2) + ')' }, parent);
  var a = { cx: 0, cy: 0, r: r, fill: fill, stroke: 'rgba(24,24,24,.22)', 'stroke-width': 0.8, 'vector-effect': 'non-scaling-stroke' };
  if (cls) a['class'] = cls;
  el('circle', a, g); return g;
}
/* a <g> whose local coords (u,v) map to grid offsets (Δy, Δz) on the east(+x) face */
function faceGroupX(parent, xF, yc, zc) {
  var o = P(xF, yc, zc);
  return el('g', { transform: 'matrix(' + (-CX).toFixed(3) + ',' + CY.toFixed(3) + ',0,' + (-KZ).toFixed(3) + ',' + o[0].toFixed(2) + ',' + o[1].toFixed(2) + ')' }, parent);
}
/* a clock / medallion with real depth on the east(+x) face */
function faceClockX(parent, xF, yc, zc, r, depth, faceFill) {
  faceCircleX(parent, xF, yc, zc, r + 0.06, COL.s);   // rim ring, flush on the wall
  faceCircleX(parent, xF + depth * 0.5, yc, zc, r + 0.02, COL.e);   // bezel, half-proud
  faceCircleX(parent, xF + depth, yc, zc, r, faceFill); // raised face (the accent)
  return parent;
}
/* a solid cylindrical DRUM protruding from the east(+x) face */
function faceDrumX(parent, xWall, yc, zc, r, depth, c) {
  c = c || COLO; var N = 12, i, x, o, g;
  for (i = 0; i < N; i++) {                       // body: stacked discs (no stroke) = the shaded side
    x = xWall + depth * i / N; o = P(x, yc, zc);
    g = el('g', { transform: 'matrix(' + (-CX).toFixed(3) + ',' + CY.toFixed(3) + ',0,' + (-KZ).toFixed(3) + ',' + o[0].toFixed(2) + ',' + o[1].toFixed(2) + ')' }, parent);
    el('circle', { cx: 0, cy: 0, r: r, fill: c.e, stroke: (i ? 'none' : 'rgba(24,24,24,.22)'), 'stroke-width': 0.8, 'vector-effect': 'non-scaling-stroke' }, g);
  }
  faceCircleX(parent, xWall + depth, yc, zc, r, c.t);  // lit front face (with outline)
  return parent;
}

/* ---- mount one building, centred, with a ground tile + hover-highlight ----
   (kit.js helper; unused on the iso-scroll path but inlined for faithfulness) */
function mountBuilding(buildFn, opts) {
  opts = opts || {};
  var svg = document.getElementById('iso');
  var vb = opts.viewBox ? opts.viewBox.split(/\s+/).map(Number) : null;
  if (opts.viewBox) svg.setAttribute('viewBox', opts.viewBox);
  function fit() {
    if (!vb) return;
    var s = Math.min(window.innerWidth * 0.94 / vb[2], window.innerHeight * 0.9 / vb[3]);
    svg.setAttribute('width', Math.round(vb[2] * s));
    svg.setAttribute('height', Math.round(vb[3] * s));
  }
  fit(); window.addEventListener('resize', fit);
  var world = el('g', {}, svg);
  if (opts.ground !== false) box(world, opts.ground || { x: -0.9, y: -0.9, w: 6.4, d: 5.2, h: 0.3, z: -0.3, c: COLB });
  var comp = buildFn(world, 0, 0, 0);
  if (comp && comp.classList) {
    comp.addEventListener('mouseenter', function () { comp.classList.add('sel'); });
    comp.addEventListener('mouseleave', function () { comp.classList.remove('sel'); });
  }
  return comp;
}

/* ============================================================
   inlined: city-lab/buildings.js  (the 7 hero finance-city buildings)
   ============================================================ */
function build_prime(parent, ox, oy, bz) {
  var g = el('g', { 'class': 'comp', id: 'comp-prime' }, parent);
  function B(o) { o.x += ox; o.y += oy; o.z = (o.z || 0) + bz; box(g, o); }

  var REC = { t: '#d8d4c0', e: '#cbc6b0', s: '#bdb8a2' };   // recessed-window cream

  // 1. broad plinth
  B({ x: 0.3, y: 0.3, w: 3.8, d: 3.8, h: 0.35, z: 0 });

  // 2. tier 1 — tall base mass (east wall x=3.95, south wall y=3.95)
  B({ x: 0.45, y: 0.45, w: 3.5, d: 3.5, h: 3.0, z: 0.35 });
  B({ x: 3.93, y: 0.85, w: 0.04, d: 2.7, h: 2.4, z: 0.65, c: REC });   // east window panel
  B({ x: 0.85, y: 3.93, w: 2.7, d: 0.04, h: 2.4, z: 0.65, c: REC });   // south window panel

  // 3. tier 2 — first setback (east x=3.65, south y=3.65)
  B({ x: 0.75, y: 0.75, w: 2.9, d: 2.9, h: 2.6, z: 3.35 });
  B({ x: 3.63, y: 1.1, w: 0.04, d: 2.2, h: 2.0, z: 3.65, c: REC });
  B({ x: 1.1, y: 3.63, w: 2.2, d: 0.04, h: 2.0, z: 3.65, c: REC });

  // 4. tier 3 — second setback (east x=3.3, south y=3.3)
  B({ x: 1.1, y: 1.1, w: 2.2, d: 2.2, h: 2.2, z: 5.95 });
  B({ x: 3.28, y: 1.4, w: 0.04, d: 1.6, h: 1.6, z: 6.2, c: REC });
  B({ x: 1.4, y: 3.28, w: 1.6, d: 0.04, h: 1.6, z: 6.2, c: REC });

  // 5. tier 4 — third setback
  B({ x: 1.45, y: 1.45, w: 1.5, d: 1.5, h: 1.6, z: 8.15 });

  // 6. crown — cream cap
  B({ x: 1.7, y: 1.7, w: 1.0, d: 1.0, h: 0.6, z: 9.75 });

  // 7. ACCENT — orange beacon on the crown (highest + nearest)
  B({ x: 1.95, y: 1.95, w: 0.5, d: 0.5, h: 0.55, z: 10.35, c: COLO });

  // 8. thin cream mast above the beacon
  B({ x: 2.13, y: 2.13, w: 0.14, d: 0.14, h: 1.3, z: 10.9 });
  return g;
}

function build_dexs(parent, ox, oy, bz) {
  var g = el('g', { 'class': 'comp', id: 'comp-dexs' }, parent);
  function B(o) { o.x += ox; o.y += oy; o.z = (o.z || 0) + bz; box(g, o); }
  function C(o) { o.cx += ox; o.cy += oy; o.z = (o.z || 0) + bz; cyl(g, o); }
  function pt(x, y, z) { return [x + ox, y + oy, z + bz]; }
  var zf = 0.66, DARK = { t: '#d8d4c0', e: '#cbc6b0', s: '#bdb8a2' };

  // 1. crepidoma — three grand steps
  B({ x: 0, y: 0, w: 4.6, d: 3.4, h: 0.22 });
  B({ x: 0.28, y: 0.28, w: 4.04, d: 2.84, h: 0.22, z: 0.22 });
  B({ x: 0.56, y: 0.56, w: 3.48, d: 2.28, h: 0.22, z: 0.44 });

  // 2. cella — solid block behind the colonnade
  B({ x: 0.8, y: 0.7, w: 2.5, d: 2.0, h: 2.0, z: zf });

  // 3. recessed doorway (dark, centred — not the accent)
  B({ x: 3.22, y: 1.5, w: 0.1, d: 0.6, h: 1.3, z: zf, c: DARK });

  // 4. grand colonnade — 6 columns across the east front
  [0.78, 1.16, 1.54, 1.92, 2.30, 2.68].forEach(function (cy) { C({ cx: 3.6, cy: cy, r: 0.17, h: 2.0, z: zf }); });

  // 5. flat entablature — broad, moderate cornice overhang
  B({ x: 0.62, y: 0.6, w: 3.45, d: 2.65, h: 0.4, z: 2.66 });

  // 6. low wide pediment over the colonnade (east gable)
  var rxF = 4.07, rxB = 3.25, ym = 1.92, eY0 = 0.6, eY1 = 3.25, eZ = 3.06, rZ = 3.78;
  quad(g, pt(rxB, eY0, eZ), pt(rxF, eY0, eZ), pt(rxF, ym, rZ), pt(rxB, ym, rZ), COL.e, 'ft'); // back slope (far)
  quad(g, pt(rxB, eY1, eZ), pt(rxF, eY1, eZ), pt(rxF, ym, rZ), pt(rxB, ym, rZ), COL.t, 'ft'); // front slope (near)
  tri(g, pt(rxF, eY0, eZ), pt(rxF, eY1, eZ), pt(rxF, ym, rZ), COL.e, 'fe'); // gable face

  // 7. clock — a small orange drum tucked into the pediment tympanum (subtle 3D)
  faceDrumX(g, rxF, ym, eZ + 0.30, 0.17, 0.12, COLO);
  return g;
}

function build_lend(parent, ox, oy, bz) {
  var g = el('g', { 'class': 'comp', id: 'comp-lend' }, parent);
  function B(o) { o.x += ox; o.y += oy; o.z = (o.z || 0) + bz; box(g, o); }
  function C(o) { o.cx += ox; o.cy += oy; o.z = (o.z || 0) + bz; cyl(g, o); }
  function pt(x, y, z) { return [x + ox, y + oy, z + bz]; }

  var GLASS = { t: '#bcc2c0', e: '#aab0ae', s: '#9aa09e' };   // darker curtain-wall glass
  var MULL = { t: '#d8d4c0', e: '#cbc6b0', s: '#bdb8a2' };   // muted mullion / soffit cream

  // ---- footprint: main block occupies x[0.55..4.05], y[0.5..3.4] ----

  // 1. low plinth — slightly WIDER than the block above
  B({ x: 0.35, y: 0.3, w: 3.9, d: 3.3, h: 0.28, z: 0 });                       // plinth slab
  // recessed glass lobby band, inset under the block
  B({ x: 0.5, y: 0.42, w: 3.6, d: 3.06, h: 0.62, z: 0.28, c: GLASS });           // dark lobby volume
  // thin cream lobby mullions (slender piers) breaking the east + south glass
  B({ x: 4.07, y: 0.7, w: 0.05, d: 0.1, h: 0.62, z: 0.28, c: MULL });
  B({ x: 4.07, y: 1.5, w: 0.05, d: 0.1, h: 0.62, z: 0.28, c: MULL });
  B({ x: 4.07, y: 2.3, w: 0.05, d: 0.1, h: 0.62, z: 0.28, c: MULL });
  B({ x: 1.2, y: 3.45, w: 0.1, d: 0.05, h: 0.62, z: 0.28, c: MULL });
  B({ x: 2.0, y: 3.45, w: 0.1, d: 0.05, h: 0.62, z: 0.28, c: MULL });
  B({ x: 2.8, y: 3.45, w: 0.1, d: 0.05, h: 0.62, z: 0.28, c: MULL });

  // 2. MAIN BLOCK — the 2-storey glass mass sitting on the lobby (east x=4.05, south y=3.4)
  B({ x: 0.55, y: 0.5, w: 3.5, d: 2.9, h: 2.0, z: 0.9 });                          // solid cream core

  //    floor-1 recessed window band (east + south)
  B({ x: 4.03, y: 0.85, w: 0.04, d: 2.2, h: 0.66, z: 1.2, c: GLASS });             // east band, floor 1
  B({ x: 0.9, y: 3.38, w: 2.65, d: 0.04, h: 0.66, z: 1.2, c: GLASS });            // south band, floor 1
  //    floor-2 recessed window band (east + south)
  B({ x: 4.03, y: 0.85, w: 0.04, d: 2.2, h: 0.66, z: 2.04, c: GLASS });           // east band, floor 2
  B({ x: 0.9, y: 3.38, w: 2.65, d: 0.04, h: 0.66, z: 2.04, c: GLASS });          // south band, floor 2

  //    slim cream parapet/cornice capping the main block top
  B({ x: 0.55, y: 0.5, w: 3.5, d: 2.9, h: 0.14, z: 2.9, c: MULL });

  // 3. CANTILEVERED UPPER FLOOR
  B({ x: 0.9, y: 0.85, w: 3.3, d: 2.7, h: 1.5, z: 3.04 });                        // upper mass
  //    upper-floor continuous glass band (east + south), the signature ribbon
  B({ x: 4.18, y: 1.15, w: 0.04, d: 2.1, h: 0.9, z: 3.34, c: GLASS });            // east ribbon
  B({ x: 1.2, y: 3.53, w: 2.6, d: 0.04, h: 0.9, z: 3.34, c: GLASS });           // south ribbon
  //    slim parapet on the upper roof
  B({ x: 0.9, y: 0.85, w: 3.3, d: 2.7, h: 0.16, z: 4.54, c: MULL });

  // 4. flat roof — small rooftop mechanical box
  B({ x: 1.3, y: 1.25, w: 1.1, d: 1.0, h: 0.5, z: 4.7, c: MULL });

  // 5. ACCENT (the one orange) — a clean ENTRANCE PORTAL at the lobby centre on the east front
  B({ x: 4.04, y: 1.55, w: 0.2, d: 0.8, h: 0.86, z: 0.28, c: COLO });   // orange entrance portal
  B({ x: 4.02, y: 1.45, w: 0.26, d: 1.0, h: 0.1, z: 1.14, c: MULL });   // slim entrance canopy
  return g;
}

function build_vaults(parent, ox, oy, bz) {
  var g = el('g', { 'class': 'comp', id: 'comp-vaults' }, parent);
  function B(o) { o.x += ox; o.y += oy; o.z = (o.z || 0) + bz; box(g, o); }
  function FC(xF, yc, zc, r, fill) { return faceCircleX(g, xF + ox, yc + oy, zc + bz, r, fill); }
  function FG(xF, yc, zc) { return faceGroupX(g, xF + ox, yc + oy, zc + bz); }
  function FD(xF, yc, zc, r, depth, c) { return faceDrumX(g, xF + ox, yc + oy, zc + bz, r, depth, c); }

  var STONE = { t: '#d8d4c0', e: '#cbc6b0', s: '#bdb8a2' };   // heavy fortress stone
  var BOLT = '#8f8b78';                                    // dark steel bolts
  var STEEL = '#c4bfa8';                                    // door steel ring

  // 1. thick plinth (far, low base)
  B({ x: 0.3, y: 0.3, w: 4.0, d: 3.4, h: 0.45 });
  // 2. main block — heavy solid cube (east wall x=4.0, top z3.05)
  B({ x: 0.6, y: 0.6, w: 3.4, d: 2.8, h: 2.6, z: 0.45, c: STONE });
  // 3. stepped threshold jutting east in front of the door
  B({ x: 4.0, y: 1.15, w: 0.6, d: 1.7, h: 0.12, z: 0.45 });
  B({ x: 4.0, y: 1.3, w: 0.48, d: 1.4, h: 0.26, z: 0.45, c: STONE });

  // 4. VAULT DOOR on the east face (xF=4.0), centred yc=2.0 zc=1.6
  var xF = 4.0, yc = 2.0, zc = 1.6;
  FC(xF, yc, zc, 1.02, STONE.s);   // door surround (recessed jamb, tan)
  FC(xF, yc, zc, 0.92, STEEL);     // outer steel door slab
  // -- ring of bolts around the rim --
  (function () {
    var fg = FG(xF, yc, zc), n = 12, k, a;
    for (k = 0; k < n; k++) {
      a = k / n * 2 * Math.PI;
      el('circle', { cx: (0.8 * Math.cos(a)).toFixed(3), cy: (0.8 * Math.sin(a)).toFixed(3), r: 0.07, fill: BOLT }, fg);
    }
  })();
  FC(xF, yc, zc, 0.6, COL.t);     // bright inner door face
  FC(xF, yc, zc, 0.46, STEEL);     // inner steel recess

  // -- spoked handwheel (the orange focal mechanism) --
  FC(xF, yc, zc, 0.36, COLO.t);    // wheel rim disc (orange)
  FC(xF, yc, zc, 0.27, COL.t);     // cut centre -> leaves an orange rim ring
  (function () {
    var fg = FG(xF, yc, zc), n = 5, k, a;
    for (k = 0; k < n; k++) {
      a = k / n * 2 * Math.PI - Math.PI / 2;
      el('line', {
        x1: (0.07 * Math.cos(a)).toFixed(3), y1: (0.07 * Math.sin(a)).toFixed(3),
        x2: (0.32 * Math.cos(a)).toFixed(3), y2: (0.32 * Math.sin(a)).toFixed(3),
        stroke: '#cf5418', 'stroke-width': 2.6, 'vector-effect': 'non-scaling-stroke', 'stroke-linecap': 'round'
      }, fg);
    }
  })();
  FD(xF, yc, zc, 0.1, 0.16, COLO); // protruding orange hub (the 3D bit)

  // -- combination dial below the wheel --
  FC(xF, yc, zc - 0.62, 0.13, STEEL);
  FD(xF, yc, zc - 0.62, 0.055, 0.1, COLO);
  return g;
}

function build_stables(parent, ox, oy, bz) {
  var g = el('g', { 'class': 'comp', id: 'comp-stables' }, parent);
  function B(o) { o.x += ox; o.y += oy; o.z = (o.z || 0) + bz; box(g, o); }
  function C(o) { o.cx += ox; o.cy += oy; o.z = (o.z || 0) + bz; cyl(g, o); }
  function pt(x, y, z) { return [x + ox, y + oy, z + bz]; }

  var STONE = { t: '#ece8d2', e: '#ddd9c2', s: '#cdc9b2' }; // institutional stone
  var REC = { t: '#d3cfba', e: '#c6c1ab', s: '#b8b399' }; // recessed windows
  var DARK = { t: '#b3ae9a', e: '#a39e8a', s: '#94907c' }; // chimney shaft / cap

  // 1. two broad steps
  B({ x: 0, y: 0, w: 4.4, d: 3.0, h: 0.25 });
  B({ x: 0.3, y: 0.3, w: 3.8, d: 2.4, h: 0.25, z: 0.25 });
  var zf = 0.5;

  // 2. SMOKESTACK — tall slim round stack at the back-left, on the roof line.
  C({ cx: 1.15, cy: 0.95, r: 0.26, h: 3.3, z: zf, c: DARK });      // stack shaft
  C({ cx: 1.15, cy: 0.95, r: 0.30, h: 0.2, z: zf + 3.3, c: STONE }); // stack cap

  // 3. main mint block — solid, symmetric, institutional (east x=3.8, south y=2.55)
  B({ x: 0.6, y: 0.55, w: 3.2, d: 2.0, h: 2.0, z: zf, c: STONE });

  //    recessed window bands — two rows each on east(+x) + south(+y), tall windows
  B({ x: 3.78, y: 0.95, w: 0.04, d: 1.45, h: 0.55, z: zf + 0.35, c: REC }); // east, lower
  B({ x: 3.78, y: 0.95, w: 0.04, d: 1.45, h: 0.55, z: zf + 1.15, c: REC }); // east, upper
  B({ x: 0.95, y: 2.53, w: 2.1, d: 0.04, h: 0.55, z: zf + 0.35, c: REC }); // south, lower
  B({ x: 0.95, y: 2.53, w: 2.1, d: 0.04, h: 0.55, z: zf + 1.15, c: REC }); // south, upper

  //    slim stone cornice/parapet capping the block
  B({ x: 0.55, y: 0.5, w: 3.3, d: 2.1, h: 0.16, z: 2.5, c: STONE });

  // 4. coin stacks flanking the front (forward of the block, painted late)
  [[3.95, 0.9], [3.95, 2.2]].forEach(function (p) {
    for (var i = 0; i < 3; i++) C({ cx: p[0], cy: p[1], r: 0.3, h: 0.16, z: zf + i * 0.16 });
  });

  // 5. a big coin lying proud on the roof centre — beige to match the buildings (was orange)
  C({ cx: 2.35, cy: 1.5, r: 0.52, h: 0.17, z: 2.66, c: STONE });
  return g;
}

function build_rwas(parent, ox, oy, bz) {
  var g = el('g', { 'class': 'comp', id: 'comp-rwas' }, parent);
  function B(o) { o.x += ox; o.y += oy; o.z = (o.z || 0) + bz; box(g, o); }
  function C(o) { o.cx += ox; o.cy += oy; o.z = (o.z || 0) + bz; cyl(g, o); }
  function pt(x, y, z) { return [x + ox, y + oy, z + bz]; }

  var glass = { t: '#aeb4b2', e: '#9ea4a2', s: '#8f9593' }; // dark north-light glazing

  // 1. base slab (far back, smallest x+y) — append first
  B({ x: 0.2, y: 0.2, w: 4.4, d: 3.0, h: 0.3, z: 0 });

  // 2. warehouse body — solid broad block, top at z1.8
  B({ x: 0.5, y: 0.5, w: 3.8, d: 2.4, h: 1.5, z: 0.3 });

  // 3. orange roll-up loading-bay door — the accent, on the east (front) wall
  B({ x: 4.22, y: 1.25, w: 0.14, d: 1.0, h: 1.15, z: 0.3, c: COLO });

  // 4. SAWTOOTH ROOF — 4 teeth marching along +x, each spanning full y-depth.
  var tw = 0.95, y0 = 0.5, y1 = 2.9, zV = 1.8, zC = 2.5;
  [0.5, 1.45, 2.4, 3.35].forEach(function (xi) {
    // riser: glazed north-light, east(+x)-facing, from valley up to crest
    quad(g, pt(xi, y0, zV), pt(xi, y1, zV), pt(xi, y1, zC), pt(xi, y0, zC), glass.e, 'fe');
    // slope: crest down to next valley, up-facing
    quad(g, pt(xi, y0, zC), pt(xi, y1, zC), pt(xi + tw, y1, zV), pt(xi + tw, y0, zV), COL.t, 'ft');
    // south end-cap: the triangular tooth profile on the +y side
    tri(g, pt(xi, y1, zV), pt(xi, y1, zC), pt(xi + tw, y1, zV), COL.s, 'fs');
  });

  return g;
}

function build_looping(parent, ox, oy, bz) {
  var g = el('g', { 'class': 'comp', id: 'comp-looping' }, parent);
  function pt(x, y, z) { return [x + ox, y + oy, z + bz]; }

  // ---- 0. ground pad — low cream base (painted first, well behind everything)
  box(g, { x: 0.35 + ox, y: 0.25 + oy, w: 3.4, d: 3.5, h: 0.2, z: 0 + bz });

  // ---- helix parameters
  var cx = 2.0, cy = 1.8;        // centre of the loop
  var R = 1.35, wd = 0.5;        // centreline radius, ramp width
  var ri = R - wd / 2, ro = R + wd / 2;  // inner / outer edge radii
  var N = 30;                  // segments
  var turns = 1.15;            // ~1 to 1.25 turns
  var t0 = Math.PI * 0.5;        // start angle: near-front, by the on-ramp
  var z0 = 0.2, z1 = 1.8;        // climb from ground to top
  var skirt = 0.3;             // fascia drop
  var TWO = Math.PI * 2;

  // angle/height/edge points at parameter u in [0..1]
  function ring(u) {
    var t = t0 + u * turns * TWO;
    var z = z0 + (z1 - z0) * u;
    return {
      t: t, z: z,
      ix: cx + ri * Math.cos(t), iy: cy + ri * Math.sin(t),   // inner edge
      ox: cx + ro * Math.cos(t), oy: cy + ro * Math.sin(t)    // outer edge
    };
  }

  var ringPts = [];
  for (var i = 0; i <= N; i++) ringPts.push(ring(i / N));

  var pieces = [];
  function addBox(o, dx, dy) { pieces.push({ k: 'box', o: o, depth: dx + dy }); }
  function addCyl(o, dx, dy) { pieces.push({ k: 'cyl', o: o, depth: dx + dy }); }

  // ---- 1. support PIERS — cream columns from z=0 to just under the ramp.
  var pierU = [0.28, 0.46, 0.64, 0.82, 1.0];
  pierU.forEach(function (u) {
    var r = ring(u);
    var topZ = r.z - skirt - 0.02;                 // reach the underside of the fascia
    if (topZ < 0.25) return;                    // skip where ramp is near the ground
    // square cream column under the outer edge
    var s = 0.22, px = r.ox - s / 2, py = r.oy - s / 2;
    addBox({ x: px + ox, y: py + oy, w: s, d: s, h: topZ, z: 0 + bz }, r.ox, r.oy);
  });
  // the TALLEST pier sits right under the high end (u=1)
  var hi = ring(1.0);
  addBox({ x: hi.ox - 0.14 + ox, y: hi.oy - 0.14 + oy, w: 0.28, d: 0.28, h: hi.z - skirt - 0.02, z: 0 + bz }, hi.ox, hi.oy);

  // ---- 2. ON-RAMP — a short cream-edged orange deck meeting the ground pad
  var start = ringPts[0];
  var anq = 0.30;  // how far the on-ramp reaches out from the start (stay on pad)
  var dirx = Math.cos(start.t), diry = Math.sin(start.t);
  var aInX = cx + ri * Math.cos(start.t) + dirx * anq, aInY = cy + ri * Math.sin(start.t) + diry * anq;
  var aOutX = cx + ro * Math.cos(start.t) + dirx * anq, aOutY = cy + ro * Math.sin(start.t) + diry * anq;
  // on-ramp ring point, anchored at pad height
  var ramp0 = { ix: aInX, iy: aInY, ox: aOutX, oy: aOutY, z: 0.2 };
  // expand on-ramp as a seg from ramp0(ground) -> start(first ring)
  pushSeg(ramp0, start);

  // ---- 3. DECK SEGMENTS — orange top + cream skirt + cream underside.
  for (i = 0; i < N; i++) pushSeg(ringPts[i], ringPts[i + 1]);

  function pushSeg(a, b) {
    var mx = (a.ix + a.ox + b.ix + b.ox) / 4;
    var my = (a.iy + a.oy + b.iy + b.oy) / 4;
    pieces.push({ k: 'seg', a: a, b: b, depth: mx + my });
  }

  // ---- APPEND back-to-front. Painter's algorithm on midpoint depth ascending.
  pieces.sort(function (p, q) { return p.depth - q.depth; });

  pieces.forEach(function (p) {
    if (p.k === 'box') { box(g, p.o); return; }
    if (p.k === 'cyl') { cyl(g, p.o); return; }
    // seg: cream underside, cream outer skirt, then orange top (top paints last)
    var a = p.a, b = p.b;
    // underside (cream) — the soffit, at the skirt-bottom plane
    quad(g, pt(a.ix, a.iy, a.z - skirt), pt(a.ox, a.oy, a.z - skirt),
      pt(b.ox, b.oy, b.z - skirt), pt(b.ix, b.iy, b.z - skirt), COL.s, 'fs');
    // outer skirt / fascia (cream) — drop in z along the outer edge
    quad(g, pt(a.ox, a.oy, a.z), pt(b.ox, b.oy, b.z),
      pt(b.ox, b.oy, b.z - skirt), pt(a.ox, a.oy, a.z - skirt), COL.e, 'fe');
    // orange ramp TOP surface — the single accent, painted on top
    quad(g, pt(a.ix, a.iy, a.z), pt(a.ox, a.oy, a.z),
      pt(b.ox, b.oy, b.z), pt(b.ix, b.iy, b.z), COLO.t, 'ft');
  });

  return g;
}

// ═════════════════════════ CITY PLACEMENT LEVERS ═════════════════════════
// Slide any building across the plate by bumping its dx / dy below — no need to
// touch the add() calls or the grid coords. On the isometric grid:
//   +dx → moves it toward the RIGHT of the plate  (east; down-right on screen)
//   +dy → moves it toward the FRONT of the plate  (south; down-left  on screen)
//   negatives go the other way. ~0.5 = a nudge · ~2 = a clear move · whole units = big.
// CITY.dx / CITY.dy shift the WHOLE district (every building + tree) at once.
// Module-scoped so the L4 hover dots (CALLOUTS, in createIllustration) can read the SAME
// offsets and stay locked to each building. Feeds the hero AND the builders-CTA / footer city.
var CITY = { dx: 2.05, dy: 0.1 };            // ← global offset for the entire city
var LV = {
  // ── 7 landmark buildings ──
  lend:    { dx: 0, dy: 0.7 },
  dexs:    { dx: 0, dy: -0.9 },
  prime:   { dx: -0.5, dy: -0.1 },
  vaults:  { dx: -0.4, dy: 0 },
  stables: { dx: 0, dy: 0 },
  looping: { dx: 2.5, dy: 0 },
  rwas:    { dx: 0, dy: 0 },
  // ── 10 skyline filler buildings ──
  backLeftTower:  { dx: -0.2, dy: 1.5 },
  tallByPrime:    { dx: 1.2, dy: 0 },
  backRightTower: { dx: 0.3, dy: 0 },
  rightTower:     { dx: 1, dy: 0 },
  midBlock:       { dx: 1.2, dy: 0 },
  frontMidBlock:  { dx: 0, dy: 0 },
  frontRight:     { dx: 0, dy: 0 },
  shed:           { dx: 1.2, dy: -0.2 },
  frontBlockL:    { dx: 0, dy: 0 },
  frontBlockR:    { dx: 0, dy: 0 },
};
// ══════════════════════════════════════════════════════════════════════════

/* ============================================================
   inlined: city-lab/city.js  (the district assembly)
   ============================================================ */
function buildFinanceCity(parent, baseZ) {
  var SL = { x: 3, y: 2, w: 28, d: 20 };
  var Z = baseZ;
  var ROAD = { t: '#e7e2cb', e: '#e7e2cb', s: '#e7e2cb' },
    FILL1 = { t: '#e9e5d0', e: '#dad6bf', s: '#cbc7af' }, FILL2 = { t: '#ded9c5', e: '#cfcab4', s: '#c0bba4' },
    GREYB = { t: '#d9d8ca', e: '#cac9ba', s: '#bbb9ab' }, WINc = { t: '#cbc6ad', e: '#beb99f', s: '#b0ab90' },
    TREEc = { t: '#93a06a', e: '#808d5a', s: '#6f7c4b' }, TRUNKc = { t: '#b39a76', e: '#a48b68', s: '#957c5a' };

  // streets
  box(parent, { x: SL.x, y: 9.2, w: SL.w, d: 0.9, h: 0.04, z: Z, c: ROAD });
  box(parent, { x: 16.4, y: SL.y, w: 0.9, d: SL.d, h: 0.04, z: Z, c: ROAD });

  // DASHED orange value-network (segments every 0.5 grid units), node at each building.
  // dash() + nd() fold in CITY.dx/dy so the WHOLE network rides the global city offset and stays
  // aligned with the buildings; each tp() node adds its building's LV so it tracks that building.
  function dash(x, y, w, d) { box(parent, { x: x + CITY.dx, y: y + CITY.dy, w: w, d: d, h: 0.05, z: Z, c: COLO }); }
  function hl(x1, x2, y) { var a = Math.min(x1, x2), b = Math.max(x1, x2), x; for (x = a; x < b - 0.05; x += 0.5) { dash(x, y - 0.05, Math.min(0.32, b - x), 0.1); } }
  function vl(y1, y2, x) { var a = Math.min(y1, y2), b = Math.max(y1, y2), y; for (y = a; y < b - 0.05; y += 0.5) { dash(x - 0.05, y, 0.1, Math.min(0.32, b - y)); } }
  function nd(x, y) { box(parent, { x: x - 0.17 + CITY.dx, y: y - 0.17 + CITY.dy, w: 0.34, d: 0.34, h: 0.07, z: Z, c: COLO }); }
  function tp(x, y, s) { vl(s, y, x); nd(x, y); }
  var BST = 8.5, FST = 15.0;
  // central connector: raw 13.85 renders (with CITY.dx) at ~15.9 — nudged a touch toward the road (rendered x 16.4)
  hl(6.8, 23.0, BST); hl(5.4, 22.2, FST); vl(BST, FST, 13.85);
  tp(7.56 + LV.lend.dx, 7.06 + LV.lend.dy, BST); tp(13.21 + LV.prime.dx, 8.26 + LV.prime.dy, BST); tp(22.37 + LV.stables.dx, 7.05 + LV.stables.dy, BST);
  tp(5.96 + LV.dexs.dx, 14.89 + LV.dexs.dy, FST); tp(12.0 + LV.vaults.dx, 14.18 + LV.vaults.dy, FST); tp(21.54 + LV.rwas.dx, 14.22 + LV.rwas.dy, FST); tp(15.14 + LV.looping.dx, 15.3 + LV.looping.dy, FST);

  // placement (transform translate+scale == grid-place a k-scaled building)
  function place(fn, gx, gy, k) {
    var t = P(gx, gy, Z);
    var w = el('g', { transform: 'translate(' + t[0].toFixed(2) + ',' + t[1].toFixed(2) + ') scale(' + k + ')' }, parent); fn(w, 0, 0, 0);
    var cmp = w.querySelector('.comp'); w.setAttribute('data-cb', cmp ? cmp.id : 'bg'); w.style.transition = 'opacity .18s ease';
  }
  function fbox(p, w, d, h, c, win) {
    box(p, { x: 0, y: 0, w: w, d: d, h: h, z: 0, c: c });
    if (win) { for (var z = 0.35; z + 0.4 < h; z += 0.62) { box(p, { x: w - 0.02, y: 0.25, w: 0.04, d: d - 0.5, h: 0.32, z: z, c: WINc }); box(p, { x: 0.25, y: d - 0.02, w: w - 0.5, d: 0.04, h: 0.32, z: z, c: WINc }); } }
  }
  function tree(p) {
    box(p, { x: 0.32, y: 0.32, w: 0.16, d: 0.16, h: 0.36, z: 0, c: TRUNKc });
    cyl(p, { cx: 0.4, cy: 0.4, r: 0.5, h: 0.4, z: 0.3, c: TREEc }); cyl(p, { cx: 0.4, cy: 0.4, r: 0.34, h: 0.4, z: 0.62, c: TREEc }); cyl(p, { cx: 0.4, cy: 0.4, r: 0.18, h: 0.36, z: 0.92, c: TREEc });
  }

  // CITY placement levers (CITY + LV) now live at module scope, just above this function,
  // so the L4 hover dots can read the same offsets. Edit them there.

  // add() folds in the global CITY offset + this building's per-building lever.
  var objs = []; function add(gx, gy, k, fn, lv) { lv = lv || { dx: 0, dy: 0 }; objs.push([gx + CITY.dx + lv.dx, gy + CITY.dy + lv.dy, k, fn]); }
  // HERO buildings
  add(5.5, 4.0, 0.85, build_lend, LV.lend); add(4.0, 12.0, 0.85, build_dexs, LV.dexs); add(12.0, 6.0, 0.48, build_prime, LV.prime);
  add(10.0, 11.0, 0.86, build_vaults, LV.vaults); add(20.5, 4.5, 0.85, build_stables, LV.stables); add(13.5, 15.5, 0.80, build_looping, LV.looping);
  add(19.5, 11.5, 0.85, build_rwas, LV.rwas);
  // FILLER buildings — varied heights for skyline rhythm
  add(2.6, 4.8, 0.85, function (p) { fbox(p, 2.0, 1.9, 4.6, FILL1, 1); }, LV.backLeftTower);   // back-left tower
  add(14.6, 4.2, 0.85, function (p) { fbox(p, 1.5, 1.9, 5.0, FILL2, 1); }, LV.tallByPrime);   // tall tower beside Prime
  add(18.2, 6.6, 0.85, function (p) { fbox(p, 1.3, 1.3, 3.6, FILL1, 1); }, LV.backRightTower);   // back-right tower
  add(25.6, 10.8, 0.85, function (p) { fbox(p, 1.9, 1.9, 4.2, FILL2, 1); }, LV.rightTower);   // right tower
  add(14.9, 6.4, 0.85, function (p) { fbox(p, 1.4, 1.4, 2.0, GREYB, 1); }, LV.midBlock);   // mid block
  add(8.6, 18.4, 0.85, function (p) { fbox(p, 1.5, 1.5, 2.6, GREYB, 1); }, LV.frontMidBlock);   // front mid block
  add(26.2, 16.6, 0.85, function (p) { fbox(p, 1.3, 1.3, 3.0, FILL2, 1); }, LV.frontRight);   // front-right
  add(24.6, 5.6, 0.85, function (p) { fbox(p, 2.2, 2.4, 1.3, GREYB, 0); }, LV.shed);   // low industrial shed
  add(3.2, 17.4, 0.85, function (p) { fbox(p, 2.3, 1.7, 1.2, FILL1, 0); }, LV.frontBlockL);   // low front block
  add(22.2, 16.2, 0.85, function (p) { fbox(p, 1.9, 2.1, 1.5, FILL1, 1); }, LV.frontBlockR);   // low front block
  // TREES — decorative; they ride the global CITY offset (no per-tree lever). Each [x, y] is a
  // raw grid spot you can freely edit. Four were nudged off the horizontal road / out of building
  // footprints after the buildings were moved; the rest are original.
  [[2.4, 11.4], [16.5, 10.6], [16.2, 12.8], [7.0, 15.0], [11.6, 18.6], [17.4, 19.2],
  [23.4, 11.0], [28.4, 7.2], [20.2, 16.6], [3.4, 15.6], [3.95, 10.2], [21.0, 8.0]]
    .forEach(function (t) { add(t[0], t[1], 0.7, tree); });

  objs.sort(function (a, b) { return (a[0] + a[1]) - (b[0] + b[1]); });
  objs.forEach(function (o) { place(o[3], o[0], o[1], o[2]); });
}

/* ============================================================
   the illustration itself (the original IIFE, relocated + rewired)
   ============================================================ */
export function createIllustration(
  stage: HTMLElement,
  opts?: { onSelect?: (id: string | null) => void; numbers?: Record<string, number> }
): IllustrationApi {
  var NUMS = (opts && opts.numbers) || {};
  // SCOPE all DOM lookups to `stage` so the inlined IDs can't collide with the host page
  const byId = (id: string) => stage.querySelector('#' + id) as any;

  var NS = 'http://www.w3.org/2000/svg';
  var K = 13, KZ = 12, CX = Math.cos(Math.PI / 6) * K, CY = Math.sin(Math.PI / 6) * K;
  var R2 = Math.SQRT2;
  function P(x, y, z) { return [(x - y) * CX, (x + y) * CY - z * KZ]; }
  function el(t, attrs, parent) {
    var e = document.createElementNS(NS, t);
    for (var k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e;
  }
  function pts(arr) { return arr.map(function (p) { return p[0].toFixed(2) + ',' + p[1].toFixed(2); }).join(' '); }

  var COL = { t: '#ffffff', e: '#eae7d6', s: '#dcd8c4' };
  var COLB = { t: '#f4f1de', e: '#e2decb', s: '#d3cfba' };   // substrates
  var COLO = { t: '#ec641d', e: '#cf5418', s: '#b84a14' };   // orange
  // the Arch mark (681×496 viewBox), reused on every ArchVM top face
  var ARCHLOGO = '<g fill="#ffffff"><path d="M486.886 496.312H464.224C461.851 496.312 459.624 495.102 458.365 493.068L348.93 317.09C346.363 312.974 342.344 312.537 340.746 312.537C339.148 312.537 335.081 312.974 332.563 317.09L223.128 493.068C221.869 495.102 219.642 496.312 217.269 496.312H194.607C189.183 496.312 185.891 490.356 188.748 485.756L304.526 299.657C312.37 287.017 325.929 279.511 340.795 279.511C355.66 279.511 369.219 287.017 377.063 299.657L492.841 485.756C495.699 490.356 492.406 496.312 486.982 496.312H486.886Z"/><path d="M548.962 496.322H526.299C523.924 496.322 521.7 495.112 520.439 493.078L355.367 227.658C352.074 222.379 346.699 219.377 340.501 219.377C334.303 219.377 328.879 222.379 325.635 227.658L160.563 493.078C159.304 495.112 157.076 496.322 154.703 496.322H132.042C126.619 496.322 123.326 490.366 126.183 485.765L297.55 210.224C306.847 195.261 322.875 186.35 340.501 186.35C349.314 186.35 357.691 188.578 365.1 192.694C372.46 196.811 378.803 202.767 383.452 210.224L554.817 485.765C557.678 490.366 554.381 496.322 548.962 496.322Z"/><path d="M610.939 496.315H588.275C585.905 496.315 583.677 495.105 582.416 493.071L361.755 138.209C357.01 130.606 349.165 126.247 340.207 126.247C331.249 126.247 323.405 130.606 318.66 138.209L97.9977 493.071C96.7387 495.105 94.5114 496.315 92.1387 496.315H69.4768C64.0533 496.315 60.7604 490.359 63.6178 485.758L290.622 120.727C301.13 103.827 319.143 93.5604 338.997 93.173C359.915 92.737 379.381 103.875 390.47 121.647L616.894 485.71C619.751 490.31 616.459 496.267 611.035 496.267L610.939 496.315Z"/><path d="M673.011 496.313H650.352C647.977 496.313 645.749 495.102 644.493 493.068L368.192 48.7644C361.995 38.7888 351.728 33.0746 339.962 33.0746C328.195 33.0746 317.93 38.7888 311.732 48.7644L35.4328 493.068C34.1738 495.102 31.9462 496.313 29.5735 496.313H6.91182C1.48849 496.313 -1.80435 490.357 1.05258 485.756L283.695 31.2829C295.897 11.719 316.913 0 340.01 0C363.108 0 384.124 11.6706 396.326 31.2829L678.966 485.756C681.828 490.357 678.531 496.313 673.112 496.313H673.011Z"/></g>';

  function box(parent, o) {
    var c = o.c || COL, z = o.z || 0, g = el('g', o.cls ? { 'class': o.cls } : {}, parent);
    var x = o.x, y = o.y, w = o.w, d = o.d, h = o.h;
    el('polygon', { points: pts([P(x + w, y, z + h), P(x + w, y + d, z + h), P(x + w, y + d, z), P(x + w, y, z)]), fill: c.e, 'class': 'fe' }, g);
    el('polygon', { points: pts([P(x, y + d, z + h), P(x + w, y + d, z + h), P(x + w, y + d, z), P(x, y + d, z)]), fill: c.s, 'class': 'fs' }, g);
    el('polygon', { points: pts([P(x, y, z + h), P(x + w, y, z + h), P(x + w, y + d, z + h), P(x, y + d, z + h)]), fill: c.t, 'class': 'ft' }, g);
    return g;
  }
  /* iso cylinder — circle in plan projects to an axis-aligned ellipse */
  function cyl(parent, o) {
    var c = o.c || COL, z = o.z || 0, g = el('g', o.cls ? { 'class': o.cls } : {}, parent);
    var rx = o.r * R2 * CX, ry = o.r * R2 * CY;
    var top = P(o.cx, o.cy, z + o.h), bot = P(o.cx, o.cy, z);
    el('path', {
      d: 'M' + (bot[0] - rx).toFixed(2) + ' ' + top[1].toFixed(2) +
        ' L' + (bot[0] - rx).toFixed(2) + ' ' + bot[1].toFixed(2) +
        ' A' + rx.toFixed(2) + ' ' + ry.toFixed(2) + ' 0 0 0 ' + (bot[0] + rx).toFixed(2) + ' ' + bot[1].toFixed(2) +
        ' L' + (bot[0] + rx).toFixed(2) + ' ' + top[1].toFixed(2) + ' Z',
      fill: c.e, 'class': 'fe cylbody'
    }, g);
    el('ellipse', { cx: top[0], cy: top[1], rx: rx, ry: ry, fill: c.t, 'class': 'ft' }, g);
    return g;
  }
  function comp(parent, id, defs) {
    var g = el('g', { 'class': 'comp', id: 'comp-' + id }, parent);
    defs.sort(function (a, b) {
      var ka = (a.cx !== undefined ? a.cx + a.cy : a.x + a.y), kb = (b.cx !== undefined ? b.cx + b.cy : b.x + b.y);
      return ka - kb;
    }).forEach(function (d) { d.cx !== undefined ? cyl(g, d) : box(g, d); });
    return g;
  }
  function label(parent, x, y, z, txt, anchor) {
    var p = P(x, y, z);
    var t = el('text', { x: p[0], y: p[1], 'class': 'isolabel', 'text-anchor': anchor || 'middle' }, parent);
    t.textContent = txt; return t;
  }
  /* project arbitrary SVG markup onto a top face at grid (x,y,z) */
  function onTop(parent, x, y, z, wUnits, viewW, markup) {
    var t = wUnits / viewW, o = P(x, y, z);
    var g = el('g', { transform: 'matrix(' + (t * CX).toFixed(3) + ',' + (t * CY).toFixed(3) + ',' + (-t * CX).toFixed(3) + ',' + (t * CY).toFixed(3) + ',' + o[0].toFixed(2) + ',' + o[1].toFixed(2) + ')' }, parent);
    g.innerHTML = markup;
    return g;
  }

  /* layer name written onto the front face of the substrate */
  function subLabel(parent, sl, z, txt) {
    var p = P(sl.x + 0.3, sl.y + sl.d, z + sl.h * 0.32);
    var t = el('text', {
      'class': 'subname',
      transform: 'matrix(0.866,0.5,0,1,' + p[0].toFixed(2) + ',' + p[1].toFixed(2) + ')'
    }, parent);
    t.textContent = txt; return t;
  }

  var svg = byId('iso');
  var VBX = -320, VBY = -360;
  var world = el('g', { id: 'world' }, svg);

  /* uniform substrate for every layer */
  var SL = { x: 3, y: 2, w: 28, d: 20, h: 1.6 };
  function substrate(parent, z, name) {
    box(parent, { x: SL.x, y: SL.y, w: SL.w, d: SL.d, h: SL.h, z: z, c: COLB });
    subLabel(parent, SL, z, name);
  }

  /* ============ LAYER 1 — chains (fades in) ============ */
  var G1 = 0, g1 = G1 + SL.h;             // substrate base z, content z
  var L1 = el('g', { 'class': 'layer fadein', id: 'L1' }, world);
  var L1f = el('g', { 'class': 'lift' }, L1);
  substrate(L1f, G1, 'Bitcoin');
  // everything on top of the substrate goes into a shifted group
  var SHX = -0.5, SHY = 0;
  L1f = el('g', { transform: 'translate(' + ((SHX - SHY) * CX).toFixed(2) + ',' + ((SHX + SHY) * CY).toFixed(2) + ')' }, L1f);

  // shared west-edge fade: a luminance mask each chain *wears*
  var mdefs = el('defs', {}, svg);
  function fadeMask(id, y0, xWhite, xBlack) {
    var gid = id + '-g', pW = P(xWhite, y0, g1), pB = P(xBlack, y0, g1);
    var lg = el('linearGradient', {
      id: gid, gradientUnits: 'userSpaceOnUse',
      x1: pB[0].toFixed(1), y1: pB[1].toFixed(1), x2: pW[0].toFixed(1), y2: pW[1].toFixed(1)
    }, mdefs);
    el('stop', { offset: '0', 'stop-color': '#000' }, lg);     // west end → hidden
    el('stop', { offset: '1', 'stop-color': '#fff' }, lg);     // east end → visible
    var m = el('mask', { id: id, maskUnits: 'userSpaceOnUse', x: -700, y: -700, width: 1400, height: 1400 }, mdefs);
    el('rect', { x: -700, y: -700, width: 1400, height: 1400, fill: 'url(#' + gid + ')' }, m);
    return 'url(#' + id + ')';
  }

  // --- Arch's chain: a fast stream of lots of tiny blocks pouring west out of the ArchVM ---
  var gArchWrap = el('g', { mask: fadeMask('archmask', 4.8, 9, 4) }, L1f);
  var gArch = el('g', {}, gArchWrap), archSegs = [];
  var AN = 20, ASPC = 1.1, AW = .8, AY = 4.4, AE = 22;   // fewer, square blocks (AW = width along the chain ≈ depth)
  function aBlock(ax) { var g = el('g', {}, gArch); box(g, { x: ax, y: AY, w: AW, d: .8, h: .5, z: g1, c: COL }); archSegs.push({ g: g, x0: ax }); }
  function aLink(ax) { var g = el('g', {}, gArch); box(g, { x: ax + AW, y: AY + .27, w: ASPC - AW, d: .26, h: .16, z: g1 + .1, c: COL }); archSegs.push({ g: g, x0: ax + AW }); }
  for (var ai = AN - 1; ai >= 1; ai--) { var ax = AE - ai * ASPC; aBlock(ax); aLink(ax); }   // west→east: block then its east link
  aBlock(AE);

  // ArchVM — orange cube, centered north of the treemap, logo on top
  var gVM = comp(L1f, 'l1vm', [{ x: 22, y: 3, w: 5, d: 3.5, h: 1.4, z: g1, c: COLO }]);
  onTop(gVM, 23, 3.55, g1 + 1.4, 3, 681, ARCHLOGO);
  var vmName = el('text', {
    'class': 'subname', style: 'fill:#ffffff;font-size:9px',
    transform: 'matrix(0.866,0.5,0,1,' + P(22.5, 6.5, g1 + .35)[0].toFixed(2) + ',' + P(22.5, 6.5, g1 + .35)[1].toFixed(2) + ')'
  }, L1f);
  vmName.textContent = 'ArchVM';
  // thinking lights — four pulsing squares on the VM's east wall
  var vmLights = [];
  for (var i = 0; i < 4; i++) {
    var ly = 3.45 + i * 0.7;
    vmLights.push(el('polygon', {
      points: pts([P(27, ly, g1 + .45), P(27, ly + .5, g1 + .45), P(27, ly + .5, g1 + .95), P(27, ly, g1 + .95)]),
      fill: '#ffffff', stroke: 'none', opacity: .15
    }, L1f));
  }

  // (the VM→block dots are built below, once the quadtree tiles exist)

  // bitcoin chain — flows west OUT of the treemap plate
  var gBtcWrap = el('g', { mask: fadeMask('btcmask', 15.25, 10, 4.5) }, L1f);
  var gBtc = el('g', {}, gBtcWrap), btcSegs = [];
  var BSP = 5.2;
  for (var i = 0; i < 6; i++) {
    var bx = -1.8 + i * BSP;
    var bg = el('g', {}, gBtc);
    box(bg, { x: bx, y: 14.1, w: 2.3, d: 2.3, h: 1, z: g1 });               // white block
    var og = el('g', { opacity: 0 }, bg);                            // orange overlay
    box(og, { x: bx, y: 14.1, w: 2.3, d: 2.3, h: 1, z: g1, c: COLO });
    box(bg, { x: bx + 2.3, y: 14.95, w: 2.9, d: .6, h: .3, z: g1 + .22 });      // link to the east block
    btcSegs.push({ g: bg, x0: bx, o: og });
  }

  // dots live here — placed before the block in DOM so the block occludes them
  var dotsLayer = el('g', {}, L1f);

  // treemap — the currently-filling Bitcoin block
  box(L1f, { x: 19, y: 9.5, w: 11, d: 11, h: 1, z: g1, c: { t: '#e9e5d2', e: '#d8d4c0', s: '#cbc7b2' } });   // square plate
  var tmName = el('text', {
    'class': 'subname', style: 'font-size:9px',
    transform: 'matrix(0.866,0.5,0,1,' + P(19.1, 20.5, g1 + .1)[0].toFixed(2) + ',' + P(19.1, 20.5, g1 + .1)[1].toFixed(2) + ')'
  }, L1f);
  tmName.textContent = 'Next block';
  var TM_CYCLE = 5.9, TM_FILL = 4.8, TM_CONSO = 5.5;   // fill / hold / seal timing (seconds)
  // deterministic quadtree pack
  function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  var rng = mulberry32(11);
  var TMX = 19.5, TMY = 10, TMS = 10, GG = 16, CELL = TMS / GG;   // square pack centered on the square plate
  var SPLIT = { 16: 1, 8: 1, 4: .52, 2: .34 };                // split probability by node size; min tile = 1 cell
  var leaves = [];
  (function quad(x, y, s) {
    if (s > 1 && rng() < (SPLIT[s] || 0)) { var h = s / 2; quad(x, y, h); quad(x + h, y, h); quad(x, y + h, h); quad(x + h, y + h, h); }
    else leaves.push({ gx: x, gy: y, s: s });
  })(0, 0, GG);
  // orderly fill: a clean diagonal sweep back(NW)→front(SE), tiebreak by gx
  var TMN = leaves.length;
  var sweep = leaves.map(function (_, i) { return i; })
    .sort(function (a, b) { var A = leaves[a], B = leaves[b]; return (A.gx + A.gy) - (B.gx + B.gy) || (A.gx - B.gx); });
  sweep.forEach(function (li, k) { leaves[li].appear = (k / TMN) * TM_FILL; leaves[li].orange = false; });
  // VM→block dots: a steady metronome that never pauses.
  var DLX = 24.5, DLY = 7, DTGY = 10.5, DTRAVEL = 0.4;
  var DOT_N = Math.round(TM_CYCLE / 0.5), DI = TM_CYCLE / DOT_N;
  // every dot arrival that lands within the fill window lights up an orange tile (snapped to that tick)
  for (var tick = DI; tick <= TM_FILL; tick += DI) {
    var rk = Math.min(TMN - 1, Math.round(tick / TM_FILL * TMN));
    leaves[sweep[rk]].orange = true; leaves[sweep[rk]].appear = tick;
  }
  // paint back-to-front by depth (centre x+y); fill order is independent of paint order
  var tmSquares = leaves.slice().sort(function (a, b) { return (a.gx + a.gy + a.s) - (b.gx + b.gy + b.s); }).map(function (L) {
    var g = el('g', { opacity: 0 }, L1f);
    box(g, { x: TMX + L.gx * CELL, y: TMY + L.gy * CELL, w: L.s * CELL, d: L.s * CELL, h: .2, z: g1 + 1, c: L.orange ? COLO : COL });
    return { g: g, appear: L.appear };
  });
  var dots = [];
  for (var dj = 0; dj < DOT_N; dj++) {
    var dg = el('g', { opacity: 0 }, dotsLayer);
    box(dg, { x: DLX - .4, y: DLY - .4, w: .8, d: .8, h: .5, z: g1, c: COLO });   // low drop from the VM south face
    dots.push({ g: dg, arrival: dj * DI });
  }

  /* ============ LAYER 2 — native-tech schematic (z 8) ============ */
  var Z2 = 8, bz = Z2 + SL.h;
  var L2 = el('g', { 'class': 'layer hid', id: 'L2' }, world);
  var L2f = el('g', { 'class': 'lift' }, L2);
  substrate(L2f, Z2, 'Native tech');

  // thin stroked connector between two grid points (z defaults to board top bz)
  function wire(parent, a, b, cls) {
    var pa = P(a[0], a[1], a[2] == null ? bz : a[2]), pb = P(b[0], b[1], b[2] == null ? bz : b[2]);
    return el('path', {
      d: 'M' + pa[0].toFixed(1) + ' ' + pa[1].toFixed(1) + ' L' + pb[0].toFixed(1) + ' ' + pb[1].toFixed(1),
      'class': 'wire' + (cls ? ' ' + cls : '')
    }, parent);
  }

  /* ===========  CHIP — LEVERS  =========== */
  var CHIP_X = 14.4, CHIP_Y = 8.7;                                   // position
  var CHIP_W = 6, CHIP_D = 6, CHIP_H = 1.2;                      // footprint + thickness
  var LOGO_DX = 0, LOGO_DY = -0.1, LOGO_SCALE = 3.8;                 // logo offset on top + size
  var CABLE_DX = -0.05, CABLE_DY = 0;                                // cable bundle slide / in-out
  var CABLE_N = 6, CABLE_W = 0.62, CABLE_GAP = 0.05, CABLE_H = 0.4;  // cable count / width / spacing / height
  var LABEL_TEXT = 'ARCH VM';                                        // chip label text
  var LABEL_DY = 0, LABEL_DZ = -0.11, LABEL_SIZE = 8.5;                  // label slide / raise / size
  /* ======================================= */

  // derived chip coords (used by the buses, wallets and cables below)
  var VMX = CHIP_X, VMY = CHIP_Y, VMW = CHIP_W, VMD = CHIP_D, VMH = CHIP_H;
  var VMR = VMX + VMW, VMB = VMY + VMD, VMcx = VMX + VMW / 2, VMcy = VMY + VMD / 2;

  /* =================  VALIDATOR ARRAY — LEVERS  ================= */
  var VAL_X = 4.1, VAL_Y = 3.3;          // overall position of the whole array
  var VAL_SX = 2.9, VAL_SY = 3.2;        // spacing between nodes (X / Y)
  var VAL_SIZE = 1.5, VAL_H = 0.65;      // node footprint size + height
  var VAL_LINE = 1.4;                    // connector line weight
  var VAL_COLS = 3, VAL_ROWS = 6;        // grid dimensions (cols × rows)
  var VAL_BREAKOUT = 0.35;                // chip-bus turn line: 0 = at the array, 1 = at the chip
  /* ============================================================= */
  var vNodes = [];
  for (var ci = 0; ci < VAL_COLS; ci++) for (var ri = 0; ri < VAL_ROWS; ri++) {
    var vx = VAL_X + ci * VAL_SX, vy = VAL_Y + ri * VAL_SY;
    vNodes.push({ x: vx, y: vy, ci: ci, ri: ri, cx: vx + VAL_SIZE / 2, cy: vy + VAL_SIZE / 2 });
  }
  // inter-node mesh — every node linked to its neighbours
  function nodeAt(ci, ri) { for (var i = 0; i < vNodes.length; i++) { var n = vNodes[i]; if (n.ci === ci && n.ri === ri) return n; } return null; }
  var gMesh = el('g', { 'class': 'l2el', id: 'g-schnorr', style: '--vw:' + VAL_LINE }, L2f);
  var meshEdges = [];
  vNodes.forEach(function (n) {
    [nodeAt(n.ci + 1, n.ri), nodeAt(n.ci, n.ri + 1), nodeAt(n.ci + 1, n.ri + 1), nodeAt(n.ci - 1, n.ri + 1)].forEach(function (m) {
      if (m) { wire(gMesh, [n.cx, n.cy, bz], [m.cx, m.cy, bz]); meshEdges.push({ a: [n.cx, n.cy], b: [m.cx, m.cy] }); }
    });
  });
  // packets hopping node-to-node along the mesh; alternating direction so it reads as mutual traffic
  var VPKT = 0.26, VPKT_SPEED = 0.42, VPKT_TRAVEL = 0.38;
  var gValPkts = el('g', { id: 'g-valpkts' }, L2f), valPkts = [];
  meshEdges.forEach(function (e, i) {
    if (i % 3 !== 0) return;   // sparse: only a third of the links carry a packet
    var s = i % 2 ? e.b : e.a, d = i % 2 ? e.a : e.b;
    var pg = el('g', {}, gValPkts);
    box(pg, { x: s[0] - VPKT / 2, y: s[1] - VPKT / 2, w: VPKT, d: VPKT, h: VPKT, z: bz + 0.05, c: COLO });
    valPkts.push({ g: pg, dx: d[0] - s[0], dy: d[1] - s[1], off: (i * 0.618) % 1 });
  });
  // chip bus — only the right column wires to the chip
  var gBus = el('g', { 'class': 'l2el', id: 'g-valbus', style: '--vw:' + VAL_LINE }, L2f);
  var tz = bz, arrayEdge = VAL_X + (VAL_COLS - 1) * VAL_SX + VAL_SIZE, midX = arrayEdge + VAL_BREAKOUT * (VMX - arrayEdge);
  function trace() {
    var d = '', a = [].slice.call(arguments);
    a.forEach(function (p, i) { var q = P(p[0], p[1], tz); d += (i ? ' L' : 'M') + q[0].toFixed(1) + ' ' + q[1].toFixed(1); });
    el('path', { d: d, 'class': 'wire' }, gBus);
  }
  vNodes.filter(function (n) { return n.ci === VAL_COLS - 1; }).forEach(function (n) { trace([n.cx, n.cy], [midX, n.cy], [midX, VMcy]); });
  trace([midX, VMcy], [VMX + 0.6, VMcy]);
  var gVal = el('g', { 'class': 'l2el', id: 'g-dpos' }, L2f);               // validator nodes (Fast dPoS)
  vNodes.forEach(function (n) { box(gVal, { x: n.x, y: n.y, w: VAL_SIZE, d: VAL_SIZE, h: VAL_H, z: bz }); });

  // --- ArchVM (centre) : big orange cube + interior UTXO cubes revealed on x-ray ---
  var gVMwrap = el('g', { 'class': 'l2el', id: 'g-vm' }, L2f);
  var CORE_N = 4, CORE_SIZE = 0.6, CORE_GAP = 1.32, CORE_H = 0.6, CORE_Z = bz + 0.35;   // grid · cube size · spacing · height · lift
  var coreSpan = (CORE_N - 1) * CORE_GAP + CORE_SIZE, coreOff = (VMW - coreSpan) / 2;      // centre the grid in the chip
  var gUtxoCore = el('g', { 'class': 'utxocore' }, gVMwrap), coreCubes = [];   // drawn first → occluded by the shell
  for (var cxi = 0; cxi < CORE_N; cxi++) for (var cyi = 0; cyi < CORE_N; cyi++) {
    var ccx = VMX + coreOff + cxi * CORE_GAP, ccy = VMY + coreOff + cyi * CORE_GAP, cc = el('g', {}, gUtxoCore);
    box(cc, { x: ccx, y: ccy, w: CORE_SIZE, d: CORE_SIZE, h: CORE_H, z: CORE_Z, c: COLO });
    coreCubes.push({ g: cc });
  }
  var gVMshell = el('g', { 'class': 'vmshell' }, gVMwrap);
  box(gVMshell, { x: VMX, y: VMY, w: VMW, d: VMD, h: VMH, z: bz, c: COLO });
  // Arch logo (same mark as layer 1), centred on the top face
  var LOGOW = LOGO_SCALE, LOGOH = LOGOW * 496 / 681;
  onTop(gVMshell, VMcx - LOGOW / 2 + LOGO_DX, VMcy - LOGOH / 2 + LOGO_DY, bz + VMH, LOGOW, 681, ARCHLOGO);
  // chip label on the bottom-right (east) face, reading up-to-the-right (LEVER 4)
  var LBLP = P(VMR, VMB - 0.5 + LABEL_DY, bz + 0.42 + LABEL_DZ);
  var vmLabel = el('text', {
    'class': 'subname', style: 'fill:#fff;letter-spacing:.1em;font-size:' + LABEL_SIZE + 'px',
    transform: 'matrix(0.866,-0.5,0,1,' + LBLP[0].toFixed(2) + ',' + LBLP[1].toFixed(2) + ')'
  }, gVMshell);
  vmLabel.textContent = LABEL_TEXT;

  // --- Bitcoin pipes: a 3D bundled cable running flat across the surface ---
  var pipes = [], waveCubes = [];
  var PIPE_Y1 = SL.y + SL.d;                                 // substrate front-left edge (y = 22)
  var PBW = CABLE_N * CABLE_W + (CABLE_N - 1) * CABLE_GAP;         // total bundle width
  var PX0 = VMcx - PBW / 2 + CABLE_DX;                           // centred on the chip's bottom edge, then shifted by CABLE_DX
  var PIPE_Y0 = VMB + CABLE_DY;                              // emerge exactly at the front-bottom edge
  var WAVE_SPEED = 0.3, WAVE_PER = 1, WAVE_CUBE = 0.6;                 // data cubes: speed · count per cable · cube size
  var WAVE_PHASE = 0.3, WAVE_EASE = 0;                            // phase offset between cables · turnaround easing
  var waveTravel = (PIPE_Y1 - PIPE_Y0) - WAVE_CUBE;
  for (var pi = 0; pi < CABLE_N; pi++) {
    var ppx = PX0 + pi * (CABLE_W + CABLE_GAP);
    var g = el('g', { 'class': 'l2el pipe' }, L2f);
    box(g, { x: ppx, y: PIPE_Y0, w: CABLE_W, d: PIPE_Y1 - PIPE_Y0, h: CABLE_H, z: bz, c: COL, cls: 'tube' });
    for (var wk = 0; wk < WAVE_PER; wk++) {
      var wc = el('g', { 'class': 'wpkt' }, g);                  // a data cube riding the cable
      box(wc, { x: ppx + (CABLE_W - WAVE_CUBE) / 2, y: PIPE_Y0, w: WAVE_CUBE, d: WAVE_CUBE, h: WAVE_CUBE, z: bz, c: COLO });
      waveCubes.push({ g: wc, pi: pi, off: pi * WAVE_PHASE + wk / WAVE_PER });   // staggered phase across the cables
    }
    pipes.push(g);
  }

  /* =================  WALLETS — LEVERS  ================= */
  var WAL_X = 22.8, WAL_Y = 3;            // position of the column (top wallet, left edge)
  var WAL_N = 4;                          // number of wallets (single column)
  var WAL_SY = 4.8;                       // spacing down the column
  var WAL_UTXO_N = 4;                     // UTXOs per wallet
  var WAL_UTXO = 1.15, WAL_UTXO_H = 0.4;  // UTXO footprint size + height
  var WAL_GAP = 0.4;                      // gap between UTXOs
  var WAL_PAD = 0.7;                      // padding around the contents
  var WAL_ADDR = 1;                     // space under the UTXOs for the address
  var WAL_ADDR_SIZE = 9;                  // address font size (px)
  var WAL_ADDR_DX = 0, WAL_ADDR_DY = 0.5;   // nudge the address text
  var WAL_CARD_H = 0.25;                  // wallet card thickness
  var WAL_LINE = 1.4;                     // connector line weight
  var WAL_BREAKOUT = 0.5;                 // chip-bus turn line: 0 = at the chip, 1 = at the wallets
  var WAL_ADDRS = ['1A1zP1…DivfNa', '17SkEw…XaxFyQ', '1Bitco…f59kuE', '34xp4v…4Twseo', '1FeexV…9sb6uF'];  // Satoshi · pizza · burn · Binance · Mt.Gox (cycled)
  /* ===================================================== */
  var wRow = WAL_UTXO_N * WAL_UTXO + (WAL_UTXO_N - 1) * WAL_GAP;     // UTXO row width
  var wCardW = wRow + 2 * WAL_PAD, wCardD = 2 * WAL_PAD + WAL_UTXO + WAL_ADDR, wTop = bz + WAL_CARD_H;
  var gWalletConn = el('g', { 'class': 'l2el', id: 'g-walletconn', style: '--vw:' + WAL_LINE }, L2f);  // first → bus tucks under the cards
  var gCards = el('g', { 'class': 'l2el', id: 'g-cards' }, L2f);
  var gUTXOacc = el('g', { 'class': 'l2el', id: 'g-perutxo' }, L2f);        // per-account UTXOs
  var gAddrs = el('g', { 'class': 'l2el', id: 'g-addr' }, L2f);             // per-account addresses
  for (var wi = 0; wi < WAL_N; wi++) {
    var wx = WAL_X, wy = WAL_Y + wi * WAL_SY;
    box(gCards, { x: wx, y: wy, w: wCardW, d: wCardD, h: WAL_CARD_H, z: bz, c: { t: '#f4f1de', e: '#e2decb', s: '#d3cfba' } });
    for (var uj = 0; uj < WAL_UTXO_N; uj++)
      box(gUTXOacc, { x: wx + WAL_PAD + uj * (WAL_UTXO + WAL_GAP), y: wy + WAL_PAD, w: WAL_UTXO, d: WAL_UTXO, h: WAL_UTXO_H, z: wTop, c: COL });
    // address lying flat on the card, below the UTXOs
    var ap = P(wx + WAL_PAD + WAL_ADDR_DX, wy + WAL_PAD + WAL_UTXO + WAL_ADDR * 0.62 + WAL_ADDR_DY, wTop + 0.02);
    var at = el('text', {
      'class': 'l2addr', style: 'font-size:' + WAL_ADDR_SIZE + 'px',
      transform: 'matrix(0.866,0.5,-0.866,0.5,' + ap[0].toFixed(2) + ',' + ap[1].toFixed(2) + ')'
    }, gAddrs);
    at.textContent = WAL_ADDRS[wi % WAL_ADDRS.length];
  }
  // circuit bus chip → wallets : trunk +x to the breakout line, along it to each wallet, then +x in
  var wbusX = VMR + WAL_BREAKOUT * (WAL_X - VMR);
  function wtrace() {
    var d = '', a = [].slice.call(arguments);
    a.forEach(function (p, i) { var q = P(p[0], p[1], bz); d += (i ? ' L' : 'M') + q[0].toFixed(1) + ' ' + q[1].toFixed(1); });
    el('path', { d: d, 'class': 'wire' }, gWalletConn);
  }
  wtrace([VMR, VMcy], [wbusX, VMcy]);
  for (var wj = 0; wj < WAL_N; wj++) { var wcy = WAL_Y + wj * WAL_SY + wCardD / 2; wtrace([wbusX, VMcy], [wbusX, wcy], [WAL_X + 0.4, wcy]); }

  /* =================  FINANCIAL PRIMITIVES — board nudge lever  =================
     nudge the whole primitives board on its slab to offset the iso visual illusion.
     +x = down-right · +y = down-left (grid units). The hover dots follow it. */
  var PRIM_DX = -0.3, PRIM_DY = -0.5;

  /* ---- the Financial Primitives layer: 6 plumbing modules ---- */
  function buildPrimitives(parent, bz) {
    var CARD = { t: '#efead3', e: '#e0dbc4', s: '#d2cdb5' };   // plate + cube share ONE hue now, a touch lighter than before
    var BLK = CARD;                                            // raised component cube — same color as the plate it sits on (unified)
    var GA = '#6d6d6d';                                        // glyph accent — de-orange'd; a mid-gray (split between the old light gray and the dark stroke)
    // gy nudges a glyph up-and-right on the cube top (this iso projection: −y = up-right) — used to
    // lift the icons that were hugging the bottom-left edge.
    var PRIMS = [
      { id: 'pools', x: 6.4, y: 5.8, g: '<path d="M3 19 C3 9 9 3 19 3" fill="none" stroke="#1c1c1c" stroke-width="1.6" stroke-linecap="round"/><circle cx="10" cy="10" r="2.1" fill="' + GA + '"/>' },
      { id: 'oracle', x: 14.4, y: 5.8, gy: -0.18, g: '<circle cx="12" cy="6" r="2.6" fill="' + GA + '"/><path d="M6 9 Q12 14 18 9 M12 8.5 L12 20" fill="none" stroke="#1c1c1c" stroke-width="1.5" stroke-linecap="round"/>' },
      { id: 'collateral', x: 22.4, y: 5.8, gy: -0.18, g: '<rect x="5.5" y="11" width="13" height="9.5" rx="1.6" fill="none" stroke="#1c1c1c" stroke-width="1.5"/><path d="M8 11 V8 a4 4 0 0 1 8 0 V11" fill="none" stroke="#1c1c1c" stroke-width="1.5"/><circle cx="12" cy="15.4" r="1.8" fill="' + GA + '"/>' },
      { id: 'liquidation', x: 6.4, y: 13.8, gy: -0.18, g: '<path d="M13 3 L6 13 H11 L9 21 L18 10 H12 Z" fill="' + GA + '" stroke="#1c1c1c" stroke-width="1.1" stroke-linejoin="round"/>' },
      { id: 'issuance', x: 14.4, y: 13.8, g: '<circle cx="12" cy="12" r="8" fill="none" stroke="#1c1c1c" stroke-width="1.5"/><path d="M12 5.5 V18.5 M9.6 9 H14 M9.6 15 H14" fill="none" stroke="' + GA + '" stroke-width="1.5" stroke-linecap="round"/>' },
      { id: 'risk', x: 22.4, y: 13.8, gy: -0.18, g: '<path d="M3.5 17 A8.5 8.5 0 0 1 20.5 17" fill="none" stroke="#1c1c1c" stroke-width="1.5"/><path d="M12 17 L16.5 10.5" stroke="' + GA + '" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="17" r="1.6" fill="#1c1c1c"/>' }
    ];
    PRIMS.sort(function (a, b) { return (a.x + a.y) - (b.x + b.y); });   // append back-to-front (iso occlusion)
    PRIMS.forEach(function (p) {
      var g = el('g', { 'class': 'comp', id: 'comp-' + p.id, 'data-cb': 'comp-' + p.id }, parent);
      box(g, { x: p.x + PRIM_DX, y: p.y + PRIM_DY, w: 5.2, d: 4.4, h: .5, z: bz, c: CARD });   // base plate
      box(g, { x: p.x + PRIM_DX + 1.2, y: p.y + PRIM_DY + 1.0, w: 2.8, d: 2.4, h: 1.2, z: bz + .5, c: BLK });    // raised cube
      onTop(g, p.x + PRIM_DX + 1.45 + (p.gx || 0), p.y + PRIM_DY + 1.2 + (p.gy || 0), bz + 1.7, 2.2, 24, p.g);   // glyph on top (per-glyph nudge)
    });
  }

  /* ============ LAYER 3 — financial primitives (plumbing, z 16) ============ */
  var Z3 = 16, cz = Z3 + SL.h;
  var L3 = el('g', { 'class': 'layer hid', id: 'L3' }, world);
  var L3f = el('g', { 'class': 'lift' }, L3);
  substrate(L3f, Z3, 'Financial primitives');
  buildPrimitives(L3f, cz);

  /* ============ LAYER 4 — finance city (apps / markets, z 24, now on TOP) ============ */
  var Z4 = 24, cz4 = Z4 + SL.h;
  var L4 = el('g', { 'class': 'layer hid', id: 'L4' }, world);
  var L4f = el('g', { 'class': 'lift' }, L4);
  substrate(L4f, Z4, 'Finance unlocks');
  buildFinanceCity(L4f, cz4);
  var tiles = [];   // kept (empty) so the frame() bob loop stays safe after the tiles were retired

  /* ============ callout dots (layers 3 & 4; layer 2 uses the L2STATES highlight system) ============ */
  var CALLOUTS = {
    // L3 — financial primitives (the plumbing). Anchors sit over each module's glyph; PRIM_DX/DY keeps them on the board.
    pools: { l: 3, a: [9.0 + PRIM_DX, 8.0 + PRIM_DY, cz + 2.0], t: 'Pooled liquidity', b: 'Pooling on real UTXOs enables AMMs — deep markets in the actual coin.' },
    oracle: { l: 3, a: [17.0 + PRIM_DX, 8.0 + PRIM_DY, cz + 2.0], t: 'Oracle price feeds', b: 'Live prices on-chain, read on every state change — not on a schedule.' },
    collateral: { l: 3, a: [25.0 + PRIM_DX, 8.0 + PRIM_DY, cz + 2.0], t: 'Collateral enforcement', b: 'Native BTC locked under threshold scripts. No wrapped IOU, no custodian.' },
    liquidation: { l: 3, a: [9.0 + PRIM_DX, 16.0 + PRIM_DY, cz + 2.0], t: 'Liquidation engine', b: 'Breach to settled in one atomic bundle, price locked at signing.' },
    issuance: { l: 3, a: [17.0 + PRIM_DX, 16.0 + PRIM_DY, cz + 2.0], t: 'Token issuance', b: 'Mint native assets — stablecoins, RWAs, vault shares.' },
    risk: { l: 3, a: [25.0 + PRIM_DX, 16.0 + PRIM_DY, cz + 2.0], t: 'Risk & margin', b: 'Every position monitored and cleared mechanically inside the stack.' },
    // L4 — finance city (apps / markets built on the primitives). Same buildings, elevated to cz4.
    // Each anchor adds CITY + the building's LV offset so the dot tracks the building when it's moved.
    dexs: { l: 4, a: [5.96 + CITY.dx + LV.dexs.dx, 13.45 + CITY.dy + LV.dexs.dy, cz4 + 3.21], t: 'DEXs', b: 'Deep markets in the actual coin, built on UTXO-native pools.' },
    looping: { l: 4, a: [15.14 + CITY.dx + LV.looping.dx, 17.1 + CITY.dy + LV.looping.dy, cz4 + 1.44], t: 'Looping', b: 'Leverage from lend + swap in one atomic transaction.' },
    lend: { l: 4, a: [7.56 + CITY.dx + LV.lend.dx, 5.66 + CITY.dy + LV.lend.dy, cz4 + 4.42], t: 'Lending & credit', b: 'Pooled deposits, enforced collateral, liquidations in seconds.' },
    prime: { l: 4, a: [13.06 + CITY.dx + LV.prime.dx, 7.06 + CITY.dy + LV.prime.dy, cz4 + 5.86], t: 'Prime brokerage', b: 'One account margining everything.' },
    vaults: { l: 4, a: [12.0 + CITY.dx + LV.vaults.dx, 12.72 + CITY.dy + LV.vaults.dy, cz4 + 2.62], t: 'Vaults', b: 'Deposited capital auto-deployed across strategies.' },
    stables: { l: 4, a: [22.37 + CITY.dx + LV.stables.dx, 5.78 + CITY.dy + LV.stables.dy, cz4 + 2.7], t: 'Stablecoins', b: 'Minted against BTC collateral, or issued 1:1.' },
    rwas: { l: 4, a: [21.54 + CITY.dx + LV.rwas.dx, 12.95 + CITY.dy + LV.rwas.dy, cz4 + 2.13], t: 'RWAs', b: 'Treasuries and funds as tokens with transfer rules.' }
  };

  /* shift the L3 primitive callout dots OFF their glyphs (screen px) so the icons stay visible.
     +x = right · +y = down. The tooltip card follows the same offset (see select()). */
  var DOT_DX = 20, DOT_DY = 25;
  var dotLayers = {
    2: el('g', { 'class': 'dots', id: 'dots2' }, world),
    3: el('g', { 'class': 'dots', id: 'dots3', transform: 'translate(' + DOT_DX + ',' + DOT_DY + ')' }, world),
    4: el('g', { 'class': 'dots', id: 'dots4' }, world)
  };
  function WS(n) { return -150 + (n - 1) * 96; }   // world shift: keeps the active layer vertically centered
  var selected = null; opts?.onSelect?.(null);
  var card = byId('card');

  // ---- layer-2 highlight states: each native-tech item lights up part of the schematic ----
  var L2STATES = {
    settle: { dir: 'out', anchor: 'g-vm', t: 'Direct Bitcoin settlement', b: 'Assets are never wrapped. Results settle straight back to Bitcoin.' },
    utxo: { xray: true, flow: true, anchor: 'g-vm', t: 'UTXO-native execution', b: 'Programs run on real UTXOs, not IOUs — operated live inside the VM.' },
    addr: { hot: ['g-addr'], anchor: 'g-addr', t: 'Per-account Bitcoin addresses', b: 'Every balance is verifiable on any Bitcoin explorer.' },
    perutxo: { hot: ['g-perutxo'], anchor: 'g-perutxo', t: 'Per-account UTXOs', b: 'Funds are never pooled into one wallet.' },
    taproot: { hot: ['pipeR', 'g-walletconn', 'g-cards', 'g-addr'], keep: ['g-perutxo'], anchor: 'g-cards', t: 'Taproot account model', b: 'Compatible with existing Bitcoin wallets.' },
    hybrid: { hot: ['g-cards', 'g-perutxo', 'g-addr'], anchor: 'g-cards', t: 'Hybrid Account Model', b: 'Accounts and programs hold both Arch-native balances and Bitcoin UTXOs.' },
    schnorr: { hot: ['g-schnorr', 'g-valbus', 'g-valpkts'], anchor: 'g-schnorr', t: 'Threshold Schnorr signing', b: 'FROST + ROAST: no single key ever exists, signing never stalls.' },
    syscall: { dir: 'in', anchor: 'g-vm', t: 'Native Bitcoin syscalls', b: 'Programs read and write Bitcoin directly, no oracle in between.' },
    vm: { flow: true, anchor: 'g-vm', t: 'Bitcoin-native VM', b: 'Solana’s proven eBPF engine, forked and rebuilt around UTXOs.' },
    dpos: { hot: ['g-dpos', 'g-valpkts'], anchor: 'g-dpos', t: 'Fast dPoS consensus', b: '180ms blocks, 1,500 TPS.' }
  };
  var PIPEGRP = { pipeL: [0, 1], pipeC: [2, 3], pipeR: [4, 5] };
  // directional reveal across ALL cables
  var ALLPIPES = pipes.map(function (_, i) { return i; });
  var WAVE_DIR = { settle: { pipes: ALLPIPES, away: true }, syscall: { pipes: ALLPIPES, away: false } };
  function hotEls(key) {
    if (PIPEGRP[key]) return PIPEGRP[key].map(function (i) { return pipes[i]; });
    var e = byId(key); return e ? [e] : [];
  }
  function clearL2() {
    L2.classList.remove('focus', 'flow');
    byId('g-vm').classList.remove('xray');
    [].forEach.call(L2.querySelectorAll('.hot,.keep'), function (e) { e.classList.remove('hot'); e.classList.remove('keep'); });
  }
  function applyL2(id) {
    var s = L2STATES[id]; if (!s) return;
    // flow: fade everything except the moving cubes and the Arch VM. focus: the generic spotlight that lifts hot/keep.
    if (s.flow || s.dir) L2.classList.add('flow');
    else if (s.hot || s.keep || s.xray) L2.classList.add('focus');
    if (s.xray) byId('g-vm').classList.add('xray');
    (s.hot || []).forEach(function (k) { hotEls(k).forEach(function (e) { e.classList.add('hot'); }); });
    (s.keep || []).forEach(function (k) { hotEls(k).forEach(function (e) { e.classList.add('keep'); }); });
  }

  function clearDots() {
    [].forEach.call(stage.querySelectorAll('.dots.dimothers'), function (d) { d.classList.remove('dimothers'); });
    [].forEach.call(stage.querySelectorAll('.dot.act'), function (d) { d.classList.remove('act'); });
  }
  function clearSel() {
    if (selected) { var pc = byId('comp-' + selected); if (pc) pc.classList.remove('sel'); }
    selected = null; clearL2(); clearDots();
    stage.querySelectorAll('#L3 [data-cb], #L4 [data-cb]').forEach(function (w) { w.style.opacity = ''; });
    if (card) card.style.opacity = 0;
  }

  function select(id) {
    if (selected) { var pc = byId('comp-' + selected); if (pc) pc.classList.remove('sel'); }
    clearL2(); clearDots();
    selected = id; opts?.onSelect?.(id);
    // fade the other hover indicators, keep the active one lit
    var ad = stage.querySelector('.dot[data-id="' + id + '"]');
    if (ad) { ad.classList.add('act'); ad.parentNode.classList.add('dimothers'); }
    if (L2STATES[id]) { applyL2(id); return; }
    var c = CALLOUTS[id]; if (!c) return;
    var g = byId('comp-' + id); if (g) g.classList.add('sel');
    // L3 city: dim the rest of the district to focus the hovered building
    if (c.l === 3 || c.l === 4) stage.querySelectorAll('#L' + c.l + ' [data-cb]').forEach(function (w) { w.style.opacity = (w.getAttribute('data-cb') === 'comp-' + id) ? '' : '0.4'; });
    // callout card (positioned at the projected anchor)
    if (card) {
      var p = P.apply(null, c.a), sx = p[0] - VBX + (c.l === 3 ? DOT_DX : 0), sy = p[1] - VBY + WS(state) + (c.l === 3 ? DOT_DY : 0);
      card.querySelector('.t').textContent = c.t; card.querySelector('.b').textContent = c.b;
      if (sx > 430) { card.style.left = (sx - 238) + 'px'; card.classList.add('flip'); } else { card.style.left = (sx + 16) + 'px'; card.classList.remove('flip'); }
      card.style.top = (sy - 22) + 'px'; card.style.opacity = 1;
    }
  }

  // build a dot's circles (+ the index number that ties it to the left rail, when one exists)
  function dotShapes(g, p, id) {
    el('circle', { cx: p[0], cy: p[1], r: 13, 'class': 'hit' }, g);
    el('circle', { cx: p[0], cy: p[1], r: NUMS[id] != null ? 7.5 : 5.5, 'class': 'c' }, g);
    if (NUMS[id] != null) {
      var tx = el('text', { x: p[0], y: p[1], 'class': 'dnum' }, g);
      tx.textContent = String(NUMS[id]);
    }
  }
  Object.keys(CALLOUTS).forEach(function (id) {
    var c = CALLOUTS[id], p = P.apply(null, c.a);
    var g = el('g', { 'class': 'dot', 'data-id': id }, dotLayers[c.l]);
    dotShapes(g, p, id);
    g.addEventListener('mouseenter', function () { select(id); });
    g.addEventListener('mouseleave', clearSel);
    g.addEventListener('click', function () { select(id); });
  });
  // make each city building (L4) AND each primitive module (L3) hover-selectable (not just its dot)
  ['dexs', 'looping', 'lend', 'prime', 'vaults', 'stables', 'rwas',
    'pools', 'oracle', 'collateral', 'liquidation', 'issuance', 'risk'].forEach(function (id) {
      var c = byId('comp-' + id); if (!c) return;
      c.style.cursor = 'pointer';
      c.addEventListener('mouseenter', function () { select(id); });
      c.addEventListener('mouseleave', clearSel);
      c.addEventListener('click', function () { select(id); });
    });

  /* ========  CALLOUT DOTS — LEVERS  (hover circles on the art; [x, y, z] grid units) ======== */
  var L2DOTS = {
    dpos: [5.4, 7.8, bz + 1.2],   // a validator node
    schnorr: [9.7, 12.5, bz + 0.8],   // the node-to-node mesh
    vm: [17.8, 8.4, bz + 2.0],   // the chip
    utxo: [16, 12.5, bz + 2.0],   // inside the chip
    syscall: [20.9, 18.5, bz + 0.6],   // left Bitcoin cables
    settle: [14.3, 18.5, bz + 0.6],   // centre Bitcoin cables
    taproot: [26.7, 15.7, bz + 0.8],   // the wallets
    perutxo: [24.2, 4.4, bz + 0.8],   // a UTXO
    addr: [28, 11, bz + 0.8]    // a wallet address
  };
  /* ========================================================================================= */
  Object.keys(L2DOTS).forEach(function (id) {
    var a = L2DOTS[id], p = P(a[0], a[1], a[2]);
    var g = el('g', { 'class': 'dot', 'data-id': id }, dotLayers[2]);
    dotShapes(g, p, id);
    g.addEventListener('mouseenter', function () { select(id); });
    g.addEventListener('mouseleave', clearSel);
    g.addEventListener('click', function () { select(id); });
  });

  /* ============ layer states ============ */
  var layers = { 1: L1, 2: L2, 3: L3, 4: L4 };
  var state = 0;
  function setState(n) {
    if (n === state) return; state = n;
    world.style.transform = 'translateY(' + WS(n) + 'px)';
    for (var i = 1; i <= 4; i++) {
      layers[i].classList.toggle('hid', i > n);
      layers[i].classList.toggle('dim', i < n);
    }
    for (var d in dotLayers) dotLayers[d].classList.toggle('show', +d === n);
    clearSel();
  }

  /* ============ motion ============ */
  function tr(g, ux, uy) { g.setAttribute('transform', 'translate(' + ((ux - uy) * CX).toFixed(2) + ',' + ((ux + uy) * CY).toFixed(2) + ')'); }
  var rafId = 0, stopped = false;
  var t0 = performance.now();
  // Safari re-rasterizes the SVG on every attribute mutation, and this loop mutates dozens of
  // nodes per frame — at 60fps that pegs Safari (Chromium handles it fine). Cap Safari to ~30fps;
  // the motion is slow/ambient so it stays smooth-looking. `t` uses real elapsed time, so the
  // animation plays at the same speed regardless of frame rate — just fewer samples.
  var FRAME_MS = (typeof navigator !== 'undefined'
    && /^((?!chrome|crios|android).)*safari/i.test(navigator.userAgent)
    && /apple/i.test(navigator.vendor || '')) ? 1000 / 30 : 0;
  var lastPaint = 0;
  function frame(now) {
    if (stopped) return;
    rafId = requestAnimationFrame(frame);
    if (now - lastPaint < FRAME_MS) return;   // Safari throttle: skip this frame's repaint
    lastPaint = now;
    var t = (now - t0) / 1000;
    var ob = ((t % TM_CYCLE) / TM_CYCLE) * BSP;   // one block-slot per treemap cycle — synced to the seal
    tr(gBtc, -ob, 0);                      // bitcoin crawl, leftward away
    // each block emerges orange from NEXT BLOCK and settles to white as it ages west
    btcSegs.forEach(function (s) { s.o.setAttribute('opacity', Math.max(0, Math.min(1, (s.x0 - ob - 13) / 4)).toFixed(2)); });
    // Arch's chain — fast westward crawl, looping by one (tiny) block-space
    var oa = (t * 1.9) % ASPC;
    tr(gArch, -oa, 0);
    // VM thinking lights — pulse in sequence
    vmLights.forEach(function (l, i) {
      var v = Math.max(0, Math.sin(t * 3 - i * 0.9));
      l.setAttribute('opacity', (0.15 + 0.85 * v).toFixed(2));
    });
    // next block: gentle orderly fill -> brief hold -> seal (all at once) -> refill immediately
    var ct = t % TM_CYCLE;
    tmSquares.forEach(function (sq) {
      var o;
      if (ct < sq.appear) o = 0;
      else if (ct < TM_CONSO) { var x = Math.min(1, (ct - sq.appear) / 0.32); o = x * x * (3 - 2 * x); }   // gentle ease-in, hold full
      else o = Math.max(0, 1 - (ct - TM_CONSO) / 0.4);   // seal: fade out together
      sq.g.setAttribute('opacity', o.toFixed(2));
    });
    // VM→block dots: a steady metronome dropping south from the VM, never pausing through seal/refill
    dots.forEach(function (d) {
      var ph = ((ct - (d.arrival - DTRAVEL)) % TM_CYCLE + TM_CYCLE) % TM_CYCLE;
      if (ph <= DTRAVEL) {
        var p = ph / DTRAVEL;
        tr(d.g, 0, (DTGY - DLY) * p);
        d.g.setAttribute('opacity', (p < .2 ? p / .2 : p > .85 ? (1 - p) / .15 : 1).toFixed(2));
      } else d.g.setAttribute('opacity', 0);
    });
    // ArchVM interior — UTXOs merge/split/blink while the shell is x-rayed (UTXO-native execution)
    if (gVMwrap.classList.contains('xray')) {
      coreCubes.forEach(function (c, i) {
        var ph = t * 0.9 + i * 0.7;
        tr(c.g, Math.sin(ph) * 0.14, Math.cos(ph * 0.8 + i) * 0.14);
        c.g.setAttribute('opacity', (Math.sin(t * 1.6 + i * 1.7) > -0.3 ? 1 : 0.12).toFixed(2));
      });
    }
    // Bitcoin cables — data cubes bounce end-to-end with an eased turnaround, phased per cable
    waveCubes.forEach(function (w) {
      var ph = t * WAVE_SPEED + w.off; ph -= Math.floor(ph);            // [0,1)
      var L = 1 - Math.abs(1 - 2 * ph), S = 0.5 - 0.5 * Math.cos(2 * Math.PI * ph); // linear bounce vs eased bounce
      tr(w.g, 0, ((1 - WAVE_EASE) * L + WAVE_EASE * S) * waveTravel);
      var dir = WAVE_DIR[selected];                                 // directional reveal for settle / syscall
      if (dir && dir.pipes.indexOf(w.pi) >= 0) {
        w.g.style.opacity = ((ph < 0.5) === dir.away) ? 1 : 0;        // visible only on the matching half of the trip
      } else { w.g.style.opacity = ''; }                            // otherwise hand opacity back to CSS
    });
    tiles.forEach(function (tg, i) { tg.setAttribute('transform', 'translate(0,' + (Math.sin(t * 1.4 + i * 1.3) * 3).toFixed(2) + ')'); });
    // validator packets: ride an edge, fade in/out, then reappear on the next cycle
    valPkts.forEach(function (pk) {
      var ph = (t * VPKT_SPEED + pk.off) % 1;
      if (ph < VPKT_TRAVEL) {
        var p = ph / VPKT_TRAVEL;
        tr(pk.g, pk.dx * p, pk.dy * p);
        pk.g.setAttribute('opacity', (p < .15 ? p / .15 : p > .85 ? (1 - p) / .15 : 1).toFixed(2));
      } else pk.g.setAttribute('opacity', 0);
    });
  }
  rafId = requestAnimationFrame(frame);

  function destroy() {
    stopped = true;
    if (rafId) cancelAnimationFrame(rafId);
    // drop everything this module appended into #iso so the listener-bearing
    // elements can be GC'd and a re-mount (e.g. React StrictMode) starts clean.
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    if (card) card.style.opacity = 0;
  }

  return { setState, select, clearSel, destroy };
}
