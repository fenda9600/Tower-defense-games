// 历史名将。每战出一人，在大路后半段迎敌；每人三项技能，各分三级。
// 技能点叫「勋」，以「转」计：只有打完一关，按战后策勋评定才能得到（仿《唐六典》兵部叙勋之制，见 HERO_RULE）。
// 存档放在 localStorage，勋转与加点跨局保留。
const HERO_SAVE = 'fengsui.heroes.v1';
const HERO_RULE = '仿唐代军功叙勋：《唐六典·尚书兵部》以敌我众寡分上阵、中阵、下阵，以杀获多少分上获、中获、下获，两项合计酬勋若干转。此处为简化。';
const HERO_ZHEN = ['上阵', '中阵', '下阵'], HERO_HUO = ['上获', '中获', '下获'];
// 每项技能：v 为各级数值，cd 为各级冷却秒数（没有 cd 的是常驻效果），fx 把数值写成说明。
const HEROES = {
  huo: {
    name: '霍去病', era: '西汉', title: '骠骑将军', mount: true, dmg: 20, rate: .75, spd: 4.4, reach: .95,
    bio: '汉武帝时名将，十八岁初战即以八百骑深入匈奴腹地；河西、漠北两役打通河西走廊，年二十四而卒。',
    src: '《史记·卫将军骠骑列传》《汉书·卫青霍去病传》',
    skills: [
      { key: 'raid', name: '轻骑奔袭', cd: [26, 22, 18], v: [45, 70, 100], fx: v => '沿大路纵马冲阵，沿途之敌各受 ' + v + ' 点伤害并被撞退。',
        src: '元朔六年（前 123 年）为剽姚校尉，率轻勇骑八百，弃大军数百里赴利，斩捕首虏过当；元狩二年（前 121 年）出陇西，转战六日，过焉支山千有余里。《史记·卫将军骠骑列传》' },
      { key: 'forage', name: '取食于敌', v: [50, 100, 150], fx: v => '名将亲手斩杀之敌，赏金加 ' + v + '%。',
        src: '漠北之战后武帝诏书称其「取食于敌，逴行殊远而粮不绝」：轻装疾进，不带辎重，粮草取自敌方。《史记·卫将军骠骑列传》' },
      { key: 'langju', name: '封狼居胥', v: [30, 60, 90], w: [1, 2, 3], fx: (v, w) => '对首领伤害加 ' + v + '%；首领伏诛时城防回复 ' + w + ' 点。',
        src: '元狩四年（前 119 年）出代郡两千余里，大破匈奴左贤王部，封狼居胥山，禅于姑衍，登临翰海。《史记·卫将军骠骑列传》' },
    ],
  },
  bai: {
    name: '白起', era: '战国 · 秦', title: '武安君', mount: false, dmg: 26, rate: .9, spd: 2.7, reach: .9,
    bio: '秦昭襄王时名将，伊阙、鄢郢、华阳、长平诸役皆胜，一生未尝败绩，封武安君。',
    src: '《史记·白起王翦列传》',
    skills: [
      { key: 'yique', name: '伊阙斩首', v: [12, 18, 25], fx: v => '首领以外之敌，生命低于 ' + v + '% 时被名将一击斩杀。',
        src: '秦昭襄王十四年（前 293 年），白起为左更，攻韩、魏于伊阙，斩首二十四万，虏其将公孙喜，拔五城。《史记·白起王翦列传》' },
      { key: 'flood', name: '水灌鄢城', cd: [30, 26, 22], v: [30, 50, 75], w: [3, 4, 5], fx: (v, w) => '引水冲灌名将身前一段大路：其上之敌受 ' + v + ' 点伤害，并迟滞 ' + w + ' 秒。',
        src: '前 279 年白起攻楚鄢城，筑堰引西山长谷水灌城，水从城西灌到城东，城东北角溃，军民溺死者甚众。《水经注·沔水》' },
      { key: 'changping', name: '长平绝粮', v: [6, 10, 14], fx: v => '断敌粮道：新到战场之敌（首领除外）生命减 ' + v + '%。',
        src: '前 260 年长平之战，白起佯败诱敌，出奇兵二万五千人断赵军后路，又以五千骑隔绝赵军营垒，赵军粮道断绝四十六日而降。《史记·白起王翦列传》' },
    ],
  },
  yue: {
    name: '岳飞', era: '南宋', title: '武胜定国军节度使', mount: true, dmg: 22, rate: .8, spd: 4.0, reach: .95,
    bio: '南宋抗金名将，绍兴十年（1140 年）北伐，连捷于郾城、颍昌，兵锋直抵朱仙镇，后被召回，遇害于临安。',
    src: '《宋史·岳飞传》',
    skills: [
      { key: 'mazha', name: '麻扎刀', v: [40, 70, 100], fx: v => '对骑兵（轻骑、铁鹞子、铁浮屠）伤害加 ' + v + '%，中者迟滞。',
        src: '1140 年郾城之战，金兀术以拐子马一万五千骑来攻，岳飞令步卒持麻扎刀入阵，不要仰视，只砍马足，遂大破之。《宋史·岳飞传》' },
      { key: 'beiwei', name: '背嵬陷阵', cd: [24, 21, 18], v: [40, 60, 85], fx: v => '率亲军突阵：身周之敌各受 ' + v + ' 点伤害并被击退，其后 5 秒名将出手加快一倍。',
        src: '背嵬军是岳飞的亲军精锐。郾城、颍昌两战，岳云领背嵬军冲阵，颍昌之战以骑兵八百挺前决战。《宋史·岳飞传》' },
      { key: 'hanshan', name: '撼山易', v: [1.5, 2.5, 3.5], fx: v => '军纪严整，士卒不溃：城头守军与戍卒每秒回复 ' + v + '% 生命。',
        src: '岳家军「冻死不拆屋，饿死不卤掠」，金人为之语曰：「撼山易，撼岳家军难。」《宋史·岳飞传》' },
    ],
  },
  li: {
    name: '李陵', era: '西汉', title: '骑都尉', mount: false, ranged: true, range: 7.4, dmg: 17, rate: .6, spd: 2.6, reach: 0,
    bio: '李广之孙，善骑射。天汉二年（前 99 年）率步卒五千出居延，在浚稽山遇单于主力，以寡敌众，转战多日，矢尽援绝而降。',
    src: '《汉书·李广苏建传》',
    skills: [
      { key: 'volley', name: '千弩俱发', cd: [20, 17, 14], v: [6, 9, 12], w: [22, 30, 38], fx: (v, w) => '向射程内至多 ' + v + ' 个敌人齐射，每矢 ' + w + ' 点伤害。',
        src: '匈奴三万骑围陵军，陵令前行持戟盾、后行持弓弩，「千弩俱发，应弦而倒」，匈奴退走上山。《汉书·李广苏建传》' },
      { key: 'chanyu', name: '连弩射单于', cd: [16, 14, 12], v: [60, 100, 150], fx: v => '以连弩射向射程内生命最多之敌，造成 ' + v + ' 点伤害并使其迟滞。',
        src: '陵军且战且退至山下，单于在南山上指挥，陵军「发连弩射单于，单于下走」。《汉书·李广苏建传》' },
      { key: 'sizhan', name: '矢尽死战', v: [3, 5, 7], fx: v => '愈危愈勇：城防每损失 1 点，名将射速加 ' + v + '%。',
        src: '陵军一日之内五十万矢皆尽，士卒仍斩车辐为兵，持尺刀死战。司马迁称其士「张空弮，冒白刃，北首争死敌」。《汉书·李广苏建传》《报任安书》' },
    ],
  },
};
const HERO_KEYS = ['huo', 'bai', 'yue', 'li'];

