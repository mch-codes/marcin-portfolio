"use client";

import { useEffect, useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import type { Language } from "@/lib/translations";
import { scrollToSection, scrollToTop } from "@/lib/scroll";

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
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: t.nav.about, id: "about" },
    { label: t.nav.services, id: "services" },
    { label: t.nav.projects, id: "projects" },
    { label: t.nav.process, id: "process" },
    { label: t.nav.contact, id: "contact" },
  ];

  return (
    <>
    {/* Floating monogram, always on screen. Bottom-left puts it under Next's
        dev-tools bubble in `next dev` — that bubble does not exist in a
        production build, so the overlap is local only. */}
    {/* bottom-10 matches the hero's pb-10, so the badge shares a baseline with
        the CTA row. Horizontally it sits in the left margin — but that margin
        only exists once the viewport clears the 1152px content column, so below
        xl it swaps to the right gutter rather than landing on the buttons. */}
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className={`fixed bottom-10 right-6 xl:right-auto xl:left-6 z-50 grid place-items-center w-10 h-10 rounded-full border border-border bg-bg/60 backdrop-blur-xl text-xs font-semibold tracking-wide text-muted transition-colors duration-300 hover:text-text hover:border-text ${FOCUS_RING}`}
    >
      MC
    </button>

    <m.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
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
      <div className="max-w-6xl mx-auto px-6 h-16 grid grid-cols-[1fr_auto_1fr] items-center">
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
            <nav className="flex flex-col px-6 py-4 gap-4">
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
