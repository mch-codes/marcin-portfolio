"use client";

import { m } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { SectionHeader, Reveal, CTA, Footnote, HAIRLINE_WIPE } from "@/components/Section";
import { CONTACT_EMAIL } from "@/lib/constants";

const withPeriod = (s: string) => (/[.!?]$/.test(s) ? s : `${s}.`);

type ServiceCard = { title: string; desc: string; price: string; features: string[] };
type LineItem = { label: string; price: string };

function ServiceCardItem({ card, delay }: { card: ServiceCard; delay: number }) {
  return (
    // Three Reveals rather than one on the whole card: title, then body, then
    // price. All three hang off the card's own delay, so the per-card stagger
    // from the grid still holds.
    // h-full + mt-auto on the price: grid rows stretch, so the price line
    // sits on the same baseline across all three cards even though the
    // feature lists differ in length.
    <div className="group flex flex-col items-start text-left w-full max-w-xs h-full">
      <Reveal delay={delay}>
        <h3 className="text-2xl font-bold text-text tracking-tight leading-tight">
          {withPeriod(card.title)}
        </h3>
      </Reveal>

      <Reveal delay={delay + 0.25} className="flex flex-col items-start w-full">
        <p className="mt-4 text-base text-muted leading-relaxed">{card.desc}</p>
        {/* Hairline before the feature list separates the pitch sentence from
            the spec sheet — the two were reading as one paragraph before. The
            mono dash echoes the mono price below, so features read as data
            rather than more prose.
            On card hover a text-coloured line wipes left-to-right over the
            border, same gesture as the nav underline and the CTA fill. The
            border stays as the resting state, so nothing moves on load. */}
        <ul className={`mt-5 w-full flex flex-col gap-2.5 border-t border-border pt-4 ${HAIRLINE_WIPE}`}>
          {card.features.map((item) => (
            <li key={item} className="flex gap-2.5 text-sm text-muted leading-relaxed">
              <span aria-hidden className="font-mono text-xs text-border-light mt-0.5 shrink-0">
                --
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal delay={delay + 0.5} className="mt-auto flex flex-col items-start w-full">
        {/* delay-100 so the two hairlines wipe top-then-bottom rather than
            firing as one block. */}
        <p className={`mt-5 pt-4 w-full border-t border-border font-mono text-sm font-semibold text-text ${HAIRLINE_WIPE} before:delay-100`}>
          {card.price}
        </p>
      </Reveal>
    </div>
  );
}

/** A compact label/price row, used for the Add-ons and Maintenance strips
 * below the core cards. Same hairline-and-mono vocabulary as the cards, just
 * flattened into a list instead of three tiers of prose — these aren't full
 * packages, they don't need the same weight. */
function LineItemRow({ item }: { item: LineItem }) {
  return (
    // Both spans are already text-text, so the hover lands on the rule
    // instead of the type: the row's hairline darkens a step.
    <li className="flex items-baseline justify-between gap-4 py-3 text-sm border-b border-border first:border-t transition-colors duration-200 hover:border-border-light">
      <span className="text-text">{item.label}</span>
      <span className="font-mono text-text shrink-0">{item.price}</span>
    </li>
  );
}

function LineItemGroup({ heading, items, delay }: { heading: string; items: LineItem[]; delay: number }) {
  return (
    <Reveal delay={delay} className="w-full">
      <p className="font-mono text-xs uppercase tracking-wider text-muted">{heading}</p>
      <ul className="mt-4">
        {items.map((item) => (
          <LineItemRow key={item.label} item={item} />
        ))}
      </ul>
    </Reveal>
  );
}

export default function Services() {
  const { t } = useLanguage();

  const cards: ServiceCard[] = [
    { title: t.services.card1_title, desc: t.services.card1_desc, price: t.services.card1_price, features: t.services.card1_features },
    { title: t.services.card2_title, desc: t.services.card2_desc, price: t.services.card2_price, features: t.services.card2_features },
    { title: t.services.card3_title, desc: t.services.card3_desc, price: t.services.card3_price, features: t.services.card3_features },
  ];

  return (
    // cursor-default so the pointer stays an arrow across the cards instead of
    // flicking to an I-beam over every line of type. The CTA is an <a>, which
    // has its own cursor rule, so it still gets the hand.
    <section id="services" className="py-20 md:py-24 relative overflow-hidden cursor-default">
      <SectionHeader word={t.services.title} />

      <div className="px-6 md:px-16">
        {/* Three tiers now instead of four — Maintenance and the former
            fourth card moved down into the line-item strips below, since
            they aren't full packages and don't need three Reveals of prose
            each. max-w-5xl / 3 cols keeps each card at roughly the same
            width it had in the old 2-col / max-w-4xl layout. */}
        <div className="mt-24 md:mt-32 mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-14">
          {cards.map((card, i) => (
            <ServiceCardItem key={i} card={card} delay={i * 0.2} />
          ))}
        </div>

        {/* Add-ons and Maintenance: same max-w-5xl rail as the cards above,
            narrowed to a single reading column so the label/price rows don't
            stretch edge-to-edge on wide screens. */}
        <div className="mt-20 md:mt-24 mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
          <LineItemGroup heading={t.services.addons_heading} items={t.services.addons} delay={0.1} />
          <LineItemGroup heading={t.services.maintenance_heading} items={t.services.maintenance} delay={0.2} />
        </div>

        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          // max-w-5xl to match the rails above, so the button's left edge
          // lands on the first card's, not on the page gutter.
          className="mt-16 md:mt-20 mx-auto max-w-5xl flex justify-start"
        >
          <a
            href={`mailto:${CONTACT_EMAIL}`}
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
