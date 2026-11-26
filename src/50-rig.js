
let RIG_CAPTURE = null;
class PartBatch {
  constructor(build, cap, o = {}) {
    const S = new Soup(); build(S); const geo = S.build();
    this.cap = cap; this.n = 0;
    const m = this.mesh = new THREE.InstancedMesh(geo, MAT.inst, cap);
    m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    m.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(cap * 3), 3); m.instanceColor.setUsage(THREE.DynamicDrawUsage);
    this.flash = new THREE.InstancedBufferAttribute(new Float32Array(cap), 1); this.flash.setUsage(THREE.DynamicDrawUsage); geo.setAttribute('aFlash', this.flash);
    m.frustumCulled = false; m.castShadow = o.shadow !== false; m.receiveShadow = true; m.count = 0;
    this.rad = o.rad || .1;
    R.scene.add(m); PartBatch.all.push(this);
  }
  put(mat, flash = 0, tint = null) {
    if (RIG_CAPTURE) { RIG_CAPTURE(this, mat, tint); return; }
    if (this.n >= this.cap) return; const i = this.n++;
    mat.toArray(this.mesh.instanceMatrix.array, i * 16);
    const c = this.mesh.instanceColor.array;
    if (tint) { c[i * 3] = tint[0]; c[i * 3 + 1] = tint[1]; c[i * 3 + 2] = tint[2]; } else { c[i * 3] = c[i * 3 + 1] = c[i * 3 + 2] = 1; }
    this.flash.array[i] = flash;
  }
  end() {
    const m = this.mesh; m.count = this.n; m.visible = this.n > 0;
    if (this.n) {
      for (const a of [m.instanceMatrix, m.instanceColor, this.flash]) { a.clearUpdateRanges(); a.addUpdateRange(0, this.n * a.itemSize); a.needsUpdate = true; }
    }
  }
}
PartBatch.all = [];
function beginParts() { for (const b of PartBatch.all) b.n = 0; }
function endParts() { for (const b of PartBatch.all) b.end(); }

const _rq = new THREE.Quaternion(), _re = new THREE.Euler(), _rv = new THREE.Vector3(), _rs = new THREE.Vector3(), _rm = new THREE.Matrix4();
const _M = []; for (let i = 0; i < 28; i++) _M.push(new THREE.Matrix4());
function xf(out, parent, px, py, pz, rx, ry, rz, sx = 1, sy = 1, sz = 1) {
  _rq.setFromEuler(_re.set(rx, ry, rz, 'XYZ')); _rm.compose(_rv.set(px, py, pz), _rq, _rs.set(sx, sy, sz));
  if (parent) out.multiplyMatrices(parent, _rm); else out.copy(_rm); return out;
}

