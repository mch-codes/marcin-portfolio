import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import TechScroll from "@/components/TechScroll";
import WhatIBuild from "@/components/WhatIBuild";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Testimonials from "@/components/Testimonials";
import Process from "@/components/Process";
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
      <Testimonials />
      <Process />
      <Contact />
      <Footer />
    </main>
  );
}
