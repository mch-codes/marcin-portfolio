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
    name: "Next.js",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 0 1-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 0 1 .174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 0 0 4.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 0 0 2.466-2.163 11.944 11.944 0 0 0 2.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.859-8.292-8.208-9.695a12.597 12.597 0 0 0-2.499-.523A33.119 33.119 0 0 0 11.573 0zm4.069 7.217c.347 0 .408.005.486.047a.473.473 0 0 1 .237.277c.018.06.023 1.365.018 4.304l-.006 4.218-.744-1.14-.746-1.14v-3.066c0-1.982.01-3.097.023-3.15a.478.478 0 0 1 .233-.296c.096-.05.13-.054.5-.054z" />
      </svg>
    ),
    color: "#ffffff",
  },
  {
    name: "TypeScript",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" />
      </svg>
    ),
    color: "#3178C6",
  },
  {
    name: "React",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38a2.167 2.167 0 0 0-1.092-.278zm-.005 1.09c.266.15.499.513.708 1.062.291.773.497 1.869.583 3.098C16.573 6.444 14.77 5.9 12.99 5.9c-1.782 0-3.586.544-5.165 1.564.087-1.23.293-2.326.584-3.099.208-.549.44-.912.706-1.063.285-.164.73-.124 1.301.237C11.55 4.253 12.302 4.74 13 4.74c.698 0 1.45-.487 2.584-1.2.57-.36 1.016-.401 1.3-.237zm-.073 18.543c-.285.164-.73.125-1.301-.236-1.134-.714-1.887-1.2-2.585-1.2-.698 0-1.45.486-2.584 1.2-.571.36-1.016.4-1.3.236-.265-.15-.498-.513-.708-1.062-.291-.774-.497-1.869-.583-3.099 1.58 1.02 3.384 1.564 5.165 1.564 1.782 0 3.585-.545 5.165-1.564-.086 1.23-.292 2.325-.583 3.099-.208.549-.44.912-.706 1.062zm-.003-4.254c-1.12.621-2.415.97-3.715.97-1.3 0-2.594-.35-3.713-.97-1.175-.651-2.173-1.6-2.748-2.741.575-1.141 1.573-2.09 2.748-2.741 1.119-.62 2.413-.97 3.713-.97 1.3 0 2.594.35 3.715.97 1.174.651 2.172 1.6 2.747 2.74-.575 1.142-1.573 2.09-2.747 2.742z" />
      </svg>
    ),
    color: "#61DAFB",
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
    name: "Tailwind",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" />
      </svg>
    ),
    color: "#38bdf8",
  },
  {
    name: "Vercel",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M24 22.525H0l12-21.05 12 21.05z" />
      </svg>
    ),
    color: "#ffffff",
  },
  {
    name: "Git",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M23.546 10.93L13.067.452c-.604-.603-1.582-.603-2.188 0L8.708 2.627l2.76 2.76c.645-.215 1.379-.07 1.889.441.516.515.658 1.258.438 1.9l2.658 2.66c.645-.223 1.387-.078 1.9.435.721.72.721 1.884 0 2.604-.719.719-1.881.719-2.6 0-.539-.541-.674-1.337-.404-1.996L12.86 8.955v6.525c.176.086.342.203.488.348.713.721.713 1.883 0 2.6-.719.721-1.889.721-2.609 0-.719-.719-.719-1.879 0-2.598.182-.18.387-.316.605-.406V8.835c-.217-.091-.424-.222-.6-.401-.545-.545-.676-1.342-.396-2.009L7.636 3.7.45 10.881c-.6.605-.6 1.584 0 2.189l10.48 10.477c.604.604 1.582.604 2.186 0l10.43-10.43c.605-.603.605-1.582 0-2.187" />
      </svg>
    ),
    color: "#F05032",
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
              <p className="text-sm text-muted/70 mt-2">{t.about.hero_sub}</p>
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
