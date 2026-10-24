"use client";

import { useInView, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * The chef photo turning into code, played as a short sequence when the
 * portrait comes into view — not scrubbed to scroll, so it reads as a
 * transition happening rather than one the reader has to drive:
 *
 *   pixelate  photo breaks into blocks that grow to the code grid
 *   flip      each block, in random order, becomes a flickering glyph
 *   decode    the flicker settles into real source, top to bottom
 *
 * It resets once the portrait leaves the screen, so coming back replays it.
 * Reduced motion gets the finished code portrait and no sequence.
 *
 * The glyphs are not a density ramp: they are a real source file, read left
 * to right, row after row, at a size where it still reads as code. The photo
 * only decides how strongly each character is inked.
 */

/* The text the portrait is printed in. Thematic, and it has to look like a
   file: brackets, arrows, keywords. It wraps on the grid, not on its own
   newlines, so it is one long line repeated until every cell has a glyph. */
const SOURCE =
  'const kitchen = { mise: "en place", covers: 120, pass: "hot" }; ' +
  "function plate(order) { return order.map((dish) => cook(dish, { heat: 220 })); } " +
  "export default function Marcin() { const craft = useCraft({ precision: true }); " +
  'return <Production craft={craft} from="kitchen" to="code" />; } ' +
  "// same discipline, different craft ";

/* What the flip stage flickers through before the real code lands. */
const NOISE = "{}[]()<>/=;:+*#%&$@!?_-";

/* ponytail: fixed internal resolution, grid built once; CSS scales the canvas
   to its column, so a narrow phone shrinks it instead of rebuilding the grid.
   HEIGHT is portrait.jpg's aspect (340x484) at WIDTH. */
const WIDTH = 360;
const HEIGHT = 512;
/* A cell is one monospace character: ~0.6em wide, a line tall. 8px type on a
   5x8 grid sets the code solid, line after line, like an editor — and gives
   72x64 cells, enough for the figure to survive. */
const FONT = 8;
const CELL_W = 5;
const CELL_H = 8;
const COLS = Math.floor(WIDTH / CELL_W);
const ROWS = Math.floor(HEIGHT / CELL_H);

/* Stage boundaries, in seconds. DECODE_SWEEP is how long the settle front
   takes to travel from the top row to the bottom; each cell also gets up to
   JITTER of its own so the front is ragged rather than a ruler line. */
const PIXELATE_END = 0.9;
const FLIP_END = 1.6;
const DECODE_SWEEP = 1.1;
const JITTER = 0.5;
const TOTAL = FLIP_END + DECODE_SWEEP + JITTER;

/* Deterministic per-cell randomness — ponytail: fract-sine hash, no table. */
const rand = (n: number) => {
  const h = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return h - Math.floor(h);
};
const ease = (x: number) => 1 - (1 - x) ** 3;

/**
 * lum: the cell's grey (0-255), for the block it shows while pixelated.
 * alpha: how strongly its glyph is inked, 0 (left blank) to 1.
 * flipAt / settleAt: when, in seconds, it turns into noise and into code.
 */
type Cell = { char: string; lum: number; alpha: number; flipAt: number; settleAt: number };

export default function Portrait({ alt }: { alt: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const gridRef = useRef<Cell[]>([]);
  const [ready, setReady] = useState(false);

  const hostRef = useRef(null);
  const reducedMotion = useReducedMotion();
  // Half the portrait on screen before it starts, so the opening frames —
  // the photo itself — are actually seen.
  const inView = useInView(hostRef, { amount: 0.5 });

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;

      /* Sampled by downscaling to one pixel per cell: the browser averages
         each cell's area, which is also exactly what the last pixelate frame
         shows, so the blocks and the first glyphs agree on their grey. */
      const off = document.createElement("canvas");
      off.width = COLS;
      off.height = ROWS;
      const octx = off.getContext("2d");
      if (!octx) return;
      octx.drawImage(img, 0, 0, COLS, ROWS);
      const { data } = octx.getImageData(0, 0, COLS, ROWS);
      const lums: number[] = [];
      for (let i = 0; i < data.length; i += 4) {
        lums.push(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
      }

      /* Stretch to the photo's own range, then ink by darkness on a steep
         curve: the mid-grey wall drops to a faint ~10% so hair, the jacket's
         V and the apron carry the likeness. Under 6% is left blank. */
      const min = Math.min(...lums);
      const span = Math.max(1, Math.max(...lums) - min);
      gridRef.current = lums.map((l, n) => {
        const dark = 1 - (l - min) / span;
        const a = Math.min(1, dark ** 3 * 1.5);
        const row = Math.floor(n / COLS);
        return {
          char: SOURCE[n % SOURCE.length],
          lum: l,
          alpha: a < 0.06 ? 0 : a,
          flipAt: PIXELATE_END + rand(n) * (FLIP_END - PIXELATE_END),
          settleAt: FLIP_END + (row / ROWS) * DECODE_SWEEP + rand(n + 7) * JITTER,
        };
      });
      setReady(true);
    };
    img.src = "/portrait.jpg";
  }, []);

  /** One frame of the sequence at time t (seconds since it started). */
  const draw = useCallback((t: number) => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Capped at 2: a 3x screen triples the fill cost for a difference nobody
    // sees at 8px glyphs.
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (canvas.width !== WIDTH * dpr) {
      canvas.width = WIDTH * dpr;
      canvas.height = HEIGHT * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Read off the same tokens the rest of the page uses, so the canvas can't
    // drift from the palette when a token changes.
    const css = getComputedStyle(document.documentElement);
    const bg = css.getPropertyValue("--color-bg").trim();
    const ink = css.getPropertyValue("--color-text").trim();

    // Stage 1: the photo, drawn small and blown back up with smoothing off,
    // so it breaks into blocks that grow until they match the code grid.
    if (t < PIXELATE_END) {
      const k = ease(t / PIXELATE_END);
      if (k < 0.02) {
        ctx.drawImage(img, 0, 0, WIDTH, HEIGHT);
        return;
      }
      const w = Math.max(COLS, Math.round(WIDTH / (1 + k * (CELL_W - 1))));
      const h = Math.max(ROWS, Math.round(HEIGHT / (1 + k * (CELL_H - 1))));
      const off = document.createElement("canvas");
      off.width = w;
      off.height = h;
      off.getContext("2d")?.drawImage(img, 0, 0, w, h);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(off, 0, 0, w, h, 0, 0, WIDTH, HEIGHT);
      ctx.imageSmoothingEnabled = true;
      return;
    }

    // Stages 2 and 3, cell by cell on a clean ground: a grey block until the
    // cell flips, flickering noise until it settles, then its line of code.
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    // Canvas font strings don't resolve CSS variables, and the mono family is
    // a next/font-generated name — so read what the element computed to.
    ctx.font = `${FONT}px ${getComputedStyle(canvas).fontFamily}`;
    ctx.textBaseline = "top";
    // Noise changes ~20 times a second, not every frame, so it reads as
    // characters cycling rather than static.
    const tick = Math.floor(t * 20);

    gridRef.current.forEach((g, n) => {
      const x = (n % COLS) * CELL_W;
      const y = Math.floor(n / COLS) * CELL_H;
      if (t < g.flipAt) {
        ctx.globalAlpha = 1;
        ctx.fillStyle = `rgb(${g.lum},${g.lum},${g.lum})`;
        ctx.fillRect(x, y, CELL_W, CELL_H);
        return;
      }
      if (g.alpha === 0) return;
      ctx.globalAlpha = g.alpha;
      ctx.fillStyle = ink;
      const char = t < g.settleAt ? NOISE[Math.floor(rand(n * 31 + tick) * NOISE.length)] : g.char;
      ctx.fillText(char, x, y);
    });
    ctx.globalAlpha = 1;
  }, []);

  /* Plays while in view, resets to the photo once it's gone, so the next
     visit replays it from the start. */
  useEffect(() => {
    if (!ready) return;
    if (reducedMotion) {
      draw(TOTAL);
      return;
    }
    if (!inView) {
      draw(0);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const frame = (now: number) => {
      const t = (now - start) / 1000;
      draw(Math.min(t, TOTAL));
      if (t < TOTAL) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [ready, inView, reducedMotion, draw]);

  return (
    <div
      ref={hostRef}
      /* Aspect-locked, so the column reserves its space before the image
         lands; the canvas fills it and scales with the column. */
      className="w-full aspect-[360/512] border border-border leading-none"
    >
      <canvas ref={canvasRef} className="block w-full h-full font-mono" role="img" aria-label={alt} />
    </div>
  );
}
