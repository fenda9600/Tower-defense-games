// The wall garrison and the storming of the pass.
// Enemies that reach the end of the road mass below the wall. They get in by two ways taken from real sieges:
// they batter the gate until it gives, or ladder bearers raise scaling ladders and the foot swarm up them.
// Once on the wall walk they cut down the garrison; with nobody left to stop them they take the city, and that costs the beacon.
// The garrison can be raised a dynasty at a time, and the reinforce skill puts one more man on the wall for a fixed price.
const WALL = {
  name: '城头守军', max: 8, start: 2, addCost: 70, cost: [0, 140, 200, 280],
  range: [5.6, 6.0, 6.5, 7.0], dmg: [7, 9, 11, 14], rate: [1.0, .95, .88, .8], hp: [50, 64, 80, 100],
  tiers: [
    ['秦 · 城上弩卒', '《墨子·备城门》守城之法：城上二步一木弩。'],
    ['汉 · 塞上燧卒', '居延汉简所记戍卒，凭坞壁转射发弩。'],
    ['唐 · 睢阳守卒', '至德二载，张巡、许远以数千人守睢阳十月。'],
    ['宋 · 钓鱼城守军', '钓鱼城坚守三十六年，蒙哥汗殁于城下。'],
  ],
};
// The gate: its strength at each garrison tier, and how hard each kind of attacker hits it per second of battering.
// Rams, elephants and fire do the work; men with blades do little. calm is how long the wall foot must stay clear before repairs start.
const GATE = { hp: [130, 175, 225, 290], rate: 1, calm: 5, mend: .035, shut: .35, burn: 32, weight: { slime: 9, mummy: 3.5, brood: 6, brute: 2.5, golem: 2, wolf: 1.2, giant: 6, ogre: 6, jotun: 7, queen: 8, king: 6, colossus: 5 } };
function gateWeight(m) { const w = GATE.weight[m.type]; return w === undefined ? 1 : w; }
// depth is how far back from the gate the storming party reaches. climb lists who can go up a ladder and how long it takes him.
const SIEGE = { depth: 3.2, ladderFrom: 3, melee: 1.2, climb: { skel: 1.7, knight: 2.2, rat: 1.3, slimelet: 1.7, scarab: 1.5, spider: 1.3, ghoul: .9, toad: 1.1, wraith: 1.6, brute: 2.6, ladder: 1.7 } };