const KIT = {};
function humanKit(style, cap) {
  const k = {}, limb = cap * 2;
  if (style === 'skel' || style === 'giant') {
    const G = style === 'giant', bone = G ? mulC(COL.bone, .82) : COL.bone, bd = G ? mulC(COL.boneD, .8) : COL.boneD, o = () => ({ l: L_BONE, jit: .05 });
    const rag = C(0x27303c), ragD = C(0x161b24), rustI = mixC(COL.iron, C(0x6a4028), .5);
    k.pelvis = new PartBatch(S => { S.box(.27, .1, .15, 0, 0, 0, bd, o()); S.box(.08, .13, .08, 0, .09, -.01, bone, o()); if (!G) { clothPanel(S, { x0: -.14, x1: .14, yTop: -.01, len: .36, z: .085, col: rag, rng: makeRng(7), sway: 0, nx: 3, ny: 5, rag: .55 }); clothPanel(S, { x0: -.14, x1: .14, yTop: -.01, len: .3, z: -.085, col: ragD, rng: makeRng(8), sway: 0, nx: 3, ny: 4, rag: .55 }); S.box(.3, .045, .18, 0, .03, 0, rustI, { l: L_METAL, rough: .7 }); for (const sg of [-1, 1]) S.box(.03, .2, .15, sg * .15, -.1, 0, rustI, { l: L_METAL, rough: .7 }); } if (G) { for (const s of [-1, 1]) S.box(.1, .16, .17, s * .14, -.02, 0, bone, o()); clothPanel(S, { x0: -.13, x1: .13, yTop: -.03, len: .3, z: .09, col: mulC(COL.clothD, 1.4), rng: makeRng(5), sway: 0, nx: 3, ny: 4 }); } }, cap, { rad: .1 });
    k.torso = new PartBatch(S => {
      S.box(.07, .43, .07, 0, .21, -.03, bd, o());
      const ribs = G ? [.1, .16, .22, .28, .34] : [.15, .24, .33];
      for (const y of ribs) { S.box(.31 - (.34 - y) * .25, G ? .04 : .055, .21, 0, y, .01, bone, o()); }
      S.box(.39, .07, .12, 0, .43, 0, bone, o()); S.box(.06, .25, .03, 0, .25, .11, bone, o());
      if (!G) { S.box(.06, .52, .02, 0, .25, .125, rag, { l: L_CLOTH, r: [0, 0, .62] }); S.box(.06, .5, .02, 0, .25, -.1, ragD, { l: L_CLOTH, r: [0, 0, -.62] }); S.box(.15, .05, .17, .2, .47, 0, rustI, { l: L_METAL, rough: .7 }); S.box(.14, .09, .16, .23, .41, 0, mulC(rustI, .8), { l: L_METAL, rough: .7 }); }
      if (G) { for (const s of [-1, 1]) { S.cone(.05, .16, s * .2, .52, 0, bone, { n: 4, l: L_BONE }); S.cone(.04, .12, s * .13, .5, -.04, bd, { n: 4, l: L_BONE }); } for (let v = 0; v < 4; v++) S.box(.05, .03, .06, 0, .1 + v * .09, -.08, bone, o()); }
    }, cap, { rad: .16 });
    k.head = new PartBatch(S => {
      S.sph(.15, 0, .17, 0, bone, { sc: [1, .95, 1.08], l: L_BONE, w: 7, h: 5, smooth: false }); S.box(.17, .08, .14, 0, .04, .035, bd, o());
      for (const s of [-1, 1]) S.box(.066, .062, .05, s * .058, .185, .132, COL.black, { jit: 0 });
      S.box(.03, .04, .04, 0, .12, .152, COL.black, { jit: 0 });
      if (G) { for (let t = -2; t <= 2; t++) S.box(.022, .04, .02, t * .032, .005, .1, bone, { jit: 0 }); }
      else { S.cyl(.158, .035, 0, .245, 0, C(0x5a1a16), { n: 8, l: L_CLOTH }); S.sph(.048, 0, .315, -.035, mulC(COL.black, 2.5), { w: 6, h: 4, smooth: false }); S.seg([-.09, .32, -.035], [.09, .31, -.035], .01, .01, COL.boneD, { n: 3 }); S.box(.03, .16, .02, .1, .14, -.14, C(0x5a1a16), { l: L_CLOTH, r: [.2, 0, .15] }); }
    }, cap, { rad: .15 });
    k.uArm = new PartBatch(S => { S.box(.062, .25, .062, 0, -.125, 0, bone, o()); S.box(.085, .06, .085, 0, -.26, 0, bd, o()); }, limb, { rad: .06, shadow: false });
    k.lArm = new PartBatch(S => { S.box(.052, .25, .052, 0, -.125, 0, bone, o()); S.box(.08, .08, .08, 0, -.28, 0, bd, o()); }, limb, { rad: .06, shadow: false });
    k.uLeg = new PartBatch(S => { S.box(.076, .27, .076, 0, -.135, 0, bone, o()); S.box(.09, .06, .09, 0, -.28, 0, bd, o()); }, limb, { rad: .07, shadow: false });
    k.lLeg = new PartBatch(S => { S.box(.062, .28, .062, 0, -.14, 0, bone, o()); S.box(.09, .05, .19, 0, -.295, .05, bd, o()); }, limb, { rad: .07, shadow: false });
  } else if (style === 'foot') {
    // Border garrison: red tunic, dark lamellar, a bronze helmet with a red tassel.
    const lam = mulC(COL.iron, 1.2), lamL = mulC(COL.ironL, 1.05), cloth = mulC(COL.clothR, 1.45), clothDk = mulC(COL.clothR, .9), lea = COL.leather, brz = mulC(COL.brass, .95);
    k.pelvis = new PartBatch(S => { S.box(.3, .16, .2, 0, -.01, 0, cloth, { l: L_CLOTH }); S.box(.31, .05, .21, 0, .07, 0, lea, {}); S.box(.1, .12, .215, 0, -.03, 0, lam, { l: L_METAL, rough: .55 }); }, cap, { rad: .12 });
    k.torso = new PartBatch(S => {
      S.box(.34, .4, .22, 0, .21, 0, cloth, { l: L_CLOTH, jit: 0 }); S.box(.3, .3, .235, 0, .2, 0, lam, { l: L_METAL, rough: .55, jit: 0 });
      for (const y of [.1, .18, .26, .34]) S.box(.305, .018, .24, 0, y, 0, lamL, { l: L_METAL, rough: .45, jit: 0 });
      S.box(.42, .08, .25, 0, .4, 0, clothDk, { l: L_CLOTH }); S.box(.16, .08, .16, 0, .45, 0, COL.skin, {});
    }, cap, { rad: .17 });
    k.head = new PartBatch(S => {
      S.box(.19, .2, .19, 0, .12, .0, COL.skin, { jit: .04 }); S.box(.21, .13, .1, 0, .08, -.07, lam, { l: L_METAL, rough: .55 });
      for (const s of [-1, 1]) S.box(.03, .12, .13, s * .1, .09, -.01, lam, { l: L_METAL, rough: .55 });
      S.add(gDome(8, 3), { s: [.155, .14, .155], p: [0, .19, 0], c: brz, l: L_METAL, rough: .4 }); S.cyl(.19, .03, 0, .19, 0, mulC(brz, .8), { n: 8, l: L_METAL, rough: .42 });
      S.cyl(.02, .07, 0, .35, 0, brz, { n: 5, l: L_METAL }); S.ico(.055, 0, .41, -.01, COL.lacqL, { d: 0, sc: [1, 1.2, 1.3], emis: .03 });
      for (const s of [-1, 1]) S.box(.03, .03, .02, s * .05, .14, .098, COL.black, { jit: 0 });
    }, cap, { rad: .14 });
    k.uArm = new PartBatch(S => { S.box(.1, .26, .1, 0, -.13, 0, cloth, { l: L_CLOTH }); S.box(.14, .12, .14, 0, -.04, 0, lam, { l: L_METAL, rough: .5 }); S.box(.145, .018, .145, 0, -.06, 0, lamL, { l: L_METAL, rough: .45, jit: 0 }); }, limb, { rad: .07, shadow: false });
    k.lArm = new PartBatch(S => { S.box(.085, .24, .085, 0, -.12, 0, lea, {}); S.box(.09, .08, .09, 0, -.27, 0, COL.skin, {}); }, limb, { rad: .07, shadow: false });
    k.uLeg = new PartBatch(S => { S.box(.115, .28, .115, 0, -.14, 0, clothDk, { l: L_CLOTH }); S.box(.13, .14, .125, 0, -.06, 0, cloth, { l: L_CLOTH }); }, limb, { rad: .08, shadow: false });
    k.lLeg = new PartBatch(S => { S.box(.1, .28, .1, 0, -.14, 0, mulC(COL.black, 4), {}); S.box(.11, .06, .2, 0, -.29, .045, mulC(COL.black, 3), {}); }, limb, { rad: .08, shadow: false });
  } else if (style === 'jiang') {
    // Hopping corpse: a pale official in a dark court robe with a rank badge, white cuffs and black boots.
    const robe = C(0x1b2a4a), robeD = C(0x111a30), skin = C(0xa2b49c), skinD = C(0x6e8270), red = C(0x7a1f1a), gold = mulC(COL.gold, .8), white = C(0xcfcabb);
    k.pelvis = new PartBatch(S => { S.box(.31, .3, .21, 0, -.09, 0, robe, { l: L_CLOTH }); S.box(.33, .045, .22, 0, .05, 0, red, { l: L_CLOTH }); S.box(.05, .26, .215, 0, -.1, 0, robeD, { l: L_CLOTH }); }, cap, { rad: .15 });
    k.torso = new PartBatch(S => {
      S.box(.34, .42, .22, 0, .21, 0, robe, { l: L_CLOTH, jit: 0 }); S.box(.17, .17, .012, 0, .23, .114, gold, { jit: 0 }); S.box(.1, .1, .014, 0, .23, .116, red, { jit: 0 }); S.box(.04, .04, .016, 0, .23, .118, white, { jit: 0 });
      S.box(.36, .07, .24, 0, .4, 0, robeD, { l: L_CLOTH }); S.box(.14, .08, .14, 0, .45, 0, skin, {}); for (const y of [.36, .3]) S.sph(.014, .0, y, .118, gold, { w: 4, h: 3, smooth: false });
    }, cap, { rad: .17 });
    k.head = new PartBatch(S => {
      S.box(.19, .2, .19, 0, .12, .0, skin, { jit: .04 }); S.box(.2, .1, .08, 0, .07, -.07, mulC(COL.black, 2.5), {});
      for (const s of [-1, 1]) { S.box(.05, .045, .02, s * .05, .14, .096, skinD, { jit: 0 }); S.box(.03, .03, .02, s * .05, .14, .1, COL.black, { jit: 0 }); S.box(.014, .035, .02, s * .03, .035, .1, white, { jit: 0 }); }
      S.box(.09, .02, .02, 0, .06, .098, COL.black, { jit: 0 }); S.seg([0, .12, -.1], [0, -.24, -.17], .028, .018, mulC(COL.black, 2.5), { n: 4 });
    }, cap, { rad: .14 });
    k.uArm = new PartBatch(S => { S.box(.11, .27, .11, 0, -.13, 0, robe, { l: L_CLOTH }); }, limb, { rad: .07, shadow: false });
    k.lArm = new PartBatch(S => { S.box(.13, .22, .13, 0, -.1, 0, robe, { l: L_CLOTH }); S.box(.15, .05, .15, 0, -.21, 0, white, { l: L_CLOTH }); S.box(.08, .08, .08, 0, -.27, 0, skin, {}); for (const x of [-.03, 0, .03]) S.box(.016, .07, .016, x, -.33, .02, skinD, { jit: 0 }); }, limb, { rad: .07, shadow: false });
    k.uLeg = new PartBatch(S => { S.box(.12, .28, .12, 0, -.14, 0, robeD, { l: L_CLOTH }); }, limb, { rad: .08, shadow: false });
    k.lLeg = new PartBatch(S => { S.box(.1, .26, .1, 0, -.13, 0, mulC(COL.black, 3), {}); S.box(.11, .05, .2, 0, -.27, .045, mulC(COL.black, 3), {}); S.box(.115, .025, .205, 0, -.305, .045, white, {}); }, limb, { rad: .08, shadow: false });
  } else {
    const sk = COL.ogre, sdk = COL.ogreD, o = () => ({ jit: .06, d: 1 });
    const tig = C(0xc8782a), tigD = C(0x15100c);
    k.pelvis = new PartBatch(S => { S.ico(.2, 0, 0, 0, sdk, { sc: [1.15, .6, .95], d: 1 }); for (const [z, len, sd] of [[.175, .32, 3], [-.175, .26, 4]]) { clothPanel(S, { x0: -.17, x1: .17, yTop: .02, len, z, col: tig, rng: makeRng(sd), sway: 0, nx: 3, ny: 4, rag: .25 }); for (let q = 0; q < 3; q++) S.box(.15, .024, .014, (q & 1 ? .05 : -.05), -.04 - q * .075, z + Math.sign(z) * .006, tigD, { jit: 0, r: [0, 0, q & 1 ? -.3 : .3] }); } for (const sg of [-1, 1]) S.box(.02, .2, .26, sg * .21, -.07, 0, tig, { l: L_CLOTH }); S.box(.46, .055, .38, 0, .03, 0, mulC(COL.leather, .6), {}); S.sph(.05, 0, .03, .2, COL.brass, { l: L_METAL, w: 6, h: 4, smooth: false }); }, cap, { rad: .2 });
    k.torso = new PartBatch(S => {
      S.ico(.27, 0, .17, .04, sk, { sc: [1.1, .9, 1.05], d: 1 }); S.ico(.25, 0, .37, -.01, sk, { sc: [1.2, .75, .85], d: 1 });
      for (const s of [-1, 1]) S.ico(.11, s * .27, .45, 0, sdk, { d: 1 });
      S.sph(.1, -.27, .5, 0, COL.iron, { l: L_METAL, w: 6, h: 4, smooth: false }); for (let a = 0; a < 3; a++) S.cone(.03, .1, -.27 + Math.cos(a * 2.1) * .08, .6, Math.sin(a * 2.1) * .08, COL.ironL, { n: 4, l: L_METAL });
      S.box(.1, .52, .03, .08, .25, .295, tig, { l: L_CLOTH, r: [0, 0, .5] }); for (const [x, y] of [[.0, .12], [.1, .26], [.2, .4]]) S.box(.1, .022, .034, x, y, .297, tigD, { jit: 0, r: [0, 0, .5] });
      for (let q = -3; q <= 3; q++) S.ico(.036, q * .055, .46 - (1 - q * q / 9) * .12, .2 + (1 - q * q / 9) * .085, C(0x5a1410), { d: 0 });
    }, cap, { rad: .28 });
    k.head = new PartBatch(S => {
      S.ico(.13, 0, .1, .02, sk, { sc: [1.05, .95, 1.0], d: 1 }); S.box(.19, .07, .13, 0, .03, .08, sdk, { jit: 0 }); S.box(.22, .04, .08, 0, .15, .09, sdk, { jit: 0 });
      for (const s of [-1, 1]) { S.cone(.022, .09, s * .07, .08, .15, COL.bone, { n: 4, l: L_BONE }); S.box(.045, .03, .03, s * .055, .125, .125, COL.black, { jit: 0 }); S.box(.04, .09, .03, s * .15, .12, 0, sdk, { r: [0, 0, s * -.4] }); S.cone(.034, .17, s * .085, .27, .03, COL.bone, { n: 5, l: L_BONE, r: [-.25, 0, s * -.4] }); }
      S.ico(.12, 0, .15, -.07, C(0x120f0f), { sc: [1.15, 1.0, .8], d: 1 }); S.ico(.07, 0, .02, -.12, C(0x120f0f), { sc: [1.4, 1.3, .7], d: 0 }); S.box(.03, .03, .02, 0, .185, .13, C(0xb02a1c), { jit: 0, emis: .1 });
    }, cap, { rad: .13 });
    k.uArm = new PartBatch(S => { S.ico(.1, 0, -.12, 0, sk, { sc: [1, 1.5, 1], d: 1 }); }, limb, { rad: .1, shadow: false });
    k.lArm = new PartBatch(S => { S.ico(.09, 0, -.12, 0, sk, { sc: [1, 1.5, 1], d: 1 }); S.ico(.085, 0, -.27, 0, sdk, { d: 1 }); S.cyl(.105, .06, 0, -.18, 0, COL.brass, { n: 7, l: L_METAL, rough: .45 }); }, limb, { rad: .1, shadow: false });
    k.uLeg = new PartBatch(S => { S.ico(.11, 0, -.1, 0, sk, { sc: [1, 1.35, 1.05], d: 1 }); }, limb, { rad: .1, shadow: false });
    k.lLeg = new PartBatch(S => { S.ico(.095, 0, -.1, 0, sk, { sc: [1, 1.3, 1], d: 1 }); S.box(.17, .07, .26, 0, -.21, .05, sdk, {}); }, limb, { rad: .1, shadow: false });
  }
  return k;
}

