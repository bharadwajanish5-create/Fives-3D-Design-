import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { philosophy } from '../data/site';
import { prefersReducedMotion } from '../lib/hooks';

export default function Philosophy() {
  const [active, setActive] = useState<number | null>(null);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!stage.current || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.float-b').forEach((el, i) => {
        gsap.to(el, { y: i % 2 ? 18 : -18, x: i === 1 ? 8 : -6, duration: 3.2 + i * 0.6, ease: 'sine.inOut', yoyo: true, repeat: -1 });
      });
    }, stage);
    const move = (e: PointerEvent) => {
      const r = stage.current!.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
      gsap.to('.par-b', { x: (i) => px * (20 + i * 14), y: (i) => py * (16 + i * 10), duration: 0.8, ease: 'power2.out' });
    };
    stage.current.addEventListener('pointermove', move);
    const el = stage.current;
    return () => { ctx.revert(); el.removeEventListener('pointermove', move); };
  }, []);

  const p = active !== null ? philosophy[active] : null;
  const sizes = ['w-[230px] h-[230px] sm:w-[280px] sm:h-[280px]', 'w-[260px] h-[260px] sm:w-[330px] sm:h-[330px]', 'w-[220px] h-[220px] sm:w-[260px] sm:h-[260px]'];

  return (
    <section id="philosophy" className="theme-dark relative overflow-hidden bg-surface py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(700px 420px at 50% 55%, rgba(124,198,255,.10), transparent 70%)' }} />
      <div className="wrap relative">
        <div className="max-w-[720px]">
          <p className="eyebrow">Delivery philosophy</p>
          <h2 className="h-display mt-5 text-[48px] sm:text-[64px]">AI for speed. <em className="accent">Human intelligence</em> for judgement.</h2>
        </div>

        <div ref={stage} className="relative mt-14 grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div className="flex flex-wrap items-center justify-center gap-6 lg:min-h-[520px] lg:justify-start">
            {philosophy.map((b, i) => (
              <div key={b.id} className="par-b">
                <button
                  onClick={() => setActive(active === i ? null : i)}
                  aria-pressed={active === i}
                  className={`float-b bubble ${active === i ? 'active text-ink' : 'text-fg'} ${sizes[i]} grid place-items-center rounded-full p-8 text-center transition-[transform,filter] duration-500 hover:scale-[1.04] ${active !== null && active !== i ? 'opacity-70 saturate-50' : ''}`}
                  style={{ marginTop: i === 1 ? 60 : 0 }}
                >
                  <span>
                    <span className="block font-mono text-[34px] font-bold tabular-nums">{b.metric}</span>
                    <span className="h-display mt-1 block text-[26px] leading-[1.05]">{b.title}</span>
                    <span className={`mt-3 block font-mono text-[10px] uppercase tracking-[0.18em] ${active === i ? 'text-ink/70' : 'text-muted2'}`}>{active === i ? 'Open' : 'Tap to open'}</span>
                  </span>
                </button>
              </div>
            ))}
          </div>

          <div className="min-w-0 rounded-[28px] border border-fg/10 bg-surface2/80 p-7 backdrop-blur sm:p-9">
            {p ? (
              <div key={p.id}>
                <p className="eyebrow">{p.tag}</p>
                <h3 className="h-display mt-4 text-[40px] leading-[1.02]">{p.title}</h3>
                <p className="mt-4 text-[16px] leading-relaxed text-muted">{p.body}</p>
                <ul className="mt-6 grid gap-2.5">
                  {p.points.map((x) => <li key={x} className="flex items-center gap-3 rounded-xl border border-fg/10 px-4 py-3 text-[14px]"><span className="grid h-5 w-5 place-items-center rounded-full bg-sun text-[11px] font-bold text-ink">✓</span>{x}</li>)}
                </ul>
                <p className="mt-6 font-mono text-[13px] text-muted2"><b className="text-acc">{p.metric}</b> {p.metricLbl}</p>
              </div>
            ) : (
              <div>
                <p className="eyebrow">How we deliver</p>
                <h3 className="h-display mt-4 text-[36px] leading-[1.05]">Three habits behind every programme.</h3>
                <ul className="mt-6 grid gap-3">
                  {philosophy.map((x, i) => (
                    <li key={x.id}><button onClick={() => setActive(i)} className="flex w-full items-center justify-between gap-4 border-t border-fg/10 pt-3 text-left text-[15px] hover:text-acc"><span>{x.title}</span><span className="font-mono text-[13px] text-muted2">{x.metric}</span></button></li>
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
