// The campaign: the ten battlefields in a fixed order, easiest defence first, and the arsenal that opens up as they are held.
// There is no settled ranking of these battles by difficulty in the histories, so the order is argued from four things the sources do record:
// the odds in men, how much the ground helped the defender, how far he was from supply and relief, and how the defence actually ended.
// `note` is the one-line case for each battlefield's place; it is shown on the lore card.
const CAMPAIGN = {
  order: ['ashen', 'diaoyu', 'yiling', 'chibi', 'jingxing', 'dunes', 'fen', 'jieting', 'yinping', 'frost'],
  note: {
    ashen: '李牧备边多年，以逸待劳，一战破匈奴十余万骑，此后十余年匈奴不敢近边。守方占尽地利，故列首关。',
    diaoyu: '山城三面临江，宋军据险坚守三十六年；1259 年蒙哥汗亲征，久攻不下，死于军中。地利极厚而守御成功，列第二。',
    yiling: '陆逊坚守数月不战，待蜀军师老兵疲，顺风纵火，连破四十余营。守方以逸待劳而胜，列第三。',
    chibi: '孙刘约五万人当曹军二十余万，众寡悬殊；幸有大江之险，北军不习水战又染疾疫。以寡敌众而胜，列第四。',
    jingxing: '韩信兵仅数万，当赵军号称二十万，背水列阵，士卒无路可退，殊死一战方才破赵。险中取胜，列第五。',
    dunes: '孤悬河西尽头，粮援难继；李广利首征大宛，还至敦煌士卒十不存一二。关虽守住而代价极重，列第六。',
    fen: '泽国平阔，无险可凭。前 278 年白起长驱破郢，楚失其都，东迁于陈。守方以败告终，列第七。',
    jieting: '马谡违诸葛亮节度，舍水上山，张郃断其汲道，蜀军大溃。有地利而自弃，列第八。',
    yinping: '姜维据剑阁拒钟会，邓艾自阴平行无人之地七百余里，绕出江油，蜀汉遂亡。天险被人绕过，列第九。',
    frost: '金以精兵守居庸，冶铁锢门，布蒺藜百余里，仍被蒙古绕道紫荆关、南北夹击而破。天险重兵俱全犹失守，列末关。',
  },
  // what the defender starts with, and what holding the at-th battlefield adds. kind opens a line of works; tier raises the dynasty every line and the wall garrison may reach.
  start: { kinds: ['archer', 'guard'], tier: 1 },
  unlock: [
    { at: 1, kind: 'bombard', name: '砲车台', sub: '三国霹雳车：官渡旧制，正合夷陵、赤壁之世。' },
    { at: 2, kind: 'spire', name: '床弩台', sub: '汉塞大黄弩：居延、敦煌汉简所记边塞重弩。' },
    { at: 4, tier: 2, name: '唐代军制', sub: '各工事与城头守军可升至唐。' },
    { at: 6, tier: 3, name: '宋代军制', sub: '各工事与城头守军可升至宋，与居庸之战同世。' },
  ],
  // The game was tuned for a full arsenal on every battlefield. With part of it still locked the enemy is thinned to match:
  // [numbers, rank-and-file health, chieftain health] for each battlefield of the first round; later rounds are met at full strength.
  ease: [[.62, .66, .5], [.7, .72, .6], [.72, .75, .6], [.76, .78, .66], [.84, .85, .75], [.88, .88, .8], [1, 1, 1], [1, 1, 1], [1, 1, 1], [1, 1, 1]],
  best: 0, news: null, all: !!HASH.unlock, persist: !HASH.seed && !HASH.manual, KEY: 'fengsui.campaign.v1',
};
const STAGE_ORD = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
function stageCount() { return CAMPAIGN.order.length; }
function stageLabel(level) { const n = stageCount(), r = Math.floor(level / n); return (r > 0 ? '第' + (STAGE_ORD[r] || r + 1) + '轮 · ' : '') + '第' + STAGE_ORD[level % n] + '关'; }
function stageName(i) { const k = CAMPAIGN.order[i % stageCount()], b = BIOMES.find(b => b.key === k); return b ? b.name : ''; }
// stages held so far: unlocks are kept for good, so a defeat or a replay of an early battlefield never takes them away
function campaignProgress() { return CAMPAIGN.all ? 99 : Math.max(G.level || 0, CAMPAIGN.best); }
function kindNeeds(kind) { if (CAMPAIGN.start.kinds.indexOf(kind) >= 0) return 0; const u = CAMPAIGN.unlock.find(u => u.kind === kind); return u ? u.at : 0; }
function kindUnlocked(kind) { return campaignProgress() >= kindNeeds(kind); }
function tierNeeds(lvl) { if (lvl <= CAMPAIGN.start.tier) return 0; const u = CAMPAIGN.unlock.find(u => u.tier >= lvl); return u ? u.at : 0; }
function tierCap() { const p = campaignProgress(); let cap = CAMPAIGN.start.tier; for (const u of CAMPAIGN.unlock) if (u.tier && u.at <= p) cap = Math.max(cap, u.tier); return cap; }
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
  const p1 = campaignProgress(); CAMPAIGN.news = CAMPAIGN.unlock.find(u => u.at > p0 && u.at <= p1) || null;
  campaignSave(G.level + 1);
  return CAMPAIGN.news;
}
