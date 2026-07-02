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


function IconGlobe() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

type CardData = { icon: React.ReactNode; title: string; desc: string; accent: string };

function WhatIBuildCard({ card, index, total }: { card: CardData; index: number; total: number }) {
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
      className="group rounded-2xl border border-border bg-card p-7 flex flex-col gap-5 hover:border-accent/40 transition-colors duration-300"
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
  );
}

export default function WhatIBuild() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const cards: CardData[] = [
    { icon: <IconRocket />, title: t.whatIBuild.card1_title, desc: t.whatIBuild.card1_desc, accent: "#10b981" },
    { icon: <IconLayers />, title: t.whatIBuild.card2_title, desc: t.whatIBuild.card2_desc, accent: "#00d2ff" },
    { icon: <IconGlobe />, title: t.whatIBuild.card4_title, desc: t.whatIBuild.card4_desc, accent: "#a78bfa" },
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
          {t.whatIBuild.title}
        </m.h2>

        <div className="grid sm:grid-cols-3 gap-4">
          {cards.map((card, i) => (
            <WhatIBuildCard key={i} card={card} index={i} total={cards.length} />
          ))}
        </div>
      </div>
    </section>
  );
}
