"use client";

import { m, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

function CertificateIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
      <rect x="1" y="1.5" width="9" height="7" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <path d="M3 4h5M3 6h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CertificateModal({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/85 backdrop-blur-sm"
        onClick={onClose}
      >
        <m.div
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.96, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="relative max-w-4xl w-full"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="w-full h-auto rounded-xl shadow-2xl"
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
            aria-label="Cerrar"
          >
            <CloseIcon />
          </button>
        </m.div>
      </m.div>
    </AnimatePresence>
  );
}

export default function Education() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [activeCert, setActiveCert] = useState<{ src: string; alt: string } | null>(null);

  const items = [
    {
      title: "CS50x — Introduction to Computer Science",
      institution: "Harvard University",
      inProgress: true,
    },
    {
      title: "Inteligencia Artificial (IA) Creativa",
      institution: "RTVE Instituto",
      hours: "75h · 3 ECTS",
      year: "2025",
      certSrc: "/certificates/rtve-ia-creativa.png",
    },
    {
      title: "Responsive Web Design",
      institution: "freeCodeCamp",
      hours: "300h",
      year: "2024",
      certSrc: "/certificates/freecodecamp-responsive-web-design.png",
    },
  ];

  return (
    <section id="education" className="py-28 md:py-36 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="max-w-6xl mx-auto px-6" ref={ref}>
        <m.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-text tracking-tight leading-[1.15]">
            {t.education.title}
          </h2>
        </m.div>

        <div className="flex flex-col max-w-3xl">
          {items.map((item, i) => (
            <m.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.5,
                delay: 0.1 + i * 0.1,
                ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
              }}
              className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8 py-6 ${
                i < items.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <span className="hidden sm:block text-[11px] font-mono text-muted/30 w-5 shrink-0 tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text leading-snug">{item.title}</p>
                <p className="text-xs text-muted mt-0.5">{item.institution}</p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {item.hours && (
                  <span className="text-xs text-muted/50 tabular-nums">{item.hours}</span>
                )}
                {item.year && (
                  <span className="text-xs text-muted/50 tabular-nums">{item.year}</span>
                )}
                {item.inProgress && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-accent border border-accent/20 bg-accent/8 px-2.5 py-1 rounded-md">
                    <span className="relative flex h-1.5 w-1.5 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent" />
                    </span>
                    {t.education.status_in_progress}
                  </span>
                )}
                {item.certSrc && (
                  <button
                    onClick={() => setActiveCert({ src: item.certSrc!, alt: item.title })}
                    className="inline-flex items-center gap-1 text-xs text-muted/40 hover:text-accent transition-colors duration-200"
                  >
                    {t.education.verify}
                    <CertificateIcon />
                  </button>
                )}
              </div>
            </m.div>
          ))}
        </div>
      </div>

      {activeCert && (
        <CertificateModal
          src={activeCert.src}
          alt={activeCert.alt}
          onClose={() => setActiveCert(null)}
        />
      )}
    </section>
  );
}
