// The chiefs raid the defences along the road.
// A chief does not just walk past the towers: on the march he turns on whatever the defender has built beside the road.
// Mounted chiefs loose fire arrows at the nearest work as they ride by, the heavy ones halt and break it down by hand.
// A work has its own strength. Left alone it is patched up by its crew; brought to nothing it is a ruin that fights no more
// until it is rebuilt for a part of what it cost. A chief who is tied up by the garrison's foot has no time for the towers.
const RAID = {
  // strength of each work at each tier
  hp: { archer: [90, 120, 160, 210], bombard: [130, 170, 220, 290], spire: [110, 145, 190, 250], guard: [140, 180, 240, 310] },
  calm: 6, mend: .05, rebuild: .3, ruinRefund: .3, lvDmg: .12,
  // how each chief goes about it; README.md gives the source for each
  by: {
    ogre: { how: 'shoot', range: 5.6, dmg: 8, n: 3, every: 2.4, slow: .8, warn: '鸣镝所向，附离火箭齐发，射沿路工事' },
    king: { how: 'shoot', range: 5.6, dmg: 8.5, n: 3, every: 2.4, slow: .8, warn: '单于鸣镝所射，万骑随之，射沿路工事' },
    colossus: { how: 'shoot', range: 6.4, dmg: 7, n: 4, every: 2.6, slow: .85, h: 4.4, warn: '云车瞰临，积弩乱发，矢下如雨' },
    giant: { how: 'smash', range: 4.3, dmg: 42, blows: 3, rest: 5, warn: '辽军所过，沿路工事必夷伐焚荡' },
    jotun: { how: 'smash', range: 4.3, dmg: 46, blows: 3, rest: 5, warn: '铁浮屠重铠陷阵，撞毁沿路工事' },
    queen: { how: 'smash', range: 4.4, dmg: 44, blows: 3, rest: 5, warn: '象阵置于阵前，踏毁沿路工事' },
  },
  shots: [], ruined: 0, rebuilt: 0,
};
function raidWarn(type) { const r = RAID.by[type]; return r ? r.warn : undefined; }
function towerMaxHp(t) { return Math.round(RAID.hp[t.kind][t.lvl] * crewHp(t)); }
function rebuildCost(t) { return Math.round(t.spent * RAID.rebuild); }
function towerRefund(t) { return Math.round(t.spent * (t.ruin ? RAID.ruinRefund : .6)); }

