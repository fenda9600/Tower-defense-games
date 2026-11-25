// The lesser upgrade: more men for a work.
// A work can be improved in two directions. The greater upgrade re-arms it for a later dynasty (the tiers in 60-towers.js).
// The lesser one, here, leaves the arms as they are and posts more men to it: another footman for the garrison hall,
// another bowman on the arrow tower, more hands on the winch of the bed crossbow, more haulers on the trebuchet ropes.
// The men are kept through a greater upgrade, which then costs more because they have to be re-armed as well:
// the price of a man is set per tier, so the total is the same whichever is bought first. README.md gives the sources.
const CREW = {
  max: 2,
  step: [1, 1.25],   // the second posting costs more than the first
  hp: .2,            // each posting also makes the work that much harder to bring down
  by: {
    // cost: one posting at each tier. name / gain: the button's two lines. note: the source.
    guard: { cost: [30, 50, 60, 90], unit: '戍卒', gain: '添戍卒一名，同出营拦路', note: '古军制五人为伍，同伍相保，添丁以满伍。' },
    archer: { cost: [50, 75, 75, 105], unit: '弓手', gain: '添弓手一名，楼上多一张弓', note: '居延汉简：一燧戍卒数人，轮番候望。' },
    spire: { cost: [25, 45, 75, 110], unit: '张弩手', gain: '添张弩手，绞轴上弦快四分之一', rate: .75, note: '《武经总要》：三弓床弩以七十人张发。' },
    bombard: { cost: [20, 40, 65, 95], unit: '拽手', gain: '添拽手，石重而伤害加四分之一', dmg: .25, note: '《武经总要》：单梢砲拽手四十人，七梢砲二百五十人。' },
  },
};
function crewOf(t) { return t.crew | 0; }
// what the postings a work has (or n of them) come to at a given tier
function crewWorth(t, lvl, n = crewOf(t)) { let c = 0; const k = CREW.by[t.kind].cost[lvl]; for (let i = 0; i < n; i++) c += Math.round(k * CREW.step[i]); return c; }
function crewCost(t) { const n = crewOf(t); return n >= CREW.max ? 0 : crewWorth(t, t.lvl, n + 1) - crewWorth(t, t.lvl, n); }
// the greater upgrade re-arms the extra men too
function upgradeCost(t) { return t.def.cost[t.lvl + 1] + crewWorth(t, t.lvl + 1) - crewWorth(t, t.lvl); }
function crewMen(t) { return t.def.n[t.lvl] + crewOf(t); }
function crewRate(t) { return Math.pow(CREW.by[t.kind].rate || 1, crewOf(t)); }
function crewDmg(t) { return 1 + (CREW.by[t.kind].dmg || 0) * crewOf(t); }
function crewHp(t) { return 1 + CREW.hp * crewOf(t); }
// where the extra bowmen stand on the gallery of an arrow tower
function crewArchers(t) { const W = [.75, .85, .93][t.vl] / .93, y = t.mounts.archers[0][1]; return [[-.5 * W, y, -.48 * W], [.48 * W, y, -.38 * W]].slice(0, crewOf(t)); }
function crewTower(t, byPlayer) {
  if (!t || !t.alive || t.ruin || t.state !== 'active' || G.phase !== 'play' || crewOf(t) >= CREW.max) return false;
  const c = crewCost(t); if (G.gold < c) return false;
  G.gold -= c; UI.goldShown = Math.min(UI.goldShown, G.gold); t.spent += c; t.crew = crewOf(t) + 1;
  if (t.kind === 'archer') t.addArcher(crewArchers(t)[t.crew - 1]);
  if (t.kind === 'guard') t.respawn = Math.min(t.respawn, .4);
  const C = CREW.by[t.kind];
  if (byPlayer) UI.banner(t.def.name + ' · 添' + C.unit, 2.8, false, C.note);
  fxDust(t.x, t.y + .2, t.z, 6, 1, { speed: 1.6 }); sfx('buildDone', t.x, t.z, .6); UI.ping(t.x, t.y, t.z, byPlayer);
  return true;
}
// The extra hands on a bed crossbow or a trebuchet stand on the deck beside the engine and turn with it.
const CREW_AT = { spire: [[.5, -.32], [-.52, -.3]], bombard: [[.58, -.12], [-.56, -.16]] };
function crewDraw(t, dt) {
  const at = CREW_AT[t.kind], n = crewOf(t); if (!at || !n) return;
  if (!t.hands) t.hands = [];
  while (t.hands.length < n) t.hands.push({ scale: .8, ph: rnd() * 6, mv: 0, atk: -1, cast: 0, tint: [1, .9, .7], x: 0, y: 0, z: 0, yaw: t.yaw, flash: 0, helm: false });
  const y = t.mounts.gun[1], k = .3 + .7 * t.appear, haul = t.kind === 'bombard' ? sat(t.recoil * 1.6 - .2) * .55 : t.charge > .05 && t.charge < 1 ? .28 + .08 * Math.sin(G.t * 9) : 0;
  for (let i = 0; i < n; i++) {
    const e = t.hands[i], p = t.w([at[i][0], y, at[i][1]], _ap);
    e.x = p.x; e.y = p.y - (1 - easeOut(t.appear)) * .4; e.z = p.z; e.scale = .8 * k; e.helm = t.lvl >= 1;
    e.yaw = angDamp(e.yaw, t.gunYaw + (i ? -.5 : .5), 5, dt); e.cast = damp(e.cast, haul, 10, dt);
    rigHuman(KIT.foot, SPEC.foot, e);
  }
}
