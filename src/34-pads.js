// Tower bases. They used to be dark stone octagons ringed with loose rocks, the same stone as the ground around them, and were
// easy to lose against the terrain. A base is now a squared masonry platform (a taiji): pale dressed stone, a vermilion border, dark paving and a
// brass boss, with a step on the side that faces the road. No terrain in any of the five battlefields is square, pale and
// red-edged, so a base reads as a built thing at a glance. An empty base also carries an apricot-yellow flag (KIT.marker, in
// boot) and a slow gold glow on its top (the pad rings below); both go away once something is built on it.
const PAD = { half: 1.32, mat: null };

function buildPads(B) {
  const pale = C(0xb9ae98), paleD = C(0x8d8472), pave = C(0x39424e), rng = B.rng, h = PAD.half;
  for (const p of B.pads) {
    const T = new Soup(), q = pathNear(B, p.x, p.z, p.s, 30), face = Math.atan2(B.px[q.i] - p.x, B.pz[q.i] - p.z);
    const stone = () => mulC(mixC(pale, paleD, rng() * .5), .92 + .16 * rng());
    T.box(h * 2 + .16, .16, h * 2 + .16, 0, .02, 0, mulC(paleD, .8), { l: L_MASON });                      // footing course
    T.box(h * 2, .3, h * 2, 0, .14, 0, stone(), { l: L_MASON });                                              // the platform
    T.box(h * 2 - .5, .05, h * 2 - .5, 0, .285, 0, pave, { l: L_MASON });                                     // dark paving inside the border
    for (const [sx, sz] of [[1, 0], [-1, 0], [0, 1], [0, -1]])                                                // vermilion border
      T.box(sx ? .2 : h * 2 - .1, .06, sx ? h * 2 - .1 : .2, sx * (h - .16), .3, sz * (h - .16), mulC(COL.lacqL, .9 + .2 * rng()), { l: L_WOOD, emis: .03, jit: 0 });
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) {                                                     // corner stones, low enough to clear every tower
      T.box(.3, .26, .3, sx * (h - .1), .3, sz * (h - .1), stone(), { l: L_MASON });
      T.box(.2, .05, .2, sx * (h - .1), .45, sz * (h - .1), COL.lacq, { l: L_WOOD, emis: .03, jit: 0 });
    }
    T.cyl(.2, .03, 0, .31, 0, COL.brass, { n: 8, l: L_METAL, emis: .02 });                                    // brass boss at the centre
    T.box(.95, .14, .3, 0, .02, h + .15, stone(), { l: L_MASON }); T.box(.95, .1, .26, 0, -.06, h + .4, stone(), { l: L_MASON }); // steps toward the road
    B.put(T, p.x, p.z, { y: p.y0, ry: face, ao: [0, .3, .7] });
  }
}

// A gold frame just inside the vermilion border and a faint wash over the paving, drawn additively so it also blooms a little at night.
function addPadRings(B) {
  const geo = new THREE.BufferGeometry(); // one per board: disposeBoard frees every geometry under the board's group
  {
    const P = [], K = [], o = PAD.half - .3, i = PAD.half - .46, y = .035;
    const quad = (a, b, c, d, k) => { for (const v of [a, b, c, a, c, d]) { P.push(v[0], y, v[1]); K.push(k, k, k); } };
    quad([-o, -o], [-o, o], [-i, i], [-i, -i], 1); quad([-o, o], [o, o], [i, i], [-i, i], 1); quad([o, o], [o, -o], [i, -i], [i, i], 1); quad([o, -o], [-o, -o], [-i, -i], [i, -i], 1);
    quad([-i, -i], [-i, i], [i, i], [i, -i], .1);
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(P), 3)); geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(K), 3));
    if (!PAD.mat) PAD.mat = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.9, 1.3, .5), vertexColors: true, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -4, side: THREE.DoubleSide });
  }
  B.padRings = B.pads.map(p => { const m = new THREE.Mesh(geo, PAD.mat); m.position.set(p.x, p.y, p.z); m.rotation.y = p.face; m.visible = false; m.renderOrder = 5; B.group.add(m); return m; });
}
// Empty bases glow only while a battle is on; brighter while the player is in command, since that is when they are choosing one.
function updatePadRings(B, t) {
  if (!B || !B.padRings) return;
  const on = G.phase === 'play';
  for (let k = 0; k < B.pads.length; k++) B.padRings[k].visible = on && !B.pads[k].tower;
  if (on) PAD.mat.opacity = (UI.manual ? .5 : .32) * (.72 + .28 * Math.sin(t * 2.2));
}
