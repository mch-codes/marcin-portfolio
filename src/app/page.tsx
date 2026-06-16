import dynamic from "next/dynamic";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";

// Below-fold sections — each becomes its own JS chunk, loaded after initial paint
const WhatIBuild = dynamic(() => import("@/components/WhatIBuild"));
const About      = dynamic(() => import("@/components/About"));
const Education  = dynamic(() => import("@/components/Education"));
const Projects   = dynamic(() => import("@/components/Projects"));
const Process    = dynamic(() => import("@/components/Process"));
const Contact    = dynamic(() => import("@/components/Contact"));
const Footer     = dynamic(() => import("@/components/Footer"));

export default function Home() {
  return (
    <main>
      <Navigation />
      <Hero />
      <WhatIBuild />
      <About />
      <Education />
      <Projects />
      <Process />
      <Contact />
      <Footer />
    </main>
  );
}
