"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
};

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="blob-1 absolute top-[-15%] left-[-10%] w-[70%] h-[70%] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(232,149,109,0.09) 0%, transparent 65%)",
          }}
        />
        <div
          className="blob-2 absolute bottom-[-20%] right-[-5%] w-[55%] h-[60%] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(200,169,110,0.07) 0%, transparent 65%)",
          }}
        />
      </div>

      {/* Grid lines decoration */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(37,33,24,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(37,33,24,0.4) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage:
            "radial-gradient(ellipse 70% 70% at 50% 50%, black 0%, transparent 100%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-20 w-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl"
        >
          {/* Label */}
          <motion.div variants={itemVariants} className="mb-8">
            <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-muted border border-border px-4 py-2 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Madrid, España
            </span>
          </motion.div>

          {/* Name */}
          <motion.div variants={itemVariants} className="mb-4">
            <p className="text-sm font-medium text-muted tracking-widest uppercase mb-3">
              Marcin
            </p>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl sm:text-6xl md:text-7xl font-bold text-text leading-[1.05] tracking-tight mb-4"
          >
            {t.hero.headline}
          </motion.h1>

          <motion.h1
            variants={itemVariants}
            className="text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.05] tracking-tight mb-8"
            style={{
              background: "linear-gradient(135deg, #e8956d 0%, #c8a96e 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {t.hero.headline2}
          </motion.h1>

          {/* Subtext */}
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-muted leading-relaxed max-w-xl mb-12"
          >
            {t.hero.subtext}
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center gap-4"
          >
            <a
              href="#projects"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-[#0d0b08] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, #e8956d 0%, #c8a96e 100%)",
                boxShadow: "0 4px 24px rgba(232,149,109,0.25)",
              }}
            >
              {t.hero.cta_projects}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M2 7h10M8 3l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>

            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-text border border-border-light bg-card hover:bg-card-hover hover:border-[#e8956d]/40 transition-all duration-200"
            >
              {t.hero.cta_contact}
            </a>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            variants={itemVariants}
            className="mt-20 hidden sm:flex items-center gap-3 text-muted text-xs tracking-wider"
          >
            <div className="flex flex-col gap-1">
              <span
                className="block w-px h-8 mx-auto bg-border-light"
                style={{
                  animation: "scrollLine 2s ease-in-out infinite",
                }}
              />
            </div>
            <span className="uppercase tracking-widest">Scroll</span>
          </motion.div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes scrollLine {
          0%, 100% { opacity: 0.3; transform: scaleY(1); }
          50% { opacity: 1; transform: scaleY(1.2); }
        }
      `}</style>
    </section>
  );
}
