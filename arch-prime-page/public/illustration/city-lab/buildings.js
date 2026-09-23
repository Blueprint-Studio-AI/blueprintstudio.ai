/* Shared finance-city building library — extracted verbatim from the picked
   iteration files. Each build_<id>(parent,ox,oy,bz) creates a <g class="comp"
   id="comp-<id>"> and returns it. Relies on kit.js globals (P, box, cyl, tri,
   quad, faceCircleX, faceDrumX, faceClockX, faceGroupX, onTop, el, COL, COLO). */

function build_prime(parent,ox,oy,bz){
  var g=el('g',{'class':'comp',id:'comp-prime'},parent);
  function B(o){ o.x+=ox; o.y+=oy; o.z=(o.z||0)+bz; box(g,o); }

  var REC = { t:'#d8d4c0', e:'#cbc6b0', s:'#bdb8a2' };   // recessed-window cream

  // 1. broad plinth
  B({x:0.3, y:0.3, w:3.8, d:3.8, h:0.35, z:0});

  // 2. tier 1 — tall base mass (east wall x=3.95, south wall y=3.95)
  B({x:0.45, y:0.45, w:3.5, d:3.5, h:3.0, z:0.35});
  B({x:3.93, y:0.85, w:0.04, d:2.7, h:2.4, z:0.65, c:REC});   // east window panel
  B({x:0.85, y:3.93, w:2.7,  d:0.04,h:2.4, z:0.65, c:REC});   // south window panel

  // 3. tier 2 — first setback (east x=3.65, south y=3.65)
  B({x:0.75, y:0.75, w:2.9, d:2.9, h:2.6, z:3.35});
  B({x:3.63, y:1.1,  w:0.04, d:2.2, h:2.0, z:3.65, c:REC});
  B({x:1.1,  y:3.63, w:2.2,  d:0.04,h:2.0, z:3.65, c:REC});

  // 4. tier 3 — second setback (east x=3.3, south y=3.3)
  B({x:1.1, y:1.1, w:2.2, d:2.2, h:2.2, z:5.95});
  B({x:3.28, y:1.4, w:0.04, d:1.6, h:1.6, z:6.2, c:REC});
  B({x:1.4,  y:3.28,w:1.6,  d:0.04,h:1.6, z:6.2, c:REC});

  // 5. tier 4 — third setback
  B({x:1.45, y:1.45, w:1.5, d:1.5, h:1.6, z:8.15});

  // 6. crown — cream cap
  B({x:1.7, y:1.7, w:1.0, d:1.0, h:0.6, z:9.75});

  // 7. ACCENT — orange beacon on the crown (highest + nearest)
  B({x:1.95, y:1.95, w:0.5, d:0.5, h:0.55, z:10.35, c:COLO});

  // 8. thin cream mast above the beacon
  B({x:2.13, y:2.13, w:0.14, d:0.14, h:1.3, z:10.9});
  return g;
}

function build_dexs(parent,ox,oy,bz){
  var g=el('g',{'class':'comp',id:'comp-dexs'},parent);
  function B(o){ o.x+=ox; o.y+=oy; o.z=(o.z||0)+bz; box(g,o); }
  function C(o){ o.cx+=ox; o.cy+=oy; o.z=(o.z||0)+bz; cyl(g,o); }
  function pt(x,y,z){ return [x+ox, y+oy, z+bz]; }
  var zf=0.66, DARK={t:'#d8d4c0',e:'#cbc6b0',s:'#bdb8a2'};

  // 1. crepidoma — three grand steps
  B({x:0,    y:0,    w:4.6,  d:3.4,  h:0.22});
  B({x:0.28, y:0.28, w:4.04, d:2.84, h:0.22, z:0.22});
  B({x:0.56, y:0.56, w:3.48, d:2.28, h:0.22, z:0.44});

  // 2. cella — solid block behind the colonnade
  B({x:0.8, y:0.7, w:2.5, d:2.0, h:2.0, z:zf});

  // 3. recessed doorway (dark, centred — not the accent)
  B({x:3.22, y:1.5, w:0.1, d:0.6, h:1.3, z:zf, c:DARK});

  // 4. grand colonnade — 6 columns across the east front
  [0.78,1.16,1.54,1.92,2.30,2.68].forEach(function(cy){ C({cx:3.6, cy:cy, r:0.17, h:2.0, z:zf}); });

  // 5. flat entablature — broad, moderate cornice overhang
  B({x:0.62, y:0.6, w:3.45, d:2.65, h:0.4, z:2.66});

  // 6. low wide pediment over the colonnade (east gable)
  var rxF=4.07, rxB=3.25, ym=1.92, eY0=0.6, eY1=3.25, eZ=3.06, rZ=3.78;
  quad(g, pt(rxB,eY0,eZ), pt(rxF,eY0,eZ), pt(rxF,ym,rZ), pt(rxB,ym,rZ), COL.e, 'ft'); // back slope (far)
  quad(g, pt(rxB,eY1,eZ), pt(rxF,eY1,eZ), pt(rxF,ym,rZ), pt(rxB,ym,rZ), COL.t, 'ft'); // front slope (near)
  tri (g, pt(rxF,eY0,eZ), pt(rxF,eY1,eZ), pt(rxF,ym,rZ),                  COL.e, 'fe'); // gable face

  // 7. clock — a small orange drum tucked into the pediment tympanum (subtle 3D)
  faceDrumX(g, rxF, ym, eZ+0.30, 0.17, 0.12, COLO);
  return g;
}

