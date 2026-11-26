
const MON = {
  // Every unit here fought in a Han, Tang or Song era war; README.md gives the source for each.
  skel: { name: '步卒', en: 'Foot soldier', hp: 34, spd: 1.35, rad: .27, mass: 1, bounty: 6, lives: 1, hitH: .75, top: 1.45, dmg: 6, atkT: .95, scale: 1, death: 'man', blade: true },
  rat: { name: '斥候', en: 'Scout', hp: 13, spd: 2.65, rad: .2, mass: .45, bounty: 3, lives: 1, hitH: .62, top: 1.25, dmg: 3, atkT: .6, scale: .85, death: 'man', cat: 'swarm', blade: true },
  slime: { name: '冲车', en: 'Battering ram', hp: 95, spd: .82, rad: .42, mass: 2.2, bounty: 9, lives: 1, hitH: .8, top: 1.75, dmg: 8, atkT: 1.2, scale: 1, death: 'wood', cart: 'ram', gait: 2.1, split: ['slimelet', 2] },
  slimelet: { name: '车卒', en: 'Ram crew', hp: 30, spd: 1.2, rad: .26, mass: .9, bounty: 3, lives: 1, hitH: .62, top: 1.3, dmg: 4, atkT: 1.0, scale: .88, death: 'man', cat: 'swarm', blade: true },
  knight: { name: '甲士', en: 'Armoured soldier', hp: 118, spd: 1.0, rad: .3, mass: 2.2, bounty: 15, lives: 1, hitH: .8, top: 1.6, dmg: 11, atkT: 1.05, scale: 1.08, armor: .35, death: 'man', blade: true, cat: 'armor' },
  bat: { name: '火禽', en: 'Fire bird', hp: 15, spd: 2.2, rad: .22, mass: .3, bounty: 6, lives: 1, hitH: 0, top: .35, dmg: 0, atkT: 1, scale: 1.25, fly: true, flyKit: 'bird', death: 'bat', cat: 'air', alt: [2.9, 3.8], flap: 21 },
  ghoul: { name: '先登死士', en: 'Forlorn hope', hp: 40, spd: 1.85, rad: .27, mass: .9, bounty: 7, lives: 1, hitH: .72, top: 1.4, dmg: 9, atkT: .7, scale: .95, frenzy: .55, death: 'man', blade: true },
  spider: { name: '轻兵', en: 'Skirmisher', hp: 20, spd: 2.25, rad: .24, mass: .4, bounty: 3, lives: 1, hitH: .62, top: 1.3, dmg: 4, atkT: .6, scale: .9, slip: true, death: 'man', cat: 'swarm', blade: true },
  scarab: { name: '填壕卒', en: 'Ditch filler', hp: 9, spd: 2.5, rad: .17, mass: .3, bounty: 1, lives: 1, hitH: .55, top: 1.15, dmg: 2, atkT: .6, scale: .8, slip: true, death: 'man', cat: 'swarm' },
  wolf: { name: '轻骑', en: 'Light horseman', hp: 38, spd: 2.7, rad: .32, mass: .9, bounty: 7, lives: 1, hitH: 1.0, top: 2.0, dmg: 12, atkT: .7, scale: .9, death: 'horse', gait: 3.2, cat: 'swarm', blade: true },
  bomber: { name: '猛火油兵', en: 'Fire-oil thrower', hp: 38, spd: 1.55, rad: .27, mass: 1, bounty: 8, lives: 2, hitH: .75, top: 1.55, dmg: 0, atkT: 1, scale: 1, explode: { r: 1.7, dmg: 46, men: 30 }, death: 'man' },
  wraith: { name: '伏兵', en: 'Ambusher', hp: 58, spd: 1.3, rad: .28, mass: 1, bounty: 11, lives: 1, hitH: .7, top: 1.45, dmg: 0, atkT: 1, scale: 1, ghost: [1.7, 3.0], death: 'man' },
  toad: { name: '跳荡兵', en: 'Tang shock trooper', hp: 78, spd: 1.0, rad: .34, mass: 1.8, bounty: 9, lives: 1, hitH: .6, top: 1.35, dmg: 9, atkT: 1.0, scale: 1, hop: [1.2, 2.5], death: 'man', blade: true },
  wisp: { name: '竹火鹞', en: 'Bamboo fire kite', hp: 7, spd: 2.2, rad: .14, mass: .1, bounty: 2, lives: 1, hitH: 0, top: .3, dmg: 0, atkT: 1, scale: 1, fly: true, flyKit: 'crow', death: 'wisp', cat: 'air', alt: [1.3, 2.3], flap: 6, glow: 8 },
  drummer: { name: '战鼓手', en: 'War drummer', hp: 92, spd: 1.15, rad: .3, mass: 1.6, bounty: 14, lives: 1, hitH: .8, top: 2.35, dmg: 6, atkT: 1, scale: 1.05, aura: [3.4, .3], death: 'man' },
  gargoyle: { name: '铁嘴火鹞', en: 'Iron-beaked fire kite', hp: 52, spd: 1.45, rad: .32, mass: 1.2, bounty: 13, lives: 1, hitH: 0, top: .6, dmg: 0, atkT: 1, scale: 1.15, fly: true, flyKit: 'dragon', armor: .72, death: 'rocket', cat: 'air', alt: [2.4, 3.1], flap: 9 },
  necro: { name: '督战校尉', en: 'Battle officer', hp: 105, spd: .85, rad: .3, mass: 1.6, bounty: 18, lives: 1, hitH: .8, top: 2.2, dmg: 5, atkT: 1.2, scale: 1.08, summon: { type: 'skel', n: 2, every: 7.5, max: 3, hp: .6 }, death: 'man' },
  mummy: { name: '轒辒车', en: 'Tortoise cart', hp: 135, spd: .9, rad: .36, mass: 2, bounty: 14, lives: 1, hitH: .7, top: 1.45, dmg: 12, atkT: 1.1, scale: 1, cart: 'tortoise', gait: 2.1, split: ['scarab', 3], death: 'wood' },
  ladder: { name: '云梯兵', en: 'Ladder bearer', hp: 140, spd: 1.4, armor: .6, rad: .3, mass: 1.4, bounty: 9, lives: 1, hitH: .75, top: 1.5, dmg: 5, atkT: 1.0, scale: 1, death: 'man', ladder: true },
  brute: { name: '狼牙棒手', en: 'Mace bearer', hp: 360, spd: .82, rad: .5, mass: 8, bounty: 30, lives: 2, hitH: 1.0, top: 2.05, dmg: 24, atkT: 1.4, scale: 1.4, regen: .035, death: 'man', cat: 'armor' },
  golem: { name: '铁鹞子', en: 'Western Xia iron hawk', hp: 470, spd: .62, rad: .5, mass: 9, bounty: 34, lives: 2, hitH: 1.05, top: 2.3, dmg: 26, atkT: 1.5, scale: 1.05, armor: .35, slowRes: .5, bard: true, death: 'horse', gait: 3.2, cat: 'armor' },
  brood: { name: '战象', en: 'War elephant', hp: 230, spd: .92, rad: .58, mass: 5, bounty: 24, lives: 2, hitH: 1.3, top: 2.6, dmg: 14, atkT: 1.0, scale: 1, split: ['spider', 5], death: 'beast', gait: 2.6 },
  giant: { name: '辽军大将', en: 'Liao general', hp: 1250, spd: .88, rad: .92, mass: 40, bounty: 200, lives: 5, hitH: 2.0, top: 3.9, dmg: 46, atkT: 1.7, scale: 2.6, boss: true, death: 'man', blade: true, cat: 'armor' },
  ogre: { name: '突厥可汗', en: 'Turkic khagan', hp: 1400, spd: .8, rad: 1.0, mass: 46, bounty: 200, lives: 5, hitH: 2.0, top: 3.9, dmg: 52, atkT: 1.8, scale: 2.6, boss: true, death: 'man', blade: true, cat: 'armor' },
  jotun: { name: '铁浮屠', en: 'Jin iron pagoda', hp: 1150, spd: .8, rad: 1.0, mass: 46, bounty: 200, lives: 5, hitH: 1.9, top: 4.2, dmg: 52, atkT: 1.8, scale: 1.85, boss: true, bard: true, gait: 3.2, stomp: { every: 10, r: 5.2, stun: 1.8 }, death: 'horse', blade: true, cat: 'armor' },
  queen: { name: '南汉象阵', en: 'Southern Han elephant corps', hp: 1150, spd: .85, rad: 1.1, mass: 40, bounty: 200, lives: 5, hitH: 2.0, top: 4.2, dmg: 40, atkT: 1.5, scale: 1.65, boss: true, gait: 2.6, summon: { type: 'spider', n: 2, every: 8, max: 99, hp: 1 }, death: 'beast', cat: 'armor' },
  colossus: { name: '云车', en: 'Cloud tower', hp: 1250, spd: .7, rad: 1.05, mass: 60, bounty: 200, lives: 5, hitH: 2.2, top: 6.0, dmg: 60, atkT: 2.0, scale: 1.45, boss: true, armor: .85, slowRes: .3, enrage: [.3, 1.25], cart: 'tower', gait: 2.1, death: 'wood', cat: 'armor' },
  king: { name: '匈奴单于', en: 'Xiongnu chanyu', hp: 1250, spd: .86, rad: .92, mass: 40, bounty: 200, lives: 5, hitH: 2.0, top: 3.9, dmg: 46, atkT: 1.7, scale: 2.6, boss: true, summon: { type: 'wolf', n: 3, every: 9, max: 99, hp: 1 }, death: 'man', blade: true, cat: 'armor' },
};
// The troops the harder grades bring (26-diff.js): Yuan and Ming in the middle grade, the Ming-Qing wars in the hard one.
// lob: a counterweight trebuchet halts once a work or the gate is within range and throws its stones, then marches on. engine: footmen sally out against it.
// charge: a heavy horseman closing on a footman quickens to pace and lands his first blow at blow times its weight.
// mantlet: shots from ahead (arrows, bolts, and gun balls less what they pierce) do front times their damage to the cart and cover times to men
// up to depth behind it within width of its line. mail: a second coat of armour that takes everything but arrows (see armor) and gunpowder down to mail.
// escort: men who march behind the cart, drawn from the column's own budget.
Object.assign(MON, {
  huihui: { name: '回回砲', en: 'Counterweight trebuchet', hp: 420, spd: .5, rad: .58, mass: 14, bounty: 26, lives: 2, hitH: 1.0, top: 3.6, dmg: 6, atkT: 1.4, scale: 1, cart: 'huihui', gait: 1.6, death: 'wood', cat: 'armor', engine: true, split: ['slimelet', 3], lob: { range: 7.8, dmg: 30, gate: 36, every: 5.5, stones: 5, T: 1.7 } },
  dunche: { name: '楯车', en: 'Mantlet cart', hp: 300, spd: .7, rad: .55, mass: 9, bounty: 18, lives: 2, hitH: .8, top: 2.3, dmg: 8, atkT: 1.2, scale: 1, cart: 'dunche', gait: 2.1, death: 'wood', cat: 'armor', split: ['skel', 2], mantlet: { front: .12, cover: .3, depth: 3.4, width: 1.15, arc: -.2 }, escort: ['sibing', 2] },
  sibing: { name: '重甲死兵', en: 'Armoured vanguard', hp: 230, spd: .82, rad: .31, mass: 3, bounty: 15, lives: 1, hitH: .8, top: 1.75, dmg: 14, atkT: 1.2, scale: 1.12, armor: .3, mail: .6, death: 'man', blade: true, cat: 'armor' },
  tammachi: { name: '探马赤军', en: 'Tammachi horse', hp: 150, spd: 2.3, rad: .34, mass: 2.6, bounty: 15, lives: 2, hitH: 1.05, top: 2.25, dmg: 13, atkT: .9, scale: .95, armor: .45, bard: true, death: 'horse', gait: 3.2, cat: 'armor', blade: true, charge: { reach: 3.4, pace: 1.45, blow: 2.5, rest: 6 } },
});

