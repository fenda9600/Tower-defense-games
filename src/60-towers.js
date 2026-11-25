
const G = {
  B: null, t: 0, gold: 0, lives: 20, maxLives: 20, speed: 1, paused: false, wave: 0, slain: 0, level: 0, run: 1,
  towers: [], mons: [], men: [], arrows: [], shells: [], stuck: [], hbars: [], phase: 'play',
};
const TOWER = {
  archer: { name: '箭楼', short: '箭楼', icon: 'archer', cost: [70, 70, 90, 130], range: [6.2, 6.5, 6.9, 7.4], dmg: [9, 12, 12, 15], rate: [.85, .72, .78, .7], air: true, ground: true, light: [70, 80, 105, 140], desc: ['秦 · 弓弩前锋：居高放箭，', '射速快，可射飞行之敌。'], tiers: [['秦 · 弓弩前锋', '兵马俑一号坑前锋三排弓弩手，持弩列阵。'], ['汉 · 望楼弓手', '汉代烽燧望楼，弓手居高放火箭。'], ['唐 · 强弩手', '唐军弩手分番迭射，箭不绝声。'], ['宋 · 神臂弓', '宋神臂弓射三百四十步，可穿重甲。']] },
  bombard: { name: '砲车台', short: '砲车', icon: 'bombard', cost: [120, 100, 130, 180], range: [7.4, 7.7, 8.1, 8.6], minRange: 2.3, dmg: [36, 50, 68, 104], splash: [1.55, 1.7, 1.85, 2.1], rate: [2.9, 2.8, 2.65, 2.5], air: false, ground: true, light: [46, 50, 62, 80], desc: ['汉 · 发石机：装填慢，', '落石砸伤一片，只打地面。'], tiers: [['汉 · 发石机', '汉代以机发石，重十二斤，行二百步。'], ['三国 · 霹雳车', '官渡之战，曹操造发石车击袁绍楼橹，号霹雳车。'], ['唐 · 抛车', '唐军攻辽东，抛车飞大石过三百步。'], ['宋 · 霹雳火砲', '宋《武经总要》霹雳火球，以砲抛出。']] },
  spire: { name: '床弩台', short: '床弩', icon: 'spire', cost: [110, 90, 120, 170], range: [5.5, 5.8, 6.1, 6.5], dmg: [17, 22, 28, 37], jumps: [3, 4, 5, 6], rate: [2.3, 2.2, 2.05, 1.9], slow: [.36, .4, .44, .48], slowT: [1.3, 1.4, 1.55, 1.7], air: true, ground: true, light: [34, 40, 52, 66], desc: ['秦 · 连弩：一发贯数敌，', '中者迟滞，可射飞敌。'], tiers: [['秦 · 连弩', '《史记》：始皇于之罘以连弩射杀巨鱼。'], ['汉 · 大黄弩', '李广以大黄弩射杀匈奴裨将。'], ['唐 · 车弩', '唐《通典》车弩以绞轴张弦，中垒即摧。'], ['宋 · 三弓床弩', '宋三弓床弩七十人张发，射三百步。']] },
  guard: { name: '戍卒营', short: '戍卒', icon: 'guard', cost: [80, 70, 100, 140], range: [3.4, 3.6, 3.8, 4.0], n: [2, 2, 3, 3], hp: [62, 82, 100, 140], dmg: [7, 9, 11, 15], rate: [7, 6.5, 6, 5], air: false, ground: true, light: [50, 58, 72, 90], desc: ['秦 · 锐士：出营拦路，', '与敌近身搏杀。'], tiers: [['秦 · 锐士', '秦兵俑所见：铆钉札甲、右侧发髻，持青铜戈。'], ['汉 · 戍卒', '汉代边郡戍卒，铁札甲、环首刀与盾。'], ['唐 · 陌刀手', '唐陌刀手披明光铠，列阵如墙破骑。'], ['宋 · 步人甲', '宋步人甲重约二十九公斤，斩马刀破骑。']] },
};
const TOWER_KINDS = ['archer', 'bombard', 'spire', 'guard'];