function build_lend(parent,ox,oy,bz){
  var g=el('g',{'class':'comp',id:'comp-lend'},parent);
  function B(o){ o.x+=ox; o.y+=oy; o.z=(o.z||0)+bz; box(g,o); }
  function C(o){ o.cx+=ox; o.cy+=oy; o.z=(o.z||0)+bz; cyl(g,o); }
  function pt(x,y,z){ return [x+ox, y+oy, z+bz]; }

  var GLASS = { t:'#bcc2c0', e:'#aab0ae', s:'#9aa09e' };   // darker curtain-wall glass
  var MULL  = { t:'#d8d4c0', e:'#cbc6b0', s:'#bdb8a2' };   // muted mullion / soffit cream

  // ---- footprint: main block occupies x[0.55..4.05], y[0.5..3.4] ----

  // 1. low plinth — slightly WIDER than the block above, so the block reads as
  //    floating on a recessed dark lobby band (modern setback at the ground).
  B({x:0.35, y:0.3,  w:3.9,  d:3.3,  h:0.28, z:0});                       // plinth slab
  // recessed glass lobby band, inset under the block (reads as ground-floor glazing)
  B({x:0.5,  y:0.42, w:3.6,  d:3.06, h:0.62, z:0.28, c:GLASS});           // dark lobby volume
  // thin cream lobby mullions (slender piers) breaking the east + south glass
  B({x:4.07, y:0.7,  w:0.05, d:0.1,  h:0.62, z:0.28, c:MULL});
  B({x:4.07, y:1.5,  w:0.05, d:0.1,  h:0.62, z:0.28, c:MULL});
  B({x:4.07, y:2.3,  w:0.05, d:0.1,  h:0.62, z:0.28, c:MULL});
  B({x:1.2,  y:3.45, w:0.1,  d:0.05, h:0.62, z:0.28, c:MULL});
  B({x:2.0,  y:3.45, w:0.1,  d:0.05, h:0.62, z:0.28, c:MULL});
  B({x:2.8,  y:3.45, w:0.1,  d:0.05, h:0.62, z:0.28, c:MULL});

  // 2. MAIN BLOCK — the 2-storey glass mass sitting on the lobby (east x=4.05, south y=3.4)
  B({x:0.55, y:0.5, w:3.5, d:2.9, h:2.0, z:0.9});                          // solid cream core

  //    floor-1 recessed window band (east + south), thin inset glass panels
  B({x:4.03, y:0.85, w:0.04, d:2.2, h:0.66, z:1.2, c:GLASS});             // east band, floor 1
  B({x:0.9,  y:3.38, w:2.65, d:0.04, h:0.66, z:1.2, c:GLASS});            // south band, floor 1
  //    spandrel break (cream slab line between floors) — implicit gap z 1.86..2.04
  //    floor-2 recessed window band (east + south)
  B({x:4.03, y:0.85, w:0.04, d:2.2, h:0.66, z:2.04, c:GLASS});           // east band, floor 2
  B({x:0.9,  y:3.38, w:2.65, d:0.04, h:0.66, z:2.04, c:GLASS});          // south band, floor 2

  //    slim cream parapet/cornice capping the main block top
  B({x:0.55, y:0.5, w:3.5, d:2.9, h:0.14, z:2.9, c:MULL});

  // 3. CANTILEVERED UPPER FLOOR — set back on north/west, oversailing toward the
  //    camera on east/south for modern flair (east x=4.2 > 4.05, south y=3.55 > 3.4)
  B({x:0.9, y:0.85, w:3.3, d:2.7, h:1.5, z:3.04});                        // upper mass
  //    upper-floor continuous glass band (east + south), the signature ribbon
  B({x:4.18, y:1.15, w:0.04, d:2.1, h:0.9, z:3.34, c:GLASS});            // east ribbon
  B({x:1.2,  y:3.53, w:2.6,  d:0.04, h:0.9, z:3.34, c:GLASS});           // south ribbon
  //    slim parapet on the upper roof
  B({x:0.9, y:0.85, w:3.3, d:2.7, h:0.16, z:4.54, c:MULL});

  // 4. flat roof — small rooftop mechanical box (set back, low, muted)
  B({x:1.3, y:1.25, w:1.1, d:1.0, h:0.5, z:4.7, c:MULL});

  // 5. ACCENT (the one orange) — a clean ENTRANCE PORTAL at the lobby centre on
  //    the east front: the bank's doorway, integrated rather than a tacked-on sign.
  //    A slim cream canopy caps it for a modern entrance read.
  B({x:4.04, y:1.55, w:0.2,  d:0.8,  h:0.86, z:0.28, c:COLO});   // orange entrance portal
  B({x:4.02, y:1.45, w:0.26, d:1.0,  h:0.1,  z:1.14, c:MULL});   // slim entrance canopy
  return g;
}

