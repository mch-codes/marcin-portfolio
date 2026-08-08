"use client";

import { useLanguage } from "@/context/LanguageContext";
import { SectionHeader, Reveal } from "@/components/Section";

export default function AboutMe() {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-20 md:py-24 relative overflow-hidden">
      <SectionHeader word={t.about.title} />

      <div className="px-6 md:px-16">
        {/* Set at the default tracking. This ran at tracking-[0.15em] with a
            matching [word-spacing:0.25em] to compensate; at this much
            body copy the spacing cost more in reading speed than it bought in
            texture. Restore both together if it goes back — the word-spacing
            only exists to offset the letterspacing. */}
        {/* text-muted like every other section's body copy. It used to be
            text-text because muted only cleared 3.4:1 on the old mint
            background; on white it measures 4.83:1, so the exception is gone. */}
        {/* ml-auto puts the block against the right gutter; the lines inside stay
            left-aligned, since a right rag over four paragraphs costs more in
            reading speed than it buys. */}
        <Reveal className="mt-24 md:mt-32 ml-auto max-w-2xl space-y-6 text-lg text-muted leading-relaxed">
          {[t.about.p1, t.about.p2, t.about.p2b, t.about.p3, t.about.p4].map((para, i) => (
            // One line per sentence, spans inside a single <p> so the paragraph
            // still reads as one block — same pattern as hero_sub in About.tsx.
            // ponytail: split on ". ", not a sentence tokeniser. It survives
            // "Oidoo.app" (no space after that dot) but would break on an
            // abbreviation like "Ej. " — hand-split the string in
            // translations.ts if the copy ever gains one.
            // Drop cap on the opening paragraph only. ::first-letter has to be
            // targeted at the inner span, not the <p>: each sentence is its own
            // block box, so the p's "first line" lives one level down. The float
            // still escapes the span, so the following sentences wrap around it.
            <p
              key={para}
              className={
                i === 0
                  ? "[&>span:first-child]:first-letter:float-left [&>span:first-child]:first-letter:[font-family:var(--font-fraunces)] [&>span:first-child]:first-letter:text-[3.6em] [&>span:first-child]:first-letter:leading-[0.78] [&>span:first-child]:first-letter:pr-2 [&>span:first-child]:first-letter:pt-1"
                  : undefined
              }
            >
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
