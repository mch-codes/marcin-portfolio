"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useRef, useEffect } from "react";
import { scrollToSection } from "@/lib/scroll";

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

    let animId: number;

    const resize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const N = 130;
    const MAX_DIST = 200;
    const MOUSE_DIST = 160;
    const REPEL_STRENGTH = 4.5;
    const MIN_SPEED = 0.3;
    const MAX_SPEED = 2.2;

    interface Particle { x: number; y: number; vx: number; vy: number; r: number; angle: number }

    let W = canvas.width;
    let H = canvas.height;
    const mouse = { x: -9999, y: -9999 };

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
    window.removeEventListener("resize", resize);
    window.addEventListener("resize", onResize);

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onMouseLeave = () => { mouse.x = -9999; mouse.y = -9999; };
    window.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);

    const draw = () => {
      W = canvas.width;
      H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      for (const p of particles) {
        // wander: slowly steer each particle in a drifting direction
        p.angle += (Math.random() - 0.5) * 0.12;
        p.vx += Math.cos(p.angle) * 0.025;
        p.vy += Math.sin(p.angle) * 0.025;

        // repel from mouse
        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < MOUSE_DIST && mdist > 0) {
          const force = (1 - mdist / MOUSE_DIST) * REPEL_STRENGTH;
          p.vx += (mdx / mdist) * force * 0.06;
          p.vy += (mdy / mdist) * force * 0.06;
        }
        // dampen
        p.vx *= 0.98;
        p.vy *= 0.98;

        // enforce min speed so particles never stop
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

      // lines between particles
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const t = 1 - dist / MAX_DIST;
            const grad = ctx.createLinearGradient(
              particles[i].x, particles[i].y,
              particles[j].x, particles[j].y
            );
            grad.addColorStop(0, `rgba(0, 210, 255, ${t * 0.42})`);
            grad.addColorStop(1, `rgba(232, 149, 109, ${t * 0.42})`);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = grad;
            ctx.lineWidth = t * 0.9;
            ctx.stroke();
          }
        }
      }

      // lines from mouse to nearby particles
      if (mouse.x > 0) {
        for (const p of particles) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE_DIST) {
            const t = 1 - dist / MOUSE_DIST;
            const grad = ctx.createLinearGradient(mouse.x, mouse.y, p.x, p.y);
            grad.addColorStop(0, `rgba(200, 169, 110, ${t * 0.7})`);
            grad.addColorStop(1, `rgba(232, 149, 109, ${t * 0.4})`);
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(p.x, p.y);
            ctx.strokeStyle = grad;
            ctx.lineWidth = t * 1.2;
            ctx.stroke();
          }
        }
      }

      for (const p of particles) {
        ctx.shadowBlur = 8;
        ctx.shadowColor = "rgba(232, 149, 109, 0.9)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(232, 149, 109, 0.85)";
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
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
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center overflow-hidden">
      <NetworkCanvas />
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-20 w-full"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl"
        >
          <motion.p
            variants={itemVariants}
            className="text-sm font-mono text-muted/60 tracking-wide mb-6"
          >
            Marcin Chrzuszcz
          </motion.p>

          {IS_AVAILABLE && (
            <motion.div variants={itemVariants} className="mb-10">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                {t.hero.available}
              </span>
            </motion.div>
          )}

          <motion.h1
            variants={itemVariants}
            className="text-5xl sm:text-6xl md:text-7xl font-bold text-text leading-[1.05] tracking-tight mb-4"
          >
            {t.hero.headline}
          </motion.h1>

          <motion.h1
            variants={itemVariants}
            className="text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.05] tracking-tight mb-10"
            style={{
              background: "linear-gradient(135deg, #e8956d 0%, #c8a96e 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {t.hero.headline2}
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-muted leading-relaxed max-w-xl mb-12"
          >
            {t.hero.subtext}
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center gap-4"
          >
            <button
              onClick={() => scrollToSection("projects")}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-base text-[#0d0b08] transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, #e8956d 0%, #c8a96e 100%)",
                boxShadow: "0 6px 32px rgba(232,149,109,0.35)",
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
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
