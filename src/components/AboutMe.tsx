"use client";

import { useLanguage } from "@/context/LanguageContext";
import { SectionHeader, Reveal } from "@/components/Section";
import Portrait from "@/components/Portrait";

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
    // overflow-x-clip, not overflow-hidden: hidden makes the section a scroll
    // container, and the pinned portrait would stick to it instead of the
    // viewport — i.e. never stick.
    <section id="about" className="py-20 md:py-24 relative overflow-x-clip bg-bg">
      <SectionHeader word={t.about.title} />

      <div className="px-6 md:px-16">
        {/* Story left, portrait right and pinned beside it, so the photo turns
            into code next to the kitchen-to-code story — it used to sit under
            the lead and play out of the reader's eyeline. Side by side from lg only: at md the prose column would be
            ~270px next to the portrait. The portrait is second in the DOM so a
            screen reader gets the prose first, and it stacks below for the
            same reason. */}
        <Reveal className="mt-24 md:mt-32">
          <div className="flex flex-col lg:flex-row lg:items-start gap-10 lg:gap-12 xl:gap-16">
            <div className="flex-1 min-w-0">
              {/* leading-tight rather than the default: at this size the normal
                  line-height opens gaps the eye reads as paragraph breaks.
                  Steps up with the column: beside the portrait it has roughly
                  half the width it had running full-bleed. */}
              <p className="text-4xl xl:text-5xl font-normal leading-tight tracking-tight text-text">
                <strong className="font-bold">{openers}</strong> {rest}
              </p>
              <div className="mt-8 md:mt-10 max-w-2xl space-y-6 text-base md:text-lg font-normal text-muted leading-relaxed">
                <p>{t.about.p2}</p>
                <p className="text-text">{t.about.close}</p>
              </div>
            </div>

            <div className="w-full max-w-[360px] lg:w-[320px] xl:w-[360px] shrink-0 lg:sticky lg:top-28">
              <Portrait alt={t.about.portraitAlt} />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
