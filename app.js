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
  const canvas = document.getElementById("globe");
  const ctx = canvas.getContext("2d");
  const projection = d3.geoOrthographic().clipAngle(90).precision(0.4);
  const path = d3.geoPath(projection, ctx);
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
      verm: v("--vermilion"), gold: v("--gold"), leaf: v("--leaf"),
    };
    for (const [id, r] of Object.entries(C.routes)) colors[id] = v(r.color);
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = stage.clientWidth; H = stage.clientHeight;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    base = Math.min(W, H) * 0.46;
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
    const r = base * cam.k;
    ctx.clearRect(0, 0, W, H);

    // sea with limb shading
    const [cx, cy] = [W / 2, H / 2];
    const g = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.35, r * 0.1, cx, cy, r);
    g.addColorStop(0, colors.sea); g.addColorStop(1, colors.seaDeep);
    ctx.beginPath(); path(sphere); ctx.fillStyle = g; ctx.fill();

    // rhumb lines + graticule
    ctx.beginPath(); path(rhumbs); ctx.strokeStyle = colors.rhumb; ctx.lineWidth = 0.8; ctx.stroke();
    ctx.beginPath(); path(graticule); ctx.strokeStyle = colors.rhumb; ctx.lineWidth = 0.5; ctx.stroke();

    // land
    ctx.beginPath(); path(cam.k < 2.4 ? land110 : land50);
    ctx.fillStyle = colors.land; ctx.fill();
    ctx.strokeStyle = colors.coast; ctx.lineWidth = cam.k > 6 ? 1.2 : 0.8; ctx.stroke();

    // rim
    ctx.beginPath(); path(sphere); ctx.strokeStyle = colors.coast; ctx.lineWidth = 1.2; ctx.stroke();

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

    // places: past events and reference cities
    const placeLabels = [];
    const placed = new Map();
    for (const c of C.cities) placed.set(c.name, { at: c.at, kind: "city" });
    for (let i = 0; i <= current; i++) {
      const ch = chapters[i];
      if (i === 0) continue; // prologue marks a distant battlefield; drawn below
      const name = ch.place.split(",")[0];
      if (ch.place.includes(" to ") || ch.place.startsWith("Down") || ch.place.startsWith("Western") || ch.place.startsWith("Central") || ch.place.startsWith("The Latin")) continue;
      placed.set(name, { at: ch.at, kind: "event", i });
    }
    if (current === 0) placed.set("Manzikert", { at: chapters[0].at, kind: "event", i: 0 });
    const cur = chapters[current];
    for (const [name, pl] of placed) {
      if (!visible(pl.at)) continue;
      const [x, y] = projection(pl.at);
      const isCur = Math.abs(pl.at[0] - cur.at[0]) < 0.01 && Math.abs(pl.at[1] - cur.at[1]) < 0.01;
      ctx.beginPath();
      ctx.arc(x, y, isCur ? 5 : pl.kind === "event" ? 3.5 : 2.5, 0, Math.PI * 2);
      ctx.fillStyle = isCur ? colors.verm : pl.kind === "event" ? colors.ink : colors.coast;
      ctx.fill();
      if (pl.kind === "event" && !isCur) { ctx.lineWidth = 1.5; ctx.strokeStyle = colors.land; ctx.stroke(); }
      const showLabel = isCur || cam.k >= 3 || name === "Jerusalem" || name === "Constantinople";
      if (showLabel) placeLabels.push({ name, x, y, isCur, pri: isCur ? 0 : pl.kind === "event" ? 2 : 3 });
    }

    // army heads for routes moving in this chapter
    const headLabels = [];
    for (const id of activeRoutes) {
      const p = routeNow[id];
      if (!(p > 0)) continue;
      const coords = partialLine(C.routes[id].points, p);
      const head = coords[coords.length - 1];
      if (!visible(head)) continue;
      const [x, y] = projection(head);
      drawBanner(x, y, colors[id]);
      headLabels.push({ text: C.routes[id].label, x, y, color: colors[id] });
    }

    // labels, most important first
    boxes = [];
    placeLabels.sort((a, b) => a.pri - b.pri);
    for (const l of placeLabels.filter((l) => l.isCur)) placeLabel(l);
    for (const h of headLabels) {
      const f = { font: `700 12px "Alegreya Sans SC", sans-serif`, color: h.color, spacing: 0.5 };
      label(h.text, h.x + 10, h.y + 12, f) || label(h.text, h.x - 10, h.y + 12, { ...f, align: "right" }) || label(h.text, h.x + 16, h.y - 26, f);
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

  function placeLabel({ name, x, y, isCur }) {
    const f = { font: isCur ? `600 15px Alegreya, serif` : `14px Alegreya, serif`, color: isCur ? colors.verm : colors.ink };
    label(name, x + 8, y - 1, f) || label(name, x - 8, y - 1, { ...f, align: "right" });
  }

  // A small pennant with a cross: the army's position.
  function drawBanner(x, y, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = colors.ink; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -20); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -20); ctx.lineTo(14, -16); ctx.lineTo(0, -11); ctx.closePath();
    ctx.fillStyle = color; ctx.fill();
    ctx.strokeStyle = colors.leaf; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(5, -18.5); ctx.lineTo(5, -12.5); ctx.moveTo(2.5, -15.8); ctx.lineTo(7.5, -15.8); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 0, 2.5, 0, Math.PI * 2); ctx.fillStyle = colors.ink; ctx.fill();
    ctx.restore();
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
  function loop(now) {
    raf = 0;
    if (anim) {
      const t = Math.min(1, (now - anim.start) / anim.dur);
      anim.step(t);
      if (t >= 1) { const done = anim.done; anim = null; done && done(); }
    }
    draw();
    if (anim) raf = requestAnimationFrame(loop);
  }
  function kick() { if (!raf) raf = requestAnimationFrame(loop); }

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
  });

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
    anim = null;
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
