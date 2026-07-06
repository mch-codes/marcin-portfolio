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

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

type FreelanceProject = {
  name: string;
  desc: string;
  demoUrl: string;
  githubUrl: string;
  stack: string[];
};

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

  const freelanceProjects: FreelanceProject[] = [
    {
      name: t.projects.fontaneria_name,
      desc: t.projects.fontaneria_desc,
      demoUrl: "https://fontaneria-urgente-lavapies.vercel.app",
      githubUrl: "https://github.com/mch-codes/fontaneria-urgente-lavapies",
      stack: ["Next.js", "TypeScript", "Tailwind"],
    },
    {
      name: t.projects.fisio_name,
      desc: t.projects.fisio_desc,
      demoUrl: "https://fisio-vitalia-landing.vercel.app",
      githubUrl: "https://github.com/mch-codes/fisio-vitalia-landing",
      stack: ["Next.js", "TypeScript", "Tailwind"],
    },
  ];

  return (
    <section id="projects" className="py-28 md:py-36 relative bg-[#1a1a1e]">
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
            {t.projects.headline}
            <br />
            <span className="text-muted font-normal">{t.projects.headline_sub}</span>
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
                src="/oidoo-screenshot.webp"
                alt="Oidoo App"
                width={1280}
                height={800}
                className="w-full object-cover object-top"
                style={{ maxHeight: "320px" }}
              />
              <div
                className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none"
                style={{ background: "linear-gradient(to bottom, transparent, #18181b)" }}
              />
            </a>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            {/* Header row */}
            <div className="flex items-center justify-between mb-5">
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
            <h3 className="text-2xl md:text-3xl font-bold text-text tracking-tight mb-3">
              {t.projects.oidoo_name}
            </h3>
            <p className="text-xs text-muted mb-7 max-w-xl leading-relaxed">
              {t.projects.oidoo_tagline}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 border-t border-b border-border py-5 mb-7">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="text-xl md:text-2xl font-bold text-text mb-1 tabular-nums">
                    {s.val}
                  </p>
                  <p className="text-xs text-muted leading-snug">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Feature blocks */}
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-5 mb-8">
              {features.map((f) => (
                <div key={f.num}>
<h4 className="text-sm font-semibold text-text mb-1.5">{f.title}</h4>
                  <p className="text-sm text-muted leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>

            <p className="text-sm text-muted leading-relaxed mb-8 italic">
              {t.projects.oidoo_extra}
            </p>

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

        {/* Freelance projects */}
        <m.h3
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="text-sm font-semibold text-muted uppercase tracking-widest mt-16 mb-6"
        >
          {t.projects.freelance_title}
        </m.h3>

        <div className="grid sm:grid-cols-2 gap-5">
          {freelanceProjects.map((p, i) => (
            <m.div
              key={p.name}
              initial={{ opacity: 0, y: 32 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.25 + i * 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              className="rounded-2xl border border-border bg-card p-6 md:p-7 flex flex-col gap-4 hover:border-accent/40 transition-colors duration-300"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted bg-bg border border-border px-3 py-1.5 rounded-md">
                  {t.projects.freelance_tag}
                </span>
                <a
                  href={p.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted/60 hover:text-text transition-colors"
                  aria-label={`${p.name} — GitHub`}
                >
                  <GitHubIcon />
                </a>
              </div>

              <div>
                <h4 className="text-base font-semibold text-text mb-1.5">{p.name}</h4>
                <p className="text-sm text-muted leading-relaxed">{p.desc}</p>
              </div>

              <div className="flex flex-wrap gap-2 mt-auto pt-2">
                {p.stack.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs font-medium text-muted border border-border px-2.5 py-1 rounded-lg bg-bg"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <a
                href={p.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-light transition-colors"
              >
                {t.projects.freelance_demo}
                <ArrowUpRight />
              </a>
            </m.div>
          ))}
        </div>

      </div>
    </section>
  );
}
