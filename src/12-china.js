
// Chinese building vocabulary shared by the towers, the pass and the props.
Object.assign(COL, {
  lacq: C(0x8e2a1e), lacqD: C(0x5a1a14), lacqL: C(0xb23a26), tile: C(0x3d4854), tileL: C(0x5a6876), tileD: C(0x272f3a),
  ram: C(0x9a8462), ramD: C(0x6e5c44), paper: C(0xe8452a), jade: C(0x4fae8c), plaster: C(0xb9ae98), bronzeG: C(0x4f7a5e),
});

function cnQuadUp(S, a, b, c, d, col, layer, rough, o) {
  const ux = b[0] - a[0], uz = b[2] - a[2], vx = c[0] - a[0], vz = c[2] - a[2];
  if (uz * vx - ux * vz < 0) S.quad(a, d, c, b, col, layer, rough, o); else S.quad(a, b, c, d, col, layer, rough, o);
}

// A hipped roof with a sagging slope and upturned corners. a, b: half size at the eave. ridge: half length of the ridge along x
// (0 gives a pyramid). t0 > 0 leaves the middle open, which makes a skirt eave around a tower body.
function cnRoof(S, o) {
  const x0 = o.x || 0, y0 = o.y || 0, z0 = o.z || 0, a = o.a, b = o.b === undefined ? o.a : o.b, h = o.h, ridge = o.ridge || 0, lift = o.lift === undefined ? .16 : o.lift;
  const t0 = o.t0 || 0, n = o.n || 4, m = o.m || 4, sag = o.sag === undefined ? 1.7 : o.sag, col = o.col || COL.tile, layer = o.layer === undefined ? L_SLATE : o.layer, gable = ridge >= a - 1e-4;
  const cs = Math.cos(o.ry || 0), sn = Math.sin(o.ry || 0), start = S.P.length;
  const W = (lx, ly, lz) => [x0 + lx * cs + lz * sn, y0 + ly, z0 - lx * sn + lz * cs];
  const hx = t => ridge + (a - ridge) * t, hz = t => b * t, yy = (t, s) => h * Math.pow(Math.max(0, 1 - t), sag) + lift * t * t * Math.pow(Math.abs(s), 2.6);
  const P = (face, t, s) => face === 0 ? W(s * hx(t), yy(t, s), hz(t)) : face === 1 ? W(-s * hx(t), yy(t, s), -hz(t)) : face === 2 ? W(hx(t), yy(t, s), -s * hz(t)) : W(-hx(t), yy(t, s), s * hz(t));
  for (let f = 0; f < (gable ? 2 : 4); f++) for (let i = 0; i < n; i++) {
    const ta = t0 + (1 - t0) * i / n, tb = t0 + (1 - t0) * (i + 1) / n, c = mulC(col, (i & 1 ? .86 : 1.04) * (.9 + .16 * soupRng()));
    for (let j = 0; j < m; j++) { const sa = -1 + 2 * j / m, sb = -1 + 2 * (j + 1) / m; cnQuadUp(S, P(f, ta, sa), P(f, ta, sb), P(f, tb, sb), P(f, tb, sa), c, layer, .78, { uvs: .5 }); }
  }
  S._double(start);
  if (o.plain) return;
  const dk = o.ridgeCol || mulC(col, .62), rr0 = o.rr || Math.max(.03, a * .045);
  if (t0 === 0) {
    if (ridge > 0) {
      S.seg(W(-ridge, h + rr0 * .5, 0), W(ridge, h + rr0 * .5, 0), rr0 * 1.25, rr0 * 1.25, dk, { n: 4, l: L_SLATE });
      for (const sg of [-1, 1]) S.seg(W(sg * ridge * .96, h + rr0, 0), W(sg * (ridge + rr0 * 1.6), h + rr0 * 4.2, 0), rr0 * 1.5, rr0 * .5, dk, { n: 4, l: L_SLATE });
    } else if (o.finial !== false) {
      S.cyl(rr0 * 1.6, rr0 * 2, x0, y0 + h + rr0, z0, dk, { n: 6, l: L_SLATE }); S.sph(rr0 * 1.7, x0, y0 + h + rr0 * 3.2, z0, o.finial || COL.brass, { w: 6, h: 4, smooth: false, l: L_METAL, rough: .4 });
      S.cone(rr0 * .8, rr0 * 3, x0, y0 + h + rr0 * 5.6, z0, o.finial || COL.brass, { n: 4, l: L_METAL, rough: .4 });
    }
  }
  if (!gable) for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    let p = null;
    for (let i = 0; i <= n; i++) { const t = t0 + (1 - t0) * i / n, q = W(sx * hx(t), yy(t, 1) + rr0 * .5, sz * hz(t)); if (p) S.seg(p, q, rr0, rr0, dk, { n: 4, l: L_SLATE }); p = q; }
    const e = W(sx * (a + rr0 * 2.4), yy(1, 1) + rr0 * 3.4, sz * (b + rr0 * 2.4)); S.seg(p, e, rr0, rr0 * .35, dk, { n: 4, l: L_SLATE });
  } else for (const sz of [-1, 1]) for (const sx of [-1, 1]) {
    let p = null;
    for (let i = 0; i <= n; i++) { const t = i / n, q = W(sx * a, yy(t, 1) + rr0 * .4, sz * hz(t)); if (p) S.seg(p, q, rr0 * .9, rr0 * .9, dk, { n: 4, l: L_SLATE }); p = q; }
  }
}