function build_vaults(parent,ox,oy,bz){
  var g=el('g',{'class':'comp',id:'comp-vaults'},parent);
  function B(o){ o.x+=ox; o.y+=oy; o.z=(o.z||0)+bz; box(g,o); }
  function FC(xF,yc,zc,r,fill){ return faceCircleX(g, xF+ox, yc+oy, zc+bz, r, fill); }
  function FG(xF,yc,zc){ return faceGroupX(g, xF+ox, yc+oy, zc+bz); }
  function FD(xF,yc,zc,r,depth,c){ return faceDrumX(g, xF+ox, yc+oy, zc+bz, r, depth, c); }

  var STONE = { t:'#d8d4c0', e:'#cbc6b0', s:'#bdb8a2' };   // heavy fortress stone
  var BOLT  = '#8f8b78';                                    // dark steel bolts
  var STEEL = '#c4bfa8';                                    // door steel ring

  // 1. thick plinth (far, low base)
  B({x:0.3, y:0.3, w:4.0, d:3.4, h:0.45});
  // 2. main block — heavy solid cube (east wall x=4.0, top z3.05)
  B({x:0.6, y:0.6, w:3.4, d:2.8, h:2.6, z:0.45, c:STONE});
  // 3. stepped threshold jutting east in front of the door
  B({x:4.0, y:1.15, w:0.6, d:1.7, h:0.12, z:0.45});
  B({x:4.0, y:1.3,  w:0.48,d:1.4, h:0.26, z:0.45, c:STONE});

  // 4. VAULT DOOR on the east face (xF=4.0), centred yc=2.0 zc=1.6
  var xF=4.0, yc=2.0, zc=1.6;
  FC(xF, yc, zc, 1.02, STONE.s);   // door surround (recessed jamb, tan)
  FC(xF, yc, zc, 0.92, STEEL);     // outer steel door slab
  // -- ring of bolts around the rim --
  (function(){ var fg=FG(xF,yc,zc), n=12, k, a;
    for(k=0;k<n;k++){ a=k/n*2*Math.PI;
      el('circle',{cx:(0.8*Math.cos(a)).toFixed(3),cy:(0.8*Math.sin(a)).toFixed(3),r:0.07,fill:BOLT},fg);
    }
  })();
  FC(xF, yc, zc, 0.6,  COL.t);     // bright inner door face
  FC(xF, yc, zc, 0.46, STEEL);     // inner steel recess

  // -- spoked handwheel (the orange focal mechanism) --
  FC(xF, yc, zc, 0.36, COLO.t);    // wheel rim disc (orange)
  FC(xF, yc, zc, 0.27, COL.t);     // cut centre -> leaves an orange rim ring
  (function(){ var fg=FG(xF,yc,zc), n=5, k, a;
    for(k=0;k<n;k++){ a=k/n*2*Math.PI - Math.PI/2;
      el('line',{x1:(0.07*Math.cos(a)).toFixed(3),y1:(0.07*Math.sin(a)).toFixed(3),
        x2:(0.32*Math.cos(a)).toFixed(3),y2:(0.32*Math.sin(a)).toFixed(3),
        stroke:'#cf5418','stroke-width':2.6,'vector-effect':'non-scaling-stroke','stroke-linecap':'round'},fg);
    }
  })();
  FD(xF, yc, zc, 0.1, 0.16, COLO); // protruding orange hub (the 3D bit)

  // -- combination dial below the wheel --
  FC(xF, yc, zc-0.62, 0.13, STEEL);
  FD(xF, yc, zc-0.62, 0.055, 0.1, COLO);
  return g;
}

