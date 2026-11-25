// How the enemy host goes about its attack.
// 1. A vanguard goes ahead of every storming column: picked foot who leave the road to fire the works beside it, and outriders who shoot at them from the saddle.
// 2. Now and then a party leaves the road altogether, comes in over the edge of the field by a side track and falls on the road far behind the forward works.
// 3. On the chief's wave the host first musters at the mouth of its camp and then comes on all at once: the general assault.
// 4. When the chief comes within shot of the wall he calls up the three armies, and a fresh host with ladders appears behind him to storm it.
// 5. An enemy who kills is promoted: after enough kills he gains a rank, and with it health, a harder blow and a pennant on his back.
// Everything here is rules and numbers; the other files only carry one-line hooks (foeWave, foeSpawn, foeThink, updateRover, foeKill, foeUpdate, foeReset).
const FOE = {
  // the vanguard. lead: how long it goes ahead of the column. cost and paid: how much of the wave's budget it takes the place of.
  // picked: [base, per two waves, per two battlefields (at most 2)]. riders likewise, from the second wave on.
  van: { lead: 6, cost: { picked: 6, lanzi: 7 }, paid: .7, perWork: 2 },
  // a flank raid. from: first wave it may happen on; chance grows with the battlefield. span: where along the road it comes out, as a share of its length.
  // len: how long the side track may be. warn: seconds between the alarm and the first man over the edge. pace: speed off the road.
  sneak: { from: 2, chance: .3, perLevel: .04, max: .5, span: [.4, .72], len: [6, 22], warn: 3.5, pace: .9, gap: .5 },
  // the muster. budget: the chief's column against an ordinary wave (it used to be .7). span: how long the host takes to form up; wait: the pause before it moves.
  // line: how far out of the camp the front rank stands. surge: the pace of the first rush and how long it lasts.
  muster: { budget: .8, span: 9, wait: 2.5, bossAt: .45, line: 5.2, surge: 1.25, surgeT: 5 },
  // the call to the three armies. trickle: how many parties still follow the chief up the road (it used to be 9). budget: the size of the host he calls, per battlefield.
  // chief: his health against what it used to be, so that he lives to see the wall. stand: how long at most he holds back and directs the storm before going in himself.
  call: { trickle: 3, budget: [24, 7], halt: 1.8, hp: 1.5, chief: 1.8, stand: 26, alarm: .8 },
  // promotion. need: kills for each rank; a ruined work counts as `work` kills. Each rank adds hp and dmg (shares of the base) and a little size.
  rank: { need: [1, 3, 6], names: ['什长', '百长', '千长'], hp: .3, dmg: .25, size: .07, work: 2, tint: [[.8, .5, .3], [.85, .85, .9], [1.5, 1.15, .3]] },
  st: { muster: false, musterAt: -1, releaseAt: -1, sneak: null, ruins: 0, sneaks: 0, calls: 0, promos: 0, van: 0, bossAt: 0 },
  flag: null,
};

Object.assign(MON, {
  // README.md gives the source for each
  picked: { name: '选锋', en: 'Picked vanguard', hp: 46, spd: 1.75, rad: .27, mass: 1, bounty: 7, lives: 1, hitH: .75, top: 1.5, dmg: 9, atkT: .8, scale: 1, death: 'man', blade: true, sap: { dmg: 5, reach: 4.8, blows: 8 } },
  lanzi: { name: '拦子马', en: 'Liao outrider', hp: 42, spd: 2.3, rad: .32, mass: .9, bounty: 8, lives: 1, hitH: 1.0, top: 2.0, dmg: 9, atkT: .75, scale: .9, death: 'horse', gait: 3.2, cat: 'swarm', blade: true, harass: { range: 5.2, dmg: 4.5, every: 2.3, slow: .85 } },
});
RIGS.picked = m => { m.weapon = KIT.item.dao; m.hat = KIT.item.ironCap; return rigHuman(KIT.foe, SPEC.foot, m); };
RIGS.lanzi = m => { m.weapon = KIT.item.saber; m.hat = KIT.item.furHat; m.riderKit = KIT.hu; return rigHorse(m); };
SIEGE.climb.picked = 1.2; GATE.weight.lanzi = 1.2; STORM_SC.rove = 1.5;

