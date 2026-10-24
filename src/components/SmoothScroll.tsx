"use client";

import { useEffect } from "react";
import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";
import Lenis from "lenis";
import { registerLenis } from "@/lib/scroll";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Smooth scroll is motion too: under reduced motion the page keeps the
    // browser's own scrolling, and scroll.ts falls back to jumping.
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      // Under Lenis' 1.2 default: the wheel stops closer to where it lands,
      // which reads as a lighter page. This is the knob for how heavy it
      // feels; the exponential ease below only shapes the tail.
      duration: 0.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    registerLenis(lenis);

    let id = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      id = requestAnimationFrame(raf);
    };
    id = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
    };
  }, []);

  // reducedMotion="user": Framer drops transform animations (the cube turn,
  // the nav drop, the letter slide) when the OS asks for less motion, and
  // keeps the opacity fades. Without it Framer ignores the setting entirely.
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation}>{children}</LazyMotion>
    </MotionConfig>
  );
}