function spawnMonster(type, o = {}) {
  const B = G.B, def = MON[type], hpMul = o.hpMul || 1, bt = B.bio.tints;
  const m = {
    type, def, hp: def.hp * hpMul, maxHp: def.hp * hpMul, s: o.s === undefined ? .7 + rnd() * .5 : o.s, lat: o.lat === undefined ? rr(-.85, .85) : o.lat,
    x: 0, y: 0, z: 0, yaw: 0, ph: rnd() * 6, mv: 1, vf: def.spd, spdNow: def.spd, spdMul: rr(.93, 1.07) * (o.spdMul || 1), slowT: 0, slowF: 0,
    flash: 0, flinch: 0, atk: -1, cd: rr(.1, .5), foe: null, prog: 0, vis: false, dead: false, dying: 0, ks: 0, kl: 0, hop: rnd(), rad: def.rad * (o.radMul || 1), mass: def.mass,
    hitH: def.hitH, scale: def.scale * rr(.95, 1.05), fly: !!def.fly, torch: false, flame: null, tint: (bt && bt[type]) || def.tint || null, men: 0, struck: false, step: 0, alive: true, lI: 0, lx: 0, ly: 0, lz: 0, lseed: rnd() * 9, vx: 0, vz: 0, pop: o.pop || 0,
    haste: 0, hitAt: -9, beat: rnd() * 6, eth: false, gT: rnd() * 4, cast: 0, sumN: 0, sumT: def.summon ? def.summon.every * rr(.45, .7) : 0, stT: def.stomp ? def.stomp.every * .6 : 0, rage: false,
  };
  m.home = m.lane = m.lat;
  if (type === 'skel' && rnd() < .26) { m.torch = true; m.flame = addFlame({ x: 0, y: -50, z: 0, size: .36, embers: .45, glow: .8 }); m.lI = 30; }
  if (type === 'bomber') { m.torch = true; m.flame = addFlame({ x: 0, y: -50, z: 0, size: .3, embers: .7, glow: .7 }); m.lI = 26; }
  if (def.glow) { m.glowL = true; m.lI = def.glow; m.lCol = 0xff9040; }
  if (m.fly) {
    const c = B.cave, b = B.beacon; m.x = c.x + rr(-.5, .5); m.z = c.z + rr(-1, 1); m.y = c.y + 2.2; m.fx0 = m.x; m.fz0 = m.z; m.d0 = Math.hypot(b.x - m.x, b.z - m.z);
    m.alt = rr(def.alt[0], def.alt[1]); m.side = rr(-1.2, 1.2) * (def.glow ? 2.2 : 1); m.vis = true;
  } else { const p = pathAt(B, m.s, _ap); m.x = p.x - p.tz * m.lat; m.z = p.z + p.tx * m.lat; m.y = p.y; }
  G.mons.push(m); return m;
}
function removeMonster(m) { m.dead = true; m.alive = false; if (m.flame) { removeFlame(m.flame); m.flame = null; } if (m.foe) { m.foe = null; } }

