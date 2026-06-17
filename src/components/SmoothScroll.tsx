"use client";

import { useEffect } from "react";
import { LazyMotion, domAnimation } from "framer-motion";
import Lenis from "lenis";
import { registerLenis } from "@/lib/scroll";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    registerLenis(lenis);

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}
