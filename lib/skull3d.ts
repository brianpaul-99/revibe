// @ts-nocheck
// Imperative canvas/WebGL runtime ported from Branding/Website-2026/js. Kept untyped on purpose:
// it is DOM and GL plumbing, and the React side only calls the exported init and its cleanup.
/* Revibe 3D skull, copied from Branding/Motion/src/skull3d.js (geometry + WebGL2 renderer only). */
const C = { void: "#0C0C0E", yellow: "#F2E633", bone: "#F4F4F2" };
/* ---------- 3D skull: faceted solid built from the master skull (Logos/.../Asset 55.svg) ----------
   The front view of this solid is the logo outline. Everything is planes, so it renders as
   crisp flat facets at any angle. Units: logo viewBox mapped to X = (x - 66.18) / 60, Y = (52 - y) / 60. */
const SKULL3D_GEO = (() => {
  // Every face region, tooth and edge below is traced from Asset 55's own coordinates.
  const P = (x, y) => [(x - 66.18) / 60, (52 - y) / 60];
  const norm = v => { const l = Math.hypot(...v); return v.map(c => c / l); };
  const dot = (a, b) => a.reduce((s, c, i) => s + c * b[i], 0);
  const planes = [], solids = [];
  const pl = (n, pt) => { n = norm(n); return [...n, dot(n, pt)]; };
  const solid = (op, list, nWalls = 0) => { solids.push({ start: planes.length, count: list.length, op, nWalls }); planes.push(...list); };
  const cen2 = poly => poly.reduce((s, p) => [s[0] + p[0] / poly.length, s[1] + p[1] / poly.length], [0, 0]);
  const edges = poly => { const c = cen2(poly); return poly.map((a, i) => {
    const b = poly[(i + 1) % poly.length];
    let n = norm([b[1] - a[1], a[0] - b[0]]);
    if (dot(n, [(a[0] + b[0]) / 2 - c[0], (a[1] + b[1]) / 2 - c[1]]) < 0) n = [-n[0], -n[1]];
    return { a, b, n };
  }); };
  const walls = poly => edges(poly).map(({ a, n }) => pl([n[0], n[1], 0], [a[0], a[1], 0]));
  const half = (a, b, inside) => { let n = norm([b[1] - a[1], a[0] - b[0]]); if (dot(n, [inside[0] - a[0], inside[1] - a[1]]) > 0) n = [-n[0], -n[1]]; return pl([n[0], n[1], 0], [a[0], a[1], 0]); };
  const poly = pts => pts.map(([x, y]) => P(x, y));
  const zOn = (pln, x, y) => (pln[3] - pln[0] * x - pln[1] * y) / pln[2];
  const ZF = 0.62;

  // three face planes. M: the main lit face. D: the shadowed lower-left (side, cheek, left teeth). R: right cheek turning away (still lit)
  const M = pl([0.12, 0.15, 1], [0, 0, ZF]);
  const A = P(0, 43.09), B = P(21.38, 48.05); // the edge where the left side drops into shadow
  const A3 = [...A, zOn(M, ...A)], B3 = [...B, zOn(M, ...B)];
  const dy = -0.55, dz = 0.84, dx = (-dy * (A3[1] - B3[1]) - dz * (A3[2] - B3[2])) / (A3[0] - B3[0]);
  let nD = norm([dx, dy, dz]); const D = [...nD, dot(nD, A3)];
  const nR = norm([0.35, -0.25, 0.9]), Q = P(72.5, 92), R = [...nR, dot(nR, [...Q, zOn(D, ...Q)])];

  // the master outline (convex part)
  const hull = poly([[66.26, 0], [119.9, 18.75], [132.36, 42.81], [128.36, 72.91], [108.08, 88.62], [17.21, 82.84], [3.98, 73], [0, 43.09], [12.57, 18.65]]);
  const body = walls(hull);
  const FB = (30 * Math.PI) / 180, INSET = 0.12, BEVELLED = [0, 1, 2, 3, 7, 8]; // only the edges the logo shows lit
  const hullEdges = hull.map((a, i) => ({ a, b: hull[(i + 1) % hull.length] }));
  const cH = cen2(hull);
  hullEdges.forEach(({ a, b }, i) => {
    let n = norm([b[1] - a[1], a[0] - b[0]]);
    if (dot(n, [(a[0] + b[0]) / 2 - cH[0], (a[1] + b[1]) / 2 - cH[1]]) < 0) n = [-n[0], -n[1]];
    if (BEVELLED.includes(i)) { const q = [a[0] - n[0] * INSET, a[1] - n[1] * INSET]; body.push(pl([n[0] * Math.sin(FB), n[1] * Math.sin(FB), Math.cos(FB)], [...q, zOn(M, ...q)])); }
    for (const [deg, z, pull] of [[12, -0.25, 0], [35, -0.7, 0.1], [65, -1.0, 0.3]]) {
      const ang = (deg * Math.PI) / 180;
      body.push(pl([n[0] * Math.cos(ang), n[1] * Math.cos(ang), -Math.sin(ang)], [a[0] - n[0] * pull, a[1] - n[1] * pull, z]));
    }
  });
  body.push(M, D, R, pl([0, 0, -1], [0, 0, -1.3]), pl([0, -1, -0.6], [0, -0.47, -0.15]));
  solid(0, body);

  // the outline steps up between the last tooth and the jaw corner, and under the left cheek
  const front = pl([0, 0, -1], [0, 0, ZF - 0.6]);
  solid(2, [half(P(90.66, 86.23), P(107.71, 80.34), P(100, 95)), half(P(107.9, 0), P(107.9, 100), P(100, 95)), half(P(86, 0), P(86, 100), P(100, 95)), front]);
  solid(2, [half(P(17.21, 82.84), P(29.97, 80.38), P(24, 95)), half(P(17.4, 0), P(17.4, 100), P(24, 95)), half(P(29.5, 0), P(29.5, 100), P(24, 95)), front]);

  // lit shapes standing proud of the shadow plane: the cheekbone strip and the patch between cheek and teeth
  const back = pl([0, 0, -1], [0, 0, ZF - 0.5]);
  // their edges render in the lit yellow, so the front view stays as clean as the logo
  const raised = (pts, front) => { const w = walls(poly(pts)); solid(1, [...w, ...front, back], w.length); };
  raised([[44.18, 72.62], [46.64, 78.33], [70.38, 89.39], [76, 77], [78, 62], [52.24, 67.11]], [M, R]); // flush with the lit face, proud of the shadow
  raised([[21.38, 48.05], [23.88, 52.13], [28.41, 70.72], [21.34, 57.94]], [M]);

  // eye sockets: left is a straight hex shaft; right opens wider on its lower-left (the darker rim in the logo)
  const faceZ = (x, y) => Math.min(zOn(M, x, y), zOn(D, x, y), zOn(R, x, y));
  const socket = (hexPts, rim) => {
    const pts = poly(hexPts), c = cen2(pts), zc = faceZ(...c), depth = 0.3, floor = zc - depth;
    const list = edges(pts).map(({ a, n }, i) => {
      const o = (rim[i] || 0) / 60; // how far the opening sits outside the floor, at the face
      return pl([n[0], n[1], -o / depth], [a[0], a[1], floor]);
    });
    list.push(pl([0, 0, -1], [0, 0, floor]));
    solid(3, list);
  };
  socket([[23.88, 52.13], [36.12, 36.96], [52.73, 37.02], [58.56, 50.24], [51.18, 62.9], [34.47, 67.11]], []);
  socket([[105.73, 60.49], [91.31, 62.86], [80.58, 55.05], [80.48, 42.39], [93.49, 36.97], [108.44, 44.95]], [3, 5.5, 2.5]);

  // teeth, flush with the face: the three on the left sit in the shadow plane, the two on the right in the lit cheek
  const tooth = (pts, faceP) => { const pp = poly(pts), c = cen2(pp); solid(4, [...walls(pp), faceP, pl([0, 0, -1], [0, 0, zOn(faceP, ...c) - 0.32])]); };
  tooth([[29.97, 80], [33.76, 80], [33.31, 98.56], [31, 97.2], [29.37, 91.63]], D);
  tooth([[46.58, 80], [53.9, 80], [52.35, 103.66], [48.98, 103.42], [47.51, 96.06]], D);
  tooth([[41.96, 96.41], [47.7, 96.06], [48.46, 100.81], [42.68, 99.71]], D);
  tooth([[60.31, 80], [71.31, 80], [71.31, 86.14], [70.38, 89.39], [66.32, 103.53], [59.36, 104.01]], D);
  tooth([[75.27, 80], [81.6, 80], [81.1, 89.64], [78.43, 104.01], [73.81, 103.78]], R);
  tooth([[86.38, 80], [90.66, 80], [90.83, 103.77], [87.13, 103.83]], R);

  return { planes, solids };
})();

