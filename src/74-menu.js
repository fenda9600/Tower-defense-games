// The main menu and the after-action card, drawn on the HUD canvas in the pixel font over the battlefield itself.
// The menu's backbone is the line of beacons: the ten battlefields stand along a wall as ten beacon towers, lit where the pass was held,
// waiting where the next fight is, dark beyond. It is the progress bar and the stage picker in one.
const MENU = (() => {
  const M = { card: null, swap: null, rects: [], gp: { prev: [], t: 0 }, peek: null, gpeek: null, gHover: -1, focusSkill: -1, enterT: 0 };
  const inMenu = () => G.phase === 'menu';
  const cardUp = () => !!(M.card && M.card.shown);
  // when each battlefield was fought, for the stage card
  const ERA = { ashen: '战国 · 赵', diaoyu: '南宋 · 1259 年', yiling: '三国 · 222 年', chibi: '东汉末 · 208 年', jingxing: '楚汉 · 前 204 年', dunes: '西汉 · 前 104 年', fen: '战国 · 前 278 年', jieting: '三国 · 228 年', yinping: '三国 · 263 年', frost: '金 · 1213 年' };
  // the other grades' new works and troops are named by DIFF_NAMES when that table exists; a missing name is left out
  const nameOf = key => { const t = typeof DIFF_NAMES === 'object' && DIFF_NAMES ? DIFF_NAMES[key] : null; return t && t.name ? t : null; };

  // ---- the field behind the menu ----
  function raise(i) {
    clearField(); G.level = i; G.lives = G.maxLives;
    const B = G.B = buildBoard(G.boardSeed++, i); R.scene.add(B.group); activateBoard(B, true);
  }
  function enter(won) {
    const C = CAMPAIGN;
    if (won !== null) C.sel = won ? Math.min(G.level + 1, stageCount() - 1) : G.level;
    while (C.sel > 0 && !stageOpen(C.sel)) C.sel--;
    campaignSave(); C.news = null; C.grade = null;
    G.phase = 'menu'; G.phaseT = 0; G.paused = false; G.speed = 1; M.card = null; M.swap = null; M.peek = null; M.enterT = 0;
    UI.setManual(false); UI.closeMenu(); UI.lore = null; UI.msg = null;
    raise(C.sel);
  }
  const deny = () => sfx('uiDeny', CAM.x, CAM.z, .6);
  function choose(i) {
    if (!stageOpen(i)) { deny(); if (i >= 0 && i < stageCount()) M.peek = { i, t: 1.6 }; return false; }
    M.peek = null;
    if (i === CAMPAIGN.sel) return true;
    CAMPAIGN.sel = i; campaignSave(); M.swap = { t: 0, done: false };
    sfx('uiHover', CAM.x, CAM.z, .7); return true;
  }
  // a grade is chosen here and nowhere else; the battlefield selected falls back to the last one open on it
  function grade(i) {
    if (!gradeOpen(i)) { deny(); if (i >= 0 && i < DIFF.list.length) M.gpeek = { i, t: 1.6 }; return false; }
    M.gpeek = null;
    if (i === DIFF.cur) return true;
    DIFF.cur = i; sfx('uiHover', CAM.x, CAM.z, .7);
    let k = CAMPAIGN.sel; while (k > 0 && !stageOpen(k)) k--;
    if (k !== CAMPAIGN.sel) choose(k); else campaignSave();
    return true;
  }
  function nextGrade(d) { const n = DIFF.list.length; for (let k = 1; k < n; k++) { const i = ((DIFF.cur + d * k) % n + n) % n; if (gradeOpen(i)) return grade(i); } deny(); return false; }
  function general(d) { const i = HERO_KEYS.indexOf(HERO.save.pick), k = HERO_KEYS[((i + d) % HERO_KEYS.length + HERO_KEYS.length) % HERO_KEYS.length]; if (HERO.pick(k)) { M.focusSkill = -1; sfx('uiHover', CAM.x, CAM.z, .7); } }
  function raiseSkill(i) { M.focusSkill = i; if (HERO.spend(HERO.save.pick, i)) sfx('buildDone', CAM.x, CAM.z, .7); else deny(); }
  function go() {
    if (!inMenu() || M.swap || !stageOpen(CAMPAIGN.sel) || !gradeOpen(DIFF.cur)) { deny(); return; }
    UI.titleT = 7; UI.showLore(G.B.bio); beginBattle(true);
    UI.banner(stageLabel(G.level) + ' · ' + G.B.bio.name, 3.2, false, diffNow().name + ' · ' + HEROES[HERO.save.pick].name + '出战');
    sfx('horn', CAM.x, CAM.z, 1);
  }

  // ---- the after-action card ----
  function settle(won) { M.card = FLOW.card[won ? 'clear' : 'defeat'] ? { won, shown: false, t0: 0 } : null; }
  function holding() {
    const c = M.card; if (!c) return false;
    // an unattended card closes itself in the tool runs: 14 seconds on screen, or 60 seconds of game time when stepped without frames
    if (FLOW.lapse && !UI.playerActive() && (G.phaseT > 60 || (c.t0 && performance.now() - c.t0 > 14000))) { M.card = null; return false; }
    return true;
  }
  function dismiss() { if (cardUp()) { M.card = null; sfx('uiClick', CAM.x, CAM.z, .8); } }

  // ---- drawing ----
  // one cinnabar for what acts (the sortie, the chosen grade, the selected beacon), bronze for structure, ink behind the words
  const K = { ink: 'rgba(7,8,11,0.82)', inkS: 'rgba(7,8,11,0.94)', bronze: '#8a6a3c', bronzeD: '#4a3c2a', gold: '#e8b04a', zhu: '#c23a26', zhuL: '#e0553a', bone: '#efe4cd', dim: '#a79e8a', faint: '#5f584c', dark: '#24201c', fire: '#ff9a3c', fireL: '#ffd27a', ok: '#9fd08a' };
  let c = null, s = 2, W = 0, H = 0, LH = 18;
  const tw = (t, k = s) => PX.measure(t, k) * k;
  const text = (t, x, y, col, o, k = s) => PX.text(c, t, x, y, k, col, o);
  const box = (x, y, w, h, col) => { c.fillStyle = col; c.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
  // the panel: ink with a chamfered bronze rule, the same cut as the battle plates
  function panel(x, y, w, h, bd = K.bronzeD, bg = K.ink) {
    x = Math.round(x); y = Math.round(y); w = Math.round(w); h = Math.round(h);
    box(x + s, y, w - 2 * s, h, bd); box(x, y + s, w, h - 2 * s, bd);
    c.clearRect(x + 2 * s, y + s, w - 4 * s, h - 2 * s); c.clearRect(x + s, y + 2 * s, w - 2 * s, h - 4 * s);
    box(x + 2 * s, y + s, w - 4 * s, h - 2 * s, bg); box(x + s, y + 2 * s, w - 2 * s, h - 4 * s, bg);
  }
  const NOHEAD = '，。、；：！？」』）·';
  function wrap(str, maxW, k = s) { const out = []; let line = ''; for (const ch of str) { if (line && tw(line + ch, k) > maxW && NOHEAD.indexOf(ch) < 0 && !(/[\d%]/.test(ch) && /\d/.test(line[line.length - 1]))) { out.push(line); line = ch === ' ' ? '' : ch; } else line += ch; } if (line) out.push(line); return out; }
  function wrapAt(str, maxW) { if (str.indexOf('  ') < 0) return wrap(str, maxW); const out = []; let line = ''; for (const seg of str.split('  ')) { const t = line ? line + '  ' + seg : seg; if (line && tw(t) > maxW) { out.push(line); line = '   ' + seg; } else line = t; } if (line) out.push(line); return out; }
  function btn(x, y, w, h, fn, id) { M.rects.push({ x, y, w, h, fn, id }); return hot(x, y, w, h); }
  const hot = (x, y, w, h) => UI.inside && UI.mx >= x && UI.mx <= x + w && UI.my >= y && UI.my <= y + h;
  const flick = (t, k) => .5 + .5 * Math.sin(t * 9.1 + k * 2.3) * Math.sin(t * 5.3 + k * 1.7);

  function draw() {
    c = UI.ctx; if (!c) return;
    s = UI.s; W = R.dw; H = R.dh; LH = PX.LINE * s; M.rects.length = 0;
    pollPad();
    if (inMenu()) { M.enterT += R.frameDt; drawMenu(); }
    else if (M.card && (G.phase === 'clear' || G.phase === 'defeat') && G.phaseT > (M.card.won ? 1.3 : 2.2)) { if (!M.card.shown) { M.card.shown = true; M.card.t0 = performance.now(); UI.msg = null; UI.lore = null; } drawCard(); }
    if (M.swap) {
      // a quick dip to black around the rebuild, which itself takes about 0.2 s (buildBoard)
      const S = M.swap; S.t += R.frameDt; const a = S.done ? sat(1 - (S.t - .06) / .1) : sat(S.t / .06);
      if (!S.done && S.t >= .06) { raise(CAMPAIGN.sel); S.done = true; S.t = .06; }
      if (S.done && a <= 0) M.swap = null;
      c.fillStyle = 'rgba(4,5,8,' + (a * .85).toFixed(3) + ')'; c.fillRect(0, 0, W, H);
    }
    if (inMenu() || cardUp()) R.canvas.style.cursor = M.rects.some(r => hot(r.x, r.y, r.w, r.h)) ? 'pointer' : 'default';
  }

  // the field stays readable in the middle; the bands that carry words are pressed into the dark
  function shade() {
    c.fillStyle = 'rgba(5,6,9,0.30)'; c.fillRect(0, 0, W, H);
    let g = c.createLinearGradient(0, 0, 0, H * .42); g.addColorStop(0, 'rgba(5,6,9,0.72)'); g.addColorStop(1, 'rgba(5,6,9,0)'); c.fillStyle = g; c.fillRect(0, 0, W, H * .42);
    g = c.createLinearGradient(0, H * .5, 0, H); g.addColorStop(0, 'rgba(5,6,9,0)'); g.addColorStop(1, 'rgba(5,6,9,0.86)'); c.fillStyle = g; c.fillRect(0, H * .5, W, H * .5);
    g = c.createRadialGradient(W / 2, H * .48, Math.min(W, H) * .3, W / 2, H * .48, Math.hypot(W, H) * .62); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.55)'); c.fillStyle = g; c.fillRect(0, 0, W, H);
  }

  // ---- the title: the name set upright like a stele, the seal beside it ----
  function drawTitle(x, y, k) {
    const gh = PX.LINE * k, step = gh + 2 * s;
    text('烽', x, y, '#f3dcb0', { shadow: '#000' }, k); text('燧', x, y + step, '#f3dcb0', { shadow: '#000' }, k);
    const gw = tw('烽', k), sx = x + gw + 5 * s, sw = tw('戍', s) + 6 * s, sh = LH * 2 + 6 * s;
    box(sx, y + 2 * s, sw, sh, K.zhu); box(sx + s, y + 3 * s, sw - 2 * s, sh - 2 * s, '#a92f1e');
    text('戍', sx + sw / 2, y + 4 * s, '#f6e7d0', { align: 'c' }); text('边', sx + sw / 2, y + 4 * s + LH + s, '#f6e7d0', { align: 'c' });
    const sub = '守十关烽火'; let yy = y + sh + 8 * s;
    for (const ch of sub) { text(ch, sx + sw / 2, yy, K.dim, { align: 'c' }); yy += LH; }
    return { w: sx + sw - x, h: Math.max(step * 2, yy - y) };
  }

  // ---- one beacon tower: rammed earth tapering to a brazier ----
  function tower(cx, base, st, sel, i, lit, u) {
    const bw = 11, top = 7, hgt = 11, x0 = Math.round(cx);
    const body = st === 'held' ? ['#8d6c45', '#6e5236'] : st === 'next' ? ['#5f4c38', '#4a3b2c'] : ['#2a2622', '#221e1b'];
    if (lit > 0) { const g = c.createRadialGradient(x0, base - (hgt + 3) * u, 0, x0, base - (hgt + 3) * u, 16 * u); g.addColorStop(0, 'rgba(255,150,60,' + (.28 * lit).toFixed(3) + ')'); g.addColorStop(1, 'rgba(255,150,60,0)'); c.fillStyle = g; c.fillRect(x0 - 16 * u, base - (hgt + 19) * u, 32 * u, 32 * u); }
    for (let r = 0; r < hgt; r++) { const w = top + Math.round((bw - top) * r / (hgt - 1)), y = base - (hgt - r) * u; box(x0 - (w * u) / 2, y, w * u, u, r % 3 === 2 ? body[1] : body[0]); }
    // the brazier: a dark pan on the platform, with the watch fire in it once lit
    box(x0 - 4 * u, base - (hgt + 1) * u, 8 * u, u, st === 'dark' ? '#1d1a17' : '#2f2720');
    if (st === 'next') { const a = .5 + .5 * Math.sin(M.enterT * 3.2); box(x0 - u, base - (hgt + 2) * u, 2 * u, u, 'rgba(255,154,60,' + (.35 + .5 * a).toFixed(3) + ')'); }
    if (lit > 0) {
      const t = M.enterT, f = flick(t, i), h = Math.round(3 + lit * (2 + 2 * f));
      for (let r = 0; r < h; r++) { const w = r < h - 3 ? 6 : r < h - 1 ? 4 : 2, col = r < 2 ? K.zhuL : r < h - 2 ? K.fire : K.fireL; box(x0 - (w * u) / 2 + (r > 1 && f > .7 ? u : 0), base - (hgt + 2 + r) * u, w * u, u, col); }
    }
    return { top: base - (hgt + 6) * u };
  }

  // ---- the line of beacons ----
  function drawLine(L) {
    const n = stageCount(), held = CAMPAIGN.held[diffNow().key], all = CAMPAIGN.all;
    const xs = []; for (let i = 0; i < n; i++) xs.push(L.x0 + L.gap * i);
    const wallY = L.y, u = L.u, wh = 3 * u, ext = Math.min(L.gap * .5, 12 * s);
    // the wall, brighter where the beacons on it are lit
    box(xs[0] - ext, wallY, xs[n - 1] - xs[0] + ext * 2, wh, K.dark);
    const litTo = Math.min(n - 1, all ? n - 1 : held - 1);
    if (litTo >= 0) box(xs[0] - ext, wallY, xs[litTo] - xs[0] + ext, wh, '#6e5236');
    for (let x = xs[0] - ext; x < xs[n - 1] + ext - 2 * u; x += 4 * u) { const lit = x <= (litTo >= 0 ? xs[litTo] : -1e9); box(x, wallY - 2 * u, 2 * u, 2 * u, lit ? '#6e5236' : K.dark); }
    let peekX = null;
    for (let i = 0; i < n; i++) {
      const st = all || i < held ? 'held' : i === held ? 'next' : 'dark', sel = i === CAMPAIGN.sel, x = xs[i];
      const ign = st === 'held' ? sat((M.enterT - .2 - i * .09) / .25) : 0;
      const over = btn(x - L.gap / 2, wallY - 20 * u, L.gap, 20 * u + wh + LH + 6 * s, () => choose(i), 'stage' + i);
      if (over && i !== CAMPAIGN.sel) M.peek = { i, t: .05, hover: true };
      tower(x, wallY, st, sel, i, ign, u);
      text(STAGE_ORD[i], x, wallY + wh + 4 * s, sel ? K.bone : st === 'dark' ? K.faint : over ? K.bone : K.dim, { align: 'c' });
      if (sel) { box(x - 3 * s, wallY + wh + LH + 6 * s, 6 * s, s, K.zhu); box(x - 2 * s, wallY + wh + LH + 7 * s, 4 * s, s, K.zhu); box(x - s, wallY + wh + LH + 8 * s, 2 * s, s, K.zhu); }
      if (M.peek && M.peek.i === i) peekX = x;
    }
    return { xs, peekX, top: wallY - 18 * u };
  }

  // ---- the stage card: which battlefield, when it was fought, why it stands where it does, and whether it is held on this grade ----
  function stageCard(i, ax, axTop, box0, dry) {
    const k = CAMPAIGN.order[i], b = BIOMES.find(q => q.key === k), held = CAMPAIGN.held[diffNow().key], open = stageOpen(i), won = CAMPAIGN.all || i < held, pad = 7 * s;
    const t1 = stageLabel(i), t2 = b ? b.name : '', sc = s + 1;
    const status = !open ? '未至' : won ? diffNow().name + ' · 已守住' : diffNow().name + ' · 未守住';
    const reason = !open ? '先守住' + stageName(i - 1) + '，此关方开' : null;
    const wText = box0.w - pad * 2, note = wrap(CAMPAIGN.note[k] || '', wText), era = ERA[k] || '';
    const two = tw(era) + tw(status) + 8 * s > wText;
    const h = pad * 2 + PX.LINE * sc + 4 * s + LH * (two ? 2 : 1) + 6 * s + s + note.length * (LH + s) + (reason ? LH + 6 * s : 0);
    if (dry) return h;
    const x = box0.x, y = box0.bottom - h;
    // a thin bronze leader from the card down to its beacon
    if (ax !== null) { const lx = Math.round(clamp(ax, x + 6 * s, x + box0.w - 6 * s)); box(lx, y + h, s, Math.max(0, axTop - y - h), K.bronzeD); if (lx !== Math.round(ax)) box(Math.min(lx, ax), axTop - s, Math.abs(ax - lx) + s, s, K.bronzeD); }
    panel(x, y, box0.w, h, open ? K.bronzeD : '#2e2822', K.inkS);
    let yy = y + pad - s;
    text(t1, x + pad, yy, open ? K.zhuL : K.faint, null, sc); text(t2, x + pad + tw(t1, sc) + 6 * s, yy, open ? K.bone : K.dim, null, sc);
    yy += PX.LINE * sc + 4 * s;
    text(era, x + pad, yy, K.dim); if (two) yy += LH; text(status, two ? x + pad : x + box0.w - pad, yy, !open ? K.faint : won ? K.gold : K.dim, { align: two ? 'l' : 'r' });
    yy += LH + 5 * s; box(x + pad, yy, box0.w - pad * 2, s, '#3a3128'); yy += 3 * s;
    note.forEach(l => { text(l, x + pad, yy, open ? '#d9cdb4' : K.faint); yy += LH + s; });
    if (reason) { yy += 3 * s; text(reason, x + pad, yy, K.zhuL); }
    return h;
  }

  // ---- the grade tokens: upright command tablets ----
  function grades(x, y, w, k) {
    const n = DIFF.list.length, gap = 4 * s, lh = PX.LINE * k, tw0 = Math.max(tw('困', k) + 12 * s, Math.floor((Math.min(w, 120 * s) - gap * (n - 1)) / n)), th = lh * 2 + 13 * s;
    DIFF.list.forEach((d, i) => {
      const bx = x + i * (tw0 + gap), on = i === DIFF.cur, open = gradeOpen(i), over = btn(bx, y, tw0, th, () => grade(i), 'grade' + i);
      if (over) M.gHover = i;
      const bg = on ? K.zhu : open ? (over ? 'rgba(40,32,24,0.95)' : K.inkS) : 'rgba(14,13,12,0.9)';
      panel(bx, y, tw0, th, on ? K.zhuL : open ? (over ? K.gold : K.bronze) : '#2e2822', bg);
      const cx = bx + tw0 / 2, chars = Array.from(d.name);
      chars.forEach((ch, j) => text(ch, cx, y + 5 * s + j * (lh + s), on ? '#fbeedd' : open ? K.bone : K.faint, { align: 'c' }, k));
      if (!open) { const lx = Math.round(bx + tw0 - 7 * s), ly = Math.round(y + th - 9 * s); box(lx, ly + 2 * s, 5 * s, 4 * s, K.faint); box(lx + s, ly, 3 * s, s, K.faint); box(lx + s, ly, s, 2 * s, K.faint); box(lx + 3 * s, ly, s, 2 * s, K.faint); }
    });
    return { w: n * tw0 + (n - 1) * gap, h: th };
  }
  const pct = v => (v >= 1 ? '+' : '') + Math.round((v - 1) * 100) + '%';
  function gradeLines(i) {
    const d = DIFF.list[i];
    if (!gradeOpen(i)) return [{ t: '守住' + DIFF.list[i - 1].name + '全部十关后开放', col: K.dim }];
    const out = [];
    if (d.foe.n === 1 && d.foe.hp === 1 && d.foe.dmg === 1 && d.own.hp === 1 && d.own.dmg === 1) out.push({ t: '敌我皆如常，军备随守关渐开', col: K.dim });
    else {
      out.push({ t: '敌军  兵力 ' + pct(d.foe.n) + '  生命 ' + pct(d.foe.hp) + '  伤害 ' + pct(d.foe.dmg), col: '#d98b6e' });
      out.push({ t: '我军  生命 ' + pct(d.own.hp) + '  伤害 ' + pct(d.own.dmg), col: '#b9c79a' });
    }
    // what this grade brings onto the field, by the names the arsenal gives them
    const add = d.works.map(nameOf).filter(Boolean).map(q => q.name), foes = d.foes.map(nameOf).filter(Boolean).map(q => q.name);
    // one line each, so neither side's list breaks off mid-name at the column's edge
    if (add.length) out.push({ t: d.era + '：我增 ' + add.join('、'), col: K.gold });
    if (foes.length) out.push({ t: (add.length ? '' : d.era + '：') + '敌增 ' + foes.join('、'), col: K.gold });
    return out;
  }

  // ---- the general: who rides out, his three skills and the merit to raise them ----
  function generalCard(x, y, w, brief, maxH) {
    const S = HERO.save, key = S.pick, d = HEROES[key], pad = 7 * s, sc = s + 1, rowH = LH + 6 * s, nameH = PX.LINE * sc;
    const fsk = M.focusSkill >= 0 ? M.focusSkill : -1, descW = w - pad * 2;
    let h = pad * 2 + nameH + 4 * s + LH + 9 * s + 3 * rowH + 4 * s + LH + 8 * s;
    // the skill under the pointer (or last raised) explains itself under the rows: this level, then the next. Short of room,
    // whole paragraphs go from the end, never half a sentence.
    const explainI = M._skillHover >= 0 ? M._skillHover : fsk, para = [];
    if (explainI >= 0) { const q = d.skills[explainI], lv = S.lv[key][explainI]; para.push(wrap(lv ? HERO.fxText(q, lv) : '尚未习得。', descW).map(t => ({ t, col: '#d9cdb4' }))); if (lv < 3) para.push(wrap((lv ? '下一级：' : '一级：') + HERO.fxText(q, lv + 1), descW).map(t => ({ t, col: K.ok }))); }
    else if (!brief) para.push(wrap(d.bio, descW).map(t => ({ t, col: K.dim })));
    while (para.length && h + para.flat().length * (LH + s) > maxH) para.pop();
    const lines = para.flat(), rows = lines.length; h += rows * (LH + s);
    panel(x, y, w, h, K.bronzeD, K.inkS);
    // the two arrows that change who rides out
    const aw = 10 * s, ay = y + pad - 2 * s, ah = nameH + 4 * s;
    const lo = btn(x + pad - 2 * s, ay, aw, ah, () => general(-1), 'heroL'), ro = btn(x + w - pad - aw + 2 * s, ay, aw, ah, () => general(1), 'heroR');
    const arrow = (ax, dir, on) => { const cx = ax + aw / 2, cy = ay + ah / 2; for (let k = 0; k < 4; k++) box(cx + dir * (k - 1.5) * s - s / 2, cy - (3 - k) * s, s, (3 - k) * 2 * s + s, on ? K.gold : K.bronze); };
    arrow(x + pad - 2 * s, -1, lo); arrow(x + w - pad - aw + 2 * s, 1, ro);
    let yy = y + pad - s;
    text(d.name, x + w / 2, yy, K.gold, { align: 'c' }, sc); yy += nameH + 4 * s;
    text(d.era + ' · ' + d.title, x + w / 2, yy, K.dim, { align: 'c' });
    // four marks for the four generals, the one riding out filled
    yy += LH + 4 * s;
    HERO_KEYS.forEach((q, k) => box(x + w / 2 - 15 * s + k * 8 * s, yy, 6 * s, s, q === key ? K.gold : K.bronzeD));
    yy += 5 * s;
    const ptsT = '勋 ' + S.pts + ' 转'; text(ptsT, x + w - pad, y + h - pad - LH + s, S.pts ? K.gold : K.faint, { align: 'r' });
    M._skillHover = -1;
    d.skills.forEach((q, i) => {
      const lv = S.lv[key][i], max = lv >= 3, cost = HERO.costOf(lv), can = !max && S.pts >= cost, ry = yy + i * rowH;
      const label = max ? '已满' : '+ ' + cost + ' 转', bw = tw('+ 3 转') + 8 * s, bx = x + w - pad - bw;
      const rowHot = hot(x + pad, ry, w - pad * 2, rowH - 2 * s); if (rowHot) M._skillHover = i;
      text(q.name, x + pad, ry + 2 * s, lv ? K.bone : K.faint);
      for (let p = 0; p < 3; p++) box(x + pad + tw('取食于敌') + 6 * s + p * 6 * s, ry + 2 * s + LH / 2 - 2 * s, 4 * s, 4 * s, p < lv ? K.gold : '#3a3128');
      const o = btn(bx, ry, bw, rowH - 2 * s, () => raiseSkill(i), 'skill' + i);
      panel(bx, ry, bw, rowH - 2 * s, can ? (o ? K.gold : K.bronze) : '#2e2822', can && o ? 'rgba(40,32,24,0.95)' : 'rgba(12,12,12,0.9)');
      text(label, bx + bw / 2, ry + 2 * s, can ? K.bone : K.faint, { align: 'c' });
    });
    yy += 3 * rowH + 4 * s;
    lines.forEach(l => { text(l.t, x + pad, yy, l.col); yy += LH + s; });
    // give all merit back, to spend again
    const rt = '重新分配', rw = tw(rt) + 6 * s, ro2 = btn(x + pad - 3 * s, y + h - pad - LH, rw, LH + 2 * s, () => { if (HERO.refund()) sfx('uiClick', CAM.x, CAM.z, .7); }, 'refund');
    text(rt, x + pad, y + h - pad - LH + s, ro2 ? K.bone : K.faint);
    return h;
  }

  function goButton(x, y, w, h) {
    const o = btn(x, y, w, h, go, 'go'), ready = !M.swap;
    panel(x, y, w, h, o ? '#ffb27a' : K.zhuL, ready ? (o ? '#d4452e' : K.zhu) : '#5a2a20');
    text('出征', x + w / 2, y + Math.round((h - PX.LINE * (s + 1)) / 2), '#fff3e2', { align: 'c' }, s + 1);
  }

  function drawMenu() {
    shade();
    if (M.peek && !M.peek.hover) { M.peek.t -= R.frameDt; if (M.peek.t <= 0) M.peek = null; }
    if (M.peek && M.peek.hover) M.peek = null;
    const n = stageCount(), wide = W >= H * 1.15, m = (wide ? 14 : 8) * s, sc = s + 1;
    const btnH = PX.LINE * sc + 12 * s, btnW = Math.max(tw('出征', sc) + 40 * s, wide ? 0 : W - m * 2), tall = H >= 380 * s;
    // bottom band: the beacon line and its numerals. On a wide screen the sortie stands at the line's right end (the help line under it
    // when there is height to spare); on a narrow one it runs full width beneath.
    const room = wide ? W - m * 2 - btnW - 16 * s : W - m * 2, gapMax = 64 * s, span = Math.min(room - 24 * s, gapMax * (n - 1)), gap = span / (n - 1);
    const u = Math.max(s, Math.min(2 * s, Math.round(gap / 30))), L = { gap, x0: (wide ? m + room / 2 : W / 2) - span / 2, u };
    const help = '方向键选关与难度 · Q E 换将 · 1 2 3 加点 · 回车出征', helpRow = wide && tall && tw(help) < W - m * 2;
    const bottom = H - m - (helpRow ? LH + 6 * s : 0);
    L.y = Math.round(wide ? bottom - LH - 12 * s - 3 * u : bottom - btnH - 8 * s - LH - 14 * s);
    const line = drawLine(L);
    if (wide) { goButton(W - m - btnW, Math.round(L.y - 9 * u + 3 * u / 2 - btnH / 2), btnW, btnH); if (helpRow) text(help, m, H - m - LH, K.faint); }
    else goButton(m, bottom - btnH, W - m * 2, btnH);
    // top: the title at the left; the grades and the general at the right (wide) or below the title (narrow)
    const tk = wide ? s * 4 : s * 3, T = drawTitle(m, m, tk);
    let colX, colW, gy;
    if (wide) { colW = Math.min(Math.max(150 * s, W * .3), 190 * s, W - m * 3 - T.w); colX = W - m - colW; gy = m; }
    else { colX = m + T.w + 10 * s; colW = W - colX - m; gy = m; }
    M.gHover = -1; if (M.gpeek && (M.gpeek.t -= R.frameDt) <= 0) M.gpeek = null;
    const gt = grades(colX, gy, colW, wide && tall ? s + 1 : s), gi = M.gHover >= 0 ? M.gHover : M.gpeek ? M.gpeek.i : DIFF.cur;
    let yy = gy + gt.h + 6 * s;
    for (const l of gradeLines(gi)) for (const t of wrapAt(l.t, colW)) { text(t, colX, yy, l.col); yy += LH + s; }
    yy = Math.max(yy + 8 * s, wide ? 0 : m + T.h + 8 * s);
    const gx = wide ? colX : m, gw = wide ? colW : W - m * 2;
    // the stage card hangs over its beacon; on a wide screen it keeps clear of the right-hand column, on a narrow one the general card stops above it
    const i = M.peek ? M.peek.i : CAMPAIGN.sel, ax = M.peek ? line.peekX : line.xs[CAMPAIGN.sel];
    let cw = wide ? Math.min(150 * s, Math.max(135 * s, W * .28)) : W - m * 2, cx = wide ? clamp(ax - cw / 2, m, W - m - cw) : m;
    const cardBottom = line.top - 6 * s, card = { x: cx, w: cw, bottom: cardBottom }, ch = stageCard(i, ax, line.top, card, true);
    const gh = generalCard(gx, yy, gw, !wide, (wide ? line.top - 8 * s : cardBottom - ch - 6 * s) - yy), genBottom = yy + gh;
    if (wide && cx + cw > colX - 8 * s && cardBottom - ch < genBottom) card.x = Math.max(m, colX - 8 * s - cw);
    stageCard(i, ax, line.top, card);
  }

  // ---- the after-action card ----
  function drawCard() {
    const won = M.card.won, sc = s + 2, pad = 9 * s, w = Math.min(W - 16 * s, 190 * s), x = Math.round(W / 2 - w / 2);
    const e = won ? HERO.eval : null, lines = [];
    if (won && e) {
      lines.push({ t: '斩敌 ' + e.kills + '，抵城之敌 ' + e.leaks + '，拒敌于城外 ' + Math.floor(e.held * 100) + '%', col: K.bone });
      lines.push({ t: '城防余 ' + e.lives + '/' + G.maxLives + '，城门' + (e.breaks ? '被破 ' + e.breaks + ' 次' : '未破') + '，守军阵亡 ' + e.lost, col: K.dim });
      lines.push({ t: HERO_ZHEN[e.zhen] + HERO_HUO[e.huo] + (e.whole ? '，城防无损加一转' : ''), col: K.dim });
      lines.push({ t: HERO_RULE + '。', col: K.faint });
    } else if (!won) {
      lines.push({ t: '守至第 ' + Math.max(1, G.k) + ' 波（共 5 波），斩敌 ' + Math.max(0, G.slain - (HERO.stats ? HERO.stats.slain0 : 0)), col: K.bone });
      lines.push({ t: '关城失守不叙功。此关仍可再战，已得军备不会收回。', col: K.dim });
    }
    const news = [];
    if (won && CAMPAIGN.news) news.push({ t: '新军备 · ' + CAMPAIGN.news.name, sub: CAMPAIGN.news.sub });
    if (won && CAMPAIGN.grade) { const g = CAMPAIGN.grade, adds = g.works.concat(g.foes).map(nameOf).filter(Boolean).map(q => q.name); news.push({ t: '新难度 · ' + g.name + (g.era ? '（' + g.era + '）' : ''), sub: adds.length ? '带来 ' + adds.join('、') : '在主界面选择' }); }
    const wl = lines.flatMap(l => wrap(l.t, w - pad * 2).map(t => ({ t, col: l.col })));
    const wn = news.flatMap(q => [{ t: q.t, col: K.gold }].concat(wrap(q.sub, w - pad * 2).map(t => ({ t, col: K.dim }))));
    const bh = LH + 10 * s, h = pad * 2 + PX.LINE * sc + 6 * s + LH + 8 * s + wl.length * (LH + s) + (wn.length ? 8 * s + wn.length * (LH + s) : 0) + 10 * s + bh;
    const y = Math.round(clamp(H * .46 - h / 2, 8 * s, H - h - 8 * s));
    c.fillStyle = 'rgba(5,6,9,0.45)'; c.fillRect(0, 0, W, H);
    panel(x, y, w, h, won ? K.bronze : '#6a2a20', K.inkS);
    box(x + 2 * s, y + s, w - 4 * s, 2 * s, won ? K.gold : K.zhu);
    let yy = y + pad;
    text(won ? '关隘无恙' : '关城失守', x + pad, yy, won ? '#f3dcb0' : K.zhuL, null, sc);
    if (won && e) { const z = e.zhuan + ' 转', zw = tw(z, sc); text(z, x + w - pad, yy, K.gold, { align: 'r' }, sc); text(e.replay ? '酬勋（重守减半）' : '酬勋', x + w - pad - zw - 4 * s, yy + PX.LINE * sc - LH, K.dim, { align: 'r' }); }
    yy += PX.LINE * sc + 6 * s;
    text(stageLabel(G.level) + ' · ' + G.B.bio.name + ' · ' + diffNow().name + (HERO.u ? ' · ' + HERO.u.d.name : ''), x + pad, yy, K.dim); yy += LH + 8 * s;
    for (const l of wl) { text(l.t, x + pad, yy, l.col); yy += LH + s; }
    if (wn.length) { yy += 4 * s; box(x + pad, yy, w - pad * 2, s, '#3a3128'); yy += 4 * s; for (const l of wn) { text(l.t, x + pad, yy, l.col); yy += LH + s; } }
    const label = FLOW.key === 'campaign' ? '回主界面' : '转战下一关', bw = tw(label) + 30 * s, bx = Math.round(W / 2 - bw / 2), by = y + h - pad - bh + 2 * s;
    const o = btn(bx, by, bw, bh, dismiss, 'back');
    panel(bx, by, bw, bh, o ? '#ffb27a' : K.zhuL, o ? '#d4452e' : K.zhu);
    text(label, bx + bw / 2, by + Math.round((bh - LH) / 2) + s, '#fff3e2', { align: 'c' });
  }

  // ---- input: while the menu or the card is up, it takes every key and click before the battle's own handlers see them ----
  function hit(mx, my) { for (let i = M.rects.length - 1; i >= 0; i--) { const r = M.rects[i]; if (mx >= r.x && mx <= r.x + r.w && my >= r.y && my <= r.y + r.h) return r; } return null; }
  function onKey(k) {
    if (cardUp()) { if (k === 'Enter' || k === ' ' || k === 'Escape') dismiss(); return; }
    if (k === 'ArrowLeft') choose(CAMPAIGN.sel - 1);
    else if (k === 'ArrowRight') choose(CAMPAIGN.sel + 1);
    else if (k === 'ArrowUp') grade(DIFF.cur - 1);
    else if (k === 'ArrowDown') grade(DIFF.cur + 1);
    else if (k === 'Tab') nextGrade(1);
    else if (k === 'q' || k === 'Q') general(-1);
    else if (k === 'e' || k === 'E') general(1);
    else if (k === '1' || k === '2' || k === '3') raiseSkill(+k - 1);
    else if (k === 'Enter' || k === ' ') go();
    else if (k === 'm' || k === 'M') AU.setMuted(!AU.muted);
  }
  // the pad: the cross or the stick moves along the line (left, right) and between grades (up, down), the shoulders change the general, A rides out
  function pollPad() {
    const pads = navigator.getGamepads ? navigator.getGamepads() : []; let gp = null; for (const p of pads) if (p && p.connected) { gp = p; break; }
    const st = M.gp; if (!gp) return;
    const b = i => !!(gp.buttons[i] && gp.buttons[i].pressed), hitB = i => b(i) && !st.prev[i];
    const ax = (Math.abs(gp.axes[0]) > .5 ? Math.sign(gp.axes[0]) : 0) + (b(15) ? 1 : 0) - (b(14) ? 1 : 0), ay = (Math.abs(gp.axes[1]) > .5 ? Math.sign(gp.axes[1]) : 0) + (b(13) ? 1 : 0) - (b(12) ? 1 : 0);
    st.t -= R.frameDt;
    if (inMenu() || cardUp()) {
      if ((ax || ay) && st.t <= 0) { st.t = .22; onKey(ax > 0 ? 'ArrowRight' : ax < 0 ? 'ArrowLeft' : ay > 0 ? 'ArrowDown' : 'ArrowUp'); }
      if (!ax && !ay) st.t = 0;
      if (hitB(4)) onKey('q'); if (hitB(5)) onKey('e');
      if (hitB(0) || hitB(9)) { if (!AU.ready) AU.unlock(); onKey('Enter'); }
    }
    for (let i = 0; i < 16; i++) st.prev[i] = b(i);
  }
  function init() {
    const D = () => R.dpr || 1, ours = () => inMenu() || cardUp();
    window.addEventListener('keydown', e => {
      if (!ours() || CHEAT.owns(e.target)) return;
      // the battle's handlers never see a key here; one with a modifier still reaches the browser (reload, zoom)
      e.stopImmediatePropagation(); if (e.ctrlKey || e.metaKey || e.altKey) return; e.preventDefault(); if (e.repeat && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      if (!AU.ready) AU.unlock(); onKey(e.key);
    }, true);
    window.addEventListener('pointerdown', e => {
      if (!ours() || CHEAT.owns(e.target)) return;
      e.stopImmediatePropagation(); e.preventDefault(); if (!AU.ready) AU.unlock();
      if (e.button) return;
      const mx = e.clientX * D(), my = e.clientY * D(); UI.mx = mx; UI.my = my; UI.inside = true;
      const r = hit(mx, my); if (r) r.fn();
    }, { capture: true, passive: false });
    window.addEventListener('wheel', e => { if (inMenu()) { e.stopImmediatePropagation(); e.preventDefault(); } }, { capture: true, passive: false });
  }
  Object.assign(M, { init, enter, settle, holding, dismiss, draw, go, choose, grade, general, raiseSkill, onKey, ERA });
  return M;
})();
