import type Lenis from "lenis";

let _lenis: Lenis | null = null;

export function registerLenis(lenis: Lenis) {
  _lenis = lenis;
}

export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const heading = el.querySelector("h2, h3") ?? el;
  if (_lenis) {
    _lenis.scrollTo(heading as HTMLElement, { offset: -96 });
  } else {
    (heading as HTMLElement).scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export function scrollToTop() {
  if (_lenis) {
    _lenis.scrollTo(0);
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}
