"use client";

import { m, useInView } from "framer-motion";
import { useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { scrollToSection } from "@/lib/scroll";

export default function MidCta() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div className="max-w-6xl mx-auto px-6 pt-20 md:pt-24" ref={ref}>
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left py-6"
      >
        <p className="text-base md:text-lg font-semibold text-text leading-snug">
          {t.midcta.text}
        </p>
        <button
          type="button"
          onClick={() => scrollToSection("contact")}
          className="btn-splash-1 inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-3 text-sm font-semibold text-accent border border-accent hover:bg-accent hover:text-bg transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg shrink-0"
          
        >
          {t.midcta.button}
        </button>
      </m.div>
    </div>
  );
}
