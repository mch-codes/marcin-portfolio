"use client";

import { m, useScroll, useTransform, useAnimationControls, useReducedMotion } from "framer-motion";
import { useRef, useLayoutEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { scrollToSection } from "@/lib/scroll";
import { useIsMobile } from "@/components/Section";

const WHATSAPP = "https://wa.me/34633683404";

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
   the family, the surname, or SURNAME_TOP ever changes. */
const NAME_SIZE = "text-[7vh] md:text-[17vh] font-black text-text tracking-tighter leading-none";

/* The two halves are deliberately off each other's baseline now. Each has its
   own ceiling, and both are tighter than they look:

   GIVEN_TOP is an exact pixel rather than a scale step: the scale straddles the
   target (pt-16 is 83px, pt-20 is 104px against the 20.8px root) with nothing
   in between. 83px is the floor either way — that is the height of the fixed
   header, and below it the caps of "Marcin" run up under the nav bar.

   SURNAME_TOP sits at 104px (pt-20 against the 20.8px root). Its own ceiling
   is around pt-28: at 20vh the run is ~725px inside a 900px section, so only
   ~175px of slack exists before the tail clips at the fold. */
const GIVEN_TOP = "pt-[90px]";
const SURNAME_TOP = "pt-20";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.22 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

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
      {/* Anchored to the section, not to the content column: the m.div below
          carries a transform, which would make it the containing block and pin
          this to the 72rem gutter instead of the page edge. Sized in vh rather
          than vw because what it has to fit is the viewport height — 9 glyphs
          at roughly 0.55em advance each, so ~5em of run. */}
      <div
        aria-hidden
        className={`pointer-events-none select-none absolute right-2 md:right-4 top-0 bottom-0 flex items-start ${SURNAME_TOP}`}
      >
        {/* writing-mode has to sit on the text, not on the flex box above it:
            it swaps the flex axes, so `items-start` on the same element
            aligns horizontally and the run drifts off the top. */}
        <span className={`${NAME_SIZE} [writing-mode:vertical-rl]`}>
          Chrzuszcz
        </span>
      </div>

      <m.div
        style={{ y, opacity }}
        className={`relative z-10 flex-1 flex items-start max-w-6xl mx-auto px-6 ${GIVEN_TOP} pb-10 w-full`}
      >
        <m.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="w-full max-w-2xl flex flex-col gap-12 pr-16 md:pr-0"
        >
          {/* Text content, single column since the portrait came out. */}
          <div className="flex flex-col gap-7">
            <m.div variants={itemVariants}>
              {/* The surname is rendered separately, pinned to the page edge —
                  aria-label keeps the two halves one name for a screen reader,
                  and the vertical half is hidden from the tree to match.
                  No font-family override: both halves inherit the body sans. */}
              <p aria-label="Marcin Chrzuszcz" className={NAME_SIZE}>
                Marcin
              </p>
              {/* This one does need the inline family. It is an h1, and the
                  unlayered `h1, h2, h3` rule in globals.css sets Fraunces at a
                  specificity Tailwind's layered utilities cannot beat. */}
              <h1
                className="text-base font-normal text-muted mt-3"
                style={{ fontFamily: "var(--font-inter), Inter, system-ui, sans-serif" }}
              >
                {t.about.subtitle}
              </h1>
              <p className="text-sm text-muted/85 mt-2">{t.about.hero_sub}</p>
            </m.div>

            <m.div variants={itemVariants} className="flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => scrollToSection("contact")}
                  className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-3 text-sm font-semibold text-accent border border-accent hover:bg-accent hover:text-bg transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                  
                >
                  {t.about.cta_primary}
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                    <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                <a
                  href={WHATSAPP}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t.about.cta_whatsapp_aria}
                  className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-3 text-sm font-semibold text-text border border-border hover:border-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden>
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.87 9.87 0 0 0 12.04 2zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.22 8.22 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.55-3.7 8.24-8.24 8.24zm4.52-6.17c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.13-.17.25-.64.81-.78.97-.14.17-.29.19-.53.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.15.16-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43-.14-.01-.31-.01-.48-.01-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.43 1.03 2.6.12.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.23-.16-.48-.28z" />
                  </svg>
                  WhatsApp
                </a>
              </div>
              <p className="text-xs text-muted/85">{t.about.cta_trust}</p>
            </m.div>

          </div>

        </m.div>
      </m.div>
    </section>
  );
}
