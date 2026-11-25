
const _segq = new THREE.Quaternion(), _segd = new THREE.Vector3(), _upv = new THREE.Vector3(0, 1, 0);
Soup.prototype.seg = function (a, b, r0, r1, c, o = {}) {
  _segd.set(b[0] - a[0], b[1] - a[1], b[2] - a[2]); const len = _segd.length(); if (len < 1e-5) return this; _segd.multiplyScalar(1 / len);
  _segq.setFromUnitVectors(_upv, _segd);
  o.q = _segq; o.s = [r0, len, r0]; o.p = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2]; o.c = c;
  return this.add(gCyl(o.n || 6, Math.round(clamp(r1 / r0, 0, 2.5) * 10) / 10), o);
};

function clothPanel(S, o) {
  const nx = o.nx || 4, ny = o.ny || 6, rng = o.rng, sway = o.sway === undefined ? .8 : o.sway;
  const yAt = j => o.yTop - o.len * j / ny, sw = j => Math.pow(j / ny, 1.3) * sway;
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    if (j >= ny - 2 && rng() < (o.rag === undefined ? .4 : o.rag)) continue;
    if (j === ny - 1 && (i & 1)) continue;
    const xa = lerp(o.x0, o.x1, i / nx), xb = lerp(o.x0, o.x1, (i + 1) / nx);
    const emblem = o.col2 && i >= 1 && i < nx - 1 && j >= 1 && j <= 2;
    const c = mulC(emblem ? o.col2 : o.col, .78 + .3 * rng());
    const q = [[xa, yAt(j), sw(j)], [xb, yAt(j), sw(j)], [xb, yAt(j + 1), sw(j + 1)], [xa, yAt(j + 1), sw(j + 1)]];
    for (const [order, nz] of [[[0, 3, 2, 0, 2, 1], 1], [[0, 1, 2, 0, 2, 3], -1]]) for (const k of order) S.v(q[k][0], q[k][1], o.z, 0, 0, nz, c[0], c[1], c[2], q[k][0] * .5, q[k][1] * .5, L_CLOTH, .95, q[k][2], 0);
  }
}

