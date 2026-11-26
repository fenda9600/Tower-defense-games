const PX = (() => {
  const LINE = 9, CAP = 7, GAP = 1, CACHE_MAX = 500;

  const SRC = {
    '!': '#/#/#/#/#/./#',
    '"': '#.#/#.#',
    '#': '.#.#./.#.#./#####/.#.#./#####/.#.#./.#.#.',
    '$': '..#../.####/#.#../.###./..#.#/####./..#..',
    '%': '##.../##..#/...#./..#../.#.../#..##/...##',
    '&': '.##../#..#./#.#../.#.../#.#.#/#..#./.##.#',
    "'": '#/#',
    '(': '.#/#./#./#./#./#./.#',
    ')': '#./.#/.#/.#/.#/.#/#.',
    '*': '1:#.#/.#./#.#',
    '+': '2:.#./###/.#.',
    ',': '5:.#/.#/#.',
    '-': '3:###',
    '.': '6:#',
    '/': '..#/..#/.#./.#./.#./#../#..',
    '0': '.###./#...#/#..##/#.#.#/##..#/#...#/.###.',
    '1': '..#../.##../..#../..#../..#../..#../.###.',
    '2': '.###./#...#/....#/...#./..#../.#.../#####',
    '3': '.###./#...#/....#/..##./....#/#...#/.###.',
    '4': '...#./..##./.#.#./#..#./#####/...#./...#.',
    '5': '#####/#..../####./....#/....#/#...#/.###.',
    '6': '..##./.#.../#..../####./#...#/#...#/.###.',
    '7': '#####/....#/...#./..#../..#../..#../..#..',
    '8': '.###./#...#/#...#/.###./#...#/#...#/.###.',
    '9': '.###./#...#/#...#/.####/....#/...#./.##..',
    ':': '2:#/././#',
    ';': '2:.#/../../.#/.#/#.',
    '<': '1:..#/.#./#../.#./..#',
    '=': '2:###/.../###',
    '>': '1:#../.#./..#/.#./#..',
    '?': '.###./#...#/....#/...#./..#../...../..#..',
    '@': '.###./#...#/#.###/#.#.#/#.###/#..../.###.',
    'A': '.###./#...#/#...#/#####/#...#/#...#/#...#',
    'B': '####./#...#/#...#/####./#...#/#...#/####.',
    'C': '.###./#...#/#..../#..../#..../#...#/.###.',
    'D': '####./#...#/#...#/#...#/#...#/#...#/####.',
    'E': '#####/#..../#..../####./#..../#..../#####',
    'F': '#####/#..../#..../####./#..../#..../#....',
    'G': '.###./#...#/#..../#.###/#...#/#...#/.###.',
    'H': '#...#/#...#/#...#/#####/#...#/#...#/#...#',
    'I': '###/.#./.#./.#./.#./.#./###',
    'J': '...#/...#/...#/...#/...#/#..#/.##.',
    'K': '#...#/#..#./#.#../##.../#.#../#..#./#...#',
    'L': '#.../#.../#.../#.../#.../#.../####',
    'M': '#...#/##.##/#.#.#/#.#.#/#...#/#...#/#...#',
    'N': '#...#/#...#/##..#/#.#.#/#..##/#...#/#...#',
    'O': '.###./#...#/#...#/#...#/#...#/#...#/.###.',
    'P': '####./#...#/#...#/####./#..../#..../#....',
    'Q': '.###./#...#/#...#/#...#/#.#.#/#..#./.##.#',
    'R': '####./#...#/#...#/####./#.#../#..#./#...#',
    'S': '.###./#...#/#..../.###./....#/#...#/.###.',
    'T': '#####/..#../..#../..#../..#../..#../..#..',
    'U': '#...#/#...#/#...#/#...#/#...#/#...#/.###.',
    'V': '#...#/#...#/#...#/#...#/#...#/.#.#./..#..',
    'W': '#...#/#...#/#...#/#.#.#/#.#.#/#.#.#/.#.#.',
    'X': '#...#/#...#/.#.#./..#../.#.#./#...#/#...#',
    'Y': '#...#/#...#/.#.#./..#../..#../..#../..#..',
    'Z': '#####/....#/...#./..#../.#.../#..../#####',
    '[': '##/#./#./#./#./#./##',
    '\\': '#../#../.#./.#./.#./..#/..#',
    ']': '##/.#/.#/.#/.#/.#/##',
    '^': '.#./#.#',
    '_': '7:####',
    '`': '#./.#',
    'a': '2:.###./....#/.####/#...#/.####',
    'b': '#..../#..../####./#...#/#...#/#...#/####.',
    'c': '2:.###/#.../#.../#.../.###',
    'd': '....#/....#/.####/#...#/#...#/#...#/.####',
    'e': '2:.###./#...#/#####/#..../.###.',
    'f': '..##/.#../####/.#../.#../.#../.#..',
    'g': '2:.####/#...#/#...#/#...#/.####/....#/.###.',
    'h': '#..../#..../####./#...#/#...#/#...#/#...#',
    'i': '#/./#/#/#/#/#',
    'j': '..#/.../..#/..#/..#/..#/..#/..#/##.',
    'k': '#.../#.../#..#/#.#./##../#.#./#..#',
    'l': '#./#./#./#./#./#./.#',
    'm': '2:####./#.#.#/#.#.#/#.#.#/#.#.#',
    'n': '2:####./#...#/#...#/#...#/#...#',
    'o': '2:.###./#...#/#...#/#...#/.###.',
    'p': '2:####./#...#/#...#/#...#/####./#..../#....',
    'q': '2:.####/#...#/#...#/#...#/.####/....#/....#',
    'r': '2:#.##/##../#.../#.../#...',
    's': '2:.####/#..../.###./....#/####.',
    't': '1:.#../####/.#../.#../.#../..##',
    'u': '2:#...#/#...#/#...#/#...#/.####',
    'v': '2:#...#/#...#/#...#/.#.#./..#..',
    'w': '2:#...#/#...#/#.#.#/#.#.#/.#.#.',
    'x': '2:#...#/.#.#./..#../.#.#./#...#',
    'y': '2:#...#/#...#/#...#/#...#/.####/....#/.###.',
    'z': '2:#####/...#./..#../.#.../#####',
    '{': '..#/.#./.#./#../.#./.#./..#',
    '|': '#/#/#/#/#/#/#',
    '}': '#../.#./.#./..#/.#./.#./#..',
    '~': '2:.#.../#.#.#/...#.',
    '·': '3:#',
    '×': '3:#.#/.#./#.#',
    '←': '1:..#../.#.../#####/.#.../..#..',
    '→': '1:..#../...#./#####/...#./..#..',
    '↑': '..#../.###./#.#.#/..#../..#../..#../..#..',
    '↓': '..#../..#../..#../..#../#.#.#/.###./..#..',
    '–': '3:####',
    '…': '6:#.#.#',
  };
  const UNKNOWN_SRC = '1:####/#..#/#..#/#..#/#..#/####';

  function parse(def) {
    let off = 0, s = def;
    if (s.length > 1 && s[1] === ':' && s[0] >= '0' && s[0] <= '9') { off = +s[0]; s = s.slice(2); }
    const rows = s.split('/');
    let w = 0;
    for (const r of rows) if (r.length > w) w = r.length;
    const bits = new Uint8Array(LINE);
    for (let i = 0; i < rows.length && off + i < LINE; i++) {
      const r = rows[i]; let b = 0;
      for (let x = 0; x < r.length; x++) if (r[x] === '#') b |= 1 << x;
      bits[off + i] = b;
    }
    return { w, bits };
  }

  const glyphs = new Map();
  glyphs.set(' ', { w: 3, bits: new Uint8Array(LINE) });
  for (const ch in SRC) glyphs.set(ch, parse(SRC[ch]));
  const UNKNOWN = parse(UNKNOWN_SRC);

  // Chinese glyphs come as 12 px and 16 px bitmaps. Each UI scale picks the size and whole-number zoom that best fill the 9 row line of the Latin font.
  const wide = new Map(), wideSizes = [];
  let lastS = 3;
  function wideMode(s) {
    let best = null;
    for (const size of wideSizes) { const k = Math.max(1, Math.floor(LINE * s / size)), h = size * k; if (!best || h >= best[0] * best[1] * (size > best[0] ? .85 : 1.18)) best = [size, k]; }
    return best;
  }
  function addWide(chars, ...sets) {
    const list = Array.from(chars);
    for (let q = 0; q < sets.length; q += 2) {
      const size = sets[q], hex = sets[q + 1], dg = Math.ceil(size / 4); wideSizes.push(size);
      list.forEach((ch, i) => { const rows = new Uint16Array(size); for (let r = 0; r < size; r++) rows[r] = parseInt(hex.substr((i * size + r) * dg, dg), 16); let e = wide.get(ch); if (!e) wide.set(ch, e = {}); e[size] = rows; });
    }
  }
  function hasWide(str) { for (const ch of str) if (wide.has(ch)) return true; return false; }
  function mixedWidth(str, s) {
    const [size, cs] = wideMode(s); let px = 0, last = 0;
    for (const ch of str) { if (wide.has(ch)) { last = cs; px += size * cs + last; } else { last = GAP * s; px += (glyphs.get(ch) || UNKNOWN).w * s + last; } }
    return px - last;
  }

  function measure(str, s) {
    str = String(str);
    if (hasWide(str)) { const k = Math.max(1, Math.round(s || lastS)); return mixedWidth(str, k) / k; }
    let w = 0, n = 0;
    for (const ch of str) { w += (glyphs.get(ch) || UNKNOWN).w + GAP; n++; }
    return n ? w - GAP : 0;
  }

  const cache = new Map();
  const DIRS = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]];

  function remember(key, entry) {
    cache.set(key, entry);
    if (cache.size > CACHE_MAX) cache.delete(cache.keys().next().value);
    return entry;
  }

  function run(str, color, shadow, outline) {
    const key = 't\u0001' + str + '\u0001' + color + '\u0001' + shadow + '\u0001' + outline;
    const hit = cache.get(key);
    if (hit) { cache.delete(key); cache.set(key, hit); return hit; }
    const gl = [];
    let w = 0;
    for (const ch of str) { const g = glyphs.get(ch) || UNKNOWN; gl.push(g); w += g.w + GAP; }
    if (gl.length) w -= GAP;
    const o = outline ? 1 : 0, sh = shadow ? 1 : 0;
    const cv = document.createElement('canvas');
    cv.width = Math.max(1, w + 2 * o + sh);
    cv.height = LINE + 2 * o + sh;
    const c = cv.getContext('2d');
    const paint = (dx, dy) => {
      let x = o + dx;
      for (const g of gl) {
        for (let r = 0; r < LINE; r++) {
          let b = g.bits[r], cx = 0;
          while (b) { if (b & 1) c.fillRect(x + cx, o + r + dy, 1, 1); b >>= 1; cx++; }
        }
        x += g.w + GAP;
      }
    };
    if (shadow) {
      c.fillStyle = shadow;
      paint(1, 1);
      if (outline) for (const d of DIRS) paint(d[0] + 1, d[1] + 1);
    }
    if (outline) { c.fillStyle = outline; for (const d of DIRS) paint(d[0], d[1]); }
    c.fillStyle = color;
    paint(0, 0);
    return remember(key, { cv, w, o });
  }

  function runMixed(str, color, shadow, outline, s) {
    const key = 'm\u0001' + s + '\u0001' + str + '\u0001' + color + '\u0001' + shadow + '\u0001' + outline;
    const hit = cache.get(key);
    if (hit) { cache.delete(key); cache.set(key, hit); return hit; }
    const [WIDE, cs] = wideMode(s), wpx = mixedWidth(str, s), o = outline ? 1 : 0, sh = shadow ? 1 : 0, wy = Math.floor((LINE * s - WIDE * cs) / 2);
    const cv = document.createElement('canvas');
    cv.width = Math.max(1, wpx + (2 * o + sh) * s);
    cv.height = (LINE + 2 * o + sh) * s;
    const c = cv.getContext('2d');
    const paint = (dx, dy) => {
      let x = o * s;
      for (const ch of str) {
        const wg = wide.get(ch);
        if (wg) {
          const rows = wg[WIDE]; for (let r = 0; r < WIDE; r++) { let b = rows[r], cx = WIDE - 1; while (b) { if (b & 1) c.fillRect(x + (cx + dx) * cs, o * s + wy + (r + dy) * cs, cs, cs); b >>= 1; cx--; } }
          x += (WIDE + 1) * cs;
        } else {
          const g = glyphs.get(ch) || UNKNOWN;
          for (let r = 0; r < LINE; r++) { let b = g.bits[r], cx = 0; while (b) { if (b & 1) c.fillRect(x + (cx + dx) * s, (o + r + dy) * s, s, s); b >>= 1; cx++; } }
          x += (g.w + GAP) * s;
        }
      }
    };
    if (shadow) { c.fillStyle = shadow; paint(1, 1); if (outline) for (const d of DIRS) paint(d[0] + 1, d[1] + 1); }
    if (outline) { c.fillStyle = outline; for (const d of DIRS) paint(d[0], d[1]); }
    c.fillStyle = color;
    paint(0, 0);
    return remember(key, { cv, w: wpx / s, o, native: true });
  }

  const NOOPT = {};

  function text(ctx, str, x, y, s, color, opts) {
    str = String(str);
    if (!str.length) return 0;
    s = Math.max(1, Math.round(s || 1));
    const op = opts || NOOPT;
    lastS = s;
    const e = hasWide(str) ? runMixed(str, color || '#ffffff', op.shadow || '', op.outline || '', s) : run(str, color || '#ffffff', op.shadow || '', op.outline || '');
    const wpx = e.w * s;
    let dx = x;
    if (op.align === 'c') dx = x - wpx / 2; else if (op.align === 'r') dx = x - wpx;
    dx = Math.round(dx); const dy = Math.round(y);
    const a = op.alpha === undefined ? 1 : op.alpha;
    if (a <= 0) return wpx;
    if (ctx.imageSmoothingEnabled) ctx.imageSmoothingEnabled = false;
    const ga = ctx.globalAlpha;
    if (a < 1) ctx.globalAlpha = ga * a;
    if (e.native) ctx.drawImage(e.cv, dx - e.o * s, dy - e.o * s); else ctx.drawImage(e.cv, dx - e.o * s, dy - e.o * s, e.cv.width * s, e.cv.height * s);
    if (a < 1) ctx.globalAlpha = ga;
    return wpx;
  }

  const PAL = {
    G: '#e8b04a', g: '#a8742a', Y: '#ffe2a0',
    B: '#e9dfc8', b: '#b9ad93',
    E: '#ff8a3c', e: '#c9481e', d: '#7a2a14',
    C: '#8fc7ff', c: '#4f86c6',
    S: '#9aa3b0', s: '#5b6472', k: '#353b49',
    W: '#8a6a48', w: '#5a4330',
    o: '#0b0d14',
  };

  const ICONS = {
    coin: [
      '..oooo..',
      '.oYYGGo.',
      'oYGGGGgo',
      'oYGgGGgo',
      'oGGgGGgo',
      'oGGGGggo',
      '.oGgggo.',
      '..oooo..',
    ],
    flame: [
      '....o...',
      '...oEo..',
      '...oEEo.',
      '..oEEEo.',
      '.oEEYEEo',
      'oEEYYEEo',
      'oEYYYYEo',
      'oeEYYEeo',
      '.oeEEeo.',
      '..oooo..',
    ],
    skull: [
      '..ooooo..',
      '.oBBBBBo.',
      'oBBBBBBBo',
      'oBooBooBo',
      'oBooBooBo',
      'oBBBoBBbo',
      '.oBBBBbo.',
      '.oBoBobo.',
      '..ooooo..',
    ],
    banner: [
      'S.......',
      'Wddddddd',
      'WeEEEEEe',
      'WeEEYEEe',
      'WeEYEYEe',
      'WeEEYEEe',
      'WeEEEEEe',
      'WeEe.eEe',
      'Wed...de',
      'W.......',
    ],
    hourglass: [
      'WWWWWWW',
      '.S...S.',
      '.SGGGS.',
      '..SGS..',
      '...S...',
      '..SGS..',
      '.S.G.S.',
      '.SGGGS.',
      'WWWWWWW',
    ],
    sound: [
      '...B......',
      '..BB...G..',
      'BBBB....G.',
      'BBBB.G..G.',
      'BBBB.G..G.',
      'BBBB....G.',
      '..bb...G..',
      '...b......',
    ],
    mute: [
      '...B......',
      '..BB......',
      'BBBB.e..e.',
      'BBBB..ee..',
      'BBBB..ee..',
      'BBBB.e..e.',
      '..bb......',
      '...b......',
    ],
    archer: [
      '...WW........',
      '...bWWW......',
      '...b..WW.....',
      '...b...WW....',
      '...b....W.E..',
      '...b....WEYE.',
      'bBSSSSSSSSYYE',
      '...b....WEYE.',
      '...b....W.E..',
      '...b...WW....',
      '...b..WW.....',
      '...bWWW......',
      '...WW........',
    ],
    bombard: [
      '.............',
      '...........S.',
      '.........Sso.',
      '.......SSSso.',
      '.E...SSSSsks.',
      '.e.SSSSsssk..',
      '.SSSSssss....',
      'sSSssssww....',
      'sssssooowww..',
      '.sswoWWWowww.',
      '...woWSWowww.',
      '....oWWWo....',
      '.....ooo.....',
    ],
    spire: [
      '.............',
      '..WW.....WW..',
      '...WW...WW...',
      '....WWYWW....',
      '.....wSw.....',
      '..b..wSw..b..',
      '...b.wSw.b...',
      '....bwSwb....',
      '.....wSw.....',
      '.....wkw.....',
      '....kkkkk....',
      '...kk.k.kk...',
      '..kk..k..kk..',
    ],
    gunner: [
      '.........Y.E.',
      '..........EYE',
      '........SoYE.',
      '.......SskE..',
      '......Ssk....',
      '.....Ssk.....',
      '....Ssk......',
      '...WSk.......',
      '..WWwG.......',
      '.WWw.Gg......',
      'WWw..........',
      'ww...........',
      '.............',
    ],
    cannon: [
      '.............',
      '..........ss.',
      '........sSSs.',
      '......sSSSSso',
      '....sSSSSSsk.',
      '..sSSSSSssk..',
      '.oSSSssskk...',
      'oSsssWWW.....',
      '.okkWwwwW....',
      '...WwGoGwW...',
      '...WwoGowW...',
      '....WwwwW....',
      '.....WWW.....',
    ],
    guard: [
      '..........oB.',
      '.sssssss.oBBo',
      '.sCCCCCCoBBo.',
      '.sCCCCCoBBo..',
      '.sCCccoBBo.s.',
      '.sCCcoBBocCs.',
      '.sCo.BBocCCs.',
      '.sGGoBocCCCs.',
      '..GGGocCCCs..',
      '.oGoGGoCCCs..',
      'oGo.sGocCs...',
      '.o...sscs....',
      '......ss.....',
    ],
    upgrade: [
      '....Y....',
      '...YGG...',
      '..YG.GG..',
      '.YG...GG.',
      '....G....',
      '...GGg...',
      '..GG.gg..',
      '.GG...gg.',
      '.........',
    ],
    sell: [
      '..ooooo..',
      '.oYYGGGo.',
      '.oYGgGGo.',
      '.oGGgGgo.',
      '.oGGGggo.',
      '..ooooo..',
      '..EEEEE..',
      '...EeE...',
      '....e....',
    ],
    helm: [
      '....E....',
      '..SSSSS..',
      '.SBSSSSs.',
      '.SSSSSSs.',
      '.SooSoos.',
      '.SS.S.ss.',
      '.SS.S.ss.',
      '..S...s..',
    ],
    hand: [
      '...oo....',
      '..oBBo...',
      '..oBBo...',
      '..oBBooo.',
      '..oBBbBbo',
      'ooBBBbBbo',
      'oBBBBBBBo',
      '.oBBBBbo.',
      '..ooooo..',
    ],
    star: [
      '..Y..',
      'YGGGG',
      '.GGG.',
      'GG.Gg',
      'G...g',
    ],
    starEmpty: [
      '..s..',
      'sssss',
      '.sss.',
      'ss.ss',
      's...s',
    ],
  };

  const iconMeta = {};
  for (const name in ICONS) {
    const rows = ICONS[name];
    let w = 0;
    for (const r of rows) if (r.length > w) w = r.length;
    iconMeta[name] = [w, rows.length];
  }

  function iconCanvas(name) {
    const key = 'i\u0001' + name;
    const hit = cache.get(key);
    if (hit) { cache.delete(key); cache.set(key, hit); return hit; }
    const rows = ICONS[name], m = iconMeta[name];
    const cv = document.createElement('canvas');
    cv.width = m[0]; cv.height = m[1];
    const c = cv.getContext('2d');
    for (let y = 0; y < rows.length; y++) {
      const r = rows[y];
      for (let x = 0; x < r.length; x++) {
        const col = PAL[r[x]];
        if (col) { c.fillStyle = col; c.fillRect(x, y, 1, 1); }
      }
    }
    return remember(key, { cv });
  }

  function icon(ctx, name, x, y, s, alpha) {
    if (!ICONS[name]) return;
    const a = alpha === undefined ? 1 : alpha;
    if (a <= 0) return;
    s = Math.max(1, Math.round(s || 1));
    const e = iconCanvas(name);
    if (ctx.imageSmoothingEnabled) ctx.imageSmoothingEnabled = false;
    const ga = ctx.globalAlpha;
    if (a < 1) ctx.globalAlpha = ga * a;
    ctx.drawImage(e.cv, Math.round(x), Math.round(y), e.cv.width * s, e.cv.height * s);
    if (a < 1) ctx.globalAlpha = ga;
  }

  function iconSize(name) {
    const m = iconMeta[name];
    return m ? [m[0], m[1]] : [0, 0];
  }

  return { LINE, CAP, measure, text, icon, iconSize, addWide, icons: Object.keys(ICONS), palette: PAL };
})();
