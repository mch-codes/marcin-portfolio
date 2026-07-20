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
        {/* Letterspacing at 0.1em lands on the space character too, so the
            word gap grows by the same absolute amount the letter gaps do and
            shrinks in proportion — words stop reading as units. word-spacing
            buys that separation back. Tailwind has no utility for it. */}
        <SlideIn className="mt-24 md:mt-32 max-w-2xl space-y-6 text-lg text-muted leading-relaxed tracking-widest [word-spacing:0.25em]">
          <p>{t.about.p1}</p>
          <p>{t.about.p2}</p>
          <p>{t.about.p3}</p>
        </SlideIn>
      </div>
    </section>
  );
}
