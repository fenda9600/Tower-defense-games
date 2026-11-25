
const CAM = { yaw: PI / 4, elev: 38 * PI / 180, dist: 90, x: 0, y: 0, z: 0, zoom: 1, fx: 0, fz: 0, sx: 0, sz: 0 };
const _cr = new THREE.Vector3(), _cu = new THREE.Vector3(), _cd = new THREE.Vector3(), _ct = new THREE.Vector3();
function applyCamera() {
  const cam = R.cam, e = CAM.elev, sy = Math.sin(CAM.yaw), cy = Math.cos(CAM.yaw);
  _cd.set(Math.cos(e) * sy, Math.sin(e), Math.cos(e) * cy); _cr.set(cy, 0, -sy); _cu.set(-Math.sin(e) * sy, Math.cos(e), -Math.sin(e) * cy);
  const aspect = R.dw / R.dh, base = Math.max(R.viewH, R.fitW / aspect), vh = base / CAM.zoom;
  R.px = vh / R.ih; R.viewW = vh * aspect; R.viewHNow = vh;
  _ct.set(CAM.x, CAM.y, CAM.z).addScaledVector(_cr, FX.shakeX).addScaledVector(_cu, FX.shakeY - R.shiftY);
  const u = _ct.dot(_cr), v = _ct.dot(_cu), us = Math.round(u / R.px) * R.px, vs = Math.round(v / R.px) * R.px;
  R.sub.set((u - us) / R.px, (v - vs) / R.px);
  R.ditherOfs.set(((Math.round(us / R.px) % 8) + 8) % 8, ((Math.round(vs / R.px) % 8) + 8) % 8);
  _ct.addScaledVector(_cr, us - u).addScaledVector(_cu, vs - v);
  cam.left = -vh * aspect / 2; cam.right = vh * aspect / 2; cam.top = vh / 2; cam.bottom = -vh / 2; cam.near = 1; cam.far = 210;
  cam.position.copy(_ct).addScaledVector(_cd, CAM.dist); cam.up.set(0, 1, 0); cam.lookAt(_ct);
  cam.updateProjectionMatrix(); cam.updateMatrixWorld(true);
}
// Player camera. du / dv are world units along the screen's right and up; up is stretched onto the ground by the camera's tilt.
CAM.pan = { on: false, x: 0, z: 0, tx: 0, tz: 0, zoom: 1, zoomT: 0, keys: {}, drag: null };
function camPan(du, dv) {
  const P = CAM.pan, sy = Math.sin(CAM.yaw), cy = Math.cos(CAM.yaw), g = dv / Math.sin(CAM.elev), lim = BH - 4;
  if (!P.on) { P.on = true; P.x = P.tx = CAM.x; P.z = P.tz = CAM.z; }
  P.tx = clamp(P.tx + cy * du - sy * g, -lim, lim); P.tz = clamp(P.tz - sy * du - cy * g, -lim, lim);
}
function camZoom(f) { const P = CAM.pan; P.zoom = clamp(P.zoom * f, .45, 2.2); P.zoomT = .5; }
function camReset() { const P = CAM.pan; if (P.on) { CAM.sx = CAM.fx = P.x; CAM.sz = CAM.fz = P.z; } P.on = false; P.zoom = 1; P.zoomT = .5; }
function initCamControl() {
  const P = CAM.pan, KEY = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down' };
  const typing = e => e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA');
  window.addEventListener('keydown', e => { if (typing(e) || e.ctrlKey || e.metaKey || e.altKey) return; if (KEY[e.key]) { P.keys[KEY[e.key]] = true; e.preventDefault(); } else if (e.key === '0' || e.key === 'Home') camReset(); });
  window.addEventListener('keyup', e => { if (KEY[e.key]) P.keys[KEY[e.key]] = false; });
  window.addEventListener('blur', () => { P.keys = {}; P.drag = null; });
  window.addEventListener('wheel', e => { if (typing(e)) return; camZoom(Math.exp(-clamp(e.deltaY, -240, 240) * .0016)); e.preventDefault(); }, { passive: false });
  // drag with the right or middle button to move the view
  window.addEventListener('pointerdown', e => { if (e.button === 1 || e.button === 2) { P.drag = [e.clientX, e.clientY]; e.preventDefault(); } }, { passive: false });
  window.addEventListener('pointermove', e => { if (!P.drag) return; const k = (R.viewHNow || 30) / window.innerHeight; camPan(-(e.clientX - P.drag[0]) * k, (e.clientY - P.drag[1]) * k); P.x = P.tx; P.z = P.tz; P.drag = [e.clientX, e.clientY]; });
  window.addEventListener('pointerup', () => { P.drag = null; });
}
function updateCamera(dt) {
  const B = G.B; let wx = 0, wz = 0, ws = 7, boss = false;
  if (G.phase === 'play' || G.phase === 'defeat') {
    for (const m of G.mons) {
      if (m.dead || (!m.vis && !m.fly)) continue;
      let w = 1 + 2.5 * m.prog; if (m.foe || m.siege) w *= 2.4; if (m.flash > 0) w *= 1.5; if (m.def.boss) { w *= 16; boss = true; }
      wx += m.x * w; wz += m.z * w; ws += w;
    }
    for (const t of G.towers) if (t.recent > 5) { const w = Math.min(4, t.recent / 20); wx += t.x * w; wz += t.z * w; ws += w; }
  }
  let tx = wx / ws, tz = wz / ws; const l = Math.hypot(tx, tz), lim = 6.5 + (BH - 18) * 1.2; if (l > lim) { tx *= lim / l; tz *= lim / l; }
  const away = G.phase === 'clear' || G.phase === 'crumble' || G.phase === 'rise';
  if (away) { tx = 0; tz = 0; }
  CAM.fx = damp(CAM.fx, tx, .9, dt); CAM.fz = damp(CAM.fz, tz, .9, dt);
  CAM.sx = damp(CAM.sx, CAM.fx, .8, dt); CAM.sz = damp(CAM.sz, CAM.fz, .8, dt);
  CAM.x = CAM.sx; CAM.z = CAM.sz;
  let zt = away ? .62 / LIN : (G.phase === 'defeat' ? .92 : (boss ? 1.14 : 1));
  // the player's own view: a pan holds the camera where they left it until 0 hands it back to the action; the wheel zooms either way
  const P = CAM.pan; if (away && P.on) { P.on = false; P.zoom = 1; }
  if (!away) {
    const mv = (R.viewHNow || 30) * 1.1 * R.frameDt, kx = (P.keys.right ? 1 : 0) - (P.keys.left ? 1 : 0), ky = (P.keys.up ? 1 : 0) - (P.keys.down ? 1 : 0);
    if (kx || ky) camPan(kx * mv, ky * mv);
    if (P.on) { CAM.x = P.x = damp(P.x, P.tx, 14, R.frameDt); CAM.z = P.z = damp(P.z, P.tz, 14, R.frameDt); }
    zt *= P.zoom;
  }
  CAM.zoom = damp(CAM.zoom, zt, zt < CAM.zoom ? 1.1 : .7, P.zoomT > 0 ? R.frameDt * 9 : dt); P.zoomT = Math.max(0, P.zoomT - R.frameDt);
  CAM.y = damp(CAM.y, away ? -2.2 : .4, 1, dt);
  const lk = window.__cw && window.__cw.lock; if (lk) { CAM.x = lk[0]; CAM.z = lk[1]; CAM.zoom = lk[2] || 1; if (lk[3]) CAM.y = lk[3]; }
}