const PROP = {
  barrel(S, x, y, z, s = 1, rng) {
    const c = mulC(COL.wood, .8 + .3 * rng());
    S.cyl(.2 * s, .27 * s, x, y + .135 * s, z, c, { n: 8, l: L_WOOD, rt: 1.16 });
    S.cyl(.232 * s, .27 * s, x, y + .405 * s, z, c, { n: 8, l: L_WOOD, rt: .86 });
    for (const h of [.06, .27, .48]) S.cyl((h === .27 ? .242 : .215) * s, .035 * s, x, y + h * s, z, COL.iron, { n: 8, l: L_METAL, rough: .6 });
  },
  crate(S, x, y, z, s, rng, ry = 0) {
    const c = mulC(COL.woodL, .75 + .3 * rng()), o = () => ({ l: L_WOOD, r: [0, ry, 0] });
    S.box(s, s, s, x, y + s / 2, z, c, o());
    for (const [dx, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) S.box(s * .12, s * 1.04, s * .12, x + (dx * Math.cos(ry) + dz * Math.sin(ry)) * s * .47, y + s / 2, z + (-dx * Math.sin(ry) + dz * Math.cos(ry)) * s * .47, COL.woodD, o());
    S.box(s * 1.04, s * .1, s * 1.04, x, y + s * .97, z, COL.woodD, o());
  },
  tree(S, rng, h, o = {}) {
    const bark = o.bark || mulC(COL.bark, .8 + .4 * rng());
    const branch = (a, d, len, r, depth) => {
      const b = [a[0] + d[0] * len, a[1] + d[1] * len, a[2] + d[2] * len], hot = o.tipEmis && depth >= 3;
      S.seg(a, b, r, r * .64, hot ? o.tip : bark, { l: L_WOOD, n: depth > 1 ? 4 : 6, sway: depth >= 2 ? .35 + depth * .15 : 0, emis: hot ? o.tipEmis : 0 });
      if (depth >= 4 || len < .3) return;
      const kids = depth === 0 ? rng.int(2, 3) : rng.int(1, 2);
      for (let k = 0; k < kids; k++) {
        const nd = [d[0] + rng.range(-1, 1), d[1] * .5 + rng.range(.05, .7), d[2] + rng.range(-1, 1)], l = Math.hypot(nd[0], nd[1], nd[2]);
        branch(b, [nd[0] / l, nd[1] / l, nd[2] / l], len * rng.range(.55, .8), r * .58, depth + 1);
      }
      if (depth < 2) { const nd = [d[0] + rng.range(-.3, .3), 1, d[2] + rng.range(-.3, .3)], l = Math.hypot(nd[0], nd[1], nd[2]); branch(b, [nd[0] / l, nd[1] / l, nd[2] / l], len * .72, r * .64, depth + 1); }
    };
    S.cyl(h * .12, .3, 0, .1, 0, bark, { n: 6, l: L_WOOD, rt: .7 });
    branch([0, .05, 0], [rng.range(-.15, .15), 1, rng.range(-.15, .15)], h * .42, h * .075, 0);
  },
  stump(S, rng) {
    S.cyl(.3, .45, 0, .2, 0, COL.bark, { n: 7, l: L_WOOD, rt: .8 }); S.cyl(.235, .04, 0, .44, 0, COL.woodL, { n: 7, l: L_WOOD });
    for (let k = 0; k < 3; k++) { const a = rng() * TAU; S.seg([Math.cos(a) * .2, .12, Math.sin(a) * .2], [Math.cos(a) * .6, -.05, Math.sin(a) * .6], .09, .04, COL.bark, { l: L_WOOD, n: 5 }); }
  },
  grave(S, rng) {
    const T = new Soup(), w = rng.range(.44, .62), h = rng.range(.62, 1.0), c = mixC(COL.stoneD, COL.stoneL, rng()), kind = rng.int(0, 3);
    if (kind === 0) { T.box(w, h * .8, .15, 0, h * .4, 0, c, { l: L_ROCK }); T.cyl(w / 2, .15, 0, h * .8, 0, c, { n: 8, l: L_ROCK, r: [HPI, 0, 0] }); }
    else if (kind === 1) { T.box(w * .62, h * 1.1, .13, 0, h * .55, 0, c, { l: L_ROCK }); T.box(w * .86, .1, .2, 0, h * 1.12, 0, mulC(c, 1.15), { l: L_ROCK }); T.box(w * .5, .08, .16, 0, h * 1.2, 0, c, { l: L_ROCK }); T.box(.07, h * .6, .14, 0, h * .6, .005, mulC(COL.lacq, .8), { jit: 0 }); }
    else if (kind === 2) { T.box(w, h * .9, .16, 0, h * .45, 0, c, { l: L_ROCK }); T.box(w * .7, .14, .16, 0, h * .95, 0, c, { l: L_ROCK }); T.box(w * 1.2, .12, .3, 0, .06, 0, mulC(c, .8), { l: L_ROCK }); }
    else { T.box(w * .9, h * .55, .15, 0, h * .27, 0, c, { l: L_ROCK }); T.box(w * .5, h * .2, .15, -w * .18, h * .62, 0, c, { l: L_ROCK, r: [0, 0, .3] }); }
    S.merge(T, { r: [rng.range(-.2, .2), rng.range(-.3, .3), rng.range(-.16, .16)], ao: [0, .4, .55] });
    S.ico(.5, 0, .0, -.55, mulC(COL.earthD, 1.1), { sc: [.95, .5, .95], l: L_DIRT, d: 1 });
  },
  cart(S, rng, broken) {
    const w = COL.wood, wd = COL.woodD, o = () => ({ l: L_WOOD });
    S.box(1.6, .08, .9, 0, .56, 0, w, o());
    for (const zz of [-.45, .45]) { S.box(1.6, .28, .06, 0, .74, zz, w, o()); for (const xx of [-.7, 0, .7]) S.box(.07, .4, .08, xx, .74, zz * 1.04, wd, o()); }
    S.box(.06, .28, .9, -.8, .74, 0, w, o());
    const wheel = (x, z, lean) => {
      const T = new Soup();
      T.add(gTorus(10, .13, 4), { s: .4, c: wd, l: L_WOOD }); T.cyl(.07, .14, 0, 0, 0, COL.iron, { n: 6, l: L_METAL, r: [HPI, 0, 0] });
      for (let k = 0; k < 4; k++) T.box(.74, .05, .05, 0, 0, 0, w, { l: L_WOOD, r: [0, 0, k * PI / 4] });
      S.merge(T, { p: [x, lean ? .12 : .4, z], r: [lean ? 1.35 : 0, 0, lean ? .3 : 0] });
    };
    wheel(-.25, .56, false); if (!broken) wheel(-.25, -.56, false); else wheel(.5, -1.0, true);
    S.box(.08, .08, 1.2, -.25, .4, 0, wd, o());
    for (const zz of [-.3, .3]) S.seg([.8, .54, zz], [2.0, broken ? .1 : .34, zz * 1.1], .04, .035, wd, { l: L_WOOD });
    S.ico(.26, .35, .74, .1, COL.clothT, { sc: [1.2, .7, 1], l: L_CLOTH, d: 1 }); S.ico(.24, -.05, .72, -.18, mulC(COL.clothT, .8), { sc: [1, .7, 1.2], l: L_CLOTH, d: 1 });
    PROP.barrel(S, -.5, .6, .12, .8, rng);
  },
  bones(S, rng, n = 5) {
    for (let k = 0; k < n; k++) { const a = rng() * TAU, l = rng.range(.2, .45), x = rng.range(-.4, .4), z = rng.range(-.4, .4); S.seg([x, .04, z], [x + Math.cos(a) * l, .05 + rng() * .08, z + Math.sin(a) * l], .03, .03, mulC(COL.bone, .7 + .3 * rng()), { l: L_BONE, n: 5 }); }
    if (rng() < .7) PROP.skull(S, rng.range(-.2, .2), .13, rng.range(-.2, .2), .15, rng() * TAU);
  },
  skull(S, x, y, z, r, ry) {
    const T = new Soup();
    T.sph(r, 0, 0, 0, COL.bone, { sc: [1, .95, 1.1], l: L_BONE, w: 7, h: 5 }); T.box(r * 1.1, r * .55, r * .8, 0, -r * .65, r * .32, COL.boneD, { l: L_BONE });
    for (const s of [-1, 1]) T.box(r * .42, r * .38, r * .2, s * r * .42, -r * .05, r * 1.0, COL.black, { jit: 0 });
    S.merge(T, { p: [x, y, z], ry, ao: null });
  },
  ribcage(S, rng) {
    const b = COL.bone;
    S.seg([-1.6, .5, 0], [1.6, .7, 0], .1, .08, b, { l: L_BONE });
    for (let k = 0; k < 6; k++) {
      const x = -1.3 + k * .5, s = 1 - Math.abs(k - 2.5) * .12;
      for (const side of [-1, 1]) {
        if (rng() < .15) continue;
        let p = [x, .55, 0]; const pts = [[x, .95 * s, side * .55 * s], [x + .05, 1.25 * s, side * .95 * s], [x + .1, .85 * s, side * 1.15 * s], [x + .12, .1, side * 1.05 * s]];
        for (const q of pts) { S.seg(p, q, .06, .05, mulC(b, .8 + .2 * rng()), { l: L_BONE, n: 5 }); p = q; }
      }
    }
    S.ico(.5, 2.15, .55, 0, b, { sc: [1.35, .8, .85], l: L_BONE, d: 1 }); S.ico(.3, 2.85, .4, 0, COL.boneD, { sc: [1.3, .6, .7], l: L_BONE, d: 1 });
    for (const side of [-1, 1]) { S.seg([2.0, .8, side * .3], [1.7, 1.4, side * .75], .1, .02, b, { l: L_BONE, n: 5 }); S.box(.2, .16, .08, 2.3, .62, side * .4, COL.black, { jit: 0 }); }
  },
  web(S, a, b, c) {
    const col = mulC(COL.stoneL, 1.5), th = .011;
    const lerp3 = (p, q, t) => [lerp(p[0], q[0], t), lerp(p[1], q[1], t), lerp(p[2], q[2], t)];
    for (let k = 0; k <= 4; k++) S.seg(a, lerp3(b, c, k / 4), th, th, col, { n: 3, emis: .015, jit: 0, sway: .25 });
    for (let r = 1; r <= 3; r++) for (let k = 0; k < 4; k++) S.seg(lerp3(a, lerp3(b, c, k / 4), r / 3.3), lerp3(a, lerp3(b, c, (k + 1) / 4), r / 3.3 - .04), th, th, col, { n: 3, emis: .015, jit: 0, sway: .25 });
  },
  banner(S, rng, col, h = 3.0) { cnBanner(S, 0, 0, h, 0, col, rng, { w: .5, len: 1.5, col2: col === COL.clothD ? COL.lacqL : undefined }); },
  juma(S, rng, len) {
    const y = .52; S.seg([-len / 2, y, 0], [len / 2, y, 0], .075, .07, mulC(COL.wood, .8), { l: L_WOOD, n: 6 });
    for (let x = -len / 2 + .2, k = 0; x < len / 2 - .1; x += .34, k++) {
      const c = mulC(COL.woodL, .7 + .3 * rng()), a = .78 + rng.range(-.08, .08);
      for (const sg of [-1, 1]) { const dz = Math.sin(a) * .78 * sg, dy = Math.cos(a) * .78; S.seg([x, y - dy, -dz], [x, y + dy, dz], .04, .035, c, { l: L_WOOD, n: 4 }); S.cone(.04, .14, x, y + dy + .05, dz * 1.07, mulC(COL.steel, .8), { n: 4, l: L_METAL, r: [sg * a, 0, 0] }); }
    }
  },
  rack(S, rng) {
    for (const sg of [-1, 1]) { S.box(.07, 1.0, .07, sg * .6, .5, 0, COL.woodD, { l: L_WOOD }); S.box(.3, .06, .4, sg * .6, .03, 0, COL.woodD, { l: L_WOOD }); }
    for (const y of [.42, .92]) S.box(1.3, .06, .06, 0, y, 0, COL.wood, { l: L_WOOD });
    for (let k = 0; k < 5; k++) {
      const x = -.48 + k * .24, top = 1.75 + rng.range(-.1, .15), kind = k % 3;
      S.seg([x, .06, .1], [x, top, -.06], .02, .02, k & 1 ? COL.lacqD : COL.woodD, { l: L_WOOD, n: 4 });
      if (kind === 0) S.cone(.04, .22, x, top + .1, -.07, COL.steel, { n: 4, l: L_METAL, rough: .4 });
      else if (kind === 1) { S.cone(.035, .2, x, top + .1, -.07, COL.steel, { n: 4, l: L_METAL, rough: .4 }); S.box(.18, .04, .02, x + .05, top - .06, -.06, COL.steel, { l: L_METAL, rough: .4 }); S.box(.03, .12, .02, x + .13, top - .02, -.06, COL.steel, { l: L_METAL, rough: .4 }); }
      else { S.box(.11, .4, .02, x + .03, top - .08, -.06, COL.steel, { l: L_METAL, rough: .4 }); }
      S.ico(.04, x, top - .32, -.03, COL.lacqL, { d: 0, sc: [1, 1.5, 1] });
    }
  },
  wardrum(S, rng) {
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) S.seg([sx * .5, 0, sz * .42], [sx * .34, 1.5, sz * .12], .05, .045, COL.lacqD, { l: L_WOOD, n: 5 });
    for (const sz of [-1, 1]) S.box(.8, .07, .07, 0, 1.46, sz * .12, COL.lacqD, { l: L_WOOD }); for (const sx of [-1, 1]) S.box(.07, .06, .8, sx * .46, .3, 0, COL.woodD, { l: L_WOOD });
    const o = () => ({ n: 12, r: [HPI, 0, 0] });
    S.cyl(.52, .2, 0, .98, -.1, COL.lacq, Object.assign(o(), { rt: 1.12, l: L_WOOD })); S.cyl(.52, .2, 0, .98, .1, COL.lacq, Object.assign(o(), { rt: .89, l: L_WOOD })); 
    for (const z of [-.21, .21]) { S.cyl(.47, .02, 0, .98, z, C(0xd8c49a), o()); S.add(gTorus(12, .05, 4), { s: .49, p: [0, .98, z * .95], c: COL.brass, l: L_METAL, rough: .4 }); }
    for (let k = 0; k < 12; k++) { const a = k / 12 * TAU; for (const z of [-.16, .16]) S.box(.035, .035, .03, Math.cos(a) * .55, .98 + Math.sin(a) * .55, z, COL.brass, { l: L_METAL, jit: 0 }); }
    S.seg([.62, .0, .3], [.5, .9, .2], .025, .02, COL.woodD, { l: L_WOOD, n: 4 }); S.ico(.06, .49, .94, .2, COL.lacqL, { d: 0 });
  },
  stoneLamp(S, rng) {
    const c = mixC(COL.stoneD, COL.stoneL, .5 + .3 * rng());
    S.cyl(.3, .12, 0, .06, 0, mulC(c, .85), { n: 6, l: L_ROCK }); S.cyl(.13, .7, 0, .47, 0, c, { n: 6, l: L_ROCK, rt: .85 }); S.cyl(.2, .08, 0, .86, 0, mulC(c, 1.1), { n: 6, l: L_ROCK, rt: 1.3 });
    S.box(.3, .3, .3, 0, 1.05, 0, c, { l: L_ROCK }); for (let k = 0; k < 4; k++) { const a = k * HPI; S.box(.16, .18, .02, Math.sin(a) * .151, 1.05, Math.cos(a) * .151, COL.ember, { emis: .7, jit: 0, r: [0, a, 0] }); }
    cnRoof(S, { y: 1.2, a: .34, h: .22, lift: .08, n: 2, m: 2, col: mulC(c, .8), layer: L_ROCK, rr: .02, finial: mulC(c, 1.1) });
  },
  lion(S, rng, flip = 1) {
    const c = mixC(COL.stone, COL.stoneL, .5), cd = mulC(c, .78), m = () => ({ l: L_ROCK, d: 1 });
    S.box(.9, .3, 1.1, 0, .15, 0, COL.stoneD, { l: L_MASON }); S.box(.78, .12, .98, 0, .36, 0, COL.stoneL, { l: L_MASON });
    S.ico(.34, 0, .72, -.2, c, Object.assign(m(), { sc: [.95, .9, 1.1] })); S.ico(.3, 0, .98, .08, c, Object.assign(m(), { sc: [.95, 1.1, .9] }));
    for (const sg of [-1, 1]) { S.box(.16, .56, .18, sg * .2, .7, .3, cd, { l: L_ROCK }); S.box(.2, .1, .26, sg * .2, .47, .36, c, { l: L_ROCK }); S.ico(.17, sg * .26, .6, -.3, cd, m()); }
    S.ico(.27, 0, 1.38, .16, c, Object.assign(m(), { sc: [1.05, .95, 1] })); S.box(.26, .14, .16, 0, 1.3, .38, cd, { l: L_ROCK }); S.box(.2, .04, .05, 0, 1.25, .45, COL.black, { jit: 0 });
    for (let k = 0; k < 9; k++) { const a = (k / 8 - .5) * 3.6; S.ico(.085, Math.sin(a) * .26, 1.42 + Math.cos(a) * .2, .02 - Math.abs(Math.sin(a)) * .04, cd, { d: 0, l: L_ROCK }); }
    for (const sg of [-1, 1]) { S.ico(.045, sg * .1, 1.44, .39, COL.black, { d: 0, jit: 0 }); S.cone(.06, .12, sg * .18, 1.62, .12, cd, { n: 4, l: L_ROCK }); }
    S.sph(.13, flip * .2, .55, .5, cd, { w: 6, h: 4, smooth: false, l: L_ROCK }); S.seg([0, .8, -.5], [0, 1.15, -.62], .07, .04, cd, { n: 5, l: L_ROCK });
  },
  fence(S, rng, len) {
    const nP = Math.max(2, Math.round(len) + 1);
    for (let k = 0; k < nP; k++) {
      const x = -len / 2 + k * len / (nP - 1), lean = rng.range(-.14, .14), hh = rng.range(.72, .95);
      S.box(.1, hh, .1, x, hh / 2, 0, mulC(COL.wood, .7 + .3 * rng()), { l: L_WOOD, r: [lean, 0, rng.range(-.12, .12)] });
      if (k < nP - 1) for (const y of [.36, .68]) { if (rng() < .22) continue; const drop = rng() < .15 ? -.3 : 0; S.seg([x, y, 0], [x + len / (nP - 1), y + drop + rng.range(-.04, .04), 0], .035, .035, mulC(COL.woodL, .7 + .3 * rng()), { l: L_WOOD, n: 4 }); }
    }
  },
  palisade(S, rng, len) {
    for (let x = -len / 2; x < len / 2; x += .27) {
      if (rng() < .1) continue;
      const hh = rng.range(1.25, 1.75), lean = [rng.range(-.1, .1), 0, rng.range(-.12, .12)], c = mulC(COL.wood, .65 + .35 * rng()), T = new Soup();
      T.cyl(.12, hh, 0, hh / 2, 0, c, { n: 6, l: L_WOOD }); T.cone(.12, .3, 0, hh + .15, 0, mulC(c, 1.15), { n: 6, l: L_WOOD });
      S.merge(T, { p: [x, -.1, rng.range(-.04, .04)], r: lean, ao: [0, .5, .6] });
    }
    S.box(len, .09, .07, 0, .95, .13, COL.woodD, { l: L_WOOD });
  },
  well(S, rng) {
    for (let k = 0; k < 10; k++) { const a = k / 10 * TAU; S.box(.44, .56, .26, Math.cos(a) * .68, .28, Math.sin(a) * .68, mixC(COL.stoneD, COL.stoneL, rng()), { l: L_MASON, r: [0, -a + HPI, 0] }); }
    S.cyl(.6, .06, 0, .3, 0, COL.black, { n: 10, jit: 0 });
    for (const s of [-1, 1]) S.box(.1, 1.7, .1, s * .72, .85, 0, COL.lacqD, { l: L_WOOD });
    S.seg([-.8, 1.45, 0], [.8, 1.45, 0], .05, .05, COL.wood, { l: L_WOOD });
    S.box(1.6, .07, .07, 0, 1.7, 0, COL.lacqD, { l: L_WOOD }); cnRoof(S, { y: 1.72, a: .98, b: .62, h: .42, ridge: .98, lift: .08, sag: 1.3, n: 3, m: 2, rr: .035 });
    S.seg([.15, 1.45, 0], [.15, .75, 0], .012, .012, COL.rope, { n: 3 }); S.cyl(.12, .2, .15, .68, 0, COL.wood, { n: 7, l: L_WOOD, rt: 1.2 });
  },
  wallRun(S, rng, len, hMax) {
    let x = -len / 2, k = 0, h = hMax * rng.range(.5, 1);
    while (x < len / 2) {
      const w = rng.range(.9, 1.4); h = clamp(h + rng.range(-1.1, .7), .5, hMax);
      const edge = Math.min(1, (len / 2 - Math.abs(x + w / 2)) / 1.4 + .25), hh = h * edge, c = mixC(COL.stoneD, COL.stone, rng());
      S.box(w, hh, .62, x + w / 2, hh / 2, 0, c, { l: L_MASON });
      for (let j = 0; j < 3; j++) if (rng() < .6) S.box(w * rng.range(.25, .45), rng.range(.2, .5), .62, x + w * (.2 + j * .3), hh + .15, 0, mixC(COL.stoneD, COL.stoneL, rng()), { l: L_MASON });
      if (hh > 2.2 && rng() < .5) S.box(.3, .8, .7, x + w / 2, hh * .62, 0, COL.black, { jit: 0 });
      if (rng() < .5) S.rock(rng.range(.2, .4), x + rng.range(0, w), .1, rng.sign() * rng.range(.5, .9), mixC(COL.stoneD, COL.stone, rng()));
      x += w; k++;
    }
    S.box(len * .9, .22, .86, 0, .08, 0, COL.stoneD, { l: L_MASON });
  },
  towerRuin(S, rng) {
    const A = 1.55, hs = [4.2, 3.4, 1.4, 2.4];
    S.box(A * 2 + .7, .4, A * 2 + .7, 0, .2, 0, COL.stoneD, { l: L_MASON });
    for (let k = 0; k < 4; k++) {
      const ang = k * HPI, cs = Math.cos(ang), sn = Math.sin(ang), n = 4;
      for (let i = 0; i < n; i++) {
        if (k === 2 && i === 1) continue;
        const u = (i + .5) / n * 2 - 1, hh = clamp(hs[k] + (hs[(k + 1) % 4] - hs[k]) * (i / n) + rng.range(-.5, .4), .6, 4.6), wseg = A * 2 / n + .02, x = u * A * cs + A * sn, z = -u * A * sn + A * cs;
        S.box(wseg, hh, .5, x, .4 + hh / 2, z, mixC(COL.ramD, COL.ram, rng()), { l: L_DIRT, r: [0, ang, 0], jit: .04 });
        S.box(wseg + .04, .5, .58, x, .62, z, mixC(COL.stoneD, COL.stone, rng()), { l: L_MASON, r: [0, ang, 0] });
        if (hh > 3.4) S.box(.3, .36, .5, x, .4 + hh + .18, z, mixC(COL.ramD, COL.ram, rng()), { l: L_DIRT, r: [0, ang, 0] });
        if (hh > 2.6 && (i & 1)) S.box(.2, .6, .56, x, .4 + hh * .62, z, COL.black, { jit: 0, r: [0, ang, 0] });
      }
    }
    for (let k = 0; k < 3; k++) { const a = rng() * TAU; S.seg([Math.cos(a) * A, 2.0, Math.sin(a) * A], [Math.cos(a + 2.4) * A * .6, 1.8 - rng() * .8, Math.sin(a + 2.4) * A * .6], .07, .06, mulC(COL.bark, .7), { l: L_WOOD, n: 4 }); }
    for (let k = 0; k < 8; k++) { const a = rng() * TAU, d = rng.range(2.2, 3.2); S.box(rng.range(.3, .6), rng.range(.2, .4), rng.range(.3, .5), Math.cos(a) * d, .12, Math.sin(a) * d, mixC(COL.ramD, COL.stone, rng()), { l: L_DIRT, r: [rng() * .5, rng() * 3, rng() * .5] }); }
  },
  signpost(S, rng) {
    const c = mixC(COL.stoneD, COL.stoneL, .6);
    S.box(.7, .18, .46, 0, .09, 0, mulC(c, .8), { l: L_ROCK }); S.box(.46, 1.3, .2, 0, .82, 0, c, { l: L_ROCK, r: [0, 0, .04] }); S.box(.58, .12, .28, .02, 1.52, 0, mulC(c, 1.1), { l: L_ROCK }); S.box(.4, .1, .22, .02, 1.62, 0, c, { l: L_ROCK });
    for (const y of [.6, .85, 1.1]) S.box(.14, .16, .02, .01, y, .105, mulC(COL.lacq, .9), { jit: 0 });
  },
  cairn(S, rng) { let y = 0, r = rng.range(.3, .42); for (let k = 0; k < 4; k++) { S.rock(r, rng.range(-.05, .05), y + r * .45, rng.range(-.05, .05), mixC(COL.stoneD, COL.stoneL, rng()), { sq: .6 }); y += r * .72; r *= .74; } },
  statue(S, rng) { PROP.lion(S, rng, rng.sign()); },
  tuft(S, rng) {
    const c = mulC(mixC(COL.tuftA, COL.tuftB, rng() * .6), .8 + .5 * rng());
    for (let k = 0; k < rng.int(3, 5); k++) {
      const a = rng() * TAU, l = rng.range(.22, .42), bx = Math.cos(a) * .06, bz = Math.sin(a) * .06, tx = Math.cos(a) * l * .5, tz = Math.sin(a) * l * .5, w = .035;
      const A = [bx - Math.sin(a) * w, 0, bz + Math.cos(a) * w], Bp = [bx + Math.sin(a) * w, 0, bz - Math.cos(a) * w], T = [tx, l, tz];
      for (const [p, sw] of [[A, 0], [Bp, 0], [T, .7], [A, 0], [T, .7], [Bp, 0]]) S.v(p[0], p[1], p[2], 0, 1, 0, c[0], c[1], c[2], 0, 0, L_PLAIN, 1, sw, 0);
    }
  },
};

