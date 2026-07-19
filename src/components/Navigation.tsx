"use client";

import { useEffect, useState, useRef } from "react";
import { m, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import type { Language } from "@/lib/translations";
import { scrollToSection, scrollToTop } from "@/lib/scroll";

const LANGS: Language[] = ["es", "en"];

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
    <div className={`toggle-splash relative flex items-center border border-border ${className}`}>
      {pill.width > 0 && (
        <m.span
          className="pill-splash absolute top-0 bottom-0 bg-accent pointer-events-none"
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
          className={`relative z-10 text-xs font-semibold ${compact ? "px-2.5" : "px-3"} py-1.5 uppercase tracking-wide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg`}
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
          ? "bg-[#1e1e1e]/60 backdrop-blur-xl border-white/5"
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <button
          onClick={scrollToTop}
          className="text-text font-semibold text-lg tracking-tight hover:text-accent transition-colors duration-200"
        >
          MC
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="text-muted text-sm font-medium hover:text-accent transition-colors duration-200"
            >
              {link.label}
            </button>
          ))}
          <LangToggle className="ml-2" />
        </nav>

        {/* Mobile: lang toggle + hamburger */}
        <div className="md:hidden flex items-center gap-3">
          <LangToggle compact />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-muted hover:text-text transition-colors p-1"
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
            className="md:hidden bg-[#09090b]/95 backdrop-blur-md border-b border-[#3f3f46] overflow-hidden"
          >
            <nav className="flex flex-col px-6 py-4 gap-4">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => { scrollToSection(link.id); setMenuOpen(false); }}
                  className="text-text text-base font-medium py-1 border-b border-border last:border-0 text-left"
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
