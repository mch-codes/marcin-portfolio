"use client";

import { useLanguage } from "@/context/LanguageContext";
import { SectionHeader, Reveal, Footnote, HAIRLINE_WIPE } from "@/components/Section";

type ProcessCardData = { title: string; desc: string };

function ProcessCardItem({ card, delay }: { card: ProcessCardData; delay: number }) {
  return (
    // Two Reveals rather than one on the whole card: the title lands first and
    // the body follows a beat later. Both hang off the card's own delay, so the
    // per-card stagger from the grid still holds. Same shape as Services.
    <div className="group flex flex-col items-start text-left">
      <Reveal delay={delay}>
        {/* Two lines' worth of height reserved so the hairline below lands on
            the same level across the row — some titles wrap, some don't, and
            without this the rules stagger. 3.75rem = 2 × text-2xl at
            leading-tight. ponytail: breaks if a title ever runs to three
            lines; the fix then is grid-rows-subgrid on the cards. Only from
            md, since a single column has nothing to line up with. */}
        <h3 className="text-2xl font-bold text-text tracking-tight leading-tight max-w-xs md:min-h-[3.75rem]">
          {card.title}
        </h3>
      </Reveal>

      <Reveal delay={delay + 0.25}>
        {/* Hairline between the step title and its body, carrying the same
            hover wipe as the Services cards. Services rules the pitch off from
            the spec sheet; here it rules the step off from what it involves. */}
        <p className={`mt-5 pt-4 border-t border-border text-base text-muted leading-relaxed max-w-xs ${HAIRLINE_WIPE}`}>
          {card.desc}
        </p>
      </Reveal>
    </div>
  );
}

export default function Process() {
  const { t } = useLanguage();

  const cards: ProcessCardData[] = [
    { title: t.process.card1_title, desc: t.process.card1_desc },
    { title: t.process.card2_title, desc: t.process.card2_desc },
    { title: t.process.card3_title, desc: t.process.card3_desc },
    { title: t.process.card4_title, desc: t.process.card4_desc },
  ];

  return (
    // cursor-default to match Services: an arrow across the cards rather than
    // an I-beam over every line of type.
    <section id="process" className="py-20 md:py-24 relative overflow-hidden cursor-default">
      <SectionHeader word={t.nav.process} />

      <div className="px-6 md:px-16">
        {/* Capped and centred rather than run to the page gutters: each child
            inside a card is max-w-xs, so a full-width grid left a stretch of
            air to the right of every card. Change this and the caps together. */}
        <div className="mt-24 md:mt-32 mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-14">
          {cards.map((card, i) => (
            <ProcessCardItem key={card.title} card={card} delay={i * 0.2} />
          ))}
        </div>

        <Footnote>{t.process.subtitle}</Footnote>
      </div>
    </section>
  );
}