function buildBridge(B) {
  const i = B.ci0, x = B.px[i], z = B.pz[i], ang = Math.atan2(B.tz[i], B.tx[i]), rng = B.rng, T = new Soup();
  const y0 = B.py[i], bed = B.wlc - .5 - y0, spring = B.wlc + .08 - y0, wHalf = ROAD_HALF + .34, A = 1.3;
  const yd = u => B.py[clamp(Math.round(i + u / PATH_STEP), 0, B.n - 1)] - y0;
  const crown = yd(0) - .34;
  const yArch = u => spring + (crown - spring) * Math.sqrt(Math.max(0, 1 - (u / A) * (u / A)));
  const mc = () => mixC(COL.stoneD, COL.stoneL, rng());
  for (let k = -5; k < 5; k++) {
    const u = (k + .5) * .62, top = yd(u);
    T.box(.63, .26, wHalf * 2 - .1, u, top - .16, 0, COL.stoneD, { l: L_MASON });
    for (const side of [-1, 1]) {
      const zz = side * wHalf;
      T.box(.63, .52, .3, u, top + .22, zz, mc(), { l: L_MASON });
      if (k % 2 === 0) T.box(.3, .14, .36, u, top + .55, zz, mc(), { l: L_MASON });
      const bot = Math.abs(u) < A ? yArch(u) : bed - .3;
      if (top - .05 - bot > .04) T.box(.63, top - .05 - bot, .3, u, (top - .05 + bot) / 2, zz, mc(), { l: L_MASON });
    }
  }
  for (const side of [-1, 1]) {
    for (let k = 0; k <= 8; k++) { const th = PI * k / 8, u = Math.cos(th) * A; T.box(.42, .22, .38, u, spring + (crown - spring) * Math.sin(th) - .05, side * wHalf, COL.stoneL, { l: L_MASON, r: [0, 0, th - HPI] }); }
    for (const u of [-3.25, 3.25]) { const t = yd(u); T.box(.5, 1.25, .5, u, t + .3, side * wHalf, mc(), { l: L_MASON }); T.box(.62, .13, .62, u, t + .98, side * wHalf, COL.stoneL, { l: L_MASON }); T.cone(.2, .25, u, t + 1.15, side * wHalf, COL.stoneD, { n: 4, l: L_ROCK }); }
  }
  if (B.bio.key === 'frost') for (const side of [-1, 1]) for (let u = -1.15; u <= 1.16; u += .21) { const h = rng.range(.12, .55); T.cone(.04 + .03 * rng(), h, u, yArch(u) - h / 2 - .04, side * (wHalf + .03), COL.ice, { n: 5, r: [PI, 0, 0], rough: .14, emis: .012 }); }
  B.put(T, x, z, { y: y0, ry: -ang, ao: null });
  B.bridge = { x, z, y: y0 };
}