function foeReset() { const st = FOE.st; st.muster = false; st.musterAt = st.releaseAt = -1; st.sneak = null; st.ruins = st.sneaks = st.calls = st.promos = st.van = 0; st.bossAt = 0; }

// Who goes ahead of wave k on this battlefield. No dice here: buildWave charges the column for them before it is drawn up.
function foeVan(k, level) {
  const ez = campaignEase(level)[0], out = [];
  const nL = k >= 2 ? Math.max(1, Math.round(((k >> 1) + Math.min(1, level >> 2)) * ez)) : 0, nP = Math.max(1, Math.round((1 + (k >> 1) + Math.min(2, level >> 1)) * ez));
  for (let i = 0; i < nL; i++) out.push('lanzi'); for (let i = 0; i < nP; i++) out.push('picked');
  return out;
}
function foeVanCost(k, level) { let c = 0; for (const ty of foeVan(k, level)) c += FOE.van.cost[ty]; return c * FOE.van.paid; }
function foeHp(k, level) { return (1 + .13 * (k - 1)) * (1 + .22 * level) * (.85 + .15 * G.press) * campaignEase(level)[1]; }

// Called at the end of startWave: puts the vanguard in front of the column, forms the chief's host up for the general assault, and may plan a flank raid.
function foeWave() {
  const st = FOE.st, k = G.k, lv = G.level, boss = G.bossWave, V = FOE.van, M = FOE.muster, S = FOE.sneak, q = G.queue, van = foeVan(k, lv), hpMul = foeHp(k, lv);
  st.muster = false; st.musterAt = st.releaseAt = -1; st.sneak = null;
  if (boss) {
    const body = q.filter(e => !MON[e.type].boss), b = q.find(e => MON[e.type].boss);
    body.forEach((e, i) => { e.t = V.lead + M.span * (i + rnd() * .6) / body.length; e.hold = true; });
    if (b) { b.t = V.lead + M.span * M.bossAt; b.hold = true; }
    st.musterAt = V.lead; st.releaseAt = V.lead + M.span + M.wait;
  } else for (const e of q) e.t += V.lead;
  van.forEach((type, i) => q.push({ t: .3 + i * .55, type, hpMul, van: true }));
  q.sort((a, b) => a.t - b.t); st.van += van.length;
  const nP = van.filter(t => t === 'picked').length, nL = van.length - nP, who = (nL ? MON.lanzi.name + ' ' + nL + ' · ' : '') + MON.picked.name + ' ' + nP;
  if (boss) UI.banner('第 ' + waveNumber() + ' 波 · ' + MON[bossType()].name, 3.6, true, '先头部队：' + who);
  else UI.banner('第 ' + waveNumber() + ' 波', 2.8, false, '先头部队：' + who);
  // a flank raid: never on the opening wave, more likely on later battlefields
  if (k >= S.from + (lv === 0 ? 1 : 0) && rnd() < Math.min(S.max, S.chance + S.perLevel * lv)) {
    const routes = foeRoutes(G.B);
    if (routes.length) {
      const route = routes[Math.floor(rnd() * routes.length)], menu = waveMenu(k, lv).map(e => e[0]), light = ['rat', 'spider', 'ghoul', 'wolf'].filter(t => menu.indexOf(t) >= 0), list = ['picked'];
      const n = Math.max(2, Math.round((2 + (k >> 1) + (lv >> 1)) * campaignEase(lv)[0]));
      for (let i = 1; i < n; i++) list.push(i === 3 ? 'picked' : light.length ? light[Math.floor(rnd() * light.length)] : 'skel');
      st.sneak = { t: (boss ? V.lead : V.lead + rr(3, 9)) + S.warn, warned: false, route, list, hpMul, gap: 0 };
    }
  }
}
// One man of the queue takes the field.
function foeSpawn(e) {
  const m = spawnMonster(e.type, { hpMul: e.hpMul * (MON[e.type].boss ? FOE.call.chief : 1) });
  if (e.hold) m.hold = true; if (e.van) m.van = true;
  if (e.type === 'picked') foeTorch(m);
  return m;
}
function foeTorch(m) { m.torch = true; m.flame = addFlame({ x: 0, y: -50, z: 0, size: .36, embers: .45, glow: .8 }); m.lI = 30; }

