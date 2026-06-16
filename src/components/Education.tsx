"use client";

import { m, useInView } from "framer-motion";
import { useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";

function ExternalLinkIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
      <path
        d="M1.5 9.5L9.5 1.5M9.5 1.5H4.5M9.5 1.5v5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Education() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const items = [
    {
      title: "CS50x — Introduction to Computer Science",
      institution: "Harvard University",
      inProgress: true,
    },
    {
      title: "Responsive Web Design",
      institution: "freeCodeCamp",
      hours: "300h",
      year: "2024",
      verifyUrl: "https://freecodecamp.org/certification/Marcin23/responsive-web-design",
    },
    {
      title: "Inteligencia Artificial (IA) Creativa",
      institution: "RTVE Instituto",
      hours: "75h · 3 ECTS",
      year: "2025",
      verifyUrl: "https://formacion.rtve.es/certificado/5jEAMNoBEH",
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

              <div className="flex items-center gap-3 shrink-0 sm:justify-end">
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
                {item.verifyUrl && (
                  <a
                    href={item.verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-muted/40 hover:text-accent transition-colors duration-200"
                  >
                    {t.education.verify}
                    <ExternalLinkIcon />
                  </a>
                )}
              </div>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}
