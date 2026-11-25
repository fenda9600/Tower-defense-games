
// The board is 2 * BH on a side. It was 36 (BH 18) and is now 48: a third longer each way, 78 % more ground.
// Everything that hugs an edge is written relative to it: BW / BN are the west and north edges the road enters and the pass
// stands on, BE is the far (east / south) limit, and AREA scales anything scattered by count so the density stays put.
const BH = 24, CHUNK = 6, NCH = 8, CELL = 0.5, ROAD_HALF = 1.25, PATH_STEP = 0.3;
const BW = -BH, BN = -BH, BE = BH, AREA = (BH / 18) * (BH / 18), LIN = BH / 18;

function segDist(px, pz, ax, az, bx, bz) {
  const dx = bx - ax, dz = bz - az, l2 = dx * dx + dz * dz;
  let t = l2 > 0 ? ((px - ax) * dx + (pz - az) * dz) / l2 : 0; t = sat(t);
  const cx = ax + dx * t, cz = az + dz * t;
  return Math.hypot(px - cx, pz - cz);
}
function segInter(a, b, c, d) {
  const r0 = b[0] - a[0], r1 = b[1] - a[1], s0 = d[0] - c[0], s1 = d[1] - c[1], den = r0 * s1 - r1 * s0;
  if (Math.abs(den) < 1e-9) return -1;
  const t = ((c[0] - a[0]) * s1 - (c[1] - a[1]) * s0) / den, u = ((c[0] - a[0]) * r1 - (c[1] - a[1]) * r0) / den;
  return (t >= 0 && t <= 1 && u >= 0 && u <= 1) ? t : -1;
}
function catmull(pts, step) {
  const raw = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    for (let k = 0; k < 24; k++) {
      const t = k / 24, t2 = t * t, t3 = t2 * t;
      const f = (a, b, c, d) => 0.5 * ((2 * b) + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      raw.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  raw.push(pts[pts.length - 1].slice());
  return resample(raw, step);
}
function resample(raw, step) {
  const out = [raw[0].slice()]; let acc = 0;
  for (let i = 1; i < raw.length; i++) {
    let ax = raw[i - 1][0], az = raw[i - 1][1]; const bx = raw[i][0], bz = raw[i][1];
    let seg = Math.hypot(bx - ax, bz - az);
    while (acc + seg >= step) {
      const t = (step - acc) / seg; ax = ax + (bx - ax) * t; az = az + (bz - az) * t; out.push([ax, az]);
      seg = Math.hypot(bx - ax, bz - az); acc = 0;
    }
    acc += seg;
  }
  const l = raw[raw.length - 1], o = out[out.length - 1];
  if (Math.hypot(l[0] - o[0], l[1] - o[1]) > step * 0.4) out.push(l.slice());
  return out;
}
function relax(poly, iters) {
  for (let k = 0; k < iters; k++) for (let i = 1; i < poly.length - 1; i++) {
    poly[i][0] = poly[i][0] * 0.5 + (poly[i - 1][0] + poly[i + 1][0]) * 0.25;
    poly[i][1] = poly[i][1] * 0.5 + (poly[i - 1][1] + poly[i + 1][1]) * 0.25;
  }
  return poly;
}
function polyMinDist(poly, x, z, i0 = 0, i1 = poly.length - 1) {
  let best = 1e9, bi = 0;
  for (let i = i0; i < i1; i++) { const d = segDist(x, z, poly[i][0], poly[i][1], poly[i + 1][0], poly[i + 1][1]); if (d < best) { best = d; bi = i; } }
  return [best, bi];
}

// road length: 58 to 92 on the old board, stretched with the board's side
const ROAD_MIN = Math.round(58 * LIN + 4), ROAD_MAX = Math.round(92 * LIN + 6);
function tryRoad(rng) {
  const zc = rng.range(BN + 11.5, BE - 9), kx = rng.range(BW + 16, BE - 7.5);
  const way = [[BW + .4, zc], [BW + 6, zc]];
  const endA = [kx, BN + 11.8], endB = [kx, BN + 6.6];
  let cur = way[1], dir = 0;
  const nMid = rng.int(6, 10);
  const clearOf = (p, upto) => { for (let i = 0; i < upto; i++) if (segDist(p[0], p[1], way[i][0], way[i][1], way[i + 1][0], way[i + 1][1]) < 6.2) return false; return true; };
  for (let k = 0; k < nMid; k++) {
    let ok = false;
    for (let t = 0; t < 30 && !ok; t++) {
      const a = dir + rng.range(-2.3, 2.3), len = rng.range(5.5, 11.5);
      const p = [cur[0] + Math.cos(a) * len, cur[1] + Math.sin(a) * len];
      if (p[0] < BW + 7.5 || p[0] > BE - 3.8 || p[1] < BN + 11.5 || p[1] > BE - 3.8) continue;
      if (p[0] + p[1] > 2 * BE - 12) continue;
      if (Math.abs(p[0] - kx) < 6.5 && p[1] < BN + 14) continue;
      if (!clearOf(p, way.length - 2)) continue;
      let bad = false;
      for (let i = 0; i < way.length - 2 && !bad; i++) {
        if (segInter(cur, p, way[i], way[i + 1]) >= 0) bad = true;
        for (let u = 0.25; u <= 1 && !bad; u += 0.25) if (segDist(cur[0] + (p[0] - cur[0]) * u, cur[1] + (p[1] - cur[1]) * u, way[i][0], way[i][1], way[i + 1][0], way[i + 1][1]) < 5.6) bad = true;
      }
      if (bad) continue;
      way.push(p); dir = Math.atan2(p[1] - cur[1], p[0] - cur[0]); cur = p; ok = true;
    }
    if (!ok) return null;
  }
  way.push(endA, endB);
  let poly = relax(catmull(way, PATH_STEP), 10);
  poly = resample(poly, PATH_STEP);
  poly[poly.length - 1] = [kx, BN + 6.6];
  const n = poly.length, L = (n - 1) * PATH_STEP;
  if (L < ROAD_MIN || L > ROAD_MAX) return null;
  const gap = Math.round(10 / PATH_STEP);
  for (let i = 0; i < n; i++) {
    const [x, z] = poly[i], s = i * PATH_STEP;
    if (x > BE - 2.7 || z > BE - 2.7 || z < BN + 6.4 || x + z > 2 * BE - 10) return null;
    if (s > 7 && x < BW + 5.8) return null;
    if (s < L - 5.5 && Math.abs(x - kx) < 5.6 && z < BN + 9.4) return null;
    if (s > 7 && s < L - 6 && (z < BN + 8.8)) return null;
    for (let j = i + gap; j < n; j += 2) if (Math.hypot(poly[j][0] - x, poly[j][1] - z) < 6.0) return null;
    if (i >= 4 && i < n - 4) {
      const a = Math.atan2(poly[i][1] - poly[i - 4][1], poly[i][0] - poly[i - 4][0]), b = Math.atan2(poly[i + 4][1] - poly[i][1], poly[i + 4][0] - poly[i][0]);
      if (Math.abs(angDiff(a, b)) > 0.62) return null;
    }
  }
  return { poly, L, zc, kx, way };
}

function tryStream(rng, road) {
  const { poly, L, kx } = road;
  for (let t = 0; t < 60; t++) {
    const sx = rng.range(BW + 8, BE - 6), sz = rng.range(BN + 5.5, 4);
    if (Math.abs(sx - kx) < 7 && sz < BN + 11) continue;
    if (polyMinDist(poly, sx, sz)[0] < 3.6) continue;
    const front = rng.chance(0.6);
    const ex = front ? rng.range(BW + 5, BE - 5) : BH + 0.6, ez = front ? BH + 0.6 : rng.range(BN + 11, BE - 5);
    const mx = (sx + ex) / 2 + rng.range(-7, 7), mz = (sz + ez) / 2 + rng.range(-7, 7);
    const raw = [];
    for (let k = 0; k <= 40; k++) { const u = k / 40, a = (1 - u) * (1 - u), b = 2 * u * (1 - u), c = u * u; raw.push([a * sx + b * mx + c * ex, a * sz + b * mz + c * ez]); }
    const sp = resample(raw, 0.5);
    if (sp.length < 20) continue;
    let cross = null, count = 0, bad = false;
    for (let i = 0; i < sp.length - 1 && !bad; i++) {
      for (let j = 0; j < poly.length - 1; j++) {
        const tt = segInter(sp[i], sp[i + 1], poly[j], poly[j + 1]);
        if (tt >= 0) {
          count++; if (count > 1) { bad = true; break; }
          const sa = Math.atan2(sp[i + 1][1] - sp[i][1], sp[i + 1][0] - sp[i][0]), ra = Math.atan2(poly[j + 1][1] - poly[j][1], poly[j + 1][0] - poly[j][0]);
          let rel = Math.abs(angDiff(sa, ra)); if (rel > HPI) rel = PI - rel;
          cross = { i, j, s: j * PATH_STEP, x: sp[i][0] + (sp[i + 1][0] - sp[i][0]) * tt, z: sp[i][1] + (sp[i + 1][1] - sp[i][1]) * tt, rel, ra };
        }
      }
    }
    if (bad || count !== 1) continue;
    if (cross.rel < 1.0 || cross.s < 9 || cross.s > L - 9) continue;
    for (let i = 0; i < sp.length && !bad; i++) {
      const [x, z] = sp[i];
      if (Math.hypot(x - cross.x, z - cross.z) > 3.4 && polyMinDist(poly, x, z)[0] < 3.3) bad = true;
      if (Math.abs(x - kx) < 6.2 && z < BN + 9) bad = true;
      if (x < BW + 5.2) bad = true;
    }
    if (bad) continue;
    return { pts: sp, cross, src: [sx, sz], front };
  }
  return null;
}

// 8 to 11 tower bases on the old board; the longer road carries 11 to 15
const PADS_MIN = 11, PADS_MAX = 15;
function choosePads(rng, road, stream) {
  const { poly, L, kx } = road, cand = [];
  const off = ROAD_HALF + 2.0;
  for (let s = 7.5; s < L - 3.5; s += 0.9) {
    const i = Math.round(s / PATH_STEP), a = poly[Math.max(0, i - 2)], b = poly[Math.min(poly.length - 1, i + 2)];
    const tx = b[0] - a[0], tz = b[1] - a[1], tl = Math.hypot(tx, tz) || 1, nx = -tz / tl, nz = tx / tl;
    for (const side of [-1, 1]) {
      const x = poly[i][0] + nx * off * side, z = poly[i][1] + nz * off * side;
      if (Math.abs(x) > BH - 2.4 || Math.abs(z) > BH - 2.4 || x < BW + 6.8) continue;
      if (Math.abs(x - kx) < 6.4 && z < BN + 8.4) continue;
      if (z < BN + 5.4 || x + z < BW + BN + 15) continue;
      if (polyMinDist(poly, x, z)[0] < off - 0.25) continue;
      if (stream && polyMinDist(stream.pts, x, z)[0] < 2.9) continue;
      let cov = 0; for (let j = 0; j < poly.length; j++) if (dist2(x, z, poly[j][0], poly[j][1]) < 36) cov += PATH_STEP;
      cand.push({ x, z, s, side, cov });
    }
  }
  if (cand.length < PADS_MIN) return null;
  cand.sort((p, q) => q.cov - p.cov);
  const pads = [], thirds = [0, 0, 0];
  const far = (c, dmin) => pads.every(p => dist2(p.x, p.z, c.x, c.z) > dmin * dmin);
  for (let pass = 0; pass < 2; pass++) for (let third = 0; third < 3; third++) {
    const c = cand.find(c => Math.min(2, Math.floor(c.s / L * 3)) === third && far(c, 4.6));
    if (c) { pads.push(c); thirds[third]++; }
  }
  for (const c of cand) { if (pads.length >= PADS_MAX) break; if (far(c, 4.6)) pads.push(c); }
  if (pads.length < PADS_MIN) return null;
  pads.sort((p, q) => p.s - q.s);
  return pads;
}

function genLayout(seed) {
  const rng = makeRng(seed * 7919 + 13);
  let best = null;
  for (let attempt = 0; attempt < 2500; attempt++) {
    const road = tryRoad(rng); if (!road) continue;
    const stream = tryStream(rng, road); if (!stream) continue;
    const pads = choosePads(rng, road, stream); if (!pads) continue;
    let minx = 99, maxx = -99, minz = 99, maxz = -99;
    for (const p of road.poly) { minx = Math.min(minx, p[0]); maxx = Math.max(maxx, p[0]); minz = Math.min(minz, p[1]); maxz = Math.max(maxz, p[1]); }
    let turn = 0; const pp = road.poly;
    for (let i = 6; i < pp.length - 6; i += 3) turn += Math.abs(angDiff(Math.atan2(pp[i][1] - pp[i - 3][1], pp[i][0] - pp[i - 3][0]), Math.atan2(pp[i + 3][1] - pp[i][1], pp[i + 3][0] - pp[i][0])));
    const score = Math.min(road.L, ROAD_MAX - 8) * 0.55 + turn * 3.2 + pads.length * 2 + (maxx - Math.max(minx, BW + 6)) * 0.3 + (maxz - minz) * 0.3 + rng() * 5;
    if (!best || score > best.score) best = { road, stream, pads, score, turn };
    if (attempt > 700 && best) break;
  }
  if (!best) return null;
  const { road, stream, pads } = best;
  return {
    seed, pts: road.poly, L: road.L, cave: { x: BW + 3.4, z: road.zc }, gate: { x: road.kx, z: BN + 6.6 }, kx: road.kx,
    stream: stream.pts, cross: stream.cross, streamFront: stream.front, pads, mirrored: false,
  };
}
