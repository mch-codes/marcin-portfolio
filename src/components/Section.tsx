"use client";

import { m, useInView, useReducedMotion } from "framer-motion";
import { useLayoutEffect, useRef, useSyncExternalStore } from "react";

// Built on first read, not at import: matchMedia doesn't exist on the server.
let mql: MediaQueryList | undefined;
const getMql = () => (mql ??= window.matchMedia("(max-width: 767px)"));

/** Matches Tailwind's `md` breakpoint, so JS motion cuts out where the layout does. */
export function useIsMobile() {
  // A media query is an external store, so it subscribes rather than setting
  // state from an effect — the server snapshot is false, and the client's real
  // value arrives on the first commit without a second render.
  return useSyncExternalStore(
    (onChange) => {
      const q = getMql();
      q.addEventListener("change", onChange);
      return () => q.removeEventListener("change", onChange);
    },
    () => getMql().matches,
    () => false
  );
}

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

/**
 * The one button look on the site — the hero's pill. Every other CTA (services,
 * mid-page, contact submit, 404) imports this rather than restating it, so
 * there is a single place to change the shape. Callers append only what is
 * theirs alone: `shrink-0`, `self-start`, `disabled:*`.
 */
export const CTA =
  "relative isolate overflow-hidden inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-3 rounded-full border border-border text-sm font-semibold text-muted transition-colors duration-300 hover:text-bg hover:border-text focus-visible:text-bg focus-visible:border-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg " +
  /* The ink wipe: a full-size layer behind the label, scaled flat against the
     left edge and released on hover. `isolate` + `-z-10` keeps it under the
     text without the callers having to wrap their label in a span, and
     `overflow-hidden` is what clips it back to the pill. */
  "before:absolute before:inset-0 before:-z-10 before:bg-text before:origin-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-out hover:before:scale-x-100 focus-visible:before:scale-x-100";

/**
 * The ringed "MC" badge. One look, two places: the back-to-top control
 * pinned bottom-left and the footer's mark. The caller owns position and
 * behaviour; only the disc itself lives here.
 *
 * This replaced a lowercase Fraunces monogram with a sideways c. It was the
 * only thing on the page in that arrangement, and the two marks reading
 * differently made them look like two brands.
 */
export const BADGE =
  "grid place-items-center w-10 h-10 rounded-full bg-bg text-text border border-text text-xs font-semibold tracking-wide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg";

/* Every wordmark runs the full width of its container, so its size is measured
   rather than derived: type it at a known size, see how wide it came out, and
   scale by the ratio. A per-word estimate can't do this — the old one guessed
   from character count, which is wrong by the difference between an "i" and a
   "w" and needed a hand-tuned multiplier per section to compensate.
   text-[19vw] is only what the first paint and a no-JS render fall back to —
   kept near the fitted size at the gutters below so there is no visible jump. */
function useFitToWidth(word: string) {
  const ref = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    const box = el?.parentElement;
    if (!el || !box) return;

    const fit = () => {
      // Measured at a fixed 100px rather than at whatever it currently is, so
      // the result doesn't drift as it's applied and re-measured.
      el.style.fontSize = "100px";
      el.style.fontSize = `${(100 * box.clientWidth) / el.getBoundingClientRect().width}px`;
    };

    fit();
    // The webfont lands after first paint; Inter and the fallback don't measure
    // the same, so the first fit is against the wrong metrics.
    document.fonts.ready.then(fit);
    // Covers viewport resize and anything else that moves the gutters.
    const ro = new ResizeObserver(fit);
    ro.observe(box);
    return () => ro.disconnect();
  }, [word]);

  return ref;
}

/** Full-bleed lowercase wordmark, with an optional supporting line set to the right. */
export function SectionHeader({
  word,
  children,
}: {
  word: string;
  children?: React.ReactNode;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const wordRef = useFitToWidth(word);

  return (
    <>
      {/* The gutters are what size the wordmark: it fits its parent, so insetting
          the parent is the whole knob. Same px-6/md:px-16 the body copy uses,
          so the word now lines up with the columns under it. */}
      <div className="overflow-hidden px-6 md:px-16" ref={ref}>
        <m.h2
          ref={wordRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          /* Inline, not a `font-sans` utility: the unlayered `h1, h2, h3` rule
             in globals.css sets Fraunces at a specificity Tailwind's layered
             utilities cannot beat. Same override the hero h1 carries. */
          style={{ fontFamily: "var(--font-inter), Inter, system-ui, sans-serif" }}
          className="w-fit text-[19vw] font-bold text-text tracking-tighter leading-none lowercase whitespace-nowrap -mb-[0.15em]"
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
