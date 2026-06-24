"use client";

import { m, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";

type ServiceCard = { title: string; desc: string; price: string };

function ServiceCardItem({ card, index }: { card: ServiceCard; index: number }) {
  const reducedMotion = useReducedMotion();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <m.div
      ref={ref}
      initial={{ opacity: 0, y: 48 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: reducedMotion ? 0 : 0.85,
        delay: reducedMotion ? 0 : index * 0.12,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      }}
      className="rounded-2xl border border-border bg-card p-7 flex flex-col gap-5 hover:border-accent/40 transition-colors duration-300"
    >
      <div className="flex-1">
        <h3 className="text-base font-semibold text-text mb-2">{card.title}</h3>
        <p className="text-sm text-muted leading-relaxed">{card.desc}</p>
      </div>
      <p
        className="text-xs font-mono tracking-wide text-accent/70 pt-4 border-t border-border"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {card.price}
      </p>
    </m.div>
  );
}

export default function Services() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const cards: ServiceCard[] = [
    { title: t.services.card1_title, desc: t.services.card1_desc, price: t.services.card1_price },
    { title: t.services.card2_title, desc: t.services.card2_desc, price: t.services.card2_price },
    { title: t.services.card3_title, desc: t.services.card3_desc, price: t.services.card3_price },
  ];

  return (
    <section className="py-24 md:py-32 relative bg-[#1a1a1e]">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="max-w-6xl mx-auto px-6" ref={ref}>
        <m.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="text-3xl md:text-4xl font-bold text-text tracking-tight leading-[1.15] mb-12"
        >
          {t.services.title}
        </m.h2>

        <div className="grid sm:grid-cols-3 gap-4">
          {cards.map((card, i) => (
            <ServiceCardItem key={card.title} card={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
