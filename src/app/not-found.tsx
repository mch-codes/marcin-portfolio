"use client";

import { m } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-bg">
      <m.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-lg text-center"
      >
        <m.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-[11px] font-mono tracking-widest text-muted/50 uppercase mb-6"
        >
          404
        </m.p>

        <m.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-3xl md:text-4xl font-bold text-text tracking-tight leading-[1.2] mb-3"
        >
          {t.notFound.headline}
        </m.h1>

        <m.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="text-muted text-lg mb-10"
        >
          {t.notFound.tagline}
        </m.p>

        <m.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-muted border border-border hover:border-border-light hover:text-text transition-all duration-200"
          >
            ← {t.notFound.back}
          </Link>
        </m.div>
      </m.div>
    </div>
  );
}
