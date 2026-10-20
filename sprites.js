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
    if (o.chest) cross(ctx, 0, y0 - 0.17 * s, 0.09 * s, o.chest, Math.max(1, s * 0.035));
    head(ctx, 0.01 * s, y0 - 0.41 * s, 0.075 * s, lw);
    if (o.crown) crown(ctx, 0.01 * s, y0 - 0.47 * s, 0.08 * s, lw);
    else helmet(ctx, 0.01 * s, y0 - 0.42 * s, 0.075 * s, lw, o.foe ? "spike" : "cone");
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
    if (o.mark) emblemMark(ctx, o.mark, px - 0.27 * s, top + 0.18 * s + wave(0.5), 0.13 * s, o.color2 || GOLD, lw);
    else if (!o.foe) cross(ctx, px - 0.27 * s, top + 0.2 * s + wave(0.5), 0.12 * s, o.emblem || "#f4ead2", Math.max(1.4, s * 0.05));
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


  function crown(ctx, cx, base, r, lw) {
    ctx.beginPath();
    ctx.moveTo(cx - r, base); ctx.lineTo(cx - r, base - r * 0.9); ctx.lineTo(cx - r * 0.5, base - r * 0.45);
    ctx.lineTo(cx, base - r * 1.1); ctx.lineTo(cx + r * 0.5, base - r * 0.45); ctx.lineTo(cx + r, base - r * 0.9); ctx.lineTo(cx + r, base);
    ctx.closePath(); fill(ctx, GOLD, lw * 0.8);
  }

  // Small devices for banners, shields and portraits.
  function emblemMark(ctx, kind, x, y, r, color, lw) {
    ctx.save();
    if (kind === "lions") {
      for (const dy of [-0.45, 0.35]) {
        ctx.beginPath(); ctx.ellipse(x, y + dy * r, r * 0.55, r * 0.2, 0, 0, Math.PI * 2); fill(ctx, color, lw * 0.5);
        ctx.beginPath(); ctx.arc(x + r * 0.55, y + dy * r - r * 0.12, r * 0.16, 0, Math.PI * 2); fill(ctx, color, lw * 0.5);
      }
    } else if (kind === "lilies") {
      for (const [dx, dy] of [[-0.5, -0.4], [0.5, -0.4], [0, 0.45]]) {
        const cx = x + dx * r, cy = y + dy * r, q = r * 0.22;
        ctx.beginPath(); ctx.ellipse(cx, cy - q, q * 0.45, q, 0, 0, Math.PI * 2);
        ctx.ellipse(cx - q * 0.8, cy, q * 0.4, q * 0.7, -0.8, 0, Math.PI * 2);
        ctx.ellipse(cx + q * 0.8, cy, q * 0.4, q * 0.7, 0.8, 0, Math.PI * 2);
        ctx.fillStyle = color; ctx.fill();
      }
    } else if (kind === "eagle") {
      ctx.beginPath();
      ctx.moveTo(x, y - r * 0.7); ctx.lineTo(x + r * 0.15, y - r * 0.2); ctx.lineTo(x + r * 0.85, y - r * 0.45); ctx.lineTo(x + r * 0.3, y + r * 0.15);
      ctx.lineTo(x + r * 0.25, y + r * 0.7); ctx.lineTo(x, y + r * 0.4); ctx.lineTo(x - r * 0.25, y + r * 0.7); ctx.lineTo(x - r * 0.3, y + r * 0.15);
      ctx.lineTo(x - r * 0.85, y - r * 0.45); ctx.lineTo(x - r * 0.15, y - r * 0.2); ctx.closePath();
      ctx.fillStyle = INK; ctx.fill();
    } else if (kind === "keys") {
      for (const a of [-0.6, 0.6]) {
        ctx.save(); ctx.translate(x, y); ctx.rotate(a);
        ctx.beginPath(); ctx.moveTo(0, -r * 0.8); ctx.lineTo(0, r * 0.6); ctx.strokeStyle = color; ctx.lineWidth = Math.max(1, r * 0.14); ctx.stroke();
        ctx.beginPath(); ctx.arc(0, r * 0.75, r * 0.18, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, -r * 0.8); ctx.lineTo(r * 0.25, -r * 0.8); ctx.moveTo(0, -r * 0.6); ctx.lineTo(r * 0.2, -r * 0.6); ctx.stroke();
        ctx.restore();
      }
    } else if (kind === "templar") {
      cross(ctx, x, y + r * 0.2, r * 0.75, "#a8301d", Math.max(1.4, r * 0.28));
    } else if (kind === "hospitaller") {
      cross(ctx, x, y + r * 0.2, r * 0.75, "#f4ead2", Math.max(1.4, r * 0.28));
    } else if (kind !== "none") {
      cross(ctx, x, y + r * 0.2, r * 0.75, color, Math.max(1.4, r * 0.22));
    }
    ctx.restore();
  }

  function robe(ctx, s, hip, sh, color, lw, wide) {
    const w = wide || 0.17;
    ctx.beginPath();
    ctx.moveTo(-w * s, -0.04 * s); ctx.lineTo(w * s, -0.04 * s); ctx.lineTo(0.08 * s, sh); ctx.lineTo(-0.08 * s, sh); ctx.closePath();
    fill(ctx, color, lw);
  }

  function arm(ctx, s, sh, raised, t, lw) {
    const a = raised ? -1.9 + Math.sin(t * 1.5) * 0.25 : 0.35;
    ctx.beginPath(); ctx.moveTo(0.04 * s, sh + 0.05 * s);
    ctx.lineTo(0.04 * s + Math.cos(a) * 0.28 * s, sh + 0.05 * s + Math.sin(a) * 0.28 * s);
    stroke(ctx, Math.max(1.2, s * 0.06));
    ctx.beginPath(); ctx.arc(0.04 * s + Math.cos(a) * 0.3 * s, sh + 0.05 * s + Math.sin(a) * 0.3 * s, 0.035 * s, 0, Math.PI * 2); fill(ctx, SKIN, lw * 0.6);
  }

  function pope(ctx, s, o) {
    walker(ctx, s, { ...o, gait: o.gait * 0.5 }, (hip, lw) => {
      const sh = hip - 0.4 * s;
      // processional cross staff
      ctx.beginPath(); ctx.moveTo(-0.16 * s, 0); ctx.lineTo(-0.16 * s, sh - 0.4 * s); stroke(ctx, Math.max(1, s * 0.035));
      cross(ctx, -0.16 * s, sh - 0.48 * s, 0.1 * s, GOLD, Math.max(1.2, s * 0.04));
      robe(ctx, s, hip, sh, "#f6f1e4", lw, 0.2);
      ctx.beginPath(); ctx.moveTo(-0.15 * s, hip + 0.05 * s); ctx.lineTo(0.15 * s, hip + 0.05 * s); ctx.lineTo(0.09 * s, sh); ctx.lineTo(-0.09 * s, sh); ctx.closePath();
      fill(ctx, "#a8301d", lw);
      // pallium
      ctx.beginPath(); ctx.moveTo(-0.07 * s, sh + 0.02 * s); ctx.lineTo(0, sh + 0.1 * s); ctx.lineTo(0.07 * s, sh + 0.02 * s); ctx.moveTo(0, sh + 0.1 * s); ctx.lineTo(0, hip);
      ctx.strokeStyle = "#f6f1e4"; ctx.lineWidth = Math.max(1.2, s * 0.04); ctx.stroke();
      arm(ctx, s, sh, o.fighting, o.t, lw);
      head(ctx, 0, sh - 0.08 * s, 0.08 * s, lw);
      // conical papal cap with a gold band
      ctx.beginPath(); ctx.moveTo(-0.075 * s, sh - 0.11 * s); ctx.quadraticCurveTo(0, sh - 0.42 * s, 0.075 * s, sh - 0.11 * s); ctx.closePath(); fill(ctx, "#f6f1e4", lw);
      ctx.beginPath(); ctx.rect(-0.075 * s, sh - 0.15 * s, 0.15 * s, 0.04 * s); fill(ctx, GOLD, lw * 0.6);
    });
  }

  function bishop(ctx, s, o) {
    walker(ctx, s, { ...o, gait: o.gait * 0.6 }, (hip, lw) => {
      const sh = hip - 0.38 * s;
      // crozier
      ctx.beginPath(); ctx.moveTo(0.18 * s, 0); ctx.lineTo(0.18 * s, sh - 0.3 * s); ctx.arc(0.23 * s, sh - 0.3 * s, 0.05 * s, Math.PI, Math.PI * 2.6);
      ctx.strokeStyle = GOLD; ctx.lineWidth = Math.max(1, s * 0.04); ctx.stroke();
      robe(ctx, s, hip, sh, "#f6f1e4", lw);
      ctx.beginPath(); ctx.moveTo(-0.14 * s, hip); ctx.quadraticCurveTo(0, hip + 0.1 * s, 0.14 * s, hip); ctx.lineTo(0.08 * s, sh); ctx.lineTo(-0.08 * s, sh); ctx.closePath();
      fill(ctx, o.color || "#94701f", lw);
      cross(ctx, 0, hip - 0.18 * s, 0.07 * s, GOLD, lw);
      if (o.fighting) arm(ctx, s, sh, true, o.t, lw);
      head(ctx, 0, sh - 0.08 * s, 0.08 * s, lw);
      // low two-horned mitre
      ctx.beginPath(); ctx.moveTo(-0.08 * s, sh - 0.12 * s); ctx.lineTo(-0.08 * s, sh - 0.24 * s); ctx.lineTo(0, sh - 0.17 * s); ctx.lineTo(0.08 * s, sh - 0.24 * s); ctx.lineTo(0.08 * s, sh - 0.12 * s); ctx.closePath();
      fill(ctx, "#f6f1e4", lw);
    });
  }

  function priest(ctx, s, o) {
    walker(ctx, s, { ...o, gait: o.gait * 0.6 }, (hip, lw) => {
      const sh = hip - 0.36 * s;
      if (o.seed % 2 === 0) {
        ctx.beginPath(); ctx.moveTo(0.15 * s, 0.02 * s); ctx.lineTo(0.15 * s, sh - 0.42 * s); stroke(ctx, Math.max(1, s * 0.035));
        cross(ctx, 0.15 * s, sh - 0.5 * s, 0.12 * s, GOLD, Math.max(1.3, s * 0.045));
      }
      robe(ctx, s, hip, sh, o.color && o.color !== "#a8301d" ? o.color : "#4a3b2c", lw);
      ctx.beginPath(); ctx.rect(-0.05 * s, sh + 0.02 * s, 0.1 * s, (hip - sh) * 0.9); fill(ctx, "#f6f1e4", lw * 0.6);
      if (o.seed % 2 === 1) { ctx.beginPath(); ctx.rect(0.06 * s, hip - 0.25 * s, 0.1 * s, 0.08 * s); fill(ctx, "#a8301d", lw * 0.7); }
      if (o.fighting) arm(ctx, s, sh, true, o.t + o.seed, lw);
      head(ctx, 0, sh - 0.08 * s, 0.08 * s, lw);
      ctx.beginPath(); ctx.arc(0, sh - 0.11 * s, 0.085 * s, Math.PI * 1.05, Math.PI * 1.95); ctx.strokeStyle = "#4a3426"; ctx.lineWidth = Math.max(1, s * 0.03); ctx.stroke();
    });
  }

  const CROWD = ["#9c8463", "#7d5b3a", "#5f6e4a", "#8a6a8a", "#6f7f91", "#a8744a", "#c2a878", "#7a4b3b"];
  function crowdFig(ctx, s, o) {
    walker(ctx, s, { ...o, gait: o.gait * 0.8 }, (hip, lw) => {
      const sh = hip - 0.34 * s;
      const c = CROWD[o.seed % CROWD.length];
      const woman = o.seed % 3 === 0;
      if (woman) { ctx.beginPath(); ctx.moveTo(-0.16 * s, -0.04 * s); ctx.lineTo(0.16 * s, -0.04 * s); ctx.lineTo(0.08 * s, sh); ctx.lineTo(-0.08 * s, sh); ctx.closePath(); fill(ctx, c, lw); }
      else { ctx.beginPath(); ctx.moveTo(-0.13 * s, hip + 0.1 * s); ctx.lineTo(0.13 * s, hip + 0.1 * s); ctx.lineTo(0.08 * s, sh); ctx.lineTo(-0.08 * s, sh); ctx.closePath(); fill(ctx, c, lw); }
      if (o.cross || o.seed % 4 === 1) cross(ctx, -0.02 * s, sh + 0.12 * s, 0.06 * s, "#a8301d", lw * 1.2);
      arm(ctx, s, sh, o.fighting && o.seed % 2 === 0, o.t + o.seed, lw);
      head(ctx, 0, sh - 0.08 * s, 0.08 * s, lw);
      if (woman) {
        ctx.beginPath(); ctx.arc(0, sh - 0.09 * s, 0.1 * s, Math.PI, 0); ctx.lineTo(0.1 * s, sh); ctx.lineTo(-0.1 * s, sh); ctx.closePath(); fill(ctx, "#efe7d6", lw);
      } else if (o.seed % 5 === 2) {
        ctx.beginPath(); ctx.arc(0, sh - 0.11 * s, 0.085 * s, Math.PI, 0); ctx.closePath(); fill(ctx, "#5c4630", lw);
      }
    });
  }

  function crossbow(ctx, s, o) {
    walker(ctx, s, o, (hip, lw) => {
      const sh = hip - 0.36 * s;
      ctx.beginPath(); ctx.moveTo(-0.13 * s, hip + 0.08 * s); ctx.lineTo(0.13 * s, hip + 0.08 * s); ctx.lineTo(0.08 * s, sh); ctx.lineTo(-0.08 * s, sh); ctx.closePath();
      fill(ctx, o.color, lw);
      if (!o.foe) cross(ctx, -0.01 * s, hip - 0.18 * s, 0.06 * s, "#f4ead2", lw);
      head(ctx, 0, sh - 0.08 * s, 0.08 * s, lw);
      // kettle helmet
      ctx.beginPath(); ctx.arc(0, sh - 0.11 * s, 0.085 * s, Math.PI, 0); ctx.lineTo(0.13 * s, sh - 0.1 * s); ctx.lineTo(-0.13 * s, sh - 0.1 * s); ctx.closePath(); fill(ctx, STEEL, lw);
      const aim = o.fighting ? -0.12 + Math.sin(o.t * 1.3) * 0.05 : 0.5;
      ctx.save(); ctx.translate(0.05 * s, sh + 0.08 * s); ctx.rotate(aim);
      ctx.beginPath(); ctx.moveTo(-0.08 * s, 0); ctx.lineTo(0.32 * s, 0); stroke(ctx, Math.max(1.2, s * 0.05));
      ctx.beginPath(); ctx.moveTo(0.28 * s, -0.13 * s); ctx.quadraticCurveTo(0.34 * s, 0, 0.28 * s, 0.13 * s); stroke(ctx, Math.max(1, s * 0.035));
      ctx.restore();
    });
  }

  function ship(ctx, s, o) {
    const lw = Math.max(1, s * 0.025);
    const bob = Math.sin(o.t * 0.5 + o.seed) * 0.03 * s;
    ctx.save(); ctx.translate(0, bob);
    // hull
    ctx.beginPath();
    ctx.moveTo(-0.6 * s, -0.32 * s); ctx.quadraticCurveTo(-0.5 * s, 0, -0.2 * s, 0); ctx.lineTo(0.25 * s, 0);
    ctx.quadraticCurveTo(0.55 * s, 0, 0.65 * s, -0.34 * s); ctx.lineTo(0.42 * s, -0.24 * s); ctx.lineTo(-0.4 * s, -0.24 * s); ctx.closePath();
    fill(ctx, o.foe ? "#7a6a52" : WOOD, lw);
    ctx.beginPath(); ctx.moveTo(-0.45 * s, -0.14 * s); ctx.lineTo(0.48 * s, -0.14 * s); ctx.strokeStyle = WOOD_DARK; ctx.lineWidth = lw; ctx.stroke();
    // shields along the rail
    for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc(-0.3 * s + i * 0.15 * s, -0.27 * s, 0.045 * s, 0, Math.PI * 2); fill(ctx, i % 2 ? o.color : "#efe2c4", lw * 0.5); }
    // mast and sail
    ctx.beginPath(); ctx.moveTo(0, -0.24 * s); ctx.lineTo(0, -1.05 * s); stroke(ctx, Math.max(1.2, s * 0.03));
    const billow = Math.sin(o.t * 0.8) * 0.02 * s;
    ctx.beginPath(); ctx.moveTo(-0.3 * s, -0.95 * s); ctx.lineTo(0.3 * s, -0.95 * s); ctx.quadraticCurveTo(0.36 * s + billow, -0.65 * s, 0.3 * s, -0.4 * s);
    ctx.lineTo(-0.3 * s, -0.4 * s); ctx.quadraticCurveTo(-0.24 * s + billow, -0.65 * s, -0.3 * s, -0.95 * s); ctx.closePath();
    fill(ctx, o.foe ? "#efe7d6" : "#f4ead2", lw);
    if (!o.foe) cross(ctx, 0.02 * s, -0.68 * s, 0.17 * s, o.color, Math.max(1.5, s * 0.05));
    else { ctx.beginPath(); ctx.rect(-0.3 * s, -0.75 * s, 0.6 * s, 0.07 * s); ctx.fillStyle = o.color; ctx.fill(); }
    // pennant
    ctx.beginPath(); ctx.moveTo(0, -1.05 * s); ctx.lineTo(-0.2 * s, -1.0 * s + Math.sin(o.t * 2) * 0.02 * s); ctx.lineTo(0, -0.97 * s); fill(ctx, o.color, lw * 0.6);
    ctx.restore();
    // water line
    ctx.beginPath();
    for (let x = -0.7; x <= 0.7; x += 0.2) { ctx.moveTo(x * s, 0.02 * s); ctx.quadraticCurveTo((x + 0.05) * s, -0.02 * s, (x + 0.1) * s, 0.02 * s); }
    ctx.strokeStyle = "#7f988c"; ctx.lineWidth = lw; ctx.stroke();
  }

  function trebuchet(ctx, s, o) {
    const lw = Math.max(1, s * 0.03);
    // frame
    ctx.beginPath(); ctx.moveTo(-0.4 * s, 0); ctx.lineTo(0, -0.62 * s); ctx.lineTo(0.4 * s, 0);
    ctx.moveTo(-0.5 * s, 0); ctx.lineTo(0.5 * s, 0);
    ctx.strokeStyle = WOOD_DARK; ctx.lineWidth = Math.max(2, s * 0.06); ctx.stroke();
    // beam swings when firing
    const cyc = o.fighting ? (o.t * 0.35 + o.seed) % (Math.PI * 2) : 0;
    const ang = o.fighting ? -0.9 + Math.max(0, Math.sin(cyc)) * 2.1 : -0.9;
    const px = 0, py = -0.62 * s;
    const lx = px + Math.cos(Math.PI + ang) * 0.75 * s, ly = py + Math.sin(Math.PI + ang) * 0.75 * s;
    const sx = px + Math.cos(ang) * 0.32 * s, sy = py + Math.sin(ang) * 0.32 * s;
    ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(sx, sy); ctx.strokeStyle = WOOD; ctx.lineWidth = Math.max(2, s * 0.05); ctx.stroke();
    // counterweight box
    ctx.beginPath(); ctx.rect(sx - 0.1 * s, sy, 0.2 * s, 0.2 * s); fill(ctx, WOOD_DARK, lw);
    // sling
    ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx - 0.05 * s, ly + 0.2 * s); ctx.strokeStyle = INK; ctx.lineWidth = lw * 0.7; ctx.stroke();
    ctx.beginPath(); ctx.arc(lx - 0.05 * s, ly + 0.22 * s, 0.04 * s, 0, Math.PI * 2); fill(ctx, "#8b8170", lw * 0.5);
    ctx.beginPath(); ctx.arc(0, -0.62 * s, 0.03 * s, 0, Math.PI * 2); fill(ctx, INK, 0);
  }

  const king = (ctx, s, o) => leader(ctx, s, { ...o, crown: true, mark: o.mark || o.device });
  const templar = (ctx, s, o) => knight(ctx, s, { ...o, color: "#f2ede0", shield: "#f2ede0", emblem: "#a8301d", chest: "#a8301d" });
  const hospitaller = (ctx, s, o) => knight(ctx, s, { ...o, color: "#2a2622", shield: "#2a2622", emblem: "#f4ead2", chest: "#f4ead2" });

  // ---------- portraits: a bust in a roundel ----------
  function portrait(ctx, p, x, y, r) {
    p = p || {};
    const c1 = p.color || "#a8301d", c2 = p.color2 || GOLD;
    const lw = Math.max(1, r * 0.04);
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fillStyle = "#efe2c4"; ctx.fill();
    ctx.save(); ctx.clip();
    // ground stripes like a tapestry backdrop
    ctx.fillStyle = "#e3d2ab"; ctx.fillRect(-r, r * 0.25, r * 2, r);
    const k = p.kind || "knight";
    // shoulders
    const garment = k === "templar" ? "#f2ede0" : k === "monk" || k === "hermit" ? (p.color || "#6f5a3e") : c1;
    ctx.beginPath(); ctx.moveTo(-r * 0.85, r * 1.05); ctx.quadraticCurveTo(-r * 0.75, r * 0.3, 0, r * 0.25); ctx.quadraticCurveTo(r * 0.75, r * 0.3, r * 0.85, r * 1.05); ctx.closePath();
    fill(ctx, garment, lw);
    if (k === "emperor") {
      ctx.beginPath(); ctx.moveTo(-r * 0.12, r * 0.28); ctx.lineTo(-r * 0.12, r); ctx.lineTo(r * 0.12, r); ctx.lineTo(r * 0.12, r * 0.28); ctx.closePath(); fill(ctx, GOLD, lw * 0.6);
      for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(0, r * (0.42 + i * 0.18), r * 0.04, 0, Math.PI * 2); ctx.fillStyle = "#a8301d"; ctx.fill(); }
    }
    if (k === "pope") {
      ctx.beginPath(); ctx.moveTo(-r * 0.4, r * 0.32); ctx.lineTo(0, r * 0.55); ctx.lineTo(r * 0.4, r * 0.32); ctx.moveTo(0, r * 0.55); ctx.lineTo(0, r);
      ctx.strokeStyle = "#f6f1e4"; ctx.lineWidth = r * 0.12; ctx.stroke();
      cross(ctx, 0, r * 0.8, r * 0.06, INK, lw);
    }
    if (k === "templar" || k === "knight" || k === "king") {
      // mail at the neck for fighting men
      if (k !== "king") { ctx.beginPath(); ctx.arc(0, r * 0.22, r * 0.3, 0, Math.PI); fill(ctx, STEEL, lw); }
    }
    const em = p.emblem || (k === "templar" ? "templar" : k === "pope" ? "keys" : k === "sultan" || k === "queen" || k === "monk" || k === "hermit" ? "none" : "cross");
    if (em !== "none" && k !== "pope") emblemMark(ctx, em, 0, r * 0.62, r * 0.24, k === "templar" ? "#a8301d" : c2, lw);
    if (k === "pope") emblemMark(ctx, "keys", r * 0.45, r * 0.65, r * 0.18, GOLD, lw);
    // neck and head
    ctx.beginPath(); ctx.rect(-r * 0.1, r * 0.05, r * 0.2, r * 0.25); fill(ctx, SKIN, lw);
    ctx.beginPath(); ctx.ellipse(0, -r * 0.12, r * 0.27, r * 0.32, 0, 0, Math.PI * 2); fill(ctx, SKIN, lw);
    // eyes, nose, mouth
    ctx.fillStyle = INK;
    ctx.beginPath(); ctx.arc(-r * 0.1, -r * 0.16, r * 0.03, 0, Math.PI * 2); ctx.arc(r * 0.1, -r * 0.16, r * 0.03, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.moveTo(0, -r * 0.14); ctx.lineTo(-r * 0.03, -r * 0.03); ctx.lineTo(r * 0.02, -r * 0.02); ctx.strokeStyle = INK; ctx.lineWidth = lw * 0.6; ctx.stroke();
    if (p.beard || k === "hermit") {
      ctx.beginPath(); ctx.moveTo(-r * 0.25, -r * 0.08); ctx.quadraticCurveTo(-r * 0.22, r * (k === "hermit" ? 0.45 : 0.25), 0, r * (k === "hermit" ? 0.5 : 0.28));
      ctx.quadraticCurveTo(r * 0.22, r * (k === "hermit" ? 0.45 : 0.25), r * 0.25, -r * 0.08); ctx.lineTo(r * 0.12, r * 0.02); ctx.lineTo(-r * 0.12, r * 0.02); ctx.closePath();
      fill(ctx, p.hair || (k === "hermit" ? "#c9c0b0" : "#6b4a2b"), lw * 0.7);
    } else {
      ctx.beginPath(); ctx.moveTo(-r * 0.06, r * 0.05); ctx.lineTo(r * 0.06, r * 0.05); ctx.stroke();
    }
    // headwear
    const hair = p.hair || "#5c4027";
    if (k === "king" || k === "queen" || k === "emperor") {
      if (k === "queen") {
        ctx.beginPath(); ctx.arc(0, -r * 0.18, r * 0.33, Math.PI * 1.02, Math.PI * 1.98); ctx.lineTo(r * 0.36, r * 0.3); ctx.lineTo(r * 0.26, r * 0.3); ctx.lineTo(r * 0.24, -r * 0.1);
        ctx.quadraticCurveTo(0, -r * 0.38, -r * 0.24, -r * 0.1); ctx.lineTo(-r * 0.26, r * 0.3); ctx.lineTo(-r * 0.36, r * 0.3); ctx.closePath(); fill(ctx, "#f4efe3", lw);
      } else {
        ctx.beginPath(); ctx.arc(0, -r * 0.2, r * 0.28, Math.PI, 0); ctx.closePath(); fill(ctx, hair, lw * 0.7);
      }
      ctx.beginPath();
      const b = -r * 0.36, w = r * 0.3;
      ctx.moveTo(-w, b); ctx.lineTo(-w, b - r * 0.2); ctx.lineTo(-w * 0.5, b - r * 0.1); ctx.lineTo(0, b - r * 0.26); ctx.lineTo(w * 0.5, b - r * 0.1); ctx.lineTo(w, b - r * 0.2); ctx.lineTo(w, b); ctx.closePath();
      fill(ctx, GOLD, lw);
      if (k === "emperor") {
        for (const sx of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sx * w * 0.95, b); ctx.lineTo(sx * w * 0.95, b + r * 0.32); ctx.strokeStyle = GOLD; ctx.lineWidth = lw * 1.4; ctx.stroke(); }
        ctx.beginPath(); ctx.arc(0, b - r * 0.12, r * 0.04, 0, Math.PI * 2); ctx.fillStyle = "#a8301d"; ctx.fill();
      }
    } else if (k === "pope") {
      ctx.beginPath(); ctx.moveTo(-r * 0.27, -r * 0.3); ctx.quadraticCurveTo(0, -r * 1.2, r * 0.27, -r * 0.3); ctx.closePath(); fill(ctx, "#f6f1e4", lw);
      ctx.beginPath(); ctx.rect(-r * 0.27, -r * 0.4, r * 0.54, r * 0.09); fill(ctx, GOLD, lw * 0.7);
    } else if (k === "bishop") {
      ctx.beginPath(); ctx.moveTo(-r * 0.27, -r * 0.32); ctx.lineTo(-r * 0.27, -r * 0.72); ctx.lineTo(0, -r * 0.52); ctx.lineTo(r * 0.27, -r * 0.72); ctx.lineTo(r * 0.27, -r * 0.32); ctx.closePath();
      fill(ctx, "#f6f1e4", lw);
      ctx.beginPath(); ctx.moveTo(0, -r * 0.52); ctx.lineTo(0, -r * 0.32); ctx.strokeStyle = GOLD; ctx.lineWidth = lw * 1.5; ctx.stroke();
    } else if (k === "monk" || k === "hermit") {
      ctx.beginPath(); ctx.arc(0, -r * 0.12, r * 0.42, Math.PI * 1.05, Math.PI * 1.95); ctx.lineTo(r * 0.42, r * 0.35); ctx.lineTo(r * 0.28, r * 0.3);
      ctx.lineTo(r * 0.28, -r * 0.1); ctx.quadraticCurveTo(0, -r * 0.55, -r * 0.28, -r * 0.1); ctx.lineTo(-r * 0.28, r * 0.3); ctx.lineTo(-r * 0.42, r * 0.35); ctx.closePath();
      fill(ctx, garment, lw);
    } else if (k === "sultan") {
      ctx.beginPath(); ctx.ellipse(0, -r * 0.42, r * 0.36, r * 0.2, 0, 0, Math.PI * 2); fill(ctx, "#f4efe3", lw);
      ctx.beginPath(); ctx.moveTo(-r * 0.33, -r * 0.42); ctx.quadraticCurveTo(0, -r * 0.3, r * 0.33, -r * 0.46); ctx.strokeStyle = c2; ctx.lineWidth = lw * 1.5; ctx.stroke();
      ctx.beginPath(); ctx.arc(0, -r * 0.6, r * 0.09, 0, Math.PI * 2); fill(ctx, c1, lw * 0.7);
    } else {
      // knight, templar: conical helmet with nasal over a mail coif
      ctx.beginPath(); ctx.arc(0, -r * 0.12, r * 0.33, Math.PI * 0.95, Math.PI * 2.05); ctx.lineTo(r * 0.3, r * 0.22); ctx.lineTo(r * 0.22, r * 0.22); ctx.lineTo(r * 0.24, -r * 0.05);
      ctx.quadraticCurveTo(0, -r * 0.38, -r * 0.24, -r * 0.05); ctx.lineTo(-r * 0.22, r * 0.22); ctx.lineTo(-r * 0.3, r * 0.22); ctx.closePath();
      fill(ctx, "#a9afb6", lw);
      ctx.beginPath(); ctx.moveTo(-r * 0.3, -r * 0.3); ctx.lineTo(0, -r * 0.82); ctx.lineTo(r * 0.3, -r * 0.3); ctx.closePath(); fill(ctx, STEEL, lw);
      ctx.beginPath(); ctx.rect(-r * 0.035, -r * 0.32, r * 0.07, r * 0.26); fill(ctx, STEEL, lw * 0.6);
    }
    ctx.restore();
    ctx.beginPath(); ctx.arc(0, 0, r - lw / 2, 0, Math.PI * 2); ctx.strokeStyle = INK; ctx.lineWidth = lw * 1.5; ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 0, r - lw * 3, 0, Math.PI * 2); ctx.strokeStyle = c2; ctx.lineWidth = lw; ctx.stroke();
    ctx.restore();
  }

  // ---------- public figure entry ----------
  const KINDS = { knight, foot, archer, pilgrim, leader, siegetower: siegeTower, ram, king, templar, hospitaller, crossbow, pope, bishop, priest, crowd: crowdFig, ship, trebuchet };
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
    port(ctx, u, lw) {
      ctx.beginPath(); ctx.rect(-0.7 * u, -0.12 * u, 0.9 * u, 0.12 * u); fill(ctx, STONE_SHADE, lw);
      towerAt(ctx, 0.35 * u, 0, 0.22 * u, 0.62 * u, lw, false);
      wallRun(ctx, -0.3 * u, 0.25 * u, -0.12 * u, 0.22 * u, lw);
      ctx.save(); ctx.translate(-0.5 * u, -0.1 * u);
      ctx.beginPath(); ctx.moveTo(-0.22 * u, -0.08 * u); ctx.quadraticCurveTo(0, 0.05 * u, 0.22 * u, -0.08 * u); ctx.closePath(); fill(ctx, WOOD, lw);
      ctx.beginPath(); ctx.moveTo(0, -0.08 * u); ctx.lineTo(0, -0.45 * u); stroke(ctx, lw);
      ctx.beginPath(); ctx.moveTo(0, -0.42 * u); ctx.lineTo(0.16 * u, -0.2 * u); ctx.lineTo(0, -0.14 * u); ctx.closePath(); fill(ctx, "#f4ead2", lw);
      ctx.restore();
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

  return { figure, tent, landmark, portrait, emblemMark, cross, INK, STONE, GOLD, WOOD, WOOD_DARK };
})();
