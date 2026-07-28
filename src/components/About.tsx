"use client";

import { m, useScroll, useTransform, useAnimationControls, useReducedMotion } from "framer-motion";
import { useRef, useLayoutEffect, type ReactNode } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { scrollToSection } from "@/lib/scroll";
import { useIsMobile, CTA } from "@/components/Section";

/* Both halves of the name share one size token so they can't drift apart —
   the whole point is that the horizontal given name and the vertical surname
   read as one word broken across a corner. In vh, not vw: the surname's run
   has to fit the viewport height, and the given name has to match it.
   Their vertical offsets are separate — see GIVEN_TOP / SURNAME_TOP below.

   The desktop value is derived, not picked. "Chrzuszcz" runs 4.94em in Inter
   (it was 4.03em in Fraunces — swapping the family lengthened it by 22% and
   overflowed the section, which `overflow-hidden` silently clipped). Budget is
   the section height less SURNAME_TOP: 900 - 104 leaves ~796px, so 17vh
   (~153px) lands the tail around 860px with room to spare. Re-measure this if
   the family, the surname, or SURNAME_TOP ever changes.

   The value itself lives in globals.css as --name-size, because the section
   wordmarks cap themselves against it — this is the largest type on the site
   and the cap is what keeps it that way. */
const NAME_SIZE = "text-(length:--name-size) font-black text-text tracking-tighter leading-none";

/* The two halves are deliberately off each other's baseline now. Each has its
   own ceiling, and both are tighter than they look:

   GIVEN_TOP is an exact pixel rather than a scale step: the scale straddles the
   target (pt-16 is 83px, pt-20 is 104px against the 20.8px root) with nothing
   in between. 83px is the floor either way — that is the height of the fixed
   header, and below it the caps of "Marcin" run up under the nav bar.

   SURNAME_TOP sits at 104px (pt-20 against the 20.8px root). Its own ceiling
   is around pt-28: at 20vh the run is ~725px inside a 900px section, so only
   ~175px of slack exists before the tail clips at the fold. */
/* Same language as the MC monogram in the nav: a hairline ring, no fill, no
   colour of its own. min-h-[44px] is the tap target, rounded-full turns the
   pill into the pressed-out version of that circle. */

const GIVEN_TOP = "pt-[90px]";
const SURNAME_TOP = "pt-20";

/* One shared variant, per-element delay through `custom`. A staggerChildren
   container can't do it: the surname is positioned against the section and
   lives outside the content column, so it isn't a child of anything the
   column could stagger. Order is Marcin → Chrzuszcz → CTA → the centre copy. */
const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

/* The name lands letter by letter. Same variant as everything else, just an
   extra delay per index — the wrappers below stop carrying `variants` so the
   letters aren't moved twice, but they keep initial/animate so the state still
   propagates down. inline-block because transforms don't apply to inline
   boxes; it works inside the vertical writing mode too. */
function Letters({ text, delay }: { text: string; delay: number }) {
  return text.split("").map((char, i) => (
    <m.span key={i} variants={itemVariants} custom={delay + i * 0.05} className="inline-block">
      {char}
    </m.span>
  ));
}

/* The whole copy block rides one face of an invisible cube. The cube is never
   drawn — only the face carrying the text — so it starts edge-on at -90°, no
   height to the eye and nothing to hide, then turns to face front.
   transformOrigin pushes the hinge behind the text by about half the block, so
   it turns like a solid rather than flipping in place like a card. */
function CubeReveal({ delay, children }: { delay: number; children: ReactNode }) {
  return (
    <m.div
      style={{ transformOrigin: "50% 50% -3.5em", backfaceVisibility: "hidden" }}
      initial={{ rotateX: -90, transformPerspective: 900 }}
      animate={{ rotateX: 0 }}
      transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </m.div>
  );
}