// CPU copy of the distance function, used for the 3D model export
function skullSDF(x, y, z) {
  const { planes, solids } = SKULL3D_GEO;
  let d = 1e9;
  for (const { start, count, op } of solids) {
    let v = -1e9;
    for (let i = start; i < start + count; i++) { const q = planes[i]; v = Math.max(v, q[0] * x + q[1] * y + q[2] * z - q[3]); }
    if (op === 0) d = v;
    else if (op === 1 || op === 4) d = Math.min(d, v);
    else d = Math.max(d, -v);
  }
  return d;
}

export const Skull3D = (() => {
  let gl, cv, U = {}, ok = null;
  const VS = `#version 300 es
in vec2 p; void main(){ gl_Position = vec4(p, 0., 1.); }`;
  const FS = `#version 300 es
precision highp float;
uniform vec2 uRes; uniform vec2 uOrg; uniform mat3 uRot;
uniform vec4 uS[140]; uniform ivec4 uSo[16]; uniform int uNS;
uniform int uStyle; uniform vec3 uC0, uC1, uC2, uFloor, uLine, uL; uniform float uLineW; uniform float uDist;
out vec4 frag;
float map(vec3 p, out int id){
  // solids in order: 0 body, 1 union, 2 cut, 3 eye socket (last plane = floor), 4 tooth
  float d = 1e9; id = 0;
  for (int s = 0; s < 16; s++){
    if (s >= uNS) break;
    ivec4 so = uSo[s]; float v = -1e9; int a = 0;
    for (int i = 0; i < 64; i++){ if (i >= so.y) break; vec4 q = uS[so.x + i]; float e = dot(q.xyz, p) - q.w; if (e > v){ v = e; a = so.x + i; } }
    if (so.z == 0){ d = v; id = 100 + a; }
    else if (so.z == 1 || so.z == 4){ if (v < d){ d = v; id = (so.z == 1 && a - so.x < so.w) ? 5 : 100 + a; } }
    else if (so.z == 2){ if (-v > d){ d = -v; id = 100 + a; } }
    else if (-v > d){ d = -v; id = a == so.x + so.y - 1 ? 2 : 1; }
  }
  return d;
}
vec3 nrm(vec3 p){
  int i; const vec2 e = vec2(1., -1.) * 0.0012;
  return normalize(e.xyy * map(p + e.xyy, i) + e.yyx * map(p + e.yyx, i) + e.yxy * map(p + e.yxy, i) + e.xxx * map(p + e.xxx, i));
}
void main(){
  vec2 uv = ((gl_FragCoord.xy - uOrg) / uRes) * 2. - 1.;
  float th = 1.35 / uDist;
  vec3 ro = uRot * vec3(0., 0., uDist), rd = uRot * normalize(vec3(uv * th, -1.));
  float b = dot(ro, rd), h = b * b - (dot(ro, ro) - 2.4);
  if (h < 0.){ frag = vec4(0.); return; }
  float t = max(-b - sqrt(h), 0.), tEnd = -b + sqrt(h), minD = 1e9; int id = 0; bool hit = false;
  for (int i = 0; i < 140; i++){
    vec3 p = ro + rd * t; float d = map(p, id); minD = min(minD, d);
    if (d < 0.0007){ hit = true; break; }
    t += d * 0.92; if (t > tEnd) break;
  }
  if (!hit){ frag = minD < uLineW ? vec4(uLine, 1.) : vec4(0.); return; }
  vec3 p = ro + rd * t, n = nrm(p);
  float k = dot(n, uRot * normalize(uL));
  if (id == 1) k -= 0.5;
  vec3 col = k > 0.5 ? uC0 : (k > 0.08 ? uC1 : uC2);
  if (id == 5) col = uC0; // edges of the raised lit shapes
  if (uStyle == 1) col = uC0;
  if (uStyle == 2){ // construction view: one tone per plane, lightly lit so the form still reads
    vec3 pal[6] = vec3[6](vec3(.949,.902,.2), vec3(.988,.773,.129), vec3(.788,.561,.055), vec3(.957,.957,.949), vec3(.604,.604,.635), vec3(.42,.42,.45));
    int j = id >= 100 ? (id - 100) * 7 % 6 : (id == 3 ? 3 : 4);
    col = pal[j] * (0.78 + 0.22 * clamp(k + 0.4, 0., 1.));
  }
  if (id == 2) col = uFloor;
  frag = vec4(col, 1.);
}`;
  const hex3 = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255);
  function init() {
    if (ok !== null) return ok;
    try {
      cv = document.createElement('canvas'); cv.width = cv.height = 64;
      gl = cv.getContext('webgl2', { preserveDrawingBuffer: true, premultipliedAlpha: false, antialias: false, alpha: true });
      if (!gl) return (ok = false);
      const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
      const pr = gl.createProgram();
      gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS));
      gl.linkProgram(pr);
      if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(pr));
      gl.useProgram(pr);
      const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      for (const n of ['uRes', 'uOrg', 'uRot', 'uS', 'uSo', 'uNS', 'uStyle', 'uC0', 'uC1', 'uC2', 'uFloor', 'uLine', 'uL', 'uLineW', 'uDist']) U[n] = gl.getUniformLocation(pr, n);
      const G = SKULL3D_GEO;
      if (G.planes.length > 140 || G.solids.length > 16) throw new Error('skull geometry exceeds shader limits');
      gl.uniform4fv(U.uS, G.planes.flat());
      gl.uniform4iv(U.uSo, G.solids.flatMap(o => [o.start, o.count, o.op, o.nWalls]));
      gl.uniform1i(U.uNS, G.solids.length);
      gl.uniform3fv(U.uL, [0.4, 0.55, 0.73]);
      ok = true;
    } catch (e) { console.warn('3D skull unavailable, using the drawn frames', e); ok = false; }
    return ok;
  }
  // render a square tile of `px` pixels; returns the canvas and where the tile sits in it
  function render(px, o = {}) {
    if (cv.width < px || cv.height < px) { cv.width = Math.max(cv.width, px); cv.height = Math.max(cv.height, px); }
    const { yaw = 0, pitch = 0, roll = 0 } = o;
    const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch), cr = Math.cos(roll), sr = Math.sin(roll);
    // model -> view = Rz * Rx * Ry ; the shader needs view -> model (the transpose)
    const Ry = [[cy, 0, sy], [0, 1, 0], [-sy, 0, cy]], Rx = [[1, 0, 0], [0, cp, -sp], [0, sp, cp]], Rz = [[cr, -sr, 0], [sr, cr, 0], [0, 0, 1]];
    const mul = (A, B) => A.map((r, i) => B[0].map((_, j) => r.reduce((s, _, k) => s + A[i][k] * B[k][j], 0)));
    const M = mul(Rz, mul(Rx, Ry));
    // transpose of M, written column-major: column j of M^T is row j of M
    gl.uniformMatrix3fv(U.uRot, false, [M[0][0], M[0][1], M[0][2], M[1][0], M[1][1], M[1][2], M[2][0], M[2][1], M[2][2]]);
    const mono = o.style === 'mono';
    gl.uniform1i(U.uStyle, mono ? 1 : o.style === 'facets' ? 2 : 0);
    gl.uniform1f(U.uDist, o.dist || 7);
    gl.uniform3fv(U.uC0, hex3(mono ? C.void : '#FEF30C')); // the master skull's own two yellows
    gl.uniform3fv(U.uC1, hex3('#FCC521'));
    gl.uniform3fv(U.uC2, hex3('#C98F0E'));
    gl.uniform3fv(U.uFloor, hex3(mono ? (o.ground || C.yellow) : C.void));
    gl.uniform3fv(U.uLine, hex3(o.lineColor || C.bone));
    gl.uniform1f(U.uLineW, o.line != null ? o.line : mono ? 0.035 : 0);
    const oy = cv.height - px;
    gl.viewport(0, 0, px, px);
    gl.uniform2f(U.uRes, px, px); gl.uniform2f(U.uOrg, 0, 0);
    gl.disable(gl.SCISSOR_TEST);
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    return { cv, sy: oy };
  }
  return { init, render };

})();