function buildKeep(B) {
  // The pass: a brick wall with a gate tower under a double roof, a square beacon tower and a hall in the yard.
  const rng = B.rng, kx = B.kx, ky = B.keepY, oz = BN + 5.65;
  const TG = new Soup(), TT = new Soup();
  // Swapped at run time (63-wall.js): the leaves shut / stove in, and the east curtain whole / breached once the pass has fallen.
  const DC = new Soup(), DB = new Soup(), WE = new Soup(), WF = new Soup();
  const r2 = (() => { let q = 7919; const f = () => (q = q * 16807 % 2147483647) / 2147483647; f.range = (a, b) => a + f() * (b - a); return f; })();
  const st = COL.stone, sdk = COL.stoneD, sl = COL.stoneL, red = COL.lacq, redD = COL.lacqD;
  const mc = (R = rng) => mixC(sdk, sl, R() * .8 + .1);
  const mas = (S, w, h, d, x, y, z, c, o = {}) => S.box(w, h, d, x, y, z, c || mc(), Object.assign({ l: L_MASON }, o));
  mas(TG, 10.6, .5, 6.0, 0, -.2, -2.9, sdk);
  for (let k = 0; k < 9; k++) mas(TG, 1.1, .16, .55, -4.4 + k * 1.1, .1, .25, mc());
  const wz = -.95, wall = (x0, x1, h, broken, S = TG, R = rng) => {
    const n = Math.max(1, Math.round(Math.abs(x1 - x0) / 1.1)), dx = (x1 - x0) / n;
    for (let k = 0; k < n; k++) {
      const x = x0 + (k + .5) * dx, hh = broken ? Math.max(.5, h - k * R.range(.5, .95)) : h, whole = hh > h - .2;
      mas(S, Math.abs(dx) + .02, hh, 1.05, x, hh / 2, wz, k & 1 ? st : mc(R), { jit: .03 }); mas(S, Math.abs(dx) + .02, .5, 1.25, x, .25, wz, sdk);
      if (whole) { mas(S, Math.abs(dx) + .04, .14, 1.2, x, hh + .07, wz, sl); cnMerlons(S, x - Math.abs(dx) / 2, wz + .5, x + Math.abs(dx) / 2, wz + .5, hh + .14, { rng: R, h: .36, w: .3, pitch: .55 }); cnMerlons(S, x - Math.abs(dx) / 2, wz - .5, x + Math.abs(dx) / 2, wz - .5, hh + .14, { rng: R, h: .3, w: .3, pitch: .55 }); }
      else { for (let j = 0; j < 3; j++) if (R() < .7) mas(S, R.range(.3, .55), R.range(.2, .6), .9, x + R.range(-.4, .4), hh + .15, wz, mc(R)); if (hh < 1.8) for (let j = 0; j < 3; j++) S.rock(R.range(.2, .42), x + R.range(-.6, .6), .12, wz + R.range(.3, 1.3), mc(R)); }
    }
  };
  wall(-5.3, -1.7, 3.0, false); wall(1.7, 5.3, 3.0, false, WE);
  // the fallen curtain: a stub by the gate, then a breach torn down to the footing with its rubble spilled both ways
  wall(1.7, 2.8, 3.0, false, WF, r2);
  { const prof = [2.45, 1.6, .75, .5, .62, 1.25, 2.0, 2.6], w = 2.5 / prof.length;
    prof.forEach((hh, k) => {
      const x = 2.8 + (k + .5) * w; mas(WF, w + .02, hh, 1.05, x, hh / 2, wz, mulC(k & 1 ? st : mc(r2), hh < 1.3 ? .62 : .82), { jit: .04 }); mas(WF, w + .02, .5, 1.25, x, .25, wz, sdk);
      for (let j = 0; j < 2; j++) if (r2() < .75) mas(WF, r2.range(.2, .34), r2.range(.16, .4), r2.range(.5, .9), x + r2.range(-.1, .1), hh + .1, wz + r2.range(-.12, .12), mulC(mc(r2), .75), { r: [r2.range(-.3, .3), r2.range(-.5, .5), r2.range(-.3, .3)] });
    });
    for (let j = 0; j < 22; j++) { const x = r2.range(3.2, 5.0), f = r2() < .62 ? 1 : -1, d = r2.range(.45, 1.9); WF.rock(r2.range(.16, .4) * (1.25 - d * .3), x, .1 + (1.9 - d) * .16, wz + f * d, mulC(mc(r2), r2.range(.6, .95))); }
    for (let j = 0; j < 9; j++) mas(WF, r2.range(.3, .5), r2.range(.16, .26), r2.range(.2, .32), r2.range(3.1, 5.1), .12, wz + r2.range(.7, 2.1), mc(r2), { r: [r2.range(-.4, .4), r2.range(0, 3), r2.range(-.4, .4)] });
    WF.seg([3.3, .5, wz + .9], [5.0, .95, wz + 1.7], .035, .03, COL.woodD, { l: L_WOOD, n: 5 }); WF.box(.5, .03, .9, 4.7, .82, wz + 1.3, mulC(COL.clothR, .5), { r: [.2, .5, .25], jit: 0 }); }
  // gate platform
  const gh = 3.7, gw = 1.75, gz = -.8, gd = 1.7;
  for (const s of [-1, 1]) { mas(TG, gw - 1.05, gh, gd, s * (1.05 + (gw - 1.05) / 2), gh / 2, gz, st, { jit: .03 }); mas(TG, gw - .95, .6, gd + .2, s * (1.05 + (gw - 1.05) / 2 + .05), .3, gz, sdk); mas(TG, .26, 1.5, gd + .04, s * 1.12, .75, gz, sl); }
  mas(TG, gw * 2, gh - 2.55, gd, 0, 2.55 + (gh - 2.55) / 2, gz, st);
  for (let k = 0; k <= 8; k++) { const th = PI * k / 8; mas(TG, .38, .28, gd + .1, Math.cos(th) * 1.12, 1.5 + Math.sin(th) * 1.12, gz, sl, { r: [0, 0, th - HPI] }); }
  TG.box(2.1, 2.6, .2, 0, 1.3, gz - gd / 2 + .15, COL.black, { jit: 0 }); TG.box(2.1, .2, gd - .3, 0, 2.7, gz, COL.black, { jit: 0 });
  { const dz = gz + gd / 2 - .12, lw = 1.0, char = mulC(red, .5), charD = mulC(redD, .45);
    const leaf = (T, c, cd, studs) => {
      T.box(lw, 2.5, .1, lw / 2, 1.25, 0, c, { l: L_WOOD }); for (const y of [.1, 1.25, 2.42]) T.box(lw, .09, .14, lw / 2, y, 0, cd, { l: L_WOOD });
      if (studs) { for (let i = 0; i < 3; i++) for (let q = 0; q < 4; q++) T.box(.07, .07, .16, .2 + i * .28, .42 + q * .5, 0, COL.gold, { l: L_METAL, rough: .4, emis: .04, jit: 0 }); T.box(.16, .16, .2, lw - .14, 1.25, 0, COL.bronze, { l: L_METAL, rough: .5, jit: 0 }); }
    };
    // shut: both leaves flush across the passage, barred from within
    for (const s of [-1, 1]) { const T = new Soup(); leaf(T, red, redD, true); DC.merge(T, { p: [s * 1.02, .05, dz], ry: s < 0 ? 0 : PI, ao: null }); }
    DC.box(.05, 2.5, .15, 0, 1.3, dz, redD, { l: L_WOOD, jit: 0 });
    // stove in: one leaf thrown flat across the threshold, the other hanging charred from its upper hinge, splinters on the road
    { const T = new Soup(); leaf(T, char, charD, true); DB.merge(T, { p: [-.95, .26, dz + .25], r: [1.6, .14, 0], ao: null }); }
    { const T = new Soup(); for (let i = 0; i < 4; i++) { const h = [2.5, 1.7, 2.2, 1.1][i]; T.box(.24, h, .1, .125 + i * .25, 2.5 - h / 2, 0, i & 1 ? char : mulC(red, .65), { l: L_WOOD }); } T.box(lw, .09, .14, lw / 2, 2.42, 0, charD, { l: L_WOOD }); DB.merge(T, { p: [1.02, .05, dz], r: [0, PI - 1.05, .1], ao: null }); }
    for (let j = 0; j < 11; j++) DB.box(r2.range(.08, .2), .06, r2.range(.4, .95), r2.range(-1.3, 1.3), .24 + r2() * .05, dz + r2.range(.3, 2.0), r2() < .5 ? char : mulC(red, .7), { l: L_WOOD, r: [r2.range(-.15, .15), r2.range(0, 3), r2.range(-.15, .15)] });
    DB.seg([-.5, .3, dz + 1.9], [.75, .42, dz + .5], .12, .11, COL.woodD, { l: L_WOOD, n: 6 });
  }
  mas(TG, gw * 2 + .3, .18, gd + .3, 0, gh + .09, gz, sl);
  cnMerlons(TG, -gw, gz + gd / 2 + .06, gw, gz + gd / 2 + .06, gh + .18, { rng, h: .34, w: .3, pitch: .5 }); for (const s of [-1, 1]) cnMerlons(TG, s * (gw + .06), gz - gd / 2, s * (gw + .06), gz + gd / 2, gh + .18, { rng, h: .34, w: .3, pitch: .5 });
  TG.box(1.1, .42, .08, 0, 3.12, gz + gd / 2 + .03, C(0x1d2c4a), { jit: 0 }); TG.box(1.22, .06, .1, 0, 3.36, gz + gd / 2 + .03, COL.gold, { l: L_METAL, jit: 0 }); TG.box(1.22, .06, .1, 0, 2.88, gz + gd / 2 + .03, COL.gold, { l: L_METAL, jit: 0 });
  for (const u of [-.3, 0, .3]) TG.box(.16, .2, .09, u, 3.12, gz + gd / 2 + .04, COL.gold, { l: L_METAL, emis: .05, jit: 0 });
  // gate hall, two eaves
  const hy = gh + .18, ha = 1.32, hb = .52;
  TG.box(ha * 2 + .5, .12, hb * 2 + .5, 0, hy + .06, gz, sdk, { l: L_MASON });
  TG.box(ha * 2 - .2, 1.0, hb * 2 - .2, 0, hy + .62, gz, COL.plaster, { jit: .02 }); TG.box(.5, .7, .06, 0, hy + .47, gz + hb - .08, COL.black, { jit: 0 });
  for (const u of [-.8, .8]) { TG.box(.4, .34, .06, u, hy + .68, gz + hb - .08, COL.black, { jit: 0 }); for (const q of [-.1, 0, .1]) TG.box(.025, .34, .07, u + q, hy + .68, gz + hb - .07, redD, { l: L_WOOD }); }
  for (let i = 0; i < 4; i++) for (const s of [-1, 1]) TG.seg([-ha + i * ha * 2 / 3, hy + .12, gz + s * hb], [-ha + i * ha * 2 / 3, hy + 1.12, gz + s * hb], .06, .055, red, { l: L_WOOD, n: 6 });
  cnBrackets(TG, 0, hy + 1.14, gz, ha, hb, { h: .1 });
  cnRoof(TG, { y: hy + 1.24, z: gz, a: ha + .62, b: hb + .62, h: .5, ridge: ha - .1, t0: .34, n: 3, m: 5, lift: .26, rr: .05 });
  TG.box(ha * 2 - .7, .62, hb * 2 - .3, 0, hy + 1.72, gz, red, { l: L_WOOD, jit: .02 }); for (const u of [-.5, 0, .5]) TG.box(.3, .26, .05, u, hy + 1.76, gz + hb - .13, COL.black, { jit: 0 });
  cnBrackets(TG, 0, hy + 2.03, gz, ha - .34, hb - .14, { h: .09 });
  cnRoof(TG, { y: hy + 2.12, z: gz, a: ha + .26, b: hb + .5, h: .72, ridge: ha - .42, n: 4, m: 5, lift: .3, rr: .055 });
  for (const s of [-1, 1]) { TG.seg([s * 1.32, 1.9, gz + gd / 2 - .02], [s * 1.32, 2.1, gz + gd / 2 + .4], .035, .03, COL.iron, { l: L_METAL, n: 4 }); TG.cyl(.09, .14, s * 1.32, 2.14, gz + gd / 2 + .42, COL.bronze, { n: 6, l: L_METAL, rt: 1.4 }); B.fires.push({ x: kx + s * 1.32, y: ky + 2.3, z: oz + gz + gd / 2 + .42, size: .42, type: 'sconce' }); }
  for (const s of [-1, 1]) cnBanner(WE, s * (gw + .1), gh + .1, gh + 2.5, gz + gd / 2 + .1, s < 0 ? COL.clothR : COL.clothD, rng, { w: .44, len: 1.3, sway: .8, col2: s < 0 ? undefined : COL.lacqL });
  cnBanner(WE, 2.9, 3.1, 5.3, wz + .1, COL.clothR, rng, { w: .5, len: 1.4, sway: .8 });
  // the victors' black standards fly from the gate tower once it is taken
  for (const s of [-1, 1]) cnBanner(WF, s * (gw + .1), gh + .1, gh + 2.7, gz + gd / 2 + .1, C(0x17161c), r2, { w: .5, len: 1.5, sway: .9, col2: C(0x8a8478) });
  // yard: back wall, side wall, a hall and stores
  for (let k = 0; k < 8; k++) { const x = -4.7 + k * 1.3, h = 2.5; mas(TG, 1.32, h, .7, x, h / 2, -5.3); }
  cnMerlons(TG, -5.3, -5.05, 5.1, -5.05, 2.5, { rng, h: .3, w: .3, pitch: .55, skip: .12 });
  mas(TG, .7, 2.5, 4.0, -5.0, 1.25, -3.3); cnMerlons(TG, -5.25, -5.2, -5.25, -1.4, 2.5, { rng, h: .3, w: .3, pitch: .55 });
  { const hx = 1.5, hz = -3.6, a = 2.0, b = 1.0, wh = 2.5;
    TG.box(a * 2 + .5, .3, b * 2 + .6, hx, .15, hz, sdk, { l: L_MASON }); TG.box(a * 2 - .2, wh, b * 2 - .2, hx, .3 + wh / 2, hz, COL.plaster, { jit: .02 });
    for (let i = 0; i < 5; i++) for (const s of [-1, 1]) TG.seg([hx - a + i * a / 2, .3, hz + s * b], [hx - a + i * a / 2, .3 + wh, hz + s * b], .075, .07, red, { l: L_WOOD, n: 6 });
    TG.box(.7, 1.3, .08, hx, .95, hz + b - .08, COL.black, { jit: 0 }); for (const u of [-1.1, 1.1]) TG.box(.6, .5, .08, hx + u, 1.6, hz + b - .08, COL.black, { jit: 0 });
    cnBrackets(TG, hx, .3 + wh + .02, hz, a, b, { h: .12 }); cnRoof(TG, { x: hx, z: hz, y: .3 + wh + .14, a: a + .7, b: b + .7, h: 1.05, ridge: a - .5, n: 4, m: 5, lift: .34, rr: .06 }); }
  PROP.barrel(TG, -3.6, .05, -2.2, 1.1, rng); PROP.barrel(TG, -3.1, .05, -2.6, 1, rng); PROP.crate(TG, -3.9, .05, -3.2, .55, rng, .4);
  for (const s of [-1, 1]) { const T = new Soup(); PROP.lion(T, rng, -s); TG.merge(T, { p: [s * 2.35, .16, .95], s: .85, ao: null }); }
  // beacon tower
  const bx = -3.5, bz = -.95, bh = 7.3, r0 = 1.95, r1 = 1.5, rot = { r: [0, PI / 4, 0] }, hw = r1 * .7071;
  TT.cyl(r0 + .3, 1.2, bx, .6, bz, sdk, Object.assign({ n: 4, l: L_MASON, rt: .93 }, rot));
  TT.cyl(r0, bh, bx, bh / 2, bz, COL.ram, Object.assign({ n: 4, l: L_DIRT, rt: r1 / r0, jit: .03 }, rot));
  for (let c = 0; c < 6; c++) { const y = 1.5 + c * 1.02, rr2 = lerp(r0, r1, y / bh) + .02; TT.cyl(rr2, .16, bx, y, bz, mixC(COL.ramD, COL.ram, rng() * .5), Object.assign({ n: 4, l: L_DIRT, rt: .99 }, rot)); }
  for (const [a, b] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) TT.seg([bx + a * r0 * .7071, 0, bz + b * r0 * .7071], [bx + a * hw, bh, bz + b * hw], .2, .17, mc(), { n: 4, l: L_MASON });
  TT.cyl(r1 + .06, .5, bx, bh - .1, bz, st, Object.assign({ n: 4, l: L_MASON, rt: 1.2 }, rot));
  TT.box(hw * 2 + .7, .2, hw * 2 + .7, bx, bh + .24, bz, sl, { l: L_MASON });
  { const e = hw + .3; for (const [x0, z0, x1, z1] of [[-e, e, e, e], [e, e, e, -e], [e, -e, -e, -e], [-e, -e, -e, e]]) cnMerlons(TT, bx + x0, bz + z0, bx + x1, bz + z1, bh + .34, { rng, h: .42, w: .32, pitch: .52 }); }
  for (const [dx, dz, y, ry] of [[0, 1, .46, 0], [1, 0, .62, HPI], [0, 1, .78, 0], [1, 0, .34, HPI]]) { const rr2 = lerp(r0, r1, y) * .7071 + .02; TT.box(.14, .8, .1, bx + dx * rr2, bh * y, bz + dz * rr2, COL.black, { jit: 0, r: [0, ry, 0] }); }
  for (let k = 0; k < 3; k++) { const y = bh * (.3 + k * .2), rr2 = lerp(r0, r1, y / bh) * .7071; TT.seg([bx - .5, y, bz + rr2 - .1], [bx - .5, y + .1, bz + rr2 + .6], .06, .05, COL.woodD, { l: L_WOOD, n: 4 }); TT.seg([bx + .5, y, bz + rr2 - .1], [bx + .5, y + .1, bz + rr2 + .6], .06, .05, COL.woodD, { l: L_WOOD, n: 4 }); }
  TT.cyl(.62, .5, bx, bh + .58, bz, sdk, { n: 8, l: L_MASON });
  TT.cyl(.72, .4, bx, bh + 1.06, bz, COL.bronze, { n: 8, l: L_METAL, rt: 1.4, rough: .7 });
  for (let k = 0; k < 4; k++) { const a = k / 4 * TAU + .5; TT.seg([bx + Math.cos(a) * .72, bh + .35, bz + Math.sin(a) * .72], [bx + Math.cos(a) * .96, bh + 1.22, bz + Math.sin(a) * .96], .04, .04, COL.iron, { l: L_METAL, n: 4 }); }
  TT.cyl(.9, .1, bx, bh + 1.24, bz, COL.ember, { n: 8, emis: .5, jit: 0 });
  for (let k = 0; k < 4; k++) { const a = k * 1.3; TT.seg([bx + Math.cos(a) * .7, bh + 1.28, bz + Math.sin(a) * .7], [bx - Math.cos(a) * .6, bh + 1.48, bz - Math.sin(a) * .6], .1, .09, mulC(COL.bark, .7), { l: L_WOOD, n: 5, emis: .05 }); }
  clothPanel(TT, { x0: bx - .5, x1: bx + .5, yTop: 5.6, len: 2.5, z: bz + lerp(r0, r1, .6) * .7071 + .08, col: COL.clothR, col2: mulC(COL.gold, .7), rng, sway: .4, rag: .2 });
  TT.box(1.16, .08, .08, bx, 5.64, bz + lerp(r0, r1, .75) * .7071 + .08, COL.woodD, { l: L_WOOD });
  cnBanner(TT, bx - hw - .2, bh + .3, bh + 2.6, bz + hw + .2, COL.clothR, rng, { w: .46, len: 1.3 });
  const ext = (S, hide) => ({ soup: new Soup().merge(S, { p: [kx, ky, oz], ao: [0, .9, .7] }), mat: MAT.world, hide });
  B.structs.push({ soup: new Soup().merge(TG, { p: [kx, ky, oz], ao: [0, .9, .7] }), cx: kx, cy: ky, cz: oz - 2.5, kind: 'keep', extras: [ext(DC, false), ext(DB, true), ext(WE, false), ext(WF, true)] });
  B.structs.push({ soup: new Soup().merge(TT, { p: [kx, ky, oz], ao: [0, 1.4, .65] }), cx: kx + bx, cy: ky, cz: oz + bz, kind: 'beaconTower' });
  B.beacon = { x: kx + bx, y: ky + bh + 1.45, z: oz + bz };
  B.gate = { x: kx, y: ky, z: BN + 6.6 };
  // where the wall garrison stands: the two men flanking the gate first, then outward along the east wall walk
  B.wallSlots = [2.1, -2.0, 2.62, 3.14, 3.66, 4.18, 4.7, 5.22].map(x => ({ x: kx + x, y: ky + 3.14, z: oz + wz - .1 }));
  // where scaling ladders go up against the east wall, the gate doorway, and where men who came in by the gate reach the wall walk
  B.ladders = [2.36, 3.92, 4.96].map(x => ({ foot: { x: kx + x, z: oz + wz + 1.5 }, top: { x: kx + x, y: ky + 3.14, z: oz + wz + .36 } }));
  B.wallIn = { door: { x: kx, z: oz + gz + gd / 2 - .25 }, up: [{ x: kx + 1.95, y: ky + 3.14, z: oz + wz + .3 }, { x: kx - 2.0, y: ky + 3.14, z: oz + wz + .3 }] };
}