function build_stables(parent,ox,oy,bz){
  var g=el('g',{'class':'comp',id:'comp-stables'},parent);
  function B(o){ o.x+=ox; o.y+=oy; o.z=(o.z||0)+bz; box(g,o); }
  function C(o){ o.cx+=ox; o.cy+=oy; o.z=(o.z||0)+bz; cyl(g,o); }
  function pt(x,y,z){ return [x+ox, y+oy, z+bz]; }

  var STONE = {t:'#ece8d2', e:'#ddd9c2', s:'#cdc9b2'}; // institutional stone
  var REC   = {t:'#d3cfba', e:'#c6c1ab', s:'#b8b399'}; // recessed windows
  var DARK  = {t:'#b3ae9a', e:'#a39e8a', s:'#94907c'}; // chimney shaft / cap

  // 1. two broad steps
  B({x:0,   y:0,   w:4.4, d:3.0, h:0.25});
  B({x:0.3, y:0.3, w:3.8, d:2.4, h:0.25, z:0.25});
  var zf=0.5;

  // 2. SMOKESTACK — appended early (back), rises behind/within the block from the
  //    works. Tall slim round stack at the back-left, on the roof line.
  C({cx:1.15, cy:0.95, r:0.26, h:3.3, z:zf, c:DARK});      // stack shaft
  C({cx:1.15, cy:0.95, r:0.30, h:0.2, z:zf+3.3, c:STONE}); // stack cap

  // 3. main mint block — solid, symmetric, institutional (east x=3.8, south y=2.55)
  B({x:0.6, y:0.55, w:3.2, d:2.0, h:2.0, z:zf, c:STONE});

  //    recessed window bands — two rows each on east(+x) + south(+y), tall windows
  B({x:3.78, y:0.95, w:0.04, d:1.45, h:0.55, z:zf+0.35, c:REC}); // east, lower
  B({x:3.78, y:0.95, w:0.04, d:1.45, h:0.55, z:zf+1.15, c:REC}); // east, upper
  B({x:0.95, y:2.53, w:2.1,  d:0.04, h:0.55, z:zf+0.35, c:REC}); // south, lower
  B({x:0.95, y:2.53, w:2.1,  d:0.04, h:0.55, z:zf+1.15, c:REC}); // south, upper

  //    slim stone cornice/parapet capping the block
  B({x:0.55, y:0.5, w:3.3, d:2.1, h:0.16, z:2.5, c:STONE});

  // 4. coin stacks flanking the front (forward of the block, painted late)
  [[3.95,0.9],[3.95,2.2]].forEach(function(p){
    for(var i=0;i<3;i++) C({cx:p[0], cy:p[1], r:0.3, h:0.16, z:zf+i*0.16});
  });

  // 5. ACCENT — a big orange coin lying proud on the roof centre (the one orange)
  C({cx:2.35, cy:1.5, r:0.52, h:0.17, z:2.66, c:COLO});
  return g;
}