function sfx(name, x, z, gain = 1, p = 0) {
  if (!AU.ready) return;
  const dx = x - CAM.x, dz = z - CAM.z, u = dx * Math.cos(CAM.yaw) - dz * Math.sin(CAM.yaw);
  AU.play(name, clamp(u / ((R.viewW || 40) * .5), -1, 1) * .75, gain * clamp(1.12 - Math.hypot(dx, dz) / (46 * LIN), .4, 1) * (.72 + .28 * CAM.zoom), p);
}

const _mm = new THREE.Matrix4(), _mq = new THREE.Quaternion(), _mv = new THREE.Vector3(), _ms = new THREE.Vector3(1, 1, 1), _torch = [];
function step(rdt, quiet) {
  G.slowmo = Math.max(0, G.slowmo - rdt);
  const dt = rdt * (G.slowmo > 0 ? lerp(1, .32, sat(G.slowmo / .35)) : 1);
  G.t += dt; SH.uTime.value = G.t;
  const B = G.B;
  beginParts(); G.hbars.length = 0;
  updateFX(dt, G.t);
  const live = G.phase === 'play' || G.phase === 'defeat' || G.phase === 'clear';
  if (live) {
    updateWaves(dt); aiThink(dt);
    for (const t of G.towers) if (t.alive) t.update(dt);
    updateWall(dt);
    updateUnits(dt);
    for (let i = G.mons.length - 1; i >= 0; i--) if (G.mons[i].dead) swapRemove(G.mons, i);
    updateProjectiles(dt); updateRaid(dt);
    for (const m of G.mons) drawMonster(m, G.t);
    for (const f of G.men) if (!f.dead) drawFootman(f);
    if (G.phase === 'play') for (const p of B.pads) if (!p.tower) { _mm.compose(_mv.set(p.x, p.y, p.z), _mq.setFromAxisAngle(_upv, CAM.yaw), _ms); KIT.marker.put(_mm, 0, null); }
    updatePadRings(B, G.t);
  }
  const spray = B.bio.spray;
  if (live && B.fallAt && spray === 'lava') {
    const f = B.fallAt, ax = Math.abs(f.oz), az = Math.abs(f.ox);
    if (rnd() < dt * 9) { const tau = rr(.1, 1.1), o = f.ext + f.v0 * tau, sd = rr(-.8, .8) * f.w; fxPart(f.x + f.ox * o + ax * sd, f.y - 4.5 * tau * tau, f.z + f.oz * o + az * sd, f.ox * rr(.2, 1.2) + rr(-.4, .4), rr(.2, 1.6), f.oz * rr(.2, 1.2) + rr(-.4, .4), rr(.6, 1.3), rr(.045, .075), rr(1.8, 3), rr(.6, 1.1), .12, { grav: 2.5, drag: .4, wob: 1 }); }
    if (rnd() < dt * 5) { const tau = rr(.5, 1.2), o = f.ext + f.v0 * tau, sd = rr(-.7, .7) * f.w; fxSmoke(f.x + f.ox * o + ax * sd, f.y - 4.5 * tau * tau, f.z + f.oz * o + az * sd, f.ox * rr(.1, .4), rr(.5, 1.3), f.oz * rr(.1, .4), rr(1.6, 2.8), rr(.4, .7), 1.1, .16, .12, .11, .3, { drag: .5, rise: .2 }); }
  }
  if (live && B.fallAt && spray === 'water') {
    const f = B.fallAt, ax = Math.abs(f.oz), az = Math.abs(f.ox);
    if (rnd() < dt * 16) { const tau = rr(.7, 1.25), o = f.ext + f.v0 * tau, d = 4.5 * tau * tau, sd = rr(-.8, .8) * f.w; fxSmoke(f.x + f.ox * o + ax * sd, f.y - d, f.z + f.oz * o + az * sd, f.ox * rr(.1, .5), rr(-1.6, -.6), f.oz * rr(.1, .5), rr(.9, 1.7), rr(.3, .5), .8, .9, 1.15, 1.5, .14, { drag: .5 }); }
    if (rnd() < dt * 16) { const tau = rr(.05, .5), o = f.ext + f.v0 * tau, sd = rr(-.9, .9) * f.w; fxPart(f.x + f.ox * o + ax * sd, f.y - 4.5 * tau * tau, f.z + f.oz * o + az * sd, f.ox * rr(.8, 1.6) + rr(-.3, .3), rr(-1, .6) - 9 * tau, f.oz * rr(.8, 1.6) + rr(-.3, .3), rr(.5, .9), rr(.04, .065), .3, .42, .62, { grav: 9, drag: .2 }); }
  }
  updateDebris(dt, FX.groundAt, d => { UI.coinFrom(d.p.x, d.p.y, d.p.z, d.value || 0); fxTimed(5, d.p.x, d.p.y, d.p.z, .5, .5, 2.4, 1.8, .6, .8, .12); });
  updatePhase(dt);
  updateCamera(dt);
  updateLights(dt, G.t, CAM.x, CAM.z);
  _torch.length = 0;
  for (const m of G.mons) if ((m.torch || m.glowL) && !m.dead && m.vis) _torch.push(m);
  for (const f of G.men) if (f.torch && !f.dead) _torch.push(f);
  for (const a of G.arrows) _torch.push(a);
  updateTorchLights(dt, _torch, CAM.x, CAM.z);
  collectMistLights();
  endParts(); endFX();
  if (quiet) return; // a fast-forward substep: the HUD and the sound mix advance once per real frame
  UI.update(rdt);
  if (AU.ready) { let lit = 0; for (const t of G.towers) if (t.alive && t.em.on > .5 && t.kind !== 'spire') lit++; AU.setAmbience(sat((.3 + lit * .06) * LT.beaconOn + .05), sat((G.phase === 'play' ? .5 : .85) * B.bio.wind), G.bossAlive && G.phase === 'play' ? 1 : 0); AU.update(rdt); }
}

