/* =====================================================================
   The topographic field behind the hero: the hills around Kigali,
   loosely. Every fifth line is heavier, like the index lines on a map.

   - The geometry is traced once per size into two Path2D objects, so a
     theme switch only re-strokes them.
   - The lines draw in from the right on first load.
   - With a mouse, a soft lamp follows the pointer and brings out the
     lines beneath it. Only the lamp's square is repainted each frame.
   ===================================================================== */

import { prefersReducedMotion } from "./motion";
import { subscribeTheme } from "./theme";

const REVEAL_MS = 1400;
const LAMP_RADIUS = 210;

/* ---------------------------------------------- noise, fixed seed */
const perm = new Uint8Array(512);
{
  const p = Uint8Array.from({ length: 256 }, (_, i) => i);
  let seed = 20220;
  for (let i = 255; i > 0; i--) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const j = seed % (i + 1);
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
}

const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const lerp = (a: number, b: number, t: number) => a + t * (b - a);

function grad(hash: number, x: number, y: number) {
  switch (hash & 7) {
    case 0: return x + y;
    case 1: return -x + y;
    case 2: return x - y;
    case 3: return -x - y;
    case 4: return x;
    case 5: return -x;
    case 6: return y;
    default: return -y;
  }
}

function noise(x: number, y: number) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const X = xi & 255, Y = yi & 255;
  const xf = x - xi, yf = y - yi;
  const u = fade(xf), v = fade(yf);
  const aa = perm[perm[X] + Y], ab = perm[perm[X] + Y + 1];
  const ba = perm[perm[X + 1] + Y], bb = perm[perm[X + 1] + Y + 1];
  return lerp(
    lerp(grad(aa, xf, yf), grad(ba, xf - 1, yf), u),
    lerp(grad(ab, xf, yf - 1), grad(bb, xf - 1, yf - 1), u),
    v,
  );
}

function fbm(x: number, y: number) {
  let sum = 0, amp = 0.55, freq = 1;
  for (let octave = 0; octave < 4; octave++) {
    sum += amp * noise(x * freq, y * freq);
    freq *= 2.03;
    amp *= 0.5;
  }
  return sum;
}

/* ------------------------------------------------ marching squares */
// [edge A, edge B] pairs for each case. Edges: 0 top, 1 right, 2 bottom, 3 left.
const CASES: [number, number][][] = [
  [], [[3, 2]], [[2, 1]], [[3, 1]], [[0, 1]], [[3, 0], [2, 1]], [[0, 2]], [[3, 0]],
  [[3, 0]], [[0, 2]], [[0, 1], [3, 2]], [[0, 1]], [[3, 1]], [[2, 1]], [[3, 2]], [],
];

interface Lines {
  minor: Path2D;
  major: Path2D;
}

interface Field {
  heights: Float32Array;
  cols: number;
  rows: number;
  cell: number;
  min: number;
  max: number;
}

/** Samples the terrain height on a grid of small square cells. */
function sample(w: number, h: number): Field {
  const cell = w > 900 ? 7 : 6;
  const cols = Math.ceil(w / cell) + 1, rows = Math.ceil(h / cell) + 1;
  const scale = Math.max(260, Math.min(420, w * 0.3));
  const heights = new Float32Array(cols * rows);
  let min = Infinity, max = -Infinity;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const px = x * cell, py = y * cell;
      // A gentle tilt, so the hills rise toward the photo on the right.
      const v = fbm(px / scale + 3.1, py / scale + 7.7) + 0.22 * (px / w) - 0.12 * (py / h);
      heights[y * cols + x] = v;
      min = Math.min(min, v);
      max = Math.max(max, v);
    }
  }
  return { heights, cols, rows, cell, min, max };
}

const frac = (a: number, b: number, t: number) => (b === a ? 0.5 : (t - a) / (b - a));