export default function About() {
  const { t } = useLanguage();
  const controls = useAnimationControls();
  const animationPlayed = useRef(false);

  useLayoutEffect(() => {
    if (!animationPlayed.current) {
      animationPlayed.current = true;
      controls.start("visible");
    }
  }, [controls]);

  const isMobile = useIsMobile();
  const reducedMotion = useReducedMotion();
  const still = isMobile || reducedMotion;

  // Keyed to the section's own travel, not the viewport: the hero is taller than
  // one screen, so a vh-based fade blanked the last paragraphs before they could
  // be read. 0 = section top at viewport top, 1 = section bottom at viewport top,
  // so the fade can only start once everything has scrolled up into view.
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0.85, 1], still ? [1, 1] : [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", still ? "0%" : "8%"]);

  return (
    <section ref={sectionRef} id="hero" className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Positioned against the section rather than nested in the column below
          — that one carries a transform and would become the containing block.
          It repeats the column's own `px-6` instead, so the surname's right
          edge lands on the same gutter the given name's left edge does. Sized in vh rather than vw because what it has to fit is
          the viewport height — 9 glyphs at roughly 0.55em advance each, so
          ~5em of run. */}
      <m.div
        aria-hidden
        initial="hidden"
        animate={controls}
        className={`pointer-events-none select-none absolute inset-x-0 top-0 bottom-0 px-6 md:px-16 flex justify-end items-start ${SURNAME_TOP}`}
      >
        {/* writing-mode has to sit on the text, not on the flex box above it:
            it swaps the flex axes, so `items-start` on the same element
            aligns horizontally and the run drifts off the top. */}
        <span className={`${NAME_SIZE} [writing-mode:vertical-rl]`}>
          <Letters text="Chrzuszcz" delay={0.45} />
        </span>
      </m.div>

      <m.div
        style={{ y, opacity }}
        className={`relative z-10 flex-1 flex px-6 md:px-16 ${GIVEN_TOP} pb-10 w-full`}
      >
        <div className="w-full max-w-2xl flex flex-col gap-12 pr-20 md:pr-0">
          {/* Text content, single column since the portrait came out. */}
            <m.div initial="hidden" animate={controls}>
              {/* The surname is rendered separately, hung off the right gutter —
                  aria-label keeps the two halves one name for a screen reader,
                  and the vertical half is hidden from the tree to match.
                  No font-family override: both halves inherit the body sans. */}
              <p aria-label="Marcin Chrzuszcz" className={NAME_SIZE}>
                <Letters text="Marcin" delay={0} />
              </p>
            </m.div>

            {/* mt-auto, not a spacer: the column now stretches the full section
                height, so the CTA falls to the bottom edge on its own and stays
                there whatever the name block above it measures. */}
            <m.div
              variants={itemVariants}
              custom={0.9}
              initial="hidden"
              animate={controls}
              className="mt-auto flex flex-col sm:flex-row gap-3"
            >
                <button
                  type="button"
                  onClick={() => scrollToSection("contact")}
                  className={CTA}
                >
                  {t.about.cta_primary}
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                    <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
            </m.div>
        </div>

        {/* Dead centre of the section, out of the flow entirely — the name is
            top-left and the CTA bottom-left, so this is a third anchor rather
            than part of either. Positioned against the wrapper above (it is
            `relative`) and not the max-w-2xl column, which is left-hung and
            would centre this on the column's midpoint instead of the page's.
            Last in the sequence — the name and the CTA land first, then
            the copy that explains them. */}
        {/* The centring stays on this div and the turn happens inside it:
            framer writes `transform` inline, which would eat the -translate-y.
            The cube is the reveal now, so this block no longer fades in. */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 mx-auto max-w-xl pl-6 pr-20 md:pr-6 text-center">
          <CubeReveal delay={1.35}>
          {/* This one does need the inline family. It is an h1, and the
              unlayered `h1, h2, h3` rule in globals.css sets Fraunces at a
              specificity Tailwind's layered utilities cannot beat. */}
          <h1
            className="text-base font-normal text-text md:whitespace-nowrap"
            style={{ fontFamily: "var(--font-inter), Inter, system-ui, sans-serif" }}
          >
            {t.about.subtitle}
          </h1>
          {/* One <p>, one line per sentence: spans rather than separate
              paragraphs so it stays a single block to a screen reader. */}
          <p className="mt-4 text-sm text-muted">
            {t.about.hero_sub.map((line) => (
              <span key={line} className="block">{line}</span>
            ))}
          </p>
          </CubeReveal>
        </div>
      </m.div>
    </section>
  );
}
