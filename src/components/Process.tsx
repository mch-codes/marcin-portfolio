"use client";

import { useLanguage } from "@/context/LanguageContext";
import { SectionHeader, Reveal } from "@/components/Section";

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
    <section id="process" className="py-20 md:py-24 relative overflow-hidden bg-card">
      <SectionHeader word={t.nav.process}>{t.process.subtitle}</SectionHeader>

      <div className="max-w-6xl mx-auto px-6">
        <div className="mt-14 md:mt-20 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-14 justify-items-center">
          {cards.map((card) => (
            <Reveal
              key={card.num}
              className="flex flex-col items-center text-center"
            >
              <h3 className="text-2xl font-bold text-text tracking-tight leading-tight max-w-xs">
                {card.title}
              </h3>
              <p className="mt-4 text-base text-muted leading-relaxed max-w-xs">{card.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
