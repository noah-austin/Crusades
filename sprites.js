// Hand-drawn figures and landmarks, in the spirit of the Bayeux Tapestry.
// Every figure is drawn facing right with its feet at (x, y); `s` is its height in pixels.
window.Sprites = (() => {
  const INK = "#2a1f16";
  const SKIN = "#e8c7a0";
  const STEEL = "#8b929a";
  const STONE = "#efe2c4";
  const STONE_SHADE = "#d6c4a0";
  const ROOF = "#a8301d";
  const LEAD = "#8f98a3";
  const GOLD = "#d2a33a";
  const WOOD = "#8a5a2b";
  const WOOD_DARK = "#5e3b1a";
  const HORSE_COATS = ["#7b4a26", "#5a3820", "#a87a4c", "#d9cdb8", "#3d2a1c"];

  function stroke(ctx, w) { ctx.lineWidth = w; ctx.strokeStyle = INK; ctx.stroke(); }
  function fill(ctx, c, w) { ctx.fillStyle = c; ctx.fill(); if (w) stroke(ctx, w); }

  function cross(ctx, x, y, r, color, w) {
    ctx.beginPath();
    ctx.moveTo(x, y - r); ctx.lineTo(x, y + r);
    ctx.moveTo(x - r * 0.75, y - r * 0.25); ctx.lineTo(x + r * 0.75, y - r * 0.25);
    ctx.strokeStyle = color; ctx.lineWidth = w; ctx.stroke();
  }

  function kite(ctx, x, y, w, h, color, emblem, lw) {
    ctx.beginPath();
    ctx.moveTo(x - w / 2, y);
    ctx.quadraticCurveTo(x, y - h * 0.18, x + w / 2, y);
    ctx.quadraticCurveTo(x + w * 0.35, y + h * 0.55, x, y + h);
    ctx.quadraticCurveTo(x - w * 0.35, y + h * 0.55, x - w / 2, y);
    fill(ctx, color, lw);
    if (emblem) cross(ctx, x, y + h * 0.38, h * 0.26, emblem, lw * 1.1);
  }

  function helmet(ctx, hx, hy, r, lw, kind) {
    ctx.beginPath();
    if (kind === "spike") {
      ctx.moveTo(hx - r * 1.05, hy); ctx.quadraticCurveTo(hx - r, hy - r * 1.3, hx, hy - r * 1.9);
      ctx.quadraticCurveTo(hx + r, hy - r * 1.3, hx + r * 1.05, hy);
    } else {
      ctx.moveTo(hx - r * 1.05, hy + r * 0.1); ctx.lineTo(hx, hy - r * 1.8); ctx.lineTo(hx + r * 1.05, hy + r * 0.1);
    }
    ctx.closePath(); fill(ctx, STEEL, lw);
    if (kind === "spike") {
      ctx.beginPath(); ctx.moveTo(hx - r, hy - r * 0.05); ctx.lineTo(hx + r, hy - r * 0.05);
      ctx.strokeStyle = "#f2ead8"; ctx.lineWidth = lw * 1.6; ctx.stroke();
    } else {
      ctx.beginPath(); ctx.moveTo(hx + r * 0.55, hy); ctx.lineTo(hx + r * 0.6, hy + r * 0.9); stroke(ctx, lw);
    }
  }

  function head(ctx, hx, hy, r, lw) {
    ctx.beginPath(); ctx.arc(hx, hy, r, 0, Math.PI * 2); fill(ctx, SKIN, lw);
  }

  // ---------- horse ----------
  function horse(ctx, s, t, gait, coat, lw) {
    const bob = Math.sin(t * 2) * 0.012 * s * gait;
    // legs
    const legs = [[-0.27, 0], [-0.22, Math.PI], [0.2, Math.PI * 0.5], [0.25, Math.PI * 1.5]];
    ctx.lineCap = "round";
    for (const [lx, off] of legs) {
      const a = Math.sin(t + off) * 0.45 * gait;
      const hx = lx * s, hy = -0.44 * s + bob;
      const kx = hx + Math.sin(a) * 0.2 * s, ky = hy + Math.cos(a) * 0.22 * s;
      const fx = kx + Math.sin(a * 0.4) * 0.2 * s, fy = 0;
      ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(kx, ky); ctx.lineTo(fx, fy);
      ctx.strokeStyle = INK; ctx.lineWidth = Math.max(1, 0.055 * s); ctx.stroke();
    }
    // tail
    ctx.beginPath();
    ctx.moveTo(-0.33 * s, -0.56 * s + bob);
    ctx.quadraticCurveTo(-0.5 * s, -0.5 * s + bob, -0.46 * s - Math.sin(t) * 0.04 * s * gait, -0.28 * s);
    ctx.strokeStyle = INK; ctx.lineWidth = Math.max(1.2, 0.05 * s); ctx.stroke();
    // body
    ctx.beginPath(); ctx.ellipse(-0.03 * s, -0.53 * s + bob, 0.33 * s, 0.13 * s, 0, 0, Math.PI * 2);
    fill(ctx, coat, lw);
    // neck and head
    ctx.beginPath();
    ctx.moveTo(0.18 * s, -0.6 * s + bob);
    ctx.lineTo(0.34 * s, -0.88 * s + bob);
    ctx.lineTo(0.42 * s, -0.92 * s + bob);
    ctx.lineTo(0.58 * s, -0.78 * s + bob);
    ctx.lineTo(0.55 * s, -0.72 * s + bob);
    ctx.lineTo(0.42 * s, -0.76 * s + bob);
    ctx.lineTo(0.3 * s, -0.5 * s + bob);
    ctx.closePath(); fill(ctx, coat, lw);
    ctx.beginPath(); ctx.moveTo(0.38 * s, -0.9 * s + bob); ctx.lineTo(0.37 * s, -0.99 * s + bob); ctx.lineTo(0.43 * s, -0.92 * s + bob); fill(ctx, coat, lw);
    return bob;
  }

  // ---------- figures ----------
  function knight(ctx, s, o) {
    const lw = Math.max(0.8, s * 0.035);
    const bob = horse(ctx, s, o.t, o.gait, o.coat || HORSE_COATS[o.seed % HORSE_COATS.length], lw);
    const y0 = -0.62 * s + bob;
    // rider leg
    ctx.beginPath(); ctx.moveTo(0, y0); ctx.lineTo(0.07 * s, -0.42 * s + bob); stroke(ctx, Math.max(1, s * 0.05));
    // lance
    const lean = o.fighting ? 0.55 + Math.sin(o.t * 3) * 0.15 : 0.16;
    if (!o.foe) { ctx.beginPath(); ctx.moveTo(-0.02 * s, y0 + 0.04 * s); }
    const tipX = Math.sin(lean) * 0.95 * s, tipY = y0 - Math.cos(lean) * 0.95 * s;
    if (!o.foe) { ctx.lineTo(tipX, tipY); stroke(ctx, Math.max(1, s * 0.035)); }
    if (!o.fighting && !o.foe) {
      ctx.beginPath(); ctx.moveTo(tipX, tipY + 0.02 * s); ctx.lineTo(tipX - 0.2 * s, tipY + 0.06 * s + Math.sin(o.t * 2) * 0.03 * s); ctx.lineTo(tipX - 0.02 * s, tipY + 0.12 * s);
      fill(ctx, o.color, lw * 0.7);
    }
    // torso
    ctx.beginPath();
    ctx.moveTo(-0.1 * s, y0); ctx.lineTo(0.1 * s, y0); ctx.lineTo(0.07 * s, y0 - 0.33 * s); ctx.lineTo(-0.07 * s, y0 - 0.33 * s); ctx.closePath();
    fill(ctx, o.mail ? STEEL : o.color, lw);
    head(ctx, 0.01 * s, y0 - 0.41 * s, 0.075 * s, lw);
    helmet(ctx, 0.01 * s, y0 - 0.42 * s, 0.075 * s, lw, o.foe ? "spike" : "cone");
    if (o.foe) {
      // bow held forward
      ctx.beginPath(); ctx.arc(0.16 * s, y0 - 0.2 * s, 0.17 * s, -1.25, 1.25); stroke(ctx, Math.max(1, s * 0.04));
      ctx.beginPath(); ctx.moveTo(0.16 * s + Math.cos(-1.25) * 0.17 * s, y0 - 0.2 * s + Math.sin(-1.25) * 0.17 * s);
      ctx.lineTo(0.08 * s, y0 - 0.2 * s); ctx.lineTo(0.16 * s + Math.cos(1.25) * 0.17 * s, y0 - 0.2 * s + Math.sin(1.25) * 0.17 * s);
      ctx.strokeStyle = INK; ctx.lineWidth = lw * 0.6; ctx.stroke();
      ctx.beginPath(); ctx.arc(-0.09 * s, y0 - 0.22 * s, 0.075 * s, 0, Math.PI * 2); fill(ctx, o.shield || GOLD, lw);
    } else {
      kite(ctx, 0.1 * s, y0 - 0.3 * s, 0.17 * s, 0.3 * s, o.shield || o.color, o.emblem || "#f4ead2", lw);
    }
    if (o.halo) {
      ctx.beginPath(); ctx.arc(0.01 * s, y0 - 0.44 * s, 0.14 * s, 0, Math.PI * 2);
      ctx.strokeStyle = GOLD; ctx.lineWidth = Math.max(1.2, s * 0.04); ctx.stroke();
    }
  }

  function walker(ctx, s, o, draw) {
    const lw = Math.max(0.8, s * 0.035);
    const step = Math.sin(o.t) * 0.22 * o.gait;
    const bob = Math.abs(Math.cos(o.t)) * 0.02 * s * o.gait;
    const hip = -0.45 * s - bob;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(0, hip); ctx.lineTo(Math.sin(step) * 0.45 * s, 0);
    ctx.moveTo(0, hip); ctx.lineTo(-Math.sin(step) * 0.45 * s, 0);
    stroke(ctx, Math.max(1, s * 0.06));
    draw(hip, lw);
  }

  function foot(ctx, s, o) {
    walker(ctx, s, o, (hip, lw) => {
      const sh = hip - 0.36 * s;
      // spear
      const lean = o.fighting ? 0.9 + Math.sin(o.t * 3) * 0.2 : 0.12;
      ctx.beginPath(); ctx.moveTo(0.05 * s, hip + 0.15 * s);
      const tx = 0.05 * s + Math.sin(lean) * 1.0 * s, ty = hip + 0.15 * s - Math.cos(lean) * 1.0 * s;
      ctx.lineTo(tx, ty); stroke(ctx, Math.max(0.9, s * 0.03));
      ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(tx + Math.sin(lean) * 0.08 * s, ty - Math.cos(lean) * 0.08 * s); stroke(ctx, Math.max(1.4, s * 0.06));
      // tunic
      ctx.beginPath();
      ctx.moveTo(-0.13 * s, hip + 0.08 * s); ctx.lineTo(0.13 * s, hip + 0.08 * s); ctx.lineTo(0.08 * s, sh); ctx.lineTo(-0.08 * s, sh); ctx.closePath();
      fill(ctx, o.color, lw);
      head(ctx, 0, sh - 0.08 * s, 0.08 * s, lw);
      helmet(ctx, 0, sh - 0.09 * s, 0.08 * s, lw, o.foe ? "spike" : "cone");
      if (o.foe) {
        ctx.beginPath(); ctx.arc(0.11 * s, hip - 0.18 * s, 0.1 * s, 0, Math.PI * 2); fill(ctx, o.shield || GOLD, lw);
      } else {
        kite(ctx, 0.12 * s, sh + 0.06 * s, 0.17 * s, 0.32 * s, o.shield || o.color, o.emblem || "#f4ead2", lw);
      }
    });
  }

  function archer(ctx, s, o) {
    walker(ctx, s, o, (hip, lw) => {
      const sh = hip - 0.36 * s;
      ctx.beginPath();
      ctx.moveTo(-0.13 * s, hip + 0.08 * s); ctx.lineTo(0.13 * s, hip + 0.08 * s); ctx.lineTo(0.08 * s, sh); ctx.lineTo(-0.08 * s, sh); ctx.closePath();
      fill(ctx, o.color, lw);
      head(ctx, 0, sh - 0.08 * s, 0.08 * s, lw);
      helmet(ctx, 0, sh - 0.09 * s, 0.08 * s, lw, o.foe ? "spike" : "cone");
      const draw = o.fighting ? (Math.sin(o.t * 2) + 1) * 0.06 * s : 0;
      ctx.beginPath(); ctx.arc(0.16 * s, sh + 0.12 * s, 0.22 * s, -1.2, 1.2); stroke(ctx, Math.max(1, s * 0.04));
      ctx.beginPath();
      ctx.moveTo(0.16 * s + Math.cos(-1.2) * 0.22 * s, sh + 0.12 * s + Math.sin(-1.2) * 0.22 * s);
      ctx.lineTo(0.06 * s - draw, sh + 0.12 * s);
      ctx.lineTo(0.16 * s + Math.cos(1.2) * 0.22 * s, sh + 0.12 * s + Math.sin(1.2) * 0.22 * s);
      ctx.strokeStyle = INK; ctx.lineWidth = lw * 0.6; ctx.stroke();
    });
  }

  function pilgrim(ctx, s, o) {
    walker(ctx, s, { ...o, gait: o.gait * 0.7 }, (hip, lw) => {
      const sh = hip - 0.34 * s;
      // staff
      ctx.beginPath(); ctx.moveTo(0.16 * s, 0); ctx.lineTo(0.2 * s, sh - 0.25 * s); stroke(ctx, Math.max(1, s * 0.035));
      // long robe
      ctx.beginPath();
      ctx.moveTo(-0.17 * s, -0.08 * s); ctx.lineTo(0.15 * s, -0.08 * s); ctx.lineTo(0.08 * s, sh); ctx.lineTo(-0.09 * s, sh); ctx.closePath();
      fill(ctx, o.robe || "#9c8463", lw);
      cross(ctx, -0.04 * s, sh + 0.12 * s, 0.07 * s, "#a8301d", lw * 1.2);
      head(ctx, 0.01 * s, sh - 0.08 * s, 0.08 * s, lw);
      // hood
      ctx.beginPath(); ctx.arc(0, sh - 0.09 * s, 0.1 * s, Math.PI * 1.05, Math.PI * 1.95); ctx.lineTo(-0.1 * s, sh - 0.02 * s); ctx.closePath();
      fill(ctx, o.hood || "#6f5a3e", lw);
    });
  }

  function leader(ctx, s, o) {
    // banner on a tall pole behind the rider
    const lw = Math.max(1, s * 0.035);
    const px = -0.12 * s, top = -1.95 * s, bob = Math.sin(o.t * 2) * 0.012 * s * o.gait;
    ctx.beginPath(); ctx.moveTo(px, -0.6 * s + bob); ctx.lineTo(px, top); stroke(ctx, Math.max(1.2, s * 0.04));
    const wave = (u) => Math.sin(o.t * 1.6 + u * 4) * 0.05 * s;
    ctx.beginPath();
    ctx.moveTo(px, top);
    for (let u = 0; u <= 1.001; u += 0.25) ctx.lineTo(px - u * 0.55 * s, top + wave(u));
    for (let u = 1; u >= -0.001; u -= 0.25) ctx.lineTo(px - u * 0.55 * s, top + 0.36 * s + wave(u));
    ctx.closePath(); fill(ctx, o.color, lw);
    if (!o.foe) cross(ctx, px - 0.27 * s, top + 0.2 * s + wave(0.5), 0.12 * s, o.emblem || "#f4ead2", Math.max(1.4, s * 0.05));
    knight(ctx, s, { ...o, mail: !o.foe, shield: o.foe ? undefined : o.color });
  }

  function siegeTower(ctx, s, o) {
    const lw = Math.max(1, s * 0.03);
    const w = 0.42 * s, h = 1.35 * s;
    // body
    ctx.beginPath(); ctx.rect(-w / 2, -h, w, h - 0.08 * s); fill(ctx, WOOD, lw);
    for (let i = 1; i < 5; i++) {
      ctx.beginPath(); ctx.moveTo(-w / 2, -h + (i * h) / 5); ctx.lineTo(w / 2, -h + (i * h) / 5); stroke(ctx, lw * 0.7);
    }
    ctx.beginPath(); ctx.moveTo(-w / 2, -h); ctx.lineTo(w / 2, -0.08 * s); ctx.moveTo(w / 2, -h); ctx.lineTo(-w / 2, -0.08 * s);
    ctx.strokeStyle = WOOD_DARK; ctx.lineWidth = lw * 0.8; ctx.stroke();
    // hides on the front against fire
    ctx.beginPath(); ctx.rect(w / 2 - 0.06 * s, -h + 0.1 * s, 0.07 * s, h - 0.3 * s); fill(ctx, "#c9a77c", lw * 0.7);
    // fighting platform
    ctx.beginPath(); ctx.rect(-w / 2 - 0.04 * s, -h - 0.12 * s, w + 0.08 * s, 0.12 * s); fill(ctx, WOOD_DARK, lw);
    for (let i = 0; i < 4; i++) {
      ctx.beginPath(); ctx.rect(-w / 2 - 0.04 * s + i * ((w + 0.08 * s) / 3.5), -h - 0.2 * s, 0.07 * s, 0.08 * s); fill(ctx, WOOD_DARK, lw * 0.6);
    }
    cross(ctx, 0, -h - 0.38 * s, 0.13 * s, o.color || "#a8301d", Math.max(1.5, s * 0.05));
    if (o.bridge) {
      ctx.beginPath(); ctx.moveTo(w / 2, -h + 0.05 * s); ctx.lineTo(w / 2 + 0.4 * s, -h + 0.12 * s); stroke(ctx, Math.max(2, s * 0.07));
    }
    // wheels
    for (const wx of [-w / 3, w / 3]) {
      ctx.beginPath(); ctx.arc(wx, -0.08 * s, 0.08 * s, 0, Math.PI * 2); fill(ctx, WOOD_DARK, lw);
    }
  }

  function ram(ctx, s, o) {
    const lw = Math.max(1, s * 0.03);
    const swing = o.fighting ? Math.sin(o.t * 4) * 0.06 * s : 0;
    ctx.beginPath(); ctx.moveTo(-0.45 * s, -0.12 * s); ctx.lineTo(-0.3 * s, -0.6 * s); ctx.lineTo(0.3 * s, -0.6 * s); ctx.lineTo(0.45 * s, -0.12 * s); ctx.closePath();
    fill(ctx, "#c9a77c", lw);
    ctx.beginPath(); ctx.rect(-0.35 * s + swing, -0.32 * s, 0.9 * s, 0.09 * s); fill(ctx, WOOD_DARK, lw);
    for (const wx of [-0.3, 0.3]) { ctx.beginPath(); ctx.arc(wx * s, -0.08 * s, 0.08 * s, 0, Math.PI * 2); fill(ctx, WOOD_DARK, lw); }
  }

  function tent(ctx, s, color, x = 0, y = 0) {
    const lw = Math.max(0.8, s * 0.04);
    ctx.save(); ctx.translate(x, y);
    ctx.beginPath(); ctx.moveTo(-0.32 * s, 0); ctx.lineTo(0, -0.55 * s); ctx.lineTo(0.32 * s, 0); ctx.closePath();
    fill(ctx, "#efe4cc", lw);
    ctx.beginPath(); ctx.moveTo(0, -0.55 * s); ctx.lineTo(0, 0); stroke(ctx, lw);
    ctx.beginPath(); ctx.moveTo(0, -0.55 * s); ctx.lineTo(0, -0.75 * s); ctx.lineTo(0.16 * s, -0.69 * s); ctx.lineTo(0, -0.63 * s);
    fill(ctx, color, lw * 0.6);
    ctx.restore();
  }

  // ---------- public figure entry ----------
  const KINDS = { knight, foot, archer, pilgrim, leader, siegetower: siegeTower, ram };
  function figure(ctx, kind, x, y, s, o = {}) {
    const fn = KINDS[kind];
    if (!fn) return;
    ctx.save();
    ctx.translate(x, y);
    if (o.facing < 0) ctx.scale(-1, 1);
    if (o.alpha != null) ctx.globalAlpha = o.alpha;
    fn(ctx, s, { t: 0, gait: 0, seed: 0, color: "#a8301d", ...o });
    ctx.restore();
  }

  // ---------- landmarks ----------
  function wallRun(ctx, x0, x1, base, h, lw) {
    ctx.beginPath(); ctx.rect(x0, base - h, x1 - x0, h); fill(ctx, STONE, lw);
    const n = Math.max(3, Math.round((x1 - x0) / (h * 0.45)));
    const cw = (x1 - x0) / n;
    ctx.beginPath();
    for (let i = 0; i < n; i += 2) ctx.rect(x0 + i * cw, base - h - h * 0.22, cw, h * 0.22);
    fill(ctx, STONE, lw);
  }
  function towerAt(ctx, cx, base, w, h, lw, roof) {
    ctx.beginPath(); ctx.rect(cx - w / 2, base - h, w, h); fill(ctx, STONE, lw);
    if (roof) {
      ctx.beginPath(); ctx.moveTo(cx - w * 0.62, base - h); ctx.lineTo(cx, base - h - w * 1.1); ctx.lineTo(cx + w * 0.62, base - h); ctx.closePath(); fill(ctx, ROOF, lw);
    } else {
      ctx.beginPath(); ctx.rect(cx - w / 2, base - h - w * 0.3, w * 0.3, w * 0.3); ctx.rect(cx + w * 0.2, base - h - w * 0.3, w * 0.3, w * 0.3); fill(ctx, STONE, lw);
    }
  }
  function dome(ctx, cx, base, r, color, lw, crossTop, crescentless) {
    ctx.beginPath(); ctx.rect(cx - r, base - r * 0.5, r * 2, r * 0.5); fill(ctx, STONE, lw);
    ctx.beginPath(); ctx.arc(cx, base - r * 0.5, r, Math.PI, 0); ctx.closePath(); fill(ctx, color, lw);
    if (crossTop) cross(ctx, cx, base - r * 1.5 - r * 0.35, r * 0.35, INK, lw);
  }
  function gate(ctx, cx, base, w, lw) {
    ctx.beginPath(); ctx.moveTo(cx - w / 2, base); ctx.lineTo(cx - w / 2, base - w * 0.6); ctx.arc(cx, base - w * 0.6, w / 2, Math.PI, 0); ctx.lineTo(cx + w / 2, base);
    fill(ctx, INK, 0);
  }

  const LANDMARKS = {
    walled(ctx, u, lw) {
      wallRun(ctx, -0.55 * u, 0.55 * u, 0, 0.32 * u, lw);
      towerAt(ctx, -0.5 * u, 0, 0.2 * u, 0.55 * u, lw, true);
      towerAt(ctx, 0.5 * u, 0, 0.2 * u, 0.55 * u, lw, true);
      towerAt(ctx, 0, 0, 0.22 * u, 0.7 * u, lw, false);
      gate(ctx, 0, 0, 0.13 * u, lw);
    },
    town(ctx, u, lw) {
      wallRun(ctx, -0.42 * u, 0.42 * u, 0, 0.26 * u, lw);
      towerAt(ctx, -0.18 * u, -0.05 * u, 0.18 * u, 0.5 * u, lw, true);
      ctx.beginPath(); ctx.rect(0.05 * u, -0.5 * u, 0.25 * u, 0.3 * u); fill(ctx, STONE_SHADE, lw);
      ctx.beginPath(); ctx.moveTo(0.02 * u, -0.5 * u); ctx.lineTo(0.175 * u, -0.66 * u); ctx.lineTo(0.33 * u, -0.5 * u); ctx.closePath(); fill(ctx, ROOF, lw);
    },
    cathedral(ctx, u, lw) {
      ctx.beginPath(); ctx.rect(-0.5 * u, -0.38 * u, 0.7 * u, 0.38 * u); fill(ctx, STONE, lw);
      ctx.beginPath(); ctx.moveTo(-0.55 * u, -0.38 * u); ctx.lineTo(-0.15 * u, -0.62 * u); ctx.lineTo(0.25 * u, -0.38 * u); ctx.closePath(); fill(ctx, ROOF, lw);
      ctx.beginPath(); ctx.rect(0.2 * u, -0.85 * u, 0.24 * u, 0.85 * u); fill(ctx, STONE, lw);
      ctx.beginPath(); ctx.moveTo(0.17 * u, -0.85 * u); ctx.lineTo(0.32 * u, -1.25 * u); ctx.lineTo(0.47 * u, -0.85 * u); ctx.closePath(); fill(ctx, LEAD, lw);
      cross(ctx, 0.32 * u, -1.38 * u, 0.1 * u, INK, lw);
      gate(ctx, -0.15 * u, 0, 0.12 * u, lw);
    },
    basilica(ctx, u, lw) {
      ctx.beginPath(); ctx.rect(-0.6 * u, -0.34 * u, 1.0 * u, 0.34 * u); fill(ctx, STONE, lw);
      ctx.beginPath(); ctx.moveTo(-0.66 * u, -0.34 * u); ctx.lineTo(-0.1 * u, -0.58 * u); ctx.lineTo(0.46 * u, -0.34 * u); ctx.closePath(); fill(ctx, ROOF, lw);
      ctx.beginPath(); ctx.rect(0.42 * u, -0.72 * u, 0.18 * u, 0.72 * u); fill(ctx, STONE, lw);
      ctx.beginPath(); ctx.moveTo(0.39 * u, -0.72 * u); ctx.lineTo(0.51 * u, -0.86 * u); ctx.lineTo(0.63 * u, -0.72 * u); ctx.closePath(); fill(ctx, ROOF, lw);
      cross(ctx, -0.1 * u, -0.7 * u, 0.1 * u, INK, lw);
    },
    hagia(ctx, u, lw) {
      // Land walls in front, the great church behind
      ctx.beginPath(); ctx.rect(-0.55 * u, -0.42 * u, 1.1 * u, 0.2 * u); fill(ctx, STONE_SHADE, lw);
      ctx.beginPath(); ctx.arc(-0.33 * u, -0.42 * u, 0.2 * u, Math.PI, 0); fill(ctx, LEAD, lw);
      ctx.beginPath(); ctx.arc(0.33 * u, -0.42 * u, 0.2 * u, Math.PI, 0); fill(ctx, LEAD, lw);
      ctx.beginPath(); ctx.rect(-0.3 * u, -0.62 * u, 0.6 * u, 0.22 * u); fill(ctx, STONE, lw);
      ctx.beginPath(); ctx.arc(0, -0.62 * u, 0.3 * u, Math.PI, 0); ctx.closePath(); fill(ctx, LEAD, lw);
      cross(ctx, 0, -1.05 * u, 0.11 * u, INK, lw);
      wallRun(ctx, -0.75 * u, 0.75 * u, 0, 0.24 * u, lw);
      for (const x of [-0.7, -0.25, 0.25, 0.7]) towerAt(ctx, x * u, 0, 0.14 * u, 0.36 * u, lw, false);
    },
    jerusalem(ctx, u, lw) {
      // Holy Sepulchre rotunda (left) and the gilded dome (right) above the walls
      dome(ctx, -0.32 * u, -0.26 * u, 0.24 * u, LEAD, lw, true);
      ctx.beginPath(); ctx.rect(-0.1 * u, -0.6 * u, 0.12 * u, 0.35 * u); fill(ctx, STONE, lw);
      dome(ctx, 0.36 * u, -0.26 * u, 0.22 * u, GOLD, lw, false);
      wallRun(ctx, -0.75 * u, 0.75 * u, 0, 0.3 * u, lw);
      towerAt(ctx, -0.72 * u, 0, 0.22 * u, 0.62 * u, lw, false);
      towerAt(ctx, 0.72 * u, 0, 0.18 * u, 0.48 * u, lw, false);
      gate(ctx, 0, 0, 0.14 * u, lw);
    },
    antioch(ctx, u, lw) {
      // Mount Silpius with the walls running up to the citadel
      ctx.beginPath(); ctx.moveTo(-0.8 * u, 0); ctx.lineTo(-0.1 * u, -0.95 * u); ctx.lineTo(0.7 * u, 0); ctx.closePath(); fill(ctx, "#c8b58c", lw);
      ctx.beginPath();
      for (let i = 0; i < 6; i++) { const x = -0.55 * u + i * 0.15 * u; ctx.moveTo(x, -0.1 * u); ctx.lineTo(x + 0.12 * u, -0.3 * u - (i < 3 ? i : 5 - i) * 0.1 * u); }
      ctx.strokeStyle = INK; ctx.lineWidth = lw * 0.6; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-0.7 * u, -0.05 * u); ctx.lineTo(-0.1 * u, -0.85 * u); ctx.lineTo(0.6 * u, -0.05 * u);
      ctx.strokeStyle = INK; ctx.lineWidth = lw * 2.2; ctx.stroke();
      ctx.strokeStyle = STONE; ctx.lineWidth = lw * 1.1; ctx.stroke();
      towerAt(ctx, -0.1 * u, -0.82 * u, 0.2 * u, 0.25 * u, lw, false);
      wallRun(ctx, -0.8 * u, 0.7 * u, 0, 0.22 * u, lw);
      towerAt(ctx, -0.45 * u, 0, 0.15 * u, 0.38 * u, lw, false);
      towerAt(ctx, 0.3 * u, 0, 0.15 * u, 0.38 * u, lw, false);
    },
    castle(ctx, u, lw) {
      ctx.beginPath(); ctx.moveTo(-0.6 * u, 0); ctx.quadraticCurveTo(0, -0.45 * u, 0.6 * u, 0); ctx.closePath(); fill(ctx, "#a9b58a", lw);
      wallRun(ctx, -0.35 * u, 0.35 * u, -0.2 * u, 0.25 * u, lw);
      towerAt(ctx, 0, -0.2 * u, 0.26 * u, 0.62 * u, lw, false);
      towerAt(ctx, -0.33 * u, -0.2 * u, 0.15 * u, 0.4 * u, lw, true);
      towerAt(ctx, 0.33 * u, -0.2 * u, 0.15 * u, 0.4 * u, lw, true);
    },
    citadel(ctx, u, lw) {
      ctx.beginPath(); ctx.moveTo(-0.65 * u, 0); ctx.lineTo(-0.3 * u, -0.38 * u); ctx.lineTo(0.35 * u, -0.38 * u); ctx.lineTo(0.65 * u, 0); ctx.closePath(); fill(ctx, "#c8b58c", lw);
      wallRun(ctx, -0.35 * u, 0.35 * u, -0.38 * u, 0.24 * u, lw);
      towerAt(ctx, -0.3 * u, -0.38 * u, 0.16 * u, 0.42 * u, lw, false);
      towerAt(ctx, 0.3 * u, -0.38 * u, 0.16 * u, 0.42 * u, lw, false);
      wallRun(ctx, -0.6 * u, 0.6 * u, 0, 0.18 * u, lw);
    },
    goldendome(ctx, u, lw) {
      ctx.beginPath(); ctx.moveTo(-0.5 * u, 0); ctx.lineTo(-0.5 * u, -0.3 * u); ctx.lineTo(0.5 * u, -0.3 * u); ctx.lineTo(0.5 * u, 0); ctx.closePath(); fill(ctx, "#7fa3b8", lw);
      ctx.beginPath(); ctx.rect(-0.28 * u, -0.48 * u, 0.56 * u, 0.18 * u); fill(ctx, STONE, lw);
      ctx.beginPath(); ctx.arc(0, -0.48 * u, 0.28 * u, Math.PI, 0); ctx.closePath(); fill(ctx, GOLD, lw);
    },
    rotunda(ctx, u, lw) {
      dome(ctx, 0, 0, 0.36 * u, LEAD, lw, true);
      ctx.beginPath(); ctx.rect(0.36 * u, -0.6 * u, 0.16 * u, 0.6 * u); fill(ctx, STONE, lw);
    },
    battle(ctx, u, lw) {
      const sw = (a) => {
        ctx.save(); ctx.rotate(a);
        ctx.beginPath(); ctx.moveTo(0, -0.62 * u); ctx.lineTo(0.05 * u, -0.5 * u); ctx.lineTo(0.05 * u, 0.12 * u); ctx.lineTo(-0.05 * u, 0.12 * u); ctx.lineTo(-0.05 * u, -0.5 * u); ctx.closePath();
        fill(ctx, "#d9dde2", lw);
        ctx.beginPath(); ctx.rect(-0.17 * u, 0.12 * u, 0.34 * u, 0.06 * u); fill(ctx, GOLD, lw);
        ctx.beginPath(); ctx.rect(-0.035 * u, 0.18 * u, 0.07 * u, 0.16 * u); fill(ctx, WOOD_DARK, lw);
        ctx.restore();
      };
      ctx.save(); ctx.translate(0, -0.42 * u);
      sw(-0.65); sw(0.65);
      ctx.restore();
    },
  };

  function landmark(ctx, kind, x, y, u) {
    const fn = LANDMARKS[kind];
    if (!fn) return;
    ctx.save();
    ctx.translate(x, y);
    ctx.lineJoin = "round";
    fn(ctx, u, Math.max(0.8, u * 0.035));
    ctx.restore();
  }

  return { figure, tent, landmark, cross, INK, STONE, GOLD, WOOD, WOOD_DARK };
})();
