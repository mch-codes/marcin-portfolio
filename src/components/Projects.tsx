"use client";

import { m, useInView } from "framer-motion";
import { useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";

const oidooStack = ["Next.js", "TypeScript", "Supabase", "Vercel"];
const freelanceStack = ["Next.js", "TypeScript", "Tailwind"];

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

type ProjectCard = {
  tag: string;
  status?: string;
  title: string;
  desc: string;
  stack: string[];
  demoUrl: string;
  demoLabel: string;
  githubUrl?: string;
  screenshot: string;
  host: string;
};

export default function Projects() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const projects: ProjectCard[] = [
    {
      tag: t.projects.oidoo_tag,
      status: t.projects.oidoo_status,
      title: t.projects.oidoo_name,
      desc: t.projects.oidoo_tagline,
      stack: oidooStack,
      demoUrl: "https://www.oidoo.app",
      demoLabel: t.projects.oidoo_cta,
      screenshot: "/oidoo-screenshot.webp",
      host: "oidoo.app",
    },
    {
      tag: t.projects.freelance_tag,
      title: t.projects.fontaneria_name,
      desc: t.projects.fontaneria_desc,
      stack: freelanceStack,
      demoUrl: "https://fontaneria-urgente-lavapies.vercel.app",
      demoLabel: t.projects.freelance_demo,
      githubUrl: "https://github.com/mch-codes/fontaneria-urgente-lavapies",
      screenshot: "/fontaneria-screenshot.png",
      host: "fontaneria-urgente-lavapies.vercel.app",
    },
    {
      tag: t.projects.freelance_tag,
      title: t.projects.fisio_name,
      desc: t.projects.fisio_desc,
      stack: freelanceStack,
      demoUrl: "https://fisio-vitalia-landing.vercel.app",
      demoLabel: t.projects.freelance_demo,
      githubUrl: "https://github.com/mch-codes/fisio-vitalia-landing",
      screenshot: "/fisio-screenshot.png",
      host: "fisio-vitalia-landing.vercel.app",
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

        {/* Grid */}
        <div className="grid sm:grid-cols-3 gap-5">
          {projects.map((p, i) => (
            <m.div
              key={p.title}
              initial={{ opacity: 0, y: 32 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 + i * 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              className="rounded-2xl border border-border bg-card overflow-hidden flex flex-col hover:border-accent/40 transition-colors duration-300"
            >
              {/* Mini browser frame */}
              <div className="border-b border-border">
                <div className="flex items-center gap-2 px-3 py-2 bg-card">
                  <div className="flex gap-1 shrink-0">
                    <div className="w-2 h-2 rounded-full bg-border" />
                    <div className="w-2 h-2 rounded-full bg-border" />
                    <div className="w-2 h-2 rounded-full bg-border" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <span className="text-[11px] text-muted/50 font-mono truncate max-w-[70%]">{p.host}</span>
                  </div>
                </div>
                <a href={p.demoUrl} target="_blank" rel="noopener noreferrer" className="block relative overflow-hidden">
                  <img
                    src={p.screenshot}
                    alt={p.title}
                    width={1280}
                    height={800}
                    className="w-full object-cover object-top"
                    style={{ maxHeight: "180px" }}
                  />
                </a>
              </div>

              <div className="p-6 md:p-7 flex flex-col gap-4 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-muted bg-bg border border-border px-3 py-1.5 rounded-md whitespace-nowrap">
                    {p.tag}
                  </span>
                  {p.githubUrl ? (
                    <a
                      href={p.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 text-muted/60 hover:text-text transition-colors"
                      aria-label={`${p.title} — GitHub`}
                    >
                      <GitHubIcon />
                    </a>
                  ) : p.status ? (
                    <span className="text-xs text-accent/80 whitespace-nowrap">{p.status}</span>
                  ) : null}
                </div>

                <div>
                  <h3 className="text-base font-semibold text-text mb-1.5">{p.title}</h3>
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
                  {p.demoLabel}
                  <ArrowUpRight />
                </a>
              </div>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}
