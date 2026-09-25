"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { SectionHeader, Reveal } from "@/components/Section";
import { lockScroll } from "@/lib/scroll";

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

// Captured by `npm run shot` (see scripts/screenshot.mjs): desktop shots at
// 1280x800, the phone shot at 390x844.
const desktop = (name: string) => ({ src: `/${name}-screenshot.webp`, width: 1280, height: 800 });
const phone = (name: string) => ({ src: `/${name}-screenshot.webp`, width: 390, height: 844 });
type Shot = ReturnType<typeof desktop>;

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
  forWho: string;
  built: string;
  gallery: Shot[];
};

export default function Projects() {
  const { t } = useLanguage();

  // Hebras leads — it is the niche this site sells to, so the case study a
  // maker recognises comes first, client work before product. Oidoo closes as credibility rather than as
  // the headline: it says the code holds up, not that you should buy it.
  const projects: ProjectCard[] = [
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
      forWho: t.projects.hebras_for,
      built: t.projects.hebras_built,
      gallery: [desktop("hebras"), desktop("hebras-coleccion"), desktop("hebras-contacto"), phone("hebras-mobile")],
    },
    {
      tag: t.projects.client_tag,
      status: t.projects.oidoo_status,
      title: t.projects.almenos_name,
      desc: t.projects.almenos_desc,
      stack: freelanceStack,
      demoUrl: "https://almenos1minuto.vercel.app",
      demoLabel: t.projects.client_cta,
      screenshot: "/almenos1minuto-screenshot.webp",
      forWho: t.projects.almenos_for,
      built: t.projects.almenos_built,
      gallery: [
        desktop("almenos1minuto"),
        desktop("almenos1minuto-coleccion"),
        desktop("almenos1minuto-pieza"),
        desktop("almenos1minuto-prensa"),
        phone("almenos1minuto-mobile"),
      ],
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
      forWho: t.projects.oidoo_for,
      built: t.projects.oidoo_built,
      gallery: [desktop("oidoo"), desktop("oidoo-funcionalidades"), desktop("oidoo-precios"), phone("oidoo-mobile")],
    },
  ];

  const [open, setOpen] = useState<ProjectCard | null>(null);

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

        No background fill and no z-index on purpose: the cards are the later
        sibling, so they paint over the letterforms, which is the whole
        effect. Give this block an opaque bg and the cards slide under it
        like a shelf instead — and an opaque bg would also be the backdrop
        the captions blend against, which is the wordmark's other job here.
      */}
      <div className="sticky top-1/2 -translate-y-1/2">
        <SectionHeader word={t.projects.headline} />
      </div>

      {/* One card per row, and a screen's worth of air between them, so only
          one is ever over the wordmark at a time. They alternate gutters
          rather than sitting centred, so each covers a different part of the
          word on its way past.
          No z-index, deliberately: z-10 here made this an isolating stacking
          context, which cut the captions' mix-blend-difference off from the
          wordmark it needs to blend against. Both this and the sticky
          wordmark are positioned at z-auto, so paint order falls back to DOM
          order — and the cards are second. */}
      <div className="relative px-6 md:px-16">
        <ProjectList projects={projects} onOpen={setOpen} openLabel={t.projects.open_cta} />
      </div>

      {open && <ProjectModal project={open} onClose={() => setOpen(null)} />}
    </section>
  );
}