function slowMonster(m, f, t) { if (m.def.boss) { f *= .4; t *= .6; } if (m.def.slowRes) f *= 1 - m.def.slowRes; m.slowF = Math.max(m.slowF, f); m.slowT = Math.max(m.slowT, t); }
// pierce: the share of armour a gun ball goes through (60-towers.js); arrows meet the whole of it, everything else none
function hitMonster(m, dmg, kind, dx, dz, tower, pierce = 0) {
  if (m.dead || m.hp <= 0) return false;
  if (m.eth) { if (kind === 'arrow' || kind === 'sword') { if (rnd() < .5) fxTimed(0, m.x + rr(-.2, .2), m.y + m.hitH + rr(-.2, .3), m.z + rr(-.2, .2), .5, .5, .5, .9, 1.8, .7, .18); return false; } dmg *= .5; }
  if (kind === 'arrow' && m.def.armor) { dmg *= m.def.armor; if (rnd() < .6) { fxSparks(m.x, m.y + m.hitH, m.z, 3, 3, 2.4, 2.2, 1.6, { size: .05 }); } }
  if (kind === 'ball' && m.def.armor) dmg *= lerp(m.def.armor, 1, pierce);
  if (m.def.mail && kind !== 'arrow' && kind !== 'ball' && kind !== 'shot') dmg *= m.def.mail;
  if (MANTLET.live && (kind === 'arrow' || kind === 'bolt' || kind === 'ball')) dmg *= mantletK(m, kind, dx, dz, pierce);
  m.hp -= dmg; m.flash = 1; m.flinch = m.def.boss ? Math.max(m.flinch, .25) : 1; m.hitAt = G.t;
  const kb = (kind === 'blast' ? 2.6 : kind === 'sword' ? 1.3 : kind === 'arrow' ? .7 : .2) / Math.sqrt(m.mass);
  if (!m.fly && (dx || dz)) { const p = pathAt(G.B, m.s, _ap); m.ks += (dx * p.tx + dz * p.tz) * kb; m.kl += (-dx * p.tz + dz * p.tx) * kb; }
  if (tower) { tower.dealt += dmg; tower.recent += dmg; }
  if (m.hp <= 0) { killMonster(m, kind, dx, dz, tower); return true; }
  return false;
}
// The mantlet carts on the field (counted once a step in foeUpdate) and what they take off a shot at m coming the way dx, dz.
const MANTLET = { live: 0 };
function mantletK(m, kind, dx, dz, pierce) {
  const l = Math.hypot(dx, dz); if (!l) return 1; const ux = dx / l, uz = dz / l; let k = 1;
  for (const c of G.mons) {
    const M = c.def.mantlet; if (!M || c.dead || c.hp <= 0 || c.wallSt || ux * Math.sin(c.yaw) + uz * Math.cos(c.yaw) > M.arc) continue;
    if (c === m) k = Math.min(k, M.front); else if (!m.fly && !m.wallSt && c.s > m.s && c.s - m.s < M.depth && Math.abs(c.lat - m.lat) < M.width) k = Math.min(k, M.cover);
  }
  if (k < 1) { const c = m.def.mantlet ? m : null; fxSparks(m.x - ux * (c ? .6 : .3), m.y + m.hitH, m.z - uz * (c ? .6 : .3), 2, 2, 2.4, 2, 1.4, { size: .045 }); }
  return kind === 'ball' ? lerp(k, 1, pierce) : k;
}
function dropCoins(x, y, z, bounty, n) {
  G.gold += bounty; const each = bounty / n;
  for (let i = 0; i < n; i++) {
    _tm.compose(_tv.set(x + rr(-.15, .15), y + .3, z + rr(-.15, .15)), _tq.set(rr(-1, 1), rr(-1, 1), rr(-1, 1), 1).normalize(), _ts.set(1, 1, 1));
    const d = addDebris(KIT.coin, _tm, null, rr(-1.6, 1.6), rr(3.6, 6.2), rr(-1.6, 1.6), rr(8, 16), 3, { coin: rr(.5, .8), bounce: .5 });
    if (d) d.value = each; else UI.goldShown += each;
  }
}
function blastAround(m, ex) {
  fxExplosion(m.x, m.y + .3, m.z, .62); sfx('explode', m.x, m.z, .8, rnd());
  for (const o of G.mons) { if (o === m || o.dead || o.fly || o.hp <= 0) continue; const d = Math.hypot(o.x - m.x, o.z - m.z); if (d < ex.r + o.rad) hitMonster(o, ex.dmg * (1 - .5 * d / (ex.r + o.rad)), 'blast', (o.x - m.x) / (d || 1), (o.z - m.z) / (d || 1), null); }
  for (const f of G.men) { if (f.dead) continue; const d = Math.hypot(f.x - m.x, f.z - m.z); if (d < ex.r) { f.hp -= ex.men * G.dmgMul * .6; f.flash = 1; f.flinch = 1; if (f.hp <= 0) killFootman(f, (f.x - m.x) / (d || 1), (f.z - m.z) / (d || 1)); } }
}
function killMonster(m, kind, dx, dz, tower) {
  const B = G.B, def = m.def, t = m.type, dth = def.death; if (tower) tower.kills++;
  if (def.boss) { m.dying = 1.9; m.hp = 0; m.foe = null; G.slowmo = 1.4; sfx('roar', m.x, m.z, 1, 1); return; }
  G.slain++; G.waveKills++;
  const ix = (dx || 0) * 2.2, iz = (dz || 0) * 2.2, up = kind === 'blast' ? 1.7 : 1, sc = m.scale;
  if (dth === 'man') { shatter(e => rigMonster(e), m, [ix, 1.3 * up, iz], { spread: kind === 'blast' ? 2.4 : 1.3, life: .8, up }); sfx('footmanDie', m.x, m.z, .55, rnd()); fxDust(m.x, m.y + .1, m.z, 3, .5 * sc + .2, { a: .35 }); FX.decals.add(B.heightAt, m.x, m.z, .3 * sc + .2, .03, .014, .012, .45, 12); }
  else if (dth === 'horse') { shatter(e => rigMonster(e), m, [ix + m.vx * .3, 1.2 * up, iz + m.vz * .3], { spread: 1.4, life: .8, up }); sfx('footmanDie', m.x, m.z, .7, .2); sfx('bossStep', m.x, m.z, .5, .3); fxDust(m.x, m.y + .1, m.z, 6, .9 * sc, { speed: 2.4 }); FX.decals.add(B.heightAt, m.x, m.z, .5 * sc + .2, .03, .014, .012, .5, 14); }
  else if (dth === 'beast') { shatter(e => rigMonster(e), m, [ix, 1.4 * up, iz], { spread: 1.6, life: .9, up }); sfx('roar', m.x, m.z, .5, .2); fxDust(m.x, m.y + .2, m.z, 8, 1.2 * sc, { speed: 2.8 }); FX.decals.add(B.heightAt, m.x, m.z, .8 * sc, .03, .014, .012, .55, 18); }
  else if (dth === 'wood') {
    shatter(e => rigMonster(e), m, [ix, 1.6 * up, iz], { spread: 1.8, life: .9 }); sfx('hammer', m.x, m.z, 1, rnd()); sfx('crumble', m.x, m.z, .25, .2); fxDust(m.x, m.y + .2, m.z, 6 + Math.round(sc * 3), .8 * sc, { speed: 2.4 });
    for (let i = 0; i < 6; i++) { _tm.compose(_tv.set(m.x + rr(-.4, .4) * sc, m.y + rr(.3, 1) * sc, m.z + rr(-.4, .4) * sc), _tq.set(rr(-1, 1), rr(-1, 1), rr(-1, 1), 1).normalize(), _ts.setScalar(rr(.7, 1.2))); addDebris(KIT.plank, _tm, null, rr(-2.5, 2.5) + ix, rr(2, 4.5), rr(-2.5, 2.5) + iz, rr(3, 9), rr(2.5, 4)); }
  }
  else if (dth === 'rocket') { shatter(e => rigMonster(e), m, [ix + m.vx * .5, .6, iz + m.vz * .5], { spread: 1.4, life: .6 }); fxExplosion(m.x, m.y, m.z, .45); sfx('explode', m.x, m.z, .5, .1); }
  else if (dth === 'bones') { shatter(e => rigMonster(e), m, [ix, 1.2 * up, iz], { spread: kind === 'blast' ? 2.6 : 1.5, up }); sfx('boneRattle', m.x, m.z, .8, rnd()); fxDust(m.x, m.y + .1, m.z, 3, .6, { a: .35 }); }
  else if (dth === 'fur') { shatter(e => rigMonster(e), m, [ix, 2.2 * up, iz], { spread: 1.2, life: .6 }); sfx('ratSqueal', m.x, m.z, .55, rnd()); fxDust(m.x, m.y + .1, m.z, 2, .4, { a: .3 }); }
  else if (dth === 'bat') { shatter(e => rigMonster(e), m, [ix + m.vx * .5, .5, iz + m.vz * .5], { spread: 1.0, life: .7 }); sfx('batScreech', m.x, m.z, .6, rnd()); }
  else if (dth === 'flesh') { shatter(e => rigMonster(e), m, [ix, 1.6 * up, iz], { spread: 1.5, life: .7, up }); sfx('squelch', m.x, m.z, .7, .5); fxDust(m.x, m.y + .1, m.z, 3 + Math.round(sc * 2), .5 * sc + .3, { a: .35 }); FX.decals.add(B.heightAt, m.x, m.z, .5 * sc + .3, .03, .012, .012, .6, 16); }
  else if (dth === 'bug') { shatter(e => rigMonster(e), m, [ix, 1.8 * up, iz], { spread: 1.6, life: .55 }); sfx('squelch', m.x, m.z, .5, .9); FX.decals.add(B.heightAt, m.x, m.z, .35 * sc + .15, .02, .03, .012, .6, 14); for (let i = 0; i < 3; i++) fxSmoke(m.x, m.y + .15, m.z, rr(-1, 1), rr(.4, 1), rr(-1, 1), rr(.3, .6), .25 * sc, .4, .14, .22, .1, .45, { drag: 3 }); }
  else if (dth === 'rock') {
    shatter(e => rigMonster(e), m, [ix + m.vx * .4, 1.4 * up, iz + m.vz * .4], { spread: 1.8, life: .9 }); sfx('hammer', m.x, m.z, 1, rnd()); fxDust(m.x, m.y + .2, m.z, 6 + Math.round(sc * 3), .7 * sc, { speed: 2.4 });
    for (let i = 0; i < 5; i++) { _tm.compose(_tv.set(m.x + rr(-.3, .3) * sc, m.y + rr(.2, 1) * sc, m.z + rr(-.3, .3) * sc), _tq.identity(), _ts.setScalar(rr(.6, 1.2))); addDebris(KIT.rubble, _tm, m.tint, rr(-2.5, 2.5) + ix, rr(2, 4.5), rr(-2.5, 2.5) + iz, rr(3, 9), rr(2.5, 4)); }
  }
  else if (dth === 'ghost') { shatter(e => rigMonster(e), m, [ix * .4, 2.2, iz * .4], { spread: .8, life: .45 }); sfx('batScreech', m.x, m.z, .45, .1); fxTimed(5, m.x, m.y + .8, m.z, 2.4, 2.4, .5, 1.1, 2.2, .9, .3); for (let i = 0; i < 6; i++) fxSmoke(m.x + rr(-.2, .2), m.y + rr(.2, 1.2), m.z + rr(-.2, .2), rr(-.5, .5), rr(.6, 1.6), rr(-.5, .5), rr(.6, 1.1), .4, .7, .3, .42, .6, .4, { drag: 1.5, rise: .3 }); }
  else if (dth === 'wisp') { const c = m.tint || [1, 1, 1]; fxTimed(5, m.x, m.y, m.z, 1.5, 1.5, c[0] * 2, c[1] * 2, c[2] * 2, .9, .22); fxSparks(m.x, m.y, m.z, 7, 3.2, c[0] * 2.4, c[1] * 2.4, c[2] * 2.4, { size: .05, grav: 2 }); sfx('ignite', m.x, m.z, .35, rnd()); }
  else {
    const big = t === 'slime', n = big ? 14 : 7;
    for (let i = 0; i < n; i++) { _tm.compose(_tv.set(m.x + rr(-.2, .2) * sc, m.y + rr(.1, .5) * sc, m.z + rr(-.2, .2) * sc), _tq.identity(), _ts.setScalar(rr(.8, 1.8) * sc)); addDebris(KIT.goo, _tm, null, rr(-3, 3) + ix, rr(2, 5.5), rr(-3, 3) + iz, 0, 2, { goo: 1 }); }
    FX.decals.add(B.heightAt, m.x, m.z, .95 * sc + .2, .012, .034, .014, .75, 22);
    fxTimed(4, m.x, m.y + .08, m.z, 2.6 * sc, 2.6 * sc, .25, .8, .2, .6, .3, { ground: true });
    for (let i = 0; i < 5; i++) fxSmoke(m.x, m.y + .3, m.z, rr(-1, 1), rr(.5, 1.5), rr(-1, 1), rr(.4, .8), .35 * sc, .5, .12, .3, .12, .5, { drag: 3 });
    sfx('squelch', m.x, m.z, .8, big ? .8 : .2);
  }
  if (def.split && G.mons.length < 90) { const [ty, n] = def.split; for (let i = 0; i < n; i++) { const u = n > 1 ? i / (n - 1) * 2 - 1 : 0; spawnMonster(ty, { s: Math.max(.5, m.s - .15 - .1 * Math.abs(u)), lat: clamp(m.lat + u * .34, -.95, .95), hpMul: m.maxHp / def.hp, pop: 1 }).kl = u * 2.2; } }
  if (m.torch && m.flame) fxEmbers(m.flame.x, m.flame.y, m.flame.z, 8, .15);
  dropCoins(m.x, m.y + m.hitH * .6, m.z, Math.round(def.bounty * G.bountyMul), clamp(Math.round(def.bounty / 3), 1, 6));
  removeMonster(m);
  if (def.explode) blastAround(m, def.explode);
}
function finishBoss(m) {
  G.slain++; G.waveKills++;
  shatter(e => rigMonster(e), m, [0, 2.5, 0], { spread: 3.4, up: 1.5, life: 1.5, hold: .25 });
  fxDust(m.x, m.y + .2, m.z, 26, 2.4, { speed: 4.5, life: 1.6 }); fxExplosion(m.x, m.y + 1, m.z, .9); FX.shake = 1.2;
  FX.decals.add(G.B.heightAt, m.x, m.z, 2.6, .02, .017, .015, .8, 60);
  sfx('bossDie', m.x, m.z, 1.2, 1);
  dropCoins(m.x, m.y + 1.4, m.z, Math.round(m.def.bounty * G.bountyMul), 26);
  G.bossDown = true; removeMonster(m);
}

