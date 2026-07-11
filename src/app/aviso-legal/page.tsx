"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function AvisoLegal() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen px-6 py-20 bg-bg">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-text transition-colors mb-10"
        >
          {t.legalPage.back}
        </Link>

        <h1 className="text-3xl font-bold text-text tracking-tight mb-2">{t.legalPage.title}</h1>
        <p className="text-xs text-muted/60 mb-10">{t.legalPage.updated}</p>

        <div className="flex flex-col gap-8">
          {t.legalPage.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-sm font-semibold text-text mb-2">{section.heading}</h2>
              <p className="text-sm text-muted leading-relaxed">{section.body}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