function initKits() {
  const iron = COL.iron, rust = mixC(COL.ironL, C(0x7a4a2a), .45);
  KIT.skel = humanKit('skel', 96);
  KIT.foot = humanKit('foot', 96);
  KIT.giant = humanKit('giant', 2);
  KIT.ogre = humanKit('ogre', 30);
  KIT.jiang = humanKit('jiang', 40);
  for (const k of ['uArm', 'lArm', 'uLeg', 'lLeg']) KIT.giant[k].mesh.castShadow = true;
  const E = KIT.item = {};
  E.sword = new PartBatch(S => { S.box(.035, .15, .035, 0, 0, 0, COL.woodD, {}); S.add(gTorus(6, .3, 3), { s: .036, p: [0, -.105, 0], r: [0, HPI, 0], c: iron, l: L_METAL }); S.box(.09, .03, .05, 0, .085, 0, iron, { l: L_METAL }); S.box(.018, .5, .06, 0, .35, 0, rust, { l: L_METAL, rough: .5 }); S.box(.018, .1, .046, 0, .63, -.012, rust, { l: L_METAL, rough: .5, r: [.3, 0, 0] }); }, 100, { rad: .05, shadow: false });
  E.blade = new PartBatch(S => { const st = mulC(COL.steel, 1.15); S.box(.04, .15, .04, 0, 0, 0, COL.lacqD, {}); S.add(gTorus(6, .3, 3), { s: .04, p: [0, -.11, 0], r: [0, HPI, 0], c: COL.brass, l: L_METAL }); S.box(.1, .03, .05, 0, .085, 0, COL.brass, { l: L_METAL, rough: .4 }); S.box(.02, .5, .065, 0, .35, 0, st, { l: L_METAL, rough: .3 }); S.box(.02, .1, .05, 0, .63, -.012, st, { l: L_METAL, rough: .3, r: [.3, 0, 0] }); }, 40, { rad: .05, shadow: false });
  E.torch = new PartBatch(S => { S.box(.04, .42, .04, 0, .1, 0, COL.woodD, { l: L_WOOD }); S.cyl(.06, .1, 0, .34, 0, mulC(COL.black, 3), { n: 6 }); S.cyl(.05, .03, 0, .4, 0, COL.ember, { n: 6, emis: .5, jit: 0 }); }, 80, { rad: .05, shadow: false });
  E.shieldR = new PartBatch(S => { const bz = mulC(COL.bronze, 1.1); S.cyl(.27, .05, 0, 0, 0, C(0x2a1512), { n: 10, r: [HPI, 0, 0], l: L_WOOD }); S.add(gTorus(10, .1, 4), { s: .26, p: [0, 0, .012], c: bz, l: L_METAL }); S.cyl(.15, .056, 0, 0, 0, C(0x6a1a14), { n: 10, r: [HPI, 0, 0], l: L_WOOD }); S.sph(.07, 0, -.01, .04, bz, { l: L_METAL, w: 6, h: 4, smooth: false }); for (const sg of [-1, 1]) { S.sph(.03, sg * .08, .07, .035, COL.brass, { l: L_METAL, w: 5, h: 3, smooth: false }); S.cone(.018, .07, sg * .045, -.1, .035, COL.bone, { n: 4, l: L_BONE, r: [PI, 0, 0] }); S.cone(.03, .09, sg * .13, .15, .03, bz, { n: 4, l: L_METAL, r: [0, 0, sg * -.5] }); } }, 60, { rad: .2, shadow: false });
  E.shieldH = new PartBatch(S => { const sc = mulC(COL.lacq, 1.25), g = mulC(COL.brass, 1.05); S.box(.34, .52, .04, 0, -.02, 0, sc, { l: L_WOOD, jit: 0 }); S.box(.36, .05, .05, 0, .235, .002, g, { l: L_METAL, rough: .45, jit: 0 }); S.box(.36, .05, .05, 0, -.275, .002, g, { l: L_METAL, rough: .45, jit: 0 }); S.sph(.07, 0, -.02, .035, g, { l: L_METAL, w: 6, h: 4, smooth: false }); for (const [x, y] of [[-.1, .12], [.1, .12], [-.1, -.16], [.1, -.16]]) S.box(.04, .04, .05, x, y, .004, g, { l: L_METAL, jit: 0 }); }, 40, { rad: .2, shadow: false });
  E.helm = new PartBatch(S => {
    const ir = mulC(iron, 1.15), irL = COL.ironL;
    S.add(gDome(8, 3), { s: [.185, .2, .2], p: [0, .17, 0], c: ir, l: L_METAL, rough: .5 }); S.cyl(.207, .03, 0, .175, 0, irL, { n: 8, l: L_METAL, rough: .45 });
    S.box(.31, .17, .05, 0, .075, -.175, ir, { l: L_METAL, rough: .55 }); for (const sg of [-1, 1]) S.box(.045, .18, .2, sg * .178, .075, -.04, ir, { l: L_METAL, rough: .55 });
    for (const y of [.03, .09, .14]) { S.box(.315, .012, .055, 0, y, -.176, irL, { l: L_METAL, jit: 0 }); for (const sg of [-1, 1]) S.box(.05, .012, .205, sg * .179, y, -.04, irL, { l: L_METAL, jit: 0 }); }
    S.box(.06, .07, .03, 0, .21, .19, COL.brass, { l: L_METAL, rough: .4 }); S.cyl(.022, .1, 0, .41, 0, COL.brass, { n: 5, l: L_METAL }); S.ico(.062, 0, .49, -.025, C(0x7a1a14), { d: 0, sc: [1, 1.3, 1.5] });
  }, 140, { rad: .16, shadow: false });
  E.plate = new PartBatch(S => {
    const ir = mulC(iron, 1.1), irL = COL.ironL;
    S.box(.36, .34, .26, 0, .26, 0, ir, { l: L_METAL, rough: .5 }); for (const y of [.14, .21, .28, .35]) S.box(.366, .014, .266, 0, y, 0, irL, { l: L_METAL, rough: .45, jit: 0 });
    for (const x of [-.09, 0, .09]) S.box(.012, .3, .268, x, .26, 0, mulC(ir, .6), { jit: 0 }); S.cyl(.07, .02, 0, .3, .137, COL.brass, { n: 8, r: [HPI, 0, 0], l: L_METAL, rough: .35 });
    for (const sg of [-1, 1]) { S.box(.16, .05, .21, sg * .22, .455, 0, ir, { l: L_METAL, rough: .5 }); S.box(.14, .1, .19, sg * .255, .39, 0, mulC(ir, .9), { l: L_METAL, rough: .5 }); S.box(.165, .012, .215, sg * .22, .43, 0, irL, { l: L_METAL, jit: 0 }); }
    S.box(.37, .055, .27, 0, .1, 0, C(0x5a1a16), { l: L_CLOTH });
  }, 120, { rad: .2, shadow: false });
  E.bow = new PartBatch(S => { let p = [0, -.36, 0]; for (let i = 1; i <= 6; i++) { const t = i / 6 * 2 - 1, q = [0, t * .36, (1 - t * t) * .12]; S.seg(p, q, .016, .016, COL.woodL, { n: 4, l: L_WOOD }); p = q; } S.seg([0, -.36, 0], [0, .36, 0], .005, .005, COL.bone, { n: 3, jit: 0 }); }, 40, { rad: .1, shadow: false });
  E.club = new PartBatch(S => { S.seg([0, -.12, 0], [0, .62, 0], .045, .11, COL.wood, { l: L_WOOD, n: 6 }); S.cyl(.12, .1, 0, .6, 0, iron, { n: 6, l: L_METAL }); for (let a = 0; a < 6; a++) S.cone(.03, .12, Math.cos(a * 1.05) * .13, .45 + (a % 2) * .14, Math.sin(a * 1.05) * .13, COL.ironL, { n: 4, l: L_METAL, r: [Math.sin(a * 1.05) * 1.57, 0, -Math.cos(a * 1.05) * 1.57] }); }, 10, { rad: .1 });
  E.guandao = new PartBatch(S => {
    // the general's glaive: a long shaft, a crescent blade with a hooked back and a red tassel
    const st = mulC(COL.steel, 1.1), g = mulC(COL.gold, .85);
    S.seg([0, -.62, 0], [0, .72, 0], .024, .024, C(0x3a1512), { l: L_WOOD, n: 5 }); S.cone(.03, .1, 0, -.67, 0, st, { n: 4, l: L_METAL, r: [PI, 0, 0] });
    S.cyl(.04, .06, 0, .72, 0, g, { n: 6, l: L_METAL, rough: .4 }); S.ico(.06, 0, .66, .0, C(0xb02a1c), { d: 0, sc: [1.2, 1.5, 1.2] });
    S.box(.02, .34, .15, 0, .92, .035, st, { l: L_METAL, rough: .3 }); S.box(.02, .16, .11, 0, 1.13, .0, st, { l: L_METAL, rough: .3, r: [-.35, 0, 0] }); S.cone(.045, .14, 0, 1.24, -.065, st, { n: 4, l: L_METAL, rough: .3, rz: .012, r: [-.55, 0, 0] });
    S.box(.02, .06, .1, 0, .96, -.08, st, { l: L_METAL, rough: .3, r: [.6, 0, 0] }); S.box(.024, .3, .03, 0, .92, -.03, g, { l: L_METAL, rough: .4 });
  }, 2, { rad: .1 });
  const fur = COL.rat, furD = COL.ratD;
  KIT.rat = {
    body: new PartBatch(S => {
      S.ico(.2, 0, .02, 0, fur, { sc: [.75, .7, 1.45], d: 1 }); S.ico(.12, 0, .0, .3, furD, { sc: [.8, .75, 1.3], d: 1 }); S.cone(.045, .13, 0, -.03, .47, C(0x8a6a62), { n: 5, r: [HPI, 0, 0] });
      for (const s of [-1, 1]) { S.box(.07, .08, .02, s * .075, .11, .24, C(0x7a5a55), { r: [0, s * .4, 0] }); S.box(.025, .025, .02, s * .05, .03, .4, COL.black, { jit: 0 }); }
    }, 90, { rad: .15 }),
    leg: new PartBatch(S => { S.box(.05, .14, .05, 0, -.07, 0, furD, {}); S.box(.05, .03, .1, 0, -.14, .03, C(0x8a6a62), {}); }, 360, { rad: .05, shadow: false }),
    tail: new PartBatch(S => { S.seg([0, 0, 0], [0, 0, -.24], .028, .014, C(0x8a6a62), { n: 4 }); }, 180, { rad: .04, shadow: false }),
  };
  KIT.slime = { body: new PartBatch(S => {
    S.add(gDome(10, 5), { s: [.5, .46, .5], p: [0, 0, 0], c: COL.slime, smooth: true, rough: .32, jit: 0, emis: .006, c2: [COL.slimeD[0], COL.slimeD[1], COL.slimeD[2], v => smooth(.3, .0, v.y)] });
    S.cyl(.5, .05, 0, .0, 0, COL.slimeD, { n: 10, rough: .32, rt: .96 });
    S.ico(.17, .04, .16, -.02, mulC(COL.slimeD, .6), { d: 1, rough: .4, sc: [1, .8, 1] });
    for (const s of [-1, 1]) S.box(.07, .09, .03, s * .13, .2, .42, COL.black, { jit: 0, r: [-.35, 0, 0] });
  }, 80, { rad: .3 }) };
  KIT.bat = {
    body: new PartBatch(S => { S.ico(.11, 0, 0, 0, COL.bat, { sc: [.9, .9, 1.4], d: 1 }); for (const s of [-1, 1]) { S.cone(.03, .1, s * .05, .1, .1, COL.bat, { n: 4 }); S.box(.02, .02, .02, s * .04, .03, .15, COL.black, { jit: 0 }); } }, 50, { rad: .1 }),
    wing: new PartBatch(S => {
      const c = mulC(COL.bat, 1.25), c2 = mulC(COL.bat, .8), pts = [[0, 0, .1], [.2, .03, .14], [.46, .02, .06], [.4, 0, -.06], [.27, 0, -.02], [.2, 0, -.14], [.1, 0, -.06], [0, 0, -.12]];
      for (let i = 1; i < pts.length - 1; i++) { S.tri(pts[0], pts[i + 1], pts[i], i & 1 ? c : c2, L_PLAIN, .9); S.tri(pts[0], pts[i], pts[i + 1], i & 1 ? c : c2, L_PLAIN, .9); }
      S.seg([0, 0, .1], [.46, .02, .06], .014, .008, c2, { n: 3 });
    }, 100, { rad: .1 }),
  };
  KIT.arrow = new PartBatch(S => { S.box(.022, .022, .5, 0, 0, 0, COL.woodL, { jit: 0 }); S.cone(.035, .09, 0, 0, .29, COL.ember, { n: 4, r: [HPI, 0, 0], emis: .9, jit: 0 }); for (const r of [0, HPI]) S.box(.07, .006, .1, 0, 0, -.2, COL.bone, { r: [0, 0, r], jit: 0 }); }, 120, { shadow: false });
  KIT.shell = new PartBatch(S => { S.sph(.12, 0, 0, 0, mulC(COL.iron, .8), { l: L_METAL, w: 7, h: 5, smooth: false, rough: .5 }); S.box(.04, .04, .04, 0, .12, 0, COL.ember, { emis: 1, jit: 0 }); }, 24, {});
  KIT.stoneShot = new PartBatch(S => { S.rock(.13, 0, 0, 0, COL.stone, {}); }, 48, {});
  KIT.coin = new PartBatch(S => { S.cyl(.075, .022, 0, 0, 0, COL.gold, { n: 8, l: L_METAL, rough: .35, emis: .16, jit: 0 }); S.cyl(.05, .026, 0, 0, 0, mulC(COL.gold, 1.3), { n: 8, l: L_METAL, rough: .3, emis: .2, jit: 0 }); }, 160, { shadow: false, rad: .05 });
  KIT.goo = new PartBatch(S => { S.ico(.08, 0, 0, 0, COL.slime, { d: 1, rough: .3, emis: .08 }); }, 200, { shadow: false, rad: .06 });
  KIT.rubble = new PartBatch(S => { S.rock(.14, 0, 0, 0, COL.stone, {}); }, 160, { rad: .1 });
  KIT.plank = new PartBatch(S => { S.box(.12, .6, .05, 0, 0, 0, COL.wood, { l: L_WOOD }); }, 100, { rad: .08 });
  initBestiary();
  initArmy();
}

