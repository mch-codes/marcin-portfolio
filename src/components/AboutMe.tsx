"use client";

import { useLanguage } from "@/context/LanguageContext";
import { SectionHeader, Reveal } from "@/components/Section";

export default function AboutMe() {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-20 md:py-24 relative overflow-hidden">
      <SectionHeader word={t.about.title}>
        {t.about.tagline1} {t.about.tagline2}.
      </SectionHeader>

      <div className="max-w-6xl mx-auto px-6">
        {/* Set at the default tracking. This ran at tracking-[0.15em] with a
            matching [word-spacing:0.25em] to compensate; at six paragraphs of
            body copy the spacing cost more in reading speed than it bought in
            texture. Restore both together if it goes back — the word-spacing
            only exists to offset the letterspacing. */}
        <Reveal className="mt-14 md:mt-20 max-w-2xl space-y-6 text-lg text-muted leading-relaxed">
          <p>{t.about.p1}</p>
          <p>{t.about.p2}</p>
          <p>{t.about.p3}</p>
        </Reveal>
      </div>
    </section>
  );
}
