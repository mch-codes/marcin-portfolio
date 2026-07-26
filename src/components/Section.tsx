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
 * The "mc" monogram: upright m, sideways c. Shared because it sits in both the
 * header and the footer and the two have to stay identical.
 *
 * The c turns via writing-mode rather than `rotate-90`, matching the hero
 * surname — a transform would leave the glyph's layout box upright, so the
 * pair would need a hand-tuned negative margin to close the gap. Sizing and
 * colour stay with the caller; only the arrangement lives here.
 */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center leading-none ${className}`}>
      m<span className="[writing-mode:vertical-rl] leading-none">c</span>
    </span>
  );
}

// Sized so the word spans the viewport: 22.5vw fit the 9-char "servicios",
// 25.5vw the 8-char "services". One knob for every wordmark on the page.
// Must be an inline style — Tailwind can't generate arbitrary values it
// can't see in the source, so `text-[${n}vw]` would silently produce nothing.
const WORDMARK_VW = 202;

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
          style={{ fontSize: `${(WORDMARK_VW / word.length) * scale}vw` }}
          className="font-black text-text tracking-tighter leading-none lowercase text-center whitespace-nowrap -mb-[0.15em]"
        >
          {word}
        </m.h2>
      </div>

      {children && (
        <div className="max-w-6xl mx-auto px-6">
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
 * Entrance fade for content blocks. Replaces the old SlideIn, which flew
 * elements in from a full viewport out — that needed overflow-hidden on an
 * ancestor to avoid real horizontal scroll, and the travel was the loudest
 * motion on the page. This just lifts 12px and fades.
 */
export function Reveal({
  className,
  children,
}: {
  className?: string;
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
      transition={{ duration: 0.5, ease }}
      className={className}
    >
      {children}
    </m.div>
  );
}
