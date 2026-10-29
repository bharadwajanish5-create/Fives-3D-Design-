import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { heroFeatured } from '../data/site';
import { useCountUp, useInView, prefersReducedMotion } from '../lib/hooks';

const HeroScene = lazy(() => import('../three/HeroScene'));
const metrics = heroFeatured();

function BigNumber({ value, suffix, color }: { value: number; suffix: string; color: string }) {
  const ref = useCountUp(value, { trigger: value + suffix, duration: 0.9 });
  return (
    <span className="h-display text-[44px] leading-none tabular-nums sm:text-[52px]" style={{ color }}>
      <span ref={ref}>{value}</span><span className="text-[0.55em]">{suffix}</span>
    </span>
  );
}

/** Compact two-row card: row 1 = selected metric, row 2 = the other three. */
function MetricCard({ active, onPick }: { active: number; onPick: (i: number) => void }) {
  const m = metrics[active];
  return (
    <div className="w-full max-w-[460px] overflow-hidden rounded-[22px] border border-fg/15 bg-surface/75 shadow-[0_30px_80px_rgba(0,0,0,.45)] backdrop-blur-xl">
      <div key={m.id} className="flex items-center gap-5 border-b border-fg/10 p-5" style={{ animation: 'cardIn .45s ease' }}>
        <div className="relative grid h-[76px] w-[76px] shrink-0 place-items-center rounded-2xl" style={{ background: `radial-gradient(circle at 30% 25%, #fff8, ${m.color} 55%, ${m.color}99)`, boxShadow: `0 12px 30px ${m.color}55` }}>
          <span className="absolute inset-0 rounded-2xl border border-white/40" />
          <span className="flex flex-col items-center gap-1 text-[10px] font-bold uppercase tracking-[0.1em] text-ink"><i className="h-2 w-2 animate-pulse rounded-full bg-ink" />Live</span>
        </div>
        <div className="min-w-0">
          <BigNumber value={m.value} suffix={m.suffix} color={m.color} />
          <p className="mt-1 text-[16px] font-semibold text-fg">{m.label}</p>
          <p className="mt-1 text-[13px] leading-snug text-muted">{m.detail}</p>
        </div>
      </div>
      <div className="grid grid-cols-3">
        {metrics.map((x, i) => i === active ? null : (
          <button key={x.id} onClick={() => onPick(i)} className="group min-w-0 border-r border-fg/10 px-4 py-3.5 text-left transition last:border-r-0 hover:bg-fg/[0.05]">
            <span className="flex items-center gap-2"><i className="h-2 w-2 shrink-0 rounded-full" style={{ background: x.color }} /><b className="text-[16px] tabular-nums text-fg">{x.value}{x.suffix}</b></span>
            <span className="mt-0.5 block truncate text-[12px] text-muted2 group-hover:text-fg">{x.label}</span>
          </button>
        ))}
      </div>
      <style>{'@keyframes cardIn{from{opacity:.2;transform:translateY(6px)}to{opacity:1;transform:none}}'}</style>
    </div>
  );
}

export default function Hero() {
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);
  const { ref, inView } = useInView<HTMLDivElement>();
  const timer = useRef<number>();

  // gently cycle through the four metrics until the visitor picks one
  useEffect(() => {
    if (touched || !inView || prefersReducedMotion()) return;
    timer.current = window.setInterval(() => setActive((a) => (a + 1) % metrics.length), 4500);
    return () => clearInterval(timer.current);
  }, [touched, inView]);

  const pick = (i: number | null) => { if (i === null) return; setTouched(true); setActive(i); };

  return (
    <section id="top" className="theme-dark relative overflow-hidden pb-12 pt-28 md:pt-28" style={{ background: 'linear-gradient(165deg, #1B2D47 0%, #0F1B2D 62%, #0A1322 100%)' }}>
      <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(900px 600px at 75% 35%, rgba(250,204,44,.24), transparent 60%), radial-gradient(700px 500px at 5% 100%, rgba(124,198,255,.10), transparent 60%)' }} />
      <div className="grain" />
      <div className="wrap relative grid grid-cols-1 items-center gap-6 lg:grid-cols-[0.95fr_1.2fr]">
        <div className="relative z-10 min-w-0">
          <p className="eyebrow mb-6">Human-led · AI-backed CX since 2009</p>
          <h1 className="h-display text-[39px] sm:text-[58px] lg:text-[68px]">
            Scalable CX solutions that <em className="accent">grow</em> with your business.
          </h1>
          <p className="mt-6 max-w-[520px] text-[17px] leading-relaxed text-muted">
            Human-led, AI-backed customer experience and digital operations delivered across global markets with measurable speed and social impact.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#contact" className="btn-sun">Talk to our team</a>
            <a href="#services" className="btn-ghost">See our work</a>
          </div>
        </div>

        <div className="relative min-w-0">
          <div ref={ref} className="relative h-[360px] sm:h-[460px] lg:h-[520px]">
            <Suspense fallback={<div className="absolute inset-0 grid place-items-center"><div className="h-48 w-48 rounded-full bg-sun/80 blur-[2px]" /></div>}>
              <HeroScene metrics={metrics} active={active} onSelect={pick} running={inView} />
            </Suspense>
            <p className="pointer-events-none absolute left-1/2 top-2 -translate-x-1/2 whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.14em] text-muted2">Click an object in orbit</p>
          </div>
          <div className="relative z-[40] -mt-6 flex justify-center lg:-mt-10 lg:justify-end">
            <MetricCard active={active} onPick={pick} />
          </div>
        </div>
      </div>
    </section>
  );
}