function buildCave(B) {
  const rng = B.rng, zc = B.zc, T = new Soup(), D = new Soup();
  let i0 = 0; for (let i = 0; i < B.n; i++) if (B.px[i] >= BW + 3.4) { i0 = i; break; }
  const y0 = B.py[i0], ox = BW + 3.5;
  const rk = (r, x, y, z, o = {}) => T.rock(r, x, y, z, mixC(COL.stoneD, COL.stone, rng() * .7), o);
  for (const s of [-1, 1]) { rk(1.3, .1, .65, s * 2.45); rk(1.1, .2, 1.9, s * 2.3); rk(.95, .2, 2.95, s * 1.95); rk(.62, 1.0, .3, s * 2.15); rk(.45, 1.5, .2, s * 1.95); }
  rk(1.35, .15, 3.65, 0, { sq: .55 }); rk(1.05, .25, 3.55, -1.05, { sq: .6 }); rk(1.05, .25, 3.55, 1.05, { sq: .6 });
  for (let k = 0; k < 4; k++) rk(2.3, -1.2 - k * .85, 4.3 + k * .3, rng.range(-.6, .6), { sq: .58 });
  for (const zz of [-1.25, -.75, -.2, .35, .9, 1.3]) T.cone(.15 + rng() * .06, .45 + rng() * .5, .3 + rng() * .2, 2.85, zz, mulC(COL.stoneL, .9), { n: 5, l: L_ROCK, r: [PI, 0, 0] });
  if (B.bio.key === 'frost') for (let zz = -1.4; zz <= 1.41; zz += .2) { const h = rng.range(.2, .75); T.cone(.045 + .03 * rng(), h, .62 + rng() * .1, 2.9 - h / 2, zz, COL.ice, { n: 5, r: [PI, 0, 0], rough: .14, emis: .012 }); }
  T.box(3.8, .2, 3.7, -1.9, 3.05, 0, COL.black, { jit: 0 }); T.box(.2, 3.4, 3.7, -3.45, 1.5, 0, COL.black, { jit: 0 });
  for (const s of [-1, 1]) T.box(3.8, 3.2, .2, -1.9, 1.5, s * 1.82, mulC(COL.stoneD, .25), { l: L_ROCK, jit: 0 });
  for (const s of [-1, 1]) { T.seg([1.7, 0, s * 2.5], [1.78, 1.6, s * 2.55], .055, .035, COL.woodD, { l: L_WOOD }); PROP.skull(T, 1.78, 1.72, s * 2.55, .17, s * .5 + 1.2); }
  const Bn = new Soup(); PROP.bones(Bn, rng, 6); T.merge(Bn, { p: [2.2, .02, 2.2], ao: null }); const Bn2 = new Soup(); PROP.bones(Bn2, rng, 5); T.merge(Bn2, { p: [2.6, .02, -2.3], ao: null });
  for (const xx of [-.35, -.95, -1.55, -2.2, -2.85]) D.quad([xx, 0, 1.8], [xx, 0, -1.8], [xx, 3.0, -1.8], [xx, 3.0, 1.8], WHITE, L_PLAIN, 1);
  B.structs.push({ soup: new Soup().merge(T, { p: [ox, y0, zc], ao: null }), cx: ox - 1.2, cy: y0, cz: zc, kind: 'cave', extras: [{ soup: new Soup().merge(D, { p: [ox, y0, zc], ao: null }), mat: MAT.dark, order: 2 }] });
  B.cave = { x: ox, y: y0, z: zc, s: Math.max(.6, (i0 - 5) * PATH_STEP) };
}

