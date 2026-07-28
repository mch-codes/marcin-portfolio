"use client";

import { m } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { SectionHeader, Reveal, CTA, Footnote } from "@/components/Section";

const withPeriod = (s: string) => (/[.!?]$/.test(s) ? s : `${s}.`);

type ServiceCard = { title: string; desc: string; price: string; features: string[]; href?: string; linkLabel?: string };

function ServiceCardItem({ card, delay }: { card: ServiceCard; delay: number }) {
  return (
    // Three Reveals rather than one on the whole card: title, then body, then
    // price. All three hang off the card's own delay, so the per-card stagger
    // from the grid still holds.
    <div className="flex flex-col items-start text-left">
      <Reveal delay={delay}>
        <h3 className="text-2xl font-bold text-text tracking-tight leading-tight max-w-xs">
          {withPeriod(card.title)}
        </h3>
      </Reveal>

      <Reveal delay={delay + 0.25} className="flex flex-col items-start">
        <p className="mt-4 text-base text-muted leading-relaxed max-w-xs">{card.desc}</p>
        <ul className="mt-5 flex flex-col gap-2 max-w-xs">
          {card.features.map((item) => (
            <li key={item} className="text-sm text-muted leading-relaxed">
              {item}
            </li>
          ))}
        </ul>
      </Reveal>

      {/* The link rides with the price rather than the body: it sits below the
          price on screen, so revealing it earlier would leave it hanging under
          nothing. */}
      <Reveal delay={delay + 0.5} className="flex flex-col items-start">
        <p className="mt-5 text-sm font-semibold text-text">{card.price}</p>
        {card.href && (
          <a
            href={card.href}
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-text transition-colors"
          >
            {card.linkLabel}
            <span aria-hidden>→</span>
          </a>
        )}
      </Reveal>
    </div>
  );
}

export default function Services() {
  const { t } = useLanguage();

  const cards: ServiceCard[] = [
    { title: t.services.card1_title, desc: t.services.card1_desc, price: t.services.card1_price, features: t.services.card1_features },
    { title: t.services.card2_title, desc: t.services.card2_desc, price: t.services.card2_price, features: t.services.card2_features },
    { title: t.services.card3_title, desc: t.services.card3_desc, price: t.services.card3_price, features: t.services.card3_features, href: "#projects", linkLabel: t.services.card3_link },
    { title: t.services.card4_title, desc: t.services.card4_desc, price: t.services.card4_price, features: t.services.card4_features },
  ];

  return (
    <section id="services" className="py-20 md:py-24 relative overflow-hidden">
      <SectionHeader word={t.services.title} scale={1.12} />

      <div className="px-6 md:px-16">
        {/* Capped and centred rather than run to the page gutters: each child
            inside a card is max-w-xs, so a full-width grid left ~190px of air
            to the right of every card. Change this and the caps together. */}
        <div className="mt-24 md:mt-32 mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-14">
          {cards.map((card, i) => (
            <ServiceCardItem key={i} card={card} delay={i * 0.2} />
          ))}
        </div>

        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          // max-w-4xl to match the grid above, so the button's left edge lands
          // on the first card's, not on the page gutter.
          className="mt-16 md:mt-20 mx-auto max-w-4xl flex justify-start"
        >
          <a
            href="mailto:marcin.chrzuszcz@gmail.com"
            className={CTA}
            
          >
            {t.services.cta_button}
          </a>
        </m.div>

        <Footnote>{t.services.cta_text}</Footnote>
      </div>
    </section>
  );
}