function ProjectList({
  projects,
  onOpen,
  openLabel,
}: {
  projects: ProjectCard[];
  onOpen: (p: ProjectCard) => void;
  openLabel: string;
}) {
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
              {/* overflow-hidden so the hover scale crops instead of pushing
                  the caption around. The whole card is one hit area (the demo
                  link's after:inset-0), so the zoom reads as its affordance. */}
              <div className="w-full overflow-hidden">
                <Image
                  src={p.screenshot}
                  alt={p.title}
                  width={1280}
                  height={800}
                  sizes="(max-width: 768px) 100vw, 48rem"
                  className="w-full aspect-[16/10] object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.02] group-focus-within:scale-[1.02] motion-reduce:group-hover:scale-100 motion-reduce:group-focus-within:scale-100"
                />
              </div>

              {/* Deliberately unfilled: the wordmark reads through the caption
                  as the card passes over it. */}
              <div className={`w-full pt-8 pb-2 flex flex-col items-center ${side.items}`}>
                {/* The type inverts itself against whatever it is over.
                    `difference` gives |backdrop - source|, so the near-white
                    -diff tokens come out black on the page and white on the
                    wordmark — no measuring, no scroll listener, and it
                    tracks the letterforms hole by hole. See globals.css for
                    why these can't just be text/muted pre-inverted.
                    Blending only reaches out to the nearest isolating
                    ancestor, which is why the wrapper below dropped its
                    z-10. The link row stays outside this block: it hovers to
                    accent green, and difference would invert that too. */}
                <div className={`flex flex-col mix-blend-difference ${side.items}`}>
                  <p className="text-xs font-mono tracking-widest text-muted-diff uppercase">
                    {p.tag}
                    {p.status ? ` · ${p.status}` : ""}
                  </p>
                  <h3 className="mt-4 text-2xl md:text-3xl font-bold text-text-diff tracking-tight leading-tight">{p.title}</h3>
                  <p className="mt-4 text-base text-muted-diff leading-relaxed max-w-md">{p.desc}</p>
                  <p className="mt-5 text-sm text-muted-diff">{p.stack.join(" · ")}</p>
                </div>

                <div className="mt-5 flex items-center gap-6">
                {/* The whole card opens the gallery; the live site is one
                    click further, inside the modal. */}
                <button
                  type="button"
                  onClick={() => onOpen(p)}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors duration-200 group-hover:text-accent group-focus-within:text-accent after:absolute after:inset-0 cursor-pointer"
                >
                  {openLabel}
                  <span className="transition-transform duration-200 group-hover:translate-x-1">
                    <ArrowUpRight />
                  </span>
                </button>
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

function ProjectModal({ project: p, onClose }: { project: ProjectCard; onClose: () => void }) {
  const { t } = useLanguage();
  const ref = useRef<HTMLDialogElement>(null);

  // Native <dialog>: showModal() brings the backdrop, Esc, focus trapping and
  // the inert page for free. Lenis gets stopped so the page behind stays put.
  useEffect(() => {
    ref.current?.showModal();
    lockScroll(true);
    return () => lockScroll(false);
  }, []);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      // A click on the dialog element itself (not its content) is the backdrop.
      onClick={(e) => e.target === e.currentTarget && ref.current?.close()}
      aria-label={p.title}
      className="m-0 md:m-auto w-full max-w-none h-full max-h-none md:max-w-5xl md:h-auto md:max-h-[90vh] bg-bg text-text backdrop:bg-black/70 overscroll-contain"
    >
      <div data-lenis-prevent className="h-full md:max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 px-6 md:px-10 py-4 bg-bg border-b border-border">
          <div>
            <p className="text-xs font-mono tracking-widest text-muted uppercase">
              {p.tag}
              {p.status ? ` · ${p.status}` : ""}
            </p>
            <h3 className="mt-1 text-xl md:text-2xl font-bold tracking-tight">{p.title}</h3>
          </div>
          <button
            type="button"
            onClick={() => ref.current?.close()}
            className="shrink-0 whitespace-nowrap min-h-[44px] px-3 text-sm font-medium text-muted hover:text-text transition-colors cursor-pointer"
          >
            {t.projects.close} ✕
          </button>
        </div>

        {/* Swipe on touch, shift-wheel or trackpad on desktop. Every shot is
            the same height, so the phone one sits in the row as a phone. */}
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-6 md:px-10 py-6 scroll-px-6 md:scroll-px-10">
          {p.gallery.map((shot, i) => (
            <Image
              key={shot.src}
              src={shot.src}
              alt={`${p.title} — ${i + 1}/${p.gallery.length}`}
              width={shot.width}
              height={shot.height}
              sizes="(max-width: 768px) 90vw, 40rem"
              className="snap-start shrink-0 h-56 sm:h-72 md:h-80 w-auto border border-border"
            />
          ))}
        </div>

        <dl className="px-6 md:px-10 pb-8 grid gap-5 md:grid-cols-[10rem_1fr] md:gap-x-8 text-base leading-relaxed">
          <dt className="text-xs font-mono tracking-widest text-muted uppercase md:pt-1">{t.projects.for_label}</dt>
          <dd className="-mt-3 md:mt-0">{p.forWho}</dd>
          <dt className="text-xs font-mono tracking-widest text-muted uppercase md:pt-1">{t.projects.built_label}</dt>
          <dd className="-mt-3 md:mt-0">{p.built}</dd>
          <dt className="text-xs font-mono tracking-widest text-muted uppercase md:pt-1">{t.projects.stack_label}</dt>
          <dd className="-mt-3 md:mt-0">{p.stack.join(" · ")}</dd>
        </dl>

        <div className="px-6 md:px-10 pb-10 flex items-center gap-6">
          <a
            href={p.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
          >
            {p.demoLabel}
            <ArrowUpRight />
          </a>
          {p.githubUrl && (
            <a
              href={p.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-text transition-colors"
              aria-label={`${p.title} — GitHub`}
            >
              <GitHubIcon />
            </a>
          )}
        </div>
      </div>
    </dialog>
  );
}
