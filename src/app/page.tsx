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
      <About />
      <AboutMe />
      <Services />
      <Projects />
      <MidCta />
      <Process />
      <Contact />
      <Footer />
    </main>
  );
}
