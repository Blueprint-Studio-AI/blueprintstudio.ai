/* ============================================================
   Shared isometric kit for the finance-city building lab.
   The projection + primitives are byte-for-byte the same as the
   real prototype ("Layer cake — iso scroll prototype.html"), so a
   building authored here drops straight into Layer 3 unchanged.
   Each iteration page includes this file then calls mountBuilding().
   ============================================================ */
var NS='http://www.w3.org/2000/svg';
var K=13, KZ=12, CX=Math.cos(Math.PI/6)*K, CY=Math.sin(Math.PI/6)*K;
var R2=Math.SQRT2;
function P(x,y,z){ return [(x-y)*CX, (x+y)*CY - z*KZ]; }
function el(t,attrs,parent){ var e=document.createElementNS(NS,t);
  for(var k in attrs) e.setAttribute(k,attrs[k]); if(parent)parent.appendChild(e); return e; }
function pts(arr){ return arr.map(function(p){return p[0].toFixed(2)+','+p[1].toFixed(2);}).join(' '); }

var COL  = { t:'#ffffff', e:'#eae7d6', s:'#dcd8c4' };   // default building
var COLB = { t:'#f4f1de', e:'#e2decb', s:'#d3cfba' };   // substrate / ground
var COLO = { t:'#ec641d', e:'#cf5418', s:'#b84a14' };   // orange accent

/* ---- primitives (verbatim from the prototype) ---- */
function box(parent,o){
  var c = o.c || COL, z = o.z||0, g = el('g', o.cls?{'class':o.cls}:{}, parent);
  var x=o.x,y=o.y,w=o.w,d=o.d,h=o.h;
  el('polygon',{points:pts([P(x+w,y,z+h),P(x+w,y+d,z+h),P(x+w,y+d,z),P(x+w,y,z)]),fill:c.e,'class':'fe'},g);
  el('polygon',{points:pts([P(x,y+d,z+h),P(x+w,y+d,z+h),P(x+w,y+d,z),P(x,y+d,z)]),fill:c.s,'class':'fs'},g);
  el('polygon',{points:pts([P(x,y,z+h),P(x+w,y,z+h),P(x+w,y+d,z+h),P(x,y+d,z+h)]),fill:c.t,'class':'ft'},g);
  return g;
}
function cyl(parent,o){
  var c=o.c||COL, z=o.z||0, g=el('g',o.cls?{'class':o.cls}:{},parent);
  var rx=o.r*R2*CX, ry=o.r*R2*CY;
  var top=P(o.cx,o.cy,z+o.h), bot=P(o.cx,o.cy,z);
  el('path',{d:'M'+(bot[0]-rx).toFixed(2)+' '+top[1].toFixed(2)+
    ' L'+(bot[0]-rx).toFixed(2)+' '+bot[1].toFixed(2)+
    ' A'+rx.toFixed(2)+' '+ry.toFixed(2)+' 0 0 0 '+(bot[0]+rx).toFixed(2)+' '+bot[1].toFixed(2)+
    ' L'+(bot[0]+rx).toFixed(2)+' '+top[1].toFixed(2)+' Z',
    fill:c.e,'class':'fe cylbody'},g);
  el('ellipse',{cx:top[0],cy:top[1],rx:rx,ry:ry,fill:c.t,'class':'ft'},g);
  return g;
}
/* ---- extra helpers for richer architecture ---- */
function tri(parent,a,b,c,fill,cls){
  return el('polygon',{points:pts([P.apply(null,a),P.apply(null,b),P.apply(null,c)]),fill:fill,'class':cls},parent);
}
function quad(parent,a,b,c,d,fill,cls){
  return el('polygon',{points:pts([P.apply(null,a),P.apply(null,b),P.apply(null,c),P.apply(null,d)]),fill:fill,'class':cls},parent);
}
function label(parent,x,y,z,txt,anchor){
  var p=P(x,y,z);
  var t=el('text',{x:p[0],y:p[1],'class':'isolabel','text-anchor':anchor||'middle'},parent);
  t.textContent=txt; return t;
}
/* project flat px-space SVG markup onto an iso top face (verbatim from prototype) */
function onTop(parent,x,y,z,wUnits,viewW,markup){
  var t=wUnits/viewW, o=P(x,y,z);
  var g=el('g',{transform:'matrix('+(t*CX).toFixed(3)+','+(t*CY).toFixed(3)+','+(-t*CX).toFixed(3)+','+(t*CY).toFixed(3)+','+o[0].toFixed(2)+','+o[1].toFixed(2)+')'},parent);
  g.innerHTML=markup; return g;
}
/* a true circle of grid-radius r, correctly foreshortened onto the east (+x)
   vertical face at grid (xF,yc,zc). For clocks / roundels / facade windows.
   The matrix columns are P()'s +y and +z screen deltas, so the circle lands
   in the face's plane. Stroke is kept crisp via non-scaling-stroke. */
