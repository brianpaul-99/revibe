// @ts-nocheck
// Imperative canvas/WebGL runtime ported from Branding/Website-2026/js. Kept untyped on purpose:
// it is DOM and GL plumbing, and the React side only calls the exported init and its cleanup.
export function initFluid(): () => void {
  const ac = new AbortController();
  const signal = ac.signal;
  const observers = [];
  const on = (t, type, fn, o = {}) => t.addEventListener(type, fn, { ...o, signal });
  const IO = (cb, o) => { const x = new IntersectionObserver(cb, o); observers.push(x); return x; };
  const RO = cb => { const x = new ResizeObserver(cb); observers.push(x); return x; };
  const MO = cb => { const x = new MutationObserver(cb); observers.push(x); return x; };

  const hero = document.querySelector('.hero');
  const canvas = hero && hero.querySelector('.hero-ink');
  const title = document.getElementById('heroTitle');
  if (!canvas || !title) return () => {};

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = matchMedia('(pointer: coarse)').matches;
  const start = () => requestAnimationFrame(() => hero.classList.add('go'));

  const gl = canvas.getContext('webgl2', { alpha: false, antialias: false, depth: false, stencil: false, preserveDrawingBuffer: false, powerPreference: 'high-performance' });
  if (!gl || !gl.getExtension('EXT_color_buffer_float')) { hero.classList.add('no-ink'); start(); return () => {}; }

  const HEX = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255);
  const COL = { bg: HEX('#1C1917'), ink: HEX('#F2E633'), shadow: HEX('#0C0C0E'), text: HEX('#F4F4F2'), textInk: HEX('#0C0C0E'), grid: HEX('#333030') };

  const CFG = {
    sim: coarse ? 96 : 128,
    dye: coarse ? 512 : 900,
    pressureIters: 22,
    curl: 26,
    velDiss: 0.35,
    dyeDiss: 0.55,
    radius: 0.0032,
    force: 5200,
  };

  /* ---------------- GL plumbing ---------------- */
  const VS = `#version 300 es
  precision highp float;
  in vec2 aPos; uniform vec2 texel;
  out vec2 vUv, vL, vR, vT, vB;
  void main(){ vUv = aPos * .5 + .5; vL = vUv - vec2(texel.x, 0.); vR = vUv + vec2(texel.x, 0.); vT = vUv + vec2(0., texel.y); vB = vUv - vec2(0., texel.y); gl_Position = vec4(aPos, 0., 1.); }`;
  const head = `#version 300 es
  precision highp float; precision highp sampler2D;
  in vec2 vUv, vL, vR, vT, vB; out vec4 o;\n`;
  const FS = {
    splat: head + `uniform sampler2D uTarget; uniform float aspect, radius; uniform vec3 color; uniform vec2 point;
      void main(){ vec2 p = vUv - point; p.x *= aspect; vec3 s = exp(-dot(p, p) / radius) * color; o = vec4(texture(uTarget, vUv).xyz + s, 1.); }`,
    advect: head + `uniform sampler2D uVelocity, uSource; uniform vec2 texel; uniform float dt, diss;
      void main(){ vec2 c = vUv - dt * texture(uVelocity, vUv).xy * texel; o = texture(uSource, c) / (1. + diss * dt); }`,
    divergence: head + `uniform sampler2D uVelocity;
      void main(){ float L = texture(uVelocity, vL).x, R = texture(uVelocity, vR).x, T = texture(uVelocity, vT).y, B = texture(uVelocity, vB).y; vec2 C = texture(uVelocity, vUv).xy;
        if (vL.x < 0.) L = -C.x; if (vR.x > 1.) R = -C.x; if (vT.y > 1.) T = -C.y; if (vB.y < 0.) B = -C.y;
        o = vec4(.5 * (R - L + T - B), 0., 0., 1.); }`,
    curl: head + `uniform sampler2D uVelocity;
      void main(){ float L = texture(uVelocity, vL).y, R = texture(uVelocity, vR).y, T = texture(uVelocity, vT).x, B = texture(uVelocity, vB).x; o = vec4(.5 * (R - L - T + B), 0., 0., 1.); }`,
    vorticity: head + `uniform sampler2D uVelocity, uCurl; uniform float curl, dt;
      void main(){ float L = texture(uCurl, vL).x, R = texture(uCurl, vR).x, T = texture(uCurl, vT).x, B = texture(uCurl, vB).x, C = texture(uCurl, vUv).x;
        vec2 f = .5 * vec2(abs(T) - abs(B), abs(R) - abs(L)); f /= length(f) + .0001; f *= curl * C; f.y *= -1.;
        vec2 v = texture(uVelocity, vUv).xy + f * dt; o = vec4(clamp(v, -1000., 1000.), 0., 1.); }`,
    pressure: head + `uniform sampler2D uPressure, uDivergence;
      void main(){ float L = texture(uPressure, vL).x, R = texture(uPressure, vR).x, T = texture(uPressure, vT).x, B = texture(uPressure, vB).x;
        o = vec4((L + R + B + T - texture(uDivergence, vUv).x) * .25, 0., 0., 1.); }`,
    gradient: head + `uniform sampler2D uPressure, uVelocity;
      void main(){ float L = texture(uPressure, vL).x, R = texture(uPressure, vR).x, T = texture(uPressure, vT).x, B = texture(uPressure, vB).x;
        o = vec4(texture(uVelocity, vUv).xy - vec2(R - L, T - B), 0., 1.); }`,
    scale: head + `uniform sampler2D uTexture; uniform float value; void main(){ o = value * texture(uTexture, vUv); }`,
    display: head + `uniform sampler2D uDye, uMask; uniform vec2 uRes, uShadow; uniform float uCell, uAngle, uGrid, uDpr, uMaskOn;
      uniform vec3 cBg, cInk, cShadow, cText, cTextInk, cGrid;
      float inkAt(vec2 uv){ return texture(uDye, uv).r; }
      void main(){
        vec2 fc = gl_FragCoord.xy, uv = fc / uRes;
        float d = inkAt(uv);
        float fw = max(fwidth(d), .002);
        float solid = smoothstep(.34 - fw, .34 + fw, d);
        // halftone: one dye sample per cell so every dot is a clean disc
        float ca = cos(uAngle), sa = sin(uAngle); mat2 R = mat2(ca, sa, -sa, ca);
        vec2 g = (R * fc) / uCell; vec2 cell = floor(g) + .5; vec2 lp = g - cell;
        vec2 cPx = transpose(R) * (cell * uCell);
        float dc = inkAt(clamp(cPx / uRes, 0., 1.));
        float rad = clamp(sqrt(max(dc - .07, 0.)) * 1.02, 0., .74);
        float aa = 1.2 / uCell;
        float dotm = (dc > .07) ? 1. - smoothstep(rad - aa, rad + aa, length(lp)) : 0.;
        float ink = max(solid, dotm);
        // silkscreen offset plate
        float ds = inkAt(uv - uShadow);
        float sh = smoothstep(.34 - fw, .34 + fw, ds) * (1. - ink);
        vec3 col = cBg;
        vec2 gp = mod(fc, uGrid) - uGrid * .5;
        col = mix(col, cGrid, 1. - smoothstep(uDpr * .9, uDpr * 1.6, length(gp)));
        col = mix(col, cShadow, sh);
        col = mix(col, cInk, ink);
        float m = uMaskOn > .5 ? texture(uMask, uv).r : 0.;
        col = mix(col, mix(cText, cTextInk, ink), m);
        o = vec4(col, 1.);
      }`,
  };

  function compile(type, src) {
    const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  }
  const vs = compile(gl.VERTEX_SHADER, VS);
  function program(fsSrc) {
    const p = gl.createProgram();
    gl.attachShader(p, vs); gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fsSrc));
    gl.bindAttribLocation(p, 0, 'aPos'); gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    const u = {}; const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < n; i++) { const name = gl.getActiveUniform(p, i).name; u[name] = gl.getUniformLocation(p, name); }
    return { p, u };
  }
  let P;
  try { P = Object.fromEntries(Object.entries(FS).map(([k, s]) => [k, program(s)])); }
  catch (e) { console.warn('Ink shader failed, static hero', e); hero.classList.add('no-ink'); start(); return () => {}; }

  const quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  function target(w, h, ifmt, fmt) {
    gl.activeTexture(gl.TEXTURE0);
    const tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, ifmt, w, h, 0, fmt, gl.HALF_FLOAT, null);
    const fbo = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    gl.viewport(0, 0, w, h); gl.clearColor(0, 0, 0, 1); gl.clear(gl.COLOR_BUFFER_BIT);
    return { tex, fbo, w, h, tx: [1 / w, 1 / h], attach(i) { gl.activeTexture(gl.TEXTURE0 + i); gl.bindTexture(gl.TEXTURE_2D, tex); return i; } };
  }
  function double(w, h, ifmt, fmt) {
    let a = target(w, h, ifmt, fmt), b = target(w, h, ifmt, fmt);
    return { get read() { return a; }, get write() { return b; }, swap() { [a, b] = [b, a]; }, w, h, tx: a.tx };
  }
  function blit(t) {
    if (t) { gl.bindFramebuffer(gl.FRAMEBUFFER, t.fbo); gl.viewport(0, 0, t.w, t.h); }
    else { gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight); }
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
  const res = (r, aspect) => aspect >= 1 ? [Math.round(r * aspect), r] : [r, Math.round(r / aspect)];

  /* mask texture for the headline */
  const maskCv = document.createElement('canvas');
  const mctx = maskCv.getContext('2d');
  const maskTex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, maskTex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  let W = 0, H = 0, dpr = 1, vel, dye, divg, curlT, pres, fontsOk = false;

  function size() {
    const r = hero.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.round(r.width * dpr), h = Math.round(r.height * dpr);
    const changed = Math.abs(w - W) > 2 || Math.abs(h - H) > 160 * dpr;
    if (!changed && vel) return false;
    W = canvas.width = w; H = canvas.height = h;
    const aspect = w / h;
    const [sw, sh] = res(CFG.sim, aspect), [dw, dh] = res(CFG.dye, aspect);
    vel = double(sw, sh, gl.RG16F, gl.RG);
    dye = double(dw, dh, gl.R16F, gl.RED);
    divg = target(sw, sh, gl.R16F, gl.RED);
    curlT = target(sw, sh, gl.R16F, gl.RED);
    pres = double(sw, sh, gl.R16F, gl.RED);
    maskCv.width = w; maskCv.height = h;
    return true;
  }

  /* ---------------- headline mask ---------------- */
  const lines = [...title.querySelectorAll('.hl')];
  const slam = x => 1 - Math.pow(1 - Math.min(Math.max(x, 0), 1), 4); // close to the brand's Slam curve
  let introT0 = 0, introDone = false;
  const LINE_DELAY = 0.12, LINE_DUR = 0.34, INTRO_START = 0.2;

  function drawMask(now) {
    const hr = hero.getBoundingClientRect();
    const cs = getComputedStyle(title);
    const fs = parseFloat(cs.fontSize);
    mctx.setTransform(1, 0, 0, 1, 0, 0);
    mctx.clearRect(0, 0, maskCv.width, maskCv.height);
    mctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    mctx.fillStyle = '#fff';
    mctx.textBaseline = 'alphabetic';
    mctx.font = `${fs}px ${cs.fontFamily}`;
    if ('letterSpacing' in mctx) mctx.letterSpacing = cs.letterSpacing === 'normal' ? '0px' : cs.letterSpacing;
    const t = reduced ? 99 : (now - introT0) / 1000;
    let allDone = true;
    lines.forEach((el, i) => {
      const r = el.getBoundingClientRect();
      const x = r.left - hr.left, y = r.top - hr.top, h = r.height;
      const text = el.textContent.trim().toUpperCase();
      const m = mctx.measureText(text);
      const capH = m.actualBoundingBoxAscent;
      const base = y + h / 2 + capH / 2; // cap height centred in the line box, like the DOM
      const k = slam((t - INTRO_START - i * LINE_DELAY) / LINE_DUR);
      if (k < 1) allDone = false;
      if (k <= 0) return;
      mctx.save();
      mctx.beginPath(); mctx.rect(x - 20, y - h * .2, r.width + 40, h * 1.25); mctx.clip();
      mctx.fillText(text, x, base + (1 - k) * h * 1.05);
      mctx.restore();
    });
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, maskTex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, maskCv);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    return allDone;
  }

  /* ---------------- sim ---------------- */
  function splat(x, y, dx, dy, amount, radius = CFG.radius) {
    const aspect = W / H;
    gl.useProgram(P.splat.p);
    gl.uniform1i(P.splat.u.uTarget, vel.read.attach(0));
    gl.uniform1f(P.splat.u.aspect, aspect);
    gl.uniform2f(P.splat.u.point, x, y);
    gl.uniform3f(P.splat.u.color, dx, dy, 0);
    gl.uniform1f(P.splat.u.radius, radius);
    blit(vel.write); vel.swap();
    gl.uniform1i(P.splat.u.uTarget, dye.read.attach(0));
    gl.uniform3f(P.splat.u.color, amount, 0, 0);
    gl.uniform1f(P.splat.u.radius, radius * 1.15);
    blit(dye.write); dye.swap();
  }

  function step(dt) {
    gl.disable(gl.BLEND);
    gl.useProgram(P.curl.p); gl.uniform2fv(P.curl.u.texel, vel.tx);
    gl.uniform1i(P.curl.u.uVelocity, vel.read.attach(0)); blit(curlT);

    gl.useProgram(P.vorticity.p); gl.uniform2fv(P.vorticity.u.texel, vel.tx);
    gl.uniform1i(P.vorticity.u.uVelocity, vel.read.attach(0)); gl.uniform1i(P.vorticity.u.uCurl, curlT.attach(1));
    gl.uniform1f(P.vorticity.u.curl, CFG.curl); gl.uniform1f(P.vorticity.u.dt, dt); blit(vel.write); vel.swap();

    gl.useProgram(P.divergence.p); gl.uniform2fv(P.divergence.u.texel, vel.tx);
    gl.uniform1i(P.divergence.u.uVelocity, vel.read.attach(0)); blit(divg);

    gl.useProgram(P.scale.p); gl.uniform2fv(P.scale.u.texel, vel.tx);
    gl.uniform1i(P.scale.u.uTexture, pres.read.attach(0)); gl.uniform1f(P.scale.u.value, 0.8); blit(pres.write); pres.swap();

    gl.useProgram(P.pressure.p); gl.uniform2fv(P.pressure.u.texel, vel.tx);
    gl.uniform1i(P.pressure.u.uDivergence, divg.attach(0));
    for (let i = 0; i < CFG.pressureIters; i++) { gl.uniform1i(P.pressure.u.uPressure, pres.read.attach(1)); blit(pres.write); pres.swap(); }

    gl.useProgram(P.gradient.p); gl.uniform2fv(P.gradient.u.texel, vel.tx);
    gl.uniform1i(P.gradient.u.uPressure, pres.read.attach(0)); gl.uniform1i(P.gradient.u.uVelocity, vel.read.attach(1)); blit(vel.write); vel.swap();

    gl.useProgram(P.advect.p); gl.uniform2fv(P.advect.u.texel, vel.tx); gl.uniform1f(P.advect.u.dt, dt);
    gl.uniform1i(P.advect.u.uVelocity, vel.read.attach(0)); gl.uniform1i(P.advect.u.uSource, vel.read.attach(0));
    gl.uniform1f(P.advect.u.diss, CFG.velDiss); blit(vel.write); vel.swap();

    gl.uniform1i(P.advect.u.uVelocity, vel.read.attach(0)); gl.uniform1i(P.advect.u.uSource, dye.read.attach(1));
    gl.uniform1f(P.advect.u.diss, CFG.dyeDiss); blit(dye.write); dye.swap();
  }

  let boilAngle = 0.26, boilIx = -1;
  function render(now, maskOn) {
    const b = Math.floor(now / 125); // 8 drawings per second
    if (b !== boilIx) { boilIx = b; boilAngle = 0.2618 + [0, 0.012, -0.009][b % 3]; }
    gl.useProgram(P.display.p);
    const u = P.display.u;
    gl.uniform2fv(u.texel, [1 / W, 1 / H]);
    gl.uniform1i(u.uDye, dye.read.attach(0));
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, maskTex); gl.uniform1i(u.uMask, 1);
    gl.uniform2f(u.uRes, W, H);
    gl.uniform2f(u.uShadow, (6 * dpr) / W, (-6 * dpr) / H);
    gl.uniform1f(u.uCell, (coarse ? 6 : 7) * dpr);
    gl.uniform1f(u.uAngle, boilAngle);
    gl.uniform1f(u.uGrid, 28 * dpr);
    gl.uniform1f(u.uDpr, dpr);
    gl.uniform1f(u.uMaskOn, maskOn ? 1 : 0);
    gl.uniform3fv(u.cBg, COL.bg); gl.uniform3fv(u.cInk, COL.ink); gl.uniform3fv(u.cShadow, COL.shadow);
    gl.uniform3fv(u.cText, COL.text); gl.uniform3fv(u.cTextInk, COL.textInk); gl.uniform3fv(u.cGrid, COL.grid);
    blit(null);
  }

  /* ---------------- input ---------------- */
  const pointer = { x: 0, y: 0, px: 0, py: 0, moved: false, down: false, seen: false };
  function onMove(cx, cy) {
    const r = hero.getBoundingClientRect();
    if (cy < r.top || cy > r.bottom) return;
    const x = (cx - r.left) / r.width, y = 1 - (cy - r.top) / r.height;
    if (!pointer.seen) { pointer.px = x; pointer.py = y; pointer.seen = true; }
    pointer.x = x; pointer.y = y; pointer.moved = true;
    lastInput = performance.now();
  }
  on(window, 'pointermove', e => { if (e.pointerType !== 'touch') onMove(e.clientX, e.clientY); }, { passive: true });
  on(hero, 'touchstart', e => { const t = e.touches[0]; pointer.seen = false; onMove(t.clientX, t.clientY); }, { passive: true });
  on(hero, 'touchmove', e => { const t = e.touches[0]; onMove(t.clientX, t.clientY); }, { passive: true });
  on(hero, 'pointerdown', e => {
    const r = hero.getBoundingClientRect();
    burst((e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height, 0.9);
  });

  // click / tap: a small starburst of ink
  const bursts = [];
  function burst(x, y, amt = 1) { bursts.push({ x, y, amt }); }

  let lastScroll = window.scrollY, scrollKick = 0;
  on(window, 'scroll', () => { const y = window.scrollY; scrollKick += y - lastScroll; lastScroll = y; }, { passive: true });

  /* ---------------- loop ---------------- */
  const IDLE_RESET_MS = 1500;
  let dead = false, textOn = false, running = false, visible = true, last = 0, lastInput = 0, simT = 0, frameN = 0;
  let rafId = 0, suspendedAt = 0;
  const hudF = hero.querySelector('.hud-f');
  // ink nozzles that keep the field alive when nobody is touching it
  const nozzles = [
    { ax: .36, ay: .32, fx: .11, fy: .17, px: 0, py: 1.3, amt: .28 },
    { ax: .30, ay: .30, fx: .085, fy: .13, px: 2.2, py: .4, amt: .24 },
  ];
  const nozzlePos = (n, t) => [.5 + n.ax * Math.sin(t * n.fx * Math.PI * 2 + n.px), .5 + n.ay * Math.sin(t * n.fy * Math.PI * 2 + n.py)];

  function clearTarget(t) {
    if (!t) return;
    gl.bindFramebuffer(gl.FRAMEBUFFER, t.fbo);
    gl.viewport(0, 0, t.w, t.h);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }

  // A suspended tab can retain a queued animation frame. Reset the GPU state and
  // input deltas before resuming so that wake-up never creates a second loop or a
  // giant fluid impulse.
  function resetAfterIdle(now = performance.now()) {
    if (!vel || !dye) return;
    [vel.read, vel.write, dye.read, dye.write, divg, curlT, pres && pres.read, pres && pres.write].forEach(clearTarget);
    pointer.moved = false;
    pointer.seen = false;
    bursts.length = 0;
    scrollKick = 0;
    lastScroll = window.scrollY;
    simT = 0;
    frameN = 0;
    boilIx = -1;
    lastInput = now;
    if (textOn) {
      introT0 = now;
      introDone = false;
      drawMask(now);
    }
    burst(.68, .55, 1.25);
    render(now, textOn);
  }

  function scheduleFrame() {
    if (running && !rafId) rafId = requestAnimationFrame(frame);
  }

  function frame(now) {
    rafId = 0;
    if (!running) return;
    const gap = now - last;
    if (gap > IDLE_RESET_MS) resetAfterIdle(now);
    const dt = gap > IDLE_RESET_MS ? 1 / 60 : Math.min(Math.max(gap / 1000, 1 / 240), 1 / 30); last = now;
    if (size() && textOn) { drawMask(now); introDone = false; }
    simT += dt;

    // intro: the starburst of ink
    if (bursts.length) {
      for (const b of bursts.splice(0)) {
        const n = 14;
        for (let i = 0; i < n; i++) {
          const a = (i / n) * Math.PI * 2 + (i % 2) * 0.1;
          const sp = (i % 2 ? 0.55 : 1) * 900 * b.amt;
          splat(b.x + Math.cos(a) * 0.01, b.y + Math.sin(a) * 0.01 * (W / H), Math.cos(a) * sp, Math.sin(a) * sp, 0.55 * b.amt, CFG.radius * 0.9);
        }
      }
    }

    // pointer
    if (pointer.moved) {
      const dx = (pointer.x - pointer.px) * CFG.force, dy = (pointer.y - pointer.py) * CFG.force / (W / H);
      if (Math.abs(dx) + Math.abs(dy) > 0.5) splat(pointer.x, pointer.y, dx, dy, Math.min(0.9, 0.25 + Math.hypot(dx, dy) * 0.0008));
      pointer.px = pointer.x; pointer.py = pointer.y; pointer.moved = false;
    }

    // nozzles: always on, quieter while someone is stirring
    if (!reduced) {
      const idle = now - lastInput > 1800 ? 1 : 0.35;
      for (const n of nozzles) {
        const [x0, y0] = nozzlePos(n, simT - dt), [x1, y1] = nozzlePos(n, simT);
        splat(x1, y1, (x1 - x0) / dt * 7, (y1 - y0) / dt * 7, n.amt * idle * dt * 9, CFG.radius * 0.7);
      }
      // a punch every few seconds, somewhere away from the headline
      if (Math.floor(simT / 3.4) !== Math.floor((simT - dt) / 3.4)) {
        const x = .55 + Math.random() * .38, y = .45 + Math.random() * .4;
        burst(x, y, 0.55 * idle + 0.2);
      }
    }

    // scrolling pushes the ink up the page
    if (Math.abs(scrollKick) > 1) {
      const k = Math.max(-80, Math.min(80, scrollKick));
      for (let i = 0; i < 4; i++) splat(0.12 + i * 0.25, 0.08, 0, k * 18, 0, CFG.radius * 6);
      scrollKick = 0;
    }

    step(dt);
    if (textOn && !introDone) introDone = drawMask(now);
    render(now, textOn);

    if (++frameN % 5 === 0 && hudF) hudF.textContent = 'F ' + String(Math.floor(now / 1000 * 12) % 10000).padStart(4, '0');
    scheduleFrame();
  }

  function play() {
    if (dead || running || !visible || document.hidden || reduced) return;
    running = true;
    last = performance.now();
    scheduleFrame();
  }
  function pause() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
    if (!suspendedAt) suspendedAt = performance.now();
  }
  function wake(forceReset = false) {
    const now = performance.now();
    const idleFor = suspendedAt ? now - suspendedAt : now - last;
    if (forceReset || idleFor > IDLE_RESET_MS) resetAfterIdle(now);
    suspendedAt = 0;
    if (running) last = now;
    else play();
  }

  IO(([e]) => { visible = e.isIntersecting; visible ? play() : pause(); }, { threshold: 0 }).observe(hero);
  on(document, 'visibilitychange', () => (document.hidden ? pause() : wake()));
  on(window, 'pagehide', pause);
  on(window, 'pageshow', e => wake(e.persisted));
  on(window, 'focus', () => wake());
  let rT; on(window, 'resize', () => { clearTimeout(rT); rT = setTimeout(() => { if (!running) { size(); if (textOn) drawMask(performance.now()); render(performance.now(), textOn); } else if (textOn) drawMask(performance.now()); }, 120); });

  const fonts = document.fonts ? Promise.race([document.fonts.load(`400 100px ${getComputedStyle(title).fontFamily}`), new Promise(r => setTimeout(r, 1200))]) : Promise.resolve();
  // the ink starts straight away; the headline joins as soon as Bebas is ready (or after 1.2s)
  if (!reduced) { size(); burst(.68, .55, 1.25); play(); }
  fonts.then(() => {
    if (dead) return;
    fontsOk = true;
    size();
    textOn = true;
    hero.classList.add('ink-live');
    introT0 = performance.now();
    introDone = false;
    if (reduced) {
      // one still composition, no loop
      burst(.72, .55, 1.1); burst(.85, .3, .7);
      for (let i = 0; i < 90; i++) {
        if (i === 0) for (const b of bursts.splice(0)) for (let k = 0; k < 14; k++) { const a = k / 14 * Math.PI * 2; splat(b.x, b.y, Math.cos(a) * 700 * b.amt, Math.sin(a) * 700 * b.amt, .6 * b.amt); }
        step(1 / 60);
      }
      drawMask(performance.now()); render(0, true);
    }
    start();
  });

  return () => { dead = true; pause(); clearTimeout(rT); ac.abort(); observers.forEach(o => o.disconnect()); };
}
