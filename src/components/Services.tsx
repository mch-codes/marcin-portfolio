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
    <svg className="h-14 w-14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );
}

function IconTarget() {
  return (
    <svg className="h-14 w-14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function IconLayers() {
  return (
    <svg className="h-14 w-14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

function IconWrench() {
  return (
    <svg className="h-14 w-14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L2 19v3h3l7.3-7.3a4 4 0 0 0 5.4-5.4l-2.65 2.65a1.5 1.5 0 0 1-2.12 0l-.88-.88a1.5 1.5 0 0 1 0-2.12L14.7 6.3z" />
    </svg>
  );
}

const withPeriod = (s: string) => (/[.!?]$/.test(s) ? s : `${s}.`);

type ServiceCard = { icon: React.ReactNode; title: string; desc: string; price: string; accent: string; features: string[]; href?: string; linkLabel?: string };

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
        duration: reducedMotion ? 0 : isInView ? (reEntering ? 0 : 0.55) : 0.4,
        delay: reducedMotion ? 0 : isInView ? (reEntering ? 0 : index * 0.1) : (total - 1 - index) * 0.08,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      }}
      className="flex flex-col items-center text-center"
    >
      <span className="text-text">{card.icon}</span>
      <h3 className="mt-8 text-2xl font-bold text-text tracking-tight leading-tight max-w-xs">
        {withPeriod(card.title)}
      </h3>
      <p className="mt-4 text-base text-muted leading-relaxed max-w-xs">{card.desc}</p>
      <p className="mt-5 text-sm font-semibold text-text">{card.price}</p>
      <ul className="mt-5 flex flex-col gap-2 max-w-xs">
        {card.features.map((item) => (
          <li key={item} className="text-sm text-muted leading-relaxed">
            {item}
          </li>
        ))}
      </ul>
      {card.href && (
        <a
          href={card.href}
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-text hover:text-muted transition-colors"
        >
          {card.linkLabel}
          <span aria-hidden>→</span>
        </a>
      )}
    </m.div>
  );
}

export default function Services() {
  const { t, language } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const cards: ServiceCard[] = [
    { icon: <IconMonitor />, title: t.services.card1_title, desc: t.services.card1_desc, price: t.services.card1_price, features: t.services.card1_features, accent: "#10b981" },
    { icon: <IconTarget />,  title: t.services.card2_title, desc: t.services.card2_desc, price: t.services.card2_price, features: t.services.card2_features, accent: "#00d2ff" },
    { icon: <IconLayers />,  title: t.services.card3_title, desc: t.services.card3_desc, price: t.services.card3_price, features: t.services.card3_features, accent: "#a78bfa", href: "#projects", linkLabel: t.services.card3_link },
    { icon: <IconWrench />,  title: t.services.card4_title, desc: t.services.card4_desc, price: t.services.card4_price, features: t.services.card4_features, accent: "#f59e0b" },
  ];

  return (
    <section id="services" className="py-28 md:py-40 relative">
      <div className="overflow-hidden" ref={ref}>
        <m.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className={`${language === "es" ? "text-[22.5vw]" : "text-[25.5vw]"} font-black text-text tracking-tighter leading-none lowercase text-center whitespace-nowrap -mb-[0.15em]`}
        >
          {t.services.title}
        </m.h2>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <m.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="ml-auto max-w-md text-xl text-muted leading-relaxed md:text-right"
        >
          {t.services.cta_text}
        </m.p>

        <div className="mt-24 md:mt-32 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20 justify-items-center">
          {cards.map((card, i) => (
            <ServiceCardItem key={i} card={card} index={i} total={cards.length} />
          ))}
        </div>

        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="mt-28 md:mt-32 flex justify-center"
        >
          <a
            href="mailto:marcin.chrzuszcz@gmail.com"
            className="inline-flex items-center gap-2 font-semibold text-sm text-white px-6 py-3 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              boxShadow: "0 4px 16px rgba(16,185,129,0.2)",
            }}
          >
            {t.services.cta_button}
          </a>
        </m.div>
      </div>
    </section>
  );
}
