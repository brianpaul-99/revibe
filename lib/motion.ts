// @ts-nocheck
// Imperative canvas/WebGL runtime ported from Branding/Website-2026/js. Kept untyped on purpose:
// it is DOM and GL plumbing, and the React side only calls the exported init and its cleanup.
import { Skull3D } from './skull3d';

export function initMotion(): () => void {
  const ac = new AbortController();
  const signal = ac.signal;
  const observers = [];
  const on = (t, type, fn, o = {}) => t.addEventListener(type, fn, { ...o, signal });
  const IO = (cb, o) => { const x = new IntersectionObserver(cb, o); observers.push(x); return x; };
  const RO = cb => { const x = new ResizeObserver(cb); observers.push(x); return x; };
  const MO = cb => { const x = new MutationObserver(cb); observers.push(x); return x; };

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, k) => a + (b - a) * k;
  const C = { studio: '#1C1917', void: '#0C0C0E', onyx: '#262320', ash: '#333030', yellow: '#F2E633', bone: '#F4F4F2', slate: '#6B6B73', slateT: '#A4A4AC' };
  const E = {
    slam: x => 1 - Math.pow(1 - clamp(x), 4),
    snap: x => 1 - Math.pow(1 - clamp(x), 3),
    punch: x => { x = clamp(x); const c = 2.2; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); },
  };
  function rng(seed) { let s = (seed * 9301 + 49297) % 233280 || 1; return () => (s = (s * 16807) % 2147483647) / 2147483647; }

  /* ---------------- one ticker for everything ---------------- */
  const tasks = new Set();
  const IDLE_GAP_MS = 1500;
  let ticking = false, rafId = 0, lastReal = 0, suspendedAt = 0, timeOffset = 0;
  const animationNow = () => performance.now() - timeOffset;
  function tick(realNow) {
    rafId = 0;
    if (!tasks.size) { ticking = false; return; }
    if (lastReal && realNow - lastReal > IDLE_GAP_MS) timeOffset += realNow - lastReal;
    lastReal = realNow;
    const now = realNow - timeOffset;
    for (const t of tasks) { try { t(now); } catch (e) { tasks.delete(t); console.error(e); } }
    if (tasks.size && !document.hidden) rafId = requestAnimationFrame(tick);
    else ticking = false;
  }
  function startTicker() {
    if (ticking || !tasks.size || document.hidden) return;
    ticking = true;
    lastReal = performance.now();
    rafId = requestAnimationFrame(tick);
  }
  function pauseTicker() {
    ticking = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
    if (!suspendedAt) suspendedAt = performance.now();
  }
  function resumeTicker() {
    const now = performance.now();
    if (suspendedAt) timeOffset += Math.max(0, now - suspendedAt);
    else if (lastReal && now - lastReal > IDLE_GAP_MS) timeOffset += now - lastReal;
    suspendedAt = 0;
    lastReal = now;
    startTicker();
  }
  function addTask(fn) { tasks.add(fn); startTicker(); return () => tasks.delete(fn); }
  on(document, 'visibilitychange', () => (document.hidden ? pauseTicker() : resumeTicker()));
  on(window, 'pagehide', pauseTicker);
  on(window, 'pageshow', resumeTicker);
  on(window, 'focus', resumeTicker);
  const onTwos = now => Math.floor(now / (1000 / 12));
  const boilIx = now => Math.floor(now / 125); // 8 drawings a second, the library's boil rate

  function watch(el, cb, opts = { threshold: 0 }) {
    const io = IO(es => es.forEach(e => cb(e.isIntersecting, e)), opts);
    io.observe(el); return io;
  }

  /* ---------------- starburst ---------------- */
  function burstD(spikes, seed, inner = 0.62, rot = 0, r = 96) {
    const R = rng(seed + 11); let d = '';
    for (let i = 0; i < spikes * 2; i++) {
      const a = rot + (i / (spikes * 2)) * Math.PI * 2 + (R() - 0.5) * 0.14;
      const rr = i % 2 ? r * inner * (0.86 + R() * 0.28) : r * (0.84 + R() * 0.16);
      d += (i ? 'L' : 'M') + (Math.cos(a) * rr).toFixed(1) + ' ' + (Math.sin(a) * rr).toFixed(1);
    }
    return d + 'Z';
  }
  function burstPath2D(cx, cy, r, spikes, seed, inner = 0.62, rot = 0) {
    const R = rng(seed + 11); const p = new Path2D();
    for (let i = 0; i < spikes * 2; i++) {
      const a = rot + (i / (spikes * 2)) * Math.PI * 2 + (R() - 0.5) * 0.14;
      const rr = i % 2 ? r * inner * (0.86 + R() * 0.28) : r * (0.84 + R() * 0.3);
      i ? p.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr) : p.moveTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
    }
    p.closePath(); return p;
  }
  $$('svg.burst').forEach((svg, k) => {
    const path = svg.querySelector('path');
    const spikes = +svg.dataset.spikes || 14, inner = +svg.dataset.inner || 0.62;
    let vis = false, last = -1;
    const draw = b => path.setAttribute('d', burstD(spikes, b * 7 + k * 101, inner, (b * 1.5 * Math.PI) / 180));
    draw(0);
    if (reduced) return;
    watch(svg, v => (vis = v));
    addTask(now => { if (!vis) return; const b = boilIx(now); if (b !== last) { last = b; draw(b); } });
  });

  /* ---------------- grain (toner) ---------------- */
  (() => {
    const g = $('.grain'); if (!g) return;
    const cv = document.createElement('canvas'); cv.width = cv.height = 180;
    const x = cv.getContext('2d'); const img = x.createImageData(180, 180); const R = rng(7);
    for (let i = 0; i < img.data.length; i += 4) { const v = R() > 0.5 ? 255 : 0; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = R() > 0.55 ? 255 : 0; }
    x.putImageData(img, 0, 0);
    g.style.backgroundImage = `url(${cv.toDataURL()})`;
    if (reduced) return;
    let last = -1; const offs = [[0, 0], [-61, 37], [43, -89]];
    addTask(now => { const b = boilIx(now); if (b === last) return; last = b; const o = offs[b % 3]; g.style.transform = `translate(${o[0]}px, ${o[1]}px)`; });
  })();

  /* ---------------- nav, menu, progress ---------------- */
  (() => {
    const nav = $('#nav'), burger = $('.nav-burger'), menu = $('#menu'), bar = $('.progress span');
    let lastY = scrollY, menuOpen = false;
    const onScroll = () => {
      const y = scrollY, heroH = $('.hero').offsetHeight;
      nav.classList.toggle('solid', y > heroH - 80 || menuOpen);
      if (!menuOpen) nav.classList.toggle('hide', y > lastY && y > 400);
      lastY = y;
      const max = document.documentElement.scrollHeight - innerHeight;
      // stepped progress: the bar moves in 1/48ths
      bar.style.transform = `scaleX(${Math.round(clamp(y / max) * 48) / 48})`;
    };
    on(window, 'scroll', onScroll, { passive: true }); onScroll();

    const setMenu = open => {
      menuOpen = open;
      burger.setAttribute('aria-expanded', open); burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      nav.classList.toggle('menu-open', open); nav.classList.remove('hide');
      document.body.style.overflow = open ? 'hidden' : '';
      if (open) { menu.hidden = false; requestAnimationFrame(() => requestAnimationFrame(() => menu.classList.add('open'))); }
      else { menu.classList.remove('open'); menu.hidden = true; }
      onScroll();
    };
    on(burger, 'click', () => setMenu(!menuOpen));
    on(menu, 'click', e => { if (e.target.closest('a')) setMenu(false); });
    on(window, 'keydown', e => { if (e.key === 'Escape' && menuOpen) { setMenu(false); burger.focus(); } });
    on(window, 'resize', () => { if (menuOpen && innerWidth > 960) setMenu(false); });

    // mark the section you're in
    const links = $$('.nav-links a');
    const map = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
    const io = IO(es => es.forEach(e => {
      const a = map.get(e.target.id); if (!a) return;
      if (e.isIntersecting) { links.forEach(l => l.removeAttribute('aria-current')); a.setAttribute('aria-current', 'true'); }
    }), { rootMargin: '-45% 0px -50% 0px' });
    map.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
  })();

  /* ---------------- hero HUD type-on ---------------- */
  (() => {
    const hero = $('.hero');
    const els = $$('[data-type]', hero);
    const texts = els.map(el => (el.dataset.text ??= el.textContent));
    if (reduced) return;
    els.forEach(el => (el.textContent = ''));
    const go = () => {
      const t0 = animationNow() + 900;
      const stop = addTask(now => {
        let done = true;
        els.forEach((el, i) => {
          const n = Math.floor(Math.max(0, now - t0 - i * 160) / 25); // 40 chars a second
          const s = texts[i].slice(0, n); if (el.textContent !== s) el.textContent = s;
          if (n < texts[i].length) done = false;
        });
        if (done) stop();
      });
    };
    if (hero.classList.contains('go')) go();
    else MO((_, mo) => { if (hero.classList.contains('go')) { mo.disconnect(); go(); } }).observe(hero, { attributes: true, attributeFilter: ['class'] });
  })();

  /* ---------------- scroll reveals ---------------- */
  (() => {
    const io = IO(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in'); io.unobserve(e.target);
      $$('[data-count]', e.target).concat(e.target.matches('[data-count]') ? [e.target] : []).forEach(count);
    }), { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
    $$('[data-reveal]').forEach(el => io.observe(el));

    function count(el) {
      const to = +el.dataset.count; if (reduced || to === 0) { el.textContent = to; return; }
      const t0 = animationNow(), dur = 750;
      el.textContent = '0';
      const stop = addTask(now => {
        const k = clamp((now - t0) / dur);
        // the number steps on twos
        const stepped = Math.floor(((now - t0) / 1000) * 12) / (dur / 1000 * 12);
        el.textContent = Math.round(to * E.snap(Math.min(1, stepped)));
        if (k >= 1) { el.textContent = to; el.animate([{ transform: 'scale(1.18)' }, { transform: 'scale(1)' }], { duration: 250, easing: 'cubic-bezier(.34,1.8,.64,1)' }); stop(); }
      });
    }
  })();

  /* ---------------- manifesto: words light up as you read ---------------- */
  (() => {
    const el = $('[data-manifesto]'); if (!el) return;
    if (reduced) { el.classList.add('static'); return; }
    const walk = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) frag.appendChild(document.createTextNode(part));
            else { const s = document.createElement('span'); s.className = 'w'; s.textContent = part; frag.appendChild(s); }
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) walk(n);
      });
    };
    if (!el.querySelector('.w')) walk(el);
    const words = $$('.w', el);
    let lit = -1, vis = false;
    const update = () => {
      if (!vis) return;
      const r = el.getBoundingClientRect(), vh = innerHeight;
      const p = clamp((vh * 0.82 - r.top) / (r.height + vh * 0.3));
      const n = Math.round(p * words.length);
      if (n === lit) return;
      words.forEach((w, i) => w.classList.toggle('on', i < n));
      lit = n;
    };
    watch(el, v => { vis = v; update(); }, { rootMargin: '20% 0px' });
    on(window, 'scroll', update, { passive: true });
  })();

  /* ---------------- torn edges that boil ---------------- */
  (() => {
    $$('.tear').forEach((el, k) => {
      const from = C[el.dataset.from] || C.studio, to = C[el.dataset.to] || C.void;
      el.style.background = to;
      el.innerHTML = `<svg viewBox="0 0 1000 34" preserveAspectRatio="none"><path fill="${from}"/></svg>`;
      const path = $('path', el);
      const draw = b => {
        const R = rng(k * 31 + (b % 3) * 7 + 3); let d = 'M0 0 L1000 0 ';
        const n = 46;
        for (let i = n; i >= 0; i--) d += `L${((i / n) * 1000 + (R() - 0.5) * 8).toFixed(1)} ${(i % 2 ? 6 + R() * 10 : 16 + R() * 16).toFixed(1)} `;
        path.setAttribute('d', d + 'Z');
      };
      draw(0);
      if (reduced) return;
      let vis = false, last = -1;
      watch(el, v => (vis = v));
      addTask(now => { if (!vis) return; const b = boilIx(now); if (b !== last) { last = b; draw(b); } });
    });
  })();

  /* ---------------- ticker: pause offscreen ---------------- */
  (() => { const t = $('.ticker'); if (t) watch(t, v => t.classList.toggle('paused', !v)); })();

  /* ---------------- canvas scene harness ---------------- */
  function scene(canvas, draw, { fps = 24, loop = 0 } = {}) {
    const ctx = canvas.getContext('2d');
    let W = 0, H = 0, dpr = 1, vis = false, t0 = null, last = -1;
    const resize = () => {
      const r = canvas.getBoundingClientRect(); dpr = Math.min(devicePixelRatio || 1, 2);
      W = r.width; H = r.height; canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); last = -1;
    };
    RO(resize).observe(canvas); resize();
    const paint = t => { ctx.setTransform(dpr, 0, 0, dpr, 0, 0); draw(ctx, t, W, H); };
    if (reduced) { const still = () => paint(loop ? loop * 0.8 : 6); RO(still).observe(canvas); document.fonts && document.fonts.ready.then(still); return; }
    watch(canvas, v => { vis = v; if (v && t0 === null) t0 = animationNow(); }, { threshold: 0.25 });
    addTask(now => {
      if (!vis || !W) return;
      let t = (now - t0) / 1000; if (loop) t %= loop;
      const f = Math.floor(t * fps); if (f === last) return; last = f;
      paint(f / fps);
    });
  }
  const rootCss = getComputedStyle(document.documentElement);
  const FONT_D = rootCss.getPropertyValue('--display').trim() || 'Impact, sans-serif';
  const FONT_B = rootCss.getPropertyValue('--body').trim() || 'system-ui, sans-serif';
  const bebas = (ctx, px) => (ctx.font = `${px}px ${FONT_D}`);
  const inter = (ctx, px, w = 600) => (ctx.font = `${w} ${px}px ${FONT_B}`);
  const spaced = s => s.split('').join(String.fromCharCode(8202));

  /* ---------------- 01 SEO: rank climb ---------------- */
  const vizSEO = (ctx, t, W, H) => {
    ctx.fillStyle = C.studio; ctx.fillRect(0, 0, W, H);
    const pad = Math.max(16, Math.min(W, H) * 0.07);
    const query = 'emergency plumber toronto';
    // search bar
    const sbH = Math.max(40, H * 0.1), sbY = pad + 8, sbX = pad, sbW = W - pad * 2;
    ctx.fillStyle = C.void; ctx.fillRect(sbX, sbY, sbW, sbH);
    ctx.lineWidth = 2; ctx.strokeStyle = C.ash; ctx.strokeRect(sbX + 1, sbY + 1, sbW - 2, sbH - 2);
    // magnifier
    const mr = sbH * 0.18, mx = sbX + sbH * 0.45, my = sbY + sbH * 0.46;
    ctx.lineWidth = 3; ctx.strokeStyle = C.yellow; ctx.beginPath(); ctx.arc(mx, my, mr, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(mx + mr * 0.7, my + mr * 0.7); ctx.lineTo(mx + mr * 1.6, my + mr * 1.6); ctx.stroke();
    const typed = query.slice(0, Math.floor(clamp((t - 0.2) / 1) * query.length));
    inter(ctx, Math.max(13, sbH * 0.32), 500); ctx.fillStyle = C.bone; ctx.textBaseline = 'middle';
    const tx = sbX + sbH * 0.9; ctx.fillText(typed, tx, sbY + sbH / 2 + 1);
    if (Math.floor(t * 2) % 2 === 0 || t < 1.2) { const w = ctx.measureText(typed).width; ctx.fillStyle = C.yellow; ctx.fillRect(tx + w + 3, sbY + sbH * 0.28, 3, sbH * 0.44); }

    // results
    const N = 7, top = sbY + sbH + pad * 0.7, avail = H - top - pad * 1.6, rh = avail / N;
    const T0 = 1.4, STEP = 0.42, SNAP = 0.125;
    const s = (t - T0) / STEP; const k = t < T0 ? 0 : Math.min(6, Math.floor(s) + 1);
    const f = t < T0 ? 1 : (k >= 6 && s >= 6 ? 1 : clamp(((t - T0) - (k - 1) * STEP) / SNAP));
    const R = rng(4);
    const widths = Array.from({ length: 6 }, () => [0.45 + R() * 0.4, 0.3 + R() * 0.35]);
    const rowY = r => top + (r - 1) * rh;
    // other rows
    for (let j = 1; j <= 6; j++) {
      const passAt = 7 - j; let pos = j;
      if (k > passAt) pos = j + 1; else if (k === passAt) pos = lerp(j, j + 1, E.snap(f));
      const y = rowY(pos);
      bebas(ctx, rh * 0.42); ctx.fillStyle = C.slate; ctx.textBaseline = 'middle';
      ctx.fillText(String(Math.round(pos)).padStart(2, '0'), pad, y + rh * 0.5);
      const x0 = pad + rh * 0.62, wMax = W - pad - x0;
      ctx.fillStyle = C.ash; ctx.fillRect(x0, y + rh * 0.24, wMax * widths[j - 1][0], rh * 0.2);
      ctx.fillStyle = C.onyx; ctx.fillRect(x0, y + rh * 0.56, wMax * widths[j - 1][1], rh * 0.12);
    }
    // you
    const prev = 7 - Math.max(0, k - 1), cur = 7 - k;
    const yPos = k === 0 ? 7 : lerp(prev, cur, E.snap(f));
    const y = rowY(yPos), x0 = pad + rh * 0.62, wMax = W - pad - x0;
    const shake = (k > 0 && f < 1) ? (rng(Math.floor(t * 24))() - 0.5) * 3 : 0;
    ctx.fillStyle = C.void; ctx.fillRect(x0 + 5, y + rh * 0.1 + 5, wMax, rh * 0.8);
    ctx.fillStyle = C.yellow; ctx.fillRect(x0 + shake, y + rh * 0.1, wMax, rh * 0.8);
    bebas(ctx, rh * 0.42); ctx.fillStyle = C.yellow; ctx.fillText(String(Math.round(yPos)).padStart(2, '0'), pad, y + rh * 0.5);
    inter(ctx, Math.max(11, rh * 0.25), 700); ctx.fillStyle = C.void;
    ctx.fillText('YOUR BUSINESS', x0 + 14 + shake, y + rh * 0.4);
    inter(ctx, Math.max(10, rh * 0.18), 500); ctx.fillText('yourbusiness.ca › emergency-plumbing', x0 + 14 + shake, y + rh * 0.68);

    // footer readout
    inter(ctx, 11, 600); ctx.fillStyle = C.slateT; ctx.textBaseline = 'alphabetic'; ctx.textAlign = 'right';
    ctx.fillText(spaced('POSITION ' + String(Math.round(yPos)).padStart(2, '0')), W - pad, H - pad * 0.6);
    ctx.textAlign = 'left';

    // the win: a burst stamps #1
    const tWin = T0 + STEP * 5 + SNAP;
    if (t > tWin + 0.15) {
      const kk = E.punch((t - tWin - 0.15) / 0.3);
      const r = Math.min(rh * 0.95, W * 0.11) * kk, cx = W - pad - r * 0.7, cy = rowY(1) + rh * 0.15;
      ctx.fillStyle = C.void; ctx.fill(burstPath2D(cx + 5, cy + 5, r, 12, boilIx(t * 1000), 0.6, 0.2));
      ctx.fillStyle = C.bone; ctx.fill(burstPath2D(cx, cy, r, 12, boilIx(t * 1000), 0.6, 0.2));
      bebas(ctx, r * 0.78); ctx.fillStyle = C.void; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('#1', cx, cy + r * 0.06); ctx.textAlign = 'left';
    }
  };

  /* ---------------- 02 WEB: build, then convert ---------------- */
  const vizWEB = (ctx, t, W, H) => {
    ctx.fillStyle = C.studio; ctx.fillRect(0, 0, W, H);
    const pad = Math.max(16, Math.min(W, H) * 0.08);
    const bx = pad, by = pad, bw = W - pad * 2, bh = H - pad * 2.2;
    ctx.fillStyle = C.void; ctx.fillRect(bx, by, bw, bh);
    ctx.lineWidth = 2; ctx.strokeStyle = C.ash; ctx.strokeRect(bx + 1, by + 1, bw - 2, bh - 2);
    const barH = Math.max(26, bh * 0.08);
    ctx.fillStyle = C.ash; ctx.fillRect(bx, by, bw, barH);
    for (let i = 0; i < 3; i++) { ctx.fillStyle = i === 0 ? C.yellow : C.slate; ctx.fillRect(bx + 12 + i * 16, by + barH / 2 - 4, 9, 9); }
    ctx.fillStyle = C.void; const ux = bx + 70, uw = Math.min(bw - 90, 260); ctx.fillRect(ux, by + barH * 0.2, uw, barH * 0.6);
    inter(ctx, Math.max(10, barH * 0.36), 500); ctx.fillStyle = C.slateT; ctx.textBaseline = 'middle'; ctx.fillText('yourbusiness.ca', ux + 10, by + barH / 2 + 1);

    const ix = bx + 16, iy = by + barH + 14, iw = bw - 32, ih = bh - barH - 28;
    const land = (at, dur = 0.125) => clamp((t - at) / dur);
    const block = (at, x, y, w, h, fill, extra) => {
      const k = land(at); if (k <= 0) return null;
      const off = (1 - E.snap(k)) * -22;
      ctx.fillStyle = fill; ctx.fillRect(x, y + off, w, h);
      if (extra) extra(x, y + off, w, h);
      return { x, y, w, h };
    };
    // nav row
    block(0.3, ix, iy, iw * 0.18, ih * 0.06, C.bone);
    for (let i = 0; i < 3; i++) block(0.4 + i * 0.05, ix + iw * (0.55 + i * 0.12), iy + ih * 0.015, iw * 0.09, ih * 0.035, C.ash);
    // hero headline bars + image
    block(0.6, ix, iy + ih * 0.14, iw * 0.5, ih * 0.1, C.bone);
    block(0.68, ix, iy + ih * 0.26, iw * 0.38, ih * 0.1, C.bone);
    block(0.76, ix, iy + ih * 0.4, iw * 0.44, ih * 0.035, C.ash);
    block(0.8, ix, iy + ih * 0.46, iw * 0.34, ih * 0.035, C.ash);
    block(0.7, ix + iw * 0.58, iy + ih * 0.13, iw * 0.42, ih * 0.43, C.onyx, (x, y, w, h) => {
      ctx.strokeStyle = C.ash; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + w, y + h); ctx.moveTo(x + w, y); ctx.lineTo(x, y + h); ctx.stroke();
    });
    // CTA
    const ctaX = ix, ctaY = iy + ih * 0.56, ctaW = Math.max(110, iw * 0.3), ctaH = Math.max(28, ih * 0.1);
    const tClick = 3.3;
    const clicked = t > tClick && t < tClick + 0.17;
    block(1.0, ctaX, ctaY, ctaW, ctaH, clicked ? C.bone : C.yellow, (x, y, w, h) => {
      bebas(ctx, h * 0.62); ctx.fillStyle = C.void; ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
      ctx.fillText('CALL NOW →', x + w / 2, y + h / 2 + 2); ctx.textAlign = 'left';
    });
    // three cards
    for (let i = 0; i < 3; i++) block(1.25 + i * 0.12, ix + i * (iw / 3), iy + ih * 0.76, iw / 3 - 10, ih * 0.24, C.onyx, (x, y, w, h) => {
      ctx.fillStyle = C.ash; ctx.fillRect(x + 10, y + 12, w * 0.5, 6); ctx.fillRect(x + 10, y + 24, w * 0.7, 4);
    });
    // LIVE stamp
    if (t > 1.9) {
      const k = E.punch((t - 1.9) / 0.25);
      ctx.save(); ctx.translate(bx + bw - 54, by + barH / 2); ctx.scale(k, k); ctx.rotate(-0.08);
      ctx.fillStyle = C.yellow; ctx.fillRect(-34, -11, 68, 22); bebas(ctx, 18); ctx.fillStyle = C.void; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('LIVE', 0, 1); ctx.restore(); ctx.textAlign = 'left';
    }
    // cursor
    if (t > 2.3) {
      const k = E.slam((t - 2.3) / 0.9);
      const tx = ctaX + ctaW * 0.7, ty = ctaY + ctaH * 0.6;
      const cx = lerp(W - pad * 0.6, tx, k), cy = lerp(H - pad * 0.4, ty, k);
      const s = t > tClick && t < tClick + 0.12 ? 0.85 : 1;
      ctx.save(); ctx.translate(cx, cy); ctx.scale(s, s);
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 22); ctx.lineTo(6, 17); ctx.lineTo(10, 26); ctx.lineTo(14, 24); ctx.lineTo(10, 15); ctx.lineTo(17, 15); ctx.closePath();
      ctx.fillStyle = C.bone; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = C.void; ctx.stroke(); ctx.restore();
      if (t > tClick && t < tClick + 0.5) {
        const kk = E.punch((t - tClick) / 0.25);
        ctx.fillStyle = C.yellow; ctx.fill(burstPath2D(tx, ty, 26 * kk, 10, boilIx(t * 1000), 0.45));
      }
    }
    // the lead
    if (t > 3.6) {
      const k = E.slam((t - 3.6) / 0.375);
      const tw = Math.min(W * 0.62, 280), th = 64, x = lerp(W + 10, W - pad - tw + 12, k), y = H - pad * 0.7 - th;
      ctx.fillStyle = C.void; ctx.fillRect(x + 6, y + 6, tw, th);
      ctx.fillStyle = C.yellow; ctx.fillRect(x, y, tw, th);
      bebas(ctx, 26); ctx.fillStyle = C.void; ctx.textBaseline = 'alphabetic'; ctx.fillText('NEW LEAD ✹', x + 14, y + 30);
      inter(ctx, 12, 600); ctx.fillText('Call booked · Tue 10:30', x + 14, y + 50);
    }
  };

  /* ---------------- 03 OUTBOUND: sent, replied, booked ---------------- */
  const vizOUT = (ctx, t, W, H) => {
    ctx.fillStyle = C.studio; ctx.fillRect(0, 0, W, H);
    const pad = Math.max(16, Math.min(W, H) * 0.08);
    const footH = 58;
    const gw = W - pad * 2, gh = H - pad * 2 - footH;
    const cols = Math.max(8, Math.round(gw / 34)), rows = Math.max(5, Math.round(gh / 34));
    const cw = gw / cols, ch = gh / rows, r = Math.min(cw, ch) * 0.3;
    const R = rng(21);
    const dots = [];
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) dots.push({ i, j, a: R(), b: R(), c: R() });
    const replied = dots.filter(d => d.a < 0.4 && d.b < 0.11);
    const booked = new Set(replied.sort((p, q) => p.c - q.c).slice(0, 3));
    let sent = 0, opened = 0, rep = 0, bk = 0;
    const T_SENT = 0.2, T_SENT_END = 2.4, T_OPEN = 2.6, T_REP = 4.0, T_BOOK = 5.0;
    for (const d of dots) {
      const x = pad + (d.i + 0.5) * cw, y = pad + (d.j + 0.5) * ch;
      const sentAt = T_SENT + (d.i / cols) * (T_SENT_END - T_SENT) + d.j * 0.01;
      const openAt = T_OPEN + d.c * 1.2, repAt = T_REP + d.c * 0.8, bookAt = T_BOOK + d.c * 0.5;
      const isSent = t >= sentAt, isOpen = d.a < 0.4 && t >= openAt, isRep = replied.includes(d) && t >= repAt, isBook = booked.has(d) && t >= bookAt;
      if (isSent) sent++; if (isOpen) opened++; if (isRep) rep++; if (isBook) bk++;
      if (isBook) {
        const k = E.punch((t - bookAt) / 0.3);
        ctx.fillStyle = C.yellow; ctx.fill(burstPath2D(x, y, r * 2.3 * k, 10, boilIx(t * 1000) + d.i, 0.55));
        ctx.fillStyle = C.void; ctx.fillRect(x - r * 0.55, y - r * 0.55, r * 1.1, r * 1.1);
      } else if (isRep) {
        const k = E.punch((t - repAt) / 0.25);
        ctx.fillStyle = C.yellow; ctx.beginPath(); ctx.arc(x, y, r * 1.25 * k, 0, Math.PI * 2); ctx.fill();
      } else if (isOpen) {
        ctx.fillStyle = C.bone; ctx.beginPath(); ctx.arc(x, y, r * 0.75, 0, Math.PI * 2); ctx.fill();
      } else if (isSent) {
        ctx.strokeStyle = C.bone; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, r * 0.75, 0, Math.PI * 2); ctx.stroke();
      } else {
        ctx.fillStyle = C.ash; ctx.beginPath(); ctx.arc(x, y, r * 0.42, 0, Math.PI * 2); ctx.fill();
      }
    }
    // sweep bar while sending
    if (t > T_SENT && t < T_SENT_END + 0.1) {
      const x = pad + clamp((t - T_SENT) / (T_SENT_END - T_SENT)) * gw;
      ctx.fillStyle = C.yellow; ctx.fillRect(x - 2, pad - 6, 4, gh + 12);
    }
    // readout
    const fy = H - pad - footH + 14;
    ctx.fillStyle = C.ash; ctx.fillRect(pad, fy - 12, gw, 2);
    const stats = [['SENT', sent, C.bone], ['OPENED', opened, C.bone], ['REPLIED', rep, C.yellow], ['BOOKED', bk, C.yellow]];
    const sw = gw / 4;
    stats.forEach(([lab, n, col], i) => {
      bebas(ctx, 34); ctx.fillStyle = col; ctx.textBaseline = 'top'; ctx.fillText(String(n).padStart(2, '0'), pad + i * sw, fy);
      inter(ctx, 10, 600); ctx.fillStyle = C.slateT; ctx.fillText(spaced(lab), pad + i * sw, fy + 36);
    });
  };

  $$('canvas[data-viz]').forEach(cv => {
    const v = cv.dataset.viz;
    if (v === 'seo') scene(cv, vizSEO, { loop: 7.2 });
    if (v === 'web') scene(cv, vizWEB, { loop: 7.4 });
    if (v === 'out') scene(cv, vizOUT, { loop: 7.8 });
  });

  /* ---------------- Truchet field (pipeline section) ---------------- */
  (() => {
    const cv = $('.truchet'); if (!cv) return;
    const ctx = cv.getContext('2d'), sec = cv.parentElement;
    let W, H, dpr, s, cols, rows, tiles = [], vis = false, last = -1;
    const resize = () => {
      const r = cv.getBoundingClientRect(); dpr = Math.min(devicePixelRatio || 1, 2);
      W = r.width; H = r.height; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      s = clamp(W / 16, 46, 86); cols = Math.ceil(W / s) + 1; rows = Math.ceil(H / s) + 1;
      const R = rng(5); tiles = [];
      for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) tiles.push({ i, j, rot: R() > 0.5 ? 1 : 0, from: 0, at: -9, hot: -9 });
      tiles.forEach(t => (t.from = t.rot)); last = -1;
    };
    RO(resize).observe(cv); resize();
    const flip = (tile, now) => { if (now - tile.at < 400) return; tile.from = tile.rot; tile.rot += 1; tile.at = now; tile.hot = now; };
    const draw = now => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = C.void; ctx.fillRect(0, 0, W, H);
      ctx.lineWidth = s * 0.2; ctx.lineCap = 'butt';
      const paths = { ash: new Path2D(), y: new Path2D() };
      for (const tl of tiles) {
        const k = clamp((now - tl.at) / 250); // three drawings on twos
        const kq = Math.ceil(k * 3) / 3;
        const ang = (tl.from + (tl.rot - tl.from) * kq) * Math.PI / 2;
        const cx = tl.i * s + s / 2, cy = tl.j * s + s / 2;
        const p = now - tl.hot < 700 ? paths.y : paths.ash;
        const c = Math.cos(ang), si = Math.sin(ang);
        const tr = (x, y) => [cx + (x * c - y * si), cy + (x * si + y * c)];
        // two quarter arcs (Smith tile)
        let [ax, ay] = tr(-s / 2, -s / 2); p.moveTo(...tr(0, -s / 2)); p.arc(ax, ay, s / 2, ang, ang + Math.PI / 2);
        [ax, ay] = tr(s / 2, s / 2); p.moveTo(...tr(0, s / 2)); p.arc(ax, ay, s / 2, ang + Math.PI, ang + Math.PI * 1.5);
      }
      ctx.strokeStyle = C.ash; ctx.stroke(paths.ash);
      ctx.strokeStyle = C.yellow; ctx.stroke(paths.y);
    };
    if (reduced) { RO(() => draw(0)).observe(cv); return; }
    let wave = null;
    watch(sec, v => (vis = v));
    on(sec, 'pointermove', e => {
      const r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top, now = animationNow();
      const i = Math.floor(x / s), j = Math.floor(y / s);
      for (const tl of tiles) if (Math.abs(tl.i - i) <= 1 && Math.abs(tl.j - j) <= 1 && (tl.i === i || tl.j === j)) flip(tl, now);
    }, { passive: true });
    addTask(now => {
      if (!vis) return;
      if (!wave || now - wave.t > 4200) wave = { t: now, x: Math.random() * W, y: Math.random() < 0.5 ? 0 : H };
      const radius = (now - wave.t) / 1000 * 520;
      for (const tl of tiles) {
        const d = Math.hypot(tl.i * s - wave.x, tl.j * s - wave.y);
        if (d < radius && d > radius - s * 1.2 && ((tl.i * 7 + tl.j * 3) % 3 === 0)) flip(tl, now);
      }
      const f = onTwos(now); if (f === last) return; last = f; draw(now);
    });
  })();

  /* ---------------- process rail ---------------- */
  (() => {
    const list = $('.steps'); if (!list) return;
    const steps = $$('.step', list);
    const update = () => {
      const r = list.getBoundingClientRect(), mid = innerHeight * 0.6;
      const p = clamp((mid - r.top) / r.height);
      list.style.setProperty('--p', (Math.round(p * 36) / 36).toFixed(4));
      steps.forEach(s => s.classList.toggle('on', s.getBoundingClientRect().top < mid));
    };
    on(window, 'scroll', update, { passive: true }); on(window, 'resize', update); update();
  })();

  /* ---------------- FAQ ---------------- */
  $$('[data-faq] .qa-item').forEach(item => {
    const btn = $('button', item), panel = $('.qa-a', item);
    const id = 'qa-' + Math.random().toString(36).slice(2, 8);
    panel.id = id; btn.setAttribute('aria-controls', id);
    on(btn, 'click', () => {
      const open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', open); item.classList.toggle('open', open);
    });
  });

  /* ---------------- contact: the 3D skull on a boiling burst ---------------- */
  (() => {
    const stage = $('.mark-stage'), cv = $('.mark-skull'); if (!stage || !cv) return;
    if (typeof Skull3D === 'undefined' || !Skull3D.init()) { stage.classList.add('no-gl'); return; }
    const ctx = cv.getContext('2d');
    let W = 0, px = 0, vis = false, last = -1, aimX = 0, aimY = 0, yaw = 0, pitch = 0, lastAim = -1e9;
    const resize = () => { const r = cv.getBoundingClientRect(); W = r.width; px = Math.round(W * Math.min(devicePixelRatio || 1, 1.5)); cv.width = cv.height = px; last = -1; };
    RO(resize).observe(cv); resize();
    const paint = () => {
      if (!px) return;
      const r = Skull3D.render(px, { yaw, pitch, style: 'mono', ground: C.yellow, line: 0.03, lineColor: C.bone });
      ctx.clearRect(0, 0, px, px); ctx.drawImage(r.cv, 0, r.sy, px, px, 0, 0, px, px);
    };
    if (reduced) { RO(paint).observe(cv); return; }
    on(window, 'pointermove', e => {
      const r = stage.getBoundingClientRect();
      aimX = clamp((e.clientX - (r.left + r.width / 2)) / 500, -1, 1);
      aimY = clamp((e.clientY - (r.top + r.height / 2)) / 500, -1, 1);
      lastAim = animationNow();
    }, { passive: true });
    watch(stage, v => (vis = v));
    addTask(now => {
      if (!vis) return;
      const f = onTwos(now); if (f === last) return; last = f; // the skull moves on twos
      const idle = now - lastAim > 2500;
      const ty = idle ? Math.sin(now / 1000 * 0.9) * 0.55 : aimX * 0.75;
      const tp = idle ? Math.sin(now / 1000 * 1.3) * 0.12 : aimY * 0.4;
      yaw = lerp(yaw, ty, 0.35); pitch = lerp(pitch, tp, 0.35);
      paint();
    });
  })();

  /* ---------------- contact form ---------------- */
  (() => {
    const form = $('#contactForm'); if (!form) return;
    const status = $('.form-status', form);
    const budgetFor = { Starter: '$2k to $4k', Growth: '$4k to $6k', Authority: '$6k+' };
    $$('[data-plan]').forEach(a => on(a, 'click', () => {
      const plan = a.dataset.plan, b = budgetFor[plan];
      if (b) { const r = form.querySelector(`input[name="budget"][value="${b}"]`); if (r) r.checked = true; }
      const msg = form.elements.message; if (!msg.value.trim()) msg.value = `Interested in the ${plan} plan. `;
    }));
    on(form, 'submit', async e => {
      e.preventDefault();
      status.className = 'form-status'; status.textContent = '';
      let bad = null;
      for (const name of ['name', 'email']) {
        const input = form.elements[name], field = input.closest('.field');
        const ok = input.value.trim() && (name !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim()));
        field.classList.toggle('bad', !ok); if (!ok && !bad) bad = input;
      }
      if (bad) { status.textContent = bad.name === 'email' ? 'That email doesn’t look right.' : 'We need a name to reply to.'; bad.focus(); return; }
      const btn = form.querySelector('button[type="submit"]'); btn.disabled = true; status.textContent = 'Sending…';
      try {
        const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error(res.status);
        form.reset(); status.className = 'form-status ok'; status.textContent = 'Got it. One of us will reply within 24 hours.';
      } catch (err) {
        status.textContent = 'That didn’t send. Give it another try in a minute.';
      } finally { btn.disabled = false; }
    });
  })();

  return () => { pauseTicker(); tasks.clear(); ac.abort(); observers.forEach(o => o.disconnect()); };
}