function faceCircleX(parent,xF,yc,zc,r,fill,cls){
  var o=P(xF,yc,zc);
  var g=el('g',{transform:'matrix('+(-CX).toFixed(3)+','+CY.toFixed(3)+',0,'+(-KZ).toFixed(3)+','+o[0].toFixed(2)+','+o[1].toFixed(2)+')'},parent);
  var a={cx:0,cy:0,r:r,fill:fill,stroke:'rgba(24,24,24,.22)','stroke-width':0.8,'vector-effect':'non-scaling-stroke'};
  if(cls)a['class']=cls;
  el('circle',a,g); return g;
}
/* returns a <g> whose local coords (u,v) map to grid offsets (Δy, Δz) on the
   east(+x) face at (xF,yc,zc). Draw <circle>/<line>/<rect> into it (bolts, dials,
   wheel spokes) in local units and they land correctly foreshortened on the face. */
function faceGroupX(parent,xF,yc,zc){
  var o=P(xF,yc,zc);
  return el('g',{transform:'matrix('+(-CX).toFixed(3)+','+CY.toFixed(3)+',0,'+(-KZ).toFixed(3)+','+o[0].toFixed(2)+','+o[1].toFixed(2)+')'},parent);
}
/* a clock / medallion with real depth on the east(+x) face: a tiered bezel
   that steps OUT toward the camera (+x), so it reads 3D instead of painted-on.
   faceFill is the raised accent face; depth ≈ 0.2–0.3 grid units. */
function faceClockX(parent,xF,yc,zc,r,depth,faceFill){
  faceCircleX(parent, xF,             yc, zc, r+0.06, COL.s);   // rim ring, flush on the wall
  faceCircleX(parent, xF+depth*0.5,   yc, zc, r+0.02, COL.e);   // bezel, half-proud
  faceCircleX(parent, xF+depth,       yc, zc, r,      faceFill); // raised face (the accent)
  return parent;
}
/* a solid cylindrical DRUM protruding from the east(+x) face — a true iso volume
   (shaded side + lit face), the vertical-face analogue of a cyl() coin. Built as a
   dense stack of discs swept along +x so the silhouette + side read as a real cylinder.
   c is a {t,e,s} colour set (default orange): face uses c.t, side uses c.e. */
function faceDrumX(parent,xWall,yc,zc,r,depth,c){
  c=c||COLO; var N=12, i, x, o, g;
  for(i=0;i<N;i++){                       // body: stacked discs (no stroke) = the shaded side
    x=xWall + depth*i/N; o=P(x,yc,zc);
    g=el('g',{transform:'matrix('+(-CX).toFixed(3)+','+CY.toFixed(3)+',0,'+(-KZ).toFixed(3)+','+o[0].toFixed(2)+','+o[1].toFixed(2)+')'},parent);
    el('circle',{cx:0,cy:0,r:r,fill:c.e,stroke:(i?'none':'rgba(24,24,24,.22)'),'stroke-width':0.8,'vector-effect':'non-scaling-stroke'},g);
  }
  faceCircleX(parent, xWall+depth, yc, zc, r, c.t);  // lit front face (with outline)
  return parent;
}

/* ---- mount one building, centred, with a ground tile + hover-highlight ---- */
function mountBuilding(buildFn, opts){
  opts = opts || {};
  var svg = document.getElementById('iso');
  var vb = opts.viewBox ? opts.viewBox.split(/\s+/).map(Number) : null;
  if(opts.viewBox) svg.setAttribute('viewBox', opts.viewBox);
  // size the svg to CONTAIN within the viewport (grow or shrink, preserve ratio)
  // so tall buildings fit fully instead of overflowing.
  function fit(){
    if(!vb) return;
    var s = Math.min(window.innerWidth*0.94/vb[2], window.innerHeight*0.9/vb[3]);
    svg.setAttribute('width', Math.round(vb[2]*s));
    svg.setAttribute('height', Math.round(vb[3]*s));
  }
  fit(); window.addEventListener('resize', fit);
  var world = el('g', {}, svg);
  if(opts.ground !== false) box(world, opts.ground || {x:-0.9,y:-0.9,w:6.4,d:5.2,h:0.3,z:-0.3,c:COLB});
  var comp = buildFn(world, 0, 0, 0);
  if(comp && comp.classList){
    comp.addEventListener('mouseenter',function(){comp.classList.add('sel');});
    comp.addEventListener('mouseleave',function(){comp.classList.remove('sel');});
  }
  return comp;
}