function blueprint(kind, lvl) {
  const pieces = [], mounts = {};
  const piece = (id, order, fn) => {
    const S = new Soup(); fn(S); if (!S.verts) return; let minY = 1e9; for (let i = 1; i < S.P.length; i += 3) minY = Math.min(minY, S.P[i]);
    for (let i = 1; i < S.P.length; i += 3) S.P[i] -= minY; pieces.push({ id, order, y: minY, soup: S });
  };
  const w = COL.wood, wd = COL.woodD, wl = COL.woodL, st = COL.stone, sdk = COL.stoneD, sl = COL.stoneL, iron = COL.iron, rng = soupRng;
  const red = COL.lacq, redD = COL.lacqD, redL = COL.lacqL;
  const corners = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
  const brazier = (S, x, y, z, bs) => {
    for (let k = 0; k < 3; k++) { const a = k * TAU / 3 + .5; S.seg([x + Math.cos(a) * bs * .42, y, z + Math.sin(a) * bs * .42], [x + Math.cos(a) * bs * .2, y + bs * .5, z + Math.sin(a) * bs * .2], .028, .028, iron, { l: L_METAL, n: 4 }); }
    S.cyl(bs * .3, bs * .22, x, y + bs * .56, z, COL.bronze, { n: 8, l: L_METAL, rt: 1.5, rough: .6 });
    S.cyl(bs * .4, .04, x, y + bs * .68, z, COL.ember, { n: 8, emis: .55, jit: 0 });
  };
  if (kind === 'archer') {
    // Arrow tower: a brick or rammed earth stage, red posts, a railed gallery and a tiled roof on four columns.
    const bH = [.25, 1.0, 1.9][lvl], H = [2.0, 2.7, 3.35][lvl], W = [.75, .85, .93][lvl], bs = [.5, .62, .8][lvl], rH = [1.5, 1.55, 1.6][lvl];
    piece('base', 0, S => {
      if (lvl === 0) { S.box(1.6, .25, 1.6, 0, .125, 0, sdk, { l: L_MASON }); for (const [a, b] of corners) S.box(.3, .32, .3, a * .66, .16, b * .66, sl, { l: L_MASON }); }
      else {
        S.box(1.86, .3, 1.86, 0, .15, 0, sdk, { l: L_MASON });
        S.cyl(1.06, bH - .3, 0, .3 + (bH - .3) / 2, 0, lvl === 2 ? st : COL.ram, { n: 4, l: lvl === 2 ? L_MASON : L_DIRT, rt: .86, r: [0, PI / 4, 0], jit: .03 });
        for (const [a, b] of corners) S.seg([a * .76, .3, b * .76], [a * .66, bH - .06, b * .66], .1, .09, lvl === 2 ? sl : sdk, { n: 4, l: L_MASON });
        S.box(1.4, .12, 1.4, 0, bH - .04, 0, sl, { l: L_MASON });
        S.box(.34, .52, .06, 0, .56, .745, COL.black, { jit: 0 }); S.box(.44, .07, .1, 0, .86, .75, redD, { l: L_WOOD }); for (const sg of [-1, 1]) S.box(.06, .56, .1, sg * .2, .58, .75, redD, { l: L_WOOD });
        if (lvl === 2) for (const sg of [-1, 1]) S.box(.06, .4, .1, sg * .72, 1.15, 0, COL.black, { jit: 0 });
      }
    });
    if (lvl === 2) piece('skirt', 1, S => { cnRoof(S, { y: bH - .34, a: 1.2, h: .34, t0: .56, n: 2, m: 4, lift: .12, rr: .035 }); });
    piece('posts', 2, S => {
      for (const [a, b] of corners) S.seg([a * .62, bH, b * .62], [a * (W - .1), H, b * (W - .1)], .085, .075, red, { l: L_WOOD });
      const ym = (bH + H) / 2, r = lerp(.62, W - .1, .5);
      for (let k = 0; k < 4; k++) { const [a, b] = corners[k], [c, d] = corners[(k + 1) % 4]; S.seg([a * r, ym, b * r], [c * r, ym, d * r], .05, .05, redD, { l: L_WOOD, n: 4 }); }
    });
    piece('brace', 3, S => {
      for (let k = 0; k < 4; k++) { const [a, b] = corners[k], [c, d] = corners[(k + 1) % 4]; S.seg([a * .62, bH + .1, b * .62], [c * (W - .12), H - .15, d * (W - .12)], .035, .035, w, { l: L_WOOD, n: 4 }); S.seg([c * .62, bH + .1, d * .62], [a * (W - .12), H - .15, b * (W - .12)], .035, .035, wl, { l: L_WOOD, n: 4 }); }
    });
    piece('deck', 4, S => {
      S.box(W * 2 + .16, .1, W * 2 + .16, 0, H + .05, 0, w, { l: L_WOOD }); for (const sg of [-1, 1]) S.box(W * 2 + .34, .1, .12, 0, H - .04, sg * (W - .1), redD, { l: L_WOOD });
      for (const sg of [-1, 1]) S.box(.12, .1, W * 2 + .34, sg * (W - .1), H - .04, 0, redD, { l: L_WOOD });
      if (lvl >= 1) for (const [a, b] of corners) S.seg([a * (W - .1), H - .55, b * (W - .1)], [a * (W + .06), H - .02, b * (W + .06)], .04, .04, red, { l: L_WOOD, n: 4 });
    });
    piece('rail', 5, S => {
      const y0 = H + .1, R = W + .02;
      for (let k = 0; k < 4; k++) {
        const ang = k * HPI, cs = Math.cos(ang), sn = Math.sin(ang), at = (u, y, ww, hh, c) => S.box(ww, hh, .05, u * cs + R * sn, y, -u * sn + R * cs, c, { l: L_WOOD, r: [0, ang, 0] });
        if (k === 2) { for (const sg of [-1, 1]) { at(sg * W * .7, y0 + .36, W * .6, .05, red); at(sg * W * .7, y0 + .14, W * .6, .04, redD); } continue; }
        at(0, y0 + .36, W * 2, .05, red); at(0, y0 + .14, W * 2, .04, redD);
        for (let j = -2; j <= 2; j++) at(j * W * .4, y0 + .2, .045, .36, j & 1 ? redD : red);
        for (const u of [-W * .6, -W * .2, W * .2, W * .6]) { S.seg([(u - .1) * cs + R * sn, y0 + .15, -(u - .1) * sn + R * cs], [(u + .1) * cs + R * sn, y0 + .35, -(u + .1) * sn + R * cs], .014, .014, redD, { n: 3, l: L_WOOD }); S.seg([(u + .1) * cs + R * sn, y0 + .15, -(u + .1) * sn + R * cs], [(u - .1) * cs + R * sn, y0 + .35, -(u - .1) * sn + R * cs], .014, .014, redD, { n: 3, l: L_WOOD }); }
      }
      if (lvl >= 1) for (const u of lvl === 2 ? [-.5, 0, .5] : [-.35, .35]) { S.cyl(.2, .04, u, y0 + .22, W + .08, lvl === 2 ? COL.bronze : COL.lacqL, { n: 8, r: [HPI, 0, 0], l: lvl === 2 ? L_METAL : L_WOOD }); S.sph(.05, u, y0 + .22, W + .11, COL.brass, { l: L_METAL, w: 5, h: 3, smooth: false }); }
    });
    piece('ladder', 6, S => {
      for (const sg of [-1, 1]) S.seg([sg * .17, 0, -W - .5], [sg * .17, H + .15, -W - .06], .035, .035, wd, { l: L_WOOD, n: 4 });
      for (let y = .3; y < H; y += .34) { const u = y / (H + .15); S.box(.36, .04, .05, 0, y, lerp(-W - .5, -W - .06, u), wl, { l: L_WOOD }); }
    });
    const bx = -W + .3, bz = W - .34, by = H + .1;
    piece('brazier', 7, S => { brazier(S, bx, by, bz, bs * .8); });
    const ra = W + .14, pr = W - .02;
    piece('columns', 8, S => {
      for (const [a, b] of corners) { S.seg([a * pr, H + .1, b * pr], [a * pr, H + rH, b * pr], .055, .05, red, { l: L_WOOD, n: 6 }); S.box(.16, .06, .16, a * pr, H + .13, b * pr, sdk, { l: L_MASON }); }
      cnBrackets(S, 0, H + rH - .02, 0, pr, pr, { h: .09 });
    });
    piece('roof', 9, S => {
      const thatch = lvl === 0;
      cnRoof(S, { y: H + rH + .06, a: ra, h: [.5, .6, .7][lvl], lift: thatch ? .08 : .2, n: 4, m: 4, col: thatch ? COL.thatch : COL.tile, layer: thatch ? L_THATCH : L_SLATE, ridgeCol: thatch ? mulC(COL.thatch, .6) : undefined, finial: lvl === 2 ? COL.gold : thatch ? wd : COL.brass });
    });
    piece('flag', 10, S => { cnBanner(S, W + .04, H + .1, H + rH + [1.3, 1.5, 1.7][lvl], -W - .04, COL.clothR, rng, { w: .36, len: .8 + lvl * .12, col2: lvl ? mulC(COL.gold, .7) : null }); });
    mounts.flame = [bx, by + bs * .56, bz]; mounts.flameSize = bs * .8; mounts.top = H + rH + 1.0;
    mounts.archers = [[[.12, H + .1, .28]], [[-.3, H + .1, .1], [.42, H + .1, .3]], [[-.4, H + .1, -.1], [.5, H + .1, .3], [.1, H + .1, -.45]]][lvl];
  } else if (kind === 'bombard') {
    // Cannon terrace: an eight sided brick battery with merlons, a bronze gun and paper lanterns.
    const Rr = [1.0, 1.08, 1.15][lvl], H = [1.1, 1.5, 1.9][lvl], N = 8, rot = { r: [0, PI / 8, 0] };
    piece('plinth', 0, S => { S.cyl(Rr + .26, .26, 0, .13, 0, sdk, Object.assign({ n: N, l: L_MASON }, rot)); if (lvl === 2) S.cyl(Rr + .14, .2, 0, .36, 0, st, Object.assign({ n: N, l: L_MASON }, rot)); });
    piece('drum', 1, S => {
      S.cyl(Rr, H, 0, H / 2, 0, st, Object.assign({ n: N, l: L_MASON, rt: .9, jit: .03 }, rot));
      for (let c = 0; c < 2 + lvl; c++) { const yb = .35 + c * (H - .5) / (1.5 + lvl); S.cyl(Rr * (1 - .1 * yb / H) + .012, .1, 0, yb, 0, mixC(sdk, sl, rng()), Object.assign({ n: N, l: L_MASON }, rot)); }
      S.box(.36, .56, .1, 0, .3, Rr * .93, COL.black, { jit: 0 }); S.box(.5, .08, .14, 0, .62, Rr * .93, redD, { l: L_WOOD }); for (const sg of [-1, 1]) S.box(.07, .6, .14, sg * .22, .32, Rr * .93, redD, { l: L_WOOD });
    });
    if (lvl >= 1) piece('butt', 2, S => { for (let k = 0; k < 4; k++) { const a = k * HPI + PI / 4; S.box(.36, H * .8, .5, Math.cos(a) * (Rr + .02), H * .36, Math.sin(a) * (Rr + .02), sdk, { l: L_MASON, r: [0, -a + HPI, 0] }); S.box(.4, .12, .56, Math.cos(a) * (Rr + .02), H * .78, Math.sin(a) * (Rr + .02), sl, { l: L_MASON, r: [0, -a + HPI, 0] }); } });
    if (lvl === 2) piece('skirt', 3, S => { cnRoof(S, { y: H * .5, a: Rr + .3, h: .3, t0: .7, n: 2, m: 4, lift: .12, rr: .03 }); });
    piece('deck', 4, S => { S.cyl(Rr * .9 + .16, .16, 0, H + .02, 0, sl, Object.assign({ n: N, l: L_MASON }, rot)); S.cyl(Rr * .78, .06, 0, H + .12, 0, w, Object.assign({ n: N, l: L_WOOD }, rot)); });
    piece('rim', 5, S => {
      for (let k = 0; k < N; k++) {
        if (k === 2) continue;
        const a = k / N * TAU, rr2 = Rr * .9 + .02, cx = Math.cos(a) * rr2, cz = Math.sin(a) * rr2, tx = -Math.sin(a), tz = Math.cos(a);
        S.box(.76, .14, .2, cx, H + .17, cz, mixC(sdk, sl, rng()), { l: L_MASON, r: [0, -a + HPI, 0] });
        for (const u of [-.24, .24]) S.box(.26, .26, .2, cx + tx * u, H + .37, cz + tz * u, mixC(sdk, sl, rng()), { l: L_MASON, r: [0, -a + HPI, 0] });
      }
    });
    piece('ammo', 6, S => { for (const [x, z] of [[-.42, -.5], [-.24, -.52], [-.33, -.36]]) S.sph(.09, x, H + .22, z, mulC(iron, .8), { l: L_METAL, w: 6, h: 4, smooth: false }); S.sph(.09, -.33, H + .36, -.46, mulC(iron, .8), { l: L_METAL, w: 6, h: 4, smooth: false }); PROP.barrel(S, .45, H + .13, -.5, .75, rng); });
    const lx = -Rr * .74, lz = .1, lh = H + 1.35 + lvl * .12;
    let lp = null;
    piece('lantern', 7, S => {
      for (const sg of lvl === 2 ? [-1, 1] : [1]) {
        const x = lx * sg;
        S.seg([x, H + .1, lz], [x, lh, lz], .04, .035, redD, { l: L_WOOD, n: 5 }); S.seg([x, lh - .04, lz], [x, lh + .06, lz + .36], .03, .022, redD, { l: L_WOOD, n: 4 });
        S.seg([x, lh + .05, lz + .34], [x, lh - .12, lz + .34], .008, .008, COL.rope, { n: 3 });
        const p = cnLantern(S, x, lh - .28, lz + .34, 1.25 + lvl * .1); if (sg === 1) lp = p;
      }
    });
    if (lvl >= 1) piece('flag', 8, S => { cnBanner(S, Rr * .62, H + .1, H + 2.2 + lvl * .3, -Rr * .62, COL.clothD, rng, { w: .34, len: .9, col2: mulC(COL.lacqL, 1.1) }); });
    mounts.flame = [lx, lh - .3, lz + .34]; mounts.flameSize = .24 + lvl * .04; mounts.flame2 = lvl === 2 ? [-lx, lh - .3, lz + .34] : null; mounts.top = H + 1.7;
    mounts.gun = [0, H + .15, .05]; mounts.gunLen = [.95, 1.12, 1.25][lvl]; mounts.gunR = [.15, .18, .215][lvl];
  } else if (kind === 'spire') {
    // Crossbow platform: a rammed earth or brick stage with a timber deck carrying a bed crossbow of one, two or three bows.
    const H = [1.1, 1.5, 1.9][lvl], W = 1.7, earth = lvl === 2 ? st : COL.ram, lay = lvl === 2 ? L_MASON : L_DIRT;
    piece('base', 0, S => {
      S.box(W + .2, .2, W + .2, 0, .1, 0, sdk, { l: L_MASON });
      S.cyl(W * .72, H - .2, 0, .2 + (H - .2) / 2, 0, earth, { n: 4, l: lay, rt: .9, r: [0, PI / 4, 0], jit: .03 });
      if (lvl >= 1) for (let y = .45; y < H - .1; y += .35) S.box(W * .98 - y * .1, .04, W * .98 - y * .1, 0, y, 0, mulC(earth, .8), { l: lay, jit: 0 });
      S.box(.36, .5, .06, 0, .45, W / 2 - .02, COL.black, { jit: 0 }); S.box(.46, .07, .1, 0, .74, W / 2, redD, { l: L_WOOD });
    });
    piece('deck', 1, S => {
      S.box(W + .1, .1, W + .1, 0, H + .05, 0, wd, { l: L_WOOD }); for (const x of [-.6, -.3, 0, .3, .6]) S.box(.26, .03, W, x, H + .11, 0, w, { l: L_WOOD });
      for (const [a, b2] of corners) S.box(.1, .55, .1, a * W / 2, H + .38, b2 * W / 2, red, { l: L_WOOD });
      for (const sg of [-1, 1]) { S.box(W, .06, .06, 0, H + .58, sg * W / 2, redD, { l: L_WOOD }); S.box(.06, .06, W, sg * W / 2, H + .58, 0, redD, { l: L_WOOD }); S.box(W, .04, .04, 0, H + .34, sg * W / 2, redD, { l: L_WOOD }); S.box(.04, .04, W, sg * W / 2, H + .34, 0, redD, { l: L_WOOD }); }
      if (lvl === 2) for (const [a, b2] of corners) S.box(.24, .32, .24, a * (W / 2 + .02), H + .3, b2 * (W / 2 + .02), sl, { l: L_MASON });
    });
    piece('ammo', 2, S => {
      // spare bolts in a rack and a winch for drawing the bows
      const x = -W / 2 + .25, z = -W / 2 + .3; S.box(.5, .08, .2, x + .1, H + .2, z, wd, { l: L_WOOD });
      for (let k = 0; k < 5; k++) { S.box(.03, .03, .72, x - .08 + k * .08, H + .27, z + .2, wl, { l: L_WOOD, jit: 0 }); S.cone(.03, .08, x - .08 + k * .08, H + .27, z + .6, iron, { n: 4, r: [HPI, 0, 0], l: L_METAL }); }
      S.cyl(.09, .5, W / 2 - .3, H + .3, -W / 2 + .3, wd, { n: 6, r: [0, 0, HPI], l: L_WOOD }); for (const sg of [-1, 1]) S.box(.04, .3, .14, W / 2 - .3 + sg * .27, H + .22, -W / 2 + .3, w, { l: L_WOOD });
    });
    const fx = W / 2 - .2, fz = W / 2 - .2, bs = [.34, .4, .46][lvl];
    piece('fire', 3, S => brazier(S, fx, H + .1, fz, bs));
    if (lvl >= 1) piece('flag', 4, S => { cnBanner(S, -W / 2 + .1, H + .1, H + 2.2 + lvl * .3, W / 2 - .1, COL.clothD, rng, { w: .34, len: .9, col2: mulC(COL.lacqL, 1.1) }); });
    mounts.flame = [fx, H + .1 + bs * .72, fz]; mounts.flameSize = bs; mounts.top = H + 1.3; mounts.gun = [0, H + .1, 0]; mounts.bows = lvl + 1;
  } else {
    // Garrison hall: rammed earth or brick walls under a tiled roof, a halberd rack and a corner tower at the top level.
    const W = [1.5, 1.7, 1.9][lvl], D = [1.3, 1.4, 1.5][lvl], wh = [1.05, 1.25, 1.5][lvl], brick = lvl === 2;
    piece('floor', 0, S => { S.box(W + .5, .16, D + .7, 0, .08, .1, sdk, { l: L_MASON }); S.box(.7, .1, .4, 0, .05, D / 2 + .55, st, { l: L_MASON }); });
    piece('walls', 1, S => {
      const wc = brick ? st : lvl === 1 ? COL.plaster : COL.ram, wlay = brick ? L_MASON : lvl === 1 ? L_PLAIN : L_DIRT;
      if (lvl >= 1) S.box(W + .06, .4, D + .06, 0, .36, 0, st, { l: L_MASON });
      S.box(W, wh, D, 0, .16 + wh / 2, 0, wc, { l: wlay, jit: .03 });
      for (const [a, b] of corners) S.box(.13, wh + .04, .13, a * W / 2, .16 + wh / 2, b * D / 2, red, { l: L_WOOD });
      for (const sg of [-1, 1]) { S.box(W, .09, .09, 0, .16 + wh - .05, sg * D / 2, redD, { l: L_WOOD }); S.box(.09, .09, D, sg * W / 2, .16 + wh - .05, 0, redD, { l: L_WOOD }); }
      S.box(.5, .82, .12, 0, .57, D / 2, COL.black, { jit: 0 }); S.box(.7, .1, .16, 0, 1.02, D / 2 + .02, red, { l: L_WOOD }); for (const sg of [-1, 1]) S.box(.09, .86, .16, sg * .29, .59, D / 2 + .02, red, { l: L_WOOD });
      for (const sg of [-1, 1]) { const x = sg * W * .32; S.box(.3, .26, .06, x, .16 + wh * .6, D / 2 + .01, COL.black, { jit: 0 }); for (const u of [-.08, 0, .08]) S.box(.022, .26, .07, x + u, .16 + wh * .6, D / 2 + .02, redD, { l: L_WOOD }); S.box(.34, .03, .08, x, .16 + wh * .6, D / 2 + .02, redD, { l: L_WOOD }); }
      S.box(.08, .3, .3, W / 2 + .01, .16 + wh * .6, 0, COL.black, { jit: 0 });
    });
    piece('roof', 2, S => {
      const thatch = lvl === 0, y0 = .16 + wh, rh = [.7, .8, .9][lvl], gc = brick ? st : lvl === 1 ? COL.plaster : COL.ram, gl = brick ? L_MASON : lvl === 1 ? L_PLAIN : L_DIRT;
      for (const sg of [-1, 1]) { const T = [[sg * W / 2, y0, -D / 2], [sg * W / 2, y0, D / 2], [sg * W / 2, y0 + rh - .04, 0]]; if (sg > 0) S.tri(T[0], T[2], T[1], gc, gl, .95); else S.tri(T[0], T[1], T[2], gc, gl, .95); }
      cnRoof(S, { y: y0 - .02, a: W / 2 + .24, b: D / 2 + .34, h: rh + .04, ridge: W / 2 + .24, lift: thatch ? .04 : .12, sag: 1.35, n: 4, m: 3, col: thatch ? COL.thatch : COL.tile, layer: thatch ? L_THATCH : L_SLATE, ridgeCol: thatch ? mulC(COL.thatch, .6) : undefined, rr: .045 });
      if (!thatch) for (const sg of [-1, 1]) S.box(.1, .12, .1, sg * (W / 2 + .1), y0 + rh + .14, 0, COL.tileD, { l: L_SLATE });
    });
    piece('rack', 3, S => {
      const x = -W / 2 - .3; S.box(.06, .7, .06, x, .5, -.3, wd, { l: L_WOOD }); S.box(.06, .7, .06, x, .5, .3, wd, { l: L_WOOD }); S.box(.05, .05, .7, x, .78, 0, w, { l: L_WOOD });
      for (const z of [-.2, 0, .2]) { S.seg([x + .06, .12, z], [x - .04, 1.6, z], .018, .018, redD, { l: L_WOOD, n: 4 }); S.cone(.035, .18, x - .05, 1.68, z, COL.steel, { n: 4, l: L_METAL }); S.box(.02, .05, .16, x - .04, 1.5, z + .05, COL.steel, { l: L_METAL }); S.ico(.035, x - .035, 1.42, z, COL.lacqL, { d: 0 }); }
      if (lvl >= 1) S.cyl(.2, .04, W / 2 + .03, .7, -.25, COL.lacqL, { n: 8, r: [0, 0, HPI], l: L_WOOD });
    });
    if (lvl === 2) piece('turret', 4, S => {
      const x = W / 2 - .2, z = -D / 2 + .2, th = 2.5;
      S.cyl(.6, th, x, th / 2 + .16, z, st, { n: 4, l: L_MASON, rt: .86, r: [0, PI / 4, 0] }); S.box(.86, .12, .86, x, th + .2, z, sl, { l: L_MASON });
      for (const [a, b] of corners) S.seg([x + a * .34, th + .26, z + b * .34], [x + a * .34, th + .86, z + b * .34], .04, .04, red, { l: L_WOOD, n: 5 });
      cnBrackets(S, x, th + .84, z, .34, .34, { h: .07 }); cnRoof(S, { x, z, y: th + .92, a: .66, h: .42, lift: .16, n: 3, m: 4, finial: COL.gold });
      S.box(.1, .4, .06, x, th * .62, z + .37, COL.black, { jit: 0 });
    });
    const fx = W / 2 + .12, fz = D / 2 + .5, bs = [.34, .46, .6][lvl];
    piece('fire', 5, S => { if (lvl === 0) { S.seg([fx, 0, fz], [fx, 1.05, fz], .04, .035, wd, { l: L_WOOD, n: 4 }); S.cyl(.07, .12, fx, 1.1, fz, iron, { n: 6, l: L_METAL, rt: 1.4 }); } else brazier(S, fx, .08, fz, bs + .1); });
    piece('flag', 6, S => { const x = -W / 2 - .12, z = D / 2 + .3; cnBanner(S, x, .1, [2.9, 3.2, 3.6][lvl], z, COL.clothB, rng, { w: .4, len: 1.1 + lvl * .1 }); });
    mounts.flame = lvl === 0 ? [fx, 1.2, fz] : [fx, .08 + (bs + .1) * .72, fz]; mounts.flameSize = bs; mounts.door = [0, 0, D / 2 + .45]; mounts.top = lvl === 2 ? 3.6 : 2.4;
  }
  pieces.sort((a, b) => a.order - b.order);
  return { pieces, mounts };
}

