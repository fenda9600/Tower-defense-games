// The campaign: the five battlefields in a fixed order, easiest defence first, and the arsenal that opens up as they are held.
// There is no settled ranking of these battles by difficulty in the histories, so the order is argued from four things the sources do record:
// the odds in men, how much the ground helped the defender, how far he was from supply and relief, and how the defence actually ended.
// `note` is the one-line case for each battlefield's place; it is shown on the lore card.
const CAMPAIGN = {
  order: ['ashen', 'ember', 'dunes', 'fen', 'frost'],
  note: {
    ashen: '李牧备边多年，以逸待劳，一战破匈奴十余万骑，此后十余年匈奴不敢近边。守方占尽地利，故列首关。',
    ember: '孙刘约五万人当曹军二十余万，众寡悬殊；幸有大江之险，北军不习水战又染疾疫。以寡敌众而胜，列第二。',
    dunes: '孤悬河西尽头，粮援难继；李广利首征大宛，还至敦煌士卒十不存一二。关虽守住而代价极重，列第三。',
    fen: '泽国平阔，无险可凭。前 278 年白起长驱破郢，楚失其都，东迁于陈。守方以败告终，列第四。',
    frost: '金以精兵守居庸，冶铁锢门，布蒺藜百余里，仍被蒙古绕道紫荆关、南北夹击而破。天险重兵俱全犹失守，列末关。',
  },
  // what the defender starts with, and what holding the n-th battlefield adds. kind opens a line of works; tier raises the dynasty every line and the wall garrison may reach.
  start: { kinds: ['archer', 'guard'], tier: 1 },
  unlock: [
    { kind: 'bombard', name: '砲车台', sub: '三国霹雳车：官渡旧制，正合赤壁之世。' },
    { kind: 'spire', name: '床弩台', sub: '汉塞大黄弩：居延、敦煌汉简所记边塞重弩。' },
    { tier: 2, name: '唐代军制', sub: '各工事与城头守军可升至唐。' },
    { tier: 3, name: '宋代军制', sub: '各工事与城头守军可升至宋，与居庸之战同世。' },
  ],
  // The game was tuned for a full arsenal on every battlefield. With part of it still locked the enemy is thinned to match:
  // [numbers, rank-and-file health, chieftain health] for each battlefield of the first round; later rounds are met at full strength.
  ease: [[.62, .66, .5], [.7, .72, .6], [.72, .75, .6], [.88, .88, .8], [1, 1, 1]],
  best: 0, news: null, all: !!HASH.unlock, persist: !HASH.seed && !HASH.manual, KEY: 'fengsui.campaign.v1',
};
const STAGE_ORD = ['一', '二', '三', '四', '五'];
function stageCount() { return CAMPAIGN.order.length; }
function stageLabel(level) { const n = stageCount(), r = Math.floor(level / n); return (r > 0 ? '第' + (STAGE_ORD[r] || r + 1) + '轮 · ' : '') + '第' + STAGE_ORD[level % n] + '关'; }
function stageName(i) { const k = CAMPAIGN.order[i % stageCount()], b = BIOMES.find(b => b.key === k); return b ? b.name : ''; }
// stages held so far: unlocks are kept for good, so a defeat or a replay of an early battlefield never takes them away
function campaignProgress() { return CAMPAIGN.all ? 99 : Math.max(G.level || 0, CAMPAIGN.best); }
function kindNeeds(kind) { if (CAMPAIGN.start.kinds.indexOf(kind) >= 0) return 0; const i = CAMPAIGN.unlock.findIndex(u => u.kind === kind); return i < 0 ? 0 : i + 1; }
function kindUnlocked(kind) { return campaignProgress() >= kindNeeds(kind); }
function tierNeeds(lvl) { if (lvl <= CAMPAIGN.start.tier) return 0; const i = CAMPAIGN.unlock.findIndex(u => u.tier >= lvl); return i < 0 ? 0 : i + 1; }
function tierCap() { const p = campaignProgress(); let cap = CAMPAIGN.start.tier; for (let i = 0; i < CAMPAIGN.unlock.length && i < p; i++) if (CAMPAIGN.unlock[i].tier) cap = Math.max(cap, CAMPAIGN.unlock[i].tier); return cap; }
// the hint shown on a locked button: which battlefield has to be held first
function lockHint(needs) { return '守住' + stageName(needs - 1) + '后解锁'; }

function campaignEase(level) { return (!CAMPAIGN.all && CAMPAIGN.ease[level]) || [1, 1, 1]; }

function campaignLoad() {
  if (!CAMPAIGN.persist) return null;
  try { if (HASH.reset) localStorage.removeItem(CAMPAIGN.KEY); const o = JSON.parse(localStorage.getItem(CAMPAIGN.KEY) || 'null'); if (o && isFinite(o.best)) { CAMPAIGN.best = Math.max(0, o.best | 0); return o; } } catch (e) {}
  return null;
}
function campaignSave(level) { if (!CAMPAIGN.persist) return; try { localStorage.setItem(CAMPAIGN.KEY, JSON.stringify({ best: CAMPAIGN.best, level })); } catch (e) {} }
// Called once when a battlefield is held. Other end-of-battle bookkeeping (the after-action review, skill points) belongs next to this call in setPhase('clear').
function campaignCleared() {
  const p0 = campaignProgress(); CAMPAIGN.best = Math.max(CAMPAIGN.best, G.level + 1);
  CAMPAIGN.news = campaignProgress() > p0 ? CAMPAIGN.unlock[p0] || null : null;
  campaignSave(G.level + 1);
  return CAMPAIGN.news;
}
