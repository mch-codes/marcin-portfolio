"use client";

import { m, useInView } from "framer-motion";
import { useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function Process() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const cards = [
    { num: "01", title: t.process.card1_title, desc: t.process.card1_desc },
    { num: "02", title: t.process.card2_title, desc: t.process.card2_desc },
    { num: "03", title: t.process.card3_title, desc: t.process.card3_desc },
    { num: "04", title: t.process.card4_title, desc: t.process.card4_desc },
  ];

  return (
    <section id="process" className="py-28 md:py-36 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="max-w-6xl mx-auto px-6" ref={ref}>
        <m.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-text tracking-tight leading-[1.15] mb-3">
            {t.process.title}
          </h2>
          <p className="text-muted leading-relaxed max-w-xl">
            {t.process.subtitle}
          </p>
        </m.div>

        <div className="grid sm:grid-cols-2 gap-5">
          {cards.map((card, i) => (
            <m.div
              key={card.num}
              initial={{ opacity: 0, y: 48 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.85,
                delay: i * 0.45,
                ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
              }}
              className="rounded-2xl border border-border bg-card p-8 flex flex-col gap-4 hover:border-border-light transition-colors duration-300"
            >
              <span className="text-[11px] font-mono text-muted/40">{card.num}</span>
              <h3 className="text-base font-semibold text-text leading-snug">{card.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{card.desc}</p>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}
