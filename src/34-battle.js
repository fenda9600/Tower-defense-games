// Set dressing for the six battlefields: war camps, warships, city walls on the cliff rim, the plank road over the chasms.
Object.assign(COL, { canvas: C(0xc4b494), canvasD: C(0x8a7c64), char: C(0x1c1612), flame: C(0xff6a1c), hanR: C(0x9a2a1c), weiB: C(0x2a3e5c) });

// both windings, for thin cloth and planks seen from either side
function dquad(S, a, b, c, d, col, layer, rough, o) { const st = S.P.length; S.quad(a, b, c, d, col, layer, rough, o); S._double(st); }

Object.assign(PROP, {
  // A ridge tent of oiled canvas on two poles, guy ropes pegged out. burnt: blackened, smouldering. fire: the canvas alight.
  tent(S, rng, o = {}) {
    const L = rng.range(1.3, 1.8), W = rng.range(.62, .8), H = rng.range(.92, 1.15), burnt = o.burnt || o.fire, door = o.door || COL.clothR;
    const cv = o.fire ? mixC(COL.char, COL.flame, .6) : burnt ? mixC(COL.char, COL.canvasD, .25) : mulC(o.col || COL.canvas, .85 + .25 * rng());
    const em = o.fire ? { emis: .55 } : burnt ? { emis: .02 } : undefined;
    for (const sg of [-1, 1]) dquad(S, [-L / 2, .02, sg * W], [L / 2, .02, sg * W], [L / 2, H, 0], [-L / 2, H, 0], mulC(cv, sg > 0 ? 1 : .82), L_CLOTH, .95, em);
    for (const sx of [-1, 1]) {
      const st = S.P.length; S.tri([sx * L / 2, .02, -W], [sx * L / 2, .02, W], [sx * L / 2, H, 0], mulC(cv, .9), L_CLOTH, .95, em); S._double(st);
      S.seg([sx * L / 2, 0, 0], [sx * L / 2, H + .14, 0], .03, .025, COL.woodD, { l: L_WOOD, n: 4 });
      for (const sz of [-1, 1]) S.seg([sx * L / 2, H - .05, 0], [sx * (L / 2 + .45), .02, sz * (W + .35)], .008, .008, COL.rope, { n: 3, jit: 0 });
    }
    if (!burnt) { const st = S.P.length; S.tri([L / 2 + .01, .02, -W * .45], [L / 2 + .01, .02, W * .45], [L / 2 + .01, H * .62, 0], door, L_CLOTH, .95); S._double(st); }
    S.seg([-L / 2 - .05, H + .01, 0], [L / 2 + .05, H + .01, 0], .03, .03, COL.woodD, { l: L_WOOD, n: 4 });
    if (burnt) for (let k = 0; k < 4; k++) S.box(rng.range(.3, .6), .06, .08, rng.range(-L / 2, L / 2), .04, rng.range(-W, W), [.7, .18, .03], { emis: rng.range(.15, .3), r: [0, rng() * TAU, 0] });
  },
  // A campfire ring; the flame itself is a board fire.
  campfire(S, rng) {
    for (let k = 0; k < 8; k++) { const a = k / 8 * TAU; S.rock(.11, Math.cos(a) * .38, .05, Math.sin(a) * .38, mixC(COL.stoneD, COL.stone, rng()), { sq: .7 }); }
    for (let k = 0; k < 4; k++) { const a = k / 4 * TAU + rng() * .4; S.seg([Math.cos(a) * .3, .03, Math.sin(a) * .3], [0, .3, 0], .045, .035, mulC(COL.bark, .6), { l: L_WOOD, n: 5 }); }
    S.cyl(.24, .04, 0, .04, 0, [.8, .25, .04], { n: 7, emis: .3, jit: 0 });
  },
  // A tower warship of the river fleets: a long hull, a two-storey castle aft, a mat sail, length about L * .74 + 1.5.
  // burning: scorched and glowing, but still hull, castle and sail, so it reads as a ship on dark water.
  warship(S, rng, o = {}) {
    const L = o.L || rng.range(3.4, 4.2), burnt = o.burning, wood = burnt ? mixC(COL.char, COL.woodD, .6) : mulC(COL.woodD, .9 + .2 * rng()), deck = burnt ? mixC(COL.char, COL.wood, .45) : COL.wood;
    const hot = burnt ? { emis: .05 } : {};
    S.box(L * .74, .42, .98, 0, -.02, 0, wood, { l: L_WOOD });
    for (const sg of [-1, 1]) {
      S.box(.9, .4, .86, sg * (L * .37 + .3), .12, 0, wood, { l: L_WOOD, r: [0, 0, sg * .42] });
      S.box(L * .76, .12, .08, 0, .26, sg * .53, mulC(wood, 1.15), { l: L_WOOD });
      // oars: false ships them along the gunwale, as on a fleet lashed together
      for (let k = 0; k < 6; k++) { const x = -L * .3 + k * L * .12, ow = o.oars === false; S.seg([x, .2, sg * .5], ow ? [x - .9, .34, sg * .58] : [x - .25, -.22, sg * 1.05], .018, .016, mulC(COL.woodL, burnt ? .5 : .8), { l: L_WOOD, n: 3 }); }
    }
    S.box(L * .72, .05, 1.04, 0, .2, 0, deck, { l: L_WOOD });
    const cx = -L * .2;
    S.box(1.3, .55, .86, cx, .5, 0, burnt ? mulC(COL.lacq, .5) : COL.lacq, Object.assign({ l: L_WOOD }, hot));
    S.box(1.42, .06, .98, cx, .8, 0, wood, { l: L_WOOD });
    S.box(.9, .42, .66, cx - .1, 1.04, 0, burnt ? mulC(COL.lacqD, .55) : COL.lacqD, Object.assign({ l: L_WOOD }, hot));
    cnRoof(S, { x: cx - .1, y: 1.25, a: .6, b: .46, h: .3, ridge: .3, col: burnt ? mulC(COL.tileD, .55) : COL.tileD, n: 2, m: 2 });
    for (const sg of [-1, 1]) cnMerlons(S, -L * .36, sg * .5, L * .3, sg * .5, .26, { rng, h: .2, w: .16, d: .06, pitch: .32, col: mulC(wood, 1.2), skip: burnt ? .35 : 0 });
    const mx = L * .14;
    S.seg([mx, .2, 0], [mx, 2.7, 0], .06, .045, wood, { l: L_WOOD, n: 5 });
    const T = new Soup(); clothPanel(T, { x0: -.55, x1: .55, yTop: 0, len: 1.7, z: 0, col: burnt ? mulC(COL.ramD, .7) : mulC(COL.ramD, 1.1), rng, nx: 3, ny: 6, rag: burnt ? .6 : 0, sway: .3 });
    S.merge(T, { p: [mx + .05, 2.55, 0], ry: HPI + .25, ao: null });
    for (let k = 0; k < 6; k++) S.seg([mx - .05, 2.5 - k * .3, -.6], [mx - .05, 2.5 - k * .3, .6], .012, .012, COL.woodD, { l: L_WOOD, n: 3 });
    cnBanner(S, -L * .45, .2, 1.9, 0, o.flag || COL.clothB, rng, { w: .34, len: .9 });
    if (burnt) for (let k = 0; k < 7; k++) S.box(rng.range(.2, .5), .05, .06, rng.range(-L * .35, L * .3), .24, rng.range(-.4, .4), [.8, .22, .03], { emis: rng.range(.18, .35), r: [0, rng() * TAU, 0] });
  },
  // A small river sampan with a mat awning.
  sampan(S, rng) {
    const L = rng.range(1.5, 1.9), w = mulC(COL.woodD, .9 + .2 * rng());
    S.box(L * .7, .2, .5, 0, 0, 0, w, { l: L_WOOD });
    for (const sg of [-1, 1]) S.box(.4, .18, .44, sg * (L * .35 + .12), .06, 0, w, { l: L_WOOD, r: [0, 0, sg * .45] });
    const st = S.P.length;
    for (let k = 0; k <= 6; k++) { const a = PI * k / 6, a2 = PI * (k + 1) / 6; if (k < 6) S.quad([-.3, .1 + Math.sin(a) * .32, Math.cos(a) * .26], [.3, .1 + Math.sin(a) * .32, Math.cos(a) * .26], [.3, .1 + Math.sin(a2) * .32, Math.cos(a2) * .26], [-.3, .1 + Math.sin(a2) * .32, Math.cos(a2) * .26], mulC(COL.thatch, .7 + .2 * rng()), L_THATCH, .95); }
    S._double(st);
    S.seg([L * .3, .1, 0], [L * .62, .6, .1], .014, .012, COL.woodL, { l: L_WOOD, n: 3 });
  },
  // A stretch of rammed-earth city wall faced in stone, with a walkway and crenels. Runs along x.
  cityWall(S, rng, len, h) {
    const mc = () => mixC(COL.stoneD, COL.stoneL, rng() * .7 + .1);
    S.box(len + .02, h + 1.2, .62, 0, (h - 1.2) / 2, 0, mc(), { l: L_MASON, jit: .03 });
    S.box(len + .04, .1, .7, 0, h + .05, 0, COL.stoneL, { l: L_MASON });
    cnMerlons(S, -len / 2, .3, len / 2, .3, h + .1, { rng, h: .26, w: .22, d: .12, pitch: .4 });
  },
  // A small watchtower over the wall: a brick base, a lacquered storey, a hipped roof.
  watchtower(S, rng) {
    S.box(1.1, 1.8, 1.1, 0, .5, 0, mixC(COL.stoneD, COL.stone, .5), { l: L_MASON });
    S.box(.9, .55, .9, 0, 1.68, 0, COL.lacq, { l: L_WOOD });
    S.box(.95, .08, .95, 0, 1.42, 0, COL.woodD, { l: L_WOOD });
    cnRoof(S, { y: 1.95, a: .78, h: .45, col: COL.tile });
  },
  // One bay of a cliff plank road on the road's side sg, running along x: planks over a joist that juts from the rock,
  // a dark edge beam, a strut down to the cliff, and a hand rail on posts every other bay.
  plankway(S, rng, sg, post) {
    const z0 = ROAD_HALF - .2, z1 = ROAD_HALF + 1.15, L = PATH_STEP * 2, wd = mulC(COL.woodD, .75);
    for (const x of [-L / 4, L / 4]) S.box(L / 2 - .04, .06, z1 - z0, x, .02, sg * (z0 + z1) / 2, mulC(COL.woodL, .6 + .3 * rng()), { l: L_WOOD, jit: .04 });
    S.box(.1, .1, z1 - z0 + .7, 0, -.08, sg * (z0 + z1 + .7) / 2, wd, { l: L_WOOD });
    S.box(L + .04, .16, .06, 0, -.01, sg * z1, wd, { l: L_WOOD });
    S.seg([0, -.1, sg * (z1 - .05)], [0, -1.3, sg * (ROAD_HALF + .1)], .045, .04, wd, { l: L_WOOD, n: 4 });
    S.box(L + .04, .05, .05, 0, .7, sg * (z1 - .05), COL.woodD, { l: L_WOOD });
    if (post) S.box(.06, .72, .06, 0, .36, sg * (z1 - .05), COL.woodD, { l: L_WOOD });
  },
  // A pavise, the tall shield the river line was dressed with: lacquered in the army's colour, a pale badge, faces +z.
  pavise(S, rng, col) {
    S.box(.44, .7, .05, 0, .37, 0, mulC(col, .85 + .3 * rng()), { l: L_WOOD, r: [-.18, 0, 0] });
    S.box(.24, .24, .02, 0, .44, .04, COL.bone, { l: L_CLOTH, r: [-.18, 0, 0] });
    S.seg([0, .2, -.05], [0, -.02, -.4], .02, .02, COL.woodD, { l: L_WOOD, n: 3 });
  },
});

