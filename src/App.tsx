import { About } from "./components/About";
import { Contact } from "./components/Contact";
import { Experience } from "./components/Experience";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Practice } from "./components/Practice";
import { Principles } from "./components/Principles";
import { Skills } from "./components/Skills";
import { Work } from "./components/Work";

export default function App() {
  return (
    <>
      <a
        href="#main"
        className="absolute -top-16 left-4 z-[100] rounded-md bg-accent px-3.5 py-2.5 font-semibold text-accent-ink focus:top-3 print:hidden"
      >
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Work />
        <Experience />
        <Principles />
        <Skills />
        <About />
        <Practice />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
