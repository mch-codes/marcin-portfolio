"use client";

import { m, useInView } from "framer-motion";
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

  const features = [
    { num: "01", title: t.projects.oidoo_f1_title, desc: t.projects.oidoo_f1_desc },
    { num: "02", title: t.projects.oidoo_f2_title, desc: t.projects.oidoo_f2_desc },
    { num: "03", title: t.projects.oidoo_f3_title, desc: t.projects.oidoo_f3_desc },
    { num: "04", title: t.projects.oidoo_f4_title, desc: t.projects.oidoo_f4_desc },
  ];

  const stats = [
    { val: t.projects.oidoo_stat1_val, label: t.projects.oidoo_stat1_label },
    { val: t.projects.oidoo_stat2_val, label: t.projects.oidoo_stat2_label },
    { val: t.projects.oidoo_stat3_val, label: t.projects.oidoo_stat3_label },
  ];

  return (
    <section id="projects" className="py-28 md:py-36 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="max-w-6xl mx-auto px-6" ref={ref}>
        {/* Section header */}
        <m.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-text tracking-tight leading-[1.15]">
            Productos reales,
            <br />
            <span className="text-muted font-normal">en producción.</span>
          </h2>
        </m.div>

        {/* Oidoo showcase */}
        <m.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="rounded-2xl border border-border bg-card overflow-hidden mb-5"
        >
          <div className="h-px bg-gradient-to-r from-accent/50 via-accent/20 to-transparent" />

          {/* Browser frame */}
          <div className="border-b border-border">
            {/* Chrome bar */}
            <div className="flex items-center gap-3 px-4 py-3 bg-card">
              <div className="flex gap-1.5 shrink-0">
                <div className="w-2.5 h-2.5 rounded-full bg-border" />
                <div className="w-2.5 h-2.5 rounded-full bg-border" />
                <div className="w-2.5 h-2.5 rounded-full bg-border" />
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div className="bg-bg border border-border rounded-md px-4 py-1 flex items-center gap-2">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="text-muted/40">
                    <rect x="1" y="4" width="8" height="6" rx="1" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M3 4V3a2 2 0 0 1 4 0v1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                  <span className="text-xs text-muted/50 font-mono">oidoo.app</span>
                </div>
              </div>
              <a
                href="https://www.oidoo.app"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-muted/40 hover:text-muted transition-colors"
                aria-label="Open oidoo.app"
              >
                <ArrowUpRight />
              </a>
            </div>

            {/* Screenshot */}
            <a href="https://www.oidoo.app" target="_blank" rel="noopener noreferrer" className="block relative overflow-hidden">
              <img
                src="/oidoo-screenshot.png"
                alt="Oidoo App"
                className="w-full object-cover object-top"
                style={{ maxHeight: "400px" }}
              />
              <div
                className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none"
                style={{ background: "linear-gradient(to bottom, transparent, #18181b)" }}
              />
            </a>
          </div>

          {/* Content */}
          <div className="p-8 md:p-12">
            {/* Header row */}
            <div className="flex items-center justify-between mb-8">
              <span className="text-xs font-medium text-accent/80 bg-accent/8 border border-accent/15 px-3 py-1.5 rounded-md">
                {t.projects.oidoo_tag}
              </span>
              <div className="flex items-center gap-2 text-xs text-muted">
                <span>2024</span>
                <span className="w-px h-3 bg-border" />
                <span className="text-accent/80">{t.projects.oidoo_status}</span>
              </div>
            </div>

            {/* Product name + tagline */}
            <h3 className="text-4xl md:text-5xl font-bold text-text tracking-tight mb-3">
              {t.projects.oidoo_name}
            </h3>
            <p className="text-lg text-muted mb-10 max-w-xl leading-relaxed">
              {t.projects.oidoo_tagline}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 border-t border-b border-border py-8 mb-10">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="text-2xl md:text-3xl font-bold text-text mb-1 tabular-nums">
                    {s.val}
                  </p>
                  <p className="text-xs text-muted leading-snug">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Feature blocks */}
            <div className="grid sm:grid-cols-2 gap-x-12 gap-y-8 mb-12">
              {features.map((f) => (
                <div key={f.num}>
                  <span className="text-[11px] font-mono text-muted/40 block mb-2">{f.num}</span>
                  <h4 className="text-sm font-semibold text-text mb-1.5">{f.title}</h4>
                  <p className="text-sm text-muted leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>

            {/* Stack + CTA */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="flex flex-wrap gap-2">
                {oidooStack.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs font-medium text-muted border border-border px-3 py-1.5 rounded-lg bg-bg"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <a
                href="https://www.oidoo.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-semibold text-sm text-white px-5 py-2.5 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  boxShadow: "0 4px 16px rgba(16,185,129,0.2)",
                }}
              >
                {t.projects.oidoo_cta}
                <ArrowUpRight />
              </a>
            </div>
          </div>
        </m.div>

      </div>
    </section>
  );
}