// A camp: a few tents round a fire, a banner, and with o.gate (the world angle the camp opens toward) a palisade round the other three sides; o.s scales the whole camp.
// o.fire sets some tents alight; o.hearth === false leaves out the stone fire ring, where a board fire stands in for it.
function campAt(X, x, z, ry, o = {}) {
  const { B, rng } = X, T = new Soup(), n = o.n || rng.int(2, 4);
  for (let k = 0; k < n; k++) {
    const a = k / n * TAU + rng.range(-.3, .3), d = rng.range(1.25, 1.6), S2 = new Soup();
    PROP.tent(S2, rng, { burnt: o.burnt && rng() < .75, fire: o.fire && rng() < .6, col: o.col, door: o.door });
    T.merge(S2, { p: [Math.cos(a) * d, 0, Math.sin(a) * d], ry: -a + HPI + rng.range(-.2, .2) });
  }
  if (o.hearth !== false) { const F = new Soup(); PROP.campfire(F, rng); T.merge(F, { p: [0, 0, 0] }); }
  if (o.flag) { const Fl = new Soup(); PROP.banner(Fl, rng, o.flag, 3.2); T.merge(Fl, { p: [.6, 0, -.5] }); }
  if (o.gate !== undefined) for (let k = 1; k < 4; k++) {
    const b = o.gate + ry + k * HPI, P = new Soup(); PROP.palisade(P, rng, 2.0);
    T.merge(P, { p: [Math.cos(b) * 2.45, 0, Math.sin(b) * 2.45], ry: -b - HPI });
  }
  B.put(T, x, z, { ry, s: o.s, ao: [0, .45, .6] });
  return [x, z];
}

