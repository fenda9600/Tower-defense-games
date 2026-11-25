// The enemy host, rebuilt so that every unit is one that fought in a real Chinese war:
// foot soldiers, armoured men, horsemen, siege carts, war elephants, fire birds and gunpowder rockets.

function armyKit(o, cap) {
  // A soldier in the proportions of the garrison kit. o picks the cloth, the armour and the head.
  const k = {}, limb = cap * 2, tun = o.tunic, tunD = mulC(o.tunic, .72), arm = o.armor, armL = o.armor ? mulC(o.armor, 1.35) : null;
  const pants = o.pants, boot = o.boots || mulC(COL.black, 3.4), skin = o.skin || COL.skin, belt = o.belt || COL.leather, trim = o.trim || null, AL = o.metal ? L_METAL : L_PLAIN;
  k.pelvis = new PartBatch(S => {
    S.box(.31, .2, .21, 0, -.04, 0, tun, { l: L_CLOTH });
    if (o.long) { S.box(.33, .2, .22, 0, -.2, 0, tunD, { l: L_CLOTH }); if (trim) S.box(.335, .04, .225, 0, -.29, 0, trim, { l: L_CLOTH }); }
    S.box(.32, .05, .22, 0, .07, 0, belt, {}); S.box(.05, .05, .02, 0, .07, .115, COL.brass, { l: L_METAL, jit: 0 });
    if (arm) { for (const sg of [-1, 1]) { S.box(.14, .17, .04, sg * .08, -.05, .11, arm, { l: AL, rough: .55 }); for (const y of [-.01, -.08]) S.box(.145, .012, .045, sg * .08, y, .112, armL, { l: AL, jit: 0 }); } }
  }, cap, { rad: .13 });
  k.torso = new PartBatch(S => {
    S.box(.34, .4, .22, 0, .21, 0, tun, { l: L_CLOTH, jit: 0 });
    // the lapel crosses over to one side
    S.box(.05, .34, .012, .04, .24, .112, trim || tunD, { l: L_CLOTH, jit: 0, r: [0, 0, o.leftLapel ? -.5 : .5] });
    if (arm) {
      S.box(.3, .3, .235, 0, .2, 0, arm, { l: AL, rough: .55, jit: 0 });
      for (const y of [.1, .18, .26, .34]) S.box(.305, .016, .24, 0, y, 0, armL, { l: AL, rough: .45, jit: 0 });
      for (const sg of [-1, 1]) S.box(.035, .3, .012, sg * .09, .37, .07, belt, { r: [.3, 0, 0], jit: 0 });
    }
    if (trim) { S.box(.36, .05, .235, 0, .02, 0, trim, { l: L_CLOTH }); S.box(.4, .07, .24, 0, .41, 0, trim, { l: L_CLOTH }); }
    else S.box(.4, .07, .24, 0, .41, 0, tunD, { l: L_CLOTH });
    S.box(.14, .08, .14, 0, .45, 0, skin, {});
    if (o.cape) S.box(.38, .48, .03, 0, .2, -.13, o.cape, { l: L_CLOTH, r: [-.08, 0, 0] });
  }, cap, { rad: .17 });
  k.head = new PartBatch(S => {
    S.box(.19, .2, .19, 0, .12, 0, skin, { jit: .04 });
    const hair = o.hair || mulC(COL.black, 2.4);
    S.box(.2, .07, .2, 0, .225, -.005, hair, {}); S.box(.2, .14, .06, 0, .15, -.08, hair, {});
    for (const sg of [-1, 1]) S.box(.03, .03, .02, sg * .05, .14, .097, COL.black, { jit: 0 });
    S.box(.07, .02, .02, 0, .07, .097, mulC(skin, .7), { jit: 0 });
    if (o.beard) { S.box(.16, .07, .04, 0, .04, .085, hair, {}); S.box(.1, .03, .02, 0, .085, .1, hair, { jit: 0 }); }
    if (o.head === 'wrap') { S.box(.215, .06, .215, 0, .24, 0, o.wrap || mulC(COL.black, 3), { l: L_CLOTH }); S.cyl(.055, .09, 0, .3, -.01, o.wrap || mulC(COL.black, 3), { n: 6, l: L_CLOTH }); }
    else if (o.head === 'braid') { for (const sg of [-1, 1]) S.seg([sg * .1, .18, -.05], [sg * .11, -.02, -.06], .025, .02, hair, { n: 4 }); }
    else if (o.head === 'knot') { S.cyl(.045, .08, 0, .29, -.02, hair, { n: 6 }); S.seg([-.06, .3, -.02], [.06, .3, -.02], .008, .008, COL.woodL, { n: 3 }); }
  }, cap, { rad: .14 });
  k.uArm = new PartBatch(S => {
    S.box(.1, .26, .1, 0, -.13, 0, tun, { l: L_CLOTH });
    if (arm) { S.box(.14, .13, .14, 0, -.05, 0, arm, { l: AL, rough: .5 }); S.box(.145, .016, .145, 0, -.07, 0, armL, { l: AL, jit: 0 }); }
  }, limb, { rad: .07, shadow: false });
  k.lArm = new PartBatch(S => { S.box(.09, .24, .09, 0, -.12, 0, o.bracer || tunD, { l: L_CLOTH }); if (trim) S.box(.1, .04, .1, 0, -.22, 0, trim, { l: L_CLOTH }); S.box(.085, .08, .085, 0, -.27, 0, skin, {}); }, limb, { rad: .07, shadow: false });
  k.uLeg = new PartBatch(S => { S.box(.115, .28, .115, 0, -.14, 0, pants, { l: L_CLOTH }); S.box(.13, .12, .125, 0, -.05, 0, tun, { l: L_CLOTH }); }, limb, { rad: .08, shadow: false });
  k.lLeg = new PartBatch(S => {
    S.box(.1, .28, .1, 0, -.14, 0, o.wraps ? o.wraps : boot, { l: L_CLOTH }); if (o.wraps) for (const y of [-.06, -.13, -.2]) S.box(.105, .02, .105, 0, y, 0, mulC(o.wraps, .7), { jit: 0, r: [0, 0, .25] });
    S.box(.11, .06, .2, 0, -.29, .045, boot, {});
  }, limb, { rad: .08, shadow: false });
  return k;
}

