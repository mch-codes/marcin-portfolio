"use client";

import { m, useInView } from "framer-motion";
import { useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";

function IconRocket() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}

function IconLayers() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

function IconStore() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l1-5h16l1 5" />
      <path d="M3 9a2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0" />
      <path d="M5 22V11h14v11" />
      <path d="M9 22v-5h6v5" />
    </svg>
  );
}

function IconGlobe() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

export default function WhatIBuild() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const cards = [
    { icon: <IconRocket />, title: t.whatIBuild.card1_title, desc: t.whatIBuild.card1_desc, accent: "#e8956d" },
    { icon: <IconLayers />, title: t.whatIBuild.card2_title, desc: t.whatIBuild.card2_desc, accent: "#00d2ff" },
    { icon: <IconGlobe />, title: t.whatIBuild.card4_title, desc: t.whatIBuild.card4_desc, accent: "#a78bfa" },
  ];

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
          {t.whatIBuild.title}
        </m.h2>

        <div className="grid sm:grid-cols-3 gap-4">
          {cards.map((card, i) => (
            <m.div
              key={card.title}
              initial={{ opacity: 0, y: 28 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              className="group rounded-2xl border border-border bg-card p-7 flex flex-col gap-5 hover:border-border-light transition-colors duration-300"
            >
              <span
                className="inline-flex items-center justify-center w-10 h-10 rounded-xl"
                style={{ color: card.accent, background: `${card.accent}12` }}
              >
                {card.icon}
              </span>
              <div>
                <h3 className="text-base font-semibold text-text mb-2">{card.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{card.desc}</p>
              </div>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}
