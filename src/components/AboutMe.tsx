"use client";

import { useLanguage } from "@/context/LanguageContext";
import { SectionHeader, Reveal } from "@/components/Section";

export default function AboutMe() {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-20 md:py-24 relative overflow-hidden">
      {/* Scoped down from SectionHeader's own text-sm/md:text-xl — a span
          inside its <p> rather than a prop, so the other sections' taglines
          keep their size. The asterisk is inline and superscripted rather than
          its own line, so it hangs off the top-left of the first word instead
          of floating in the block's corner. */}
      <SectionHeader word={t.about.title}>
        <span className="block text-xs md:text-base">
          <span aria-hidden className="align-super text-text text-xl md:text-2xl leading-none -mr-0.5">*</span>
          {t.about.tagline1} {t.about.tagline2}.
        </span>
      </SectionHeader>

      <div className="px-6 md:px-16">
        {/* Set at the default tracking. This ran at tracking-[0.15em] with a
            matching [word-spacing:0.25em] to compensate; at this much
            body copy the spacing cost more in reading speed than it bought in
            texture. Restore both together if it goes back — the word-spacing
            only exists to offset the letterspacing. */}
        {/* text-text, not text-muted: muted only clears 3.4:1 on the mint. */}
        <Reveal className="mt-14 md:mt-20 max-w-2xl space-y-6 text-lg text-text leading-relaxed">
          {[t.about.p1, t.about.p2, t.about.p3, t.about.p4].map((para) => (
            // One line per sentence, spans inside a single <p> so the paragraph
            // still reads as one block — same pattern as hero_sub in About.tsx.
            // ponytail: split on ". ", not a sentence tokeniser. It survives
            // "Oidoo.app" (no space after that dot) but would break on an
            // abbreviation like "Ej. " — hand-split the string in
            // translations.ts if the copy ever gains one.
            <p key={para}>
              {para.split(/(?<=\.)\s+/).map((sentence) => (
                <span key={sentence} className="block">{sentence}</span>
              ))}
            </p>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
