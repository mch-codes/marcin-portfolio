"use client";

import { useLanguage } from "@/context/LanguageContext";
import { SectionHeader, SlideIn } from "@/components/Section";

export default function AboutMe() {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-28 md:py-40 relative overflow-hidden">
      <SectionHeader word={t.about.title} splash={0}>
        {t.about.tagline1} {t.about.tagline2}.
      </SectionHeader>

      <div className="max-w-6xl mx-auto px-6">
        <SlideIn className="mt-24 md:mt-32 max-w-2xl space-y-6 text-lg text-muted leading-relaxed tracking-widest">
          <p>{t.about.p1}</p>
          <p>{t.about.p2}</p>
          <p>{t.about.p3}</p>
        </SlideIn>
      </div>
    </section>
  );
}
