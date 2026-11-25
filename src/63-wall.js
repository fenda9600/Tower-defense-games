// The wall garrison and the assault on the pass.
// Enemies that reach the end of the road no longer walk through the gate: they mass below the wall and attack it.
// Crossbowmen on the wall walk shoot down at them. The garrison can be raised a dynasty at a time, and the
// reinforce skill puts one more man on the wall for a fixed price.
const WALL = {
  name: '城头守军', max: 8, start: 2, addCost: 70, cost: [0, 140, 200, 280],
  range: [5.6, 6.0, 6.5, 7.0], dmg: [7, 9, 11, 14], rate: [1.0, .95, .88, .8],
  tiers: [
    ['秦 · 城上弩卒', '《墨子·备城门》守城之法：城上二步一木弩。'],
    ['汉 · 塞上燧卒', '居延汉简所记戍卒，凭坞壁转射发弩。'],
    ['唐 · 睢阳守卒', '至德二载，张巡、许远以数千人守睢阳十月。'],
    ['宋 · 钓鱼城守军', '钓鱼城坚守三十六年，蒙哥汗殁于城下。'],
  ],
};
// How hard the assault presses the wall. Each attacker wears it down by weight * rate per second while he is alive at its foot;
// the weight is his old gate toll unless he is a siege engine. depth is how far back from the gate the storming party reaches.
const SIEGE = { rate: .06, depth: 3.2, weight: { slime: 3, mummy: 2, giant: 3, ogre: 3, jotun: 3, queen: 3, king: 3, colossus: 4.5 }, blast: 2 };
function siegeWeight(m) { const w = SIEGE.weight[m.type]; return w === undefined ? m.def.lives : w; }