// Called first thing in Tower.update. Keeps the work's strength, mends it in quiet times and smokes when it is hurt. True for a ruin, which does nothing else.
function raidTend(t, dt) {
  const max = towerMaxHp(t);
  if (t.hp === undefined) { t.hp = t.maxHp = max; t.hitT = -99; t.shk = 0; }
  if (t.maxHp !== max) { const r = t.hp / t.maxHp; t.maxHp = max; t.hp = max * Math.max(r, .6); }
  if (t.shk > 0) { t.shk = Math.max(0, t.shk - dt * 4); t.group.position.x = t.x + Math.sin(G.t * 70) * .05 * t.shk; t.group.position.z = t.z + Math.cos(G.t * 63) * .05 * t.shk; }
  const top = Math.min(3.6, t.mounts.top);
  if (t.ruin) {
    t.em.on = damp(t.em.on, 0, 3, dt); t.ruinT += dt;
    if (rnd() < dt * (t.ruinT < 5 ? 9 : 2.5)) fxSmoke(t.x + rr(-.5, .5), t.y + rr(.3, .9), t.z + rr(-.5, .5), rr(-.2, .2), rr(.6, 1.4), rr(-.2, .2), rr(1.4, 2.4), .35, .8, .13, .12, .12, .5, { drag: .6, rise: .25 });
    if (t.ruinT < 5 && rnd() < dt * 8) fxPart(t.x + rr(-.5, .5), t.y + rr(.2, .7), t.z + rr(-.5, .5), rr(-.3, .3), rr(.6, 1.6), rr(-.3, .3), rr(.5, 1), .05, 2.6, 1, .15, { drag: .4, wob: 1, rise: .3 });
    G.hbars.push({ x: t.x, y: t.y + 1.5, z: t.z, f: 0, boss: false, man: true, wide: true });
    return true;
  }
  if (t.hp < max) {
    if (G.t - t.hitT > RAID.calm && t.state === 'active') t.hp = Math.min(max, t.hp + max * RAID.mend * dt);
    const f = t.hp / max;
    if (f < .6 && rnd() < dt * 7 * (1 - f)) fxSmoke(t.x + rr(-.4, .4), t.y + top * rr(.5, .9), t.z + rr(-.4, .4), rr(-.2, .2), rr(.5, 1.2), rr(-.2, .2), rr(1, 1.8), .26, .6, .16, .15, .15, .45, { drag: .6, rise: .2 });
    G.hbars.push({ x: t.x, y: t.y + top + .5, z: t.z, f: sat(f), boss: false, man: true, wide: true });
  }
  return false;
}
function damageTower(t, dmg, dx, dz, fire) {
  if (!t.alive || t.ruin || G.phase !== 'play') return;
  if (t.hp === undefined) raidTend(t, 0);
  t.hp -= dmg; t.hitT = G.t; t.shk = Math.min(1.4, (t.shk || 0) + (fire ? .35 : 1));
  const top = Math.min(3, t.mounts.top), n = fire ? 1 : 4;
  for (let i = 0; i < n; i++) { _tm.compose(_tv.set(t.x + rr(-.6, .6), t.y + rr(.4, top), t.z + rr(-.6, .6)), _tq.set(rr(-1, 1), rr(-1, 1), rr(-1, 1), 1).normalize(), _ts.set(1, 1, 1)); addDebris(t.kind === 'bombard' || rnd() < .3 ? KIT.rubble : KIT.plank, _tm, null, rr(-2, 2) + (dx || 0) * 2, rr(1.5, 4), rr(-2, 2) + (dz || 0) * 2, rr(3, 9), rr(1.6, 2.6)); }
  if (t.hp <= 0) ruinTower(t);
}
// What is left of a work: its footing, a heap of rubble and a few charred timbers.
function ruinMesh(t) {
  const S = new Soup(), base = t.bp.pieces[0], char = mulC(COL.woodD, .35), soot = [.42, .4, .38];
  S.merge(base.soup, { p: [0, base.y, 0], tint: soot });
  const cut = t.kind === 'archer' && t.vl ? [.25, 1.0, 1.9][t.vl] : .3;
  for (let i = 0; i < 9; i++) { const a = rr(0, TAU), r = rr(.1, .95); S.rock(rr(.16, .34), Math.cos(a) * r, cut + rr(-.05, .16), Math.sin(a) * r, mulC(COL.stoneD, rr(.5, .8)), {}); }
  for (let i = 0; i < 6; i++) { const a = rr(0, TAU), r = rr(.2, .8), x = Math.cos(a) * r, z = Math.sin(a) * r, h = rr(.5, 1.5); S.seg([x, cut, z], [x + rr(-.5, .5), cut + h, z + rr(-.5, .5)], .06, .04, char, { l: L_WOOD, n: 4 }); }
  for (let i = 0; i < 4; i++) S.box(rr(.5, 1), .06, .14, rr(-.6, .6), cut + rr(.05, .2), rr(-.6, .6), char, { l: L_WOOD, r: [rr(-.3, .3), rr(0, TAU), rr(-.3, .3)] });
  const m = new THREE.Mesh(S.build(), MAT.world); m.castShadow = m.receiveShadow = true; return m;
}
function ruinTower(t) {
  t.hp = 0; t.ruin = true; t.ruinT = 0; t.state = 'ruin'; t.stun = 0; RAID.ruined++;
  t.clearModel(true); t.staticMesh = ruinMesh(t); t.group.add(t.staticMesh); t.group.position.set(t.x, t.y, t.z);
  t.flame = addFlame({ x: t.x + rr(-.2, .2), y: t.y + (t.kind === 'archer' && t.vl ? [.25, 1.0, 1.9][t.vl] : .3) + .15, z: t.z + rr(-.2, .2), size: .55, embers: .8, glow: .9, on: 1 });
  const stone = t.kind === 'bombard' || t.kind === 'spire';
  for (let i = 0; i < 18; i++) { _tm.compose(_tv.set(t.x + rr(-.8, .8), t.y + rr(.3, 2.6), t.z + rr(-.8, .8)), _tq.set(rr(-1, 1), rr(-1, 1), rr(-1, 1), 1).normalize(), _ts.set(1, 1, 1)); addDebris(stone && i & 1 ? KIT.rubble : KIT.plank, _tm, null, rr(-3, 3), rr(2, 6), rr(-3, 3), rr(3, 9), rr(2.4, 3.8)); }
  fxDust(t.x, t.y + .5, t.z, 22, 1.9, { speed: 3.4 }); fxExplosion(t.x, t.y + 1, t.z, .7); fxEmbers(t.x, t.y + 1, t.z, 30, .8);
  FX.shake = Math.min(1.2, FX.shake + .7); sfx('crumble', t.x, t.z, .6, .3); sfx('explode', t.x, t.z, .7, .2);
  FX.decals.add(G.B.heightAt, t.x, t.z, 2.2, .016, .013, .011, .8, 60);
  UI.banner(t.def.name + '被毁', 2.6, true, '点击废墟重建，花费 ' + rebuildCost(t));
}
// A ruin is raised again at the tier it had, for a part of what was spent on it.
function rebuildTower(t, byPlayer) {
  if (!t || !t.alive || !t.ruin || G.phase !== 'play') return false; const c = rebuildCost(t); if (G.gold < c) return false;
  G.gold -= c; UI.goldShown = Math.min(UI.goldShown, G.gold); RAID.rebuilt++;
  t.ruin = false; t.hp = t.maxHp = towerMaxHp(t); t.hitT = -99; t.mended = true; t.begin(); UI.ping(t.x, t.y, t.z, byPlayer); return true;
}

