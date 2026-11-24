// Set dressing for the six battlefields: war camps, warships, city walls on the cliff rim, the plank road over the chasms.
Object.assign(COL, { canvas: C(0xc4b494), canvasD: C(0x8a7c64), char: C(0x1c1612), hanR: C(0x9a2a1c), weiB: C(0x2a3e5c) });

// both windings, for thin cloth and planks seen from either side
function dquad(S, a, b, c, d, col, layer, rough, o) { const st = S.P.length; S.quad(a, b, c, d, col, layer, rough, o); S._double(st); }

Object.assign(PROP, {
  // A ridge tent of oiled canvas on two poles, guy ropes pegged out. burnt: blackened, smouldering.
  tent(S, rng, o = {}) {
    const L = rng.range(1.3, 1.8), W = rng.range(.62, .8), H = rng.range(.92, 1.15), burnt = o.burnt, door = o.door || COL.clothR;
    const cv = burnt ? mixC(COL.char, COL.canvasD, .25) : mulC(o.col || COL.canvas, .85 + .25 * rng());
    const em = burnt ? { emis: .02 } : undefined;
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
  // A tower warship of the river fleets: a long hull, a two-storey castle aft, a mat sail. burning: charred and glowing.
  warship(S, rng, o = {}) {
    const L = rng.range(3.4, 4.2), burnt = o.burning, wood = burnt ? mixC(COL.char, COL.woodD, .35) : mulC(COL.woodD, .9 + .2 * rng()), deck = burnt ? mulC(COL.char, 1.4) : COL.wood;
    const hot = burnt ? { emis: .06 } : {};
    S.box(L * .74, .42, .98, 0, -.02, 0, wood, { l: L_WOOD });
    for (const sg of [-1, 1]) {
      S.box(.9, .4, .86, sg * (L * .37 + .3), .12, 0, wood, { l: L_WOOD, r: [0, 0, sg * .42] });
      S.box(L * .76, .12, .08, 0, .26, sg * .53, mulC(wood, 1.15), { l: L_WOOD });
      for (let k = 0; k < 6; k++) { const x = -L * .3 + k * L * .12; S.seg([x, .2, sg * .5], [x - .25, -.22, sg * 1.05], .018, .016, mulC(COL.woodL, burnt ? .4 : .8), { l: L_WOOD, n: 3 }); }
    }
    S.box(L * .72, .05, 1.04, 0, .2, 0, deck, { l: L_WOOD });
    const cx = -L * .2;
    S.box(1.3, .55, .86, cx, .5, 0, burnt ? mulC(COL.char, 1.2) : COL.lacq, Object.assign({ l: L_WOOD }, hot));
    S.box(1.42, .06, .98, cx, .8, 0, wood, { l: L_WOOD });
    S.box(.9, .42, .66, cx - .1, 1.04, 0, burnt ? mulC(COL.char, 1.1) : COL.lacqD, Object.assign({ l: L_WOOD }, hot));
    if (!burnt) cnRoof(S, { x: cx - .1, y: 1.25, a: .6, b: .46, h: .3, ridge: .3, col: COL.tileD, n: 2, m: 2 });
    else for (let k = 0; k < 3; k++) S.seg([cx - .5 + k * .4, 1.25, -.3], [cx - .4 + k * .4, 1.5, .3], .03, .02, COL.char, { l: L_WOOD, n: 3 });
    for (const sg of [-1, 1]) cnMerlons(S, -L * .36, sg * .5, L * .3, sg * .5, .26, { rng, h: .2, w: .16, d: .06, pitch: .32, col: mulC(wood, 1.2), skip: burnt ? .45 : 0 });
    const mx = L * .14, mh = burnt ? rng.range(1.3, 2.0) : 2.7;
    S.seg([mx, .2, 0], [mx, mh, 0], .06, .045, wood, { l: L_WOOD, n: 5 });
    if (!burnt) {
      const T = new Soup(); clothPanel(T, { x0: -.55, x1: .55, yTop: 0, len: 1.7, z: 0, col: mulC(COL.ramD, 1.1), rng, nx: 3, ny: 6, rag: 0, sway: .3 });
      S.merge(T, { p: [mx + .05, 2.55, 0], ry: HPI + .25, ao: null });
      for (let k = 0; k < 6; k++) S.seg([mx - .05, 2.5 - k * .3, -.6], [mx - .05, 2.5 - k * .3, .6], .012, .012, COL.woodD, { l: L_WOOD, n: 3 });
      cnBanner(S, -L * .45, .2, 1.9, 0, o.flag || COL.clothB, rng, { w: .34, len: .9 });
    } else {
      S.seg([mx, mh, 0], [mx + .5, mh - .5, .2], .035, .02, COL.char, { l: L_WOOD, n: 3 });
      for (let k = 0; k < 7; k++) S.box(rng.range(.2, .5), .05, .06, rng.range(-L * .35, L * .3), .24, rng.range(-.4, .4), [.8, .22, .03], { emis: rng.range(.18, .35), r: [0, rng() * TAU, 0] });
    }
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
  // A pavise, the tall shield the river line was dressed with.
  pavise(S, rng, col) {
    S.box(.44, .7, .05, 0, .37, 0, mulC(COL.wood, .8 + .3 * rng()), { l: L_WOOD, r: [-.18, 0, 0] });
    S.box(.3, .3, .02, 0, .42, .04, col, { l: L_CLOTH, r: [-.18, 0, 0] });
    S.seg([0, .2, -.05], [0, -.02, -.4], .02, .02, COL.woodD, { l: L_WOOD, n: 3 });
  },
});

// A camp: a few tents round a fire, a banner, a stretch of palisade. Returns the fire's spot.
function campAt(X, x, z, ry, o = {}) {
  const { B, rng } = X, T = new Soup(), n = o.n || rng.int(2, 4), cs = Math.cos(ry), sn = Math.sin(ry);
  for (let k = 0; k < n; k++) {
    const a = k / n * TAU + rng.range(-.3, .3), d = rng.range(1.25, 1.6), S2 = new Soup();
    PROP.tent(S2, rng, { burnt: o.burnt && rng() < .75, col: o.col, door: o.door });
    T.merge(S2, { p: [Math.cos(a) * d, 0, Math.sin(a) * d], ry: -a + HPI + rng.range(-.2, .2) });
  }
  const F = new Soup(); PROP.campfire(F, rng); T.merge(F, { p: [0, 0, 0] });
  if (o.flag) { const Fl = new Soup(); PROP.banner(Fl, rng, o.flag, 3.2); T.merge(Fl, { p: [.6, 0, -.5] }); }
  B.put(T, x, z, { ry, ao: [0, .45, .6] });
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

// fires on the board are capped: every flame is a light and a particle source
function addFire(B, x, y, z, size, smoke) { if (B.fires.length >= 12) return; B.fires.push({ x, y, z, size, fx: { layers: size > .5 ? 2 : 1, smoke: smoke || 1.2, embers: 1.1, glow: .8 } }); }

Object.assign(BIOME_DRESS, {
  diaoyu(X) {
    const { B, rng, H } = X;
    // the city wall rides the rim of the cliffs above the river
    let walls = 0;
    for (let z = -BH + 1.5; z < BH - 1; z += .95) for (let x = -BH + 1.5; x < BH - 1; x += .95) {
      if (walls > 60) break;
      const h = H(x, z); if (h < B.sea + 2.4) continue;
      const gx = H(x + 1.1, z) - H(x - 1.1, z), gz = H(x, z + 1.1) - H(x, z - 1.1), g = Math.hypot(gx, gz);
      if (g < 2.2 || gx + gz > 0 || !X.free(x, z, .5, .4)) continue;
      const lo = Math.min(H(x + 1.4, z), H(x, z + 1.4)); if (lo > h - 1.5) continue;
      const T = new Soup(); PROP.cityWall(T, rng, 1.05, .9); B.put(T, x, z, { ry: Math.atan2(gz, gx) - HPI, dy: -.15, ao: null }); X.placed.push([x, z, .5]); walls++;
    }
    for (let k = 0; k < 3; k++) { const p = X.find(1.0, { far: 2.5, steep: true }); if (p && H(p[0], p[1]) > B.sea + 2.5) { const T = new Soup(); PROP.watchtower(T, rng); B.put(T, p[0], p[1], { ry: rng() * TAU }); X.placed.push([p[0], p[1], 1.0]); } }
    for (let k = 0; k < 4; k++) { const p = waterSpot(X, 1.1); if (!p) break; const T = new Soup(); PROP.sampan(T, rng); B.put(T, p[0], p[1], { y: B.sea - .06, ry: rng() * TAU, ao: null }); X.placed.push([p[0], p[1], 1.1]); }
    for (let k = 0; k < 7; k++) { const hh = rng.range(2.6, 4); X.drop(T => PROP.bamboo(T, rng, hh), .7, { far: 1.0, steep: true }); }
    for (let k = 0; k < 2; k++) X.drop(T => PROP.log(T, rng), .9, { far: 1.2 });
  },
  chibi(X) {
    const { B, rng, H } = X;
    // the chained fleet: a line of warships lashed bow to stern, most of them already burning
    const axis = [.7071, .7071];
    let lit = 0;
    for (let fleet = 0; fleet < 2; fleet++) {
      const p = waterSpot(X, 2.2, 300); if (!p) break;
      let prev = null;
      for (let k = -1; k <= 1; k++) {
        const x = p[0] + axis[0] * k * 2.9 + rng.range(-.2, .2), z = p[1] + axis[1] * k * 2.9 + rng.range(-.2, .2);
        if (Math.abs(x) > BH - 2 || Math.abs(z) > BH - 2 || H(x, z) > B.sea - .4 || B.dRoadAt(x, z) < ROAD_HALF + 2) continue;
        const burning = fleet === 0 || rng() < .5, T = new Soup(); PROP.warship(T, rng, { burning, flag: COL.weiB });
        const ry = -Math.atan2(axis[1], axis[0]) + PI * .5 * 0 + rng.range(-.1, .1);
        B.put(T, x, z, { y: B.sea - .1, ry, ao: null }); X.placed.push([x, z, 2.0]);
        if (burning) { addFire(B, x - axis[0] * .7, B.sea + 1.0, z - axis[1] * .7, .75, 2.2); if (lit < 2) { B.env.push({ x, y: B.sea + 1.4, z, c: 0xff5a1e, I: 46, d: 10, flick: 1 }); lit++; } }
        if (prev) { const C2 = new Soup(), dx = x - prev[0], dz = z - prev[1], l = Math.hypot(dx, dz); for (let s = 0; s < 5; s++) C2.seg([s / 5 * l, .25 - Math.sin(s / 5 * PI) * .12, 0], [(s + 1) / 5 * l, .25 - Math.sin((s + 1) / 5 * PI) * .12, 0], .03, .03, COL.iron || COL.stoneD, { l: L_METAL, n: 3 }); B.put(C2, prev[0], prev[1], { y: B.sea, ry: -Math.atan2(dz, dx), ao: null }); }
        prev = [x, z];
      }
    }
    for (let k = 0; k < 3; k++) { const p = waterSpot(X, 2.0); if (!p) break; const burning = rng() < .6, T = new Soup(); PROP.warship(T, rng, { burning, flag: COL.clothR }); B.put(T, p[0], p[1], { y: B.sea - .1, ry: rng() * TAU, ao: null }); X.placed.push([p[0], p[1], 2.0]); if (burning) addFire(B, p[0], B.sea + .9, p[1], .55, 1.6); }
    for (let k = 0; k < 2; k++) X.drop(T => PROP.wreck(T, rng), 2.2, { far: 1.8, water: 2.5 });
    for (let k = 0; k < 6; k++) { const hh = rng.range(2.0, 4.0); X.drop(T => PROP.spire(T, rng, hh, [COL.stoneD, COL.stone, C(0x7a2e22), COL.stoneL]), hh * .28, { far: 1.6, steep: true }); }
    if (B.env.length < 3) B.env.push({ x: B.bridge.x, y: B.wlc + .55, z: B.bridge.z, c: 0xff5a1e, I: 30, d: 9, flick: 1 });
  },
  yinping(X) {
    const { B, rng, H } = X;
    // the plank road: where the ledge falls away beside the road, beams are let into the rock and planks laid over them
    const deckCol = () => mulC(COL.woodL, .65 + .3 * rng());
    for (let i = 14; i < B.n - 10; i += 2) {
      if (Math.abs(i - B.ci0) * PATH_STEP < 3.2) continue;
      const x0 = B.px[i], z0 = B.pz[i], y = B.py[i], nx = -B.tz[i], nz = B.tx[i];
      for (const sg of [-1, 1]) {
        const ox = x0 + nx * sg * (ROAD_HALF + 1.3), oz = z0 + nz * sg * (ROAD_HALF + 1.3);
        if (H(ox, oz) > y - 1.1) continue;
        if (B.pads.some(p => dist2(p.x, p.z, ox, oz) < 9)) continue;
        const T = new Soup(), ang = Math.atan2(B.tz[i], B.tx[i]), w = .95;
        T.box(PATH_STEP * 2 + .04, .07, w, 0, .02, sg * (ROAD_HALF + w / 2 - .25), deckCol(), { l: L_WOOD, jit: .05 });
        T.seg([0, -.05, sg * (ROAD_HALF - .4)], [0, -.05, sg * (ROAD_HALF + w - .2)], .05, .05, COL.woodD, { l: L_WOOD, n: 4 });
        if ((i >> 1) % 2 === 0) {
          T.seg([0, -.05, sg * (ROAD_HALF + w - .25)], [0, -1.15, sg * (ROAD_HALF + .05)], .04, .04, COL.woodD, { l: L_WOOD, n: 4 });
          T.seg([0, .02, sg * (ROAD_HALF + w - .28)], [0, .62, sg * (ROAD_HALF + w - .28)], .03, .03, COL.woodD, { l: L_WOOD, n: 4 });
          T.seg([-PATH_STEP * 2 - .02, .5, sg * (ROAD_HALF + w - .28)], [PATH_STEP * 2 + .02, .5, sg * (ROAD_HALF + w - .28)], .012, .012, COL.rope, { n: 3, jit: 0 });
        }
        B.put(T, x0, z0, { y, ry: -ang, ao: null });
      }
    }
    // Deng Ai's men left their mark: felt rolls and rope at the steepest drops, and a cairn to the dead
    for (let k = 0; k < 4; k++) X.drop(T => PROP.cairn(T, rng), .5, {});
    for (let k = 0; k < 6; k++) { const hh = rng.range(2.6, 4.4); X.drop(T => PROP.pine(T, rng, hh), .7, { far: 1.0, steep: true }); }
  },
  yiling(X) {
    const { B, rng } = X;
    // seven hundred li of camps: tent clusters strung along the road, the nearer half already on fire
    let camps = 0, lit = 0;
    for (let t = 0; t < 70 && camps < 8; t++) {
      const s = rng.range(8, B.L - 8), i = clamp(Math.round(s / PATH_STEP), 2, B.n - 3), side = rng.sign(), d = rng.range(3.4, 4.6);
      const x = B.px[i] - B.tz[i] * side * (ROAD_HALF + d), z = B.pz[i] + B.tx[i] * side * (ROAD_HALF + d);
      if (!campSpot(X, x, z, 2.0)) continue;
      const burnt = s > B.L * .35 && rng() < .75;
      campAt(X, x, z, rng() * TAU, { burnt, flag: COL.hanR }); X.placed.push([x, z, 2.2]); camps++;
      if (burnt) { addFire(B, x, X.H(x, z) + .25, z, .9, 2.4); if (lit < 3) { B.env.push({ x, y: X.H(x, z) + 1.2, z, c: 0xff6a24, I: 40, d: 9, flick: 1 }); lit++; } }
      else addFire(B, x, X.H(x, z) + .2, z, .3, .5);
    }
    // the wooded gorge sides; the trees nearest the burning camps are scorched
    for (let k = 0; k < 46; k++) {
      const kind = rng() < .55 ? 'song' : (rng() < .6 ? 'pine' : 'tree'), h = rng.range(2.6, 4.6);
      X.drop(T => kind === 'tree' ? PROP.charred(T, rng, h) : PROP[kind](T, rng, h), .7, { far: 1.6, steep: true });
    }
    for (let k = 0; k < 10; k++) { const hh = rng.range(2.6, 4); X.drop(T => PROP.bamboo(T, rng, hh), .7, { far: 1.2, steep: true }); }
    for (let k = 0; k < 4; k++) X.drop(T => PROP.log(T, rng), .9, { far: 1.2 });
  },
  jingxing(X) {
    const { B, rng, H } = X;
    // back to the water: Han Xin's line of red banners and pavises along the river bank
    let n = 0;
    for (let t = 0; t < 400 && n < 22; t++) {
      const x = rng.range(-BH + 1.5, BH - 1.5), z = rng.range(-BH + 1.5, BH - 1.5), h = H(x, z);
      if (h < B.sea + .45 || h > B.sea + 2.2) continue;
      let wet = false; for (let k = 0; k < 8 && !wet; k++) { const a = k / 8 * TAU; if (H(x + Math.cos(a) * 2.4, z + Math.sin(a) * 2.4) < B.sea) wet = true; }
      if (!wet || !X.free(x, z, .35, .4) || X.slope(x, z) > .5) continue;
      const T = new Soup(); if (n % 3 === 0) PROP.banner(T, rng, COL.hanR, 3.0); else PROP.pavise(T, rng, COL.hanR);
      B.put(T, x, z, { ry: rng() * TAU }); X.placed.push([x, z, .45]); n++;
    }
    // the two thousand red flags Han Xin's riders planted on the heights above the pass
    for (let k = 0, m = 0; k < 300 && m < 14; k++) {
      const x = rng.range(-BH + 1.5, 4), z = rng.range(-BH + 1.5, BH - 1.5);
      if (H(x, z) < 3.6 || !X.free(x, z, .3, .4) || X.slope(x, z) > .5) continue;
      const T = new Soup(); PROP.banner(T, rng, COL.hanR, 2.6); B.put(T, x, z, { ry: rng() * TAU }); X.placed.push([x, z, .5]); m++;
    }
    // Zhao's camp at the mouth of the pass
    for (let t = 0; t < 60; t++) { const x = B.lay.cave.x + rng.range(3, 8), z = B.zc + rng.sign() * rng.range(3.5, 6); if (campSpot(X, x, z, 1.9)) { campAt(X, x, z, rng() * TAU, { flag: COL.weiB, n: 3 }); X.placed.push([x, z, 2.2]); addFire(B, x, H(x, z) + .2, z, .3, .5); break; } }
    for (let k = 0; k < 3; k++) { const p = waterSpot(X, 1.0); if (!p) break; const T = new Soup(); PROP.sampan(T, rng); B.put(T, p[0], p[1], { y: B.sea - .06, ry: rng() * TAU, ao: null }); X.placed.push([p[0], p[1], 1.0]); }
  },
  jieting(X) {
    const { B, rng, H } = X, hill = B.scx.hill;
    // Ma Su's camp on the hilltop, cut off from the water
    if (hill) {
      for (let t = 0, made = 0; t < 40 && made < 3; t++) {
        const a = rng() * TAU, d = rng.range(0, hill.r * .45), x = hill.x + Math.cos(a) * d, z = hill.z + Math.sin(a) * d;
        if (!campSpot(X, x, z, 1.8)) continue;
        campAt(X, x, z, rng() * TAU, { flag: made ? COL.clothR : COL.hanR, n: rng.int(2, 3) }); X.placed.push([x, z, 2.0]); made++;
        if (!made) addFire(B, x, H(x, z) + .2, z, .3, .5);
      }
      for (let k = 0; k < 8; k++) { const a = k / 8 * TAU + rng() * .3, d = hill.r * rng.range(.5, .8), x = hill.x + Math.cos(a) * d, z = hill.z + Math.sin(a) * d; if (X.free(x, z, .3, .4)) { const T = new Soup(); PROP.banner(T, rng, k & 1 ? COL.hanR : COL.clothR, 2.8); B.put(T, x, z, { ry: rng() * TAU }); X.placed.push([x, z, .4]); } }
      X.drop(T => PROP.well(T, rng), 1.3, { at: X.find(1.3, { far: 2 }) || undefined });
      // Zhang He's camps ring the foot of the hill
      for (let k = 0, made = 0; k < 80 && made < 4; k++) {
        const a = rng() * TAU, d = hill.r + rng.range(3.5, 7.5), x = hill.x + Math.cos(a) * d, z = hill.z + Math.sin(a) * d;
        if (!campSpot(X, x, z, 1.8)) continue;
        campAt(X, x, z, rng() * TAU, { flag: COL.weiB, col: mulC(COL.canvas, .8), n: 2 }); X.placed.push([x, z, 2.0]); made++;
        addFire(B, x, H(x, z) + .2, z, .3, .5);
      }
    }
    for (let k = 0; k < 4; k++) X.drop(T => PROP.juma(T, rng, rng.range(2.4, 3.4)), 1.2, { far: 1.4 });
  },
});