const _lq = new THREE.Quaternion(), _ly = new THREE.Vector3(0, 1, 0), _lv = new THREE.Vector3(), _lm = new THREE.Matrix4(), _ls = new THREE.Vector3(1, 1, 1);
const RIGS = {
  skel(m) { m.weapon = KIT.item.dao; return rigHuman(KIT.foe, SPEC.foot, m); },
  knight(m) { m.weapon = KIT.item.dao; m.wScale = 1.1; m.shield = KIT.item.shieldR; m.helm = true; m.plate = true; return rigHuman(KIT.foe, SPEC.foot, m); },
  rat(m) { m.weapon = KIT.item.saber; m.hat = KIT.item.furHat; return rigHuman(KIT.hu, SPEC.crouch, m); },
  slimelet(m) { m.weapon = KIT.item.dao; return rigHuman(KIT.light, SPEC.foot, m); },
  scarab(m) { m.weapon = null; return rigHuman(KIT.light, SPEC.crouch, m); },
  spider(m) { m.weapon = KIT.item.spear; m.wScale = .8; return rigHuman(KIT.light, SPEC.crouch, m); },
  ghoul(m) { m.weapon = KIT.item.dao; m.hat = KIT.item.band; return rigHuman(KIT.light, SPEC.crouch, m); },
  toad(m) { m.weapon = KIT.item.dao; m.shield = KIT.item.tengpai; m.hat = KIT.item.band; return rigHuman(KIT.light, SPEC.crouch, m); },
  wraith(m) { m.weapon = KIT.item.dao; m.hat = KIT.item.kasa; return rigHuman(KIT.foe, SPEC.crouch, m); },
  bomber(m) { m.keg = true; m.hat = KIT.item.ironCap; return rigHuman(KIT.foe, SPEC.foot, m); },
  drummer(m) { m.weapon = KIT.item.mallet; m.drum = true; m.back = KIT.item.banner; return rigHuman(KIT.foe, SPEC.foot, m); },
  necro(m) { m.weapon = KIT.item.flagstaff; m.staff = true; m.helm = true; return rigHuman(KIT.chief, SPEC.foot, m); },
  ladder(m) { m.weapon = null; m.hat = KIT.item.band; const M = rigHuman(KIT.light, SPEC.foot, m); if (!m.wallSt || m.wallSt === 'toLadder') { _lq.setFromUnitVectors(_ly, _lv.set(Math.sin(m.yaw), .1, Math.cos(m.yaw)).normalize()); KIT.item.ladder.put(_lm.compose(_lv.set(m.x - Math.sin(m.yaw) * 1.7 + Math.cos(m.yaw) * .2, m.y + 1.02 * m.scale, m.z - Math.cos(m.yaw) * 1.7 - Math.sin(m.yaw) * .2), _lq, _ls), m.flash || 0, null); } return M; },
  brute(m) { m.weapon = KIT.item.club; m.wScale = 1.1; m.heavy = true; m.plate = true; m.hat = KIT.item.ironCap; return rigHuman(KIT.foe, SPEC.foot, m); },
  giant(m) { m.weapon = KIT.item.guandao; m.wScale = 1.0; m.heavy = true; m.general = true; return rigHuman(KIT.chief, SPEC.foot, m); },
  ogre(m) { m.weapon = KIT.item.saber; m.wScale = 1.5; m.heavy = true; m.hat = KIT.item.khanHat; return rigHuman(KIT.hu, SPEC.foot, m); },
  king(m) { m.weapon = KIT.item.saber; m.wScale = 1.5; m.heavy = true; m.hat = KIT.item.khanHat; m.back = KIT.item.banner; return rigHuman(KIT.hu, SPEC.foot, m); },
  wolf(m) { m.weapon = KIT.item.saber; m.hat = KIT.item.furHat; m.riderKit = KIT.hu; return rigHorse(m); },
  golem(m) { m.weapon = KIT.item.spear; m.helm = true; m.plate = true; m.riderKit = KIT.foe; return rigHorse(m); },
  jotun(m) { m.weapon = KIT.item.spear; m.wScale = 1.2; m.helm = true; m.plate = true; m.riderKit = KIT.chief; return rigHorse(m); },
  tammachi(m) { if (!KIT.gun) gradeKits(); m.weapon = KIT.item.spear; m.wScale = 1.15; m.plate = true; m.helm = false; m.hat = KIT.item.mgHelm; m.riderKit = KIT.hu; m.horseTint = [1.35, 1.25, 1.15]; return rigHorse(m); },
  huihui: m => rigHuihui(m),
  dunche: m => rigDunche(m),
  sibing(m) { if (!KIT.gun) gradeKits(); m.weapon = KIT.item.spear; m.wScale = 1.1; m.plate = true; m.back = KIT.item.sbJia; m.skirt = KIT.item.sbSkirt; m.hat = KIT.item.jinHelm; return rigHuman(KIT.foe, SPEC.foot, m); },
  brood: rigElephant, queen: rigElephant,
  slime: rigCart, mummy: rigCart, colossus: rigCart,
  bat: rigFlyer, wisp: rigFlyer, gargoyle: rigFlyer,
};
function rigMonster(m) { return RIGS[m.type](m); }
const EYES = {};
function drawMonster(m, t) {
  const M = rigMonster(m), ey = EYES[m.type], c = m.def.eye, sc = m.scale, tw = .8 + .2 * Math.sin(t * 9 + m.lseed * 7), ty = m.type;
  if (ey) {
    for (const sg of [-1, 1]) { _tv.set(sg * ey[0], ey[1], ey[2]).applyMatrix4(M); FX.add.push(_tv.x, _tv.y, _tv.z, ey[3] * sc * 1.5, ey[3] * sc * 1.5, 0, 0, c[0], c[1], c[2], tw, 0, 0, 0, 0); }
    _tv.set(0, ey[1], ey[2]).applyMatrix4(M); FX.add.push(_tv.x, _tv.y, _tv.z, ey[3] * sc * 9, ey[3] * sc * 9, 0, 0, c[0] * .3, c[1] * .3, c[2] * .3, .5 * tw, 2, 0, 0, 0);
  }
  if (ty === 'wisp' || ty === 'gargoyle') { rocketTrail(m, ty === 'wisp' ? 'crow' : 'dragon'); m.lx = m.x; m.ly = m.y; m.lz = m.z; }
  else if (ty === 'bat') { const p = _tv.set(0, -.18, .02).applyMatrix4(M); FX.add.push(p.x, p.y, p.z, .22, .22, 0, 0, 3.2, 1.5, .4, tw, 0, 0, 0, 0); if (rnd() < .3) fxPart(p.x, p.y, p.z, rr(-.2, .2), rr(-.3, .1), rr(-.2, .2), rr(.3, .6), .04, 2.6, 1.1, .2, { drag: 1 }); }
  else if (ty === 'wraith') { if (m.eth && rnd() < .35) fxSmoke(m.x + rr(-.3, .3), m.y + rr(.1, 1.1), m.z + rr(-.3, .3), rr(-.3, .3), rr(.1, .4), rr(-.3, .3), rr(.7, 1.2), .3, .45, .2, .2, .19, .5, { drag: 1.5, rise: .1 }); }
  else if (ty === 'colossus' && rnd() < (m.rage ? .6 : .04)) fxPart(m.x + rr(-.7, .7), m.y + rr(.6, 4), m.z + rr(-.7, .7), rr(-.3, .3), rr(.6, 1.8), rr(-.3, .3), rr(.6, 1.2), rr(.05, .08), 2.6, .9, .15, { drag: .3, wob: 1, rise: .3 });
  if (m.torch && m.flame) { const p = RIGOUT.torch; m.flame.x = p.x; m.flame.y = p.y; m.flame.z = p.z; m.lx = p.x; m.ly = p.y + .2; m.lz = p.z; }
  if (m.vis || m.fly) G.hbars.push({ x: m.x, y: m.y + m.def.top * sc / m.def.scale + .22, z: m.z, f: sat(m.hp / m.maxHp), boss: !!m.def.boss, man: false, name: m.def.boss ? m.def.name : null });
}

