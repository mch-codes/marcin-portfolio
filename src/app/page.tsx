import dynamic from "next/dynamic";
import Navigation from "@/components/Navigation";
import About from "@/components/About";

// Below-fold sections — each becomes its own JS chunk, loaded after initial paint
const AboutMe    = dynamic(() => import("@/components/AboutMe"));
const Services   = dynamic(() => import("@/components/Services"));
const Projects   = dynamic(() => import("@/components/Projects"));
const MidCta     = dynamic(() => import("@/components/MidCta"));
const Process    = dynamic(() => import("@/components/Process"));
const Contact    = dynamic(() => import("@/components/Contact"));
const Footer     = dynamic(() => import("@/components/Footer"));

export default function Home() {
  return (
    <main>
      <Navigation />

      {/* The hero clips its own overflow, so the decorative run has to live in a
          parent spanning both sections rather than inside either one. */}
      <div className="relative">
        {/* One tall run rather than a repeating tile: the drift from the photo
            across to the left can't be expressed by a background-repeat. The SVG
            carries preserveAspectRatio="none" and stretches to whatever height
            the two sections end up being. */}
        <div
          aria-hidden
          className="pointer-events-none select-none absolute z-0 inset-x-0 top-[45vh] bottom-0 overflow-hidden"
        >
          {/* Mirrors the hero grid so the run anchors to the photo's column at
              both breakpoints — the photo is centred below md and right-hand
              above it, so a baked-in percentage is wrong in one of the two.
              Widths are photo_width * 3.846, which renders the artwork's span
              exactly as wide as the photo (see scripts/river.py). */}
          <div className="mx-auto h-full max-w-6xl px-6">
            <div className="grid h-full grid-cols-1 gap-16 md:grid-cols-2 md:gap-20">
              <div className="hidden md:block" />
              <div className="relative h-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/river-narrow.svg"
                  alt=""
                  className="absolute top-0 left-1/2 h-full w-[1200px] max-w-none -translate-x-[75%] opacity-[0.12] md:hidden"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/river-wide.svg"
                  alt=""
                  className="absolute top-0 left-1/2 hidden h-full w-[1440px] max-w-none -translate-x-[75%] opacity-[0.12] md:block"
                />
              </div>
            </div>
          </div>
        </div>

        <About />
        <AboutMe />
      </div>

      <Services />
      <Projects />
      <MidCta />
      <Process />
      <Contact />
      <Footer />
    </main>
  );
}
