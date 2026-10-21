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
    draw();
  }

  function applyCam() {
    // Subtitles sit at the bottom of the screen, so the view centres a little high.
    projection.scale(base * cam.k).translate([W / 2, H * 0.47]).rotate([-cam.lon, -cam.lat, 0]);
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
    const key = [cam.lon, cam.lat, cam.k, W, H, colors.sea, snap ? snap.year : 0].join("|");
    if (key !== baseKey) { drawBase(); baseKey = key; }
    ctx.clearRect(0, 0, W, H);
    const now = performance.now() / 1000;
    // Between chapters (intro, part cards) nothing on the map is singled out.
    const cur = focusOn ? chapters[current] : { at: [999, 999] };
    const shownUpTo = focusOn ? current : -1;
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
    for (let i = 0; i <= shownUpTo; i++) {
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
    if (cam.k >= 7) {
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
  let focusOn = false;
  function placePulse() {
    if (!focusOn) { pulse.hidden = true; return; }
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
    if (!n) { dayEl.classList.remove("show"); return; }
    dayEl.classList.add("show");
    const d = Math.max(1, Math.round(n * f));
    dayEl.innerHTML = `<b>Day ${d.toLocaleString("en")}</b>${esc(ch.days.label || "")}`;
  }

  // ======================================================================
  // The film: a director that plays the story as a narrated sequence.
  // Everything is timed by the audio clock, so pausing the audio freezes the whole film.
  // ======================================================================
  const N = window.NARRATION || {};
  function esc(s) {
    return String(s).replace(/[&<>"]/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m]));
  }

  // ---------- clock ----------
  let vClock = 0, vLast = performance.now(), vRunning = false;
  function clock() {
    if (Sound.ctx) return Sound.now();
    const n = performance.now();
    if (vRunning) vClock += (n - vLast) / 1000;
    vLast = n;
    return vClock;
  }

  // ---------- animation ----------
  let anim = null, marching = false, idleSpin = true, sceneOpen = false;
  function loop() {
    requestAnimationFrame(loop);
    if (document.hidden) return;
    const ms = clock() * 1000;
    if (idleSpin) { cam.lon += 0.03; }
    if (anim) {
      const t = Math.min(1, (ms - anim.start) / anim.dur);
      anim.step(t);
      if (t >= 1) { anim = null; marching = false; drift = { k: cam.k, at: ms }; }
    } else if (drift && playing) {
      // a slow push-in while the narrator speaks
      cam.k = drift.k * (1 + Math.min(0.12, (ms - drift.at) / 600000));
    }
    updateTrack();
    if (!sceneOpen) {
      Sound.setAmbience({ wind: 0.6, sea: 0, fire: 0, crowd: 0, gallop: 0, march: marching ? 0.8 : 0, battle: 0 });
      draw();
    }
    Sound.tick();
  }
  let drift = null;

  function travel(index) {
    const ch = chapters[index];
    const from = { ...cam };
    const to = { lon: ch.view.at[0], lat: ch.view.at[1], k: ch.view.k };
    const fromRoutes = { ...routeNow };
    const toRoutes = routeStates[index];
    const moving = new Set(Object.keys(ch.routes || {}));
    activeRoutes = moving;
    drift = null;
    const targetYear = ch.mapYear || ch.year;
    const prevCh = chapters[index - 1];
    const dayStart = prevCh && prevCh.days && ch.days && prevCh.days.from === ch.days.from && daysOf(ch) ? daysOf(prevCh) / daysOf(ch) : 0;
    if (reduceMotion) {
      Object.assign(cam, to); routeNow = { ...toRoutes }; mapYearNow = targetYear; setDays(ch, 1);
      drift = { k: cam.k, at: clock() * 1000 };
      return;
    }
    const interp = d3.geoInterpolate([from.lon, from.lat], [to.lon, to.lat]);
    const dist = d3.geoDistance([from.lon, from.lat], [to.lon, to.lat]);
    const flyDur = 1600 + Math.min(2400, dist * 5000) + Math.abs(Math.log(to.k / from.k)) * 350;
    const hasRoutes = moving.size > 0;
    // Armies march for most of the narration, not just a moment.
    const marchDur = hasRoutes ? 9000 : 0;
    const dur = flyDur + marchDur + (ch.days ? 1500 : 0);
    const flyEnd = flyDur / dur;
    const lk0 = Math.log(from.k), lk1 = Math.log(to.k);
    const lkMid = Math.min(lk0, lk1, Math.log(Math.max(1.1, Math.min(from.k, to.k) / (1 + dist * 6))));
    setDays(ch, dayStart);
    anim = {
      start: clock() * 1000, dur,
      step(t) {
        const ft = d3.easeCubicInOut(Math.min(1, t / flyEnd));
        const [lon, lat] = interp(ft);
        cam.lon = lon; cam.lat = lat;
        const a = (1 - ft) * (1 - ft), b = 2 * ft * (1 - ft), c = ft * ft;
        cam.k = Math.exp(a * lk0 + b * lkMid + c * lk1);
        if (ft > 0.5) mapYearNow = targetYear;
        const rt = d3.easeSinInOut(Math.max(0, Math.min(1, (t - flyEnd * 0.8) / (1 - flyEnd * 0.8))));
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
        if (ch.days) setDays(ch, dayStart + (1 - dayStart) * d3.easeCubicOut(Math.max(0, (t - flyEnd * 0.6) / (1 - flyEnd * 0.6))));
      },
    };
  }

  function flyOverview(at, k, ms = 4000) {
    const from = { ...cam };
    const interp = d3.geoInterpolate([from.lon, from.lat], at);
    drift = null;
    anim = {
      start: clock() * 1000, dur: reduceMotion ? 1 : ms,
      step(t) {
        const e = d3.easeCubicInOut(t);
        [cam.lon, cam.lat] = interp(e);
        cam.k = Math.exp(Math.log(from.k) + (Math.log(k) - Math.log(from.k)) * e);
      },
    };
  }

  // ---------- overlays ----------
  const subsEl = el("subs");
  const show = (id, on) => el(id).classList.toggle("show", !!on);
  function setSub(text) { if (subsEl.textContent !== text) subsEl.textContent = text; }
  function clearOverlays() {
    ["titlecard", "quote", "figure", "partcard", "days"].forEach((id) => show(id, false));
    setSub("");
  }
  function showTitle(ch) {
    el("tc-date").textContent = ch.date;
    el("tc-title").textContent = ch.title;
    show("titlecard", true);
  }
  function showFigure(id) {
    const f = C.figures[id];
    if (!f) return show("figure", false);
    el("fig-name").textContent = f.name;
    el("fig-role").textContent = f.role || "";
    const cv = el("fig-canvas"), c2 = cv.getContext("2d");
    c2.clearRect(0, 0, cv.width, cv.height);
    Sprites.portrait(c2, f.portrait || { kind: "knight" }, cv.width / 2, cv.height / 2, cv.width / 2 - 2);
    show("figure", true);
  }
  function showQuote(text, source) {
    el("q-text").textContent = text;
    el("q-cite").textContent = source || "";
    show("quote", true);
  }

  // ---------- narration ----------
  let track = null;
  function narrate(id, onCue, lead = 0.3) {
    const n = N[id];
    const my = token;
    return new Promise(async (resolve) => {
      let buf = null;
      if (n && Sound.ctx) buf = await Sound.load(n.src);
      if (my !== token) return resolve(false);
      const t0 = buf ? Sound.playVoice(buf, lead) : clock() + lead;
      track = { t0, dur: n ? n.dur : 5, cues: n ? n.cues : [], onCue, resolve, idx: -1 };
    });
  }
  function updateTrack() {
    if (!track) return;
    const t = clock() - track.t0;
    let i = track.idx;
    while (i + 1 < track.cues.length && track.cues[i + 1].t <= t) i++;
    if (i !== track.idx) { track.idx = i; track.onCue && track.onCue(track.cues[i], i); }
    const c = track.cues[track.idx];
    if (c && t > c.t + c.d + 0.3 && c.kind !== "quote") setSub("");
    if (t >= track.dur) { const r = track.resolve; track = null; r(true); }
  }

  // ---------- the sequence ----------
  const SEQ = [{ type: "intro" }];
  MODULES.forEach((m, mi) => {
    SEQ.push({ type: "part", m, n: mi });
    m.chapters.forEach((ch, i) => SEQ.push({ type: "chapter", m, i }));
  });
  SEQ.push({ type: "outro" });
  const PART = ["Part One", "Part Two", "Part Three", "Part Four", "Part Five"];

  let step = -1, token = 0, playing = false;
  const introduced = new Set();
  const moodOf = (ch) => (ch.fight || ch.battle ? "dark" : ch.moment ? "holy" : ch.routes ? "march" : "calm");

  function goStep(k) {
    k = Math.max(0, Math.min(SEQ.length - 1, k));
    const prev = step;
    const my = ++token;
    step = k;
    track = null;
    Sound.stopVoice();
    if (sceneOpen) Battle.close();
    clearOverlays();
    updateProgress();
    if (!playing) setPlaying(true);
    const s = SEQ[k];
    if (s.m && s.m !== C) { useModule(s.m); introduced.clear(); }
    focusOn = false;
    if (s.type === "intro") return playIntro(my);
    if (s.type === "outro") return playOutro(my);
    if (s.type === "part") return playPart(s, my);
    return playChapter(s, my, prev === k - 1);
  }
  const next = () => goStep(step + 1);

  async function playIntro(my) {
    useModule(MODULES[0]);
    routeNow = {}; mapYearNow = 1090;
    flyOverview([24, 38], 1.5, 9000);
    Sound.setMood("title");
    Sound.play("bell");
    await narrate("intro", (c) => setSub(c.sub), 1.2);
    if (my === token) next();
  }

  async function playPart(s, my) {
    routeNow = {};
    introduced.clear();
    const first = s.m.chapters[0];
    mapYearNow = first.mapYear || first.year;
    flyOverview(first.view.at, Math.min(2.2, first.view.k), 5000);
    el("pc-eyebrow").textContent = PART[s.n] || "";
    el("pc-title").textContent = s.m.name;
    el("pc-years").textContent = s.m.years;
    show("partcard", true);
    Sound.setMood("title");
    Sound.play("boom");
    setTimeout(() => Sound.play("bell"), 700);
    await narrate(`part:${s.m.id}`, (c) => setSub(c.kind === "line" ? c.sub : ""), 1.0);
    if (my !== token) return;
    show("partcard", false);
    next();
  }

  async function playChapter(s, my, sequential) {
    current = s.i;
    focusOn = true;
    const ch = chapters[current];
    if (!sequential) {
      // Jumped here: put the armies and borders where the previous chapter left them.
      routeNow = { ...(routeStates[current - 1] || {}) };
      const p = chapters[current - 1];
      mapYearNow = p ? p.mapYear || p.year : ch.mapYear || ch.year;
    }
    travel(current);
    Sound.play("boom");
    Sound.play("whoosh");
    Sound.setMood(moodOf(ch));
    showTitle(ch);
    const figs = (ch.figures || []).filter((id) => C.figures[id] && !introduced.has(id)).slice(0, 3);
    let line = 0;
    await narrate(`ch:${C.id}:${ch.id}`, (c) => {
      if (c.kind === "title") return;
      show("titlecard", false);
      if (c.kind === "quote") {
        show("figure", false);
        setSub("");
        showQuote(c.sub, c.source);
        return;
      }
      show("quote", false);
      setSub(c.sub);
      // introduce new key figures one per sentence, early in the chapter
      const f = figs[line];
      if (f) { introduced.add(f); showFigure(f); } else show("figure", false);
      line++;
    });
    if (my !== token) return;
    show("quote", false); show("figure", false); show("days", false);
    for (const id of [ch.moment, ch.battle].filter(Boolean)) {
      await playScene(id, my);
      if (my !== token) return;
    }
    next();
  }

  function playScene(id, my) {
    return new Promise(async (resolve) => {
      const sc = C.battles[id];
      if (!sc) return resolve();
      const n = N[`sc:${C.id}:${id}`];
      const buf = n && Sound.ctx ? await Sound.load(n.src) : null;
      if (my !== token) return resolve();
      const isBattle = id === chapters[current].battle;
      Sound.setMood(isBattle ? "battle" : "holy");
      Sound.play(isBattle ? "boom" : "bell");
      setSub("");
      const t0 = buf ? Sound.playVoice(buf, 0.9) : clock() + 0.9;
      const dur = n ? n.dur : sc.phases.length * 6 + 2;
      const cues = sc.phases.map((_, i) => {
        const c = n && n.cues.find((q) => q.kind === "phase" && q.phase === i);
        return c ? c.t : 2 + i * 6;
      });
      sceneOpen = true;
      Battle.open(sc, () => { sceneOpen = false; resolve(); }, {
        director: {
          time: () => clock() - t0, cues, dur,
          sound: (name) => Sound.play(name),
          ambience: (a) => Sound.setAmbience(a),
        },
      });
    });
  }

  async function playOutro(my) {
    useModule(MODULES[MODULES.length - 1]);
    flyOverview([30, 36], 1.6, 8000);
    Sound.setMood("title");
    await narrate("outro", (c) => setSub(c.sub), 0.8);
    if (my !== token) return;
    Sound.play("bell");
    setSub("");
    setPlaying(false);
    el("begin").lastChild.textContent = " Watch again";
    el("opening").classList.remove("gone");
    idleSpin = true;
  }

  // ---------- controls ----------
  function setPlaying(v) {
    playing = v;
    if (v) { Sound.resume(); vRunning = true; } else { Sound.suspend(); vRunning = false; }
    el("h-play").setAttribute("aria-label", v ? "Pause" : "Play");
    el("h-play-icon").innerHTML = v ? '<path d="M4 2.5h3v11H4zM9 2.5h3v11H9z"/>' : '<path d="M4 2.5v11L13 8z"/>';
    document.body.classList.toggle("paused", !v);
    if (!v) showHud(true); else pokeHud();
  }
  let hudTimer = 0;
  function showHud(stay) {
    document.body.classList.add("hud-on");
    clearTimeout(hudTimer);
    if (!stay) hudTimer = setTimeout(() => { if (playing) document.body.classList.remove("hud-on"); }, 3200);
  }
  const pokeHud = () => showHud(false);
  function updateProgress() {
    el("progress").style.width = (100 * Math.max(0, step)) / (SEQ.length - 1) + "%";
    const s = SEQ[step];
    if (!s) return;
    let where = "";
    if (s.type === "chapter") where = `${PART[MODULES.indexOf(s.m)]}<span class="wm"> · ${esc(s.m.name)}</span> · Chapter ${s.i + 1} of ${s.m.chapters.length}`;
    else if (s.type === "part") where = `${PART[s.n]} · ${esc(s.m.name)}`;
    el("where").innerHTML = where;
  }

  el("h-play").addEventListener("click", (e) => { e.stopPropagation(); setPlaying(!playing); });
  el("h-prev").addEventListener("click", (e) => { e.stopPropagation(); goStep(step - 1); pokeHud(); });
  el("h-next").addEventListener("click", (e) => { e.stopPropagation(); goStep(step + 1); pokeHud(); });
  el("h-mute").addEventListener("click", (e) => {
    e.stopPropagation();
    Sound.setMuted(!Sound.muted);
    el("h-mute").classList.toggle("off", Sound.muted);
    el("h-mute").setAttribute("aria-label", Sound.muted ? "Unmute" : "Mute");
    pokeHud();
  });
  el("h-cc").addEventListener("click", (e) => {
    e.stopPropagation();
    const off = document.body.classList.toggle("nosubs");
    el("h-cc").classList.toggle("off", off);
    el("h-cc").setAttribute("aria-pressed", off ? "false" : "true");
    pokeHud();
  });
  // Tap anywhere to show the controls; tap again to hide them.
  el("stage").addEventListener("pointerdown", (e) => {
    if (e.target.closest(".hud, .opening, dialog")) return;
    if (e.pointerType !== "mouse" && document.body.classList.contains("hud-on") && playing) document.body.classList.remove("hud-on");
    else pokeHud();
  });
  window.addEventListener("pointermove", (e) => { if (e.pointerType === "mouse" && step >= 0) pokeHud(); });
  document.addEventListener("keydown", (e) => {
    if (toc.open || step < 0) return;
    if (e.key === " ") { e.preventDefault(); setPlaying(!playing); }
    if (e.key === "ArrowRight") goStep(step + 1);
    if (e.key === "ArrowLeft") goStep(step - 1);
    if (e.key === "m") el("h-mute").click();
    if (e.key === "c") el("h-cc").click();
  });

  // ---------- chapter list ----------
  const toc = el("toc");
  el("h-toc").addEventListener("click", (e) => {
    e.stopPropagation();
    el("toc-body").innerHTML = `<h2>Chapters</h2>${MODULES.map((m, mi) => `
      <section><h3>${esc(PART[mi])} · ${esc(m.name)}</h3><ol>${m.chapters.map((ch, i) => {
        const k = SEQ.findIndex((s) => s.m === m && s.i === i);
        return `<li><button data-step="${k}" class="${k === step ? "on" : ""}"><span class="d">${ch.year}</span>${esc(ch.title)}</button></li>`;
      }).join("")}</ol></section>`).join("")}
      <button class="close" id="toc-close">Close</button>`;
    toc.showModal ? toc.showModal() : toc.setAttribute("open", "");
    const on = toc.querySelector("button.on");
    on && on.scrollIntoView({ block: "center" });
  });
  toc.addEventListener("click", (e) => {
    if (e.target === toc || e.target.id === "toc-close") return toc.close();
    const b = e.target.closest("[data-step]");
    if (b) { toc.close(); goStep(+b.dataset.step); }
  });

  // ---------- opening ----------
  function begin(k) {
    Sound.init();
    Sound.resume();
    Sound.setMuted(false);
    vRunning = true;
    idleSpin = false;
    el("opening").classList.add("gone");
    goStep(k);
  }
  el("parts").innerHTML = MODULES.map((m, mi) => `<button data-part="${mi}">${esc(PART[mi])}: ${esc(m.name.replace(/^The /, ""))}</button>`).join("");
  el("parts").addEventListener("click", (e) => {
    const b = e.target.closest("[data-part]");
    if (b) begin(SEQ.findIndex((s) => s.type === "part" && s.n === +b.dataset.part));
  });
  // A link to a chapter (#clermont) starts the film there.
  const hashStep = () => {
    const id = location.hash.slice(1);
    const k = SEQ.findIndex((s) => s.type === "chapter" && s.m.chapters[s.i].id === id);
    return k >= 0 ? k : 0;
  };
  el("begin").addEventListener("click", () => begin(step >= SEQ.length - 1 ? 0 : hashStep()));

  // ---------- boot ----------
  function start() {
    readColors();
    useModule(MODULES[0]);
    cam.lon = 20; cam.lat = 36; cam.k = 1.25;
    mapYearNow = 1090;
    new ResizeObserver(resize).observe(stage);
    resize();
    requestAnimationFrame(loop);
  }
  const reTheme = () => { readColors(); draw(); };
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", reTheme);
  new MutationObserver(reTheme).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { baseKey = ""; });
  start();
})();