// Side tracks for a flank raid: straight lines from the edge of the field to a point on the road, clear of water, of the road itself, of the works and of both camps.
const _fr = { x: 0, y: 0, z: 0, tx: 0, tz: 0 };
function foeRoutes(B) {
  if (B.flank) return B.flank; const out = B.flank = [], S = FOE.sneak, lim = BH - .7;
  for (let s = B.L * S.span[0]; s <= B.L * S.span[1]; s += 1.2) {
    const p = pathAt(B, s, _fr), px = p.x, pz = p.z, tx = p.tx, tz = p.tz;
    for (const side of [-1, 1]) for (const da of [-.6, -.3, 0, .3, .6]) {
      const nx = -tz * side, nz = tx * side, dx = nx * Math.cos(da) - nz * Math.sin(da), dz = nx * Math.sin(da) + nz * Math.cos(da);
      let ok = true, d = .5, h0 = B.heightAt(px, pz), edge = false;
      for (; d < S.len[1]; d += .5) {
        const x = px + dx * d, z = pz + dz * d; if (Math.abs(x) > lim || Math.abs(z) > lim) { edge = true; break; }
        const h = B.heightAt(x, z); if (Math.abs(h - h0) > .75) ok = false; h0 = h;
        if (d > 3.4 && B.dRoadAt(x, z) < ROAD_HALF + 1.4) ok = false;
        if (B.dStrAt(x, z) < 1.2 || dist2(x, z, B.gate.x, B.gate.z) < 100 || dist2(x, z, B.cave.x, B.cave.z) < 49) ok = false;
        for (const q of B.ponds) if (dist2(x, z, q.x, q.z) < (q.r + .8) * (q.r + .8)) ok = false;
        for (const q of B.pads) if (dist2(x, z, q.x, q.z) < 3.2) ok = false;
        if (!ok) break;
      }
      if (ok && edge && d >= S.len[0]) out.push({ s, x0: px + dx * d, z0: pz + dz * d, x1: px, z1: pz, d, nx: -dz, nz: dx });
    }
  }
  return out;
}
function foeSneakSpawn(sn) {
  const B = G.B, r = sn.route, type = sn.list.shift(), lat = rr(-.8, .8), off = rr(-.7, .7);
  const m = spawnMonster(type, { hpMul: sn.hpMul, s: r.s, lat, pop: 1 });
  m.x = r.x0 + r.nx * off; m.z = r.z0 + r.nz * off; m.y = B.heightAt(m.x, m.z); m.vis = true; m.sneak = true; m.wallSt = 'rove';
  m.rove = { mode: 'flank', s: r.s, lat, x: r.x1 - _frTan(B, r.s).tz * lat, z: r.z1 + _fr.tx * lat };
  if (type === 'picked') foeTorch(m);
  fxDust(m.x, m.y + .2, m.z, 6, .8, { speed: 1.8 });
}
function _frTan(B, s) { return pathAt(B, s, _fr); }

