import Nav, { Logo } from './components/Nav';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Industries from './components/Industries';
import Philosophy from './components/Philosophy';
import Workplace from './components/Workplace';
import Footprint from './components/Footprint';
import Contact from './components/Contact';
import { nav } from './data/site';

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Services />
        <Industries />
        <Philosophy />
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
