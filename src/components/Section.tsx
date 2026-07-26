"use client";

import { m, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/** Matches Tailwind's `md` breakpoint, so JS motion cuts out where the layout does. */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return isMobile;
}

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

/**
 * The one button look on the site — the hero's pill. Every other CTA (services,
 * mid-page, contact submit, 404) imports this rather than restating it, so
 * there is a single place to change the shape. Callers append only what is
 * theirs alone: `shrink-0`, `self-start`, `disabled:*`.
 */
export const CTA =
  "inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-3 rounded-full border border-border text-sm font-semibold text-muted transition-colors duration-200 hover:text-text hover:border-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg";

/**
 * The ink-filled "MC" badge. One look, two places: the back-to-top control
 * pinned bottom-left and the footer's mark. The caller owns position and
 * behaviour; only the disc itself lives here.
 *
 * This replaced a lowercase Fraunces monogram with a sideways c. It was the
 * only thing on the page in that arrangement, and the two marks reading
 * differently made them look like two brands.
 */
export const BADGE =
  "grid place-items-center w-10 h-10 rounded-full bg-text text-bg text-xs font-semibold tracking-wide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg";

// Sized so the word spans the viewport: 22.5vw fit the 9-char "servicios",
// 25.5vw the 8-char "services". One knob for every wordmark on the page.
// Must be an inline style — Tailwind can't generate arbitrary values it
// can't see in the source, so `text-[${n}vw]` would silently produce nothing.
const WORDMARK_VW = 202;

// Ceiling on the above. The hero name is meant to be the largest type on the
// site, and the derived vw size beat it by ~2.5x on a laptop — so a wordmark
// may run to the viewport edge only until it reaches this fraction of the
// name. Expressed against --name-size (globals.css) rather than as a smaller
// vw constant on purpose: vw and vh trade places with the aspect ratio, so a
// constant that holds on 1440x780 loses on 1920x600.
const WORDMARK_CAP = "calc(var(--name-size) * 0.85)";

/** Full-bleed lowercase wordmark, with an optional supporting line set to the right. */
export function SectionHeader({
  word,
  scale = 1,
  children,
}: {
  word: string;
  /** Multiplier on the derived size, for a word the formula undersells.
      A multiplier rather than an absolute vw: the size has to stay derived
      from length, or the other language regresses — "servicios" is 9 chars
      and "services" is 8, so any fixed number is wrong for one of them. */
  scale?: number;
  children?: React.ReactNode;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <>
      <div className="overflow-hidden" ref={ref}>
        <m.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          style={{ fontSize: `min(${(WORDMARK_VW / word.length) * scale}vw, ${WORDMARK_CAP})` }}
          className="font-black text-text tracking-tighter leading-none lowercase text-center whitespace-nowrap -mb-[0.15em]"
        >
          {word}
        </m.h2>
      </div>

      {children && (
        <div className="px-6 md:px-16">
          <m.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15, ease }}
            className="ml-auto max-w-md text-sm text-muted leading-relaxed md:text-xl md:text-right"
          >
            {children}
          </m.p>
        </div>
      )}
    </>
  );
}

/**
 * A section's supporting line, set at its foot rather than in SectionHeader's
 * children slot — that one puts the line in a column beside the wordmark.
 * Flush to the right gutter, so its right edge lands on the same line the
 * hero's vertical surname hangs on. The asterisk is inline and superscripted,
 * so it hangs off the top-left of the first word instead of floating in the
 * block's corner. Mono is set here rather than inherited — no section carries
 * font-mono any more, and the three footnotes have to read alike.
 */
export function Footnote({
  align = "right",
  children,
}: {
  /** Which gutter the line hangs on. Left is for a section whose body copy
      sits on the right, so the two don't stack against the same edge. */
  align?: "left" | "right";
  children: React.ReactNode;
}) {
  return (
    <Reveal className="mt-14 md:mt-20 font-mono text-xs md:text-base text-muted leading-relaxed">
      <p className={`max-w-md ${align === "left" ? "mr-auto text-left" : "ml-auto text-right"}`}>
        <span aria-hidden className="align-super text-text text-xl md:text-2xl leading-none -mr-0.5">*</span>
        {children}
      </p>
    </Reveal>
  );
}

/**
 * Entrance fade for content blocks. Replaces the old SlideIn, which flew
 * elements in from a full viewport out — that needed overflow-hidden on an
 * ancestor to avoid real horizontal scroll, and the travel was the loudest
 * motion on the page. This just lifts 12px and fades.
 */
export function Reveal({
  className,
  delay = 0,
  children,
}: {
  className?: string;
  /** Seconds to hold before this block fades in. Used to stagger a grid so its
      cards land one after another; each Reveal still waits for its own
      in-view, so a card below the fold doesn't burn its delay off-screen. */
  delay?: number;
  children: React.ReactNode;
}) {
  const reducedMotion = useReducedMotion();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <m.div
      ref={ref}
      initial={reducedMotion ? false : { opacity: 0, y: 12 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: reducedMotion ? 0 : delay, ease }}
      className={className}
    >
      {children}
    </m.div>
  );
}