function scaffoldGeo(w, h) {
  const S = new Soup(), c = mulC(COL.woodL, .9), c2 = COL.wood;
  for (const [a, b] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) S.seg([a * w, 0, b * w], [a * w, h, b * w], .04, .035, c, { l: L_WOOD, n: 4 });
  for (let y = .9; y < h; y += 1.05) for (let k = 0; k < 4; k++) { const q = [[-1, -1], [1, -1], [1, 1], [-1, 1]], [a, b] = q[k], [cc, d] = q[(k + 1) % 4]; S.seg([a * w, y, b * w], [cc * w, y, d * w], .03, .03, c2, { l: L_WOOD, n: 4 }); if (k & 1) S.seg([a * w, y - .9, b * w], [cc * w, y, d * w], .022, .022, c, { l: L_WOOD, n: 3 }); }
  S.box(w * 1.2, .05, .34, 0, Math.min(h - .2, 1.95), w + .12, c2, { l: L_WOOD }); S.box(.34, .05, w * 1.2, -w - .12, Math.min(h - .25, .95), 0, c, { l: L_WOOD });
  return S.build();
}

let TOWER_STUN = false;
function findTarget(x, z, range, air, ground, minRange = 0) {
  if (G.phase !== 'play' || TOWER_STUN) return null;
  let best = null, bp = -1; const r2 = range * range, m2 = minRange * minRange;
  for (const m of G.mons) {
    if (m.dead || m.hp <= 0 || !m.vis) continue; if (m.fly ? !air : !ground) continue;
    const d = dist2(x, z, m.x, m.z); if (d > r2 || d < m2) continue;
    const sc = m.prog + (m.fly ? 2 : 0) + (m.def.boss ? -.0 : 0); if (sc > bp) { bp = sc; best = m; }
  }
  return best;
}
function aimPoint(m, dt, out) {
  if (m.fly || m.wallSt) { out.x = m.x + (m.vx || 0) * dt; out.y = m.y + (m.fly ? 0 : m.hitH); out.z = m.z + (m.vz || 0) * dt; return out; }
  const B = G.B, adv = m.blocked ? 0 : m.spdNow * dt, s2 = Math.min(B.L - .1, m.s + adv);
  pathAt(B, s2, out); out.x += -out.tz * m.lat; out.z += out.tx * m.lat; out.y += m.hitH; return out;
}

