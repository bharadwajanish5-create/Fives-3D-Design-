import { useRef } from 'react';
import { caseStudies } from '../data/site';

function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: React.PointerEvent) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 8).toFixed(2)}deg) translateZ(0)`;
    el.style.setProperty('--gx', `${(x + 0.5) * 100}%`); el.style.setProperty('--gy', `${(y + 0.5) * 100}%`);
  };
  const leave = () => { if (ref.current) ref.current.style.transform = ''; };
  return (
    <div style={{ perspective: '1200px' }} className="min-w-0">
      <div ref={ref} onPointerMove={move} onPointerLeave={leave}
        className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[20px] border-[1.5px] border-fg/10 bg-gradient-to-b from-[#F8FAFC] to-white px-[30px] py-8 shadow-[0_6px_18px_rgba(15,27,45,.04)] transition-[transform,box-shadow,border-color] duration-300 ease-out hover:border-sun hover:shadow-[0_34px_80px_rgba(15,27,45,.14)] sm:p-9"
        style={{ transformStyle: 'preserve-3d' }}>
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: 'radial-gradient(320px circle at var(--gx,50%) var(--gy,50%), rgba(250,204,44,.14), transparent 60%)' }} />
        {children}
      </div>
    </div>
  );
}

export default function CaseStudies() {
  return (
    <section id="case-studies" className="theme-light relative border-b border-fg/10 bg-surface py-[76px]">
      <div className="wrap">
        <p className="eyebrow">Verified Enterprise Impact</p>
        <h2 className="sec-title">Real Outcomes for <em className="accent">Global Brands</em></h2>
        <p className="sec-desc sec-desc-line">Tangible operational turnarounds delivered for high-growth unicorns and Fortune 500 enterprises.</p>

        <div className="mt-9 grid gap-7 lg:grid-cols-2">
          {caseStudies.map((c) => (
            <TiltCard key={c.industry}>
              <div className="relative" style={{ transform: 'translateZ(30px)' }}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="rounded-md border border-sun/50 bg-sun/20 px-2.5 py-1 text-[12px] font-bold uppercase tracking-[0.06em] text-fg">{c.industry}</span>
                  <span className="rounded-full border border-sun/60 bg-[#FFFDF5] px-3 py-1 text-[13px] font-bold text-acc">{c.kpi}</span>
                </div>
                                <blockquote className="mt-5 font-serif text-[17px] italic leading-[1.55] text-fg sm:text-[19px]">“{c.quote}”</blockquote>
              </div>
              <div className="relative mt-5" style={{ transform: 'translateZ(20px)' }}>
                <div className="flex items-center gap-3.5">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-sun bg-ink text-[14px] font-black text-sun">{c.initials}</span>
                  <div>
                    <p className="text-[14.5px] font-bold text-fg">{c.author}</p>
                    <p className="text-[12.5px] text-muted">{c.org}</p>
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap gap-2 border-t border-fg/10 pt-4">
                  {c.tags.map((t) => <span key={t} className="rounded-md border border-fg/10 bg-surface2 px-2.5 py-1 text-[12px] font-bold text-fg">{t}</span>)}
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
