// Battle scenes: an animated, manuscript-style plan of the field.
// Scene space is 100 × 62 units; positions in the data use those units.
window.Battle = (() => {
  const SW = 100, SH = 62;
  const P = {
    vellum: "#f1e6cc", vellumEdge: "#d9c79f", ink: "#2a1f16", soft: "#6b5b46",
    water: "#b9c8bf", waterLine: "#7f988c", hill: "#d8c59b", marsh: "#8d9b6a",
    road: "#9c845c", wall: "#efe2c4", tree: "#7d8f55", treeDark: "#55663a",
  };
  const FOE_KINDS = { horsearcher: "knight" };
  const SPACING = { knight: [3.2, 2.2], leader: [3.2, 2.2], horsearcher: [3.2, 2.2], saint: [3.4, 2.2], foot: [2.1, 1.7], archer: [2.1, 1.7], pilgrim: [2.0, 1.7], siegetower: [5, 3], ram: [5, 3] };

  let root, canvas, ctx, captionEl, dotsEl, titleEl, metaEl, playBtn;
  let scene = null, phase = 0, clock = 0, playing = true, raf = 0, onCloseCb = null;
  let W = 0, H = 0, sc = 1, ox = 0, oy = 0, narrow = false, camX = null, dragX = null, manualUntil = 0;
  let units = {};
  let particles = [];
  let terrainCache = null;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // deterministic jitter
  const rnd = (n) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

  function build() {
    root = document.createElement("div");
    root.className = "battle";
    root.hidden = true;
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-modal", "true");
    root.innerHTML = `
      <div class="battle-head">
        <div><div class="battle-meta" id="battle-meta"></div><h2 id="battle-title"></h2></div>
        <button class="btn" id="battle-close" aria-label="Close battle">Close</button>
      </div>
      <div class="battle-field"><canvas id="battle-canvas" aria-label="Animated battle plan"></canvas></div>
      <div class="battle-foot">
        <p class="battle-caption" id="battle-caption" aria-live="polite"></p>
        <div class="battle-controls">
          <div class="battle-dots" id="battle-dots"></div>
          <button class="btn" id="battle-prev" aria-label="Previous moment"><svg viewBox="0 0 16 16"><path d="M10.5 2 4.5 8l6 6 1.2-1.2L6.9 8l4.8-4.8z"/></svg></button>
          <button class="btn" id="battle-play" aria-label="Pause"></button>
          <button class="btn primary" id="battle-next" aria-label="Next moment">Next <svg viewBox="0 0 16 16"><path d="M5.5 2 4.3 3.2 9.1 8l-4.8 4.8L5.5 14l6-6z"/></svg></button>
        </div>
      </div>`;
    document.body.appendChild(root);
    canvas = root.querySelector("#battle-canvas");
    ctx = canvas.getContext("2d");
    captionEl = root.querySelector("#battle-caption");
    dotsEl = root.querySelector("#battle-dots");
    titleEl = root.querySelector("#battle-title");
    metaEl = root.querySelector("#battle-meta");
    playBtn = root.querySelector("#battle-play");
    root.querySelector("#battle-close").addEventListener("click", close);
    root.querySelector("#battle-prev").addEventListener("click", () => { setPlaying(false); go(phase - 1); });
    root.querySelector("#battle-next").addEventListener("click", () => {
      if (phase === scene.phases.length - 1) return close();
      go(phase + 1);
    });
    playBtn.addEventListener("click", () => {
      if (!playing && phase === scene.phases.length - 1) { reset(); setPlaying(true); return; }
      setPlaying(!playing);
    });
    document.addEventListener("keydown", (e) => {
      if (root.hidden) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") { e.stopImmediatePropagation(); go(phase + 1); }
      if (e.key === "ArrowLeft") { e.stopImmediatePropagation(); go(phase - 1); }
    }, true);
    new ResizeObserver(resize).observe(root.querySelector(".battle-field"));
    canvas.style.touchAction = "none";
    canvas.addEventListener("pointerdown", (e) => { if (narrow) { dragX = e.clientX; canvas.setPointerCapture(e.pointerId); } });
    canvas.addEventListener("pointermove", (e) => {
      if (dragX == null) return;
      camX -= (e.clientX - dragX) / sc; dragX = e.clientX; manualUntil = performance.now() + 4000;
    });
    const end = () => { dragX = null; };
    canvas.addEventListener("pointerup", end); canvas.addEventListener("pointercancel", end);
  }

  function setPlaying(v) {
    playing = v;
    playBtn.setAttribute("aria-label", v ? "Pause" : "Play");
    playBtn.innerHTML = v
      ? '<svg viewBox="0 0 16 16"><path d="M4 2.5h3v11H4zM9 2.5h3v11H9z"/></svg>'
      : '<svg viewBox="0 0 16 16"><path d="M4 2.5v11L13 8z"/></svg>';
  }

  function resize() {
    const field = root.querySelector(".battle-field");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = field.clientWidth; H = field.clientHeight;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    canvas.style.width = W + "px"; canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // Wide screens show the whole field. Narrow ones zoom in and follow the action.
    narrow = W / H < 1.25;
    sc = narrow ? Math.min(H / SH, W / 42) : Math.min(W / SW, H / SH);
    oy = (H - SH * sc) / 2;
    if (!narrow) ox = (W - SW * sc) / 2;
    else if (camX == null) camX = 50;
    terrainCache = null;
  }
  const X = (x) => ox + x * sc;
  const Y = (y) => oy + y * sc;

  // ---------- state ----------
  function resolve(i) {
    // Cumulative unit settings up to phase i.
    const st = {};
    for (const [id, u] of Object.entries(scene.units)) {
      st[id] = { at: u.start || u.at || [50, 31], state: u.start ? "hidden" : "hold", facing: u.facing || (u.side === "foe" ? -1 : 1) };
    }
    for (let p = 0; p <= i; p++) {
      for (const [id, s] of Object.entries(scene.phases[p].set || {})) {
        st[id] = { ...st[id], ...s, state: s.state || "march" };
      }
    }
    return st;
  }

  function go(i) {
    if (!scene) return;
    i = Math.max(0, Math.min(scene.phases.length - 1, i));
    const target = resolve(i);
    for (const [id, t] of Object.entries(target)) {
      const u = units[id];
      u.from = [u.x, u.y];
      u.fromAlpha = u.alpha;
      u.to = t.at;
      u.state = t.state;
      u.facing = t.facing;
      u.toAlpha = t.state === "hidden" ? 0 : 1;
      u.moving = Math.hypot(u.to[0] - u.from[0], u.to[1] - u.from[1]) > 0.5;
    }
    phase = i;
    clock = 0;
    particles = [];
    captionEl.textContent = scene.phases[i].caption;
    dotsEl.innerHTML = scene.phases.map((_, k) => `<span class="${k === i ? "on" : k < i ? "past" : ""}"></span>`).join("");
    root.querySelector("#battle-prev").disabled = i === 0;
    root.querySelector("#battle-next").firstChild.textContent = i === scene.phases.length - 1 ? "Done " : "Next ";
  }

  function reset() {
    units = {};
    for (const [id, u] of Object.entries(scene.units)) {
      const st = u.start || u.at || [50, 31];
      units[id] = { id, def: u, x: st[0], y: st[1], alpha: u.start ? 0 : 1, from: st, to: st, fromAlpha: 0, toAlpha: 1, state: "hold", facing: 1, moving: false };
    }
    go(0);
  }

  const phaseDur = () => (scene.phases[phase].dur || 5200) + scene.phases[phase].caption.length * 18;

  function open(sc0, onClose) {
    if (!root) build();
    scene = sc0;
    onCloseCb = onClose;
    camX = null; manualUntil = 0;
    titleEl.textContent = scene.title;
    metaEl.textContent = `${scene.date} · ${scene.place}`;
    root.hidden = false;
    document.body.classList.add("battle-open");
    resize();
    reset();
    setPlaying(!reduce);
    root.querySelector("#battle-next").focus();
    if (!raf) raf = requestAnimationFrame(frame);
  }

  function close() {
    if (!root || root.hidden) return;
    root.hidden = true;
    document.body.classList.remove("battle-open");
    cancelAnimationFrame(raf); raf = 0;
    scene = null;
    onCloseCb && onCloseCb();
  }

  // ---------- frame ----------
  let lastT = performance.now();
  function frame(now) {
    raf = 0;
    if (!scene || root.hidden) return;
    const dt = Math.min(0.05, (now - lastT) / 1000); lastT = now;
    clock += dt * 1000;
    const e = clock;
    const moveDur = Math.min(3200, phaseDur() * 0.6);
    const t = reduce ? 1 : Math.min(1, e / moveDur);
    const k = easeInOut(t);
    for (const u of Object.values(units)) {
      u.x = u.from[0] + (u.to[0] - u.from[0]) * k;
      u.y = u.from[1] + (u.to[1] - u.from[1]) * k;
      u.alpha = u.fromAlpha + (u.toAlpha - u.fromAlpha) * Math.min(1, t * 1.4);
      if (u.state === "flee") u.alpha = Math.max(0, 1 - k * 0.9);
      u.walking = u.moving && t < 1;
    }
    if (narrow) {
      if (now > manualUntil) {
        let sx = 0, sw = 0;
        for (const u of Object.values(units)) {
          if (u.alpha < 0.3 || u.state === "flee") continue;
          const w = u.state === "fight" ? 3 : u.moving ? 2 : 1;
          sx += u.x * w; sw += w;
        }
        const target = sw ? sx / sw : 50;
        camX += (target - camX) * Math.min(1, dt * 1.6);
      }
      const half = W / sc / 2;
      camX = Math.max(half, Math.min(SW - half, camX));
      ox = W / 2 - camX * sc;
    }
    spawnFx(dt);
    draw(now / 1000, dt);
    if (playing && e > phaseDur()) {
      if (phase < scene.phases.length - 1) go(phase + 1);
      else setPlaying(false);
    }
    raf = requestAnimationFrame(frame);
  }
  const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

  // ---------- figures in a unit ----------
  function unitFigures(u) {
    const d = u.def;
    const kinds = d.mix || [d.kind];
    const [dx, dy] = SPACING[kinds[0]] || [2.4, 1.8];
    const rows = d.rows || 1, cols = d.cols || 1;
    const out = [];
    const spread = u.state === "flee" ? 1 + (Math.hypot(u.x - u.from[0], u.y - u.from[1]) * 0.03) : 1;
    let n = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++, n++) {
        const seed = (u.id.length * 31 + n * 7) % 997;
        const fx = (c - (cols - 1) / 2) * dx * spread + (rnd(seed) - 0.5) * dx * 0.35;
        const fy = (r - (rows - 1) / 2) * dy * spread + (rnd(seed + 1) - 0.5) * dy * 0.4;
        out.push({ x: u.x + fx, y: u.y + fy, kind: kinds[n % kinds.length], seed });
      }
    }
    if (d.leader) out.push({ x: u.x + ((cols + 1) / 2) * dx * 0.55 * (u.facing || 1), y: u.y - 0.4, kind: "leader", seed: 5, lead: true });
    return out;
  }

  function figKind(kind, side) {
    if (kind === "horsearcher") return "knight";
    if (kind === "saint") return "knight";
    return kind;
  }

  function drawUnit(u, time, list) {
    if (u.alpha <= 0.01) return;
    const d = u.def;
    const s = sc * (d.kind === "siegetower" ? 5.2 : d.kind === "ram" ? 3.6 : 3.1);
    const fighting = u.state === "fight" && !u.walking;
    for (const f of unitFigures(u)) {
      const jig = fighting ? Math.sin(time * 5 + f.seed) * 0.35 * (u.facing || 1) : 0;
      list.push({
        y: f.y,
        draw: () => Sprites.figure(ctx, figKind(f.kind), X(f.x + jig), Y(f.y), f.lead ? s * 1.15 : s, {
          facing: u.facing,
          t: time * 8 + f.seed,
          gait: u.walking ? (u.state === "flee" ? 1.4 : 1) : 0,
          seed: f.seed,
          color: d.color,
          foe: d.side === "foe",
          fighting,
          bridge: fighting,
          halo: f.kind === "saint",
          coat: f.kind === "saint" ? "#f6f2e8" : d.side === "foe" && f.seed % 3 === 0 ? "#d9cdb8" : undefined,
          alpha: u.alpha * (f.kind === "saint" ? 0.9 : 1),
        }),
      });
    }
  }

  function unitLabel(u, boxes) {
    if (u.alpha < 0.5 || !u.def.label || u.state === "flee") return;
    const d = u.def;
    const rows = d.rows || 1;
    const [, dy] = SPACING[(d.mix || [d.kind])[0]] || [2.4, 1.8];
    const s = sc * (d.kind === "siegetower" ? 5.2 : 3.1);
    const x = X(u.x), y = Y(u.y - ((rows - 1) / 2) * dy) - s * 1.25 - 6;
    const fs = Math.max(10, Math.min(14, sc * 1.25));
    ctx.font = `700 ${fs}px "Alegreya Sans SC", "Gill Sans", sans-serif`;
    const w = ctx.measureText(d.label).width;
    let bx = x - w / 2, by = y;
    for (let tries = 0; tries < 4; tries++) {
      const hit = boxes.some((b) => bx < b[2] && bx + w > b[0] && by - fs < b[3] && by > b[1]);
      if (!hit) break;
      by -= fs + 2;
    }
    boxes.push([bx - 3, by - fs, bx + w + 3, by + 3]);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
    ctx.lineWidth = 3.5; ctx.strokeStyle = P.vellum; ctx.lineJoin = "round";
    ctx.globalAlpha = u.alpha;
    ctx.strokeText(d.label, bx, by);
    ctx.fillStyle = d.side === "foe" ? P.soft : d.labelColor || shade(d.color);
    ctx.fillText(d.label, bx, by);
    ctx.globalAlpha = 1;
  }
  const shade = (c) => c;

  // ---------- effects ----------
  function footprint(u) {
    const d = u.def;
    const [dx, dy] = SPACING[(d.mix || [d.kind])[0]] || [2.4, 1.8];
    return { w: (d.cols || 1) * dx, h: (d.rows || 1) * dy };
  }
  function randIn(u) {
    const f = footprint(u);
    return [u.x + (Math.random() - 0.5) * f.w, u.y + (Math.random() - 0.5) * f.h - 1.2];
  }

  function spawnFx(dt) {
    if (reduce) return;
    for (const fx of scene.phases[phase].fx || []) {
      if (fx.type === "arrows" || fx.type === "stones") {
        const a = units[fx.from], b = units[fx.to];
        if (!a || !b || a.alpha < 0.5 || b.alpha < 0.3) continue;
        const rate = fx.rate || 9;
        if (Math.random() < rate * dt) {
          const from = randIn(a), to = randIn(b);
          particles.push({ type: fx.type, from, to, t: 0, life: 0.8 + Math.random() * 0.4 });
        }
      } else if (fx.type === "clash") {
        const a = units[fx.a], b = units[fx.b];
        if (!a || !b || a.walking || b.walking) continue;
        if (Math.random() < 10 * dt) {
          const mx = (a.x + b.x) / 2 + (Math.random() - 0.5) * 4, my = (a.y + b.y) / 2 + (Math.random() - 0.5) * 3;
          particles.push({ type: Math.random() < 0.35 ? "glint" : "dust", at: [mx, my], t: 0, life: 0.7 + Math.random() * 0.6 });
        }
      } else if (fx.type === "fire") {
        const at = fx.unit ? (units[fx.unit] ? [units[fx.unit].x, units[fx.unit].y - (fx.lift || 0)] : null) : fx.at;
        if (!at) continue;
        if (Math.random() < 14 * dt) {
          particles.push({ type: "flame", at: [at[0] + (Math.random() - 0.5) * (fx.r || 2.5), at[1] + (Math.random() - 0.5) * (fx.r || 2.5) * 0.5], t: 0, life: 0.6 + Math.random() * 0.5 });
        }
        if (Math.random() < 4 * dt) particles.push({ type: "smoke", at: [at[0] + (Math.random() - 0.5) * 2, at[1] - 1], t: 0, life: 2 + Math.random() });
      }
    }
  }

  function drawParticles(dt) {
    particles = particles.filter((p) => (p.t += dt) < p.life);
    for (const p of particles) {
      const k = p.t / p.life;
      if (p.type === "arrows" || p.type === "stones") {
        const x = p.from[0] + (p.to[0] - p.from[0]) * k;
        const arc = Math.sin(Math.PI * k) * Math.hypot(p.to[0] - p.from[0], p.to[1] - p.from[1]) * 0.25;
        const y = p.from[1] + (p.to[1] - p.from[1]) * k - arc;
        if (p.type === "stones") {
          ctx.beginPath(); ctx.arc(X(x), Y(y), Math.max(1.5, sc * 0.35), 0, Math.PI * 2); ctx.fillStyle = "#8b8170"; ctx.fill();
          continue;
        }
        const k2 = Math.min(1, k + 0.02);
        const x2 = p.from[0] + (p.to[0] - p.from[0]) * k2;
        const y2 = p.from[1] + (p.to[1] - p.from[1]) * k2 - Math.sin(Math.PI * k2) * Math.hypot(p.to[0] - p.from[0], p.to[1] - p.from[1]) * 0.25;
        const ang = Math.atan2(Y(y2) - Y(y), X(x2) - X(x));
        const L = Math.max(5, sc * 1.1);
        ctx.save(); ctx.translate(X(x), Y(y)); ctx.rotate(ang);
        ctx.beginPath(); ctx.moveTo(-L, 0); ctx.lineTo(0, 0);
        ctx.strokeStyle = P.ink; ctx.lineWidth = 1; ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-L, 0); ctx.lineTo(-L - 2, -2); ctx.moveTo(-L, 0); ctx.lineTo(-L - 2, 2); ctx.stroke();
        ctx.restore();
      } else if (p.type === "dust") {
        ctx.beginPath(); ctx.arc(X(p.at[0]), Y(p.at[1] - k * 1.5), sc * (0.4 + k * 1.4), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(150, 128, 95, ${0.45 * (1 - k)})`; ctx.fill();
      } else if (p.type === "glint") {
        const x = X(p.at[0]), y = Y(p.at[1] - 1.5), r = sc * 0.9 * (1 - k);
        ctx.beginPath(); ctx.moveTo(x - r, y); ctx.lineTo(x + r, y); ctx.moveTo(x, y - r); ctx.lineTo(x, y + r);
        ctx.strokeStyle = `rgba(255, 250, 230, ${1 - k})`; ctx.lineWidth = 1.5; ctx.stroke();
      } else if (p.type === "flame") {
        const x = X(p.at[0]), y = Y(p.at[1] - k * 2.2), r = sc * 0.8 * (1 - k * 0.6);
        ctx.beginPath(); ctx.moveTo(x - r * 0.6, y); ctx.quadraticCurveTo(x, y - r * 2.4, x + r * 0.6, y); ctx.closePath();
        ctx.fillStyle = k < 0.4 ? "rgba(246, 196, 70, .9)" : `rgba(214, 92, 38, ${0.85 * (1 - k)})`; ctx.fill();
      } else if (p.type === "smoke") {
        ctx.beginPath(); ctx.arc(X(p.at[0] + k * 1.5), Y(p.at[1] - k * 6), sc * (0.6 + k * 1.6), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(90, 80, 70, ${0.25 * (1 - k)})`; ctx.fill();
      }
    }
  }

  // ---------- terrain ----------
  function drawTerrain() {
    const PW = SW * sc, PH = SH * sc;
    ctx.fillStyle = "#e6d7b5"; ctx.fillRect(0, 0, W, H);
    if (!(terrainCache && terrainCache.sc === sc && terrainCache.id === scene.id)) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const off = document.createElement("canvas");
      off.width = Math.round(PW * dpr); off.height = Math.round(PH * dpr);
      const c = off.getContext("2d");
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      const [sox, soy] = [ox, oy];
      ox = 0; oy = 0;
      paintTerrain(c, PW, PH);
      ox = sox; oy = soy;
      terrainCache = { canvas: off, sc, id: scene.id };
    }
    ctx.drawImage(terrainCache.canvas, ox, oy, PW, PH);
  }

  function polyPath(c, pts, closed) {
    c.beginPath();
    pts.forEach(([x, y], i) => (i ? c.lineTo(X(x), Y(y)) : c.moveTo(X(x), Y(y))));
    if (closed) c.closePath();
  }

  function paintTerrain(c, W, H) {
    // ground
    c.fillStyle = P.vellum; c.fillRect(0, 0, W, H);
    const g = c.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.2, W / 2, H / 2, Math.max(W, H) * 0.75);
    g.addColorStop(0, "rgba(255,255,255,0)"); g.addColorStop(1, "rgba(150,120,70,.22)");
    c.fillStyle = g; c.fillRect(0, 0, W, H);
    // plate border
    c.strokeStyle = P.ink; c.lineWidth = 1.5; c.strokeRect(X(0) + 0.5, Y(0) + 0.5, SW * sc - 1, SH * sc - 1);
    c.strokeStyle = P.vellumEdge; c.lineWidth = 1; c.strokeRect(X(0) + 4, Y(0) + 4, SW * sc - 8, SH * sc - 8);
    c.save();
    c.beginPath(); c.rect(X(0), Y(0), SW * sc, SH * sc); c.clip();

    const T = scene.terrain || [];
    for (const t of T) {
      if (t.type === "sea" || t.type === "lake") {
        polyPath(c, t.poly, true); c.fillStyle = P.water; c.fill();
        c.strokeStyle = P.waterLine; c.lineWidth = 1.2; c.stroke();
        // wave marks
        const xs = t.poly.map((p) => p[0]), ys = t.poly.map((p) => p[1]);
        c.save(); polyPath(c, t.poly, true); c.clip();
        c.strokeStyle = P.waterLine; c.lineWidth = 1;
        for (let y = Math.min(...ys) + 3; y < Math.max(...ys); y += 4) {
          for (let x = Math.min(...xs) + ((y * 7) % 6); x < Math.max(...xs); x += 7) {
            c.beginPath(); c.moveTo(X(x), Y(y)); c.quadraticCurveTo(X(x + 1), Y(y - 0.8), X(x + 2), Y(y)); c.stroke();
          }
        }
        c.restore();
      }
    }
    for (const t of T) {
      if (t.type === "hills") {
        const [x, y] = t.at, w = t.w, h = t.h;
        c.beginPath(); c.moveTo(X(x - w / 2), Y(y + h / 2));
        c.bezierCurveTo(X(x - w / 4), Y(y - h / 2), X(x + w / 4), Y(y - h / 2), X(x + w / 2), Y(y + h / 2));
        c.closePath(); c.fillStyle = P.hill; c.fill();
        c.strokeStyle = P.soft; c.lineWidth = 1; c.stroke();
        c.save(); c.clip();
        c.strokeStyle = "rgba(90,70,40,.45)"; c.lineWidth = 0.8;
        for (let i = 0; i < w; i += 1.2) {
          const hx = x - w / 2 + i;
          c.beginPath(); c.moveTo(X(hx), Y(y + h / 2)); c.lineTo(X(hx + 0.8), Y(y - h / 4)); c.stroke();
        }
        c.restore();
      } else if (t.type === "river") {
        polyPath(c, t.path, false);
        c.strokeStyle = P.waterLine; c.lineWidth = (t.w || 2.2) * sc + 2; c.lineCap = "round"; c.lineJoin = "round"; c.stroke();
        polyPath(c, t.path, false);
        c.strokeStyle = P.water; c.lineWidth = (t.w || 2.2) * sc; c.stroke();
      } else if (t.type === "road") {
        polyPath(c, t.path, false);
        c.setLineDash([sc * 1.2, sc * 0.9]); c.strokeStyle = P.road; c.lineWidth = Math.max(1, sc * 0.35); c.stroke(); c.setLineDash([]);
      } else if (t.type === "marsh") {
        for (let i = 0; i < (t.n || 14); i++) {
          const x = t.at[0] + (rnd(i * 3 + 1) - 0.5) * t.r * 2, y = t.at[1] + (rnd(i * 3 + 2) - 0.5) * t.r;
          c.beginPath();
          for (let j = -1; j <= 1; j++) { c.moveTo(X(x), Y(y)); c.lineTo(X(x + j * 0.5), Y(y - 1.3)); }
          c.strokeStyle = P.marsh; c.lineWidth = 1; c.stroke();
        }
      }
    }
    for (const t of T) {
      if (t.type === "walls") {
        polyPath(c, t.path, t.closed !== false);
        c.strokeStyle = P.ink; c.lineWidth = sc * 1.25 + 2; c.lineJoin = "round"; c.stroke();
        polyPath(c, t.path, t.closed !== false);
        c.strokeStyle = P.wall; c.lineWidth = sc * 1.25; c.stroke();
        // crenellations along each edge
        const pts = t.closed === false ? t.path : [...t.path, t.path[0]];
        c.fillStyle = P.ink;
        for (let i = 0; i < pts.length - 1; i++) {
          const [ax, ay] = pts[i], [bx, by] = pts[i + 1];
          const L = Math.hypot(bx - ax, by - ay), n = Math.floor(L / 1.6);
          for (let j = 1; j < n; j++) {
            const x = ax + ((bx - ax) * j) / n, y = ay + ((by - ay) * j) / n;
            c.fillRect(X(x) - sc * 0.22, Y(y) - sc * 0.22, sc * 0.44, sc * 0.44);
          }
        }
        for (const [x, y] of t.path) {
          c.beginPath(); c.rect(X(x) - sc * 1.1, Y(y) - sc * 1.1, sc * 2.2, sc * 2.2);
          c.fillStyle = P.wall; c.fill(); c.strokeStyle = P.ink; c.lineWidth = 1.2; c.stroke();
        }
      } else if (t.type === "bridge") {
        const [x, y] = t.at;
        c.beginPath(); c.rect(X(x) - sc * 1, Y(y) - sc * 2.2, sc * 2, sc * 4.4);
        c.fillStyle = P.wall; c.fill(); c.strokeStyle = P.ink; c.lineWidth = 1.2; c.stroke();
      } else if (t.type === "trees") {
        for (let i = 0; i < (t.n || 8); i++) {
          const x = t.at[0] + (rnd(i * 5 + t.at[0]) - 0.5) * t.r * 2, y = t.at[1] + (rnd(i * 5 + 2 + t.at[1]) - 0.5) * t.r;
          c.beginPath(); c.moveTo(X(x), Y(y)); c.lineTo(X(x), Y(y - 1)); c.strokeStyle = P.ink; c.lineWidth = 1.2; c.stroke();
          c.beginPath(); c.arc(X(x), Y(y - 1.9), sc * 1.2, 0, Math.PI * 2); c.fillStyle = i % 2 ? P.tree : P.treeDark; c.fill();
          c.strokeStyle = P.ink; c.lineWidth = 1; c.stroke();
        }
      } else if (t.type === "tents") {
        const pts = [];
        for (let i = 0; i < (t.n || 6); i++) {
          const a = (i / (t.n || 6)) * Math.PI * 2 + 0.4;
          pts.push([t.at[0] + Math.cos(a) * t.r * (0.6 + rnd(i) * 0.4), t.at[1] + Math.sin(a) * t.r * 0.45 * (0.6 + rnd(i + 9) * 0.4)]);
        }
        pts.sort((a, b) => a[1] - b[1]).forEach(([x, y]) => drawTent(c, x, y, t.color));
      } else if (t.type === "landmark") {
        Sprites.landmark(c, t.kind, X(t.at[0]), Y(t.at[1]), sc * (t.size || 6));
      }
    }
    // labels last
    for (const t of T) {
      const text = t.type === "label" ? t.text : t.label;
      if (!text) continue;
      const at = t.labelAt || t.at || (t.path && t.path[Math.floor(t.path.length / 2)]);
      if (!at) continue;
      const fs = Math.max(11, Math.min(16, sc * (t.size && t.type === "label" ? t.size : 1.45)));
      c.font = t.italic === false ? `600 ${fs}px "Alegreya Sans SC", sans-serif` : `italic ${fs}px Alegreya, Georgia, serif`;
      c.textAlign = "center"; c.textBaseline = "middle";
      c.lineWidth = 3; c.strokeStyle = P.vellum; c.lineJoin = "round";
      c.strokeText(text, X(at[0]), Y(at[1]));
      c.fillStyle = P.soft; c.fillText(text, X(at[0]), Y(at[1]));
    }
    // compass
    const cx = X(SW) - 26, cy = Y(0) + 30;
    c.beginPath(); c.moveTo(cx, cy - 16); c.lineTo(cx + 5, cy); c.lineTo(cx, cy + 16); c.lineTo(cx - 5, cy); c.closePath();
    c.fillStyle = P.vellum; c.fill(); c.strokeStyle = P.ink; c.lineWidth = 1; c.stroke();
    c.beginPath(); c.moveTo(cx, cy - 16); c.lineTo(cx + 5, cy); c.lineTo(cx - 5, cy); c.closePath(); c.fillStyle = "#a8301d"; c.fill();
    c.font = `700 11px "Alegreya Sans SC", sans-serif`; c.fillStyle = P.ink; c.textAlign = "center"; c.fillText("N", cx, cy - 22);
    c.restore();
  }

  function drawTent(c, x, y, color) {
    const s = sc * 2.6;
    c.save(); c.translate(X(x), Y(y));
    c.beginPath(); c.moveTo(-0.4 * s, 0); c.lineTo(0, -0.6 * s); c.lineTo(0.4 * s, 0); c.closePath();
    c.fillStyle = "#f6eedc"; c.fill(); c.strokeStyle = P.ink; c.lineWidth = 1; c.stroke();
    c.beginPath(); c.moveTo(0, -0.6 * s); c.lineTo(0, 0); c.stroke();
    c.beginPath(); c.moveTo(0, -0.6 * s); c.lineTo(0, -0.85 * s); c.lineTo(0.2 * s, -0.78 * s); c.lineTo(0, -0.7 * s); c.closePath();
    c.fillStyle = color || "#a8301d"; c.fill(); c.stroke();
    c.restore();
  }

  function draw(time, dt) {
    ctx.clearRect(0, 0, W, H);
    drawTerrain();
    const list = [];
    for (const u of Object.values(units)) drawUnit(u, time, list);
    list.sort((a, b) => a.y - b.y).forEach((f) => f.draw());
    drawParticles(dt);
    const boxes = [];
    for (const u of Object.values(units)) unitLabel(u, boxes);
  }

  return { open, close };
})();