function scatterProps(B) {
  const rng = B.rng, placed = (B.scx.sites || []).slice(), H = B.heightAt;
  const free = (x, z, r, roadMin = .6) => {
    if (Math.abs(x) > BH - .7 - r || Math.abs(z) > BH - .7 - r) return false;
    if (B.dRoadAt(x, z) < ROAD_HALF + roadMin + r) return false;
    if (B.dStrAt(x, z) < 1.5 + r) return false;
    if (B.sea !== undefined && H(x, z) < B.sea + .3) return false;
    if (B.ter.abyss !== undefined && H(x, z) < B.ter.abyss) return false;
    for (const p of B.pads) if (dist2(x, z, p.x, p.z) < (2.15 + r) * (2.15 + r)) return false;
    if (Math.abs(x - B.kx) < 5.7 + r && z < BN + 6.8 + r) return false;
    if (x < BW + 5.6 && Math.abs(z - B.zc) < 3.4 + r) return false;
    for (const q of B.ponds) if (dist2(x, z, q.x, q.z) < (q.r * 1.25 + .9 + r) * (q.r * 1.25 + .9 + r)) return false;
    for (const q of placed) if (dist2(x, z, q[0], q[1]) < (q[2] + r) * (q[2] + r)) return false;
    return true;
  };
  const waterD = (x, z) => { let d = B.ter.dry ? 99 : B.dStrAt(x, z); if (B.sea !== undefined && H(x, z) < B.sea + .6) d = 0; for (const q of B.ponds) d = Math.min(d, Math.hypot(x - q.x, z - q.z) - q.r); return d; };
  const slope = (x, z) => Math.abs(H(x + .5, z) - H(x - .5, z)) + Math.abs(H(x, z + .5) - H(x, z - .5));
  const find = (r, o = {}) => {
    for (let t = 0; t < 90; t++) {
      const x = rng.range(-BH + 1, BH - 1), z = rng.range(-BH + 1, BH - 1);
      if (!free(x, z, r, o.roadMin)) continue;
      if (!o.steep && slope(x, z) > (o.maxSlope || .32)) continue;
      const dr = B.dRoadAt(x, z); if (o.near && dr > o.near) continue; if (o.far && dr < o.far) continue;
      if (o.water && waterD(x, z) > o.water) continue;
      return [x, z];
    }
    return null;
  };
  const drop = (build, r, o = {}) => { const p = o.at || find(r, o); if (!p) return null; const T = new Soup(); build(T); B.put(T, p[0], p[1], { ry: o.ry === undefined ? rng() * TAU : o.ry, s: o.s, r: o.r, dy: o.dy, ao: o.ao }); placed.push([p[0], p[1], r]); return p; };
  const beside = (smin, smax, d, r) => {
    for (let t = 0; t < 40; t++) {
      const i = clamp(Math.round(rng.range(smin, smax) / PATH_STEP), 2, B.n - 3), side = rng.sign();
      const x = B.px[i] - B.tz[i] * side * (ROAD_HALF + d), z = B.pz[i] + B.tx[i] * side * (ROAD_HALF + d);
      if (free(x, z, r, d - r - .05) && slope(x, z) < .4) return [x, z, Math.atan2(B.tz[i], B.tx[i]), side];
    }
    return null;
  };
  const bio = B.bio;
  const at = (x, z, build, r, T0) => { if (Math.abs(x) > BH - .8 || Math.abs(z) > BH - .8) return; const T = T0 || new Soup(); if (!T0) build(T); B.put(T, x, z, { ry: rng() * TAU }); if (r) placed.push([x, z, r]); };
  const nA = k => Math.round(k * AREA), nL = k => Math.round(k * LIN); // by-area and by-road-length counts for the larger board
  for (let k = 0; k < 2; k++) drop(T => PROP.towerRuin(T, rng), 2.9, { far: 3.6 });
  drop(T => PROP.well(T, rng), 1.3, { near: 5.5, far: 2.6 });
  drop(T => PROP.statue(T, rng), 1.2, { near: 6, far: 2.4 });
  drop(T => PROP.ribcage(T, rng), 2.4, { far: 2.8 });
  for (let k = 0; k < nA(3); k++) { const len = rng.range(4, 7); drop(T => PROP.wallRun(T, rng, len, rng.range(1.8, 3.2)), len * .5, { far: 1.6 }); }
  { const g = find(3.2, { far: 3.4 }); if (g) {
      const ry = rng() * TAU, cs = Math.cos(ry), sn = Math.sin(ry);
      for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) { if (rng() < .2) continue; const lx = (c - 1.5) * 1.15 + rng.range(-.15, .15), lz = (r - 1) * 1.5 + rng.range(-.15, .15), T = new Soup(); PROP.grave(T, rng); B.put(T, g[0] + lx * cs + lz * sn, g[1] - lx * sn + lz * cs, { ry: ry + rng.range(-.2, .2) }); }
      for (const [lx, lz, a, len] of [[0, -2.5, 0, 4.6], [-2.8, -.2, HPI, 4.2], [2.8, .5, HPI, 3]]) { const T = new Soup(); PROP.fence(T, rng, len); B.put(T, g[0] + lx * cs + lz * sn, g[1] - lx * sn + lz * cs, { ry: ry + a }); }
      const T = new Soup(); PROP.tree(T, rng, 3.6); B.put(T, g[0] + 2.3 * cs - 2.0 * sn, g[1] - 2.3 * sn - 2.0 * cs, {});
      placed.push([g[0], g[1], 3.2]);
    } }
  for (let k = 0; k < 2; k++) { const p = beside(10, B.L - 8, 1.25, 1.1); if (p) drop(T => PROP.cart(T, rng, k === 1), 1.1, { at: p, ry: -p[2] + rng.range(-.3, .3), r: k === 1 ? [0, -p[2] + .4, .22] : undefined }); }
  for (let k = 0; k < nL(4); k++) { const p = beside(8, B.L - 6, .75, .3); if (p) { const len = rng.range(2.6, 4.2); drop(T => PROP.palisade(T, rng, len), 1.0, { at: p, ry: -p[2] }); } }
  for (let k = 0; k < nL(5); k++) { const p = beside(8, B.L - 6, 1.0, .4); if (p) { const len = rng.range(2.2, 3.6); drop(T => PROP.juma(T, rng, len), 1.2, { at: p, ry: -p[2] + rng.range(-.15, .15) }); } }
  for (let k = 0; k < nL(6); k++) { const p = beside(8, B.L - 5, .8, .25); if (p) drop(T => PROP.banner(T, rng, [COL.clothR, COL.clothD, COL.clothR, COL.clothB][k & 3]), .3, { at: p, ry: -p[2] + HPI * p[3] }); }
  { const p = beside(B.L * .3, B.L * .7, .8, .3); if (p) drop(T => PROP.signpost(T, rng), .3, { at: p, ry: -p[2] }); }
  { const p = beside(12, B.L * .6, 1.4, .7); if (p) drop(T => PROP.wardrum(T, rng), .7, { at: p, ry: -p[2] + HPI * p[3] }); }
  for (let k = 0; k < nL(3); k++) { const p = beside(8, B.L - 6, .9, .35); if (p) { const q = drop(T => PROP.stoneLamp(T, rng), .35, { at: p, ry: -p[2] }); if (q) B.fires.push({ x: q[0], y: H(q[0], q[1]) + 1.02, z: q[1], size: .2, fx: { smoke: 0, embers: 0, glow: .7 } }); } }
  for (let k = 0; k < nL(3); k++) drop(T => PROP.rack(T, rng), .8, { near: 5, far: 1.2 });
  for (const pad of B.pads) {
    if (rng() < .35) continue;
    const a = rng() * TAU, x = pad.x + Math.cos(a) * 2.25, z = pad.z + Math.sin(a) * 2.25;
    if (B.dRoadAt(x, z) < ROAD_HALF + .7 || B.dStrAt(x, z) < 1.8) continue;
    const T = new Soup(); PROP.barrel(T, 0, 0, 0, 1, rng); if (rng() < .6) PROP.barrel(T, .5, 0, .15, .9, rng); if (rng() < .7) PROP.crate(T, -.1, 0, .55, .5, rng, rng()); if (rng() < .4) PROP.crate(T, -.12, .5, .55, .38, rng, rng());
    B.put(T, x, z, { ry: rng() * TAU }); placed.push([x, z, .8]);
  }
  for (let k = 0; k < 6; k++) { const x = B.lay.cave.x + rng.range(1.8, 7), z = B.zc + rng.sign() * rng.range(1.9, 5); if (free(x, z, .4, .2)) drop(T => PROP.bones(T, rng, rng.int(4, 7)), .5, { at: [x, z], ao: null }); }
  for (let k = 0; k < nA(5); k++) drop(T => PROP.bones(T, rng, rng.int(3, 5)), .45, { ao: null });
  for (let k = 0; k < nA(3); k++) drop(T => PROP.cairn(T, rng), .5, {});
  BIOME_DRESS[bio.key]({ B, rng, drop, find, beside, free, at, H, placed, slope });
  const trees = [];
  for (const [kind, cnt, h0, h1] of bio.trees) for (let k = 0; k < nA(cnt); k++) { const h = rng.range(h0, h1), p = drop(T => PROP[kind](T, rng, h), kind === 'tree' || kind === 'charred' ? .55 : .8, { far: 1.0, water: kind === 'huyang' && k < 6 ? 5.5 : 0 }); if (p && kind === 'tree') trees.push([p, h]); }
  for (let k = 0; k < bio.webs && k < trees.length; k++) {
    const [p, h] = trees[k], y = H(p[0], p[1]), a = rng() * TAU, T = new Soup();
    PROP.web(T, [0, h * .42, 0], [Math.cos(a) * .9, h * .55, Math.sin(a) * .9], [Math.cos(a) * .7, h * .18, Math.sin(a) * .7]);
    B.put(T, p[0], p[1], { y, ao: null });
  }
  for (let k = 0; k < nA(bio.stumps); k++) drop(T => PROP.stump(T, rng), .4, {});
  for (let k = 0; k < nA(bio.rocks); k++) { const r = rng() < .2 ? rng.range(.6, 1.25) : rng.range(.16, .5); drop(T => T.rock(r, 0, r * .28, 0, mixC(COL.stoneD, COL.stone, rng())), r * .8, { steep: true, roadMin: .25, ao: [0, r * .6, .6] }); }
  for (let k = 0; k < nA(bio.tufts); k++) {
    const x = rng.range(-BH + .8, BH - .8), z = rng.range(-BH + .8, BH - .8);
    if (B.dRoadAt(x, z) < ROAD_HALF + .35 || waterD(x, z) < 1.1 || slope(x, z) > .5) continue;
    if (Math.abs(x - B.kx) < 5.4 && z < BN + 6.4) continue;
    if (B.ter.abyss !== undefined && H(x, z) < B.ter.abyss) continue;
    const T = new Soup(); PROP.tuft(T, rng); B.put(T, x, z, { ao: null, s: rng.range(.8, 1.5) });
  }
  for (let k = 0; k < nL(60); k++) {
    const i = rng.int(16, B.n - 12), side = rng.sign(), d = ROAD_HALF + rng.range(.1, .45), x = B.px[i] - B.tz[i] * side * d, z = B.pz[i] + B.tx[i] * side * d;
    if (B.dStrAt(x, z) < 2.4) continue;
    const r = rng.range(.08, .17), T = new Soup(); T.rock(r, 0, r * .3, 0, mixC(COL.roadD, COL.stone, rng())); B.put(T, x, z, { ao: null });
  }
}
