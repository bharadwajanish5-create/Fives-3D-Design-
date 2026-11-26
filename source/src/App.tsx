import Nav, { Logo } from './components/Nav';
import Hero from './components/Hero';
import About from './components/About';
import LogoStrip from './components/LogoStrip';
import Services from './components/Services';
import Industries from './components/Industries';
import Philosophy from './components/Philosophy';
import Outcomes from './components/Outcomes';
import CaseStudies from './components/CaseStudies';
import Workplace from './components/Workplace';
import Footprint from './components/Footprint';
import Contact from './components/Contact';
import { nav } from './data/site';

export default function App() {
  return (
    <>
      <Nav />
      {/* anchor aliases so links from the AI in CX page (index.html#cx, #our-people …) land on the right section */}
      <i id="home" aria-hidden className="absolute top-0" />
      <main>
        <Hero />
        <LogoStrip />
        <About />
        <i id="cx" aria-hidden className="relative -top-20 block h-0" /><i id="data-services" aria-hidden className="relative -top-20 block h-0" />
        <Services />
        <Industries />
        <Outcomes />
        <CaseStudies />
        <Philosophy />
        <i id="our-people" aria-hidden className="relative -top-20 block h-0" />
        <Workplace />
        <Footprint />
        <Contact />
      </main>
      <footer className="theme-dark border-t border-white/10 bg-[#0A1322] py-10">
        <div className="wrap flex flex-wrap items-center justify-between gap-6">
          <Logo />
          <nav className="flex flex-wrap gap-5 text-[13px] text-mist">{nav.map((n) => <a key={n.label} href={n.href} className="hover:text-sun">{n.label}</a>)}</nav>
          <p className="text-[12px] text-mist-3">© 2026 Five Splash Infotech Pvt. Ltd.</p>
        </div>
      </footer>
    </>
  );
}