const _tv = new THREE.Vector3(), _tq = new THREE.Quaternion(), _tm = new THREE.Matrix4(), _tz = new THREE.Vector3(0, 0, 1), _ts = new THREE.Vector3(1, 1, 1), _ap = { x: 0, y: 0, z: 0, tx: 0, tz: 0 };

class Tower {
  constructor(pad, kind, idx) {
    this.pad = pad; this.kind = kind; this.idx = idx; this.lvl = 0; this.def = TOWER[kind];
    this.x = pad.x; this.y = pad.y; this.z = pad.z; this.yaw = pad.face; this.cs = Math.cos(this.yaw); this.sn = Math.sin(this.yaw);
    this.spent = this.def.cost[0]; this.state = 'build'; this.bt = 0; this.cool = rr(.2, .8); this.kills = 0; this.dealt = 0; this.alive = true; this.recent = 0;
    this.group = new THREE.Group(); this.group.position.set(this.x, this.y, this.z); this.group.rotation.y = this.yaw; R.scene.add(this.group);
    this.pieces = []; this.staticMesh = null; this.scaf = null; this.flame = null; this.flame2 = null; this.archers = []; this.men = []; this.respawn = 0;
    this.em = { x: this.x, y: this.y + 3, z: this.z, r: 1, g: .56, b: .26, I: 0, range: 13, on: 0, alive: true, seed: rnd() * 50, spot: kind !== 'spire', dx: this.sn, dz: this.cs, fl: 1, _spot: 0 };
    LT.emitters[idx] = this.em; pad.tower = this;
    this.gunYaw = 0; this.recoil = 0; this.charge = 0; this.spin = rnd() * 6; this.hover = 0; this.appear = 0;
    this.begin();
  }
  get range() { return this.def.range[this.lvl]; }
  w(l, out) { out.x = this.x + l[0] * this.cs + l[2] * this.sn; out.y = this.y + l[1]; out.z = this.z - l[0] * this.sn + l[2] * this.cs; return out; }
  begin() {
    const bp = blueprint(this.kind, this.vl); this.bp = bp; this.mounts = bp.mounts; this.bt = 0; this.state = this.lvl ? 'upgrade' : 'build';
    this.clearModel(true);
    const n = bp.pieces.length, gap = Math.min(.2, 1.45 / n);
    bp.pieces.forEach((p, i) => {
      const mesh = new THREE.Mesh(p.soup.build(), MAT.world); mesh.castShadow = mesh.receiveShadow = true; mesh.visible = false; mesh.position.y = p.y + 2.4;
      this.group.add(mesh); this.pieces.push({ mesh, y: p.y, t0: .32 + i * gap, landed: false, soup: p.soup });
    });
    this.tEnd = .32 + n * gap + .3;
    this.scaf = new THREE.Mesh(scaffoldGeo(1.25, Math.min(4.4, bp.mounts.top + .3)), MAT.world); this.scaf.castShadow = true; this.scaf.scale.set(1, .01, 1); this.group.add(this.scaf);
    fxDust(this.x, this.y + .1, this.z, 7, 1.0, { speed: 1.6 });
    sfx('hammer', this.x, this.z, .8, .3);
  }
  clearModel(keepLights) {
    for (const p of this.pieces) { this.group.remove(p.mesh); p.mesh.geometry.dispose(); } this.pieces.length = 0;
    for (const k of ['staticMesh', 'scaf', 'carriage', 'crystal']) if (this[k]) { this.group.remove(this[k]); this[k].traverse(o => { if (o.geometry) o.geometry.dispose(); }); this[k] = null; }
    this.barrel = null; this.shards = null; this.ringG = null;
    removeFlame(this.flame); removeFlame(this.flame2); this.flame = this.flame2 = null; this.em.on = keepLights ? this.em.on * .4 : 0;
    this.archers.length = 0;
  }
  finish() {
    const M = new Soup(); for (const p of this.pieces) M.merge(p.soup, { p: [0, p.y, 0], ao: [0, 1.0, .72] });
    for (const p of this.pieces) { this.group.remove(p.mesh); p.mesh.geometry.dispose(); } this.pieces.length = 0;
    this.staticMesh = new THREE.Mesh(M.build(), MAT.world); this.staticMesh.castShadow = this.staticMesh.receiveShadow = true; this.group.add(this.staticMesh);
    if (this.scaf) { this.group.remove(this.scaf); this.scaf.geometry.dispose(); this.scaf = null; }
    const mt = this.mounts, lvl = this.lvl, d = this.def;
    if (mt.flame) { const p = this.w(mt.flame, {}); this.flame = addFlame({ x: p.x, y: p.y, z: p.z, size: mt.flameSize, on: 0, layers: mt.flameSize > .7 ? 2 : 1, glow: 1 }); this.em.x = p.x; this.em.y = p.y + .25; this.em.z = p.z; this.em.r = 1; this.em.g = .56; this.em.b = .26; }
    if (mt.flame2) { const p = this.w(mt.flame2, {}); this.flame2 = addFlame({ x: p.x, y: p.y, z: p.z, size: mt.flameSize, on: 0 }); }
    if (mt.lightAt) { const p = this.w(mt.lightAt, {}); this.em.x = p.x; this.em.y = p.y; this.em.z = p.z; this.em.r = .45; this.em.g = .72; this.em.b = 1; }
    this.em.I = d.light[lvl]; this.em.range = this.kind === 'archer' ? 12 : 10.5;
    if (this.kind === 'archer') for (const a of mt.archers.concat(crewArchers(this))) this.addArcher(a);
    if (this.kind === 'bombard') this.makeGun();
    if (this.kind === 'spire') this.makeBow();
    if (this.kind === 'guard') { this.respawn = .2; }
    if (this.mended) this.mended = false; else if (lvl > 0) { const tr = d.tiers[lvl]; UI.banner(d.name + ' · ' + tr[0], 3.6, false, tr[1]); }
    this.state = 'active'; this.appear = 0;
    fxDust(this.x, this.y + .2, this.z, 10, 1.3, { speed: 2.2 });
    sfx('buildDone', this.x, this.z, 1);
    if (this.flame) fxEmbers(this.flame.x, this.flame.y, this.flame.z, 10, .2);
  }
  addArcher(a) { const lvl = this.lvl; this.archers.push({ l: a, yaw: this.yaw, draw: 0, cool: .4 + this.archers.length * .3, e: { scale: .82, ph: 0, mv: 0, atk: -1, bow: true, xbow: lvl !== 1, helm: lvl === 3, draw: 0, pitch: 0, tint: [1, .9, .7], x: 0, y: 0, z: 0, yaw: 0, flash: 0 } }); }
  makeGun() {
    // A traction trebuchet on a turning base: one pole for the Han stone thrower, a bigger frame for the Tang throwing cart, bundled poles and a fire ball for the Song thunderbolt trebuchet.
    const mt = this.mounts, lvl = this.vl, S = new Soup(), wd = COL.woodD, w = COL.wood, fh = [1.05, 1.25, 1.4][lvl], fw = [.34, .4, .46][lvl];
    S.cyl(.5, .12, 0, .06, 0, wd, { n: 8, l: L_WOOD });
    for (const sg of [-1, 1]) { S.seg([sg * fw, .1, -.32], [sg * fw, fh, 0], .05, .045, w, { n: 5, l: L_WOOD }); S.seg([sg * fw, .1, .32], [sg * fw, fh, 0], .05, .045, w, { n: 5, l: L_WOOD }); S.box(.08, .06, .7, sg * fw, .14, 0, wd, { l: L_WOOD }); }
    S.cyl(.045, fw * 2 + .14, 0, fh, 0, COL.iron, { n: 6, r: [0, 0, HPI], l: L_METAL });
    for (let k = 0; k < 3 + lvl; k++) { const x = (k - (2 + lvl) / 2) * .12; S.seg([x, .12, .55], [x * .3, fh - .05, .3], .006, .006, COL.rope, { n: 3 }); }
    this.carriage = new THREE.Mesh(S.build(), MAT.world); this.carriage.castShadow = this.carriage.receiveShadow = true; this.carriage.position.set(mt.gun[0], mt.gun[1], mt.gun[2]); this.group.add(this.carriage);
    const Bq = new Soup(), L = [1.5, 1.8, 2.0][lvl], poles = [1, 2, 3][lvl];
    for (let k = 0; k < poles; k++) { const x = (k - (poles - 1) / 2) * .07; Bq.seg([x, -.45, 0], [x * .5, L, 0], .05, .03, k === 1 ? mulC(w, 1.1) : w, { n: 5, l: L_WOOD }); }
    for (const y of [.2, .6, 1.0]) Bq.cyl(.07 + poles * .015, .05, 0, y, 0, COL.rope, { n: 6 });
    Bq.box(.22, .14, .14, 0, -.5, 0, wd, { l: L_WOOD }); Bq.seg([0, L, 0], [0, L - .35, .12], .008, .008, COL.rope, { n: 3 });
    if (lvl === 2) { Bq.sph(.11, 0, L - .38, .14, mulC(COL.black, 4), { w: 6, h: 4, smooth: false }); Bq.ico(.03, 0, L - .26, .16, COL.ember, { d: 0, emis: .8 }); }
    else Bq.rock(.1, 0, L - .38, .14, COL.stone, {});
    this.barrel = new THREE.Mesh(Bq.build(), MAT.world); this.barrel.castShadow = this.barrel.receiveShadow = true; this.barrel.position.set(0, fh, 0); this.barrel.rotation.x = -2.1; this.carriage.add(this.barrel);
    this.armL = L; this.gunYaw = this.yaw;
  }
  makeBow() {
    // a bed crossbow on a turning post: one bow at the first level, two and then three bows (the san gong chuang nu) above
    const mt = this.mounts, n = mt.bows, S = new Soup(), wd = COL.woodD, w = COL.wood;
    S.cyl(.12, .5, 0, .25, 0, wd, { n: 6, l: L_WOOD }); S.box(.5, .08, .5, 0, .04, 0, wd, { l: L_WOOD });
    for (const sg of [-1, 1]) S.box(.06, .3, .5, sg * .14, .55, 0, w, { l: L_WOOD });
    this.carriage = new THREE.Mesh(S.build(), MAT.world); this.carriage.castShadow = this.carriage.receiveShadow = true; this.carriage.position.set(mt.gun[0], mt.gun[1], mt.gun[2]); this.group.add(this.carriage);
    const Bq = new Soup(), L = 1.5;
    Bq.box(.16, .12, L, 0, 0, 0, w, { l: L_WOOD }); Bq.box(.06, .03, L * .9, 0, .075, .05, wd, { l: L_WOOD, jit: 0 }); Bq.box(.2, .16, .2, 0, -.02, -L / 2 + .1, wd, { l: L_WOOD }); Bq.cyl(.06, .34, 0, -.02, -L / 2 + .1, COL.iron, { n: 6, r: [0, 0, HPI], l: L_METAL });
    for (let b = 0; b < n; b++) {
      const z = L / 2 - .12 - b * .26, sp = 1.05 - b * .08, c = b === 1 ? mulC(COL.lacq, .9) : C(0x5a3e24);
      let p = [0, 0, z]; for (let i = 1; i <= 5; i++) { const u = i / 5, q = [u * sp, .02, z - u * u * .28]; Bq.seg(p, q, .045 - u * .02, .04 - u * .02, c, { n: 5, l: L_WOOD }); p = q; }
      p = [0, 0, z]; for (let i = 1; i <= 5; i++) { const u = i / 5, q = [-u * sp, .02, z - u * u * .28]; Bq.seg(p, q, .045 - u * .02, .04 - u * .02, c, { n: 5, l: L_WOOD }); p = q; }
      Bq.box(.14, .14, .1, 0, 0, z, COL.iron, { l: L_METAL });
    }
    this.barrel = new THREE.Mesh(Bq.build(), MAT.world); this.barrel.castShadow = this.barrel.receiveShadow = true; this.barrel.position.set(0, .74, 0); this.carriage.add(this.barrel);
    // the string and the bolt slide back together as the winch draws
    const St = new Soup(), tipZ = L / 2 - .12 - (n - 1) * .26 - .28;
    St.box(.03, .03, .03, 0, .08, 0, COL.rope, {}); for (const sg of [-1, 1]) St.seg([0, .08, 0], [sg * (1.05 - (n - 1) * .08), .02, .28], .008, .008, COL.rope, { n: 3 });
    St.box(.035, .035, 1.25, 0, .1, .62, COL.woodL, { jit: 0 }); St.cone(.05, .18, 0, .1, 1.33, COL.steel, { n: 4, r: [HPI, 0, 0], l: L_METAL }); for (const r of [0, HPI]) St.box(.1, .008, .14, 0, .1, .08, C(0xb02a1c), { r: [0, 0, r], jit: 0 });
    this.string = new THREE.Mesh(St.build(), MAT.world); this.string.position.set(0, 0, tipZ); this.barrel.add(this.string); this.string0 = tipZ;
    this.gunYaw = this.yaw;
  }
  get maxLvl() { return this.def.tiers.length - 1; }
  // the buildings have three visual stages; four-tier lines share the first stage between their first two tiers
  get vl() { return Math.max(0, this.lvl - (this.def.tiers.length - 3)); }
  upgrade() { if (this.lvl >= this.maxLvl || this.state !== 'active') return false; this.spent += upgradeCost(this); this.lvl++; for (const m of this.men) m.lvlUp = true; this.begin(); return true; }
  sell() {
    this.alive = false; this.em.alive = false; this.em.on = 0; LT.emitters[this.idx] = null; this.pad.tower = null;
    for (let i = 0; i < 14; i++) { _tm.compose(_tv.set(this.x + rr(-.7, .7), this.y + rr(.3, 2.4), this.z + rr(-.7, .7)), _tq.set(rr(-1, 1), rr(-1, 1), rr(-1, 1), 1).normalize(), _ts.set(1, 1, 1)); addDebris(this.kind === 'archer' || this.kind === 'guard' ? KIT.plank : KIT.rubble, _tm, null, rr(-2, 2), rr(1, 4), rr(-2, 2), rr(3, 9), rr(2, 3.5)); }
    fxDust(this.x, this.y + .4, this.z, 16, 1.6, { speed: 2.6 }); sfx('sell', this.x, this.z, 1);
    for (const m of this.men) m.leave = true;
    this.clearModel(false); R.scene.remove(this.group);
  }
  update(dt) {
    const d = this.def, lvl = this.lvl; this.recent = Math.max(0, this.recent - dt * .25);
    if (raidTend(this, dt)) return;
    if (this.state !== 'active') {
      this.bt += dt; const bt = this.bt;
      if (this.scaf) this.scaf.scale.y = bt < this.tEnd - .25 ? easeOutBack(bt / .3) : Math.max(.01, 1 - (bt - (this.tEnd - .25)) / .25);
      for (const p of this.pieces) {
        const u = (bt - p.t0) / .24;
        if (u < 0) continue; p.mesh.visible = true;
        if (u < 1) p.mesh.position.y = p.y + (1 - u * u) * 2.2;
        else { p.mesh.position.y = p.y; const sq = clamp((u - 1) / .5, 0, 1); p.mesh.scale.y = 1 - .1 * Math.sin(sq * PI) * (1 - sq);
          if (!p.landed) { p.landed = true; fxDust(this.x + rr(-.5, .5), this.y + p.y + .1, this.z + rr(-.5, .5), 3, .55, { speed: 1.2, a: .4 }); sfx('hammer', this.x, this.z, .7, rnd()); } }
      }
      this.em.on = damp(this.em.on, 0, 4, dt);
      if (bt >= this.tEnd) this.finish();
      return;
    }
    this.appear = Math.min(1, this.appear + dt * 2.2);
    TOWER_STUN = this.stun > 0;
    if (TOWER_STUN) { this.stun -= dt; if (rnd() < dt * 8) fxDust(this.x + rr(-.8, .8), this.y + rr(.2, 2.4), this.z + rr(-.8, .8), 1, .6, { a: .4 }); }
    this.em.on = damp(this.em.on, TOWER_STUN ? .12 : 1, TOWER_STUN ? 8 : 3, dt);
    if (this.flame) this.flame.on = this.em.on; if (this.flame2) this.flame2.on = this.em.on;
    this.cool -= dt;
    if (this.kind === 'archer') this.updArcher(dt, d, lvl);
    else if (this.kind === 'bombard') this.updBombard(dt, d, lvl);
    else if (this.kind === 'spire') this.updSpire(dt, d, lvl);
    else this.updGuard(dt, d, lvl);
    crewDraw(this, dt); // the extra hands of the lesser upgrade (66-crew.js)
    TOWER_STUN = false;
  }
  updArcher(dt, d, lvl) {
    const tgt = findTarget(this.x, this.z, d.range[lvl], true, true);
    for (const a of this.archers) {
      const p = this.w(a.l, _ap), e = a.e; e.x = p.x; e.y = p.y - (1 - easeOut(this.appear)) * .5; e.z = p.z; e.scale = .82 * (.3 + .7 * this.appear);
      a.cool -= dt;
      if (tgt) {
        const T = clamp(Math.hypot(tgt.x - p.x, tgt.z - p.z) / 14, .22, .62), q = aimPoint(tgt, T, _ap2);
        a.yaw = angDamp(a.yaw, Math.atan2(q.x - p.x, q.z - p.z), 12, dt);
        e.pitch = clamp(Math.atan2(q.y - (p.y + 1), Math.hypot(q.x - p.x, q.z - p.z)) * .7 + .2, -.5, .6);
        a.draw = a.cool < .34 ? Math.min(1, a.draw + dt * 3.6) : Math.max(0, a.draw - dt * 6);
        if (a.cool <= 0 && a.draw > .95) {
          a.cool = d.rate[lvl] * rr(.9, 1.12); a.draw = 0;
          shootArrow(p.x + Math.sin(a.yaw) * .3, p.y + 1.0, p.z + Math.cos(a.yaw) * .3, tgt, d.dmg[lvl], this);
          sfx('bow', p.x, p.z, .6, rnd());
        }
      } else { a.draw = Math.max(0, a.draw - dt * 3); a.yaw = angDamp(a.yaw, this.yaw + Math.sin(G.t * .5 + a.l[0] * 3) * .5, 2, dt); e.pitch = damp(e.pitch, 0, 4, dt); if (a.cool < .3) a.cool = .3; }
      e.yaw = a.yaw; e.draw = a.draw;
      rigHuman(KIT.foot, SPEC.foot, e);
    }
  }
  updBombard(dt, d, lvl) {
    const tgt = findTarget(this.x, this.z, d.range[lvl], false, true, d.minRange);
    this.recoil = Math.max(0, this.recoil - dt * 1.4);
    let aligned = false;
    if (tgt) {
      const dist = Math.hypot(tgt.x - this.x, tgt.z - this.z), T = clamp(dist / 7.2, .75, 1.45), q = aimPoint(tgt, T, _ap2);
      const want = Math.atan2(q.x - this.x, q.z - this.z); this.gunYaw = angDamp(this.gunYaw, want, 5, dt); aligned = Math.abs(angDiff(this.gunYaw, want)) < .12;
      if (aligned && this.cool <= 0) {
        this.cool = d.rate[lvl] * rr(.95, 1.08); this.recoil = 1;
        this.barrel.rotation.x = .5; this.carriage.updateMatrixWorld(true); const mz = _tv.set(0, this.armL, 0).applyMatrix4(this.barrel.matrixWorld);
        const gy = G.B.heightAt(q.x, q.z), fire = lvl === this.maxLvl;
        G.shells.push({ x0: mz.x, y0: mz.y, z0: mz.z, tx: q.x, ty: Math.max(gy, q.y - tgt.hitH) + .05, tz: q.z, t: 0, T, dmg: d.dmg[lvl] * crewDmg(this), splash: d.splash[lvl], tower: this, x: mz.x, y: mz.y, z: mz.z, sm: 0, arc: 2.2 + dist * .25, fire });
        fxDust(this.x, this.y + .3, this.z, 3, .7, { speed: 1.4, a: .35 });
        sfx('bossStep', this.x, this.z, .7, .2); sfx('zap', this.x, this.z, .4, 1);
      }
    } else this.gunYaw = angDamp(this.gunYaw, this.yaw + Math.sin(G.t * .3 + this.idx) * .7, 1.2, dt);
    this.carriage.rotation.y = this.gunYaw - this.yaw;
    // the throw: the long arm whips up and over, then the crew haul it back down
    const u = 1 - this.recoil; this.barrel.rotation.x = this.recoil <= 0 ? -2.1 : u < .18 ? lerp(-2.1, .5, easeIn(u / .18)) : lerp(.5, -2.1, easeInOut((u - .18) / .82));
  }
  updSpire(dt, d, lvl) {
    const tgt = findTarget(this.x, this.z, d.range[lvl], true, true);
    const was = this.charge;
    this.charge = tgt ? Math.min(1, this.charge + dt / (d.rate[lvl] * crewRate(this))) : Math.max(0, this.charge - dt * .25);
    if (was < .1 && this.charge >= .1 && tgt) sfx('charge', this.x, this.z, .5);
    if (tgt) { const want = Math.atan2(tgt.x - this.x, tgt.z - this.z); this.gunYaw = angDamp(this.gunYaw, want, 6, dt); }
    else this.gunYaw = angDamp(this.gunYaw, this.yaw + Math.sin(G.t * .3 + this.idx) * .6, 1.2, dt);
    this.carriage.rotation.y = this.gunYaw - this.yaw;
    const c = this.charge; this.recoil = Math.max(0, this.recoil - dt * 3);
    this.string.position.z = this.string0 - easeInOut(c) * .55 + this.recoil * .1; this.string.visible = c > .05 || this.recoil > 0;
    this.barrel.rotation.x = -.06 - .08 * this.recoil;
    if (c >= 1 && tgt) {
      this.charge = 0; this.recoil = 1; let cur = tgt, dmg = d.dmg[lvl]; const hit = [];
      this.carriage.updateMatrixWorld(true); const mz = _tv.set(0, .1, .9).applyMatrix4(this.barrel.matrixWorld), ox = mz.x, oy = mz.y, oz = mz.z;
      for (let j = 0; j < d.jumps[lvl] && cur; j++) {
        hit.push(cur); shootArrow(ox + rr(-.15, .15), oy + rr(-.05, .1), oz + rr(-.15, .15), cur, dmg, this, { kind: 'bolt', slow: [d.slow[lvl], d.slowT[lvl]], fast: true });
        const cx = cur.x, cz = cur.z; dmg *= .86; let nb = null, nd = 3.0 * 3.0;
        for (const m of G.mons) { if (m.dead || m.hp <= 0 || !m.vis || hit.includes(m)) continue; const dd = dist2(cx, cz, m.x, m.z); if (dd < nd) { nd = dd; nb = m; } }
        cur = nb;
      }
      fxDust(ox, oy, oz, 4, .5, { speed: 1.6, a: .4 });
      sfx('zap', this.x, this.z, 1, lvl / 3); FX.shake = Math.min(1, FX.shake + .05);
    }
  }
  updGuard(dt, d, lvl) {
    for (let i = this.men.length - 1; i >= 0; i--) if (this.men[i].gone) this.men.splice(i, 1);
    if (this.men.length < crewMen(this)) { this.respawn -= dt; if (this.respawn <= 0) { this.respawn = this.men.length === 0 && G.t < 4 ? .5 : d.rate[lvl]; spawnFootman(this); } }
  }
  dispose() { this.alive = false; this.em.alive = false; LT.emitters[this.idx] = null; this.clearModel(false); R.scene.remove(this.group); this.pad.tower = null; }
}
const _ap2 = { x: 0, y: 0, z: 0, tx: 0, tz: 0 };