function dressFootman(f) {
  // Qin: studded lamellar, topknot and the bronze ge. Han: iron lamellar, ring-pommel sword and shield. Tang: bright-light armour and the mo dao. Song: full infantry armour and the horse-cutting sword.
  const I = KIT.item, lv = f.tower ? f.tower.lvl : 0; f.wScale = 1; f.hat = null; f.back = null; f.skirt = null; f.helm = false;
  if (lv === 0) { f.weapon = f.torch ? I.blade : I.ge; f.shield = null; f.back = I.qinJia; f.hat = I.qinBun; }
  else if (lv === 1) { f.weapon = I.blade; f.shield = f.torch ? null : I.shieldH; f.helm = true; }
  else if (lv === 2) { f.weapon = f.torch ? I.blade : I.modao; f.shield = null; f.back = I.mingguang; f.hat = I.tangHelm; }
  else { f.weapon = f.torch ? I.blade : I.zhanma; f.wScale = 1.1; f.shield = null; f.back = I.buren; f.skirt = I.burenSkirt; f.helm = true; }
}
function spawnFootman(tower) {
  const d = tower.def, lvl = tower.lvl, door = tower.w(tower.mounts.door, {});
  const used = tower.men.map(f => f.slot); let slot = 0; while (used.includes(slot)) slot++;
  const f = {
    isMan: true, tower, slot, x: door.x, y: door.y, z: door.z, yaw: tower.yaw, ph: 0, mv: 0, atk: -1, flinch: 0, flash: 0, hp: d.hp[lvl], maxHp: d.hp[lvl], dmg: d.dmg[lvl],
    rad: .26, mass: 7, s: tower.pad.s, lat: 0, onRoad: false, state: 'march', target: null, cd: rr(.2, .6), torch: slot === 0, gone: false, dead: false, vf: 0, scale: .9 + lvl * .04,
    struck: false, alive: true, lI: slot === 0 ? 32 : 0, lx: 0, ly: 0, lz: 0, lseed: rnd() * 9, flame: null, leave: false, lvlUp: false, weapon: null, shield: null, age: 0, foes: 0,
  };
  if (f.torch) f.flame = addFlame({ x: door.x, y: -50, z: door.z, size: .34, embers: .45, glow: .8 });
  tower.men.push(f); G.men.push(f); return f;
}
function killFootman(f, dx, dz) {
  f.dead = true; f.alive = false; f.gone = true; if (f.flame) { fxEmbers(f.flame.x, f.flame.y, f.flame.z, 6, .1); removeFlame(f.flame); f.flame = null; }
  dressFootman(f);
  shatter(e => rigHuman(KIT.foot, SPEC.foot, e), f, [(dx || 0) * 1.6, .8, (dz || 0) * 1.6], { spread: .9, life: .8 });
  fxDust(f.x, f.y + .1, f.z, 3, .5, { a: .35 }); sfx('footmanDie', f.x, f.z, .8);
}
function slotPos(f, out) {
  // two or three men stand abreast; a fourth and fifth (66-crew.js) form a second rank behind them
  const B = G.B, n = crewMen(f.tower), k = f.slot % n, nf = n <= 3 ? n : n === 4 ? 2 : 3, back = k >= nf, w = back ? n - nf : nf, j = back ? k - nf : k;
  const lat = (w === 1 ? [0] : w === 2 ? [-.48, .48] : [-.66, 0, .66])[j] || 0;
  const p = pathAt(B, Math.min(B.L - .2, (f.muster != null ? f.muster : f.tower.pad.s) + (back ? .7 : 0)), out); p.x += -p.tz * lat; p.z += p.tx * lat; return p;
}
const _fp = { x: 0, y: 0, z: 0, tx: 0, tz: 0 };
// how far along the road the footmen of a post will sally out to fall on a siege engine that has halted to shoot
const FOOT_SALLY = 7;
function footmanThink(f, dt) {
  const B = G.B, tw = f.tower; f.age += dt;
  if (f.lvlUp) { f.lvlUp = false; const d = tw.def, r = f.hp / f.maxHp; f.maxHp = d.hp[tw.lvl]; f.hp = f.maxHp * Math.max(r, .6); f.dmg = d.dmg[tw.lvl]; f.scale = .9 + tw.lvl * .04; }
  if (!tw.alive) f.leave = true;
  let gx, gz, face = null, speed = 2.1, fighting = false;
  const rally = slotPos(f, _fp), rs = f.muster != null ? f.muster : tw.pad.s; // muster: the general's rallying horn (64-hero.js) calls the men to the wall foot
  if (f.leave) { f.gone = true; f.alive = false; if (f.flame) { removeFlame(f.flame); f.flame = null; } fxDust(f.x, f.y + .3, f.z, 4, .6); return; }
  let m = f.target;
  if (m && (m.dead || m.hp <= 0 || Math.abs(m.s - rs) > (m.def.engine ? FOOT_SALLY + 1.5 : 3.0) || m.dying || (m.wallSt && !m.rove))) { if (m.foe === f) m.foe = null; m.men = Math.max(0, m.men - 1); m = f.target = null; }
  if (!m && f.state !== 'march' && Math.abs(f.s - rs) < 4) {
    let best = null, bd = 1e9;
    for (const q of G.mons) { if (q.dead || q.fly || q.hp <= 0 || !q.vis || q.dying || q.def.ghost || (q.wallSt && !q.rove)) continue; if (Math.abs(q.s - rs) > (q.def.engine && q.lobT ? FOOT_SALLY : 2.5)) continue; const d = dist2(f.x, f.z, q.x, q.z) + q.men * 6; if (d < bd) { bd = d; best = q; } }
    if (best) { m = f.target = best; best.men++; }
  }
  if (m) {
    const p = pathAt(B, m.s, _ap), reach = m.rad + f.rad + .14;
    gx = m.x + p.tx * reach; gz = m.z + p.tz * reach;
    const d = Math.hypot(m.x - f.x, m.z - f.z);
    face = Math.atan2(m.x - f.x, m.z - f.z);
    if (d < reach + .3) { fighting = true; if (!m.foe && !m.def.slip) m.foe = f; if (d < reach + .12) { gx = f.x; gz = f.z; } }
  } else { gx = rally.x; gz = rally.z; if (Math.abs(f.s - rs) > 2.5) { const q = pathAt(B, f.onRoad ? f.s + Math.sign(rs - f.s) * 1.6 : f.s, _ap); gx = q.x; gz = q.z; speed = 4.2; } if (f.state === 'march' && Math.hypot(gx - f.x, gz - f.z) < .2) f.state = 'ready'; }
  const dx = gx - f.x, dz = gz - f.z, dl = Math.hypot(dx, dz);
  if (dl > .06) { const st = Math.min(dl, speed * dt); f.x += dx / dl * st; f.z += dz / dl * st; f.ph += st * 6.2; f.mv = damp(f.mv, 1, 12, dt); if (!fighting) face = Math.atan2(dx, dz); }
  else { f.mv = damp(f.mv, 0, 10, dt); if (!m) { const p = pathAt(B, rs, _ap); face = Math.atan2(-p.tx, -p.tz); } }
  if (face !== null) f.yaw = angDamp(f.yaw, face, 12, dt);
  f.cd -= dt;
  if (f.atk >= 0) {
    f.atk += dt / .58;
    if (f.atk >= .5 && !f.struck) { f.struck = true; if (m && !m.dead && Math.hypot(m.x - f.x, m.z - f.z) < m.rad + f.rad + .75) strike(f, m, f.dmg, true); }
    if (f.atk >= 1) { f.atk = -1; f.cd = rr(.3, .5); }
  } else if (fighting && f.cd <= 0) { f.atk = 0; f.struck = false; }
  f.flash = Math.max(0, f.flash - dt * 7); f.flinch = Math.max(0, f.flinch - dt * 4.5);
  const q = pathNear(B, f.x, f.z, f.s, 20); f.s = q.s; f.lat = q.lat; f.onRoad = Math.abs(q.lat) < ROAD_HALF + .3;
  f.y = f.onRoad ? B.py[q.i] + .03 : B.heightAt(f.x, f.z);
}
function strike(a, b, dmg, byMan) {
  const dx = b.x - a.x, dz = b.z - a.z, l = Math.hypot(dx, dz) || 1, mx = (a.x + b.x) / 2, mz = (a.z + b.z) / 2, big = !!(a.def && a.def.boss);
  const my = a.y + (byMan ? .85 : (a.hitH || .7) * (big ? .6 : 1)) + .1;
  const rx = Math.cos(CAM.yaw), rz = -Math.sin(CAM.yaw), se = Math.sin(CAM.elev), ux = -se * Math.sin(CAM.yaw), uz = -se * Math.cos(CAM.yaw);
  const rot = Math.atan2(dx * ux + dz * uz, dx * rx + dz * rz);
  const blade = byMan || (a.def && a.def.blade) || big, ch = !byMan && a.def && a.def.charge;
  // the first blow of a charging horseman lands with the weight of horse and rider behind it
  if (ch && G.t - (a.chargedAt || -99) > ch.rest) { a.chargedAt = G.t; a.charging = false; dmg *= ch.blow; fxDust(b.x, b.y + .1, b.z, 8, 1, { speed: 2.6 }); FX.shake = Math.min(1, FX.shake + .2); sfx('bossStep', b.x, b.z, .7, .4); }
  if (blade) fxTimed(7, mx, my, mz, big ? 4.2 : 1.55, big ? 4.2 : 1.55, byMan ? 2.2 : 2.0, byMan ? 2.2 : 1.7, byMan ? 2.4 : 1.3, .9, .2, { rot });
  if (byMan) { const metal = !!b.def.armor || (b.def.death === 'bones' && rnd() < .4); fxSparks(b.x - dx / l * b.rad, my, b.z - dz / l * b.rad, metal ? 7 : 3, 3.6, 3, 2.3, 1.2, { size: .055, grav: 7 }); sfx(metal ? 'clash' : 'slash', mx, mz, .7, rnd()); hitMonster(b, dmg, 'sword', dx / l, dz / l, a.tower); a.tower.recent += dmg * .5; }
  else {
    if (big) { fxDust(b.x, b.y + .1, b.z, 10, 1.4, { speed: 3 }); FX.shake = Math.min(1.2, FX.shake + .5); sfx('bossStep', b.x, b.z, 1, 1); fxTimed(4, b.x, b.y + .08, b.z, 4.5, 4.5, 1.2, .9, .6, .5, .35, { ground: true }); }
    const hitList = big ? G.men.filter(f => !f.dead && Math.hypot(f.x - b.x, f.z - b.z) < 1.5) : [b];
    for (const f of hitList) {
      f.hp -= dmg; f.flash = 1; f.flinch = 1;
      if (!f.torch && rnd() < .65) { fxSparks(f.x - dx / l * .2, my, f.z - dz / l * .2, 5, 3.2, 3, 2.3, 1.3, { size: .055, grav: 7 }); if (f === b) sfx('clash', mx, mz, .6, rnd()); } else if (f === b) sfx('slash', mx, mz, .55, rnd());
      if (f.hp <= 0) { killFootman(f, dx / l, dz / l); foeKill(a); }
    }
  }
}
function drawFootman(f) {
  dressFootman(f);
  rigHuman(KIT.foot, SPEC.foot, f);
  if (f.torch && f.flame) { const p = RIGOUT.torch; f.flame.x = p.x; f.flame.y = p.y; f.flame.z = p.z; f.lx = p.x; f.ly = p.y + .2; f.lz = p.z; }
  if (f.hp < f.maxHp) G.hbars.push({ x: f.x, y: f.y + 1.55 * f.scale, z: f.z, f: sat(f.hp / f.maxHp), boss: false, man: true });
}

