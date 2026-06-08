"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";

const oidooStack = ["Next.js", "TypeScript", "Supabase", "Vercel"];

function ArrowUpRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 13L13 3M13 3H6M13 3v7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Projects() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="projects" className="py-28 md:py-36 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="max-w-6xl mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="mb-14"
        >
          <span className="text-[11px] font-mono tracking-widest text-muted/50 uppercase block mb-5">02</span>
          <h2 className="text-3xl md:text-4xl font-bold text-text tracking-tight leading-[1.15]">
            Productos reales,
            <br />
            <span className="text-muted font-normal">en producción.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {/* Oidoo — Hero card (spans 2 columns) */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="md:col-span-2 group relative flex flex-col justify-between rounded-2xl border border-border bg-card overflow-hidden p-8 hover:border-border-light transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-8">
              <span className="inline-flex items-center text-xs font-medium text-accent bg-accent/8 border border-accent/15 px-3 py-1.5 rounded-md">
                {t.projects.oidoo_tag}
              </span>
              <span className="text-xs text-muted">2024</span>
            </div>

            <div className="flex-1">
              <h3 className="text-2xl font-bold text-text mb-3 tracking-tight">
                {t.projects.oidoo_name}
              </h3>
              <p className="text-muted leading-relaxed mb-8 max-w-md">
                {t.projects.oidoo_desc}
              </p>

              <div className="flex flex-wrap gap-2 mb-10">
                {oidooStack.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs font-medium text-muted border border-border px-3 py-1.5 rounded-lg bg-[#0d0b08]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <a
              href="https://www.oidoo.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-semibold text-sm text-[#0d0b08] px-5 py-2.5 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] self-start"
              style={{
                background: "linear-gradient(135deg, #e8956d 0%, #c8a96e 100%)",
                boxShadow: "0 4px 16px rgba(232,149,109,0.2)",
              }}
            >
              {t.projects.oidoo_cta}
              <ArrowUpRight />
            </a>
          </motion.div>

          {/* WIP cards */}
          <div className="flex flex-col gap-5">
            {[1, 2].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 32 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.7,
                  delay: 0.15 + i * 0.1,
                  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
                }}
                className="flex-1 rounded-2xl border border-dashed border-border bg-card/40 p-6 flex flex-col justify-between"
              >
                <div>
                  <span className="inline-flex items-center text-xs font-medium text-gold/80 bg-gold/8 border border-gold/15 px-3 py-1.5 rounded-md">
                    {t.projects.wip_badge}
                  </span>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-text/50 mb-2 tracking-tight">
                    {t.projects.wip_name}
                  </h3>
                  <p className="text-sm text-muted/60">{t.projects.wip_desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