/** Adds the contour line at height `t` to `path`, cell by cell. */
function march({ heights, cols, rows, cell: s }: Field, t: number, path: Path2D) {
  for (let y = 0; y < rows - 1; y++) {
    for (let x = 0; x < cols - 1; x++) {
      const i = y * cols + x;
      const tl = heights[i], tr = heights[i + 1], br = heights[i + cols + 1], bl = heights[i + cols];
      const c = (tl > t ? 8 : 0) | (tr > t ? 4 : 0) | (br > t ? 2 : 0) | (bl > t ? 1 : 0);
      for (const [a, b] of CASES[c]) {
        const x0 = x * s, y0 = y * s;
        // Where the line crosses each edge: top, right, bottom, left.
        const ex = [x0 + s * frac(tl, tr, t), x0 + s, x0 + s * frac(bl, br, t), x0];
        const ey = [y0, y0 + s * frac(tr, br, t), y0 + s, y0 + s * frac(tl, bl, t)];
        path.moveTo(ex[a], ey[a]);
        path.lineTo(ex[b], ey[b]);
      }
    }
  }
}

function trace(w: number, h: number): Lines {
  const field = sample(w, h);
  const lines: Lines = { minor: new Path2D(), major: new Path2D() };
  const levels = 18, step = (field.max - field.min) / levels;
  for (let k = 1; k < levels; k++) {
    march(field, field.min + k * step, k % 5 === 0 ? lines.major : lines.minor);
  }
  return lines;
}

