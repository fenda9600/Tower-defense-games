// The main menu and the after-action card. Both are drawn on the HUD canvas in the pixel font, over the battlefield itself.
const MENU = (() => {
  const M = { sel: 0, card: null, swap: null, rects: [], gp: { prev: [], t: 0 } };
  const inMenu = () => G.phase === 'menu';
  const cardUp = () => !!(M.card && M.card.shown);

  // ---- the field behind the menu ----
  function raise(i) {
    clearField(); G.level = i; G.lives = G.maxLives;
    const B = G.B = buildBoard(G.boardSeed++, i); R.scene.add(B.group); activateBoard(B, true);
  }
  function enter(won) {
    const n = stageCount();
    if (won !== null) M.sel = won ? Math.min(G.level + 1, n - 1) : G.level;
    G.phase = 'menu'; G.phaseT = 0; G.paused = false; G.speed = 1; M.card = null; M.swap = null;
    UI.setManual(false); UI.closeMenu(); UI.lore = null; UI.msg = null;
    raise(M.sel);
  }
  function choose(i) {
    if (i === M.sel || i < 0 || i >= stageCount()) return;
    M.sel = i; M.swap = { t: 0, done: false };
    sfx('uiHover', CAM.x, CAM.z, .7);
  }
  function go() {
    if (!inMenu() || M.swap) return;
    UI.titleT = 7; UI.showLore(G.B.bio); beginBattle(true);
    UI.banner(stageLabel(G.level) + ' · ' + G.B.bio.name, 3.2, false);
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
  const COL = { ink: 'rgba(8,9,13,0.9)', bd: '#5d4c35', gold: '#e8b04a', tx: '#efe4cd', dim: '#a79e8a', faint: '#6f685b', red: '#c8402c' };
  function draw() {
    const c = UI.ctx; if (!c) return;
    const s = UI.s, W = R.dw, H = R.dh; M.rects.length = 0;
    pollPad();
    if (inMenu()) drawMenu(c, s, W, H);
    else if (M.card && (G.phase === 'clear' || G.phase === 'defeat') && G.phaseT > (M.card.won ? 1.3 : 2.2)) { if (!M.card.shown) { M.card.shown = true; M.card.t0 = performance.now(); } drawCard(c, s, W, H); }
    if (M.swap) {
      const S = M.swap; S.t += R.frameDt; const a = S.done ? sat(1 - (S.t - .09) / .13) : sat(S.t / .09);
      if (!S.done && S.t >= .09) { raise(M.sel); S.done = true; S.t = .09; }
      if (S.done && a <= 0) M.swap = null;
      c.fillStyle = 'rgba(4,5,8,' + a.toFixed(3) + ')'; c.fillRect(0, 0, W, H);
    }
  }
  function btn(x, y, w, h, fn, id) { M.rects.push({ x, y, w, h, fn, id }); return UI.inside && UI.mx >= x && UI.mx <= x + w && UI.my >= y && UI.my <= y + h; }
  function drawMenu(c, s, W, H) {
    const LH = PX.LINE * s, n = stageCount();
    PX.text(c, '烽燧', W / 2, H * .12, s * 3, '#ffd9a8', { align: 'c' });
    const gap = Math.min(70 * s, (W - 20 * s) / n), x0 = W / 2 - gap * (n - 1) / 2, y = H * .45;
    for (let i = 0; i < n; i++) {
      const x = x0 + gap * i, open = i <= CAMPAIGN.best, on = i === M.sel;
      c.fillStyle = on ? COL.gold : open ? COL.tx : COL.faint; c.fillRect(Math.round(x - 4 * s), Math.round(y - 4 * s), 8 * s, 8 * s);
      btn(x - gap / 2, y - 12 * s, gap, 24 * s, () => { if (open) choose(i); else sfx('uiDeny', CAM.x, CAM.z, .6); }, 'stage' + i);
    }
    PX.text(c, stageLabel(M.sel) + ' · ' + stageName(M.sel), W / 2, y + 14 * s, s, COL.tx, { align: 'c' });
    const bw = 60 * s, bh = LH + 8 * s, bx = Math.round(W / 2 - bw / 2), by = Math.round(H * .7);
    const hot = btn(bx, by, bw, bh, go, 'go');
    c.fillStyle = hot ? COL.gold : COL.red; c.fillRect(bx, by, bw, bh);
    PX.text(c, '出征', W / 2, by + 4 * s, s, '#fff', { align: 'c' });
  }
  function drawCard(c, s, W, H) {
    const LH = PX.LINE * s, w = 140 * s, h = 60 * s, x = Math.round(W / 2 - w / 2), y = Math.round(H / 2 - h / 2), won = M.card.won;
    c.fillStyle = COL.ink; c.fillRect(x, y, w, h);
    PX.text(c, won ? '关隘无恙' : '关城失守', W / 2, y + 8 * s, s * 2, won ? '#ffd9a8' : COL.red, { align: 'c' });
    const bw = 70 * s, bh = LH + 8 * s, bx = Math.round(W / 2 - bw / 2), by = y + h - bh - 6 * s, hot = btn(bx, by, bw, bh, dismiss, 'back');
    c.fillStyle = hot ? COL.gold : COL.bd; c.fillRect(bx, by, bw, bh);
    PX.text(c, FLOW.key === 'campaign' ? '回主界面' : '转战下一关', W / 2, by + 4 * s, s, COL.tx, { align: 'c' });
  }

  // ---- input: while the menu or the card is up, it takes every key and click before the battle's own handlers see them ----
  function hit(mx, my) { for (let i = M.rects.length - 1; i >= 0; i--) { const r = M.rects[i]; if (mx >= r.x && mx <= r.x + r.w && my >= r.y && my <= r.y + r.h) return r; } return null; }
  function onKey(e) {
    const k = e.key;
    if (cardUp()) { if (k === 'Enter' || k === ' ' || k === 'Escape') dismiss(); return; }
    if (k === 'ArrowLeft') { let i = M.sel - 1; if (i >= 0) choose(i); }
    else if (k === 'ArrowRight') { const i = M.sel + 1; if (i <= Math.min(CAMPAIGN.best, stageCount() - 1)) choose(i); else sfx('uiDeny', CAM.x, CAM.z, .5); }
    else if (k === 'Enter' || k === ' ') go();
    else if (k === 'm' || k === 'M') AU.setMuted(!AU.muted);
  }
  function pollPad() {
    const pads = navigator.getGamepads ? navigator.getGamepads() : []; let gp = null; for (const p of pads) if (p && p.connected) { gp = p; break; }
    const st = M.gp; if (!gp) return;
    const b = i => !!(gp.buttons[i] && gp.buttons[i].pressed), hitB = i => b(i) && !st.prev[i];
    const ax = (Math.abs(gp.axes[0]) > .5 ? Math.sign(gp.axes[0]) : 0) + (b(15) ? 1 : 0) - (b(14) ? 1 : 0);
    st.t -= R.frameDt;
    const fire = key => onKey({ key });
    if (inMenu() || cardUp()) {
      if (ax && st.t <= 0) { st.t = .22; fire(ax > 0 ? 'ArrowRight' : 'ArrowLeft'); }
      if (!ax) st.t = 0;
      if (hitB(0) || hitB(9)) { if (!AU.ready) AU.unlock(); fire('Enter'); }
    }
    for (let i = 0; i < 16; i++) st.prev[i] = b(i);
  }
  function init() {
    const D = () => R.dpr || 1, ours = () => inMenu() || cardUp();
    window.addEventListener('keydown', e => {
      if (!ours() || CHEAT.owns(e.target)) return;
      e.stopImmediatePropagation(); e.preventDefault(); if (e.repeat) return;
      if (!AU.ready) AU.unlock(); onKey(e);
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
  Object.assign(M, { init, enter, settle, holding, dismiss, draw, go, choose });
  return M;
})();
