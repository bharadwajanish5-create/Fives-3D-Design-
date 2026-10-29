import { useEffect, useState } from 'react';
import { nav } from '../data/site';

export function Logo() {
  return (
    <a href="#top" className="flex flex-col gap-1 leading-none">
      <span className="text-[26px] font-light tracking-tight text-fg">FiveS <b className="font-bold text-acc">Digital</b></span>
      <span className="w-max rounded-[3px] bg-sun px-1.5 py-[2px] text-[9px] font-bold uppercase tracking-[0.06em] text-ink">Delivering impact sustainably</span>
    </a>
  );
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <header className={`theme-dark fixed inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'border-b border-fg/10 bg-surface/85 backdrop-blur-xl' : ''}`} style={{ top: 'env(safe-area-inset-top, 0px)' }}>
      <div className="wrap flex items-center justify-between gap-6 py-4">
        <Logo />
        <nav className="hidden items-center gap-7 text-[14px] font-medium text-fg/80 lg:flex">
          {nav.map((n) => <a key={n.href} href={n.href} className="transition hover:text-acc">{n.label}</a>)}
        </nav>
        <div className="flex items-center gap-3">
          <a href="#contact" className="btn-sun hidden sm:inline-flex !px-5 !py-2.5 !text-[14px]">Talk to us</a>
          <button className="rounded-full border border-fg/25 px-4 py-2.5 text-[13px] font-semibold lg:hidden" aria-expanded={open} onClick={() => setOpen(!open)}>Menu</button>
        </div>
      </div>
      {open && (
        <div className="wrap pb-4 lg:hidden">
          <div className="flex flex-col rounded-2xl border border-fg/10 bg-surface2 p-2">
            {nav.map((n) => <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-[15px] hover:bg-fg/5">{n.label}</a>)}
          </div>
        </div>
      )}
    </header>
  );
}
