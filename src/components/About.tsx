"use client";

import Image from "next/image";
import { m, useScroll, useTransform, useAnimationControls } from "framer-motion";
import { useRef, useEffect, useLayoutEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

function NetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let animId: number;

    const resize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    resize();

    const N = 80;
    const MAX_DIST = 160;
    const MOUSE_DIST = 160;
    const REPEL_STRENGTH = 7.0;
    const MIN_SPEED = 0.25;
    const MAX_SPEED = 1.6;
    const TARGET_FPS = 30;
    const FRAME_MS = 1000 / TARGET_FPS;

    interface Particle { x: number; y: number; vx: number; vy: number; r: number; angle: number }

    let W = canvas.width;
    let H = canvas.height;
    const mouse = { x: -9999, y: -9999 };
    let lastTime = 0;

    const particles: Particle[] = Array.from({ length: N }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.85,
      vy: (Math.random() - 0.5) * 0.85,
      r: Math.random() * 1.3 + 0.5,
      angle: Math.random() * Math.PI * 2,
    }));

    const onResize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      W = canvas.width;
      H = canvas.height;
    };
    window.addEventListener("resize", onResize);

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onMouseLeave = () => { mouse.x = -9999; mouse.y = -9999; };
    window.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);

    const LINE_COLOR_B = "rgba(16, 185, 129,";

    const draw = (timestamp: number) => {
      animId = requestAnimationFrame(draw);

      if (timestamp - lastTime < FRAME_MS) return;
      lastTime = timestamp;

      W = canvas.width;
      H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      for (const p of particles) {
        p.angle += (Math.random() - 0.5) * 0.12;
        p.vx += Math.cos(p.angle) * 0.025;
        p.vy += Math.sin(p.angle) * 0.025;

        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < MOUSE_DIST && mdist > 0) {
          const force = (1 - mdist / MOUSE_DIST) * REPEL_STRENGTH;
          p.vx += (mdx / mdist) * force * 0.06;
          p.vy += (mdy / mdist) * force * 0.06;
        }

        p.vx *= 0.98;
        p.vy *= 0.98;

        const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (spd < MIN_SPEED) {
          const s = spd > 0 ? spd : 1;
          p.vx = (p.vx / s) * MIN_SPEED;
          p.vy = (p.vy / s) * MIN_SPEED;
        } else if (spd > MAX_SPEED) {
          p.vx = (p.vx / spd) * MAX_SPEED;
          p.vy = (p.vy / spd) * MAX_SPEED;
        }

        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x += W;
        if (p.x > W) p.x -= W;
        if (p.y < 0) p.y += H;
        if (p.y > H) p.y -= H;
      }

      const MAX_DIST_SQ = MAX_DIST * MAX_DIST;
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distSq = dx * dx + dy * dy;
          if (distSq < MAX_DIST_SQ) {
            const t = 1 - Math.sqrt(distSq) / MAX_DIST;
            const alpha = (t * 0.42).toFixed(2);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `${LINE_COLOR_B} ${alpha})`;
            ctx.lineWidth = t * 0.9;
            ctx.stroke();
          }
        }
      }

      if (mouse.x > 0) {
        for (const p of particles) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE_DIST) {
            const t = 1 - dist / MOUSE_DIST;
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(p.x, p.y);
            ctx.strokeStyle = `rgba(16, 185, 129, ${(t * 0.5).toFixed(2)})`;
            ctx.lineWidth = t * 1.2;
            ctx.stroke();
          }
        }
      }

      ctx.fillStyle = "rgba(16, 185, 129, 0.75)";
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    animId = requestAnimationFrame(draw);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.75 }}
    />
  );
}

