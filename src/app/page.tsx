import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import TechScroll from "@/components/TechScroll";
import WhatIBuild from "@/components/WhatIBuild";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Process from "@/components/Process";
import Education from "@/components/Education";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navigation />
      <Hero />
      <TechScroll />
      <WhatIBuild />
      <About />
      <Projects />
      <Process />
      <Education />
      <Contact />
      <Footer />
    </main>
  );
}