SPEC.ride = Object.assign({}, SPEC.foot, { stride: 0, lean: 0 });
SPEC.crouch = Object.assign({}, SPEC.foot, { lean: .2, stoop: .22, stride: .62 });

function initArmy() {
  const I = KIT.item, N = { rad: .2, shadow: false };
  // a scaling ladder, foot at the origin and running up +Y: carried on the shoulder, then swung up against the wall
  I.ladder = new PartBatch(S => { const L = 4.3; for (const sg of [-1, 1]) S.box(.06, L, .06, sg * .24, L / 2, 0, COL.wood, { l: L_WOOD }); for (let y = .3; y < L; y += .36) S.box(.5, .045, .045, 0, y, 0, COL.woodL, { l: L_WOOD }); for (const sg of [-1, 1]) S.box(.07, .16, .1, sg * .24, L - .05, -.05, COL.iron, { l: L_METAL }); }, 24, { rad: 4.5 });
  const ink = C(0x23262e), indigo = C(0x283247), hide = C(0x6a4a30), fur = C(0x8c7556), furD = C(0x5a4632), felt = C(0x7a6a54);
  // Foot soldiers of the attacking host: dark tunics, leather armour, a black head cloth.
  KIT.foe = armyKit({ tunic: indigo, pants: C(0x3a3a36), armor: C(0x5a4030), belt: C(0x2a1d14), head: 'wrap', wraps: C(0x8a8068) }, 150);
  // Steppe riders and their lords: belted coats closed on the left, fur trim, braids.
  KIT.hu = armyKit({ tunic: hide, pants: C(0x4a3c30), trim: fur, long: true, leftLapel: true, head: 'braid', hair: C(0x1c1612), beard: true, boots: C(0x2a201a) }, 70);
  // Light men: bare arms of plain hemp, a topknot, wrapped shins.
  KIT.light = armyKit({ tunic: C(0x6a6250), pants: C(0x4c463a), head: 'knot', wraps: C(0x8a8068), belt: C(0x3a2a1c) }, 90);
  // Officers and the general: lacquered armour over a long coat.
  KIT.chief = armyKit({ tunic: C(0x2c2a3a), pants: C(0x2a2626), armor: C(0x3c4049), metal: true, long: true, trim: C(0x6a1c18), cape: C(0x5a1814), head: 'wrap', beard: true, belt: C(0x2a1d14) }, 16);
  for (const k of ['uArm', 'lArm', 'uLeg', 'lLeg']) KIT.chief[k].mesh.castShadow = true;

  const st = mulC(COL.steel, 1.05), wd = C(0x3a2618);
  I.dao = new PartBatch(S => { S.box(.035, .15, .035, 0, 0, 0, wd, {}); S.add(gTorus(6, .3, 3), { s: .036, p: [0, -.105, 0], r: [0, HPI, 0], c: COL.iron, l: L_METAL }); S.box(.08, .025, .05, 0, .085, 0, COL.iron, { l: L_METAL }); S.box(.018, .52, .058, 0, .36, 0, st, { l: L_METAL, rough: .35 }); S.box(.018, .08, .044, 0, .65, -.01, st, { l: L_METAL, rough: .35, r: [.3, 0, 0] }); }, 200, { rad: .05, shadow: false });
  I.saber = new PartBatch(S => { S.box(.035, .14, .035, 0, 0, 0, wd, {}); S.box(.1, .025, .05, 0, .08, 0, COL.brass, { l: L_METAL }); let p = [0, .09, 0]; for (let i = 1; i <= 4; i++) { const u = i / 4, q = [0, .09 + u * .5, -.12 * u * u]; S.seg(p, q, .026, .022, st, { n: 3, l: L_METAL }); p = q; } }, 90, { rad: .05, shadow: false });
  I.spear = new PartBatch(S => { S.seg([0, -.5, 0], [0, 1.05, 0], .02, .018, C(0x5a3e24), { l: L_WOOD, n: 4 }); S.cone(.04, .2, 0, 1.15, 0, st, { n: 4, l: L_METAL, rough: .35 }); S.ico(.035, 0, 1.0, 0, C(0x8a1a14), { d: 0, sc: [1, 1.4, 1] }); }, 120, { rad: .05, shadow: false });
  I.flagstaff = new PartBatch(S => {
    // a command flag: a triangular banner on a short pole, the signal for the companies to close up
    S.seg([0, -.4, 0], [0, 1.15, 0], .022, .02, C(0x2a1a14), { l: L_WOOD, n: 4 }); S.cone(.03, .1, 0, 1.2, 0, COL.brass, { n: 4, l: L_METAL });
    for (const [z0, z1, y0, y1, c] of [[0, .45, 1.1, .72, C(0x1c2438)], [0, .32, 1.08, .8, C(0xb0901c)]]) { S.tri([0, y0, z0 + .01], [0, y1, z0 + .01], [0, (y0 + y1) / 2, z1], c, L_CLOTH, .9); S.tri([0, y0, z0 + .01], [0, (y0 + y1) / 2, z1], [0, y1, z0 + .01], c, L_CLOTH, .9); }
  }, 12, N);
  I.tengpai = new PartBatch(S => {
    // a rattan shield: woven rings, raised at the centre
    const rt = C(0x9a7a46), rtD = C(0x6a5230);
    S.cyl(.34, .05, 0, 0, 0, rt, { n: 12, r: [HPI, 0, 0], l: L_THATCH }); for (const r of [.3, .22, .14]) S.add(gTorus(12, .12, 4), { s: r, p: [0, 0, .02], c: rtD, l: L_THATCH });
    S.add(gDome(8, 3), { s: [.1, .06, .1], p: [0, 0, .03], r: [HPI, 0, 0], c: rtD, l: L_THATCH }); S.box(.14, .1, .012, 0, .02, .07, C(0x8a1a14), { jit: 0 });
  }, 50, { rad: .3, shadow: false });
  I.mallet = new PartBatch(S => { S.seg([0, -.05, 0], [0, .32, 0], .018, .016, C(0x5a3e24), { l: L_WOOD, n: 4 }); S.ico(.045, 0, .34, 0, C(0x8a1a14), { d: 0 }); }, 8, N);
  I.furHat = new PartBatch(S => { S.cyl(.135, .1, 0, .25, 0, furD, { n: 8, l: L_CLOTH }); S.cyl(.12, .16, 0, .35, 0, felt, { n: 6, rt: .35, l: L_CLOTH }); S.ico(.03, 0, .45, 0, C(0x8a1a14), { d: 0 }); for (const sg of [-1, 1]) S.box(.05, .14, .1, sg * .115, .16, -.01, fur, { l: L_CLOTH }); }, 80, N);
  I.khanHat = new PartBatch(S => { const g = mulC(COL.gold, .85); S.cyl(.15, .12, 0, .26, 0, fur, { n: 8, l: L_CLOTH }); S.cyl(.13, .2, 0, .4, 0, C(0x5a1814), { n: 8, rt: .45, l: L_CLOTH }); S.cyl(.152, .03, 0, .32, 0, g, { n: 8, l: L_METAL, rough: .35, emis: .03 }); S.cone(.04, .12, 0, .55, 0, g, { n: 5, l: L_METAL }); for (const sg of [-1, 1]) S.box(.06, .16, .12, sg * .13, .16, -.01, fur, { l: L_CLOTH }); for (const sg of [-1, 1]) S.ico(.03, sg * .1, .02, .07, g, { d: 0, l: L_METAL }); }, 4, N);
  I.kasa = new PartBatch(S => { S.cone(.33, .13, 0, .3, 0, C(0x7a6640), { n: 10, l: L_THATCH }); S.cyl(.33, .012, 0, .235, 0, C(0x5a4a30), { n: 10, l: L_THATCH }); S.box(.22, .14, .03, 0, .03, .1, mulC(COL.black, 3), { l: L_CLOTH }); }, 30, N);
  I.band = new PartBatch(S => { const red = C(0xa8241c); S.box(.205, .04, .205, 0, .19, 0, red, { l: L_CLOTH }); S.box(.04, .18, .012, .05, .12, -.108, red, { l: L_CLOTH, r: [0, 0, .2] }); S.box(.04, .15, .012, -.03, .13, -.108, red, { l: L_CLOTH, r: [0, 0, -.15] }); }, 40, N);
  I.ironCap = new PartBatch(S => { S.add(gDome(8, 3), { s: [.15, .13, .15], p: [0, .21, 0], c: mulC(COL.iron, 1.2), l: L_METAL, rough: .5 }); S.cyl(.16, .03, 0, .21, 0, COL.ironL, { n: 8, l: L_METAL }); S.box(.22, .1, .04, 0, .12, -.1, mulC(COL.iron, 1.1), { l: L_METAL }); }, 60, N);
  I.banner = new PartBatch(S => {
    // the host's great standard on the drummer's back
    S.seg([0, .1, -.14], [0, 1.6, -.2], .022, .018, COL.woodD, { l: L_WOOD, n: 4 }); S.seg([-.2, 1.46, -.2], [.2, 1.46, -.2], .016, .016, COL.woodD, { l: L_WOOD, n: 4 });
    clothPanel(S, { x0: -.18, x1: .18, yTop: 1.45, len: .6, z: -.2, col: C(0x1c2438), col2: mulC(COL.gold, .6), rng: makeRng(21), sway: 0, nx: 3, ny: 5 });
    S.cone(.035, .14, 0, 1.68, -.2, COL.steel, { n: 4, l: L_METAL }); S.ico(.05, 0, 1.58, -.2, C(0x8a1a14), { d: 0, sc: [1, 1.5, 1] });
  }, 8, { rad: .3, shadow: false });


  // The garrison by era: Han lamellar and ring-pommel sword, Tang bright-light armour and the mo dao, Song infantry armour and the horse-cutting sword.
  const brz = mulC(COL.brass, 1.1), irn = mulC(COL.iron, 1.25), irL = COL.ironL, redT = C(0x8a1c16);
  // Qin: the terracotta army's lamellar vest with studded plates, a topknot on the right, and the bronze dagger-axe (ge).
  const lea = C(0x3a2a20), stud = mulC(COL.brass, .9), bz = C(0x8a6a3a);
  I.qinJia = new PartBatch(S => {
    S.box(.32, .3, .24, 0, .19, 0, lea, { l: L_CLOTH, rough: .7 }); for (const y of [.08, .16, .24]) for (const x of [-.11, -.04, .04, .11]) { S.box(.025, .025, .02, x, y, .125, stud, { l: L_METAL, jit: 0 }); S.box(.025, .025, .02, x, y, -.125, stud, { l: L_METAL, jit: 0 }); }
    for (const sg of [-1, 1]) S.box(.13, .1, .2, sg * .22, .4, 0, lea, { l: L_CLOTH }); S.box(.34, .04, .25, 0, .03, 0, C(0x8a1c16), { l: L_CLOTH });
  }, 40, { rad: .2, shadow: false });
  I.qinBun = new PartBatch(S => { const hair = mulC(COL.black, 2.2); S.box(.2, .05, .2, 0, .2, 0, hair, { l: L_CLOTH }); S.sph(.06, .07, .27, -.02, hair, { w: 6, h: 4, smooth: false }); S.box(.05, .02, .05, .07, .3, -.02, C(0xa8241c), { l: L_CLOTH }); }, 40, { rad: .2, shadow: false });
  I.ge = new PartBatch(S => { S.seg([0, -.5, 0], [0, 1.1, 0], .02, .018, C(0x4a3020), { l: L_WOOD, n: 4 }); S.box(.02, .05, .26, 0, 1.0, .12, bz, { l: L_METAL, rough: .35 }); S.box(.02, .1, .03, 0, .96, .24, bz, { l: L_METAL, rough: .35, r: [.5, 0, 0] }); S.cone(.03, .12, 0, 1.16, 0, bz, { n: 4, l: L_METAL }); }, 40, { rad: .05, shadow: false });
  I.mingguang = new PartBatch(S => {
    S.box(.33, .3, .245, 0, .2, 0, irn, { l: L_METAL, rough: .5 }); for (const y of [.1, .17, .24]) S.box(.335, .012, .25, 0, y, 0, irL, { l: L_METAL, jit: 0 });
    for (const sg of [-1, 1]) { S.cyl(.07, .02, sg * .085, .29, .13, brz, { n: 10, r: [HPI, 0, 0], l: L_METAL, rough: .25, emis: .04 }); S.cyl(.035, .022, sg * .085, .29, .136, mulC(brz, 1.3), { n: 8, r: [HPI, 0, 0], l: L_METAL, rough: .2, emis: .06 }); }
    S.cyl(.06, .02, 0, .1, .13, brz, { n: 10, r: [HPI, 0, 0], l: L_METAL, rough: .25 });
    for (const sg of [-1, 1]) { S.box(.17, .06, .23, sg * .23, .45, 0, irn, { l: L_METAL }); S.box(.15, .12, .21, sg * .26, .37, 0, mulC(irn, .9), { l: L_METAL }); S.box(.06, .06, .02, sg * .26, .42, .11, brz, { l: L_METAL }); }
    S.box(.36, .05, .25, 0, .03, 0, redT, { l: L_CLOTH });
  }, 40, { rad: .2, shadow: false });
  I.tangHelm = new PartBatch(S => {
    S.add(gDome(8, 3), { s: [.16, .15, .17], p: [0, .2, 0], c: irn, l: L_METAL, rough: .45 }); S.cyl(.17, .03, 0, .2, 0, brz, { n: 8, l: L_METAL });
    for (const sg of [-1, 1]) S.box(.04, .14, .2, sg * .17, .12, -.01, irn, { l: L_METAL, r: [0, 0, sg * -.25] }); S.box(.28, .12, .05, 0, .1, -.15, irn, { l: L_METAL, r: [.3, 0, 0] });
    S.box(.05, .06, .02, 0, .27, .16, brz, { l: L_METAL }); S.cyl(.016, .14, 0, .4, 0, brz, { n: 4, l: L_METAL }); S.ico(.05, 0, .48, -.01, redT, { d: 0, sc: [1, 1.4, 1] });
  }, 40, { rad: .2, shadow: false });
  I.buren = new PartBatch(S => {
    // Song infantry armour: lamellar from throat to knee, broad shoulder guards, a neck guard
    S.box(.38, .44, .27, 0, .22, 0, irn, { l: L_METAL, rough: .55 }); for (let y = .04; y < .44; y += .055) S.box(.385, .012, .275, 0, y, 0, irL, { l: L_METAL, jit: 0 });
    for (const x of [-.09, 0, .09]) S.box(.01, .42, .277, x, .22, 0, mulC(irn, .6), { jit: 0 });
    for (const sg of [-1, 1]) { S.box(.2, .07, .26, sg * .24, .46, 0, irn, { l: L_METAL }); for (const y of [.38, .31]) S.box(.18, .06, .24, sg * (.27 + (.38 - y)), y, 0, mulC(irn, .92), { l: L_METAL, r: [0, 0, sg * .35] }); }
    S.box(.24, .1, .24, 0, .48, 0, mulC(irn, .9), { l: L_METAL }); S.box(.4, .05, .28, 0, .02, 0, redT, { l: L_CLOTH });
  }, 40, { rad: .2, shadow: false });
  I.burenSkirt = new PartBatch(S => { for (const sg of [-1, 1]) { S.box(.18, .36, .06, sg * .09, -.17, .12, irn, { l: L_METAL, rough: .55 }); S.box(.18, .36, .06, sg * .09, -.17, -.12, irn, { l: L_METAL, rough: .55 }); for (let y = -.32; y < 0; y += .06) { S.box(.185, .012, .065, sg * .09, y, .12, irL, { l: L_METAL, jit: 0 }); S.box(.185, .012, .065, sg * .09, y, -.12, irL, { l: L_METAL, jit: 0 }); } } }, 40, { rad: .2, shadow: false });
  I.modao = new PartBatch(S => { const st2 = mulC(COL.steel, 1.15); S.seg([0, -.45, 0], [0, .55, 0], .024, .022, C(0x3a1512), { l: L_WOOD, n: 4 }); S.box(.1, .03, .05, 0, .56, 0, COL.brass, { l: L_METAL }); S.box(.02, .6, .08, 0, .88, 0, st2, { l: L_METAL, rough: .3 }); S.cone(.045, .12, 0, 1.24, 0, st2, { n: 4, l: L_METAL, rough: .3 }); }, 40, { rad: .05, shadow: false });
  I.zhanma = new PartBatch(S => { const st2 = mulC(COL.steel, 1.15); S.box(.04, .38, .04, 0, -.05, 0, C(0x3a1512), {}); S.box(.1, .03, .06, 0, .15, 0, COL.iron, { l: L_METAL }); let p = [0, .16, 0]; for (let i = 1; i <= 4; i++) { const u = i / 4, q = [0, .16 + u * .7, -.05 * u * u]; S.box(.02, .19, .075, 0, (p[1] + q[1]) / 2, (p[2] + q[2]) / 2, st2, { l: L_METAL, rough: .3 }); p = q; } }, 40, { rad: .05, shadow: false });
  I.xbow = new PartBatch(S => { const wd2 = C(0x5a3e24); S.box(.04, .05, .5, 0, 0, .05, wd2, { l: L_WOOD }); S.box(.05, .06, .06, 0, -.02, -.12, COL.brass, { l: L_METAL }); let p = [0, 0, .28]; for (const sg of [-1, 1]) { p = [0, 0, .28]; for (let i = 1; i <= 3; i++) { const u = i / 3, q = [sg * u * .3, 0, .28 - u * u * .08]; S.seg(p, q, .02, .016, wd2, { n: 4, l: L_WOOD }); p = q; } S.seg([sg * .3, 0, .2], [0, .02, .02], .005, .005, COL.bone, { n: 3 }); } }, 40, { rad: .1, shadow: false });

  // Horses. The plain one carries light riders; the barded one carries the armoured lancers.
  const coat = C(0x5a3a24), coatD = C(0x3a2618), mane = C(0x1a1410), hoof = C(0x1c1814);
  const horseBody = (S, bard) => {
    S.ico(.26, 0, .78, -.02, coat, { sc: [.82, .9, 1.9], d: 1 }); S.ico(.22, 0, .8, .3, coat, { sc: [.85, .95, .9], d: 1 }); S.ico(.2, 0, .8, -.32, coat, { sc: [.9, .95, .9], d: 1 });
    S.seg([0, .88, .38], [0, 1.22, .62], .14, .09, coat, { n: 6 }); S.box(.05, .26, .26, 0, 1.12, .5, mane, { r: [-.9, 0, 0] });
    S.box(.13, .14, .34, 0, 1.24, .76, coat, { r: [.55, 0, 0] }); S.box(.11, .1, .14, 0, 1.13, .92, coatD, { r: [.55, 0, 0] });
    for (const sg of [-1, 1]) { S.cone(.03, .09, sg * .045, 1.36, .66, coat, { n: 4 }); S.box(.02, .02, .02, sg * .066, 1.26, .8, COL.black, { jit: 0 }); }
    // saddle, cloth and bridle
    S.box(.36, .06, .36, 0, 1.03, -.02, C(0x6a1c18), { l: L_CLOTH }); S.box(.3, .08, .3, 0, 1.08, -.02, C(0x3a2416), {}); S.box(.26, .1, .04, 0, 1.13, .14, C(0x3a2416), {}); S.box(.26, .1, .04, 0, 1.13, -.18, C(0x3a2416), {});
    S.seg([.07, 1.15, .9], [.0, 1.13, .2], .008, .008, C(0x2a1a10), { n: 3 }); S.seg([-.07, 1.15, .9], [.0, 1.13, .2], .008, .008, C(0x2a1a10), { n: 3 });
    if (bard) {
      // lamellar barding over the neck, chest and flanks, a face plate and a red crest
      const ir = mulC(COL.iron, 1.2), irL = COL.ironL;
      for (const sg of [-1, 1]) { S.box(.03, .36, .86, sg * .26, .72, -.04, ir, { l: L_METAL, rough: .55 }); for (const y of [.6, .7, .8]) S.box(.035, .014, .87, sg * .262, y, -.04, irL, { l: L_METAL, jit: 0 }); }
      S.box(.46, .34, .06, 0, .78, .5, ir, { l: L_METAL, rough: .55 }); for (const y of [.68, .78, .88]) S.box(.47, .014, .065, 0, y, .502, irL, { l: L_METAL, jit: 0 });
      S.seg([0, .92, .42], [0, 1.24, .64], .17, .12, ir, { n: 6, l: L_METAL, rough: .55 }); S.box(.15, .1, .3, 0, 1.28, .78, ir, { l: L_METAL, r: [.55, 0, 0] });
      S.box(.44, .3, .3, 0, .82, -.52, ir, { l: L_METAL, rough: .55 }); S.ico(.05, 0, 1.42, .6, C(0x8a1a14), { d: 0, sc: [1, 1.4, 1] });
    }
  };
  const horseLeg = (S, bard) => { S.seg([0, 0, 0], [0, -.3, .02], .07, .045, coat, { n: 5 }); S.seg([0, -.3, .02], [0, -.56, -.01], .035, .03, coatD, { n: 5 }); S.box(.07, .06, .08, 0, -.6, .0, hoof, {}); if (bard) S.box(.12, .16, .12, 0, -.08, 0, mulC(COL.iron, 1.2), { l: L_METAL }); };
  KIT.horse = {
    body: new PartBatch(S => horseBody(S, false), 60, { rad: .4 }),
    leg: new PartBatch(S => horseLeg(S, false), 240, { rad: .07, shadow: false }),
    tail: new PartBatch(S => { S.seg([0, 0, 0], [0, -.4, -.12], .05, .03, mane, { n: 4 }); }, 60, { rad: .05, shadow: false }),
  };
  KIT.horseA = {
    body: new PartBatch(S => horseBody(S, true), 14, { rad: .45 }),
    leg: new PartBatch(S => horseLeg(S, true), 56, { rad: .07, shadow: false }),
    tail: new PartBatch(S => { S.seg([0, 0, 0], [0, -.4, -.12], .05, .03, mane, { n: 4 }); }, 14, { rad: .05, shadow: false }),
  };
  for (const k of ['leg']) KIT.horseA[k].mesh.castShadow = true;

  // War elephants: a grey hide, a carpet and a wooden fighting box.
  const eh = C(0x6a6a6c), ehD = C(0x4a4a4e), tusk = C(0xdcd2b8);
  const eleBody = (S, howdah) => {
    S.ico(.5, 0, 1.15, -.05, eh, { sc: [.85, .8, 1.15], d: 1 }); S.ico(.32, 0, 1.4, .55, eh, { sc: [.9, 1, .85], d: 1 });
    for (const sg of [-1, 1]) { S.box(.04, .42, .36, sg * .3, 1.38, .45, ehD, { r: [0, sg * .5, sg * -.15] }); S.cone(.045, .4, sg * .14, 1.0, .9, tusk, { n: 5, r: [-1.9, 0, 0] }); S.box(.03, .03, .02, sg * .2, 1.48, .78, COL.black, { jit: 0 }); }
    S.box(.82, .06, .9, 0, 1.6, -.08, C(0x8a1a14), { l: L_CLOTH }); for (const sg of [-1, 1]) S.box(.04, .42, .9, sg * .42, 1.4, -.08, C(0x8a1a14), { l: L_CLOTH }); for (const sg of [-1, 1]) S.box(.045, .06, .9, sg * .422, 1.2, -.08, mulC(COL.gold, .7), { l: L_CLOTH, jit: 0 });
    if (howdah) {
      S.box(.62, .06, .62, 0, 1.68, -.1, COL.woodD, { l: L_WOOD }); for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) S.box(.05, .5, .05, x * .28, 1.92, -.1 + z * .28, COL.wood, { l: L_WOOD });
      for (const sg of [-1, 1]) { S.box(.6, .26, .03, 0, 1.82, -.1 + sg * .29, COL.wood, { l: L_WOOD }); S.box(.03, .26, .6, sg * .29, 1.82, -.1, COL.wood, { l: L_WOOD }); }
      cnRoof(S, { y: 2.16, z: -.1, a: .42, h: .3, lift: .08, n: 2, m: 4 });
    }
  };
  const eleLeg = S => { S.cyl(.14, .56, 0, -.28, 0, eh, { n: 7, rt: .9 }); S.cyl(.13, .5, 0, -.8, 0, ehD, { n: 7, rt: 1.05 }); S.cyl(.15, .06, 0, -1.04, .01, tusk, { n: 7 }); };
  KIT.ele = {
    body: new PartBatch(S => eleBody(S, true), 12, { rad: .6 }),
    leg: new PartBatch(eleLeg, 48, { rad: .14 }),
    trunk: new PartBatch(S => { S.seg([0, 0, 0], [0, -.3, .1], .1, .08, eh, { n: 6 }); S.seg([0, -.3, .1], [0, -.6, .08], .08, .05, ehD, { n: 6 }); }, 24, { rad: .1, shadow: false }),
    tail: new PartBatch(S => { S.seg([0, 0, 0], [0, -.5, -.08], .03, .02, ehD, { n: 4 }); S.ico(.05, 0, -.52, -.08, mane, { d: 0 }); }, 12, { rad: .05, shadow: false }),
  };

  // Siege carts on solid wheels: the ram, the hide-roofed tortoise and the tall assault tower.
  const tim = COL.wood, timD = COL.woodD, hideC = C(0x6a5034), hideD = C(0x4a3824);
  KIT.wheel = new PartBatch(S => { S.cyl(.3, .1, 0, 0, 0, timD, { n: 10, r: [0, 0, HPI], l: L_WOOD }); S.cyl(.31, .06, 0, 0, 0, COL.iron, { n: 10, r: [0, 0, HPI], l: L_METAL }); S.cyl(.08, .14, 0, 0, 0, COL.iron, { n: 6, r: [0, 0, HPI], l: L_METAL }); for (const a of [0, PI / 3, 2 * PI / 3]) S.box(.11, .54, .05, 0, 0, 0, tim, { l: L_WOOD, r: [a, 0, 0] }); }, 120, { rad: .2 });
  const frame = (S, w, l, y) => { for (const sg of [-1, 1]) S.box(.1, .1, l, sg * w / 2, y, 0, timD, { l: L_WOOD }); for (const z of [-l / 2 + .05, 0, l / 2 - .05]) S.box(w, .08, .1, 0, y, z, timD, { l: L_WOOD }); S.box(w - .1, .04, l - .1, 0, y + .04, 0, tim, { l: L_WOOD }); };
  KIT.ram = new PartBatch(S => {
    frame(S, .8, 1.5, .3);
    for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) S.box(.08, .9, .08, x * .38, .78, z * .65, tim, { l: L_WOOD });
    for (const sg of [-1, 1]) { const T = [[sg * .46, 1.18, -.78], [sg * .46, 1.18, .78], [0, 1.6, .78], [0, 1.6, -.78]]; S.tri(T[0], T[1], T[2], hideC, L_PLAIN, .9); S.tri(T[0], T[2], T[3], hideC, L_PLAIN, .9); S.tri(T[0], T[2], T[1], hideD, L_PLAIN, .9); S.tri(T[0], T[3], T[2], hideD, L_PLAIN, .9); }
    S.box(.06, .06, 1.6, 0, 1.58, 0, timD, { l: L_WOOD });
    for (const z of [-.4, .4]) { S.seg([-.1, 1.5, z], [0, .9, z], .015, .015, COL.rope, { n: 3 }); S.seg([.1, 1.5, z], [0, .9, z], .015, .015, COL.rope, { n: 3 }); }
    S.seg([0, .88, -.9], [0, .88, 1.05], .11, .11, C(0x5a4028), { n: 8, l: L_WOOD }); S.cone(.15, .3, 0, .88, 1.2, COL.iron, { n: 6, r: [HPI, 0, 0], l: L_METAL });
  }, 20, { rad: .4 });
  KIT.tortoise = new PartBatch(S => {
    frame(S, .9, 1.4, .3);
    S.add(gDome(10, 4), { s: [.6, .72, .82], p: [0, .38, 0], c: hideC, l: L_PLAIN });
    for (const z of [-.5, -.17, .17, .5]) S.add(gTorus(10, .05, 3), { s: [.6 * Math.cos(z * .9), .6 * Math.cos(z * .9), .6], p: [0, .38, z], r: [0, 0, 0], c: hideD, l: L_PLAIN });
    S.box(.5, .4, .06, 0, .55, .72, timD, { l: L_WOOD }); S.box(.2, .2, .07, 0, .6, .73, COL.black, { jit: 0 });
    for (const sg of [-1, 1]) for (const z of [-.3, .3]) S.cone(.04, .15, sg * .5, .55, z, COL.iron, { n: 4, r: [0, 0, -sg * HPI], l: L_METAL });
  }, 24, { rad: .4 });
  KIT.tower = new PartBatch(S => {
    // a lou che: three storeys of timber hung with wet hides, archers' loops and a drop bridge
    frame(S, 1.2, 1.4, .3);
    const H = 2.9;
    for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) S.seg([x * .58, .3, z * .66], [x * .42, H, z * .5], .06, .05, timD, { l: L_WOOD, n: 4 });
    for (const [y, w, d] of [[1.0, 1.1, 1.26], [1.9, .98, 1.12], [2.8, .9, 1.04]]) { S.box(w, .08, d, 0, y, 0, tim, { l: L_WOOD }); for (const sg of [-1, 1]) { S.box(w, .5, .03, 0, y - .3, sg * d / 2, hideC, { l: L_PLAIN }); S.box(.03, .5, d, sg * w / 2, y - .3, 0, hideD, { l: L_PLAIN }); } for (const x of [-.25, .25]) S.box(.1, .12, .04, x, y - .25, d / 2 + .01, COL.black, { jit: 0 }); }
    S.box(.86, .08, 1.0, 0, H + .05, 0, timD, { l: L_WOOD }); for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) S.box(.06, .4, .06, x * .4, H + .25, z * .47, timD, { l: L_WOOD });
    S.box(.7, .06, .8, 0, H + .2, .9, tim, { l: L_WOOD, r: [-1.25, 0, 0] });
    cnBanner(S, .38, H + .1, H + 1.4, -.45, C(0x1c2438), makeRng(41), { w: .3, len: .7 });
  }, 3, { rad: .6 });
  KIT.tower.mesh.castShadow = true;

  // Fire birds: a pheasant carrying a lit nutshell of moxa into the enemy camp.
  const fea = C(0x6a4a30), feaD = C(0x3a2a1c);
  KIT.bird = {
    body: new PartBatch(S => { S.ico(.1, 0, 0, 0, fea, { sc: [.85, .8, 1.4], d: 1 }); S.ico(.07, 0, .05, .14, C(0x2a4a3a), { d: 1 }); S.cone(.02, .06, 0, .04, .22, C(0xc8a040), { n: 4, r: [HPI, 0, 0] }); S.box(.02, .02, .02, .035, .07, .17, C(0xb02a1c), { jit: 0 }); S.box(.06, .02, .26, 0, .0, -.22, feaD, { r: [.2, 0, 0] }); S.box(.05, .02, .2, .03, .0, -.2, fea, { r: [.2, .2, 0] }); S.seg([0, -.06, 0], [0, -.16, .02], .006, .006, COL.rope, { n: 3 }); S.ico(.04, 0, -.18, .02, C(0x5a4028), { d: 0 }); }, 50, { rad: .1 }),
    wing: new PartBatch(S => { const c = fea, c2 = feaD, pts = [[0, 0, .08], [.18, .02, .07], [.36, .0, .0], [.3, 0, -.06], [.2, 0, -.07], [.1, 0, -.09], [0, 0, -.06]]; for (let i = 1; i < pts.length - 1; i++) { S.tri(pts[0], pts[i + 1], pts[i], i & 1 ? c : c2, L_PLAIN, .9); S.tri(pts[0], pts[i], pts[i + 1], i & 1 ? c : c2, L_PLAIN, .9); } }, 100, { rad: .1 }),
  };
  // Bamboo fire kite (zhu huo yao) of the Song manual: a bamboo cage bird pasted with paper, its belly full of powder and a straw tail alight.
  const bam = C(0x9a8a52), bamD = C(0x6a5a32), straw = C(0xb09a58), paper = C(0xc8bc98);
  KIT.crow = {
    body: new PartBatch(S => { S.ico(.1, 0, 0, 0, paper, { sc: [.9, .8, 1.5], d: 1 }); for (const z of [-.08, 0, .08]) S.add(gTorus(8, .08, 3), { s: [.09, .08, .1], p: [0, 0, z], r: [0, 0, 0], c: bamD, l: L_WOOD }); S.ico(.06, 0, .03, .15, paper, { d: 1 }); S.cone(.025, .07, 0, .02, .22, bamD, { n: 4, r: [HPI, 0, 0] }); for (let k = -1; k <= 1; k++) S.seg([0, 0, -.12], [k * .06, -.02, -.34], .016, .008, straw, { n: 3 }); }, 60, { rad: .1 }),
    wing: new PartBatch(S => { const pts = [[0, 0, .06], [.2, 0, .04], [.3, 0, -.04], [.16, 0, -.08], [0, 0, -.06]]; for (let i = 1; i < pts.length - 1; i++) { S.tri(pts[0], pts[i + 1], pts[i], paper, L_PLAIN, .9); S.tri(pts[0], pts[i], pts[i + 1], paper, L_PLAIN, .9); } S.seg([0, .005, .04], [.3, .005, -.04], .006, .006, bam, { n: 3 }); S.seg([0, .005, -.02], [.24, .005, -.06], .005, .005, bam, { n: 3 }); }, 120, { rad: .1 }),
  };
  // Iron-beaked fire kite (tie zui huo yao) of the Song manual: a wooden bird with an iron beak, powder packed in a straw tail.
  const wdB = C(0x6a4a2c), wdBD = C(0x4a3220);
  KIT.dragon = {
    body: new PartBatch(S => {
      S.ico(.14, 0, 0, 0, wdB, { sc: [.95, .85, 2.2], d: 1 }); S.ico(.1, 0, .04, .3, wdB, { d: 1 }); for (const z of [-.15, .05]) S.add(gTorus(8, .06, 3), { s: [.135, .12, .1], p: [0, 0, z], c: COL.iron, l: L_METAL });
      S.cone(.06, .22, 0, .02, .48, mulC(COL.iron, 1.3), { n: 5, r: [HPI, 0, 0], l: L_METAL, rough: .35 }); for (const sg of [-1, 1]) S.box(.025, .025, .02, sg * .06, .08, .38, C(0xffd040), { emis: .3, jit: 0 });
      for (let k = -2; k <= 2; k++) S.seg([0, 0, -.25], [k * .07, -.03 + Math.abs(k) * .01, -.62], .03, .014, straw, { n: 3 });
    }, 24, { rad: .2 }),
    wing: new PartBatch(S => { S.tri([0, 0, .14], [.3, 0, -.02], [0, 0, -.14], wdBD, L_PLAIN, .9); S.tri([0, 0, .14], [0, 0, -.14], [.3, 0, -.02], wdBD, L_PLAIN, .9); S.seg([0, .01, .1], [.3, .01, -.02], .01, .008, wdB, { n: 3 }); }, 48, { rad: .1 }),
  };
}

