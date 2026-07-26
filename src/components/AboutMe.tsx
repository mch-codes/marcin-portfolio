"use client";

import { useLanguage } from "@/context/LanguageContext";
import { SectionHeader, Reveal } from "@/components/Section";

export default function AboutMe() {
  const { t } = useLanguage();

  // Full-bleed mint band. #d2e7e1 is accent at 18% over white, flattened — the
  // same tone ::selection paints, so selecting the copy barely shifts it.
  // Section-wide rather than per-line, so it needs no leading maths.
  return (
    <section id="about" className="py-20 md:py-24 relative overflow-hidden bg-[#d2e7e1]">
      <SectionHeader word={t.about.title}>
        {t.about.tagline1} {t.about.tagline2}.
      </SectionHeader>

      <div className="px-6">
        {/* Set at the default tracking. This ran at tracking-[0.15em] with a
            matching [word-spacing:0.25em] to compensate; at this much
            body copy the spacing cost more in reading speed than it bought in
            texture. Restore both together if it goes back — the word-spacing
            only exists to offset the letterspacing. */}
        {/* text-text, not text-muted: muted only clears 3.4:1 on the mint. */}
        <Reveal className="mt-14 md:mt-20 max-w-2xl space-y-6 text-lg text-text leading-relaxed">
          {[t.about.p1, t.about.p2, t.about.p3, t.about.p4, t.about.p5].map((para) => (
            <p key={para}>{para}</p>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