function raidPick(m, range, skip) {
  let best = null, bd = range * range;
  for (const t of G.towers) { if (!t.alive || t.ruin || t.state !== 'active' || (skip && t.raidBy === m)) continue; const d = dist2(t.x, t.z, m.x, m.z); if (d < bd) { bd = d; best = t; } }
  return best;
}
function raidEnd(m) { const r = RAID.by[m.type]; if (m.raid) m.raidCd = r.rest || 0; m.raid = null; }
// A chief on the road with no footman in his way. Returns how much of his pace he keeps.
function raidThink(m, dt) {
  const r = RAID.by[m.type];
  if (!r || m.siege || !m.vis || G.phase !== 'play') { m.raid = null; return 1; }
  m.raidCd = (m.raidCd || 0) - dt;
  if (r.how === 'shoot') {
    const t = raidPick(m, r.range, false); if (!t) return 1;
    if (m.raidCd <= 0) {
      m.raidCd = r.every * rr(.9, 1.1); m.cast = 1; sfx('bow', m.x, m.z, .9, .1); sfx('horn', m.x, m.z, .18, .9);
      const y0 = m.y + (r.h || m.def.top * .7), top = Math.min(2.6, t.mounts.top), dist = Math.hypot(t.x - m.x, t.z - m.z), dmg = r.dmg * (1 + RAID.lvDmg * G.level);
      for (let i = 0; i < r.n; i++) RAID.shots.push({ x0: m.x + rr(-.5, .5), y0: y0 + rr(-.2, .2), z0: m.z + rr(-.5, .5), tx: t.x + rr(-.5, .5), ty: t.y + rr(.5, top), tz: t.z + rr(-.5, .5), t: -i * .13, T: clamp(dist / 10, .4, .8), arc: .6 + dist * .12, tower: t, dmg, x: m.x, y: y0, z: m.z, ember: 0 });
    }
    return r.slow;
  }
  let t = m.raid;
  if (t && (!t.alive || t.ruin || m.raidN >= r.blows || dist2(t.x, t.z, m.x, m.z) > (r.range + .8) * (r.range + .8))) { raidEnd(m); t = null; }
  if (!t && m.raidCd <= 0 && m.atk < 0) { t = raidPick(m, r.range, true); if (t) { m.raid = t; m.raidN = 0; t.raidBy = m; sfx('roar', m.x, m.z, .7, .5); } }
  return t ? .08 : 1;
}
// One blow of a chief against the work he has turned on.
function raidStrike(m) {
  const r = RAID.by[m.type], t = m.raid; if (!t || !r) return; m.raidN++;
  const dx = t.x - m.x, dz = t.z - m.z, l = Math.hypot(dx, dz) || 1, hx = t.x - dx / l * .8, hz = t.z - dz / l * .8;
  fxDust(hx, t.y + .6, hz, 12, 1.5, { speed: 3 }); fxSparks(hx, t.y + 1.2, hz, 8, 4, 3, 2.3, 1.2, { size: .06, grav: 7 });
  fxTimed(4, t.x, t.y + .08, t.z, 4.2, 4.2, 1.2, .9, .6, .5, .35, { ground: true });
  FX.shake = Math.min(1.2, FX.shake + .55); sfx('hammer', t.x, t.z, 1, .1); sfx('bossStep', t.x, t.z, 1, .8);
  damageTower(t, r.dmg * (1 + RAID.lvDmg * G.level), dx / l, dz / l, false);
}
// Fire arrows in the air on their way to a work.
function updateRaid(dt) {
  const A = RAID.shots; if (G.phase !== 'play') { A.length = 0; return; }
  for (let i = A.length - 1; i >= 0; i--) {
    const a = A[i]; a.t += dt; if (a.t < 0) continue;
    const u = Math.min(1, a.t / a.T), px = a.x, py = a.y, pz = a.z;
    a.x = lerp(a.x0, a.tx, u); a.z = lerp(a.z0, a.tz, u); a.y = lerp(a.y0, a.ty, u) + a.arc * 4 * u * (1 - u);
    const dx = a.x - px, dy = a.y - py, dz = a.z - pz, l = Math.hypot(dx, dy, dz) || 1, ux = dx / l, uy = dy / l, uz = dz / l;
    KIT.arrow.put(arrowMatrix(a.x, a.y, a.z, ux, uy, uz), 0, null);
    FX.segs.push(a.x, a.y, a.z, .055, a.x - ux * .95, a.y - uy * .95, a.z - uz * .95, .0, 2.6, 1.05, .25, .85);
    FX.add.push(a.x, a.y, a.z, .3, .3, 0, 0, 3.6, 1.9, .5, 1, 0, 0, 0, 0);
    a.ember += dt * 20; while (a.ember > 1) { a.ember -= 1; fxPart(a.x, a.y, a.z, rr(-.4, .4), rr(-.1, .6), rr(-.4, .4), rr(.25, .6), .05, 2.6, 1.1, .2, { drag: 1.5, rise: .6 }); }
    if (u >= 1) {
      swapRemove(A, i);
      fxSparks(a.x, a.y, a.z, 5, 3, 3, 1.5, .4, { size: .055, grav: 6 }); fxTimed(2, a.x, a.y, a.z, .9, .9, 1.6, .8, .25, .8, .12); sfx('arrowHit', a.x, a.z, .5, rnd());
      damageTower(a.tower, a.dmg, ux, uz, true);
    }
  }
}
