"use client";

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { SectionHeader, Reveal } from "@/components/Section";

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

  // Hebras leads — it is the niche this site sells to, so the case study a
  // maker recognises comes first. Oidoo follows as credibility rather than as
  // the headline: it says the code holds up, not that you should buy it.
  const featured: ProjectCard[] = [
    {
      tag: t.projects.client_tag,
      status: t.projects.oidoo_status,
      title: t.projects.hebras_name,
      desc: t.projects.hebras_desc,
      stack: freelanceStack,
      demoUrl: "https://hebras-lemon.vercel.app",
      demoLabel: t.projects.client_cta,
      githubUrl: "https://github.com/mch-codes/hebras",
      screenshot: "/hebras-screenshot.webp",
    },
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
  ];

  // Other sectors. Kept, but folded away — they dilute the niche if they sit
  // in the same run as the two above.
  const others: ProjectCard[] = [
    {
      tag: t.projects.freelance_tag,
      title: t.projects.fontaneria_name,
      desc: t.projects.fontaneria_desc,
      stack: freelanceStack,
      demoUrl: "https://fontaneria-urgente-lavapies.vercel.app",
      demoLabel: t.projects.freelance_demo,
      githubUrl: "https://github.com/mch-codes/fontaneria-urgente-lavapies",
      screenshot: "/fontaneria-screenshot.webp",
    },
    {
      tag: t.projects.freelance_tag,
      title: t.projects.fisio_name,
      desc: t.projects.fisio_desc,
      stack: freelanceStack,
      demoUrl: "https://fisio-vitalia-landing.vercel.app",
      demoLabel: t.projects.freelance_demo,
      githubUrl: "https://github.com/mch-codes/fisio-vitalia-landing",
      screenshot: "/fisio-screenshot.webp",
    },
    {
      tag: t.projects.freelance_tag,
      title: t.projects.taberna_name,
      desc: t.projects.taberna_desc,
      stack: freelanceStack,
      demoUrl: "https://taberna-el-fogon-landing.vercel.app",
      demoLabel: t.projects.freelance_demo,
      githubUrl: "https://github.com/mch-codes/taberna-el-fogon-landing",
      screenshot: "/taberna-screenshot.webp",
    },
  ];

  // No `overflow-hidden` on this section, unlike its neighbours: an
  // overflow-clipped ancestor kills position:sticky on the header below.
  return (
    <section id="projects" className="pt-20 md:pt-24 pb-32 md:pb-48 relative">
      {/*
        The wordmark pins to the middle of the viewport and stays there for the
        length of the section while the cards ride up over it. `top-1/2` is
        where sticky catches; the translate then lifts it by half its own
        height, which sticky ignores when it measures — so the two together
        centre it.

        No background fill and no z-index on purpose: the cards below carry
        `z-10` and paint over the letterforms, which is the whole effect. Give
        this block an opaque bg and the cards slide under it like a shelf
        instead.
      */}
      <div className="sticky top-1/2 -translate-y-1/2">
        <SectionHeader word={t.projects.headline} />
      </div>

      {/* One card per row, and a screen's worth of air between them, so only
          one is ever over the wordmark at a time. They alternate gutters
          rather than sitting centred, so each covers a different part of the
          word on its way past. */}
      <div className="relative z-10 px-6 md:px-16">
        <ProjectList projects={featured} />

        {/* Native <details>: the whole point is that these are secondary, and
            a disclosure element says so with no state, no JS and no
            accessibility work of our own. The cards inside are the same
            component — folding them away is the deprioritisation. */}
        <details className="mt-28 md:mt-40">
          <summary className="cursor-pointer marker:text-muted text-xs font-mono tracking-widest text-muted uppercase hover:text-text transition-colors">
            {t.projects.others}
          </summary>
          <ProjectList projects={others} />
        </details>
      </div>
    </section>
  );
}

function ProjectList({ projects }: { projects: ProjectCard[] }) {
  return (
    <div className="mt-16 md:mt-24 flex flex-col gap-28 md:gap-40">
      {projects.map((p, i) => {
            // Odd cards hang on the right gutter. Below md there's no room to
            // offset anything, so both settle back to centred.
            const side = i % 2 === 0
              ? { self: "md:self-start", items: "md:items-start", text: "md:text-left" }
              : { self: "md:self-end", items: "md:items-end", text: "md:text-right" };

            return (
            <Reveal
              key={p.title}
              className={`group relative w-full md:max-w-2xl flex flex-col items-center text-center ${side.self} ${side.items} ${side.text}`}
            >
              {/* next/image, not <img>: Vercel then serves a resized AVIF/WebP
                  instead of the full-size PNG. Card caps at max-w-3xl, so
                  `sizes` can be honest about it. */}
              <div className="w-full">
                <Image
                  src={p.screenshot}
                  alt={p.title}
                  width={1280}
                  height={800}
                  sizes="(max-width: 768px) 100vw, 48rem"
                  className="w-full aspect-[16/10] object-cover object-top"
                />
              </div>

              {/* Deliberately unfilled: the wordmark reads through the caption
                  as the card passes over it. ponytail: costs legibility where
                  the two cross — put bg-bg back if that bothers you. */}
              <div className={`w-full pt-8 pb-2 flex flex-col items-center ${side.items}`}>
                <p className="text-xs font-mono tracking-widest text-muted uppercase">
                  {p.tag}
                  {p.status ? ` · ${p.status}` : ""}
                </p>
                <h3 className="mt-4 text-2xl md:text-3xl font-bold text-text tracking-tight leading-tight">{p.title}</h3>
                <p className="mt-4 text-base text-muted leading-relaxed max-w-md">{p.desc}</p>
                <p className="mt-5 text-sm text-muted">{p.stack.join(" · ")}</p>

                <div className="mt-5 flex items-center gap-6">
                <a
                  href={p.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors duration-200 group-hover:text-accent group-focus-within:text-accent after:absolute after:inset-0"
                >
                  {p.demoLabel}
                  <span className="transition-transform duration-200 group-hover:translate-x-1">
                    <ArrowUpRight />
                  </span>
                </a>
                {p.githubUrl && (
                  <a
                    href={p.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative z-10 text-muted hover:text-text transition-colors"
                    aria-label={`${p.title} — GitHub`}
                  >
                    <GitHubIcon />
                  </a>
                  )}
                </div>
              </div>
            </Reveal>
            );
          })}
    </div>
  );
}
