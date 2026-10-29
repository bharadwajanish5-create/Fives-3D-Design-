import { useEffect, useRef, useState } from 'react';
import { philosophy } from '../data/site';
import { prefersReducedMotion } from '../lib/hooks';

const TILT = 42; // degrees the orbit plane leans back

export default function Philosophy() {
  const [active, setActive] = useState<number | null>(null);
  const stage = useRef<HTMLDivElement>(null);
  const angle = useRef(0);
  const paused = useRef(false);
  const [k, setK] = useState(1);

  // slow orbit — writes one CSS variable per frame
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setK(Math.min(1, e.contentRect.width / 560)));
    ro.observe(el);
    if (prefersReducedMotion()) return () => ro.disconnect();
    let raf = 0, last = performance.now();
    const tick = (t: number) => {
      const dt = Math.min(64, t - last); last = t;
      if (!paused.current) angle.current = (angle.current + dt * 0.009) % 360; // ~40s per turn
      el.style.setProperty('--a', String(angle.current));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  const p = active !== null ? philosophy[active] : null;
  const size = Math.round(196 * k), R = Math.round(150 * k);

  return (
    <section id="philosophy" className="theme-dark relative overflow-hidden bg-surface py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(700px 420px at 30% 60%, rgba(250,204,44,.10), transparent 70%), radial-gradient(600px 400px at 80% 30%, rgba(124,198,255,.08), transparent 70%)' }} />
      <div className="wrap relative">
        <div className="max-w-[720px]">
          <p className="eyebrow">Delivery Philosophy</p>
          <h2 className="h-display mt-5 text-[40px] sm:text-[54px]">Human <em className="accent">Intelligence</em></h2>
          <p className="mt-4 max-w-[560px] text-[16px] leading-relaxed text-muted">Engineered for operational rigor, cost resilience, and continuous service enhancement.</p>
        </div>

        <div className="relative mt-10 grid items-center gap-10 lg:grid-cols-[1.15fr_1fr]">
          <div
            ref={stage}
            className="relative mx-auto h-[420px] w-full max-w-[560px] sm:h-[480px]"
            style={{ perspective: '1100px', ['--a' as string]: '0' }}
            onMouseEnter={() => { paused.current = true; }}
            onMouseLeave={() => { paused.current = false; }}
          >
            {/* floor glow */}
            <div className="pointer-events-none absolute left-1/2 top-[58%] h-[140px] w-[78%] -translate-x-1/2 rounded-[50%] bg-sun/10 blur-2xl" />
            <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d', transform: `rotateX(${TILT}deg) rotateZ(calc(var(--a) * 1deg))` }}>
              {/* orbit track */}
              <div className="absolute left-1/2 top-1/2 rounded-full border border-dashed border-fg/20" style={{ width: R * 2 + size * 0.6, height: R * 2 + size * 0.6, transform: 'translate(-50%,-50%)' }} />
              {/* core */}
              <div className="absolute left-1/2 top-1/2" style={{ transform: `translate(-50%,-50%) rotateZ(calc(var(--a) * -1deg)) rotateX(-${TILT}deg)` }}>
                <div className="grid h-[72px] w-[72px] place-items-center rounded-full text-center text-[11px] font-bold leading-tight text-ink" style={{ background: 'radial-gradient(circle at 32% 28%, #FFF6CF, #FACC2C 45%, #C98F00)', boxShadow: '0 0 40px rgba(250,204,44,.5)' }}>AI + HI</div>
              </div>
              {philosophy.map((b, i) => {
                const t = i * 120;
                const on = active === i;
                return (
                  <div key={b.id} className="absolute left-1/2 top-1/2" style={{ transformStyle: 'preserve-3d', transform: `translate(-50%,-50%) rotateZ(${t}deg) translateX(${R}px) rotateZ(calc((${t} + var(--a)) * -1deg)) rotateX(-${TILT}deg)` }}>
                    <button
                      onClick={() => setActive(on ? null : i)}
                      aria-pressed={on}
                      className={`bubble ${on ? 'active text-ink' : 'text-fg'} grid place-items-center rounded-full p-6 text-center transition-[transform,filter] duration-500 hover:scale-[1.05] ${active !== null && !on ? 'opacity-75 saturate-50' : ''}`}
                      style={{ width: size, height: size }}
                    >
                      <span>
                        <span className="block text-[30px] font-bold tabular-nums" style={{ fontSize: Math.max(22, 30 * k) }}>{b.metric}</span>
                        <span className="h-display mt-1 block leading-[1.08]" style={{ fontSize: Math.max(16, 21 * k) }}>{b.title}</span>
                        <span className={`mt-2 block text-[10px] font-bold uppercase tracking-[0.12em] ${on ? 'text-ink/70' : 'text-muted2'}`}>{on ? 'Open' : 'Tap to open'}</span>
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="min-w-0 rounded-[28px] border border-fg/10 bg-surface2/80 p-7 backdrop-blur sm:p-9">
            {p ? (
              <div key={p.id}>
                <p className="eyebrow">{p.tag}</p>
                <h3 className="h-display mt-4 text-[34px] leading-[1.05]">{p.title}</h3>
                <p className="mt-4 text-[16px] leading-relaxed text-muted">{p.body}</p>
                <ul className="mt-6 grid gap-2.5">
                  {p.points.map((x) => <li key={x} className="flex items-center gap-3 rounded-xl border border-fg/10 px-4 py-3 text-[14px]"><span className="grid h-5 w-5 place-items-center rounded-full bg-sun text-[11px] font-bold text-ink">✓</span>{x}</li>)}
                </ul>
                <p className="mt-6 text-[13px] text-muted2"><b className="text-acc">{p.metric}</b> {p.metricLbl}</p>
              </div>
            ) : (
              <div>
                <p className="eyebrow">How we deliver</p>
                <h3 className="h-display mt-4 text-[30px] leading-[1.08]">Three habits behind every programme.</h3>
                <ul className="mt-6 grid gap-3">
                  {philosophy.map((x, i) => (
                    <li key={x.id}><button onClick={() => setActive(i)} className="flex w-full items-center justify-between gap-4 border-t border-fg/10 pt-3 text-left text-[15px] hover:text-acc"><span>{x.title}</span><span className="text-[13px] text-muted2">{x.metric}</span></button></li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
