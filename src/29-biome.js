
const COL0 = Object.assign({}, COL);
const BIOMES = [
  // ---- Six battlefields, each a terrain that reads at a glance: the shape of the ground is the story of the battle ----
  {
    // 钓鱼城 (1259): a walled city on a cliff-girt mountain where the Jialing and Qu rivers meet; the river wraps the board's two near sides.
    key: 'diaoyu', name: '钓鱼城', en: 'Diaoyu Fortress',
    col: { stone: 0x7a6a5c, stoneD: 0x4a3f38, stoneL: 0xa49282, earth: 0x403a2a, earthD: 0x2a261c, grass: 0x3a5230, grassD: 0x2a3c24, moss: 0x48602e, road: 0x7c7468, roadD: 0x575048, mud: 0x2a2820, bark: 0x30261c, tuftA: 0x4a6a32, tuftB: 0x7c8a48, leaf: 0x264a2c, leafL: 0x3e6a3a },
    strata: [0x8a6a54, 0x5a4438, 0x9c7c62, 0x6e5444, 0xb08c6c, 0x4c3a30, 0x8e7058, 0x5e4a3c],
    hemi: [0x6a8cbc, 0x1c2420, 1.12], moon: [0xb4c8f0, 1.5], fill: [0x406a8c, .32], moonPos: [16, 42, -30],
    clear: [.004, .007, .012], mistAmb: [.06, .1, .14], mist: [-1.6, .9, 1.1, .14], sky: [.016, .028, .05], lift: [.010, .018, .030], sat: .93, expo: 1, sprAmb: [.05, .07, .1],
    cover: [.55, .78, 1.0, .35], coverCol: [.05, .085, .04], coverP: [.92, .3, .4, 0],
    wat: [0, .7, 1.2, 0], watA: [.008, .02, .024], watB: [.2, .3, .3], fall: [0, 1, 1, 0], fallA: [.02, .04, .05], fallB: [.24, .34, .38], spray: 'water', watEdge: 0x0a1416,
    relief: [1.5, .45, 1.2, 0], puddles: 6, ponds: 0, sway: .9, wind: 1.1,
    terrain: {
      sea: -2.1, bank: .8, step: 1.3, rock: 1, flow: .3, freeStream: true,
      lift: (x, z) => 1.5 * smooth(17, 11, Math.max(x, z)),
      sculpt: (x, z, dr, ds, K) => { const e = Math.max(x, z) + (fbm(x * .16 + 3, z * .16, K.sd + 80, 2) - .5) * 3.2; return -6.2 * smooth(11.8, 15.2, e); },
    },
    wx: { n: [.08, .05], velA: [.3, -.1, .15], swayA: [.5, .5], sizeA: [.03, .05], colA: [.75, .85, .9, 1], alA: [.45, 0, 0], yA: [-2, 9], velB: [.1, .05, .05], swayB: [1.2, .4], sizeB: [.03, .05], colB: [1.2, 1.5, .5, 0], alB: [.8, 1.2, 0], yB: [0, 3], amb: [.12, .16, .2] },
    mobs: { ghoul: 1.5, knight: 1.6, drummer: 1.4, wraith: 1.2 }, early: { knight: 3, drummer: 5 }, boss: ['giant', 'ogre'], tints: { wisp: [.7, 1.2, 1.1] }, wispHex: 0x90e0c0,
    trees: [['song', 9, 3.0, 4.8], ['tree', 4, 2.6, 4.2], ['bamboo', 5, 2.6, 3.8]], stumps: 3, rocks: 40, tufts: 260, webs: 0,
  },
  {
    // 赤壁 (208): a broad river at night, chained warships burning on it, red cliffs on the far bank.
    key: 'chibi', name: '赤壁', en: 'Red Cliffs',
    col: { stone: 0x5a3a32, stoneD: 0x341f1c, stoneL: 0x7e5244, earth: 0x2e2626, earthD: 0x1c1717, grass: 0x34302a, grassD: 0x24201c, moss: 0x3a3428, road: 0x5e5450, roadD: 0x3c3432, mud: 0x1a1514, bark: 0x15110f, tuftA: 0x4a3c28, tuftB: 0x7a5a34, leaf: 0x243424, leafL: 0x3a4a2c },
    strata: [0x7a2e22, 0x3a1a16, 0x9a3c26, 0x2a1a18, 0xb04a2a, 0x4a2218, 0x8a3424, 0x301816],
    hemi: [0x5c5470, 0x2c140e, 1.12], moon: [0xc0b0d0, 1.25], fill: [0xff5a20, .38], moonPos: [18, 40, -32],
    clear: [.009, .004, .005], mistAmb: [.1, .05, .04], mist: [-1.0, .6, 1.0, .12], sky: [.024, .008, .004], lift: [.022, .011, .01], sat: .97, expo: 1.02, sprAmb: [.1, .055, .04],
    cover: [.8, .74, 1.0, .6], coverCol: [.1, .088, .086], coverP: [.97, .4, .4, 0],
    wat: [0, .45, 1.1, 0], watA: [.012, .008, .01], watB: [.2, .1, .06], fall: [0, 1, 1, 0], fallA: [.04, .02, .02], fallB: [.3, .16, .1], spray: 'water', watEdge: 0x120c0c,
    relief: [1.3, .4, 1.5, 0], puddles: 0, ponds: 0, sway: .7, wind: .9,
    terrain: {
      sea: -.75, bank: .6, rock: .7, flow: .5, freeStream: true,
      sculpt: (x, z, dr, ds, K) => {
        const w = (x - z) * .7071 + (fbm(x * .07 + 2, z * .07, K.sd + 81, 2) - .5) * 7;
        const river = -2.8 * smooth(7.2, 3.2, Math.abs(w + .5));
        const cliff = 3.4 * smooth(8.2, 10.4, w) * smooth(16, 12, w) * (.7 + .6 * fbm(x * .2, z * .2, K.sd + 84, 2));
        return river + (cliff > .3 ? Math.round(cliff / 1.15) * 1.15 + smooth(.2, .6, cliff % 1.15) * .2 : cliff);
      },
    },
    wx: { n: [.26, .14], velA: [.3, -.42, .16], swayA: [.5, .7], sizeA: [.035, .07], colA: [.3, .28, .3, 1], alA: [.85, 0, 0], yA: [-3, 14], velB: [.2, .95, .12], swayB: [.7, .9], sizeB: [.03, .05], colB: [2.6, .9, .14, 0], alB: [1, 2.2, .3], yB: [-2, 10], amb: [.5, .3, .26] },
    mobs: { bomber: 2.4, gargoyle: 1.8, golem: 1.5, toad: 0, slime: .5, wisp: 1.4, skel: 1.4 }, early: { bomber: 2, gargoyle: 4, golem: 6 }, boss: ['colossus'], tints: { golem: [1.5, .5, .26], wolf: [.75, .45, .4], wisp: [1.5, .6, .2], gargoyle: [1.2, .7, .6], toad: [1.2, .7, .5] }, wispHex: 0xff8030,
    trees: [['charred', 7, 2.6, 4.4], ['song', 3, 2.8, 4.0]], stumps: 4, rocks: 40, tufts: 60, webs: 0,
  },
  {
    // 偷渡阴平 (263): Deng Ai's march over the Yinping road; the way is a ledge and plank walkway over chasms, between stone pillars.
    key: 'yinping', name: '偷渡阴平', en: 'Yinping Crossing',
    col: { stone: 0x6c7280, stoneD: 0x3e424e, stoneL: 0x949aa8, earth: 0x3c3c3a, earthD: 0x262628, grass: 0x44523a, grassD: 0x30392c, moss: 0x4a5a3a, road: 0x6e6a62, roadD: 0x4c4944, mud: 0x2c2a28, bark: 0x2a2420, tuftA: 0x56663e, tuftB: 0x8a9058, leaf: 0x1e3a30, leafL: 0x2e5044 },
    strata: [0x707684, 0x3a3e4a, 0x5c6270, 0x8c94a2, 0x4a4e5a, 0x666c7a, 0xa0a8b6, 0x42465a],
    hemi: [0x7a98d0, 0x161a24, 1.1], moon: [0xc8d8ff, 1.6], fill: [0x5070a0, .28], moonPos: [20, 44, -28],
    clear: [.003, .004, .009], mistAmb: [.08, .1, .15], mist: [-3.2, 1.4, 1.25, .16], sky: [.014, .02, .04], lift: [.010, .014, .026], sat: .9, expo: .98, sprAmb: [.06, .07, .1],
    cover: [.9, .62, .4, .3], coverCol: [.5, .54, .6], coverP: [.74, .8, .3, 0],
    wat: [0, 1, 1, 0], watA: [.012, .02, .03], watB: [.3, .4, .5], fall: [0, 1, 1, 0], fallA: [.022, .034, .054], fallB: [.2, .27, .38], spray: 'none',
    relief: [1.3, .4, 1.6, 0], puddles: 0, ponds: 0, sway: 1.1, wind: 1.35,
    terrain: {
      dry: true, step: 1.05, rock: 1, prot: -.7, abyss: -2.4,
      sculpt: (x, z, dr, ds, K) => {
        const n = fbm(x * .12 + 5, z * .12, K.sd + 82, 3), m = fbm(x * .31, z * .31 + 4, K.sd + 85, 2);
        return lerp(-5.2, 5.6 * (.75 + .5 * m), smooth(.52, .7, n)) * smooth(ROAD_HALF + .4, ROAD_HALF + 1.6, dr);
      },
    },
    wx: { n: [.4, .1], velA: [1.6, -.9, .7], swayA: [.4, 1.2], sizeA: [.04, .07], colA: [1, 1.05, 1.12, 1], alA: [.7, 0, .2], yA: [-4, 14], velB: [3.2, -.4, 1.4], swayB: [.3, 1.5], sizeB: [.03, .05], colB: [.9, .95, 1.05, 1], alB: [.4, 0, .7], yB: [-4, 10], amb: [.32, .38, .5] },
    mobs: { wolf: 2.2, gargoyle: 2.2, bat: 1.8, golem: 1.2, toad: 0, slime: .4 }, early: { gargoyle: 3, wolf: 2 }, boss: ['jotun'], tints: { wolf: [1.6, 1.7, 1.9], gargoyle: [.9, 1.0, 1.2], wisp: [.6, .9, 1.4] }, wispHex: 0x90b8ff,
    trees: [['pine', 12, 2.4, 4.6], ['song', 6, 2.6, 4.2]], stumps: 2, rocks: 30, tufts: 120, webs: 0,
  },
  {
    // 夷陵 (222): Liu Bei's camps strung for miles through a wooded gorge, set ablaze by Lu Xun.
    key: 'yiling', name: '夷陵', en: 'Yiling',
    col: { stone: 0x5e6056, stoneD: 0x383a34, stoneL: 0x84867a, earth: 0x3a3424, earthD: 0x242018, grass: 0x34502a, grassD: 0x263a20, moss: 0x3e5a28, road: 0x6a6252, roadD: 0x48423a, mud: 0x2a2418, bark: 0x2a2018, tuftA: 0x405e2a, tuftB: 0x6e7c38, leaf: 0x1c3a1e, leafL: 0x2e5428 },
    strata: [0x5c5444, 0x2e2a22, 0x6a604c, 0x3e3628, 0x7a6c54, 0x34302a, 0x625846, 0x2a261e],
    hemi: [0x5a6a8a, 0x2a160c, 1.1], moon: [0xb8b8d8, 1.3], fill: [0xff6a28, .34], moonPos: [12, 44, -34],
    clear: [.008, .005, .006], mistAmb: [.09, .06, .05], mist: [-.3, .6, 1.0, .12], sky: [.02, .01, .006], lift: [.018, .012, .01], sat: .95, expo: 1, sprAmb: [.09, .06, .05],
    cover: [.5, .78, 1.0, .4], coverCol: [.06, .07, .04], coverP: [.95, .35, .4, 0],
    wat: [0, 1, 1, 0], watA: [.014, .014, .016], watB: [.3, .24, .2], fall: [0, 1, 1, 0], fallA: [.04, .03, .03], fallB: [.3, .24, .2], spray: 'water',
    relief: [1.2, .4, 1.1, 0], puddles: 4, ponds: 1, sway: .8, wind: .9,
    terrain: {
      rock: .15, prot: .4,
      sculpt: (x, z, dr, ds, K) => { const n = fbm(x * .09, z * .09, K.sd + 83, 3); return 3.6 * smooth(2.8, 9.5, dr) * (.55 + .9 * n); },
    },
    wx: { n: [.2, .18], velA: [.3, -.38, .16], swayA: [.5, .7], sizeA: [.035, .065], colA: [.32, .3, .3, 1], alA: [.8, 0, 0], yA: [-2, 12], velB: [.25, 1.1, .12], swayB: [.8, .9], sizeB: [.03, .05], colB: [2.6, 1.0, .18, 0], alB: [1, 2.2, .3], yB: [-1, 9], amb: [.42, .3, .24] },
    mobs: { spider: 2, brood: 1.6, toad: 1.6, wisp: 1.4, bomber: 1.2, slime: .6 }, early: { spider: 2, brood: 6 }, boss: ['queen'], tints: { wisp: [1.5, .7, .25], golem: [1.1, .8, .6] }, wispHex: 0xff9040,
    trees: [], stumps: 6, rocks: 34, tufts: 200, webs: 2,
  },
  {
    // 井陉 (204 BC): out of the narrow Taihang pass the road runs to a river, where Han Xin drew up with his back to the water.
    key: 'jingxing', name: '井陉', en: 'Jingxing Pass',
    col: { stone: 0x8a7458, stoneD: 0x5a4834, stoneL: 0xb09474, earth: 0x7a6446, earthD: 0x544430, grass: 0x6a6a3a, grassD: 0x4c4c2c, moss: 0x5a5c30, road: 0x9a8a6c, roadD: 0x6e624c, mud: 0x3a3226, bark: 0x3a2c20, tuftA: 0x7a7440, tuftB: 0xb0a058, leaf: 0x4a5a2c, leafL: 0x6a7a3a },
    strata: [0xa88460, 0x7a5a40, 0xc4a07a, 0x6a4e38, 0xb89470, 0x8a6a4c, 0xd4b48c, 0x705440],
    hemi: [0x6a78b0, 0x302418, 1.12], moon: [0xd8ccf0, 1.48], fill: [0x4a8090, .3], moonPos: [24, 30, -34],
    clear: [.006, .005, .012], mistAmb: [.08, .07, .11], mist: [-1.2, .6, .8, .1], sky: [.03, .028, .05], lift: [.014, .012, .026], sat: .94, expo: .92, sprAmb: [.08, .07, .1],
    cover: [.7, .78, .9, .5], coverCol: [.36, .29, .19], coverP: [.95, .5, .25, .05],
    wat: [0, .9, 1.1, 0], watA: [.01, .03, .034], watB: [.3, .36, .34], fall: [0, 1, 1, 0], fallA: [.03, .05, .06], fallB: [.26, .34, .36], spray: 'water', watEdge: 0x101a1a,
    relief: [1.3, .3, 1.3, 0], puddles: 0, ponds: 0, sway: 1.1, wind: 1.15, beacon: .8,
    terrain: {
      sea: -1.4, bank: .7, step: 1.25, rock: 1, flow: .6, freeStream: true,
      sculpt: (x, z, dr, ds, K) => {
        const pass = 5.8 * smooth(1.5, -5.5, x + (fbm(x * .1, z * .1 + 6, K.sd + 86, 2) - .5) * 5) * smooth(2.2, 4.6, dr);
        const rv = x + (fbm(x * .09 + 3, z * .09, K.sd + 87, 2) - .5) * 4;
        return pass - 4.2 * smooth(12.2, 15.2, rv);
      },
    },
    wx: { n: [.1, .2], velA: [.5, -.05, .25], swayA: [.6, .5], sizeA: [.03, .05], colA: [.95, .82, .62, 1], alA: [.45, 0, 0], yA: [-1, 8], velB: [3.4, -.1, 1.6], swayB: [.25, 1.2], sizeB: [.025, .045], colB: [.9, .76, .58, 1], alB: [.36, 0, .9], yB: [-.5, 4.5], amb: [.3, .24, .28] },
    mobs: { knight: 1.8, skel: 1.6, wolf: 1.4, drummer: 1.5, mummy: 1.1, toad: 0, slime: .4 }, early: { knight: 3, drummer: 5 }, boss: ['king'], tints: { wolf: [1.4, 1.2, .9], golem: [1.4, 1.1, .75] }, wispHex: 0xffc070,
    trees: [['song', 6, 2.8, 4.4], ['tree', 6, 2.4, 3.8]], stumps: 3, rocks: 50, tufts: 160, webs: 0,
  },
  {
    // 街亭 (228): Ma Su left the road for a lone hill; Zhang He ringed it and cut the water, and the stream below runs dry.
    key: 'jieting', name: '街亭', en: 'Jieting',
    col: { stone: 0x8a7a62, stoneD: 0x5c5040, stoneL: 0xae9c80, earth: 0x6e5c40, earthD: 0x4a3e2c, grass: 0x6c6438, grassD: 0x4e482a, moss: 0x5e5a30, road: 0x908068, roadD: 0x66594a, mud: 0x5a4a36, bark: 0x3c3024, tuftA: 0x80743e, tuftB: 0xb4a058, leaf: 0x4c5a2a, leafL: 0x6c7838 },
    strata: [0x9c8464, 0x6a5440, 0xb49a76, 0x5c4836, 0xa48a68, 0x7a6248, 0xc4aa84, 0x5e4c3a],
    hemi: [0x7078a8, 0x30261a, 1.1], moon: [0xe0d4f4, 1.45], fill: [0x8a6a40, .26], moonPos: [22, 34, -32],
    clear: [.007, .006, .011], mistAmb: [.08, .07, .09], mist: [-.3, .4, .5, .1], sky: [.034, .03, .044], lift: [.016, .013, .024], sat: .92, expo: .92, sprAmb: [.08, .07, .09],
    cover: [.85, .7, .9, .7], coverCol: [.34, .28, .19], coverP: [.95, .5, .25, .05],
    wat: [0, 1, 1, 0], watA: [.01, .02, .02], watB: [.3, .3, .3], fall: [0, 1, 1, 0], fallA: [.02, .04, .04], fallB: [.2, .3, .3], spray: 'none',
    relief: [1.0, .3, 1.0, 0], puddles: 0, ponds: 0, sway: 1.0, wind: 1.1, cracks: 0,
    terrain: {
      dry: true, rock: .55, prot: .2,
      prep(K) {
        let best = -1, bx = 0, bz = 0;
        for (let z = -9; z <= 13; z += .5) for (let x = -9; x <= 13; x += .5) {
          if (x + z > 22 || (Math.abs(x - K.kx) < 7 && z < -7)) continue;
          let d = K.dRoadAt(x, z) - ROAD_HALF; for (const p of K.pads) d = Math.min(d, Math.hypot(x - p.x, z - p.z) - 1.6);
          d = Math.min(d, 16.5 - Math.abs(x), 16.5 - Math.abs(z)); if (d > best) { best = d; bx = x; bz = z; }
        }
        K.hill = { x: bx, z: bz, r: Math.max(3, best) };
      },
      sculpt: (x, z, dr, ds, K) => {
        const h = K.hill, d = Math.hypot(x - h.x, z - h.z) * (.88 + .3 * fbm(x * .3, z * .3, K.sd + 88, 2)), u = sat(d / (h.r + 1.2));
        const cone = 5.4 * (1 - smooth(.25, 1, u)), t = cone / 1.35, f = Math.floor(t);
        return (f + smooth(.55, .95, t - f)) * 1.35 - .35 * smooth(3.4, .6, ds);
      },
    },
    wx: { n: [.08, .22], velA: [.4, -.05, .2], swayA: [.6, .5], sizeA: [.03, .05], colA: [.95, .82, .62, 1], alA: [.45, 0, 0], yA: [-1, 8], velB: [3.8, -.1, 1.7], swayB: [.25, 1.2], sizeB: [.025, .045], colB: [.9, .76, .58, 1], alB: [.4, 0, .9], yB: [-.5, 4.5], amb: [.3, .25, .26] },
    mobs: { skel: 1.6, knight: 1.5, wolf: 1.6, scarab: 1.2, drummer: 1.3, toad: 0, slime: .3 }, early: { knight: 3, drummer: 4 }, boss: ['ogre', 'giant'], tints: { wolf: [1.3, 1.15, .9] }, wispHex: 0xffc060,
    trees: [['tree', 6, 2.2, 3.4], ['charred', 3, 2.2, 3.4]], stumps: 6, rocks: 48, tufts: 110, webs: 0,
  },
  {
    key: 'ashen', name: '雁门关', en: 'Yanmen Pass', col: {},
    strata: [0x8f8474, 0x3c3f4c, 0x66564a, 0x767a86, 0x70503f, 0x4c4f5c, 0x9a8e7c, 0x55483e],
    hemi: [0x6d83bd, 0x1c1f2a, 1.15], moon: [0xa9c0f6, 1.55], fill: [0x4a5f96, .3], moonPos: [14, 44, -34],
    clear: [.0035, .005, .011], mistAmb: [.05, .08, .14], mist: [-.3, .42, .75, .1], sky: [.012, .022, .045], lift: [.010, .016, .030], sat: .92, expo: 1, sprAmb: [.05, .065, .1],
    cover: [0, .55, .3, .5], coverCol: [1, 1, 1], coverP: [.7, .6, 0, 0],
    wat: [0, 1, 1, 0], watA: [.012, .02, .03], watB: [.3, .4, .5], fall: [0, 1, 1, 0], fallA: [.022, .034, .054], fallB: [.2, .27, .38], spray: 'water',
    relief: [1.7, .5, 1, 0], puddles: 11, ponds: 1, sway: 1, wind: 1,
    wx: { n: [.05, 0], velA: [.35, -.12, .18], swayA: [.5, .5], sizeA: [.03, .055], colA: [.75, .8, .95, 1], alA: [.5, 0, 0], yA: [-1, 9], velB: [0, 0, 0], swayB: [0, 0], sizeB: [.05, .05], colB: [1, 1, 1, 1], alB: [0, 0, 0], yB: [0, 1], amb: [.1, .14, .22] },
    mobs: { ghoul: 1.6, wraith: 1.6, necro: 1.5 }, early: { wraith: 3, necro: 5 }, boss: ['giant', 'ogre'], tints: { wisp: [.75, .6, 1.3] }, wispHex: 0xb090ff,
    trees: [['tree', 8, 2.6, 4.6], ['song', 6, 3.0, 4.6]], stumps: 6, rocks: 70, tufts: 320, webs: 4,
  },
  {
    key: 'frost', name: '雪岭长城', en: 'Snow Ridge Wall',
    col: { stone: 0x6f7b90, stoneD: 0x454e60, stoneL: 0x9aa7b8, earth: 0x4b4a50, earthD: 0x2f3038, grass: 0x5a6068, grassD: 0x40454e, moss: 0x55606a, road: 0x7a808c, roadD: 0x555a66, mud: 0x3a3e48, bark: 0x2e2a2a, tuftA: 0x6f7a80, tuftB: 0xa9b4bc, leaf: 0x1d382f, leafL: 0x2c4f42 },
    strata: [0x7d8aa0, 0x3a4254, 0x5d6678, 0x9fb4c8, 0x4b5468, 0x6a7890, 0xb8cadb, 0x475062],
    hemi: [0x86a8e0, 0x323c50, 1.1], moon: [0xc6dcff, 1.38], fill: [0x5f7fb4, .28], moonPos: [16, 42, -34],
    clear: [.0045, .0075, .015], mistAmb: [.1, .14, .21], mist: [-.3, .5, .7, .12], sky: [.03, .05, .085], lift: [.012, .02, .036], sat: .9, expo: .86, sprAmb: [.1, .125, .17],
    cover: [1, .5, .34, .8], coverCol: [.5, .56, .66], coverP: [.74, .85, .32, 0],
    wat: [1, 0, .3, .35], watA: [.03, .075, .12], watB: [.4, .48, .58], fall: [1, 0, .96, 0], fallA: [.1, .17, .27], fallB: [.46, .58, .72], spray: 'none',
    relief: [1.5, .4, 1.15, 0], puddles: 8, ponds: 2, sway: .8, wind: 1.25, beacon: .8,
    wx: { n: [.68, .16], velA: [.55, -1.5, .3], swayA: [.28, 1.1], sizeA: [.055, .1], colA: [1, 1.05, 1.15, 1], alA: [.95, 0, .12], yA: [-3, 15], velB: [2.6, -1.1, 1.3], swayB: [.5, 1.6], sizeB: [.035, .06], colB: [.95, 1, 1.1, 1], alB: [.6, 0, .5], yB: [-2, 9], amb: [.4, .48, .62] },
    mobs: { wolf: 2.4, golem: 1.8, wraith: 1.3, toad: 0, wisp: .5, slime: .6 }, early: { wolf: 2, golem: 6 }, boss: ['jotun'], tints: { wolf: [1.9, 2.0, 2.2], golem: [.8, 1.05, 1.5], wisp: [.5, .9, 1.5], gargoyle: [.9, 1.1, 1.4], toad: [.8, 1.1, 1.4], brute: [1.3, 1.25, 3.0] }, wispHex: 0x80c0ff,
    trees: [['pine', 13, 2.8, 5.4], ['song', 5, 3.0, 4.4], ['tree', 3, 2.6, 4.2]], stumps: 4, rocks: 52, tufts: 110, webs: 0,
  },
  {
    key: 'fen', name: '云梦泽', en: 'Yunmeng Marsh',
    col: { stone: 0x5c6858, stoneD: 0x384234, stoneL: 0x84907a, earth: 0x3b3a28, earthD: 0x24261a, grass: 0x40582c, grassD: 0x2c3e22, moss: 0x4c682e, road: 0x6c6a56, roadD: 0x48483a, mud: 0x2a281c, bark: 0x2c2820, tuftA: 0x486a30, tuftB: 0x7a8a40, leaf: 0x2a4626, leafL: 0x4c6c34 },
    strata: [0x5a5a40, 0x2c3226, 0x4a4030, 0x66705a, 0x3a3020, 0x44503a, 0x777a5c, 0x33382a],
    hemi: [0x4f9482, 0x1a2218, 1.05], moon: [0xa6e6c4, 1.3], fill: [0x2f6f66, .3], moonPos: [10, 46, -32],
    clear: [.003, .007, .006], mistAmb: [.035, .1, .075], mist: [-.1, .62, 1.1, .12], sky: [.018, .05, .036], lift: [.008, .02, .016], sat: .94, expo: 1.02, sprAmb: [.04, .08, .065],
    cover: [.85, .8, 1.1, .55], coverCol: [.075, .125, .05], coverP: [.92, .3, .4, 0],
    wat: [3, .3, .55, 0], watA: [.012, .026, .012], watB: [.1, .2, .045], fall: [0, .8, .9, 0], fallA: [.016, .034, .018], fallB: [.17, .27, .18], spray: 'water',
    relief: [1.0, .3, .7, 0], puddles: 15, ponds: 4, sway: .6, wind: .7,
    wx: { n: [.045, .09], velA: [.12, .02, .08], swayA: [1.3, .45], sizeA: [.05, .085], colA: [1.3, 1.9, .4, 0], alA: [1, 1.3, 0], yA: [.3, 3.4], velB: [.2, -.07, .12], swayB: [.6, .4], sizeB: [.03, .05], colB: [.7, .95, .7, 1], alB: [.5, 0, 0], yB: [-1, 7], amb: [.09, .2, .15] },
    mobs: { toad: 3.5, wisp: 1.8, spider: 2, brood: 2, slime: 1.6, mummy: 0, bomber: .5 }, early: { toad: 2, wisp: 3, brood: 6 }, boss: ['queen'], tints: { golem: [.75, 1.0, .6], wisp: [.5, 1.4, .7], wolf: [.7, .75, .6], gargoyle: [.8, 1, .8] }, wispHex: 0x70ffa0,
    trees: [['willow', 9, 3.0, 4.6], ['tree', 5, 2.6, 4.4]], stumps: 8, rocks: 42, tufts: 420, webs: 3,
  },
  {
    key: 'dunes', name: '玉门关', en: 'Jade Gate',
    col: { stone: 0xb08e6c, stoneD: 0x7a5c48, stoneL: 0xd4b48c, earth: 0xa88c66, earthD: 0x7c6448, grass: 0xbca27a, grassD: 0x927856, moss: 0x7a7444, road: 0xa89478, roadD: 0x786652, mud: 0x64503a, bark: 0x4c3a28, tuftA: 0x8a8048, tuftB: 0xc0a860, leaf: 0x38582e, leafL: 0x66863e },
    strata: [0xb8845c, 0x8e5a40, 0xd6b080, 0x744a38, 0xc89866, 0x9c6a4c, 0xe4cca0, 0x805640],
    hemi: [0x6a6fc0, 0x3c3040, 1.1], moon: [0xd6c8ff, 1.5], fill: [0x2f8f9a, .34], moonPos: [26, 24, -36],
    clear: [.006, .005, .014], mistAmb: [.07, .07, .13], mist: [-.3, .4, .5, .1], sky: [.03, .03, .06], lift: [.014, .012, .03], sat: .95, expo: .9, sprAmb: [.08, .075, .11],
    cover: [.9, .76, .9, .6], coverCol: [.42, .33, .22], coverP: [.95, .5, .25, .05],
    wat: [0, 1, 1, 0], watA: [.008, .04, .045], watB: [.3, .4, .4], fall: [0, 1, 1, 0], fallA: [.02, .06, .07], fallB: [.24, .36, .38], spray: 'water',
    relief: [1.4, .25, .8, .55], puddles: 0, ponds: 2, sway: 1.3, wind: 1.2, beacon: .62,
    wx: { n: [.1, .22], velA: [.5, -.05, .25], swayA: [.6, .5], sizeA: [.03, .05], colA: [.95, .78, .6, 1], alA: [.5, 0, 0], yA: [-1, 8], velB: [4.2, -.1, 1.9], swayB: [.25, 1.2], sizeB: [.025, .045], colB: [.9, .72, .55, 1], alB: [.42, 0, .9], yB: [-.5, 4.5], amb: [.3, .22, .3] },
    mobs: { mummy: 3, scarab: 2.4, spider: .6, bomber: 1.3, ghoul: 1.3, toad: 0, slime: .4 }, early: { mummy: 4, scarab: 2 }, boss: ['king'], tints: { golem: [1.5, 1.1, .72], wolf: [1.5, 1.2, .8], wisp: [1.4, 1.0, .4], gargoyle: [1.5, 1.2, .9], toad: [1.3, 1.1, .7] }, wispHex: 0xffc060,
    trees: [['huyang', 9, 3.0, 4.4], ['tree', 3, 2.4, 3.4]], stumps: 2, rocks: 44, tufts: 150, webs: 0,
  },
];
const BIOME = { start: 0 };
function biomeFor(index) { return BIOMES[((BIOME.start + index) % BIOMES.length + BIOMES.length) % BIOMES.length]; }
function applyBiomePalette(b) { Object.assign(COL, COL0); for (const k in b.col) COL[k] = C(b.col[k]); }