function build_rwas(parent,ox,oy,bz){
  var g=el('g',{'class':'comp',id:'comp-rwas'},parent);
  function B(o){ o.x+=ox; o.y+=oy; o.z=(o.z||0)+bz; box(g,o); }
  function C(o){ o.cx+=ox; o.cy+=oy; o.z=(o.z||0)+bz; cyl(g,o); }
  function pt(x,y,z){ return [x+ox, y+oy, z+bz]; }

  var glass = {t:'#aeb4b2', e:'#9ea4a2', s:'#8f9593'}; // dark north-light glazing

  // 1. base slab (far back, smallest x+y) — append first
  B({x:0.2, y:0.2, w:4.4, d:3.0, h:0.3, z:0});

  // 2. warehouse body — solid broad block, top at z1.8
  B({x:0.5, y:0.5, w:3.8, d:2.4, h:1.5, z:0.3});

  // 3. orange roll-up loading-bay door — the accent, on the east (front) wall
  //    body east wall is at x=0.5+3.8=4.3; sit the thin box just on it (x4.22)
  B({x:4.22, y:1.25, w:0.14, d:1.0, h:1.15, z:0.3, c:COLO});

  // 4. SAWTOOTH ROOF — 4 teeth marching along +x, each spanning full y-depth.
  //    Per tooth (start xi, width tw=0.95): vertical glazed riser (east-facing)
  //    then a sloped top dropping to the next valley. Append far (small xi) -> near.
  var tw=0.95, y0=0.5, y1=2.9, zV=1.8, zC=2.5;
  [0.5, 1.45, 2.4, 3.35].forEach(function(xi){
    // riser: glazed north-light, east(+x)-facing, from valley up to crest
    quad(g, pt(xi,y0,zV), pt(xi,y1,zV), pt(xi,y1,zC), pt(xi,y0,zC), glass.e, 'fe');
    // slope: crest down to next valley, up-facing
    quad(g, pt(xi,y0,zC), pt(xi,y1,zC), pt(xi+tw,y1,zV), pt(xi+tw,y0,zV), COL.t, 'ft');
    // south end-cap: the triangular tooth profile on the +y side — closes the open roof side
    tri(g, pt(xi,y1,zV), pt(xi,y1,zC), pt(xi+tw,y1,zV), COL.s, 'fs');
  });

  return g;
}

