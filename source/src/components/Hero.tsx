import { lazy, Suspense, useState } from 'react';
import { heroMetrics } from '../data/site';
import { useCountUp, useInView } from '../lib/hooks';

const HeroScene = lazy(() => import('../three/HeroScene'));

function BigNumber({ value, suffix, color }: { value: number; suffix: string; color: string }) {
  const ref = useCountUp(value, { trigger: value + suffix, duration: 1.1 });
  return (
    <div className="h-display text-[64px] sm:text-[84px] tabular-nums" style={{ color }}>
      <span ref={ref}>{value}</span>
      <span className="text-[0.55em]">{suffix}</span>
    </div>
  );
}

export default function Hero() {
  const [active, setActive] = useState<number | null>(null);
  const { ref, inView } = useInView<HTMLDivElement>();
  const m = active !== null ? heroMetrics[active] : null;

  return (
    <section id="top" className="theme-dark relative overflow-hidden pb-10 pt-28 md:pt-32" style={{ background: 'linear-gradient(165deg, #1B2D47 0%, #0F1B2D 62%, #0A1322 100%)' }}>
      <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(900px 600px at 75% 35%, rgba(250,204,44,.24), transparent 60%), radial-gradient(700px 500px at 5% 100%, rgba(124,198,255,.10), transparent 60%)' }} />
      <div className="grain" />
      <div className="wrap relative grid grid-cols-1 items-center gap-6 lg:grid-cols-[1fr_1.15fr]">
        <div className="relative z-10 min-w-0">
          <p className="eyebrow mb-6">Human-led · AI-backed CX since 2009</p>
          <h1 className="h-display text-[46px] sm:text-[72px] lg:text-[88px]">
            Scalable CX that <em className="accent">grows</em> with your business.
          </h1>
          <p className="mt-6 max-w-[520px] text-[17px] leading-relaxed text-muted">
            Customer experience, digital operations and AI data services, delivered from 9+ cities with measurable speed and social impact.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#contact" className="btn-sun">Talk to our team</a>
            <a href="#services" className="btn-ghost">Explore services</a>
          </div>
        </div>

        <div ref={ref} className="relative min-w-0 h-[420px] sm:h-[540px] lg:h-[620px]">
          <Suspense fallback={<div className="absolute inset-0 grid place-items-center"><div className="h-48 w-48 rounded-full bg-sun/80 blur-[2px]" /></div>}>
            <HeroScene metrics={heroMetrics} active={active} onSelect={setActive} running={inView} />
          </Suspense>
          <p className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.2em] text-muted2">
            {active === null ? 'Click an object to open its number' : 'Click empty space to release'}
          </p>
        </div>
      </div>

      {/* live counters — selector + detail */}
      <div className="wrap relative mt-4">
        <div className="grid overflow-hidden rounded-[28px] border border-fg/10 bg-surface2/80 backdrop-blur lg:grid-cols-[1.1fr_1fr]">
          <div className="min-w-0 border-b border-fg/10 p-6 sm:p-8 lg:border-b-0 lg:border-r">
            <div className="flex items-center justify-between gap-4">
              <p className="eyebrow">Live operations</p>
              <span className="flex items-center gap-2 font-mono text-[11px] text-muted2"><i className="h-2 w-2 animate-pulse rounded-full bg-leaf" /> Updated from programme data</span>
            </div>
            {m ? (
              <div className="mt-4">
                <BigNumber value={m.value} suffix={m.suffix} color={m.color} />
                <p className="mt-1 text-[20px] font-semibold">{m.label}</p>
                <p className="mt-2 max-w-[440px] text-[15px] leading-relaxed text-muted">{m.detail}</p>
              </div>
            ) : (
              <div className="mt-4">
                <div className="h-display text-[44px] sm:text-[56px] text-fg">Six numbers, <em className="accent">one</em> operation.</div>
                <p className="mt-3 max-w-[440px] text-[15px] leading-relaxed text-muted">Each object in orbit is a live programme. Pick one in the scene or from the list to bring its number forward.</p>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3">
            {heroMetrics.map((x, i) => (
              <button
                key={x.id}
                onClick={() => setActive(active === i ? null : i)}
                aria-pressed={active === i}
                className={`group relative min-w-0 border-b border-r border-fg/10 p-4 text-left transition sm:p-5 ${active === i ? 'bg-fg/[0.06]' : 'hover:bg-fg/[0.03]'}`}
              >
                <span className="absolute left-0 top-0 h-full w-[3px] transition" style={{ background: active === i ? x.color : 'transparent' }} />
                <span className="block font-mono text-[22px] font-bold tabular-nums" style={{ color: x.color }}>{x.value}{x.suffix}</span>
                <span className="mt-1 block text-[13px] leading-snug text-muted">{x.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
