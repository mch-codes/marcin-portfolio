"use client";

import { m, useScroll, useTransform, useAnimationControls } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useRef, useLayoutEffect } from "react";
import { scrollToSection } from "@/lib/scroll";
import TechScroll from "@/components/TechScroll";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
};

function NetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Skip animation entirely for users who prefer reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let animId: number;

    const resize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    resize();

    const N = 42;
    const MAX_DIST = 140;
    const MOUSE_DIST = 130;
    const REPEL_STRENGTH = 4.0;
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

    // Pre-allocate color strings to avoid repeated string allocation per frame
    const LINE_COLOR_A = "rgba(52, 211, 153,";
    const LINE_COLOR_B = "rgba(16, 185, 129,";

    const draw = (timestamp: number) => {
      animId = requestAnimationFrame(draw);

      // Cap to TARGET_FPS — skip frame if too soon
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

      // Particle-to-particle lines — O(N²/2), N=42 → 861 pairs vs 8,385 at N=130
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

      // Mouse lines
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

      // Particles — skip shadowBlur (expensive GPU op)
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
      style={{ opacity: 0.55 }}
    />
  );
}

// Toggle this to show/hide the availability badge
const IS_AVAILABLE = true;

export default function Hero() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const controls = useAnimationControls();
  const animationPlayed = useRef(false);

  useLayoutEffect(() => {
    if (!animationPlayed.current) {
      animationPlayed.current = true;
      controls.start("visible");
    }
  }, [controls]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={sectionRef} className="relative min-h-screen flex flex-col overflow-hidden">
      <NetworkCanvas />
      <m.div
        style={{ y, opacity }}
        className="relative z-10 flex-1 flex items-center max-w-6xl mx-auto px-6 pt-24 pb-10 w-full"
      >
        <m.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="max-w-3xl"
        >
          <m.p
            variants={itemVariants}
            className="text-sm font-mono text-muted/60 tracking-wide mb-6"
          >
            Marcin Chrzuszcz
          </m.p>

          {IS_AVAILABLE && (
            <m.div variants={itemVariants} className="mb-10">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                {t.hero.available}
              </span>
            </m.div>
          )}

          <m.h1
            variants={itemVariants}
            className="text-5xl sm:text-6xl md:text-7xl font-bold text-text leading-[1.05] tracking-tight mb-4"
          >
            {t.hero.headline}
          </m.h1>

          <m.h1
            variants={itemVariants}
            className="text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.05] tracking-tight mb-10"
            style={{
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {t.hero.headline2}
          </m.h1>

          <m.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-muted leading-relaxed max-w-xl mb-12"
          >
            {t.hero.subtext}
          </m.p>

          <m.div
            variants={itemVariants}
            className="flex flex-wrap items-center gap-4"
          >
            <button
              onClick={() => scrollToSection("projects")}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-base text-white transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                boxShadow: "0 6px 32px rgba(16,185,129,0.35)",
              }}
            >
              {t.hero.cta_projects}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M2 7h10M8 3l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <button
              onClick={() => scrollToSection("contact")}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-medium text-sm text-muted border border-border hover:border-border-light hover:text-text transition-all duration-200"
            >
              {t.hero.cta_contact}
            </button>
          </m.div>
        </m.div>
      </m.div>
      <div className="relative z-10">
        <TechScroll />
      </div>
    </section>
  );
}