let _last = 0, _acc = 0, _frames = 0, _slow = 0, _fast = 0, _hold = 0, _back = 12;
function frame(now) {
  requestAnimationFrame(frame);
  const raw = (now - _last) / 1000, rdt = Math.min(.05, Math.max(.001, raw)); _last = now; R.frameDt = rdt;
  // fast-forward: run extra fixed-size substeps instead of a bigger dt, so collisions, the wall garrison and the AI see the same steps as at 1x
  const n = G.speed > 1 ? G.speed : 1; for (let i = 1; i < n; i++) step(rdt, true);
  step(rdt);
  R.fade = Math.min(1, R.fade + rdt * 1.6);
  applyCamera(); renderFrame(); UI.draw();
  if (document.hidden || raw > .25) { _acc = 0; _frames = 0; return; }
  _acc += raw; _frames++;
  if (_acc >= 2) {
    const ms = _acc / _frames * 1000;
    R.fpsText = (1000 / ms).toFixed(0) + ' fps  ' + R.iw + 'x' + R.ih + '  calls ' + R.renderer.info.render.calls + '  mons ' + G.mons.length;
    if (ms > 22.5) { _slow++; _fast = 0; } else { _slow = 0; _fast = ms < 18.6 ? _fast + 1 : 0; }
    _hold -= _acc;
    if (!HASH.noscale) {
      if (_slow >= 2 && R.quality > .55) { R.quality = Math.max(.55, R.quality - .15); resizeRenderer(); _slow = 0; _hold = _back; _back = Math.min(480, _back * 2); }
      else if (_fast >= 3 && R.quality < 1 && _hold <= 0) { R.quality = Math.min(1, R.quality + .15); resizeRenderer(); _fast = 0; }
    }
    _acc = 0; _frames = 0;
  }
}