// stable ground near (x, z) for a camp: free of the road, pads, water and other props, not too steep
function campSpot(X, x, z, r) {
  if (!X.free(x, z, r, .5)) return false;
  return X.slope(x, z) < .55 && X.slope(x + r * .6, z) < .7 && X.slope(x - r * .6, z) < .7 && X.slope(x, z + r * .6) < .7 && X.slope(x, z - r * .6) < .7;
}

// a spot on open water, clear of the board edge, the causeway and what is already afloat
function waterSpot(X, r, tries = 200) {
  const { B, rng } = X;
  for (let t = 0; t < tries; t++) {
    const x = rng.range(-BH + 1.6 + r, BH - 1.6 - r), z = rng.range(-BH + 1.6 + r, BH - 1.6 - r);
    if (B.dRoadAt(x, z) < ROAD_HALF + 1.6 + r * .6) continue;
    let ok = true; for (let k = 0; k < 8 && ok; k++) { const a = k / 8 * TAU; if (X.H(x + Math.cos(a) * r, z + Math.sin(a) * r) > B.sea - .35) ok = false; }
    if (!ok || X.placed.some(q => dist2(x, z, q[0], q[1]) < (q[2] + r) * (q[2] + r))) continue;
    return [x, z];
  }
  return null;
}

// a tree spot with level footing round the trunk and no ground rising past its crown: steep boards are all risers and pillars
function treeSpot(X, h, o, tries = 14) {
  const ab = X.B.ter.abyss;
  for (let t = 0; t < tries; t++) {
    const p = X.find(.7, o); if (!p) return null;
    const y = X.H(p[0], p[1]); let lo = y, hi = y, crown = -1e9;
    for (let k = 0; k < 8; k++) {
      const c = Math.cos(k / 8 * TAU), s = Math.sin(k / 8 * TAU), g = X.H(p[0] + c * .25, p[1] + s * .25);
      lo = Math.min(lo, g); hi = Math.max(hi, g); crown = Math.max(crown, X.H(p[0] + c * 1.2, p[1] + s * 1.2));
    }
    if (hi - lo < .45 && crown < y + h * .6 && (ab === undefined || lo > ab + .5)) return p;
  }
  return null;
}

