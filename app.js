(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const el = (id) => document.getElementById(id);

  // ---------- modules ----------
  // Each crusade is a module pushed onto window.CRUSADES (see docs/DATA.md).
  const MODULES = (window.CRUSADES || []).slice();
  if (window.CRUSADE && !MODULES.some((m) => m.id === (window.CRUSADE.id || "first"))) {
    MODULES.push({ order: 1, ...window.CRUSADE, battles: { ...(window.CRUSADE.battles || {}), ...(window.BATTLES || {}) } });
  }
  MODULES.sort((a, b) => (a.order || 0) - (b.order || 0));
  for (const m of MODULES) {
    m.battles = m.battles || {};
    m.landmarks = m.landmarks || m.cities || [];
    m.regions = m.regions || [];
    m.routes = m.routes || {};
    m.figures = m.figures || {};
  }
  const GEO = window.GEO || { powers: {}, territories: [], rivers: [], mountains: [] };
  GEO.territories = (GEO.territories || []).slice().sort((a, b) => a.year - b.year);

  let C = MODULES[0];
  let chapters = C.chapters;
  let routeStates = [];
  let chapterIndex = {};

  function useModule(m) {
    C = m;
    chapters = m.chapters;
    routeStates = [];
    let s = {};
    for (const ch of chapters) { s = { ...s, ...(ch.routes || {}) }; routeStates.push(s); }
    chapterIndex = Object.fromEntries(chapters.map((c, i) => [c.id, i]));
    routeNow = {};
    readRouteColors();
    buildTimeline();
    el("crusade-name").textContent = `${m.name} · ${m.years}`;
    baseKey = "";
  }

  // ---------- geometry ----------
  const land110 = topojson.feature(window.LAND110, window.LAND110.objects.land);
  const land50 = topojson.feature(window.LAND50, window.LAND50.objects.land);
  const graticule = d3.geoGraticule().step([10, 10])();
  const sphere = { type: "Sphere" };
  // Portolan rhumb lines radiating from a wind rose in the eastern Mediterranean.
  const ROSE = [27, 35.5];
  const rhumbs = {
    type: "MultiLineString",
    coordinates: d3.range(32).map((i) => {
      const pts = [];
      for (let d = 0; d <= 40; d += 2) pts.push(destination(ROSE, (i * 360) / 32, d));
      return pts;
    }),
  };
  function destination([lon, lat], bearingDeg, distDeg) {
    const r = Math.PI / 180, b = bearingDeg * r, d = distDeg * r, p1 = lat * r, l1 = lon * r;
    const p2 = Math.asin(Math.sin(p1) * Math.cos(d) + Math.cos(p1) * Math.sin(d) * Math.cos(b));
    const l2 = l1 + Math.atan2(Math.sin(b) * Math.sin(d) * Math.cos(p1), Math.cos(d) - Math.sin(p1) * Math.sin(p2));
    return [l2 / r, p2 / r];
  }
  // Territory rings must wind clockwise for d3 (smaller than a hemisphere).
  const toPolygon = (poly) => {
    const ring = [...poly, poly[0]];
    const f = { type: "Polygon", coordinates: [ring] };
    if (d3.geoArea(f) > 2 * Math.PI) f.coordinates = [ring.slice().reverse()];
    return f;
  };
  for (const snap of GEO.territories) for (const a of snap.areas) { a.geo = toPolygon(a.poly); a.center = d3.geoCentroid(a.geo); }

  // ---------- canvas ----------
  const stage = el("stage");
  const canvas = el("globe");      // overlay: routes, figures, labels (redrawn every frame)
  const ctx = canvas.getContext("2d");
  const baseCanvas = el("base");   // cached map: sea, land, borders, rivers, mountains
  const bctx = baseCanvas.getContext("2d");
  const projection = d3.geoOrthographic().clipAngle(90).precision(0.4);
  const path = d3.geoPath(projection, ctx);
  const bpath = d3.geoPath(projection, bctx);
  let baseKey = "";
  let W = 0, H = 0, base = 1;
  const cam = { lon: 20, lat: 40, k: 0.9 };
  let routeNow = {};
  let current = 0;
  let activeRoutes = new Set();
  let mapYearNow = 1095;

  let colors = {};
  function readColors() {
    const cs = getComputedStyle(document.documentElement);
    const v = (n) => cs.getPropertyValue(n).trim();
    colors = {
      sea: v("--sea"), seaDeep: v("--sea-deep"), land: v("--land"), coast: v("--coast"),
      rhumb: v("--rhumb"), ink: v("--ink"), soft: v("--ink-soft"), vellum: v("--vellum"),
      verm: v("--vermilion"), gold: v("--gold"), leaf: v("--leaf"), foe: v("--foe"),
      river: v("--river"), mount: v("--mount"),
    };
    colors.dark = luminance(colors.leaf) < 0.3;
    readRouteColors();
    baseKey = "";
  }
  function readRouteColors() {
    if (!colors.ink) return;
    const cs = getComputedStyle(document.documentElement);
    for (const [id, r] of Object.entries(C.routes)) colors[id] = routeColor(r.color, cs);
  }
  function routeColor(c, cs) {
    if (!c) return colors.verm;
    if (c.startsWith("--")) return cs.getPropertyValue(c).trim() || colors.verm;
    return colors.dark ? mix(c, "#ffffff", 0.35) : c;
  }
  function hexRgb(h) {
    const m = h.replace("#", "");
    const n = parseInt(m.length === 3 ? m.split("").map((x) => x + x).join("") : m, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function luminance(h) {
    if (!h || !h.startsWith("#")) return 1;
    const [r, g, b] = hexRgb(h);
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  }
  function mix(a, b, t) {
    const A = hexRgb(a), B = hexRgb(b);
    return "#" + A.map((x, i) => Math.round(x + (B[i] - x) * t).toString(16).padStart(2, "0")).join("");
  }
  function rgba(hex, a) {
    if (!hex.startsWith("#")) return hex;
    const [r, g, b] = hexRgb(hex);
    return `rgba(${r},${g},${b},${a})`;
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = stage.clientWidth; H = stage.clientHeight;
    for (const [cv, cx] of [[canvas, ctx], [baseCanvas, bctx]]) {
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    // Tall, narrow stages (phones) zoom in a little so the globe isn't lost in empty space.
    base = Math.max(Math.min(W, H), Math.min(W * 1.4, H * 0.75)) * 0.46;
    baseKey = "";
    if (chapters[current] && el("legend").childElementCount) renderLegend();
    draw();
  }

  function applyCam() {
    // In cinema mode the caption covers the bottom of the screen, so the view sits higher.
    projection.scale(base * cam.k).translate([W / 2, cinema ? H * 0.36 : H / 2]).rotate([-cam.lon, -cam.lat, 0]);
  }
  const visible = (pt) => d3.geoDistance(pt, [cam.lon, cam.lat]) < 1.45;

  function partialLine(points, p) {
    const n = Math.min(Math.floor(p), points.length - 1);
    const coords = points.slice(0, n + 1);
    const f = p - n;
    if (f > 0 && n + 1 < points.length) coords.push(d3.geoInterpolate(points[n], points[n + 1])(f));
    return coords;
  }

  const territoryAt = (year) => {
    let snap = null;
    for (const s of GEO.territories) if (s.year <= year + 1e-6) snap = s;
    return snap;
  };

  // ---------- labels ----------
  let boxes = [];
  function label(text, x, y, { font, color, align = "left", halo = true, spacing = 0 }) {
    ctx.font = font;
    if ("letterSpacing" in ctx) ctx.letterSpacing = spacing + "px";
    const w = ctx.measureText(text).width, h = parseFloat(font.match(/(\d+)px/)[1]);
    const x0 = align === "center" ? x - w / 2 : align === "right" ? x - w : x;
    const box = [x0 - 3, y - h / 2 - 2, x0 + w + 3, y + h / 2 + 2];
    const clash = box[2] < 0 || box[0] > W || box[3] < 0 || box[1] > H || boxes.some((b) => box[0] < b[2] && box[2] > b[0] && box[1] < b[3] && box[3] > b[1]);
    if (clash) { if ("letterSpacing" in ctx) ctx.letterSpacing = "0px"; return false; }
    boxes.push(box);
    ctx.textAlign = align;
    ctx.textBaseline = "middle";
    if (halo) { ctx.lineWidth = 3.5; ctx.lineJoin = "round"; ctx.strokeStyle = colors.land; ctx.strokeText(text, x, y); }
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
    if ("letterSpacing" in ctx) ctx.letterSpacing = "0px";
    return true;
  }

  // ---------- base layer ----------
  function drawBase() {
    const r = base * cam.k, c = bctx;
    c.clearRect(0, 0, W, H);
    const [cx, cy] = projection.translate();
    const g = c.createRadialGradient(cx - r * 0.3, cy - r * 0.35, r * 0.1, cx, cy, r);
    g.addColorStop(0, colors.sea); g.addColorStop(1, colors.seaDeep);
    c.beginPath(); bpath(sphere); c.fillStyle = g; c.fill();
    c.beginPath(); bpath(rhumbs); c.strokeStyle = colors.rhumb; c.lineWidth = 0.8; c.stroke();
    c.beginPath(); bpath(graticule); c.strokeStyle = colors.rhumb; c.lineWidth = 0.5; c.stroke();
    const land = cam.k < 2.4 ? land110 : land50;
    c.beginPath(); bpath(land); c.fillStyle = colors.land; c.fill();

    // territories, clipped to the land
    const snap = territoryAt(mapYearNow);
    if (snap) {
      c.save();
      c.beginPath(); bpath(land); c.clip();
      for (const a of snap.areas) {
        const pw = GEO.powers[a.power];
        if (!pw) continue;
        c.beginPath(); bpath(a.geo);
        c.fillStyle = rgba(pw.color, colors.dark ? 0.34 : 0.26); c.fill();
      }
      for (const a of snap.areas) {
        const pw = GEO.powers[a.power];
        if (!pw) continue;
        c.beginPath(); bpath(a.geo);
        c.setLineDash([4, 3]); c.strokeStyle = rgba(pw.color, 0.8); c.lineWidth = 1.1; c.stroke();
      }
      c.setLineDash([]);
      c.restore();
    }

    // rivers
    if (cam.k >= 1.6) {
      for (const rv of GEO.rivers || []) {
        c.beginPath(); bpath({ type: "LineString", coordinates: rv.path });
        c.strokeStyle = colors.river; c.lineWidth = cam.k > 6 ? 1.8 : 1.1; c.lineJoin = "round"; c.lineCap = "round"; c.stroke();
      }
    }
    // mountains: little hachured peaks along each ridge
    if (cam.k >= 2.2) {
      const ps = Math.max(5, Math.min(13, 2.5 + cam.k * 1.1));
      for (const m of GEO.mountains || []) drawRidge(c, m.path, ps);
    }

    c.beginPath(); bpath(land); c.strokeStyle = colors.coast; c.lineWidth = cam.k > 6 ? 1.2 : 0.8; c.stroke();
    c.beginPath(); bpath(sphere); c.strokeStyle = colors.coast; c.lineWidth = 1.2; c.stroke();
  }

  function drawRidge(c, coords, ps) {
    const pts = [];
    for (let i = 0; i < coords.length - 1; i++) {
      const ip = d3.geoInterpolate(coords[i], coords[i + 1]);
      for (let j = 0; j < 8; j++) {
        const p = ip(j / 8);
        if (visible(p)) pts.push(projection(p)); else pts.push(null);
      }
    }
    let acc = ps, last = null, n = 0;
    for (const p of pts) {
      if (!p) { last = null; continue; }
      if (last) acc += Math.hypot(p[0] - last[0], p[1] - last[1]);
      last = p;
      if (acc < ps * 1.15) continue;
      acc = 0; n++;
      const [x, y] = p;
      const h = ps * (n % 3 === 0 ? 1 : 0.8), w = ps * 0.7;
      c.beginPath(); c.moveTo(x - w, y); c.lineTo(x, y - h); c.lineTo(x + w, y);
      c.fillStyle = colors.land; c.fill();
      c.strokeStyle = colors.mount; c.lineWidth = 1; c.stroke();
      c.beginPath();
      for (let k = 1; k < 4; k++) { c.moveTo(x + (w * k) / 4, y); c.lineTo(x + (w * (k - 1)) / 4 * 0.6, y - h * (1 - k / 4) * 0.9); }
      c.lineWidth = 0.7; c.stroke();
    }
  }

  // ---------- overlay ----------
  function draw() {
    if (!W) return;
    applyCam();
    const snap = territoryAt(mapYearNow);
    const key = [cam.lon, cam.lat, cam.k, W, H, cinema, colors.sea, snap ? snap.year : 0].join("|");
    if (key !== baseKey) { drawBase(); baseKey = key; }
    ctx.clearRect(0, 0, W, H);
    const now = performance.now() / 1000;
    const cur = chapters[current];
    const figS = Math.max(11, Math.min(26, 8 + cam.k * 1.4));

    // routes
    for (const [id, p] of Object.entries(routeNow)) {
      if (!(p > 0) || !C.routes[id]) continue;
      const line = { type: "LineString", coordinates: partialLine(C.routes[id].points, p) };
      ctx.beginPath(); path(line);
      ctx.strokeStyle = colors.land; ctx.lineWidth = 5.5; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.stroke();
      ctx.beginPath(); path(line);
      ctx.strokeStyle = colors[id]; ctx.lineWidth = activeRoutes.has(id) ? 3 : 2;
      ctx.setLineDash(C.routes[id].dashed ? [5, 4] : []);
      ctx.stroke(); ctx.setLineDash([]);
    }

    // siege camps
    if (cur.camp && visible(cur.at)) {
      const [x, y] = projection(cur.at);
      const rr = Math.max(26, figS * 2.6);
      const tents = [];
      for (let i = 0; i < 9; i++) {
        const a = (i / 9) * Math.PI * 2 + 0.3;
        tents.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr * 0.55 + rr * 0.1]);
      }
      tents.sort((p, q) => p[1] - q[1]).forEach(([tx, ty]) => Sprites.tent(ctx, figS * 0.9, cur.camp === "foe" ? colors.foe : colors.verm, tx, ty));
    }

    // places
    const placeLabels = [];
    const iconBoxes = [];
    const iconU = Math.max(12, Math.min(44, 5 + cam.k * 2.6));
    const near = (a, b) => Math.abs(a[0] - b[0]) < 0.06 && Math.abs(a[1] - b[1]) < 0.06;
    const marks = [];
    for (const lm of C.landmarks) marks.push({ name: lm.name, at: lm.at, icon: lm.icon, pri: lm.major ? 1 : 3 });
    for (let i = 0; i <= current; i++) {
      const ch = chapters[i];
      if (i === 0 && current !== 0 && !ch.fight) continue;
      if (marks.some((m) => near(m.at, ch.at))) continue;
      if (!ch.fight && !/^[A-Z][\w'’-]+(,|$)/.test(ch.place)) continue;
      marks.push({ name: ch.place.split(",")[0], at: ch.at, icon: ch.fight ? "battle" : null, pri: 2 });
    }
    for (const m of marks) { m.isCur = near(m.at, cur.at); if (m.isCur) m.pri = 0; }
    marks.sort((p, q) => p.pri - q.pri);
    for (const m of marks) {
      if (!visible(m.at)) continue;
      const [x, y] = projection(m.at);
      const u = m.isCur ? iconU * 1.25 : iconU;
      const box = [x - u * 0.8, y - u * 1.3, x + u * 0.8, y + 2];
      const free = m.icon && !iconBoxes.some((b) => box[0] < b[2] && box[2] > b[0] && box[1] < b[3] && box[3] > b[1]);
      if (free && (m.isCur || m.pri <= 1 || cam.k >= 2.2)) {
        Sprites.landmark(ctx, m.icon, x, y + 2, u);
        iconBoxes.push(box);
        m.lx = u * 0.8;
      } else {
        ctx.beginPath(); ctx.arc(x, y, m.isCur ? 5 : 3, 0, Math.PI * 2);
        ctx.fillStyle = m.isCur ? colors.verm : colors.ink; ctx.fill();
        ctx.lineWidth = 1.5; ctx.strokeStyle = colors.land; ctx.stroke();
        m.lx = 6;
      }
      if (m.isCur || cam.k >= 3 || m.pri <= 1) placeLabels.push({ name: m.name, x: x + m.lx, y: y - (m.lx > 6 ? iconU * 0.35 : 0), isCur: m.isCur, pri: m.pri });
    }

    // armies: marching columns of figures behind each leader
    const headLabels = [];
    for (const id of Object.keys(routeNow)) {
      const route = C.routes[id];
      const p = routeNow[id];
      if (!route || !(p > 0)) continue;
      if (route.until && chapterIndex[route.until] < current) continue;
      const coords = partialLine(route.points, p);
      const head = coords[coords.length - 1];
      const here = d3.geoDistance(head, cur.at) < 0.05;
      if (!activeRoutes.has(id) && !here) continue;
      if (!visible(head)) continue;
      drawColumn(id, coords, figS, now, marching && activeRoutes.has(id));
      const [x, y] = projection(head);
      headLabels.push({ text: route.label, x, y, color: colors[id] });
    }

    // labels, most important first
    boxes = [...iconBoxes.map((b) => [b[0] + 4, b[1] + 4, b[2] - 4, b[3] - 2])];
    placeLabels.sort((a, b) => a.pri - b.pri);
    for (const l of placeLabels.filter((l) => l.isCur)) placeLabel(l);
    for (const h of headLabels) {
      const f = { font: `700 12px "Alegreya Sans SC", sans-serif`, color: h.color, spacing: 0.5 };
      label(h.text, h.x + 12, h.y + 10, f) || label(h.text, h.x - 12, h.y + 10, { ...f, align: "right" }) || label(h.text, h.x + 14, h.y - figS * 2.1, f);
    }
    for (const l of placeLabels.filter((l) => !l.isCur)) placeLabel(l);
    if (cam.k >= 1.8) {
      for (const reg of C.regions) {
        if (reg.from && chapterIndex[reg.from] > current) continue;
        if (reg.until && chapterIndex[reg.until] < current) continue;
        if (!visible(reg.at)) continue;
        const [x, y] = projection(reg.at);
        if (reg.state) {
          label(reg.name.toUpperCase(), x, y, { font: `700 ${cam.k > 6 ? 13 : 11}px "Alegreya Sans SC", sans-serif`, color: colors.verm, align: "center", spacing: 1.5 });
        } else if (reg.sea) {
          label(reg.name, x, y, { font: `italic ${cam.k > 4 ? 15 : 13}px Alegreya, serif`, color: colors.soft, align: "center", halo: false, spacing: 1 });
        } else if (cam.k < 7) {
          label(reg.name.toUpperCase(), x, y, { font: `500 11px "Alegreya Sans SC", sans-serif`, color: colors.soft, align: "center", spacing: 2.5 });
        }
      }
    }
    // river and mountain names when close in
    if (cam.k >= 5.5) {
      for (const rv of GEO.rivers || []) {
        const mid = rv.path[Math.floor(rv.path.length / 2)];
        if (!visible(mid)) continue;
        const [x, y] = projection(mid);
        label(rv.name, x, y + 8, { font: `italic 13px Alegreya, serif`, color: colors.river, align: "center" });
      }
      for (const m of GEO.mountains || []) {
        const mid = m.path[Math.floor(m.path.length / 2)];
        if (!visible(mid)) continue;
        const [x, y] = projection(mid);
        label(m.name, x, y + 12, { font: `italic 12px Alegreya, serif`, color: colors.soft, align: "center" });
      }
    }
    placePulse();
  }

  function placeLabel({ name, x, y, isCur }) {
    const f = { font: isCur ? `600 15px Alegreya, serif` : `14px Alegreya, serif`, color: isCur ? colors.verm : colors.ink };
    label(name, x + 4, y - 1, f) || label(name, x - 14, y - 1, { ...f, align: "right" }) || label(name, x - 6, y + 14, { ...f, align: "center" });
  }

  // Lay figures back along the route from its head, spaced on screen.
  function drawColumn(id, coords, s, now, moving) {
    const route = C.routes[id];
    const comp = route.column || ["leader", "knight", "knight", "foot", "foot", "foot"];
    const dense = [];
    for (let i = 0; i < coords.length - 1; i++) {
      const ip = d3.geoInterpolate(coords[i], coords[i + 1]);
      const n = Math.max(1, Math.ceil((d3.geoDistance(coords[i], coords[i + 1]) * 180) / Math.PI * 3));
      for (let j = 0; j < n; j++) dense.push(ip(j / n));
    }
    dense.push(coords[coords.length - 1]);
    const pts = [];
    for (let k = dense.length - 1; k >= 0; k--) {
      if (!visible(dense[k])) break;
      pts.push(projection(dense[k]));
    }
    if (!pts.length) return;
    const gap = s * 0.95;
    const figs = [];
    let seg = 0, along = 0;
    if (pts.length === 1) figs.push({ x: pts[0][0], y: pts[0][1], facing: 1, kind: comp[0], i: 0 });
    for (let i = 0; i < comp.length && pts.length > 1; i++) {
      const want = i * gap;
      let placed = false;
      while (seg < pts.length - 1) {
        const [ax, ay] = pts[seg], [bx, by] = pts[seg + 1];
        const L = Math.hypot(bx - ax, by - ay);
        if (along + L >= want) {
          const f = L ? (want - along) / L : 0;
          const side = i === 0 ? 0 : (i % 2 ? 1 : -1) * s * 0.22;
          const nx = L ? -(ay - by) / L : 0, ny = L ? (ax - bx) / L : 0;
          figs.push({ x: ax + (bx - ax) * f + nx * side, y: ay + (by - ay) * f + ny * side, facing: ax - bx >= 0 ? 1 : -1, kind: comp[i], i });
          placed = true;
          break;
        }
        along += L; seg++;
      }
      if (!placed) break;
    }
    figs.sort((a, b) => a.y - b.y).forEach((f) => {
      const lead = f.kind === "leader" || f.kind === "king";
      Sprites.figure(ctx, f.kind === "leader" && route.king ? "king" : f.kind, f.x, f.y, lead ? s * 1.15 : s, {
        facing: f.facing, t: now * 8 + f.i * 1.7, gait: moving && !reduceMotion ? 1 : 0, seed: f.i,
        color: colors[id], shield: f.i % 3 === 1 ? colors.gold : undefined,
        mark: lead ? route.device : undefined, color2: route.color2,
      });
    });
  }

  const pulse = el("pulse");
  function placePulse() {
    const at = chapters[current].at;
    if (!visible(at)) { pulse.hidden = true; return; }
    const [x, y] = projection(at);
    pulse.hidden = false;
    pulse.style.left = x + "px"; pulse.style.top = y + "px";
  }

  // ---------- day counter ----------
  const dayEl = el("days");
  function daysOf(ch) {
    if (!ch.days) return 0;
    const a = Date.parse(ch.days.from), b = Date.parse(ch.days.to);
    if (!(a && b)) return 0;
    return Math.max(1, Math.round((b - a) / 86400000) + 1);
  }
  function setDays(ch, f) {
    const n = daysOf(ch);
    if (!n) { dayEl.hidden = true; return; }
    dayEl.hidden = false;
    const d = Math.max(1, Math.round(n * f));
    dayEl.innerHTML = `<b>Day ${d.toLocaleString("en")}</b> ${esc(ch.days.label || "")}`;
  }

  // ---------- animation ----------
  let anim = null, raf = 0, marching = false, paused = false;
  function loop(now) {
    raf = 0;
    if (paused || document.hidden) return;
    if (anim) {
      const t = Math.min(1, (now - anim.start) / anim.dur);
      anim.step(t);
      if (t >= 1) { const done = anim.done; anim = null; marching = false; done && done(); }
    }
    draw();
    raf = requestAnimationFrame(loop);
  }
  function kick() { if (!raf && !paused) raf = requestAnimationFrame(loop); }
  document.addEventListener("visibilitychange", kick);

  function travel(index) {
    const ch = chapters[index];
    const from = { ...cam };
    const to = { lon: ch.view.at[0], lat: ch.view.at[1], k: ch.view.k };
    const fromRoutes = { ...routeNow };
    const toRoutes = routeStates[index];
    const moving = new Set(Object.keys(ch.routes || {}));
    activeRoutes = moving;
    userMoved = false; recenterBtn.hidden = true;
    const targetYear = ch.mapYear || ch.year;

    if (reduceMotion) {
      Object.assign(cam, to); routeNow = { ...toRoutes }; mapYearNow = targetYear; setDays(ch, 1);
      kick(); afterTravel(); return;
    }
    const interp = d3.geoInterpolate([from.lon, from.lat], [to.lon, to.lat]);
    const dist = d3.geoDistance([from.lon, from.lat], [to.lon, to.lat]);
    const flyDur = 900 + Math.min(1600, dist * 4000) + Math.abs(Math.log(to.k / from.k)) * 250;
    const hasRoutes = moving.size > 0;
    const dur = flyDur + (hasRoutes ? 3200 * 0.85 : 0) + (ch.days ? 900 : 0);
    const flyEnd = flyDur / dur;
    // On long hops, pull back first so the viewer sees where we are going.
    const lk0 = Math.log(from.k), lk1 = Math.log(to.k);
    const lkMid = Math.min(lk0, lk1, Math.log(Math.max(1.1, Math.min(from.k, to.k) / (1 + dist * 6))));
    // A siege counted across two chapters carries on from where the last one stopped.
    const prevCh = chapters[index - 1];
    const dayStart = prevCh && prevCh.days && ch.days && prevCh.days.from === ch.days.from && daysOf(ch) ? daysOf(prevCh) / daysOf(ch) : 0;
    setDays(ch, dayStart);

    anim = {
      start: performance.now(), dur,
      step(t) {
        const ft = d3.easeCubicInOut(Math.min(1, t / flyEnd));
        const [lon, lat] = interp(ft);
        cam.lon = lon; cam.lat = lat;
        const a = (1 - ft) * (1 - ft), b = 2 * ft * (1 - ft), c = ft * ft;
        cam.k = Math.exp(a * lk0 + b * lkMid + c * lk1);
        if (ft > 0.5) mapYearNow = targetYear;
        const rt = d3.easeSinInOut(Math.max(0, Math.min(1, (t - flyEnd * 0.6) / (1 - flyEnd * 0.6))));
        if (hasRoutes) {
          const next = { ...toRoutes };
          for (const id of Object.keys(toRoutes)) {
            const f = fromRoutes[id] || 0;
            next[id] = f + (toRoutes[id] - f) * (moving.has(id) ? rt : 1);
          }
          routeNow = next;
          marching = rt > 0 && rt < 1;
        } else {
          routeNow = { ...toRoutes };
        }
        if (ch.days) setDays(ch, dayStart + (1 - dayStart) * d3.easeCubicOut(Math.max(0, (t - flyEnd * 0.5) / (1 - flyEnd * 0.5))));
      },
      done: afterTravel,
    };
    kick();
  }

  function afterTravel() {
    const ch = chapters[current];
    if (cinema && playing && (ch.battle || ch.moment)) {
      autoTimer = setTimeout(() => openScene(ch.moment || ch.battle, true), 2200);
      return;
    }
    scheduleAutoplay();
  }

  // ---------- chronicle panel ----------
  const chapterEl = el("chapter");
  function esc(s) {
    return String(s).replace(/[&<>"]/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m]));
  }
  const safeUrl = (u) => (/^https:\/\//.test(u || "") ? u : "");

  function sceneButton(kind, id) {
    const sc = C.battles[id];
    if (!sc) return "";
    const isBattle = kind === "battle";
    return `<button class="watch ${isBattle ? "" : "moment"}" data-scene="${esc(id)}">
      <span class="watch-icon" aria-hidden="true">${isBattle ? "⚔" : "✠"}</span>
      <span><strong>${isBattle ? "Watch the battle" : "See the moment"}</strong><small>${esc(sc.title)}</small></span></button>`;
  }

  function renderChapter() {
    const ch = chapters[current];
    const figs = (ch.figures || []).filter((id) => C.figures[id]).map((id) => [id, C.figures[id]]);
    chapterEl.innerHTML = `
      <div class="eyebrow">${esc(ch.date)}</div>
      <h2>${esc(ch.title)}</h2>
      <div class="place">${esc(ch.place)}</div>
      ${ch.body.map((p) => `<p>${esc(p)}</p>`).join("")}
      ${ch.battle || ch.moment ? `<div class="scenes">${ch.moment ? sceneButton("moment", ch.moment) : ""}${ch.battle ? sceneButton("battle", ch.battle) : ""}</div>` : ""}
      ${(ch.quotes || []).map((q) => `<blockquote><p>“${esc(q.text)}”</p><cite>${safeUrl(q.url) ? `<a href="${esc(q.url)}" target="_blank" rel="noopener">${esc(q.source)}</a>` : esc(q.source)}</cite></blockquote>`).join("")}
      ${ch.myth ? `<aside class="myth"><div class="myth-row"><span class="tag">Myth</span><p>${esc(ch.myth.myth)}</p></div><div class="myth-row"><span class="tag fact">The sources</span><p>${esc(ch.myth.fact)}</p></div></aside>` : ""}
      ${ch.today ? `<p class="today"><span class="tag plain">Today</span> ${esc(ch.today)}</p>` : ""}
      ${figs.length ? `<section class="people"><h3>KEY FIGURES</h3><div class="chips">${figs
        .map(([id, f]) => `<button class="chip" data-fig="${esc(id)}"><canvas class="mini" data-portrait="${esc(id)}" width="56" height="56" aria-hidden="true"></canvas>${esc(f.name)}</button>`)
        .join("")}</div></section>` : ""}
      ${(ch.sources || []).length ? `<section class="sources"><h3>READ THE SOURCES</h3><ul>${ch.sources
        .map((s) => `<li>${safeUrl(s.url) ? `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.title)}</a>` : esc(s.title)}</li>`).join("")}</ul></section>` : ""}
    `;
    paintPortraits(chapterEl);
    chapterEl.scrollTop = 0;
    el("count").textContent = `Chapter ${current + 1} of ${chapters.length}`;
    el("prev").disabled = current === 0 && MODULES.indexOf(C) === 0;
    const last = current === chapters.length - 1;
    const nextModule = MODULES[MODULES.indexOf(C) + 1];
    el("next").disabled = last && !nextModule;
    el("next-label").textContent = last && nextModule ? "Next crusade" : "Next";
    document.querySelectorAll(".tick").forEach((t, i) => {
      t.classList.toggle("on", i === current);
      t.classList.toggle("past", i < current);
      t.setAttribute("aria-current", i === current ? "step" : "false");
    });
    el("fill").style.width = tickPct(current) + "%";
    renderLegend();
    renderCinemaCaption();
  }

  function paintPortraits(root) {
    root.querySelectorAll("canvas[data-portrait]").forEach((cv) => {
      const f = C.figures[cv.dataset.portrait] || findFigure(cv.dataset.portrait);
      const c2 = cv.getContext("2d");
      const r = cv.width / 2;
      c2.clearRect(0, 0, cv.width, cv.height);
      Sprites.portrait(c2, (f && f.portrait) || { kind: "knight" }, r, r, r - 1);
    });
  }
  function findFigure(id) {
    for (const m of MODULES) if (m.figures[id]) return m.figures[id];
    return null;
  }

  function renderLegend() {
    const ids = Object.keys(routeStates[current] || {}).filter((id) => C.routes[id] && !C.routes[id].noLegend && (!C.routes[id].until || chapterIndex[C.routes[id].until] >= current || true));
    const seen = new Set();
    const routes = ids.filter((id) => { const l = C.routes[id].label; if (seen.has(l)) return false; seen.add(l); return true; })
      .map((id) => `<span><i style="background:${colors[id] || "var(--vermilion)"}"></i>${esc(C.routes[id].label)}</span>`).join("");
    const snap = territoryAt(chapters[current].mapYear || chapters[current].year);
    // Only list powers whose lands are in view at this chapter's camera.
    const ch = chapters[current];
    const view = d3.geoOrthographic().clipAngle(90).scale(base * ch.view.k).translate([W / 2, H / 2]).rotate([-ch.view.at[0], -ch.view.at[1], 0]);
    const inView = (a) => {
      if (d3.geoDistance(a.center, ch.view.at) > 1.4) return false;
      const p = view(a.center);
      return p && p[0] > -W * 0.1 && p[0] < W * 1.1 && p[1] > -H * 0.1 && p[1] < H * 1.1;
    };
    const powers = snap ? [...new Set(snap.areas.filter(inView).map((a) => a.power))].filter((p) => GEO.powers[p]) : [];
    const lands = powers.map((p) => `<span><i class="sq" style="background:${rgba(GEO.powers[p].color, 0.55)};border-color:${GEO.powers[p].color}"></i>${esc(GEO.powers[p].name)}</span>`).join("");
    el("legend").innerHTML = `${lands ? `<div class="lg-row">${lands}</div>` : ""}${routes ? `<div class="lg-row">${routes}</div>` : ""}`;
  }

  chapterEl.addEventListener("click", (e) => {
    const b = e.target.closest("[data-fig]");
    if (b) openFigure(b.dataset.fig);
    const s = e.target.closest("[data-scene]");
    if (s) openScene(s.dataset.scene, false);
  });

  function openScene(id, auto) {
    const sc = C.battles[id];
    if (!sc) { scheduleAutoplay(); return; }
    const resume = playing && cinema;
    if (!resume) setPlaying(false);
    clearTimeout(autoTimer);
    paused = true;
    Battle.open(sc, () => {
      paused = false; kick();
      if (resume && auto) {
        const ch = chapters[current];
        // A chapter can have both a moment and a battle: play the battle after the moment.
        if (ch.moment === id && ch.battle) { autoTimer = setTimeout(() => openScene(ch.battle, true), 800); return; }
        scheduleAutoplay(3000);
      } else {
        const btn = chapterEl.querySelector(`[data-scene="${id}"]`);
        btn && btn.focus();
      }
    }, { autoClose: auto && resume });
  }

  // ---------- timeline ----------
  const tickPct = (i) => 1.5 + (97 * i) / Math.max(1, chapters.length - 1);
  function buildTimeline() {
    const tl = el("timeline");
    tl.querySelectorAll(".tick, .year").forEach((n) => n.remove());
    let lastYear = null;
    chapters.forEach((ch, i) => {
      const b = document.createElement("button");
      b.className = "tick";
      b.style.left = tickPct(i) + "%";
      b.title = `${ch.date}: ${ch.title}`;
      b.setAttribute("aria-label", `${ch.date}: ${ch.title}`);
      b.addEventListener("click", () => go(i));
      tl.appendChild(b);
      if (ch.year !== lastYear) {
        const y = document.createElement("span");
        y.dataset.i = i;
        y.className = "year";
        y.style.left = tickPct(i) + "%";
        y.textContent = ch.year;
        tl.appendChild(y);
        lastYear = ch.year;
      }
    });
    spaceYears();
  }
  function spaceYears() {
    const w = el("timeline").clientWidth;
    let last = 1e9;
    [...document.querySelectorAll(".year")].reverse().forEach((y) => {
      const x = (tickPct(+y.dataset.i) / 100) * w;
      y.hidden = last - x < 44;
      if (!y.hidden) last = x;
    });
  }
  new ResizeObserver(spaceYears).observe(el("timeline"));

  // ---------- crusade picker ----------
  const picker = el("picker");
  el("crusade-btn").addEventListener("click", () => {
    el("picker-list").innerHTML = MODULES.map((m, i) => `
      <button class="pick ${m === C ? "on" : ""}" data-mod="${i}">
        <span class="pick-years">${esc(m.years)}</span>
        <span class="pick-name">${esc(m.name)}</span>
        ${m.blurb ? `<span class="pick-blurb">${esc(m.blurb)}</span>` : ""}
      </button>`).join("");
    picker.showModal ? picker.showModal() : picker.setAttribute("open", "");
  });
  picker.addEventListener("click", (e) => {
    if (e.target === picker || e.target.id === "picker-close") return picker.close();
    const b = e.target.closest("[data-mod]");
    if (b) { picker.close(); switchModule(MODULES[+b.dataset.mod], 0); }
  });
  function switchModule(m, i) {
    if (m !== C) { useModule(m); renderLegend(); }
    go(i);
  }

  // ---------- figures ----------
  const dlg = el("figure");
  function openFigure(id) {
    const f = C.figures[id];
    const appears = chapters.map((c, i) => [c, i]).filter(([c]) => (c.figures || []).includes(id));
    el("figure-body").innerHTML = `
      <canvas class="big-portrait" data-portrait="${esc(id)}" width="176" height="176" aria-hidden="true"></canvas>
      <h2>${esc(f.name)}</h2>
      <div class="role">${esc(f.role)}</div>
      <div class="life">${esc(f.life)}</div>
      ${f.bio.map((p) => `<p>${esc(p)}</p>`).join("")}
      <div class="people"><h3>APPEARS IN</h3>
        <div class="appears">${appears.map(([c, i]) => `<button data-go="${i}">${esc(c.title)}</button>`).join("<span aria-hidden='true'>·</span>")}</div>
      </div>
      <button class="btn close" id="figure-close">Close</button>`;
    paintPortraits(el("figure-body"));
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
  }
  dlg.addEventListener("click", (e) => {
    if (e.target === dlg || e.target.id === "figure-close") return dlg.close();
    const g = e.target.closest("[data-go]");
    if (g) { dlg.close(); go(+g.dataset.go); }
  });

  // ---------- navigation ----------
  function go(i) {
    clearTimeout(autoTimer);
    if (i >= chapters.length) {
      const next = MODULES[MODULES.indexOf(C) + 1];
      if (next) return switchModule(next, 0);
      i = chapters.length - 1;
    }
    if (i < 0) {
      const prev = MODULES[MODULES.indexOf(C) - 1];
      if (prev) { useModule(prev); return go(prev.chapters.length - 1); }
      i = 0;
    }
    current = i;
    renderChapter();
    travel(i);
  }

  let playing = false, autoTimer = 0;
  const playBtn = el("play");
  function setPlaying(v) {
    playing = v;
    playBtn.setAttribute("aria-label", v ? "Pause" : "Play");
    el("play-icon").innerHTML = v ? '<path d="M4 2.5h3v11H4zM9 2.5h3v11H9z"/>' : '<path d="M4 2.5v11L13 8z"/>';
    el("cine-play").setAttribute("aria-label", v ? "Pause" : "Play");
    el("cine-play").innerHTML = el("play").innerHTML;
    clearTimeout(autoTimer);
    if (v && !anim) {
      const ch = chapters[current];
      if (cinema && (ch.battle || ch.moment)) autoTimer = setTimeout(() => openScene(ch.moment || ch.battle, true), 1800);
      else scheduleAutoplay(1500);
    }
  }
  function scheduleAutoplay(delay) {
    clearTimeout(autoTimer);
    if (!playing) return;
    const lastOfAll = current >= chapters.length - 1 && !MODULES[MODULES.indexOf(C) + 1];
    if (lastOfAll) return setPlaying(false);
    const ch = chapters[current];
    const words = (cinema ? (ch.caption || ch.body[0]) : ch.body.join(" ")).split(/\s+/).length;
    autoTimer = setTimeout(() => go(current + 1), delay != null ? delay : Math.max(cinema ? 6500 : 7000, words * (cinema ? 300 : 230)));
  }
  playBtn.addEventListener("click", () => setPlaying(!playing));
  el("prev").addEventListener("click", () => go(current - 1));
  el("next").addEventListener("click", () => go(current + 1));
  document.addEventListener("keydown", (e) => {
    if (dlg.open || picker.open || document.body.classList.contains("battle-open") || e.target.closest("input, textarea")) return;
    if (e.key === "ArrowRight") go(current + 1);
    if (e.key === "ArrowLeft") go(current - 1);
    if (e.key === "Escape" && cinema) setCinema(false);
  });

  // ---------- cinema mode ----------
  let cinema = false;
  function setCinema(v) {
    cinema = v;
    document.body.classList.toggle("cinema", v);
    el("cinema-btn").setAttribute("aria-pressed", v ? "true" : "false");
    renderCinemaCaption();
    setPlaying(v);
    requestAnimationFrame(() => resize());
  }
  function renderCinemaCaption() {
    const ch = chapters[current];
    el("cine-date").textContent = ch.date;
    el("cine-title").textContent = ch.title;
    el("cine-text").textContent = ch.caption || ch.body[0];
  }
  el("cinema-btn").addEventListener("click", () => setCinema(!cinema));
  el("cine-exit").addEventListener("click", () => setCinema(false));
  el("cine-play").addEventListener("click", () => setPlaying(!playing));
  el("cine-prev").addEventListener("click", () => go(current - 1));
  el("cine-next").addEventListener("click", () => go(current + 1));

  // ---------- free exploration ----------
  const recenterBtn = el("recenter");
  let userMoved = false;
  recenterBtn.addEventListener("click", () => travel(current));
  function markMoved() {
    if (anim) { mapYearNow = chapters[current].mapYear || chapters[current].year; setDays(chapters[current], 1); }
    anim = null; marching = false;
    if (!userMoved) { userMoved = true; recenterBtn.hidden = false; routeNow = { ...routeStates[current] }; }
  }

  const pointers = new Map();
  let downAt = null, pinchDist = 0, pinchK = 1;
  canvas.addEventListener("pointerdown", (e) => {
    canvas.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, [e.offsetX, e.offsetY]);
    downAt = { x: e.offsetX, y: e.offsetY, moved: false };
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      pinchDist = Math.hypot(a[0] - b[0], a[1] - b[1]); pinchK = cam.k;
    }
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!pointers.has(e.pointerId)) return;
    const prev = pointers.get(e.pointerId);
    pointers.set(e.pointerId, [e.offsetX, e.offsetY]);
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      const d = Math.hypot(a[0] - b[0], a[1] - b[1]);
      if (pinchDist > 0) { markMoved(); cam.k = clampK(pinchK * d / pinchDist); kick(); }
      return;
    }
    const dx = e.offsetX - prev[0], dy = e.offsetY - prev[1];
    if (downAt && Math.hypot(e.offsetX - downAt.x, e.offsetY - downAt.y) > 4) downAt.moved = true;
    if (!downAt || !downAt.moved) return;
    canvas.classList.add("dragging");
    markMoved();
    const degPerPx = 180 / Math.PI / (base * cam.k);
    cam.lon -= dx * degPerPx;
    cam.lat = Math.max(-80, Math.min(80, cam.lat + dy * degPerPx));
    kick();
  });
  const endPointer = (e) => {
    pointers.delete(e.pointerId);
    canvas.classList.remove("dragging");
    if (e.type === "pointerup" && downAt && !downAt.moved && pointers.size === 0) tapAt(e.offsetX, e.offsetY);
    if (pointers.size === 0) downAt = null;
  };
  canvas.addEventListener("pointerup", endPointer);
  canvas.addEventListener("pointercancel", endPointer);
  canvas.addEventListener("wheel", (e) => {
    e.preventDefault();
    markMoved();
    cam.k = clampK(cam.k * Math.exp(-e.deltaY * 0.0015));
    kick();
  }, { passive: false });
  const clampK = (k) => Math.max(0.85, Math.min(16, k));

  function tapAt(x, y) {
    let best = -1, bestD = 22;
    chapters.forEach((ch, i) => {
      if (i > current || !visible(ch.at)) return;
      const [px, py] = projection(ch.at);
      const d = Math.hypot(px - x, py - y);
      if (d < bestD) { bestD = d; best = i; }
    });
    if (best >= 0 && best !== current) go(best);
  }

  // ---------- boot ----------
  function findChapter(id) {
    for (const m of MODULES) {
      const i = m.chapters.findIndex((c) => c.id === id);
      if (i >= 0) return [m, i];
    }
    const m = MODULES.find((x) => x.id === id);
    return m ? [m, 0] : null;
  }
  function start() {
    readColors();
    const hit = findChapter(location.hash.slice(1));
    useModule(hit ? hit[0] : MODULES[0]);
    const ch0 = chapters[hit ? hit[1] : 0];
    cam.lon = ch0.view.at[0]; cam.lat = ch0.view.at[1];
    mapYearNow = ch0.mapYear || ch0.year;
    new ResizeObserver(resize).observe(stage);
    resize();
    go(hit ? hit[1] : 0);
  }
  window.addEventListener("hashchange", () => {
    const hit = findChapter(location.hash.slice(1));
    if (hit) switchModule(hit[0], hit[1]);
  });
  const reTheme = () => { readColors(); renderLegend(); draw(); };
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", reTheme);
  new MutationObserver(reTheme).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { baseKey = ""; draw(); paintPortraits(chapterEl); });
  start();
})();
