import { lazy, Suspense, useEffect, useState } from 'react';
import { elements } from '../data/site';
import { useInView } from '../lib/hooks';

const ElementsScene = lazy(() => import('../three/ElementsScene'));

const icons: Record<string, JSX.Element> = {
  earth: <path d="M3 19 9 8l4 7 3-4 5 8Z" />,
  water: <path d="M12 3c4 5 6 8 6 11a6 6 0 0 1-12 0c0-3 2-6 6-11Z" />,
  air: <><path d="M3 9h10a3 3 0 1 0-3-3" /><path d="M3 14h15a3 3 0 1 1-3 3" /><path d="M3 19h7" /></>,
  fire: <path d="M12 2c1 4 5 6 5 11a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-4-1-6 1-10Z" />,
  space: <><circle cx="12" cy="12" r="2.6" /><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-30 12 12)" /></>,
};

export default function Workplace() {
  const [active, setActive] = useState(1);
  const [touched, setTouched] = useState(false);
  const { ref, inView } = useInView<HTMLDivElement>();
  const e = elements[active];
  const pick = (i: number) => { setTouched(true); setActive(i); };
  useEffect(() => {
    if (touched || !inView) return;
    const t = window.setInterval(() => setActive((a) => (a + 1) % elements.length), 6500);
    return () => clearInterval(t);
  }, [touched, inView]);

  return (
    <section id="people" className="theme-light relative overflow-hidden border-b border-fg/10 bg-surface py-[70px]">
      <div className="wrap">
        <p className="eyebrow">Our Workplace</p>
        <h2 className="sec-title">Inclusion driven <em className="accent">People approach</em></h2>
        <p className="sec-desc">Five Elements of Life</p>

        <div className="theme-dark mt-9 grid overflow-hidden rounded-[26px] border border-white/10 lg:grid-cols-[1.1fr_0.9fr]"
          style={{ background: 'linear-gradient(160deg,#16253B,#0B1626)', boxShadow: '0 30px 70px rgba(15,27,45,.28)' }}>
          <div className="relative">
            <div className="pointer-events-none absolute inset-0 transition-all duration-700" style={{ background: `radial-gradient(ellipse at 50% 45%, ${e.color}40 0%, transparent 62%)` }} />
            <div ref={ref} className="relative h-[340px] sm:h-[440px]">
              <Suspense fallback={null}><ElementsScene active={active} running={inView} /></Suspense>
            </div>
            {/* element selector */}
            <div className="relative flex items-start justify-center gap-3 px-4 pb-7 sm:gap-6" role="tablist" aria-label="Five elements">
              {elements.map((x, i) => (
                <button key={x.id} role="tab" aria-selected={active === i} onClick={() => pick(i)} className="group flex w-[58px] flex-col items-center gap-2 sm:w-[72px]">
                  <span className="grid h-[50px] w-[50px] place-items-center rounded-full border-[1.5px] transition-all duration-300 sm:h-14 sm:w-14"
                    style={{ borderColor: active === i ? x.color : 'rgba(255,255,255,.2)', background: active === i ? `${x.color}26` : 'transparent', color: active === i ? x.color : 'rgba(255,255,255,.65)', transform: active === i ? 'translateY(-4px) scale(1.08)' : 'none', boxShadow: active === i ? `0 8px 24px ${x.color}55` : 'none' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{icons[x.id]}</svg>
                  </span>
                  <span className="text-[11.5px] font-bold tracking-wide transition" style={{ color: active === i ? x.color : 'rgba(255,255,255,.5)' }}>{x.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex min-w-0 flex-col justify-center border-t border-white/10 p-7 sm:p-10 lg:border-l lg:border-t-0">
            <div key={e.id} style={{ animation: 'elIn .55s ease' }}>
              <p className="flex items-center gap-3 text-[12px] font-extrabold uppercase tracking-[0.16em]" style={{ color: e.color }}>
                <span className="h-[2px] w-8" style={{ background: e.color }} />{e.name}
                <span className="font-mono font-medium text-white/40">0{active + 1} / 05</span>
              </p>
              <p className="h-display mt-5 text-[64px] leading-none sm:text-[84px]" style={{ color: e.color }}>{e.stat}</p>
              <p className="mt-3 max-w-[30ch] text-[14.5px] leading-snug text-white/70">{e.statLbl}</p>
              <h3 className="h-display mt-7 text-[28px] leading-[1.1] text-white sm:text-[32px]">{e.value}</h3>
              <p className="mt-3 max-w-[44ch] text-[14.5px] leading-relaxed text-white/60">{e.body}</p>
            </div>
          </div>
        </div>
      </div>
      <style>{'@keyframes elIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}'}</style>
    </section>
  );
}