function shootArrow(x, y, z, m, dmg, tower, o = {}) {
  const dist = Math.hypot(m.x - x, m.z - z), T = clamp(dist / (o.fast ? 24 : 14), o.fast ? .12 : .22, .62), q = aimPoint(m, T, _ap2);
  G.arrows.push({ x0: x, y0: y, z0: z, tx: q.x, ty: q.y, tz: q.z, t: 0, T, m, dmg, tower, x, y, z, dx: 0, dy: 0, dz: 1, arc: o.fast ? .05 + dist * .02 : .25 + dist * .07, alive: true, lI: o.fast ? 0 : 22, lCol: 0xff9040, lx: x, ly: y, lz: z, lseed: rnd() * 9, ember: 0, kind: o.kind || 'arrow', slow: o.slow || null, plain: !!o.fast });
}
function arrowMatrix(x, y, z, dx, dy, dz) { _tq.setFromUnitVectors(_tz, _tv.set(dx, dy, dz).normalize()); return _tm.compose(_tv.set(x, y, z), _tq, _ts.set(1, 1, 1)); }
function updateProjectiles(dt) {
  const A = G.arrows, B = G.B;
  for (let i = A.length - 1; i >= 0; i--) {
    const a = A[i]; a.t += dt; const u = Math.min(1, a.t / a.T), m = a.m;
    if (m && !m.dead && m.hp > 0) { const q = aimPoint(m, Math.max(0, a.T - a.t), _ap2), k = Math.min(1, dt * 9); a.tx = lerp(a.tx, q.x, k); a.ty = lerp(a.ty, q.y, k); a.tz = lerp(a.tz, q.z, k); }
    const px = a.x, py = a.y, pz = a.z;
    a.x = lerp(a.x0, a.tx, u); a.z = lerp(a.z0, a.tz, u); a.y = lerp(a.y0, a.ty, u) + a.arc * 4 * u * (1 - u);
    const dx = a.x - px, dy = a.y - py, dz = a.z - pz, l = Math.hypot(dx, dy, dz) || 1; a.dx = dx / l; a.dy = dy / l; a.dz = dz / l;
    a.lx = a.x; a.ly = a.y; a.lz = a.z;
    KIT.arrow.put(arrowMatrix(a.x, a.y, a.z, a.dx, a.dy, a.dz), 0, null);
    const hx = a.x + a.dx * .25, hy = a.y + a.dy * .25, hz = a.z + a.dz * .25;
    if (a.plain) FX.segs.push(hx, hy, hz, .04, hx - a.dx * 1.4, hy - a.dy * 1.4, hz - a.dz * 1.4, .0, .9, .85, .7, .5);
    else { FX.segs.push(hx, hy, hz, .055, hx - a.dx * .95, hy - a.dy * .95, hz - a.dz * .95, .0, 2.6, 1.05, .25, .85);
    FX.add.push(hx, hy, hz, .3, .3, 0, 0, 3.6, 1.9, .5, 1, 0, 0, 0, 0); FX.add.push(hx, hy, hz, 1.0, 1.0, 0, 0, 1, .45, .12, .22, 2, 0, 0, 0); }
    if (!a.plain) a.ember += dt * 26; while (a.ember > 1) { a.ember -= 1; fxPart(hx, hy, hz, rr(-.4, .4), rr(-.1, .6), rr(-.4, .4), rr(.25, .6), .05, 2.6, 1.1, .2, { drag: 1.5, rise: .6 }); }
    if (u >= 1) {
      a.alive = false; swapRemove(A, i);
      if (m && !m.dead && m.hp > 0 && dist2(a.tx, a.tz, m.x, m.z) < 1.0) {
        fxSparks(a.x, a.y, a.z, 5, 3, 3, 1.5, .4, { size: .055, grav: 6 }); fxTimed(2, a.x, a.y, a.z, .9, .9, 1.6, .8, .25, .8, .12);
        sfx('arrowHit', a.x, a.z, .55, rnd()); if (a.slow) slowMonster(m, a.slow[0], a.slow[1]); hitMonster(m, a.dmg, a.kind, a.dx, a.dz, a.tower);
      } else if (!m || !m.fly) {
        const gy = B.heightAt(a.x, a.z);
        G.stuck.push({ x: a.x, y: gy + .12, z: a.z, dx: a.dx, dy: Math.min(-.5, a.dy), dz: a.dz, life: 3.2 });
        fxSparks(a.x, gy + .1, a.z, 3, 2, 3, 1.5, .4, { size: .05 });
      }
    }
  }
  const St = G.stuck;
  for (let i = St.length - 1; i >= 0; i--) {
    const s = St[i]; s.life -= dt; if (s.life <= 0) { swapRemove(St, i); continue; }
    KIT.arrow.put(arrowMatrix(s.x, s.y - Math.max(0, .5 - s.life) * .5, s.z, s.dx, s.dy, s.dz), 0, null);
    if (s.life > 1.4) { FX.add.push(s.x - s.dx * .25, s.y - s.dy * .25 + .04, s.z - s.dz * .25, .2, .2, 0, 0, 3, 1.4, .3, Math.min(1, (s.life - 1.4)), 0, 0, 0, 0); if (rnd() < dt * 5) fxPart(s.x, s.y + .1, s.z, rr(-.1, .1), rr(.4, .9), rr(-.1, .1), .6, .045, 2.4, 1, .2, { drag: .5, wob: 1 }); }
  }
  const Sh = G.shells;
  for (let i = Sh.length - 1; i >= 0; i--) {
    const s = Sh[i]; s.t += dt; const u = Math.min(1, s.t / s.T);
    s.x = lerp(s.x0, s.tx, u); s.z = lerp(s.z0, s.tz, u); s.y = lerp(s.y0, s.ty, u) + s.arc * 4 * u * (1 - u);
    _tm.compose(_tv.set(s.x, s.y, s.z), _tq.setFromAxisAngle(_tz, s.t * 9), _ts.set(1, 1, 1)); (s.fire ? KIT.shell : KIT.stoneShot).put(_tm, 0, null);
    if (s.fire) FX.add.push(s.x, s.y + .1, s.z, .3, .3, 0, 0, 3.2, 1.5, .3, 1, 0, 0, 0, 0);
    if (s.fire) s.sm += dt * 30; while (s.sm > 1) { s.sm -= 1; fxSmoke(s.x, s.y, s.z, rr(-.1, .1), rr(0, .2), rr(-.1, .1), rr(.5, .9), .16, .3, .26, .25, .25, .32, { drag: 1 }); if (rnd() < .5) fxPart(s.x, s.y, s.z, rr(-.5, .5), rr(-.2, .5), rr(-.5, .5), .4, .05, 2.5, 1.1, .2, { grav: 2 }); }
    if (u >= 1) { swapRemove(Sh, i); explodeAt(s.tx, s.ty, s.tz, s.dmg, s.splash, s.tower, !s.fire); }
  }
}
function explodeAt(x, y, z, dmg, splash, tower, stone) {
  const sc = splash / 1.7;
  if (stone) { fxDust(x, y + .1, z, 12, splash * .8, { speed: 3.2 }); FX.shake = Math.min(1, FX.shake + .1); sfx('hammer', x, z, 1, .1); sfx('bossStep', x, z, .6, .5); }
  else { fxExplosion(x, y, z, sc); sfx('explode', x, z, 1, clamp(sc - .6, 0, 1)); }
  FX.decals.add(G.B.heightAt, x, z, splash * 1.2, .016, .013, .011, .85, 45);
  for (const m of G.mons) {
    if (m.dead || m.hp <= 0 || m.fly || !m.vis) continue;
    const d = Math.hypot(m.x - x, m.z - z); if (d > splash + m.rad) continue;
    const k = lerp(1, .45, sat(d / splash)), l = d || 1;
    hitMonster(m, dmg * k, 'blast', (m.x - x) / l, (m.z - z) / l, tower);
  }
  for (let i = 0; i < 5; i++) { _tm.compose(_tv.set(x + rr(-.3, .3), y + .2, z + rr(-.3, .3)), _tq.set(rr(-1, 1), rr(-1, 1), rr(-1, 1), 1).normalize(), _ts.set(.6, .6, .6)); addDebris(KIT.rubble, _tm, [.5, .45, .4], rr(-3, 3), rr(3, 6), rr(-3, 3), rr(4, 10), rr(1.6, 2.6)); }
}
