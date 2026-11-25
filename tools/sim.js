// usage: node sim.js <index.html> <seeds csv> <maxLevels> [extraEval]
const { chromium } = require('playwright');
(async () => {
  const [file, seedsArg, maxLv, extra] = process.argv.slice(2);
  const seeds = seedsArg.split(',').map(Number), ML = +maxLv || 5;
  const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const run = async seed => {
    const page = await browser.newPage({ viewport: { width: 640, height: 400 } });
    page.on('pageerror', e => console.log('[pageerror]', String(e).slice(0, 400)));
    await page.goto('file://' + file + '#manual=1&seed=' + seed);
    await page.waitForFunction('window.__cw');
    if (extra) await page.evaluate(extra);
    const out = [];
    for (let guard = 0; guard < 400; guard++) {
      const r = await page.evaluate(ML => {
        const { G, step } = __cw; const S = window.__sim || (window.__sim = { log: [], t0: G.t, lastLevel: 0, minLives: G.maxLives, done: false, phase: G.phase, wd: 0 });
        for (let i = 0; i < 1500 && !S.done; i++) {
          step(1 / 30);
          if (G.phase === 'play') S.minLives = Math.min(S.minLives, G.lives);
          if (G.phase !== S.phase) {
            if (G.phase === 'clear') S.log.push({ lv: G.level, res: 'clear', lives: G.lives, min: S.minLives, leaks: G.leaks, press: +G.press.toFixed(2), t: Math.round(G.t - S.t0), gold: Math.round(G.gold), tw: G.towers.map(t => t.kind[0] + t.lvl).join(''), wall: (G.wall ? G.wall.n + '/' + G.wall.lvl + ' r' + G.wall.raised + 't' + G.wall.topped + 'd' + G.wall.lost + 'b' + G.wall.breaks : '') + (__cw.FOE ? ' F' + JSON.stringify([__cw.FOE.st.van, __cw.FOE.st.ruins, __cw.FOE.st.sneaks, __cw.FOE.st.calls, __cw.FOE.st.promos, __cw.RAID.ruined, __cw.FOE.st.bossAt, Math.round(G.B.L)]) : '') + (__cw.HERO && __cw.HERO.eval ? ' 勋' + __cw.HERO.eval.zhuan + '(' + Math.round(__cw.HERO.eval.held * 100) + '%,k' + __cw.HERO.kills + ')' : '') });
            if (G.phase === 'defeat') { S.log.push({ lv: G.level, res: 'DEFEAT', k: G.k, leaks: G.leaks, press: +G.press.toFixed(2), t: Math.round(G.t - S.t0), tw: G.towers.map(t => t.kind[0] + t.lvl).join(''), wall: G.wall ? G.wall.n + '/' + G.wall.lvl + ' r' + G.wall.raised + 't' + G.wall.topped + 'd' + G.wall.lost + 'b' + G.wall.breaks + ' ru' + __cw.RAID.ruined + '/' + __cw.RAID.rebuilt : '' }); S.done = true; }
            if (G.phase === 'play') { S.t0 = G.t; S.minLives = G.maxLives; if (G.level >= ML) S.done = true; }
            S.phase = G.phase;
          }
        }
        return S.done ? S.log : null;
      }, ML);
      if (r) { out.push(...r); break; }
    }
    await page.close();
    return { seed, out };
  };
  const res = await Promise.all(seeds.map(run));
  let reach = [];
  for (const r of res) {
    const d = r.out.find(e => e.res === 'DEFEAT');
    reach.push(d ? d.lv + (d.k - 1) / 5 : ML);
    console.log('seed', r.seed, r.out.map(e => e.res === 'clear' ? `L${e.lv}:♥${e.lives}(min${e.min}) lk${e.leaks} p${e.press} g${e.gold} ${e.tw} ${e.wall}` : `L${e.lv} DEFEAT@w${e.k} lk${e.leaks} p${e.press} ${e.wall}`).join(' | '));
  }
  console.log('mean reach', (reach.reduce((a, b) => a + b, 0) / reach.length).toFixed(2), 'defeats', reach.filter(x => x < ML).length + '/' + reach.length, JSON.stringify(reach));
  await browser.close();
})();
