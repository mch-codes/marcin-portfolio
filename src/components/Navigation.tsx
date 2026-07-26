"use client";

import { useEffect, useState, useRef } from "react";
import { m, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import type { Language } from "@/lib/translations";
import { scrollToSection } from "@/lib/scroll";

const LANGS: Language[] = ["es", "en"];

/** Every focusable control in the bar shares one ring, so keyboard focus
    doesn't change shape as you tab across the nav. */
const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg";

function LangToggle({ compact = false, className = "" }: { compact?: boolean; className?: string }) {
  const { language, setLanguage } = useLanguage();
  const refs = useRef<(HTMLButtonElement | null)[]>([null, null]);
  const [pill, setPill] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const idx = LANGS.indexOf(language);
    const el = refs.current[idx];
    if (el) setPill({ left: el.offsetLeft, width: el.offsetWidth });
  }, [language]);

  return (
    <div className={`relative flex items-center border border-border ${className}`}>
      {pill.width > 0 && (
        <m.span
          className="absolute top-0 bottom-0 bg-accent pointer-events-none"
          animate={pill}
          initial={false}
          transition={{ type: "spring", stiffness: 250, damping: 18 }}
        />
      )}
      {LANGS.map((lang, i) => (
        <button
          key={lang}
          ref={(el) => { refs.current[i] = el; }}
          onClick={() => setLanguage(lang)}
          className={`relative z-10 text-xs font-semibold ${compact ? "px-2.5" : "px-3"} py-1.5 uppercase tracking-wide ${FOCUS_RING}`}
        >
          <span className={`transition-colors duration-150 ${language === lang ? "text-bg" : "text-muted hover:text-text"}`}>
            {lang}
          </span>
        </button>
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
              className={`text-muted text-base font-semibold lowercase hover:text-text transition-colors duration-200 ${FOCUS_RING}`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="col-start-3 justify-self-end flex items-center gap-3">
          {/* Wrapped rather than given `hidden md:flex` directly: LangToggle's
              own class list already carries `flex`, and two unprefixed display
              utilities on one element resolve by stylesheet order, not intent. */}
          <div className="hidden md:block">
            <LangToggle />
          </div>
          <div className="md:hidden">
            <LangToggle compact />
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
  );
}