// A man who has left the road: on a side track, at a work with his torch, or on his way back.
function roverSwing(m, dt, hit) {
  if (m.atk >= 0) { m.atk += dt / m.def.atkT * 1.7; if (m.atk >= .5 && !m.struck) { m.struck = true; hit(); } if (m.atk >= 1) { m.atk = -1; m.cd = m.def.atkT * rr(.35, .5); } }
  else if (m.cd <= 0) { m.atk = 0; m.struck = false; }
}
function roverRejoin(m) { const R = m.rove; m.wallSt = null; m.rove = null; m.s = R.s; m.lat = m.lane = m.home = R.lat; m.ks = m.kl = 0; m.atk = -1; }
function updateRover(m, dt) {
  const B = G.B, R = m.rove, def = m.def, sp = def.spd * m.spdMul * (1 - m.slowF) * FOE.sneak.pace;
  m.vx = m.vz = 0; m.vis = true; m.cd -= dt; m.y = B.heightAt(m.x, m.z) + .02; m.s = R.s; m.prog = R.s / B.L;
  if (m.foe && (m.foe.dead || m.foe.gone)) m.foe = null;
  const f = m.foe;
  if (f) {
    // a footman has come out to him: he turns and fights
    m.mv = damp(m.mv, 0, 10, dt); m.yaw = angDamp(m.yaw, Math.atan2(f.x - m.x, f.z - m.z), 10, dt);
    roverSwing(m, dt, () => { if (Math.hypot(f.x - m.x, f.z - m.z) < m.rad + f.rad + .9) strike(m, f, def.dmg * G.dmgMul * (m.pow || 1), false); });
    return;
  }
  if (R.mode === 'sap') {
    const t = R.t;
    if (!t.alive || t.ruin || t.state !== 'active' || R.n >= def.sap.blows || G.phase !== 'play') { (m.sapped || (m.sapped = [])).push(t); R.mode = 'back'; const p = pathAt(B, R.s, _fr); R.x = p.x - p.tz * R.lat; R.z = p.z + p.tx * R.lat; m.atk = -1; return; }
    if (stormMove(m, R.x, R.z, dt, sp) < .12) {
      const dx = t.x - m.x, dz = t.z - m.z, l = Math.hypot(dx, dz) || 1; m.yaw = angDamp(m.yaw, Math.atan2(dx, dz), 10, dt);
      roverSwing(m, dt, () => {
        R.n++; fxSparks(m.x + dx / l * .5, m.y + 1, m.z + dz / l * .5, 5, 3, 3, 1.6, .5, { size: .055, grav: 6 }); sfx('hammer', t.x, t.z, .45, rnd());
        damageTower(t, def.sap.dmg * (1 + RAID.lvDmg * G.level) * (m.pow || 1), dx / l, dz / l, true);
        if (t.ruin) { FOE.st.ruins++; foeKill(m, FOE.rank.work); }
      });
    }
  } else if (stormMove(m, R.x, R.z, dt, sp) < .1) roverRejoin(m);
}

// Called for every man on the road, once his own pace is known. Returns the share of it he keeps; may take him off the road (m.wallSt is then set).
function foeThink(m, dt) {
  const st = FOE.st, def = m.def, B = G.B, M = FOE.muster; let k = 1;
  if (m.hold) { if (st.muster || G.waveT < st.releaseAt) k = sat((B.cave.s + M.line - m.s) * 1.6); else { m.hold = false; m.surge = M.surgeT; } }
  if (m.surge > 0) { m.surge -= dt; k *= M.surge; }
  if (G.phase !== 'play' || m.siege || !m.vis) return k;
  if (def.boss) {
    st.bossAt = Math.max(st.bossAt, +(m.s / B.L).toFixed(2));
    // the call to the three armies, the moment the chief is within shot of the wall
    if (!m.called && !(m.dying > 0)) { const r = WALL.range[G.wall.lvl]; if (dist2(B.gate.x, B.gate.z, m.x, m.z) < r * r) foeCall(m); }
    if (m.callT > 0) { m.callT -= dt; m.cast = 1; return 0; }
    // he stands off and directs the storm while the host he called is still fighting
    if (m.host) { m.standT -= dt; if (m.standT <= 0 || !m.host.some(q => !q.dead && q.hp > 0)) { m.host = null; sfx('roar', m.x, m.z, .8, .6); } else return 0; }
    return k;
  }
  if (m.foe) return k;
  if (def.harass) {
    const h = def.harass; m.harCd = (m.harCd || rr(.3, 1)) - dt;
    const t = raidPick(m, h.range, false); if (!t) return k;
    if (m.harCd <= 0) {
      m.harCd = h.every * rr(.85, 1.15); sfx('bow', m.x, m.z, .6, rnd());
      const y0 = m.y + def.top * .75, top = Math.min(2.6, t.mounts.top), dist = Math.hypot(t.x - m.x, t.z - m.z);
      RAID.shots.push({ x0: m.x, y0, z0: m.z, tx: t.x + rr(-.5, .5), ty: t.y + rr(.5, top), tz: t.z + rr(-.5, .5), t: 0, T: clamp(dist / 10, .4, .8), arc: .6 + dist * .12, tower: t, dmg: h.dmg * (1 + RAID.lvDmg * G.level) * (m.pow || 1), x: m.x, y: y0, z: m.z, ember: 0 });
    }
    return k * h.slow;
  }
  if (def.sap) {
    m.sapCd = (m.sapCd || 0) - dt; if (m.sapCd > 0) return k; m.sapCd = .25;
    const r2 = def.sap.reach * def.sap.reach; let best = null, bd = r2;
    for (const t of G.towers) {
      if (!t.alive || t.ruin || t.state !== 'active' || Math.abs(t.pad.s - m.s) > 1.1 || (m.sapped && m.sapped.indexOf(t) >= 0)) continue;
      const d = dist2(t.x, t.z, m.x, m.z); if (d >= bd) continue;
      let n = 0; for (const o of G.mons) if (!o.dead && o.rove && o.rove.t === t) n++; if (n >= FOE.van.perWork) continue;
      bd = d; best = t;
    }
    if (best) {
      const t = best, a = Math.atan2(m.x - t.x, m.z - t.z) + rr(-.6, .6);
      m.wallSt = 'rove'; m.rove = { mode: 'sap', t, n: 0, s: m.s, lat: m.lat, x: t.x + Math.sin(a) * 1.2, z: t.z + Math.cos(a) * 1.2 }; m.foe = null; m.atk = -1;
    }
  }
  return k;
}

