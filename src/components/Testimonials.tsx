"use client";

import { m, useInView } from "framer-motion";
import { useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";

// TODO: Replace placeholder data with real testimonials before going live.
// Each entry: quote (full text), name, role (title + company).
const testimonials = [
  {
    quote:
      // TODO: Replace with real quote
      "Marcin built our internal tool in record time. Clean, fast, and exactly what we needed — no fluff, no back-and-forth.",
    name: "TODO: First Name Last Name",
    role: "TODO: Role · Company",
  },
  {
    quote:
      // TODO: Replace with real quote
      "Working with Marcin felt like having a co-founder who actually ships. The product went from idea to live in under a month.",
    name: "TODO: First Name Last Name",
    role: "TODO: Role · Company",
  },
  {
    quote:
      // TODO: Replace with real quote
      "He understood the kitchen workflow better than any developer I'd met before. The result speaks for itself.",
    name: "TODO: First Name Last Name",
    role: "TODO: Role · Company",
  },
];

function QuoteIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-accent/30">
      <path d="M11.192 15.757c0-.88-.23-1.618-.69-2.217-.326-.412-.768-.683-1.327-.812-.55-.128-1.07-.137-1.54-.028-.16-.95.1-1.95.78-3 .53-.81 1.24-1.48 2.13-2.01L9.56 6c-1.49.73-2.7 1.77-3.63 3.13C4.99 10.5 4.53 11.97 4.53 13.57c0 1.49.39 2.71 1.17 3.67.79.96 1.83 1.44 3.13 1.44 1.04 0 1.89-.31 2.55-.92.67-.61 1-1.39 1-2.33l-.19.32zm8 0c0-.88-.23-1.618-.69-2.217-.326-.42-.77-.692-1.327-.817-.56-.124-1.074-.13-1.54-.022-.16-.94.1-1.94.78-3 .53-.81 1.24-1.48 2.13-2.01L17.56 6c-1.49.73-2.7 1.77-3.63 3.13-1.04 1.5-1.56 2.97-1.56 4.44 0 1.49.39 2.71 1.17 3.67.79.96 1.83 1.44 3.13 1.44 1.04 0 1.89-.31 2.55-.92.67-.61 1-1.39 1-2.33l-.19.32z" />
    </svg>
  );
}

export default function Testimonials() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-24 md:py-32 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="max-w-6xl mx-auto px-6" ref={ref}>
        <m.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="text-3xl md:text-4xl font-bold text-text tracking-tight leading-[1.15] mb-12"
        >
          {t.testimonials.title}
        </m.h2>

        <div className="grid sm:grid-cols-3 gap-4">
          {testimonials.map((item, i) => (
            <m.div
              key={i}
              initial={{ opacity: 0, y: 28 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              className="rounded-2xl border border-border bg-card p-7 flex flex-col gap-5"
            >
              <QuoteIcon />
              <p className="text-sm text-muted leading-relaxed flex-1">{item.quote}</p>
              <div className="border-t border-border pt-4">
                <p className="text-sm font-semibold text-text">{item.name}</p>
                <p className="text-xs text-muted/60 mt-0.5">{item.role}</p>
              </div>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}
