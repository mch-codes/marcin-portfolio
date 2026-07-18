"use client";

import { m, useInView } from "framer-motion";
import { useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

export default function AboutMe() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="about" className="py-28 md:py-40 relative">
      {/* ponytail: same vw value both locales — "sobre mí" and "about me" are both 8 chars */}
      <div className="overflow-hidden" ref={ref}>
        <m.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          className="text-[26vw] font-black text-text tracking-tighter leading-none lowercase text-center whitespace-nowrap -mb-[0.15em]"
        >
          {t.about.title}
        </m.h2>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <m.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15, ease }}
          className="ml-auto max-w-md text-xl text-muted leading-relaxed md:text-right"
        >
          {t.about.tagline1} {t.about.tagline2}.
        </m.p>

        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.25, ease }}
          className="mt-24 md:mt-32 max-w-2xl space-y-6 text-lg text-muted leading-relaxed"
        >
          <p>{t.about.p1}</p>
          <p>{t.about.p2}</p>
          <p>{t.about.p3}</p>
        </m.div>
      </div>
    </section>
  );
}