function build_looping(parent,ox,oy,bz){
  var g=el('g',{'class':'comp',id:'comp-looping'},parent);
  function pt(x,y,z){ return [x+ox, y+oy, z+bz]; }

  // ---- 0. ground pad — low cream base (painted first, well behind everything)
  box(g,{x:0.35+ox, y:0.25+oy, w:3.4, d:3.5, h:0.2, z:0+bz});

  // ---- helix parameters
  var cx=2.0, cy=1.8;        // centre of the loop
  var R=1.35, wd=0.5;        // centreline radius, ramp width
  var ri=R-wd/2, ro=R+wd/2;  // inner / outer edge radii
  var N=30;                  // segments
  var turns=1.15;            // ~1 to 1.25 turns
  var t0=Math.PI*0.5;        // start angle: near-front, by the on-ramp
  var z0=0.2, z1=1.8;        // climb from ground to top
  var skirt=0.3;             // fascia drop
  var TWO=Math.PI*2;

  // angle/height/edge points at parameter u in [0..1]
  function ring(u){
    var t=t0 + u*turns*TWO;
    var z=z0 + (z1-z0)*u;
    return {
      t:t, z:z,
      ix:cx+ri*Math.cos(t), iy:cy+ri*Math.sin(t),   // inner edge
      ox:cx+ro*Math.cos(t), oy:cy+ro*Math.sin(t)    // outer edge
    };
  }

  var ringPts=[];
  for(var i=0;i<=N;i++) ringPts.push(ring(i/N));

  // ---- collect EVERY piece into one list, each tagged with depth=(midx+midy).
  //      Larger (x+y) is nearer the camera (down toward front), so ascending
  //      depth = back-to-front. type 'box'/'cyl' carry their args; 'seg' carries
  //      the two ring points and is expanded into top + skirt + underside quads.
  var pieces=[];
  function addBox(o,dx,dy){ pieces.push({k:'box', o:o, depth:dx+dy}); }
  function addCyl(o,dx,dy){ pieces.push({k:'cyl', o:o, depth:dx+dy}); }

  // ---- 1. support PIERS — cream columns from z=0 to just under the ramp.
  //      Placed at several u around the loop, under the OUTER edge (visible side).
  //      Pier top stops ~0.04 below the deck so the deck visually caps it.
  var pierU=[0.28, 0.46, 0.64, 0.82, 1.0];
  pierU.forEach(function(u){
    var r=ring(u);
    var topZ=r.z-skirt-0.02;                 // reach the underside of the fascia
    if(topZ<0.25) return;                    // skip where ramp is near the ground
    // square cream column under the outer edge
    var s=0.22, px=r.ox-s/2, py=r.oy-s/2;
    addBox({x:px+ox, y:py+oy, w:s, d:s, h:topZ, z:0+bz}, r.ox, r.oy);
  });
  // the TALLEST pier sits right under the high end (u=1) — make it read as the
  // post the top of the ramp lands on; give it a touch more girth.
  var hi=ring(1.0);
  addBox({x:hi.ox-0.14+ox, y:hi.oy-0.14+oy, w:0.28, d:0.28, h:hi.z-skirt-0.02, z:0+bz}, hi.ox, hi.oy);

  // ---- 2. ON-RAMP — a short cream-edged orange deck meeting the ground pad at
  //      the helix start (u=0). It runs from the pad up into the first ring.
  //      Built as one extra segment from a ground anchor to ringPts[0].
  var start=ringPts[0];
  // ground anchor: pull the start edge outward + down to the pad surface (z=0.2)
  var anq=0.30;  // how far the on-ramp reaches out from the start (stay on pad)
  var dirx=Math.cos(start.t), diry=Math.sin(start.t);
  var aInX=cx+ri*Math.cos(start.t)+dirx*anq, aInY=cy+ri*Math.sin(start.t)+diry*anq;
  var aOutX=cx+ro*Math.cos(start.t)+dirx*anq, aOutY=cy+ro*Math.sin(start.t)+diry*anq;
  // on-ramp ring point, anchored at pad height
  var ramp0={ ix:aInX, iy:aInY, ox:aOutX, oy:aOutY, z:0.2 };
  // expand on-ramp as a seg from ramp0(ground) -> start(first ring)
  pushSeg(ramp0, start);

  // ---- 3. DECK SEGMENTS — orange top + cream skirt + cream underside.
  for(i=0;i<N;i++) pushSeg(ringPts[i], ringPts[i+1]);

  // pushSeg: add a deck quad-trio between ring points a and b as ONE piece,
  // depth keyed on the segment centroid so it sorts correctly among piers.
  function pushSeg(a,b){
    var mx=(a.ix+a.ox+b.ix+b.ox)/4;
    var my=(a.iy+a.oy+b.iy+b.oy)/4;
    pieces.push({k:'seg', a:a, b:b, depth:mx+my});
  }

  // ---- APPEND back-to-front. Painter's algorithm on midpoint depth ascending.
  pieces.sort(function(p,q){ return p.depth - q.depth; });

  pieces.forEach(function(p){
    if(p.k==='box'){ box(g,p.o); return; }
    if(p.k==='cyl'){ cyl(g,p.o); return; }
    // seg: cream underside, cream outer skirt, then orange top (top paints last)
    var a=p.a, b=p.b;
    // underside (cream) — the soffit, at the skirt-bottom plane
    quad(g, pt(a.ix,a.iy,a.z-skirt), pt(a.ox,a.oy,a.z-skirt),
            pt(b.ox,b.oy,b.z-skirt), pt(b.ix,b.iy,b.z-skirt), COL.s, 'fs');
    // outer skirt / fascia (cream) — drop in z along the outer edge
    quad(g, pt(a.ox,a.oy,a.z), pt(b.ox,b.oy,b.z),
            pt(b.ox,b.oy,b.z-skirt), pt(a.ox,a.oy,a.z-skirt), COL.e, 'fe');
    // orange ramp TOP surface — the single accent, painted on top
    quad(g, pt(a.ix,a.iy,a.z), pt(a.ox,a.oy,a.z),
            pt(b.ox,b.oy,b.z), pt(b.ix,b.iy,b.z), COLO.t, 'ft');
  });

  return g;
}
