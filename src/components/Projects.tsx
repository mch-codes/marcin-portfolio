"use client";

import { useLanguage } from "@/context/LanguageContext";
import { SectionHeader, SlideIn } from "@/components/Section";

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
};

export default function Projects() {
  const { t } = useLanguage();

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
    },
    {
      tag: t.projects.freelance_tag,
      title: t.projects.taberna_name,
      desc: t.projects.taberna_desc,
      stack: freelanceStack,
      demoUrl: "https://taberna-el-fogon-landing.vercel.app",
      demoLabel: t.projects.freelance_demo,
      githubUrl: "https://github.com/mch-codes/taberna-el-fogon-landing",
      screenshot: "/taberna-screenshot.png",
    },
  ];

  return (
    <section id="projects" className="py-28 md:py-40 relative overflow-hidden">
      <SectionHeader word={t.projects.headline} />

      <div className="max-w-6xl mx-auto px-6">
        <div className="mt-24 md:mt-32 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20">
          {projects.map((p) => (
            <SlideIn
              key={p.title}
              from="left"
              className="relative flex flex-col items-center text-center"
            >
              <img
                src={p.screenshot}
                alt={p.title}
                width={1280}
                height={800}
                className="w-full object-cover object-top"
                style={{ maxHeight: "220px" }}
              />

              <p className="mt-8 text-xs font-mono tracking-widest text-muted/60 uppercase">
                {p.tag}
                {p.status ? ` · ${p.status}` : ""}
              </p>
              <h3 className="mt-4 text-2xl font-bold text-text tracking-tight leading-tight">{p.title}</h3>
              <p className="mt-4 text-base text-muted leading-relaxed max-w-sm">{p.desc}</p>
              <p className="mt-5 text-sm text-muted">{p.stack.join(" · ")}</p>

              <div className="mt-5 flex items-center gap-6">
                <a
                  href={p.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-text hover:text-muted transition-colors after:absolute after:inset-0"
                >
                  {p.demoLabel}
                  <ArrowUpRight />
                </a>
                {p.githubUrl && (
                  <a
                    href={p.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative z-10 text-muted/60 hover:text-text transition-colors"
                    aria-label={`${p.title} — GitHub`}
                  >
                    <GitHubIcon />
                  </a>
                )}
              </div>
            </SlideIn>
          ))}
        </div>
      </div>
    </section>
  );
}
