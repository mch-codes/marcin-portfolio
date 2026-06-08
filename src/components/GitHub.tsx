"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";

const GITHUB_USERNAME = "mch-codes";

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

export default function GitHub() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="github" className="py-28 md:py-36 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="max-w-6xl mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="mb-14"
        >
          <span className="text-[11px] font-mono tracking-widest text-muted/50 uppercase block mb-5">03</span>
          <h2 className="text-3xl md:text-4xl font-bold text-text tracking-tight leading-[1.15]">
            {t.github.subtitle}
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-6">
          {/* Profile card */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="md:col-span-2 flex flex-col justify-between rounded-2xl border border-border bg-card p-7 group hover:border-border-light transition-all duration-300"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#1c1916] border border-border flex items-center justify-center text-text group-hover:text-accent transition-colors">
                <GitHubIcon />
              </div>
              <div>
                <p className="font-semibold text-text text-sm">@{GITHUB_USERNAME}</p>
                <p className="text-xs text-muted mt-0.5">GitHub</p>
              </div>
            </div>

            <p className="text-sm text-muted leading-relaxed mb-8">
              {t.github.subtitle}
            </p>

            <a
              href={`https://github.com/${GITHUB_USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-text border border-border-light bg-card-hover hover:border-accent/40 hover:text-accent px-5 py-2.5 rounded-xl transition-all duration-200 self-start"
            >
              {t.github.cta}
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
          </motion.div>

          {/* Stats card */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="md:col-span-3 rounded-2xl border border-border bg-card overflow-hidden"
          >
            {/* GitHub stats card from shields/readme-stats */}
            <div className="p-6 pb-4 border-b border-border">
              <p className="text-xs font-semibold tracking-widest uppercase text-muted">
                {t.github.stats}
              </p>
            </div>
            <div className="p-4 flex items-center justify-center min-h-[160px] bg-card/50">
              <img
                src={`https://github-readme-stats.vercel.app/api?username=${GITHUB_USERNAME}&show_icons=true&hide_border=true&bg_color=131110&title_color=e8956d&text_color=ede8e0&icon_color=c8a96e&hide_title=true&count_private=true`}
                alt={`${GITHUB_USERNAME} GitHub stats`}
                className="max-w-full rounded-lg"
                style={{ maxHeight: "180px" }}
              />
            </div>

            {/* Contribution graph */}
            <div className="p-4 border-t border-border bg-card/30">
              <img
                src={`https://ghchart.rshah.org/e8956d/${GITHUB_USERNAME}`}
                alt={`${GITHUB_USERNAME} contribution chart`}
                className="w-full rounded-lg opacity-80 hover:opacity-100 transition-opacity"
                style={{ filter: "brightness(0.9) contrast(1.1)" }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
