"use client";

import { useEffect, useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import type { Language } from "@/lib/translations";
import { scrollToSection, scrollToTop } from "@/lib/scroll";
import { BADGE } from "@/components/Section";

const LANGS: Language[] = ["es", "en"];

/** Every focusable control in the bar shares one ring, so keyboard focus
    doesn't change shape as you tab across the nav. */
const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg";

/** Shared by the nav links and the language buttons so they read as one row:
    muted until hovered, with a rule that wipes in from the left. */
const NAV_ITEM =
  `relative text-base font-semibold lowercase transition-colors duration-200 after:absolute after:left-0 after:-bottom-1 after:h-px after:w-full after:bg-current after:origin-left after:scale-x-0 after:transition-transform after:duration-200 hover:after:scale-x-100 ${FOCUS_RING}`;

/** Plain text, same weight and size as the links — the active language is the
    one at full text colour, so no pill or border is needed to mark it. */
function LangToggle({ className = "" }: { className?: string }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {LANGS.map((lang, i) => (
        <span key={lang} className="flex items-center gap-2">
          {i > 0 && <span className="text-border select-none">/</span>}
          <button
            onClick={() => setLanguage(lang)}
            aria-current={language === lang ? "true" : undefined}
            className={`${NAV_ITEM} ${language === lang ? "text-text" : "text-muted hover:text-text"}`}
          >
            {lang}
          </button>
        </span>
      ))}
    </div>
  );
}

export default function Navigation() {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [atFooter, setAtFooter] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      // The hero is min-h-screen, so one viewport is its height. 0.8 rather
      // than 1 so the badge is already in place as the next section arrives.
      setPastHero(window.scrollY > window.innerHeight * 0.8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The footer carries its own copy of the badge, so the floating one steps
  // aside once the footer is on screen rather than sitting on top of it. An
  // observer, not a scroll threshold: the footer's offset moves with the
  // content above it, and Lenis drives real scrollTop so this fires normally.
  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const io = new IntersectionObserver(([entry]) => setAtFooter(entry.isIntersecting));
    io.observe(footer);
    return () => io.disconnect();
  }, []);

  const navLinks = [
    { label: t.nav.about, id: "about" },
    { label: t.nav.services, id: "services" },
    { label: t.nav.projects, id: "projects" },
    { label: t.nav.process, id: "process" },
    { label: t.nav.contact, id: "contact" },
  ];

  const showBadge = pastHero && !atFooter;

  return (
    <>
    {/* Floating monogram. Hidden over the hero — the hero already carries the
        name at full size, so the badge there is the same word twice. It fades
        in once the first section takes over as the thing being scrolled.
        Kept mounted rather than unmounted so the fade has something to run on;
        inert + aria-hidden take it out of the tab order and the a11y tree
        while invisible.

        Bottom-left, hard against the edge and deliberately off the sections'
        px-6 md:px-16 gutter — it reads as a viewport control, not as part of
        the text column. Bottom-left also puts it under Next's dev-tools bubble
        in `next dev`; that bubble does not exist in a production build, so the
        overlap is local only.

        Opaque page-bg fill with an ink ring, so no backdrop-blur — that only
        did anything under the old translucent bg. The fill matters here more
        than in the footer: this one floats over whatever is scrolling past,
        including the full-bleed wordmarks. No hover state. */}
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      inert={!showBadge}
      aria-hidden={!showBadge}
      className={`${BADGE} fixed bottom-2 left-2 z-50 transition-opacity duration-300 ${
        showBadge ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      MC
    </button>

    {/* Last thing on screen: the name letters land, the CTA follows, the copy
        turns in on its cube face, and the bar drops in over the tail of it.
        -100% of its own height, not a nudge — it starts genuinely off the page,
        so it needs no fade to hide the entrance. Re-time against About.tsx if
        that sequence changes. */}
    <m.header
      initial={{ y: "-100%" }}
      animate={{ y: 0 }}
      transition={{ duration: 0.7, delay: 1.25, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        scrolled
          ? "bg-bg/60 backdrop-blur-xl border-border/50"
          : "bg-transparent border-transparent"
      }`}
    >
      {/* Three columns rather than justify-between: the 1fr side columns split
          the leftover space evenly, so the links centre on the bar itself and
          stay put no matter what the logo or the toggle measure. Centring them
          inside a flex row would instead park them midway between those two,
          which drifts as soon as either changes width or the language does. */}
      <div className="px-6 md:px-16 h-16 grid grid-cols-[1fr_auto_1fr] items-center">
        {/* Columns are assigned explicitly because the first one is empty now
            that the monogram is gone. Left to auto-placement the nav would fall
            into column 1 and the centring would collapse. */}

        {/* Desktop nav — the middle column. Collapses to zero width below md,
            leaving the two side columns to behave as a plain split bar. */}
        <nav className="col-start-2 hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className={`${NAV_ITEM} text-muted hover:text-text`}
            >
              {link.label}
            </button>
          ))}
          <LangToggle />
        </nav>

        <div className="col-start-3 justify-self-end flex items-center gap-3">
          {/* Wrapped rather than given `hidden md:flex` directly: LangToggle's
              own class list already carries `flex`, and two unprefixed display
              utilities on one element resolve by stylesheet order, not intent. */}
          <div className="md:hidden">
            <LangToggle />
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`md:hidden text-muted hover:text-text transition-colors p-1 ${FOCUS_RING}`}
            aria-label="Toggle menu"
          >
            <div className="w-5 flex flex-col gap-1.5">
              <span className={`block h-px bg-current transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block h-px bg-current transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block h-px bg-current transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <m.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-bg/95 backdrop-blur-md border-b border-border overflow-hidden"
          >
            <nav className="flex flex-col px-6 md:px-16 py-4 gap-4">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => { scrollToSection(link.id); setMenuOpen(false); }}
                  className={`text-text text-base font-semibold lowercase py-1 border-b border-border last:border-0 text-left ${FOCUS_RING}`}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </m.div>
        )}
      </AnimatePresence>
    </m.header>
    </>
  );
}
