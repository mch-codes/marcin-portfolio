"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border py-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-text">MC</span>
          <span className="w-px h-4 bg-border" />
          <p className="text-xs text-muted">{t.footer.copy}</p>
        </div>

        <div className="flex items-center gap-6">
          <p className="text-xs text-muted/60 italic">{t.footer.tagline}</p>
          <span className="text-xs text-muted/40">© {year}</span>
        </div>
      </div>
    </footer>
  );
}