function resetWall() {
  const B = G.B;
  G.wall = { lvl: 0, n: 0, men: [], acc: 0, dealt: 0, recent: 0, kills: 0, siegeN: 0, siegeHp: 0, hurtT: 9, cried: false };
  for (let i = 0; i < WALL.start; i++) addWallMan(false);
}
function addWallMan(fx) {
  const W = G.wall, B = G.B, sl = B.wallSlots[W.n]; if (!sl) return null;
  const yaw = B.mirrored ? HPI : 0;
  const man = { sl, yaw, home: yaw, draw: 0, cool: .4 + W.n * .17, appear: fx ? 0 : 1, e: { scale: .82, ph: 0, mv: 0, atk: -1, bow: true, xbow: true, helm: false, hat: null, back: null, draw: 0, pitch: 0, tint: [1, .9, .7], x: sl.x, y: sl.y, z: sl.z, yaw, flash: 0 } };
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
  const W = G.wall; if (!W || G.phase !== 'play' || W.lvl >= WALL.tiers.length - 1) return false; const c = WALL.cost[W.lvl + 1]; if (G.gold < c) return false;
  G.gold -= c; UI.goldShown = Math.min(UI.goldShown, G.gold); W.lvl++;
  for (const m of W.men) { m.appear = .35; fxDust(m.sl.x, m.sl.y + .2, m.sl.z, 5, .6, { speed: 1.4 }); }
  const tr = WALL.tiers[W.lvl]; UI.banner(WALL.name + ' · ' + tr[0], 3.6, false, tr[1]);
  sfx('buildDone', G.B.gate.x, G.B.gate.z, 1); UI.ping(G.B.gate.x, G.B.gate.y, G.B.gate.z, byPlayer); return true;
}
function dressWallMan(e, lvl) {
  // Qin: studded lamellar and topknot. Han: iron helmet. Tang: bright-light armour and the long bow. Song: full infantry armour.
  const I = KIT.item; e.xbow = lvl !== 2; e.helm = lvl === 1 || lvl === 3;
  e.back = lvl === 0 ? I.qinJia : lvl === 2 ? I.mingguang : lvl === 3 ? I.buren : null; e.hat = lvl === 0 ? I.qinBun : lvl === 2 ? I.tangHelm : null;
}
// The wall loses strength; whole points come off the beacon's count.
function hurtWall(x, big) {
  const W = G.wall, B = G.B; W.acc += x; W.hurtT = 0;
  if (W.acc < 1) return;
  const n = Math.floor(W.acc); W.acc -= n;
  G.lives = Math.max(0, G.lives - n); G.waveLeaks += n; LT.beaconGutter = 1; UI.hurt = 1;
  fxEmbers(B.beacon.x, B.beacon.y, B.beacon.z, 10 + 6 * n, .5); sfx('leak', B.gate.x, B.gate.z, big ? 1 : .7);
}
// One attacker reaches the wall and joins the assault.
function joinSiege(m) {
  const W = G.wall; m.siege = true; m.foe = null; G.leaks++; G.leakTypes[m.type] = (G.leakTypes[m.type] || 0) + m.def.lives;
  if (!W.cried) { W.cried = true; if (!UI.msg) UI.banner('敌军攻城', 2.2, true, '城头守军放箭御敌'); sfx('hornBoss', G.B.gate.x, G.B.gate.z, .6); }
  if (m.def.explode) { m.hp = 0; hurtWall(SIEGE.blast, true); FX.shake = Math.min(1, FX.shake + .3); killMonster(m, 'blast', 0, 0, null); }
}
// One blow against the gate or the wall foot.
function siegeStrike(m) {
  const B = G.B, def = m.def, p = pathAt(B, B.L - .1, _ap), big = !!def.boss || !!def.cart;
  hurtWall(siegeWeight(m) * SIEGE.rate * def.atkT, big);
  fxDust(m.x + p.tx * (m.rad + .2), m.y + .5, m.z + p.tz * (m.rad + .2), big ? 6 : 2, big ? 1 : .5, { speed: big ? 2.2 : 1.2, a: .4 });
  if (big) { FX.shake = Math.min(1, FX.shake + .25); sfx('hammer', m.x, m.z, 1, .1); sfx('bossStep', m.x, m.z, .6, .4); } else if (rnd() < .5) sfx(def.blade ? 'clash' : 'hammer', m.x, m.z, .45, rnd());
}
const _wc = [], _wp = { x: 0, y: 0, z: 0, tx: 0, tz: 0 };
function updateWall(dt) {
  const W = G.wall, B = G.B; if (!W) return;
  const lvl = W.lvl, r2 = WALL.range[lvl] * WALL.range[lvl], gx = B.gate.x, gz = B.gate.z, play = G.phase === 'play';
  W.recent = Math.max(0, W.recent - dt * .25); W.hurtT += dt;
  // the storming party first, then whatever in range is nearest the gate; fire is spread over the first few
  _wc.length = 0; W.siegeN = 0; W.siegeHp = 0;
  for (const m of G.mons) {
    if (m.dead || m.hp <= 0 || m.dying) continue; if (m.siege) { W.siegeN++; W.siegeHp += m.hp; }
    if (!play || (!m.vis && !m.fly) || dist2(gx, gz, m.x, m.z) > r2) continue;
    m._wsc = (m.siege ? 4 + siegeWeight(m) * .1 : 0) + (m.fly ? 2 : 0) + m.prog - (m.eth ? 3 : 0); _wc.push(m);
  }
  _wc.sort((a, b) => b._wsc - a._wsc);
  const spread = Math.min(_wc.length, Math.max(1, Math.ceil(W.n / 3)));
  W.men.forEach((a, i) => {
    const e = a.e, sl = a.sl, tgt = spread ? _wc[i % spread] : null;
    a.appear = Math.min(1, a.appear + dt * 2.2); a.cool -= dt; dressWallMan(e, lvl);
    e.x = sl.x; e.z = sl.z; e.y = sl.y - (1 - easeOut(a.appear)) * .5; e.scale = .82 * (.3 + .7 * a.appear);
    if (tgt) {
      const T = clamp(Math.hypot(tgt.x - sl.x, tgt.z - sl.z) / 14, .22, .62), q = aimPoint(tgt, T, _wp);
      a.yaw = angDamp(a.yaw, Math.atan2(q.x - sl.x, q.z - sl.z), 12, dt);
      e.pitch = clamp(Math.atan2(q.y - (sl.y + 1), Math.hypot(q.x - sl.x, q.z - sl.z)) * .7 + .2, -.7, .6);
      a.draw = a.cool < .34 ? Math.min(1, a.draw + dt * 3.6) : Math.max(0, a.draw - dt * 6);
      if (a.cool <= 0 && a.draw > .95) {
        a.cool = WALL.rate[lvl] * rr(.9, 1.12); a.draw = 0;
        shootArrow(sl.x + Math.sin(a.yaw) * .3, sl.y + 1.0, sl.z + Math.cos(a.yaw) * .3, tgt, WALL.dmg[lvl], W);
        sfx('bow', sl.x, sl.z, .5, rnd());
      }
    } else { a.draw = Math.max(0, a.draw - dt * 3); a.yaw = angDamp(a.yaw, a.home + Math.sin(G.t * .5 + i * 1.7) * .5, 2, dt); e.pitch = damp(e.pitch, 0, 4, dt); if (a.cool < .3) a.cool = .3; }
    e.yaw = a.yaw; e.draw = a.draw;
    rigHuman(KIT.foot, SPEC.foot, e);
  });
  if (play && (W.siegeN || W.hurtT < 3) && G.lives < G.maxLives) G.hbars.push({ x: gx, y: B.gate.y + 7.2, z: gz, f: sat(G.lives / G.maxLives), boss: true, man: false, name: '城防 ' + G.lives });
}
