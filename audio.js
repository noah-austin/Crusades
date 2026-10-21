// Sound: narration playback plus music and effects synthesized with Web Audio (no audio files
// except the narration). Everything goes through one AudioContext so pausing freezes it all.
window.Sound = (() => {
  let ctx = null, master, comp, musicBus, sfxBus, voiceBus, ambBus;
  let noise = null;
  let muted = false;
  const cache = new Map();
  const loops = {};
  let mood = "calm", moodLevel = {};
  let nextChant = 0, nextPulse = 0, nextHoof = 0, nextStep = 0, nextCrackle = 0, nextMurmur = 0;
  let voiceActive = 0;
  let meterNode = null;
  const amb = { wind: 0.5, sea: 0, fire: 0, crowd: 0, gallop: 0, march: 0, battle: 0 };

  function init() {
    if (ctx) return ctx;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -16; comp.ratio.value = 3; comp.attack.value = 0.01; comp.release.value = 0.25;
    master = ctx.createGain(); master.gain.value = 0.9;
    master.connect(comp); comp.connect(ctx.destination);
    meterNode = ctx.createAnalyser(); meterNode.fftSize = 2048; comp.connect(meterNode);
    musicBus = bus(0.55); sfxBus = bus(0.7); voiceBus = bus(1.0); ambBus = bus(0.6);
    noise = makeNoise();
    buildLoops();
    buildMusic();
    setMood("title");
    return ctx;
  }
  function bus(v) { const g = ctx.createGain(); g.gain.value = v; g.connect(master); return g; }
  function makeNoise() {
    const b = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return b;
  }
  function noiseSrc(loop = true) {
    const s = ctx.createBufferSource(); s.buffer = noise; s.loop = loop;
    s.loopStart = Math.random(); s.start(ctx.currentTime, Math.random() * 1.5);
    return s;
  }
  const now = () => (ctx ? ctx.currentTime : 0);
  const ramp = (param, v, tc = 0.4) => param.setTargetAtTime(v, now(), tc);

  // ---------- continuous ambience ----------
  function buildLoops() {
    // wind: band-passed noise with a slow swell
    loops.wind = noiseLoop({ type: "bandpass", f: 420, q: 0.6 }, 0, 0.07, 0.11);
    // sea: low rolling noise
    loops.sea = noiseLoop({ type: "lowpass", f: 520, q: 0.4 }, 0, 0.12, 0.35);
    // fire: rumble under the crackle
    loops.fire = noiseLoop({ type: "lowpass", f: 300, q: 0.5 }, 0, 0.6, 0.15);
    // crowd: two vowel-ish noise bands
    loops.crowd = noiseLoop({ type: "bandpass", f: 520, q: 1.4 }, 0, 0.9, 0.2);
    loops.crowd2 = noiseLoop({ type: "bandpass", f: 1150, q: 2 }, 0, 1.3, 0.3);
    // battle: distant din
    loops.battle = noiseLoop({ type: "bandpass", f: 900, q: 0.7 }, 0, 0.7, 0.4);
  }
  function noiseLoop(filt, level, lfoRate, lfoDepth) {
    const src = noiseSrc();
    const f = ctx.createBiquadFilter(); f.type = filt.type; f.frequency.value = filt.f; f.Q.value = filt.q;
    const g = ctx.createGain(); g.gain.value = level;
    const lfoGain = ctx.createGain(); lfoGain.gain.value = 0;
    const lfo = ctx.createOscillator(); lfo.frequency.value = lfoRate;
    const lfoAmt = ctx.createGain(); lfoAmt.gain.value = lfoDepth;
    lfo.connect(lfoAmt); lfoAmt.connect(lfoGain.gain);
    src.connect(f); f.connect(g); g.connect(lfoGain); lfoGain.connect(ambBus);
    lfoGain.gain.value = 1; lfo.start();
    return { g, f };
  }

  // ---------- music ----------
  const D = 73.42; // D2
  const SCALE = [0, 2, 3, 5, 7, 9, 10, 12, 14, 15, 17, 19]; // D dorian
  const music = {};
  function buildMusic() {
    // drone: open fifth on D with a slowly breathing filter
    music.drone = ctx.createGain(); music.drone.gain.value = 0;
    const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 520; lp.Q.value = 0.8;
    for (const [m, type, g] of [[1, "sawtooth", 0.16], [1.5, "sawtooth", 0.1], [2, "triangle", 0.12], [0.5, "sine", 0.22]]) {
      const o = ctx.createOscillator(); o.type = type; o.frequency.value = D * m; o.detune.value = (Math.random() - 0.5) * 8;
      const og = ctx.createGain(); og.gain.value = g;
      o.connect(og); og.connect(lp); o.start();
    }
    const lfo = ctx.createOscillator(); lfo.frequency.value = 0.05;
    const la = ctx.createGain(); la.gain.value = 220;
    lfo.connect(la); la.connect(lp.frequency); lfo.start();
    lp.connect(music.drone); music.drone.connect(musicBus);
    // choir pad: detuned saws through vowel formants
    music.choir = ctx.createGain(); music.choir.gain.value = 0;
    const f1 = formant(700, 6), f2 = formant(1150, 8), f3 = formant(2600, 10);
    const mixIn = ctx.createGain(); mixIn.gain.value = 0.25;
    for (const semi of [12, 15, 19, 24]) {
      for (const det of [-7, 6]) {
        const o = ctx.createOscillator(); o.type = "sawtooth"; o.frequency.value = D * Math.pow(2, semi / 12); o.detune.value = det;
        o.connect(mixIn); o.start();
      }
    }
    for (const f of [f1, f2, f3]) { mixIn.connect(f.in); f.out.connect(music.choir); }
    music.choir.connect(musicBus);
    // reverb for chant and bells
    music.verb = makeVerb(3.2);
    music.verb.connect(musicBus);
  }
  function formant(freq, q) {
    const f = ctx.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = freq; f.Q.value = q;
    const g = ctx.createGain(); g.gain.value = freq > 2000 ? 0.4 : 1;
    f.connect(g);
    return { in: f, out: g };
  }
  function makeVerb(seconds) {
    const len = Math.floor(ctx.sampleRate * seconds);
    const b = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = b.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
    }
    const conv = ctx.createConvolver(); conv.buffer = b;
    const wet = ctx.createGain(); wet.gain.value = 0.55;
    conv.connect(wet);
    wet.input = conv;
    return Object.assign(wet, { input: conv });
  }

  const MOODS = {
    calm: { drone: 0.5, choir: 0.0, chant: 0.6, pulse: 0 },
    march: { drone: 0.55, choir: 0.0, chant: 0.35, pulse: 0.5 },
    battle: { drone: 0.7, choir: 0.0, chant: 0.0, pulse: 1 },
    holy: { drone: 0.4, choir: 0.5, chant: 0.9, pulse: 0 },
    dark: { drone: 0.65, choir: 0.15, chant: 0.25, pulse: 0.25 },
    title: { drone: 0.6, choir: 0.35, chant: 0.7, pulse: 0 },
  };
  function setMood(m) {
    if (!ctx || !MOODS[m]) return;
    mood = m;
    moodLevel = MOODS[m];
    ramp(music.drone.gain, moodLevel.drone * 0.5, 1.5);
    ramp(music.choir.gain, moodLevel.choir * 0.16, 2);
  }

  // A plainchant-like line: one soft vowel note at a time in D dorian, stepwise.
  let chantStep = 4;
  function chantNote(t) {
    chantStep = Math.max(0, Math.min(SCALE.length - 1, chantStep + [-2, -1, -1, 0, 1, 1, 2][Math.floor(Math.random() * 7)]));
    const f = D * 4 * Math.pow(2, SCALE[chantStep] / 12) / 2;
    const dur = 1.6 + Math.random() * 1.6;
    const o = ctx.createOscillator(); o.type = "sawtooth"; o.frequency.value = f;
    const vib = ctx.createOscillator(); vib.frequency.value = 5; const va = ctx.createGain(); va.gain.value = 2.5;
    vib.connect(va); va.connect(o.detune);
    const g = ctx.createGain(); g.gain.value = 0;
    const lvl = 0.05 * moodLevel.chant;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(lvl, t + 0.35); g.gain.setValueAtTime(lvl, t + dur - 0.4); g.gain.linearRampToValueAtTime(0, t + dur);
    const fa = formant(650, 7), fb = formant(1080, 9);
    o.connect(fa.in); o.connect(fb.in); fa.out.connect(g); fb.out.connect(g);
    g.connect(musicBus); g.connect(music.verb.input);
    o.start(t); vib.start(t); o.stop(t + dur + 0.05); vib.stop(t + dur + 0.05);
    return dur;
  }

  // ---------- one-shot effects ----------
  function env(g, t, a, peak, d) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
  }
  function oneNoise(t, { type = "bandpass", f = 1000, f2, q = 1, peak = 0.3, a = 0.005, d = 0.2, out = sfxBus }) {
    const s = noiseSrc(false);
    const fl = ctx.createBiquadFilter(); fl.type = type; fl.frequency.setValueAtTime(f, t); fl.Q.value = q;
    if (f2) fl.frequency.exponentialRampToValueAtTime(f2, t + a + d);
    const g = ctx.createGain(); env(g, t, a, peak, d);
    s.connect(fl); fl.connect(g); g.connect(out);
    s.stop(t + a + d + 0.05);
  }
  function tone(t, { f, f2, type = "sine", peak = 0.3, a = 0.005, d = 0.3, out = sfxBus }) {
    const o = ctx.createOscillator(); o.type = type; o.frequency.setValueAtTime(f, t);
    if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + a + d);
    const g = ctx.createGain(); env(g, t, a, peak, d);
    o.connect(g); g.connect(out); o.start(t); o.stop(t + a + d + 0.05);
  }
  const FX = {
    arrow(t) { oneNoise(t, { type: "bandpass", f: 3200, f2: 700, q: 3, peak: 0.12, a: 0.02, d: 0.32 }); },
    clash(t) {
      const base = 900 + Math.random() * 600;
      for (const r of [1, 1.47, 2.09, 2.76, 3.41]) tone(t, { f: base * r, type: "triangle", peak: 0.05, d: 0.25 + Math.random() * 0.35 });
      oneNoise(t, { type: "highpass", f: 2500, peak: 0.18, d: 0.06 });
    },
    thud(t) { tone(t, { f: 110, f2: 38, peak: 0.5, d: 0.45 }); oneNoise(t, { type: "lowpass", f: 400, peak: 0.25, d: 0.3 }); },
    hoof(t) { tone(t, { f: 160 + Math.random() * 40, f2: 60, peak: 0.12, d: 0.08 }); oneNoise(t, { type: "bandpass", f: 1200, q: 2, peak: 0.05, d: 0.04 }); },
    step(t) { oneNoise(t, { type: "lowpass", f: 700, peak: 0.08, d: 0.07 }); },
    drum(t) { tone(t, { f: 95, f2: 45, peak: 0.35, d: 0.5 }); oneNoise(t, { type: "lowpass", f: 900, peak: 0.08, d: 0.12 }); },
    crackle(t) { oneNoise(t, { type: "highpass", f: 2000 + Math.random() * 3000, peak: 0.06 + Math.random() * 0.08, a: 0.001, d: 0.02 + Math.random() * 0.03 }); },
    murmur(t) { oneNoise(t, { type: "bandpass", f: 300 + Math.random() * 700, q: 6, peak: 0.05, a: 0.15, d: 0.5 + Math.random() * 0.6, out: ambBus }); },
    whoosh(t, strength = 1) { oneNoise(t, { type: "bandpass", f: 300, f2: 1600, q: 0.8, peak: 0.1 * strength, a: 0.9, d: 1.4 }); },
    boom(t) {
      tone(t, { f: 62, f2: 40, peak: 0.6, a: 0.01, d: 2.6 });
      oneNoise(t, { type: "lowpass", f: 260, peak: 0.28, a: 0.01, d: 1.8 });
      oneNoise(t, { type: "bandpass", f: 1800, f2: 300, q: 0.6, peak: 0.05, a: 0.4, d: 1.6, out: music.verb.input });
    },
    bell(t, f = 196) {
      for (const [r, p, d] of [[0.5, 0.12, 5], [1, 0.16, 4], [1.19, 0.08, 3], [1.5, 0.07, 3], [2, 0.08, 2.4], [2.52, 0.05, 1.8], [3.01, 0.04, 1.4]]) {
        tone(t, { f: f * r, peak: p, a: 0.003, d, out: sfxBus });
        tone(t, { f: f * r, peak: p * 0.6, a: 0.003, d, out: music.verb.input });
      }
    },
    cheer(t) { for (let i = 0; i < 6; i++) FX.murmur(t + i * 0.08); oneNoise(t, { type: "bandpass", f: 900, q: 1, peak: 0.12, a: 0.4, d: 1.2, out: ambBus }); },
    splash(t) { oneNoise(t, { type: "lowpass", f: 1400, f2: 300, peak: 0.2, a: 0.02, d: 0.8 }); },
  };
  let lastFx = {};
  function play(name, opts) {
    if (!ctx || !FX[name]) return;
    const t = now();
    const gap = { arrow: 0.07, clash: 0.09, thud: 0.15, splash: 0.3 }[name] || 0;
    if (gap && t - (lastFx[name] || 0) < gap) return;
    lastFx[name] = t;
    FX[name](t + 0.01, opts);
  }

  // ---------- ambience control + rhythmic scheduler ----------
  function setAmbience(o) { Object.assign(amb, o); }
  function tick() {
    if (!ctx || ctx.state !== "running") return;
    const t = now();
    ramp(loops.wind.g.gain, amb.wind * 0.07, 0.8);
    ramp(loops.sea.g.gain, amb.sea * 0.16, 0.8);
    ramp(loops.fire.g.gain, amb.fire * 0.12, 0.5);
    ramp(loops.crowd.g.gain, amb.crowd * 0.07, 0.6);
    ramp(loops.crowd2.g.gain, amb.crowd * 0.03, 0.6);
    ramp(loops.battle.g.gain, amb.battle * 0.05, 0.5);
    ramp(musicBus.gain, (voiceActive > t ? 0.32 : 0.6), 0.6);
    const ahead = t + 0.25;
    // chant notes
    if (moodLevel.chant > 0 && nextChant < ahead) {
      const d = chantNote(Math.max(nextChant, t + 0.05));
      nextChant = Math.max(nextChant, t) + d + (Math.random() < 0.3 ? 1.2 : 0.15);
    }
    // war-drum pulse
    if (moodLevel.pulse > 0 && nextPulse < ahead) {
      const at = Math.max(nextPulse, t + 0.02);
      tone(at, { f: 70, f2: 42, peak: 0.22 * moodLevel.pulse, d: 0.7, out: musicBus });
      nextPulse = at + (mood === "battle" ? 0.75 : 1.5);
    }
    // hooves in a gallop pattern
    if (amb.gallop > 0.05 && nextHoof < ahead) {
      const at = Math.max(nextHoof, t + 0.02);
      for (const off of [0, 0.09, 0.2]) FX.hoof(at + off);
      nextHoof = at + 0.42 / Math.max(0.6, amb.gallop);
    }
    // marching: drum on the beat, feet between
    if (amb.march > 0.05 && nextStep < ahead) {
      const at = Math.max(nextStep, t + 0.02);
      FX.drum(at); FX.step(at + 0.3);
      nextStep = at + 0.6;
    }
    if (amb.fire > 0.05 && nextCrackle < ahead) {
      const at = Math.max(nextCrackle, t + 0.01);
      FX.crackle(at);
      nextCrackle = at + 0.03 + Math.random() * 0.18 / amb.fire;
    }
    if (amb.crowd > 0.05 && nextMurmur < ahead) {
      const at = Math.max(nextMurmur, t + 0.01);
      FX.murmur(at);
      nextMurmur = at + 0.12 + Math.random() * 0.3;
    }
  }

  // ---------- narration ----------
  function load(url) {
    if (!cache.has(url)) {
      cache.set(url, fetch(url)
        .then((r) => { if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); })
        .then((b) => new Promise((res, rej) => ctx.decodeAudioData(b, res, rej)))
        .catch(() => null));
    }
    return cache.get(url);
  }
  let voiceSrc = null;
  function playVoice(buffer, delay = 0.05) {
    stopVoice();
    const at = now() + delay;
    const s = ctx.createBufferSource(); s.buffer = buffer; s.connect(voiceBus); s.start(at);
    voiceSrc = s;
    voiceActive = at + buffer.duration;
    return at;
  }
  function stopVoice() {
    if (voiceSrc) { try { voiceSrc.stop(); } catch (e) {} voiceSrc = null; }
    voiceActive = 0;
  }

  return {
    init,
    get ctx() { return ctx; },
    now,
    resume() { return ctx && ctx.state !== "running" ? ctx.resume() : Promise.resolve(); },
    suspend() { return ctx && ctx.state === "running" ? ctx.suspend() : Promise.resolve(); },
    get running() { return !!ctx && ctx.state === "running"; },
    setMuted(v) { muted = v; if (master) ramp(master.gain, v ? 0 : 0.9, 0.1); },
    get muted() { return muted; },
    setMood, setAmbience, tick, play, load, playVoice, stopVoice,
    // Output level (RMS), for checking that sound is actually playing.
    level() {
      if (!meterNode) return 0;
      const d = new Float32Array(meterNode.fftSize); meterNode.getFloatTimeDomainData(d);
      let s = 0; for (const v of d) s += v * v;
      return Math.sqrt(s / d.length);
    },
  };
})();
