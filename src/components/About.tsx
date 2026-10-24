"use client";

import { animate, m, useMotionValue, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useLayoutEffect, useRef, useState, type ReactNode, type Ref } from "react";
import { flushSync } from "react-dom";
import { useLanguage } from "@/context/LanguageContext";
import { scrollToSection } from "@/lib/scroll";
import { useIsMobile, CTA } from "@/components/Section";

/* "Marcin", top-left. The size lives in globals.css as
   --name-size, capped by both width and height — see the note there. In the
   opening stack it is set smaller so the three pieces read as one group. */
const NAME_TYPE = "font-black text-text tracking-tighter leading-none";
const NAME_SIZE = "text-(length:--name-size)";
const NAME_SIZE_STACKED = "text-[length:calc(var(--name-size)*0.55)]";

/* GIVEN_TOP is an exact pixel rather than a scale step: the scale straddles the
   target (pt-16 is 83px, pt-20 is 104px against the 20.8px root) with nothing
   in between. 83px is the floor either way — that is the height of the fixed
   header, and below it the name's caps run up under the nav bar. */
const GIVEN_TOP = "pt-[90px]";

/* The intro, as one gesture. The page is server-rendered as a centred stack —
   name, copy, CTA — so it paints immediately and the headline is the first
   (and largest-contentful) thing on screen. After HOLD, the layout switches to
   the corners and each piece is animated from where it was to where it now
   is (FLIP: measure first, switch, measure last, invert, play), all on one
   shared curve. The nav drops in as they land (Navigation.tsx, delay 1.4s).
   An earlier version hid everything until JS had measured it, which pushed
   mobile LCP to ~4s. */
const HOLD = 0.6;
const TRAVEL = 1.0;
// In-out rather than the site's usual ease-out: a move from one place to
// another reads as travel when it accelerates away and settles in.
const TRAVEL_EASE = [0.65, 0, 0.35, 1] as const;

type Piece = { x: MotionValue<number>; y: MotionValue<number>; scale: MotionValue<number> };

function usePiece(): Piece {
  return { x: useMotionValue(0), y: useMotionValue(0), scale: useMotionValue(1) };
}

/** A wrapper the intro can move. Transform only; the layout is the phase's.
    The element ref stays a separate prop: React's compiler treats any object
    holding a ref as a ref, and won't let it be read during render. */
function PieceBox({ piece, boxRef, className, children }: { piece: Piece; boxRef: Ref<HTMLDivElement>; className?: string; children: ReactNode }) {
  return (
    <m.div ref={boxRef} style={{ x: piece.x, y: piece.y, scale: piece.scale }} className={className}>
      {children}
    </m.div>
  );
}

export default function About() {
  const { t } = useLanguage();
  const [phase, setPhase] = useState<"stack" | "corners">("stack");
  const stacked = phase === "stack";

  const name = usePiece();
  const copy = usePiece();
  const cta = usePiece();
  const nameRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const isMobile = useIsMobile();
  const reducedMotion = useReducedMotion();
  const still = isMobile || reducedMotion;

  /* Under reduced motion, or when the page opens already scrolled (a reload
     mid-page, hero not in view to watch), go straight to the corners. */
  useLayoutEffect(() => {
    const skip = reducedMotion || window.scrollY > 0;
    const pieces = [name, copy, cta];
    const refs = [nameRef, copyRef, ctaRef];
    let controls: { stop: () => void }[] = [];

    // Both paths go through the timer: a state change made synchronously in
    // the effect body would cascade a second render before first paint.
    const timer = window.setTimeout(() => {
      if (skip) {
        setPhase("corners");
        return;
      }
      const first = refs.map((r) => r.current?.getBoundingClientRect());
      flushSync(() => setPhase("corners"));
      const last = refs.map((r) => r.current?.getBoundingClientRect());
      const travel = { duration: TRAVEL, ease: TRAVEL_EASE };

      controls = pieces.flatMap((p, i) => {
        const f = first[i];
        const l = last[i];
        if (!f || !l) return [];
        // Scale about the centre (origin-center on each box), so the offset
        // is just the difference between the two centres.
        p.x.set(f.left + f.width / 2 - (l.left + l.width / 2));
        p.y.set(f.top + f.height / 2 - (l.top + l.height / 2));
        p.scale.set(f.width / l.width);
        return [animate(p.x, 0, travel), animate(p.y, 0, travel), animate(p.scale, 1, travel)];
      });
    }, skip ? 0 : HOLD * 1000);

    return () => {
      window.clearTimeout(timer);
      controls.forEach((c) => c.stop());
    };
    // Runs once on mount; the pieces' motion values are stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  // Keyed to the section's own travel, not the viewport: 0 = section top at
  // viewport top, 1 = section bottom at viewport top, so the fade can only
  // start once everything has scrolled up into view.
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0.85, 1], still ? [1, 1] : [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", still ? "0%" : "8%"]);

  return (
    <section ref={sectionRef} id="hero" className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Two layouts on one column. Stack: everything centred in the flow.
          Corners: name top-left, copy pulled out to dead centre, CTA pushed to
          the bottom-right by mt-auto. DOM order is name, copy, CTA in both, so
          a screen reader hears the name, then what's on offer, then the ask. */}
      <m.div
        style={{ y, opacity }}
        className={`relative z-10 flex-1 flex flex-col px-6 md:px-16 ${GIVEN_TOP} pb-10 w-full ${stacked ? "items-center justify-center gap-6" : ""}`}
      >
        <PieceBox piece={name} boxRef={nameRef} className={`origin-center ${stacked ? "self-center" : "self-start"}`}>
          <p className={`${NAME_TYPE} ${stacked ? NAME_SIZE_STACKED : NAME_SIZE}`}>
            Marcin
          </p>
        </PieceBox>

        {/* In the corners it is centred against the section, out of the flow,
            and needs its own px-6 (inset-x-0 ignores the column's padding). In
            the stack the column's padding already applies, so the copy is the
            same width in both and the move doesn't rescale or rewrap it.
            The centring is Tailwind's translate property and the intro writes
            transform, so the two never overwrite each other. */}
        <div
          className={
            stacked
              ? "w-full max-w-xl text-center"
              : "absolute inset-x-0 top-1/2 -translate-y-1/2 mx-auto max-w-xl px-6 text-center"
          }
        >
          <PieceBox piece={copy} boxRef={copyRef} className="origin-center">
            {/* Eyebrow in the same mono/uppercase/tracked voice as the Projects
                tags and the Services line-item headings. */}
            <p className="mb-4 font-mono text-xs uppercase tracking-widest text-muted text-balance">
              {t.about.hero_eyebrow}
            </p>
            {/* This one does need the inline family. It is an h1, and the
                unlayered `h1, h2, h3` rule in globals.css sets Fraunces at a
                specificity Tailwind's layered utilities cannot beat. */}
            <h1
              className="text-xl md:text-2xl font-medium text-text text-balance"
              style={{ fontFamily: "var(--font-inter), Inter, system-ui, sans-serif" }}
            >
              {t.about.headline}
            </h1>
            <p className="mt-4 text-sm text-muted text-balance">{t.about.hero_sub}</p>
          </PieceBox>
        </div>

        <PieceBox piece={cta} boxRef={ctaRef} className={`origin-center ${stacked ? "self-center" : "mt-auto self-end"}`}>
          <button type="button" onClick={() => scrollToSection("contact")} className={CTA}>
            {t.about.cta_primary}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </PieceBox>
      </m.div>
    </section>
  );
}
