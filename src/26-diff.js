// Difficulty: three grades, each opened by holding the last battlefield of the one before. A grade multiplies both sides,
// the enemy a little more than the defender, and brings troops from a later age of Chinese warfare onto the field.
// `works` are the kinds of work it opens to the defender and `foes` the troop types it adds to the enemy; once opened they stay on every harder grade.
// `ease`: the grade on which the arsenal is still being opened, so its first battlefields are thinned (CAMPAIGN.ease). A harder grade opens
// only once the easy one is held whole, with every work and tier already won, and its strength is set by the multipliers alone.
const DIFF = {
  list: [
    { key: 'easy', name: '简易', era: '', ease: true, foe: { n: 1, hp: 1, dmg: 1 }, own: { hp: 1, dmg: 1 }, works: [], foes: [] },
    { key: 'mid', name: '中等', era: '元明火器', foe: { n: 1.15, hp: 1.9, dmg: 1.45 }, own: { hp: 1.15, dmg: 1.15 }, works: ['gunner'], foes: ['huihui', 'tammachi'] },
    { key: 'hard', name: '困难', era: '明清鼎革', foe: { n: 1.3, hp: 2.4, dmg: 1.7 }, own: { hp: 1.3, dmg: 1.3 }, works: ['cannon'], foes: ['dunche', 'sibing'] },
  ],
  cur: 0,
};
{ const h = HASH.diff, i = h === undefined ? -1 : DIFF.list.findIndex(d => d.key === h); DIFF.cur = i >= 0 ? i : clamp(+h | 0, 0, DIFF.list.length - 1); }
function diffNow() { return DIFF.list[DIFF.cur]; }
function diffHas(key) { for (let i = 0; i <= DIFF.cur; i++) { const d = DIFF.list[i]; if (d.works.indexOf(key) >= 0 || d.foes.indexOf(key) >= 0) return true; } return false; }
// Each side's multiplier is taken once per number. The defender's damage where a blow lands (hitMonster); his health where a body is raised
// (works, wall, gate, footmen, the general). The enemy's numbers when a wave is mustered, health when a man is spawned, damage where it lands.
// The panels read through the same functions so that what they show is what is dealt.
function ownDmg(v) { return v * diffNow().own.dmg; }
function ownHp(v) { return v * diffNow().own.hp; }
function foeMulN(v) { return v * diffNow().foe.n; }
function foeMulHp(v) { return v * diffNow().foe.hp; }
function foeMulDmg(v) { return v * diffNow().foe.dmg; }
// What the main screen and the battle report call the works and troops each grade brings, with one line on where they come from.
const DIFF_NAMES = {
  gunner: { name: '神机铳台', sub: '1388 年沐英定边之战，置火铳、神机箭为三行，轮番迭射，大破思伦发象阵（《明史·沐英传》）。' },
  cannon: { name: '红夷炮台', sub: '1626 年宁远之战，袁崇焕凭坚城用红夷大炮击退后金。' },
  huihui: { name: '回回砲', sub: '1273 年元军以亦思马因所造回回砲攻襄阳，守将吕文焕以城降（《元史·亦思马因传》）。' },
  tammachi: { name: '探马赤军', sub: '元代以诸部族精锐组成的先锋与镇戍军，见《元史·兵志》。' },
  dunche: { name: '楯车', sub: '后金攻城推楯车蔽身，宁远、宁锦诸役皆以楯车抵近城下。' },
  sibing: { name: '重甲死兵', sub: '李民寏《建州闻见录》记后金阵法：死兵在前，锐兵在后，死兵披重甲。' },
};
