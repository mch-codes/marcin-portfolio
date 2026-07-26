"use client";

import { useLanguage } from "@/context/LanguageContext";
import { SectionHeader, Reveal } from "@/components/Section";

export default function AboutMe() {
  const { t } = useLanguage();

  return (
    // font-mono here, not on each block: the wordmark is an <h2> and globals.css
    // sets Fraunces on h1-h3 directly, so it keeps its serif rather than inheriting.
    <section id="about" className="py-20 md:py-24 relative overflow-hidden font-mono">
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
        <Reveal className="mt-14 md:mt-20 max-w-2xl space-y-6 text-lg text-muted leading-relaxed">
          {[t.about.p1, t.about.p2, t.about.p3, t.about.p4].map((para, i) => (
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

        {/* Tagline sits at the foot of the section rather than in
            SectionHeader's children slot, which sets its line right-aligned in
            a column beside the wordmark. The asterisk is inline and
            superscripted so it hangs off the top-left of the first word. */}
        <Reveal className="mt-14 md:mt-20 text-xs md:text-base text-muted leading-relaxed">
          {/* Flush to the right gutter, so its right edge lands on the same
              line as the hero's vertical "Chrzuszcz" — both sit inside the
              shared px-6 md:px-16 column. */}
          <p className="ml-auto max-w-md text-right">
            <span aria-hidden className="align-super text-text text-xl md:text-2xl leading-none -mr-0.5">*</span>
            {t.about.tagline1} {t.about.tagline2}.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
