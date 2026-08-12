"use client";

import { useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * The chef photo resolving into ASCII, scrubbed to the scroll position: the
 * scan line sits where the reader has scrolled to, so it converts on the way
 * down and reverts on the way up. No crossfade — above the line is final,
 * below it is the untouched photo — so it reads as one pass of a decoder
 * rather than a dissolve. Nothing is on a timer; the reader drives it.
 *
 * Reduced motion gets the resolved ASCII and no scrubbing.
 */

/* Dark to light. The photo is already black and white, so luminance alone
   picks the glyph — no channel weighting beyond the usual Rec. 601 mix.
   The long ramp: ~70 steps rather than 10, so the wall and the whites of the
   jacket get gradation instead of banding into flat plates of one character. */
const RAMP = "@%#*+=-:. ";

/* ponytail: fixed size, grid built once. Making it fluid means rebuilding the
   grid on every resize — worth it only if this ever needs to fill a column.
   HEIGHT is portrait.jpg's aspect at WIDTH; both are stated so the column
   reserves its space before the image loads. */
const WIDTH = 320;
const HEIGHT = 456;
const CELL = 5;

type Cell = { col: number; row: number; char: string; lum: number };

export default function Portrait({ alt }: { alt: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const gridRef = useRef<Cell[]>([]);
  const [ready, setReady] = useState(false);

  const hostRef = useRef(null);
  const reducedMotion = useReducedMotion();
  /* Both ends are pinned to the top edge of the frame, so the window is a
     plain span of scroll rather than something that stretches with the
     portrait's height: the photo holds untouched while it climbs from the
     bottom of the screen to 55%, converts over the next third of a screen,
     and is fully resolved by 20% — still whole, still in view. It has to
     read as a photograph before it is worth watching it stop being one.
     Reverses on the way back up. */
  const { scrollYProgress } = useScroll({
    target: hostRef,
    offset: ["start 0.55", "start 0.2"],
  });

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      const rows = Math.floor(HEIGHT / CELL);
      const cols = Math.floor(WIDTH / CELL);

      // Sampled once off-screen: one getImageData for the whole portrait, then
      // the scrub only ever reads this grid.
      const off = document.createElement("canvas");
      off.width = WIDTH;
      off.height = HEIGHT;
      const octx = off.getContext("2d");
      if (!octx) return;
      octx.drawImage(img, 0, 0, WIDTH, HEIGHT);
      const { data } = octx.getImageData(0, 0, WIDTH, HEIGHT);

      const grid: Cell[] = [];
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          // Centre of the cell, not its corner — a corner sample lands on the
          // edge between two cells and the ramp flickers along contours.
          const px = Math.min(col * CELL + (CELL >> 1), WIDTH - 1);
          const py = Math.min(row * CELL + (CELL >> 1), HEIGHT - 1);
          const i = (py * WIDTH + px) * 4;
          const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          const char = RAMP[Math.min(RAMP.length - 1, Math.floor((lum / 255) * RAMP.length))];
          grid.push({ col, row, char, lum });
        }
      }
      gridRef.current = grid;
      setReady(true);
    };
    img.src = "/portrait.jpg";
  }, []);

  /** progress 0 = untouched photo, 1 = fully resolved ASCII. */
  const draw = useCallback((progress: number) => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Capped at 2: a 3x screen triples the fill cost for a difference nobody
    // sees at 5px glyphs.
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (canvas.width !== WIDTH * dpr) {
      canvas.width = WIDTH * dpr;
      canvas.height = HEIGHT * dpr;
      canvas.style.width = `${WIDTH}px`;
      canvas.style.height = `${HEIGHT}px`;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Read off the same tokens the rest of the page uses, so the canvas can't
    // drift from the palette when a token changes.
    const css = getComputedStyle(document.documentElement);
    const token = (name: string) => css.getPropertyValue(name).trim();
    const bg = token("--color-bg");
    const ink = token("--color-text");
    const muted = token("--color-muted");
    /* The mid tone is the ink at 60%, written as #RRGGBBAA rather than a
       globalAlpha flip per glyph. The tokens are six-digit hex; anything else
       falls back to the flat ink so a token change can't paint nothing. */
    const mid = /^#[0-9a-f]{6}$/i.test(ink) ? `${ink}99` : ink;

    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    // Canvas font strings don't resolve CSS variables, and the mono family is
    // a next/font-generated name — so read what the element actually computed
    // to rather than naming a family here.
    ctx.font = `${CELL}px ${getComputedStyle(canvas).fontFamily}`;
    ctx.textBaseline = "top";

    // Three tones, not a per-pixel gradient: the darks carry the face, the
    // mids sit back, the lights recede. All ink and grey — the source is a
    // black-and-white photograph and colour only made it look tinted.
    const drawAscii = (untilY = Infinity) => {
      for (const p of gridRef.current) {
        const y = p.row * CELL;
        if (y > untilY) continue;
        ctx.fillStyle = p.lum < 70 ? ink : p.lum < 140 ? mid : muted;
        ctx.fillText(p.char, p.col * CELL, y);
      }
    };

    const scanY = Math.min(Math.max(progress, 0), 1) * HEIGHT;

    if (scanY >= HEIGHT) {
      drawAscii();
      return;
    }

    // Below the line: the photo, untouched.
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, scanY, WIDTH, HEIGHT - scanY);
    ctx.clip();
    ctx.drawImage(img, 0, 0, WIDTH, HEIGHT);
    ctx.restore();

    if (scanY <= 0) return;

    // Above it: opaque ASCII on a clean ground, so the two never blend.
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, WIDTH, scanY);
    ctx.clip();
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, WIDTH, scanY);
    drawAscii(scanY);
    ctx.restore();
    // No rule at the boundary: the change in texture marks it on its own.
  }, []);

  // First paint: the scroll event only fires on the next move, so draw
  // whatever position the reader already happens to be at.
  useEffect(() => {
    if (!ready) return;
    draw(reducedMotion ? 1 : scrollYProgress.get());
  }, [ready, reducedMotion, draw, scrollYProgress]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (ready && !reducedMotion) draw(v);
  });

  return (
    <div
      ref={hostRef}
      /* Sized up front, so the column doesn't jump when the image lands. */
      className="shrink-0 border border-border leading-none w-[320px] h-[456px]"
    >
      <canvas ref={canvasRef} className="font-mono" role="img" aria-label={alt} />
    </div>
  );
}