function resetWall() {
  const B = G.B; wallDouse();
  G.wall = { lvl: 0, n: 0, men: [], gate: GATE.hp[0], open: false, calm: 0, dealt: 0, recent: 0, kills: 0, siegeN: 0, stormN: 0, ladderN: 0, lost: 0, raised: 0, topped: 0, breaks: 0, hurtT: 9, cried: false, upI: 0, fallen: false, fires: [], B };
  for (const l of B.ladders) { l.bearer = null; l.user = null; l.cd = 0; l.up = 0; }
  const l0 = B.ladders[0], dx = l0.foot.x - l0.top.x, dz = l0.foot.z - l0.top.z, d = Math.hypot(dx, dz); G.wall.fx = dx / d; G.wall.fz = dz / d;
  for (let i = 0; i < WALL.start; i++) addWallMan(false);
}
// The keep carries four swappable skins (buildKeep): gate shut / stove in, east curtain whole / breached.
function wallLook() {
  const W = G.wall, B = G.B; if (!W || W.B !== B) return;
  const k = B.keepSkin || (B.keepSkin = (B.pieces.find(p => p.kind === 'keep') || { mesh: { children: [] } }).mesh.children); if (k.length < 4) return;
  k[0].visible = !W.open && !W.fallen; k[1].visible = !k[0].visible; k[2].visible = !W.fallen; k[3].visible = W.fallen;
}
function wallDouse() { const W = G.wall; if (!W || !W.fires) return; for (const f of W.fires) removeFlame(f); W.fires.length = 0; }
// The pass is lost: the gate goes in, the east curtain comes down and the last of the garrison with it.
function wallFall() {
  const W = G.wall, B = G.B, g = B.gate, q = B.wallSlots; W.fallen = true; W.open = true; W.gate = 0;
  for (let i = W.men.length - 1; i >= 0; i--) killWallMan(W.men[i], -W.fx, -W.fz);
  const a = q[3], b = q[7], gy = a.y - 3.14; FX.shake = Math.min(1.4, FX.shake + .9); sfx('crumble', a.x, a.z, 1, .2);
  for (let i = 0; i < 7; i++) { const u = i / 6, x = lerp(a.x, b.x, u), z = lerp(a.z, b.z, u); fxDust(x + W.fx * .6, gy + rr(.4, 2.2), z + W.fz * .6, 7, 1.7, { speed: 3.2 }); }
  fxDust(g.x, g.y + .8, g.z, 16, 1.6, { speed: 3 });
  for (const [u, h, size] of [[.3, 1.0, .8], [.62, .8, 1.05], [.9, 1.9, .65]]) W.fires.push(addFlame({ x: lerp(a.x, b.x, u) + W.fx * .25, y: gy + h, z: lerp(a.z, b.z, u) + W.fz * .25, size, layers: 2, embers: 1.6, glow: .9, smoke: 4 }));
  W.fires.push(addFlame({ x: g.x - W.fx * .5, y: g.y + .7, z: g.z - W.fz * .5, size: .9, layers: 2, embers: 1.4, glow: .9, smoke: 3 }));
}
function gateMax() { return GATE.hp[G.wall.lvl]; }
function addWallMan(fx) {
  const W = G.wall, B = G.B; let si = 0; while (W.men.some(a => a.si === si)) si++;
  const sl = B.wallSlots[si]; if (!sl) return null;
  const yaw = Math.atan2(W.fx, W.fz), hp = WALL.hp[W.lvl];
  const man = { si, sl, yaw, home: yaw, draw: 0, cool: .4 + si * .17, appear: fx ? 0 : 1, hp, maxHp: hp, foe: null, atk: -1, struck: false, e: { scale: .82, ph: 0, mv: 0, atk: -1, bow: true, xbow: true, weapon: null, helm: false, hat: null, back: null, draw: 0, pitch: 0, tint: [1, .9, .7], x: sl.x, y: sl.y, z: sl.z, yaw, flash: 0, flinch: 0 } };
  W.men.push(man); W.n = W.men.length;
  if (fx) { fxDust(sl.x, sl.y + .2, sl.z, 6, .7, { speed: 1.6 }); sfx('buildDone', sl.x, sl.z, .7); }
  return man;
}
function wallDps() { const W = G.wall; return W.n * WALL.dmg[W.lvl] / WALL.rate[W.lvl]; }
// The skill: a fixed sum of gold puts one more defender on the wall.
function wallReinforce(byPlayer) {
  const W = G.wall; if (!W || G.phase !== 'play' || W.n >= WALL.max || G.gold < WALL.addCost) return false;
  G.gold -= WALL.addCost; UI.goldShown = Math.min(UI.goldShown, G.gold); addWallMan(true);
  UI.ping(G.B.gate.x, G.B.gate.y, G.B.gate.z, byPlayer); return true;
}
function wallUpgrade(byPlayer) {
  const W = G.wall; if (!W || G.phase !== 'play' || W.lvl >= Math.min(WALL.tiers.length - 1, tierCap())) return false; const c = WALL.cost[W.lvl + 1]; if (G.gold < c) return false;
  G.gold -= c; UI.goldShown = Math.min(UI.goldShown, G.gold); const g0 = gateMax(); W.lvl++; W.gate += gateMax() - g0;
  for (const m of W.men) { const r = m.hp / m.maxHp; m.maxHp = WALL.hp[W.lvl]; m.hp = m.maxHp * Math.max(r, .6); m.appear = .35; fxDust(m.sl.x, m.sl.y + .2, m.sl.z, 5, .6, { speed: 1.4 }); }
  const tr = WALL.tiers[W.lvl]; UI.banner(WALL.name + ' · ' + tr[0], 3.6, false, tr[1]);
  sfx('buildDone', G.B.gate.x, G.B.gate.z, 1); UI.ping(G.B.gate.x, G.B.gate.y, G.B.gate.z, byPlayer); return true;
}
function dressWallMan(e, lvl) {
  // Qin: studded lamellar and topknot. Han: iron helmet. Tang: bright-light armour and the long bow. Song: full infantry armour.
  const I = KIT.item; e.xbow = lvl !== 2; e.helm = lvl === 1 || lvl === 3;
  e.back = lvl === 0 ? I.qinJia : lvl === 2 ? I.mingguang : lvl === 3 ? I.buren : null; e.hat = lvl === 0 ? I.qinBun : lvl === 2 ? I.tangHelm : null;
}
function killWallMan(a, dx, dz) {
  const W = G.wall, i = W.men.indexOf(a); if (i < 0) return; W.men.splice(i, 1); W.n = W.men.length; W.lost++; a.dead = true;
  a.e.bow = false; a.e.weapon = KIT.item.blade; shatter(e => rigHuman(KIT.foot, SPEC.foot, e), a.e, [(dx || 0) * 1.6, .8, (dz || 0) * 1.6], { spread: .9, life: .8 });
  fxDust(a.sl.x, a.sl.y + .1, a.sl.z, 3, .5, { a: .35 }); sfx('footmanDie', a.sl.x, a.sl.z, .9); UI.hurt = Math.max(UI.hurt, .6);
  if (!W.n && !UI.msg) UI.banner('城头失守', 2.4, true, '按 R 增兵夺回城墙');
}
function breakGate() {
  const W = G.wall, B = G.B, g = B.gate; W.gate = 0; W.open = true; W.breaks++; W.calm = 0;
  UI.banner('城门已破', 2.6, true, '敌军涌入，登城杀向守军'); sfx('crumble', g.x, g.z, .7, .3); sfx('hornBoss', g.x, g.z, .7); FX.shake = Math.min(1.2, FX.shake + .8);
  fxDust(g.x, g.y + .8, g.z, 22, 1.8, { speed: 3.6 });
  for (let i = 0; i < 12; i++) { _tm.compose(_tv.set(g.x + rr(-.8, .8), g.y + rr(.3, 2.2), g.z + rr(-.4, .4)), _tq.set(rr(-1, 1), rr(-1, 1), rr(-1, 1), 1).normalize(), _ts.set(1, 1, 1)); addDebris(KIT.plank, _tm, null, rr(-2.5, 2.5) + W.fx * 2, rr(2, 5), rr(-2.5, 2.5) + W.fz * 2, rr(3, 9), rr(2.5, 4)); }
}
// One attacker reaches the wall and joins the assault.
function joinSiege(m) {
  const W = G.wall; m.siege = true; m.foe = null; G.leaks++; G.leakTypes[m.type] = (G.leakTypes[m.type] || 0) + m.def.lives;
  if (!W.cried) { W.cried = true; if (!UI.msg) UI.banner('敌军攻城', 2.2, true, '城头守军放箭御敌'); sfx('hornBoss', G.B.gate.x, G.B.gate.z, .6); }
  // fire-oil men burn the gate
  if (m.def.explode) { m.hp = 0; if (!W.open) { W.gate -= GATE.burn; W.hurtT = 0; if (W.gate <= 0) breakGate(); } FX.shake = Math.min(1, FX.shake + .3); killMonster(m, 'blast', 0, 0, null); }
}
// One blow against the gate.
function siegeStrike(m) {
  const W = G.wall, B = G.B, def = m.def, p = pathAt(B, B.L - .1, _ap), w = gateWeight(m), big = w >= 3;
  if (W.open) return;
  W.gate -= w * GATE.rate * def.atkT; W.hurtT = 0;
  fxDust(m.x + p.tx * (m.rad + .2), m.y + .5, m.z + p.tz * (m.rad + .2), big ? 6 : 2, big ? 1 : .5, { speed: big ? 2.2 : 1.2, a: .4 });
  if (big) { FX.shake = Math.min(1, FX.shake + .25); sfx('hammer', m.x, m.z, 1, .1); sfx('bossStep', m.x, m.z, .6, .4); } else if (rnd() < .5) sfx(def.blade ? 'clash' : 'hammer', m.x, m.z, .45, rnd());
  if (W.gate <= 0) breakGate();
}
// A ladder bearer nearing the wall makes for a free ladder point.
function tryLadder(m) {
  const B = G.B;
  for (const l of B.ladders) if (!l.bearer) { l.bearer = m; l.up = 0; m.ladder = l; m.wallSt = 'toLadder'; m.foe = null; if (!m.siege) { m.siege = true; G.leaks++; } return true; }
  return false;
}
function dropLadder(l) {
  const u = l.user; l.bearer = null; l.up = 0; l.user = null;
  if (u && !u.dead) { if (u.wallSt === 'climb') { u.hp = 0; killMonster(u, 'blast', G.wall.fx, G.wall.fz, G.wall); } else { u.wallSt = null; u.ladder = null; } }
}
// No defender bars the way: he is into the city.
function breach(m) { leak(m); }
function stormMove(m, tx, tz, dt, speed) {
  const dx = tx - m.x, dz = tz - m.z, d = Math.hypot(dx, dz), st = Math.min(d, speed * dt);
  if (d > 1e-4) { m.vx = dx / d * speed; m.vz = dz / d * speed; m.x += dx / d * st; m.z += dz / d * st; m.yaw = angDamp(m.yaw, Math.atan2(dx, dz), 10, dt); }
  m.ph += st * 5.6 / (m.scale || 1); m.mv = damp(m.mv, d > .05 ? 1 : 0, 10, dt); return d - st;
}
// A monster that has left the road: carrying or holding a ladder, climbing one, going in by the broken gate, or fighting on the wall walk.
function updateStormer(m, dt) {
  const W = G.wall, B = G.B, def = m.def, st = m.wallSt, sp = def.spd * m.spdMul * (1 - m.slowF), l = m.ladder;
  m.vx = m.vz = 0; m.prog = 1; m.vis = true; m.cd -= dt;
  if (st === 'toLadder') { m.y = B.heightAt(m.x, m.z) + .02; if (stormMove(m, l.foot.x + W.fx * .3, l.foot.z + W.fz * .3, dt, sp) < .08) { m.wallSt = 'raise'; sfx('hammer', m.x, m.z, .6, .6); } }
  else if (st === 'raise' || st === 'hold') { m.mv = damp(m.mv, 0, 10, dt); m.yaw = angDamp(m.yaw, Math.atan2(-W.fx, -W.fz), 8, dt); if (st === 'raise') { l.up = Math.min(1, l.up + dt / 1.3); if (l.up >= 1) { m.wallSt = 'hold'; W.raised++; fxDust(l.top.x, l.top.y + .3, l.top.z, 4, .5, { a: .4 }); } } }
  else if (st === 'toFoot') { m.y = B.heightAt(m.x, m.z) + .02; if (stormMove(m, l.foot.x, l.foot.z, dt, sp * 1.2) < .08) { m.wallSt = 'climb'; m.climb = 0; } }
  else if (st === 'climb') {
    m.climb += dt / SIEGE.climb[m.type] * (1 - m.slowF * .6); const u = sat(m.climb), y0 = B.heightAt(l.foot.x, l.foot.z);
    m.x = lerp(l.foot.x, l.top.x, u); m.z = lerp(l.foot.z, l.top.z, u); m.y = lerp(y0, l.top.y, u); m.yaw = Math.atan2(-W.fx, -W.fz); m.ph += dt * 9; m.mv = 1;
    if (u >= 1) { m.wallSt = 'wall'; W.topped++; l.user = null; l.cd = .7; m.wfoe = null; }
  }
  else if (st === 'toDoor') { m.y = B.heightAt(m.x, m.z) + .02; if (stormMove(m, B.wallIn.door.x, B.wallIn.door.z, dt, sp * 1.3) < .15) { m.wallSt = 'inside'; m.inT = 1.3; } }
  else if (st === 'inside') {
    m.y = -60; m.vis = false; m.inT -= dt;
    if (m.inT <= 0) { if (SIEGE.climb[m.type] && W.n) { const up = B.wallIn.up[W.upI++ % B.wallIn.up.length]; m.x = up.x; m.z = up.z; m.y = up.y; m.wallSt = 'wall'; W.topped++; m.wfoe = null; m.vis = true; fxDust(m.x, m.y + .2, m.z, 3, .5, { a: .35 }); } else breach(m); }
  }
  else if (st === 'wall') {
    let a = m.wfoe; if (a && a.dead) a = m.wfoe = null;
    if (!a) { let bd = 1e9; for (const q of W.men) { const d = dist2(m.x, m.z, q.sl.x, q.sl.z); if (d < bd) { bd = d; a = q; } } m.wfoe = a; }
    if (!a) { m.idleT = (m.idleT || 0) + dt; m.mv = damp(m.mv, 0, 8, dt); if (m.idleT > .9) breach(m); return; }
    m.idleT = 0; m.y = a.sl.y;
    const d = stormMove(m, a.sl.x + W.fx * .42, a.sl.z + W.fz * .42, dt, sp * 1.1);
    if (d < .25) {
      if (!a.foe || a.foe.dead) a.foe = m; m.yaw = angDamp(m.yaw, Math.atan2(a.sl.x - m.x, a.sl.z - m.z), 10, dt);
      if (m.atk >= 0) {
        m.atk += dt / def.atkT * 1.7;
        if (m.atk >= .5 && !m.struck) { m.struck = true; a.hp -= Math.max(3, def.dmg) * G.dmgMul * SIEGE.melee; a.e.flash = 1; a.e.flinch = 1; fxSparks(a.sl.x, a.sl.y + .9, a.sl.z, 4, 3, 3, 2.3, 1.3, { size: .055, grav: 7 }); sfx(rnd() < .5 ? 'clash' : 'slash', m.x, m.z, .6, rnd()); if (a.hp <= 0) { killWallMan(a, -W.fx, -W.fz); m.wfoe = null; } }
        if (m.atk >= 1) { m.atk = -1; m.cd = def.atkT * rr(.35, .5); }
      } else if (m.cd <= 0) { m.atk = 0; m.struck = false; }
    }
  }
}
const _wc = [], _wp = { x: 0, y: 0, z: 0, tx: 0, tz: 0 }, _wq = new THREE.Quaternion(), _wy = new THREE.Vector3(0, 1, 0), _wd = new THREE.Vector3();
const STORM_SC = { wall: 9, climb: 8, hold: 7, raise: 7, toLadder: 6.5, toFoot: 6, toDoor: 5 };
function updateWall(dt) {
  const W = G.wall, B = G.B; if (!W) return;
  if (G.phase === 'defeat' && !W.fallen && W.B === B) wallFall();
  wallLook();
  const lvl = W.lvl, r2 = WALL.range[lvl] * WALL.range[lvl], gx = B.gate.x, gz = B.gate.z, play = G.phase === 'play', gateS = B.L - .35;
  W.recent = Math.max(0, W.recent - dt * .25); W.hurtT += dt;
  // ladders stand while their bearers live; each sends up one man at a time
  W.ladderN = 0;
  for (const l of B.ladders) {
    if (l.bearer && (l.bearer.dead || l.bearer.hp <= 0)) dropLadder(l);
    if (l.user && (l.user.dead || l.user.hp <= 0)) { l.user = null; l.cd = .4; }
    if (!l.bearer) continue; W.ladderN++; l.cd -= dt;
    if (play && l.bearer.wallSt === 'hold' && !l.user && l.cd <= 0) {
      let best = null, bs = 1e9;
      for (const m of G.mons) { if (m.dead || m.hp <= 0 || !m.siege || m.wallSt || m.foe || !SIEGE.climb[m.type]) continue; const sc = dist2(m.x, m.z, l.foot.x, l.foot.z) - (m.type === 'ghoul' ? 30 : 0); if (sc < bs) { bs = sc; best = m; } }
      if (best) { best.wallSt = 'toFoot'; best.ladder = l; l.user = best; }
      // Nobody is left to send up: once every enemy still alive is only holding a ladder, the bearers climb their own.
      // Without this a wave whose last men were ladder bearers out of the garrison's reach (or with the garrison dead) never ended.
      l.idle = !best && G.mons.every(m => m.dead || m.hp <= 0 || m.wallSt === 'hold' || m.wallSt === 'raise') ? (l.idle || 0) + dt : 0;
      if (l.idle > 6) { l.idle = 0; const b = l.bearer; b.wallSt = 'toFoot'; l.user = b; }
    }
    // the ladder itself, swinging up against the wall as it is raised
    if (l.bearer.wallSt === 'toLadder') continue;
    const y0 = B.heightAt(l.foot.x, l.foot.z), u = easeInOut(l.up);
    _wd.set(lerp(W.fx * .9, l.top.x - l.foot.x, u), lerp(.5, l.top.y + .5 - y0, u), lerp(W.fz * .9, l.top.z - l.foot.z, u)).normalize();
    _wq.setFromUnitVectors(_wy, _wd); KIT.item.ladder.put(_tm.compose(_tv.set(l.foot.x, y0, l.foot.z), _wq, _ts.set(1, 1, 1)), 0, null);
  }
  // the gate: open, everyone at its foot goes in; quiet, the garrison mends it
  W.siegeN = 0; W.stormN = 0; _wc.length = 0;
  for (const m of G.mons) {
    if (m.dead || m.hp <= 0 || m.dying) continue;
    if (m.siege) W.siegeN++; if (m.wallSt === 'wall' || m.wallSt === 'climb') W.stormN++;
    if (play && W.open && m.siege && !m.wallSt && !m.foe && m.s > gateS - 1.3) { m.wallSt = 'toDoor'; m.atk = -1; }
    if (!play || !m.vis || m.wallSt === 'inside' || dist2(gx, gz, m.x, m.z) > r2) continue;
    m._wsc = (m.wallSt ? STORM_SC[m.wallSt] || 5 : m.siege ? 4 + gateWeight(m) * .1 : m.def.ladder ? 3 : 0) + (m.fly ? 2 : 0) + m.prog - (m.eth ? 3 : 0); _wc.push(m);
  }
  if (play) {
    if (W.siegeN) W.calm = 0; else W.calm += dt;
    if (W.calm > GATE.calm && W.gate < gateMax()) { W.gate = Math.min(gateMax(), W.gate + gateMax() * GATE.mend * dt); if (W.open && W.gate >= gateMax() * GATE.shut) { W.open = false; if (!UI.msg) UI.banner('城门修复', 2, false); sfx('buildDone', gx, gz, .8); } }
  }
  _wc.sort((a, b) => b._wsc - a._wsc);
  const spread = Math.min(_wc.length, Math.max(1, Math.ceil(W.n / 3))), calm = !W.stormN;
  W.men.forEach((a, i) => {
    const e = a.e, sl = a.sl; let foe = a.foe; if (foe && (foe.dead || foe.hp <= 0 || foe.wallSt !== 'wall' || foe.wfoe !== a)) foe = a.foe = null;
    const tgt = foe ? null : spread ? _wc[i % spread] : null;
    a.appear = Math.min(1, a.appear + dt * 2.2); a.cool -= dt; dressWallMan(e, lvl); e.flash = Math.max(0, e.flash - dt * 7); e.flinch = Math.max(0, e.flinch - dt * 4.5);
    if (calm && a.hp < a.maxHp) a.hp = Math.min(a.maxHp, a.hp + a.maxHp * .04 * dt);
    e.x = sl.x; e.z = sl.z; e.y = sl.y - (1 - easeOut(a.appear)) * .5; e.scale = .82 * (.3 + .7 * a.appear); e.bow = !foe; e.weapon = foe ? KIT.item.blade : null; e.atk = -1;
    if (foe) {
      // hand to hand on the wall walk
      const dx = foe.x - sl.x, dz = foe.z - sl.z, d = Math.hypot(dx, dz) || 1; a.yaw = angDamp(a.yaw, Math.atan2(dx, dz), 12, dt); a.draw = 0;
      if (a.atk >= 0) { a.atk += dt / .58; if (a.atk >= .5 && !a.struck) { a.struck = true; fxSparks(foe.x, foe.y + .9, foe.z, 3, 3.2, 3, 2.3, 1.2, { size: .055, grav: 7 }); sfx(foe.def.armor ? 'clash' : 'slash', sl.x, sl.z, .6, rnd()); hitMonster(foe, WALL.dmg[lvl] * 1.25, 'sword', dx / d, dz / d, W); } if (a.atk >= 1) { a.atk = -1; a.cool = WALL.rate[lvl] * .5; } }
      else if (a.cool <= 0) { a.atk = 0; a.struck = false; }
      e.atk = a.atk;
    } else if (tgt) {
      const T = clamp(Math.hypot(tgt.x - sl.x, tgt.z - sl.z) / 14, .22, .62), q = aimPoint(tgt, T, _wp);
      a.yaw = angDamp(a.yaw, Math.atan2(q.x - sl.x, q.z - sl.z), 12, dt); a.atk = -1;
      e.pitch = clamp(Math.atan2(q.y - (sl.y + 1), Math.hypot(q.x - sl.x, q.z - sl.z)) * .7 + .2, -.7, .6);
      a.draw = a.cool < .34 ? Math.min(1, a.draw + dt * 3.6) : Math.max(0, a.draw - dt * 6);
      if (a.cool <= 0 && a.draw > .95) {
        a.cool = WALL.rate[lvl] * rr(.9, 1.12); a.draw = 0;
        shootArrow(sl.x + Math.sin(a.yaw) * .3, sl.y + 1.0, sl.z + Math.cos(a.yaw) * .3, tgt, WALL.dmg[lvl], W);
        sfx('bow', sl.x, sl.z, .5, rnd());
      }
    } else { a.atk = -1; a.draw = Math.max(0, a.draw - dt * 3); a.yaw = angDamp(a.yaw, a.home + Math.sin(G.t * .5 + a.si * 1.7) * .5, 2, dt); e.pitch = damp(e.pitch, 0, 4, dt); if (a.cool < .3) a.cool = .3; }
    e.yaw = a.yaw; e.draw = a.draw;
    rigHuman(KIT.foot, SPEC.foot, e);
    if (a.hp < a.maxHp) G.hbars.push({ x: sl.x, y: sl.y + 1.35, z: sl.z, f: sat(a.hp / a.maxHp), boss: false, man: true });
  });
  if (play && (W.open || W.gate < gateMax()) && (W.siegeN || W.open || W.hurtT < 4)) G.hbars.push({ x: gx, y: B.gate.y + 7.2, z: gz, f: sat(W.gate / gateMax()), boss: true, man: false, name: W.open ? '城门已破' : '城门 ' + Math.ceil(W.gate) });
}