// Bracket band under an eave: a dark beam with small red blocks.
function cnBrackets(S, x, y, z, a, b, o = {}) {
  const c = o.col || COL.lacq, d = o.dark || COL.lacqD, hgt = o.h || .12;
  for (const sg of [-1, 1]) { S.box(a * 2, hgt, .08, x, y, z + sg * b, d, { l: L_WOOD }); S.box(.08, hgt, b * 2, x + sg * a, y, z, d, { l: L_WOOD }); }
  const nx = Math.max(2, Math.round(a * 2 / .34)), nz = Math.max(2, Math.round(b * 2 / .34));
  for (let i = 0; i <= nx; i++) for (const sg of [-1, 1]) S.box(.09, hgt * .8, .14, x - a + 2 * a * i / nx, y + hgt * .8, z + sg * (b + .03), c, { l: L_WOOD });
  for (let i = 1; i < nz; i++) for (const sg of [-1, 1]) S.box(.14, hgt * .8, .09, x + sg * (a + .03), y + hgt * .8, z - b + 2 * b * i / nz, c, { l: L_WOOD });
}

// A row of merlons from (x0,z0) to (x1,z1).
function cnMerlons(S, x0, z0, x1, z1, y, o = {}) {
  const len = Math.hypot(x1 - x0, z1 - z0), n = Math.max(1, Math.round(len / (o.pitch || .46))), ang = Math.atan2(z1 - z0, x1 - x0), w = o.w || .26, hh = o.h || .3, d = o.d || .16, rng = o.rng || soupRng;
  for (let i = 0; i < n; i++) {
    if (o.skip && rng() < o.skip) continue;
    const u = (i + .5) / n; S.box(w, hh, d, lerp(x0, x1, u), y + hh / 2, lerp(z0, z1, u), o.col || mixC(COL.stoneD, COL.stoneL, rng()), { l: L_MASON, r: [0, -ang, 0] });
  }
}

// A hanging paper lantern. Returns the point where its flame sits.
function cnLantern(S, x, y, z, s = 1) {
  S.cyl(.045 * s, .03 * s, x, y + .14 * s, z, COL.brass, { n: 6, l: L_METAL }); S.cyl(.1 * s, .08 * s, x, y + .08 * s, z, COL.paper, { n: 8, rt: .6, emis: .5, jit: 0 });
  S.cyl(.1 * s, .1 * s, x, y - .01 * s, z, COL.paper, { n: 8, emis: .75, jit: 0 }); S.cyl(.06 * s, .08 * s, x, y - .1 * s, z, COL.paper, { n: 8, rt: 1.66, emis: .5, jit: 0 });
  S.cyl(.045 * s, .03 * s, x, y - .155 * s, z, COL.brass, { n: 6, l: L_METAL }); S.seg([x, y - .17 * s, z], [x, y - .34 * s, z], .012 * s, .02 * s, COL.gold, { n: 3, sway: .3 });
  return [x, y - .02 * s, z];
}

// A tall narrow war banner hung from a crossbar, with a spear tip.
function cnBanner(S, x, y0, y1, z, col, rng, o = {}) {
  const w = o.w || .42, len = o.len || Math.min(1.5, (y1 - y0) * .62), T = new Soup();
  S.seg([x, y0, z], [x, y1, z], .04, .028, COL.woodD, { l: L_WOOD, n: 5 }); S.cone(.045, .2, x, y1 + .1, z, COL.steel, { n: 4, l: L_METAL, rough: .4 });
  S.ico(.07, x, y1 - .02, z, COL.lacqL, { d: 0, sc: [1, 1.4, 1], sway: .2 });
  S.seg([x - .04, y1 - .16, z], [x + w + .06, y1 - .16, z], .022, .022, COL.woodD, { l: L_WOOD, n: 4 });
  clothPanel(T, { x0: .03, x1: w, yTop: 0, len, z: 0, col, col2: o.col2 === undefined ? mulC(COL.gold, .7) : o.col2, rng, nx: 3, ny: Math.max(4, Math.round(len / .2)), rag: o.rag === undefined ? .25 : o.rag, sway: o.sway === undefined ? 1 : o.sway });
  S.merge(T, { p: [x, y1 - .18, z], ao: null });
}
