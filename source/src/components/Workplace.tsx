import { lazy, Suspense, useEffect, useState } from 'react';
import { elements } from '../data/site';
import { useInView } from '../lib/hooks';

const ElementsScene = lazy(() => import('../three/ElementsScene'));

export default function Workplace() {
  const [active, setActive] = useState(1);
  const [touched, setTouched] = useState(false);
  const { ref, inView } = useInView<HTMLDivElement>();
  const e = elements[active];
  const pick = (i: number) => { setTouched(true); setActive(i); };

  // gentle auto-tour until the visitor takes over
  useEffect(() => {
    if (touched || !inView) return;
    const t = window.setInterval(() => setActive((a) => (a + 1) % elements.length), 6000);
    return () => clearInterval(t);
  }, [touched, inView]);

  return (
    <section id="people" className="theme-light relative overflow-hidden border-b border-fg/10 bg-surface py-[70px]">
      <div className="wrap">
        <p className="eyebrow">Our Workplace</p>
        <h2 className="sec-title">Inclusion driven <em className="accent">People approach</em></h2>
        <p className="sec-desc">Five Elements of Life</p>

        <div className="theme-dark mt-9 grid overflow-hidden rounded-[24px] border border-white/10 lg:grid-cols-[0.82fr_1.18fr]"
          style={{ background: `radial-gradient(ellipse at 68% 55%, ${e.color}38 0%, transparent 58%), linear-gradient(160deg,#16253B,#0B1626)`, boxShadow: '0 30px 70px rgba(15,27,45,.28)', transition: 'background .8s' }}>
          <div ref={ref} className="relative order-first h-[420px] sm:h-[500px] lg:order-last">
            <Suspense fallback={null}><ElementsScene active={active} onSelect={pick} running={inView} /></Suspense>
          </div>

          <div className="flex min-w-0 flex-col justify-center p-6 sm:p-10">
            <div key={e.id} style={{ animation: 'elIn .5s ease' }}>
              <p className="flex items-center gap-3 text-[12px] font-extrabold uppercase tracking-[0.16em]" style={{ color: e.color }}>
                <span className="h-[2px] w-8" style={{ background: e.color }} />{e.name}
                <span className="font-mono font-medium text-white/40">0{active + 1} / 05</span>
              </p>
              <h3 className="h-display mt-4 text-[32px] leading-[1.08] text-white sm:text-[38px]">{e.value}</h3>
              <div className="mt-6 flex items-center gap-4">
                <span className="h-display shrink-0 text-[50px] leading-none" style={{ color: e.color }}>{e.stat}</span>
                <span className="text-[14px] leading-snug text-white/70">{e.statLbl}</span>
              </div>
              <p className="mt-5 max-w-[44ch] text-[14.5px] leading-relaxed text-white/60">{e.body}</p>
            </div>
            <div className="mt-8 flex items-center gap-2.5" role="tablist" aria-label="Five elements">
              {elements.map((x, i) => (
                <button key={x.id} role="tab" aria-selected={active === i} aria-label={x.name} onClick={() => pick(i)}
                  className="h-2.5 rounded-full transition-all duration-500" style={{ width: active === i ? 38 : 10, background: active === i ? x.color : 'rgba(255,255,255,.25)' }} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{'@keyframes elIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}'}</style>
    </section>
  );
}
