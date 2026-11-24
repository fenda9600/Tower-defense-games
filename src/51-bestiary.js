
SPEC.golem = { hip: .5, pelvisH: .1, torsoH: .56, shX: .36, shY: .44, uArm: .26, lArm: .38, hipX: .15, uLeg: .22, lLeg: .24, stride: .42, lean: .1, stoop: .16, eyeX: .04, eyeY: .1, eyeZ: .16, top: 1.35 };

function golemKit(cap) {
  // A terracotta warrior: fired clay plate armour over a robe, a scarf, a topknot, and light leaking from the cracks.
  const k = {}, limb = cap * 2, c = [.47, .32, .23], cd = [.31, .21, .155], cl = [.6, .43, .32], gl = [1, .9, .8], rk = () => ({ l: L_ROCK, jit: .06 });
  k.pelvis = new PartBatch(S => { S.box(.52, .24, .36, 0, -.03, 0, cd, rk()); for (const y of [-.1, -.02, .06]) S.box(.53, .016, .37, 0, y, 0, c, { l: L_ROCK, jit: 0 }); for (const x of [-.15, 0, .15]) S.box(.014, .22, .372, x, -.03, 0, mulC(cd, .7), { jit: 0 }); }, cap, { rad: .2, shadow: false });
  k.torso = new PartBatch(S => {
    S.box(.56, .38, .38, 0, .2, 0, c, rk()); S.box(.62, .2, .4, 0, .45, 0, c, rk());
    for (const y of [.08, .17, .26, .35, .44]) S.box(.572, .014, .39, 0, y, 0, cd, { l: L_ROCK, jit: 0 }); for (const x of [-.19, -.065, .065, .19]) S.box(.014, .46, .392, x, .27, 0, cd, { jit: 0 });
    for (const y of [.125, .215, .305, .395]) for (const x of [-.127, 0, .127]) S.box(.022, .022, .4, x, y, 0, cl, { jit: 0 });
    for (const s of [-1, 1]) { S.box(.22, .15, .36, s * .37, .47, 0, cd, rk()); S.box(.23, .014, .37, s * .37, .47, 0, c, { jit: 0 }); }
    S.cyl(.19, .09, 0, .57, .0, cl, { n: 8, l: L_ROCK }); S.box(.12, .14, .06, .06, .5, .19, cl, { l: L_ROCK, r: [0, 0, .3] });
    S.box(.03, .26, .012, .1, .24, .197, gl, { emis: .1, jit: 0, r: [0, 0, .35] }); S.box(.026, .18, .012, -.09, .3, .197, gl, { emis: .1, jit: 0, r: [0, 0, -.5] }); S.box(.026, .14, .012, -.02, .12, .197, gl, { emis: .1, jit: 0, r: [0, 0, 1.2] });
  }, cap, { rad: .3 });
  k.head = new PartBatch(S => {
    S.box(.23, .25, .23, 0, .125, .01, cl, rk()); S.box(.2, .06, .05, 0, .02, .1, cl, rk()); S.box(.045, .08, .04, 0, .1, .135, c, { l: L_ROCK }); S.box(.15, .028, .03, 0, .055, .128, cd, { jit: 0 });
    S.box(.16, .03, .02, 0, .14, .128, gl, { emis: .22, jit: 0 }); for (const s of [-1, 1]) S.box(.03, .08, .05, s * .125, .12, .0, c, { l: L_ROCK });
    S.box(.25, .07, .25, 0, .265, .0, cd, rk()); S.box(.06, .16, .1, 0, .2, -.14, cd, { l: L_ROCK }); S.cyl(.062, .12, .065, .35, -.04, cd, { n: 6, l: L_ROCK, r: [0, 0, -.35] }); S.box(.16, .025, .03, .04, .31, -.04, c, { l: L_ROCK, r: [0, .5, 0] });
  }, cap, { rad: .14, shadow: false });
  k.uArm = new PartBatch(S => { S.box(.2, .27, .23, 0, -.12, 0, c, rk()); for (const y of [-.06, -.14, -.22]) S.box(.206, .014, .236, 0, y, 0, cd, { jit: 0 }); }, limb, { rad: .12, shadow: false });
  k.lArm = new PartBatch(S => { S.box(.2, .3, .21, 0, -.15, 0, cd, rk()); S.box(.215, .045, .225, 0, -.28, 0, cl, { l: L_ROCK }); S.box(.17, .14, .19, 0, -.38, .01, cl, rk()); for (const x of [-.05, 0, .05]) S.box(.012, .06, .192, x, -.42, .012, cd, { jit: 0 }); }, limb, { rad: .15, shadow: false });
  k.uLeg = new PartBatch(S => { S.box(.21, .25, .25, 0, -.1, 0, cd, rk()); S.box(.215, .02, .255, 0, -.21, 0, c, { jit: 0 }); }, limb, { rad: .13, shadow: false });
  k.lLeg = new PartBatch(S => { S.box(.17, .22, .19, 0, -.11, 0, c, rk()); for (const y of [-.06, -.14]) S.box(.176, .016, .196, 0, y, 0, cd, { jit: 0 }); S.box(.2, .09, .32, 0, -.245, .05, cd, rk()); S.box(.2, .06, .07, 0, -.215, .21, cd, { l: L_ROCK }); }, limb, { rad: .13, shadow: false });
  return k;
}