const SPEC = {
  skel: { hip: .6, pelvisH: .12, torsoH: .46, shX: .21, shY: .42, uArm: .27, lArm: .29, hipX: .085, uLeg: .29, lLeg: .3, stride: .62, lean: .12, stoop: .1, eyeX: .058, eyeY: .185, eyeZ: .15, top: 1.42 },
  foot: { hip: .59, pelvisH: .1, torsoH: .46, shX: .23, shY: .4, uArm: .27, lArm: .27, hipX: .09, uLeg: .29, lLeg: .29, stride: .55, lean: .06, stoop: 0, eyeX: 0, eyeY: 0, eyeZ: 0, top: 1.4 },
  ogre: { hip: .43, pelvisH: .08, torsoH: .5, shX: .3, shY: .43, uArm: .25, lArm: .3, hipX: .12, uLeg: .21, lLeg: .21, stride: .5, lean: .1, stoop: .14, eyeX: .055, eyeY: .125, eyeZ: .15, top: 1.2 },
};
const RIGOUT = { headM: _M[3], handR: new THREE.Vector3(), handL: new THREE.Vector3(), tip: new THREE.Vector3(), torch: new THREE.Vector3() };
function rigHuman(kit, sp, e) {
  const s = e.scale || 1, mv = e.mv, ph = e.ph, fl = e.flash || 0, tint = e.tint || null, fz = e.flinch || 0;
  const sw = e.stiff ? 0 : Math.sin(ph) * sp.stride * mv, cw = Math.cos(ph);
  let twist = e.stiff ? 0 : Math.sin(ph) * .12 * mv, lean = sp.lean * mv + sp.stoop, lunge = 0, dip = 0;
  let shR = .25 * sw - .15, elR = -.35, bladeA = .55, shL = -.7 * sw - .1, elL = -.3, rzR = -.1, rzL = .1;
  if (e.shamble) { shR = -1.0 + .12 * Math.sin(ph); elR = -.7; shL = -.75 + .2 * Math.sin(ph + 1); elL = -.5; bladeA = .2; }
  if (e.shield) { shL = -.55; elL = -1.25; rzL = .2; }
  if (e.torch) { shL = -1.25 + .06 * Math.sin(ph * 2); elL = -.5; }
  if (e.heavy) { shR = -.3 + .3 * sw; elR = -.5; bladeA = 1.9; shL = -.2 - .5 * sw; elL = -.6; }
  if (e.claw) { shR = -1.25 + .45 * sw; elR = -.55; shL = -1.25 - .45 * sw; elL = -.55; }
  if (e.staff) { shR = -.75; elR = -.95; bladeA = .12; }
  if (e.stiff) { shR = shL = -HPI + .07 * Math.sin(ph * 2) * mv; elR = elL = -.05; rzR = rzL = 0; }
  if (e.cast > 0) { const u = easeInOut(Math.min(1, e.cast * 1.6)); shR = lerp(shR, -2.7, u); elR = lerp(elR, -.25, u); shL = lerp(shL, -2.3, u); elL = lerp(elL, -.4, u); }
  if (e.drum) { const b = Math.sin(e.beat || 0); shR = -.95 - .5 * Math.max(0, b); elR = -1.15; shL = -.95 - .5 * Math.max(0, -b); elL = -1.15; bladeA = .9; }
  let atk = e.atk;
  if (e.bow) {
    const d = e.draw || 0; shL = -HPI + (e.pitch || 0); elL = -.05; rzL = .05; shR = -HPI + (e.pitch || 0) + .1; elR = -.2 - d * 1.9; twist = .2 + d * .25; atk = -1;
  }
  if (atk >= 0) {
    const t = atk;
    if (t < .38) { const u = easeInOut(t / .38); shR = lerp(shR, -3.35, u); elR = lerp(elR, -.95, u); bladeA = lerp(bladeA, -2.95, u); twist = lerp(twist, -.42, u); lean = lerp(lean, -.12, u); }
    else if (t < .52) { const u = easeIn((t - .38) / .14); shR = lerp(-3.35, -.85, u); elR = lerp(-.95, -.12, u); bladeA = lerp(-2.95, 1.75, u); twist = lerp(-.42, .42, u); lean = lerp(-.12, .26, u); lunge = .14 * u; dip = .05 * u; }
    else { const u = easeOut((t - .52) / .48); shR = lerp(-.85, shR, u); elR = lerp(-.12, elR, u); bladeA = lerp(1.75, bladeA, u); twist = lerp(.42, twist, u); lean = lerp(.26, lean, u); lunge = .14 * (1 - u); dip = .05 * (1 - u); }
  }
  const bob = -sp.uLeg * (1 - Math.cos(sw)) - dip + (e.heavy ? Math.abs(Math.sin(ph)) * .035 * mv : Math.abs(Math.sin(ph)) * .02 * mv);
  const M0 = xf(_M[0], null, e.x, e.y, e.z, 0, e.yaw, 0, s, s, s);
  const M1 = xf(_M[1], M0, 0, sp.hip + sp.uLeg * 0 + bob + (e.stiff ? Math.abs(Math.sin(ph)) * .22 * mv : 0), lunge - fz * .06, lean * .4 - fz * .18, twist * .5, (e.shamble ? Math.sin(ph) * .05 * mv : 0));
  kit.pelvis.put(M1, fl, tint);
  const M2 = xf(_M[2], M1, 0, sp.pelvisH, 0, lean * .6 - fz * .4, twist, 0);
  kit.torso.put(M2, fl, tint);
  const M3 = xf(_M[3], M2, 0, sp.torsoH, 0, -lean * .6 - fz * .35 + (e.shamble ? Math.sin(ph * 2) * .05 : 0), -twist * .8, e.shamble ? Math.sin(ph) * .1 * mv : 0);
  kit.head.put(M3, fl, tint);
  const M4 = xf(_M[4], M2, sp.shX, sp.shY, 0, shL + fz * .5, 0, rzL + fz * .3), M5 = xf(_M[5], M4, 0, -sp.uArm, 0, elL, 0, 0);
  kit.uArm.put(M4, fl, tint); kit.lArm.put(M5, fl, tint);
  const M6 = xf(_M[6], M2, -sp.shX, sp.shY, 0, shR + fz * .4, 0, rzR - fz * .3), M7 = xf(_M[7], M6, 0, -sp.uArm, 0, elR, 0, 0);
  kit.uArm.put(M6, fl, tint); kit.lArm.put(M7, fl, tint);
  RIGOUT.handR.set(0, -sp.lArm, 0).applyMatrix4(M7); RIGOUT.handL.set(0, -sp.lArm, 0).applyMatrix4(M5);
  const I = KIT.item, psiR = shR + elR + fz * .4, psiL = shL + elL + fz * .5;
  if (e.weapon) { const M8 = xf(_M[8], M7, 0, -sp.lArm, 0, bladeA - psiR, 0, 0, e.wScale || 1, e.wScale || 1, e.wScale || 1); e.weapon.put(M8, fl, null); RIGOUT.tip.set(0, .6, 0).applyMatrix4(M8); }
  if (e.shield) { const M9 = xf(_M[9], M5, .04, -sp.lArm * .6, .06, -psiL + .05, .25, 0); e.shield.put(M9, fl, e.shieldTint || null); }
  if (e.torch) { const M9 = xf(_M[9], M5, 0, -sp.lArm, 0, .25 - psiL, 0, 0); I.torch.put(M9, 0, null); RIGOUT.torch.set(0, .46, 0).applyMatrix4(M9); }
  if (e.bow) { if (e.gun) { const M9 = xf(_M[9], M5, 0, -sp.lArm, 0, -psiL, 0, 0); e.gun.put(M9, fl, null); } else if (e.xbow) { const M9 = xf(_M[9], M5, 0, -sp.lArm, 0, -psiL, 0, 0); I.xbow.put(M9, fl, null); } else { const M9 = xf(_M[9], M5, 0, -sp.lArm, 0, HPI + .0, 0, 0); I.bow.put(M9, fl, null); } }
  if (e.helm) I.helm.put(M3, fl, null);
  if (e.plate) I.plate.put(M2, fl, null);
  if (e.hood) I.hood.put(M3, fl, null); if (e.robe) I.robe.put(M2, fl, null); if (e.drum) I.drum.put(M2, fl, null); if (e.standard) I.standard.put(M2, 0, null);
  if (e.hat) e.hat.put(M3, fl, null); if (e.back) e.back.put(M2, fl, null); if (e.skirt) e.skirt.put(M1, fl, null);
  if (e.keg) I.keg.put(M2, fl, null); if (e.wraps) { I.wraps.put(M2, fl, null); I.wrapHead.put(M3, fl, null); } if (e.crown) I.crown.put(M3, fl, null); if (e.jhat) I.jhat.put(M3, fl, null); if (e.general) { I.genHelm.put(M3, fl, null); I.genBack.put(M2, fl, null); }
  const kL = e.stiff || e.ride ? 0 : Math.max(0, cw) * 1.0 * mv, kR = e.stiff || e.ride ? 0 : Math.max(0, -cw) * 1.0 * mv;
  // a rider's thighs go forward and out around the saddle, his shins hang
  const rX = e.ride ? -1.15 : 0, rZ = e.ride ? .55 : 0, rK = e.ride ? 1.2 : 0;
  const M10 = xf(_M[10], M1, sp.hipX, 0, 0, -sw - kL * .25 + rX, 0, rZ), M11 = xf(_M[11], M10, 0, -sp.uLeg, 0, kL + rK, 0, -rZ * .8);
  const M12 = xf(_M[12], M1, -sp.hipX, 0, 0, sw - kR * .25 + rX, 0, -rZ), M13 = xf(_M[13], M12, 0, -sp.uLeg, 0, kR + rK, 0, rZ * .8);
  kit.uLeg.put(M10, fl, tint); kit.lLeg.put(M11, fl, tint); kit.uLeg.put(M12, fl, tint); kit.lLeg.put(M13, fl, tint);
  return M3;
}
function rigRat(e) {
  const K = KIT.rat, ph = e.ph, s = e.scale || 1, fl = e.flash || 0, mv = e.mv;
  const M0 = xf(_M[0], null, e.x, e.y + (.2 + Math.abs(Math.sin(ph * 2)) * .035 * mv) * s, e.z, Math.sin(ph * 2) * .07 * mv - (e.flinch || 0) * .5, e.yaw, 0, s, s, s);
  K.body.put(M0, fl, e.tint);
  for (let i = 0; i < 4; i++) {
    const fr = i < 2, sd = (i & 1) ? -1 : 1, a = Math.sin(ph * 2 + (fr === (sd > 0) ? 0 : PI)) * .9 * mv;
    K.leg.put(xf(_M[4 + i], M0, sd * .12, -.04, fr ? .16 : -.16, a, 0, sd * .15), fl, e.tint);
  }
  const T1 = xf(_M[8], M0, 0, .03, -.26, .25, Math.sin(ph + 1) * .4, 0); K.tail.put(T1, fl, e.tint);
  K.tail.put(xf(_M[9], T1, 0, 0, -.24, -.2, Math.sin(ph + 2.2) * .6, 0, .8, .8, 1), fl, e.tint);
  return M0;
}
function rigSlime(e) {
  const s = e.scale || 1, h = e.hop || 0, fl = e.flash || 0;
  let sy = 1, y = 0;
  if (h < .22) sy = 1 - .3 * easeOut(h / .22);
  else if (h < .6) { const u = (h - .22) / .38; sy = .7 + .62 * Math.sin(Math.min(1, u * 1.6) * HPI) - .12 * u; y = Math.sin(u * PI) * .34; }
  else if (h < .76) { const u = (h - .6) / .16; sy = 1.2 - .5 * Math.sin(u * PI) - .2 * u; }
  else sy = 1 + .04 * Math.sin((h - .76) / .24 * TAU);
  sy *= 1 - (e.flinch || 0) * .25; const sx = 1 / Math.sqrt(Math.max(.4, sy));
  const M0 = xf(_M[0], null, e.x, e.y + y * s, e.z, 0, e.yaw, 0, s * sx, s * sy, s * sx);
  KIT.slime.body.put(M0, fl, e.tint); return M0;
}
function rigBat(e, K = KIT.bat, wx = .06, wy = .02) {
  const s = e.scale || 1, fl = e.flash || 0, f = Math.sin(e.ph), tint = e.tint || null;
  const M0 = xf(_M[0], null, e.x, e.y + Math.sin(e.ph * .5) * .08, e.z, -.25 + (e.flinch || 0) * .8, e.yaw, Math.sin(e.ph * .25) * .15, s, s, s);
  K.body.put(M0, fl, tint);
  K.wing.put(xf(_M[1], M0, wx, wy, 0, 0, 0, f * .85 + .15), fl, tint);
  K.wing.put(xf(_M[2], M0, -wx, wy, 0, 0, 0, -(f * .85 + .15), -1, 1, 1), fl, tint);
  return M0;
}

