import { lazy, Suspense, useRef, useState } from 'react';
import { heroFeatured } from '../data/site';
import { useCountUp, useInView } from '../lib/hooks';

const HeroScene = lazy(() => import('../three/HeroScene'));
const metrics = heroFeatured();

const iconPaths: Record<string, JSX.Element> = {
  voice: <><path d="M4 14v-2a8 8 0 0 1 16 0v2" /><rect x="2.5" y="13" width="4" height="6.5" rx="1.6" /><rect x="17.5" y="13" width="4" height="6.5" rx="1.6" /><path d="M19.5 19.5c0 1.5-1.6 2.2-4 2.2h-2" /></>,
  chats: <><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.5-4.6A8 8 0 1 1 21 12Z" /><path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01" strokeWidth="2.6" /></>,
  quality: <><path d="M12 3 5 6v5.5c0 4.4 2.9 7.9 7 9.5 4.1-1.6 7-5.1 7-9.5V6l-7-3Z" /><path d="m8.6 12 2.4 2.4 4.4-4.8" /></>,
  returns: <><path d="m3.5 8 8.5-4.5L20.5 8v8L12 20.5 3.5 16V8Z" /><path d="m3.5 8 8.5 4.5L20.5 8M12 12.5v8" /></>,
};

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
      <div key={m.id} className="flex items-center gap-4 border-b border-fg/10 p-4 sm:gap-5 sm:p-5" style={{ animation: 'cardIn .45s ease' }}>
        <div className="relative grid h-[76px] w-[76px] shrink-0 place-items-center rounded-2xl" style={{ background: `radial-gradient(circle at 30% 25%, #fff8, ${m.color} 55%, ${m.color}99)`, boxShadow: `0 12px 30px ${m.color}55` }}>
          <span className="absolute inset-0 rounded-2xl border border-white/40" />
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#0C1526" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">{iconPaths[m.id]}</svg>
        </div>
        <div className="min-w-0">
          <BigNumber value={m.value} suffix={m.suffix} color={m.color} />
          <p className="mt-1 text-[16px] font-semibold text-fg">{m.label}</p>
          <p className="mt-1 hidden text-[13px] leading-snug text-muted sm:block">{m.detail}</p>
        </div>
      </div>
      <div className="grid grid-cols-3">
        {metrics.map((x, i) => i === active ? null : (
          <button key={x.id} onClick={() => onPick(i)} className="group min-w-0 border-r border-fg/10 px-3 py-3 sm:px-4 sm:py-3.5 text-left transition last:border-r-0 hover:bg-fg/[0.05]">
            <span className="flex items-center gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={x.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">{iconPaths[x.id]}</svg><b className="text-[16px] tabular-nums text-fg">{x.value}{x.suffix}</b></span>
            <span className="mt-0.5 block truncate text-[12px] text-muted2 group-hover:text-fg">{x.label}</span>
          </button>
        ))}
      </div>
      <style>{'@keyframes cardIn{from{opacity:.2;transform:translateY(6px)}to{opacity:1;transform:none}}'}</style>
    </div>
  );
}

export default function Hero() {
  const [active, setActive] = useState<number | null>(null);   // clicked
  const [hovered, setHovered] = useState<number | null>(null); // pointer over an icon
  const [overCard, setOverCard] = useState(false);
  const { ref, inView } = useInView<HTMLDivElement>();
  const timer = useRef<number>();
  const last = useRef(0);

  const shown = hovered ?? active;
  if (shown !== null) last.current = shown;
  const visible = shown !== null || overCard;

  const onHover = (i: number | null) => {
    clearTimeout(timer.current);
    if (i === null) timer.current = window.setTimeout(() => setHovered(null), 280);
    else setHovered(i);
  };
  const pick = (i: number | null) => { setActive(i); setHovered(i); if (i === null) setOverCard(false); };

  return (
    <section id="top" className="theme-dark relative overflow-hidden pb-12 pt-28 md:pt-28" style={{ background: 'linear-gradient(165deg, #1B2D47 0%, #0F1B2D 62%, #0A1322 100%)' }}>
      <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(900px 600px at 75% 35%, rgba(250,204,44,.24), transparent 60%), radial-gradient(700px 500px at 5% 100%, rgba(124,198,255,.10), transparent 60%)' }} />
      <div className="grain" />
      <div className="wrap relative grid grid-cols-1 items-center gap-6 lg:grid-cols-[0.95fr_1.2fr]">
        <div className="relative z-10 min-w-0">
          <h1 className="h-display text-[39px] sm:text-[48px] lg:text-[58px]">
            Scalable CX solutions that grow with your business.
          </h1>
          <p className="mt-6 max-w-[540px] text-[16.5px] leading-[1.68] text-muted">
            Human-led, AI-backed customer experience and digital operations delivered across global markets with measurable speed and social impact.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#contact" className="btn-sun">Talk to our team</a>
            <a href="#services" className="btn-ghost">See our work</a>
          </div>
        </div>

        <div className="relative min-w-0">
          <div ref={ref} className="relative h-[330px] sm:h-[480px] lg:h-[540px]">
            <Suspense fallback={<div className="absolute inset-0 grid place-items-center"><div className="h-48 w-48 rounded-full bg-sun/80 blur-[2px]" /></div>}>
              <HeroScene metrics={metrics} active={active} onSelect={pick} onHover={onHover} running={inView} />
            </Suspense>
          </div>
            {/* details card — only while an icon is hovered or selected */}
            <div className={`pointer-events-none z-[40] flex justify-center transition-all duration-300 max-lg:relative max-lg:-mt-2 max-lg:overflow-hidden lg:absolute lg:inset-x-0 lg:bottom-0 lg:justify-end ${visible ? 'max-lg:max-h-[300px]' : 'max-lg:max-h-0'}`}>
              <div
                onMouseEnter={() => { clearTimeout(timer.current); setOverCard(true); }}
                onMouseLeave={() => { setOverCard(false); onHover(null); }}
                className={`w-full max-w-[460px] transition-all duration-300 ${visible ? 'pointer-events-auto translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}>
                <MetricCard active={last.current} onPick={(i) => { setActive(i); setHovered(i); }} />
              </div>
            </div>
        </div>
      </div>
    </section>
  );
}
