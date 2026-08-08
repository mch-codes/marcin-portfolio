"use client";

import { useLanguage } from "@/context/LanguageContext";
import { SectionHeader, Reveal } from "@/components/Section";

export default function AboutMe() {
  const { t } = useLanguage();

  /* Editorial lead: the whole opening paragraph set large, with only its first
     three words carrying the weight. The split is on words, not sentences —
     the bold has to stop mid-phrase ("Varios años como", "Several years as")
     so the change reads as emphasis running into the sentence rather than as a
     heading sitting above it. Everything after it is the same size, the same
     colour and the same leading; only the weight changes. */
  const words = t.about.p1.split(" ");
  const openers = words.slice(0, 3).join(" ");
  const rest = words.slice(3).join(" ");

  return (
    <section id="about" className="py-20 md:py-24 relative overflow-hidden bg-bg">
      <SectionHeader word={t.about.title} />

      <div className="px-6 md:px-16">
        <Reveal className="mt-24 md:mt-32">
          {/* 70ch is the cap on paper only — at this size the container runs out
              first on anything short of an ultrawide. It is here so the line
              length holds if the section ever moves into a wider shell.
              leading-tight rather than the default: at 60px+ the normal
              line-height opens gaps the eye reads as paragraph breaks. */}
          <p className="max-w-[70ch] text-4xl md:text-6xl font-normal leading-tight tracking-tight text-text">
            <strong className="font-bold">{openers}</strong> {rest}
          </p>

          {/* Supporting tier: one step of contrast in size and one in colour,
              no bold. It starts at p2 — the whole of p1 is the lead now. */}
          <div className="mt-8 md:mt-10 max-w-2xl space-y-6 text-base md:text-lg font-normal text-muted leading-relaxed">
            {[t.about.p2, t.about.p2b, t.about.p3, t.about.p4].map((para) => (
              <p key={para}>{para}</p>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