// The chief halts, raises his standard and the three armies come up behind him with ladders.
function foeCall(m) {
  const C = FOE.call, lv = G.level, ez = campaignEase(lv), B = G.B, menu = waveMenu(5, lv).map(e => e[0]);
  m.called = true; m.callT = C.halt; m.cast = 1; FOE.st.calls++;
  const pool = ['skel', 'skel', 'ghoul', 'knight', 'toad', 'spider'].filter(t => t === 'skel' || menu.indexOf(t) >= 0), list = [];
  let budget = (C.budget[0] + C.budget[1] * lv) * ez[0] * Math.sqrt(G.press);
  const nl = Math.min(2, 1 + (lv >> 1)); for (let i = 0; i < nl; i++) list.push('ladder');
  if (lv >= 1 && menu.indexOf('slime') >= 0) { list.push('slime'); budget -= ROSTER.slime[0]; }
  while (budget > 0 && list.length < 26) { const ty = pool[Math.floor(rnd() * pool.length)]; list.push(ty); budget -= ROSTER[ty][0]; }
  const hpMul = C.hp * (1 + .22 * lv) * ez[1];
  m.host = []; m.standT = C.stand;
  list.forEach((ty, i) => {
    if (G.mons.length > 88) return;
    const q = spawnMonster(ty, { s: Math.max(B.cave.s + 2, m.s - 2.2 - .42 * i), lat: ((i % 3) - 1) * .75 + rr(-.15, .15), hpMul, pop: 1 }); q.vis = true; q.surge = 3; m.host.push(q);
    fxDust(q.x, q.y + .1, q.z, 4, .7, { a: .45 });
  });
  UI.banner('号令三军', 3.4, true, m.def.name + '麾旗击鼓，三军并进，蚁附攻城');
  sfx('hornBoss', m.x, m.z, 1.1); sfx('roar', m.x, m.z, 1, .8); FX.shake = Math.min(1.2, FX.shake + .7);
  fxTimed(4, m.x, m.y + .08, m.z, 9, 9, 1.6, .7, .25, .6, .9, { ground: true }); fxEmbers(m.x, m.y + 2.5, m.z, 30, 1.2);
}

// How much the adviser should worry about the wall: the chief is in the field and will bring the storm to it.
function foeAlarm() { return G.bossWave && G.spawning ? FOE.call.alarm : 0; }

// A kill to an enemy's name. Enough of them and he is promoted on the spot.
function foeKill(m, n) {
  const R = FOE.rank; if (!m || m.isMan || !m.def || m.def.boss || m.dead || m.hp <= 0) return;
  m.kills = (m.kills || 0) + (n || 1); m.rank = m.rank || 0;
  while (m.rank < R.need.length && m.kills >= R.need[m.rank]) {
    m.rank++; FOE.st.promos++;
    const base = m.maxHp / (1 + R.hp * (m.rank - 1)), add = base * R.hp; m.maxHp += add; m.hp = Math.min(m.maxHp, m.hp + add * 1.5);
    m.pow = 1 + R.dmg * m.rank; m.scale *= 1 + R.size; m.flash = 1;
    fxTimed(4, m.x, m.y + .08, m.z, 3.2, 3.2, 1.8, 1.3, .4, .7, .6, { ground: true }); fxEmbers(m.x, m.y + 1.2, m.z, 10, .4); sfx('horn', m.x, m.z, .3, .6);
    if (m.rank >= 2 && !UI.msg) UI.banner('敌军' + m.def.name + '积功升' + R.names[m.rank - 1], 2.2, false);
  }
}