function rigRider(m, M0, kit, sy, sz) {
  // A rider sits in the saddle at (0, sy, sz) of the mount; he swings when his mount fights.
  const r = m.rider || (m.rider = { ph: 0, mv: 0, ride: true });
  _rv.set(0, sy, sz).applyMatrix4(M0);
  const s = m.scale; r.scale = s; r.x = _rv.x; r.y = _rv.y - SPEC.ride.hip * s; r.z = _rv.z; r.yaw = m.yaw; r.flash = m.flash; r.flinch = m.flinch * .5; r.atk = m.atk; r.tint = m.tint;
  r.weapon = m.weapon; r.wScale = m.wScale || 1; r.shield = null; r.helm = m.helm; r.plate = m.plate; r.hat = m.hat; r.spearUp = m.spearUp;
  return rigHuman(kit, SPEC.ride, r);
}
function rigHorse(m) {
  const armored = m.def.bard, K = armored ? KIT.horseA : KIT.horse, ph = m.ph, s = m.scale || 1, fl = m.flash || 0, mv = m.mv, g = Math.sin(ph * 2), tint = m.horseTint || null;
  const M0 = xf(_M[14], null, m.x, m.y + Math.abs(g) * .07 * mv * s, m.z, g * .05 * mv - (m.flinch || 0) * .2, m.yaw, 0, s, s, s);
  K.body.put(M0, fl, tint);
  for (let i = 0; i < 4; i++) { const fr = i < 2, sd = (i & 1) ? -1 : 1, a = Math.sin(ph * 2 + (fr ? 0 : 2.4) + (sd > 0 ? 0 : .6)) * .7 * mv; K.leg.put(xf(_M[15 + i], M0, sd * .13, .64, fr ? .32 : -.36, a, 0, 0), fl, tint); }
  K.tail.put(xf(_M[19], M0, 0, .86, -.55, -.4 + g * .15 * mv, Math.sin(ph + 1) * .2, 0), fl, tint);
  return rigRider(m, M0, m.riderKit, 1.05, -.02);
}
function rigElephant(m) {
  const K = KIT.ele, ph = m.ph, s = m.scale || 1, fl = m.flash || 0, mv = m.mv, g = Math.sin(ph);
  const M0 = xf(_M[14], null, m.x, m.y + Math.abs(g) * .04 * mv * s, m.z, -(m.flinch || 0) * .12, m.yaw, g * .03 * mv, s, s, s);
  K.body.put(M0, fl, m.tint);
  for (let i = 0; i < 4; i++) { const fr = i < 2, sd = (i & 1) ? -1 : 1, a = Math.sin(ph + (fr === (sd > 0) ? 0 : PI)) * .35 * mv; K.leg.put(xf(_M[15 + i], M0, sd * .24, 1.06, fr ? .32 : -.42, a, 0, 0), fl, m.tint); }
  const T1 = xf(_M[19], M0, 0, 1.36, .8, .25 + Math.sin(G.t * 1.7 + m.lseed) * .15 + (m.atk >= 0 ? -1.2 * Math.sin(m.atk * PI) : 0), 0, 0); K.trunk.put(T1, fl, m.tint);
  K.tail.put(xf(_M[20], M0, 0, 1.2, -.62, -.3 + Math.sin(G.t * 2 + m.lseed) * .2, 0, 0), fl, m.tint);
  RIGOUT.torch.set(0, .8, -.75).applyMatrix4(M0);
  return M0;
}
function rigCart(m) {
  const K = m.def.cart === 'ram' ? KIT.ram : m.def.cart === 'tower' ? KIT.tower : KIT.tortoise, s = m.scale || 1, fl = m.flash || 0, ph = m.ph;
  const rock = Math.sin(ph * 1.3) * .02 * m.mv;
  const M0 = xf(_M[14], null, m.x, m.y + .02, m.z, -(m.flinch || 0) * .08, m.yaw, rock, s, s, s);
  K.put(M0, fl, m.tint);
  const wz = m.def.cart === 'tower' ? [-.5, .5] : [-.5, .5], wx = m.def.cart === 'tower' ? .66 : .52;
  let i = 0; for (const sg of [-1, 1]) for (const z of wz) KIT.wheel.put(xf(_M[15 + i++], M0, sg * wx, .3, z, ph * 1.6, 0, 0), fl, m.tint);
  return M0;
}
function rigFlyer(m) {
  const k = m.def.flyKit, K = KIT[k];
  if (k === 'bird') return rigBat(m, K, .06, .03);
  // the fire kites glide: their wings only tremble
  const save = m.ph; m.ph = Math.sin(save * 4) * .08 - .9; const M = rigBat(m, K, k === 'dragon' ? .08 : .05, 0); m.ph = save; return M;
}
function rocketTrail(m, k) {
  // exhaust from the rocket tubes, pointing back along the flight
  const d = Math.hypot(m.vx, m.vz) || 1, bx = -m.vx / d, bz = -m.vz / d, r = k === 'dragon' ? .7 : .35, s = m.scale;
  const x = m.x + bx * r * s, z = m.z + bz * r * s, y = m.y - .05 * s;
  FX.add.push(x, y, z, .45 * s, .45 * s, 0, 0, 3.2, 1.6, .4, .9, 0, 0, 0, 0); FX.add.push(x, y, z, 1.3 * s, 1.3 * s, 0, 0, 1, .45, .12, .3, 2, 0, 0, 0);
  if (rnd() < .7) fxSmoke(x, y, z, bx * rr(.5, 1.2), rr(.1, .4), bz * rr(.5, 1.2), rr(.6, 1.1), .1 * s + .05, .25, .26, .25, .24, .4, { drag: 1.5, rise: .2 });
  if (rnd() < .6) fxPart(x, y, z, bx * rr(.6, 1.6) + rr(-.3, .3), rr(-.2, .4), bz * rr(.6, 1.6) + rr(-.3, .3), rr(.2, .45), .045, 2.8, 1.2, .25, { drag: 1.2 });
}
