"use client";

import { useEffect, useState, useRef } from "react";
import { m, AnimatePresence, type PanInfo } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import type { Language } from "@/lib/translations";
import { scrollToSection, scrollToTop } from "@/lib/scroll";

const LANGS: Language[] = ["es", "en"];

function LangToggle({ compact = false, className = "" }: { compact?: boolean; className?: string }) {
  const { language, setLanguage } = useLanguage();
  const refs = useRef<(HTMLButtonElement | null)[]>([null, null]);
  const [positions, setPositions] = useState<{ left: number; width: number }[]>([]);

  useEffect(() => {
    const pos = refs.current.map(el =>
      el ? { left: el.offsetLeft, width: el.offsetWidth } : { left: 0, width: 0 }
    );
    if (pos.every(p => p.width > 0)) setPositions(pos);
  }, []);

  const activeIdx = LANGS.indexOf(language);
  const baseLeft = positions[0]?.left ?? 0;
  const targetX = (positions[activeIdx]?.left ?? 0) - baseLeft;
  const maxX = (positions[LANGS.length - 1]?.left ?? 0) - baseLeft;
  const pillWidth = positions[activeIdx]?.width ?? 0;

  const handleDragEnd = (_: PointerEvent, info: PanInfo) => {
    const finalX = targetX + info.offset.x;
    let closestIdx = 0;
    let minDist = Infinity;
    positions.forEach((pos, i) => {
      const dist = Math.abs((pos.left - baseLeft) - finalX);
      if (dist < minDist) { minDist = dist; closestIdx = i; }
    });
    setLanguage(LANGS[closestIdx]);
  };

  return (
    <div className={`relative flex items-center bg-card border border-border rounded-full px-1 py-1 ${className}`}>
      {pillWidth > 0 && (
        <m.span
          className="absolute top-1 bottom-1 rounded-full bg-accent cursor-grab active:cursor-grabbing z-10"
          style={{ left: baseLeft, width: pillWidth }}
          animate={{ x: targetX }}
          initial={false}
          drag="x"
          dragConstraints={{ left: -targetX, right: maxX - targetX }}
          dragElastic={0.05}
          dragMomentum={false}
          onDragEnd={handleDragEnd}
          transition={{ type: "spring", stiffness: 250, damping: 18 }}
        />
      )}
      {LANGS.map((lang, i) => (
        <button
          key={lang}
          ref={(el) => { refs.current[i] = el; }}
          onClick={() => setLanguage(lang)}
          className={`relative text-xs font-semibold ${compact ? "px-2.5" : "px-3"} py-1 rounded-full uppercase tracking-wide`}
        >
          <span className={`relative z-20 pointer-events-none transition-colors duration-150 ${language === lang ? "text-white" : "text-muted"}`}>
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
    { label: t.nav.education, id: "education" },
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
