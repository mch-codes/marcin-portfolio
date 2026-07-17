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
        className="flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left rounded-2xl border border-accent/20 bg-accent/5 px-6 py-6 md:px-10"
      >
        <p className="text-base md:text-lg font-semibold text-text leading-snug">
          {t.midcta.text}
        </p>
        <button
          type="button"
          onClick={() => scrollToSection("contact")}
          className="inline-flex items-center justify-center gap-2 shrink-0 min-h-[44px] px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          style={{
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            boxShadow: "0 4px 16px rgba(16,185,129,0.2)",
          }}
        >
          {t.midcta.button}
        </button>
      </m.div>
    </div>
  );
}