const HERO = (() => {
  const H = { save: null, u: null, wallRef: null, phase: '', stats: null, eval: null, panel: null, open: false, tab: 'huo', evalMode: false, holdT0: 0, rect: null, pending: null, dealt: 0, recent: 0, kills: 0 };
  const _p = { x: 0, y: 0, z: 0, tx: 0, tz: 0 };
  function load() {
    let d = null; try { d = JSON.parse(localStorage.getItem(HERO_SAVE)); } catch (e) { d = null; }
    if (!d || typeof d !== 'object') d = {};
    const s = { pts: Math.max(0, d.pts | 0), pick: HERO_KEYS.includes(d.pick) ? d.pick : 'huo', lv: {}, won: Math.max(0, d.won | 0) };
    for (const k of HERO_KEYS) { const a = d.lv && Array.isArray(d.lv[k]) ? d.lv[k] : [1, 0, 0]; s.lv[k] = [0, 1, 2].map(i => clamp(a[i] | 0, i === 0 ? 1 : 0, 3)); }
    return s;
  }
  function store() { try { localStorage.setItem(HERO_SAVE, JSON.stringify(H.save)); } catch (e) { /* 无痕模式等：只在本次会话生效 */ } }
  const lvOf = (i, key) => H.save.lv[key || H.save.pick][i];
  // 第 n 级花 n 转；每位名将的第一项技能自带一级
  const costOf = lv => lv + 1;
  function spend(key, i) { const lv = H.save.lv[key][i]; if (lv >= 3 || H.save.pts < costOf(lv)) return false; H.save.pts -= costOf(lv); H.save.lv[key][i] = lv + 1; store(); return true; }
  function refund() { for (const k of HERO_KEYS) H.save.lv[k].forEach((lv, i) => { const base = i === 0 ? 1 : 0; for (let l = base; l < lv; l++) H.save.pts += costOf(l); H.save.lv[k][i] = base; }); store(); }
  function pick(key) { if (!HEROES[key] || H.save.pick === key) return; H.save.pick = key; store(); if (G.phase === 'play') deploy(true); }

  const zoneMin = () => G.B.L * .34, homeS = () => G.B.L * .74;
  const scaleDmg = () => 1 + .15 * G.level;
  function deploy(swap) {
    const B = G.B, d = HEROES[H.save.pick], s = homeS();
    const u = H.u = { key: H.save.pick, d, s, lat: .55, x: 0, y: 0, z: 0, yaw: 0, ph: 0, mv: 0, atk: -1, struck: false, cd: .6, flash: 0, flinch: 0, scale: d.mount ? 1.12 : 1.18, tgt: null, think: 0, draw: 0, pitch: 0, cds: [0, 0, 0], say: null, sayT: 0, charge: null, hasteT: 0, appear: 0, def: { bard: false }, riderKit: KIT.foot, vx: 0, vz: 0, shots: 0 };
    d.skills.forEach((sk, i) => { if (sk.cd) u.cds[i] = sk.cd[0] * (swap ? 1 : .4); });
    place(u); const p = pathAt(B, u.s, _p); u.yaw = Math.atan2(-p.tx, -p.tz);
    fxDust(u.x, u.y + .2, u.z, 8, 1, { speed: 1.8 });
  }
  function place(u) { const B = G.B, p = pathAt(B, u.s, _p); u.x = p.x - p.tz * u.lat; u.z = p.z + p.tx * u.lat; u.y = p.y + .03; return p; }
  function say(u, t) { u.say = t; u.sayT = 2.2; }
  const groundFoe = m => !m.dead && m.hp > 0 && !m.fly && m.vis && !m.wallSt && !(m.dying > 0);

  // 名将的一击：先算技能加成，再交给 hitMonster；斩杀后结算「取食于敌」
  function hit(u, m, dmg, kind, dx, dz) {
    const boss = !!m.def.boss, key = u.key; dmg *= scaleDmg();
    if (key === 'huo' && boss && lvOf(2)) dmg *= 1 + HEROES.huo.skills[2].v[lvOf(2) - 1] / 100;
    if (key === 'yue' && m.def.death === 'horse' && lvOf(0)) { dmg *= 1 + HEROES.yue.skills[0].v[lvOf(0) - 1] / 100; slowMonster(m, .3, 1.5); }
    let dead = hitMonster(m, dmg, kind, dx, dz, H);
    if (!dead && key === 'bai' && !boss && lvOf(0) && m.hp > 0 && m.hp < m.maxHp * HEROES.bai.skills[0].v[lvOf(0) - 1] / 100) { fxSparks(m.x, m.y + m.hitH, m.z, 6, 4, 3, .6, .4, { size: .06 }); dead = hitMonster(m, m.hp + 1, 'sword', dx, dz, H); }
    if (dead && !boss && key === 'huo' && lvOf(1)) { const g = Math.round(m.def.bounty * G.bountyMul * HEROES.huo.skills[1].v[lvOf(1) - 1] / 100); if (g > 0) dropCoins(m.x, m.y + .5, m.z, g, 1); }
    return dead;
  }

  function cast(u, i) {
    const sk = u.d.skills[i], lv = lvOf(i), B = G.B, v = sk.v[lv - 1], w = sk.w ? sk.w[lv - 1] : 0; u.cds[i] = sk.cd[lv - 1];
    say(u, sk.name); sfx('horn', u.x, u.z, .5, .6);
    if (sk.key === 'raid') { u.charge = { to: Math.max(zoneMin() * .6, u.s - 10), dmg: v, done: new Set() }; u.tgt = null; u.atk = -1; }
    else if (sk.key === 'flood') {
      const dir = u.tgt && u.tgt.s > u.s ? 1 : -1, s0 = dir < 0 ? u.s - 9 : u.s - 1, s1 = dir < 0 ? u.s + 1 : u.s + 9;
      for (let s = s0; s <= s1; s += .7) { const p = pathAt(B, clamp(s, .5, B.L - .2), _p); for (let k = 0; k < 3; k++) { const l = rr(-1.1, 1.1); fxSmoke(p.x - p.tz * l, p.y + .15, p.z + p.tx * l, -p.tx * dir * rr(1, 2.4), rr(.2, .7), -p.tz * dir * rr(1, 2.4), rr(.9, 1.6), rr(.5, .8), 1.1, .5, .75, 1.1, .5, { drag: 1.2 }); } fxTimed(4, p.x, p.y + .08, p.z, 2.6, 2.6, .3, .6, 1.2, .5, .9, { ground: true }); }
      sfx('rise', u.x, u.z, .5, .4);
      for (const m of G.mons) if (groundFoe(m) && m.s >= s0 && m.s <= s1) { const p = pathAt(B, m.s, _p); slowMonster(m, .5, w); hit(u, m, v, 'blast', -p.tx * .5, -p.tz * .5); }
    }
    else if (sk.key === 'beiwei') {
      u.hasteT = 5; fxDust(u.x, u.y + .1, u.z, 16, 1.8, { speed: 3.6 }); fxTimed(4, u.x, u.y + .08, u.z, 5.6, 5.6, 1.4, .9, .4, .6, .5, { ground: true }); FX.shake = Math.min(1, FX.shake + .35); sfx('clash', u.x, u.z, .9, .3);
      for (const m of G.mons) { if (!groundFoe(m)) continue; const dx = m.x - u.x, dz = m.z - u.z, d = Math.hypot(dx, dz) || 1; if (d < 2.8 + m.rad) hit(u, m, v, 'blast', dx / d, dz / d); }
    }
    else if (sk.key === 'volley') {
      const list = inRange(u).sort((a, b) => b.prog - a.prog).slice(0, v);
      list.forEach((m, k) => shootArrow(u.x + rr(-.5, .5), u.y + 1.5 + rr(0, .5), u.z + rr(-.5, .5), m, w * scaleDmg(), H, k % 2 ? { fast: true } : {}));
      for (let k = 0; k < 4; k++) sfx('bow', u.x, u.z, .5, rnd());
    }
    else if (sk.key === 'chanyu') {
      let best = null; for (const m of inRange(u)) if (!best || m.hp > best.hp) best = m;
      if (best) { shootArrow(u.x, u.y + 1.4, u.z, best, v * scaleDmg(), H, { fast: true, kind: 'bolt', slow: [.6, 2.2] }); sfx('bow', u.x, u.z, .9, .1); fxSparks(u.x, u.y + 1.4, u.z, 5, 3, 3, 2.2, 1, { size: .05 }); }
    }
  }
  function inRange(u) { const r = u.d.range, out = []; for (const m of G.mons) { if (m.dead || m.hp <= 0 || m.dying > 0 || m.wallSt === 'inside' || (!m.vis && !m.fly) || m.eth) continue; if (dist2(u.x, u.z, m.x, m.z) < r * r) out.push(m); } return out; }
  // 军师（也替亲自督战的玩家）决定何时放技能：敌人够密，或首领到了跟前
  function wantCast(u, i) {
    const k = u.d.skills[i].key, B = G.B; let n = 0, boss = false;
    if (k === 'raid') { for (const m of G.mons) if (groundFoe(m) && m.s < u.s + .5 && m.s > u.s - 10) { n++; if (m.def.boss) boss = true; } return n >= 3 || boss; }
    if (k === 'flood') { for (const m of G.mons) if (groundFoe(m) && Math.abs(m.s - u.s) < 9) { n++; if (m.def.boss) boss = true; } return n >= 4 || boss; }
    if (k === 'beiwei') { for (const m of G.mons) if (groundFoe(m) && dist2(m.x, m.z, u.x, u.z) < 7.8) { n++; if (m.def.boss) boss = true; } return n >= 3 || boss; }
    if (k === 'volley') { const l = inRange(u); return l.length >= 4 || l.some(m => m.def.boss); }
    if (k === 'chanyu') return inRange(u).some(m => m.hp > 50 * scaleDmg() || m.def.boss);
    return false;
  }

  function think(u) {
    const B = G.B, lo = zoneMin(); let best = null;
    if (u.d.ranged) { let bp = -1; for (const m of inRange(u)) if (m.prog > bp) { bp = m.prog; best = m; } u.tgt = best; let front = null; for (const m of G.mons) if (groundFoe(m) && m.s > lo && (!front || m.s > front.s)) front = m; u.goS = best ? u.s : front ? clamp(front.s + 4.5, lo, B.L - 1.2) : homeS(); u.goLat = .9; return; }
    for (const m of G.mons) if (groundFoe(m) && m.s > lo && (!best || m.s > best.s)) best = m;
    u.tgt = best;
    if (best) { const side = u.s >= best.s ? 1 : -1; let gs = best.s + side * (best.rad + .55); if (gs > B.L - .5) gs = best.s - (best.rad + .55); u.goS = clamp(gs, lo * .9, B.L - .5); u.goLat = clamp(best.lat, -.95, .95); }
    else { u.goS = homeS(); u.goLat = .55; }
  }
  function updateUnit(dt) {
    const u = H.u, B = G.B, d = u.d, play = G.phase === 'play';
    u.appear = Math.min(1, u.appear + dt * 2); u.flash = Math.max(0, u.flash - dt * 6); u.sayT -= dt; u.hasteT -= dt; u.cd -= dt * (u.hasteT > 0 ? 2 : 1);
    H.recent = Math.max(0, H.recent - dt * 8);
    // 常驻效果
    if (u.key === 'bai' && lvOf(2)) { const k = 1 - d.skills[2].v[lvOf(2) - 1] / 100; for (const m of G.mons) if (!m._cp) { m._cp = 1; if (!m.def.boss && !(m.pop > 0) && m.hp === m.maxHp) { m.maxHp *= k; m.hp *= k; } } }
    if (u.key === 'yue' && lvOf(2) && play) { const r = d.skills[2].v[lvOf(2) - 1] / 100 * dt; if (G.wall) for (const a of G.wall.men) if (a.hp < a.maxHp) a.hp = Math.min(a.maxHp, a.hp + a.maxHp * r); for (const f of G.men) if (!f.dead && f.hp < f.maxHp) f.hp = Math.min(f.maxHp, f.hp + f.maxHp * r); }
    if (u.key === 'huo' && lvOf(2) && G.bossDown && !u.sealed) { u.sealed = true; const n = d.skills[2].w[lvOf(2) - 1], g = Math.min(n, G.maxLives - G.lives); if (g > 0) { G.lives += g; say(u, '封狼居胥 · 城防 +' + g); } }
    if (!G.bossDown) u.sealed = false;
    if (play) for (let i = 0; i < 3; i++) { const sk = d.skills[i]; if (!sk.cd) continue; u.cds[i] = Math.max(0, u.cds[i] - dt); if (u.cds[i] <= 0 && lvOf(i) && !u.charge && wantCast(u, i)) { cast(u, i); break; } }
    let face = null, moving = 0;
    if (u.charge) {
      const c = u.charge, st = Math.min(u.s - c.to, 12 * dt); u.s -= st; u.lat = damp(u.lat, 0, 8, dt); moving = st; const p = place(u); face = Math.atan2(-p.tx, -p.tz);
      if (rnd() < dt * 30) fxDust(u.x, u.y + .1, u.z, 2, .8, { speed: 2 });
      for (const m of G.mons) if (groundFoe(m) && !c.done.has(m) && Math.abs(m.s - u.s) < m.rad + .8) { c.done.add(m); hit(u, m, c.dmg, 'blast', -p.tx, -p.tz); fxSparks(m.x, m.y + m.hitH, m.z, 4, 3.5, 3, 2.3, 1.2, { size: .055, grav: 7 }); }
      if (st < 1e-3 || u.s <= c.to + .01) u.charge = null;
    } else {
      u.think -= dt; if (u.think <= 0 || (u.tgt && (u.tgt.dead || u.tgt.hp <= 0))) { u.think = .25; think(u); }
      const ds = u.goS - u.s, st = clamp(ds, -d.spd * dt, d.spd * dt), dl = clamp(u.goLat - u.lat, -2.2 * dt, 2.2 * dt); u.s += st; u.lat += dl; moving = Math.abs(st) + Math.abs(dl) * .5;
      const p = place(u); if (Math.abs(st) > 1e-3) face = Math.atan2(p.tx * Math.sign(st), p.tz * Math.sign(st)); else if (!u.tgt) face = Math.atan2(-p.tx, -p.tz);
      const m = u.tgt;
      if (m && play) {
        const dx = m.x - u.x, dz = m.z - u.z, dist = Math.hypot(dx, dz) || 1;
        if (d.ranged) {
          face = Math.atan2(dx, dz); u.pitch = clamp(Math.atan2(m.y + m.hitH - u.y - 1.2, dist) * .7 + .15, -.5, .6);
          const sz = u.key === 'li' && lvOf(2) ? 1 + d.skills[2].v[lvOf(2) - 1] / 100 * (G.maxLives - G.lives) : 1;
          u.cd -= dt * (sz - 1); u.draw = u.cd < .3 ? Math.min(1, u.draw + dt * 4.5) : Math.max(0, u.draw - dt * 6);
          if (u.cd <= 0 && u.draw > .9) { u.cd = d.rate; u.draw = 0; shootArrow(u.x + Math.sin(u.yaw) * .35, u.y + 1.35, u.z + Math.cos(u.yaw) * .35, m, d.dmg * scaleDmg(), H); sfx('bow', u.x, u.z, .6, rnd()); }
        } else if (dist < m.rad + d.reach + .45) {
          face = Math.atan2(dx, dz);
          if (u.atk < 0 && u.cd <= 0) { u.atk = 0; u.struck = false; }
        }
      } else u.draw = Math.max(0, u.draw - dt * 4);
      if (u.atk >= 0) {
        u.atk += dt / .5 * (u.hasteT > 0 ? 1.6 : 1);
        if (u.atk >= .5 && !u.struck) { u.struck = true; const m2 = u.tgt; if (m2 && !m2.dead && m2.hp > 0) { const dx = m2.x - u.x, dz = m2.z - u.z, l = Math.hypot(dx, dz) || 1; if (l < m2.rad + d.reach + 1) { fxTimed(7, (u.x + m2.x) / 2, u.y + 1, (u.z + m2.z) / 2, 2, 2, 2.4, 2.1, 1.6, .9, .2, {}); fxSparks(m2.x - dx / l * m2.rad, m2.y + m2.hitH, m2.z - dz / l * m2.rad, m2.def.armor ? 7 : 3, 3.6, 3, 2.3, 1.2, { size: .055, grav: 7 }); sfx(m2.def.armor ? 'clash' : 'slash', u.x, u.z, .7, rnd()); hit(u, m2, d.dmg, 'sword', dx / l, dz / l); } } }
        if (u.atk >= 1) { u.atk = -1; u.cd = d.rate - .5; }
      }
    }
    u.ph += moving * (d.mount ? 3.2 : 5.6) / u.scale; u.mv = damp(u.mv, moving > 1e-3 ? 1 : 0, 10, dt);
    if (face !== null) u.yaw = angDamp(u.yaw, face, 12, dt);
  }
  function drawUnit() {
    const u = H.u, I = KIT.item, k = u.key, sc0 = u.scale; u.scale = sc0 * (.3 + .7 * easeOut(u.appear));
    u.weapon = null; u.helm = false; u.plate = false; u.hat = null; u.back = null; u.skirt = null; u.bow = false; u.xbow = false; u.wScale = 1; u.tint = null; u.horseTint = null;
    if (k === 'huo') { u.weapon = I.spear; u.helm = true; u.plate = true; u.tint = [1.15, .8, .7]; u.horseTint = [1.5, 1.45, 1.35]; rigHorse(u); }
    else if (k === 'yue') { u.weapon = I.spear; u.wScale = 1.1; u.helm = true; u.plate = true; u.tint = [.95, 1, 1.15]; u.horseTint = [.55, .45, .4]; rigHorse(u); }
    else if (k === 'bai') { u.weapon = I.ge; u.wScale = 1.1; u.back = I.qinJia; u.hat = I.qinBun; u.tint = [.9, .9, 1.05]; rigHuman(KIT.foot, SPEC.foot, u); }
    else { u.bow = true; u.helm = true; u.plate = true; u.tint = [1.25, 1.1, .85]; rigHuman(KIT.foot, SPEC.foot, u); }
    u.scale = sc0;
    // 脚下一圈金光，标出名将所在
    u.ringT = (u.ringT || 0) - R.frameDt; if (u.ringT <= 0 && G.phase === 'play') { u.ringT = .45; fxTimed(4, u.x, u.y + .08, u.z, 2.1, 2.1, 1.5, 1.05, .35, .35, .7, { ground: true }); }
  }

  // ---- 战后策勋 ----
  function judge() {
    const W = G.wall, st = H.stats || { slain0: G.slain }, kills = Math.max(0, G.slain - st.slain0), leaks = G.leaks, held = kills + leaks > 0 ? kills / (kills + leaks) : 1;
    const zhen = G.press >= 2 ? 0 : G.press >= 1.5 ? 1 : 2, huo = held >= .99 ? 0 : held >= .96 ? 1 : 2, whole = G.lives >= G.maxLives && !W.breaks;
    const zhuan = 5 - zhen - huo + (whole ? 1 : 0);
    H.eval = { level: G.level, bio: G.B.bio.name, press: G.press, kills, leaks, held, zhen, huo, whole, zhuan, lives: G.lives, lost: W.lost, breaks: W.breaks, topped: W.topped, hero: H.u ? H.u.d.name : '', heroKills: H.kills };
    H.save.pts += zhuan; H.save.won++; store();
    H.pending = true;
  }
  // 策勋榜开着时，关卡停在「关隘无恙」不往下走。无人操作则 14 秒后自动收榜（快进与模拟对局按游戏内 60 秒计）。
  function hold() {
    if (!H.pending && !(H.open && H.evalMode)) return false;
    if (!UI.playerActive() && (G.phaseT > 60 || (H.holdT0 && performance.now() - H.holdT0 > 14000))) { closePanel(); H.pending = false; return false; }
    return true;
  }

  function update(dt) {
    if (!H.save) H.save = load();
    if (G.wall !== H.wallRef) { H.wallRef = G.wall; H.stats = { slain0: G.slain }; H.kills = 0; H.dealt = 0; deploy(false); }
    if (G.phase !== H.phase) { if (G.phase === 'clear') judge(); H.phase = G.phase; }
    if (!H.u) return;
    updateUnit(dt); drawUnit();
  }

  // ---- 界面：战场上的名将牌（画在 HUD 画布上）与名将榜（DOM 面板）----
  const CSS = `
#hero{position:fixed;z-index:9;left:50%;top:50%;transform:translate(-50%,-50%);width:min(760px,94vw);max-height:90vh;overflow:auto;padding:14px 16px 16px;background:rgba(9,11,17,.96);border:2px solid #e8b04a;color:#efe4cd;font:14px/1.55 "PingFang SC","Microsoft YaHei","Noto Sans CJK SC",sans-serif;box-shadow:0 6px 28px rgba(0,0,0,.7);user-select:none;-webkit-user-select:none;touch-action:pan-y;box-sizing:border-box}
#hero h2{margin:0;font-size:18px;font-weight:600;color:#ffd9a8;letter-spacing:2px}
#hero .hd{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:10px}
#hero .pts{color:#e8b04a;white-space:nowrap}
#hero .pts b{font-size:18px}
#hero button{padding:5px 12px;background:#181b26;border:1px solid #5d4c35;color:#efe4cd;font:inherit;cursor:pointer;border-radius:0}
#hero button:hover:not(:disabled){border-color:#e8b04a;background:#222636}
#hero button:disabled{color:#6f685b;border-color:#3a342c;cursor:default}
#hero button.go{border-color:#e8b04a;color:#e8b04a}
#hero .ev{border:1px solid #5d4c35;background:rgba(24,27,38,.8);padding:10px 12px;margin-bottom:12px}
#hero .ev .t{color:#ff8a3c;margin-bottom:4px}
#hero .ev table{border-collapse:collapse;width:100%}
#hero .ev td{padding:2px 8px 2px 0;vertical-align:top}
#hero .ev td:first-child{color:#a79e8a;white-space:nowrap}
#hero .ev td:last-child{text-align:right;color:#e8b04a;white-space:nowrap}
#hero .ev .sum{margin-top:6px;padding-top:6px;border-top:1px solid #5d4c35;display:flex;justify-content:space-between;align-items:baseline}
#hero .ev .sum b{font-size:20px;color:#ffd9a8}
#hero .note{color:#6f685b;font-size:12px;margin-top:6px}
#hero .tabs{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:10px}
#hero .tabs button{padding:6px 4px;text-align:center}
#hero .tabs button small{display:block;color:#a79e8a;font-size:12px}
#hero .tabs button.on{border-color:#e8b04a;background:#222636}
#hero .tabs button.out b::after{content:" · 出战";color:#9fd08a;font-weight:400;font-size:12px}
#hero .who{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:8px}
#hero .who .nm{font-size:16px;color:#e8b04a}
#hero .who p{margin:2px 0 0;color:#cfc5ae}
#hero .src{color:#a79e8a;font-size:12px}
#hero .sk{border:1px solid #3a342c;padding:8px 10px;margin-top:8px;display:grid;grid-template-columns:1fr auto;gap:4px 12px;align-items:start}
#hero .sk .n{color:#ffd9a8}
#hero .sk .n i{font-style:normal;color:#e8b04a;letter-spacing:2px;margin-left:8px}
#hero .sk .n em{font-style:normal;color:#a79e8a;font-size:12px;margin-left:8px}
#hero .sk .nx{color:#9fd08a;font-size:13px}
#hero .sk .off{color:#a79e8a}
#hero .ft{display:flex;justify-content:space-between;gap:8px;margin-top:14px}`;
  const esc = s => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  const fxText = (sk, lv) => sk.fx(sk.v[lv - 1], sk.w ? sk.w[lv - 1] : 0) + (sk.cd ? '冷却 ' + sk.cd[lv - 1] + ' 秒。' : '');
  function build() {
    const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    const el = H.panel = document.createElement('div'); el.id = 'hero'; el.style.display = 'none'; document.body.appendChild(el);
    for (const ev of ['pointerdown', 'pointermove', 'pointerup', 'wheel', 'contextmenu', 'touchstart']) el.addEventListener(ev, e => e.stopPropagation());
    el.addEventListener('click', e => {
      const t = e.target.closest('[data-a]'); if (!t || t.disabled) return; const a = t.dataset.a;
      if (a === 'tab') H.tab = t.dataset.k;
      else if (a === 'pick') pick(H.tab);
      else if (a === 'up') { if (spend(H.tab, +t.dataset.i)) sfx('buildDone', CAM.x, CAM.z, .7); }
      else if (a === 'refund') refund();
      else if (a === 'close') { closePanel(); return; }
      sfx('uiClick', CAM.x, CAM.z, .7); render();
    });
  }
  function render() {
    const S = H.save, d = HEROES[H.tab], out = S.pick === H.tab, e = H.evalMode ? H.eval : null; let h = '';
    h += '<div class="hd"><h2>' + (e ? '战后策勋' : '名将') + '</h2><span class="pts">可用之勋 <b>' + S.pts + '</b> 转</span></div>';
    if (e) {
      h += '<div class="ev"><div class="t">' + esc(e.bio) + ' · 关隘无恙' + (e.hero ? ' · 出战名将 ' + esc(e.hero) : '') + '</div><table>' +
        '<tr><td>阵</td><td>敌势 ' + e.press.toFixed(2) + ' 倍' + (e.zhen === 0 ? '，以少击多' : e.zhen === 1 ? '，众寡相当' : '，敌势已衰') + '</td><td>' + HERO_ZHEN[e.zhen] + '</td></tr>' +
        '<tr><td>获</td><td>斩敌 ' + e.kills + '，抵城之敌 ' + e.leaks + '，拒敌于城外 ' + Math.floor(e.held * 100) + '%</td><td>' + HERO_HUO[e.huo] + '</td></tr>' +
        '<tr><td>全城</td><td>城防余 ' + e.lives + '/' + G.maxLives + '，城门' + (e.breaks ? '被破 ' + e.breaks + ' 次' : '未破') + '，守军阵亡 ' + e.lost + '</td><td>' + (e.whole ? '加一转' : '不加') + '</td></tr>' +
        '</table><div class="sum"><span>' + HERO_ZHEN[e.zhen] + HERO_HUO[e.huo] + (e.whole ? '，城防无损' : '') + '</span><span>酬勋 <b>' + e.zhuan + '</b> 转</span></div>' +
        '<div class="note">' + HERO_RULE + '敌势随你守得越稳而越强，满 2 倍为上阵，1.5 倍为中阵；拒敌于城外 99% 为上获，96% 为中获；城防无损且城门未破，另加一转。关城失守不叙功。</div></div>';
    }
    h += '<div class="tabs">' + HERO_KEYS.map(k => '<button data-a="tab" data-k="' + k + '" class="' + (k === H.tab ? 'on ' : '') + (k === S.pick ? 'out' : '') + '"><b>' + HEROES[k].name + '</b><small>' + HEROES[k].era + '</small></button>').join('') + '</div>';
    h += '<div class="who"><div><span class="nm">' + d.name + ' · ' + d.title + '</span><p>' + esc(d.bio) + '</p><div class="src">' + esc(d.src) + '</div></div><button data-a="pick" class="go"' + (out ? ' disabled' : '') + '>' + (out ? '出战中' : '派其出战') + '</button></div>';
    d.skills.forEach((sk, i) => {
      const lv = S.lv[H.tab][i], c = costOf(lv), max = lv >= 3;
      h += '<div class="sk"><div><div class="n">' + sk.name + '<i>' + '●'.repeat(lv) + '○'.repeat(3 - lv) + '</i><em>' + (sk.cd ? '自动施放' : '常驻') + '</em></div>' +
        '<div class="' + (lv ? '' : 'off') + '">' + (lv ? esc(fxText(sk, lv)) : '尚未习得。') + '</div>' +
        (max ? '' : '<div class="nx">' + (lv ? '下一级：' : '一级：') + esc(fxText(sk, lv + 1)) + '</div>') +
        '<div class="src">史料：' + esc(sk.src) + '</div></div>' +
        '<button data-a="up" data-i="' + i + '"' + (max || S.pts < c ? ' disabled' : '') + '>' + (max ? '已满级' : '加点 · ' + c + ' 转') + '</button></div>';
    });
    h += '<div class="ft"><button data-a="refund">重新分配（退还全部勋转）</button><button data-a="close" class="go">' + (e ? '继续，转战下一关' : '关闭') + '</button></div>';
    H.panel.innerHTML = h;
  }
  function openPanel(evalMode) { if (!H.save) H.save = load(); if (!H.panel) build(); H.open = true; H.evalMode = !!evalMode; H.tab = H.save.pick; H.panel.style.display = ''; H.panel.scrollTop = 0; render(); }
  function closePanel() { if (H.evalMode) { H.pending = false; H.holdT0 = 0; } H.open = false; H.evalMode = false; if (H.panel) H.panel.style.display = 'none'; }
  function toggle() { if (H.open) closePanel(); else { openPanel(false); sfx('uiHover', CAM.x, CAM.z, .8); } }

  function plate(c, x, y, w, h, s, bd, bg) {
    c.fillStyle = bd; c.fillRect(x + s, y, w - 2 * s, h); c.fillRect(x, y + s, w, h - 2 * s);
    c.fillStyle = bg; c.fillRect(x + 2 * s, y + s, w - 4 * s, h - 2 * s); c.fillRect(x + s, y + 2 * s, w - 2 * s, h - 4 * s);
  }
  // 每帧在 UI.draw 之后调用
  function draw() {
    if (!H.save || !H.u || !UI.ctx) return;
    const c = UI.ctx, s = UI.s, u = H.u, d = u.d, LH = PX.LINE * s, pad = 5 * s, W = R.dw, tw = t => PX.measure(t, s) * s;
    if (H.pending && !H.open && G.phase === 'clear' && G.phaseT > 1.3) { openPanel(true); H.holdT0 = performance.now(); }
    if (H.open && !H.evalMode && G.phase !== 'play' && G.phase !== 'clear') closePanel();
    const live = G.phase === 'play' || G.phase === 'clear' || G.phase === 'defeat';
    if (live) {
      const p = UI.proj(u.x, u.y + (d.mount ? 2.75 : 2.05) * u.scale, u.z), talk = u.sayT > 0 && u.say;
      PX.text(c, talk ? u.say : d.name, Math.round(p.x), Math.round(p.y - LH), s, talk ? '#ffd9a8' : '#e8b04a', { align: 'c', outline: '#0b0d14' });
    }
    if (!live) { H.rect = null; return; }
    const cr = UI.cmdRect; if (!cr) return;
    const t1 = d.name + ' · ' + d.title, chips = d.skills.map((sk, i) => { const lv = lvOf(i); return { t: sk.name, lv, cd: sk.cd && lv ? u.cds[i] : 0, max: sk.cd && lv ? sk.cd[lv - 1] : 1 }; });
    const t3 = H.save.pts > 0 ? 'H 名将 · 勋 ' + H.save.pts + ' 转可加点' : 'H 名将与技能';
    const cw = Math.max(...chips.map(k => tw(k.t))) + 4 * s, w = Math.max(tw(t1), tw(t3), cw + tw('00 秒') + 4 * s) + pad * 2, h = LH * 5 + pad * 2 + 4 * s;
    const x = W - w - 5 * s, y = cr.y + cr.h + 3 * s, hot = UI.inside && UI.mx >= x && UI.mx <= x + w && UI.my >= y && UI.my <= y + h;
    H.rect = { x, y, w, h };
    plate(c, x, y, w, h, s, hot || H.save.pts > 0 ? '#e8b04a' : '#5d4c35', hot ? 'rgba(24,27,38,0.94)' : 'rgba(9,11,17,0.86)');
    PX.text(c, t1, x + pad, y + pad - s, s, '#e8b04a');
    chips.forEach((k, i) => {
      const yy = y + pad + LH * (i + 1) + s, ready = k.lv && k.cd <= 0;
      PX.text(c, k.t, x + pad, yy, s, !k.lv ? '#6f685b' : ready ? '#efe4cd' : '#a79e8a');
      const r = !k.lv ? '未习得' : k.max === 1 && !d.skills[i].cd ? '常驻' : k.cd > 0 ? Math.ceil(k.cd) + ' 秒' : '待发';
      PX.text(c, r, x + w - pad, yy, s, !k.lv ? '#6f685b' : r === '待发' ? '#9fd08a' : '#a79e8a', { align: 'r' });
      if (k.lv && k.cd > 0) { c.fillStyle = '#2a2620'; c.fillRect(x + pad, yy + LH - s, w - pad * 2, s); c.fillStyle = '#e8b04a'; c.fillRect(x + pad, yy + LH - s, Math.round((w - pad * 2) * (1 - k.cd / k.max)), s); }
    });
    PX.text(c, t3, x + pad, y + pad + LH * 4 + 3 * s, s, H.save.pts > 0 ? '#9fd08a' : '#a79e8a');
  }
  function init() {
    window.addEventListener('pointerdown', e => {
      const r = H.rect, D = R.dpr || 1, mx = e.clientX * D, my = e.clientY * D;
      if (r && !H.open && mx >= r.x && mx <= r.x + r.w && my >= r.y && my <= r.y + r.h) { e.stopPropagation(); e.preventDefault(); toggle(); }
    }, { capture: true, passive: false });
    window.addEventListener('keydown', e => {
      if (e.repeat || CHEAT.owns(e.target)) return;
      if (e.key === 'h' || e.key === 'H') toggle();
      else if (e.key === 'Escape' && H.open) { closePanel(); e.stopPropagation(); }
    }, true);
  }
  Object.assign(H, { update, draw, hold, init, openPanel, closePanel, toggle, spend, refund, pick, load, judge, lvOf });
  return H;
})();
