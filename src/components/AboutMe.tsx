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
            // stops at the ragged right edge.
            //
            // 0.21em closes the leading gap exactly — Inter's content box is
            // 1.211em (ascender 0.969 + descender 0.242), leading-relaxed is
            // 1.625em, so each line needs (1.625 - 1.211) / 2 to meet its
            // neighbour. Retune it if the leading or the body font changes.
            // box-decoration-clone is what gets that padding onto every line
            // instead of just the first and last.
            //
            // Flat #d2e7e1 is accent at 18% over white, pre-composited: the
            // translucent version double-darkens wherever two bands overlap,
            // which stripes the block on any sub-pixel rounding.
            <p key={para}>
              <span className="bg-[#d2e7e1] text-text py-[0.21em] box-decoration-clone">
                {para}
              </span>
            </p>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