const _fq = new THREE.Quaternion(), _fup = new THREE.Vector3(0, 1, 0), _fv = new THREE.Vector3(), _fs = new THREE.Vector3(), _fm = new THREE.Matrix4();
// Once a step: the clock of the muster and of the flank raid, and the pennants of promoted men.
function foeUpdate(dt) {
  const st = FOE.st, B = G.B, M = FOE.muster;
  if (G.phase !== 'play') { st.muster = false; st.sneak = null; return; }
  if (G.spawning && G.bossWave && st.musterAt >= 0) {
    if (!st.muster && G.waveT >= st.musterAt && G.waveT < st.releaseAt) {
      st.muster = true; UI.banner(MON[bossType()].name + '集结大军', 3.2, true, '总攻将至，趁其未集，先击其前锋'); sfx('hornBoss', B.cave.x, B.cave.z, .8);
    }
    if (st.muster) {
      if (rnd() < dt * 1.6) { sfx('bossStep', B.cave.x, B.cave.z, .5, .2); const p = pathAt(B, B.cave.s + rr(1.8, M.line), _fr); fxDust(p.x + rr(-1, 1), p.y + .1, p.z + rr(-1, 1), 3, .7, { a: .35 }); }
      if (G.waveT >= st.releaseAt) {
        st.muster = false; st.musterAt = -1; UI.banner('总攻', 3.4, true, raidWarn(bossType()) || '敌军倾巢而出');
        sfx('hornBoss', B.cave.x, B.cave.z, 1.2); sfx('roar', B.cave.x, B.cave.z, .9, .6); FX.shake = Math.min(1.2, FX.shake + .6);
      }
    }
  }
  const sn = st.sneak;
  if (sn) {
    sn.t -= dt; const r = sn.route;
    if (!sn.warned && sn.t <= FOE.sneak.warn) {
      sn.warned = true; st.sneaks++; const y = B.heightAt(r.x0, r.z0);
      UI.banner('敌军偷袭', 3, true, '奇兵舍大路，由间道直插腹地'); sfx('horn', r.x0, r.z0, 1, .5); UI.ping(r.x0, y, r.z0, false); UI.ping(r.x1, B.heightAt(r.x1, r.z1), r.z1, false);
    }
    if (sn.warned && sn.t > 0 && rnd() < dt * 5) fxDust(r.x0 + rr(-.8, .8), B.heightAt(r.x0, r.z0) + .2, r.z0 + rr(-.8, .8), 2, .7, { a: .4 });
    if (sn.t <= 0) { sn.gap -= dt; if (sn.gap <= 0 && G.mons.length < 86) { sn.gap = FOE.sneak.gap; foeSneakSpawn(sn); } if (!sn.list.length) st.sneak = null; }
  }
  // pennants: one colour for each rank, on a pole behind the man
  let any = false; for (const m of G.mons) if (m.rank && !m.dead && (m.vis || m.wallSt)) { any = true; break; }
  if (!any) return;
  if (!FOE.flag) FOE.flag = new PartBatch(S => { S.box(.03, 1.1, .03, 0, .55, 0, [.5, .5, .5], { l: L_WOOD, jit: 0 }); S.box(.02, .22, .34, 0, .96, .19, [1, 1, 1], { l: L_CLOTH, emis: .12, jit: 0 }); S.box(.02, .1, .16, 0, .96, .44, [1, 1, 1], { l: L_CLOTH, emis: .12, jit: 0 }); }, 48, { rad: .6, shadow: false });
  for (const m of G.mons) {
    if (!m.rank || m.dead || !(m.vis || m.wallSt) || m.wallSt === 'inside') continue;
    const sc = m.scale / m.def.scale * (.9 + .12 * m.rank), up = m.def.top * m.scale / m.def.scale - .75;
    _fq.setFromAxisAngle(_fup, m.yaw); _fm.compose(_fv.set(m.x - Math.sin(m.yaw) * .16, m.y + Math.max(.2, up), m.z - Math.cos(m.yaw) * .16), _fq, _fs.set(sc, sc, sc));
    FOE.flag.put(_fm, m.flash || 0, FOE.rank.tint[m.rank - 1]);
  }
}
