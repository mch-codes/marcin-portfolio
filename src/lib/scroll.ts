import type Lenis from "lenis";

let _lenis: Lenis | null = null;

export function registerLenis(lenis: Lenis) {
  _lenis = lenis;
}

export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (_lenis) {
    _lenis.scrollTo(el, { offset: -80 });
  } else {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export function scrollToTop() {
  if (_lenis) {
    _lenis.scrollTo(0);
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}