const LOOK = { cur: null, to: null, bio: null };
function lookOf(b) {
  return { hs: C(b.hemi[0]), hg: C(b.hemi[1]), hi: [b.hemi[2]], mc: C(b.moon[0]), mi: [b.moon[1]], fc: C(b.fill[0]), fi: [b.fill[1]], clear: b.clear.slice(), mAmb: b.mistAmb.slice(), mist: b.mist.slice(), sky: b.sky.slice(), lift: b.lift.slice(), grade: [b.sat, b.expo], amb: b.sprAmb.slice(), wamb: b.wx.amb.slice() };
}
const _lc = new THREE.Color();
function applyLook(L) {
  LT.hemi.color.setRGB(L.hs[0], L.hs[1], L.hs[2]); LT.hemi.groundColor.setRGB(L.hg[0], L.hg[1], L.hg[2]); LT.hemi.intensity = L.hi[0];
  LT.moon.color.setRGB(L.mc[0], L.mc[1], L.mc[2]); LT.moon.intensity = L.mi[0]; LT.fill.color.setRGB(L.fc[0], L.fc[1], L.fc[2]); LT.fill.intensity = L.fi[0];
  R.renderer.setClearColor(_lc.setRGB(L.clear[0], L.clear[1], L.clear[2]), 1);
  const a = R.mats.atmo.uniforms, c = R.mats.comp.uniforms;
  a.uMistAmb.value.set(L.mAmb[0], L.mAmb[1], L.mAmb[2]); a.uMist.value.set(L.mist[0], L.mist[1], L.mist[2], L.mist[3]);
  SH.uSky.value.setRGB(L.sky[0], L.sky[1], L.sky[2]); c.uLift.value.set(L.lift[0], L.lift[1], L.lift[2]); c.uGrade.value.y = L.grade[0]; R.exposure = L.grade[1];
  FX.alpha.mesh.material.uniforms.uAmb.value.set(L.amb[0], L.amb[1], L.amb[2]); WX.u.uAmb.value.set(L.wamb[0], L.wamb[1], L.wamb[2]);
}
function setBiomeLook(B, instant) {
  const b = B.bio; LOOK.bio = b; LOOK.to = lookOf(b);
  if (instant || !LOOK.cur) LOOK.cur = lookOf(b);
  SH.uCover.value.fromArray(b.cover); SH.uCoverCol.value.fromArray(b.coverCol); SH.uCoverP.value.fromArray(b.coverP);
  SH.uWat.value.fromArray(b.wat); SH.uWatA.value.fromArray(b.watA); SH.uWatB.value.fromArray(b.watB); SH.uWind.value = b.sway;
  const f = MAT.fall.uniforms; f.uFP.value.fromArray(b.fall); f.uFA.value.fromArray(b.fallA); f.uFB.value.fromArray(b.fallB);
  setWeather(b.wx, instant);
  const m = B.mirrored, p = b.moonPos; LT.moon.position.set(m ? p[2] : p[0], p[1], m ? p[0] : p[2]); LT.moon.target.position.set(0, 0, 0);
  applyLook(LOOK.cur);
}
function updateBiomeLook(dt) {
  if (!LOOK.cur) return;
  const k = 1 - Math.exp(-dt * 1.6), a = LOOK.cur, b = LOOK.to;
  for (const key in a) { const x = a[key], y = b[key]; for (let i = 0; i < x.length; i++) x[i] += (y[i] - x[i]) * k; }
  applyLook(a); WX.fade = Math.min(1, WX.fade + dt * .5); WX.u.uFade.value = WX.fade;
}
