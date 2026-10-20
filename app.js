(() => {
  const C = window.CRUSADE;
  const chapters = C.chapters;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
      const bearing = (i * 360) / 32;
      const pts = [];
      for (let d = 0; d <= 40; d += 2) pts.push(destination(ROSE, bearing, d));
      return pts;
    }),
  };
  function destination([lon, lat], bearingDeg, distDeg) {
    const r = Math.PI / 180, b = bearingDeg * r, d = distDeg * r, p1 = lat * r, l1 = lon * r;
    const p2 = Math.asin(Math.sin(p1) * Math.cos(d) + Math.cos(p1) * Math.sin(d) * Math.cos(b));
    const l2 = l1 + Math.atan2(Math.sin(b) * Math.sin(d) * Math.cos(p1), Math.cos(d) - Math.sin(p1) * Math.sin(p2));
    return [l2 / r, p2 / r];
  }

  // Cumulative route progress at the end of each chapter.
  const routeStates = [];
  {
    let s = {};
    for (const ch of chapters) {
      s = { ...s, ...(ch.routes || {}) };
      routeStates.push(s);
    }
  }
  const chapterIndex = Object.fromEntries(chapters.map((c, i) => [c.id, i]));

  // ---------- canvas ----------
  const stage = document.getElementById("stage");
  const canvas = document.getElementById("globe");     // overlay: routes, figures, labels
  const ctx = canvas.getContext("2d");
  const baseCanvas = document.getElementById("base"); // cached map: sea, land, lines
  const bctx = baseCanvas.getContext("2d");
  const projection = d3.geoOrthographic().clipAngle(90).precision(0.4);
  const path = d3.geoPath(projection, ctx);
  const bpath = d3.geoPath(projection, bctx);
  let baseKey = "";
  let W = 0, H = 0, base = 1;
  const cam = { lon: chapters[0].view.at[0], lat: chapters[0].view.at[1], k: 0.9 };
  let routeNow = {};       // current drawn progress per route
  let current = 0;
  let activeRoutes = new Set();

  let colors = {};
  function readColors() {
    const cs = getComputedStyle(document.documentElement);
    const v = (n) => cs.getPropertyValue(n).trim();
    colors = {
      sea: v("--sea"), seaDeep: v("--sea-deep"), land: v("--land"), coast: v("--coast"),
      rhumb: v("--rhumb"), ink: v("--ink"), soft: v("--ink-soft"), vellum: v("--vellum"),
      verm: v("--vermilion"), gold: v("--gold"), leaf: v("--leaf"), foe: v("--foe"),
    };
    for (const [id, r] of Object.entries(C.routes)) colors[id] = v(r.color);
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = stage.clientWidth; H = stage.clientHeight;
    for (const [cv, cx] of [[canvas, ctx], [baseCanvas, bctx]]) {
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    base = Math.min(W, H) * 0.46;
    baseKey = "";
    draw();
  }

  function applyCam() {
    projection.scale(base * cam.k).translate([W / 2, H / 2]).rotate([-cam.lon, -cam.lat, 0]);
  }

  const visible = (pt) => d3.geoDistance(pt, [cam.lon, cam.lat]) < 1.45;

  function partialLine(points, p) {
    const n = Math.min(Math.floor(p), points.length - 1);
    const coords = points.slice(0, n + 1);
    const f = p - n;
    if (f > 0 && n + 1 < points.length) coords.push(d3.geoInterpolate(points[n], points[n + 1])(f));
    return coords;
  }

  // Labels are placed in priority order; one that would overlap an earlier label is skipped.
  let boxes = [];
  function label(text, x, y, { font, color, align = "left", halo = true, spacing = 0 }) {
    ctx.font = font;
    if ("letterSpacing" in ctx) ctx.letterSpacing = spacing + "px";
    const w = ctx.measureText(text).width, h = parseFloat(font.match(/(\d+)px/)[1]);
    const x0 = align === "center" ? x - w / 2 : x;
    const box = [x0 - 3, y - h / 2 - 2, x0 + w + 3, y + h / 2 + 2];
    if (box[2] < 0 || box[0] > W || box[3] < 0 || box[1] > H) return false;
    if (boxes.some((b) => box[0] < b[2] && box[2] > b[0] && box[1] < b[3] && box[3] > b[1])) {
      if ("letterSpacing" in ctx) ctx.letterSpacing = "0px";
      return false;
    }
    boxes.push(box);
    ctx.textAlign = align;
    ctx.textBaseline = "middle";
    if (halo) {
      ctx.lineWidth = 3.5; ctx.lineJoin = "round"; ctx.strokeStyle = colors.land;
      ctx.strokeText(text, x, y);
    }
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
    if ("letterSpacing" in ctx) ctx.letterSpacing = "0px";
    return true;
  }

  function draw() {
    if (!W) return;
    applyCam();
    const key = [cam.lon, cam.lat, cam.k, W, H, colors.sea].join("|");
    if (key !== baseKey) { drawBase(); baseKey = key; }
    ctx.clearRect(0, 0, W, H);
    const now = performance.now() / 1000;

    // routes
    for (const [id, p] of Object.entries(routeNow)) {
      if (!(p > 0)) continue;
      const coords = partialLine(C.routes[id].points, p);
      const line = { type: "LineString", coordinates: coords };
      ctx.beginPath(); path(line);
      ctx.strokeStyle = colors.land; ctx.lineWidth = 5.5; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.stroke();
      ctx.beginPath(); path(line);
      ctx.strokeStyle = colors[id]; ctx.lineWidth = activeRoutes.has(id) ? 3 : 2;
      ctx.setLineDash(id === "peter" ? [5, 4] : []);
      ctx.stroke(); ctx.setLineDash([]);
    }

    const cur = chapters[current];
    const figS = Math.max(11, Math.min(26, 8 + cam.k * 1.4));

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
    const marks = [];
    const near = (a, b) => Math.abs(a[0] - b[0]) < 0.06 && Math.abs(a[1] - b[1]) < 0.06;
    for (const lm of C.landmarks) marks.push({ name: lm.name, at: lm.at, icon: lm.icon, pri: lm.major ? 1 : 3 });
    for (let i = 0; i <= current; i++) {
      const ch = chapters[i];
      if (i === 0 && current !== 0) continue;
      if (marks.some((m) => near(m.at, ch.at))) continue;
      if (!ch.fight && !/^[A-Z][a-z]+(,|$)/.test(ch.place)) continue;
      marks.push({ name: i === 0 ? "Manzikert" : ch.place.split(",")[0], at: ch.at, icon: ch.fight ? "battle" : null, pri: 2 });
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
      const showLabel = m.isCur || cam.k >= 3 || m.pri <= 1;
      if (showLabel) placeLabels.push({ name: m.name, x: x + m.lx, y: y - (m.lx > 6 ? iconU * 0.35 : 0), isCur: m.isCur, pri: m.pri });
    }

    // armies: marching columns of figures behind each leader
    const headLabels = [];
    for (const id of Object.keys(routeNow)) {
      const route = C.routes[id];
      const p = routeNow[id];
      if (!(p > 0)) continue;
      if (route.until && chapterIndex[route.until] < current) continue;
      const coords = partialLine(route.points, p);
      const head = coords[coords.length - 1];
      const here = d3.geoDistance(head, cur.at) < 0.05;
      if (!activeRoutes.has(id) && !here) continue;
      if (!visible(head)) continue;
      const marchingNow = marching && activeRoutes.has(id);
      drawColumn(id, coords, figS, now, marchingNow);
      const [x, y] = projection(head);
      headLabels.push({ text: route.label, x, y, color: colors[id] });
    }

    // labels, most important first
    boxes = [];
    placeLabels.sort((a, b) => a.pri - b.pri);
    for (const l of placeLabels.filter((l) => l.isCur)) placeLabel(l);
    for (const h of headLabels) {
      const f = { font: `700 12px "Alegreya Sans SC", sans-serif`, color: h.color, spacing: 0.5 };
      label(h.text, h.x + 12, h.y + 10, f) || label(h.text, h.x - 12, h.y + 10, { ...f, align: "right" }) || label(h.text, h.x + 14, h.y - figS * 2.1, f);
    }
    for (const l of placeLabels.filter((l) => !l.isCur)) placeLabel(l);
    // region names
    if (cam.k >= 1.8) {
      for (const reg of C.regions) {
        if (reg.from && chapterIndex[reg.from] > current) continue;
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


    placePulse();
  }

  function drawBase() {
    const r = base * cam.k, c = bctx;
    c.clearRect(0, 0, W, H);
    const [cx, cy] = [W / 2, H / 2];
    const g = c.createRadialGradient(cx - r * 0.3, cy - r * 0.35, r * 0.1, cx, cy, r);
    g.addColorStop(0, colors.sea); g.addColorStop(1, colors.seaDeep);
    c.beginPath(); bpath(sphere); c.fillStyle = g; c.fill();
    c.beginPath(); bpath(rhumbs); c.strokeStyle = colors.rhumb; c.lineWidth = 0.8; c.stroke();
    c.beginPath(); bpath(graticule); c.strokeStyle = colors.rhumb; c.lineWidth = 0.5; c.stroke();
    c.beginPath(); bpath(cam.k < 2.4 ? land110 : land50);
    c.fillStyle = colors.land; c.fill();
    c.strokeStyle = colors.coast; c.lineWidth = cam.k > 6 ? 1.2 : 0.8; c.stroke();
    c.beginPath(); bpath(sphere); c.strokeStyle = colors.coast; c.lineWidth = 1.2; c.stroke();
  }

  function placeLabel({ name, x, y, isCur }) {
    const f = { font: isCur ? `600 15px Alegreya, serif` : `14px Alegreya, serif`, color: isCur ? colors.verm : colors.ink };
    label(name, x + 8, y - 1, f) || label(name, x - 8, y - 1, { ...f, align: "right" });
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
    for (let i = 0; i < comp.length; i++) {
      let want = i * gap;
      while (seg < pts.length - 1) {
        const [ax, ay] = pts[seg], [bx, by] = pts[seg + 1];
        const L = Math.hypot(bx - ax, by - ay);
        if (along + L >= want) {
          const f = L ? (want - along) / L : 0;
          const dirx = ax - bx;
          const side = i === 0 ? 0 : (i % 2 ? 1 : -1) * s * 0.22;
          const nx = L ? -(ay - by) / L : 0, ny = L ? (ax - bx) / L : 0;
          figs.push({ x: ax + (bx - ax) * f + nx * side, y: ay + (by - ay) * f + ny * side, facing: dirx >= 0 ? 1 : -1, kind: comp[i], i });
          break;
        }
        along += L; seg++;
      }
      if (seg >= pts.length - 1 && i > 0) break;
      if (pts.length === 1) { figs.push({ x: pts[0][0], y: pts[0][1], facing: 1, kind: comp[0], i: 0 }); break; }
    }
    figs.sort((a, b) => a.y - b.y).forEach((f) => {
      Sprites.figure(ctx, f.kind, f.x, f.y, f.kind === "leader" ? s * 1.15 : s, {
        facing: f.facing, t: now * 8 + f.i * 1.7, gait: moving && !reduceMotion ? 1 : 0, seed: f.i,
        color: colors[id], shield: f.i % 3 === 1 ? colors.gold : undefined,
      });
    });
  }

  const pulse = document.getElementById("pulse");
  function placePulse() {
    const at = chapters[current].at;
    if (!visible(at)) { pulse.hidden = true; return; }
    const [x, y] = projection(at);
    pulse.hidden = false;
    pulse.style.left = x + "px"; pulse.style.top = y + "px";
  }

  // ---------- animation ----------
  let anim = null;
  let raf = 0;
  let marching = false;
  let paused = false; // while a battle scene is open
  function loop(now) {
    raf = 0;
    if (paused || document.hidden) return;
    if (anim) {
      const t = Math.min(1, (now - anim.start) / anim.dur);
      anim.step(t);
      if (t >= 1) { const done = anim.done; anim = null; marching = false; done && done(); }
    }
    draw();
    // Keep animating so banners wave and figures stay alive.
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

    if (reduceMotion) {
      Object.assign(cam, to); routeNow = { ...toRoutes }; kick(); return;
    }
    const interp = d3.geoInterpolate([from.lon, from.lat], [to.lon, to.lat]);
    const dist = d3.geoDistance([from.lon, from.lat], [to.lon, to.lat]);
    const flyDur = 900 + Math.min(1600, dist * 4000) + Math.abs(Math.log(to.k / from.k)) * 250;
    const hasRoutes = moving.size > 0;
    const routeDur = hasRoutes ? 3200 : 0;
    const dur = flyDur + routeDur * 0.85;
    const flyEnd = flyDur / dur;
    // On long hops, pull back first so the viewer sees where we are going.
    const lk0 = Math.log(from.k), lk1 = Math.log(to.k);
    const lkMid = Math.min(lk0, lk1, Math.log(Math.max(1.1, Math.min(from.k, to.k) / (1 + dist * 6))));

    anim = {
      start: performance.now(), dur,
      step(t) {
        const ft = d3.easeCubicInOut(Math.min(1, t / flyEnd));
        const [lon, lat] = interp(ft);
        cam.lon = lon; cam.lat = lat;
        // quadratic bezier in log-zoom through lkMid
        const a = (1 - ft) * (1 - ft), b = 2 * ft * (1 - ft), c = ft * ft;
        cam.k = Math.exp(a * lk0 + b * lkMid + c * lk1);
        if (hasRoutes) {
          const rt = d3.easeSinInOut(Math.max(0, Math.min(1, (t - flyEnd * 0.6) / (1 - flyEnd * 0.6))));
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
      },
      done: () => scheduleAutoplay(),
    };
    kick();
  }

  // ---------- chronicle panel ----------
  const el = (id) => document.getElementById(id);
  const chapterEl = el("chapter");
  const initials = (name) => name.replace(/^(Pope|Bishop) /, "").split(/\s+/)[0][0];

  function esc(s) {
    return String(s).replace(/[&<>"]/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m]));
  }

  function renderChapter() {
    const ch = chapters[current];
    const figs = (ch.figures || []).map((id) => [id, C.figures[id]]);
    chapterEl.innerHTML = `
      <div class="eyebrow">${esc(ch.date)}</div>
      <h2>${esc(ch.title)}</h2>
      <div class="place">${esc(ch.place)}</div>
      ${ch.body.map((p) => `<p>${esc(p)}</p>`).join("")}
      ${ch.battle ? `<button class="watch" id="watch"><span class="watch-icon" aria-hidden="true">⚔</span><span><strong>Watch the battle</strong><small>An animated plan of the fighting</small></span></button>` : ""}
      ${(ch.quotes || []).map((q) => `<blockquote><p>“${esc(q.text)}”</p><cite>${esc(q.source)}</cite></blockquote>`).join("")}
      ${figs.length ? `<section class="people"><h3>KEY FIGURES</h3><div class="chips">${figs
        .map(([id, f]) => `<button class="chip" data-fig="${id}"><span class="seal" aria-hidden="true">${esc(initials(f.name))}</span>${esc(f.name)}</button>`)
        .join("")}</div></section>` : ""}
    `;
    chapterEl.scrollTop = 0;
    el("count").textContent = `Chapter ${current + 1} of ${chapters.length}`;
    el("prev").disabled = current === 0;
    el("next").disabled = current === chapters.length - 1;
    document.querySelectorAll(".tick").forEach((t, i) => {
      t.classList.toggle("on", i === current);
      t.classList.toggle("past", i < current);
      t.setAttribute("aria-current", i === current ? "step" : "false");
    });
    el("fill").style.width = tickPct(current) + "%";
    renderLegend();
  }

  function renderLegend() {
    const ids = Object.keys(routeStates[current]).filter((id) => id !== "ascalon");
    el("legend").innerHTML = ids
      .map((id) => `<span><i style="background:var(${C.routes[id].color})"></i>${esc(C.routes[id].label)}</span>`)
      .join("");
  }

  chapterEl.addEventListener("click", (e) => {
    const b = e.target.closest("[data-fig]");
    if (b) openFigure(b.dataset.fig);
    if (e.target.closest("#watch")) openBattle();
  });

  function openBattle() {
    const sc = window.BATTLES && window.BATTLES[chapters[current].battle];
    if (!sc) return;
    setPlaying(false);
    paused = true;
    Battle.open(sc, () => { paused = false; kick(); el("watch") && el("watch").focus(); });
  }

  // ---------- timeline ----------
  const tickPct = (i) => 1.5 + (97 * i) / (chapters.length - 1);
  {
    const tl = el("timeline");
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

  // ---------- figures ----------
  const dlg = el("figure");
  function openFigure(id) {
    const f = C.figures[id];
    const appears = chapters.map((c, i) => [c, i]).filter(([c]) => (c.figures || []).includes(id));
    el("figure-body").innerHTML = `
      <span class="seal" aria-hidden="true">${esc(initials(f.name))}</span>
      <h2>${esc(f.name)}</h2>
      <div class="role">${esc(f.role)}</div>
      <div class="life">${esc(f.life)}</div>
      ${f.bio.map((p) => `<p>${esc(p)}</p>`).join("")}
      <div class="people"><h3>APPEARS IN</h3>
        <div class="appears">${appears.map(([c, i]) => `<button data-go="${i}">${esc(c.title)}</button>`).join("<span aria-hidden='true'>·</span>")}</div>
      </div>
      <button class="btn close" id="figure-close">Close</button>`;
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
  }
  dlg.addEventListener("click", (e) => {
    if (e.target === dlg || e.target.id === "figure-close") return dlg.close();
    const g = e.target.closest("[data-go]");
    if (g) { dlg.close(); go(+g.dataset.go); }
  });

  // ---------- navigation ----------
  function go(i) {
    i = Math.max(0, Math.min(chapters.length - 1, i));
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
    clearTimeout(autoTimer);
    if (v) { if (!anim) scheduleAutoplay(); }
  }
  function scheduleAutoplay() {
    clearTimeout(autoTimer);
    if (!playing) return;
    if (current >= chapters.length - 1) return setPlaying(false);
    const words = chapters[current].body.join(" ").split(/\s+/).length;
    autoTimer = setTimeout(() => go(current + 1), Math.max(7000, words * 230));
  }
  playBtn.addEventListener("click", () => {
    if (!playing && current === chapters.length - 1) go(0);
    setPlaying(!playing);
  });
  el("prev").addEventListener("click", () => go(current - 1));
  el("next").addEventListener("click", () => go(current + 1));
  document.addEventListener("keydown", (e) => {
    if (dlg.open || e.target.closest("input, textarea")) return;
    if (e.key === "ArrowRight") go(current + 1);
    if (e.key === "ArrowLeft") go(current - 1);
  });

  // ---------- free exploration ----------
  const recenterBtn = el("recenter");
  let userMoved = false;
  recenterBtn.addEventListener("click", () => travel(current));
  function markMoved() {
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

  // Tap a place on the map to jump to its chapter.
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
  function start() {
    readColors();
    new ResizeObserver(resize).observe(stage);
    resize();
    const fromHash = chapterIndex[location.hash.slice(1)];
    go(Number.isInteger(fromHash) ? fromHash : 0);
  }
  window.addEventListener("hashchange", () => {
    const i = chapterIndex[location.hash.slice(1)];
    if (Number.isInteger(i)) go(i);
  });
  const reTheme = () => { readColors(); draw(); };
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", reTheme);
  new MutationObserver(reTheme).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => draw());
  }
  start();
})();
