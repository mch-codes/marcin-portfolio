"use client";

import { useLanguage } from "@/context/LanguageContext";
import { SectionHeader, Reveal, Footnote } from "@/components/Section";

type ProcessCardData = { num: string; title: string; desc: string };

function ProcessCardItem({ card, delay }: { card: ProcessCardData; delay: number }) {
  return (
    // Two Reveals rather than one on the whole card: the title lands first and
    // the body follows a beat later. Both hang off the card's own delay, so the
    // per-card stagger from the grid still holds. Same shape as Services.
    <div className="flex flex-col items-start text-left">
      <Reveal delay={delay}>
        <h3 className="text-2xl font-bold text-text tracking-tight leading-tight max-w-xs">
          {card.title}
        </h3>
      </Reveal>

      <Reveal delay={delay + 0.25}>
        <p className="mt-4 text-base text-muted leading-relaxed max-w-xs">{card.desc}</p>
      </Reveal>
    </div>
  );
}

export default function Process() {
  const { t } = useLanguage();

  const cards: ProcessCardData[] = [
    { num: "01", title: t.process.card1_title, desc: t.process.card1_desc },
    { num: "02", title: t.process.card2_title, desc: t.process.card2_desc },
    { num: "03", title: t.process.card3_title, desc: t.process.card3_desc },
    { num: "04", title: t.process.card4_title, desc: t.process.card4_desc },
  ];

  return (
    <section id="process" className="py-20 md:py-24 relative overflow-hidden">
      <SectionHeader word={t.nav.process} />

      <div className="px-6 md:px-16">
        {/* Capped and centred rather than run to the page gutters: each child
            inside a card is max-w-xs, so a full-width grid left a stretch of
            air to the right of every card. Change this and the caps together. */}
        <div className="mt-24 md:mt-32 mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-14">
          {cards.map((card, i) => (
            <ProcessCardItem key={card.num} card={card} delay={i * 0.2} />
          ))}
        </div>

        <Footnote>{t.process.subtitle}</Footnote>
      </div>
    </section>
  );
}
