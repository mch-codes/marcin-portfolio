"use client";

import { useLanguage } from "@/context/LanguageContext";
import { SectionHeader, SlideIn } from "@/components/Section";

// In pairs: the top row arrives from the left, the bottom row from the right.
const STEP_FROM = ["left", "left", "right", "right"] as const;

type ProcessCardData = { num: string; title: string; desc: string };

export default function Process() {
  const { t } = useLanguage();

  const cards: ProcessCardData[] = [
    { num: "01", title: t.process.card1_title, desc: t.process.card1_desc },
    { num: "02", title: t.process.card2_title, desc: t.process.card2_desc },
    { num: "03", title: t.process.card3_title, desc: t.process.card3_desc },
    { num: "04", title: t.process.card4_title, desc: t.process.card4_desc },
  ];

  return (
    <section id="process" className="py-28 md:py-40 relative overflow-hidden">
      <SectionHeader word={t.nav.process}>{t.process.subtitle}</SectionHeader>

      <div className="max-w-6xl mx-auto px-6">
        <div className="mt-24 md:mt-32 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20 justify-items-center">
          {cards.map((card, i) => (
            <SlideIn
              key={card.num}
              from={STEP_FROM[i % 4]}
              className="flex flex-col items-center text-center"
            >
              <h3 className="text-2xl font-bold text-text tracking-tight leading-tight max-w-xs">
                {card.title}
              </h3>
              <p className="mt-4 text-base text-muted leading-relaxed max-w-xs">{card.desc}</p>
            </SlideIn>
          ))}
        </div>
      </div>
    </section>
  );
}