// fires on the board are capped: every flame is a light and a particle source
function addFire(B, x, y, z, size, smoke) { if (B.fires.length >= 12) return; B.fires.push({ x, y, z, size, fx: { layers: size > .5 ? 2 : 1, smoke: smoke || 1.2, embers: 1.1, glow: .8 } }); }

Object.assign(BIOME_DRESS, {
  diaoyu(X) {
    const { B, rng, H } = X, sea = B.sea;
    // the city wall rides the rim of the cliffs above the river: climb in from the water along each near side to the top of the terraced cliff
    for (const side of [0, 1]) {
      const rim = [];
      // along the right edge the river bends away before the keep and its rim runs aslant, which this search across rows cannot follow
      for (let v = side ? -BH + 1 : BN + 18; v <= BH - 1; v += .8) {
        const P = u => side ? [v, u] : [u, v], h = u => H(...P(u));
        if (h(BH - .4) > sea + .3) continue;
        for (let u = BH - .5; u > Math.max(v, 2); u -= .1) {
          if (h(u) < sea + 2 || h(u + .7) > h(u) - .9 || h(u - .8) > h(u) + .6) continue;
          const [wx, wz] = P(u - .35);
          rim.push([wx, wz, X.free(wx, wz, .1, .4)]);
          break;
        }
      }
      const segs = [];
      for (let i = 0, run = 0; i < rim.length - 1; i++) {
        const [ax, az, fa] = rim[i], [bx, bz, fb] = rim[i + 1], dx = bx - ax, dz = bz - az, d = Math.hypot(dx, dz);
        if (!fa || !fb || d > 1.8 || Math.abs(H(ax, az) - H(bx, bz)) > .8) { run++; continue; }
        const nx = side ? -dz / d : dz / d, nz = side ? dx / d : -dx / d, mx = (ax + bx) / 2, mz = (az + bz) / 2, y = Math.min(H(ax, az), H(bx, bz), H(mx, mz)) - .12;
        const T = new Soup(); PROP.cityWall(T, rng, d + .12, .9);
        B.put(T, mx, mz, { y, ry: Math.atan2(nx, nz), ao: null });
        segs.push([mx, mz, nx, nz, y, d, run]);
      }
      // a watchtower where each stretch of wall ends, and about every five paces along it
      const towers = [];
      for (let k = 0, since = 0; k < segs.length; k++) {
        const [mx, mz, nx, nz, y, d, run] = segs[k], first = !k || segs[k - 1][6] !== run, end = first || k === segs.length - 1 || segs[k + 1][6] !== run;
        since = first ? 0 : since + d;
        const tx = mx - nx * .25, tz = mz - nz * .25;
        if ((!end && since < 5) || !X.free(tx, tz, .55, .4) || towers.some(t => dist2(t[0], t[1], tx, tz) < 2.4 * 2.4)) continue;
        const W = new Soup(); PROP.watchtower(W, rng); B.put(W, tx, tz, { y: y + .05, ry: Math.atan2(nx, nz), ao: null }); towers.push([tx, tz]); since = 0;
      }
      for (const [x, z, f] of rim) if (f) X.placed.push([x, z, .45]);
    }
    for (let k = 0; k < Math.round(4 * LIN); k++) { const p = waterSpot(X, 1.1); if (!p) break; const T = new Soup(); PROP.sampan(T, rng); B.put(T, p[0], p[1], { y: sea - .06, ry: rng() * TAU, ao: null }); X.placed.push([p[0], p[1], 1.1]); }
    for (let k = 0; k < Math.round(7 * AREA); k++) { const hh = rng.range(2.6, 4); X.drop(T => PROP.bamboo(T, rng, hh), .7, { far: 1.0, maxSlope: .4 }); }
    for (let k = 0; k < Math.round(2 * AREA); k++) X.drop(T => PROP.log(T, rng), .9, { far: 1.2, maxSlope: .15 });
  },
  chibi(X) {
    const { B, rng, H } = X, SC = 1.25, LEN = 5.1, GAP = 5.3, sea = B.sea, ships = [];
    // firelight thrown across the water towards the viewer, which is the +x +z diagonal on either mirror
    const glare = (x, z, n) => {
      const T = new Soup();
      for (let k = 0; k < n; k++) { const d = rng.range(.6, 3.4), w = rng.range(-1, 1) * (.4 + d * .3); T.box(rng.range(.35, .9), .01, rng.range(.06, .12), (d - w) * .7071, 0, (d + w) * .7071, [.9, .32, .07], { emis: rng.range(.12, .3) * (1.2 - d * .25), r: [0, -PI / 4, 0] }); }
      B.put(T, x, z, { y: sea + .015, ao: null });
    };
    // a ship's whole footprint, oars included, must lie on open water, and in the camera's window
    const afloat = (x, z, dx, dz, w = 1.3) => {
      if (viewRoom(x, z) < 2.4) return false;
      for (let a = -LEN / 2; a <= LEN / 2 + .01; a += LEN / 6) for (const b of [-w, -.7, 0, .7, w]) {
        const px = x + dx * a - dz * b, pz = z + dz * a + dx * b;
        if (Math.abs(px) > BH - .2 || Math.abs(pz) > BH - .2 || H(px, pz) > sea - (Math.abs(b) > .71 ? 0 : .35) || B.dRoadAt(px, pz) < ROAD_HALF + .8) return false;
      }
      return !ships.some(q => dist2(x, z, q[0], q[1]) < 5 * 5);
    };
    // the chained fleet: warships lashed bow to stern, grown link by link along the river's bends, most of them burning
    const grow = (x, z, a) => {
      const out = [[x, z, a]];
      while (out.length < 5) {
        const [px, pz, pa] = out[out.length - 1]; let next = null;
        for (const da of [0, .2, -.2, .4, -.4, .6, -.6, .8, -.8]) { const b = pa + da, qx = px + Math.cos(b) * GAP, qz = pz + Math.sin(b) * GAP; if (afloat(qx, qz, Math.cos(b), Math.sin(b), .85)) { next = [qx, qz, b]; break; } }
        if (!next) break; out.push(next);
      }
      return out;
    };
    let fleet = [], bestSc = -1e9;
    for (let z = -BH + 1.5; z < BH - 1; z += 1) for (let x = -BH + 1.5; x < BH - 1; x += 1) {
      if (H(x, z) > sea - .35) continue;
      for (let d = 0; d < 16; d++) {
        const a = d / 16 * TAU; if (!afloat(x, z, Math.cos(a), Math.sin(a), .85)) continue;
        const f = grow(x, z, a), m = f[f.length >> 1], sc = f.length * 100 - Math.abs(m[0] + m[1] - (VIEW.far + 3 * VIEW.near) / 4) - Math.abs(m[0] - m[1] - (VIEW.left + VIEW.right) / 2) * .6;
        if (sc > bestSc) { bestSc = sc; fleet = f; }
      }
    }
    fleet.forEach(([x, z, a], i) => {
      const burning = i < fleet.length - 1 || fleet.length === 1, T = new Soup(), dx = Math.cos(a), dz = Math.sin(a);
      PROP.warship(T, rng, { burning, flag: COL.weiB, L: 3.5, oars: false });
      B.put(T, x, z, { y: sea - .12, ry: -a, s: SC, ao: null }); X.placed.push([x, z, 3]); ships.push([x, z]);
      if (burning) { addFire(B, x + dx * .5, sea + 1.1, z + dz * .5, .9, 2.4); glare(x, z, 14); }
      if (i) {
        const [px, pz] = fleet[i - 1], ax = px + Math.cos(fleet[i - 1][2]) * LEN * .45, az = pz + Math.sin(fleet[i - 1][2]) * LEN * .45, bx = x - dx * LEN * .45, bz = z - dz * LEN * .45, l = Math.hypot(bx - ax, bz - az), C2 = new Soup();
        for (let s = 0; s < 5; s++) C2.seg([s / 5 * l, .3 - Math.sin(s / 5 * PI) * .12, 0], [(s + 1) / 5 * l, .3 - Math.sin((s + 1) / 5 * PI) * .12, 0], .04, .04, COL.iron, { l: L_METAL, n: 3 });
        B.put(C2, ax, az, { y: sea, ry: -Math.atan2(bz - az, bx - ax), ao: null });
      }
    });
    // the fire lights the water under the fleet
    for (let i = 0, n = Math.min(3, fleet.length); i < n; i++) { const f = fleet[n === 1 ? 0 : Math.round(i * (fleet.length - 1) / (n - 1))]; B.env.push({ x: f[0], y: sea + .9, z: f[1], c: 0xff6a24, I: 60, d: 11, flick: 1 }); }
    // Cao Cao's ships still at anchor, and Huang Gai's fire boats among them
    for (let t = 0, n = 0; t < 400 && n < Math.round(3 * LIN); t++) {
      const x = rng.range(-BH + 3, BH - 3), z = rng.range(-BH + 3, BH - 3), a = rng() * PI, dx = Math.cos(a), dz = Math.sin(a);
      if (!afloat(x, z, dx, dz)) continue;
      const burning = n === 0, T = new Soup(); PROP.warship(T, rng, { burning, flag: COL.clothR, L: 3.5 });
      B.put(T, x, z, { y: sea - .12, ry: -a, s: SC, ao: null }); X.placed.push([x, z, 3]); ships.push([x, z]); n++;
      if (burning) { addFire(B, x, sea + 1.0, z, .6, 1.8); glare(x, z, 8); }
    }
    for (let k = 0; k < Math.round(2 * AREA); k++) X.drop(T => PROP.wreck(T, rng), 2.2, { far: 1.8, water: 2.5 });
    for (let k = 0; k < Math.round(5 * AREA); k++) { const hh = rng.range(2.0, 4.0); X.drop(T => PROP.spire(T, rng, hh, [COL.stoneD, COL.stone, C(0x7a2e22), COL.stoneL]), hh * .28, { far: 1.6, maxSlope: .35, dy: -.1 }); }
  },
  yinping(X) {
    const { B, rng, H } = X;
    // the plank road: where the ledge falls away beside the road, beams are let into the rock and planks laid over them
    for (let i = 14; i < B.n - 10; i += 2) {
      if (Math.abs(i - B.ci0) * PATH_STEP < 3.2) continue;
      const x0 = B.px[i], z0 = B.pz[i], y = B.py[i], nx = -B.tz[i], nz = B.tx[i];
      for (const sg of [-1, 1]) {
        const ox = x0 + nx * sg * (ROAD_HALF + 1.3), oz = z0 + nz * sg * (ROAD_HALF + 1.3);
        if (H(ox, oz) > y - 1.1) continue;
        if (B.pads.some(p => dist2(p.x, p.z, ox, oz) < 9)) continue;
        const T = new Soup(); PROP.plankway(T, rng, sg, (i >> 1) % 2 === 0);
        B.put(T, x0, z0, { y, ry: -Math.atan2(B.tz[i], B.tx[i]), ao: null });
      }
    }
    // Deng Ai's men left their mark: felt rolls and rope at the steepest drops, and a cairn to the dead
    for (let k = 0; k < Math.round(4 * AREA); k++) X.drop(T => PROP.cairn(T, rng), .5, {});
    for (let k = 0; k < Math.round(14 * AREA); k++) { const hh = rng.range(2.4, 4.6), p = treeSpot(X, hh, { far: 1.0, steep: true }); if (p) X.drop(T => PROP.pine(T, rng, hh), .7, { at: p }); }
  },
  yiling(X) {
    const { B, rng, H } = X, camps = B.scx.camps;
    // seven hundred li of camps on shelves cut into the wooded slopes, each opening toward the road.
    // Lu Xun's fire has taken most: some still ablaze, some burnt out and smoking, a few untouched
    const STATE = ['ablaze', 'untouched', 'ablaze', 'smoking'];
    let lit = 0;
    camps.forEach((c, i) => {
      c.state = STATE[i % 4];
      const gate = Math.atan2(B.dRoadAt(c.x, c.z - .5) - B.dRoadAt(c.x, c.z + .5), B.dRoadAt(c.x - .5, c.z) - B.dRoadAt(c.x + .5, c.z));
      campAt(X, c.x, c.z, rng() * TAU, { burnt: c.state !== 'untouched', fire: c.state === 'ablaze', hearth: c.state === 'untouched', flag: COL.hanR, n: 3, gate, s: .68 });
      if (c.state !== 'ablaze') return;
      addFire(B, c.x, H(c.x, c.z) + .25, c.z, .9, 2.4);
      if (lit++ < 3) B.env.push({ x: c.x, y: H(c.x, c.z) + 1.2, z: c.z, c: 0xff6a24, I: 40, d: 9, flick: 1 });
    });
    // after the blazes, so the fire cap never takes one of theirs: smoke off the burnt-out camps, then the untouched camps' cookfires
    for (const c of camps) if (c.state === 'smoking') addFire(B, c.x, H(c.x, c.z) + .15, c.z, .35, 2.8);
    for (const c of camps) if (c.state === 'untouched') addFire(B, c.x, H(c.x, c.z) + .2, c.z, .3, .5);
    // the wooded gorge sides, mostly pine; the trees round the burnt camps are scorched
    for (let k = 0, song = 0; k < Math.round(22 * AREA); k++) {
      const h = rng.range(2.6, 4.4), p = treeSpot(X, h, { far: 1.6, steep: true }); if (!p) continue;
      const kind = camps.some(c => c.state !== 'untouched' && Math.hypot(p[0] - c.x, p[1] - c.z) < 4.5) ? 'charred' : song < 3 && rng() < .3 ? (song++, 'song') : 'pine';
      X.drop(T => PROP[kind](T, rng, h), .7, { at: p });
    }
    for (let k = 0; k < Math.round(3 * AREA); k++) { const hh = rng.range(2.6, 4), p = treeSpot(X, hh, { far: 1.2, steep: true }); if (p) X.drop(T => PROP.bamboo(T, rng, hh), .7, { at: p }); }
  },
  jingxing(X) {
    const { B, rng, H } = X, sea = B.sea, F = B.scx.line, R = B.ter.ranks, ry = Math.atan2(-F.wx, -F.wz);
    // back to the water: Han Xin's army drawn up on the shelf prep cut for it, the river behind and the pass in front.
    // u runs along the bank, d inland from the top of it
    const at = (u, d) => [F.x - F.wz * u - F.wx * d, F.z + F.wx * u - F.wz * d];
    const put = (T, u, d, s) => { const [x, z] = at(u, d); B.put(T, x, z, { ry: ry + rng.range(-.04, .04), s }); };
    // the shelf has kept the common props off; free it for the line's own checks, and hold it again below for the trees and rocks still to come
    X.placed.splice(0, B.scx.sites.length);
    // a standard behind every other shield, and a watch fire in place of the standard a quarter of the way in from each end
    const n = Math.round(F.L / .7), u0 = -(n - 1) * .35, nb = Math.max(1, n >> 1), ub = j => (j - (nb - 1) / 2) * 1.4, q = nb >> 2;
    const fires = nb > 2 ? [ub(q), ub(nb - 1 - q)] : [ub(nb >> 1)];
    for (const d of R.shields) for (let i = 0; i < n; i++) { const T = new Soup(); PROP.pavise(T, rng, COL.hanR); put(T, u0 + i * .7, d, 1.6); }
    for (let j = 0; j < nb; j++) { if (fires.includes(ub(j))) continue; const T = new Soup(); PROP.banner(T, rng, COL.hanR, 3.4); put(T, ub(j), R.back); }
    // the chevaux-de-frise stand only where the ground in front of the shelf is free: the road or a pad may come close there
    for (let m = Math.floor((F.L + .2) / 2.2), i = 0; i < m; i++) {
      const u = (i - (m - 1) / 2) * 2.2, ends = [-.9, 0, .9].map(e => at(u + e, R.juma));
      if (!ends.every(([x, z]) => X.free(x, z, .35, .4) && X.slope(x, z) < .6)) continue;
      const T = new Soup(); PROP.juma(T, rng, 2.0); put(T, u, R.juma);
    }
    // watch fires among the standards light the shields from behind
    for (const f of fires) {
      const [x, z] = at(f, R.back), T = new Soup(); PROP.campfire(T, rng); B.put(T, x, z, {});
      addFire(B, x, H(x, z) + .2, z, .3, .5); B.env.push({ x, y: H(x, z) + 1.6, z, c: 0xff9a50, I: 26, d: 8, flick: 1 });
    }
    if (fires.length > 1) { const [x, z] = at(0, R.shields[0]); B.env.push({ x, y: H(x, z) + 1.4, z, c: 0xff9a50, I: 16, d: 7, flick: 1 }); }
    X.placed.push(...B.scx.sites);
    // the two thousand red flags Han Xin's riders planted on the heights above the pass
    for (let k = 0, m = 0; k < 300 * AREA && m < Math.round(14 * AREA); k++) {
      const x = rng.range(-BH + 1.5, BW + 22), z = rng.range(-BH + 1.5, BH - 1.5);
      if (H(x, z) < 3.6 || !X.free(x, z, .3, .4) || X.slope(x, z) > .5) continue;
      const T = new Soup(); PROP.banner(T, rng, COL.hanR, 2.6); B.put(T, x, z, { ry: rng() * TAU }); X.placed.push([x, z, .5]); m++;
    }
    // Zhao's camp at the mouth of the pass
    for (let t = 0; t < 60; t++) { const x = B.lay.cave.x + rng.range(3, 8), z = B.zc + rng.sign() * rng.range(3.5, 6); if (campSpot(X, x, z, 1.9)) { campAt(X, x, z, rng() * TAU, { flag: COL.weiB, n: 3 }); X.placed.push([x, z, 2.2]); addFire(B, x, H(x, z) + .2, z, .3, .5); break; } }
    for (let k = 0; k < Math.round(3 * LIN); k++) { const p = waterSpot(X, 1.0); if (!p) break; const T = new Soup(); PROP.sampan(T, rng); B.put(T, p[0], p[1], { y: sea - .06, ry: rng() * TAU, ao: null }); X.placed.push([p[0], p[1], 1.0]); }
  },
  jieting(X) {
    const { B, rng, H } = X, h = B.scx.hill, y = H(h.x, h.z), inside = (x, z) => B.ter.foot(B.scx, x, z, B.dRoadAt(x, z));
    // the whole hill was held clear of the common props; from here on only the camp on top needs holding
    B.scx.sites[0][2] = h.top + h.w + .2;
    // Ma Su's camp on the flat hilltop round a dry well, cut off from the water below
    // turn the three tents toward the summit's longest reaches, and size the camp to the shortest of those
    const reach = k => Math.min(h.rim[(k + 23) % 24], h.rim[k % 24], h.rim[(k + 1) % 24]);
    let k0 = 0, room = -1; for (let k = 0; k < 8; k++) { const m = Math.min(reach(k), reach(k + 8), reach(k + 16)); if (m > room) { room = m; k0 = k; } }
    const a0 = k0 / 24 * TAU, T = new Soup();
    PROP.well(T, rng);
    for (let k = 0; k < 3; k++) {
      const a = a0 + k / 3 * TAU, b = a + PI / 3, S = new Soup(), F = new Soup();
      PROP.tent(S, rng, { door: COL.hanR }); T.merge(S, { p: [Math.cos(a) * 1.9, 0, Math.sin(a) * 1.9], ry: -a + HPI, s: .75 });
      PROP.banner(F, rng, k ? COL.clothR : COL.hanR, 2.8); T.merge(F, { p: [Math.cos(b) * 1.15, 0, Math.sin(b) * 1.15] });
    }
    // laid out for a summit reaching 2.9; a smaller one gets the same camp drawn smaller
    B.put(T, h.x, h.z, { y, s: clamp((room - .4) / 2.5, .5, 1), ao: [0, .45, .6] });
    // Zhang He rings the foot with chevaux-de-frise and Wei standards, broken only where the road and the pads pass
    // a juma's whole footprint, both ends and both rows of stakes, must stand on open level ground
    const fits = (x, z, tx, tz, l) => {
      const q = [[x, z]]; for (const u of [-l, l]) for (const v of [-.8, .8]) q.push([x + tx * u - tz * v, z + tz * u + tx * v]);
      const g = q.map(p => H(p[0], p[1]));
      return Math.max(...g) - Math.min(...g) < .3 && q.every(p => X.free(p[0], p[1], .1, .2));
    };
    // where the strip between foot and road is too narrow for a juma, the line steps out a little or a standard stands in for it
    const flag = (x, z) => { const F = new Soup(); PROP.banner(F, rng, COL.weiB, 2.6); B.put(F, x, z, { ry: rng() * TAU }); X.placed.push([x, z, .3]); };
    for (let a = rng() * TAU, end = a + TAU, k = 0; a < end; k++) {
      const c = Math.cos(a), s = Math.sin(a), len = rng.range(2.0, 2.6);
      let r0 = 1; while (r0 < h.R + 2 && inside(h.x + c * r0, h.z + s * r0) > -.4) r0 += .1;
      let r = r0; while (r < r0 + 1.6 && !fits(h.x + c * r, h.z + s * r, -s, c, len / 2)) r += .3;
      const x = h.x + c * r, z = h.z + s * r;
      if (r < r0 + 1.6) {
        const J = new Soup(); PROP.juma(J, rng, len); B.put(J, x, z, { ry: -Math.atan2(c, -s) }); X.placed.push([x, z, .9]);
        const bx = x + c * .8 - s * (len / 2 + .3), bz = z + s * .8 + c * (len / 2 + .3);
        if (k % 2 === 0 && X.free(bx, bz, .2, .3)) flag(bx, bz);
        a += (len + .5) / r;
      } else {
        if (X.free(h.x + c * r0, h.z + s * r0, .2, .3)) flag(h.x + c * r0, h.z + s * r0);
        a += 1.6 / r0;
      }
    }
  },
});
