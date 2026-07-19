"use client";

import { m } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { SectionHeader, SlideIn } from "@/components/Section";

function IconMonitor() {
  return (
    <svg className="h-14 w-14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );
}

function IconTarget() {
  return (
    <svg className="h-14 w-14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function IconLayers() {
  return (
    <svg className="h-14 w-14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

function IconWrench() {
  return (
    <svg className="h-14 w-14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L2 19v3h3l7.3-7.3a4 4 0 0 0 5.4-5.4l-2.65 2.65a1.5 1.5 0 0 1-2.12 0l-.88-.88a1.5 1.5 0 0 1 0-2.12L14.7 6.3z" />
    </svg>
  );
}

const withPeriod = (s: string) => (/[.!?]$/.test(s) ? s : `${s}.`);

type ServiceCard = { icon: React.ReactNode; title: string; desc: string; price: string; features: string[]; href?: string; linkLabel?: string };

function ServiceCardItem({ card }: { card: ServiceCard }) {
  return (
    <SlideIn from="right" className="flex flex-col items-center text-center">
      <span className="text-text">{card.icon}</span>
      <h3 className="mt-8 text-2xl font-bold text-text tracking-tight leading-tight max-w-xs">
        {withPeriod(card.title)}
      </h3>
      <p className="mt-4 text-base text-muted leading-relaxed max-w-xs">{card.desc}</p>
      <p className="mt-5 text-sm font-semibold text-text">{card.price}</p>
      <ul className="mt-5 flex flex-col gap-2 max-w-xs">
        {card.features.map((item) => (
          <li key={item} className="text-sm text-muted leading-relaxed">
            {item}
          </li>
        ))}
      </ul>
      {card.href && (
        <a
          href={card.href}
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-text hover:text-muted transition-colors"
        >
          {card.linkLabel}
          <span aria-hidden>→</span>
        </a>
      )}
    </SlideIn>
  );
}

export default function Services() {
  const { t } = useLanguage();

  const cards: ServiceCard[] = [
    { icon: <IconMonitor />, title: t.services.card1_title, desc: t.services.card1_desc, price: t.services.card1_price, features: t.services.card1_features },
    { icon: <IconTarget />,  title: t.services.card2_title, desc: t.services.card2_desc, price: t.services.card2_price, features: t.services.card2_features },
    { icon: <IconLayers />,  title: t.services.card3_title, desc: t.services.card3_desc, price: t.services.card3_price, features: t.services.card3_features, href: "#projects", linkLabel: t.services.card3_link },
    { icon: <IconWrench />,  title: t.services.card4_title, desc: t.services.card4_desc, price: t.services.card4_price, features: t.services.card4_features },
  ];

  return (
    <section id="services" className="py-28 md:py-40 relative overflow-hidden">
      <SectionHeader word={t.services.title} splash={1}>{t.services.cta_text}</SectionHeader>

      <div className="max-w-6xl mx-auto px-6">
        <div className="mt-24 md:mt-32 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20 justify-items-center">
          {cards.map((card, i) => (
            <ServiceCardItem key={i} card={card} />
          ))}
        </div>

        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="mt-28 md:mt-32 flex justify-center"
        >
          <a
            href="mailto:marcin.chrzuszcz@gmail.com"
            className="btn-splash-2 inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-3 text-sm font-semibold text-accent border border-accent hover:bg-accent hover:text-bg transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            
          >
            {t.services.cta_button}
          </a>
        </m.div>
      </div>
    </section>
  );
}
