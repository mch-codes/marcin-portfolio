"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { m, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
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

  // almenos1minuto leads, then Hebras — client work before product. Oidoo closes as credibility rather than as
  // the headline: it says the code holds up, not that you should buy it.
  const projects: ProjectCard[] = [
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
      gallery: [desktop("oidoo"), desktop("oidoo-funcionalidades"), desktop("oidoo-precio"), phone("oidoo-mobile")],
    },
  ];

  const [open, setOpen] = useState<ProjectCard | null>(null);

  return (
    <section id="projects" className="pt-20 md:pt-24 pb-20 md:pb-24 relative">
      <SectionHeader word={t.projects.headline} />

      <div className="px-6 md:px-16">
        <ProjectIndex projects={projects} onOpen={setOpen} />
      </div>

      {open && <ProjectModal project={open} onClose={() => setOpen(null)} />}
    </section>
  );
}

/**
 * The work as a typographic index: one hairline row per project, the name
 * set large, and on desktop the screenshot rides the cursor while a row is
 * hovered. Same hairline-and-mono vocabulary as the Services line items.
 *
 * The preview only appears for a real mouse (pointerType check), so touch
 * never gets a stuck image; phones get the screenshot inline in the row
 * instead. Hover follows the site rule: the list dims to muted and the row
 * under the cursor stays at full text.
 */
function ProjectIndex({ projects, onOpen }: { projects: ProjectCard[]; onOpen: (p: ProjectCard) => void }) {
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState<number | null>(null);

  // Raw pointer position, plus a sprung copy so the image trails the cursor
  // instead of being glued to it. Reduced motion uses the raw values.
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const spring = { stiffness: 300, damping: 30, mass: 0.6 };
  const sx = useSpring(x, spring);
  const sy = useSpring(y, spring);

  return (
    <>
      <ul
        className="group/list mt-24 md:mt-32 border-t border-border"
        onPointerMove={(e) => {
          if (e.pointerType !== "mouse") return;
          x.set(e.clientX);
          y.set(e.clientY);
        }}
        onPointerLeave={() => setActive(null)}
      >
        {projects.map((p, i) => (
          <li
            key={p.title}
            onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
            className="group border-b border-border text-text transition-colors duration-300 group-hover/list:text-muted hover:text-text!"
          >
            {/* Reveal is inside the li (a ul may only hold li). Its transform
                makes it the containing block for the button's after:inset-0,
                which is why the row padding lives here — so the hit area is
                the whole row. */}
            {/* Three layouts. Phone: one column. md: name and description
                left, link right. xl: number, name, description, link — below
                1280px the fixed side columns leave the name too little room.
                (Media queries read rem at the browser's 16px, not the 20.8px
                root, so md/xl are the usual 768/1280.)
                Fixed side columns so description and link line up row to row;
                minmax(0,1fr) so a long name can't widen its row past the page. */}
            <Reveal
              delay={i * 0.1}
              className="relative grid md:grid-cols-[minmax(0,1fr)_auto] xl:grid-cols-[3rem_minmax(0,1fr)_18rem_8rem] items-baseline md:gap-x-10 py-8 xl:py-10"
            >
              <span className="hidden xl:block font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>

              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-muted">
                  <span className="xl:hidden">{String(i + 1).padStart(2, "0")} · </span>
                  {p.tag}
                </p>
                {/* The button carries the row's hit area (after:inset-0), so the
                    heading stays a real h3 — a button can't hold one.
                    Sized in vw between two caps per layout: "almenos1minuto"
                    is 14 characters and has to fit a 390px phone, the md
                    column at 768px and the xl column at 1280px. */}
                <h3 className="mt-2 text-[clamp(1.75rem,8.5vw,3.75rem)] md:text-[clamp(2.5rem,6vw,3.75rem)] xl:text-[clamp(2.5rem,4vw,3.75rem)] font-bold tracking-tighter leading-none">
                  {/* The slide lives on the inner span, not the button: a
                      transform would make the button the containing block
                      for its own ::after and shrink the hit area to the name. */}
                  <button
                    type="button"
                    onClick={() => onOpen(p)}
                    className="text-left after:absolute after:inset-0 cursor-pointer focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-accent"
                  >
                    <span className="inline-block transition-transform duration-500 ease-out group-hover:translate-x-3 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0">
                      {p.title}
                    </span>
                  </button>
                </h3>
              </div>

              <p className="mt-4 xl:mt-0 md:col-start-1 md:row-start-2 xl:col-start-auto xl:row-start-auto text-sm text-muted leading-relaxed max-w-md">{p.desc}</p>

              {/* Lifted above the row's hit area so it goes to the live site
                  rather than opening the gallery. Leads by size and weight. */}
              <a
                href={p.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 justify-self-start md:justify-self-end md:col-start-2 md:row-start-1 xl:col-start-auto xl:row-start-auto inline-flex items-center gap-1.5 mt-3 md:mt-0 py-2.5 text-base font-semibold whitespace-nowrap underline-offset-4 hover:underline"
              >
                {p.demoLabel}
                <ArrowUpRight />
              </a>

              {/* Below md (phones, small tablets — touch) there's no hover to
                  drive the preview, so the screenshot sits in the row. */}
              <Image
                src={p.screenshot}
                alt=""
                width={1280}
                height={800}
                sizes="(max-width: 767px) 100vw, 1px"
                className="md:hidden mt-6 w-full aspect-[16/10] object-cover object-top"
              />
            </Reveal>
          </li>
        ))}
      </ul>

      {/* The floating preview. Fixed to the viewport and fed clientX/Y, so
          scrolling never desyncs it; pointer-events-none so it can't steal
          the hover from the row beneath. All three shots are mounted and
          cross-fade, which keeps the swap instant once they've loaded. */}
      <m.div
        aria-hidden
        style={{ x: reducedMotion ? x : sx, y: reducedMotion ? y : sy }}
        className="hidden md:block pointer-events-none fixed top-0 left-0 z-40"
      >
        <m.div
          initial={false}
          animate={{ opacity: active === null ? 0 : 1, scale: active === null ? 0.9 : 1 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="relative -translate-x-1/2 -translate-y-1/2 w-[22rem] aspect-[16/10] overflow-hidden"
        >
          {projects.map((p, i) => (
            <Image
              key={p.screenshot}
              src={p.screenshot}
              alt=""
              fill
              sizes="22rem"
              className={`object-cover object-top transition-opacity duration-300 ${active === i ? "opacity-100" : "opacity-0"}`}
            />
          ))}
        </m.div>
      </m.div>
    </>
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
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-text transition-colors duration-200"
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
