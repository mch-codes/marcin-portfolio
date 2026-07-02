"use client";

import { m, useInView, useReducedMotion } from "framer-motion";
import { useRef, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

function useScrollingUp() {
  const isScrollingUp = useRef(false);
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      isScrollingUp.current = y < lastY;
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return isScrollingUp;
}

function IconMonitor() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );
}

function IconTarget() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
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

type ServiceCard = { icon: React.ReactNode; title: string; desc: string; accent: string; features: string[] };

function ServiceCardItem({ card, index, total }: { card: ServiceCard; index: number; total: number }) {
  const reducedMotion = useReducedMotion();
  const isScrollingUp = useScrollingUp();
  const ref = useRef(null);
  const hasBeenVisible = useRef(false);
  const isInView = useInView(ref, { once: false, margin: "0px 0px -40% 0px" });

  useEffect(() => {
    if (isInView) hasBeenVisible.current = true;
  }, [isInView]);

  const reEntering = isInView && isScrollingUp.current && hasBeenVisible.current;

  return (
    <m.div
      ref={ref}
      initial={{ opacity: 0, y: 48 }}
      animate={
        reducedMotion
          ? { opacity: 1, y: 0 }
          : isInView
            ? { opacity: 1, y: 0 }
            : hasBeenVisible.current
              ? { opacity: 0, y: 0 }
              : { opacity: 0, y: 48 }
      }
      transition={{
        duration: reducedMotion ? 0 : isInView ? (reEntering ? 0 : 0.85) : 0.5,
        delay: reducedMotion ? 0 : isInView ? (reEntering ? 0 : index * 0.45) : (total - 1 - index) * 0.15,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      }}
      className="group rounded-2xl border border-border bg-card p-7 flex flex-col gap-5 sm:grid sm:grid-rows-subgrid sm:row-span-3 sm:gap-y-0 hover:border-accent/40 transition-colors duration-300"
    >
      <span
        className="inline-flex items-center justify-center w-10 h-10 rounded-xl"
        style={{ color: card.accent, background: `${card.accent}12` }}
      >
        {card.icon}
      </span>
      <div className="flex-1">
        <h3 className="text-base font-semibold text-text mb-2">{card.title}</h3>
        <p className="text-sm text-muted leading-relaxed">{card.desc}</p>
      </div>
      <ul className="flex flex-col gap-2">
        {card.features.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-muted">
            <span className="mt-0.5 text-xs shrink-0" style={{ color: card.accent }}>✓</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </m.div>
  );
}

export default function Services() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const cards: ServiceCard[] = [
    { icon: <IconMonitor />, title: t.services.card1_title, desc: t.services.card1_desc, features: t.services.card1_features, accent: "#10b981" },
    { icon: <IconTarget />,  title: t.services.card2_title, desc: t.services.card2_desc, features: t.services.card2_features, accent: "#00d2ff" },
    { icon: <IconLayers />,  title: t.services.card3_title, desc: t.services.card3_desc, features: t.services.card3_features, accent: "#a78bfa" },
  ];

  return (
    <section id="services" className="py-24 md:py-32 relative bg-[#1a1a1e]">
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

        <div className="grid sm:grid-cols-3 gap-x-4 gap-y-4 sm:grid-rows-[auto_1fr_auto] sm:gap-y-5">
          {cards.map((card, i) => (
            <ServiceCardItem key={i} card={card} index={i} total={cards.length} />
          ))}
        </div>
      </div>
    </section>
  );
}
