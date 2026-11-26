// Difficulty: three grades, each opened by holding the last battlefield of the one before. A grade multiplies both sides,
// the enemy a little more than the defender, and brings troops from a later age of Chinese warfare onto the field.
// `works` are the kinds of work it opens to the defender and `foes` the troop types it adds to the enemy; once opened they stay on every harder grade.
const DIFF = {
  list: [
    { key: 'easy', name: '简易', era: '', foe: { n: 1, hp: 1, dmg: 1 }, own: { hp: 1, dmg: 1 }, works: [], foes: [] },
    { key: 'mid', name: '中等', era: '元明火器', foe: { n: 1.1, hp: 1.4, dmg: 1.3 }, own: { hp: 1.25, dmg: 1.25 }, works: ['gunner'], foes: ['huihui', 'tammachi'] },
    { key: 'hard', name: '困难', era: '明清鼎革', foe: { n: 1.2, hp: 1.9, dmg: 1.6 }, own: { hp: 1.5, dmg: 1.5 }, works: ['cannon'], foes: ['dunche', 'sibing'] },
  ],
  cur: 0,
};
{ const h = HASH.diff, i = h === undefined ? -1 : DIFF.list.findIndex(d => d.key === h); DIFF.cur = i >= 0 ? i : clamp(+h | 0, 0, DIFF.list.length - 1); }
function diffNow() { return DIFF.list[DIFF.cur]; }
function diffHas(key) { for (let i = 0; i <= DIFF.cur; i++) { const d = DIFF.list[i]; if (d.works.indexOf(key) >= 0 || d.foes.indexOf(key) >= 0) return true; } return false; }
// every number the defender fields goes through these two, and every number the enemy fields through the three below
function ownDmg(v) { return v * diffNow().own.dmg; }
function ownHp(v) { return v * diffNow().own.hp; }
function foeMulN(v) { return v * diffNow().foe.n; }
function foeMulHp(v) { return v * diffNow().foe.hp; }
function foeMulDmg(v) { return v * diffNow().foe.dmg; }