function stroke(target: HTMLCanvasElement, lines: Lines, dpr: number, rgb: string, alpha: number, boost = 1) {
  const ctx = target.getContext("2d")!;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, target.width, target.height);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = `rgb(${rgb} / ${Math.min(1, alpha * boost)})`;
  ctx.lineWidth = 0.9;
  ctx.stroke(lines.minor);
  ctx.strokeStyle = `rgb(${rgb} / ${Math.min(1, alpha * 1.9 * boost)})`;
  ctx.lineWidth = 1.5;
  ctx.stroke(lines.major);
}

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Draws the field on `canvas`, sized to its parent. Returns a cleanup function. */
export function drawContours(canvas: HTMLCanvasElement): () => void {
  const parent = canvas.parentElement;
  const context = canvas.getContext("2d");
  if (!parent || !context) return () => {};
  const hero: HTMLElement = parent;
  const ctx: CanvasRenderingContext2D = context;

  const still = prefersReducedMotion();
  const hasLamp = !still && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const base = document.createElement("canvas"); // the lines at rest
  const lit = document.createElement("canvas"); // the same lines, brighter
  const lens = document.createElement("canvas"); // scratch space for the lamp
  const lensCtx = lens.getContext("2d")!;

  let lines: Lines | null = null;
  let width = 0, height = 0, dpr = 1;
  let alive = true, revealing = false;
  let revealFrame = 0, lampFrame = 0, resizeTimer = 0;
  const lamp = { x: 0, y: 0, toX: 0, toY: 0, glow: 0, toGlow: 0, drawn: null as Rect | null };

  function paintLayers() {
    if (!lines) return;
    const styles = getComputedStyle(document.documentElement);
    const rgb = styles.getPropertyValue("--contour").trim() || "26 95 122";
    const alpha = Number.parseFloat(styles.getPropertyValue("--contour-alpha")) || 0.2;
    stroke(base, lines, dpr, rgb, alpha);
    if (hasLamp) stroke(lit, lines, dpr, rgb, alpha, 3.2);
  }

  function show() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(base, 0, 0);
    lamp.drawn = null;
    drawLamp();
  }

  function layout(animate: boolean) {
    width = hero.clientWidth;
    height = hero.clientHeight;
    if (!width || !height) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    for (const c of [canvas, base, lit]) {
      c.width = Math.round(width * dpr);
      c.height = Math.round(height * dpr);
    }
    lens.width = lens.height = Math.ceil(2 * LAMP_RADIUS * dpr) + 2;
    lines = trace(width, height);
    paintLayers();
    cancelAnimationFrame(revealFrame);
    if (animate && !still) reveal();
    else {
      revealing = false;
      show();
    }
  }

  // Once, on first load: the lines draw in from the right.
  function reveal() {
    revealing = true;
    const start = performance.now();
    revealFrame = requestAnimationFrame(function frame(now) {
      const p = Math.min(1, (now - start) / REVEAL_MS);
      const from = Math.round(canvas.width * (1 - p) ** 3);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width - from;
      if (w > 0) ctx.drawImage(base, from, 0, w, canvas.height, from, 0, w, canvas.height);
      if (p < 1) revealFrame = requestAnimationFrame(frame);
      else {
        revealing = false;
        show();
      }
    });
  }

  function drawLamp() {
    const prev = lamp.drawn;
    if (prev) {
      ctx.clearRect(prev.x, prev.y, prev.w, prev.h);
      ctx.drawImage(base, prev.x, prev.y, prev.w, prev.h, prev.x, prev.y, prev.w, prev.h);
      lamp.drawn = null;
    }
    if (revealing || lamp.glow < 0.01) return;

    const r = LAMP_RADIUS * dpr, cx = lamp.x * dpr, cy = lamp.y * dpr;
    const x = Math.max(0, Math.floor(cx - r)), y = Math.max(0, Math.floor(cy - r));
    const w = Math.min(canvas.width, Math.ceil(cx + r)) - x;
    const h = Math.min(canvas.height, Math.ceil(cy + r)) - y;
    if (w <= 0 || h <= 0) return;

    lensCtx.globalCompositeOperation = "source-over";
    lensCtx.clearRect(0, 0, lens.width, lens.height);
    lensCtx.drawImage(lit, x, y, w, h, 0, 0, w, h);
    lensCtx.globalCompositeOperation = "destination-in";
    const light = lensCtx.createRadialGradient(cx - x, cy - y, 0, cx - x, cy - y, r);
    light.addColorStop(0, `rgb(0 0 0 / ${lamp.glow})`);
    light.addColorStop(0.45, `rgb(0 0 0 / ${lamp.glow * 0.55})`);
    light.addColorStop(1, "rgb(0 0 0 / 0)");
    lensCtx.fillStyle = light;
    lensCtx.fillRect(0, 0, w, h);
    ctx.drawImage(lens, 0, 0, w, h, x, y, w, h);
    lamp.drawn = { x, y, w, h };
  }

  // The lamp trails the pointer a little, and fades in and out.
  function lampStep() {
    lampFrame = 0;
    lamp.x += (lamp.toX - lamp.x) * 0.2;
    lamp.y += (lamp.toY - lamp.y) * 0.2;
    lamp.glow += (lamp.toGlow - lamp.glow) * 0.12;
    const moving =
      Math.abs(lamp.toX - lamp.x) > 0.5 || Math.abs(lamp.toY - lamp.y) > 0.5 || Math.abs(lamp.toGlow - lamp.glow) > 0.01;
    if (!moving) Object.assign(lamp, { x: lamp.toX, y: lamp.toY, glow: lamp.toGlow });
    drawLamp();
    if (moving) lampFrame = requestAnimationFrame(lampStep);
  }
  const wakeLamp = () => {
    if (!lampFrame) lampFrame = requestAnimationFrame(lampStep);
  };
  function onPointerMove(e: PointerEvent) {
    if (e.pointerType !== "mouse") return;
    const box = hero.getBoundingClientRect();
    lamp.toX = e.clientX - box.left;
    lamp.toY = e.clientY - box.top;
    // Light up where the pointer is rather than gliding in from the last spot.
    if (lamp.glow < 0.01) Object.assign(lamp, { x: lamp.toX, y: lamp.toY });
    lamp.toGlow = 1;
    wakeLamp();
  }
  function onPointerLeave() {
    lamp.toGlow = 0;
    wakeLamp();
  }

  const resizeObserver = new ResizeObserver(() => {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      if (!lines) return;
      if (Math.abs(hero.clientWidth - width) > 2 || Math.abs(hero.clientHeight - height) > 2) layout(false);
    }, 150);
  });
  const unsubscribeTheme = subscribeTheme(() => {
    paintLayers();
    if (!revealing) show();
  });

  function start() {
    if (!alive) return;
    layout(true);
    resizeObserver.observe(hero);
    if (hasLamp) {
      hero.addEventListener("pointermove", onPointerMove);
      hero.addEventListener("pointerleave", onPointerLeave);
    }
  }
  // Wait for the fonts, which set the hero's height; draw anyway if they fail.
  document.fonts.ready.then(start, start);

  return () => {
    alive = false;
    cancelAnimationFrame(revealFrame);
    cancelAnimationFrame(lampFrame);
    clearTimeout(resizeTimer);
    resizeObserver.disconnect();
    unsubscribeTheme();
    hero.removeEventListener("pointermove", onPointerMove);
    hero.removeEventListener("pointerleave", onPointerLeave);
  };
}
