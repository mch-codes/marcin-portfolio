import type Lenis from "lenis";

let _lenis: Lenis | null = null;

export function registerLenis(lenis: Lenis) {
  _lenis = lenis;
}

/* Per-call, not on the Lenis instance: the instance duration also governs the
   wheel, and slowing that makes the whole page feel laggy under the hand. A
   click is a different gesture — it asks for a journey, not a nudge. */
const CLICK_DURATION = 2;

export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const heading = el.querySelector("h2, h3") ?? el;
  if (_lenis) {
    _lenis.scrollTo(heading as HTMLElement, { offset: -96, duration: CLICK_DURATION });
  } else {
    (heading as HTMLElement).scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export function scrollToTop() {
  if (_lenis) {
    _lenis.scrollTo(0, { duration: CLICK_DURATION });
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}