const DEB = [];
const _dq = new THREE.Quaternion(), _dax = new THREE.Vector3(), _dp = new THREE.Vector3(), _ds = new THREE.Vector3(), _dm = new THREE.Matrix4();
function addDebris(batch, mat, tint, vx, vy, vz, spin, life, o = {}) {
  if (DEB.length > 520) return null;
  const d = { batch, p: new THREE.Vector3(), q: new THREE.Quaternion(), s: new THREE.Vector3(), vx, vy, vz, w: new THREE.Vector3(rr(-1, 1), rr(-1, 1), rr(-1, 1)).normalize(), ws: spin, life, max: life, tint: tint ? tint.slice() : null, rad: o.rad || batch.rad, rest: false, coin: o.coin || 0, bounce: o.bounce === undefined ? .32 : o.bounce, flash: o.flash || 0, goo: o.goo || 0, hold: o.hold || 0 };
  mat.decompose(d.p, d.q, d.s); d.rad *= Math.max(d.s.x, d.s.y); DEB.push(d); return d;
}
function shatter(rigFn, e, impulse, o = {}) {
  const ix = impulse[0], iy = impulse[1], iz = impulse[2], spread = o.spread === undefined ? 1.6 : o.spread;
  RIG_CAPTURE = (batch, mat, tint) => { addDebris(batch, mat, tint, ix + rr(-spread, spread), iy + rr(.4, 2.2) * (o.up || 1), iz + rr(-spread, spread), rr(3, 11), rr(3.2, 5.5) * (o.life || 1), { hold: o.hold ? rr(0, o.hold) : 0 }); };
  try { rigFn(e); } finally { RIG_CAPTURE = null; }
}
function updateDebris(dt, groundAt, onCoin) {
  for (let i = DEB.length - 1; i >= 0; i--) {
    const d = DEB[i]; d.life -= dt;
    if (d.life <= 0) { swapRemove(DEB, i); continue; }
    if (d.hold > 0) { d.hold -= dt; }
    else if (!d.rest) {
      d.vy -= 13 * dt; d.p.x += d.vx * dt; d.p.y += d.vy * dt; d.p.z += d.vz * dt;
      _dq.setFromAxisAngle(d.w, d.ws * dt); d.q.premultiply(_dq);
      const gy = groundAt(d.p.x, d.p.z) + d.rad;
      if (d.p.y < gy) {
        d.p.y = gy;
        if (d.goo) { d.life = 0; continue; }
        if (Math.abs(d.vy) < 1.2) { d.rest = true; d.vy = 0; } else { d.vy = -d.vy * d.bounce; }
        d.vx *= .55; d.vz *= .55; d.ws *= .5;
      }
    } else if (d.life < .9 && !d.coin) { d.p.y -= dt * .22; }
    if (d.coin && d.max - d.life > d.coin) { onCoin(d); swapRemove(DEB, i); continue; }
    let sc = 1; if (!d.coin && d.life < .5) sc = Math.max(.01, d.life / .5);
    _dm.compose(d.p, d.q, _ds.copy(d.s).multiplyScalar(sc));
    d.batch.put(_dm, d.flash, d.tint);
  }
}
function clearDebris() { DEB.length = 0; }
