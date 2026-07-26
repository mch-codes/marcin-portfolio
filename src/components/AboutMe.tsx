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
            matching [word-spacing:0.25em] to compensate; at this much
            body copy the spacing cost more in reading speed than it bought in
            texture. Restore both together if it goes back — the word-spacing
            only exists to offset the letterspacing. */}
        <Reveal className="mt-14 md:mt-20 max-w-2xl space-y-6 text-lg text-muted leading-relaxed">
          {[t.about.p1, t.about.p2, t.about.p3, t.about.p4, t.about.p5].map((para) => (
            // Marker highlight: an inline span so the band hugs each line and
            // stops at the ragged right edge. Same colour as ::selection, so a
            // real selection over it reads as one continuous tone.
            // ponytail: no box-decoration-clone — that only matters once this
            // grows padding, a border, or a radius.
            <p key={para}>
              <span className="bg-accent/18 text-text">{para}</span>
            </p>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
