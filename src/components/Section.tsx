"use client";

import { m, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

// Sized so the word spans the viewport: 22.5vw fit the 9-char "servicios",
// 25.5vw the 8-char "services". One knob for every wordmark on the page.
// Must be an inline style — Tailwind can't generate arbitrary values it
// can't see in the source, so `text-[${n}vw]` would silently produce nothing.
const WORDMARK_VW = 202;

/** Full-bleed lowercase wordmark, with an optional supporting line set to the right. */
export function SectionHeader({ word, children }: { word: string; children?: React.ReactNode }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <>
      <div className="overflow-hidden" ref={ref}>
        <m.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          style={{ fontSize: `${WORDMARK_VW / word.length}vw` }}
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
            className="ml-auto max-w-md text-xl text-muted leading-relaxed md:text-right"
          >
            {children}
          </m.p>
        </div>
      )}
    </>
  );
}

/**
 * Scroll-linked entrance from off-screen. Tracks scroll position both ways
 * rather than firing once. Needs overflow-hidden on an ancestor — the start
 * position is a full viewport out, which is real horizontal scroll otherwise.
 */
export function SlideIn({
  from = "left",
  className,
  children,
}: {
  from?: "left" | "right";
  className?: string;
  children: React.ReactNode;
}) {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    reducedMotion ? ["0vw", "0vw"] : [from === "left" ? "-100vw" : "100vw", "0vw"],
  );
  const opacity = useTransform(scrollYProgress, [0, 0.6], [0, 1]);

  return (
    <m.div ref={ref} style={{ x, opacity }} className={className}>
      {children}
    </m.div>
  );
}