const stack = [
  {
    name: "HTML",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.412 4.41l.698 8.01h9.126l-.326 3.426-2.91.804-2.955-.81-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157H8.531z" />
      </svg>
    ),
    color: "#E34F26",
  },
  {
    name: "CSS",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm17.09 4.413L5.41 4.41l.213 2.622 10.125.002-.255 2.716h-6.64l.24 2.573h6.182l-.366 3.523-2.91.804-2.956-.81-.188-2.11h-2.61l.29 3.855L12 19.288l5.373-1.53L18.59 4.414z" />
      </svg>
    ),
    color: "#1572B6",
  },
  {
    name: "JavaScript",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z" />
      </svg>
    ),
    color: "#F7DF1E",
  },
  {
    name: "Supabase",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M21.362 9.354H12V.396a.396.396 0 0 0-.716-.233L2.203 12.424l-.401.562a1.04 1.04 0 0 0 .836 1.659H12v8.959a.396.396 0 0 0 .716.233l9.081-12.261.401-.562a1.04 1.04 0 0 0-.836-1.66z" />
      </svg>
    ),
    color: "#3ecf8e",
  },
  {
    name: "GitHub",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
    color: "#ffffff",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.22 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

export default function About() {
  const { t, language } = useLanguage();
  const controls = useAnimationControls();
  const animationPlayed = useRef(false);

  useLayoutEffect(() => {
    if (!animationPlayed.current) {
      animationPlayed.current = true;
      controls.start("visible");
    }
  }, [controls]);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const { scrollY } = useScroll();
  const vh = typeof window !== "undefined" ? window.innerHeight : 700;
  const opacity = useTransform(scrollY, [vh * 0.6, vh * 1.2], isMobile ? [1, 1] : [1, 0]);
  const y = useTransform(scrollY, [0, vh], ["0%", isMobile ? "0%" : "15%"]);

  return (
    <section id="about" className="relative min-h-screen flex flex-col overflow-hidden">
      <NetworkCanvas />
      <m.div
        style={{ y, opacity }}
        className="relative z-10 flex-1 flex items-center max-w-6xl mx-auto px-6 pt-24 pb-10 w-full"
      >
        <m.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="w-full grid md:grid-cols-2 gap-16 md:gap-20 items-center"
        >
          {/* Left: text content */}
          <div className="flex flex-col gap-7">
            <m.div variants={itemVariants}>
              <span
                className="inline-flex items-center gap-2 px-3 py-1.5 text-xs text-emerald-400"
                style={{
                  fontFamily: "var(--font-mono)",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                }}
              >
                <span className="opacity-40">[</span>
                <span className="relative flex h-2 w-2 flex-shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 bg-emerald-500" />
                </span>
                {t.hero.available}
                <span className="opacity-40">]</span>
              </span>
            </m.div>

            <m.div variants={itemVariants}>
              <h1 className="text-5xl md:text-6xl font-bold text-text tracking-tight leading-[1.05]">
                Marcin<br />Chrzuszcz
              </h1>
              <p className="text-base text-muted mt-3">{t.about.subtitle}</p>
            </m.div>

            <m.div variants={itemVariants} className="pt-1 border-t border-border">
              <p className="text-xl md:text-2xl font-semibold text-text leading-snug mt-5">
                {t.about.tagline1}<br />
                <span className="text-accent">{t.about.tagline2}</span>.
              </p>
            </m.div>

            <m.div variants={itemVariants} className="space-y-4 text-muted leading-relaxed">
              <p>{t.about.p1}</p>
              <p>{t.about.p2}</p>
              <p>{t.about.p3}</p>
            </m.div>
          </div>

          {/* Right: photo + stack pills */}
          <div className="flex flex-col items-center gap-8">
            <m.div variants={itemVariants}>
              <div className="w-60 h-60 md:w-72 md:h-72 rounded-2xl overflow-hidden border border-border shadow-2xl">
                <Image
                  src="https://avatars.githubusercontent.com/u/141457529?v=4&s=512"
                  alt="Marcin Chrzuszcz"
                  width={512}
                  height={512}
                  quality={90}
                  priority
                  className="w-full h-full object-cover"
                />
              </div>
            </m.div>

            <m.div variants={itemVariants} className="w-full">
              <p className="text-[10px] font-mono tracking-widest text-muted/50 uppercase mb-3 text-center">
                {t.about.stack}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {stack.map((tech) => (
                  <div
                    key={tech.name}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card border border-border text-xs font-medium text-muted hover:border-border-light hover:text-text transition-all duration-200 cursor-default"
                  >
                    <span style={{ color: tech.color }} className="opacity-80 shrink-0">
                      {tech.icon}
                    </span>
                    {tech.name}
                  </div>
                ))}
              </div>
            </m.div>

            <m.div variants={itemVariants} className="w-full flex justify-center">
              <a
                href={language === "es" ? "/CV document ES .pdf" : "/CV document EN.pdf"}
                download
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm text-muted border border-border hover:border-accent hover:text-accent transition-all duration-200"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M7 1v8M4 6l3 3 3-3M2 11h10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {t.about.cv_download}
              </a>
            </m.div>
          </div>
        </m.div>
      </m.div>
    </section>
  );
}
