// The hidden resource editor: double-tap the resource bar at the top left to open it, Esc or a second double-tap closes it.
const CHEAT = (() => {
  const C = { open: false, el: null, f: {} };
  const FIELDS = [
    ['gold', '金币', () => Math.floor(G.gold), v => { G.gold = Math.max(0, v); UI.goldShown = G.gold; UI.goldBump = 1; }],
    ['lives', '城防', () => G.lives, v => { G.lives = Math.max(1, v); if (G.lives > G.maxLives) G.maxLives = G.lives; }],
    ['slain', '斩敌', () => G.slain, v => { G.slain = Math.max(0, v); }],
  ];
  const CSS = `
#cheat{position:fixed;z-index:10;min-width:210px;padding:10px 12px 12px;background:rgba(9,11,17,.94);border:2px solid #e8b04a;color:#efe4cd;font:14px/1.4 "PingFang SC","Microsoft YaHei","Noto Sans CJK SC",sans-serif;box-shadow:0 4px 18px rgba(0,0,0,.6);user-select:auto;-webkit-user-select:auto;touch-action:auto}
#cheat .hd{display:flex;justify-content:space-between;align-items:center;color:#e8b04a;margin-bottom:8px}
#cheat .row{display:flex;align-items:center;gap:8px;margin:5px 0}
#cheat .row label{width:34px;color:#a79e8a}
#cheat .row .cap{color:#a79e8a;font-size:12px;white-space:nowrap}
#cheat input{width:90px;padding:3px 6px;background:#181b26;border:1px solid #5d4c35;color:#efe4cd;font:inherit}
#cheat input:focus{outline:none;border-color:#e8b04a}
#cheat button{padding:3px 8px;background:#181b26;border:1px solid #5d4c35;color:#efe4cd;font:inherit;font-size:12px;cursor:pointer}
#cheat button:hover{border-color:#e8b04a}
#cheat .x{border:none;background:none;font-size:16px;padding:0 2px;color:#a79e8a}
#cheat .btns{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}
#cheat .ok{border-color:#e8b04a;color:#e8b04a}
#cheat .tip{margin-top:8px;color:#6f685b;font-size:12px}`;
  function build() {
    const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    const el = C.el = document.createElement('div'); el.id = 'cheat'; el.style.display = 'none';
    el.innerHTML = '<div class="hd"><span>资源修改器</span><button class="x" data-a="close" title="关闭">✕</button></div>' +
      FIELDS.map(([k, n]) => `<div class="row"><label>${n}</label><input data-k="${k}" type="number" min="0" step="1" inputmode="numeric"><span class="cap" data-cap="${k}"></span></div>`).join('') +
      '<div class="btns"><button data-a="g1k">金币 +1000</button><button data-a="g10k">金币 +10000</button><button data-a="full">城防回满</button><button class="ok" data-a="apply">应用</button></div>' +
      '<div class="tip">回车应用 · Esc 或再次双击资源栏关闭</div>';
    document.body.appendChild(el);
    for (const [k] of FIELDS) { const i = el.querySelector(`input[data-k="${k}"]`); C.f[k] = i; i.addEventListener('input', () => { i.dirty = true; }); }
    el.addEventListener('keydown', e => { if (e.key === 'Enter') { apply(); e.preventDefault(); } else if (e.key === 'Escape') hide(); e.stopPropagation(); });
    el.addEventListener('click', e => {
      const a = e.target.dataset && e.target.dataset.a; if (!a) return;
      if (a === 'close') hide();
      else if (a === 'apply') apply();
      else if (a === 'g1k' || a === 'g10k') { set('gold', G.gold + (a === 'g1k' ? 1000 : 10000)); }
      else if (a === 'full') { set('lives', G.maxLives); }
      sync(true);
    });
  }
  const field = k => FIELDS.find(f => f[0] === k);
  function set(k, v) { if (isFinite(v)) field(k)[3](Math.round(v)); }
  function apply() {
    for (const [k] of FIELDS) { const i = C.f[k]; if (i.dirty && i.value !== '') set(k, +i.value); i.dirty = false; }
    sfx('uiClick', CAM.x, CAM.z, .8); sync(true);
  }
  function place() {
    const r = UI.statsRect, d = R.dpr || 1; if (!r) return;
    C.el.style.left = Math.round(r.x / d) + 'px'; C.el.style.top = Math.round((r.y + r.h) / d + 6) + 'px';
  }
  function sync(force) {
    if (!C.open) return; place();
    for (const [k, , get] of FIELDS) { const i = C.f[k]; if (force || (!i.dirty && document.activeElement !== i)) { i.value = get(); i.dirty = false; } }
    C.el.querySelector('[data-cap="lives"]').textContent = '上限 ' + G.maxLives;
  }
  function show() { if (!C.el) build(); C.open = true; C.el.style.display = ''; sync(true); sfx('uiHover', CAM.x, CAM.z, .8); }
  function hide() { if (!C.open) return; C.open = false; C.el.style.display = 'none'; if (C.el.contains(document.activeElement)) document.activeElement.blur(); }
  C.show = show; C.hide = hide; C.toggle = () => (C.open ? hide() : show()); C.sync = () => sync(false);
  C.owns = t => !!(C.el && t && C.el.contains(t));
  return C;
})();
