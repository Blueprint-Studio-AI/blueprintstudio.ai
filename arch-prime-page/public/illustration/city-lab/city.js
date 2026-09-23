/* ============================================================
   Shared finance-city assembly — the SINGLE source for the district layout.
   buildFinanceCity(parent, baseZ) places streets, the dashed orange value-
   network, the 7 hero buildings (buildings.js) + filler buildings + trees onto
   `parent`, sitting on a slab whose top is at z=baseZ. It does NOT draw the slab
   itself (each host draws its own substrate).
   Used by BOTH district.html (standalone) and the ported iso-scroll animation,
   so a layout change here applies to both. Relies on kit.js globals
   (P, el, box, cyl, COLO) + buildings.js (build_<id>).
   Each placed object's wrapper carries data-cb="comp-<id>" (heroes) or "bg"
   (fillers/trees) so a host can focus-dim everything but the hovered building.
   ============================================================ */
function buildFinanceCity(parent, baseZ){
  var SL = {x:3, y:2, w:28, d:20};
  var Z = baseZ;
  var ROAD={t:'#e7e2cb',e:'#e7e2cb',s:'#e7e2cb'},
      FILL1={t:'#e9e5d0',e:'#dad6bf',s:'#cbc7af'}, FILL2={t:'#ded9c5',e:'#cfcab4',s:'#c0bba4'},
      GREYB={t:'#d9d8ca',e:'#cac9ba',s:'#bbb9ab'}, WINc={t:'#cbc6ad',e:'#beb99f',s:'#b0ab90'},
      TREEc={t:'#93a06a',e:'#808d5a',s:'#6f7c4b'}, TRUNKc={t:'#b39a76',e:'#a48b68',s:'#957c5a'};

  // streets
  box(parent,{x:SL.x, y:9.2, w:SL.w, d:0.9, h:0.04, z:Z, c:ROAD});
  box(parent,{x:16.4, y:SL.y, w:0.9, d:SL.d, h:0.04, z:Z, c:ROAD});

  // DASHED orange value-network (segments every 0.5 grid units), node at each building
  function dash(x,y,w,d){ box(parent,{x:x,y:y,w:w,d:d,h:0.05,z:Z,c:COLO}); }
  function hl(x1,x2,y){ var a=Math.min(x1,x2),b=Math.max(x1,x2),x; for(x=a;x<b-0.05;x+=0.5){ dash(x,y-0.05,Math.min(0.32,b-x),0.1); } }
  function vl(y1,y2,x){ var a=Math.min(y1,y2),b=Math.max(y1,y2),y; for(y=a;y<b-0.05;y+=0.5){ dash(x-0.05,y,0.1,Math.min(0.32,b-y)); } }
  function nd(x,y){ box(parent,{x:x-0.17,y:y-0.17,w:0.34,d:0.34,h:0.07,z:Z,c:COLO}); }
  function tp(x,y,s){ vl(s,y,x); nd(x,y); }
  var BST=8.5, FST=15.0;
  hl(6.8,23.0,BST); hl(5.4,22.2,FST); vl(BST,FST,16.5);
  tp(7.56,7.06,BST); tp(13.21,8.26,BST); tp(22.37,7.05,BST);
  tp(5.96,14.89,FST); tp(12.0,14.18,FST); tp(21.54,14.22,FST); tp(15.14,15.3,FST);

  // placement (transform translate+scale == grid-place a k-scaled building)
  function place(fn,gx,gy,k){ var t=P(gx,gy,Z);
    var w=el('g',{transform:'translate('+t[0].toFixed(2)+','+t[1].toFixed(2)+') scale('+k+')'},parent); fn(w,0,0,0);
    var cmp=w.querySelector('.comp'); w.setAttribute('data-cb', cmp?cmp.id:'bg'); w.style.transition='opacity .18s ease'; }
  function fbox(p,w,d,h,c,win){ box(p,{x:0,y:0,w:w,d:d,h:h,z:0,c:c});
    if(win){ for(var z=0.35;z+0.4<h;z+=0.62){ box(p,{x:w-0.02,y:0.25,w:0.04,d:d-0.5,h:0.32,z:z,c:WINc}); box(p,{x:0.25,y:d-0.02,w:w-0.5,d:0.04,h:0.32,z:z,c:WINc}); } } }
  function tree(p){ box(p,{x:0.32,y:0.32,w:0.16,d:0.16,h:0.36,z:0,c:TRUNKc});
    cyl(p,{cx:0.4,cy:0.4,r:0.5,h:0.4,z:0.3,c:TREEc}); cyl(p,{cx:0.4,cy:0.4,r:0.34,h:0.4,z:0.62,c:TREEc}); cyl(p,{cx:0.4,cy:0.4,r:0.18,h:0.36,z:0.92,c:TREEc}); }

  var objs=[]; function add(gx,gy,k,fn){ objs.push([gx,gy,k,fn]); }
  // HERO buildings
  add(5.5,4.0,0.85,build_lend); add(4.0,12.0,0.85,build_dexs); add(12.0,6.0,0.48,build_prime);
  add(10.0,11.0,0.86,build_vaults); add(20.5,4.5,0.85,build_stables); add(13.5,15.5,0.80,build_looping);
  add(19.5,11.5,0.85,build_rwas);
  // FILLER buildings — varied heights for skyline rhythm (tall back towers -> low front blocks; all below Prime)
  add(2.6, 4.8, 0.85,function(p){fbox(p,2.0,1.9,4.6,FILL1,1);});   // back-left tower
  add(14.6,4.2, 0.85,function(p){fbox(p,1.5,1.9,5.0,FILL2,1);});   // tall tower beside Prime
  add(18.2,6.6, 0.85,function(p){fbox(p,1.3,1.3,3.6,FILL1,1);});   // back-right tower
  add(25.6,10.8,0.85,function(p){fbox(p,1.9,1.9,4.2,FILL2,1);});   // right tower
  add(14.9,6.4, 0.85,function(p){fbox(p,1.4,1.4,2.0,GREYB,1);});   // mid block
  add(8.6, 18.4,0.85,function(p){fbox(p,1.5,1.5,2.6,GREYB,1);});   // front mid block
  add(26.2,16.6,0.85,function(p){fbox(p,1.3,1.3,3.0,FILL2,1);});   // front-right
  add(24.6,5.6, 0.85,function(p){fbox(p,2.2,2.4,1.3,GREYB,0);});   // low industrial shed
  add(3.2, 17.4,0.85,function(p){fbox(p,2.3,1.7,1.2,FILL1,0);});   // low front block
  add(22.2,16.2,0.85,function(p){fbox(p,1.9,2.1,1.5,FILL1,1);});   // low front block
  // TREES
  [[2.4,11.4],[15.4,8.6],[16.2,12.8],[7.0,15.0],[11.6,18.6],[17.4,18.0],
   [24.0,9.0],[27.2,9.4],[20.2,16.6],[3.4,15.6],[6.6,9.0],[19.0,9.0]]
   .forEach(function(t){ add(t[0],t[1],0.7,tree); });

  objs.sort(function(a,b){ return (a[0]+a[1]) - (b[0]+b[1]); });
  objs.forEach(function(o){ place(o[3],o[0],o[1],o[2]); });
}