function initBestiary() {
  const I = KIT.item, cloth = C(0x3b3048), clothL = C(0x6a4a78), wrap = C(0xcdbf9a), N = { rad: .2, shadow: false };
  KIT.golem = golemKit(8);
  const ink = [.07, .07, .09], paper = C(0xd6d2c2);
  I.hood = new PartBatch(S => {
    // the tall hat of a soul catcher, with a paper slip down the front and long hair behind
    S.cyl(.17, .04, 0, .27, 0, paper, { n: 8, l: L_CLOTH }); S.cyl(.125, .5, 0, .53, -.01, ink, { n: 6, rt: .78, l: L_CLOTH }); S.cyl(.1, .03, 0, .79, -.01, paper, { n: 6, l: L_CLOTH });
    S.box(.07, .36, .012, 0, .52, .105, paper, { jit: 0, r: [-.06, 0, 0] }); for (const y of [.4, .5, .6]) S.box(.04, .035, .014, 0, y, .112 - (y - .4) * .06, C(0x8a1a14), { jit: 0, r: [-.06, 0, 0] });
    S.box(.3, .42, .06, 0, .04, -.15, ink, { l: L_CLOTH }); for (const s of [-1, 1]) S.box(.05, .34, .16, s * .17, .06, -.05, ink, { l: L_CLOTH });
  }, 12, N);
  I.robe = new PartBatch(S => {
    S.add(gCyl(8, .5, true), { s: [.3, 1.12, .27], p: [0, -.12, 0], c: ink, l: L_CLOTH, dbl: true, deform: v => { if (v.y < 0) { const j = .85 + .3 * vnoise(Math.atan2(v.z, v.x) * 2 + 3, 1, 7); v.x *= j; v.z *= j; v.y += (j - 1) * .25; } }, cf: v => .7 + .3 * sat(v.y / .56 + .5) });
    S.box(.46, .1, .28, 0, .4, 0, paper, { l: L_CLOTH }); S.box(.07, .5, .02, 0, .16, .165, paper, { l: L_CLOTH, r: [-.12, 0, 0] }); S.cyl(.21, .05, 0, .02, 0, paper, { n: 8, l: L_CLOTH });
    S.box(.05, .26, .02, .1, -.1, .21, paper, { l: L_CLOTH, r: [-.1, 0, .12] });
  }, 12, N);
  I.staff = new PartBatch(S => {
    // a soul summoning banner: paper streamers under a crossbar, a bell, a paper green flame
    S.seg([0, -.55, 0], [0, 1.0, 0], .026, .022, C(0x2a1a14), { l: L_WOOD, n: 5 }); S.seg([-.2, .93, 0], [.2, .93, 0], .016, .016, C(0x2a1a14), { l: L_WOOD, n: 4 });
    for (const [x, len] of [[-.15, .5], [-.05, .62], [.05, .56], [.15, .44]]) { S.box(.07, len, .008, x, .92 - len / 2, 0, paper, { jit: .06, r: [0, 0, x * .3] }); S.box(.03, .03, .01, x, .8, 0, C(0x8a1a14), { jit: 0 }); S.box(.03, .03, .01, x, .7, 0, ink, { jit: 0 }); }
    S.cyl(.03, .05, .2, .87, 0, COL.brass, { n: 6, rt: .5, l: L_METAL }); S.ico(.065, 0, 1.07, 0, [.35, 1, .5], { d: 1, emis: .2, jit: 0 });
  }, 12, N);
  I.drum = new PartBatch(S => {
    const T = new Soup(); T.cyl(.2, .2, 0, 0, 0, C(0x7a2c24), { n: 10, l: L_WOOD }); T.cyl(.205, .03, 0, .1, 0, C(0xc9b28a), { n: 10 }); T.cyl(.212, .025, 0, -.09, 0, COL.brass, { n: 10, l: L_METAL }); T.cyl(.212, .025, 0, .08, 0, COL.brass, { n: 10, l: L_METAL });
    S.merge(T, { p: [0, .1, .28], r: [.5, 0, 0], ao: null }); S.box(.05, .5, .03, .05, .26, .13, COL.leather, { r: [0, 0, .55] });
  }, 8, N);
  I.standard = new PartBatch(S => {
    S.seg([0, .1, -.14], [0, 1.55, -.2], .022, .018, COL.woodD, { l: L_WOOD, n: 4 }); S.seg([-.2, 1.42, -.2], [.2, 1.42, -.2], .016, .016, COL.woodD, { l: L_WOOD, n: 4 });
    clothPanel(S, { x0: -.18, x1: .18, yTop: 1.41, len: .56, z: -.2, col: COL.clothR, col2: mulC(COL.gold, .6), rng: makeRng(21), sway: 0, nx: 3, ny: 5 });
    PROP.skull(S, 0, 1.62, -.2, .07, 0);
  }, 8, { rad: .3, shadow: false });
  I.stick = new PartBatch(S => { S.seg([0, -.05, 0], [0, .3, 0], .02, .018, COL.bone, { l: L_BONE, n: 4 }); S.ico(.04, 0, .32, 0, COL.boneD, { d: 0, l: L_BONE }); }, 8, N);
  I.keg = new PartBatch(S => {
    // a sealed powder jar on the back, with a red paper label and a lit fuse
    const T = new Soup(); PROP.jar(T, makeRng(3)); S.merge(T, { p: [0, .0, -.31], s: .78, ao: null });
    S.box(.14, .14, .012, 0, .24, -.475, C(0xb02a1c), { jit: 0, r: [0, 0, PI / 4] }); S.box(.05, .05, .014, 0, .24, -.48, ink, { jit: 0, r: [0, 0, PI / 4] });
    S.cyl(.09, .03, 0, .5, -.31, C(0x8a1a14), { n: 8, l: L_CLOTH }); S.seg([0, .51, -.31], [.06, .64, -.28], .012, .01, COL.rope, { n: 3 }); S.ico(.035, .06, .65, -.28, COL.ember, { d: 0, emis: .6, jit: 0 });
    S.box(.05, .5, .03, 0, .22, .12, COL.leather, { r: [0, 0, .5] }); S.box(.05, .5, .03, 0, .22, .12, COL.leather, { r: [0, 0, -.5] }); for (const s of [-1, 1]) S.box(.03, .04, .3, s * .12, .36, -.14, COL.rope, {});
  }, 12, N);
  const jade = [.3, .56, .42], jadeL = [.42, .7, .54], gth = mulC(COL.gold, .9);
  I.wraps = new PartBatch(S => {
    // a jade burial suit: small plates laced with gold wire
    S.box(.35, .43, .25, 0, .22, 0, jade, { rough: .35, jit: .04 }); for (const y of [.07, .15, .23, .31, .39]) S.box(.356, .012, .256, 0, y, 0, gth, { l: L_METAL, jit: 0, emis: .03 }); for (const x of [-.12, -.04, .04, .12]) S.box(.012, .43, .258, x, .22, 0, gth, { l: L_METAL, jit: 0, emis: .03 });
    for (const s of [-1, 1]) S.box(.14, .08, .2, s * .22, .43, 0, jadeL, { rough: .35 }); S.box(.26, .22, .02, 0, -.1, .1, jade, { rough: .35 }); for (const y of [-.05, -.13]) S.box(.264, .012, .024, 0, y, .1, gth, { l: L_METAL, jit: 0 });
  }, 12, N);
  I.wrapHead = new PartBatch(S => {
    S.box(.3, .3, .29, 0, .17, -.005, jade, { rough: .35, jit: .04 }); S.box(.306, .012, .296, 0, .1, -.005, gth, { l: L_METAL, jit: 0, emis: .03 }); S.box(.306, .012, .296, 0, .25, -.005, gth, { l: L_METAL, jit: 0, emis: .03 }); for (const x of [-.075, .075]) S.box(.012, .3, .296, x, .17, -.005, gth, { l: L_METAL, jit: 0, emis: .03 });
    for (const s of [-1, 1]) S.box(.07, .05, .02, s * .058, .185, .136, COL.black, { jit: 0 }); S.box(.05, .09, .03, 0, .13, .145, jadeL, { rough: .35 }); S.box(.1, .02, .02, 0, .06, .14, COL.black, { jit: 0 });
  }, 12, N);
  I.crown = new PartBatch(S => {
    // an emperor's mian: a flat board on a cap, with strings of beads front and back
    const g = mulC(COL.gold, .9), bk = mulC(COL.black, 3);
    S.cyl(.165, .12, 0, .28, 0, bk, { n: 8, l: L_CLOTH }); S.cyl(.17, .03, 0, .23, 0, g, { n: 8, l: L_METAL, rough: .35, emis: .03 });
    S.box(.3, .025, .52, 0, .37, .0, bk, { r: [.14, 0, 0] }); S.box(.31, .03, .04, 0, .335, .255, g, { l: L_METAL, emis: .03 }); S.box(.31, .03, .04, 0, .405, -.255, g, { l: L_METAL, emis: .03 });
    for (let k = -2; k <= 2; k++) { S.box(.016, .16, .016, k * .06, .25, .26, k & 1 ? [.2, .9, .8] : g, { emis: .2, jit: 0 }); S.box(.016, .14, .016, k * .06, .33, -.26, k & 1 ? g : [.9, .25, .2], { emis: .15, jit: 0 }); }
    for (const s of [-1, 1]) S.box(.05, .3, .16, s * .17, .12, -.02, C(0x6a1c18), { l: L_CLOTH });
    S.seg([-.2, .29, 0], [.2, .29, 0], .012, .012, g, { n: 4, l: L_METAL });
  }, 2, N);
  I.khopesh = new PartBatch(S => {
    const g = mulC(COL.bronzeG, 1.1), gd = mulC(COL.gold, .85);
    S.box(.04, .22, .04, 0, 0, 0, COL.lacqD, {}); S.ico(.04, 0, -.13, 0, gd, { d: 0, l: L_METAL }); S.box(.18, .035, .06, 0, .12, 0, gd, { l: L_METAL, rough: .4 });
    S.box(.022, .5, .1, 0, .39, 0, g, { l: L_METAL, rough: .4 }); S.box(.03, .5, .02, 0, .39, 0, mulC(g, 1.3), { l: L_METAL, rough: .35 }); S.cone(.05, .14, 0, .71, 0, g, { n: 4, l: L_METAL, rough: .4, rz: .012 });
  }, 2, N);
  I.jhat = new PartBatch(S => {
    // an official's hat with a red knob, and a paper charm stuck over the face
    const bk = mulC(COL.black, 3.5);
    S.cyl(.2, .03, 0, .225, 0, bk, { n: 8, rt: .78 }); S.add(gDome(8, 3), { s: [.125, .1, .125], p: [0, .235, 0], c: bk }); S.ico(.032, 0, .35, 0, COL.lacqL, { d: 0, emis: .05 }); S.cyl(.13, .02, 0, .245, 0, C(0x8a1a14), { n: 8 });
    S.box(.08, .24, .012, 0, .1, .108, C(0xe6c84a), { emis: .1, jit: 0, r: [-.06, 0, 0] }); for (const y of [.03, .1, .17]) S.box(.045, .02, .014, 0, y, .116 - (y - .1) * .06, COL.lacq, { jit: 0 });
  }, 40, N);
  I.genHelm = new PartBatch(S => {
    // a general's helmet: bronze bowl, neck guard, red crest and two long pheasant plumes
    const bz = mulC(COL.brass, .95), bzD = mulC(COL.bronze, .9);
    S.add(gDome(8, 3), { s: [.19, .2, .205], p: [0, .17, 0], c: bz, l: L_METAL, rough: .4 }); S.cyl(.212, .035, 0, .175, 0, bzD, { n: 8, l: L_METAL, rough: .45 });
    S.box(.32, .18, .05, 0, .07, -.18, bzD, { l: L_METAL, rough: .5 }); for (const s of [-1, 1]) S.box(.045, .19, .2, s * .182, .07, -.04, bzD, { l: L_METAL, rough: .5 });
    S.box(.1, .09, .04, 0, .23, .19, bz, { l: L_METAL, rough: .35 }); S.ico(.03, 0, .24, .215, C(0xb02a1c), { d: 0, emis: .1, jit: 0 });
    S.cyl(.025, .1, 0, .41, 0, bz, { n: 5, l: L_METAL }); S.ico(.075, 0, .5, -.02, C(0xb02a1c), { d: 0, sc: [1, 1.2, 1.5] });
    for (const s of [-1, 1]) { let p = [s * .1, .34, -.02]; const pts = [[s * .2, .66, -.14], [s * .29, .92, -.36], [s * .34, 1.06, -.66], [s * .36, 1.08, -.95]]; pts.forEach((q, n) => { S.seg(p, q, .022 - n * .004, .018 - n * .004, n & 1 ? C(0xd8c49a) : C(0x5a3a22), { n: 4 }); p = q; }); }
  }, 2, N);
  I.genBack = new PartBatch(S => {
    // four command flags fanned across the back, beast-face shoulder guards and a chest mirror
    const bz = mulC(COL.brass, .95), red = C(0xa8281c), g = mulC(COL.gold, .85);
    for (const [x, tilt] of [[-.34, -.5], [-.13, -.18], [.13, .18], [.34, .5]]) {
      const b = [x * .5, .36, -.12], t = [x * 1.25, 1.02, -.3]; S.seg(b, t, .014, .011, C(0x2a1512), { l: L_WOOD, n: 4 }); S.cone(.02, .06, t[0], t[1] + .03, t[2], g, { n: 4, l: L_METAL });
      const sg = Math.sign(x), cx = lerp(b[0], t[0], .66) + sg * .1, cy = lerp(b[1], t[1], .66), cz = lerp(b[2], t[2], .66);
      S.box(.2, .3, .012, cx, cy, cz, red, { l: L_CLOTH, r: [.25, 0, -tilt * .55] }); S.box(.1, .12, .016, cx, cy, cz, g, { jit: 0, r: [.25, 0, -tilt * .55] });
    }
    for (const s of [-1, 1]) { S.box(.19, .1, .2, s * .25, .46, 0, bz, { l: L_METAL, rough: .4 }); S.sph(.06, s * .3, .47, .06, bz, { l: L_METAL, w: 6, h: 4, smooth: false }); S.box(.17, .12, .02, s * .26, .36, .0, mulC(COL.bronze, .9), { l: L_METAL, r: [0, 0, s * .2] }); }
    S.cyl(.085, .02, 0, .3, .125, bz, { n: 8, r: [HPI, 0, 0], l: L_METAL, rough: .3 }); S.box(.34, .05, .2, 0, .06, 0, red, { l: L_CLOTH });
  }, 2, { rad: .6, shadow: false });
  I.iceclub = new PartBatch(S => {
    S.seg([0, -.12, 0], [0, .5, 0], .045, .06, COL.wood, { l: L_WOOD, n: 6 });
    for (let a = 0; a < 5; a++) S.add(gOct(), { s: [.09, .25, .09], p: [Math.cos(a * 1.26) * .07, .6 + (a & 1) * .06, Math.sin(a * 1.26) * .07], r: [Math.sin(a * 1.26) * .5, a, -Math.cos(a * 1.26) * .5], c: COL.ice, rough: .15, emis: .05 });
  }, 2, { rad: .1, shadow: false });

  KIT.spider = {
    body: new PartBatch(S => {
      const c = [.3, .27, .27], cd = [.19, .17, .18];
      S.ico(.2, 0, .03, -.2, c, { sc: [.95, .8, 1.25], d: 1 }); S.ico(.13, 0, 0, .08, cd, { sc: [1, .72, 1.1], d: 1 });
      S.box(.07, .02, .13, 0, .19, -.2, [1, .25, .12], { emis: .12, jit: 0 });
      for (const s of [-1, 1]) { S.cone(.025, .1, s * .045, -.06, .2, C(0x1a1414), { n: 4, r: [PI - .5, 0, 0] }); for (const [ex, ey, ez] of [[.035, .06, .19], [.075, .05, .16]]) S.box(.022, .022, .02, s * ex, ey, ez, COL.black, { jit: 0 }); }
    }, 70, { rad: .2 }),
    leg: new PartBatch(S => { const c = [.2, .18, .19]; S.seg([0, 0, 0], [.2, .15, 0], .024, .02, c, { n: 4 }); S.seg([.2, .15, 0], [.4, -.17, 0], .02, .009, c, { n: 4 }); }, 560, { rad: .05, shadow: false }),
  };
  KIT.wolf = {
    body: new PartBatch(S => {
      const f = [.3, .3, .33], fd = [.2, .2, .23];
      S.ico(.2, 0, .02, .16, f, { sc: [.78, .95, 1.15], d: 1 }); S.ico(.16, 0, 0, -.2, fd, { sc: [.78, .85, 1.35], d: 1 }); S.ico(.1, 0, 0, .3, [.42, .42, .45], { sc: [.7, .7, .6], d: 1 });
      for (let k = 0; k < 4; k++) S.cone(.045, .13, 0, .2 - k * .02, .2 - k * .13, fd, { n: 4, r: [-.5, 0, 0] });
      S.seg([0, .08, .3], [0, .2, .46], .11, .085, f, { n: 6 });
      S.ico(.105, 0, .24, .52, f, { sc: [.9, .85, 1.1], d: 1 }); S.box(.085, .07, .17, 0, .21, .66, fd, {}); S.box(.04, .03, .03, 0, .235, .75, COL.black, { jit: 0 }); S.box(.07, .025, .14, 0, .16, .64, C(0x3a1a18), {});
      for (const s of [-1, 1]) { S.cone(.035, .1, s * .065, .35, .48, fd, { n: 4 }); S.box(.025, .022, .02, s * .05, .27, .615, COL.black, { jit: 0 }); S.box(.012, .035, .012, s * .03, .165, .7, COL.bone, { jit: 0 }); }
    }, 28, { rad: .22 }),
    leg: new PartBatch(S => { const fd = [.2, .2, .23]; S.seg([0, 0, 0], [0, -.2, -.03], .055, .038, fd, { n: 5 }); S.seg([0, -.2, -.03], [0, -.39, .02], .034, .026, fd, { n: 5 }); S.box(.06, .035, .09, 0, -.4, .04, [.13, .13, .15], {}); }, 112, { rad: .05, shadow: false }),
    tail: new PartBatch(S => { S.seg([0, 0, 0], [0, -.07, -.3], .055, .02, [.2, .2, .23], { n: 5 }); }, 28, { rad: .05, shadow: false }),
  };
  KIT.wraith = {
    // a woman in a white burial robe, her face behind long black hair
    body: new PartBatch(S => {
      const c = [.62, .66, .74], cd = [.42, .46, .56], hair = [.035, .035, .05], face = [.74, .78, .8];
      S.add(gCyl(8, .32, true), { s: [.36, .96, .36], p: [0, .5, 0], c, l: L_CLOTH, dbl: true, emis: .03, deform: v => { if (v.y < 0) { const j = .75 + .55 * vnoise(Math.atan2(v.z, v.x) * 2.3 + 1, 2, 9); v.x *= j; v.z = v.z * j - .12; v.y += (j - 1) * .3; } }, cf: v => .5 + .5 * sat(v.y / .48 + .5) });
      S.ico(.22, 0, .9, -.02, c, { sc: [1.25, .42, .9], d: 1, l: L_CLOTH, emis: .02 }); S.cyl(.2, .045, 0, .64, -.03, [.5, .07, .07], { n: 8, l: L_CLOTH }); S.box(.05, .34, .02, .06, .48, .2, [.5, .07, .07], { l: L_CLOTH, r: [.12, 0, .08] });
      S.box(.1, .2, .02, 0, .86, .14, cd, { l: L_CLOTH, r: [.2, 0, 0] });
      S.sph(.115, 0, 1.03, .05, face, { sc: [1, 1.08, 1], w: 7, h: 5, smooth: false, emis: .04 });
      S.add(gDome(8, 4), { s: [.145, .15, .155], p: [0, 1.05, .02], c: hair }); S.box(.27, .7, .05, 0, .72, -.1, hair, {}); for (const s of [-1, 1]) S.box(.05, .52, .14, s * .135, .8, -.02, hair, {});
      for (const [x, len] of [[-.1, .34], [0, .22], [.095, .4], [.02, .08]]) S.box(.04, len, .02, x, 1.12 - len / 2, .165, hair, { jit: 0, r: [0, 0, x * .4] });
      for (const s of [-1, 1]) S.box(.04, .035, .03, s * .045, 1.04, .15, COL.black, { jit: 0 }); S.box(.04, .02, .02, 0, .96, .155, [.4, .05, .05], { jit: 0 });
    }, 30, { rad: .3 }),
    arm: new PartBatch(S => { const c = [.58, .62, .7]; S.seg([0, 0, 0], [0, -.1, .3], .07, .1, c, { l: L_CLOTH, n: 5 }); S.box(.17, .36, .02, 0, -.3, .3, c, { l: L_CLOTH, emis: .02 }); S.box(.13, .14, .02, 0, -.54, .3, [.42, .46, .56], { l: L_CLOTH }); for (let k = -1; k <= 1; k++) S.seg([k * .025, -.1, .33], [k * .05, -.17, .46], .012, .006, [.74, .78, .8], { n: 3 }); }, 60, { rad: .08, shadow: false }),
  };
  KIT.garg = {
    body: new PartBatch(S => {
      const st = [.3, .31, .35], sd = [.2, .21, .24];
      S.ico(.17, 0, 0, 0, st, { sc: [.9, 1.0, 1.05], d: 1, l: L_ROCK }); S.ico(.11, 0, .13, .17, st, { sc: [.95, .9, 1.05], d: 1, l: L_ROCK }); S.box(.1, .06, .1, 0, .08, .27, sd, { l: L_ROCK });
      for (const s of [-1, 1]) {
        S.seg([s * .06, .2, .14], [s * .13, .3, .04], .03, .02, sd, { n: 4 }); S.seg([s * .13, .3, .04], [s * .12, .36, -.08], .02, .006, sd, { n: 4 }); S.box(.03, .03, .02, s * .045, .15, .265, COL.black, { jit: 0 });
        S.seg([s * .12, -.02, .08], [s * .15, -.16, .2], .04, .028, sd, { n: 4 }); S.seg([s * .09, -.1, -.08], [s * .12, -.24, 0], .045, .03, sd, { n: 4 });
      }
      S.seg([0, -.05, -.15], [0, -.14, -.42], .04, .012, sd, { n: 4 }); S.cone(.04, .08, 0, -.15, -.46, sd, { n: 4, r: [-HPI, 0, 0] });
    }, 24, { rad: .2 }),
    wing: new PartBatch(S => {
      const c = [.26, .27, .31], c2 = [.17, .18, .21], pts = [[0, 0, .12], [.3, .06, .2], [.74, .04, .1], [.66, 0, -.1], [.46, 0, -.04], [.36, 0, -.24], [.18, 0, -.1], [0, 0, -.18]];
      for (let i = 1; i < pts.length - 1; i++) { S.tri(pts[0], pts[i + 1], pts[i], i & 1 ? c : c2, L_PLAIN, .9); S.tri(pts[0], pts[i], pts[i + 1], i & 1 ? c : c2, L_PLAIN, .9); }
      S.seg([0, 0, .12], [.3, .06, .2], .03, .022, c2, { n: 4 }); S.seg([.3, .06, .2], [.74, .04, .1], .022, .01, c2, { n: 4 });
    }, 48, { rad: .15, shadow: false }),
  };
  KIT.wisp = { core: new PartBatch(S => { S.ico(.07, 0, 0, 0, [.5, .5, .5], { d: 1, emis: .45, jit: 0 }); }, 60, { rad: .07, shadow: false }) };
  const tc = [.2, .29, .15], tcd = [.13, .2, .1], pale = [.46, .46, .28];
  const toadLeg = sg => new PartBatch(S => { S.seg([0, 0, 0], [sg * .17, .05, -.1], .075, .06, tc, { n: 5 }); S.seg([sg * .17, .05, -.1], [sg * .2, -.12, .08], .055, .04, tcd, { n: 5 }); S.box(.1, .03, .18, sg * .21, -.14, .14, tcd, {}); }, 40, { rad: .1, shadow: false });
  KIT.toad = {
    body: new PartBatch(S => {
      S.ico(.27, 0, .17, -.02, tc, { sc: [1.1, .72, 1.2], d: 1, c2: [pale[0], pale[1], pale[2], v => smooth(0, -.14, v.y)] }); S.ico(.19, 0, .2, .2, tc, { sc: [1.15, .68, 1.0], d: 1 });
      S.box(.34, .02, .2, 0, .15, .27, [.05, .06, .04], { jit: 0 }); S.ico(.12, 0, .08, .26, pale, { sc: [1.1, .7, .8], d: 1 });
      for (const s of [-1, 1]) { S.sph(.075, s * .12, .33, .2, tcd, { w: 6, h: 4 }); S.box(.05, .05, .03, s * .125, .345, .265, COL.black, { jit: 0 }); S.seg([s * .2, .1, .16], [s * .26, -.02, .26], .045, .035, tcd, { n: 4 }); S.box(.08, .025, .1, s * .27, -.03, .3, tcd, {}); }
      for (const [x, y, z] of [[.1, .34, -.1], [-.14, .31, -.02], [.02, .36, -.2], [-.05, .33, .05]]) S.ico(.035, x, y, z, tcd, { d: 0 });
    }, 40, { rad: .3 }),
    legR: toadLeg(1), legL: toadLeg(-1),
  };
}