const _units = [];
function updateUnits(dt) {
  const B = G.B, mons = G.mons, men = G.men, L = B.L, maxLatBase = ROAD_HALF + .04, gateS = L - .35;
  for (let i = men.length - 1; i >= 0; i--) { const f = men[i]; if (f.gone) { swapRemove(men, i); continue; } footmanThink(f, dt); if (f.gone) swapRemove(men, i); }
  _units.length = 0;
  for (const m of mons) { m.haste = 0; if (!m.dead && !m.fly && !m.def.ghost && !m.wallSt) _units.push(m); }
  for (const d of mons) if (!d.dead && d.def.aura && d.vis && !d.dying) for (const m of mons) if (m !== d && !m.dead && !m.fly && !m.def.boss && Math.abs(m.s - d.s) < d.def.aura[0]) m.haste = d.def.aura[1];
  for (const f of men) if (!f.dead && f.onRoad) _units.push(f);
  const U = _units, nu = U.length;
  for (const m of mons) {
    if (m.dead) continue;
    m.flash = Math.max(0, m.flash - dt * 7); m.flinch = Math.max(0, m.flinch - dt * 4.2);
    if (m.slowT > 0) { m.slowT -= dt; if (m.slowT <= 0) m.slowF = 0; }
    if (m.fly) { updateBat(m, dt); continue; }
    const def = m.def, maxLat = Math.max(0, maxLatBase - m.rad * .7);
    if (m.dying > 0) {
      m.dying -= dt; m.flinch = .5 + .5 * Math.sin(m.dying * 22); m.mv = 0; m.atk = -1; m.y -= dt * .12;
      if (rnd() < dt * 14) fxDust(m.x + rr(-.8, .8), m.y + rr(.4, 2.6), m.z + rr(-.8, .8), 1, .7, { a: .4 });
      if (m.dying <= 0) finishBoss(m); continue;
    }
    if (def.ladder && !m.wallSt && m.s > gateS - 4.5) tryLadder(m);
    if (m.wallSt) { if (m.rove) updateRover(m, dt); else updateStormer(m, dt); continue; }
    if (m.foe && (m.foe.dead || m.foe.gone || (def.engine && Math.hypot(m.foe.x - m.x, m.foe.z - m.z) > 2.2))) m.foe = null;
    if (def.explode && m.foe) { m.hp = 0; killMonster(m, 'blast', 0, 0, null); continue; }
    if (def.regen && m.hp < m.maxHp && G.t - m.hitAt > 2.2) m.hp = Math.min(m.maxHp, m.hp + m.maxHp * def.regen * dt);
    if (def.ghost) { m.gT = (m.gT + dt) % (def.ghost[0] + def.ghost[1]); m.eth = m.gT < def.ghost[0]; }
    if (def.aura) { const b0 = m.beat; m.beat += dt * 7.5; if (m.vis && Math.floor(m.beat / TAU) !== Math.floor(b0 / TAU)) fxTimed(4, m.x, m.y + .08, m.z, def.aura[0] * 1.5, def.aura[0] * 1.5, 1.4, .5, .2, .22, .5, { ground: true }); }
    if (m.cast > 0) m.cast = Math.max(0, m.cast - dt * 1.1);
    if (def.summon && m.vis) {
      m.sumT -= dt;
      if (m.sumT <= 0 && m.sumN < def.summon.max && mons.length < 78) {
        const sm = def.summon; m.sumT = sm.every; m.sumN++; m.cast = 1; sfx('horn', m.x, m.z, .25, .2);
        for (let i = 0; i < sm.n; i++) { const q = spawnMonster(sm.type, { s: Math.max(.5, m.s - .6 - .3 * i - (def.boss ? 1.2 : 0)), lat: clamp(m.lat + (i - (sm.n - 1) / 2) * .8 + rr(-.1, .1), -.9, .9), hpMul: (m.maxHp / def.hp) * sm.hp, pop: 1 }); fxDust(q.x, q.y + .1, q.z, 5, .7, { a: .45 }); }
      }
    }
    if (def.stomp && m.vis) {
      m.stT -= dt;
      if (m.stT <= 0) {
        const sp = def.stomp; m.stT = sp.every; FX.shake = Math.min(1.2, FX.shake + .8); sfx('bossStep', m.x, m.z, 1.2, 1); sfx('roar', m.x, m.z, .6, .4);
        fxTimed(4, m.x, m.y + .08, m.z, sp.r * 2, sp.r * 2, 1.2, .8, .4, .5, .7, { ground: true }); fxDust(m.x, m.y + .1, m.z, 22, 2.2, { speed: 4.5 });
        for (const tw of G.towers) if (tw.alive && tw.state === 'active' && dist2(tw.x, tw.z, m.x, m.z) < sp.r * sp.r) { tw.stun = sp.stun; fxDust(tw.x, tw.y + .3, tw.z, 6, 1.2, { speed: 2 }); }
      }
    }
    let want = def.spd * m.spdMul * (1 - m.slowF) * (1 + m.haste), hopMul = 1;
    if (def.frenzy) want *= 1 + def.frenzy * (1 - m.hp / m.maxHp);
    if (def.enrage && m.hp < m.maxHp * def.enrage[0]) { want *= def.enrage[1]; if (!m.rage) { m.rage = true; sfx('roar', m.x, m.z, 1, .9); fxEmbers(m.x, m.y + 2, m.z, 40, 1.2); FX.shake = Math.min(1.2, FX.shake + .6); } }
    if (def.hop) { if (!m.foe) m.hop = (m.hop + dt * def.hop[0] * (1 - m.slowF * .6)) % 1; hopMul = (m.hop > .22 && m.hop < .62) ? def.hop[1] : .1; }
    let v = want * hopMul, obstacle = null, og = 9;
    { const fk = foeThink(m, dt); if (m.wallSt) continue; v *= fk; } // vanguard, muster and the chief's call (65-foe.js)
    if (def.boss) {
      if (!m.foe) for (const f of men) if (!f.dead && f.onRoad && f.s > m.s - .3 && f.s - m.s < 1.9 && Math.abs(f.lat - m.lat) < 1.4) { m.foe = f; break; }
      if (m.foe) { v *= .55; if (m.raid) raidEnd(m); } else v *= raidThink(m, dt);
    } else if (m.foe || (m.siege && m.s >= gateS - .02)) v = 0;
    else if (!def.ghost) for (let j = 0; j < nu; j++) {
      const o = U[j]; if (o === m || (def.slip && o.isMan)) continue; const ds = o.s - m.s; if (ds <= 0 || ds > 1.7 + m.rad + o.rad) continue;
      if (Math.abs(o.lat - m.lat) > (m.rad + o.rad) * .92) continue;
      const gap = ds - (m.rad + o.rad), lim = Math.max(0, (o.vf || 0) + gap * 2.6);
      if (lim < v) { v = lim; obstacle = o; og = gap; }
    }
    if (!m.foe && obstacle && obstacle.isMan && og < .3 && obstacle.foes < 2) m.foe = obstacle;
    // the column closes up behind those already at the wall and joins the assault
    if (!m.siege && obstacle && obstacle.siege && og < .3 && m.s > gateS - SIEGE.depth) joinSiege(m);
    if (m.dead) continue;
    if (obstacle && v < want * .55 && !m.foe && !m.siege) {
      if (m.laneT === undefined || m.laneT <= 0) {
        m.laneT = .35; const first = rnd() < .5 ? 1 : -1;
        for (const d of [first * .5, -first * .5, first * 1.0, -first * 1.0]) {
          const cand = clamp(m.lat + d, -maxLat, maxLat); if (Math.abs(cand - m.lat) < .2) continue; let free = true;
          for (let j = 0; j < nu && free; j++) { const o = U[j]; if (o === m) continue; const ds = o.s - m.s; if (ds < -.5 - o.rad || ds > 1.3 + o.rad) continue; if (Math.abs(o.lat - cand) < (m.rad + o.rad) * .97) free = false; }
          if (free) { m.lane = cand; break; }
        }
      } else m.laneT -= dt;
    } else if (!obstacle) m.lane = damp(m.lane, m.home, .25, dt);
    m.vf = v; m.spdNow = damp(m.spdNow, want * (m.siege ? 0 : m.foe ? (def.boss ? .55 : 0) : 1), 3, dt);
    const kd = Math.exp(-7 * dt); m.s += (v - m.ks * 0) * dt + m.ks * dt; m.lat += m.kl * dt; m.ks *= kd; m.kl *= kd;
    m.lat += clamp(m.lane - m.lat, -1.3 * dt, 1.3 * dt); m.lat = clamp(m.lat, -maxLat, maxLat); m.s = Math.max(.3, m.s);
    const moved = v * dt;
    if (def.gait) m.ph += moved * def.gait / (m.scale || 1) * (def.boss ? 1.6 : 1);
    else if (def.death === 'fur' || def.death === 'bug') m.ph += moved * (def.boss ? 2.4 : def.death === 'bug' ? 9 / Math.sqrt(m.scale) : 7.5 / m.scale); else if (def.boss) m.ph += moved * 6.0 / m.scale * 1.15; else m.ph += moved * 5.6 / (m.scale || 1);
    m.mv = damp(m.mv, sat(v / (want * .5 + .01)), 10, dt);
    m.cd -= dt;
    if (m.atk >= 0) {
      m.atk += dt / def.atkT * 1.7;
      if (m.atk >= .5 && !m.struck) { m.struck = true; const f = m.foe; if (f && !f.dead && Math.hypot(f.x - m.x, f.z - m.z) < m.rad + f.rad + (def.boss ? 1.4 : .8)) strike(m, f, def.dmg * G.dmgMul * (m.pow || 1), false); else if (m.siege && !f) siegeStrike(m); else if (m.raid && !f) raidStrike(m); }
      if (m.atk >= 1) { m.atk = -1; m.cd = def.atkT * rr(.35, .5); }
    } else if ((m.foe || m.siege || m.raid) && m.cd <= 0) { m.atk = 0; m.struck = false; if (def.boss && (m.foe || rnd() < .3)) sfx('roar', m.x, m.z, .5, .7); }
    if (def.boss && v > .05) { const st = Math.floor(m.ph / PI); if (st !== m.step) { m.step = st; const p = pathAt(B, m.s, _ap), sd = (st & 1) ? 1 : -1; const fxp = m.x - p.tz * sd * .5, fzp = m.z + p.tx * sd * .5; fxDust(fxp, m.y + .05, fzp, 7, 1.0, { speed: 2.2 }); FX.shake = Math.min(1.1, FX.shake + .4); sfx('bossStep', m.x, m.z, 1, .6); FX.decals.add(B.heightAt, fxp, fzp, .55, .02, .017, .015, .5, 9); } }
    if (m.s >= gateS) { m.s = gateS; if (!m.siege) { joinSiege(m); if (m.dead) continue; } }
  }
  for (const u of U) if (u.isMan) u.foes = 0;
  for (const m of mons) if (!m.dead && m.foe) m.foe.foes++;
  for (const m of mons) { if (m.dead || m.fly || m.wallSt) continue; const p = pathAt(B, m.s, _ap); m.x = p.x - p.tz * m.lat; m.z = p.z + p.tx * m.lat; m.y = p.y + .02 - (m.dying > 0 ? (1.9 - m.dying) * .15 : 0); m._tx = p.tx; m._tz = p.tz; m._x0 = m.x; m._z0 = m.z; }
  for (let i = 0; i < nu; i++) {
    const a = U[i]; if (a.dead) continue;
    for (let j = i + 1; j < nu; j++) {
      const b = U[j]; if (b.dead) continue; const dx = b.x - a.x, dz = b.z - a.z, rs = a.rad + b.rad, d2 = dx * dx + dz * dz;
      if (d2 >= rs * rs || d2 < 1e-6) continue;
      const d = Math.sqrt(d2), ov = (rs - d) * .6, ma = a.isMan ? (a.target ? 9 : 4) : a.mass, mb = b.isMan ? (b.target ? 9 : 4) : b.mass, wa = mb / (ma + mb), wb = ma / (ma + mb);
      a.x -= dx / d * ov * wa; a.z -= dz / d * ov * wa; b.x += dx / d * ov * wb; b.z += dz / d * ov * wb;
    }
  }
  for (const m of mons) {
    if (m.dead || m.fly || m.wallSt) continue;
    const dx = m.x - m._x0, dz = m.z - m._z0, maxLat = Math.max(0, maxLatBase - m.rad * .7);
    if (dx || dz) { m.s = clamp(m.s + clamp(dx * m._tx + dz * m._tz, -.12, .12), .3, gateS); m.lat = clamp(m.lat + (-dx * m._tz + dz * m._tx), -maxLat, maxLat); }
    const p = pathAt(B, m.s, _ap); m.x = p.x - p.tz * m.lat; m.z = p.z + p.tx * m.lat;
    let yaw = Math.atan2(p.tx, p.tz); if (m.foe) yaw = Math.atan2(m.foe.x - m.x, m.foe.z - m.z); else if (m.raid) yaw = Math.atan2(m.raid.x - m.x, m.raid.z - m.z);
    m.yaw = angDamp(m.yaw, yaw, m.def.boss ? 4 : 9, dt);
    m.prog = m.s / L; if (!m.vis && m.s > B.cave.s + 1.7) m.vis = true;
    if (m.pop > 0) m.pop = Math.max(0, m.pop - dt * 3);
  }
}
function updateBat(m, dt) {
  const b = G.B.beacon, dx = b.x - m.x, dz = b.z - m.z, d = Math.hypot(dx, dz) || 1, v = m.def.spd * m.spdMul * (1 - m.slowF);
  const wob = Math.sin(G.t * (m.def.glow ? 2.6 : 1.7) + m.lseed * 3) * m.side * Math.min(1, d / 6);
  m.vx = dx / d * v - dz / d * wob * .5; m.vz = dz / d * v + dx / d * wob * .5;
  m.x += m.vx * dt; m.z += m.vz * dt;
  const ground = G.B.heightAt(m.x, m.z), wantY = d < 5 ? lerp(b.y - .2, ground + m.alt, sat((d - 1) / 4)) : ground + m.alt;
  m.y = damp(m.y, wantY + (m.def.glow ? Math.sin(G.t * 2.3 + m.lseed * 5) * .35 : 0), 2.5, dt); m.yaw = angDamp(m.yaw, Math.atan2(m.vx, m.vz), 8, dt); m.ph += dt * m.def.flap;
  m.prog = clamp(1 - d / m.d0, 0, 1) * .98;
  if (d < .9) leak(m);
}
function leak(m) {
  const B = G.B, n = m.def.lives;
  G.lives = Math.max(0, G.lives - n); G.leaks++; G.waveLeaks += n; G.leakTypes[m.type] = (G.leakTypes[m.type] || 0) + n;
  LT.beaconGutter = 1; UI.hurt = 1;
  if (m.fly) { fxSparks(m.x, m.y, m.z, 14, 5, 3, 1.4, .4); fxSmoke(m.x, m.y, m.z, 0, 1, 0, 1.2, .5, .8, .2, .2, .2, .6); }
  else { for (let i = 0; i < 6; i++) fxSmoke(m.x + rr(-.3, .3), m.y + rr(.2, 1), m.z + rr(-.3, .3), rr(-.4, .4), rr(.2, .8), rr(-.4, .4), rr(.6, 1.2), .5, .7, .05, .05, .07, .7, { drag: 2 }); }
  fxEmbers(B.beacon.x, B.beacon.y, B.beacon.z, 26, .5);
  sfx('leak', B.gate.x, B.gate.z, 1);
  removeMonster(m);
}
