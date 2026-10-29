import { useEffect, useState } from 'react';
import { nav } from '../data/site';

export function Logo() {
  return (
    <a href="#top" className="flex shrink-0 flex-col gap-1 leading-none">
      <span className="text-[26px] font-light tracking-tight text-fg">FiveS <b className="font-bold text-sun">Digital</b></span>
      <span className="w-max rounded-[3px] bg-sun px-1.5 py-[2px] text-[9px] font-bold uppercase tracking-[0.06em] text-ink">Delivering impact sustainably</span>
    </a>
  );
}

const Chevron = ({ open }: { open?: boolean }) => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={`transition-transform ${open ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9" /></svg>
);

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [sub, setSub] = useState<string | null>(null);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  return (
    <header className={`theme-dark fixed inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'border-b border-fg/10 bg-surface/90 backdrop-blur-xl' : ''}`} style={{ top: 'env(safe-area-inset-top, 0px)' }}>
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-6 py-4" style={{ paddingLeft: 'max(16px, env(safe-area-inset-left, 0px))', paddingRight: 'max(16px, env(safe-area-inset-right, 0px))' }}>
        <Logo />
        <nav className="hidden items-center gap-1 xl:flex" aria-label="Primary">
          {nav.map((n) => (
            <div key={n.label} className="group relative">
              <a href={n.href} className="flex items-center gap-1.5 rounded-full px-3 py-2 text-[14px] font-medium text-fg/85 transition hover:text-sun">
                {n.label}{n.children && <Chevron />}
              </a>
              {n.children && (
                <div className="invisible absolute left-0 top-full pt-2 opacity-0 transition duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                  <div className="theme-light w-[260px] rounded-2xl border border-fg/10 bg-surface p-2 shadow-[0_24px_60px_rgba(15,27,45,.25)]">
                    {n.children.map((c) => (
                      <a key={c.label} href={c.href} target="_blank" rel="noreferrer" className="block rounded-xl px-3.5 py-2.5 text-[14px] font-medium text-fg transition hover:bg-surface2 hover:text-acc">{c.label}</a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a href="#contact" className="btn-sun hidden !px-5 !py-2.5 !text-[14px] sm:inline-flex">Talk to us</a>
          <button className="rounded-full border border-fg/25 px-4 py-2.5 text-[13px] font-semibold xl:hidden" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? 'Close' : 'Menu'}</button>
        </div>
      </div>
      {open && (
        <div className="max-h-[75vh] overflow-y-auto pb-4 xl:hidden" style={{ paddingLeft: 'max(16px, env(safe-area-inset-left, 0px))', paddingRight: 'max(16px, env(safe-area-inset-right, 0px))' }}>
          <div className="flex flex-col rounded-2xl border border-fg/10 bg-surface2 p-2">
            {nav.map((n) => (
              <div key={n.label}>
                {n.children ? (
                  <button onClick={() => setSub(sub === n.label ? null : n.label)} aria-expanded={sub === n.label} className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-[15px] font-medium hover:bg-fg/5">{n.label}<Chevron open={sub === n.label} /></button>
                ) : (
                  <a href={n.href} onClick={() => setOpen(false)} className="block rounded-xl px-4 py-3 text-[15px] font-medium hover:bg-fg/5">{n.label}</a>
                )}
                {n.children && sub === n.label && (
                  <div className="mb-2 ml-4 border-l border-fg/15 pl-2">
                    <a href={n.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-[14px] text-sun">Go to section</a>
                    {n.children.map((c) => <a key={c.label} href={c.href} target="_blank" rel="noreferrer" className="block rounded-lg px-3 py-2 text-[14px] text-muted hover:text-fg">{c.label}</a>)}
                  </div>
                )}
              </div>
            ))}
            <a href="#contact" onClick={() => setOpen(false)} className="btn-sun mt-2 sm:hidden">Talk to us</a>
          </div>
        </div>
      )}
    </header>
  );
}