function rigSpider(e) {
  const K = KIT.spider, s = e.scale || 1, fl = e.flash || 0, ph = e.ph, mv = e.mv, Z = [.15, .08, 0, -.08], A = [1.0, .4, -.3, -.9];
  const M0 = xf(_M[0], null, e.x, e.y + (.19 + Math.abs(Math.sin(ph * 2)) * .015 * mv) * s, e.z, -(e.flinch || 0) * .3, e.yaw, Math.sin(ph) * .04 * mv, s, s, s);
  K.body.put(M0, fl, e.tint);
  for (let i = 0; i < 4; i++) for (const sd of [-1, 1]) {
    const g = ((i + (sd > 0 ? 0 : 1)) & 1) ? PI : 0, a = A[i] + Math.sin(ph * 2 + g) * .32 * mv, lift = Math.max(0, Math.cos(ph * 2 + g)) * .3 * mv;
    K.leg.put(xf(_M[1 + i * 2 + (sd > 0 ? 0 : 1)], M0, sd * .09, 0, Z[i], 0, sd > 0 ? -a : PI + a, lift), fl, e.tint);
  }
  return M0;
}
function rigWolf(e) {
  const K = KIT.wolf, ph = e.ph, s = e.scale || 1, fl = e.flash || 0, mv = e.mv, g = Math.sin(ph * 2);
  const M0 = xf(_M[0], null, e.x, e.y + (.43 + Math.abs(g) * .06 * mv) * s, e.z, g * .1 * mv - (e.flinch || 0) * .4, e.yaw, 0, s, s, s);
  K.body.put(M0, fl, e.tint);
  for (let i = 0; i < 4; i++) { const fr = i < 2, sd = (i & 1) ? -1 : 1, a = Math.sin(ph * 2 + (fr ? 0 : 2.6) + (sd > 0 ? 0 : .5)) * .85 * mv; K.leg.put(xf(_M[4 + i], M0, sd * .1, -.04, fr ? .2 : -.26, a, 0, 0), fl, e.tint); }
  K.tail.put(xf(_M[8], M0, 0, .06, -.4, -.3 + g * .2 * mv, Math.sin(ph + 1) * .3, 0), fl, e.tint);
  return M0;
}
function rigWraith(e) {
  const K = KIT.wraith, s = e.scale || 1, fl = e.flash || 0, t = SH.uTime.value + (e.lseed || 0);
  const M0 = xf(_M[0], null, e.x, e.y + (.22 + Math.sin(t * 2.1) * .07) * s, e.z, .16 * e.mv - (e.flinch || 0) * .4, e.yaw, Math.sin(t * 1.3) * .06, s, s, s);
  K.body.put(M0, fl, e.tint);
  for (const sd of [-1, 1]) K.arm.put(xf(_M[sd > 0 ? 1 : 2], M0, sd * .22, .84, .04, -.25 + Math.sin(t * 1.7 + sd) * .22, sd * -.25, 0), fl, e.tint);
  return M0;
}
function rigWisp(e) {
  const s = (e.scale || 1) * (1 + .15 * Math.sin(SH.uTime.value * 9 + (e.lseed || 0) * 5));
  const M0 = xf(_M[0], null, e.x, e.y, e.z, 0, e.yaw, 0, s, s, s); KIT.wisp.core.put(M0, e.flash || 0, e.tint); return M0;
}
function rigToad(e) {
  const K = KIT.toad, s = e.scale || 1, h = e.hop || 0, fl = e.flash || 0;
  let y = 0, pitch = 0, ext = 0, sq = 1;
  if (h < .22) sq = 1 - .22 * easeOut(h / .22);
  else if (h < .62) { const u = (h - .22) / .4; y = Math.sin(u * PI) * .5; pitch = -.45 * Math.cos(u * PI); ext = Math.sin(Math.min(1, u * 1.5) * PI); sq = 1.08; }
  else if (h < .78) sq = 1 - .25 * Math.sin((h - .62) / .16 * PI);
  sq *= 1 - (e.flinch || 0) * .2;
  const M0 = xf(_M[0], null, e.x, e.y + (.1 + y) * s, e.z, pitch, e.yaw, 0, s, s * sq, s);
  K.body.put(M0, fl, e.tint);
  K.legR.put(xf(_M[1], M0, .17, .06, -.14, -ext * .9, 0, 0), fl, e.tint); K.legL.put(xf(_M[2], M0, -.17, .06, -.14, -ext * .9, 0, 0), fl, e.tint);
  return M0;
}