function boot() {
  initRenderer(); initMaterials(); resizeRenderer(); initLights(); initFX(); initWeather(); initKits(); UI.init(); initCamControl();
  // the flag on an empty tower base: a tall pole with an apricot-yellow pennant, bright against every battlefield
  KIT.marker = new PartBatch(S => { S.box(.07, 1.6, .07, 0, .8, 0, COL.wood, { l: L_WOOD }); S.cone(.07, .14, 0, 1.67, 0, COL.brass, { n: 4, l: L_METAL, emis: .05 }); const y = C(0xf0b83a); for (let k = 0; k < 4; k++) S.box(.17, .46 - k * .09, .025, .12 + k * .17, 1.33, 0, k === 1 ? COL.lacqL : y, { l: L_CLOTH, emis: .1, jit: 0, sway: .1 + k * .12 }); }, PADS_MAX + 4, { rad: .1 });
  G.boardSeed = HASH.seed ? +HASH.seed : 1 + Math.floor(Math.random() * 9000);
  // the campaign resumes at the battlefield it was left on; #level=N or a fixed #seed starts where told, #reset wipes the record
  { const sv = campaignLoad(); G.level = HASH.level !== undefined ? +HASH.level : sv && isFinite(sv.level) ? Math.max(0, sv.level | 0) : 0; }
  // #biome=<key|name|campaign position> previews one battlefield without changing the level
  { const ks = CAMPAIGN.order, bn = BIOMES.find(b => b.key === HASH.biome || b.name === String(HASH.biome)), bi = bn ? ks.indexOf(bn.key) : HASH.biome !== undefined && isFinite(+HASH.biome) ? +HASH.biome : -1; BIOME.start = bi >= 0 ? bi - G.level : 0; }
  const B = G.B = buildBoard(G.boardSeed++, G.level);
  R.scene.add(B.group); activateBoard(B, true);
  beginBattle(true);
  window.addEventListener('resize', resizeRenderer);
  window.__cw = { CAMPAIGN, G, R, CAM, UI, LT, FX, AI, PX, MON, LOOK, KIT, buildTower, upgradeTower, wallReinforce, wallUpgrade, WALL, RAID, rebuildTower, damageTower, SIEGE, GATE, ROSTER, TOWER, step, setPhase, spawnMonster, hitMonster, MAT, tick(dt, render) { R.frameDt = dt; step(dt); R.fade = 1; applyCamera(); if (render) renderFrame(); UI.draw(); }, bench(n = 40) { const gl = R.renderer.getContext(), px = new Uint8Array(4); applyCamera(); renderFrame(); gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px); const t0 = performance.now(); for (let i = 0; i < n; i++) { applyCamera(); renderFrame(); gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px); } return +((performance.now() - t0) / n).toFixed(2); }, build(i, kind, lvl) { const pad = G.B.pads[i]; if (pad.tower) return; G.gold += 999; const t = buildTower(pad, kind, false); for (let k = 0; k < 90; k++) step(1 / 30); for (let l = 0; l < (lvl || 0); l++) { G.gold += 999; upgradeTower(t); for (let k = 0; k < 90; k++) step(1 / 30); } return t.kind + t.lvl; } };
  if (HASH.k) G.k = +HASH.k;
  if (HASH.ff) { const n = Math.round(+HASH.ff * 30); for (let i = 0; i < n; i++) step(1 / 30); CAM.sx = CAM.fx; CAM.sz = CAM.fz; R.fade = 1; }
  if (HASH.phase) setPhase(HASH.phase);
  if (HASH.cam) { const c = HASH.cam.split(',').map(Number); window.__cw.lock = c; }
  if (HASH.manual) return;
  _last = performance.now();
  requestAnimationFrame(frame);
}
boot();
